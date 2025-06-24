import { agWrapEvent } from "u2re/dom";
import { ROOT } from "../core/Utils";

//
export class SwipeHandler {
    #holder: HTMLElement;

    //
    constructor(holder, options?) {
        this.#holder = holder;
        if (!holder) { throw Error("Element is null..."); }
        if (options) { this.swipe(options); }
        this.#holder["@control"] = this;
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
            ROOT.addEventListener("pointermove"  , registerMove, {capture: true});
            ROOT.addEventListener("pointerup"    , (ev) => completeSwipe(ev.pointerId), {capture: true});
            ROOT.addEventListener("pointercancel", (ev) => completeSwipe(ev.pointerId), {capture: true});
        }
    }
}

//
export default SwipeHandler;
