[**@fest-lib/lure v0.1.30**](../README.md)

***

[@fest-lib/lure](../README.md) / SelectionController

# Class: SelectionController

Defined in: lur.e/src/interactive/controllers/Selection.ts:43

Selection controller for creating snipping rectangles on screen/canvas
Supports drag-to-create, resize, constraints, and grid snapping

## Constructors

### Constructor

```ts
new SelectionController(options?): SelectionController;
```

Defined in: lur.e/src/interactive/controllers/Selection.ts:54

#### Parameters

##### options?

[`SelectionOptions`](../interfaces/SelectionOptions.md) = `{}`

#### Returns

`SelectionController`

## Methods

### clearSelection()

```ts
clearSelection(): void;
```

Defined in: lur.e/src/interactive/controllers/Selection.ts:113

Clear current selection

#### Returns

`void`

***

### destroy()

```ts
destroy(): void;
```

Defined in: lur.e/src/interactive/controllers/Selection.ts:514

Destroy the selection controller

#### Returns

`void`

***

### getSelection()

```ts
getSelection(): Rect2D | null;
```

Defined in: lur.e/src/interactive/controllers/Selection.ts:97

Get current selection rectangle

#### Returns

[`Rect2D`](../interfaces/Rect2D.md) \| `null`

***

### getSelectionImage()

```ts
getSelectionImage(): Promise<ImageData | null>;
```

Defined in: lur.e/src/interactive/controllers/Selection.ts:503

Get selection as image data (for canvas/screen capture)

#### Returns

`Promise`\<`ImageData` \| `null`\>

***

### setSelection()

```ts
setSelection(rect): void;
```

Defined in: lur.e/src/interactive/controllers/Selection.ts:104

Set selection programmatically

#### Parameters

##### rect

[`Rect2D`](../interfaces/Rect2D.md)

#### Returns

`void`

***

### start()

```ts
start(): void;
```

Defined in: lur.e/src/interactive/controllers/Selection.ts:74

Start selection mode - attaches event listeners

#### Returns

`void`

***

### stop()

```ts
stop(): void;
```

Defined in: lur.e/src/interactive/controllers/Selection.ts:85

Stop selection mode - removes event listeners and overlay

#### Returns

`void`
