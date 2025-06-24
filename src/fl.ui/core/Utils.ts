import { orientOf, loadInlineStyle } from "u2re/dom";

//
export interface InteractStatus { pointerId?: number; };
export const ROOT = document.documentElement;
export const setAttributesIfNull = (element, attrs = {})=>{
    return Array.from(Object.entries(attrs)).map(([name, value])=>{
        const old = element.getAttribute(name);
        if (value == null) {
            element.removeAttribute(name);
        } else {
            element.setAttribute(name, old == "" ? (value ?? old) : (old ?? value));
        }
    });
}

//
export const setAttributes = (element, attrs = {})=>{
    return Array.from(Object.entries(attrs)).map(([name, value])=>{
        if (value == null) {
            element.removeAttribute(name);
        } else {
            element.setAttribute(name, value ?? element.getAttribute(name));
        }
    });
}

//
export const throttleMap = new Map<string, any>();
export const setIdleInterval = (cb, timeout = 1000, ...args)=>{
    requestIdleCallback(async ()=>{
        if (!cb || (typeof cb != "function")) return;
        while (true) {
            // @ts-ignore
            await Promise.try(cb, ...args);
            await new Promise((r)=>setTimeout(r, timeout));
            await new Promise((r)=>requestIdleCallback(r, {timeout: 100}));
            await new Promise((r)=>requestAnimationFrame(r));
        }
    }, {timeout: 1000});
}

//
requestIdleCallback(async ()=>{
    while (true) {
        throttleMap.forEach((cb)=>cb?.());
        await new Promise((r)=>requestIdleCallback(r));
    }
}, {timeout: 1000});

//
export const bbw    = (el, orient = null)=> ((orient??orientOf(el))%2 ? el[borderBoxHeight]  : el[borderBoxWidth]);
export const bbh    = (el, orient = null)=> ((orient??orientOf(el))%2 ? el[borderBoxWidth]   : el[borderBoxHeight]);
export const cbw    = (el, orient = null)=> ((orient??orientOf(el))%2 ? el[contentBoxHeight] : el[contentBoxWidth]);
export const cbh    = (el, orient = null)=> ((orient??orientOf(el))%2 ? el[contentBoxWidth]  : el[contentBoxHeight]);
export const MOC    = (element: HTMLElement | null, selector: string): boolean => { return (!!element?.matches?.(selector) || !!element?.closest?.(selector)); };
export const clamp  = (min, val, max) => Math.max(min, Math.min(val, max));
export const UUIDv4 = () => { return crypto?.randomUUID ? crypto?.randomUUID() : "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c => (+c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))).toString(16)); };
export const MOCElement  = (element: HTMLElement | null, selector: string): HTMLElement | null => { return ((!!element?.matches?.(selector) ? element : null) || element?.closest?.(selector)) as HTMLElement | null; };
export const includeSelf = (target, selector)=>{ return (target.querySelector(selector) ?? (target.matches(selector) ? target : null)); }
export const setProperty = (target, name, value, importance = "")=>{
    if ("attributeStyleMap" in target) {
        const raw = target.attributeStyleMap.get(name);
        const prop = raw?.[0] ?? raw?.value;
        if (parseFloat(prop) != value && prop != value || prop == null) {
            //if (raw?.[0] != null) { raw[0] = value; } else
            if (raw?.value != null) { raw.value = value; } else
            { target.attributeStyleMap.set(name, value); };
        }
    } else {
        const prop = target?.style?.getPropertyValue?.(name);
        if (parseFloat(prop) != value && prop != value || prop == null) {
            target?.style?.setProperty?.(name, value, importance);
        }
    }
}

//
export const borderBoxWidth   = Symbol("@border-box-width") , borderBoxHeight  = Symbol("@border-box-height");
export const contentBoxWidth  = Symbol("@content-box-width"), contentBoxHeight = Symbol("@content-box-height");
export const onBorderObserve  = new WeakMap<HTMLElement, ResizeObserver>();
export const onContentObserve = new WeakMap<HTMLElement, ResizeObserver>();
export const doContentObserve = (element, cb: any = ()=>{}) => {
    if (!(element instanceof HTMLElement)) return;
    if (!onContentObserve.has(element)) {
        element[contentBoxWidth]  = (element.clientWidth );
        element[contentBoxHeight] = (element.clientHeight);

        //
        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                if (entry.contentBoxSize) {
                    const contentBoxSize = entry.contentBoxSize[0];
                    if (contentBoxSize) {
                        element[contentBoxWidth]  = Math.min(contentBoxSize.inlineSize, element.clientWidth);
                        element[contentBoxHeight] = Math.min(contentBoxSize.blockSize, element.clientHeight);
                        cb?.(element);
                    }
                }
            }
        });

        //
        onContentObserve.set(element, observer);
        observer.observe((element as any)?.element ?? element, {box: "content-box"});
    }
};

//
export const doBorderObserve = (element, cb: any = ()=>{}) => {
    if (!(element instanceof HTMLElement)) return;
    if (!onBorderObserve.has(element)) {
        element[borderBoxWidth]  = element.offsetWidth;
        element[borderBoxHeight] = element.offsetHeight;
        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                if (entry.borderBoxSize) {
                    const borderBoxSize = entry.borderBoxSize[0];
                    if (borderBoxSize) {
                        element[borderBoxWidth]  = Math.min(borderBoxSize.inlineSize, element.offsetWidth);
                        element[borderBoxHeight] = Math.min(borderBoxSize.blockSize, element.offsetHeight);
                        cb?.(element);
                    }
                }
            }
        });

        //
        onBorderObserve.set(element, observer);
        observer.observe((element as any)?.element ?? element, {box: "border-box"});
    }
}

//
export const blockClickTrigger = (_: MouseEvent | PointerEvent | TouchEvent | null = null)=>{
    const blocker = (ev)=>{
        ev.preventDefault();
        ev.stopPropagation();
        ev.stopImmediatePropagation();

        //
        ROOT.removeEventListener("click", blocker, options);
        ROOT.removeEventListener("contextmenu", blocker, options);
    };

    //
    const options = { once: true, capture: true };
    ROOT.addEventListener("click", blocker, options);
    ROOT.addEventListener("contextmenu", blocker, options);

    //
    setTimeout(()=>{
        ROOT.removeEventListener("click", blocker, options);
        ROOT.removeEventListener("contextmenu", blocker, options);
    }, 100);
}

//
export const getPxValue = (element, name)=>{
    if ("computedStyleMap" in element)  { const cm = element?.computedStyleMap?.();   return cm.get(name)?.value || 0; } else
    if (element instanceof HTMLElement) { const cs = getComputedStyle?.(element, ""); return (parseFloat(cs.getPropertyValue(name)?.replace?.("px", "")) || 0); }
    return 0;
}

//
export const preloadStyle = (styles: string)=>{
    const preInit = URL.createObjectURL(new Blob([styles], {type: "text/css"}));
    const loading = fetch(preInit, {priority: "high", keepalive: true, cache: "force-cache", mode: "same-origin"}); // @ts-ignore
    const styled  = loadInlineStyle(preInit, null, "ux-layer");
    return styled;
}
