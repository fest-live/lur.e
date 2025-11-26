/**
 * BackNavigation - Priority-based back gesture/button navigation manager
 *
 * Handles mobile/browser back gestures/buttons for closing:
 * - Context menus (highest priority)
 * - Modal dialogs
 * - Sidebars/overlays
 * - Tasks/views (lowest priority)
 *
 * Usage:
 * 1. Register closable elements/callbacks with priority
 * 2. On back navigation, closes the highest priority active element first
 * 3. Supports custom close handlers and visibility checks
 */

import { addEvent } from "fest/dom";
import { booleanRef } from "fest/object";

//
export enum ClosePriority {
    CONTEXT_MENU = 100,
    DROPDOWN = 90,
    MODAL = 80,
    DIALOG = 70,
    SIDEBAR = 60,
    OVERLAY = 50,
    PANEL = 40,
    TOAST = 30,
    TASK = 20,
    VIEW = 10,
    DEFAULT = 0
}

//
export interface CloseableEntry {
    id: string;
    priority: ClosePriority | number;
    isActive: () => boolean;
    close: () => boolean | void;
    element?: WeakRef<HTMLElement> | null;
    group?: string;
}

//
interface BackNavigationOptions {
    preventDefaultNavigation?: boolean;
    pushInitialState?: boolean;
    skipPopstateHandler?: boolean; // Skip adding popstate handler (when managed externally)
    debug?: boolean;
}

//
const registry = new Map<string, CloseableEntry>();
let navigationInitialized = false;
let processingBack = false;
let historyDepth = 0;
let options: BackNavigationOptions = {};

// Shared state for coordination between handlers
export let ignoreNextPopState = false;
export const setIgnoreNextPopState = (value: boolean) => { ignoreNextPopState = value; };

