import { makeAnchorElement } from "../css-ref/CSSAnchor";

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
    placement?: "fill" | "bottom" | "top" | "left" | "right" | "center",
}) => {
    const { root = window, zIndexShift = 1, placement = "fill" } = options || {};
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
    anchorBinder.connectElement(overlay, { zIndexShift, root, placement });

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
