[**@fest-lib/lure v0.1.51**](../README.md)

***

[@fest-lib/lure](../README.md) / StoredBlobRef

# Type Alias: StoredBlobRef

```ts
type StoredBlobRef = object;
```

Defined in: lur.e/src/utils/opfs/content-addressed-store.ts:9

Content-addressed OPFS storage for durable local application state.

FIND:opfs-content-store
WHY: A manifest can safely reference immutable blobs without serializing
File data into localStorage or duplicating equal clipboard/drop payloads.

## Properties

### hash

```ts
hash: string;
```

Defined in: lur.e/src/utils/opfs/content-addressed-store.ts:10

***

### lastModified

```ts
lastModified: number;
```

Defined in: lur.e/src/utils/opfs/content-addressed-store.ts:15

***

### name

```ts
name: string;
```

Defined in: lur.e/src/utils/opfs/content-addressed-store.ts:12

***

### path

```ts
path: string;
```

Defined in: lur.e/src/utils/opfs/content-addressed-store.ts:11

***

### size

```ts
size: number;
```

Defined in: lur.e/src/utils/opfs/content-addressed-store.ts:14

***

### type

```ts
type: string;
```

Defined in: lur.e/src/utils/opfs/content-addressed-store.ts:13
