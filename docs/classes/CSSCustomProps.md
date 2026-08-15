[**@fest-lib/lure v0.1.33**](../README.md)

***

[@fest-lib/lure](../README.md) / CSSCustomProps

# Class: CSSCustomProps

Defined in: lur.e/src/design/anchor/CSSAdapter.ts:439

## Constructors

### Constructor

```ts
new CSSCustomProps(): CSSCustomProps;
```

#### Returns

`CSSCustomProps`

## Methods

### bindProperty()

```ts
static bindProperty(
   element, 
   propName, 
   value, 
   unit?): () => void;
```

Defined in: lur.e/src/design/anchor/CSSAdapter.ts:441

#### Parameters

##### element

`HTMLElement`

##### propName

`string`

##### value

`any`

##### unit?

`string` = `''`

#### Returns

() => `void`

***

### bindVectorProperties()

```ts
static bindVectorProperties(
   element, 
   baseName, 
   vector, 
   unit?): () => void;
```

Defined in: lur.e/src/design/anchor/CSSAdapter.ts:449

#### Parameters

##### element

`HTMLElement`

##### baseName

`string`

##### vector

[`Vector2D`](Vector2D.md)

##### unit?

`string` = `'px'`

#### Returns

() => `void`

***

### getReactiveProperty()

```ts
static getReactiveProperty(element, propName): any;
```

Defined in: lur.e/src/design/anchor/CSSAdapter.ts:456

#### Parameters

##### element

`HTMLElement`

##### propName

`string`

#### Returns

`any`