//
const generateId = () => `closeable-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

/**
 * Register a closeable element/callback with the back navigation system
 */
export const registerCloseable = (
    entry: Omit<CloseableEntry, "id"> & { id?: string }
): (() => void) => {
    const id = entry.id || generateId();
    const fullEntry: CloseableEntry = Object.assign(entry, { id });//{ ...entry, id };

    registry.set(id, fullEntry);

    if (options.debug) {
        console.log("[BackNav] Registered:", id, "priority:", entry.priority);
    }

    return () => unregisterCloseable(id);
};

/**
 * Unregister a closeable by ID
 */
export const unregisterCloseable = (id: string): boolean => {
    const removed = registry.delete(id);
    if (options.debug && removed) {
        console.log("[BackNav] Unregistered:", id);
    }
    return removed;
};

/**
 * Get the highest priority active closeable
 */
export const getActiveCloseable = (): CloseableEntry | null => {
    let highest: CloseableEntry | null = null;

    for (const entry of registry.values()) {
        // Check if element still exists (if WeakRef is provided)
        if (entry.element) {
            const el = entry.element.deref();
            if (!el || !el.isConnected) {
                registry.delete(entry.id);
                continue;
            }
        }

        // Check if closeable is active
        if (!entry?.isActive?.()) continue;

        // Compare priorities
        if (!highest || entry.priority > highest.priority) {
            highest = entry;
        }
    }

    return highest;
};

/**
 * Get all active closeables sorted by priority (highest first)
 */
export const getActiveCloseables = (): CloseableEntry[] => {
    const active: CloseableEntry[] = [];

    for (const entry of registry.values()) {
        if (entry.element) {
            const el = entry.element.deref();
            if (!el || !el.isConnected) {
                registry.delete(entry.id);
                continue;
            }
        }

        if (entry.isActive()) {
            active.push(entry);
        }
    }

    return active.sort((a, b) => b.priority - a.priority);
};

/**
 * Attempt to close the highest priority active closeable
 * @returns true if something was closed, false otherwise
 */
export const closeHighestPriority = (): boolean => {
    const entry = getActiveCloseable();
    if (!entry) return false;

    if (options.debug) {
        console.log("[BackNav] Closing:", entry.id, "priority:", entry.priority);
    }

    const result = entry.close();
    return result !== false;
};

/**
 * Close all active closeables in a specific group
 */
export const closeByGroup = (group: string): number => {
    let closedCount = 0;

    for (const entry of registry.values()) {
        if (entry.group === group && entry.isActive()) {
            const result = entry.close();
            if (result !== false) closedCount++;
        }
    }

    return closedCount;
};

/**
 * Check if any closeable is currently active
 */
export const hasActiveCloseable = (): boolean => {
    return getActiveCloseable() !== null;
};

/**
 * Handle back navigation (popstate event)
 */
const handleBackNavigation = (ev: PopStateEvent): boolean => {
    if (processingBack) return false;
    if (ignoreNextPopState) {
        ignoreNextPopState = false;
        return false;
    }

    processingBack = true;

    try {
        const closed = closeHighestPriority();

        if (closed) {
            // Prevent actual back navigation by going forward
            // This preserves the current URL/hash without modification
            ev.preventDefault?.();
            ignoreNextPopState = true;
            history.forward();
            return true;
        }

        return false;
    } finally {
        processingBack = false;
    }
};

/**
 * Initialize back navigation handling
 */
export const initBackNavigation = (opts: BackNavigationOptions = {}): (() => void) => {
    if (navigationInitialized) {
        console.warn("[BackNav] Already initialized");
        return () => {};
    }

    options = { ...opts };
    navigationInitialized = true;

    // Push initial state to enable back detection
    if (opts.pushInitialState !== false && !opts.skipPopstateHandler) {
        historyDepth = 0;
        history.pushState({ backNav: true, depth: historyDepth }, "", location.hash);
    }

    let unbind: (() => void) | undefined;

    // Only add popstate handler if not managed externally (e.g., by Manager.ts)
    if (!opts.skipPopstateHandler) {
        const popstateHandler = (ev: PopStateEvent) => {
            const wasHandled = handleBackNavigation(ev);

            if (!wasHandled && !opts.preventDefaultNavigation) {
                // Allow normal back navigation
            }
        };

        unbind = addEvent(window, "popstate", popstateHandler);
    }

    if (options.debug) {
        console.log("[BackNav] Initialized", opts.skipPopstateHandler ? "(external handler)" : "");
    }

    return () => {
        unbind?.();
        navigationInitialized = false;
        registry.clear();
        if (options.debug) {
            console.log("[BackNav] Destroyed");
        }
    };
};

/**
 * Register a context menu as closeable
 */
export const registerContextMenu = (
    element: HTMLElement,
    visibleRef: { value: boolean },
    onClose?: () => void
): (() => void) => {
    return registerCloseable({
        id: `ctx-menu-${element.id || generateId()}`,
        priority: ClosePriority.CONTEXT_MENU,
        element: new WeakRef(element),
        group: "context-menu",
        isActive: () => visibleRef.value === true,
        close: () => {
            visibleRef.value = false;
            onClose?.();
            return true;
        }
    });
};

/**
 * Register a modal dialog as closeable
 */
export const registerModal = (
    element: HTMLElement,
    isActiveCheck?: () => boolean,
    onClose?: () => void
): (() => void) => {
    return registerCloseable({
        id: `modal-${element.id || generateId()}`,
        priority: ClosePriority.MODAL,
        element: new WeakRef(element),
        group: "modal",
        isActive: isActiveCheck ?? (() => {
            const el = element;
            return el?.isConnected &&
                   !el?.hasAttribute?.("data-hidden") &&
                   el?.checkVisibility?.({ opacityProperty: true, visibilityProperty: true }) !== false;
        }),
        close: () => {
            onClose?.();
            element?.remove?.();
            return true;
        }
    });
};

/**
 * Register a sidebar as closeable
 */
export const registerSidebar = (
    element: HTMLElement,
    openedRef: { value: boolean },
    onClose?: () => void
): (() => void) => {
    return registerCloseable({
        id: `sidebar-${element.id || generateId()}`,
        priority: ClosePriority.SIDEBAR,
        element: new WeakRef(element),
        group: "sidebar",
        isActive: () => openedRef.value === true,
        close: () => {
            openedRef.value = false;
            onClose?.();
            return true;
        }
    });
};

/**
 * Register an overlay/panel as closeable
 */
export const registerOverlay = (
    element: HTMLElement,
    isActiveCheck: () => boolean,
    onClose: () => void,
    priority: ClosePriority = ClosePriority.OVERLAY
): (() => void) => {
    return registerCloseable({
        id: `overlay-${element.id || generateId()}`,
        priority,
        element: new WeakRef(element),
        group: "overlay",
        isActive: isActiveCheck,
        close: () => {
            onClose();
            return true;
        }
    });
};

/**
 * Create a modal backdrop with back navigation support
 * Wraps an existing modal creation pattern
 */
export const createBackNavigableModal = (
    content: HTMLElement | DocumentFragment,
    options: {
        backdropClass?: string;
        closeOnBackdropClick?: boolean;
        closeOnEscape?: boolean;
        onClose?: () => void;
    } = {}
): { element: HTMLElement; close: () => void; unregister: () => void } => {
    const {
        backdropClass = "rs-modal-backdrop",
        closeOnBackdropClick = true,
        closeOnEscape = true,
        onClose
    } = options;

    const backdrop = document.createElement("div");
    backdrop.className = backdropClass;
    backdrop.appendChild(content);

    const close = () => {
        onClose?.();
        backdrop.remove();
        document.removeEventListener("keydown", escHandler);
    };

    const escHandler = (ev: KeyboardEvent) => {
        if (ev.key === "Escape" && closeOnEscape) {
            close();
        }
    };

    if (closeOnEscape) {
        document.addEventListener("keydown", escHandler);
    }

    if (closeOnBackdropClick) {
        backdrop.addEventListener("click", (ev) => {
            if (ev.target === backdrop) {
                close();
            }
        });
    }

    const unregister = registerModal(backdrop, undefined, close);

    return { element: backdrop, close, unregister };
};

//
export default {
    register: registerCloseable,
    unregister: unregisterCloseable,
    init: initBackNavigation,
    close: closeHighestPriority,
    hasActive: hasActiveCloseable,
    getActive: getActiveCloseable,
    getAllActive: getActiveCloseables,
    closeByGroup,
    registerContextMenu,
    registerModal,
    registerSidebar,
    registerOverlay,
    createBackNavigableModal,
    ClosePriority
};

