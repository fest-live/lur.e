import { doBorderObserve, doContentObserve, addEvents, handleStyleChange, iterateContentBox, addEvent } from "fest/dom";
import { addToCallChain, numberRef, stringRef, booleanRef } from "fest/object";
import { lazyAddEventListener } from "./LazyEvents";
import { unref } from "fest/core";
import { toRef } from "fest/core";

//
const ROOT = typeof document != "undefined" ? document?.documentElement : null;
const SELECTOR = "ui-modal[type=\"contextmenu\"], ui-button, ui-taskbar, ui-navbar, ui-statusbar, button, label, input, ui-longtext, ui-focustext, ui-row-select, ui-row-button, .u2-input, .ui-input";
const $set = (rv, key, val)=>{ if (rv?.deref?.() != null) { return (rv.deref()[key] = val); }; }

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
    const listening = closeEvents.map((event) =>
        lazyAddEventListener(element, event, close as any, { capture: false, passive: false })
    );
    const dispose = () => listening.forEach((ub) => ub?.());
    addToCallChain(ref, Symbol.dispose, dispose);
    return dispose;
}

//
export const doObserve = (holder, parent)=>{
    if (!holder) { throw Error("Element is null..."); };
    if ( parent) { doContentObserve(parent); };
    doBorderObserve(holder);
}

//
export const makeShiftTrigger = (callable, newItem?)=> ((evc)=>{
    const ev = evc;
    newItem ??= ev?.target ?? newItem;
    if (!newItem.dataset.dragging) {
        const n_coord: [number, number] = [ev.clientX, ev.clientY];
        if (ev?.pointerId >= 0) {
            (newItem as HTMLElement)?.setPointerCapture?.(ev?.pointerId);
        };

        //
        const shifting = ((evc_l: any)=>{
            const ev_l = evc_l;
            ev_l?.preventDefault?.();
            if (ev_l?.pointerId == ev?.pointerId) {
                const coord: [number, number] = [evc_l.clientX, evc_l.clientY];
                const shift: [number, number] = [coord[0] - n_coord[0], coord[1] - n_coord[1]];
                if (Math.hypot(...shift) > 2) {
                    newItem?.style?.setProperty?.("will-change", "inset, transform, translate, z-index");

                    //
                    unbind?.(ev_l);
                    callable?.(ev);
                }
            }
        });

        //
        const releasePointer = ((evc_l)=>{
            const ev_l = evc_l;
            if (ev_l?.pointerId == ev?.pointerId) {
                (newItem as HTMLElement)?.releasePointerCapture?.(ev?.pointerId);
                unbind?.(ev_l);
            }
        });

        //
        const handler = {
            "pointermove": shifting,
            "pointercancel": releasePointer,
            "pointerup": releasePointer
        }

        //
        const unbind = ((evc_l)=>{
            const ev_l = evc_l;
            if (ev_l?.pointerId == ev?.pointerId) {
                bindings?.forEach(binding => binding?.());
            }
        });

        //
        const bindings = addEvents(ROOT, handler);
    }
});

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
export const OOBTrigger = (element, ref, selector?, root = typeof document != "undefined" ? document?.documentElement : null) => {
    ref = toRef(ref);
    const checker = (ev) => {
        let $ref = unref(ref);
        const target = selector ? (ev?.target?.matches?.(selector) ? ev?.target : (ev?.target ?? root)?.querySelector?.(selector)) : ev?.target;
        if (!target || (element != target)) { $ref.value = false; }
    }
    const cancel = () => { root?.removeEventListener?.("click", checker); }
    if (root) root.addEventListener?.("click", checker); return cancel;
}
