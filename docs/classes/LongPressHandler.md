[**@fest/lure v0.0.0**](../README.md)

***

[@fest/lure](../README.md) / LongPressHandler

# Class: LongPressHandler

Defined in: [modules/projects/lur.e/src/extension/controllers/LongPress.ts:13](https://github.com/fest-live/lur.e/blob/781476ae72c550bfc6af28f270a3cdcf67217918/src/extension/controllers/LongPress.ts#L13)

## Constructors

### Constructor

```ts
new LongPressHandler(
   holder, 
   options, 
   fx?): LongPressHandler;
```

Defined in: [modules/projects/lur.e/src/extension/controllers/LongPress.ts:17](https://github.com/fest-live/lur.e/blob/781476ae72c550bfc6af28f270a3cdcf67217918/src/extension/controllers/LongPress.ts#L17)

#### Parameters

##### holder

`any`

##### options

`any` = `...`

##### fx?

(`ev`) => `void`

#### Returns

`LongPressHandler`

## Methods

### defaultHandler()

```ts
defaultHandler(ev, weakRef): undefined | boolean;
```

Defined in: [modules/projects/lur.e/src/extension/controllers/LongPress.ts:27](https://github.com/fest-live/lur.e/blob/781476ae72c550bfc6af28f270a3cdcf67217918/src/extension/controllers/LongPress.ts#L27)

#### Parameters

##### ev

`any`

##### weakRef

`WeakRef`\<`HTMLElement`\>

#### Returns

`undefined` \| `boolean`

***

### longPress()

```ts
longPress(options, fx?): void;
```

Defined in: [modules/projects/lur.e/src/extension/controllers/LongPress.ts:32](https://github.com/fest-live/lur.e/blob/781476ae72c550bfc6af28f270a3cdcf67217918/src/extension/controllers/LongPress.ts#L32)

#### Parameters

##### options

`any` = `...`

##### fx?

(`ev`) => `void`

#### Returns

`void`
