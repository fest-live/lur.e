import { addToCallChain, subscribe, isNotEqual } from "fest/object";
import getNode, { appendFix } from "../context/Utils";

//
const inProx = new WeakMap(), contextify = (pc: any, name: any) =>
    { return (typeof pc?.[name] == "function" ? pc?.[name]?.bind?.(pc) : pc?.[name]); }

//
export interface SwitchedParams {
    current?: { value: string | number; }|null; // candidates
    mapped?: any[]|any|Map<any, any>|Set<any>|null;
}

//
const getFromMapped = (mapped: any, value: number|string|null|undefined) => {
    if ((typeof value == "number" && value < 0) || (typeof value == "string" && !value) || value == null) return { element: "" };
    if (mapped instanceof Map) { return mapped.get(value); }
    if (mapped instanceof Set) { return mapped.has(value) ? value : null; }
    return mapped?.[value] ?? { element: "" };
}

//
export class SwM implements SwitchedParams {
    current?: { value: string | number; }|null;
    mapped?: any[]|any|Map<any, any>|Set<any>|null;

    //
    constructor(params?: SwitchedParams|null) {
        this.current = params?.current ?? { value: -1 };
        this.mapped = params?.mapped ?? [];
    }

    //
    get element(): Node {
        return getFromMapped(this.mapped, this.current?.value ?? -1);;
    }

    //
    _onUpdate(): void {
        const idx = this.current?.value;
        if (isNotEqual(idx, this.current?.value)) {
            const old = this.current?.value;
            if (this.current) this.current.value = idx ?? -1;

            // Find parent and new/old nodes
            const parent  = getFromMapped(this.mapped, old ?? -1)?.parentNode;
            const newNode = getFromMapped(this.mapped, idx ?? -1);
            const oldNode = getFromMapped(this.mapped, old ?? -1);

            // Update DOM nodes accordingly
            if (parent && newNode) {
                if (oldNode)
                    { try { oldNode.replaceWith(newNode); } catch (e) { console.warn(e); } } else
                    { appendFix(parent, getNode(newNode)); }
            } else if (oldNode && !newNode) { oldNode.remove(); }
        }
    }
}

//
class SwHandler implements ProxyHandler<SwitchedParams> {
    constructor() {}

    //
    set(params: SwitchedParams, name, val) { return Reflect.set(getFromMapped(params?.mapped, params?.current?.value ?? -1), name, val); }
    has(params: SwitchedParams, name) { return Reflect.has(getFromMapped(params?.mapped, params?.current?.value ?? -1), name); }
    get(params: SwitchedParams, name, ctx) {
        if (name == "element" && (name in params || params?.[name] != null)) { return (params as SwM)?.element; };
        if (name == "_onUpdate" && (name in params || params?.[name] != null)) { return (params as SwM)?._onUpdate?.bind(params); };
        return contextify(getFromMapped(params?.mapped, params?.current?.value ?? -1), name);
    }

    //
    ownKeys(params: SwitchedParams) { return Reflect.ownKeys(getFromMapped(params?.mapped, params?.current?.value ?? -1)); }
    apply(params: SwitchedParams, thisArg, args) { return Reflect.apply(getFromMapped(params?.mapped, params?.current?.value ?? -1), thisArg, args); }
    deleteProperty(params: SwitchedParams, name) { return Reflect.deleteProperty(getFromMapped(params?.mapped, params?.current?.value ?? -1), name); }
    setPrototypeOf(params: SwitchedParams, proto) { return Reflect.setPrototypeOf(getFromMapped(params?.mapped, params?.current?.value), proto); }
    getPrototypeOf(params: SwitchedParams) { return Reflect.getPrototypeOf(getFromMapped(params?.mapped, params?.current?.value ?? -1)); }
    defineProperty(params: SwitchedParams, name, desc) { return Reflect.defineProperty(getFromMapped(params?.mapped, params?.current?.value), name, desc); }
    getOwnPropertyDescriptor(params: SwitchedParams, name) { return Reflect.getOwnPropertyDescriptor(getFromMapped(params?.mapped, params?.current?.value), name); }
    preventExtensions(params: SwitchedParams) { return Reflect.preventExtensions(getFromMapped(params?.mapped, params?.current?.value)); }
    isExtensible(params: SwitchedParams) { return Reflect.isExtensible(getFromMapped(params?.mapped, params?.current?.value)); }
}

//
export const I = (params: SwitchedParams) => { // @ts-ignore
    return inProx?.getOrInsertComputed?.(params, ()=>{
        const px = new Proxy(params instanceof SwM ? params : new SwM(params), new SwHandler());
        const us = subscribe([params?.current, "value"], () => (px as any)._onUpdate());
        if (us) addToCallChain(px, Symbol.dispose, us); return px;
    });
}

//
export default I;
