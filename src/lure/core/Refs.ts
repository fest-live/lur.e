import { stringRef, ref, numberRef, booleanRef } from "fest/object";
import { attrLink, valueLink, checkedLink, valueAsNumberLink, localStorageLink, sizeLink, scrollLink, visibleLink, matchMediaLink } from "./Links";

//
export const makeRef = (type, link, ...args)=>{
    const rf = (type ?? ref)?.(null), usub = link?.(rf, ...args);
    if (usub && rf) rf[Symbol.dispose] ??= usub; return rf;
}

//
export const attrRef = (...args)=>makeRef(stringRef, attrLink, ...args);
export const valueRef = (...args)=>makeRef(stringRef, valueLink, ...args);
export const valueAsNumberRef = (...args)=>makeRef(numberRef, valueAsNumberLink, ...args);
export const localStorageRef = (...args)=>makeRef(stringRef, localStorageLink, ...args);
export const sizeRef = (...args)=>makeRef(numberRef, sizeLink, ...args);
export const checkedRef = (...args)=>makeRef(booleanRef, checkedLink, ...args);
export const scrollRef = (...args)=>makeRef(numberRef, scrollLink, ...args);
export const visibleRef = (...args)=>makeRef(booleanRef, visibleLink, ...args);
export const matchMediaRef = (...args)=>makeRef(booleanRef, matchMediaLink, ...args);
