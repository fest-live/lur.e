import { UUIDv4, Promised } from 'fest/core';
import { makeReactive } from 'fest/object';

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
    ["/", async ()=>await navigator?.storage?.getDirectory?.()],
    ["/user/", async ()=>await navigator?.storage?.getDirectory?.()],
    ["/assets/", async ()=>{console.warn("Backend related API not implemented!"); return null;}],
]);

// Enhanced root resolution function
export async function resolveRootHandle(rootHandle: any, relPath: string): Promise<any> {
    if (typeof rootHandle == "string") {
        rootHandle = await getDirectoryHandle(null, rootHandle)?.catch?.(console.warn.bind(console));
    }

    //
    if (typeof rootHandle == "string") {
        rootHandle = await mappedRoots?.get?.(`/${rootHandle?.trim?.()?.split?.("/")?.filter?.(p => !!p?.trim?.())?.at?.(0)}/` || rootHandle?.trim?.())?.();
    }

    // If rootHandle is provided and valid, use it
    if (rootHandle) {
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
        // Use enhanced path resolution
        const { rootHandle: resolvedRootHandle, resolvedPath } = await resolvePath(rootHandle, relPath, basePath);

        // Remove /user/ prefix if present for actual directory traversal
        const cleanPath = resolvedPath?.trim?.()?.startsWith?.("/user/") ?
            resolvedPath?.trim?.()?.replace?.(/^\/user/g, "")?.trim?.() : resolvedPath;

        const parts = cleanPath.split('/').filter((p)=>(!!p?.trim?.()));
        if (parts.length > 0 && hasFileExtension(parts[parts.length - 1]?.trim?.())) { parts?.pop?.(); };

        //
        let dir = resolvedRootHandle;
        if (parts?.length > 0) {
            for (const part of parts) {
                dir = await dir?.getDirectoryHandle?.(part, { create });
                if (!dir) { break; };
            }
        }
        return dir;

        //
    } catch (e: any) { return handleError(logger, 'error', `getDirectoryHandle: ${e.message}`); }
}

