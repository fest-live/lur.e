// animation.ts
import {  } from "@fest-lib/dom";
import { S, StyleBinding, isReactiveStyleValue, isNativeCSSStyleValue } from "./Styles";
import { bindWith } from "../core/Binding";


// animatable.ts — расширение
export interface ScrollDrivenOptions {
    kind: "scroll";
    /**
     * Источник скролла:
     * - "nearest" (default) — ближайший скроллируемый предок
     * - "root" — документ
     * - "self" — сам элемент
     * - Element | { value: Element } — конкретный скроллер (в т.ч. реактивный)
     */
    source?: "nearest" | "root" | "self" | Element | { value: any };
    axis?: "block" | "inline" | "x" | "y";
    /** animation-range: "0%" / "100px" / "contain 0%" и т.п. */
    rangeStart?: string;
    rangeEnd?: string;
}

export interface ViewDrivenOptions {
    kind: "view";
    /** Отслеживаемый subject; по умолчанию сам элемент. */
    subject?: Element | { value: any };
    axis?: "block" | "inline" | "x" | "y";
    inset?: string;
    /** "entry 0%", "cover 50%", "exit 100%"... */
    rangeStart?: string;
    rangeEnd?: string;
}  // <-- новое

// шорткаты, чтобы не писать kind руками
export const onScroll = (o: Omit<ScrollDrivenOptions, "kind"> = {}): ScrollDrivenOptions =>
    ({ kind: "scroll", ...o });

export const onView = (o: Omit<ViewDrivenOptions, "kind"> = {}): ViewDrivenOptions =>
    ({ kind: "view", ...o });

const isScrollDriven = (t: any): t is ScrollDrivenOptions =>
    t != null && typeof t === "object" && t.kind === "scroll";

const isViewDriven = (t: any): t is ViewDrivenOptions =>
    t != null && typeof t === "object" && t.kind === "view";


type Cleanup = () => void;

/**
 * Timing function for animation steps.
 * Can be a CSS easing string or a custom easing function.
 */
type TimingFunction = string | ((progress: number) => number);

/**
 * Animation configuration for a single property.
 */
interface PropertyAnimation {
    /** Property name (camelCase or kebab-case) */
    property: string;
    /** Array of keyframe values */
    values: any[];
    /** Optional offset percentages (0.0 to 1.0). If omitted, evenly distributed. */
    offsets?: number[];
    /** Timing function per segment or global */
    easing?: TimingFunction | TimingFunction[];
    /** */
    timeline?: AnimationTimeline;
    /** */
    composite?: "replace" | "add" | "accumulate";
}

/**
 * Main animation options.
 */
interface AnimationOptions {
    keyframes?: AnimationKeyframes;
    /** */
    properties: Record<string, any>[] | string,
    /** */
    offsets?: number[],
    /** Duration in milliseconds or CSS time string */
    duration?: number | string;
    /** Delay before animation starts */
    delay?: number | string;
    /** Iteration count (-1 for infinite) */
    iterationCount?: number;
    /** Fill mode: 'none' | 'forwards' | 'backwards' | 'both' */
    fillMode?: FillMode;
    /** Direction: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse' */
    direction?: PlaybackDirection;
    /** Global easing (overridden by property-specific easing) */
    easing?: TimingFunction;
    /** */
    composite?: "replace" | "add" | "accumulate";
    /**  */
    timeline?: AnimationTimeline;
}

/*
{
    offsets?: number[],
    properties: Record<string, any[]> | string;
    duration?: number | string;
    delay?: number | string;
    iterationCount?: number;
    fillMode?: FillMode;
    direction?: PlaybackDirection;
    easing?: TimingFunction;
    composite?: "replace" | "add" | "accumulate";
}
*/

/*
{
    keyframes: AnimationKeyframes;
    duration?: number | string;
    delay?: number | string;
    iterationCount?: number;
    fillMode?: FillMode;
    direction?: PlaybackDirection;
    easing?: TimingFunction;
    composite?: "replace" | "add" | "accumulate";
    timeline?: AnimationTimeline;
}
*/

