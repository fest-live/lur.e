import { ROOT, agWrapEvent, addEvents } from "fest/dom";

//
export class SwipeHandler {
    #holder: HTMLElement;

    //
    constructor(holder, options?) {
        (this.#holder = holder)["@control"] = this;
        if (!holder) { throw Error("Element is null..."); }
        if (options) { this.swipe(options); }
    }

    //
    swipe(options) {
        if (options?.handler) {
            const swipes = new Map<number, any>([]);
            const swipes_w = new WeakRef(swipes);

            //
            const registerMove = (evc) => {
                const ev = evc;
                if (swipes?.has?.(ev.pointerId)) {
                    ev.stopPropagation();
                    const swipe = swipes?.get?.(ev.pointerId);
                    Object.assign(swipe || {}, {
                        current: [...(ev.client || [ev?.clientX, ev?.clientY])],
                        pointerId: ev.pointerId,
                        time: performance.now(),
                    });
                }
            };

            //
            const compAngle = (a, c) => { return ((a - c + 540) % 360) - 180; };
            const completeSwipe = (ev) => {
                const pointerId = ev.pointerId;
                if (swipes?.has?.(pointerId)) {
                    const swipe = swipes_w?.deref()?.get?.(pointerId);
                    const diffP = [
                        swipe.start[0] - swipe.current[0],
                        swipe.start[1] - swipe.current[1],
                    ];
                    const diffT = performance.now() - swipe.startTime;
                    const speed = Math.hypot(...diffP) / diffT;
                    if ((swipe.speed = speed) > (options.threshold || 0.5)) {
                        swipe.direction = "name";
                        swipe.swipeAngle = Math.atan2(
                            swipe.current[1] - swipe.start[1],
                            swipe.current[0] - swipe.start[0]
                        );

                        //
                        if ( Math.abs( compAngle(swipe.swipeAngle * (180 / Math.PI), 0   ) ) <= 20 ) { swipe.direction = "left"; }; //AR.get(el.getAttribute("data-swipe-action-left"))?.(el); swipe.direction = "left"; }
                        if ( Math.abs( compAngle(swipe.swipeAngle * (180 / Math.PI), 180 ) ) <= 20 ) { swipe.direction = "right"; }; //AR.get(el.getAttribute("data-swipe-action-right"))?.(el); swipe.direction = "right"; }
                        if ( Math.abs( compAngle(swipe.swipeAngle * (180 / Math.PI), 270 ) ) <= 20 ) { swipe.direction = "up"; }; //AR.get(el.getAttribute("data-swipe-action-up"))?.(el); swipe.direction = "up"; }
                        if ( Math.abs( compAngle(swipe.swipeAngle * (180 / Math.PI), 90  ) ) <= 20 ) { swipe.direction = "down"; }; //AR.get(el.getAttribute("data-swipe-action-down"))?.(el); swipe.direction = "down"; }
                        options?.trigger?.(swipe);
                    }
                    swipes_w?.deref()?.delete?.(pointerId);
                }
            };

            //
            const takeAction = agWrapEvent((evc) => {
                const ev = evc;
                if (ev.target == options?.handler) {
                    swipes?.set(ev.pointerId, {
                        target: ev.target,
                        start: [...(ev.client || [ev?.clientX, ev?.clientY])],
                        current: [...(ev.client || [ev?.clientX, ev?.clientY])],
                        pointerId: ev.pointerId,
                        startTime: performance.now(),
                        time: performance.now(),
                        speed: 0,
                    }); // @ts-ignore // stronger policy now...
                    ev?.capture?.();
                }
            })

            //
            addEvents(ROOT, {
                "pointerdown"  : takeAction   ,
                "pointermove"  : registerMove ,
                "pointerup"    : completeSwipe,
                "pointercancel": completeSwipe,
            });
        }
    }
}

//
export default SwipeHandler;
