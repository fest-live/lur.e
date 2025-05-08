//
import { observe, importCdn } from "./Array.js";
import { appendChild, removeChild, removeChildIndep, replaceChildren } from "./DOM.js";

// @ts-ignore
const { subscribe } = await Promise.try(importCdn, ["/externals/lib/object.js"]);

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
                // CSSStyleValue is internally reactive itself!
                element.attributeStyleMap.set(kebab, value);

                // bred, changing `.value` in CSSStyleValue isn't change value again
                /*if (value instanceof CSSUnitValue) {
                    if (old != null && value.unit && value.unit !== old?.unit) {
                        element.attributeStyleMap.set(kebab, value);
                    } else { old.value = value.value; }
                } else {
                    element.attributeStyleMap.set(kebab, value);
                }*/
            }
        } else {
            element.style.setProperty(kebab, value.toString(), "");
        }
    } else // very specific case if number and unit value can be changed directly
    if (!Number.isNaN(value?.value ?? value) && element.attributeStyleMap != null) {
        const numeric = value?.value ?? value;
        const kebab = camelToKebab(name);
        const old = element.attributeStyleMap.get(kebab);
        if (old instanceof CSSUnitValue) { old.value = numeric; } else
        {   // hard-case
            const computed = element.computedStyleMap();
            const oldCmVal = computed.get(kebab);
            if (oldCmVal instanceof CSSUnitValue) {
                if (oldCmVal.value != numeric) {
                    oldCmVal.value = numeric;
                    element.attributeStyleMap.set(kebab, oldCmVal);
                }
            } else {
                element.style.setProperty(kebab, numeric);
            }
        }
    } else {
        element.style[kebabToCamel(name)] = (value?.value ?? value);
    }
}

//
const handleStyleChange = (element, prop, value)=>{
    if (!prop || typeof prop != "string") return;

    //
    if (typeof value == "undefined" || value == null) {
        deleteStyleProperty(element, prop);
    } else // non-object, except Typed OM
    if ((typeof value != "object" && typeof value != "function") || value instanceof CSSStyleValue) {
        setStyleProperty(element, prop, value);
    } else
    if (value?.value != null && (typeof value.value != "object" && typeof value.value != "function")) {
        setStyleProperty(element, prop, value.value);
    } else { // any invalid type is deleted value
        console.warn(`Invalid value for style property "${prop}":`, value);
        deleteStyleProperty(element, prop);
    }
}

//
const handleAttribute = (element, prop, value)=>{
    if (!prop) return;
    if (element.getAttribute(prop) !== value) {
        if (typeof value == "undefined" || value == null) {
            element.removeAttribute(prop);
        } else
        if (typeof value != "object" && typeof value != "function") {
            element.setAttribute(prop, value);
        } else
        if (value?.value != null && (typeof value?.value != "object" && typeof value?.value != "function")) {
            element.setAttribute(prop, value.value);
        } else { // any invalid type is deleted value
            console.warn(`Invalid type of attribute value "${prop}":`, value);
            element.removeAttribute(prop);
        }
    }
}

//
const handleDataset = (element, prop, value)=>{
    if (!prop) return;
    if (element.dataset[prop] !== value) {
        if (typeof value == "undefined" || value == null) {
            delete element.dataset[prop];
        } else
        if (typeof value != "object" && typeof value != "function") {
            element.dataset[prop] = value;
        } else
        if (value?.value != null && (typeof value?.value != "object" && typeof value?.value != "function")) {
            element.dataset[prop] = value.value;
        } else { // any invalid type is deleted value
            console.warn(`Invalid type of attribute value "${prop}":`, value);
            delete element.dataset[prop];
        }
    }
}



//
export const reflectAttributes = (element: HTMLElement, attributes: any)=>{
    if (!attributes) return;

    //
    const weak = new WeakRef(attributes);
    const wel = new WeakRef(element);
    if (typeof attributes == "object" || typeof attributes == "function") {
        subscribe(attributes, (value, prop)=>{
            handleAttribute(wel?.deref?.(), prop, value);

            // subscribe with value with `value` reactivity
            if (value?.value != null) {
                let controller: AbortController|null = null;
                subscribe([value, "value"], (curr, _, old) => {
                    controller?.abort?.(); controller = new AbortController();
                    // sorry, we doesn't allow abuse that mechanic
                    if (weak?.deref?.()?.[prop] === value || !(weak?.deref?.())) {
                        if (typeof value?.behavior == "function") {
                            value?.behavior?.([curr, (value = curr)=>handleAttribute(wel?.deref?.(), prop, value), old], [prop, controller?.signal, wel]);
                        } else {
                            handleAttribute(wel?.deref?.(), prop, curr);
                        }
                    }
                });
            }
        })
    } else {
        console.warn("Invalid attributes object:", attributes);
    }

    // bi-directional attribute
    const config = { attributeOldValue: true, attributes: true, childList: false, subtree: false };
    const callback = (mutationList, _) => {
        for (const mutation of mutationList) {
            if (mutation.type == "attributes") {
                const key = mutation.attributeName;
                const value = mutation.target.getAttribute(key);
                if (value !== mutation.oldValue) { // one-shot update (only valid when attribute is really changes)
                    if (attributes[key] != null && (attributes[key]?.value != null || (typeof attributes[key] == "object" || typeof attributes[key] == "function"))) {
                        if (attributes[key]?.value !== value) { attributes[key].value = value; }
                    } else
                    if (attributes[key] !== value) {
                        attributes[key] = value;
                    }
                }
            }
        }
    };

    //
    const observer = new MutationObserver(callback);
    observer.observe(element, config);
}

