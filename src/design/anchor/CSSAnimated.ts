// CSS Animated Reference (by JS Animation API)
// Has previous (started) state
// And current (to) state
// Animates when bound with style property, by change value

import { numberRef, stringRef, affected } from "fest/object";
import { toRef, deref, $getValue } from "fest/core";
import { makeRAFCycle, setProperty } from "fest/dom";
import { $extract } from "./CSSTimeline";

/**
 * Animation configuration options
 */
export interface AnimationOptions {
    duration?: number;
    easing?: string;
    delay?: number;
    direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
    iterations?: number;
    fill?: 'none' | 'forwards' | 'backwards' | 'both';
}

/**
 * Transition configuration options
 */
export interface TransitionOptions {
    duration?: number;
    easing?: string;
    delay?: number;
    property?: string;
}

/**
 * Animation binding state for tracking active animations
 */
class AnimationState {
    private animations = new Map<string, Animation>();
    private transitions = new Map<string, string>();

    setAnimation(property: string, animation: Animation) {
        this.animations.set(property, animation);
    }

    getAnimation(property: string): Animation | undefined {
        return this.animations.get(property);
    }

    cancelAnimation(property: string) {
        const animation = this.animations.get(property);
        if (animation) {
            animation.cancel();
            this.animations.delete(property);
        }
    }

    setTransition(element: HTMLElement, property: string, options: TransitionOptions) {
        const duration = options.duration || 200;
        const easing = options.easing || 'ease';
        const delay = options.delay || 0;

        const transitionValue = `${property} ${duration}ms ${easing} ${delay}ms`;
        const existingTransition = this.transitions.get(property);

        if (existingTransition !== transitionValue) {
            this.transitions.set(property, transitionValue);
            this.updateElementTransitions(element);
        }
    }

    private updateElementTransitions(element: HTMLElement) {
        const transitions = Array.from(this.transitions.values()).join(', ');
        element.style.transition = transitions;
    }

    clearTransitions(element: HTMLElement) {
        this.transitions.clear();
        element.style.transition = '';
    }

    cancelAll(element: HTMLElement) {
        // Use Array.from to create a copy for iteration (fixes downlevelIteration issue)
        const animationValues = Array.from(this.animations.values());
        for (const animation of animationValues) {
            animation.cancel();
        }
        this.animations.clear();
        this.clearTransitions(element);
    }

    getAnimations(): Map<string, Animation> {
        return this.animations;
    }
}

// Global animation state registry
const animationStates = new WeakMap<HTMLElement, AnimationState>();

/**
 * Get or create animation state for an element
 */
function getAnimationState(element: HTMLElement): AnimationState {
    let state = animationStates.get(element);
    if (!state) {
        state = new AnimationState();
        animationStates.set(element, state);
    }
    return state;
}

/**
 * Animation binding options for different animation types
 */
export interface SpringOptions {
    stiffness?: number;
    damping?: number;
    mass?: number;
    velocity?: number;
}

/**
 * Animated style change handler using Web Animations API
 * Creates smooth transitions between values
 */
export function handleAnimatedStyleChange(
    element: HTMLElement,
    property: string,
    value: any,
    options: AnimationOptions = {}
): void {
    if (!element || !property) return;

    const state = getAnimationState(element);
    const currentValue = element.style.getPropertyValue(property) || getComputedStyle(element)[property as any];
    const targetValue = $getValue(value);

    // Skip animation if values are the same
    if (currentValue === targetValue) return;

    // Cancel any existing animation for this property
    state.cancelAnimation(property);

    // Create animation keyframes
    const keyframes = [
        { [property]: currentValue },
        { [property]: targetValue }
    ];

    // Set default animation options
    const animationOptions: KeyframeAnimationOptions = {
        duration: options.duration || 200,
        easing: options.easing || 'ease',
        delay: options.delay || 0,
        direction: options.direction || 'normal',
        iterations: options.iterations || 1,
        fill: options.fill || 'forwards'
    };

    // Create and start animation
    const animation = element.animate(keyframes, animationOptions);
    state.setAnimation(property, animation);

    // Clean up when animation finishes
    animation.addEventListener('finish', () => {
        state.cancelAnimation(property);
        // Ensure final value is set
        element.style.setProperty(property, targetValue);
    });
}

/**
 * Transition-based style change handler using CSS transitions
 * More efficient for simple transitions, uses browser's native transition system
 */
export function handleTransitionStyleChange(
    element: HTMLElement,
    property: string,
    value: any,
    options: TransitionOptions = {}
): void {
    if (!element || !property) return;

    const state = getAnimationState(element);
    const targetValue = $getValue(value);

    // Set up transition for the property
    state.setTransition(element, property, options);

    // Apply the new value (transition will handle the animation)
    element.style.setProperty(property, targetValue);
}

