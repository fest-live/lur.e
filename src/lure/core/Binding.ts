import { addToCallChain, makeReactive, subscribe } from "fest/object";
import { handleAttribute, handleProperty, namedStoreMaps, observeAttribute, observeBySelector, includeSelf, setChecked } from "fest/dom";
import { $getValue, camelToKebab, $set, toRef, deref, isNotEqual, handleListeners, $avoidTrigger } from "fest/core";

//
export const elMap  = new WeakMap<any, WeakMap<any, any>>();
export const alives = new FinalizationRegistry((unsub: any) => unsub?.());

//
export const $mapped = Symbol.for("@mapped");
export const $virtual = Symbol.for("@virtual");
export const $behavior = Symbol.for("@behavior");

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
export const $observeInput = (element, ref?: any|null, prop = "value") => {
    const wel = toRef(element);
    const rf = toRef(ref);
    const ctrlCb = (ev)=>{
        $set(rf, "value", deref(wel)?.[prop ?? "value"] ?? $getValue(deref(rf)));
    }

    //
    const hdl = { "click": ctrlCb, "input": ctrlCb, "change": ctrlCb };
    ctrlCb?.({ target: element }); handleListeners?.(element, "addEventListener", hdl);

    //
    $set(rf, "value", element?.[prop ?? "value"] ?? $getValue(deref(ref)));
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
            const valRef = deref(wv), reVal = $getValue(valRef);

            //
            if (isNotEqual(mutation.oldValue, value) && (valRef != null && (typeof valRef == "object" || typeof valRef == "function")))
            { if (isNotEqual(reVal, value) || reVal == null) { $set(valRef, "value", value); } }
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
export const bindHandler = (element: any, value: any, prop: any, handler: any, set?: any, withObserver?: boolean | Function) => {
    const wel = toRef(element); element = deref(wel);
    if (!element || !(element instanceof Node || element?.element instanceof Node)) return;

    //
    let controller: AbortController | null = null; // @ts-ignore
    controller?.abort?.(); controller = new AbortController();

    //
    const wv = toRef(value);
    const un = subscribe?.([value, "value"], (curr, _, old) => {
        const valueRef = deref(wv);
        const setRef = deref(set);
        const elementRef = deref(wel);
        const value = $getValue(valueRef) ?? $getValue(curr);
        if (!setRef || setRef?.[prop] == valueRef) {
            if (typeof valueRef?.[$behavior] == "function") {
                valueRef?.[$behavior]?.((val = curr) => handler(elementRef, prop, value), [curr, prop, old], [controller?.signal, prop, wel]);
            } else {
                handler(elementRef, prop, value);
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

    //
    const unsub = () => { obs?.disconnect?.(); (obs != null && typeof obs == "function") ? obs?.() : null; un?.(); controller?.abort?.(); removeFromBank?.(element, handler, prop); }; // @ts-ignore
    addToCallChain(value, Symbol.dispose, unsub); alives.register(element, unsub);
    if (!addToBank(element, handler, prop, [value, unsub])) { return unsub; } // prevent data disruption
}

//
export const updateInput = (target, state)=>{
    const selector = "input:where([type=\"text\"], [type=\"number\"], [type=\"range\"])";
    const input    = includeSelf(target, "input");
    const name     = (input as HTMLInputElement)?.name || (target as HTMLElement)?.dataset?.name || "";

    //
    if (state?.[name] != null || name in state) { // not exists not preferred...
        if (state && input?.matches?.(selector)) {
            if ((input as HTMLInputElement).value != state[name]) {
                $avoidTrigger(state, ()=>{
                    (input as HTMLInputElement).value = state[name];
                    input.dispatchEvent(new Event("change", { bubbles: true, cancelable: true, }));
                }, name);
            }
        }

        // setup radio boxes (requires wrapper)
        if (state) {
            const radio = includeSelf(target, `input:where([type=\"radio\"][name=\"${name}\"][value=\"${state?.[name]}\"])`);
            if (state && radio && state[name] == (radio as HTMLInputElement).value && !(radio as HTMLInputElement).checked) {
                $avoidTrigger(state, ()=>{ setChecked((radio as HTMLInputElement), state[name]); }, name);
            };
        }

        // setup check boxes
        const checkbox = includeSelf(target, "input:where([type=\"checkbox\"])");
        if (state && checkbox) {
            if (state[name] != (checkbox as HTMLInputElement).checked) {
                $avoidTrigger(state, ()=>{
                    setChecked((checkbox as HTMLInputElement), state[name]);
                }, name);
            }
        }
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
