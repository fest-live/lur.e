import { toRef, type keyType } from "fest/core";
import { deref, computed, affected, $affected } from "fest/object";
import { getPadding } from "fest/dom";
import { scrollRef, sizeRef } from "fest/lure";
import { makeAnchorElement } from "./CSSAnchor";

//
export const $extract = Symbol.for("__extract");
export const $element = Symbol.for("__element");

//
export const timelineHandler = {
    [Symbol.for("__extract")](target) {
        return target.source;
    },
    get(target, prop, receiver) {
        if (prop in target)  { return Reflect.get(target, prop, receiver ?? target); }
        if (prop == "value") { return (target?.currentTime ?? 0) / (target?.duration ?? 1); }

        // @ts-ignore
        if (prop == $affected && (target instanceof ScrollTimeline || target instanceof ViewTimeline)) {
            return (cb: (value: any, prop: keyType) => void, prop?: keyType | null) => {
                const $cb = ()=> { queueMicrotask(()=> cb((target?.currentTime ?? 0) / (target?.duration ?? 1), "value")); }

                // @ts-ignore
                if (target instanceof ScrollTimeline) {
                    target?.source?.addEventListener?.("scroll", $cb);
                    const $observer = new ResizeObserver((entries)=>entries.forEach((entry)=>$cb?.()));
                    $observer.observe(target?.source, { box: "content-box" }); target?.source?.addEventListener?.("scroll", $cb);
                    return ()=>{ $observer.disconnect(); target?.source?.removeEventListener?.("scroll", $cb); }
                } else // @ts-ignore
                if (target instanceof ViewTimeline) {
                    const $observer = new IntersectionObserver((entries)=>entries.forEach((entry)=>$cb?.()), target?.observerOptions ?? { root: target?.source?.offsetParent ?? document.documentElement, rootMargin: "0px", threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0] });
                    $observer.observe(target?.source); target?.source?.addEventListener?.("scroll", $cb);
                    return ()=>{ $observer.disconnect(); target?.source?.removeEventListener?.("scroll", $cb); }
                }
            }
        }
        if (prop == $extract) { return target; }
        if (prop == $element || prop == "element") { return target.source?.element ?? target.source; }
        return Reflect.get(target.source, prop, receiver ?? target.source);
    },
    set(target, prop, value, receiver) {
        if (prop in target) {
            Reflect.set(target, prop, value, receiver ?? target);
        } else
        if (target.source) {
            // @ts-ignore
            Reflect.set(target.source, prop, value, receiver ?? target.source);
        }
        return true;
    },
    has(target, prop) {
        return Reflect.has(target, prop) || Reflect.has(target.source, prop);
    },
    deleteProperty(target, prop) {
        if (prop in target) {
            return Reflect.deleteProperty(target, prop);
        } else
        if (target.source) {
            // @ts-ignore
            return Reflect.deleteProperty(target.source, prop);
        }
        return true;
    },
    ownKeys(target) {
        return [...Reflect.ownKeys(target), ...Reflect.ownKeys(target.source)];
    },
    getOwnPropertyDescriptor(target, prop) {
        return { ...Reflect.getOwnPropertyDescriptor(target, prop), ...Reflect.getOwnPropertyDescriptor(target.source, prop) };
    },
    getPrototypeOf(target) {
        return Reflect.getPrototypeOf(target);
    },
    setPrototypeOf(target, proto) {
        return Reflect.setPrototypeOf(target, proto);
    },
    isExtensible(target) {
        return Reflect.isExtensible(target);
    },
    preventExtensions(target) {
        return Reflect.preventExtensions(target);
    }
}

//
export const $makeScrollTimeline = (source: HTMLElement & {element?: HTMLElement}, axis: "inline" | "block") => {
    // @ts-ignore
    return new Proxy(new ScrollTimeline({ source: source?.element ?? source, axis }), timelineHandler);
}

//
export const $makeViewTimeline = (source: HTMLElement & {element?: HTMLElement}, axis: "inline" | "block") => {
    // @ts-ignore
    return new Proxy(new ViewTimeline({ source: source?.element ?? source, axis }), timelineHandler);
};

// Enhanced timeline with anchor positioning and container query support
export class EnhancedScrollTimeline {
    source: HTMLElement & {element?: HTMLElement};
    axis: "inline" | "block";
    timeline: any;
    anchor?: any;

