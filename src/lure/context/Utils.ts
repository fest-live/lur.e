import { unwrap, subscribe, isNotEqual } from "fest/object";
import { $virtual, $mapped } from "../core/Binding";
import { M } from "fest/lure/index";

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
const isValidParent = (parent: Node) => {
    return (parent != null && parent instanceof HTMLElement && !(parent instanceof DocumentFragment || parent instanceof HTMLBodyElement));
}

//
const KINDNAP_WITHOUT_HANG = (el: any, requestor: any | null) => {
    return ((requestor && requestor != el && !el?.contains?.(requestor) && isValidParent(requestor)) ? el?.elementForPotentialParent?.(requestor) : null) ?? el?.element;
}

//
const isElement = (el: any) => { return el != null && (el instanceof Node || el instanceof Text || el instanceof Element || el instanceof HTMLElement || el instanceof DocumentFragment) ? el : null; }
const isElementValue = (el: any, requestor?: any | null) => { return KINDNAP_WITHOUT_HANG(el, requestor) ?? el?.value; }

//
const elMap = new WeakMap();
export const $getNode = (el, mapper?: Function | null, index: number = -1, requestor?: any | null) => {
    if (el instanceof WeakRef) { el = el.deref() ?? el; }
    if (mapper != null) { return (el = getNode(mapper?.(el, index), null, -1, requestor)); }
    if (isElement(el) && !el?.element) { return el; } else
    if (isElement(el?.element)) { return el?.element || null; } else
    if (typeof el?.value == "string" || typeof el?.value == "number") { return T(el); } else
    if (typeof el == "string" || typeof el == "number") { return document.createTextNode(String(el)); } else
    if (typeof el == "object" && el != null) { return elMap.get(el); } else
    if (typeof el == "function") { return getNode(el?.(), mapper, index, requestor); }  // mapped arrays always empties after
    return null;
};

// (obj instanceof WeakRef ? obj?.deref?.() : obj)
export const getNode = (el, mapper?: Function | null, index: number = -1, requestor?: any | null) => {
    if (el instanceof WeakRef) { el = el.deref() ?? el; }
    if ((typeof el == "object" || typeof el == "function") && !isElement(el)) {
        if (elMap.has(el)) {
            const obj: any = elMap.get(el) ?? $getNode(el, mapper, index, requestor);
            return (obj instanceof WeakRef ? obj?.deref?.() : obj);
        };
        const $node = $getNode(el, mapper, index, requestor);
        if (!mapper && $node != null && $node != el && (!el?.self && !el?.element)) { elMap.set(el, $node); }
        return $node;
    }
    return $getNode(el, mapper, index, requestor);
}

//
export const appendFix = (parent: any, child: any) => {
    if (!isElement(child) || parent == child) return;
    child = (child as any)?._onUpdate ? KINDNAP_WITHOUT_HANG(child, parent) : child;
    if (!child?.parentNode && child instanceof Node) { parent?.append?.(child); return; };
    if (parent?.parentNode == child?.parentNode) { return; }
    if (child instanceof Node) { /*(child as any)?.remove?.();*/ parent?.append?.(child); };
}

//
export const appendArray = (parent: any, children: any[], mapper?: Function | null) => {
    const len = children?.length ?? 0;
    if (Array.isArray(unwrap(children))) {
        children
            ?.map?.((cl, _: number) => getNode(cl, mapper, len, parent))
            ?.filter?.((el) => el != null)
            ?.forEach?.((el) => appendFix(parent, el));
    } else {
        const node = getNode(children, mapper, len, parent);
        if (node != null) { appendFix(parent, node); }
    }
}

//
export const appendChild = (element, cp, mapper?: Function | null, index: number = -1) => {
    if (mapper != null) { cp = mapper?.(cp, index); }

    // has children lists
    if (cp?.children && Array.isArray(unwrap(cp?.children)) && (cp?.[$virtual] || cp?.[$mapped])) {
        appendArray(element, cp?.children);
    } else {
        appendArray(element, cp, null);
    }
}



//
export const dePhantomNode = (parent, node, index: number = -1)=>{
    if (node?.parentNode != parent && !isValidParent(node?.parentNode)) {
        if (index >= 0 && Array.from(parent.childNodes || [])?.length > index) {
            return parent.childNodes?.[index];
        }
    }
    if (node?.parentNode == parent) {
        return node;
    }
    return null;
}



// TODO: what exactly to replace, if has (i.e. object itself, not index)
export const replaceChildren = (element, cp, mapper?: Function | null, index: number = -1) => {
    if (mapper != null) { cp = mapper?.(cp, index); }
    const cn = index >= 0 ? element?.childNodes?.[index] : null; // @ts-ignore
    if (cn instanceof Text && typeof cp == "string" && cn != null) { cn.textContent = cp; } else
    if (cp != null) {
        const node = getNode(cp), oldNode = null; // oldNode is always unknown and phantom
        const cn = dePhantomNode(element, oldNode, index)

        if (cn != node) {
            if (cn instanceof Text && node instanceof Text) {
                if (cn.textContent != node.textContent) { cn.textContent = node.textContent; }
            } else
            if (cn != node && (!node?.parentNode || node?.parentNode != element)) { cn?.replaceWith?.(node); }
        }
    }
}

//
export const removeChildDirectly = (element, node, _?: Function | null, index: number = -1) => {
    if (Array.from(element?.childNodes ?? [])?.length < 1) return;
    const whatToRemove = dePhantomNode(element, node, index);
    if (whatToRemove?.parentNode == element) whatToRemove?.remove?.();
    return element;
}

//
export const removeChild = (element, cp, mapper?: Function | null, index: number = -1) => {
    if (Array.from(element?.childNodes ?? [])?.length < 1) return;
    const whatToRemove = dePhantomNode(element, getNode(cp, mapper), index);
    if (whatToRemove?.parentNode == element) whatToRemove?.remove?.();
    return element;
}

//
export const removeNotExists = (element, children, mapper?: Function | null) => {
    const list = Array.from(unwrap(children) || [])?.map?.((cp, index) => getNode(cp, mapper, index));
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
