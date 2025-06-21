import { subscribe } from "u2re/object";
import { camelToKebab, namedStoreMaps } from "u2re/dom";

/**
 * @type {WeakMap<any, (HTMLElement|DocumentFragment|Text)>}
 * @description Сопоставляет объектам соответствующие DOM-узлы.
 */
export const elMap  = new WeakMap<any, HTMLElement | DocumentFragment | Text>();
export const alives = new FinalizationRegistry((unsub: any) => unsub?.());

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

// short-handed
function handleListeners(root, fn, handlers) { handlers.forEach(({ name, cb }) => fn.call(root, name, cb)); }

/**
 * Bind event controller (checkboxCtrl, valueCtrl etc) to element and set initial value.
 * Returns a cancel function.
 * @param {Element} element
 * @param {(ev: Event) => void} ctrl
 * @returns {()=>void} cancel function
 */
export const bindCtrl = (element, ctrlCb) => {
    ctrlCb?.({ target: element });
    const hdl = { "click": ctrlCb, "input": ctrlCb, "change": ctrlCb };
    handleListeners?.(element, "addEventListener", hdl);
    return () => handleListeners?.(element, "removeEventListener", hdl);
}

/**
 * Reflect multiple event ctrls on an element (does not support cancel)
 * @param {Element} element
 * @param {Array<Function>} ctrls
 * @returns {Element}
 */
export const reflectControllers = (element, ctrls) => { if (ctrls) for (let ctrl of ctrls) { bindCtrl(element, ctrl); }; return element; }

// Stable Universal Key Assignation - eg. [S.U.K.A.]
export const removeFromBank = (el, handler, prop) => { const bank = elMap?.get(el)?.get?.(handler); if (bank) { /*bank[prop]?.();*/ delete bank[prop]; } }
export const addToBank = (el, unsub, prop, handler) => { // @ts-ignore
    const bank = elMap?.getOrInsert?.(el, new WeakMap());
    const handlerMap = bank?.getOrInsert?.(handler, {}) ?? {};
    handlerMap?.[prop]?.(); handlerMap[prop] = unsub; return true;
}

/**
 * Универсальная функция для установки значения, подписки на изменения и обработки через handler.
 * Если передан set=true, то создаётся MutationObserver для отслеживания изменений атрибута.
 */
export const observeAttribute = (el: HTMLElement, prop: string, value: any) => {
    const cb = (mutationList)=>{
        for (const mutation of mutationList) {
            if (mutation.type === "attributes" && mutation.attributeName === attrName) {
                const newValue = el.getAttribute(attrName);
                if (value.value !== newValue) value.value = newValue;
            }
        }
    }

    // if queried, use universal observer
    if (typeof (el as any)?.selector == "string" && (el as any)?.observeAttr != null) return (el as any)?.observeAttr?.(prop, cb);

    //
    const attrName = camelToKebab(prop)!;
    const observer = new MutationObserver(cb);
    observer.observe((el as any)?.element ?? el, { attributes: true, attributeOldValue: true, attributeFilter: [attrName] });
    return observer; // Можно вернуть observer, если нужно управлять его жизненным циклом
};

/**
 * Bind reactive style/prop handler for a ref to an element property, using an optional set WeakRef
 * @param {WeakRef<Element>} el
 * @param {any} value ref object
 * @param {string} prop property name
 * @param {Function} handler handler function
 * @param {WeakRef<any>} [set]
 */
export const bindHandler = (el: any, value: any, prop: any, handler: any, set?: any, withObserver?: boolean) => {
    if (value?.value == null || value instanceof CSSStyleValue) return; // don't add any already bound property/attribute

    //
    let controller: AbortController | null = null; // @ts-ignore
    controller?.abort?.(); controller = new AbortController();

    //
    const wv = new WeakRef(value);
    const un = subscribe?.([value, "value"], (curr, _, old) => {
        if (set?.deref?.()?.style?.[prop] === wv?.deref?.() || !(set?.deref?.())) {
            if (typeof wv?.deref?.()?.[$behavior] == "function") {
                wv?.deref?.()?.[$behavior]?.((val = curr) => handler(el?.deref?.(), prop, wv?.deref?.()?.value ?? val), [curr, prop, old], [controller?.signal, prop, el]);
            } else {
                handler(el?.deref?.(), prop, curr);
            }
        }
    });

    //
    let obs: any = null; if (withObserver) { obs = observeAttribute(el, prop, value); };
    const unsub = ()=> { obs?.disconnect?.(); un?.(); controller?.abort?.(); removeFromBank?.(el, handler, prop); }; // @ts-ignore
    alives.register(el, unsub); if (!addToBank(el, unsub, prop, handler)) { return unsub; } // prevent data disruption
}

//
export const bindWith = (el, prop, value, handler, set?, withObserver?: boolean)=>{
    handler(el, prop, value); return bindHandler(el, value, prop, handler, set, withObserver);
}

//
export const bindEvents = (element, events)=>{
    if (events) { Object.entries(events)?.forEach?.(([name, list]) => (list as any)?.values()?.forEach?.((fn) => element.addEventListener(name, (typeof fn == "function") ? fn : fn?.[0], fn?.[1] || {}))); }
}
