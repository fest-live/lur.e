[**@fest-lib/lure v0.1.59**](../README.md)

***

[@fest-lib/lure](../README.md) / SelectionOptions

# Interface: SelectionOptions

Defined in: lur.e/src/interactive/controllers/Selection.ts:21

## Properties

### aspectRatio?

```ts
optional aspectRatio?: number;
```

Defined in: lur.e/src/interactive/controllers/Selection.ts:25

***

### bounds?

```ts
optional bounds?: Rect2D;
```

Defined in: lur.e/src/interactive/controllers/Selection.ts:27

***

### maxSize?

```ts
optional maxSize?: Vector2D;
```

Defined in: lur.e/src/interactive/controllers/Selection.ts:24

***

### minSize?

```ts
optional minSize?: Vector2D;
```

Defined in: lur.e/src/interactive/controllers/Selection.ts:23

***

### onCancel?

```ts
optional onCancel?: () => void;
```

Defined in: lur.e/src/interactive/controllers/Selection.ts:37

#### Returns

`void`

***

### onChange?

```ts
optional onChange?: (rect) => void;
```

Defined in: lur.e/src/interactive/controllers/Selection.ts:36

#### Parameters

##### rect

[`Rect2D`](Rect2D.md)

#### Returns

`void`

***

### onSelect?

```ts
optional onSelect?: (rect) => void;
```

Defined in: lur.e/src/interactive/controllers/Selection.ts:35

#### Parameters

##### rect

[`Rect2D`](Rect2D.md)

#### Returns

`void`

***

### showHandles?

```ts
optional showHandles?: boolean;
```

Defined in: lur.e/src/interactive/controllers/Selection.ts:34

***

### snapToGrid?

```ts
optional snapToGrid?: object;
```

Defined in: lur.e/src/interactive/controllers/Selection.ts:26

#### offset

```ts
offset: Vector2D;
```

#### size

```ts
size: Vector2D;
```

***

### style?

```ts
optional style?: object;
```

Defined in: lur.e/src/interactive/controllers/Selection.ts:28

#### background?

```ts
optional background?: string;
```

#### border?

```ts
optional border?: string;
```

#### borderRadius?

```ts
optional borderRadius?: string;
```

#### zIndex?

```ts
optional zIndex?: number;
```

***

### target?

```ts
optional target?: HTMLElement;
```

Defined in: lur.e/src/interactive/controllers/Selection.ts:22
