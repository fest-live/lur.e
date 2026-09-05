[**@fest-lib/lure v0.1.64**](../README.md)

***

[@fest-lib/lure](../README.md) / IdbDirectoryHandle

# Class: IdbDirectoryHandle

Defined in: lur.e/src/utils/opfs/IdbFs.ts:288

## Constructors

### Constructor

```ts
new IdbDirectoryHandle(
   store, 
   path, 
   name): IdbDirectoryHandle;
```

Defined in: lur.e/src/utils/opfs/IdbFs.ts:295

#### Parameters

##### store

[`IdbFsStore`](../interfaces/IdbFsStore.md)

##### path

`string`

##### name

`string`

#### Returns

`IdbDirectoryHandle`

## Properties

### \[IDB\_FS\_BRAND\]

```ts
readonly [IDB_FS_BRAND]: true = true;
```

Defined in: lur.e/src/utils/opfs/IdbFs.ts:290

***

### kind

```ts
readonly kind: "directory";
```

Defined in: lur.e/src/utils/opfs/IdbFs.ts:289

***

### name

```ts
readonly name: string;
```

Defined in: lur.e/src/utils/opfs/IdbFs.ts:291

## Methods

### entries()

```ts
entries(): AsyncGenerator<[string, IdbDirectoryHandle | IdbFileHandle]>;
```

Defined in: lur.e/src/utils/opfs/IdbFs.ts:358

#### Returns

`AsyncGenerator`\<\[`string`, `IdbDirectoryHandle` \| [`IdbFileHandle`](IdbFileHandle.md)\]\>

***

### getDirectoryHandle()

```ts
getDirectoryHandle(name, options?): Promise<IdbDirectoryHandle>;
```

Defined in: lur.e/src/utils/opfs/IdbFs.ts:301

#### Parameters

##### name

`string`

##### options?

###### create?

`boolean`

#### Returns

`Promise`\<`IdbDirectoryHandle`\>

***

### getFileHandle()

```ts
getFileHandle(name, options?): Promise<IdbFileHandle>;
```

Defined in: lur.e/src/utils/opfs/IdbFs.ts:320

#### Parameters

##### name

`string`

##### options?

###### create?

`boolean`

#### Returns

`Promise`\<[`IdbFileHandle`](IdbFileHandle.md)\>

***

### keys()

```ts
keys(): AsyncGenerator<string>;
```

Defined in: lur.e/src/utils/opfs/IdbFs.ts:368

#### Returns

`AsyncGenerator`\<`string`\>

***

### removeEntry()

```ts
removeEntry(name, options?): Promise<void>;
```

Defined in: lur.e/src/utils/opfs/IdbFs.ts:343

#### Parameters

##### name

`string`

##### options?

###### recursive?

`boolean`

#### Returns

`Promise`\<`void`\>

***

### values()

```ts
values(): AsyncGenerator<IdbDirectoryHandle | IdbFileHandle>;
```

Defined in: lur.e/src/utils/opfs/IdbFs.ts:372

#### Returns

`AsyncGenerator`\<`IdbDirectoryHandle` \| [`IdbFileHandle`](IdbFileHandle.md)\>
