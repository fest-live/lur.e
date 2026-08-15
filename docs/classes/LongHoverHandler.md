[**@fest-lib/lure v0.1.30**](../README.md)

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

Defined in: lur.e/src/interactive/controllers/LongHover.ts:8

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

Defined in: lur.e/src/interactive/controllers/LongHover.ts:15

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
longHover(options, fx?): void;
```

Defined in: lur.e/src/interactive/controllers/LongHover.ts:20

#### Parameters

##### options

`any`

##### fx?

(`ev`) => `void`

#### Returns

`void`
