
import {importCdn} from "u2re/cdnImport";

//
export const generateId = (len = 16) => {
    const arr = new Uint8Array((len || 16) / 2); window.crypto.getRandomValues(arr);
    return Array.from(arr, (dec)=>dec.toString(16).padStart(2, "0")).join('')
}

//
export const placeWithElement = async (self?: HTMLElement, element?: HTMLElement, where?: string, gap: number = 0)=>{
    if (
        element && element.dataset?.hidden == null &&
        self && self?.dataset?.hidden == null
    ) { // @ts-ignore
        const {getBoundingOrientRect} = await Promise.try(importCdn, ["u2re/dom"]);

        //
        const box      = getBoundingOrientRect(element);
        const self_box = getBoundingOrientRect(self);
        const anchor   = element?.style?.getPropertyValue?.("anchor-name");

        //
        let ID = "--" + generateId();
        if (!anchor || anchor == "none") { element?.style?.setProperty?.("anchor-name", ID, ""); } else { ID = anchor; }

        //
        self.style.setProperty("--anchor-group", ID, "");
        self.style.setProperty("--inline-size", (box.width || self_box.width || 0) + "px", "");

        //
        const updated_box = getBoundingOrientRect(self), style = getComputedStyle(self);
        const min_height  = Math.max(parseFloat(style?.minBlockSize  || "0") || 0, parseFloat(style?.blockSize  || "0") || 0);
        const min_width   = Math.max(parseFloat(style?.minInlineSize || "0") || 0, parseFloat(style?.inlineSize || "0") || 0);

        // for taskbar/navbar
        self.style.setProperty("--client-x", `${(box.left || 0)      + (box.width - Math.max(updated_box.width , min_width)) * 0.5}`);
        self.style.setProperty("--client-y", `${(where == "from-top" ? (box.top   - Math.max(updated_box.height, min_height) - gap) : (box.bottom + gap)) || 0}`);
    }
}

//
export const placeWithCursor = (ctxMenu?: any, ev?: any)=>{
    ctxMenu.style.setProperty("--inline-size", "8rem");
    ctxMenu.style.setProperty("--client-x", (ev?.orient?.[0] ?? ev?.clientX) || 0);
    ctxMenu.style.setProperty("--client-y", (ev?.orient?.[1] ?? ev?.clientY) || 0);
    ctxMenu.style.setProperty("--page-x", ev?.pageX || 0);
    ctxMenu.style.setProperty("--page-y", ev?.pageY || 0);
}