/**
 * Keyframe configuration from A template literal.
 */
interface AnimationKeyframes {
    properties: Map<string, PropertyAnimation>;
    offsets?: number[];
    timing?: TimingFunction[];
}

type FillMode = "none" | "forwards" | "backwards" | "both";
type PlaybackDirection = "normal" | "reverse" | "alternate" | "alternate-reverse";

//
let animationTemplateId = 0;

/**
 * Parse CSS time value to milliseconds.
 */
const parseTime = (v: number | string | undefined, fallback = 0): number => {
    if (typeof v === "number") return v;
    if (!v) return fallback;
    const t = String(v).trim();
    if (t.endsWith("ms")) return parseFloat(t);
    if (t.endsWith("s")) return parseFloat(t) * 1000;
    return parseFloat(t) || fallback;
};

/**
 * Normalize iteration count.
 */
const normalizeIterationCount = (count?: number): number | "Infinity" => {
    if (count === undefined) return 1;
    if (count === -1 || count === Infinity) return Infinity;
    return Math.max(1, Math.floor(count));
};

/**
 * Convert camelCase to kebab-case.
 */
const camelToKebab = (str: string): string => {
    return str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
};


//
const parsePropertyList = (options: AnimationOptions)=>{
    const fromString: (Record<string, string> | Keyframe)[] = [];
    if (typeof options.properties == "string") {
        const props: string[] = options.properties?.trim?.()?.split?.(";");
        fromString.push(...(Array.from(props || [])?.map?.(($pair: string)=>{
            if ($pair?.includes?.(":")) {
                const pair = $pair?.split?.(":") ?? [];
                const value = pair?.slice?.(1, -1)?.join?.(":");
                const property = $pair?.[0];
                return { [property?.trim?.()]: value?.trim?.() };
            }
            return null;
        })?.filter?.((a)=>a != null) || []));
    }

    //
    const propertyList: (Record<string, any> | Keyframe)[] = Array.from(Array.isArray(options.properties) ? options.properties : fromString);
    return propertyList;
}

/**
 * Parse A template literal into animation keyframes.
 * 
 * Syntax examples:
 * - `A`opacity:${[0, 0.5, 1]};`
 * - `A`transform:${[translateX(0), translateX(100px)]};`
 * - `A`background:${[CSS.rgb(255,0,0), CSS.rgb(0,0,255)]};`
 */
const parseAnimationTemplate = (strings: TemplateStringsArray, values: any[]): AnimationKeyframes => {
    const properties = new Map<string, PropertyAnimation>();
    
    // Reconstruct the full CSS-like text
    let fullText = "";
    for (let i = 0; i < strings.length; i++) {
        fullText += strings[i];
        if (i < values.length) {
            fullText += `__SLOT_${i}__`;
        }
    }
    
    // Split by semicolons to get declarations
    const declarations = fullText
        .split(";")
        .map(s => s.trim())
        .filter(Boolean);
    
    for (const declaration of declarations) {
        const colonIndex = declaration.indexOf(":"); if (colonIndex === -1) continue;
        const property = declaration.slice(0, colonIndex).trim();
        const valueText = declaration.slice(colonIndex + 1).trim();
        
        // Find slot markers
        const slotMatch = /__SLOT_(\d+)__/.exec(valueText); if (!slotMatch) continue;
        const slotIndex = parseInt(slotMatch[1], 10);
        const slotValue = values[slotIndex];
        
        // Slot value must be an array of keyframe values
        if (!Array.isArray(slotValue)) {
            throw new TypeError(
                `A\`${property}\` expects an array of values, got ${typeof slotValue}`
            );
        }
        
        properties.set(property, {
            property,
            values: slotValue,
        });
    }
    
    return { properties };
};

/**
 * Process reactive values in animation keyframes.
 * Returns both static values and reactive bindings.
 */
