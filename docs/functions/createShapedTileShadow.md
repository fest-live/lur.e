[**@fest-lib/lure v0.1.38**](../README.md)

***

[@fest-lib/lure](../README.md) / createShapedTileShadow

# Function: createShapedTileShadow()

```ts
function createShapedTileShadow(target, options?): UnderlyingShadow;
```

Defined in: lur.e/src/design/layers/UnderlyingShadow.ts:416

Shaped under-glow for glass tiles (`backdrop-filter` on main).
INVARIANT: `target` is the grid `.ui-ws-item` (under is a preceding sibling in the grid);
shape/radius clones from `geometrySource` (usually `.ui-ws-item-icon`).

## Parameters

### target

`HTMLElement`

### options?

`Partial`\<[`UnderlyingShadowOptions`](../interfaces/UnderlyingShadowOptions.md)\>

## Returns

[`UnderlyingShadow`](../classes/UnderlyingShadow.md)
