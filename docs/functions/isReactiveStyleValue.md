[**@fest-lib/lure v0.1.41**](../README.md)

***

[@fest-lib/lure](../README.md) / isReactiveStyleValue

# Function: isReactiveStyleValue()

```ts
function isReactiveStyleValue(value): boolean;
```

Defined in: lur.e/src/lure/misc/Styles.ts:280

Detects the existing reactive `{ value: ... }` contract.

Native CSSStyleValue must be checked first because CSSUnitValue
also contains a `value` property.

## Parameters

### value

`any`

## Returns

`boolean`
