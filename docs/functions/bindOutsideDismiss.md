[**@fest-lib/lure v0.1.52**](../README.md)

***

[@fest-lib/lure](../README.md) / bindOutsideDismiss

# Function: bindOutsideDismiss()

```ts
function bindOutsideDismiss(__namedParameters): () => void;
```

Defined in: lur.e/src/interactive/controllers/Trigger.ts:188

Bind composed-path-aware outside/Escape dismissal for transient UI surfaces.
INVARIANT: all root listeners are released by the returned idempotent disposer.

## Parameters

### \_\_namedParameters

[`OutsideDismissOptions`](../type-aliases/OutsideDismissOptions.md)

## Returns

() => `void`
