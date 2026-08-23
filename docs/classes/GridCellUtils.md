[**@fest-lib/lure v0.1.47**](../README.md)

***

[@fest-lib/lure](../README.md) / GridCellUtils

# Class: GridCellUtils

Defined in: lur.e/src/utils/math/GridMath.ts:152

Grid cell utilities with span support

## Constructors

### Constructor

```ts
new GridCellUtils(): GridCellUtils;
```

#### Returns

`GridCellUtils`

## Methods

### create()

```ts
static create(
   row?, 
   col?, 
   rowSpan?, 
   colSpan?): GridCell;
```

Defined in: lur.e/src/utils/math/GridMath.ts:154

#### Parameters

##### row?

`number` = `0`

##### col?

`number` = `0`

##### rowSpan?

`number` = `1`

##### colSpan?

`number` = `1`

#### Returns

[`GridCell`](../interfaces/GridCell.md)

***

### getCenter()

```ts
static getCenter(cell, config): Vector2D;
```

Defined in: lur.e/src/utils/math/GridMath.ts:186

#### Parameters

##### cell

[`GridCell`](../interfaces/GridCell.md)

##### config

[`GridConfig`](../interfaces/GridConfig.md)

#### Returns

[`Vector2D`](Vector2D.md)

***

### getOccupiedCells()

```ts
static getOccupiedCells(cell): GridCoord[];
```

Defined in: lur.e/src/utils/math/GridMath.ts:213

#### Parameters

##### cell

[`GridCell`](../interfaces/GridCell.md)

#### Returns

[`GridCoord`](../interfaces/GridCoord.md)[]

***

### overlaps()

```ts
static overlaps(a, b): any;
```

Defined in: lur.e/src/utils/math/GridMath.ts:197

#### Parameters

##### a

[`GridCell`](../interfaces/GridCell.md)

##### b

[`GridCell`](../interfaces/GridCell.md)

#### Returns

`any`

***

### toRect()

```ts
static toRect(cell, config): Rect2D;
```

Defined in: lur.e/src/utils/math/GridMath.ts:164

#### Parameters

##### cell

[`GridCell`](../interfaces/GridCell.md)

##### config

[`GridConfig`](../interfaces/GridConfig.md)

#### Returns

[`Rect2D`](../interfaces/Rect2D.md)
