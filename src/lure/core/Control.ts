import { isNotEqual, toRef, unref } from "fest/core";
import { Q } from "../node/Queried";

//
export const checkboxCtrl = (ref) => { ref = toRef(ref); return (ev) => { const $ref = unref(ref); if ($ref != null) { $ref.value = Q(`input[type="radio"], input[type="checkbox"], input:checked`, ev?.target)?.checked ?? $ref?.value; } } }
export const numberCtrl = (ref) => { ref = toRef(ref); return (ev) => { const $ref = unref(ref); if ($ref != null && isNotEqual($ref?.value, ev?.target?.valueAsNumber)) { $ref.value = Number(Q("input", ev?.target)?.valueAsNumber || 0) ?? 0; } } }
export const valueCtrl = (ref) => { ref = toRef(ref); return (ev) => { const $ref = unref(ref); if ($ref != null && isNotEqual(ev?.target?.value, $ref?.value)) { $ref.value = (Q("input", ev?.target)?.value ?? $ref?.value) || ""; } } }

//
export const radioCtrl = (ref, name) => {
    ref = toRef(ref);
    return (ev) => {
        let $ref = unref(ref);
        const selector = `input[name="${name}"]:checked`;
        if ($ref) { $ref.value = (ev?.target?.matches?.(selector) ? ev?.target : ev?.target?.querySelector?.(selector))?.value ?? $ref.value; }
    }
}

//
export const OOBTrigger = (element, ref, selector?) => {
    ref = toRef(ref);
    const ROOT = document.documentElement;
    const checker = (ev) => {
        let $ref = unref(ref);
        const target = selector ? (ev?.target?.matches?.(selector) ? ev?.target : (ev?.target ?? ROOT)?.querySelector?.(selector)) : ev?.target;
        if (!target || (element != target)) { $ref.value = false; }
    }
    const cancel = () => { ROOT.removeEventListener("click", checker); }
    ROOT.addEventListener("click", checker); return cancel;
}
