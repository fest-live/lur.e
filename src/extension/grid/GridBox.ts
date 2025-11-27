import { E, elementPointerMap } from "fest/lure";
import { DOMMixin } from "fest/dom";

//
export class UIGridBox extends DOMMixin {
    constructor(name?) { super(name); }

    // @ts-ignore
    connect(ws) {
        const self: any = ws?.deref?.();
        E(self, {classList: new Set(["ui-gridlayout"])});

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
        Object.defineProperty(self, "size", { get: () => size });

        //
        resizeObserver.observe(self, {box: "content-box"});
        elementPointerMap.set(self, {
            pointerMap: new Map<number, any>(),
            pointerCache: new Map<number, any>()
        });
    }
}

//
new UIGridBox("ui-gridbox");
export default UIGridBox;
