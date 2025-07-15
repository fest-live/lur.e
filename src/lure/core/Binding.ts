import { addToCallChain, makeReactive, subscribe } from "fest/object";
import { camelToKebab, handleListeners, namedStoreMaps, observeAttribute, observeBySelector } from "fest/dom";

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
        const usub = subscribe?.(store, (value, prop, old) => {
            const valMap = namedStoreMaps.get(name);
            behavior?.([value, prop, old], [weak, store, valMap?.get(weak.deref?.())]);
        });
        addToCallChain(store, Symbol.dispose, usub);
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
    const hdl = { "click": ctrlCb, "input": ctrlCb, "change": ctrlCb };
    ctrlCb?.({ target: element }); handleListeners?.(element, "addEventListener", hdl);
    return () => handleListeners?.(new WeakRef(element), "removeEventListener", hdl);
}

/**
 * Reflect multiple event ctrls on an element (does not support cancel)
 * @param {Element} element
 * @param {Array<Function>} ctrls
 * @returns {Element}
 */
export const reflectControllers = (element, ctrls) => { if (ctrls) for (let ctrl of ctrls) { bindCtrl(element, ctrl); }; return element; }

//
export const $fxy = Symbol.for("@fix"), fixFx = (obj) => { if (typeof obj == "function" || obj == null) return obj; const fx = function(){}; fx[$fxy] = obj; return fx; }
export const $set = (rv, key, val)=>{ if (rv?.deref?.() != null) { return (rv.deref()[key] = val); }; }

/**
 * Универсальная функция для установки значения, подписки на изменения и обработки через handler.
 * Если передан set=true, то создаётся MutationObserver для отслеживания изменений атрибута.
 */
export const $observeAttribute = (el: HTMLElement, prop: string, value: any) => {
    const wv = new WeakRef(value);
    const cb = (mutation)=>{
        if (mutation.type == "attributes" && mutation.attributeName === attrName) {
            const value = mutation?.target?.getAttribute?.(mutation.attributeName);
            const val = wv?.deref?.(), reVal = wv?.deref?.()?.value;
            if (mutation.oldValue != value && (val != null && (reVal != null || (typeof val == "object" || typeof val == "function"))))
                { if (reVal !== value) { $set(wv, "value", value); } }
        }
    }

    // if queried, use universal observer
    //if (typeof (el as any)?.selector == "string" && (el as any)?.observeAttr != null) return (el as any)?.observeAttr?.(prop, cb);
    const attrName = camelToKebab(prop)!;
    return observeAttribute(el, attrName, cb);
};

// @ts-ignore // Stable Universal Key Assignation - eg. [S.U.K.A.]
export const removeFromBank = (el, handler, prop) => { const bank = elMap?.get(el)?.get?.(handler); if (bank) { /*bank[prop]?.();*/ delete bank[prop]; } }
export const      addToBank = (el, unsub, prop, handler) => { // @ts-ignore
    const bank      = elMap?.getOrInsert?.(el, new WeakMap());
    const handlerMap = bank?.getOrInsert?.(handler, {}) ?? {};
    handlerMap?.[prop]?.(); handlerMap[prop] = unsub; return true;
}

//
export const hasInBank = (el, handle)=>{
    const bank: any = elMap?.get?.(el);
    return !!bank?.has?.(handle);
}

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
    const wel = el instanceof WeakRef ? el : new WeakRef(el); el = wel?.deref?.() ?? el;
    const wv = new WeakRef(value);
    const un = subscribe?.([value, "value"], (curr, _, old) => {
        if (set?.deref?.()?.[prop] === wv?.deref?.() || !set?.deref?.()) {
            if (typeof wv?.deref?.()?.[$behavior] == "function")
                { wv?.deref?.()?.[$behavior]?.((val = curr) => handler(wel?.deref?.(), prop, wv?.deref?.()?.value ?? val), [curr, prop, old], [controller?.signal, prop, wel]); } else
                { handler(wel?.deref?.(), prop, curr); }
        }
    });

    //
    let obs: any = null; if (withObserver) { obs = $observeAttribute(el, prop, value); };
    const unsub = () => { obs?.disconnect?.(); un?.(); controller?.abort?.(); removeFromBank?.(el, handler, prop); }; // @ts-ignore
    addToCallChain(value, Symbol.dispose, unsub); alives.register(el, unsub); if (!addToBank(el, unsub, prop, handler)) { return unsub; } // prevent data disruption
}

