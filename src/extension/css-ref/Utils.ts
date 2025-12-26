import { numberRef } from "fest/object";
import { CSSBinder, CSSUnitConverter, CSSTransform, CSSCalc } from "fest/lure";

// generate only random letters, NOT numbers
export const generateAnchorId = () => {
    const randLetters = Math.random().toString(36).substring(2, 15).replace(/[0-9]/g, '');
    return ("--" + randLetters);
}

//
export const getComputedZIndex = (element: HTMLElement): number => {
    if (element?.computedStyleMap) {
        return Number(element.computedStyleMap().get("z-index")?.toString() || 0) || 0;
    } else {
        return Number(getComputedStyle((element as any)?.element ?? element).getPropertyValue("z-index") || 0) || 0;
    }
}

//
export const getExistsZIndex = (element: HTMLElement): number => {
    if (!element) { return 0; }
    if ((element as any)?.attributeStyleMap && (element as any).attributeStyleMap.get("z-index") != null) { return Number((element as any).attributeStyleMap.get("z-index")?.value ?? 0) || 0; }
    if ((element as any)?.style && "zIndex" in (element as any).style && (element as any).style.zIndex != null) { return Number((element as any).style.zIndex || 0) || 0; }
    return getComputedZIndex(element);
}

// Enhanced CSS utilities that work with reactive math

// Reactive CSS value parser with unit conversion
export class ReactiveCSSValue {
    private value: ReturnType<typeof numberRef>;
    private unit: string;

    constructor(initialValue: string | number, unit: string = 'px') {
        const parsed = typeof initialValue === 'string'
            ? CSSUnitConverter.parseValue(initialValue)
            : { value: initialValue, unit };

        this.value = numberRef(parsed.value);
        this.unit = parsed.unit;
    }

    // Get reactive CSS string
    get cssValue(): ReturnType<typeof numberRef> {
        return CSSBinder.bindWithUnit({} as HTMLElement, '', this.value, this.unit);
    }

    // Convert to different unit reactively
    toUnit(targetUnit: string): ReturnType<typeof numberRef> {
        return CSSCalc.multiply(this.value, numberRef(1)); // Placeholder for unit conversion
    }

    // Bind to element property
    bindTo(element: HTMLElement, property: string): () => void {
        return CSSBinder.bindWithUnit(element, property, this.value, this.unit);
    }
}

// Reactive transform builder
export class ReactiveTransform {
    private transforms: ReturnType<typeof numberRef>[] = [];

    translate(x: number | ReturnType<typeof numberRef>, y: number | ReturnType<typeof numberRef>): this {
        const vector = typeof x === 'number' && typeof y === 'number'
            ? { x: numberRef(x), y: numberRef(y) }
            : { x: typeof x === 'number' ? numberRef(x) : x,
                y: typeof y === 'number' ? numberRef(y) : y };
        this.transforms.push(CSSTransform.translate2D(vector as any));
        return this;
    }

    scale(x: number | ReturnType<typeof numberRef>, y?: number | ReturnType<typeof numberRef>): this {
        const scaleX = typeof x === 'number' ? numberRef(x) : x;
        const scaleY = y !== undefined ? (typeof y === 'number' ? numberRef(y) : y) : scaleX;
        this.transforms.push(CSSTransform.scale2D({ x: scaleX, y: scaleY } as any));
        return this;
    }

    rotate(angle: number | ReturnType<typeof numberRef>): this {
        const angleRef = typeof angle === 'number' ? numberRef(angle) : angle;
        this.transforms.push(CSSTransform.rotate(angleRef));
        return this;
    }

    // Get combined transform string
    get value(): ReturnType<typeof numberRef> {
        return CSSTransform.combine(this.transforms);
    }

    // Bind to element
    bindTo(element: HTMLElement): () => void {
        return CSSBinder.bindTransform(element, { x: numberRef(0), y: numberRef(0) } as any);
        // Note: This is a simplified binding - in practice you'd need to track all transform components
    }
}

// Reactive CSS animation helper
export class ReactiveAnimation {
    private element: HTMLElement;
    private properties: Map<string, ReturnType<typeof numberRef>>;
    private duration: number;
    private easing: string;

    constructor(element: HTMLElement, duration: number = 1000, easing: string = 'ease-out') {
        this.element = element;
        this.properties = new Map();
        this.duration = duration;
        this.easing = easing;
    }

    // Animate CSS property
    animateProperty(property: string, from: number, to: number): this {
        const value = numberRef(from);
        this.properties.set(property, value);

        // Bind to element
        CSSBinder.bindWithUnit(this.element, property, value);

        // Start animation
        this.animateValue(value, from, to);
        return this;
    }

