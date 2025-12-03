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

Defined in: [modules/projects/lur.e/src/extension/core/PointerAPI.ts:305](https://github.com/fest-live/lur.e/blob/845e11d38ceeba5a7b19fbeb61bfed0b0338af9f/src/extension/core/PointerAPI.ts#L305)

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
