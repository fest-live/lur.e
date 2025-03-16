import { observe } from "./Array.js";
import {subscribe} from '/externals/lib/object.js';
import { appendChild, removeChild, replaceChildren } from "./DOM.js";

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
    const callback = (mutationList, _) => {
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
        element.style.cssText = styles;
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



// TODO! reactive arrays
export const reflectChildren = (element: HTMLElement|DocumentFragment, children: any[] = [], mapper?: Function)=>{
    if (!children) return;
    const ref = new WeakRef(element);
    //if (element instanceof HTMLElement) element.innerHTML = ``;

    observe(children, (op, ...args)=>{
        const element = ref.deref(); if (!element) return;
        if (op == "set")    { replaceChildren(element, args[1], args[0], mapper); } // TODO: replace group
        if (op == "push")   { appendChild(element, args[0], mapper); };
        if (op == "splice") { removeChild(element, children[args[0]?.[0]], args[0]?.[0]); };
        if (op == "pop")    { removeChild(element, null, children?.length); };
    });
}

// TODO! observable classList
export const reflectClassList = (element: HTMLElement, classList?: Set<string>)=>{
    if (!classList) return;
    subscribe(classList, (value: string)=>{
        if (typeof value == "undefined" || value == null) {
            element.classList.remove(value);
        } else {
            element.classList.add(value);
        }
    })
}

// forcely update child nodes (and erase current content)
// ! doesn't create new ones (if was cached or saved)
export const reformChildren = (element: HTMLElement|DocumentFragment, children: any[] = [], mapper?: Function)=>{
    if (!children) return;
    const ref = new WeakRef(element);
    if (element instanceof HTMLElement) { element.innerHTML = ``; };
    return (mapper ? children.map(mapper as any) : children).map((nd)=>{
        const element = ref.deref(); if (!element) return nd;
        appendChild(element, nd, mapper);
        return nd;
    });
}
