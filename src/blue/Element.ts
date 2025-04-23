import observableArray, {importCdn} from './Array';

// @ts-ignore
const { makeReactive, subscribe } = await Promise.try(importCdn, ["/externals/lib/object.js"]);

//
import { createElement, elMap } from './DOM';
import { reflectAttributes, reflectChildren, reflectClassList, reflectStyles, reflectProperties, reformChildren, reflectWithStyleRules, reflectDataset } from './Reflect';

//
interface Params {
    classList?: Set<string>;
    attributes?: any;
    dataset?: any;
    properties?: any;
    style?: any|string;
    slot?: string;
    name?: string;
    type?: string;
    icon?: string;
    inert?: boolean|string;
    is?: string;
    part?: string;
    on?: any;
    hidden?: any;
    rules?: any[];
};

//
export class Tx {
    ref: any;

    //
    constructor(ref) {
        this.ref = ref || makeReactive({ value: null });
    }

    //
    get value() { return this.ref?.value; }
    set value(val: any) { this.ref.value = val; }

    //
    get element(): HTMLElement|DocumentFragment|Text {
        if (elMap.has(this)) { const el = elMap.get(this); if (el) { return el; }; }

        //
        const element = new Text();
        subscribe([this.ref, "value"], (val)=>(element.textContent = val));
        elMap.set(this, element);
        return element;
    }

    //
    get ["@virtual"]() { return true; };
    get children() { return null; };
}

//
export class El {
    children: any[];
    params: Params;
    selector: string;

    //
    constructor(selector, params = {}, children?) {
        this.children = children || observableArray([]);
        this.params   = params;
        this.selector = selector;
        
        //
        if (typeof this.selector != "string") { this.selector = this.element as any; }
    }

    //
    get element(): HTMLElement|DocumentFragment|Text {
        if (elMap.has(this)) {
            const el = elMap.get(this);
            if (el) { return el; };
        }

        // create new element if there is not for reflection
        const element = typeof this.selector == "string" ? createElement(this.selector) : this.selector;
        if (element instanceof HTMLElement) {
            reflectAttributes(element, this.params.attributes);
            reflectStyles(element, this.params.style);
            reflectClassList(element, this.params.classList);
            reflectProperties(element, this.params.properties);
            reflectDataset(element, this.params.dataset);

            // one-shot update
            this.params?.rules?.forEach?.((rule)=>{
                reflectWithStyleRules(element, rule);
            });

            //
            if (this.params.slot != null) element.slot = this.params.slot;
            if (this.params.part != null) element.setAttribute("part", this.params.part);
            if (this.params.name != null) element.setAttribute("name", this.params.name);
            if (this.params.type != null) element.setAttribute("type", this.params.type);
            if (this.params.icon != null) element.setAttribute("icon", this.params.icon);
            if (this.params.is != null) element.setAttribute("is", this.params.is);
            if (this.params.inert || this.params.inert == "") element.setAttribute("inert", "");

            // TODO: reflect with dataset
            //if (this.params.dataset != null) Object.assign(element.dataset, this.params.dataset);

            // if has event listeners, use it
            if (this.params.on) {
                Object.entries(this.params.on)?.forEach?.(([name, list])=>{
                    (list as any)?.values()?.forEach?.(fn => {
                        if (typeof fn == "function") {
                            element.addEventListener(name, fn, {});
                        } else {
                            element.addEventListener(name, fn?.[0], fn?.[1] || {});
                        }
                    });
                });
            }

            //
            if (this.params.hidden != null) {
                if (typeof this.params.hidden == "object" || typeof this.params.hidden == "function") {
                    subscribe([this.params.hidden, "value"], (val)=>{
                        if (element instanceof HTMLInputElement) {
                            element.hidden = val != null
                        } else {
                            if (val == null) { delete element.dataset.hidden; } else { element.dataset.hidden = ""; };
                        }
                    });
                } else {
                    const isNotHidden = !this.params.hidden && typeof this.params.hidden != "string";
                    if (element instanceof HTMLInputElement) {
                        element.hidden = !isNotHidden;
                    } else {
                        if (isNotHidden) { delete element.dataset.hidden; } else { element.dataset.hidden = ""; };
                    }
                }
            }
        }
        if (this.children) reflectChildren(element, this.children);
        elMap.set(this, element);
        return element;
    }

    //
    reform() {
        if ((this.element instanceof HTMLElement || this.element instanceof DocumentFragment) && this.children) {
            reformChildren(this.element, this.children);
        }
        return this;
    }

    //
    get ["@virtual"]() { return true; };
}

//
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

//
export const E = (selector, params = {}, children?)=>{
    return new El(selector, params, children);
}

//
export const T = (ref)=>{
    return new Tx(ref);
}

//
export default E;
