import {unwrap} from "./Array.ts";

//
const
	MATCH = '(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)',
	REGEX = '^(?:' + MATCH + ')|^#' + MATCH + '|^\\.' + MATCH + '|^\\[' + MATCH + '(?:([*$|~^]?=)(["\'])((?:(?=(\\\\?))\\8.)*?)\\6)?\\]';

//
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
export const elMap = new WeakMap<any, HTMLElement|DocumentFragment|Text>();
export const getNode = (E, mapper?: Function, index?: number)=>{
    if (mapper) {
        //const old = E;
        //if (typeof E == "object" || typeof E == "function") {
            //const b = reMap?.get(E) ?? mapper?.(E, index); E = getNode(b);
            //if (!reMap?.has?.(old)) { reMap?.set(old, b); };
        //} else {
            E = getNode(mapper?.(E, index));
        //}
        return E;
    }
    if (typeof E == "function") {
        return getNode(E()); // mapped arrays always empties after
    } else
    if (typeof E == "string") {
        return new Text(E);
    } else
    if (E instanceof Text || E instanceof HTMLElement || E instanceof DocumentFragment) {
        return E;
    } else
    if (typeof E == "object") {
        return E?.element ?? elMap.get(E);
    }
    return E;
}


//
export const appendChild = (element, cp, mapper?)=>{
    if (mapper) {
        cp = mapper?.(cp) ?? cp;
        //const b = reMap?.get(cp) ?? mapper?.(cp, element?.childNodes?.length);
        //if (!reMap?.has?.(old)) { reMap?.set(old, b); };
        //cp = b ?? cp;
    }

    if (/*cp?.children?.length > 1 &&*/ cp?.children && Array.isArray(unwrap(cp?.children)) && !(cp?.["@virtual"] || cp?.["@mapped"])) {
        element?.append?.(...(unwrap(cp?.children)?.map?.((cl, _: number)=>getNode(cl)) ?? unwrap(cp?.children)));
    } else
    if (Array.isArray(unwrap(cp))) {
        element?.append?.(...unwrap(cp?.map?.((cl, _: number)=>getNode(cl)) ?? cp));
    } else {
        element?.append?.(getNode(cp));
    }
}

// when possible, don't create new Text nodes
export const replaceChildren = (element, cp, index, mapper?)=>{
    if (mapper) {
        cp = mapper?.(cp) ?? cp;
        //const b = reMap?.get(cp) ?? mapper?.(cp, element?.childNodes?.length);
        //if (!reMap?.has?.(old)) { reMap?.set(old, b); };
        //cp = b ?? cp;
    }

    const cn = element.childNodes?.[index];
    if (cn instanceof Text && typeof cp == "string") {
        cn.textContent = cp;
    } else {
        const node = getNode(cp);
        if (cn instanceof Text && node instanceof Text) {
            cn.textContent = node.textContent;
        } else {
            cn?.replaceWith?.(node);
        }
    }
}

//
export const removeChild = (element, cp, index, mapper?)=>{
    //if (mapper) { children = mapper?.(children) ?? children; };
    if (element?.childNodes?.length < 1) return;
    const node = getNode(cp = mapper?.(cp) ?? cp);
    const ch = node ?? element?.childNodes?.[index];
    if (ch?.parentNode == element) { ch?.remove?.(); } else
    if (ch?.children && ch?.children?.length >= 1) {
        // TODO: remove by same string value
        ch?.children?.forEach?.(c => { const R = (elMap.get(c) ?? c); if (R == element?.parentNode) R?.remove?.(); });
        //children?.children?.forEach(c => element?.childNodes?.find?.((e)=>(e==))?.remove?.());
    } else { element?.childNodes?.[index]?.remove?.(); }
}
