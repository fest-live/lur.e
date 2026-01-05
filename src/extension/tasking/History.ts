import { observe, propRef, affected } from "fest/object";
import { addEvent, hash } from "fest/dom";
import { isPrimitive } from "fest/core";
import { getIgnoreNextPopState, setIgnoreNextPopState } from "./BackNavigation";

//
export type NavigationAction = "PUSH" | "REPLACE" | "POP" | "BACK" | "FORWARD" | "MANUAL";

//
export interface IHistoryState {
    index: number;
    depth: number;
    action: NavigationAction;
    view: string;
    timestamp: number;
    [key: string]: any;
}

//
const STATE_KEY = "rs-nav-ctx";
const STACK_KEY = "rs-nav-stack";

//
export interface IHistoryManager {
    index: number;
    length: number;
    action: NavigationAction;
    view: string;
    canBack: boolean;
    canForward: boolean;
    entries: IHistoryState[];
}

// Global reactive state for history
export const historyState = observe({
    index: 0,
    length: 0,
    action: "MANUAL" as NavigationAction,
    view: "",
    canBack: false,
    canForward: false,
    entries: [] as IHistoryState[]
}) as unknown as IHistoryManager;

// Helper to get current state safely
const getCurrentState = (): Partial<IHistoryState> => {
    try {
        return history.state?.[STATE_KEY] || historyState?.entries?.[historyState?.index] || {};
    } catch (e) {
        return {};
    }
};

// Helper to save/load stack
const saveStack = () => {
    try {
        sessionStorage.setItem(STACK_KEY, JSON.stringify(historyState?.entries));
    } catch (e) { }
};

