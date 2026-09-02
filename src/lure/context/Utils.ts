/*
 * Filename: Utils.ts
 * FullPath: modules/projects/lur.e/src/lure/context/Utils.ts
 * FIND:style-anim
 * TAG:lure,style-anim
 * WHY: append/remove await appear/disappear; detach still happens if the Promise is ignored.
 * INVARIANT: cancel u2-before-remove leaves the node; disappear never detaches.
 */
import { unwrap, affected } from "@fest-lib/object";
import { $virtual, $mapped } from "../core/Binding";
import { isElement, isValidParent } from "@fest-lib/dom";
import { hasValue, isNotEqual, isPrimitive } from "@fest-lib/core";
import { appear, disappear, dispatchLifecycleEvent, waitElementAnimations } from "@fest-lib/style-lib";
import type { AnimationOptions } from "@fest-lib/style-lib";
import C from "../node/Changeable";
import Q from "../node/Queried";

export type NodeLifecycle = {
    appear?: AnimationOptions | null;
    disappear?: AnimationOptions | null;
};

//
export const KIDNAP_WITHOUT_HANG = (el: any, requestor: any | null) => {
    return ((requestor && requestor != el && !el?.contains?.(requestor) && isValidParent(requestor)) ? el?.elementForPotentialParent?.(requestor) : null) ?? el?.element;
}

//
export const isElementValue = (el: any, requestor?: any | null) => { return KIDNAP_WITHOUT_HANG(el, requestor) ?? (hasValue(el) && isElement(el?.value) ? el?.value : el); }

//
const __nodeGuardSymbol = Symbol.for("lur.e@__nodeGuard");
const __nodeGuard = globalThis[__nodeGuardSymbol] ??= new WeakSet<any>();
export { __nodeGuard };

//
/* INVARIANT: must NOT reuse `lur.e@elMap` — Binding owns that Symbol as DoubleWeakMap([el, handler]→bank).
 * WHY: Utils/C() key by a single object; pair-map #splitPair(non-array) → null → "Invalid value used as weak map key". */
const nodeElMapSymbol = Symbol.for("lur.e@nodeElMap");
/** Observable / object → cached lure node (Changeable, Text, …). Single-key WeakMap. */
export const elMap = globalThis[nodeElMapSymbol] ??= new WeakMap<any, any>();
export { elMap as nodeElMap };

//
const tmMapSymbol = Symbol.for("lur.e@tmMap");
export const tmMap = globalThis[tmMapSymbol] ??= new WeakMap<any, any>();

//
const getMapped = (obj: any)=>{
    if (isPrimitive(obj)) return obj;
    if (hasValue(obj) && isPrimitive(obj?.value) && obj != null) return tmMap?.get(obj);
    return ((typeof obj == "object" || typeof obj == "function") && obj != null) ? elMap?.get?.(obj) : obj;
}

//
const $promiseResolvedMapSymbol = Symbol.for("lur.e@$promiseResolvedMap");
globalThis[$promiseResolvedMapSymbol] ??= new WeakMap();
export const $promiseResolvedMap = globalThis[$promiseResolvedMapSymbol];

//
const $makePromisePlaceholder = (promised, getNodeCb)=>{
    if ($promiseResolvedMap?.has?.(promised)) {
        return $promiseResolvedMap?.get?.(promised);
    }

    //
    const comment = document.createComment(":PROMISE:");
    promised?.then?.((elem)=>{
        const element = typeof getNodeCb == "function" ? getNodeCb(elem) : elem;
        $promiseResolvedMap?.set?.(promised, element);

        // avoid vain (not) replacement
        queueMicrotask(() => {
            try {
                if (typeof comment?.replaceWith == "function") {
                    if (!comment?.isConnected) return;
                    if (isElement(element)) { comment?.replaceWith?.(element); }
                } else
                    if (comment?.isConnected && isElement(element)) {
                        comment?.parentNode?.replaceChild?.(comment, element);
                    }
            } catch (error) {
                if (!comment?.isConnected) return;
                comment?.remove?.();
            }
        })
    });
    return comment;
}

//
export const $getBase = (el, mapper?: Function | null, index: number = -1, requestor?: any | null)=>{
    if (mapper != null) { return (el = $getBase(mapper?.(el, index), null, -1, requestor)); }
    if (el instanceof WeakRef || typeof (el as any)?.deref == "function") { el = el.deref(); } // promise unsupported
    if (el instanceof Promise || typeof (el as any)?.then == "function") { return $makePromisePlaceholder(el, (nd)=>$getBase(nd, mapper, index, requestor)); };
    if (isElement(el) && !el?.element) { return el; } else
    if (isElement(el?.element)) { return el; } else
    if (hasValue(el)) { return ((el instanceof HTMLElement) ? Q : C)(el); } else
    if (typeof el == "object" && el != null) { return getMapped(el); } else
    if (typeof el == "function") { return $getBase(el?.(), mapper, index, requestor); }  // mapped arrays always empties after
    if (isPrimitive(el) && el != null) return T(el);
    return document.createComment(":NULL:");
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
    if (el instanceof Promise || typeof (el as any)?.then == "function") { return $makePromisePlaceholder(el, (nd)=>getNode(nd, mapper, index, requestor)); };
    if (isElement(el) && !el?.element) { return el; } else
    if (isElement(el?.element)) { return isElementValue(el, requestor); } else
    if (hasValue(el)) { return ((el instanceof HTMLElement) ? Q : C)(el)?.element; } else
    if (typeof el == "object" && el != null) { return getMapped(el); } else
    if (typeof el == "function") { return getNode(el?.(), mapper, index, requestor); } else
    if (isPrimitive(el) && el != null) return T(el);
    return document.createComment(":NULL:");
};

