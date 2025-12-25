//
export const $extract = Symbol.for("__extract");
export const $element = Symbol.for("__element");

//
export const timelineHandler = {
    [Symbol.for("__extract")](target) {
        return target.source;
    },
    get(target, prop, receiver) {
        if (prop in target) {
            return target[prop];
        }
        if (prop == $extract) { return target; }
        if (prop == $element || prop == "element") { return target.source?.element ?? target.source; }
        return target.source?.[prop];
    },
    set(target, prop, value, receiver) {
        if (prop in target) {
            target[prop] = value;
        } else
        if (target.source) {
            // @ts-ignore
            target.source[prop] = value;
        }
        return true;
    },
    has(target, prop) {
        return prop in target || prop in target.source;
    },
    deleteProperty(target, prop) {
        if (prop in target) {
            return delete target[prop];
        } else
        if (target.source) {
            // @ts-ignore
            return delete target.source[prop];
        }
        return true;
    },
    ownKeys(target) {
        return [...Object.keys(target), ...Object.keys(target.source)];
    },
    getOwnPropertyDescriptor(target, prop) {
        return { ...Object.getOwnPropertyDescriptor(target, prop), ...Object.getOwnPropertyDescriptor(target.source, prop) };
    },
    getPrototypeOf(target) {
        return Object.getPrototypeOf(target);
    },
    setPrototypeOf(target, proto) {
        return Object.setPrototypeOf(target, proto);
    },
    isExtensible(target) {
        return Object.isExtensible(target);
    },
    preventExtensions(target) {
        return Object.preventExtensions(target);
    }
}

//
export const makeScrollTimeline = (source: HTMLElement, axis: "inline" | "block") => {
    // @ts-ignore
    return new Proxy(new ScrollTimeline({ source: source?.element ?? source, axis }), timelineHandler);
}

//
export const makeViewTimeline = (source: HTMLElement, axis: "inline" | "block") => {
    // @ts-ignore
    return new Proxy(new ViewTimeline({ source: source?.element ?? source, axis }), timelineHandler);
};

// Enhanced timeline with anchor positioning and container query support
export class EnhancedScrollTimeline {
    source: HTMLElement;
    axis: "inline" | "block";
    timeline: any;
    anchor?: any;

    constructor(source: HTMLElement, axis: "inline" | "block", options?: {
        useAnchor?: boolean;
        anchorElement?: HTMLElement;
    }) {
        this.source = source;
        this.axis = axis;

        // @ts-ignore
        this.timeline = makeScrollTimeline(source, axis);

        if (options?.useAnchor) {
            // Import CSSAnchor dynamically to avoid circular dependencies
            import("./CSSAnchor").then(({ makeAnchorElement }) => {
                this.anchor = makeAnchorElement(options.anchorElement || source);
            });
        }
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
    source: HTMLElement;
    axis: "inline" | "block";
    timeline: any;
    intersectionObserver?: IntersectionObserver;

    constructor(source: HTMLElement, axis: "inline" | "block", options?: {
        root?: HTMLElement;
        rootMargin?: string;
        threshold?: number[];
    }) {
        this.source = source;
        this.axis = axis;

        // @ts-ignore
        this.timeline = makeViewTimeline(source, axis);

        //
        if (options) { this.setupIntersectionObserver(options); }
    }

    private setupIntersectionObserver(options: {
        root?: HTMLElement;
        rootMargin?: string;
        threshold?: number[];
    }) {
        this.intersectionObserver = new IntersectionObserver(
            (entries) => {
                // Enhanced intersection handling
                entries.forEach(entry => {
                    this.handleIntersection(entry);
                });
            },
            {
                root: options.root,
                rootMargin: options.rootMargin || '0px',
                threshold: options.threshold || [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
            }
        );

        this.intersectionObserver.observe(this.source);
    }

    private handleIntersection(entry: IntersectionObserverEntry) {
        // Custom intersection handling logic
        const ratio = entry.intersectionRatio;
        const rect = entry.boundingClientRect;

        // Update timeline progress based on intersection
        if (this.axis === 'block') {
            // Vertical intersection
            const progress = rect.top < 0 ?
                Math.abs(rect.top) / (rect.height + window.innerHeight) :
                1 - (rect.bottom / (rect.height + window.innerHeight));
            this.updateProgress(Math.max(0, Math.min(1, progress)));
        } else {
            // Horizontal intersection
            const progress = rect.left < 0 ?
                Math.abs(rect.left) / (rect.width + window.innerWidth) :
                1 - (rect.right / (rect.width + window.innerWidth));
            this.updateProgress(Math.max(0, Math.min(1, progress)));
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
        this.intersectionObserver?.disconnect();
    }
}
