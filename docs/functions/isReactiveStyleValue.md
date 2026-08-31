[**@fest-lib/lure v0.1.50**](../README.md)

***

[@fest-lib/lure](../README.md) / isReactiveStyleValue

# Function: isReactiveStyleValue()

```ts
function isReactiveStyleValue(value): boolean;
```

Defined in: style.ts/src/Styles.ts:287

Detects the existing reactive `{ value: ... }` contract.

Native CSSStyleValue must be checked first because CSSUnitValue
also contains a `value` property.

## Parameters

### value

`any`

## Returns

`boolean`
