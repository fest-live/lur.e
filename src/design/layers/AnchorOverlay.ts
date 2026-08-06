/*
 * Filename: AnchorOverlay.ts
 * FullPath: modules/projects/lur.e/src/design/layers/AnchorOverlay.ts
 * Change date and time: 16.55.00_30.07.2026
 * Reason for changes: observeConnect must watch a connected root when the local parent is still detached.
 */

import { makeAnchorElement } from "../anchor/CSSAnchor";
import { bindScrollbarPosition, boundingBoxAnchorRef } from "../anchor/BBoxAnchor";
import { enhancedIntersectionBoxAnchorRef } from "../anchor/IntersectionAnchor";
import { defaultZIndexShift, resolveLayerZIndex } from "./stacking";
import type { AppendAsLayerOptions, LayerPlacement, StackMode } from "./types";

//
export const getParentOrShadowRoot = (element: HTMLElement): HTMLElement | ShadowRoot | undefined => {
    if ((element as any)?.parentElement) {
        return (!((element as any)?.parentElement instanceof DocumentFragment)
            ? (element as any)?.parentElement as HTMLElement
            : undefined);
    }
    return (element as any)?.host?.shadowRoot as ShadowRoot;
};

//
export const observeDisconnect = (element: Element, handleMutation) => {
    if (!element?.isConnected) {
        return handleMutation();
    }

    const observer = new MutationObserver((mutationList, observer) => {
        for (const mutation of mutationList) {
            if (mutation.type == "childList") {
                if (Array.from(mutation?.removedNodes || []).some((node) => (node === element || node?.contains?.(element)))) {
                    queueMicrotask(() => handleMutation(mutation));
                    observer?.disconnect?.();
                }
            }
        }
    });

    const parent = getParentOrShadowRoot(element as HTMLElement) ?? document.documentElement;
    const observed = (parent instanceof HTMLElement ? parent : parent?.host) ?? parent;
    queueMicrotask(() => observer.observe(observed, {
        subtree: true,
        childList: true
    }));
};

//
export const observeConnect = (element: Element, handleMutation) => {
    if (element?.isConnected) {
        return handleMutation();
    }

    const observer = new MutationObserver((_mutationList, obs) => {
        // WHY: when the local parent is still detached, the real connect mutation is on an ancestor
        // (e.g. grid appends `.ui-ws-item`). Checking `isConnected` covers that path.
        if (!element?.isConnected) return;
        queueMicrotask(() => handleMutation());
        obs?.disconnect?.();
    });

    const parent = getParentOrShadowRoot(element as HTMLElement);
    // INVARIANT: never observe a disconnected parent alone — its childList won't see later tree inserts.
    const observed =
        (parent instanceof HTMLElement && parent.isConnected
            ? parent
            : null)
        ?? document.documentElement;

    queueMicrotask(() => {
        if (element?.isConnected) {
            handleMutation();
            observer.disconnect();
            return;
        }
        observer.observe(observed, {
            subtree: true,
            childList: true
        });
    });
};

const connectWithPlacement = (
    anchorBinder: ReturnType<typeof makeAnchorElement>,
    layer: HTMLElement,
    placement: LayerPlacement,
    zIndexShift: number,
    inset: number,
    size: string,
    transformOrigin: string,
) => {
    // COMPAT: scrollbar placements map onto edge anchors used by ScrollBar chrome.
    if (placement === "scrollbar-x") {
        anchorBinder.connectElement(layer, {
            placement: "bottom",
            zIndexShift,
            inset,
            size,
            transformOrigin
        });
    } else if (placement === "scrollbar-y") {
        anchorBinder.connectElement(layer, {
            placement: "right",
            zIndexShift,
            inset,
            size,
            transformOrigin
        });
    } else {
        anchorBinder.connectElement(layer, {
            placement,
            zIndexShift,
            inset,
            size,
            transformOrigin
        });
    }
};

/**
 * Insert `layer` as a sibling of `anchor` (before = underlying, after = overlaying),
 * bind CSS anchor placement, and apply hybrid stacking.
 */
