import { numberRef, computed, subscribe } from "fest/object";
import { Vector2D, vector2Ref } from "./Point2D";
import { Vector3D } from "./Point3D";
import { Vector4D } from "./Point4D";

// Utility functions for component integration
export const vectorFromArray = (arr: ReturnType<typeof numberRef>[]): Vector2D | Vector3D | Vector4D => {
    switch (arr.length) {
        case 2: return new Vector2D(arr[0], arr[1]);
        case 3: return new Vector3D(arr[0], arr[1], arr[2]);
        case 4: return new Vector4D(arr[0], arr[1], arr[2], arr[3]);
        default: throw new Error(`Unsupported vector dimension: ${arr.length}`);
    }
};

export const vectorToArray = (vec: Vector2D | Vector3D | Vector4D): ReturnType<typeof numberRef>[] => {
    if (vec instanceof Vector2D) return [vec.x, vec.y];
    if (vec instanceof Vector3D) return [vec.x, vec.y, vec.z];
    if (vec instanceof Vector4D) return [vec.x, vec.y, vec.z, vec.w];
    throw new Error("Unsupported vector type");
};

// Transform utilities for layout components
export const translate2D = (vec: Vector2D, tx: ReturnType<typeof numberRef>, ty: ReturnType<typeof numberRef>) => {
    return addVector2D(vec, new Vector2D(tx, ty));
};

export const scale2D = (vec: Vector2D, sx: ReturnType<typeof numberRef>, sy: ReturnType<typeof numberRef> = sx) => {
    return new Vector2D(
        operated([vec.x, sx], () => vec.x.value * sx.value),
        operated([vec.y, sy], () => vec.y.value * sy.value)
    );
};

export const rotate2D = (vec: Vector2D, angle: ReturnType<typeof numberRef>) => {
    const cos = operated([angle], () => Math.cos(angle.value));
    const sin = operated([angle], () => Math.sin(angle.value));
    return new Vector2D(
        operated([vec.x, vec.y, cos, sin], () => vec.x.value * cos.value - vec.y.value * sin.value),
        operated([vec.x, vec.y, cos, sin], () => vec.x.value * sin.value + vec.y.value * cos.value)
    );
};

// Rectangle/Bounding box operations
export interface Rect2D {
    position: Vector2D; // x, y
    size: Vector2D;     // width, height
}

export const createRect2D = (x: number | ReturnType<typeof numberRef> = 0,
                            y: number | ReturnType<typeof numberRef> = 0,
                            width: number | ReturnType<typeof numberRef> = 0,
                            height: number | ReturnType<typeof numberRef> = 0): Rect2D => ({
    position: vector2Ref(x, y),
    size: vector2Ref(width, height)
});

// Rectangle center point (reactive)
export const rectCenter = (rect: Rect2D): Vector2D => {
    return addVector2D(rect.position, multiplyVector2D(rect.size, numberRef(0.5)));
};

// Point containment in rectangle (reactive)
export const rectContainsPoint = (rect: Rect2D, point: Vector2D): ReturnType<typeof numberRef> => {
    return operated([rect.position.x, rect.position.y, rect.size.x, rect.size.y, point.x, point.y], () => {
        const inX = point.x.value >= rect.position.x.value && point.x.value <= rect.position.x.value + rect.size.x.value;
        const inY = point.y.value >= rect.position.y.value && point.y.value <= rect.position.y.value + rect.size.y.value;
        return inX && inY;
    });
};

// Rectangle intersection (reactive)
export const rectIntersects = (rectA: Rect2D, rectB: Rect2D): ReturnType<typeof numberRef> => {
    return operated([
        rectA.position.x, rectA.position.y, rectA.size.x, rectA.size.y,
        rectB.position.x, rectB.position.y, rectB.size.x, rectB.size.y
    ], () => {
        const aRight = rectA.position.x.value + rectA.size.x.value;
        const aBottom = rectA.position.y.value + rectA.size.y.value;
        const bRight = rectB.position.x.value + rectB.size.x.value;
        const bBottom = rectB.position.y.value + rectB.size.y.value;

        return !(rectA.position.x.value > bRight ||
                 aRight < rectB.position.x.value ||
                 rectA.position.y.value > bBottom ||
                 aBottom < rectB.position.y.value);
    });
};

