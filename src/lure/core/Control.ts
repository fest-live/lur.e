import { deref, isNotEqual, toRef, unref } from "fest/core";
import { Q } from "../node/Queried";
import { makeRAFCycle, setProperty } from "fest/dom";
import { subscribe } from "fest/object";

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
export const controlVisible = (source: HTMLElement, coef: any = null)=>{
    if (!source) return; const target = toRef(source), wk = toRef(coef);
    const renderCb = ()=>{
        const tg = deref(target); if (tg) {
            const val = deref(wk)?.value || 0, hidden = val < 0.001 || val > 0.999;
            setProperty(tg, "visibility", hidden ? "collapse" : "visible");
            setProperty(tg?.querySelector?.("*"), "pointer-events", hidden ? "none" : "auto");
        }
    };
    return subscribe(coef, (val: any)=>makeRAFCycle()?.schedule(renderCb))
}
