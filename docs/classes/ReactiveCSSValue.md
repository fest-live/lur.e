[**@fest-lib/lure v0.1.53**](../README.md)

***

[@fest-lib/lure](../README.md) / ReactiveCSSValue

# Class: ReactiveCSSValue

Defined in: lur.e/src/design/anchor/Utils.ts:30

## Constructors

### Constructor

```ts
new ReactiveCSSValue(initialValue, unit?): ReactiveCSSValue;
```

Defined in: lur.e/src/design/anchor/Utils.ts:34

#### Parameters

##### initialValue

`string` \| `number`

##### unit?

`string` = `'px'`

#### Returns

`ReactiveCSSValue`

## Accessors

### cssValue

#### Get Signature

```ts
get cssValue(): any;
```

Defined in: lur.e/src/design/anchor/Utils.ts:44

##### Returns

`any`

## Methods

### bindTo()

```ts
bindTo(element, property): () => void;
```

Defined in: lur.e/src/design/anchor/Utils.ts:54

#### Parameters

##### element

`HTMLElement`

##### property

`string`

#### Returns

() => `void`

***

### toUnit()

```ts
toUnit(targetUnit): any;
```

Defined in: lur.e/src/design/anchor/Utils.ts:49

#### Parameters

##### targetUnit

`string`

#### Returns

`any`
