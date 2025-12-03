[**@fest-lib/lure v0.0.0**](../README.md)

***

[@fest-lib/lure](../README.md) / LongPressHandler

# Class: LongPressHandler

Defined in: [modules/projects/lur.e/src/extension/controllers/LongPress.ts:21](https://github.com/fest-live/lur.e/blob/845e11d38ceeba5a7b19fbeb61bfed0b0338af9f/src/extension/controllers/LongPress.ts#L21)

## Constructors

### Constructor

```ts
new LongPressHandler(
   holder, 
   options, 
   fx?): LongPressHandler;
```

Defined in: [modules/projects/lur.e/src/extension/controllers/LongPress.ts:25](https://github.com/fest-live/lur.e/blob/845e11d38ceeba5a7b19fbeb61bfed0b0338af9f/src/extension/controllers/LongPress.ts#L25)

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
defaultHandler(ev, weakRef): boolean | undefined;
```

Defined in: [modules/projects/lur.e/src/extension/controllers/LongPress.ts:36](https://github.com/fest-live/lur.e/blob/845e11d38ceeba5a7b19fbeb61bfed0b0338af9f/src/extension/controllers/LongPress.ts#L36)

#### Parameters

##### ev

`any`

##### weakRef

`WeakRef`\<`HTMLElement`\>

#### Returns

`boolean` \| `undefined`

***

### longPress()

```ts
longPress(options, fx?): void;
```

Defined in: [modules/projects/lur.e/src/extension/controllers/LongPress.ts:41](https://github.com/fest-live/lur.e/blob/845e11d38ceeba5a7b19fbeb61bfed0b0338af9f/src/extension/controllers/LongPress.ts#L41)

#### Parameters

##### options

`any` = `...`

##### fx?

(`ev`) => `void`

#### Returns

`void`
