import { boundBehaviors, getCorrectOrientation, orientationNumberMap, whenAnyScreenChanges } from "fest/dom";
import { makeReactive, booleanRef, numberRef, subscribe, stringRef, computed, ref } from "fest/object";
import { checkboxCtrl, numberCtrl, valueCtrl } from "./Control";
import { handleHidden, handleAttribute } from "./Handler";
import { bindCtrl, bindWith } from "./Binding";




//
export const getPropertyValue = (src, name)=>{
    if ("computedStyleMap" in src) {
        return src?.computedStyleMap?.()?.get(name)?.value || 0;
    }
    return parseFloat(getComputedStyle(src)?.getPropertyValue?.(name) || "0") || 0;
}

//
export const getPadding = (src, axis)=>{
    if (axis == "inline") { return (getPropertyValue(src, "padding-inline-start") + getPropertyValue(src, "padding-inline-end")); };
    return (getPropertyValue(src, "padding-block-start") + getPropertyValue(src, "padding-block-end"));
}



/**
 * Make a two-way <-> ref to a localStorage string value, auto-update on change and storage events
 * @template T
 * @param {string} key storage key
 * @param {T|{value:T}} [initial] initial value (used/converted to string if not there)
 * @returns {ReturnType<typeof stringRef>}
 */
export const localStorageLink = (exists: any|null, key, initial) => {
    const def  = localStorage.getItem(key) ?? (initial?.value ?? initial);
    const ref  = exists ?? stringRef(def); ref.value ??= def;
    const unsb = subscribe([ref, "value"], (val) => localStorage.setItem(key, val));
    const list = (ev) => { if (ev.storageArea == localStorage && ev.key == key) {
        if (ref.value !== ev.newValue) { ref.value = ev.newValue; };
    } };
    addEventListener("storage", list);
    return () => { unsb?.(); removeEventListener("storage", list); };;
}

/**
 * Create a booleanRef that reflects matchMedia state. You cannot write to it.
 * @param {string} condition CSS media query string
 * @returns {ReturnType<typeof booleanRef>}
 */
export const matchMediaLink = (exists: any|null, condition: string) => {
    const med = matchMedia(condition), def = med?.matches || false;
    const ref = exists ?? booleanRef(def); ref.value ??= def;
    const evf = (ev) => (ref.value = ev.matches); med?.addEventListener?.("change", evf);
    return () => { med?.removeEventListener?.("change", evf); };
}

/**
 * Create a booleanRef for an element's "data-hidden" visible state, one-way
 * @param {Element} element
 * @param {*} [initial]
 * @returns {ReturnType<typeof booleanRef>}
 */
export const visibleLink = (exists: any|null, element, initial?) => {
    const def = (initial?.value ?? initial) ?? (element?.getAttribute?.("data-hidden") == null);
    const val = exists ?? booleanRef(def), inv = computed([val, "value"], (val)=>!val);
    const usb = bindWith(element, "data-hidden", inv, handleHidden);
    const evf = [(ev) => { val.value = ev?.name == "u2-hidden" ? false : true; }, { passive: true }], wel = new WeakRef(element);
    element?.addEventListener?.("u2-hidden" , ...evf); element?.addEventListener?.("u2-visible", ...evf);
    return () => {
        const element = wel?.deref?.(); usb?.();
        element?.removeEventListener?.("u2-hidden" , ...evf);
        element?.removeEventListener?.("u2-visible", ...evf);
    };
}

/**
 * Attribute two-way binding
 * @template T
 * @param {Element} element
 * @param {string} attribute
 * @param {T|{value:T}} [initial]
 * @returns {ReturnType<typeof stringRef>}
 */
export const attrLink = (exists: any|null, element, attribute: string, initial?) => { //http://192.168.0.200:5173/
    const def = element?.getAttribute?.(attribute) ?? ((initial?.value ?? initial) === true && typeof initial == "boolean" ? "" : (initial?.value ?? initial));
    if (!element) return; const val = exists ?? stringRef(def); val.value ||= def; return bindWith(element, attribute, val, handleAttribute, null, true);
}

/**
 * Numeric ref of the element size (inline/block, observed with ResizeObserver)
 * @param {Element} element
 * @param {"inline"|"block"} axis
 * @param {ResizeObserverBoxOptions} [box='border-box']
 * @returns {ReturnType<typeof numberRef>}
 */
export const sizeLink = (exists: any|null, element, axis: "inline" | "block", box: ResizeObserverBoxOptions = "border-box") => {
    const def = box == "border-box" ? element?.[axis == "inline" ? "offsetWidth" : "offsetHeight"] : (element?.[axis == "inline" ? "clientWidth" : "clientHeight"] - getPadding(element, axis));
    const val = exists ?? numberRef(def); val.value ||= (def ?? val.value) || 1;
    const obs = new ResizeObserver((entries) => {
        if (box == "border-box")  { val.value = axis == "inline" ? entries[0].borderBoxSize[0].inlineSize  : entries[0].borderBoxSize[0].blockSize };
        if (box == "content-box") { val.value = axis == "inline" ? entries[0].contentBoxSize[0].inlineSize : entries[0].contentBoxSize[0].blockSize };
        if (box == "device-pixel-content-box") { val.value = axis == "inline" ? entries[0].devicePixelContentBoxSize[0].inlineSize : entries[0].devicePixelContentBoxSize[0].blockSize };
    });
    if ((element?.self ?? element) instanceof HTMLElement) { obs.observe(element?.element ?? element?.self ?? element, { box }); };
    return ()=>obs?.disconnect?.();
}