    private animateValue(ref: ReturnType<typeof numberRef>, from: number, to: number): void {
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / this.duration, 1);

            // Apply easing
            const easedProgress = this.applyEasing(progress);
            ref.value = from + (to - from) * easedProgress;

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    private applyEasing(t: number): number {
        // Simple easing implementation
        switch (this.easing) {
            case 'ease-out':
                return 1 - Math.pow(1 - t, 3);
            case 'ease-in':
                return t * t * t;
            case 'ease-in-out':
                return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
            default:
                return t;
        }
    }
}

// Reactive CSS media query helper
export class ReactiveMediaQuery {
    private query: string;
    private matches: ReturnType<typeof numberRef>;

    constructor(query: string) {
        this.query = query;
        this.matches = numberRef(0);

        const mediaQuery = window?.matchMedia(query);
        this.matches.value = mediaQuery.matches ? 1 : 0;

        mediaQuery?.addEventListener('change', (e) => {
            this.matches.value = e.matches ? 1 : 0;
        });
    }

    get reactiveMatches(): ReturnType<typeof numberRef> {
        return this.matches;
    }

    // Get reactive value based on media query
    valueIfMatches<T>(ifTrue: T, ifFalse: T): T {
        // This would need a computed value that switches based on matches
        return this.matches.value ? ifTrue : ifFalse;
    }
}

// Reactive viewport dimensions
export class ReactiveViewport {
    static width: ReturnType<typeof numberRef> = numberRef(window?.innerWidth);
    static height: ReturnType<typeof numberRef> = numberRef(window?.innerHeight);

    static init(): void {
        const updateSize = () => {
            this.width.value = window?.innerWidth;
            this.height.value = window?.innerHeight;
        };

        window?.addEventListener('resize', updateSize);
    }

    // Get reactive viewport center
    static center(): { x: ReturnType<typeof numberRef>, y: ReturnType<typeof numberRef> } {
        return {
            x: CSSCalc.divide(this.width, numberRef(2)),
            y: CSSCalc.divide(this.height, numberRef(2))
        };
    }
}

// Initialize viewport tracking
ReactiveViewport.init();

// Reactive element dimensions
export class ReactiveElementSize {
    private element: HTMLElement;
    private size: { width: ReturnType<typeof numberRef>, height: ReturnType<typeof numberRef> };
    private observer: ResizeObserver;

    constructor(element: HTMLElement) {
        this.element = element;
        this.size = {
            width: numberRef(element.offsetWidth),
            height: numberRef(element.offsetHeight)
        };

        this.observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                if (entry.target === element) {
                    this.size.width.value = entry.contentRect.width;
                    this.size.height.value = entry.contentRect.height;
                }
            }
        });

        this.observer.observe(element);
    }

    get width(): ReturnType<typeof numberRef> { return this.size.width; }
    get height(): ReturnType<typeof numberRef> { return this.size.height; }

    // Get reactive center point
    center(): { x: ReturnType<typeof numberRef>, y: ReturnType<typeof numberRef> } {
        return {
            x: CSSCalc.divide(this.size.width, numberRef(2)),
            y: CSSCalc.divide(this.size.height, numberRef(2))
        };
    }

    destroy(): void {
        this.observer.disconnect();
    }
}

// Reactive scroll position
export class ReactiveScroll {
    private element: HTMLElement;
    private scrollLeft: ReturnType<typeof numberRef>;
    private scrollTop: ReturnType<typeof numberRef>;

    constructor(element: HTMLElement = document.documentElement) {
        this.element = element;
        this.scrollLeft = numberRef(element.scrollLeft);
        this.scrollTop = numberRef(element.scrollTop);

        element.addEventListener('scroll', () => {
            this.scrollLeft.value = element.scrollLeft;
            this.scrollTop.value = element.scrollTop;
        });
    }

    get left(): ReturnType<typeof numberRef> { return this.scrollLeft; }
    get top(): ReturnType<typeof numberRef> { return this.scrollTop; }

    // Get reactive scroll progress (0-1)
    progress(axis: 'x' | 'y' = 'y'): ReturnType<typeof numberRef> {
        const scrollSize = axis === 'x'
            ? this.element.scrollWidth - this.element.clientWidth
            : this.element.scrollHeight - this.element.clientHeight;

        const scrollPos = axis === 'x' ? this.scrollLeft : this.scrollTop;

        return CSSCalc.divide(scrollPos, numberRef(Math.max(scrollSize, 1)));
    }
}
