[**@fest-lib/lure v0.0.0**](../README.md)

***

[@fest-lib/lure](../README.md) / DragHandler

# Class: DragHandler

Defined in: [modules/projects/lur.e/src/extension/controllers/Draggable.ts:18](https://github.com/fest-live/lur.e/blob/8033cbe33e37b11f63de4da332415467e40bf204/src/extension/controllers/Draggable.ts#L18)

## Constructors

### Constructor

```ts
new DragHandler(holder, options): DragHandler;
```

Defined in: [modules/projects/lur.e/src/extension/controllers/Draggable.ts:29](https://github.com/fest-live/lur.e/blob/8033cbe33e37b11f63de4da332415467e40bf204/src/extension/controllers/Draggable.ts#L29)

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

Defined in: [modules/projects/lur.e/src/extension/controllers/Draggable.ts:76](https://github.com/fest-live/lur.e/blob/8033cbe33e37b11f63de4da332415467e40bf204/src/extension/controllers/Draggable.ts#L76)

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
