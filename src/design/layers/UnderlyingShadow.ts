/*
 * Filename: UnderlyingShadow.ts
 * FullPath: modules/projects/lur.e/src/design/layers/UnderlyingShadow.ts
 * Change date and time: 23.15.00_22.08.2026
 * Reason for changes: Fixed under-shadow must keep negative z-index; box-shadow on the clone, not the slab.
 */
import { setProperty, handleStyleChange } from "@fest-lib/dom";
import { bindWith } from "../../lure/core/Binding";
import { CSSUnitUtils } from "../anchor/CSSAdapter";
import { boundingBoxAnchorRef } from "../anchor/BBoxAnchor";
import { enhancedIntersectionBoxAnchorRef } from "../anchor/IntersectionAnchor";
import { appendAsUnderlying, observeConnect } from "./AnchorOverlay";
import type { LayerPositioning } from "./types";

//
export interface UnderlyingShadowOptions {
    target: HTMLElement;
    /**
     * Shape/radius source when different from `target` (e.g. `.ui-ws-item-icon` while
     * `target` is the grid `.ui-ws-item` sibling anchor).
     */
    geometrySource?: HTMLElement | null;
    shadowType?: "drop-shadow" | "blur" | "box-shadow";
    shadowColor?: string;
    shadowBlur?: number;
    shadowOffsetX?: number;
    shadowOffsetY?: number;
    spreadRadius?: number;
    opacity?: number;
    inset?: number;
    zIndexShift?: number;
    useIntersection?: boolean;
    cloneGeometry?: boolean;
    updateOnScroll?: boolean;
    updateOnResize?: boolean;
    /**
     * - `contain` — absolute inset:0 sibling in parent (relative hosts).
     * - `fixed` — viewport-fixed bbox (context menus / `position:fixed` hosts).
     * - `anchor` — CSS anchor fill of `target` (grid item siblings in speed-dial).
     */
    positioning?: LayerPositioning | "fixed";
    /** Extra class on the shadow container (e.g. hover CSS hooks). */
    className?: string;
}

//
export class UnderlyingShadow {
    private shadowContainer?: HTMLElement;
    private shadowElement?: HTMLElement;
    private geometryClone?: HTMLElement;
    private target: HTMLElement;
    private options: UnderlyingShadowOptions;
    private anchorBox?: any[];
    private cleanupFunctions: (() => void)[] = [];

    constructor(options: UnderlyingShadowOptions) {
        this.target = options.target;
        this.options = {
            shadowType: "drop-shadow",
            shadowColor: "rgba(0, 0, 0, 0.25)",
            shadowBlur: 8,
            shadowOffsetX: 0,
            shadowOffsetY: 4,
            spreadRadius: 0,
            opacity: 1,
            inset: 0,
            zIndexShift: -1,
            useIntersection: false,
            cloneGeometry: true,
            updateOnScroll: true,
            updateOnResize: true,
            positioning: "contain",
            ...options
        };

        this.createShadowElements();
        this.setupPositioning();
        this.setupGeometryCloning();
        this.applyShadowStyle();
        this.attachToDOM();
    }

    private get positioningMode(): LayerPositioning | "fixed" {
        return this.options.positioning ?? "contain";
    }

    private get geometryHost(): HTMLElement {
        return this.options.geometrySource ?? this.target;
    }

    private createShadowElements() {
        this.shadowContainer = document.createElement("div");
        this.shadowContainer.className = [
            "underlying-shadow-container",
            this.options.className || ""
        ]
            .filter(Boolean)
            .join(" ");
        this.shadowContainer.setAttribute("aria-hidden", "true");
        this.shadowContainer.style.pointerEvents = "none";
        this.shadowContainer.style.overflow = "visible";
        // WHY: filters/box-shadow must not share the main's backdrop-filter stacking context.
        this.shadowContainer.style.isolation = "isolate";
        this.shadowContainer.style.contentVisibility = "visible";

        if (this.options.cloneGeometry) {
            this.geometryClone = document.createElement("div");
            this.geometryClone.className = "underlying-shadow-geometry underlying-shadow-element";
            this.geometryClone.style.width = "100%";
            this.geometryClone.style.height = "100%";
            this.geometryClone.style.position = "relative";
            this.geometryClone.style.overflow = "hidden";
            this.geometryClone.style.contentVisibility = "visible";
            this.geometryClone.style.visibility = "visible";
            this.shadowContainer.appendChild(this.geometryClone);
            this.shadowElement = this.geometryClone;
        } else {
            this.shadowElement = document.createElement("div");
            this.shadowElement.className = "underlying-shadow-element";
            this.shadowElement.style.width = "100%";
            this.shadowElement.style.height = "100%";
            this.shadowElement.style.position = "relative";
            this.shadowElement.style.overflow = "hidden";
            this.shadowElement.style.contentVisibility = "visible";
            this.shadowElement.style.visibility = "visible";
            this.shadowContainer.appendChild(this.shadowElement);
        }
    }

