// @ts-ignore /* @vite-ignore */
import { subscribe, ref } from "/externals/modules/object.js";
import { boundBehaviors } from "./Behavior";

/*
//
export const namedStoreMaps = new WeakMap();
export const bindBeh = (element, store, behavior)=>{
    const weak = element instanceof WeakRef ? element : new WeakRef(element);
    if (behavior) { subscribe(store, (value, prop, old)=>store?.behavior?.([value, prop, old], [weak, store, namedStoreMaps.get(weak?.deref?.())])); }
    return element;
}

//
export const bindStore = (element: HTMLElement, valMap: Map<string,any>, store: [string,any])=>{
    const weak = new WeakRef(element);
    if (!valMap.has(store[0])) { valMap.set(store[0], store[1]); bindBeh(weak, store, store[1]?.behavior); }
    return element;
}

//
export const reflectStores = (element, stores)=>{
    if (!element) return;
    if (stores) {
        const valMap = namedStoreMaps.get(element) ?? new Map();
        if (!namedStoreMaps.has(element)) { namedStoreMaps.set(element, valMap); }
        [...(stores?.entires?.()||[])].map((e)=>bindStore(element,valMap,e));
    }
    return element;
}

//
export const refCtl = (value)=>{
    let self: any = null; // can be binded as controlled by behavior
    let ctl = ref(value, self = ([val, prop, old], [weak, ctl, valMap])=>{
        boundBehaviors.get(weak?.deref?.())?.values?.()?.forEach?.((beh)=>((beh != self ? beh : null)?.([val, prop, old], [weak, ctl, valMap ?? namedStoreMaps.get(weak?.deref?.())])));
    });
    return ctl;
}
*/

//
export const namedStoreMaps = new Map(); // Map<name, WeakMap<element, obj>>
export const bindBeh = (element, store, behavior) => {
    const weak = element instanceof WeakRef ? element : new WeakRef(element);
    const [name, obj] = store;
    if (behavior) {
        subscribe(store, (value, prop, old) => {
            const valMap = namedStoreMaps.get(name);
            behavior?.([value, prop, old], [weak, store, valMap?.get(weak.deref?.())]);
        });
    }
    return element;
};

//
export const getStoresOfElement = ( map: Map<any, WeakMap<any, any>>, element: any): Map<any, any> => {
    const E = [...map.entries()||[]] as [any, any][];
    return new Map<any, any>((E?.map?.(([n,m])=>[n,m?.get?.(element)])?.filter?.(([n,e])=>!!e)||[]) as any);;
}

//
export const bindStore = (element, name, obj) => {
    let weakMap = namedStoreMaps.get(name);
    if (!weakMap) {
        weakMap = new WeakMap();
        namedStoreMaps.set(name, weakMap);
    }
    if (!weakMap.has(element)) {
        weakMap.set(element, obj);
        bindBeh(new WeakRef(element), [name, obj], obj?.behavior);
    }
    return element;
};

//
export const reflectStores = (element, stores) => {
    if (!element || !stores) return;
    for (const [name, obj] of stores.entries()) {
        bindStore(element, name, obj);
    }
    return element;
};

//
export const refCtl = (value) => {
    let self: any = null;
    let ctl = ref(value, self = ([val, prop, old], [weak, ctl, valMap]) => {
        boundBehaviors.get(weak?.deref?.())?.values?.()?.forEach?.((beh) => {
            (beh != self ? beh : null)?.([val, prop, old], [weak, ctl, valMap]);
        });
    });
    return ctl;
};
