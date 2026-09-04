[**@fest-lib/lure v0.1.60**](../README.md)

***

[@fest-lib/lure](../README.md) / bakeComputedStyle

# Function: bakeComputedStyle()

```ts
function bakeComputedStyle(el, options?): BakedStyleSheet | null;
```

Defined in: style.ts/src/baker.ts:487

Bake computed styles for `el` into `@layer ux-baked` scoped by `#id` or `data-style-id`.

## Parameters

### el

`HTMLElement` \| `null` \| `undefined`

### options?

[`BakeOptions`](../type-aliases/BakeOptions.md) = `{}`

## Returns

[`BakedStyleSheet`](../type-aliases/BakedStyleSheet.md) \| `null`
