/*
 * Filename: Reflect.ts
 * FullPath: modules/projects/lur.e/src/lure/context/Reflect.ts
 * Change date and time: 21.55.00_15.08.2026
 * Reason for changes: Route style=${S`...`} / attr style StyleBinding through
 * reflectStyles/bindStyle (same as E({ style: S`...` })).
 */
import { addToCallChain, affected, iterated } from "@fest-lib/object";
import { isNotEqual, isPrimitive } from "@fest-lib/core";

//
import { bindHandler, bindWith } from "../core/Binding";
import { handleDataset, handleProperty, handleAttribute, handleStyleChange } from "@fest-lib/dom";
import { applyNormalizedInlineStyle, bindStyle, isStyleBinding } from "../misc/Styles";
import Q from "../node/Queried";
import { setChecked } from "@fest-lib/dom";

// !
// TODO! - add support for un-subscribe for everyone...
// !

//
const $entries = (obj: any) => {
    if (isPrimitive(obj)) { return []; }
    if (Array.isArray(obj)) { return obj.map((item, idx) => [idx, item]); }
    if (obj instanceof Map) { return Array.from(obj.entries()); }
    if (obj instanceof Set) { return Array.from(obj.values()); }
    return Array.from(Object.entries(obj));
}

/** Apply one attribute; style StyleBinding uses reflectStyles, not setAttribute. */
const reflectOneAttribute = (element: HTMLElement | null | undefined, prop: any, value: any) => {
    if (!element || prop == null) return;
    const name = prop?.toString?.() || prop;
    if (
        (name === "style" || name === "cssText") &&
        (isStyleBinding(value) || typeof value === "function")
    ) {
        reflectStyles(element, value);
        return;
    }
    handleAttribute(element, prop, value);
};

//
export const reflectAttributes = (element: HTMLElement, attributes: any)=>{
    if (!attributes) return element;
    const weak = new WeakRef(attributes), wel = new WeakRef(element);
    if (typeof attributes == "object" || typeof attributes == "function") {
        $entries(attributes).forEach(([prop, value])=>{
            reflectOneAttribute(wel?.deref?.(), prop, value);
        });
        const usub = affected(attributes, (value, prop: any)=>{
            reflectOneAttribute(wel?.deref?.(), prop, value);
            // StyleBinding is applied via reflectStyles; skip attribute bank.
            if (
                (prop === "style" || prop === "cssText") &&
                (isStyleBinding(value) || typeof value === "function")
            ) {
                return;
            }
            bindHandler(wel?.deref?.(), value, prop, handleAttribute, weak, true);
        });
        addToCallChain(attributes, Symbol.dispose, usub);
        addToCallChain(element, Symbol.dispose, usub);
    } else
    { console.warn("Invalid attributes object:", attributes); }
}

//
export const reflectARIA = (element: HTMLElement, aria: any)=>{
    if (!aria) return element;
    const weak = new WeakRef(aria), wel = new WeakRef(element);
    if (typeof aria == "object" || typeof aria == "function") {
        $entries(aria).forEach(([prop, value])=>{
            handleAttribute(wel?.deref?.(), "aria-"+(prop?.toString?.()||prop||""), value);
        });
        const usub = affected(aria, (value, prop)=>{ // @ts-ignore
            handleAttribute(wel?.deref?.(), "aria-"+(prop?.toString?.()||prop||""), value, true);
            bindHandler(wel, value, prop, handleAttribute, weak, true);
        });
        addToCallChain(aria, Symbol.dispose, usub);
        addToCallChain(element, Symbol.dispose, usub);
    } else
    { console.warn("Invalid ARIA object:", aria);}; return element;
}

//
export const reflectDataset = (element: HTMLElement, dataset: any)=>{
    if (!dataset) return element;
    const weak = new WeakRef(dataset), wel = new WeakRef(element);
    if (typeof dataset == "object" || typeof dataset == "function") {
        $entries(dataset).forEach(([prop, value])=>{
            handleDataset(wel?.deref?.(), prop, value);
        });
        const usub = affected(dataset, (value, prop: any)=>{
            handleDataset(wel?.deref?.(), prop, value);
            bindHandler(wel?.deref?.(), value, prop, handleDataset, weak);
        });
        addToCallChain(dataset, Symbol.dispose, usub);
        addToCallChain(element, Symbol.dispose, usub);
    } else
    { console.warn("Invalid dataset object:", dataset); }; return element;
}

