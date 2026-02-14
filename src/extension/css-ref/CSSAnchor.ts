import { getExistsZIndex, generateAnchorId } from "./Utils";

//
const registeredAnchorIds = new WeakMap();
const registeredAnchors = new WeakMap();

//
export class CSSAnchor {
    source: HTMLElement;
    anchorId: string;

    //
    constructor(source: HTMLElement) {
        this.source = source; registeredAnchors.set(source, this); //@ts-ignore
        this.anchorId = registeredAnchorIds.getOrInsert(source, generateAnchorId());
        this.source.style.setProperty("anchor-name", this.anchorId);
        this.source.style.setProperty("position-visibility", `always`);
    }

    //
    connectElement(connect: HTMLElement, {
        placement = "fill",
        zIndexShift = 1,
        inset = 0,
        size = "100%",
        transformOrigin = "50% 50%",
    }) {
        if (placement == "fill") {
            connect.style.setProperty("inset-block-start", `anchor(start, ${inset}px)`);
            connect.style.setProperty("inset-inline-start", `anchor(start, ${inset}px)`);
            connect.style.setProperty("inset-block-end", `anchor(end, ${inset}px)`);
            connect.style.setProperty("inset-inline-end", `anchor(end, ${inset}px)`);
            connect.style.setProperty("inline-size", `anchor-size(inline, ${size})`);
            connect.style.setProperty("block-size", `anchor-size(block, ${size})`);
            connect.style.setProperty("transform-origin", transformOrigin);
        }
        else if (placement == "bottom") {
            connect.style.setProperty("inset-block-start", `anchor(end, ${inset}px)`);
            connect.style.setProperty("inset-inline-start", `anchor(start, ${inset}px)`);
            connect.style.setProperty("inline-size", `anchor-size(self-inline, ${size})`);
            connect.style.setProperty("transform-origin", transformOrigin);
        }
        else if (placement == "top") {
            connect.style.setProperty("inset-block-end", `anchor(start, ${inset}px)`);
            connect.style.setProperty("inset-inline-start", `anchor(start, ${inset}px)`);
            connect.style.setProperty("inline-size", `anchor-size(self-inline, ${size})`);
            connect.style.setProperty("transform-origin", transformOrigin);
        }
        else if (placement == "left") {
            connect.style.setProperty("inset-inline-start", `anchor(end, ${inset}px)`);
            connect.style.setProperty("inset-block-start", `anchor(start, ${inset}px)`);
            connect.style.setProperty("block-size", `anchor-size(self-block, ${size})`);
            connect.style.setProperty("transform-origin", transformOrigin);
        }
        else if (placement == "right") {
            connect.style.setProperty("inset-inline-end", `anchor(start, ${inset}px)`);
            connect.style.setProperty("inset-block-start", `anchor(start, ${inset}px)`);
            connect.style.setProperty("block-size", `anchor-size(self-block, ${size})`);
            connect.style.setProperty("transform-origin", transformOrigin);
        }
        else if (placement == "center") {
            connect.style.setProperty("inset-inline-start", `anchor(center, ${inset}px)`);
            connect.style.setProperty("inset-block-start", `anchor(center, ${inset}px)`);
            connect.style.setProperty("inline-size", `anchor-size(self-inline, ${size})`);
            connect.style.setProperty("block-size", `anchor-size(self-block, ${size})`);
            connect.style.setProperty("transform-origin", transformOrigin);
        }

        //
        connect.style.setProperty("position-visibility", `always`);
        connect.style.setProperty("position-anchor", this.anchorId);
        connect.style.setProperty("position", `absolute`);
        connect.style.setProperty("position-area", `span-all`);
        connect.style.setProperty("z-index", String(getExistsZIndex(this.source ?? connect) + zIndexShift));
        return this;
    }

    // Enhanced anchor positioning with container query awareness
    connectWithContainerQuery(connect: HTMLElement, {
        placement = "fill",
        containerQuery = "(min-width: 768px)",
        fallbackPlacement = "bottom",
        zIndexShift = 1,
        inset = 0,
        size = "100%",
    }) {
        // Use container query to determine positioning strategy
        const mediaQuery = globalThis.matchMedia ? globalThis.matchMedia(containerQuery) : null;
        const updatePosition = () => {
            const canUseAnchor = CSS.supports && CSS.supports("anchor-name", this.anchorId);
            const useModern = canUseAnchor && mediaQuery?.matches;

            if (useModern) {
                this.connectElement(connect, { placement, zIndexShift, inset, size });
            } else {
                // Fallback to traditional positioning
                connect.style.removeProperty("position-anchor");
                connect.style.removeProperty("anchor-name");
                connect.style.setProperty("position", "absolute");
                connect.style.setProperty("z-index", String(getExistsZIndex(this.source ?? connect) + zIndexShift));

                // Simple fallback positioning based on source element
                const sourceRect = this.source.getBoundingClientRect();

                if (fallbackPlacement === "bottom") {
                    connect.style.setProperty("top", `${sourceRect.bottom + inset}px`);
                    connect.style.setProperty("left", `${sourceRect.left + inset}px`);
                    connect.style.setProperty("width", size);
                } else if (fallbackPlacement === "top") {
                    connect.style.setProperty("bottom", `${globalThis.innerHeight - sourceRect.top + inset}px`);
                    connect.style.setProperty("left", `${sourceRect.left + inset}px`);
                    connect.style.setProperty("width", size);
                } else if (fallbackPlacement === "right") {
                    connect.style.setProperty("top", `${sourceRect.top + inset}px`);
                    connect.style.setProperty("left", `${sourceRect.right + inset}px`);
                    connect.style.setProperty("height", size);
                } else if (fallbackPlacement === "left") {
                    connect.style.setProperty("top", `${sourceRect.top + inset}px`);
                    connect.style.setProperty("right", `${globalThis.innerWidth - sourceRect.left + inset}px`);
                    connect.style.setProperty("height", size);
                }
            }
        };

        if (mediaQuery) {
            mediaQuery.addEventListener("change", updatePosition);
            updatePosition();
        }

        return () => mediaQuery?.removeEventListener("change", updatePosition);
    }
}

//
export const makeAnchorElement = (anchorElement: HTMLElement) => { // @ts-ignore
    return registeredAnchors.getOrInsert(anchorElement, new CSSAnchor(anchorElement));
}
