
//
const
    MATCH = '(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)',
    QUOTE1 = '(["\'])((?:(?=(\\\\?))\\',
    QUOTE2 = '[\\W\\w])*?)\\',
    REGEX = '^(?:' + MATCH + ')|^#' + MATCH + '|^\\.' + MATCH + '|^\\[' + MATCH + '(?:([*$|~^]?=)' + QUOTE1 + '8' + QUOTE2 + '6' + ')?\\]|^\\s*[\\n\\r]+([\\t]*)\\s*|^(\\s+)|^' + QUOTE1 + '13' + QUOTE2 + '11';

//
export const createElement = (selectorUntrimmed): HTMLElement|DocumentFragment => {
    let selector = selectorUntrimmed.replace(/^\s+|\s+$/);
    const create = document.createElement.bind(document);
    const root = document.createDocumentFragment(), nest = [root, create('div')];
    if (selectorUntrimmed == ":fragment:") return root;

    //
    for (let frag: any = root, node = frag.appendChild(nest[1]), index = 1, first = true, match; selector && (match = selector.match(REGEX));) {
        // tag
        if (match[1]) {
            frag.replaceChild(node = create(match[1]), frag.lastChild);

            if (first) nest[index] = node;
        }
        // id
        if (match[2]) node.id = match[2];
        // class
        if (match[3]) node.className += (node.className ? ' ' : '') + match[3];
        // attribute
        if (match[4]) node.setAttribute(match[4], match[7] || '');
        // nesting
        if (match[9] !== undefined) {
            index = match[9].length;

            frag = nest[index];
            node = nest[++index] = frag.appendChild(create('div'));
        }
        // child
        if (match[10]) {
            frag = node;
            node = frag.appendChild(create('div'));

            first = false;
        }
        // text
        if (match[11]) {
            frag.replaceChild(node = document.createTextNode(match[12]), frag.lastChild);

            if (first) nest[index] = node;
        }

        selector = selector.slice(match[0].length);
    }

    return ((root.childNodes.length === 1 ? root?.lastChild : root) || root) as HTMLElement;
};

//
export const elMap = new WeakMap<any, HTMLElement|DocumentFragment|Text>();
export const reMap = new WeakMap();

//
export const getNode = (E, mapper?: Function, index?: number)=>{
    if (mapper) {
        const old = reMap;
        if (typeof E == "object" || typeof E == "function") {
            const b = reMap?.get(E) ?? mapper?.(E, index); E = getNode(b);
            if (!reMap?.has?.(old)) { reMap?.set(old, b); };
        } else {
            E = getNode(mapper?.(E, index));
        }
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
    if (cp?.children?.length > 1) {
        element?.append?.(...cp?.children?.map?.((cl, i: number)=>getNode(cl, mapper, i)));
    } else
    if (Array.isArray(cp)) {
        element?.append?.(...cp?.map?.((cl, i: number)=>getNode(cl, mapper, i)));
    } else {
        element?.append?.(getNode(cp, mapper, element?.childNodes?.length));
    }
}

// when possible, don't create new Text nodes
export const replaceChildren = (element, cp, index, mapper?)=>{
    const cn = element.childNodes?.[index];
    if (cn instanceof Text && typeof cp == "string") {
        cn.textContent = cp;
    } else {
        const node = getNode(cp, mapper, index);
        if (cn instanceof Text && node instanceof Text) {
            cn.textContent = node.textContent;
        } else {
            cn?.replaceWith?.(node);
        }
    }
}

//
export const removeChild = (element, children, index)=>{
    if (children?.parentNode == element) { children?.remove?.(); } else
    if (children?.children && children?.children?.length >= 1) {
        // TODO: remove by same string value
        children?.children?.forEach(c => { const R = (elMap.get(c) ?? reMap.get(c) ?? c); if (R == element?.parentNode) R?.remove?.(); });
        //children?.children?.forEach(c => element?.childNodes?.find?.((e)=>(e==))?.remove?.());
    } else { element?.childNodes?.[index]?.remove?.(); }
}
