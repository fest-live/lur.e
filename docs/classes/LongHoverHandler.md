[**@fest/lure v0.0.0**](../README.md)

***

[@fest/lure](../README.md) / LongHoverHandler

# Class: LongHoverHandler

Defined in: [modules/projects/lur.e/src/extension/controllers/LongHover.ts:4](https://github.com/fest-live/lur.e/blob/781476ae72c550bfc6af28f270a3cdcf67217918/src/extension/controllers/LongHover.ts#L4)

## Constructors

### Constructor

```ts
new LongHoverHandler(
   holder, 
   options?, 
   fx?): LongHoverHandler;
```

Defined in: [modules/projects/lur.e/src/extension/controllers/LongHover.ts:8](https://github.com/fest-live/lur.e/blob/781476ae72c550bfc6af28f270a3cdcf67217918/src/extension/controllers/LongHover.ts#L8)

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
defaultHandler(ev, weakRef): undefined | boolean;
```

Defined in: [modules/projects/lur.e/src/extension/controllers/LongHover.ts:15](https://github.com/fest-live/lur.e/blob/781476ae72c550bfc6af28f270a3cdcf67217918/src/extension/controllers/LongHover.ts#L15)

#### Parameters

##### ev

`any`

##### weakRef

`WeakRef`\<`HTMLElement`\>

#### Returns

`undefined` \| `boolean`

***

### longHover()

```ts
longHover(options, fx): void;
```

Defined in: [modules/projects/lur.e/src/extension/controllers/LongHover.ts:20](https://github.com/fest-live/lur.e/blob/781476ae72c550bfc6af28f270a3cdcf67217918/src/extension/controllers/LongHover.ts#L20)

#### Parameters

##### options

`any`

##### fx

(`ev`) => `void`

#### Returns

`void`
