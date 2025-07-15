import { stringRef, ref, numberRef, booleanRef, deref, isValidObj, makeReactive, addToCallChain } from "fest/object";
import { attrLink, valueLink, checkedLink, valueAsNumberLink, localStorageLink, sizeLink, scrollLink, visibleLink, matchMediaLink, orientLink } from "./Links";
import { WRef } from "fest/dom";

//
export const makeRef = (type, link, ...args)=>{
    const rf = (type ?? ref)?.(null), usub = link?.(rf, ...args);
    if (usub && rf) addToCallChain(rf, Symbol.dispose, usub); return rf;
}

//
export const orientRef = (...args)=>makeRef(stringRef, orientLink, ...args);
export const attrRef = (...args)=>makeRef(stringRef, attrLink, ...args);
export const valueRef = (...args)=>makeRef(stringRef, valueLink, ...args);
export const valueAsNumberRef = (...args)=>makeRef(numberRef, valueAsNumberLink, ...args);
export const localStorageRef = (...args)=>makeRef(stringRef, localStorageLink, ...args);
export const sizeRef = (...args)=>makeRef(numberRef, sizeLink, ...args);
export const checkedRef = (...args)=>makeRef(booleanRef, checkedLink, ...args);
export const scrollRef = (...args)=>makeRef(numberRef, scrollLink, ...args);
export const visibleRef = (...args)=>makeRef(booleanRef, visibleLink, ...args);
export const matchMediaRef = (...args)=>makeRef(booleanRef, matchMediaLink, ...args);

/**
 * Создаёт слабую реактивную ссылку на объект.
 *
 * @param {any} [initial] - Объект для обёртки или реактив.
 * @param {any} [behavior] - Дополнительное поведение реактива.
 * @returns {any} - Реактивная ссылка или WeakRef.
 */
export const makeWeakRef = (initial?: any, behavior?: any)=>{
    const obj = deref(initial);
    return isValidObj(obj) ? makeReactive(WRef(obj)) : ref(obj, behavior);
};
