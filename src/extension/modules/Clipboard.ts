/**
 * Standalone Clipboard API
 * Works independently in any context: PWA, Chrome Extension, service worker, vanilla JS
 * Provides unified clipboard operations with fallbacks
 */

import { lazyAddEventListener } from "fest/lure";

export type ClipboardDataType = "text" | "html" | "image" | "blob";

export interface ClipboardWriteOptions {
    type?: ClipboardDataType;
    mimeType?: string;
    fallbackToLegacy?: boolean;
    showFeedback?: boolean;
    /** If true, don't show error toast on failure (for background operations) */
    silentOnError?: boolean;
}

export interface ClipboardResult {
    ok: boolean;
    data?: unknown;
    error?: string;
    method?: "clipboard-api" | "legacy" | "broadcast" | "offscreen";
}

// BroadcastChannel for cross-context clipboard operations
const CLIPBOARD_CHANNEL = "rs-clipboard";

/** Beyond this, legacy execCommand + textarea.select() can freeze the tab for seconds. */
const CLIPBOARD_LEGACY_MAX_CHARS = 256_000;
/** Hard cap — clipboard APIs and string work degrade badly above this. */
const CLIPBOARD_TEXT_MAX_CHARS = 2_000_000;
/** Failsafe if the browser never settles clipboard read/write. */
const CLIPBOARD_OPERATION_TIMEOUT_MS = 12_000;
const scheduleClipboardFrame = (cb: FrameRequestCallback | (() => void)): void => {
    if (typeof globalThis.requestAnimationFrame === "function") {
        globalThis.requestAnimationFrame(cb as FrameRequestCallback);
        return;
    }
    if (typeof MessageChannel !== "undefined") {
        const channel = new MessageChannel();
        channel.port1.onmessage = () => (cb as () => void)();
        channel.port2.postMessage(undefined);
        return;
    }
    if (typeof setTimeout === "function") {
        // Approximate a frame boundary when RAF is unavailable.
        setTimeout(() => (cb as () => void)(), 16);
        return;
    }
    if (typeof queueMicrotask === "function") {
        queueMicrotask(() => (cb as () => void)());
        return;
    }
    (cb as () => void)();
};

/**
 * Convert data to string safely
 */
export const toText = (data: unknown): string => {
    if (data == null) return "";
    if (typeof data === "string") return data;
    try {
        return JSON.stringify(data, null, 2);
    } catch {
        return String(data);
    }
};

const raceClipboardWrite = (write: Promise<void>, ms: number): Promise<"ok" | "timeout" | "error"> =>
    Promise.race([
        write
            .then(() => "ok" as const)
            .catch(() => "error" as const),
        new Promise<"timeout">((res) => {
            globalThis.setTimeout(() => res("timeout"), ms);
        })
    ]);

/**
 * Write text to clipboard using modern API
 */
export const writeText = async (text: string): Promise<ClipboardResult> => {
    const raw = toText(text);
    if (!raw.trim()) return { ok: false, error: "Empty content" };
    if (raw.length > CLIPBOARD_TEXT_MAX_CHARS) {
        return { ok: false, error: "Content too large to copy safely" };
    }

    const trimmed = raw.trim();

    return new Promise<ClipboardResult>((resolve) => {
        scheduleClipboardFrame(() => {
            // Ensure document has focus for clipboard API
            if (typeof document !== 'undefined' && document.hasFocus && !document.hasFocus()) {
                globalThis?.focus?.();
            }

            const tryClipboardAPI = async () => {
                const tryWriteText = async (): Promise<boolean> => {
                    if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) return false;
                    const outcome = await raceClipboardWrite(navigator.clipboard.writeText(trimmed), CLIPBOARD_OPERATION_TIMEOUT_MS);
                    if (outcome === "ok") return true;
                    if (outcome === "timeout") console.warn("[Clipboard] writeText timed out");
                    return false;
                };

                try {
                    if (await tryWriteText()) {
                        resolve({ ok: true, data: trimmed, method: "clipboard-api" });
                        return;
                    }
                } catch (err) {
                    console.warn("[Clipboard] Direct write failed:", err);
                }

                // Avoid navigator.permissions.query — it can hang indefinitely in embedded / non‑HTTPS contexts.

                // Fallback: legacy execCommand — never use for huge strings (freezes UI)
                if (trimmed.length > CLIPBOARD_LEGACY_MAX_CHARS) {
                    resolve({ ok: false, error: "Content too large for fallback copy" });
                    return;
                }

                try {
                    if (typeof document !== "undefined") {
                        const textarea = document.createElement("textarea");
                        textarea.value = trimmed;
                        textarea.style.cssText = "position:fixed;left:-9999px;top:-9999px;opacity:0;pointer-events:none;";
                        document.body.appendChild(textarea);
                        textarea.select();
                        textarea.remove();
                        /*if (success) {
                            resolve({ ok: true, data: trimmed, method: "legacy" });
                            return;
                        }*/
                    }
                } catch (err) {
                    console.warn("[Clipboard] Legacy execCommand failed:", err);
                }

                resolve({ ok: false, error: "All clipboard methods failed" });
            };

            void tryClipboardAPI();
        });
    });
};

