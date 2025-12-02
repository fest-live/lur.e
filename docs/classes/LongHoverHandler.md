[**@fest-lib/lure v0.0.0**](../README.md)

***

[@fest-lib/lure](../README.md) / LongHoverHandler

# Class: LongHoverHandler

Defined in: [modules/projects/lur.e/src/extension/controllers/LongHover.ts:4](https://github.com/fest-live/lur.e/blob/211e5159c17466d5ef8d3d0f9ccb52b3f19f48d6/src/extension/controllers/LongHover.ts#L4)

## Constructors

### Constructor

```ts
new LongHoverHandler(
   holder, 
   options?, 
   fx?): LongHoverHandler;
```

Defined in: [modules/projects/lur.e/src/extension/controllers/LongHover.ts:8](https://github.com/fest-live/lur.e/blob/211e5159c17466d5ef8d3d0f9ccb52b3f19f48d6/src/extension/controllers/LongHover.ts#L8)

#### Parameters

##### holder

`any`

##### options?

`any`

##### fx?

(`ev`) => `void`

#### Returns

`LongHoverHandler`

## Methods

### defaultHandler()

```ts
defaultHandler(ev, weakRef): boolean | undefined;
```

Defined in: [modules/projects/lur.e/src/extension/controllers/LongHover.ts:15](https://github.com/fest-live/lur.e/blob/211e5159c17466d5ef8d3d0f9ccb52b3f19f48d6/src/extension/controllers/LongHover.ts#L15)

#### Parameters

##### ev

`any`

##### weakRef

`WeakRef`\<`HTMLElement`\>

#### Returns

`boolean` \| `undefined`

***

### longHover()

```ts
longHover(options, fx): void;
```

Defined in: [modules/projects/lur.e/src/extension/controllers/LongHover.ts:20](https://github.com/fest-live/lur.e/blob/211e5159c17466d5ef8d3d0f9ccb52b3f19f48d6/src/extension/controllers/LongHover.ts#L20)

#### Parameters

##### options

`any`

##### fx

(`ev`) => `void`

#### Returns

`void`
