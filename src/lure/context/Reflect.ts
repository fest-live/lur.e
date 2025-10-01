import { addToCallChain, subscribe, observe, isNotEqual } from "fest/object";

//
import { bindHandler, bindWith } from "../core/Binding";
import { handleDataset, handleProperty, handleAttribute, handleStyleChange } from "fest/dom";
import Q from "../node/Queried";
import { setChecked } from "fest/dom";

// !
// TODO! - add support for un-subscribe for everyone...
// !

//
export const reflectAttributes = (element: HTMLElement, attributes: any)=>{
    if (!attributes) return element;
    const weak = new WeakRef(attributes), wel = new WeakRef(element);
    if (typeof attributes == "object" || typeof attributes == "function") {
        const usub = subscribe(attributes, (value, prop: any)=>{
            handleAttribute(wel?.deref?.(), prop, value);
            bindHandler(wel, value, prop, handleAttribute, weak, true);
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
        const usub = subscribe(aria, (value, prop)=>{ // @ts-ignore
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
        const usub = subscribe(dataset, (value, prop: any)=>{
            handleDataset(wel?.deref?.(), prop, value);
            bindHandler(wel?.deref?.(), value, prop, handleDataset, weak);
        });
        addToCallChain(dataset, Symbol.dispose, usub);
        addToCallChain(element, Symbol.dispose, usub);
    } else
    { console.warn("Invalid dataset object:", dataset); }; return element;
}

// TODO! support observe styles
export const reflectStyles = (element: HTMLElement, styles: string|any)=>{
    if (!styles) return element;
    if (typeof styles == "string") { element.style.cssText = styles; } else
    if (typeof styles?.value == "string") { subscribe([styles, "value"], (val) => { element.style.cssText = val; }); } else
    if (typeof styles == "object" || typeof styles == "function") {
        const weak = new WeakRef(styles), wel = new WeakRef(element);
        const usub = subscribe(styles, (value, prop: any)=>{
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
    const usubs = [
        subscribe(properties, (value, prop: any) => {
            const el = wel.deref();
            if (el) {
                if (prop == "checked") {
                    setChecked(el as HTMLInputElement, value);
                } else {
                    bindWith(el, prop, value, handleProperty, weak?.deref?.(), true);
                }
            }
        })
    ]

    //
    const usub = ()=> { usubs?.forEach((usub)=>usub?.()); wel?.deref?.()?.removeEventListener?.("change", onChange);  };

    //
    addToCallChain(properties, Symbol.dispose, usub);
    addToCallChain(element, Symbol.dispose, usub);

    // if any input
    element.addEventListener("change", onChange); return element;
}

//
export const reflectClassList = (element: HTMLElement, classList?: Set<string>)=>{
    if (!classList) return element; const wel = new WeakRef(element);
    const usub = observe(classList, (value: string)=>{
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