/**
 * Write HTML content to clipboard (with text fallback)
 */
export const writeHTML = async (html: string, plainText?: string): Promise<ClipboardResult> => {
    const htmlContent = html.trim();
    const textContent = (plainText ?? htmlContent).trim();

    if (!htmlContent) return { ok: false, error: "Empty content" };

    return new Promise<ClipboardResult>((resolve) => {
        scheduleClipboardFrame(() => {
            // Ensure document has focus for clipboard API
            if (typeof document !== 'undefined' && document.hasFocus && !document.hasFocus()) {
                globalThis?.focus?.();
            }

            const tryHTMLClipboard = async () => {
                try {
                    if (typeof navigator !== "undefined" && navigator.clipboard?.write) {
                        const htmlBlob = new Blob([htmlContent], { type: "text/html" });
                        const textBlob = new Blob([textContent], { type: "text/plain" });
                        await navigator.clipboard.write([
                            new ClipboardItem({
                                "text/html": htmlBlob,
                                "text/plain": textBlob
                            })
                        ]);
                        return resolve({ ok: true, data: htmlContent, method: "clipboard-api" });
                    }
                } catch (err) {
                    console.warn("[Clipboard] HTML write failed:", err);
                }

                // Fallback to text-only
                const textResult = await writeText(textContent);
                resolve(textResult);
            };

            tryHTMLClipboard();
        });
    });
};

/**
 * Write image to clipboard
 */
export const writeImage = async (blob: Blob | string): Promise<ClipboardResult> => {
    return new Promise<ClipboardResult>((resolve) => {
        scheduleClipboardFrame(async () => {
            // Ensure document has focus for clipboard API
            if (typeof document !== 'undefined' && document.hasFocus && !document.hasFocus()) {
                globalThis?.focus?.();
            }

            try {
                let imageBlob: Blob;

                if (typeof blob === "string") {
                    // Convert data URL or URL to blob
                    if (blob.startsWith("data:")) {
                        const response = await fetch(blob);
                        imageBlob = await response.blob();
                    } else {
                        const response = await fetch(blob);
                        imageBlob = await response.blob();
                    }
                } else {
                    imageBlob = blob;
                }

                if (typeof navigator !== "undefined" && navigator.clipboard?.write) {
                    // Ensure PNG format for clipboard compatibility
                    const pngBlob = imageBlob.type === "image/png"
                        ? imageBlob
                        : await convertToPng(imageBlob);

                    await navigator.clipboard.write([
                        new ClipboardItem({
                            [pngBlob.type]: pngBlob
                        })
                    ]);
                    resolve({ ok: true, method: "clipboard-api" });
                    return;
                }
            } catch (err) {
                console.warn("[Clipboard] Image write failed:", err);
            }

            resolve({ ok: false, error: "Image clipboard not supported" });
        });
    });
};

/**
 * Convert image blob to PNG
 */
const convertToPng = async (blob: Blob): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        if (typeof document === "undefined") {
            reject(new Error("No document context"));
            return;
        }

        const img = new Image();
        const url = URL.createObjectURL(blob);

        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;

            const ctx = canvas.getContext("2d");
            if (!ctx) {
                URL.revokeObjectURL(url);
                reject(new Error("Canvas context failed"));
                return;
            }

            ctx.drawImage(img, 0, 0);
            canvas.toBlob(
                (pngBlob) => {
                    URL.revokeObjectURL(url);
                    if (pngBlob) {
                        resolve(pngBlob);
                    } else {
                        reject(new Error("PNG conversion failed"));
                    }
                },
                "image/png"
            );
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error("Image load failed"));
        };

        img.src = url;
    });
};

