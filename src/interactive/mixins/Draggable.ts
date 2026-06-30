/**
 * Anchorable drag / resize: wires `data-mixin` junction controllers + optional CSS Anchor Positioning names.
 *
 * WHY: `--jx-frame` / `--jx-drag-handle` / `--jx-resize-handle` pair with `position-anchor` / `anchor()`
 * in author styles without imperative `DragHandler` setup.
 */
import { updateAllMixins } from "fest/dom";

const ANCHOR_IDENT = /^--[-\w]+$/;

export type AnchorNameTriple = {
    /** `anchor-name` on the moving frame (default `--jx-frame`). */
    frame?: string;
    /** On the drag handle element (default `--jx-drag-handle`). */
    dragHandle?: string;
    /** On the resize grip (default `--jx-resize-handle`). */
    resizeHandle?: string;
};

export type AnchorableDragBindOptions = {
    frame: HTMLElement;
    /** Selector relative to `frame`, or the handle element. */
    dragHandle?: string | HTMLElement;
    /** Selector or element; set `null` to skip resize mixin. */
    resizeHandle?: string | HTMLElement | null;
    anchors?: AnchorNameTriple;
    minWidth?: number;
    minHeight?: number;
};

function tokenSelector(el: HTMLElement, attr: string, value: string): string {
    el.setAttribute(attr, value);
    return `[${attr}="${value}"]`;
}

function resolveHandleSelector(
    frame: HTMLElement,
    handle: HTMLElement | undefined,
    attrPrefix: string
): string | undefined {
    if (!handle || handle === frame) return undefined;
    const token = `${attrPrefix}-${Math.random().toString(36).slice(2, 10)}`;
    return tokenSelector(handle, "data-jx-anchor-ctl", token);
}

/** Apply `anchor-name` when valid dashed ident. */
export function applyAnchorName(el: HTMLElement | null | undefined, name: string | undefined): void {
    if (!el || !name) return;
    if (!ANCHOR_IDENT.test(name)) return;
    el.style.setProperty("anchor-name", name);
}

/**
 * Declaratively enable junction drag (+ optional resize) and publish CSS anchor names.
 * Returns teardown (restores previous `data-mixin` text only; anchor-name cleanup is best-effort).
 */
export function bindAnchorableDragResize(opts: AnchorableDragBindOptions): () => void {
    const { frame } = opts;
    const prevMixinAttr = frame.getAttribute("data-mixin") ?? "";
    const prevDragSel = frame.getAttribute("data-junction-drag-handle");
    const prevResizeSel = frame.getAttribute("data-junction-resize-handle");
    const prevMinW = frame.getAttribute("data-junction-resize-min-w");
    const prevMinH = frame.getAttribute("data-junction-resize-min-h");

    const wantResize = opts.resizeHandle !== null;

    const mixins = new Set(prevMixinAttr.split(/\s+/).filter(Boolean));
    mixins.add("ui-junction-drag");
    if (wantResize) mixins.add("ui-junction-resize");
    else mixins.delete("ui-junction-resize");
    frame.setAttribute("data-mixin", [...mixins].join(" "));

    if (typeof opts.dragHandle === "string") {
        frame.setAttribute("data-junction-drag-handle", opts.dragHandle);
    } else if (opts.dragHandle instanceof HTMLElement) {
        const sel = resolveHandleSelector(frame, opts.dragHandle, "drag");
        if (sel) frame.setAttribute("data-junction-drag-handle", sel);
    }

    if (wantResize) {
        if (typeof opts.resizeHandle === "string") {
            frame.setAttribute("data-junction-resize-handle", opts.resizeHandle);
        } else if (opts.resizeHandle instanceof HTMLElement) {
            const sel = resolveHandleSelector(frame, opts.resizeHandle, "rz");
            if (sel) frame.setAttribute("data-junction-resize-handle", sel);
        }
    } else {
        frame.removeAttribute("data-junction-resize-handle");
    }

    if (opts.minWidth != null) frame.setAttribute("data-junction-resize-min-w", String(opts.minWidth));
    if (opts.minHeight != null) frame.setAttribute("data-junction-resize-min-h", String(opts.minHeight));

    const a = opts.anchors ?? {};
    const frameAnchor = a.frame ?? "--jx-frame";
    const dragA = a.dragHandle ?? "--jx-drag-handle";
    const rzA = a.resizeHandle ?? "--jx-resize-handle";

    applyAnchorName(frame, frameAnchor);

    let dragEl: HTMLElement | undefined;
    if (typeof opts.dragHandle === "string") {
        dragEl = frame.querySelector(opts.dragHandle) as HTMLElement | undefined;
    } else {
        dragEl = opts.dragHandle;
    }
    applyAnchorName(dragEl, dragEl && dragEl !== frame ? dragA : undefined);

    let rzEl: HTMLElement | undefined;
    if (wantResize) {
        if (typeof opts.resizeHandle === "string") {
            rzEl = frame.querySelector(opts.resizeHandle) as HTMLElement | undefined;
        } else {
            rzEl = opts.resizeHandle ?? undefined;
        }
        applyAnchorName(rzEl, rzA);
    }

    updateAllMixins(frame);

    return () => {
        if (prevMixinAttr) frame.setAttribute("data-mixin", prevMixinAttr);
        else frame.removeAttribute("data-mixin");
        if (prevDragSel != null) frame.setAttribute("data-junction-drag-handle", prevDragSel);
        else frame.removeAttribute("data-junction-drag-handle");
        if (prevResizeSel != null) frame.setAttribute("data-junction-resize-handle", prevResizeSel);
        else frame.removeAttribute("data-junction-resize-handle");
        if (prevMinW != null) frame.setAttribute("data-junction-resize-min-w", prevMinW);
        else frame.removeAttribute("data-junction-resize-min-w");
        if (prevMinH != null) frame.setAttribute("data-junction-resize-min-h", prevMinH);
        else frame.removeAttribute("data-junction-resize-min-h");
        frame.style.removeProperty("anchor-name");
        dragEl?.style?.removeProperty("anchor-name");
        rzEl?.removeAttribute("data-jx-anchor-ctl");
        dragEl?.removeAttribute("data-jx-anchor-ctl");
        rzEl?.style?.removeProperty("anchor-name");
        updateAllMixins(frame);
    };
}
