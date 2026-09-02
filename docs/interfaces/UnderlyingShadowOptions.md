[**@fest-lib/lure v0.1.54**](../README.md)

***

[@fest-lib/lure](../README.md) / UnderlyingShadowOptions

# Interface: UnderlyingShadowOptions

Defined in: lur.e/src/design/layers/UnderlyingShadow.ts:17

## Properties

### className?

```ts
optional className?: string;
```

Defined in: lur.e/src/design/layers/UnderlyingShadow.ts:44

Extra class on the shadow container (e.g. hover CSS hooks).

***

### cloneGeometry?

```ts
optional cloneGeometry?: boolean;
```

Defined in: lur.e/src/design/layers/UnderlyingShadow.ts:34

***

### geometrySource?

```ts
optional geometrySource?: HTMLElement | null;
```

Defined in: lur.e/src/design/layers/UnderlyingShadow.ts:23

Shape/radius source when different from `target` (e.g. `.ui-ws-item-icon` while
`target` is the grid `.ui-ws-item` sibling anchor).

***

### inset?

```ts
optional inset?: number;
```

Defined in: lur.e/src/design/layers/UnderlyingShadow.ts:31

***

### opacity?

```ts
optional opacity?: number;
```

Defined in: lur.e/src/design/layers/UnderlyingShadow.ts:30

***

### positioning?

```ts
optional positioning?: LayerPositioning | "fixed";
```

Defined in: lur.e/src/design/layers/UnderlyingShadow.ts:42

- `contain` — absolute inset:0 sibling in parent (relative hosts).
- `fixed` — viewport-fixed bbox (context menus / `position:fixed` hosts).
- `anchor` — CSS anchor fill of `target` (grid item siblings in speed-dial).

***

### shadowBlur?

```ts
optional shadowBlur?: number;
```

Defined in: lur.e/src/design/layers/UnderlyingShadow.ts:26

***

### shadowColor?

```ts
optional shadowColor?: string;
```

Defined in: lur.e/src/design/layers/UnderlyingShadow.ts:25

***

### shadowOffsetX?

```ts
optional shadowOffsetX?: number;
```

Defined in: lur.e/src/design/layers/UnderlyingShadow.ts:27

***

### shadowOffsetY?

```ts
optional shadowOffsetY?: number;
```

Defined in: lur.e/src/design/layers/UnderlyingShadow.ts:28

***

### shadowType?

```ts
optional shadowType?: "drop-shadow" | "blur" | "box-shadow";
```

Defined in: lur.e/src/design/layers/UnderlyingShadow.ts:24

***

### spreadRadius?

```ts
optional spreadRadius?: number;
```

Defined in: lur.e/src/design/layers/UnderlyingShadow.ts:29

***

### target

```ts
target: HTMLElement;
```

Defined in: lur.e/src/design/layers/UnderlyingShadow.ts:18

***

### updateOnResize?

```ts
optional updateOnResize?: boolean;
```

Defined in: lur.e/src/design/layers/UnderlyingShadow.ts:36

***

### updateOnScroll?

```ts
optional updateOnScroll?: boolean;
```

Defined in: lur.e/src/design/layers/UnderlyingShadow.ts:35

***

### useIntersection?

```ts
optional useIntersection?: boolean;
```

Defined in: lur.e/src/design/layers/UnderlyingShadow.ts:33

***

### zIndexShift?

```ts
optional zIndexShift?: number;
```

Defined in: lur.e/src/design/layers/UnderlyingShadow.ts:32
