import { observe } from "fest/object";
import { getNode } from "../context/Utils";
import { $mapped } from "../core/Binding";
import { reformChildren } from "../context/Reflect";

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
        this.#reMap = new WeakMap();
        this.#fragments = document.createDocumentFragment();
        this.#mapCb = mapCb ?? ((el) => el);
        observe?.(this.#observable = observable, () => this._onUpdate());
        this._onUpdate();
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
        Array.from(this.#fragments?.childNodes)?.forEach?.((nd) => nd?.remove?.());
        return reformChildren(
            (getNode(this.#observable?.[0], this.mapper.bind(this))?.parentElement ?? this.#fragments),
            this.#observable,
            this.mapper.bind(this)
        );
    }
}

/**
 * Создаёт экземпляр Mp на основе переданного observable и функции отображения.
 * @param {any} observable - Наблюдаемый объект или значение.
 * @param {Function} [mapCb] - Необязательная функция отображения значений observable.
 * @returns {Mp} Экземпляр Mp.
 */
export const M = (observable, mapCb?) => { return new Mp(observable, mapCb); }

//
export default M;
