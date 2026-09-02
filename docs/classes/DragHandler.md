[**@fest-lib/lure v0.1.54**](../README.md)

***

[@fest-lib/lure](../README.md) / DragHandler

# Class: DragHandler

Defined in: lur.e/src/interactive/controllers/Draggable.ts:26

## Constructors

### Constructor

```ts
new DragHandler(holder, options): DragHandler;
```

Defined in: lur.e/src/interactive/controllers/Draggable.ts:38

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

Defined in: lur.e/src/interactive/controllers/Draggable.ts:119

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
