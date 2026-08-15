[**@fest-lib/lure v0.1.30**](../README.md)

***

[@fest-lib/lure](../README.md) / FileHandlingOptions

# Interface: FileHandlingOptions

Defined in: lur.e/src/utils/opfs/FileHandling.ts:1

## Properties

### onError?

```ts
optional onError?: (error) => void;
```

Defined in: lur.e/src/utils/opfs/FileHandling.ts:3

#### Parameters

##### error

`string`

#### Returns

`void`

***

### onFilesAdded

```ts
onFilesAdded: (files) => void | Promise<void>;
```

Defined in: lur.e/src/utils/opfs/FileHandling.ts:2

#### Parameters

##### files

`File`[]

#### Returns

`void` \| `Promise`\<`void`\>

***

### onProgress?

```ts
optional onProgress?: (file, loaded, total) => void;
```

Defined in: lur.e/src/utils/opfs/FileHandling.ts:4

#### Parameters

##### file

`File`

##### loaded

`number`

##### total

`number`

#### Returns

`void`
