[**@fest-lib/lure v0.1.43**](../README.md)

***

[@fest-lib/lure](../README.md) / addProxiedEvent

# Function: addProxiedEvent()

```ts
function addProxiedEvent<E>(
   root, 
   type, 
   options?, 
   config?): (_element, _handler) => () => void;
```

Defined in: lur.e/src/interactive/controllers/LazyEvents.ts:108

Proxied events:
- Installs **one** real DOM listener on `root` (per event/options/config), but only after the first element handler registers.
- Routes events to registered element handlers based on the composed path.
- Can conditionally call preventDefault/stop* only when a trigger matches (or when handled).

## Type Parameters

### E

`E` *extends* `Event` = `Event`

## Parameters

### root

`EventTarget` \| `null` \| `undefined`

### type

`string`

### options?

`AddEventListenerOptions` = `...`

### config?

`ProxiedConfig` = `{}`

## Returns

(`_element`, `_handler`) => () => `void`
