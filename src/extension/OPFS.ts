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
export async function getDirectoryHandle(rootHandle, relPath, { create = false } = {}, logger = defaultLogger) {
    rootHandle ??= navigator?.storage?.getDirectory?.();
    relPath = relPath?.trim?.()?.startsWith?.("/user/") ? relPath?.trim?.()?.replace?.(/^\/user/g, "")?.trim?.() : relPath;
    try {
        const parts = relPath.split('/').filter((p)=>!!p?.trim?.()); let dir = rootHandle;
        if (!relPath?.endsWith?.("/")) { parts.pop(); };
        for (const part of parts) { dir = await dir.getDirectoryHandle(part, { create }); if (!dir) return dir; }; return dir;
    } catch (e: any) { return handleError(logger, 'error', `getDirectoryHandle: ${e.message}`); }
}

//
export function openDirectory(rootHandle, relPath, options: {create: boolean} = {create: false}, logger = defaultLogger) {
    rootHandle ??= navigator?.storage?.getDirectory?.();

    //
    let mapCache = makeReactive(new Map<any, any>());
    async function updateCache() { // @ts-ignore
        const entries = await Array.fromAsync((await dirHandle)?.entries?.() || []); // @ts-ignore
        const mapping = (nh: any)=>{ mapCache.set(nh?.[0], nh?.[1]); }; // @ts-ignore
        const removed = Array.from(mapCache.keys()).map((key)=> entries.find((nh)=>nh?.[0] == key)); // @ts-ignore
        removed.forEach((nh)=>{ if (nh) mapCache.delete(nh?.[0]); });
        entries.forEach(mapping); return mapCache;
    }

    // @ts-ignore
    const obs = typeof FileSystemObserver != "undefined" ? new FileSystemObserver(updateCache) : null;
    const handler: ProxyHandler<any> = {
        get(target, prop, receiver) { // @ts-ignore
            if (prop === 'getHandler') { return (name) => { updateCache(); return mapCache.get(name) || null; }; }
            if (prop === 'getMap')     { return () => { updateCache(); return mapCache; }; }
            if (prop === 'refresh')    { return () => { updateCache(); return pxy; }; }
            if (prop === 'dirHandle')  { return dirHandle; }

            //
            if (typeof mapCache?.[prop] == 'function')
                { return mapCache?.[prop]?.bind?.(mapCache); }

            // @ts-ignore
            const complex = Promised(Promise.try?.(async ()=>{
                const handle = await dirHandle;
                if (handle?.[prop] != null) { return handle; }
                if (!mapCache) await updateCache(); return mapCache;
            }));

            //
            return complex?.[prop];
        },

        // @ts-ignore
        async ownKeys(target) { if (!mapCache) await updateCache(); return Array.from(mapCache.keys()); }, // @ts-ignore
        getOwnPropertyDescriptor(target, prop) { return { enumerable: true, configurable: true }; } // @ts-ignore
    };

    //
    let dirHandle: any = getDirectoryHandle(rootHandle, relPath, options, logger)?.catch?.((e)=> handleError(logger, 'error', `openDirectory: ${e.message}`));
    dirHandle?.then?.(async (handlePromised)=>{
        const handle = (await handlePromised?.getHandle?.()) ?? (await handlePromised);
        if (handle) { obs?.observe?.(handle); };
    });
    updateCache(); const fx: any = function(){}, pxy = new Proxy(fx, handler); return pxy;
}



//
export async function readFile(rootHandle, relPath, options = {}, logger = defaultLogger) {
    rootHandle ??= navigator?.storage?.getDirectory?.();
    try { return (await getFileHandle(rootHandle, relPath, options, logger))?.getFile?.(); } catch (e: any)
        { return handleError(logger, 'error', `readFile: ${e.message}`); }
}

//
export async function readAsObjectURL(rootHandle, relPath, options = {}, logger = defaultLogger) {
    rootHandle ??= navigator?.storage?.getDirectory?.();
    try {
        const fileHandle = await getFileHandle(rootHandle, relPath, {}, logger);
        const file = await fileHandle?.getFile?.();
        return file ? URL.createObjectURL(file) : null;
    } catch (e: any)
        { return handleError(logger, 'error', `readAsObjectURL: ${e.message}`); }
}

//
export async function readFileUTF8(rootHandle, relPath, options = {}, logger = defaultLogger) {
    rootHandle ??= navigator?.storage?.getDirectory?.();
    try {
        const fileHandle = await getFileHandle(rootHandle, relPath, {}, logger);
        const file = await fileHandle?.getFile?.(), u8b = await file?.arrayBuffer?.();
        return u8b ? new TextEncoder()?.encode?.(u8b) : "";
    } catch (e: any)
        { return handleError(logger, 'error', `readAsObjectURL: ${e.message}`); }
}



//
export async function writeFile(rootHandle, relPath, { data }, logger = defaultLogger) {
    rootHandle ??= navigator?.storage?.getDirectory?.();
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
    rootHandle ??= navigator?.storage?.getDirectory?.();
    try { return (await getFileHandle(rootHandle, relPath, options, logger))?.createWritable?.(); } catch (e: any)
        { return handleError(logger, 'error', `getFileWriter: ${e.message}`); }
}



