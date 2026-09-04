[**@fest-lib/lure v0.1.60**](../README.md)

***

[@fest-lib/lure](../README.md) / appendAsLayer

# Function: appendAsLayer()

```ts
function appendAsLayer(
   anchor, 
   layer?, 
   self?, 
   options?): HTMLElement | undefined;
```

Defined in: lur.e/src/design/layers/AnchorOverlay.ts:125

Insert `layer` as a sibling of `anchor` (before = underlying, after = overlaying),
bind CSS anchor placement, and apply hybrid stacking.

## Parameters

### anchor

`HTMLElement` \| `null`

### layer?

`HTMLElement` \| `null`

### self?

`HTMLElement` \| `null`

### options?

[`AppendAsLayerOptions`](../interfaces/AppendAsLayerOptions.md)

## Returns

`HTMLElement` \| `undefined`
