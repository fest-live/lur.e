//import { visibleRef, H, Q } from "fest/lure";
import { addEvent } from "fest/dom";
import { visibleRef } from "../../lure/core/Refs";

//
import { boundingBoxRef, makeInterruptTrigger, withInsetWithPointer } from "./Anchor";
import { registerContextMenu } from "../tasking/BackNavigation";
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
    buildItems?: (details: { event: MouseEvent; initiator: HTMLElement; trigger: HTMLElement; menu: HTMLElement; ctxMenuDesc: CtxMenuDesc })=>MenuItem[][]|void;
    onBeforeOpen?: (details: { event: MouseEvent; initiator: HTMLElement; trigger: HTMLElement; menu: HTMLElement; ctxMenuDesc: CtxMenuDesc })=>boolean|void;
    context?: any;
    openedWith?: {
        event: MouseEvent;
        initiator: HTMLElement;
        element: HTMLElement;
        close: ()=>void;
        context?: any;
    }|null;
}

//
export const itemClickHandle = (ev: MouseEvent, ctxMenuDesc: CtxMenuDesc)=>{
    const id = Q(`[data-id]`, ev?.target as HTMLElement, 0, "parent")?.getAttribute?.("data-id");
    const item: MenuItem|undefined = ctxMenuDesc?.items?.find?.((I?: MenuItem[])=>I?.some?.((I: MenuItem)=>I?.id == id))?.find?.((I: MenuItem)=>I?.id == id);
    (item?.action ?? ctxMenuDesc?.defaultAction)?.(ctxMenuDesc?.openedWith?.initiator as HTMLElement, item as MenuItem, ctxMenuDesc?.openedWith?.event ?? ev);
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
    const listening = addEvent(menuElement, "click", handler, {
        composed: true,
    });
    return ()=>listening?.();
}

//
export const getGlobalContextMenu = (parent: HTMLElement | Document = document) => {
    let menu = Q("ui-modal[type=\"contextmenu\"]", parent as HTMLElement);
    if (!menu) {
        menu = H`<ui-modal type="contextmenu"></ui-modal>`;
        (parent instanceof Document ? parent.body : parent).append(menu);
    }
    return menu as HTMLElement;
}

//
export const makeMenuHandler = (triggerElement: HTMLElement, placement: any, ctxMenuDesc: CtxMenuDesc, menuElement?: HTMLElement)=>{
    return (ev: MouseEvent)=>{ // @ts-ignore
        const menu = menuElement || getGlobalContextMenu();
        
        if (menu?.contains?.(ev?.target) || ev?.target == (menu?.element ?? menu)) {
            ev?.preventDefault?.();
            return;
        }

        //
        const initiator  = ev?.target ?? triggerElement ?? document.elementFromPoint(ev?.clientX || 0, ev?.clientY || 0) as HTMLElement;
        const visibleRef = getBoundVisibleRef(menu);
        const details = { event: ev, initiator: initiator as HTMLElement, trigger: triggerElement, menu: menu, ctxMenuDesc };
        ctxMenuDesc.context = details;
        if (ctxMenuDesc?.onBeforeOpen?.(details) === false) {
            return;
        }
        const builtItems = ctxMenuDesc?.buildItems?.(details);
        if (Array.isArray(builtItems) && builtItems.length) {
            ctxMenuDesc.items = builtItems;
        }

        //
        if (visibleRef?.value && ev?.type != "contextmenu") {
            visibleRef.value = false;
            ctxMenuDesc?.openedWith?.close?.();
        } else
        if (initiator && visibleRef) {
            ev?.preventDefault?.();
            ev?.stopImmediatePropagation?.();

            // TODO: use reactive mapped ctx-menu element
            menu.innerHTML = ''; if (visibleRef != null) visibleRef.value = true;
            menu?.append?.(...(ctxMenuDesc?.items?.map?.((section, sIdx)=>{
                const items = section?.map?.((item, iIdx)=>H`<li data-id=${item?.id||""}><ui-icon icon=${item?.icon||""}></ui-icon><span>${item?.label||""}</span></li>`);
                const separator = (section?.length > 1 && sIdx != ((ctxMenuDesc?.items?.length || 0) - 1)) ? H`<li class="ctx-menu-separator"></li>` : null;
                return [ ...items, separator ];
            })?.flat?.()?.filter?.((E)=>!!E)||[]));

            //
            const where  = withInsetWithPointer?.(menu, placement?.(ev, initiator));
            const unbind = bindMenuItemClickHandler(menu, ctxMenuDesc);

            //
            if (ctxMenuDesc) ctxMenuDesc.openedWith = {
                initiator: initiator as HTMLElement,
                element: menu,
                event: ev,
                context: ctxMenuDesc?.context,
                close() {
                    if (visibleRef != null) visibleRef.value = false;
                    ctxMenuDesc.openedWith = null;
                    unbind?.(); where?.();
                    // @ts-ignore
                    if (ctxMenuDesc._backUnreg) { ctxMenuDesc._backUnreg(); ctxMenuDesc._backUnreg = null; }
                }
            };

            // Register with back navigation
            // @ts-ignore
            if (!ctxMenuDesc._backUnreg && visibleRef) {
                // @ts-ignore
                ctxMenuDesc._backUnreg = registerContextMenu(menu, visibleRef, () => {
                     ctxMenuDesc?.openedWith?.close?.();
                });
            }
        }
    };
}

