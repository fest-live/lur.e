import { elementPointerMap } from "fest/lure";
import { DOMMixin, getCorrectOrientation, orientationNumberMap } from "fest/dom";
import { numberRef } from "fest/object";

//
export class UIOrientBox extends DOMMixin {
    constructor(name?) { super(name); }

    // @ts-ignore
    connect(ws) {
        const self: any = ws?.deref?.() ?? ws;
        self.classList.add("ui-orientbox");

        //
        //const zoom = attrRef(self, "zoom", 1), orient = attrRef(self, "orient", 0);
        const zoom = numberRef(1), orient = numberRef(orientationNumberMap?.[getCorrectOrientation()] || 0);
        self.style.setProperty("--zoom", zoom.value);
        self.style.setProperty("--orient", orient.value);

        // TODO: broken, fix later
        //bindWith(self, "--zoom", zoom, handleStyleChange, null);
        //bindWith(self, "--orient", orient, handleStyleChange, null);

        // settings size is illogical! and not implemented!
        Object.defineProperty(self, "size", { get: () => size });

        //
        Object.defineProperty(self, "zoom", {
            get: () => parseFloat(zoom.value) || 1,
            set: (value) => { zoom.value = value; self.style.setProperty("--zoom", value); }
        });

        //
        Object.defineProperty(self, "orient", {
            get: () => parseInt(orient.value) || 0,
            set: (value) => { orient.value = value; self.style.setProperty("--orient", value); }
        });

        //
        const size = [self.clientWidth, self.clientHeight];
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                if (entry?.contentBoxSize) {
                    const contentBoxSize = entry?.contentBoxSize?.[0];
                    size[0] = (contentBoxSize?.inlineSize || size[0] || 0);
                    size[1] = (contentBoxSize?.blockSize || size[1] || 0);
                }
            }
        });

        //
        resizeObserver.observe(self, {box: "content-box"});
        elementPointerMap.set(self, {
            pointerMap: new Map<number, any>(),
            pointerCache: new Map<number, any>()
        });

        //
        return this;
    }
}

//
new UIOrientBox("ui-orientbox");
export default UIOrientBox;
