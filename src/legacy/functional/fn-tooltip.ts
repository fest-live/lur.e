import AxGesture from "../../ext/interact/Gesture";

import {importCdn} from "u2re/cdnImport";

//
const ROOT = document.documentElement;
export const runTooltip = async ()=>{
    // @ts-ignore
    const { getBoundingOrientRect, agWrapEvent, pointerMap } = await Promise.try(importCdn, ["u2re/dom"]);

    //
    const timer = Symbol("@disappear");
    const fixTooltip = agWrapEvent((ev, initiator?: HTMLElement)=>{
        const e = ev?.detail ?? ev;
        const tooltip = document.querySelector("ui-tooltip") as HTMLElement;
        initiator ??= e?.target;

        //
        if (tooltip && (initiator as HTMLElement)?.dataset?.tooltip) {
            const box = getBoundingOrientRect(initiator);

            //
            if (box && box?.width < 240) {
                tooltip.style.setProperty("--hover-x", ((box?.left + box?.right) * 0.5 || tooltip.style.getPropertyValue("--hover-x") || 0) as unknown as string, "");
            } else {
                tooltip.style.setProperty("--hover-x", (pointerMap?.get?.(ev.pointerId)?.current?.[0] || e?.orient[0] || tooltip.style.getPropertyValue("--hover-x") || 0) as unknown as string, "");

                //
                requestIdleCallback(()=>{
                    tooltip.style.setProperty("--hover-x", (pointerMap?.get?.(ev.pointerId)?.current?.[0] || e?.orient[0] || tooltip.style.getPropertyValue("--hover-x") || 0) as unknown as string, "");
                });
            }

            //
            if (box && box?.height < 60) {
                tooltip.style.setProperty("--hover-y", (box?.top || tooltip.style.getPropertyValue("--hover-y") || 0) as unknown as string, "");
            } else {
                tooltip.style.setProperty("--hover-y", (pointerMap?.get?.(ev.pointerId)?.current?.[1] || e?.orient[1] || tooltip.style.getPropertyValue("--hover-y") || 0) as unknown as string, "");

                //
                requestIdleCallback(()=>{
                    tooltip.style.setProperty("--hover-y", (pointerMap?.get?.(ev.pointerId)?.current?.[1] || e?.orient[1] || tooltip.style.getPropertyValue("--hover-y") || 0) as unknown as string, "");
                });
            }
        }
    });

    //
    ROOT.addEventListener("pointerover", fixTooltip);
    ROOT.addEventListener("pointerdown", fixTooltip);
    const controller = new AxGesture(ROOT);
    controller.longHover({
        selector: "*[data-tooltip]",
        holdTime: 500
    }, (ev)=>{
        const e = ev?.detail ?? ev;
        const initiator = e.target.matches("*[data-tooltip]") ? e.target : e.target.closest("*[data-tooltip]");
        const tooltip: HTMLElement | null = document.querySelector("ui-tooltip");
        if (tooltip && initiator) {
            {
                if (tooltip[timer]) clearTimeout(tooltip[timer]);
                tooltip.dataset.hidden = "";
                tooltip[timer] = null;
            }

            //
            tooltip.innerHTML = initiator.dataset.tooltip;
            fixTooltip(e, initiator);
            delete tooltip.dataset.hidden;
            tooltip[timer] = setTimeout(()=>{
                tooltip.dataset.hidden = "";
            }, 1000);
        }
    });

    //
    const hideTooltip = (ev)=>{
        const e = ev?.detail ?? ev;
        requestIdleCallback(()=>{
            const tooltip: HTMLElement | null = document.querySelector("ui-tooltip");
            if (tooltip) {
                if (tooltip[timer]) clearTimeout(tooltip[timer]);
                tooltip[timer] = null;

                //
                if (e?.type == "pointerout" || e?.type == "pointermove") {
                    tooltip[timer] = setTimeout(()=>{ tooltip.dataset.hidden = ""; }, 100);
                } else {
                    tooltip.dataset.hidden = "";
                }
            }
        });
    }

    //
    ROOT.addEventListener("click", hideTooltip);
    ROOT.addEventListener("pointerup", hideTooltip);
    ROOT.addEventListener("pointerdown", hideTooltip);
    ROOT.addEventListener("contextmenu", hideTooltip);
    ROOT.addEventListener("pointerout", (ev)=>{
        if ((ev?.target as HTMLElement)?.dataset?.tooltip) {
            hideTooltip(ev);
        }
    });
};

//
export default runTooltip;
