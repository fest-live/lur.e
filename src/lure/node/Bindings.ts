import { reflectBehaviors, reflectStores, reflectMixins, handleProperty, handleAttribute, handleHidden } from "fest/dom";
import { reflectClassList, reflectStyles, reflectDataset, reflectAttributes, reflectProperties, reflectWithStyleRules, reflectARIA } from '../context/Reflect';
import { reflectControllers, bindEvents, bindWith } from '../core/Binding';

//
import { subscribe } from "fest/object";
import { createElementVanilla } from "../context/Utils";
import { Q } from "./Queried";
import { reflectChildren } from "../context/ReflectChildren";
import M from "./Mapped";

//
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
    visible?: any;
    hidden?: any;
    aria?: any;
    rules?: any[];
};

// WILL not be released!
export const Qp = (ref, host = document.documentElement)=>{
    if (ref?.value == null) { return Q(ref, host); }
    const actual = Q(ref?.value, host);
    subscribe(ref, (value, prop)=>actual?._updateSelector(value));
    return actual;
}

//
const $createElement = (selector: string | HTMLElement | Node | DocumentFragment | Document | Element)=>{
    if (typeof selector == "string") {
        const nl = Qp(createElementVanilla(selector));
        return nl?.element ?? nl;
    } else if (selector instanceof HTMLElement || selector instanceof Element || selector instanceof DocumentFragment || selector instanceof Document || selector instanceof Node) {
        return selector;
    } else {
        return null;
    }
}

//
export const E = (selector: string | HTMLElement | Node | DocumentFragment | Document | Element, params: Params = {}, children?: any[]|any|null) => {
    const element = typeof selector == "string" ? $createElement(selector) : selector;
    if (element && children) { M(children, (el)=>el, element); /*reflectChildren(element, children);*/ }
    if (element && params) {
        if (params.ctrls != null) reflectControllers(element, params.ctrls);
        if (params.attributes != null) reflectAttributes(element, params.attributes);
        if (params.properties != null) reflectProperties(element, params.properties);
        if (params.classList != null) reflectClassList(element, params.classList);
        if (params.behaviors != null) reflectBehaviors(element, params.behaviors);
        if (params.dataset != null) reflectDataset(element, params.dataset);
        if (params.stores != null) reflectStores(element, params.stores);
        if (params.mixins != null) reflectMixins(element, params.mixins);
        if (params.style != null) reflectStyles(element, params.style);
        if (params.aria != null) reflectARIA(element, params.aria);

        //
        if (params.is != null) bindWith(element, "is", params.is, handleAttribute, params, true);
        if (params.role != null) bindWith(element, "role", params.role, handleProperty, params);
        if (params.slot != null) bindWith(element, "slot", params.slot, handleProperty, params);
        if (params.part != null) bindWith(element, "part", params.part, handleAttribute, params, true);
        if (params.name != null) bindWith(element, "name", params.name, handleAttribute, params, true);
        if (params.type != null) bindWith(element, "type", params.type, handleAttribute, params, true);
        if (params.icon != null) bindWith(element, "icon", params.icon, handleAttribute, params, true);
        if (params.inert != null) bindWith(element, "inert", params.inert, handleAttribute, params, true);
        if (params.hidden != null) bindWith(element, "hidden", params.visible ?? params.hidden, handleHidden, params);
        if (params.on != null) bindEvents(element, params.on);

        //
        if (params.rules != null) params.rules.forEach?.((rule) => reflectWithStyleRules(element, rule));
    };
    return element;
}

//
export default E;
