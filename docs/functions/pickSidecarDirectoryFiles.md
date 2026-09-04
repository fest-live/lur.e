[**@fest-lib/lure v0.1.62**](../README.md)

***

[@fest-lib/lure](../README.md) / pickSidecarDirectoryFiles

# Function: pickSidecarDirectoryFiles()

```ts
function pickSidecarDirectoryFiles(): Promise<{
  directory: FileSystemDirectoryHandle | null;
  files: File[];
  root: string | null;
}>;
```

Defined in: lur.e/src/utils/opfs/markdown-assets.ts:381

Folder of images / includes. Chromium FSA first; otherwise `webkitdirectory`
(Capacitor WebView + CRX) so relative `![](./assets/…)` can resolve from sidecars.

## Returns

`Promise`\<\{
  `directory`: `FileSystemDirectoryHandle` \| `null`;
  `files`: `File`[];
  `root`: `string` \| `null`;
\}\>
