[**@fest-lib/lure v0.1.56**](../README.md)

***

[@fest-lib/lure](../README.md) / CSSInteractionStates

# Class: CSSInteractionStates

Defined in: lur.e/src/design/anchor/CSSAdapter.ts:819

## Constructors

### Constructor

```ts
new CSSInteractionStates(): CSSInteractionStates;
```

#### Returns

`CSSInteractionStates`

## Methods

### bindActiveState()

```ts
static bindActiveState(
   element, 
   isActive, 
   activeTransform?): () => void;
```

Defined in: lur.e/src/design/anchor/CSSAdapter.ts:847

#### Parameters

##### element

`HTMLElement`

##### isActive

`any`

##### activeTransform?

`string` = `'scale(0.95)'`

#### Returns

() => `void`

***

### bindFocusRing()

```ts
static bindFocusRing(
   element, 
   isFocused, 
   ringColor?): () => void;
```

Defined in: lur.e/src/design/anchor/CSSAdapter.ts:821

#### Parameters

##### element

`HTMLElement`

##### isFocused

`any`

##### ringColor?

`string` = `'rgba(59, 130, 246, 0.5)'`

#### Returns

() => `void`

***

### bindHoverState()

```ts
static bindHoverState(
   element, 
   isHovered, 
   hoverTransform?): () => void;
```

Defined in: lur.e/src/design/anchor/CSSAdapter.ts:834

#### Parameters

##### element

`HTMLElement`

##### isHovered

`any`

##### hoverTransform?

`string` = `'scale(1.05)'`

#### Returns

() => `void`
