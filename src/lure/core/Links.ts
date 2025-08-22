import { boundBehaviors, getCorrectOrientation, orientationNumberMap, whenAnyScreenChanges, handleHidden, handleAttribute, getPadding } from "fest/dom";
import { makeReactive, booleanRef, numberRef, subscribe, stringRef, ref, isNotEqual } from "fest/object";
import { checkboxCtrl, numberCtrl, valueCtrl } from "./Control";
import { bindCtrl, bindWith } from "./Binding";

//
export const localStorageLinkMap = new Map<string, any>();
export const localStorageLink = (existsStorage?: any|null, exists?: any|null, key?: string, initial?: any|null) => {
    if (key == null) return;
    // de-assign local storage link for key
    if (localStorageLinkMap.has(key)) {
        localStorageLinkMap.get(key)?.[0]?.();
        localStorageLinkMap.delete(key);
    }

    // @ts-ignore // assign new local storage link for key
    return localStorageLinkMap.getOrInsertComputed?.(key, ()=>{
        const def  = (existsStorage ?? localStorage).getItem(key) ?? (initial?.value ?? initial);
        const ref  = exists ?? stringRef(def); ref.value ??= def;
        const unsb = subscribe([ref, "value"], (val) => (existsStorage ?? localStorage).setItem(key, val));
        const list = (ev) => { if (ev.storageArea == (existsStorage ?? localStorage) && ev.key == key) {
            if (isNotEqual(ref.value, ev.newValue)) { ref.value = ev.newValue; };
        } };
        addEventListener("storage", list);
        return [() => { unsb?.(); removeEventListener("storage", list); }, ref];
    });
}

//
export const matchMediaLink = (existsMedia?: any|null, exists?: any|null, condition?: string) => {
    if (condition == null) return;
    const med = existsMedia ?? matchMedia(condition), def = med?.matches || false;
    const ref = exists ?? booleanRef(def); ref.value ??= def;
    const evf = (ev) => (ref.value = ev.matches); med?.addEventListener?.("change", evf);
    return () => { med?.removeEventListener?.("change", evf); };
}

//
export const visibleLink = (element?: any|null, exists?: any|null, initial?: any|null) => {
    if (element == null) return;
    const def = (initial?.value ?? (typeof initial != "object" ? initial : null)) ?? (element?.getAttribute?.("data-hidden") == null);
    const val = exists ?? booleanRef(!!def);
    const usb = bindWith(element, "data-hidden", val, handleHidden);
    const evf = [(ev) => { val.value = ev?.type == "u2-hidden" ? false : true; }, { passive: true }], wel = new WeakRef(element);
    element?.addEventListener?.("u2-hidden" , ...evf);
    element?.addEventListener?.("u2-appear", ...evf);
    return () => {
        const element = wel?.deref?.(); usb?.();
        element?.removeEventListener?.("u2-hidden" , ...evf);
        element?.removeEventListener?.("u2-appear", ...evf);
    };
}

//
export const attrLink = (element?: any|null, exists?: any|null, attribute?: string, initial?: any|null) => {
    const def = element?.getAttribute?.(attribute) ?? ((initial?.value ?? initial) == true && typeof initial == "boolean" ? "" : (initial?.value ?? initial));
    if (!element) return; const val = exists ?? stringRef(def); val.value ||= def; return bindWith(element, attribute, val, handleAttribute, null, true);
}

//
export const sizeLink = (element?: any|null, exists?: any|null, axis?: "inline" | "block", box?: ResizeObserverBoxOptions) => {
    const def = box == "border-box" ? element?.[axis == "inline" ? "offsetWidth" : "offsetHeight"] : (element?.[axis == "inline" ? "clientWidth" : "clientHeight"] - getPadding(element, axis));
    const val = exists ?? numberRef(def); val.value ||= (def ?? val.value) || 1;
    const obs = new ResizeObserver((entries) => {
        if (box == "border-box")  { val.value = axis == "inline" ? entries[0].borderBoxSize[0].inlineSize  : entries[0].borderBoxSize[0].blockSize };
        if (box == "content-box") { val.value = axis == "inline" ? entries[0].contentBoxSize[0].inlineSize : entries[0].contentBoxSize[0].blockSize };
        if (box == "device-pixel-content-box") { val.value = axis == "inline" ? entries[0].devicePixelContentBoxSize[0].inlineSize : entries[0].devicePixelContentBoxSize[0].blockSize };
    });
    if ((element?.element ?? element?.self ?? element) instanceof HTMLElement) { obs?.observe?.(element?.element ?? element?.self ?? element, { box }); };
    return ()=>obs?.disconnect?.();
}

