import { setStyleProperty, RAFBehavior, ROOT } from "fest/dom";
import { makeShiftTrigger, doObserve } from "./Trigger";
import { bindDraggable } from "./PointerAPI";

//
//import {  E  } from "fest/lure";
import { numberRef, subscribe } from "fest/object";
import { Vector2D, vector2Ref, Rect2D, clampPointToRect, createRect2D } from "fest/lure";

//
interface DragHandlerOptions {
    handler?: HTMLElement;
    constraints?: {
        bounds?: Rect2D;      // Drag within these bounds
        centerOffset?: Vector2D; // Offset from center for bounds checking
        snapToGrid?: { size: Vector2D, offset: Vector2D }; // Grid snapping
    };
}

//
const _LOG_ = (...args)=>{ console.log(...args); return args?.[0]; };

//
export class DragHandler {
    #holder: HTMLElement;
    #dragging: Vector2D;
    #raf = 0;
    #pending: Vector2D;
    #options?: DragHandlerOptions;
    #subscriptions?: Array<() => void>;

    // @ts-ignore
    get #parent() { return this.#holder.offsetParent ?? this.#holder?.host ?? ROOT; }

    //
    constructor(holder, options: DragHandlerOptions) {
        if (!holder) { throw Error("Element is null..."); }
        doObserve(this.#holder = holder, this.#parent);
        this.#dragging = vector2Ref(0, 0);
        this.#pending = vector2Ref(0, 0);
        this.#options = options;
        setStyleProperty(this.#holder, "--drag-x", 0);
        setStyleProperty(this.#holder, "--drag-y", 0);
        this.#attachObservers();
        if (options) this.draggable(options);
    }

    //
    #queueFrame(x = 0, y = 0) {
        let constrainedX = x || 0;
        let constrainedY = y || 0;

        // Apply constraints if specified
        if (this.#options?.constraints?.bounds) {
            const bounds = this.#options.constraints.bounds;
            const centerOffset = this.#options.constraints.centerOffset || vector2Ref(0, 0);

            // Calculate element bounds for constraint checking
            const elementSize = vector2Ref(this.#holder.offsetWidth, this.#holder.offsetHeight);
            const elementBounds = createRect2D(constrainedX, constrainedY, elementSize.x, elementSize.y);

            // Apply bounds constraints
            const constrainedPos = clampPointToRect(
                new Vector2D(constrainedX + centerOffset.x.value, constrainedY + centerOffset.y.value),
                bounds
            );

            constrainedX = constrainedPos.x.value - centerOffset.x.value;
            constrainedY = constrainedPos.y.value - centerOffset.y.value;
        }

        // Apply grid snapping if specified
        if (this.#options?.constraints?.snapToGrid) {
            const { size: gridSize, offset: gridOffset } = this.#options.constraints.snapToGrid;
            constrainedX = Math.round((constrainedX - gridOffset.x.value) / gridSize.x.value) * gridSize.x.value + gridOffset.x.value;
            constrainedY = Math.round((constrainedY - gridOffset.y.value) / gridSize.y.value) * gridSize.y.value + gridOffset.y.value;
        }

        this.#pending.x.value = constrainedX;
        this.#pending.y.value = constrainedY;

        if (this.#raf) { return; }
        this.#raf = requestAnimationFrame(() => {
            this.#raf = 0;
            const dx = this.#pending.x.value;
            const dy = this.#pending.y.value;

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
                this.#dragging.x.value,
                this.#dragging.y.value
            );
        };
        this.#subscriptions = [
            subscribe(this.#dragging.x, emit),
            subscribe(this.#dragging.y, emit),
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
            queueMicrotask(()=>{
                holder?.removeAttribute?.("data-dragging");
                holder?.style?.removeProperty?.("transform");
            });

            //
            const box = /*getBoundingOrientRect(holder) ||*/ holder?.getBoundingClientRect?.();
            this.#dragging.x.value = 0;
            this.#dragging.y.value = 0;
            this.#queueFrame(0, 0);

            //
            setStyleProperty(holder, "--shift-x", (box?.left || 0));
            setStyleProperty(holder, "--shift-y", (box?.top  || 0));
        }

        //
        // Convert Vector2D to array format for bindDraggable compatibility
        const draggingArray = [this.#dragging.x, this.#dragging.y];
        return bindDraggable(binding, dragResolve, draggingArray, ()=>{
            const holder = weak?.deref?.() as any;
            holder?.setAttribute?.("data-dragging", "");
            holder?.style?.setProperty("will-change", "inset, translate, transform, opacity, z-index");
            this.#queueFrame(this.#dragging.x.value, this.#dragging.y.value);
            return [0, 0];
        });
    }
}

//
export default DragHandler;
