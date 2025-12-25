import { addToCallChain, computed, numberRef } from "fest/object";
import { addEvent, getBoundingOrientRect, handleStyleChange } from "fest/dom";
import { bindWith } from "fest/lure";

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

// Enhanced binding for scrollbar positioning with intersection support
export const bindScrollbarPosition = (scrollbar: HTMLElement, anchorBox: any[], axis: 'horizontal' | 'vertical', options?: {
    useIntersection?: boolean,
    zIndexShift?: number,
}) => {
    const { useIntersection = false, zIndexShift = 1 } = options || {};
    const usb: any[] = [];

    scrollbar.style.position = useIntersection ? 'fixed' : 'absolute';
    scrollbar.style.zIndex = `${zIndexShift}`;

    if (useIntersection) {
        // Intersection box: [ix, iy, iwidth, iheight, iright, ibottom, ax, ay, awidth, aheight, rx, ry, rwidth, rheight]
        if (axis === 'horizontal') {
            // Position at bottom of intersection area
            usb.push(bindWith(scrollbar, "left", computed(anchorBox[0], (v) => `${v || 0}px`), handleStyleChange));     // intersection x
            usb.push(bindWith(scrollbar, "top", computed(anchorBox[5], (v) => `${v || 0}px`), handleStyleChange));     // intersection bottom
            usb.push(bindWith(scrollbar, "width", computed(anchorBox[2], (v) => `${v || 0}px`), handleStyleChange));  // intersection width
        } else {
            // Position at right of intersection area
            usb.push(bindWith(scrollbar, "left", computed(anchorBox[4], (v) => `${v || 0}px`), handleStyleChange));    // intersection right
            usb.push(bindWith(scrollbar, "top", computed(anchorBox[1], (v) => `${v || 0}px`), handleStyleChange));     // intersection y
            usb.push(bindWith(scrollbar, "height", computed(anchorBox[3], (v) => `${v || 0}px`), handleStyleChange)); // intersection height
        }
    } else {
        // Regular bounding box: [x, y, width, height, right, bottom]
        if (axis === 'horizontal') {
            // Position at bottom of content area
            usb.push(bindWith(scrollbar, "left", computed(anchorBox[0], (v) => `${v || 0}px`), handleStyleChange));     // x
            usb.push(bindWith(scrollbar, "top", computed(anchorBox[5], (v) => `${v || 0}px`), handleStyleChange));     // bottom
            usb.push(bindWith(scrollbar, "width", computed(anchorBox[2], (v) => `${v || 0}px`), handleStyleChange));  // width
        } else {
            // Position at right of content area
            usb.push(bindWith(scrollbar, "left", computed(anchorBox[4], (v) => `${v || 0}px`), handleStyleChange));    // right
            usb.push(bindWith(scrollbar, "top", computed(anchorBox[1], (v) => `${v || 0}px`), handleStyleChange));     // y
            usb.push(bindWith(scrollbar, "height", computed(anchorBox[3], (v) => `${v || 0}px`), handleStyleChange)); // height
        }
    }

    return () => { usb?.forEach?.(ub=>ub?.()); };
};