//
export const scrollLink = (element?: any|null, exists?: any|null, axis?: "inline" | "block", initial?: any|null) => {
    const wel = element instanceof WeakRef ? element : new WeakRef(element);
    if (initial != null && typeof (initial?.value ?? initial) == "number") { element?.scrollTo?.({ [axis == "block" ? "top" : "left"]: (initial?.value ?? initial) }); };
    const def = element?.[axis == "block" ? "scrollTop" : "scrollLeft"];
    const val = exists ?? numberRef(def || 0); val.value ||= (def ?? val.value) || 1; val.value ||= (def ?? val.value) || 0;
    const usb = subscribe([val, "value"], (v) => { if (Math.abs((axis == "block" ? element?.scrollTop : element?.scrollLeft) - (val?.value ?? val)) > 0.001) element?.scrollTo?.({ [axis == "block" ? "top" : "left"]: (val?.value ?? val) })});
    const scb = [(ev) => { val.value = (axis == "block" ? wel?.deref?.()?.scrollTop : wel?.deref?.()?.scrollLeft) || 0; }, { passive: true }];
    element?.addEventListener?.("scroll", ...scb); return ()=>{ wel?.deref?.()?.removeEventListener?.("scroll", ...scb); usb?.(); };
}

//
export const checkedLink = (element?: any|null, exists?: any|null) => {
    const def = (!!element?.checked) || false;
    const val = exists ?? booleanRef(def); val.value ??= def;
    const dbf = bindCtrl(element, checkboxCtrl(val));
    const usb = subscribe([val, "value"], (v) => {
        if (element && element?.checked != v) {
            element.checked = !!v;
            element?.dispatchEvent?.(new Event("change", { bubbles: true }));
        }
    });
    return ()=>{ usb?.(); dbf?.(); };
}

//
export const valueLink = (element?: any|null, exists?: any|null) => {
    const def = element?.value ?? "";
    const val = exists ?? stringRef(def); val.value ??= def;
    const dbf = bindCtrl(element, valueCtrl(val));
    const usb = subscribe([val, "value"], (v) => {
        if (element && isNotEqual(element?.value, (v?.value ?? v))) {
            element.value = v?.value ?? v;
            element?.dispatchEvent?.(new Event("change", { bubbles: true }));
        }
    });
    return ()=>{ usb?.(); dbf?.(); };
}

//
export const valueAsNumberLink = (element?: any|null, exists?: any|null) => {
    const def = Number(element?.valueAsNumber) || 0;
    const val = exists ?? numberRef(def); val.value ??= def;
    const dbf = bindCtrl(element, numberCtrl(val));
    const usb = subscribe([val, "value"], (v) => {
        if (element && (element.type == "range" || element.type == "number") && typeof element?.valueAsNumber == "number" && isNotEqual(element?.valueAsNumber, v)) {
            element.valueAsNumber = Number(v);
            element?.dispatchEvent?.(new Event("change", { bubbles: true }));
        }
    });
    return ()=>{ usb?.(); dbf?.(); };
}

//
export const observeSizeLink = (element?: any|null, exists?: any|null, box?: any|null, styles?: any|null) => {
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

//
export const refCtl = (value?: any|null) => {
    let self: any = null, ctl = ref(value, self = ([val, prop, old], [weak, ctl, valMap]) => boundBehaviors?.get?.(weak?.deref?.())?.values?.()?.forEach?.((beh) => {
        (beh != self ? beh : null)?.([val, prop, old], [weak, ctl, valMap]);
    })); return ctl;
}

//
export const orientLink = (host?: any|null, exists?: any|null)=>{
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
