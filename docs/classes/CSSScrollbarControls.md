[**@fest-lib/lure v0.1.59**](../README.md)

***

[@fest-lib/lure](../README.md) / CSSScrollbarControls

# Class: CSSScrollbarControls

Defined in: lur.e/src/design/anchor/CSSAdapter.ts:657

## Constructors

### Constructor

```ts
new CSSScrollbarControls(): CSSScrollbarControls;
```

#### Returns

`CSSScrollbarControls`

## Methods

### bindScrollbarTheme()

```ts
static bindScrollbarTheme(scrollbarElement, theme): () => void;
```

Defined in: lur.e/src/design/anchor/CSSAdapter.ts:719

#### Parameters

##### scrollbarElement

`HTMLElement`

##### theme

###### borderRadius?

`any`

###### thickness?

`any`

###### thumbColor?

`any`

###### trackColor?

`any`

#### Returns

() => `void`

***

### bindScrollbarThumb()

```ts
static bindScrollbarThumb(
   thumbElement, 
   scrollPosition, 
   contentSize, 
   containerSize, 
   axis?): () => void;
```

Defined in: lur.e/src/design/anchor/CSSAdapter.ts:659

#### Parameters

##### thumbElement

`HTMLElement`

##### scrollPosition

`any`

##### contentSize

`any`

##### containerSize

`any`

##### axis?

`"horizontal"` \| `"vertical"`

#### Returns

() => `void`

***

### bindScrollbarVisibility()

```ts
static bindScrollbarVisibility(
   scrollbarElement, 
   isVisible, 
   transitionDuration?): () => void;
```

Defined in: lur.e/src/design/anchor/CSSAdapter.ts:695

#### Parameters

##### scrollbarElement

`HTMLElement`

##### isVisible

`any`

##### transitionDuration?

`number` = `300`

#### Returns

() => `void`
