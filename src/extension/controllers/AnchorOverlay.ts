
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
export const appendAsOverlay = (self: HTMLElement, element?: HTMLElement) => {
    let anchor: any = self?.children?.[0] ?? null;
    if (self?.children?.length < 1) {
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
        (self as any).append(anchor = fillAnchorBox);
    }

    //
    if (anchor == null || element == null) { return; }

    //
    const CSSAnchorId = generateAnchorId();

    anchor.style.setProperty("position-visibility", `always`);
    //anchor.style.setProperty("anchor-name", CSSAnchorId);
    //self.style.setProperty("anchor-scope", CSSAnchorId);
    self.style.setProperty("anchor-name", CSSAnchorId);

    //
    const parent = getParentOrShadowRoot(self);
    const styleApplicable = parent instanceof HTMLElement ? parent : parent?.host;
    if (parent) {
        (styleApplicable as HTMLElement)?.style?.setProperty?.("anchor-scope", CSSAnchorId);
        (self as any)?.after?.(element);
    } else {
        requestAnimationFrame(()=>{
            const parent = getParentOrShadowRoot(self);
            const styleApplicable = parent instanceof HTMLElement ? parent : parent?.host;
            if (parent) {
                (styleApplicable as HTMLElement)?.style?.setProperty?.("anchor-scope", CSSAnchorId);
                (self as any)?.after?.(element);
            }
        });
    }

    //
    if (self?.matches?.("ui-window-frame")) {
        element.style.setProperty("inset-block-start", `calc(anchor(start, 0px) + 2.5rem)`);
        element.style.setProperty("inset-inline-start", `calc(anchor(start, 0px) + 0.25rem)`);
        element.style.setProperty("inset-block-end", `calc(anchor(end, 0px) + 0.25rem)`);
        element.style.setProperty("inset-inline-end", `calc(anchor(end, 0px) + 0.25rem)`);
        element.style.setProperty("inline-size", `calc(anchor-size(inline, 640px) - 0.5rem)`);
        element.style.setProperty("block-size", `calc(anchor-size(block, 480px) - 2.75rem)`);
    }
    else {
        element.style.setProperty("inset-block-start", `anchor(start, 0px)`);
        element.style.setProperty("inset-inline-start", `anchor(start, 0px)`);
        element.style.setProperty("inset-block-end", `anchor(end, 0px)`);
        element.style.setProperty("inset-inline-end", `anchor(end, 0px)`);
        element.style.setProperty("inline-size", `anchor-size(inline, 100%)`);
        element.style.setProperty("block-size", `anchor-size(block, 100%)`);
    }

    //
    element.style.setProperty("position-visibility", `always`);
    element.style.setProperty("position-anchor", CSSAnchorId);
    element.style.setProperty("position", `absolute`);
    element.style.setProperty("position-area", `span-all`);
    element.style.setProperty("z-index", String(getExistsZIndex(self) + 200));

    //
    element?.setAttribute("data-overlay", "true");
    element?.setAttribute("data-window-frame", self.getAttribute("data-name") ?? self.getAttribute("name") ?? self.getAttribute("id") ?? "");
    return self;
}
