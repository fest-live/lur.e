/**
 * Visual code overlay locked to a text host (code / textarea / contenteditable).
 *
 * FIND:code-overlay
 * TAG:code-highlight
 * WHY: highlight.js must not wrap the selectable source; the overlay is paint-only
 * (`pointer-events: none`). Selection stays on the host; CSS Custom Highlight
 * mirrors it onto the overlay when `CSS.highlights` exists.
 */
export const CODE_SELECTION_HIGHLIGHT = "code-selection";

const METRIC_PROPS = [
    "font-family",
    "font-size",
    "font-weight",
    "font-style",
    "font-stretch",
    "font-variant",
    "font-variant-ligatures",
    "font-variant-numeric",
    "font-variant-caps",
    "font-variant-east-asian",
    "font-feature-settings",
    "font-kerning",
    "font-optical-sizing",
    "font-variation-settings",
    "font-size-adjust",
    "font-language-override",
    "line-height",
    "letter-spacing",
    "word-spacing",
    "tab-size",
    "white-space",
    "white-space-collapse",
    "word-break",
    "overflow-wrap",
    "line-break",
    "hyphens",
    "text-align",
    "text-indent",
    "text-transform",
    "text-rendering",
    "text-wrap",
    "text-wrap-mode",
    "direction",
    "unicode-bidi",
    "-webkit-font-smoothing",
    "-moz-osx-font-smoothing",
] as const;

const hostPaint = new Map<HTMLElement, HTMLElement>();
let selectionBound = false;

export type CodeOverlayHandle = {
    overlay: HTMLElement;
    paint: HTMLElement;
    updateMetrics: () => void;
    syncScroll: () => void;
    disconnect: () => void;
};

export type CodeOverlayOptions = {
    paint?: HTMLElement;
    scroller?: HTMLElement | null;
};

