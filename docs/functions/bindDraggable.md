[**@fest-lib/lure v0.1.41**](../README.md)

***

[@fest-lib/lure](../README.md) / bindDraggable

# Function: bindDraggable()

```ts
function bindDraggable(
   elementOrEventListener, 
   onEnd?, 
   draggable?, 
   shifting?): 
  | {
  dispose: () => void;
  draggable: any;
  process: (ev, el) => Promise<unknown>;
}
  | undefined;
```

Defined in: lur.e/src/interactive/controllers/PointerAPI.ts:327

## Parameters

### elementOrEventListener

`any`

### onEnd?

`any` = `...`

### draggable?

`any` = `...`

### shifting?

`any` = `...`

## Returns

  \| \{
  `dispose`: () => `void`;
  `draggable`: `any`;
  `process`: (`ev`, `el`) => `Promise`\<`unknown`\>;
\}
  \| `undefined`
