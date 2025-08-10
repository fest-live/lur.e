import { stringRef, autoRef, numberRef, booleanRef, deref, isValidObj, makeReactive, addToCallChain, WRef } from "fest/object";
import { attrLink, valueLink, checkedLink, valueAsNumberLink, localStorageLink, sizeLink, scrollLink, visibleLink, matchMediaLink, orientLink, localStorageLinkMap } from "./Links";

//
export const makeRef = (type, link, ...args)=>{
    const rf = (type ?? autoRef)?.(null), usub = link?.(rf, ...args);
    if (usub && rf) addToCallChain(rf, Symbol.dispose, usub); return rf;
}

//
export const orientRef = (...args)=>makeRef(stringRef, orientLink, ...args);
export const attrRef = (...args)=>makeRef(stringRef, attrLink, ...args);
export const valueRef = (...args)=>makeRef(stringRef, valueLink, ...args);
export const valueAsNumberRef = (...args)=>makeRef(numberRef, valueAsNumberLink, ...args);
export const localStorageRef = (...args)=>{
    if (localStorageLinkMap.has(args[0])) return localStorageLinkMap.get(args[0])?.[1];
    const link: any = localStorageLink, type: any = stringRef;
    const rf = (type ?? autoRef)?.(null), pair = link?.(rf, ...args);
    const [usub, _] = pair;
    if (usub && rf) addToCallChain(rf, Symbol.dispose, usub);
    /*localStorageLinkMap.set(args[0], pair);*/ return rf;
};
export const sizeRef = (...args)=>makeRef(numberRef, sizeLink, ...args);
export const checkedRef = (...args)=>makeRef(booleanRef, checkedLink, ...args);
export const scrollRef = (...args)=>makeRef(numberRef, scrollLink, ...args);
export const visibleRef = (...args)=>makeRef(booleanRef, visibleLink, ...args);
export const matchMediaRef = (...args)=>makeRef(booleanRef, matchMediaLink, ...args);

export const makeWeakRef = (initial?: any, behavior?: any)=>{
    const obj = deref(initial);
    return isValidObj(obj) ? makeReactive(WRef(obj)) : autoRef(obj, behavior);
};
