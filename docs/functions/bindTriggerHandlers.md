[**@fest-lib/lure v0.1.52**](../README.md)

***

[@fest-lib/lure](../README.md) / bindTriggerHandlers

# Function: bindTriggerHandlers()

```ts
function bindTriggerHandlers(target, handlers): () => void;
```

Defined in: lur.e/src/lure/core/TriggerCore.ts:125

Bind `E({ on })` style handlers with the same modifier semantics as Linker.
Existing bare handlers remain valid; modifier tuples are additive.

## Parameters

### target

`EventTarget` \| `null` \| `undefined`

### handlers

  \| `Record`\<`string`, [`TriggerHandlerValue`](../type-aliases/TriggerHandlerValue.md)\>
  \| `null`
  \| `undefined`

## Returns

() => `void`
