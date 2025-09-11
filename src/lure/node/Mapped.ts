import { observe } from "fest/object";
import { getNode } from "../context/Utils";
import { $mapped } from "../core/Binding";
import { makeUpdater, reformChildren } from "../context/ReflectChildren";

//
class Mp {
    #observable?: any[];
    #fragments: DocumentFragment;
    #mapCb: any;
    #reMap: WeakMap<any, any>;
    #updater: any;

    //
    constructor(observable, mapCb = (el) => el) {
        this.#reMap = new WeakMap();
        this.#fragments = document.createDocumentFragment();
        this.#mapCb = mapCb ?? ((el) => el);
        this.#updater = makeUpdater(null, this.mapper.bind(this));
        observe?.(this.#observable = observable, this._onUpdate.bind(this));
    }

    //
    get [$mapped]() { return true; }

    //
    get children() { return this.#observable; }
    get element(): HTMLElement | DocumentFragment | Text | null {
        const existsNode = getNode(this.#observable?.[0], this.mapper.bind(this));
        return (existsNode?.parentElement ?? (reformChildren(
            this.#fragments, this.#observable,
            this.mapper.bind(this)
        )));
    }

    //
    get mapper() {
        return (...args) => {
            if (typeof args?.[0] == "object" || typeof args?.[0] == "function") {
                // @ts-ignore
                return this.#reMap.getOrInsert(args?.[0], this.#mapCb(...args));
            }
            return this.#mapCb(...args);
        }
    }

    //
    _onUpdate(newEl, idx, oldEl, op: string | null = "@add") {
        return this.#updater?.(newEl, idx, oldEl, op);
    }
}

//
export const M = (observable, mapCb?) => { return new Mp(observable, mapCb); };

//
export default M;
