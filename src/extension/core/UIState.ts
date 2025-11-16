import { JSOX } from "jsox";
import { addEvent, setIdleInterval } from "fest/dom";
import { safe, addToCallChain } from "fest/object";

//
export const unwrap = (items: any)=>{ return safe(items); }

// replace all keys and values in-place without replacing `items` reference
const mapEntriesFrom = (source: any) => {
    if (!source) return [];
    if (source instanceof Map) return Array.from(source.entries());
    if (Array.isArray(source)) {
        return source.map((value, index) => {
            if (Array.isArray(value) && value.length === 2) {
                return value as [any, any];
            }
            return [index, value] as [any, any];
        });
    }
    if (source instanceof Set) {
        return Array.from(source.values()).map((value, index) => [index, value] as [any, any]);
    }
    if (typeof source === "object") {
        return Object.entries(source as Record<any, any>);
    }
    return [];
};

export const reloadInto = (items: any|any[]|Set<any>|Map<any, any>, map: any)=>{
    if (!items || !map) return items;
    const entries = mapEntriesFrom(map);
    if (!entries.length) return items;

    // Set: replace contents with map values
    if (items instanceof Set) {
        items.clear();
        for (const [, value] of entries) items.add(value);
        return items;
    }

    // Map: replace entries with map entries (keys and values)
    if (items instanceof Map) {
        items.clear();
        for (const [k, v] of entries) items.set(k, v);
        return items;
    }

    // Array: replace contents with map values
    if (Array.isArray(items)) {
        items.length = 0;
        for (const [, v] of entries) items.push(v);
        return items;
    }

    // Plain object: remove all own props, then assign map entries as props
    if (typeof items === "object") {
        for (const prop of Object.keys(items)) delete (items as any)[prop];
        for (const [k, v] of entries) (items as any)[k as any] = v;
        return items;
    }

    return items;
}

//
export const mergeByKey = (items: any|any[]|Set<any>|Map<any, any>, key = "id")=>{
    if (items && (items instanceof Set || Array.isArray(items))) {
        const entries = Array.from(items?.values?.() || []).map((I)=>[I?.[key],I]).filter((I)=>I?.[0] != null);
        return reloadInto(items, new Map(entries as any));
    }
    return items;
}

//
export const makeUIState = (storageKey, initialCb, unpackCb, packCb = unwrap, key = "id", saveInterval = 6000)=>{
    let state = null;

    //
    if (localStorage.getItem(storageKey)) {
        state = unpackCb(JSOX.parse(localStorage.getItem(storageKey) || "{}"));
        mergeByKey(state, key);
    } else {
        localStorage.setItem(storageKey, JSOX.stringify(packCb(state = mergeByKey(initialCb?.() || {}, key))));
    }

    //
    const saveInStorage = (ev?: any)=>{
        localStorage.setItem(storageKey, JSOX.stringify(packCb(mergeByKey(state, key))));
    }

    //
    //setIdleInterval(saveInStorage, saveInterval);

    //
    const listening = [
        addEvent(document, "visibilitychange", (ev)=>{ if (document.visibilityState === "hidden") { saveInStorage(ev); } }),
        addEvent(window, "beforeunload", (ev)=>saveInStorage(ev)),
        addEvent(window, "pagehide", (ev)=>saveInStorage(ev)),
        addEvent(window, "storage", (ev)=>{
            if (ev.storageArea == localStorage && ev.key == storageKey) {
                reloadInto(state, unpackCb(JSOX.parse(ev?.newValue || JSOX.stringify(packCb(mergeByKey(state, key))))));
            }
        })
    ];

    //
    addToCallChain(state, Symbol.dispose, ()=>listening.forEach(ub=>ub?.()));
    if (state && typeof state === "object") {
        try {
            Object.defineProperty(state, "$save", {
                value: saveInStorage,
                configurable: true,
                enumerable: false,
                writable: true
            });
        } catch (e) {
            (state as any).$save = saveInStorage;
        }
    }
    return state;
}
