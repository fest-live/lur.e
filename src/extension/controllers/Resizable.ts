import { bbh, bbw, cbh, cbw, ROOT, type InteractStatus, RAFBehavior } from "fest/dom";
import { makeShiftTrigger, doObserve } from "./Trigger";
import { clamp } from "fest/core";

//
import { numberRef } from "fest/object";
import { E } from "../../lure/node/Bindings";
import { bindDraggable } from "./PointerAPI";
import { Vector2D, vector2Ref } from "fest/lure";

//
export class ResizeHandler {
    #holder: HTMLElement;
    #resizing: Vector2D;

    // @ts-ignore
    get #parent() { return this.#holder.offsetParent ?? this.#holder?.host ?? ROOT; }

    //
    constructor(holder, options?: any) {
        if (!holder) { throw Error("Element is null..."); }
        doObserve(this.#holder = holder, this.#parent); this.#resizing = vector2Ref(0, 0);
        if (options) this.resizable(options);
    }

    //
    limitResize(real, virtual, holder, container) {
        const widthDiff  = cbw(holder) - (bbw(holder) - (this.#resizing.x.value || 0));
        const heightDiff = cbh(holder) - (bbh(holder) - (this.#resizing.y.value || 0));

        // if relative of un-resized to edge corner max-size
        // discount of dragging offset!
        real[0] = clamp(0, virtual?.[0] || 0, widthDiff) || 0;
        real[1] = clamp(0, virtual?.[1] || 0, heightDiff) || 0;
        return real;
    }

    // TODO! Resizing v2 (full reworking for performance)
    resizable(options) {
        const handler  = options.handler ?? this.#holder, status: InteractStatus = { pointerId: -1 };
        const resizing = this.#resizing, weak = new WeakRef(this.#holder), self_w = new WeakRef(this);

        //
        const dragResolve = (dragging) => {
            const holder = weak?.deref?.() as any;
            holder?.style?.removeProperty?.("will-change");
            //holder?.style?.setProperty("--resize-x", "0");
            //holder?.style?.setProperty("--resize-y", "0");
            queueMicrotask(()=>{
                holder?.removeAttribute?.("data-resizing");
            });
        };

        //
        const binding  = (grabAction)=>handler.addEventListener("pointerdown", makeShiftTrigger((ev)=>grabAction(ev, this.#holder), this.#holder));
        const initDrag = ()=>{
            const starting = [this.#resizing.x.value || 0, this.#resizing.y.value || 0];
            const holder = weak?.deref?.() as any;
            const parent = this.#parent;
            self_w?.deref?.()?.limitResize?.(starting, starting, holder, parent)
            holder?.setAttribute?.("data-resizing", "");
            return starting;
        };

        //
        // Convert Vector2D to array format for bindDraggable compatibility
        const resizingArray = [this.#resizing.x, this.#resizing.y];
        E(this.#holder, { style: {
            "--resize-x": this.#resizing.x,
            "--resize-y": this.#resizing.y
        } });

        //
        return bindDraggable(binding, dragResolve, resizingArray, initDrag);
    }
}

//
export default ResizeHandler;
