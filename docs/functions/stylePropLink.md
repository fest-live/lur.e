[**@fest-lib/lure v0.1.57**](../README.md)

***

[@fest-lib/lure](../README.md) / stylePropLink

# Function: stylePropLink()

```ts
function stylePropLink(
   element?, 
   exists?, 
   property?, 
   initial?): (() => void) | undefined;
```

Defined in: lur.e/src/lure/core/Links.ts:367

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
