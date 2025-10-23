import { makeReactive, $triggerLess } from "fest/object";
import { getBy, getFocused } from "./Manager";
import { ITask } from "./Types";
import { ITaskOptions } from "./Types";

//
export class Task implements ITask {
    $active: boolean = false;
    $action: ()=>boolean|void;
    payload: any;
    taskId: string;
    list?: ITask[]|null;

    //
    constructor(taskId: string, list?: ITask[]|null, state: ITaskOptions|null = null, payload: any = {}, action?: any) {
        this.taskId = taskId;
        this.list = list; this.payload = payload; Object.assign(this, state);
        this.$action = action ?? (()=>{
            if ((location.hash != this.taskId) && this.taskId) {
                return history.replaceState("", "", this.taskId || location.hash);
            }
        });
        this.addSelfToList(list, true);
    }

    //
    addSelfToList(list?: ITask[]|null, doFocus: boolean = false): ITask {
        if (list == null) return this;

        //
        const has = getBy(list, this);
        if (has != this) {
            if (!has) { list?.push(makeTask(this) as any); } else { Object.assign(has, this); }
        }

        //
        this.list = list;

        //
        if (doFocus) { this.focus = true; }
        history.pushState("", "", getFocused(list, false)?.taskId || location.hash);
        document.dispatchEvent(new CustomEvent("task-focus", { detail: this, bubbles: true, composed: true, cancelable: true }));

        //
        return this;
    }

    //
    get active(): boolean { return !!this.$active; }
    get order(): number { return this.list?.findIndex?.((t)=>(t == this || (typeof t.taskId == "string" && t.taskId == this.taskId))) ?? -1; }
    get focus(): boolean {
        if (!this.taskId) return false;
        const task = this.list?.findLast?.((t)=>t.active) ?? null; if (!task) return false;
        if (task?.taskId &&task?.taskId == this.taskId) { return true; };
        return false;
    }

    //
    set active(activeStatus: boolean) {
        if (this != null && this?.$active != activeStatus) {
            this.$active = activeStatus;
            document.dispatchEvent(new CustomEvent("task-focus", { detail: getFocused(this.list ?? [], false), bubbles: true, composed: true, cancelable: true }));
        }
    }

    //
    set focus(activeStatus: boolean) {
        if (activeStatus && (activeStatus != this.focus)) {
            const index = this.order;
            if (!this.focus && index >= 0) {
                const last = this.list?.findLastIndex?.((t)=>t.focus) ?? -1;
                if (index < last || last < 0)
                    {
                        // avoid remove and add reactive element triggering
                        if (this.list) for (const task of this.list) {
                            if (task != this && task?.taskId != this.taskId) {
                                task.focus = false;
                            }
                        }
                        this.list?.[$triggerLess]?.(()=>{
                            this.list?.splice?.(index, 1); this.list?.push?.(makeTask(this) as any);
                        })
                        document.dispatchEvent(new CustomEvent("task-focus", { detail: getFocused(this.list ?? [], false), bubbles: true, composed: true, cancelable: true }));
                    }

                //
                this.takeAction();
            }
        }
    }

    //
    takeAction(): boolean|void {
        return this.$action?.call?.(this);
    }

    //
    removeFromList() {
        if (!this.list) return this;
        const index = this.list.indexOf(getBy(this.list, this) ?? makeTask(this as any) as any) ?? -1;
        if (index >= 0) { this.list.splice(index, 1); }
        const list = this.list; this.list = null;
        document.dispatchEvent(new CustomEvent("task-focus", { detail: getFocused(list ?? [], false), bubbles: true, composed: true, cancelable: true }));
        return this;
    }
}

//
export const makeTask = (taskId: string|Task, list?: ITask[]|null, state: ITaskOptions|null = null, payload: any = {}, action?: any)=>{
    if (taskId instanceof Task) return makeReactive(taskId);
    const task = new Task(taskId, list, state, payload, action);
    return makeReactive(task);
}

//
export const makeTasks = (createCb: any)=>{
    const tasks = makeReactive([]);
    const result = createCb(tasks);
    return tasks;
}
