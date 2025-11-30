import { ITask } from "./Types";
import { addEvent } from "fest/dom";
import {
    initBackNavigation,
    registerCloseable,
    closeHighestPriority,
    hasActiveCloseable,
    ClosePriority,
    getIgnoreNextPopState,
    setIgnoreNextPopState
} from "./BackNavigation";

//
export const getBy = (tasks: ITask[] = [], taskId: ITask|string|any)=>{
    return tasks.find((t)=>(taskId == t || (typeof t.taskId == "string" && t.taskId?.replace?.(/^#/, "") == (typeof taskId == "string" ? taskId?.replace?.(/^#/, "") : null))));
}

//
export const historyBack = (tasks: ITask[] = [])=>{
    setIgnoreNextPopState(true);
    history?.back?.(); const lastFocus = getFocused(tasks, false)?.taskId || "";
    if (location?.hash?.trim?.()?.replace?.(/^#/, "")?.trim?.() != lastFocus?.trim?.()?.replace?.(/^#/, "")?.trim?.()) { setIgnoreNextPopState(true); history?.replaceState?.("", "", lastFocus); }
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
        isActive: () => task.active === true,
        close: (view?: string) => {
            task.active = false;
            return onClose?.() ?? false;
            // Return false to allow the back navigation to proceed (updating the URL)
            // since tasks are typically history-based
            //return false;
        }
    }) as (() => void);
};

//
export const navigationEnable = (tasks: ITask[], taskEnvAction?: (task?: ITask|null)=>boolean|void)=>{
    let processingHashChange = false;

    // Initialize centralized back navigation
    // We don't skip handler anymore, we rely on it
    initBackNavigation({
        preventDefaultNavigation: false,
        pushInitialState: false
    });

    // Register a general fallback closeable for taskEnvAction
    if (taskEnvAction) {
        registerCloseable({
            id: "task-env-manager",
            priority: ClosePriority.VIEW, // Low priority
            isActive: () => !!getFocused(tasks, true),
            close: () => {
                // If taskEnvAction returns true, it handled the close/action
                // and wants to cancel the back navigation (return true)
                const focused = getFocused(tasks, true);
                if (focused && taskEnvAction(focused)) {
                    return true;
                }
                return false;
            }
        });
    }

    // prevent behavior once...
    addEvent(window, "hashchange", (ev)=>{
        if (processingHashChange || getIgnoreNextPopState()) return;
        processingHashChange = true;
        try {
            const fc = getBy(tasks, location.hash);
            if (fc) { fc.focus = true; } else {
                const hash = getFocused(tasks, false)?.taskId || location.hash || "";
                if (location.hash?.trim?.()?.replace?.(/^#/, "")?.trim?.() != hash?.trim?.()?.replace?.(/^#/, "")?.trim?.()) {
                    setIgnoreNextPopState(true);
                    // Preserve existing state structure
                    const state = history.state || {};
                    history?.replaceState?.(state, "", hash);
                };
            };
        } finally {
            processingHashChange = false;
        }
    });

    // Ensure initial state
    if (!history.state?.backNav) {
        setIgnoreNextPopState(true);
        const state = history.state || {};
        history?.replaceState?.({ ...state, backNav: true, depth: history.length }, "", location.hash || "#");
        setIgnoreNextPopState(false);
    }

    //
    return tasks;
}
