/**
 * FIND:provide
 * TAG:idb-fs,opfs
 *
 * Virtual-FS `provide()` pieces: files, directories, and host backends.
 *
 * WHY: `provide` used to mean "OPFS `/user/` file or HTTP". Callers now need
 * `/idb/`, `/mounts/`, and Capacitor `/sdcard/` `/saf/` — plus directory
 * listings, not only `File`. Handle walking stays here so lure does not
 * import fl.ui; Explorer registers native roots via `registerProvideBackend`.
 *
 * INVARIANT: a directory result is never a `Blob`/`File`. Use
 * `isProvidedDirectory` / `asProvidedFile` at call sites that still want bytes.
 */

import { stripStorageScopePrefix } from "@fest-lib/core";

export type ProvideEntry = {
    name: string;
    kind: "file" | "directory";
    path: string;
};

export type ProvidedDirectory = {
    kind: "directory";
    name: string;
    path: string;
    handle?: any;
    entries: ProvideEntry[];
};

export type ProvideResult = File | FileSystemWritableFileStream | ProvidedDirectory | null;

export type ProvideBackend = {
    root: string;
    list(path: string): Promise<ProvideEntry[]>;
    readFile?(path: string): Promise<File | null>;
    writeFile?(path: string, file: File): Promise<boolean | void>;
};

export type ProvideOptions = {
    asDirectory?: boolean;
};

const provideBackends = new Map<string, ProvideBackend>();

const normalizeRoot = (root: string): string => {
    const raw = String(root || "").trim() || "/";
    if (raw === "/") return "/";
    return raw.endsWith("/") ? raw : `${raw}/`;
};

export const isProvidedDirectory = (value: unknown): value is ProvidedDirectory =>
    !!value
    && typeof value === "object"
    && !(value instanceof Blob)
    && (value as ProvidedDirectory).kind === "directory"
    && Array.isArray((value as ProvidedDirectory).entries);

export const asProvidedFile = (value: unknown): File | null => {
    if (typeof File !== "undefined" && value instanceof File) return value;
    return null;
};

export const registerProvideBackend = (backend: ProvideBackend): void => {
    if (!backend?.root || typeof backend.list !== "function") return;
    provideBackends.set(normalizeRoot(backend.root), backend);
};

export const unregisterProvideBackend = (root: string): void => {
    provideBackends.delete(normalizeRoot(root));
};

export const matchProvideBackend = (path: string): ProvideBackend | null => {
    let p = String(path || "").trim() || "/";
    if (!p.startsWith("/")) p = `/${p}`;
    let best: ProvideBackend | null = null;
    let bestLen = -1;
    for (const [root, backend] of provideBackends) {
        if (root === "/") continue;
        if (p === root.slice(0, -1) || p === root || p.startsWith(root)) {
            if (root.length > bestLen) {
                best = backend;
                bestLen = root.length;
            }
        }
    }
    return best;
};

export const stripProvideRootPrefix = (path: string, root: string): string => {
    const normalized = String(path || "").trim() || "/";
    const key = normalizeRoot(root);
    if (key === "/") return normalized.startsWith("/") ? normalized : `/${normalized}`;
    if (normalized === key.slice(0, -1) || normalized === key) return "/";
    if (normalized.startsWith(key)) return `/${normalized.slice(key.length)}`.replace(/\/{2,}/g, "/") || "/";
    return stripStorageScopePrefix(normalized);
};

export const wantsDirectoryProvide = (path: string, options?: ProvideOptions): boolean => {
    if (options?.asDirectory) return true;
    const raw = String(path || "").trim();
    if (!raw || raw.endsWith("/")) return true;
    const p = raw.replace(/\/+$/, "");
    return p === "/user" || p === "/idb" || p === "/sdcard" || p === "/saf"
        || p === "/mounts" || p === "/desktop" || p === "/assets";
};

const isDirHandle = (handle: any): boolean =>
    !!handle && handle.kind === "directory" && typeof handle.getDirectoryHandle === "function";

