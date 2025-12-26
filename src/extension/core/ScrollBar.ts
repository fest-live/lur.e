import { subscribe, numberRef } from "fest/object";
import { bindWith, paddingBoxSize, scrollSize } from "fest/lure";
import { makeRAFCycle, addEvent, removeEvents, addEvents, removeEvent, handleStyleChange } from "fest/dom";
import { boundingBoxAnchorRef } from "../space-ref/BBoxAnchor";
import { pointerAnchorRef } from "../space-ref/PointerAnchor";
import { EnhancedScrollTimeline, makeScrollTimeline } from "../css-ref/CSSTimeline";
import { createResponsiveScrollbarConfig } from "../css-ref/ContainerQuery";
import { ScrollbarGestureHandler } from "../controllers/EnhancedGestures";
import { ScrollbarThemeManager, ScrollbarTheme } from "./ScrollbarTheme";

// Enhanced reactive math and CSS integration
import { vector2Ref, operated, CSSBinder, CSSUnitUtils } from "fest/lure";
import { ReactiveElementSize } from "../css-ref/Utils";
import { ReactiveTransform } from "../css-ref/Utils";
import { animateByTimeline } from "../css-ref/CSSAnimated";

// @ts-ignore
//import styles from "./ScrollBar.scss?inline";
//const styled  = preloadStyle(styles);

//
export interface ScrollBarStatus {
    pointerId: number;
    scroll: number;
    delta: number;
    point: number;
};

//
const axisConfig = [{
    name: "x", tName: "inline",
    cssScrollProperty: ["--scroll-left", "calc(var(--percent-x, 0) * max(calc(var(--scroll-size, 1) - var(--content-size, 1)), 0))"] as [string, string],
    cssPercentProperty: "--percent-x"
}, {
    name: "y", tName: "block",
    cssScrollProperty: ["--scroll-top", "calc(var(--percent-y, 0) * max(calc(var(--scroll-size, 1) - var(--content-size, 1)), 0))"] as [string, string],
    cssPercentProperty: "--percent-y"
}];

//
const CAXIS    = ["clientX", "clientY"];
const asWeak   = (source)=>{ return ((source instanceof WeakRef || typeof source?.deref == "function") ? source : new WeakRef(source)) as any; }
const stepped  = (count = 100)=>{ return Array.from({ length: count }, (_, i) => i / count).concat([1]); }
const sheduler = makeRAFCycle();

//
export const effectProperty = { fill: "both", delay: 0, easing: "linear", rangeStart: "cover 0%", rangeEnd: "cover 100%", duration: 1 };

//
const _LOG_ = (a)=>{
    console.log(a); return a;
}



//
try { CSS.registerProperty({ name: "--percent-x", syntax: "<number>", inherits: true, initialValue: "0" }); } catch(e) {};
try { CSS.registerProperty({ name: "--percent-y", syntax: "<number>", inherits: true, initialValue: "0" }); } catch(e) {};
try { CSS.registerProperty({ name: "--scroll-coef", syntax: "<number>", inherits: true, initialValue: "1" }); } catch(e) {};
try { CSS.registerProperty({ name: "--determinant", syntax: "<number>", inherits: true, initialValue: "0" }); } catch(e) {};
try { CSS.registerProperty({ name: "--scroll-size", syntax: "<length-percentage>", inherits: true, initialValue: "0px" }); } catch(e) {};
try { CSS.registerProperty({ name: "--content-size", syntax: "<length-percentage>", inherits: true, initialValue: "0px" }); } catch(e) {};
try { CSS.registerProperty({ name: "--clamped-size", syntax: "<length-percentage>", inherits: true, initialValue: "0px" }); } catch(e) {};
try { CSS.registerProperty({ name: "--thumb-size", syntax: "<length-percentage>", inherits: true, initialValue: "0px" }); } catch(e) {};
try { CSS.registerProperty({ name: "--max-offset", syntax: "<length-percentage>", inherits: true, initialValue: "0px" }); } catch(e) {};
try { CSS.registerProperty({ name: "--max-size", syntax: "<length-percentage>", inherits: true, initialValue: "0px" }); } catch(e) {};

