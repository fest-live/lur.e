/*
 * Filename: Mapped.ts
 * FullPath: modules/projects/lur.e/src/lure/node/Mapped.ts
 * Change date and time: 23.29.00_28.07.2026
 * Reason for changes: Bound mapped collections retain anchors and dispose observers safely.
 */

import { iterated } from "fest/object";
import { $mapped } from "../core/Binding";
import { getNode } from "../context/Utils";
import { makeUpdater, reformChildren } from "../context/ReflectChildren";
import { canBeInteger, isObservable, isPrimitive } from "fest/core";
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

const isElementParent = (value: any): value is HTMLElement =>
    value != null &&
    value.nodeType === 1 &&
    value.nodeName !== "BODY" &&
    typeof value.insertBefore === "function";

//
class Mp {
    #observable?: any;
    #fragments: DocumentFragment;
    #mapCb: any;
    #reMap: WeakMap<any, any>;
    #pmMap: Map<any, any>;
    #mapEntries: Map<any, { value: any; node: any }>;
    #updater: any = null;
    #internal: any = null;
    #options: MappedOptions = {} as MappedOptions;
    #stub = document.createComment("");
    #renderedNodes = new Set<Node>();
    #syncQueued = false;
    #parentObserver: MutationObserver | null = null;

    //
    #boundParent: Node | null = null;

