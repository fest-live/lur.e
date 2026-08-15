[**@fest-lib/lure v0.1.36**](../README.md)

***

[@fest-lib/lure](../README.md) / FileHandler

# Class: FileHandler

Defined in: lur.e/src/utils/opfs/FileHandling.ts:7

## Constructors

### Constructor

```ts
new FileHandler(options): FileHandler;
```

Defined in: lur.e/src/utils/opfs/FileHandling.ts:11

#### Parameters

##### options

[`FileHandlingOptions`](../interfaces/FileHandlingOptions.md)

#### Returns

`FileHandler`

## Methods

### addFiles()

```ts
addFiles(files): void | Promise<void>;
```

Defined in: lur.e/src/utils/opfs/FileHandling.ts:19

Programmatically add files into the same pipeline as UI selection / DnD / paste.
Used by PWA share-target and launchQueue ingestion.

#### Parameters

##### files

`File`[]

#### Returns

`void` \| `Promise`\<`void`\>

***

### createDownloadableFile()

```ts
createDownloadableFile(
   content, 
   filename, 
   mimeType?): void;
```

Defined in: lur.e/src/utils/opfs/FileHandling.ts:376

Create a downloadable file from content

#### Parameters

##### content

`string` \| `Blob` \| `ArrayBuffer`

##### filename

`string`

##### mimeType?

`string`

#### Returns

`void`

***

### createFileURL()

```ts
createFileURL(file): string;
```

Defined in: lur.e/src/utils/opfs/FileHandling.ts:404

Create a shareable file URL

#### Parameters

##### file

`File`

#### Returns

`string`

***

### destroy()

```ts
destroy(): void;
```

Defined in: lur.e/src/utils/opfs/FileHandling.ts:418

Clean up event listeners and references

#### Returns

`void`

***

### formatFileSize()

```ts
formatFileSize(bytes): string;
```

Defined in: lur.e/src/utils/opfs/FileHandling.ts:258

Format file size for display

#### Parameters

##### bytes

`number`

#### Returns

`string`

***

### getFileIcon()

```ts
getFileIcon(mimeType): string;
```

Defined in: lur.e/src/utils/opfs/FileHandling.ts:241

Get file icon based on MIME type

#### Parameters

##### mimeType

`string`

#### Returns

`string`

***

### getFileMetadata()

```ts
getFileMetadata(file): object;
```

Defined in: lur.e/src/utils/opfs/FileHandling.ts:314

Get file metadata

#### Parameters

##### file

`File`

#### Returns

`object`

##### extension

```ts
extension: string;
```

##### formattedSize

```ts
formattedSize: string;
```

##### icon

```ts
icon: string;
```

##### isBinary

```ts
isBinary: boolean;
```

##### isImage

```ts
isImage: boolean;
```

##### isText

```ts
isText: boolean;
```

##### lastModified

```ts
lastModified: number;
```

##### name

```ts
name: string;
```

##### size

```ts
size: number;
```

##### type

```ts
type: string;
```

***

### getFilesMetadata()

```ts
getFilesMetadata(files): object[];
```

Defined in: lur.e/src/utils/opfs/FileHandling.ts:348

Get files metadata for multiple files

#### Parameters

##### files

`File`[]

#### Returns

`object`[]

***

### isBinaryFile()

```ts
isBinaryFile(file): boolean;
```

Defined in: lur.e/src/utils/opfs/FileHandling.ts:307

Check if a file is a binary file

#### Parameters

##### file

`File`

#### Returns

`boolean`

***

### isImageFile()

```ts
isImageFile(file): boolean;
```

Defined in: lur.e/src/utils/opfs/FileHandling.ts:286

Check if a file is an image

#### Parameters

##### file

`File`

#### Returns

`boolean`

***

### isMarkdownFile()

```ts
isMarkdownFile(file): boolean;
```

Defined in: lur.e/src/utils/opfs/FileHandling.ts:268

Check if a file is likely a markdown file

#### Parameters

##### file

