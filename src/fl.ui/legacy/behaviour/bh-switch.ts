
// @ts-ignore
import { importCdn } from "u2re/cdnImport";

//
export const setStyle = async (self, confirm: boolean = false, exact: number = 0, val: number = 0)=>{
    if (confirm) {
        const current = self.style?.getPropertyValue?.("--value") ?? val;
        if (current != exact) {
            let animation: any = null;

            //
            if (!matchMedia("(prefers-reduced-motion: reduce)").matches && self.animate != null) {
                await (animation = self.animate?.([
                    { "--value": current },
                    { "--value": exact },
                ], {
                    duration: 100,
                    iterations: 1,
                    fillMode: "forwards"
                }))?.finished;
            }

            //
            animation?.commitStyles?.();
            self.style.setProperty("--value", `${exact}`, "");
        }
    } else {
        self.style.setProperty("--value", `${val}`, "");
    }
}

//
export const makeSwitchBH = async (self?: HTMLElement)=>{
    if (!self) return;

    // @ts-ignore
    const { getBoundingOrientRect, agWrapEvent } = await Promise.try(importCdn, ["u2re/dom"]);

    //
    const sws  = { pointerId: -1 };
    const weak = new WeakRef(self);
    const doExaction = (self, x, y, confirm = false, boundingBox?, evType?: string)=>{
        if (!self) return;

        //
        let TYPE = "unknown";
        if (self?.matches?.(":has(input[type=\"radio\"])"))    { TYPE = "radio";    };
        if (self?.matches?.(":has(input[type=\"number\"])"))   { TYPE = "number";   };
        if (self?.matches?.(":has(input[type=\"checkbox\"])")) { TYPE = "checkbox"; };

        //
        const box   = boundingBox || getBoundingOrientRect?.(self);
        const coord = [x - box?.left, y - box?.top];

        // determine checkbox state
        if (evType != "pointerdown") {
            if (TYPE == "checkbox") {
                const checkbox = self.querySelector?.("input[type=\"checkbox\"]") as unknown as HTMLInputElement;
                checkbox?.click?.();
                setStyle(self, true, checkbox?.checked ? 1 : 0, checkbox?.checked ? 1 : 0);
            }
        }

        //
        if (evType != "click") {

            // determine radio state
            if (TYPE == "radio") {
                const radio = self.querySelectorAll?.("input[type=\"radio\"]") as unknown as HTMLInputElement[];
                const count = ((radio?.length || 1)-1);
                const vary  = [
                    (coord[0]/box.width ) * (count+1),
                    (coord[1]/box.height) * 1
                ];
                const val   = Math.min(Math.max(vary[0] - 0.5, 0), count);
                const exact = Math.min(Math.max(Math.floor(vary[0]), 0), count);

                //
                setStyle(self, confirm || evType == "change", exact, (evType == "pointermove") ? val : (self.style?.getPropertyValue?.("--value") ?? val))?.finally?.(()=>{
                    if (!radio?.[exact]?.checked && confirm) { radio?.[exact]?.click?.(); };
                });
            }
        }

        //
        if (TYPE == "number") {
            const number = self.querySelector?.("input[type=\"number\"]") as unknown as HTMLInputElement
            const count  = ((parseFloat(number?.max) || 0) - (parseFloat(number?.min) || 0));
            const vary   = [
                (coord[0]/box.width) * count,//(count + 1 - 0.5),
                (coord[1]/box.height) * 1
            ];

            //
            const step = parseFloat(number?.step ?? 1) ?? 1;
            const val = Math.min(Math.max(vary[0] - step * 0.5, 0), count);
            const exact = Math.min(Math.max(Math.round(val / step) * step, 0), count);

            //
            self.style.setProperty("--max-value", `${count}`, "");
            number.valueAsNumber = (parseFloat(number.min) || 0) + exact;
            number.dispatchEvent(new Event(confirm ? "change" : "input", {
                bubbles: true,
                cancelable: true
            }));

            //
            setStyle(self, confirm || evType == "change", exact, (evType == "pointermove") ? val : (self.style?.getPropertyValue?.("--value") ?? val));
        }
    }

    //
    const whenMove = agWrapEvent((ev: any)=>{
        if (sws.pointerId == ev.pointerId) {
            const boundingBox = getBoundingOrientRect?.(self);
            doExaction(weak?.deref?.(), ev.orient[0], ev.orient[1], false, boundingBox, ev?.type);
        }
    });

    //
    const ROOT = document.documentElement;
    const stopMove = agWrapEvent((ev: any)=>{
        if (sws.pointerId == ev.pointerId) { sws.pointerId = -1;
            const boundingBox = getBoundingOrientRect?.(self);
            doExaction(weak?.deref?.(), ev.orient[0], ev.orient[1], true, boundingBox, ev?.type);
            ev?.release?.();

            // stop support these events
            ROOT.removeEventListener("pointerup", stopMove);
            ROOT.removeEventListener("pointercancel", stopMove);
            ROOT.removeEventListener("pointermove", whenMove);
        }
    });

    //
    self?.addEventListener?.("pointerdown", agWrapEvent((ev: any)=>{
        if (sws.pointerId < 0) {
            sws.pointerId = ev?.pointerId;
            ev?.capture?.();

            //
            const boundingBox = getBoundingOrientRect?.(self);
            doExaction(weak?.deref?.(), ev.orient[0], ev.orient[1], false, boundingBox, ev?.type);

            // make events temp available
            ROOT.addEventListener("pointerup", stopMove);
            ROOT.addEventListener("pointercancel", stopMove);
            ROOT.addEventListener("pointermove", whenMove);
        }
    }));
};
