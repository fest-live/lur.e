[**@fest-lib/lure v0.1.54**](../README.md)

***

[@fest-lib/lure](../README.md) / bindAnchorableDragResize

# Function: bindAnchorableDragResize()

```ts
function bindAnchorableDragResize(opts): () => void;
```

Defined in: lur.e/src/interactive/mixins/Draggable.ts:57

Declaratively enable junction drag (+ optional resize) and publish CSS anchor names.
Returns teardown (restores previous `data-mixin` text only; anchor-name cleanup is best-effort).

## Parameters

### opts

[`AnchorableDragBindOptions`](../type-aliases/AnchorableDragBindOptions.md)

## Returns

() => `void`
