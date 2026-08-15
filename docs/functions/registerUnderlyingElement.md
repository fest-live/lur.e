[**@fest-lib/lure v0.1.27**](../README.md)

***

[@fest-lib/lure](../README.md) / registerUnderlyingElement

# Function: registerUnderlyingElement()

```ts
function registerUnderlyingElement(name, construct): (
  | WeakMap<WeakKey, any>
  | ((content, holder?, inputChange?) => boolean)
  | typeof LayerModifier)[];
```

Defined in: lur.e/src/design/layers/Register.ts:56

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
