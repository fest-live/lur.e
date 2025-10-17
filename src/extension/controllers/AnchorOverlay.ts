
// generate only random letters, NOT numbers
export const generateAnchorId = () => {
    const randLetters = Math.random().toString(36).substring(2, 15).replace(/[0-9]/g, '');
    return ("--" + randLetters);
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
    if ((self as any)?.parentElement && !((self as any)?.parentElement instanceof DocumentFragment)) {
        ((self as any)?.parentElement as any).style.setProperty("anchor-scope", CSSAnchorId);
        (self as any)?.after?.(element);
    } else {
        requestAnimationFrame(()=>{
            if ((self as any)?.parentElement && !((self as any)?.parentElement instanceof DocumentFragment)) {
                ((self as any)?.parentElement as any).style.setProperty("anchor-scope", CSSAnchorId);
                (self as any)?.after?.(element);
            }
        });
    }

    //
    element.style.setProperty("position-visibility", `always`);
    element.style.setProperty("position-anchor", CSSAnchorId);
    element.style.setProperty("position", `absolute`);
    //element.style.setProperty("position-area", `span-all`);

    element.style.setProperty("inset-block-start", `calc(anchor(start, 0px) + 2.5rem)`);
    element.style.setProperty("inset-inline-start", `calc(anchor(start, 0px) + 0.25rem)`);
    element.style.setProperty("inset-block-end", `calc(anchor(end, 0px) + 0.25rem)`);
    element.style.setProperty("inset-inline-end", `calc(anchor(end, 0px) + 0.25rem)`);

    element.style.setProperty("z-index", ((Number((getComputedStyle(self)?.zIndex || self?.style.zIndex) || 0) || 0) + 200) + "");
    element.style.setProperty("inline-size", `calc(anchor-size(self-inline, 640px) - 0.5rem)`);
    element.style.setProperty("block-size", `calc(anchor-size(self-block, 480px) - 2.75rem)`);


    requestAnimationFrame(()=>{
        element.style.setProperty("z-index", ((Number((getComputedStyle(self)?.zIndex || self?.style.zIndex) || 0) || 0) + 200) + "");
    });

    //
    element?.setAttribute("data-overlay", "true");
    element?.setAttribute("data-window-frame", self.getAttribute("data-name") ?? self.getAttribute("name") ?? self.getAttribute("id") ?? "");

    //
    console.log("appendAsOverlay", self, element, anchor);
    return self;
}
