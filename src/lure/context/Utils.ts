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
    if (mapper != null) { return (el = $getBase(mapper?.(el, index), null, -1, requestor)); }
    if (el instanceof WeakRef || typeof (el as any)?.deref == "function") { el = el.deref(); } // promise unsupported
    if (el instanceof Promise || typeof (el as any)?.then == "function") { return null; };
    if (isElement(el) && !el?.element) { return el; } else
    if (isElement(el?.element)) { return el; } else
    if (hasValue(el)) { return (isPrimitive(el?.value) && el?.value != null ? T(el) : C(el)); } else
    if (typeof el == "object" && el != null) { return getMapped(el); } else
    if (typeof el == "function") { return $getBase(el?.(), mapper, index, requestor); }  // mapped arrays always empties after
    if (isPrimitive(el) && el != null) return T(el);
    return null;
}

//
export const isValidElement = (el)=>{
    return (isValidParent(el) || (el instanceof DocumentFragment) || (el instanceof Text)) ? el : null;
}

//
export const $getLeaf = (el, requestor?: any | null)=>{
    return isElementValue(el, requestor) ?? isElement(el);
}

//
export const $getNode = (el, mapper?: Function | null, index: number = -1, requestor?: any | null) => {
    if (mapper != null) { return (el = getNode(mapper?.(el, index), null, -1, requestor)); }
    if (el instanceof WeakRef || typeof (el as any)?.deref == "function") { el = el.deref(); } // promise unsupported
    if (el instanceof Promise || typeof (el as any)?.then == "function") { return null; }
    if (isElement(el) && !el?.element) { return el; } else
    if (isElement(el?.element)) { return isElementValue(el, requestor); } else
    if (hasValue(el)) { return (isPrimitive(el?.value) && el?.value != null ? T(el) : C(el))?.element; } else
    if (typeof el == "object" && el != null) { return getMapped(el); } else
    if (typeof el == "function") { return getNode(el?.(), mapper, index, requestor); } else
    if (isPrimitive(el) && el != null) return T(el);
    return null;
};

//
const __nodeGuard = new WeakSet<any>();
const __getNode = (el, mapper?: Function | null, index: number = -1, requestor?: any | null)=>{
    if (el instanceof WeakRef || typeof (el as any)?.deref == "function") { el = el.deref(); }
    if (el instanceof Promise || typeof (el as any)?.then == "function") { return null; };
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
const isWeakCompatible = (el: any)=>{
    return (typeof el == "object" || typeof el == "function" || typeof el == "symbol") && el != null;
}

// (obj instanceof WeakRef ? obj?.deref?.() : obj)
export const getNode = (el, mapper?: Function | null, index: number = -1, requestor?: any | null) => {
    if (isWeakCompatible(el) && __nodeGuard.has(el)) { return getMapped(el) ?? isElement(el); }
    if (isWeakCompatible(el)) __nodeGuard.add(el); const result = __getNode(el, mapper, index, requestor);
    if (isWeakCompatible(el)) __nodeGuard.delete(el); return result;
}

/*
export const getNode = (el, mapper?: Function | null, index: number = -1, requestor?: any | null) => {
    return __getNode(el, mapper, index, requestor);
}*/

//
const appendOrEmplaceByIndex = (parent: any, child: any, index: number = -1) => {
    if (isElement(child) && child != null && child?.parentNode != parent) {
        if (Number.isInteger(index) && index >= 0 && index < parent?.childNodes?.length) {
            parent?.insertBefore?.(child, parent?.childNodes?.[index]);
        } else {
            parent?.append?.(child);
        }
    }
}

//
export const appendFix = (parent: any, child: any, index: number = -1) => {
    if (!isElement(child) || parent == child || child?.parentNode == parent) return;
    child = (child as any)?._onUpdate ? KIDNAP_WITHOUT_HANG(child, parent) : child;
    if (!child?.parentNode && isElement(child)) { appendOrEmplaceByIndex(parent, child, index); return; };
    if (parent?.parentNode == child?.parentNode) { return; }
    if (isElement(child)) { appendOrEmplaceByIndex(parent, child, index); };
}

//
const asArray = (children)=>{
    if (children instanceof Map || children instanceof Set) {
        children = Array.from(children?.values?.());
    }
    return children;
}

//
export const appendArray = (parent: any, children: any[], mapper?: Function | null, index: number = -1) => {
    const len = children?.length ?? 0;
    if (Array.isArray(unwrap(children)) || children instanceof Map || children instanceof Set) {
        const list = asArray(children)?.map?.((cl, I: number) => getNode(cl, mapper, I, parent))?.filter?.((el) => el != null)
        const frag = document.createDocumentFragment();
        list?.forEach?.((cl)=>appendFix(frag, cl));
        appendFix(parent, frag, index);
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
    if (!parent) return node;
    if (node?.parentNode == parent && node?.parentNode != null) {
        return node;
    } else
    if (node?.parentNode != parent && !isValidParent(node?.parentNode)) {
        if (Number.isInteger(index) && index >= 0 && Array.from(parent?.childNodes || [])?.length > index) {
            return parent.childNodes?.[index];
        }
    }
    return node;
}

//
export const replaceOrSwap = (parent, oldEl, newEl) => {
    if (oldEl?.parentNode) {
        if (oldEl?.parentNode == newEl?.parentNode) {
            parent = oldEl?.parentNode ?? parent;
            if (oldEl.nextSibling === newEl) { parent.insertBefore(newEl, oldEl); } else
            if (newEl.nextSibling === oldEl) { parent.insertBefore(oldEl, newEl); } else
            {
                const nextSiblingOfElement1 = oldEl.nextSibling;
                parent.replaceChild(newEl, oldEl);
                parent.insertBefore(oldEl, nextSiblingOfElement1);
            }
        } else {
            oldEl?.replaceWith?.(newEl);
        }
    }
}



// TODO: what exactly to replace, if has (i.e. object itself, not index)
export const replaceChildren = (element, cp, mapper?: Function | null, index: number = -1, old?: any|null) => {
    if (mapper != null) { cp = mapper?.(cp, index); }; if (!element) element = old?.parentNode;
    const cn = dePhantomNode(element, getNode(old, mapper, index), index);
    if (cn instanceof Text && typeof cp == "string") { cn.textContent = cp; } else
    if (cp != null) {
        const node = getNode(cp); // oldNode is always unknown and phantom

        if (cn?.parentNode == element && cn != node && (cn instanceof Text && node instanceof Text)) {
            if (cn?.textContent != node?.textContent) { cn.textContent = node?.textContent?.trim?.() ?? ""; }
        } else
        if (cn?.parentNode == element && cn != node && cn != null && cn?.parentNode != null) {
            replaceOrSwap(element, cn, node);
        } else
        if (cn?.parentNode != element || cn?.parentNode == null) {
            appendChild(element, node, null, index);
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
    const $node = getNode(cp, mapper);
    if (!element) element = $node?.parentNode;
    if (Array.from(element?.childNodes ?? [])?.length < 1) return;
    const whatToRemove = dePhantomNode(element, $node, index);
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
        const element = document.createTextNode(((hasValue(ref) ? ref?.value : ref) ?? "")?.trim?.() ?? "");
        //subscribe([ref, "value"], (val) => (element.textContent = (val?.innerText ?? val?.textContent ?? val ?? "")?.trim?.() ?? ""));
        subscribe([ref, "value"], (val) => {
            const untrimmed = "" + (val?.innerText ?? val?.textContent ?? val?.value ?? val ?? "");
            (element.textContent = untrimmed?.trim?.() ?? "");
        });
        return element;
    });
}

//
export default getNode;
