import { unwrap, subscribe } from "fest/object";
import { $virtual, $mapped } from "../core/Binding";
import { isElement, isValidParent } from "fest/dom";
import { hasValue, isNotEqual, isPrimitive } from "fest/core";
import C from "../node/Changeable";

//
export const KIDNAP_WITHOUT_HANG = (el: any, requestor: any | null) => {
    return ((requestor && requestor != el && !el?.contains?.(requestor) && isValidParent(requestor)) ? el?.elementForPotentialParent?.(requestor) : null) ?? el?.element;
}

//
export const isElementValue = (el: any, requestor?: any | null) => { return KIDNAP_WITHOUT_HANG(el, requestor) ?? (hasValue(el) && isElement(el?.value) ? el?.value : el); }

//
export const elMap = new WeakMap();
export const tmMap = new WeakMap();

//
const getMapped = (obj: any)=>{
    if (isPrimitive(obj)) return obj;
    if (hasValue(obj) && isPrimitive(obj?.value)) return tmMap?.get(obj);
    return elMap?.get?.(obj);
}

//
export const $getBase = (el, mapper?: Function | null, index: number = -1, requestor?: any | null)=>{
    if (el instanceof WeakRef) { el = el.deref() ?? el; }
    if (mapper != null) { return (el = $getBase(mapper?.(el, index), null, -1, requestor)); }
    if (isElement(el) && !el?.element) { return el; } else
    if (isElement(el?.element)) { return el; } else
    if (hasValue(el)) { return C(el); } else
    if (typeof el == "object" && el != null) { return getMapped(el); } else
    if (typeof el == "function") { return $getBase(el?.(), mapper, index, requestor); }  // mapped arrays always empties after
    if (isPrimitive(el) && el != null) return T(el);
    return null;
}

//
const isValidElement = (el)=>{
    return (isValidParent(el) || (el instanceof DocumentFragment) || (el instanceof Text)) ? el : null;
}

//
export const $getLeaf = (el, requestor?: any | null)=>{
    return isElementValue(el, requestor) ?? isElement(el);
}

//
export const $getNode = (el, mapper?: Function | null, index: number = -1, requestor?: any | null) => {
    if (el instanceof WeakRef) { el = el.deref() ?? el; }
    if (mapper != null) { return (el = getNode(mapper?.(el, index), null, -1, requestor)); }
    if (isElement(el) && !el?.element) { return el; } else
    if (isElement(el?.element)) { return isElementValue(el, requestor); } else
    if (hasValue(el)) { return C(el)?.element; } else
    if (typeof el == "object" && el != null) { return getMapped(el); } else
    if (typeof el == "function") { return getNode(el?.(), mapper, index, requestor); } else
    if (isPrimitive(el) && el != null) return T(el);
    return null;
};

// (obj instanceof WeakRef ? obj?.deref?.() : obj)
export const getNode = (el, mapper?: Function | null, index: number = -1, requestor?: any | null) => {
    if (el instanceof WeakRef) { el = el.deref() ?? el; }
    if ((typeof el == "object" || typeof el == "function") && !isElement(el)) {
        if (elMap.has(el)) {
            const obj: any = getMapped(el) ?? $getBase(el, mapper, index, requestor);
            return $getLeaf(obj instanceof WeakRef ? obj?.deref?.() : obj, requestor);
        };
        const $node = $getBase(el, mapper, index, requestor);
        if (!mapper && $node != null && $node != el && (typeof el == "object" || typeof el == "function") && !isElement(el)) { elMap.set(el, $node); }
        return $getLeaf($node, requestor);
    }
    return $getNode(el, mapper, index, requestor);
}

//
const appendOrEmplaceByIndex = (parent: any, child: any, index: number = -1) => {
    if (isElement(child) && child != null) {
        if (index >= 0 && index < parent?.childNodes?.length) {
            parent?.insertBefore?.(child, parent?.childNodes?.[index]);
        } else {
            parent?.append?.(child);
        }
    }
}

//
export const appendFix = (parent: any, child: any, index: number = -1) => {
    if (!isElement(child) || parent == child) return;
    child = (child as any)?._onUpdate ? KIDNAP_WITHOUT_HANG(child, parent) : child;
    if (!child?.parentNode && child instanceof Node) { appendOrEmplaceByIndex(parent, child, index); return; };
    if (parent?.parentNode == child?.parentNode) { return; }
    if (child instanceof Node) { /*(child as any)?.remove?.();*/ appendOrEmplaceByIndex(parent, child, index); };
}

//
export const appendArray = (parent: any, children: any[], mapper?: Function | null, index: number = -1) => {
    const len = children?.length ?? 0;
    if (Array.isArray(unwrap(children))) {
        children
            ?.map?.((cl, _: number) => getNode(cl, mapper, len, parent))
            ?.filter?.((el) => el != null)
            ?.forEach?.((el) => appendFix(parent, el, index));
    } else {
        const node = getNode(children, mapper, len, parent);
        if (node != null) { appendFix(parent, node, index); }
    }
}

//
export const appendChild = (element, cp, mapper?: Function | null, index: number = -1) => {
    if (mapper != null) { cp = mapper?.(cp, index); }

    // has children lists
    if (cp?.children && Array.isArray(unwrap(cp?.children)) && (cp?.[$virtual] || cp?.[$mapped])) {
        appendArray(element, cp?.children, null, index);
    } else {
        appendArray(element, cp, null, index);
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
export const replaceChildren = (element, cp, mapper?: Function | null, index: number = -1, old?: any|null) => {
    if (mapper != null) { cp = mapper?.(cp, index); }
    const cn = dePhantomNode(element, getNode(old, null, index), index);
    if (cn instanceof Text && typeof cp == "string") { cn.textContent = cp; } else
    if (cp != null) {
        const node = getNode(cp); // oldNode is always unknown and phantom
        if (cn?.parentNode != element && cn != node && cn != null) {
            if (cn instanceof Text && node instanceof Text) {
                if (cn?.textContent != node?.textContent) { cn.textContent = node?.textContent ?? ""; }
            } else
            if (cn != node && (!node?.parentNode || node?.parentNode != element) && node != null) { cn?.replaceWith?.(node); }
        } else { appendChild(element, node, null, index); }
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
    if (isPrimitive(ref) && ref != null)
        { return document.createTextNode(ref); }
    if (ref == null) return;

    // @ts-ignore
    return tmMap.getOrInsertComputed(ref, () => {
        const element = document.createTextNode((hasValue(ref) ? ref?.value : ref) ?? "");
        subscribe([ref, "value"], (val) => {
            (element.textContent = val?.innerText ?? val?.textContent ?? val ?? "")
        });
        return element;
    });
}

//
export default getNode;
