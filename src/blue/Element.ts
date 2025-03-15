import { makeReactive } from '../lib/object';
import { elMap, reflectAttributes, reflectChildren, reflectClassList, reflectStyles, reflectProperties, reformChildren } from './Reflect';

//
const
    MATCH = '(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)',
    QUOTE1 = '(["\'])((?:(?=(\\\\?))\\',
    QUOTE2 = '[\\W\\w])*?)\\',
    REGEX = '^(?:' + MATCH + ')|^#' + MATCH + '|^\\.' + MATCH + '|^\\[' + MATCH + '(?:([*$|~^]?=)' + QUOTE1 + '8' + QUOTE2 + '6' + ')?\\]|^\\s*[\\n\\r]+([\\t]*)\\s*|^(\\s+)|^' + QUOTE1 + '13' + QUOTE2 + '11';

//
const createElement = (selectorUntrimmed): HTMLElement|DocumentFragment => {
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
interface Params {
    classList?: Set<string>;
    attributes?: any;
    dataset?: any;
    properties?: any;
    style?: any|string;
    slot?: string;
    is?: string;
    on?: any;
};

//
export default class El {
    children: any[];
    params: Params;
    selector: string;

    //
    constructor(selector, params = {}, children = []) {
        this.children = children;
        this.params   = params;
        this.selector = selector;
    }

    //
    get element(): HTMLElement|DocumentFragment|Text {
        if (elMap.has(this)) {
            const el = elMap.get(this);
            if (el) { return el; };
        }

        // create new element if there is not for reflection
        const element = createElement(this.selector);
        if (element instanceof HTMLElement) {
            reflectAttributes(element, this.params.attributes);
            reflectStyles(element, this.params.style);
            reflectClassList(element, this.params.classList);
            reflectProperties(element, this.params.properties);

            //
            if (this.params.slot != null) element.slot = this.params.slot;
            if (this.params.is != null) element.setAttribute("is", this.params.is);

            // TODO: reflect with dataset
            if (this.params.dataset != null) Object.assign(element.dataset, this.params.dataset);

            // if has event listeners, use it
            if (this.params.on) {
                Object.entries(this.params.on).forEach(([name, list])=>{
                    (list as any)?.forEach?.(fn => {
                        if (typeof fn == "function") {
                            this.element.addEventListener(name, fn, {});
                        } else {
                            this.element.addEventListener(name, fn?.[0], fn?.[1] || {});
                        }
                    });
                });
            }
        }
        if (this.children) reflectChildren(element, this.children);
        elMap.set(this, element);
        return element;
    }

    reform() {
        if ((this.element instanceof HTMLElement || this.element instanceof DocumentFragment) && this.children) {
            reformChildren(this.element, this.children);
        }
        return this;
    }
}

export const observeSize = (element, box, styles?) => {
    if (!styles) styles = makeReactive({});
    new ResizeObserver((mut)=>{
        if (box == "border-box") {
            styles.inlineSize = `${mut[0].borderBoxSize[0].inlineSize}px`;
            styles.blockSize = `${mut[0].borderBoxSize[0].blockSize}px`;
        }
        if (box == "content-box") {
            styles.inlineSize = `${mut[0].contentBoxSize[0].inlineSize}px`;
            styles.blockSize = `${mut[0].contentBoxSize[0].blockSize}px`;
        }
        if (box == "device-pixel-content-box") {
            styles.inlineSize = `${mut[0].devicePixelContentBoxSize[0].inlineSize}px`;
            styles.blockSize = `${mut[0].devicePixelContentBoxSize[0].blockSize}px`;
        }
    }).observe(element?.element ?? element, {box});
    return styles;
}
