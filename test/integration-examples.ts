// Integration examples showing how reactive math enhances existing components

import { numberRef, affected, computed } from "fest/object";
import {
    Vector2D, vector2Ref,
    addVector2D, subtractVector2D, multiplyVector2D, magnitude2D, divideVector2D,
    translate2D, scale2D, rotate2D,
    vectorFromArray, vectorToArray,
    operated,
    Rect2D, createRect2D, rectCenter, rectContainsPoint, rectIntersects, rectArea,
    clampPointToRect, pointToRectDistance, constrainRectAspectRatio,
    GridCoordUtils, GridCellUtils, GridLayoutUtils, GridAnimationUtils, GridInteractionUtils,
    GridCoord, GridCell, GridConfig
} from "../src/math/index";
import { ReactiveElementSize } from "../src/extension/css-ref/Utils";

/**
 * Example 1: Enhanced Draggable with reactive vector math
 * Improves upon the existing DragHandler in controllers/Draggable.ts
 */
export class ReactiveDraggable {
    private position: Vector2D;
    private velocity: Vector2D;
    private acceleration: Vector2D;

    constructor(initialX = 0, initialY = 0) {
        this.position = vector2Ref(initialX, initialY);
        this.velocity = vector2Ref(0, 0);
        this.acceleration = vector2Ref(0, 0);
    }

    // Physics-based movement with reactive math
    update(deltaTime: number) {
        // velocity += acceleration * deltaTime
        const deltaVel = multiplyVector2D(this.acceleration, numberRef(deltaTime));
        this.velocity = addVector2D(this.velocity, deltaVel);

        // position += velocity * deltaTime
        const deltaPos = multiplyVector2D(this.velocity, numberRef(deltaTime));
        this.position = addVector2D(this.position, deltaPos);
    }

    // Apply forces reactively
    applyForce(force: Vector2D) {
        this.acceleration = addVector2D(this.acceleration, force);
    }

    // Get current position as array (compatible with existing DOM APIs)
    getPosition() {
        return [this.position.x.value, this.position.y.value];
    }
}

/**
 * Example 2: Enhanced BBoxAnchor with reactive vector operations
 * Improves upon extension/space-ref/BBoxAnchor.ts
 */
export class ReactiveBoundingBox {
    private topLeft: Vector2D;
    private size: Vector2D;
    private center: Vector2D;
    private corners: Vector2D[];

    constructor(element: HTMLElement) {
        // Create reactive vectors from element bounds
        this.topLeft = vector2Ref(0, 0);
        this.size = vector2Ref(0, 0);

        // Computed reactive center point
        this.center = addVector2D(
            this.topLeft,
            multiplyVector2D(this.size, numberRef(0.5))
        );

        // Computed reactive corners
        this.corners = [
            this.topLeft, // top-left
            addVector2D(this.topLeft, new Vector2D(this.size.x, numberRef(0))), // top-right
            addVector2D(this.topLeft, this.size), // bottom-right
            addVector2D(this.topLeft, new Vector2D(numberRef(0), this.size.y))  // bottom-left
        ];

        this.updateBounds(element);
    }

    updateBounds(element: HTMLElement) {
        const rect = element.getBoundingClientRect();
        this.topLeft.x.value = rect.left;
        this.topLeft.y.value = rect.top;
        this.size.x.value = rect.width;
        this.size.y.value = rect.height;
    }

    // Reactive collision detection
    contains(point: Vector2D) {
        const inX = operated([point.x, this.topLeft.x, this.size.x], () =>
            point.x.value >= this.topLeft.x.value &&
            point.x.value <= this.topLeft.x.value + this.size.x.value
        );
        const inY = operated([point.y, this.topLeft.y, this.size.y], () =>
            point.y.value >= this.topLeft.y.value &&
            point.y.value <= this.topLeft.y.value + this.size.y.value
        );
        return operated([inX, inY], () => inX.value && inY.value);
    }

    // Get bounds as array (compatible with existing APIs)
    getBounds() {
        return [
            this.topLeft.x.value, this.topLeft.y.value, // x, y
            this.size.x.value, this.size.y.value        // width, height
        ];
    }
}

/**
 * Example 3: Enhanced Grid Layout with matrix transformations
 * Improves upon layout/grid/Interact.ts
 */
export class ReactiveGridTransform {
    private position: Vector2D;
    private scale: Vector2D;
    private rotation: ReturnType<typeof numberRef>;

    constructor() {
        this.position = vector2Ref(0, 0);
        this.scale = vector2Ref(1, 1);
        this.rotation = numberRef(0);
    }

