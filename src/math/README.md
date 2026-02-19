# Reactive Math Library

A comprehensive reactive math library for LUR.E that provides vector, matrix, and mathematical operations with automatic reactivity.

## Features

- **Reactive Primitives**: All operations automatically update when dependencies change
- **Vector Operations**: 2D, 3D, and 4D vector math with full reactivity
- **Matrix Support**: 2x2, 3x3, and 4x4 matrices
- **Component Integration**: Seamless integration with existing LUR.E components
- **Type Safety**: Full TypeScript support with proper type inference

## Basic Usage

```typescript
import { Vector2D, vector2Ref, addVector2D, multiplyVector2D } from "fest/lure/src/math";

const pos1 = vector2Ref(10, 20);
const pos2 = vector2Ref(5, 15);

// Reactive addition
const sum = addVector2D(pos1, pos2); // Vector2D with reactive components

// Reactive scaling
const scaled = multiplyVector2D(pos1, numberRef(2));

// Values update automatically when inputs change
pos1.x.value = 15; // sum.x updates automatically
```

## Integration with Existing Components

### Controllers (Draggable, Pointer API)

**Before**: Manual coordinate arrays
```typescript
const dragging = [numberRef(0), numberRef(0)]; // [x, y]
```

**After**: Reactive vectors
```typescript
import { ReactiveDraggable } from "fest/lure/src/math";

const draggable = new ReactiveDraggable(100, 200);
// Physics-based movement with automatic reactivity
draggable.applyForce(vector2Ref(0, -9.8)); // gravity
draggable.update(0.016); // 60fps
```

### Space Reference (Bounding Boxes)

**Before**: Arrays of reactive refs
```typescript
const area = [numberRef(0), numberRef(0), numberRef(0), numberRef(0)]; // [x, y, w, h]
```

**After**: Reactive bounding boxes
```typescript
import { ReactiveBoundingBox } from "fest/lure/src/math";

const bbox = new ReactiveBoundingBox(element);
// Reactive center point, corners, collision detection
const center = bbox.center; // reactive Vector2D
const containsPoint = bbox.contains(vector2Ref(50, 50)); // reactive boolean
```

### Layout Components (Grid, Orient)

**Before**: Manual CSS custom properties
```typescript
setStyleProperty(element, "--drag-x", dx);
setStyleProperty(element, "--drag-y", dy);
```

**After**: Reactive transformations
```typescript
import { ReactiveGridTransform } from "fest/lure/src/math";

const transform = new ReactiveGridTransform();
// Apply transformations reactively
const screenPos = transform.gridToScreen(5, 3, 32); // grid to screen coords
const gridPos = transform.screenToGrid(160, 96, 32); // screen to grid coords
```

## Available Operations

### Scalar Operations
- `addRef(a, b)`, `subtractRef(a, b)`, `multiplyRef(a, b)`, `divideRef(a, b)`
- `sinRef(a)`, `cosRef(a)`, `tanRef(a)`, `sqrtRef(a)`, `absRef(a)`
- `clampRef(a, min, max)`, `powerRef(a, b)`

### Vector Operations (2D, 3D, 4D)
- `addVector2D(a, b)`, `subtractVector2D(a, b)`
- `multiplyVector2D(vec, scalar)`, `divideVector2D(vec, scalar)`
- `dotProduct2D(a, b)`, `crossProduct3D(a, b)`
- `magnitude2D(vec)`, `normalize2D(vec)`

### Rectangle/Bounding Box Operations
Complete reactive rectangle mathematics for UI layout and collision detection.

- **Creation**: `createRect2D(x, y, width, height)`
- **Properties**: `rectCenter(rect)`, `rectArea(rect)`
- **Containment**: `rectContainsPoint(rect, point)`, `pointToRectDistance(point, rect)`
- **Collision**: `rectIntersects(rectA, rectB)`, `rectUnion(rectA, rectB)`
- **Constraints**: `clampPointToRect(point, rect)`, `constrainRectAspectRatio(rect, ratio)`
- **Transformation**: `scaleRectAroundCenter(rect, scale)`, `transformRect2D(rect, transformFn)`

### Grid Mathematics (New!)
Specialized mathematics for grid-based layouts and interactions.

#### Grid Coordinates
- **Creation**: `GridCoordUtils.create(row, col)`
- **Conversion**: `GridCoordUtils.toPixel(coord, config)`, `GridCoordUtils.fromPixel(pixel, config)`
- **Snapping**: `GridCoordUtils.snapToGrid(pixel, config)`, `GridCoordUtils.snapToCellCenter(pixel, config)`
- **Navigation**: `GridCoordUtils.adjacent(coord, direction)`, `GridCoordUtils.isValid(coord, config)`
- **Distance**: `GridCoordUtils.manhattanDistance(a, b)`, `GridCoordUtils.euclideanDistance(a, b)`

#### Grid Cells (with Spanning)
- **Creation**: `GridCellUtils.create(row, col, rowSpan, colSpan)`
- **Geometry**: `GridCellUtils.toRect(cell, config)`, `GridCellUtils.getCenter(cell, config)`
- **Collision**: `GridCellUtils.overlaps(cellA, cellB)`, `GridCellUtils.getOccupiedCells(cell)`

#### Grid Layout Algorithms
- **Arrangement**: `GridLayoutUtils.fitCells(cells, config)`, `GridLayoutUtils.redistributeCells(cells, config, algorithm)`
- **Optimization**: `GridLayoutUtils.calculateOptimalSize(cells)`