const processAnimationValues = (values: any[],): { 
    resolved: any[];
    hasReactive: boolean;
    reactiveIndices: number[];
} => {
    const resolved: any[] = [];
    const reactiveIndices: number[] = [];
    let hasReactive = false;
    
    for (let i = 0; i < values.length; i++) {
        const value = values[i];
        
        if (isReactiveStyleValue(value)) {
            hasReactive = true;
            reactiveIndices.push(i);
            resolved.push(value.value);
        } else if (isNativeCSSStyleValue(value)) {
            resolved.push(value);
        } else {
            resolved.push(value);
        }
    }
    
    return { resolved, hasReactive, reactiveIndices };
};


/**
 * Build Web Animations API keyframes from parsed template.
 */
const buildWebAnimationKeyframes = (options: AnimationOptions): Keyframe[] => {
    const globalOffsets = options?.offsets;
    const propertyList = parsePropertyList(options);

    if (propertyList.length === 0) {
        throw new Error("No animatable properties found in A template");
    }
    
    // Determine number of keyframes (max length across all properties)
    const maxLength = Math.max(...propertyList.map(p => p.values.length));
    
    // Generate offsets if not provided
    // @ts-ignore
    const offsets = (globalOffsets?.length > 1 ? globalOffsets : null) || Array.from({ length: maxLength }, (_, i) => i / (maxLength - 1));
    
    // Build keyframe objects
    const frames: Keyframe[] = [];
    
    for (let i = 0; i < maxLength; i++) {
        const frame: Keyframe = { offset: offsets[i] ?? i / (maxLength - 1) };
        
        for (const prop of propertyList) {
            const { resolved } = processAnimationValues(prop.values);
            const kebabProp = camelToKebab(prop.property);
            
            // Use last value if array is shorter
            const valueIndex = Math.min(i, resolved.length - 1);
            let value = resolved[valueIndex];
            
            // Convert CSSStyleValue to string for Web Animations API
            if (isNativeCSSStyleValue(value)) {
                value = String(value);
            }
            
            frame[kebabProp] = value;
        }
        
        frames.push(frame);
    }
    
    return frames;
};


export type AnimatableStyleSlot = {
    marker: string;
    value: AnimatableValue;
    multipliedByUnit?: string;
};


/**
 * Build timing configuration for Web Animations API.
 */
const buildAnimationTiming = (options: AnimationOptions): KeyframeAnimationOptions => {
    const duration = parseTime(options.duration ?? 300);
    const delay = parseTime(options.delay ?? 0);
    const iterations = normalizeIterationCount(options.iterationCount);
    
    return {
        duration,
        delay, //@ts-ignore
        composite: options.composite || "replace",
        iterations: iterations === "Infinity" ? Infinity : iterations,
        fill: options.fillMode ?? "none",
        direction: options.direction ?? "normal",
        easing: typeof options.easing === "string" 
            ? options.easing 
            : "linear",
        timeline: options.timeline
    };
};

/**
 * Create reactive animation that updates when source values change.
 */
const createReactiveAnimation = (
    element: HTMLElement,
    options: AnimationOptions,
): { animation: Animation; cleanup: Cleanup } => {
    const propertyList = parsePropertyList(options);
    const subscriptions: Cleanup[] = [];
    
    // Initial animation
    const frames = buildWebAnimationKeyframes(options);
    const timing = buildAnimationTiming(options);
    const animation = element.animate(frames, timing);
    
    // Track reactive properties
    for (const prop of propertyList) {
        const { hasReactive, reactiveIndices } = processAnimationValues(prop.values);
        
        if (!hasReactive) continue;
        
        // Subscribe to each reactive value
        for (const index of reactiveIndices) {
            const reactiveValue = prop.values[index];
            
            const subscription = bindWith(
                element,
                `--anim-${prop.property}-${index}`,
                reactiveValue,
                () => {
                    // Rebuild keyframes with updated values
                    const newFrames = buildWebAnimationKeyframes(options);
                    
                    // Update animation without restarting
                    const currentTime = animation.currentTime;
                    animation.effect = new KeyframeEffect(
                        element,
                        newFrames,
                        timing,
                    );
                    
                    if (currentTime !== null) {
                        animation.currentTime = currentTime;
                    }
                },
            );
            
            subscriptions.push(subscription as any);
        }
    }
    
    const cleanup = () => {
        animation.cancel();
        subscriptions.forEach(sub => sub());
    };
    
    return { animation, cleanup };
};

