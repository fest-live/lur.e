import { observe } from "fest/object";
import { $mapped } from "../core/Binding";
import { getNode, appendFix, removeNotExists } from "../context/Utils";
import { makeUpdater, reformChildren } from "../context/ReflectChildren";
import { canBeInteger, isObservable, isPrimitive, isHasPrimitives } from "fest/core";
import { isValidParent } from "fest/dom";

//
interface MappedOptions {
    uniquePrimitives?: boolean;
    removeNotExistsWhenHasPrimitives?: boolean;
    boundParent?: Node | null;
    preMap?: boolean;
}

//
const asArray = (children)=>{
    if (children instanceof Map || children instanceof Set) {
        children = Array.from(children?.values?.());
    }
    return children;
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
            this.#updater ??= makeUpdater(basisParent, this.mapper.bind(this), Array.isArray(this.#observable));
            this.#internal ??= observe?.(this.#observable, this._onUpdate.bind(this));
        }
    }

    //
    get boundParent() {
        return this.#boundParent;
    }
    set boundParent(value: Node | null) {
        if (value instanceof HTMLElement && isValidParent(value) && value != this.#boundParent) {
            this.#boundParent = value; this.makeUpdater(value); const element = this.element;
            //if (element && element instanceof DocumentFragment) { appendFix(this.#boundParent, element); };
        }
    }

    //
    constructor(observable, mapCb: any = (el) => el, options: Node | null | MappedOptions = /*{ removeNotExistsWhenHasPrimitives: true, uniquePrimitives: true, preMap: true } as MappedOptions*/ null) {
        // swap arguments (JSX compatibility)
        if (isObservable(mapCb) && ((typeof observable == "function" || typeof observable == "object") && !isObservable(observable))) {
            [observable, mapCb] = [mapCb, observable] as [any, any];
        }

        // may be unified with options, if isn't exists (JSX compatibility)
        if (!options && (mapCb != null && typeof mapCb == "object") && !isObservable(mapCb)) {
            options = mapCb as MappedOptions;
        }

        //
        this.#reMap = new WeakMap();
        this.#pmMap = new Map<any, any>(); // make 'mapper' compatible with React syntax ('mapper' property instead of function)
        this.#mapCb = (mapCb != null ? (typeof mapCb == "function" ? mapCb : (typeof mapCb == "object" ? mapCb?.mapper : null)) : null) ?? ((el) => el);
        this.#observable = (isObservable(observable) ? observable : (observable?.iterator ?? mapCb?.iterator ?? observable)) ?? [];
        this.#fragments = document.createDocumentFragment();

        //
        const $baseOptions = { removeNotExistsWhenHasPrimitives: true, uniquePrimitives: true, preMap: true } as MappedOptions;
        const $newOptions = (isValidParent(options as any) ? null : (options as MappedOptions|null)) || {};
        this.#options = Object.assign($baseOptions, $newOptions);

        //
        this.boundParent = isValidParent(this.#options?.boundParent as any) ?? (isValidParent(options as any) ?? null);
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
        Promise.try(() => {
            const element = getNode(this.#observable?.[0], this.mapper.bind(this), 0);
            if (!element || !requestor || element?.contains?.(requestor) || requestor == element) {
                return;
            }
            if (requestor instanceof HTMLElement && isValidParent(requestor)) {
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
        })?.catch?.(console.warn.bind(console));

        //
        return this.element;
    }

    //
    get children() { return asArray(this.#observable); }

    //
    get self(): HTMLElement | DocumentFragment | Text | null {
        const existsNode = getNode(this.#observable?.[0], this.mapper.bind(this), 0);
        const theirParent = isValidParent(existsNode?.parentElement) ? existsNode?.parentElement : this.boundParent;
        this.boundParent ??= isValidParent(theirParent) ?? this.boundParent;

        //
        Promise.resolve()?.then?.(()=>{
            const theirParent = isValidParent(existsNode?.parentElement) ? existsNode?.parentElement : this.boundParent;
            this.boundParent ??= isValidParent(theirParent) ?? this.boundParent;
        });

        //
        return (theirParent ?? this.boundParent ?? (reformChildren(
            this.#fragments, this.#observable,
            this.mapper.bind(this)
        )));
    }

    //
    get element(): HTMLElement | DocumentFragment | Text | null {
        const children = this.#fragments?.childElementCount > 0 ? this.#fragments : getNode(this.#observable?.[0], this.mapper.bind(this), 0);
        const theirParent = isValidParent(children?.parentElement) ? children?.parentElement : this.boundParent;
        this.boundParent ??= isValidParent(theirParent) ?? this.boundParent;

        //
        Promise.resolve()?.then?.(()=>{
            const theirParent = isValidParent(children?.parentElement) ? children?.parentElement : this.boundParent;
            this.boundParent ??= isValidParent(theirParent) ?? this.boundParent;
        });

        //
        return children;
    }

    //
    get mapper() {
        return (...args) => {
            if (args?.[0] instanceof Node) { return args?.[0]; };

            // unsupported
            if (args?.[0] instanceof Promise || typeof (args?.[0] as any)?.then == "function") { return null; };

            //
            if (
                (args?.[1] == null || args?.[1] < 0 || (typeof args?.[1] != "number" || !canBeInteger(args?.[1] as any))) &&
                (Array.isArray(this.#observable) || ((this.#observable as any) instanceof Set))
            ) { return; }

            //
            if (args?.[0] != null && (typeof args?.[0] == "object" || typeof args?.[0] == "function" || typeof args?.[0] == "symbol")) // @ts-ignore
                { return this.#reMap.getOrInsert(args?.[0], this.#mapCb(...args)); }

            // prevalence of Set typed
            if (args?.[0] != null && this.#observable instanceof Set) // @ts-ignore
                { return this.#pmMap.getOrInsert(args?.[0], this.#mapCb(...args)); }

            // prevalence of Map typed
            if (args?.[0] != null && this.#observable instanceof Map) {
                // unique value in map
                if (typeof args?.[0] == "object" || typeof args?.[0] == "function" || typeof args?.[0] == "symbol") // @ts-ignore
                    { return this.#reMap.getOrInsert(args?.[0], this.#mapCb(...args)); } else
                // unique key in map (objects)
                if (typeof args?.[1] == "object" || typeof args?.[1] == "function" || typeof args?.[1] == "symbol") // @ts-ignore
                    { return this.#reMap.getOrInsert(args?.[1], this.#mapCb(...args)); } else // @ts-ignore
                    { return this.#pmMap.getOrInsert(args?.[1], this.#mapCb(...args)); }
            }

            // array may has same values twice, no viable solution...
            if (args?.[0] != null) {
                if (this.#options?.uniquePrimitives && isPrimitive(args?.[0])) // @ts-ignore
                    { return this.#pmMap.getOrInsert(args?.[0], this.#mapCb(...args)); } else
                    { return this.#mapCb(...args); }
            }
        }
    }

    //
    _onUpdate(newEl, idx, oldEl, op: string | null = "") {
        // keep cache clear from garbage (unique primitives mode)
        if ((op == "@remove" || op == "@set") && isPrimitive(oldEl) && oldEl != newEl && this.#options?.uniquePrimitives)
            { this.#pmMap.delete(oldEl); }

        //
        const __mapped = asArray(this.#observable); const __keys = Array.from(this.#observable?.keys?.() || []);
        if (Array.isArray(__mapped) && (this.#options?.removeNotExistsWhenHasPrimitives ? (isHasPrimitives(__mapped) || isPrimitive(oldEl)) : false) && __mapped?.length < 1)
            { removeNotExists(this.boundParent, __mapped?.map?.((nd, index) => getNode(nd, this.mapper, __keys?.[index] ?? index, this.boundParent)) || []); }

        //
        const byOldEl = getNode(oldEl, this.mapper, Number.isInteger(idx) ? idx : -1);
        const try0 = Array.from(((byOldEl?.parentNode ?? this.boundParent) as any)?.childNodes || [])?.indexOf?.(byOldEl);
        const try1 = __mapped?.indexOf?.(newEl);
        const byNewEl = getNode(newEl, this.mapper, Number.isInteger(idx) ? idx : (try1 < 0 ? idx : try1), this.boundParent);

        //
        return this.#updater?.(
            byNewEl, Number.isInteger(idx) ? idx : (try0 < 0 ? try1 : try0),
            byOldEl,
            op || (Array.isArray(this.#observable) ? "@add" : ""),
            this.boundParent);
    }

    // generator and iterator
    *[Symbol.iterator]() {
        let i=0;
        if (this.#observable) {
            for (let el of this.#observable)
                { yield this.mapper(el, i++); }
        }
        return;
    }
}

//
export const M = (observable, mapCb?, boundParent: Node | null | MappedOptions = null) => {
    return new Mp(observable, mapCb, boundParent);
};

//
export default M;
