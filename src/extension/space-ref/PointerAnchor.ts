import { addToCallChain, booleanRef, numberRef, stringRef } from "fest/object";
import { WRef } from "fest/core";
import { handleByPointer } from "../controllers/Handler";

//
export const pointerAnchorRef = (root = typeof document != "undefined" ? document?.documentElement : null)=>{
    if (!root) return () => { };
    const coordinate = [ numberRef(0), numberRef(0) ];
    coordinate.push(WRef(handleByPointer((ev)=>{ coordinate[0].value = ev.clientX; coordinate[1].value = ev.clientY; }, root)));
    if (coordinate[2]?.deref?.() ?? coordinate[2]) { addToCallChain(coordinate, Symbol.dispose, coordinate[2]?.deref?.() ?? coordinate[2]); }
    return coordinate;
}

//
export const visibleBySelectorRef = (selector)=>{
    const visRef = booleanRef(false), usub = handleByPointer((ev)=>{
        const target = typeof document != "undefined" ? document.elementFromPoint(ev.clientX, ev.clientY) : null;
        visRef.value = target?.matches?.(selector) ?? false;
    });
    if (usub) addToCallChain(visRef, Symbol.dispose, usub); return visRef;
}

//
export const showAttributeRef = (attribute = "data-tooltip")=>{
    const valRef = stringRef(""), usub = handleByPointer((ev)=>{
        const target: any = typeof document != "undefined" ? document.elementFromPoint(ev.clientX, ev.clientY) : null;
        valRef.value = target?.getAttribute?.(attribute)?.(`[${attribute}]`) ?? "";
    });
    if (usub) addToCallChain(valRef, Symbol.dispose, usub); return valRef;
}
