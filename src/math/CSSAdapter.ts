import { numberRef, subscribe } from "fest/object";
import { bindWith, bindAnimated, bindTransition, bindSpring, bindMorph } from "fest/lure";
import {
    Vector2D, vector2Ref, operated,
    addVector2D, subtractVector2D, multiplyVector2D,
    Matrix2D, Matrix3D, Matrix4D
} from "./index";
import { handleStyleChange } from "fest/dom";
import { AnimationOptions, TransitionOptions } from "../extension/css-ref/CSSAnimated";

// CSS Typed OM and Unit Conversion Utilities
export class CSSUnitConverter {
    private static readonly unitPatterns = {
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
    static toPixels(value: string, element?: HTMLElement): number {
        if (!value) return 0;

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
    static fromPixels(pixels: number, unit: 'px' | 'em' | 'rem' | '%' = 'px'): string {
        switch (unit) {
            case 'em':
                const fontSize = parseFloat(getComputedStyle(document.body).fontSize);
                return `${pixels / fontSize}em`;
            case 'rem':
                const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
                return `${pixels / rootFontSize}rem`;
            case '%':
                return `${(pixels / window.innerWidth) * 100}%`;
            default:
                return `${pixels}px`;
        }
    }

    // Parse CSS value with units
    static parseValue(cssValue: string): { value: number, unit: string } {
        const match = cssValue.match(/^(-?\d*\.?\d+)([a-z%]+)?$/);
        if (!match) return { value: 0, unit: 'px' };

        return {
            value: parseFloat(match[1]),
            unit: match[2] || 'px'
        };
    }

    // Convert between units
    static convertUnits(value: number, fromUnit: string, toUnit: string, element?: HTMLElement): number {
        if (fromUnit === toUnit) return value;

        // Convert to pixels first
        let pixels: number;
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
                pixels = (value / 100) * window.innerWidth;
                break;
            case 'vw':
                pixels = (value / 100) * window.innerWidth;
                break;
            case 'vh':
                pixels = (value / 100) * window.innerHeight;
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
                return (pixels / window.innerWidth) * 100;
            case 'vw':
                return (pixels / window.innerWidth) * 100;
            case 'vh':
                return (pixels / window.innerHeight) * 100;
            default:
                return pixels;
        }
    }
}

// CSS Transform Utilities with Reactive Math
export class CSSTransform {
    // Convert reactive Vector2D to CSS translate
    static translate2D(vector: Vector2D): ReturnType<typeof numberRef> {
        return operated([vector.x, vector.y], () =>
            `translate(${vector.x.value}px, ${vector.y.value}px)`
        );
    }

    // Convert reactive Vector2D to CSS translate3d
    static translate3D(vector: Vector2D, z: ReturnType<typeof numberRef> = numberRef(0)): ReturnType<typeof numberRef> {
        return operated([vector.x, vector.y, z], () =>
            `translate3d(${vector.x.value}px, ${vector.y.value}px, ${z.value}px)`
        );
    }

    // Convert reactive Vector2D to CSS scale
    static scale2D(vector: Vector2D): ReturnType<typeof numberRef> {
        return operated([vector.x, vector.y], () =>
            `scale(${vector.x.value}, ${vector.y.value})`
        );
    }

    // Convert reactive number to CSS rotate
    static rotate(angle: ReturnType<typeof numberRef>): ReturnType<typeof numberRef> {
        return operated([angle], () => `rotate(${angle.value}deg)`);
    }

    // Combine transforms into single CSS transform string
    static combine(transforms: ReturnType<typeof numberRef>[]): ReturnType<typeof numberRef> {
        return operated(transforms, () => transforms.map(t => t.value).join(' '));
    }

    // Create matrix transform from reactive Matrix2D
    static matrix2D(matrix: Matrix2D): ReturnType<typeof numberRef> {
        return operated(matrix.elements, () =>
            `matrix(${matrix.elements.map(e => e.value).join(', ')})`
        );
    }