//
export const makeInteractive = (holder, content, scrollbar, axis = 0, status: any = {}, inputChange?: any|null, draggingState?: any) =>{
    const status_w   = asWeak(status);
    const content_w  = asWeak(content);
    const dragging_w = asWeak(draggingState);
    const moveScroll = (evc) => {
        const ev     = evc;
        const status = status_w?.deref?.();
        if (self && status?.pointerId == ev.pointerId) {
            //evc?.stopPropagation?.();
            evc?.preventDefault?.();
            const cm = ev[CAXIS[axis]] || 0; const dm = (cm - status.point) || 0;
            const contentScrollSize = content?.[['scrollWidth', 'scrollHeight'][axis]] - content?.[['clientWidth', 'clientHeight'][axis]];
            const trackSize = scrollbar?.[['clientWidth', 'clientHeight'][axis]] - (handler?.[['offsetWidth', 'offsetHeight'][axis] || 0]);
            const DT = (dm * contentScrollSize) / trackSize; status.point = cm;

            // Скроллим содержимое
            content_w?.deref?.()?.scrollBy?.({
                [['left', 'top'][axis]]: DT,//(status.scroll += DT),
                behavior: 'instant'
            });
        }
    }

    //
    const handler = scrollbar?.querySelector?.("*") ?? scrollbar;
    const stopScroll = (evc) => {
        const ev     = evc;
        const status = status_w?.deref?.();
        if (status && status?.pointerId == ev.pointerId) {
            //evc?.stopPropagation?.();
            evc?.preventDefault?.();
            status.point = ev[CAXIS[axis]] || 0;

            // Reset dragging state
            if (dragging_w?.deref?.()) {
                dragging_w.deref().value = 0;
            }

            // @ts-ignore
            (handler?.element ?? ev.target)?.releasePointerCapture?.(status.pointerId); status.pointerId = -1;
            removeEvents(handler, {
                "pointerup"    : stopScroll,
                "pointermove"  : moveScroll,
                "pointercancel": stopScroll
            });
        }
    }

    //
    if (handler) {
        addEvent(handler, "pointerdown", (evc: any) => {
            const ev     = evc;
            const status = status_w?.deref?.();
            if (self && status?.pointerId < 0) {
                //evc?.stopPropagation?.();
                evc?.preventDefault?.();
                (handler?.element ?? ev.target)?.setPointerCapture?.(status.pointerId = ev.pointerId || 0);

                // Set dragging state
                if (dragging_w?.deref?.()) {
                    dragging_w.deref().value = 1;
                }

                //
                status.point  = ev[CAXIS[axis]] || 0;
                status.scroll = content_w?.deref?.()?.[["scrollLeft", "scrollTop"][axis]] || 0;

                //
                addEvents(handler, {
                    "pointerup"    : stopScroll,
                    "pointermove"  : moveScroll,
                    "pointercancel": stopScroll
                });
            }
        });
    }
}

//
export class ScrollBar {
    scrollbar: HTMLDivElement;
    content: HTMLDivElement;
    status: ScrollBarStatus;
    holder: HTMLElement;
    inputChange: any;

    // Enhanced spatial awareness
    spatialAnchor?: any[];
    pointerAnchor?: any[];
    private _spatialAnchorCleanup?: () => void;
    private _pointerAnchorCleanup?: () => void;
    enhancedTimeline?: EnhancedScrollTimeline;

    // Animation and interaction state
    isVisible = numberRef(1);
    isDragging = numberRef(0);

    // Enhanced reactive position and size tracking
    thumbPosition = vector2Ref(0, 0);
    thumbSize = vector2Ref(20, 20);
    containerSize = vector2Ref(0, 0);

    // Reactive transforms and styles
    thumbTransform = new ReactiveTransform();
    scrollbarOpacity = numberRef(1);

    // Responsive behavior
    responsiveConfig?: any;
    private _unsubscribeAutoHide?: () => void;
    private _unsubscribeAccessibility?: () => void;

