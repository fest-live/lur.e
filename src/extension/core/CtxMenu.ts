//import { visibleRef, H, Q } from "fest/lure";
import { addEvent } from "fest/dom";
import { visibleRef } from "../../lure/core/Refs";
import { addProxiedEvent } from "./LazyEvents";
import { bindWhileConnected } from "../misc/Connected";

//
import { boundingBoxRef, makeInterruptTrigger, withInsetWithPointer } from "./Anchor";
import { registerContextMenu } from "../tasking/BackNavigation";
import Q from "../../lure/node/Queried";
import H from "../../lure/node/Syntax";

//
export interface RefBool { value?: boolean; }
export interface MenuItem {
    id: string;
    label: string;
    icon: string;
    action?: (initiator: HTMLElement, item: MenuItem, ev: MouseEvent) => void;
}

//
export interface CtxMenuDesc {
    items?: MenuItem[][];
    defaultAction?: (initiator: HTMLElement, item: MenuItem, ev: MouseEvent) => void;
    buildItems?: (details: { event: MouseEvent; initiator: HTMLElement; trigger: HTMLElement; menu: HTMLElement; ctxMenuDesc: CtxMenuDesc }) => MenuItem[][] | void;
    onBeforeOpen?: (details: { event: MouseEvent; initiator: HTMLElement; trigger: HTMLElement; menu: HTMLElement; ctxMenuDesc: CtxMenuDesc }) => boolean | void;
    context?: any;
    openedWith?: {
        event: MouseEvent;
        initiator: HTMLElement;
        element: HTMLElement;
        close: () => void;
        context?: any;
    } | null;
}

//
export const itemClickHandle = (ev: MouseEvent, ctxMenuDesc: CtxMenuDesc) => {
    const id = Q(`[data-id]`, ev?.target as HTMLElement, 0, "parent")?.getAttribute?.("data-id");
    const item: MenuItem | undefined = ctxMenuDesc?.items
        ?.find?.((I?: MenuItem[]) => I?.some?.((I: MenuItem) => I?.id == id))
        ?.find?.((I: MenuItem) => I?.id == id);

    (item?.action ?? ctxMenuDesc?.defaultAction)?.(
        ctxMenuDesc?.openedWith?.initiator as HTMLElement,
        item as MenuItem,
        ctxMenuDesc?.openedWith?.event ?? ev
    );

    ctxMenuDesc?.openedWith?.close?.();

    const vr = getBoundVisibleRef(ctxMenuDesc?.openedWith?.element as HTMLElement);
    if (vr != null) vr.value = false;
};

const visibleMap = new WeakMap<HTMLElement, RefBool | null>();

// Proxied trigger handling: guarantees ONE real `contextmenu` listener on documentElement.
// preventDefault/stopImmediatePropagation ONLY when the handler returns truthy ("handled").
const registerCtxMenu = typeof document !== "undefined" && document?.documentElement
    ? addProxiedEvent<MouseEvent>(
        document.documentElement,
        "contextmenu",
        { capture: true, passive: false },
        { strategy: "closest", preventDefault: "handled", stopImmediatePropagation: "handled" }
    )
    : (_el: any, _handler: any) => () => { };

const getBoundVisibleRef = (menuElement: HTMLElement): RefBool | null => {
    if (menuElement == null) return null; // @ts-ignore
    return visibleMap?.getOrInsertComputed?.(menuElement, () => visibleRef(menuElement, false)) as RefBool;
};

export const bindMenuItemClickHandler = (menuElement: HTMLElement, menuDesc: CtxMenuDesc) => {
    const handler = (ev: MouseEvent) => { itemClickHandle(ev, menuDesc); };
    const listening = addEvent(menuElement, "click", handler, { composed: true });
    return () => listening?.();
};

export const getGlobalContextMenu = (parent: HTMLElement | Document = document) => {
    let menu = Q('ui-modal[type="contextmenu"]', parent as HTMLElement);
    if (!menu) {
        menu = H`<ui-modal type="contextmenu"></ui-modal>`;
        (parent instanceof Document ? parent.body : parent).append(menu);
    }
    return menu as HTMLElement;
};