/**
 * Numeric ref for scroll offset of an element (auto two-way)
 * @param {Element} element
 * @param {"inline"|"block"} axis
 * @param {*} [initial]
 * @returns {ReturnType<typeof numberRef>}
 */
export const scrollLink = (exists: any|null, element, axis: "inline" | "block" = "inline", initial?) => {
    if (initial != null && typeof (initial?.value ?? initial) == "number") { element?.scrollTo?.({ [axis == "block" ? "top" : "left"]: (initial?.value ?? initial) }); };
    const def = element?.[axis == "block" ? "scrollTop" : "scrollLeft"];
    const val = exists ?? numberRef(def || 0); val.value ||= (def ?? val.value) || 1; val.value ||= (def ?? val.value) || 0;
    const usb = subscribe([val, "value"], (v) => { if (Math.abs((axis == "block" ? element?.scrollTop : element?.scrollLeft) - (val?.value ?? val)) > 0.001) element?.scrollTo?.({ [axis == "block" ? "top" : "left"]: (val?.value ?? val) })});
    const scb = [(ev) => { val.value = (axis == "block" ? ev?.target?.scrollTop : ev?.target?.scrollLeft) || 0; }, { passive: true }], wel = new WeakRef(element);
    element?.addEventListener?.("scroll", ...scb); return ()=>{ wel?.deref?.()?.removeEventListener?.("scroll", ...scb); usb?.(); };
}

/**
 * Boolean ref for checkbox element (auto two-way)
 * @param {HTMLInputElement} element
 * @returns {ReturnType<typeof booleanRef>}
 */
export const checkedLink = (exists: any|null, element) => {
    const def = (!!element?.checked) || false;
    const val = exists ?? booleanRef(def); val.value ??= def;
    const dbf = bindCtrl(element?.self ?? element, checkboxCtrl(val));
    const usb = subscribe([val, "value"], (v) => {
        if (element && element?.checked != v) {
            element.checked = !!v;
            element?.dispatchEvent?.(new Event("change", { bubbles: true }));
        }
    });
    return ()=>{ usb?.(); dbf?.(); };
}

/**
 * String ref for text input elements (auto two-way)
 * @param {HTMLInputElement|HTMLTextAreaElement} element
 * @returns {ReturnType<typeof stringRef>}
 */
export const valueLink = (exists: any|null, element) => {
    const def = element?.value || "";
    const val = exists ?? stringRef(def); val.value ??= def;
    const dbf = bindCtrl(element?.self ?? element, valueCtrl(val));
    const usb = subscribe([val, "value"], (v) => {
        if (element && element?.value != v) {
            element.value = v;
            element?.dispatchEvent?.(new Event("change", { bubbles: true }));
        }
    });
    return ()=>{ usb?.(); dbf?.(); };
}

/**
 * Number ref for number inputs (auto two-way)
 * @param {HTMLInputElement} element
 * @returns {ReturnType<typeof numberRef>}
 */
export const valueAsNumberLink = (exists: any|null, element) => {
    const def = Number(element?.valueAsNumber) || 0;
    const val = exists ?? numberRef(def); val.value ??= def;
    const dbf = bindCtrl(element?.self ?? element, numberCtrl(val));
    const usb = subscribe([val, "value"], (v) => {
        if (element && element?.valueAsNumber != v && typeof element?.valueAsNumber == "number") {
            element.valueAsNumber = Number(v);
            element?.dispatchEvent?.(new Event("change", { bubbles: true }));
        }
    });
    return ()=>{ usb?.(); dbf?.(); };
}

/**
 * Observe and reactively assign size styles to a reactive object
 * @param {Element} element
 * @param {ResizeObserverBoxOptions} box
 * @param {object} [styles] reactive object (will be created if omitted)
 * @returns {object} styles
 */
export const observeSizeLink = (exists: any|null, element, box, styles?) => {
    if (!styles) styles = exists ?? makeReactive({}); let obs: any = null;
    (obs = new ResizeObserver((mut) => {
        if (box == "border-box") {
            styles.inlineSize = `${mut[0].borderBoxSize[0].inlineSize}px`;
            styles.blockSize  = `${mut[0].borderBoxSize[0].blockSize}px`;
        }
        if (box == "content-box") {
            styles.inlineSize = `${mut[0].contentBoxSize[0].inlineSize}px`;
            styles.blockSize  = `${mut[0].contentBoxSize[0].blockSize}px`;
        }
        if (box == "device-pixel-content-box") {
            styles.inlineSize = `${mut[0].devicePixelContentBoxSize[0].inlineSize}px`;
            styles.blockSize  = `${mut[0].devicePixelContentBoxSize[0].blockSize}px`;
        }
    })).observe(element?.element ?? element?.self ?? element, { box });
    return () => { obs?.disconnect?.(); };
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
export const orientLink = (exists)=>{
    const orient = orientationNumberMap?.[getCorrectOrientation()] || 0;
    const def = Number(orient) || 0;
    const val = exists ?? numberRef(def); val.value ??= def;

    // !Change orientation? You are seious?!
    //subscribe([exists, "value"], (orient)=>{ // pickup name...
        //screen?.orientation?.lock?.($NAME$?.(orient));
    //});

    return whenAnyScreenChanges(()=>{
        val.value = orientationNumberMap?.[getCorrectOrientation()] || 0;
    });
}
