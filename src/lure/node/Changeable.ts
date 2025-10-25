import { $trigger, observe, subscribe } from "fest/object";
import { elMap, getNode, removeNotExists, T } from "../context/Utils";
import { $mapped } from "../core/Binding";
import { makeUpdater, reformChildren } from "../context/ReflectChildren";
import { canBeInteger, isObservable, isPrimitive, isHasPrimitives, hasValue } from "fest/core";
import { isValidParent } from "fest/dom";

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
    #options: ChangeableOptions = {} as ChangeableOptions;

    //
    #boundParent: Node | null = null;

    //
    makeUpdater(basisParent: Node | null = null) {
        if (basisParent) {
            this.#internal?.(); this.#internal = null; this.#updater = null;
            this.#updater ??= makeUpdater(basisParent, null);
            this.#internal ??= subscribe?.([this.#valueRef, "value"], this._onUpdate.bind(this));
        }
    }

    //
    get boundParent() { return this.#boundParent; }
    set boundParent(value: Node | null) {
        if (value instanceof HTMLElement && isValidParent(value) && value != this.#boundParent) {
            this.#boundParent = value; this.makeUpdater(value);
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
    $getNode(requestor?: any) {
        const node = isPrimitive(this.#valueRef?.value) ? T(this.#valueRef) : getNode(this.#valueRef?.value, null, 0, requestor);
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
        const existsNode = this.$getNode();
        const theirParent = isValidParent(existsNode?.parentElement) ? existsNode?.parentElement : this.boundParent;
        this.boundParent ??= isValidParent(theirParent) ?? this.boundParent;

        Promise.resolve()?.then?.(()=>{
            const theirParent = isValidParent(existsNode?.parentElement) ? existsNode?.parentElement : this.boundParent;
            this.boundParent ??= isValidParent(theirParent) ?? this.boundParent;
        });

        return (theirParent ?? existsNode);
    }

    //
    get element(): HTMLElement | DocumentFragment | Text | null {
        const children = this.$getNode();
        const theirParent = isValidParent(children?.parentElement) ? children?.parentElement : this.boundParent;
        this.boundParent ??= isValidParent(theirParent) ?? this.boundParent;

        Promise.resolve()?.then?.(()=>{
            const theirParent = isValidParent(children?.parentElement) ? children?.parentElement : this.boundParent;
            this.boundParent ??= isValidParent(theirParent) ?? this.boundParent;
        });

        return children;
    }

    //
    _onUpdate(newEl, idx, oldEl, op: string | null = "@add") {
        if (isPrimitive(newEl) && isPrimitive(oldEl)) {
            return;
        };
        return this.#updater?.(this.#valueRef, 0, oldEl, op, this.boundParent);
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
