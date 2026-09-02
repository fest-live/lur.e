[**@fest-lib/lure v0.1.56**](../README.md)

***

[@fest-lib/lure](../README.md) / PlacementOrigin

# Type Alias: PlacementOrigin

```ts
type PlacementOrigin = 
  | {
  type: "point";
  x: number;
  y: number;
}
  | {
  rect: PlacementRect;
  type: "element";
};
```

Defined in: lur.e/src/design/anchor/Placement.ts:30
