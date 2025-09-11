import { unwrap, subscribe, isNotEqual } from "fest/object";
import { $virtual, $mapped } from "../core/Binding";

//
const
    MATCH = '(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)',
    REGEX = '^(?:' + MATCH + ')|^#' + MATCH + '|^\\.' + MATCH + '|^\\[' + MATCH + '(?:([*$|~^]?=)(["\'])((?:(?=(\\\\?))\\8.)*?)\\6)?\\]';

//
export const camelToKebab = (str) => { return str?.replace?.(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(); }
export const kebabToCamel = (str) => { return str?.replace?.(/-([a-z])/g, (_, char) => char.toUpperCase()); }

//
export const createElement = (selector): HTMLElement | DocumentFragment => {
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
const isElement = (el: any) => { return el instanceof Node || el instanceof Text || el instanceof Element || el instanceof HTMLElement || el instanceof DocumentFragment; }
const isElementValue = (el: any) => { return el?.element ?? el?.value; }

//
const elMap = new WeakMap();
export const $getNode = (el, mapper?: Function | null, index?: number) => {
    if (el instanceof WeakRef) { el = el.deref() ?? el; }
    if (mapper != null) { return (el = getNode(mapper?.(el, index) ?? el)); }
    if (isElement(el)) { return el; } else
    if (isElement(el?.element ?? el?.value)) { return isElementValue(el); } else
    if (typeof el?.value == "string" || typeof el?.value == "number") { return T(el); } else
    if (typeof el == "function") { return getNode(el()); } else  // mapped arrays always empties after
    if (typeof el == "string" || typeof el == "number") { return document.createTextNode(String(el)); } else
    if (typeof el == "object" && el != null) { return el?.element ?? elMap.get(el); }; return el;
};

// (obj instanceof WeakRef ? obj?.deref?.() : obj)
export const getNode = (el, mapper?: Function | null, index?: number) => {
    if (el instanceof WeakRef) { el = el.deref() ?? el; }
    if ((typeof el == "object" || typeof el == "function") && !isElement(el)) {
        if (elMap.has(el)) { const obj: any = elMap.get(el) ?? $getNode(el, mapper, index); return (obj instanceof WeakRef ? obj?.deref?.() : obj); };
        const $node = $getNode(el, mapper, index);
        if (!mapper && $node != null && $node != el && (!el?.self && !el?.element)) { elMap.set(el, $node); }
        return $node;
    }
    return $getNode(el, mapper, index);
}

//
export const appendFix = (parent: any, child: any) => {
    if (!isElement(child) || parent == child) return;
    child = (child as any)?.element ?? child;
    if (!child?.parentNode) { parent?.append?.(child); return; };
    if (parent?.parentNode == child?.parentNode) { return; }
    child?.remove?.(); parent?.append?.(child);
}

//
export const appendArray = (parent: any, children: any[], mapper?: Function | null) => {
    if (Array.isArray(unwrap(children))) {
        children
            ?.map?.((cl, _: number) => getNode(cl, mapper))
            ?.filter?.((el) => el != null)
            ?.forEach?.((el) => appendFix(parent, el));
    } else {
        const node = getNode(children, mapper);
        if (node != null) { appendFix(parent, node); }
    }
}

//
export const appendChild = (element, cp, mapper?: Function | null) => {
    if (mapper != null) { cp = mapper?.(cp) ?? cp; }

    // has children lists
    if (cp?.children && Array.isArray(unwrap(cp?.children)) && (cp?.[$virtual] || cp?.[$mapped])) {
        appendArray(element, cp?.children);
    } else {
        appendArray(element, cp);
    }
}

//
export const replaceChildren = (element, cp, mapper?: Function | null, index: number = -1) => {
    if (mapper != null) { cp = mapper?.(cp) ?? cp; }
    const cn = index >= 0 ? element?.childNodes?.[index] : cp?.parentNode; // @ts-ignore
    if (cn instanceof Text && typeof cp == "string") { cn.textContent = cp; } else
        if (cp != null) {
        const node = getNode(cp);
            const cn = index >= 0 ? element?.childNodes?.[index] : cp?.parentNode; // @ts-ignore
            if (cn instanceof Text && node instanceof Text) {
                if (cn.textContent != node.textContent) { cn.textContent = node.textContent; }
            } else
            if (cn != node && (!node?.parentNode || node?.parentNode != element)) { cn?.replaceWith?.(node); }
    }
}

//
export const removeChild = (element, cp, mapper?: Function | null, index: number = -1) => {
    element = element?.element ?? element;
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
export const removeNotExists = (element, children, mapper?: Function | null) => {
    const list = Array.from(unwrap(children) || [])?.map?.((cp) => getNode(mapper?.(cp) ?? cp));
    Array.from(element.childNodes).forEach((nd: any) => { if (!list?.find?.((cp) => (!isNotEqual?.(cp, nd)))) nd?.remove?.(); });
    return element;
}

//
export const T = (ref) => {
    // @ts-ignore // !experimental `getOrInsert` feature!
    return elMap.getOrInsertComputed(ref, () => {
        const element = document.createTextNode(String(ref?.value ?? ""));
        subscribe([ref, "value"], (val) => (element.textContent = val));
        return element;
    });
}

//
export default getNode;
