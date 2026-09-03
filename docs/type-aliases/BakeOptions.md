[**@fest-lib/lure v0.1.57**](../README.md)

***

[@fest-lib/lure](../README.md) / BakeOptions

# Type Alias: BakeOptions

```ts
type BakeOptions = object;
```

Defined in: style.ts/src/types.ts:43

## Properties

### also?

```ts
optional also?: readonly string[];
```

Defined in: style.ts/src/types.ts:55

First match per query (light or pierced shadow). Written as that selector,
scoped to the view root when the sample lives in the same tree.

***

### cacheMs?

```ts
optional cacheMs?: number;
```

Defined in: style.ts/src/types.ts:46

***

### categories?

```ts
optional categories?: readonly BakeCategory[];
```

Defined in: style.ts/src/types.ts:44

***

### layer?

```ts
optional layer?: string;
```

Defined in: style.ts/src/types.ts:45

***

### media?

```ts
optional media?: string | false;
```

Defined in: style.ts/src/types.ts:48

Wrap baked rules in `@media …`. `false` skips wrap. Default `"screen"`.

***

### pierceShadow?

```ts
optional pierceShadow?: boolean;
```

Defined in: style.ts/src/types.ts:57

Walk nested `shadowRoot` when resolving `also`. Default true for screen bake.

***

### selector?

```ts
optional selector?: string;
```

Defined in: style.ts/src/types.ts:50

Written selector. Default `#id` / `[data-style-id]`. Use a class for rows/fields.