    // Enhanced gesture handling
    gestureHandler?: ScrollbarGestureHandler;

    // Theming
    themeManager?: ScrollbarThemeManager;

    //
    constructor({holder, scrollbar, content, inputChange}, axis = 0) {
        this.scrollbar   = scrollbar;
        this.holder      = holder;
        this.content     = content;
        this.status      = { delta: 0, scroll: 0, point: 0, pointerId: -1 };
        this.inputChange = inputChange;

        //
        this.initializeReactiveSizing(axis);
        this.initializeSpatialAwareness(axis);
        this.initializeResponsiveBehavior();
        this.initializeGestureHandling(axis);
        this.initializeTheming();
        this.setupAutoHideBehavior();
        this.setupAccessibility();

        //
        const currAxis   = axisConfig[axis]; // @ts-ignore
        const bar        = this.scrollbar, source = this?.holder ?? this?.content; bar?.style?.setProperty(...currAxis.cssScrollProperty, "") // @ts-ignore
        const properties = { [currAxis.cssPercentProperty]: [0, 1] };
        if (this.enhancedTimeline = makeScrollTimeline(source as HTMLElement & { element?: HTMLElement }, axis === 0 ? "inline" : "block"))
            { animateByTimeline(bar, properties, this.enhancedTimeline); };

        //
        makeInteractive(this.holder, this.content, this.scrollbar, axis, this.status, this.inputChange, this.isDragging);
        bindWith(this.scrollbar, "--content-size", CSSUnitUtils.asPx(paddingBoxSize(this.content, axis, this.inputChange)), handleStyleChange);
        bindWith(this.scrollbar, "--scroll-size", CSSUnitUtils.asPx(scrollSize(this.content, axis, this.inputChange)), handleStyleChange);

        // Enhanced reactive binding with CSS transforms
        bindWith(this.scrollbar, "opacity", this.scrollbarOpacity, handleStyleChange);
        bindWith(this.scrollbar, "--is-dragging", this.isDragging, handleStyleChange);

        // Bind reactive thumb transform
        CSSBinder.bindTransform(this.scrollbar.querySelector('*') as HTMLElement,
            this.thumbTransform.value);
    }

    private initializeReactiveSizing(axis: number) {
        // Create reactive element size trackers
        const containerSizeTracker = new ReactiveElementSize(this.holder);
        const contentSizeTracker = new ReactiveElementSize(this.content);

        // Update reactive size properties
        operated([containerSizeTracker.width, containerSizeTracker.height], () => {
            this.containerSize.x.value = containerSizeTracker.width.value;
            this.containerSize.y.value = containerSizeTracker.height.value;
        });

        // Calculate thumb size reactively
        const contentSize = axis === 0 ? contentSizeTracker.width : contentSizeTracker.height;
        const containerSize = axis === 0 ? containerSizeTracker.width : containerSizeTracker.height;

        operated([contentSize, containerSize], () => {
            const ratio = containerSize.value / contentSize.value;
            const thumbLength = Math.max(20, ratio * containerSize.value);
            const thumbThickness = this.responsiveConfig?.getCurrentConfig().thickness || 12;

            if (axis === 0) { // Horizontal
                this.thumbSize.x.value = thumbLength;
                this.thumbSize.y.value = thumbThickness;
            } else { // Vertical
                this.thumbSize.x.value = thumbThickness;
                this.thumbSize.y.value = thumbLength;
            }
        });

        // Bind reactive thumb size to CSS
        CSSBinder.bindSize(this.scrollbar.querySelector('*') as HTMLElement, this.thumbSize);
    }

    private initializeSpatialAwareness(axis: number) {
        // Use bounding box anchor for spatial positioning
        const spatialResult = boundingBoxAnchorRef(this.content, {
            observeResize: true,
            observeMutations: true
        });
        if (Array.isArray(spatialResult)) {
            this.spatialAnchor = spatialResult;
        }

        // Use pointer anchor for interaction awareness
        const pointerResult = pointerAnchorRef(this.holder);
        if (Array.isArray(pointerResult)) {
            this.pointerAnchor = pointerResult.slice(0, 2); // x, y coordinates
            this._pointerAnchorCleanup = pointerResult[2]; // cleanup function
        }

        // Update scrollbar position based on spatial changes
        if (this.spatialAnchor) {
            subscribe(this.spatialAnchor[axis === 0 ? 2 : 3], () => {
                this.updateSpatialPosition(axis);
            });
        }
    }