    // Apply transformation matrix to a point
    transformPoint(point: Vector2D): Vector2D {
        // Scale -> Rotate -> Translate
        let result = scale2D(point, this.scale.x, this.scale.y);
        result = rotate2D(result, this.rotation);
        result = translate2D(result, this.position.x, this.position.y);
        return result;
    }

    // Convert grid coordinates to screen coordinates
    gridToScreen(gridX: number, gridY: number, cellSize: number): Vector2D {
        const gridPoint = vector2Ref(gridX * cellSize, gridY * cellSize);
        return this.transformPoint(gridPoint);
    }

    // Convert screen coordinates to grid coordinates
    screenToGrid(screenX: number, screenY: number, cellSize: number): Vector2D {
        // Inverse transformation: Translate -> Rotate -> Scale
        const screenPoint = vector2Ref(screenX, screenY);
        let result = translate2D(screenPoint, operated([this.position.x], () => -this.position.x.value),
                                              operated([this.position.y], () => -this.position.y.value));
        result = rotate2D(result, operated([this.rotation], () => -this.rotation.value));
        result = scale2D(result, operated([this.scale.x], () => 1/this.scale.x.value),
                               operated([this.scale.y], () => 1/this.scale.y.value));
        return new Vector2D(
            operated([result.x], () => result.x.value / cellSize),
            operated([result.y], () => result.y.value / cellSize)
        );
    }
}

/**
 * Example 4: Enhanced Pointer API with reactive vectors
 * Improves upon extension/controllers/PointerAPI.ts
 */
export class ReactivePointer {
    private position: Vector2D;
    private delta: Vector2D;
    private velocity: Vector2D;

    constructor() {
        this.position = vector2Ref(0, 0);
        this.delta = vector2Ref(0, 0);
        this.velocity = vector2Ref(0, 0);
    }

    updatePosition(clientX: number, clientY: number, deltaTime: number = 1) {
        const newPosition = vector2Ref(clientX, clientY);

        // Calculate delta movement
        this.delta = subtractVector2D(newPosition, this.position);

        // Calculate velocity (delta / time)
        this.velocity = multiplyVector2D(this.delta, numberRef(1 / deltaTime));

        // Update position
        this.position = newPosition;
    }

    // Get distance from another point
    distanceTo(other: Vector2D) {
        const diff = subtractVector2D(this.position, other);
        return magnitude2D(diff);
    }

    // Check if pointer is within a reactive bounding box
    isWithin(bounds: ReactiveBoundingBox) {
        return bounds.contains(this.position);
    }

    // Get position as array for DOM APIs
    getPosition() {
        return [this.position.x.value, this.position.y.value];
    }
}

/**
 * Enhanced Pointer API with reactive vectors
 * Improves upon extension/controllers/PointerAPI.ts
 */
export class ReactivePointerAPI {
    private pointers: Map<number, ReactivePointer> = new Map();

    // Enhanced coordinate conversion with reactive math
    static clientToOrient(clientX: number, clientY: number, element: HTMLElement): Vector2D {
        const rect = element.getBoundingClientRect();
        const elementSize = vector2Ref(rect.width, rect.height);

        // Convert client coordinates to element-relative coordinates
        const relativeX = operated([numberRef(clientX), numberRef(rect.left)], (cx, left) => cx.value - left.value);
        const relativeY = operated([numberRef(clientY), numberRef(rect.top)], (cy, top) => cy.value - top.value);

        // Normalize to 0-1 range
        const normalizedX = operated([relativeX, numberRef(rect.width)], (rx, w) => rx.value / w.value);
        const normalizedY = operated([relativeY, numberRef(rect.height)], (ry, h) => ry.value / h.value);

        return new Vector2D(normalizedX, normalizedY);
    }

    // Enhanced movement tracking
    trackPointer(pointerId: number, clientX: number, clientY: number): ReactivePointer {
        let pointer = this.pointers.get(pointerId);
        if (!pointer) {
            pointer = new ReactivePointer();
            this.pointers.set(pointerId, pointer);
        }

        pointer.updatePosition(clientX, clientY, 1/60); // 60fps
        return pointer;
    }

    // Reactive collision detection between pointers and elements
    isPointerOverElement(pointerId: number, element: HTMLElement): ReturnType<typeof numberRef> {
        const pointer = this.pointers.get(pointerId);
        if (!pointer) return numberRef(0);

        const bbox = new ReactiveBoundingBox(element);
        const pointerPos = vector2Ref(...pointer.getPosition());
        return bbox.contains(pointerPos);
    }

    // Multi-pointer gesture recognition
    getPinchDistance(pointerId1: number, pointerId2: number): ReturnType<typeof numberRef> {
        const p1 = this.pointers.get(pointerId1);
        const p2 = this.pointers.get(pointerId2);

        if (!p1 || !p2) return numberRef(0);

        const pos1 = vector2Ref(...p1.getPosition());
        const pos2 = vector2Ref(...p2.getPosition());
        return magnitude2D(subtractVector2D(pos1, pos2));
    }
}

