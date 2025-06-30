import { makeReactive } from 'u2re/object';

//
export function defaultLogger(status, message) { console.log(`[${status}] ${message}`); };
export function handleError(logger, status, message) { logger?.(status, message); return null; }

//
export const getDir = (dest)=>{
    if (typeof dest != "string") return dest;

    //
    dest = dest?.trim?.() || dest;
    if (!dest?.endsWith?.("/")) { dest = dest?.trim?.()?.split?.("/")?.slice(0, -1)?.join?.("/")?.trim?.() || dest; };
    const p1 = !dest?.trim()?.endsWith("/") ? (dest+"/") : dest;
    return (!p1?.startsWith("/") ? ("/"+p1) : p1);
}

//
export function detectTypeByRelPath(relPath) { if (relPath?.trim()?.endsWith?.('/')) return 'directory'; return 'file'; }
export function getFileExtension(path) { return path?.trim?.()?.split?.(".")?.[1]; }
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
const $fxy = Symbol.for("@fix"), fixFx = (obj) => { const fx = function(){}; fx[$fxy] = obj; return fx; }

//
export function WrapPromise(promise) {
    return new Proxy<any>(promise, {
        get(target, prop, receiver) {
            target = target?.[$fxy] ?? target;
            if (prop === 'then' || prop === 'catch' || prop === 'finally')
                { return target[prop].bind(target); }

            //
            return Promise.try(async () => {
                const obj = await target, value = obj?.[prop];
                if (typeof value == 'function') { return value.bind(obj); }
                return value;
            });
        }, // @ts-ignore
        set(target, prop, value) {
            target = target?.[$fxy] ?? target;
            return Promise.try(async () => Reflect.set(await target, prop, value));
        },
        apply(target, thisArg, args) {
            target = target?.[$fxy] ?? target;
            return Promise.try(async () => Reflect.apply(await target, thisArg, args));
        }
    });
}



//
export async function getDirectoryHandle(rootHandle, relPath, { create = false } = {}, logger = defaultLogger) {
    try {
        const parts = relPath.split('/').filter(Boolean); let dir = rootHandle;
        for (const part of parts) { dir = await dir.getDirectoryHandle(part, { create: create }); if (!dir) return null; }; return dir;
    } catch (e: any) { return handleError(logger, 'error', `getDirectoryHandle: ${e.message}`); }
}

//
export function openDirectory(rootHandle, relPath, options: {create: boolean} = {create: false}, logger = defaultLogger) {
    let mapCache = makeReactive(new Map<any, any>());
    async function updateCache() {
        const entries = await Array.fromAsync((await dirHandle).entries());
        const mapping = (nh: any)=>{ mapCache.set(nh?.[0], nh?.[1]); };
        const removed = Array.from(mapCache.keys()).map((key)=> entries.find((nh)=>nh?.[0] == key));
        removed.forEach((nh)=>{ if (nh) mapCache.delete(nh?.[0]); });
        entries.forEach(mapping); return mapCache;
    }

    // @ts-ignore
    const obs = typeof FileSystemObserver != "undefined" ? new FileSystemObserver(updateCache) : null;
    const handler: ProxyHandler<any> = {
        get(target, prop, receiver) {
            if (prop === 'getHandler') { return (name) => { updateCache(); return mapCache.get(name) || null; }; }
            if (prop === 'getMap')     { return () => { updateCache(); return mapCache; }; }
            if (prop === 'refresh')    { return () => { updateCache(); return pxy; }; }
            if (prop === 'dirHandle')  { return dirHandle; }

            //
            if (typeof mapCache?.[prop] === 'function')
                { return mapCache?.[prop]?.bind?.(mapCache); }

            //
            return WrapPromise(fixFx(Promise.try(async ()=>{
                const handle = await dirHandle;
                if (handle?.[prop] != null) { return (typeof handle?.[prop] == "function" ? handle?.[prop]?.bind(handle) : handle?.[prop]); }
                if (!mapCache) await updateCache(); return mapCache[prop];
            })));
        },

        // @ts-ignore
        async ownKeys(target) { if (!mapCache) await updateCache(); return Array.from(mapCache.keys()); },
        getOwnPropertyDescriptor(target, prop) { return { enumerable: true, configurable: true }; }
    };

    //
    let dirHandle: any = getDirectoryHandle(rootHandle, relPath, options, logger)?.catch?.((e)=> handleError(logger, 'error', `openDirectory: ${e.message}`));
    dirHandle.then((handle)=>obs?.observe?.(handle)); updateCache(); const fx: any = function(){}, pxy = new Proxy(fx, handler); return pxy;
}



//
export async function readFile(rootHandle, relPath, options = {}, logger = defaultLogger) {
    try
        { return (await getFileHandle(rootHandle, relPath, options, logger))?.getFile?.(); } catch (e: any)
        { return handleError(logger, 'error', `readFile: ${e.message}`); }
}

//
export async function readAsObjectURL(rootHandle, relPath, options = {}, logger = defaultLogger) {
    try {
        const fileHandle = await getFileHandle(rootHandle, relPath, {}, logger);
        const file = await fileHandle?.getFile?.();
        return file ? URL.createObjectURL(file) : null;
    } catch (e: any)
        { return handleError(logger, 'error', `readAsObjectURL: ${e.message}`); }
}

