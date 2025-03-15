import { observe } from "./Array.js";
import {subscribe} from "../lib/object.js";

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
            if (typeof value != "object" || typeof value != "function") {
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
        properties.value = ev?.target?.value;
        properties.valueAsNumber = ev?.target?.valueAsNumber;
        properties.checked = ev?.target?.checked;
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

export const getNode = (E, mapper?: Function)=>{
    if (mapper) {
        const old = reMap;
        if (typeof E == "object" || typeof E == "function") {
            E = reMap?.get(E) ?? getNode(mapper?.(E));
            if (!reMap?.has?.(old)) { reMap?.set(old, E); };
        } else {
            E = getNode(mapper?.(E));
        }
    }
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

// TODO! reactive arrays
export const reflectChildren = (element: HTMLElement|DocumentFragment, children: any[] = [], mapper?: Function)=>{
    if (!children) return;
    //if (element instanceof HTMLElement) element.innerHTML = ``;

    observe(children, (op, ...args)=>{
        if (op == "set") { replaceChildren(element, args[0], getNode(args[1], mapper)); }
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