/**
 * Enhanced Draggable with physics and reactive math
 * Improves upon extension/controllers/Draggable.ts
 */
export class ReactiveDraggableEnhanced {
    private holder: HTMLElement;
    private reactivePosition: Vector2D;
    private velocity: Vector2D;
    private acceleration: Vector2D;
    private friction: ReturnType<typeof numberRef>;
    private spring: { stiffness: ReturnType<typeof numberRef>, damping: ReturnType<typeof numberRef> };
    private dragHandler: any; // Would be DragHandler instance

    constructor(holder: HTMLElement, options: {
        friction?: number;
        spring?: { stiffness: number; damping: number };
    } = {}) {
        this.holder = holder;

        // Initialize reactive vectors
        this.reactivePosition = vector2Ref(0, 0);
        this.velocity = vector2Ref(0, 0);
        this.acceleration = vector2Ref(0, 0);

        // Physics parameters
        this.friction = numberRef(options.friction || 0.95);
        this.spring = {
            stiffness: numberRef(options.spring?.stiffness || 0.1),
            damping: numberRef(options.spring?.damping || 0.8)
        };
    }

    // Physics-based updates
    updatePhysics(deltaTime: number = 1/60) {
        // Apply friction to velocity
        this.velocity = multiplyVector2D(this.velocity, this.friction);

        // Update position based on velocity
        const deltaPos = multiplyVector2D(this.velocity, numberRef(deltaTime));
        this.reactivePosition = addVector2D(this.reactivePosition, deltaPos);

        // Apply spring forces if near target
        this.applySpringForces();
    }

    private applySpringForces() {
        // Spring back to origin when released
        const springForce = multiplyVector2D(this.reactivePosition, operated([this.spring.stiffness], (s) => -s.value));
        const dampingForce = multiplyVector2D(this.velocity, operated([this.spring.damping], (d) => -d.value));

        this.acceleration = addVector2D(springForce, dampingForce);
        this.velocity = addVector2D(this.velocity, multiplyVector2D(this.acceleration, numberRef(1/60)));
    }

    // Apply external forces (like mouse drag)
    applyForce(force: Vector2D) {
        this.velocity = addVector2D(this.velocity, force);
    }

    // Get current position for DOM updates
    getPositionForDOM() {
        return [this.reactivePosition.x.value, this.reactivePosition.y.value];
    }

    // Check if movement has settled
    isAtRest(threshold: number = 0.1): boolean {
        const speed = magnitude2D(this.velocity).value;
        const distance = magnitude2D(this.reactivePosition).value;
        return speed < threshold && distance < threshold;
    }

    // Enhanced drag end with physics settling
    enhancedDragEnd() {
        // Start physics-based settling animation
        const animate = () => {
            this.updatePhysics();
            const [x, y] = this.getPositionForDOM();

            // Update DOM element
            this.holder.style.transform = `translate3d(${x}px, ${y}px, 0px)`;

            if (!this.isAtRest()) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }
}

/**
 * Enhanced Resizable with reactive constraints
 * Improves upon extension/controllers/Resizable.ts
 */
export class ReactiveResizableEnhanced {
    private holder: HTMLElement;
    private reactiveSize: Vector2D;
    private minSize: Vector2D;
    private maxSize: Vector2D;
    private aspectRatio: ReturnType<typeof numberRef> | null;

    constructor(holder: HTMLElement, options: {
        minSize?: [number, number];
        maxSize?: [number, number];
        aspectRatio?: number;
    } = {}) {
        this.holder = holder;

        // Initialize reactive vectors
        this.reactiveSize = vector2Ref(
            holder.offsetWidth,
            holder.offsetHeight
        );

        this.minSize = vector2Ref(
            options.minSize?.[0] || 50,
            options.minSize?.[1] || 50
        );

        this.maxSize = vector2Ref(
            options.maxSize?.[0] || window.innerWidth,
            options.maxSize?.[1] || window.innerHeight
        );

        this.aspectRatio = options.aspectRatio ? numberRef(options.aspectRatio) : null;
    }

