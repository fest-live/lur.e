export type Base64Alphabet = "base64" | "base64url";
export type Base64LastChunkHandling = "loose" | "strict" | "stop-before-partial";

export type DataUrlParts = {
    mimeType: string;
    isBase64: boolean;
    data: string;
};

export type DecodeBase64Options = {
    alphabet?: Base64Alphabet;
    lastChunkHandling?: Base64LastChunkHandling;
};

export type EncodeBase64Options = {
    alphabet?: Base64Alphabet;
};

export type BlobToStringOptions = {
    /**
     * When true, encode raw text payload with encodeURIComponent().
     * Common for SVG: data:image/svg+xml,${encodeURIComponent(svg)}.
     */
    uriComponent?: boolean;
    /**
     * If provided, overrides blob.type when producing a data URL.
     */
    mimeType?: string;
    /**
     * Output as base64 (default true for non-text). If false, output as text (optionally URI-encoded).
     */
    base64?: boolean;
    /**
     * Base64 encoding options for base64/base64url.
     */
    base64Options?: EncodeBase64Options;
    /**
     * For text serialization.
     */
    textEncoding?: "utf-8";
};

export type StringToBinaryOptions = {
    /**
     * Prefer/force decoding a URL-encoded payload via decodeURIComponent.
     * If omitted, we auto-detect by trying to decode only when it looks encoded.
     */
    uriComponent?: boolean;
    /**
     * If provided, overrides any mime type derived from a data URL.
     */
    mimeType?: string;
    /**
     * When creating a File, use this filename.
     */
    filename?: string;
    /**
     * When true, return a File. Otherwise return a Blob.
     */
    asFile?: boolean;
    /**
     * If true, treat input as base64 (or base64url) bytes (not UTF-8 text).
     * If omitted, auto-detect via data URL or base64 shape.
     */
    isBase64?: boolean;
    /**
     * Decode options for base64/base64url.
     */
    base64?: DecodeBase64Options;
    /**
     * Max bytes allowed for decoded binary data.
     */
    maxBytes?: number;
};

export type DataAssetInput = File | Blob | string | URL;
export type DataAssetSource = "file" | "blob" | "data-url" | "base64" | "url" | "uri" | "text";

export type DataAsset = {
    hash: string;
    name: string;
    type: string;
    size: number;
    source: DataAssetSource;
    file: File;
};

export type NormalizeDataAssetOptions = {
    mimeType?: string;
    /**
     * Prefix for generated hash-based filenames.
     */
    namePrefix?: string;
    /**
     * Optional explicit filename override.
     */
    filename?: string;
    /**
     * When true, keep input File name instead of hash-name.
     */
    preserveFileName?: boolean;
    uriComponent?: boolean;
    maxBytes?: number;
};

const DEFAULT_MIME = "application/octet-stream";

const DATA_URL_RE = /^data:(?<mime>[^;,]+)?(?<params>(?:;[^,]*)*?),(?<data>[\s\S]*)$/i;

function canUseFromBase64(): boolean {
    return typeof (Uint8Array as any).fromBase64 === "function";
}

function canUseToBase64(u8: Uint8Array): boolean {
    return typeof (u8 as any).toBase64 === "function";
}

function tryDecodeURIComponent(s: string): string {
    try {
        return decodeURIComponent(s);
    } catch {
        return s;
    }
}

function likelyUriComponent(s: string): boolean {
    return /%[0-9A-Fa-f]{2}/.test(s) || s.includes("+");
}

function isTextMime(mimeType: string): boolean {
    const t = (mimeType || "").toLowerCase();
    return (
        t.startsWith("text/") ||
        t.includes("json") ||
        t.includes("xml") ||
        t.includes("svg") ||
        t.includes("javascript") ||
        t.includes("ecmascript")
    );
}

function bytesToArrayBuffer(bytes: Uint8Array): ArrayBuffer {
    const buf: ArrayBufferLike = bytes.buffer;
    if (buf instanceof ArrayBuffer) {
        return buf.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
    }
    const ab = new ArrayBuffer(bytes.byteLength);
    new Uint8Array(ab).set(bytes);
    return ab;
}

