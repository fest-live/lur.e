// @ts-ignore /* @vite-ignore */
import { subscribe, ref } from "/externals/modules/object.js";

// @ts-ignore /* @vite-ignore */
import { namedStoreMaps, boundBehaviors } from "/externals/modules/dom.js";

//
export const bindBeh = (element, store, behavior) => {
    const weak = element instanceof WeakRef ? element : new WeakRef(element);
    const [name, obj] = store;
    if (behavior) {
        subscribe?.(store, (value, prop, old) => {
            const valMap = namedStoreMaps.get(name);
            behavior?.([value, prop, old], [weak, store, valMap?.get(weak.deref?.())]);
        });
    }
    return element;
};

//
export const refCtl = (value) => {
    let self: any = null;
    let ctl = ref(value, self = ([val, prop, old], [weak, ctl, valMap]) => {
        boundBehaviors?.get?.(weak?.deref?.())?.values?.()?.forEach?.((beh) => {
            (beh != self ? beh : null)?.([val, prop, old], [weak, ctl, valMap]);
        });
    });
    return ctl;
};

// for checkbox
export const checkboxCtrl = (ref)=>{
    return (ev)=>{ if (ref) { ref.value = ev?.target?.checked ?? !ref.value; } }
}

// form.addEventListener("change")
export const radioCtrl = (ref, name)=>{
    return (ev)=>{
        const selector = `input[name="${name}"]:checked`;
        ref.value = (ev?.target?.matches?.(selector) ? ev?.target : ev?.target?.querySelector?.(selector))?.value ?? ref.value;
    }
}

// "change" | "input" | "click"
export const numberCtrl = (ref)=>{
    return (ev)=>{
        if (ref) { ref.value = ev?.target?.valueAsNumber ?? !ref.value; }
    }
}

// "change" | "input" | "click"
export const valueCtrl = (ref)=>{
    return (ev)=>{
        if (ref) { ref.value = ev?.target?.value ?? !ref.value; }
    }
}

//
export const bindCtrl = (element, ctrl)=>{
    ctrl?.({target: element});
    element?.addEventListener?.("click", ctrl);
    element?.addEventListener?.("input", ctrl);
    element?.addEventListener?.("change", ctrl);
    const cancel = ()=>{
        element?.removeEventListener?.("click", ctrl);
        element?.removeEventListener?.("input", ctrl);
        element?.removeEventListener?.("change", ctrl);
    }
    return cancel;
}

// TODO: make able to cancel controlling
export const reflectControllers = (element, ctrls)=>{
    for (let ctrl of ctrls) { bindCtrl(element, ctrl); }
    return element;
}

// TODO: currently, there is no visable usage
export const OOBTrigger = (element, ref, selector?)=>{
    const ROOT = document.documentElement;
    const checker = (ev)=>{
        const target = selector ? (ev?.target?.matches?.(selector) ? ev?.target : (ev?.target ?? ROOT)?.querySelector?.(selector)) : ev?.target;
        if (!target || (element != target)) { ref.value = false; }
    }
    const cancel = ()=>{ ROOT.removeEventListener("click", checker); }
    ROOT.addEventListener("click", checker); return cancel;
}
