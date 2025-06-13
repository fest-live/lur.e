
import { subscribe, observableArray, computed, observe } from "u2re/object";
import { reflectBehaviors, reflectStores, reflectMixins } from "u2re/dom";
import { reflectClassList, reflectStyles, reflectDataset, reflectAttributes, reflectChildren, reflectProperties, reformChildren, reflectWithStyleRules, reflectARIA } from './Reflect';

//
import { createElement, elMap, getNode } from "./DOM";
import { $mapped, $virtual, reflectControllers } from './Binding';

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
        this.children = children || observableArray([]);
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

            // одноразовое обновление правил стилей
            this.params?.rules?.forEach?.((rule) => {
                reflectWithStyleRules(element, rule);
            });

            // устаналиваем атрибуты
            if (this.params.role != null) element.role = this.params.role?.value ?? this.params.role;
            if (this.params.slot != null) element.slot = this.params.slot?.value ?? this.params.slot;
            if (this.params.part != null) element.setAttribute("part", this.params.part?.value ?? this.params.part);
            if (this.params.name != null) element.setAttribute("name", this.params.name?.value ?? this.params.name);
            if (this.params.type != null) element.setAttribute("type", this.params.type?.value ?? this.params.type);
            if (this.params.icon != null) element.setAttribute("icon", this.params.icon?.value ?? this.params.icon);
            if (this.params.is != null) element.setAttribute("is", this.params.is?.value ?? this.params.is);
            if (this.params.inert || this.params.inert == "") element.setAttribute("inert", "");
            if (this.params.hidden || this.params.hidden == "") element.setAttribute("hidden", "");

            // обработчики событий
            if (this.params.on) {
                Object.entries(this.params.on)?.forEach?.(([name, list]) => {
                    (list as any)?.values()?.forEach?.((fn) => {
                        if (typeof fn == "function") {
                            element.addEventListener(name, fn, {});
                        } else {
                            element.addEventListener(name, fn?.[0], fn?.[1] || {});
                        }
                    });
                });
            }

            // состояние скрытости
            if (this.params.hidden != null) {
                if (typeof this.params.hidden == "object" || typeof this.params.hidden == "function") {
                    subscribe([this.params.hidden, "value"], (val) => {
                        if (element instanceof HTMLInputElement) { element.hidden = val != null; } else {
                            if (val == null) { delete element.dataset.hidden; } else { element.dataset.hidden = ""; }
                        }
                    });
                } else {
                    const isNotHidden = !this.params.hidden && typeof this.params.hidden != "string";
                    if (element instanceof HTMLInputElement) { element.hidden = !isNotHidden; } else { if (isNotHidden) { delete element.dataset.hidden; } else { element.dataset.hidden = ""; } }
                }
            }
        }
        // Отражение детей
        if (this.children) reflectChildren(element, this.children);
        elMap.set(this, element);
        return element;
    }
}

/**
 * Класс для отображения массива в DOM c использованием map-функции.
 */
/**
 * Mp - Класс-обёртка для управления списком наблюдаемых элементов и их отображением через map-коллбэк.
 */
export class Mp {
    /** @type {any[] | undefined} Массив наблюдаемых элементов. */
    #observable?: any[];

    /** @type {DocumentFragment} Фрагмент, в который монтируются элементы. */
    #fragments: DocumentFragment;

    /** @type {Function} Функция отображения элементов (map callback). */
    #mapCb: any;

    /** @type {WeakMap<any, any>} Кэш для уже сопоставленных элементов. */
    #reMap: WeakMap<any, any>;

