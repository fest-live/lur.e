/*
 * Filename: Register.ts
 * FullPath: modules/projects/lur.e/src/design/layers/Register.ts
 * Change date and time: 05.12.00_29.07.2026
 * Reason for changes: Role-aware DOMMixin registration for underlying/overlaying layers.
 */

import { DOMMixin } from "@fest-lib/dom";
import { appendAsOverlay, appendAsUnderlying } from "./AnchorOverlay";
import type { LayerRole } from "./types";

const registered = new Map();

export const registerLayerElement = (
    name: string,
    construct: (content: any, holder?: any, inputChange?: any) => HTMLElement | null | undefined,
    opts: { role: LayerRole } = { role: "overlaying" },
) => {
    const withIt = new WeakMap();

    const bindWith = (content: any, holder?: any, inputChange?: any | null) => {
        if (content?.style?.anchorName || withIt?.has?.(content)) return false;
        if (content) {
            const self: any = construct?.(content, holder, inputChange);
            withIt?.set?.(content, self);
            if (opts.role === "underlying") {
                appendAsUnderlying(content, self, holder);
            } else {
                appendAsOverlay(content, self, holder);
            }
        }
        return true;
    };

    class LayerModifier extends DOMMixin {
        constructor(n?) { super(n); }

        // @ts-ignore
        connect(ws) {
            const self: any = ws?.deref?.() ?? ws;
            if (withIt?.has?.(self)) return;
            bindWith(self);
        }
    }

    const pack = [withIt, bindWith, LayerModifier];
    registered.set(name, pack);
    new LayerModifier(name);
    return pack;
};

/** COMPAT: previous overlay-only registrar. */
export const registerOverlayElement = (name, construct) =>
    registerLayerElement(name, construct, { role: "overlaying" });

export const registerUnderlyingElement = (name, construct) =>
    registerLayerElement(name, construct, { role: "underlying" });
