import { Q } from "../node/Queried";

/**
 * DOM checkbox "controller" event handler for use with bindCtrl
 * @param {ReturnType<typeof booleanRef>} ref
 * @returns {(ev: Event) => void}
 */
export const checkboxCtrl = (ref) => { ref = ref instanceof WeakRef ? ref : new WeakRef(ref); return (ev) => { const $ref = (ref instanceof WeakRef || typeof ref?.deref == "function") ? ref?.deref?.() : ref; if ($ref) { $ref.value = Q("input:checked", ev?.target)?.checked ?? !$ref.value; } } }

/**
 * DOM number input "controller" event handler for use with bindCtrl
 * @param {ReturnType<typeof numberRef>} ref
 * @returns {(ev: Event) => void}
 */
export const numberCtrl = (ref) => { ref = ref instanceof WeakRef ? ref : new WeakRef(ref); return (ev) => { const $ref = (ref instanceof WeakRef || typeof ref?.deref == "function") ? ref?.deref?.() : ref; if ($ref && $ref.value !== ev?.target?.valueAsNumber) { $ref.value = Number(Q("input", ev?.target)?.valueAsNumber || 0) ?? 0; } } }

/**
 * DOM value input "controller" event handler for use with bindCtrl
 * @param {ReturnType<typeof stringRef>} ref
 * @returns {(ev: Event) => void}
 */
export const valueCtrl = (ref) => { ref = ref instanceof WeakRef ? ref : new WeakRef(ref); return (ev) => { const $ref = (ref instanceof WeakRef || typeof ref?.deref == "function") ? ref?.deref?.() : ref; if ($ref && ev?.target?.value != $ref?.value) { $ref.value = (Q("input", ev?.target)?.value ?? $ref?.value) || ""; } } }

/**
 * DOM radio group "controller" handler for use with bindCtrl
 * @param {ReturnType<typeof stringRef>} ref
 * @param {string} name
 * @returns {(ev: Event) => void}
 */
export const radioCtrl = (ref, name) => {
    ref = ref instanceof WeakRef ? ref : new WeakRef(ref);
    return (ev) => {
        let $ref = (ref instanceof WeakRef || typeof ref?.deref == "function") ? ref?.deref?.() : ref;
        const selector = `input[name="${name}"]:checked`;
        if ($ref) { $ref.value = (ev?.target?.matches?.(selector) ? ev?.target : ev?.target?.querySelector?.(selector))?.value ?? $ref.value; }
    }
}

/**
 * Out-of-bounds trigger (fires ref.value = false if clicked outside)
 * @param {Element} element
 * @param {ReturnType<typeof booleanRef>|{value: boolean}} ref
 * @param {string} [selector] optional CSS selector for target
 * @returns {()=>void} cancel function
 */
export const OOBTrigger = (element, ref, selector?) => {
    ref = ref instanceof WeakRef ? ref : new WeakRef(ref);
    const ROOT = document.documentElement;
    const checker = (ev) => {
        let $ref = (ref instanceof WeakRef || typeof ref?.deref == "function") ? ref?.deref?.() : ref;
        const target = selector ? (ev?.target?.matches?.(selector) ? ev?.target : (ev?.target ?? ROOT)?.querySelector?.(selector)) : ev?.target;
        if (!target || (element != target)) { $ref.value = false; }
    }
    const cancel = () => { ROOT.removeEventListener("click", checker); }
    ROOT.addEventListener("click", checker); return cancel;
}
