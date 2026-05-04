/**
 * Recursive JSON transformation helper for OPFS directories.
 *
 * WHY: bulk migrations and cleanup tasks often need to walk an existing OPFS
 * subtree, parse each JSON/JSOX file, transform the data, and write back only
 * when the normalized output actually changed.
 */

/**
 * @typedef {Object} OpfsModifyOptions
 * @property {string} dirPath Относительный путь от корня OPFS (например, "data/configs")
 * @property {(data:any, ctx:{path:string,name:string,fullPath:string}) => any|Promise<any>} transform
 *           Функция-трансформация. Должна вернуть новый объект (или исходный, если без изменений).
 *           Можно вернуть undefined, чтобы пропустить запись.
 * @property {(name:string, fullPath:string) => boolean} [filter]
 *           Доп. фильтр по имени/пути (true — обрабатывать).
 * @property {number} [indent=2] Кол-во пробелов для JSOX.stringify
 * @property {boolean} [dryRun=false] Если true — только показывает, что было бы изменено, без записи.
 * @property {boolean} [prettyStable=true] Если true — сортирует ключи (стабильный вывод).
 */

import { JSOX } from "jsox";


interface OpfsModifyOptions {
    dirPath: string;
    transform: (data: any, ctx: { path: string, name: string, fullPath: string }) => any | Promise<any>;
    filter?: (name: string, fullPath: string) => boolean;
    indent?: number;
    dryRun?: boolean;
    prettyStable?: boolean;
}

/**
 * Walk a directory tree inside OPFS, apply a transform to every JSON-like file,
 * and optionally perform a dry run without writing changes.
 */
export async function opfsModifyJson(options: OpfsModifyOptions) {
    const {
        dirPath,
        transform,
        filter,
        indent = 2,
        dryRun = false,
        prettyStable = true,
    } = options;
    assertOpfs();

    const root = await navigator.storage.getDirectory()?.catch?.(() => null);
    if (!root) {
        return { processed: 0, changed: 0, errors: 0 };
    }
    const normDirPath = normalizePath(dirPath);
    const dir = await getDirByPath(root, normDirPath);
    // First launch or path never created — not an error; migration is a no-op.
    if (!dir) {
        return { processed: 0, changed: 0, errors: 0 };
    }

    let processed = 0;
    let changed = 0;
    let errors = 0;

    for await (const { handle, name, fullPath } of walk(dir, normDirPath)) {
        if (handle.kind !== 'file' || !name.toLowerCase().endsWith('.json')) continue;
        if (filter && !filter(name, fullPath)) continue;

        try {
            const file = await handle.getFile();
            const originalText = await file.text();

            let data;
            try {
                data = originalText.trim() === '' ? null : JSOX.parse(originalText) as any;
            } catch (_) {
                try {
                    data = originalText.trim() === '' ? null : JSON.parse(originalText) as any;
                } catch (e) {
                    console.warn(`JSON parse error: ${fullPath}`, e);
                    errors++;
                    continue;
                }
            }

            const result = await transform(data, { path: normDirPath, name, fullPath });

            if (typeof result === 'undefined') {
                processed++;
                continue;
            }

            const newText = serializeJSON(result as any, { indent, prettyStable });

            if (normalizeEol(newText) === normalizeEol(originalText)) {
                processed++;
                continue;
            }

            if (dryRun) {
                console.log(`[dry-run] Would update: ${fullPath}`);
            } else {
                const writable = await handle.createWritable();
                await writable.truncate(0);
                await writable.write(newText);
                await writable.close();
                console.log(`Updated: ${fullPath}`);
            }
            processed++;
            changed++;
        } catch (e) {
            console.error(`Failed on ${fullPath}:`, e);
            errors++;
        }
    }

    return { processed, changed, errors };
}

function normalizePath(p?: string): string {
    if (!p || p === '/' || p === '.') return '';
    return p.split('/').filter(Boolean).join('/');
}

// ===== Helpers =====

function assertOpfs() {
    if (!('storage' in navigator) || typeof navigator.storage.getDirectory !== 'function') {
        throw new Error('OPFS is not available in this browser/context. Need navigator.storage.getDirectory().');
    }
}

//
async function getDirByPath(rootDirHandle, path) {
    if (!path || path === '/' || path === '.') return rootDirHandle;
    const parts = path.split('/').map(s => s.trim()).filter(Boolean);
    let dir = rootDirHandle;
    for (const part of parts) {
        try {
            dir = await dir?.getDirectoryHandle?.(part, { create: false });
        } catch (e: any) {
            if (e?.name === "NotFoundError") return null;
            // Teardown / user dismiss / navigation can abort in-flight directory ops (esp. with dev SW reloads).
            if (e?.name === "AbortError") return null;
            throw e;
        }
        if (!dir) return null;
    }
    return dir;
}

/** Async generator for recursively walking an OPFS directory tree. */
async function* walk(dirHandle, basePath = '') {
    for await (const [name, handle] of dirHandle.entries()) {
        const fullPath = basePath ? `${basePath}/${name}` : name;
        if (handle.kind === 'directory') {
            yield* walk(handle, fullPath);
        } else {
            yield { handle, name, fullPath };
        }
    }
}

function serializeJSON(obj, { indent = 2, prettyStable = true } = {}) {
    const replacer = prettyStable ? stableReplacer : undefined;
    return JSON.stringify(obj as any, replacer, indent) + '\n';
}

/** Stable key ordering for deterministic JSON output and smaller diffs. */
function stableReplacer(key, value) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
        const out = {};
        for (const k of Object.keys(value).sort()) {
            out[k] = value[k];
        }
        return out;
    }
    return value;
}

function normalizeEol(s) {
    return s.replace(/\r\n/g, '\n');
}
