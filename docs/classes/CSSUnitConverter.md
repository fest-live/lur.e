[**@fest-lib/lure v0.1.50**](../README.md)

***

[@fest-lib/lure](../README.md) / CSSUnitConverter

# Class: CSSUnitConverter

Defined in: lur.e/src/design/anchor/CSSAdapter.ts:10

## Constructors

### Constructor

```ts
new CSSUnitConverter(): CSSUnitConverter;
```

#### Returns

`CSSUnitConverter`

## Methods

### convertUnits()

```ts
static convertUnits(
   value, 
   fromUnit, 
   toUnit, 
   element?): number;
```

Defined in: lur.e/src/design/anchor/CSSAdapter.ts:66

#### Parameters

##### value

`number`

##### fromUnit

`string`

##### toUnit

`string`

##### element?

`HTMLElement`

#### Returns

`number`

***

### fromPixels()

```ts
static fromPixels(pixels, unit?): string;
```

Defined in: lur.e/src/design/anchor/CSSAdapter.ts:39

#### Parameters

##### pixels

`number`

##### unit?

`"em"` \| `"px"` \| `"rem"` \| `"%"`

#### Returns

`string`

***

### parseValue()

```ts
static parseValue(cssValue): object;
```

Defined in: lur.e/src/design/anchor/CSSAdapter.ts:55

#### Parameters

##### cssValue

`string`

#### Returns

`object`

##### unit

```ts
unit: string;
```

##### value

```ts
value: number;
```

***

### toPixels()

```ts
static toPixels(value, element?): number;
```

Defined in: lur.e/src/design/anchor/CSSAdapter.ts:23

#### Parameters

##### value

`string`

##### element?

`HTMLElement`

#### Returns

`number`