/**
 * A`` template literal for defining animations.
 * 
 * @example
 * ```ts
 * const opacity = { value: 0 };
 * 
 * A`opacity:${[0, opacity, 1]};`
 * A`transform:${[
 *   CSS.translateX(CSS.px(0)),
 *   CSS.translateX(CSS.px(100))
 * ]};`
 * ```
 */
export const A = (strings: TemplateStringsArray, ...values: any[]): AnimationKeyframes => {
    return parseAnimationTemplate(strings, values);
};

/**
 * Animate an element with the provided keyframes and options.
 * 
 * @example
 * ```ts
 * const animation = doAnimation(element, {
 *   keyframes: A`opacity:${[0, 0.5, 1]};`,
 *   duration: 1000,
 *   iterationCount: -1,
 *   fillMode: "forwards"
 * });
 * 
 * // Later: animation.pause(), animation.play(), animation.cleanup()
 * ```
 */
export const doAnimation = (element: HTMLElement, config: AnimationOptions, keyframes?: Map<string, PropertyAnimation>): { animation: Animation; cleanup: Cleanup } => {
    
    // Check if any values are reactive
    const propertyList = parsePropertyList(config);
    const hasAnyReactive = propertyList.some(prop => {
        const { hasReactive } = processAnimationValues(prop.values);
        return hasReactive;
    });
    
    if (hasAnyReactive) {
        return createReactiveAnimation(element, config);
    }
    
    // Static animation
    const frames = buildWebAnimationKeyframes(config);
    const timing = buildAnimationTiming(config);
    const animation = element.animate(frames, timing);
    
    const cleanup = () => {
        animation.cancel();
    };
    
    return { animation, cleanup };
};

/**
 * Simplified animation helper with inline configuration.
 * 
 * @example
 * ```ts
 * animate(element, {
 *   opacity: [0, 1],
 *   transform: ["translateX(0)", "translateX(100px)"]
 * }, {
 *   duration: 500,
 *   fillMode: "forwards"
 * });
 * ```
 */
export const animate = (
    element: HTMLElement,
    options: AnimationOptions,
): { animation: Animation; cleanup: Cleanup } => {
    const properties = new Map<string, PropertyAnimation>();
    
    for (const [property, values] of Object.entries(options.properties)) {
        if (!Array.isArray(values)) {
            throw new TypeError(`animate() expects arrays of values, got ${typeof values} for ${property}`);
        }
        
        properties.set(property, {
            property,
            values,
        });
    }
    
    //const keyframes: AnimationKeyframes = { properties };
    return doAnimation(element, {...options}, properties);
};

/**
 * Create a reusable animation definition.
 * 
 * @example
 * ```ts
 * const fadeIn = defineAnimation(
 *   A`opacity:${[0, 1]};`,
 *   { duration: 300, fillMode: "forwards" }
 * );
 * 
 * fadeIn(element1);
 * fadeIn(element2);
 * ```
 */
export const defineAnimation = (options: AnimationOptions) => {
    return (element: HTMLElement) => { return doAnimation(element, options); };
};

/**
 * Sequence multiple animations.
 * 
 * @example
 * ```ts
 * sequenceAnimations(element, [
 *   { keyframes: A`opacity:${[0, 1]};`, duration: 300 },
 *   { keyframes: A`transform:${[...values]};`, duration: 500 }
 * ]);
 * ```
 */
export const sequenceAnimations = async (
    element: HTMLElement,
    sequence: Array<AnimationOptions>,
): Promise<void> => {
    for (const config of sequence) {
        const { animation } = doAnimation(element, config);
        await animation.finished;
    }
};

/**
 * Run multiple animations in parallel.
 * 
 * @example
 * ```ts
 * parallelAnimations(element, [
 *   { keyframes: A`opacity:${[0, 1]};`, duration: 300 },
 *   { keyframes: A`transform:${[...values]};`, duration: 300 }
 * ]);
 * ```
 */
