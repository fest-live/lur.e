[**@fest-lib/lure v0.0.0**](../README.md)

***

[@fest-lib/lure](../README.md) / bindDraggable

# Function: bindDraggable()

```ts
function bindDraggable(
   elementOrEventListener, 
   onEnd, 
   draggable, 
   shifting): 
  | {
  dispose: () => void;
  draggable: any;
  process: (ev, el) => Promise<unknown>;
}
  | undefined;
```

Defined in: [modules/projects/lur.e/src/extension/core/PointerAPI.ts:305](https://github.com/fest-live/lur.e/blob/211e5159c17466d5ef8d3d0f9ccb52b3f19f48d6/src/extension/core/PointerAPI.ts#L305)

## Parameters

### elementOrEventListener

`any`

### onEnd

`any` = `...`

### draggable

`any` = `...`

### shifting

`any` = `...`

## Returns

  \| \{
  `dispose`: () => `void`;
  `draggable`: `any`;
  `process`: (`ev`, `el`) => `Promise`\<`unknown`\>;
\}
  \| `undefined`
