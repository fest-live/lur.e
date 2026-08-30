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
import { applyNormalizedInlineStyle, bindStyle, isStyleBinding } from "@fest-lib/style-lib";
import Q from "../node/Queried";
import { setChecked } from "@fest-lib/dom";

// !
// TODO! - add support for un-subscribe for everyone...
// !

//
export const makeDisposable = (anchors: any[], usub?: Function|(Function|null|void)[]|null|void): (()=>void) => {
    if (usub == null) return ()=>{};
    const disposables: Function[] = anchors.flatMap((anchor: any)=>{
        if (Array.isArray(usub)) 
            { return usub?.map?.((u: Function|null|void)=>{ if (u != null) { addToCallChain(anchor, Symbol.dispose, u); return u; } }); } else 
            { if (usub != null) { addToCallChain(anchor, Symbol.dispose, usub); return [usub]; } else return []; }
    })?.filter?.((disposable: any)=>disposable != null) as Function[];
    return ()=>disposables?.map?.((disposable: Function)=>disposable?.())?.filter?.((d: any)=>(d != null && typeof d == "function"))?.forEach?.((d: any)=>d?.());
}

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
    if (!element || prop == null) return element;
    const name = prop?.toString?.() || prop;
    if (
        (name === "style" || name === "cssText") &&
        (isStyleBinding(value) || typeof value === "function")
    ) {
        reflectStyles(element, value);
        return element;
    }
    handleAttribute(element, prop, value);
    return element;
};

//
export const reflectAttributes = (element: HTMLElement, attributes: any)=>{
    if (!attributes) return element;
    const weak = new WeakRef(attributes), wel = new WeakRef(element);
    if (typeof attributes == "object" || typeof attributes == "function") {
        $entries(attributes).forEach(([prop, value])=>{
            reflectOneAttribute(wel?.deref?.(), prop, value);
        });
        makeDisposable([attributes, element], affected(attributes, (value, prop: any)=>{
            reflectOneAttribute(wel?.deref?.(), prop, value);
            // StyleBinding is applied via reflectStyles; skip attribute bank.
            if (
                (prop === "style" || prop === "cssText") &&
                (isStyleBinding(value) || typeof value === "function")
            ) { return; }
            return bindHandler(wel?.deref?.(), value, prop, handleAttribute, weak, true);
        }));
    } else
    { console.warn("Invalid attributes object:", attributes); }

    //
    return element;
}

//
export const reflectARIA = (element: HTMLElement, aria: any)=>{
    if (!aria) return element;
    const weak = new WeakRef(aria), wel = new WeakRef(element);
    if (typeof aria == "object" || typeof aria == "function") {
        $entries(aria).forEach(([prop, value])=>{
            handleAttribute(wel?.deref?.(), "aria-"+(prop?.toString?.()||prop||""), value);
        });
        makeDisposable([aria, element], affected(aria, (value, prop)=>{ // @ts-ignore
            handleAttribute(wel?.deref?.(), "aria-"+(prop?.toString?.()||prop||""), value, true);
            return bindHandler(wel, value, prop, handleAttribute, weak, true);
        }));
    } else
    { console.warn("Invalid ARIA object:", aria);};

    //
    return element;
}

//
export const reflectDataset = (element: HTMLElement, dataset: any)=>{
    if (!dataset) return element;
    const weak = new WeakRef(dataset), wel = new WeakRef(element);
    if (typeof dataset == "object" || typeof dataset == "function") {
        $entries(dataset).forEach(([prop, value])=>{
            handleDataset(wel?.deref?.(), prop, value);
        });
        makeDisposable([dataset, element], affected(dataset, (value, prop: any)=>{
            handleDataset(wel?.deref?.(), prop, value);
            return bindHandler(wel?.deref?.(), value, prop, handleDataset, weak);
        }));
    } else
    { console.warn("Invalid dataset object:", dataset); }; 

    //
    return element;
}

// TODO! support observe styles (reactive StyleBinding swap)
export const reflectStyles = (element: HTMLElement, styles: string|any)=>{
    if (!styles) return element;

    // Nested `{ style: S`...` }` (e.g. mistaken double-wrap).
    if (
        styles?.style != null &&
        !isStyleBinding(styles) &&
        (isStyleBinding(styles.style) || typeof styles.style === "function")
    ) { return reflectStyles(element, styles.style); }

    //
    const apply = Array.isArray(styles?.style) ? styles?.style?.[0] : styles?.style;
    if (typeof styles == "string") { 
        makeDisposable([styles, element], applyNormalizedInlineStyle(element, styles));
        return element;
    } else
    if (isStyleBinding(styles) || typeof styles == "function") {
        // S`...` / css`...` applicator (and optional StyleBinding tuple).
        makeDisposable([styles, element], bindStyle(element, styles));
        return element;
    } else
    if (typeof styles?.value == "string") { 
        makeDisposable([styles, element], affected([styles, "value"], (val) => {
            return makeDisposable([styles, element], applyNormalizedInlineStyle(element, val ?? ""));
        }));
        return element;
    } else
    // Ref whose .value is StyleBinding (style=${ref} where ref.value = S`...`).
    if (
        styles != null &&
        typeof styles == "object" &&
        "value" in styles &&
        (isStyleBinding(styles.value) || typeof styles.value === "function")
    ) {
        const dispose = bindStyle(element, styles.value);
        const usub = affected([styles, "value"], (val) => {
            if (isStyleBinding(val) || typeof val === "function") {
                makeDisposable([styles, element], bindStyle(element, val));
            }
        });
        makeDisposable([styles, element], [usub, dispose]);
        return element;
    } else
    if (apply != null && typeof apply == "function") {
        makeDisposable([styles, element], bindStyle(element, styles.style));
        return element; 
    } else
    if (typeof styles == "object") {
        const weak = new WeakRef(styles), wel = new WeakRef(element);
        $entries(styles).forEach(([prop, value])=>{
            handleStyleChange(wel?.deref?.(), prop, value);
        });

        //
        makeDisposable([styles, element], affected(styles, (value, prop: any)=>{
            handleStyleChange(wel?.deref?.(), prop, value);
            return bindHandler(wel?.deref?.(), value, prop, handleStyleChange, weak?.deref?.());
        }));
        return element;
    } else
    { console.warn("Invalid styles object:", styles); } 

    //
    return element;
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
    makeDisposable([properties, element], affected(properties, (value, prop: any) => {
        const el = wel.deref();
        if (el) {
            if (prop == "checked") {
                setChecked(el as HTMLInputElement, value);
            } else {
                return bindWith(el, prop, value, handleProperty, weak?.deref?.(), true);
            }
        }
        return null;
    }));

    //
    element.addEventListener("change", onChange); 
    return element;
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

    //
    makeDisposable([classList, element], iterated(classList, (value: string)=>{
        const el = wel?.deref?.();
        if (el) {
            if (typeof value == "undefined" || value == null)
                { if ( el.classList.contains(value)) { el.classList.remove(value); } } else
                { if (!el.classList.contains(value)) { el.classList.add(value); }
            }
        }
    }));

    //
    return element;
}
