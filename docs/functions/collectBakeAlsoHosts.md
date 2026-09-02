[**@fest-lib/lure v0.1.55**](../README.md)

***

[@fest-lib/lure](../README.md) / collectBakeAlsoHosts

# Function: collectBakeAlsoHosts()

```ts
function collectBakeAlsoHosts(
   root, 
   queries?, 
   pierceShadow?): BakeAlsoHit[];
```

Defined in: style.ts/src/baker.ts:188

One sample per query. Same tree as `root` → scope under the view selector;
nested shadow (explorer rows) → write the query as-is into that shadow sheet.

## Parameters

### root

`HTMLElement` \| `null` \| `undefined`

### queries?

readonly `string`[] = `BAKE_SCREEN_ALSO`

### pierceShadow?

`boolean` = `true`

## Returns

[`BakeAlsoHit`](../type-aliases/BakeAlsoHit.md)[]
