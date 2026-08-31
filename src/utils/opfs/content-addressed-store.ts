/**
 * Content-addressed OPFS storage for durable local application state.
 *
 * FIND:opfs-content-store
 * WHY: A manifest can safely reference immutable blobs without serializing
 * File data into localStorage or duplicating equal clipboard/drop payloads.
 */

export type StoredBlobRef = {
    hash: string;
    path: string;
    name: string;
    type: string;
    size: number;
    lastModified: number;
};

export interface ContentStoreBackend {
    read(path: string): Promise<Blob | null>;
    write(path: string, data: Blob | string): Promise<void>;
    removeTree(prefix: string): Promise<void>;
}

export interface ContentAddressedStore {
    put(file: File): Promise<StoredBlobRef>;
    get(ref: StoredBlobRef): Promise<File | null>;
    readJson<T>(path: string): Promise<T | null>;
    writeJson(path: string, value: unknown): Promise<void>;
    clear(prefix?: string): Promise<void>;
}

const normalizeNamespace = (namespace: string): string => {
    const segments = String(namespace || "")
        .split("/")
        .filter(Boolean);
    if (!segments.length || segments.some((segment) => segment === "." || segment === "..")) {
        throw new Error("A non-empty safe storage namespace is required");
    }
    return `/${segments.join("/")}`;
};

const toSafePath = (namespace: string, candidate = ""): string => {
    const raw = String(candidate || "").trim();
    const full = raw.startsWith("/") ? raw : `${namespace}/${raw}`;
    const segments = full.split("/").filter(Boolean);
    if (!segments.length || segments.some((segment) => segment === "." || segment === "..")) {
        throw new Error("Unsafe OPFS storage path");
    }
    const normalized = `/${segments.join("/")}`;
    if (normalized !== namespace && !normalized.startsWith(`${namespace}/`)) {
        throw new Error("Storage path escapes its namespace");
    }
    return normalized;
};

const toHex = (bytes: ArrayBuffer): string =>
    [...new Uint8Array(bytes)]
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");

/** SHA-256 file identity, stable across filename and MIME changes. */
export const hashBlob = async (blob: Blob): Promise<string> => {
    if (!globalThis.crypto?.subtle) {
        throw new Error("Web Crypto is required for content-addressed storage");
    }
    return toHex(await globalThis.crypto.subtle.digest("SHA-256", await blob.arrayBuffer()));
};

let nativeBackendPromise: Promise<ContentStoreBackend> | null = null;

const getNativeBackend = (): Promise<ContentStoreBackend> => {
    nativeBackendPromise ??= import("./OPFS").then(({ readFile, removeFile, writeFile }) => ({
        async read(path: string): Promise<Blob | null> {
            return (await readFile(null, path).catch(() => null)) as Blob | null;
        },
        async write(path: string, data: Blob | string): Promise<void> {
            const blob = typeof data === "string"
                ? new Blob([data], { type: "application/json" })
                : data;
            const written = await writeFile(null, path, blob).catch(() => false);
            if (!written) throw new Error(`Could not write ${path}`);
        },
        async removeTree(prefix: string): Promise<void> {
            const removed = await removeFile(null, prefix, { recursive: true }).catch(() => false);
            if (!removed) throw new Error(`Could not clear ${prefix}`);
        }
    }));
    return nativeBackendPromise;
};

/**
 * Creates an isolated blob/manifest store under an OPFS namespace.
 *
 * `backend` exists for deterministic tests and must implement the same
 * namespace behavior as the native OPFS bridge.
 */
export const createContentAddressedStore = (
    namespace: string,
    backend?: ContentStoreBackend
): ContentAddressedStore => {
    const root = normalizeNamespace(namespace);
    const resolveBackend = (): Promise<ContentStoreBackend> => backend
        ? Promise.resolve(backend)
        : getNativeBackend();

    return {
        async put(file: File): Promise<StoredBlobRef> {
            if (!(file instanceof File)) throw new TypeError("Content store accepts File instances only");
            const hash = await hashBlob(file);
            const path = toSafePath(root, `blobs/${hash}`);
            const storage = await resolveBackend();
            const existing = await storage.read(path);
            if (!existing) await storage.write(path, file);

            return {
                hash,
                path,
                name: file.name || "attachment",
                type: file.type || "application/octet-stream",
                size: file.size,
                lastModified: file.lastModified || Date.now()
            };
        },

        async get(ref: StoredBlobRef): Promise<File | null> {
            try {
                if (!ref?.path || !ref?.hash) return null;
                const path = toSafePath(root, ref.path);
                const blob = await (await resolveBackend()).read(path);
                if (!blob) return null;
                return new File([blob], ref.name || "attachment", {
                    type: ref.type || blob.type || "application/octet-stream",
                    lastModified: ref.lastModified || Date.now()
                });
            } catch {
                return null;
            }
        },

        async readJson<T>(path: string): Promise<T | null> {
            try {
                const blob = await (await resolveBackend()).read(toSafePath(root, path));
                if (!blob) return null;
                return JSON.parse(await blob.text()) as T;
            } catch {
                return null;
            }
        },

        async writeJson(path: string, value: unknown): Promise<void> {
            await (await resolveBackend()).write(
                toSafePath(root, path),
                new Blob([JSON.stringify(value)], { type: "application/json" })
            );
        },

        async clear(prefix = ""): Promise<void> {
            await (await resolveBackend()).removeTree(toSafePath(root, prefix));
        }
    };
};