// use cursor as anchor based on contextmenu
export const ctxMenuTrigger = (triggerElement: HTMLElement, ctxMenuDesc: CtxMenuDesc, menuElement?: HTMLElement)=>{
    const menu = menuElement || getGlobalContextMenu();
    const evHandler = makeMenuHandler(triggerElement, (ev)=>[ev?.clientX, ev?.clientY, 200], ctxMenuDesc, menu);
    const untrigger = makeInterruptTrigger?.(menu, (ev: MouseEvent)=>{ // @ts-ignore
        if (!(menu?.contains?.(ev?.target) || ev?.target == (menu?.element ?? menu)) || !ev?.target) {
            ctxMenuDesc?.openedWith?.close?.();
            const visibleRef = getBoundVisibleRef(menu);
            if (visibleRef != null) visibleRef.value = false;
        }
    }, [ "click", "pointerdown", "scroll" ]);

    // Register with back navigation system
    /*const visRef = getBoundVisibleRef(menuElement);
    const unregisterBack = visRef ? registerContextMenu(menuElement, visRef, () => {
        ctxMenuDesc?.openedWith?.close?.();
    }) : null;*/

    //
    const listening = addEvent(triggerElement, "contextmenu", evHandler, {
        composed: true,
    });
    return ()=>{ untrigger?.(); listening?.(); /*unregisterBack?.();*/ };
}

// bit same as contextmenu, but different by anchor and trigger (from element drop-down)
export const dropMenuTrigger = (triggerElement: HTMLElement, ctxMenuDesc: CtxMenuDesc, menuElement?: HTMLElement)=>{
    const menu = menuElement || Q("ui-modal[type=\"menulist\"]", document.body) || getGlobalContextMenu(); // Fallback for menulist? Or strict? keeping loosely
    
    const anchorElement = triggerElement; // @ts-ignore
    const evHandler = makeMenuHandler(triggerElement, (ev)=>boundingBoxRef(anchorElement)?.slice?.(0, 3), ctxMenuDesc, menu);
    const untrigger = makeInterruptTrigger?.(menu, (ev: MouseEvent)=>{ // @ts-ignore
        if (!(menu?.contains?.(ev?.target) || ev?.target == (triggerElement?.element ?? triggerElement)) || !ev?.target) {
            ctxMenuDesc?.openedWith?.close?.();
            const visibleRef = getBoundVisibleRef(menu);
            if (visibleRef != null) visibleRef.value = false;
        }
    }, [ "click", "pointerdown", "scroll" ]);

    // Register with back navigation system
    /*const visRef = getBoundVisibleRef(menuElement);
    const unregisterBack = visRef ? registerContextMenu(menuElement, visRef, () => {
        ctxMenuDesc?.openedWith?.close?.();
    }) : null;*/

    //
    const listening = addEvent(triggerElement, "click", evHandler, {
        composed: true,
    });
    return ()=>{ untrigger?.(); listening?.(); /*unregisterBack?.();*/ };
}
