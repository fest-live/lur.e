import { ITask } from "./Types";
import { addEvent } from "fest/dom";

//
export const getBy = (tasks: ITask[] = [], taskId: ITask|string|any)=>{
    return tasks.find((t)=>(taskId == t || (typeof t.taskId == "string" && t.taskId == (typeof taskId == "string" ? taskId : null))));
}

//
export const historyBack = (tasks: ITask[] = [])=>{
    history?.back?.(); const lastFocus = getFocused(tasks, false)?.taskId || "";
    if (location?.hash?.trim?.() != lastFocus?.trim?.()) { history?.replaceState?.("", "", lastFocus); }
    return tasks;
}

//
export const getFocused = (tasks: ITask[] = [], includeHash: boolean = true)=>{
    return (tasks.findLast((t)=>t.active) ?? (includeHash ? tasks?.find?.((t)=>t.taskId == location.hash) : null));
}

//
export const navigationEnable = (tasks: ITask[], taskEnvAction?: (task?: ITask|null)=>boolean|void)=>{
    let ignoreForward = false;
    const initialHistoryCount = history?.length || 0;

    // prevent behaviour once...
    addEvent(window, "hashchange", (ev)=>{
        const fc = getBy(tasks, location.hash);
        if (fc) { fc.focus = true; } else {
            const hash = getFocused(tasks, false)?.taskId || location.hash || "";
            if (location.hash?.trim?.() != hash?.trim?.()) { history?.replaceState?.("", "", hash); };
        };
    }); history?.pushState?.("", "", location.hash = location.hash || "#");
    addEvent(window, "popstate", (ev)=>{
        ev.preventDefault();

        //
        // hide taskbar before back
        if (ignoreForward) { ignoreForward = false; } else
        if (taskEnvAction?.(getFocused(tasks, true) ?? null)) {
            ignoreForward = true; history?.forward?.();
            const hash = getFocused(tasks, false)?.taskId || location.hash || "";
            if (location.hash?.trim?.() != hash?.trim?.()) { ignoreForward = true; history.replaceState("", "", hash); };
        } else {
            history?.go?.(initialHistoryCount + 1 - history.length);
        }
    });

    //
    return tasks;
}