export const makeMenuHandler = (
    triggerElement: HTMLElement,
    placement: any,
    ctxMenuDesc: CtxMenuDesc,
    menuElement?: HTMLElement
) => {
    return (ev: MouseEvent) => {
        let handled = false;

        const menu = menuElement || getGlobalContextMenu();
        const visibleRef = getBoundVisibleRef(menu);

        const initiator = (ev?.target as HTMLElement | null) ?? triggerElement ?? (document.elementFromPoint(ev?.clientX || 0, ev?.clientY || 0) as HTMLElement);
        const details = { event: ev, initiator: initiator as HTMLElement, trigger: triggerElement, menu: menu, ctxMenuDesc };
        ctxMenuDesc.context = details;

        if (ctxMenuDesc?.onBeforeOpen?.(details) === false) {
            return handled;
        }

        const builtItems = ctxMenuDesc?.buildItems?.(details);
        if (Array.isArray(builtItems) && builtItems.length) {
            ctxMenuDesc.items = builtItems;
        }

        if (visibleRef?.value && ev?.type !== "contextmenu") {
            visibleRef.value = false;
            ctxMenuDesc?.openedWith?.close?.();
            return handled;
        }

        if (initiator && visibleRef) {
            handled = true;

            // TODO: use reactive mapped ctx-menu element
            menu.innerHTML = "";
            visibleRef.value = true;

            menu?.append?.(
                ...(ctxMenuDesc?.items
                    ?.map?.((section, sIdx) => {
                        const items = section?.map?.((item) =>
                            H`<li data-id=${item?.id || ""}><ui-icon icon=${item?.icon || ""}></ui-icon><span>${item?.label || ""}</span></li>`
                        );
                        const separator = (section?.length > 1 && sIdx !== ((ctxMenuDesc?.items?.length || 0) - 1))
                            ? H`<li class="ctx-menu-separator"></li>`
                            : null;
                        return [...items, separator];
                    })
                    ?.flat?.()
                    ?.filter?.((E) => !!E) || [])
            );

            const where = withInsetWithPointer?.(menu, placement?.(ev, initiator));
            const unbindClick = bindMenuItemClickHandler(menu, ctxMenuDesc);

            // Close when interacting outside the menu.
            const untrigger = makeInterruptTrigger?.(
                menu,
                (e: MouseEvent) => { // @ts-ignore
                    const menuAny = menu as any;
                    if (!(menu?.contains?.((e?.target ?? null) as any) || e?.target == (menuAny?.element ?? menuAny)) || !e?.target) {
                        ctxMenuDesc?.openedWith?.close?.();
                        const vr = getBoundVisibleRef(menu);
                        if (vr != null) vr.value = false;
                    }
                },
                ["click", "pointerdown", "scroll"]
            );

            // While open: suppress native context menu on the menu element itself.
            const unmenuCtx = registerCtxMenu(menu, () => true);

            ctxMenuDesc.openedWith = {
                initiator: initiator as HTMLElement,
                element: menu,
                event: ev,
                context: ctxMenuDesc?.context,
                close() {
                    visibleRef.value = false;
                    ctxMenuDesc.openedWith = null;
                    unbindClick?.();
                    where?.();
                    untrigger?.();
                    unmenuCtx?.();
                    // @ts-ignore
                    if (ctxMenuDesc._backUnreg) { ctxMenuDesc._backUnreg(); ctxMenuDesc._backUnreg = null; }
                },
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

        return handled;
    };
};

// use cursor as anchor based on contextmenu
export const ctxMenuTrigger = (triggerElement: HTMLElement, ctxMenuDesc: CtxMenuDesc, menuElement?: HTMLElement) => {
    const evHandler = makeMenuHandler(triggerElement, (ev) => [ev?.clientX, ev?.clientY, 200], ctxMenuDesc, menuElement);

    // Activate trigger + global listener only when trigger element is actually connected.
    const unbindConnected = bindWhileConnected(triggerElement, () => {
        return registerCtxMenu(triggerElement, evHandler as any);
    });

    return () => {
        unbindConnected?.();
    };
};

// bit same as contextmenu, but different by anchor and trigger (from element drop-down)
export const dropMenuTrigger = (triggerElement: HTMLElement, ctxMenuDesc: CtxMenuDesc, menuElement?: HTMLElement) => {
    const menu = menuElement || Q('ui-modal[type="menulist"]', document.body) || getGlobalContextMenu();

    const anchorElement = triggerElement; // @ts-ignore
    const evHandler = makeMenuHandler(triggerElement, (ev) => boundingBoxRef(anchorElement)?.slice?.(0, 3), ctxMenuDesc, menu);
    const untrigger = makeInterruptTrigger?.(
        menu,
        (ev: MouseEvent) => { // @ts-ignore
            if (!(menu?.contains?.(ev?.target) || ev?.target == (triggerElement?.element ?? triggerElement)) || !ev?.target) {
                ctxMenuDesc?.openedWith?.close?.();
                const vr = getBoundVisibleRef(menu);
                if (vr != null) vr.value = false;
            }
        },
        ["click", "pointerdown", "scroll"]
    );

    const listening = addEvent(triggerElement, "click", evHandler, { composed: true });
    return () => { untrigger?.(); listening?.(); };
};
