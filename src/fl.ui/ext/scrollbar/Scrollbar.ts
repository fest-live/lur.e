// @ts-ignore /* @vite-ignore */
import { computed, subscribe } from "/externals/modules/object.js";

// @ts-ignore /* @vite-ignore */
import { setProperty, zoomOf } from "/externals/modules/dom.js";

// @ts-ignore /* @vite-ignore */
import { scrollRef, sizeRef } from "/externals/modules/blue.js";

//
export interface ScrollBarStatus {
    pointerId: number;
    scroll: number;
    delta: number;
    point: number;
};

//
const axisConfig = [{
    name: "x", tName: "inline",
    cssScrollProperty: ["--scroll-left", "calc(var(--percent-x, 0) * max(calc(var(--scroll-size, 1) - var(--content-size, 1)), 0))"] as [string, string],
    cssPercentProperty: "--percent-x"
}, {
    name: "y", tName: "block",
    cssScrollProperty: ["--scroll-top", "calc(var(--percent-y, 0) * max(calc(var(--scroll-size, 1) - var(--content-size, 1)), 0))"] as [string, string],
    cssPercentProperty: "--percent-y"
}];

//
const fx      = new Set<any>([]);
const asWeak  = (source)=>{ return ((source instanceof WeakRef || typeof source?.deref == "function") ? source : new WeakRef(source)) as any; }
const stepped = (count = 100)=>{ return Array.from({ length: count }, (_, i) => i / count).concat([1]); }

//
const makeTimeline = (source, axis: number)=>{
    const target   = asWeak(source);
    const scroll   = scrollRef(source, (["inline", "block"] as ["inline", "block"])[axis]);
    const content  = sizeRef  (source, (["inline", "block"] as ["inline", "block"])[axis], "content-box");
    const percent  = computed (scroll, (vl)=> ((vl || 0) / ((target?.deref?.()?.[['scrollWidth', 'scrollHeight'][axis]] - content?.value) || 1)));
    subscribe(content,  (vl: any)=>((scroll?.value || 0) / ((target?.deref?.()?.[['scrollWidth', 'scrollHeight'][axis]] - vl) || 1))); return percent;
}

//
const effectProperty = { fill: "both", delay: 0, easing: "linear", rangeStart: "cover 0%", rangeEnd: "cover 100%", duration: 1 };
const scrollbarCoef  = (source: HTMLElement, axis: number)=>{ // @ts-ignore
    const target  = asWeak(source);
    const scroll  = scrollRef(source, (["inline", "block"] as ["inline", "block"])[axis]);
    const content = sizeRef  (source, (["inline", "block"] as ["inline", "block"])[axis], "content-box");
    const percent = computed (content, (vl)=> (vl / target?.deref?.()?.[['scrollWidth', 'scrollHeight'][axis]]));
    subscribe(scroll, ()=>percent.value = (content?.value / (target?.deref?.()?.[['scrollWidth', 'scrollHeight'][axis]] || 1))); return percent;
}

//
const controlVisible = async (source: HTMLElement, timeline: any = null)=>{
    if (!source) return; const target = asWeak(source);
    return subscribe(timeline, (val: any)=>fx.add(()=>{
        const hidden = val < 0.001 || val > 0.999; const tg = target?.deref?.();
        if (tg) {
            setProperty(tg, "visibility", hidden ? "collapse" : "visible");
            setProperty(tg?.querySelector?.("*"), "pointer-events", hidden ? "none" : "auto");
        }
    }))
}

//
const animateByTimeline = async (source: HTMLElement, properties = {}, timeline: any = null)=>{
    if (!source) return; const target = asWeak(source);
    return subscribe(timeline, (val: any)=>{
        fx.add(()=>Object.entries(properties).forEach(([name, $v])=>{
            const values = $v as [any, any];
            setProperty(target?.deref?.(), name, (values[0] * (1 - val) + values[1] * val))
        }));
    })
}

