import { JSOX } from "jsox";
import { addEvent, setIdleInterval } from "fest/dom";
import { safe, addToCallChain } from "fest/object";
import { reloadInto, mergeByKey, unwrap } from "./UIStateUtils"; // Splitting util functions if needed, or keeping them here.
// Wait, I should not break imports if I overwrite the file.
// The previous file had everything inline. I will keep everything inline but modified.

// ... helper functions ...
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

const ownProp = Object.prototype.hasOwnProperty;

const isPlainObject = (value: any): value is Record<PropertyKey, any>=>{
    if (!value || typeof value !== "object") return false;
    if (Array.isArray(value)) return false;
    return !(value instanceof Map) && !(value instanceof Set);
};

const identityOf = (value: any, fallback?: any)=>{
    if (value && typeof value === "object") {
        if ("id" in value && (value as any).id != null) return (value as any).id;
        if ("key" in value && (value as any).key != null) return (value as any).key;
    }
    return fallback;
};

const resolveEntryKey = (entryKey: any, value: any, fallback?: any)=>{
    if (entryKey != null) return entryKey;
    const identity = identityOf(value);
    if (identity != null) return identity;
    return fallback;
};

const mergePlainObject = (target: Record<PropertyKey, any>, source: Record<PropertyKey, any>)=>{
    for (const key of Object.keys(source)) {
        const nextValue = source[key];
        const currentValue = target[key];
        if (isPlainObject(currentValue) && isPlainObject(nextValue)) {
            mergePlainObject(currentValue, nextValue);
            continue;
        }
        if (currentValue !== nextValue) {
            target[key] = nextValue;
        }
    }
    return target;
};

const mergeValue = (target: any, source: any)=>{
    if (target === source) return target;
    const sourceIsObject = source && typeof source === "object";

    if (target instanceof Map && sourceIsObject) {
        reloadInto(target, source);
        return target;
    }

    if (target instanceof Set && sourceIsObject) {
        reloadInto(target, source);
        return target;
    }

    if (Array.isArray(target) && sourceIsObject) {
        reloadInto(target, source);
        return target;
    }

    if (isPlainObject(target) && isPlainObject(source)) {
        mergePlainObject(target, source);
        return target;
    }

    return source;
};

export const reloadInto = (items: any|any[]|Set<any>|Map<any, any>, map: any)=>{
    if (!items || !map) return items;
    const entries = mapEntriesFrom(map);
    if (!entries.length) return items;

    if (items instanceof Set) {
        const existingByKey = new Map<any, any>();
        for (const value of items.values()) {
            const key = identityOf(value);
            if (key != null) existingByKey.set(key, value);
        }

        const usedKeys = new Set<any>();
        for (const [entryKey, incoming] of entries) {
            const key = resolveEntryKey(entryKey, incoming);
            if (key == null) {
                if (!items.has(incoming)) items.add(incoming);
                continue;
            }

            const hasCurrent = existingByKey.has(key);
            const current = hasCurrent ? existingByKey.get(key) : undefined;
            if (hasCurrent) {
                const merged = mergeValue(current, incoming);
                if (merged !== current) {
                    items.delete(current);
                    items.add(merged);
                    existingByKey.set(key, merged);
                }
            } else {
                items.add(incoming);
                existingByKey.set(key, incoming);
            }
            usedKeys.add(key);
        }

        if (usedKeys.size) {
            for (const value of Array.from(items.values())) {
                const key = identityOf(value);
                if (key != null && !usedKeys.has(key)) {
                    items.delete(value);
                }
            }
        }
        return items;
    }

    if (items instanceof Map) {
        const nextMap = new Map(entries);

        for (const key of Array.from(items.keys())) {
            if (!nextMap.has(key)) items.delete(key);
        }

        for (const [key, incoming] of nextMap.entries()) {
            if (items.has(key)) {
                const current = items.get(key);
                const merged = mergeValue(current, incoming);
                if (merged !== current) items.set(key, merged);
            } else {
                items.set(key, incoming);
            }
        }
        return items;
    }

    if (Array.isArray(items)) {
        const availableIndexes = new Set<number>();
        const existingByKey = new Map<any, number>();
        const existingByObject = new WeakMap<object, number>();

        items.forEach((value, index)=>{
            availableIndexes.add(index);
            const key = identityOf(value, index);
            if (key != null && !existingByKey.has(key)) {
                existingByKey.set(key, index);
            }
            if (value && typeof value === "object") {
                existingByObject.set(value, index);
            }
        });

        const takeIndex = (index?: number)=>{
            if (index == null) return undefined;
            if (!availableIndexes.has(index)) return undefined;
            availableIndexes.delete(index);
            return index;
        };

        const takeNextAvailable = ()=>{
            const iterator = availableIndexes.values().next();
            if (iterator.done) return undefined;
            const index = iterator.value;
            availableIndexes.delete(index);
            return index;
        };

        let writeIndex = 0;
        let fallbackIndex = 0;

        for (const [entryKey, incoming] of entries) {
            const key = resolveEntryKey(entryKey, incoming, fallbackIndex++);
            let claimedIndex = takeIndex(key != null ? existingByKey.get(key) : undefined);

            if (claimedIndex == null && incoming && typeof incoming === "object") {
                claimedIndex = takeIndex(existingByObject.get(incoming));
            }

            if (claimedIndex == null) {
                claimedIndex = takeNextAvailable();
            }

            const current = claimedIndex != null ? items[claimedIndex] : undefined;
            const merged = current !== undefined ? mergeValue(current, incoming) : incoming;

            if (writeIndex < items.length) {
                if (items[writeIndex] !== merged) items[writeIndex] = merged;
            } else {
                items.push(merged);
            }

            writeIndex++;
        }

        while (items.length > writeIndex) items.pop();
        return items;
    }

    if (typeof items === "object") {
        const nextKeys = new Set(entries.map(([key])=>String(key)));
        for (const prop of Object.keys(items)) {
            if (!nextKeys.has(prop)) delete (items as any)[prop];
        }

        for (const [entryKey, incoming] of entries) {
            const prop = String(entryKey);
            if (ownProp.call(items, prop)) {
                const current = (items as any)[prop];
                const merged = mergeValue(current, incoming);
                if (merged !== current) (items as any)[prop] = merged;
            } else {
                (items as any)[prop] = incoming;
            }
        }
        return items;
    }

    return items;
}

