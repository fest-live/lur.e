// @ts-ignore /* @vite-ignore */
import { observeAttributeBySelector } from "/externals/modules/dom.js";

//
import { boundBehaviors } from "./Behavior";
import { namedStoreMaps } from "./Store";

// mixin { connect: (element, { ... })=>{},  disconnect: (element, { ... }): ()=>{}}
export const reflectMixins = (element, mixins)=>{
    if (!element) return;
    if (mixins) {
        const mixinSet = boundMixinSet.get(element) ?? new Set();
        if (!boundMixinSet.has(element)) { boundMixinSet.set(element, mixinSet); }
        [...(mixins?.values?.() || [])].map((e)=>bindMixins(element, mixinSet, e));
    }
    return element;
}

//
export const getElementRelated = (element)=>{
    return {
        mixinSet: boundMixinSet.get(element),
        behaviorSet: boundBehaviors.get(element)
    }
}

//
export const bindMixins = (element, mixSet, mixin)=>{
    const weak = new WeakRef(element);
    if (!mixSet.has(mixin)) { mixSet.add(mixin);
        mixin?.connect?.(weak, new WeakRef(mixin), getElementRelated(element));
    }
    return element;
}

//
export const boundMixinSet = new WeakMap();
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
export const addRoot = (root: any = document) => {
    if (!roots.has(root)) {
        roots.add(root);
        observeAttributeBySelector(root, "*", "data-mixin", (mutation) => updateAllMixins(mutation.target));
    }
    return root;
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
    elementStore(element) { return namedStoreMaps.get(this.name)?.get?.(element); };
    get storage() { return namedStoreMaps.get(this.name); }
    get elements() { return mixinElements.get(this); }
    get name() { return mixinNamespace.get(this); }
}