#### Grid Animation & Interaction
- **Movement**: `GridAnimationUtils.animateCellMovement(cell, targetCoord, config, duration)`
- **Resizing**: `GridAnimationUtils.animateCellResize(cell, rowSpan, colSpan, duration)`
- **Chaining**: `GridAnimationUtils.createAnimationChain(cell, config).moveTo(coord).then(callback)`

#### Grid Interaction Utilities
- **Positioning**: `GridInteractionUtils.getCellAtPixel(pixel, config)`, `GridInteractionUtils.getCellsInRect(rect, config)`
- **Drag Preview**: `GridInteractionUtils.calculateDragPreview(cell, dragPos, config, existingCells)`
- **Validation**: `GridInteractionUtils.findValidPositions(cell, config, existingCells)`

### CSS Integration and Utilities (New!)
Complete CSS binding system with reactive transforms, units, and animations.

#### Unit Conversion Utilities
- **CSSUnitUtils.asPx()**: Convert reactive values to CSS pixels
- **CSSUnitUtils.asPercent()**: Convert to percentages
- **CSSUnitUtils.asEm/Rem()**: Convert to relative units
- **CSSUnitUtils.asVw/Vh()**: Convert to viewport units
- **CSSUnitUtils.asUnit()**: Generic unit conversion with fallbacks
- **CSSUnitUtils.calc()**: Create CSS calc() expressions
- **CSSUnitUtils.clamp/min/max()**: Reactive CSS math functions

#### Transform and Binding System
- **CSSTransform**: Reactive CSS transform matrices and operations
- **CSSPosition**: Reactive positioning utilities
- **CSSBinder**: Bind reactive values directly to CSS properties
- **CSSCalc**: Reactive CSS calc() expressions with min/max/clamp
- **CSSCustomProps**: Reactive CSS custom properties

#### UI Control Integration
- **CSSInputControls**: Specialized input/slider control bindings
- **CSSScrollbarControls**: Advanced scrollbar theming and interaction
- **CSSMomentumScrolling**: Physics-based scrolling with momentum
- **CSSInteractionStates**: Reactive focus, hover, and active states

#### Unified Usage Examples
```typescript
// Unit conversions (handles numbers, strings, and reactive values)
const width = CSSUnitUtils.asPx(reactiveWidth);        // "120px"
const height = CSSUnitUtils.asPercent(0.5);            // "50%"
const margin = CSSUnitUtils.asEm(spacing);             // "1.5em"

// CSS calc expressions
const totalWidth = CSSUnitUtils.calc("100% - 20px");
const clampedSize = CSSUnitUtils.clamp("10px", reactiveSize, "200px");

// Reactive binding with automatic unit conversion
CSSBinder.bindTransform(element, reactiveTransform);
CSSInputControls.bindSliderThumb(slider, value, min, max, trackWidth);
```

### Utility Functions
- `translate2D(vec, tx, ty)` - Translate a vector
- `scale2D(vec, sx, sy)` - Scale a vector
- `rotate2D(vec, angle)` - Rotate a vector around origin
- `vectorFromArray(arr)` - Convert reactive array to vector
- `vectorToArray(vec)` - Convert vector to reactive array

## Advanced Examples

### Physics-Based Animation

```typescript
const particle = new ReactiveDraggable(0, 0);
const gravity = vector2Ref(0, 9.8);

// Apply physics each frame
function animate() {
    particle.applyForce(gravity);
    particle.update(1/60); // 60fps

    // Use position for rendering
    element.style.transform = `translate(${particle.position.x.value}px, ${particle.position.y.value}px)`;

    requestAnimationFrame(animate);
}
```

### Reactive Collision Detection

```typescript
const box1 = new ReactiveBoundingBox(element1);
const box2 = new ReactiveBoundingBox(element2);

// Reactive collision detection
const isColliding = computed([box1.center, box2.center], () => {
    const distance = magnitude2D(subtractVector2D(box1.center, box2.center));
    return distance.value < 50; // collision threshold
});

// React to collisions
affected(isColliding, (colliding) => {
    if (colliding.value) {
        element1.style.backgroundColor = 'red';
        element2.style.backgroundColor = 'red';
    } else {
        element1.style.backgroundColor = 'blue';
        element2.style.backgroundColor = 'blue';
    }
});
```

### Smooth Animations

```typescript
import { ReactiveAnimation } from "fest/lure/src/math";

const startPos = vector2Ref(0, 0);
const endPos = vector2Ref(200, 100);

const animation = new ReactiveAnimation(startPos, endPos, 1000, easeOutCubic);

function animate(currentTime: number) {
    animation.update(currentTime, startTime);

    element.style.transform = `translate(${animation.getCurrentValue().x.value}px, ${animation.getCurrentValue().y.value}px)`;

    if (!animation.isComplete()) {
        requestAnimationFrame(animate);
    }
}
```

## Performance Benefits

- **Automatic Dependency Tracking**: Only recomputes when inputs change
- **Lazy Evaluation**: Computations only run when values are accessed
- **Memory Efficient**: Reuses reactive references instead of creating new ones
- **Type Safe**: Compile-time guarantees prevent math errors

## Migration Guide

### From Arrays to Vectors

**Before:**
```typescript
const pos = [numberRef(0), numberRef(0)];
pos[0].value += 10;
```

**After:**
```typescript
const pos = vector2Ref(0, 0);
pos.x.value += 10;
```

### From Manual Computations to Reactive

**Before:**
```typescript
const sum = numberRef(0);
affected([a, b], () => {
    sum.value = a.value + b.value;
});
```

**After:**
```typescript
const sum = addRef(a, b); // Automatically reactive
```

This reactive math library transforms LUR.E components from imperative coordinate management to declarative, reactive vector mathematics!
