import { UUIDv4, Promised } from 'fest/core';
import { makeReactive } from 'fest/object';
import OPFSWorker from './OPFS.worker?worker';

//
let worker: any = self;

//
try {
    worker = !(typeof ServiceWorkerGlobalScope != "undefined" && self instanceof ServiceWorkerGlobalScope) ? (typeof Worker != "undefined" ? new OPFSWorker() : self) : self;
} catch (e) {
    worker = self;
}

//
const pending = new Map();
const observers = new Map();

//
if (worker != null) {
    worker.onmessage = (e) => {
        const { id, result, error, type, changes } = e.data;

        if (type === "observation") {
            const obs = observers.get(id);
            if (obs) obs(changes);
            return;
        }

        if (id && pending.has(id)) {
            const { resolve, reject } = pending.get(id);
            pending.delete(id);
            if (error) reject(new Error(error));
            else resolve(result);
        }
    };
}

//
const post = (type: string, payload: any = {}, transfer: any[] = []) => {
    return new Promise((resolve, reject) => {
        const id = UUIDv4();
        pending.set(id, { resolve, reject });
        const transferables = transfer?.filter?.((t)=>(t instanceof File || t instanceof Blob || t instanceof ArrayBuffer || t instanceof DataTransfer || /*t instanceof FileSystemHandle || t instanceof FileSystemDirectoryHandle || t instanceof FileSystemFileHandle ||*/ t instanceof MessagePort));
        worker.postMessage({ id, type, payload }, transferables?.length ? transferables : undefined);
    });
};

//
export const getDir = (dest)=>{
    if (typeof dest != "string") return dest; dest = dest?.trim?.() || dest;
    if (!dest?.endsWith?.("/")) { dest = dest?.trim?.()?.split?.("/")?.slice(0, -1)?.join?.("/")?.trim?.() || dest; };
    const p1 = !dest?.trim()?.endsWith("/") ? (dest+"/") : dest; return (!p1?.startsWith("/") ? ("/"+p1) : p1);
}

//
export const imageImportDesc = {
    startIn: "pictures", multiple: false,
    types: [{ description: "wallpaper", accept: { "image/*": [".png", ".gif", ".jpg", ".jpeg", ".webp", ".jxl",] }, }]
}

// "/" default is OPFS root (but may another root), "/user/" is OPFS root by default too, "/assets/" is unknown backend related assets
export const mappedRoots = new Map<string, () => Promise<any>>([
    ["/", async ()=> ((await navigator?.storage?.getDirectory?.())) ],
    ["/user/", async ()=> (await navigator?.storage?.getDirectory?.()) ],
    ["/assets/", async ()=>{console.warn("Backend related API not implemented!"); return null;}],
]);

//
export const currentHandleMap = new Map<string, any>()

//
export const mountAsRoot = async (forId: string, copyFromInternal?: boolean)=>{
    const cleanId = forId?.trim?.()?.replace?.(/^\//, "")?.trim?.()?.split?.("/")?.filter?.(p => !!p?.trim?.())?.at?.(0);

    // @ts-ignore
    const rootHandle = currentHandleMap?.get(cleanId) ?? (await showDirectoryPicker?.({
        mode: "readwrite",
        id: `${cleanId}`
    })?.catch?.(console.warn.bind(console)));

    //
    if (rootHandle && cleanId && typeof cleanId == "string") { currentHandleMap?.set?.(cleanId, rootHandle); };
    if (rootHandle && typeof localStorage != "undefined") {
        localStorage?.setItem?.("opfs.mounted", JSON.stringify([...JSON.parse(localStorage?.getItem?.("opfs.mounted") || "[]"), cleanId])); };

    //
    if (rootHandle) {
        // Sync to worker
        post('mount', { id: cleanId, handle: rootHandle });
    }

    //
    if (copyFromInternal && rootHandle && cleanId == "user") {
        const internalRoot = await navigator?.storage?.getDirectory?.();
        await copyFromOneHandlerToAnother(internalRoot, rootHandle, {})?.catch?.(console.warn.bind(console));
    };

    //
    return rootHandle;
}

//
export const unmountAsRoot = async (forId: string)=>{
    if (typeof localStorage != "undefined") {
        localStorage?.setItem?.("opfs.mounted", JSON.stringify(JSON.parse(localStorage?.getItem?.("opfs.mounted") || "[]").filter((id: string)=>id != forId)));
    }
    // Sync to worker
    post('unmount', { id: forId });
}

// Enhanced root resolution function
export async function resolveRootHandle(rootHandle: any, relPath: string = ""): Promise<any> {
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
        if (!rootHandle) { rootHandle = (await mappedRoots?.get?.(`/${cleanId}/`)?.()) ?? (await navigator.storage.getDirectory()); };
    }

    //
    if (rootHandle instanceof FileSystemDirectoryHandle) {
        return rootHandle;
    }

    // Normalize relPath for root matching
    const normalizedPath = relPath?.trim?.() || "/";
    const pathForMatch = normalizedPath.startsWith("/") ? normalizedPath : "/" + normalizedPath;

    // Find the best matching root from mappedRoots
    let bestMatch: (() => Promise<any>) | null = null;
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
    } catch (error) {
        console.warn("Failed to resolve root handle, falling back to OPFS root:", error);
        return await navigator?.storage?.getDirectory?.();
    }
}