    /**
     * Конструктор класса Mp.
     * @param {any[]} observable - Массив наблюдаемых элементов.
     * @param {(el: any) => any} [mapCb] - Функция отображения (map callback) для элементов.
     */
    constructor(observable, mapCb = (el) => el) {
        this.#fragments = document.createDocumentFragment();
        this.#mapCb = mapCb ?? ((el) => el);
        this.#reMap = new WeakMap();
        this._onUpdate();
        observe?.(this.#observable = observable, () => this._onUpdate());
    }

    /**
     * Флаг, что объект поддерживает отображение по map.
     * @type {boolean}
     * @readonly
     */
    get [$mapped]() { return true; }

    /**
     * Ссылка на корневой фрагмент документа.
     * @type {HTMLElement | DocumentFragment | Text | null}
     * @readonly
     */
    get element(): HTMLElement | DocumentFragment | Text | null { return this.#fragments; }

    /**
     * Возвращает исходный массив наблюдаемых элементов.
     * @type {any[] | undefined}
     * @readonly
     */
    get children() { return this.#observable; }

    /**
     * Mapper-функция для получения представления элемента.
     * @returns {(args: any[]) => any}
     */
    get mapper() {
        return (...args) => {
            if (typeof args?.[0] == "object" || typeof args?.[0] == "function") {
                // @ts-ignore
                return this.#reMap.getOrInsert(args?.[0], this.#mapCb(...args));
            }
            return this.#mapCb(...args);
        }
    }

    /**
     * Обновляет набор элементов в соответствии с наблюдаемым массивом.
     * @private
     * @returns {any}
     */
    _onUpdate() {
        return reformChildren(
            (getNode(this.#observable?.[0], this.mapper)?.parentNode ?? this.#fragments),
            this.#observable,
            this.mapper
        );
    }
}

/**
 * @typedef {Object} SwitchedParams
 * @property {{value: number}} index - индекс активного элемента
 * @property {any[]} mapped - массив маппированных элементов
 */
interface SwitchedParams {  // interactive or reactive iterator
    index: { value: number }; // candidates
    mapped: any[];
}

/**
 * @class Sw
 * A class for switching between DOM nodes based on a reactive index.
 */
export class Sw {
    /**
     * Parameters object for switched elements.
     * @type {SwitchedParams}
     */
    params: SwitchedParams;

    /**
     * The currently active index.
     * @type {number}
     * @default -1
     */
    current: number = -1;

    /**
     * Sw constructor.
     * @param {SwitchedParams} params - Parameters containing mapped nodes and reactive index.
     */
    constructor(params: SwitchedParams) {
        this.params = params;
        this.current = this.params.index?.value ?? -1;
        this._onUpdate();
        subscribe([this.params.index, "value"], () => this._onUpdate());
    }

    /**
     * Returns the DOM element fragment corresponding to the current index.
     * If no index is selected, returns an empty document fragment.
     * @returns {Node} The corresponding DOM Node or DocumentFragment.
     */
    get element(): Node {
        if (this.current < 0) return document.createDocumentFragment();
        return getNode(this.params.mapped?.[this.current]);
    }

    /**
     * Handles updates when the reactive index value changes.
     * Replaces or inserts DOM nodes as necessary based on index changes.
     * @private
     */
    _onUpdate(): void {
        const idx = this.params.index?.value ?? -1;
        if (idx !== this.current) {
            const old = this.current;
            this.current = idx;

            // Find parent and new/old nodes
            const parent = getNode(this.params.mapped?.[old])?.parentNode;
            const newNode = idx >= 0 ? getNode(this.params.mapped?.[idx]) : null;
            const oldNode = old >= 0 ? getNode(this.params.mapped?.[old]) : null;

            // Update DOM nodes accordingly
            if (parent && newNode) {
                if (oldNode) {
                    try {
                        oldNode.replaceWith(newNode);
                    } catch (e) {
                        console.warn(e);
                    }
                } else {
                    parent.appendChild(newNode);
                }
            } else if (oldNode && !newNode) {
                oldNode.remove();
            }
        }
    }
}

/**
 * Создаёт экземпляр Mp на основе переданного observable и функции отображения.
 * @param {any} observable - Наблюдаемый объект или значение.
 * @param {Function} [mapCb] - Необязательная функция отображения значений observable.
 * @returns {Mp} Экземпляр Mp.
 */
export const M = (observable, mapCb?) => { return new Mp(observable, mapCb); }

/**
 * Создаёт экземпляр El на основе CSS-селектора, параметров и детей.
 * @param {string} selector - CSS-селектор или имя тега для элемента.
 * @param {Object} [params={}] - Необязательный объект параметров (атрибуты, события и т.д.).
 * @param {any} [children] - Необязательные дочерние элементы или контент.
 * @returns {El} Экземпляр El.
 */
export const E = (selector, params = {}, children?) => { return new El(selector, params, children); }

/**
 * Создаёт экземпляр Sw на основе переданных параметров.
 * @param {any} params - Параметры для создания Sw.
 * @returns {Sw} Экземпляр Sw.
 */
export const S = (params) => { return new Sw(params); }


//
export default E;
