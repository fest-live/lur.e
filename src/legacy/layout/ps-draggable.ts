//
export const $control$ = Symbol("@control");
export const makeControl = async (frameElement: HTMLElement)=>{
    //
    let gestureControl: any = null;
    if (frameElement && !frameElement[$control$]) {
        gestureControl = new AxGesture(frameElement);
        gestureControl.resizable({ handler: frameElement?.shadowRoot?.querySelector(".ui-resize") });
        gestureControl.draggable({ handler: frameElement?.shadowRoot?.querySelector(".ui-title-handle") });
        frameElement[$control$] = gestureControl;
    }

    //
    if (frameElement && frameElement.parentNode) {
        // @ts-ignore
        //const pn = (frameElement.offsetParent ?? frameElement.host ?? document.documentElement) as HTMLElement;
        //frameElement.style.setProperty("--shift-x", `${(pn.clientWidth  - Math.min(Math.max(frameElement.offsetWidth , 48*16), pn.clientWidth)) * 0.5}`, "");
        //frameElement.style.setProperty("--shift-y", `${(pn.clientHeight - Math.min(Math.max(frameElement.offsetHeight, 24*16), pn.clientHeight)) * 0.5}`, "");
        frameElement.addEventListener("m-dragstart", (ev: any)=>{
            if (ev.detail.holding.propertyName == "drag") {
                frameElement?.setAttribute?.("data-dragging", "");
                frameElement?.style?.setProperty?.("will-change", "transform", "important");
            }
        });

        //
        frameElement.addEventListener("m-dragend", (ev: any)=>{
            if (ev.detail.holding.propertyName == "drag") {
                const content = frameElement?.querySelector?.(".ui-content") as HTMLElement;
                const phantom = frameElement?.shadowRoot?.querySelector?.(".ui-phantom") as HTMLCanvasElement;

                //
                frameElement?.style?.removeProperty?.("will-change");
                frameElement?.removeAttribute?.("data-dragging");
                requestIdleCallback(()=>{
                    content?.style?.removeProperty?.("display");
                    if (phantom) { phantom.style.display = "none"; };
                }, {timeout: 100});
            }
        });
    }
}