    // Set size with reactive constraints
    setSize(width: number, height: number) {
        let newWidth = operated([numberRef(width), this.minSize.x, this.maxSize.x], (w, min, max) =>
            Math.max(min.value, Math.min(max.value, w.value))
        );

        let newHeight = operated([numberRef(height), this.minSize.y, this.maxSize.y], (h, min, max) =>
            Math.max(min.value, Math.min(max.value, h.value))
        );

        // Apply aspect ratio constraint if set
        if (this.aspectRatio) {
            const currentRatio = operated([newWidth, newHeight], (w, h) => w.value / h.value);
            const targetRatio = this.aspectRatio;

            operated([currentRatio, targetRatio], (current, target) => {
                if (Math.abs(current.value - target.value) > 0.01) {
                    // Adjust height to match aspect ratio
                    newHeight = operated([newWidth, targetRatio], (w, ratio) => w.value / ratio.value);
                }
            });
        }

        this.reactiveSize.x.value = newWidth.value;
        this.reactiveSize.y.value = newHeight.value;

        // Update DOM element
        this.holder.style.width = `${newWidth.value}px`;
        this.holder.style.height = `${newHeight.value}px`;
    }

    // Resize with constraints applied
    resizeBy(deltaWidth: number, deltaHeight: number) {
        const newWidth = operated([this.reactiveSize.x, numberRef(deltaWidth)], (w, dw) => w.value + dw.value);
        const newHeight = operated([this.reactiveSize.y, numberRef(deltaHeight)], (h, dh) => h.value + dh.value);

        this.setSize(newWidth.value, newHeight.value);
    }

    // Get constrained size for DOM updates
    getConstrainedSize() {
        return [this.reactiveSize.x.value, this.reactiveSize.y.value];
    }

    // Check if size is at minimum/maximum bounds
    isAtMinSize(): boolean {
        return this.reactiveSize.x.value <= this.minSize.x.value ||
               this.reactiveSize.y.value <= this.minSize.y.value;
    }

    isAtMaxSize(): boolean {
        return this.reactiveSize.x.value >= this.maxSize.x.value ||
               this.reactiveSize.y.value >= this.maxSize.y.value;
    }
}

/**
 * Enhanced Grid System with reactive transformations
 * Improves upon layout/grid/Interact.ts
 */
export class ReactiveGridSystem {
    private cellSize: Vector2D;
    private gridOffset: Vector2D;
    private zoom: ReturnType<typeof numberRef>;
    private pan: Vector2D;

    constructor(cellSize: [number, number] = [32, 32]) {
        this.cellSize = vector2Ref(cellSize[0], cellSize[1]);
        this.gridOffset = vector2Ref(0, 0);
        this.zoom = numberRef(1);
        this.pan = vector2Ref(0, 0);
    }

    // Convert grid coordinates to screen coordinates with zoom and pan
    gridToScreen(gridX: number, gridY: number): Vector2D {
        const gridPos = vector2Ref(gridX, gridY);

        // Scale by cell size
        const scaled = multiplyVector2D(gridPos, this.cellSize);

        // Apply zoom
        const zoomed = multiplyVector2D(scaled, this.zoom);

        // Apply pan offset
        const panned = addVector2D(zoomed, this.pan);

        // Add grid offset
        return addVector2D(panned, this.gridOffset);
    }

    // Convert screen coordinates to grid coordinates
    screenToGrid(screenX: number, screenY: number): Vector2D {
        const screenPos = vector2Ref(screenX, screenY);

        // Remove pan and offset
        const unpanned = subtractVector2D(screenPos, this.pan);
        const unoffset = subtractVector2D(unpanned, this.gridOffset);

        // Remove zoom
        const unzoomed = divideVector2D(unoffset, this.zoom);

        // Convert to grid units
        return divideVector2D(unzoomed, this.cellSize);
    }

    // Snap position to nearest grid point
    snapToGrid(position: Vector2D): Vector2D {
        const gridCoords = this.screenToGrid(position.x.value, position.y.value);
        return this.gridToScreen(
            Math.round(gridCoords.x.value),
            Math.round(gridCoords.y.value)
        );
    }

    // Get grid line positions for rendering
    getGridLines(viewportSize: [number, number]): { horizontal: number[], vertical: number[] } {
        const [width, height] = viewportSize;

        // Calculate visible grid range
        const topLeft = this.screenToGrid(-this.pan.x.value, -this.pan.y.value);
        const bottomRight = this.screenToGrid(width - this.pan.x.value, height - this.pan.y.value);

        const horizontal: number[] = [];
        const vertical: number[] = [];

        // Generate horizontal lines
        for (let y = Math.floor(topLeft.y.value); y <= Math.ceil(bottomRight.y.value); y++) {
            const screenY = this.gridToScreen(0, y).y.value;
            horizontal.push(screenY);
        }

        // Generate vertical lines
        for (let x = Math.floor(topLeft.x.value); x <= Math.ceil(bottomRight.x.value); x++) {
            const screenX = this.gridToScreen(x, 0).x.value;
            vertical.push(screenX);
        }

        return { horizontal, vertical };
    }

