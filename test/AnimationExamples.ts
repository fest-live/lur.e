// Animation Binding Examples
// Demonstrates the new animation-based binding/reference types

import { numberRef, makeReactive } from "fest/object";
import {
    bindAnimated, bindTransition, bindSpring, bindMorph,
    bindAnimatedBatch, bindPreset, bindConditionalAnimation,
    createAnimationSequence, cancelAnimations
} from "fest/lure";
import { CSSBinder } from "../src/math/CSSAdapter";

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
    const transform = numberRef('scale(1)');

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
    const unbindTransform = bindSpring(element, 'transform', transform, {
        stiffness: 200,
        damping: 15
    });

    // Usage
    width.value = 200;  // Animates width over 500ms
    opacity.value = 0.5; // Transitions opacity over 300ms
    transform.value = 'scale(1.2) rotate(45deg)'; // Springs to new transform

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
    const buttonState = makeReactive({
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

    const isActive = numberRef(false);
    const hue = numberRef(200);

    // Conditional animations based on isActive state
    const unbind = bindConditionalAnimation(indicator, isActive, {
        true: [
            {
                property: 'backgroundColor',
                value: operated([hue], h => `hsl(${h}, 70%, 50%)`),
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

// Helper function for reactive operations (assuming it's imported)
function operated(deps: any[], compute: (...args: any[]) => any) {
    // This would typically come from the object.ts library
    return compute(...deps.map(d => d?.value ?? d));
}

function vector2Ref(x: number, y: number) {
    // This would typically come from the math library
    return { x: numberRef(x), y: numberRef(y) };
}
