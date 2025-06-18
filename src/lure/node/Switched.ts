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
const SwM = {
    /**
     * Returns the DOM element fragment corresponding to the current index.
     * If no index is selected, returns an empty document fragment.
     * @returns {Node} The corresponding DOM Node or DocumentFragment.
     */
    get element(): Node {
        if (this.current < 0) return document.createDocumentFragment();
        return getNode(this.params.mapped?.[this.current]);
    },

    /**
     * Handles updates when the reactive index value changes.
     * Replaces or inserts DOM nodes as necessary based on index changes.
     * @private
     */
    _onUpdate(): void {
        const idx = this.params.index?.value ?? -1;
        if (idx !== this.current) {
            const old = this.current; this.current = idx;

            // Find parent and new/old nodes
            const parent  = getNode(this.params.mapped?.[old])?.parentNode;
            const newNode = idx >= 0 ? getNode(this.params.mapped?.[idx]) : null;
            const oldNode = old >= 0 ? getNode(this.params.mapped?.[old]) : null;

            // Update DOM nodes accordingly
            if (parent && newNode) {
                if (oldNode)
                    { try { oldNode.replaceWith(newNode); } catch (e) { console.warn(e); } } else
                    { parent.appendChild(newNode); }
            } else if (oldNode && !newNode) { oldNode.remove(); }
        }
    }
}

//
const inProx = new WeakMap(), contextify = (pc: any, name: any) =>
    { return (typeof pc?.[name] == "function" ? pc?.[name]?.bind?.(pc) : pc?.[name]); }

//
export class SwHandler implements ProxyHandler<SwitchedParams> {
    index: number = -1;
    constructor() {}

    get(params: SwitchedParams, name, ctx) {
        if (name in SwM) { return contextify(params, name); };
        return contextify(params?.mapped?.[this.index], name);
    }

    //
    set(params: SwitchedParams, name, val) { return Reflect.set(params?.mapped?.[this.index], name, val); }
    has(params: SwitchedParams, name) { return Reflect.has(params?.mapped?.[this.index], name); }
    deleteProperty(params: SwitchedParams, name) { return Reflect.deleteProperty(params?.mapped?.[this.index], name); }
    apply(params: SwitchedParams, thisArg, args) { return Reflect.apply(params?.mapped?.[this.index], thisArg, args); }
    getPrototypeOf(params: SwitchedParams) { return Reflect.getPrototypeOf(params?.mapped?.[this.index]); }
    getOwnPropertyDescriptor(params: SwitchedParams, name) { return Reflect.getOwnPropertyDescriptor(params?.mapped?.[this.index], name); }
    defineProperty(params: SwitchedParams, name, desc) { return Reflect.defineProperty(params?.mapped?.[this.index], name, desc); }
    preventExtensions(params: SwitchedParams) { return Reflect.preventExtensions(params?.mapped?.[this.index]); }
    isExtensible(params: SwitchedParams) { return Reflect.isExtensible(params?.mapped?.[this.index]); }
    ownKeys(params: SwitchedParams) { return Reflect.ownKeys(params?.mapped?.[this.index]); }
    setPrototypeOf(params: SwitchedParams, proto) { return Reflect.setPrototypeOf(params?.mapped?.[this.index], proto); }
}

/**
 * Создаёт экземпляр Sw на основе переданных параметров.
 * @param {any} params - Параметры для создания Sw.
 * @returns {Sw} Экземпляр Sw.
 */
export const S = (params: SwitchedParams) => { // @ts-ignore
    return inProx.getOrInsert(params, ()=>{
        const px = new Proxy(params, new SwHandler());
        subscribe([params?.index, "value"], () => (px as any)._onUpdate());
        return px;
    });
}

//
export default S;