export const parallelAnimations = (
    element: HTMLElement,
    animations: Array<AnimationOptions>
): { animations: Animation[]; cleanup: Cleanup } => {
    const results = animations.map(config => doAnimation(element, config));
    const cleanup = () => { results.forEach(r => r.cleanup()); };
    return { animations: results.map(r => r.animation), cleanup, };
};

/**
 * Stagger animations across multiple elements.
 * 
 * @example
 * ```ts
 * staggerAnimation(
 *   elements,
 *   A`opacity:${[0, 1]};`,
 *   { duration: 300, fillMode: "forwards" },
 *   100 // 100ms delay between each
 * );
 * ```
 */
export const staggerAnimation = (
    elements: HTMLElement[],
    options?: AnimationOptions,
    staggerDelay: number = 100,
): Array<{ animation: Animation; cleanup: Cleanup }> => {
    return elements.map((element, index) => {
        const delay = parseTime(options?.delay ?? 0) + (index * staggerDelay); // @ts-ignore
        return doAnimation(element, { ...options, delay });
    });
};

// Re-export types for convenience
export type {
    AnimationOptions,
    AnimationKeyframes,
    PropertyAnimation,
    TimingFunction,
    FillMode,
    PlaybackDirection,
};

// animatable.ts
export const ANIMATABLE_BRAND = Symbol.for("fest.animatable");


export type AnimatableTrigger =
    | "mount"
    | "hover"
    | "focus"
    | "click"
    | "visible"
    | "manual"
    | { value: any }
    | ScrollDrivenOptions   // <-- новое
    | ViewDrivenOptions;  

export interface AnimatableOptions {
    duration?: number | string;
    delay?: number | string;
    endDelay?: number;
    /** Проценты 0..1 для каждого шага (как percentageSteps). */
    offsets?: number[];
    /** Общий easing или easing per-segment. */
    easing?: string | string[];
    /** -1 => Infinity */
    iterations?: number;
    direction?: PlaybackDirection;
    fill?: FillMode;
    composite?: CompositeOperation;
    trigger?: AnimatableTrigger;
    /** Для trigger:"hover"/"visible" — реверс при выходе (по умолчанию true). */
    reverseOnExit?: boolean;
    /** rootMargin/threshold для trigger:"visible". */
    intersection?: IntersectionObserverInit;
}


const normalizeIterations = (n?: number): number =>
    (n === -1 || n === Infinity) ? Infinity : Math.max(1, n ?? 1);

/** Одно "прикрепление" animatable к конкретному элементу. */
interface AnimatableAttachment {
    element: HTMLElement;
    animation: Animation | null;
    cleanup: Cleanup;
}

/**
 * Описание того, КАК слот применён в шаблоне.
 * Это решает `applyStyleTemplate`, а не сам animatable.
 */
export interface AnimatableApplyPlan {
    /**
     * "property" — слот занимает всё значение декларации
     *   (`opacity:${anim}`), анимируем CSS-свойство напрямую.
     *
     * "custom-property" — слот участвует в выражении
     *   (`translateX(${anim}px)`, `calc(${anim} * 2px)`),
     *   анимируем зарегистрированное --fest-anim-* число.
     */
    mode: "property" | "custom-property";
    /** Имя CSS-свойства ("opacity") или маркера ("--fest-anim-3-0"). */
    target: string;
    /** Приклеенная единица для сериализации значений в mode:"property". */
    unit?: string;
}

let animatableId = 0;

export class AnimatableValue {
    readonly [ANIMATABLE_BRAND] = true;
    readonly id = animatableId++;

    //
    #steps: any[];
    #options: AnimatableOptions;
    #current: any;
    #subscribers = new Set<(v: any) => void>();
    #attachments = new Set<AnimatableAttachment>();

    // внутри AnimatableValue