/**
 * Read text from clipboard
 */
export const readText = async (): Promise<ClipboardResult> => {
    return new Promise<ClipboardResult>((resolve) => {
        scheduleClipboardFrame(() => {
            const tryReadClipboard = async () => {
                try {
                    if (typeof navigator !== "undefined" && navigator.clipboard?.readText) {
                        const text = await navigator.clipboard.readText();
                        resolve({ ok: true, data: text, method: "clipboard-api" });
                        return;
                    }
                } catch (err) {
                    console.warn("[Clipboard] Read failed:", err);
                }

                resolve({ ok: false, error: "Clipboard read not available" });
            };

            tryReadClipboard();
        });
    });
};

/**
 * Unified copy function with automatic type detection
 */
export const copy = async (
    data: unknown,
    options: ClipboardWriteOptions = {}
): Promise<ClipboardResult> => {
    const { type, showFeedback = false, silentOnError = false } = options;

    return new Promise<ClipboardResult>((resolve) => {
        scheduleClipboardFrame(async () => {
            let result: ClipboardResult;

            // Determine type and copy
            if (data instanceof Blob) {
                if (data.type.startsWith("image/")) {
                    result = await writeImage(data);
                } else {
                    const text = await data.text();
                    result = await writeText(text);
                }
            } else if (type === "html" || (typeof data === "string" && data.trim().startsWith("<"))) {
                result = await writeHTML(String(data));
            } else if (type === "image") {
                result = await writeImage(data as Blob | string);
            } else {
                result = await writeText(toText(data));
            }

            // Optionally show feedback via toast broadcast
            // Skip error toast if silentOnError is true (e.g., background clipboard operations)
            if (showFeedback && (result.ok || !silentOnError)) {
                broadcastClipboardFeedback(result);
            }

            resolve(result);
        });
    });
};

/**
 * Broadcast clipboard feedback for toast display
 */
const broadcastClipboardFeedback = (result: ClipboardResult): void => {
    try {
        const channel = new BroadcastChannel("rs-toast");
        channel.postMessage({
            type: "show-toast",
            options: {
                message: result.ok ? "Copied to clipboard" : (result.error || "Copy failed"),
                kind: result.ok ? "success" : "error",
                duration: 2000
            }
        });
        channel.close();
    } catch (e) {
        console.warn("[Clipboard] Feedback broadcast failed:", e);
    }
};

/**
 * Request clipboard operation via broadcast (for service worker → client)
 */
export const requestCopy = (data: unknown, options?: ClipboardWriteOptions): void => {
    try {
        const channel = new BroadcastChannel(CLIPBOARD_CHANNEL);
        channel.postMessage({ type: "copy", data, options });
        channel.close();
    } catch (e) {
        console.warn("[Clipboard] Request broadcast failed:", e);
    }
};

/** One logical listener for rs-clipboard — multiple initClipboardReceiver calls must not stack handlers (duplicate copy() freezes UI). */
let _clipboardBroadcastChannel: BroadcastChannel | null = null;
let _clipboardBroadcastRefCount = 0;
let _clipboardBroadcastHandler: ((event: MessageEvent) => void) | null = null;
/** Serialize SW/client broadcast copies so overlapping clipboard API work does not wedge the main thread. */
let _clipboardBroadcastQueue: Promise<void> = Promise.resolve();

/**
 * Listen for clipboard operation requests
 */
