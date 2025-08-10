import { makeReactive } from "fest/object";
import { reflectBehaviors, reflectStores, reflectMixins } from "fest/dom";
import { reflectClassList, reflectStyles, reflectDataset, reflectAttributes, reflectChildren, reflectProperties, reformChildren, reflectWithStyleRules, reflectARIA } from '../utils/Reflect';

//
import { createElement } from "../DOM/Utils";
import { bindEvents, reflectControllers, bindWith, $virtual, elMap } from '../core/Binding';
import { handleProperty, handleHidden, handleAttribute,  } from "../core/Handler";

interface Params {
    classList?: Set<string>;
    attributes?: any;
    dataset?: any;
    properties?: any;
    behaviors?: any;
    stores?: any[] | Set<any> | Map<any, any>;
    style?: any | string;
    slot?: any | string;
    name?: any | string;
    type?: any | string;
    icon?: any | string;
    role?: any | string;
    inert?: boolean | string;
    mixins?: any;
    ctrls?: any;
    is?: any | string;
    part?: any | string;
    on?: any;
    hidden?: any;
    aria?: any;
    rules?: any[];
};

export class El {
    children: any[];
    params: Params;
    selector: string;

    reform() {
        if ((this.element instanceof HTMLElement || this.element instanceof DocumentFragment) && this.children) {
            reformChildren(this.element, this.children);
        }
        return this;
    }

    constructor(selector, params = {}, children?) {
        this.children = children || makeReactive([]);
        this.params = params;
        this.selector = selector;

        // Если selector не строка, то считаем, что это элемент
        if (typeof this.selector != "string") {
            this.selector = this.element as any;
        }
    }

    get [$virtual]() {
        return true;
    }

    get element(): HTMLElement | DocumentFragment | Text {
        if (elMap.has(this)) {
            const el = elMap.get(this);
            if (el) {
                return el;
            }
        }

        const element =
            typeof this.selector == "string"
                ? createElement(this.selector)
                : this.selector;

        //
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

            //
            bindWith(element, "role", this.params.role, handleProperty, this.params);
            bindWith(element, "slot", this.params.slot, handleProperty, this.params);
            bindWith(element, "part", this.params.part, handleAttribute, this.params, true);
            bindWith(element, "name", this.params.name, handleAttribute, this.params, true);
            bindWith(element, "type", this.params.type, handleAttribute, this.params, true);
            bindWith(element, "icon", this.params.icon, handleAttribute, this.params, true);
            bindWith(element, "is", this.params.is, handleAttribute, this.params, true);
            bindWith(element, "inert", this.params.inert, handleAttribute, this.params, true);
            bindWith(element, "hidden", this.params.hidden, handleHidden, this.params);
            bindEvents(element, this.params.on);

            //
            this.params?.rules?.forEach?.((rule) => reflectWithStyleRules(element, rule));
        }

        // Отражение детей
        if (this.children) reflectChildren(element, this.children);
        elMap.set(this, element);
        return element;
    }
}

export const E = (selector, params = {}, children?) => { return new El(selector, params, children); }

//
export default E;
