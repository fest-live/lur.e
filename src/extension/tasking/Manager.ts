import { ITask } from "./Types";
import { addEvent } from "fest/dom";

//
export const getBy = (tasks: ITask[] = [], taskId: ITask|string|any)=>{
    return tasks.find((t)=>(taskId == t || (typeof t.taskId == "string" && t.taskId == (typeof taskId == "string" ? taskId : null))));
}

//
export const historyBack = (tasks: ITask[] = [])=>{
    history?.back?.(); const lastFocus = getFocused(tasks, false)?.taskId || "";
    if (location?.hash?.trim?.() != lastFocus) { history?.replaceState?.("", "", lastFocus); }
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
        if (fc) { fc.focus = true; } else { history.replaceState("", "", getFocused(tasks, false)?.taskId || ""); };
    }); history?.pushState?.("", "", location.hash = location.hash || "#");
    addEvent(window, "popstate", (ev)=>{
        ev.preventDefault();
        ev.stopPropagation();
        ev.stopImmediatePropagation();

        //
        // hide taskbar before back
        if (ignoreForward) { ignoreForward = false; } else
        if (taskEnvAction?.(getFocused(tasks, true) ?? null)) {
            ignoreForward = true; history?.forward?.();
            ignoreForward = true; history?.replaceState?.("", "", getFocused(tasks, false)?.taskId || "");
        } else
        { history?.go?.(initialHistoryCount + 1 - history.length); }
    });

    //
    return tasks;
}