const loadStack = (): IHistoryState[] => {
    try {
        const stored = sessionStorage.getItem(STACK_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        return [];
    }
};

// Helper to merge state
const mergeState = (newState: any, existingData?: any) => {
    try {
        const current = existingData !== undefined ? existingData : (history?.state || {});
        if (isPrimitive(current) && current !== null) return { value: current, [STATE_KEY]: newState };
        if (current === null) return { [STATE_KEY]: newState };
        return { ...current, [STATE_KEY]: newState };
    } catch (e) {
        return { [STATE_KEY]: newState };
    }
};

//
let initialized = false;

// Patch pushState and replaceState
export const originalPush = typeof history != "undefined" ? history.pushState.bind(history) : undefined;
export const originalReplace = typeof history != "undefined" ? history.replaceState.bind(history) : undefined;
export const originalGo = typeof history != "undefined" ? history.go.bind(history) : undefined;
export const originalForward = typeof history != "undefined" ? history.forward.bind(history) : undefined;
export const originalBack = typeof history != "undefined" ? history.back.bind(history) : undefined;

// Initialize history tracking
export const initHistory = (initialView: string = "") => {
    if (initialized) return;
    initialized = true;

    //
    const current = getCurrentState();
    const view = initialView || location.hash || "#";

    // Load or init stack
    let stack = loadStack();
    const idx = current.index || 0;

    // Validate stack against current state
    if (stack && (stack?.length === 0 || idx >= stack?.length) /* || stack[idx]?.view !== (current.view || view) */) {
        // If stack is invalid or empty, we try to reconstruct or reset
        // For a new session, we might want to start fresh or trust the stack if it seems plausible
        // But if history.state has an index that doesn't match stack, trust history.state (browser truth)
        if (stack.length <= idx) {
            // Stack missing or too short. Reset/Expand
            stack[idx] = {
                index: idx,
                depth: history.length,
                action: current?.action || "REPLACE",
                view: view,
                timestamp: Date.now()
            };
        }
    }
    historyState.entries = stack;

    // Set initial state if needed
    if (!current.timestamp) {
        const state: IHistoryState = {
            index: idx,
            depth: history.length,
            action: "REPLACE",
            view: view,
            timestamp: Date.now()
        };
        history?.replaceState?.(mergeState(state), "", location.hash);

        // Update stack
        if (historyState?.entries) {
            historyState.entries[idx] = state;
        }
        saveStack();
    } else {
        // Sync reactive state with existing history state
        historyState.index = current.index || 0;
        historyState.view = current.view || view;

        // Ensure stack matches current
        if (!historyState?.entries?.[historyState?.index]) {
             historyState.entries[historyState.index] = current as IHistoryState;
             saveStack();
        }
    }

    updateReactiveState(getCurrentState()?.action || "REPLACE", view);

    //
    history.go = (delta = 0) => {
        const currentState = getCurrentState();
        currentState.index = Math.max(0, Math.min(historyState.length, (currentState.index || 0) + delta));
        const existsState = historyState.entries[currentState.index];
        Object.assign(currentState, existsState || {});

        //
        setIgnoreNextPopState(true);
        const result = originalGo?.(delta);
        setTimeout(() => { setIgnoreNextPopState(false); }, 0);

        //
        updateReactiveState((currentState?.action || "POP") || (delta > 0 ? "FORWARD" : "BACK") as any, currentState?.view);
        return result;
    };

    history.back = () => { return history.go(-1); };
    history.forward = () => { return history.go(1); };
    history.pushState = (data: any, unused: string, url?: string | URL | null) => {
        const currentState = getCurrentState();
        const nextIndex = (currentState.index || 0) + 1;

        const newState: IHistoryState = {
            index: nextIndex,
            depth: history.length + 1,
            action: "PUSH",
            view: url ? String(url) : (currentState.view || ""),
            timestamp: Date.now()
        };

        const result = originalPush?.(mergeState(newState, data), unused, url);

        // Update stack: wipe forward history
        historyState.entries = historyState?.entries?.slice?.(0, nextIndex);
        historyState.entries?.push?.(newState);
        saveStack();

        updateReactiveState("PUSH", newState.view);
        return result;
    };

    //
    history.replaceState = (data: any, unused: string, url?: string | URL | null) => {
        const currentState = getCurrentState();
        const index = currentState?.index || 0;

        //
        const newState: IHistoryState = {
            ...currentState,
            index: index,
            depth: history.length,
            action: "REPLACE",
            view: url ? String(url) : (currentState?.view || ""),
            timestamp: Date.now()
        };

        //
        const result = originalReplace?.(mergeState(newState, data), unused, url);

        // Update stack: replace current
        if (historyState?.entries) {
            historyState.entries[index] = newState;
            historyState.entries[historyState.index].view = url ? String(url) : (currentState?.view || "");
        }

        //
        saveStack();
        updateReactiveState("REPLACE", newState.view);
        return result;
    };

    // Listen for popstate
    addEvent(window, "popstate", (ev) => {
        const state = ev.state?.[STATE_KEY] as IHistoryState;
        const currentIndex = historyState.index ?? 0;

        if (!state) {
            // Likely a hash change or external navigation
            // We treat it as a PUSH for now if we can't determine otherwise
            // But if we have entries, we might check if hash matches?
            // For now, keep existing logic
            const newState: IHistoryState = {
                index: currentIndex + 1,
                depth: history.length,
                action: "PUSH",
                view: location.hash || "#",
                timestamp: Date.now()
            };

            // Inject state but preserve any existing state if present (unlikely if ev.state is null)
            history.replaceState(mergeState(newState, ev.state), "", location.hash);

            // Update stack
            historyState.entries = historyState?.entries?.slice?.(0, newState.index);
            historyState?.entries?.push?.(newState);
            saveStack();

            updateReactiveState("PUSH", newState.view);
            return;
        } else {
            const newIndex = state?.index ?? 0;
            let action: NavigationAction = "POP";
            if (newIndex < currentIndex) {
                action = "BACK";
            } else if (newIndex > currentIndex) {
                action = "FORWARD";
            }
            updateReactiveState(action, state?.view || location.hash);
        }
    });

    // Listen for hashchange as fallback/augment
    // This ensures we catch changes that might bypass popstate in some scenarios
    // or when manual location.hash assignment occurs without history API
    addEvent(window, "hashchange", (ev) => {
        if (getIgnoreNextPopState()) return;

        const currentHash = location.hash || "#";
        // Only update if historyState hasn't caught up yet (deduplication with popstate)
        if (historyState.view !== currentHash) {

            // prevent hatching popstate event
            updateReactiveState("PUSH", currentHash);
        }
    });
};

//
const updateReactiveState = (action?: NavigationAction, view?: string) => {
    const current = getCurrentState();
    historyState.index = current.index || 0;
    historyState.length = history.length;
    historyState.action = action || "POP";
    historyState.view = view || current.view || location.hash;
    historyState.canBack = historyState.index > 0;
};

// Navigation helpers
export const navigate = (view: string, replace: boolean = false) => {
    const hash = view.startsWith("#") ? view : `#${view}`;

    // Optimization: if replacing, check if we are just going back to previous view
    if (replace && historyState?.index > 0) {
        const prev = historyState?.entries?.[historyState?.index - 1];
        if (prev && prev.view === hash) {
            // prevent hatching popstate event
            history.back();
            return;
        }
    }

    // when doing navigation, stop hatching popstate event
    if (replace) {
        // don't do anything if the current view is the same as the new view
        if (historyState?.entries?.[historyState.index]?.view !== hash || historyState?.entries?.[historyState.index]?.view) {
            history?.replaceState?.(null, "", hash);
        }
    } else {
        history?.pushState?.(null, "", hash);
    }
};

//
export const historyViewRef = (initialValue: string = `#${location.hash?.replace?.(/^#/, "") || "home"}`, options: { ignoreBack?: boolean, withoutHashPrefix?: boolean } = {}) => {
    const internal = observe({ value: initialValue }) as unknown as { value: string };

    // Prevent circular updates between history and internal value
    let isUpdatingFromHistory = false;
    let isUpdatingFromInternal = false;

    // Sync from history to ref
    // The historyState acts as a bridge:
    // 1. User Action (Back/Forward) -> Window 'popstate' -> initHistory listener -> historyState -> This Subscription
    // 2. User Action (Hash Change) -> Window 'hashchange' -> initHistory listener -> historyState -> This Subscription
    affected([historyState, "view"], (view: string) => {
        if (isUpdatingFromInternal) return; // Prevent circular update

        if (options.ignoreBack && historyState.action === "BACK") {
            return;
        }

        let nextValue = view;
        if (options.withoutHashPrefix) {
            nextValue = view.replace(/^#/, "");
        }

        if (internal.value !== nextValue) {
            isUpdatingFromHistory = true;
            internal.value = nextValue;
            isUpdatingFromHistory = false;
        }
    });

    // Sync from ref to history
    // Application Action (Programmatic) -> ref.value change -> This Subscription -> navigate() -> pushState() -> historyState
    affected([internal, "value"], (val: string) => {
        if (isUpdatingFromHistory) return; // Prevent circular update

        let viewToNavigate = val;
        if (options.withoutHashPrefix && !val.startsWith("#")) {
            viewToNavigate = `#${val}`;
        }

        if (historyState.view !== viewToNavigate) {
            isUpdatingFromInternal = true;
            // This is a programmatic change, so we PUSH
            navigate(viewToNavigate);
            isUpdatingFromInternal = false;
        }
    });

    // Proxy to return the ref but with special behavior if needed
    return internal;
};
