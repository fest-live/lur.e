/*
 * Filename: ExitLayer.ts
 * FullPath: modules/projects/lur.e/src/lure/context/ExitLayer.ts
 * FIND:exit-layer
 * TAG:exit-layer,style-anim,lure
 * WHY: disappear() played in the origin parent reflows layout under the dying
 *      node (siblings jump, ancestors can hide or bury it). The exit layer
 *      relocates the node into a fixed top-most host pinned to its last
 *      viewport rect, so the exit plays "in place" on screen until it ends.
 * INVARIANT: the exit never detaches before the animation settles; a
 *      re-parent (move) detected at the decision frame cancels the exit
 *      without removal and without u2-removed.
 * INVARIANT: hidden, display-none, zero-box and fully covered elements skip
 *      the animation entirely and detach instantly.
 */

import { disappear, waitElementAnimations } from "@fest-lib/style-lib";
import type { AnimationOptions } from "@fest-lib/style-lib";

export type ExitLayerOptions = {
    /** Container for exiting ghosts. Default: a lazily created fixed body-level host. */
    host?: HTMLElement | null;
    /** z-index of the default host. */
    zIndex?: number;
};

type ExitLayerDefaults = {
    enabled: boolean;
    host: HTMLElement | null;
    zIndex: number;
};

const defaults: ExitLayerDefaults = { enabled: false, host: null, zIndex: 2147483647 };

/**
 * Toggle the exit-layer mechanism globally (apps call this once at boot);
 * per-call `lifecycle.exitLayer` overrides the global default.
 */
export const setExitLayerDefaults = (patch: Partial<ExitLayerDefaults>): void => {
    Object.assign(defaults, patch);
};

export const isExitLayerEnabled = (setting?: boolean | ExitLayerOptions | null): boolean =>
    setting === true || (setting != null && typeof setting === "object") || defaults.enabled;

const EXIT_HOST_TAG = "data-lure-exit-layer";
const EXIT_GHOST_TAG = "data-exit-ghost";

let sharedHost: HTMLElement | null = null;

/**
 * INVARIANT: the default host is a zero-size fixed element with visible
 * overflow — fixed-position children keep pinning to the viewport, and the
 * max z-index keeps them above app layers without touching shell hosts
 * (their transform/overflow could break viewport pinning).
 */
export const ensureExitHost = (options: ExitLayerOptions = {}): HTMLElement | null => {
    const explicit = options.host ?? defaults.host;
    if (explicit) return explicit;
    const doc = typeof document !== "undefined" ? document : null;
    if (!doc?.body) return null;
    if (!sharedHost?.isConnected) {
        sharedHost = doc.createElement("div");
        sharedHost.setAttribute(EXIT_HOST_TAG, "");
        sharedHost.setAttribute("aria-hidden", "true");
        Object.assign(sharedHost.style, {
            position: "fixed",
            left: "0px",
            top: "0px",
            width: "0px",
            height: "0px",
            margin: "0px",
            padding: "0px",
            border: "none",
            overflow: "visible",
            pointerEvents: "none",
            zIndex: String(options.zIndex ?? defaults.zIndex),
        });
        doc.body.appendChild(sharedHost);
    }
    return sharedHost;
};

/*
 * WHY: animating an exit nobody can see is wasted work and can flash borders
 *      or shadows of an otherwise invisible node.
 * NOTE: coverage samples only the visual center via elementsFromPoint — a
 *      heuristic for "fully overlapped".
 * COMPAT: without checkVisibility / elementsFromPoint (jsdom, older engines)
 *      the verdict defaults to visible so the exit path stays testable.
 */
export const isExitVisibilityHidden = (el: Element): boolean => {
    if (!el?.isConnected) return true;
    const anyEl = el as any;
    if (typeof anyEl.checkVisibility !== "function") {
        // COMPAT: jsdom / older engines — computed display/visibility is the
        // only reliable signal (getClientRects is always empty there).
        try {
            const style = getComputedStyle(el);
            if (style.display === "none") return true;
            if (style.visibility === "hidden" || style.visibility === "collapse") return true;
        } catch { /* assume visible */ }
        return false;
    }
    const visible = anyEl.checkVisibility({
        checkVisibilityCSS: true,
        checkOpacity: true,
        contentVisibilityAuto: true,
        visibilityProperty: true,
        opacityProperty: true,
    });
    if (!visible) return true;
    if (el.getClientRects().length === 0) return true;
    const doc = typeof document !== "undefined" ? document : null;
    if (doc && typeof doc.elementsFromPoint === "function") {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
            const topMost = doc.elementsFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2)?.[0];
            if (topMost && topMost !== el && !el.contains(topMost)) return true;
        }
    }
    return false;
};

const nextFrame = (): Promise<void> =>
    new Promise<void>((resolve) => {
        const raf = (globalThis as any).requestAnimationFrame
            ?? ((cb: FrameRequestCallback) => setTimeout(() => cb(0), 0));
        raf(() => resolve());
    });

/*
 * WHY: inline every computed style before pinning — the ghost leaves its
 *      parent, so inherited properties and custom properties would otherwise
 *      fall back to the host chain and repaint the exit differently.
 */
const pinGhostToViewport = (el: HTMLElement, rect: DOMRect): void => {
    try {
        const computed = getComputedStyle(el);
        for (let i = 0; i < computed.length; i++) {
            const name = computed[i];
            const value = computed.getPropertyValue(name);
            if (value) el.style.setProperty(name, value, computed.getPropertyPriority(name));
        }
    } catch { /* COMPAT: engines without iterable computed style keep class styles */ }
    // NOTE: rect already includes the old transform; pinning left/top/size to
    // the rect with transform cleared keeps the same visual box except for
    // rotated/skewed elements.
    Object.assign(el.style, {
        position: "fixed",
        left: `${rect.left}px`,
        top: `${rect.top}px`,
        right: "auto",
        bottom: "auto",
        inset: "auto",
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        margin: "0px",
        transform: "none",
        boxSizing: "border-box",
        // WHY: never intercept input while dying, even if copied styles say auto.
        pointerEvents: "none",
    });
};

export type ExitLayerResult = "removed" | "kept";

/**
 * Play the disappear animation for `el` inside the exit-layer host.
 * Returns "kept" when the node turned out to be moved (re-parented) between
 * the remove call and the decision frame — the caller must then treat the
 * node as alive (no removal, no u2-removed).
 */
export const runExitLayer = async (
    el: HTMLElement,
    originParent: Node | null,
    animation: AnimationOptions | null | undefined,
    options: ExitLayerOptions = {},
): Promise<ExitLayerResult> => {
    // WHY: wait one frame before committing — a synchronous re-append (a move
    // to another layer/place) lands between the remove call and this frame.
    await nextFrame();
    if (el.parentNode !== originParent) return "kept";
    const host = ensureExitHost(options);
    if (!host) { el.remove(); return "removed"; } // pre-mount document: nothing to show
    pinGhostToViewport(el, el.getBoundingClientRect());
    el.setAttribute(EXIT_GHOST_TAG, "");
    host.appendChild(el);
    try {
        // INVARIANT: disappear never detaches — the ghost removes the node itself.
        await disappear(el, animation ?? null);
        await waitElementAnimations(el);
    } catch (err) {
        console?.warn?.(err);
    } finally {
        // NOTE: a stale re-append during the animation still loses the node —
        // it was already committed to removal.
        el.remove();
    }
    return "removed";
};