export function parseDataUrl(input: string): DataUrlParts | null {
    const s = (input || "").trim();
    if (!s.toLowerCase().startsWith("data:")) return null;

    const m = s.match(DATA_URL_RE);
    if (!m?.groups) return null;

    const mimeType = (m.groups.mime || DEFAULT_MIME).trim() || DEFAULT_MIME;
    const params = (m.groups.params || "").toLowerCase();
    const isBase64 = params.includes(";base64");
    const data = m.groups.data ?? "";
    return { mimeType, isBase64, data };
}

export function decodeBase64ToBytes(base64: string, options: DecodeBase64Options = {}): Uint8Array {
    const alphabet: Base64Alphabet = options.alphabet || "base64";
    const lastChunkHandling: Base64LastChunkHandling = options.lastChunkHandling || "loose";
    const s = (base64 || "").trim();

    if (canUseFromBase64()) {
        // Modern native: Uint8Array.fromBase64()
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array/fromBase64
        return (Uint8Array as any).fromBase64(s, { alphabet, lastChunkHandling });
    }

    // Fallback: atob() for base64 only.
    // For base64url, convert to base64 first.
    const normalized =
        alphabet === "base64url"
            ? s.replace(/-/g, "+").replace(/_/g, "/")
            : s;

    // pad to multiple of 4
    const padLen = (4 - (normalized.length % 4)) % 4;
    const padded = normalized + "=".repeat(padLen);

    const binary = typeof atob === "function" ? atob(padded) : "";
    const out = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
    return out;
}

export function encodeBytesToBase64(bytes: Uint8Array, options: EncodeBase64Options = {}): string {
    const alphabet: Base64Alphabet = options.alphabet || "base64";

    if (canUseToBase64(bytes)) {
        // Modern native: Uint8Array.prototype.toBase64()
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array/toBase64
        return (bytes as any).toBase64({ alphabet });
    }

    // Fallback: btoa() with chunking
    const chunkSize = 0x8000;
    let binary = "";
    for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
    }
    const b64 = typeof btoa === "function" ? btoa(binary) : "";
    if (alphabet !== "base64url") return b64;
    return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export async function blobToBytes(blob: Blob): Promise<Uint8Array> {
    const ab = await blob.arrayBuffer();
    return new Uint8Array(ab);
}

export async function blobToText(blob: Blob, encoding: "utf-8" = "utf-8"): Promise<string> {
    // Prefer native Blob.text() when available.
    if (typeof blob.text === "function") return await blob.text();
    const bytes = await blobToBytes(blob);
    const dec = new TextDecoder(encoding);
    return dec.decode(bytes);
}

export async function blobToBase64(blob: Blob, options: EncodeBase64Options = {}): Promise<string> {
    const bytes = await blobToBytes(blob);
    return encodeBytesToBase64(bytes, options);
}

export async function blobToDataUrl(blob: Blob, options: BlobToStringOptions = {}): Promise<string> {
    const mimeType = (options.mimeType || blob.type || DEFAULT_MIME).trim() || DEFAULT_MIME;
    const wantsBase64 = options.base64 ?? !isTextMime(mimeType);

    if (wantsBase64) {
        const b64 = await blobToBase64(blob, options.base64Options || {});
        return `data:${mimeType};base64,${b64}`;
    }

    const text = await blobToText(blob, options.textEncoding || "utf-8");
    const payload = options.uriComponent ? encodeURIComponent(text) : text;
    return `data:${mimeType},${payload}`;
}

export async function fileToDataUrl(file: File, options: BlobToStringOptions = {}): Promise<string> {
    return await blobToDataUrl(file, options);
}

function looksLikeBase64(s: string): { isBase64: boolean; alphabet: Base64Alphabet } {
    const t = (s || "").trim();
    if (!t) return { isBase64: false, alphabet: "base64" };

    const hasUrlAlphabet = /[-_]/.test(t) && !/[+/]/.test(t);
    const alphabet: Base64Alphabet = hasUrlAlphabet ? "base64url" : "base64";

    const normalized = alphabet === "base64url" ? t.replace(/-/g, "+").replace(/_/g, "/") : t;
    const cleaned = normalized.replace(/[\r\n\s]/g, "");
    const allowed = /^[A-Za-z0-9+/]*={0,2}$/.test(cleaned);
    if (!allowed) return { isBase64: false, alphabet };

    // Not perfect; good enough for "try base64 decode"
    if (cleaned.length < 8) return { isBase64: false, alphabet };
    return { isBase64: true, alphabet };
}

