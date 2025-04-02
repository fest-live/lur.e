//
import { observe, importCdn } from "./Array.js";
import { appendChild, removeChild, replaceChildren } from "./DOM.js";

// @ts-ignore
const { subscribe } = await Promise.try(importCdn, ["/externals/lib/object.js"]);

//
export const reflectAttributes = (element: HTMLElement, attributes: any)=>{
    if (!attributes) return;

    //
    const weak = new WeakRef(attributes);
    subscribe(attributes, (value, prop)=>{
        if (element.getAttribute(prop) !== value) {
            if (typeof value == "undefined" || value == null) {
                element.removeAttribute(prop);
            } else
            if (typeof value != "object" && typeof value != "function") {
                element.setAttribute(prop, value);
            } else
            if (value?.value != null && typeof value?.value != "object" && typeof value?.value != "function") {
                element.setAttribute(prop, value.value);
            } else { // any invalid type is deleted value
                element.removeAttribute(prop);
            }
        }

        // subscribe with value with `value` reactivity
        if (value?.value != null) {
            subscribe([value, "value"], (curr) => {
                // sorry, we doesn't allow abuse that mechanic
                if (weak?.deref?.()?.[prop] === value) {
                    if (typeof curr == "undefined" || curr == null) {
                        element.removeAttribute(prop);
                    } else
                    if (typeof curr != "object" && typeof curr != "function") {
                        element.setAttribute(prop, curr);
                    } else
                    if (curr?.value != null && typeof curr?.value != "object" && typeof curr?.value != "function") {
                        element.setAttribute(prop, curr.value);
                    } else { // any invalid type is deleted value
                        element.removeAttribute(prop);
                    }
                }
            });
        }
    })

    // bi-directional attribute
    const config = { attributes: true, childList: false, subtree: false };
    const callback = (mutationList, _) => {
        for (const mutation of mutationList) {
            if (mutation.type == "attributes") {
                const key = mutation.attributeName;
                const value = mutation.target.getAttribute(mutation.attributeName);
                if (attributes[key] != null && (attributes[key]?.value != null || (typeof attributes[key] == "object" || typeof attributes[key] == "function"))) {
                    if (attributes[key]?.value !== value) { attributes[key].value = value; }
                } else
                if (attributes[key] !== value) {
                    attributes[key] = value;
                }
            }
        }
    };

    //
    const observer = new MutationObserver(callback);
    observer.observe(element, config);
}

//
function camelToKebab(str) { return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(); }
function kebabToCamel(str) { return str.replace(/-([a-z])/g, (_, char) => char.toUpperCase()); }

//
const deleteStyleProperty = (element, name)=>{
    element.style.removeProperty(camelToKebab(name));
}

//
const setStyleProperty = (element, name, value: any)=>{
    // custom properties currently doesn't supports Typed OM
    if (name?.trim?.()?.startsWith?.("--")) {
        const old = element.style.getProperty(name);
        value = (value instanceof CSSStyleValue ? value.toString() : value);
        if (old !== value) { element.style.setProperty(name, value, ""); };
    } else
    if (value instanceof CSSStyleValue) {
        const kebab = camelToKebab(name);
        if (element.attributeStyleMap != null) {
            const old = element.attributeStyleMap.get(kebab);
            if (old !== value) {
                if (value instanceof CSSUnitValue) {
                    if (old != null && value.unit && value.unit !== old?.unit) {
                        element.attributeStyleMap.set(kebab, value);
                    } else { old.value = value.value; }
                } else {
                    element.attributeStyleMap.set(kebab, value);
                }
            }
        } else {
            element.style.setProperty(kebabToCamel, value.toString(), "");
        }
    } else // very specific case if number and unit value can be changed directly
    if (!Number.isNaN(value?.value ?? value) && element.attributeStyleMap != null) {
        const kebab = camelToKebab(name);
        const old = element.attributeStyleMap.get(kebab);
        if (old instanceof CSSUnitValue) { old.value = value?.value ?? value; } else
        {   // hard-case
            const computed = element.computedStyleMap();
            const oldCmVal = computed.get(kebab);
            if (oldCmVal instanceof CSSUnitValue) {
                if (oldCmVal.value != (value?.value ?? value)) {
                    oldCmVal.value = value?.value ?? value;
                    element.attributeStyleMap.set(kebab, oldCmVal);
                }
            } else {
                element.style[kebabToCamel(name)] = (value?.value ?? value);
            }
        }
    } else {
        element.style[kebabToCamel(name)] = (value?.value ?? value);
    }
}

//
const handleStyleChange = (element, prop, value)=>{
    if (typeof value == "undefined" || value == null) {
        deleteStyleProperty(element, prop);
    } else // non-object, except Typed OM
    if ((typeof value != "object" && typeof value != "function") || value instanceof CSSStyleValue) {
        setStyleProperty(element, prop, value);
    } else
    if (value?.value != null && typeof value?.value != "object" && typeof value?.value != "function") {
        setStyleProperty(element, prop, value.value);
    } else { // any invalid type is deleted value
        deleteStyleProperty(element, prop);
    }
}



// TODO! support observe styles
export const reflectStyles = (element: HTMLElement, styles: string|any)=>{
    if (!styles) return;

    //
    if (typeof styles == "string") { element.style.cssText = styles; } else
    if (typeof styles?.value == "string") { subscribe([styles, "value"], (val) => { element.style.cssText = val; }); } else
    {
        const weak = new WeakRef(styles);
        subscribe(styles, (value, prop)=>{
            if (element.style[kebabToCamel(prop)] !== value) {
                handleStyleChange(element, prop, value);
            }

            // subscribe with value with `value` reactivity (TypedOM isn't valid)
            if (value?.value != null && !(value instanceof CSSStyleValue)) {
                subscribe([value, "value"], (curr) => {
                    // sorry, we doesn't allow abuse that mechanic
                    if (weak?.deref?.()?.[prop] === value) {
                        handleStyleChange(element, prop, curr);
                    }
                });
            }
        });
    }
}

//
export const reflectProperties = (element: HTMLElement, properties: any)=>{
    if (!properties) return;

    //
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

// TODO! reactive arrays
export const reflectChildren = (element: HTMLElement|DocumentFragment, children: any[] = [], mapper?: Function)=>{
    if (!children) return;
    const ref = new WeakRef(element);
    //if (element instanceof HTMLElement) element.innerHTML = ``;

    mapper   = (children?.["@mapped"] ? (children as any)?.mapper : mapper) ?? mapper;
    children = (children?.["@mapped"] ? (children as any)?.children : children) ?? children;
    observe(children, (op, ...args)=>{
        const element = ref.deref(); if (!element) return;
        if (op == "@set")   { replaceChildren(element, args[1], args[0], mapper); } // TODO: replace group
        if (op == "push")   { appendChild(element, args[0]?.[0], mapper); };
        if (op == "splice") { removeChild(element, args[2] ?? children[args[0]?.[0]], args[0]?.[0], mapper); };
        if (op == "pop")    { removeChild(element, args[2], children?.length-1, mapper); };
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
    if (!children) return element;
    const ref = new WeakRef(element);
    if (element instanceof HTMLElement) { element.innerHTML = ``; };
    mapper = (children?.["@mapped"] ? (children as any)?.mapper : mapper) ?? mapper;
    (children = (children?.["@mapped"] ? (children as any)?.children : children) ?? children).map((nd)=>{
        const element = ref.deref(); if (!element) return nd;
        appendChild(element, nd, mapper); return nd;
    });
    return element;
}
