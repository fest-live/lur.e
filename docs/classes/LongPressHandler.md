[**@fest-lib/lure v0.0.0**](../README.md)

***

[@fest-lib/lure](../README.md) / LongPressHandler

# Class: LongPressHandler

Defined in: [modules/projects/lur.e/src/extension/controllers/LongPress.ts:13](https://github.com/fest-live/lur.e/blob/8033cbe33e37b11f63de4da332415467e40bf204/src/extension/controllers/LongPress.ts#L13)

## Constructors

### Constructor

```ts
new LongPressHandler(
   holder, 
   options, 
   fx?): LongPressHandler;
```

Defined in: [modules/projects/lur.e/src/extension/controllers/LongPress.ts:17](https://github.com/fest-live/lur.e/blob/8033cbe33e37b11f63de4da332415467e40bf204/src/extension/controllers/LongPress.ts#L17)

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

Defined in: [modules/projects/lur.e/src/extension/controllers/LongPress.ts:27](https://github.com/fest-live/lur.e/blob/8033cbe33e37b11f63de4da332415467e40bf204/src/extension/controllers/LongPress.ts#L27)

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

Defined in: [modules/projects/lur.e/src/extension/controllers/LongPress.ts:32](https://github.com/fest-live/lur.e/blob/8033cbe33e37b11f63de4da332415467e40bf204/src/extension/controllers/LongPress.ts#L32)

#### Parameters

##### options

`any` = `...`

##### fx?

(`ev`) => `void`

#### Returns

`void`
