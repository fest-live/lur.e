[**@fest-lib/lure v0.1.21**](../README.md)

***

[@fest-lib/lure](../README.md) / GridCoordUtils

# Class: GridCoordUtils

Defined in: lur.e/src/utils/math/GridMath.ts:38

Grid coordinate utilities

## Constructors

### Constructor

```ts
new GridCoordUtils(): GridCoordUtils;
```

#### Returns

`GridCoordUtils`

## Methods

### adjacent()

```ts
static adjacent(coord, direction): GridCoord;
```

Defined in: lur.e/src/utils/math/GridMath.ts:108

#### Parameters

##### coord

[`GridCoord`](../interfaces/GridCoord.md)

##### direction

`"left"` \| `"right"` \| `"up"` \| `"down"`

#### Returns

[`GridCoord`](../interfaces/GridCoord.md)

***

### create()

```ts
static create(row?, col?): GridCoord;
```

Defined in: lur.e/src/utils/math/GridMath.ts:40

#### Parameters

##### row?

`number` = `0`

##### col?

`number` = `0`

#### Returns

[`GridCoord`](../interfaces/GridCoord.md)

***

### euclideanDistance()

```ts
static euclideanDistance(a, b): any;
```

Defined in: lur.e/src/utils/math/GridMath.ts:139

#### Parameters

##### a

[`GridCoord`](../interfaces/GridCoord.md)

##### b

[`GridCoord`](../interfaces/GridCoord.md)

#### Returns

`any`

***

### fromPixel()

```ts
static fromPixel(pixel, config): GridCoord;
```

Defined in: lur.e/src/utils/math/GridMath.ts:63

#### Parameters

##### pixel

[`Vector2D`](Vector2D.md)

##### config

[`GridConfig`](../interfaces/GridConfig.md)

#### Returns

[`GridCoord`](../interfaces/GridCoord.md)

***

### isValid()

```ts
static isValid(coord, config): any;
```

Defined in: lur.e/src/utils/math/GridMath.ts:124

#### Parameters

##### coord

[`GridCoord`](../interfaces/GridCoord.md)

##### config

[`GridConfig`](../interfaces/GridConfig.md)

#### Returns

`any`

***

### manhattanDistance()

```ts
static manhattanDistance(a, b): any;
```

Defined in: lur.e/src/utils/math/GridMath.ts:132

#### Parameters

##### a

[`GridCoord`](../interfaces/GridCoord.md)

##### b

[`GridCoord`](../interfaces/GridCoord.md)

#### Returns

`any`

***

### snapToCellCenter()

```ts
static snapToCellCenter(pixel, config): Vector2D;
```

Defined in: lur.e/src/utils/math/GridMath.ts:93

#### Parameters

##### pixel

[`Vector2D`](Vector2D.md)

##### config

[`GridConfig`](../interfaces/GridConfig.md)

#### Returns

[`Vector2D`](Vector2D.md)

***

### snapToGrid()

```ts
static snapToGrid(pixel, config): Vector2D;
```

Defined in: lur.e/src/utils/math/GridMath.ts:87

#### Parameters

##### pixel

[`Vector2D`](Vector2D.md)

##### config

[`GridConfig`](../interfaces/GridConfig.md)

#### Returns

[`Vector2D`](Vector2D.md)

***

### toPixel()

```ts
static toPixel(coord, config): Vector2D;
```

Defined in: lur.e/src/utils/math/GridMath.ts:48

#### Parameters

##### coord

[`GridCoord`](../interfaces/GridCoord.md)

##### config

[`GridConfig`](../interfaces/GridConfig.md)

#### Returns

[`Vector2D`](Vector2D.md)
