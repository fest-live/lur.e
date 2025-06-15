//
const ROOT = document.documentElement;
const HIDE = (ev: any)=>{
    const target = ev?.target || document.querySelector(":hover, :active") || document.activeElement;
    const SELECTOR = "ui-modal[type=\"contextmenu\"], ui-button, ui-taskbar, ui-navbar, ui-statusbar, button, label, input, ui-longtext, ui-focustext, ui-row-select, ui-row-button, .u2-input, .ui-input";

    // prevent from immediate close
    const isVisible = target.dataset.hidden == null;

    //
    requestAnimationFrame(()=>{
        if (!(target?.matches?.(SELECTOR) || target?.closest?.(SELECTOR)) && isVisible && target.dataset.hidden == null) {
            if (document.activeElement?.matches?.("input") && (ev?.type == "scroll" || ev?.type == "click" || ev?.type == "pointerdown")) {
                (document.activeElement as any)?.blur?.();
            } else
            if (ev?.type == "click" && !(target?.matches?.("*[data-action]") || target?.closest?.("*[data-action]")) || ev?.type != "click") {
                ROOT.querySelectorAll("ui-modal:not([data-hidden])")?.forEach?.((el: any)=>{
                    // avoid to close same modal
                    if (!ev || (target?.matches?.("ui-modal") ? target : target?.closest?.("ui-modal")) != el) { el.dataset.hidden = ""; };
                });
            }
        }
    });
}

//
ROOT.addEventListener("click", HIDE);
ROOT.addEventListener("scroll", HIDE);
ROOT.addEventListener("pointerdown", HIDE);

// TODO! activate modal model
export const activateModal = ()=>{}
export default activateModal;
