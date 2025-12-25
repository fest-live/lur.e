import { computed, subscribe } from "fest/object";
import { bindWith } from "fest/lure";
import { setProperty, handleStyleChange } from "fest/dom";
import { boundingBoxAnchorRef } from "../space-ref/BBoxAnchor";
import { enhancedIntersectionBoxAnchorRef } from "../space-ref/IntersectionAnchor";
import { makeAnchorElement } from "../css-ref/CSSAnchor";

//
export interface UnderlyingShadowOptions {
    target: HTMLElement;
    shadowType?: 'drop-shadow' | 'blur' | 'box-shadow';
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
            shadowType: 'drop-shadow',
            shadowColor: 'rgba(0, 0, 0, 0.25)',
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
            ...options
        };

        this.createShadowElements();
        this.setupPositioning();
        this.setupGeometryCloning();
        this.applyShadowStyle();
        this.attachToDOM();
    }

    private createShadowElements() {
        // Create container for the filter (transparent background)
        this.shadowContainer = document.createElement('div');
        this.shadowContainer.className = 'underlying-shadow-container';
        this.shadowContainer.style.position = 'absolute';
        this.shadowContainer.style.pointerEvents = 'none';
        this.shadowContainer.style.zIndex = this.options.zIndexShift!.toString();

        // Create the actual shadow element (where filter is applied)
        this.shadowElement = document.createElement('div');
        this.shadowElement.className = 'underlying-shadow-element';
        this.shadowElement.style.width = '100%';
        this.shadowElement.style.height = '100%';
        this.shadowElement.style.position = 'relative';

        // Add geometry clone if requested
        if (this.options.cloneGeometry) {
            this.geometryClone = document.createElement('div');
            this.geometryClone.className = 'underlying-shadow-geometry';
            this.geometryClone.style.width = '100%';
            this.geometryClone.style.height = '100%';
            this.geometryClone.style.position = 'relative';
            this.shadowElement.appendChild(this.geometryClone);
        }

        this.shadowContainer.appendChild(this.shadowElement);
    }

    private setupPositioning() {
        if (this.options.useIntersection) {
            // Use intersection-based positioning for more precise placement
            this.anchorBox = enhancedIntersectionBoxAnchorRef(this.target, {
                root: window,
                observeResize: this.options.updateOnResize,
                observeMutations: true,
                observeIntersection: true
            });

            // Position based on intersection box
            // anchorBox: [ix, iy, iwidth, iheight, iright, ibottom, ax, ay, awidth, aheight, rx, ry, rwidth, rheight]
            bindWith(this.shadowContainer, 'left', computed(this.anchorBox?.[6], (v) => `${v || 0}px`), handleStyleChange); // anchor x
            bindWith(this.shadowContainer, 'top', computed(this.anchorBox?.[7], (v) => `${v || 0}px`), handleStyleChange); // anchor y
            bindWith(this.shadowContainer, 'width', computed(this.anchorBox?.[8], (v) => `${v || 0}px`), handleStyleChange); // anchor width
            bindWith(this.shadowContainer, 'height', computed(this.anchorBox?.[9], (v) => `${v || 0}px`), handleStyleChange); // anchor height

        } else {
            // Use standard bounding box positioning
            this.anchorBox = boundingBoxAnchorRef(this.target, {
                observeResize: this.options.updateOnResize,
                observeMutations: true
            });

            // Position based on bounding box
            // anchorBox: [x, y, width, height, right, bottom]
            bindWith(this.shadowContainer, 'left', computed(this.anchorBox?.[0], (v) => `${v || 0}px`), handleStyleChange);
            bindWith(this.shadowContainer, 'top', computed(this.anchorBox?.[1], (v) => `${v || 0}px`), handleStyleChange);
            bindWith(this.shadowContainer, 'width', computed(this.anchorBox?.[2], (v) => `${v || 0}px`), handleStyleChange);
            bindWith(this.shadowContainer, 'height', computed(this.anchorBox?.[3], (v) => `${v || 0}px`), handleStyleChange);
        }

        // Apply inset offset
        if (this.options.inset !== 0) {
            const insetPx = `${this.options.inset}px`;
            setProperty(this.shadowContainer, 'left', `calc(var(--left) + ${insetPx})`);
            setProperty(this.shadowContainer, 'top', `calc(var(--top) + ${insetPx})`);
            setProperty(this.shadowContainer, 'width', `calc(var(--width) - ${2 * this.options.inset!}px)`);
            setProperty(this.shadowContainer, 'height', `calc(var(--height) - ${2 * this.options.inset!}px)`);
        }
    }

    private setupGeometryCloning() {
        if (!this.geometryClone) return;

        const cloneGeometry = () => {
            const computedStyle = getComputedStyle(this.target);

            // Clone border radius
            const borderRadius = computedStyle.borderRadius;
            if (borderRadius && borderRadius !== '0px') {
                this.geometryClone!.style.borderRadius = borderRadius;
            }

            // Clone clip path if present
            const clipPath = computedStyle.clipPath;
            if (clipPath && clipPath !== 'none') {
                this.geometryClone!.style.clipPath = clipPath;
            }

            // Clone transform if it affects shape
            const transform = computedStyle.transform;
            if (transform && transform !== 'none') {
                this.geometryClone!.style.transform = transform;
            }

            // Clone border if present (for more accurate shadow)
            const borderWidth = computedStyle.borderWidth;
            const borderStyle = computedStyle.borderStyle;
            const borderColor = computedStyle.borderColor;

            if (borderWidth && borderWidth !== '0px' && borderStyle !== 'none') {
                this.geometryClone!.style.border = `${borderWidth} ${borderStyle} ${borderColor}`;
            }

            // Clone background for complex shadows
            const background = computedStyle.background;
            if (background && background !== 'none' && background !== 'rgba(0, 0, 0, 0)') {
                this.geometryClone!.style.background = background;
            } else {
                // Use solid color for shadow shape
                this.geometryClone!.style.background = '#000000';
            }
        };

        // Initial clone
        cloneGeometry();

        // Watch for style changes
        const observer = new MutationObserver(cloneGeometry);
        observer.observe(this.target, {
            attributes: true,
            attributeFilter: ['style', 'class']
        });

        this.cleanupFunctions.push(() => observer.disconnect());
    }

    private applyShadowStyle() {
        const { shadowType, shadowColor, shadowBlur, shadowOffsetX, shadowOffsetY, spreadRadius, opacity } = this.options;

        if (shadowType === 'drop-shadow') {
            // Use CSS filter drop-shadow (applied to container)
            const filterValue = `drop-shadow(${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px ${shadowColor})`;
            this.shadowContainer.style.filter = filterValue;
            this.shadowContainer.style.opacity = opacity!.toString();

        } else if (shadowType === 'blur') {
            // Use blur filter with solid shape
            const filterValue = `blur(${shadowBlur}px)`;
            this.shadowElement.style.filter = filterValue;
            this.shadowElement.style.opacity = opacity!.toString();

            if (this.geometryClone) {
                this.geometryClone.style.backgroundColor = shadowColor!;
                this.geometryClone.style.transform = `translate(${-shadowOffsetX}px, ${-shadowOffsetY}px)`;
            }

        } else if (shadowType === 'box-shadow') {
            // Traditional box-shadow (applied to geometry clone)
            const boxShadowValue = `${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px ${spreadRadius}px ${shadowColor}`;
            this.shadowContainer.style.boxShadow = boxShadowValue;
            this.shadowContainer.style.opacity = opacity!.toString();
        }
    }

    private attachToDOM() {
        // Find appropriate parent to attach shadow
        let parent = this.target.parentElement;
        if (!parent) {
            // Fallback to body if no parent
            parent = document.body;
        }

        // Insert shadow before the target element
        parent.insertBefore(this.shadowContainer, this.target);

        // Set up cleanup when target is removed
        const disconnectObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.removedNodes.forEach((node) => {
                    if (node === this.target || node.contains(this.target)) {
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

    // Public API
    updateOptions(newOptions: Partial<UnderlyingShadowOptions>) {
        Object.assign(this.options, newOptions);
        this.applyShadowStyle();

        if (newOptions.cloneGeometry !== undefined) {
            this.setupGeometryCloning();
        }
    }

    setVisible(visible: boolean) {
        this.shadowContainer.style.display = visible ? 'block' : 'none';
    }

    getShadowElement(): HTMLElement {
        return this.shadowContainer;
    }

    destroy() {
        // Run cleanup functions
        this.cleanupFunctions.forEach(cleanup => cleanup());

        // Remove from DOM
        if (this.shadowContainer.parentNode) {
            this.shadowContainer.parentNode.removeChild(this.shadowContainer);
        }

        // Cleanup anchor box
        if (this.anchorBox) {
            this.anchorBox.forEach(anchor => {
                if (anchor && typeof anchor[Symbol.dispose] === 'function') {
                    anchor[Symbol.dispose]();
                }
            });
        }
    }
}

// Factory function for creating underlying shadows
export function createUnderlyingShadow(options: UnderlyingShadowOptions): UnderlyingShadow {
    return new UnderlyingShadow(options);
}

// Convenience function for common shadow types
export function createDropShadow(target: HTMLElement, options?: Partial<UnderlyingShadowOptions>): UnderlyingShadow {
    return createUnderlyingShadow({
        target,
        shadowType: 'drop-shadow',
        shadowColor: 'rgba(0, 0, 0, 0.15)',
        shadowBlur: 6,
        shadowOffsetX: 0,
        shadowOffsetY: 3,
        ...options
    });
}

export function createBlurShadow(target: HTMLElement, options?: Partial<UnderlyingShadowOptions>): UnderlyingShadow {
    return createUnderlyingShadow({
        target,
        shadowType: 'blur',
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowBlur: 4,
        shadowOffsetX: 0,
        shadowOffsetY: 2,
        ...options
    });
}

export function createBoxShadow(target: HTMLElement, options?: Partial<UnderlyingShadowOptions>): UnderlyingShadow {
    return createUnderlyingShadow({
        target,
        shadowType: 'box-shadow',
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowBlur: 8,
        shadowOffsetX: 0,
        shadowOffsetY: 4,
        spreadRadius: 0,
        ...options
    });
}