    private initializeResponsiveBehavior() {
        // Initialize responsive scrollbar configuration
        this.responsiveConfig = createResponsiveScrollbarConfig(this.holder);

        // Update scrollbar thickness based on responsive config
        subscribe(this.responsiveConfig.currentConfig, () => {
            const config = this.responsiveConfig.getCurrentConfig();
            this.updateScrollbarThickness(config.thickness);
        });

        // Initial thickness update
        const initialConfig = this.responsiveConfig.getCurrentConfig();
        this.updateScrollbarThickness(initialConfig.thickness);
    }

    private updateScrollbarThickness(thickness: number) {
        // Update CSS custom property for scrollbar thickness
        this.scrollbar.style.setProperty("--scrollbar-thickness", `${thickness}px`);

        // Update actual size if needed
        if (this.scrollbar.style.width && this.scrollbar.style.width.includes("var(--scrollbar-thickness)")) {
            // Already using CSS variable
        } else {
            // Set explicit size
            this.scrollbar.style.width = `${thickness}px`;
        }
    }

    private initializeGestureHandling(axis: number) {
        // Create enhanced gesture handler for better touch support
        this.gestureHandler = new ScrollbarGestureHandler(
            this.scrollbar,
            this.content,
            axis === 0 ? 'horizontal' : 'vertical',
            {
                enableMomentum: true,
                momentumDecay: 0.92,
                minVelocity: 0.1,
                maxVelocity: 3,
                touchAction: 'none'
            }
        );

        // Override default pointer handling with enhanced gestures
        // The gesture handler will manage pointer events directly
        this.gestureHandler.setCallbacks({
            onStart: (gesture) => {
                // Set dragging state when gesture starts
                this.isDragging.value = 1;
            },
            onEnd: (gesture) => {
                // Reset dragging state when gesture ends
                this.isDragging.value = 0;
            }
        });
    }

    private updateSpatialPosition(axis: number) {
        if (!this.spatialAnchor || !this.scrollbar) return;

        const [x, y, width, height] = this.spatialAnchor;
        const scrollbarSize = axis === 0 ? this.scrollbar.offsetWidth : this.scrollbar.offsetHeight;
        const contentSize = axis === 0 ? width.value : height.value;

        // Position scrollbar based on content size and scroll progress
        if (axis === 0) {
            // Horizontal scrollbar positioning
            this.scrollbar.style.left = `${x.value}px`;
            this.scrollbar.style.top = `${y.value + height.value}px`;
            this.scrollbar.style.width = `${width.value}px`;
        } else {
            // Vertical scrollbar positioning
            this.scrollbar.style.left = `${x.value + width.value}px`;
            this.scrollbar.style.top = `${y.value}px`;
            this.scrollbar.style.height = `${height.value}px`;
        }
    }

