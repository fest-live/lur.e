/**
 * FIND:idb-fs
 * TAG:opfs,idb
 * IndexedDB FileSystem-handle backend for OPFS.
 *
 * INVARIANT: handles expose the same surface as OPFS
 * (`getDirectoryHandle` / `getFileHandle` / `entries` / `removeEntry` /
 * `getFile` / `createWritable`) so `mappedRoots` can swap backends.
 *
 * WHY: OPFS is missing on some hosts, or can be turned off. Then `/user/`
 * uses this store. When OPFS stays on (default), the same store is `/idb/`.
 */

export const IDB_FS_ROOT = "/idb/";
export const OPFS_SUPPORT_KEY = "cwsp.opfs.enabled";
const IDB_FS_BRAND = Symbol.for("fest.idb-fs");
const DB_NAME = "fest-idb-fs";
const STORE_NAME = "nodes";
const DB_VERSION = 1;

export type IdbFsKind = "file" | "directory";

export type IdbFsNode = {
    path: string;
    name: string;
    parent: string;
    kind: IdbFsKind;
    type?: string;
    lastModified?: number;
    size?: number;
    data?: Blob | ArrayBuffer;
};

export interface IdbFsStore {
    get(path: string): Promise<IdbFsNode | undefined>;
    put(node: IdbFsNode): Promise<void>;
    delete(path: string): Promise<void>;
    list(parent: string): Promise<IdbFsNode[]>;
}

type RootsRefresher = () => void;
let refreshRoots: RootsRefresher | null = null;

/** OPFS.ts binds this so toggling support remounts `/user/` and `/idb/`. */
export const bindStorageRootsRefresher = (fn: RootsRefresher): void => {
    refreshRoots = fn;
};

const fsError = (name: string, message: string): Error => {
    if (typeof DOMException !== "undefined") return new DOMException(message, name);
    const error = new Error(message);
    error.name = name;
    return error;
};

export const normalizeIdbNodePath = (path: string): string => {
    const parts: string[] = [];
    for (const part of String(path || "/").split("/")) {
        if (!part || part === ".") continue;
        if (part === "..") {
            parts.pop();
            continue;
        }
        parts.push(part);
    }
    return parts.length ? `/${parts.join("/")}` : "/";
};

const joinChildPath = (parent: string, name: string): string => {
    const clean = String(name || "").replace(/[/\\]/g, "");
    if (!clean || clean === "." || clean === "..") {
        throw fsError("TypeMismatchError", `Invalid entry name: ${name}`);
    }
    const base = normalizeIdbNodePath(parent);
    return base === "/" ? `/${clean}` : `${base}/${clean}`;
};

const parentOf = (path: string): string => {
    const normalized = normalizeIdbNodePath(path);
    if (normalized === "/") return "";
    const index = normalized.lastIndexOf("/");
    return index <= 0 ? "/" : normalized.slice(0, index);
};

const ensureRootNode = async (store: IdbFsStore): Promise<void> => {
    const root = await store.get("/");
    if (root?.kind === "directory") return;
    await store.put({ path: "/", name: "", parent: "", kind: "directory" });
};

export const createMemoryIdbFsStore = (): IdbFsStore => {
    const nodes = new Map<string, IdbFsNode>();
    return {
        async get(path) {
            return nodes.get(normalizeIdbNodePath(path));
        },
        async put(node) {
            const path = normalizeIdbNodePath(node.path);
            nodes.set(path, { ...node, path });
        },
        async delete(path) {
            nodes.delete(normalizeIdbNodePath(path));
        },
        async list(parent) {
            const key = normalizeIdbNodePath(parent);
            return [...nodes.values()].filter((node) => node.path !== "/" && node.parent === key);
        }
    };
};

const idbRequest = <T>(request: IDBRequest<T>): Promise<T> =>
    new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });

const openIdbFsDatabase = (): Promise<IDBDatabase> =>
    new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
        request.onupgradeneeded = () => {
            const db = request.result;
            if (db.objectStoreNames.contains(STORE_NAME)) return;
            const store = db.createObjectStore(STORE_NAME, { keyPath: "path" });
            store.createIndex("parent", "parent", { unique: false });
        };
    });

