[**@fest-lib/lure v0.1.64**](../README.md)

***

[@fest-lib/lure](../README.md) / InlineStyleAttributePlan

# Type Alias: InlineStyleAttributePlan

```ts
type InlineStyleAttributePlan = 
  | {
  cssText: string;
  kind: "static";
}
  | {
  kind: "direct";
  value: any;
}
  | {
  binding: StyleBinding;
  kind: "template";
};
```

Defined in: style.ts/src/types.ts:115
