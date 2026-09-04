[**@fest-lib/lure v0.1.60**](../README.md)

***

[@fest-lib/lure](../README.md) / resolvePlacement

# Function: resolvePlacement()

```ts
function resolvePlacement(__namedParameters): PlacementResult;
```

Defined in: lur.e/src/design/anchor/Placement.ts:135

Choose the first candidate that fits, otherwise clamp the least-overflowing
candidate. The result is stable for both CSS Anchor fallbacks and JS layout.

## Parameters

### \_\_namedParameters

[`ResolvePlacementOptions`](../type-aliases/ResolvePlacementOptions.md)

## Returns

[`PlacementResult`](../type-aliases/PlacementResult.md)
