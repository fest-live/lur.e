[**@fest-lib/lure v0.0.0**](../README.md)

***

[@fest-lib/lure](../README.md) / registerOverlay

# Function: registerOverlay()

```ts
function registerOverlay(
   element, 
   isActiveCheck, 
   onClose, 
   priority): () => void;
```

Defined in: [modules/projects/lur.e/src/extension/tasking/BackNavigation.ts:365](https://github.com/fest-live/lur.e/blob/211e5159c17466d5ef8d3d0f9ccb52b3f19f48d6/src/extension/tasking/BackNavigation.ts#L365)

Register an overlay/panel as closeable

## Parameters

### element

`HTMLElement`

### isActiveCheck

() => `boolean`

### onClose

() => `void`

### priority

[`ClosePriority`](../enumerations/ClosePriority.md) = `ClosePriority.OVERLAY`

## Returns

```ts
(): void;
```

### Returns

`void`
