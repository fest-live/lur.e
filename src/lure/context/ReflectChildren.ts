import { addToCallChain, observe, ref, subscribe } from "fest/object";

//
import getNode, { appendChild, removeNotExists, replaceChildren } from "./Utils";
import { removeChild, removeChildDirectly } from "./Utils";
import { $mapped, $behavior, addToBank, hasInBank } from "../core/Binding";

//
const isValidParent = (parent: Node | null) => {
    return (parent != null && parent instanceof HTMLElement && !(parent instanceof DocumentFragment || parent instanceof HTMLBodyElement)) ? parent : null;
}

//
const indexOf = (element: Node, node: Node) => {
    return Array.from(element?.childNodes ?? []).indexOf(node as any);
}



//
export const makeUpdater = (defaultParent: Node | null = null, mapper?: Function | null, isArray: boolean = true) => {
    const toBeRemoved: any[] = [], toBeAppend: any[] = [], toBeReplace: any[] = [];
    const merge = () => { // @ts-ignore
        toBeAppend.forEach((args) => appendChild(...args)); toBeAppend.splice(0, toBeAppend.length); // @ts-ignore
        toBeReplace.forEach((args) => replaceChildren(...args)); toBeReplace.splice(0, toBeReplace.length); // @ts-ignore
        toBeRemoved.forEach((args) => removeChild(...args)); toBeRemoved.splice(0, toBeRemoved.length); // @ts-ignore
    }

    //
    const updateChildList = (newEl, idx, oldEl, op: string | null = "@add", boundParent: Node | null = null) => {
        let doubtfulParent = getNode(newEl ?? oldEl, mapper, idx, isValidParent(boundParent) ?? isValidParent(defaultParent))?.parentElement;
        let element = isValidParent(doubtfulParent) ?? isValidParent(boundParent) ?? isValidParent(defaultParent);
        if (!element) return; if (defaultParent != element) { defaultParent = element; }

        //
        const oldNode = getNode(oldEl, mapper, idx);
        const newNode = getNode(newEl, mapper, idx);
        const oldIdx = indexOf(element, oldNode);
        if (element && (["@add", "@set", "@remove"].indexOf(op || "") >= 0) || (!op)) {
            if ((newNode != null && oldNode == null) || op == "@add") { toBeAppend.push([element, newNode, null, idx]); };
            if ((newNode != null && oldNode != null) || op == "@set") { toBeReplace.push([element, newNode, null, oldIdx >= 0 ? oldIdx : idx]); }; // TODO: add support for oldNode in replace method

            // due splice already removed that index, we need to add +1 to the index in exists children
            if ((newNode == null || oldNode != null) || op == "@remove") { toBeRemoved.push([element, oldNode, null, oldIdx >= 0 ? oldIdx : idx]); };
        }

        //
        if ((op && op != "@get" && ["@add", "@set", "@remove"].indexOf(op) >= 0) || (!op && !isArray)) { merge?.(); }
    }

    //
    return updateChildList;
}

// TODO! use handlerMap registry
export const reflectChildren = (element: HTMLElement | DocumentFragment, children: any[] = [], mapper?: Function) => {
    const $parent = getNode(Array.from(children?.values?.() || [])?.[0], mapper, 0)?.parentElement;
    if (!isValidParent(element)) { element = (isValidParent($parent) ? $parent : element) ?? element; }
    if (!children || hasInBank(element, children)) return element;

    //
    mapper = (children?.[$mapped] ? (children as any)?.mapper : mapper) ?? mapper;
    children = (children?.[$mapped] ? (children as any)?.children : children) ?? children;

    //
    removeNotExists(element, children?.map?.((nd, index) => getNode(nd, mapper, index, element)));
    const updater = makeUpdater(element, mapper, true);
    const unsub = observe(children, (...args) => {
        const firstOf = getNode(Array.from(children?.values?.() || [])?.[0], mapper, 0);
        const boundParent = firstOf?.parentElement; // @ts-ignore
        return updater(args?.[0], args?.[1], args?.[2], args?.[3], boundParent);
    });

    //
    addToBank(element, reflectChildren, "childNodes", [children, unsub]);
    addToCallChain(children, Symbol.dispose, unsub);
    addToCallChain(element, Symbol.dispose, unsub); return element;
}

// forcely update child nodes (and erase current content)
export const reformChildren = (element: HTMLElement | DocumentFragment, children: any[] = [], mapper?: Function) => {
    if (!children || !element) return element;

    //
    mapper = (children?.[$mapped] ? (children as any)?.mapper : mapper) ?? mapper;
    children = (children?.[$mapped] ? (children as any)?.children : children) ?? children;

    //
    const cvt = children?.map?.((nd, index) => getNode(nd, mapper, index, element));
    removeNotExists(element, cvt); cvt?.forEach?.((nd) => appendChild(element, nd));
    return element;
}
