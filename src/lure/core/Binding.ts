import { subscribe } from "u2re/object";
import { namedStoreMaps } from "u2re/dom";

/**
 * Symbol for mapped state
 * @type {unique symbol}
 */
export const $mapped = Symbol.for("@mapped");

/**
 * Symbol for virtual state
 * @type {unique symbol}
 */
export const $virtual = Symbol.for("@virtual");

/**
 * Symbol for behavior marker
 * @type {unique symbol}
 */
export const $behavior = Symbol.for("@behavior");

/**
 * Bind reactive behavior to an element given a store and behavior function
 * @param {Element} element
 * @param {[string, any]} store [name, object]
 * @param {(event: any, context: [WeakRef<Element>, [string,any], any])=>void} behavior
 * @returns {Element}
 */
export const bindBeh = (element, store, behavior) => {
    const weak = element instanceof WeakRef ? element : new WeakRef(element), [name, obj] = store;
    if (behavior) {
        subscribe?.(store, (value, prop, old) => {
            const valMap = namedStoreMaps.get(name);
            behavior?.([value, prop, old], [weak, store, valMap?.get(weak.deref?.())]);
        });
    }; return element;
}

/**
 * Bind event controller (checkboxCtrl, valueCtrl etc) to element and set initial value.
 * Returns a cancel function.
 * @param {Element} element
 * @param {(ev: Event) => void} ctrl
 * @returns {()=>void} cancel function
 */
export const bindCtrl = (element, ctrlCb) => {
    ctrlCb?.({ target: element });
    element?.addEventListener?.("click", ctrlCb);
    element?.addEventListener?.("input", ctrlCb);
    element?.addEventListener?.("change", ctrlCb);
    return () => {
        element?.removeEventListener?.("click", ctrlCb);
        element?.removeEventListener?.("input", ctrlCb);
        element?.removeEventListener?.("change", ctrlCb);
    };
}

/**
 * Reflect multiple event ctrls on an element (does not support cancel)
 * @param {Element} element
 * @param {Array<Function>} ctrls
 * @returns {Element}
 */
export const reflectControllers = (element, ctrls) => { for (let ctrl of ctrls) { bindCtrl(element, ctrl); }; return element; }

/**
 * Bind reactive style/prop handler for a ref to an element property, using an optional set WeakRef
 * @param {WeakRef<Element>} el
 * @param {any} value ref object
 * @param {string} prop property name
 * @param {Function} handler handler function
 * @param {WeakRef<any>} [set]
 */
export const bindHandler = (el: any, value: any, prop: any, handler: any, set?: any) => {
    if (value?.value == null || value instanceof CSSStyleValue) return;
    let controller: AbortController | null = null; // @ts-ignore
    controller?.abort?.(); controller = new AbortController();

    const wv = new WeakRef(value);
    subscribe([value, "value"], (curr, _, old) => {
        if (set?.deref?.()?.style?.[prop] === wv?.deref?.() || !(set?.deref?.())) {
            if (typeof wv?.deref?.()?.[$behavior] == "function") {
                wv?.deref?.()?.[$behavior]?.((val = curr) => handler(el?.deref?.(), prop, wv?.deref?.()?.value ?? val), [curr, prop, old], [controller?.signal, prop, el]);
            } else {
                handler(el?.deref?.(), prop, curr);
            }
        }
    });
}

//
export const bindWith = (el, prop, value, handler, set?)=>{
    handler(el, prop, value);
    bindHandler(el, value, prop, handler, set);
}

//
export const bindEvents = (element, events)=>{
    if (events) { Object.entries(events)?.forEach?.(([name, list]) => (list as any)?.values()?.forEach?.((fn) => element.addEventListener(name, (typeof fn == "function") ? fn : fn?.[0], fn?.[1] || {}))); }
}
