// @ts-ignore /* @vite-ignore */
import {importCdn} from "/externals/modules/cdnImport.mjs";
import { bbh, bbw, blockClickTrigger, borderBoxHeight, borderBoxWidth, cbh, cbw, clamp, contentBoxHeight, contentBoxWidth, doBorderObserve, doContentObserve, ROOT, setProperty, type InteractStatus } from "../core/Utils";

// @ts-ignore /* @vite-ignore */
const { fixedClientZoom, agWrapEvent, getBoundingOrientRect, grabForDrag } = await Promise.try(importCdn, ["/externals/modules/dom.js"]);
// @ts-ignore /* @vite-ignore */
const { ref } = await Promise.try(importCdn, ["/externals/modules/object.js"]);
// @ts-ignore /* @vite-ignore */
const { E } = await Promise.try(importCdn, ["/externals/modules/blue.js"]);

//resizing = [ref(0), ref(0)];
export class AxGesture {
    #holder: HTMLElement;
    #resizing = [{value: 0}, {value: 0}];
    #dragging = [{value: 0}, {value: 0}];

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
        this.#resizing = [ref(0), ref(0)], this.#dragging = [ref(0), ref(0)];
        E(this.#holder, { style: { "--drag-x": this.#dragging[0], "--drag-y": this.#dragging[1], "--resize-x": this.#resizing[0], "--resize-y": this.#resizing[1] } });
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
    swipe(options) {
        if (options?.handler) {
            const swipes = new Map<number, any>([]);
            const swipes_w = new WeakRef(swipes);

            //
            ROOT.addEventListener("pointerdown", agWrapEvent((evc) => {
                const ev = evc?.detail ?? evc;
                if (ev.target == options?.handler) {
                    swipes?.set(ev.pointerId, {
                        target: ev.target,
                        start: [...(ev.client || [ev?.clientX, ev?.clientY])],
                        current: [...(ev.client || [ev?.clientX, ev?.clientY])],
                        pointerId: ev.pointerId,
                        startTime: performance.now(),
                        time: performance.now(),
                        speed: 0,
                    });

                    // stronger policy now...
                    // @ts-ignore
                    ev?.capture?.();
                }
            }));

            //
            const registerMove = (evc) => {
                const ev = evc?.detail ?? evc;
                if (swipes?.has?.(ev.pointerId)) {
                    ev.stopPropagation();
                    const swipe = swipes?.get?.(ev.pointerId);
                    Object.assign(swipe || {}, {
                        //speed: (swipe.speed == 0 ? speed : (speed * 0.8 + swipe.speed * 0.2)),
                        current: [...(ev.client || [ev?.clientX, ev?.clientY])],
                        pointerId: ev.pointerId,
                        time: performance.now(),
                    });
                }
            };

            //
            const compAngle = (a, c) => { return ((a - c + 540) % 360) - 180; };
            const completeSwipe = (pointerId) => {
                if (swipes?.has?.(pointerId)) {
                    const swipe = swipes_w?.deref()?.get?.(pointerId);
                    const diffP = [
                        swipe.start[0] - swipe.current[0],
                        swipe.start[1] - swipe.current[1],
                    ];
                    const diffT = performance.now() - swipe.startTime;
                    const speed = Math.hypot(...diffP) / diffT;
                    swipe.speed = speed;

                    //
                    if (swipe.speed > (options.threshold || 0.5)) {
                        const swipeAngle = Math.atan2(
                            swipe.current[1] - swipe.start[1],
                            swipe.current[0] - swipe.start[0]
                        );
                        swipe.swipeAngle = swipeAngle;
                        swipe.direction = "name";

                        //
                        if ( Math.abs( compAngle(swipe.swipeAngle * (180 / Math.PI), 0) ) <= 20 ) { swipe.direction = "left"; }; //AR.get(el.getAttribute("data-swipe-action-left"))?.(el); swipe.direction = "left"; }
                        if ( Math.abs( compAngle( swipe.swipeAngle * (180 / Math.PI), 180 ) ) <= 20 ) { swipe.direction = "right"; }; //AR.get(el.getAttribute("data-swipe-action-right"))?.(el); swipe.direction = "right"; }
                        if ( Math.abs( compAngle( swipe.swipeAngle * (180 / Math.PI), 270 ) ) <= 20 ) { swipe.direction = "up"; }; //AR.get(el.getAttribute("data-swipe-action-up"))?.(el); swipe.direction = "up"; }
                        if ( Math.abs( compAngle( swipe.swipeAngle * (180 / Math.PI), 90 ) ) <= 20 ) { swipe.direction = "down"; }; //AR.get(el.getAttribute("data-swipe-action-down"))?.(el); swipe.direction = "down"; }
                        options?.trigger?.(swipe);
                    }
                    swipes_w?.deref()?.delete?.(pointerId);
                }
            };

            //
            ROOT.addEventListener("pointermove", registerMove, {capture: true});
            ROOT.addEventListener("pointerup", (ev) => completeSwipe(ev.pointerId), {capture: true});
            ROOT.addEventListener("pointercancel", (ev) => completeSwipe(ev.pointerId), {capture: true});
        }
    }

    //
    limitResize(real, virtual, holder, container) {
        //const box = this.#holder.getBoundingClientRect();
        const box        = getBoundingOrientRect(holder) || holder?.getBoundingClientRect?.();
        const widthDiff  = cbw(container) - (bbw(holder) - (this.#resizing[0].value || 0) + ((box.left || 0) * fixedClientZoom(this.#holder)));
        const heightDiff = cbh(container) - (bbh(holder) - (this.#resizing[1].value || 0) + ((box.top  || 0) * fixedClientZoom(this.#holder)));

        // if relative of un-resized to edge corner max-size
        // discount of dragging offset!
        real[0] = clamp(0, virtual[0], widthDiff);
        real[1] = clamp(0, virtual[1], heightDiff);

        //
        return real;
    }

    // @ts-ignore
    get #parent() { return this.#holder.offsetParent ?? this.#holder?.host ?? ROOT; }

    //
    resizable(options) {
        const handler  = options.handler ?? this.#holder, status: InteractStatus = { pointerId: -1 };
        const weak     = new WeakRef(this.#holder), self_w = new WeakRef(this), upd_w = new WeakRef(this.#updateSize);
        const resizing = this.#resizing;

        //
        handler.addEventListener("pointerdown", agWrapEvent((evc) => {
            const self = self_w?.deref();
            const ev = evc?.detail || evc;

            //
            status.pointerId = ev.pointerId; try { upd_w?.deref?.call?.(self); } catch(e) {};
            const starting = [resizing[0].value || 0, resizing[1].value || 0];
            const holder = weak?.deref?.() as any;
            const parent = holder?.offsetParent ?? holder?.host ?? ROOT;

            //
            if (holder) {
                holder.style.setProperty("will-change", "contents, inline-size, block-size, width, height, transform", "important");
                grabForDrag(holder, ev, { result: resizing, shifting: self?.limitResize?.(starting, starting, holder, parent) });
            }

            //
            ev?.capture?.(self);
            // @ts-ignore
            //ev.target?.setPointerCapture?.(ev.pointerId);
        }));

        //
        this.#holder.addEventListener(
            "m-dragend",
            (evc) => {
                const self   = self_w?.deref?.();
                const holder = weak?.deref?.() as any;
                const dt = evc?.detail ?? evc; evc?.target?.style.removeProperty("will-change");
                if (dt.holding.propertyName == "resize") {
                    status.pointerId = -1;
                    //this.#resizeMute = false;
                }
            },
            {capture: true, passive: false}
        );
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
            //
            if ((ev.type?.includes?.("pointercancel") || ev.type?.includes?.("pointerup")) && status.pointerId == ev?.pointerId) {
                // @ts-ignore
                //ev.target?.releasePointerCapture?.(ev.pointerId);
                status.pointerId = -1;

                //
                const holder = weak?.deref?.() as any;
                holder?.style?.removeProperty?.("will-change");
            }
        });

        //
        ROOT.addEventListener("pointerup"    , cancelShift);
        ROOT.addEventListener("pointercancel", cancelShift);

        //
        this.#holder.addEventListener("m-dragend", (evc) => {
            const holder = weak?.deref?.() as any;
            const box    = getBoundingOrientRect(holder) || holder?.getBoundingClientRect?.();

            //
            setProperty(holder, "--shift-x", (box?.left || 0) - Math.max(this.#resizing[0].value || 0, 0) * 0.5 - (this.#parent[contentBoxWidth ] - this.#holder[borderBoxWidth ]) * 0.5);
            setProperty(holder, "--shift-y", (box?.top  || 0) - Math.max(this.#resizing[1].value || 0, 0) * 0.5 - (this.#parent[contentBoxHeight] - this.#holder[borderBoxHeight]) * 0.5);

            //
            setProperty(holder, "--drag-x", dragging[0].value = 0);
            setProperty(holder, "--drag-y", dragging[1].value = 0);
        });
    }

    //
    propGet(name) {
        const prop = this.#holder.style.getPropertyValue(name);
        const num = prop != null && prop != "" ? parseFloat(prop) || 0 : null;
        return num || null;
    }

    //
    propFloat(name, val) {
        setProperty(this.#holder, name, val);
    }


    //
    longHover(options, fx = (ev) => {
        ev.target.dispatchEvent(
            new CustomEvent("long-hover", {detail: ev?.detail || ev, bubbles: true})
        );
    }) {
        //const handler = options.handler || this.#holder;
        const action: any = { pointerId: -1, timer: null };
        const initiate = agWrapEvent((evc)=>{
            const ev = evc?.detail || evc;
            if ((ev.target.matches(options.selector) || ev.target.closest(options.selector)) && action.pointerId < 0) {
                action.pointerId = ev.pointerId;
                action.timer = setTimeout(()=>{
                    fx?.(ev);
                    if (matchMedia("(pointer: coarse) and (hover: none)").matches) {
                        blockClickTrigger(evc);
                    }
                }, options.holdTime ?? 300);
            }
        });

        //
        const cancelEv = agWrapEvent((evc)=>{
            const ev = evc?.detail || evc;
            if ((ev.target.matches(options.selector) || ev.target.closest(options.selector)) && action.pointerId == ev.pointerId) {
                if (action.timer) { clearTimeout(action.timer); };

                //
                action.timer   = null;
                action.pointerId = -1;
            }
        });

        //
        ROOT.addEventListener("pointerover"  , initiate);
        ROOT.addEventListener("pointerdown"  , initiate);
        ROOT.addEventListener("pointerout"   , cancelEv);
        ROOT.addEventListener("pointerup"    , cancelEv);
        ROOT.addEventListener("pointercancel", cancelEv);
    }

    //
    private holding: any = {
        fx: null,
        options: {},
        actionState: {}
    }

    //
    defaultHandler(ev, weakRef: WeakRef<HTMLElement>) {
        return weakRef?.deref()?.dispatchEvent?.(new CustomEvent("long-press", {detail: ev?.detail || ev, bubbles: true}));
    }

    //
    longPress(options: any = {}, fx?: (ev: PointerEvent) => void) {
        const weakRef = new WeakRef(this.#holder);
        const actionState = this.initializeActionState();

        //
        this.holding = {
            actionState,
            options, fx: fx || ((ev) => this.defaultHandler(ev, weakRef))
        }

        //
        const ROOT = document.documentElement;

        // Event listeners
        const pointerDownListener = (ev: PointerEvent) => this.onPointerDown(this.holding, ev, weakRef);
        const pointerMoveListener = (ev: PointerEvent) => this.onPointerMove(this.holding, ev);
        const pointerUpListener   = (ev: PointerEvent) => this.onPointerUp(this.holding, ev);

        //
        ROOT.addEventListener("pointerdown", pointerDownListener, { passive: false });
        ROOT.addEventListener("pointermove", pointerMoveListener, { passive: true });
        ROOT.addEventListener("pointerup", pointerUpListener, { passive: true });
    }

    //
    private initializeActionState() {
        return {
            timerId: null,
            immediateTimerId: null,
            pointerId: -1,
            startCoord: [0, 0] as [number, number],
            lastCoord: [0, 0] as [number, number],
            isReadyForLongPress: false,
            cancelCallback: () => {},
            cancelPromiseResolver: null as (() => void) | null,
            cancelPromiseRejector: null as ((reason?: any) => void) | null,
        };
    }

    //
    private onPointerDown(self: any, ev: PointerEvent, weakRef: WeakRef<HTMLElement>) {
        if (
            !this.isValidTarget(self, ev.target as HTMLElement, weakRef) ||
            !(self.options.anyPointer || ev?.pointerType == "touch")
        ) return;

        //
        ev.preventDefault();

        // Initialize state
        const { actionState }  = self;
        actionState.pointerId  = ev.pointerId;
        actionState.startCoord = [ev.clientX, ev.clientY];
        actionState.lastCoord  = [...actionState.startCoord];

        // Set up cancellation promise
        const cancelPromise = new Promise<void>((resolve, reject) => {
            actionState.cancelPromiseResolver = resolve;
            actionState.cancelPromiseRejector = reject;
            actionState.cancelCallback = () => {
                clearTimeout(actionState.timerId!);
                clearTimeout(actionState.immediateTimerId!);
                actionState.isReadyForLongPress = false;
                resolve();
                this.resetAction(actionState);
            };
        });

        // Immediate trigger timer
        if (self.options.mouseImmediate && ev.pointerType === "mouse") {
            self.fx?.(ev);
            return actionState.cancelCallback();
        }

        // Long press timer
        actionState.timerId = setTimeout(() => {
            actionState.isReadyForLongPress = true;
        }, self.options.minHoldTime ?? 300);

        // Start timers for long press and immediate actions
        actionState.immediateTimerId = setTimeout(() => {
            if (this.isInPlace(self)) {
                self.fx?.(ev);
                actionState.cancelCallback();
            }
        }, self.options.maxHoldTime ?? 600);

        // Cancel promise handling
        Promise.race([
            cancelPromise,
            new Promise<void>((_, reject) =>
                setTimeout(() => reject(new Error("Timeout")), 5000)
            ),
        ]).catch(console.warn);
    }

    //
    private onPointerMove(self: any, ev: PointerEvent) {
        const {actionState} = self;
        if (ev.pointerId !== actionState.pointerId) return;
        actionState.lastCoord = [ev.clientX, ev.clientY];

        if (!this.isInPlace(self)) {
            actionState.cancelCallback();
        }
    }

    //
    private resetAction(actionState) {
        actionState.pointerId               = -1;
        actionState.cancelPromiseResolver   = null;
        actionState.cancelPromiseRejector   = null;
        actionState.isReadyForLongPress     = false;
        actionState.cancelCallback          = null;
    }

    //
    private onPointerUp(self: any, ev: PointerEvent) {
        const {actionState} = self;
        if (ev.pointerId !== actionState.pointerId) return;

        const [x, y] = [ev.clientX, ev.clientY];
        actionState.lastCoord = [x, y];

        if (actionState.isReadyForLongPress && this.isInPlace(self)) {
            self.fx?.(ev);
            blockClickTrigger(ev);
        }

        actionState.cancelCallback();
    }

    private hasParent(current, parent) {
        while (current) {
            if (current === parent) return true;
            current = current.parentElement;
        }
    }

    private isValidTarget(self: any, target: HTMLElement, weakRef: WeakRef<HTMLElement>): boolean|null|undefined {
        const weakElement = weakRef?.deref?.();//new WeakRef(this.#holder).deref();

        // Check for valid target based on options and hierarchy
        return (
            weakElement && (this.hasParent(target, weakElement) || target === weakElement) &&
            (!self.options.handler || target.matches(self.options.handler))
        );
    }

    private isInPlace(self: any): boolean {
        const {actionState}    = self;
        const [startX, startY] = actionState.startCoord;
        const [lastX, lastY]   = actionState.lastCoord;
        const  distance        = Math.hypot(lastX - startX, lastY - startY);
        return distance <= (self.options.maxOffsetRadius ?? 10);
    }

}

//
export default AxGesture;
