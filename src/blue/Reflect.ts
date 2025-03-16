import { observe } from "./Array.js";
import {makeReactive, subscribe} from "../lib/object.js";

//
export const elMap = new WeakMap<any, HTMLElement|DocumentFragment|Text>();
export const reMap = new WeakMap();

//
export const reflectAttributes = (element: HTMLElement, attributes: any)=>{
    if (!attributes) return;

    subscribe(attributes, (value, prop)=>{
        if (element.getAttribute(prop) !== value) {
            if (typeof value == "undefined" || value == null) {
                element.removeAttribute(prop);
            } else
            if (typeof value != "object" && typeof value != "function") {
                element.setAttribute(prop, value);
            }
        }
    })

    // bi-directional attribute
    const config = { attributes: true, childList: false, subtree: false };
    const callback = (mutationList, observer) => {
        for (const mutation of mutationList) {
            if (mutation.type == "attributes") {
                if (attributes[mutation.attributeName] !== mutation.target.getAttribute(mutation.attributeName)) {
                    attributes[mutation.attributeName] = mutation.target.getAttribute(mutation.attributeName);
                }
            }
        }
    };

    //
    const observer = new MutationObserver(callback);
    observer.observe(element, config);
}

//
export const reflectProperties = (element: HTMLElement, properties: any)=>{
    if (!properties) return;

    subscribe(properties, (value, prop)=>{
        if (element[prop] !== value) {
            if (typeof value == "undefined") {
                delete element[prop];
            } else {
                element[prop] = value;
            }
        }
    })

    // if any input
    element.addEventListener("change", (ev: any)=>{
        if (ev?.target?.value != null && ev?.target?.value !== properties.value) properties.value = ev?.target?.value;
        if (ev?.target?.valueAsNumber != null && ev?.target?.valueAsNumber !== properties.valueAsNumber) properties.valueAsNumber = ev?.target?.valueAsNumber;
        if (ev?.target?.checked != null && ev?.target?.checked !== properties.checked) properties.checked = ev?.target?.checked;
    });
}

// TODO! support observe styles
export const reflectStyles = (element: HTMLElement, styles: string|any)=>{
    if (!styles) return;

    if (typeof styles == "string") {
        element.style = styles;
    } else {
        subscribe(styles, (value, prop)=>{
            if (element.style[prop] !== value) {
                if (typeof value == "undefined") {
                    delete element.style[prop];
                } else {
                    element.style[prop] = value;
                }
            }
        });
    }
}

//
export const getNode = (E, mapper?: Function)=>{
    if (mapper) {
        const old = reMap;
        if (typeof E == "object" || typeof E == "function") {
            const b = reMap?.get(E) ?? mapper?.(E); E = getNode(b);
            if (!reMap?.has?.(old)) { reMap?.set(old, b); };
        } else {
            E = getNode(mapper?.(E));
        }
    }
    if (typeof E == "function") {
        return getNode(E()); // mapped arrays always empties after
    } else
    if (typeof E == "string") {
        return new Text(E);
    } else
    if (E instanceof Text || E instanceof HTMLElement || E instanceof DocumentFragment) {
        return E;
    } else
    if (typeof E == "object") {
        return E?.element ?? elMap.get(E);
    }
    return E;
}

const replaceChildren = (element, index, node)=>{
    if (element.childNodes[index] instanceof Text && node instanceof Text) {
        element.childNodes[index].textContent = node.textContent;
    } else {
        element.childNodes[index]?.replaceWith?.(node);
    }
}

// forcely update child nodes (and erase current content)
// ! doesn't create new ones (if was cached or saved)
export const reformChildren = (element: HTMLElement|DocumentFragment, children: any[] = [], mapper?: Function)=>{
    if (!children) return;
    const ref = new WeakRef(element);
    if (element instanceof HTMLElement) { element.innerHTML = ``; };
    return (mapper ? children.map(mapper as any) : children).map((nd)=>{
        const node = getNode(nd);
        const element = ref.deref(); if (!element) return node;
        element.append(node); return node;
    });
}

// TODO! reactive arrays
export const reflectChildren = (element: HTMLElement|DocumentFragment, children: any[] = [], mapper?: Function)=>{
    if (!children) return;
    const ref = new WeakRef(element);
    //if (element instanceof HTMLElement) element.innerHTML = ``;

    observe(children, (op, ...args)=>{
        const element = ref.deref(); if (!element) return;
        if (op == "set") { replaceChildren(element, args[0], getNode(args[1], mapper)); } // TODO: replace group
        if (op == "push") { element.append(getNode(args[0]?.[0], mapper)); };
        if (op == "splice") { element.children[args[0]?.[1]]?.remove?.(); };
    });
}

// TODO! observable classList
export const reflectClassList = (element: HTMLElement, classList?: Set<string>)=>{
    if (!classList) return;
    subscribe(classList, (value: string, _: unknown, oldValue?: string)=>{
        if (typeof value == "undefined" || value == null) {
            element.classList.remove(value);
        } else {
            element.classList.add(value);
        }
    })
}



//
const objectAssignNotEqual = (dst, src = {})=>{
    Object.entries(src).forEach(([k,v])=>{ if (v !== dst[k]) { dst[k] = v; }; });
    return dst;
}

// used for conditional reaction
// !one-directional
export const computed = (sub, cb?: Function|null, dest?: [any, string|number|symbol]|null)=>{
    if (!dest) dest = [makeReactive({}), "value"];
    subscribe(sub, (value, prop, old) => {
        const got = cb?.(value, prop, old);
        if (got !== dest[dest[1]]) {
            dest[dest[1]] = got;
        }
    });
    return dest?.[0]; // return reactive value
}

// used for redirection properties
// !one-directional
export const remap = (sub, cb?: Function|null, dest?: any|null)=>{
    if (!dest) dest = makeReactive({});
    subscribe(sub, (value, prop, old)=> {
        const got = cb?.(value, prop, old);
        if (typeof got == "object") {
            objectAssignNotEqual(dest, got);
        } else
        if (dest[prop] !== got) dest[prop] = got;
    });
    return dest?.[0]; // return reactive value
}

// !one-directional
export const unified = (...subs: any[])=>{
    const dest = makeReactive({});
    subs.forEach((sub)=>subscribe(sub, (value, prop, old)=>{
        if (dest[prop] !== value) { dest[prop] = value; };
    }));
    return dest;
}
