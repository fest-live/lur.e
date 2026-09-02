[**@fest-lib/lure v0.1.54**](../README.md)

***

[@fest-lib/lure](../README.md) / ResizeHandler

# Class: ResizeHandler

Defined in: lur.e/src/interactive/controllers/Resizable.ts:13

## Constructors

### Constructor

```ts
new ResizeHandler(holder, options?): ResizeHandler;
```

Defined in: lur.e/src/interactive/controllers/Resizable.ts:21

#### Parameters

##### holder

`any`

##### options?

`any`

#### Returns

`ResizeHandler`

## Methods

### limitResize()

```ts
limitResize(
   real, 
   virtual, 
   holder, 
   container): any;
```

Defined in: lur.e/src/interactive/controllers/Resizable.ts:28

#### Parameters

##### real

`any`

##### virtual

`any`

##### holder

`any`

##### container

`any`

#### Returns

`any`

***

### resizable()

```ts
resizable(options): 
  | {
  dispose: () => void;
  draggable: any;
  process: (ev, el) => Promise<unknown>;
}
  | undefined;
```

Defined in: lur.e/src/interactive/controllers/Resizable.ts:40

#### Parameters

##### options

`any`

#### Returns

  \| \{
  `dispose`: () => `void`;
  `draggable`: `any`;
  `process`: (`ev`, `el`) => `Promise`\<`unknown`\>;
\}
  \| `undefined`