export const createIndexedDbFsStore = async (): Promise<IdbFsStore> => {
    const db = await openIdbFsDatabase();
    const withStore = async <T>(mode: IDBTransactionMode, run: (store: IDBObjectStore) => Promise<T> | T): Promise<T> => {
        const tx = db.transaction(STORE_NAME, mode);
        return run(tx.objectStore(STORE_NAME));
    };
    const store: IdbFsStore = {
        async get(path) {
            return withStore("readonly", (objectStore) =>
                idbRequest(objectStore.get(normalizeIdbNodePath(path)))
            );
        },
        async put(node) {
            const path = normalizeIdbNodePath(node.path);
            await withStore("readwrite", (objectStore) =>
                idbRequest(objectStore.put({ ...node, path }))
            );
        },
        async delete(path) {
            await withStore("readwrite", (objectStore) =>
                idbRequest(objectStore.delete(normalizeIdbNodePath(path)))
            );
        },
        async list(parent) {
            const key = normalizeIdbNodePath(parent);
            return withStore("readonly", async (objectStore) => {
                if (objectStore.indexNames.contains("parent")) {
                    const rows = await idbRequest(objectStore.index("parent").getAll(key));
                    return (rows || []).filter((node) => node.path !== "/");
                }
                const rows = (await idbRequest(objectStore.getAll())) || [];
                return rows.filter((node) => node.path !== "/" && node.parent === key);
            });
        }
    };
    await ensureRootNode(store);
    return store;
};

export const isIdbAvailable = (): boolean => {
    try {
        return typeof indexedDB !== "undefined";
    } catch {
        return false;
    }
};

export const isOpfsCapabilityAvailable = (): boolean => {
    try {
        return typeof navigator !== "undefined"
            && typeof navigator.storage?.getDirectory === "function";
    } catch {
        return false;
    }
};

export const isOpfsSupportEnabled = (): boolean => {
    try {
        if (typeof localStorage === "undefined") return true;
        const value = localStorage.getItem(OPFS_SUPPORT_KEY);
        return value !== "0" && value !== "false";
    } catch {
        return true;
    }
};

export const setOpfsSupportEnabled = (enabled: boolean): void => {
    try {
        localStorage?.setItem?.(OPFS_SUPPORT_KEY, enabled ? "1" : "0");
    } catch { /* private mode */ }
    refreshRoots?.();
};

/** OPFS is used for `/user/` only when the API exists and support is on. */
export const isOpfsBackendActive = (): boolean =>
    isOpfsCapabilityAvailable() && isOpfsSupportEnabled();

export const isIdbFsHandle = (value: unknown): boolean =>
    !!value && typeof value === "object" && (value as { [IDB_FS_BRAND]?: boolean })[IDB_FS_BRAND] === true;

const removeTree = async (store: IdbFsStore, path: string): Promise<void> => {
    const target = normalizeIdbNodePath(path);
    const children = await store.list(target);
    for (const child of children) {
        if (child.kind === "directory") await removeTree(store, child.path);
        else await store.delete(child.path);
    }
    if (target !== "/") await store.delete(target);
};

export class IdbFileHandle {
    readonly kind = "file" as const;
    readonly [IDB_FS_BRAND] = true;
    readonly name: string;
    #store: IdbFsStore;
    #path: string;
    #type: string;

    constructor(store: IdbFsStore, path: string, name: string, type = "") {
        this.#store = store;
        this.#path = normalizeIdbNodePath(path);
        this.name = name;
        this.#type = type;
    }

    async getFile(): Promise<File> {
        const node = await this.#store.get(this.#path);
        if (!node || node.kind !== "file") {
            throw fsError("NotFoundError", `File not found: ${this.#path}`);
        }
        const payload = node.data ?? new Blob();
        const blob = payload instanceof Blob ? payload : new Blob([payload]);
        return new File([blob], this.name, {
            type: node.type || blob.type || this.#type,
            lastModified: node.lastModified || Date.now()
        });
    }

    async createWritable(): Promise<{
        write: (data: any) => Promise<void>;
        seek: (position: number) => Promise<void>;
        truncate: (size: number) => Promise<void>;
        abort: () => Promise<void>;
        close: () => Promise<void>;
    }> {
        const chunks: BlobPart[] = [];
        let aborted = false;
        const store = this.#store;
        const path = this.#path;
        const name = this.name;
        const type = this.#type;
        return {
            async write(data) {
                if (aborted) throw fsError("AbortError", "Writable aborted");
                const chunk = data && typeof data === "object" && "data" in data ? data.data : data;
                chunks.push(chunk);
            },
            async seek() { /* sequential buffer */ },
            async truncate() { chunks.length = 0; },
            async abort() { aborted = true; chunks.length = 0; },
            async close() {
                if (aborted) return;
                const blob = new Blob(chunks, { type: type || undefined });
                await store.put({
                    path,
                    name,
                    parent: parentOf(path),
                    kind: "file",
                    type: blob.type || type,
                    lastModified: Date.now(),
                    size: blob.size,
                    data: blob
                });
            }
        };
    }
}