// Rectangle union (reactive)
export const rectUnion = (rectA: Rect2D, rectB: Rect2D): Rect2D => {
    const minX = operated([rectA.position.x, rectB.position.x], () => Math.min(rectA.position.x.value, rectB.position.x.value));
    const minY = operated([rectA.position.y, rectB.position.y], () => Math.min(rectA.position.y.value, rectB.position.y.value));
    const maxX = operated([rectA.position.x, rectA.size.x, rectB.position.x, rectB.size.x], () =>
        Math.max(rectA.position.x.value + rectA.size.x.value, rectB.position.x.value + rectB.size.x.value));
    const maxY = operated([rectA.position.y, rectA.size.y, rectB.position.y, rectB.size.y], () =>
        Math.max(rectA.position.y.value + rectA.size.y.value, rectB.position.y.value + rectB.size.y.value));

    return {
        position: new Vector2D(minX, minY),
        size: new Vector2D(
            operated([maxX, minX], () => maxX.value - minX.value),
            operated([maxY, minY], () => maxY.value - minY.value)
        )
    };
};

// Clamp point to rectangle bounds (reactive)
export const clampPointToRect = (point: Vector2D, rect: Rect2D): Vector2D => {
    return new Vector2D(
        operated([point.x, rect.position.x, rect.size.x], () =>
            Math.max(rect.position.x.value, Math.min(point.x.value, rect.position.x.value + rect.size.x.value))),
        operated([point.y, rect.position.y, rect.size.y], () =>
            Math.max(rect.position.y.value, Math.min(point.y.value, rect.position.y.value + rect.size.y.value)))
    );
};

// Distance from point to rectangle edge (reactive)
export const pointToRectDistance = (point: Vector2D, rect: Rect2D): ReturnType<typeof numberRef> => {
    const clamped = clampPointToRect(point, rect);
    return magnitude2D(subtractVector2D(point, clamped));
};

// Rectangle area (reactive)
export const rectArea = (rect: Rect2D): ReturnType<typeof numberRef> => {
    return operated([rect.size.x, rect.size.y], () => rect.size.x.value * rect.size.y.value);
};

// Scale rectangle around center (reactive)
export const scaleRectAroundCenter = (rect: Rect2D, scale: ReturnType<typeof numberRef>): Rect2D => {
    const center = rectCenter(rect);
    const newSize = multiplyVector2D(rect.size, scale);
    const newPosition = subtractVector2D(center, multiplyVector2D(newSize, numberRef(0.5)));

    return {
        position: newPosition,
        size: newSize
    };
};

// Transform rectangle with matrix (reactive)
export const transformRect2D = (rect: Rect2D, transform: (point: Vector2D) => Vector2D): Rect2D => {
    // Transform all four corners and create bounding box
    const corners = [
        rect.position, // top-left
        addVector2D(rect.position, new Vector2D(rect.size.x, numberRef(0))), // top-right
        addVector2D(rect.position, rect.size), // bottom-right
        addVector2D(rect.position, new Vector2D(numberRef(0), rect.size.y))  // bottom-left
    ];

    const transformedCorners = corners.map(transform);
    return rectUnion(
        { position: transformedCorners[0], size: vector2Ref(0, 0) },
        { position: transformedCorners[1], size: vector2Ref(0, 0) }
    );
};

// Relative positioning within container
export const relativePosition = (child: Vector2D, parent: Rect2D): Vector2D => {
    return new Vector2D(
        operated([child.x, parent.position.x], () => child.x.value - parent.position.x.value),
        operated([child.y, parent.position.y], () => child.y.value - parent.position.y.value)
    );
};

// Convert relative position to absolute
export const absolutePosition = (relative: Vector2D, parent: Rect2D): Vector2D => {
    return addVector2D(relative, parent.position);
};

