export interface FileHandlingOptions {
    onFilesAdded: (files: File[]) => void | Promise<void>;
    onError?: (error: string) => void;
    onProgress?: (file: File, loaded: number, total: number) => void;
}

export class FileHandler {
    private options: FileHandlingOptions;
    private dragOverElements: Set<HTMLElement> = new Set();

    constructor(options: FileHandlingOptions) {
        this.options = { ...options }; // Clone to avoid mutations
    }

    /**
     * Programmatically add files into the same pipeline as UI selection / DnD / paste.
     * Used by PWA share-target and launchQueue ingestion.
     */
    addFiles(files: File[]): void | Promise<void> {
        if (!Array.isArray(files) || files.length === 0) return;
        return this.options.onFilesAdded(files);
    }

    /**
     * Set up file input element with file selection
     */
    setupFileInput(container: HTMLElement, accept: string = "*"): HTMLInputElement {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.multiple = true;
        fileInput.accept = accept;
        fileInput.style.display = 'none';

        fileInput.addEventListener('change', (e) => {
            const files = Array.from((e.target as HTMLInputElement).files || []);
            if (files.length > 0) {
                this.options.onFilesAdded(files);
            }
            // Reset input value to allow selecting the same file again
            fileInput.value = '';
        });

        container.append(fileInput);
        return fileInput;
    }