    // Create matrix3d transform from reactive Matrix4D
    static matrix3D(matrix: Matrix4D): ReturnType<typeof numberRef> {
        return operated(matrix.elements, () =>
            `matrix3d(${matrix.elements.map(e => e.value).join(', ')})`
        );
    }
}

// CSS Position and Size Utilities
export class CSSPosition {
    // Convert reactive Vector2D to CSS position values
    static leftTop(vector: Vector2D): { left: ReturnType<typeof numberRef>, top: ReturnType<typeof numberRef> } {
        return {
            left: operated([vector.x], () => `${vector.x.value}px`),
            top: operated([vector.y], () => `${vector.y.value}px`)
        };
    }

    // Convert reactive Vector2D to CSS inset values
    static inset(vector: Vector2D): { inset: ReturnType<typeof numberRef> } {
        return {
            inset: operated([vector.x, vector.y], () => `${vector.y.value}px ${vector.x.value}px`)
        };
    }

    // Convert reactive Vector2D to CSS size values
    static size(vector: Vector2D): { width: ReturnType<typeof numberRef>, height: ReturnType<typeof numberRef> } {
        return {
            width: operated([vector.x], () => `${vector.x.value}px`),
            height: operated([vector.y], () => `${vector.y.value}px`)
        };
    }
}

// CSS Reactive Binding Utilities
export class CSSBinder {
    // Bind reactive Vector2D to CSS transform
    static bindTransform(
        element: HTMLElement,
        vector: Vector2D,
        animationType: 'instant' | 'animate' | 'transition' | 'spring' = 'instant',
        options?: AnimationOptions | TransitionOptions
    ): () => void {
        const transformValue = CSSTransform.translate2D(vector);
        const binder = animationType === 'instant' ? bindWith :
                      animationType === 'animate' ? bindAnimated :
                      animationType === 'transition' ? bindTransition : bindSpring;
        return binder(element, 'transform', transformValue, options) ?? (() => {});
    }

    // Bind reactive Vector2D to CSS position
    static bindPosition(
        element: HTMLElement,
        vector: Vector2D,
        animationType: 'instant' | 'animate' | 'transition' | 'spring' = 'instant',
        options?: AnimationOptions | TransitionOptions
    ): () => void {
        const position = CSSPosition.leftTop(vector);
        const binder = animationType === 'instant' ? bindWith :
                      animationType === 'animate' ? bindAnimated :
                      animationType === 'transition' ? bindTransition : bindSpring;

        const unsubLeft = binder(element, 'left', position.left, options) ?? (() => {});
        const unsubTop = binder(element, 'top', position.top, options) ?? (() => {});
        return () => { unsubLeft?.(); unsubTop?.(); };
    }

    // Bind reactive Vector2D to CSS size
    static bindSize(
        element: HTMLElement,
        vector: Vector2D,
        animationType: 'instant' | 'animate' | 'transition' | 'spring' = 'instant',
        options?: AnimationOptions | TransitionOptions
    ): () => void {
        const size = CSSPosition.size(vector);
        const binder = animationType === 'instant' ? bindWith :
                      animationType === 'animate' ? bindAnimated :
                      animationType === 'transition' ? bindTransition : bindSpring;

        const unsubWidth = binder(element, 'width', size.width, options) ?? (() => {});
        const unsubHeight = binder(element, 'height', size.height, options) ?? (() => {});
        return () => { unsubWidth?.(); unsubHeight?.(); };
    }

    // Bind reactive value with unit conversion
    static bindWithUnit(
        element: HTMLElement,
        property: string,
        value: ReturnType<typeof numberRef>,
        unit: string = 'px',
        animationType: 'instant' | 'animate' | 'transition' | 'spring' = 'instant',
        options?: AnimationOptions | TransitionOptions
    ): () => void {
        const cssValue = operated([value], () => `${value.value}${unit}`);
        const binder = animationType === 'instant' ? bindWith :
                      animationType === 'animate' ? bindAnimated :
                      animationType === 'transition' ? bindTransition : bindSpring;
        return binder(element, property, cssValue, options) ?? (() => {});
    }

    // Bind reactive vector with unit conversion
    static bindVectorWithUnit(
        element: HTMLElement,
        vector: Vector2D,
        unit: string = 'px',
        animationType: 'instant' | 'animate' | 'transition' | 'spring' = 'instant',
        options?: AnimationOptions | TransitionOptions
    ): () => void {
        const cssValue = operated([vector.x, vector.y], () =>
            `${vector.x.value}${unit} ${vector.y.value}${unit}`
        );
        const binder = animationType === 'instant' ? bindWith :
                      animationType === 'animate' ? bindAnimated :
                      animationType === 'transition' ? bindTransition : bindSpring;

        return binder(element, 'transform', cssValue, {
            ...options,
            handler: animationType === 'instant' ? undefined : (el: HTMLElement, val: any) => {
                el.style.setProperty('transform', `translate(${val})`);
            }
        }) ?? (() => {});
    }

