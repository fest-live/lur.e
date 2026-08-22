/**
 * Shared mount and back-navigation contract for transient UI overlays.
 * This module deliberately discovers shell hosts by data attribute so LUR.E
 * stays below fl.ui and subsystem in the import hierarchy.
 */

import {
    ClosePriority,
    registerCloseable,
    type CloseableEntry,
} from "../../interactive/tasking/BackNavigation";

export type OverlayHostDocument = Pick<Document, "body" | "querySelector">;

export type ResolveOverlayHostOptions = {
    host?: HTMLElement | null;
    document?: OverlayHostDocument | null;
};

/**
 * Resolve the most specific host available to the current document.
 * INVARIANT: callers may always override discovery with an explicit host.
 */
export const resolveOverlayHost = ({
    host = null,
    document: documentLike = typeof document !== "undefined" ? document : null,
}: ResolveOverlayHostOptions = {}): HTMLElement | null => {
    if (host) return host;
    if (!documentLike) return null;
    return documentLike.querySelector<HTMLElement>("[data-env-shell-overlays]")
        ?? documentLike.querySelector<HTMLElement>('[data-app-layer="overlay"]')
        ?? documentLike.body
        ?? null;
};

export type TransientOverlayKind =
    | "context-menu"
    | "dropdown"
    | "modal"
    | "dialog"
    | "sidebar"
    | "overlay"
    | "panel"
    | "toast";

export type TransientOverlayOptions = {
    id?: string;
    kind: TransientOverlayKind;
    element?: HTMLElement | null;
    isActive?: () => boolean;
    close: () => boolean | void;
    priority?: ClosePriority | number;
    group?: string;
};

const priorityForKind: Record<TransientOverlayKind, ClosePriority> = {
    "context-menu": ClosePriority.CONTEXT_MENU,
    dropdown: ClosePriority.DROPDOWN,
    modal: ClosePriority.MODAL,
    dialog: ClosePriority.DIALOG,
    sidebar: ClosePriority.SIDEBAR,
    overlay: ClosePriority.OVERLAY,
    panel: ClosePriority.PANEL,
    toast: ClosePriority.TOAST,
};

let registrationSequence = 0;

/**
 * Register a closeable overlay without initializing or otherwise changing the
 * application's global back-navigation policy. Returns an idempotent disposer.
 */
export const registerTransientOverlay = ({
    id,
    kind,
    element = null,
    isActive,
    close,
    priority = priorityForKind[kind],
    group = `overlay:${kind}`,
}: TransientOverlayOptions): (() => void) => {
    // INVARIANT: same-kind overlays close last-in-first-out while preserving
    // the integer ClosePriority bands shared with other back-stack entries.
    const orderedPriority = Number(priority) + (++registrationSequence / 1_000_000);
    let disposed = false;
    let unregister: (() => void) | null = null;
    const dispose = () => {
        if (disposed) return;
        disposed = true;
        unregister?.();
        unregister = null;
    };
    const entry: Omit<CloseableEntry, "id"> & { id?: string } = {
        id,
        priority: orderedPriority,
        element: element ? new WeakRef(element) : null,
        group,
        isActive: () => !disposed && (isActive?.() ?? Boolean(element?.isConnected)),
        close: () => {
            if (disposed) return false;
            const result = close();
            if (result !== false) dispose();
            return result;
        },
    };
    unregister = registerCloseable(entry);
    return dispose;
};
