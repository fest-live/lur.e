[**@fest-lib/lure v0.1.48**](../README.md)

***

[@fest-lib/lure](../README.md) / TransientOverlayOptions

# Type Alias: TransientOverlayOptions

```ts
type TransientOverlayOptions = object;
```

Defined in: lur.e/src/design/overlays/OverlayHost.ts:46

## Properties

### close

```ts
close: () => boolean | void;
```

Defined in: lur.e/src/design/overlays/OverlayHost.ts:51

#### Returns

`boolean` \| `void`

***

### element?

```ts
optional element?: HTMLElement | null;
```

Defined in: lur.e/src/design/overlays/OverlayHost.ts:49

***

### group?

```ts
optional group?: string;
```

Defined in: lur.e/src/design/overlays/OverlayHost.ts:53

***

### id?

```ts
optional id?: string;
```

Defined in: lur.e/src/design/overlays/OverlayHost.ts:47

***

### isActive?

```ts
optional isActive?: () => boolean;
```

Defined in: lur.e/src/design/overlays/OverlayHost.ts:50

#### Returns

`boolean`

***

### kind

```ts
kind: TransientOverlayKind;
```

Defined in: lur.e/src/design/overlays/OverlayHost.ts:48

***

### priority?

```ts
optional priority?: ClosePriority | number;
```

Defined in: lur.e/src/design/overlays/OverlayHost.ts:52
