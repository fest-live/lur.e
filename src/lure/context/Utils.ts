import { unwrap, subscribe } from "fest/object";
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
const elMap = new WeakMap();
export const $getNode = (E, mapper?: Function, index?: number) => {
    if (E instanceof WeakRef) { E = E.deref(); }
    if (mapper != null) { return (E = getNode(mapper?.(E, index))); }
    if (E instanceof Node || E instanceof Text || E instanceof HTMLElement || E instanceof DocumentFragment) { return E; } else
    if (typeof E?.value == "string" || typeof E?.value == "number") { return T(E); } else
    if (typeof E == "function") { return getNode(E()); } else  // mapped arrays always empties after
    if (typeof E == "string" || typeof E == "number") { return document.createTextNode(String(E)); } else
    if (typeof E == "object" && E != null) { return E?.element ?? elMap.get(E); }; return E;
};

//
export const getNode = (E, mapper?: Function, index?: number)=>{
    if (E instanceof WeakRef) { E = E.deref(); }
    if ((typeof E == "object" || typeof E == "function") && !(E instanceof Node || E instanceof Text || E instanceof HTMLElement || E instanceof DocumentFragment)) {
        if (elMap.has(E)) { const obj: any = elMap.get(E); return (obj instanceof WeakRef ? obj?.deref?.() : obj) ?? $getNode(E, mapper, index); };
        const $node = $getNode(E, mapper, index);
        if (!mapper && $node != null && $node != E && (!E?.self && !E?.element || !(typeof E?.self == "object" || typeof E?.self == "function"))) { elMap.set(E, $node); }
        return $node;
    }
    return $getNode(E, mapper, index);
}

//
export const appendChild = (element, cp, mapper?) => {
    if (mapper != null) { cp = mapper?.(cp) ?? cp; }
    if (cp?.children && Array.isArray(unwrap(cp?.children)) && !(cp?.[$virtual] || cp?.[$mapped])) { element?.append?.(...(unwrap(cp?.children)?.map?.((cl, _: number) => (getNode(cl) ?? ""))?.filter?.((el) => el != null) ?? unwrap(cp?.children))); } else
        if (Array.isArray(unwrap(cp))) { element?.append?.(...unwrap(cp?.map?.((cl, _: number) => (getNode(cl) ?? ""))?.filter?.((el) => el != null) ?? unwrap(cp))); } else { const node = getNode(cp); if (node != null && (!node?.parentNode || node?.parentNode != element)) { element?.append?.(node); } }
}

//
export const replaceChildren = (element, cp, mapper?, index?) => {
    if (mapper != null) { cp = mapper?.(cp) ?? cp; }
    const cn = index >= 0 ? element?.childNodes?.[index] : null;
    if (cn instanceof Text && typeof cp == "string") { cn.textContent = cp; } else {
        const node = getNode(cp);
        if (cn instanceof Text && node instanceof Text) { if (cn.textContent != node.textContent) { cn.textContent = node.textContent; } } else
            if (cn != node && (!node?.parentNode || node?.parentNode != element)) { cn?.replaceWith?.(node); }
    }
}

//
export const removeChild = (element, cp, mapper?, index = -1) => {
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
export const removeNotExists = (element, children, mapper?) => {
    const list = Array.from(unwrap(children) || [])?.map?.((cp) => getNode(mapper?.(cp) ?? cp));
    Array.from(element.childNodes).forEach((nd: any) => { if (!list?.find?.((cp) => (cp === nd))) nd?.remove?.(); });
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
