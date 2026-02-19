import { DOMMixin } from "fest/dom";
import { appendAsOverlay } from "./AnchorOverlay";

//
const registered = new Map();

//
export const registerOverlayElement = (name, construct) => {
    const withIt = new WeakMap();

    //
    const bindWith = (content: any, holder?: any, inputChange?: any|null) => {
        if (content?.style?.anchorName || withIt?.has?.(content)) return false;
        if (content) {
            const self: any = construct?.(content, holder, inputChange);
            withIt?.set?.(content, self); appendAsOverlay(content, self, holder);
        }
        return true;
    }

    //
    class OverlayModifier extends DOMMixin {
        constructor(name?) { super(name); }

        // @ts-ignore
        connect(ws) {
            const self: any = ws?.deref?.() ?? ws;
            if (withIt?.has?.(self)) return;
            bindWith(self);
        }
    }

    //
    const pack = [withIt, bindWith, OverlayModifier];
    registered.set(name, pack);
    new OverlayModifier(name);
    return pack;
}