// Enhanced path normalization with relative directory support
export function normalizePath(basePath: string = "", relPath: string): string {
    if (!relPath?.trim()) return basePath;

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
        } else if (part === "..") {
            // Parent directory - go up one level
            if (baseParts.length > 0) {
                baseParts.pop();
            }
        } else {
            // Regular directory/file name
            baseParts.push(part);
        }
    }

    return "/" + baseParts.join("/");
}

// Enhanced path resolution that combines root mapping and relative path handling
export async function resolvePath(rootHandle: any, relPath: string, basePath: string = ""): Promise<{rootHandle: any, resolvedPath: string}> {
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
export function defaultLogger(status, message) { console.trace(`[${status}] ${message}`); };
export function getFileExtension(path) { return path?.trim?.()?.split?.(".")?.[1]; }
export function detectTypeByRelPath(relPath) { if (relPath?.trim()?.endsWith?.('/')) return 'directory'; return 'file'; }
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
const hasFileExtension = (path: string) => {
    return path?.trim?.()?.split?.(".")?.[1]?.trim?.()?.length > 0;
}

//
export async function getDirectoryHandle(rootHandle, relPath, { create = false, basePath = "" } = {}, logger = defaultLogger) {
    try {
        const { rootHandle: resolvedRoot, resolvedPath } = await resolvePath(rootHandle, relPath, basePath);
        // Remove /user/ prefix
        const cleanPath = resolvedPath?.trim?.()?.startsWith?.("/user/") ?
            resolvedPath?.trim?.()?.replace?.(/^\/user/g, "")?.trim?.() : resolvedPath;

        const parts = cleanPath.split('/').filter((p)=>(!!p?.trim?.()));
        if (parts.length > 0 && hasFileExtension(parts[parts.length - 1]?.trim?.())) { parts?.pop?.(); };

        // Fallback to direct access if we need to return a Handle
        // But we want to use worker for operations.
        // Current API returns Handle.
        // If we want optimization, we should use worker.
        // But getDirectoryHandle returns a Handle.

        let dir = resolvedRoot;
        if (parts?.length > 0) {
            for (const part of parts) {
                dir = await dir?.getDirectoryHandle?.(part, { create });
                if (!dir) { break; };
            }
        }
        return dir;
    } catch (e: any) { return handleError(logger, 'error', `getDirectoryHandle: ${e.message}`); }
}

//
export async function getFileHandle(rootHandle, relPath, { create = false, basePath = "" } = {}, logger = defaultLogger) {
    try {
        const { rootHandle: resolvedRoot, resolvedPath } = await resolvePath(rootHandle, relPath, basePath);
        const cleanPath = resolvedPath?.trim?.()?.startsWith?.("/user/") ?
            resolvedPath?.trim?.()?.replace?.(/^\/user/g, "")?.trim?.() : resolvedPath;

        const parts = cleanPath.split('/').filter((d) => (!!d?.trim?.()));
        if (parts?.length == 0) return null;

        const filePath = parts.length > 0 ? parts[parts.length - 1]?.trim?.()?.replace?.(/\s+/g, '-') : '';
        const dirName  = parts.length > 1 ? parts?.slice(0, -1)?.join?.('/')?.trim?.()?.replace?.(/\s+/g, '-') : '';

        if (cleanPath?.trim?.()?.endsWith?.("/")) { return null; };

        // Delegate to getDirectoryHandle (which is currently main thread)
        const dir = await getDirectoryHandle(resolvedRoot, dirName, { create, basePath }, logger);
        return dir?.getFileHandle?.(filePath, { create });
    } catch (e: any) { return handleError(logger, 'error', `getFileHandle: ${e.message}`); }
}

//
export async function getHandler(rootHandle, relPath, options: {basePath?: string} = {}, logger = defaultLogger) {
    try {
        const { rootHandle: resolvedRootHandle, resolvedPath } = await resolvePath(rootHandle, relPath, options?.basePath || "");
        const type = detectTypeByRelPath(resolvedPath);
        if (type == 'directory') {
            const dir = await getDirectoryHandle(resolvedRootHandle, resolvedPath?.trim?.()?.replace?.(/\/$/, ''), options, logger);
            if (dir) return { type: 'directory', handle: dir };
        } else {
            const file = await getFileHandle(resolvedRootHandle, resolvedPath, options, logger);
            if (file) return { type: 'file', handle: file };
        }
        return null;
    } catch (e: any) { return handleError(logger, 'error', `getHandler: ${e.message}`); }
}

//
export async function createHandler(rootHandle, relPath, options: {basePath?: string} = {}, logger = defaultLogger) {
    try {
        const { rootHandle: resolvedRootHandle, resolvedPath } = await resolvePath(rootHandle, relPath, options?.basePath || "");
        const type = detectTypeByRelPath(resolvedPath);
        if (type == 'directory') {
            return await getDirectoryHandle(resolvedRootHandle, resolvedPath?.trim?.()?.replace?.(/\/$/, ''), options, logger);
        } else {
            return await getFileHandle(resolvedRootHandle, resolvedPath, options, logger);
        }
    } catch (e: any) { return handleError(logger, 'error', `createHandler: ${e.message}`); }
}

// Shared State Structure
interface DirectoryState {
    mapCache: Map<string, any>;
    dirHandle: Promise<any>;
    resolvePath: string;
    observationId: string;
    refCount: number;
    cleanup: () => void;
    updateCache: () => Promise<any>;
}

export const directoryCacheMap = new Map<string, DirectoryState>();


//
const mayNotPromise = (pms: any, cb: (pms: any) => any, errCb: (e: any) => any = console.warn.bind(console)) => {
    if (typeof pms?.then == "function") {
        return pms?.then?.(cb)?.catch?.(errCb);
    } else {
        try {
            return cb(pms);
        } catch (e: any) {
            errCb(e);
            return null;
        }
    }
}

//
export function openDirectory(rootHandle, relPath, options: {create: boolean, basePath?: string} = {create: false}, logger = defaultLogger) {
    //
    let cacheKey: string = "";
    let state: DirectoryState | undefined;

    //
    const pathPromise = (async () => {
        try {
            const { rootHandle: resolvedRootHandle, resolvedPath } = await resolvePath(rootHandle, relPath, options?.basePath || "");
            cacheKey = `${resolvedRootHandle?.name || 'root'}:${resolvedPath}`;
            return { rootHandle: resolvedRootHandle, resolvedPath };
        } catch (e: any) {
            return { rootHandle: null, resolvedPath: "" };
        }
    })();

    // Initialize or Retrieve State
    // We need to await pathPromise to get cacheKey, but openDirectory returns sync-like proxy.
    // So we use a lazy initialization inside the proxy, but checking cacheMap requires key.
    // This is tricky. We'll use a temporary holder that resolves to the shared state.

    // Actually, we can just start the async process and update the proxy's internal reference.

    //
    const statePromise = pathPromise.then(async ({ rootHandle, resolvedPath }) => {
        if (!resolvedPath) return null;

        let existing = directoryCacheMap.get(cacheKey);
        if (existing) {
            existing.refCount++;
            return existing;
        }

        const mapCache = makeReactive(new Map<string, any>()) as Map<string, any>;
        const observationId = UUIDv4();

        // Initial Dir Handle (for fallback)
        const dirHandlePromise = getDirectoryHandle(rootHandle, resolvedPath, options, logger);

        const updateCache = async () => {
            const cleanPath = resolvedPath?.trim?.()?.startsWith?.("/user/") ?
                resolvedPath?.trim?.()?.replace?.(/^\/user/g, "")?.trim?.() : resolvedPath;

            // Use Worker for listing
            const entries: any = await post('readDirectory', {
                rootId: "",
                path: cleanPath,
                create: options.create
            }, rootHandle ? [rootHandle] : []);

            if (!entries) return mapCache;

            const entryMap = new Map(entries);
            for (const key of mapCache.keys()) {
                if (!entryMap.has(key)) mapCache.delete(key);
            }
            for (const [key, handle] of entryMap) {
                if (!mapCache.has(key)) mapCache.set(key, handle);
            }

            return mapCache;
        };

        const cleanup = () => {
            post('unobserve', { id: observationId });
            observers.delete(observationId);
            directoryCacheMap.delete(cacheKey);
        };

        // Setup Observer
        observers.set(observationId, (changes: any[]) => {
            for (const change of changes) {
                if (change.type === "modified" || change.type === "created" || change.type === "appeared") {
                    mapCache.set(change.name, change.handle);
                } else if (change.type === "deleted" || change.type === "disappeared") {
                    mapCache.delete(change.name);
                }
            }
        });

        const cleanPath = resolvedPath?.trim?.()?.startsWith?.("/user/") ?
                resolvedPath?.trim?.()?.replace?.(/^\/user/g, "")?.trim?.() : resolvedPath;

        post('observe', {
            rootId: "",
            path: cleanPath,
            id: observationId
        }, rootHandle ? [rootHandle] : []);

        // Initial Load
        updateCache();

        const newState: DirectoryState = {
            mapCache,
            dirHandle: dirHandlePromise,
            resolvePath: resolvedPath,
            observationId,
            refCount: 1,
            cleanup,
            updateCache
        };

        directoryCacheMap.set(cacheKey, newState);
        return newState;
    });

    //
    let disposed = false;
    const dispose = () => {
        if (disposed) return;
        disposed = true;
        mayNotPromise(statePromise, (s) => {
            if (s) {
                s.refCount--;
                if (s.refCount <= 0) {
                    s.cleanup();
                }
            }
        });
    };

    const handler: ProxyHandler<any> = {
        get(target, prop, receiver) {
            const withState = Promised(statePromise);
            if (prop == 'dispose') return dispose;

            // Access shared state
            if (prop == 'getMap') return () => {
                return mayNotPromise(withState, (s) => s?.mapCache);
            };

            if (prop == 'refresh') return () => {
                 return mayNotPromise(withState, (s) => { s?.updateCache(); return pxy; });
            };

            // Helpers that use mapCache
            if (prop == 'entries') return () => mayNotPromise(withState, (s) => s?.mapCache.entries());
            if (prop == 'keys') return () => mayNotPromise(withState, (s) => s?.mapCache.keys());
            if (prop == 'values') return () => mayNotPromise(withState, (s) => s?.mapCache.values());

            if (["then", "catch", "finally"].includes(prop as string)) {
                return (typeof withState?.[prop as string] == "function" ? withState?.[prop as string]?.bind?.(withState) : withState?.[prop as string]);
            }

            // Fallback to dirHandle props or mapCache methods
            const complex = Promised(Promise.try?.(async ()=>{
                const s = await mayNotPromise(statePromise, (s) => s);
                if (!s) return null;
                // Try map first?
                if (s.mapCache[prop] != null) return s.mapCache[prop];
                // Try dirHandle
                const dh = await s.dirHandle;
                return dh?.[prop];
            }));

            return complex?.[prop];
        },
        async ownKeys(target) {
            const s = await mayNotPromise(statePromise, (s) => s);
            if (!s) return [];
            return Array.from(mayNotPromise(s.mapCache.keys(), (keys) => keys));
        }, getOwnPropertyDescriptor(target, prop) { return { enumerable: true, configurable: true }; }
    };

    //
    const fx: any = function(){}, pxy = new Proxy(fx, handler);
    return pxy;
}

//
export async function readFile(rootHandle, relPath, options: {basePath?: string} = {}, logger = defaultLogger) {
    try {
        const { rootHandle: resolvedRoot, resolvedPath } = await resolvePath(rootHandle, relPath, options?.basePath || "");
        const cleanPath = resolvedPath?.trim?.()?.startsWith?.("/user/") ?
            resolvedPath?.trim?.()?.replace?.(/^\/user/g, "")?.trim?.() : resolvedPath;

        // Use Worker
        const file = await post('readFile', { rootId: "", path: cleanPath, type: "blob" }, resolvedRoot ? [resolvedRoot] : []);
        return file;
    } catch (e: any) { return handleError(logger, 'error', `readFile: ${e.message}`); }
}

//
export async function readAsObjectURL(rootHandle, relPath, options: {basePath?: string} = {}, logger = defaultLogger) {
    try {
        const file: any = await readFile(rootHandle, relPath, options, logger);
        return file ? URL.createObjectURL(file) : null;
    } catch (e: any) { return handleError(logger, 'error', `readAsObjectURL: ${e.message}`); }
}

//
export async function readFileUTF8(rootHandle, relPath, options: {basePath?: string} = {}, logger = defaultLogger) {
    try {
        const file: any = await readFile(rootHandle, relPath, options, logger);
        if (!file) return "";
        return await file.text();
    } catch (e: any) { return handleError(logger, 'error', `readFileUTF8: ${e.message}`); }
}



//
export async function writeFile(rootHandle, relPath, data, logger = defaultLogger) {
    if (data instanceof FileSystemFileHandle) { data = await data.getFile(); }
    if (data instanceof FileSystemDirectoryHandle) {
        const dstHandle = await getDirectoryHandle(await resolveRootHandle(rootHandle), relPath + (relPath?.trim?.()?.endsWith?.("/") ? "" : "/") + (data?.name || "")?.trim?.()?.replace?.(/\s+/g, '-'), { create: true });
        return await copyFromOneHandlerToAnother(data, dstHandle, {})?.catch?.(console.warn.bind(console));
    } else

    //
    try {
        const { rootHandle: resolvedRoot, resolvedPath } = await resolvePath(rootHandle, relPath, "");
        const cleanPath = resolvedPath?.trim?.()?.startsWith?.("/user/") ?
            resolvedPath?.trim?.()?.replace?.(/^\/user/g, "")?.trim?.() : resolvedPath;

        await post('writeFile', { rootId: "", path: cleanPath, data }, resolvedRoot ? [resolvedRoot] : []);
        return true;
    } catch (e: any) { return handleError(logger, 'error', `writeFile: ${e.message}`); }
}

//
export async function getFileWriter(rootHandle, relPath, options: {create?: boolean, basePath?: string} = { create: true }, logger = defaultLogger) {
    try {
        const { rootHandle: resolvedRootHandle, resolvedPath } = await resolvePath(rootHandle, relPath, options?.basePath || "");
        return (await getFileHandle(resolvedRootHandle, resolvedPath, options, logger))?.createWritable?.();
    } catch (e: any) { return handleError(logger, 'error', `getFileWriter: ${e.message}`); }
}





//
export async function removeFile(rootHandle, relPath, options: {recursive?: boolean, basePath?: string} = { recursive: true }, logger = defaultLogger) {
    try {
        const { rootHandle: resolvedRoot, resolvedPath } = await resolvePath(rootHandle, relPath, options?.basePath || "");
        const cleanPath = resolvedPath?.trim?.()?.startsWith?.("/user/") ?
            resolvedPath?.trim?.()?.replace?.(/^\/user/g, "")?.trim?.() : resolvedPath;

        await post('remove', { rootId: "", path: cleanPath, recursive: options.recursive }, resolvedRoot ? [resolvedRoot] : []);
        return true;
    } catch (e: any) { return handleError(logger, 'error', `removeFile: ${e.message}`); }
}

//
export async function removeDirectory(rootHandle, relPath, options: {recursive?: boolean, basePath?: string} = { recursive: true }, logger = defaultLogger) {
    try {
        // Reuse logic from removeFile as worker distinguishes via path handling or just removeEntry
        return removeFile(rootHandle, relPath, options, logger);
    } catch (e: any) { return handleError(logger, 'error', `removeDirectory: ${e.message}`); }
}

//
export async function remove(rootHandle, relPath, options: {basePath?: string} = {}, logger = defaultLogger) {
    try {
        return removeFile(rootHandle, relPath, { recursive: true, ...options }, logger);
    } catch (e: any) { return handleError(logger, 'error', `remove: ${e.message}`); }
}

//
export const openImageFilePicker = async ()=>{
    const $e = "showOpenFilePicker"; // @ts-ignore
    const showOpenFilePicker = window?.[$e]?.bind?.(window) ?? (await import("fest/polyfill/showOpenFilePicker.mjs"))?.[$e];
    return showOpenFilePicker(imageImportDesc);
}

//
export const downloadFile = async (file) => {
    // as file
    if (file instanceof FileSystemFileHandle) { file = await file.getFile(); }
    if (typeof file == "string") { file = await provide(file); }; const filename = file.name; if (!filename) return; // @ts-ignore // IE10+
    if ("msSaveOrOpenBlob" in self.navigator) { self.navigator.msSaveOrOpenBlob(file, filename); };

    // for directory
    if (file instanceof FileSystemDirectoryHandle) {
        // @ts-ignore
        let dstHandle = await showDirectoryPicker?.({
            mode: "readwrite"
        })?.catch?.(console.warn.bind(console));

        //
        if (file && dstHandle) {
            // open handle relative to selected directory
            dstHandle = (await getDirectoryHandle(dstHandle, file.name || "", { create: true })?.catch?.(console.warn.bind(console))) || dstHandle;
            return await copyFromOneHandlerToAnother(file, dstHandle, {})?.catch?.(console.warn.bind(console));
        }

        // currently, different methods are unsupported... (not implemented)
        return;
    }

    // @ts-ignore
    const fx = await (self?.showOpenFilePicker ? new Promise((r) => r({ // @ts-ignore
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
    } else {
        const a = document.createElement("a");
        try { a.href = URL.createObjectURL(file); } catch(e) { console.warn(e); };
        a.download = filename; document.body.appendChild(a); a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(a.href);
        }, 0);
    }
}

//
export const provide = async (req: string | Request = "", rw = false) => {
    const url: string = (req as Request)?.url ?? req;
    const cleanUrl = url?.replace?.(location.origin, "")?.trim?.();

    //
    if (cleanUrl?.startsWith?.("/user")) {
        const path = cleanUrl?.replace?.(/^\/user/g, "")?.trim?.();
        const handle = getFileHandle(await navigator?.storage?.getDirectory?.(), path, { create: !!rw });
        if (rw) { return mayNotPromise(handle, (h)=>h?.createWritable?.()); }
        return mayNotPromise(handle, (h)=>h?.getFile?.());
    } else {
        try {
            if (!req) return null;
            return mayNotPromise(fetch(req), async (r) => {
                const blob = await mayNotPromise(r?.blob(), (b) => b?.catch?.(console.warn.bind(console)));
                const lastModified = Date.parse(mayNotPromise(r?.headers?.get?.("Last-Modified"), (h) => h || "") || 0);
                if (blob) {
                    return new File([blob], url?.substring(url?.lastIndexOf('/') + 1), {
                        type: blob?.type,
                        lastModified
                    })
                }
            });
        } catch (e: any) { return handleError(logger, 'error', `provide: ${e.message}`); }
    }
}

//
export const getLeast = (item)=>{
    if (item?.types?.length > 0) {
        return item?.getType?.(Array.from(item?.types || [])?.at?.(-1));
    }
    return null;
}

//
export const dropFile = async (file, dest = "/user/"?.trim?.()?.replace?.(/\s+/g, '-'), current?: any)=>{
    const fs = await resolveRootHandle(null);
    const path = getDir(dest?.trim?.()?.startsWith?.("/user/") ? dest?.replace?.(/^\/user/g, "")?.trim?.() : dest);

    //
    if (!path?.trim?.()?.startsWith?.("/user")) return;
    const user = path?.replace?.("/user","")?.trim?.();

    //
    file = file instanceof File ? file : (new File([file], UUIDv4() + "." + (file?.type?.split?.("/")?.[1] || "tmp")))

    //
    const fp = user + (file?.name || "wallpaper")?.trim?.()?.replace?.(/\s+/g, '-');
    await writeFile(fs, fp, file);

    // TODO! needs to fix same directory scope
    current?.set?.("/user" + fp?.trim?.()?.replace?.(/\s+/g, '-'), file);
    return "/user" + fp?.trim?.();
}

//
export const uploadDirectory = async (dest = "/user/", id: any = null)=>{
    dest = dest?.trim?.()?.startsWith?.("/user/") ? dest?.trim?.()?.replace?.(/^\/user/g, "")?.trim?.() : dest;
    if (!globalThis.showDirectoryPicker) {
        return;
    }

    // @ts-ignore
    const srcHandle = await showDirectoryPicker?.({
        mode: "readonly", id
    })?.catch?.(console.warn.bind(console));
    if (!srcHandle) return;

    //
    const dstHandle = await getDirectoryHandle(await resolveRootHandle(null), dest + (dest?.trim?.()?.endsWith?.("/") ? "" : "/") + srcHandle.name?.trim?.()?.replace?.(/\s+/g, '-'), { create: true });
    if (!dstHandle) return;
    return await copyFromOneHandlerToAnother(srcHandle, dstHandle, {})?.catch?.(console.warn.bind(console));
}

//
export const uploadFile = async (dest = "/user/"?.trim?.()?.replace?.(/\s+/g, '-'), current?: any)=>{
    const $e = "showOpenFilePicker"; dest = dest?.trim?.()?.startsWith?.("/user/") ? dest?.trim?.()?.replace?.(/^\/user/g, "")?.trim?.() : dest;

    // @ts-ignore
    const showOpenFilePicker = window?.[$e]?.bind?.(window) ?? (await import("fest/polyfill/showOpenFilePicker.mjs"))?.[$e];
    return showOpenFilePicker(imageImportDesc)?.then?.(async ([handle] = [])=>{
        const file = await handle?.getFile?.();
        return dropFile(file, dest, current);
    });
}

//
export const ghostImage = typeof Image != "undefined" ? new Image() : null;
if (ghostImage) {
    ghostImage.decoding = "async";
    ghostImage.width = 24;
    ghostImage.height = 24;


    //
    try {
        ghostImage.src = URL.createObjectURL(new Blob([`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 384 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 288c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128z"/></svg>`], { type: "image/svg+xml" }));
    } catch (e) { }
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
        } else {
            transfer?.add?.(file);
        }
        if (path) { transfer?.items?.add?.(path, "text/plain"); };
        transfer?.setData?.("text/uri-list", url);
        transfer?.setData?.("DownloadURL", file?.type + ":" + file?.name + ":" + url);
    } catch(e) {}
}

