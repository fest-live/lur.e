import { addToCallChain, makeReactive, subscribe, isNotEqual } from "fest/object";
import { camelToKebab, handleAttribute, handleListeners, handleProperty, namedStoreMaps, observeAttribute, observeBySelector } from "fest/dom";
import { setChecked } from "fest/dom";

//
export const elMap  = new WeakMap<any, WeakMap<any, any>>();
export const alives = new FinalizationRegistry((unsub: any) => unsub?.());

//
export const $mapped = Symbol.for("@mapped");
export const $virtual = Symbol.for("@virtual");
export const $behavior = Symbol.for("@behavior");

//
const hasValue = (v: any) => {
    return (typeof v == "object" && (v?.value != null || (v != null && ("value" in v))));
}

//
export const bindBeh = (element, store, behavior) => {
    const weak = toRef(element), [name, obj] = store;
    if (behavior) {
        const usub = subscribe?.(store, (value, prop, old) => {
            const valMap = namedStoreMaps.get(name);
            behavior?.([value, prop, old], [weak, store, valMap?.get(deref(weak))]);
        });
        addToCallChain(store, Symbol.dispose, usub);
    }; return element;
}

//
export const bindCtrl = (element, ctrlCb) => {
    const hdl = { "click": ctrlCb, "input": ctrlCb, "change": ctrlCb }; ctrlCb?.({ target: element });
    const unsub = handleListeners?.(element, "addEventListener", hdl);
    addToCallChain(element, Symbol.dispose, unsub); return unsub;
}

//
export const reflectControllers = (element, ctrls) => { if (ctrls) for (let ctrl of ctrls) { bindCtrl(element, ctrl); }; return element; }

//
export const $fxy = Symbol.for("@fix"), fixFx = (obj) => { if (typeof obj == "function" || obj == null) return obj; const fx = function(){}; fx[$fxy] = obj; return fx; }
export const $set = (rv, key, val) => {
    if ((rv = deref(rv)) != null && (typeof rv == "object" || typeof rv == "function")) {
        return (rv[key] = hasValue(val = deref(val)) ? val?.value : val);
    };
}

//
export const $observeInput = (element, ref?: any|null, prop = "value") => {
    const wel = toRef(element);
    const rf = toRef(ref);
    const ctrlCb = (ev)=>{
        $set(rf, "value", deref(wel)?.[prop ?? "value"] ?? hasValue(deref(rf)) ? deref(rf)?.value : deref(rf));
    }

    //
    const hdl = { "click": ctrlCb, "input": ctrlCb, "change": ctrlCb };
    ctrlCb?.({ target: element }); handleListeners?.(element, "addEventListener", hdl);

    //
    $set(rf, "value", element?.[prop ?? "value"] ?? (hasValue(deref(ref)) ? deref(ref)?.value : deref(ref)));
    return () => handleListeners?.(element, "removeEventListener", hdl);
}

//
export const $observeAttribute = (el: HTMLElement, ref?: any|null, prop: string = "") => {
    const wel = toRef(el); //el?.getAttribute?.(prop)
    const wv = toRef(ref); //el?.getAttribute?.(prop)
    const cb = (mutation)=>{

        //
        if (mutation.type == "attributes" && mutation.attributeName == attrName) {
            const value = mutation?.target?.getAttribute?.(mutation.attributeName);
            const val = deref(wv), reVal = hasValue(val) ? val?.value : val;

            //
            if (isNotEqual(mutation.oldValue, value) && (val != null && (reVal != null || (typeof val == "object" || typeof val == "function"))))
            { if (isNotEqual(reVal, value) || reVal == null) { $set(val, "value", hasValue(reVal) ? reVal?.value : reVal); } }
        }
    }

    // if queried, use universal observer
    //if (typeof (el as any)?.selector == "string" && (el as any)?.observeAttr != null) return (el as any)?.observeAttr?.(prop, cb);
    const attrName = camelToKebab(prop)!;
    return observeAttribute(el, attrName, cb);
}

// @ts-ignore // Stable Universal Key Assignation - eg. [S.U.K.A.]
export const removeFromBank = (el, handler, prop) => { const bank = elMap?.get(el)?.get?.(handler); if (bank) { const old = bank[prop]?.[1]; delete bank[prop]; old?.(); } }

//
export const      addToBank = (el, handler, prop, forLink) => { // @ts-ignore
    const bank      = elMap?.getOrInsert?.(el, new WeakMap());
    const handlerMap = bank?.getOrInsert?.(handler, {}) ?? {};
    handlerMap?.[prop]?.[1]?.(); handlerMap[prop] = forLink; return true;
}

//
export const hasInBank = (el, handle)=>{
    const bank: any = elMap?.get?.(el);
    return !!bank?.has?.(handle);
}

//
const toRef = (el?: any | null) => {
    return el != null ? (el instanceof WeakRef || typeof el?.deref == "function") ? el : ((typeof el == "object" || typeof el == "function") ? new WeakRef(el) : el) : null;
}

//
const deref = (target?: any | null) => {
    return target != null ? ((target instanceof WeakRef || typeof target?.deref == "function") ? target?.deref?.() : target) : null;
};