export class IdbDirectoryHandle {
    readonly kind = "directory" as const;
    readonly [IDB_FS_BRAND] = true;
    readonly name: string;
    #store: IdbFsStore;
    #path: string;

    constructor(store: IdbFsStore, path: string, name: string) {
        this.#store = store;
        this.#path = normalizeIdbNodePath(path);
        this.name = name;
    }

    async getDirectoryHandle(name: string, options: { create?: boolean } = {}): Promise<IdbDirectoryHandle> {
        const childPath = joinChildPath(this.#path, name);
        let node = await this.#store.get(childPath);
        if (!node) {
            if (!options.create) throw fsError("NotFoundError", `Directory not found: ${childPath}`);
            node = {
                path: childPath,
                name: String(name),
                parent: this.#path,
                kind: "directory"
            };
            await this.#store.put(node);
        }
        if (node.kind !== "directory") {
            throw fsError("TypeMismatchError", `Not a directory: ${childPath}`);
        }
        return new IdbDirectoryHandle(this.#store, childPath, node.name);
    }

    async getFileHandle(name: string, options: { create?: boolean } = {}): Promise<IdbFileHandle> {
        const childPath = joinChildPath(this.#path, name);
        let node = await this.#store.get(childPath);
        if (!node) {
            if (!options.create) throw fsError("NotFoundError", `File not found: ${childPath}`);
            node = {
                path: childPath,
                name: String(name),
                parent: this.#path,
                kind: "file",
                type: "",
                lastModified: Date.now(),
                size: 0,
                data: new Blob()
            };
            await this.#store.put(node);
        }
        if (node.kind !== "file") {
            throw fsError("TypeMismatchError", `Not a file: ${childPath}`);
        }
        return new IdbFileHandle(this.#store, childPath, node.name, node.type);
    }

    async removeEntry(name: string, options: { recursive?: boolean } = {}): Promise<void> {
        const childPath = joinChildPath(this.#path, name);
        const node = await this.#store.get(childPath);
        if (!node) throw fsError("NotFoundError", `Entry not found: ${childPath}`);
        if (node.kind === "directory") {
            const children = await this.#store.list(childPath);
            if (children.length && !options.recursive) {
                throw fsError("InvalidModificationError", `Directory not empty: ${childPath}`);
            }
            await removeTree(this.#store, childPath);
            return;
        }
        await this.#store.delete(childPath);
    }

    async *entries(): AsyncGenerator<[string, IdbDirectoryHandle | IdbFileHandle]> {
        const children = await this.#store.list(this.#path);
        for (const node of children) {
            const handle = node.kind === "directory"
                ? new IdbDirectoryHandle(this.#store, node.path, node.name)
                : new IdbFileHandle(this.#store, node.path, node.name, node.type);
            yield [node.name, handle];
        }
    }

    async *keys(): AsyncGenerator<string> {
        for await (const [name] of this.entries()) yield name;
    }

    async *values(): AsyncGenerator<IdbDirectoryHandle | IdbFileHandle> {
        for await (const [, handle] of this.entries()) yield handle;
    }
}

let defaultRootPromise: Promise<IdbDirectoryHandle | null> | null = null;

export const getIdbRoot = async (store?: IdbFsStore): Promise<IdbDirectoryHandle | null> => {
    if (store) {
        await ensureRootNode(store);
        return new IdbDirectoryHandle(store, "/", "");
    }
    if (!isIdbAvailable()) return null;
    defaultRootPromise ??= (async () => {
        try {
            const idbStore = await createIndexedDbFsStore();
            return new IdbDirectoryHandle(idbStore, "/", "");
        } catch {
            return null;
        }
    })();
    return defaultRootPromise;
};

export const copyHandleTree = async (fromHandle: any, toHandle: any): Promise<boolean> => {
    try {
        if (fromHandle?.kind === "directory") {
            for await (const [name, entry] of fromHandle.entries()) {
                if (entry?.kind === "directory") {
                    const dest = await toHandle.getDirectoryHandle(name, { create: true });
                    await copyHandleTree(entry, dest);
                } else {
                    const file = await entry.getFile();
                    const dest = await toHandle.getFileHandle(name, { create: true });
                    const writable = await dest.createWritable();
                    await writable.write(file);
                    await writable.close();
                }
            }
            return true;
        }
        const file = await fromHandle.getFile();
        const writable = await toHandle.createWritable();
        await writable.write(file);
        await writable.close();
        return true;
    } catch {
        return false;
    }
};
