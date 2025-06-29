import { makeReactive } from '../../../../object.ts/src/$core$/Mainline';

// Универсальный обработчик ошибок
export function handleError(logger, status, message) { if (logger) logger(status, message); return null; }

// Пример простого логгера
export const defaultLogger = (status, message) => { console.log(`[${status}] ${message}`); };
export async function getDirectoryHandle(rootHandle, relPath, { makeIfNotExists = false } = {}, logger = defaultLogger) {
    try {
        const parts = relPath.split('/').filter(Boolean); let dir = rootHandle;
        for (const part of parts) { dir = await dir.getDirectoryHandle(part, { create: makeIfNotExists }); if (!dir) return null; }; return dir;
    } catch (e) { return handleError(logger, 'error', `getDirectoryHandle: ${e.message}`); }
}

//
export function openDirectory(rootHandle, relPath, options: {makeIfNotExists: boolean} = {makeIfNotExists: false}, logger = defaultLogger) {
    // Кэш для содержимого директории // Асинхронно обновить кэш
    let mapCache = makeReactive(new Map<any, any>());
    async function updateCache() {
        const entries = await Array.fromAsync((await dirHandle).entries());
        const mapping = (nh: any)=>{ mapCache.set(nh?.[0], nh?.[1]); };
        const removed = Array.from(mapCache.keys()).map((key)=> entries.find((nh)=>nh?.[0] == key));
        removed.forEach((nh)=>{ if (nh) mapCache.delete(nh?.[0]); });
        entries.forEach(mapping); return mapCache;
    }

    // Основной handler для Proxy
    const handler: ProxyHandler<any> = {
        get(target, prop, receiver) {
            if (prop === 'getHandler') { return async (name) => { updateCache(); return mapCache.get(name) || null; }; }
            if (prop === 'getMap')     { return async () => { updateCache(); return mapCache; }; }
            if (prop === 'refresh')    { return async () => { updateCache(); return mapCache; }; }
            if (prop === 'dirHandle')  { return dirHandle; }

            // Прокидываем стандартные методы Map (если кэш уже есть)
            if (mapCache && typeof mapCache[prop] === 'function')
                { return mapCache[prop].bind(mapCache); }

            // Прокидываем стандартные методы Map (если кэша нет)
            return Promise.try(async ()=>{
                const handle = await dirHandle;
                if (handle?.[prop] != null) { return (typeof handle?.[prop] == "function" ? handle?.[prop]?.bind(handle) : handle?.[prop]); }
                if (!mapCache) await updateCache(); return mapCache[prop];
            });
        },

        // @ts-ignore // Позволяет использовать for...of, spread и т.д.
        async ownKeys(target) { if (!mapCache) await updateCache(); return Array.from(mapCache.keys()); },
        getOwnPropertyDescriptor(target, prop) { return { enumerable: true, configurable: true }; }
    };

    // Возвращаем Proxy-обёртку
    let dirHandle: any = getDirectoryHandle(rootHandle, relPath, options, logger)?.catch?.((e)=> handleError(logger, 'error', `openDirectory: ${e.message}`));
    updateCache(); const fx: any = function(){}; return new Proxy(fx, handler);
}



// Получить FileSystemFileHandle по относительному пути
export async function getFileHandle(rootHandle, relPath, { makeIfNotExists = false } = {}, logger = defaultLogger) {
    try {
        const parts = relPath.split('/').filter(Boolean);
        const fileName = parts.pop();
        const dir = await openDirectory(rootHandle, parts.join('/'), { makeIfNotExists }, logger);
        return await dir?.getFileHandle?.(fileName, { create: makeIfNotExists });
    } catch (e) {
        return handleError(logger, 'error', `getFileHandle: ${e.message}`);
    }
}

// Прочитать файл как текст
export async function readFile(rootHandle, relPath, options = {}, logger = defaultLogger) {
    try {
        const fileHandle = await getFileHandle(rootHandle, relPath, options, logger);
        return fileHandle?.getFile?.();
        //const file = await fileHandle.getFile();
        //return await file.text();
    } catch (e) {
        return handleError(logger, 'error', `readFile: ${e.message}`);
    }
}

// Записать текст в файл
export async function writeFile(rootHandle, relPath, { data }, logger = defaultLogger) {
    try {
        const fileHandle = await getFileHandle(rootHandle, relPath, { makeIfNotExists: true }, logger);
        const writable = await fileHandle?.createWritable?.();
        await writable?.write?.(data);
        await writable?.close?.();
        return true;
    } catch (e) {
        return handleError(logger, 'error', `writeFile: ${e.message}`);
    }
}

// Удалить файл
export async function removeFile(rootHandle, relPath, options = {}, logger = defaultLogger) {
    try {
        const parts = relPath.split('/').filter(Boolean), fileName = parts.pop();
        const dir = await openDirectory(rootHandle, parts.join('/'), options, logger);
        return dir?.removeEntry?.(fileName, { recursive: false });
    } catch (e) {
        return handleError(logger, 'error', `removeFile: ${e.message}`);
    }
}

// Удалить директорию
export async function removeDirectory(rootHandle, relPath, options = {}, logger = defaultLogger) {
    try {
        const parts = relPath.split('/').filter(Boolean), dirName = parts.pop();
        const parentDir = await openDirectory(rootHandle, parts.join('/'), options, logger);
        return parentDir?.removeEntry?.(dirName, { recursive: true });
    } catch (e) {
        return handleError(logger, 'error', `removeDirectory: ${e.message}`);
    }
}

// Получить FileWriter (writable stream)
export async function getFileWriter(rootHandle, relPath, options = {}, logger = defaultLogger) {
    try {
        const fileHandle = await getFileHandle(rootHandle, relPath, { makeIfNotExists: true }, logger);
        return fileHandle?.createWritable?.();
    } catch (e) {
        return handleError(logger, 'error', `getFileWriter: ${e.message}`);
    }
}

// Получить FileHandle
export async function getFileHandler(rootHandle, relPath, options = {}, logger = defaultLogger) {
    return getFileHandle(rootHandle, relPath, options, logger);
}

// Прочитать файл как ObjectURL
export async function readAsObjectURL(rootHandle, relPath, options = {}, logger = defaultLogger) {
    try {
        const fileHandle = await getFileHandle(rootHandle, relPath, {}, logger);
        const file = await fileHandle?.getFile?.();
        return file ? URL.createObjectURL(file) : null;
    } catch (e) {
        return handleError(logger, 'error', `readAsObjectURL: ${e.message}`);
    }
}

//
export function detectTypeByRelPath(relPath) {
    // Если путь заканчивается на / — это директория
    if (relPath?.trim()?.endsWith?.('/')) return 'directory';
    // Если есть расширение — скорее всего файл
    return 'file';
    //if (/\.[^\/]+$/.test(relPath)) return 'file';
    // Если нет расширения и не заканчивается на / — можно считать директорией
    //return 'directory';
}

//
export function getMimeTypeByFilename(filename) {
    const ext = filename.split('.').pop().toLowerCase();
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

export async function createHandler(rootHandle, relPath, options = {}, logger = defaultLogger) {
    const type = detectTypeByRelPath(relPath);
    if (type === 'directory') {
        return getDirectoryHandle(rootHandle, relPath.replace(/\/$/, ''), options, logger);
    } else {
        return getFileHandle(rootHandle, relPath, options, logger);
    }
}

// Универсальный remove (файл или директория)
export async function remove(rootHandle, relPath, options = {}, logger = defaultLogger) {
    return Promise.any([removeFile(rootHandle, relPath, options, logger), removeDirectory(rootHandle, relPath, options, logger)]);
}
