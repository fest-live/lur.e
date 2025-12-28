import { numberRef, addToCallChain } from "fest/object";
import { addEvent, handleStyleChange } from "fest/dom";
import {
    vector2Ref, bindWith, Vector2D,
    rectCenter, rectArea, Rect2D, rectContainsPoint, rectIntersects,
    clampPointToRect, pointToRectDistance
} from "fest/lure";
import { CSSBinder, CSSUnitUtils } from "fest/lure";
import { ReactiveElementSize } from "../css-ref/Utils";

//
export function boundingBoxAnchorRef(anchor: HTMLElement, options?: {
    root?: HTMLElement,
    observeResize?: boolean,
    observeMutations?: boolean,
}) {
    if (!anchor) return () => { };

    // Create reactive vectors for position and size
    const position = vector2Ref(0, 0); // x, y
    const size = vector2Ref(0, 0);     // width, height
    const area = [
        position.x, position.y, // x, y
        size.x, size.y,         // width, height
        numberRef(0), numberRef(0) // to right, to bottom (computed)
    ];

    // Reactive rectangle representation
    const rect: Rect2D = { position, size };
    const center = rectCenter(rect);
    const reactiveArea = rectArea(rect);

    const { root = anchor?.offsetParent ?? document.documentElement, iterateResize = true, iterateMutations = false } = options || {};

    // Reactive element size tracker
    const elementSize = new ReactiveElementSize(anchor);

    //
    function updateArea() {
        const rect  = anchor?.getBoundingClientRect?.() ?? {};
        position.x.value = rect?.left; // x
        position.y.value = rect?.top;  // y
        size.x.value = rect?.right - rect?.left; // width
        size.y.value = rect?.bottom - rect?.top; // height
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

    // Return enhanced area with vector, rectangle, and CSS operations
    const enhancedArea = Object.assign(area, {
        position,       // Vector2D for x, y
        size,          // Vector2D for width, height
        rect,          // Rect2D interface
        center,        // Reactive center point
        area: reactiveArea, // Reactive area calculation
        elementSize,   // ReactiveElementSize instance

        // Rectangle operations
        containsPoint: (point: Vector2D) => rectContainsPoint(rect, point),
        intersects: (otherRect: Rect2D) => rectIntersects(rect, otherRect),
        clampPoint: (point: Vector2D) => clampPointToRect(point, rect),
        distanceToPoint: (point: Vector2D) => pointToRectDistance(point, rect),

        // CSS binding utilities
        bindPosition: (element: HTMLElement) => CSSBinder.bindPosition(element, position),
        bindSize: (element: HTMLElement) => CSSBinder.bindSize(element, size),
        bindCenter: (element: HTMLElement) => CSSBinder.bindPosition(element, center),

        destroy: () => {
            elementSize.destroy();
            destroy();
        }
    });

    return enhancedArea;
}

//
// Unit conversion utilities now imported from CSSUnitUtils

//
export const bindWithRect = (anchor: HTMLElement, area: any|null, options?: {
    root?: HTMLElement,
    observeResize?: boolean,
    observeMutations?: boolean,
    placement?: "fill" | "bottom" | "top" | "left" | "right" | "center",
}) => {
    if (!anchor) return () => { };

    //
    if (area?.connectElement) {
        return area?.connectElement?.(anchor, options || {});
    }

    //
    const [left, top, width, height, right, bottom] = area;
    const usb: any[] = [];

    //
    if (options?.placement == "fill") {
        usb.push(bindWith(anchor, "inset-block-start", CSSUnitUtils.asPx(left), handleStyleChange));
        usb.push(bindWith(anchor, "inset-inline-start", CSSUnitUtils.asPx(top), handleStyleChange));
        usb.push(bindWith(anchor, "inset-block-end", CSSUnitUtils.asPx(right), handleStyleChange));
        usb.push(bindWith(anchor, "inset-inline-end", CSSUnitUtils.asPx(bottom), handleStyleChange));
        usb.push(bindWith(anchor, "inline-size", CSSUnitUtils.asPx(width), handleStyleChange));
        usb.push(bindWith(anchor, "block-size", CSSUnitUtils.asPx(height), handleStyleChange));
    }
    else if (options?.placement == "bottom") {
        usb.push(bindWith(anchor, "inset-block-start", CSSUnitUtils.asPx(bottom), handleStyleChange));
        usb.push(bindWith(anchor, "inset-inline-start", CSSUnitUtils.asPx(left), handleStyleChange));
        usb.push(bindWith(anchor, "inline-size", CSSUnitUtils.asPx(width), handleStyleChange));
    }
    else if (options?.placement == "top") {
        usb.push(bindWith(anchor, "inset-block-end", CSSUnitUtils.asPx(top), handleStyleChange));
        usb.push(bindWith(anchor, "inset-inline-start", CSSUnitUtils.asPx(left), handleStyleChange));
        usb.push(bindWith(anchor, "inline-size", CSSUnitUtils.asPx(width), handleStyleChange));
    }
    else if (options?.placement == "left") {
        usb.push(bindWith(anchor, "inset-inline-end", CSSUnitUtils.asPx(right), handleStyleChange));
        usb.push(bindWith(anchor, "inset-block-start", CSSUnitUtils.asPx(top), handleStyleChange));
        usb.push(bindWith(anchor, "block-size", CSSUnitUtils.asPx(height), handleStyleChange));
    }
    else if (options?.placement == "right") {
        usb.push(bindWith(anchor, "inset-inline-start", CSSUnitUtils.asPx(left), handleStyleChange));
        usb.push(bindWith(anchor, "inset-block-start", CSSUnitUtils.asPx(top), handleStyleChange));
        usb.push(bindWith(anchor, "block-size", CSSUnitUtils.asPx(height), handleStyleChange));
    }
    else if (options?.placement == "center") {
        usb.push(bindWith(anchor, "inset-inline-start", CSSUnitUtils.asPx(left), handleStyleChange));
        usb.push(bindWith(anchor, "inset-block-start", CSSUnitUtils.asPx(top), handleStyleChange));
        usb.push(bindWith(anchor, "inline-size", CSSUnitUtils.asPx(width), handleStyleChange));
        usb.push(bindWith(anchor, "block-size", CSSUnitUtils.asPx(height), handleStyleChange));
    }
    return () => { usb?.forEach?.(ub=>ub?.()); };
};

// Enhanced binding for scrollbar positioning with intersection support
export const bindScrollbarPosition = (scrollbar: HTMLElement, anchorBox: any[]|any, axis: 'horizontal' | 'vertical', options?: {
    useIntersection?: boolean,
    zIndexShift?: number,
}) => {
    const { useIntersection = false, zIndexShift = 1 } = options || {};
    const usb: any[] = [];

    //
    if (anchorBox?.connectElement) {
        return anchorBox?.connectElement?.(scrollbar, Object.assign(options || {}, {
            placement: axis == "horizontal" ? "bottom" : "right"
        }));
    }

    //
    scrollbar.style.position = useIntersection ? 'fixed' : 'absolute';
    scrollbar.style.zIndex = `${zIndexShift}`;

    if (useIntersection) {
        // Intersection box: [ix, iy, iwidth, iheight, iright, ibottom, ax, ay, awidth, aheight, rx, ry, rwidth, rheight]
        if (axis === 'horizontal') {
            // Position at bottom of intersection area
            usb.push(bindWith(scrollbar, "left", CSSUnitUtils.asPx(anchorBox[0]), handleStyleChange));     // intersection x
            usb.push(bindWith(scrollbar, "top", CSSUnitUtils.asPx(anchorBox[5]), handleStyleChange));     // intersection bottom
            usb.push(bindWith(scrollbar, "width", CSSUnitUtils.asPx(anchorBox[2]), handleStyleChange));  // intersection width
        } else {
            // Position at right of intersection area
            usb.push(bindWith(scrollbar, "left", CSSUnitUtils.asPx(anchorBox[4]), handleStyleChange));    // intersection right
            usb.push(bindWith(scrollbar, "top", CSSUnitUtils.asPx(anchorBox[1]), handleStyleChange));     // intersection y
            usb.push(bindWith(scrollbar, "height", CSSUnitUtils.asPx(anchorBox[3]), handleStyleChange)); // intersection height
        }
    } else {
        // Regular bounding box: [x, y, width, height, right, bottom]
        if (axis === 'horizontal') {
            // Position at bottom of content area
            usb.push(bindWith(scrollbar, "left", CSSUnitUtils.asPx(anchorBox[0]), handleStyleChange));     // x
            usb.push(bindWith(scrollbar, "top", CSSUnitUtils.asPx(anchorBox[5]), handleStyleChange));     // bottom
            usb.push(bindWith(scrollbar, "width", CSSUnitUtils.asPx(anchorBox[2]), handleStyleChange));  // width
        } else {
            // Position at right of content area
            usb.push(bindWith(scrollbar, "left", CSSUnitUtils.asPx(anchorBox[4]), handleStyleChange));    // right
            usb.push(bindWith(scrollbar, "top", CSSUnitUtils.asPx(anchorBox[1]), handleStyleChange));     // y
            usb.push(bindWith(scrollbar, "height", CSSUnitUtils.asPx(anchorBox[3]), handleStyleChange)); // height
        }
    }

    return () => { usb?.forEach?.(ub=>ub?.()); };
};
