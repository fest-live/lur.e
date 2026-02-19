[**@fest-lib/lure v0.0.0**](../README.md)

***

[@fest-lib/lure](../README.md) / makeDragEvents

# Function: makeDragEvents()

```ts
function makeDragEvents(
   newItem, 
   __namedParameters, 
   __namedParameters): Promise<
  | {
  dispose: () => void;
  draggable: any;
  process: (ev, el) => Promise<unknown>;
}
| undefined>;
```

Defined in: [modules/projects/lur.e/src/extension/grid/Interact.ts:150](https://github.com/fest-live/lur.e/blob/845e11d38ceeba5a7b19fbeb61bfed0b0338af9f/src/extension/grid/Interact.ts#L150)

## Parameters

### newItem

`HTMLElement`

### \_\_namedParameters

#### currentCell

\[`any`, `any`\]

#### dragging

\[`any`, `any`\]

#### layout

\[`number`, `number`\]

#### syncDragStyles

(`flush`) => `void`

### \_\_namedParameters

#### item

`GridItemType`

#### items

  \| `Map`\<`string`, `GridItemType`\>
  \| `Set`\<`GridItemType`\>
  \| `GridItemType`[]

#### list

`string`[] \| `Set`\<`string`\>

## Returns

`Promise`\<
  \| \{
  `dispose`: () => `void`;
  `draggable`: `any`;
  `process`: (`ev`, `el`) => `Promise`\<`unknown`\>;
\}
  \| `undefined`\>