const childVirtualPath = (dirPath: string, name: string, kind: "file" | "directory"): string => {
    const base = String(dirPath || "/").endsWith("/") ? dirPath : `${dirPath}/`;
    return `${base}${name}${kind === "directory" ? "/" : ""}`;
};

export const listHandleEntries = async (dir: any, dirPath: string): Promise<ProvideEntry[]> => {
    if (!dir?.entries) return [];
    const entries: ProvideEntry[] = [];
    try {
        for await (const [name, handle] of dir.entries()) {
            const kind = handle?.kind === "directory" ? "directory" : "file";
            entries.push({ name: String(name), kind, path: childVirtualPath(dirPath, String(name), kind) });
        }
    } catch {
        return [];
    }
    return entries;
};

export const toProvidedDirectory = async (path: string, handle: any): Promise<ProvidedDirectory> => {
    const normalized = String(path || "/").trim() || "/";
    const dirPath = normalized.endsWith("/") || normalized === "/" ? normalized : `${normalized}/`;
    const name = dirPath.split("/").filter(Boolean).pop() || dirPath.replace(/\//g, "") || "root";
    return {
        kind: "directory",
        name,
        path: dirPath,
        handle,
        entries: await listHandleEntries(handle, dirPath)
    };
};

const walkHandle = async (
    root: any,
    rel: string,
    asDirectory: boolean,
    create: boolean
): Promise<any> => {
    const parts = String(rel || "/").split("/").filter(Boolean);
    let dir = root;
    const fileName = asDirectory ? null : parts.pop();
    for (const part of parts) {
        dir = await dir?.getDirectoryHandle?.(part, { create });
        if (!dir) return null;
    }
    if (!fileName) return dir;
    return dir?.getFileHandle?.(fileName, { create }) ?? null;
};

export const provideFromHandle = async (
    root: any,
    virtualPath: string,
    mappedRoot: string,
    rw = false,
    options?: ProvideOptions
): Promise<ProvideResult> => {
    if (!isDirHandle(root)) return null;
    const asDir = wantsDirectoryProvide(virtualPath, options);
    const rel = stripProvideRootPrefix(virtualPath, mappedRoot);
    if (asDir) {
        const dir = await walkHandle(root, rel, true, !!rw).catch(() => null);
        if (!dir) return null;
        return toProvidedDirectory(virtualPath, dir);
    }
    const fileHandle = await walkHandle(root, rel, false, !!rw).catch(() => null);
    if (fileHandle?.kind === "file" || typeof fileHandle?.getFile === "function") {
        if (rw) return fileHandle.createWritable?.() ?? null;
        return await fileHandle.getFile?.() ?? null;
    }
    const dir = await walkHandle(root, rel, true, false).catch(() => null);
    if (dir) return toProvidedDirectory(virtualPath, dir);
    return null;
};

const writableFromBackend = (backend: ProvideBackend, path: string) => {
    const chunks: BlobPart[] = [];
    return {
        async write(data: any) {
            const chunk = data && typeof data === "object" && "data" in data ? data.data : data;
            chunks.push(chunk);
        },
        async seek() { /* buffer */ },
        async truncate() { chunks.length = 0; },
        async abort() { chunks.length = 0; },
        async close() {
            const name = path.split("/").filter(Boolean).pop() || "file";
            const file = new File([new Blob(chunks)], name);
            await backend.writeFile?.(path, file);
        }
    };
};

export const provideFromBackend = async (
    backend: ProvideBackend,
    virtualPath: string,
    rw = false,
    options?: ProvideOptions
): Promise<ProvideResult> => {
    const asDir = wantsDirectoryProvide(virtualPath, options);
    if (asDir) {
        const entries = await backend.list(virtualPath).catch(() => []);
        const dirPath = virtualPath.endsWith("/") ? virtualPath : `${virtualPath}/`;
        return {
            kind: "directory",
            name: dirPath.split("/").filter(Boolean).pop() || backend.root.replace(/\//g, ""),
            path: dirPath,
            entries
        };
    }
    if (rw && backend.writeFile) {
        return writableFromBackend(backend, virtualPath) as unknown as FileSystemWritableFileStream;
    }
    return (await backend.readFile?.(virtualPath).catch(() => null)) ?? null;
};
