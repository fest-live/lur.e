[**@fest-lib/lure v0.1.57**](../README.md)

***

[@fest-lib/lure](../README.md) / NumericToken

# Type Alias: NumericToken

```ts
type NumericToken = 
  | {
  kind: "number";
  unit: string | null;
  value: number;
}
  | {
  kind: "variable";
  marker: string;
}
  | {
  kind: "identifier";
  value: string;
}
  | {
  kind: "symbol";
  value: "+" | "-" | "*" | "/" | "(" | ")" | ",";
};
```

Defined in: style.ts/src/types.ts:129
