import { placeWithCursor } from "../layout/ps-anchor.js";

//
const excSel = "ui-button";
const ctx: string = "ui-modal[type=\"contextmenu\"]";

//
export const hideOnClick = (ev?)=>{
    const t = ev.target as HTMLElement;

    // prevent from immediate close
    const ctxMenu = (ev?.target?.matches?.(ctx) ? ev?.target : ev?.target?.closest?.(ctx)) ?? document.querySelector(ctx) as HTMLElement;
    const isVisible = ctxMenu.dataset.hidden == null;

    //
    requestAnimationFrame(()=>{
        const self = document.querySelector(ctx) as HTMLElement;
        const isOutside = !((t?.closest(ctx) == self) || (t == self));
        const exception = t?.closest?.(excSel) || t?.matches?.(excSel);
        if ((isVisible && ctxMenu.dataset.hidden == null) && (isOutside && !exception || (ev?.type == "click" && !document.activeElement?.matches?.("input")))) {
            closeContextMenu(ev);
        };
    });
};

//
const evt: [any, any] = [ hideOnClick, {} ];

//
export const closeContextMenu = (ev?)=>{
    const ctxMenu = (ev?.target?.matches?.(ctx) ? ev?.target : ev?.target?.closest?.(ctx)) ?? document.querySelector(ctx) as HTMLElement;
    if (ctxMenu && ctxMenu.dataset.hidden == null) {
        document.documentElement.removeEventListener("m-dragstart", ...evt);
        document.documentElement.removeEventListener("pointerdown", ...evt);
        document.documentElement.removeEventListener("contextmenu", ...evt);
        document.documentElement.removeEventListener("scroll", ...evt);
        document.documentElement.removeEventListener("click", ...evt);

        //
        ctxMenu.dataset.hidden = "";
    };
};

//
export const openContextMenu = (event, toggle: boolean = false, content?: (ctxMenu: any, initiator: any, event?: any)=>void)=>{
    const initiator = event?.target;
    const ctxMenu   = document.querySelector(ctx) as any;

    //
    if (event?.type == "contextmenu") { placeWithCursor(ctxMenu, event); };

    //
    ctxMenu.innerHTML = "";
    ctxMenu.initiator = initiator;
    ctxMenu.event = event;
    content?.(ctxMenu, initiator, event);

    //
    if (ctxMenu && (toggle && ctxMenu.dataset.hidden != null || !toggle)) {
        delete ctxMenu.dataset.hidden;

        //
        document.documentElement.removeEventListener("m-dragstart", ...evt);
        document.documentElement.removeEventListener("pointerdown", ...evt);
        document.documentElement.removeEventListener("contextmenu", ...evt);
        document.documentElement.removeEventListener("scroll", ...evt);
        document.documentElement.removeEventListener("click", ...evt);

        //
        document.documentElement.addEventListener("m-dragstart", ...evt);
        document.documentElement.addEventListener("pointerdown", ...evt);
        document.documentElement.addEventListener("contextmenu", ...evt);
        document.documentElement.addEventListener("scroll", ...evt);
        document.documentElement.addEventListener("click", ...evt);
    } else
    if (ctxMenu && ctxMenu.dataset.hidden == null) {
        closeContextMenu(event);
    }
};

//
export const makeCtxMenuItems = (ctxMenu?: any, initiator?: any, content?: any[])=>{
    content?.map?.((el: {
    icon: HTMLElement;
    content: string;
    callback: Function;
})=>{
        const li = document.createElement("ui-button-row");
        if (!li.dataset.highlightHover) { li.dataset.highlightHover = "1"; }

        //
        li.style.blockSize = "2.5rem";
        li.addEventListener("click", (e)=>{
            el.callback?.(initiator, ctxMenu?.event);
        });

        //
        if (el.icon) {
            el.icon.remove?.();
            el.icon.style.setProperty("grid-column", "icon");
            li.append(el.icon);
        };
        li.insertAdjacentHTML("beforeend", `<span style="grid-column: content;">${el.content||""}</span>`);

        //
        ctxMenu?.append?.(li);
    });
};