//
export async function readFileUTF8(rootHandle, relPath, options = {}, logger = defaultLogger) {
    try {
        const fileHandle = await getFileHandle(rootHandle, relPath, {}, logger);
        const file = await fileHandle?.getFile?.(), u8b = await file?.arrayBuffer?.();
        return u8b ? new TextEncoder()?.encode?.(u8b) : "";
    } catch (e: any)
        { return handleError(logger, 'error', `readAsObjectURL: ${e.message}`); }
}



//
export async function writeFile(rootHandle, relPath, { data }, logger = defaultLogger) {
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
    try
        { return (await getFileHandle(rootHandle, relPath, options, logger))?.createWritable?.(); } catch (e: any)
        { return handleError(logger, 'error', `getFileWriter: ${e.message}`); }
}



//
export async function getFileHandle(rootHandle, relPath, { create = false } = {}, logger = defaultLogger) {
    try {
        const parts = relPath.split('/').filter(Boolean), fileName = parts.pop();
        const dir = await openDirectory(rootHandle, parts.join('/'), { create }, logger);
        return await dir?.getFileHandle?.(fileName, { create: create || create });
    } catch (e: any)
        { return handleError(logger, 'error', `getFileHandle: ${e.message}`); }
}

//
export async function getHandler(rootHandle, relPath, options = {}, logger = defaultLogger) {
    const type = detectTypeByRelPath(relPath);
    if (type === 'directory') {
        const dir = await getDirectoryHandle(rootHandle, relPath.replace(/\/$/, ''), options, logger);
        if (dir) return { type: 'directory', handle: dir };
    } else {
        const file = await getFileHandle(rootHandle, relPath, options, logger);
        if (file) return { type: 'file', handle: file };
    }
    return null;
}

//
export async function createHandler(rootHandle, relPath, options = {}, logger = defaultLogger) {
    const type = detectTypeByRelPath(relPath);
    if (type === 'directory')
        { return getDirectoryHandle(rootHandle, relPath.replace(/\/$/, ''), options, logger); } else
        { return getFileHandle(rootHandle, relPath, options, logger); }
}





//
export async function removeFile(rootHandle, relPath, options: any = {}, logger = defaultLogger) {
    try {
        const parts = relPath.split('/').filter(Boolean), fileName = parts.pop();
        return (await openDirectory(rootHandle, parts.join('/'), options, logger))?.removeEntry?.(fileName, { recursive: false });
    } catch (e: any)
        { return handleError(logger, 'error', `removeFile: ${e.message}`); }
}

//
export async function removeDirectory(rootHandle, relPath, options: any = {}, logger = defaultLogger) {
    try {
        const parts = relPath.split('/').filter(Boolean), dirName = parts.pop();
        return (await openDirectory(rootHandle, parts.join('/'), options, logger))?.removeEntry?.(dirName, { recursive: true });
    } catch (e: any)
        { return handleError(logger, 'error', `removeDirectory: ${e.message}`); }
}

//
export async function remove(rootHandle, relPath, options = {}, logger = defaultLogger) {
    return Promise.any([removeFile(rootHandle, relPath, options, logger), removeDirectory(rootHandle, relPath, options, logger)]);
}




//
export const imageImportDesc = {
    types: [
        {
            description: "wallpaper",
            accept: {
                "image/*": [
                    ".png",
                    ".gif",
                    ".jpg",
                    ".jpeg",
                    ".webp",
                    ".jxl",
                ],
            },
        },
    ],
    startIn: "pictures",
    multiple: false,
};

//
export const openImageFilePicker = async ()=>{
    const $e = "showOpenFilePicker"; // @ts-ignore
    const showOpenFilePicker = window?.[$e]?.bind?.(window) ?? (await import("/externals/polyfill/showOpenFilePicker.mjs"))?.[$e];
    return showOpenFilePicker(imageImportDesc);
}

//
export const downloadFile = async (file) => {
    if (typeof file == "string") { file = await provide(file); };
    const filename = file.name;  if (!filename) return;

    //
    if ("msSaveOrOpenBlob" in self.navigator) { // @ts-ignore // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    }

    // @ts-ignore
    const fx = await (self?.showOpenFilePicker
        ? new Promise((r) => r({ // @ts-ignore
            showOpenFilePicker: self?.showOpenFilePicker?.bind?.(window), // @ts-ignore
            showSaveFilePicker: self?.showSaveFilePicker?.bind?.(window), // @ts-ignore
        }))
        // @ts-ignore
        : import(/* @vite-ignore */ "/externals/polyfill/showOpenFilePicker.mjs"));

    // @ts-ignore
    if (window?.showSaveFilePicker) { // @ts-ignore
        const fileHandle = await fx?.showSaveFilePicker?.({ suggestedName: filename })?.catch?.(console.warn.bind(console));
        const writableFileStream = await fileHandle?.createWritable?.({ keepExistingData: true })?.catch?.(console.warn.bind(console));
        await writableFileStream?.write?.(file)?.catch?.(console.warn.bind(console));
        await writableFileStream?.close()?.catch?.(console.warn.bind(console));
    } else {
        let url = "";  const a = document.createElement("a");
        try { a.href = url = URL.createObjectURL(file); } catch(e) { console.warn(e); };
        a.download = filename; document.body.appendChild(a); a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
};

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
        const handle = getFileHandle(navigator?.storage?.getDirectory?.(), npt + fn, { create: true });
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
};
