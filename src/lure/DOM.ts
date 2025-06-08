// @ts-ignore /* @vite-ignore */
import { unwrap, makeReactive, subscribe } from "u2re/object";

// @ts-ignore /* @vite-ignore */
import { setStyleProperty } from "u2re/dom";

//
const
	MATCH = '(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)',
	REGEX = '^(?:' + MATCH + ')|^#' + MATCH + '|^\\.' + MATCH + '|^\\[' + MATCH + '(?:([*$|~^]?=)(["\'])((?:(?=(\\\\?))\\8.)*?)\\6)?\\]';

//
export class Tx {
    ref: any; constructor(ref) { this.ref = ref || makeReactive({ value: null }); }
    get ["@virtual"]() { return true; };
    get value() { return this.ref?.value; }
    set value(val: any) { this.ref.value = val; }
    get children() { return null; };
    get element(): HTMLElement|DocumentFragment|Text {
        if (elMap.has(this)) { const el = elMap.get(this); if (el) { return el; }; }

        //
        const element = new Text();
        subscribe([this.ref, "value"], (val)=>(element.textContent = val));
        elMap.set(this, element);
        return element;
    }
}

//
export const deleteStyleProperty = (element, name)=>{ element.style.removeProperty(camelToKebab(name)); }
export const camelToKebab  = (str) => { return str?.replace?.(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(); }
export const kebabToCamel  = (str) => { return str?.replace?.(/-([a-z])/g, (_, char) => char.toUpperCase()); }
export const createElement = (selector): HTMLElement|DocumentFragment => {
    if (selector == ":fragment:") return document.createDocumentFragment();
    const create = document.createElement.bind(document);
    for (var node: any = create('div'), match, className = ''; selector && (match = selector.match(REGEX));) {
        if (match[1]) node = create(match[1]);
        if (match[2]) node.id = match[2];
        if (match[3]) className += ' ' + match[3];
        if (match[4]) node.setAttribute(match[4], match[7] || '');
        selector = selector.slice(match[0].length);
    }
    if (className) node.className = className.slice(1);
    return node;
};

//
export const elMap   = new WeakMap<any, HTMLElement|DocumentFragment|Text>();
export const getNode = (E, mapper?: Function, index?: number)=>{
    if (mapper) { return (E = getNode(mapper?.(E, index))); }
    if (E instanceof Node || E instanceof Text || E instanceof HTMLElement || E instanceof DocumentFragment) { return E; } else
    if (typeof E?.value == "string" || typeof E?.value == "number") { return new Tx(E)?.element; } else
    if (typeof E == "function") { return getNode(E()); } else  // mapped arrays always empties after
    if (typeof E == "string" || typeof E == "number") { return document.createTextNode(String(E)); } else
    if (typeof E == "object" && E != null) { return E?.element ?? elMap.get(E); }
    return E;
}

//
export const appendChild = (element, cp, mapper?)=>{
    if (mapper) { cp = mapper?.(cp) ?? cp; }
    if (cp?.children && Array.isArray(unwrap(cp?.children)) && !(cp?.["@virtual"] || cp?.["@mapped"]))
        { element?.append?.(...(unwrap(cp?.children)?.map?.((cl, _: number)=>(getNode(cl)??""))?.filter?.((el)=>el!=null) ?? unwrap(cp?.children))); } else
    if (Array.isArray(unwrap(cp)))
        { element?.append?.(...unwrap(cp?.map?.((cl, _: number)=>(getNode(cl)??""))?.filter?.((el)=>el!=null) ?? unwrap(cp))); } else
        { const node = getNode(cp); if (node != null && (!node?.parentNode || node?.parentNode != element)) { element?.append?.(node); } }
}

// when possible, don't create new Text nodes
export const replaceChildren = (element, cp, index, mapper?)=>{
    if (mapper) { cp = mapper?.(cp) ?? cp; }
    const cn = element?.childNodes?.[index];
    if (cn instanceof Text && typeof cp == "string") { cn.textContent = cp; } else {
        const node = getNode(cp);
        if (cn instanceof Text && node instanceof Text) { if (cn.textContent != node.textContent) { cn.textContent = node.textContent; } } else
        if (cn != node && (!node?.parentNode || node?.parentNode != element)) { cn?.replaceWith?.(node); }
    }
}

//
export const removeChild = (element, cp, mapper?, index = -1)=>{
    if (element?.childNodes?.length < 1) return;
    const node = getNode(cp = mapper?.(cp) ?? cp);
    const ch = node ?? (index >= 0 ? element?.childNodes?.[index] : null);
    if (ch?.parentNode == element) { ch?.remove?.(); } else
    if (ch?.children && ch?.children?.length >= 1) { // TODO: remove by same string value
        ch?.children?.forEach?.(c => { const R = (elMap.get(c) ?? c); if (R == element?.parentNode) R?.remove?.(); });
    } else { (ch)?.remove?.(); }
    return element;
}

//
export const removeNotExists = (element, children, mapper)=>{
    const uw = Array.from(unwrap(children))?.map?.((cp)=>getNode(mapper?.(cp) ?? cp));
    Array.from(element.childNodes).forEach((nd: any)=>{ if (uw!?.find?.((cp)=>(cp == nd))) nd?.remove?.(); });
    return element;
}

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
