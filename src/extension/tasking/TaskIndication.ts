/* Task Indication Logic */
import { bindWith, ITask } from "fest/lure";
import { handleAttribute } from "fest/dom";
import { propRef } from "fest/object";

//
export class TaskIndication {
    task: ITask|null = null;
    taskEl: HTMLElement|any;

    //
    constructor(taskEl: HTMLElement|any = null, task: ITask|null = null) {
        this.task = task || null;
        this.bindIndication(taskEl);
    }

    //
    bindIndication(taskEl?: HTMLElement|any|null): TaskIndication {
        this.taskEl = taskEl ?? this.taskEl;
        if (!this.taskEl) return this;

        //
        bindWith(this.taskEl, "data-focus", propRef(this.task, "focus"), handleAttribute);
        bindWith(this.taskEl, "data-active", propRef(this.task, "active"), handleAttribute);
        bindWith(this.taskEl, "icon", propRef(this.task?.payload, "icon"), handleAttribute);
        bindWith(this.taskEl, "title", propRef(this.task?.payload, "title"), handleAttribute);
        bindWith(this.taskEl, "data-id", propRef(this.task, "taskId"), handleAttribute);

        //
        document.addEventListener("task-focus", (e)=>{
            handleAttribute(this.taskEl, "data-focus", this.task?.focus ?? false);
            handleAttribute(this.taskEl, "data-active", this.task?.active ?? false);
            handleAttribute(this.taskEl, "icon", this.task?.payload?.icon ?? "");
            handleAttribute(this.taskEl, "title", this.task?.payload?.title ?? "");
            handleAttribute(this.taskEl, "data-id", this.task?.taskId ?? "");
        });

        //
        return this;
    }
}
