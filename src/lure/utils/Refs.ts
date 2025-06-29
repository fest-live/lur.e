import { subscribe, numberRef, stringRef, booleanRef, computed, makeReactive, ref } from "u2re/object";
import { boundBehaviors, observeAttributeBySelector } from "u2re/dom";

//
import { checkboxCtrl, numberCtrl, valueCtrl } from "../core/Control";
import { handleHidden, triggerWithDelay } from "../core/Handler";
import { bindCtrl } from "../core/Binding";

/**
 * Make a two-way <-> ref to a localStorage string value, auto-update on change and storage events
 * @template T
 * @param {string} key storage key
 * @param {T|{value:T}} [initial] initial value (used/converted to string if not there)
 * @returns {ReturnType<typeof stringRef>}
 */
export const localStorageRef = (key, initial) => {
    const ref = stringRef(localStorage.getItem(key) ?? (initial?.value ?? initial));
    subscribe([ref, "value"], (val) => localStorage.setItem(key, val));
    addEventListener("storage", (ev) => {
        if (ev.storageArea == localStorage && ev.key == key) {
            if (ref.value !== ev.newValue) { ref.value = ev.newValue; };
        }
    });
    return ref;
}

/**
 * Create a booleanRef that reflects matchMedia state. You cannot write to it.
 * @param {string} condition CSS media query string
 * @returns {ReturnType<typeof booleanRef>}
 */
export const matchMediaRef = (condition: string) => {
    const med = matchMedia(condition), ref = booleanRef(med.matches);
    med?.addEventListener?.("change", (ev) => ref.value = ev.matches); return ref;
}

/**
 * Create a booleanRef for an element's "data-hidden" visible state, one-way
 * @param {Element} element
 * @param {*} [initial]
 * @returns {ReturnType<typeof booleanRef>}
 */
export const visibleRef = (element, initial?) => {
    const val = booleanRef((initial?.value ?? initial) ?? (element?.getAttribute?.("data-hidden") == null));
    handleHidden(element, computed([val, "value"], (val)=>!val));
    element?.addEventListener?.("u2-hidden", () => { val.value = false; }, { passive: true });
    element?.addEventListener?.("u2-visible", () => { val.value = true; }, { passive: true });
    subscribe([val, "value"], (v, p) => { if (v) { element?.removeAttribute?.("data-hidden"); } else { element?.setAttribute?.("data-hidden", val.value); } })
    return val;
}

/**
 * Attribute two-way binding
 * @template T
 * @param {Element} element
 * @param {string} attribute
 * @param {T|{value:T}} [initial]
 * @returns {ReturnType<typeof stringRef>}
 */
export const attrRef = (element, attribute: string, initial?) => {
    if (!element) return;
    const val = stringRef(element?.getAttribute?.(attribute) ?? ((initial?.value ?? initial) === true && typeof initial == "boolean" ? "" : (initial?.value ?? initial)));
    if (initial != null && element?.getAttribute?.(attribute) == null && (typeof val.value != "object" && typeof val.value != "function") && (val.value != null && val.value !== false)) { element?.setAttribute?.(attribute, val.value); };
    const config = {
        attributeFilter: [attribute],
        attributeOldValue: true,
        attributes: true,
        childList: false,
        subtree: false,
    };

    const onMutation = (mutation: any) => {
        if (mutation.type == "attributes") {
            const value = mutation?.target?.getAttribute?.(mutation.attributeName);
            if (mutation.oldValue != value && (val != null && (val?.value != null || (typeof val == "object" || typeof val == "function")))) {
                if (val?.value !== value) { val.value = value; }
            }
        }
    }

    if (element?.self) { observeAttributeBySelector(element.self, element.selector, attribute, onMutation); } else {
        const callback = (mutationList, _) => { for (const mutation of mutationList) { onMutation(mutation); } };
        const observer = new MutationObserver(callback); observer.observe(element?.element ?? element?.self ?? element, config);
    }

    subscribe([val, "value"], (v) => {
        if (v !== element?.getAttribute?.(attribute)) {
            if (v == null || v === false || typeof v == "object" || typeof v == "function") { element?.removeAttribute?.(attribute); } else { element?.setAttribute?.(attribute, v); }
        }
    });

    return val;
}

/**
 * Numeric ref of the element size (inline/block, observed with ResizeObserver)
 * @param {Element} element
 * @param {"inline"|"block"} axis
 * @param {ResizeObserverBoxOptions} [box='border-box']
 * @returns {ReturnType<typeof numberRef>}
 */
export const sizeRef = (element, axis: "inline" | "block", box: ResizeObserverBoxOptions = "border-box") => {
    const val = numberRef(element?.[axis == "inline" ? "offsetWidth" : "offsetHeight"]), obs = new ResizeObserver((entries) => {
        if (box == "border-box")  { val.value = axis == "inline" ? entries[0].borderBoxSize[0].inlineSize  : entries[0].borderBoxSize[0].blockSize };
        if (box == "content-box") { val.value = axis == "inline" ? entries[0].contentBoxSize[0].inlineSize : entries[0].contentBoxSize[0].blockSize };
        if (box == "device-pixel-content-box") { val.value = axis == "inline" ? entries[0].devicePixelContentBoxSize[0].inlineSize : entries[0].devicePixelContentBoxSize[0].blockSize };
    });
    if ((element?.self ?? element) instanceof HTMLElement) { obs.observe(element?.element ?? element?.self ?? element, { box }); }; return val;
}

