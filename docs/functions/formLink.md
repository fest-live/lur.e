[**@fest-lib/lure v0.1.49**](../README.md)

***

[@fest-lib/lure](../README.md) / formLink

# Function: formLink()

```ts
function formLink(
   element?, 
   exists?, 
   kind?, 
   options?): (() => void) | undefined;
```

Defined in: lur.e/src/lure/core/Links.ts:524

Select a canonical Linker preset for common form control families.
This is additive: the existing specialized links remain public APIs.

## Parameters

### element?

`any`

### exists?

`any`

### kind?

[`FormKind`](../type-aliases/FormKind.md) = `"text"`

### options?

[`FormLinkOptions`](../type-aliases/FormLinkOptions.md) = `{}`

## Returns

(() => `void`) \| `undefined`
