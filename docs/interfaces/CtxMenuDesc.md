[**@fest-lib/lure v0.1.47**](../README.md)

***

[@fest-lib/lure](../README.md) / CtxMenuDesc

# Interface: CtxMenuDesc

Defined in: lur.e/src/interactive/modules/CtxMenu.ts:25

## Properties

### buildItems?

```ts
optional buildItems?: (details) => void | MenuItem[][];
```

Defined in: lur.e/src/interactive/modules/CtxMenu.ts:28

#### Parameters

##### details

###### ctxMenuDesc

`CtxMenuDesc`

###### event

`MouseEvent`

###### initiator

`HTMLElement`

###### menu

`HTMLElement`

###### trigger

`HTMLElement`

#### Returns

`void` \| [`MenuItem`](MenuItem.md)[][]

***

### context?

```ts
optional context?: any;
```

Defined in: lur.e/src/interactive/modules/CtxMenu.ts:30

***

### defaultAction?

```ts
optional defaultAction?: (initiator, item, ev) => void;
```

Defined in: lur.e/src/interactive/modules/CtxMenu.ts:27

#### Parameters

##### initiator

`HTMLElement`

##### item

[`MenuItem`](MenuItem.md)

##### ev

`MouseEvent`

#### Returns

`void`

***

### items?

```ts
optional items?: MenuItem[][];
```

Defined in: lur.e/src/interactive/modules/CtxMenu.ts:26

***

### onBeforeOpen?

```ts
optional onBeforeOpen?: (details) => boolean | void;
```

Defined in: lur.e/src/interactive/modules/CtxMenu.ts:29

#### Parameters

##### details

###### ctxMenuDesc

`CtxMenuDesc`

###### event

`MouseEvent`

###### initiator

`HTMLElement`

###### menu

`HTMLElement`

###### trigger

`HTMLElement`

#### Returns

`boolean` \| `void`

***

### openedWith?

```ts
optional openedWith?: 
  | {
  close: () => void;
  context?: any;
  element: HTMLElement;
  event: MouseEvent;
  initiator: HTMLElement;
}
  | null;
```

Defined in: lur.e/src/interactive/modules/CtxMenu.ts:31
