// @ts-ignore /* @vite-ignore */
import {importCdn} from "/externals/modules/cdnImport.mjs";
export {importCdn};

// @ts-ignore
const { subscribe } = await Promise.try(importCdn, ["/externals/lib/object.js"]);

//
class ObserveMethod {
    #handle: any;
    #name: string;
    #self: any;

    constructor(name, handle, self) {
        this.#name   = name;
        this.#handle = handle;
        this.#self   = self;
    }

    apply(target, ctx, args) {
        let removed = null;
        if (this.#name == "splice") { removed = this.#self[args[0]]; };
        const wp = this.#handle.wrap(Reflect.apply(target, ctx || this.#self, args));
        this.#handle.trigger(this.#self || ctx, this.#name, args, wp, removed);
        return wp;
    }

    get(target, name, rec) {
        return Reflect.get(target, name, rec);
    }
}

//
const observeMaps = new WeakMap<any[], ObserveArray>();

//
class ObserveArray {
    #handle: any;
    #events: WeakMap<any[], Set<Function>>;

    //
    get events() {
        return this.#events;
    }

    //
    constructor(arr: any[]) {
        this.#events = new WeakMap(); //
        this.#events.set(arr, new Set<Function>([]));
        const events = this.#events;
        this.#handle = {
            trigger(target: any[], name: number|string, ...args) {
                events?.get?.(target)?.values().forEach(ev => ev?.(name, ...args));
            },
            wrap(nw: any[]|unknown) {
                if (Array.isArray(nw)) {
                    const obs = new ObserveArray(nw);
                    observeMaps.set(nw, obs);
                    return new Proxy(nw, obs);
                }
                return nw;
            }
        }
    }

    //
    has(target, name) { return Reflect.has(target, name); }
    get(target, name, rec) {
        if (name == "@target") return target;
        if (name == "silentForwardByIndex") {
            return (index: number) => {
                if (index < target.length) {
                    const E = target[index];
                    target.splice(index, 1);
                    target.push(E);
                }
            }
        }
        const got = Reflect.get(target, name, rec);
        if (typeof got == "function") { return new Proxy(got, new ObserveMethod(name, this.#handle, target)); };
        return got;
    }
    set(target, name, value) {
        if (!Number.isInteger(parseInt(name))) { return Reflect.set(target, name, value); };
        name = parseInt(name);
        const old = target?.[name];
        const got = Reflect.set(target, name, value);
        this.#handle.trigger(target, "@set", name, value, old);
        return got;
    }

    //
    deleteProperty(target, name) {
        const old = target?.[name];
        const got = Reflect.deleteProperty(target, name);
        this.#handle.trigger(target, "@delete", name, old);
        return got;
    }
}

//
export const observableArray = (arr: any[])=>{
    if (Array.isArray(arr)) {
        const obs = new ObserveArray(arr);
        observeMaps.set(arr, obs);
        return new Proxy(arr, obs);
    }
    return arr;
};

//
export const observe = (arr, cb)=>{
    const orig = arr?.["@target"] ?? arr;
    const obs = observeMaps.get(orig);
    const evt = obs?.events;
    arr?.forEach?.((val, _)=>{
        return cb("push", [val])
    });
    evt?.get(orig)?.add?.(cb);
};

//
export default observableArray;

//
export const observableBySet = (set)=>{
    const obs = observableArray([]);
    subscribe(set, (value, _, old)=>{
        if (value !== old) {
            if (old == null && value != null) {
                obs.push(value);
            } else
            if (old != null && value == null) {
                const idx = obs.indexOf(old);
                if (idx >= 0) obs.splice(idx, 1);
            } else {
                const idx = obs.indexOf(old);
                if (idx >= 0 && obs[idx] !== value) obs[idx] = value;
            }
        }
    });
    return obs;
}

//
export const observableByMap = (map)=>{
    const obs = observableArray([]);
    subscribe(map, (value, prop, old)=>{
        if (value !== old) {
            if (old != null && value == null) {
                const idx = obs.findIndex(([name, _])=>(name == prop));
                if (idx >= 0) obs.splice(idx, 1);
            } else {
                const idx = obs.findIndex(([name, _])=>{
                    return (name == prop)
                });
                if (idx >= 0) { if (obs[idx]?.[1] !== value) obs[idx] = [prop, value]; } else { obs.push([prop, value]); };
            }
        }
    });
    return obs;
}

//
export const unwrap = (arr)=>{
    return arr?.["@target"] ?? arr;
}
