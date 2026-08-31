[**@fest-lib/lure v0.1.53**](../README.md)

***

[@fest-lib/lure](../README.md) / GridInteractionUtils

# Class: GridInteractionUtils

Defined in: lur.e/src/utils/math/GridMath.ts:432

Grid collision and interaction utilities

## Constructors

### Constructor

```ts
new GridInteractionUtils(): GridInteractionUtils;
```

#### Returns

`GridInteractionUtils`

## Methods

### calculateDragPreview()

```ts
static calculateDragPreview(
   cell, 
   dragPosition, 
   config, 
   existingCells): GridCoord;
```

Defined in: lur.e/src/utils/math/GridMath.ts:492

#### Parameters

##### cell

[`GridCell`](../interfaces/GridCell.md)

##### dragPosition

[`Vector2D`](Vector2D.md)

##### config

[`GridConfig`](../interfaces/GridConfig.md)

##### existingCells

[`GridCell`](../interfaces/GridCell.md)[]

#### Returns

[`GridCoord`](../interfaces/GridCoord.md)

***

### findValidPositions()

```ts
static findValidPositions(
   cell, 
   config, 
   existingCells): GridCoord[];
```

Defined in: lur.e/src/utils/math/GridMath.ts:476

#### Parameters

##### cell

[`GridCell`](../interfaces/GridCell.md)

##### config

[`GridConfig`](../interfaces/GridConfig.md)

##### existingCells

[`GridCell`](../interfaces/GridCell.md)[]

#### Returns

[`GridCoord`](../interfaces/GridCoord.md)[]

***

### getCellAtPixel()

```ts
static getCellAtPixel(pixel, config): GridCoord;
```

Defined in: lur.e/src/utils/math/GridMath.ts:434

#### Parameters

##### pixel

[`Vector2D`](Vector2D.md)

##### config

[`GridConfig`](../interfaces/GridConfig.md)

#### Returns

[`GridCoord`](../interfaces/GridCoord.md)

***

### getCellsInRect()

```ts
static getCellsInRect(rect, config): GridCoord[];
```

Defined in: lur.e/src/utils/math/GridMath.ts:439

#### Parameters

##### rect

[`Rect2D`](../interfaces/Rect2D.md)

##### config

[`GridConfig`](../interfaces/GridConfig.md)

#### Returns

[`GridCoord`](../interfaces/GridCoord.md)[]

***

### wouldOverlap()

```ts
static wouldOverlap(
   cell, 
   newCoord, 
   existingCells): boolean;
```

Defined in: lur.e/src/utils/math/GridMath.ts:462

#### Parameters

##### cell

[`GridCell`](../interfaces/GridCell.md)

##### newCoord

[`GridCoord`](../interfaces/GridCoord.md)

##### existingCells

[`GridCell`](../interfaces/GridCell.md)[]

#### Returns

`boolean`