    // Animate zoom with smooth interpolation
    animateZoom(targetZoom: number, duration: number = 300) {
        const startZoom = this.zoom.value;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-out cubic)
            const eased = 1 - Math.pow(1 - progress, 3);

            this.zoom.value = startZoom + (targetZoom - startZoom) * eased;

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    // Pan the grid smoothly
    panBy(deltaX: number, deltaY: number) {
        this.pan.x.value += deltaX;
        this.pan.y.value += deltaY;
    }

    // Center the grid on a specific point
    centerOn(point: Vector2D) {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        this.pan.x.value = centerX - point.x.value;
        this.pan.y.value = centerY - point.y.value;
    }
}

/**
 * Enhanced Orientation System with reactive transformations
 * Improves upon layout/orient/OrientBox.ts
 */
export class ReactiveOrientSystem {
    private position: Vector2D;
    private scale: Vector2D;
    private rotation: ReturnType<typeof numberRef>;
    private skew: Vector2D;

    constructor() {
        this.position = vector2Ref(0, 0);
        this.scale = vector2Ref(1, 1);
        this.rotation = numberRef(0);
        this.skew = vector2Ref(0, 0);
    }

    // Generate CSS transform string reactively
    getTransformString(): ReturnType<typeof numberRef> {
        return operated(
            [this.position.x, this.position.y, this.scale.x, this.scale.y, this.rotation, this.skew.x, this.skew.y],
            (x, y, sx, sy, rot, skx, sky) =>
                `translate3d(${x.value}px, ${y.value}px, 0px) ` +
                `scale(${sx.value}, ${sy.value}) ` +
                `rotate(${rot.value}deg) ` +
                `skew(${skx.value}deg, ${sky.value}deg)`
        );
    }

    // Apply transformation to a point
    transformPoint(point: Vector2D): Vector2D {
        // Apply scale
        let result = multiplyVector2D(point, this.scale);

        // Apply rotation
        result = rotate2D(result, this.rotation);

        // Apply translation
        result = addVector2D(result, this.position);

        return result;
    }

    // Get inverse transformation for converting screen to local coordinates
    inverseTransformPoint(point: Vector2D): Vector2D {
        // Inverse translate
        let result = subtractVector2D(point, this.position);

        // Inverse rotate
        result = rotate2D(result, operated([this.rotation], (r) => -r.value));

        // Inverse scale
        result = divideVector2D(result, this.scale);

        return result;
    }

    // Interpolate between two transformation states
    interpolateTo(target: ReactiveOrientSystem, progress: number) {
        const newSystem = new ReactiveOrientSystem();

        newSystem.position = addVector2D(
            multiplyVector2D(this.position, operated([numberRef(1), numberRef(progress)], (a, p) => a.value - p.value)),
            multiplyVector2D(target.position, numberRef(progress))
        );

        newSystem.scale = addVector2D(
            multiplyVector2D(this.scale, operated([numberRef(1), numberRef(progress)], (a, p) => a.value - p.value)),
            multiplyVector2D(target.scale, numberRef(progress))
        );

        newSystem.rotation = operated(
            [this.rotation, target.rotation, numberRef(progress)],
            (current, target, p) => current.value + (target.value - current.value) * p.value
        );

        return newSystem;
    }

    // Check if transformation is identity (no transformation applied)
    isIdentity(): boolean {
        return this.position.x.value === 0 && this.position.y.value === 0 &&
               this.scale.x.value === 1 && this.scale.y.value === 1 &&
               this.rotation.value === 0 &&
               this.skew.x.value === 0 && this.skew.y.value === 0;
    }

    // Reset to identity transformation
    reset() {
        this.position.x.value = 0;
        this.position.y.value = 0;
        this.scale.x.value = 1;
        this.scale.y.value = 1;
        this.rotation.value = 0;
        this.skew.x.value = 0;
        this.skew.y.value = 0;
    }

    // Apply transformation relative to current state
    transformBy(translation?: [number, number], scale?: [number, number], rotation?: number) {
        if (translation) {
            this.position = addVector2D(this.position, vector2Ref(translation[0], translation[1]));
        }

        if (scale) {
            this.scale = multiplyVector2D(this.scale, vector2Ref(scale[0], scale[1]));
        }

        if (rotation !== undefined) {
            this.rotation.value += rotation;
        }
    }
}

/**
 * Example 5: Rectangle operations for UI layout and collision detection
 * Enhanced spatial reasoning with reactive rectangles
 */
export class ReactiveSpatialManager {
    private elements: Map<HTMLElement, Rect2D> = new Map();
    private viewport: Rect2D;

    constructor() {
        // Reactive viewport bounds
        this.viewport = createRect2D(0, 0, window.innerWidth, window.innerHeight);

        // Update viewport on resize
        window.addEventListener('resize', () => {
            this.viewport.size.x.value = window.innerWidth;
            this.viewport.size.y.value = window.innerHeight;
        });
    }

