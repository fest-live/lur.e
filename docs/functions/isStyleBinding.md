[**@fest-lib/lure v0.1.50**](../README.md)

***

[@fest-lib/lure](../README.md) / isStyleBinding

# Function: isStyleBinding()

```ts
function isStyleBinding(styles): styles is StyleBinding;
```

Defined in: style.ts/src/Styles.ts:65

Detect S`...` / css`...` StyleBinding tuple.
WHY: arrays must not be treated as `{ 0, 1, 2 }` style objects in reflectStyles /
reflectAttributes — that was breaking `style=${S\`...\`}`.

## Parameters

### styles

`any`

## Returns

`styles is StyleBinding`
