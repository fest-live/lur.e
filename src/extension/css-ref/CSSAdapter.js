import { numberRef } from "fest/object";
import { bindWith, bindAnimated, bindTransition, bindSpring, bindMorph } from "fest/lure";
import { Vector2D, operated, Matrix4D } from "../../math/index";
import { handleStyleChange } from "fest/dom";
// CSS Typed OM and Unit Conversion Utilities
export class CSSUnitConverter {
    static unitPatterns = {
        px: /(-?\d*\.?\d+)px/g,
        em: /(-?\d*\.?\d+)em/g,
        rem: /(-?\d*\.?\d+)rem/g,
        vh: /(-?\d*\.?\d+)vh/g,
        vw: /(-?\d*\.?\d+)vw/g,
        vmin: /(-?\d*\.?\d+)vmin/g,
        vmax: /(-?\d*\.?\d+)vmax/g,
        percent: /(-?\d*\.?\d+)%/g
    };
    // Convert CSS value to pixels
    static toPixels(value, element) {
        if (!value)
            return 0;
        const testElement = element || document.body;
        const testDiv = document.createElement('div');
        testDiv.style.position = 'absolute';
        testDiv.style.visibility = 'hidden';
        testDiv.style.width = value;
        testElement.appendChild(testDiv);
        const pixels = testDiv.offsetWidth;
        testElement.removeChild(testDiv);
        return pixels;
    }
    // Convert pixels to CSS unit
    static fromPixels(pixels, unit = 'px') {
        switch (unit) {
            case 'em':
                const fontSize = parseFloat(getComputedStyle(document.body).fontSize);
                return `${pixels / fontSize}em`;
            case 'rem':
                const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
                return `${pixels / rootFontSize}rem`;
            case '%':
                return `${(pixels / globalThis.innerWidth) * 100}%`;
            default:
                return `${pixels}px`;
        }
    }
    // Parse CSS value with units
    static parseValue(cssValue) {
        const match = cssValue.match(/^(-?\d*\.?\d+)([a-z%]+)?$/);
        if (!match)
            return { value: 0, unit: 'px' };
        return {
            value: parseFloat(match[1]),
            unit: match[2] || 'px'
        };
    }
    // Convert between units
    static convertUnits(value, fromUnit, toUnit, element) {
        if (fromUnit === toUnit)
            return value;
        // Convert to pixels first
        let pixels;
        switch (fromUnit) {
            case 'px':
                pixels = value;
                break;
            case 'em':
                const fontSize = parseFloat(getComputedStyle(element || document.body).fontSize);
                pixels = value * fontSize;
                break;
            case 'rem':
                const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
                pixels = value * rootFontSize;
                break;
            case '%':
                pixels = (value / 100) * globalThis.innerWidth;
                break;
            case 'vw':
                pixels = (value / 100) * globalThis.innerWidth;
                break;
            case 'vh':
                pixels = (value / 100) * globalThis.innerHeight;
                break;
            default:
                pixels = value;
        }
        // Convert from pixels to target unit
        switch (toUnit) {
            case 'px':
                return pixels;
            case 'em':
                const fontSize = parseFloat(getComputedStyle(element || document.body).fontSize);
                return pixels / fontSize;
            case 'rem':
                const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
                return pixels / rootFontSize;
            case '%':
                return (pixels / globalThis.innerWidth) * 100;
            case 'vw':
                return (pixels / globalThis.innerWidth) * 100;
            case 'vh':
                return (pixels / globalThis.innerHeight) * 100;
            default:
                return pixels;
        }
    }
}
// CSS Transform Utilities with Reactive Math
export class CSSTransform {
    // Convert reactive Vector2D to CSS translate
    static translate2D(vector) {
        return operated([vector.x, vector.y], () => `translate(${vector.x.value}px, ${vector.y.value}px)`);
    }
    // Convert reactive Vector2D to CSS translate3d
    static translate3D(vector, z = numberRef(0)) {
        return operated([vector.x, vector.y, z], () => `translate3d(${vector.x.value}px, ${vector.y.value}px, ${z.value}px)`);
    }
    // Convert reactive Vector2D to CSS scale
    static scale2D(vector) {
        return operated([vector.x, vector.y], () => `scale(${vector.x.value}, ${vector.y.value})`);
    }
    // Convert reactive number to CSS rotate
    static rotate(angle) {
        return operated([angle], () => `rotate(${angle.value}deg)`);
    }
    // Combine transforms into single CSS transform string
    static combine(transforms) {
        return operated(transforms, () => transforms.map(t => t.value).join(' '));
    }
    // Create matrix transform from reactive Matrix2D
    static matrix2D(matrix) {
        return operated(matrix.elements, () => `matrix(${matrix.elements.map(e => e.value).join(', ')})`);
    }
    // Create matrix3d transform from reactive Matrix4D
    static matrix3D(matrix) {
        return operated(matrix.elements, () => `matrix3d(${matrix.elements.map(e => e.value).join(', ')})`);
    }
}
// CSS Position and Size Utilities
export class CSSPosition {
    // Convert reactive Vector2D to CSS position values
    static leftTop(vector) {
        return {
            left: operated([vector.x], () => `${vector.x.value}px`),
            top: operated([vector.y], () => `${vector.y.value}px`)
        };
    }
    // Convert reactive Vector2D to CSS inset values
    static inset(vector) {
        return {
            inset: operated([vector.x, vector.y], () => `${vector.y.value}px ${vector.x.value}px`)
        };
    }
    // Convert reactive Vector2D to CSS size values
    static size(vector) {
        return {
            width: operated([vector.x], () => `${vector.x.value}px`),
            height: operated([vector.y], () => `${vector.y.value}px`)
        };
    }
}
// CSS Reactive Binding Utilities
export class CSSBinder {
    // Bind reactive Vector2D to CSS transform
    static bindTransform(element, vector, animationType = 'instant', options) {
        const transformValue = CSSTransform.translate2D(vector);
        const binder = animationType === 'instant' ? bindWith :
            animationType === 'animate' ? bindAnimated :
                animationType === 'transition' ? bindTransition : bindSpring;
        return binder(element, 'transform', transformValue, options) ?? (() => { });
    }
    // Bind reactive Vector2D to CSS position
    static bindPosition(element, vector, animationType = 'instant', options) {
        const position = CSSPosition.leftTop(vector);
        const binder = animationType === 'instant' ? bindWith :
            animationType === 'animate' ? bindAnimated :
                animationType === 'transition' ? bindTransition : bindSpring;
        const unsubLeft = binder(element, 'left', position.left, options) ?? (() => { });
        const unsubTop = binder(element, 'top', position.top, options) ?? (() => { });
        return () => { unsubLeft?.(); unsubTop?.(); };
    }
    // Bind reactive Vector2D to CSS size
    static bindSize(element, vector, animationType = 'instant', options) {
        const size = CSSPosition.size(vector);
        const binder = animationType === 'instant' ? bindWith :
            animationType === 'animate' ? bindAnimated :
                animationType === 'transition' ? bindTransition : bindSpring;
        const unsubWidth = binder(element, 'width', size.width, options) ?? (() => { });
        const unsubHeight = binder(element, 'height', size.height, options) ?? (() => { });
        return () => { unsubWidth?.(); unsubHeight?.(); };
    }
    // Bind reactive value with unit conversion
    static bindWithUnit(element, property, value, unit = 'px', animationType = 'instant', options) {
        const cssValue = operated([value], () => `${value.value}${unit}`);
        const binder = animationType === 'instant' ? bindWith :
            animationType === 'animate' ? bindAnimated :
                animationType === 'transition' ? bindTransition : bindSpring;
        return binder(element, property, cssValue, options) ?? (() => { });
    }
    // Bind reactive vector with unit conversion
    static bindVectorWithUnit(element, vector, unit = 'px', animationType = 'instant', options) {
        const cssValue = operated([vector.x, vector.y], () => `${vector.x.value}${unit} ${vector.y.value}${unit}`);
        const binder = animationType === 'instant' ? bindWith :
            animationType === 'animate' ? bindAnimated :
                animationType === 'transition' ? bindTransition : bindSpring;
        return binder(element, 'transform', cssValue, {
            ...options,
            handler: animationType === 'instant' ? undefined : (el, val) => {
                el.style.setProperty('transform', `translate(${val})`);
            }
        }) ?? (() => { });
    }
    // Enhanced animation methods with morphing support
    static bindTransformMorph(element, transformProps, options = {}) {
        const transforms = {};
        if (transformProps.translate) {
            transforms.transform = operated([transformProps.translate.x, transformProps.translate.y], () => `translate(${transformProps.translate.x.value}px, ${transformProps.translate.y.value}px)`);
        }
        if (transformProps.scale) {
            const scaleStr = transformProps.scale instanceof Vector2D ?
                operated([transformProps.scale.x, transformProps.scale.y], () => `scale(${transformProps.scale.x.value}, ${transformProps.scale.y.value})`) :
                operated([transformProps.scale], () => `scale(${transformProps.scale.value})`);
            transforms.transform = transforms.transform ?
                operated([transforms.transform, scaleStr], (t, s) => `${t} ${s}`) : scaleStr;
        }
        if (transformProps.rotate) {
            const rotateStr = operated([transformProps.rotate], () => `rotate(${transformProps.rotate.value}deg)`);
            transforms.transform = transforms.transform ?
                operated([transforms.transform, rotateStr], (t, r) => `${t} ${r}`) : rotateStr;
        }
        if (transformProps.skew) {
            const skewStr = operated([transformProps.skew.x, transformProps.skew.y], () => `skew(${transformProps.skew.x.value}deg, ${transformProps.skew.y.value}deg)`);
            transforms.transform = transforms.transform ?
                operated([transforms.transform, skewStr], (t, s) => `${t} ${s}`) : skewStr;
        }
        return bindMorph(element, transforms, options);
    }
    // Bind reactive color with smooth transitions
    static bindColor(element, property, color, animationType = 'transition', options = { duration: 300, easing: 'ease-in-out' }) {
        const binder = animationType === 'instant' ? bindWith :
            animationType === 'animate' ? bindAnimated : bindTransition;
        const colorValue = typeof color === 'string' ? color :
            operated([color], () => `hsl(${color.value}, 70%, 50%)`);
        return binder(element, property, colorValue, options) ?? (() => { });
    }
    // Bind reactive opacity with fade effects
    static bindOpacity(element, opacity, animationType = 'transition', options = { duration: 200, easing: 'ease-in-out' }) {
        const binder = animationType === 'instant' ? bindWith :
            animationType === 'animate' ? bindAnimated :
                animationType === 'transition' ? bindTransition : bindSpring;
        return binder(element, 'opacity', opacity, options) ?? (() => { });
    }
    // Bind reactive border radius with morphing
    static bindBorderRadius(element, radius, animationType = 'animate', options = { duration: 300, easing: 'ease-out' }) {
        const binder = animationType === 'instant' ? bindWith :
            animationType === 'animate' ? bindAnimated :
                animationType === 'transition' ? bindTransition : bindSpring;
        const radiusValue = radius instanceof Vector2D ?
            operated([radius.x, radius.y], () => `${radius.x.value}px ${radius.y.value}px`) :
            operated([radius], () => `${radius.value}px`);
        return binder(element, 'border-radius', radiusValue, options) ?? (() => { });
    }
}
// CSS Calc/Math Operations
export class CSSCalc {
    // Create CSS calc expression from reactive values
    static add(a, b, unit = 'px') {
        return operated([a, b], () => `calc(${a.value}${unit} + ${b.value}${unit})`);
    }
    static subtract(a, b, unit = 'px') {
        return operated([a, b], () => `calc(${a.value}${unit} - ${b.value}${unit})`);
    }
    static multiply(a, b) {
        return operated([a, b], () => `calc(${a.value} * ${b.value})`);
    }
    static divide(a, b) {
        return operated([a, b], () => `calc(${a.value} / ${b.value})`);
    }
    // Clamp reactive value between min and max
    static clamp(value, min, max, unit = 'px') {
        return operated([value, min, max], () => `clamp(${min.value}${unit}, ${value.value}${unit}, ${max.value}${unit})`);
    }
    // Min/max operations
    static min(a, b, unit = 'px') {
        return operated([a, b], () => `min(${a.value}${unit}, ${b.value}${unit})`);
    }
    static max(a, b, unit = 'px') {
        return operated([a, b], () => `max(${a.value}${unit}, ${b.value}${unit})`);
    }
}
// DOM Matrix Integration
export class DOMMatrixAdapter {
    // Convert reactive Matrix4D to DOMMatrix
    static toDOMMatrix(matrix) {
        return new DOMMatrix(matrix.elements.map(e => e.value));
    }
    // Convert DOMMatrix to reactive Matrix4D
    static fromDOMMatrix(domMatrix) {
        const elements = Array.from(domMatrix.toFloat32Array()).map(v => numberRef(v));
        return new Matrix4D(elements[0], elements[1], elements[2], elements[3], elements[4], elements[5], elements[6], elements[7], elements[8], elements[9], elements[10], elements[11], elements[12], elements[13], elements[14], elements[15]);
    }
    // Apply reactive transform to DOMMatrix
    static applyTransform(domMatrix, transform) {
        const reactiveMatrix = this.fromDOMMatrix(domMatrix);
        // This would need matrix multiplication - simplified for now
        return domMatrix.multiplySelf(this.toDOMMatrix(transform));
    }
}
// CSS Custom Properties Integration
export class CSSCustomProps {
    // Bind reactive value to CSS custom property
    static bindProperty(element, propName, value, unit = '') {
        return operated([value], () => {
            element.style.setProperty(propName, `${value.value}${unit}`);
            return () => { }; // Return cleanup function
        });
    }
    // Bind reactive Vector2D to CSS custom properties
    static bindVectorProperties(element, baseName, vector, unit = 'px') {
        const unsubX = this.bindProperty(element, `${baseName}-x`, vector.x, unit);
        const unsubY = this.bindProperty(element, `${baseName}-y`, vector.y, unit);
        return () => { unsubX(); unsubY(); };
    }
    // Get reactive value from CSS custom property
    static getReactiveProperty(element, propName) {
        const initialValue = parseFloat(getComputedStyle(element).getPropertyValue(propName)) || 0;
        const reactiveValue = numberRef(initialValue);
        // Set up observer for CSS custom property changes
        const observer = new MutationObserver(() => {
            const newValue = parseFloat(getComputedStyle(element).getPropertyValue(propName)) || 0;
            reactiveValue.value = newValue;
        });
        observer.observe(element, {
            attributes: true,
            attributeFilter: ['style']
        });
        return reactiveValue;
    }
}
// ============================================================================
// Unified Unit Conversion and CSS Utilities
// ============================================================================
// CSS Unit Conversion and Formatting Utilities
export class CSSUnitUtils {
    // Convert reactive values to CSS pixel units
    static asPx(value) {
        if (typeof value === 'number') {
            return `${value || 0}px`;
        }
        if (typeof value === 'string') {
            return value || '0px';
        }
        // Reactive value - return computed string
        return operated([value], (v) => `${v || 0}px`);
    }
    // Convert reactive values to CSS percentage units
    static asPercent(value) {
        if (typeof value === 'number') {
            return `${value || 0}%`;
        }
        if (typeof value === 'string') {
            return value || '0%';
        }
        // Reactive value - return computed string
        return operated([value], (v) => `${v || 0}%`);
    }
    // Convert reactive values to CSS em units
    static asEm(value) {
        if (typeof value === 'number') {
            return `${value || 0}em`;
        }
        if (typeof value === 'string') {
            return value || '0em';
        }
        // Reactive value - return computed string
        return operated([value], (v) => `${v || 0}em`);
    }
    // Convert reactive values to CSS rem units
    static asRem(value) {
        if (typeof value === 'number') {
            return `${value || 0}rem`;
        }
        if (typeof value === 'string') {
            return value || '0rem';
        }
        // Reactive value - return computed string
        return operated([value], (v) => `${v || 0}rem`);
    }
    // Convert reactive values to CSS viewport units
    static asVw(value) {
        if (typeof value === 'number') {
            return `${value || 0}vw`;
        }
        if (typeof value === 'string') {
            return value || '0vw';
        }
        return operated([value], (v) => `${v || 0}vw`);
    }
    static asVh(value) {
        if (typeof value === 'number') {
            return `${value || 0}vh`;
        }
        if (typeof value === 'string') {
            return value || '0vh';
        }
        return operated([value], (v) => `${v || 0}vh`);
    }
    // Generic unit converter with fallback
    static asUnit(value, unit, fallbackValue = 0) {
        if (typeof value === 'number') {
            return `${value || fallbackValue}${unit}`;
        }
        if (typeof value === 'string') {
            return value || `${fallbackValue}${unit}`;
        }
        return operated([value], (v) => `${v || fallbackValue}${unit}`);
    }
    // Reactive CSS calc() expressions
    static calc(expression) {
        return `calc(${expression})`;
    }
    // Create reactive calc expressions
    static reactiveCalc(operands, operator) {
        return operated(operands, (...values) => {
            const expression = values.join(` ${operator} `);
            return `calc(${expression})`;
        });
    }
    // Clamp reactive values with CSS clamp()
    static clamp(min, value, max) {
        const minStr = typeof min === 'number' || typeof min === 'string' ? min : operated([min], v => v);
        const valStr = typeof value === 'number' || typeof value === 'string' ? value : operated([value], v => v);
        const maxStr = typeof max === 'number' || typeof max === 'string' ? max : operated([max], v => v);
        return operated([minStr, valStr, maxStr].filter(v => typeof v !== 'string'), () => {
            const minVal = typeof min === 'number' ? min : (typeof min === 'string' ? min : min.value);
            const val = typeof value === 'number' ? value : (typeof value === 'string' ? value : value.value);
            const maxVal = typeof max === 'number' ? max : (typeof max === 'string' ? max : max.value);
            return `clamp(${minVal}, ${val}, ${maxVal})`;
        });
    }
    // Reactive max/min functions
    static max(values) {
        return operated(values.filter(v => typeof v !== 'string'), (...nums) => {
            const cssValues = values.map(v => typeof v === 'number' ? v : (typeof v === 'string' ? v : v.value));
            return `max(${cssValues.join(', ')})`;
        });
    }
    static min(values) {
        return operated(values.filter(v => typeof v !== 'string'), (...nums) => {
            const cssValues = values.map(v => typeof v === 'number' ? v : (typeof v === 'string' ? v : v.value));
            return `min(${cssValues.join(', ')})`;
        });
    }
}
// ============================================================================
// Enhanced UI Control CSS Integration
// ============================================================================
// Specialized CSS utilities for input controls
export class CSSInputControls {
    // Bind slider thumb position reactively
    static bindSliderThumb(thumbElement, value, min, max, trackWidth) {
        const position = operated([value, min, max, trackWidth], () => {
            const percentage = ((value.value - min.value) / (max.value - min.value)) * 100;
            return `translateX(${percentage}%)`;
        });
        return CSSBinder.bindTransform(thumbElement, position);
    }
    // Bind progress bar fill reactively
    static bindProgressFill(fillElement, progress) {
        const width = operated([progress], () => `${progress.value * 100}%`);
        return bindWith(fillElement, 'width', width, handleStyleChange) ?? (() => { });
    }
    // Bind checkbox/radio button state with animations
    static bindToggleState(element, checked) {
        const scale = operated([checked], () => checked.value ? 'scale(1)' : 'scale(0)');
        const opacity = operated([checked], () => checked.value ? '1' : '0');
        const unsubScale = CSSBinder.bindTransform(element, scale);
        const unsubOpacity = bindWith(element, 'opacity', opacity, handleStyleChange) ?? (() => { });
        return () => { unsubScale?.(); unsubOpacity?.(); };
    }
}
// Specialized CSS utilities for scrollbars
export class CSSScrollbarControls {
    // Bind scrollbar thumb position and size reactively
    static bindScrollbarThumb(thumbElement, scrollPosition, contentSize, containerSize, axis = 'vertical') {
        // Calculate thumb size
        const thumbSize = operated([contentSize, containerSize], () => {
            const ratio = containerSize.value / contentSize.value;
            return Math.max(20, ratio * containerSize.value);
        });
        // Calculate thumb position
        const thumbPosition = operated([scrollPosition, contentSize, containerSize, thumbSize], () => {
            const maxScroll = Math.max(0, contentSize.value - containerSize.value);
            const scrollRatio = maxScroll > 0 ? scrollPosition.value / maxScroll : 0;
            return scrollRatio * (containerSize.value - thumbSize.value);
        });
        // Create transform based on axis
        const transform = axis === 'vertical'
            ? operated([thumbPosition], () => `translateY(${thumbPosition.value}px)`)
            : operated([thumbPosition], () => `translateX(${thumbPosition.value}px)`);
        // Bind size and transform
        const unsubSize = axis === 'vertical'
            ? bindWith(thumbElement, 'height', operated([thumbSize], (s) => `${s}px`), handleStyleChange)
            : bindWith(thumbElement, 'width', operated([thumbSize], (s) => `${s}px`), handleStyleChange);
        const unsubTransform = CSSBinder.bindTransform(thumbElement, transform);
        return () => { unsubSize?.(); unsubTransform?.(); };
    }
    // Bind scrollbar visibility with smooth transitions
    static bindScrollbarVisibility(scrollbarElement, isVisible, transitionDuration = 300) {
        const opacity = operated([isVisible], () => isVisible.value);
        const visibility = operated([isVisible], () => isVisible.value > 0 ? 'visible' : 'hidden');
        const pointerEvents = operated([isVisible], () => isVisible.value > 0 ? 'auto' : 'none');
        const unsubOpacity = bindWith(scrollbarElement, 'opacity', opacity, handleStyleChange);
        const unsubVisibility = bindWith(scrollbarElement, 'visibility', visibility, handleStyleChange);
        const unsubPointerEvents = bindWith(scrollbarElement, 'pointer-events', pointerEvents, handleStyleChange);
        // Add transition
        scrollbarElement.style.transition = `opacity ${transitionDuration}ms ease-in-out`;
        return () => {
            unsubOpacity?.();
            unsubVisibility?.();
            unsubPointerEvents?.();
        };
    }
    // Bind scrollbar theme properties reactively
    static bindScrollbarTheme(scrollbarElement, theme) {
        const unbinders = [];
        if (theme.trackColor) {
            unbinders.push(bindWith(scrollbarElement, '--scrollbar-track-color', operated([theme.trackColor], (c) => `rgba(${c.value}, ${c.value}, ${c.value}, 0.1)`), handleStyleChange) ?? (() => { }));
        }
        if (theme.thumbColor) {
            unbinders.push(bindWith(scrollbarElement, '--scrollbar-thumb-color', operated([theme.thumbColor], (c) => `rgba(${c.value}, ${c.value}, ${c.value}, 0.5)`), handleStyleChange) ?? (() => { }));
        }
        if (theme.borderRadius) {
            unbinders.push(bindWith(scrollbarElement, '--scrollbar-border-radius', operated([theme.borderRadius], (r) => `${r.value}px`), handleStyleChange) ?? (() => { }));
        }
        if (theme.thickness) {
            unbinders.push(bindWith(scrollbarElement, '--scrollbar-thickness', operated([theme.thickness], (t) => `${t.value}px`), handleStyleChange) ?? (() => { }));
        }
        return () => unbinders.forEach(unbind => unbind?.());
    }
}
// Enhanced momentum scrolling utilities
export class CSSMomentumScrolling {
    // Create smooth scroll animation with momentum
    static createMomentumScroll(element, velocity, deceleration = 0.92) {
        return new Promise(resolve => {
            let animationId;
            const animate = () => {
                velocity.value *= deceleration;
                if (Math.abs(velocity.value) < 0.1) {
                    velocity.value = 0;
                    cancelAnimationFrame(animationId);
                    resolve();
                    return;
                }
                element.scrollBy({
                    top: velocity.value,
                    behavior: 'instant'
                });
                animationId = requestAnimationFrame(animate);
            };
            animate();
        });
    }
    // Create bounce-back animation for scroll boundaries
    static createBounceBack(element, overScroll, duration = 300) {
        return new Promise(resolve => {
            const startTime = performance.now();
            const startValue = overScroll.value;
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                overScroll.value = startValue * (1 - eased);
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
                else {
                    overScroll.value = 0;
                    resolve();
                }
            };
            requestAnimationFrame(animate);
        });
    }
}
// Enhanced focus and interaction states
export class CSSInteractionStates {
    // Bind focus ring with reactive visibility
    static bindFocusRing(element, isFocused, ringColor = 'rgba(59, 130, 246, 0.5)') {
        const boxShadow = operated([isFocused], () => isFocused.value ? `0 0 0 2px ${ringColor}` : 'none');
        return bindWith(element, 'box-shadow', boxShadow, handleStyleChange) ?? (() => { });
    }
    // Bind hover state with smooth transitions
    static bindHoverState(element, isHovered, hoverTransform = 'scale(1.05)') {
        const transform = operated([isHovered], () => isHovered.value ? hoverTransform : 'none');
        return CSSBinder.bindTransform(element, transform) ?? (() => { });
    }
    // Bind active/press state
    static bindActiveState(element, isActive, activeTransform = 'scale(0.95)') {
        const transform = operated([isActive], () => isActive.value ? activeTransform : 'none');
        return CSSBinder.bindTransform(element, transform) ?? (() => { });
    }
}
/*
// Export all enhanced CSS adapter utilities
export {
    CSSUnitConverter,
    CSSUnitUtils,
    CSSTransform,
    CSSPosition,
    CSSBinder,
    CSSCalc,
    DOMMatrixAdapter,
    CSSCustomProps,
    CSSInputControls,
    CSSScrollbarControls,
    CSSMomentumScrolling,
    CSSInteractionStates
};*/
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ1NTQWRhcHRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkNTU0FkYXB0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUN4QyxPQUFPLEVBQUUsUUFBUSxFQUFFLFlBQVksRUFBRSxjQUFjLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUMxRixPQUFPLEVBQ0gsUUFBUSxFQUFFLFFBQVEsRUFDUixRQUFRLEVBQ3JCLE1BQU0sa0JBQWtCLENBQUM7QUFDMUIsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sVUFBVSxDQUFDO0FBRzdDLDZDQUE2QztBQUM3QyxNQUFNLE9BQU8sZ0JBQWdCO0lBQ2pCLE1BQU0sQ0FBVSxZQUFZLEdBQUc7UUFDbkMsRUFBRSxFQUFFLGtCQUFrQjtRQUN0QixFQUFFLEVBQUUsa0JBQWtCO1FBQ3RCLEdBQUcsRUFBRSxtQkFBbUI7UUFDeEIsRUFBRSxFQUFFLGtCQUFrQjtRQUN0QixFQUFFLEVBQUUsa0JBQWtCO1FBQ3RCLElBQUksRUFBRSxvQkFBb0I7UUFDMUIsSUFBSSxFQUFFLG9CQUFvQjtRQUMxQixPQUFPLEVBQUUsaUJBQWlCO0tBQzdCLENBQUM7SUFFRiw4QkFBOEI7SUFDOUIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFhLEVBQUUsT0FBcUI7UUFDaEQsSUFBSSxDQUFDLEtBQUs7WUFBRSxPQUFPLENBQUMsQ0FBQztRQUVyQixNQUFNLFdBQVcsR0FBRyxPQUFPLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQztRQUM3QyxNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzlDLE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQztRQUNwQyxPQUFPLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUM7UUFDcEMsT0FBTyxDQUFDLEtB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QUFRLENBQUMsRUFBRSxHQUFHLEVBQUU7WUFDOUUsTUFBTSxNQUFNLEdBQUcsT0FBTyxHQUFHLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxHQUFHLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMzRixNQUFNLEdBQUcsR0FBRyxPQUFPLEtBQUssS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEtBQUssS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2xHLE1BQU0sTUFBTSxHQUFHLE9BQU8sR0FBRyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sR0FBRyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDM0YsT0FBTyxTQUFTLE1BQU0sS0FBSyxHQUFHLEtBQUssTUFBTSxHQUFHLENBQUM7UUFDakQsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsNkJBQTZCO0lBQzdCLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBNkQ7UUFDcEUsT0FBTyxRQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLFFBQVEsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEVBQUUsRUFBRTtZQUNuRSxNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQzdCLE9BQU8sQ0FBQyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLFFBQVEsQ0FBQyxDQUFD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LENBQUM7SUFDckUsQ0FBQztDQUNKO0FBRUQ7Ozs7Ozs7Ozs7Ozs7OztJQWVJIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgbnVtYmVyUmVmIH0gZnJvbSBcImZlc3Qvb2JqZWN0XCI7XG5pbXBvcnQgeyBiaW5kV2l0aCwgYmluZEFuaW1hdGVkLCBiaW5kVHJhbnNpdGlvbiwgYmluZFNwcmluZywgYmluZE1vcnBoIH0gZnJvbSBcImZlc3QvbHVyZVwiO1xuaW1wb3J0IHtcbiAgICBWZWN0b3IyRCwgb3BlcmF0ZWQsXG4gICAgTWF0cml4MkQsIE1hdHJpeDREXG59IGZyb20gXCIuLi8uLi9tYXRoL2luZGV4XCI7XG5pbXBvcnQgeyBoYW5kbGVTdHlsZUNoYW5nZSB9IGZyb20gXCJmZXN0L2RvbVwiO1xuaW1wb3J0IHsgQW5pbWF0aW9uT3B0aW9ucywgVHJhbnNpdGlvbk9wdGlvbnMgfSBmcm9tIFwiLi9DU1NBbmltYXRlZFwiO1xuXG4vLyBDU1MgVHlwZWQgT00gYW5kIFVuaXQgQ29udmVyc2lvbiBVdGlsaXRpZXNcbmV4cG9ydCBjbGFzcyBDU1NVbml0Q29udmVydGVyIHtcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSB1bml0UGF0dGVybnMgPSB7XG4gICAgICAgIHB4OiAvKC0/XFxkKlxcLj9cXGQrKXB4L2csXG4gICAgICAgIGVtOiAvKC0/XFxkKlxcLj9cXGQrKWVtL2csXG4gICAgICAgIHJlbTogLygtP1xcZCpcXC4/XFxkKylyZW0vZyxcbiAgICAgICAgdmg6IC8oLT9cXGQqXFwuP1xcZCspdmgvZyxcbiAgICAgICAgdnc6IC8oLT9cXGQqXFwuP1xcZCspdncvZyxcbiAgICAgICAgdm1pbjogLygtP1xcZCpcXC4/XFxkKyl2bWluL2csXG4gICAgICAgIHZtYXg6IC8oLT9cXGQqXFwuP1xcZCspdm1heC9nLFxuICAgICAgICBwZXJjZW50OiAvKC0/XFxkKlxcLj9cXGQrKSUvZ1xuICAgIH07XG5cbiAgICAvLyBDb252ZXJ0IENTUyB2YWx1ZSB0byBwaXhlbHNcbiAgICBzdGF0aWMgdG9QaXhlbHModmFsdWU6IHN0cmluZywgZWxlbWVudD86IEhUTUxFbGVtZW50KTogbnVtYmVyIHtcbiAgICAgICAgaWYgKCF2YWx1ZSkgcmV0dXJuIDA7XG5cbiAgICAgICAgY29uc3QgdGVzdEVsZW1lbnQgPSBlbGVtZW50IHx8IGRvY3VtZW50LmJvZHk7XG4gICAgICAgIGNvbnN0IHRlc3REaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdGVzdERpdi5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgIHRlc3REaXYuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgICAgICB0ZXN0RGl2LnN0eWxlLndpZHRoID0gdmFsdWU7XG4gICAgICAgIHRlc3RFbGVtZW50LmFwcGVuZENoaWxkKHRlc3REaXYpO1xuXG4gICAgICAgIGNvbnN0IHBpeGVscyA9IHRlc3REaXYub2Zmc2V0V2lkdGg7XG4gICAgICAgIHRlc3RFbGVtZW50LnJlbW92ZUNoaWxkKHRlc3REaXYpO1xuICAgICAgICByZXR1cm4gcGl4ZWxzO1xuICAgIH1cblxuICAgIC8vIENvbnZlcnQgcGl4ZWxzIHRvIENTUyB1bml0XG4gICAgc3RhdGljIGZyb21QaXhlbHMocGl4ZWxzOiBudW1iZXIsIHVuaXQ6ICdweCcgfCAnZW0nIHwgJ3JlbScgfCAnJScgPSAncHgnKTogc3RyaW5nIHtcbiAgICAgICAgc3dpdGNoICh1bml0KSB7XG4gICAgICAgICAgICBjYXNlICdlbSc6XG4gICAgICAgICAgICAgICAgY29uc3QgZm9udFNpemUgPSBwYXJzZUZsb2F0KGdldENvbXB1dGVkU3R5bGUoZG9jdW1lbnQuYm9keSkuZm9udFNpemUpO1xuICAgICAgICAgICAgICAgIHJldHVybiBgJHtwaXhlbHMgLyBmb250U2l6ZX1lbWA7XG4gICAgICAgICAgICBjYXNlICdyZW0nOlxuICAgICAgICAgICAgICAgIGNvbnN0IHJvb3RGb250U2l6ZSA9IHBhcnNlRmxvYXQoZ2V0Q29tcHV0ZWRTdHlsZShkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpLmZvbnRTaXplKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gYCR7cGl4ZWxzIC8gcm9vdEZvbnRTaXplfXJlbWA7XG4gICAgICAgICAgICBjYXNlICclJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYCR7KHBpeGVscyAvIGdsb2JhbFRoaXMuaW5uZXJXaWR0aCkgKiAxMDB9JWA7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiBgJHtwaXhlbHN9cHhgO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gUGFyc2UgQ1NTIHZhbHVlIHdpdGggdW5pdHNcbiAgICBzdGF0aWMgcGFyc2VWYWx1ZShjc3NWYWx1ZTogc3RyaW5nKTogeyB2YWx1ZTogbnVtYmVyLCB1bml0OiBzdHJpbmcgfSB7XG4gICAgICAgIGNvbnN0IG1hdGNoID0gY3NzVmFsdWUubWF0Y2goL14oLT9cXGQqXFwuP1xcZCspKFthLXolXSspPyQvKTtcbiAgICAgICAgaWYgKCFtYXRjaCkgcmV0dXJuIHsgdmFsdWU6IDAsIHVuaXQ6ICdweCcgfTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdmFsdWU6IHBhcnNlRmxvYXQobWF0Y2hbMV0pLFxuICAgICAgICAgICAgdW5pdDogbWF0Y2hbMl0gfHwgJ3B4J1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vIENvbnZlcnQgYmV0d2VlbiB1bml0c1xuICAgIHN0YXRpYyBjb252ZXJ0VW5pdHModmFsdWU6IG51bWJlciwgZnJvbVVuaXQ6IHN0cmluZywgdG9Vbml0OiBzdHJpbmcsIGVsZW1lbnQ/OiBIVE1MRWxlbWVudCk6IG51bWJlciB7XG4gICAgICAgIGlmIChmcm9tVW5pdCA9PT0gdG9Vbml0KSByZXR1cm4gdmFsdWU7XG5cbiAgICAgICAgLy8gQ29udmVydCB0byBwaXhlbHMgZmlyc3RcbiAgICAgICAgbGV0IHBpeGVsczogbnVtYmVyO1xuICAgICAgICBzd2l0Y2ggKGZyb21Vbml0KSB7XG4gICAgICAgICAgICBjYXNlICdweCc6XG4gICAgICAgICAgICAgICAgcGl4ZWxzID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdlbSc6XG4gICAgICAgICAgICAgICAgY29uc3QgZm9udFNpemUgPSBwYXJzZUZsb2F0KGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCB8fCBkb2N1bWVudC5ib2R5KS5mb250U2l6ZSk7XG4gICAgICAgICAgICAgICAgcGl4ZWxzID0gdmFsdWUgKiBmb250U2l6ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3JlbSc6XG4gICAgICAgICAgICAgICAgY29uc3Qgcm9vdEZvbnRTaXplID0gcGFyc2VGbG9hdChnZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkuZm9udFNpemUpO1xuICAgICAgICAgICAgICAgIHBpeGVscyA9IHZhbHVlICogcm9vdEZvbnRTaXplO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnJSc6XG4gICAgICAgICAgICAgICAgcGl4ZWxzID0gKHZhbHVlIC8gMTAwKSAqIGdsb2JhbFRoaXMuaW5uZXJXaWR0aDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3Z3JzpcbiAgICAgICAgICAgICAgICBwaXhlbHMgPSAodmFsdWUgLyAxMDApICogZ2xvYmFsVGhpcy5pbm5lcldpZHRoO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAndmgnOlxuICAgICAgICAgICAgICAgIHBpeGVscyA9ICh2YWx1ZSAvIDEwMCkgKiBnbG9iYWxUaGlzLmlubmVySGVpZ2h0O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBwaXhlbHMgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENvbnZlcnQgZnJvbSBwaXhlbHMgdG8gdGFyZ2V0IHVuaXRcbiAgICAgICAgc3dpdGNoICh0b1VuaXQpIHtcbiAgICAgICAgICAgIGNhc2UgJ3B4JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gcGl4ZWxzO1xuICAgICAgICAgICAgY2FzZSAnZW0nOlxuICAgICAgICAgICAgICAgIGNvbnN0IGZvbnRTaXplID0gcGFyc2VGbG9hdChnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQgfHwgZG9jdW1lbnQuYm9keSkuZm9udFNpemUpO1xuICAgICAgICAgICAgICAgIHJldHVybiBwaXhlbHMgLyBmb250U2l6ZTtcbiAgICAgICAgICAgIGNhc2UgJ3JlbSc6XG4gICAgICAgICAgICAgICAgY29uc3Qgcm9vdEZvbnRTaXplID0gcGFyc2VGbG9hdChnZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkuZm9udFNpemUpO1xuICAgICAgICAgICAgICAgIHJldHVybiBwaXhlbHMgLyByb290Rm9udFNpemU7XG4gICAgICAgICAgICBjYXNlICclJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gKHBpeGVscyAvIGdsb2JhbFRoaXMuaW5uZXJXaWR0aCkgKiAxMDA7XG4gICAgICAgICAgICBjYXNlICd2dyc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIChwaXhlbHMgLyBnbG9iYWxUaGlzLmlubmVyV2lkdGgpICogMTAwO1xuICAgICAgICAgICAgY2FzZSAndmgnOlxuICAgICAgICAgICAgICAgIHJldHVybiAocGl4ZWxzIC8gZ2xvYmFsVGhpcy5pbm5lckhlaWdodCkgKiAxMDA7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiBwaXhlbHM7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8vIENTUyBUcmFuc2Zvcm0gVXRpbGl0aWVzIHdpdGggUmVhY3RpdmUgTWF0aFxuZXhwb3J0IGNsYXNzIENTU1RyYW5zZm9ybSB7XG4gICAgLy8gQ29udmVydCByZWFjdGl2ZSBWZWN0b3IyRCB0byBDU1MgdHJhbnNsYXRlXG4gICAgc3RhdGljIHRyYW5zbGF0ZTJEKHZlY3RvcjogVmVjdG9yMkQpOiBSZXR1cm5UeXBlPHR5cGVvZiBudW1iZXJSZWY+IHtcbiAgICAgICAgcmV0dXJuIG9wZXJhdGVkKFt2ZWN0b3IueCwgdmVjdG9yLnldLCAoKSA9PlxuICAgICAgICAgICAgYHRyYW5zbGF0ZSgke3ZlY3Rvci54LnZhbHVlfXB4LCAke3ZlY3Rvci55LnZhbHVlfXB4KWBcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBDb252ZXJ0IHJlYWN0aXZlIFZlY3RvcjJEIHRvIENTUyB0cmFuc2xhdGUzZFxuICAgIHN0YXRpYyB0cmFuc2xhdGUzRCh2ZWN0b3I6IFZlY3RvcjJELCB6OiBSZXR1cm5UeXBlPHR5cGVvZiBudW1iZXJSZWY+ID0gbnVtYmVyUmVmKDApKTogUmV0dXJuVHlwZTx0eXBlb2YgbnVtYmVyUmVmPiB7XG4gICAgICAgIHJldHVybiBvcGVyYXRlZChbdmVjdG9yLngsIHZlY3Rvci55LCB6XSwgKCkgPT5cbiAgICAgICAgICAgIGB0cmFuc2xhdGUzZCgke3ZlY3Rvci54LnZhbHVlfXB4LCAke3ZlY3Rvci55LnZhbHVlfXB4LCAke3oudmFsdWV9cHgpYFxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8vIENvbnZlcnQgcmVhY3RpdmUgVmVjdG9yMkQgdG8gQ1NTIHNjYWxlXG4gICAgc3RhdGljIHNjYWxlMkQodmVjdG9yOiBWZWN0b3IyRCk6IFJldHVyblR5cGU8dHlwZW9mIG51bWJlclJlZj4ge1xuICAgICAgICByZXR1cm4gb3BlcmF0ZWQoW3ZlY3Rvci54LCB2ZWN0b3IueV0sICgpID0+XG4gICAgICAgICAgICBgc2NhbGUoJHt2ZWN0b3IueC52YWx1ZX0sICR7dmVjdG9yLnkudmFsdWV9KWBcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBDb252ZXJ0IHJlYWN0aXZlIG51bWJlciB0byBDU1Mgcm90YXRlXG4gICAgc3RhdGljIHJvdGF0ZShhbmdsZTogUmV0dXJuVHlwZTx0eXBlb2YgbnVtYmVyUmVmPik6IFJldHVyblR5cGU8dHlwZW9mIG51bWJlclJlZj4ge1xuICAgICAgICByZXR1cm4gb3BlcmF0ZWQoW2FuZ2xlXSwgKCkgPT4gYHJvdGF0ZSgke2FuZ2xlLnZhbHVlfWRlZylgKTtcbiAgICB9XG5cbiAgICAvLyBDb21iaW5lIHRyYW5zZm9ybXMgaW50byBzaW5nbGUgQ1NTIHRyYW5zZm9ybSBzdHJpbmdcbiAgICBzdGF0aWMgY29tYmluZSh0cmFuc2Zvcm1zOiBSZXR1cm5UeXBlPHR5cGVvZiBudW1iZXJSZWY+W10pOiBSZXR1cm5UeXBlPHR5cGVvZiBudW1iZXJSZWY+IHtcbiAgICAgICAgcmV0dXJuIG9wZXJhdGVkKHRyYW5zZm9ybXMsICgpID0+IHRyYW5zZm9ybXMubWFwKHQgPT4gdC52YWx1ZSkuam9pbignICcpKTtcbiAgICB9XG5cbiAgICAvLyBDcmVhdGUgbWF0cml4IHRyYW5zZm9ybSBmcm9tIHJlYWN0aXZlIE1hdHJpeDJEXG4gICAgc3RhdGljIG1hdHJpeDJEKG1hdHJpeDogTWF0cml4MkQpOiBSZXR1cm5UeXBlPHR5cGVvZiBudW1iZXJSZWY+IHtcbiAgICAgICAgcmV0dXJuIG9wZXJhdGVkKG1hdHJpeC5lbGVtZW50cywgKCkgPT5cbiAgICAgICAgICAgIGBtYXRyaXgoJHttYXRyaXguZWxlbWVudHMubWFwKGUgPT4gZS52YWx1ZSkuam9pbignLCAnKX0pYFxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8vIENyZWF0ZSBtYXRyaXgzZCB0cmFuc2Zvcm0gZnJvbSByZWFjdGl2ZSBNYXRyaXg0RFxuICAgIHN0YXRpYyBtYXRyaXgzRChtYXRyaXg6IE1hdHJpeDREKTogUmV0dXJuVHlwZTx0eXBlb2YgbnVtYmVyUmVmPiB7XG4gICAgICAgIHJldHVybiBvcGVyYXRlZChtYXRyaXguZWxlbWVudHMsICgpID0+XG4gICAgICAgICAgICBgbWF0cml4M2QoJHttYXRyaXguZWxlbWVudHMubWFwKGUgPT4gZS52YWx1ZSkuam9pbignLCAnKX0pYFxuICAgICAgICApO1xuICAgIH1cbn1cblxuLy8gQ1NTIFBvc2l0aW9uIGFuZCBTaXplIFV0aWxpdGllc1xuZXhwb3J0IGNsYXNzIENTU1Bvc2l0aW9uIHtcbiAgICAvLyBDb252ZXJ0IHJlYWN0aXZlIFZlY3RvcjJEIHRvIENTUyBwb3NpdGlvbiB2YWx1ZXNcbiAgICBzdGF0aWMgbGVmdFRvcCh2ZWN0b3I6IFZlY3RvcjJEKTogeyBsZWZ0OiBSZXR1cm5UeXBlPHR5cGVvZiBudW1iZXJSZWY+LCB0b3A6IFJldHVyblR5cGU8dHlwZW9mIG51bWJlclJlZj4gfSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBsZWZ0OiBvcGVyYXRlZChbdmVjdG9yLnhdLCAoKSA9PiBgJHt2ZWN0b3IueC52YWx1ZX1weGApLFxuICAgICAgICAgICAgdG9wOiBvcGVyYXRlZChbdmVjdG9yLnldLCAoKSA9PiBgJHt2ZWN0b3IueS52YWx1ZX1weGApXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gQ29udmVydCByZWFjdGl2ZSBWZWN0b3IyRCB0byBDU1MgaW5zZXQgdmFsdWVzXG4gICAgc3RhdGljIGluc2V0KHZlY3RvcjogVmVjdG9yMkQpOiB7IGluc2V0OiBSZXR1cm5UeXBlPHR5cGVvZiBudW1iZXJSZWY+IH0ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaW5zZXQ6IG9wZXJhdGVkKFt2ZWN0b3IueCwgdmVjdG9yLnldLCAoKSA9PiBgJHt2ZWN0b3IueS52YWx1ZX1weCAke3ZlY3Rvci54LnZhbHVlfXB4YClcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBDb252ZXJ0IHJlYWN0aXZlIFZlY3RvcjJEIHRvIENTUyBzaXplIHZhbHVlc1xuICAgIHN0YXRpYyBzaXplKHZlY3RvcjogVmVjdG9yMkQpOiB7IHdpZHRoOiBSZXR1cm5UeXBlPHR5cGVvZiBudW1iZXJSZWY+LCBoZWlnaHQ6IFJldHVyblR5cGU8dHlwZW9mIG51bWJlclJlZj4gfSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB3aWR0aDogb3BlcmF0ZWQoW3ZlY3Rvci54XSwgKCkgPT4gYCR7dmVjdG9yLngudmFsdWV9cHhgKSxcbiAgICAgICAgICAgIGhlaWdodDogb3BlcmF0ZWQoW3ZlY3Rvci55XSwgKCkgPT4gYCR7dmVjdG9yLnkudmFsdWV9cHhgKVxuICAgICAgICB9O1xuICAgIH1cbn1cblxuLy8gQ1NTIFJlYWN0aXZlIEJpbmRpbmcgVXRpbGl0aWVzXG5leHBvcnQgY2xhc3MgQ1NTQmluZGVyIHtcbiAgICAvLyBCaW5kIHJlYWN0aXZlIFZlY3RvcjJEIHRvIENTUyB0cmFuc2Zvcm1cbiAgICBzdGF0aWMgYmluZFRyYW5zZm9ybShcbiAgICAgICAgZWxlbWVudDogSFRNTEVsZW1lbnQsXG4gICAgICAgIHZlY3RvcjogVmVjdG9yMkQsXG4gICAgICAgIGFuaW1hdGlvblR5cGU6ICdpbnN0YW50JyB8ICdhbmltYXRlJyB8ICd0cmFuc2l0aW9uJyB8ICdzcHJpbmcnID0gJ2luc3RhbnQnLFxuICAgICAgICBvcHRpb25zPzogQW5pbWF0aW9uT3B0aW9ucyB8IFRyYW5zaXRpb25PcHRpb25zXG4gICAgKTogKCkgPT4gdm9pZCB7XG4gICAgICAgIGNvbnN0IHRyYW5zZm9ybVZhbHVlID0gQ1NTVHJhbnNmb3JtLnRyYW5zbGF0ZTJEKHZlY3Rvcik7XG4gICAgICAgIGNvbnN0IGJpbmRlciA9IGFuaW1hdGlvblR5cGUgPT09ICdpbnN0YW50JyA/IGJpbmRXaXRoIDpcbiAgICAgICAgICAgICAgICAgICAgICBhbmltYXRpb25UeXBlID09PSAnYW5pbWF0ZScgPyBiaW5kQW5pbWF0ZWQgOlxuICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvblR5cGUgPT09ICd0cmFuc2l0aW9uJyA/IGJpbmRUcmFuc2l0aW9uIDogYmluZFNwcmluZztcbiAgICAgICAgcmV0dXJuIGJpbmRlcihlbGVtZW50LCAndHJhbnNmb3JtJywgdHJhbnNmb3JtVmFsdWUsIG9wdGlvbnMpID8/ICgoKSA9PiB7fSk7XG4gICAgfVxuXG4gICAgLy8gQmluZCByZWFjdGl2ZSBWZWN0b3IyRCB0byBDU1MgcG9zaXRpb25cbiAgICBzdGF0aWMgYmluZFBvc2l0aW9uKFxuICAgICAgICBlbGVtZW50OiBIVE1MRWxlbWVudCxcbiAgICAgICAgdmVjdG9yOiBWZWN0b3IyRCxcbiAgICAgICAgYW5pbWF0aW9uVHlwZTogJ2luc3RhbnQnIHwgJ2FuaW1hdGUnIHwgJ3RyYW5zaXRpb24nIHwgJ3NwcmluZycgPSAnaW5zdGFudCcsXG4gICAgICAgIG9wdGlvbnM/OiBBbmltYXRpb25PcHRpb25zIHwgVHJhbnNpdGlvbk9wdGlvbnNcbiAgICApOiAoKSA9PiB2b2lkIHtcbiAgICAgICAgY29uc3QgcG9zaXRpb24gPSBDU1NQb3NpdGlvbi5sZWZ0VG9wKHZlY3Rvcik7XG4gICAgICAgIGNvbnN0IGJpbmRlciA9IGFuaW1hdGlvblR5cGUgPT09ICdpbnN0YW50JyA/IGJpbmRXaXRoIDpcbiAgICAgICAgICAgICAgICAgICAgICBhbmltYXRpb25UeXBlID09PSAnYW5pbWF0ZScgPyBiaW5kQW5pbWF0ZWQgOlxuICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvblR5cGUgPT09ICd0cmFuc2l0aW9uJyA/IGJpbmRUcmFuc2l0aW9uIDogYmluZFNwcmluZztcblxuICAgICAgICBjb25zdCB1bnN1YkxlZnQgPSBiaW5kZXIoZWxlbWVudCwgJ2xlZnQnLCBwb3NpdGlvbi5sZWZ0LCBvcHRpb25zKSA/PyAoKCkgPT4ge30pO1xuICAgICAgICBjb25zdCB1bnN1YlRvcCA9IGJpbmRlcihlbGVtZW50LCAndG9wJywgcG9zaXRpb24udG9wLCBvcHRpb25zKSA/PyAoKCkgPT4ge30pO1xuICAgICAgICByZXR1cm4gKCkgPT4geyB1bnN1YkxlZnQ/LigpOyB1bnN1YlRvcD8uKCk7IH07XG4gICAgfVxuXG4gICAgLy8gQmluZCByZWFjdGl2ZSBWZWN0b3IyRCB0byBDU1Mgc2l6ZVxuICAgIHN0YXRpYyBiaW5kU2l6ZShcbiAgICAgICAgZWxlbWVudDogSFRNTEVsZW1lbnQsXG4gICAgICAgIHZlY3RvcjogVmVjdG9yMkQsXG4gICAgICAgIGFuaW1hdGlvblR5cGU6ICdpbnN0YW50JyB8ICdhbmltYXRlJyB8ICd0cmFuc2l0aW9uJyB8ICdzcHJpbmcnID0gJ2luc3RhbnQnLFxuICAgICAgICBvcHRpb25zPzogQW5pbWF0aW9uT3B0aW9ucyB8IFRyYW5zaXRpb25PcHRpb25zXG4gICAgKTogKCkgPT4gdm9pZCB7XG4gICAgICAgIGNvbnN0IHNpemUgPSBDU1NQb3NpdGlvbi5zaXplKHZlY3Rvcik7XG4gICAgICAgIGNvbnN0IGJpbmRlciA9IGFuaW1hdGlvblR5cGUgPT09ICdpbnN0YW50JyA/IGJpbmRXaXRoIDpcbiAgICAgICAgICAgICAgICAgICAgICBhbmltYXRpb25UeXBlID09PSAnYW5pbWF0ZScgPyBiaW5kQW5pbWF0ZWQgOlxuICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvblR5cGUgPT09ICd0cmFuc2l0aW9uJyA/IGJpbmRUcmFuc2l0aW9uIDogYmluZFNwcmluZztcblxuICAgICAgICBjb25zdCB1bnN1YldpZHRoID0gYmluZGVyKGVsZW1lbnQsICd3aWR0aCcsIHNpemUud2lkdGgsIG9wdGlvbnMpID8/ICgoKSA9PiB7fSk7XG4gICAgICAgIGNvbnN0IHVuc3ViSGVpZ2h0ID0gYmluZGVyKGVsZW1lbnQsICdoZWlnaHQnLCBzaXplLmhlaWdodCwgb3B0aW9ucykgPz8gKCgpID0+IHt9KTtcbiAgICAgICAgcmV0dXJuICgpID0+IHsgdW5zdWJXaWR0aD8uKCk7IHVuc3ViSGVpZ2h0Py4oKTsgfTtcbiAgICB9XG5cbiAgICAvLyBCaW5kIHJlYWN0aXZlIHZhbHVlIHdpdGggdW5pdCBjb252ZXJzaW9uXG4gICAgc3RhdGljIGJpbmRXaXRoVW5pdChcbiAgICAgICAgZWxlbWVudDogSFRNTEVsZW1lbnQsXG4gICAgICAgIHByb3BlcnR5OiBzdHJpbmcsXG4gICAgICAgIHZhbHVlOiBSZXR1cm5UeXBlPHR5cGVvZiBudW1iZXJSZWY+LFxuICAgICAgICB1bml0OiBzdHJpbmcgPSAncHgnLFxuICAgICAgICBhbmltYXRpb25UeXBlOiAnaW5zdGFudCcgfCAnYW5pbWF0ZScgfCAndHJhbnNpdGlvbicgfCAnc3ByaW5nJyA9ICdpbnN0YW50JyxcbiAgICAgICAgb3B0aW9ucz86IEFuaW1hdGlvbk9wdGlvbnMgfCBUcmFuc2l0aW9uT3B0aW9uc1xuICAgICk6ICgpID0+IHZvaWQge1xuICAgICAgICBjb25zdCBjc3NWYWx1ZSA9IG9wZXJhdGVkKFt2YWx1ZV0sICgpID0+IGAke3ZhbHVlLnZhbHVlfSR7dW5pdH1gKTtcbiAgICAgICAgY29uc3QgYmluZGVyID0gYW5pbWF0aW9uVHlwZSA9PT0gJ2luc3RhbnQnID8gYmluZFdpdGggOlxuICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvblR5cGUgPT09ICdhbmltYXRlJyA/IGJpbmRBbmltYXRlZCA6XG4gICAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uVHlwZSA9PT0gJ3RyYW5zaXRpb24nID8gYmluZFRyYW5zaXRpb24gOiBiaW5kU3ByaW5nO1xuICAgICAgICByZXR1cm4gYmluZGVyKGVsZW1lbnQsIHByb3BlcnR5LCBjc3NWYWx1ZSwgb3B0aW9ucykgPz8gKCgpID0+IHt9KTtcbiAgICB9XG5cbiAgICAvLyBCaW5kIHJlYWN0aXZlIHZlY3RvciB3aXRoIHVuaXQgY29udmVyc2lvblxuICAgIHN0YXRpYyBiaW5kVmVjdG9yV2l0aFVuaXQoXG4gICAgICAgIGVsZW1lbnQ6IEhUTUxFbGVtZW50LFxuICAgICAgICB2ZWN0b3I6IFZlY3RvcjJELFxuICAgICAgICB1bml0OiBzdHJpbmcgPSAncHgnLFxuICAgICAgICBhbmltYXRpb25UeXBlOiAnaW5zdGFudCcgfCAnYW5pbWF0ZScgfCAndHJhbnNpdGlvbicgfCAnc3ByaW5nJyA9ICdpbnN0YW50JyxcbiAgICAgICAgb3B0aW9ucz86IEFuaW1hdGlvbk9wdGlvbnMgfCBUcmFuc2l0aW9uT3B0aW9uc1xuICAgICk6ICgpID0+IHZvaWQge1xuICAgICAgICBjb25zdCBjc3NWYWx1ZSA9IG9wZXJhdGVkKFt2ZWN0b3IueCwgdmVjdG9yLnldLCAoKSA9PlxuICAgICAgICAgICAgYCR7dmVjdG9yLngudmFsdWV9JHt1bml0fSAke3ZlY3Rvci55LnZhbHVlfSR7dW5pdH1gXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IGJpbmRlciA9IGFuaW1hdGlvblR5cGUgPT09ICdpbnN0YW50JyA/IGJpbmRXaXRoIDpcbiAgICAgICAgICAgICAgICAgICAgICBhbmltYXRpb25UeXBlID09PSAnYW5pbWF0ZScgPyBiaW5kQW5pbWF0ZWQgOlxuICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvblR5cGUgPT09ICd0cmFuc2l0aW9uJyA/IGJpbmRUcmFuc2l0aW9uIDogYmluZFNwcmluZztcblxuICAgICAgICByZXR1cm4gYmluZGVyKGVsZW1lbnQsICd0cmFuc2Zvcm0nLCBjc3NWYWx1ZSwge1xuICAgICAgICAgICAgLi4ub3B0aW9ucyxcbiAgICAgICAgICAgIGhhbmRsZXI6IGFuaW1hdGlvblR5cGUgPT09ICdpbnN0YW50JyA/IHVuZGVmaW5lZCA6IChlbDogSFRNTEVsZW1lbnQsIHZhbDogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgZWwuc3R5bGUuc2V0UHJvcGVydHkoJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoJHt2YWx9KWApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KSA/PyAoKCkgPT4ge30pO1xuICAgIH1cblxuICAgIC8vIEVuaGFuY2VkIGFuaW1hdGlvbiBtZXRob2RzIHdpdGggbW9ycGhpbmcgc3VwcG9ydFxuICAgIHN0YXRpYyBiaW5kVHJhbnNmb3JtTW9ycGgoXG4gICAgICAgIGVsZW1lbnQ6IEhUTUxFbGVtZW50LFxuICAgICAgICB0cmFuc2Zvcm1Qcm9wczoge1xuICAgICAgICAgICAgdHJhbnNsYXRlPzogVmVjdG9yMkQ7XG4gICAgICAgICAgICBzY2FsZT86IFZlY3RvcjJEIHwgUmV0dXJuVHlwZTx0eXBlb2YgbnVtYmVyUmVmPjtcbiAgICAgICAgICAgIHJvdGF0ZT86IFJldHVyblR5cGU8dHlwZW9mIG51bWJlclJlZj47XG4gICAgICAgICAgICBza2V3PzogVmVjdG9yMkQ7XG4gICAgICAgIH0sXG4gICAgICAgIG9wdGlvbnM6IEFuaW1hdGlvbk9wdGlvbnMgPSB7fVxuICAgICk6ICgpID0+IHZvaWQge1xuICAgICAgICBjb25zdCB0cmFuc2Zvcm1zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XG5cbiAgICAgICAgaWYgKHRyYW5zZm9ybVByb3BzLnRyYW5zbGF0ZSkge1xuICAgICAgICAgICAgdHJhbnNmb3Jtcy50cmFuc2Zvcm0gPSBvcGVyYXRlZChcbiAgICAgICAgICAgICAgICBbdHJhbnNmb3JtUHJvcHMudHJhbnNsYXRlLngsIHRyYW5zZm9ybVByb3BzLnRyYW5zbGF0ZS55XSxcbiAgICAgICAgICAgICAgICAoKSA9PiBgdHJhbnNsYXRlKCR7dHJhbnNmb3JtUHJvcHMudHJhbnNsYXRlIS54LnZhbHVlfXB4LCAke3RyYW5zZm9ybVByb3BzLnRyYW5zbGF0ZSEueS52YWx1ZX1weClgXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRyYW5zZm9ybVByb3BzLnNjYWxlKSB7XG4gICAgICAgICAgICBjb25zdCBzY2FsZVN0ciA9IHRyYW5zZm9ybVByb3BzLnNjYWxlIGluc3RhbmNlb2YgVmVjdG9yMkQgP1xuICAgICAgICAgICAgICAgIG9wZXJhdGVkKFt0cmFuc2Zvcm1Qcm9wcy5zY2FsZS54LCB0cmFuc2Zvcm1Qcm9wcy5zY2FsZS55XSxcbiAgICAgICAgICAgICAgICAgICAgKCkgPT4gYHNjYWxlKCR7dHJhbnNmb3JtUHJvcHMuc2NhbGUhLngudmFsdWV9LCAke3RyYW5zZm9ybVByb3BzLnNjYWxlIS55LnZhbHVlfSlgKSA6XG4gICAgICAgICAgICAgICAgb3BlcmF0ZWQoW3RyYW5zZm9ybVByb3BzLnNjYWxlXSxcbiAgICAgICAgICAgICAgICAgICAgKCkgPT4gYHNjYWxlKCR7dHJhbnNmb3JtUHJvcHMuc2NhbGUhLnZhbHVlfSlgKTtcbiAgICAgICAgICAgIHRyYW5zZm9ybXMudHJhbnNmb3JtID0gdHJhbnNmb3Jtcy50cmFuc2Zvcm0gP1xuICAgICAgICAgICAgICAgIG9wZXJhdGVkKFt0cmFuc2Zvcm1zLnRyYW5zZm9ybSwgc2NhbGVTdHJdLCAodCwgcykgPT4gYCR7dH0gJHtzfWApIDogc2NhbGVTdHI7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHJhbnNmb3JtUHJvcHMucm90YXRlKSB7XG4gICAgICAgICAgICBjb25zdCByb3RhdGVTdHIgPSBvcGVyYXRlZChbdHJhbnNmb3JtUHJvcHMucm90YXRlXSxcbiAgICAgICAgICAgICAgICAoKSA9PiBgcm90YXRlKCR7dHJhbnNmb3JtUHJvcHMucm90YXRlIS52YWx1ZX1kZWcpYCk7XG4gICAgICAgICAgICB0cmFuc2Zvcm1zLnRyYW5zZm9ybSA9IHRyYW5zZm9ybXMudHJhbnNmb3JtID9cbiAgICAgICAgICAgICAgICBvcGVyYXRlZChbdHJhbnNmb3Jtcy50cmFuc2Zvcm0sIHJvdGF0ZVN0cl0sICh0LCByKSA9PiBgJHt0fSAke3J9YCkgOiByb3RhdGVTdHI7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHJhbnNmb3JtUHJvcHMuc2tldykge1xuICAgICAgICAgICAgY29uc3Qgc2tld1N0ciA9IG9wZXJhdGVkKFt0cmFuc2Zvcm1Qcm9wcy5za2V3LngsIHRyYW5zZm9ybVByb3BzLnNrZXcueV0sXG4gICAgICAgICAgICAgICAgKCkgPT4gYHNrZXcoJHt0cmFuc2Zvcm1Qcm9wcy5za2V3IS54LnZhbHVlfWRlZywgJHt0cmFuc2Zvcm1Qcm9wcy5za2V3IS55LnZhbHVlfWRlZylgKTtcbiAgICAgICAgICAgIHRyYW5zZm9ybXMudHJhbnNmb3JtID0gdHJhbnNmb3Jtcy50cmFuc2Zvcm0gP1xuICAgICAgICAgICAgICAgIG9wZXJhdGVkKFt0cmFuc2Zvcm1zLnRyYW5zZm9ybSwgc2tld1N0cl0sICh0LCBzKSA9PiBgJHt0fSAke3N9YCkgOiBza2V3U3RyO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGJpbmRNb3JwaChlbGVtZW50LCB0cmFuc2Zvcm1zLCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICAvLyBCaW5kIHJlYWN0aXZlIGNvbG9yIHdpdGggc21vb3RoIHRyYW5zaXRpb25zXG4gICAgc3RhdGljIGJpbmRDb2xvcihcbiAgICAgICAgZWxlbWVudDogSFRNTEVsZW1lbnQsXG4gICAgICAgIHByb3BlcnR5OiBzdHJpbmcsXG4gICAgICAgIGNvbG9yOiBSZXR1cm5UeXBlPHR5cGVvZiBudW1iZXJSZWY+IHwgc3RyaW5nLFxuICAgICAgICBhbmltYXRpb25UeXBlOiAnaW5zdGFudCcgfCAnYW5pbWF0ZScgfCAndHJhbnNpdGlvbicgPSAndHJhbnNpdGlvbicsXG4gICAgICAgIG9wdGlvbnM6IFRyYW5zaXRpb25PcHRpb25zID0geyBkdXJhdGlvbjogMzAwLCBlYXNpbmc6ICdlYXNlLWluLW91dCcgfVxuICAgICk6ICgpID0+IHZvaWQge1xuICAgICAgICBjb25zdCBiaW5kZXIgPSBhbmltYXRpb25UeXBlID09PSAnaW5zdGFudCcgPyBiaW5kV2l0aCA6XG4gICAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uVHlwZSA9PT0gJ2FuaW1hdGUnID8gYmluZEFuaW1hdGVkIDogYmluZFRyYW5zaXRpb247XG5cbiAgICAgICAgY29uc3QgY29sb3JWYWx1ZSA9IHR5cGVvZiBjb2xvciA9PT0gJ3N0cmluZycgPyBjb2xvciA6XG4gICAgICAgICAgICBvcGVyYXRlZChbY29sb3JdLCAoKSA9PiBgaHNsKCR7Y29sb3IudmFsdWV9LCA3MCUsIDUwJSlgKTtcblxuICAgICAgICByZXR1cm4gYmluZGVyKGVsZW1lbnQsIHByb3BlcnR5LCBjb2xvclZhbHVlLCBvcHRpb25zKSA/PyAoKCkgPT4ge30pO1xuICAgIH1cblxuICAgIC8vIEJpbmQgcmVhY3RpdmUgb3BhY2l0eSB3aXRoIGZhZGUgZWZmZWN0c1xuICAgIHN0YXRpYyBiaW5kT3BhY2l0eShcbiAgICAgICAgZWxlbWVudDogSFRNTEVsZW1lbnQsXG4gICAgICAgIG9wYWNpdHk6IFJldHVyblR5cGU8dHlwZW9mIG51bWJlclJlZj4sXG4gICAgICAgIGFuaW1hdGlvblR5cGU6ICdpbnN0YW50JyB8ICdhbmltYXRlJyB8ICd0cmFuc2l0aW9uJyB8ICdzcHJpbmcnID0gJ3RyYW5zaXRpb24nLFxuICAgICAgICBvcHRpb25zOiBBbmltYXRpb25PcHRpb25zIHwgVHJhbnNpdGlvbk9wdGlvbnMgPSB7IGR1cmF0aW9uOiAyMDAsIGVhc2luZzogJ2Vhc2UtaW4tb3V0JyB9XG4gICAgKTogKCkgPT4gdm9pZCB7XG4gICAgICAgIGNvbnN0IGJpbmRlciA9IGFuaW1hdGlvblR5cGUgPT09ICdpbnN0YW50JyA/IGJpbmRXaXRoIDpcbiAgICAgICAgICAgICAgICAgICAgICBhbmltYXRpb25UeXBlID09PSAnYW5pbWF0ZScgPyBiaW5kQW5pbWF0ZWQgOlxuICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvblR5cGUgPT09ICd0cmFuc2l0aW9uJyA/IGJpbmRUcmFuc2l0aW9uIDogYmluZFNwcmluZztcblxuICAgICAgICByZXR1cm4gYmluZGVyKGVsZW1lbnQsICdvcGFjaXR5Jywgb3BhY2l0eSwgb3B0aW9ucykgPz8gKCgpID0+IHt9KTtcbiAgICB9XG5cbiAgICAvLyBCaW5kIHJlYWN0aXZlIGJvcmRlciByYWRpdXMgd2l0aCBtb3JwaGluZ1xuICAgIHN0YXRpYyBiaW5kQm9yZGVyUmFkaXVzKFxuICAgICAgICBlbGVtZW50OiBIVE1MRWxlbWVudCxcbiAgICAgICAgcmFkaXVzOiBWZWN0b3IyRCB8IFJldHVyblR5cGU8dHlwZW9mIG51bWJlclJlZj4sXG4gICAgICAgIGFuaW1hdGlvblR5cGU6ICdpbnN0YW50JyB8ICdhbmltYXRlJyB8ICd0cmFuc2l0aW9uJyB8ICdzcHJpbmcnID0gJ2FuaW1hdGUnLFxuICAgICAgICBvcHRpb25zOiBBbmltYXRpb25PcHRpb25zIHwgVHJhbnNpdGlvbk9wdGlvbnMgPSB7IGR1cmF0aW9uOiAzMDAsIGVhc2luZzogJ2Vhc2Utb3V0JyB9XG4gICAgKTogKCkgPT4gdm9pZCB7XG4gICAgICAgIGNvbnN0IGJpbmRlciA9IGFuaW1hdGlvblR5cGUgPT09ICdpbnN0YW50JyA/IGJpbmRXaXRoIDpcbiAgICAgICAgICAgICAgICAgICAgICBhbmltYXRpb25UeXBlID09PSAnYW5pbWF0ZScgPyBiaW5kQW5pbWF0ZWQgOlxuICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvblR5cGUgPT09ICd0cmFuc2l0aW9uJyA/IGJpbmRUcmFuc2l0aW9uIDogYmluZFNwcmluZztcblxuICAgICAgICBjb25zdCByYWRpdXNWYWx1ZSA9IHJhZGl1cyBpbnN0YW5jZW9mIFZlY3RvcjJEID9cbiAgICAgICAgICAgIG9wZXJhdGVkKFtyYWRpdXMueCwgcmFkaXVzLnldLCAoKSA9PiBgJHtyYWRpdXMueC52YWx1ZX1weCAke3JhZGl1cy55LnZhbHVlfXB4YCkgOlxuICAgICAgICAgICAgb3BlcmF0ZWQoW3JhZGl1c10sICgpID0+IGAke3JhZGl1cy52YWx1ZX1weGApO1xuXG4gICAgICAgIHJldHVybiBiaW5kZXIoZWxlbWVudCwgJ2JvcmRlci1yYWRpdXMnLCByYWRpdXNWYWx1ZSwgb3B0aW9ucykgPz8gKCgpID0+IHt9KTtcbiAgICB9XG59XG5cbi8vIENTUyBDYWxjL01hdGggT3BlcmF0aW9uc1xuZXhwb3J0IGNsYXNzIENTU0NhbGMge1xuICAgIC8vIENyZWF0ZSBDU1MgY2FsYyBleHByZXNzaW9uIGZyb20gcmVhY3RpdmUgdmFsdWVzXG4gICAgc3RhdGljIGFkZChhOiBSZXR1cm5UeXBlPHR5cGVvZiBudW1iZXJSZWY+LCBiOiBSZXR1cm5UeXBlPHR5cGVvZiBudW1iZXJSZWY+LCB1bml0OiBzdHJpbmcgPSAncHgnKTogUmV0dXJuVHlwZTx0eXBlb2YgbnVtYmVyUmVmPiB7XG4gICAgICAgIHJldHVybiBvcGVyYXRlZChbYSwgYl0sICgpID0+IGBjYWxjKCR7YS52YWx1ZX0ke3VuaXR9ICsgJHtiLnZhbHVlfSR7dW5pdH0pYCk7XG4gICAgfVxuXG4gICAgc3RhdGljIHN1YnRyYWN0KGE6IFJldHVyblR5cGU8dHlwZW9mIG51bWJlclJlZj4sIGI6IFJldHVyblR5cGU8dHlwZW9mIG51bWJlclJlZj4sIHVuaXQ6IHN0cmluZyA9ICdweCcpOiBSZXR1cm5UeXBlPHR5cGVvZiBudW1iZXJSZWY+IHtcbiAgICAgICAgcmV0dXJuIG9wZXJhdGVkKFthLCBiXSwgKCkgPT4gYGNhbGMoJHthLnZhbHVlfSR7dW5pdH0gLSAke2IudmFsdWV9JHt1bml0fSlgKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgbXVsdGlwbHkoYTogUmV0dXJuVHlwZTx0eXBlb2YgbnVtYmVyUmVmPiwgYjogUmV0dXJuVHlwZTx0eXBlb2YgbnVtYmVyUmVmPik6IFJldHVyblR5cGU8dHlwZW9mIG51bWJlclJlZj4ge1xuICAgICAgICByZXR1cm4gb3BlcmF0ZWQoW2EsIGJdLCAoKSA9PiBgY2FsYygke2EudmFsdWV9ICogJHtiLnZhbHVlfSlgKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZGl2aWRlKGE6IFJldHVyblR5cGU8dHlwZW9mIG51bWJlclJlZj4sIGI6IFJldHVyblR5cGU8dHlwZW9mIG51bWJlclJlZj4pOiBSZXR1cm5UeXBlPHR5cGVvZiBudW1iZXJSZWY+IHtcbiAgICAgICAgcmV0dXJuIG9wZXJhdGVkKFthLCBiXSwgKCkgPT4gYGNhbGMoJHthLnZhbHVlfSAvICR7Yi52YWx1ZX0pYCk7XG4gICAgfVxuXG4gICAgLy8gQ2xhbXAgcmVhY3RpdmUgdmFsdWUgYmV0d2VlbiBtaW4gYW5kIG1heFxuICAgIHN0YXRpYyBjbGFtcCh2YWx1ZTogUmV0dXJuVHlwZTx0eXBlb2YgbnVtYmVyUmVmPiwgbWluOiBSZXR1cm5UeXBlPHR5cGVvZiBudW1iZXJSZWY+LCBtYXg6IFJldHVyblR5cGU8dHlwZW9mIG51bWJlclJlZj4sIHVuaXQ6IHN0cmluZyA9ICdweCcpOiBSZXR1cm5UeXBlPHR5cGVvZiBudW1iZXJSZWY+IHtcbiAgICAgICAgcmV0dXJuIG9wZXJhdGVkKFt2YWx1ZSwgbWluLCBtYXhdLCAoKSA9PiBgY2xhbXAoJHttaW4udmFsdWV9JHt1bml0fSwgJHt2YWx1ZS52YWx1ZX0ke3VuaXR9LCAke21heC52YWx1ZX0ke3VuaXR9KWApO1xuICAgIH1cblxuICAgIC8vIE1pbi9tYXggb3BlcmF0aW9uc1xuICAgIHN0YXRpYyBtaW4oYTogUmV0dXJuVHlwZTx0eXBlb2YgbnVtYmVyUmVmPiwgYjogUmV0dXJuVHlwZTx0eXBlb2YgbnVtYmVyUmVmPiwgdW5pdDogc3RyaW5nID0gJ3B4Jyk6IFJldHVyblR5cGU8dHlwZW9mIG51bWJlclJlZj4ge1xuICAgICAgICByZXR1cm4gb3BlcmF0ZWQoW2EsIGJdLCAoKSA9PiBgbWluKCR7YS52YWx1ZX0ke3VuaXR9LCAke2IudmFsdWV9JHt1bml0fSlgKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgbWF4KGE6IFJldHVyblR5cGU8dHlwZW9mIG51bWJlclJlZj4sIGI6IFJldHVyblR5cGU8dHlwZW9mIG51bWJlclJlZj4sIHVuaXQ6IHN0cmluZyA9ICdweCcpOiBSZXR1cm5UeXBlPHR5cGVvZiBudW1iZXJSZWY+IHtcbiAgICAgICAgcmV0dXJuIG9wZXJhdGVkKFthLCBiXSwgKCkgPT4gYG1heCgke2EudmFsdWV9JHt1bml0fSwgJHtiLnZhbHVlfSR7dW5pdH0pYCk7XG4gICAgfVxufVxuXG4vLyBET00gTWF0cml4IEludGVncmF0aW9uXG5leHBvcnQgY2xhc3MgRE9NTWF0cml4QWRhcHRlciB7XG4gICAgLy8gQ29udmVydCByZWFjdGl2ZSBNYXRyaXg0RCB0byBET01NYXRyaXhcbiAgICBzdGF0aWMgdG9ET01NYXRyaXgobWF0cml4OiBNYXRyaXg0RCk6IERPTU1hdHJpeCB7XG4gICAgICAgIHJldHVybiBuZXcgRE9NTWF0cml4KG1hdHJpeC5lbGVtZW50cy5tYXAoZSA9PiBlLnZhbHVlKSk7XG4gICAgfVxuXG4gICAgLy8gQ29udmVydCBET01NYXRyaXggdG8gcmVhY3RpdmUgTWF0cml4NERcbiAgICBzdGF0aWMgZnJvbURPTU1hdHJpeChkb21NYXRyaXg6IERPTU1hdHJpeCk6IE1hdHJpeDREIHtcbiAgICAgICAgY29uc3QgZWxlbWVudHMgPSBBcnJheS5mcm9tKGRvbU1hdHJpeC50b0Zsb2F0MzJBcnJheSgpKS5tYXAodiA9PiBudW1iZXJSZWYodikpO1xuICAgICAgICByZXR1cm4gbmV3IE1hdHJpeDREKFxuICAgICAgICAgICAgZWxlbWVudHNbMF0sIGVsZW1lbnRzWzFdLCBlbGVtZW50c1syXSwgZWxlbWVudHNbM10sXG4gICAgICAgICAgICBlbGVtZW50c1s0XSwgZWxlbWVudHNbNV0sIGVsZW1lbnRzWzZdLCBlbGVtZW50c1s3XSxcbiAgICAgICAgICAgIGVsZW1lbnRzWzhdLCBlbGVtZW50c1s5XSwgZWxlbWVudHNbMTBdLCBlbGVtZW50c1sxMV0sXG4gICAgICAgICAgICBlbGVtZW50c1sxMl0sIGVsZW1lbnRzWzEzXSwgZWxlbWVudHNbMTRdLCBlbGVtZW50c1sxNV1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBBcHBseSByZWFjdGl2ZSB0cmFuc2Zvcm0gdG8gRE9NTWF0cml4XG4gICAgc3RhdGljIGFwcGx5VHJhbnNmb3JtKGRvbU1hdHJpeDogRE9NTWF0cml4LCB0cmFuc2Zvcm06IE1hdHJpeDREKTogRE9NTWF0cml4IHtcbiAgICAgICAgY29uc3QgcmVhY3RpdmVNYXRyaXggPSB0aGlzLmZyb21ET01NYXRyaXgoZG9tTWF0cml4KTtcbiAgICAgICAgLy8gVGhpcyB3b3VsZCBuZWVkIG1hdHJpeCBtdWx0aXBsaWNhdGlvbiAtIHNpbXBsaWZpZWQgZm9yIG5vd1xuICAgICAgICByZXR1cm4gZG9tTWF0cml4Lm11bHRpcGx5U2VsZih0aGlzLnRvRE9NTWF0cml4KHRyYW5zZm9ybSkpO1xuICAgIH1cbn1cblxuLy8gQ1NTIEN1c3RvbSBQcm9wZXJ0aWVzIEludGVncmF0aW9uXG5leHBvcnQgY2xhc3MgQ1NTQ3VzdG9tUHJvcHMge1xuICAgIC8vIEJpbmQgcmVhY3RpdmUgdmFsdWUgdG8gQ1NTIGN1c3RvbSBwcm9wZXJ0eVxuICAgIHN0YXRpYyBiaW5kUHJvcGVydHkoZWxlbWVudDogSFRNTEVsZW1lbnQsIHByb3BOYW1lOiBzdHJpbmcsIHZhbHVlOiBSZXR1cm5UeXBlPHR5cGVvZiBudW1iZXJSZWY+LCB1bml0OiBzdHJpbmcgPSAnJyk6ICgpID0+IHZvaWQge1xuICAgICAgICByZXR1cm4gb3BlcmF0ZWQoW3ZhbHVlXSwgKCkgPT4ge1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShwcm9wTmFtZSwgYCR7dmFsdWUudmFsdWV9JHt1bml0fWApO1xuICAgICAgICAgICAgcmV0dXJuICgpID0+IHt9OyAvLyBSZXR1cm4gY2xlYW51cCBmdW5jdGlvblxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBCaW5kIHJlYWN0aXZlIFZlY3RvcjJEIHRvIENTUyBjdXN0b20gcHJvcGVydGllc1xuICAgIHN0YXRpYyBiaW5kVmVjdG9yUHJvcGVydGllcyhlbGVtZW50OiBIVE1MRWxlbWVudCwgYmFzZU5hbWU6IHN0cmluZywgdmVjdG9yOiBWZWN0b3IyRCwgdW5pdDogc3RyaW5nID0gJ3B4Jyk6ICgpID0+IHZvaWQge1xuICAgICAgICBjb25zdCB1bnN1YlggPSB0aGlzLmJpbmRQcm9wZXJ0eShlbGVtZW50LCBgJHtiYXNlTmFtZX0teGAsIHZlY3Rvci54LCB1bml0KTtcbiAgICAgICAgY29uc3QgdW5zdWJZID0gdGhpcy5iaW5kUHJvcGVydHkoZWxlbWVudCwgYCR7YmFzZU5hbWV9LXlgLCB2ZWN0b3IueSwgdW5pdCk7XG4gICAgICAgIHJldHVybiAoKSA9PiB7IHVuc3ViWCgpOyB1bnN1YlkoKTsgfTtcbiAgICB9XG5cbiAgICAvLyBHZXQgcmVhY3RpdmUgdmFsdWUgZnJvbSBDU1MgY3VzdG9tIHByb3BlcnR5XG4gICAgc3RhdGljIGdldFJlYWN0aXZlUHJvcGVydHkoZWxlbWVudDogSFRNTEVsZW1lbnQsIHByb3BOYW1lOiBzdHJpbmcpOiBSZXR1cm5UeXBlPHR5cGVvZiBudW1iZXJSZWY+IHtcbiAgICAgICAgY29uc3QgaW5pdGlhbFZhbHVlID0gcGFyc2VGbG9hdChnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpLmdldFByb3BlcnR5VmFsdWUocHJvcE5hbWUpKSB8fCAwO1xuICAgICAgICBjb25zdCByZWFjdGl2ZVZhbHVlID0gbnVtYmVyUmVmKGluaXRpYWxWYWx1ZSk7XG5cbiAgICAgICAgLy8gU2V0IHVwIG9ic2VydmVyIGZvciBDU1MgY3VzdG9tIHByb3BlcnR5IGNoYW5nZXNcbiAgICAgICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBuZXdWYWx1ZSA9IHBhcnNlRmxvYXQoZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KS5nZXRQcm9wZXJ0eVZhbHVlKHByb3BOYW1lKSkgfHwgMDtcbiAgICAgICAgICAgIHJlYWN0aXZlVmFsdWUudmFsdWUgPSBuZXdWYWx1ZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZShlbGVtZW50LCB7XG4gICAgICAgICAgICBhdHRyaWJ1dGVzOiB0cnVlLFxuICAgICAgICAgICAgYXR0cmlidXRlRmlsdGVyOiBbJ3N0eWxlJ11cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHJlYWN0aXZlVmFsdWU7XG4gICAgfVxufVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBVbmlmaWVkIFVuaXQgQ29udmVyc2lvbiBhbmQgQ1NTIFV0aWxpdGllc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vLyBDU1MgVW5pdCBDb252ZXJzaW9uIGFuZCBGb3JtYXR0aW5nIFV0aWxpdGllc1xuZXhwb3J0IGNsYXNzIENTU1VuaXRVdGlscyB7XG4gICAgLy8gQ29udmVydCByZWFjdGl2ZSB2YWx1ZXMgdG8gQ1NTIHBpeGVsIHVuaXRzXG4gICAgc3RhdGljIGFzUHgodmFsdWU6IG51bWJlciB8IHN0cmluZyB8IFJldHVyblR5cGU8dHlwZW9mIG51bWJlclJlZj4pOiBzdHJpbmcgfCBSZXR1cm5UeXBlPHR5cGVvZiBudW1iZXJSZWY+IHtcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt2YWx1ZSB8fCAwfXB4YDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlIHx8ICcwcHgnO1xuICAgICAgICB9XG4gICAgICAgIC8vIFJlYWN0aXZlIHZhbHVlIC0gcmV0dXJuIGNvbXB1dGVkIHN0cmluZ1xuICAgICAgICByZXR1cm4gb3BlcmF0ZWQoW3ZhbHVlXSwgKHYpID0+IGAke3YgfHwgMH1weGApO1xuICAgIH1cblxuICAgIC8vIENvbnZlcnQgcmVhY3RpdmUgdmFsdWVzIHRvIENTUyBwZXJjZW50YWdlIHVuaXRzXG4gICAgc3RhdGljIGFzUGVyY2VudCh2YWx1ZTogbnVtYmVyIHwgc3RyaW5nIHwgUmV0dXJuVHlwZTx0eXBlb2YgbnVtYmVyUmVmPik6IHN0cmluZyB8IFJldHVyblR5cGU8dHlwZW9mIG51bWJlclJlZj4ge1xuICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgcmV0dXJuIGAke3ZhbHVlIHx8IDB9JWA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZSB8fCAnMCUnO1xuICAgICAgICB9XG4gICAgICAgIC8vIFJlYWN0aXZlIHZhbHVlIC0gcmV0dXJuIGNvbXB1dGVkIHN0cmluZ1xuICAgICAgICByZXR1cm4gb3BlcmF0ZWQoW3ZhbHVlXSwgKHYpID0+IGAke3YgfHwgMH0lYCk7XG4gICAgfVxuXG4gICAgLy8gQ29udmVydCByZWFjdGl2ZSB2YWx1ZXMgdG8gQ1NTIGVtIHVuaXRzXG4gICAgc3RhdGljIGFzRW0odmFsdWU6IG51bWJlciB8IHN0cmluZyB8IFJldHVyblR5cGU8dHlwZW9mIG51bWJlclJlZj4pOiBzdHJpbmcgfCBSZXR1cm5UeXBlPHR5cGVvZiBudW1iZXJSZWY+IHtcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt2YWx1ZSB8fCAwfWVtYDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlIHx8ICcwZW0nO1xuICAgICAgICB9XG4gICAgICAgIC8vIFJlYWN0aXZlIHZhbHVlIC0gcmV0dXJuIGNvbXB1dGVkIHN0cmluZ1xuICAgICAgICByZXR1cm4gb3BlcmF0ZWQoW3ZhbHVlXSwgKHYpID0+IGAke3YgfHwgMH1lbWApO1xuICAgIH1cblxuICAgIC8vIENvbnZlcnQgcmVhY3RpdmUgdmFsdWVzIHRvIENTUyByZW0gdW5pdHNcbiAgICBzdGF0aWMgYXNSZW0odmFsdWU6IG51bWJlciB8IHN0cmluZyB8IFJldHVyblR5cGU8dHlwZW9mIG51bWJlclJlZj4pOiBzdHJpbmcgfCBSZXR1cm5UeXBlPHR5cGVvZiBudW1iZXJSZWY+IHtcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt2YWx1ZSB8fCAwfXJlbWA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZSB8fCAnMHJlbSc7XG4gICAgICAgIH1cbiAgICAgICAgLy8gUmVhY3RpdmUgdmFsdWUgLSByZXR1cm4gY29tcHV0ZWQgc3RyaW5nXG4gICAgICAgIHJldHVybiBvcGVyYXRlZChbdmFsdWVdLCAodikgPT4gYCR7diB8fCAwfXJlbWApO1xuICAgIH1cblxuICAgIC8vIENvbnZlcnQgcmVhY3RpdmUgdmFsdWVzIHRvIENTUyB2aWV3cG9ydCB1bml0c1xuICAgIHN0YXRpYyBhc1Z3KHZhbHVlOiBudW1iZXIgfCBzdHJpbmcgfCBSZXR1cm5UeXBlPHR5cGVvZiBudW1iZXJSZWY+KTogc3RyaW5nIHwgUmV0dXJuVHlwZTx0eXBlb2YgbnVtYmVyUmVmPiB7XG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dmFsdWUgfHwgMH12d2A7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZSB8fCAnMHZ3JztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3BlcmF0ZWQoW3ZhbHVlXSwgKHYpID0+IGAke3YgfHwgMH12d2ApO1xuICAgIH1cblxuICAgIHN0YXRpYyBhc1ZoKHZhbHVlOiBudW1iZXIgfCBzdHJpbmcgfCBSZXR1cm5UeXBlPHR5cGVvZiBudW1iZXJSZWY+KTogc3RyaW5nIHwgUmV0dXJuVHlwZTx0eXBlb2YgbnVtYmVyUmVmPiB7XG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dmFsdWUgfHwgMH12aGA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZSB8fCAnMHZoJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3BlcmF0ZWQoW3ZhbHVlXSwgKHYpID0+IGAke3YgfHwgMH12aGApO1xuICAgIH1cblxuICAgIC8vIEdlbmVyaWMgdW5pdCBjb252ZXJ0ZXIgd2l0aCBmYWxsYmFja1xuICAgIHN0YXRpYyBhc1VuaXQodmFsdWU6IG51bWJlciB8IHN0cmluZyB8IFJldHVyblR5cGU8dHlwZW9mIG51bWJlclJlZj4sIHVuaXQ6IHN0cmluZywgZmFsbGJhY2tWYWx1ZTogbnVtYmVyID0gMCk6IHN0cmluZyB8IFJldHVyblR5cGU8dHlwZW9mIG51bWJlclJlZj4ge1xuICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgcmV0dXJuIGAke3ZhbHVlIHx8IGZhbGxiYWNrVmFsdWV9JHt1bml0fWA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZSB8fCBgJHtmYWxsYmFja1ZhbHVlfSR7dW5pdH1gO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvcGVyYXRlZChbdmFsdWVdLCAodikgPT4gYCR7diB8fCBmYWxsYmFja1ZhbHVlfSR7dW5pdH1gKTtcbiAgICB9XG5cbiAgICAvLyBSZWFjdGl2ZSBDU1MgY2FsYygpIGV4cHJlc3Npb25zXG4gICAgc3RhdGljIGNhbGMoZXhwcmVzc2lvbjogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIGBjYWxjKCR7ZXhwcmVzc2lvbn0pYDtcbiAgICB9XG5cbiAgICAvLyBDcmVhdGUgcmVhY3RpdmUgY2FsYyBleHByZXNzaW9uc1xuICAgIHN0YXRpYyByZWFjdGl2ZUNhbGMob3BlcmFuZHM6IEFycmF5PG51bWJlciB8IHN0cmluZyB8IFJldHVyblR5cGU8dHlwZW9mIG51bWJlclJlZj4+LCBvcGVyYXRvcjogc3RyaW5nKTogUmV0dXJuVHlwZTx0eXBlb2YgbnVtYmVyUmVmPiB7XG4gICAgICAgIHJldHVybiBvcGVyYXRlZChvcGVyYW5kcywgKC4uLnZhbHVlcykgPT4ge1xuICAgICAgICAgICAgY29uc3QgZXhwcmVzc2lvbiA9IHZhbHVlcy5qb2luKGAgJHtvcGVyYXRvcn0gYCk7XG4gICAgICAgICAgICByZXR1cm4gYGNhbGMoJHtleHByZXNzaW9ufSlgO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBDbGFtcCByZWFjdGl2ZSB2YWx1ZXMgd2l0aCBDU1MgY2xhbXAoKVxuICAgIHN0YXRpYyBjbGFtcChtaW46IG51bWJlciB8IHN0cmluZyB8IFJldHVyblR5cGU8dHlwZW9mIG51bWJlclJlZj4sXG4gICAgICAgICAgICAgICAgIHZhbHVlOiBudW1iZXIgfCBzdHJpbmcgfCBSZXR1cm5UeXBlPHR5cGVvZiBudW1iZXJSZWY+LFxuICAgICAgICAgICAgICAgICBtYXg6IG51bWJlciB8IHN0cmluZyB8IFJldHVyblR5cGU8dHlwZW9mIG51bWJlclJlZj4pOiBSZXR1cm5UeXBlPHR5cGVvZiBudW1iZXJSZWY+IHtcbiAgICAgICAgY29uc3QgbWluU3RyID0gdHlwZW9mIG1pbiA9PT0gJ251bWJlcicgfHwgdHlwZW9mIG1pbiA9PT0gJ3N0cmluZycgPyBtaW4gOiBvcGVyYXRlZChbbWluXSwgdiA9PiB2KTtcbiAgICAgICAgY29uc3QgdmFsU3RyID0gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyB8fCB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnID8gdmFsdWUgOiBvcGVyYXRlZChbdmFsdWVdLCB2ID0+IHYpO1xuICAgICAgICBjb25zdCBtYXhTdHIgPSB0eXBlb2YgbWF4ID09PSAnbnVtYmVyJyB8fCB0eXBlb2YgbWF4ID09PSAnc3RyaW5nJyA/IG1heCA6IG9wZXJhdGVkKFttYXhdLCB2ID0+IHYpO1xuXG4gICAgICAgIHJldHVybiBvcGVyYXRlZChbbWluU3RyLCB2YWxTdHIsIG1heFN0cl0uZmlsdGVyKHYgPT4gdHlwZW9mIHYgIT09ICdzdHJpbmcnKSwgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbWluVmFsID0gdHlwZW9mIG1pbiA9PT0gJ251bWJlcicgPyBtaW4gOiAodHlwZW9mIG1pbiA9PT0gJ3N0cmluZycgPyBtaW4gOiBtaW4udmFsdWUpO1xuICAgICAgICAgICAgY29uc3QgdmFsID0gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyA/IHZhbHVlIDogKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgPyB2YWx1ZSA6IHZhbHVlLnZhbHVlKTtcbiAgICAgICAgICAgIGNvbnN0IG1heFZhbCA9IHR5cGVvZiBtYXggPT09ICdudW1iZXInID8gbWF4IDogKHR5cGVvZiBtYXggPT09ICdzdHJpbmcnID8gbWF4IDogbWF4LnZhbHVlKTtcbiAgICAgICAgICAgIHJldHVybiBgY2xhbXAoJHttaW5WYWx9LCAke3ZhbH0sICR7bWF4VmFsfSlgO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBSZWFjdGl2ZSBtYXgvbWluIGZ1bmN0aW9uc1xuICAgIHN0YXRpYyBtYXgodmFsdWVzOiBBcnJheTxudW1iZXIgfCBzdHJpbmcgfCBSZXR1cm5UeXBlPHR5cGVvZiBudW1iZXJSZWY+Pik6IFJldHVyblR5cGU8dHlwZW9mIG51bWJlclJlZj4ge1xuICAgICAgICByZXR1cm4gb3BlcmF0ZWQodmFsdWVzLmZpbHRlcih2ID0+IHR5cGVvZiB2ICE9PSAnc3RyaW5nJyksICguLi5udW1zKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjc3NWYWx1ZXMgPSB2YWx1ZXMubWFwKHYgPT5cbiAgICAgICAgICAgICAgICB0eXBlb2YgdiA9PT0gJ251bWJlcicgPyB2IDogKHR5cGVvZiB2ID09PSAnc3RyaW5nJyA/IHYgOiB2LnZhbHVlKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBgbWF4KCR7Y3NzVmFsdWVzLmpvaW4oJywgJyl9KWA7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHN0YXRpYyBtaW4odmFsdWVzOiBBcnJheTxudW1iZXIgfCBzdHJpbmcgfCBSZXR1cm5UeXBlPHR5cGVvZiBudW1iZXJSZWY+Pik6IFJldHVyblR5cGU8dHlwZW9mIG51bWJlclJlZj4ge1xuICAgICAgICByZXR1cm4gb3BlcmF0ZWQodmFsdWVzLmZpbHRlcih2ID0+IHR5cGVvZiB2ICE9PSAnc3RyaW5nJyksICguLi5udW1zKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjc3NWYWx1ZXMgPSB2YWx1ZXMubWFwKHYgPT5cbiAgICAgICAgICAgICAgICB0eXBlb2YgdiA9PT0gJ251bWJlcicgPyB2IDogKHR5cGVvZiB2ID09PSAnc3RyaW5nJyA/IHYgOiB2LnZhbHVlKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBgbWluKCR7Y3NzVmFsdWVzLmpvaW4oJywgJyl9KWA7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gRW5oYW5jZWQgVUkgQ29udHJvbCBDU1MgSW50ZWdyYXRpb25cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLy8gU3BlY2lhbGl6ZWQgQ1NTIHV0aWxpdGllcyBmb3IgaW5wdXQgY29udHJvbHNcbmV4cG9ydCBjbGFzcyBDU1NJbnB1dENvbnRyb2xzIHtcbiAgICAvLyBCaW5kIHNsaWRlciB0aHVtYiBwb3NpdGlvbiByZWFjdGl2ZWx5XG4gICAgc3RhdGljIGJpbmRTbGlkZXJUaHVtYihcbiAgICAgICAgdGh1bWJFbGVtZW50OiBIVE1MRWxlbWVudCxcbiAgICAgICAgdmFsdWU6IFJldHVyblR5cGU8dHlwZW9mIG51bWJlclJlZj4sXG4gICAgICAgIG1pbjogUmV0dXJuVHlwZTx0eXBlb2YgbnVtYmVyUmVmPixcbiAgICAgICAgbWF4OiBSZXR1cm5UeXBlPHR5cGVvZiBudW1iZXJSZWY+LFxuICAgICAgICB0cmFja1dpZHRoOiBSZXR1cm5UeXBlPHR5cGVvZiBudW1iZXJSZWY+XG4gICAgKTogKCkgPT4gdm9pZCB7XG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0gb3BlcmF0ZWQoW3ZhbHVlLCBtaW4sIG1heCwgdHJhY2tXaWR0aF0sICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHBlcmNlbnRhZ2UgPSAoKHZhbHVlLnZhbHVlIC0gbWluLnZhbHVlKSAvIChtYXgudmFsdWUgLSBtaW4udmFsdWUpKSAqIDEwMDtcbiAgICAgICAgICAgIHJldHVybiBgdHJhbnNsYXRlWCgke3BlcmNlbnRhZ2V9JSlgO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gQ1NTQmluZGVyLmJpbmRUcmFuc2Zvcm0odGh1bWJFbGVtZW50LCBwb3NpdGlvbik7XG4gICAgfVxuXG4gICAgLy8gQmluZCBwcm9ncmVzcyBiYXIgZmlsbCByZWFjdGl2ZWx5XG4gICAgc3RhdGljIGJpbmRQcm9ncmVzc0ZpbGwoXG4gICAgICAgIGZpbGxFbGVtZW50OiBIVE1MRWxlbWVudCxcbiAgICAgICAgcHJvZ3Jlc3M6IFJldHVyblR5cGU8dHlwZW9mIG51bWJlclJlZj5cbiAgICApOiAoKSA9PiB2b2lkIHtcbiAgICAgICAgY29uc3Qgd2lkdGggPSBvcGVyYXRlZChbcHJvZ3Jlc3NdLCAoKSA9PiBgJHtwcm9ncmVzcy52YWx1ZSAqIDEwMH0lYCk7XG4gICAgICAgIHJldHVybiBiaW5kV2l0aChmaWxsRWxlbWVudCwgJ3dpZHRoJywgd2lkdGgsIGhhbmRsZVN0eWxlQ2hhbmdlKSA/PyAoKCkgPT4ge30pO1xuICAgIH1cblxuICAgIC8vIEJpbmQgY2hlY2tib3gvcmFkaW8gYnV0dG9uIHN0YXRlIHdpdGggYW5pbWF0aW9uc1xuICAgIHN0YXRpYyBiaW5kVG9nZ2xlU3RhdGUoXG4gICAgICAgIGVsZW1lbnQ6IEhUTUxFbGVtZW50LFxuICAgICAgICBjaGVja2VkOiBSZXR1cm5UeXBlPHR5cGVvZiBudW1iZXJSZWY+XG4gICAgKTogKCkgPT4gdm9pZCB7XG4gICAgICAgIGNvbnN0IHNjYWxlID0gb3BlcmF0ZWQoW2NoZWNrZWRdLCAoKSA9PiBjaGVja2VkLnZhbHVlID8gJ3NjYWxlKDEpJyA6ICdzY2FsZSgwKScpO1xuICAgICAgICBjb25zdCBvcGFjaXR5ID0gb3BlcmF0ZWQoW2NoZWNrZWRdLCAoKSA9PiBjaGVja2VkLnZhbHVlID8gJzEnIDogJzAnKTtcblxuICAgICAgICBjb25zdCB1bnN1YlNjYWxlID0gQ1NTQmluZGVyLmJpbmRUcmFuc2Zvcm0oZWxlbWVudCwgc2NhbGUpO1xuICAgICAgICBjb25zdCB1bnN1Yk9wYWNpdHkgPSBiaW5kV2l0aChlbGVtZW50LCAnb3BhY2l0eScsIG9wYWNpdHksIGhhbmRsZVN0eWxlQ2hhbmdlKSA/PyAoKCkgPT4ge30pO1xuXG4gICAgICAgIHJldHVybiAoKSA9PiB7IHVuc3ViU2NhbGU/LigpOyB1bnN1Yk9wYWNpdHk/LigpOyB9O1xuICAgIH1cbn1cblxuLy8gU3BlY2lhbGl6ZWQgQ1NTIHV0aWxpdGllcyBmb3Igc2Nyb2xsYmFyc1xuZXhwb3J0IGNsYXNzIENTU1Njcm9sbGJhckNvbnRyb2xzIHtcbiAgICAvLyBCaW5kIHNjcm9sbGJhciB0aHVtYiBwb3NpdGlvbiBhbmQgc2l6ZSByZWFjdGl2ZWx5XG4gICAgc3RhdGljIGJpbmRTY3JvbGxiYXJUaHVtYihcbiAgICAgICAgdGh1bWJFbGVtZW50OiBIVE1MRWxlbWVudCxcbiAgICAgICAgc2Nyb2xsUG9zaXRpb246IFJldHVyblR5cGU8dHlwZW9mIG51bWJlclJlZj4sXG4gICAgICAgIGNvbnRlbnRTaXplOiBSZXR1cm5UeXBlPHR5cGVvZiBudW1iZXJSZWY+LFxuICAgICAgICBjb250YWluZXJTaXplOiBSZXR1cm5UeXBlPHR5cGVvZiBudW1iZXJSZWY+LFxuICAgICAgICBheGlzOiAnaG9yaXpvbnRhbCcgfCAndmVydGljYWwnID0gJ3ZlcnRpY2FsJ1xuICAgICk6ICgpID0+IHZvaWQge1xuICAgICAgICAvLyBDYWxjdWxhdGUgdGh1bWIgc2l6ZVxuICAgICAgICBjb25zdCB0aHVtYlNpemUgPSBvcGVyYXRlZChbY29udGVudFNpemUsIGNvbnRhaW5lclNpemVdLCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCByYXRpbyA9IGNvbnRhaW5lclNpemUudmFsdWUgLyBjb250ZW50U2l6ZS52YWx1ZTtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLm1heCgyMCwgcmF0aW8gKiBjb250YWluZXJTaXplLnZhbHVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gQ2FsY3VsYXRlIHRodW1iIHBvc2l0aW9uXG4gICAgICAgIGNvbnN0IHRodW1iUG9zaXRpb24gPSBvcGVyYXRlZChbc2Nyb2xsUG9zaXRpb24sIGNvbnRlbnRTaXplLCBjb250YWluZXJTaXplLCB0aHVtYlNpemVdLCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBtYXhTY3JvbGwgPSBNYXRoLm1heCgwLCBjb250ZW50U2l6ZS52YWx1ZSAtIGNvbnRhaW5lclNpemUudmFsdWUpO1xuICAgICAgICAgICAgY29uc3Qgc2Nyb2xsUmF0aW8gPSBtYXhTY3JvbGwgPiAwID8gc2Nyb2xsUG9zaXRpb24udmFsdWUgLyBtYXhTY3JvbGwgOiAwO1xuICAgICAgICAgICAgcmV0dXJuIHNjcm9sbFJhdGlvICogKGNvbnRhaW5lclNpemUudmFsdWUgLSB0aHVtYlNpemUudmFsdWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBDcmVhdGUgdHJhbnNmb3JtIGJhc2VkIG9uIGF4aXNcbiAgICAgICAgY29uc3QgdHJhbnNmb3JtID0gYXhpcyA9PT0gJ3ZlcnRpY2FsJ1xuICAgICAgICAgICAgPyBvcGVyYXRlZChbdGh1bWJQb3NpdGlvbl0sICgpID0+IGB0cmFuc2xhdGVZKCR7dGh1bWJQb3NpdGlvbi52YWx1ZX1weClgKVxuICAgICAgICAgICAgOiBvcGVyYXRlZChbdGh1bWJQb3NpdGlvbl0sICgpID0+IGB0cmFuc2xhdGVYKCR7dGh1bWJQb3NpdGlvbi52YWx1ZX1weClgKTtcblxuICAgICAgICAvLyBCaW5kIHNpemUgYW5kIHRyYW5zZm9ybVxuICAgICAgICBjb25zdCB1bnN1YlNpemUgPSBheGlzID09PSAndmVydGljYWwnXG4gICAgICAgICAgICA/IGJpbmRXaXRoKHRodW1iRWxlbWVudCwgJ2hlaWdodCcsIG9wZXJhdGVkKFt0aHVtYlNpemVdLCAocykgPT4gYCR7c31weGApLCBoYW5kbGVTdHlsZUNoYW5nZSlcbiAgICAgICAgICAgIDogYmluZFdpdGgodGh1bWJFbGVtZW50LCAnd2lkdGgnLCBvcGVyYXRlZChbdGh1bWJTaXplXSwgKHMpID0+IGAke3N9cHhgKSwgaGFuZGxlU3R5bGVDaGFuZ2UpO1xuXG4gICAgICAgIGNvbnN0IHVuc3ViVHJhbnNmb3JtID0gQ1NTQmluZGVyLmJpbmRUcmFuc2Zvcm0odGh1bWJFbGVtZW50LCB0cmFuc2Zvcm0pO1xuXG4gICAgICAgIHJldHVybiAoKSA9PiB7IHVuc3ViU2l6ZT8uKCk7IHVuc3ViVHJhbnNmb3JtPy4oKTsgfTtcbiAgICB9XG5cbiAgICAvLyBCaW5kIHNjcm9sbGJhciB2aXNpYmlsaXR5IHdpdGggc21vb3RoIHRyYW5zaXRpb25zXG4gICAgc3RhdGljIGJpbmRTY3JvbGxiYXJWaXNpYmlsaXR5KFxuICAgICAgICBzY3JvbGxiYXJFbGVtZW50OiBIVE1MRWxlbWVudCxcbiAgICAgICAgaXNWaXNpYmxlOiBSZXR1cm5UeXBlPHR5cGVvZiBudW1iZXJSZWY+LFxuICAgICAgICB0cmFuc2l0aW9uRHVyYXRpb246IG51bWJlciA9IDMwMFxuICAgICk6ICgpID0+IHZvaWQge1xuICAgICAgICBjb25zdCBvcGFjaXR5ID0gb3BlcmF0ZWQoW2lzVmlzaWJsZV0sICgpID0+IGlzVmlzaWJsZS52YWx1ZSk7XG4gICAgICAgIGNvbnN0IHZpc2liaWxpdHkgPSBvcGVyYXRlZChbaXNWaXNpYmxlXSwgKCkgPT4gaXNWaXNpYmxlLnZhbHVlID4gMCA/ICd2aXNpYmxlJyA6ICdoaWRkZW4nKTtcbiAgICAgICAgY29uc3QgcG9pbnRlckV2ZW50cyA9IG9wZXJhdGVkKFtpc1Zpc2libGVdLCAoKSA9PiBpc1Zpc2libGUudmFsdWUgPiAwID8gJ2F1dG8nIDogJ25vbmUnKTtcblxuICAgICAgICBjb25zdCB1bnN1Yk9wYWNpdHkgPSBiaW5kV2l0aChzY3JvbGxiYXJFbGVtZW50LCAnb3BhY2l0eScsIG9wYWNpdHksIGhhbmRsZVN0eWxlQ2hhbmdlKTtcbiAgICAgICAgY29uc3QgdW5zdWJWaXNpYmlsaXR5ID0gYmluZFdpdGgoc2Nyb2xsYmFyRWxlbWVudCwgJ3Zpc2liaWxpdHknLCB2aXNpYmlsaXR5LCBoYW5kbGVTdHlsZUNoYW5nZSk7XG4gICAgICAgIGNvbnN0IHVuc3ViUG9pbnRlckV2ZW50cyA9IGJpbmRXaXRoKHNjcm9sbGJhckVsZW1lbnQsICdwb2ludGVyLWV2ZW50cycsIHBvaW50ZXJFdmVudHMsIGhhbmRsZVN0eWxlQ2hhbmdlKTtcblxuICAgICAgICAvLyBBZGQgdHJhbnNpdGlvblxuICAgICAgICBzY3JvbGxiYXJFbGVtZW50LnN0eWxlLnRyYW5zaXRpb24gPSBgb3BhY2l0eSAke3RyYW5zaXRpb25EdXJhdGlvbn1tcyBlYXNlLWluLW91dGA7XG5cbiAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgIHVuc3ViT3BhY2l0eT8uKCk7XG4gICAgICAgICAgICB1bnN1YlZpc2liaWxpdHk/LigpO1xuICAgICAgICAgICAgdW5zdWJQb2ludGVyRXZlbnRzPy4oKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBCaW5kIHNjcm9sbGJhciB0aGVtZSBwcm9wZXJ0aWVzIHJlYWN0aXZlbHlcbiAgICBzdGF0aWMgYmluZFNjcm9sbGJhclRoZW1lKFxuICAgICAgICBzY3JvbGxiYXJFbGVtZW50OiBIVE1MRWxlbWVudCxcbiAgICAgICAgdGhlbWU6IHtcbiAgICAgICAgICAgIHRyYWNrQ29sb3I/OiBSZXR1cm5UeXBlPHR5cGVvZiBudW1iZXJSZWY+O1xuICAgICAgICAgICAgdGh1bWJDb2xvcj86IFJldHVyblR5cGU8dHlwZW9mIG51bWJlclJlZj47XG4gICAgICAgICAgICBib3JkZXJSYWRpdXM/OiBSZXR1cm5UeXBlPHR5cGVvZiBudW1iZXJSZWY+O1xuICAgICAgICAgICAgdGhpY2tuZXNzPzogUmV0dXJuVHlwZTx0eXBlb2YgbnVtYmVyUmVmPjtcbiAgICAgICAgfVxuICAgICk6ICgpID0+IHZvaWQge1xuICAgICAgICBjb25zdCB1bmJpbmRlcnM6ICgoKSA9PiB2b2lkKVtdID0gW107XG5cbiAgICAgICAgaWYgKHRoZW1lLnRyYWNrQ29sb3IpIHtcbiAgICAgICAgICAgIHVuYmluZGVycy5wdXNoKGJpbmRXaXRoKHNjcm9sbGJhckVsZW1lbnQsICctLXNjcm9sbGJhci10cmFjay1jb2xvcicsXG4gICAgICAgICAgICAgICAgb3BlcmF0ZWQoW3RoZW1lLnRyYWNrQ29sb3JdLCAoYykgPT4gYHJnYmEoJHtjLnZhbHVlfSwgJHtjLnZhbHVlfSwgJHtjLnZhbHVlfSwgMC4xKWApLCBoYW5kbGVTdHlsZUNoYW5nZSkgPz8gKCgpID0+IHt9KSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhlbWUudGh1bWJDb2xvcikge1xuICAgICAgICAgICAgdW5iaW5kZXJzLnB1c2goYmluZFdpdGgoc2Nyb2xsYmFyRWxlbWVudCwgJy0tc2Nyb2xsYmFyLXRodW1iLWNvbG9yJyxcbiAgICAgICAgICAgICAgICBvcGVyYXRlZChbdGhlbWUudGh1bWJDb2xvcl0sIChjKSA9PiBgcmdiYSgke2MudmFsdWV9LCAke2MudmFsdWV9LCAke2MudmFsdWV9LCAwLjUpYCksIGhhbmRsZVN0eWxlQ2hhbmdlKSA/PyAoKCkgPT4ge30pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGVtZS5ib3JkZXJSYWRpdXMpIHtcbiAgICAgICAgICAgIHVuYmluZGVycy5wdXNoKGJpbmRXaXRoKHNjcm9sbGJhckVsZW1lbnQsICctLXNjcm9sbGJhci1ib3JkZXItcmFkaXVzJyxcbiAgICAgICAgICAgICAgICBvcGVyYXRlZChbdGhlbWUuYm9yZGVyUmFkaXVzXSwgKHIpID0+IGAke3IudmFsdWV9cHhgKSwgaGFuZGxlU3R5bGVDaGFuZ2UpID8/ICgoKSA9PiB7fSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoZW1lLnRoaWNrbmVzcykge1xuICAgICAgICAgICAgdW5iaW5kZXJzLnB1c2goYmluZFdpdGgoc2Nyb2xsYmFyRWxlbWVudCwgJy0tc2Nyb2xsYmFyLXRoaWNrbmVzcycsXG4gICAgICAgICAgICAgICAgb3BlcmF0ZWQoW3RoZW1lLnRoaWNrbmVzc10sICh0KSA9PiBgJHt0LnZhbHVlfXB4YCksIGhhbmRsZVN0eWxlQ2hhbmdlKSA/PyAoKCkgPT4ge30pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAoKSA9PiB1bmJpbmRlcnMuZm9yRWFjaCh1bmJpbmQgPT4gdW5iaW5kPy4oKSk7XG4gICAgfVxufVxuXG4vLyBFbmhhbmNlZCBtb21lbnR1bSBzY3JvbGxpbmcgdXRpbGl0aWVzXG5leHBvcnQgY2xhc3MgQ1NTTW9tZW50dW1TY3JvbGxpbmcge1xuICAgIC8vIENyZWF0ZSBzbW9vdGggc2Nyb2xsIGFuaW1hdGlvbiB3aXRoIG1vbWVudHVtXG4gICAgc3RhdGljIGNyZWF0ZU1vbWVudHVtU2Nyb2xsKFxuICAgICAgICBlbGVtZW50OiBIVE1MRWxlbWVudCxcbiAgICAgICAgdmVsb2NpdHk6IFJldHVyblR5cGU8dHlwZW9mIG51bWJlclJlZj4sXG4gICAgICAgIGRlY2VsZXJhdGlvbjogbnVtYmVyID0gMC45MlxuICAgICk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICAgICAgICBsZXQgYW5pbWF0aW9uSWQ6IG51bWJlcjtcbiAgICAgICAgICAgIGNvbnN0IGFuaW1hdGUgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdmVsb2NpdHkudmFsdWUgKj0gZGVjZWxlcmF0aW9uO1xuXG4gICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKHZlbG9jaXR5LnZhbHVlKSA8IDAuMSkge1xuICAgICAgICAgICAgICAgICAgICB2ZWxvY2l0eS52YWx1ZSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKGFuaW1hdGlvbklkKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZWxlbWVudC5zY3JvbGxCeSh7XG4gICAgICAgICAgICAgICAgICAgIHRvcDogdmVsb2NpdHkudmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIGJlaGF2aW9yOiAnaW5zdGFudCdcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGFuaW1hdGlvbklkID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgYW5pbWF0ZSgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBDcmVhdGUgYm91bmNlLWJhY2sgYW5pbWF0aW9uIGZvciBzY3JvbGwgYm91bmRhcmllc1xuICAgIHN0YXRpYyBjcmVhdGVCb3VuY2VCYWNrKFxuICAgICAgICBlbGVtZW50OiBIVE1MRWxlbWVudCxcbiAgICAgICAgb3ZlclNjcm9sbDogUmV0dXJuVHlwZTx0eXBlb2YgbnVtYmVyUmVmPixcbiAgICAgICAgZHVyYXRpb246IG51bWJlciA9IDMwMFxuICAgICk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICAgICAgICBjb25zdCBzdGFydFRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICAgICAgICAgIGNvbnN0IHN0YXJ0VmFsdWUgPSBvdmVyU2Nyb2xsLnZhbHVlO1xuXG4gICAgICAgICAgICBjb25zdCBhbmltYXRlID0gKGN1cnJlbnRUaW1lOiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBlbGFwc2VkID0gY3VycmVudFRpbWUgLSBzdGFydFRpbWU7XG4gICAgICAgICAgICAgICAgY29uc3QgcHJvZ3Jlc3MgPSBNYXRoLm1pbihlbGFwc2VkIC8gZHVyYXRpb24sIDEpO1xuXG4gICAgICAgICAgICAgICAgLy8gRWFzZSBvdXQgY3ViaWNcbiAgICAgICAgICAgICAgICBjb25zdCBlYXNlZCA9IDEgLSBNYXRoLnBvdygxIC0gcHJvZ3Jlc3MsIDMpO1xuXG4gICAgICAgICAgICAgICAgb3ZlclNjcm9sbC52YWx1ZSA9IHN0YXJ0VmFsdWUgKiAoMSAtIGVhc2VkKTtcblxuICAgICAgICAgICAgICAgIGlmIChwcm9ncmVzcyA8IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG92ZXJTY3JvbGwudmFsdWUgPSAwO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cbi8vIEVuaGFuY2VkIGZvY3VzIGFuZCBpbnRlcmFjdGlvbiBzdGF0ZXNcbmV4cG9ydCBjbGFzcyBDU1NJbnRlcmFjdGlvblN0YXRlcyB7XG4gICAgLy8gQmluZCBmb2N1cyByaW5nIHdpdGggcmVhY3RpdmUgdmlzaWJpbGl0eVxuICAgIHN0YXRpYyBiaW5kRm9jdXNSaW5nKFxuICAgICAgICBlbGVtZW50OiBIVE1MRWxlbWVudCxcbiAgICAgICAgaXNGb2N1c2VkOiBSZXR1cm5UeXBlPHR5cGVvZiBudW1iZXJSZWY+LFxuICAgICAgICByaW5nQ29sb3I6IHN0cmluZyA9ICdyZ2JhKDU5LCAxMzAsIDI0NiwgMC41KSdcbiAgICApOiAoKSA9PiB2b2lkIHtcbiAgICAgICAgY29uc3QgYm94U2hhZG93ID0gb3BlcmF0ZWQoW2lzRm9jdXNlZF0sICgpID0+XG4gICAgICAgICAgICBpc0ZvY3VzZWQudmFsdWUgPyBgMCAwIDAgMnB4ICR7cmluZ0NvbG9yfWAgOiAnbm9uZSdcbiAgICAgICAgKTtcblxuICAgICAgICByZXR1cm4gYmluZFdpdGgoZWxlbWVudCwgJ2JveC1zaGFkb3cnLCBib3hTaGFkb3csIGhhbmRsZVN0eWxlQ2hhbmdlKSA/PyAoKCkgPT4ge30pO1xuICAgIH1cblxuICAgIC8vIEJpbmQgaG92ZXIgc3RhdGUgd2l0aCBzbW9vdGggdHJhbnNpdGlvbnNcbiAgICBzdGF0aWMgYmluZEhvdmVyU3RhdGUoXG4gICAgICAgIGVsZW1lbnQ6IEhUTUxFbGVtZW50LFxuICAgICAgICBpc0hvdmVyZWQ6IFJldHVyblR5cGU8dHlwZW9mIG51bWJlclJlZj4sXG4gICAgICAgIGhvdmVyVHJhbnNmb3JtOiBzdHJpbmcgPSAnc2NhbGUoMS4wNSknXG4gICAgKTogKCkgPT4gdm9pZCB7XG4gICAgICAgIGNvbnN0IHRyYW5zZm9ybSA9IG9wZXJhdGVkKFtpc0hvdmVyZWRdLCAoKSA9PlxuICAgICAgICAgICAgaXNIb3ZlcmVkLnZhbHVlID8gaG92ZXJUcmFuc2Zvcm0gOiAnbm9uZSdcbiAgICAgICAgKTtcblxuICAgICAgICByZXR1cm4gQ1NTQmluZGVyLmJpbmRUcmFuc2Zvcm0oZWxlbWVudCwgdHJhbnNmb3JtKSA/PyAoKCkgPT4ge30pO1xuICAgIH1cblxuICAgIC8vIEJpbmQgYWN0aXZlL3ByZXNzIHN0YXRlXG4gICAgc3RhdGljIGJpbmRBY3RpdmVTdGF0ZShcbiAgICAgICAgZWxlbWVudDogSFRNTEVsZW1lbnQsXG4gICAgICAgIGlzQWN0aXZlOiBSZXR1cm5UeXBlPHR5cGVvZiBudW1iZXJSZWY+LFxuICAgICAgICBhY3RpdmVUcmFuc2Zvcm06IHN0cmluZyA9ICdzY2FsZSgwLjk1KSdcbiAgICApOiAoKSA9PiB2b2lkIHtcbiAgICAgICAgY29uc3QgdHJhbnNmb3JtID0gb3BlcmF0ZWQoW2lzQWN0aXZlXSwgKCkgPT5cbiAgICAgICAgICAgIGlzQWN0aXZlLnZhbHVlID8gYWN0aXZlVHJhbnNmb3JtIDogJ25vbmUnXG4gICAgICAgICk7XG5cbiAgICAgICAgcmV0dXJuIENTU0JpbmRlci5iaW5kVHJhbnNmb3JtKGVsZW1lbnQsIHRyYW5zZm9ybSkgPz8gKCgpID0+IHt9KTtcbiAgICB9XG59XG5cbi8qXG4vLyBFeHBvcnQgYWxsIGVuaGFuY2VkIENTUyBhZGFwdGVyIHV0aWxpdGllc1xuZXhwb3J0IHtcbiAgICBDU1NVbml0Q29udmVydGVyLFxuICAgIENTU1VuaXRVdGlscyxcbiAgICBDU1NUcmFuc2Zvcm0sXG4gICAgQ1NTUG9zaXRpb24sXG4gICAgQ1NTQmluZGVyLFxuICAgIENTU0NhbGMsXG4gICAgRE9NTWF0cml4QWRhcHRlcixcbiAgICBDU1NDdXN0b21Qcm9wcyxcbiAgICBDU1NJbnB1dENvbnRyb2xzLFxuICAgIENTU1Njcm9sbGJhckNvbnRyb2xzLFxuICAgIENTU01vbWVudHVtU2Nyb2xsaW5nLFxuICAgIENTU0ludGVyYWN0aW9uU3RhdGVzXG59OyovXG4iXX0=