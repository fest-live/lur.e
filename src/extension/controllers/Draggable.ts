import { setStyleProperty, getBoundingOrientRect, bindDraggable, contentBoxWidth, contentBoxHeight, borderBoxWidth, borderBoxHeight, ROOT, RAFBehavior } from "fest/dom";
import { makeShiftTrigger, doObserve } from "./Trigger";

//
//import {  E  } from "fest/lure";
import { numberRef } from "fest/object";
import E from "../../lure/node/Bindings";

//
interface DragHandlerOptions {
    handler?: HTMLElement;
}

//
const _LOG_ = (...args)=>{ console.log(...args); return args?.[0]; };

//
export class DragHandler {
    #holder: HTMLElement;
    #dragging = [{value: 0}, {value: 0}];

    // @ts-ignore
    get #parent() { return this.#holder.offsetParent ?? this.#holder?.host ?? ROOT; }

    //
    constructor(holder, options: DragHandlerOptions) {
        if (!holder) { throw Error("Element is null..."); }
        doObserve(this.#holder = holder, this.#parent); this.#dragging = [numberRef(0, RAFBehavior()), numberRef(0, RAFBehavior())];
        if (options) this.draggable(options);
    }

    //
    draggable(options: DragHandlerOptions) {
        const handler = options.handler ?? this.#holder;
        const dragging = this.#dragging;

        //
        const weak        = new WeakRef(this.#holder);
        const binding     = (grabAction) => handler.addEventListener("pointerdown", makeShiftTrigger((ev)=>grabAction(ev, this.#holder), this.#holder));
        const dragResolve = (dragging)   => {
            const holder = weak?.deref?.() as any;
            holder?.style?.removeProperty?.("will-change");
            requestAnimationFrame(()=>{
                holder?.removeAttribute?.("data-dragging");
            });

            //
            const box = /*getBoundingOrientRect(holder) ||*/ holder?.getBoundingClientRect?.();
            setStyleProperty(holder, "--drag-x", dragging[0].value = 0);
            setStyleProperty(holder, "--drag-y", dragging[1].value = 0);

            //
            setStyleProperty(holder, "--shift-x", (box?.left || 0));
            setStyleProperty(holder, "--shift-y", (box?.top  || 0));
        }

        //
        E(this.#holder, { style: { "--drag-x": dragging[0], "--drag-y": dragging[1] } });
        return bindDraggable(binding, dragResolve, dragging, ()=>{
            const holder = weak?.deref?.() as any;
            holder?.setAttribute?.("data-dragging", "");
            holder?.style?.setProperty("--drag-x", "0");
            holder?.style?.setProperty("--drag-y", "0");
            holder?.style?.setProperty("will-change", "inset, translate, transform, opacity, z-index");
            return [0, 0];
        });
    }
}

//
export default DragHandler;
