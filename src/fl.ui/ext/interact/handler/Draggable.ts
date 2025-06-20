import { borderBoxHeight, borderBoxWidth, contentBoxHeight, contentBoxWidth, doBorderObserve, doContentObserve, ROOT, setProperty, type InteractStatus } from "../../core/Utils";
import { fixedClientZoom, agWrapEvent, getBoundingOrientRect, grabForDrag, bindDraggable } from "u2re/dom";

//
import { ref } from "u2re/object";
import {  E  } from "u2re/lure";
import { makeShiftTrigger } from "../grid/Trigger";

//
export class DragHandler {
    #holder: HTMLElement;
    #dragging = [{value: 0}, {value: 0}];

    // @ts-ignore
    get #parent() { return this.#holder.offsetParent ?? this.#holder?.host ?? ROOT; }

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
        const dragging = this.#dragging;

        //
        const weak   = new WeakRef(this.#holder);
        const binding = (grabAction)=>handler.addEventListener("pointerdown", makeShiftTrigger(grabAction, this.#holder));
        const dragResolve = (dragging) => {
            const holder = weak?.deref?.() as any;
            holder?.style?.removeProperty?.("will-change");

            //
            setProperty(holder, "--drag-x", dragging[0].value = 0);
            setProperty(holder, "--drag-y", dragging[1].value = 0);

            //
            const box = getBoundingOrientRect(holder) || holder?.getBoundingClientRect?.();
            setProperty(holder, "--shift-x", (box?.left || 0) - (this.#parent?.[contentBoxWidth ] - this.#holder[borderBoxWidth ]) * 0.5);
            setProperty(holder, "--shift-y", (box?.top  || 0) - (this.#parent?.[contentBoxHeight] - this.#holder[borderBoxHeight]) * 0.5);
        }

        //
        bindDraggable(binding, dragResolve, dragging);
    }
}

//
export default DragHandler;