// TODO! support observe styles (reactive StyleBinding swap)
export const reflectStyles = (element: HTMLElement, styles: string|any)=>{
    if (!styles) return element;

    // Nested `{ style: S`...` }` (e.g. mistaken double-wrap).
    if (
        styles?.style != null &&
        !isStyleBinding(styles) &&
        (isStyleBinding(styles.style) || typeof styles.style === "function")
    ) {
        return reflectStyles(element, styles.style);
    }

    const apply = Array.isArray(styles?.style) ? styles?.style?.[0] : styles?.style;
    if (typeof styles == "string") { applyNormalizedInlineStyle(element, styles); } else
    if (isStyleBinding(styles) || typeof styles == "function") {
        // S`...` / css`...` applicator (and optional StyleBinding tuple).
        bindStyle(element, styles);
    } else
    if (typeof styles?.value == "string") { affected([styles, "value"], (val) => { applyNormalizedInlineStyle(element, val ?? ""); }); } else
    // Ref whose .value is StyleBinding (style=${ref} where ref.value = S`...`).
    if (
        styles != null &&
        typeof styles == "object" &&
        "value" in styles &&
        (isStyleBinding(styles.value) || typeof styles.value === "function")
    ) {
        bindStyle(element, styles.value);
        const usub = affected([styles, "value"], (val) => {
            if (isStyleBinding(val) || typeof val === "function") bindStyle(element, val);
        });
        addToCallChain(styles, Symbol.dispose, usub);
        addToCallChain(element, Symbol.dispose, usub);
    } else
    if (apply != null && typeof apply == "function") { bindStyle(element, styles.style); } else
    if (typeof styles == "object") {
        const weak = new WeakRef(styles), wel = new WeakRef(element);
        $entries(styles).forEach(([prop, value])=>{
            handleStyleChange(wel?.deref?.(), prop, value);
        });
        const usub = affected(styles, (value, prop: any)=>{
            handleStyleChange(wel?.deref?.(), prop, value);
            bindHandler(wel?.deref?.(), value, prop, handleStyleChange, weak?.deref?.());
        });

        //
        addToCallChain(styles, Symbol.dispose, usub);
        addToCallChain(element, Symbol.dispose, usub);
    } else
    { console.warn("Invalid styles object:", styles); } return element;
}

// one-shot update
export const reflectWithStyleRules = async (element: HTMLElement, rule: any)=>{ const styles = await rule?.(element); return reflectStyles(element, styles); }
export const reflectProperties = (element: HTMLElement, properties: any)=>{
    if (!properties) return element; const weak = new WeakRef(properties), wel = new WeakRef(element);

    //
    const onChange = (ev: any)=>{
        const input = Q("input", ev?.target);
        if (input?.value != null && isNotEqual(input?.value, properties?.value)) properties.value = input?.value;
        if (input?.valueAsNumber != null && isNotEqual(input?.valueAsNumber, properties?.valueAsNumber)) properties.valueAsNumber = input?.valueAsNumber;
        if (input?.checked != null && isNotEqual(input?.checked, properties?.checked)) properties.checked = input?.checked;
    };

    //
    $entries(properties).forEach(([prop, value])=>{
        handleProperty(wel?.deref?.(), prop, value);
    });

    //
    const usub = affected(properties, (value, prop: any) => {
        const el = wel.deref();
        if (el) {
            if (prop == "checked") {
                setChecked(el as HTMLInputElement, value);
            } else {
                bindWith(el, prop, value, handleProperty, weak?.deref?.(), true);
            }
        }
    });

    //
    addToCallChain(properties, Symbol.dispose, usub); addToCallChain(element, Symbol.dispose, usub); element.addEventListener("change", onChange); return element;
}

//
export const reflectClassList = (element: HTMLElement, classList?: Set<string>)=>{
    if (!classList) return element; const wel = new WeakRef(element);

    //
    $entries(classList).forEach(([prop, value]) => {
        const el = element;
        if (typeof value == "undefined" || value == null)
            { if ( el.classList.contains(value)) { el.classList.remove(value); } } else
            { if (!el.classList.contains(value)) { el.classList.add(value); }
        }
    });

    const usub = iterated(classList, (value: string)=>{
        const el = wel?.deref?.();
        if (el) {
            if (typeof value == "undefined" || value == null)
                { if ( el.classList.contains(value)) { el.classList.remove(value); } } else
                { if (!el.classList.contains(value)) { el.classList.add(value); }
            }
        }
    });

    //
    addToCallChain(classList, Symbol.dispose, usub);
    addToCallChain(element, Symbol.dispose, usub); return element;
}
