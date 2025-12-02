[**@fest-lib/lure v0.0.0**](../README.md)

***

[@fest-lib/lure](../README.md) / CtxMenuDesc

# Interface: CtxMenuDesc

Defined in: [modules/projects/lur.e/src/extension/core/CtxMenu.ts:21](https://github.com/fest-live/lur.e/blob/211e5159c17466d5ef8d3d0f9ccb52b3f19f48d6/src/extension/core/CtxMenu.ts#L21)

## Properties

### buildItems()?

```ts
optional buildItems: (details) => void | MenuItem[][];
```

Defined in: [modules/projects/lur.e/src/extension/core/CtxMenu.ts:24](https://github.com/fest-live/lur.e/blob/211e5159c17466d5ef8d3d0f9ccb52b3f19f48d6/src/extension/core/CtxMenu.ts#L24)

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
optional context: any;
```

Defined in: [modules/projects/lur.e/src/extension/core/CtxMenu.ts:26](https://github.com/fest-live/lur.e/blob/211e5159c17466d5ef8d3d0f9ccb52b3f19f48d6/src/extension/core/CtxMenu.ts#L26)

***

### defaultAction()?

```ts
optional defaultAction: (initiator, item, ev) => void;
```

Defined in: [modules/projects/lur.e/src/extension/core/CtxMenu.ts:23](https://github.com/fest-live/lur.e/blob/211e5159c17466d5ef8d3d0f9ccb52b3f19f48d6/src/extension/core/CtxMenu.ts#L23)

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

Defined in: [modules/projects/lur.e/src/extension/core/CtxMenu.ts:22](https://github.com/fest-live/lur.e/blob/211e5159c17466d5ef8d3d0f9ccb52b3f19f48d6/src/extension/core/CtxMenu.ts#L22)

***

### onBeforeOpen()?

```ts
optional onBeforeOpen: (details) => boolean | void;
```

Defined in: [modules/projects/lur.e/src/extension/core/CtxMenu.ts:25](https://github.com/fest-live/lur.e/blob/211e5159c17466d5ef8d3d0f9ccb52b3f19f48d6/src/extension/core/CtxMenu.ts#L25)

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
optional openedWith: 
  | {
  close: () => void;
  context?: any;
  element: HTMLElement;
  event: MouseEvent;
  initiator: HTMLElement;
}
  | null;
```

Defined in: [modules/projects/lur.e/src/extension/core/CtxMenu.ts:27](https://github.com/fest-live/lur.e/blob/211e5159c17466d5ef8d3d0f9ccb52b3f19f48d6/src/extension/core/CtxMenu.ts#L27)
