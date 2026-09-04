[**@fest-lib/lure v0.1.62**](../README.md)

***

[@fest-lib/lure](../README.md) / registerLayerElement

# Function: registerLayerElement()

```ts
function registerLayerElement(
   name, 
   construct, 
   opts?): (
  | WeakMap<WeakKey, any>
  | ((content, holder?, inputChange?) => boolean)
  | typeof LayerModifier)[];
```

Defined in: lur.e/src/design/layers/Register.ts:14

## Parameters

### name

`string`

### construct

(`content`, `holder?`, `inputChange?`) => `HTMLElement` \| `null` \| `undefined`

### opts?

#### role

[`LayerRole`](../type-aliases/LayerRole.md)

## Returns

(
  \| `WeakMap`\<`WeakKey`, `any`\>
  \| ((`content`, `holder?`, `inputChange?`) => `boolean`)
  \| *typeof* `LayerModifier`)[]