export const appendAsLayer = (
    anchor: HTMLElement | null,
    layer?: HTMLElement | null,
    self?: HTMLElement | null,
    options?: AppendAsLayerOptions,
) => {
    const role = options?.role ?? "overlaying";
    const stackMode: StackMode = options?.stackMode ?? "shift";
    const zIndexShift = options?.zIndexShift ?? defaultZIndexShift(role);
    const placement: LayerPlacement = options?.placement ?? "fill";
    const positioning = options?.positioning ?? "anchor";
    const inset = options?.inset ?? 0;
    const size = options?.size ?? "100%";
    const transformOrigin = options?.transformOrigin ?? "50% 50%";

    anchor ??= (self?.children?.[0] as HTMLElement) ?? anchor;

    if (!anchor && (self?.children?.length ?? 0) < 1) {
        const fillAnchorBox = document.createElement("div");
        fillAnchorBox.classList.add("ui-window-frame-anchor-box");
        fillAnchorBox.style.position = "relative";
        fillAnchorBox.style.inlineSize = "stretch";
        fillAnchorBox.style.blockSize = "stretch";
        fillAnchorBox.style.zIndex = String(Math.max(zIndexShift - 0, 0));
        fillAnchorBox.style.pointerEvents = "none";
        fillAnchorBox.style.opacity = "1";
        fillAnchorBox.style.visibility = "visible";
        fillAnchorBox.style.backgroundColor = "transparent";
        (self as any)?.append?.(anchor = fillAnchorBox);
    }

    if (anchor == null || layer == null) return;

    const resolvedZ = resolveLayerZIndex(anchor, { role, stackMode, zIndexShift });
    if (resolvedZ == null) {
        layer.style.removeProperty("z-index");
    } else {
        layer.style.setProperty("z-index", String(resolvedZ));
    }

    if (role === "underlying") {
        // INVARIANT: underlying layers must not steal pointer hits from main.
        if (!layer.style.pointerEvents) {
            layer.style.pointerEvents = "none";
        }
    }

    // WHY: CSS anchor-positioned hosts often fail as containing blocks for nested abspos
    // chrome (scrollbar tracks). "contain" fills the parent box with plain absolute inset.
    if (positioning === "contain") {
        const host = (self instanceof HTMLElement ? self : null)
            ?? getParentOrShadowRoot(anchor)
            ?? anchor.parentElement;
        if (host instanceof HTMLElement) {
            const cs = getComputedStyle(host);
            if (cs.position === "static") {
                host.style.position = "relative";
            }
        }
        layer.style.position = "absolute";
        layer.style.inset = inset ? `${inset}px` : "0";
        layer.style.inlineSize = "auto";
        layer.style.blockSize = "auto";
        layer.style.removeProperty("position-anchor");
        layer.style.removeProperty("position-area");
        layer.style.removeProperty("anchor-name");

        observeConnect(anchor, () => {
            const parent = (self instanceof HTMLElement ? self : null)
                ?? getParentOrShadowRoot(anchor!)
                ?? anchor!.parentElement;
            if (role === "underlying") {
                (anchor as any)?.before?.(layer);
            } else {
                (anchor as any)?.after?.(layer);
            }
            observeDisconnect((parent as Element) ?? anchor!, () => layer?.remove?.());
        });
        return anchor;
    }

    const anchorBinder = makeAnchorElement(anchor);
    // Pass shift into connectElement for initial absolute/anchor styles; we re-apply
    // resolveLayerZIndex afterward so order-equal can clear/equalize z-index.
    connectWithPlacement(anchorBinder, layer, placement, zIndexShift, inset, size, transformOrigin);

    // Re-assert z after connectElement (it writes its own z-index).
    if (resolvedZ == null) {
        layer.style.removeProperty("z-index");
    } else {
        layer.style.setProperty("z-index", String(resolvedZ));
    }

    observeConnect(anchor, () => {
        const parent = getParentOrShadowRoot(anchor!) ?? self;
        const styled = parent instanceof HTMLElement ? parent : parent?.host;
        (styled as HTMLElement)?.style?.setProperty?.("anchor-scope", anchorBinder.anchorId);
        if (role === "underlying") {
            (anchor as any)?.before?.(layer);
        } else {
            (anchor as any)?.after?.(layer);
        }
        observeDisconnect(parent as Element, () => layer?.remove?.());
    });

    return anchor;
};

