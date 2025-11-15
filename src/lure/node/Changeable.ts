import { subscribe } from "fest/object";
import { appendFix, elMap, getNode, T } from "../context/Utils";
import { makeUpdater } from "../context/ReflectChildren";
import { isPrimitive, hasValue } from "fest/core";
import { isValidParent } from "fest/dom";
import { $mapped } from "../core/Binding";

//
interface ChangeableOptions {
    boundParent?: Node | null;
}

//
class Ch {
    #valueRef?: { value: any };
    #fragments: DocumentFragment;
    #updater: any = null;
    #internal: any = null;
    #updating: boolean = false;
    #options: ChangeableOptions = {} as ChangeableOptions;
    #oldNode: any; // in case, if '.value' is primitive, and can't be reused by maps
    //#reMap: WeakMap<any, any>; // reuse same object from value

    //
    #boundParent: Node | null = null;

    //
    makeUpdater(basisParent: Node | null = null) {
        if (basisParent) {
            this.#internal?.(); this.#internal = null; this.#updater = null;
            this.#updater ??= makeUpdater(basisParent, null, false);
            this.#internal ??= subscribe?.([this.#valueRef, "value"], this._onUpdate.bind(this));
        }
    }

    //
    get boundParent() { return this.#boundParent; }
    set boundParent(value: Node | null) {
        if (value instanceof HTMLElement && isValidParent(value) && value != this.#boundParent) {
            this.#boundParent = value; this.makeUpdater(value);
            if (this.#oldNode) { this.#oldNode?.parentNode != null && this.#oldNode?.remove?.(); this.#oldNode = null; };

            //
            const element = this.element;
            if (element) { appendFix(this.#boundParent, element); };
        }
    }

    //
    constructor(valueRef, mapCb: any = (el) => el, options: Node | null | ChangeableOptions = /*{ removeNotExistsWhenHasPrimitives: true, uniquePrimitives: true, preMap: true } as MappedOptions*/ null) {
        // swap arguments (JSX compatibility)
        if (hasValue(mapCb) && ((typeof valueRef == "function" || typeof valueRef == "object") && !hasValue(valueRef))) {
            [valueRef, mapCb] = [mapCb, valueRef] as [any, any];
        }

        // may be unified with options, if isn't exists (JSX compatibility)
        if (!options && (mapCb != null && typeof mapCb == "object") && !hasValue(mapCb)) {
            options = mapCb as ChangeableOptions;
        }

        //
        this.#valueRef  = valueRef;
        this.#fragments = document.createDocumentFragment();

        //
        const $baseOptions = { removeNotExistsWhenHasPrimitives: true, uniquePrimitives: true, preMap: true } as ChangeableOptions;
        const $newOptions = (isValidParent(options as any) ? null : (options as ChangeableOptions|null)) || {};
        this.#options = Object.assign($baseOptions, $newOptions);

        //
        this.boundParent = isValidParent(this.#options?.boundParent as any) ?? (isValidParent(options as any) ?? null);
    }

    //
    $getNodeBy(requestor?: any, value?: any) {
        const node = isPrimitive(hasValue(value) ? value?.value : value) ? T(value) : getNode(value, null, -1, requestor);
        return node;
    }

    //
    $getNode(requestor?: any, reassignOldNode: boolean | null = true) {
        // TODO: resolve somehow returning this.#valueRef as element...
        const node = isPrimitive(this.#valueRef?.value) ? T(this.#valueRef) : getNode(this.#valueRef?.value, null, -1, requestor);
        if (node != null && reassignOldNode) { this.#oldNode = node; };
        return node;
    }

    //
    get [$mapped]() { return true; }

    //
    elementForPotentialParent(requestor: any) {
        /*if (isValidParent(requestor)) {
            this.boundParent = requestor;
            this.#valueRef?.[$trigger]?.();
        }*/
        Promise.try(() => {
            const element = this.$getNode(requestor);
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
        return this.element;
    }

    //
    get self(): HTMLElement | DocumentFragment | Text | null {
        const existsNode = this.$getNode(this.boundParent);
        const theirParent = isValidParent(existsNode?.parentElement) ? existsNode?.parentElement : this.boundParent;
        this.boundParent ??= isValidParent(theirParent) ?? this.boundParent;

        //
        Promise.resolve()?.then?.(()=>{
            const theirParent = isValidParent(existsNode?.parentElement) ? existsNode?.parentElement : this.boundParent;
            this.boundParent ??= isValidParent(theirParent) ?? this.boundParent;
        });

        //
        return (theirParent ?? this.boundParent ?? existsNode);
    }

    //
    get element(): HTMLElement | DocumentFragment | Text | null {
        const children = this.$getNode(this.boundParent);
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
    _onUpdate(newVal, idx, oldVal, op) {
        //if (this.#updating) { return; }
        if (isPrimitive(oldVal) && isPrimitive(newVal)) { return; }

        //
        let oldEl = (isPrimitive(oldVal) ? this.#oldNode : this.$getNodeBy(this.boundParent, oldVal));
        let newEl = this.$getNode(this.boundParent, false);
        if ((oldEl && !oldEl?.parentNode) || this.#oldNode?.parentNode) { oldEl = this.#oldNode ?? oldEl; };

        //
        let updated: any = this.#updater?.(newEl, -1, oldEl, op, this.boundParent);
        if (newEl != null && newEl != this.#oldNode) { this.#oldNode = newEl; } else
        if (newEl == null && oldEl != this.#oldNode) { this.#oldNode = oldEl; };
        return updated;
    }
}

//
export const C = (observable, mapCb?, boundParent: Node | null | ChangeableOptions = null) => {
    if (observable == null) return null;
    if ((typeof observable == "object" || typeof observable == "function") && hasValue(observable)) {
        // @ts-ignore
        return elMap.getOrInsertComputed(observable, () => {
            return new Ch(observable, mapCb, boundParent);
        });
    }
    return T(observable);
};

//
export default C;
