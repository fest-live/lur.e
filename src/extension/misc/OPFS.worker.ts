/// <reference lib="webworker" />
import { UUIDv4 } from "fest/core";

//
const mappedRoots = new Map<string, FileSystemDirectoryHandle>();
const activeObservers = new Map<string, any>(); // FileSystemObserver

//
const getRoot = async (id: string = "") => {
    if (id && mappedRoots.has(id)) return mappedRoots.get(id);
    return await navigator.storage.getDirectory();
};

//
const normalizePath = (path: string) => {
    return path?.trim?.()?.replace(/\/+/g, "/") || "/";
};

//
const resolveHandle = async (root: FileSystemDirectoryHandle, path: string, create: boolean = false) => {
    const parts = normalizePath(path).split("/").filter(p => p && p !== ".");
    let current: any = root;

    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (i === parts.length - 1) {
            // Last part - could be file or dir
            try {
                return await current.getDirectoryHandle(part, { create });
            } catch {
                try {
                    return await current.getFileHandle(part, { create });
                } catch (e) {
                    if (create) throw e;
                    return null;
                }
            }
        } else {
            current = await current.getDirectoryHandle(part, { create });
        }
    }
    return current;
};

//
const getDirHandle = async (root: FileSystemDirectoryHandle, path: string, create: boolean) => {
    const parts = normalizePath(path).split("/").filter(p => p);
    let current = root;
    for (const part of parts) {
        current = await current.getDirectoryHandle(part, { create });
    }
    return current;
};

//
const handlers: Record<string, (payload: any) => Promise<any>> = {
    //
    mount: async ({ id, handle }: { id: string, handle: FileSystemDirectoryHandle }) => {
        mappedRoots.set(id, handle);
        return true;
    },

    //
    unmount: async ({ id }: { id: string }) => {
        mappedRoots.delete(id);
        return true;
    },

    //
    readDirectory: async ({ rootId, path, create }: any) => {
        try {
            const root = await getRoot(rootId);
            const handle = await getDirHandle(root, path, create);
            const entries: any[] = [];

            // @ts-ignore
            for await (const [name, entry] of handle.entries()) {
                entries.push([name, entry]);
            }
            return entries;
        } catch (e) {
            console.warn("Worker readDirectory error:", e);
            return [];
        }
    },

    //
    readFile: async ({ rootId, path, type }: any) => {
        try {
            const root = await getRoot(rootId);
            const parts = normalizePath(path).split("/").filter(p => p);
            const filename = parts.pop();
            const dirPath = parts.join("/");

            const dir = await getDirHandle(root, dirPath, false);
            const fileHandle = await dir.getFileHandle(filename!, { create: false });
            const file = await fileHandle.getFile();

            if (type === "text") return await file.text();
            if (type === "arrayBuffer") return await file.arrayBuffer();
            if (type === "blob") return file; // Blob/File is transferable

            return file;
        } catch (e) {
            console.warn("Worker readFile error:", e);
            return null;
        }
    },

    //
    writeFile: async ({ rootId, path, data }: any) => {
        try {
            const root = await getRoot(rootId);
            const parts = normalizePath(path).split("/").filter(p => p);
            const filename = parts.pop();
            const dirPath = parts.join("/");

            const dir = await getDirHandle(root, dirPath, true);
            const fileHandle = await dir.getFileHandle(filename!, { create: true });
            const writable = await fileHandle.createWritable();
            await writable.write(data);
            await writable.close();
            return true;
        } catch (e) {
            console.warn("Worker writeFile error:", e);
            return false;
        }
    },

    //
    remove: async ({ rootId, path, recursive }: any) => {
        try {
            const root = await getRoot(rootId);
            const parts = normalizePath(path).split("/").filter(p => p);
            const name = parts.pop();
            const dirPath = parts.join("/");

            const dir = await getDirHandle(root, dirPath, false);
            await dir.removeEntry(name!, { recursive });
            return true;
        } catch (e) {
            return false;
        }
    },

    //
    observe: async ({ rootId, path, id }: any) => {
        try {
            if (activeObservers.has(id)) return true;

            const root = await getRoot(rootId);
            const handle = await getDirHandle(root, path, false);

            // @ts-ignore
            if (typeof FileSystemObserver !== "undefined") {
                // @ts-ignore
                const observer = new FileSystemObserver((records: any[]) => {
                    const changes = records.map(r => ({
                        type: r.type,
                        name: r.changedHandle?.name,
                        kind: r.changedHandle?.kind,
                        handle: r.changedHandle,
                        path: r.relativePathComponents.join("/")
                    }));

                    self.postMessage({
                        type: "observation",
                        id,
                        changes
                    });
                });

                observer.observe(handle!);
                activeObservers.set(id, observer);
                return true;
            }
            return false;
        } catch (e) {
            return false;
        }
    },

    //
    unobserve: async ({ id }: any) => {
        const observer = activeObservers.get(id);
        if (observer) {
            observer.disconnect();
            activeObservers.delete(id);
        }
        return true;
    },

    //
    copy: async ({ from, to }: any) => {
        try {
            const copyRecursive = async (source: any, dest: any) => {
                if (source.kind === 'directory') {
                    for await (const [name, entry] of source.entries()) {
                        if (entry.kind === 'directory') {
                            const newDest = await dest.getDirectoryHandle(name, { create: true });
                            await copyRecursive(entry, newDest);
                        } else {
                            const file = await entry.getFile();
                            const newFile = await dest.getFileHandle(name, { create: true });
                            const writable = await newFile.createWritable();
                            await writable.write(file);
                            await writable.close();
                        }
                    }
                } else {
                    const file = await source.getFile();
                    const writable = await dest.createWritable();
                    await writable.write(file);
                    await writable.close();
                }
            };

            await copyRecursive(from, to);
            return true;
        } catch (e) {
            console.warn("Worker copy error:", e);
            return false;
        }
    }
};

//
self.addEventListener("message", async (e) => {
    if (!e.data || typeof e.data !== 'object') return;
    const { id, type, payload } = e.data;
    
    if (handlers[type]) {
        try {
            const result = await handlers[type](payload);
            self.postMessage({ id, result });
        } catch (error: any) {
            self.postMessage({ id, error: error?.message || String(error) });
        }
    } else if (id) {
        self.postMessage({ id, error: `Unknown operation type: ${type}` });
    }
});
