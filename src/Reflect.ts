import {subscribe} from "./lib/object.js";

//
export const elMap = new WeakMap<any, HTMLElement>();

//
export const reflectAttributes = (element: HTMLElement, attributes: any)=>{
    subscribe(attributes, (value, prop)=>{
        if (element.getAttribute(prop) !== value) {
            if (typeof value == "undefined" || value == null) {
                element.removeAttribute(prop);
            } else {
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
export const reflectStyles = (element: HTMLElement, styles: any)=>{
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

// TODO! reactive arrays
export const reflectChildren = (element: HTMLElement, children: any[] = [])=>{
    element.innerHTML = ``;
    children.forEach((E)=>{
        if (typeof E == "string") {
            element.append(new Text(E));
        } else
        if (E instanceof Text || E instanceof HTMLElement || E instanceof DocumentFragment) {
            element.append(E);
        } else
        if (typeof E == "object") {
            const N = E?.element ?? elMap.get(E);
            if (N) { element.append(N); };
        }
    });
}

// TODO! observable classList
export const reflectClassList = (element: HTMLElement, classList: Set<string>)=>{
    subscribe(classList, (value: string, _: unknown, oldValue?: string)=>{
        if (typeof value == "undefined" || value == null) {
            element.classList.remove(value);
        } else {
            element.classList.add(value);
        }
    })
}
