[**@fest-lib/lure v0.1.46**](../README.md)

***

[@fest-lib/lure](../README.md) / isStyleBinding

# Function: isStyleBinding()

```ts
function isStyleBinding(styles): styles is StyleBinding;
```

Defined in: lur.e/src/lure/misc/Styles.ts:58

Detect S`...` / css`...` StyleBinding tuple.
WHY: arrays must not be treated as `{ 0, 1, 2 }` style objects in reflectStyles /
reflectAttributes — that was breaking `style=${S\`...\`}`.

## Parameters

### styles

`any`

## Returns

`styles is StyleBinding`
