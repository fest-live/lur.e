import { ITask } from "./Types";
import { addEvent } from "fest/dom";
import {
    initBackNavigation,
    registerCloseable,
    closeHighestPriority,
    hasActiveCloseable,
    ClosePriority,
    ignoreNextPopState,
    setIgnoreNextPopState
} from "./BackNavigation";

//
export const getBy = (tasks: ITask[] = [], taskId: ITask|string|any)=>{
    return tasks.find((t)=>(taskId == t || (typeof t.taskId == "string" && t.taskId?.replace?.(/^#/, "") == (typeof taskId == "string" ? taskId?.replace?.(/^#/, "") : null))));
}

//
export const historyBack = (tasks: ITask[] = [])=>{
    history?.back?.(); const lastFocus = getFocused(tasks, false)?.taskId || "";
    if (location?.hash?.trim?.()?.replace?.(/^#/, "")?.trim?.() != lastFocus?.trim?.()?.replace?.(/^#/, "")?.trim?.()) { history?.replaceState?.("", "", lastFocus); }
    return tasks;
}

//
export const getFocused = (tasks: ITask[] = [], includeHash: boolean = true)=>{
    return (tasks.findLast((t)=>t.active) ?? (includeHash ? tasks?.find?.((t)=>t.taskId?.replace?.(/^#/, "") == location.hash?.replace?.(/^#/, "")) : null));
}

/**
 * Register a task with the back navigation system
 * Tasks have lower priority than modals/menus and can be closed via back gesture
 */
export const registerTask = (task: ITask, onClose?: () => void): (() => void) => {
    return registerCloseable({
        id: `task-${task.taskId?.replace?.(/^#/, "") ?? task.taskId}`,
        priority: ClosePriority.TASK,
        group: "task",
        isActive: () => task.$active === true,
        close: () => {
            task.$active = false;
            onClose?.();
            return true;
        }
    }) as (() => void);
};

//
export const navigationEnable = (tasks: ITask[], taskEnvAction?: (task?: ITask|null)=>boolean|void)=>{
    let processingHashChange = false;
    let processingPopState = false;
    const initialHistoryCount = history?.length || 0;

    // Initialize centralized back navigation registry (we handle popstate ourselves)
    /*initBackNavigation({
        preventDefaultNavigation: false,
        pushInitialState: false, // we manage state ourselves
        skipPopstateHandler: true // we handle popstate in this function
    });*/

    //
    history?.pushState?.("", "", location.hash = location.hash || "#");

    // prevent behaviour once...
    addEvent(window, "hashchange", (ev)=>{
        if (processingHashChange) return;
        processingHashChange = true;
        try {
            const fc = getBy(tasks, location.hash);
            if (fc) { fc.focus = true; } else {
                const hash = getFocused(tasks, false)?.taskId || location.hash || "";
                if (location.hash?.trim?.()?.replace?.(/^#/, "")?.trim?.() != hash?.trim?.()?.replace?.(/^#/, "")?.trim?.()) { history?.replaceState?.("", "", hash); };
            };
        } finally {
            processingHashChange = false;
        }
    });

    addEvent(window, "popstate", (ev)=>{
        if (processingPopState) { ev.preventDefault(); return; }

        // Check if BackNavigation already handled this event
        if (ignoreNextPopState) {
            setIgnoreNextPopState(false);
            return;
        }

        processingPopState = true;
        try {
            ev.preventDefault();

            // First, try to close any high-priority elements (context menus, modals, etc.)
            // These don't change the hash, so we just forward to cancel the back navigation
            if (hasActiveCloseable()) {
                const closed = closeHighestPriority();
                if (closed) {
                    setIgnoreNextPopState(true);
                    history?.forward?.();
                    processingPopState = false;
                    return;
                }
            }

            // Then handle task environment action (sidebar, taskbar, etc.)
            if (taskEnvAction?.(getFocused(tasks, true) ?? null)) {
                setIgnoreNextPopState(true);
                history?.forward?.();
            } else {
                history?.go?.(initialHistoryCount + 1 - history.length);
            }
        } finally {
            processingPopState = false;
        }
    });

    //
    return tasks;
}