export const listenForClipboardRequests = (): (() => void) => {
    if (typeof BroadcastChannel === "undefined") return () => {};

    if (_clipboardBroadcastRefCount === 0) {
        const channel = new BroadcastChannel(CLIPBOARD_CHANNEL);
        const handler = (event: MessageEvent) => {
            if (event.data?.type !== "copy") return;
            const opts = event.data.options || {};
            const data = event.data.data;
            _clipboardBroadcastQueue = _clipboardBroadcastQueue.then(async () => {
                try {
                    await copy(data, {
                        ...opts,
                        showFeedback: opts.showFeedback !== false,
                        silentOnError: opts.silentOnError === true
                    });
                } catch (err) {
                    console.warn("[Clipboard] Broadcast copy failed:", err);
                }
            });
        };
        channel.addEventListener("message", handler);
        _clipboardBroadcastChannel = channel;
        _clipboardBroadcastHandler = handler;
    }
    _clipboardBroadcastRefCount++;
    return () => {
        _clipboardBroadcastRefCount--;
        if (_clipboardBroadcastRefCount <= 0) {
            const ch = _clipboardBroadcastChannel;
            const h = _clipboardBroadcastHandler;
            if (ch && h) {
                ch.removeEventListener("message", h);
                ch.close();
            }
            _clipboardBroadcastChannel = null;
            _clipboardBroadcastHandler = null;
            _clipboardBroadcastRefCount = 0;
        }
    };
};

/**
 * Initialize clipboard listener for receiving copy requests
 */
export const initClipboardReceiver = (): (() => void) => {
    return listenForClipboardRequests();
};

/**
 * Check if clipboard API is available
 */
export const isClipboardAvailable = (): boolean => {
    return typeof navigator !== "undefined" && !!navigator.clipboard;
};

/**
 * Check if clipboard write is available
 */
export const isClipboardWriteAvailable = (): boolean => {
    return typeof navigator !== "undefined" && typeof navigator.clipboard?.writeText === "function";
};

/**
 * Check if running in Chrome extension context
 */
export const isChromeExtension = (): boolean => {
    try {
        return typeof chrome !== "undefined" && !!chrome?.runtime?.id;
    } catch {
        return false;
    }
};

export interface CRXCopyOptions {
    tabId?: number;
    /** Optional fallback function for offscreen document copy */
    offscreenFallback?: (data: unknown) => Promise<boolean>;
}

/**
 * Request copy via Chrome extension message (for CRX service worker → content script)
 * Falls back to offscreen document or BroadcastChannel if content script fails
 */
export const requestCopyViaCRX = async (
    data: unknown,
    tabIdOrOptions?: number | CRXCopyOptions
): Promise<ClipboardResult> => {
    const options: CRXCopyOptions = typeof tabIdOrOptions === "number"
        ? { tabId: tabIdOrOptions }
        : (tabIdOrOptions || {});

    const { tabId, offscreenFallback } = options;
    const text = toText(data).trim();
    if (!text) return { ok: false, error: "Empty content" };

    // If in extension context with tabs API
    if (isChromeExtension() && typeof chrome?.tabs?.sendMessage === "function") {
        try {
            // Send to specific tab or active tab
            if (typeof tabId === "number" && tabId >= 0) {
                const response = await chrome.tabs.sendMessage(tabId, {
                    type: "COPY_HACK",
                    data: text
                });
                if (response?.ok) {
                    return {
                        ok: true,
                        data: response?.data,
                        method: response?.method ?? "broadcast"
                    };
                }
            } else {
                // Query active tab
                const tabs = await chrome.tabs.query({ currentWindow: true, active: true });
                for (const tab of tabs || []) {
                    if (tab?.id != null && tab.id >= 0) {
                        try {
                            const response = await chrome.tabs.sendMessage(tab.id, {
                                type: "COPY_HACK",
                                data: text
                            });
                            if (response?.ok) {
                                return {
                                    ok: true,
                                    data: response?.data,
                                    method: response?.method ?? "broadcast"
                                };
                            }
                        } catch {
                            // Tab may not have content script, continue to next
                        }
                    }
                }
            }
        } catch (err) {
            console.warn("[Clipboard] CRX content script message failed:", err);
        }

        // Fallback to offscreen document if provided
        if (offscreenFallback) {
            try {
                const ok = await offscreenFallback(text);
                if (ok) {
                    return { ok: true, data: text, method: "offscreen" };
                }
            } catch (err) {
                console.warn("[Clipboard] Offscreen fallback failed:", err);
            }
        }
    }

    // Final fallback to BroadcastChannel
    requestCopy(data, { showFeedback: true });
    return { ok: false, error: "Broadcast sent, result pending", method: "broadcast" };
};

/**
 * COPY_HACK - Legacy API for Chrome extension clipboard operations
 * Now delegates to unified Clipboard module
 */