//
export async function getFileHandle(rootHandle, relPath, { create = false } = {}, logger = defaultLogger) {
    rootHandle ??= navigator?.storage?.getDirectory?.();
    try {
        const parts = relPath.split('/').filter(Boolean), fileName = parts.pop();
        const dir = await openDirectory(rootHandle, parts.join('/'), { create }, logger);
        return await dir?.getFileHandle?.(fileName, { create });
    } catch (e: any) { return handleError(logger, 'error', `getFileHandle: ${e.message}`); }
}

//
export async function getHandler(rootHandle, relPath, options = {}, logger = defaultLogger) {
    rootHandle ??= navigator?.storage?.getDirectory?.();
    const type = detectTypeByRelPath(relPath);
    if (type === 'directory')
        { const dir  = await getDirectoryHandle(rootHandle, relPath.replace(/\/$/, ''), options, logger); if (dir) return { type: 'directory', handle: dir }; } else
        { const file = await getFileHandle(rootHandle, relPath, options, logger); if (file) return { type: 'file', handle: file }; }
    return null;
}

//
export async function createHandler(rootHandle, relPath, options = {}, logger = defaultLogger) {
    rootHandle ??= navigator?.storage?.getDirectory?.();
    const type = detectTypeByRelPath(relPath);
    if (type === 'directory')
        { return getDirectoryHandle(rootHandle, relPath.replace(/\/$/, ''), options, logger); } else
        { return getFileHandle(rootHandle, relPath, options, logger); }
}



//
export async function removeFile(rootHandle, relPath, options: any = {}, logger = defaultLogger) {
    rootHandle ??= navigator?.storage?.getDirectory?.();
    try {
        const parts = relPath.split('/').filter(Boolean), fileName = parts.pop();
        return (await openDirectory(rootHandle, parts.join('/'), options, logger))?.removeEntry?.(fileName, { recursive: false });
    } catch (e: any) { return handleError(logger, 'error', `removeFile: ${e.message}`); }
}

//
export async function removeDirectory(rootHandle, relPath, options: any = {}, logger = defaultLogger) {
    rootHandle ??= navigator?.storage?.getDirectory?.();
    try {
        const parts = relPath.split('/').filter(Boolean), dirName = parts.pop();
        return (await openDirectory(rootHandle, parts.join('/'), options, logger))?.removeEntry?.(dirName, { recursive: true });
    } catch (e: any) { return handleError(logger, 'error', `removeDirectory: ${e.message}`); }
}

//
export async function remove(rootHandle, relPath, options = {}, logger = defaultLogger) {
    rootHandle ??= navigator?.storage?.getDirectory?.();
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
    const path = getDir(url?.replace?.(location.origin, "")?.trim?.());
    const fn   = url?.split("/")?.at?.(-1);

    //
    if (!URL.canParse(url) && path?.trim()?.startsWith?.("/user")) {
        const $path = path?.replace?.("/user/", "")?.trim?.();
        const clean = (($path?.split?.("/") || [$path])?.filter?.((p)=>!!p?.trim?.()) || [""])?.join?.("/") || "";
        const npt = ((clean && clean != "/") ? "/" + clean + "/" : clean) || "/";
        const handle = getFileHandle(await navigator?.storage?.getDirectory?.(), npt + fn, { create: true });
        if (rw) { handle?.then?.((h)=>h?.createWritable?.()); }
        return handle?.then?.((h)=>h?.getFile?.());
    } else {
        return fetch(req).then(async (r) => {
            const blob = await r.blob();
            const lastModified = Date.parse(r.headers.get("Last-Modified") || "") || 0;
            return new File([blob], url.substring(url.lastIndexOf('/') + 1), {
                type: blob.type,
                lastModified
            });
        });
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
export const dropFile = async (file, dest = "/user/", current?: any)=>{
    const fs = await navigator?.storage?.getDirectory?.();
    const path = getDir(dest);

    //
    if (!path?.startsWith?.("/user")) return;
    const user = path?.replace?.("/user","");

    //
    file = file instanceof File ? file : (new File([file], UUIDv4() + "." + (file?.type?.split?.("/")?.[1] || "tmp")))

    //
    const fp = user + (file?.name || "wallpaper");
    await writeFile(fs, fp, file);

    // TODO! needs to fix same directory scope
    current?.set?.("/user" + fp, file);
    return "/user" + fp;
}

//
export const uploadFile = async (dest = "/user/", current?: any)=>{
    const $e = "showOpenFilePicker";

    // @ts-ignore
    const showOpenFilePicker = window?.[$e]?.bind?.(window) ?? (await import("fest/polyfill/showOpenFilePicker.mjs"))?.[$e];
    return showOpenFilePicker(imageImportDesc)?.then?.(async ([handle] = [])=>{
        const file = await handle?.getFile?.();
        return dropFile(file, dest, current);
    });
}

//
export const ghostImage = new Image();
ghostImage.decoding = "async";
ghostImage.width  = 24;
ghostImage.height = 24;

//
try {
    ghostImage.src = URL.createObjectURL(new Blob([`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 384 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 288c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128z"/></svg>`], {type: "image/svg+xml"}));
} catch(e) {}



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
    return dropFile(blob, "/user/temp/");
}