function canParseUrl(value: string): boolean {
    try {
        if (typeof URL === "undefined") return false;
        if (typeof (URL as any).canParse === "function") return (URL as any).canParse(value);
        // Fallback for environments without URL.canParse
        new URL(value);
        return true;
    } catch {
        return false;
    }
}

function extensionByMimeType(mimeType: string): string {
    const t = (mimeType || "").toLowerCase().split(";")[0].trim();
    if (!t) return "bin";

    const mapped: Record<string, string> = {
        "text/plain": "txt",
        "text/markdown": "md",
        "text/html": "html",
        "application/json": "json",
        "application/xml": "xml",
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/webp": "webp",
        "image/gif": "gif",
        "image/svg+xml": "svg",
        "application/pdf": "pdf",
    };
    if (mapped[t]) return mapped[t];

    const slashIdx = t.indexOf("/");
    if (slashIdx <= 0 || slashIdx >= t.length - 1) return "bin";
    let subtype = t.slice(slashIdx + 1);
    if (subtype.includes("+")) subtype = subtype.split("+")[0];
    if (subtype.includes(".")) subtype = subtype.split(".").pop() || subtype;
    return subtype || "bin";
}

function fallbackHashHex(bytes: Uint8Array): string {
    // Non-cryptographic fallback only for environments without SubtleCrypto.
    let h = 2166136261;
    for (let i = 0; i < bytes.length; i++) {
        h ^= bytes[i];
        h = Math.imul(h, 16777619);
    }
    return (h >>> 0).toString(16).padStart(8, "0").repeat(8);
}

async function sha256Hex(bytes: Uint8Array): Promise<string> {
    try {
        const subtle = (globalThis.crypto as Crypto | undefined)?.subtle;
        if (!subtle) return fallbackHashHex(bytes);
        const digest = await subtle.digest("SHA-256", bytes);
        const out = new Uint8Array(digest);
        return Array.from(out, (b) => b.toString(16).padStart(2, "0")).join("");
    } catch {
        return fallbackHashHex(bytes);
    }
}

export function isBase64Like(input: string): boolean {
    return looksLikeBase64(input).isBase64;
}

export async function normalizeDataAsset(input: DataAssetInput, options: NormalizeDataAssetOptions = {}): Promise<DataAsset> {
    const maxBytes = options.maxBytes ?? 50 * 1024 * 1024;
    const namePrefix = (options.namePrefix || "asset").trim() || "asset";
    const preserveFileName = options.preserveFileName ?? false;

    let source: DataAssetSource = "text";
    let blob: Blob;
    let incomingFile: File | null = null;

    if (input instanceof File) {
        source = "file";
        incomingFile = input;
        blob = options.mimeType && options.mimeType !== input.type
            ? new Blob([await input.arrayBuffer()], { type: options.mimeType })
            : input;
    } else if (input instanceof Blob) {
        source = "blob";
        blob = options.mimeType && options.mimeType !== input.type
            ? new Blob([await input.arrayBuffer()], { type: options.mimeType })
            : input;
    } else {
        const raw = (input instanceof URL ? input.toString() : String(input ?? "")).trim();
        const parsed = parseDataUrl(raw);
        const decodedUri = options.uriComponent ? tryDecodeURIComponent(raw) : (likelyUriComponent(raw) ? tryDecodeURIComponent(raw) : raw);

        if (parsed) {
            source = "data-url";
        } else if (canParseUrl(raw)) {
            source = "url";
        } else if (isBase64Like(raw)) {
            source = "base64";
        } else if (decodedUri !== raw && (parseDataUrl(decodedUri) || isBase64Like(decodedUri) || canParseUrl(decodedUri))) {
            source = "uri";
        } else {
            source = "text";
        }

        const stringSource = source === "uri" ? decodedUri : raw;
        blob = await stringToBlob(stringSource, {
            mimeType: options.mimeType,
            uriComponent: options.uriComponent,
            isBase64: source === "base64" ? true : undefined,
            maxBytes,
        });
    }

    const bytes = await blobToBytes(blob);
    if (bytes.byteLength > maxBytes) throw new Error(`Data too large: ${bytes.byteLength} bytes`);

    const hash = await sha256Hex(bytes);
    const mimeType = (options.mimeType || blob.type || DEFAULT_MIME).trim() || DEFAULT_MIME;
    const extension = extensionByMimeType(mimeType);
    const hashedName = options.filename || `${namePrefix}-${hash.slice(0, 16)}.${extension}`;
    const finalName = preserveFileName && incomingFile?.name ? incomingFile.name : hashedName;

    const file = incomingFile && preserveFileName && !options.mimeType
        ? incomingFile
        : new File([blob], finalName, { type: mimeType });

    return {
        hash,
        name: file.name,
        type: file.type || mimeType,
        size: file.size,
        source,
        file,
    };
}