// Aspect ratio constraint for rectangles
export const constrainRectAspectRatio = (rect: Rect2D, aspectRatio: ReturnType<typeof numberRef>, mode: 'fit' | 'fill' = 'fit'): Rect2D => {
    return operated([rect.size.x, rect.size.y, aspectRatio], () => {
        const currentRatio = rect.size.x.value / rect.size.y.value;
        const targetRatio = aspectRatio.value;

        let newWidth = rect.size.x.value;
        let newHeight = rect.size.y.value;

        if (mode === 'fit') {
            if (currentRatio > targetRatio) {
                // Too wide, constrain height
                newHeight = newWidth / targetRatio;
            } else {
                // Too tall, constrain width
                newWidth = newHeight * targetRatio;
            }
        } else { // fill
            if (currentRatio > targetRatio) {
                // Too wide, constrain width
                newWidth = newHeight * targetRatio;
            } else {
                // Too tall, constrain height
                newHeight = newWidth / targetRatio;
            }
        }

        return {
            position: rect.position,
            size: vector2Ref(newWidth, newHeight)
        };
    });
};

// ============================================================================
// Enhanced Input and UI Control Operations
// ============================================================================

// Smooth value interpolation for UI controls
export const smoothValueTransition = (
    current: ReturnType<typeof numberRef>,
    target: ReturnType<typeof numberRef>,
    smoothing: ReturnType<typeof numberRef> = numberRef(0.1)
): ReturnType<typeof numberRef> => {
    return operated([current, target, smoothing], () => {
        const diff = target.value - current.value;
        return current.value + diff * smoothing.value;
    });
};

// Calculate thumb position for slider/range controls
export const sliderThumbPosition = (
    value: ReturnType<typeof numberRef>,
    min: ReturnType<typeof numberRef>,
    max: ReturnType<typeof numberRef>,
    trackSize: ReturnType<typeof numberRef>
): ReturnType<typeof numberRef> => {
    return operated([value, min, max, trackSize], () => {
        const normalizedValue = (value.value - min.value) / (max.value - min.value);
        return normalizedValue * trackSize.value;
    });
};

// Calculate scrollbar thumb size and position
export const scrollbarMetrics = (
    contentSize: ReturnType<typeof numberRef>,
    containerSize: ReturnType<typeof numberRef>,
    scrollPosition: ReturnType<typeof numberRef>
) => {
    const thumbSize = operated([contentSize, containerSize], () => {
        const ratio = containerSize.value / contentSize.value;
        return Math.max(20, ratio * containerSize.value); // Minimum 20px
    });

    const thumbPosition = operated([scrollPosition, contentSize, containerSize, thumbSize], () => {
        const maxScroll = contentSize.value - containerSize.value;
        const scrollRatio = maxScroll > 0 ? scrollPosition.value / maxScroll : 0;
        return scrollRatio * (containerSize.value - thumbSize.value);
    });

    return { thumbSize, thumbPosition };
};

// Convert screen coordinates to normalized control values
export const screenToControlValue = (
    screenPos: ReturnType<typeof numberRef>,
    controlRect: Rect2D,
    axis: 'x' | 'y' = 'x'
): ReturnType<typeof numberRef> => {
    const controlStart = axis === 'x' ? controlRect.position.x : controlRect.position.y;
    const controlSize = axis === 'x' ? controlRect.size.x : controlRect.size.y;

    return operated([screenPos, controlStart, controlSize], () => {
        const relativePos = screenPos.value - controlStart.value;
        return Math.max(0, Math.min(1, relativePos / controlSize.value));
    });
};

// Enhanced easing functions for UI animations
export const easeInOutCubic = (t: ReturnType<typeof numberRef>): ReturnType<typeof numberRef> => {
    return operated([t], () => {
        const x = t.value;
        return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    });
};

export const easeOutBounce = (t: ReturnType<typeof numberRef>): ReturnType<typeof numberRef> => {
    return operated([t], () => {
        let x = t.value;
        const n1 = 7.5625;
        const d1 = 2.75;

        if (x < 1 / d1) {
            return n1 * x * x;
        } else if (x < 2 / d1) {
            x -= 1.5 / d1;
            return n1 * x * x + 0.75;
        } else if (x < 2.5 / d1) {
            x -= 2.25 / d1;
            return n1 * x * x + 0.9375;
        } else {
            x -= 2.625 / d1;
            return n1 * x * x + 0.984375;
        }
    });
};

// Momentum-based scrolling calculations
export const momentumScroll = (
    velocity: ReturnType<typeof numberRef>,
    deceleration: ReturnType<typeof numberRef> = numberRef(0.95),
    minVelocity: ReturnType<typeof numberRef> = numberRef(0.01)
): ReturnType<typeof numberRef> => {
    return operated([velocity, deceleration, minVelocity], () => {
        const newVelocity = velocity.value * deceleration.value;
        return Math.abs(newVelocity) < minVelocity.value ? 0 : newVelocity;
    });
};

