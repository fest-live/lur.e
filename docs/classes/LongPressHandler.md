[**@fest-lib/lure v0.1.55**](../README.md)

***

[@fest-lib/lure](../README.md) / LongPressHandler

# Class: LongPressHandler

Defined in: lur.e/src/interactive/controllers/LongPress.ts:23

## Constructors

### Constructor

```ts
new LongPressHandler(
   holder, 
   options?, 
   fx?): LongPressHandler;
```

Defined in: lur.e/src/interactive/controllers/LongPress.ts:28

#### Parameters

##### holder

`any`

##### options?

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

Defined in: lur.e/src/interactive/controllers/LongPress.ts:39

#### Parameters

##### ev

`any`

##### weakRef

`WeakRef`\<`HTMLElement`\>

#### Returns

`boolean` \| `undefined`

***

### dispose()

```ts
dispose(): void;
```

Defined in: lur.e/src/interactive/controllers/LongPress.ts:79

Release root listeners and any pending long-press state.

#### Returns

`void`

***

### longPress()

```ts
longPress(options?, fx?): () => void;
```

Defined in: lur.e/src/interactive/controllers/LongPress.ts:44

#### Parameters

##### options?

`any` = `...`

##### fx?

(`ev`) => `void`

#### Returns

() => `void`
