import { observe } from "fest/object";
import { getNode, removeNotExists } from "../context/Utils";
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
const isValidParent = (parent: Node|null|undefined) => {
    return (parent != null && parent instanceof HTMLElement && !(parent instanceof DocumentFragment || parent instanceof HTMLBodyElement)) ? parent : null;
}

//
const isPrimitive = (value: any) => {
    return (value != null && (typeof value == "string" || typeof value == "number" || typeof value == "boolean"));
}

//
const isHasPrimitives = (observable: any) => {
    return observable?.some?.(isPrimitive);
}

//
interface MappedOptions {
    uniquePrimitives?: boolean;
    removeNotExistsWhenHasPrimitives?: boolean;
    boundParent?: Node | null;
    preMap?: boolean;
}

//
class Mp {
    #observable?: any[];
    #fragments: DocumentFragment;
    #mapCb: any;
    #reMap: WeakMap<any, any>;
    #pmMap: Map<any, any>;
    #updater: any = null;
    #internal: any = null;
    #options: MappedOptions = {} as MappedOptions;

    //
    #boundParent: Node | null = null;

    //
    makeUpdater(basisParent: Node | null = null) {
        if (basisParent) {
            this.#internal?.(); this.#internal = null; this.#updater = null;
            this.#updater ??= makeUpdater(basisParent, this.mapper.bind(this), true);
            this.#internal ??= observe?.(this.#observable, this._onUpdate.bind(this));
        }
    }

    //
    get boundParent() { return this.#boundParent; }
    set boundParent(value: Node | null) {
        if (value instanceof HTMLElement && isValidParent(value)) {
            this.#boundParent = value;
            this.makeUpdater(value);
        }
    }

    //
    constructor(observable, mapCb = (el) => el, options: Node | null | MappedOptions = { removeNotExistsWhenHasPrimitives: true, uniquePrimitives: true, preMap: true } as MappedOptions) {
        this.#reMap = new WeakMap();
        this.#pmMap = new Map<any, any>();
        this.#mapCb = mapCb ?? ((el) => el);
        this.#observable = observable;
        this.#fragments = document.createDocumentFragment();
        this.#options = (isValidParent(options as any) ? null : (options as MappedOptions|null)) || ({ removeNotExistsWhenHasPrimitives: true, uniquePrimitives: true, preMap: true } as MappedOptions);
        this.boundParent = isValidParent(this.#options?.boundParent) ?? isValidParent(options as any);
        if (!this.boundParent) {
            if (this.#options.preMap) reformChildren(
                this.#fragments, this.#observable,
                this.mapper.bind(this)
            );
        }
    }

    //
    get [$mapped]() { return true; }

    //
    elementForPotentialParent(requestor: any) {
        this.boundParent = requestor;
        return this.element;
        /*Promise.resolve().then(() => {
            const element = getNode(this.#observable?.[0], this.mapper.bind(this), 0);
            if (!element || !requestor || element?.contains?.(requestor) || requestor == element) {
                return;
            }
            if (!this.boundParent && requestor instanceof HTMLElement && isValidParent(requestor)) {
                if (Array.from(requestor?.children).find((node) => node === element)) {
                    this.boundParent = requestor;
                } else {
                    const observer = new MutationObserver((records) => {
                        for (const record of records) {
                            if (record.type === "childList") {
                                if (record.addedNodes.length > 0) {
                                    const connectedNode = Array.from((record.addedNodes as any) || []).find((node) => node === element);
                                    if (connectedNode) {
                                        this.boundParent = requestor;
                                        observer.disconnect();
                                    }
                                }
                            }
                        }
                    });
                    observer.observe(requestor, { childList: true });
                }
            }
        });
        return this.element;*/
    }

    //
    get children() { return this.#observable; }

    //
    get self(): HTMLElement | DocumentFragment | Text | null {
        const existsNode = getNode(this.#observable?.[0], this.mapper.bind(this), 0);
        const theirParent = isValidParent(existsNode?.parentElement) ? existsNode?.parentElement : this.boundParent;

        //
        if (theirParent) {
            this.boundParent ??= theirParent ?? this.boundParent;
        }

        //
        return (theirParent ?? (reformChildren(
            this.#fragments, this.#observable,
            this.mapper.bind(this)
        )));
    }

    //
    get element(): HTMLElement | DocumentFragment | Text | null {
        return this.#fragments?.childElementCount > 0 ? this.#fragments : getNode(this.#observable?.[0], this.mapper.bind(this), 0);
    }

    //
    get mapper() {
        return (...args) => {
            if (args?.[0] instanceof Node) { return args?.[0]; };
            if (args?.[1] == null || args?.[1] < 0 || (typeof args?.[1] != "number" || !canBeInteger(args?.[1]))) {
                return args?.[0];
            }

            //
            if (args?.[0] != null && (typeof args?.[0] == "object" || typeof args?.[0] == "function" || typeof args?.[0] == "symbol")) { // @ts-ignore
                return this.#reMap.getOrInsert(args?.[0], this.#mapCb(...args));
            }

            // prevalence of Set typed
            if (args?.[0] != null && this.#observable instanceof Set) { // @ts-ignore
                return this.#pmMap.getOrInsert(args?.[0], this.#mapCb(...args));
            }

            // array may has same values twice, no viable solution...
            if (args?.[0] != null) {
                if (this.#options?.uniquePrimitives && isPrimitive(args?.[0])) { // @ts-ignore
                    return this.#pmMap.getOrInsert(args?.[0], this.#mapCb(...args));
                } else {
                    return this.#mapCb(...args);
                }
            }
        }
    }

    //
    _onUpdate(newEl, idx, oldEl, op: string | null = "@add") {
        // keep cache clear from garbage (unique primitives mode)
        if ((op == "@remove" || op == "@set") && isPrimitive(oldEl) && oldEl != newEl && this.#options?.uniquePrimitives) {
            this.#pmMap.delete(oldEl);
        }
        if (Array.isArray(this.#observable) && (this.#options?.removeNotExistsWhenHasPrimitives ? (isHasPrimitives(this.#observable) || isPrimitive(oldEl)) : false) && this.#observable?.length < 1) {
            removeNotExists(this.boundParent, this.#observable?.map?.((nd, index) => getNode(nd, this.mapper, index, this.boundParent)));
        }
        return this.#updater?.(newEl, idx, oldEl, op, this.boundParent);
    }
}

//
export const M = (observable, mapCb?, boundParent: Node | null | MappedOptions = null) => {
    return new Mp(observable, mapCb, boundParent);
};

//
export default M;
