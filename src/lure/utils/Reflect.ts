import { subscribe, observe } from "u2re/object";

//
import { appendChild, removeNotExists } from "./DOM";
import { bindHandler, $mapped, $behavior, addToBank } from "../core/Binding";
import { handleDataset, handleProperty, handleAttribute, handleStyleChange } from "../core/Handler";

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
        if (usub) attributes[Symbol.dispose] ??= usub;
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
        if (usub) aria[Symbol.dispose] ??= usub;
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
            bindHandler(wel, value, prop, handleDataset, weak);
        });
        if (usub) dataset[Symbol.dispose] ??= usub;
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
            bindHandler(wel, value, prop, handleStyleChange, weak);
        });;
        if (usub) styles[Symbol.dispose] ??= usub;
    } else
    { console.warn("Invalid styles object:", styles); } return element;
}

// one-shot update
export const reflectWithStyleRules = async (element: HTMLElement, rule: any)=>{ const styles = await rule?.(element); return reflectStyles(element, styles); }
export const reflectProperties = (element: HTMLElement, properties: any)=>{
    if (!properties) return element; const weak = new WeakRef(properties), wel = new WeakRef(element);
    const onChange = (ev: any)=>{
        if (ev?.target?.value != null && ev?.target?.value !== properties.value) properties.value = ev?.target?.value;
        if (ev?.target?.valueAsNumber != null && ev?.target?.valueAsNumber !== properties.valueAsNumber) properties.valueAsNumber = ev?.target?.valueAsNumber;
        if (ev?.target?.checked != null && ev?.target?.checked !== properties.checked) properties.checked = ev?.target?.checked;
    };

    //
    properties[Symbol.dispose] ??= ()=> { wel?.deref?.()?.removeEventListener?.("change", onChange); subscribe(properties, (value, prop: any)=>{
        handleProperty(wel?.deref?.(), prop, value);
        bindHandler(wel, value, prop, handleProperty, weak);
    }); };

    // if any input
    element.addEventListener("change", onChange); return element;
}

// TODO! use handlerMap registry
export const reflectChildren = (element: HTMLElement|DocumentFragment, children: any[] = [], mapper?: Function)=>{
    if (!children) return element; if (!addToBank(element, children, "childNodes", reflectChildren)) { return element; }

    //
    const ref = new WeakRef(element);
    mapper   = (children?.[$mapped] ? (children as any)?.mapper : mapper) ?? mapper;
    children = (children?.[$mapped] ? (children as any)?.children : children) ?? children;

    //
    const toBeRemoved: any[] = [], toBeAppend: any[] = [], toBeReplace: any[] = [];
    const merge = ()=>{ // @ts-ignore
        toBeReplace.forEach((args)=>replaceChildren(...args)); toBeReplace.splice(0, toBeReplace.length); // @ts-ignore
        toBeAppend .forEach((args)=>appendChild(...args));     toBeAppend .splice(0, toBeAppend.length); // @ts-ignore
        toBeRemoved.forEach((args)=>removeChild(...args));     toBeRemoved.splice(0, toBeRemoved.length); // @ts-ignore
    }

    //
    let controller: AbortController|null = null;
    const isArray = Array.isArray(children);
    const unsub = observe(children, (...args)=>{
        controller?.abort?.(); controller = new AbortController();

        //
        const element = ref.deref(); if (!element) return;
        const op  = isArray ? (args?.[args.length-1] || "") : null;
        const old = isArray ? (args?.[args.length-2] ?? null) : args?.[2];
        const idx = args?.[1] ?? -1, obj = args?.[0] ?? children?.[idx];

        //
        if (element && (isArray && ["@add", "@set", "@remove"].indexOf(op) >= 0) || (!isArray)) {
            if (obj != null && (old != null || op == "@set"   )) { toBeReplace.push([element, obj ?? old, mapper]); };
            if (obj != null && (old == null || op == "@add"   )) { toBeAppend .push([element, obj ?? old, mapper]); };
            if (old != null && (obj == null || op == "@remove")) { toBeRemoved.push([element, old ?? obj, mapper]); };
        }

        //
        if (children?.length == 0 && element instanceof HTMLElement) { /*element.innerHTML = ``;*/ removeNotExists(element, children, mapper); }; // @ts-ignore
        if (op && op != "@get" && ["@add", "@set", "@remove"].indexOf(op) >= 0 || !op) { // @ts-ignore
            if (typeof children?.[$behavior] == "function")
                { children?.[$behavior]?.(merge, [toBeAppend, toBeReplace, toBeRemoved], [controller.signal, op, ref, args]); } else { merge(); }
        }
    });
    if (unsub) children[Symbol.dispose] ??= unsub; return element;
}

//
export const reflectClassList = (element: HTMLElement, classList?: Set<string>)=>{
    if (!classList) return element; const wel = new WeakRef(element);
    const usub = subscribe(classList, (value: string)=>{
        const el = wel?.deref?.();
        if (el) {
            if (typeof value == "undefined" || value == null)
                { if ( el.classList.contains(value)) { el.classList.remove(value); } } else
                { if (!el.classList.contains(value)) { el.classList.add(value); }
            }
        }
    });;
    if (usub) classList[Symbol.dispose] ??= usub; return element;
}

// forcely update child nodes (and erase current content)
export const reformChildren = (element: HTMLElement|DocumentFragment, children: any[] = [], mapper?: Function)=>{
    if (!children) return element; const ref = new WeakRef(element); removeNotExists(element, children, mapper);
    mapper = (children?.[$mapped] ? (children as any)?.mapper : mapper) ?? mapper;
    (children = (children?.[$mapped] ? (children as any)?.children : children) ?? children).map((nd)=>{
        const element = ref.deref(); if (!element) return nd;
        appendChild(element, nd, mapper); return nd;
    }); return element;
}
