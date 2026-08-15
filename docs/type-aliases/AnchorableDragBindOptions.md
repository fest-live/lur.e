[**@fest-lib/lure v0.1.39**](../README.md)

***

[@fest-lib/lure](../README.md) / AnchorableDragBindOptions

# Type Alias: AnchorableDragBindOptions

```ts
type AnchorableDragBindOptions = object;
```

Defined in: lur.e/src/interactive/mixins/Draggable.ts:20

## Properties

### anchors?

```ts
optional anchors?: AnchorNameTriple;
```

Defined in: lur.e/src/interactive/mixins/Draggable.ts:26

***

### dragHandle?

```ts
optional dragHandle?: string | HTMLElement;
```

Defined in: lur.e/src/interactive/mixins/Draggable.ts:23

Selector relative to `frame`, or the handle element.

***

### frame

```ts
frame: HTMLElement;
```

Defined in: lur.e/src/interactive/mixins/Draggable.ts:21

***

### minHeight?

```ts
optional minHeight?: number;
```

Defined in: lur.e/src/interactive/mixins/Draggable.ts:28

***

### minWidth?

```ts
optional minWidth?: number;
```

Defined in: lur.e/src/interactive/mixins/Draggable.ts:27

***

### resizeHandle?

```ts
optional resizeHandle?: string | HTMLElement | null;
```

Defined in: lur.e/src/interactive/mixins/Draggable.ts:25

Selector or element; set `null` to skip resize mixin.
