[**@fest-lib/lure v0.1.46**](../README.md)

***

[@fest-lib/lure](../README.md) / registerOverlayElement

# Function: registerOverlayElement()

```ts
function registerOverlayElement(name, construct): (
  | WeakMap<WeakKey, any>
  | ((content, holder?, inputChange?) => boolean)
  | typeof LayerModifier)[];
```

Defined in: lur.e/src/design/layers/Register.ts:53

COMPAT: previous overlay-only registrar.

## Parameters

### name

`any`

### construct

`any`

## Returns

(
  \| `WeakMap`\<`WeakKey`, `any`\>
  \| ((`content`, `holder?`, `inputChange?`) => `boolean`)
  \| *typeof* `LayerModifier`)[]
