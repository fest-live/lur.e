import { addToCallChain, observe, ref } from "fest/object";

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

// TODO! use handlerMap registry
export const reflectChildren = (element: HTMLElement | DocumentFragment, children: any[] = [], mapper?: Function) => {
    const $parent = getNode(children?.[0], mapper)?.parentElement;
    if (!isValidParent(element)) { element = (isValidParent($parent) ? $parent : element) ?? element; }
    if (!children || hasInBank(element, children)) return element;

    //
    const ref = new WeakRef(element);
    mapper = (children?.[$mapped] ? (children as any)?.mapper : mapper) ?? mapper;
    children = (children?.[$mapped] ? (children as any)?.children : children) ?? children;

    //
    const toBeRemoved: any[] = [], toBeAppend: any[] = [], toBeReplace: any[] = [];
    const merge = () => { // @ts-ignore
        toBeReplace.forEach((args) => replaceChildren(...args)); toBeReplace.splice(0, toBeReplace.length); // @ts-ignore
        toBeRemoved.forEach((args) => removeChild(...args)); toBeRemoved.splice(0, toBeRemoved.length); // @ts-ignore
        toBeAppend.forEach((args) => appendChild(...args)); toBeAppend.splice(0, toBeAppend.length); // @ts-ignore
    }

    //
    let controller: AbortController | null = null;
    const isArray = Array.isArray(children);
    const unsub = observe(children, (...args) => {
        controller?.abort?.(); controller = new AbortController();

        //
        const op = isArray ? (args?.[args.length - 1] || "") : null;
        const old = isArray ? (args?.[args.length - 2] ?? null) : args?.[2];
        const idx = args?.[1] ?? -1, obj = args?.[0] ?? children?.[idx];

        //
        const nodeParent = getNode(obj ?? old, mapper)?.parentElement ?? ref.deref();

        //
        let element = ref.deref(); // @ts-ignore
        if (!isValidParent(element) || isValidParent(nodeParent)) { element = (isValidParent(nodeParent) ? nodeParent : element) ?? element; }
        if (!element) return;

        //
        const oldIdx = indexOf(element, getNode(old ?? obj)) ?? idx ?? -1;
        if (element && ((isArray && ["@add", "@set", "@remove"].indexOf(op) >= 0) || (!isArray))) {
            if (old != null && (obj == null || op == "@remove")) { toBeRemoved.push([element, old ?? obj, mapper, oldIdx]); };
            if (obj != null && (old != null || op == "@set")) { toBeReplace.push([element, obj ?? old, mapper, oldIdx]); };
            if (obj != null && (old == null || op == "@add")) { toBeAppend.push([element, obj ?? old, mapper, oldIdx]); };
        }

        //
        if (children?.length == 0 && element instanceof HTMLElement) { /*element.innerHTML = ``;*/ removeNotExists(element, children, mapper); }; // @ts-ignore
        if ((op && op != "@get" && ["@add", "@set", "@remove"].indexOf(op) >= 0) || !op) { // @ts-ignore
            if (typeof children?.[$behavior] == "function") { children?.[$behavior]?.(merge, [toBeAppend, toBeReplace, toBeRemoved], [controller.signal, op, ref, args]); } else { merge(); }
        }
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