    // Register an element with reactive bounds
    registerElement(element: HTMLElement): Rect2D {
        const rect = createRect2D(0, 0, 0, 0);
        this.elements.set(element, rect);
        this.updateElementBounds(element);
        return rect;
    }

    // Update element bounds reactively
    updateElementBounds(element: HTMLElement): void {
        const rect = this.elements.get(element);
        if (!rect) return;

        const bounds = element.getBoundingClientRect();
        rect.position.x.value = bounds.left;
        rect.position.y.value = bounds.top;
        rect.size.x.value = bounds.width;
        rect.size.y.value = bounds.height;
    }

    // Find elements that intersect with a point
    getElementsAtPoint(point: Vector2D): HTMLElement[] {
        const result: HTMLElement[] = [];
        for (const [element, rect] of this.elements) {
            if (rectContainsPoint(rect, point).value) {
                result.push(element);
            }
        }
        return result;
    }

    // Find elements that intersect with a rectangle
    getElementsIntersectingRect(queryRect: Rect2D): HTMLElement[] {
        const result: HTMLElement[] = [];
        for (const [element, rect] of this.elements) {
            if (rectIntersects(rect, queryRect).value) {
                result.push(element);
            }
        }
        return result;
    }

    // Get elements within viewport
    getVisibleElements(): HTMLElement[] {
        return this.getElementsIntersectingRect(this.viewport);
    }

    // Calculate distance from point to nearest element
    getDistanceToNearestElement(point: Vector2D): number {
        let minDistance = Infinity;
        for (const [element, rect] of this.elements) {
            const distance = pointToRectDistance(point, rect).value;
            minDistance = Math.min(minDistance, distance);
        }
        return minDistance;
    }

    // Constrain element to viewport
    constrainToViewport(element: HTMLElement): void {
        const rect = this.elements.get(element);
        if (!rect) return;

        // Clamp position to viewport bounds
        rect.position.x.value = Math.max(0, Math.min(rect.position.x.value,
            this.viewport.size.x.value - rect.size.x.value));
        rect.position.y.value = Math.max(0, Math.min(rect.position.y.value,
            this.viewport.size.y.value - rect.size.y.value));
    }
}

/**
 * Example 6: Enhanced Selection Controller integration
 * Shows how to use the Selection controller with reactive math
 */
export class AdvancedSelectionManager {
    private selection: any; // Would be SelectionController
    private spatialManager: ReactiveSpatialManager;
    private selectedElements: Set<HTMLElement> = new Set();

    constructor() {
        this.spatialManager = new ReactiveSpatialManager();
        // this.selection = new SelectionController({ /* options */ });
    }

    // Select elements within selection rectangle
    selectElementsInRect(selectionRect: Rect2D): void {
        const intersectingElements = this.spatialManager.getElementsIntersectingRect(selectionRect);

        // Clear previous selection
        this.selectedElements.forEach(el => el.classList.remove('selected'));
        this.selectedElements.clear();

        // Add new selection
        intersectingElements.forEach(el => {
            el.classList.add('selected');
            this.selectedElements.add(el);
        });
    }

    // Get bounding box of all selected elements
    getSelectionBounds(): Rect2D | null {
        if (this.selectedElements.size === 0) return null;

        let union: Rect2D | null = null;
        for (const element of this.selectedElements) {
            const elementRect = this.spatialManager.registerElement(element);
            union = union ? {
                position: vector2Ref(
                    Math.min(union.position.x.value, elementRect.position.x.value),
                    Math.min(union.position.y.value, elementRect.position.y.value)
                ),
                size: vector2Ref(
                    Math.max(union.position.x.value + union.size.x.value,
                            elementRect.position.x.value + elementRect.size.x.value) -
                        Math.min(union.position.x.value, elementRect.position.x.value),
                    Math.max(union.position.y.value + union.size.y.value,
                            elementRect.position.y.value + elementRect.size.y.value) -
                        Math.min(union.position.y.value, elementRect.position.y.value)
                )
            } : elementRect;
        }

        return union;
    }

    // Move all selected elements by offset
    moveSelection(offset: Vector2D): void {
        for (const element of this.selectedElements) {
            const rect = this.spatialManager.registerElement(element);
            rect.position.x.value += offset.x.value;
            rect.position.y.value += offset.y.value;

            // Update DOM element
            element.style.transform = `translate(${rect.position.x.value}px, ${rect.position.y.value}px)`;
        }
    }

