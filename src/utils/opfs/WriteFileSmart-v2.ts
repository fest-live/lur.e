import { JSOX } from "jsox";

/** Dynamic-only: static `fest/lure` pulls `com-app` (lure/fl-ui merge) into the MV3 service worker graph. */
type LureFs = Pick<typeof import("fest/lure"), "readFile" | "writeFile">;
let lureFsPromise: Promise<LureFs> | null = null;
const getLureFs = (): Promise<LureFs> => {
	if (!lureFsPromise) {
		lureFsPromise = import("fest/lure").then((m) => ({ readFile: m.readFile, writeFile: m.writeFile }));
	}
	return lureFsPromise;
};

//
export const sanitizeFileName = (name: string, fallbackExt = "") => {
    const parts = String(name || "").split("/").pop() || "";
    const base = parts.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9_.\-+#&]/g, '-');
    if (fallbackExt && !base.includes('.')) return `${base || Date.now()}${fallbackExt.startsWith('.') ? '' : '.'}${fallbackExt}`;
    return base || `${Date.now()}`;
}



//
// Unified file/path helpers
//

// sanitize one path/token to safe slug
const toSlug = (input: string, toLower = true) => {
    let s = String(input || "").trim();
    if (toLower) s = s.toLowerCase();
    // replace whitespace with '-'
    s = s.replace(/\s+/g, '-');
    // keep only safe chars
    s = s.replace(/[^a-z0-9_.\-+#&]/g, '-');
    // collapse repeats
    s = s.replace(/-+/g, '-');
    return s;
};

//
const inferExtFromMime = (mime = "") => {
    if (!mime) return "";
    if (mime.includes("json")) return "json";
    if (mime.includes("markdown")) return "md";
    if (mime.includes("plain")) return "txt";
    if (mime === "image/jpeg" || mime === "image/jpg") return "jpg";
    if (mime === "image/png") return "png";
    if (mime.startsWith("image/")) return mime.split('/').pop() || "";
    if (mime.includes("html")) return "html";
    return "";
};

//
const splitPath = (path: string) => String(path || "").split('/').filter(Boolean);
const ensureDir = (p: string) => (p.endsWith('/') ? p : p + '/');
const joinPath = (parts: string[], absolute = true) => (absolute ? '/' : '') + parts.filter(Boolean).join('/') + '';

//
const sanitizePathSegments = (path: string) => {
    const parts = splitPath(path);
    return joinPath(parts.map((p) => toSlug(p)));
};

type MergeArrayStrategy = 'union' | 'replace' | 'concat';

export interface WriteSmartOptions {
    forceExt?: string;
    ensureJson?: boolean;
    toLower?: boolean;
    sanitize?: boolean;
    // Новые опции
    mergeJson?: boolean;                  // включить merge JSON (по умолчанию true для .json)
    arrayStrategy?: MergeArrayStrategy;   // 'union' (по умолчанию), 'replace', 'concat'
    arrayKey?: string | string[];         // ключ(и) для дедупа объектов в массивах (например 'id')
    jsonSpace?: number | string;          // форматирование JSON при записи (например 2)
}

const DEFAULT_ARRAY_KEYS = ['id', '_id', 'key', 'slug', 'name'];

const isPlainObject = (v: any) => Object.prototype.toString.call(v) === '[object Object]';

function dedupeArray(items: any[], opts: { arrayKey?: string | string[] }) {
    const keys = Array.isArray(opts.arrayKey) ? opts.arrayKey : (opts.arrayKey ? [opts.arrayKey] : DEFAULT_ARRAY_KEYS);
    const result: any[] = [];
    const primitiveSet = new Set<any>();
    const objMap = new Map<string, any>();
    const stringifiedSet = new Set<string>();

    for (const it of items) {
        if (it == null) continue;

        if (isPlainObject(it)) {
            // Попробуем по ключу
            let dedupeKey: string | undefined;
            for (const k of keys) {
                if (k in it && it[k] != null) {
                    dedupeKey = String(it[k]);
                    break;
                }
            }
            if (dedupeKey != null) {
                if (!objMap.has(dedupeKey)) {
                    objMap.set(dedupeKey, it);
                    result.push(it);
                }
            } else {
                // Фолбэк — по JSOX.stringify
                const sig = safeStableStringify(it);
                if (!stringifiedSet.has(sig)) {
                    stringifiedSet.add(sig);
                    result.push(it);
                }
            }
        } else if (Array.isArray(it)) {
            // вложенные массивы — добавим как элемент с сигнатурой
            const sig = safeStableStringify(it);
            if (!stringifiedSet.has(sig)) {
                stringifiedSet.add(sig);
                result.push(it);
            }
        } else {
            // примитив
            if (!primitiveSet.has(it)) {
                primitiveSet.add(it);
                result.push(it);
            }
        }
    }

    return result;
}

function mergeDeepUnique(a: any, b: any, opts: { arrayStrategy: MergeArrayStrategy; arrayKey?: string | string[] }): any {
    if (Array.isArray(a) && Array.isArray(b)) {
        switch (opts.arrayStrategy) {
            case 'replace':
                return b.slice();
            case 'concat':
                return a.concat(b);
            case 'union':
            default:
                return dedupeArray(a.concat(b), { arrayKey: opts.arrayKey });
        }
    }

    if (isPlainObject(a) && isPlainObject(b)) {
        const out: any = { ...a };
        for (const k of Object.keys(b)) {
            if (k in a) {
                out[k] = mergeDeepUnique(a[k], b[k], opts);
            } else {
                out[k] = b[k];
            }
        }
        return out;
    }

    // По умолчанию — значение справа
    return b;
}

function safeStableStringify(obj: any): string {
    // Простая стабильная сериализация (по алф. ключей) — достаточно для дедупа
    if (!isPlainObject(obj)) return JSON.stringify(obj);
    const keys = Object.keys(obj).sort();
    const o: any = {};
    for (const k of keys) o[k] = obj[k];
    return JSON.stringify(o);
}

async function blobToText(blob: Blob): Promise<string> {
    return await blob.text();
}

async function readFileAsJson(root: any | null, fullPath: string): Promise<any | null> {
    try {
        const { readFile } = await getLureFs();
        // Предположим, что readFile есть и возвращает Blob/File
        const existing: any = await readFile(root, fullPath)?.catch?.(console.warn.bind(console));
        if (!existing) return null;
        const text = await blobToText(existing);
        if (!text?.trim()) return null;
        return JSOX.parse(text);
    } catch {
        return null;
    }
}

// Always writes by full sanitized path. Accepts a directory or a full path.
export const writeFileSmart = async (
    root: any | null,
    dirOrPath: string,
    file: File | Blob,
    options: WriteSmartOptions = {}
) => {
    const { writeFile } = await getLureFs();
    const {
        forceExt,
        ensureJson,
        toLower = true,
        sanitize = true,
        mergeJson,
        arrayStrategy = 'union',
        arrayKey,
        jsonSpace = 2,
    } = options;

    // Determine desired base name and directory
    let raw = String(dirOrPath || "").trim();
    const isDirHint = raw.endsWith('/');
    const hasFileToken = !isDirHint && splitPath(raw).length > 0 && raw.includes('.');

    let dirPath = isDirHint ? raw : (hasFileToken ? raw.split('/').slice(0, -1).join('/') : raw);
    let desiredName = hasFileToken ? raw.split('/').pop() || '' : (file as any)?.name || '';

    // Fallbacks
    dirPath = dirPath || '/';
    desiredName = desiredName || (Date.now() + '');

    // Extract name/ext
    const lastDot = desiredName.lastIndexOf('.');
    let base = lastDot > 0 ? desiredName.slice(0, lastDot) : desiredName;
    let ext = (forceExt || (ensureJson ? 'json' : (lastDot > 0 ? desiredName.slice(lastDot + 1) : inferExtFromMime((file as any)?.type || '')))) || '';

    if (sanitize) {
        dirPath = sanitizePathSegments(dirPath);
        base = toSlug(base, toLower);
    }

    const finalName = ext ? `${base}.${ext}` : base;
    const fullPath = ensureDir(dirPath) + finalName;

    // Try JSON merge if applicable
    const shouldMergeJson = (mergeJson !== false) && (ensureJson || ext.toLowerCase() === 'json' || ((file as any)?.type === 'application/json'));

    if (shouldMergeJson) {
        try {
            // Исходный контент (новый)
            let incomingJson: any;
            if (file instanceof File || file instanceof Blob) {
                const txt = await blobToText(file);
                incomingJson = txt?.trim() ? JSOX.parse(txt) : {};
            } else {
                incomingJson = file; // неизвестно, но попробуем
            }

            // Существующий JSON (если есть)
            const existingJson = await readFileAsJson(root, fullPath)?.catch?.(console.warn.bind(console));

            let merged = existingJson != null
                ? mergeDeepUnique(existingJson, incomingJson, { arrayStrategy, arrayKey })
                : incomingJson;

            // Нормализуем undefined -> null/удаление ключей (JSOX.stringify не поддерживает undefined)
            const jsonString = JSON.stringify(merged, undefined, jsonSpace);

            //
            const toWrite = new File([jsonString], finalName, { type: 'application/json' });
            const rs = await writeFile(root, fullPath, toWrite)?.catch?.(console.warn.bind(console));
            if (typeof document !== "undefined")
                document?.dispatchEvent?.(new CustomEvent("rs-fs-changed", {
                    detail: rs,
                    bubbles: true, composed: true, cancelable: true,
                }));
            return rs;
        } catch (err) {
            console.warn('writeFileSmart JSON merge failed, falling back to raw write:', err);
            // если не удалось распарсить/слить — ниже будет обычная запись
        }
    }

    // Ensure File object with correct name (старая ветка)
    let toWrite: File;
    if (file instanceof File) {
        if (file.name === finalName) {
            toWrite = file;
        } else {
            const type = (file as any).type || (ext ? `application/${ext}` : 'application/octet-stream');
            const buf = await file.arrayBuffer();
            toWrite = new File([buf], finalName, { type });
        }
    } else {
        const type = (file as any).type || (ext ? `application/${ext}` : 'application/octet-stream');
        const blob = file as Blob;
        toWrite = new File([await blob.arrayBuffer()], finalName, { type });
    }

    const rs = await writeFile(root, fullPath, toWrite)?.catch?.(console.warn.bind(console));
    if (typeof document !== "undefined")
        document?.dispatchEvent?.(new CustomEvent("rs-fs-changed", {
            detail: rs,
            bubbles: true, composed: true, cancelable: true,
        }));
    return rs;
};
