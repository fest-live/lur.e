/**
 * Shared overlay placement in the same client-coordinate space as DOM rects.
 * DOM application and CSS Anchor lifecycle intentionally live separately so
 * the candidate math is testable without a browser.
 */

import { readFixedOverlayViewport } from "@fest-lib/dom";

export type Placement =
    | "bottom-start"
    | "bottom-end"
    | "top-start"
    | "top-end"
    | "right-start"
    | "right-end"
    | "left-start"
    | "left-end";

export type PlacementRect = {
    left: number;
    top: number;
    right: number;
    bottom: number;
    width: number;
    height: number;
};

export type PlacementViewport = PlacementRect;

export type PlacementOrigin =
    | { type: "point"; x: number; y: number }
    | { type: "element"; rect: PlacementRect };

export type PlacementOverlay = {
    width: number;
    height: number;
};

export type PlacementResult = {
    left: number;
    top: number;
    placement: Placement;
    clamped: boolean;
};

export type ResolvePlacementOptions = {
    origin: PlacementOrigin;
    overlay: PlacementOverlay;
    viewport: PlacementViewport;
    placement?: Placement;
    fallbacks?: Placement[];
    gap?: number;
    margin?: number;
};

type Position = { left: number; top: number };

const defaultFallbacks: Record<Placement, Placement[]> = {
    "bottom-start": ["top-start", "bottom-end", "top-end"],
    "bottom-end": ["top-end", "bottom-start", "top-start"],
    "top-start": ["bottom-start", "top-end", "bottom-end"],
    "top-end": ["bottom-end", "top-start", "bottom-start"],
    "right-start": ["left-start", "right-end", "left-end"],
    "right-end": ["left-end", "right-start", "left-start"],
    "left-start": ["right-start", "left-end", "right-end"],
    "left-end": ["right-end", "left-start", "right-start"],
};

const originRect = (origin: PlacementOrigin): PlacementRect => {
    if (origin.type === "element") return origin.rect;
    return {
        left: origin.x,
        top: origin.y,
        right: origin.x,
        bottom: origin.y,
        width: 0,
        height: 0,
    };
};

const candidatePosition = (
    origin: PlacementRect,
    overlay: PlacementOverlay,
    placement: Placement,
    gap: number,
): Position => {
    switch (placement) {
        case "bottom-start": return { left: origin.left, top: origin.bottom + gap };
        case "bottom-end": return { left: origin.right - overlay.width, top: origin.bottom + gap };
        case "top-start": return { left: origin.left, top: origin.top - overlay.height - gap };
        case "top-end": return { left: origin.right - overlay.width, top: origin.top - overlay.height - gap };
        case "right-start": return { left: origin.right + gap, top: origin.top };
        case "right-end": return { left: origin.right + gap, top: origin.bottom - overlay.height };
        case "left-start": return { left: origin.left - overlay.width - gap, top: origin.top };
        case "left-end": return { left: origin.left - overlay.width - gap, top: origin.bottom - overlay.height };
    }
};

const overflowOf = (
    position: Position,
    overlay: PlacementOverlay,
    viewport: PlacementViewport,
    margin: number,
): number => {
    const minLeft = viewport.left + margin;
    const minTop = viewport.top + margin;
    const maxRight = viewport.right - margin;
    const maxBottom = viewport.bottom - margin;
    return Math.max(0, minLeft - position.left)
        + Math.max(0, minTop - position.top)
        + Math.max(0, position.left + overlay.width - maxRight)
        + Math.max(0, position.top + overlay.height - maxBottom);
};

const clampPosition = (
    position: Position,
    overlay: PlacementOverlay,
    viewport: PlacementViewport,
    margin: number,
): Position => {
    const minLeft = viewport.left + margin;
    const minTop = viewport.top + margin;
    const maxLeft = Math.max(minLeft, viewport.right - margin - overlay.width);
    const maxTop = Math.max(minTop, viewport.bottom - margin - overlay.height);
    return {
        left: Math.min(Math.max(position.left, minLeft), maxLeft),
        top: Math.min(Math.max(position.top, minTop), maxTop),
    };
};

/**
 * Choose the first candidate that fits, otherwise clamp the least-overflowing
 * candidate. The result is stable for both CSS Anchor fallbacks and JS layout.
 */
export const resolvePlacement = ({
    origin,
    overlay,
    viewport,
    placement = "bottom-start",
    fallbacks = defaultFallbacks[placement],
    gap = 4,
    margin = 8,
}: ResolvePlacementOptions): PlacementResult => {
    const rect = originRect(origin);
    const candidates = Array.from(new Set([placement, ...fallbacks]));
    let best: { placement: Placement; position: Position; overflow: number } | null = null;

    for (const candidate of candidates) {
        const position = candidatePosition(rect, overlay, candidate, gap);
        const overflow = overflowOf(position, overlay, viewport, margin);
        if (overflow === 0) {
            return { ...position, placement: candidate, clamped: false };
        }
        if (!best || overflow < best.overflow) {
            best = { placement: candidate, position, overflow };
        }
    }

    const fallback = best ?? {
        placement,
        position: candidatePosition(rect, overlay, placement, gap),
        overflow: 0,
    };
    return {
        ...clampPosition(fallback.position, overlay, viewport, margin),
        placement: fallback.placement,
        clamped: fallback.overflow > 0,
    };
};

