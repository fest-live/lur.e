[**@fest-lib/lure v0.1.54**](../README.md)

***

[@fest-lib/lure](../README.md) / cssVarLink

# Variable: cssVarLink

```ts
const cssVarLink: (element?, exists?, property, initial?) => (() => void) | undefined = stylePropLink;
```

Defined in: lur.e/src/lure/core/Links.ts:381

Alias for `stylePropLink` that documents a `--custom-property` binding.

One-way explicit binding for an inline CSS property or custom property.
Reverse style-attribute observation is intentionally deferred: style is a
shared write surface where one mutation can contain unrelated properties.

## Parameters

### element?

`any`

### exists?

`any`

### property?

`string` = `""`

### initial?

`any`

## Returns

(() => `void`) \| `undefined`