/**
 * Spring-based animation handler for natural-feeling animations
 * Uses spring physics for more organic motion
 */
export function handleSpringStyleChange(
    element: HTMLElement,
    property: string,
    value: any,
    options: {
        stiffness?: number;
        damping?: number;
        mass?: number;
        velocity?: number;
    } = {}
): void {
    if (!element || !property) return;

    const state = getAnimationState(element);
    const targetValue = $getValue(value);
    const currentValue = parseFloat(element.style.getPropertyValue(property)) ||
                        parseFloat(getComputedStyle(element)[property as any]) || 0;

    // Skip if values are the same
    if (Math.abs(currentValue - targetValue) < 0.01) return;

    // Cancel existing animation
    state.cancelAnimation(property);

    // Spring parameters
    const stiffness = options.stiffness || 100;
    const damping = options.damping || 10;
    const mass = options.mass || 1;
    const initialVelocity = options.velocity || 0;

    let currentPosition = currentValue;
    let currentVelocity = initialVelocity;
    let animationId: number;

    const animate = () => {
        const springForce = -stiffness * (currentPosition - targetValue);
        const dampingForce = -damping * currentVelocity;
        const totalForce = springForce + dampingForce;
        const acceleration = totalForce / mass;

        currentVelocity += acceleration * 0.016; // 60fps
        currentPosition += currentVelocity * 0.016;

        // Apply the current position
        const cssValue = property.includes('scale') || property.includes('opacity') ?
            currentPosition.toString() :
            `${currentPosition}px`;
        element.style.setProperty(property, cssValue);

        // Continue animation if not settled
        if (Math.abs(currentPosition - targetValue) > 0.01 || Math.abs(currentVelocity) > 0.01) {
            animationId = requestAnimationFrame(animate);
                } else {
                    // Ensure final value is exact
                    element.style.setProperty(property, property.includes('scale') || property.includes('opacity') ?
                        targetValue.toString() : `${targetValue}px`);
                    state.cancelAnimation(property);
                }
    };

    // Store animation reference for cancellation
    const mockAnimation = {
        cancel: () => cancelAnimationFrame(animationId)
    } as any;
    state.setAnimation(property, mockAnimation);

    // Start animation
    animationId = requestAnimationFrame(animate);
}

/**
 * Morphing animation handler for complex style changes
 * Can animate multiple properties simultaneously with coordinated timing
 */
export function handleMorphStyleChange(
    element: HTMLElement,
    properties: Record<string, any>,
    options: AnimationOptions & { stagger?: number } = {}
): void {
    if (!element || !properties) return;

    const state = getAnimationState(element);
    const keyframes: Keyframe[] = [{}, {}];

    // Build keyframes from current and target values
    for (const [property, value] of Object.entries(properties)) {
        const currentValue = element.style.getPropertyValue(property) ||
                           getComputedStyle(element)[property as any];
        const targetValue = $getValue(value);

        keyframes[0][property] = currentValue;
        keyframes[1][property] = targetValue;
    }

    // Cancel existing animations
    for (const property of Object.keys(properties)) {
        state.cancelAnimation(property);
    }

    const animationOptions: KeyframeAnimationOptions = {
        duration: options.duration || 300,
        easing: options.easing || 'ease-out',
        delay: options.delay || 0,
        direction: options.direction || 'normal',
        iterations: options.iterations || 1,
        fill: options.fill || 'forwards'
    };

    const animation = element.animate(keyframes, animationOptions);

    // Store animation reference for each property
    for (const property of Object.keys(properties)) {
        state.setAnimation(property, animation);
    }

    animation.addEventListener('finish', () => {
        for (const property of Object.keys(properties)) {
            state.cancelAnimation(property);
            // Ensure final values are set
            const targetValue = $getValue(properties[property]);
            element.style.setProperty(property, targetValue);
        }
    });
}

/**
 * Reactive animation binding that automatically animates when values change
 */
