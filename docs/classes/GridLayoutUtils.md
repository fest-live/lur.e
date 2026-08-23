[**@fest-lib/lure v0.1.47**](../README.md)

***

[@fest-lib/lure](../README.md) / GridLayoutUtils

# Class: GridLayoutUtils

Defined in: lur.e/src/utils/math/GridMath.ts:232

Grid layout algorithms

## Constructors

### Constructor

```ts
new GridLayoutUtils(): GridLayoutUtils;
```

#### Returns

`GridLayoutUtils`

## Methods

### calculateOptimalSize()

```ts
static calculateOptimalSize(cells): object;
```

Defined in: lur.e/src/utils/math/GridMath.ts:284

#### Parameters

##### cells

[`GridCell`](../interfaces/GridCell.md)[]

#### Returns

`object`

##### cols

```ts
cols: number;
```

##### rows

```ts
rows: number;
```

***

### canPlaceCell()

```ts
static canPlaceCell(
   cell, 
   occupied, 
   config): boolean;
```

Defined in: lur.e/src/utils/math/GridMath.ts:264

#### Parameters

##### cell

[`GridCell`](../interfaces/GridCell.md)

##### occupied

`Set`\<`string`\>

##### config

[`GridConfig`](../interfaces/GridConfig.md)

#### Returns

`boolean`

***

### fitCells()

```ts
static fitCells(cells, config): GridCell[];
```

Defined in: lur.e/src/utils/math/GridMath.ts:234

#### Parameters

##### cells

[`GridCell`](../interfaces/GridCell.md)[]

##### config

[`GridConfig`](../interfaces/GridConfig.md)

#### Returns

[`GridCell`](../interfaces/GridCell.md)[]

***

### markOccupied()

```ts
static markOccupied(cell, occupied): void;
```

Defined in: lur.e/src/utils/math/GridMath.ts:276

#### Parameters

##### cell

[`GridCell`](../interfaces/GridCell.md)

##### occupied

`Set`\<`string`\>

#### Returns

`void`

***

### redistributeCells()

```ts
static redistributeCells(
   cells, 
   config, 
   algorithm?): GridCell[];
```

Defined in: lur.e/src/utils/math/GridMath.ts:296

#### Parameters

##### cells

[`GridCell`](../interfaces/GridCell.md)[]

##### config

[`GridConfig`](../interfaces/GridConfig.md)

##### algorithm?

`"row-major"` \| `"column-major"` \| `"diagonal"`

#### Returns

[`GridCell`](../interfaces/GridCell.md)[]