    //
    constructor(sourceOrOptions: HTMLElement & {element?: HTMLElement} | { source: HTMLElement & {element?: HTMLElement}, axis: "inline" | "block" }, $options?: {
        useAnchor?: boolean;
        anchorElement?: HTMLElement;
    } | ("inline" | "block")) {
        let options: any = !(sourceOrOptions instanceof HTMLElement) ? sourceOrOptions : {};

        //
        if (sourceOrOptions instanceof HTMLElement) {
            this.source = sourceOrOptions;
            this.axis = typeof $options == "string" ? $options as "inline" | "block" : "inline";
        } else {
            this.source = options?.source;
            this.axis = options?.axis ?? "inline";
            this.anchor = options?.anchorElement;
        }

        // @ts-ignore
        this.timeline = $makeScrollTimeline(this.source, this.axis);

        // Import CSSAnchor dynamically to avoid circular dependencies
        if (!(typeof $options == "string") && $options?.useAnchor && !this.anchor) {
            this.anchor = makeAnchorElement(this.source);
        }
    }

    //
    get [$extract]() {
        return this.timeline?.source ?? this.source;
    }

    //
    get [$affected]() {
        return (cb: (value: any, prop: keyType) => void, prop?: keyType | null) => {
            const $cb = ()=> { queueMicrotask(()=> cb((this.timeline?.currentTime ?? 0) / (this.timeline?.duration ?? 1), "value")); }
            this.timeline?.addEventListener?.("scroll", $cb);
            return ()=> this.timeline?.removeEventListener?.("scroll", $cb);
        }
    }

    //
    get element() {
        const $src = this.timeline?.source ?? this.source;
        return $src?.element ?? $src;
    }

    //
    get value() {
        return this.progress;
    }

    //
    get currentTime() {
        return this.timeline?.currentTime ?? 0;
    }

    //
    get duration() {
        return this.timeline?.duration ?? 1;
    }

    // Get current scroll progress as reactive value (0-1)
    get progress() {
        try {
            const maxScroll = this.source[['scrollWidth', 'scrollHeight'][this.axis === 'inline' ? 0 : 1]] -
                             this.source[['clientWidth', 'clientHeight'][this.axis === 'inline' ? 0 : 1]];
            const currentScroll = this.source[['scrollLeft', 'scrollTop'][this.axis === 'inline' ? 0 : 1]];
            return maxScroll > 0 ? currentScroll / maxScroll : 0;
        } catch {
            return 0;
        }
    }

    // Scroll to specific progress (0-1)
    scrollTo(progress: number, smooth = true) {
        const maxScroll = this.source[['scrollWidth', 'scrollHeight'][this.axis === 'inline' ? 0 : 1]] -
                         this.source[['clientWidth', 'clientHeight'][this.axis === 'inline' ? 0 : 1]];
        const scrollPos = Math.max(0, Math.min(1, progress)) * maxScroll;

        this.source.scrollTo({
            [['left', 'top'][this.axis === 'inline' ? 0 : 1]]: scrollPos,
            behavior: smooth ? 'smooth' : 'instant'
        });
    }

    // Scroll by relative amount
    scrollBy(delta: number, smooth = true) {
        this.source.scrollBy({
            [['left', 'top'][this.axis === 'inline' ? 0 : 1]]: delta,
            behavior: smooth ? 'smooth' : 'instant'
        });
    }

    // Get scrollable area info
    getScrollInfo() {
        const axisIdx = this.axis === 'inline' ? 0 : 1;
        return {
            scrollSize: this.source[['scrollWidth', 'scrollHeight'][axisIdx]],
            clientSize: this.source[['clientWidth', 'clientHeight'][axisIdx]],
            scrollPos: this.source[['scrollLeft', 'scrollTop'][axisIdx]],
            maxScroll: this.source[['scrollWidth', 'scrollHeight'][axisIdx]] - this.source[['clientWidth', 'clientHeight'][axisIdx]],
            progress: this.progress
        };
    }
}

// Enhanced ViewTimeline with intersection awareness
export class EnhancedViewTimeline {
    source: HTMLElement & {element?: HTMLElement};
    axis: "inline" | "block";
    timeline: any;
    intersectionObserver?: IntersectionObserver;
    threshold?: number[];
    root?: HTMLElement;
    rootMargin?: string;
    observerOptions?: IntersectionObserverInit;