export const appendAsUnderlying = (
    main: HTMLElement | null,
    layer?: HTMLElement | null,
    options?: Omit<AppendAsLayerOptions, "role"> | HTMLElement | null,
    maybeOptions?: Omit<AppendAsLayerOptions, "role">,
) => {
    // COMPAT: allow (main, layer, options) or (main, layer, self, options) like overlay.
    let self: HTMLElement | null = null;
    let opts: Omit<AppendAsLayerOptions, "role"> | undefined;
    if (options && typeof (options as any).nodeType === "number") {
        self = options as HTMLElement;
        opts = maybeOptions;
    } else {
        opts = options as Omit<AppendAsLayerOptions, "role"> | undefined;
    }
    return appendAsLayer(main, layer, self, {
        placement: "fill",
        ...opts,
        role: "underlying",
    });
};

/** COMPAT: existing callers pass (anchor, overlay?, self?, options?). */
export const appendAsOverlay = (
    anchor: HTMLElement | null,
    overlay?: HTMLElement | null,
    self?: HTMLElement | null,
    options?: Omit<AppendAsLayerOptions, "role"> & {
        root?: HTMLElement;
        placement?: LayerPlacement;
        zIndexShift?: number;
        inset?: number;
        size?: string;
        transformOrigin?: string;
        useIntersection?: boolean;
        stackMode?: StackMode;
    },
) => {
    return appendAsLayer(anchor, overlay, self, {
        ...options,
        placement: options?.placement ?? "fill",
        zIndexShift: options?.zIndexShift ?? 1,
        stackMode: options?.stackMode ?? "shift",
        role: "overlaying",
    });
};

// Enhanced scrollbar overlay with reactive positioning
export const appendScrollbarOverlay = (content: HTMLElement, scrollbar: HTMLElement, axis: "horizontal" | "vertical", options?: {
    zIndexShift?: number,
    autoPosition?: boolean,
    useIntersection?: boolean,
    theme?: string,
}) => {
    const { zIndexShift = 1, autoPosition = true, useIntersection = false, theme = "default" } = options || {};

    scrollbar.classList.add(`scrollbar-theme-${theme}`);
    scrollbar.setAttribute("data-axis", axis);

    const cleanupFunctions: (() => void)[] = [];

    if (autoPosition) {
        if (useIntersection) {
            const intersectionBox: any[] = enhancedIntersectionBoxAnchorRef(content as HTMLElement, {
                root: window as any,
                observeResize: true,
                observeMutations: true,
                observeIntersection: true
            }) as any[];

            cleanupFunctions.push(bindScrollbarPosition(scrollbar, intersectionBox as any[], axis, {
                useIntersection: true,
                zIndexShift
            }));
        } else {
            const box: any[] = boundingBoxAnchorRef(content as HTMLElement, {
                observeResize: true,
                observeMutations: true
            }) as any[];

            cleanupFunctions.push(bindScrollbarPosition(scrollbar, box, axis, {
                useIntersection: false,
                zIndexShift
            }));
        }
    }

    if (!scrollbar.parentNode) {
        document.body.appendChild(scrollbar);
    }

    observeDisconnect(content, () => {
        cleanupFunctions.forEach((cleanup) => cleanup());
        scrollbar.remove();
    });

    return scrollbar;
};

export const createReactiveScrollbarOverlay = (content: HTMLElement, axis: "horizontal" | "vertical" = "vertical") => {
    const scrollbar = document.createElement("div");
    scrollbar.className = `reactive-scrollbar reactive-scrollbar-${axis}`;
    scrollbar.style.background = "rgba(0,0,0,0.3)";
    scrollbar.style.borderRadius = "4px";
    scrollbar.style.position = "absolute";
    scrollbar.style.zIndex = "1000";

    if (axis === "horizontal") {
        scrollbar.style.height = "8px";
        scrollbar.style.width = "100px";
    } else {
        scrollbar.style.width = "8px";
        scrollbar.style.height = "100px";
    }

    return appendScrollbarOverlay(content, scrollbar, axis, {
        autoPosition: true,
        useIntersection: true,
        theme: "default"
    });
};
