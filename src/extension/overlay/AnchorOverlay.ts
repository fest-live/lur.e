import { makeAnchorElement } from "../css-ref/CSSAnchor";
import { bindScrollbarPosition, boundingBoxAnchorRef } from "../space-ref/BBoxAnchor";
import { enhancedIntersectionBoxAnchorRef } from "../space-ref/IntersectionAnchor";

//
export const getParentOrShadowRoot = (element: HTMLElement): HTMLElement|ShadowRoot|undefined => {
    if ((element as any)?.parentElement) {
        return (!((element as any)?.parentElement instanceof DocumentFragment) ? (element as any)?.parentElement as HTMLElement : undefined);
    }
    return (element as any)?.host?.shadowRoot as ShadowRoot;
}

//
export const observeDisconnect = (element: Element, handleMutation) => {
    if (!element?.isConnected) {
        return handleMutation();
    }

    //
    const observer = new MutationObserver((mutationList, observer) => {
        for (const mutation of mutationList) {
            if (mutation.type == "childList") {
                if (Array.from(mutation?.removedNodes||[]).some((node)=>(node === element || node?.contains?.(element)))) {
                    queueMicrotask(()=>handleMutation(mutation));
                    observer?.disconnect?.();
                }
            }
        }
    });

    //
    const parent = getParentOrShadowRoot(element as HTMLElement) ?? document.documentElement;
    const observed = (parent instanceof HTMLElement ? parent : parent?.host) ?? parent;
    queueMicrotask(() => observer.observe(observed, {
        subtree: true,
        childList: true
    }));
}

//
export const observeConnect = (element: Element, handleMutation) => {
    if (element?.isConnected) {
        return handleMutation();
    }

    //
    const observer = new MutationObserver((mutationList, observer) => {
        for (const mutation of mutationList) {
            if (mutation.type == "childList") {
                if (Array.from(mutation?.addedNodes||[]).some((node)=>(node === element || node?.contains?.(element)))) {
                    queueMicrotask(()=>handleMutation(mutation));
                    observer?.disconnect?.();
                }
            }
        }
    });

    //
    const parent = getParentOrShadowRoot(element as HTMLElement) ?? document.documentElement;
    const observed = (parent instanceof HTMLElement ? parent : parent?.host) ?? parent;
    queueMicrotask(() => observer.observe(observed, {
        subtree: true,
        childList: true
    }));
}

//
export const appendAsOverlay = (anchor: HTMLElement|null, overlay?: HTMLElement|null, self?: HTMLElement|null, options?: {
    root?: HTMLElement,
    zIndexShift?: number,
    placement?: "fill" | "bottom" | "top" | "left" | "right" | "center" | "scrollbar-x" | "scrollbar-y",
    inset?: number,
    size?: string,
    transformOrigin?: string,
    useIntersection?: boolean,
}) => {
    const {
        root = window,
        zIndexShift = 1,
        placement = "fill",
        inset = 0,
        size = "100%",
        transformOrigin = "50% 50%",
        useIntersection = false
    } = options || {};
    anchor ??= (self?.children?.[0] as HTMLElement) ?? anchor;

    //
    if (!anchor && (self?.children?.length ?? 0) < 1) {
        // fix anchor problems
        const fillAnchorBox = document.createElement("div");
        fillAnchorBox.classList.add("ui-window-frame-anchor-box");
        fillAnchorBox.style.position = "relative";
        fillAnchorBox.style.inlineSize = "stretch";
        fillAnchorBox.style.blockSize = "stretch";
        fillAnchorBox.style.zIndex = String(zIndexShift + 0);
        fillAnchorBox.style.pointerEvents = "none";
        fillAnchorBox.style.opacity = "1";
        fillAnchorBox.style.visibility = "visible";
        fillAnchorBox.style.backgroundColor = "transparent";
        (self as any)?.append?.(anchor = fillAnchorBox);
    }

    //
    if (anchor == null || overlay == null) return;
    const anchorBinder = makeAnchorElement(anchor);

    // Handle scrollbar-specific placements
    if (placement === "scrollbar-x") {
        anchorBinder.connectElement(overlay, {
            placement: "bottom",
            zIndexShift,
            inset,
            size,
            transformOrigin
        });
    } else if (placement === "scrollbar-y") {
        anchorBinder.connectElement(overlay, {
            placement: "right",
            zIndexShift,
            inset,
            size,
            transformOrigin
        });
    } else {
        anchorBinder.connectElement(overlay, {
            placement,
            zIndexShift,
            inset,
            size,
            transformOrigin
        });
    }

    //
    observeConnect(anchor, () => {
        const parent = getParentOrShadowRoot(anchor) ?? self;
        const styled = parent instanceof HTMLElement ? parent : parent?.host;
        (styled as HTMLElement)?.style?.setProperty?.("anchor-scope", anchorBinder.anchorId);
        (anchor as any)?.after?.(overlay);
        observeDisconnect(parent as Element, () => overlay?.remove?.());
    });

    //
    return anchor;
}