/**
 * Numeric ref for scroll offset of an element (auto two-way)
 * @param {Element} element
 * @param {"inline"|"block"} axis
 * @param {*} [initial]
 * @returns {ReturnType<typeof numberRef>}
 */
export const scrollRef = (element, axis: "inline" | "block", initial?) => {
    if (initial != null && typeof (initial?.value ?? initial) == "number") { element?.scrollTo?.({ [axis == "inline" ? "left" : "top"]: (initial?.value ?? initial) }); };
    const val = numberRef((axis == "inline" ? element?.scrollLeft : element?.scrollTop) || 0);
    subscribe([val, "value"], (v) => { if (Math.abs((axis == "inline" ? element?.scrollLeft : element?.scrollTop) - (val?.value ?? val)) > 0.001) element?.scrollTo?.({ [axis == "inline" ? "left" : "top"]: (val?.value ?? val) })});
    element?.addEventListener?.("scroll", (ev) => { val.value = (axis == "inline" ? ev?.target?.scrollLeft : ev?.target?.scrollTop) || 0; }, { passive: true });
    return val;
}

/**
 * Boolean ref for checkbox element (auto two-way)
 * @param {HTMLInputElement} element
 * @returns {ReturnType<typeof booleanRef>}
 */
export const checkedRef = (element) => {
    const val = booleanRef((!!element?.checked) || false);
    bindCtrl(element?.self ?? element, checkboxCtrl(val));
    subscribe([val, "value"], (v) => {
        if (element && element?.checked != v) {
            element.checked = !!v;
            element?.dispatchEvent?.(new Event("change", { bubbles: true }));
        }
    }); return val;
}

/**
 * String ref for text input elements (auto two-way)
 * @param {HTMLInputElement|HTMLTextAreaElement} element
 * @returns {ReturnType<typeof stringRef>}
 */
export const valueRef = (element) => {
    const val = stringRef(element?.value || "");
    bindCtrl(element?.self ?? element, valueCtrl(val));
    subscribe([val, "value"], (v) => {
        if (element && element?.value != v) {
            element.value = v;
            element?.dispatchEvent?.(new Event("change", { bubbles: true }));
        }
    }); return val;
}

/**
 * Number ref for number inputs (auto two-way)
 * @param {HTMLInputElement} element
 * @returns {ReturnType<typeof numberRef>}
 */
export const valueAsNumberRef = (element) => {
    const val = numberRef(Number(element?.valueAsNumber) || 0);
    bindCtrl(element?.self ?? element, numberCtrl(val));
    subscribe([val, "value"], (v) => {
        if (element && element?.valueAsNumber != v && typeof element?.valueAsNumber == "number") {
            element.valueAsNumber = Number(v);
            element?.dispatchEvent?.(new Event("change", { bubbles: true }));
        }
    }); return val;
}

/**
 * Observe and reactively assign size styles to a reactive object
 * @param {Element} element
 * @param {ResizeObserverBoxOptions} box
 * @param {object} [styles] reactive object (will be created if omitted)
 * @returns {object} styles
 */
export const observeSize = (element, box, styles?) => {
    if (!styles) styles = makeReactive({});
    new ResizeObserver((mut) => {
        if (box == "border-box") {
            styles.inlineSize = `${mut[0].borderBoxSize[0].inlineSize}px`;
            styles.blockSize = `${mut[0].borderBoxSize[0].blockSize}px`;
        }
        if (box == "content-box") {
            styles.inlineSize = `${mut[0].contentBoxSize[0].inlineSize}px`;
            styles.blockSize = `${mut[0].contentBoxSize[0].blockSize}px`;
        }
        if (box == "device-pixel-content-box") {
            styles.inlineSize = `${mut[0].devicePixelContentBoxSize[0].inlineSize}px`;
            styles.blockSize = `${mut[0].devicePixelContentBoxSize[0].blockSize}px`;
        }
    }).observe(element?.element ?? element?.self ?? element, { box });
    return styles;
}

/**
 * Create a controller ref which fires all boundBehaviors except self on change
 * @param {*} value
 * @returns {any}
 */
export const refCtl = (value) => {
    let self: any = null, ctl = ref(value, self = ([val, prop, old], [weak, ctl, valMap]) => boundBehaviors?.get?.(weak?.deref?.())?.values?.()?.forEach?.((beh) => {
        (beh != self ? beh : null)?.([val, prop, old], [weak, ctl, valMap]);
    })); return ctl;
}

//
export const conditionalIndex = (condList: any[]) => {
    return computed(condList, () => condList.findIndex(cb => cb?.()));
}

//
export const delayedSubscribe = (ref, cb, delay = 100)=>{
    let tm: any; //= triggerWithDelay(ref, cb, delay);
    return subscribe([ref, "value"], (v)=>{
        if (!v && tm) { clearTimeout(tm); tm = null; } else
        if (v && !tm) { tm = triggerWithDelay(ref, cb, delay) ?? tm; };
    });
}