    // Enhanced animation methods with morphing support
    static bindTransformMorph(
        element: HTMLElement,
        transformProps: {
            translate?: Vector2D;
            scale?: Vector2D | ReturnType<typeof numberRef>;
            rotate?: ReturnType<typeof numberRef>;
            skew?: Vector2D;
        },
        options: AnimationOptions = {}
    ): () => void {
        const transforms: Record<string, any> = {};

        if (transformProps.translate) {
            transforms.transform = operated(
                [transformProps.translate.x, transformProps.translate.y],
                () => `translate(${transformProps.translate!.x.value}px, ${transformProps.translate!.y.value}px)`
            );
        }

        if (transformProps.scale) {
            const scaleStr = transformProps.scale instanceof Vector2D ?
                operated([transformProps.scale.x, transformProps.scale.y],
                    () => `scale(${transformProps.scale!.x.value}, ${transformProps.scale!.y.value})`) :
                operated([transformProps.scale],
                    () => `scale(${transformProps.scale!.value})`);
            transforms.transform = transforms.transform ?
                operated([transforms.transform, scaleStr], (t, s) => `${t} ${s}`) : scaleStr;
        }

        if (transformProps.rotate) {
            const rotateStr = operated([transformProps.rotate],
                () => `rotate(${transformProps.rotate!.value}deg)`);
            transforms.transform = transforms.transform ?
                operated([transforms.transform, rotateStr], (t, r) => `${t} ${r}`) : rotateStr;
        }

        if (transformProps.skew) {
            const skewStr = operated([transformProps.skew.x, transformProps.skew.y],
                () => `skew(${transformProps.skew!.x.value}deg, ${transformProps.skew!.y.value}deg)`);
            transforms.transform = transforms.transform ?
                operated([transforms.transform, skewStr], (t, s) => `${t} ${s}`) : skewStr;
        }

        return bindMorph(element, transforms, options);
    }

    // Bind reactive color with smooth transitions
    static bindColor(
        element: HTMLElement,
        property: string,
        color: ReturnType<typeof numberRef> | string,
        animationType: 'instant' | 'animate' | 'transition' = 'transition',
        options: TransitionOptions = { duration: 300, easing: 'ease-in-out' }
    ): () => void {
        const binder = animationType === 'instant' ? bindWith :
                      animationType === 'animate' ? bindAnimated : bindTransition;

        const colorValue = typeof color === 'string' ? color :
            operated([color], () => `hsl(${color.value}, 70%, 50%)`);

        return binder(element, property, colorValue, options) ?? (() => {});
    }

    // Bind reactive opacity with fade effects
    static bindOpacity(
        element: HTMLElement,
        opacity: ReturnType<typeof numberRef>,
        animationType: 'instant' | 'animate' | 'transition' | 'spring' = 'transition',
        options: AnimationOptions | TransitionOptions = { duration: 200, easing: 'ease-in-out' }
    ): () => void {
        const binder = animationType === 'instant' ? bindWith :
                      animationType === 'animate' ? bindAnimated :
                      animationType === 'transition' ? bindTransition : bindSpring;

        return binder(element, 'opacity', opacity, options) ?? (() => {});
    }

    // Bind reactive border radius with morphing
    static bindBorderRadius(
        element: HTMLElement,
        radius: Vector2D | ReturnType<typeof numberRef>,
        animationType: 'instant' | 'animate' | 'transition' | 'spring' = 'animate',
        options: AnimationOptions | TransitionOptions = { duration: 300, easing: 'ease-out' }
    ): () => void {
        const binder = animationType === 'instant' ? bindWith :
                      animationType === 'animate' ? bindAnimated :
                      animationType === 'transition' ? bindTransition : bindSpring;

        const radiusValue = radius instanceof Vector2D ?
            operated([radius.x, radius.y], () => `${radius.x.value}px ${radius.y.value}px`) :
            operated([radius], () => `${radius.value}px`);

        return binder(element, 'border-radius', radiusValue, options) ?? (() => {});
    }
}

// CSS Calc/Math Operations
export class CSSCalc {
    // Create CSS calc expression from reactive values
    static add(a: ReturnType<typeof numberRef>, b: ReturnType<typeof numberRef>, unit: string = 'px'): ReturnType<typeof numberRef> {
        return operated([a, b], () => `calc(${a.value}${unit} + ${b.value}${unit})`);
    }

