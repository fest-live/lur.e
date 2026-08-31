[**@fest-lib/lure v0.1.53**](../README.md)

***

[@fest-lib/lure](../README.md) / observeStyleTree

# Function: observeStyleTree()

```ts
function observeStyleTree(root): any;
```

Defined in: style.ts/src/sheets.ts:298

WHY: hosts often enter via innerHTML / H`` / upgrade after first connectedCallback;
childList + theme attrs must re-apply CSS without waiting for resume.
FIND:style-tree

## Parameters

### root

`any`

## Returns

`any`
