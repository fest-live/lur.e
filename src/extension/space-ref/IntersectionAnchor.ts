import { addToCallChain, computed, numberRef } from "fest/object";
import { addEvent, getBoundingOrientRect, handleStyleChange } from "fest/dom";
import { bindWith } from "fest/lure";

//
const computeIntersectionRect = (anchor: HTMLElement, root: HTMLElement = document.documentElement, includeExtendedInfo = false) => {
    // Get root rectangle (viewport or container)
    const rootRect = getBoundingOrientRect(root) ?? root?.getBoundingClientRect?.();

    // Get anchor element rectangle
    const anchorRect = getBoundingOrientRect(anchor) ?? anchor?.getBoundingClientRect?.();
    if (!anchorRect) {
        return includeExtendedInfo ? {
            intersection: { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 },
            anchor: { left: 0, top: 0, width: 0, height: 0 },
            root: rootRect
        } : { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 };
    }

    // Calculate intersection rectangle
    const intersectionLeft = Math.max(rootRect.left, anchorRect.left);
    const intersectionTop = Math.max(rootRect.top, anchorRect.top);
    const intersectionRight = Math.min(rootRect.right, anchorRect.right);
    const intersectionBottom = Math.min(rootRect.bottom, anchorRect.bottom);

    // Check if there's actually an intersection
    const hasIntersection = intersectionRight > intersectionLeft && intersectionBottom > intersectionTop;

    const intersection = hasIntersection ? {
        left: intersectionLeft,
        top: intersectionTop,
        right: intersectionRight,
        bottom: intersectionBottom,
        width: intersectionRight - intersectionLeft,
        height: intersectionBottom - intersectionTop
    } : { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 };

    if (includeExtendedInfo) {
        return {
            intersection,
            anchor: anchorRect,
            root: rootRect,
            // Additional properties for shadow/filter calculations
            anchorLeft: anchorRect.left,
            anchorTop: anchorRect.top,
            anchorRight: anchorRect.right,
            anchorBottom: anchorRect.bottom,
            anchorWidth: anchorRect.width,
            anchorHeight: anchorRect.height,
            rootLeft: rootRect.left,
            rootTop: rootRect.top,
            rootWidth: rootRect.width,
            rootHeight: rootRect.height
        };
    }

    return intersection;
};




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
    const { root = anchor?.offsetParent ?? document.documentElement, observeResize = true, observeMutations = true, observeIntersection = true } = options || {};

    //
    function updateArea(intersectionRect?: any) {
        const rect: any = intersectionRect ? {
            left: intersectionRect.left,
            top: intersectionRect.top,
            width: intersectionRect.width,
            height: intersectionRect.height,
            right: intersectionRect.right,
            bottom: intersectionRect.bottom
        } : computeIntersectionRect(anchor as HTMLElement, root as HTMLElement, false);
        area[0].value = rect?.left ?? 0; // intersection x
        area[1].value = rect?.top ?? 0;  // intersection y
        area[2].value = rect?.width ?? 0; // intersection width
        area[3].value = rect?.height ?? 0; // intersection height
        area[4].value = rect?.right ?? 0;  // intersection right
        area[5].value = rect?.bottom ?? 0; // intersection bottom
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
                updateArea(computeIntersectionRect(anchor as HTMLElement, root as HTMLElement, false));
            }
        }) : undefined;
        mutationObs?.observe(anchor, { attributes: true, childList: true, subtree: true });
    }

    //
    let intersectionObs: IntersectionObserver | undefined;
    if (observeIntersection) {
        intersectionObs = typeof IntersectionObserver != "undefined" ? new IntersectionObserver((entries) => {
            for (const entry of entries) {
                updateArea(entry.intersectionRect as any);
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
        addEvent(root, "scroll", () => updateArea(computeIntersectionRect(anchor as HTMLElement, root as HTMLElement, false)), { capture: true }),
        addEvent(window, "resize", () => updateArea(computeIntersectionRect(anchor as HTMLElement, root as HTMLElement, false))),
        addEvent(window, "scroll", () => updateArea(computeIntersectionRect(anchor as HTMLElement, root as HTMLElement, false)), { capture: true })
    ];

    //
    updateArea(computeIntersectionRect(anchor as HTMLElement, root as HTMLElement, false));

    //
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


// Enhanced intersection box anchor with detailed geometry information
export function enhancedIntersectionBoxAnchorRef(anchor: HTMLElement, options?: {
    root?: HTMLElement,
    observeResize?: boolean,
    observeMutations?: boolean,
    observeIntersection?: boolean,
}) {
    if (!anchor) return () => { };

    // Extended area array: [ix, iy, iwidth, iheight, iright, ibottom, ax, ay, awidth, aheight, rx, ry, rwidth, rheight]
    const area = [
        numberRef(0), numberRef(0), numberRef(0), numberRef(0), numberRef(0), numberRef(0), // intersection: x, y, width, height, right, bottom
        numberRef(0), numberRef(0), numberRef(0), numberRef(0), // anchor: x, y, width, height
        numberRef(0), numberRef(0), numberRef(0), numberRef(0)  // root: x, y, width, height
    ];

    //
    const { root = anchor?.offsetParent ?? document.documentElement, observeResize = true, observeMutations = true, observeIntersection = true } = options || {};

    //
    function updateArea(intersectionRect?: any) {
        const data = intersectionRect ? {
            intersection: {
                left: intersectionRect.left,
                top: intersectionRect.top,
                right: intersectionRect.right,
                bottom: intersectionRect.bottom,
                width: intersectionRect.width,
                height: intersectionRect.height
            },
            anchor: getBoundingOrientRect(anchor) ?? anchor?.getBoundingClientRect?.(),
            root: (root instanceof HTMLElement ? (getBoundingOrientRect(root) ?? root?.getBoundingClientRect?.()) : null) ?? {
                left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight,
                width: window.innerWidth, height: window.innerHeight
            }
        } : computeIntersectionRect(anchor as HTMLElement, root as HTMLElement, true);

        if (!data.anchor) return;

        // Intersection properties
        area[0].value = data.intersection.left ?? 0;     // intersection x
        area[1].value = data.intersection.top ?? 0;      // intersection y
        area[2].value = data.intersection.width ?? 0;    // intersection width
        area[3].value = data.intersection.height ?? 0;   // intersection height
        area[4].value = data.intersection.right ?? 0;    // intersection right
        area[5].value = data.intersection.bottom ?? 0;   // intersection bottom

        // Anchor properties
        area[6].value = data.anchor.left ?? 0;           // anchor x
        area[7].value = data.anchor.top ?? 0;            // anchor y
        area[8].value = data.anchor.width ?? 0;          // anchor width
        area[9].value = data.anchor.height ?? 0;         // anchor height

        // Root properties
        area[10].value = data.root.left ?? 0;            // root x
        area[11].value = data.root.top ?? 0;             // root y
        area[12].value = data.root.width ?? 0;           // root width
        area[13].value = data.root.height ?? 0;          // root height
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
                updateArea(computeIntersectionRect(anchor as HTMLElement, root as HTMLElement, true).intersection);
            }
        }) : undefined;
        mutationObs?.observe(anchor, { attributes: true, childList: true, subtree: true });
    }

    //
    let intersectionObs: IntersectionObserver | undefined;
    if (observeIntersection) {
        intersectionObs = typeof IntersectionObserver != "undefined" ? new IntersectionObserver((entries) => {
            for (const entry of entries) {
                updateArea(entry.intersectionRect as any);
            }
        }, {
            root: root instanceof HTMLElement ? root : null,
            threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
            rootMargin: "0px"
        }) : undefined;
        intersectionObs?.observe(anchor);
    }

    //
    const listening = [
        addEvent(root, "scroll", () => updateArea(computeIntersectionRect(anchor as HTMLElement, root as HTMLElement, true).intersection), { capture: true }),
        addEvent(window, "resize", () => updateArea(computeIntersectionRect(anchor as HTMLElement, root as HTMLElement, true).intersection)),
        addEvent(window, "scroll", () => updateArea(computeIntersectionRect(anchor as HTMLElement, root as HTMLElement, true).intersection), { capture: true })
    ];

    //
    updateArea(computeIntersectionRect(anchor as HTMLElement, root as HTMLElement, true).intersection);

    //
    function destroy() {
        listening.forEach(ub => ub?.());
        resizeObs?.disconnect?.();
        mutationObs?.disconnect?.();
        intersectionObs?.disconnect?.();
    }

    //
    if (destroy) {
        area.forEach(ub => addToCallChain(ub, Symbol.dispose, destroy));
    }

    return area;
}