//
export const dropAsTempFile = async (data: any)=>{
    const items   = (data)?.items;
    const item    = items?.[0];
    const isImage = item?.types?.find?.((n)=>n?.startsWith?.("image/"));
    const blob    = await (data?.files?.[0] ?? ((isImage ? item?.getType?.(isImage) : null) || getLeast(item)));
    return dropFile(blob, "/user/temp/"?.trim?.()?.replace?.(/\s+/g, '-'));
}

//
export const clearAllInDirectory = async (rootHandle: any = null, relPath = "", options: {basePath?: string} = {}, logger = defaultLogger) => {
    try {
        const { rootHandle: resolvedRoot, resolvedPath } = await resolvePath(rootHandle, relPath, options?.basePath || "");
        const cleanPath = resolvedPath?.trim?.()?.startsWith?.("/user/") ?
            resolvedPath?.trim?.()?.replace?.(/^\/user/g, "")?.trim?.() : resolvedPath;

        await post('remove', { rootId: "", path: cleanPath, recursive: true }, resolvedRoot ? [resolvedRoot] : []);
    } catch (e: any) { return handleError(logger, 'error', `clearAllInDirectory: ${e.message}`); }
}

// used for import/export by file pickers (OPFS, FileSystem, etc. )
export const copyFromOneHandlerToAnother = async (fromHandle: FileSystemDirectoryHandle | FileSystemFileHandle, toHandle: FileSystemDirectoryHandle | FileSystemFileHandle, options = {}, logger = defaultLogger) => {
    // We delegate to worker
    return post('copy', { from: fromHandle, to: toHandle }, [fromHandle, toHandle]);
}
