// Integration examples showing how reactive math enhances existing components
import { numberRef } from "fest/object";
import { Vector2D, vector2Ref, addVector2D, subtractVector2D, multiplyVector2D, magnitude2D, divideVector2D, translate2D, scale2D, rotate2D, operated, createRect2D, rectCenter, rectContainsPoint, rectIntersects, pointToRectDistance } from "../src/math/index";
import { ReactiveElementSize } from "../src/extension/css-ref/Utils";
/**
 * Example 1: Enhanced Draggable with reactive vector math
 * Improves upon the existing DragHandler in controllers/Draggable.ts
 */
export class ReactiveDraggable {
    position;
    velocity;
    acceleration;
    constructor(initialX = 0, initialY = 0) {
        this.position = vector2Ref(initialX, initialY);
        this.velocity = vector2Ref(0, 0);
        this.acceleration = vector2Ref(0, 0);
    }
    // Physics-based movement with reactive math
    update(deltaTime) {
        // velocity += acceleration * deltaTime
        const deltaVel = multiplyVector2D(this.acceleration, numberRef(deltaTime));
        this.velocity = addVector2D(this.velocity, deltaVel);
        // position += velocity * deltaTime
        const deltaPos = multiplyVector2D(this.velocity, numberRef(deltaTime));
        this.position = addVector2D(this.position, deltaPos);
    }
    // Apply forces reactively
    applyForce(force) {
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
    topLeft;
    size;
    center;
    corners;
    constructor(element) {
        // Create reactive vectors from element bounds
        this.topLeft = vector2Ref(0, 0);
        this.size = vector2Ref(0, 0);
        // Computed reactive center point
        this.center = addVector2D(this.topLeft, multiplyVector2D(this.size, numberRef(0.5)));
        // Computed reactive corners
        this.corners = [
            this.topLeft, // top-left
            addVector2D(this.topLeft, new Vector2D(this.size.x, numberRef(0))), // top-right
            addVector2D(this.topLeft, this.size), // bottom-right
            addVector2D(this.topLeft, new Vector2D(numberRef(0), this.size.y)) // bottom-left
        ];
        this.updateBounds(element);
    }
    updateBounds(element) {
        const rect = element.getBoundingClientRect();
        this.topLeft.x.value = rect.left;
        this.topLeft.y.value = rect.top;
        this.size.x.value = rect.width;
        this.size.y.value = rect.height;
    }
    // Reactive collision detection
    contains(point) {
        const inX = operated([point.x, this.topLeft.x, this.size.x], () => point.x.value >= this.topLeft.x.value &&
            point.x.value <= this.topLeft.x.value + this.size.x.value);
        const inY = operated([point.y, this.topLeft.y, this.size.y], () => point.y.value >= this.topLeft.y.value &&
            point.y.value <= this.topLeft.y.value + this.size.y.value);
        return operated([inX, inY], () => inX.value && inY.value);
    }
    // Get bounds as array (compatible with existing APIs)
    getBounds() {
        return [
            this.topLeft.x.value, this.topLeft.y.value, // x, y
            this.size.x.value, this.size.y.value // width, height
        ];
    }
}
/**
 * Example 3: Enhanced Grid Layout with matrix transformations
 * Improves upon layout/grid/Interact.ts
 */
export class ReactiveGridTransform {
    position;
    scale;
    rotation;
    constructor() {
        this.position = vector2Ref(0, 0);
        this.scale = vector2Ref(1, 1);
        this.rotation = numberRef(0);
    }
    // Apply transformation matrix to a point
    transformPoint(point) {
        // Scale -> Rotate -> Translate
        let result = scale2D(point, this.scale.x, this.scale.y);
        result = rotate2D(result, this.rotation);
        result = translate2D(result, this.position.x, this.position.y);
        return result;
    }
    // Convert grid coordinates to screen coordinates
    gridToScreen(gridX, gridY, cellSize) {
        const gridPoint = vector2Ref(gridX * cellSize, gridY * cellSize);
        return this.transformPoint(gridPoint);
    }
    // Convert screen coordinates to grid coordinates
    screenToGrid(screenX, screenY, cellSize) {
        // Inverse transformation: Translate -> Rotate -> Scale
        const screenPoint = vector2Ref(screenX, screenY);
        let result = translate2D(screenPoint, operated([this.position.x], () => -this.position.x.value), operated([this.position.y], () => -this.position.y.value));
        result = rotate2D(result, operated([this.rotation], () => -this.rotation.value));
        result = scale2D(result, operated([this.scale.x], () => 1 / this.scale.x.value), operated([this.scale.y], () => 1 / this.scale.y.value));
        return new Vector2D(operated([result.x], () => result.x.value / cellSize), operated([result.y], () => result.y.value / cellSize));
    }
}
/**
 * Example 4: Enhanced Pointer API with reactive vectors
 * Improves upon extension/controllers/PointerAPI.ts
 */
export class ReactivePointer {
    position;
    delta;
    velocity;
    constructor() {
        this.position = vector2Ref(0, 0);
        this.delta = vector2Ref(0, 0);
        this.velocity = vector2Ref(0, 0);
    }
    updatePosition(clientX, clientY, deltaTime = 1) {
        const newPosition = vector2Ref(clientX, clientY);
        // Calculate delta movement
        this.delta = subtractVector2D(newPosition, this.position);
        // Calculate velocity (delta / time)
        this.velocity = multiplyVector2D(this.delta, numberRef(1 / deltaTime));
        // Update position
        this.position = newPosition;
    }
    // Get distance from another point
    distanceTo(other) {
        const diff = subtractVector2D(this.position, other);
        return magnitude2D(diff);
    }
    // Check if pointer is within a reactive bounding box
    isWithin(bounds) {
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
    pointers = new Map();
    // Enhanced coordinate conversion with reactive math
    static clientToOrient(clientX, clientY, element) {
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
    trackPointer(pointerId, clientX, clientY) {
        let pointer = this.pointers.get(pointerId);
        if (!pointer) {
            pointer = new ReactivePointer();
            this.pointers.set(pointerId, pointer);
        }
        pointer.updatePosition(clientX, clientY, 1 / 60); // 60fps
        return pointer;
    }
    // Reactive collision detection between pointers and elements
    isPointerOverElement(pointerId, element) {
        const pointer = this.pointers.get(pointerId);
        if (!pointer)
            return numberRef(0);
        const bbox = new ReactiveBoundingBox(element);
        const pointerPos = vector2Ref(...pointer.getPosition());
        return bbox.contains(pointerPos);
    }
    // Multi-pointer gesture recognition
    getPinchDistance(pointerId1, pointerId2) {
        const p1 = this.pointers.get(pointerId1);
        const p2 = this.pointers.get(pointerId2);
        if (!p1 || !p2)
            return numberRef(0);
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
    holder;
    reactivePosition;
    velocity;
    acceleration;
    friction;
    spring;
    dragHandler; // Would be DragHandler instance
    constructor(holder, options = {}) {
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
    updatePhysics(deltaTime = 1 / 60) {
        // Apply friction to velocity
        this.velocity = multiplyVector2D(this.velocity, this.friction);
        // Update position based on velocity
        const deltaPos = multiplyVector2D(this.velocity, numberRef(deltaTime));
        this.reactivePosition = addVector2D(this.reactivePosition, deltaPos);
        // Apply spring forces if near target
        this.applySpringForces();
    }
    applySpringForces() {
        // Spring back to origin when released
        const springForce = multiplyVector2D(this.reactivePosition, operated([this.spring.stiffness], (s) => -s.value));
        const dampingForce = multiplyVector2D(this.velocity, operated([this.spring.damping], (d) => -d.value));
        this.acceleration = addVector2D(springForce, dampingForce);
        this.velocity = addVector2D(this.velocity, multiplyVector2D(this.acceleration, numberRef(1 / 60)));
    }
    // Apply external forces (like mouse drag)
    applyForce(force) {
        this.velocity = addVector2D(this.velocity, force);
    }
    // Get current position for DOM updates
    getPositionForDOM() {
        return [this.reactivePosition.x.value, this.reactivePosition.y.value];
    }
    // Check if movement has settled
    isAtRest(threshold = 0.1) {
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
    holder;
    reactiveSize;
    minSize;
    maxSize;
    aspectRatio;
    constructor(holder, options = {}) {
        this.holder = holder;
        // Initialize reactive vectors
        this.reactiveSize = vector2Ref(holder.offsetWidth, holder.offsetHeight);
        this.minSize = vector2Ref(options.minSize?.[0] || 50, options.minSize?.[1] || 50);
        this.maxSize = vector2Ref(options.maxSize?.[0] || globalThis.innerWidth, options.maxSize?.[1] || globalThis.innerHeight);
        this.aspectRatio = options.aspectRatio ? numberRef(options.aspectRatio) : null;
    }
    // Set size with reactive constraints
    setSize(width, height) {
        let newWidth = operated([numberRef(width), this.minSize.x, this.maxSize.x], (w, min, max) => Math.max(min.value, Math.min(max.value, w.value)));
        let newHeight = operated([numberRef(height), this.minSize.y, this.maxSize.y], (h, min, max) => Math.max(min.value, Math.min(max.value, h.value)));
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
    resizeBy(deltaWidth, deltaHeight) {
        const newWidth = operated([this.reactiveSize.x, numberRef(deltaWidth)], (w, dw) => w.value + dw.value);
        const newHeight = operated([this.reactiveSize.y, numberRef(deltaHeight)], (h, dh) => h.value + dh.value);
        this.setSize(newWidth.value, newHeight.value);
    }
    // Get constrained size for DOM updates
    getConstrainedSize() {
        return [this.reactiveSize.x.value, this.reactiveSize.y.value];
    }
    // Check if size is at minimum/maximum bounds
    isAtMinSize() {
        return this.reactiveSize.x.value <= this.minSize.x.value ||
            this.reactiveSize.y.value <= this.minSize.y.value;
    }
    isAtMaxSize() {
        return this.reactiveSize.x.value >= this.maxSize.x.value ||
            this.reactiveSize.y.value >= this.maxSize.y.value;
    }
}
/**
 * Enhanced Grid System with reactive transformations
 * Improves upon layout/grid/Interact.ts
 */
export class ReactiveGridSystem {
    cellSize;
    gridOffset;
    zoom;
    pan;
    constructor(cellSize = [32, 32]) {
        this.cellSize = vector2Ref(cellSize[0], cellSize[1]);
        this.gridOffset = vector2Ref(0, 0);
        this.zoom = numberRef(1);
        this.pan = vector2Ref(0, 0);
    }
    // Convert grid coordinates to screen coordinates with zoom and pan
    gridToScreen(gridX, gridY) {
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
    screenToGrid(screenX, screenY) {
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
    snapToGrid(position) {
        const gridCoords = this.screenToGrid(position.x.value, position.y.value);
        return this.gridToScreen(Math.round(gridCoords.x.value), Math.round(gridCoords.y.value));
    }
    // Get grid line positions for rendering
    getGridLines(viewportSize) {
        const [width, height] = viewportSize;
        // Calculate visible grid range
        const topLeft = this.screenToGrid(-this.pan.x.value, -this.pan.y.value);
        const bottomRight = this.screenToGrid(width - this.pan.x.value, height - this.pan.y.value);
        const horizontal = [];
        const vertical = [];
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
    animateZoom(targetZoom, duration = 300) {
        const startZoom = this.zoom.value;
        const startTime = performance.now();
        const animate = (currentTime) => {
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
    panBy(deltaX, deltaY) {
        this.pan.x.value += deltaX;
        this.pan.y.value += deltaY;
    }
    // Center the grid on a specific point
    centerOn(point) {
        const centerX = globalThis.innerWidth / 2;
        const centerY = globalThis.innerHeight / 2;
        this.pan.x.value = centerX - point.x.value;
        this.pan.y.value = centerY - point.y.value;
    }
}
/**
 * Enhanced Orientation System with reactive transformations
 * Improves upon layout/orient/OrientBox.ts
 */
export class ReactiveOrientSystem {
    position;
    scale;
    rotation;
    skew;
    constructor() {
        this.position = vector2Ref(0, 0);
        this.scale = vector2Ref(1, 1);
        this.rotation = numberRef(0);
        this.skew = vector2Ref(0, 0);
    }
    // Generate CSS transform string reactively
    getTransformString() {
        return operated([this.position.x, this.position.y, this.scale.x, this.scale.y, this.rotation, this.skew.x, this.skew.y], (x, y, sx, sy, rot, skx, sky) => `translate3d(${x.value}px, ${y.value}px, 0px) ` +
            `scale(${sx.value}, ${sy.value}) ` +
            `rotate(${rot.value}deg) ` +
            `skew(${skx.value}deg, ${sky.value}deg)`);
    }
    // Apply transformation to a point
    transformPoint(point) {
        // Apply scale
        let result = multiplyVector2D(point, this.scale);
        // Apply rotation
        result = rotate2D(result, this.rotation);
        // Apply translation
        result = addVector2D(result, this.position);
        return result;
    }
    // Get inverse transformation for converting screen to local coordinates
    inverseTransformPoint(point) {
        // Inverse translate
        let result = subtractVector2D(point, this.position);
        // Inverse rotate
        result = rotate2D(result, operated([this.rotation], (r) => -r.value));
        // Inverse scale
        result = divideVector2D(result, this.scale);
        return result;
    }
    // Interpolate between two transformation states
    interpolateTo(target, progress) {
        const newSystem = new ReactiveOrientSystem();
        newSystem.position = addVector2D(multiplyVector2D(this.position, operated([numberRef(1), numberRef(progress)], (a, p) => a.value - p.value)), multiplyVector2D(target.position, numberRef(progress)));
        newSystem.scale = addVector2D(multiplyVector2D(this.scale, operated([numberRef(1), numberRef(progress)], (a, p) => a.value - p.value)), multiplyVector2D(target.scale, numberRef(progress)));
        newSystem.rotation = operated([this.rotation, target.rotation, numberRef(progress)], (current, target, p) => current.value + (target.value - current.value) * p.value);
        return newSystem;
    }
    // Check if transformation is identity (no transformation applied)
    isIdentity() {
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
    transformBy(translation, scale, rotation) {
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
    elements = new Map();
    viewport;
    constructor() {
        // Reactive viewport bounds
        this.viewport = createRect2D(0, 0, globalThis.innerWidth, globalThis.innerHeight);
        // Update viewport on resize
        globalThis.addEventListener('resize', () => {
            this.viewport.size.x.value = globalThis.innerWidth;
            this.viewport.size.y.value = globalThis.innerHeight;
        });
    }
    // Register an element with reactive bounds
    registerElement(element) {
        const rect = createRect2D(0, 0, 0, 0);
        this.elements.set(element, rect);
        this.updateElementBounds(element);
        return rect;
    }
    // Update element bounds reactively
    updateElementBounds(element) {
        const rect = this.elements.get(element);
        if (!rect)
            return;
        const bounds = element.getBoundingClientRect();
        rect.position.x.value = bounds.left;
        rect.position.y.value = bounds.top;
        rect.size.x.value = bounds.width;
        rect.size.y.value = bounds.height;
    }
    // Find elements that intersect with a point
    getElementsAtPoint(point) {
        const result = [];
        for (const [element, rect] of this.elements) {
            if (rectContainsPoint(rect, point).value) {
                result.push(element);
            }
        }
        return result;
    }
    // Find elements that intersect with a rectangle
    getElementsIntersectingRect(queryRect) {
        const result = [];
        for (const [element, rect] of this.elements) {
            if (rectIntersects(rect, queryRect).value) {
                result.push(element);
            }
        }
        return result;
    }
    // Get elements within viewport
    getVisibleElements() {
        return this.getElementsIntersectingRect(this.viewport);
    }
    // Calculate distance from point to nearest element
    getDistanceToNearestElement(point) {
        let minDistance = Infinity;
        for (const [element, rect] of this.elements) {
            const distance = pointToRectDistance(point, rect).value;
            minDistance = Math.min(minDistance, distance);
        }
        return minDistance;
    }
    // Constrain element to viewport
    constrainToViewport(element) {
        const rect = this.elements.get(element);
        if (!rect)
            return;
        // Clamp position to viewport bounds
        rect.position.x.value = Math.max(0, Math.min(rect.position.x.value, this.viewport.size.x.value - rect.size.x.value));
        rect.position.y.value = Math.max(0, Math.min(rect.position.y.value, this.viewport.size.y.value - rect.size.y.value));
    }
}
/**
 * Example 6: Enhanced Selection Controller integration
 * Shows how to use the Selection controller with reactive math
 */
export class AdvancedSelectionManager {
    selection; // Would be SelectionController
    spatialManager;
    selectedElements = new Set();
    constructor() {
        this.spatialManager = new ReactiveSpatialManager();
        // this.selection = new SelectionController({ /* options */ });
    }
    // Select elements within selection rectangle
    selectElementsInRect(selectionRect) {
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
    getSelectionBounds() {
        if (this.selectedElements.size === 0)
            return null;
        let union = null;
        for (const element of this.selectedElements) {
            const elementRect = this.spatialManager.registerElement(element);
            union = union ? {
                position: vector2Ref(Math.min(union.position.x.value, elementRect.position.x.value), Math.min(union.position.y.value, elementRect.position.y.value)),
                size: vector2Ref(Math.max(union.position.x.value + union.size.x.value, elementRect.position.x.value + elementRect.size.x.value) -
                    Math.min(union.position.x.value, elementRect.position.x.value), Math.max(union.position.y.value + union.size.y.value, elementRect.position.y.value + elementRect.size.y.value) -
                    Math.min(union.position.y.value, elementRect.position.y.value))
            } : elementRect;
        }
        return union;
    }
    // Move all selected elements by offset
    moveSelection(offset) {
        for (const element of this.selectedElements) {
            const rect = this.spatialManager.registerElement(element);
            rect.position.x.value += offset.x.value;
            rect.position.y.value += offset.y.value;
            // Update DOM element
            element.style.transform = `translate(${rect.position.x.value}px, ${rect.position.y.value}px)`;
        }
    }
    // Scale selection around center
    scaleSelection(scale) {
        const bounds = this.getSelectionBounds();
        if (!bounds)
            return;
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
    element;
    transform; // Would be ReactiveTransform
    position;
    scale;
    rotation;
    progress;
    duration;
    startTime;
    constructor(element, duration = 1000) {
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
    bindToCSS() {
        // This would use the CSSAdapter utilities
        // const transform = new ReactiveTransform();
        // transform.translate(this.position.x, this.position.y);
        // transform.scale(this.scale.x, this.scale.y);
        // transform.rotate(this.rotation);
        // CSSBinder.bindTransform(this.element, transform.value);
    }
    animateTo(targetPos, targetScale = vector2Ref(1, 1), targetRotation = 0) {
        const startPos = { x: this.position.x.value, y: this.position.y.value };
        const startScale = { x: this.scale.x.value, y: this.scale.y.value };
        const startRotation = this.rotation.value;
        this.startTime = performance.now();
        const animate = (currentTime) => {
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
    then() {
        return new Promise(resolve => {
            const checkComplete = () => {
                if (this.progress.value >= 1) {
                    resolve();
                }
                else {
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
    container;
    items;
    layoutType;
    spacing;
    itemSize;
    constructor(container, layoutType = 'grid') {
        this.container = container;
        this.layoutType = layoutType;
        this.items = Array.from(container.children);
        this.spacing = numberRef(10);
        this.itemSize = vector2Ref(100, 100);
        this.setupReactiveLayout();
    }
    setupReactiveLayout() {
        // React to container size changes
        const containerSize = new ReactiveElementSize(this.container);
        // Update layout when container size or spacing changes
        operated([containerSize.width, containerSize.height, this.spacing], () => {
            this.updateLayout();
        });
    }
    updateLayout() {
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
    updateGridLayout(containerRect) {
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
    updateFlexLayout(containerRect) {
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
    updateAbsoluteLayout(containerRect) {
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
    setItemSize(width, height) {
        this.itemSize.x.value = width;
        this.itemSize.y.value = height;
        this.updateLayout();
    }
    // Reactively update spacing
    setSpacing(spacing) {
        this.spacing.value = spacing;
        // Layout updates automatically due to reactive subscription
    }
    // Add reactive item
    addItem(item) {
        this.items.push(item);
        this.container.appendChild(item);
        this.updateLayout();
    }
    // Remove item reactively
    removeItem(item) {
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
    element;
    scroll; // Would be ReactiveScroll
    startOffset;
    endOffset;
    transform; // Would be ReactiveTransform
    constructor(element, startOffset = 0, endOffset = 1000) {
        this.element = element;
        this.startOffset = startOffset;
        this.endOffset = endOffset;
        // this.scroll = new ReactiveScroll();
        // this.transform = new ReactiveTransform();
        this.setupScrollAnimation();
    }
    setupScrollAnimation() {
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
    setScrollRange(start, end) {
        this.startOffset = start;
        this.endOffset = end;
        // Would need to update scroll progress calculation
    }
    // Add keyframe at specific scroll progress
    addKeyframe(progress, transform) {
        // Would implement keyframe interpolation
        // this.keyframes.set(progress, transform);
    }
}
// Grid examples have been moved to src/math/integration-examples.ts
// All grid classes are now available from 'fest/lure' or 'fest/lure/src/math'
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWdyYXRpb24tZXhhbXBsZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZ3JhdGlvbi1leGFtcGxlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw4RUFBOEU7QUFFOUUsT0FBTyxFQUFFLFNBQVMsRUFBc0IsTUFBTSxhQUFhLENBQUM7QUFDNUQsT0FBTyxFQUNILFFBQVEsRUFBRSxVQUFVLEVBQ3BCLFdBQVcsRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSxXQUFXLEVBQUUsY0FBYyxFQUM1RSxXQUFXLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFFOUIsUUFBUSxFQUNBLFlBQVksRUFBRSxVQUFVLEVBQUUsaUJBQWlCLEVBQUUsY0FBYyxFQUNqRCxtQkFBbUIsRUFHeEMsTUFBTSxtQkFBbUIsQ0FBQztBQUMzQixPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUVyRTs7O0dBR0c7QUFDSCxNQUFNLE9BQU8saUJBQWlCO0lBQ2xCLFFBQVEsQ0FBVztJQUNuQixRQUFRLENBQVc7SUFDbkIsWUFBWSxDQUFXO0lBRS9CLFlBQVksUUFBUSxHQUFHLENBQUMsRUFBRSxRQUFRLEdBQUcsQ0FBQztRQUNsQyxJQUFJLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDL0MsSUFBSSxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxZQUFZLEdBQUcsVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRUQsNENBQTRDO0lBQzVDLE1BQU0sQ0FBQyxTQUFpQjtRQUNwQix1Q0FBdUM7UUFDdkMsTUFBTSxRQUFRLEdBQUcsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUMzRSxJQUFJLENBQUMsUUFB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QUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDakQsSUFBSSxNQUFNLEdBQUcsV0FBVyxDQUFDLFdBQVcsRUFBRSxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQ3pELFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ2pHLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNqRixNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFDdEQsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUM3RSxPQUFPLElBQUksUUFBUSxDQUNmLFFBQVEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsRUFDckQsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFD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QzVDLE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdkcsTUFBTSxTQUFTLEdBQUcsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUV6RyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFFRCx1Q0FBdUM7SUFDdkMsa0JBQWtCO1FBQ2QsT0FBTyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNsRSxDQUFDO0lBRUQsNkNBQTZDO0lBQzdDLFdBQVc7UUFDUCxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLO1lBQ2pELElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7SUFDN0QsQ0FBQztJQUVELFdBQVc7UUFDUCxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLO1lBQ2pELElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7SUFDN0QsQ0FBQztDQUNKO0FBRUQ7OztHQUdHO0FBQ0gsTUFBTSxPQUFPLGtCQUFrQjtJQUNuQixRQUFRLENBQVc7SUFDbkIsVUFBVSxDQUFXO0lBQ3JCLElBQUksQ0FBK0I7SUFDbkMsR0FBRyxDQUFXO0lBRXRCLFlBQVksV0FBNkIsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDO1FBQzdDLElBQUksQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyRCxJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDbkMsSUFBSSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekIsSUFBSSxDQUFDLEdBQUcsR0FBRyxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFFRCxtRUFBbUU7SUFDbkUsWUFBWSxDQUFDLEtBQWEsRUFBRSxLQUFhO1FBQ3JDLE1BQU0sT0FBTyxHQUFHLFVBQVUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFekMscUJBQXFCO1FBQ3JCLE1BQU0sTUFBTSxHQUFHLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFeEQsYUFBYTtRQUNiLE1BQU0sTUFBTSxHQUFHLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFbkQsbUJBQW1CO1FBQ25CLE1BQU0sTUFBTSxHQUFHLFdBQVcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRTdDLGtCQUFrQjtRQUNsQixPQUFPLFdBQVcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFFRCxpREFBaUQ7SUFDakQsWUFBWSxDQUFDLE9BQWUsRUFBRSxPQUFlO1FBQ3pDLE1BQU0sU0FBUyxHQUFHLFVBQVUsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFL0Msd0JBQXdCO1FBQ3hCLE1BQU0sUUFBUSxHQUFHLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdkQsTUFBTSxRQUFRLEdBQUcsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUU3RCxjQUFjO1FBQ2QsTUFBTSxRQUFRLEdBQUcsY0FBYyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFckQsd0JBQXdCO1FBQ3hCLE9BQU8sY0FBYyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUVELHNDQUFzQztJQUN0QyxVQUFVLENBQUMsUUFBa0I7UUFDekIsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3pFLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FDcEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUM5QixJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQ2pDLENBQUM7SUFDTixDQUFDO0lBRUQsd0NBQXdDO0lBQ3hDLFlBQVksQ0FBQyxZQUE4QjtRQUN2QyxNQUFNLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxHQUFHLFlBQVksQ0FBQztRQUVyQywrQkFBK0I7UUFDL0IsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3hFLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFM0YsTUFBTSxVQUFVLEdBQWEsRUFBRSxDQUFDO1FBQ2hDLE1BQU0sUUFBUSxHQUFhLEVBQUUsQ0FBQztRQUU5Qiw0QkFBNEI7UUFDNUIsS0FBSyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ2pGLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7WUFDaEQsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM3QixDQUFDO1FBRUQsMEJBQTBCO1FBQzFCLEtBQUssSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUNqRixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1lBQ2hELFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDM0IsQ0FBQztRQUVELE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLENBQUM7SUFDcEMsQ0FBQztJQUVELHlDQUF5QztJQUN6QyxXQUFXLENBQUMsVUFBa0IsRUFBRSxXQUFtQixHQUFHO1FBQ2xELE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ2xDLE1BQU0sU0FBUyxHQUFHLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUVwQyxNQUFNLE9BQU8sR0FBRyxDQUFDLFdBQW1CLEVBQUUsRUFBRTtZQUNwQyxNQUFNLE9BQU8sR0FBRyxXQUFXLEdBQUcsU0FBUyxDQUFDO1lBQ3hDLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxHQUFHLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUVqRCxtQ0FBbUM7WUFDbkMsTUFBTSxLQUFLLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUU1QyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxTQUFTLEdBQUcsQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDLEdBQUcsS0FBSyxDQUFDO1lBRS9ELElBQUksUUFBUSxHQUFHLENBQUMsRUFBRSxDQUFDO2dCQUNmLHFCQUFxQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ25DLENBQUM7UUFDTCxDQUFDLENBQUM7UUFFRixxQkFBcUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBRUQsd0JBQXdCO0lBQ3hCLEtBQUssQ0FBQyxNQUFjLEVBQUUsTUFBYztRQUNoQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksTUFBTSxDQUFDO1FBQzNCLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxNQUFNLENBQUM7SUFDL0IsQ0FBQztJQUVELHNDQUFzQztJQUN0QyxRQUFRLENBQUMsS0FBZTtRQUNwQixNQUFNLE9BQU8sR0FBRyxVQUFVLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztRQUMxQyxNQUFNLE9BQU8sR0FBRyxVQUFVLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQztRQUUzQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsT0FBTyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQzNDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxPQUFPLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7SUFDL0MsQ0FBQztDQUNKO0FBRUQ7OztHQUdHO0FBQ0gsTUFBTSxPQUFPLG9CQUFvQjtJQUNyQixRQUFRLENBQVc7SUFDbkIsS0FBSyxDQUFXO0lBQ2hCLFFBQVEsQ0FBK0I7SUFDdkMsSUFBSSxDQUFXO0lBRXZCO1FBQ0ksSUFBSSxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxLQUFLLEdBQUcsVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM5QixJQUFJLENBQUMsUUFBUSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3QixJQUFJLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDakMsQ0FBQztJQUVELDJDQUEyQztJQUMzQyxrQkFBa0I7UUFDZCxPQUFPLFFBQVEsQ0FDWCxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFDdkcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUM1QixlQUFlLENBQUMsQ0FBQyxLQUFLLE9BQU8sQ0FBQyxDQUFDLEtBQUssV0FBVztZQUMvQyxTQUFTLEVBQUUsQ0FBQyxLQUFLLEtBQUssRUFBRSxDQUFDLEtBQUssSUFBSTtZQUNsQyxVQUFVLEdBQUcsQ0FBQyxLQUFLLE9BQU87WUFDMUIsUUFBUSxHQUFHLENBQUMsS0FBSyxRQUFRLEdBQUcsQ0FBQyxLQUFLLE1BQU0sQ0FDL0MsQ0FBQztJQUNOLENBQUM7SUFFRCxrQ0FBa0M7SUFDbEMsY0FBYyxDQUFDLEtBQWU7UUFDMUIsY0FBYztRQUNkLElBQUksTUFBTSxHQUFHLGdCQUFnQixDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFakQsaUJBQWlCO1FBQ2pCLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUV6QyxvQkFBb0I7UUFDcEIsTUFBTSxHQUFHLFdBQVcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRTVDLE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFFRCx3RUFBd0U7SUFDeEUscUJBQXFCLENBQUMsS0FBZTtRQUNqQyxvQkFBb0I7UUFDcEIsSUFBSSxNQUFNLEdBQUcsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUVwRCxpQkFBaUI7UUFDakIsTUFBTSxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBRXRFLGdCQUFnQjtRQUNoQixNQUFNLEdBQUcsY0FBYyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFNUMsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUVELGdEQUFnRDtJQUNoRCxhQUFhLENBQUMsTUFBNEIsRUFBRSxRQUFnQjtRQUN4RCxNQUFNLFNBQVMsR0FBRyxJQUFJLG9CQUFvQixFQUFFLENBQUM7UUFFN0MsU0FBUyxDQUFDLFFBQVEsR0FBRyxXQUFXLENBQzVCLGdCQUFnQixDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFDM0csZ0JBQWdCLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FDekQsQ0FBQztRQUVGLFNBQVMsQ0FBQyxLQUFLLEdBQUcsV0FBVyxDQUN6QixnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQ3hHLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQ3RELENBQUM7UUFFRixTQUFTLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FDekIsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQ3JELENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUNuRixDQUFDO1FBRUYsT0FBTyxTQUFTLENBQUM7SUFDckIsQ0FBQztJQUVELGtFQUFrRTtJQUNsRSxVQUFVO1FBQ04sT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssS0FBSyxDQUFDO1lBQzFELElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxLQUFLLENBQUM7WUFDcEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEtBQUssQ0FBQztZQUN6QixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssS0FBSyxDQUFDLENBQUM7SUFDOUQsQ0FBQztJQUVELG1DQUFtQztJQUNuQyxLQUFLO1FBQ0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztRQUMxQixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQzFCLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDdkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztRQUN2QixJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDeEIsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztRQUN0QixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO0lBQzFCLENBQUM7SUFFRCxpREFBaUQ7SUFDakQsV0FBVyxDQUFDLFdBQThCLEVBQUUsS0FBd0IsRUFBRSxRQUFpQjtRQUNuRixJQUFJLFdBQVcsRUFBRSxDQUFDO1lBQ2QsSUFBSSxDQUFDLFFBQVEsR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0YsQ0FBQztRQUVELElBQUksS0FBSyxFQUFFLENBQUM7WUFDUixJQUFJLENBQUMsS0FBSyxHQUFHLGdCQUFnQixDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlFLENBQUM7UUFFRCxJQUFJLFFBQVEsS0FBSyxTQUFTLEVBQUUsQ0FBQztZQUN6QixJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssSUFBSSxRQUFRLENBQUM7UUFDcEMsQ0FBQztJQUNMLENBQUM7Q0FDSjtBQUVEOzs7R0FHRztBQUNILE1BQU0sT0FBTyxzQkFBc0I7SUFDdkIsUUFBUSxHQUE2QixJQUFJLEdBQUcsRUFBRSxDQUFDO0lBQy9DLFFBQVEsQ0FBUztJQUV6QjtRQUNJLDJCQUEyQjtRQUMzQixJQUFJLENBQUMsUUFBUSxHQUFHLFlBQVksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRWxGLDRCQUE0QjtRQUM1QixVQUFVLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRTtZQUN2QyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUM7WUFDbkQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDO1FBQ3hELENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELDJDQUEyQztJQUMzQyxlQUFlLENBQUMsT0FBb0I7UUFDaEMsTUFBTSxJQUFJLEdBQUcsWUFBWSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNqQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbEMsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVELG1DQUFtQztJQUNuQyxtQkFBbUIsQ0FBQyxPQUFvQjtRQUNwQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN4QyxJQUFJLENBQUMsSUFBSTtZQUFFLE9BQU87UUFFbEIsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLHFCQUFxQixFQUFFLENBQUM7UUFDL0MsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDcEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDbkMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDakMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDdEMsQ0FBQztJQUVELDRDQUE0QztJQUM1QyxrQkFBa0IsQ0FBQyxLQUFlO1FBQzlCLE1BQU0sTUFBTSxHQUFrQixFQUFFLENBQUM7UUFDakMsS0FBSyxNQUFNLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUMxQyxJQUFJLGlCQUFpQixDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDdkMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN6QixDQUFDO1FBQ0wsQ0FBQztRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFFRCxnREFBZ0Q7SUFDaEQsMkJBQTJCLENBQUMsU0FBaUI7UUFDekMsTUFBTSxNQUFNLEdBQWtCLEVBQUUsQ0FBQztRQUNqQyxLQUFLLE1BQU0sQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQzFDLElBQUksY0FBYyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDeEMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN6QixDQUFDO1FBQ0wsQ0FBQztRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFFRCwrQkFBK0I7SUFDL0Isa0JBQWtCO1FBQ2QsT0FBTyxJQUFJLENBQUMsMkJBQTJCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFFRCxtREFBbUQ7SUFDbkQsMkJBQTJCLENBQUMsS0FBZTtRQUN2QyxJQUFJLFdBQVcsR0FBRyxRQUFRLENBQUM7UUFDM0IsS0FBSyxNQUFNLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUMxQyxNQUFNLFFBQVEsR0FBRyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDO1lBQ3hELFdBQVcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNsRCxDQUFDO1FBQ0QsT0FBTyxXQUFXLENBQUM7SUFDdkIsQ0FBQztJQUVELGdDQUFnQztJQUNoQyxtQkFBbUIsQ0FBQyxPQUFvQjtRQUNwQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN4QyxJQUFJLENBQUMsSUFBSTtZQUFFLE9BQU87UUFFbEIsb0NBQW9DO1FBQ3BDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFDOUQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3JELElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFDOUQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ3pELENBQUM7Q0FDSjtBQUVEOzs7R0FHRztBQUNILE1BQU0sT0FBTyx3QkFBd0I7SUFDekIsU0FBUyxDQUFNLENBQUMsK0JBQStCO0lBQy9DLGNBQWMsQ0FBeUI7SUFDdkMsZ0JBQWdCLEdBQXFCLElBQUksR0FBRyxFQUFFLENBQUM7SUFFdkQ7UUFDSSxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksc0JBQXNCLEVBQUUsQ0FBQztRQUNuRCwrREFBK0Q7SUFDbkUsQ0FBQztJQUVELDZDQUE2QztJQUM3QyxvQkFBb0IsQ0FBQyxhQUFxQjtRQUN0QyxNQUFNLG9CQUFvQixHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsMkJBQTJCLENBQUMsYUFBYSxDQUFDLENBQUM7UUFFNUYsMkJBQTJCO1FBQzNCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQ3JFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUU5QixvQkFBb0I7UUFDcEIsb0JBQW9CLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQzlCLEVBQUUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzdCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDbEMsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsNENBQTRDO0lBQzVDLGtCQUFrQjtRQUNkLElBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksS0FBSyxDQUFDO1lBQUUsT0FBTyxJQUFJLENBQUM7UUFFbEQsSUFBSSxLQUFLLEdBQWtCLElBQUksQ0FBQztRQUNoQyxLQUFLLE1BQU0sT0FBTyxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1lBQzFDLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ2pFLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNaLFFBQVEsRUFBRSxVQUFVLENBQ2hCLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUM5RCxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FDakU7Z0JBQ0QsSUFBSSxFQUFFLFVBQVUsQ0FDWixJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQzVDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7b0JBQzVELElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUNsRSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQzVDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7b0JBQzVELElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUNyRTthQUNKLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQztRQUNwQixDQUFDO1FBRUQsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUVELHVDQUF1QztJQUN2QyxhQUFhLENBQUMsTUFBZ0I7UUFDMUIsS0FBSyxNQUFNLE9BQU8sSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztZQUMxQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUMxRCxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7WUFDeEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1lBRXhDLHFCQUFxQjtZQUNyQixPQUFPLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxhQUFhLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLEtBQUssQ0FBQztRQUNsRyxDQUFDO0lBQ0wsQ0FBQztJQUVELGdDQUFnQztJQUNoQyxjQUFjLENBQUMsS0FBYTtRQUN4QixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUN6QyxJQUFJLENBQUMsTUFBTTtZQUFFLE9BQU87UUFFcEIsTUFBTSxNQUFNLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRWxDLEtBQUssTUFBTSxPQUFPLElBQUksSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7WUFDMUMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFMUQsZ0NBQWdDO1lBQ2hDLE1BQU0sUUFBUSxHQUFHLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUM1RCxNQUFNLGNBQWMsR0FBRyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDcEUsTUFBTSxTQUFTLEdBQUcsV0FBVyxDQUFDLE1BQU0sRUFBRSxjQUFjLENBQUMsQ0FBQztZQUV0RCwyQkFBMkI7WUFDM0IsTUFBTSxPQUFPLEdBQUcsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUM5RCxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1lBQ2hFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7WUFDaEUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1lBQ3BDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztZQUVwQyxxQkFBcUI7WUFDckIsT0FBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsYUFBYSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxLQUFLLENBQUM7WUFDOUYsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQztZQUMvQyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDO1FBQ3BELENBQUM7SUFDTCxDQUFDO0NBQ0o7QUFFRDs7O0dBR0c7QUFDSCxNQUFNLE9BQU8sb0JBQW9CO0lBQ3JCLE9BQU8sQ0FBYztJQUNyQixTQUFTLENBQU0sQ0FBQyw2QkFBNkI7SUFDN0MsUUFBUSxDQUFXO0lBQ25CLEtBQUssQ0FBVztJQUNoQixRQUFRLENBQStCO0lBQ3ZDLFFBQVEsQ0FBK0I7SUFDdkMsUUFBUSxDQUFTO0lBQ2pCLFNBQVMsQ0FBUztJQUUxQixZQUFZLE9BQW9CLEVBQUUsUUFBUSxHQUFHLElBQUk7UUFDN0MsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDdkIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDekIsSUFBSSxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxLQUFLLEdBQUcsVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM5QixJQUFJLENBQUMsUUFBUSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3QixJQUFJLENBQUMsUUFBUSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3QixJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztRQUVuQixpQ0FBaUM7UUFDakMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFFTyxTQUFTO1FBQ2IsMENBQTBDO1FBQzFDLDZDQUE2QztRQUM3Qyx5REFBeUQ7UUFDekQsK0NBQStDO1FBQy9DLG1DQUFtQztRQUNuQywwREFBMEQ7SUFDOUQsQ0FBQztJQUVELFNBQVMsQ0FBQyxTQUFtQixFQUFFLGNBQXdCLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsaUJBQXlCLENBQUM7UUFDL0YsTUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUN4RSxNQUFNLFVBQVUsR0FBRyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3BFLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDO1FBRTFDLElBQUksQ0FBQyxTQUFTLEdBQUcsV0FBVyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBRW5DLE1BQU0sT0FBTyxHQUFHLENBQUMsV0FBbUIsRUFBRSxFQUFFO1lBQ3BDLE1BQU0sT0FBTyxHQUFHLFdBQVcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1lBQzdDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFFM0QsbUNBQW1DO1lBQ25DLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztZQUVuRCx1QkFBdUI7WUFDdkIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUUxRSxvQkFBb0I7WUFDcEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzdFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFFbkYsdUJBQXVCO1lBQ3ZCLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxHQUFHLGFBQWEsR0FBRyxDQUFDLGNBQWMsR0FBRyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7WUFFM0UsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQztnQkFDMUIscUJBQXFCLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDbkMsQ0FBQztRQUNMLENBQUMsQ0FBQztRQUVGLHFCQUFxQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFFRCxtQkFBbUI7SUFDbkIsSUFBSTtRQUNBLE9BQU8sSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDekIsTUFBTSxhQUFhLEdBQUcsR0FBRyxFQUFFO2dCQUN2QixJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxJQUFJLENBQUMsRUFBRSxDQUFDO29CQUMzQixPQUFPLEVBQUUsQ0FBQztnQkFDZCxDQUFDO3FCQUFNLENBQUM7b0JBQ0oscUJBQXFCLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQ3pDLENBQUM7WUFDTCxDQUFDLENBQUM7WUFDRixhQUFhLEVBQUUsQ0FBQztRQUNwQixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7Q0FDSjtBQUVEOzs7R0FHRztBQUNILE1BQU0sT0FBTyxpQkFBaUI7SUFDbEIsU0FBUyxDQUFjO0lBQ3ZCLEtBQUssQ0FBZ0I7SUFDckIsVUFBVSxDQUErQjtJQUN6QyxPQUFPLENBQStCO0lBQ3RDLFFBQVEsQ0FBVztJQUUzQixZQUFZLFNBQXNCLEVBQUUsYUFBMkMsTUFBTTtRQUNqRixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMzQixJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztRQUM3QixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBa0IsQ0FBQztRQUM3RCxJQUFJLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUM3QixJQUFJLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFFckMsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7SUFDL0IsQ0FBQztJQUVPLG1CQUFtQjtRQUN2QixrQ0FBa0M7UUFDbEMsTUFBTSxhQUFhLEdBQUcsSUFBSSxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFOUQsdURBQXVEO1FBQ3ZELFFBQVEsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsYUFBYSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsR0FBRyxFQUFFO1lBQ3JFLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUN4QixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFTyxZQUFZO1FBQ2hCLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMscUJBQXFCLEVBQUUsQ0FBQztRQUU3RCxRQUFRLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUN0QixLQUFLLE1BQU07Z0JBQ1AsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUNyQyxNQUFNO1lBQ1YsS0FBSyxNQUFNO2dCQUNQLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFDckMsTUFBTTtZQUNWLEtBQUssVUFBVTtnQkFDWCxJQUFJLENBQUMsb0JBQW9CLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQ3pDLE1BQU07UUFDZCxDQUFDO0lBQ0wsQ0FBQztJQUVPLGdCQUFnQixDQUFDLGFBQXNCO1FBQzNDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxhQUFhLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ25ILE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFFakQsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7WUFDL0IsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUM7WUFDckMsTUFBTSxHQUFHLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQztZQUV6QixNQUFNLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM3RCxNQUFNLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUU3RCxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUM7WUFDakMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztZQUMzQixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDO1lBQzFCLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUM7WUFDaEQsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQztRQUNyRCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFTyxnQkFBZ0IsQ0FBQyxhQUFzQjtRQUMzQywyQ0FBMkM7UUFDM0MsTUFBTSxZQUFZLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztRQUNsRSxNQUFNLGNBQWMsR0FBRyxhQUFhLENBQUMsS0FBSyxHQUFHLFlBQVksQ0FBQztRQUMxRCxNQUFNLFNBQVMsR0FBRyxjQUFjLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7UUFFckQsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7WUFDL0IsTUFBTSxDQUFDLEdBQUcsS0FBSyxHQUFHLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7WUFFbkQsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDO1lBQ2pDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7WUFDM0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLEdBQUcsU0FBUyxJQUFJLENBQUM7WUFDcEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQztRQUNyRCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFTyxvQkFBb0IsQ0FBQyxhQUFzQjtRQUMvQyw2Q0FBNkM7UUFDN0MsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7WUFDL0IsdURBQXVEO1lBQ3ZELHNDQUFzQztZQUN0QyxNQUFNLEtBQUssR0FBRyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ3hELE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxhQUFhLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDO1lBQ3pFLE1BQU0sT0FBTyxHQUFHLGFBQWEsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1lBQ3hDLE1BQU0sT0FBTyxHQUFHLGFBQWEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1lBRXpDLE1BQU0sQ0FBQyxHQUFHLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1lBQ3pFLE1BQU0sQ0FBQyxHQUFHLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1lBRXpFLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQztZQUNqQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDO1lBQzNCLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7WUFDMUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQztZQUNoRCxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDO1FBQ3JELENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELDhCQUE4QjtJQUM5QixXQUFXLENBQUMsS0FBYSxFQUFFLE1BQWM7UUFDckMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUM5QixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDO1FBQy9CLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUN4QixDQUFDO0lBRUQsNEJBQTRCO0lBQzVCLFVBQVUsQ0FBQyxPQUFlO1FBQ3RCLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQztRQUM3Qiw0REFBNEQ7SUFDaEUsQ0FBQztJQUVELG9CQUFvQjtJQUNwQixPQUFPLENBQUMsSUFBaUI7UUFDckIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakMsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3hCLENBQUM7SUFFRCx5QkFBeUI7SUFDekIsVUFBVSxDQUFDLElBQWlCO1FBQ3hCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3ZDLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDYixJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDNUIsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2QsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3hCLENBQUM7SUFDTCxDQUFDO0NBQ0o7QUFFRDs7O0dBR0c7QUFDSCxNQUFNLE9BQU8sdUJBQXVCO0lBQ3hCLE9BQU8sQ0FBYztJQUNyQixNQUFNLENBQU0sQ0FBQywwQkFBMEI7SUFDdkMsV0FBVyxDQUFTO0lBQ3BCLFNBQVMsQ0FBUztJQUNsQixTQUFTLENBQU0sQ0FBQyw2QkFBNkI7SUFFckQsWUFBWSxPQUFvQixFQUFFLFdBQVcsR0FBRyxDQUFDLEVBQUUsU0FBUyxHQUFHLElBQUk7UUFDL0QsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDdkIsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7UUFDL0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFFM0Isc0NBQXNDO1FBQ3RDLDRDQUE0QztRQUM1QyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztJQUNoQyxDQUFDO0lBRU8sb0JBQW9CO1FBQ3hCLG9DQUFvQztRQUNwQyw4Q0FBOEM7UUFDOUMsK0JBQStCO1FBQy9CLGdDQUFnQztRQUNoQyw4QkFBOEI7UUFDOUIsNENBQTRDO1FBQzVDLHNDQUFzQztRQUN0QyxzREFBc0Q7UUFDdEQsTUFBTTtRQUNOLEVBQUU7UUFDRixpQkFBaUI7UUFDakIsK0RBQStEO0lBQ25FLENBQUM7SUFFRCxzQkFBc0I7SUFDdEIsY0FBYyxDQUFDLEtBQWEsRUFBRSxHQUFXO1FBQ3JDLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDO1FBQ3JCLG1EQUFtRDtJQUN2RCxDQUFDO0lBRUQsMkNBQTJDO0lBQzNDLFdBQVcsQ0FBQyxRQUFnQixFQUFFLFNBQWM7UUFDeEMseUNBQXlDO1FBQ3pDLDJDQUEyQztJQUMvQyxDQUFDO0NBQ0o7QUFFRCxvRUFBb0U7QUFDcEUsOEVBQThFIiwic291cmNlc0NvbnRlbnQiOlsiLy8gSW50ZWdyYXRpb24gZXhhbXBsZXMgc2hvd2luZyBob3cgcmVhY3RpdmUgbWF0aCBlbmhhbmNlcyBleGlzdGluZyBjb21wb25lbnRzXG5cbmltcG9ydCB7IG51bWJlclJlZiwgYWZmZWN0ZWQsIGNvbXB1dGVkIH0gZnJvbSBcImZlc3Qvb2JqZWN0XCI7XG5pbXBvcnQge1xuICAgIFZlY3RvcjJELCB2ZWN0b3IyUmVmLFxuICAgIGFkZFZlY3RvcjJELCBzdWJ0cmFjdFZlY3RvcjJELCBtdWx0aXBseVZlY3RvcjJELCBtYWduaXR1ZGUyRCwgZGl2aWRlVmVjdG9yMkQsXG4gICAgdHJhbnNsYXRlMkQsIHNjYWxlMkQsIHJvdGF0ZTJELFxuICAgIHZlY3RvckZyb21BcnJheSwgdmVjdG9yVG9BcnJheSxcbiAgICBvcGVyYXRlZCxcbiAgICBSZWN0MkQsIGNyZWF0ZVJlY3QyRCwgcmVjdENlbnRlciwgcmVjdENvbnRhaW5zUG9pbnQsIHJlY3RJbnRlcnNlY3RzLCByZWN0QXJlYSxcbiAgICBjbGFtcFBvaW50VG9SZWN0LCBwb2ludFRvUmVjdERpc3RhbmNlLCBjb25zdHJhaW5SZWN0QXNwZWN0UmF0aW8sXG4gICAgR3JpZENvb3JkVXRpbHMsIEdyaWRDZWxsVXRpbHMsIEdyaWRMYXlvdXRVdGlscywgR3JpZEFuaW1hdGlvblV0aWxzLCBHcmlkSW50ZXJhY3Rpb25VdGlscyxcbiAgICBHcmlkQ29vcmQsIEdyaWRDZWxsLCBHcmlkQ29uZmlnXG59IGZyb20gXCIuLi9zcmMvbWF0aC9pbmRleFwiO1xuaW1wb3J0IHsgUmVhY3RpdmVFbGVtZW50U2l6ZSB9IGZyb20gXCIuLi9zcmMvZXh0ZW5zaW9uL2Nzcy1yZWYvVXRpbHNcIjtcblxuLyoqXG4gKiBFeGFtcGxlIDE6IEVuaGFuY2VkIERyYWdnYWJsZSB3aXRoIHJlYWN0aXZlIHZlY3RvciBtYXRoXG4gKiBJbXByb3ZlcyB1cG9uIHRoZSBleGlzdGluZyBEcmFnSGFuZGxlciBpbiBjb250cm9sbGVycy9EcmFnZ2FibGUudHNcbiAqL1xuZXhwb3J0IGNsYXNzIFJlYWN0aXZlRHJhZ2dhYmxlIHtcbiAgICBwcml2YXRlIHBvc2l0aW9uOiBWZWN0b3IyRDtcbiAgICBwcml2YXRlIHZlbG9jaXR5OiBWZWN0b3IyRDtcbiAgICBwcml2YXRlIGFjY2VsZXJhdGlvbjogVmVjdG9yMkQ7XG5cbiAgICBjb25zdHJ1Y3Rvcihpbml0aWFsWCA9IDAsIGluaXRpYWxZID0gMCkge1xuICAgICAgICB0aGlzLnBvc2l0aW9uID0gdmVjdG9yMlJlZihpbml0aWFsWCwgaW5pdGlhbFkpO1xuICAgICAgICB0aGlzLnZlbG9jaXR5ID0gdmVjdG9yMlJlZigwLCAwKTtcbiAgICAgICAgdGhpcy5hY2NlbGVyYXRpb24gPSB2ZWN0b3IyUmVmKDAsIDApO1xuICAgIH1cblxuICAgIC8vIFBoeXNpY3MtYmFzZWQgbW92ZW1lbnQgd2l0aCByZWFjdGl2ZSBtYXRoXG4gICAgdXBkYXRlKGRlbHRhVGltZTogbnVtYmVyKSB7XG4gICAgICAgIC8vIHZlbG9jaXR5ICs9IGFjY2VsZXJhdGlvbiAqIGRlbHRhVGltZVxuICAgICAgICBjb25zdCBkZWx0YVZlbCA9IG11bHRpcGx5VmVjdG9yMkQodGhpcy5hY2NlbGVyYXRpb24sIG51bWJlclJlZihkZWx0YVRpbWUpKTtcbiAgICAgICAgdGhpcy52ZWxvY2l0eSA9IGFkZFZlY3RvcjJEKHRoaXMudmVsb2NpdHksIGRlbHRhVmVsKTtcblxuICAgICAgICAvLyBwb3NpdGlvbiArPSB2ZWxvY2l0eSAqIGRlbHRhVGltZVxuICAgICAgICBjb25zdCBkZWx0YVBvcyA9IG11bHRpcGx5VmVjdG9yMkQodGhpcy52ZWxvY2l0eSwgbnVtYmVyUmVmKGRlbHRhVGltZSkpO1xuICAgICAgICB0aGlzLnBvc2l0aW9uID0gYWRkVmVjdG9yMkQodGhpcy5wb3NpdGlvbiwgZGVsdGFQb3MpO1xuICAgIH1cblxuICAgIC8vIEFwcGx5IGZvcmNlcyByZWFjdGl2ZWx5XG4gICAgYXBwbHlGb3JjZShmb3JjZTogVmVjdG9yMkQpIHtcbiAgICAgICAgdGhpcy5hY2NlbGVyYXRpb24gPSBhZGRWZWN0b3IyRCh0aGlzLmFjY2VsZXJhdGlvbiwgZm9yY2UpO1xuICAgIH1cblxuICAgIC8vIEdldCBjdXJyZW50IHBvc2l0aW9uIGFzIGFycmF5IChjb21wYXRpYmxlIHdpdGggZXhpc3RpbmcgRE9NIEFQSXMpXG4gICAgZ2V0UG9zaXRpb24oKSB7XG4gICAgICAgIHJldHVybiBbdGhpcy5wb3NpdGlvbi54LnZhbHVlLCB0aGlzLnBvc2l0aW9uLnkudmFsdWVdO1xuICAgIH1cbn1cblxuLyoqXG4gKiBFeGFtcGxlIDI6IEVuaGFuY2VkIEJCb3hBbmNob3Igd2l0aCByZWFjdGl2ZSB2ZWN0b3Igb3BlcmF0aW9uc1xuICogSW1wcm92ZXMgdXBvbiBleHRlbnNpb24vc3BhY2UtcmVmL0JCb3hBbmNob3IudHNcbiAqL1xuZXhwb3J0IGNsYXNzIFJlYWN0aXZlQm91bmRpbmdCb3gge1xuICAgIHByaXZhdGUgdG9wTGVmdDogVmVjdG9yMkQ7XG4gICAgcHJpdmF0ZSBzaXplOiBWZWN0b3IyRDtcbiAgICBwcml2YXRlIGNlbnRlcjogVmVjdG9yMkQ7XG4gICAgcHJpdmF0ZSBjb3JuZXJzOiBWZWN0b3IyRFtdO1xuXG4gICAgY29uc3RydWN0b3IoZWxlbWVudDogSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgLy8gQ3JlYXRlIHJlYWN0aXZlIHZlY3RvcnMgZnJvbSBlbGVtZW50IGJvdW5kc1xuICAgICAgICB0aGlzLnRvcExlZnQgPSB2ZWN0b3IyUmVmKDAsIDApO1xuICAgICAgICB0aGlzLnNpemUgPSB2ZWN0b3IyUmVmKDAsIDApO1xuXG4gICAgICAgIC8vIENvbXB1dGVkIHJlYWN0aXZlIGNlbnRlciBwb2ludFxuICAgICAgICB0aGlzLmNlbnRlciA9IGFkZFZlY3RvcjJEKFxuICAgICAgICAgICAgdGhpcy50b3BMZWZ0LFxuICAgICAgICAgICAgbXVsdGlwbHlWZWN0b3IyRCh0aGlzLnNpemUsIG51bWJlclJlZigwLjUpKVxuICAgICAgICApO1xuXG4gICAgICAgIC8vIENvbXB1dGVkIHJlYWN0aXZlIGNvcm5lcnNcbiAgICAgICAgdGhpcy5jb3JuZXJzID0gW1xuICAgICAgICAgICAgdGhpcy50b3BMZWZ0LCAvLyB0b3AtbGVmdFxuICAgICAgICAgICAgYWRkVmVjdG9yMkQodGhpcy50b3BMZWZ0LCBuZXcgVmVjdG9yMkQodGhpcy5zaXplLngsIG51bWJlclJlZigwKSkpLCAvLyB0b3AtcmlnaHRcbiAgICAgICAgICAgIGFkZFZlY3RvcjJEKHRoaXMudG9wTGVmdCwgdGhpcy5zaXplKSwgLy8gYm90dG9tLXJpZ2h0XG4gICAgICAgICAgICBhZGRWZWN0b3IyRCh0aGlzLnRvcExlZnQsIG5ldyBWZWN0b3IyRChudW1iZXJSZWYoMCksIHRoaXMuc2l6ZS55KSkgIC8vIGJvdHRvbS1sZWZ0XG4gICAgICAgIF07XG5cbiAgICAgICAgdGhpcy51cGRhdGVCb3VuZHMoZWxlbWVudCk7XG4gICAgfVxuXG4gICAgdXBkYXRlQm91bmRzKGVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG4gICAgICAgIGNvbnN0IHJlY3QgPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICB0aGlzLnRvcExlZnQueC52YWx1ZSA9IHJlY3QubGVmdDtcbiAgICAgICAgdGhpcy50b3BMZWZ0LnkudmFsdWUgPSByZWN0LnRvcDtcbiAgICAgICAgdGhpcy5zaXplLngudmFsdWUgPSByZWN0LndpZHRoO1xuICAgICAgICB0aGlzLnNpemUueS52YWx1ZSA9IHJlY3QuaGVpZ2h0O1xuICAgIH1cblxuICAgIC8vIFJlYWN0aXZlIGNvbGxpc2lvbiBkZXRlY3Rpb25cbiAgICBjb250YWlucyhwb2ludDogVmVjdG9yMkQpIHtcbiAgICAgICAgY29uc3QgaW5YID0gb3BlcmF0ZWQoW3BvaW50LngsIHRoaXMudG9wTGVmdC54LCB0aGlzLnNpemUueF0sICgpID0+XG4gICAgICAgICAgICBwb2ludC54LnZhbHVlID49IHRoaXMudG9wTGVmdC54LnZhbHVlICYmXG4gICAgICAgICAgICBwb2ludC54LnZhbHVlIDw9IHRoaXMudG9wTGVmdC54LnZhbHVlICsgdGhpcy5zaXplLngudmFsdWVcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgaW5ZID0gb3BlcmF0ZWQoW3BvaW50LnksIHRoaXMudG9wTGVmdC55LCB0aGlzLnNpemUueV0sICgpID0+XG4gICAgICAgICAgICBwb2ludC55LnZhbHVlID49IHRoaXMudG9wTGVmdC55LnZhbHVlICYmXG4gICAgICAgICAgICBwb2ludC55LnZhbHVlIDw9IHRoaXMudG9wTGVmdC55LnZhbHVlICsgdGhpcy5zaXplLnkudmFsdWVcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIG9wZXJhdGVkKFtpblgsIGluWV0sICgpID0+IGluWC52YWx1ZSAmJiBpblkudmFsdWUpO1xuICAgIH1cblxuICAgIC8vIEdldCBib3VuZHMgYXMgYXJyYXkgKGNvbXBhdGlibGUgd2l0aCBleGlzdGluZyBBUElzKVxuICAgIGdldEJvdW5kcygpIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIHRoaXMudG9wTGVmdC54LnZhbHVlLCB0aGlzLnRvcExlZnQueS52YWx1ZSwgLy8geCwgeVxuICAgICAgICAgICAgdGhpcy5zaXplLngudmFsdWUsIHRoaXMuc2l6ZS55LnZhbHVlICAgICAgICAvLyB3aWR0aCwgaGVpZ2h0XG4gICAgICAgIF07XG4gICAgfVxufVxuXG4vKipcbiAqIEV4YW1wbGUgMzogRW5oYW5jZWQgR3JpZCBMYXlvdXQgd2l0aCBtYXRyaXggdHJhbnNmb3JtYXRpb25zXG4gKiBJbXByb3ZlcyB1cG9uIGxheW91dC9ncmlkL0ludGVyYWN0LnRzXG4gKi9cbmV4cG9ydCBjbGFzcyBSZWFjdGl2ZUdyaWRUcmFuc2Zvcm0ge1xuICAgIHByaXZhdGUgcG9zaXRpb246IFZlY3RvcjJEO1xuICAgIHByaXZhdGUgc2NhbGU6IFZlY3RvcjJEO1xuICAgIHByaXZhdGUgcm90YXRpb246IFJldHVyblR5cGU8dHlwZW9mIG51bWJlclJlZj47XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHZlY3RvcjJSZWYoMCwgMCk7XG4gICAgICAgIHRoaXMuc2NhbGUgPSB2ZWN0b3IyUmVmKDEsIDEpO1xuICAgICAgICB0aGlzLnJvdGF0aW9uID0gbnVtYmVyUmVmKDApO1xuICAgIH1cblxuICAgIC8vIEFwcGx5IHRyYW5zZm9ybWF0aW9uIG1hdHJpeCB0byBhIHBvaW50XG4gICAgdHJhbnNmb3JtUG9pbnQocG9pbnQ6IFZlY3RvcjJEKTogVmVjdG9yMkQge1xuICAgICAgICAvLyBTY2FsZSAtPiBSb3RhdGUgLT4gVHJhbnNsYXRlXG4gICAgICAgIGxldCByZXN1bHQgPSBzY2FsZTJEKHBvaW50LCB0aGlzLnNjYWxlLngsIHRoaXMuc2NhbGUueSk7XG4gICAgICAgIHJlc3VsdCA9IHJvdGF0ZTJEKHJlc3VsdCwgdGhpcy5yb3RhdGlvbik7XG4gICAgICAgIHJlc3VsdCA9IHRyYW5zbGF0ZTJEKHJlc3VsdCwgdGhpcy5wb3NpdGlvbi54LCB0aGlzLnBvc2l0aW9uLnkpO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8vIENvbnZlcnQgZ3JpZCBjb29yZGluYXRlcyB0byBzY3JlZW4gY29vcmRpbmF0ZXNcbiAgICBncmlkVG9TY3JlZW4oZ3JpZFg6IG51bWJlciwgZ3JpZFk6IG51bWJlciwgY2VsbFNpemU6IG51bWJlcik6IFZlY3RvcjJEIHtcbiAgICAgICAgY29uc3QgZ3JpZFBvaW50ID0gdmVjdG9yMlJlZihncmlkWCAqIGNlbGxTaXplLCBncmlkWSAqIGNlbGxTaXplKTtcbiAgICAgICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtUG9pbnQoZ3JpZFBvaW50KTtcbiAgICB9XG5cbiAgICAvLyBDb252ZXJ0IHNjcmVlbiBjb29yZGluYXRlcyB0byBncmlkIGNvb3JkaW5hdGVzXG4gICAgc2NyZWVuVG9HcmlkKHNjcmVlblg6IG51bWJlciwgc2NyZWVuWTogbnVtYmVyLCBjZWxsU2l6ZTogbnVtYmVyKTogVmVjdG9yMkQge1xuICAgICAgICAvLyBJbnZlcnNlIHRyYW5zZm9ybWF0aW9uOiBUcmFuc2xhdGUgLT4gUm90YXRlIC0+IFNjYWxlXG4gICAgICAgIGNvbnN0IHNjcmVlblBvaW50ID0gdmVjdG9yMlJlZihzY3JlZW5YLCBzY3JlZW5ZKTtcbiAgICAgICAgbGV0IHJlc3VsdCA9IHRyYW5zbGF0ZTJEKHNjcmVlblBvaW50LCBvcGVyYXRlZChbdGhpcy5wb3NpdGlvbi54XSwgKCkgPT4gLXRoaXMucG9zaXRpb24ueC52YWx1ZSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0ZWQoW3RoaXMucG9zaXRpb24ueV0sICgpID0+IC10aGlzLnBvc2l0aW9uLnkudmFsdWUpKTtcbiAgICAgICAgcmVzdWx0ID0gcm90YXRlMkQocmVzdWx0LCBvcGVyYXRlZChbdGhpcy5yb3RhdGlvbl0sICgpID0+IC10aGlzLnJvdGF0aW9uLnZhbHVlKSk7XG4gICAgICAgIHJlc3VsdCA9IHNjYWxlMkQocmVzdWx0LCBvcGVyYXRlZChbdGhpcy5zY2FsZS54XSwgKCkgPT4gMS90aGlzLnNjYWxlLngudmFsdWUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGVkKFt0aGlzLnNjYWxlLnldLCAoKSA9PiAxL3RoaXMuc2NhbGUueS52YWx1ZSkpO1xuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjJEKFxuICAgICAgICAgICAgb3BlcmF0ZWQoW3Jlc3VsdC54XSwgKCkgPT4gcmVzdWx0LngudmFsdWUgLyBjZWxsU2l6ZSksXG4gICAgICAgICAgICBvcGVyYXRlZChbcmVzdWx0LnldLCAoKSA9PiByZXN1bHQueS52YWx1ZSAvIGNlbGxTaXplKVxuICAgICAgICApO1xuICAgIH1cbn1cblxuLyoqXG4gKiBFeGFtcGxlIDQ6IEVuaGFuY2VkIFBvaW50ZXIgQVBJIHdpdGggcmVhY3RpdmUgdmVjdG9yc1xuICogSW1wcm92ZXMgdXBvbiBleHRlbnNpb24vY29udHJvbGxlcnMvUG9pbnRlckFQSS50c1xuICovXG5leHBvcnQgY2xhc3MgUmVhY3RpdmVQb2ludGVyIHtcbiAgICBwcml2YXRlIHBvc2l0aW9uOiBWZWN0b3IyRDtcbiAgICBwcml2YXRlIGRlbHRhOiBWZWN0b3IyRDtcbiAgICBwcml2YXRlIHZlbG9jaXR5OiBWZWN0b3IyRDtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnBvc2l0aW9uID0gdmVjdG9yMlJlZigwLCAwKTtcbiAgICAgICAgdGhpcy5kZWx0YSA9IHZlY3RvcjJSZWYoMCwgMCk7XG4gICAgICAgIHRoaXMudmVsb2NpdHkgPSB2ZWN0b3IyUmVmKDAsIDApO1xuICAgIH1cblxuICAgIHVwZGF0ZVBvc2l0aW9uKGNsaWVudFg6IG51bWJlciwgY2xpZW50WTogbnVtYmVyLCBkZWx0YVRpbWU6IG51bWJlciA9IDEpIHtcbiAgICAgICAgY29uc3QgbmV3UG9zaXRpb24gPSB2ZWN0b3IyUmVmKGNsaWVudFgsIGNsaWVudFkpO1xuXG4gICAgICAgIC8vIENhbGN1bGF0ZSBkZWx0YSBtb3ZlbWVudFxuICAgICAgICB0aGlzLmRlbHRhID0gc3VidHJhY3RWZWN0b3IyRChuZXdQb3NpdGlvbiwgdGhpcy5wb3NpdGlvbik7XG5cbiAgICAgICAgLy8gQ2FsY3VsYXRlIHZlbG9jaXR5IChkZWx0YSAvIHRpbWUpXG4gICAgICAgIHRoaXMudmVsb2NpdHkgPSBtdWx0aXBseVZlY3RvcjJEKHRoaXMuZGVsdGEsIG51bWJlclJlZigxIC8gZGVsdGFUaW1lKSk7XG5cbiAgICAgICAgLy8gVXBkYXRlIHBvc2l0aW9uXG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBuZXdQb3NpdGlvbjtcbiAgICB9XG5cbiAgICAvLyBHZXQgZGlzdGFuY2UgZnJvbSBhbm90aGVyIHBvaW50XG4gICAgZGlzdGFuY2VUbyhvdGhlcjogVmVjdG9yMkQpIHtcbiAgICAgICAgY29uc3QgZGlmZiA9IHN1YnRyYWN0VmVjdG9yMkQodGhpcy5wb3NpdGlvbiwgb3RoZXIpO1xuICAgICAgICByZXR1cm4gbWFnbml0dWRlMkQoZGlmZik7XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgaWYgcG9pbnRlciBpcyB3aXRoaW4gYSByZWFjdGl2ZSBib3VuZGluZyBib3hcbiAgICBpc1dpdGhpbihib3VuZHM6IFJlYWN0aXZlQm91bmRpbmdCb3gpIHtcbiAgICAgICAgcmV0dXJuIGJvdW5kcy5jb250YWlucyh0aGlzLnBvc2l0aW9uKTtcbiAgICB9XG5cbiAgICAvLyBHZXQgcG9zaXRpb24gYXMgYXJyYXkgZm9yIERPTSBBUElzXG4gICAgZ2V0UG9zaXRpb24oKSB7XG4gICAgICAgIHJldHVybiBbdGhpcy5wb3NpdGlvbi54LnZhbHVlLCB0aGlzLnBvc2l0aW9uLnkudmFsdWVdO1xuICAgIH1cbn1cblxuLyoqXG4gKiBFbmhhbmNlZCBQb2ludGVyIEFQSSB3aXRoIHJlYWN0aXZlIHZlY3RvcnNcbiAqIEltcHJvdmVzIHVwb24gZXh0ZW5zaW9uL2NvbnRyb2xsZXJzL1BvaW50ZXJBUEkudHNcbiAqL1xuZXhwb3J0IGNsYXNzIFJlYWN0aXZlUG9pbnRlckFQSSB7XG4gICAgcHJpdmF0ZSBwb2ludGVyczogTWFwPG51bWJlciwgUmVhY3RpdmVQb2ludGVyPiA9IG5ldyBNYXAoKTtcblxuICAgIC8vIEVuaGFuY2VkIGNvb3JkaW5hdGUgY29udmVyc2lvbiB3aXRoIHJlYWN0aXZlIG1hdGhcbiAgICBzdGF0aWMgY2xpZW50VG9PcmllbnQoY2xpZW50WDogbnVtYmVyLCBjbGllbnRZOiBudW1iZXIsIGVsZW1lbnQ6IEhUTUxFbGVtZW50KTogVmVjdG9yMkQge1xuICAgICAgICBjb25zdCByZWN0ID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgY29uc3QgZWxlbWVudFNpemUgPSB2ZWN0b3IyUmVmKHJlY3Qud2lkdGgsIHJlY3QuaGVpZ2h0KTtcblxuICAgICAgICAvLyBDb252ZXJ0IGNsaWVudCBjb29yZGluYXRlcyB0byBlbGVtZW50LXJlbGF0aXZlIGNvb3JkaW5hdGVzXG4gICAgICAgIGNvbnN0IHJlbGF0aXZlWCA9IG9wZXJhdGVkKFtudW1iZXJSZWYoY2xpZW50WCksIG51bWJlclJlZihyZWN0LmxlZnQpXSwgKGN4LCBsZWZ0KSA9PiBjeC52YWx1ZSAtIGxlZnQudmFsdWUpO1xuICAgICAgICBjb25zdCByZWxhdGl2ZVkgPSBvcGVyYXRlZChbbnVtYmVyUmVmKGNsaWVudFkpLCBudW1iZXJSZWYocmVjdC50b3ApXSwgKGN5LCB0b3ApID0+IGN5LnZhbHVlIC0gdG9wLnZhbHVlKTtcblxuICAgICAgICAvLyBOb3JtYWxpemUgdG8gMC0xIHJhbmdlXG4gICAgICAgIGNvbnN0IG5vcm1hbGl6ZWRYID0gb3BlcmF0ZWQoW3JlbGF0aXZlWCwgbnVtYmVyUmVmKHJlY3Qud2lkdGgpXSwgKHJ4LCB3KSA9PiByeC52YWx1ZSAvIHcudmFsdWUpO1xuICAgICAgICBjb25zdCBub3JtYWxpemVkWSA9IG9wZXJhdGVkKFtyZWxhdGl2ZVksIG51bWJlclJlZihyZWN0LmhlaWdodCldLCAocnksIGgpID0+IHJ5LnZhbHVlIC8gaC52YWx1ZSk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyRChub3JtYWxpemVkWCwgbm9ybWFsaXplZFkpO1xuICAgIH1cblxuICAgIC8vIEVuaGFuY2VkIG1vdmVtZW50IHRyYWNraW5nXG4gICAgdHJhY2tQb2ludGVyKHBvaW50ZXJJZDogbnVtYmVyLCBjbGllbnRYOiBudW1iZXIsIGNsaWVudFk6IG51bWJlcik6IFJlYWN0aXZlUG9pbnRlciB7XG4gICAgICAgIGxldCBwb2ludGVyID0gdGhpcy5wb2ludGVycy5nZXQocG9pbnRlcklkKTtcbiAgICAgICAgaWYgKCFwb2ludGVyKSB7XG4gICAgICAgICAgICBwb2ludGVyID0gbmV3IFJlYWN0aXZlUG9pbnRlcigpO1xuICAgICAgICAgICAgdGhpcy5wb2ludGVycy5zZXQocG9pbnRlcklkLCBwb2ludGVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHBvaW50ZXIudXBkYXRlUG9zaXRpb24oY2xpZW50WCwgY2xpZW50WSwgMS82MCk7IC8vIDYwZnBzXG4gICAgICAgIHJldHVybiBwb2ludGVyO1xuICAgIH1cblxuICAgIC8vIFJlYWN0aXZlIGNvbGxpc2lvbiBkZXRlY3Rpb24gYmV0d2VlbiBwb2ludGVycyBhbmQgZWxlbWVudHNcbiAgICBpc1BvaW50ZXJPdmVyRWxlbWVudChwb2ludGVySWQ6IG51bWJlciwgZWxlbWVudDogSFRNTEVsZW1lbnQpOiBSZXR1cm5UeXBlPHR5cGVvZiBudW1iZXJSZWY+IHtcbiAgICAgICAgY29uc3QgcG9pbnRlciA9IHRoaXMucG9pbnRlcnMuZ2V0KHBvaW50ZXJJZCk7XG4gICAgICAgIGlmICghcG9pbnRlcikgcmV0dXJuIG51bWJlclJlZigwKTtcblxuICAgICAgICBjb25zdCBiYm94ID0gbmV3IFJlYWN0aXZlQm91bmRpbmdCb3goZWxlbWVudCk7XG4gICAgICAgIGNvbnN0IHBvaW50ZXJQb3MgPSB2ZWN0b3IyUmVmKC4uLnBvaW50ZXIuZ2V0UG9zaXRpb24oKSk7XG4gICAgICAgIHJldHVybiBiYm94LmNvbnRhaW5zKHBvaW50ZXJQb3MpO1xuICAgIH1cblxuICAgIC8vIE11bHRpLXBvaW50ZXIgZ2VzdHVyZSByZWNvZ25pdGlvblxuICAgIGdldFBpbmNoRGlzdGFuY2UocG9pbnRlcklkMTogbnVtYmVyLCBwb2ludGVySWQyOiBudW1iZXIpOiBSZXR1cm5UeXBlPHR5cGVvZiBudW1iZXJSZWY+IHtcbiAgICAgICAgY29uc3QgcDEgPSB0aGlzLnBvaW50ZXJzLmdldChwb2ludGVySWQxKTtcbiAgICAgICAgY29uc3QgcDIgPSB0aGlzLnBvaW50ZXJzLmdldChwb2ludGVySWQyKTtcblxuICAgICAgICBpZiAoIXAxIHx8ICFwMikgcmV0dXJuIG51bWJlclJlZigwKTtcblxuICAgICAgICBjb25zdCBwb3MxID0gdmVjdG9yMlJlZiguLi5wMS5nZXRQb3NpdGlvbigpKTtcbiAgICAgICAgY29uc3QgcG9zMiA9IHZlY3RvcjJSZWYoLi4ucDIuZ2V0UG9zaXRpb24oKSk7XG4gICAgICAgIHJldHVybiBtYWduaXR1ZGUyRChzdWJ0cmFjdFZlY3RvcjJEKHBvczEsIHBvczIpKTtcbiAgICB9XG59XG5cbi8qKlxuICogRW5oYW5jZWQgRHJhZ2dhYmxlIHdpdGggcGh5c2ljcyBhbmQgcmVhY3RpdmUgbWF0aFxuICogSW1wcm92ZXMgdXBvbiBleHRlbnNpb24vY29udHJvbGxlcnMvRHJhZ2dhYmxlLnRzXG4gKi9cbmV4cG9ydCBjbGFzcyBSZWFjdGl2ZURyYWdnYWJsZUVuaGFuY2VkIHtcbiAgICBwcml2YXRlIGhvbGRlcjogSFRNTEVsZW1lbnQ7XG4gICAgcHJpdmF0ZSByZWFjdGl2ZVBvc2l0aW9uOiBWZWN0b3IyRDtcbiAgICBwcml2YXRlIHZlbG9jaXR5OiBWZWN0b3IyRDtcbiAgICBwcml2YXRlIGFjY2VsZXJhdGlvbjogVmVjdG9yMkQ7XG4gICAgcHJpdmF0ZSBmcmljdGlvbjogUmV0dXJuVHlwZTx0eXBlb2YgbnVtYmVyUmVmPjtcbiAgICBwcml2YXRlIHNwcmluZzogeyBzdGlmZm5lc3M6IFJldHVyblR5cGU8dHlwZW9mIG51bWJlclJlZj4sIGRhbXBpbmc6IFJldHVyblR5cGU8dHlwZW9mIG51bWJlclJlZj4gfTtcbiAgICBwcml2YXRlIGRyYWdIYW5kbGVyOiBhbnk7IC8vIFdvdWxkIGJlIERyYWdIYW5kbGVyIGluc3RhbmNlXG5cbiAgICBjb25zdHJ1Y3Rvcihob2xkZXI6IEhUTUxFbGVtZW50LCBvcHRpb25zOiB7XG4gICAgICAgIGZyaWN0aW9uPzogbnVtYmVyO1xuICAgICAgICBzcHJpbmc/OiB7IHN0aWZmbmVzczogbnVtYmVyOyBkYW1waW5nOiBudW1iZXIgfTtcbiAgICB9ID0ge30pIHtcbiAgICAgICAgdGhpcy5ob2xkZXIgPSBob2xkZXI7XG5cbiAgICAgICAgLy8gSW5pdGlhbGl6ZSByZWFjdGl2ZSB2ZWN0b3JzXG4gICAgICAgIHRoaXMucmVhY3RpdmVQb3NpdGlvbiA9IHZlY3RvcjJSZWYoMCwgMCk7XG4gICAgICAgIHRoaXMudmVsb2NpdHkgPSB2ZWN0b3IyUmVmKDAsIDApO1xuICAgICAgICB0aGlzLmFjY2VsZXJhdGlvbiA9IHZlY3RvcjJSZWYoMCwgMCk7XG5cbiAgICAgICAgLy8gUGh5c2ljcyBwYXJhbWV0ZXJzXG4gICAgICAgIHRoaXMuZnJpY3Rpb24gPSBudW1iZXJSZWYob3B0aW9ucy5mcmljdGlvbiB8fCAwLjk1KTtcbiAgICAgICAgdGhpcy5zcHJpbmcgPSB7XG4gICAgICAgICAgICBzdGlmZm5lc3M6IG51bWJlclJlZihvcHRpb25zLnNwcmluZz8uc3RpZmZuZXNzIHx8IDAuMSksXG4gICAgICAgICAgICBkYW1waW5nOiBudW1iZXJSZWYob3B0aW9ucy5zcHJpbmc/LmRhbXBpbmcgfHwgMC44KVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vIFBoeXNpY3MtYmFzZWQgdXBkYXRlc1xuICAgIHVwZGF0ZVBoeXNpY3MoZGVsdGFUaW1lOiBudW1iZXIgPSAxLzYwKSB7XG4gICAgICAgIC8vIEFwcGx5IGZyaWN0aW9uIHRvIHZlbG9jaXR5XG4gICAgICAgIHRoaXMudmVsb2NpdHkgPSBtdWx0aXBseVZlY3RvcjJEKHRoaXMudmVsb2NpdHksIHRoaXMuZnJpY3Rpb24pO1xuXG4gICAgICAgIC8vIFVwZGF0ZSBwb3NpdGlvbiBiYXNlZCBvbiB2ZWxvY2l0eVxuICAgICAgICBjb25zdCBkZWx0YVBvcyA9IG11bHRpcGx5VmVjdG9yMkQodGhpcy52ZWxvY2l0eSwgbnVtYmVyUmVmKGRlbHRhVGltZSkpO1xuICAgICAgICB0aGlzLnJlYWN0aXZlUG9zaXRpb24gPSBhZGRWZWN0b3IyRCh0aGlzLnJlYWN0aXZlUG9zaXRpb24sIGRlbHRhUG9zKTtcblxuICAgICAgICAvLyBBcHBseSBzcHJpbmcgZm9yY2VzIGlmIG5lYXIgdGFyZ2V0XG4gICAgICAgIHRoaXMuYXBwbHlTcHJpbmdGb3JjZXMoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFwcGx5U3ByaW5nRm9yY2VzKCkge1xuICAgICAgICAvLyBTcHJpbmcgYmFjayB0byBvcmlnaW4gd2hlbiByZWxlYXNlZFxuICAgICAgICBjb25zdCBzcHJpbmdGb3JjZSA9IG11bHRpcGx5VmVjdG9yMkQodGhpcy5yZWFjdGl2ZVBvc2l0aW9uLCBvcGVyYXRlZChbdGhpcy5zcHJpbmcuc3RpZmZuZXNzXSwgKHMpID0+IC1zLnZhbHVlKSk7XG4gICAgICAgIGNvbnN0IGRhbXBpbmdGb3JjZSA9IG11bHRpcGx5VmVjdG9yMkQodGhpcy52ZWxvY2l0eSwgb3BlcmF0ZWQoW3RoaXMuc3ByaW5nLmRhbXBpbmddLCAoZCkgPT4gLWQudmFsdWUpKTtcblxuICAgICAgICB0aGlzLmFjY2VsZXJhdGlvbiA9IGFkZFZlY3RvcjJEKHNwcmluZ0ZvcmNlLCBkYW1waW5nRm9yY2UpO1xuICAgICAgICB0aGlzLnZlbG9jaXR5ID0gYWRkVmVjdG9yMkQodGhpcy52ZWxvY2l0eSwgbXVsdGlwbHlWZWN0b3IyRCh0aGlzLmFjY2VsZXJhdGlvbiwgbnVtYmVyUmVmKDEvNjApKSk7XG4gICAgfVxuXG4gICAgLy8gQXBwbHkgZXh0ZXJuYWwgZm9yY2VzIChsaWtlIG1vdXNlIGRyYWcpXG4gICAgYXBwbHlGb3JjZShmb3JjZTogVmVjdG9yMkQpIHtcbiAgICAgICAgdGhpcy52ZWxvY2l0eSA9IGFkZFZlY3RvcjJEKHRoaXMudmVsb2NpdHksIGZvcmNlKTtcbiAgICB9XG5cbiAgICAvLyBHZXQgY3VycmVudCBwb3NpdGlvbiBmb3IgRE9NIHVwZGF0ZXNcbiAgICBnZXRQb3NpdGlvbkZvckRPTSgpIHtcbiAgICAgICAgcmV0dXJuIFt0aGlzLnJlYWN0aXZlUG9zaXRpb24ueC52YWx1ZSwgdGhpcy5yZWFjdGl2ZVBvc2l0aW9uLnkudmFsdWVdO1xuICAgIH1cblxuICAgIC8vIENoZWNrIGlmIG1vdmVtZW50IGhhcyBzZXR0bGVkXG4gICAgaXNBdFJlc3QodGhyZXNob2xkOiBudW1iZXIgPSAwLjEpOiBib29sZWFuIHtcbiAgICAgICAgY29uc3Qgc3BlZWQgPSBtYWduaXR1ZGUyRCh0aGlzLnZlbG9jaXR5KS52YWx1ZTtcbiAgICAgICAgY29uc3QgZGlzdGFuY2UgPSBtYWduaXR1ZGUyRCh0aGlzLnJlYWN0aXZlUG9zaXRpb24pLnZhbHVlO1xuICAgICAgICByZXR1cm4gc3BlZWQgPCB0aHJlc2hvbGQgJiYgZGlzdGFuY2UgPCB0aHJlc2hvbGQ7XG4gICAgfVxuXG4gICAgLy8gRW5oYW5jZWQgZHJhZyBlbmQgd2l0aCBwaHlzaWNzIHNldHRsaW5nXG4gICAgZW5oYW5jZWREcmFnRW5kKCkge1xuICAgICAgICAvLyBTdGFydCBwaHlzaWNzLWJhc2VkIHNldHRsaW5nIGFuaW1hdGlvblxuICAgICAgICBjb25zdCBhbmltYXRlID0gKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVQaHlzaWNzKCk7XG4gICAgICAgICAgICBjb25zdCBbeCwgeV0gPSB0aGlzLmdldFBvc2l0aW9uRm9yRE9NKCk7XG5cbiAgICAgICAgICAgIC8vIFVwZGF0ZSBET00gZWxlbWVudFxuICAgICAgICAgICAgdGhpcy5ob2xkZXIuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZTNkKCR7eH1weCwgJHt5fXB4LCAwcHgpYDtcblxuICAgICAgICAgICAgaWYgKCF0aGlzLmlzQXRSZXN0KCkpIHtcbiAgICAgICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xuICAgIH1cbn1cblxuLyoqXG4gKiBFbmhhbmNlZCBSZXNpemFibGUgd2l0aCByZWFjdGl2ZSBjb25zdHJhaW50c1xuICogSW1wcm92ZXMgdXBvbiBleHRlbnNpb24vY29udHJvbGxlcnMvUmVzaXphYmxlLnRzXG4gKi9cbmV4cG9ydCBjbGFzcyBSZWFjdGl2ZVJlc2l6YWJsZUVuaGFuY2VkIHtcbiAgICBwcml2YXRlIGhvbGRlcjogSFRNTEVsZW1lbnQ7XG4gICAgcHJpdmF0ZSByZWFjdGl2ZVNpemU6IFZlY3RvcjJEO1xuICAgIHByaXZhdGUgbWluU2l6ZTogVmVjdG9yMkQ7XG4gICAgcHJpdmF0ZSBtYXhTaXplOiBWZWN0b3IyRDtcbiAgICBwcml2YXRlIGFzcGVjdFJhdGlvOiBSZXR1cm5UeXBlPHR5cGVvZiBudW1iZXJSZWY+IHwgbnVsbDtcblxuICAgIGNvbnN0cnVjdG9yKGhvbGRlcjogSFRNTEVsZW1lbnQsIG9wdGlvbnM6IHtcbiAgICAgICAgbWluU2l6ZT86IFtudW1iZXIsIG51bWJlcl07XG4gICAgICAgIG1heFNpemU/OiBbbnVtYmVyLCBudW1iZXJdO1xuICAgICAgICBhc3BlY3RSYXRpbz86IG51bWJlcjtcbiAgICB9ID0ge30pIHtcbiAgICAgICAgdGhpcy5ob2xkZXIgPSBob2xkZXI7XG5cbiAgICAgICAgLy8gSW5pdGlhbGl6ZSByZWFjdGl2ZSB2ZWN0b3JzXG4gICAgICAgIHRoaXMucmVhY3RpdmVTaXplID0gdmVjdG9yMlJlZihcbiAgICAgICAgICAgIGhvbGRlci5vZmZzZXRXaWR0aCxcbiAgICAgICAgICAgIGhvbGRlci5vZmZzZXRIZWlnaHRcbiAgICAgICAgKTtcblxuICAgICAgICB0aGlzLm1pblNpemUgPSB2ZWN0b3IyUmVmKFxuICAgICAgICAgICAgb3B0aW9ucy5taW5TaXplPy5bMF0gfHwgNTAsXG4gICAgICAgICAgICBvcHRpb25zLm1pblNpemU/LlsxXSB8fCA1MFxuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMubWF4U2l6ZSA9IHZlY3RvcjJSZWYoXG4gICAgICAgICAgICBvcHRpb25zLm1heFNpemU/LlswXSB8fCBnbG9iYWxUaGlzLmlubmVyV2lkdGgsXG4gICAgICAgICAgICBvcHRpb25zLm1heFNpemU/LlsxXSB8fCBnbG9iYWxUaGlzLmlubmVySGVpZ2h0XG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5hc3BlY3RSYXRpbyA9IG9wdGlvbnMuYXNwZWN0UmF0aW8gPyBudW1iZXJSZWYob3B0aW9ucy5hc3BlY3RSYXRpbykgOiBudWxsO1xuICAgIH1cblxuICAgIC8vIFNldCBzaXplIHdpdGggcmVhY3RpdmUgY29uc3RyYWludHNcbiAgICBzZXRTaXplKHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyKSB7XG4gICAgICAgIGxldCBuZXdXaWR0aCA9IG9wZXJhdGVkKFtudW1iZXJSZWYod2lkdGgpLCB0aGlzLm1pblNpemUueCwgdGhpcy5tYXhTaXplLnhdLCAodywgbWluLCBtYXgpID0+XG4gICAgICAgICAgICBNYXRoLm1heChtaW4udmFsdWUsIE1hdGgubWluKG1heC52YWx1ZSwgdy52YWx1ZSkpXG4gICAgICAgICk7XG5cbiAgICAgICAgbGV0IG5ld0hlaWdodCA9IG9wZXJhdGVkKFtudW1iZXJSZWYoaGVpZ2h0KSwgdGhpcy5taW5TaXplLnksIHRoaXMubWF4U2l6ZS55XSwgKGgsIG1pbiwgbWF4KSA9PlxuICAgICAgICAgICAgTWF0aC5tYXgobWluLnZhbHVlLCBNYXRoLm1pbihtYXgudmFsdWUsIGgudmFsdWUpKVxuICAgICAgICApO1xuXG4gICAgICAgIC8vIEFwcGx5IGFzcGVjdCByYXRpbyBjb25zdHJhaW50IGlmIHNldFxuICAgICAgICBpZiAodGhpcy5hc3BlY3RSYXRpbykge1xuICAgICAgICAgICAgY29uc3QgY3VycmVudFJhdGlvID0gb3BlcmF0ZWQoW25ld1dpZHRoLCBuZXdIZWlnaHRdLCAodywgaCkgPT4gdy52YWx1ZSAvIGgudmFsdWUpO1xuICAgICAgICAgICAgY29uc3QgdGFyZ2V0UmF0aW8gPSB0aGlzLmFzcGVjdFJhdGlvO1xuXG4gICAgICAgICAgICBvcGVyYXRlZChbY3VycmVudFJhdGlvLCB0YXJnZXRSYXRpb10sIChjdXJyZW50LCB0YXJnZXQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnMoY3VycmVudC52YWx1ZSAtIHRhcmdldC52YWx1ZSkgPiAwLjAxKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEFkanVzdCBoZWlnaHQgdG8gbWF0Y2ggYXNwZWN0IHJhdGlvXG4gICAgICAgICAgICAgICAgICAgIG5ld0hlaWdodCA9IG9wZXJhdGVkKFtuZXdXaWR0aCwgdGFyZ2V0UmF0aW9dLCAodywgcmF0aW8pID0+IHcudmFsdWUgLyByYXRpby52YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJlYWN0aXZlU2l6ZS54LnZhbHVlID0gbmV3V2lkdGgudmFsdWU7XG4gICAgICAgIHRoaXMucmVhY3RpdmVTaXplLnkudmFsdWUgPSBuZXdIZWlnaHQudmFsdWU7XG5cbiAgICAgICAgLy8gVXBkYXRlIERPTSBlbGVtZW50XG4gICAgICAgIHRoaXMuaG9sZGVyLnN0eWxlLndpZHRoID0gYCR7bmV3V2lkdGgudmFsdWV9cHhgO1xuICAgICAgICB0aGlzLmhvbGRlci5zdHlsZS5oZWlnaHQgPSBgJHtuZXdIZWlnaHQudmFsdWV9cHhgO1xuICAgIH1cblxuICAgIC8vIFJlc2l6ZSB3aXRoIGNvbnN0cmFpbnRzIGFwcGxpZWRcbiAgICByZXNpemVCeShkZWx0YVdpZHRoOiBudW1iZXIsIGRlbHRhSGVpZ2h0OiBudW1iZXIpIHtcbiAgICAgICAgY29uc3QgbmV3V2lkdGggPSBvcGVyYXRlZChbdGhpcy5yZWFjdGl2ZVNpemUueCwgbnVtYmVyUmVmKGRlbHRhV2lkdGgpXSwgKHcsIGR3KSA9PiB3LnZhbHVlICsgZHcudmFsdWUpO1xuICAgICAgICBjb25zdCBuZXdIZWlnaHQgPSBvcGVyYXRlZChbdGhpcy5yZWFjdGl2ZVNpemUueSwgbnVtYmVyUmVmKGRlbHRhSGVpZ2h0KV0sIChoLCBkaCkgPT4gaC52YWx1ZSArIGRoLnZhbHVlKTtcblxuICAgICAgICB0aGlzLnNldFNpemUobmV3V2lkdGgudmFsdWUsIG5ld0hlaWdodC52YWx1ZSk7XG4gICAgfVxuXG4gICAgLy8gR2V0IGNvbnN0cmFpbmVkIHNpemUgZm9yIERPTSB1cGRhdGVzXG4gICAgZ2V0Q29uc3RyYWluZWRTaXplKCkge1xuICAgICAgICByZXR1cm4gW3RoaXMucmVhY3RpdmVTaXplLngudmFsdWUsIHRoaXMucmVhY3RpdmVTaXplLnkudmFsdWVdO1xuICAgIH1cblxuICAgIC8vIENoZWNrIGlmIHNpemUgaXMgYXQgbWluaW11bS9tYXhpbXVtIGJvdW5kc1xuICAgIGlzQXRNaW5TaXplKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5yZWFjdGl2ZVNpemUueC52YWx1ZSA8PSB0aGlzLm1pblNpemUueC52YWx1ZSB8fFxuICAgICAgICAgICAgICAgdGhpcy5yZWFjdGl2ZVNpemUueS52YWx1ZSA8PSB0aGlzLm1pblNpemUueS52YWx1ZTtcbiAgICB9XG5cbiAgICBpc0F0TWF4U2l6ZSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVhY3RpdmVTaXplLngudmFsdWUgPj0gdGhpcy5tYXhTaXplLngudmFsdWUgfHxcbiAgICAgICAgICAgICAgIHRoaXMucmVhY3RpdmVTaXplLnkudmFsdWUgPj0gdGhpcy5tYXhTaXplLnkudmFsdWU7XG4gICAgfVxufVxuXG4vKipcbiAqIEVuaGFuY2VkIEdyaWQgU3lzdGVtIHdpdGggcmVhY3RpdmUgdHJhbnNmb3JtYXRpb25zXG4gKiBJbXByb3ZlcyB1cG9uIGxheW91dC9ncmlkL0ludGVyYWN0LnRzXG4gKi9cbmV4cG9ydCBjbGFzcyBSZWFjdGl2ZUdyaWRTeXN0ZW0ge1xuICAgIHByaXZhdGUgY2VsbFNpemU6IFZlY3RvcjJEO1xuICAgIHByaXZhdGUgZ3JpZE9mZnNldDogVmVjdG9yMkQ7XG4gICAgcHJpdmF0ZSB6b29tOiBSZXR1cm5UeXBlPHR5cGVvZiBudW1iZXJSZWY+O1xuICAgIHByaXZhdGUgcGFuOiBWZWN0b3IyRDtcblxuICAgIGNvbnN0cnVjdG9yKGNlbGxTaXplOiBbbnVtYmVyLCBudW1iZXJdID0gWzMyLCAzMl0pIHtcbiAgICAgICAgdGhpcy5jZWxsU2l6ZSA9IHZlY3RvcjJSZWYoY2VsbFNpemVbMF0sIGNlbGxTaXplWzFdKTtcbiAgICAgICAgdGhpcy5ncmlkT2Zmc2V0ID0gdmVjdG9yMlJlZigwLCAwKTtcbiAgICAgICAgdGhpcy56b29tID0gbnVtYmVyUmVmKDEpO1xuICAgICAgICB0aGlzLnBhbiA9IHZlY3RvcjJSZWYoMCwgMCk7XG4gICAgfVxuXG4gICAgLy8gQ29udmVydCBncmlkIGNvb3JkaW5hdGVzIHRvIHNjcmVlbiBjb29yZGluYXRlcyB3aXRoIHpvb20gYW5kIHBhblxuICAgIGdyaWRUb1NjcmVlbihncmlkWDogbnVtYmVyLCBncmlkWTogbnVtYmVyKTogVmVjdG9yMkQge1xuICAgICAgICBjb25zdCBncmlkUG9zID0gdmVjdG9yMlJlZihncmlkWCwgZ3JpZFkpO1xuXG4gICAgICAgIC8vIFNjYWxlIGJ5IGNlbGwgc2l6ZVxuICAgICAgICBjb25zdCBzY2FsZWQgPSBtdWx0aXBseVZlY3RvcjJEKGdyaWRQb3MsIHRoaXMuY2VsbFNpemUpO1xuXG4gICAgICAgIC8vIEFwcGx5IHpvb21cbiAgICAgICAgY29uc3Qgem9vbWVkID0gbXVsdGlwbHlWZWN0b3IyRChzY2FsZWQsIHRoaXMuem9vbSk7XG5cbiAgICAgICAgLy8gQXBwbHkgcGFuIG9mZnNldFxuICAgICAgICBjb25zdCBwYW5uZWQgPSBhZGRWZWN0b3IyRCh6b29tZWQsIHRoaXMucGFuKTtcblxuICAgICAgICAvLyBBZGQgZ3JpZCBvZmZzZXRcbiAgICAgICAgcmV0dXJuIGFkZFZlY3RvcjJEKHBhbm5lZCwgdGhpcy5ncmlkT2Zmc2V0KTtcbiAgICB9XG5cbiAgICAvLyBDb252ZXJ0IHNjcmVlbiBjb29yZGluYXRlcyB0byBncmlkIGNvb3JkaW5hdGVzXG4gICAgc2NyZWVuVG9HcmlkKHNjcmVlblg6IG51bWJlciwgc2NyZWVuWTogbnVtYmVyKTogVmVjdG9yMkQge1xuICAgICAgICBjb25zdCBzY3JlZW5Qb3MgPSB2ZWN0b3IyUmVmKHNjcmVlblgsIHNjcmVlblkpO1xuXG4gICAgICAgIC8vIFJlbW92ZSBwYW4gYW5kIG9mZnNldFxuICAgICAgICBjb25zdCB1bnBhbm5lZCA9IHN1YnRyYWN0VmVjdG9yMkQoc2NyZWVuUG9zLCB0aGlzLnBhbik7XG4gICAgICAgIGNvbnN0IHVub2Zmc2V0ID0gc3VidHJhY3RWZWN0b3IyRCh1bnBhbm5lZCwgdGhpcy5ncmlkT2Zmc2V0KTtcblxuICAgICAgICAvLyBSZW1vdmUgem9vbVxuICAgICAgICBjb25zdCB1bnpvb21lZCA9IGRpdmlkZVZlY3RvcjJEKHVub2Zmc2V0LCB0aGlzLnpvb20pO1xuXG4gICAgICAgIC8vIENvbnZlcnQgdG8gZ3JpZCB1bml0c1xuICAgICAgICByZXR1cm4gZGl2aWRlVmVjdG9yMkQodW56b29tZWQsIHRoaXMuY2VsbFNpemUpO1xuICAgIH1cblxuICAgIC8vIFNuYXAgcG9zaXRpb24gdG8gbmVhcmVzdCBncmlkIHBvaW50XG4gICAgc25hcFRvR3JpZChwb3NpdGlvbjogVmVjdG9yMkQpOiBWZWN0b3IyRCB7XG4gICAgICAgIGNvbnN0IGdyaWRDb29yZHMgPSB0aGlzLnNjcmVlblRvR3JpZChwb3NpdGlvbi54LnZhbHVlLCBwb3NpdGlvbi55LnZhbHVlKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JpZFRvU2NyZWVuKFxuICAgICAgICAgICAgTWF0aC5yb3VuZChncmlkQ29vcmRzLngudmFsdWUpLFxuICAgICAgICAgICAgTWF0aC5yb3VuZChncmlkQ29vcmRzLnkudmFsdWUpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gR2V0IGdyaWQgbGluZSBwb3NpdGlvbnMgZm9yIHJlbmRlcmluZ1xuICAgIGdldEdyaWRMaW5lcyh2aWV3cG9ydFNpemU6IFtudW1iZXIsIG51bWJlcl0pOiB7IGhvcml6b250YWw6IG51bWJlcltdLCB2ZXJ0aWNhbDogbnVtYmVyW10gfSB7XG4gICAgICAgIGNvbnN0IFt3aWR0aCwgaGVpZ2h0XSA9IHZpZXdwb3J0U2l6ZTtcblxuICAgICAgICAvLyBDYWxjdWxhdGUgdmlzaWJsZSBncmlkIHJhbmdlXG4gICAgICAgIGNvbnN0IHRvcExlZnQgPSB0aGlzLnNjcmVlblRvR3JpZCgtdGhpcy5wYW4ueC52YWx1ZSwgLXRoaXMucGFuLnkudmFsdWUpO1xuICAgICAgICBjb25zdCBib3R0b21SaWdodCA9IHRoaXMuc2NyZWVuVG9HcmlkKHdpZHRoIC0gdGhpcy5wYW4ueC52YWx1ZSwgaGVpZ2h0IC0gdGhpcy5wYW4ueS52YWx1ZSk7XG5cbiAgICAgICAgY29uc3QgaG9yaXpvbnRhbDogbnVtYmVyW10gPSBbXTtcbiAgICAgICAgY29uc3QgdmVydGljYWw6IG51bWJlcltdID0gW107XG5cbiAgICAgICAgLy8gR2VuZXJhdGUgaG9yaXpvbnRhbCBsaW5lc1xuICAgICAgICBmb3IgKGxldCB5ID0gTWF0aC5mbG9vcih0b3BMZWZ0LnkudmFsdWUpOyB5IDw9IE1hdGguY2VpbChib3R0b21SaWdodC55LnZhbHVlKTsgeSsrKSB7XG4gICAgICAgICAgICBjb25zdCBzY3JlZW5ZID0gdGhpcy5ncmlkVG9TY3JlZW4oMCwgeSkueS52YWx1ZTtcbiAgICAgICAgICAgIGhvcml6b250YWwucHVzaChzY3JlZW5ZKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEdlbmVyYXRlIHZlcnRpY2FsIGxpbmVzXG4gICAgICAgIGZvciAobGV0IHggPSBNYXRoLmZsb29yKHRvcExlZnQueC52YWx1ZSk7IHggPD0gTWF0aC5jZWlsKGJvdHRvbVJpZ2h0LngudmFsdWUpOyB4KyspIHtcbiAgICAgICAgICAgIGNvbnN0IHNjcmVlblggPSB0aGlzLmdyaWRUb1NjcmVlbih4LCAwKS54LnZhbHVlO1xuICAgICAgICAgICAgdmVydGljYWwucHVzaChzY3JlZW5YKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7IGhvcml6b250YWwsIHZlcnRpY2FsIH07XG4gICAgfVxuXG4gICAgLy8gQW5pbWF0ZSB6b29tIHdpdGggc21vb3RoIGludGVycG9sYXRpb25cbiAgICBhbmltYXRlWm9vbSh0YXJnZXRab29tOiBudW1iZXIsIGR1cmF0aW9uOiBudW1iZXIgPSAzMDApIHtcbiAgICAgICAgY29uc3Qgc3RhcnRab29tID0gdGhpcy56b29tLnZhbHVlO1xuICAgICAgICBjb25zdCBzdGFydFRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcblxuICAgICAgICBjb25zdCBhbmltYXRlID0gKGN1cnJlbnRUaW1lOiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGVsYXBzZWQgPSBjdXJyZW50VGltZSAtIHN0YXJ0VGltZTtcbiAgICAgICAgICAgIGNvbnN0IHByb2dyZXNzID0gTWF0aC5taW4oZWxhcHNlZCAvIGR1cmF0aW9uLCAxKTtcblxuICAgICAgICAgICAgLy8gRWFzaW5nIGZ1bmN0aW9uIChlYXNlLW91dCBjdWJpYylcbiAgICAgICAgICAgIGNvbnN0IGVhc2VkID0gMSAtIE1hdGgucG93KDEgLSBwcm9ncmVzcywgMyk7XG5cbiAgICAgICAgICAgIHRoaXMuem9vbS52YWx1ZSA9IHN0YXJ0Wm9vbSArICh0YXJnZXRab29tIC0gc3RhcnRab29tKSAqIGVhc2VkO1xuXG4gICAgICAgICAgICBpZiAocHJvZ3Jlc3MgPCAxKSB7XG4gICAgICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRlKTtcbiAgICB9XG5cbiAgICAvLyBQYW4gdGhlIGdyaWQgc21vb3RobHlcbiAgICBwYW5CeShkZWx0YVg6IG51bWJlciwgZGVsdGFZOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5wYW4ueC52YWx1ZSArPSBkZWx0YVg7XG4gICAgICAgIHRoaXMucGFuLnkudmFsdWUgKz0gZGVsdGFZO1xuICAgIH1cblxuICAgIC8vIENlbnRlciB0aGUgZ3JpZCBvbiBhIHNwZWNpZmljIHBvaW50XG4gICAgY2VudGVyT24ocG9pbnQ6IFZlY3RvcjJEKSB7XG4gICAgICAgIGNvbnN0IGNlbnRlclggPSBnbG9iYWxUaGlzLmlubmVyV2lkdGggLyAyO1xuICAgICAgICBjb25zdCBjZW50ZXJZID0gZ2xvYmFsVGhpcy5pbm5lckhlaWdodCAvIDI7XG5cbiAgICAgICAgdGhpcy5wYW4ueC52YWx1ZSA9IGNlbnRlclggLSBwb2ludC54LnZhbHVlO1xuICAgICAgICB0aGlzLnBhbi55LnZhbHVlID0gY2VudGVyWSAtIHBvaW50LnkudmFsdWU7XG4gICAgfVxufVxuXG4vKipcbiAqIEVuaGFuY2VkIE9yaWVudGF0aW9uIFN5c3RlbSB3aXRoIHJlYWN0aXZlIHRyYW5zZm9ybWF0aW9uc1xuICogSW1wcm92ZXMgdXBvbiBsYXlvdXQvb3JpZW50L09yaWVudEJveC50c1xuICovXG5leHBvcnQgY2xhc3MgUmVhY3RpdmVPcmllbnRTeXN0ZW0ge1xuICAgIHByaXZhdGUgcG9zaXRpb246IFZlY3RvcjJEO1xuICAgIHByaXZhdGUgc2NhbGU6IFZlY3RvcjJEO1xuICAgIHByaXZhdGUgcm90YXRpb246IFJldHVyblR5cGU8dHlwZW9mIG51bWJlclJlZj47XG4gICAgcHJpdmF0ZSBza2V3OiBWZWN0b3IyRDtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnBvc2l0aW9uID0gdmVjdG9yMlJlZigwLCAwKTtcbiAgICAgICAgdGhpcy5zY2FsZSA9IHZlY3RvcjJSZWYoMSwgMSk7XG4gICAgICAgIHRoaXMucm90YXRpb24gPSBudW1iZXJSZWYoMCk7XG4gICAgICAgIHRoaXMuc2tldyA9IHZlY3RvcjJSZWYoMCwgMCk7XG4gICAgfVxuXG4gICAgLy8gR2VuZXJhdGUgQ1NTIHRyYW5zZm9ybSBzdHJpbmcgcmVhY3RpdmVseVxuICAgIGdldFRyYW5zZm9ybVN0cmluZygpOiBSZXR1cm5UeXBlPHR5cGVvZiBudW1iZXJSZWY+IHtcbiAgICAgICAgcmV0dXJuIG9wZXJhdGVkKFxuICAgICAgICAgICAgW3RoaXMucG9zaXRpb24ueCwgdGhpcy5wb3NpdGlvbi55LCB0aGlzLnNjYWxlLngsIHRoaXMuc2NhbGUueSwgdGhpcy5yb3RhdGlvbiwgdGhpcy5za2V3LngsIHRoaXMuc2tldy55XSxcbiAgICAgICAgICAgICh4LCB5LCBzeCwgc3ksIHJvdCwgc2t4LCBza3kpID0+XG4gICAgICAgICAgICAgICAgYHRyYW5zbGF0ZTNkKCR7eC52YWx1ZX1weCwgJHt5LnZhbHVlfXB4LCAwcHgpIGAgK1xuICAgICAgICAgICAgICAgIGBzY2FsZSgke3N4LnZhbHVlfSwgJHtzeS52YWx1ZX0pIGAgK1xuICAgICAgICAgICAgICAgIGByb3RhdGUoJHtyb3QudmFsdWV9ZGVnKSBgICtcbiAgICAgICAgICAgICAgICBgc2tldygke3NreC52YWx1ZX1kZWcsICR7c2t5LnZhbHVlfWRlZylgXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gQXBwbHkgdHJhbnNmb3JtYXRpb24gdG8gYSBwb2ludFxuICAgIHRyYW5zZm9ybVBvaW50KHBvaW50OiBWZWN0b3IyRCk6IFZlY3RvcjJEIHtcbiAgICAgICAgLy8gQXBwbHkgc2NhbGVcbiAgICAgICAgbGV0IHJlc3VsdCA9IG11bHRpcGx5VmVjdG9yMkQocG9pbnQsIHRoaXMuc2NhbGUpO1xuXG4gICAgICAgIC8vIEFwcGx5IHJvdGF0aW9uXG4gICAgICAgIHJlc3VsdCA9IHJvdGF0ZTJEKHJlc3VsdCwgdGhpcy5yb3RhdGlvbik7XG5cbiAgICAgICAgLy8gQXBwbHkgdHJhbnNsYXRpb25cbiAgICAgICAgcmVzdWx0ID0gYWRkVmVjdG9yMkQocmVzdWx0LCB0aGlzLnBvc2l0aW9uKTtcblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8vIEdldCBpbnZlcnNlIHRyYW5zZm9ybWF0aW9uIGZvciBjb252ZXJ0aW5nIHNjcmVlbiB0byBsb2NhbCBjb29yZGluYXRlc1xuICAgIGludmVyc2VUcmFuc2Zvcm1Qb2ludChwb2ludDogVmVjdG9yMkQpOiBWZWN0b3IyRCB7XG4gICAgICAgIC8vIEludmVyc2UgdHJhbnNsYXRlXG4gICAgICAgIGxldCByZXN1bHQgPSBzdWJ0cmFjdFZlY3RvcjJEKHBvaW50LCB0aGlzLnBvc2l0aW9uKTtcblxuICAgICAgICAvLyBJbnZlcnNlIHJvdGF0ZVxuICAgICAgICByZXN1bHQgPSByb3RhdGUyRChyZXN1bHQsIG9wZXJhdGVkKFt0aGlzLnJvdGF0aW9uXSwgKHIpID0+IC1yLnZhbHVlKSk7XG5cbiAgICAgICAgLy8gSW52ZXJzZSBzY2FsZVxuICAgICAgICByZXN1bHQgPSBkaXZpZGVWZWN0b3IyRChyZXN1bHQsIHRoaXMuc2NhbGUpO1xuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLy8gSW50ZXJwb2xhdGUgYmV0d2VlbiB0d28gdHJhbnNmb3JtYXRpb24gc3RhdGVzXG4gICAgaW50ZXJwb2xhdGVUbyh0YXJnZXQ6IFJlYWN0aXZlT3JpZW50U3lzdGVtLCBwcm9ncmVzczogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IG5ld1N5c3RlbSA9IG5ldyBSZWFjdGl2ZU9yaWVudFN5c3RlbSgpO1xuXG4gICAgICAgIG5ld1N5c3RlbS5wb3NpdGlvbiA9IGFkZFZlY3RvcjJEKFxuICAgICAgICAgICAgbXVsdGlwbHlWZWN0b3IyRCh0aGlzLnBvc2l0aW9uLCBvcGVyYXRlZChbbnVtYmVyUmVmKDEpLCBudW1iZXJSZWYocHJvZ3Jlc3MpXSwgKGEsIHApID0+IGEudmFsdWUgLSBwLnZhbHVlKSksXG4gICAgICAgICAgICBtdWx0aXBseVZlY3RvcjJEKHRhcmdldC5wb3NpdGlvbiwgbnVtYmVyUmVmKHByb2dyZXNzKSlcbiAgICAgICAgKTtcblxuICAgICAgICBuZXdTeXN0ZW0uc2NhbGUgPSBhZGRWZWN0b3IyRChcbiAgICAgICAgICAgIG11bHRpcGx5VmVjdG9yMkQodGhpcy5zY2FsZSwgb3BlcmF0ZWQoW251bWJlclJlZigxKSwgbnVtYmVyUmVmKHByb2dyZXNzKV0sIChhLCBwKSA9PiBhLnZhbHVlIC0gcC52YWx1ZSkpLFxuICAgICAgICAgICAgbXVsdGlwbHlWZWN0b3IyRCh0YXJnZXQuc2NhbGUsIG51bWJlclJlZihwcm9ncmVzcykpXG4gICAgICAgICk7XG5cbiAgICAgICAgbmV3U3lzdGVtLnJvdGF0aW9uID0gb3BlcmF0ZWQoXG4gICAgICAgICAgICBbdGhpcy5yb3RhdGlvbiwgdGFyZ2V0LnJvdGF0aW9uLCBudW1iZXJSZWYocHJvZ3Jlc3MpXSxcbiAgICAgICAgICAgIChjdXJyZW50LCB0YXJnZXQsIHApID0+IGN1cnJlbnQudmFsdWUgKyAodGFyZ2V0LnZhbHVlIC0gY3VycmVudC52YWx1ZSkgKiBwLnZhbHVlXG4gICAgICAgICk7XG5cbiAgICAgICAgcmV0dXJuIG5ld1N5c3RlbTtcbiAgICB9XG5cbiAgICAvLyBDaGVjayBpZiB0cmFuc2Zvcm1hdGlvbiBpcyBpZGVudGl0eSAobm8gdHJhbnNmb3JtYXRpb24gYXBwbGllZClcbiAgICBpc0lkZW50aXR5KCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5wb3NpdGlvbi54LnZhbHVlID09PSAwICYmIHRoaXMucG9zaXRpb24ueS52YWx1ZSA9PT0gMCAmJlxuICAgICAgICAgICAgICAgdGhpcy5zY2FsZS54LnZhbHVlID09PSAxICYmIHRoaXMuc2NhbGUueS52YWx1ZSA9PT0gMSAmJlxuICAgICAgICAgICAgICAgdGhpcy5yb3RhdGlvbi52YWx1ZSA9PT0gMCAmJlxuICAgICAgICAgICAgICAgdGhpcy5za2V3LngudmFsdWUgPT09IDAgJiYgdGhpcy5za2V3LnkudmFsdWUgPT09IDA7XG4gICAgfVxuXG4gICAgLy8gUmVzZXQgdG8gaWRlbnRpdHkgdHJhbnNmb3JtYXRpb25cbiAgICByZXNldCgpIHtcbiAgICAgICAgdGhpcy5wb3NpdGlvbi54LnZhbHVlID0gMDtcbiAgICAgICAgdGhpcy5wb3NpdGlvbi55LnZhbHVlID0gMDtcbiAgICAgICAgdGhpcy5zY2FsZS54LnZhbHVlID0gMTtcbiAgICAgICAgdGhpcy5zY2FsZS55LnZhbHVlID0gMTtcbiAgICAgICAgdGhpcy5yb3RhdGlvbi52YWx1ZSA9IDA7XG4gICAgICAgIHRoaXMuc2tldy54LnZhbHVlID0gMDtcbiAgICAgICAgdGhpcy5za2V3LnkudmFsdWUgPSAwO1xuICAgIH1cblxuICAgIC8vIEFwcGx5IHRyYW5zZm9ybWF0aW9uIHJlbGF0aXZlIHRvIGN1cnJlbnQgc3RhdGVcbiAgICB0cmFuc2Zvcm1CeSh0cmFuc2xhdGlvbj86IFtudW1iZXIsIG51bWJlcl0sIHNjYWxlPzogW251bWJlciwgbnVtYmVyXSwgcm90YXRpb24/OiBudW1iZXIpIHtcbiAgICAgICAgaWYgKHRyYW5zbGF0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uID0gYWRkVmVjdG9yMkQodGhpcy5wb3NpdGlvbiwgdmVjdG9yMlJlZih0cmFuc2xhdGlvblswXSwgdHJhbnNsYXRpb25bMV0pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzY2FsZSkge1xuICAgICAgICAgICAgdGhpcy5zY2FsZSA9IG11bHRpcGx5VmVjdG9yMkQodGhpcy5zY2FsZSwgdmVjdG9yMlJlZihzY2FsZVswXSwgc2NhbGVbMV0pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyb3RhdGlvbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLnJvdGF0aW9uLnZhbHVlICs9IHJvdGF0aW9uO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vKipcbiAqIEV4YW1wbGUgNTogUmVjdGFuZ2xlIG9wZXJhdGlvbnMgZm9yIFVJIGxheW91dCBhbmQgY29sbGlzaW9uIGRldGVjdGlvblxuICogRW5oYW5jZWQgc3BhdGlhbCByZWFzb25pbmcgd2l0aCByZWFjdGl2ZSByZWN0YW5nbGVzXG4gKi9cbmV4cG9ydCBjbGFzcyBSZWFjdGl2ZVNwYXRpYWxNYW5hZ2VyIHtcbiAgICBwcml2YXRlIGVsZW1lbnRzOiBNYXA8SFRNTEVsZW1lbnQsIFJlY3QyRD4gPSBuZXcgTWFwKCk7XG4gICAgcHJpdmF0ZSB2aWV3cG9ydDogUmVjdDJEO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIC8vIFJlYWN0aXZlIHZpZXdwb3J0IGJvdW5kc1xuICAgICAgICB0aGlzLnZpZXdwb3J0ID0gY3JlYXRlUmVjdDJEKDAsIDAsIGdsb2JhbFRoaXMuaW5uZXJXaWR0aCwgZ2xvYmFsVGhpcy5pbm5lckhlaWdodCk7XG5cbiAgICAgICAgLy8gVXBkYXRlIHZpZXdwb3J0IG9uIHJlc2l6ZVxuICAgICAgICBnbG9iYWxUaGlzLmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMudmlld3BvcnQuc2l6ZS54LnZhbHVlID0gZ2xvYmFsVGhpcy5pbm5lcldpZHRoO1xuICAgICAgICAgICAgdGhpcy52aWV3cG9ydC5zaXplLnkudmFsdWUgPSBnbG9iYWxUaGlzLmlubmVySGVpZ2h0O1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBSZWdpc3RlciBhbiBlbGVtZW50IHdpdGggcmVhY3RpdmUgYm91bmRzXG4gICAgcmVnaXN0ZXJFbGVtZW50KGVsZW1lbnQ6IEhUTUxFbGVtZW50KTogUmVjdDJEIHtcbiAgICAgICAgY29uc3QgcmVjdCA9IGNyZWF0ZVJlY3QyRCgwLCAwLCAwLCAwKTtcbiAgICAgICAgdGhpcy5lbGVtZW50cy5zZXQoZWxlbWVudCwgcmVjdCk7XG4gICAgICAgIHRoaXMudXBkYXRlRWxlbWVudEJvdW5kcyhlbGVtZW50KTtcbiAgICAgICAgcmV0dXJuIHJlY3Q7XG4gICAgfVxuXG4gICAgLy8gVXBkYXRlIGVsZW1lbnQgYm91bmRzIHJlYWN0aXZlbHlcbiAgICB1cGRhdGVFbGVtZW50Qm91bmRzKGVsZW1lbnQ6IEhUTUxFbGVtZW50KTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHJlY3QgPSB0aGlzLmVsZW1lbnRzLmdldChlbGVtZW50KTtcbiAgICAgICAgaWYgKCFyZWN0KSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgYm91bmRzID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgcmVjdC5wb3NpdGlvbi54LnZhbHVlID0gYm91bmRzLmxlZnQ7XG4gICAgICAgIHJlY3QucG9zaXRpb24ueS52YWx1ZSA9IGJvdW5kcy50b3A7XG4gICAgICAgIHJlY3Quc2l6ZS54LnZhbHVlID0gYm91bmRzLndpZHRoO1xuICAgICAgICByZWN0LnNpemUueS52YWx1ZSA9IGJvdW5kcy5oZWlnaHQ7XG4gICAgfVxuXG4gICAgLy8gRmluZCBlbGVtZW50cyB0aGF0IGludGVyc2VjdCB3aXRoIGEgcG9pbnRcbiAgICBnZXRFbGVtZW50c0F0UG9pbnQocG9pbnQ6IFZlY3RvcjJEKTogSFRNTEVsZW1lbnRbXSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdDogSFRNTEVsZW1lbnRbXSA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IFtlbGVtZW50LCByZWN0XSBvZiB0aGlzLmVsZW1lbnRzKSB7XG4gICAgICAgICAgICBpZiAocmVjdENvbnRhaW5zUG9pbnQocmVjdCwgcG9pbnQpLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goZWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvLyBGaW5kIGVsZW1lbnRzIHRoYXQgaW50ZXJzZWN0IHdpdGggYSByZWN0YW5nbGVcbiAgICBnZXRFbGVtZW50c0ludGVyc2VjdGluZ1JlY3QocXVlcnlSZWN0OiBSZWN0MkQpOiBIVE1MRWxlbWVudFtdIHtcbiAgICAgICAgY29uc3QgcmVzdWx0OiBIVE1MRWxlbWVudFtdID0gW107XG4gICAgICAgIGZvciAoY29uc3QgW2VsZW1lbnQsIHJlY3RdIG9mIHRoaXMuZWxlbWVudHMpIHtcbiAgICAgICAgICAgIGlmIChyZWN0SW50ZXJzZWN0cyhyZWN0LCBxdWVyeVJlY3QpLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goZWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvLyBHZXQgZWxlbWVudHMgd2l0aGluIHZpZXdwb3J0XG4gICAgZ2V0VmlzaWJsZUVsZW1lbnRzKCk6IEhUTUxFbGVtZW50W10ge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRFbGVtZW50c0ludGVyc2VjdGluZ1JlY3QodGhpcy52aWV3cG9ydCk7XG4gICAgfVxuXG4gICAgLy8gQ2FsY3VsYXRlIGRpc3RhbmNlIGZyb20gcG9pbnQgdG8gbmVhcmVzdCBlbGVtZW50XG4gICAgZ2V0RGlzdGFuY2VUb05lYXJlc3RFbGVtZW50KHBvaW50OiBWZWN0b3IyRCk6IG51bWJlciB7XG4gICAgICAgIGxldCBtaW5EaXN0YW5jZSA9IEluZmluaXR5O1xuICAgICAgICBmb3IgKGNvbnN0IFtlbGVtZW50LCByZWN0XSBvZiB0aGlzLmVsZW1lbnRzKSB7XG4gICAgICAgICAgICBjb25zdCBkaXN0YW5jZSA9IHBvaW50VG9SZWN0RGlzdGFuY2UocG9pbnQsIHJlY3QpLnZhbHVlO1xuICAgICAgICAgICAgbWluRGlzdGFuY2UgPSBNYXRoLm1pbihtaW5EaXN0YW5jZSwgZGlzdGFuY2UpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtaW5EaXN0YW5jZTtcbiAgICB9XG5cbiAgICAvLyBDb25zdHJhaW4gZWxlbWVudCB0byB2aWV3cG9ydFxuICAgIGNvbnN0cmFpblRvVmlld3BvcnQoZWxlbWVudDogSFRNTEVsZW1lbnQpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgcmVjdCA9IHRoaXMuZWxlbWVudHMuZ2V0KGVsZW1lbnQpO1xuICAgICAgICBpZiAoIXJlY3QpIHJldHVybjtcblxuICAgICAgICAvLyBDbGFtcCBwb3NpdGlvbiB0byB2aWV3cG9ydCBib3VuZHNcbiAgICAgICAgcmVjdC5wb3NpdGlvbi54LnZhbHVlID0gTWF0aC5tYXgoMCwgTWF0aC5taW4ocmVjdC5wb3NpdGlvbi54LnZhbHVlLFxuICAgICAgICAgICAgdGhpcy52aWV3cG9ydC5zaXplLngudmFsdWUgLSByZWN0LnNpemUueC52YWx1ZSkpO1xuICAgICAgICByZWN0LnBvc2l0aW9uLnkudmFsdWUgPSBNYXRoLm1heCgwLCBNYXRoLm1pbihyZWN0LnBvc2l0aW9uLnkudmFsdWUsXG4gICAgICAgICAgICB0aGlzLnZpZXdwb3J0LnNpemUueS52YWx1ZSAtIHJlY3Quc2l6ZS55LnZhbHVlKSk7XG4gICAgfVxufVxuXG4vKipcbiAqIEV4YW1wbGUgNjogRW5oYW5jZWQgU2VsZWN0aW9uIENvbnRyb2xsZXIgaW50ZWdyYXRpb25cbiAqIFNob3dzIGhvdyB0byB1c2UgdGhlIFNlbGVjdGlvbiBjb250cm9sbGVyIHdpdGggcmVhY3RpdmUgbWF0aFxuICovXG5leHBvcnQgY2xhc3MgQWR2YW5jZWRTZWxlY3Rpb25NYW5hZ2VyIHtcbiAgICBwcml2YXRlIHNlbGVjdGlvbjogYW55OyAvLyBXb3VsZCBiZSBTZWxlY3Rpb25Db250cm9sbGVyXG4gICAgcHJpdmF0ZSBzcGF0aWFsTWFuYWdlcjogUmVhY3RpdmVTcGF0aWFsTWFuYWdlcjtcbiAgICBwcml2YXRlIHNlbGVjdGVkRWxlbWVudHM6IFNldDxIVE1MRWxlbWVudD4gPSBuZXcgU2V0KCk7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5zcGF0aWFsTWFuYWdlciA9IG5ldyBSZWFjdGl2ZVNwYXRpYWxNYW5hZ2VyKCk7XG4gICAgICAgIC8vIHRoaXMuc2VsZWN0aW9uID0gbmV3IFNlbGVjdGlvbkNvbnRyb2xsZXIoeyAvKiBvcHRpb25zICovIH0pO1xuICAgIH1cblxuICAgIC8vIFNlbGVjdCBlbGVtZW50cyB3aXRoaW4gc2VsZWN0aW9uIHJlY3RhbmdsZVxuICAgIHNlbGVjdEVsZW1lbnRzSW5SZWN0KHNlbGVjdGlvblJlY3Q6IFJlY3QyRCk6IHZvaWQge1xuICAgICAgICBjb25zdCBpbnRlcnNlY3RpbmdFbGVtZW50cyA9IHRoaXMuc3BhdGlhbE1hbmFnZXIuZ2V0RWxlbWVudHNJbnRlcnNlY3RpbmdSZWN0KHNlbGVjdGlvblJlY3QpO1xuXG4gICAgICAgIC8vIENsZWFyIHByZXZpb3VzIHNlbGVjdGlvblxuICAgICAgICB0aGlzLnNlbGVjdGVkRWxlbWVudHMuZm9yRWFjaChlbCA9PiBlbC5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpKTtcbiAgICAgICAgdGhpcy5zZWxlY3RlZEVsZW1lbnRzLmNsZWFyKCk7XG5cbiAgICAgICAgLy8gQWRkIG5ldyBzZWxlY3Rpb25cbiAgICAgICAgaW50ZXJzZWN0aW5nRWxlbWVudHMuZm9yRWFjaChlbCA9PiB7XG4gICAgICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpO1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEVsZW1lbnRzLmFkZChlbCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIEdldCBib3VuZGluZyBib3ggb2YgYWxsIHNlbGVjdGVkIGVsZW1lbnRzXG4gICAgZ2V0U2VsZWN0aW9uQm91bmRzKCk6IFJlY3QyRCB8IG51bGwge1xuICAgICAgICBpZiAodGhpcy5zZWxlY3RlZEVsZW1lbnRzLnNpemUgPT09IDApIHJldHVybiBudWxsO1xuXG4gICAgICAgIGxldCB1bmlvbjogUmVjdDJEIHwgbnVsbCA9IG51bGw7XG4gICAgICAgIGZvciAoY29uc3QgZWxlbWVudCBvZiB0aGlzLnNlbGVjdGVkRWxlbWVudHMpIHtcbiAgICAgICAgICAgIGNvbnN0IGVsZW1lbnRSZWN0ID0gdGhpcy5zcGF0aWFsTWFuYWdlci5yZWdpc3RlckVsZW1lbnQoZWxlbWVudCk7XG4gICAgICAgICAgICB1bmlvbiA9IHVuaW9uID8ge1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiB2ZWN0b3IyUmVmKFxuICAgICAgICAgICAgICAgICAgICBNYXRoLm1pbih1bmlvbi5wb3NpdGlvbi54LnZhbHVlLCBlbGVtZW50UmVjdC5wb3NpdGlvbi54LnZhbHVlKSxcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5taW4odW5pb24ucG9zaXRpb24ueS52YWx1ZSwgZWxlbWVudFJlY3QucG9zaXRpb24ueS52YWx1ZSlcbiAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgIHNpemU6IHZlY3RvcjJSZWYoXG4gICAgICAgICAgICAgICAgICAgIE1hdGgubWF4KHVuaW9uLnBvc2l0aW9uLngudmFsdWUgKyB1bmlvbi5zaXplLngudmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudFJlY3QucG9zaXRpb24ueC52YWx1ZSArIGVsZW1lbnRSZWN0LnNpemUueC52YWx1ZSkgLVxuICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5taW4odW5pb24ucG9zaXRpb24ueC52YWx1ZSwgZWxlbWVudFJlY3QucG9zaXRpb24ueC52YWx1ZSksXG4gICAgICAgICAgICAgICAgICAgIE1hdGgubWF4KHVuaW9uLnBvc2l0aW9uLnkudmFsdWUgKyB1bmlvbi5zaXplLnkudmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudFJlY3QucG9zaXRpb24ueS52YWx1ZSArIGVsZW1lbnRSZWN0LnNpemUueS52YWx1ZSkgLVxuICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5taW4odW5pb24ucG9zaXRpb24ueS52YWx1ZSwgZWxlbWVudFJlY3QucG9zaXRpb24ueS52YWx1ZSlcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9IDogZWxlbWVudFJlY3Q7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdW5pb247XG4gICAgfVxuXG4gICAgLy8gTW92ZSBhbGwgc2VsZWN0ZWQgZWxlbWVudHMgYnkgb2Zmc2V0XG4gICAgbW92ZVNlbGVjdGlvbihvZmZzZXQ6IFZlY3RvcjJEKTogdm9pZCB7XG4gICAgICAgIGZvciAoY29uc3QgZWxlbWVudCBvZiB0aGlzLnNlbGVjdGVkRWxlbWVudHMpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlY3QgPSB0aGlzLnNwYXRpYWxNYW5hZ2VyLnJlZ2lzdGVyRWxlbWVudChlbGVtZW50KTtcbiAgICAgICAgICAgIHJlY3QucG9zaXRpb24ueC52YWx1ZSArPSBvZmZzZXQueC52YWx1ZTtcbiAgICAgICAgICAgIHJlY3QucG9zaXRpb24ueS52YWx1ZSArPSBvZmZzZXQueS52YWx1ZTtcblxuICAgICAgICAgICAgLy8gVXBkYXRlIERPTSBlbGVtZW50XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUoJHtyZWN0LnBvc2l0aW9uLngudmFsdWV9cHgsICR7cmVjdC5wb3NpdGlvbi55LnZhbHVlfXB4KWA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBTY2FsZSBzZWxlY3Rpb24gYXJvdW5kIGNlbnRlclxuICAgIHNjYWxlU2VsZWN0aW9uKHNjYWxlOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgYm91bmRzID0gdGhpcy5nZXRTZWxlY3Rpb25Cb3VuZHMoKTtcbiAgICAgICAgaWYgKCFib3VuZHMpIHJldHVybjtcblxuICAgICAgICBjb25zdCBjZW50ZXIgPSByZWN0Q2VudGVyKGJvdW5kcyk7XG5cbiAgICAgICAgZm9yIChjb25zdCBlbGVtZW50IG9mIHRoaXMuc2VsZWN0ZWRFbGVtZW50cykge1xuICAgICAgICAgICAgY29uc3QgcmVjdCA9IHRoaXMuc3BhdGlhbE1hbmFnZXIucmVnaXN0ZXJFbGVtZW50KGVsZW1lbnQpO1xuXG4gICAgICAgICAgICAvLyBTY2FsZSBhcm91bmQgc2VsZWN0aW9uIGNlbnRlclxuICAgICAgICAgICAgY29uc3QgdG9DZW50ZXIgPSBzdWJ0cmFjdFZlY3RvcjJEKHJlY3RDZW50ZXIocmVjdCksIGNlbnRlcik7XG4gICAgICAgICAgICBjb25zdCBzY2FsZWRUb0NlbnRlciA9IG11bHRpcGx5VmVjdG9yMkQodG9DZW50ZXIsIG51bWJlclJlZihzY2FsZSkpO1xuICAgICAgICAgICAgY29uc3QgbmV3Q2VudGVyID0gYWRkVmVjdG9yMkQoY2VudGVyLCBzY2FsZWRUb0NlbnRlcik7XG5cbiAgICAgICAgICAgIC8vIFVwZGF0ZSBwb3NpdGlvbiBhbmQgc2l6ZVxuICAgICAgICAgICAgY29uc3QgbmV3U2l6ZSA9IG11bHRpcGx5VmVjdG9yMkQocmVjdC5zaXplLCBudW1iZXJSZWYoc2NhbGUpKTtcbiAgICAgICAgICAgIHJlY3QucG9zaXRpb24ueC52YWx1ZSA9IG5ld0NlbnRlci54LnZhbHVlIC0gbmV3U2l6ZS54LnZhbHVlIC8gMjtcbiAgICAgICAgICAgIHJlY3QucG9zaXRpb24ueS52YWx1ZSA9IG5ld0NlbnRlci55LnZhbHVlIC0gbmV3U2l6ZS55LnZhbHVlIC8gMjtcbiAgICAgICAgICAgIHJlY3Quc2l6ZS54LnZhbHVlID0gbmV3U2l6ZS54LnZhbHVlO1xuICAgICAgICAgICAgcmVjdC5zaXplLnkudmFsdWUgPSBuZXdTaXplLnkudmFsdWU7XG5cbiAgICAgICAgICAgIC8vIFVwZGF0ZSBET00gZWxlbWVudFxuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlKCR7cmVjdC5wb3NpdGlvbi54LnZhbHVlfXB4LCAke3JlY3QucG9zaXRpb24ueS52YWx1ZX1weClgO1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS53aWR0aCA9IGAke3JlY3Quc2l6ZS54LnZhbHVlfXB4YDtcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gYCR7cmVjdC5zaXplLnkudmFsdWV9cHhgO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vKipcbiAqIEV4YW1wbGUgNzogQ1NTLUludGVncmF0ZWQgUmVhY3RpdmUgQW5pbWF0aW9uIFN5c3RlbVxuICogRGVtb25zdHJhdGVzIHNlYW1sZXNzIGludGVncmF0aW9uIGJldHdlZW4gcmVhY3RpdmUgbWF0aCBhbmQgQ1NTIHRyYW5zZm9ybXNcbiAqL1xuZXhwb3J0IGNsYXNzIFJlYWN0aXZlQ1NTQW5pbWF0aW9uIHtcbiAgICBwcml2YXRlIGVsZW1lbnQ6IEhUTUxFbGVtZW50O1xuICAgIHByaXZhdGUgdHJhbnNmb3JtOiBhbnk7IC8vIFdvdWxkIGJlIFJlYWN0aXZlVHJhbnNmb3JtXG4gICAgcHJpdmF0ZSBwb3NpdGlvbjogVmVjdG9yMkQ7XG4gICAgcHJpdmF0ZSBzY2FsZTogVmVjdG9yMkQ7XG4gICAgcHJpdmF0ZSByb3RhdGlvbjogUmV0dXJuVHlwZTx0eXBlb2YgbnVtYmVyUmVmPjtcbiAgICBwcml2YXRlIHByb2dyZXNzOiBSZXR1cm5UeXBlPHR5cGVvZiBudW1iZXJSZWY+O1xuICAgIHByaXZhdGUgZHVyYXRpb246IG51bWJlcjtcbiAgICBwcml2YXRlIHN0YXJ0VGltZTogbnVtYmVyO1xuXG4gICAgY29uc3RydWN0b3IoZWxlbWVudDogSFRNTEVsZW1lbnQsIGR1cmF0aW9uID0gMTAwMCkge1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuICAgICAgICB0aGlzLmR1cmF0aW9uID0gZHVyYXRpb247XG4gICAgICAgIHRoaXMucG9zaXRpb24gPSB2ZWN0b3IyUmVmKDAsIDApO1xuICAgICAgICB0aGlzLnNjYWxlID0gdmVjdG9yMlJlZigxLCAxKTtcbiAgICAgICAgdGhpcy5yb3RhdGlvbiA9IG51bWJlclJlZigwKTtcbiAgICAgICAgdGhpcy5wcm9ncmVzcyA9IG51bWJlclJlZigwKTtcbiAgICAgICAgdGhpcy5zdGFydFRpbWUgPSAwO1xuXG4gICAgICAgIC8vIEJpbmQgcmVhY3RpdmUgdHJhbnNmb3JtIHRvIENTU1xuICAgICAgICB0aGlzLmJpbmRUb0NTUygpO1xuICAgIH1cblxuICAgIHByaXZhdGUgYmluZFRvQ1NTKCkge1xuICAgICAgICAvLyBUaGlzIHdvdWxkIHVzZSB0aGUgQ1NTQWRhcHRlciB1dGlsaXRpZXNcbiAgICAgICAgLy8gY29uc3QgdHJhbnNmb3JtID0gbmV3IFJlYWN0aXZlVHJhbnNmb3JtKCk7XG4gICAgICAgIC8vIHRyYW5zZm9ybS50cmFuc2xhdGUodGhpcy5wb3NpdGlvbi54LCB0aGlzLnBvc2l0aW9uLnkpO1xuICAgICAgICAvLyB0cmFuc2Zvcm0uc2NhbGUodGhpcy5zY2FsZS54LCB0aGlzLnNjYWxlLnkpO1xuICAgICAgICAvLyB0cmFuc2Zvcm0ucm90YXRlKHRoaXMucm90YXRpb24pO1xuICAgICAgICAvLyBDU1NCaW5kZXIuYmluZFRyYW5zZm9ybSh0aGlzLmVsZW1lbnQsIHRyYW5zZm9ybS52YWx1ZSk7XG4gICAgfVxuXG4gICAgYW5pbWF0ZVRvKHRhcmdldFBvczogVmVjdG9yMkQsIHRhcmdldFNjYWxlOiBWZWN0b3IyRCA9IHZlY3RvcjJSZWYoMSwgMSksIHRhcmdldFJvdGF0aW9uOiBudW1iZXIgPSAwKSB7XG4gICAgICAgIGNvbnN0IHN0YXJ0UG9zID0geyB4OiB0aGlzLnBvc2l0aW9uLngudmFsdWUsIHk6IHRoaXMucG9zaXRpb24ueS52YWx1ZSB9O1xuICAgICAgICBjb25zdCBzdGFydFNjYWxlID0geyB4OiB0aGlzLnNjYWxlLngudmFsdWUsIHk6IHRoaXMuc2NhbGUueS52YWx1ZSB9O1xuICAgICAgICBjb25zdCBzdGFydFJvdGF0aW9uID0gdGhpcy5yb3RhdGlvbi52YWx1ZTtcblxuICAgICAgICB0aGlzLnN0YXJ0VGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuXG4gICAgICAgIGNvbnN0IGFuaW1hdGUgPSAoY3VycmVudFRpbWU6IG51bWJlcikgPT4ge1xuICAgICAgICAgICAgY29uc3QgZWxhcHNlZCA9IGN1cnJlbnRUaW1lIC0gdGhpcy5zdGFydFRpbWU7XG4gICAgICAgICAgICB0aGlzLnByb2dyZXNzLnZhbHVlID0gTWF0aC5taW4oZWxhcHNlZCAvIHRoaXMuZHVyYXRpb24sIDEpO1xuXG4gICAgICAgICAgICAvLyBFYXNpbmcgZnVuY3Rpb24gKGVhc2Utb3V0IGN1YmljKVxuICAgICAgICAgICAgY29uc3QgdCA9IDEgLSBNYXRoLnBvdygxIC0gdGhpcy5wcm9ncmVzcy52YWx1ZSwgMyk7XG5cbiAgICAgICAgICAgIC8vIEludGVycG9sYXRlIHBvc2l0aW9uXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uLngudmFsdWUgPSBzdGFydFBvcy54ICsgKHRhcmdldFBvcy54LnZhbHVlIC0gc3RhcnRQb3MueCkgKiB0O1xuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbi55LnZhbHVlID0gc3RhcnRQb3MueSArICh0YXJnZXRQb3MueS52YWx1ZSAtIHN0YXJ0UG9zLnkpICogdDtcblxuICAgICAgICAgICAgLy8gSW50ZXJwb2xhdGUgc2NhbGVcbiAgICAgICAgICAgIHRoaXMuc2NhbGUueC52YWx1ZSA9IHN0YXJ0U2NhbGUueCArICh0YXJnZXRTY2FsZS54LnZhbHVlIC0gc3RhcnRTY2FsZS54KSAqIHQ7XG4gICAgICAgICAgICB0aGlzLnNjYWxlLnkudmFsdWUgPSBzdGFydFNjYWxlLnkudmFsdWUgKyAodGFyZ2V0U2NhbGUueS52YWx1ZSAtIHN0YXJ0U2NhbGUueSkgKiB0O1xuXG4gICAgICAgICAgICAvLyBJbnRlcnBvbGF0ZSByb3RhdGlvblxuICAgICAgICAgICAgdGhpcy5yb3RhdGlvbi52YWx1ZSA9IHN0YXJ0Um90YXRpb24gKyAodGFyZ2V0Um90YXRpb24gLSBzdGFydFJvdGF0aW9uKSAqIHQ7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnByb2dyZXNzLnZhbHVlIDwgMSkge1xuICAgICAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZSk7XG4gICAgfVxuXG4gICAgLy8gQ2hhaW4gYW5pbWF0aW9uc1xuICAgIHRoZW4oKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNoZWNrQ29tcGxldGUgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucHJvZ3Jlc3MudmFsdWUgPj0gMSkge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGNoZWNrQ29tcGxldGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBjaGVja0NvbXBsZXRlKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuLyoqXG4gKiBFeGFtcGxlIDg6IFJlYWN0aXZlIENTUyBMYXlvdXQgU3lzdGVtXG4gKiBTaG93cyBob3cgcmVhY3RpdmUgbWF0aCBjYW4gcG93ZXIgcmVzcG9uc2l2ZSBsYXlvdXRzXG4gKi9cbmV4cG9ydCBjbGFzcyBSZWFjdGl2ZUNTU0xheW91dCB7XG4gICAgcHJpdmF0ZSBjb250YWluZXI6IEhUTUxFbGVtZW50O1xuICAgIHByaXZhdGUgaXRlbXM6IEhUTUxFbGVtZW50W107XG4gICAgcHJpdmF0ZSBsYXlvdXRUeXBlOiAnZ3JpZCcgfCAnZmxleCcgfCAnYWJzb2x1dGUnO1xuICAgIHByaXZhdGUgc3BhY2luZzogUmV0dXJuVHlwZTx0eXBlb2YgbnVtYmVyUmVmPjtcbiAgICBwcml2YXRlIGl0ZW1TaXplOiBWZWN0b3IyRDtcblxuICAgIGNvbnN0cnVjdG9yKGNvbnRhaW5lcjogSFRNTEVsZW1lbnQsIGxheW91dFR5cGU6ICdncmlkJyB8ICdmbGV4JyB8ICdhYnNvbHV0ZScgPSAnZ3JpZCcpIHtcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XG4gICAgICAgIHRoaXMubGF5b3V0VHlwZSA9IGxheW91dFR5cGU7XG4gICAgICAgIHRoaXMuaXRlbXMgPSBBcnJheS5mcm9tKGNvbnRhaW5lci5jaGlsZHJlbikgYXMgSFRNTEVsZW1lbnRbXTtcbiAgICAgICAgdGhpcy5zcGFjaW5nID0gbnVtYmVyUmVmKDEwKTtcbiAgICAgICAgdGhpcy5pdGVtU2l6ZSA9IHZlY3RvcjJSZWYoMTAwLCAxMDApO1xuXG4gICAgICAgIHRoaXMuc2V0dXBSZWFjdGl2ZUxheW91dCgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0dXBSZWFjdGl2ZUxheW91dCgpIHtcbiAgICAgICAgLy8gUmVhY3QgdG8gY29udGFpbmVyIHNpemUgY2hhbmdlc1xuICAgICAgICBjb25zdCBjb250YWluZXJTaXplID0gbmV3IFJlYWN0aXZlRWxlbWVudFNpemUodGhpcy5jb250YWluZXIpO1xuXG4gICAgICAgIC8vIFVwZGF0ZSBsYXlvdXQgd2hlbiBjb250YWluZXIgc2l6ZSBvciBzcGFjaW5nIGNoYW5nZXNcbiAgICAgICAgb3BlcmF0ZWQoW2NvbnRhaW5lclNpemUud2lkdGgsIGNvbnRhaW5lclNpemUuaGVpZ2h0LCB0aGlzLnNwYWNpbmddLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUxheW91dCgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZUxheW91dCgpIHtcbiAgICAgICAgY29uc3QgY29udGFpbmVyUmVjdCA9IHRoaXMuY29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgIHN3aXRjaCAodGhpcy5sYXlvdXRUeXBlKSB7XG4gICAgICAgICAgICBjYXNlICdncmlkJzpcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUdyaWRMYXlvdXQoY29udGFpbmVyUmVjdCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdmbGV4JzpcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUZsZXhMYXlvdXQoY29udGFpbmVyUmVjdCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdhYnNvbHV0ZSc6XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVBYnNvbHV0ZUxheW91dChjb250YWluZXJSZWN0KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlR3JpZExheW91dChjb250YWluZXJSZWN0OiBET01SZWN0KSB7XG4gICAgICAgIGNvbnN0IGNvbHMgPSBNYXRoLmZsb29yKChjb250YWluZXJSZWN0LndpZHRoICsgdGhpcy5zcGFjaW5nLnZhbHVlKSAvICh0aGlzLml0ZW1TaXplLngudmFsdWUgKyB0aGlzLnNwYWNpbmcudmFsdWUpKTtcbiAgICAgICAgY29uc3Qgcm93cyA9IE1hdGguY2VpbCh0aGlzLml0ZW1zLmxlbmd0aCAvIGNvbHMpO1xuXG4gICAgICAgIHRoaXMuaXRlbXMuZm9yRWFjaCgoaXRlbSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHJvdyA9IE1hdGguZmxvb3IoaW5kZXggLyBjb2xzKTtcbiAgICAgICAgICAgIGNvbnN0IGNvbCA9IGluZGV4ICUgY29scztcblxuICAgICAgICAgICAgY29uc3QgeCA9IGNvbCAqICh0aGlzLml0ZW1TaXplLngudmFsdWUgKyB0aGlzLnNwYWNpbmcudmFsdWUpO1xuICAgICAgICAgICAgY29uc3QgeSA9IHJvdyAqICh0aGlzLml0ZW1TaXplLnkudmFsdWUgKyB0aGlzLnNwYWNpbmcudmFsdWUpO1xuXG4gICAgICAgICAgICBpdGVtLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgICAgIGl0ZW0uc3R5bGUubGVmdCA9IGAke3h9cHhgO1xuICAgICAgICAgICAgaXRlbS5zdHlsZS50b3AgPSBgJHt5fXB4YDtcbiAgICAgICAgICAgIGl0ZW0uc3R5bGUud2lkdGggPSBgJHt0aGlzLml0ZW1TaXplLngudmFsdWV9cHhgO1xuICAgICAgICAgICAgaXRlbS5zdHlsZS5oZWlnaHQgPSBgJHt0aGlzLml0ZW1TaXplLnkudmFsdWV9cHhgO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZUZsZXhMYXlvdXQoY29udGFpbmVyUmVjdDogRE9NUmVjdCkge1xuICAgICAgICAvLyBTaW1wbGUgZmxleCBsYXlvdXQgd2l0aCByZWFjdGl2ZSBzcGFjaW5nXG4gICAgICAgIGNvbnN0IHRvdGFsU3BhY2luZyA9ICh0aGlzLml0ZW1zLmxlbmd0aCAtIDEpICogdGhpcy5zcGFjaW5nLnZhbHVlO1xuICAgICAgICBjb25zdCBhdmFpbGFibGVXaWR0aCA9IGNvbnRhaW5lclJlY3Qud2lkdGggLSB0b3RhbFNwYWNpbmc7XG4gICAgICAgIGNvbnN0IGl0ZW1XaWR0aCA9IGF2YWlsYWJsZVdpZHRoIC8gdGhpcy5pdGVtcy5sZW5ndGg7XG5cbiAgICAgICAgdGhpcy5pdGVtcy5mb3JFYWNoKChpdGVtLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgeCA9IGluZGV4ICogKGl0ZW1XaWR0aCArIHRoaXMuc3BhY2luZy52YWx1ZSk7XG5cbiAgICAgICAgICAgIGl0ZW0uc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICAgICAgaXRlbS5zdHlsZS5sZWZ0ID0gYCR7eH1weGA7XG4gICAgICAgICAgICBpdGVtLnN0eWxlLnRvcCA9ICcwcHgnO1xuICAgICAgICAgICAgaXRlbS5zdHlsZS53aWR0aCA9IGAke2l0ZW1XaWR0aH1weGA7XG4gICAgICAgICAgICBpdGVtLnN0eWxlLmhlaWdodCA9IGAke3RoaXMuaXRlbVNpemUueS52YWx1ZX1weGA7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlQWJzb2x1dGVMYXlvdXQoY29udGFpbmVyUmVjdDogRE9NUmVjdCkge1xuICAgICAgICAvLyBQb3NpdGlvbiBpdGVtcyBhYnNvbHV0ZWx5IHdpdGggY29uc3RyYWludHNcbiAgICAgICAgdGhpcy5pdGVtcy5mb3JFYWNoKChpdGVtLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgLy8gVGhpcyB3b3VsZCB1c2UgY29uc3RyYWludCBzb2x2aW5nIHdpdGggcmVhY3RpdmUgbWF0aFxuICAgICAgICAgICAgLy8gRm9yIGRlbW8sIGp1c3QgcG9zaXRpb24gaW4gYSBjaXJjbGVcbiAgICAgICAgICAgIGNvbnN0IGFuZ2xlID0gKGluZGV4IC8gdGhpcy5pdGVtcy5sZW5ndGgpICogTWF0aC5QSSAqIDI7XG4gICAgICAgICAgICBjb25zdCByYWRpdXMgPSBNYXRoLm1pbihjb250YWluZXJSZWN0LndpZHRoLCBjb250YWluZXJSZWN0LmhlaWdodCkgKiAwLjM7XG4gICAgICAgICAgICBjb25zdCBjZW50ZXJYID0gY29udGFpbmVyUmVjdC53aWR0aCAvIDI7XG4gICAgICAgICAgICBjb25zdCBjZW50ZXJZID0gY29udGFpbmVyUmVjdC5oZWlnaHQgLyAyO1xuXG4gICAgICAgICAgICBjb25zdCB4ID0gY2VudGVyWCArIE1hdGguY29zKGFuZ2xlKSAqIHJhZGl1cyAtIHRoaXMuaXRlbVNpemUueC52YWx1ZSAvIDI7XG4gICAgICAgICAgICBjb25zdCB5ID0gY2VudGVyWSArIE1hdGguc2luKGFuZ2xlKSAqIHJhZGl1cyAtIHRoaXMuaXRlbVNpemUueS52YWx1ZSAvIDI7XG5cbiAgICAgICAgICAgIGl0ZW0uc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICAgICAgaXRlbS5zdHlsZS5sZWZ0ID0gYCR7eH1weGA7XG4gICAgICAgICAgICBpdGVtLnN0eWxlLnRvcCA9IGAke3l9cHhgO1xuICAgICAgICAgICAgaXRlbS5zdHlsZS53aWR0aCA9IGAke3RoaXMuaXRlbVNpemUueC52YWx1ZX1weGA7XG4gICAgICAgICAgICBpdGVtLnN0eWxlLmhlaWdodCA9IGAke3RoaXMuaXRlbVNpemUueS52YWx1ZX1weGA7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIFJlYWN0aXZlbHkgdXBkYXRlIGl0ZW0gc2l6ZVxuICAgIHNldEl0ZW1TaXplKHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuaXRlbVNpemUueC52YWx1ZSA9IHdpZHRoO1xuICAgICAgICB0aGlzLml0ZW1TaXplLnkudmFsdWUgPSBoZWlnaHQ7XG4gICAgICAgIHRoaXMudXBkYXRlTGF5b3V0KCk7XG4gICAgfVxuXG4gICAgLy8gUmVhY3RpdmVseSB1cGRhdGUgc3BhY2luZ1xuICAgIHNldFNwYWNpbmcoc3BhY2luZzogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuc3BhY2luZy52YWx1ZSA9IHNwYWNpbmc7XG4gICAgICAgIC8vIExheW91dCB1cGRhdGVzIGF1dG9tYXRpY2FsbHkgZHVlIHRvIHJlYWN0aXZlIHN1YnNjcmlwdGlvblxuICAgIH1cblxuICAgIC8vIEFkZCByZWFjdGl2ZSBpdGVtXG4gICAgYWRkSXRlbShpdGVtOiBIVE1MRWxlbWVudCkge1xuICAgICAgICB0aGlzLml0ZW1zLnB1c2goaXRlbSk7XG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKGl0ZW0pO1xuICAgICAgICB0aGlzLnVwZGF0ZUxheW91dCgpO1xuICAgIH1cblxuICAgIC8vIFJlbW92ZSBpdGVtIHJlYWN0aXZlbHlcbiAgICByZW1vdmVJdGVtKGl0ZW06IEhUTUxFbGVtZW50KSB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5pdGVtcy5pbmRleE9mKGl0ZW0pO1xuICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgdGhpcy5pdGVtcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgaXRlbS5yZW1vdmUoKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlTGF5b3V0KCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8qKlxuICogRXhhbXBsZSA5OiBSZWFjdGl2ZSBDU1MgU2Nyb2xsLWJhc2VkIEFuaW1hdGlvbnNcbiAqIERlbW9uc3RyYXRlcyBzY3JvbGwtZHJpdmVuIHJlYWN0aXZlIHRyYW5zZm9ybXNcbiAqL1xuZXhwb3J0IGNsYXNzIFJlYWN0aXZlU2Nyb2xsQW5pbWF0aW9uIHtcbiAgICBwcml2YXRlIGVsZW1lbnQ6IEhUTUxFbGVtZW50O1xuICAgIHByaXZhdGUgc2Nyb2xsOiBhbnk7IC8vIFdvdWxkIGJlIFJlYWN0aXZlU2Nyb2xsXG4gICAgcHJpdmF0ZSBzdGFydE9mZnNldDogbnVtYmVyO1xuICAgIHByaXZhdGUgZW5kT2Zmc2V0OiBudW1iZXI7XG4gICAgcHJpdmF0ZSB0cmFuc2Zvcm06IGFueTsgLy8gV291bGQgYmUgUmVhY3RpdmVUcmFuc2Zvcm1cblxuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQ6IEhUTUxFbGVtZW50LCBzdGFydE9mZnNldCA9IDAsIGVuZE9mZnNldCA9IDEwMDApIHtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcbiAgICAgICAgdGhpcy5zdGFydE9mZnNldCA9IHN0YXJ0T2Zmc2V0O1xuICAgICAgICB0aGlzLmVuZE9mZnNldCA9IGVuZE9mZnNldDtcblxuICAgICAgICAvLyB0aGlzLnNjcm9sbCA9IG5ldyBSZWFjdGl2ZVNjcm9sbCgpO1xuICAgICAgICAvLyB0aGlzLnRyYW5zZm9ybSA9IG5ldyBSZWFjdGl2ZVRyYW5zZm9ybSgpO1xuICAgICAgICB0aGlzLnNldHVwU2Nyb2xsQW5pbWF0aW9uKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXR1cFNjcm9sbEFuaW1hdGlvbigpIHtcbiAgICAgICAgLy8gQmluZCBzY3JvbGwgcHJvZ3Jlc3MgdG8gdHJhbnNmb3JtXG4gICAgICAgIC8vIGNvbnN0IHByb2dyZXNzID0gdGhpcy5zY3JvbGwucHJvZ3Jlc3MoJ3knKTtcbiAgICAgICAgLy8gb3BlcmF0ZWQoW3Byb2dyZXNzXSwgKCkgPT4ge1xuICAgICAgICAvLyAgICAgY29uc3QgdCA9IHByb2dyZXNzLnZhbHVlO1xuICAgICAgICAvLyAgICAgdGhpcy50cmFuc2Zvcm0ucmVzZXQoKTtcbiAgICAgICAgLy8gICAgIHRoaXMudHJhbnNmb3JtLnRyYW5zbGF0ZSgwLCB0ICogMTAwKTtcbiAgICAgICAgLy8gICAgIHRoaXMudHJhbnNmb3JtLnJvdGF0ZSh0ICogMzYwKTtcbiAgICAgICAgLy8gICAgIHRoaXMudHJhbnNmb3JtLnNjYWxlKDEgKyB0ICogMC41LCAxICsgdCAqIDAuNSk7XG4gICAgICAgIC8vIH0pO1xuICAgICAgICAvL1xuICAgICAgICAvLyAvLyBCaW5kIHRvIENTU1xuICAgICAgICAvLyBDU1NCaW5kZXIuYmluZFRyYW5zZm9ybSh0aGlzLmVsZW1lbnQsIHRoaXMudHJhbnNmb3JtLnZhbHVlKTtcbiAgICB9XG5cbiAgICAvLyBVcGRhdGUgc2Nyb2xsIHJhbmdlXG4gICAgc2V0U2Nyb2xsUmFuZ2Uoc3RhcnQ6IG51bWJlciwgZW5kOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5zdGFydE9mZnNldCA9IHN0YXJ0O1xuICAgICAgICB0aGlzLmVuZE9mZnNldCA9IGVuZDtcbiAgICAgICAgLy8gV291bGQgbmVlZCB0byB1cGRhdGUgc2Nyb2xsIHByb2dyZXNzIGNhbGN1bGF0aW9uXG4gICAgfVxuXG4gICAgLy8gQWRkIGtleWZyYW1lIGF0IHNwZWNpZmljIHNjcm9sbCBwcm9ncmVzc1xuICAgIGFkZEtleWZyYW1lKHByb2dyZXNzOiBudW1iZXIsIHRyYW5zZm9ybTogYW55KSB7XG4gICAgICAgIC8vIFdvdWxkIGltcGxlbWVudCBrZXlmcmFtZSBpbnRlcnBvbGF0aW9uXG4gICAgICAgIC8vIHRoaXMua2V5ZnJhbWVzLnNldChwcm9ncmVzcywgdHJhbnNmb3JtKTtcbiAgICB9XG59XG5cbi8vIEdyaWQgZXhhbXBsZXMgaGF2ZSBiZWVuIG1vdmVkIHRvIHNyYy9tYXRoL2ludGVncmF0aW9uLWV4YW1wbGVzLnRzXG4vLyBBbGwgZ3JpZCBjbGFzc2VzIGFyZSBub3cgYXZhaWxhYmxlIGZyb20gJ2Zlc3QvbHVyZScgb3IgJ2Zlc3QvbHVyZS9zcmMvbWF0aCdcbiJdfQ==