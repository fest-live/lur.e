import { lazyAddEventListener } from "../controllers/LazyEvents";

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
