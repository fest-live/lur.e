[**@fest/lure v0.0.0**](../README.md)

***

[@fest/lure](../README.md) / DragHandler

# Class: DragHandler

Defined in: [modules/projects/lur.e/src/extension/controllers/Draggable.ts:18](https://github.com/fest-live/lur.e/blob/781476ae72c550bfc6af28f270a3cdcf67217918/src/extension/controllers/Draggable.ts#L18)

## Constructors

### Constructor

```ts
new DragHandler(holder, options): DragHandler;
```

Defined in: [modules/projects/lur.e/src/extension/controllers/Draggable.ts:29](https://github.com/fest-live/lur.e/blob/781476ae72c550bfc6af28f270a3cdcf67217918/src/extension/controllers/Draggable.ts#L29)

#### Parameters

##### holder

`any`

##### options

`DragHandlerOptions`

#### Returns

`DragHandler`

## Methods

### draggable()

```ts
draggable(options): 
  | undefined
  | {
  dispose: () => void;
  draggable: any;
  process: (ev, el) => Promise<unknown>;
};
```

Defined in: [modules/projects/lur.e/src/extension/controllers/Draggable.ts:76](https://github.com/fest-live/lur.e/blob/781476ae72c550bfc6af28f270a3cdcf67217918/src/extension/controllers/Draggable.ts#L76)

#### Parameters

##### options

`DragHandlerOptions`

#### Returns

  \| `undefined`
  \| \{
  `dispose`: () => `void`;
  `draggable`: `any`;
  `process`: (`ev`, `el`) => `Promise`\<`unknown`\>;
\}
