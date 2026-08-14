[**@fest-lib/lure v0.1.19**](../README.md)

***

[@fest-lib/lure](../README.md) / compileInlineStyleAttribute

# Function: compileInlineStyleAttribute()

```ts
function compileInlineStyleAttribute(source, attributes): 
  | InlineStyleAttributePlan
  | null;
```

Defined in: lur.e/src/lure/misc/Styles.ts:2267

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