`File`

#### Returns

`boolean`

***

### isTextFile()

```ts
isTextFile(file): boolean;
```

Defined in: lur.e/src/utils/opfs/FileHandling.ts:293

Check if a file is a text file

#### Parameters

##### file

`File`

#### Returns

`boolean`

***

### processFiles()

```ts
processFiles(files): void;
```

Defined in: lur.e/src/utils/opfs/FileHandling.ts:369

Manually trigger file processing with the provided files

#### Parameters

##### files

`File`[]

#### Returns

`void`

***

### readFileAsArrayBuffer()

```ts
readFileAsArrayBuffer(file): Promise<ArrayBuffer>;
```

Defined in: lur.e/src/utils/opfs/FileHandling.ts:193

Read file content as ArrayBuffer

#### Parameters

##### file

`File`

#### Returns

`Promise`\<`ArrayBuffer`\>

***

### readFileAsDataURL()

```ts
readFileAsDataURL(file): Promise<string>;
```

Defined in: lur.e/src/utils/opfs/FileHandling.ts:205

Read file content as Data URL

#### Parameters

##### file

`File`

#### Returns

`Promise`\<`string`\>

***

### readFileAsText()

```ts
readFileAsText(file, onProgress?): Promise<string>;
```

Defined in: lur.e/src/utils/opfs/FileHandling.ts:174

Read file content as text

#### Parameters

##### file

`File`

##### onProgress?

(`loaded`, `total`) => `void`

#### Returns

`Promise`\<`string`\>

***

### readFilesAsText()

```ts
readFilesAsText(files, onProgress?): Promise<object[]>;
```

Defined in: lur.e/src/utils/opfs/FileHandling.ts:217

Read multiple files as text

#### Parameters

##### files

`File`[]

##### onProgress?

(`file`, `loaded`, `total`) => `void`

#### Returns

`Promise`\<`object`[]\>

***

### revokeFileURL()

```ts
revokeFileURL(url): void;
```

Defined in: lur.e/src/utils/opfs/FileHandling.ts:411

Revoke a file URL to free memory

#### Parameters

##### url

`string`

#### Returns

`void`

***

### setupCompleteFileHandling()

```ts
setupCompleteFileHandling(
   container, 
   fileSelectButton, 
   dropZone?, 
   accept?): void;
```

Defined in: lur.e/src/utils/opfs/FileHandling.ts:91

Set up all file handling for a container (file input button, drag & drop, paste)

#### Parameters

##### container

`HTMLElement`

##### fileSelectButton

`HTMLElement`

##### dropZone?

`HTMLElement`

##### accept?

`string` = `"*"`

#### Returns

`void`

***

### setupDragAndDrop()

```ts
setupDragAndDrop(element): void;
```

Defined in: lur.e/src/utils/opfs/FileHandling.ts:50

Set up drag and drop handling for an element

#### Parameters

##### element

`HTMLElement`

#### Returns

`void`

***

### setupFileInput()

```ts
setupFileInput(container, accept?): HTMLInputElement;
```

Defined in: lur.e/src/utils/opfs/FileHandling.ts:27

Set up file input element with file selection

#### Parameters

##### container

`HTMLElement`

##### accept?

`string` = `"*"`

#### Returns

`HTMLInputElement`

***

### setupPasteHandling()

```ts
setupPasteHandling(element): void;
```

Defined in: lur.e/src/utils/opfs/FileHandling.ts:78

Set up paste handling for an element

#### Parameters

##### element

`HTMLElement`

#### Returns

`void`

***

### validateFiles()

```ts
validateFiles(files, options?): object;
```

Defined in: lur.e/src/utils/opfs/FileHandling.ts:117

Validate file types and sizes

#### Parameters

##### files

`File`[]

##### options?

###### allowedTypes?

`string`[]

###### maxFiles?

`number`

###### maxSize?

`number`

#### Returns

`object`

##### invalid

```ts
invalid: object[];
```

##### valid

```ts
valid: File[];
```
