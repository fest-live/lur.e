/* Task Interaction Logic */
import { Q, ITask } from "fest/lure";

//
export class TaskInteraction {
    list: ITask[]|any = [];
    taskbar: HTMLElement|any;

    //
    constructor(taskbar: HTMLElement|any = null, list: ITask[]|any = []) {
        this.list = list;
        this.bindInteraction(taskbar);
    }

    //
    bindInteraction(taskbar: HTMLElement|any = null): TaskInteraction {
        if (taskbar) this.taskbar = taskbar;
        if (!this.taskbar) return this;
        this.taskbar?.addEventListener?.("click", (ev)=>{
            ev.preventDefault();

            //
            const taskEl = Q("ui-task", ev?.target, 0, "parent");
            const task = this.list?.find((t)=>(t?.taskId == (taskEl?.getAttribute?.("data-id") || ""))) ?? null;
            if (task) {
                if (!task?.focus) { task.active = true; task.focus = true; } else { task.active = false; };
            } else {
                this.list?.forEach?.((t)=>{if (t?.focus) { t.focus = false; }});
            }
        });
        return this;
    }
}