    private setupAutoHideBehavior() {
        let hideTimeout: number;
        let unsubscribeConfig: (() => void) | undefined;

        const getConfig = () => this.responsiveConfig?.getCurrentConfig() || {
            showOnHover: true,
            autoHide: true,
            fadeDelay: 1500
        };

        const showScrollbar = () => {
            const config = getConfig();
            if (!config.autoHide) return;

            this.scrollbarOpacity.value = 1;
            clearTimeout(hideTimeout);
            hideTimeout = window.setTimeout(() => {
                if (this.isDragging.value === 0) {
                    this.scrollbarOpacity.value = 0;
                }
            }, config.fadeDelay);
        };

        const hideScrollbar = () => {
            const config = getConfig();
            if (!config.autoHide) return;

            if (this.isDragging.value === 0) {
                hideTimeout = window.setTimeout(() => {
                    this.scrollbarOpacity.value = 0;
                }, config.fadeDelay);
            }
        };

        const setupEvents = () => {
            const config = getConfig();

            // Always show on scroll
            addEvent(this.content, "scroll", showScrollbar, { passive: true });

            if (config.showOnHover) {
                addEvent(this.scrollbar, "mouseenter", showScrollbar);
                addEvent(this.scrollbar, "mouseleave", hideScrollbar);
            }

            addEvent(this.scrollbar, "focus", showScrollbar);

            // Initial visibility
            this.scrollbarOpacity.value = config.autoHide ? 0 : 1;
        };

        // Listen to responsive config changes
        unsubscribeConfig = subscribe(this.responsiveConfig.currentConfig, () => {
            // Re-setup events when config changes
            setupEvents();
        });

        setupEvents();

        // Store cleanup function
        this._unsubscribeAutoHide = () => {
            unsubscribeConfig?.();
            clearTimeout(hideTimeout);
            removeEvents(this.content, ["scroll"]);
            removeEvents(this.scrollbar, ["mouseenter", "mouseleave", "focus"]);
        };
    }

    private setupAccessibility() {
        const axis = this.content.scrollWidth > this.content.clientWidth ? 0 : 1; // 0 = horizontal, 1 = vertical
        const orientation = axis === 0 ? "horizontal" : "vertical";

        // Ensure content has an ID for ARIA references
        if (!this.content.id) {
            this.content.id = `scrollable-content-${Math.random().toString(36).substr(2, 9)}`;
        }

        // Add comprehensive ARIA attributes
        this.scrollbar.setAttribute("role", "scrollbar");
        this.scrollbar.setAttribute("aria-controls", this.content.id);
        this.scrollbar.setAttribute("aria-orientation", orientation);
        this.scrollbar.setAttribute("tabindex", "0");
        this.scrollbar.setAttribute("aria-label", `Scroll ${orientation}`);

        // Add live region for scroll position announcements
        const liveRegion = document.createElement("div");
        liveRegion.setAttribute("aria-live", "polite");
        liveRegion.setAttribute("aria-atomic", "true");
        liveRegion.style.position = "absolute";
        liveRegion.style.left = "-10000px";
        liveRegion.style.width = "1px";
        liveRegion.style.height = "1px";
        liveRegion.style.overflow = "hidden";
        this.scrollbar.appendChild(liveRegion);

        // Update ARIA values based on scroll position
        const updateAriaValues = () => {
            const scrollInfo = this.getScrollInfo();
            if (!scrollInfo) return;

            const percentage = Math.round(scrollInfo.progress * 100);
            const maxValue = 100;
            const currentValue = percentage;

            this.scrollbar.setAttribute("aria-valuenow", currentValue.toString());
            this.scrollbar.setAttribute("aria-valuemin", "0");
            this.scrollbar.setAttribute("aria-valuemax", maxValue.toString());

            // Update live region for screen readers
            liveRegion.textContent = `Scrolled ${percentage}% ${orientation}`;

            // Update scrollbar description
            this.scrollbar.setAttribute("aria-valuetext", `${percentage}% scrolled`);
        };

        // Initial update
        updateAriaValues();

        // Subscribe to scroll changes
        const unsubscribe = subscribe(this.enhancedTimeline?.["progress"] || numberRef(0), updateAriaValues);
        addEvent(this.content, "scroll", updateAriaValues, { passive: true });

        // Enhanced keyboard navigation with better step sizes and feedback
        addEvent(this.scrollbar, "keydown", (e: KeyboardEvent) => {
            let step = 50; // pixels to scroll
            let action = "";

            switch (e.key) {
                case "ArrowUp":
                    if (orientation === "vertical") {
                        e.preventDefault();
                        action = "scroll up";
                        this.content.scrollBy({ top: -step, behavior: "smooth" });
                    }
                    break;
                case "ArrowDown":
                    if (orientation === "vertical") {
                        e.preventDefault();
                        action = "scroll down";
                        this.content.scrollBy({ top: step, behavior: "smooth" });
                    }
                    break;
                case "ArrowLeft":
                    if (orientation === "horizontal") {
                        e.preventDefault();
                        action = "scroll left";
                        this.content.scrollBy({ left: -step, behavior: "smooth" });
                    }
                    break;
                case "ArrowRight":
                    if (orientation === "horizontal") {
                        e.preventDefault();
                        action = "scroll right";
                        this.content.scrollBy({ left: step, behavior: "smooth" });
                    }
                    break;
                case "PageUp":
                    e.preventDefault();
                    step = this.content.clientHeight;
                    action = `page up (${step}px)`;
                    this.content.scrollBy({ top: -step, behavior: "smooth" });
                    break;
                case "PageDown":
                    e.preventDefault();
                    step = this.content.clientHeight;
                    action = `page down (${step}px)`;
                    this.content.scrollBy({ top: step, behavior: "smooth" });
                    break;
                case "Home":
                    e.preventDefault();
                    action = "scroll to top";
                    this.content.scrollTo({ top: 0, behavior: "smooth" });
                    break;
                case "End":
                    e.preventDefault();
                    action = "scroll to bottom";
                    this.content.scrollTo({ top: this.content.scrollHeight, behavior: "smooth" });
                    break;
                default:
                    return; // Don't announce anything for unhandled keys
            }

            // Provide immediate feedback for screen readers
            if (action) {
                liveRegion.textContent = action;
                // Clear after a short delay
                setTimeout(() => {
                    liveRegion.textContent = "";
                }, 1000);
            }
        });

        // Focus management
        addEvent(this.scrollbar, "focus", () => {
            this.scrollbar.setAttribute("aria-expanded", "true");
            // Ensure scrollbar is visible when focused
            this.scrollbarOpacity.value = 1;
        });

        addEvent(this.scrollbar, "blur", () => {
            this.scrollbar.setAttribute("aria-expanded", "false");
        });

        // Store cleanup function
        this._unsubscribeAccessibility = () => {
            unsubscribe?.();
            removeEvent(this.content, "scroll", updateAriaValues);
            removeEvent(this.scrollbar, "keydown", () => {});
            removeEvent(this.scrollbar, "focus", () => {});
            removeEvent(this.scrollbar, "blur", () => {});
        };
    }

