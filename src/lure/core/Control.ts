import { Q } from "../node/Queried";

//
const isRef = (ref)=>{ return ref instanceof WeakRef || typeof ref?.deref == "function"; }
const unref = (ref)=>{ return isRef(ref) ? ref?.deref?.() : ref; }

//
const wref = (ref)=>{ return ref != null ? (isRef(ref) ? ref : ((typeof ref == "function" || typeof ref == "object") ? new WeakRef(ref) : ref)) : ref; }

//
export const checkboxCtrl = (ref) => { ref = wref(ref); return (ev) => { const $ref = unref(ref); if ($ref) { $ref.value = Q("input:checked", ev?.target)?.checked ?? !$ref?.value; } } }

//
export const numberCtrl = (ref) => { ref = wref(ref); return (ev) => { const $ref = unref(ref); if ($ref && $ref?.value !== ev?.target?.valueAsNumber) { $ref.value = Number(Q("input", ev?.target)?.valueAsNumber || 0) ?? 0; } } }

//
export const valueCtrl = (ref) => { ref = wref(ref); return (ev) => { const $ref = unref(ref); if ($ref && ev?.target?.value !== $ref?.value) { $ref.value = (Q("input", ev?.target)?.value ?? $ref?.value) || ""; } } }

//
export const radioCtrl = (ref, name) => {
    ref = wref(ref);
    return (ev) => {
        let $ref = unref(ref);
        const selector = `input[name="${name}"]:checked`;
        if ($ref) { $ref.value = (ev?.target?.matches?.(selector) ? ev?.target : ev?.target?.querySelector?.(selector))?.value ?? $ref.value; }
    }
}

//
export const OOBTrigger = (element, ref, selector?) => {
    ref = wref(ref);
    const ROOT = document.documentElement;
    const checker = (ev) => {
        let $ref = unref(ref);
        const target = selector ? (ev?.target?.matches?.(selector) ? ev?.target : (ev?.target ?? ROOT)?.querySelector?.(selector)) : ev?.target;
        if (!target || (element != target)) { $ref.value = false; }
    }
    const cancel = () => { ROOT.removeEventListener("click", checker); }
    ROOT.addEventListener("click", checker); return cancel;
}
