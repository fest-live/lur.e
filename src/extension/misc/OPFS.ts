import { UUIDv4 } from 'fest/dom';
import { makeReactive, Promised } from 'fest/object';

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

//
export function handleError(logger, status, message) { logger?.(status, message); return null; }
export function defaultLogger(status, message) { console.log(`[${status}] ${message}`); };
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
        // ...добавьте по необходимости
    };
    return mimeTypes[ext] || 'application/octet-stream';
}

//
const hasFileExtension = (path: string) => {
    return path?.trim?.()?.split?.(".")?.[1]?.trim?.()?.length > 0;
}

//
export async function getDirectoryHandle(rootHandle, relPath, { create = false } = {}, logger = defaultLogger) {
    rootHandle ??= await navigator?.storage?.getDirectory?.();
    relPath = relPath?.trim?.()?.startsWith?.("/user/") ? relPath?.trim?.()?.replace?.(/^\/user/g, "")?.trim?.() : relPath;
    try {
        const parts = relPath.split('/').filter((p)=>(!!p?.trim?.()));
        if (hasFileExtension(parts?.at?.(-1)?.trim?.())) { parts?.pop?.(); };

        //
        let dir = rootHandle;
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
export async function getFileHandle(rootHandle, relPath, { create = false } = {}, logger = defaultLogger) {
    rootHandle ??= await navigator?.storage?.getDirectory?.();
    relPath = relPath?.trim?.()?.startsWith?.("/user/") ? relPath?.trim?.()?.replace?.(/^\/user/g, "")?.trim?.() : relPath;
    try {
        const parts = relPath.split('/').filter((d) => (!!d?.trim?.()));
        if (parts?.length == 0) return null;

        //
        const filePath = parts?.at(-1)?.trim?.()?.replace?.(/\s+/g, '-');
        const dirName  = parts?.slice(0, -1)?.join?.('/')?.trim?.()?.replace?.(/\s+/g, '-');

        //
        if (relPath?.trim?.()?.endsWith?.("/")) { return null; };
        const dir = await getDirectoryHandle(rootHandle, dirName, { create }, logger);
        return dir?.getFileHandle?.(filePath, { create });
    } catch (e: any) { return handleError(logger, 'error', `getFileHandle: ${e.message}`); }
}

//
export async function getHandler(rootHandle, relPath, options = {}, logger = defaultLogger) {
    rootHandle ??= await navigator?.storage?.getDirectory?.();
    relPath = relPath?.trim?.()?.startsWith?.("/user/") ? relPath?.trim?.()?.replace?.(/^\/user/g, "")?.trim?.() : relPath;
    const type = detectTypeByRelPath(relPath);
    if (type == 'directory') { const dir = getDirectoryHandle(rootHandle, relPath?.trim?.()?.replace?.(/\/$/, ''), options, logger); if (dir) return { type: 'directory', handle: dir }; } else { const file = await getFileHandle(rootHandle, relPath, options, logger); if (file) return { type: 'file', handle: file }; }
    return null;
}

//
export async function createHandler(rootHandle, relPath, options = {}, logger = defaultLogger) {
    rootHandle ??= await navigator?.storage?.getDirectory?.();
    relPath = relPath?.trim?.()?.startsWith?.("/user/") ? relPath?.trim?.()?.replace?.(/^\/user/g, "")?.trim?.() : relPath;
    const type = detectTypeByRelPath(relPath);
    if (type == 'directory') { return getDirectoryHandle(rootHandle, relPath?.trim?.()?.replace?.(/\/$/, ''), options, logger); } else { return getFileHandle(rootHandle, relPath, options, logger); }
}



//
export function openDirectory(rootHandle, relPath, options: {create: boolean} = {create: false}, logger = defaultLogger) {
    relPath = relPath?.trim?.()?.startsWith?.("/user/") ? relPath?.trim?.()?.replace?.(/^\/user/g, "")?.trim?.() : relPath;

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
        return mapCache;
    }

    //
    function observeHandle(records) {
        for (const record of records) {
            const handle = record.changedHandle;
            if (record.type == "appeared") {
                mapCache?.set?.(handle?.name, handle);
            } else
            if (record.type == "modified") {
                mapCache?.set?.(handle?.name, handle);
            } else
            if (record.type == "disappeared") {
                mapCache?.delete?.(handle?.name);
            }
        }
    }

    // @ts-ignore
    const obs = typeof FileSystemObserver != "undefined" ? new FileSystemObserver(observeHandle) : null;
    const handler: ProxyHandler<any> = {
        get(target, prop, receiver) { // @ts-ignore
            const withUpdate = Promised(dirHandle?.then?.(()=>updateCache())); // @ts-ignore
            if (prop == 'getHandler') { return (name)=>withUpdate?.then?.(() => (name ? (mapCache as any)?.get?.(name) : dirHandle)); }
            if (prop == 'getMap')     { return ()=>withUpdate?.then?.(() => dirHandle); }
            if (prop == 'refresh')    { return ()=>withUpdate?.then?.(() => pxy); }
            if (prop == 'dirHandle')  { return ()=>withUpdate?.then?.(() => pxy); } //@ts-ignore

            //
            if (["then", "catch", "finally"].includes(prop as string)) { return (typeof withUpdate?.[prop] == "function" ? withUpdate?.[prop]?.bind?.(withUpdate) : withUpdate?.[prop]); }

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
    let dirHandle: any = getDirectoryHandle(rootHandle, relPath, options, logger);
    dirHandle = dirHandle?.then?.(async (handle)=>{
        if (handle = (await handle)) { obs?.observe?.(handle); };
        return handle;
    })?.catch?.((e)=> handleError(logger, 'error', `openDirectory: ${e.message}`));
    updateCache(); const fx: any = function(){}, pxy = new Proxy(fx, handler); return pxy;
}



//
export async function readFile(rootHandle, relPath, options = {}, logger = defaultLogger) {
    rootHandle ??= await navigator?.storage?.getDirectory?.();
    try { return (await getFileHandle(rootHandle, relPath, options, logger))?.getFile?.(); } catch (e: any)
        { return handleError(logger, 'error', `readFile: ${e.message}`); }
}

//
export async function readAsObjectURL(rootHandle, relPath, options = {}, logger = defaultLogger) {
    rootHandle ??= await navigator?.storage?.getDirectory?.();
    try {
        const fileHandle = await getFileHandle(rootHandle, relPath, {}, logger);
        const file = await fileHandle?.getFile?.();
        return file ? URL.createObjectURL(file) : null;
    } catch (e: any)
        { return handleError(logger, 'error', `readAsObjectURL: ${e.message}`); }
}

//
export async function readFileUTF8(rootHandle, relPath, options = {}, logger = defaultLogger) {
    rootHandle ??= await navigator?.storage?.getDirectory?.();
    try {
        const fileHandle = await getFileHandle(rootHandle, relPath, {}, logger);
        const file = await fileHandle?.getFile?.(), u8b = await file?.arrayBuffer?.();
        return u8b ? new TextEncoder()?.encode?.(u8b) : "";
    } catch (e: any)
        { return handleError(logger, 'error', `readAsObjectURL: ${e.message}`); }
}



//
export async function writeFile(rootHandle, relPath, data, logger = defaultLogger) {
    rootHandle ??= await navigator?.storage?.getDirectory?.();
    try {
        const fileHandle = await getFileHandle(rootHandle, relPath, { create: true }, logger);
        const writable = await fileHandle?.createWritable?.();
        await writable?.write?.(data); await writable?.close?.();
        return true;
    } catch (e: any)
        { return handleError(logger, 'error', `writeFile: ${e.message}`); }
}

//
export async function getFileWriter(rootHandle, relPath, options = { create: true }, logger = defaultLogger) {
    rootHandle ??= await navigator?.storage?.getDirectory?.();
    try { return (await getFileHandle(rootHandle, relPath, options, logger))?.createWritable?.(); } catch (e: any)
        { return handleError(logger, 'error', `getFileWriter: ${e.message}`); }
}





//
export async function removeFile(rootHandle, relPath, options: any = {}, logger = defaultLogger) {
    rootHandle ??= await navigator?.storage?.getDirectory?.();
    relPath = relPath?.trim?.()?.startsWith?.("/user/") ? relPath?.trim?.()?.replace?.(/^\/user/g, "")?.trim?.() : relPath;
    try {
        const parts = relPath?.split?.('/')?.filter?.((d)=>!!d?.trim?.()), fileName = parts.pop();
        const dir = await getDirectoryHandle(rootHandle, relPath?.trim?.()?.replace?.(/\/$/, ''), {  }, logger);
        return dir?.removeEntry?.(fileName, { recursive: false });
    } catch (e: any) { return handleError(logger, 'error', `removeFile: ${e.message}`); }
}

//
export async function removeDirectory(rootHandle, relPath, options: any = {}, logger = defaultLogger) {
    rootHandle ??= await navigator?.storage?.getDirectory?.();
    relPath = relPath?.trim?.()?.startsWith?.("/user/") ? relPath?.trim?.()?.replace?.(/^\/user/g, "")?.trim?.() : relPath;
    try {
        const parts = relPath?.split?.('/')?.filter?.((d)=>!!d?.trim?.()), dirName = parts.pop();
        return (await openDirectory(rootHandle, parts?.join?.('/')?.trim?.()?.replace?.(/\/$/, ''), options, logger))?.removeEntry?.(dirName, { recursive: true });
    } catch (e: any) { return handleError(logger, 'error', `removeDirectory: ${e.message}`); }
}

//
export async function remove(rootHandle, relPath, options = {}, logger = defaultLogger) {
    rootHandle ??= await navigator?.storage?.getDirectory?.();
    relPath = relPath?.trim?.()?.startsWith?.("/user/") ? relPath?.trim?.()?.replace?.(/^\/user/g, "")?.trim?.() : relPath;
    return Promise.any([removeFile(rootHandle, relPath, options, logger), removeDirectory(rootHandle, relPath, options, logger)]);
}



//
export const openImageFilePicker = async ()=>{
    const $e = "showOpenFilePicker"; // @ts-ignore
    const showOpenFilePicker = window?.[$e]?.bind?.(window) ?? (await import("fest/polyfill/showOpenFilePicker.mjs"))?.[$e];
    return showOpenFilePicker(imageImportDesc);
}

//
export const downloadFile = async (file) => {
    if (typeof file == "string") { file = await provide(file); }; const filename = file.name; if (!filename) return; // @ts-ignore // IE10+
    if ("msSaveOrOpenBlob" in self.navigator) { self.navigator.msSaveOrOpenBlob(file, filename); };

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
export const clearAllInDirectory = async (rootHandle: any = null, relPath = "", options = {}, logger = defaultLogger) => {
    rootHandle ??= await navigator?.storage?.getDirectory?.();
    relPath = getDir(relPath?.trim?.()?.startsWith?.("/user/") ? relPath?.replace?.(/^\/user/g, "")?.trim?.() : relPath);
    const dir = await getDirectoryHandle(rootHandle, relPath, options, logger);
    if (dir) {
        const entries = await Array.fromAsync(dir?.entries?.() ?? []);
        return Promise.all(entries.map((entry) => dir?.removeEntry?.(entry?.[0], { recursive: true })));
    }
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
