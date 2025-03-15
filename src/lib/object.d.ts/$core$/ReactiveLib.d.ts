import { type keyType, safe } from "./Keys.js";
export { safe };
export declare class Subscript {
    subscribers: Map<keyType, Set<(value: any, prop: keyType) => void>>;
    listeners: Set<(value: any, prop: keyType) => void>;
    constructor();
    subscribe(cb: (value: any, prop: keyType) => void, prop: keyType | null): void;
    trigger(name: any, value?: null, oldValue?: any): void;
}
export declare const bindByKey: (target: any, reactive: any, key?: () => string) => void;
export declare const bindWith: (target: any, reactive: any, watch?: any) => any;
export declare const derivate: (from: any, reactFn: any, watch?: any) => any;
export declare const subscribe: (target: any, cb: (value: any, prop: keyType) => void, ctx?: any | null) => Subscript | undefined;
export declare class ReactiveMap {
    constructor();
    has(target: any, prop: keyType): boolean;
    get(target: any, name: keyType, ctx: any): any;
    construct(target: any, args: any, newT: any): unknown;
    apply(target: any, ctx: any, args: any): unknown;
}
export declare class ReactiveSet {
    constructor();
    has(target: any, prop: keyType): boolean;
    get(target: any, name: keyType, ctx: any): any;
    construct(target: any, args: any, newT: any): unknown;
    apply(target: any, ctx: any, args: any): unknown;
}
export declare class ReactiveObject {
    constructor();
    get(target: any, name: keyType, ctx: any): any;
    construct(target: any, args: any, newT: any): unknown;
    has(target: any, prop: keyType): boolean;
    apply(target: any, ctx: any, args: any): unknown;
    set(target: any, name: keyType, value: any): boolean;
    deleteProperty(target: any, name: keyType): boolean;
}
export declare const makeReactiveObject: <T extends object>(map: T) => T;
export declare const makeReactiveMap: <K, V>(map: Map<K, V>) => Map<K, V>;
export declare const makeReactiveSet: <V>(set: Set<V>) => Set<V>;
export declare const createReactiveMap: <K, V>(map?: [K, V][]) => Map<K, V>;
export declare const createReactiveSet: <V>(set?: V[]) => Set<V>;
export declare const makeReactive: any;
export declare const createReactive: any;
