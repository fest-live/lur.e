/*
 * Filename: stacking.ts
 * FullPath: modules/projects/lur.e/src/design/layers/stacking.ts
 * Change date and time: 05.11.00_29.07.2026
 * Reason for changes: Hybrid stackMode — shift (±1) or order-equal (DOM order).
 */

import { getExistsZIndex } from "../anchor/Utils";
import type { AppendAsLayerOptions, LayerRole, StackMode } from "./types";

export const defaultZIndexShift = (role: LayerRole): number =>
    role === "underlying" ? -1 : 1;

/**
 * Returns numeric z-index to apply, or null to leave unset
 * (order-equal when main has no explicit z-index — DOM paint order wins).
 */
export function resolveLayerZIndex(
    main: HTMLElement,
    options: Pick<AppendAsLayerOptions, "role" | "stackMode" | "zIndexShift">
): number | null {
    const role = options.role;
    const stackMode: StackMode = options.stackMode ?? "shift";
    const mainZ = getExistsZIndex(main);
    const mainStyleZ = (main.style?.zIndex ?? "").trim();
    const mainIsAuto = !mainStyleZ || mainStyleZ === "auto";

    if (stackMode === "order-equal") {
        if (mainIsAuto) return null;
        return mainZ;
    }

    const shift = options.zIndexShift ?? defaultZIndexShift(role);
    // WHY: shift needs a numeric base; treat auto as 0.
    return Math.max(mainIsAuto ? 0 : mainZ + shift, 0);
}
