[**@fest-lib/lure v0.1.42**](../README.md)

***

[@fest-lib/lure](../README.md) / DragHandler

# Class: DragHandler

Defined in: lur.e/src/interactive/controllers/Draggable.ts:25

## Constructors

### Constructor

```ts
new DragHandler(holder, options): DragHandler;
```

Defined in: lur.e/src/interactive/controllers/Draggable.ts:37

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
  | {
  dispose: () => void;
  draggable: any;
  process: (ev, el) => Promise<unknown>;
}
  | undefined;
```

Defined in: lur.e/src/interactive/controllers/Draggable.ts:118

#### Parameters

##### options

`DragHandlerOptions`

#### Returns

  \| \{
  `dispose`: () => `void`;
  `draggable`: `any`;
  `process`: (`ev`, `el`) => `Promise`\<`unknown`\>;
\}
  \| `undefined`
