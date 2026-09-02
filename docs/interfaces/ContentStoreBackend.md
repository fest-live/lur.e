[**@fest-lib/lure v0.1.54**](../README.md)

***

[@fest-lib/lure](../README.md) / ContentStoreBackend

# Interface: ContentStoreBackend

Defined in: lur.e/src/utils/opfs/content-addressed-store.ts:18

## Methods

### read()

```ts
read(path): Promise<Blob | null>;
```

Defined in: lur.e/src/utils/opfs/content-addressed-store.ts:19

#### Parameters

##### path

`string`

#### Returns

`Promise`\<`Blob` \| `null`\>

***

### removeTree()

```ts
removeTree(prefix): Promise<void>;
```

Defined in: lur.e/src/utils/opfs/content-addressed-store.ts:21

#### Parameters

##### prefix

`string`

#### Returns

`Promise`\<`void`\>

***

### write()

```ts
write(path, data): Promise<void>;
```

Defined in: lur.e/src/utils/opfs/content-addressed-store.ts:20

#### Parameters

##### path

`string`

##### data

`string` \| `Blob`

#### Returns

`Promise`\<`void`\>