    // Scale selection around center
    scaleSelection(scale: number): void {
        const bounds = this.getSelectionBounds();
        if (!bounds) return;

        const center = rectCenter(bounds);

        for (const element of this.selectedElements) {
            const rect = this.spatialManager.registerElement(element);

            // Scale around selection center
            const toCenter = subtractVector2D(rectCenter(rect), center);
            const scaledToCenter = multiplyVector2D(toCenter, numberRef(scale));
            const newCenter = addVector2D(center, scaledToCenter);

            // Update position and size
            const newSize = multiplyVector2D(rect.size, numberRef(scale));
            rect.position.x.value = newCenter.x.value - newSize.x.value / 2;
            rect.position.y.value = newCenter.y.value - newSize.y.value / 2;
            rect.size.x.value = newSize.x.value;
            rect.size.y.value = newSize.y.value;

            // Update DOM element
            element.style.transform = `translate(${rect.position.x.value}px, ${rect.position.y.value}px)`;
            element.style.width = `${rect.size.x.value}px`;
            element.style.height = `${rect.size.y.value}px`;
        }
    }
}

/**
 * Example 7: CSS-Integrated Reactive Animation System
 * Demonstrates seamless integration between reactive math and CSS transforms
 */
export class ReactiveCSSAnimation {
    private element: HTMLElement;
    private transform: any; // Would be ReactiveTransform
    private position: Vector2D;
    private scale: Vector2D;
    private rotation: ReturnType<typeof numberRef>;
    private progress: ReturnType<typeof numberRef>;
    private duration: number;
    private startTime: number;

    constructor(element: HTMLElement, duration = 1000) {
        this.element = element;
        this.duration = duration;
        this.position = vector2Ref(0, 0);
        this.scale = vector2Ref(1, 1);
        this.rotation = numberRef(0);
        this.progress = numberRef(0);
        this.startTime = 0;

        // Bind reactive transform to CSS
        this.bindToCSS();
    }

    private bindToCSS() {
        // This would use the CSSAdapter utilities
        // const transform = new ReactiveTransform();
        // transform.translate(this.position.x, this.position.y);
        // transform.scale(this.scale.x, this.scale.y);
        // transform.rotate(this.rotation);
        // CSSBinder.bindTransform(this.element, transform.value);
    }

