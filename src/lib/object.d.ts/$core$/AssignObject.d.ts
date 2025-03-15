import { type keyType } from "./Keys.js";
export declare const removeExtra: (target: any, value: any, name?: keyType | null) => any;
export declare const mergeByKey: (items: any[] | Set<any>, key?: string) => unknown[];
export declare const objectAssign: (target: any, value: any, name?: keyType | null, removeNotExists?: boolean, mergeKey?: string) => any;
export declare class AssignObjectHandler {
    constructor();
    get(target: any, name: keyType, ctx: any): any;
    construct(target: any, args: any, newT: any): unknown;
    has(target: any, prop: keyType): boolean;
    apply(target: any, ctx: any, args: any): unknown;
    set(target: any, name: keyType, value: any): boolean;
    deleteProperty(target: any, name: keyType): boolean;
}
export declare const makeObjectAssignable: (obj: any) => any;
