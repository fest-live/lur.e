[**@fest-lib/lure v0.1.62**](../README.md)

***

[@fest-lib/lure](../README.md) / LongHoverHandler

# Class: LongHoverHandler

Defined in: lur.e/src/interactive/controllers/LongHover.ts:4

## Constructors

### Constructor

```ts
new LongHoverHandler(
   holder, 
   options?, 
   fx?): LongHoverHandler;
```

Defined in: lur.e/src/interactive/controllers/LongHover.ts:9

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

Defined in: lur.e/src/interactive/controllers/LongHover.ts:16

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

Defined in: lur.e/src/interactive/controllers/LongHover.ts:64

Release root listeners and cancel a pending hover timer.

#### Returns

`void`

***

### longHover()

```ts
longHover(options, fx?): () => void;
```

Defined in: lur.e/src/interactive/controllers/LongHover.ts:21

#### Parameters

##### options

`any`

##### fx?

(`ev`) => `void`

#### Returns

() => `void`
