import { addToCallChain, observe, ref, subscribe } from "fest/object";

//
import getNode, { appendChild, removeNotExists, replaceChildren } from "./Utils";
import { removeChild } from "./Utils";
import { $mapped, $behavior, addToBank, hasInBank } from "../core/Binding";

//
const isValidParent = (parent: Node) => {
    return (parent != null && !(parent instanceof DocumentFragment || parent instanceof HTMLBodyElement));
}

//
const indexOf = (element: Node, node: Node) => {
    return Array.from(element?.childNodes ?? []).indexOf(node as any);
}



//
export const makeUpdater = (defaultParent: Node | null = null, mapper?: Function | null) => {
    const toBeRemoved: any[] = [], toBeAppend: any[] = [], toBeReplace: any[] = [];
    const merge = () => { // @ts-ignore
        toBeReplace.forEach((args) => replaceChildren(...args)); toBeReplace.splice(0, toBeReplace.length); // @ts-ignore
        toBeRemoved.forEach((args) => removeChild(...args)); toBeRemoved.splice(0, toBeRemoved.length); // @ts-ignore
        toBeAppend.forEach((args) => appendChild(...args)); toBeAppend.splice(0, toBeAppend.length); // @ts-ignore
    }

    //
    const updateChildList = (newEl, idx, oldEl, op: string | null = "@add", boundParent: Node | null = null) => {
        let element = getNode(newEl ?? oldEl, mapper)?.parentElement ?? boundParent ?? defaultParent;
        if (!isValidParent(element)) { element = defaultParent ?? element; }
        if (!element) return; if (defaultParent != element) { defaultParent = element; }

        //
        const oldIdx = indexOf(element, getNode(oldEl ?? newEl, mapper)) ?? idx ?? -1;
        if (element && (["@add", "@set", "@remove"].indexOf(op || "") >= 0) || (!op)) {
            if (oldEl != null && (newEl == null || op == "@remove")) { toBeRemoved.push([element, oldEl ?? newEl, mapper, oldIdx]); };
            if (newEl != null && (oldEl != null || op == "@set")) { toBeReplace.push([element, newEl ?? oldEl, mapper, oldIdx]); };
            if (newEl != null && (oldEl == null || op == "@add")) { toBeAppend.push([element, newEl ?? oldEl, mapper, oldIdx]); };
        }

        //
        if ((op && op != "@get" && ["@add", "@set", "@remove"].indexOf(op) >= 0) || !op) { merge?.(); }
    }

    //
    return updateChildList;
}

// TODO! use handlerMap registry
export const reflectChildren = (element: HTMLElement | DocumentFragment, children: any[] = [], mapper?: Function) => {
    const $parent = getNode(children?.[0], mapper)?.parentElement;
    if (!isValidParent(element)) { element = (isValidParent($parent) ? $parent : element) ?? element; }
    if (!children || hasInBank(element, children)) return element;

    //
    mapper = (children?.[$mapped] ? (children as any)?.mapper : mapper) ?? mapper;
    children = (children?.[$mapped] ? (children as any)?.children : children) ?? children;

    //
    const isArray = Array.isArray(children);
    const updater = makeUpdater(element, mapper);
    const unsub = (isArray ? observe : subscribe)(children, (...args) => {
        return updater(...args);
    });

    //
    addToBank(element, reflectChildren, "childNodes", [children, unsub]);
    addToCallChain(children, Symbol.dispose, unsub);
    addToCallChain(element, Symbol.dispose, unsub); return element;
}

// forcely update child nodes (and erase current content)
export const reformChildren = (element: HTMLElement | DocumentFragment, children: any[] = [], mapper?: Function) => {
    if (!children) return element; const ref = new WeakRef(element);
    mapper = (children?.[$mapped] ? (children as any)?.mapper : mapper) ?? mapper;

    //
    const cvt = (children = (children?.[$mapped] ? (children as any)?.children : children) ?? children)?.map?.((nd) => { if (mapper != null) { nd = mapper?.(nd); return nd; }; });
    removeNotExists(element, cvt); cvt.forEach((nd) => {
        const element = ref.deref();
        if (!element) return nd;
        appendChild(element, nd);
    }); return element;
}
