import { makeReactive } from "fest/object";
import { reflectBehaviors, reflectStores, reflectMixins } from "fest/dom";
import { reflectClassList, reflectStyles, reflectDataset, reflectAttributes, reflectChildren, reflectProperties, reformChildren, reflectWithStyleRules, reflectARIA } from '../utils/Reflect';

//
import { createElement } from "../DOM/Utils";
import { bindEvents, reflectControllers, bindWith, $virtual, elMap } from '../core/Binding';
import { handleProperty, handleHidden, handleAttribute,  } from "../core/Handler";

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

/**
 * Класс виртуального элемента для управления DOM-элементами и их атрибутами, стилями, событиями и пр.
 */
export class El {
    /** Дочерние элементы */
    children: any[];
    /** Параметры элемента */
    params: Params;
    /** CSS-селектор или DOM-элемент */
    selector: string;

    /**
     * Обновляет дочерние элементы в DOM (реформирует структуру детей).
     * @returns {this} Текущий экземпляр класса.
     */
    reform() {
        if ((this.element instanceof HTMLElement || this.element instanceof DocumentFragment) && this.children) {
            reformChildren(this.element, this.children);
        }
        return this;
    }

    /**
     * Конструктор класса El.
     * @param {string | HTMLElement | DocumentFragment | Text} selector - строка селектора или DOM-узел.
     * @param {Params} [params={}] - параметры элемента.
     * @param {any[]} [children] - дочерние элементы или observableArray.
     */
    constructor(selector, params = {}, children?) {
        /** @type {any[]} */
        this.children = children || makeReactive([]);
        /** @type {Params} */
        this.params = params;
        /** @type {string} */
        this.selector = selector;

        // Если selector не строка, то считаем, что это элемент
        if (typeof this.selector != "string") {
            this.selector = this.element as any;
        }
    }

    /** @ignore */
    get [$virtual]() {
        return true;
    }

    /**
     * Возвращает или создает DOM-элемент, соответствующий данному виртуальному элементу.
     * Выполняет рефлексию атрибутов, стилей, событий, и т.д.
     * @returns {HTMLElement | DocumentFragment | Text} DOM-элемент
     */
    get element(): HTMLElement | DocumentFragment | Text {
        if (elMap.has(this)) {
            const el = elMap.get(this);
            if (el) {
                return el;
            }
        }

        /** @type {HTMLElement | DocumentFragment | Text} */
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

/**
 * Создаёт экземпляр El на основе CSS-селектора, параметров и детей.
 * @param {string} selector - CSS-селектор или имя тега для элемента.
 * @param {Object} [params={}] - Необязательный объект параметров (атрибуты, события и т.д.).
 * @param {any} [children] - Необязательные дочерние элементы или контент.
 * @returns {El} Экземпляр El.
 */
export const E = (selector, params = {}, children?) => { return new El(selector, params, children); }

//
export default E;
