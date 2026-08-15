[**@fest-lib/lure v0.1.28**](../README.md)

***

[@fest-lib/lure](../README.md) / registerOverlay

# Function: registerOverlay()

```ts
function registerOverlay(
   element, 
   isActiveCheck, 
   onClose, 
   priority?): () => void;
```

Defined in: lur.e/src/interactive/tasking/BackNavigation.ts:364

Register an overlay/panel as closeable

## Parameters

### element

`HTMLElement`

### isActiveCheck

() => `boolean`

### onClose

() => `void`

### priority?

[`ClosePriority`](../enumerations/ClosePriority.md) = `ClosePriority.OVERLAY`

## Returns

() => `void`
