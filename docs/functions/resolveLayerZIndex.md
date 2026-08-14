[**@fest-lib/lure v0.1.19**](../README.md)

***

[@fest-lib/lure](../README.md) / resolveLayerZIndex

# Function: resolveLayerZIndex()

```ts
function resolveLayerZIndex(main, options): number | null;
```

Defined in: lur.e/src/design/layers/stacking.ts:18

Returns numeric z-index to apply, or null to leave unset
(order-equal when main has no explicit z-index — DOM paint order wins).

## Parameters

### main

`HTMLElement`

### options

`Pick`\<[`AppendAsLayerOptions`](../interfaces/AppendAsLayerOptions.md), `"role"` \| `"stackMode"` \| `"zIndexShift"`\>

## Returns

`number` \| `null`
