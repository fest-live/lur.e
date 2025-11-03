[**@fest/lure v0.0.0**](../README.md)

***

[@fest/lure](../README.md) / bindDraggable

# Function: bindDraggable()

```ts
function bindDraggable(
   elementOrEventListener, 
   onEnd, 
   draggable, 
   shifting): 
  | undefined
  | {
  dispose: () => void;
  draggable: any;
  process: (ev, el) => Promise<unknown>;
};
```

Defined in: [modules/projects/lur.e/src/extension/core/PointerAPI.ts:296](https://github.com/fest-live/lur.e/blob/781476ae72c550bfc6af28f270a3cdcf67217918/src/extension/core/PointerAPI.ts#L296)

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

  \| `undefined`
  \| \{
  `dispose`: () => `void`;
  `draggable`: `any`;
  `process`: (`ev`, `el`) => `Promise`\<`unknown`\>;
\}