    /**
     * Set up drag and drop handling for an element
     */
    setupDragAndDrop(element: HTMLElement): void {
        element.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.addDragOver(element);
        });

        element.addEventListener('dragleave', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.removeDragOver(element);
        });

        element.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.removeDragOver(element);

            const files = Array.from(e.dataTransfer?.files || []);
            if (files.length > 0) {
                this.options.onFilesAdded(files);
            }
        });
    }

    /**
     * Set up paste handling for an element
     */
    setupPasteHandling(element: HTMLElement): void {
        element.addEventListener('paste', (e) => {
            const files = Array.from(e.clipboardData?.files || []);
            if (files.length > 0) {
                e.preventDefault();
                this.options.onFilesAdded(files);
            }
        });
    }

    /**
     * Set up all file handling for a container (file input button, drag & drop, paste)
     */
    setupCompleteFileHandling(
        container: HTMLElement,
        fileSelectButton: HTMLElement,
        dropZone?: HTMLElement,
        accept: string = "*"
    ): void {
        // Setup file input
        const fileInput = this.setupFileInput(container, accept);

        // Connect file select button
        fileSelectButton.addEventListener('click', () => {
            fileInput.click();
        });

        // Setup drag and drop if drop zone provided
        if (dropZone) {
            this.setupDragAndDrop(dropZone);
        }

        // Setup paste handling
        this.setupPasteHandling(container);
    }

    /**
     * Validate file types and sizes
     */
    validateFiles(files: File[], options: {
        maxSize?: number; // in bytes
        allowedTypes?: string[];
        maxFiles?: number;
    } = {}): { valid: File[], invalid: { file: File, reason: string }[] } {
        const { maxSize, allowedTypes, maxFiles } = options;
        const valid: File[] = [];
        const invalid: { file: File, reason: string }[] = [];

        // Check max files limit
        if (maxFiles && files.length > maxFiles) {
            invalid.push(...files.slice(maxFiles).map(file => ({
                file,
                reason: `Too many files. Maximum ${maxFiles} files allowed.`
            })));
            files = files.slice(0, maxFiles);
        }

        for (const file of files) {
            let isValid = true;
            let reason = '';

            // Check file size
            if (maxSize && file.size > maxSize) {
                isValid = false;
                reason = `File too large. Maximum size is ${this.formatFileSize(maxSize)}.`;
            }

            // Check file type
            if (allowedTypes && allowedTypes.length > 0) {
                const isAllowed = allowedTypes.some(type => {
                    if (type.includes('*')) {
                        // Wildcard matching (e.g., "image/*")
                        return file.type.startsWith(type.replace('/*', '/'));
                    }
                    return file.type === type;
                });

                if (!isAllowed) {
                    isValid = false;
                    reason = reason || `File type not allowed. Allowed types: ${allowedTypes.join(', ')}.`;
                }
            }

            if (isValid) {
                valid.push(file);
            } else {
                invalid.push({ file, reason });
            }
        }

        return { valid, invalid };
    }

    /**
     * Read file content as text
     */
    async readFileAsText(file: File, onProgress?: (loaded: number, total: number) => void): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
            if (onProgress) {
                reader.onprogress = (e) => {
                    if (e.lengthComputable) {
                        onProgress(e.loaded, e.total);
                    }
                };
            }
            reader.readAsText(file);
        });
    }

    /**
     * Read file content as ArrayBuffer
     */
    async readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as ArrayBuffer);
            reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
            reader.readAsArrayBuffer(file);
        });
    }

    /**
     * Read file content as Data URL
     */
    async readFileAsDataURL(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
            reader.readAsDataURL(file);
        });
    }

    /**
     * Read multiple files as text
     */
    async readFilesAsText(
        files: File[],
        onProgress?: (file: File, loaded: number, total: number) => void
    ): Promise<{ file: File, content: string }[]> {
        const results: { file: File, content: string }[] = [];

        for (const file of files) {
            try {
                const content = await this.readFileAsText(file, (loaded, total) => {
                    onProgress?.(file, loaded, total);
                });
                results.push({ file, content });
            } catch (error) {
                console.warn(`Failed to read file ${file.name}:`, error);
                // Continue with other files
            }
        }

        return results;
    }

    /**
     * Get file icon based on MIME type
     */
    getFileIcon(mimeType: string): string {
        if (mimeType.startsWith('image/')) return '🖼️';
        if (mimeType === 'application/pdf') return '📄';
        if (mimeType.includes('json')) return '📋';
        if (mimeType.includes('text') || mimeType.includes('markdown')) return '📝';
        if (mimeType.includes('javascript') || mimeType.includes('typescript')) return '📜';
        if (mimeType.includes('css')) return '🎨';
        if (mimeType.includes('html')) return '🌐';
        if (mimeType.startsWith('video/')) return '🎥';
        if (mimeType.startsWith('audio/')) return '🎵';
        if (mimeType.includes('zip') || mimeType.includes('rar')) return '📦';
        return '📄';
    }

    /**
     * Format file size for display
     */
    formatFileSize(bytes: number): string {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
        return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
    }

    /**
     * Check if a file is likely a markdown file
     */
    isMarkdownFile(file: File): boolean {
        const name = file.name.toLowerCase();
        const type = file.type.toLowerCase();

        return name.endsWith('.md') ||
            name.endsWith('.markdown') ||
            name.endsWith('.mdown') ||
            name.endsWith('.mkd') ||
            name.endsWith('.mkdn') ||
            name.endsWith('.mdtxt') ||
            name.endsWith('.mdtext') ||
            type.includes('markdown') ||
            type.includes('text');
    }

    /**
     * Check if a file is an image
     */
    isImageFile(file: File): boolean {
        return file.type.startsWith('image/');
    }

    /**
     * Check if a file is a text file
     */
    isTextFile(file: File): boolean {
        return file.type.startsWith('text/') ||
            this.isMarkdownFile(file) ||
            file.type.includes('javascript') ||
            file.type.includes('typescript') ||
            file.type.includes('css') ||
            file.type.includes('html') ||
            file.type.includes('json') ||
            file.type.includes('xml');
    }

    /**
     * Check if a file is a binary file
     */
    isBinaryFile(file: File): boolean {
        return !this.isTextFile(file) && !this.isImageFile(file);
    }

    /**
     * Get file metadata
     */
    getFileMetadata(file: File): {
        name: string;
        extension: string;
        size: number;
        type: string;
        lastModified: number;
        isText: boolean;
        isImage: boolean;
        isBinary: boolean;
        formattedSize: string;
        icon: string;
    } {
        const extension = file.name.split('.').pop()?.toLowerCase() || '';
        const isText = this.isTextFile(file);
        const isImage = this.isImageFile(file);
        const isBinary = this.isBinaryFile(file);

        return {
            name: file.name,
            extension,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
            isText,
            isImage,
            isBinary,
            formattedSize: this.formatFileSize(file.size),
            icon: this.getFileIcon(file.type)
        };
    }

    /**
     * Get files metadata for multiple files
     */
    getFilesMetadata(files: File[]): Array<ReturnType<FileHandler['getFileMetadata']>> {
        return files.map(file => this.getFileMetadata(file));
    }

    private addDragOver(element: HTMLElement): void {
        if (!this.dragOverElements.has(element)) {
            this.dragOverElements.add(element);
            element.classList.add('drag-over');
        }
    }

    private removeDragOver(element: HTMLElement): void {
        if (this.dragOverElements.has(element)) {
            this.dragOverElements.delete(element);
            element.classList.remove('drag-over');
        }
    }

    /**
     * Manually trigger file processing with the provided files
     */
    processFiles(files: File[]): void {
        this.options.onFilesAdded(files);
    }

    /**
     * Create a downloadable file from content
     */
    createDownloadableFile(content: string | Blob | ArrayBuffer, filename: string, mimeType?: string): void {
        let blob: Blob;

        if (content instanceof Blob) {
            blob = content;
        } else if (content instanceof ArrayBuffer) {
            blob = new Blob([content], { type: mimeType || 'application/octet-stream' });
        } else {
            blob = new Blob([content], { type: mimeType || 'text/plain;charset=utf-8' });
        }

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.display = 'none';

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Clean up the URL object
        setTimeout(() => URL.revokeObjectURL(url), 100);
    }

    /**
     * Create a shareable file URL
     */
    createFileURL(file: File): string {
        return URL.createObjectURL(file);
    }

    /**
     * Revoke a file URL to free memory
     */
    revokeFileURL(url: string): void {
        URL.revokeObjectURL(url);
    }

    /**
     * Clean up event listeners and references
     */
    destroy(): void {
        this.dragOverElements.clear();
    }
}

/**
 * Utility function to create a file handler with default options
 */
export function createFileHandler(options: FileHandlingOptions): FileHandler {
    return new FileHandler(options);
}

/**
 * Utility function to read markdown file from URL
 */
export async function readMarkdownFromUrl(url: string): Promise<string | null> {
    try {
        const response = await fetch(url, { credentials: 'include', cache: 'no-store' });
        if (!response.ok) return null;

        const contentType = response.headers.get('content-type') || '';
        if (!contentType.includes('text') && !contentType.includes('markdown')) {
            return null;
        }

        return await response.text();
    } catch {
        return null;
    }
}

/**
 * Extract text from DataTransfer (for paste/drop operations)
 */
export async function extractTextFromDataTransfer(dt: DataTransfer): Promise<string | null> {
    try {
        const uriList = dt.getData("text/uri-list");
        if (uriList?.trim()) return uriList.trim();
    } catch {
        // ignore
    }

    try {
        const text = dt.getData("text/plain");
        if (text?.trim()) return text;
    } catch {
        // ignore
    }

    return null;
}