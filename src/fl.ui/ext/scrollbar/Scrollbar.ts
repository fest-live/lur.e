import {    subscribe, computed } from "u2re/object";
import { E, scrollRef, sizeRef  } from "u2re/lure";
import { Q, setProperty, makeRAFCycle } from "u2re/dom";

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
const CAXIS    = ["layerX", "layerY"];
const asWeak   = (source)=>{ return ((source instanceof WeakRef || typeof source?.deref == "function") ? source : new WeakRef(source)) as any; }
const stepped  = (count = 100)=>{ return Array.from({ length: count }, (_, i) => i / count).concat([1]); }
const sheduler = makeRAFCycle();

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
    const percent = computed (content, (vl)=> (vl / (target?.deref?.()?.[['scrollWidth', 'scrollHeight'][axis]] || 1)));
    subscribe(scroll, ()=>percent.value = (content?.value / (target?.deref?.()?.[['scrollWidth', 'scrollHeight'][axis]] || 1))); return percent;
}

//
//const sheduler = makeRAFCycle();
const controlVisible = async (source: HTMLElement, coef: any = null)=>{
    if (!source) return; const target = asWeak(source), wk = asWeak(coef);
    const renderCb = ()=>{
        const tg = target?.deref?.(); if (tg) {
            const val = wk?.deref?.()?.value || 0, hidden = val < 0.001 || val > 0.999;
            setProperty(tg, "visibility", hidden ? "collapse" : "visible");
            setProperty(tg?.querySelector?.("*"), "pointer-events", hidden ? "none" : "auto");
        }
    };
    return subscribe(coef, (val: any)=>sheduler.shedule(renderCb))
}

//
const animateByTimeline = async (source: HTMLElement, properties = {}, timeline: any = null)=>{
    if (!source) return; const target = asWeak(source), wk = asWeak(timeline);
    const  everyCb = ()=>Object.entries(properties).forEach(renderCb);
    const renderCb = ([name, $v])=>{
        const tg = target?.deref?.(); if (tg) {
            const val = wk?.deref?.()?.value || 0, values = $v as [any, any];
            setProperty(tg, name, (values[0] * (1 - val) + values[1] * val))
        }
    }
    return subscribe(timeline, (val: any)=>sheduler.shedule(everyCb))
}

//
CSS.registerProperty({ name: "--percent-x", syntax: "<number>", inherits: true, initialValue: "0" });
CSS.registerProperty({ name: "--percent-y", syntax: "<number>", inherits: true, initialValue: "0" });

//
const makeInteractive = (holder, content, scrollbar, axis = 0, status: any = {})=>{
    const status_w  = asWeak(status);
    const content_w = asWeak(content);

    //
    const moveScroll = (evc) => {
        const ev     = evc?.detail || evc;
        const status = status_w?.deref?.();
        if (self && status?.pointerId == ev.pointerId) {
            evc?.stopPropagation?.(); evc?.preventDefault?.();
            const cm = ev[CAXIS[axis]] || 0; const dm = (cm - status.point) || 0;
            const contentScrollSize = content.scrollHeight - content.clientHeight;
            const trackSize = scrollbar.clientHeight - handler?.querySelector?.("*")?.clientHeight;
            const DT = (dm * contentScrollSize) / trackSize; status.point = cm;

            // Скроллим содержимое
            content_w?.deref?.()?.scrollTo?.({
                [['left', 'top'][axis]]: (status.scroll += DT),
                behavior: 'instant'
            });
        }
    }

    //
    const handler = scrollbar;
    const stopScroll = (evc) => {
        const ev     = evc?.detail || evc;
        const status = status_w?.deref?.();
        if (status && status?.pointerId == ev.pointerId) {
            evc?.stopPropagation?.();
            evc?.preventDefault?.();
            status.point = ev[CAXIS[axis]] || 0;

            // @ts-ignore
            (handler?.element ?? ev.target)?.releasePointerCapture?.(status.pointerId); status.pointerId = -1;
            handler?.removeEventListener?.("pointerup", stopScroll);
            handler?.removeEventListener?.("pointermove", moveScroll);
            handler?.removeEventListener?.("pointercancel", stopScroll);
        }
    }

    //
    handler?.addEventListener?.("pointerdown", (evc: any) => {
        const ev     = evc?.detail || evc;
        const status = status_w?.deref?.();
        if (self && status?.pointerId < 0) {
            evc?.stopPropagation?.();
            evc?.preventDefault?.();
            (handler?.element ?? ev.target)?.setPointerCapture?.(status.pointerId = ev.pointerId || 0);

            //
            status.point  = ev[CAXIS[axis]] || 0;
            status.scroll = content_w?.deref?.()?.[["scrollLeft", "scrollTop"][axis]] || 0;

            //
            handler?.removeEventListener?.("pointerup", stopScroll);
            handler?.removeEventListener?.("pointermove", moveScroll);
            handler?.removeEventListener?.("pointercancel", stopScroll);
            handler?.addEventListener?.("pointerup", stopScroll);
            handler?.addEventListener?.("pointermove", moveScroll);
            handler?.addEventListener?.("pointercancel", stopScroll);
        }
    });
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
        const bar        = this.scrollbar, source = this.content; bar?.style?.setProperty(...currAxis.cssScrollProperty, "") // @ts-ignore
        const native     = typeof ScrollTimeline != "undefined", timeline: any = native ? new ScrollTimeline({ source: (source as any)?.element ?? source, axis: currAxis.tName }) : makeTimeline(source, axis);
        const properties = { [currAxis.cssPercentProperty]: [0,1] };

        //
        if (native) // @ts-ignore
            { bar?.animate?.(properties, { ...effectProperty, timeline }); } else
            { animateByTimeline(bar, properties, timeline); }

        //
        const sce = scrollbarCoef(this.content, axis);
        setProperty    (this.scrollbar, "visibility", "collapse");
        setProperty    (this.scrollbar?.querySelector?.("*"), "pointer-events", "none");
        controlVisible (this.scrollbar, sce);
        makeInteractive(this.holder, this.content, this.scrollbar, axis, this.status);

        //
        E(Q("*", this.scrollbar), { style: { "--scroll-coef": sce } });
    }
}
