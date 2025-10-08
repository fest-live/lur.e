import { observe } from "fest/object";
import { getNode } from "../context/Utils";
import { $mapped } from "../core/Binding";
import { makeUpdater, reformChildren } from "../context/ReflectChildren";

//
const integerRegExp = /^\d+$/;

//
const canBeInteger = (value: any) => {
    if (typeof value == "string") {
        return value?.trim?.() && integerRegExp.test(value?.trim?.()) && Number.isInteger(Number(value?.trim?.())) && Number(value?.trim?.()) >= 0;
    } else
        return typeof value == "number" && Number.isInteger(value) && value >= 0;
}

//
class Mp {
    #observable?: any[];
    #fragments: DocumentFragment;
    #mapCb: any;
    #reMap: WeakMap<any, any>;
    #updater: any;

    //
    boundParent: Node | null = null;

    //
    constructor(observable, mapCb = (el) => el, boundParent: Node | null = null) {
        this.#reMap = new WeakMap();
        this.#fragments = document.createDocumentFragment();
        this.#mapCb = mapCb ?? ((el) => el);
        this.#updater = makeUpdater((this.boundParent = boundParent ?? this.boundParent) ?? this.#fragments, this.mapper.bind(this), Array.isArray(observable));
        observe?.(this.#observable = observable, this._onUpdate.bind(this));
    }

    //
    get [$mapped]() { return true; }

    //
    get children() { return this.#observable; }
    get element(): HTMLElement | DocumentFragment | Text | null {
        const existsNode = getNode(this.#observable?.[0], this.mapper.bind(this), -1);
        if (existsNode?.parentElement) {
            this.boundParent ??= existsNode?.parentElement ?? this.boundParent;
        }
        return (existsNode?.parentElement ?? (reformChildren(
            this.#fragments, this.#observable,
            this.mapper.bind(this)
        )));
    }

    //
    get mapper() {
        return (...args) => {
            if (args?.[1] == null || args?.[1] < 0 || (typeof args?.[1] != "number" || !canBeInteger(args?.[1]))) return;
            if (args?.[0] != null && (typeof args?.[0] == "object" || typeof args?.[0] == "function")) {
                // @ts-ignore
                return this.#reMap.getOrInsert(args?.[0], this.#mapCb(...args));
            }
            return this.#mapCb(...args);
        }
    }

    //
    _onUpdate(newEl, idx, oldEl, op: string | null = "@add") {
        return this.#updater?.(newEl, idx, oldEl, op, this.boundParent);
    }
}

//
export const M = (observable, mapCb?, boundParent: Node | null = null) => { return new Mp(observable, mapCb, boundParent); };

//
export default M;
