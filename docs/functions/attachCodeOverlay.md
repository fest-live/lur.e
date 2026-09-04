[**@fest-lib/lure v0.1.61**](../README.md)

***

[@fest-lib/lure](../README.md) / attachCodeOverlay

# Function: attachCodeOverlay()

```ts
function attachCodeOverlay(
   host, 
   overlay, 
   options?): CodeOverlayHandle;
```

Defined in: lur.e/src/lure/misc/CodeOverlay.ts:303

Place `overlay` over `host` with matching box + font metrics.
INVARIANT: overlay never captures pointer or selection.

## Parameters

### host

`HTMLElement`

### overlay

`HTMLElement`

### options?

[`CodeOverlayOptions`](../type-aliases/CodeOverlayOptions.md) = `{}`

## Returns

[`CodeOverlayHandle`](../type-aliases/CodeOverlayHandle.md)