    private initializeTheming() {
        // Initialize theme manager with default theme
        this.themeManager = new ScrollbarThemeManager(this.scrollbar);
    }

    // Public theming API
    setTheme(theme: ScrollbarTheme | keyof typeof import("./ScrollbarTheme").scrollbarThemes) {
        this.themeManager?.setTheme(theme);
        return this;
    }

    updateTheme(updates: Partial<ScrollbarTheme>) {
        this.themeManager?.updateTheme(updates);
        return this;
    }

    getTheme(): ScrollbarTheme | undefined {
        return this.themeManager?.getCurrentTheme();
    }

    // Public API for external control
    scrollTo(progress: number, smooth = true) {
        this.enhancedTimeline?.scrollTo(progress, smooth);
    }

    scrollBy(delta: number, smooth = true) {
        this.enhancedTimeline?.scrollBy(delta, smooth);
    }

    getScrollInfo() {
        return this.enhancedTimeline?.getScrollInfo();
    }

    destroy() {
        // Cleanup spatial anchors
        this.spatialAnchor?.forEach(anchor => {
            if (anchor && typeof anchor[Symbol.dispose] === 'function') {
                anchor[Symbol.dispose]();
            }
        });

        // Cleanup pointer anchor
        this._pointerAnchorCleanup?.();

        // Cleanup responsive config
        this.responsiveConfig?.destroy();
        this._unsubscribeAutoHide?.();

        // Cleanup gesture handler
        this.gestureHandler?.destroy();

        // Cleanup accessibility
        this._unsubscribeAccessibility?.();

        // Cleanup theme manager
        this.themeManager?.destroy();

        // Remove event listeners
        removeEvents(this.content, ["scroll"]);
        removeEvents(this.scrollbar, ["mouseenter", "mouseleave", "focus", "keydown"]);
    }
}