    private setupPositioning() {
        const mode = this.positioningMode;
        // contain: parent-relative fill via appendAsUnderlying — no viewport bbox binds.
        if (mode === "contain") {
            this.shadowContainer!.style.position = "absolute";
            return;
        }
        // anchor: CSS `position-anchor` fill via appendAsUnderlying — no bbox left/top fight.
        if (mode === "anchor") {
            return;
        }

        if (mode === "fixed") {
            this.shadowContainer!.style.position = "fixed";
        } else {
            this.shadowContainer!.style.position = "absolute";
        }

        if (this.options.useIntersection) {
            this.anchorBox = enhancedIntersectionBoxAnchorRef(this.target as HTMLElement, {
                root: window as any,
                observeResize: this.options.updateOnResize,
                observeMutations: true,
                observeIntersection: true
            }) as any[];

            bindWith(this.shadowContainer, "left", CSSUnitUtils.asPx(this.anchorBox?.[6]), handleStyleChange);
            bindWith(this.shadowContainer, "top", CSSUnitUtils.asPx(this.anchorBox?.[7]), handleStyleChange);
            bindWith(this.shadowContainer, "width", CSSUnitUtils.asPx(this.anchorBox?.[8]), handleStyleChange);
            bindWith(this.shadowContainer, "height", CSSUnitUtils.asPx(this.anchorBox?.[9]), handleStyleChange);
        } else {
            this.anchorBox = boundingBoxAnchorRef(this.target as HTMLElement, {
                observeResize: this.options.updateOnResize,
                observeMutations: true
            }) as any[];

            bindWith(this.shadowContainer, "left", CSSUnitUtils.asPx(this.anchorBox?.[0]), handleStyleChange);
            bindWith(this.shadowContainer, "top", CSSUnitUtils.asPx(this.anchorBox?.[1]), handleStyleChange);
            bindWith(this.shadowContainer, "width", CSSUnitUtils.asPx(this.anchorBox?.[2]), handleStyleChange);
            bindWith(this.shadowContainer, "height", CSSUnitUtils.asPx(this.anchorBox?.[3]), handleStyleChange);
        }

        if (this.options.inset !== 0) {
            const insetPx = CSSUnitUtils.asPx(this.options.inset);
            setProperty(this.shadowContainer, "left", `calc(var(--left) + ${insetPx})`);
            setProperty(this.shadowContainer, "top", `calc(var(--top) + ${insetPx})`);
            setProperty(this.shadowContainer, "width", `calc(var(--width) - ${2 * insetPx})`);
            setProperty(this.shadowContainer, "height", `calc(var(--height) - ${2 * insetPx})`);
        }
    }

    private setupGeometryCloning() {
        if (!this.geometryClone) return;

        const cloneGeometry = () => {
            const host = this.geometryHost;
            const computedStyle = getComputedStyle(host);

            const borderRadius = computedStyle.borderRadius;
            if (borderRadius && borderRadius !== "0px") {
                this.geometryClone!.style.borderRadius = borderRadius;
            }

            const clipPath = computedStyle.clipPath;
            if (clipPath && clipPath !== "none") {
                this.geometryClone!.style.clipPath = clipPath;
            }

            if (computedStyle.borderShape && computedStyle.borderShape !== "none") {
                this.geometryClone!.style.borderShape = computedStyle.borderShape;
            }

            if (computedStyle.cornerShape && computedStyle.cornerShape !== "none") {
                this.geometryClone!.style.cornerShape = computedStyle.cornerShape;
            }

            const maskImage = computedStyle.maskImage || (computedStyle as any).webkitMaskImage;
            if (maskImage && maskImage !== "none") {
                this.geometryClone!.style.maskImage = maskImage;
                (this.geometryClone!.style as any).webkitMaskImage = maskImage;
            }

            // WHY: do not clone live drag transforms onto the under-shadow (jitter); shape only.
            const shape = host.getAttribute("data-shape");
            if (shape) this.geometryClone!.setAttribute("data-shape", shape);

            const borderWidth = computedStyle.borderWidth;
            const borderStyle = computedStyle.borderStyle;
            if (borderWidth && borderWidth !== "0px" && borderStyle !== "none") {
                this.geometryClone!.style.border = `${borderWidth} ${borderStyle} transparent`;
            }

            // Solid silhouette for drop-shadow / blur filters (not the glass fill).
            if (this.options.shadowType !== "box-shadow") {
                this.geometryClone!.style.background = "#000000";
            }
            this.geometryClone!.style.opacity = "1";
        };

        cloneGeometry();

        const observer = new MutationObserver(cloneGeometry);
        observer.observe(this.geometryHost, {
            attributes: true,
            attributeFilter: ["style", "class", "data-shape"]
        });

        this.cleanupFunctions.push(() => observer.disconnect());
    }

