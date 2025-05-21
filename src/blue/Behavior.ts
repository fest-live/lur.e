// @ts-ignore /* @vite-ignore */
import { subscribe, ref } from "/externals/modules/object.js";

//
export const boundValSets = new WeakMap();
export const boundBehaviors = new WeakMap();
export const boundMixinSet = new WeakMap();

//
export const bindBeh = (element, store, behavior)=>{
    const weak = element instanceof WeakRef ? element : new WeakRef(element);
    if (behavior) { subscribe(store, (value, prop, old)=>store?.behavior?.([value, prop, old], [weak, store, boundValSets.get(weak?.deref?.())])); }
    return element;
}

//
export const bindStore = (element: HTMLElement, valSet: Set<any>, store: any)=>{
    const weak = new WeakRef(element);
    if (!valSet.has(store)) { valSet.add(store); bindBeh(weak, store, store?.behavior); }
    return element;
}

//
export const bindMixins = (element, mixSet, mixin)=>{
    const weak = new WeakRef(element);
    if (!mixSet.has(mixin)) { mixSet.add(mixin);
        mixin?.connect?.(weak, {
            mixin: new WeakRef(mixin),
            valSet: boundValSets.get(element),
            mixinSet: boundMixinSet.get(element),
            behaviorSet: boundBehaviors.get(element)
        });
    }
    return element;
}

// currently, behaviors not triggers when initialized
export const bindBehavior = (element, behSet, behavior)=>{
    const weak = new WeakRef(element);
    if (!behSet.has(behavior)) { behSet.add(behavior); }
    return element;
}

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

// behavior ([value, prop, old], [element, store, storeSets])=>{}
export const reflectBehaviors = (element, behaviors)=>{
    if (!element) return;
    if (behaviors) {
        const behSet = boundBehaviors.get(element) ?? new Set();
        if (!boundBehaviors.has(element)) { boundBehaviors.set(element, behSet); }
        [...(behaviors?.values?.() || [])].map((e)=>bindBehavior(element, behSet, e));
    }
    return element;
}

//
export const reflectStores = (element, stores)=>{
    if (!element) return;
    if (stores) {
        const valSet = boundValSets.get(element) ?? new Set();
        if (!boundValSets.has(element)) { boundValSets.set(element, valSet); }
        [...(stores?.values?.()||[])].map((e)=>bindStore(element,valSet,e));
    }
    return element;
}

//
export const refCtl = (value)=>{
    let self: any = null; // can be binded as controlled by behavior
    let ctl = ref(value, self = ([val, prop, old], [weak, ctl, valSet])=>{
        boundBehaviors.get(weak?.deref?.())?.values?.()?.forEach?.((beh)=>((beh != self ? beh : null)?.([val, prop, old], [weak, ctl, valSet ?? boundValSets.get(weak?.deref?.())])));
    });
    return ctl;
}

// TODO! named mixins and DOM attributes
