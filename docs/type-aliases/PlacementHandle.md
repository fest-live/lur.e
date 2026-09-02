[**@fest-lib/lure v0.1.56**](../README.md)

***

[@fest-lib/lure](../README.md) / PlacementHandle

# Type Alias: PlacementHandle

```ts
type PlacementHandle = object;
```

Defined in: lur.e/src/design/anchor/Placement.ts:187

## Properties

### dispose

```ts
dispose: () => void;
```

Defined in: lur.e/src/design/anchor/Placement.ts:190

#### Returns

`void`

***

### strategy

```ts
strategy: Exclude<OverlayPlacementStrategy, "auto">;
```

Defined in: lur.e/src/design/anchor/Placement.ts:188

***

### update

```ts
update: () => PlacementResult | null;
```

Defined in: lur.e/src/design/anchor/Placement.ts:189

#### Returns

[`PlacementResult`](PlacementResult.md) \| `null`