//
export const includeSelf = (target, selector)=>{ return (target.querySelector(selector) ?? (target.matches(selector) ? target : null)); }
export const updateInput = (target, state)=>{
    const selector = "input:where([type=\"text\"], [type=\"number\"], [type=\"range\"])";
    const input    = includeSelf(target, "input");
    const name     = input?.name || target?.dataset?.name || "";

    //
    if (state?.[name] != null || name in state) { // not exists not preferred...
        if (state && input?.matches?.(selector)) {
            if (input.value != state[name]) {
                input.value = state[name];
                input.dispatchEvent(new Event("change", { bubbles: true, cancelable: true, }));
            }
        }

        // setup radio boxes (requires wrapper)
        if (state) {
            const radio = includeSelf(target, `input:where([type=\"radio\"][name=\"${name}\"][value=\"${state?.[name]}\"])`);
            if (state && radio && state[name] == radio.value && !radio?.checked) { radio?.click?.(); };
        }

        // setup check boxes
        const checkbox = includeSelf(target, "input:where([type=\"checkbox\"])");
        if (state && checkbox) {
            if (state[name] != checkbox.checked) {
                checkbox.checked = !!state[name];
                checkbox.dispatchEvent(new Event("change", { bubbles: true, cancelable: true, }))
            }
        }
    }
}

//
export const bindEvents = (el, events)=>{ if (events) { Object.entries(events)?.forEach?.(([name, list]) => (list as any)?.values()?.forEach?.((fn) => el.addEventListener(name, (typeof fn == "function") ? fn : fn?.[0], fn?.[1] || {}))); } }
export const bindWith   = (el, prop, value, handler, set?, withObserver?: boolean)=>{ handler(el, prop, value); return bindHandler(el, value, prop, handler, set, withObserver); }
export const bindForms  = (fields = document.documentElement, wrapper = ".u2-input", state = {})=>{
    state ??= makeReactive({});

    //
    const wst = new WeakRef(state);
    const onChange = (ev)=>{
        const state  = wst?.deref?.(); if (!state) return;
        const input  = (ev?.target?.matches?.("input") ? ev?.target : ev?.target?.querySelector?.("input"));
        const target = (ev?.target?.matches?.(wrapper) ? ev?.target : input?.closest?.(wrapper)) ?? input;
        const name   = input?.name || target?.name || target?.dataset?.name;

        //
        if (state?.[name] != null || name in state) { // not exists not preferred...
            if (input?.matches?.("input:where([type=\"text\"], [type=\"number\"], [type=\"range\"])")) {
                const value = (input.valueAsNumber != null && !isNaN(input.valueAsNumber)) ? input.valueAsNumber : input.value;
                if (state[name] != value) { state[name] = value; };
            }

            // any radio-box
            if (input?.matches?.("input[type=\"radio\"]") && state[name] != input?.value && input?.checked)
                {state[name] = input.value; }

            // any check-box
            if (input?.matches?.("input[type=\"checkbox\"]") && state[name] != input?.checked)
                {state[name] = input.checked; }
        }
    };

    //
    const appearHandler = () => requestIdleCallback(() => fields.querySelectorAll(wrapper).forEach((target) => updateInput(target, state)), { timeout: 100 });
    const observer      = observeBySelector(fields, wrapper, (mutations) => mutations.addedNodes.forEach((target) => requestIdleCallback(() => updateInput(state, target), { timeout: 100 })));
    const unsubscribe   = subscribe?.(state, (value, property) => fields.querySelectorAll(wrapper).forEach((target) => updateInput(target, state)));
    requestIdleCallback(() => fields.querySelectorAll(wrapper).forEach((target) => updateInput(target, state)), { timeout: 100 });

    //
    fields.addEventListener("input" , onChange);
    fields.addEventListener("change", onChange);
    fields.addEventListener("u2-appear", appearHandler);

    //
    const wf = new WeakRef(fields);
    addToCallChain(state, Symbol.dispose, () => {
        const fields = wf?.deref?.();
        fields?.removeEventListener?.("input", onChange);
        fields?.removeEventListener?.("change", onChange);
        fields?.removeEventListener?.("u2-appear", appearHandler);
        observer?.disconnect?.();
        unsubscribe?.();
    });

    //
    return state;
}
