/**
 * File Utilities
 *
 * Common file handling utilities used across views.
 */

import { downloadFile } from "./OPFS";

// ============================================================================
// FILE TYPE DETECTION
// ============================================================================

/**
 * Check if a file is a markdown file
 */
export function isMarkdownFile(file: File | string): boolean {
    const name = typeof file === "string" ? file : file.name;
    const type = typeof file === "string" ? "" : file.type;

    const mdExtensions = /\.(md|markdown|mdown|mkd|mkdn|mdtxt|mdtext)$/i;
    return mdExtensions.test(name) || type === "text/markdown";
}

/**
 * Check if a file is a text file
 */
export function isTextFile(file: File | string): boolean {
    const name = typeof file === "string" ? file : file.name;
    const type = typeof file === "string" ? "" : file.type;

    if (type.startsWith("text/")) return true;

    const textExtensions = /\.(txt|text|log|json|xml|yaml|yml|toml|ini|cfg|conf)$/i;
    return textExtensions.test(name);
}

/**
 * Check if a file is an image
 */
export function isImageFile(file: File | string): boolean {
    const name = typeof file === "string" ? file : file.name;
    const type = typeof file === "string" ? "" : file.type;

    if (type.startsWith("image/")) return true;

    const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico|avif)$/i;
    return imageExtensions.test(name);
}

/**
 * Check if a file is a code file
 */
export function isCodeFile(file: File | string): boolean {
    const name = typeof file === "string" ? file : file.name;

    const codeExtensions = /\.(js|ts|jsx|tsx|py|rb|go|rs|c|cpp|h|hpp|java|kt|swift|php|cs|css|scss|sass|less|html|vue|svelte)$/i;
    return codeExtensions.test(name);
}

// ============================================================================
// FILE READING
// ============================================================================

/**
 * Read a file as text
 */
export async function readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsText(file);
    });
}

/**
 * Read a file as data URL
 */
export async function readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
    });
}

/**
 * Read a file as array buffer
 */
export async function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as ArrayBuffer);
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsArrayBuffer(file);
    });
}

// ============================================================================
// FILE CREATION
// ============================================================================

/**
 * Create a text file
 */
export function createTextFile(content: string, filename: string, mimeType = "text/plain"): File {
    return new File([content], filename, { type: mimeType });
}

/**
 * Create a markdown file
 */
export function createMarkdownFile(content: string, filename = "document.md"): File {
    return new File([content], filename, { type: "text/markdown" });
}

/**
 * Create a JSON file
 */
export function createJsonFile(data: unknown, filename = "data.json"): File {
    const content = JSON.stringify(data, null, 2);
    return new File([content], filename, { type: "application/json" });
}

// ============================================================================
// FILE DOWNLOAD
// ============================================================================

/**
 * Trigger a file download
 */
/*export function downloadFile(file: File | Blob, filename?: string): void {
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || (file instanceof File ? file.name : "download");
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 250);
}*/

/**
 * Download text content as a file
 */
export function downloadTextFile(content: string, filename: string, mimeType = "text/plain"): void {
    const blob = new Blob([content], { type: mimeType });
    downloadFile(blob, filename);
}

/**
 * Download markdown content
 */
export function downloadMarkdown(content: string, filename = "document.md"): void {
    downloadTextFile(content, filename, "text/markdown");
}

// ============================================================================
// FILE PICKING
// ============================================================================

/**
 * Open a file picker dialog
 */
export async function pickFile(accept = "*"): Promise<File | null> {
    return new Promise((resolve) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = accept;
        input.onchange = () => {
            resolve(input.files?.[0] || null);
        };
        input.oncancel = () => resolve(null);
        input.click();
    });
}

/**
 * Open a file picker for multiple files
 */
export async function pickFiles(accept = "*"): Promise<File[]> {
    return new Promise((resolve) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = accept;
        input.multiple = true;
        input.onchange = () => {
            resolve(Array.from(input.files || []));
        };
        input.oncancel = () => resolve([]);
        input.click();
    });
}

/**
 * Open a markdown file picker
 */
export async function pickMarkdownFile(): Promise<File | null> {
    return pickFile(".md,.markdown,.txt,text/markdown,text/plain");
}

// ============================================================================
// FILE SYSTEM ACCESS API
// ============================================================================

/**
 * Save file using File System Access API (with fallback)
 */
export async function saveFile(
    content: string,
    suggestedName = "document.md",
    types = [{ description: "Markdown", accept: { "text/markdown": [".md"] } }]
): Promise<boolean> {
    try {
        if ("showSaveFilePicker" in window) {
            const handle = await (window as any).showSaveFilePicker({
                suggestedName,
                types
            });
            const writable = await handle.createWritable();
            await writable.write(content);
            await writable.close();
            return true;
        }
    } catch (error) {
        if ((error as Error).name === "AbortError") {
            return false;
        }
    }

    // Fallback to download
    downloadTextFile(content, suggestedName);
    return true;
}

/**
 * Open file using File System Access API (with fallback)
 */
export async function openFile(
    types = [{ description: "Markdown", accept: { "text/markdown": [".md", ".markdown"] } }]
): Promise<{ content: string; filename: string } | null> {
    try {
        if ("showOpenFilePicker" in window) {
            const [handle] = await (window as any).showOpenFilePicker({ types });
            const file = await handle.getFile();
            const content = await file.text();
            return { content, filename: file.name };
        }
    } catch (error) {
        if ((error as Error).name === "AbortError") {
            return null;
        }
    }

    // Fallback to file input
    const file = await pickFile();
    if (!file) return null;

    const content = await readFileAsText(file);
    return { content, filename: file.name };
}