// Calculate scroll bounds with bounce effects
export const scrollBoundsWithBounce = (
    scrollPosition: ReturnType<typeof numberRef>,
    contentSize: ReturnType<typeof numberRef>,
    containerSize: ReturnType<typeof numberRef>,
    bounceDistance: ReturnType<typeof numberRef> = numberRef(50)
): ReturnType<typeof numberRef> => {
    return operated([scrollPosition, contentSize, containerSize, bounceDistance], () => {
        const maxScroll = contentSize.value - containerSize.value;

        if (scrollPosition.value < 0) {
            // Bouncing at start
            const bounce = Math.min(bounceDistance.value, Math.abs(scrollPosition.value));
            return -bounce * 0.3; // Reduce bounce effect
        } else if (scrollPosition.value > maxScroll) {
            // Bouncing at end
            const overScroll = scrollPosition.value - maxScroll;
            const bounce = Math.min(bounceDistance.value, overScroll);
            return maxScroll + bounce * 0.3;
        }

        return scrollPosition.value;
    });
};

//
const flattenRefs = (input: any): ReturnType<typeof numberRef>[] => {
    const refs: ReturnType<typeof numberRef>[] = [];

    const traverse = (item: any) => {
        if (item && typeof item === 'object' && 'value' in item) {
            // It's a reactive reference
            refs.push(item);
        } else if (Array.isArray(item)) {
            // It's an array, traverse each element
            item.forEach(traverse);
        } else if (item && typeof item === 'object') {
            // It's an object, traverse its properties
            Object.values(item).forEach(traverse);
        }
    };

    traverse(input);
    return refs;
};

//
export const operated = (args: any[], fn: (...values: any[]) => any) => {
    // Get initial values for the function
    const getCurrentValues = () => args.map(arg => {
        if (arg && typeof arg === 'object' && 'value' in arg) {
            return arg.value;
        }
        return arg;
    });

    const initialResult = fn(...getCurrentValues());

    // If the result is a number, return a reactive number reference
    if (typeof initialResult === 'number') {
        const result = numberRef(initialResult);

        const updateResult = () => {
            result.value = fn(...getCurrentValues());
        };

        // Flatten all reactive references from the arguments
        const allRefs = flattenRefs(args);

        // Subscribe to each reactive reference to update the result
        allRefs.forEach(ref => subscribe(ref, updateResult));

        return result;
    }

    // For non-number results (vectors, matrices, etc.), return the computed result
    // The caller is responsible for ensuring the result has the right reactive structure
    let currentResult = initialResult;

    const updateResult = () => {
        currentResult = fn(...getCurrentValues());
    };

    // Flatten all reactive references from the arguments
    const allRefs = flattenRefs(args);

    // Subscribe to each reactive reference to update the result
    allRefs.forEach(ref => subscribe(ref, updateResult));

    return currentResult;
}




// Scalar operations (1D)
export const addRef = (a: ReturnType<typeof numberRef>, b: ReturnType<typeof numberRef>) => {
    return operated([a, b], () => a.value + b.value);
}

export const subtractRef = (a: ReturnType<typeof numberRef>, b: ReturnType<typeof numberRef>) => {
    return operated([a, b], () => a.value - b.value);
}

export const multiplyRef = (a: ReturnType<typeof numberRef>, b: ReturnType<typeof numberRef>) => {
    return operated([a, b], () => a.value * b.value);
}

export const divideRef = (a: ReturnType<typeof numberRef>, b: ReturnType<typeof numberRef>) => {
    return operated([a, b], () => a.value / b.value);
}

export const modulusRef = (a: ReturnType<typeof numberRef>, b: ReturnType<typeof numberRef>) => {
    return operated([a, b], () => a.value % b.value);
}

export const powerRef = (a: ReturnType<typeof numberRef>, b: ReturnType<typeof numberRef>) => {
    return operated([a, b], () => Math.pow(a.value, b.value));
}

// Trigonometric functions
export const sinRef = (a: ReturnType<typeof numberRef>) => {
    return operated(a, () => Math.sin(a.value));
}

export const cosRef = (a: ReturnType<typeof numberRef>) => {
    return operated(a, () => Math.cos(a.value));
}

