/*
 * Filename: types.ts
 * FullPath: modules/projects/lur.e/src/design/layers/types.ts
 * Change date and time: 05.11.00_29.07.2026
 * Reason for changes: Shared contracts for underlying/overlaying layer append APIs.
 */

export type LayerRole = "underlying" | "overlaying";
export type StackMode = "shift" | "order-equal";

export type LayerPlacement =
    | "fill"
    | "bottom"
    | "top"
    | "left"
    | "right"
    | "center"
    | "scrollbar-x"
    | "scrollbar-y";

/** anchor = CSS anchor to main; contain = absolute inset:0 in parent (better for overlay chrome hosts). */
export type LayerPositioning = "anchor" | "contain";

export interface AppendAsLayerOptions {
    role: LayerRole;
    stackMode?: StackMode;
    /** Default −1 underlying / +1 overlaying; ignored when stackMode is order-equal. */
    zIndexShift?: number;
    placement?: LayerPlacement;
    /** Default "anchor". Use "contain" for overlay hosts that nest absolute chrome (scrollbars). */
    positioning?: LayerPositioning;
    inset?: number;
    size?: string;
    useIntersection?: boolean;
    root?: HTMLElement | Window;
    transformOrigin?: string;
}
