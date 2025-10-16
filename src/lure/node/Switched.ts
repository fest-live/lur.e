import { addToCallChain, subscribe, isNotEqual, $trigger } from "fest/object";
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
const $getFromMapped = (mapped: any, value: number|string|null|undefined) => {
    if ((typeof value == "number" && value < 0) || (typeof value == "string" && !value) || value == null) return { element: "" };
    if (mapped instanceof Map || typeof mapped?.get == "function") { return mapped.get(value); }
    if (mapped instanceof Set || typeof mapped?.has == "function") { return mapped.has(value) ? value : null; }
    return mapped?.[value] ?? { element: "" };
}

//
const getFromMapped = (mapped: any, value: number|string|null|undefined, requestor: any | null = null) => {
    return getNode($getFromMapped(mapped, value), null, -1, requestor);
}

//
const isValidParent = (parent: Node) => {
    return (parent != null && parent instanceof HTMLElement && !(parent instanceof DocumentFragment || parent instanceof HTMLBodyElement));
}

//
export class SwM implements SwitchedParams {
    current?: { value: string | number; }|null;
    mapped?: any[]|any|Map<any, any>|Set<any>|null;
    boundParent: Node | null = null;

    //
    constructor(params?: SwitchedParams|null, mapped?: any[]|any|Map<any, any>|Set<any>|null) {
        this.current = params?.current ?? { value: -1 };
        this.mapped = params?.mapped ?? mapped ?? [];

        //
        const us = subscribe([params?.current, "value"], (newVal, prop, oldVal) => (this as any)._onUpdate(newVal, prop, oldVal));
        if (us) addToCallChain(this, Symbol.dispose, us);
    }

    //
    get element(): Node {
        return getFromMapped(this.mapped, this.current?.value ?? -1);
    }

    //
    elementForPotentialParent(requestor: any) {
        this.boundParent = requestor;
        this.current?.[$trigger]?.();
        return this.element;
    }

    //
    _onUpdate(newVal, prop, oldVal): void {
        const idx = newVal ?? this.current?.value;
        if (oldVal ? isNotEqual(idx, oldVal/*this.current?.value*/) : true) {
            const old = oldVal ?? this.current?.value;
            if (this.current) this.current.value = idx ?? -1;

            // Find parent and new/old nodes
            const parent = getFromMapped(this.mapped, old ?? -1)?.parentNode ?? this.boundParent; this.boundParent = parent ?? this.boundParent;
            const newNode = getFromMapped(this.mapped, idx ?? -1);
            const oldNode = getFromMapped(this.mapped, old ?? -1);

            // Update DOM nodes accordingly
            if (parent && newNode) {
                if (oldNode)
                { try { oldNode?.replaceWith?.(newNode); } catch (e) { console.warn(e); } } else { appendFix(parent, newNode); }
            } else if (oldNode && !newNode) { oldNode?.remove?.(); }
        }
    }
}

//
class SwHandler implements ProxyHandler<SwitchedParams> {
    constructor() {}

    //
    set(params: SwitchedParams, name, val) { return Reflect.set(getFromMapped(params?.mapped, params?.current?.value ?? -1) ?? params, name, val); }
    has(params: SwitchedParams, name) { return Reflect.has(getFromMapped(params?.mapped, params?.current?.value ?? -1) ?? params, name); }
    get(params: SwitchedParams, name, ctx) {
        if (name == "elementForPotentialParent" && (name in params || params?.[name] != null)) { return (params as SwM)?.elementForPotentialParent?.bind(params); };
        if (name == "element" && (name in params || params?.[name] != null)) { return (params as SwM)?.element; };
        if (name == "_onUpdate" && (name in params || params?.[name] != null)) { return (params as SwM)?._onUpdate?.bind(params); };
        return contextify(getFromMapped(params?.mapped, params?.current?.value ?? -1) ?? params, name);
    }

    //
    ownKeys(params: SwitchedParams) { return Reflect.ownKeys(getFromMapped(params?.mapped, params?.current?.value ?? -1) ?? params); }
    apply(params: SwitchedParams, thisArg, args) { return Reflect.apply(getFromMapped(params?.mapped, params?.current?.value ?? -1) ?? params, thisArg, args); }
    deleteProperty(params: SwitchedParams, name) { return Reflect.deleteProperty(getFromMapped(params?.mapped, params?.current?.value ?? -1) ?? params, name); }
    setPrototypeOf(params: SwitchedParams, proto) { return Reflect.setPrototypeOf(getFromMapped(params?.mapped, params?.current?.value ?? -1) ?? params, proto); }
    getPrototypeOf(params: SwitchedParams) { return Reflect.getPrototypeOf(getFromMapped(params?.mapped, params?.current?.value ?? -1) ?? params); }
    defineProperty(params: SwitchedParams, name, desc) { return Reflect.defineProperty(getFromMapped(params?.mapped, params?.current?.value ?? -1) ?? params, name, desc); }
    getOwnPropertyDescriptor(params: SwitchedParams, name) { return Reflect.getOwnPropertyDescriptor(getFromMapped(params?.mapped, params?.current?.value ?? -1) ?? params, name); }
    preventExtensions(params: SwitchedParams) { return Reflect.preventExtensions(getFromMapped(params?.mapped, params?.current?.value ?? -1) ?? params); }
    isExtensible(params: SwitchedParams) { return Reflect.isExtensible(getFromMapped(params?.mapped, params?.current?.value ?? -1) ?? params); }
}

//
export const I = (params: SwitchedParams, mapped?: any[]|any|Map<any, any>|Set<any>|null) => { // @ts-ignore
    return inProx?.getOrInsertComputed?.(params, ()=>{
        const px = new Proxy(params instanceof SwM ? params : new SwM(params, mapped), new SwHandler());
        return px;
    });
}

//
export default I;
