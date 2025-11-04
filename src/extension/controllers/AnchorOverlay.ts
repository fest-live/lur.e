
// generate only random letters, NOT numbers
export const generateAnchorId = () => {
    const randLetters = Math.random().toString(36).substring(2, 15).replace(/[0-9]/g, '');
    return ("--" + randLetters);
}

//
const getComputedZIndex = (element: HTMLElement): number => {
    if (element?.computedStyleMap) {
        return Number(element.computedStyleMap().get("z-index")?.toString() || 0) || 0;
    } else {
        return Number(getComputedStyle((element as any)?.element ?? element).getPropertyValue("z-index") || 0) || 0;
    }
}

//
const getExistsZIndex = (element: HTMLElement): number => {
    if (!element) { return 0; }
    if ((element as any)?.attributeStyleMap && (element as any).attributeStyleMap.get("z-index") != null) { return Number((element as any).attributeStyleMap.get("z-index")?.value ?? 0) || 0; }
    if ((element as any)?.style && "zIndex" in (element as any).style && (element as any).style.zIndex != null) { return Number((element as any).style.zIndex || 0) || 0; }
    return getComputedZIndex(element);
}

//
const getParentOrShadowRoot = (element: HTMLElement): HTMLElement|ShadowRoot|undefined => {
    if ((element as any)?.parentElement) {
        return (!((element as any)?.parentElement instanceof DocumentFragment) ? (element as any)?.parentElement as HTMLElement : undefined);
    }
    return (element as any)?.host?.shadowRoot as ShadowRoot;
}

//
export const appendAsOverlay = (anchor: HTMLElement|null, overlay?: HTMLElement|null, self?: HTMLElement|null) => {
    anchor ??= (self?.children?.[0] as HTMLElement) ?? anchor;

    //
    if (!anchor && (self?.children?.length ?? 0) < 1) {
        // fix anchor problems
        const fillAnchorBox = document.createElement("div");
        fillAnchorBox.classList.add("ui-window-frame-anchor-box");
        fillAnchorBox.style.position = "relative";
        fillAnchorBox.style.inlineSize = "stretch";
        fillAnchorBox.style.blockSize = "stretch";
        fillAnchorBox.style.zIndex = "0";
        fillAnchorBox.style.pointerEvents = "none";
        fillAnchorBox.style.opacity = "1";
        fillAnchorBox.style.visibility = "visible";
        fillAnchorBox.style.backgroundColor = "transparent";
        (self as any)?.append?.(anchor = fillAnchorBox);
    }

    //
    if (anchor == null || overlay == null) { return; }

    //
    const CSSAnchorId = generateAnchorId();
    anchor?.style?.setProperty("position-visibility", `always`);
    anchor?.style?.setProperty("anchor-name", CSSAnchorId);

    //
    const parent = getParentOrShadowRoot(anchor) ?? self;
    const styled = parent instanceof HTMLElement ? parent : parent?.host;

    //
    if (parent) {
        (styled as HTMLElement)?.style?.setProperty?.("anchor-scope", CSSAnchorId);
        (anchor as any)?.after?.(overlay);
    } else {
        requestAnimationFrame(()=>{
            const parent = getParentOrShadowRoot(anchor) ?? self;
            const styled = parent instanceof HTMLElement ? parent : parent?.host;
            if (parent) {
                (styled as HTMLElement)?.style?.setProperty?.("anchor-scope", CSSAnchorId);
                (anchor as any)?.after?.(overlay);
            }
        });
    }

    //
    if (anchor?.matches?.("ui-window-frame")) {
        overlay.style.setProperty("inset-block-start", `calc(anchor(start, 0px) + 2.5rem)`);
        overlay.style.setProperty("inset-inline-start", `calc(anchor(start, 0px) + 0.25rem)`);
        overlay.style.setProperty("inset-block-end", `calc(anchor(end, 0px) + 0.25rem)`);
        overlay.style.setProperty("inset-inline-end", `calc(anchor(end, 0px) + 0.25rem)`);
        overlay.style.setProperty("inline-size", `calc(anchor-size(inline, 640px) - 0.5rem)`);
        overlay.style.setProperty("block-size", `calc(anchor-size(block, 480px) - 2.75rem)`);
    }
    else {
        overlay.style.setProperty("inset-block-start", `anchor(start, 0px)`);
        overlay.style.setProperty("inset-inline-start", `anchor(start, 0px)`);
        overlay.style.setProperty("inset-block-end", `anchor(end, 0px)`);
        overlay.style.setProperty("inset-inline-end", `anchor(end, 0px)`);
        overlay.style.setProperty("inline-size", `anchor-size(inline, 100%)`);
        overlay.style.setProperty("block-size", `anchor-size(block, 100%)`);
    }

    //
    overlay.style.setProperty("position-visibility", `always`);
    overlay.style.setProperty("position-anchor", CSSAnchorId);
    overlay.style.setProperty("position", `absolute`);
    overlay.style.setProperty("position-area", `span-all`);
    overlay.style.setProperty("z-index", String(getExistsZIndex(anchor) + 200));

    //
    overlay?.setAttribute("data-overlay", "true");
    overlay?.setAttribute("data-window-frame", anchor?.getAttribute("data-name") ?? anchor?.getAttribute("name") ?? anchor?.getAttribute("id") ?? "");
    return anchor;
}
