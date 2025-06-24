import { blockClickTrigger, ROOT } from "../core/Utils";
import { agWrapEvent } from "u2re/dom";

//
export class LongHoverHandler {
    #holder: HTMLElement;

    //
    constructor(holder, options?, fx = (ev) => {ev.target.dispatchEvent(new CustomEvent("u2-longhover", {detail: ev?.detail || ev, bubbles: true}));}) {
        this.#holder = holder; holder["@control"] = this;
        if (!holder) { throw Error("Element is null..."); };
        if (options) { this.longHover(options, fx); };
    }

    //
    defaultHandler(ev, weakRef: WeakRef<HTMLElement>) {
        return weakRef?.deref()?.dispatchEvent?.(new CustomEvent("long-press", {detail: ev?.detail || ev, bubbles: true}));
    }

    //
    longHover(options, fx = (ev) => {ev.target.dispatchEvent(new CustomEvent("long-hover", {detail: ev?.detail || ev, bubbles: true}));}) {
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
}

//
export default LongHoverHandler;
