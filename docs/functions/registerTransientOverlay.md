[**@fest-lib/lure v0.1.46**](../README.md)

***

[@fest-lib/lure](../README.md) / registerTransientOverlay

# Function: registerTransientOverlay()

```ts
function registerTransientOverlay(__namedParameters): () => void;
```

Defined in: lur.e/src/design/overlays/OverlayHost.ts:73

Register a closeable overlay without initializing or otherwise changing the
application's global back-navigation policy. Returns an idempotent disposer.

## Parameters

### \_\_namedParameters

[`TransientOverlayOptions`](../type-aliases/TransientOverlayOptions.md)

## Returns

() => `void`
