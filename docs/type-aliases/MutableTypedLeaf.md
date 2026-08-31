[**@fest-lib/lure v0.1.51**](../README.md)

***

[@fest-lib/lure](../README.md) / MutableTypedLeaf

# Type Alias: MutableTypedLeaf

```ts
type MutableTypedLeaf = TypedOMLeaf & object;
```

Defined in: style.ts/src/types.ts:80

## Type Declaration

### property

```ts
property: string;
```

Declaration this leaf participates in (for styleMap re-set after .value mutation).

### root

```ts
root: any;
```

Persistent Typed OM root previously passed to styleMap.set(property, root).
