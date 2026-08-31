[**@fest-lib/lure v0.1.53**](../README.md)

***

[@fest-lib/lure](../README.md) / ContentAddressedStore

# Interface: ContentAddressedStore

Defined in: lur.e/src/utils/opfs/content-addressed-store.ts:24

## Methods

### clear()

```ts
clear(prefix?): Promise<void>;
```

Defined in: lur.e/src/utils/opfs/content-addressed-store.ts:29

#### Parameters

##### prefix?

`string`

#### Returns

`Promise`\<`void`\>

***

### get()

```ts
get(ref): Promise<File | null>;
```

Defined in: lur.e/src/utils/opfs/content-addressed-store.ts:26

#### Parameters

##### ref

[`StoredBlobRef`](../type-aliases/StoredBlobRef.md)

#### Returns

`Promise`\<`File` \| `null`\>

***

### put()

```ts
put(file): Promise<StoredBlobRef>;
```

Defined in: lur.e/src/utils/opfs/content-addressed-store.ts:25

#### Parameters

##### file

`File`

#### Returns

`Promise`\<[`StoredBlobRef`](../type-aliases/StoredBlobRef.md)\>

***

### readJson()

```ts
readJson<T>(path): Promise<T | null>;
```

Defined in: lur.e/src/utils/opfs/content-addressed-store.ts:27

#### Type Parameters

##### T

`T`

#### Parameters

##### path

`string`

#### Returns

`Promise`\<`T` \| `null`\>

***

### writeJson()

```ts
writeJson(path, value): Promise<void>;
```

Defined in: lur.e/src/utils/opfs/content-addressed-store.ts:28

#### Parameters

##### path

`string`

##### value

`unknown`

#### Returns

`Promise`\<`void`\>
