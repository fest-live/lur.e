/*
 * Filename: markdown-assets.ts
 * FullPath: modules/projects/lur.e/src/utils/opfs/markdown-assets.ts
 * FIND:markdown-assets
 * Change date and time: 15.25.00_24.08.2026
 * Reason for changes: Bind a folder next to a launched/shared markdown so relative assets resolve.
 *
 * WHY: Launch Queue / Share Target give a File (or file handle) without a parent directory.
 * INVARIANT: showDirectoryPicker needs a user gesture; AbortError is cancel, not failure.
 * COMPAT: FileSystemObserver is Chromium-experimental; callers must tolerate null.
 */

import { registerDirectoryRoot, walkExactFile, provide, normalizePath, getDir, isVirtualFsPath } from "./OPFS";

/** True for `./assets/x`, `docs/a.md` — not http(s)/blob/data/#. */
export const isMarkdownRelativeRef = (value: string): boolean => {
    const raw = String(value || "").trim();
    return Boolean(raw) && !/^(?:[a-zA-Z][a-zA-Z\d+\-.]*:|\/\/|#|data:|blob:)/.test(raw);
};

/** Keep the markdown-relative token (`./assets/x.png`) even after the browser resolved it to the PWA origin. */
export const originalRelFromRef = (value: string): string => {
    const raw = String(value || "").trim();
    if (!raw || raw.startsWith("#") || raw.startsWith("blob:") || raw.startsWith("data:")) return "";
    if (isMarkdownRelativeRef(raw)) return raw;
    try {
        const url = new URL(raw, globalThis.location?.href || "http://localhost/");
        if (globalThis.location?.origin && url.origin === globalThis.location.origin) {
            return url.pathname.replace(/^\/+/, "");
        }
    } catch { /* not a URL */ }
    return "";
};

/**
 * Main-thread `provide()` of a bound relative path (`/mounts/md-xxx/` + `./assets/logo.png`).
 * WHY: skips OPFS worker + HTTP fetch (JXL hooks those). Mapped `/mounts/` uses `walkExactFile`.
 */
export const provideBoundRelative = async (
    mountRoot: string | null | undefined,
    originalRel: string,
    sourceUrl?: string | null
): Promise<File | null> => {
    const rel = originalRelFromRef(originalRel) || String(originalRel || "").trim();
    if (!rel) return null;
    const bases: string[] = [];
    if (sourceUrl && isVirtualFsPath(sourceUrl)) bases.push(getDir(sourceUrl));
    if (mountRoot) bases.push(mountRoot);
    const seen = new Set<string>();
    for (const base of bases) {
        for (const candidate of relPathCandidates(rel)) {
            const path = normalizePath(base, candidate);
            if (!path || seen.has(path)) continue;
            seen.add(path);
            const file = await provide(path).catch(() => null);
            if (file) return file;
        }
    }
    return null;
};

/** `assets/logo/x.png` → also `logo/x.png`, `x.png` (picker was `assets/` or `logo/`). */
export const relPathCandidates = (rel: string): string[] => {
    const clean = String(rel || "").trim().replace(/^\.\//, "").replace(/^\/+/, "");
    if (!clean || /^(?:[a-zA-Z][a-zA-Z\d+\-.]*:|\/\/)/.test(clean)) return [];
    const parts = clean.split(/[\\/]/).filter(Boolean);
    return parts.map((_, i) => parts.slice(i).join("/"));
};

const findFileByBasename = async (
    dir: FileSystemDirectoryHandle,
    basename: string,
    depth = 5
): Promise<File | null> => {
    try {
        return await (await dir.getFileHandle(basename, { create: false })).getFile();
    } catch { /* walk children */ }
    if (depth <= 0) return null;
    for await (const [, handle] of dir.entries()) {
        if (handle.kind !== "directory") continue;
        const found = await findFileByBasename(handle, basename, depth - 1);
        if (found) return found;
    }
    return null;
};

export type IndexedDirFile = { rel: string; file: File };

/** Walk a picked folder so the viewer can resolve `./assets/…` by relative path or basename. */
export const indexDirectoryFiles = async (
    dir: FileSystemDirectoryHandle,
    prefix = "",
    depth = 8,
    acc: IndexedDirFile[] = []
): Promise<IndexedDirFile[]> => {
    if (depth < 0) return acc;
    for await (const [name, handle] of dir.entries()) {
        const rel = prefix ? `${prefix}/${name}` : name;
        if (handle.kind === "file") {
            try {
                acc.push({ rel, file: await handle.getFile() });
            } catch { /* skip unreadable */ }
        } else if (handle.kind === "directory") {
            await indexDirectoryFiles(handle, rel, depth - 1, acc);
        }
    }
    return acc;
};

/** Read a markdown-relative file from a picked directory (any ancestor of the file). */
export const resolveFileUnderDirectory = async (
    dir: FileSystemDirectoryHandle | null | undefined,
    rel: string
): Promise<File | null> => {
    if (!dir) return null;
    const candidates = relPathCandidates(rel);
    for (const candidate of candidates) {
        const handle = await walkExactFile(dir, candidate);
        if (!handle) continue;
        try {
            return await handle.getFile();
        } catch { /* next suffix */ }
    }
    const base = candidates.at(-1);
    if (!base || base.includes("/")) return null;
    return findFileByBasename(dir, base);
};

export type AssetDirectoryPickOptions = {
    startIn?: FileSystemHandle;
    id?: string;
    mode?: "read" | "readwrite";
};

/** Chromium File System Access — pick the folder that holds images / includes. */
export const pickAssetDirectory = async (
    options: AssetDirectoryPickOptions = {}
): Promise<FileSystemDirectoryHandle | null> => {
    const pick = (
        globalThis as {
            showDirectoryPicker?: (opts?: {
                mode?: string;
                id?: string;
                startIn?: FileSystemHandle;
            }) => Promise<FileSystemDirectoryHandle>;
        }
    ).showDirectoryPicker;
    if (typeof pick !== "function") return null;
    try {
        return await pick({
            mode: options.mode || "read",
            id: options.id || "markdown-assets",
            startIn: options.startIn
        });
    } catch (error) {
        if ((error as DOMException)?.name === "AbortError") return null;
        console.warn("[markdown-assets] showDirectoryPicker failed", error);
        return null;
    }
};

/** Watch a handle with experimental FileSystemObserver. */
export const observeFileSystemHandle = (
    handle: FileSystemHandle,
    onRecords: (records: unknown[]) => void
): { disconnect: () => void } | null => {
    const Ctor = (
        globalThis as {
            FileSystemObserver?: new (
                cb: (records: unknown[]) => void
            ) => { observe: (h: FileSystemHandle) => Promise<void> | void; disconnect: () => void };
        }
    ).FileSystemObserver;
    if (typeof Ctor !== "function" || !handle) return null;
    try {
        const observer = new Ctor((records) => onRecords(records));
        const obs = observer as { observe: (h: FileSystemHandle, opts?: { recursive?: boolean }) => Promise<void> | void };
        // WHY: without `{ recursive: true }` nested `assets/logo/x.png` writes never notify.
        Promise.resolve(obs.observe(handle, { recursive: true }))
            .catch(() => Promise.resolve(obs.observe(handle)))
            .catch(() => { /* optional watch */ });
        return { disconnect: () => observer.disconnect?.() };
    } catch {
        return null;
    }
};

/** Map a picked directory to `/mounts/<id>/` for `provide()` + relative markdown URLs. */
export const mountPickedDirectory = (
    dir: FileSystemDirectoryHandle,
    prefix = "md"
): string => {
    const root = `/mounts/${prefix}-${Date.now().toString(36)}/`;
    registerDirectoryRoot(root, dir);
    return root;
};

/** Walk a directory tree for the relative path of a file handle. */
export const findEntryRelPath = async (
    dir: FileSystemDirectoryHandle,
    target: FileSystemFileHandle
): Promise<string | null> => {
    for await (const [name, handle] of dir.entries()) {
        if (handle.kind === "file") {
            try {
                if (await handle.isSameEntry(target)) return name;
            } catch {
                /* different backends */
            }
        } else if (handle.kind === "directory") {
            const inner = await findEntryRelPath(handle, target);
            if (inner) return `${name}/${inner}`;
        }
    }
    return null;
};

const ABSOLUTE_OR_EMBEDDED =
    /^(?:[a-zA-Z][a-zA-Z\d+\-.]*:|\/\/|#|data:|blob:)/;

/** Relative `![](…)` / `src` / `href` refs that need a sibling folder or sidecar files. */
export const collectRelativeMarkdownAssetRefs = (markdown: string): string[] => {
    const refs = new Set<string>();
    const md = String(markdown || "");
    const patterns = [
        /!\[[^\]]*\]\(\s*<?([^)\s>]+)>?/g,
        /\b(?:src|href)=["']([^"']+)["']/gi
    ];
    for (const re of patterns) {
        re.lastIndex = 0;
        let match: RegExpExecArray | null = re.exec(md);
        while (match) {
            const raw = String(match[1] || "").trim();
            if (raw && !ABSOLUTE_OR_EMBEDDED.test(raw)) {
                refs.add(raw.replace(/^\.\//, ""));
            }
            match = re.exec(md);
        }
    }
    return [...refs];
};

const basenameOf = (value: string): string =>
    String(value || "").split(/[\\/]/).pop() || String(value || "");

/** True when the markdown points at local assets that are not already in the transfer. */
export const markdownNeedsBoundDirectory = (
    markdown: string,
    sidecarNames: string[] = []
): boolean => {
    const refs = collectRelativeMarkdownAssetRefs(markdown);
    if (!refs.length) return false;
    const names = new Set(
        sidecarNames.map((name) => basenameOf(name).toLowerCase()).filter(Boolean)
    );
    return refs.some((ref) => !names.has(basenameOf(ref).toLowerCase()));
};

export type BoundLaunchAssets = {
    root: string;
    virtualPath: string;
};

/**
 * Offer `showDirectoryPicker` (same user-activation as Launch Queue when possible).
 * Cancel / missing API → null; caller continues with the File body alone.
 */
export const bindDirectoryForLaunchedFiles = async (options: {
    startIn?: FileSystemHandle;
    files: File[];
    markdownText?: string;
    filename?: string;
}): Promise<BoundLaunchAssets | null> => {
    const files = Array.isArray(options.files) ? options.files : [];
    const mdName = String(options.filename || "").trim();
    const mdFile =
        (mdName && files.find((file) => file.name === mdName)) ||
        files.find((file) => /\.(?:md|markdown|mdown|mkd|mkdn|mdtxt|mdtext)$/i.test(file.name)) ||
        files[0];
    let text = String(options.markdownText || "");
    if (!text && mdFile) {
        try {
            text = await mdFile.text();
        } catch {
            text = "";
        }
    }
    const sidecars = files.filter((file) => file !== mdFile).map((file) => file.name);
    if (!markdownNeedsBoundDirectory(text, sidecars)) return null;

    const dir = await pickAssetDirectory({
        startIn: options.startIn,
        id: "markdown-assets",
        mode: "read"
    });
    if (!dir) return null;

    const root = mountPickedDirectory(dir, "md");
    let rel = mdFile?.name || mdName || "document.md";
    const start = options.startIn;
    if (start && start.kind === "file") {
        const found = await findEntryRelPath(dir, start as FileSystemFileHandle);
        if (found) rel = found;
    }
    return { root, virtualPath: `${root}${rel}` };
};

const MARKDOWN_INPUT_ACCEPT =
    ".md,.markdown,.mdown,.mkd,.mkdn,.mdtxt,.mdtext,.txt,text/markdown,text/plain";

const pickFilesViaInput = (options: {
    accept?: string;
    multiple?: boolean;
    directory?: boolean;
}): Promise<File[]> =>
    new Promise((resolve) => {
        const input = document.createElement("input");
        input.type = "file";
        if (options.accept) input.accept = options.accept;
        if (options.multiple) input.multiple = true;
        if (options.directory) {
            input.setAttribute("webkitdirectory", "");
            input.setAttribute("directory", "");
            input.multiple = true;
        }
        const finish = (files: File[]) => resolve(files);
        input.addEventListener("change", () => finish(Array.from(input.files || [])), { once: true });
        input.addEventListener("cancel", () => finish([]), { once: true });
        input.click();
    });

export type PickedMarkdownFile = {
    file: File;
    sidecars: File[];
    directory?: FileSystemDirectoryHandle | null;
    virtualPath?: string | null;
};

/** FSA when present; Capacitor / CRX / Firefox fall back to `<input type=file>`. */
export const pickMarkdownFile = async (): Promise<PickedMarkdownFile | null> => {
    const pickFile = (
        globalThis as {
            showOpenFilePicker?: (opts?: Record<string, unknown>) => Promise<FileSystemFileHandle[]>;
        }
    ).showOpenFilePicker;
    if (typeof pickFile === "function") {
        try {
            const [handle] = await pickFile({
                multiple: false,
                types: [{
                    description: "Markdown",
                    accept: {
                        "text/markdown": [".md", ".markdown", ".mdown", ".mkd"],
                        "text/plain": [".txt"]
                    }
                }]
            });
            if (!handle) return null;
            return { file: await handle.getFile(), sidecars: [] };
        } catch (error) {
            if ((error as DOMException)?.name === "AbortError") return null;
        }
    }
    const files = await pickFilesViaInput({ accept: MARKDOWN_INPUT_ACCEPT });
    return files[0] ? { file: files[0], sidecars: [] } : null;
};

/**
 * Folder of images / includes. Chromium FSA first; otherwise `webkitdirectory`
 * (Capacitor WebView + CRX) so relative `![](./assets/…)` can resolve from sidecars.
 */
export const pickSidecarDirectoryFiles = async (): Promise<{
    files: File[];
    directory: FileSystemDirectoryHandle | null;
    root: string | null;
}> => {
    const dir = await pickAssetDirectory({ id: "markdown-assets", mode: "read" });
    if (dir) {
        const indexed = await indexDirectoryFiles(dir);
        const files = indexed.map((row) => {
            try {
                Object.defineProperty(row.file, "webkitRelativePath", { value: row.rel });
            } catch {
                /* immutable File */
            }
            return row.file;
        });
        return { files, directory: dir, root: mountPickedDirectory(dir, "md") };
    }
    const files = await pickFilesViaInput({ directory: true });
    return { files, directory: null, root: null };
};

export type MarkdownSaveResult = "saved" | "downloaded" | "shared" | "cancelled" | "failed";

/** PWA FSA → CRX `chrome.downloads` → Web Share (Capacitor) → `<a download>`. */
export const saveMarkdownBlob = async (
    content: string,
    filename: string
): Promise<MarkdownSaveResult> => {
    const name = String(filename || "document.md").trim() || "document.md";
    const savePicker = (
        globalThis as {
            showSaveFilePicker?: (opts?: Record<string, unknown>) => Promise<{
                createWritable: () => Promise<{ write: (data: string) => Promise<void>; close: () => Promise<void> }>;
            }>;
        }
    ).showSaveFilePicker;
    if (typeof savePicker === "function") {
        try {
            const handle = await savePicker({
                suggestedName: name,
                types: [{
                    description: "Markdown files",
                    accept: { "text/markdown": [".md", ".markdown"] }
                }]
            });
            const writable = await handle.createWritable();
            await writable.write(content);
            await writable.close();
            return "saved";
        } catch (error) {
            if ((error as DOMException)?.name === "AbortError") return "cancelled";
        }
    }

    const chromeDl = (globalThis as { chrome?: { downloads?: { download?: (opts: Record<string, unknown>) => Promise<number> } } })
        .chrome?.downloads?.download;
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    if (typeof chromeDl === "function") {
        const url = URL.createObjectURL(blob);
        try {
            await chromeDl({ url, filename: name, saveAs: true });
            return "downloaded";
        } catch {
            URL.revokeObjectURL(url);
        }
    }

    const file = new File([blob], name, { type: "text/markdown" });
    const nav = navigator as Navigator & {
        canShare?: (data: { files?: File[] }) => boolean;
        share?: (data: { files?: File[]; title?: string }) => Promise<void>;
    };
    if (typeof nav.share === "function" && (!nav.canShare || nav.canShare({ files: [file] }))) {
        try {
            await nav.share({ files: [file], title: name });
            return "shared";
        } catch (error) {
            if ((error as DOMException)?.name === "AbortError") return "cancelled";
        }
    }

    try {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = name;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 250);
        return "downloaded";
    } catch {
        return "failed";
    }
};
