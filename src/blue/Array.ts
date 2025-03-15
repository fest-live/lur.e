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

    apply(target, args, ctx) {
        const wp = this.#handle.wrap(Reflect.apply(target, args, ctx || this.#self));
        this.#handle.trigger(this.#name, args, wp);
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
    #events: Set<Function>;

    //
    get events() {
        return this.#events;
    }

    //
    constructor() {
        this.#events = new Set<Function>([]);
        const events = this.#events;
        this.#handle = {
            trigger(name, ...args) {
                events.values().forEach(ev => ev?.(name, ...args));
            },
            wrap(nw) {
                if (Array.isArray(nw)) {
                    const obs = new ObserveArray();
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
        const got = Reflect.get(target, name, rec);
        if (typeof got == "function") { return new Proxy(got, new ObserveMethod(name, this.#handle, target)); };
        return got;
    }
    set(target, name, value) {
        const old = target?.[name];
        const got = Reflect.set(target, name, value);
        this.#handle.trigger("set", name, value, old);
        return got;
    }

    //
    deleteProperty(target, name) {
        const old = target?.[name];
        const got = Reflect.deleteProperty(target, name);
        this.#handle.trigger("delete", name, old);
        return got;
    }
}

//
export const observableArray = (arr: any[])=>{
    if (Array.isArray(arr)) {
        const obs = new ObserveArray();
        observeMaps.set(arr, obs);
        return new Proxy(arr, obs);
    }
    return arr;
};

//
export const observe = (arr, cb)=>{
    const obs = observeMaps.get(arr?.["@target"] ?? arr);
    const evt = obs?.events;
    arr.forEach((val, idx)=>cb("push", [val]));
    evt?.add(cb);
};

//
export default observableArray;