export const mergeByKey = (items: any|any[]|Set<any>|Map<any, any>, key = "id")=>{
    if (items && (items instanceof Set || Array.isArray(items))) {
        const entries = Array.from(items?.values?.() || []).map((I)=>[I?.[key],I]).filter((I)=>I?.[0] != null);
        return reloadInto(items, new Map(entries as any));
    }
    return items;
}

const hasChromeStorage = () => typeof chrome !== "undefined" && chrome?.storage?.local;

export const makeUIState = (storageKey, initialCb, unpackCb, packCb = (items) => safe(items), key = "id", saveInterval = 6000)=>{
    let state = null;
    state = mergeByKey(initialCb?.() || {}, key);

    // Load initial state
    if (hasChromeStorage()) {
        chrome.storage.local.get([storageKey], (result) => {
            if (result[storageKey]) {
                const unpacked = unpackCb(JSOX.parse(result?.[storageKey] as string || "{}"));
                reloadInto(state, unpacked);
            }
        });
    } else if (typeof localStorage !== "undefined") {
        if (localStorage.getItem(storageKey)) {
            state = unpackCb(JSOX.parse(localStorage.getItem(storageKey) || "{}"));
            mergeByKey(state, key);
        } else {
            localStorage.setItem(storageKey, JSOX.stringify(packCb(state)));
        }
    }

    // Save function
    const saveInStorage = (ev?: any)=>{
        const packed = JSOX.stringify(packCb(mergeByKey(state, key)));
        if (hasChromeStorage()) {
            chrome.storage.local.set({ [storageKey]: packed });
        } else if (typeof localStorage !== "undefined") {
            localStorage.setItem(storageKey, packed);
        }
    }

    // Periodic save
    setIdleInterval(saveInStorage, saveInterval);

    // Event listeners
    if (typeof window !== "undefined" && typeof document !== "undefined") {
        const listening = [
            addEvent(document, "visibilitychange", (ev)=>{ if (document.visibilityState === "hidden") { saveInStorage(ev); } }),
            addEvent(window, "beforeunload", (ev)=>saveInStorage(ev)),
            addEvent(window, "pagehide", (ev)=>saveInStorage(ev)),
            // Standard storage event for localStorage
            addEvent(window, "storage", (ev)=>{
                if (ev.storageArea == localStorage && ev.key == storageKey) {
                    reloadInto(state, unpackCb(JSOX.parse(ev?.newValue || JSOX.stringify(packCb(mergeByKey(state, key))))));
                }
            })
        ];

        addToCallChain(state, Symbol.dispose, ()=>listening.forEach(ub=>ub?.()));
    }

    // Chrome storage listener
    if (hasChromeStorage()) {
        const listener = (changes, area) => {
            if (area === 'local' && changes[storageKey]) {
                const newValue = changes[storageKey].newValue;
                if (newValue) {
                    reloadInto(state, unpackCb(JSOX.parse(newValue)));
                }
            }
        };
        chrome.storage.onChanged.addListener(listener);
        // Cleanup listener on dispose? (UIState usually lives for app lifetime, but good to know)
    }

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