//
const isWeakCompatible = (el: any)=>{
    return (typeof el == "object" || typeof el == "function" || typeof el == "symbol") && el != null;
}

//
const __getNode = (el, mapper?: Function | null, index: number = -1, requestor?: any | null)=>{
    if (el instanceof WeakRef || typeof (el as any)?.deref == "function") { el = el.deref(); }
    if (el instanceof Promise || typeof (el as any)?.then == "function") { return $makePromisePlaceholder(el, (nd)=>__getNode(nd, mapper, index, requestor)); };
    if (isWeakCompatible(el) && !isElement(el)) {
        if (elMap.has(el)) {
            const obj: any = getMapped(el) ?? $getBase(el, mapper, index, requestor);
            return $getLeaf(obj instanceof WeakRef ? obj?.deref?.() : obj, requestor);
        };
        const $node = $getBase(el, mapper, index, requestor);
        if (!mapper && $node != null && $node != el && isWeakCompatible(el) && !isElement(el) && el != null) { elMap.set(el, $node); };
        return $getLeaf($node, requestor);
    }
    return $getNode(el, mapper, index, requestor);
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
export const appendChild = async (element, cp, mapper?: Function | null, index: number = -1, lifecycle?: NodeLifecycle) => {
    if (mapper != null) { cp = mapper?.(cp, index); }

    // has children lists
    if (cp?.children && Array.isArray(unwrap(cp?.children)) && (cp?.[$virtual] || cp?.[$mapped])) {
        appendArray(element, cp?.children, null, index);
    } else {
        appendArray(element, cp, null, index);
    }

    const node = getNode(cp, null, index, element);
    if (node instanceof Element) {
        await appear(node, lifecycle?.appear ?? null);
    }
    return element;
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
// WHY: makeUpdater passes lifecycle as the last arg; ignoring appendChild's Promise
// dropped appear waits on Mapped/Changeable set.
export const replaceChildren = async (element, cp, mapper?: Function | null, index: number = -1, old?: any|null, lifecycle?: NodeLifecycle) => {
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
            if (node instanceof Element) {
                await appear(node, lifecycle?.appear ?? null);
            }
        } else
        if (cn?.parentNode != element || cn?.parentNode == null) {
            await appendChild(element, node, null, index, lifecycle);
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
export const removeChild = async (element, cp, mapper?: Function | null, index: number = -1, lifecycle?: NodeLifecycle) => {
    const $node = getNode(cp, mapper);
    if (!element) element = $node?.parentNode;
    if (Array.from(element?.childNodes ?? []).length < 1) return element;
    const whatToRemove = dePhantomNode(element, $node, index);
    if (whatToRemove?.parentNode != element) return element;
    if (whatToRemove instanceof Element) {
        if (!dispatchLifecycleEvent(whatToRemove, "u2-before-remove")) return element;
        whatToRemove.setAttribute("data-removing", "");
        await disappear(whatToRemove, lifecycle?.disappear ?? null);
        await waitElementAnimations(whatToRemove);
        whatToRemove.remove();
        whatToRemove.removeAttribute("data-removing");
        dispatchLifecycleEvent(whatToRemove, "u2-removed");
        return element;
    }
    whatToRemove?.remove?.();
    return element;
}

//
export const removeNotExists = async (element, children, mapper?: Function | null, lifecycle?: NodeLifecycle) => {
    const list = Array.from(unwrap(children) || [])?.map?.((cp, index) => getNode(cp, mapper, index));
    const missing = Array.from(element.childNodes).filter((nd: any) => !list?.find?.((cp) => (!isNotEqual?.(cp, nd))));
    await Promise.all(missing.map((nd) => removeChild(element, nd, null, -1, lifecycle)));
    return element;
}

//
export const T = (ref) => {
    if (isPrimitive(ref) && ref != null) { return document.createTextNode(ref); }
    if (ref == null) return document.createComment(":NULL:");

    // @ts-ignore
    if (isWeakCompatible(ref)) {
        return tmMap.getOrInsertComputed(ref, () => {
            const element = document.createTextNode(((hasValue(ref) ? ref?.value : ref) ?? "")?.trim?.() ?? "");
            //affected([ref, "value"], (val) => (element.textContent = (val?.innerText ?? val?.textContent ?? val ?? "")?.trim?.() ?? ""));
            affected([ref, "value"], (val) => {
                const untrimmed = "" + (val?.innerText ?? val?.textContent ?? val?.value ?? val ?? "");
                (element.textContent = untrimmed?.trim?.() ?? "");
            });
            return element;
        });
    }
}

//
export default getNode;
