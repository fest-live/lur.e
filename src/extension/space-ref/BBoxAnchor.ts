import { addToCallChain, computed, numberRef } from "fest/object";
import { addEvent, getBoundingOrientRect, handleStyleChange } from "fest/dom";
import { bindWith } from "fest/lure";

// may be used for underlying dynamic shadows and clipping masks
export function intersectionBoxAnchorRef(anchor: HTMLElement, options?: {
    root?: HTMLElement,
    observeResize?: boolean,
    observeMutations?: boolean,
    observeIntersection?: boolean,
}) {
    if (!anchor) return () => { };
    const area = [
        numberRef(0), numberRef(0), numberRef(0), numberRef(0), numberRef(0), numberRef(0)
    ]
    const { root = window, observeResize = true, observeMutations = true, observeIntersection = true } = options || {};

    //
    const computeIntersectionManually = (anchor) => {
        const rect = (root instanceof HTMLElement ? (getBoundingOrientRect(root) ?? root?.getBoundingClientRect?.()) : null) ?? {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            width: 0,
            height: 0
        };
        const anchorRect = getBoundingOrientRect(anchor) ?? anchor?.getBoundingClientRect?.();
        return {
            left: rect?.left - anchorRect?.left,
            top: rect?.top - anchorRect?.top,
            right: rect?.right - anchorRect?.right,
            bottom: rect?.bottom - anchorRect?.bottom,
            width: rect?.width - anchorRect?.width,
            height: rect?.height - anchorRect?.height,
        } as DOMRect;
    }

    //
    function updateArea(intersectionRect?: DOMRectReadOnly) {
        const rect: any = intersectionRect ?? computeIntersectionManually(anchor);
        area[0].value = rect?.left; // x
        area[1].value = rect?.top;  // y
        area[2].value = rect?.width || (rect?.right - rect?.left); // width
        area[3].value = rect?.height || (rect?.bottom - rect?.top); // height
        area[4].value = rect?.right;  // to right
        area[5].value = rect?.bottom; // to bottom
    }

    //
    let resizeObs: ResizeObserver | undefined;
    if (observeResize && "ResizeObserver" in window && typeof ResizeObserver != "undefined") {
        resizeObs = typeof ResizeObserver != "undefined" ? new ResizeObserver((entries) => {
            for (const entry of entries) {
                updateArea(entry.contentRect);
            }
        }) : undefined;
        resizeObs?.observe(anchor);
    }

    //
    let mutationObs: MutationObserver | undefined;
    if (observeMutations) {
        mutationObs = typeof MutationObserver != "undefined" ? new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                updateArea(computeIntersectionManually(anchor));
            }
        }) : undefined;
        mutationObs?.observe(anchor, { attributes: true, childList: true, subtree: true });
    }

    //
    let intersectionObs: IntersectionObserver | undefined;
    if (observeIntersection) {
        intersectionObs = typeof IntersectionObserver != "undefined" ? new IntersectionObserver((entries) => {
            for (const entry of entries) {
                updateArea(entry.intersectionRect);
            }
        }, {
            root: root instanceof HTMLElement ? root : null,
            threshold: [0],
            rootMargin: "0px"
        }) : undefined;
        intersectionObs?.observe(anchor);
    }

    //
    const listening = [
        addEvent(root, "scroll", () => updateArea(computeIntersectionManually(anchor)), { capture: true }),
        addEvent(window, "resize", () => updateArea(computeIntersectionManually(anchor))),
        addEvent(window, "scroll", () => updateArea(computeIntersectionManually(anchor)), { capture: true })
    ];

    //
    updateArea(computeIntersectionManually(anchor));
    function destroy() {
        listening.forEach(ub=>ub?.());
        resizeObs?.disconnect?.();
        mutationObs?.disconnect?.();
        intersectionObs?.disconnect?.();
    }

    //
    if (destroy) {
        area.forEach(ub=>addToCallChain(ub, Symbol.dispose, destroy));
    }
    return area;
}

