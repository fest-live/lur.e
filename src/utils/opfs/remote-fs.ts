/*
 * Filename: remote-fs.ts
 * FullPath: modules/projects/lur.e/src/utils/opfs/remote-fs.ts
 * FIND:mounted-fs
 * TAG:provide,opfs
 *
 * Browser client for backend-mounted FS (`/assets/` and extra allowed roots).
 * HTTPS first (always quiet). WS / Socket.IO only when the mounts probe
 * advertises them — a speculative `new WebSocket` always logs
 * `WebSocket connection failed` in Chromium when `/ssre/fs/ws` is down.
 */

import {
    MOUNTED_FS_EVENT,
    MOUNTED_FS_HTTP_PATH,
    MOUNTED_FS_WS_PATH,
    createMountedFsId,
    isMountedFsResponse,
    type MountedFsRequest,
    type MountedFsResponse
} from "@fest-lib/core";
import {
    registerProvideBackend,
    type ProvideBackend,
    type ProvideEntry
} from "./provide";

export type RemoteFsTransport = {
    request(req: Omit<MountedFsRequest, "t" | "id"> & { id?: string }): Promise<MountedFsResponse>;
};

const decodeBase64 = (body: string): Uint8Array => {
    if (typeof Buffer !== "undefined") return new Uint8Array(Buffer.from(body, "base64"));
    const bin = atob(body);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
};

const fileFromResponse = (resp: MountedFsResponse): File | null => {
    if (!resp.ok || !resp.file?.body) return null;
    const bytes = resp.file.encoding === "utf8"
        ? new TextEncoder().encode(resp.file.body)
        : decodeBase64(resp.file.body);
    return new File([bytes], resp.file.name || "file", { type: resp.file.type || "" });
};

export const createHttpsFsTransport = (httpPath = MOUNTED_FS_HTTP_PATH): RemoteFsTransport => ({
    async request(req) {
        const id = req.id || createMountedFsId();
        const r = await fetch(httpPath, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ t: "fs", id, ...req })
        });
        const json = await r.json().catch(() => null);
        if (!isMountedFsResponse(json)) {
            return { t: "fs-result", id, ok: false, error: `https ${r.status}` };
        }
        return json;
    }
});

export const createWebSocketFsTransport = (socket: WebSocket): RemoteFsTransport => {
    const pending = new Map<string, (resp: MountedFsResponse) => void>();
    socket.addEventListener("message", (ev) => {
        const raw = typeof ev.data === "string" ? ev.data : "";
        let parsed: unknown = null;
        try { parsed = JSON.parse(raw); } catch { return; }
        if (!isMountedFsResponse(parsed)) return;
        pending.get(parsed.id)?.(parsed);
        pending.delete(parsed.id);
    });
    return {
        request(req) {
            const id = req.id || createMountedFsId();
            return new Promise((resolve, reject) => {
                if (socket.readyState !== 1) {
                    reject(new Error("ws closed"));
                    return;
                }
                pending.set(id, resolve);
                socket.send(JSON.stringify({ t: "fs", id, ...req }));
                setTimeout(() => {
                    if (pending.delete(id)) reject(new Error("ws timeout"));
                }, 8000);
            });
        }
    };
};

export const createSocketIoFsTransport = (socket: { emit: Function; on: Function }, event = MOUNTED_FS_EVENT): RemoteFsTransport => ({
    request(req) {
        const id = req.id || createMountedFsId();
        const payload = { t: "fs", id, ...req };
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => reject(new Error("sio timeout")), 8000);
            const finish = (resp: unknown) => {
                clearTimeout(timer);
                if (isMountedFsResponse(resp)) resolve(resp);
                else reject(new Error("sio bad reply"));
            };
            try {
                socket.emit(event, payload, finish);
            } catch {
                socket.emit(event, payload);
                const onMsg = (data: unknown) => {
                    if (isMountedFsResponse(data) && data.id === id) {
                        socket.on === undefined;
                        finish(data);
                    }
                };
                socket.on(event, onMsg);
            }
        });
    }
});

const wsUrlFromHttp = (httpPath: string): string => {
    const origin = typeof location !== "undefined" ? location.origin : "http://localhost";
    const url = new URL(httpPath.replace(/\/+$/, "") + "/ws", origin);
    url.pathname = MOUNTED_FS_WS_PATH;
    url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
    return url.toString();
};