export const tanRef = (a: ReturnType<typeof numberRef>) => {
    return operated(a, () => Math.tan(a.value));
}

export const asinRef = (a: ReturnType<typeof numberRef>) => {
    return operated(a, () => Math.asin(a.value));
}

export const acosRef = (a: ReturnType<typeof numberRef>) => {
    return operated(a, () => Math.acos(a.value));
}

export const atanRef = (a: ReturnType<typeof numberRef>) => {
    return operated(a, () => Math.atan(a.value));
}

export const atan2Ref = (a: ReturnType<typeof numberRef>, b: ReturnType<typeof numberRef>) => {
    return operated([a, b], () => Math.atan2(a.value, b.value));
}

export const hypotRef = (a: ReturnType<typeof numberRef>, b: ReturnType<typeof numberRef>) => {
    return operated([a, b], () => Math.hypot(a.value, b.value));
}

// Other math functions
export const squareRootRef = (a: ReturnType<typeof numberRef>) => {
    return operated(a, () => Math.sqrt(a.value));
}

export const cubeRootRef = (a: ReturnType<typeof numberRef>) => {
    return operated(a, () => Math.cbrt(a.value));
}

export const absoluteRef = (a: ReturnType<typeof numberRef>) => {
    return operated(a, () => Math.abs(a.value));
}

export const signRef = (a: ReturnType<typeof numberRef>) => {
    return operated(a, () => Math.sign(a.value));
}

export const clampRef = (a: ReturnType<typeof numberRef>, min: ReturnType<typeof numberRef>, max: ReturnType<typeof numberRef>) => {
    return operated([a, min, max], () => Math.min(Math.max(a.value, min.value), max.value));
}

// Vector operations (2D)
export const addVector2D = (a: Vector2D, b: Vector2D) => {
    return new Vector2D(
        operated([a.x, b.x], () => a.x.value + b.x.value),
        operated([a.y, b.y], () => a.y.value + b.y.value)
    );
}

export const subtractVector2D = (a: Vector2D, b: Vector2D) => {
    return new Vector2D(
        operated([a.x, b.x], () => a.x.value - b.x.value),
        operated([a.y, b.y], () => a.y.value - b.y.value)
    );
}

export const multiplyVector2D = (a: Vector2D, scalar: ReturnType<typeof numberRef>) => {
    return new Vector2D(
        operated([a.x, scalar], () => a.x.value * scalar.value),
        operated([a.y, scalar], () => a.y.value * scalar.value)
    );
}

export const divideVector2D = (a: Vector2D, scalar: ReturnType<typeof numberRef>) => {
    return new Vector2D(
        operated([a.x, scalar], () => a.x.value / scalar.value),
        operated([a.y, scalar], () => a.y.value / scalar.value)
    );
}

export const dotProduct2D = (a: Vector2D, b: Vector2D) => {
    return operated([a.x, a.y, b.x, b.y], () => a.x.value * b.x.value + a.y.value * b.y.value);
}

export const magnitude2D = (a: Vector2D) => {
    return operated([a.x, a.y], () => Math.sqrt(a.x.value * a.x.value + a.y.value * a.y.value));
}

export const normalize2D = (a: Vector2D) => {
    const mag = magnitude2D(a);
    return new Vector2D(
        operated([a.x, mag], () => a.x.value / mag.value),
        operated([a.y, mag], () => a.y.value / mag.value)
    );
}

// Vector operations (3D)
export const addVector3D = (a: Vector3D, b: Vector3D) => {
    return new Vector3D(
        operated([a.x, b.x], () => a.x.value + b.x.value),
        operated([a.y, b.y], () => a.y.value + b.y.value),
        operated([a.z, b.z], () => a.z.value + b.z.value)
    );
}

export const subtractVector3D = (a: Vector3D, b: Vector3D) => {
    return new Vector3D(
        operated([a.x, b.x], () => a.x.value - b.x.value),
        operated([a.y, b.y], () => a.y.value - b.y.value),
        operated([a.z, b.z], () => a.z.value - b.z.value)
    );
}

export const multiplyVector3D = (a: Vector3D, scalar: ReturnType<typeof numberRef>) => {
    return new Vector3D(
        operated([a.x, scalar], () => a.x.value * scalar.value),
        operated([a.y, scalar], () => a.y.value * scalar.value),
        operated([a.z, scalar], () => a.z.value * scalar.value)
    );
}

