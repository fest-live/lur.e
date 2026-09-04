[**@fest-lib/lure v0.1.59**](../README.md)

***

[@fest-lib/lure](../README.md) / unwrapCssLayer

# Function: unwrapCssLayer()

```ts
function unwrapCssLayer(cssText, layerName?): string;
```

Defined in: style.ts/src/layers.ts:84

WHY: inlined `@layer` loses to unlayered shell CSS in Capacitor / ui-window hosts.
Unwrap only when the whole remaining sheet is one named block.

## Parameters

### cssText

`string`

### layerName?

`string`

## Returns

`string`
