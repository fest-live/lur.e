import { stringRef, autoRef, numberRef, booleanRef, deref, makeReactive, addToCallChain, subscribe, computed, $trigger } from "fest/object";
import { attrLink, valueLink, checkedLink, valueAsNumberLink, localStorageLink, sizeLink, scrollLink, visibleLink, matchMediaLink, orientLink, localStorageLinkMap, hashTargetLink } from "./Links";
import { addEvent, getPadding, handleAttribute } from "fest/dom";
import { elMap } from "./Binding";
import { isValidObj, WRef } from "fest/core";
import { operated } from "fest/lure";

//
export const makeRef = (host?: any, type?: any, link?: any, ...args)=>{
    if (link == attrLink || link == handleAttribute) {
        const exists = elMap?.get?.(host)?.get?.(handleAttribute)?.get?.(args[0])?.[0];
        if (exists) { return exists; };
    }
    const rf = (type ?? autoRef)?.(null), usub = link?.(host, rf, ...args);
    if (usub && rf) addToCallChain(rf, Symbol.dispose, usub); return rf;
}

//
export const orientRef = (host?: any, ...args)=>makeRef(host, numberRef, orientLink, ...args);
export const attrRef = (host?: any, ...args)=>makeRef(host, stringRef, attrLink, ...args);
export const valueRef = (host?: any, ...args)=>makeRef(host, stringRef, valueLink, ...args);
export const valueAsNumberRef = (host?: any, ...args)=>makeRef(host, numberRef, valueAsNumberLink, ...args);
export const localStorageRef = (...args)=>{
    if (localStorageLinkMap.has(args[0])) return localStorageLinkMap.get(args[0])?.[1];
    const link: any = localStorageLink, type: any = stringRef;
    const rf = (type ?? autoRef)?.(null), pair = link?.(null, rf, ...args);
    const [usub, _] = pair;
    if (usub && rf) addToCallChain(rf, Symbol.dispose, usub);
    /*localStorageLinkMap.set(args[0], pair);*/ return rf;
};

//
export const sizeRef = (host?: any, ...args)=>makeRef(host, numberRef, sizeLink, ...args);
export const checkedRef = (host?: any, ...args)=>makeRef(host, booleanRef, checkedLink, ...args);
export const scrollRef = (host?: any, ...args)=>makeRef(host, numberRef, scrollLink, ...args);
export const visibleRef = (host?: any, ...args)=>makeRef(host, booleanRef, visibleLink, ...args);
export const matchMediaRef = (...args)=>makeRef(null, booleanRef, matchMediaLink, ...args);
export const hashTargetRef = (...args)=>makeRef(null, stringRef, hashTargetLink, ...args);

//
export const makeWeakRef = (/*host?: any,*/ initial?: any, behavior?: any)=>{
    const obj = deref(initial);
    return isValidObj(obj) ? makeReactive(WRef(obj)) : autoRef(obj, behavior);
};

//
export const scrollSize  = (source: HTMLElement, axis: number = 0, inputChange?: any|null)=>{ // @ts-ignore
    const target  = toRef(source);
    const compute = (vl: any)=>((deref(target)?.[['scrollWidth', 'scrollHeight'][axis] || 'scrollWidth'] - 1) || 1);
    const scroll  = scrollRef(source, (["inline", "block"] as ["inline", "block"])[axis]);
    const conRef  = sizeRef(source, (["inline", "block"] as ["inline", "block"])[axis], "content-box");
    const percent = computed(scroll, compute);
    const recompute = ()=>{ scroll?.[$trigger]?.(); percent?.[$trigger]?.(); }

    //
    subscribe(conRef, (vl: any)=>{ recompute?.(); });
    addEvent(inputChange || source, "input" , ()=>{ recompute?.(); });
    addEvent(inputChange || source, "change", ()=>{ recompute?.(); });
    queueMicrotask(()=>{ recompute?.(); });
    return percent;
}

// Enhanced reactive scrollbar sizing with CSS calc integration
export const reactiveScrollbarSize = (source: HTMLElement, axis: number, contentSize: ReturnType<typeof numberRef>) => {
    const containerSize = axis === 0
        ? operated([], () => source.clientWidth)
        : operated([], () => source.clientHeight);

    return operated([containerSize, contentSize], () => {
        const ratio = containerSize.value / contentSize.value;
        const minSize = 20; // Minimum thumb size in pixels
        return Math.max(minSize, ratio * containerSize.value);
    });
};

// All classes are exported above when declared
export const paddingBoxSize  = (source: HTMLElement, axis: number, inputChange?: any|null)=>{ // @ts-ignore
    const target  = asWeak(source);
    const scroll  = scrollRef(source, (["inline", "block"] as ["inline", "block"])[axis]);
    const conRef  = sizeRef(source, (["inline", "block"] as ["inline", "block"])[axis], "content-box");
    const content = computed(conRef, (v: any)=>(v + (getPadding(source, (["inline", "block"] as ["inline", "block"])[axis]) || 0)));
    const recompute = ()=>{ conRef?.[$trigger]?.(); content?.[$trigger]?.(); }

    //
    subscribe(scroll, (vl: any)=>{ recompute?.(); });
    addEvent(inputChange || source, "input" , ()=>{ recompute?.(); });
    addEvent(inputChange || source, "change", ()=>{ recompute?.(); });
    queueMicrotask(()=>{ recompute?.(); });
    return content;
}