export const COPY_HACK = async (data: unknown): Promise<boolean> => {
    const result = await writeText(toText(data));
    return result.ok;
};

/**
 * Copy with result - returns full ClipboardResult for more control
 */
export const copyWithResult = async (data: unknown): Promise<ClipboardResult> => {
    return writeText(toText(data));
};


// Default export for convenience
export default {
    copy,
    writeText,
    writeHTML,
    writeImage,
    readText,
    toText,
    request: requestCopy,
    requestViaCRX: requestCopyViaCRX,
    listen: listenForClipboardRequests,
    init: initClipboardReceiver,
    isAvailable: isClipboardAvailable,
    isWriteAvailable: isClipboardWriteAvailable,
    isChromeExtension
};

//
export interface ClipboardProvider {
    onCopy?(ev: ClipboardEvent): void | boolean;
    onCut?(ev: ClipboardEvent): void | boolean;
    onPaste?(ev: ClipboardEvent): void | boolean;
}

//
const collectProviders = (ev: ClipboardEvent, action: keyof ClipboardProvider): ClipboardProvider[] => {
    const providers = new Set<ClipboardProvider>();
    let el = (ev?.target as HTMLElement | null) || document.activeElement || document.body;

    // Ignore if target is a native input that handles clipboard (unless we want to override?)
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || (el as HTMLElement).isContentEditable) {
        return [];
    }

    // 1. Walk up the tree (bubbling emulation / focus context)
    let current: HTMLElement | null = el as HTMLElement;
    while (current) {
        // Check if element instance has the methods (e.g. web components or custom objects attached)
        if (typeof (current as any)[action] === "function") {
            providers.add(current as any);
        }
        // Also check if there's an operative instance or controller attached
        if ((current as any).operativeInstance && typeof (current as any).operativeInstance[action] === "function") {
            providers.add((current as any).operativeInstance);
        }

        // Move up
        if (current.shadowRoot && (current.shadowRoot as any).host) {
            current = (current.shadowRoot as any).host;
        } else {
            current = (current.parentElement || (current.getRootNode() as ShadowRoot)?.host) as HTMLElement;
        }
    }

    // 2. TreeWalker Search (fallback: find any active provider in the composed tree)
    // This is useful if the focus is on body/document but a provider is conceptually active or visible
    if (ev.currentTarget instanceof Node || typeof document !== "undefined") {
        const root = (ev.currentTarget instanceof Node ? (ev.currentTarget instanceof Document ? ev.currentTarget.body : ev.currentTarget) : document.body) as HTMLElement;
        if (root) {
            const walker = document.createTreeWalker(
                root,
                NodeFilter.SHOW_ELEMENT,
                {
                    acceptNode(node) {
                        if (typeof (node as any)[action] === "function" ||
                           ((node as any).operativeInstance && typeof (node as any).operativeInstance[action] === "function")) {
                            return NodeFilter.FILTER_ACCEPT;
                        }
                        return NodeFilter.FILTER_SKIP;
                    }
                }
            );

            while (walker.nextNode()) {
                const node = walker.currentNode as HTMLElement;
                if (typeof (node as any)[action] === "function") {
                    providers.add(node as any);
                }
                if ((node as any).operativeInstance && typeof (node as any).operativeInstance[action] === "function") {
                    providers.add((node as any).operativeInstance);
                }
            }
        }
    }

    return Array.from(providers);
}

//
const handleClipboardEvent = (ev: ClipboardEvent, type: "onCopy" | "onCut" | "onPaste") => {
    const providers = collectProviders(ev, type);
    for (const provider of providers) {
        provider[type]?.(ev);
    }
};

//
let initialized = false;
export const initGlobalClipboard = () => {
    if (typeof window === "undefined" || initialized) return;
    initialized = true;

    // Lazily attach (single shared listener per event type) on first init.
    lazyAddEventListener(window, "copy", (ev: Event) => handleClipboardEvent(ev as ClipboardEvent, "onCopy"), { capture: false, passive: true });
    lazyAddEventListener(window, "cut", (ev: Event) => handleClipboardEvent(ev as ClipboardEvent, "onCut"), { capture: false, passive: true });
    lazyAddEventListener(window, "paste", (ev: Event) => handleClipboardEvent(ev as ClipboardEvent, "onPaste"), { capture: false, passive: false });
};
