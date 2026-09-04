[**@fest-lib/lure v0.1.59**](../README.md)

***

[@fest-lib/lure](../README.md) / compileInlineStyleAttribute

# Function: compileInlineStyleAttribute()

```ts
function compileInlineStyleAttribute(source, attributes): 
  | InlineStyleAttributePlan
  | null;
```

Defined in: style.ts/src/Styles.ts:2020

Converts an H style attribute containing internal #{n}
placeholders into static CSS, a direct legacy binding, or S.

## Parameters

### source

`string`

### attributes

readonly `any`[]

## Returns

  \| [`InlineStyleAttributePlan`](../type-aliases/InlineStyleAttributePlan.md)
  \| `null`
