[**@fest-lib/lure v0.1.59**](../README.md)

***

[@fest-lib/lure](../README.md) / indexDirectoryFiles

# Function: indexDirectoryFiles()

```ts
function indexDirectoryFiles(
   dir, 
   prefix?, 
   depth?, 
acc?): Promise<IndexedDirFile[]>;
```

Defined in: lur.e/src/utils/opfs/markdown-assets.ts:90

Walk a picked folder so the viewer can resolve `./assets/…` by relative path or basename.

## Parameters

### dir

`FileSystemDirectoryHandle`

### prefix?

`string` = `""`

### depth?

`number` = `8`

### acc?

[`IndexedDirFile`](../type-aliases/IndexedDirFile.md)[] = `[]`

## Returns

`Promise`\<[`IndexedDirFile`](../type-aliases/IndexedDirFile.md)[]\>
