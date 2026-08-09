[**@fest-lib/lure v0.1.15**](../README.md)

***

[@fest-lib/lure](../README.md) / GridAnimationUtils

# Class: GridAnimationUtils

Defined in: lur.e/src/utils/math/GridMath.ts:343

Grid animation and transition utilities

## Constructors

### Constructor

```ts
new GridAnimationUtils(): GridAnimationUtils;
```

#### Returns

`GridAnimationUtils`

## Methods

### animateCellMovement()

```ts
static animateCellMovement(
   cell, 
   targetCoord, 
   config, 
duration?): Promise<void>;
```

Defined in: lur.e/src/utils/math/GridMath.ts:345

#### Parameters

##### cell

[`GridCell`](../interfaces/GridCell.md)

##### targetCoord

[`GridCoord`](../interfaces/GridCoord.md)

##### config

[`GridConfig`](../interfaces/GridConfig.md)

##### duration?

`number` = `300`

#### Returns

`Promise`\<`void`\>

***

### animateCellResize()

```ts
static animateCellResize(
   cell, 
   targetRowSpan, 
   targetColSpan, 
duration?): Promise<void>;
```

Defined in: lur.e/src/utils/math/GridMath.ts:381

#### Parameters

##### cell

[`GridCell`](../interfaces/GridCell.md)

##### targetRowSpan

`number`

##### targetColSpan

`number`

##### duration?

`number` = `300`

#### Returns

`Promise`\<`void`\>

***

### createAnimationChain()

```ts
static createAnimationChain(cell, config): object;
```

Defined in: lur.e/src/utils/math/GridMath.ts:414

#### Parameters

##### cell

[`GridCell`](../interfaces/GridCell.md)

##### config

[`GridConfig`](../interfaces/GridConfig.md)

#### Returns

`object`

##### moveTo

```ts
moveTo: (targetCoord, duration?) => Promise<void>;
```

###### Parameters

###### targetCoord

[`GridCoord`](../interfaces/GridCoord.md)

###### duration?

`number`

###### Returns

`Promise`\<`void`\>

##### resizeTo

```ts
resizeTo: (rowSpan, colSpan, duration?) => Promise<void>;
```

###### Parameters

###### rowSpan

`number`

###### colSpan

`number`

###### duration?

`number`

###### Returns

`Promise`\<`void`\>

##### then

```ts
then: (callback) => any;
```

###### Parameters

###### callback

() => `void`

###### Returns

`any`
