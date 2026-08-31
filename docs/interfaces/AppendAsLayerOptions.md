[**@fest-lib/lure v0.1.50**](../README.md)

***

[@fest-lib/lure](../README.md) / AppendAsLayerOptions

# Interface: AppendAsLayerOptions

Defined in: lur.e/src/design/layers/types.ts:24

## Properties

### inset?

```ts
optional inset?: number;
```

Defined in: lur.e/src/design/layers/types.ts:32

***

### placement?

```ts
optional placement?: LayerPlacement;
```

Defined in: lur.e/src/design/layers/types.ts:29

***

### positioning?

```ts
optional positioning?: LayerPositioning;
```

Defined in: lur.e/src/design/layers/types.ts:31

Default "anchor". Use "contain" for overlay hosts that nest absolute chrome (scrollbars).

***

### role

```ts
role: LayerRole;
```

Defined in: lur.e/src/design/layers/types.ts:25

***

### root?

```ts
optional root?: HTMLElement | Window;
```

Defined in: lur.e/src/design/layers/types.ts:35

***

### size?

```ts
optional size?: string;
```

Defined in: lur.e/src/design/layers/types.ts:33

***

### stackMode?

```ts
optional stackMode?: StackMode;
```

Defined in: lur.e/src/design/layers/types.ts:26

***

### transformOrigin?

```ts
optional transformOrigin?: string;
```

Defined in: lur.e/src/design/layers/types.ts:36

***

### useIntersection?

```ts
optional useIntersection?: boolean;
```

Defined in: lur.e/src/design/layers/types.ts:34

***

### zIndexShift?

```ts
optional zIndexShift?: number;
```

Defined in: lur.e/src/design/layers/types.ts:28

Default −1 underlying / +1 overlaying; ignored when stackMode is order-equal.
