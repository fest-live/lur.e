import { DOMMixin } from "u2re/dom";

//
export class OverlayScrollbarMixin extends DOMMixin {
    constructor(name?) {
        super(name);
    }

    // @ts-ignore
    connect(self) { // @ts-ignore
        const frame = document.createElement("ui-scrollframe"); frame?.bindWith?.(self);

        //
        self.style.scrollbarGutter = "auto";
        self.style.scrollbarWidth = "none";
        self.style.scrollbarColor = "transparent transparent";
        self.style.overflow = "scroll";

        //
        self.parentNode?.append(frame);
    }
}

//
new OverlayScrollbarMixin("ov-scrollbar");
export default OverlayScrollbarMixin;
