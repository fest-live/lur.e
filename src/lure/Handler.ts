import { setStyleProperty } from "u2re/dom";

//
export const deleteStyleProperty = (element, name)=>{ element.style.removeProperty(camelToKebab(name)); }
export const camelToKebab  = (str) => { return str?.replace?.(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(); }
export const kebabToCamel  = (str) => { return str?.replace?.(/-([a-z])/g, (_, char) => char.toUpperCase()); }

//
export const handleDataset = (element, prop, value)=>{
    if (!prop) return; prop = kebabToCamel(prop) || prop;
    if (element.dataset[prop] !== value) {
        if (typeof value == "undefined" || value == null || value === false) { delete element.dataset[prop]; } else
        if (typeof value != "object" && typeof value != "function") { element.dataset[prop] = value; } else
        if (value?.value != null && value?.value !== false && (typeof value?.value != "object" && typeof value?.value != "function"))
            { element.dataset[prop] = value.value; } else // any invalid type is deleted value
            { delete element.dataset[prop]; if (value?.value !== false) console.warn(`Invalid type of attribute value "${prop}":`, value); }
    }
}

//
export const handleStyleChange = (element, prop, value)=>{
    if (!prop || typeof prop != "string") return;
    if (typeof value == "undefined" || value == null) { deleteStyleProperty(element, prop); } else // non-object, except Typed OM
    if ((typeof value != "object" && typeof value != "function") || value instanceof CSSStyleValue)
        { setStyleProperty(element, prop, value); } else
    if (value?.value != null && (typeof value.value != "object" && typeof value.value != "function"))
        { setStyleProperty(element, prop, value.value); } else // any invalid type is deleted value
        { deleteStyleProperty(element, prop); if (value?.value !== false) console.warn(`Invalid value for style property "${prop}":`, value); }
}

//
export const handleAttribute = (element, prop, value)=>{
    if (!prop) return; prop = camelToKebab(prop) || prop;
    if (element.getAttribute(prop) !== value) {
        if (typeof value == "undefined" || value == null || value === false) { element.removeAttribute(prop); } else
        if (typeof value != "object" && typeof value != "function") { element.setAttribute(prop, value); } else
        if (value?.value != null && value?.value !== false && (typeof value?.value != "object" && typeof value?.value != "function"))
            { element.setAttribute(prop, value.value); } else  // any invalid type is deleted value
            { element.removeAttribute(prop); if (value?.value !== false) console.warn(`Invalid type of attribute value "${prop}":`, value); }
    }
}