    private applyShadowStyle() {
        const {
            shadowType,
            shadowColor,
            shadowBlur,
            shadowOffsetX,
            shadowOffsetY,
            spreadRadius,
            opacity
        } = this.options;

        if (shadowType === "drop-shadow") {
            const filterValue = `drop-shadow(${CSSUnitUtils.asPx(shadowOffsetX || 0)} ${CSSUnitUtils.asPx(shadowOffsetY || 0)} ${CSSUnitUtils.asPx(shadowBlur || 0)} ${shadowColor})`;
            this.shadowContainer!.style.filter = filterValue;
            this.shadowContainer!.style.opacity = opacity!.toString() || "1";
            this.shadowContainer!.style.boxShadow = "none";
        } else if (shadowType === "blur") {
            const filterValue = `blur(${CSSUnitUtils.asPx(shadowBlur || 0)})`;
            this.shadowContainer!.style.filter = filterValue;
            this.shadowContainer!.style.opacity = opacity!.toString() || "1";
            if (this.geometryClone) {
                this.geometryClone.style.backgroundColor = shadowColor!;
            }
        } else if (shadowType === "box-shadow") {
            const boxShadowValue = `${CSSUnitUtils.asPx(shadowOffsetX || 0)} ${CSSUnitUtils.asPx(shadowOffsetY || 0)} ${CSSUnitUtils.asPx(shadowBlur || 0)} ${CSSUnitUtils.asPx(spreadRadius || 0)} ${shadowColor}`;
            this.shadowContainer!.style.background = "transparent";
            this.shadowContainer!.style.boxShadow = "none";
            if (this.geometryClone) {
                this.geometryClone.style.boxShadow = boxShadowValue;
            } else if (this.shadowElement) {
                this.shadowElement.style.boxShadow = boxShadowValue;
            }
            this.shadowContainer!.style.filter = "none";
            this.shadowContainer!.style.opacity = opacity!.toString() || "1";
        }
    }

    private attachToDOM() {
        if (!this.shadowContainer) return;

        const mode = this.positioningMode;

        if (mode === "fixed") {
            // WHY: fixed-bbox menus must not use contain (fills overlay) or CSS-anchor absolute.
            const layer = this.shadowContainer;
            layer.style.position = "fixed";
            layer.style.pointerEvents = "none";
            const shift = this.options.zIndexShift ?? -1;
            const mainZ = Number.parseInt(getComputedStyle(this.target).zIndex || "0", 10);
            // WHY: `Math.max(..., 0)` painted a 40px taskbar-under slab over PWA windows.
            layer.style.zIndex = String(Number.isFinite(mainZ) ? mainZ + shift : shift);
            const insert = () => {
                if (!this.target.isConnected) return;
                this.target.before(layer);
            };
            observeConnect(this.target, insert);
            if (this.target.isConnected) insert();
        } else {
            appendAsUnderlying(this.target, this.shadowContainer, {
                stackMode: "shift",
                zIndexShift: this.options.zIndexShift ?? -1,
                placement: "fill",
                positioning: mode === "contain" ? "contain" : "anchor",
                useIntersection: this.options.useIntersection
            });
        }

        const parent = this.target.parentElement ?? document.body;
        const disconnectObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.removedNodes.forEach((node) => {
                    if (node === this.target || (node as Node).contains?.(this.target)) {
                        this.destroy();
                    }
                });
            });
        });

        if (parent) {
            disconnectObserver.observe(parent, { childList: true, subtree: true });
            this.cleanupFunctions.push(() => disconnectObserver.disconnect());
        }
    }

    updateOptions(newOptions: Partial<UnderlyingShadowOptions>) {
        Object.assign(this.options, newOptions);
        this.applyShadowStyle();
        if (newOptions.cloneGeometry !== undefined) {
            this.setupGeometryCloning();
        }
    }

    setVisible(visible: boolean) {
        this.shadowContainer!.style.display = visible ? "block" : "none";
    }

    getShadowElement(): HTMLElement {
        return this.shadowContainer as HTMLElement;
    }

    destroy() {
        this.cleanupFunctions.forEach((cleanup) => cleanup());
        if (this.shadowContainer?.parentNode) {
            this.shadowContainer.parentNode.removeChild(this.shadowContainer);
        }
        if (this.anchorBox) {
            this.anchorBox.forEach((anchor) => {
                if (anchor && typeof anchor[Symbol.dispose] === "function") {
                    anchor[Symbol.dispose]();
                }
            });
        }
    }
}

