# LUR.E Reactive Math Library

## Overview

A comprehensive reactive math library that seamlessly integrates with LUR.E components, providing automatic reactivity for vector operations, matrix transformations, and mathematical computations.

## Reactive Primitives

### 1D Primitives
- `numberRef` - Reactive numbers (from fest/object)
- `booleanRef` - Reactive booleans (from fest/object)

### 2D/3D/4D Vectors
- `Vector2D` - Reactive 2D vectors with x, y components
- `Vector3D` - Reactive 3D vectors with x, y, z components
- `Vector4D` - Reactive 4D vectors with x, y, z, w components

### Matrices
- `Matrix2D` - 2x2 reactive matrices
- `Matrix3D` - 3x3 reactive matrices
- `Matrix4D` - 4x4 reactive matrices

## Operations

### Scalar Operations
All operations return reactive `numberRef` instances that automatically update when dependencies change.

- **Arithmetic**: `addRef`, `subtractRef`, `multiplyRef`, `divideRef`, `modulusRef`, `powerRef`
- **Trigonometric**: `sinRef`, `cosRef`, `tanRef`, `asinRef`, `acosRef`, `atanRef`, `atan2Ref`
- **Utilities**: `absoluteRef`, `signRef`, `clampRef`, `squareRootRef`, `cubeRootRef`, `hypotRef`

### Vector Operations
All vector operations return reactive vectors with components that update automatically.

- **Arithmetic**: `addVector2D/3D/4D`, `subtractVector2D/3D/4D`, `multiplyVector2D/3D/4D` (scalar), `divideVector2D/3D/4D` (scalar)
- **Products**: `dotProduct2D/3D/4D`, `crossProduct3D`
- **Geometry**: `magnitude2D/3D/4D`, `normalize2D/3D/4D`

### Transformation Utilities
- **Translation**: `translate2D(vec, tx, ty)`
- **Scaling**: `scale2D(vec, sx, sy)`
- **Rotation**: `rotate2D(vec, angle)`

## Integration Examples

### Controllers (Draggable, PointerAPI)
```typescript
// Instead of: const dragging = [numberRef(0), numberRef(0)];
const position = vector2Ref(0, 0); // Reactive Vector2D

// Physics-based movement
const draggable = new ReactiveDraggable();
draggable.applyForce(vector2Ref(0, -9.8)); // gravity
```

### Space Reference (BBoxAnchor)
```typescript
// Instead of: const area = [numberRef(0), numberRef(0), numberRef(0), numberRef(0)];
const bbox = new ReactiveBoundingBox(element);
// Reactive center, corners, collision detection
const center = bbox.center; // reactive Vector2D
```

### Layout (Grid, Orient)
```typescript
const transform = new ReactiveGridTransform();
// Reactive grid-to-screen transformations
const screenPos = transform.gridToScreen(5, 3, 32);
const gridPos = transform.screenToGrid(160, 96, 32);
```

### Core Components
```typescript
// Smooth reactive animations
const animation = new ReactiveAnimation(startVec, endVec, 1000, easeOutCubic);
// Physics-based interactions
const pointer = new ReactivePointer();
// Automatic collision detection
const isColliding = bbox.contains(pointer.position);
```

## Key Features

### Automatic Reactivity
- All operations automatically update when inputs change
- Lazy evaluation - computations only run when accessed
- Memory efficient - reuses reactive references

### Type Safety
- Full TypeScript support with proper type inference
- Compile-time guarantees prevent math errors
- IntelliSense support for all operations

### Component Compatibility
- Drop-in replacement for existing coordinate arrays
- Seamless integration with DOM APIs
- Works with CSS custom properties and transforms

### Performance Optimized
- Dependency tracking prevents unnecessary recalculations
- Vector operations batch component updates
- Compatible with requestAnimationFrame loops

## Usage Patterns

### From Arrays to Vectors
```typescript
// Before: Manual arrays
const pos = [numberRef(0), numberRef(0)];
pos[0].value += 10;

// After: Reactive vectors
const pos = vector2Ref(0, 0);
pos.x.value += 10;
```

### From Manual Computations to Reactive
```typescript
// Before: Manual subscription
const sum = numberRef(0);
subscribe([a, b], () => { sum.value = a.value + b.value; });

// After: Automatic reactivity
const sum = addRef(a, b);
```

### From Imperative to Declarative
```typescript
// Before: Manual updates
function updatePosition() {
    x += velocityX * deltaTime;
    y += velocityY * deltaTime;
}

// After: Reactive relationships
const position = addVector2D(
    position,
    multiplyVector2D(velocity, numberRef(deltaTime))
);
```

This reactive math library transforms LUR.E from imperative coordinate management to declarative, reactive vector mathematics! 🚀
