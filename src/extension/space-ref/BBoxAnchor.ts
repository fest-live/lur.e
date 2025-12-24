import { addToCallChain, numberRef } from "fest/object";
import { addEvent } from "fest/dom";

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