    //
    constructor(sourceOrOptions: HTMLElement & {element?: HTMLElement} | { source: HTMLElement & {element?: HTMLElement}, axis: "inline" | "block" }, $options?: {
        root?: HTMLElement;
        rootMargin?: string;
        threshold?: number[];
    } | ("inline" | "block")) {
        let options: any = !(sourceOrOptions instanceof HTMLElement) ? sourceOrOptions : {};

        //
        if (sourceOrOptions instanceof HTMLElement) {
            this.source = sourceOrOptions as HTMLElement & {element?: HTMLElement};
            this.axis = typeof $options == "string" ? $options as "inline" | "block" : "inline";
        } else {
            this.source = options?.source as HTMLElement & {element?: HTMLElement};
            this.axis = options?.axis ?? "inline";
            this.threshold = options?.threshold || [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];
            this.root = options?.root;
            this.rootMargin = options?.rootMargin || '0px';
            this.observerOptions = options ?? {
                root: this.root,
                rootMargin: this.rootMargin,
                threshold: this.threshold
            };
        }

        // @ts-ignore
        this.timeline = $makeViewTimeline(this.source, this.axis);
    }

    //
    get [$extract]() {
        return this.timeline?.source ?? this.source;
    }

    //
    get element() {
        const $src = this.timeline?.source ?? this.source;
        return $src?.element ?? $src;
    }

    //
    get value() {
        return (this.timeline?.currentTime ?? 0) / (this.timeline?.duration ?? 1);
    }

    //
    get currentTime() {
        return this.timeline?.currentTime ?? 0;
    }

    //
    get duration() {
        return this.timeline?.duration ?? 1;
    }

    //
    get [$affected]() {
        return (cb: (value: any, prop: keyType) => void, prop?: keyType | null) => {
            const $cb = ()=> { queueMicrotask(()=> cb((this.timeline?.currentTime ?? 0) / (this.timeline?.duration ?? 1), "value")); }
            const $observer = new IntersectionObserver((entries)=>entries.forEach((entry)=>$cb?.()));
            $observer.observe(this.source);
            return ()=> $observer.disconnect();
        }
    }

    private setupIntersectionObserver() {
        this.intersectionObserver = new IntersectionObserver((entries)=>this.handleIntersection(entries));
        this.intersectionObserver.observe(this.source);
    }

    private handleIntersection(entries: IntersectionObserverEntry[]) {
        for (const entry of entries) {
            // Custom intersection handling logic
            const ratio = entry.intersectionRatio;
            const rect = entry.boundingClientRect;

            // Update timeline progress based on intersection
            if (this.axis === 'block') {
                // Vertical intersection
                const progress = rect.top < 0 ?
                    Math.abs(rect.top) / (rect.height + globalThis.innerHeight) :
                    1 - (rect.bottom / (rect.height + globalThis.innerHeight));
                this.updateProgress(Math.max(0, Math.min(1, progress)));
            } else {
                // Horizontal intersection
                const progress = rect.left < 0 ?
                    Math.abs(rect.left) / (rect.width + globalThis.innerWidth) :
                    1 - (rect.right / (rect.width + globalThis.innerWidth));
                this.updateProgress(Math.max(0, Math.min(1, progress)));
            }
        }
    }

    private updateProgress(progress: number) {
        // Update timeline progress (implementation depends on browser support)
        if (this.timeline && 'currentTime' in this.timeline) {
            try {
                // @ts-ignore
                this.timeline.currentTime = progress * 100; // CSS progress is 0-100
            } catch (e) {
                // Fallback for browsers without currentTime support
                console.warn('Timeline currentTime not supported:', e);
            }
        }
    }

    destroy() {
        this.timeline?.disconnect();
    }
}

//
export const makeScrollTimeline = (source: HTMLElement & {element?: HTMLElement}, axis: "inline" | "block") => {
    // @ts-ignore
    if (typeof ScrollTimeline != "undefined") {
        return new EnhancedScrollTimeline({ source: source?.element ?? source, axis: axis as "inline" | "block" });
    }

    //
    const target   = toRef(source);
    const scroll   = scrollRef(source, (["inline", "block"] as ["inline", "block"])[axis]);
    const content  = computed(sizeRef(source, (["inline", "block"] as ["inline", "block"])[axis], "content-box"), (v)=>(v + getPadding(source, (["inline", "block"] as ["inline", "block"])[axis])));
    const percent  = computed (scroll, (vl)=> ((vl || 0) / ((deref(target)?.[['scrollWidth', 'scrollHeight'][axis]] - content?.value) || 1)));
    affected(content, (vl: any) => ((scroll?.value || 0) / ((deref(target)?.[['scrollWidth', 'scrollHeight'][axis]] - vl) || 1)));
    return percent;
}
