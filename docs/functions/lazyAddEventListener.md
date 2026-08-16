[**@fest-lib/lure v0.1.41**](../README.md)

***

[@fest-lib/lure](../README.md) / lazyAddEventListener

# Function: lazyAddEventListener()

```ts
function lazyAddEventListener<E>(
   target, 
   type, 
   handler, 
   options?): () => void;
```

Defined in: lur.e/src/interactive/controllers/LazyEvents.ts:17

## Type Parameters

### E

`E` *extends* `Event` = `Event`

## Parameters

### target

`EventTarget` \| `null` \| `undefined`

### type

`string`

### handler

`AnyHandler`\<`E`\>

### options?

`AddEventListenerOptions` = `{}`

## Returns

() => `void`