export type OverlayPlacementOrigin =
    | { type: "point"; x: number; y: number }
    | { type: "element"; element: HTMLElement };

export type OverlayPlacementStrategy = "auto" | "css-anchor" | "js";

export type PlaceOverlayOptions = {
    origin: OverlayPlacementOrigin;
    placement?: Placement;
    fallbacks?: Placement[];
    gap?: number;
    margin?: number;
    viewport?: PlacementViewport;
    strategy?: OverlayPlacementStrategy;
};

export type PlacementHandle = {
    strategy: Exclude<OverlayPlacementStrategy, "auto">;
    update: () => PlacementResult | null;
    dispose: () => void;
};

let anchorSeed = 0;

const toPlacementRect = (rect: DOMRect | ClientRect): PlacementRect => ({
    left: rect.left,
    top: rect.top,
    right: rect.right,
    bottom: rect.bottom,
    width: rect.width,
    height: rect.height,
});

const toResolvedOrigin = (origin: OverlayPlacementOrigin): PlacementOrigin =>
    origin.type === "point"
        ? origin
        : { type: "element", rect: toPlacementRect(origin.element.getBoundingClientRect()) };

const supportsCssAnchorPositioning = (): boolean => {
    try {
        return typeof CSS !== "undefined"
            && (CSS.supports("position-anchor: --fest-placement")
                || CSS.supports("anchor-name: --fest-placement"))
            && CSS.supports("position-try-fallbacks: flip-inline");
    } catch {
        return false;
    }
};

const cssAreaFor = (placement: Placement): string => {
    switch (placement) {
        case "bottom-start": return "bottom span-right";
        case "bottom-end": return "bottom span-left";
        case "top-start": return "top span-right";
        case "top-end": return "top span-left";
        case "right-start": return "right span-bottom";
        case "right-end": return "right span-top";
        case "left-start": return "left span-bottom";
        case "left-end": return "left span-top";
    }
};

const saveStyles = (element: HTMLElement, names: string[]): Map<string, string> =>
    new Map(names.map((name) => [name, element.style.getPropertyValue(name)]));

const restoreStyles = (element: HTMLElement, saved: Map<string, string>): void => {
    for (const [name, value] of saved) {
        if (value) element.style.setProperty(name, value);
        else element.style.removeProperty(name);
    }
};

/**
 * Position an overlay at a point or element. Element origins use native CSS
 * Anchor Positioning when available; all other cases share the pure JS solver.
 */
export const placeOverlay = (
    overlay: HTMLElement,
    {
        origin,
        placement = "bottom-start",
        fallbacks,
        gap,
        margin,
        viewport,
        strategy = "auto",
    }: PlaceOverlayOptions,
): PlacementHandle => {
    const useCssAnchor = origin.type === "element"
        && strategy !== "js"
        && supportsCssAnchorPositioning();
    let disposed = false;

    if (useCssAnchor) {
        const anchor = origin.element;
        const anchorName = `--fest-placement-${++anchorSeed}`;
        const savedAnchor = saveStyles(anchor, ["anchor-name"]);
        const savedOverlay = saveStyles(overlay, [
            "left",
            "top",
            "position-anchor",
            "position-area",
            "position-try-fallbacks",
        ]);
        const currentNames = anchor.style.getPropertyValue("anchor-name").trim();
        anchor.style.setProperty("anchor-name", [currentNames, anchorName].filter(Boolean).join(" "));
        overlay.style.removeProperty("left");
        overlay.style.removeProperty("top");
        overlay.style.setProperty("position-anchor", anchorName);
        overlay.style.setProperty("position-area", cssAreaFor(placement));
        overlay.style.setProperty("position-try-fallbacks", "flip-inline, flip-block");

        return {
            strategy: "css-anchor",
            update: () => null,
            dispose: () => {
                if (disposed) return;
                disposed = true;
                restoreStyles(anchor, savedAnchor);
                restoreStyles(overlay, savedOverlay);
            },
        };
    }

    const savedOverlay = saveStyles(overlay, ["left", "top"]);
    const update = (): PlacementResult => {
        const rect = overlay.getBoundingClientRect();
        const result = resolvePlacement({
            origin: toResolvedOrigin(origin),
            overlay: { width: rect.width, height: rect.height },
            viewport: viewport ?? readFixedOverlayViewport(),
            placement,
            fallbacks,
            gap,
            margin,
        });
        overlay.style.setProperty("left", `${result.left}px`);
        overlay.style.setProperty("top", `${result.top}px`);
        return result;
    };

    update();
    return {
        strategy: "js",
        update,
        dispose: () => {
            if (disposed) return;
            disposed = true;
            restoreStyles(overlay, savedOverlay);
        },
    };
};