//
export const reflectDataset = (element: HTMLElement, attributes: any)=>{
    if (!attributes) return;

    //
    const weak = new WeakRef(attributes);
    const wel = new WeakRef(element);
    if (typeof attributes == "object" || typeof attributes == "function") {
        subscribe(attributes, (value, prop)=>{
            handleDataset(wel?.deref?.(), prop, value);

            // subscribe with value with `value` reactivity
            if (value?.value != null) {
                subscribe([value, "value"], (curr) => {
                    // sorry, we doesn't allow abuse that mechanic
                    if (weak?.deref?.()?.[prop] === value || !(weak?.deref?.())) {
                        handleDataset(wel?.deref?.(), prop, curr);
                    }
                });
            }
        })
    } else {
        console.warn("Invalid dataset object:", attributes);
    }
}

// TODO! support observe styles
export const reflectStyles = (element: HTMLElement, styles: string|any)=>{
    if (!styles) return;

    //
    if (typeof styles == "string") { element.style.cssText = styles; } else
    if (typeof styles?.value == "string") { subscribe([styles, "value"], (val) => { element.style.cssText = val; }); } else
    if (typeof styles == "object" || typeof styles == "function") {
        const weak = new WeakRef(styles);
        const wel = new WeakRef(element);

        //
        subscribe(styles, (value, prop)=>{
            if (wel?.deref?.()?.style[kebabToCamel(prop)] !== value) {
                handleStyleChange(wel?.deref?.(), prop, value);
            }

            // subscribe with value with `value` reactivity (TypedOM isn't valid)
            if (value?.value != null && !(value instanceof CSSStyleValue)) {
                let controller: AbortController|null = null;
                subscribe([value, "value"], (curr, _, old) => {
                    controller?.abort?.(); controller = new AbortController();
                    // sorry, we doesn't allow abuse that mechanic
                    if (weak?.deref?.()?.[prop] === value || !(weak?.deref?.())) {
                        if (typeof value?.behavior == "function") {
                            value?.behavior?.([curr, (value = curr)=>handleStyleChange(wel?.deref?.(), prop, value), old], [prop, controller?.signal, wel]);
                        } else {
                            handleStyleChange(wel?.deref?.(), prop, curr);
                        }
                    }
                });
            }
        });
    } else {
        console.warn("Invalid styles object:", styles);
    }
}

// one-shot update
export const reflectWithStyleRules = async (element: HTMLElement, rule: any)=>{
    const styles = await rule?.(element);
    return reflectStyles(element, styles);
}

//
export const reflectProperties = (element: HTMLElement, properties: any)=>{
    if (!properties) return;

    //
    const weak = new WeakRef(properties);
    const wel = new WeakRef(element);
    subscribe(properties, (value, prop)=>{
        if (value?.value != null) {
            subscribe([value, "value"], (curr) => {
                const el = wel?.deref?.();
                // sorry, we doesn't allow abuse that mechanic
                if ((weak?.deref?.()?.[prop] === value || !(weak?.deref?.())) && el) {
                    if (typeof curr == "undefined") { delete el[prop]; } else { el[prop] = curr; }
                }
            });
        } else {
            const el = wel?.deref?.();
            if (el && el?.[prop] !== value) {
                if (typeof value == "undefined") { delete el[prop]; } else { el[prop] = value; }
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
    if (Array.isArray(children) || (children as any)?.length != null) observe(children, (op, ...args)=>{
        const element = ref.deref(); if (!element) return;
        if (children?.length == 0 && element instanceof HTMLElement) { element.innerHTML = ``; };
        if (op == "@set")   { replaceChildren(element, args[1], args[0], mapper); } // TODO: replace group
        if (op == "splice") { removeChild(element, args[2] ?? children[args[0]?.[0]], args[0]?.[0], mapper); };
        if (op == "pop")    { removeChild(element, args[2], children?.length-1, mapper); };
        if (op == "push")   { appendChild(element, args[0]?.[0], mapper); };
    }); else
    subscribe(children, (obj, _, has)=>{
        const element = ref.deref(); if (!element) return;
        if ((children as any)?.size == 0 && element instanceof HTMLElement) { element.innerHTML = ``; };
        if (obj == null && has != null) { removeChildIndep(element, obj ?? has, mapper); };
        if (obj != null && has == null) { appendChild(element, obj ?? has, mapper); };
    });
}

// TODO! observable classList
export const reflectClassList = (element: HTMLElement, classList?: Set<string>)=>{
    if (!classList) return;
    const wel = new WeakRef(element);
    subscribe(classList, (value: string)=>{
        const el = wel?.deref?.();
        if (el) {
            if (typeof value == "undefined" || value == null) {
                if (el.classList.contains(value)) { el.classList.remove(value); }
            } else {
                if (!el.classList.contains(value)) { el.classList.add(value); }
            }
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
