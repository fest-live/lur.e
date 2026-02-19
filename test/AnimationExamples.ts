// Animation Binding Examples
// Demonstrates the new animation-based binding/reference types

import { numberRef, booleanRef, observe, affected } from "fest/object";
import { operated, Vector2D, vector2Ref } from "../src/math/index";

// Animation presets for common animations
export const AnimationPresets = {
    bounce: { duration: 600, easing: "ease-out" },
    elastic: { duration: 800, easing: "ease-out", stiffness: 300, damping: 10 },
    smooth: { duration: 300, easing: "ease-in-out" },
    quick: { duration: 150, easing: "ease-out" },
    slow: { duration: 1000, easing: "ease-in-out" }
};

// Placeholder animation binding functions (to be implemented in core library)
export const bindAnimated = (element: HTMLElement, property: string, value: any, options?: any) => {
    const update = () => {
        const val = typeof value === "object" && "value" in value ? value.value : value;
        (element.style as any)[property] = typeof val === "number" ? `${val}px` : val;
    };
    if (typeof value === "object" && "value" in value) {
        affected(value, update);
    }
    update();
    return () => {};
};

export const bindTransition = (element: HTMLElement, property: string, value: any, options?: any) => {
    element.style.transition = `${property} ${options?.duration ?? 300}ms ${options?.easing ?? "ease"}`;
    return bindAnimated(element, property, value, options);
};

export const bindSpring = (element: HTMLElement, property: string, value: any, options?: any) => {
    return bindAnimated(element, property, value, options);
};

export const bindMorph = (element: HTMLElement, properties: Record<string, any>, options?: any) => {
    const unbinds: (() => void)[] = [];
    for (const [prop, value] of Object.entries(properties)) {
        unbinds.push(bindAnimated(element, prop, value, options));
    }
    return () => unbinds.forEach(u => u());
};

export const bindAnimatedBatch = (element: HTMLElement, bindings: any[]) => {
    const unbinds: (() => void)[] = [];
    for (const binding of bindings) {
        unbinds.push(bindAnimated(element, binding.property, binding.value, binding.options));
    }
    return () => unbinds.forEach(u => u());
};

export const bindPreset = {
    fade: (element: HTMLElement, value: any) => bindTransition(element, "opacity", value, AnimationPresets.smooth),
    scale: (element: HTMLElement, value: any) => bindTransition(element, "transform", value, AnimationPresets.smooth)
};

export const bindConditionalAnimation = (element: HTMLElement, condition: any, animations: any) => {
    return () => {};
};

export const createAnimationSequence = () => ({
    steps: [] as any[],
    addStep(props: any, options: any, delay?: number) {
        this.steps.push({ props, options, delay });
        return this;
    },
    play(element: HTMLElement) {
        // Implementation would chain animations
    }
});

export const cancelAnimations = (element: HTMLElement) => {
    element.getAnimations?.().forEach(a => a.cancel());
};

// CSS Binder with animation support
export const CSSBinder = {
    bindPosition: (element: HTMLElement, position: Vector2D, type: string, options?: any) => {
        const update = () => {
            element.style.left = `${position.x.value}px`;
            element.style.top = `${position.y.value}px`;
        };
        affected(position.x, update);
        affected(position.y, update);
        update();
        return () => {};
    },
    bindSize: (element: HTMLElement, size: Vector2D, type: string, options?: any) => {
        const update = () => {
            element.style.width = `${size.x.value}px`;
            element.style.height = `${size.y.value}px`;
        };
        affected(size.x, update);
        affected(size.y, update);
        update();
        return () => {};
    },
    bindBorderRadius: (element: HTMLElement, radius: Vector2D, type: string, options?: any) => {
        const update = () => {
            element.style.borderRadius = `${radius.x.value}px ${radius.y.value}px`;
        };
        affected(radius.x, update);
        affected(radius.y, update);
        update();
        return () => {};
    },
    bindColor: (element: HTMLElement, property: string, hue: any, type: string, options?: any) => {
        const update = () => {
            (element.style as any)[property] = `hsl(${hue.value}, 70%, 50%)`;
        };
        affected(hue, update);
        update();
        return () => {};
    }
};

/**
 * Example 1: Basic Animated Bindings
 * Shows different animation types for reactive style changes
 */