// Enhanced scrollbar overlay with reactive positioning
export const appendScrollbarOverlay = (content: HTMLElement, scrollbar: HTMLElement, axis: 'horizontal' | 'vertical', options?: {
    zIndexShift?: number,
    autoPosition?: boolean,
    useIntersection?: boolean,
    theme?: string,
}) => {
    const { zIndexShift = 1, autoPosition = true, useIntersection = false, theme = "default" } = options || {};

    // Set theme class
    scrollbar.classList.add(`scrollbar-theme-${theme}`);
    scrollbar.setAttribute("data-axis", axis);

    let cleanupFunctions: (() => void)[] = [];

    if (autoPosition) {
        // Use enhanced intersection box for precise positioning
        if (useIntersection) {
            const intersectionBox: any[] = enhancedIntersectionBoxAnchorRef(content as HTMLElement, {
                root: window as any,
                observeResize: true,
                observeMutations: true,
                observeIntersection: true
            }) as any[];

            // Position scrollbar using reactive bindings
            cleanupFunctions.push(bindScrollbarPosition(scrollbar, intersectionBox as any[], axis, {
                useIntersection: true,
                zIndexShift
            }));
        } else {
            // Use standard bounding box with reactive bindings
            const box: any[] = boundingBoxAnchorRef(content as HTMLElement, {
                observeResize: true,
                observeMutations: true
            }) as any[];

            // Position scrollbar using reactive bindings
            cleanupFunctions.push(bindScrollbarPosition(scrollbar, box, axis, {
                useIntersection: false,
                zIndexShift
            }));
        }
    }

    // Add scrollbar to DOM
    if (!scrollbar.parentNode) {
        document.body.appendChild(scrollbar);
    }

    // Set up removal on content disconnect with cleanup
    observeDisconnect(content, () => {
        cleanupFunctions.forEach(cleanup => cleanup());
        scrollbar.remove();
    });

    //
    return scrollbar;
};

// Example usage function for testing reactive scrollbar overlays
export const createReactiveScrollbarOverlay = (content: HTMLElement, axis: 'horizontal' | 'vertical' = 'vertical') => {
    // Create scrollbar element
    const scrollbar = document.createElement('div');
    scrollbar.className = `reactive-scrollbar reactive-scrollbar-${axis}`;
    scrollbar.style.background = 'rgba(0,0,0,0.3)';
    scrollbar.style.borderRadius = '4px';
    scrollbar.style.position = 'absolute';
    scrollbar.style.zIndex = '1000';

    if (axis === 'horizontal') {
        scrollbar.style.height = '8px';
        scrollbar.style.width = '100px';
    } else {
        scrollbar.style.width = '8px';
        scrollbar.style.height = '100px';
    }

    // Use reactive positioning
    return appendScrollbarOverlay(content, scrollbar, axis, {
        autoPosition: true,
        useIntersection: true,
        theme: 'default'
    });
};
