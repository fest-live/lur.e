[**@fest/lure v0.0.0**](../README.md)

***

[@fest/lure](../README.md) / CtxMenuDesc

# Interface: CtxMenuDesc

Defined in: [modules/projects/lur.e/src/extension/core/CtxMenu.ts:20](https://github.com/fest-live/lur.e/blob/8033cbe33e37b11f63de4da332415467e40bf204/src/extension/core/CtxMenu.ts#L20)

## Properties

### defaultAction()?

```ts
optional defaultAction: (initiator, item, ev) => void;
```

Defined in: [modules/projects/lur.e/src/extension/core/CtxMenu.ts:22](https://github.com/fest-live/lur.e/blob/8033cbe33e37b11f63de4da332415467e40bf204/src/extension/core/CtxMenu.ts#L22)

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
optional items: MenuItem[][];
```

Defined in: [modules/projects/lur.e/src/extension/core/CtxMenu.ts:21](https://github.com/fest-live/lur.e/blob/8033cbe33e37b11f63de4da332415467e40bf204/src/extension/core/CtxMenu.ts#L21)

***

### openedWith?

```ts
optional openedWith: 
  | null
  | {
  close: () => void;
  element: HTMLElement;
  event: MouseEvent;
  initiator: HTMLElement;
};
```

Defined in: [modules/projects/lur.e/src/extension/core/CtxMenu.ts:23](https://github.com/fest-live/lur.e/blob/8033cbe33e37b11f63de4da332415467e40bf204/src/extension/core/CtxMenu.ts#L23)
