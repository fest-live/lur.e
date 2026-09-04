[**@fest-lib/lure v0.1.59**](../README.md)

***

[@fest-lib/lure](../README.md) / datasetLink

# Function: datasetLink()

```ts
function datasetLink(
   element?, 
   exists?, 
   key?, 
   initial?): (() => void) | undefined;
```

Defined in: lur.e/src/lure/core/Links.ts:345

Bidirectionally link a reactive ref to one `data-*` entry.
Dataset writes flow through `handleDataset`; external attribute mutations
commit back through the normal Linker lifecycle.

## Parameters

### element?

`any`

### exists?

`any`

### key?

`string` = `""`

### initial?

`any`

## Returns

(() => `void`) \| `undefined`