    //
    #collection(): any[] {
        const source: any = this.#observable;
        const value = source?.value ?? source;
        if (value instanceof Map || value instanceof Set) return Array.from(value.values());
        return Array.isArray(value) ? value : [];
    }

    #mapKeyAt(index: any): any {
        const source: any = this.#observable?.value ?? this.#observable;
        if (!(source instanceof Map) || typeof index !== "number") return index;
        return Array.from(source.keys())[index];
    }

    #pruneMapEntries(): void {
        const source: any = this.#observable?.value ?? this.#observable;
        if (!(source instanceof Map)) {
            this.#mapEntries.clear();
            return;
        }

        const activeKeys = new Set(source.keys());
        for (const key of this.#mapEntries.keys()) {
            if (!activeKeys.has(key)) this.#mapEntries.delete(key);
        }
    }

    #disconnectParentObserver(): void {
        this.#parentObserver?.disconnect();
        this.#parentObserver = null;
    }

    //
    #syncBoundParent(): void {
        const parent = this.#boundParent;
        if (!parent) return;

        this.#pruneMapEntries();
        const desiredNodes: Node[] = [];
        this.#collection().forEach((value, index) => {
            const node = getNode(value, this.mapper.bind(this), index, parent);
            if (node instanceof DocumentFragment) {
                desiredNodes.push(...Array.from(node.childNodes));
            } else if (node instanceof Node) {
                desiredNodes.push(node);
            }
        });

        const desired = new Set(desiredNodes);
        if (this.#stub.parentNode !== parent) {
            const firstExisting = desiredNodes.find((node) => node.parentNode === parent);
            if (firstExisting) parent.insertBefore(this.#stub, firstExisting);
            else parent.appendChild(this.#stub);
        }

        for (const oldNode of this.#renderedNodes) {
            if (!desired.has(oldNode) && oldNode.parentNode === parent) {
                oldNode.parentNode.removeChild(oldNode);
            }
        }

        // Keep a persistent comment anchor so removing every mapped child does
        // not make a later refill jump behind unrelated siblings.
        let anchor = this.#stub.nextSibling;

        for (const node of desiredNodes) {
            if (node.parentNode !== parent || node !== anchor) {
                parent.insertBefore(node, anchor);
            }
            anchor = node.nextSibling;
        }

        this.#renderedNodes = desired;
    }

    //
    #queueBoundParentSync(): void {
        if (this.#syncQueued) return;
        this.#syncQueued = true;
        queueMicrotask(() => {
            this.#syncQueued = false;
            this.#syncBoundParent();
        });
    }

    //
    makeUpdater(basisParent: Node | null = null) {
        if (basisParent) {
            this.#internal?.(); this.#internal = null; this.#updater = null;
            this.#updater ??= makeUpdater(basisParent, this.mapper.bind(this), true);
            this.#internal ??= iterated?.(this.#observable, this._onUpdate.bind(this));
        }
    }

    //
    get boundParent() {
        return this.#boundParent;
    }

    //
    set boundParent(value: Node | null) {
        if (isElementParent(value) && value != this.#boundParent) {
            this.#disconnectParentObserver();
            const oldParent = this.#boundParent;
            for (const node of this.#renderedNodes) {
                if (node.parentNode === oldParent && oldParent !== value) {
                    oldParent?.removeChild(node);
                }
            }
            this.#boundParent = value;
            this.makeUpdater(value);
            this.#syncBoundParent();
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
        this.#stub = document.createComment("");
        this.#reMap = new WeakMap();
        this.#pmMap = new Map<any, any>(); // make 'mapper' compatible with React syntax ('mapper' property instead of function)
        this.#mapEntries = new Map();
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
            if (this.#options.preMap) {
                reformChildren(
                    this.#fragments, this.#collection(),
                    this.mapper.bind(this)
                );
                if (this.#fragments.childNodes.length === 0) {
                    this.#fragments.appendChild(this.#stub);
                }
            }
        }
    }

    //
    get [$mapped]() { return true; }

    //
    elementForPotentialParent(requestor: any) {
        try {
            if (this.#collection().length === 0 && isElementParent(requestor)) {
                // An empty source has no child node that can identify its
                // parent; bind directly so the first later mutation is not
                // lost before an anchor exists.
                this.#disconnectParentObserver();
                this.#boundParent = requestor;
                this.makeUpdater(requestor);
                this.#syncBoundParent();
                return this.element;
            }

            const element = getNode(this.#collection()?.[0], this.mapper.bind(this), 0);
            if (!requestor || element?.contains?.(requestor) || requestor == element) {
                return;
            }
            if (isElementParent(requestor)) {
                if (!element) {
                    this.boundParent = requestor;
                } else if (Array.from(requestor?.children).find((node) => node === element)) {
                    this.boundParent = requestor;
                } else {
                    this.#disconnectParentObserver();
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
                    this.#parentObserver = observer;
                    observer.observe(requestor, { childList: true });
                }
            }
        } catch (error) {
            console.warn(error);
        }

        //
        return this.element;
    }

    //
    get children() { return asArray(this.#collection()); }

    //
    get self(): HTMLElement | DocumentFragment | Text | null {
        const existsNode = getNode(this.#collection()?.[0], this.mapper.bind(this), 0);
        const theirParent = isValidParent(existsNode?.parentElement) ? existsNode?.parentElement : this.boundParent;
        this.boundParent ??= isValidParent(theirParent) ?? this.boundParent;

        //
        queueMicrotask(() => {
            const theirParent = isValidParent(existsNode?.parentElement) ? existsNode?.parentElement : this.boundParent;
            this.boundParent ??= isValidParent(theirParent) ?? this.boundParent;
        });

        //
        return (theirParent ?? this.boundParent ?? (reformChildren(
            this.#fragments, this.#collection(),
            this.mapper.bind(this)
        )));
    }

    //
    get element(): HTMLElement | DocumentFragment | Text | null {
        const children = this.#fragments?.childNodes?.length > 0
            ? this.#fragments
            : getNode(this.#collection()?.[0], this.mapper.bind(this), 0);
        const theirParent = isValidParent(children?.parentElement) ? children?.parentElement : this.boundParent;
        this.boundParent ??= isValidParent(theirParent) ?? this.boundParent;

        //
        queueMicrotask(() => {
            const theirParent = isValidParent(children?.parentElement) ? children?.parentElement : this.boundParent;
            this.boundParent ??= isValidParent(theirParent) ?? this.boundParent;
        });

        //
        return children;
    }

    //
    get mapper() {
        return (...args) => {
            const source = (this.#observable as any)?.value ?? this.#observable;
            if (args?.[0] == null) { return null; }

            //
            if (args?.[0] instanceof Node) { return args?.[0]; };

            // unsupported
            if (args?.[0] instanceof Promise || typeof (args?.[0] as any)?.then == "function") { return null; };

            if (source instanceof Map) {
                // Direct Map sources expose values to the renderer while the
                // second mapper argument remains the stable Map key. Keyed
                // caching prevents duplicate primitive values from collapsing.
                const mapKey = this.#mapKeyAt(args?.[1]);
                const mapArgs = [args?.[0], mapKey, ...args.slice(2)];
                const cached = this.#mapEntries.get(mapKey);
                if (cached && Object.is(cached.value, args?.[0])) return cached.node;
                const node = this.#mapCb(...mapArgs);
                this.#mapEntries.set(mapKey, { value: args?.[0], node });
                return node;
            }

            //
            if (
                (args?.[1] == null || args?.[1] < 0 || (typeof args?.[1] != "number" || !canBeInteger(args?.[1] as any))) &&
                (Array.isArray(source) || source instanceof Set)
            ) { return; }

            //
            if (args?.[0] != null && (typeof args?.[0] == "object" || typeof args?.[0] == "function" || typeof args?.[0] == "symbol")) // @ts-ignore
                { return this.#reMap.getOrInsert(args?.[0], this.#mapCb(...args)); }

            // prevalence of Set typed
            if (args?.[0] != null && source instanceof Set) // @ts-ignore
                { return this.#pmMap.getOrInsert(args?.[0], this.#mapCb(...args)); }

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
        // INVARIANT: every source mutation reconciles against the current
        // collection, so set/reorder/replacement cannot leave cached nodes stale.
        void newEl; void idx; void oldEl; void op;
        this.#queueBoundParentSync();
    }

    [Symbol.dispose](): void {
        // Stop reactive callbacks before detaching nodes so later source
        // mutations cannot recreate content after the mapped view is gone.
        this.#internal?.();
        this.#internal = null;
        this.#disconnectParentObserver();
        this.#syncQueued = false;

        for (const node of this.#renderedNodes) {
            if (node.parentNode) node.parentNode.removeChild(node);
        }
        this.#renderedNodes.clear();
        this.#stub.parentNode?.removeChild(this.#stub);
        this.#mapEntries.clear();
        this.#pmMap.clear();
        this.#reMap = new WeakMap();
        this.#boundParent = null;
    }

    // generator and iterator
    *[Symbol.iterator]() {
        let i=0;
        if (this.#collection()) {
            for (let el of this.#collection())
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
