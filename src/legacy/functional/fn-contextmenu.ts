import { placeWithCursor } from "../layout/ps-anchor.js";

//
const hasClosest = (el: HTMLElement, exact: HTMLElement)=>{
    do {
        if (el === exact) { return true; }
        el = el?.parentElement as HTMLElement;
    } while (el?.parentElement && el?.parentElement != exact);
    return (el === exact);
}

//
const closeContextMenu = ($ctxMenu: any, ev?, evt?: [any, any?], ROOT = document.documentElement)=>{
    const ctxMenu = $ctxMenu as HTMLElement;
    if (ctxMenu && ctxMenu.dataset.hidden == null) {
        ctxMenu.dataset.hidden = "";
        if (evt) {
            ROOT.removeEventListener("m-dragstart", ...evt);
            ROOT.removeEventListener("pointerdown", ...evt);
            ROOT.removeEventListener("contextmenu", ...evt);
            ROOT.removeEventListener("scroll", ...evt);
            ROOT.removeEventListener("click", ...evt);
        }
    };
};

//
export const openContextMenu = ($ctxMenu: any, ev?, evt?: [any, any?], toggle: boolean = false, content?: (ctxMenu: any, initiator: any, event?: any)=>void, ROOT = document.documentElement)=>{
    const initiator = ev?.target, ctxMenu = $ctxMenu;
    if (ev?.type == "contextmenu") { placeWithCursor(ctxMenu, ev); };

    //
    ctxMenu.innerHTML = "";
    ctxMenu.initiator = initiator;
    ctxMenu.event = ev;
    content?.(ctxMenu, initiator, ev);

    //
    if (ctxMenu && (toggle && ctxMenu.dataset.hidden != null || !toggle)) {
        delete ctxMenu.dataset.hidden;

        //
        if (evt) {
            ROOT.removeEventListener("m-dragstart", ...evt);
            ROOT.removeEventListener("pointerdown", ...evt);
            ROOT.removeEventListener("contextmenu", ...evt);
            ROOT.removeEventListener("scroll", ...evt);
            ROOT.removeEventListener("click", ...evt);
        }

        //
        if (evt) {
            ROOT.addEventListener("m-dragstart", ...evt);
            ROOT.addEventListener("pointerdown", ...evt);
            ROOT.addEventListener("contextmenu", ...evt);
            ROOT.addEventListener("scroll", ...evt);
            ROOT.addEventListener("click", ...evt);
        }
    } else
    if (ctxMenu && ctxMenu.dataset.hidden == null) {
        closeContextMenu($ctxMenu, ev, evt, ROOT);
    }
};

//
const hideOnClick = ($ctxMenu, ev?, evt?: [any, any?], ROOT = document.documentElement)=>{
    const t = ev.target as HTMLElement, ctxMenu = $ctxMenu as HTMLElement, isVisible = ctxMenu.dataset.hidden == null;

    // prevent from immediate close
    requestAnimationFrame(()=>{
        const self = ctxMenu;//document.querySelector(ctx) as HTMLElement;
        const isOutside = !(hasClosest(t, self));
        const exception = false;//t?.closest?.(excSel) || t?.matches?.(excSel);
        if ((isVisible && ctxMenu.dataset.hidden == null) && (isOutside && !exception || (ev?.type == "click" && !document.activeElement?.matches?.("input"))))
            { closeContextMenu($ctxMenu, ev, evt, ROOT); };
    });
};

//
export const makeCtxMenuOpenable = ($ctxMenu: any, ROOT = document.documentElement)=>{
    const evt: [any, any] = [ (ev)=>hideOnClick(ev, $ctxMenu), {} ];
    (ROOT ??= document.documentElement)?.addEventListener?.("contextmenu", (ev)=>openContextMenu?.($ctxMenu, ev, evt, false, ()=>{}, ROOT));
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
