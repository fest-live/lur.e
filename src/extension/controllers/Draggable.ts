import { setStyleProperty, getBoundingOrientRect, contentBoxWidth, contentBoxHeight, borderBoxWidth, borderBoxHeight, ROOT, RAFBehavior } from "fest/dom";
import { makeShiftTrigger, doObserve } from "./Trigger";
import { bindDraggable } from "../core/PointerAPI";

//
//import {  E  } from "fest/lure";
import { numberRef, subscribe } from "fest/object";

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
    #raf = 0;
    #pending: [number, number] = [0, 0];
    #subscriptions?: Array<() => void>;

    // @ts-ignore
    get #parent() { return this.#holder.offsetParent ?? this.#holder?.host ?? ROOT; }

    //
    constructor(holder, options: DragHandlerOptions) {
        if (!holder) { throw Error("Element is null..."); }
        doObserve(this.#holder = holder, this.#parent);
        this.#dragging = [numberRef(0, RAFBehavior()), numberRef(0, RAFBehavior())];
        setStyleProperty(this.#holder, "--drag-x", 0);
        setStyleProperty(this.#holder, "--drag-y", 0);
        this.#attachObservers();
        if (options) this.draggable(options);
    }

    //
    #queueFrame(x = 0, y = 0) {
        this.#pending = [x || 0, y || 0];
        if (this.#raf) { return; }
        this.#raf = requestAnimationFrame(() => {
            this.#raf = 0;
            const [dx, dy] = this.#pending;

            //
            //setStyleProperty(this.#holder, "--drag-x", dx || 0);
            //setStyleProperty(this.#holder, "--drag-y", dy || 0);
            //setStyleProperty(this.#holder, "transform", `translate3d(calc(var(--drag-x, 0) * 1px), calc(var(--drag-y, 0) * 1px), 0px)`);

            // CSS variables slows down the animation, so we use transform instead
            setStyleProperty(this.#holder, "transform", `translate3d(
                clamp(calc(-1px * var(--shift-x, 0)), ${dx || 0}px, calc(100cqi - 100% - var(--shift-x, 0) * 1px)),
                clamp(calc(-1px * var(--shift-y, 0)), ${dy || 0}px, calc(100cqb - 100% - var(--shift-y, 0) * 1px)),
                0px)`?.trim?.()?.replaceAll?.(/\s+/g, " ")?.replaceAll?.(/\n+/g, " ")?.trim?.() ?? "");
        });
    }

    #attachObservers() {
        if (this.#subscriptions) { return; }
        const emit = () => {
            this.#queueFrame(
                this.#dragging?.[0]?.value || 0,
                this.#dragging?.[1]?.value || 0
            );
        };
        this.#subscriptions = [
            subscribe(this.#dragging[0], emit),
            subscribe(this.#dragging[1], emit),
        ];
        emit();
    }

    //
    draggable(options: DragHandlerOptions) {
        const handler = options.handler ?? this.#holder;
        const dragging = this.#dragging;
        this.#attachObservers();

        //
        const weak        = new WeakRef(this.#holder);
        const binding     = (grabAction) => handler.addEventListener("pointerdown", makeShiftTrigger((ev)=>grabAction(ev, this.#holder), this.#holder));
        const dragResolve = (dragging)   => {
            const holder = weak?.deref?.() as any;
            holder?.style?.removeProperty?.("will-change");
            requestAnimationFrame(()=>{
                holder?.removeAttribute?.("data-dragging");
                holder?.style?.removeProperty?.("transform");
            });

            //
            const box = /*getBoundingOrientRect(holder) ||*/ holder?.getBoundingClientRect?.();
            dragging[0].value = 0;
            dragging[1].value = 0;
            this.#queueFrame(0, 0);

            //
            setStyleProperty(holder, "--shift-x", (box?.left || 0));
            setStyleProperty(holder, "--shift-y", (box?.top  || 0));
        }

        //
        return bindDraggable(binding, dragResolve, dragging, ()=>{
            const holder = weak?.deref?.() as any;
            holder?.setAttribute?.("data-dragging", "");
            holder?.style?.setProperty("will-change", "inset, translate, transform, opacity, z-index");
            this.#queueFrame(dragging?.[0]?.value || 0, dragging?.[1]?.value || 0);
            return [0, 0];
        });
    }
}

//
export default DragHandler;