export function bindAnimatedStyle(
    element: HTMLElement,
    propertyOrProperties: string | Record<string, any>,
    reactiveValue: any,
    animationType: 'animate' | 'transition' | 'spring' | 'morph' = 'animate',
    options: AnimationOptions | TransitionOptions = {}
): () => void {
    const wel = toRef(element);
    const wv = toRef(reactiveValue);

    if (animationType === 'morph') {
        // For morph animations, propertyOrProperties should be a Record<string, any>
        const properties = propertyOrProperties as Record<string, any>;

        // Initial value
        handleMorphStyleChange(deref(wel), properties, options);

        // Subscribe to changes - for morph, we expect reactiveValue to be an object with reactive properties
        const unaffected = affected(reactiveValue, (newValue) => {
            handleMorphStyleChange(deref(wel), properties, options);
        });

        return unsubscribe;
    } else {
        // For other animation types, propertyOrProperties should be a string
        const property = propertyOrProperties as string;

        const handler = (animationType === 'animate') ? handleAnimatedStyleChange :
                       (animationType === 'transition') ? handleTransitionStyleChange :
                       handleSpringStyleChange;

        // Initial value
        handler(deref(wel), property, $getValue(deref(wv)), options);

        // Subscribe to changes
        const unaffected = affected(reactiveValue, (newValue) => {
            handler(deref(wel), property, newValue, options);
        });

        return unsubscribe;
    }
}

/**
 * Animation sequence builder for complex multi-stage animations
 */
export class AnimationSequence {
    private steps: Array<{
        properties: Record<string, any>;
        options: AnimationOptions;
        delay?: number;
    }> = [];

    addStep(properties: Record<string, any>, options: AnimationOptions = {}, delay = 0) {
        this.steps.push({ properties, options, delay });
        return this;
    }

    async play(element: HTMLElement): Promise<void> {
        for (const step of this.steps) {
            if (step.delay) {
                await new Promise(resolve => setTimeout(resolve, step.delay));
            }

            await new Promise<void>((resolve) => {
                handleMorphStyleChange(element, step.properties, {
                    ...step.options,
                    fill: 'forwards'
                });

                // Wait for animation to complete
                setTimeout(resolve, step.options.duration || 200);
            });
        }
    }

    static create(): AnimationSequence {
        return new AnimationSequence();
    }
}

/**
 * Animation presets for common use cases
 */
export const AnimationPresets = {
    // Smooth fade in/out
    fade: {
        duration: 200,
        easing: 'ease-in-out'
    },

    // Bounce effect
    bounce: {
        duration: 400,
        easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    },

    // Elastic effect
    elastic: {
        duration: 600,
        easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    },

    // Slide in from direction
    slideIn: (direction: 'left' | 'right' | 'up' | 'down') => ({
        duration: 300,
        easing: 'ease-out',
        transform: `translate${direction === 'left' || direction === 'right' ? 'X' : 'Y'}(${direction === 'left' || direction === 'up' ? '-' : ''}100%)`
    }),

    // Scale effect
    scale: {
        duration: 200,
        easing: 'ease-in-out'
    }
};

/**
 * Cleanup function to cancel all animations for an element
 */
export function cancelElementAnimations(element: HTMLElement): void {
    const state = animationStates.get(element);
    if (state) {
        state.cancelAll(element);
        animationStates.delete(element);
    }
}

/**
 * Utility to create animated reactive references
 */
export function animatedRef(initialValue: any, animationType: 'animate' | 'transition' | 'spring' = 'animate', options: any = {}) {
    const ref = typeof initialValue === 'number' ? numberRef(initialValue) : stringRef(initialValue);

    // Extend ref with animation metadata
    (ref as any).$animationType = animationType;
    (ref as any).$animationOptions = options;

    return ref;
}

//
export const effectProperty = { fill: "both", delay: 0, easing: "linear", rangeStart: "cover 0%", rangeEnd: "cover 100%", duration: 1 };
export const animateByTimeline = async (source: HTMLElement, properties = {}, timeline?: any) => {
    if (!source || !timeline) return;

    // @ts-ignore
    if (timeline instanceof ScrollTimeline || timeline instanceof ViewTimeline) {
        return source?.animate?.(properties, { ...effectProperty as any, timeline: timeline?.[$extract] ?? timeline });
    }

    //
    const  target  = toRef(source), wk = toRef(timeline);
    const renderCb = ([name, $v]) => {
        const tg = deref(target); if (tg) {
            const val = deref(wk)?.value || 0, values = $v as [any, any];
            setProperty(tg, name, (values[0] * (1 - val) + values[1] * val))
        }
    }

    //
    const scheduler = makeRAFCycle();
    const  everyCb  = ()=>Object.entries(properties)?.forEach?.(renderCb);
    return affected(timeline, (val: any) => scheduler?.schedule?.(everyCb));
}



// ============================================================================
// Export Animation Binding Functions
// ============================================================================

/*
export {
    bindAnimated,
    bindTransition,
    bindSpring,
    bindMorph,
    bindAnimatedBatch,
    bindPreset,
    bindConditionalAnimation,
    createAnimationSequence,
    cancelElementAnimations,
    animatedRef,
    AnimationPresets,
    type AnimationOptions,
    type TransitionOptions
};
*/