export function createUnderlyingShadow(options: UnderlyingShadowOptions): UnderlyingShadow {
    return new UnderlyingShadow(options);
}

export function createDropShadow(
    target: HTMLElement,
    options?: Partial<UnderlyingShadowOptions>
): UnderlyingShadow {
    return createUnderlyingShadow({
        target,
        shadowType: "drop-shadow",
        shadowColor: "rgba(0, 0, 0, 0.6)",
        shadowBlur: 6,
        shadowOffsetX: 0,
        shadowOffsetY: 3,
        positioning: "contain",
        ...options
    });
}

export function createBlurShadow(
    target: HTMLElement,
    options?: Partial<UnderlyingShadowOptions>
): UnderlyingShadow {
    return createUnderlyingShadow({
        target,
        shadowType: "blur",
        shadowColor: "rgba(0, 0, 0, 0.2)",
        shadowBlur: 4,
        shadowOffsetX: 0,
        shadowOffsetY: 2,
        positioning: "contain",
        ...options
    });
}

export function createBoxShadow(
    target: HTMLElement,
    options?: Partial<UnderlyingShadowOptions>
): UnderlyingShadow {
    return createUnderlyingShadow({
        target,
        shadowType: "box-shadow",
        shadowColor: "rgba(0, 0, 0, 0.2)",
        shadowBlur: 8,
        shadowOffsetX: 0,
        shadowOffsetY: 4,
        spreadRadius: 0,
        positioning: "contain",
        ...options
    });
}

/**
 * Shaped under-glow for glass tiles (`backdrop-filter` on main).
 * INVARIANT: `target` is the grid `.ui-ws-item` (under is a preceding sibling in the grid);
 * shape/radius clones from `geometrySource` (usually `.ui-ws-item-icon`).
 */
export function createShapedTileShadow(
    target: HTMLElement,
    options?: Partial<UnderlyingShadowOptions>
): UnderlyingShadow {
    const geometrySource =
        options?.geometrySource
        ?? (target.querySelector(".ui-ws-item-icon") as HTMLElement | null)
        ?? target;
    return createBoxShadow(target, {
        shadowType: "blur",
        className: "ui-ws-item-icon-under",
        shadowColor: "rgba(0, 0, 0, 0.6)",
        shadowBlur: 24,
        shadowOffsetY: 6,
        shadowOffsetX: 0,
        spreadRadius: -8,
        opacity: 1,
        cloneGeometry: true,
        // WHY: sibling of `.ui-ws-item` in `.speed-dial-grid` — CSS-anchor fill, not contain (contain fills the whole grid).
        positioning: "anchor",
        geometrySource,
        ...options
    });
}

/**
 * Under-shadow for fixed chrome panels (context menus) that may use backdrop-filter.
 */
export function createPanelUnderShadow(
    target: HTMLElement,
    options?: Partial<UnderlyingShadowOptions>
): UnderlyingShadow {
    return createBoxShadow(target, {
        className: "cw-context-menu-under",
        shadowColor: "rgba(0, 0, 0, 0.45)",
        shadowBlur: 36,
        shadowOffsetY: 14,
        shadowOffsetX: 0,
        spreadRadius: 0,
        cloneGeometry: true,
        positioning: "fixed",
        updateOnScroll: true,
        updateOnResize: true,
        ...options
    });
}
