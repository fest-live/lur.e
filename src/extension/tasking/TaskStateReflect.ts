import { propRef, affected } from "fest/object";
import { handleHidden, handleAttribute, handleStyleChange, setStyleProperty, addEvent } from "fest/dom";
import { bindWith, ITask } from "fest/lure";

//
export class TaskStateReflect {
    task?: ITask|null;
    element?: HTMLElement|any|null;
    listeners?: {
        click?: any|null;
        keydown?: any|null;
        focus?: any|null;
        blur?: any|null;
        close?: any|null;
        minimize?: any|null;
        maximize?: any|null;
    }|null;
    bindings?: {
        visible?: any|null;
        focus?: any|null;
        title?: any|null;
        icon?: any|null;
        order?: any|null;
        orderSub?: any|null;
    }|null;

    //
    constructor(element: HTMLElement|any|null = null, task: ITask|null = null) {
        this.update(element, task);
    }

    //
    update(element: HTMLElement|any|null = null, task: ITask|null = null) {
        if (this.task !== task) { this.task = task; }
        this.bind(element);
        return this;
    }

    //
    unbind() {
        if (this.bindings) {
            Object.values(this.bindings).forEach((binding)=>{ typeof binding == "function" ? binding() : binding?.unbind?.() });
            this.bindings?.orderSub?.();
            this.bindings = null;
        }
        if (this.listeners) {
            Object.values(this.listeners).forEach((listener)=>{ typeof listener == "function" ? listener() : listener?.remove?.() });
            this.listeners = null;
        }
        if (this.element) {
            handleHidden(this.element, this.task, false);
            handleAttribute(this.element, "data-focus", null);
            handleAttribute(this.element, "data-title", null);
            handleAttribute(this.element, "data-icon", null);
            handleStyleChange(this.element, "--order", null);
        }
    }

    //
    bind(element: HTMLElement|any|null = null) {
        if (this.element !== element) { this.element = element; }
        if (this.bindings) { this.unbind();  }

        //
        if (this.element) {
            this.bindings ??= {};

            const visibleRef = propRef(this.task, "active");
            this.bindings.visible = bindWith(this.element, "data-hidden", visibleRef, handleHidden);

            const titleRef = propRef(this.task?.payload, "title");
            this.bindings.title = bindWith(this.element, "title", titleRef, handleAttribute);

            const iconRef = propRef(this.task?.payload, "icon");
            this.bindings.icon = bindWith(this.element, "icon", iconRef, handleAttribute);

            //
            setStyleProperty(this.element, "--order", this.task?.order);
            document.addEventListener("task-focus", (e)=>{ setStyleProperty(this.element, "--order", this.task?.order); });

            // UI-events
            this.listeners ??= {};
            this.listeners.click = addEvent(this.element, "pointerdown", ()=>{ if (this.task) { this.task.focus = true; } });
            this.listeners.keydown = addEvent(this.element, "keydown", (e)=>{ if (e.key == "Enter" && this.task) { this.task.focus = true; } });
            this.listeners.focus = addEvent(this.element, "focus", (e)=>{ if (this.task) { this.task.focus = true; } });
            this.listeners.blur = addEvent(this.element, "blur", (e)=>{ if (this.task) { this.task.focus = false; } });

            // UI-actions
            this.listeners.close = addEvent(this.element, "close", (e)=>{ if (this.task) {
                this.element.addEventListener("u2-hidden", ()=>{ this.task?.removeFromList(); }, {once: true});
                this.element.setAttribute("data-hidden", "");
            } });
            this.listeners.minimize = addEvent(this.element, "minimize", (e)=>{ if (this.task) { this.task.focus = false; this.task.active = false; } });

            // TODO: under consideration
            this.listeners.maximize = addEvent(this.element, "maximize", (e)=>{ if (this.task) { /*this.task.maximized = true;*/ } });
        }
        return this;
    }
}