export async function stringToBlobOrFile(input: string, options: StringToBinaryOptions = {}): Promise<Blob | File> {
    const maxBytes = options.maxBytes ?? 50 * 1024 * 1024;
    const raw = (input ?? "").trim();

    const parsedDataUrl = parseDataUrl(raw);
    if (parsedDataUrl) {
        const mimeType = options.mimeType || parsedDataUrl.mimeType || DEFAULT_MIME;
        const payload = options.uriComponent ? tryDecodeURIComponent(parsedDataUrl.data) : (likelyUriComponent(parsedDataUrl.data) ? tryDecodeURIComponent(parsedDataUrl.data) : parsedDataUrl.data);
        const isBase64 = options.isBase64 ?? parsedDataUrl.isBase64;

        if (isBase64) {
            const bytes = decodeBase64ToBytes(payload, {
                alphabet: options.base64?.alphabet || "base64",
                lastChunkHandling: options.base64?.lastChunkHandling || "loose",
            });
            if (bytes.byteLength > maxBytes) throw new Error(`Decoded data too large: ${bytes.byteLength} bytes`);
            const blob = new Blob([bytesToArrayBuffer(bytes)], { type: mimeType });
            if (!options.asFile) return blob;
            return new File([blob], options.filename || "file", { type: mimeType });
        }

        // Non-base64 data URL: treat as URL-encoded bytes/string. We keep it as UTF-8 text by default.
        const blob = new Blob([payload], { type: mimeType });
        if (!options.asFile) return blob;
        return new File([blob], options.filename || "file", { type: mimeType });
    }

    // If it's a normal URL, fetch it.
    try {
        if (typeof URL !== "undefined" && (URL as any).canParse?.(raw)) {
            const res = await fetch(raw);
            const blob = await res.blob();
            const mimeType = options.mimeType || blob.type || DEFAULT_MIME;
            const typed = blob.type === mimeType ? blob : new Blob([await blob.arrayBuffer()], { type: mimeType });
            if (!options.asFile) return typed;
            return new File([typed], options.filename || "file", { type: mimeType });
        }
    } catch {
        // fall through to treat as plain string / base64
    }

    // Plain string case: base64 bytes OR text.
    const maybeDecoded = options.uriComponent ? tryDecodeURIComponent(raw) : (likelyUriComponent(raw) ? tryDecodeURIComponent(raw) : raw);
    const base64Hint = looksLikeBase64(maybeDecoded);
    const isBase64 = options.isBase64 ?? base64Hint.isBase64;
    const mimeType = options.mimeType || (isBase64 ? DEFAULT_MIME : "text/plain;charset=utf-8");

    if (isBase64) {
        const bytes = decodeBase64ToBytes(maybeDecoded, {
            alphabet: options.base64?.alphabet || base64Hint.alphabet,
            lastChunkHandling: options.base64?.lastChunkHandling || "loose",
        });
        if (bytes.byteLength > maxBytes) throw new Error(`Decoded data too large: ${bytes.byteLength} bytes`);
        const blob = new Blob([bytesToArrayBuffer(bytes)], { type: mimeType });
        if (!options.asFile) return blob;
        return new File([blob], options.filename || "file", { type: mimeType });
    }

    const blob = new Blob([maybeDecoded], { type: mimeType });
    if (!options.asFile) return blob;
    return new File([blob], options.filename || "file", { type: mimeType });
}

export async function stringToBlob(input: string, options: Omit<StringToBinaryOptions, "asFile" | "filename"> = {}): Promise<Blob> {
    return (await stringToBlobOrFile(input, { ...options, asFile: false })) as Blob;
}

export async function stringToFile(input: string, filename: string, options: Omit<StringToBinaryOptions, "asFile" | "filename"> = {}): Promise<File> {
    return (await stringToBlobOrFile(input, { ...options, asFile: true, filename })) as File;
}

