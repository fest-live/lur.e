[**@fest-lib/lure v0.1.28**](../README.md)

***

[@fest-lib/lure](../README.md) / CSSBinder

# Class: CSSBinder

Defined in: lur.e/src/design/anchor/CSSAdapter.ts:193

## Constructors

### Constructor

```ts
new CSSBinder(): CSSBinder;
```

#### Returns

`CSSBinder`

## Methods

### bindBorderRadius()

```ts
static bindBorderRadius(
   element, 
   radius, 
   animationType?, 
   options?): () => void;
```

Defined in: lur.e/src/design/anchor/CSSAdapter.ts:360

#### Parameters

##### element

`HTMLElement`

##### radius

`any`

##### animationType?

`"instant"` \| `"animate"` \| `"transition"` \| `"spring"`

##### options?

`AnimationOptions` \| `TransitionOptions`

#### Returns

() => `void`

***

### bindColor()

```ts
static bindColor(
   element, 
   property, 
   color, 
   animationType?, 
   options?): () => void;
```

Defined in: lur.e/src/design/anchor/CSSAdapter.ts:329

#### Parameters

##### element

`HTMLElement`

##### property

`string`

##### color

`any`

##### animationType?

`"instant"` \| `"animate"` \| `"transition"`

##### options?

`TransitionOptions` = `...`

#### Returns

() => `void`

***

### bindOpacity()

```ts
static bindOpacity(
   element, 
   opacity, 
   animationType?, 
   options?): () => void;
```

Defined in: lur.e/src/design/anchor/CSSAdapter.ts:346

#### Parameters

##### element

`HTMLElement`

##### opacity

`any`

##### animationType?

`"instant"` \| `"animate"` \| `"transition"` \| `"spring"`

##### options?

`AnimationOptions` \| `TransitionOptions`

#### Returns

() => `void`

***

### bindPosition()

```ts
static bindPosition(
   element, 
   vector, 
   animationType?, 
   options?): () => void;
```

Defined in: lur.e/src/design/anchor/CSSAdapter.ts:209

#### Parameters

##### element

`HTMLElement`

##### vector

[`Vector2D`](Vector2D.md)

##### animationType?

`"instant"` \| `"animate"` \| `"transition"` \| `"spring"`

##### options?

`AnimationOptions` \| `TransitionOptions`

#### Returns

() => `void`

***

### bindSize()

```ts
static bindSize(
   element, 
   vector, 
   animationType?, 
   options?): () => void;
```

Defined in: lur.e/src/design/anchor/CSSAdapter.ts:226

#### Parameters

##### element

`HTMLElement`

##### vector

[`Vector2D`](Vector2D.md)

##### animationType?

`"instant"` \| `"animate"` \| `"transition"` \| `"spring"`

##### options?

`AnimationOptions` \| `TransitionOptions`

#### Returns

() => `void`

***

### bindTransform()

```ts
static bindTransform(
   element, 
   vector, 
   animationType?, 
   options?): () => void;
```

Defined in: lur.e/src/design/anchor/CSSAdapter.ts:195

#### Parameters

##### element

`HTMLElement`

##### vector

[`Vector2D`](Vector2D.md)

##### animationType?

`"instant"` \| `"animate"` \| `"transition"` \| `"spring"`

##### options?

`AnimationOptions` \| `TransitionOptions`

#### Returns

() => `void`

***

### bindTransformMorph()

```ts
static bindTransformMorph(
   element, 
   transformProps, 
   options?): () => void;
```

Defined in: lur.e/src/design/anchor/CSSAdapter.ts:282

#### Parameters

##### element

`HTMLElement`

##### transformProps

###### rotate?

`any`

###### scale?

`any`

###### skew?

[`Vector2D`](Vector2D.md)

###### translate?

[`Vector2D`](Vector2D.md)

##### options?

`AnimationOptions` = `{}`

#### Returns

() => `void`

***

### bindVectorWithUnit()

```ts
static bindVectorWithUnit(
   element, 
   vector, 
   unit?, 
   animationType?, 
   options?): () => void;
```

Defined in: lur.e/src/design/anchor/CSSAdapter.ts:259

#### Parameters

##### element

`HTMLElement`

##### vector

[`Vector2D`](Vector2D.md)

##### unit?

`string` = `'px'`

##### animationType?

`"instant"` \| `"animate"` \| `"transition"` \| `"spring"`

##### options?

`AnimationOptions` \| `TransitionOptions`

#### Returns

() => `void`

***

### bindWithUnit()

```ts
static bindWithUnit(
   element, 
   property, 
   value, 
   unit?, 
   animationType?, 
   options?): () => void;
```

Defined in: lur.e/src/design/anchor/CSSAdapter.ts:243

#### Parameters

##### element

`HTMLElement`

##### property

`string`

##### value

`any`

##### unit?

`string` = `'px'`

##### animationType?

`"instant"` \| `"animate"` \| `"transition"` \| `"spring"`

##### options?

`AnimationOptions` \| `TransitionOptions`

#### Returns

() => `void`
