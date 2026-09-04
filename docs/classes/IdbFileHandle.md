[**@fest-lib/lure v0.1.59**](../README.md)

***

[@fest-lib/lure](../README.md) / IdbFileHandle

# Class: IdbFileHandle

Defined in: lur.e/src/utils/opfs/IdbFs.ts:220

## Constructors

### Constructor

```ts
new IdbFileHandle(
   store, 
   path, 
   name, 
   type?): IdbFileHandle;
```

Defined in: lur.e/src/utils/opfs/IdbFs.ts:228

#### Parameters

##### store

[`IdbFsStore`](../interfaces/IdbFsStore.md)

##### path

`string`

##### name

`string`

##### type?

`string` = `""`

#### Returns

`IdbFileHandle`

## Properties

### \[IDB\_FS\_BRAND\]

```ts
readonly [IDB_FS_BRAND]: true = true;
```

Defined in: lur.e/src/utils/opfs/IdbFs.ts:222

***

### kind

```ts
readonly kind: "file";
```

Defined in: lur.e/src/utils/opfs/IdbFs.ts:221

***

### name

```ts
readonly name: string;
```

Defined in: lur.e/src/utils/opfs/IdbFs.ts:223

## Methods

### createWritable()

```ts
createWritable(): Promise<{
  abort: () => Promise<void>;
  close: () => Promise<void>;
  seek: (position) => Promise<void>;
  truncate: (size) => Promise<void>;
  write: (data) => Promise<void>;
}>;
```

Defined in: lur.e/src/utils/opfs/IdbFs.ts:248

#### Returns

`Promise`\<\{
  `abort`: () => `Promise`\<`void`\>;
  `close`: () => `Promise`\<`void`\>;
  `seek`: (`position`) => `Promise`\<`void`\>;
  `truncate`: (`size`) => `Promise`\<`void`\>;
  `write`: (`data`) => `Promise`\<`void`\>;
\}\>

***

### getFile()

```ts
getFile(): Promise<File>;
```

Defined in: lur.e/src/utils/opfs/IdbFs.ts:235

#### Returns

`Promise`\<`File`\>