const tryOpenWebSocket = (url: string, timeoutMs = 1500): Promise<WebSocket | null> =>
    new Promise((resolve) => {
        if (typeof WebSocket === "undefined") {
            resolve(null);
            return;
        }
        let settled = false;
        const done = (socket: WebSocket | null) => {
            if (settled) return;
            settled = true;
            resolve(socket);
        };
        try {
            const socket = new WebSocket(url);
            const timer = setTimeout(() => {
                try { socket.close(); } catch { /* ignore */ }
                done(null);
            }, timeoutMs);
            socket.addEventListener("open", () => {
                clearTimeout(timer);
                done(socket);
            });
            socket.addEventListener("error", () => {
                clearTimeout(timer);
                done(null);
            });
        } catch {
            done(null);
        }
    });

const tryOpenSocketIo = async (): Promise<RemoteFsTransport | null> => {
    const io = (globalThis as { io?: (url?: string, opts?: object) => any }).io;
    if (typeof io !== "function") return null;
    try {
        const socket = io({ path: "/socket.io", transports: ["websocket", "polling"] });
        if (!socket) return null;
        await new Promise<void>((resolve, reject) => {
            const timer = setTimeout(() => reject(new Error("sio connect")), 1500);
            socket.on?.("connect", () => {
                clearTimeout(timer);
                resolve();
            });
            socket.on?.("connect_error", () => {
                clearTimeout(timer);
                reject(new Error("sio connect"));
            });
        }).catch(() => {
            socket.close?.();
            throw new Error("sio connect");
        });
        return createSocketIoFsTransport(socket);
    } catch {
        return null;
    }
};

export const connectRemoteMountedFs = async (options?: {
    httpPath?: string;
    wsUrl?: string;
}): Promise<RemoteFsTransport | null> => {
    const httpPath = options?.httpPath || MOUNTED_FS_HTTP_PATH;
    const https = createHttpsFsTransport(httpPath);
    const probe = await https.request({ op: "mounts" }).catch(() => null);
    if (!probe?.ok) return null;

    // WHY: Chromium always prints `WebSocket connection failed` for a closed
    // `/ssre/fs/ws`. Only dial when the host advertises `ws` or the caller
    // passed an explicit URL.
    if (options?.wsUrl || probe.ws === true) {
        const ws = await tryOpenWebSocket(options?.wsUrl || wsUrlFromHttp(httpPath));
        if (ws) {
            const transport = createWebSocketFsTransport(ws);
            const wsProbe = await transport.request({ op: "mounts" }).catch(() => null);
            if (wsProbe?.ok) return transport;
            try { ws.close(); } catch { /* ignore */ }
        }
    }

    if (probe.socketio === true) {
        const sio = await tryOpenSocketIo();
        if (sio) {
            const sioProbe = await sio.request({ op: "mounts" }).catch(() => null);
            if (sioProbe?.ok) return sio;
        }
    }

    return https;
};

export const createRemoteProvideBackend = (root: string, transport: RemoteFsTransport): ProvideBackend => ({
    root,
    async list(path) {
        const resp = await transport.request({ op: "list", path });
        if (!resp.ok) return [];
        return (resp.entries ?? []) as ProvideEntry[];
    },
    async readFile(path) {
        const resp = await transport.request({ op: "read", path });
        return fileFromResponse(resp);
    },
    async writeFile(path, file) {
        const buf = new Uint8Array(await file.arrayBuffer());
        const body = typeof Buffer !== "undefined"
            ? Buffer.from(buf).toString("base64")
            : btoa(String.fromCharCode(...buf));
        const resp = await transport.request({
            op: "write",
            path,
            file: { name: file.name, type: file.type || "", encoding: "base64", body }
        });
        if (!resp.ok) throw new Error(resp.error || "remote write failed");
        return true;
    }
});

let remoteTransport: Promise<RemoteFsTransport | null> | null = null;

export const ensureRemoteMountedFs = (): Promise<RemoteFsTransport | null> => {
    remoteTransport ??= connectRemoteMountedFs().then((transport) => {
        if (!transport) return null;
        return transport.request({ op: "mounts" }).then((resp) => {
            if (!resp.ok) return transport;
            for (const mount of resp.mounts ?? []) {
                registerProvideBackend(createRemoteProvideBackend(mount.virtual, transport));
            }
            return transport;
        }).catch(() => transport);
    }).catch(() => null);
    return remoteTransport;
};

export const tryRemoteMountedList = async (path: string): Promise<ProvideEntry[] | null> => {
    const transport = await ensureRemoteMountedFs();
    if (!transport) return null;
    const resp = await transport.request({ op: "list", path }).catch(() => null);
    if (!resp?.ok) return null;
    return resp.entries ?? [];
};

export const tryRemoteMountedRead = async (path: string): Promise<File | null> => {
    const transport = await ensureRemoteMountedFs();
    if (!transport) return null;
    const resp = await transport.request({ op: "read", path }).catch(() => null);
    if (!resp) return null;
    return fileFromResponse(resp);
};