    static subtract(a: ReturnType<typeof numberRef>, b: ReturnType<typeof numberRef>, unit: string = 'px'): ReturnType<typeof numberRef> {
        return operated([a, b], () => `calc(${a.value}${unit} - ${b.value}${unit})`);
    }

    static multiply(a: ReturnType<typeof numberRef>, b: ReturnType<typeof numberRef>): ReturnType<typeof numberRef> {
        return operated([a, b], () => `calc(${a.value} * ${b.value})`);
    }

    static divide(a: ReturnType<typeof numberRef>, b: ReturnType<typeof numberRef>): ReturnType<typeof numberRef> {
        return operated([a, b], () => `calc(${a.value} / ${b.value})`);
    }

    // Clamp reactive value between min and max
    static clamp(value: ReturnType<typeof numberRef>, min: ReturnType<typeof numberRef>, max: ReturnType<typeof numberRef>, unit: string = 'px'): ReturnType<typeof numberRef> {
        return operated([value, min, max], () => `clamp(${min.value}${unit}, ${value.value}${unit}, ${max.value}${unit})`);
    }

    // Min/max operations
    static min(a: ReturnType<typeof numberRef>, b: ReturnType<typeof numberRef>, unit: string = 'px'): ReturnType<typeof numberRef> {
        return operated([a, b], () => `min(${a.value}${unit}, ${b.value}${unit})`);
    }

    static max(a: ReturnType<typeof numberRef>, b: ReturnType<typeof numberRef>, unit: string = 'px'): ReturnType<typeof numberRef> {
        return operated([a, b], () => `max(${a.value}${unit}, ${b.value}${unit})`);
    }
}

// DOM Matrix Integration
export class DOMMatrixAdapter {
    // Convert reactive Matrix4D to DOMMatrix
    static toDOMMatrix(matrix: Matrix4D): DOMMatrix {
        return new DOMMatrix(matrix.elements.map(e => e.value));
    }

    // Convert DOMMatrix to reactive Matrix4D
    static fromDOMMatrix(domMatrix: DOMMatrix): Matrix4D {
        const elements = Array.from(domMatrix.toFloat32Array()).map(v => numberRef(v));
        return new Matrix4D(
            elements[0], elements[1], elements[2], elements[3],
            elements[4], elements[5], elements[6], elements[7],
            elements[8], elements[9], elements[10], elements[11],
            elements[12], elements[13], elements[14], elements[15]
        );
    }

    // Apply reactive transform to DOMMatrix
    static applyTransform(domMatrix: DOMMatrix, transform: Matrix4D): DOMMatrix {
        const reactiveMatrix = this.fromDOMMatrix(domMatrix);
        // This would need matrix multiplication - simplified for now
        return domMatrix.multiplySelf(this.toDOMMatrix(transform));
    }
}

// CSS Custom Properties Integration
export class CSSCustomProps {
    // Bind reactive value to CSS custom property
    static bindProperty(element: HTMLElement, propName: string, value: ReturnType<typeof numberRef>, unit: string = ''): () => void {
        return operated([value], () => {
            element.style.setProperty(propName, `${value.value}${unit}`);
            return () => {}; // Return cleanup function
        });
    }

    // Bind reactive Vector2D to CSS custom properties
    static bindVectorProperties(element: HTMLElement, baseName: string, vector: Vector2D, unit: string = 'px'): () => void {
        const unsubX = this.bindProperty(element, `${baseName}-x`, vector.x, unit);
        const unsubY = this.bindProperty(element, `${baseName}-y`, vector.y, unit);
        return () => { unsubX(); unsubY(); };
    }

