import { UUIDv4 } from 'fest/core';
import { observe } from 'fest/object';
import { createWorkerChannel, QueuedWorkerChannel } from 'fest/uniform';
// Import the OPFS worker using Vite's worker syntax
import OPFSWorker from './OPFS.uniform.worker.ts?worker';
//
let workerChannel = null;
const isServiceWorker = typeof ServiceWorkerGlobalScope !== "undefined" && self instanceof ServiceWorkerGlobalScope;
//
const observers = new Map();
let workerInitPromise = null;
export const ensureWorker = () => {
    if (workerInitPromise)
        return workerInitPromise;
    workerInitPromise = new Promise(async (resolve) => {
        // In Service Worker context we never instantiate dedicated worker, directHandlers are used instead
        if (typeof Worker !== "undefined" && !isServiceWorker) {
            try {
                // Create basic worker channel first to test
                const baseChannel = await createWorkerChannel({
                    name: "opfs-worker",
                    script: OPFSWorker
                });
                // Create queued optimized worker channel using the base channel
                workerChannel = new QueuedWorkerChannel("opfs-worker", async () => baseChannel, {
                    timeout: 30000, // 30 second timeout for file operations (file ops can be slow)
                    retries: 3,
                    batching: true, // Enable message batching for better performance
                    compression: false // File operations don't benefit from compression
                });
                // Resolve immediately - operations will queue until channel is ready
                resolve(workerChannel);
            }
            catch (e) {
                console.warn("OPFSUniformWorker instantiation failed, falling back to main thread...", e);
                workerChannel = null;
                resolve(null);
            }
        }
        else {
            workerChannel = null;
            resolve(null);
        }
    });
    return workerInitPromise;
};
// Direct OPFS handlers for Service Worker context (where postMessage doesn't work as expected)
// Direct OPFS handlers for Service Worker context (where postMessage doesn't work as expected)
export const directHandlers = {
    readDirectory: async ({ rootId, path, create }) => {
        try {
            const root = await navigator.storage.getDirectory();
            const parts = (path || "").trim().replace(/\/+/g, "/").split("/").filter((p) => p);
            let current = root;
            for (const part of parts) {
                current = await current.getDirectoryHandle(part, { create });
            }
            const entries = [];
            // @ts-ignore
            for await (const [name, entry] of current.entries()) {
                entries.push([name, entry]);
            }
            return entries;
        }
        catch (e) {
            console.warn("Direct readDirectory error:", e);
            return [];
        }
    },
    readFile: async ({ rootId, path, type }) => {
        try {
            const root = await navigator.storage.getDirectory();
            const parts = (path || "").trim().replace(/\/+/g, "/").split("/").filter((p) => p);
            const filename = parts.pop();
            let dir = root;
            for (const part of parts) {
                dir = await dir.getDirectoryHandle(part, { create: false });
            }
            const fileHandle = await dir.getFileHandle(filename, { create: false });
            const file = await fileHandle.getFile();
            if (type === "text")
                return await file.text();
            if (type === "arrayBuffer")
                return await file.arrayBuffer();
            return file;
        }
        catch (e) {
            console.warn("Direct readFile error:", e);
            return null;
        }
    },
    writeFile: async ({ rootId, path, data }) => {
        try {
            const root = await navigator.storage.getDirectory();
            const parts = (path || "").trim().replace(/\/+/g, "/").split("/").filter((p) => p);
            const filename = parts.pop();
            let dir = root;
            for (const part of parts) {
                dir = await dir.getDirectoryHandle(part, { create: true });
            }
            const fileHandle = await dir.getFileHandle(filename, { create: true });
            const writable = await fileHandle.createWritable();
            await writable.write(data);
            await writable.close();
            return true;
        }
        catch (e) {
            console.warn("Direct writeFile error:", e);
            return false;
        }
    },
    remove: async ({ rootId, path, recursive }) => {
        try {
            const root = await navigator.storage.getDirectory();
            const parts = (path || "").trim().replace(/\/+/g, "/").split("/").filter((p) => p);
            const name = parts.pop();
            let dir = root;
            for (const part of parts) {
                dir = await dir.getDirectoryHandle(part, { create: false });
            }
            await dir.removeEntry(name, { recursive });
            return true;
        }
        catch {
            return false;
        }
    },
    copy: async ({ from, to }) => {
        try {
            const copyRecursive = async (source, dest) => {
                if (source.kind === 'directory') {
                    for await (const [name, entry] of source.entries()) {
                        if (entry.kind === 'directory') {
                            const newDest = await dest.getDirectoryHandle(name, { create: true });
                            await copyRecursive(entry, newDest);
                        }
                        else {
                            const file = await entry.getFile();
                            const newFile = await dest.getFileHandle(name, { create: true });
                            const writable = await newFile.createWritable();
                            await writable.write(file);
                            await writable.close();
                        }
                    }
                }
                else {
                    const file = await source.getFile();
                    const writable = await dest.createWritable();
                    await writable.write(file);
                    await writable.close();
                }
            };
            await copyRecursive(from, to);
            return true;
        }
        catch (e) {
            console.warn("Direct copy error:", e);
            return false;
        }
    },
    // Placeholder for observe/unobserve (FileSystemObserver not available in all contexts)
    observe: async () => false,
    unobserve: async () => true,
    mount: async () => true,
    unmount: async () => true
};
//
export const post = (type, payload = {}, transfer = []) => {
    // In Service Worker context, execute directly instead of using postMessage
    if (isServiceWorker && directHandlers[type]) {
        return directHandlers[type](payload);
    }
    return new Promise(async (resolve, reject) => {
        try {
            const channel = await ensureWorker();
            if (!channel) {
                // Fallback to direct handlers if no worker channel available
                if (directHandlers[type]) {
                    return resolve(directHandlers[type](payload));
                }
                return reject(new Error('No worker channel available'));
            }
            // Use optimized uniform channel API
            const result = await channel.request(type, payload);
            resolve(result);
        }
        catch (err) {
            reject(err);
        }
    });
};
//
export const getDir = (dest) => {
    if (typeof dest != "string")
        return dest;
    dest = dest?.trim?.() || dest;
    if (!dest?.endsWith?.("/")) {
        dest = dest?.trim?.()?.split?.("/")?.slice(0, -1)?.join?.("/")?.trim?.() || dest;
    }
    ;
    const p1 = !dest?.trim()?.endsWith("/") ? (dest + "/") : dest;
    return (!p1?.startsWith("/") ? ("/" + p1) : p1);
};
//
export const imageImportDesc = {
    startIn: "pictures", multiple: false,
    types: [{ description: "wallpaper", accept: { "image/*": [".png", ".gif", ".jpg", ".jpeg", ".webp", ".jxl",] }, }]
};
//
export const generalFileImportDesc = {
    startIn: "documents", multiple: false,
    types: [{ description: "files", accept: { "application/*": [".txt", ".md", ".html", ".htm", ".css", ".js", ".json", ".csv", ".xml", ".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".ico", ".mp3", ".wav", ".mp4", ".webm", ".pdf", ".zip", ".rar", ".7z",] }, }]
};
// "/" default is OPFS root (but may another root), "/user/" is OPFS root by default too, "/assets/" is unknown backend related assets
export const mappedRoots = new Map([
    ["/", async () => ((await navigator?.storage?.getDirectory?.()))],
    ["/user/", async () => (await navigator?.storage?.getDirectory?.())],
    ["/assets/", async () => { console.warn("Backend related API not implemented!"); return null; }],
]);
//
export const currentHandleMap = new Map();
//
export const mountAsRoot = async (forId, copyFromInternal) => {
    const cleanId = forId?.trim?.()?.replace?.(/^\//, "")?.trim?.()?.split?.("/")?.filter?.(p => !!p?.trim?.())?.at?.(0);
    // @ts-ignore
    const rootHandle = currentHandleMap?.get(cleanId) ?? (await showDirectoryPicker?.({
        mode: "readwrite",
        id: `${cleanId}`
    })?.catch?.(console.warn.bind(console)));
    //
    if (rootHandle && cleanId && typeof cleanId == "string") {
        currentHandleMap?.set?.(cleanId, rootHandle);
    }
    ;
    if (rootHandle && typeof localStorage != "undefined") {
        localStorage?.setItem?.("opfs.mounted", JSON.stringify([...JSON.parse(localStorage?.getItem?.("opfs.mounted") || "[]"), cleanId]));
    }
    ;
    //
    if (rootHandle) {
        // Sync to worker
        post('mount', { id: cleanId, handle: rootHandle });
    }
    //
    if (copyFromInternal && rootHandle && cleanId == "user") {
        const internalRoot = await navigator?.storage?.getDirectory?.();
        await copyFromOneHandlerToAnother(internalRoot, rootHandle, {})?.catch?.(console.warn.bind(console));
    }
    ;
    //
    return rootHandle;
};
//
export const unmountAsRoot = async (forId) => {
    if (typeof localStorage != "undefined") {
        localStorage?.setItem?.("opfs.mounted", JSON.stringify(JSON.parse(localStorage?.getItem?.("opfs.mounted") || "[]").filter((id) => id != forId)));
    }
    // Sync to worker
    post('unmount', { id: forId });
};
// Enhanced root resolution function
export async function resolveRootHandle(rootHandle, relPath = "") {
    // if is null, just return OPFS root
    if (rootHandle == null || rootHandle == undefined || rootHandle?.trim?.()?.length == 0) {
        rootHandle = "/user/";
    }
    //
    const cleanId = typeof rootHandle == "string" ? rootHandle?.trim?.()?.replace?.(/^\//, "")?.trim?.()?.split?.("/")?.filter?.(p => !!p?.trim?.())?.at?.(0) : null;
    if (cleanId) {
        if (typeof localStorage != "undefined" && JSON.parse(localStorage?.getItem?.("opfs.mounted") || "[]").includes(cleanId)) {
            // @ts-ignore
            rootHandle = currentHandleMap?.get(cleanId);
        }
        if (!rootHandle) {
            rootHandle = (await mappedRoots?.get?.(`/${cleanId}/`)?.()) ?? (await navigator.storage.getDirectory());
        }
        ;
    }
    //
    if (rootHandle instanceof FileSystemDirectoryHandle) {
        return rootHandle;
    }
    // Normalize relPath for root matching
    const normalizedPath = relPath?.trim?.() || "/";
    const pathForMatch = normalizedPath.startsWith("/") ? normalizedPath : "/" + normalizedPath;
    // Find the best matching root from mappedRoots
    let bestMatch = null;
    let bestMatchLength = 0;
    //
    for (const [rootPath, rootResolver] of mappedRoots.entries()) {
        if (pathForMatch.startsWith(rootPath) && rootPath.length > bestMatchLength) {
            bestMatch = rootResolver;
            bestMatchLength = rootPath.length;
        }
    }
    // Use the best matching root resolver, fallback to OPFS root
    try {
        const resolvedRoot = bestMatch ? await bestMatch() : null;
        return resolvedRoot || await navigator?.storage?.getDirectory?.();
    }
    catch (error) {
        console.warn("Failed to resolve root handle, falling back to OPFS root:", error);
        return await navigator?.storage?.getDirectory?.();
    }
}
// Enhanced path normalization with relative directory support
export function normalizePath(basePath = "", relPath) {
    if (!relPath?.trim())
        return basePath;
    const cleanRelPath = relPath.trim();
    // Handle absolute paths (starting with /)
    if (cleanRelPath.startsWith("/")) {
        return cleanRelPath;
    }
    // Handle relative paths
    const baseParts = basePath.split("/").filter(p => p?.trim());
    const relParts = cleanRelPath.split("/").filter(p => p?.trim());
    for (const part of relParts) {
        if (part === ".") {
            // Current directory - no change
            continue;
        }
        else if (part === "..") {
            // Parent directory - go up one level
            if (baseParts.length > 0) {
                baseParts.pop();
            }
        }
        else {
            // Regular directory/file name
            baseParts.push(part);
        }
    }
    return "/" + baseParts.join("/");
}
// Enhanced path resolution that combines root mapping and relative path handling
export async function resolvePath(rootHandle, relPath, basePath = "") {
    // First normalize the relative path
    const normalizedRelPath = normalizePath(basePath, relPath);
    // Then resolve the root handle
    const resolvedRootHandle = await resolveRootHandle(rootHandle, normalizedRelPath);
    return {
        rootHandle: resolvedRootHandle,
        resolvedPath: normalizedRelPath
    };
}
//
export function handleError(logger, status, message) { logger?.(status, message); return null; }
export function defaultLogger(status, message) { console.trace(`[${status}] ${message}`); }
;
export function getFileExtension(path) { return path?.trim?.()?.split?.(".")?.[1]; }
export function detectTypeByRelPath(relPath) { if (relPath?.trim()?.endsWith?.('/'))
    return 'directory'; return 'file'; }
export function getMimeTypeByFilename(filename) {
    const ext = filename?.split?.('.')?.pop?.()?.toLowerCase?.();
    const mimeTypes = {
        'txt': 'text/plain',
        'md': 'text/markdown',
        'html': 'text/html',
        'htm': 'text/html',
        'css': 'text/css',
        'js': 'application/javascript',
        'json': 'application/json',
        'csv': 'text/csv',
        'xml': 'application/xml',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif',
        'webp': 'image/webp',
        'svg': 'image/svg+xml',
        'ico': 'image/x-icon',
        'mp3': 'audio/mpeg',
        'wav': 'audio/wav',
        'mp4': 'video/mp4',
        'webm': 'video/webm',
        'pdf': 'application/pdf',
        'zip': 'application/zip',
        'rar': 'application/vnd.rar',
        '7z': 'application/x-7z-compressed',
        // ...
    };
    return mimeTypes[ext] || 'application/octet-stream';
}
//
export const hasFileExtension = (path) => {
    return path?.trim?.()?.split?.(".")?.[1]?.trim?.()?.length > 0;
};
//
export async function getDirectoryHandle(rootHandle, relPath, { create = false, basePath = "" } = {}, logger = defaultLogger) {
    try {
        const { rootHandle: resolvedRoot, resolvedPath } = await resolvePath(rootHandle, relPath, basePath);
        // Remove /user/ prefix
        const cleanPath = resolvedPath?.trim?.()?.startsWith?.("/user/") ?
            resolvedPath?.trim?.()?.replace?.(/^\/user/g, "")?.trim?.() : resolvedPath;
        const parts = cleanPath.split('/').filter((p) => (!!p?.trim?.()));
        if (parts.length > 0 && hasFileExtension(parts[parts.length - 1]?.trim?.())) {
            parts?.pop?.();
        }
        ;
        // Fallback to direct access if we need to return a Handle
        // But we want to use worker for operations.
        // Current API returns Handle.
        // If we want optimization, we should use worker.
        // But getDirectoryHandle returns a Handle.
        let dir = resolvedRoot;
        if (parts?.length > 0) {
            for (const part of parts) {
                dir = await dir?.getDirectoryHandle?.(part, { create });
                if (!dir) {
                    break;
                }
                ;
            }
        }
        return dir;
    }
    catch (e) {
        return handleError(logger, 'error', `getDirectoryHandle: ${e.message}`);
    }
}
//
export async function getFileHandle(rootHandle, relPath, { create = false, basePath = "" } = {}, logger = defaultLogger) {
    try {
        const { rootHandle: resolvedRoot, resolvedPath } = await resolvePath(rootHandle, relPath, basePath);
        const cleanPath = resolvedPath?.trim?.()?.startsWith?.("/user/") ?
            resolvedPath?.trim?.()?.replace?.(/^\/user/g, "")?.trim?.() : resolvedPath;
        const parts = cleanPath.split('/').filter((d) => (!!d?.trim?.()));
        if (parts?.length == 0)
            return null;
        const filePath = parts.length > 0 ? parts[parts.length - 1]?.trim?.()?.replace?.(/\s+/g, '-') : '';
        const dirName = parts.length > 1 ? parts?.slice(0, -1)?.join?.('/')?.trim?.()?.replace?.(/\s+/g, '-') : '';
        if (cleanPath?.trim?.()?.endsWith?.("/")) {
            return null;
        }
        ;
        // Delegate to getDirectoryHandle (which is currently main thread)
        const dir = await getDirectoryHandle(resolvedRoot, dirName, { create, basePath }, logger);
        return dir?.getFileHandle?.(filePath, { create });
    }
    catch (e) {
        return handleError(logger, 'error', `getFileHandle: ${e.message}`);
    }
}
//
export async function getHandler(rootHandle, relPath, options = {}, logger = defaultLogger) {
    try {
        const { rootHandle: resolvedRootHandle, resolvedPath } = await resolvePath(rootHandle, relPath, options?.basePath || "");
        const type = detectTypeByRelPath(resolvedPath);
        if (type == 'directory') {
            const dir = await getDirectoryHandle(resolvedRootHandle, resolvedPath?.trim?.()?.replace?.(/\/$/, ''), options, logger);
            if (dir)
                return { type: 'directory', handle: dir };
        }
        else {
            const file = await getFileHandle(resolvedRootHandle, resolvedPath, options, logger);
            if (file)
                return { type: 'file', handle: file };
        }
        return null;
    }
    catch (e) {
        return handleError(logger, 'error', `getHandler: ${e.message}`);
    }
}
//
export async function createHandler(rootHandle, relPath, options = {}, logger = defaultLogger) {
    try {
        const { rootHandle: resolvedRootHandle, resolvedPath } = await resolvePath(rootHandle, relPath, options?.basePath || "");
        const type = detectTypeByRelPath(resolvedPath);
        if (type == 'directory') {
            return await getDirectoryHandle(resolvedRootHandle, resolvedPath?.trim?.()?.replace?.(/\/$/, ''), options, logger);
        }
        else {
            return await getFileHandle(resolvedRootHandle, resolvedPath, options, logger);
        }
    }
    catch (e) {
        return handleError(logger, 'error', `createHandler: ${e.message}`);
    }
}
export const directoryCacheMap = new Map();
//
export const mayNotPromise = (pms, cb, errCb = console.warn.bind(console)) => {
    if (typeof pms?.then == "function") {
        return pms?.then?.(cb)?.catch?.(errCb);
    }
    else {
        try {
            return cb(pms);
        }
        catch (e) {
            errCb(e);
            return null;
        }
    }
};
//
export function openDirectory(rootHandle, relPath, options = { create: false }, logger = defaultLogger) {
    let cacheKey = "";
    // ВАЖНО: синхронно доступная ссылка на reactive-map
    // (изначально пустая, потом будет заменена на shared mapCache из state)
    let localMapCache = observe(new Map());
    const pathPromise = (async () => {
        try {
            const { rootHandle: resolvedRootHandle, resolvedPath } = await resolvePath(rootHandle, relPath, options?.basePath || "");
            cacheKey = `${resolvedRootHandle?.name || "root"}:${resolvedPath}`;
            return { rootHandle: resolvedRootHandle, resolvedPath };
        }
        catch {
            return { rootHandle: null, resolvedPath: "" };
        }
    })();
    const statePromise = pathPromise.then(async ({ rootHandle, resolvedPath }) => {
        if (!resolvedPath)
            return null;
        const existing = directoryCacheMap.get(cacheKey);
        if (existing) {
            existing.refCount++;
            // синхронно переключаем proxy на shared map
            localMapCache = existing.mapCache;
            return existing;
        }
        const mapCache = observe(new Map());
        localMapCache = mapCache;
        const observationId = UUIDv4();
        const dirHandlePromise = getDirectoryHandle(rootHandle, resolvedPath, options, logger);
        const updateCache = async () => {
            const cleanPath = resolvedPath?.trim?.()?.startsWith?.("/user/")
                ? resolvedPath?.trim?.()?.replace?.(/^\/user/g, "")?.trim?.()
                : resolvedPath;
            const entries = await post("readDirectory", {
                rootId: "",
                path: cleanPath,
                create: options.create,
            }, rootHandle ? [rootHandle] : []);
            if (!entries)
                return mapCache;
            const entryMap = new Map(entries);
            // remove deleted
            for (const key of mapCache.keys()) {
                if (!entryMap.has(key))
                    mapCache.delete(key);
            }
            // add new
            for (const [key, handle] of entryMap) {
                if (!mapCache.has(key))
                    mapCache.set(key, handle);
            }
            return mapCache;
        };
        const cleanup = () => {
            post("unobserve", { id: observationId });
            observers.delete(observationId);
            directoryCacheMap.delete(cacheKey);
        };
        observers.set(observationId, (changes) => {
            for (const change of changes) {
                if (!change?.name)
                    continue;
                if (change.type === "modified" || change.type === "created" || change.type === "appeared") {
                    mapCache.set(change.name, change.handle);
                }
                else if (change.type === "deleted" || change.type === "disappeared") {
                    mapCache.delete(change.name);
                }
            }
        });
        const cleanPath = resolvedPath?.trim?.()?.startsWith?.("/user/")
            ? resolvedPath?.trim?.()?.replace?.(/^\/user/g, "")?.trim?.()
            : resolvedPath;
        post("observe", {
            rootId: "",
            path: cleanPath,
            id: observationId,
        }, rootHandle ? [rootHandle] : []);
        // initial load (fire and forget)
        updateCache();
        const newState = {
            mapCache,
            dirHandle: dirHandlePromise,
            resolvePath: resolvedPath,
            observationId,
            refCount: 1,
            cleanup,
            updateCache,
        };
        directoryCacheMap.set(cacheKey, newState);
        const entries = await Promise.all(await Array.fromAsync((await dirHandlePromise)?.entries?.() ?? []));
        for (const [name, handle] of entries) {
            if (!mapCache.has(name))
                mapCache.set(name, handle);
        }
        return { ...newState, mapCache };
    });
    //
    let disposed = false;
    const dispose = () => {
        if (disposed)
            return;
        disposed = true;
        statePromise
            .then((s) => {
            if (!s)
                return;
            s.refCount--;
            if (s.refCount <= 0)
                s.cleanup();
        })
            .catch(console.warn);
    };
    //
    const handler = {
        get(_target, prop) {
            // 0) Часто вызываемые системные/инспекционные штуки — НЕ трогаем вообще
            // иначе легко словить рекурсию/лавину
            if (prop === Symbol.toStringTag ||
                prop === Symbol.iterator ||
                prop === "toString" ||
                prop === "valueOf" ||
                prop === "inspect" ||
                prop === "constructor" ||
                prop === "__proto__" ||
                prop === "prototype") {
                return undefined;
            }
            if (prop === "dispose")
                return dispose;
            // синхронно отдаём реактивный Map (как в backup)
            if (prop === "getMap")
                return () => localMapCache;
            // map-like методы (синхронно!)
            if (prop === "entries")
                return () => localMapCache.entries();
            if (prop === "keys")
                return () => localMapCache.keys();
            if (prop === "values")
                return () => localMapCache.values();
            if (prop === Symbol.iterator)
                return () => localMapCache[Symbol.iterator]();
            // часто нужно
            if (prop === "size")
                return localMapCache.size;
            if (prop === "has")
                return (k) => localMapCache.has(k);
            if (prop === "get")
                return (k) => localMapCache.get(k);
            // удобные методы
            if (prop === "entries")
                return () => localMapCache.entries();
            if (prop === "keys")
                return () => localMapCache.keys();
            if (prop === "values")
                return () => localMapCache.values();
            //
            if (prop === "refresh") {
                return () => statePromise
                    .then((s) => s?.updateCache?.())
                    .then(() => pxy);
            }
            // Promise-like: чтобы можно было await openDirectory(...)
            if (prop === "then" || prop === "catch" || prop === "finally") {
                // делаем proxy awaitable
                const p = statePromise.then(() => true);
                // @ts-ignore
                return p[prop].bind(p);
            }
            // Остальное: попробуем прокинуть на dirHandle (когда готово)
            return (...args) => statePromise.then(async (s) => {
                if (!s)
                    return undefined;
                const dh = await s.dirHandle;
                const v = dh?.[prop];
                if (typeof v === "function")
                    return v.apply(dh, args);
                return v;
            });
        },
        // ВАЖНО: ownKeys должен быть синхронным
        ownKeys() {
            return Array.from(localMapCache.keys());
        },
        getOwnPropertyDescriptor() {
            return { enumerable: true, configurable: true };
        },
    };
    const fx = function () { };
    const pxy = new Proxy(fx, handler);
    return pxy;
}
//
export async function readFile(rootHandle, relPath, options = {}, logger = defaultLogger) {
    try {
        const { rootHandle: resolvedRoot, resolvedPath } = await resolvePath(rootHandle, relPath, options?.basePath || "");
        const cleanPath = resolvedPath?.trim?.()?.startsWith?.("/user/") ?
            resolvedPath?.trim?.()?.replace?.(/^\/user/g, "")?.trim?.() : resolvedPath;
        // Use Worker
        const file = await post('readFile', { rootId: "", path: cleanPath, type: "blob" }, resolvedRoot ? [resolvedRoot] : []);
        return file;
    }
    catch (e) {
        return handleError(logger, 'error', `readFile: ${e.message}`);
    }
}
//
export async function readAsObjectURL(rootHandle, relPath, options = {}, logger = defaultLogger) {
    try {
        const file = await readFile(rootHandle, relPath, options, logger);
        return file ? URL.createObjectURL(file) : null;
    }
    catch (e) {
        return handleError(logger, 'error', `readAsObjectURL: ${e.message}`);
    }
}
//
export async function readFileUTF8(rootHandle, relPath, options = {}, logger = defaultLogger) {
    try {
        const file = await readFile(rootHandle, relPath, options, logger);
        if (!file)
            return "";
        return await file.text();
    }
    catch (e) {
        return handleError(logger, 'error', `readFileUTF8: ${e.message}`);
    }
}
//
export async function writeFile(rootHandle, relPath, data, logger = defaultLogger) {
    if (data instanceof FileSystemFileHandle) {
        data = await data.getFile();
    }
    if (data instanceof FileSystemDirectoryHandle) {
        const dstHandle = await getDirectoryHandle(await resolveRootHandle(rootHandle), relPath + (relPath?.trim?.()?.endsWith?.("/") ? "" : "/") + (data?.name || "")?.trim?.()?.replace?.(/\s+/g, '-'), { create: true });
        return await copyFromOneHandlerToAnother(data, dstHandle, {})?.catch?.(console.warn.bind(console));
    }
    else
        //
        try {
            const { rootHandle: resolvedRoot, resolvedPath } = await resolvePath(rootHandle, relPath, "");
            const cleanPath = resolvedPath?.trim?.()?.startsWith?.("/user/") ?
                resolvedPath?.trim?.()?.replace?.(/^\/user/g, "")?.trim?.() : resolvedPath;
            await post('writeFile', { rootId: "", path: cleanPath, data }, resolvedRoot ? [resolvedRoot] : []);
            return true;
        }
        catch (e) {
            return handleError(logger, 'error', `writeFile: ${e.message}`);
        }
}
//
export async function getFileWriter(rootHandle, relPath, options = { create: true }, logger = defaultLogger) {
    try {
        const { rootHandle: resolvedRootHandle, resolvedPath } = await resolvePath(rootHandle, relPath, options?.basePath || "");
        return (await getFileHandle(resolvedRootHandle, resolvedPath, options, logger))?.createWritable?.();
    }
    catch (e) {
        return handleError(logger, 'error', `getFileWriter: ${e.message}`);
    }
}
//
export async function removeFile(rootHandle, relPath, options = { recursive: true }, logger = defaultLogger) {
    try {
        const { rootHandle: resolvedRoot, resolvedPath } = await resolvePath(rootHandle, relPath, options?.basePath || "");
        const cleanPath = resolvedPath?.trim?.()?.startsWith?.("/user/") ?
            resolvedPath?.trim?.()?.replace?.(/^\/user/g, "")?.trim?.() : resolvedPath;
        await post('remove', { rootId: "", path: cleanPath, recursive: options.recursive }, resolvedRoot ? [resolvedRoot] : []);
        return true;
    }
    catch (e) {
        return handleError(logger, 'error', `removeFile: ${e.message}`);
    }
}
//
export async function removeDirectory(rootHandle, relPath, options = { recursive: true }, logger = defaultLogger) {
    try {
        // Reuse logic from removeFile as worker distinguishes via path handling or just removeEntry
        return removeFile(rootHandle, relPath, options, logger);
    }
    catch (e) {
        return handleError(logger, 'error', `removeDirectory: ${e.message}`);
    }
}
//
export async function remove(rootHandle, relPath, options = {}, logger = defaultLogger) {
    try {
        return removeFile(rootHandle, relPath, { recursive: true, ...options }, logger);
    }
    catch (e) {
        return handleError(logger, 'error', `remove: ${e.message}`);
    }
}
//
export const openImageFilePicker = async () => {
    const $e = "showOpenFilePicker"; // @ts-ignore
    const showOpenFilePicker = window?.[$e]?.bind?.(window) ?? (await import("fest/polyfill/showOpenFilePicker.mjs"))?.[$e];
    return showOpenFilePicker(imageImportDesc);
};
//
export const downloadFile = async (file) => {
    // as file
    if (file instanceof FileSystemFileHandle) {
        file = await file.getFile();
    }
    if (typeof file == "string") {
        file = await provide(file);
    }
    ;
    const filename = file?.name;
    if (!filename)
        return; // @ts-ignore // IE10+
    if ("msSaveOrOpenBlob" in self.navigator) {
        self.navigator.msSaveOrOpenBlob(file, filename);
    }
    ;
    // for directory
    if (file instanceof FileSystemDirectoryHandle) {
        // @ts-ignore
        let dstHandle = await showDirectoryPicker?.({
            mode: "readwrite"
        })?.catch?.(console.warn.bind(console));
        //
        if (file && dstHandle) {
            // open handle relative to selected directory
            dstHandle = (await getDirectoryHandle(dstHandle, file?.name || "", { create: true })?.catch?.(console.warn.bind(console))) || dstHandle;
            return await copyFromOneHandlerToAnother(file, dstHandle, {})?.catch?.(console.warn.bind(console));
        }
        // currently, different methods are unsupported... (not implemented)
        return;
    }
    // @ts-ignore
    const fx = await (self?.showOpenFilePicker ? new Promise((r) => r({
        showOpenFilePicker: self?.showOpenFilePicker?.bind?.(window), // @ts-ignore
        showSaveFilePicker: self?.showSaveFilePicker?.bind?.(window), // @ts-ignore
    })) // @ts-ignore
        : import(/* @vite-ignore */ "fest/polyfill/showOpenFilePicker.mjs"));
    // @ts-ignore
    if (window?.showSaveFilePicker) { // @ts-ignore
        const fileHandle = await fx?.showSaveFilePicker?.({ suggestedName: filename })?.catch?.(console.warn.bind(console));
        const writableFileStream = await fileHandle?.createWritable?.({ keepExistingData: true })?.catch?.(console.warn.bind(console));
        await writableFileStream?.write?.(file)?.catch?.(console.warn.bind(console));
        await writableFileStream?.close?.()?.catch?.(console.warn.bind(console));
    }
    else {
        const a = document.createElement("a");
        try {
            a.href = URL.createObjectURL(file);
        }
        catch (e) {
            console.warn(e);
        }
        ;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            globalThis.URL.revokeObjectURL(a.href);
        }, 0);
    }
};
//
export const provide = async (req = "", rw = false) => {
    const url = req?.url ?? req;
    const cleanUrl = url?.replace?.(location.origin, "")?.trim?.();
    //
    if (cleanUrl?.startsWith?.("/user")) {
        const path = cleanUrl?.replace?.(/^\/user/g, "")?.trim?.();
        const root = await navigator?.storage?.getDirectory?.();
        const handle = await getFileHandle(root, path, { create: !!rw });
        if (rw) {
            return handle?.createWritable?.();
        }
        return handle?.getFile?.();
    }
    else {
        try {
            if (!req)
                return null;
            const r = await fetch(req);
            const blob = await r?.blob()?.catch?.(console.warn.bind(console));
            const lastModifiedHeader = r?.headers?.get?.("Last-Modified");
            const lastModified = lastModifiedHeader ? Date.parse(lastModifiedHeader) : 0;
            if (blob) {
                return new File([blob], url?.substring(url?.lastIndexOf('/') + 1), {
                    type: blob?.type,
                    lastModified: isNaN(lastModified) ? 0 : lastModified
                });
            }
        }
        catch (e) {
            return handleError(defaultLogger, 'error', `provide: ${e.message}`);
        }
    }
};
//
export const getLeast = (item) => {
    if (item?.types?.length > 0) {
        return item?.getType?.(Array.from(item?.types || [])?.at?.(-1));
    }
    return null;
};
//
export const dropFile = async (file, dest = "/user/"?.trim?.()?.replace?.(/\s+/g, '-'), current) => {
    const fs = await resolveRootHandle(null);
    const path = getDir(dest?.trim?.()?.startsWith?.("/user/") ? dest?.replace?.(/^\/user/g, "")?.trim?.() : dest);
    const user = path?.replace?.("/user", "")?.trim?.();
    //
    file = file instanceof File ? file : (new File([file], UUIDv4() + "." + (file?.type?.split?.("/")?.[1] || "tmp")));
    //
    const fp = user + (file?.name || "wallpaper")?.trim?.()?.replace?.(/\s+/g, '-');
    await writeFile(fs, fp, file);
    // TODO! needs to fix same directory scope
    current?.set?.("/user" + fp?.trim?.()?.replace?.(/\s+/g, '-'), file);
    return "/user" + fp?.trim?.();
};
//
export const uploadDirectory = async (dest = "/user/", id = null) => {
    dest = dest?.trim?.()?.startsWith?.("/user/") ? dest?.trim?.()?.replace?.(/^\/user/g, "")?.trim?.() : dest;
    if (!globalThis.showDirectoryPicker) {
        return;
    }
    // @ts-ignore
    const srcHandle = await showDirectoryPicker?.({
        mode: "readonly", id
    })?.catch?.(console.warn.bind(console));
    if (!srcHandle)
        return;
    //
    const dstHandle = await getDirectoryHandle(await resolveRootHandle(null), dest + (dest?.trim?.()?.endsWith?.("/") ? "" : "/") + srcHandle.name?.trim?.()?.replace?.(/\s+/g, '-'), { create: true });
    if (!dstHandle)
        return;
    return await copyFromOneHandlerToAnother(srcHandle, dstHandle, {})?.catch?.(console.warn.bind(console));
};
//
export const uploadFile = async (dest = "/user/"?.trim?.()?.replace?.(/\s+/g, '-'), current) => {
    const $e = "showOpenFilePicker";
    dest = dest?.trim?.()?.startsWith?.("/user/") ? dest?.trim?.()?.replace?.(/^\/user/g, "")?.trim?.() : dest;
    // @ts-ignore
    const showOpenFilePicker = window?.[$e]?.bind?.(window) ?? (await import("fest/polyfill/showOpenFilePicker.mjs"))?.[$e];
    return showOpenFilePicker({ ...generalFileImportDesc, multiple: true })?.then?.(async (handles = []) => {
        for (const handle of handles) {
            const file = handle instanceof File ? handle : (await handle?.getFile?.());
            await dropFile(file, dest, current);
        }
    });
};
//
export const ghostImage = typeof Image != "undefined" ? new Image() : null;
if (ghostImage) {
    ghostImage.decoding = "async";
    ghostImage.width = 24;
    ghostImage.height = 24;
    //
    try {
        ghostImage.src = URL.createObjectURL(new Blob([`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 384 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 288c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128z"/></svg>`], { type: "image/svg+xml" }));
    }
    catch (e) { }
}
/*  // in drag-start
    ev.dataTransfer.effectAllowed = "copyLink";
    ev?.dataTransfer?.clearData?.();
    ev?.dataTransfer?.setDragImage?.(ghostImage, 0, 0);
*/
//
export const attachFile = (transfer, file, path = "") => {
    try {
        const url = URL.createObjectURL(file);
        if (file?.type && file?.type != "text/plain") {
            transfer?.items?.add?.(file, file?.type || "text/plain");
        }
        else {
            transfer?.add?.(file);
        }
        if (path) {
            transfer?.items?.add?.(path, "text/plain");
        }
        ;
        transfer?.setData?.("text/uri-list", url);
        transfer?.setData?.("DownloadURL", file?.type + ":" + file?.name + ":" + url);
    }
    catch (e) { }
};
//
export const dropAsTempFile = async (data) => {
    const items = (data)?.items;
    const item = items?.[0];
    const isImage = item?.types?.find?.((n) => n?.startsWith?.("image/"));
    const blob = await (data?.files?.[0] ?? ((isImage ? item?.getType?.(isImage) : null) || getLeast(item)));
    return dropFile(blob, "/user/temp/"?.trim?.()?.replace?.(/\s+/g, '-'));
};
//
export const clearAllInDirectory = async (rootHandle = null, relPath = "", options = {}, logger = defaultLogger) => {
    try {
        const { rootHandle: resolvedRoot, resolvedPath } = await resolvePath(rootHandle, relPath, options?.basePath || "");
        const cleanPath = resolvedPath?.trim?.()?.startsWith?.("/user/") ?
            resolvedPath?.trim?.()?.replace?.(/^\/user/g, "")?.trim?.() : resolvedPath;
        await post('remove', { rootId: "", path: cleanPath, recursive: true }, resolvedRoot ? [resolvedRoot] : []);
    }
    catch (e) {
        return handleError(logger, 'error', `clearAllInDirectory: ${e.message}`);
    }
};
// used for import/export by file pickers (OPFS, FileSystem, etc. )
export const copyFromOneHandlerToAnother = async (fromHandle, toHandle, options = {}, logger = defaultLogger) => {
    // We delegate to worker
    return post('copy', { from: fromHandle, to: toHandle }, [fromHandle, toHandle]);
};
//
export const handleIncomingEntries = (data, destPath = "/user/", rootHandle = null, onItemHandled) => {
    const tasks = [];
    const items = Array.from(data?.items ?? []);
    const files = Array.from(data?.files ?? []);
    const dataArray = Array.isArray(data) ? data : [...((data?.[Symbol.iterator] ? data : [data]))];
    //
    return Promise.try(async () => {
        const resolvedRoot = await resolveRootHandle(rootHandle);
        //
        const processItem = async (item) => {
            // Handle FileSystemHandle (modern drag/drop)
            let handle;
            if (item.kind === 'file' || item.kind === 'directory') {
                try {
                    // @ts-ignore
                    handle = await item.getAsFileSystemHandle?.();
                }
                catch { }
            }
            if (handle) {
                if (handle.kind === 'directory') {
                    const nwd = await getDirectoryHandle(resolvedRoot, destPath + (handle.name || "").trim().replace(/\s+/g, '-'), { create: true });
                    if (nwd)
                        tasks.push(copyFromOneHandlerToAnother(handle, nwd, { create: true }));
                }
                else {
                    const file = await handle.getFile();
                    const path = destPath + (file.name || handle.name).trim().replace(/\s+/g, '-');
                    tasks.push(writeFile(resolvedRoot, path, file).then(() => onItemHandled?.(file, path)));
                }
                return;
            }
            // Handle File object (fallback)
            if (item.kind === 'file' || item instanceof File) {
                const file = item instanceof File ? item : item.getAsFile();
                if (file) {
                    const path = destPath + (file.name).trim().replace(/\s+/g, '-');
                    tasks.push(writeFile(resolvedRoot, path, file).then(() => onItemHandled?.(file, path)));
                }
                return;
            }
        };
        // 1. Try DataTransfer items
        if (items?.length > 0) {
            for (const item of items) {
                await processItem(item);
            }
        }
        // 2. Try Files
        if (files?.length > 0) {
            for (const file of files) {
                await processItem(file);
            }
        }
        // 3. Array of Files
        if (dataArray?.length > 0) {
            for (const item of dataArray) {
                await processItem(item);
            }
        }
        // 4. Handle text/uri-list
        const uriList = data?.getData?.("text/uri-list") || data?.getData?.("text/plain");
        if (uriList && typeof uriList === "string") {
            const urls = uriList.split(/\r?\n/).filter(Boolean);
            for (const url of urls) {
                if (url.startsWith("file://"))
                    continue;
                // Detect if it's internal /user/ path
                if (url.startsWith("/user/")) {
                    const src = url.trim();
                    // Copy internal
                    tasks.push(Promise.try(async () => {
                        const srcHandle = await getHandler(resolvedRoot, src);
                        if (srcHandle?.handle) {
                            const name = src.split("/").filter(Boolean).pop();
                            if (srcHandle.type === 'directory') {
                                const nwd = await getDirectoryHandle(resolvedRoot, destPath + name, { create: true });
                                await copyFromOneHandlerToAnother(srcHandle.handle, nwd, { create: true });
                            }
                            else {
                                const file = await srcHandle.handle.getFile();
                                const path = destPath + name;
                                await writeFile(resolvedRoot, path, file);
                                onItemHandled?.(file, path);
                            }
                        }
                    }));
                }
                else {
                    // External URL
                    tasks.push(Promise.try(async () => {
                        const file = await provide(url);
                        if (file) {
                            const path = destPath + file.name;
                            await writeFile(resolvedRoot, path, file);
                            onItemHandled?.(file, path);
                        }
                    }));
                }
            }
        }
        // 5. Handle ClipboardItems (for async clipboard API)
        // This is usually passed as an array of ClipboardItem objects, but `data` here might be DataTransfer.
        // If passed explicitly:
        if (dataArray?.[0] instanceof ClipboardItem) {
            for (const item of dataArray) {
                for (const type of item.types) {
                    if (type.startsWith("image/") || type.startsWith("text/")) {
                        const blob = await item.getType(type);
                        const ext = type.split("/")[1].split("+")[0] || "txt"; // simplified
                        const file = new File([blob], `clipboard-${Date.now()}.${ext}`, { type });
                        const path = destPath + file.name;
                        tasks.push(writeFile(resolvedRoot, path, file).then(() => onItemHandled?.(file, path)));
                    }
                }
            }
        }
        //
        await Promise.allSettled(tasks).catch(console.warn.bind(console));
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT1BGUy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIk9QRlMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE1BQU0sRUFBWSxNQUFNLFdBQVcsQ0FBQztBQUM3QyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ3RDLE9BQU8sRUFBRSxtQkFBbUIsRUFBc0MsbUJBQW1CLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFFNUcsb0RBQW9EO0FBQ3BELE9BQU8sVUFBVSxNQUFNLGlDQUFpQyxDQUFDO0FBRXpELEVBQUU7QUFDRixJQUFJLGFBQWEsR0FBUSxJQUFJLENBQUM7QUFDOUIsTUFBTSxlQUFlLEdBQUcsT0FBTyx3QkFBd0IsS0FBSyxXQUFXLElBQUksSUFBSSxZQUFZLHdCQUF3QixDQUFDO0FBRXBILEVBQUU7QUFDRixNQUFNLFNBQVMsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBRTVCLElBQUksaUJBQWlCLEdBQXdCLElBQUksQ0FBQztBQUVsRCxNQUFNLENBQUMsTUFBTSxZQUFZLEdBQUcsR0FBaUIsRUFBRTtJQUMzQyxJQUFJLGlCQUFpQjtRQUFFLE9BQU8saUJBQWlCLENBQUM7SUFFaEQsaUJBQWlCLEdBQUcsSUFBSSxPQUFPLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxFQUFFO1FBQzlDLG1HQUFtRztRQUNuRyxJQUFJLE9BQU8sTUFBTSxLQUFLLFdBQVcsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1lBQ3BELElBQUksQ0FBQztnQkFDRCw0Q0FBNEM7Z0JBQzVDLE1BQU0sV0FBVyxHQUFHLE1BQU0sbUJBQW1CLENBQUM7b0JBQzFDLElBQUksRUFBRSxhQUFhO29CQUNuQixNQUFNLEVBQUUsVUFBVTtpQkFDckIsQ0FBQyxDQUFDO2dCQUVILGdFQUFnRTtnQkFDaEUsYUFBYSxHQUFHLElBQUksbUJBQW1CLENBQUMsYUFBYSxFQUFFLEtBQUssSUFBSSxFQUFFLENBQUMsV0FBVyxFQUFFO29CQUM1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Q0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2xFLElBQUksS0FBSyxFQUFFLE1BQU0sSUFBSSxDQUFDO1lBQUUsT0FBTyxJQUFJLENBQUM7UUFFcEMsTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDbkcsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUUzRyxJQUFJLFNBQVMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFBQyxPQUFPLElBQUksQ0FBQztRQUFDLENBQUM7UUFBQSxDQUFDO1FBRTNELGtFQUFrRTtRQUNsRSxNQUFNLEdBQUcsR0FBRyxNQUFNLGtCQUFrQixDQUFDLFlBQVksRUFBRSxPQUFPLEVBQUUsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDMUYsT0FBTyxHQUFHLEVBQUUsYUFBYSxFQUFFLENBQUMsUUFBUSxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBQUMsT0FBTyxDQUFNLEVBQUUsQ0FB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LENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQUUsR0FBRyxHQUFHLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBRWxILEVBQUU7SUFDRixNQUFNLEVBQUUsR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxJQUFJLFdBQVcsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ2hGLE1BQU0sU0FBUyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFFOUIsMENBQTBDO0lBQzFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxPQUFPLEdBQUcsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3JFLE9BQU8sT0FBTyxHQUFHLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDO0FBQ2xDLENBQUMsQ0FBQTtBQUVELEVBQUU7QUFDRixNQUFNLENBQUMsTUFBTSxlQUFlLEdBQUcsS0FBSyxFQUFFLElBQUksR0FBRyxRQUFRLEVBQUUsS0FBVSxJQUFJLEVBQUUsRUFBRTtJQUNyRSxJQUFJLEdBQUcsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFDM0csSUFBSSxDQUFDLFVBQVUsQ0FBQyxtQkFB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LElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQzt3QkFDeEQsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUN0QyxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxhQUFhO3dCQUNwRSxNQUFNLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLGFBQWEsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLEdBQUcsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQzt3QkFDMUUsTUFBTSxJQUFJLEdBQUcsUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7d0JBQ2xDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzVGLENBQUM7Z0JBQ0wsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDO1FBRUQsRUFBRTtRQUNGLE1BQU0sT0FBTyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUN0RSxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFVVSUR2NCwgUHJvbWlzZWQgfSBmcm9tICdmZXN0L2NvcmUnO1xuaW1wb3J0IHsgb2JzZXJ2ZSB9IGZyb20gJ2Zlc3Qvb2JqZWN0JztcbmltcG9ydCB7IGNyZWF0ZVdvcmtlckNoYW5uZWwsIGNyZWF0ZVF1ZXVlZE9wdGltaXplZFdvcmtlckNoYW5uZWwsIFF1ZXVlZFdvcmtlckNoYW5uZWwgfSBmcm9tICdmZXN0L3VuaWZvcm0nO1xuXG4vLyBJbXBvcnQgdGhlIE9QRlMgd29ya2VyIHVzaW5nIFZpdGUncyB3b3JrZXIgc3ludGF4XG5pbXBvcnQgT1BGU1dvcmtlciBmcm9tICcuL09QRlMudW5pZm9ybS53b3JrZXIudHM/d29ya2VyJztcblxuLy9cbmxldCB3b3JrZXJDaGFubmVsOiBhbnkgPSBudWxsO1xuY29uc3QgaXNTZXJ2aWNlV29ya2VyID0gdHlwZW9mIFNlcnZpY2VXb3JrZXJHbG9iYWxTY29wZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBzZWxmIGluc3RhbmNlb2YgU2VydmljZVdvcmtlckdsb2JhbFNjb3BlO1xuXG4vL1xuY29uc3Qgb2JzZXJ2ZXJzID0gbmV3IE1hcCgpO1xuXG5sZXQgd29ya2VySW5pdFByb21pc2U6IFByb21pc2U8YW55PiB8IG51bGwgPSBudWxsO1xuXG5leHBvcnQgY29uc3QgZW5zdXJlV29ya2VyID0gKCk6IFByb21pc2U8YW55PiA9PiB7XG4gICAgaWYgKHdvcmtlckluaXRQcm9taXNlKSByZXR1cm4gd29ya2VySW5pdFByb21pc2U7XG5cbiAgICB3b3JrZXJJbml0UHJvbWlzZSA9IG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlKSA9PiB7XG4gICAgICAgIC8vIEluIFNlcnZpY2UgV29ya2VyIGNvbnRleHQgd2UgbmV2ZXIgaW5zdGFudGlhdGUgZGVkaWNhdGVkIHdvcmtlciwgZGlyZWN0SGFuZGxlcnMgYXJlIHVzZWQgaW5zdGVhZFxuICAgICAgICBpZiAodHlwZW9mIFdvcmtlciAhPT0gXCJ1bmRlZmluZWRcIiAmJiAhaXNTZXJ2aWNlV29ya2VyKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIC8vIENyZWF0ZSBiYXNpYyB3b3JrZXIgY2hhbm5lbCBmaXJzdCB0byB0ZXN0XG4gICAgICAgICAgICAgICAgY29uc3QgYmFzZUNoYW5uZWwgPSBhd2FpdCBjcmVhdGVXb3JrZXJDaGFubmVsKHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJvcGZzLXdvcmtlclwiLFxuICAgICAgICAgICAgICAgICAgICBzY3JpcHQ6IE9QRlNXb3JrZXJcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIC8vIENyZWF0ZSBxdWV1ZWQgb3B0aW1pemVkIHdvcmtlciBjaGFubmVsIHVzaW5nIHRoZSBiYXNlIGNoYW5uZWxcbiAgICAgICAgICAgICAgICB3b3JrZXJDaGFubmVsID0gbmV3IFF1ZXVlZFdvcmtlckNoYW5uZWwoXCJvcGZzLXdvcmtlclwiLCBhc3luYyAoKSA9PiBiYXNlQ2hhbm5lbCwge1xuICAgICAgICAgICAgICAgICAgICB0aW1lb3V0OiAzMDAwMCwgLy8gMzAgc2Vjb25kIHRpbWVvdXQgZm9yIGZpbGUgb3BlcmF0aW9ucyAoZmlsZSBvcHMgY2FuIGJlIHNsb3cpXG4gICAgICAgICAgICAgICAgICAgIHJldHJpZXM6IDMsXG4gICAgICAgICAgICAgICAgICAgIGJhdGNoaW5nOiB0cnVlLCAvLyBFbmFibGUgbWVzc2FnZSBiYXRjaGluZyBmb3IgYmV0dGVyIHBlcmZvcm1hbmNlXG4gICAgICAgICAgICAgICAgICAgIGNvbXByZXNzaW9uOiBmYWxzZSAvLyBGaWxlIG9wZXJhdGlvbnMgZG9uJ3QgYmVuZWZpdCBmcm9tIGNvbXByZXNzaW9uXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvLyBSZXNvbHZlIGltbWVkaWF0ZWx5IC0gb3BlcmF0aW9ucyB3aWxsIHF1ZXVlIHVudGlsIGNoYW5uZWwgaXMgcmVhZHlcbiAgICAgICAgICAgICAgICByZXNvbHZlKHdvcmtlckNoYW5uZWwpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIk9QRlNVbmlmb3JtV29ya2VyIGluc3RhbnRpYXRpb24gZmFpbGVkLCBmYWxsaW5nIGJhY2sgdG8gbWFpbiB0aHJlYWQuLi5cIiwgZSk7XG4gICAgICAgICAgICAgICAgd29ya2VyQ2hhbm5lbCA9IG51bGw7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShudWxsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHdvcmtlckNoYW5uZWwgPSBudWxsO1xuICAgICAgICAgICAgcmVzb2x2ZShudWxsKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHdvcmtlckluaXRQcm9taXNlO1xufTtcblxuLy8gRGlyZWN0IE9QRlMgaGFuZGxlcnMgZm9yIFNlcnZpY2UgV29ya2VyIGNvbnRleHQgKHdoZXJlIHBvc3RNZXNzYWdlIGRvZXNuJ3Qgd29yayBhcyBleHBlY3RlZClcbi8vIERpcmVjdCBPUEZTIGhhbmRsZXJzIGZvciBTZXJ2aWNlIFdvcmtlciBjb250ZXh0ICh3aGVyZSBwb3N0TWVzc2FnZSBkb2Vzbid0IHdvcmsgYXMgZXhwZWN0ZWQpXG5leHBvcnQgY29uc3QgZGlyZWN0SGFuZGxlcnM6IFJlY29yZDxzdHJpbmcsIChwYXlsb2FkOiBhbnkpID0+IFByb21pc2U8YW55Pj4gPSB7XG4gICAgcmVhZERpcmVjdG9yeTogYXN5bmMgKHsgcm9vdElkLCBwYXRoLCBjcmVhdGUgfTogYW55KSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCByb290ID0gYXdhaXQgbmF2aWdhdG9yLnN0b3JhZ2UuZ2V0RGlyZWN0b3J5KCk7XG4gICAgICAgICAgICBjb25zdCBwYXJ0cyA9IChwYXRoIHx8IFwiXCIpLnRyaW0oKS5yZXBsYWNlKC9cXC8rL2csIFwiL1wiKS5zcGxpdChcIi9cIikuZmlsdGVyKChwOiBzdHJpbmcpID0+IHApO1xuICAgICAgICAgICAgbGV0IGN1cnJlbnQgPSByb290O1xuICAgICAgICAgICAgZm9yIChjb25zdCBwYXJ0IG9mIHBhcnRzKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudCA9IGF3YWl0IGN1cnJlbnQuZ2V0RGlyZWN0b3J5SGFuZGxlKHBhcnQsIHsgY3JlYXRlIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgZW50cmllczogYW55W10gPSBbXTtcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIGZvciBhd2FpdCAoY29uc3QgW25hbWUsIGVudHJ5XSBvZiBjdXJyZW50LmVudHJpZXMoKSkge1xuICAgICAgICAgICAgICAgIGVudHJpZXMucHVzaChbbmFtZSwgZW50cnldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBlbnRyaWVzO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCJEaXJlY3QgcmVhZERpcmVjdG9yeSBlcnJvcjpcIiwgZSk7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcmVhZEZpbGU6IGFzeW5jICh7IHJvb3RJZCwgcGF0aCwgdHlwZSB9OiBhbnkpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHJvb3QgPSBhd2FpdCBuYXZpZ2F0b3Iuc3RvcmFnZS5nZXREaXJlY3RvcnkoKTtcbiAgICAgICAgICAgIGNvbnN0IHBhcnRzID0gKHBhdGggfHwgXCJcIikudHJpbSgpLnJlcGxhY2UoL1xcLysvZywgXCIvXCIpLnNwbGl0KFwiL1wiKS5maWx0ZXIoKHA6IHN0cmluZykgPT4gcCk7XG4gICAgICAgICAgICBjb25zdCBmaWxlbmFtZSA9IHBhcnRzLnBvcCgpO1xuICAgICAgICAgICAgbGV0IGRpciA9IHJvb3Q7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHBhcnQgb2YgcGFydHMpIHtcbiAgICAgICAgICAgICAgICBkaXIgPSBhd2FpdCBkaXIuZ2V0RGlyZWN0b3J5SGFuZGxlKHBhcnQsIHsgY3JlYXRlOiBmYWxzZSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGZpbGVIYW5kbGUgPSBhd2FpdCBkaXIuZ2V0RmlsZUhhbmRsZShmaWxlbmFtZSEsIHsgY3JlYXRlOiBmYWxzZSB9KTtcbiAgICAgICAgICAgIGNvbnN0IGZpbGUgPSBhd2FpdCBmaWxlSGFuZGxlLmdldEZpbGUoKTtcbiAgICAgICAgICAgIGlmICh0eXBlID09PSBcInRleHRcIikgcmV0dXJuIGF3YWl0IGZpbGUudGV4dCgpO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT09IFwiYXJyYXlCdWZmZXJcIikgcmV0dXJuIGF3YWl0IGZpbGUuYXJyYXlCdWZmZXIoKTtcbiAgICAgICAgICAgIHJldHVybiBmaWxlO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCJEaXJlY3QgcmVhZEZpbGUgZXJyb3I6XCIsIGUpO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgd3JpdGVGaWxlOiBhc3luYyAoeyByb290SWQsIHBhdGgsIGRhdGEgfTogYW55KSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCByb290ID0gYXdhaXQgbmF2aWdhdG9yLnN0b3JhZ2UuZ2V0RGlyZWN0b3J5KCk7XG4gICAgICAgICAgICBjb25zdCBwYXJ0cyA9IChwYXRoIHx8IFwiXCIpLnRyaW0oKS5yZXBsYWNlKC9cXC8rL2csIFwiL1wiKS5zcGxpdChcIi9cIikuZmlsdGVyKChwOiBzdHJpbmcpID0+IHApO1xuICAgICAgICAgICAgY29uc3QgZmlsZW5hbWUgPSBwYXJ0cy5wb3AoKTtcbiAgICAgICAgICAgIGxldCBkaXIgPSByb290O1xuICAgICAgICAgICAgZm9yIChjb25zdCBwYXJ0IG9mIHBhcnRzKSB7XG4gICAgICAgICAgICAgICAgZGlyID0gYXdhaXQgZGlyLmdldERpcmVjdG9yeUhhbmRsZShwYXJ0LCB7IGNyZWF0ZTogdHJ1ZSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGZpbGVIYW5kbGUgPSBhd2FpdCBkaXIuZ2V0RmlsZUhhbmRsZShmaWxlbmFtZSEsIHsgY3JlYXRlOiB0cnVlIH0pO1xuICAgICAgICAgICAgY29uc3Qgd3JpdGFibGUgPSBhd2FpdCBmaWxlSGFuZGxlLmNyZWF0ZVdyaXRhYmxlKCk7XG4gICAgICAgICAgICBhd2FpdCB3cml0YWJsZS53cml0ZShkYXRhKTtcbiAgICAgICAgICAgIGF3YWl0IHdyaXRhYmxlLmNsb3NlKCk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKFwiRGlyZWN0IHdyaXRlRmlsZSBlcnJvcjpcIiwgZSk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcmVtb3ZlOiBhc3luYyAoeyByb290SWQsIHBhdGgsIHJlY3Vyc2l2ZSB9OiBhbnkpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHJvb3QgPSBhd2FpdCBuYXZpZ2F0b3Iuc3RvcmFnZS5nZXREaXJlY3RvcnkoKTtcbiAgICAgICAgICAgIGNvbnN0IHBhcnRzID0gKHBhdGggfHwgXCJcIikudHJpbSgpLnJlcGxhY2UoL1xcLysvZywgXCIvXCIpLnNwbGl0KFwiL1wiKS5maWx0ZXIoKHA6IHN0cmluZykgPT4gcCk7XG4gICAgICAgICAgICBjb25zdCBuYW1lID0gcGFydHMucG9wKCk7XG4gICAgICAgICAgICBsZXQgZGlyID0gcm9vdDtcbiAgICAgICAgICAgIGZvciAoY29uc3QgcGFydCBvZiBwYXJ0cykge1xuICAgICAgICAgICAgICAgIGRpciA9IGF3YWl0IGRpci5nZXREaXJlY3RvcnlIYW5kbGUocGFydCwgeyBjcmVhdGU6IGZhbHNlIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYXdhaXQgZGlyLnJlbW92ZUVudHJ5KG5hbWUhLCB7IHJlY3Vyc2l2ZSB9KTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGNhdGNoIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBjb3B5OiBhc3luYyAoeyBmcm9tLCB0byB9OiBhbnkpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGNvcHlSZWN1cnNpdmUgPSBhc3luYyAoc291cmNlOiBhbnksIGRlc3Q6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChzb3VyY2Uua2luZCA9PT0gJ2RpcmVjdG9yeScpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIGF3YWl0IChjb25zdCBbbmFtZSwgZW50cnldIG9mIHNvdXJjZS5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbnRyeS5raW5kID09PSAnZGlyZWN0b3J5Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG5ld0Rlc3QgPSBhd2FpdCBkZXN0LmdldERpcmVjdG9yeUhhbmRsZShuYW1lLCB7IGNyZWF0ZTogdHJ1ZSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBjb3B5UmVjdXJzaXZlKGVudHJ5LCBuZXdEZXN0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZmlsZSA9IGF3YWl0IGVudHJ5LmdldEZpbGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXdGaWxlID0gYXdhaXQgZGVzdC5nZXRGaWxlSGFuZGxlKG5hbWUsIHsgY3JlYXRlOiB0cnVlIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHdyaXRhYmxlID0gYXdhaXQgbmV3RmlsZS5jcmVhdGVXcml0YWJsZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHdyaXRhYmxlLndyaXRlKGZpbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHdyaXRhYmxlLmNsb3NlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBmaWxlID0gYXdhaXQgc291cmNlLmdldEZpbGUoKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgd3JpdGFibGUgPSBhd2FpdCBkZXN0LmNyZWF0ZVdyaXRhYmxlKCk7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHdyaXRhYmxlLndyaXRlKGZpbGUpO1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCB3cml0YWJsZS5jbG9zZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBhd2FpdCBjb3B5UmVjdXJzaXZlKGZyb20sIHRvKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCJEaXJlY3QgY29weSBlcnJvcjpcIiwgZSk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gUGxhY2Vob2xkZXIgZm9yIG9ic2VydmUvdW5vYnNlcnZlIChGaWxlU3lzdGVtT2JzZXJ2ZXIgbm90IGF2YWlsYWJsZSBpbiBhbGwgY29udGV4dHMpXG4gICAgb2JzZXJ2ZTogYXN5bmMgKCkgPT4gZmFsc2UsXG4gICAgdW5vYnNlcnZlOiBhc3luYyAoKSA9PiB0cnVlLFxuICAgIG1vdW50OiBhc3luYyAoKSA9PiB0cnVlLFxuICAgIHVubW91bnQ6IGFzeW5jICgpID0+IHRydWVcbn07XG5cbi8vXG5leHBvcnQgY29uc3QgcG9zdCA9ICh0eXBlOiBzdHJpbmcsIHBheWxvYWQ6IGFueSA9IHt9LCB0cmFuc2ZlcjogYW55W10gPSBbXSkgPT4ge1xuICAgIC8vIEluIFNlcnZpY2UgV29ya2VyIGNvbnRleHQsIGV4ZWN1dGUgZGlyZWN0bHkgaW5zdGVhZCBvZiB1c2luZyBwb3N0TWVzc2FnZVxuICAgIGlmIChpc1NlcnZpY2VXb3JrZXIgJiYgZGlyZWN0SGFuZGxlcnNbdHlwZV0pIHtcbiAgICAgICAgcmV0dXJuIGRpcmVjdEhhbmRsZXJzW3R5cGVdKHBheWxvYWQpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBjaGFubmVsID0gYXdhaXQgZW5zdXJlV29ya2VyKCk7XG4gICAgICAgICAgICBpZiAoIWNoYW5uZWwpIHtcbiAgICAgICAgICAgICAgICAvLyBGYWxsYmFjayB0byBkaXJlY3QgaGFuZGxlcnMgaWYgbm8gd29ya2VyIGNoYW5uZWwgYXZhaWxhYmxlXG4gICAgICAgICAgICAgICAgaWYgKGRpcmVjdEhhbmRsZXJzW3R5cGVdKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKGRpcmVjdEhhbmRsZXJzW3R5cGVdKHBheWxvYWQpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlamVjdChuZXcgRXJyb3IoJ05vIHdvcmtlciBjaGFubmVsIGF2YWlsYWJsZScpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gVXNlIG9wdGltaXplZCB1bmlmb3JtIGNoYW5uZWwgQVBJXG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBjaGFubmVsLnJlcXVlc3QodHlwZSwgcGF5bG9hZCk7XG4gICAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH1cbiAgICB9KTtcbn07XG5cbi8vXG5leHBvcnQgY29uc3QgZ2V0RGlyID0gKGRlc3QpID0+IHtcbiAgICBpZiAodHlwZW9mIGRlc3QgIT0gXCJzdHJpbmdcIikgcmV0dXJuIGRlc3Q7IGRlc3QgPSBkZXN0Py50cmltPy4oKSB8fCBkZXN0O1xuICAgIGlmICghZGVzdD8uZW5kc1dpdGg/LihcIi9cIikpIHsgZGVzdCA9IGRlc3Q/LnRyaW0/LigpPy5zcGxpdD8uKFwiL1wiKT8uc2xpY2UoMCwgLTEpPy5qb2luPy4oXCIvXCIpPy50cmltPy4oKSB8fCBkZXN0OyB9O1xuICAgIGNvbnN0IHAxID0gIWRlc3Q/LnRyaW0oKT8uZW5kc1dpdGgoXCIvXCIpID8gKGRlc3QgKyBcIi9cIikgOiBkZXN0OyByZXR1cm4gKCFwMT8uc3RhcnRzV2l0aChcIi9cIikgPyAoXCIvXCIgKyBwMSkgOiBwMSk7XG59XG5cbi8vXG5leHBvcnQgY29uc3QgaW1hZ2VJbXBvcnREZXNjID0ge1xuICAgIHN0YXJ0SW46IFwicGljdHVyZXNcIiwgbXVsdGlwbGU6IGZhbHNlLFxuICAgIHR5cGVzOiBbeyBkZXNjcmlwdGlvbjogXCJ3YWxscGFwZXJcIiwgYWNjZXB0OiB7IFwiaW1hZ2UvKlwiOiBbXCIucG5nXCIsIFwiLmdpZlwiLCBcIi5qcGdcIiwgXCIuanBlZ1wiLCBcIi53ZWJwXCIsIFwiLmp4bFwiLF0gfSwgfV1cbn1cblxuLy9cbmV4cG9ydCBjb25zdCBnZW5lcmFsRmlsZUltcG9ydERlc2MgPSB7XG4gICAgc3RhcnRJbjogXCJkb2N1bWVudHNcIiwgbXVsdGlwbGU6IGZhbHNlLFxuICAgIHR5cGVzOiBbeyBkZXNjcmlwdGlvbjogXCJmaWxlc1wiLCBhY2NlcHQ6IHsgXCJhcHBsaWNhdGlvbi8qXCI6IFtcIi50eHRcIiwgXCIubWRcIiwgXCIuaHRtbFwiLCBcIi5odG1cIiwgXCIuY3NzXCIsIFwiLmpzXCIsIFwiLmpzb25cIiwgXCIuY3N2XCIsIFwiLnhtbFwiLCBcIi5qcGdcIiwgXCIuanBlZ1wiLCBcIi5wbmdcIiwgXCIuZ2lmXCIsIFwiLndlYnBcIiwgXCIuc3ZnXCIsIFwiLmljb1wiLCBcIi5tcDNcIiwgXCIud2F2XCIsIFwiLm1wNFwiLCBcIi53ZWJtXCIsIFwiLnBkZlwiLCBcIi56aXBcIiwgXCIucmFyXCIsIFwiLjd6XCIsXSB9LCB9XVxufVxuXG4vLyBcIi9cIiBkZWZhdWx0IGlzIE9QRlMgcm9vdCAoYnV0IG1heSBhbm90aGVyIHJvb3QpLCBcIi91c2VyL1wiIGlzIE9QRlMgcm9vdCBieSBkZWZhdWx0IHRvbywgXCIvYXNzZXRzL1wiIGlzIHVua25vd24gYmFja2VuZCByZWxhdGVkIGFzc2V0c1xuZXhwb3J0IGNvbnN0IG1hcHBlZFJvb3RzID0gbmV3IE1hcDxzdHJpbmcsICgpID0+IFByb21pc2U8YW55Pj4oW1xuICAgIFtcIi9cIiwgYXN5bmMgKCkgPT4gKChhd2FpdCBuYXZpZ2F0b3I/LnN0b3JhZ2U/LmdldERpcmVjdG9yeT8uKCkpKV0sXG4gICAgW1wiL3VzZXIvXCIsIGFzeW5jICgpID0+IChhd2FpdCBuYXZpZ2F0b3I/LnN0b3JhZ2U/LmdldERpcmVjdG9yeT8uKCkpXSxcbiAgICBbXCIvYXNzZXRzL1wiLCBhc3luYyAoKSA9PiB7IGNvbnNvbGUud2FybihcIkJhY2tlbmQgcmVsYXRlZCBBUEkgbm90IGltcGxlbWVudGVkIVwiKTsgcmV0dXJuIG51bGw7IH1dLFxuXSk7XG5cbi8vXG5leHBvcnQgY29uc3QgY3VycmVudEhhbmRsZU1hcCA9IG5ldyBNYXA8c3RyaW5nLCBhbnk+KClcblxuLy9cbmV4cG9ydCBjb25zdCBtb3VudEFzUm9vdCA9IGFzeW5jIChmb3JJZDogc3RyaW5nLCBjb3B5RnJvbUludGVybmFsPzogYm9vbGVhbikgPT4ge1xuICAgIGNvbnN0IGNsZWFuSWQgPSBmb3JJZD8udHJpbT8uKCk/LnJlcGxhY2U/LigvXlxcLy8sIFwiXCIpPy50cmltPy4oKT8uc3BsaXQ/LihcIi9cIik/LmZpbHRlcj8uKHAgPT4gISFwPy50cmltPy4oKSk/LmF0Py4oMCk7XG5cbiAgICAvLyBAdHMtaWdub3JlXG4gICAgY29uc3Qgcm9vdEhhbmRsZSA9IGN1cnJlbnRIYW5kbGVNYXA/LmdldChjbGVhbklkKSA/PyAoYXdhaXQgc2hvd0RpcmVjdG9yeVBpY2tlcj8uKHtcbiAgICAgICAgbW9kZTogXCJyZWFkd3JpdGVcIixcbiAgICAgICAgaWQ6IGAke2NsZWFuSWR9YFxuICAgIH0pPy5jYXRjaD8uKGNvbnNvbGUud2Fybi5iaW5kKGNvbnNvbGUpKSk7XG5cbiAgICAvL1xuICAgIGlmIChyb290SGFuZGxlICYmIGNsZWFuSWQgJiYgdHlwZW9mIGNsZWFuSWQgPT0gXCJzdHJpbmdcIikgeyBjdXJyZW50SGFuZGxlTWFwPy5zZXQ/LihjbGVhbklkLCByb290SGFuZGxlKTsgfTtcbiAgICBpZiAocm9vdEhhbmRsZSAmJiB0eXBlb2YgbG9jYWxTdG9yYWdlICE9IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgbG9jYWxTdG9yYWdlPy5zZXRJdGVtPy4oXCJvcGZzLm1vdW50ZWRcIiwgSlNPTi5zdHJpbmdpZnkoWy4uLkpTT04ucGFyc2UobG9jYWxTdG9yYWdlPy5nZXRJdGVtPy4oXCJvcGZzLm1vdW50ZWRcIikgfHwgXCJbXVwiKSwgY2xlYW5JZF0pKTtcbiAgICB9O1xuXG4gICAgLy9cbiAgICBpZiAocm9vdEhhbmRsZSkge1xuICAgICAgICAvLyBTeW5jIHRvIHdvcmtlclxuICAgICAgICBwb3N0KCdtb3VudCcsIHsgaWQ6IGNsZWFuSWQsIGhhbmRsZTogcm9vdEhhbmRsZSB9KTtcbiAgICB9XG5cbiAgICAvL1xuICAgIGlmIChjb3B5RnJvbUludGVybmFsICYmIHJvb3RIYW5kbGUgJiYgY2xlYW5JZCA9PSBcInVzZXJcIikge1xuICAgICAgICBjb25zdCBpbnRlcm5hbFJvb3QgPSBhd2FpdCBuYXZpZ2F0b3I/LnN0b3JhZ2U/LmdldERpcmVjdG9yeT8uKCk7XG4gICAgICAgIGF3YWl0IGNvcHlGcm9tT25lSGFuZGxlclRvQW5vdGhlcihpbnRlcm5hbFJvb3QsIHJvb3RIYW5kbGUsIHt9KT8uY2F0Y2g/Lihjb25zb2xlLndhcm4uYmluZChjb25zb2xlKSk7XG4gICAgfTtcblxuICAgIC8vXG4gICAgcmV0dXJuIHJvb3RIYW5kbGU7XG59XG5cbi8vXG5leHBvcnQgY29uc3QgdW5tb3VudEFzUm9vdCA9IGFzeW5jIChmb3JJZDogc3RyaW5nKSA9PiB7XG4gICAgaWYgKHR5cGVvZiBsb2NhbFN0b3JhZ2UgIT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBsb2NhbFN0b3JhZ2U/LnNldEl0ZW0/LihcIm9wZnMubW91bnRlZFwiLCBKU09OLnN0cmluZ2lmeShKU09OLnBhcnNlKGxvY2FsU3RvcmFnZT8uZ2V0SXRlbT8uKFwib3Bmcy5tb3VudGVkXCIpIHx8IFwiW11cIikuZmlsdGVyKChpZDogc3RyaW5nKSA9PiBpZCAhPSBmb3JJZCkpKTtcbiAgICB9XG4gICAgLy8gU3luYyB0byB3b3JrZXJcbiAgICBwb3N0KCd1bm1vdW50JywgeyBpZDogZm9ySWQgfSk7XG59XG5cbi8vIEVuaGFuY2VkIHJvb3QgcmVzb2x1dGlvbiBmdW5jdGlvblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlc29sdmVSb290SGFuZGxlKHJvb3RIYW5kbGU6IGFueSwgcmVsUGF0aDogc3RyaW5nID0gXCJcIik6IFByb21pc2U8YW55PiB7XG4gICAgLy8gaWYgaXMgbnVsbCwganVzdCByZXR1cm4gT1BGUyByb290XG4gICAgaWYgKHJvb3RIYW5kbGUgPT0gbnVsbCB8fCByb290SGFuZGxlID09IHVuZGVmaW5lZCB8fCByb290SGFuZGxlPy50cmltPy4oKT8ubGVuZ3RoID09IDApIHtcbiAgICAgICAgcm9vdEhhbmRsZSA9IFwiL3VzZXIvXCI7XG4gICAgfVxuXG4gICAgLy9cbiAgICBjb25zdCBjbGVhbklkID0gdHlwZW9mIHJvb3RIYW5kbGUgPT0gXCJzdHJpbmdcIiA/IHJvb3RIYW5kbGU/LnRyaW0/LigpPy5yZXBsYWNlPy4oL15cXC8vLCBcIlwiKT8udHJpbT8uKCk/LnNwbGl0Py4oXCIvXCIpPy5maWx0ZXI/LihwID0+ICEhcD8udHJpbT8uKCkpPy5hdD8uKDApIDogbnVsbDtcbiAgICBpZiAoY2xlYW5JZCkge1xuICAgICAgICBpZiAodHlwZW9mIGxvY2FsU3RvcmFnZSAhPSBcInVuZGVmaW5lZFwiICYmIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlPy5nZXRJdGVtPy4oXCJvcGZzLm1vdW50ZWRcIikgfHwgXCJbXVwiKS5pbmNsdWRlcyhjbGVhbklkKSkge1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgcm9vdEhhbmRsZSA9IGN1cnJlbnRIYW5kbGVNYXA/LmdldChjbGVhbklkKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXJvb3RIYW5kbGUpIHsgcm9vdEhhbmRsZSA9IChhd2FpdCBtYXBwZWRSb290cz8uZ2V0Py4oYC8ke2NsZWFuSWR9L2ApPy4oKSkgPz8gKGF3YWl0IG5hdmlnYXRvci5zdG9yYWdlLmdldERpcmVjdG9yeSgpKTsgfTtcbiAgICB9XG5cbiAgICAvL1xuICAgIGlmIChyb290SGFuZGxlIGluc3RhbmNlb2YgRmlsZVN5c3RlbURpcmVjdG9yeUhhbmRsZSkge1xuICAgICAgICByZXR1cm4gcm9vdEhhbmRsZTtcbiAgICB9XG5cbiAgICAvLyBOb3JtYWxpemUgcmVsUGF0aCBmb3Igcm9vdCBtYXRjaGluZ1xuICAgIGNvbnN0IG5vcm1hbGl6ZWRQYXRoID0gcmVsUGF0aD8udHJpbT8uKCkgfHwgXCIvXCI7XG4gICAgY29uc3QgcGF0aEZvck1hdGNoID0gbm9ybWFsaXplZFBhdGguc3RhcnRzV2l0aChcIi9cIikgPyBub3JtYWxpemVkUGF0aCA6IFwiL1wiICsgbm9ybWFsaXplZFBhdGg7XG5cbiAgICAvLyBGaW5kIHRoZSBiZXN0IG1hdGNoaW5nIHJvb3QgZnJvbSBtYXBwZWRSb290c1xuICAgIGxldCBiZXN0TWF0Y2g6ICgoKSA9PiBQcm9taXNlPGFueT4pIHwgbnVsbCA9IG51bGw7XG4gICAgbGV0IGJlc3RNYXRjaExlbmd0aCA9IDA7XG5cbiAgICAvL1xuICAgIGZvciAoY29uc3QgW3Jvb3RQYXRoLCByb290UmVzb2x2ZXJdIG9mIG1hcHBlZFJvb3RzLmVudHJpZXMoKSkge1xuICAgICAgICBpZiAocGF0aEZvck1hdGNoLnN0YXJ0c1dpdGgocm9vdFBhdGgpICYmIHJvb3RQYXRoLmxlbmd0aCA+IGJlc3RNYXRjaExlbmd0aCkge1xuICAgICAgICAgICAgYmVzdE1hdGNoID0gcm9vdFJlc29sdmVyO1xuICAgICAgICAgICAgYmVzdE1hdGNoTGVuZ3RoID0gcm9vdFBhdGgubGVuZ3RoO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gVXNlIHRoZSBiZXN0IG1hdGNoaW5nIHJvb3QgcmVzb2x2ZXIsIGZhbGxiYWNrIHRvIE9QRlMgcm9vdFxuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJlc29sdmVkUm9vdCA9IGJlc3RNYXRjaCA/IGF3YWl0IGJlc3RNYXRjaCgpIDogbnVsbDtcbiAgICAgICAgcmV0dXJuIHJlc29sdmVkUm9vdCB8fCBhd2FpdCBuYXZpZ2F0b3I/LnN0b3JhZ2U/LmdldERpcmVjdG9yeT8uKCk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS53YXJuKFwiRmFpbGVkIHRvIHJlc29sdmUgcm9vdCBoYW5kbGUsIGZhbGxpbmcgYmFjayB0byBPUEZTIHJvb3Q6XCIsIGVycm9yKTtcbiAgICAgICAgcmV0dXJuIGF3YWl0IG5hdmlnYXRvcj8uc3RvcmFnZT8uZ2V0RGlyZWN0b3J5Py4oKTtcbiAgICB9XG59XG5cbi8vIEVuaGFuY2VkIHBhdGggbm9ybWFsaXphdGlvbiB3aXRoIHJlbGF0aXZlIGRpcmVjdG9yeSBzdXBwb3J0XG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplUGF0aChiYXNlUGF0aDogc3RyaW5nID0gXCJcIiwgcmVsUGF0aDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBpZiAoIXJlbFBhdGg/LnRyaW0oKSkgcmV0dXJuIGJhc2VQYXRoO1xuXG4gICAgY29uc3QgY2xlYW5SZWxQYXRoID0gcmVsUGF0aC50cmltKCk7XG5cbiAgICAvLyBIYW5kbGUgYWJzb2x1dGUgcGF0aHMgKHN0YXJ0aW5nIHdpdGggLylcbiAgICBpZiAoY2xlYW5SZWxQYXRoLnN0YXJ0c1dpdGgoXCIvXCIpKSB7XG4gICAgICAgIHJldHVybiBjbGVhblJlbFBhdGg7XG4gICAgfVxuXG4gICAgLy8gSGFuZGxlIHJlbGF0aXZlIHBhdGhzXG4gICAgY29uc3QgYmFzZVBhcnRzID0gYmFzZVBhdGguc3BsaXQoXCIvXCIpLmZpbHRlcihwID0+IHA/LnRyaW0oKSk7XG4gICAgY29uc3QgcmVsUGFydHMgPSBjbGVhblJlbFBhdGguc3BsaXQoXCIvXCIpLmZpbHRlcihwID0+IHA/LnRyaW0oKSk7XG5cbiAgICBmb3IgKGNvbnN0IHBhcnQgb2YgcmVsUGFydHMpIHtcbiAgICAgICAgaWYgKHBhcnQgPT09IFwiLlwiKSB7XG4gICAgICAgICAgICAvLyBDdXJyZW50IGRpcmVjdG9yeSAtIG5vIGNoYW5nZVxuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH0gZWxzZSBpZiAocGFydCA9PT0gXCIuLlwiKSB7XG4gICAgICAgICAgICAvLyBQYXJlbnQgZGlyZWN0b3J5IC0gZ28gdXAgb25lIGxldmVsXG4gICAgICAgICAgICBpZiAoYmFzZVBhcnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBiYXNlUGFydHMucG9wKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBSZWd1bGFyIGRpcmVjdG9yeS9maWxlIG5hbWVcbiAgICAgICAgICAgIGJhc2VQYXJ0cy5wdXNoKHBhcnQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFwiL1wiICsgYmFzZVBhcnRzLmpvaW4oXCIvXCIpO1xufVxuXG4vLyBFbmhhbmNlZCBwYXRoIHJlc29sdXRpb24gdGhhdCBjb21iaW5lcyByb290IG1hcHBpbmcgYW5kIHJlbGF0aXZlIHBhdGggaGFuZGxpbmdcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZXNvbHZlUGF0aChyb290SGFuZGxlOiBhbnksIHJlbFBhdGg6IHN0cmluZywgYmFzZVBhdGg6IHN0cmluZyA9IFwiXCIpOiBQcm9taXNlPHsgcm9vdEhhbmRsZTogYW55LCByZXNvbHZlZFBhdGg6IHN0cmluZyB9PiB7XG4gICAgLy8gRmlyc3Qgbm9ybWFsaXplIHRoZSByZWxhdGl2ZSBwYXRoXG4gICAgY29uc3Qgbm9ybWFsaXplZFJlbFBhdGggPSBub3JtYWxpemVQYXRoKGJhc2VQYXRoLCByZWxQYXRoKTtcblxuICAgIC8vIFRoZW4gcmVzb2x2ZSB0aGUgcm9vdCBoYW5kbGVcbiAgICBjb25zdCByZXNvbHZlZFJvb3RIYW5kbGUgPSBhd2FpdCByZXNvbHZlUm9vdEhhbmRsZShyb290SGFuZGxlLCBub3JtYWxpemVkUmVsUGF0aCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICByb290SGFuZGxlOiByZXNvbHZlZFJvb3RIYW5kbGUsXG4gICAgICAgIHJlc29sdmVkUGF0aDogbm9ybWFsaXplZFJlbFBhdGhcbiAgICB9O1xufVxuXG5cbi8vXG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlRXJyb3IobG9nZ2VyLCBzdGF0dXMsIG1lc3NhZ2UpIHsgbG9nZ2VyPy4oc3RhdHVzLCBtZXNzYWdlKTsgcmV0dXJuIG51bGw7IH1cbmV4cG9ydCBmdW5jdGlvbiBkZWZhdWx0TG9nZ2VyKHN0YXR1cywgbWVzc2FnZSkgeyBjb25zb2xlLnRyYWNlKGBbJHtzdGF0dXN9XSAke21lc3NhZ2V9YCk7IH07XG5leHBvcnQgZnVuY3Rpb24gZ2V0RmlsZUV4dGVuc2lvbihwYXRoKSB7IHJldHVybiBwYXRoPy50cmltPy4oKT8uc3BsaXQ/LihcIi5cIik/LlsxXTsgfVxuZXhwb3J0IGZ1bmN0aW9uIGRldGVjdFR5cGVCeVJlbFBhdGgocmVsUGF0aCkgeyBpZiAocmVsUGF0aD8udHJpbSgpPy5lbmRzV2l0aD8uKCcvJykpIHJldHVybiAnZGlyZWN0b3J5JzsgcmV0dXJuICdmaWxlJzsgfVxuZXhwb3J0IGZ1bmN0aW9uIGdldE1pbWVUeXBlQnlGaWxlbmFtZShmaWxlbmFtZSkge1xuICAgIGNvbnN0IGV4dCA9IGZpbGVuYW1lPy5zcGxpdD8uKCcuJyk/LnBvcD8uKCk/LnRvTG93ZXJDYXNlPy4oKTtcbiAgICBjb25zdCBtaW1lVHlwZXMgPSB7XG4gICAgICAgICd0eHQnOiAndGV4dC9wbGFpbicsXG4gICAgICAgICdtZCc6ICd0ZXh0L21hcmtkb3duJyxcbiAgICAgICAgJ2h0bWwnOiAndGV4dC9odG1sJyxcbiAgICAgICAgJ2h0bSc6ICd0ZXh0L2h0bWwnLFxuICAgICAgICAnY3NzJzogJ3RleHQvY3NzJyxcbiAgICAgICAgJ2pzJzogJ2FwcGxpY2F0aW9uL2phdmFzY3JpcHQnLFxuICAgICAgICAnanNvbic6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgJ2Nzdic6ICd0ZXh0L2NzdicsXG4gICAgICAgICd4bWwnOiAnYXBwbGljYXRpb24veG1sJyxcbiAgICAgICAgJ2pwZyc6ICdpbWFnZS9qcGVnJyxcbiAgICAgICAgJ2pwZWcnOiAnaW1hZ2UvanBlZycsXG4gICAgICAgICdwbmcnOiAnaW1hZ2UvcG5nJyxcbiAgICAgICAgJ2dpZic6ICdpbWFnZS9naWYnLFxuICAgICAgICAnd2VicCc6ICdpbWFnZS93ZWJwJyxcbiAgICAgICAgJ3N2Zyc6ICdpbWFnZS9zdmcreG1sJyxcbiAgICAgICAgJ2ljbyc6ICdpbWFnZS94LWljb24nLFxuICAgICAgICAnbXAzJzogJ2F1ZGlvL21wZWcnLFxuICAgICAgICAnd2F2JzogJ2F1ZGlvL3dhdicsXG4gICAgICAgICdtcDQnOiAndmlkZW8vbXA0JyxcbiAgICAgICAgJ3dlYm0nOiAndmlkZW8vd2VibScsXG4gICAgICAgICdwZGYnOiAnYXBwbGljYXRpb24vcGRmJyxcbiAgICAgICAgJ3ppcCc6ICdhcHBsaWNhdGlvbi96aXAnLFxuICAgICAgICAncmFyJzogJ2FwcGxpY2F0aW9uL3ZuZC5yYXInLFxuICAgICAgICAnN3onOiAnYXBwbGljYXRpb24veC03ei1jb21wcmVzc2VkJyxcbiAgICAgICAgLy8gLi4uXG4gICAgfTtcbiAgICByZXR1cm4gbWltZVR5cGVzW2V4dF0gfHwgJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG59XG5cbi8vXG5leHBvcnQgY29uc3QgaGFzRmlsZUV4dGVuc2lvbiA9IChwYXRoOiBzdHJpbmcpID0+IHtcbiAgICByZXR1cm4gcGF0aD8udHJpbT8uKCk/LnNwbGl0Py4oXCIuXCIpPy5bMV0/LnRyaW0/LigpPy5sZW5ndGggPiAwO1xufVxuXG4vL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldERpcmVjdG9yeUhhbmRsZShyb290SGFuZGxlLCByZWxQYXRoLCB7IGNyZWF0ZSA9IGZhbHNlLCBiYXNlUGF0aCA9IFwiXCIgfSA9IHt9LCBsb2dnZXIgPSBkZWZhdWx0TG9nZ2VyKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgeyByb290SGFuZGxlOiByZXNvbHZlZFJvb3QsIHJlc29sdmVkUGF0aCB9ID0gYXdhaXQgcmVzb2x2ZVBhdGgocm9vdEhhbmRsZSwgcmVsUGF0aCwgYmFzZVBhdGgpO1xuICAgICAgICAvLyBSZW1vdmUgL3VzZXIvIHByZWZpeFxuICAgICAgICBjb25zdCBjbGVhblBhdGggPSByZXNvbHZlZFBhdGg/LnRyaW0/LigpPy5zdGFydHNXaXRoPy4oXCIvdXNlci9cIikgP1xuICAgICAgICAgICAgcmVzb2x2ZWRQYXRoPy50cmltPy4oKT8ucmVwbGFjZT8uKC9eXFwvdXNlci9nLCBcIlwiKT8udHJpbT8uKCkgOiByZXNvbHZlZFBhdGg7XG5cbiAgICAgICAgY29uc3QgcGFydHMgPSBjbGVhblBhdGguc3BsaXQoJy8nKS5maWx0ZXIoKHApID0+ICghIXA/LnRyaW0/LigpKSk7XG4gICAgICAgIGlmIChwYXJ0cy5sZW5ndGggPiAwICYmIGhhc0ZpbGVFeHRlbnNpb24ocGFydHNbcGFydHMubGVuZ3RoIC0gMV0/LnRyaW0/LigpKSkgeyBwYXJ0cz8ucG9wPy4oKTsgfTtcblxuICAgICAgICAvLyBGYWxsYmFjayB0byBkaXJlY3QgYWNjZXNzIGlmIHdlIG5lZWQgdG8gcmV0dXJuIGEgSGFuZGxlXG4gICAgICAgIC8vIEJ1dCB3ZSB3YW50IHRvIHVzZSB3b3JrZXIgZm9yIG9wZXJhdGlvbnMuXG4gICAgICAgIC8vIEN1cnJlbnQgQVBJIHJldHVybnMgSGFuZGxlLlxuICAgICAgICAvLyBJZiB3ZSB3YW50IG9wdGltaXphdGlvbiwgd2Ugc2hvdWxkIHVzZSB3b3JrZXIuXG4gICAgICAgIC8vIEJ1dCBnZXREaXJlY3RvcnlIYW5kbGUgcmV0dXJucyBhIEhhbmRsZS5cblxuICAgICAgICBsZXQgZGlyID0gcmVzb2x2ZWRSb290O1xuICAgICAgICBpZiAocGFydHM/Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgcGFydCBvZiBwYXJ0cykge1xuICAgICAgICAgICAgICAgIGRpciA9IGF3YWl0IGRpcj8uZ2V0RGlyZWN0b3J5SGFuZGxlPy4ocGFydCwgeyBjcmVhdGUgfSk7XG4gICAgICAgICAgICAgICAgaWYgKCFkaXIpIHsgYnJlYWs7IH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRpcjtcbiAgICB9IGNhdGNoIChlOiBhbnkpIHsgcmV0dXJuIGhhbmRsZUVycm9yKGxvZ2dlciwgJ2Vycm9yJywgYGdldERpcmVjdG9yeUhhbmRsZTogJHtlLm1lc3NhZ2V9YCk7IH1cbn1cblxuLy9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRGaWxlSGFuZGxlKHJvb3RIYW5kbGUsIHJlbFBhdGgsIHsgY3JlYXRlID0gZmFsc2UsIGJhc2VQYXRoID0gXCJcIiB9ID0ge30sIGxvZ2dlciA9IGRlZmF1bHRMb2dnZXIpIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCB7IHJvb3RIYW5kbGU6IHJlc29sdmVkUm9vdCwgcmVzb2x2ZWRQYXRoIH0gPSBhd2FpdCByZXNvbHZlUGF0aChyb290SGFuZGxlLCByZWxQYXRoLCBiYXNlUGF0aCk7XG4gICAgICAgIGNvbnN0IGNsZWFuUGF0aCA9IHJlc29sdmVkUGF0aD8udHJpbT8uKCk/LnN0YXJ0c1dpdGg/LihcIi91c2VyL1wiKSA/XG4gICAgICAgICAgICByZXNvbHZlZFBhdGg/LnRyaW0/LigpPy5yZXBsYWNlPy4oL15cXC91c2VyL2csIFwiXCIpPy50cmltPy4oKSA6IHJlc29sdmVkUGF0aDtcblxuICAgICAgICBjb25zdCBwYXJ0cyA9IGNsZWFuUGF0aC5zcGxpdCgnLycpLmZpbHRlcigoZCkgPT4gKCEhZD8udHJpbT8uKCkpKTtcbiAgICAgICAgaWYgKHBhcnRzPy5sZW5ndGggPT0gMCkgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgY29uc3QgZmlsZVBhdGggPSBwYXJ0cy5sZW5ndGggPiAwID8gcGFydHNbcGFydHMubGVuZ3RoIC0gMV0/LnRyaW0/LigpPy5yZXBsYWNlPy4oL1xccysvZywgJy0nKSA6ICcnO1xuICAgICAgICBjb25zdCBkaXJOYW1lID0gcGFydHMubGVuZ3RoID4gMSA/IHBhcnRzPy5zbGljZSgwLCAtMSk/LmpvaW4/LignLycpPy50cmltPy4oKT8ucmVwbGFjZT8uKC9cXHMrL2csICctJykgOiAnJztcblxuICAgICAgICBpZiAoY2xlYW5QYXRoPy50cmltPy4oKT8uZW5kc1dpdGg/LihcIi9cIikpIHsgcmV0dXJuIG51bGw7IH07XG5cbiAgICAgICAgLy8gRGVsZWdhdGUgdG8gZ2V0RGlyZWN0b3J5SGFuZGxlICh3aGljaCBpcyBjdXJyZW50bHkgbWFpbiB0aHJlYWQpXG4gICAgICAgIGNvbnN0IGRpciA9IGF3YWl0IGdldERpcmVjdG9yeUhhbmRsZShyZXNvbHZlZFJvb3QsIGRpck5hbWUsIHsgY3JlYXRlLCBiYXNlUGF0aCB9LCBsb2dnZXIpO1xuICAgICAgICByZXR1cm4gZGlyPy5nZXRGaWxlSGFuZGxlPy4oZmlsZVBhdGgsIHsgY3JlYXRlIH0pO1xuICAgIH0gY2F0Y2ggKGU6IGFueSkgeyByZXR1cm4gaGFuZGxlRXJyb3IobG9nZ2VyLCAnZXJyb3InLCBgZ2V0RmlsZUhhbmRsZTogJHtlLm1lc3NhZ2V9YCk7IH1cbn1cblxuLy9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRIYW5kbGVyKHJvb3RIYW5kbGUsIHJlbFBhdGgsIG9wdGlvbnM6IHsgYmFzZVBhdGg/OiBzdHJpbmcgfSA9IHt9LCBsb2dnZXIgPSBkZWZhdWx0TG9nZ2VyKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgeyByb290SGFuZGxlOiByZXNvbHZlZFJvb3RIYW5kbGUsIHJlc29sdmVkUGF0aCB9ID0gYXdhaXQgcmVzb2x2ZVBhdGgocm9vdEhhbmRsZSwgcmVsUGF0aCwgb3B0aW9ucz8uYmFzZVBhdGggfHwgXCJcIik7XG4gICAgICAgIGNvbnN0IHR5cGUgPSBkZXRlY3RUeXBlQnlSZWxQYXRoKHJlc29sdmVkUGF0aCk7XG4gICAgICAgIGlmICh0eXBlID09ICdkaXJlY3RvcnknKSB7XG4gICAgICAgICAgICBjb25zdCBkaXIgPSBhd2FpdCBnZXREaXJlY3RvcnlIYW5kbGUocmVzb2x2ZWRSb290SGFuZGxlLCByZXNvbHZlZFBhdGg/LnRyaW0/LigpPy5yZXBsYWNlPy4oL1xcLyQvLCAnJyksIG9wdGlvbnMsIGxvZ2dlcik7XG4gICAgICAgICAgICBpZiAoZGlyKSByZXR1cm4geyB0eXBlOiAnZGlyZWN0b3J5JywgaGFuZGxlOiBkaXIgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGZpbGUgPSBhd2FpdCBnZXRGaWxlSGFuZGxlKHJlc29sdmVkUm9vdEhhbmRsZSwgcmVzb2x2ZWRQYXRoLCBvcHRpb25zLCBsb2dnZXIpO1xuICAgICAgICAgICAgaWYgKGZpbGUpIHJldHVybiB7IHR5cGU6ICdmaWxlJywgaGFuZGxlOiBmaWxlIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSBjYXRjaCAoZTogYW55KSB7IHJldHVybiBoYW5kbGVFcnJvcihsb2dnZXIsICdlcnJvcicsIGBnZXRIYW5kbGVyOiAke2UubWVzc2FnZX1gKTsgfVxufVxuXG4vL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZUhhbmRsZXIocm9vdEhhbmRsZSwgcmVsUGF0aCwgb3B0aW9uczogeyBiYXNlUGF0aD86IHN0cmluZyB9ID0ge30sIGxvZ2dlciA9IGRlZmF1bHRMb2dnZXIpIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCB7IHJvb3RIYW5kbGU6IHJlc29sdmVkUm9vdEhhbmRsZSwgcmVzb2x2ZWRQYXRoIH0gPSBhd2FpdCByZXNvbHZlUGF0aChyb290SGFuZGxlLCByZWxQYXRoLCBvcHRpb25zPy5iYXNlUGF0aCB8fCBcIlwiKTtcbiAgICAgICAgY29uc3QgdHlwZSA9IGRldGVjdFR5cGVCeVJlbFBhdGgocmVzb2x2ZWRQYXRoKTtcbiAgICAgICAgaWYgKHR5cGUgPT0gJ2RpcmVjdG9yeScpIHtcbiAgICAgICAgICAgIHJldHVybiBhd2FpdCBnZXREaXJlY3RvcnlIYW5kbGUocmVzb2x2ZWRSb290SGFuZGxlLCByZXNvbHZlZFBhdGg/LnRyaW0/LigpPy5yZXBsYWNlPy4oL1xcLyQvLCAnJyksIG9wdGlvbnMsIGxvZ2dlcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgZ2V0RmlsZUhhbmRsZShyZXNvbHZlZFJvb3RIYW5kbGUsIHJlc29sdmVkUGF0aCwgb3B0aW9ucywgbG9nZ2VyKTtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGU6IGFueSkgeyByZXR1cm4gaGFuZGxlRXJyb3IobG9nZ2VyLCAnZXJyb3InLCBgY3JlYXRlSGFuZGxlcjogJHtlLm1lc3NhZ2V9YCk7IH1cbn1cblxuLy8gU2hhcmVkIFN0YXRlIFN0cnVjdHVyZVxuaW50ZXJmYWNlIERpcmVjdG9yeVN0YXRlIHtcbiAgICBtYXBDYWNoZTogTWFwPHN0cmluZywgYW55PjtcbiAgICBkaXJIYW5kbGU6IFByb21pc2U8YW55PjtcbiAgICByZXNvbHZlUGF0aDogc3RyaW5nO1xuICAgIG9ic2VydmF0aW9uSWQ6IHN0cmluZztcbiAgICByZWZDb3VudDogbnVtYmVyO1xuICAgIGNsZWFudXA6ICgpID0+IHZvaWQ7XG4gICAgdXBkYXRlQ2FjaGU6ICgpID0+IFByb21pc2U8YW55Pjtcbn1cblxuZXhwb3J0IGNvbnN0IGRpcmVjdG9yeUNhY2hlTWFwID0gbmV3IE1hcDxzdHJpbmcsIERpcmVjdG9yeVN0YXRlPigpO1xuXG5cbi8vXG5leHBvcnQgY29uc3QgbWF5Tm90UHJvbWlzZSA9IChwbXM6IGFueSwgY2I6IChwbXM6IGFueSkgPT4gYW55LCBlcnJDYjogKGU6IGFueSkgPT4gYW55ID0gY29uc29sZS53YXJuLmJpbmQoY29uc29sZSkpID0+IHtcbiAgICBpZiAodHlwZW9mIHBtcz8udGhlbiA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuIHBtcz8udGhlbj8uKGNiKT8uY2F0Y2g/LihlcnJDYik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiBjYihwbXMpO1xuICAgICAgICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAgICAgICAgIGVyckNiKGUpO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8vXG5leHBvcnQgZnVuY3Rpb24gb3BlbkRpcmVjdG9yeShcbiAgICByb290SGFuZGxlLFxuICAgIHJlbFBhdGgsXG4gICAgb3B0aW9uczogeyBjcmVhdGU6IGJvb2xlYW47IGJhc2VQYXRoPzogc3RyaW5nIH0gPSB7IGNyZWF0ZTogZmFsc2UgfSxcbiAgICBsb2dnZXIgPSBkZWZhdWx0TG9nZ2VyXG4pIHtcbiAgICBsZXQgY2FjaGVLZXkgPSBcIlwiO1xuXG4gICAgLy8g0JLQkNCW0J3Qnjog0YHQuNC90YXRgNC+0L3QvdC+INC00L7RgdGC0YPQv9C90LDRjyDRgdGB0YvQu9C60LAg0L3QsCByZWFjdGl2ZS1tYXBcbiAgICAvLyAo0LjQt9C90LDRh9Cw0LvRjNC90L4g0L/Rg9GB0YLQsNGPLCDQv9C+0YLQvtC8INCx0YPQtNC10YIg0LfQsNC80LXQvdC10L3QsCDQvdCwIHNoYXJlZCBtYXBDYWNoZSDQuNC3IHN0YXRlKVxuICAgIGxldCBsb2NhbE1hcENhY2hlOiBNYXA8c3RyaW5nLCBhbnk+ID0gb2JzZXJ2ZShuZXcgTWFwPHN0cmluZywgYW55PigpKSBhcyBhbnk7XG5cbiAgICBjb25zdCBwYXRoUHJvbWlzZSA9IChhc3luYyAoKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IHJvb3RIYW5kbGU6IHJlc29sdmVkUm9vdEhhbmRsZSwgcmVzb2x2ZWRQYXRoIH0gPSBhd2FpdCByZXNvbHZlUGF0aChcbiAgICAgICAgICAgICAgICByb290SGFuZGxlLFxuICAgICAgICAgICAgICAgIHJlbFBhdGgsXG4gICAgICAgICAgICAgICAgb3B0aW9ucz8uYmFzZVBhdGggfHwgXCJcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNhY2hlS2V5ID0gYCR7cmVzb2x2ZWRSb290SGFuZGxlPy5uYW1lIHx8IFwicm9vdFwifToke3Jlc29sdmVkUGF0aH1gO1xuICAgICAgICAgICAgcmV0dXJuIHsgcm9vdEhhbmRsZTogcmVzb2x2ZWRSb290SGFuZGxlLCByZXNvbHZlZFBhdGggfTtcbiAgICAgICAgfSBjYXRjaCB7XG4gICAgICAgICAgICByZXR1cm4geyByb290SGFuZGxlOiBudWxsLCByZXNvbHZlZFBhdGg6IFwiXCIgfTtcbiAgICAgICAgfVxuICAgIH0pKCk7XG5cbiAgICBjb25zdCBzdGF0ZVByb21pc2U6IFByb21pc2U8RGlyZWN0b3J5U3RhdGUgfCBudWxsPiA9IHBhdGhQcm9taXNlLnRoZW4oYXN5bmMgKHsgcm9vdEhhbmRsZSwgcmVzb2x2ZWRQYXRoIH0pID0+IHtcbiAgICAgICAgaWYgKCFyZXNvbHZlZFBhdGgpIHJldHVybiBudWxsO1xuXG4gICAgICAgIGNvbnN0IGV4aXN0aW5nID0gZGlyZWN0b3J5Q2FjaGVNYXAuZ2V0KGNhY2hlS2V5KTtcbiAgICAgICAgaWYgKGV4aXN0aW5nKSB7XG4gICAgICAgICAgICBleGlzdGluZy5yZWZDb3VudCsrO1xuICAgICAgICAgICAgLy8g0YHQuNC90YXRgNC+0L3QvdC+INC/0LXRgNC10LrQu9GO0YfQsNC10LwgcHJveHkg0L3QsCBzaGFyZWQgbWFwXG4gICAgICAgICAgICBsb2NhbE1hcENhY2hlID0gZXhpc3RpbmcubWFwQ2FjaGU7XG4gICAgICAgICAgICByZXR1cm4gZXhpc3Rpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBtYXBDYWNoZSA9IG9ic2VydmUobmV3IE1hcDxzdHJpbmcsIGFueT4oKSkgYXMgTWFwPHN0cmluZywgYW55PjtcbiAgICAgICAgbG9jYWxNYXBDYWNoZSA9IG1hcENhY2hlO1xuXG4gICAgICAgIGNvbnN0IG9ic2VydmF0aW9uSWQgPSBVVUlEdjQoKTtcbiAgICAgICAgY29uc3QgZGlySGFuZGxlUHJvbWlzZSA9IGdldERpcmVjdG9yeUhhbmRsZShyb290SGFuZGxlLCByZXNvbHZlZFBhdGgsIG9wdGlvbnMsIGxvZ2dlcik7XG5cbiAgICAgICAgY29uc3QgdXBkYXRlQ2FjaGUgPSBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjbGVhblBhdGggPSByZXNvbHZlZFBhdGg/LnRyaW0/LigpPy5zdGFydHNXaXRoPy4oXCIvdXNlci9cIilcbiAgICAgICAgICAgICAgICA/IHJlc29sdmVkUGF0aD8udHJpbT8uKCk/LnJlcGxhY2U/LigvXlxcL3VzZXIvZywgXCJcIik/LnRyaW0/LigpXG4gICAgICAgICAgICAgICAgOiByZXNvbHZlZFBhdGg7XG5cbiAgICAgICAgICAgIGNvbnN0IGVudHJpZXM6IGFueSA9IGF3YWl0IHBvc3QoXG4gICAgICAgICAgICAgICAgXCJyZWFkRGlyZWN0b3J5XCIsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICByb290SWQ6IFwiXCIsXG4gICAgICAgICAgICAgICAgICAgIHBhdGg6IGNsZWFuUGF0aCxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlOiBvcHRpb25zLmNyZWF0ZSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHJvb3RIYW5kbGUgPyBbcm9vdEhhbmRsZV0gOiBbXVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgaWYgKCFlbnRyaWVzKSByZXR1cm4gbWFwQ2FjaGU7XG5cbiAgICAgICAgICAgIGNvbnN0IGVudHJ5TWFwID0gbmV3IE1hcChlbnRyaWVzKTtcblxuICAgICAgICAgICAgLy8gcmVtb3ZlIGRlbGV0ZWRcbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IG9mIG1hcENhY2hlLmtleXMoKSkge1xuICAgICAgICAgICAgICAgIGlmICghZW50cnlNYXAuaGFzKGtleSkpIG1hcENhY2hlLmRlbGV0ZShrZXkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBhZGQgbmV3XG4gICAgICAgICAgICBmb3IgKGNvbnN0IFtrZXksIGhhbmRsZV0gb2YgZW50cnlNYXApIHtcbiAgICAgICAgICAgICAgICBpZiAoIW1hcENhY2hlLmhhcyhrZXkgYXMgc3RyaW5nKSkgbWFwQ2FjaGUuc2V0KGtleSBhcyBzdHJpbmcsIGhhbmRsZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBtYXBDYWNoZTtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBjbGVhbnVwID0gKCkgPT4ge1xuICAgICAgICAgICAgcG9zdChcInVub2JzZXJ2ZVwiLCB7IGlkOiBvYnNlcnZhdGlvbklkIH0pO1xuICAgICAgICAgICAgb2JzZXJ2ZXJzLmRlbGV0ZShvYnNlcnZhdGlvbklkKTtcbiAgICAgICAgICAgIGRpcmVjdG9yeUNhY2hlTWFwLmRlbGV0ZShjYWNoZUtleSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgb2JzZXJ2ZXJzLnNldChvYnNlcnZhdGlvbklkLCAoY2hhbmdlczogYW55W10pID0+IHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgY2hhbmdlIG9mIGNoYW5nZXMpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWNoYW5nZT8ubmFtZSkgY29udGludWU7XG5cbiAgICAgICAgICAgICAgICBpZiAoY2hhbmdlLnR5cGUgPT09IFwibW9kaWZpZWRcIiB8fCBjaGFuZ2UudHlwZSA9PT0gXCJjcmVhdGVkXCIgfHwgY2hhbmdlLnR5cGUgPT09IFwiYXBwZWFyZWRcIikge1xuICAgICAgICAgICAgICAgICAgICBtYXBDYWNoZS5zZXQoY2hhbmdlLm5hbWUsIGNoYW5nZS5oYW5kbGUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY2hhbmdlLnR5cGUgPT09IFwiZGVsZXRlZFwiIHx8IGNoYW5nZS50eXBlID09PSBcImRpc2FwcGVhcmVkXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgbWFwQ2FjaGUuZGVsZXRlKGNoYW5nZS5uYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IGNsZWFuUGF0aCA9IHJlc29sdmVkUGF0aD8udHJpbT8uKCk/LnN0YXJ0c1dpdGg/LihcIi91c2VyL1wiKVxuICAgICAgICAgICAgPyByZXNvbHZlZFBhdGg/LnRyaW0/LigpPy5yZXBsYWNlPy4oL15cXC91c2VyL2csIFwiXCIpPy50cmltPy4oKVxuICAgICAgICAgICAgOiByZXNvbHZlZFBhdGg7XG5cbiAgICAgICAgcG9zdChcbiAgICAgICAgICAgIFwib2JzZXJ2ZVwiLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJvb3RJZDogXCJcIixcbiAgICAgICAgICAgICAgICBwYXRoOiBjbGVhblBhdGgsXG4gICAgICAgICAgICAgICAgaWQ6IG9ic2VydmF0aW9uSWQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcm9vdEhhbmRsZSA/IFtyb290SGFuZGxlXSA6IFtdXG4gICAgICAgICk7XG5cbiAgICAgICAgLy8gaW5pdGlhbCBsb2FkIChmaXJlIGFuZCBmb3JnZXQpXG4gICAgICAgIHVwZGF0ZUNhY2hlKCk7XG5cbiAgICAgICAgY29uc3QgbmV3U3RhdGU6IERpcmVjdG9yeVN0YXRlID0ge1xuICAgICAgICAgICAgbWFwQ2FjaGUsXG4gICAgICAgICAgICBkaXJIYW5kbGU6IGRpckhhbmRsZVByb21pc2UsXG4gICAgICAgICAgICByZXNvbHZlUGF0aDogcmVzb2x2ZWRQYXRoLFxuICAgICAgICAgICAgb2JzZXJ2YXRpb25JZCxcbiAgICAgICAgICAgIHJlZkNvdW50OiAxLFxuICAgICAgICAgICAgY2xlYW51cCxcbiAgICAgICAgICAgIHVwZGF0ZUNhY2hlLFxuICAgICAgICB9O1xuXG4gICAgICAgIGRpcmVjdG9yeUNhY2hlTWFwLnNldChjYWNoZUtleSwgbmV3U3RhdGUpO1xuXG4gICAgICAgIGNvbnN0IGVudHJpZXM6IGFueSA9IGF3YWl0IFByb21pc2UuYWxsKGF3YWl0IEFycmF5LmZyb21Bc3luYygoYXdhaXQgZGlySGFuZGxlUHJvbWlzZSk/LmVudHJpZXM/LigpID8/IFtdKSk7XG4gICAgICAgIGZvciAoY29uc3QgW25hbWUsIGhhbmRsZV0gb2YgZW50cmllcykge1xuICAgICAgICAgICAgaWYgKCFtYXBDYWNoZS5oYXMobmFtZSkpIG1hcENhY2hlLnNldChuYW1lLCBoYW5kbGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHsgLi4ubmV3U3RhdGUsIG1hcENhY2hlIH07XG4gICAgfSk7XG5cbiAgICAvL1xuICAgIGxldCBkaXNwb3NlZCA9IGZhbHNlO1xuICAgIGNvbnN0IGRpc3Bvc2UgPSAoKSA9PiB7XG4gICAgICAgIGlmIChkaXNwb3NlZCkgcmV0dXJuO1xuICAgICAgICBkaXNwb3NlZCA9IHRydWU7XG4gICAgICAgIHN0YXRlUHJvbWlzZVxuICAgICAgICAgICAgLnRoZW4oKHMpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIXMpIHJldHVybjtcbiAgICAgICAgICAgICAgICBzLnJlZkNvdW50LS07XG4gICAgICAgICAgICAgICAgaWYgKHMucmVmQ291bnQgPD0gMCkgcy5jbGVhbnVwKCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKGNvbnNvbGUud2Fybik7XG4gICAgfTtcblxuICAgIC8vXG4gICAgY29uc3QgaGFuZGxlcjogUHJveHlIYW5kbGVyPGFueT4gPSB7XG4gICAgICAgIGdldChfdGFyZ2V0LCBwcm9wKSB7XG4gICAgICAgICAgICAvLyAwKSDQp9Cw0YHRgtC+INCy0YvQt9GL0LLQsNC10LzRi9C1INGB0LjRgdGC0LXQvNC90YvQtS/QuNC90YHQv9C10LrRhtC40L7QvdC90YvQtSDRiNGC0YPQutC4IOKAlCDQndCVINGC0YDQvtCz0LDQtdC8INCy0L7QvtCx0YnQtVxuICAgICAgICAgICAgLy8g0LjQvdCw0YfQtSDQu9C10LPQutC+INGB0LvQvtCy0LjRgtGMINGA0LXQutGD0YDRgdC40Y4v0LvQsNCy0LjQvdGDXG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgcHJvcCA9PT0gU3ltYm9sLnRvU3RyaW5nVGFnIHx8XG4gICAgICAgICAgICAgICAgcHJvcCA9PT0gU3ltYm9sLml0ZXJhdG9yIHx8XG4gICAgICAgICAgICAgICAgcHJvcCA9PT0gXCJ0b1N0cmluZ1wiIHx8XG4gICAgICAgICAgICAgICAgcHJvcCA9PT0gXCJ2YWx1ZU9mXCIgfHxcbiAgICAgICAgICAgICAgICBwcm9wID09PSBcImluc3BlY3RcIiB8fFxuICAgICAgICAgICAgICAgIHByb3AgPT09IFwiY29uc3RydWN0b3JcIiB8fFxuICAgICAgICAgICAgICAgIHByb3AgPT09IFwiX19wcm90b19fXCIgfHxcbiAgICAgICAgICAgICAgICBwcm9wID09PSBcInByb3RvdHlwZVwiXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocHJvcCA9PT0gXCJkaXNwb3NlXCIpIHJldHVybiBkaXNwb3NlO1xuXG4gICAgICAgICAgICAvLyDRgdC40L3RhdGA0L7QvdC90L4g0L7RgtC00LDRkdC8INGA0LXQsNC60YLQuNCy0L3Ri9C5IE1hcCAo0LrQsNC6INCyIGJhY2t1cClcbiAgICAgICAgICAgIGlmIChwcm9wID09PSBcImdldE1hcFwiKSByZXR1cm4gKCkgPT4gbG9jYWxNYXBDYWNoZTtcblxuICAgICAgICAgICAgLy8gbWFwLWxpa2Ug0LzQtdGC0L7QtNGLICjRgdC40L3RhdGA0L7QvdC90L4hKVxuICAgICAgICAgICAgaWYgKHByb3AgPT09IFwiZW50cmllc1wiKSByZXR1cm4gKCkgPT4gbG9jYWxNYXBDYWNoZS5lbnRyaWVzKCk7XG4gICAgICAgICAgICBpZiAocHJvcCA9PT0gXCJrZXlzXCIpIHJldHVybiAoKSA9PiBsb2NhbE1hcENhY2hlLmtleXMoKTtcbiAgICAgICAgICAgIGlmIChwcm9wID09PSBcInZhbHVlc1wiKSByZXR1cm4gKCkgPT4gbG9jYWxNYXBDYWNoZS52YWx1ZXMoKTtcbiAgICAgICAgICAgIGlmIChwcm9wID09PSBTeW1ib2wuaXRlcmF0b3IpIHJldHVybiAoKSA9PiBsb2NhbE1hcENhY2hlW1N5bWJvbC5pdGVyYXRvcl0oKTtcblxuICAgICAgICAgICAgLy8g0YfQsNGB0YLQviDQvdGD0LbQvdC+XG4gICAgICAgICAgICBpZiAocHJvcCA9PT0gXCJzaXplXCIpIHJldHVybiBsb2NhbE1hcENhY2hlLnNpemU7XG4gICAgICAgICAgICBpZiAocHJvcCA9PT0gXCJoYXNcIikgcmV0dXJuIChrOiBzdHJpbmcpID0+IGxvY2FsTWFwQ2FjaGUuaGFzKGspO1xuICAgICAgICAgICAgaWYgKHByb3AgPT09IFwiZ2V0XCIpIHJldHVybiAoazogc3RyaW5nKSA9PiBsb2NhbE1hcENhY2hlLmdldChrKTtcblxuICAgICAgICAgICAgLy8g0YPQtNC+0LHQvdGL0LUg0LzQtdGC0L7QtNGLXG4gICAgICAgICAgICBpZiAocHJvcCA9PT0gXCJlbnRyaWVzXCIpIHJldHVybiAoKSA9PiBsb2NhbE1hcENhY2hlLmVudHJpZXMoKTtcbiAgICAgICAgICAgIGlmIChwcm9wID09PSBcImtleXNcIikgcmV0dXJuICgpID0+IGxvY2FsTWFwQ2FjaGUua2V5cygpO1xuICAgICAgICAgICAgaWYgKHByb3AgPT09IFwidmFsdWVzXCIpIHJldHVybiAoKSA9PiBsb2NhbE1hcENhY2hlLnZhbHVlcygpO1xuXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgaWYgKHByb3AgPT09IFwicmVmcmVzaFwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICgpID0+XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlUHJvbWlzZVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oKHMpID0+IHM/LnVwZGF0ZUNhY2hlPy4oKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHB4eSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFByb21pc2UtbGlrZTog0YfRgtC+0LHRiyDQvNC+0LbQvdC+INCx0YvQu9C+IGF3YWl0IG9wZW5EaXJlY3RvcnkoLi4uKVxuICAgICAgICAgICAgaWYgKHByb3AgPT09IFwidGhlblwiIHx8IHByb3AgPT09IFwiY2F0Y2hcIiB8fCBwcm9wID09PSBcImZpbmFsbHlcIikge1xuICAgICAgICAgICAgICAgIC8vINC00LXQu9Cw0LXQvCBwcm94eSBhd2FpdGFibGVcbiAgICAgICAgICAgICAgICBjb25zdCBwID0gc3RhdGVQcm9taXNlLnRoZW4oKCkgPT4gdHJ1ZSk7XG4gICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgIHJldHVybiBwW3Byb3BdLmJpbmQocCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vINCe0YHRgtCw0LvRjNC90L7QtTog0L/QvtC/0YDQvtCx0YPQtdC8INC/0YDQvtC60LjQvdGD0YLRjCDQvdCwIGRpckhhbmRsZSAo0LrQvtCz0LTQsCDQs9C+0YLQvtCy0L4pXG4gICAgICAgICAgICByZXR1cm4gKC4uLmFyZ3M6IGFueVtdKSA9PlxuICAgICAgICAgICAgICAgIHN0YXRlUHJvbWlzZS50aGVuKGFzeW5jIChzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghcykgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGggPSBhd2FpdCBzLmRpckhhbmRsZTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdiA9IGRoPy5bcHJvcF07XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdiA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gdi5hcHBseShkaCwgYXJncyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vINCS0JDQltCd0J46IG93bktleXMg0LTQvtC70LbQtdC9INCx0YvRgtGMINGB0LjQvdGF0YDQvtC90L3Ri9C8XG4gICAgICAgIG93bktleXMoKSB7XG4gICAgICAgICAgICByZXR1cm4gQXJyYXkuZnJvbShsb2NhbE1hcENhY2hlLmtleXMoKSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKCkge1xuICAgICAgICAgICAgcmV0dXJuIHsgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH07XG4gICAgICAgIH0sXG4gICAgfTtcblxuICAgIGNvbnN0IGZ4OiBhbnkgPSBmdW5jdGlvbiAoKSB7IH07XG4gICAgY29uc3QgcHh5ID0gbmV3IFByb3h5KGZ4LCBoYW5kbGVyKTtcbiAgICByZXR1cm4gcHh5O1xufVxuXG4vL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlYWRGaWxlKHJvb3RIYW5kbGUsIHJlbFBhdGgsIG9wdGlvbnM6IHsgYmFzZVBhdGg/OiBzdHJpbmcgfSA9IHt9LCBsb2dnZXIgPSBkZWZhdWx0TG9nZ2VyKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgeyByb290SGFuZGxlOiByZXNvbHZlZFJvb3QsIHJlc29sdmVkUGF0aCB9ID0gYXdhaXQgcmVzb2x2ZVBhdGgocm9vdEhhbmRsZSwgcmVsUGF0aCwgb3B0aW9ucz8uYmFzZVBhdGggfHwgXCJcIik7XG4gICAgICAgIGNvbnN0IGNsZWFuUGF0aCA9IHJlc29sdmVkUGF0aD8udHJpbT8uKCk/LnN0YXJ0c1dpdGg/LihcIi91c2VyL1wiKSA/XG4gICAgICAgICAgICByZXNvbHZlZFBhdGg/LnRyaW0/LigpPy5yZXBsYWNlPy4oL15cXC91c2VyL2csIFwiXCIpPy50cmltPy4oKSA6IHJlc29sdmVkUGF0aDtcblxuICAgICAgICAvLyBVc2UgV29ya2VyXG4gICAgICAgIGNvbnN0IGZpbGUgPSBhd2FpdCBwb3N0KCdyZWFkRmlsZScsIHsgcm9vdElkOiBcIlwiLCBwYXRoOiBjbGVhblBhdGgsIHR5cGU6IFwiYmxvYlwiIH0sIHJlc29sdmVkUm9vdCA/IFtyZXNvbHZlZFJvb3RdIDogW10pO1xuICAgICAgICByZXR1cm4gZmlsZTtcbiAgICB9IGNhdGNoIChlOiBhbnkpIHsgcmV0dXJuIGhhbmRsZUVycm9yKGxvZ2dlciwgJ2Vycm9yJywgYHJlYWRGaWxlOiAke2UubWVzc2FnZX1gKTsgfVxufVxuXG4vL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlYWRBc09iamVjdFVSTChyb290SGFuZGxlLCByZWxQYXRoLCBvcHRpb25zOiB7IGJhc2VQYXRoPzogc3RyaW5nIH0gPSB7fSwgbG9nZ2VyID0gZGVmYXVsdExvZ2dlcikge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGZpbGU6IGFueSA9IGF3YWl0IHJlYWRGaWxlKHJvb3RIYW5kbGUsIHJlbFBhdGgsIG9wdGlvbnMsIGxvZ2dlcik7XG4gICAgICAgIHJldHVybiBmaWxlID8gVVJMLmNyZWF0ZU9iamVjdFVSTChmaWxlKSA6IG51bGw7XG4gICAgfSBjYXRjaCAoZTogYW55KSB7IHJldHVybiBoYW5kbGVFcnJvcihsb2dnZXIsICdlcnJvcicsIGByZWFkQXNPYmplY3RVUkw6ICR7ZS5tZXNzYWdlfWApOyB9XG59XG5cbi8vXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVhZEZpbGVVVEY4KHJvb3RIYW5kbGUsIHJlbFBhdGgsIG9wdGlvbnM6IHsgYmFzZVBhdGg/OiBzdHJpbmcgfSA9IHt9LCBsb2dnZXIgPSBkZWZhdWx0TG9nZ2VyKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgZmlsZTogYW55ID0gYXdhaXQgcmVhZEZpbGUocm9vdEhhbmRsZSwgcmVsUGF0aCwgb3B0aW9ucywgbG9nZ2VyKTtcbiAgICAgICAgaWYgKCFmaWxlKSByZXR1cm4gXCJcIjtcbiAgICAgICAgcmV0dXJuIGF3YWl0IGZpbGUudGV4dCgpO1xuICAgIH0gY2F0Y2ggKGU6IGFueSkgeyByZXR1cm4gaGFuZGxlRXJyb3IobG9nZ2VyLCAnZXJyb3InLCBgcmVhZEZpbGVVVEY4OiAke2UubWVzc2FnZX1gKTsgfVxufVxuXG5cblxuLy9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3cml0ZUZpbGUocm9vdEhhbmRsZSwgcmVsUGF0aCwgZGF0YSwgbG9nZ2VyID0gZGVmYXVsdExvZ2dlcikge1xuICAgIGlmIChkYXRhIGluc3RhbmNlb2YgRmlsZVN5c3RlbUZpbGVIYW5kbGUpIHsgZGF0YSA9IGF3YWl0IGRhdGEuZ2V0RmlsZSgpOyB9XG4gICAgaWYgKGRhdGEgaW5zdGFuY2VvZiBGaWxlU3lzdGVtRGlyZWN0b3J5SGFuZGxlKSB7XG4gICAgICAgIGNvbnN0IGRzdEhhbmRsZSA9IGF3YWl0IGdldERpcmVjdG9yeUhhbmRsZShhd2FpdCByZXNvbHZlUm9vdEhhbmRsZShyb290SGFuZGxlKSwgcmVsUGF0aCArIChyZWxQYXRoPy50cmltPy4oKT8uZW5kc1dpdGg/LihcIi9cIikgPyBcIlwiIDogXCIvXCIpICsgKGRhdGE/Lm5hbWUgfHwgXCJcIik/LnRyaW0/LigpPy5yZXBsYWNlPy4oL1xccysvZywgJy0nKSwgeyBjcmVhdGU6IHRydWUgfSk7XG4gICAgICAgIHJldHVybiBhd2FpdCBjb3B5RnJvbU9uZUhhbmRsZXJUb0Fub3RoZXIoZGF0YSwgZHN0SGFuZGxlLCB7fSk/LmNhdGNoPy4oY29uc29sZS53YXJuLmJpbmQoY29uc29sZSkpO1xuICAgIH0gZWxzZVxuXG4gICAgICAgIC8vXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IHJvb3RIYW5kbGU6IHJlc29sdmVkUm9vdCwgcmVzb2x2ZWRQYXRoIH0gPSBhd2FpdCByZXNvbHZlUGF0aChyb290SGFuZGxlLCByZWxQYXRoLCBcIlwiKTtcbiAgICAgICAgICAgIGNvbnN0IGNsZWFuUGF0aCA9IHJlc29sdmVkUGF0aD8udHJpbT8uKCk/LnN0YXJ0c1dpdGg/LihcIi91c2VyL1wiKSA/XG4gICAgICAgICAgICAgICAgcmVzb2x2ZWRQYXRoPy50cmltPy4oKT8ucmVwbGFjZT8uKC9eXFwvdXNlci9nLCBcIlwiKT8udHJpbT8uKCkgOiByZXNvbHZlZFBhdGg7XG5cbiAgICAgICAgICAgIGF3YWl0IHBvc3QoJ3dyaXRlRmlsZScsIHsgcm9vdElkOiBcIlwiLCBwYXRoOiBjbGVhblBhdGgsIGRhdGEgfSwgcmVzb2x2ZWRSb290ID8gW3Jlc29sdmVkUm9vdF0gOiBbXSk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBjYXRjaCAoZTogYW55KSB7IHJldHVybiBoYW5kbGVFcnJvcihsb2dnZXIsICdlcnJvcicsIGB3cml0ZUZpbGU6ICR7ZS5tZXNzYWdlfWApOyB9XG59XG5cbi8vXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0RmlsZVdyaXRlcihyb290SGFuZGxlLCByZWxQYXRoLCBvcHRpb25zOiB7IGNyZWF0ZT86IGJvb2xlYW4sIGJhc2VQYXRoPzogc3RyaW5nIH0gPSB7IGNyZWF0ZTogdHJ1ZSB9LCBsb2dnZXIgPSBkZWZhdWx0TG9nZ2VyKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgeyByb290SGFuZGxlOiByZXNvbHZlZFJvb3RIYW5kbGUsIHJlc29sdmVkUGF0aCB9ID0gYXdhaXQgcmVzb2x2ZVBhdGgocm9vdEhhbmRsZSwgcmVsUGF0aCwgb3B0aW9ucz8uYmFzZVBhdGggfHwgXCJcIik7XG4gICAgICAgIHJldHVybiAoYXdhaXQgZ2V0RmlsZUhhbmRsZShyZXNvbHZlZFJvb3RIYW5kbGUsIHJlc29sdmVkUGF0aCwgb3B0aW9ucywgbG9nZ2VyKSk/LmNyZWF0ZVdyaXRhYmxlPy4oKTtcbiAgICB9IGNhdGNoIChlOiBhbnkpIHsgcmV0dXJuIGhhbmRsZUVycm9yKGxvZ2dlciwgJ2Vycm9yJywgYGdldEZpbGVXcml0ZXI6ICR7ZS5tZXNzYWdlfWApOyB9XG59XG5cblxuXG5cblxuLy9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZW1vdmVGaWxlKHJvb3RIYW5kbGUsIHJlbFBhdGgsIG9wdGlvbnM6IHsgcmVjdXJzaXZlPzogYm9vbGVhbiwgYmFzZVBhdGg/OiBzdHJpbmcgfSA9IHsgcmVjdXJzaXZlOiB0cnVlIH0sIGxvZ2dlciA9IGRlZmF1bHRMb2dnZXIpIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCB7IHJvb3RIYW5kbGU6IHJlc29sdmVkUm9vdCwgcmVzb2x2ZWRQYXRoIH0gPSBhd2FpdCByZXNvbHZlUGF0aChyb290SGFuZGxlLCByZWxQYXRoLCBvcHRpb25zPy5iYXNlUGF0aCB8fCBcIlwiKTtcbiAgICAgICAgY29uc3QgY2xlYW5QYXRoID0gcmVzb2x2ZWRQYXRoPy50cmltPy4oKT8uc3RhcnRzV2l0aD8uKFwiL3VzZXIvXCIpID9cbiAgICAgICAgICAgIHJlc29sdmVkUGF0aD8udHJpbT8uKCk/LnJlcGxhY2U/LigvXlxcL3VzZXIvZywgXCJcIik/LnRyaW0/LigpIDogcmVzb2x2ZWRQYXRoO1xuXG4gICAgICAgIGF3YWl0IHBvc3QoJ3JlbW92ZScsIHsgcm9vdElkOiBcIlwiLCBwYXRoOiBjbGVhblBhdGgsIHJlY3Vyc2l2ZTogb3B0aW9ucy5yZWN1cnNpdmUgfSwgcmVzb2x2ZWRSb290ID8gW3Jlc29sdmVkUm9vdF0gOiBbXSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gY2F0Y2ggKGU6IGFueSkgeyByZXR1cm4gaGFuZGxlRXJyb3IobG9nZ2VyLCAnZXJyb3InLCBgcmVtb3ZlRmlsZTogJHtlLm1lc3NhZ2V9YCk7IH1cbn1cblxuLy9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZW1vdmVEaXJlY3Rvcnkocm9vdEhhbmRsZSwgcmVsUGF0aCwgb3B0aW9uczogeyByZWN1cnNpdmU/OiBib29sZWFuLCBiYXNlUGF0aD86IHN0cmluZyB9ID0geyByZWN1cnNpdmU6IHRydWUgfSwgbG9nZ2VyID0gZGVmYXVsdExvZ2dlcikge1xuICAgIHRyeSB7XG4gICAgICAgIC8vIFJldXNlIGxvZ2ljIGZyb20gcmVtb3ZlRmlsZSBhcyB3b3JrZXIgZGlzdGluZ3Vpc2hlcyB2aWEgcGF0aCBoYW5kbGluZyBvciBqdXN0IHJlbW92ZUVudHJ5XG4gICAgICAgIHJldHVybiByZW1vdmVGaWxlKHJvb3RIYW5kbGUsIHJlbFBhdGgsIG9wdGlvbnMsIGxvZ2dlcik7XG4gICAgfSBjYXRjaCAoZTogYW55KSB7IHJldHVybiBoYW5kbGVFcnJvcihsb2dnZXIsICdlcnJvcicsIGByZW1vdmVEaXJlY3Rvcnk6ICR7ZS5tZXNzYWdlfWApOyB9XG59XG5cbi8vXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVtb3ZlKHJvb3RIYW5kbGUsIHJlbFBhdGgsIG9wdGlvbnM6IHsgYmFzZVBhdGg/OiBzdHJpbmcgfSA9IHt9LCBsb2dnZXIgPSBkZWZhdWx0TG9nZ2VyKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIHJlbW92ZUZpbGUocm9vdEhhbmRsZSwgcmVsUGF0aCwgeyByZWN1cnNpdmU6IHRydWUsIC4uLm9wdGlvbnMgfSwgbG9nZ2VyKTtcbiAgICB9IGNhdGNoIChlOiBhbnkpIHsgcmV0dXJuIGhhbmRsZUVycm9yKGxvZ2dlciwgJ2Vycm9yJywgYHJlbW92ZTogJHtlLm1lc3NhZ2V9YCk7IH1cbn1cblxuLy9cbmV4cG9ydCBjb25zdCBvcGVuSW1hZ2VGaWxlUGlja2VyID0gYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0ICRlID0gXCJzaG93T3BlbkZpbGVQaWNrZXJcIjsgLy8gQHRzLWlnbm9yZVxuICAgIGNvbnN0IHNob3dPcGVuRmlsZVBpY2tlciA9IHdpbmRvdz8uWyRlXT8uYmluZD8uKHdpbmRvdykgPz8gKGF3YWl0IGltcG9ydChcImZlc3QvcG9seWZpbGwvc2hvd09wZW5GaWxlUGlja2VyLm1qc1wiKSk/LlskZV07XG4gICAgcmV0dXJuIHNob3dPcGVuRmlsZVBpY2tlcihpbWFnZUltcG9ydERlc2MpO1xufVxuXG4vL1xuZXhwb3J0IGNvbnN0IGRvd25sb2FkRmlsZSA9IGFzeW5jIChmaWxlKSA9PiB7XG4gICAgLy8gYXMgZmlsZVxuICAgIGlmIChmaWxlIGluc3RhbmNlb2YgRmlsZVN5c3RlbUZpbGVIYW5kbGUpIHsgZmlsZSA9IGF3YWl0IGZpbGUuZ2V0RmlsZSgpOyB9XG4gICAgaWYgKHR5cGVvZiBmaWxlID09IFwic3RyaW5nXCIpIHsgZmlsZSA9IGF3YWl0IHByb3ZpZGUoZmlsZSk7IH07IGNvbnN0IGZpbGVuYW1lID0gZmlsZT8ubmFtZTsgaWYgKCFmaWxlbmFtZSkgcmV0dXJuOyAvLyBAdHMtaWdub3JlIC8vIElFMTArXG4gICAgaWYgKFwibXNTYXZlT3JPcGVuQmxvYlwiIGluIHNlbGYubmF2aWdhdG9yKSB7IHNlbGYubmF2aWdhdG9yLm1zU2F2ZU9yT3BlbkJsb2IoZmlsZSwgZmlsZW5hbWUpOyB9O1xuXG4gICAgLy8gZm9yIGRpcmVjdG9yeVxuICAgIGlmIChmaWxlIGluc3RhbmNlb2YgRmlsZVN5c3RlbURpcmVjdG9yeUhhbmRsZSkge1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIGxldCBkc3RIYW5kbGUgPSBhd2FpdCBzaG93RGlyZWN0b3J5UGlja2VyPy4oe1xuICAgICAgICAgICAgbW9kZTogXCJyZWFkd3JpdGVcIlxuICAgICAgICB9KT8uY2F0Y2g/Lihjb25zb2xlLndhcm4uYmluZChjb25zb2xlKSk7XG5cbiAgICAgICAgLy9cbiAgICAgICAgaWYgKGZpbGUgJiYgZHN0SGFuZGxlKSB7XG4gICAgICAgICAgICAvLyBvcGVuIGhhbmRsZSByZWxhdGl2ZSB0byBzZWxlY3RlZCBkaXJlY3RvcnlcbiAgICAgICAgICAgIGRzdEhhbmRsZSA9IChhd2FpdCBnZXREaXJlY3RvcnlIYW5kbGUoZHN0SGFuZGxlLCBmaWxlPy5uYW1lIHx8IFwiXCIsIHsgY3JlYXRlOiB0cnVlIH0pPy5jYXRjaD8uKGNvbnNvbGUud2Fybi5iaW5kKGNvbnNvbGUpKSkgfHwgZHN0SGFuZGxlO1xuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IGNvcHlGcm9tT25lSGFuZGxlclRvQW5vdGhlcihmaWxlLCBkc3RIYW5kbGUsIHt9KT8uY2F0Y2g/Lihjb25zb2xlLndhcm4uYmluZChjb25zb2xlKSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBjdXJyZW50bHksIGRpZmZlcmVudCBtZXRob2RzIGFyZSB1bnN1cHBvcnRlZC4uLiAobm90IGltcGxlbWVudGVkKVxuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGNvbnN0IGZ4ID0gYXdhaXQgKHNlbGY/LnNob3dPcGVuRmlsZVBpY2tlciA/IG5ldyBQcm9taXNlKChyKSA9PiByKHsgLy8gQHRzLWlnbm9yZVxuICAgICAgICBzaG93T3BlbkZpbGVQaWNrZXI6IHNlbGY/LnNob3dPcGVuRmlsZVBpY2tlcj8uYmluZD8uKHdpbmRvdyksIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgc2hvd1NhdmVGaWxlUGlja2VyOiBzZWxmPy5zaG93U2F2ZUZpbGVQaWNrZXI/LmJpbmQ/Lih3aW5kb3cpLCAvLyBAdHMtaWdub3JlXG4gICAgfSkpIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgOiBpbXBvcnQoLyogQHZpdGUtaWdub3JlICovIFwiZmVzdC9wb2x5ZmlsbC9zaG93T3BlbkZpbGVQaWNrZXIubWpzXCIpKTtcblxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBpZiAod2luZG93Py5zaG93U2F2ZUZpbGVQaWNrZXIpIHsgLy8gQHRzLWlnbm9yZVxuICAgICAgICBjb25zdCBmaWxlSGFuZGxlID0gYXdhaXQgZng/LnNob3dTYXZlRmlsZVBpY2tlcj8uKHsgc3VnZ2VzdGVkTmFtZTogZmlsZW5hbWUgfSk/LmNhdGNoPy4oY29uc29sZS53YXJuLmJpbmQoY29uc29sZSkpO1xuICAgICAgICBjb25zdCB3cml0YWJsZUZpbGVTdHJlYW0gPSBhd2FpdCBmaWxlSGFuZGxlPy5jcmVhdGVXcml0YWJsZT8uKHsga2VlcEV4aXN0aW5nRGF0YTogdHJ1ZSB9KT8uY2F0Y2g/Lihjb25zb2xlLndhcm4uYmluZChjb25zb2xlKSk7XG4gICAgICAgIGF3YWl0IHdyaXRhYmxlRmlsZVN0cmVhbT8ud3JpdGU/LihmaWxlKT8uY2F0Y2g/Lihjb25zb2xlLndhcm4uYmluZChjb25zb2xlKSk7XG4gICAgICAgIGF3YWl0IHdyaXRhYmxlRmlsZVN0cmVhbT8uY2xvc2U/LigpPy5jYXRjaD8uKGNvbnNvbGUud2Fybi5iaW5kKGNvbnNvbGUpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XG4gICAgICAgIHRyeSB7IGEuaHJlZiA9IFVSTC5jcmVhdGVPYmplY3RVUkwoZmlsZSk7IH0gY2F0Y2ggKGUpIHsgY29uc29sZS53YXJuKGUpOyB9O1xuICAgICAgICBhLmRvd25sb2FkID0gZmlsZW5hbWU7IGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoYSk7IGEuY2xpY2soKTtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGEpO1xuICAgICAgICAgICAgZ2xvYmFsVGhpcy5VUkwucmV2b2tlT2JqZWN0VVJMKGEuaHJlZik7XG4gICAgICAgIH0sIDApO1xuICAgIH1cbn1cblxuLy9cbmV4cG9ydCBjb25zdCBwcm92aWRlID0gYXN5bmMgKHJlcTogc3RyaW5nIHwgUmVxdWVzdCA9IFwiXCIsIHJ3ID0gZmFsc2UpID0+IHtcbiAgICBjb25zdCB1cmw6IHN0cmluZyA9IChyZXEgYXMgUmVxdWVzdCk/LnVybCA/PyByZXE7XG4gICAgY29uc3QgY2xlYW5VcmwgPSB1cmw/LnJlcGxhY2U/Lihsb2NhdGlvbi5vcmlnaW4sIFwiXCIpPy50cmltPy4oKTtcblxuICAgIC8vXG4gICAgaWYgKGNsZWFuVXJsPy5zdGFydHNXaXRoPy4oXCIvdXNlclwiKSkge1xuICAgICAgICBjb25zdCBwYXRoID0gY2xlYW5Vcmw/LnJlcGxhY2U/LigvXlxcL3VzZXIvZywgXCJcIik/LnRyaW0/LigpO1xuICAgICAgICBjb25zdCByb290ID0gYXdhaXQgbmF2aWdhdG9yPy5zdG9yYWdlPy5nZXREaXJlY3Rvcnk/LigpO1xuICAgICAgICBjb25zdCBoYW5kbGUgPSBhd2FpdCBnZXRGaWxlSGFuZGxlKHJvb3QsIHBhdGgsIHsgY3JlYXRlOiAhIXJ3IH0pO1xuXG4gICAgICAgIGlmIChydykge1xuICAgICAgICAgICAgcmV0dXJuIGhhbmRsZT8uY3JlYXRlV3JpdGFibGU/LigpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBoYW5kbGU/LmdldEZpbGU/LigpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAoIXJlcSkgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2gocmVxKTtcbiAgICAgICAgICAgIGNvbnN0IGJsb2IgPSBhd2FpdCByPy5ibG9iKCk/LmNhdGNoPy4oY29uc29sZS53YXJuLmJpbmQoY29uc29sZSkpO1xuICAgICAgICAgICAgY29uc3QgbGFzdE1vZGlmaWVkSGVhZGVyID0gcj8uaGVhZGVycz8uZ2V0Py4oXCJMYXN0LU1vZGlmaWVkXCIpO1xuICAgICAgICAgICAgY29uc3QgbGFzdE1vZGlmaWVkID0gbGFzdE1vZGlmaWVkSGVhZGVyID8gRGF0ZS5wYXJzZShsYXN0TW9kaWZpZWRIZWFkZXIpIDogMDtcblxuICAgICAgICAgICAgaWYgKGJsb2IpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEZpbGUoW2Jsb2JdLCB1cmw/LnN1YnN0cmluZyh1cmw/Lmxhc3RJbmRleE9mKCcvJykgKyAxKSwge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBibG9iPy50eXBlLFxuICAgICAgICAgICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IGlzTmFOKGxhc3RNb2RpZmllZCkgPyAwIDogbGFzdE1vZGlmaWVkXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZTogYW55KSB7IHJldHVybiBoYW5kbGVFcnJvcihkZWZhdWx0TG9nZ2VyLCAnZXJyb3InLCBgcHJvdmlkZTogJHtlLm1lc3NhZ2V9YCk7IH1cbiAgICB9XG59XG5cbi8vXG5leHBvcnQgY29uc3QgZ2V0TGVhc3QgPSAoaXRlbSkgPT4ge1xuICAgIGlmIChpdGVtPy50eXBlcz8ubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gaXRlbT8uZ2V0VHlwZT8uKEFycmF5LmZyb20oaXRlbT8udHlwZXMgfHwgW10pPy5hdD8uKC0xKSk7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xufVxuXG4vL1xuZXhwb3J0IGNvbnN0IGRyb3BGaWxlID0gYXN5bmMgKGZpbGUsIGRlc3QgPSBcIi91c2VyL1wiPy50cmltPy4oKT8ucmVwbGFjZT8uKC9cXHMrL2csICctJyksIGN1cnJlbnQ/OiBhbnkpID0+IHtcbiAgICBjb25zdCBmcyA9IGF3YWl0IHJlc29sdmVSb290SGFuZGxlKG51bGwpO1xuICAgIGNvbnN0IHBhdGggPSBnZXREaXIoZGVzdD8udHJpbT8uKCk/LnN0YXJ0c1dpdGg/LihcIi91c2VyL1wiKSA/IGRlc3Q/LnJlcGxhY2U/LigvXlxcL3VzZXIvZywgXCJcIik/LnRyaW0/LigpIDogZGVzdCk7XG4gICAgY29uc3QgdXNlciA9IHBhdGg/LnJlcGxhY2U/LihcIi91c2VyXCIsIFwiXCIpPy50cmltPy4oKTtcblxuICAgIC8vXG4gICAgZmlsZSA9IGZpbGUgaW5zdGFuY2VvZiBGaWxlID8gZmlsZSA6IChuZXcgRmlsZShbZmlsZV0sIFVVSUR2NCgpICsgXCIuXCIgKyAoZmlsZT8udHlwZT8uc3BsaXQ/LihcIi9cIik/LlsxXSB8fCBcInRtcFwiKSkpXG5cbiAgICAvL1xuICAgIGNvbnN0IGZwID0gdXNlciArIChmaWxlPy5uYW1lIHx8IFwid2FsbHBhcGVyXCIpPy50cmltPy4oKT8ucmVwbGFjZT8uKC9cXHMrL2csICctJyk7XG4gICAgYXdhaXQgd3JpdGVGaWxlKGZzLCBmcCwgZmlsZSk7XG5cbiAgICAvLyBUT0RPISBuZWVkcyB0byBmaXggc2FtZSBkaXJlY3Rvcnkgc2NvcGVcbiAgICBjdXJyZW50Py5zZXQ/LihcIi91c2VyXCIgKyBmcD8udHJpbT8uKCk/LnJlcGxhY2U/LigvXFxzKy9nLCAnLScpLCBmaWxlKTtcbiAgICByZXR1cm4gXCIvdXNlclwiICsgZnA/LnRyaW0/LigpO1xufVxuXG4vL1xuZXhwb3J0IGNvbnN0IHVwbG9hZERpcmVjdG9yeSA9IGFzeW5jIChkZXN0ID0gXCIvdXNlci9cIiwgaWQ6IGFueSA9IG51bGwpID0+IHtcbiAgICBkZXN0ID0gZGVzdD8udHJpbT8uKCk/LnN0YXJ0c1dpdGg/LihcIi91c2VyL1wiKSA/IGRlc3Q/LnRyaW0/LigpPy5yZXBsYWNlPy4oL15cXC91c2VyL2csIFwiXCIpPy50cmltPy4oKSA6IGRlc3Q7XG4gICAgaWYgKCFnbG9iYWxUaGlzLnNob3dEaXJlY3RvcnlQaWNrZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBjb25zdCBzcmNIYW5kbGUgPSBhd2FpdCBzaG93RGlyZWN0b3J5UGlja2VyPy4oe1xuICAgICAgICBtb2RlOiBcInJlYWRvbmx5XCIsIGlkXG4gICAgfSk/LmNhdGNoPy4oY29uc29sZS53YXJuLmJpbmQoY29uc29sZSkpO1xuICAgIGlmICghc3JjSGFuZGxlKSByZXR1cm47XG5cbiAgICAvL1xuICAgIGNvbnN0IGRzdEhhbmRsZSA9IGF3YWl0IGdldERpcmVjdG9yeUhhbmRsZShhd2FpdCByZXNvbHZlUm9vdEhhbmRsZShudWxsKSwgZGVzdCArIChkZXN0Py50cmltPy4oKT8uZW5kc1dpdGg/LihcIi9cIikgPyBcIlwiIDogXCIvXCIpICsgc3JjSGFuZGxlLm5hbWU/LnRyaW0/LigpPy5yZXBsYWNlPy4oL1xccysvZywgJy0nKSwgeyBjcmVhdGU6IHRydWUgfSk7XG4gICAgaWYgKCFkc3RIYW5kbGUpIHJldHVybjtcbiAgICByZXR1cm4gYXdhaXQgY29weUZyb21PbmVIYW5kbGVyVG9Bbm90aGVyKHNyY0hhbmRsZSwgZHN0SGFuZGxlLCB7fSk/LmNhdGNoPy4oY29uc29sZS53YXJuLmJpbmQoY29uc29sZSkpO1xufVxuXG4vL1xuZXhwb3J0IGNvbnN0IHVwbG9hZEZpbGUgPSBhc3luYyAoZGVzdCA9IFwiL3VzZXIvXCI/LnRyaW0/LigpPy5yZXBsYWNlPy4oL1xccysvZywgJy0nKSwgY3VycmVudD86IGFueSkgPT4ge1xuICAgIGNvbnN0ICRlID0gXCJzaG93T3BlbkZpbGVQaWNrZXJcIjsgZGVzdCA9IGRlc3Q/LnRyaW0/LigpPy5zdGFydHNXaXRoPy4oXCIvdXNlci9cIikgPyBkZXN0Py50cmltPy4oKT8ucmVwbGFjZT8uKC9eXFwvdXNlci9nLCBcIlwiKT8udHJpbT8uKCkgOiBkZXN0O1xuXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGNvbnN0IHNob3dPcGVuRmlsZVBpY2tlciA9IHdpbmRvdz8uWyRlXT8uYmluZD8uKHdpbmRvdykgPz8gKGF3YWl0IGltcG9ydChcImZlc3QvcG9seWZpbGwvc2hvd09wZW5GaWxlUGlja2VyLm1qc1wiKSk/LlskZV07XG4gICAgcmV0dXJuIHNob3dPcGVuRmlsZVBpY2tlcih7IC4uLmdlbmVyYWxGaWxlSW1wb3J0RGVzYywgbXVsdGlwbGU6IHRydWUgfSBhcyBhbnkpPy50aGVuPy4oYXN5bmMgKGhhbmRsZXMgPSBbXSkgPT4ge1xuICAgICAgICBmb3IgKGNvbnN0IGhhbmRsZSBvZiBoYW5kbGVzKSB7XG4gICAgICAgICAgICBjb25zdCBmaWxlID0gKGhhbmRsZSBhcyBhbnkpIGluc3RhbmNlb2YgRmlsZSA/IChoYW5kbGUgYXMgYW55KSA6IChhd2FpdCAoaGFuZGxlIGFzIGFueSk/LmdldEZpbGU/LigpKTtcbiAgICAgICAgICAgIGF3YWl0IGRyb3BGaWxlKGZpbGUsIGRlc3QsIGN1cnJlbnQpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbi8vXG5leHBvcnQgY29uc3QgZ2hvc3RJbWFnZSA9IHR5cGVvZiBJbWFnZSAhPSBcInVuZGVmaW5lZFwiID8gbmV3IEltYWdlKCkgOiBudWxsO1xuaWYgKGdob3N0SW1hZ2UpIHtcbiAgICBnaG9zdEltYWdlLmRlY29kaW5nID0gXCJhc3luY1wiO1xuICAgIGdob3N0SW1hZ2Uud2lkdGggPSAyNDtcbiAgICBnaG9zdEltYWdlLmhlaWdodCA9IDI0O1xuXG5cbiAgICAvL1xuICAgIHRyeSB7XG4gICAgICAgIGdob3N0SW1hZ2Uuc3JjID0gVVJMLmNyZWF0ZU9iamVjdFVSTChuZXcgQmxvYihbYDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMzg0IDUxMlwiPjwhLS0hRm9udCBBd2Vzb21lIEZyZWUgNi43LjIgYnkgQGZvbnRhd2Vzb21lIC0gaHR0cHM6Ly9mb250YXdlc29tZS5jb20gTGljZW5zZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tL2xpY2Vuc2UvZnJlZSBDb3B5cmlnaHQgMjAyNSBGb250aWNvbnMsIEluYy4tLT48cGF0aCBkPVwiTTAgNjRDMCAyOC43IDI4LjcgMCA2NCAwTDIyNCAwbDAgMTI4YzAgMTcuNyAxNC4zIDMyIDMyIDMybDEyOCAwIDAgMjg4YzAgMzUuMy0yOC43IDY0LTY0IDY0TDY0IDUxMmMtMzUuMyAwLTY0LTI4LjctNjQtNjRMMCA2NHptMzg0IDY0bC0xMjggMEwyNTYgMCAzODQgMTI4elwiLz48L3N2Zz5gXSwgeyB0eXBlOiBcImltYWdlL3N2Zyt4bWxcIiB9KSk7XG4gICAgfSBjYXRjaCAoZSkgeyB9XG59XG5cblxuLyogIC8vIGluIGRyYWctc3RhcnRcbiAgICBldi5kYXRhVHJhbnNmZXIuZWZmZWN0QWxsb3dlZCA9IFwiY29weUxpbmtcIjtcbiAgICBldj8uZGF0YVRyYW5zZmVyPy5jbGVhckRhdGE/LigpO1xuICAgIGV2Py5kYXRhVHJhbnNmZXI/LnNldERyYWdJbWFnZT8uKGdob3N0SW1hZ2UsIDAsIDApO1xuKi9cblxuLy9cbmV4cG9ydCBjb25zdCBhdHRhY2hGaWxlID0gKHRyYW5zZmVyLCBmaWxlLCBwYXRoID0gXCJcIikgPT4ge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHVybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoZmlsZSk7XG4gICAgICAgIGlmIChmaWxlPy50eXBlICYmIGZpbGU/LnR5cGUgIT0gXCJ0ZXh0L3BsYWluXCIpIHtcbiAgICAgICAgICAgIHRyYW5zZmVyPy5pdGVtcz8uYWRkPy4oZmlsZSwgZmlsZT8udHlwZSB8fCBcInRleHQvcGxhaW5cIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0cmFuc2Zlcj8uYWRkPy4oZmlsZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhdGgpIHsgdHJhbnNmZXI/Lml0ZW1zPy5hZGQ/LihwYXRoLCBcInRleHQvcGxhaW5cIik7IH07XG4gICAgICAgIHRyYW5zZmVyPy5zZXREYXRhPy4oXCJ0ZXh0L3VyaS1saXN0XCIsIHVybCk7XG4gICAgICAgIHRyYW5zZmVyPy5zZXREYXRhPy4oXCJEb3dubG9hZFVSTFwiLCBmaWxlPy50eXBlICsgXCI6XCIgKyBmaWxlPy5uYW1lICsgXCI6XCIgKyB1cmwpO1xuICAgIH0gY2F0Y2ggKGUpIHsgfVxufVxuXG4vL1xuZXhwb3J0IGNvbnN0IGRyb3BBc1RlbXBGaWxlID0gYXN5bmMgKGRhdGE6IGFueSkgPT4ge1xuICAgIGNvbnN0IGl0ZW1zID0gKGRhdGEpPy5pdGVtcztcbiAgICBjb25zdCBpdGVtID0gaXRlbXM/LlswXTtcbiAgICBjb25zdCBpc0ltYWdlID0gaXRlbT8udHlwZXM/LmZpbmQ/LigobikgPT4gbj8uc3RhcnRzV2l0aD8uKFwiaW1hZ2UvXCIpKTtcbiAgICBjb25zdCBibG9iID0gYXdhaXQgKGRhdGE/LmZpbGVzPy5bMF0gPz8gKChpc0ltYWdlID8gaXRlbT8uZ2V0VHlwZT8uKGlzSW1hZ2UpIDogbnVsbCkgfHwgZ2V0TGVhc3QoaXRlbSkpKTtcbiAgICByZXR1cm4gZHJvcEZpbGUoYmxvYiwgXCIvdXNlci90ZW1wL1wiPy50cmltPy4oKT8ucmVwbGFjZT8uKC9cXHMrL2csICctJykpO1xufVxuXG4vL1xuZXhwb3J0IGNvbnN0IGNsZWFyQWxsSW5EaXJlY3RvcnkgPSBhc3luYyAocm9vdEhhbmRsZTogYW55ID0gbnVsbCwgcmVsUGF0aCA9IFwiXCIsIG9wdGlvbnM6IHsgYmFzZVBhdGg/OiBzdHJpbmcgfSA9IHt9LCBsb2dnZXIgPSBkZWZhdWx0TG9nZ2VyKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgeyByb290SGFuZGxlOiByZXNvbHZlZFJvb3QsIHJlc29sdmVkUGF0aCB9ID0gYXdhaXQgcmVzb2x2ZVBhdGgocm9vdEhhbmRsZSwgcmVsUGF0aCwgb3B0aW9ucz8uYmFzZVBhdGggfHwgXCJcIik7XG4gICAgICAgIGNvbnN0IGNsZWFuUGF0aCA9IHJlc29sdmVkUGF0aD8udHJpbT8uKCk/LnN0YXJ0c1dpdGg/LihcIi91c2VyL1wiKSA/XG4gICAgICAgICAgICByZXNvbHZlZFBhdGg/LnRyaW0/LigpPy5yZXBsYWNlPy4oL15cXC91c2VyL2csIFwiXCIpPy50cmltPy4oKSA6IHJlc29sdmVkUGF0aDtcblxuICAgICAgICBhd2FpdCBwb3N0KCdyZW1vdmUnLCB7IHJvb3RJZDogXCJcIiwgcGF0aDogY2xlYW5QYXRoLCByZWN1cnNpdmU6IHRydWUgfSwgcmVzb2x2ZWRSb290ID8gW3Jlc29sdmVkUm9vdF0gOiBbXSk7XG4gICAgfSBjYXRjaCAoZTogYW55KSB7IHJldHVybiBoYW5kbGVFcnJvcihsb2dnZXIsICdlcnJvcicsIGBjbGVhckFsbEluRGlyZWN0b3J5OiAke2UubWVzc2FnZX1gKTsgfVxufVxuXG4vLyB1c2VkIGZvciBpbXBvcnQvZXhwb3J0IGJ5IGZpbGUgcGlja2VycyAoT1BGUywgRmlsZVN5c3RlbSwgZXRjLiApXG5leHBvcnQgY29uc3QgY29weUZyb21PbmVIYW5kbGVyVG9Bbm90aGVyID0gYXN5bmMgKGZyb21IYW5kbGU6IEZpbGVTeXN0ZW1EaXJlY3RvcnlIYW5kbGUgfCBGaWxlU3lzdGVtRmlsZUhhbmRsZSwgdG9IYW5kbGU6IEZpbGVTeXN0ZW1EaXJlY3RvcnlIYW5kbGUgfCBGaWxlU3lzdGVtRmlsZUhhbmRsZSwgb3B0aW9ucyA9IHt9LCBsb2dnZXIgPSBkZWZhdWx0TG9nZ2VyKSA9PiB7XG4gICAgLy8gV2UgZGVsZWdhdGUgdG8gd29ya2VyXG4gICAgcmV0dXJuIHBvc3QoJ2NvcHknLCB7IGZyb206IGZyb21IYW5kbGUsIHRvOiB0b0hhbmRsZSB9LCBbZnJvbUhhbmRsZSwgdG9IYW5kbGVdKTtcbn1cblxuLy9cbmV4cG9ydCBjb25zdCBoYW5kbGVJbmNvbWluZ0VudHJpZXMgPSAoXG4gICAgZGF0YTogRGF0YVRyYW5zZmVyIHwgRmlsZUxpc3QgfCBGaWxlW10gfCBhbnksXG4gICAgZGVzdFBhdGg6IHN0cmluZyA9IFwiL3VzZXIvXCIsXG4gICAgcm9vdEhhbmRsZTogYW55ID0gbnVsbCxcbiAgICBvbkl0ZW1IYW5kbGVkPzogKGZpbGU6IEZpbGUsIHBhdGg6IHN0cmluZykgPT4gdm9pZCB8IFByb21pc2U8dm9pZD5cbikgPT4ge1xuICAgIGNvbnN0IHRhc2tzOiBQcm9taXNlPGFueT5bXSA9IFtdO1xuICAgIGNvbnN0IGl0ZW1zID0gQXJyYXkuZnJvbShkYXRhPy5pdGVtcyA/PyBbXSk7XG4gICAgY29uc3QgZmlsZXMgPSBBcnJheS5mcm9tKGRhdGE/LmZpbGVzID8/IFtdKTtcbiAgICBjb25zdCBkYXRhQXJyYXkgPSBBcnJheS5pc0FycmF5KGRhdGEpID8gZGF0YSA6IFsuLi4oKGRhdGE/LltTeW1ib2wuaXRlcmF0b3JdID8gZGF0YSA6IFtkYXRhXSkpXTtcblxuICAgIC8vXG4gICAgcmV0dXJuIFByb21pc2UudHJ5KGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3QgcmVzb2x2ZWRSb290ID0gYXdhaXQgcmVzb2x2ZVJvb3RIYW5kbGUocm9vdEhhbmRsZSk7XG5cbiAgICAgICAgLy9cbiAgICAgICAgY29uc3QgcHJvY2Vzc0l0ZW0gPSBhc3luYyAoaXRlbTogYW55KSA9PiB7XG4gICAgICAgICAgICAvLyBIYW5kbGUgRmlsZVN5c3RlbUhhbmRsZSAobW9kZXJuIGRyYWcvZHJvcClcbiAgICAgICAgICAgIGxldCBoYW5kbGU6IGFueTtcbiAgICAgICAgICAgIGlmIChpdGVtLmtpbmQgPT09ICdmaWxlJyB8fCBpdGVtLmtpbmQgPT09ICdkaXJlY3RvcnknKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgICAgICBoYW5kbGUgPSBhd2FpdCBpdGVtLmdldEFzRmlsZVN5c3RlbUhhbmRsZT8uKCk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCB7IH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGhhbmRsZSkge1xuICAgICAgICAgICAgICAgIGlmIChoYW5kbGUua2luZCA9PT0gJ2RpcmVjdG9yeScpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbndkID0gYXdhaXQgZ2V0RGlyZWN0b3J5SGFuZGxlKHJlc29sdmVkUm9vdCwgZGVzdFBhdGggKyAoaGFuZGxlLm5hbWUgfHwgXCJcIikudHJpbSgpLnJlcGxhY2UoL1xccysvZywgJy0nKSwgeyBjcmVhdGU6IHRydWUgfSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChud2QpIHRhc2tzLnB1c2goY29weUZyb21PbmVIYW5kbGVyVG9Bbm90aGVyKGhhbmRsZSwgbndkLCB7IGNyZWF0ZTogdHJ1ZSB9KSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZmlsZSA9IGF3YWl0IGhhbmRsZS5nZXRGaWxlKCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhdGggPSBkZXN0UGF0aCArIChmaWxlLm5hbWUgfHwgaGFuZGxlLm5hbWUpLnRyaW0oKS5yZXBsYWNlKC9cXHMrL2csICctJyk7XG4gICAgICAgICAgICAgICAgICAgIHRhc2tzLnB1c2god3JpdGVGaWxlKHJlc29sdmVkUm9vdCwgcGF0aCwgZmlsZSkudGhlbigoKSA9PiBvbkl0ZW1IYW5kbGVkPy4oZmlsZSwgcGF0aCkpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBIYW5kbGUgRmlsZSBvYmplY3QgKGZhbGxiYWNrKVxuICAgICAgICAgICAgaWYgKGl0ZW0ua2luZCA9PT0gJ2ZpbGUnIHx8IGl0ZW0gaW5zdGFuY2VvZiBGaWxlKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZmlsZSA9IGl0ZW0gaW5zdGFuY2VvZiBGaWxlID8gaXRlbSA6IGl0ZW0uZ2V0QXNGaWxlKCk7XG4gICAgICAgICAgICAgICAgaWYgKGZpbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGF0aCA9IGRlc3RQYXRoICsgKGZpbGUubmFtZSkudHJpbSgpLnJlcGxhY2UoL1xccysvZywgJy0nKTtcbiAgICAgICAgICAgICAgICAgICAgdGFza3MucHVzaCh3cml0ZUZpbGUocmVzb2x2ZWRSb290LCBwYXRoLCBmaWxlKS50aGVuKCgpID0+IG9uSXRlbUhhbmRsZWQ/LihmaWxlLCBwYXRoKSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIC8vIDEuIFRyeSBEYXRhVHJhbnNmZXIgaXRlbXNcbiAgICAgICAgaWYgKGl0ZW1zPy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgaXRlbXMgYXMgYW55KSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgcHJvY2Vzc0l0ZW0oaXRlbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gMi4gVHJ5IEZpbGVzXG4gICAgICAgIGlmIChmaWxlcz8ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBmaWxlIG9mIGZpbGVzIGFzIGFueSkge1xuICAgICAgICAgICAgICAgIGF3YWl0IHByb2Nlc3NJdGVtKGZpbGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIDMuIEFycmF5IG9mIEZpbGVzXG4gICAgICAgIGlmIChkYXRhQXJyYXk/Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBkYXRhQXJyYXkpIHtcbiAgICAgICAgICAgICAgICBhd2FpdCBwcm9jZXNzSXRlbShpdGVtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDQuIEhhbmRsZSB0ZXh0L3VyaS1saXN0XG4gICAgICAgIGNvbnN0IHVyaUxpc3QgPSBkYXRhPy5nZXREYXRhPy4oXCJ0ZXh0L3VyaS1saXN0XCIpIHx8IGRhdGE/LmdldERhdGE/LihcInRleHQvcGxhaW5cIik7XG4gICAgICAgIGlmICh1cmlMaXN0ICYmIHR5cGVvZiB1cmlMaXN0ID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBjb25zdCB1cmxzID0gdXJpTGlzdC5zcGxpdCgvXFxyP1xcbi8pLmZpbHRlcihCb29sZWFuKTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgdXJsIG9mIHVybHMpIHtcbiAgICAgICAgICAgICAgICBpZiAodXJsLnN0YXJ0c1dpdGgoXCJmaWxlOi8vXCIpKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAvLyBEZXRlY3QgaWYgaXQncyBpbnRlcm5hbCAvdXNlci8gcGF0aFxuICAgICAgICAgICAgICAgIGlmICh1cmwuc3RhcnRzV2l0aChcIi91c2VyL1wiKSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzcmMgPSB1cmwudHJpbSgpO1xuICAgICAgICAgICAgICAgICAgICAvLyBDb3B5IGludGVybmFsXG4gICAgICAgICAgICAgICAgICAgIHRhc2tzLnB1c2goUHJvbWlzZS50cnkoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3JjSGFuZGxlID0gYXdhaXQgZ2V0SGFuZGxlcihyZXNvbHZlZFJvb3QsIHNyYyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3JjSGFuZGxlPy5oYW5kbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBuYW1lID0gc3JjLnNwbGl0KFwiL1wiKS5maWx0ZXIoQm9vbGVhbikucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNyY0hhbmRsZS50eXBlID09PSAnZGlyZWN0b3J5Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBud2QgPSBhd2FpdCBnZXREaXJlY3RvcnlIYW5kbGUocmVzb2x2ZWRSb290LCBkZXN0UGF0aCArIG5hbWUsIHsgY3JlYXRlOiB0cnVlIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBjb3B5RnJvbU9uZUhhbmRsZXJUb0Fub3RoZXIoc3JjSGFuZGxlLmhhbmRsZSwgbndkLCB7IGNyZWF0ZTogdHJ1ZSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBmaWxlID0gYXdhaXQgc3JjSGFuZGxlLmhhbmRsZS5nZXRGaWxlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhdGggPSBkZXN0UGF0aCArIG5hbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHdyaXRlRmlsZShyZXNvbHZlZFJvb3QsIHBhdGgsIGZpbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkl0ZW1IYW5kbGVkPy4oZmlsZSwgcGF0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gRXh0ZXJuYWwgVVJMXG4gICAgICAgICAgICAgICAgICAgIHRhc2tzLnB1c2goUHJvbWlzZS50cnkoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZmlsZSA9IGF3YWl0IHByb3ZpZGUodXJsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcGF0aCA9IGRlc3RQYXRoICsgZmlsZS5uYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHdyaXRlRmlsZShyZXNvbHZlZFJvb3QsIHBhdGgsIGZpbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uSXRlbUhhbmRsZWQ/LihmaWxlLCBwYXRoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDUuIEhhbmRsZSBDbGlwYm9hcmRJdGVtcyAoZm9yIGFzeW5jIGNsaXBib2FyZCBBUEkpXG4gICAgICAgIC8vIFRoaXMgaXMgdXN1YWxseSBwYXNzZWQgYXMgYW4gYXJyYXkgb2YgQ2xpcGJvYXJkSXRlbSBvYmplY3RzLCBidXQgYGRhdGFgIGhlcmUgbWlnaHQgYmUgRGF0YVRyYW5zZmVyLlxuICAgICAgICAvLyBJZiBwYXNzZWQgZXhwbGljaXRseTpcbiAgICAgICAgaWYgKGRhdGFBcnJheT8uWzBdIGluc3RhbmNlb2YgQ2xpcGJvYXJkSXRlbSkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIGRhdGFBcnJheSkge1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgdHlwZSBvZiBpdGVtLnR5cGVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlLnN0YXJ0c1dpdGgoXCJpbWFnZS9cIikgfHwgdHlwZS5zdGFydHNXaXRoKFwidGV4dC9cIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGJsb2IgPSBhd2FpdCBpdGVtLmdldFR5cGUodHlwZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBleHQgPSB0eXBlLnNwbGl0KFwiL1wiKVsxXS5zcGxpdChcIitcIilbMF0gfHwgXCJ0eHRcIjsgLy8gc2ltcGxpZmllZFxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZmlsZSA9IG5ldyBGaWxlKFtibG9iXSwgYGNsaXBib2FyZC0ke0RhdGUubm93KCl9LiR7ZXh0fWAsIHsgdHlwZSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhdGggPSBkZXN0UGF0aCArIGZpbGUubmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhc2tzLnB1c2god3JpdGVGaWxlKHJlc29sdmVkUm9vdCwgcGF0aCwgZmlsZSkudGhlbigoKSA9PiBvbkl0ZW1IYW5kbGVkPy4oZmlsZSwgcGF0aCkpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vXG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsU2V0dGxlZCh0YXNrcykuY2F0Y2goY29uc29sZS53YXJuLmJpbmQoY29uc29sZSkpO1xuICAgIH0pO1xufVxuIl19