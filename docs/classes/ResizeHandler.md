[**@fest-lib/lure v0.0.0**](../README.md)

***

[@fest-lib/lure](../README.md) / ResizeHandler

# Class: ResizeHandler

Defined in: [modules/projects/lur.e/src/extension/controllers/Resizable.ts:11](https://github.com/fest-live/lur.e/blob/211e5159c17466d5ef8d3d0f9ccb52b3f19f48d6/src/extension/controllers/Resizable.ts#L11)

## Constructors

### Constructor

```ts
new ResizeHandler(holder, options?): ResizeHandler;
```

Defined in: [modules/projects/lur.e/src/extension/controllers/Resizable.ts:19](https://github.com/fest-live/lur.e/blob/211e5159c17466d5ef8d3d0f9ccb52b3f19f48d6/src/extension/controllers/Resizable.ts#L19)

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

Defined in: [modules/projects/lur.e/src/extension/controllers/Resizable.ts:26](https://github.com/fest-live/lur.e/blob/211e5159c17466d5ef8d3d0f9ccb52b3f19f48d6/src/extension/controllers/Resizable.ts#L26)

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

Defined in: [modules/projects/lur.e/src/extension/controllers/Resizable.ts:38](https://github.com/fest-live/lur.e/blob/211e5159c17466d5ef8d3d0f9ccb52b3f19f48d6/src/extension/controllers/Resizable.ts#L38)

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
