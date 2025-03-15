import { elMap, reflectAttributes, reflectChildren, reflectClassList, reflectStyles, reflectProperties } from './Reflect';

//
const
    MATCH = '(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)',
    QUOTE1 = '(["\'])((?:(?=(\\\\?))\\',
    QUOTE2 = '[\\W\\w])*?)\\',
    REGEX = '^(?:' + MATCH + ')|^#' + MATCH + '|^\\.' + MATCH + '|^\\[' + MATCH + '(?:([*$|~^]?=)' + QUOTE1 + '8' + QUOTE2 + '6' + ')?\\]|^\\s*[\\n\\r]+([\\t]*)\\s*|^(\\s+)|^' + QUOTE1 + '13' + QUOTE2 + '11';

//
const createElement = (selectorUntrimmed): HTMLElement => {
    let selector = selectorUntrimmed.replace(/^\s+|\s+$/);
    const root = document.createDocumentFragment(), nest = [root, createElement.call(this, 'div')];

    for (let frag: any = root, node = frag.appendChild(nest[1]), index = 1, first = true, match; selector && (match = selector.match(REGEX));) {
        // tag
        if (match[1]) {
            frag.replaceChild(node = createElement.call(this, match[1]), frag.lastChild);

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
            node = nest[++index] = frag.appendChild(createElement.call(this, 'div'));
        }
        // child
        if (match[10]) {
            frag = node;
            node = frag.appendChild(createElement.call(this, 'div'));

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
interface Params {
    classList: Set<string>;
    attributes: any;
    dataset: any;
    properties: any;
    style: any;
};

//
export default class El {
    children: any[];
    params: Params;
    selector: string;

    //
    constructor(selector, params, children) {
        this.children = [...children];
        this.params = { ...params };
        this.selector = selector;
    }

    //
    get element(): HTMLElement {
        if (elMap.has(this)) {
            const el = elMap.get(this);
            if (el) { return el; };
        }
        const element = createElement(this.selector);
        reflectAttributes(element, this.params.attributes);
        reflectStyles(element, this.params.style);
        reflectChildren(element, this.children);
        reflectClassList(element, this.params.classList);
        reflectProperties(element, this.params.properties);
        elMap.set(this, element);
        return element;
    }
}