    animateTo(targetPos: Vector2D, targetScale: Vector2D = vector2Ref(1, 1), targetRotation: number = 0) {
        const startPos = { x: this.position.x.value, y: this.position.y.value };
        const startScale = { x: this.scale.x.value, y: this.scale.y.value };
        const startRotation = this.rotation.value;

        this.startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - this.startTime;
            this.progress.value = Math.min(elapsed / this.duration, 1);

            // Easing function (ease-out cubic)
            const t = 1 - Math.pow(1 - this.progress.value, 3);

            // Interpolate position
            this.position.x.value = startPos.x + (targetPos.x.value - startPos.x) * t;
            this.position.y.value = startPos.y + (targetPos.y.value - startPos.y) * t;

            // Interpolate scale
            this.scale.x.value = startScale.x + (targetScale.x.value - startScale.x) * t;
            this.scale.y.value = startScale.y.value + (targetScale.y.value - startScale.y) * t;

            // Interpolate rotation
            this.rotation.value = startRotation + (targetRotation - startRotation) * t;

            if (this.progress.value < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    // Chain animations
    then(): Promise<void> {
        return new Promise(resolve => {
            const checkComplete = () => {
                if (this.progress.value >= 1) {
                    resolve();
                } else {
                    requestAnimationFrame(checkComplete);
                }
            };
            checkComplete();
        });
    }
}

/**
 * Example 8: Reactive CSS Layout System
 * Shows how reactive math can power responsive layouts
 */
export class ReactiveCSSLayout {
    private container: HTMLElement;
    private items: HTMLElement[];
    private layoutType: 'grid' | 'flex' | 'absolute';
    private spacing: ReturnType<typeof numberRef>;
    private itemSize: Vector2D;

    constructor(container: HTMLElement, layoutType: 'grid' | 'flex' | 'absolute' = 'grid') {
        this.container = container;
        this.layoutType = layoutType;
        this.items = Array.from(container.children) as HTMLElement[];
        this.spacing = numberRef(10);
        this.itemSize = vector2Ref(100, 100);

        this.setupReactiveLayout();
    }

    private setupReactiveLayout() {
        // React to container size changes
        const containerSize = new ReactiveElementSize(this.container);

        // Update layout when container size or spacing changes
        operated([containerSize.width, containerSize.height, this.spacing], () => {
            this.updateLayout();
        });
    }

    private updateLayout() {
        const containerRect = this.container.getBoundingClientRect();

        switch (this.layoutType) {
            case 'grid':
                this.updateGridLayout(containerRect);
                break;
            case 'flex':
                this.updateFlexLayout(containerRect);
                break;
            case 'absolute':
                this.updateAbsoluteLayout(containerRect);
                break;
        }
    }

    private updateGridLayout(containerRect: DOMRect) {
        const cols = Math.floor((containerRect.width + this.spacing.value) / (this.itemSize.x.value + this.spacing.value));
        const rows = Math.ceil(this.items.length / cols);

        this.items.forEach((item, index) => {
            const row = Math.floor(index / cols);
            const col = index % cols;

            const x = col * (this.itemSize.x.value + this.spacing.value);
            const y = row * (this.itemSize.y.value + this.spacing.value);

            item.style.position = 'absolute';
            item.style.left = `${x}px`;
            item.style.top = `${y}px`;
            item.style.width = `${this.itemSize.x.value}px`;
            item.style.height = `${this.itemSize.y.value}px`;
        });
    }

    private updateFlexLayout(containerRect: DOMRect) {
        // Simple flex layout with reactive spacing
        const totalSpacing = (this.items.length - 1) * this.spacing.value;
        const availableWidth = containerRect.width - totalSpacing;
        const itemWidth = availableWidth / this.items.length;

        this.items.forEach((item, index) => {
            const x = index * (itemWidth + this.spacing.value);

            item.style.position = 'absolute';
            item.style.left = `${x}px`;
            item.style.top = '0px';
            item.style.width = `${itemWidth}px`;
            item.style.height = `${this.itemSize.y.value}px`;
        });
    }

    private updateAbsoluteLayout(containerRect: DOMRect) {
        // Position items absolutely with constraints
        this.items.forEach((item, index) => {
            // This would use constraint solving with reactive math
            // For demo, just position in a circle
            const angle = (index / this.items.length) * Math.PI * 2;
            const radius = Math.min(containerRect.width, containerRect.height) * 0.3;
            const centerX = containerRect.width / 2;
            const centerY = containerRect.height / 2;

            const x = centerX + Math.cos(angle) * radius - this.itemSize.x.value / 2;
            const y = centerY + Math.sin(angle) * radius - this.itemSize.y.value / 2;

            item.style.position = 'absolute';
            item.style.left = `${x}px`;
            item.style.top = `${y}px`;
            item.style.width = `${this.itemSize.x.value}px`;
            item.style.height = `${this.itemSize.y.value}px`;
        });
    }

    // Reactively update item size
    setItemSize(width: number, height: number) {
        this.itemSize.x.value = width;
        this.itemSize.y.value = height;
        this.updateLayout();
    }

    // Reactively update spacing
    setSpacing(spacing: number) {
        this.spacing.value = spacing;
        // Layout updates automatically due to reactive subscription
    }

    // Add reactive item
    addItem(item: HTMLElement) {
        this.items.push(item);
        this.container.appendChild(item);
        this.updateLayout();
    }

    // Remove item reactively
    removeItem(item: HTMLElement) {
        const index = this.items.indexOf(item);
        if (index > -1) {
            this.items.splice(index, 1);
            item.remove();
            this.updateLayout();
        }
    }
}

/**
 * Example 9: Reactive CSS Scroll-based Animations
 * Demonstrates scroll-driven reactive transforms
 */
export class ReactiveScrollAnimation {
    private element: HTMLElement;
    private scroll: any; // Would be ReactiveScroll
    private startOffset: number;
    private endOffset: number;
    private transform: any; // Would be ReactiveTransform

    constructor(element: HTMLElement, startOffset = 0, endOffset = 1000) {
        this.element = element;
        this.startOffset = startOffset;
        this.endOffset = endOffset;

        // this.scroll = new ReactiveScroll();
        // this.transform = new ReactiveTransform();
        this.setupScrollAnimation();
    }

    private setupScrollAnimation() {
        // Bind scroll progress to transform
        // const progress = this.scroll.progress('y');
        // operated([progress], () => {
        //     const t = progress.value;
        //     this.transform.reset();
        //     this.transform.translate(0, t * 100);
        //     this.transform.rotate(t * 360);
        //     this.transform.scale(1 + t * 0.5, 1 + t * 0.5);
        // });
        //
        // // Bind to CSS
        // CSSBinder.bindTransform(this.element, this.transform.value);
    }

    // Update scroll range
    setScrollRange(start: number, end: number) {
        this.startOffset = start;
        this.endOffset = end;
        // Would need to update scroll progress calculation
    }

    // Add keyframe at specific scroll progress
    addKeyframe(progress: number, transform: any) {
        // Would implement keyframe interpolation
        // this.keyframes.set(progress, transform);
    }
}

// Grid examples have been moved to src/math/integration-examples.ts
// All grid classes are now available from 'fest/lure' or 'fest/lure/src/math'
