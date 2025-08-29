//import { visibleRef, H, Q } from "fest/lure";
import { addEvent } from "fest/dom";

//
import { boundingBoxRef, makeInterruptTrigger, withInsetWithPointer } from "./Anchor";
import Q from "../../lure/node/Queried";
import H from "../../lure/node/Syntax";

//
export interface RefBool { value?: boolean; };
export interface MenuItem {
    id: string;
    label: string;
    icon: string;
    action?: (initiator: HTMLElement, item: MenuItem, ev: MouseEvent)=>void;
}

//
export interface CtxMenuDesc {
    items?: MenuItem[][];
    defaultAction?: (initiator: HTMLElement, item: MenuItem, ev: MouseEvent)=>void;
    openedWith?: {
        initiator: HTMLElement;
        element: HTMLElement;
        close: ()=>void;
    }|null;
}

//
export const itemClickHandle = (ev: MouseEvent, ctxMenuDesc: CtxMenuDesc)=>{
    const id = Q(`[data-id]`, ev?.target as HTMLElement, 0, "parent")?.getAttribute?.("data-id");
    const item: MenuItem|undefined = ctxMenuDesc?.items?.find?.((I?: MenuItem[])=>I?.some?.((I: MenuItem)=>I?.id == id))?.find?.((I: MenuItem)=>I?.id == id);
    (item?.action ?? ctxMenuDesc?.defaultAction)?.(ctxMenuDesc?.openedWith?.initiator as HTMLElement, item as MenuItem, ev);
    ctxMenuDesc?.openedWith?.close?.();

    //
    const visibleRef = getBoundVisibleRef(ctxMenuDesc?.openedWith?.element as HTMLElement);
    if (visibleRef != null) visibleRef.value = false;
}

//
const visibleMap = new WeakMap<HTMLElement, RefBool|null>();

// TODO: visible bindings
const getBoundVisibleRef = (menuElement: HTMLElement): RefBool|null => {
    if (menuElement == null) return null; // @ts-ignore
    return visibleMap?.getOrInsertComputed?.(menuElement, ()=>visibleRef(menuElement, false)) as RefBool;
}

//
export const bindMenuItemClickHandler = (menuElement: HTMLElement, menuDesc: CtxMenuDesc)=>{
    const handler = (ev: MouseEvent)=>{ itemClickHandle(ev, menuDesc); };
    const listening = addEvent(menuElement, "click", handler);
    return ()=>listening?.();
}

//
export const makeMenuHandler = (triggerElement: HTMLElement, placement: any, ctxMenuDesc: CtxMenuDesc, menuElement: HTMLElement = Q("ui-modal[type=\"contextmenu\"]", document.body))=>{
    return (ev: MouseEvent)=>{ // @ts-ignore
        if (menuElement?.contains?.(ev?.target) || ev?.target == (menuElement?.element ?? menuElement)) {
            ev?.preventDefault?.(); return;
        }

        //
        const initiator  = ev?.target ?? triggerElement ?? document.elementFromPoint(ev?.clientX || 0, ev?.clientY || 0) as HTMLElement;
        const visibleRef = getBoundVisibleRef(menuElement);

        //
        if (visibleRef?.value && ev?.type != "contextmenu") {
            visibleRef.value = false;
            ctxMenuDesc?.openedWith?.close?.();
        } else
        if (initiator && visibleRef) {
            ev?.preventDefault?.();

            // TODO: use reactive mapped ctx-menu element
            menuElement.innerHTML = ''; if (visibleRef != null) visibleRef.value = true;
            menuElement?.append?.(...(ctxMenuDesc?.items?.map?.((section, sIdx)=>{
                const items = section?.map?.((item, iIdx)=>H`<li data-id=${item?.id||""}><ui-icon icon=${item?.icon||""}></ui-icon><span>${item?.label||""}</span></li>`);
                const separator = (section?.length > 1 && sIdx != ((ctxMenuDesc?.items?.length || 0) - 1)) ? H`<li class="ctx-menu-separator"></li>` : null;
                return [ ...items, separator ];
            })?.flat?.()?.filter?.((E)=>!!E)||[]));

            //
            const where  = withInsetWithPointer?.(menuElement, placement?.(ev, initiator));
            const unbind = bindMenuItemClickHandler(menuElement, ctxMenuDesc);

            //
            if (ctxMenuDesc) ctxMenuDesc.openedWith = {
                initiator: initiator as HTMLElement,
                element: menuElement,
                close() {
                    if (visibleRef != null) visibleRef.value = false;
                    ctxMenuDesc.openedWith = null;
                    unbind?.(); where?.();
                }
            };
        }
    };
}

// use cursor as anchor based on contextmenu
export const ctxMenuTrigger = (triggerElement: HTMLElement, ctxMenuDesc: CtxMenuDesc, menuElement: HTMLElement = Q("ui-modal[type=\"contextmenu\"]", document.body))=>{
    const evHandler = makeMenuHandler(triggerElement, (ev)=>[ev?.clientX, ev?.clientY, 200], ctxMenuDesc, menuElement);
    const untrigger = makeInterruptTrigger?.(menuElement, (ev: MouseEvent)=>{ // @ts-ignore
        if (!(menuElement?.contains?.(ev?.target) || ev?.target == (triggerElement?.element ?? triggerElement)) || !ev?.target) {
            ctxMenuDesc?.openedWith?.close?.();
            const visibleRef = getBoundVisibleRef(menuElement);
            if (visibleRef != null) visibleRef.value = false;
        }
    }, [ "click", "pointerdown", "scroll" ]);

    //
    const listening = addEvent(triggerElement, "contextmenu", evHandler);
    return ()=>{ untrigger?.(); listening?.(); };
}

// bit same as contextmenu, but different by anchor and trigger (from element drop-down)
export const dropMenuTrigger = (triggerElement: HTMLElement, ctxMenuDesc: CtxMenuDesc, menuElement: HTMLElement = Q("ui-modal[type=\"menulist\"]", document.body))=>{
    const anchorElement = triggerElement;
    const evHandler = makeMenuHandler(triggerElement, (ev)=>boundingBoxRef(anchorElement)?.slice?.(0, 3), ctxMenuDesc, menuElement);
    const untrigger = makeInterruptTrigger?.(menuElement, (ev: MouseEvent)=>{ // @ts-ignore
        if (!(menuElement?.contains?.(ev?.target) || ev?.target == (triggerElement?.element ?? triggerElement)) || !ev?.target) {
            ctxMenuDesc?.openedWith?.close?.();
            const visibleRef = getBoundVisibleRef(menuElement);
            if (visibleRef != null) visibleRef.value = false;
        }
    }, [ "click", "pointerdown", "scroll" ]);

    //
    const listening = addEvent(triggerElement, "click", evHandler);
    return ()=>{ untrigger?.(); listening?.(); };
}
