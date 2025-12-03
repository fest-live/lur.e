import { getBoundingOrientRect, orientOf, addEvent, addEvents, hasParent, removeEvent } from "fest/dom";
import { cvt_cs_to_os, withCtx } from "fest/core";

//
export class DecorWith {
    #addition: any;

    // needs prototype extends with Reflect
    constructor(addition) { this.#addition = addition; }
    get(target, name) { return withCtx(this.#addition, this.#addition?.[name]) ?? withCtx(target, target?.[name]); }
    set(target, name, val) {
        if (!Reflect.set(target, name, val)) {
            this.#addition[name] = val;
        }
        return true;
    }

    ownKeys(target) { return [...(Reflect.ownKeys(target) ?? []), ...(Reflect.ownKeys(this.#addition) ?? [])]; }
    getOwnPropertyDescriptor(target, name) { return Reflect.getOwnPropertyDescriptor(target, name) ?? Reflect.getOwnPropertyDescriptor(this.#addition, name); }
    getPrototypeOf(target) { return Reflect.getPrototypeOf(target) ?? Reflect.getPrototypeOf(this.#addition); }
    setPrototypeOf(target, proto) { return Reflect.setPrototypeOf(target, proto) ?? Reflect.setPrototypeOf(this.#addition, proto); }
    isExtensible(target) { return Reflect.isExtensible(target) ?? Reflect.isExtensible(this.#addition); }
    preventExtensions(target) { return Reflect.preventExtensions(target) ?? Reflect.preventExtensions(this.#addition); }
    defineProperty(target, name, desc) { return Reflect.defineProperty(this.#addition, name, desc) ?? Reflect.defineProperty(target, name, desc); }
    deleteProperty(target, name) { return Reflect.deleteProperty(this.#addition, name) ?? Reflect.deleteProperty(target, name); }
    //construct(target, args, newTarget) { return Reflect.construct(this.#addition, args, newTarget) ?? Reflect.construct(target, args, newTarget); }
}

//
export const elementPointerMap = new WeakMap<any, any>();
export const agWrapEvent = (cb)=>{

    //
    const wpb = (ev: any)=>{
        const el = (ev?.target?.matches?.(".ui-orientbox") ? ev?.target : null) || ev?.target?.closest?.(".ui-orientbox");
        if (!el) { return cb(ev); }; //

        // @ts-ignore
        let {pointerCache, pointerMap} = elementPointerMap?.getOrInsert?.(el, { pointerCache: new Map<number, any>(), pointerMap: new Map<number, any>() });

        //const zoom: number = zoomOf(ev?.target || el) || 1;
        const coord: [number, number] = [(ev?.clientX || 0), (ev?.clientY || 0)];
        const cache: any = pointerCache?.getOrInsert?.(ev?.pointerId || 0, {
            client: coord,
            orient: null,
            boundingBox: null,
            movement: [0, 0]
        });

        //
        cache.delta  = [coord[0] - cache.client[0], coord[1] - cache.client[1]];
        cache.orient = null, cache.client = coord;

        //
        const pointer = pointerMap?.getOrInsert?.(ev?.pointerId || 0, {
            type: (ev?.type||"pointer"),
            event: ev,
            target: ev?.target || el,
            cs_box: [el?.offsetWidth || 1, el?.offsetHeight || 1],
            cap_element: null,

            //
            get client() { return cache.client; },
            get orient() { return cache.orient ??= cvt_cs_to_os([...(pointer.client || cache.client)] as [number, number], [el?.offsetWidth || 1, el?.offsetHeight || 1], orientOf(ev.target || el) || 0); },
            get movement() { return [cache.delta[0] || 0, cache.delta[1] || 0]; },
            get boundingBox() { return (cache.boundingBox ??= getBoundingOrientRect(ev?.target || el, orientOf(ev.target || el) || 0)); },

            //
            capture(element = ev?.target || el) { return (pointer.cap_element = element?.setPointerCapture?.(ev?.pointerId || 0)); },
            release(element = null) {
                (element || pointer.cap_element || ev?.target || el)?.releasePointerCapture?.(ev?.pointerId || 0);
                pointer.cap_element = null;
            },
        });

        //
        Object.assign(pointer, {
            type: (ev?.type||"pointer"),
            event: ev,
            target: ev?.target || el,
            cs_box: [el?.offsetWidth || 1, el?.offsetHeight || 1],
            pointerId: ev?.pointerId || 0
        });

        //
        if (ev?.type == "contextmenu" || ev?.type == "click" || ev?.type == "pointerup" || ev?.type == "pointercancel") {
            pointerMap?.delete?.(ev?.pointerId || 0);
            pointerCache?.delete?.(ev?.pointerId || 0);
            if (ev?.type == "pointercancel") {
                pointer?.release?.();
            }
        };

        //
        if (pointer && ev) { return cb(new Proxy(ev, new DecorWith(pointer))); };
    }

    //
    return wpb;
};

//
class PointerEdge {
    pointer: [number, number] = [0, 0];
    results: any;

    //
    constructor(pointer: [number, number] = [0, 0]) {
        this.pointer = pointer;
        this.results = { left: false, top: false, bottom: false, right: false };
    }

    //
    get left() { const current = Math.abs(this.pointer[0] - 0) < 10; return (this.results.left = current); }
    get top () { const current = Math.abs(this.pointer[1] - 0) < 10; return (this.results.top  = current); }
    get right () { const current = Math.abs(this.pointer[0] - window.innerWidth)  < 10; return (this.results.right  = current); }
    get bottom() { const current = Math.abs(this.pointer[1] - window.innerHeight) < 10; return (this.results.bottom = current); }
}

//
interface EvStub { pointerId: number; }
interface HoldingElement {
    shifting?: [number, number];
    modified?: [number, number];
    element?: WeakRef<HTMLElement>;
    result?: [any, any];
    propertyName?: string;
}

//
interface PointerObject {
    id: number;
    down?: [number, number],
    event?: MouseEvent | PointerEvent | EvStub;
    edges?: PointerEdge;
    current: [number, number],
    holding?: HoldingElement[];
    movement: [number, number];
};

//
const preventedPointers = new Map<number, any>();
export const clickPrevention = (element, pointerId = 0)=>{
    if (preventedPointers.has(pointerId)) { return; }

    //
    const rmev = ()=>{
        preventedPointers.delete(pointerId);
        dce?.forEach?.(unbind => unbind?.());
        ece?.forEach?.(unbind => unbind?.());
    }

    //
    const preventClick = (e: PointerEvent | MouseEvent | CustomEvent | any) => {
        if (e?.pointerId == pointerId || e?.pointerId == null || pointerId == null || pointerId < 0) {
            //e.stopPropagation();
            e.preventDefault();
            preventedPointers.set(pointerId, true);
            rmev();
        } else {
            preventedPointers.delete(pointerId);
        }
    };

    //
    const emt: [(e: PointerEvent | MouseEvent | CustomEvent | any) => any, AddEventListenerOptions] = [preventClick, {once: true}];
    const doc: [(e: PointerEvent | MouseEvent | CustomEvent | any) => any, AddEventListenerOptions] = [preventClick, {once: true, capture: true}];

    //
    const dce = addEvents(document.documentElement, {
        "click": doc,
        "pointerdown": doc,
        "contextmenu": doc
    });
    const ece = addEvents(element, {
        "click": emt,
        "pointerdown": emt,
        "contextmenu": emt
    });
    setTimeout(rmev, 10);
}

//
let PointerEventDrag: any = null;
if (typeof PointerEvent != "undefined") {
    PointerEventDrag = class PointerEventDrag extends PointerEvent {
        #holding: any;
        constructor(type, eventInitDict) { super(type, eventInitDict); this.#holding = eventInitDict?.holding; }
        get holding() { return this.#holding; }
        get event() { return this.#holding?.event; }
        get result() { return this.#holding?.result; }
        get shifting() { return this.#holding?.shifting; }
        get modified() { return this.#holding?.modified; }
        get canceled() { return this.#holding?.canceled; }
        get duration() { return this.#holding?.duration; }
        get element() { return this.#holding?.element?.deref?.() ?? null; }
        get propertyName() { return this.#holding?.propertyName ?? "drag"; }
    }
} else {
    PointerEventDrag = class PointerEventDrag {
        #holding: any;
        constructor(type, eventInitDict) { this.#holding = eventInitDict?.holding; }
        get holding() { return this.#holding; }
    }
}

//
export const draggingPointerMap = new WeakMap<any, any>();
export const grabForDrag = (
    em,
    ex: PointerEvent|any = { pointerId: 0, pointerType: "mouse" },
    {
        shifting = [0, 0],
        result   = [{value: 0}, {value: 0}]
    } = {}
) => {
    let last: any = ex;
    let frameTime = 0.01, lastLoop = performance.now(), thisLoop;
    const filterStrength  = 100;
    const computeDuration = () => {
        var thisFrameTime = (thisLoop=performance.now()) - lastLoop;
        frameTime += (thisFrameTime - frameTime) / filterStrength;
        lastLoop = thisLoop;
        return frameTime;
    }

    //
    const hm: any = {
        result,
        movement: [...(ex?.movement || [0, 0])],
        shifting: [...shifting],
        modified: [...shifting],
        canceled: false,
        duration: frameTime,
        element: new WeakRef(em),
        client: null///[0, 0]
    };

    //
    const moveEvent = [/*agWrapEvent*/((evc)=>{
        if (ex?.pointerId == evc?.pointerId) {
            evc?.preventDefault?.();
            if (hasParent(evc?.target, em)) {
                const client = [...(evc?.client  || [evc?.clientX || 0, evc?.clientY || 0] || [0, 0])]; hm.duration = computeDuration();
                hm.movement  = [...(hm.client ? [client?.[0] - (hm.client?.[0] || 0), client?.[1] - (hm.client?.[1] || 0)] : [0, 0])];
                hm.client    = client;
                hm.shifting[0] +=  hm.movement[0] || 0                   , hm.shifting[1] +=  hm.movement[1] || 0;
                hm.modified[0]  = (hm.shifting[0] ?? hm.modified[0]) || 0, hm.modified[1]  = (hm.shifting[1] ?? hm.modified[1]) | 0;
                em?.dispatchEvent?.(new PointerEventDrag("m-dragging", {
                    ...evc,
                    bubbles: true,
                    holding: hm,
                    event: evc,
                }));
                if (hm?.result?.[0] != null) hm.result[0].value = hm.modified[0] || 0;
                if (hm?.result?.[1] != null) hm.result[1].value = hm.modified[1] || 0;
                if (hm?.result?.[2] != null) hm.result[2].value = 0;
            }
        }
    }), {capture: true}];

    // @ts-ignore
    const promised = Promise.withResolvers();
    const releaseEvent = [/*agWrapEvent*/((evc)=>{
        if (ex?.pointerId == evc?.pointerId) {
            const elm = em?.element || em;
            if (hasParent(evc?.target, elm) || evc?.currentTarget?.contains?.(elm) || evc?.target == elm) {
                if (evc?.type == "pointerup") { clickPrevention(elm, evc?.pointerId); };

                //
                queueMicrotask(() => promised?.resolve?.(result));
                bindings?.forEach?.(binding => binding?.());
                elm?.releaseCapturePointer?.(evc?.pointerId);
                elm?.dispatchEvent?.(new PointerEventDrag("m-dragend", { ...evc, bubbles: true, holding: hm, event: evc }));
                hm.canceled = true; try { ex.pointerId = -1; } catch (_) { /* noop */ }
            }
        }
    }), {capture: true}];

    //
    let bindings: any = null;
    clickPrevention(em, ex?.pointerId);
    queueMicrotask(() => {
        if (em?.dispatchEvent?.(new PointerEventDrag("m-dragstart", { ...ex, bubbles: true, holding: hm, event: ex }))) {
            //ex?.capture?.(em);
            em?.setPointerCapture?.(ex?.pointerId);

            //
            bindings = addEvents(em, {
                "pointermove": moveEvent,
                "pointercancel": releaseEvent,
                "pointerup": releaseEvent
            });

            //
            bindings?.push?.(...addEvents(document.documentElement, {
                "pointercancel": releaseEvent,
                "pointerup": releaseEvent
            }));
        } else { hm.canceled = true; }
    });

    //
    return promised?.promise ?? result;
};

//
export const bindDraggable = (elementOrEventListener, onEnd:any = ()=>{}, draggable: any|null = [{value: 0}, {value: 0}], shifting: any = [0, 0])=>{
    if (!draggable) { return; }
    const process = (ev, el)=>grabForDrag(el ?? elementOrEventListener, ev, {result: draggable, shifting: typeof shifting == "function" ? shifting?.(draggable) : shifting})?.then?.(onEnd);

    //
    if (typeof elementOrEventListener?.addEventListener == "function") { addEvent(elementOrEventListener, "pointerdown", process); } else
    if (typeof elementOrEventListener == "function")  { elementOrEventListener(process); } else
    { throw new Error("bindDraggable: elementOrEventListener is not a function or an object with addEventListener"); }

    //
    const dispose = ()=>{ if (typeof elementOrEventListener?.removeEventListener == "function") { removeEvent(elementOrEventListener, "pointerdown", process); } };
    return { draggable, dispose, process };
}
