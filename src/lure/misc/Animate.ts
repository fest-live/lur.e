// animation.ts
import {  } from "@fest-lib/dom";
import { S, StyleBinding, isReactiveStyleValue, isNativeCSSStyleValue } from "./Styles";
import { bindWith } from "../core/Binding";


export type Cleanup = () => void;

/**
 * Timing function for animation steps.
 * Can be a CSS easing string or a custom easing function.
 */
export type TimingFunction = string | ((progress: number) => number);

/**
 * Animation configuration for a single property.
 */
export interface PropertyAnimation {
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
export const parseTime = (v: number | string | undefined, fallback = 0): number => {
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
    FillMode,
    PlaybackDirection,
};
