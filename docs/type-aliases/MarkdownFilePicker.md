[**@fest-lib/lure v0.1.74**](../README.md)

***

[@fest-lib/lure](../README.md) / MarkdownFilePicker

# Type Alias: MarkdownFilePicker

```ts
type MarkdownFilePicker = () => Promise<PickedMarkdownFile | null | undefined>;
```

Defined in: lur.e/src/utils/opfs/markdown-assets.ts:350

Capacitor registers ACTION_OPEN_DOCUMENT so Open keeps a writable `/sdcard/` or `content://`.

## Returns

`Promise`\<[`PickedMarkdownFile`](PickedMarkdownFile.md) \| `null` \| `undefined`\>
