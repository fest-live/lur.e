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

import { registerDirectoryRoot } from "./OPFS";

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
        void observer.observe(handle);
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
