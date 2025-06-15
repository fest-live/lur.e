import { subscribe } from "u2re/object";
import { getNode } from "../utils/DOM";

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
 * Создаёт экземпляр Sw на основе переданных параметров.
 * @param {any} params - Параметры для создания Sw.
 * @returns {Sw} Экземпляр Sw.
 */
export const S = (params) => { return new Sw(params); }

//
export default S;
