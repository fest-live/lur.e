import { stringRef, autoRef, numberRef, booleanRef, deref, isValidObj, makeReactive, addToCallChain, WRef } from "fest/object";
import { attrLink, valueLink, checkedLink, valueAsNumberLink, localStorageLink, sizeLink, scrollLink, visibleLink, matchMediaLink, orientLink, localStorageLinkMap } from "./Links";

//
export const makeRef = (host, type, link, ...args)=>{
    const rf = (type ?? autoRef)?.(null), usub = link?.(host, rf, ...args);
    if (usub && rf) addToCallChain(rf, Symbol.dispose, usub); return rf;
}

//
export const orientRef = (host, ...args)=>makeRef(host, stringRef, orientLink, ...args);
export const attrRef = (host, ...args)=>makeRef(host, stringRef, attrLink, ...args);
export const valueRef = (host, ...args)=>makeRef(host, stringRef, valueLink, ...args);
export const valueAsNumberRef = (host, ...args)=>makeRef(host, numberRef, valueAsNumberLink, ...args);
export const localStorageRef = (...args)=>{
    if (localStorageLinkMap.has(args[0])) return localStorageLinkMap.get(args[0])?.[1];
    const link: any = localStorageLink, type: any = stringRef;
    const rf = (type ?? autoRef)?.(null), pair = link?.(null, rf, ...args);
    const [usub, _] = pair;
    if (usub && rf) addToCallChain(rf, Symbol.dispose, usub);
    /*localStorageLinkMap.set(args[0], pair);*/ return rf;
};

//
export const sizeRef = (host, ...args)=>makeRef(host, numberRef, sizeLink, ...args);
export const checkedRef = (host, ...args)=>makeRef(host, booleanRef, checkedLink, ...args);
export const scrollRef = (host, ...args)=>makeRef(host, numberRef, scrollLink, ...args);
export const visibleRef = (host, ...args)=>makeRef(host, booleanRef, visibleLink, ...args);
export const matchMediaRef = (...args)=>makeRef(null, booleanRef, matchMediaLink, ...args);

//
export const makeWeakRef = (host, initial?: any, behavior?: any)=>{
    const obj = deref(initial);
    return isValidObj(obj) ? makeReactive(WRef(obj)) : autoRef(obj, behavior);
};
