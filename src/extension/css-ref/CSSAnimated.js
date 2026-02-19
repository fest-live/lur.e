// CSS Animated Reference (by JS Animation API)
// Has previous (started) state
// And current (to) state
// Animates when bound with style property, by change value
import { numberRef, stringRef, affected } from "fest/object";
import { toRef, deref, $getValue } from "fest/core";
import { makeRAFCycle, setProperty } from "fest/dom";
import { $extract } from "./CSSTimeline";
/**
 * Animation binding state for tracking active animations
 */
class AnimationState {
    animations = new Map();
    transitions = new Map();
    setAnimation(property, animation) {
        this.animations.set(property, animation);
    }
    getAnimation(property) {
        return this.animations.get(property);
    }
    cancelAnimation(property) {
        const animation = this.animations.get(property);
        if (animation) {
            animation.cancel();
            this.animations.delete(property);
        }
    }
    setTransition(element, property, options) {
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
    updateElementTransitions(element) {
        const transitions = Array.from(this.transitions.values()).join(', ');
        element.style.transition = transitions;
    }
    clearTransitions(element) {
        this.transitions.clear();
        element.style.transition = '';
    }
    cancelAll(element) {
        // Use Array.from to create a copy for iteration (fixes downlevelIteration issue)
        const animationValues = Array.from(this.animations.values());
        for (const animation of animationValues) {
            animation.cancel();
        }
        this.animations.clear();
        this.clearTransitions(element);
    }
    getAnimations() {
        return this.animations;
    }
}
// Global animation state registry
const animationStates = new WeakMap();
/**
 * Get or create animation state for an element
 */
function getAnimationState(element) {
    let state = animationStates.get(element);
    if (!state) {
        state = new AnimationState();
        animationStates.set(element, state);
    }
    return state;
}
/**
 * Animated style change handler using Web Animations API
 * Creates smooth transitions between values
 */
export function handleAnimatedStyleChange(element, property, value, options = {}) {
    if (!element || !property)
        return;
    const state = getAnimationState(element);
    const currentValue = element.style.getPropertyValue(property) || getComputedStyle(element)[property];
    const targetValue = $getValue(value);
    // Skip animation if values are the same
    if (currentValue === targetValue)
        return;
    // Cancel any existing animation for this property
    state.cancelAnimation(property);
    // Create animation keyframes
    const keyframes = [
        { [property]: currentValue },
        { [property]: targetValue }
    ];
    // Set default animation options
    const animationOptions = {
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
export function handleTransitionStyleChange(element, property, value, options = {}) {
    if (!element || !property)
        return;
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
export function handleSpringStyleChange(element, property, value, options = {}) {
    if (!element || !property)
        return;
    const state = getAnimationState(element);
    const targetValue = $getValue(value);
    const currentValue = parseFloat(element.style.getPropertyValue(property)) ||
        parseFloat(getComputedStyle(element)[property]) || 0;
    // Skip if values are the same
    if (Math.abs(currentValue - targetValue) < 0.01)
        return;
    // Cancel existing animation
    state.cancelAnimation(property);
    // Spring parameters
    const stiffness = options.stiffness || 100;
    const damping = options.damping || 10;
    const mass = options.mass || 1;
    const initialVelocity = options.velocity || 0;
    let currentPosition = currentValue;
    let currentVelocity = initialVelocity;
    let animationId;
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
        }
        else {
            // Ensure final value is exact
            element.style.setProperty(property, property.includes('scale') || property.includes('opacity') ?
                targetValue.toString() : `${targetValue}px`);
            state.cancelAnimation(property);
        }
    };
    // Store animation reference for cancellation
    const mockAnimation = {
        cancel: () => cancelAnimationFrame(animationId)
    };
    state.setAnimation(property, mockAnimation);
    // Start animation
    animationId = requestAnimationFrame(animate);
}
/**
 * Morphing animation handler for complex style changes
 * Can animate multiple properties simultaneously with coordinated timing
 */
export function handleMorphStyleChange(element, properties, options = {}) {
    if (!element || !properties)
        return;
    const state = getAnimationState(element);
    const keyframes = [{}, {}];
    // Build keyframes from current and target values
    for (const [property, value] of Object.entries(properties)) {
        const currentValue = element.style.getPropertyValue(property) ||
            getComputedStyle(element)[property];
        const targetValue = $getValue(value);
        keyframes[0][property] = currentValue;
        keyframes[1][property] = targetValue;
    }
    // Cancel existing animations
    for (const property of Object.keys(properties)) {
        state.cancelAnimation(property);
    }
    const animationOptions = {
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
export function bindAnimatedStyle(element, propertyOrProperties, reactiveValue, animationType = 'animate', options = {}) {
    const wel = toRef(element);
    const wv = toRef(reactiveValue);
    if (animationType === 'morph') {
        // For morph animations, propertyOrProperties should be a Record<string, any>
        const properties = propertyOrProperties;
        // Initial value
        handleMorphStyleChange(deref(wel), properties, options);
        // Subscribe to changes - for morph, we expect reactiveValue to be an object with reactive properties
        const unaffected = affected(reactiveValue, (newValue) => {
            handleMorphStyleChange(deref(wel), properties, options);
        });
        return unsubscribe;
    }
    else {
        // For other animation types, propertyOrProperties should be a string
        const property = propertyOrProperties;
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
    steps = [];
    addStep(properties, options = {}, delay = 0) {
        this.steps.push({ properties, options, delay });
        return this;
    }
    async play(element) {
        for (const step of this.steps) {
            if (step.delay) {
                await new Promise(resolve => setTimeout(resolve, step.delay));
            }
            await new Promise((resolve) => {
                handleMorphStyleChange(element, step.properties, {
                    ...step.options,
                    fill: 'forwards'
                });
                // Wait for animation to complete
                setTimeout(resolve, step.options.duration || 200);
            });
        }
    }
    static create() {
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
    slideIn: (direction) => ({
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
export function cancelElementAnimations(element) {
    const state = animationStates.get(element);
    if (state) {
        state.cancelAll(element);
        animationStates.delete(element);
    }
}
/**
 * Utility to create animated reactive references
 */
export function animatedRef(initialValue, animationType = 'animate', options = {}) {
    const ref = typeof initialValue === 'number' ? numberRef(initialValue) : stringRef(initialValue);
    // Extend ref with animation metadata
    ref.$animationType = animationType;
    ref.$animationOptions = options;
    return ref;
}
//
export const effectProperty = { fill: "both", delay: 0, easing: "linear", rangeStart: "cover 0%", rangeEnd: "cover 100%", duration: 1 };
export const animateByTimeline = async (source, properties = {}, timeline) => {
    if (!source || !timeline)
        return;
    // @ts-ignore
    if (timeline instanceof ScrollTimeline || timeline instanceof ViewTimeline) {
        return source?.animate?.(properties, { ...effectProperty, timeline: timeline?.[$extract] ?? timeline });
    }
    //
    const target = toRef(source), wk = toRef(timeline);
    const renderCb = ([name, $v]) => {
        const tg = deref(target);
        if (tg) {
            const val = deref(wk)?.value || 0, values = $v;
            setProperty(tg, name, (values[0] * (1 - val) + values[1] * val));
        }
    };
    //
    const scheduler = makeRAFCycle();
    const everyCb = () => Object.entries(properties)?.forEach?.(renderCb);
    return affected(timeline, (val) => scheduler?.schedule?.(everyCb));
};
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ1NTQW5pbWF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJDU1NBbmltYXRlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwrQ0FBK0M7QUFDL0MsK0JBQStCO0FBQy9CLHlCQUF5QjtBQUN6QiwyREFBMkQ7QUFFM0QsT0FBTyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQzdELE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUNwRCxPQUFPLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUNyRCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBd0J6Qzs7R0FFRztBQUNILE1BQU0sY0FBYztJQUNSLFVBQVUsR0FBRyxJQUFJLEdBQUcsRUFBcUIsQ0FBQztJQUMxQyxXQUFXLEdBQUcsSUFBSSxHQUFHLEVBQWtCLENBQUM7SUFFaEQsWUFBWSxDQUFDLFFBQWdCLEVBQUUsU0FBb0I7UUFDL0MsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFRCxZQUFZLENBQUMsUUFBZ0I7UUFDekIsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRUQsZUFBZSxDQUFDLFFBQWdCO1FBQzVCLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2hELElBQUksU0FBUyxFQUFFLENBQUM7WUFDWixTQUFTLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDbkIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDckMsQ0FBQztJQUNMLENBQUM7SUFFRCxhQUFhLENBQUMsT0FBb0Is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Q0FBQyxDQUFDO0lBQ3RFLE9BQU8sUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDLEdBQVEsRUFBRSxFQUFFLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDNUUsQ0FBQyxDQUFBO0FBSUQsK0VBQStFO0FBQy9FLHFDQUFxQztBQUNyQywrRUFBK0U7QUFFL0U7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkUiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDU1MgQW5pbWF0ZWQgUmVmZXJlbmNlIChieSBKUyBBbmltYXRpb24gQVBJKVxuLy8gSGFzIHByZXZpb3VzIChzdGFydGVkKSBzdGF0ZVxuLy8gQW5kIGN1cnJlbnQgKHRvKSBzdGF0ZVxuLy8gQW5pbWF0ZXMgd2hlbiBib3VuZCB3aXRoIHN0eWxlIHByb3BlcnR5LCBieSBjaGFuZ2UgdmFsdWVcblxuaW1wb3J0IHsgbnVtYmVyUmVmLCBzdHJpbmdSZWYsIGFmZmVjdGVkIH0gZnJvbSBcImZlc3Qvb2JqZWN0XCI7XG5pbXBvcnQgeyB0b1JlZiwgZGVyZWYsICRnZXRWYWx1ZSB9IGZyb20gXCJmZXN0L2NvcmVcIjtcbmltcG9ydCB7IG1ha2VSQUZDeWNsZSwgc2V0UHJvcGVydHkgfSBmcm9tIFwiZmVzdC9kb21cIjtcbmltcG9ydCB7ICRleHRyYWN0IH0gZnJvbSBcIi4vQ1NTVGltZWxpbmVcIjtcblxuLyoqXG4gKiBBbmltYXRpb24gY29uZmlndXJhdGlvbiBvcHRpb25zXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQW5pbWF0aW9uT3B0aW9ucyB7XG4gICAgZHVyYXRpb24/OiBudW1iZXI7XG4gICAgZWFzaW5nPzogc3RyaW5nO1xuICAgIGRlbGF5PzogbnVtYmVyO1xuICAgIGRpcmVjdGlvbj86ICdub3JtYWwnIHwgJ3JldmVyc2UnIHwgJ2FsdGVybmF0ZScgfCAnYWx0ZXJuYXRlLXJldmVyc2UnO1xuICAgIGl0ZXJhdGlvbnM/OiBudW1iZXI7XG4gICAgZmlsbD86ICdub25lJyB8ICdmb3J3YXJkcycgfCAnYmFja3dhcmRzJyB8ICdib3RoJztcbn1cblxuLyoqXG4gKiBUcmFuc2l0aW9uIGNvbmZpZ3VyYXRpb24gb3B0aW9uc1xuICovXG5leHBvcnQgaW50ZXJmYWNlIFRyYW5zaXRpb25PcHRpb25zIHtcbiAgICBkdXJhdGlvbj86IG51bWJlcjtcbiAgICBlYXNpbmc/OiBzdHJpbmc7XG4gICAgZGVsYXk/OiBudW1iZXI7XG4gICAgcHJvcGVydHk/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogQW5pbWF0aW9uIGJpbmRpbmcgc3RhdGUgZm9yIHRyYWNraW5nIGFjdGl2ZSBhbmltYXRpb25zXG4gKi9cbmNsYXNzIEFuaW1hdGlvblN0YXRlIHtcbiAgICBwcml2YXRlIGFuaW1hdGlvbnMgPSBuZXcgTWFwPHN0cmluZywgQW5pbWF0aW9uPigpO1xuICAgIHByaXZhdGUgdHJhbnNpdGlvbnMgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpO1xuXG4gICAgc2V0QW5pbWF0aW9uKHByb3BlcnR5OiBzdHJpbmcsIGFuaW1hdGlvbjogQW5pbWF0aW9uKSB7XG4gICAgICAgIHRoaXMuYW5pbWF0aW9ucy5zZXQocHJvcGVydHksIGFuaW1hdGlvbik7XG4gICAgfVxuXG4gICAgZ2V0QW5pbWF0aW9uKHByb3BlcnR5OiBzdHJpbmcpOiBBbmltYXRpb24gfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gdGhpcy5hbmltYXRpb25zLmdldChwcm9wZXJ0eSk7XG4gICAgfVxuXG4gICAgY2FuY2VsQW5pbWF0aW9uKHByb3BlcnR5OiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgYW5pbWF0aW9uID0gdGhpcy5hbmltYXRpb25zLmdldChwcm9wZXJ0eSk7XG4gICAgICAgIGlmIChhbmltYXRpb24pIHtcbiAgICAgICAgICAgIGFuaW1hdGlvbi5jYW5jZWwoKTtcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9ucy5kZWxldGUocHJvcGVydHkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0VHJhbnNpdGlvbihlbGVtZW50OiBIVE1MRWxlbWVudCwgcHJvcGVydHk6IHN0cmluZywgb3B0aW9uczogVHJhbnNpdGlvbk9wdGlvbnMpIHtcbiAgICAgICAgY29uc3QgZHVyYXRpb24gPSBvcHRpb25zLmR1cmF0aW9uIHx8IDIwMDtcbiAgICAgICAgY29uc3QgZWFzaW5nID0gb3B0aW9ucy5lYXNpbmcgfHwgJ2Vhc2UnO1xuICAgICAgICBjb25zdCBkZWxheSA9IG9wdGlvbnMuZGVsYXkgfHwgMDtcblxuICAgICAgICBjb25zdCB0cmFuc2l0aW9uVmFsdWUgPSBgJHtwcm9wZXJ0eX0gJHtkdXJhdGlvbn1tcyAke2Vhc2luZ30gJHtkZWxheX1tc2A7XG4gICAgICAgIGNvbnN0IGV4aXN0aW5nVHJhbnNpdGlvbiA9IHRoaXMudHJhbnNpdGlvbnMuZ2V0KHByb3BlcnR5KTtcblxuICAgICAgICBpZiAoZXhpc3RpbmdUcmFuc2l0aW9uICE9PSB0cmFuc2l0aW9uVmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMudHJhbnNpdGlvbnMuc2V0KHByb3BlcnR5LCB0cmFuc2l0aW9uVmFsdWUpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVFbGVtZW50VHJhbnNpdGlvbnMoZWxlbWVudCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZUVsZW1lbnRUcmFuc2l0aW9ucyhlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAgICAgICBjb25zdCB0cmFuc2l0aW9ucyA9IEFycmF5LmZyb20odGhpcy50cmFuc2l0aW9ucy52YWx1ZXMoKSkuam9pbignLCAnKTtcbiAgICAgICAgZWxlbWVudC5zdHlsZS50cmFuc2l0aW9uID0gdHJhbnNpdGlvbnM7XG4gICAgfVxuXG4gICAgY2xlYXJUcmFuc2l0aW9ucyhlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAgICAgICB0aGlzLnRyYW5zaXRpb25zLmNsZWFyKCk7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUudHJhbnNpdGlvbiA9ICcnO1xuICAgIH1cblxuICAgIGNhbmNlbEFsbChlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAgICAgICAvLyBVc2UgQXJyYXkuZnJvbSB0byBjcmVhdGUgYSBjb3B5IGZvciBpdGVyYXRpb24gKGZpeGVzIGRvd25sZXZlbEl0ZXJhdGlvbiBpc3N1ZSlcbiAgICAgICAgY29uc3QgYW5pbWF0aW9uVmFsdWVzID0gQXJyYXkuZnJvbSh0aGlzLmFuaW1hdGlvbnMudmFsdWVzKCkpO1xuICAgICAgICBmb3IgKGNvbnN0IGFuaW1hdGlvbiBvZiBhbmltYXRpb25WYWx1ZXMpIHtcbiAgICAgICAgICAgIGFuaW1hdGlvbi5jYW5jZWwoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmFuaW1hdGlvbnMuY2xlYXIoKTtcbiAgICAgICAgdGhpcy5jbGVhclRyYW5zaXRpb25zKGVsZW1lbnQpO1xuICAgIH1cblxuICAgIGdldEFuaW1hdGlvbnMoKTogTWFwPHN0cmluZywgQW5pbWF0aW9uPiB7XG4gICAgICAgIHJldHVybiB0aGlzLmFuaW1hdGlvbnM7XG4gICAgfVxufVxuXG4vLyBHbG9iYWwgYW5pbWF0aW9uIHN0YXRlIHJlZ2lzdHJ5XG5jb25zdCBhbmltYXRpb25TdGF0ZXMgPSBuZXcgV2Vha01hcDxIVE1MRWxlbWVudCwgQW5pbWF0aW9uU3RhdGU+KCk7XG5cbi8qKlxuICogR2V0IG9yIGNyZWF0ZSBhbmltYXRpb24gc3RhdGUgZm9yIGFuIGVsZW1lbnRcbiAqL1xuZnVuY3Rpb24gZ2V0QW5pbWF0aW9uU3RhdGUoZWxlbWVudDogSFRNTEVsZW1lbnQpOiBBbmltYXRpb25TdGF0ZSB7XG4gICAgbGV0IHN0YXRlID0gYW5pbWF0aW9uU3RhdGVzLmdldChlbGVtZW50KTtcbiAgICBpZiAoIXN0YXRlKSB7XG4gICAgICAgIHN0YXRlID0gbmV3IEFuaW1hdGlvblN0YXRlKCk7XG4gICAgICAgIGFuaW1hdGlvblN0YXRlcy5zZXQoZWxlbWVudCwgc3RhdGUpO1xuICAgIH1cbiAgICByZXR1cm4gc3RhdGU7XG59XG5cbi8qKlxuICogQW5pbWF0aW9uIGJpbmRpbmcgb3B0aW9ucyBmb3IgZGlmZmVyZW50IGFuaW1hdGlvbiB0eXBlc1xuICovXG5leHBvcnQgaW50ZXJmYWNlIFNwcmluZ09wdGlvbnMge1xuICAgIHN0aWZmbmVzcz86IG51bWJlcjtcbiAgICBkYW1waW5nPzogbnVtYmVyO1xuICAgIG1hc3M/OiBudW1iZXI7XG4gICAgdmVsb2NpdHk/OiBudW1iZXI7XG59XG5cbi8qKlxuICogQW5pbWF0ZWQgc3R5bGUgY2hhbmdlIGhhbmRsZXIgdXNpbmcgV2ViIEFuaW1hdGlvbnMgQVBJXG4gKiBDcmVhdGVzIHNtb290aCB0cmFuc2l0aW9ucyBiZXR3ZWVuIHZhbHVlc1xuICovXG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlQW5pbWF0ZWRTdHlsZUNoYW5nZShcbiAgICBlbGVtZW50OiBIVE1MRWxlbWVudCxcbiAgICBwcm9wZXJ0eTogc3RyaW5nLFxuICAgIHZhbHVlOiBhbnksXG4gICAgb3B0aW9uczogQW5pbWF0aW9uT3B0aW9ucyA9IHt9XG4pOiB2b2lkIHtcbiAgICBpZiAoIWVsZW1lbnQgfHwgIXByb3BlcnR5KSByZXR1cm47XG5cbiAgICBjb25zdCBzdGF0ZSA9IGdldEFuaW1hdGlvblN0YXRlKGVsZW1lbnQpO1xuICAgIGNvbnN0IGN1cnJlbnRWYWx1ZSA9IGVsZW1lbnQuc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShwcm9wZXJ0eSkgfHwgZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KVtwcm9wZXJ0eSBhcyBhbnldO1xuICAgIGNvbnN0IHRhcmdldFZhbHVlID0gJGdldFZhbHVlKHZhbHVlKTtcblxuICAgIC8vIFNraXAgYW5pbWF0aW9uIGlmIHZhbHVlcyBhcmUgdGhlIHNhbWVcbiAgICBpZiAoY3VycmVudFZhbHVlID09PSB0YXJnZXRWYWx1ZSkgcmV0dXJuO1xuXG4gICAgLy8gQ2FuY2VsIGFueSBleGlzdGluZyBhbmltYXRpb24gZm9yIHRoaXMgcHJvcGVydHlcbiAgICBzdGF0ZS5jYW5jZWxBbmltYXRpb24ocHJvcGVydHkpO1xuXG4gICAgLy8gQ3JlYXRlIGFuaW1hdGlvbiBrZXlmcmFtZXNcbiAgICBjb25zdCBrZXlmcmFtZXMgPSBbXG4gICAgICAgIHsgW3Byb3BlcnR5XTogY3VycmVudFZhbHVlIH0sXG4gICAgICAgIHsgW3Byb3BlcnR5XTogdGFyZ2V0VmFsdWUgfVxuICAgIF07XG5cbiAgICAvLyBTZXQgZGVmYXVsdCBhbmltYXRpb24gb3B0aW9uc1xuICAgIGNvbnN0IGFuaW1hdGlvbk9wdGlvbnM6IEtleWZyYW1lQW5pbWF0aW9uT3B0aW9ucyA9IHtcbiAgICAgICAgZHVyYXRpb246IG9wdGlvbnMuZHVyYXRpb24gfHwgMjAwLFxuICAgICAgICBlYXNpbmc6IG9wdGlvbnMuZWFzaW5nIHx8ICdlYXNlJyxcbiAgICAgICAgZGVsYXk6IG9wdGlvbnMuZGVsYXkgfHwgMCxcbiAgICAgICAgZGlyZWN0aW9uOiBvcHRpb25zLmRpcmVjdGlvbiB8fCAnbm9ybWFsJyxcbiAgICAgICAgaXRlcmF0aW9uczogb3B0aW9ucy5pdGVyYXRpb25zIHx8IDEsXG4gICAgICAgIGZpbGw6IG9wdGlvbnMuZmlsbCB8fCAnZm9yd2FyZHMnXG4gICAgfTtcblxuICAgIC8vIENyZWF0ZSBhbmQgc3RhcnQgYW5pbWF0aW9uXG4gICAgY29uc3QgYW5pbWF0aW9uID0gZWxlbWVudC5hbmltYXRlKGtleWZyYW1lcywgYW5pbWF0aW9uT3B0aW9ucyk7XG4gICAgc3RhdGUuc2V0QW5pbWF0aW9uKHByb3BlcnR5LCBhbmltYXRpb24pO1xuXG4gICAgLy8gQ2xlYW4gdXAgd2hlbiBhbmltYXRpb24gZmluaXNoZXNcbiAgICBhbmltYXRpb24uYWRkRXZlbnRMaXN0ZW5lcignZmluaXNoJywgKCkgPT4ge1xuICAgICAgICBzdGF0ZS5jYW5jZWxBbmltYXRpb24ocHJvcGVydHkpO1xuICAgICAgICAvLyBFbnN1cmUgZmluYWwgdmFsdWUgaXMgc2V0XG4gICAgICAgIGVsZW1lbnQuc3R5bGUuc2V0UHJvcGVydHkocHJvcGVydHksIHRhcmdldFZhbHVlKTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBUcmFuc2l0aW9uLWJhc2VkIHN0eWxlIGNoYW5nZSBoYW5kbGVyIHVzaW5nIENTUyB0cmFuc2l0aW9uc1xuICogTW9yZSBlZmZpY2llbnQgZm9yIHNpbXBsZSB0cmFuc2l0aW9ucywgdXNlcyBicm93c2VyJ3MgbmF0aXZlIHRyYW5zaXRpb24gc3lzdGVtXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoYW5kbGVUcmFuc2l0aW9uU3R5bGVDaGFuZ2UoXG4gICAgZWxlbWVudDogSFRNTEVsZW1lbnQsXG4gICAgcHJvcGVydHk6IHN0cmluZyxcbiAgICB2YWx1ZTogYW55LFxuICAgIG9wdGlvbnM6IFRyYW5zaXRpb25PcHRpb25zID0ge31cbik6IHZvaWQge1xuICAgIGlmICghZWxlbWVudCB8fCAhcHJvcGVydHkpIHJldHVybjtcblxuICAgIGNvbnN0IHN0YXRlID0gZ2V0QW5pbWF0aW9uU3RhdGUoZWxlbWVudCk7XG4gICAgY29uc3QgdGFyZ2V0VmFsdWUgPSAkZ2V0VmFsdWUodmFsdWUpO1xuXG4gICAgLy8gU2V0IHVwIHRyYW5zaXRpb24gZm9yIHRoZSBwcm9wZXJ0eVxuICAgIHN0YXRlLnNldFRyYW5zaXRpb24oZWxlbWVudCwgcHJvcGVydHksIG9wdGlvbnMpO1xuXG4gICAgLy8gQXBwbHkgdGhlIG5ldyB2YWx1ZSAodHJhbnNpdGlvbiB3aWxsIGhhbmRsZSB0aGUgYW5pbWF0aW9uKVxuICAgIGVsZW1lbnQuc3R5bGUuc2V0UHJvcGVydHkocHJvcGVydHksIHRhcmdldFZhbHVlKTtcbn1cblxuLyoqXG4gKiBTcHJpbmctYmFzZWQgYW5pbWF0aW9uIGhhbmRsZXIgZm9yIG5hdHVyYWwtZmVlbGluZyBhbmltYXRpb25zXG4gKiBVc2VzIHNwcmluZyBwaHlzaWNzIGZvciBtb3JlIG9yZ2FuaWMgbW90aW9uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoYW5kbGVTcHJpbmdTdHlsZUNoYW5nZShcbiAgICBlbGVtZW50OiBIVE1MRWxlbWVudCxcbiAgICBwcm9wZXJ0eTogc3RyaW5nLFxuICAgIHZhbHVlOiBhbnksXG4gICAgb3B0aW9uczoge1xuICAgICAgICBzdGlmZm5lc3M/OiBudW1iZXI7XG4gICAgICAgIGRhbXBpbmc/OiBudW1iZXI7XG4gICAgICAgIG1hc3M/OiBudW1iZXI7XG4gICAgICAgIHZlbG9jaXR5PzogbnVtYmVyO1xuICAgIH0gPSB7fVxuKTogdm9pZCB7XG4gICAgaWYgKCFlbGVtZW50IHx8ICFwcm9wZXJ0eSkgcmV0dXJuO1xuXG4gICAgY29uc3Qgc3RhdGUgPSBnZXRBbmltYXRpb25TdGF0ZShlbGVtZW50KTtcbiAgICBjb25zdCB0YXJnZXRWYWx1ZSA9ICRnZXRWYWx1ZSh2YWx1ZSk7XG4gICAgY29uc3QgY3VycmVudFZhbHVlID0gcGFyc2VGbG9hdChlbGVtZW50LnN0eWxlLmdldFByb3BlcnR5VmFsdWUocHJvcGVydHkpKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdChnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpW3Byb3BlcnR5IGFzIGFueV0pIHx8IDA7XG5cbiAgICAvLyBTa2lwIGlmIHZhbHVlcyBhcmUgdGhlIHNhbWVcbiAgICBpZiAoTWF0aC5hYnMoY3VycmVudFZhbHVlIC0gdGFyZ2V0VmFsdWUpIDwgMC4wMSkgcmV0dXJuO1xuXG4gICAgLy8gQ2FuY2VsIGV4aXN0aW5nIGFuaW1hdGlvblxuICAgIHN0YXRlLmNhbmNlbEFuaW1hdGlvbihwcm9wZXJ0eSk7XG5cbiAgICAvLyBTcHJpbmcgcGFyYW1ldGVyc1xuICAgIGNvbnN0IHN0aWZmbmVzcyA9IG9wdGlvbnMuc3RpZmZuZXNzIHx8IDEwMDtcbiAgICBjb25zdCBkYW1waW5nID0gb3B0aW9ucy5kYW1waW5nIHx8IDEwO1xuICAgIGNvbnN0IG1hc3MgPSBvcHRpb25zLm1hc3MgfHwgMTtcbiAgICBjb25zdCBpbml0aWFsVmVsb2NpdHkgPSBvcHRpb25zLnZlbG9jaXR5IHx8IDA7XG5cbiAgICBsZXQgY3VycmVudFBvc2l0aW9uID0gY3VycmVudFZhbHVlO1xuICAgIGxldCBjdXJyZW50VmVsb2NpdHkgPSBpbml0aWFsVmVsb2NpdHk7XG4gICAgbGV0IGFuaW1hdGlvbklkOiBudW1iZXI7XG5cbiAgICBjb25zdCBhbmltYXRlID0gKCkgPT4ge1xuICAgICAgICBjb25zdCBzcHJpbmdGb3JjZSA9IC1zdGlmZm5lc3MgKiAoY3VycmVudFBvc2l0aW9uIC0gdGFyZ2V0VmFsdWUpO1xuICAgICAgICBjb25zdCBkYW1waW5nRm9yY2UgPSAtZGFtcGluZyAqIGN1cnJlbnRWZWxvY2l0eTtcbiAgICAgICAgY29uc3QgdG90YWxGb3JjZSA9IHNwcmluZ0ZvcmNlICsgZGFtcGluZ0ZvcmNlO1xuICAgICAgICBjb25zdCBhY2NlbGVyYXRpb24gPSB0b3RhbEZvcmNlIC8gbWFzcztcblxuICAgICAgICBjdXJyZW50VmVsb2NpdHkgKz0gYWNjZWxlcmF0aW9uICogMC4wMTY7IC8vIDYwZnBzXG4gICAgICAgIGN1cnJlbnRQb3NpdGlvbiArPSBjdXJyZW50VmVsb2NpdHkgKiAwLjAxNjtcblxuICAgICAgICAvLyBBcHBseSB0aGUgY3VycmVudCBwb3NpdGlvblxuICAgICAgICBjb25zdCBjc3NWYWx1ZSA9IHByb3BlcnR5LmluY2x1ZGVzKCdzY2FsZScpIHx8IHByb3BlcnR5LmluY2x1ZGVzKCdvcGFjaXR5JykgP1xuICAgICAgICAgICAgY3VycmVudFBvc2l0aW9uLnRvU3RyaW5nKCkgOlxuICAgICAgICAgICAgYCR7Y3VycmVudFBvc2l0aW9ufXB4YDtcbiAgICAgICAgZWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShwcm9wZXJ0eSwgY3NzVmFsdWUpO1xuXG4gICAgICAgIC8vIENvbnRpbnVlIGFuaW1hdGlvbiBpZiBub3Qgc2V0dGxlZFxuICAgICAgICBpZiAoTWF0aC5hYnMoY3VycmVudFBvc2l0aW9uIC0gdGFyZ2V0VmFsdWUpID4gMC4wMSB8fCBNYXRoLmFicyhjdXJyZW50VmVsb2NpdHkpID4gMC4wMSkge1xuICAgICAgICAgICAgYW5pbWF0aW9uSWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gRW5zdXJlIGZpbmFsIHZhbHVlIGlzIGV4YWN0XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuc2V0UHJvcGVydHkocHJvcGVydHksIHByb3BlcnR5LmluY2x1ZGVzKCdzY2FsZScpIHx8IHByb3BlcnR5LmluY2x1ZGVzKCdvcGFjaXR5JykgP1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0VmFsdWUudG9TdHJpbmcoKSA6IGAke3RhcmdldFZhbHVlfXB4YCk7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLmNhbmNlbEFuaW1hdGlvbihwcm9wZXJ0eSk7XG4gICAgICAgICAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBTdG9yZSBhbmltYXRpb24gcmVmZXJlbmNlIGZvciBjYW5jZWxsYXRpb25cbiAgICBjb25zdCBtb2NrQW5pbWF0aW9uID0ge1xuICAgICAgICBjYW5jZWw6ICgpID0+IGNhbmNlbEFuaW1hdGlvbkZyYW1lKGFuaW1hdGlvbklkKVxuICAgIH0gYXMgYW55O1xuICAgIHN0YXRlLnNldEFuaW1hdGlvbihwcm9wZXJ0eSwgbW9ja0FuaW1hdGlvbik7XG5cbiAgICAvLyBTdGFydCBhbmltYXRpb25cbiAgICBhbmltYXRpb25JZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRlKTtcbn1cblxuLyoqXG4gKiBNb3JwaGluZyBhbmltYXRpb24gaGFuZGxlciBmb3IgY29tcGxleCBzdHlsZSBjaGFuZ2VzXG4gKiBDYW4gYW5pbWF0ZSBtdWx0aXBsZSBwcm9wZXJ0aWVzIHNpbXVsdGFuZW91c2x5IHdpdGggY29vcmRpbmF0ZWQgdGltaW5nXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoYW5kbGVNb3JwaFN0eWxlQ2hhbmdlKFxuICAgIGVsZW1lbnQ6IEhUTUxFbGVtZW50LFxuICAgIHByb3BlcnRpZXM6IFJlY29yZDxzdHJpbmcsIGFueT4sXG4gICAgb3B0aW9uczogQW5pbWF0aW9uT3B0aW9ucyAmIHsgc3RhZ2dlcj86IG51bWJlciB9ID0ge31cbik6IHZvaWQge1xuICAgIGlmICghZWxlbWVudCB8fCAhcHJvcGVydGllcykgcmV0dXJuO1xuXG4gICAgY29uc3Qgc3RhdGUgPSBnZXRBbmltYXRpb25TdGF0ZShlbGVtZW50KTtcbiAgICBjb25zdCBrZXlmcmFtZXM6IEtleWZyYW1lW10gPSBbe30sIHt9XTtcblxuICAgIC8vIEJ1aWxkIGtleWZyYW1lcyBmcm9tIGN1cnJlbnQgYW5kIHRhcmdldCB2YWx1ZXNcbiAgICBmb3IgKGNvbnN0IFtwcm9wZXJ0eSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHByb3BlcnRpZXMpKSB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRWYWx1ZSA9IGVsZW1lbnQuc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShwcm9wZXJ0eSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldENvbXB1dGVkU3R5bGUoZWxlbWVudClbcHJvcGVydHkgYXMgYW55XTtcbiAgICAgICAgY29uc3QgdGFyZ2V0VmFsdWUgPSAkZ2V0VmFsdWUodmFsdWUpO1xuXG4gICAgICAgIGtleWZyYW1lc1swXVtwcm9wZXJ0eV0gPSBjdXJyZW50VmFsdWU7XG4gICAgICAgIGtleWZyYW1lc1sxXVtwcm9wZXJ0eV0gPSB0YXJnZXRWYWx1ZTtcbiAgICB9XG5cbiAgICAvLyBDYW5jZWwgZXhpc3RpbmcgYW5pbWF0aW9uc1xuICAgIGZvciAoY29uc3QgcHJvcGVydHkgb2YgT2JqZWN0LmtleXMocHJvcGVydGllcykpIHtcbiAgICAgICAgc3RhdGUuY2FuY2VsQW5pbWF0aW9uKHByb3BlcnR5KTtcbiAgICB9XG5cbiAgICBjb25zdCBhbmltYXRpb25PcHRpb25zOiBLZXlmcmFtZUFuaW1hdGlvbk9wdGlvbnMgPSB7XG4gICAgICAgIGR1cmF0aW9uOiBvcHRpb25zLmR1cmF0aW9uIHx8IDMwMCxcbiAgICAgICAgZWFzaW5nOiBvcHRpb25zLmVhc2luZyB8fCAnZWFzZS1vdXQnLFxuICAgICAgICBkZWxheTogb3B0aW9ucy5kZWxheSB8fCAwLFxuICAgICAgICBkaXJlY3Rpb246IG9wdGlvbnMuZGlyZWN0aW9uIHx8ICdub3JtYWwnLFxuICAgICAgICBpdGVyYXRpb25zOiBvcHRpb25zLml0ZXJhdGlvbnMgfHwgMSxcbiAgICAgICAgZmlsbDogb3B0aW9ucy5maWxsIHx8ICdmb3J3YXJkcydcbiAgICB9O1xuXG4gICAgY29uc3QgYW5pbWF0aW9uID0gZWxlbWVudC5hbmltYXRlKGtleWZyYW1lcywgYW5pbWF0aW9uT3B0aW9ucyk7XG5cbiAgICAvLyBTdG9yZSBhbmltYXRpb24gcmVmZXJlbmNlIGZvciBlYWNoIHByb3BlcnR5XG4gICAgZm9yIChjb25zdCBwcm9wZXJ0eSBvZiBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKSkge1xuICAgICAgICBzdGF0ZS5zZXRBbmltYXRpb24ocHJvcGVydHksIGFuaW1hdGlvbik7XG4gICAgfVxuXG4gICAgYW5pbWF0aW9uLmFkZEV2ZW50TGlzdGVuZXIoJ2ZpbmlzaCcsICgpID0+IHtcbiAgICAgICAgZm9yIChjb25zdCBwcm9wZXJ0eSBvZiBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKSkge1xuICAgICAgICAgICAgc3RhdGUuY2FuY2VsQW5pbWF0aW9uKHByb3BlcnR5KTtcbiAgICAgICAgICAgIC8vIEVuc3VyZSBmaW5hbCB2YWx1ZXMgYXJlIHNldFxuICAgICAgICAgICAgY29uc3QgdGFyZ2V0VmFsdWUgPSAkZ2V0VmFsdWUocHJvcGVydGllc1twcm9wZXJ0eV0pO1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShwcm9wZXJ0eSwgdGFyZ2V0VmFsdWUpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbi8qKlxuICogUmVhY3RpdmUgYW5pbWF0aW9uIGJpbmRpbmcgdGhhdCBhdXRvbWF0aWNhbGx5IGFuaW1hdGVzIHdoZW4gdmFsdWVzIGNoYW5nZVxuICovXG5leHBvcnQgZnVuY3Rpb24gYmluZEFuaW1hdGVkU3R5bGUoXG4gICAgZWxlbWVudDogSFRNTEVsZW1lbnQsXG4gICAgcHJvcGVydHlPclByb3BlcnRpZXM6IHN0cmluZyB8IFJlY29yZDxzdHJpbmcsIGFueT4sXG4gICAgcmVhY3RpdmVWYWx1ZTogYW55LFxuICAgIGFuaW1hdGlvblR5cGU6ICdhbmltYXRlJyB8ICd0cmFuc2l0aW9uJyB8ICdzcHJpbmcnIHwgJ21vcnBoJyA9ICdhbmltYXRlJyxcbiAgICBvcHRpb25zOiBBbmltYXRpb25PcHRpb25zIHwgVHJhbnNpdGlvbk9wdGlvbnMgPSB7fVxuKTogKCkgPT4gdm9pZCB7XG4gICAgY29uc3Qgd2VsID0gdG9SZWYoZWxlbWVudCk7XG4gICAgY29uc3Qgd3YgPSB0b1JlZihyZWFjdGl2ZVZhbHVlKTtcblxuICAgIGlmIChhbmltYXRpb25UeXBlID09PSAnbW9ycGgnKSB7XG4gICAgICAgIC8vIEZvciBtb3JwaCBhbmltYXRpb25zLCBwcm9wZXJ0eU9yUHJvcGVydGllcyBzaG91bGQgYmUgYSBSZWNvcmQ8c3RyaW5nLCBhbnk+XG4gICAgICAgIGNvbnN0IHByb3BlcnRpZXMgPSBwcm9wZXJ0eU9yUHJvcGVydGllcyBhcyBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xuXG4gICAgICAgIC8vIEluaXRpYWwgdmFsdWVcbiAgICAgICAgaGFuZGxlTW9ycGhTdHlsZUNoYW5nZShkZXJlZih3ZWwpLCBwcm9wZXJ0aWVzLCBvcHRpb25zKTtcblxuICAgICAgICAvLyBTdWJzY3JpYmUgdG8gY2hhbmdlcyAtIGZvciBtb3JwaCwgd2UgZXhwZWN0IHJlYWN0aXZlVmFsdWUgdG8gYmUgYW4gb2JqZWN0IHdpdGggcmVhY3RpdmUgcHJvcGVydGllc1xuICAgICAgICBjb25zdCB1bmFmZmVjdGVkID0gYWZmZWN0ZWQocmVhY3RpdmVWYWx1ZSwgKG5ld1ZhbHVlKSA9PiB7XG4gICAgICAgICAgICBoYW5kbGVNb3JwaFN0eWxlQ2hhbmdlKGRlcmVmKHdlbCksIHByb3BlcnRpZXMsIG9wdGlvbnMpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdW5zdWJzY3JpYmU7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gRm9yIG90aGVyIGFuaW1hdGlvbiB0eXBlcywgcHJvcGVydHlPclByb3BlcnRpZXMgc2hvdWxkIGJlIGEgc3RyaW5nXG4gICAgICAgIGNvbnN0IHByb3BlcnR5ID0gcHJvcGVydHlPclByb3BlcnRpZXMgYXMgc3RyaW5nO1xuXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSAoYW5pbWF0aW9uVHlwZSA9PT0gJ2FuaW1hdGUnKSA/IGhhbmRsZUFuaW1hdGVkU3R5bGVDaGFuZ2UgOlxuICAgICAgICAgICAgICAgICAgICAgICAoYW5pbWF0aW9uVHlwZSA9PT0gJ3RyYW5zaXRpb24nKSA/IGhhbmRsZVRyYW5zaXRpb25TdHlsZUNoYW5nZSA6XG4gICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZVNwcmluZ1N0eWxlQ2hhbmdlO1xuXG4gICAgICAgIC8vIEluaXRpYWwgdmFsdWVcbiAgICAgICAgaGFuZGxlcihkZXJlZih3ZWwpLCBwcm9wZXJ0eSwgJGdldFZhbHVlKGRlcmVmKHd2KSksIG9wdGlvbnMpO1xuXG4gICAgICAgIC8vIFN1YnNjcmliZSB0byBjaGFuZ2VzXG4gICAgICAgIGNvbnN0IHVuYWZmZWN0ZWQgPSBhZmZlY3RlZChyZWFjdGl2ZVZhbHVlLCAobmV3VmFsdWUpID0+IHtcbiAgICAgICAgICAgIGhhbmRsZXIoZGVyZWYod2VsKSwgcHJvcGVydHksIG5ld1ZhbHVlLCBvcHRpb25zKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHVuc3Vic2NyaWJlO1xuICAgIH1cbn1cblxuLyoqXG4gKiBBbmltYXRpb24gc2VxdWVuY2UgYnVpbGRlciBmb3IgY29tcGxleCBtdWx0aS1zdGFnZSBhbmltYXRpb25zXG4gKi9cbmV4cG9ydCBjbGFzcyBBbmltYXRpb25TZXF1ZW5jZSB7XG4gICAgcHJpdmF0ZSBzdGVwczogQXJyYXk8e1xuICAgICAgICBwcm9wZXJ0aWVzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xuICAgICAgICBvcHRpb25zOiBBbmltYXRpb25PcHRpb25zO1xuICAgICAgICBkZWxheT86IG51bWJlcjtcbiAgICB9PiA9IFtdO1xuXG4gICAgYWRkU3RlcChwcm9wZXJ0aWVzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+LCBvcHRpb25zOiBBbmltYXRpb25PcHRpb25zID0ge30sIGRlbGF5ID0gMCkge1xuICAgICAgICB0aGlzLnN0ZXBzLnB1c2goeyBwcm9wZXJ0aWVzLCBvcHRpb25zLCBkZWxheSB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgYXN5bmMgcGxheShlbGVtZW50OiBIVE1MRWxlbWVudCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBmb3IgKGNvbnN0IHN0ZXAgb2YgdGhpcy5zdGVwcykge1xuICAgICAgICAgICAgaWYgKHN0ZXAuZGVsYXkpIHtcbiAgICAgICAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgc3RlcC5kZWxheSkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgICAgIGhhbmRsZU1vcnBoU3R5bGVDaGFuZ2UoZWxlbWVudCwgc3RlcC5wcm9wZXJ0aWVzLCB7XG4gICAgICAgICAgICAgICAgICAgIC4uLnN0ZXAub3B0aW9ucyxcbiAgICAgICAgICAgICAgICAgICAgZmlsbDogJ2ZvcndhcmRzJ1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgLy8gV2FpdCBmb3IgYW5pbWF0aW9uIHRvIGNvbXBsZXRlXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChyZXNvbHZlLCBzdGVwLm9wdGlvbnMuZHVyYXRpb24gfHwgMjAwKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIGNyZWF0ZSgpOiBBbmltYXRpb25TZXF1ZW5jZSB7XG4gICAgICAgIHJldHVybiBuZXcgQW5pbWF0aW9uU2VxdWVuY2UoKTtcbiAgICB9XG59XG5cbi8qKlxuICogQW5pbWF0aW9uIHByZXNldHMgZm9yIGNvbW1vbiB1c2UgY2FzZXNcbiAqL1xuZXhwb3J0IGNvbnN0IEFuaW1hdGlvblByZXNldHMgPSB7XG4gICAgLy8gU21vb3RoIGZhZGUgaW4vb3V0XG4gICAgZmFkZToge1xuICAgICAgICBkdXJhdGlvbjogMjAwLFxuICAgICAgICBlYXNpbmc6ICdlYXNlLWluLW91dCdcbiAgICB9LFxuXG4gICAgLy8gQm91bmNlIGVmZmVjdFxuICAgIGJvdW5jZToge1xuICAgICAgICBkdXJhdGlvbjogNDAwLFxuICAgICAgICBlYXNpbmc6ICdjdWJpYy1iZXppZXIoMC42OCwgLTAuNTUsIDAuMjY1LCAxLjU1KSdcbiAgICB9LFxuXG4gICAgLy8gRWxhc3RpYyBlZmZlY3RcbiAgICBlbGFzdGljOiB7XG4gICAgICAgIGR1cmF0aW9uOiA2MDAsXG4gICAgICAgIGVhc2luZzogJ2N1YmljLWJlemllcigwLjY4LCAtMC41NSwgMC4yNjUsIDEuNTUpJ1xuICAgIH0sXG5cbiAgICAvLyBTbGlkZSBpbiBmcm9tIGRpcmVjdGlvblxuICAgIHNsaWRlSW46IChkaXJlY3Rpb246ICdsZWZ0JyB8ICdyaWdodCcgfCAndXAnIHwgJ2Rvd24nKSA9PiAoe1xuICAgICAgICBkdXJhdGlvbjogMzAwLFxuICAgICAgICBlYXNpbmc6ICdlYXNlLW91dCcsXG4gICAgICAgIHRyYW5zZm9ybTogYHRyYW5zbGF0ZSR7ZGlyZWN0aW9uID09PSAnbGVmdCcgfHwgZGlyZWN0aW9uID09PSAncmlnaHQnID8gJ1gnIDogJ1knfSgke2RpcmVjdGlvbiA9PT0gJ2xlZnQnIHx8IGRpcmVjdGlvbiA9PT0gJ3VwJyA/ICctJyA6ICcnfTEwMCUpYFxuICAgIH0pLFxuXG4gICAgLy8gU2NhbGUgZWZmZWN0XG4gICAgc2NhbGU6IHtcbiAgICAgICAgZHVyYXRpb246IDIwMCxcbiAgICAgICAgZWFzaW5nOiAnZWFzZS1pbi1vdXQnXG4gICAgfVxufTtcblxuLyoqXG4gKiBDbGVhbnVwIGZ1bmN0aW9uIHRvIGNhbmNlbCBhbGwgYW5pbWF0aW9ucyBmb3IgYW4gZWxlbWVudFxuICovXG5leHBvcnQgZnVuY3Rpb24gY2FuY2VsRWxlbWVudEFuaW1hdGlvbnMoZWxlbWVudDogSFRNTEVsZW1lbnQpOiB2b2lkIHtcbiAgICBjb25zdCBzdGF0ZSA9IGFuaW1hdGlvblN0YXRlcy5nZXQoZWxlbWVudCk7XG4gICAgaWYgKHN0YXRlKSB7XG4gICAgICAgIHN0YXRlLmNhbmNlbEFsbChlbGVtZW50KTtcbiAgICAgICAgYW5pbWF0aW9uU3RhdGVzLmRlbGV0ZShlbGVtZW50KTtcbiAgICB9XG59XG5cbi8qKlxuICogVXRpbGl0eSB0byBjcmVhdGUgYW5pbWF0ZWQgcmVhY3RpdmUgcmVmZXJlbmNlc1xuICovXG5leHBvcnQgZnVuY3Rpb24gYW5pbWF0ZWRSZWYoaW5pdGlhbFZhbHVlOiBhbnksIGFuaW1hdGlvblR5cGU6ICdhbmltYXRlJyB8ICd0cmFuc2l0aW9uJyB8ICdzcHJpbmcnID0gJ2FuaW1hdGUnLCBvcHRpb25zOiBhbnkgPSB7fSkge1xuICAgIGNvbnN0IHJlZiA9IHR5cGVvZiBpbml0aWFsVmFsdWUgPT09ICdudW1iZXInID8gbnVtYmVyUmVmKGluaXRpYWxWYWx1ZSkgOiBzdHJpbmdSZWYoaW5pdGlhbFZhbHVlKTtcblxuICAgIC8vIEV4dGVuZCByZWYgd2l0aCBhbmltYXRpb24gbWV0YWRhdGFcbiAgICAocmVmIGFzIGFueSkuJGFuaW1hdGlvblR5cGUgPSBhbmltYXRpb25UeXBlO1xuICAgIChyZWYgYXMgYW55KS4kYW5pbWF0aW9uT3B0aW9ucyA9IG9wdGlvbnM7XG5cbiAgICByZXR1cm4gcmVmO1xufVxuXG4vL1xuZXhwb3J0IGNvbnN0IGVmZmVjdFByb3BlcnR5ID0geyBmaWxsOiBcImJvdGhcIiwgZGVsYXk6IDAsIGVhc2luZzogXCJsaW5lYXJcIiwgcmFuZ2VTdGFydDogXCJjb3ZlciAwJVwiLCByYW5nZUVuZDogXCJjb3ZlciAxMDAlXCIsIGR1cmF0aW9uOiAxIH07XG5leHBvcnQgY29uc3QgYW5pbWF0ZUJ5VGltZWxpbmUgPSBhc3luYyAoc291cmNlOiBIVE1MRWxlbWVudCwgcHJvcGVydGllcyA9IHt9LCB0aW1lbGluZT86IGFueSkgPT4ge1xuICAgIGlmICghc291cmNlIHx8ICF0aW1lbGluZSkgcmV0dXJuO1xuXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGlmICh0aW1lbGluZSBpbnN0YW5jZW9mIFNjcm9sbFRpbWVsaW5lIHx8IHRpbWVsaW5lIGluc3RhbmNlb2YgVmlld1RpbWVsaW5lKSB7XG4gICAgICAgIHJldHVybiBzb3VyY2U/LmFuaW1hdGU/Lihwcm9wZXJ0aWVzLCB7IC4uLmVmZmVjdFByb3BlcnR5IGFzIGFueSwgdGltZWxpbmU6IHRpbWVsaW5lPy5bJGV4dHJhY3RdID8/IHRpbWVsaW5lIH0pO1xuICAgIH1cblxuICAgIC8vXG4gICAgY29uc3QgIHRhcmdldCAgPSB0b1JlZihzb3VyY2UpLCB3ayA9IHRvUmVmKHRpbWVsaW5lKTtcbiAgICBjb25zdCByZW5kZXJDYiA9IChbbmFtZSwgJHZdKSA9PiB7XG4gICAgICAgIGNvbnN0IHRnID0gZGVyZWYodGFyZ2V0KTsgaWYgKHRnKSB7XG4gICAgICAgICAgICBjb25zdCB2YWwgPSBkZXJlZih3ayk/LnZhbHVlIHx8IDAsIHZhbHVlcyA9ICR2IGFzIFthbnksIGFueV07XG4gICAgICAgICAgICBzZXRQcm9wZXJ0eSh0ZywgbmFtZSwgKHZhbHVlc1swXSAqICgxIC0gdmFsKSArIHZhbHVlc1sxXSAqIHZhbCkpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvL1xuICAgIGNvbnN0IHNjaGVkdWxlciA9IG1ha2VSQUZDeWNsZSgpO1xuICAgIGNvbnN0ICBldmVyeUNiICA9ICgpPT5PYmplY3QuZW50cmllcyhwcm9wZXJ0aWVzKT8uZm9yRWFjaD8uKHJlbmRlckNiKTtcbiAgICByZXR1cm4gYWZmZWN0ZWQodGltZWxpbmUsICh2YWw6IGFueSkgPT4gc2NoZWR1bGVyPy5zY2hlZHVsZT8uKGV2ZXJ5Q2IpKTtcbn1cblxuXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIEV4cG9ydCBBbmltYXRpb24gQmluZGluZyBGdW5jdGlvbnNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLypcbmV4cG9ydCB7XG4gICAgYmluZEFuaW1hdGVkLFxuICAgIGJpbmRUcmFuc2l0aW9uLFxuICAgIGJpbmRTcHJpbmcsXG4gICAgYmluZE1vcnBoLFxuICAgIGJpbmRBbmltYXRlZEJhdGNoLFxuICAgIGJpbmRQcmVzZXQsXG4gICAgYmluZENvbmRpdGlvbmFsQW5pbWF0aW9uLFxuICAgIGNyZWF0ZUFuaW1hdGlvblNlcXVlbmNlLFxuICAgIGNhbmNlbEVsZW1lbnRBbmltYXRpb25zLFxuICAgIGFuaW1hdGVkUmVmLFxuICAgIEFuaW1hdGlvblByZXNldHMsXG4gICAgdHlwZSBBbmltYXRpb25PcHRpb25zLFxuICAgIHR5cGUgVHJhbnNpdGlvbk9wdGlvbnNcbn07XG4qL1xuIl19