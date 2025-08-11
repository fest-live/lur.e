import { observe } from "fest/object";
import { getNode } from "../context/Utils";
import { $mapped } from "../core/Binding";
import { reformChildren } from "../context/Reflect";

//
class Mp {
    #observable?: any[];
    #fragments: DocumentFragment;
    #mapCb: any;
    #reMap: WeakMap<any, any>;

    //
    constructor(observable, mapCb = (el) => el) {
        this.#reMap = new WeakMap();
        this.#fragments = document.createDocumentFragment();
        this.#mapCb = mapCb ?? ((el) => el);
        observe?.(this.#observable = observable, this._onUpdate.bind(this));
        this._onUpdate();
    }

    //
    get [$mapped]() { return true; }
    get element(): HTMLElement | DocumentFragment | Text | null { return this.#fragments; }
    get children() { return this.#observable; }

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
    _onUpdate(newEl, idx, oldEl, op) {
        const pel = (getNode(newEl ?? oldEl ?? this.#observable?.[0], this.mapper.bind(this))?.parentElement ?? this.#fragments);
        Array.from(pel?.childNodes)?.forEach?.((nd: any) => nd?.remove?.());
        return reformChildren(
            pel,
            this.#observable,
            this.mapper.bind(this)
        );
    }
}

//
export const M = (observable, mapCb?) => { return new Mp(observable, mapCb); };

//
export default M;
