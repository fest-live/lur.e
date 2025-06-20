import { borderBoxHeight, borderBoxWidth, contentBoxHeight, contentBoxWidth, doBorderObserve, doContentObserve, ROOT, setProperty, type InteractStatus } from "../../core/Utils";
import { fixedClientZoom, agWrapEvent, getBoundingOrientRect, grabForDrag } from "u2re/dom";

//
import { ref } from "u2re/object";
import {  E  } from "u2re/lure";

//
export class DragHandler {
    #holder: HTMLElement;
    #dragging = [{value: 0}, {value: 0}];

    // TODO: I'm too rigid for recover...
    get #parent() { return this.#holder?.parentNode; };

    //
    constructor(holder) {
        if (!holder) {
            throw Error("Element is null...");
        }

        //
        this.#holder = holder;
        this.#holder["@control"] = this;

        //
        const weak = new WeakRef(this), updSize_w = new WeakRef(this.#updateSize);
        doBorderObserve(this.#holder); if (this.#parent) { doContentObserve(this.#parent); }

        //
        ROOT.addEventListener("scaling", ()=>{
            const self = weak?.deref?.();
            try { updSize_w?.deref?.call?.(self); } catch(e) {};
        });

        //
        this.#dragging = [ref(0), ref(0)];
        E(this.#holder, { style: { "--drag-x": this.#dragging[0], "--drag-y": this.#dragging[1] } });
    }

    //
    #updateSize() {
        this.#holder[borderBoxWidth]  = this.#holder.offsetWidth  * fixedClientZoom(this.#holder);
        this.#holder[borderBoxHeight] = this.#holder.offsetHeight * fixedClientZoom(this.#holder);
        if (this.#parent) {
            const parent = this.#parent as HTMLElement;
            parent[contentBoxWidth]  = (parent.clientWidth ) * fixedClientZoom(parent);
            parent[contentBoxHeight] = (parent.clientHeight) * fixedClientZoom(parent);
        }
    }

    //
    draggable(options) {
        const handler = options.handler ?? this.#holder;
        const status: InteractStatus = { pointerId: -1, };
        const dragging = this.#dragging;

        //
        const weak   = new WeakRef(this.#holder);
        const self_w = new WeakRef(this);
        const upd_w  = new WeakRef(this.#updateSize);




        //
        handler.addEventListener("pointerdown", agWrapEvent((evc) => {
            const ev = evc?.detail || evc;
            status.pointerId = ev.pointerId;

            //
            let trigger = false;
            const holder = weak?.deref?.() as any;
            if (holder) {
                holder.style.setProperty("will-change", "transform", "important");
            }

            //
            const shiftEv: [any, any] = [(evp) => {
                if ((evp?.detail || evp).pointerId == ev.pointerId && !trigger) {
                    trigger = true;
                    unListenShift();

                    //
                    const holder = weak?.deref?.() as any;
                    if (holder) {
                        const self = self_w?.deref?.();
                        try { upd_w?.deref?.call?.(self); } catch(e) {};
                        const starting = [0, 0]
                        grabForDrag(holder, (evp?.detail || evp), {
                            result: dragging,
                            shifting: starting
                        });
                    }
                }
            }, {once: true}];

            //
            const unListenShift = (evp?) => {
                if (!evp || (evp?.detail || evp)?.pointerId == ev.pointerId) {
                    //const holder = weak?.deref?.() as any;
                    ROOT.removeEventListener("pointermove"  , ...shiftEv);
                    ROOT.removeEventListener("pointerup"    , unListenShift);
                    ROOT.removeEventListener("pointercancel", unListenShift);
                }
            };

            //
            ROOT.addEventListener("pointermove"  , ...shiftEv);
            ROOT.addEventListener("pointerup"    , unListenShift);
            ROOT.addEventListener("pointercancel", unListenShift);
        }));

        //
        const cancelShift = agWrapEvent((evc)=>{
            const ev = evc?.detail || evc;
            if ((ev.type?.includes?.("pointercancel") || ev.type?.includes?.("pointerup")) && status.pointerId == ev?.pointerId) {
                status.pointerId = -1;
                const holder = weak?.deref?.() as any; holder?.style?.removeProperty?.("will-change");
            }
        });

        //
        ROOT.addEventListener("pointerup"    , cancelShift);
        ROOT.addEventListener("pointercancel", cancelShift);

        //
        this.#holder.addEventListener("m-dragend", (evc) => {
            const holder = weak?.deref?.() as any, box = getBoundingOrientRect(holder) || holder?.getBoundingClientRect?.();

            //
            setProperty(holder, "--shift-x", (box?.left || 0) - (this.#parent?.[contentBoxWidth ] - this.#holder[borderBoxWidth ]) * 0.5);
            setProperty(holder, "--shift-y", (box?.top  || 0) - (this.#parent?.[contentBoxHeight] - this.#holder[borderBoxHeight]) * 0.5);

            //
            setProperty(holder, "--drag-x", dragging[0].value = 0);
            setProperty(holder, "--drag-y", dragging[1].value = 0);
        });
    }
}

//
export default DragHandler;