const supportsAnchorPositioning = (): boolean => {
    try {
        const cap = (globalThis as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor;
        /* WHY: Android WebView reports anchor-name support but anchor-size(block) is 0 — overlay + pre collapse. */
        if (typeof cap?.isNativePlatform === "function" && cap.isNativePlatform()) return false;
        return typeof CSS !== "undefined"
            && CSS.supports?.("anchor-name: --x") === true
            && CSS.supports?.("block-size: anchor-size(block)") === true;
    } catch {
        return false;
    }
};

/** Used line-height, never 0px (Capacitor getComputedStyle before layout). */
const usedLineHeight = (style: CSSStyleDeclaration, frozen = ""): string => {
    const fontSize = parseFloat(style.fontSize);
    const floor = (Number.isFinite(fontSize) && fontSize > 0 ? fontSize : 16) * 1.35;
    const frozenPx = parseFloat(frozen);
    /* WHY: WebView computed px oscillates (19.5 / 19.4999) → RO rewrites line-height every frame. */
    if (Number.isFinite(frozenPx) && frozenPx >= floor * 0.85) return frozen;
    const px = parseFloat(style.lineHeight);
    const used = Number.isFinite(px) && px >= floor * 0.85 ? px : floor;
    return `${Math.round(used)}px`;
};

const makeAnchorName = (): string => `--hl${Math.random().toString(36).slice(2, 10).replace(/[0-9]/g, "x")}`;

/** Pin overlay to the host border box. `inset:0` on `pre` misses `pre` padding — selection drifts. */
const pinOverlayToHost = (host: HTMLElement, overlay: HTMLElement): void => {
    overlay.style.position = "absolute";
    overlay.style.boxSizing = "border-box";
    overlay.style.inset = "auto";
    overlay.style.right = "auto";
    overlay.style.bottom = "auto";
    overlay.style.margin = "0";
    if (host.offsetParent && host.offsetParent === overlay.offsetParent) {
        const top = `${host.offsetTop}px`;
        const left = `${host.offsetLeft}px`;
        const width = `${host.offsetWidth}px`;
        const height = `${host.offsetHeight}px`;
        if (overlay.style.top === top && overlay.style.left === left
            && overlay.style.width === width && overlay.style.height === height) return;
        overlay.style.top = top;
        overlay.style.left = left;
        overlay.style.width = width;
        overlay.style.height = height;
        return;
    }
    const parent = overlay.parentElement;
    if (!parent) return;
    const parentRect = parent.getBoundingClientRect();
    const hostRect = host.getBoundingClientRect();
    overlay.style.top = `${hostRect.top - parentRect.top + parent.scrollTop}px`;
    overlay.style.left = `${hostRect.left - parentRect.left + parent.scrollLeft}px`;
    overlay.style.width = `${hostRect.width}px`;
    overlay.style.height = `${hostRect.height}px`;
};

/** Leaf overlay: CSS anchors when available, otherwise pin to the host box. */
const placeCodeOverlay = (host: HTMLElement, overlay: HTMLElement): void => {
    overlay.style.pointerEvents = "none";
    overlay.style.userSelect = "none";
    overlay.style.position = "absolute";
    overlay.style.zIndex = "1";
    overlay.style.margin = "0";

    const parent = host.parentElement;
    if (parent && getComputedStyle(parent).position === "static") {
        parent.style.position = "relative";
    }

    if (supportsAnchorPositioning()) {
        const name = makeAnchorName();
        host.style.setProperty("anchor-name", name);
        overlay.style.setProperty("position-anchor", name);
        overlay.style.setProperty("position-area", "span-all");
        overlay.style.setProperty("inset-block-start", "anchor(start)");
        overlay.style.setProperty("inset-inline-start", "anchor(start)");
        overlay.style.setProperty("inset-block-end", "anchor(end)");
        overlay.style.setProperty("inset-inline-end", "anchor(end)");
        overlay.style.setProperty("inline-size", "anchor-size(inline)");
        overlay.style.setProperty("block-size", "anchor-size(block)");
        host.after(overlay);
        return;
    }

    host.after(overlay);
    pinOverlayToHost(host, overlay);
};

const watchHostRemoval = (host: HTMLElement, onGone: () => void): (() => void) => {
    let observer: MutationObserver | null = null;
    const bind = (): void => {
        if (observer || !host.isConnected) return;
        observer = new MutationObserver(() => {
            if (host.isConnected) return;
            observer?.disconnect();
            observer = null;
            onGone();
        });
        observer.observe(host.parentElement ?? document.documentElement, { childList: true, subtree: true });
    };
    /* WHY: Viewer builds `mdRoot` then appends. Tearing down while detached
     * removed the overlay but left `code-highlight-source` on `<code>`. */
    if (host.isConnected) bind();
    else {
        queueMicrotask(bind);
        requestAnimationFrame(bind);
    }
    return () => observer?.disconnect();
};

type HighlightCtor = new (...ranges: Range[]) => object;

const highlightsRegistry = (): { set(name: string, value: object): void; delete(name: string): void } | null => {
    const cap = (globalThis as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor;
    /* WHY: WebView CSS.highlights boxes drift from native line selection. */
    if (typeof cap?.isNativePlatform === "function" && cap.isNativePlatform()) return null;
    const css = globalThis.CSS as (typeof CSS & { highlights?: { set(name: string, value: object): void; delete(name: string): void } }) | undefined;
    return css?.highlights ?? null;
};

const collectTextNodes = (root: Node): Text[] => {
    const nodes: Text[] = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let current: Node | null = walker.nextNode();
    while (current) {
        nodes.push(current as Text);
        current = walker.nextNode();
    }
    return nodes;
};

const rangeOffsetsIn = (root: HTMLElement, range: Range): { start: number; end: number } | null => {
    if (!root.contains(range.commonAncestorContainer) && range.commonAncestorContainer !== root) {
        return null;
    }
    const prefix = document.createRange();
    prefix.selectNodeContents(root);
    prefix.setEnd(range.startContainer, range.startOffset);
    const start = prefix.toString().length;
    return { start, end: start + range.toString().length };
};

const pointAtOffset = (nodes: Text[], offset: number): { node: Text; offset: number } | null => {
    let remaining = Math.max(0, offset);
    for (const node of nodes) {
        const length = node.data.length;
        if (remaining <= length) return { node, offset: remaining };
        remaining -= length;
    }
    const last = nodes.at(-1);
    return last ? { node: last, offset: last.data.length } : null;
};

const hostSelectionOffsets = (host: HTMLElement): { start: number; end: number } | null => {
    if (host instanceof HTMLTextAreaElement) {
        if (document.activeElement !== host) return null;
        const start = host.selectionStart ?? 0;
        const end = host.selectionEnd ?? start;
        return start === end ? null : { start, end };
    }
    const selection = document.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return null;
    return rangeOffsetsIn(host, selection.getRangeAt(0));
};

const syncCodeSelectionHighlight = (): void => {
    const registry = highlightsRegistry();
    const HighlightCtor = (globalThis as { Highlight?: HighlightCtor }).Highlight;
    if (!registry || typeof HighlightCtor !== "function") return;

    const ranges: Range[] = [];
    for (const [host, paint] of hostPaint) {
        if (!host.isConnected || !paint.isConnected) continue;
        const offsets = hostSelectionOffsets(host);
        if (!offsets) continue;
        /* WHY: hljs HTML can drop/add glyphs — mapping offsets onto paint shifts rows. */
        if ((host.textContent?.length ?? 0) !== (paint.textContent?.length ?? 0)) continue;
        const nodes = collectTextNodes(paint);
        const start = pointAtOffset(nodes, offsets.start);
        const end = pointAtOffset(nodes, offsets.end);
        if (!start || !end) continue;
        const range = document.createRange();
        range.setStart(start.node, start.offset);
        range.setEnd(end.node, end.offset);
        ranges.push(range);
    }

    if (!ranges.length) {
        registry.delete(CODE_SELECTION_HIGHLIGHT);
        return;
    }
    registry.set(CODE_SELECTION_HIGHLIGHT, new HighlightCtor(...ranges));
};

const ensureSelectionMirror = (): void => {
    if (selectionBound || typeof document === "undefined" || !highlightsRegistry()) return;
    selectionBound = true;
    document.addEventListener("selectionchange", syncCodeSelectionHighlight, { passive: true });
};

/** Copy used glyph metrics from `pre > code` (or the text host) onto the overlay. */
export const copyCodeMetrics = (source: HTMLElement, target: HTMLElement, box = false): void => {
    const style = getComputedStyle(source);
    const font = style.font;
    if (font) target.style.font = font;
    for (const property of METRIC_PROPS) {
        const value = style.getPropertyValue(property);
        if (value) target.style.setProperty(property, value);
    }
    /* WHY: Unitless `line-height` on `pre` × `code` 0.92em ≠ pre's used px.
     * Freeze a used px value — never 0px from a pre-layout WebView. */
    const lineHeight = usedLineHeight(style, source.style.lineHeight);
    if (source.offsetHeight > 0 && source.style.lineHeight !== lineHeight) source.style.lineHeight = lineHeight;
    target.style.setProperty("line-height", lineHeight);
    (source.parentElement ?? source).style.setProperty("--code-line-height", lineHeight);
    target.style.setProperty("font-synthesis", "none");
    target.style.setProperty("font-weight", "400");
    target.style.setProperty("font-style", "normal");
    target.style.setProperty("font-kerning", "none");
    target.style.setProperty("font-variant-ligatures", "none");
    target.style.setProperty("font-feature-settings", '"liga" 0, "clig" 0, "calt" 0, "dlig" 0');
    target.style.setProperty("-webkit-text-fill-color", "currentColor");
    if (box) {
        /* WHY: content-box + offsetWidth + copied padding grows the overlay and wraps earlier. */
        target.style.boxSizing = "border-box";
        target.style.paddingTop = style.paddingTop;
        target.style.paddingRight = style.paddingRight;
        target.style.paddingBottom = style.paddingBottom;
        target.style.paddingLeft = style.paddingLeft;
    }
};

/**
 * Place `overlay` over `host` with matching box + font metrics.
 * INVARIANT: overlay never captures pointer or selection.
 */
export const attachCodeOverlay = (
    host: HTMLElement,
    overlay: HTMLElement,
    options: CodeOverlayOptions = {},
): CodeOverlayHandle => {
    const paint = options.paint ?? overlay;
    const scroller = options.scroller ?? (host.closest("pre") as HTMLElement | null) ?? host;

    overlay.classList.add("code-highlight-overlay");
    overlay.setAttribute("aria-hidden", "true");
    overlay.style.pointerEvents = "none";
    overlay.style.userSelect = "none";

    let metricsLocked = false;
    let metricsBusy = false;
    const updateMetrics = (force = false): void => {
        if (metricsBusy) return;
        metricsBusy = true;
        try {
            const laidOut = host.offsetHeight > 0 || host.offsetWidth > 0;
            if (!laidOut) {
                metricsLocked = false;
                return;
            }
            if (force || !metricsLocked) {
                copyCodeMetrics(host, overlay, true);
                if (paint !== overlay) copyCodeMetrics(host, paint, false);
                metricsLocked = parseFloat(host.style.lineHeight) > 0;
            }
            if (!supportsAnchorPositioning()) pinOverlayToHost(host, overlay);
        } finally {
            queueMicrotask(() => {
                metricsBusy = false;
            });
        }
    };
    updateMetrics(true);
    void document.fonts?.ready?.then(() => {
        if (host.isConnected) updateMetrics(true);
    });
    const resize = typeof ResizeObserver === "function"
        ? new ResizeObserver(() => updateMetrics())
        : null;
    resize?.observe(host);

    placeCodeOverlay(host, overlay);

    const syncScroll = (): void => {
        if (scroller === host && host instanceof HTMLTextAreaElement) {
            paint.style.transform = `translate(${-host.scrollLeft}px, ${-host.scrollTop}px)`;
            return;
        }
        if (paint instanceof HTMLElement && "scrollTop" in scroller) {
            paint.scrollTop = scroller.scrollTop;
            paint.scrollLeft = scroller.scrollLeft;
        }
    };
    scroller.addEventListener("scroll", syncScroll, { passive: true });
    host.addEventListener("scroll", syncScroll, { passive: true });
    host.addEventListener("select", syncCodeSelectionHighlight, { passive: true });
    host.addEventListener("keyup", syncCodeSelectionHighlight, { passive: true });

    hostPaint.set(host, paint);
    ensureSelectionMirror();

    let stopWatch = (): void => undefined;
    const disconnect = (): void => {
        stopWatch();
        resize?.disconnect();
        hostPaint.delete(host);
        scroller.removeEventListener("scroll", syncScroll);
        host.removeEventListener("scroll", syncScroll);
        host.removeEventListener("select", syncCodeSelectionHighlight);
        host.removeEventListener("keyup", syncCodeSelectionHighlight);
        overlay.remove();
        syncCodeSelectionHighlight();
    };
    stopWatch = watchHostRemoval(host, disconnect);

    return { overlay, paint, updateMetrics, syncScroll, disconnect };
};