//
export async function getFileHandle(rootHandle, relPath, { create = false, basePath = "" } = {}, logger = defaultLogger) {
    try {
        // Use enhanced path resolution
        const { rootHandle: resolvedRootHandle, resolvedPath } = await resolvePath(rootHandle, relPath, basePath);

        // Remove /user/ prefix if present for actual file traversal
        const cleanPath = resolvedPath?.trim?.()?.startsWith?.("/user/") ?
            resolvedPath?.trim?.()?.replace?.(/^\/user/g, "")?.trim?.() : resolvedPath;

        const parts = cleanPath.split('/').filter((d) => (!!d?.trim?.()));
        if (parts?.length == 0) return null;

        //
        const filePath = parts.length > 0 ? parts[parts.length - 1]?.trim?.()?.replace?.(/\s+/g, '-') : '';
        const dirName  = parts.length > 1 ? parts?.slice(0, -1)?.join?.('/')?.trim?.()?.replace?.(/\s+/g, '-') : '';

        //
        if (cleanPath?.trim?.()?.endsWith?.("/")) { return null; };
        const dir = await getDirectoryHandle(resolvedRootHandle, dirName, { create, basePath }, logger);
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



//
export function openDirectory(rootHandle, relPath, options: {create: boolean, basePath?: string} = {create: false}, logger = defaultLogger) {
    //
    let mapCache: Map<string, any> = makeReactive(new Map<string, any>()) as Map<string, any>;
    async function updateCache() { // @ts-ignore
        if (!(await dirHandle)) return mapCache;

        //
        const entries = await Promise.all(await Array.fromAsync((await dirHandle)?.entries?.() || []) || []); // @ts-ignore
        if (mapCache?.size == 0) { entries.forEach((nh: [string, any]) => { mapCache?.set?.(nh?.[0], nh?.[1]); }); }

        // @ts-ignore
        const newKeys = Array.from(entries?.map?.((pair: [string, any])=>pair?.[0])).filter((key: string) => !mapCache?.has?.(key)); // @ts-ignore
        newKeys.forEach((nk: string) => {
            if (nk) mapCache?.set?.(nk, entries?.find?.(e => e?.[0] == nk)?.[1]);
        });

        // @ts-ignore
        const removedKeys = Array.from(mapCache?.entries?.())?.map?.((pair: [string, any]) => pair?.[0]).filter((key: string) => !entries?.find?.(e => e?.[0] == key)); // @ts-ignore
        removedKeys.forEach((nk: string) => {
            if (nk) mapCache?.delete?.(nk);
        });

        //
        return {
            getHandler: (name) => mapCache?.get?.(name),
            getMap: () => mapCache,
            refresh: () => pxy,
            dirHandle: () => pxy,
        };
    }

    //
    function observeHandle(records) {
        for (const record of records) {
            const handle = record.changedHandle;
            if (record.type == "moved") {
                mapCache?.set?.(handle?.name || record.relativePathComponents?.at?.(-1), handle);
            } else

            // I don't know how, but needs to check if files newly created, before was written...
            if (record.type == "created" || record.type == "appeared") {
                handle?.getFile?.()?.then?.((f)=>{
                    if (f?.size != 0) { mapCache?.set?.(handle?.name || record.relativePathComponents?.at?.(-1), handle); }
                })?.catch?.(console.warn.bind(console));
            } else
            if (record.type == "modified") {
                mapCache?.set?.(handle?.name || record.relativePathComponents?.at?.(-1), handle);
            } else
            if (record.type == "deleted" || record.type == "disappeared") {
                mapCache?.delete?.(handle?.name || record.relativePathComponents?.at?.(-1));
            }
        }
    }

    // @ts-ignore
    const obs = typeof FileSystemObserver != "undefined" ? new FileSystemObserver(observeHandle) : null;
    const handler: ProxyHandler<any> = {
        get(target, prop, receiver) { // @ts-ignore
            const withUpdate = Promised(dirHandle?.then?.(() => updateCache())); // @ts-ignore
            if (prop == 'getHandler') { return (name)=>withUpdate?.then?.(() => (name ? (mapCache as any)?.get?.(name) : dirHandle)); }
            if (prop == 'getMap') { return () => { withUpdate?.then?.(() => dirHandle); return mapCache; }; }
            if (prop == 'refresh') { return () => withUpdate?.then?.(() => pxy); }
            if (prop == 'dirHandle') { return () => withUpdate?.then?.(() => pxy); } //@ts-ignore

            //
            if (["then", "catch", "finally"].includes(prop as string)) {
                return (typeof withUpdate?.[prop] == "function" ? withUpdate?.[prop]?.bind?.(withUpdate) : withUpdate?.[prop]);
            }

            // @ts-ignore
            const complex = Promised(Promise.try?.(async ()=>{
                const handle = await Promise.all([dirHandle, updateCache()]);
                return (handle?.[1]?.[prop] != null ? handle?.[1] : handle?.[0]);
            }));

            //
            return complex?.[prop];
        },

        // @ts-ignore
        async ownKeys(target) { if (!mapCache) await updateCache(); return Array.from(mapCache.keys()); }, // @ts-ignore
        getOwnPropertyDescriptor(target, prop) { return { enumerable: true, configurable: true }; } // @ts-ignore
    };

    //
    let dirHandle: any = (async () => {
        try {
            const { rootHandle: resolvedRootHandle, resolvedPath } = await resolvePath(rootHandle, relPath, options?.basePath || "");
            return await getDirectoryHandle(resolvedRootHandle, resolvedPath, options, logger);
        } catch (e: any) {
            return handleError(logger, 'error', `openDirectory: ${e.message}`);
        }
    })();

    dirHandle = dirHandle?.then?.(async (handle)=>{
        if (handle = (await handle)) { obs?.observe?.(handle); };
        return handle;
    })?.catch?.((e)=> handleError(logger, 'error', `openDirectory: ${e.message}`));

    //
    updateCache();

    //
    const fx: any = function(){}, pxy = new Proxy(fx, handler); return pxy;
}



//
export async function readFile(rootHandle, relPath, options: {basePath?: string} = {}, logger = defaultLogger) {
    try {
        const { rootHandle: resolvedRootHandle, resolvedPath } = await resolvePath(rootHandle, relPath, options?.basePath || "");
        return (await getFileHandle(resolvedRootHandle, resolvedPath, options, logger))?.getFile?.();
    } catch (e: any) { return handleError(logger, 'error', `readFile: ${e.message}`); }
}

//
export async function readAsObjectURL(rootHandle, relPath, options: {basePath?: string} = {}, logger = defaultLogger) {
    try {
        const { rootHandle: resolvedRootHandle, resolvedPath } = await resolvePath(rootHandle, relPath, options?.basePath || "");
        const fileHandle = await getFileHandle(resolvedRootHandle, resolvedPath, options, logger);
        const file = await fileHandle?.getFile?.();
        return file ? URL.createObjectURL(file) : null;
    } catch (e: any) { return handleError(logger, 'error', `readAsObjectURL: ${e.message}`); }
}

//
export async function readFileUTF8(rootHandle, relPath, options: {basePath?: string} = {}, logger = defaultLogger) {
    try {
        const { rootHandle: resolvedRootHandle, resolvedPath } = await resolvePath(rootHandle, relPath, options?.basePath || "");
        const fileHandle = await getFileHandle(resolvedRootHandle, resolvedPath, options, logger);
        const file = await fileHandle?.getFile?.(), u8b = await file?.arrayBuffer?.();
        return u8b ? new TextEncoder()?.encode?.(u8b) : "";
    } catch (e: any) { return handleError(logger, 'error', `readFileUTF8: ${e.message}`); }
}



//
export async function writeFile(rootHandle, relPath, data, logger = defaultLogger) {
    if (data instanceof FileSystemFileHandle) { data = await data.getFile(); }
    if (data instanceof FileSystemDirectoryHandle) {
        const dstHandle = await getDirectoryHandle(await navigator?.storage?.getDirectory?.(), relPath + (relPath?.trim?.()?.endsWith?.("/") ? "" : "/") + (data?.name || "")?.trim?.()?.replace?.(/\s+/g, '-'), { create: true });
        return await copyFromOneHandlerToAnother(data, dstHandle, {})?.catch?.(console.warn.bind(console));
    } else

    //
    try {
        const { rootHandle: resolvedRootHandle, resolvedPath } = await resolvePath(rootHandle, relPath, "");
        const fileHandle = await getFileHandle(resolvedRootHandle, resolvedPath, { create: true }, logger);
        const writable = await fileHandle?.createWritable?.();
        await writable?.write?.(data); await writable?.close?.();
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
        const { rootHandle: resolvedRootHandle, resolvedPath } = await resolvePath(rootHandle, relPath, options?.basePath || "");

        // Remove /user/ prefix if present for actual file removal
        const cleanPath = resolvedPath?.trim?.()?.startsWith?.("/user/") ?
            resolvedPath?.trim?.()?.replace?.(/^\/user/g, "")?.trim?.() : resolvedPath;

        const parts = cleanPath?.split?.('/')?.filter?.((d)=>!!d?.trim?.());
        const fileName = parts.length > 0 ? parts.pop() : '';

        const dir = await getDirectoryHandle(resolvedRootHandle, parts?.join?.('/')?.trim?.()?.replace?.(/\/$/, ''), options, logger);
        const entry = await dir?.getFileHandle?.(fileName, { create: false });
        return entry ? dir?.removeEntry?.(fileName, { recursive: options?.recursive })?.catch?.(console.warn.bind(console)) : null;
    } catch (e: any) { return handleError(logger, 'error', `removeFile: ${e.message}`); }
}

//
export async function removeDirectory(rootHandle, relPath, options: {recursive?: boolean, basePath?: string} = { recursive: true }, logger = defaultLogger) {
    try {
        const { rootHandle: resolvedRootHandle, resolvedPath } = await resolvePath(rootHandle, relPath, options?.basePath || "");

        // Remove /user/ prefix if present for actual directory removal
        const cleanPath = resolvedPath?.trim?.()?.startsWith?.("/user/") ?
            resolvedPath?.trim?.()?.replace?.(/^\/user/g, "")?.trim?.() : resolvedPath;

        const parts = cleanPath.split('/').filter((p) => (!!p?.trim?.()));
        if (parts.length > 0 && hasFileExtension(parts[parts.length - 1]?.trim?.())) { return; };

        const entryName = parts.length > 0 ? parts.pop() : '';
        let dir = resolvedRootHandle;
        if (parts?.length > 0) {
            for (const part of parts) {
                dir = await dir?.getDirectoryHandle?.(part);
                if (!dir) { break; };
            }
        }

        const entry = await dir?.getDirectoryHandle?.(entryName, { create: false });
        return (entry ? dir?.removeEntry?.(entryName, { recursive: options?.recursive ?? true })?.catch?.(console.warn.bind(console)) : null);
    } catch (e: any) { return handleError(logger, 'error', `removeDirectory: ${e.message}`); }
}

//
export async function remove(rootHandle, relPath, options: {basePath?: string} = {}, logger = defaultLogger) {
    try {
        const { rootHandle: resolvedRootHandle, resolvedPath } = await resolvePath(rootHandle, relPath, options?.basePath || "");
        return Promise.any([
            removeFile(resolvedRootHandle, resolvedPath, options, logger)?.catch?.(console.warn.bind(console)),
            removeDirectory(resolvedRootHandle, resolvedPath, options, logger)?.catch?.(console.warn.bind(console))
        ]);
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
    const path = getDir(url?.replace?.(location.origin, "")?.trim?.()?.startsWith?.("/user/") ? url?.replace?.(/^\/user/g, "")?.trim?.() : url);
    const fn   = url?.split("/")?.at?.(-1);

    //
    if (!URL.canParse(url) && path?.trim?.()?.startsWith?.("/user")) {
        const $path = path?.replace?.("/user/", "")?.trim?.();
        const clean = (($path?.split?.("/") || [$path])?.filter?.((p)=>!!p?.trim?.()) || [""])?.join?.("/") || "";
        const npt = ((clean && clean != "/") ? "/" + clean + "/" : clean) || "/";
        const handle = getFileHandle(await navigator?.storage?.getDirectory?.(), npt + fn, { create: true });
        if (rw) { handle?.then?.((h)=>h?.createWritable?.()); }
        return handle?.then?.((h)=>h?.getFile?.());
    } else {
        try {
            if (!req) return null;
            return fetch(req)?.then?.(async (r) => {
                const blob = await r?.blob()?.catch?.(console.warn.bind(console));
                const lastModified = Date.parse(r?.headers?.get?.("Last-Modified") || "") || 0;
                if (blob) {
                    return new File([blob], url?.substring(url?.lastIndexOf('/') + 1), {
                        type: blob?.type,
                        lastModified
                    })
                }
            })?.catch?.(console.warn.bind(console));
        } catch (e: any) { console.warn(e); }
    }
    return null;
}

//
export const getLeast = (item)=>{
    if (item?.types?.length > 0) {
        return item?.getType?.(Array.from(item?.types || [])?.at?.(-1));
    }
    return null;
}

/*  // drop handling example
    const current = this.getCurrent();
    const items   = (data)?.items;
    const item    = items?.[0];

    //
    const isImage = item?.types?.find?.((n)=>n?.startsWith?.("image/"));
    const blob    = data?.files?.[0] ?? ((isImage ? item?.getType?.(isImage) : null) || getLeast(item));
    if (blob) {
        Promise.try(async()=>{
            const raw = await blob;
            if (raw) dropFile(raw, this.currentDir(), current);
        });
        return true;
    }
*/

//
export const dropFile = async (file, dest = "/user/"?.trim?.()?.replace?.(/\s+/g, '-'), current?: any)=>{
    const fs = await navigator?.storage?.getDirectory?.();
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
    const dstHandle = await getDirectoryHandle(await navigator?.storage?.getDirectory?.(), dest + (dest?.trim?.()?.endsWith?.("/") ? "" : "/") + srcHandle.name?.trim?.()?.replace?.(/\s+/g, '-'), { create: true });
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
        const { rootHandle: resolvedRootHandle, resolvedPath } = await resolvePath(rootHandle, relPath, options?.basePath || "");
        const normalizedPath = getDir(resolvedPath?.trim?.()?.startsWith?.("/user/") ? resolvedPath?.replace?.(/^\/user/g, "")?.trim?.() : resolvedPath);
        const dir = await getDirectoryHandle(resolvedRootHandle, normalizedPath, options, logger);
        if (dir) {
            const entries = await Array.fromAsync(dir?.entries?.() ?? []);
            return Promise.all(entries.map((entry) => dir?.removeEntry?.(entry?.[0], { recursive: true })));
        }
    } catch (e: any) { return handleError(logger, 'error', `clearAllInDirectory: ${e.message}`); }
}

// used for import/export by file pickers (OPFS, FileSystem, etc. )
export const copyFromOneHandlerToAnother = async (fromHandle: FileSystemDirectoryHandle | FileSystemFileHandle, toHandle: FileSystemDirectoryHandle | FileSystemFileHandle, options = {}, logger = defaultLogger) => {
    // directory to directory
    if (fromHandle instanceof FileSystemDirectoryHandle) {
        if (toHandle instanceof FileSystemDirectoryHandle) {  // @ts-ignore
            const entries = await Array.fromAsync(fromHandle?.entries?.() ?? []);

            //
            return Promise.all(entries.map(async (entry) => {
                if (entry?.[1] instanceof FileSystemDirectoryHandle) {
                    const toDirHandle = await toHandle?.getDirectoryHandle?.(entry?.[0], { create: true });
                    return copyFromOneHandlerToAnother(entry?.[1], toDirHandle, options, logger);
                } else {
                    const toFileHandle = await toHandle?.getFileHandle?.(entry?.[0], { create: true });
                    const writable = await toFileHandle?.createWritable?.();
                    const file = await entry?.[1]?.getFile?.();
                    await writable?.write?.(file);
                    await writable?.close?.();
                    return true;
                }
            }));
        } else {
            // not supported (may seems to be ZIP or TAR archive)
            return false;
        }
    } else // file to file/directory
        if (fromHandle instanceof FileSystemFileHandle) {
            if (toHandle instanceof FileSystemFileHandle) {
                const file = await fromHandle?.getFile?.();
                const toFileHandle = toHandle;
                const writable = await toFileHandle?.createWritable?.();
                await writable?.write?.(file);
                await writable?.close?.();
                return true;
            } else //
                if (toHandle instanceof FileSystemDirectoryHandle) {
                    const file = await fromHandle?.getFile?.();
                    const toFileHandle = await toHandle?.getFileHandle?.(file?.name, { create: true });
                    const writable = await toFileHandle?.createWritable?.();
                    await writable?.write?.(file);
                    await writable?.close?.();
                    return true;
                }
        }
    return null;
}