export const divideVector3D = (a: Vector3D, scalar: ReturnType<typeof numberRef>) => {
    return new Vector3D(
        operated([a.x, scalar], () => a.x.value / scalar.value),
        operated([a.y, scalar], () => a.y.value / scalar.value),
        operated([a.z, scalar], () => a.z.value / scalar.value)
    );
}

export const dotProduct3D = (a: Vector3D, b: Vector3D) => {
    return operated([a.x, a.y, a.z, b.x, b.y, b.z], () =>
        a.x.value * b.x.value + a.y.value * b.y.value + a.z.value * b.z.value
    );
}

export const crossProduct3D = (a: Vector3D, b: Vector3D) => {
    return new Vector3D(
        operated([a.y, a.z, b.y, b.z], () => a.y.value * b.z.value - a.z.value * b.y.value),
        operated([a.z, a.x, b.z, b.x], () => a.z.value * b.x.value - a.x.value * b.z.value),
        operated([a.x, a.y, b.x, b.y], () => a.x.value * b.y.value - a.y.value * b.x.value)
    );
}

export const magnitude3D = (a: Vector3D) => {
    return operated([a.x, a.y, a.z], () =>
        Math.sqrt(a.x.value * a.x.value + a.y.value * a.y.value + a.z.value * a.z.value)
    );
}

export const normalize3D = (a: Vector3D) => {
    const mag = magnitude3D(a);
    return new Vector3D(
        operated([a.x, mag], () => a.x.value / mag.value),
        operated([a.y, mag], () => a.y.value / mag.value),
        operated([a.z, mag], () => a.z.value / mag.value)
    );
}

// Vector operations (4D)
export const addVector4D = (a: Vector4D, b: Vector4D) => {
    return new Vector4D(
        operated([a.x, b.x], () => a.x.value + b.x.value),
        operated([a.y, b.y], () => a.y.value + b.y.value),
        operated([a.z, b.z], () => a.z.value + b.z.value),
        operated([a.w, b.w], () => a.w.value + b.w.value)
    );
}

export const subtractVector4D = (a: Vector4D, b: Vector4D) => {
    return new Vector4D(
        operated([a.x, b.x], () => a.x.value - b.x.value),
        operated([a.y, b.y], () => a.y.value - b.y.value),
        operated([a.z, b.z], () => a.z.value - b.z.value),
        operated([a.w, b.w], () => a.w.value - b.w.value)
    );
}

export const multiplyVector4D = (a: Vector4D, scalar: ReturnType<typeof numberRef>) => {
    return new Vector4D(
        operated([a.x, scalar], () => a.x.value * scalar.value),
        operated([a.y, scalar], () => a.y.value * scalar.value),
        operated([a.z, scalar], () => a.z.value * scalar.value),
        operated([a.w, scalar], () => a.w.value * scalar.value)
    );
}

export const divideVector4D = (a: Vector4D, scalar: ReturnType<typeof numberRef>) => {
    return new Vector4D(
        operated([a.x, scalar], () => a.x.value / scalar.value),
        operated([a.y, scalar], () => a.y.value / scalar.value),
        operated([a.z, scalar], () => a.z.value / scalar.value),
        operated([a.w, scalar], () => a.w.value / scalar.value)
    );
}

export const dotProduct4D = (a: Vector4D, b: Vector4D) => {
    return operated([a.x, a.y, a.z, a.w, b.x, b.y, b.z, b.w], () =>
        a.x.value * b.x.value + a.y.value * b.y.value + a.z.value * b.z.value + a.w.value * b.w.value
    );
}

export const magnitude4D = (a: Vector4D) => {
    return operated([a.x, a.y, a.z, a.w], () =>
        Math.sqrt(a.x.value * a.x.value + a.y.value * a.y.value + a.z.value * a.z.value + a.w.value * a.w.value)
    );
}

export const normalize4D = (a: Vector4D) => {
    const mag = magnitude4D(a);
    return new Vector4D(
        operated([a.x, mag], () => a.x.value / mag.value),
        operated([a.y, mag], () => a.y.value / mag.value),
        operated([a.z, mag], () => a.z.value / mag.value),
        operated([a.w, mag], () => a.w.value / mag.value)
    );
}