//
export const bindHandler = (element: any, value: any, prop: any, handler: any, set?: any, withObserver?: boolean | Function) => {
    const wel = toRef(element); element = deref(wel);
    if (!element) return;

    //
    let controller: AbortController | null = null; // @ts-ignore
    controller?.abort?.(); controller = new AbortController();

    //
    const wv = toRef(value);
    const un = subscribe?.([value, "value"], (curr, _, old) => {
        if (!deref(set) || deref(set)?.[prop] == deref(wv)) {
            const val = deref(wv);

            //
            if (typeof val?.[$behavior] == "function") {
                val?.[$behavior]?.((val = curr) => handler(deref(wel), prop, hasValue(val) ? val?.value : val), [curr, prop, old], [controller?.signal, prop, wel]);
            } else {
                handler(deref(wel), prop, hasValue(val) ? val?.value : val);
            }
        }
    });

    //
    let obs: any = null;
    if (typeof withObserver == "boolean" && withObserver) {
        if (handler == handleAttribute) obs = $observeAttribute(element, value, prop);
        if (handler == handleProperty) obs = $observeInput(element, value, prop);
    };
    if (typeof withObserver == "function") { obs = withObserver(element, prop, value); };
    const unsub = () => { obs?.disconnect?.(); (obs != null && typeof obs == "function") ? obs?.() : null; un?.(); controller?.abort?.(); removeFromBank?.(element, handler, prop); }; // @ts-ignore
    addToCallChain(value, Symbol.dispose, unsub); alives.register(element, unsub);
    if (!addToBank(element, handler, prop, [value, unsub])) { return unsub; } // prevent data disruption
}

//
export const includeSelf = (target, selector)=>{ return (target.querySelector(selector) ?? (target.matches(selector) ? target : null)); }

//
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
            if (state && radio && state[name] == radio.value && !radio?.checked) { setChecked(radio, state[name]); };
        }

        // setup check boxes
        const checkbox = includeSelf(target, "input:where([type=\"checkbox\"])");
        if (state && checkbox) {
            if (state[name] != checkbox.checked) {
                setChecked(checkbox, state[name]);
            }
        }
    }
}

//
const isArrayOrIterable = (obj) => Array.isArray(obj) || (obj != null && typeof obj == "object" && typeof obj[Symbol.iterator] == "function");

//
export const bindEvents = (el, events) => {
    if (events) {
        let entries: any[] = [];
        if (events instanceof Map) {
            entries = [...events.entries()];
        } else {
            Object.entries(events)
            entries = Object.entries(events);
        }
        entries?.forEach?.(([name, list]) => ((isArrayOrIterable(list) ? [...list as any] : list) || [])?.forEach?.((fn) => el.addEventListener(name, (typeof fn == "function") ? fn : fn?.[0], fn?.[1] || {})));
    }
}

//
export const bindWith = (el, prop, value, handler, set?, withObserver?: boolean | Function) => { handler(el, prop, value); return bindHandler(el, value, prop, handler, set, withObserver); }

//
export const bindForms  = (fields = document.documentElement, wrapper = ".u2-input", state = {})=>{
    state ??= makeReactive({});

    //
    const wst = new WeakRef(state);
    const onChange = (ev)=>{
        const state = deref(wst); if (!state) return;
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
        const fields = deref(wf);
        fields?.removeEventListener?.("input", onChange);
        fields?.removeEventListener?.("change", onChange);
        fields?.removeEventListener?.("u2-appear", appearHandler);
        observer?.disconnect?.();
        unsubscribe?.();
    });

    //
    return state;
}

/*
// alternate or old implementation
export const synchronizeInputs = (state, wrapper = ".u2-input", fields = document.documentElement, subscribe?: Function)=>{

    //
    const onChange = (ev)=>{
        const input  = ev?.target?.matches("input") ? ev?.target : ev?.target?.querySelector?.("input");
        const target = ev?.target?.matches(wrapper) ? ev?.target : input?.closest?.(wrapper);
        const name   = input?.name || target?.dataset?.name;

        //
        if (state?.[name] != null) { // not exists not preferred...
            if (input?.matches?.("input:where([type=\"text\"], [type=\"number\"], [type=\"range\"])")) {
                const value = (input.valueAsNumber != null && !isNaN(input.valueAsNumber)) ? input.valueAsNumber : input.value;
                if (state[name] != value) { state[name] = value; };
            }

            // any radio-box
            if (input?.matches?.("input[type=\"radio\"]")) {
                if (input?.checked && state[name] != input.value) { state[name] = input.value; };
            }

            // any check-box
            if (input?.matches?.("input[type=\"checkbox\"]")) {
                if (state[name] != input.checked) { state[name] = input.checked; };
            }
        }
    };

    //
    fields.addEventListener("input", onChange);
    fields.addEventListener("change", onChange);
    fields.addEventListener("u2-appear", ()=>requestIdleCallback(()=> fields.querySelectorAll(wrapper).forEach((target)=>updateInput(state, target)), {timeout: 100}));

    // cross-window or frame syncretism
    subscribe?.(state, (value, property)=>{ fields.querySelectorAll(wrapper).forEach((target)=>updateInput(state, target)); });
    requestIdleCallback(()=>{ fields.querySelectorAll(wrapper).forEach((target)=>updateInput(state, target)); }, {timeout: 100});
    observeBySelector(fields, wrapper, (mutations)=>{
        mutations.addedNodes.forEach((target)=>{
            requestIdleCallback(()=>{
                updateInput(state, target);
            }, {timeout: 100});
        });
    });
}
*/