//
export function boundingBoxAnchorRef(anchor: HTMLElement, options?: {
    root?: HTMLElement,
    observeResize?: boolean,
    observeMutations?: boolean,
}) {
    if (!anchor) return () => { };
    const area = [
        numberRef(0), numberRef(0), numberRef(0), numberRef(0), numberRef(0), numberRef(0)
    ]
    const { root = window, observeResize = true, observeMutations = false } = options || {};

    //
    function updateArea() {
        const rect  = anchor?.getBoundingClientRect?.() ?? {};
        area[0].value = rect?.left; // x
        area[1].value = rect?.top;  // y
        area[2].value = rect?.right - rect?.left; // width
        area[3].value = rect?.bottom - rect?.top; // height
        area[4].value = rect?.right;  // to right
        area[5].value = rect?.bottom; // to bottom
    }

    //
    const listening = [
        addEvent(root, "scroll", updateArea, { capture: true }),
        addEvent(window, "resize", updateArea),
        addEvent(window, "scroll", updateArea, { capture: true })
    ];

    //
    let resizeObs: ResizeObserver | undefined;
    if (observeResize && "ResizeObserver" in window && typeof ResizeObserver != "undefined") {
        resizeObs = typeof ResizeObserver != "undefined" ? new ResizeObserver(updateArea) : undefined;
        resizeObs?.observe(anchor);
    }

    //
    let mutationObs: MutationObserver | undefined;
    if (observeMutations) {
        mutationObs = typeof MutationObserver != "undefined" ? new MutationObserver(updateArea) : undefined;
        mutationObs?.observe(anchor, { attributes: true, childList: true, subtree: true });
    }

    //
    updateArea();
    function destroy() {
        listening.forEach(ub=>ub?.());
        resizeObs?.disconnect?.();
        mutationObs?.disconnect?.();
    }

    //
    if (destroy) {
        area.forEach(ub=>addToCallChain(ub, Symbol.dispose, destroy));
    }
    return area;
}

//
export const asPx = (unit: any) => {
    return computed(unit, (v) => `${v || 0}px`);
}

//
export const bindWithRect = (anchor: HTMLElement, area: any|null, options?: {
    root?: HTMLElement,
    observeResize?: boolean,
    observeMutations?: boolean,
    placement?: "fill" | "bottom" | "top" | "left" | "right" | "center",
}) => {
    if (!anchor) return () => { };

    //
    const [left, top, width, height, right, bottom] = area;
    const usb: any[] = [];

    //
    if (options?.placement == "fill") {
        usb.push(bindWith(anchor, "inset-block-start", asPx(left), handleStyleChange));
        usb.push(bindWith(anchor, "inset-inline-start", asPx(top), handleStyleChange));
        usb.push(bindWith(anchor, "inset-block-end", asPx(right), handleStyleChange));
        usb.push(bindWith(anchor, "inset-inline-end", asPx(bottom), handleStyleChange));
        usb.push(bindWith(anchor, "inline-size", asPx(width), handleStyleChange));
        usb.push(bindWith(anchor, "block-size", asPx(height), handleStyleChange));
    }
    else if (options?.placement == "bottom") {
        usb.push(bindWith(anchor, "inset-block-start", asPx(bottom), handleStyleChange));
        usb.push(bindWith(anchor, "inset-inline-start", asPx(left), handleStyleChange));
        usb.push(bindWith(anchor, "inline-size", asPx(width), handleStyleChange));
    }
    else if (options?.placement == "top") {
        usb.push(bindWith(anchor, "inset-block-end", asPx(top), handleStyleChange));
        usb.push(bindWith(anchor, "inset-inline-start", asPx(left), handleStyleChange));
        usb.push(bindWith(anchor, "inline-size", asPx(width), handleStyleChange));
    }
    else if (options?.placement == "left") {
        usb.push(bindWith(anchor, "inset-inline-end", asPx(right), handleStyleChange));
        usb.push(bindWith(anchor, "inset-block-start", asPx(top), handleStyleChange));
        usb.push(bindWith(anchor, "block-size", asPx(height), handleStyleChange));
    }
    else if (options?.placement == "right") {
        usb.push(bindWith(anchor, "inset-inline-start", asPx(left), handleStyleChange));
        usb.push(bindWith(anchor, "inset-block-start", asPx(top), handleStyleChange));
        usb.push(bindWith(anchor, "block-size", asPx(height), handleStyleChange));
    }
    else if (options?.placement == "center") {
        usb.push(bindWith(anchor, "inset-inline-start", asPx(left), handleStyleChange));
        usb.push(bindWith(anchor, "inset-block-start", asPx(top), handleStyleChange));
        usb.push(bindWith(anchor, "inline-size", asPx(width), handleStyleChange));
        usb.push(bindWith(anchor, "block-size", asPx(height), handleStyleChange));
    }
    return () => { usb?.forEach?.(ub=>ub?.()); };
};
