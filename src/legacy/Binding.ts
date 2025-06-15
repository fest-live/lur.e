export const onInteration = (ev, args = [], DOC = document.documentElement)=>{
    if (ev?.target?.matches("[data-popup]")) {
        (ev?.target?.getRootNode()?.host ?? ev?.target)?.dispatchEvent?.(new CustomEvent("u2-action", {
            bubbles: true,
            cancelable: true,
            detail: {
                type: "popup",
                name: ev?.target?.dataset?.popup,
                anchor: ev?.target?.matches(".ui-anchor") ? ev?.target : ev?.target?.closest(".ui-anchor"),
                initial: ev?.target
            }
        }));
    }

    //
    if (ev?.target?.matches("[data-action]")) {
        (ev?.target?.getRootNode()?.host ?? ev?.target)?.dispatchEvent?.(new CustomEvent("u2-action", {
            bubbles: true,
            cancelable: true,
            detail:{
                type: "action",
                name: ev?.target?.dataset?.action,
                anchor: ev?.target?.matches(".ui-anchor") ? ev?.target : ev?.target?.closest(".ui-anchor"),
                initial: ev?.target,
                args: ev?.target?.dataset?.action == "open-link" ? [ev?.target?.dataset?.href] : (args ?? []),
            }
        }));
    }
};

//
export const onTasking = (self, taskManager) => {
    const whenFocus = ({task, index})=>{
        if (task?.taskId) {
            const targetId  = (self?.querySelector(".ui-content")?.id || self?.taskId || self?.dataset?.id || self?.id)?.trim?.()?.replace?.("#","")?.trim?.();
            const isInFocus = targetId == task.taskId.trim?.()?.replace?.("#","")?.trim?.();
            if (isInFocus && task?.active) { delete self.dataset.hidden; };
            self?.fixZLayer?.();
        }
    };

    //
    const whenHide = ({task, index})=>{
        if (task?.taskId) {
            const targetId  = (self?.querySelector(".ui-content")?.id || self?.taskId || self?.dataset?.id || self?.id)?.trim?.()?.replace?.("#","")?.trim?.();
            const isInFocus = targetId == task.taskId.trim?.()?.replace?.("#","")?.trim?.();
            if (isInFocus && !task?.active) { self.dataset.hidden = ""; };
            self?.fixZLayer?.();
        }
    }

    //
    taskManager.on("focus", ()=>self?.fixZLayer?.());
    taskManager.on("addTask", whenFocus);
    taskManager.on("activate", whenFocus);
    taskManager.on("deactivate", whenHide);
    //taskManager.on("removeTask", whenHide);
}

//
export const taskManage = (self, taskManager) => { taskManager.on("*", ({task, index})=>{ self?.updateState?.();}); }
export const focusTask  = (taskManager, target: HTMLElement, deActiveWhenFocus = false)=>{
    const targetId = ((target as any)?.taskId || target.dataset.id || target.querySelector(".ui-content")?.id || target.id || "");
    const hash = "#" + targetId?.replace?.("#", "");
    if (taskManager?.inFocus?.(hash, false) && matchMedia("((hover: hover) or (pointer: fine)) and ((width >= 9in) or (orientation: landscape))").matches && deActiveWhenFocus)
        { taskManager?.deactivate?.(hash); } else
        { taskManager?.focus?.(hash); }

    //
    const bar = document.querySelector("ui-taskbar") as HTMLElement;
    if (matchMedia("not (((hover: hover) or (pointer: fine)) and ((width >= 9in) or (orientation: landscape)))").matches)
        { if (bar) { bar.dataset.hidden = ""; }; }
}