    #resolveElementRef(v: any, self: HTMLElement): Element {
        if (v == null || v === "self") return self;
        if (v === "root") return self.ownerDocument.scrollingElement ?? self.ownerDocument.documentElement;
        if (typeof v === "object" && "value" in v && !(v instanceof Element)) return v.value ?? self;
        return v as Element;
    }

    #findNearestScroller(el: HTMLElement): Element {
        for (let node = el.parentElement; node; node = node.parentElement) {
            const s = getComputedStyle(node);
            if (/(auto|scroll|overlay)/.test(s.overflow + s.overflowX + s.overflowY)) return node;
        }
        return el.ownerDocument.scrollingElement ?? el.ownerDocument.documentElement;
    }

    #createTimeline(element: HTMLElement, trigger: ScrollDrivenOptions | ViewDrivenOptions): AnimationTimeline | null {
        const win: any = element.ownerDocument.defaultView ?? globalThis;

        if (isScrollDriven(trigger)) {
            const ScrollTimelineCtor = win.ScrollTimeline;
            if (typeof ScrollTimelineCtor !== "function") return null;

            const source =
                trigger.source === "nearest" || trigger.source == null
                    ? this.#findNearestScroller(element)
                    : this.#resolveElementRef(trigger.source, element);

            return new ScrollTimelineCtor({ source, axis: trigger.axis ?? "block" });
        }

        const ViewTimelineCtor = win.ViewTimeline;
        if (typeof ViewTimelineCtor !== "function") return null;

        return new ViewTimelineCtor({
            subject: trigger.subject ? this.#resolveElementRef(trigger.subject, element) : element,
            axis: trigger.axis ?? "block",
            inset: trigger.inset,
        });
    }

    #startTimelineDriven(
        element: HTMLElement,
        attachment: AnimatableAttachment,
        plan: AnimatableApplyPlan,
        trigger: ScrollDrivenOptions | ViewDrivenOptions,
    ): Cleanup {
        const timeline = this.#createTimeline(element, trigger);

        if (!timeline) {
            return this.#startTimelineFallback(element, attachment, plan, trigger);
        }

        const timing = this.#buildTiming();

        /*
        * ВАЖНО: у progress-based timeline нет "секунд".
        * - duration должен быть "auto" (или проценты через range),
        *   миллисекунды здесь бессмысленны и в Chrome дают неожиданный масштаб;
        * - iterations: Infinity невалидно с scroll timeline;
        * - delay/endDelay игнорируем — их роль выполняет rangeStart/rangeEnd.
        */
        const animation = element.animate(this.#buildKeyframes(plan), {
            ...timing,
            duration: "auto" as any,
            delay: 0,
            endDelay: 0,
            iterations: 1,
            fill: this.#options.fill ?? "both",
            timeline,
        } as any);

        if (trigger.rangeStart) (animation as any).rangeStart = trigger.rangeStart;
        if (trigger.rangeEnd)   (animation as any).rangeEnd   = trigger.rangeEnd;

        attachment.animation = animation;
        return () => animation.cancel();
    }

    constructor(steps: any[], options: AnimatableOptions = {}) {
        if (!Array.isArray(steps) || steps.length < 2) {
            throw new TypeError("animatable() expects at least 2 steps");
        }
        this.#steps = steps;
        this.#options = options;
        this.#current = this.#resolveStep(steps[0]);
    }

    #startTimelineFallback(
        element: HTMLElement,
        attachment: AnimatableAttachment,
        plan: AnimatableApplyPlan,
        trigger: ScrollDrivenOptions | ViewDrivenOptions,
    ): Cleanup {
        const DURATION = 10000; // виртуальная шкала; точность 0.01%
    
        const animation = element.animate(this.#buildKeyframes(plan), {
            ...this.#buildTiming(),
            duration: DURATION,
            delay: 0,
            iterations: 1,
            fill: "both",
        });
        animation.pause();
        attachment.animation = animation;
    
        const scroller = isScrollDriven(trigger)
            ? (trigger.source === "nearest" || trigger.source == null
                ? this.#findNearestScroller(element)
                : this.#resolveElementRef(trigger.source, element))
            : this.#findNearestScroller(element);
    
        let rafId = 0;
    
        const computeProgress = (): number => {
            if (isViewDriven(trigger)) {
                // приближение "cover": от входа нижней границы до выхода верхней
                const vp = scroller === document.scrollingElement
                    ? { top: 0, height: innerHeight }
                    : (scroller as Element).getBoundingClientRect();
                const rect = element.getBoundingClientRect();
                const total = vp.height + rect.height;
                return Math.min(1, Math.max(0, (vp.top + vp.height - rect.top) / total));
            }
            const el = scroller as Element;
            const max = el.scrollHeight - el.clientHeight;
            return max > 0 ? el.scrollTop / max : 0;
        };
    
        const onScroll = () => {
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                animation.currentTime = computeProgress() * DURATION;
            });
        };
    
        const listenTarget: EventTarget =
            scroller === document.scrollingElement ? window : scroller as Element;
    
        listenTarget.addEventListener("scroll", onScroll, { passive: true });
        onScroll(); // начальная синхронизация
    
        return () => {
            cancelAnimationFrame(rafId);
            listenTarget.removeEventListener("scroll", onScroll);
            animation.cancel();
        };
    }

    /* ---- реактивный контракт { value } ---- */

    /** Последнее известное значение (первый шаг до старта). */
    get value(): any { return this.#current; }

    set value(next: any) {
        this.#current = next;
        for (const cb of this.#subscribers) cb(next);
    }

    subscribe(cb: (v: any) => void): Cleanup {
        this.#subscribers.add(cb);
        return () => this.#subscribers.delete(cb);
    }

    get options(): AnimatableOptions { return this.#options; }
    get steps(): any[] { return this.#steps; }

    /* ---- шаги могут содержать ref'ы: разрешаем в момент построения keyframes ---- */

    #resolveStep(step: any): any {
        // { value } внутри шага — берём текущее значение ref'а
        if (step != null && typeof step === "object" && "value" in step) {
            return step.value;
        }
        return step;
    }

    #buildKeyframes(plan: AnimatableApplyPlan): Keyframe[] {
        const steps = this.#steps.map(s => this.#resolveStep(s));
        const count = steps.length;
        const offsets = this.#options.offsets;
        const easing = this.#options.easing;

        return steps.map((raw, i) => {
            const frame: Keyframe = {
                offset: offsets?.[i] ?? (count > 1 ? i / (count - 1) : 0),
            };

            // per-segment easing: easing[i] действует от кадра i к i+1
            if (Array.isArray(easing)) {
                if (easing[i]) frame.easing = easing[i];
            }

            let value: any = raw;
            if (plan.mode === "property" && plan.unit != null && typeof raw === "number") {
                value = `${raw}${plan.unit}`;
            }
            if (plan.mode === "custom-property" && typeof raw !== "string") {
                value = String(raw); // числовое custom property сериализуем
            }

            (frame as any)[plan.target] = value;
            return frame;
        });
    }

    #buildTiming(): KeyframeAnimationOptions {
        const o = this.#options;
        return {
            duration: parseTime(o.duration, 300),
            delay: parseTime(o.delay, 0),
            endDelay: o.endDelay ?? 0,
            iterations: normalizeIterations(o.iterations),
            direction: o.direction ?? "normal",
            fill: o.fill ?? "both",
            composite: o.composite,
            easing: Array.isArray(o.easing)
                ? "linear"                      // per-segment задан в кадрах
                : (o.easing ?? "linear"),
        };
    }

    /* ---- привязка к элементу (вызывается из applyStyleTemplate) ---- */

    attach(element: HTMLElement, plan: AnimatableApplyPlan): Cleanup {
        const attachment: AnimatableAttachment = { element, animation: null, cleanup: () => {} };
        const trigger = this.#options.trigger ?? "mount";
    
        let inner: Cleanup;
        if (isScrollDriven(trigger) || isViewDriven(trigger)) {
            inner = this.#startTimelineDriven(element, attachment, plan, trigger);
        } else {
            const start = () => {
                attachment.animation?.cancel();
                const animation = element.animate(
                    this.#buildKeyframes(plan),
                    this.#buildTiming(),
                );
                attachment.animation = animation;
                this.#trackProgress(animation, plan);
                return animation;
            };
            inner = this.#wireTrigger(element, attachment, start as () => Animation);
        }
    
        this.#attachments.add(attachment);
        attachment.cleanup = () => { inner(); this.#attachments.delete(attachment); };
        return attachment.cleanup;
    }

    /**
     * Синхронизируем .value с завершением анимации,
     * чтобы реактивный контракт оставался честным
     * (подписчики вне анимации видят конечное значение).
     */
    #trackProgress(animation: Animation, plan: AnimatableApplyPlan): void {
        animation.finished.then(() => {
            const last = this.#resolveStep(this.#steps[this.#steps.length - 1]);
            this.value = last;
        }).catch(() => { /* cancel — состояние не трогаем */ });
    }

    #wireTrigger(
        element: HTMLElement,
        attachment: AnimatableAttachment,
        start: () => Animation,
    ): Cleanup {
        const trigger = this.#options.trigger ?? "mount";
        const reverseOnExit = this.#options.reverseOnExit ?? true;

        const playForward = () => {
            if (!attachment.animation || attachment.animation.playState === "idle") {
                start();
            } else {
                attachment.animation.playbackRate = Math.abs(attachment.animation.playbackRate || 1);
                attachment.animation.play();
            }
        };

        const playBackward = () => {
            if (!attachment.animation) return;
            attachment.animation.reverse();
        };

        if (trigger === "mount") {
            start();
            return () => {};
        }

        if (trigger === "manual") {
            return () => {};
        }

        if (trigger === "hover" || trigger === "focus") {
            const enter = trigger === "hover" ? "pointerenter" : "focusin";
            const leave = trigger === "hover" ? "pointerleave" : "focusout";

            const onEnter = () => playForward();
            const onLeave = () => { if (reverseOnExit) playBackward(); };

            element.addEventListener(enter, onEnter);
            element.addEventListener(leave, onLeave);
            return () => {
                element.removeEventListener(enter, onEnter);
                element.removeEventListener(leave, onLeave);
            };
        }

        if (trigger === "click") {
            let forward = true;
            const onClick = () => {
                forward ? playForward() : playBackward();
                forward = !forward;
            };
            element.addEventListener("click", onClick);
            return () => element.removeEventListener("click", onClick);
        }

        if (trigger === "visible") {
            if (typeof IntersectionObserver !== "function") {
                start(); // деградация: играть сразу
                return () => {};
            }
            const observer = new IntersectionObserver(entries => {
                for (const entry of entries) {
                    if (entry.isIntersecting) playForward();
                    else if (reverseOnExit && attachment.animation) playBackward();
                }
            }, this.#options.intersection);
            observer.observe(element);
            return () => observer.disconnect();
        }

        // Реактивный триггер { value }
        if (trigger != null && typeof trigger === "object" && "value" in trigger) {
            const apply = (v: any) => (v ? playForward() : playBackward());
            apply((trigger as any).value);

            const unsubscribe =
                typeof (trigger as any).subscribe === "function"
                    ? (trigger as any).subscribe(apply)
                    : null;

            return () => unsubscribe?.();
        }

        return () => {};
    }

    /* ---- агрегированное управление всеми привязками ---- */

    #each(fn: (a: Animation) => void): this {
        for (const at of this.#attachments) {
            if (at.animation) fn(at.animation);
        }
        return this;
    }

    play()    { return this.#each(a => a.play()); }
    pause()   { return this.#each(a => a.pause()); }
    reverse() { return this.#each(a => a.reverse()); }
    cancel()  { return this.#each(a => a.cancel()); }
    finish()  { return this.#each(a => a.finish()); }

    set playbackRate(rate: number) { this.#each(a => { a.playbackRate = rate; }); }

    /** Promise завершения всех активных анимаций. */
    get finished(): Promise<void> {
        const list: Promise<any>[] = [];
        this.#each(a => list.push(a.finished.catch(() => {})));
        return Promise.all(list).then(() => {});
    }
}

export const animatable = (
    steps: any[],
    options?: AnimatableOptions,
): AnimatableValue => new AnimatableValue(steps, options);

export const isAnimatableValue = (value: any): value is AnimatableValue =>
    value != null &&
    typeof value === "object" &&
    (value as any)[ANIMATABLE_BRAND] === true;
