
import { subscribe, observableArray, computed, observe } from "u2re/object";
import { reflectBehaviors, reflectStores, reflectMixins } from "u2re/dom";
import { reflectClassList, reflectStyles, reflectDataset, reflectAttributes, reflectChildren, reflectProperties, reformChildren, reflectWithStyleRules, reflectARIA } from './Reflect';

//
import { createElement, elMap, getNode } from "./DOM";
import { $mapped, reflectControllers } from './Binding';

//
interface Params {
    classList?: Set<string>;
    attributes?: any;
    dataset?: any;
    properties?: any;
    behaviors?: any;
    stores?: any[]|Set<any>|Map<any,any>;
    style?: any|string;
    slot?: any|string;
    name?: any|string;
    type?: any|string;
    icon?: any|string;
    role?: any|string;
    inert?: boolean|string;
    mixins?: any;
    ctrls?: any;
    is?: any|string;
    part?: any|string;
    on?: any;
    hidden?: any;
    aria?: any;
    rules?: any[];
};

//
export class El {
    children: any[];
    params: Params;
    selector: string;

    //
    reform() { if ((this.element instanceof HTMLElement || this.element instanceof DocumentFragment) && this.children) { reformChildren(this.element, this.children); }; return this; }
    constructor(selector, params = {}, children?) {
        this.children = children || observableArray([]);
        this.params   = params;
        this.selector = selector;

        //
        if (typeof this.selector != "string") { this.selector = this.element as any; }
    }

    //
    get ["@virtual"]() { return true; };
    get element(): HTMLElement|DocumentFragment|Text {
        if (elMap.has(this)) {
            const el = elMap.get(this);
            if (el) { return el; };
        }

        // create new element if there is not for reflection
        const element = typeof this.selector == "string" ? createElement(this.selector) : this.selector;
        if (element instanceof HTMLElement && this.params) {
            reflectAttributes(element, this.params.attributes);
            reflectStyles(element, this.params.style);
            reflectClassList(element, this.params.classList);
            reflectProperties(element, this.params.properties);
            reflectDataset(element, this.params.dataset);
            reflectARIA(element, this.params.aria);
            reflectBehaviors(element, this.params.behaviors);
            reflectStores(element, this.params.stores);
            reflectMixins(element, this.params.mixins);
            reflectControllers(element, this.params.ctrls);

            // one-shot update
            this.params?.rules?.forEach?.((rule)=>{
                reflectWithStyleRules(element, rule);
            });

            //
            if (this.params.role != null) element.role = this.params.role?.value ?? this.params.role;
            if (this.params.slot != null) element.slot = this.params.slot?.value ?? this.params.slot;
            if (this.params.part != null) element.setAttribute("part", this.params.part?.value ?? this.params.part);
            if (this.params.name != null) element.setAttribute("name", this.params.name?.value ?? this.params.name);
            if (this.params.type != null) element.setAttribute("type", this.params.type?.value ?? this.params.type);
            if (this.params.icon != null) element.setAttribute("icon", this.params.icon?.value ?? this.params.icon);
            if (this.params.is != null) element.setAttribute("is", this.params.is?.value ?? this.params.is);
            if (this.params.inert || this.params.inert == "") element.setAttribute("inert", "");

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
}



export class Mp {
    #observable?: any[];
    #fragments: DocumentFragment;
    #mapCb: any;
    #reMap: WeakMap<any, any>;

    //
    constructor(observable, mapCb = (el)=>el) {
        this.#fragments = document.createDocumentFragment();
        this.#mapCb = mapCb ?? ((el)=>el);
        this.#reMap = new WeakMap(); this._onUpdate();
        observe?.(this.#observable = observable, () => this._onUpdate());
    }

    //
    get [$mapped]() { return true; }
    get element (): HTMLElement|DocumentFragment|Text|null { return this.#fragments; }
    get children() { return this.#observable; }
    get mapper  () {
        return (...args)=>{
            if (typeof args?.[0] == "object" || typeof args?.[0] == "function") {
                return this.#reMap.getOrInsert(args?.[0], this.#mapCb(...args));
            }
            return this.#mapCb(...args);
        }
    }

    //
    _onUpdate() { return reformChildren((getNode(this.#observable?.[0], this.mapper)?.parentNode ?? this.#fragments), this.#observable, this.mapper); }
}

//
export const M = (observable, mapCb?)=>{ return new Mp(observable, mapCb); }
export const E = (selector, params = {}, children?)=>{ return new El(selector, params, children); }

//
interface SwitchedParams {
    index: {value: number}; // Любой computed-индексатор
    children: any[];
}

//
export class Switched {
    params : SwitchedParams;
    current: number = -1;

    constructor(params: SwitchedParams) {
        this.params = params;
        this.current = this.params.index?.value ?? -1;this._onUpdate();
        subscribe([this.params.index, "value"], () => this._onUpdate());
    }

    get element() {
        if (this.current < 0) return document.createDocumentFragment();
        return getNode(this.params.children?.[this.current]);
    }

    _onUpdate() {
        const idx = this.params.index?.value ?? -1;
        if (idx !== this.current) {
            const old = this.current; this.current = idx;

            //
            const parent = getNode(this.params.children?.[old])?.parentNode;
            const newNode = idx >= 0 ? getNode(this.params.children?.[idx]) : null;
            const oldNode = old >= 0 ? getNode(this.params.children?.[old]) : null;

            //
            if (parent && newNode) {
                if (oldNode) {
                    try { oldNode.replaceWith(newNode); } catch (e) { console.warn(e); }
                } else {
                    parent.appendChild(newNode);
                }
            } else if (oldNode && !newNode) {
                oldNode.remove();
            }
        }
    }
}

// TODO: support for `computed` from wrapped arrays
export const conditionalIndex = (condList: any[])=>{
    const comp = computed(condList, () => condList.findIndex(cb => cb?.()));
    return comp;
}


//
export default E;