//
const makeInteractive = (holder, content, scrollbar, axis = 0, status: any = {})=>{
    const status_w  = asWeak(status);
    const holder_w  = asWeak(holder);
    const content_w = asWeak(content);
    const scrollbar_w = asWeak(scrollbar);

    //
    const moveScroll = (evc) => {
        const ev     = evc?.detail || evc;
        const status = status_w?.deref?.();
        if (self && status?.pointerId == ev.pointerId) {
            evc?.stopPropagation?.(); evc?.preventDefault?.();
            const curr = ev?.orient?.[axis] ?? (ev[["clientX", "clientY"][axis]] / zoomOf(holder_w?.deref?.()));
            content_w?.deref?.()?.scrollTo?.({
                [['left', 'top'][axis]]: (curr - status.point),
                behavior: 'instant'
            }); status.point = curr;
        }
    }

    //
    const stopScroll = (evc) => {
        const ev     = evc?.detail || evc;
        const status = status_w?.deref?.();
        if (status && status?.pointerId == ev.pointerId) {
            evc?.stopPropagation?.();
            evc?.preventDefault?.();
            status.pointerId = -1;

            // @ts-ignore
            ev.target?.releasePointerCapture?.(ev.pointerId); const hd = holder_w?.deref?.();
            if (hd) {
                hd?.removeEventListener?.("pointerup", stopScroll);
                hd?.removeEventListener?.("pointermove", moveScroll);
                hd?.removeEventListener?.("pointercancel", stopScroll);
            }
        }
    }

    //
    scrollbar
        ?.querySelector?.("*")
        ?.addEventListener?.("pointerdown", (evc: any) => {
            const ev     = evc?.detail || evc;
            const status = status_w?.deref?.();
            if (self && status?.pointerId < 0) {
                evc?.stopPropagation?.();
                evc?.preventDefault?.();
                ev?.target?.setPointerCapture?.(ev.pointerId);

                //
                status.pointerId = ev.pointerId || 0;
                status.point     = ev?.orient?.[axis] || ev[["clientX", "clientY"][axis]] / zoomOf(holder_w?.deref?.());
            }
        });
}

//
export const doAnimate = async ()=>{
    let inWork = {value: true};
    while(inWork?.value) { // @ts-ignore
        fx.values().forEach((cb)=>Promise?.try?.(cb)?.catch?.(console.warn.bind(console))); fx.clear();
        await new Promise((r)=>requestAnimationFrame(r));
    }; return inWork;
}

//
export class ScrollBar {
    scrollbar: HTMLDivElement;
    content: HTMLDivElement;
    status: ScrollBarStatus;
    holder: HTMLElement;

    //
    constructor({holder, scrollbar, content}, axis = 0) {
        this.scrollbar   = scrollbar;
        this.holder      = holder;
        this.content     = content;
        this.status      = { delta: 0, scroll: 0, point: 0, pointerId: -1 };

        //
        const currAxis   = axisConfig[axis]; // @ts-ignore
        const bar        = this.scrollbar; bar?.style?.setProperty(...currAxis.cssScrollProperty, ""), source = this.content; // @ts-ignore
        const native     = typeof ScrollTimeline != "undefined", timeline: any = native ? new ScrollTimeline({ source, axis: currAxis.tName }) : makeTimeline(source, axis);
        const properties = { [currAxis.cssPercentProperty]: native ? stepped(100) : [0,1] };

        //
        if (native) // @ts-ignore
            { bar?.animate(properties, { ...effectProperty, timeline }); } else
            { animateByTimeline(bar, properties, timeline); }

        //
        setProperty    (this.scrollbar, "visibility", "collapse");
        setProperty    (this.scrollbar?.querySelector?.("*"), "pointer-events", "none");
        controlVisible (this.scrollbar, scrollbarCoef(this.content, axis));
        makeInteractive(this.holder, this.content, this.scrollbar, axis, this.status);
    }
}

//
doAnimate?.();
