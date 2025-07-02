import { reflectBehaviors, reflectStores, reflectMixins, Q } from "u2re/dom";
import { reflectClassList, reflectStyles, reflectDataset, reflectAttributes, reflectChildren, reflectProperties, reflectWithStyleRules, reflectARIA } from '../context/Reflect';
import { reflectControllers, bindEvents, bindWith } from '../core/Binding';

//
import { subscribe } from "u2re/object";
import { createElement } from "../context/Utils";
import { handleProperty, handleAttribute, handleHidden } from "../core/Handler";

/**
 * Параметры для создания или конфигурирования элемента.
 * @typedef {Object} Params
 * @property {Set<string>} [classList]
 * @property {Object} [attributes]
 * @property {Object} [dataset]
 * @property {Object} [properties]
 * @property {Object} [behaviors]
 * @property {Array|Set|Map} [stores]
 * @property {Object|string} [style]
 * @property {string} [slot]
 * @property {string} [name]
 * @property {string} [type]
 * @property {string} [icon]
 * @property {string} [role]
 * @property {boolean|string} [inert]
 * @property {any} [mixins]
 * @property {any} [ctrls]
 * @property {string} [is]
 * @property {string} [part]
 * @property {Object} [on]
 * @property {any} [hidden]
 * @property {any} [aria]
 * @property {any[]} [rules]
 */
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

// WILL not be released!
export const Qp = (ref, host = document.documentElement)=>{
    if (ref?.value == null) { return Q(ref, host); }
    const actual = Q(ref?.value, host);
    subscribe(ref, (value, prop)=>actual?._updateSelector(value));
    return actual;
}

/**
 * Создаёт экземпляр El на основе CSS-селектора, параметров и детей.
 * @param {string} selector - CSS-селектор или имя тега для элемента.
 * @param {Object} [params={}] - Необязательный объект параметров (атрибуты, события и т.д.).
 * @param {any} [children] - Необязательные дочерние элементы или контент.
 * @returns {El} Экземпляр El.
 */
export const E = (selector: string | HTMLElement, params: Params = {}, children?: any[]|null) => {
    /** @type {HTMLElement | DocumentFragment | Text} */
    const element = typeof selector == "string" ? Qp(createElement(selector)) : selector;
    if (element && params) {
        reflectControllers(element, params.ctrls);
        reflectAttributes(element, params.attributes);
        reflectProperties(element, params.properties);
        reflectClassList(element, params.classList);
        reflectBehaviors(element, params.behaviors);
        reflectDataset(element, params.dataset);
        reflectStores(element, params.stores);
        reflectMixins(element, params.mixins);
        reflectStyles(element, params.style);
        reflectARIA(element, params.aria);

        //
        bindWith(element, "is", params.is, handleAttribute, params, true);
        bindWith(element, "role", params.role, handleProperty, params);
        bindWith(element, "slot", params.slot, handleProperty, params);
        bindWith(element, "part", params.part, handleAttribute, params, true);
        bindWith(element, "name", params.name, handleAttribute, params, true);
        bindWith(element, "type", params.type, handleAttribute, params, true);
        bindWith(element, "icon", params.icon, handleAttribute, params, true);
        bindWith(element, "inert", params.inert, handleAttribute, params, true);
        bindWith(element, "hidden", params.hidden, handleHidden, params);
        bindEvents(element, params.on);

        //
        params?.rules?.forEach?.((rule) => reflectWithStyleRules(element, rule));
    };
    if (children) reflectChildren(element, children); return element;
}

//
export default E;