    // Get reactive value from CSS custom property
    static getReactiveProperty(element: HTMLElement, propName: string): ReturnType<typeof numberRef> {
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
    static asPx(value: number | string | ReturnType<typeof numberRef>): string | ReturnType<typeof numberRef> {
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
    static asPercent(value: number | string | ReturnType<typeof numberRef>): string | ReturnType<typeof numberRef> {
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
    static asEm(value: number | string | ReturnType<typeof numberRef>): string | ReturnType<typeof numberRef> {
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
    static asRem(value: number | string | ReturnType<typeof numberRef>): string | ReturnType<typeof numberRef> {
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
    static asVw(value: number | string | ReturnType<typeof numberRef>): string | ReturnType<typeof numberRef> {
        if (typeof value === 'number') {
            return `${value || 0}vw`;
        }
        if (typeof value === 'string') {
            return value || '0vw';
        }
        return operated([value], (v) => `${v || 0}vw`);
    }

    static asVh(value: number | string | ReturnType<typeof numberRef>): string | ReturnType<typeof numberRef> {
        if (typeof value === 'number') {
            return `${value || 0}vh`;
        }
        if (typeof value === 'string') {
            return value || '0vh';
        }
        return operated([value], (v) => `${v || 0}vh`);
    }

    // Generic unit converter with fallback
    static asUnit(value: number | string | ReturnType<typeof numberRef>, unit: string, fallbackValue: number = 0): string | ReturnType<typeof numberRef> {
        if (typeof value === 'number') {
            return `${value || fallbackValue}${unit}`;
        }
        if (typeof value === 'string') {
            return value || `${fallbackValue}${unit}`;
        }
        return operated([value], (v) => `${v || fallbackValue}${unit}`);
    }

    // Reactive CSS calc() expressions
    static calc(expression: string): string {
        return `calc(${expression})`;
    }

    // Create reactive calc expressions
    static reactiveCalc(operands: Array<number | string | ReturnType<typeof numberRef>>, operator: string): ReturnType<typeof numberRef> {
        return operated(operands, (...values) => {
            const expression = values.join(` ${operator} `);
            return `calc(${expression})`;
        });
    }

    // Clamp reactive values with CSS clamp()
    static clamp(min: number | string | ReturnType<typeof numberRef>,
                 value: number | string | ReturnType<typeof numberRef>,
                 max: number | string | ReturnType<typeof numberRef>): ReturnType<typeof numberRef> {
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
    static max(values: Array<number | string | ReturnType<typeof numberRef>>): ReturnType<typeof numberRef> {
        return operated(values.filter(v => typeof v !== 'string'), (...nums) => {
            const cssValues = values.map(v =>
                typeof v === 'number' ? v : (typeof v === 'string' ? v : v.value)
            );
            return `max(${cssValues.join(', ')})`;
        });
    }

    static min(values: Array<number | string | ReturnType<typeof numberRef>>): ReturnType<typeof numberRef> {
        return operated(values.filter(v => typeof v !== 'string'), (...nums) => {
            const cssValues = values.map(v =>
                typeof v === 'number' ? v : (typeof v === 'string' ? v : v.value)
            );
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
    static bindSliderThumb(
        thumbElement: HTMLElement,
        value: ReturnType<typeof numberRef>,
        min: ReturnType<typeof numberRef>,
        max: ReturnType<typeof numberRef>,
        trackWidth: ReturnType<typeof numberRef>
    ): () => void {
        const position = operated([value, min, max, trackWidth], () => {
            const percentage = ((value.value - min.value) / (max.value - min.value)) * 100;
            return `translateX(${percentage}%)`;
        });

        return CSSBinder.bindTransform(thumbElement, position);
    }

    // Bind progress bar fill reactively
    static bindProgressFill(
        fillElement: HTMLElement,
        progress: ReturnType<typeof numberRef>
    ): () => void {
        const width = operated([progress], () => `${progress.value * 100}%`);
        return bindWith(fillElement, 'width', width, handleStyleChange) ?? (() => {});
    }

    // Bind checkbox/radio button state with animations
    static bindToggleState(
        element: HTMLElement,
        checked: ReturnType<typeof numberRef>
    ): () => void {
        const scale = operated([checked], () => checked.value ? 'scale(1)' : 'scale(0)');
        const opacity = operated([checked], () => checked.value ? '1' : '0');

        const unsubScale = CSSBinder.bindTransform(element, scale);
        const unsubOpacity = bindWith(element, 'opacity', opacity, handleStyleChange) ?? (() => {});

        return () => { unsubScale?.(); unsubOpacity?.(); };
    }
}

// Specialized CSS utilities for scrollbars
export class CSSScrollbarControls {
    // Bind scrollbar thumb position and size reactively
    static bindScrollbarThumb(
        thumbElement: HTMLElement,
        scrollPosition: ReturnType<typeof numberRef>,
        contentSize: ReturnType<typeof numberRef>,
        containerSize: ReturnType<typeof numberRef>,
        axis: 'horizontal' | 'vertical' = 'vertical'
    ): () => void {
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
    static bindScrollbarVisibility(
        scrollbarElement: HTMLElement,
        isVisible: ReturnType<typeof numberRef>,
        transitionDuration: number = 300
    ): () => void {
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
    static bindScrollbarTheme(
        scrollbarElement: HTMLElement,
        theme: {
            trackColor?: ReturnType<typeof numberRef>;
            thumbColor?: ReturnType<typeof numberRef>;
            borderRadius?: ReturnType<typeof numberRef>;
            thickness?: ReturnType<typeof numberRef>;
        }
    ): () => void {
        const unbinders: (() => void)[] = [];

        if (theme.trackColor) {
            unbinders.push(bindWith(scrollbarElement, '--scrollbar-track-color',
                operated([theme.trackColor], (c) => `rgba(${c.value}, ${c.value}, ${c.value}, 0.1)`), handleStyleChange) ?? (() => {}));
        }

        if (theme.thumbColor) {
            unbinders.push(bindWith(scrollbarElement, '--scrollbar-thumb-color',
                operated([theme.thumbColor], (c) => `rgba(${c.value}, ${c.value}, ${c.value}, 0.5)`), handleStyleChange) ?? (() => {}));
        }

        if (theme.borderRadius) {
            unbinders.push(bindWith(scrollbarElement, '--scrollbar-border-radius',
                operated([theme.borderRadius], (r) => `${r.value}px`), handleStyleChange) ?? (() => {}));
        }

        if (theme.thickness) {
            unbinders.push(bindWith(scrollbarElement, '--scrollbar-thickness',
                operated([theme.thickness], (t) => `${t.value}px`), handleStyleChange) ?? (() => {}));
        }

        return () => unbinders.forEach(unbind => unbind?.());
    }
}

// Enhanced momentum scrolling utilities
export class CSSMomentumScrolling {
    // Create smooth scroll animation with momentum
    static createMomentumScroll(
        element: HTMLElement,
        velocity: ReturnType<typeof numberRef>,
        deceleration: number = 0.92
    ): Promise<void> {
        return new Promise(resolve => {
            let animationId: number;
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
    static createBounceBack(
        element: HTMLElement,
        overScroll: ReturnType<typeof numberRef>,
        duration: number = 300
    ): Promise<void> {
        return new Promise(resolve => {
            const startTime = performance.now();
            const startValue = overScroll.value;

            const animate = (currentTime: number) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Ease out cubic
                const eased = 1 - Math.pow(1 - progress, 3);

                overScroll.value = startValue * (1 - eased);

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
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
    static bindFocusRing(
        element: HTMLElement,
        isFocused: ReturnType<typeof numberRef>,
        ringColor: string = 'rgba(59, 130, 246, 0.5)'
    ): () => void {
        const boxShadow = operated([isFocused], () =>
            isFocused.value ? `0 0 0 2px ${ringColor}` : 'none'
        );

        return bindWith(element, 'box-shadow', boxShadow, handleStyleChange) ?? (() => {});
    }

    // Bind hover state with smooth transitions
    static bindHoverState(
        element: HTMLElement,
        isHovered: ReturnType<typeof numberRef>,
        hoverTransform: string = 'scale(1.05)'
    ): () => void {
        const transform = operated([isHovered], () =>
            isHovered.value ? hoverTransform : 'none'
        );

        return CSSBinder.bindTransform(element, transform) ?? (() => {});
    }

    // Bind active/press state
    static bindActiveState(
        element: HTMLElement,
        isActive: ReturnType<typeof numberRef>,
        activeTransform: string = 'scale(0.95)'
    ): () => void {
        const transform = operated([isActive], () =>
            isActive.value ? activeTransform : 'none'
        );

        return CSSBinder.bindTransform(element, transform) ?? (() => {});
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
