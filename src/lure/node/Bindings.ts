/*
 * Filename: Bindings.ts
 * FullPath: modules/projects/lur.e/src/lure/node/Bindings.ts
 * Change date and time: 20.36.00_15.08.2026
 * Reason for changes: Wrap primitive/Node children before M() so strings are not
 * treated as iterated observables (WeakMap key crash + empty #collection).
 */
import { reflectBehaviors, reflectStores, reflectMixins, handleProperty, handleAttribute, handleHidden, addEventsList, createElementVanilla } from "@fest-lib/dom";
import { reflectClassList, reflectStyles, reflectDataset, reflectAttributes, reflectProperties, reflectWithStyleRules, reflectARIA } from '../context/Reflect';
import { reflectControllers, bindWith } from '../core/Binding';

//
import { affected } from "@fest-lib/object";
import { isObservable as isCollection } from "@fest-lib/core";
import { Q } from "./Queried";
import { M } from "./Mapped";
import { getNode } from "../context/Utils";
import { bindStyle } from "../misc/Styles";

//
interface Params {
    classList?: Set<string>;
    attributes?: any;
    dataset?: any;
    properties?: any;
    behaviors?: any;
    stores?: any[] | Set<any> | Map<any, any>;
    style?: any | string;
    /** Binds element property (not attribute) — required for correct `<input>` / `<textarea>` value. */
    value?: any;
    placeholder?: any;
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
    affected(ref, (value, prop)=>actual?._updateSelector(value));
    return actual;
}

//
export const $createElement = (selector: string | HTMLElement | Node | DocumentFragment | Document | Element)=>{
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
/** Normalize E() children into a Mapped source (array / collection / observable). */
const childrenAsMappedSource = (children: any): any => {
    if (children == null || children === false) return null;
    // WHY: bare strings/numbers/Nodes are content items, not iterable sources.
    // Passing "Hello" to M() makes iterated() use a string as a WeakMap key.
    if (isCollection(children)) return children;
    if (children instanceof Node) return [children];
    if (typeof children === "object" || typeof children === "function") {
        // Observable refs / custom iterators stay as-is for Mapped.
        return children;
    }
    return [children];
};

//
export const E = (selector: string | HTMLElement | Node | DocumentFragment | Document | Element, params: Params = {}, children?: any[]|any|null) => {
    const element = getNode(typeof selector == "string" ? $createElement(selector) : selector, null, -1);
    const mappedSource = childrenAsMappedSource(children);
    if (element && mappedSource != null) { M(mappedSource, (el)=>el, element); /*reflectChildren(element, children);*/ }
    if (element && params) {
        if (params.ctrls != null) reflectControllers(element, params.ctrls);
        if (params.attributes != null) reflectAttributes(element, params.attributes);
        if (params.properties != null) reflectProperties(element, params.properties);
        if (params.classList != null) reflectClassList(element, params.classList);
        if (params.behaviors != null) reflectBehaviors(element, params.behaviors);
        if (params.dataset != null) reflectDataset(element, params.dataset);
        if (params.stores != null) reflectStores(element, params.stores);
        if (params.mixins != null) reflectMixins(element, params.mixins);
        if (params.style != null) {
            const apply =
                Array.isArray(params?.style)
                    ? params?.style[0]
                    : params?.style;
            if (apply != null && typeof apply == "function") {
                bindStyle(element, params.style);
            } else {
                reflectStyles(element, params.style);
            }
        }
        if (params.aria != null) reflectARIA(element, params.aria);
        if ("checked" in params) bindWith(element, "checked", params.checked, handleProperty, params, true);
        if ("value" in params) bindWith(element, "value", params.value, handleProperty, params, true);
        if ("valueAsNumber" in params) bindWith(element, "valueAsNumber", params.valueAsNumber, handleProperty, params, true);
        if ("placeholder" in params) bindWith(element, "placeholder", params.placeholder, handleProperty, params, true);
        if (params.is != null) bindWith(element, "is", params.is, handleAttribute, params, true);
        if (params.role != null) bindWith(element, "role", params.role, handleProperty, params);
        if (params.slot != null) bindWith(element, "slot", params.slot, handleProperty, params);
        if (params.part != null) bindWith(element, "part", params.part, handleAttribute, params, true);
        if (params.name != null) bindWith(element, "name", params.name, handleAttribute, params, true);
        if (params.type != null) bindWith(element, "type", params.type, handleAttribute, params, true);
        if (params.icon != null) bindWith(element, "icon", params.icon, handleAttribute, params, true);
        if (params.inert != null) bindWith(element, "inert", params.inert, handleAttribute, params, true);
        if (params.hidden != null) bindWith(element, "hidden", params.visible ?? params.hidden, handleHidden, params);
        if (params.on != null) addEventsList(element, params.on);

        //
        if (params.rules != null) params.rules.forEach?.((rule) => reflectWithStyleRules(element, rule));
    };
    return Q(element);
}

//
export default E;