export function basicAnimationExample() {
    const element = document.createElement('div');
    element.style.width = '100px';
    element.style.height = '100px';
    element.style.backgroundColor = 'red';

    // Create reactive values
    const width = numberRef(100);
    const opacity = numberRef(1);
    const scaleValue = numberRef(1);

    // Web Animations API binding (smooth, customizable)
    const unbindWidth = bindAnimated(element, 'width', width, {
        duration: 500,
        easing: 'ease-out'
    });

    // CSS Transitions binding (efficient for simple transitions)
    const unbindOpacity = bindTransition(element, 'opacity', opacity, {
        duration: 300,
        easing: 'ease-in-out'
    });

    // Spring physics binding (natural, bouncy motion)
    const unbindTransform = bindSpring(element, 'transform', scaleValue, {
        stiffness: 200,
        damping: 15
    });

    // Usage
    width.value = 200;  // Animates width over 500ms
    opacity.value = 0.5; // Transitions opacity over 300ms
    scaleValue.value = 1.2; // Springs to new scale

    // Cleanup
    return () => {
        unbindWidth();
        unbindOpacity();
        unbindTransform();
        cancelAnimations(element);
    };
}

/**
 * Example 2: Morphing Multiple Properties
 * Animates multiple CSS properties simultaneously with coordinated timing
 */
