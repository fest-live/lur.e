[**@fest-lib/lure v0.1.54**](../README.md)

***

[@fest-lib/lure](../README.md) / bakeScreenColors

# Function: bakeScreenColors()

```ts
function bakeScreenColors(root, options?): BakedStyleSheet[];
```

Defined in: style.ts/src/baker.ts:574

Bake tokens + colors for a view host (and closest window / modal) under `@media screen`.
WHY: explorer / markdown keep `color-mix` / `light-dark` for print; screen uses the snapshot.
INVARIANT: rows / fields are one sample → class selector, not a sheet per item.

## Parameters

### root

`HTMLElement` \| `null` \| `undefined`

### options?

[`BakeOptions`](../type-aliases/BakeOptions.md) = `{}`

## Returns

[`BakedStyleSheet`](../type-aliases/BakedStyleSheet.md)[]
