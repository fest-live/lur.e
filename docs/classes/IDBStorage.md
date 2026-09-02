[**@fest-lib/lure v0.1.56**](../README.md)

***

[@fest-lib/lure](../README.md) / IDBStorage

# Class: IDBStorage

Defined in: lur.e/src/utils/opfs/index.ts:271

IndexedDB wrapper for structured object storage

## Constructors

### Constructor

```ts
new IDBStorage(dbName, storeName): IDBStorage;
```

Defined in: lur.e/src/utils/opfs/index.ts:276

#### Parameters

##### dbName

`string`

##### storeName

`string`

#### Returns

`IDBStorage`

## Methods

### clear()

```ts
clear(): Promise<void>;
```

Defined in: lur.e/src/utils/opfs/index.ts:350

#### Returns

`Promise`\<`void`\>

***

### close()

```ts
close(): void;
```

Defined in: lur.e/src/utils/opfs/index.ts:362

#### Returns

`void`

***

### delete()

```ts
delete(id): Promise<void>;
```

Defined in: lur.e/src/utils/opfs/index.ts:326

#### Parameters

##### id

`string`

#### Returns

`Promise`\<`void`\>

***

### get()

```ts
get<T>(id): Promise<T | null>;
```

Defined in: lur.e/src/utils/opfs/index.ts:302

#### Type Parameters

##### T

`T`

#### Parameters

##### id

`string`

#### Returns

`Promise`\<`T` \| `null`\>

***

### getAll()

```ts
getAll<T>(): Promise<T[]>;
```

Defined in: lur.e/src/utils/opfs/index.ts:338

#### Type Parameters

##### T

`T`

#### Returns

`Promise`\<`T`[]\>

***

### open()

```ts
open(): Promise<IDBDatabase>;
```

Defined in: lur.e/src/utils/opfs/index.ts:281

#### Returns

`Promise`\<`IDBDatabase`\>

***

### set()

```ts
set<T>(id, value): Promise<void>;
```

Defined in: lur.e/src/utils/opfs/index.ts:314

#### Type Parameters

##### T

`T` *extends* `object`

#### Parameters

##### id

`string`

##### value

`T`

#### Returns

`Promise`\<`void`\>
