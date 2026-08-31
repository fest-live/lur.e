[**@fest-lib/lure v0.1.52**](../README.md)

***

[@fest-lib/lure](../README.md) / queryFirstDeep

# Function: queryFirstDeep()

```ts
function queryFirstDeep(root, selector): HTMLElement | null;
```

Defined in: style.ts/src/utils.ts:378

First `querySelector` hit in `root`, then nested `shadowRoot`s.

## Parameters

### root

`ParentNode` \| `null` \| `undefined`

### selector

`string`

## Returns

`HTMLElement` \| `null`
