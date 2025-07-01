import { setStyleProperty, makeRAFCycle } from "u2re/dom"; const isVal = (v: any) => v != null && v !== false && (typeof v != "object" && typeof v != "function");
type DatasetValue = string | number | boolean | null | undefined | { value?: string | number | boolean | null | undefined };

//
export const camelToKebab = (str: string) => str?.replace?.(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
export const kebabToCamel = (str: string) => str?.replace?.(/-([a-z])/g, (_, c) => c.toUpperCase());
export const deleteStyleProperty = (el: HTMLElement, name: string) => el.style.removeProperty(camelToKebab(name));

//
export const handleHidden = (element, hidden) => {
    const isNotHidden = (!hidden && typeof hidden != "string") ? true : (hidden == "" ? false : true);
    if (typeof hidden == "object" && hidden && "value" in hidden) { hidden = hidden.value }; // @ts-ignore
    if (element instanceof HTMLInputElement) { element.hidden = !isNotHidden; } else
        { if (isNotHidden) { delete element.dataset?.hidden; } else { element.dataset.hidden = ""; } }
    return element;
}

//
export const handleProperty = (el?: HTMLElement|null, prop?: string, val?: any)=>{
    if (!prop || !el) return; prop = kebabToCamel(prop)!; // @ts-ignore
    if (el?.[prop] === val) return; // @ts-ignore
    if (typeof val == "object" && val && "value" in val) val = val.value; // @ts-ignore
    if (el && el?.[prop] !== val)
        { if (typeof val == "undefined") { delete el[prop]; } else { el[prop] = val; } }
}

//
export const handleDataset = (el?: HTMLElement|null, prop?: string, val?: DatasetValue) => {
    if (!prop || !el) return; prop = kebabToCamel(prop)!; // @ts-ignore
    if (el.dataset[prop] === val) return; // @ts-ignore
    if (typeof val == "object" && val && "value" in val) val = val.value; // @ts-ignore
    if (val == null || val === false) delete el.dataset[prop]; else // @ts-ignore
    if (typeof val != "object" && typeof val != "function") el.dataset[prop] = String(val); else
        { delete el.dataset[prop]; console.warn(`Invalid type of attribute value "${prop}":`, val); }
};

//
export const handleStyleChange = (el?: HTMLElement|null, prop?: string, val?: any) => {
    if (!prop || typeof prop != "string" || !el) return;
    if (typeof val == "object" && val && "value" in val && !(typeof CSSStyleValue !== "undefined" && val instanceof CSSStyleValue)) val = val.value;
    if (val == null) deleteStyleProperty(el, prop); else
    if (isVal(val) || (typeof CSSStyleValue !== "undefined" && val instanceof CSSStyleValue)) { setStyleProperty(el, prop, val); } else
        { deleteStyleProperty(el, prop); if (val !== false) console.warn(`Invalid value for style property "${prop}":`, val); }
};

//
export const handleAttribute = (el?: HTMLElement|null, prop?: string, val?: any) => {
    if (!prop || !el) return; prop = camelToKebab(prop)!;
    if (el.getAttribute?.(prop) === val) return;
    if (typeof val == "object" && val && "value" in val) val = val.value;
    if (val == null || val === false) el.removeAttribute(prop); else
    if (typeof val != "object" && typeof val != "function") el.setAttribute(prop, String(val)); else { el.removeAttribute(prop);
    if (val !== false) console.warn(`Invalid type of attribute value "${prop}":`, val); }
};

/**
 * Produces a "rAF behavior" callback, which defers calls via requestAnimationFrame cycle
 * @param {Function} cb function to call
 * @param {ReturnType<typeof makeRAFCycle>} [shed]
 * @returns {Function}
 */
export const RAFBehavior = (cb, shed = makeRAFCycle()) => {
    return (...args) => { return shed.shedule(() => cb?.(...args)); }
}

// usable for delayed trigger when come true, but NOT when come false
export const triggerWithDelay = (ref, cb, delay = 100)=>{ if (ref?.value ?? ref) { return setTimeout(()=>{ if (ref.value) cb?.(); }, delay); } }
export const delayedBehavior  = (delay = 100) => {
    return (cb, [val], [sig]) => { let tm = triggerWithDelay(val, cb, delay); sig?.addEventListener?.("abort", ()=>{ if (tm) clearTimeout(tm); }, { once: true }); };
}

// usable for delayed visible but instant hiding
export const delayedOrInstantBehavior = (delay = 100) => {
    return (cb, [val], [sig]) => { let tm = triggerWithDelay(val, cb, delay); sig?.addEventListener?.("abort", ()=>{ if (tm) clearTimeout(tm); }, { once: true }); if (!tm) { cb?.(); }; };
}
