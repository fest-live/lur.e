import { boundMixinSet, getElementRelated } from "./Behavior";

// @ts-ignore /* @vite-ignore */
import { observeAttributeBySelector } from "/externals/modules/dom.js";

//
export const updateMixinAttributesAll = (elements, mixin)=>{ elements.forEach((e)=>updateMixinAttributes(e, mixin)) }
export const updateMixinAttributes = (element, mixin)=>{
    if (typeof mixin == "string") { mixin = mixinRegistry.get(mixin); }
    const names  = new Set([...(element.dataset.mixin?.split?.(" ") || [])]);
    const mixins = new Set([...names].map((n)=>mixinRegistry.get(n)).filter((m)=>!!m));
    const mixinSet = boundMixinSet.get(element) ?? new Set();
    if (!boundMixinSet.has(element)) { boundMixinSet.set(element, mixinSet); }
    if (!mixinSet.has(mixin)) {
        if (!mixins.has(mixin)) { mixin?.disconnect?.(new WeakRef(element), new WeakRef(mixin), getElementRelated(element)); }
        if ( mixins.has(mixin)) { mixin?.connect?.(new WeakRef(element), new WeakRef(mixin), getElementRelated(element));
            names.add(mixinNamespace.get(mixin)); mixinSet.add(mixin);
            element.dataset.mixin = [...names].filter((n)=>!!n).join(" ");
        }
    }
    if (mixinSet.has(mixin)) {
        if (!mixins.has(mixin)) { mixinSet?.delete?.(mixin); mixin?.disconnect?.(new WeakRef(element), new WeakRef(mixin), getElementRelated(element)); }
    }
}

//
export const updateAllMixins = (element)=>{
    const names  = new Set([...(element.dataset.mixin?.split?.(" ") || [])]);
    const mixins = new Set([...names].map((n)=>mixinRegistry.get(n)).filter((m)=>!!m));
    [...mixins].map((m)=>updateMixinAttributes(element, m));
}

//
export const mixinRegistry  = new Map<string, any>;
export const mixinNamespace = new WeakMap<any, string>;
export const mixinElements  = new WeakMap<any, any>();
export const roots = new Set([document]);

//
export const addRoot = (root = document) => {
    if (!roots.has(root)) {
        roots.add(root);
        // Запускаем наблюдение за data-mixin в новом корне
        observeAttributeBySelector(root, "*", "data-mixin", (mutation) => {
            //updateMixinAttributes(mutation.target, mixinRegistry.get(mutation.target.dataset.mixin));
            updateAllMixins(mutation.target);
        });
    }
};

//
const updateMixinAttributesAllInRoots = (mixin) => {
    for (const root of roots) {
        updateMixinAttributesAll(root.querySelectorAll("[data-mixin]"), mixin);
    }
}

//
export const registerMixin = (name, mixin) => {
    mixinRegistry.set(name?.trim?.(), mixin);
    mixinNamespace.set(mixin, name?.trim?.());

    // Обновляем во всех корнях
    updateMixinAttributesAllInRoots(mixin);
};

//
addRoot(document);

//
export class DOMMixin {
    constructor() {}

    //
    connect(wElement, wSelf, related) { return this; }
    disconnect(wElement, wSelf, related) { return this; }

    //
    get elements() { return mixinElements.get(this); }
    get name() { return mixinNamespace.get(this); }
}
