[**@fest-lib/lure v0.1.59**](../README.md)

***

[@fest-lib/lure](../README.md) / CSSAnchor

# Class: CSSAnchor

Defined in: lur.e/src/design/anchor/CSSAnchor.ts:8

## Constructors

### Constructor

```ts
new CSSAnchor(source): CSSAnchor;
```

Defined in: lur.e/src/design/anchor/CSSAnchor.ts:13

#### Parameters

##### source

`HTMLElement`

#### Returns

`CSSAnchor`

## Properties

### anchorId

```ts
anchorId: string;
```

Defined in: lur.e/src/design/anchor/CSSAnchor.ts:10

***

### source

```ts
source: HTMLElement;
```

Defined in: lur.e/src/design/anchor/CSSAnchor.ts:9

## Methods

### connectElement()

```ts
connectElement(connect, __namedParameters): CSSAnchor;
```

Defined in: lur.e/src/design/anchor/CSSAnchor.ts:21

#### Parameters

##### connect

`HTMLElement`

##### \_\_namedParameters

###### inset?

`number` = `0`

###### placement?

`string` = `"fill"`

###### size?

`string` = `"100%"`

###### transformOrigin?

`string` = `"50% 50%"`

###### zIndexShift?

`number` = `1`

#### Returns

`CSSAnchor`

***

### connectWithContainerQuery()

```ts
connectWithContainerQuery(connect, __namedParameters): () => void | undefined;
```

Defined in: lur.e/src/design/anchor/CSSAnchor.ts:79

#### Parameters

##### connect

`HTMLElement`

##### \_\_namedParameters

###### containerQuery?

`string` = `"(min-width: 768px)"`

###### fallbackPlacement?

`string` = `"bottom"`

###### inset?

`number` = `0`

###### placement?

`string` = `"fill"`

###### size?

`string` = `"100%"`

###### zIndexShift?

`number` = `1`

#### Returns

() => `void` \| `undefined`
