import { addToCallChain, subscribe } from "fest/object";
import { getNode  } from "../context/Utils";

//
const inProx = new WeakMap(), contextify = (pc: any, name: any) =>
    { return (typeof pc?.[name] == "function" ? pc?.[name]?.bind?.(pc) : pc?.[name]); }

/**
 * @typedef {Object} SwitchedParams
 * @property {{value: number}} index - индекс активного элемента
 * @property {any[]} mapped - массив маппированных элементов
 */
interface SwitchedParams {  // interactive or reactive iterator
    current: { value: number }; // candidates
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
        return getNode(this.mapped?.[this.current]);
    },

    /**
     * Handles updates when the reactive index value changes.
     * Replaces or inserts DOM nodes as necessary based on index changes.
     * @private
     */
    _onUpdate(): void {
        const idx = this.current?.value ?? -1;
        if (idx !== this.current) {
            const old = this.current; this.current = idx;

            // Find parent and new/old nodes
            const parent  = getNode(this.mapped?.[old])?.parentNode;
            const newNode = idx >= 0 ? getNode(this.mapped?.[idx]) : null;
            const oldNode = old >= 0 ? getNode(this.mapped?.[old]) : null;

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
export class SwHandler implements ProxyHandler<SwitchedParams> {
    constructor() {}

    //
    set(params: SwitchedParams, name, val) { return Reflect.set(params?.mapped?.[params?.current?.value], name, val); }
    has(params: SwitchedParams, name) { return Reflect.has(params?.mapped?.[params?.current?.value], name); }
    get(params: SwitchedParams, name, ctx) {
        if (name in SwM) { return contextify(params, name); };
        return contextify(params?.mapped?.[params?.current?.value ?? -1], name);
    }

    //
    ownKeys(params: SwitchedParams) { return Reflect.ownKeys(params?.mapped?.[params?.current?.value]); }
    apply(params: SwitchedParams, thisArg, args) { return Reflect.apply(params?.mapped?.[params?.current?.value], thisArg, args); }
    deleteProperty(params: SwitchedParams, name) { return Reflect.deleteProperty(params?.mapped?.[params?.current?.value], name); }
    setPrototypeOf(params: SwitchedParams, proto) { return Reflect.setPrototypeOf(params?.mapped?.[params?.current?.value], proto); }
    getPrototypeOf(params: SwitchedParams) { return Reflect.getPrototypeOf(params?.mapped?.[params?.current?.value]); }
    defineProperty(params: SwitchedParams, name, desc) { return Reflect.defineProperty(params?.mapped?.[params?.current?.value], name, desc); }
    getOwnPropertyDescriptor(params: SwitchedParams, name) { return Reflect.getOwnPropertyDescriptor(params?.mapped?.[params?.current?.value], name); }
    preventExtensions(params: SwitchedParams) { return Reflect.preventExtensions(params?.mapped?.[params?.current?.value]); }
    isExtensible(params: SwitchedParams) { return Reflect.isExtensible(params?.mapped?.[params?.current?.value]); }
}

/**
 * Создаёт экземпляр Sw на основе переданных параметров.
 * @param {any} params - Параметры для создания Sw.
 * @returns {Sw} Экземпляр Sw.
 */
export const S = (params: SwitchedParams) => { // @ts-ignore
    return inProx?.getOrInsertComputed?.(params, ()=>{
        const px = new Proxy(params, new SwHandler());
        const us = subscribe([params?.current, "value"], () => (px as any)._onUpdate());
        if (us) addToCallChain(px, Symbol.dispose, us); return px;
    });
}

//
export default S;
