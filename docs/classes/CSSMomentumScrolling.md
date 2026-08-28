[**@fest-lib/lure v0.1.48**](../README.md)

***

[@fest-lib/lure](../README.md) / CSSMomentumScrolling

# Class: CSSMomentumScrolling

Defined in: lur.e/src/design/anchor/CSSAdapter.ts:755

## Constructors

### Constructor

```ts
new CSSMomentumScrolling(): CSSMomentumScrolling;
```

#### Returns

`CSSMomentumScrolling`

## Methods

### createBounceBack()

```ts
static createBounceBack(
   element, 
   overScroll, 
duration?): Promise<void>;
```

Defined in: lur.e/src/design/anchor/CSSAdapter.ts:787

#### Parameters

##### element

`HTMLElement`

##### overScroll

`any`

##### duration?

`number` = `300`

#### Returns

`Promise`\<`void`\>

***

### createMomentumScroll()

```ts
static createMomentumScroll(
   element, 
   velocity, 
deceleration?): Promise<void>;
```

Defined in: lur.e/src/design/anchor/CSSAdapter.ts:757

#### Parameters

##### element

`HTMLElement`

##### velocity

`any`

##### deceleration?

`number` = `0.92`

#### Returns

`Promise`\<`void`\>