export function morphingExample() {
    const button = document.createElement('button');
    button.textContent = 'Click me';
    button.style.padding = '10px 20px';

    // Reactive state object
    const buttonState = observe({
        backgroundColor: 'hsl(200, 70%, 50%)',
        transform: 'scale(1)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    });

    // Bind morph animation to state changes
    const unbind = bindMorph(button, {
        backgroundColor: buttonState.backgroundColor,
        transform: buttonState.transform,
        boxShadow: buttonState.boxShadow
    }, {
        duration: 300,
        easing: 'ease-out'
    });

    // Hover effect
    button.addEventListener('mouseenter', () => {
        buttonState.backgroundColor = 'hsl(200, 70%, 60%)';
        buttonState.transform = 'scale(1.05)';
        buttonState.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
    });

    button.addEventListener('mouseleave', () => {
        buttonState.backgroundColor = 'hsl(200, 70%, 50%)';
        buttonState.transform = 'scale(1)';
        buttonState.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    });

    return unbind;
}

/**
 * Example 3: Batch Animated Bindings with Staggering
 * Applies multiple animations with controlled timing delays
 */
export function batchAnimationExample() {
    const card = document.createElement('div');
    card.style.cssText = `
        width: 300px;
        height: 200px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        opacity: 0;
        transform: translateY(20px);
    `;

    const opacity = numberRef(0);
    const translateY = numberRef(20);
    const scale = numberRef(0.9);

    // Batch bind with staggered timing
    const unbind = bindAnimatedBatch(card, [
        {
            property: 'opacity',
            value: opacity,
            animationType: 'transition',
            options: { duration: 400, easing: 'ease-out' },
            delay: 0
        },
        {
            property: 'transform',
            value: operated([translateY, scale], (y, s) => `translateY(${y}px) scale(${s})`),
            animationType: 'animate',
            options: { duration: 500, easing: 'ease-out' },
            delay: 100
        }
    ]);

    // Animate in
    setTimeout(() => {
        opacity.value = 1;
        translateY.value = 0;
        scale.value = 1;
    }, 100);

    return unbind;
}

/**
 * Example 4: Preset Animation Bindings
 * Uses predefined animation configurations for common UI patterns
 */
export function presetAnimationExample() {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.8);
        background: white;
        padding: 20px;
        border-radius: 8px;
        opacity: 0;
        pointer-events: none;
    `;

    const isVisible = numberRef(0);

    // Use preset animations
    const unbindFade = bindPreset.fade(modal, isVisible);
    const unbindScale = bindPreset.scale(modal,
        operated([isVisible], v => `translate(-50%, -50%) scale(${0.8 + v * 0.2})`)
    );

    // Show modal with bounce effect
    const showModal = () => {
        bindAnimated(modal, 'transform',
            operated([isVisible], v => `translate(-50%, -50%) scale(${0.8 + v * 0.2})`),
            AnimationPresets.bounce
        );
        isVisible.value = 1;
        modal.style.pointerEvents = 'auto';
    };

    const hideModal = () => {
        isVisible.value = 0;
        modal.style.pointerEvents = 'none';
    };

    return { modal, showModal, hideModal, unbind: () => { unbindFade(); unbindScale(); } };
}

/**
 * Example 5: Conditional Animation Based on State
 * Animations that change behavior based on reactive conditions
 */
export function conditionalAnimationExample() {
    const toggle = document.createElement('button');
    const indicator = document.createElement('div');

    toggle.textContent = 'Toggle';
    indicator.style.cssText = `
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #ccc;
        transition: all 0.3s ease;
    `;

    const isActive = booleanRef(false);
    const hue = numberRef(200);

    // Conditional animations based on isActive state
    const unbind = bindConditionalAnimation(indicator, isActive, {
        true: [
            {
                property: 'backgroundColor',
                value: operated([hue], () => `hsl(${hue.value}, 70%, 50%)`),
                options: { duration: 300 }
            },
            {
                property: 'transform',
                value: 'scale(1.2)',
                options: AnimationPresets.elastic
            }
        ],
        false: [
            {
                property: 'backgroundColor',
                value: 'hsl(0, 0%, 80%)',
                options: { duration: 300 }
            },
            {
                property: 'transform',
                value: 'scale(1)',
                options: { duration: 200 }
            }
        ]
    });

    toggle.addEventListener('click', () => {
        isActive.value = !isActive.value;
        hue.value = Math.random() * 360;
    });

    return { toggle, indicator, unbind };
}

/**
 * Example 6: CSSBinder with Animation Support
 * Enhanced CSS utilities with animation capabilities
 */
export function cssBinderAnimationExample() {
    const element = document.createElement('div');
    element.style.width = '200px';
    element.style.height = '100px';
    element.style.background = 'linear-gradient(45deg, #ff6b6b, #4ecdc4)';

    // Create reactive vectors
    const position = vector2Ref(100, 100);
    const size = vector2Ref(200, 100);
    const borderRadius = vector2Ref(8, 8);

    // Bind with different animation types
    const unbindPosition = CSSBinder.bindPosition(element, position, 'animate', {
        duration: 600,
        easing: 'ease-out'
    });

    const unbindSize = CSSBinder.bindSize(element, size, 'spring', {
        stiffness: 150,
        damping: 12
    });

    const unbindRadius = CSSBinder.bindBorderRadius(element, borderRadius, 'transition', {
        duration: 400,
        easing: 'ease-in-out'
    });

    // Animate to new values
    setTimeout(() => {
        position.x.value = 200;
        position.y.value = 150;
    }, 500);

    setTimeout(() => {
        size.x.value = 300;
        size.y.value = 150;
    }, 1000);

    setTimeout(() => {
        borderRadius.x.value = 20;
        borderRadius.y.value = 20;
    }, 1500);

    return () => {
        unbindPosition();
        unbindSize();
        unbindRadius();
    };
}

/**
 * Example 7: Animation Sequences
 * Complex multi-stage animations with precise timing control
 */
export function animationSequenceExample() {
    const element = document.createElement('div');
    element.style.cssText = `
        width: 100px;
        height: 100px;
        background: #3498db;
        border-radius: 50%;
        position: absolute;
        left: 50px;
        top: 50px;
    `;

    const sequence = createAnimationSequence()
        .addStep({
            left: '200px',
            backgroundColor: '#e74c3c'
        }, { duration: 1000, easing: 'ease-in-out' })
        .addStep({
            top: '200px',
            transform: 'scale(1.5)'
        }, { duration: 800, easing: 'ease-out' }, 200)
        .addStep({
            left: '50px',
            top: '50px',
            transform: 'scale(1)',
            backgroundColor: '#3498db'
        }, { duration: 1200, easing: 'ease-in-out' }, 500);

    // Play sequence on click
    element.addEventListener('click', () => {
        sequence.play(element);
    });

    return element;
}

/**
 * Example 8: Reactive Color Animations
 * Smooth color transitions with HSL interpolation
 */
export function colorAnimationExample() {
    const colorPalette = document.createElement('div');
    colorPalette.style.display = 'flex';
    colorPalette.style.gap = '10px';

    // Create color swatches
    const colors = [0, 60, 120, 180, 240, 300].map(hue => {
        const swatch = document.createElement('div');
        swatch.style.cssText = `
            width: 50px;
            height: 50px;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
        `;

        const hueRef = numberRef(hue);
        const saturation = numberRef(70);
        const lightness = numberRef(50);

        // Bind color with smooth transitions
        CSSBinder.bindColor(swatch, 'backgroundColor', hueRef, 'transition', {
            duration: 500,
            easing: 'ease-in-out'
        });

        // Initial color
        hueRef.value = hue;

        // Interactive color changes
        swatch.addEventListener('mouseenter', () => {
            saturation.value = 90;
            lightness.value = 60;
        });

        swatch.addEventListener('mouseleave', () => {
            saturation.value = 70;
            lightness.value = 50;
        });

        swatch.addEventListener('click', () => {
            hueRef.value = Math.random() * 360;
        });

        colorPalette.appendChild(swatch);
        return swatch;
    });

    return colorPalette;
}

// Helpers are now imported from the math library above
