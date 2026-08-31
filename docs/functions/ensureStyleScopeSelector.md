[**@fest-lib/lure v0.1.53**](../README.md)

***

[@fest-lib/lure](../README.md) / ensureStyleScopeSelector

# Function: ensureStyleScopeSelector()

```ts
function ensureStyleScopeSelector(element): string;
```

Defined in: style.ts/src/cssom.ts:52

INVARIANT: `#id` wins over `data-style-id` (same as getStyleRule / baker).
Missing `data-style-id` is assigned once and reused.

## Parameters

### element

`Element`

## Returns

`string`
