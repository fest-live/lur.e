import { addToCallChain, numberRef, stringRef, booleanRef, WRef } from "fest/object";
import { handleStyleChange, observeContentBox, addEvents, addEvent } from "fest/dom";
import { bindWith } from "../../lure/core/Binding";

//
const ROOT = typeof document != "undefined" ? document?.documentElement : null;
const SELECTOR = "ui-modal[type=\"contextmenu\"], ui-button, ui-taskbar, ui-navbar, ui-statusbar, button, label, input, ui-longtext, ui-focustext, ui-row-select, ui-row-button, .u2-input, .ui-input";
const $set = (rv, key, val)=>{ if (rv?.deref?.() != null) { return (rv.deref()[key] = val); }; }

//
export const handleByPointer = (cb, root = ROOT)=>{
    if (!root) return () => { };
    let pointerId = -1;
    const rst = (ev)=>{ pointerId = -1; };
    const tgi = (ev)=>{ if (pointerId < 0) pointerId = ev.pointerId; if (pointerId == ev.pointerId) { cb?.(ev); } };
    const listening = [
        addEvent(root, "pointerup", rst),
        addEvent(root, "pointercancel", rst),
        addEvent(root, "pointermove", tgi)
    ];
    return ()=>{
        listening.forEach(ub=>ub?.());
    }
}

//
export const handleForFixPosition = (container, cb, root = window)=>{
    if (!root) return () => { };
    const ptu = (ev)=>cb?.(ev);
    const listening = [
        addEvent(container, "scroll", ptu),
        addEvent(root, "resize", ptu)
    ];
    const obs = observeContentBox(container, ptu);
    return ()=>{
        listening.forEach(ub=>ub?.());
        obs?.disconnect?.();
    }
}

//
export const pointerRef = ()=>{
    if (!ROOT) return () => { };
    const coordinate = [ numberRef(0), numberRef(0) ];
    coordinate.push(WRef(handleByPointer((ev)=>{ coordinate[0].value = ev.clientX; coordinate[1].value = ev.clientY; })));
    if (coordinate[2]?.deref?.() ?? coordinate[2]) { addToCallChain(coordinate, Symbol.dispose, coordinate[2]?.deref?.() ?? coordinate[2]); }
    return coordinate;
}

//
export const visibleBySelectorRef = (selector)=>{
    const visRef = booleanRef(false), usub = handleByPointer((ev)=>{
        const target = typeof document != "undefined" ? document.elementFromPoint(ev.clientX, ev.clientY) : null;
        visRef.value = target?.matches?.(selector) ?? false;
    });
    if (usub) addToCallChain(visRef, Symbol.dispose, usub); return visRef;
}

//
export const showAttributeRef = (attribute = "data-tooltip")=>{
    const valRef = stringRef(""), usub = handleByPointer((ev)=>{
        const target: any = typeof document != "undefined" ? document.elementFromPoint(ev.clientX, ev.clientY) : null;
        valRef.value = target?.getAttribute?.(attribute)?.(`[${attribute}]`) ?? "";
    });
    if (usub) addToCallChain(valRef, Symbol.dispose, usub); return valRef;
}

//
type RefBool = { value: boolean };
type Area = {
    left  : number;
    top   : number;
    right : number;
    bottom: number;
    width : number;
    height: number;
};

//
interface TriggerOptions {
    root?: any;
    selector?: string;     // селектор, внутри которого клик не считается "dispose"
    closeEvents?: string[]; // дополнительные события для "dispose"
    mouseLeaveDelay?: number; // задержка для mouseleave
}

//
export function makeInterruptTrigger(
    except: any = null,
    ref: RefBool|Function = booleanRef(false),
    closeEvents: string[] = ["pointerdown", "click", "contextmenu", "scroll"],
    element: any = document?.documentElement
) {
    if (!element) return () => { };
    const wr = new WeakRef(ref);
    const close = typeof ref === "function" ? ref : (ev) => { (!(except?.contains?.(ev?.target) || ev?.target == (except?.element ?? except)) || !except) ? $set(wr, "value", false) : false; };
    const listening = [
        ...addEvents(element, Object.fromEntries(closeEvents.map(event => [event, close])))
    ];
    const dispose = ()=>listening.forEach(ub=>ub?.());
    addToCallChain(ref, Symbol.dispose, dispose);
    return dispose;
}

//
function deepContains(container: Node, target: Node): boolean {
    let node: Node | null = target;

    while (node) {
        if (node === container) return true;

        //
        const anyNode = node as any;
        if (anyNode.assignedSlot) {
            node = anyNode.assignedSlot as Node;
            continue;
        }

        //
        if (node.parentNode) {
            node = node.parentNode;
            continue;
        }

        //
        const root = (node as any).getRootNode?.();
        if (root && (root as ShadowRoot).host) {
            node = (root as ShadowRoot).host;
        } else {
            node = null;
        }
    }

    return false;
}

//
function isInside(target: Event | Node, container: Element): boolean {
    if ('composedPath' in (target as Event) && typeof (target as Event).composedPath === 'function') {
        return (target as Event).composedPath().includes(container);
    }

    //
    const node = (target as any).target ? (target as any).target as Node : target as Node;
    return node ? deepContains(container, node) : false;
}

//
export function makeClickOutsideTrigger(ref: RefBool, except: any = null, element: any, options: TriggerOptions = {}) {
    const {
        root = typeof document != "undefined" ? document?.documentElement : null,
        closeEvents = ["scroll", "click", "pointerdown"],
        mouseLeaveDelay = 100
    } = options;

    //
    let mouseLeaveTimer: any = null;

    //
    const wr = new WeakRef(ref);
    function onMouseLeave() { mouseLeaveTimer = setTimeout(() => { $set(wr, "value", false); }, mouseLeaveDelay); }
    function onMouseEnter() { if (mouseLeaveTimer) clearTimeout(mouseLeaveTimer); }
    function onDisposeEvent(ev: Event) { if (!isInside(ev, element?.element ?? element) && !isInside(ev, except?.element ?? except)) $set(wr, "value", false); }
    function onPointerDown(ev: Event) {
        const t = ev;
        if (!isInside(t, element?.element ?? element) && !isInside(t, except?.element ?? except)) $set(wr, "value", false);
    }

    //
    const listening = [
        ...addEvents(root, Object.fromEntries(closeEvents.map(event => [event, onDisposeEvent]))),
        addEvent(root, "pointerdown", onPointerDown)
    ];
    if (element) {
        //listening.push(addEvent(element, "mouseleave", onMouseLeave), addEvent(element, "mouseenter", onMouseEnter));
    }

    //
    function destroy() {
        listening.forEach(ub=>ub?.());
    }

    //
    addToCallChain(ref, Symbol.dispose, destroy);
    return ref;
}

//
export function boundingBoxRef(anchor: HTMLElement, options?: {
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
export const withInsetWithPointer = (exists: HTMLElement, pRef: any)=>{
    if (!exists) return () => { };
    const ubs = [
        bindWith(exists, "--client-x", pRef?.[0], handleStyleChange),
        bindWith(exists, "--client-y", pRef?.[1], handleStyleChange)
    ];
    if (pRef?.[2]) { ubs.push(bindWith(exists, "--anchor-width", pRef?.[2], handleStyleChange)); }
    if (pRef?.[3]) { ubs.push(bindWith(exists, "--anchor-height", pRef?.[3], handleStyleChange)); }
    return ()=>ubs?.forEach?.(ub=>ub?.());
}
