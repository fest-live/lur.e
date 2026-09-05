[**@fest-lib/lure v0.1.64**](../README.md)

***

[@fest-lib/lure](../README.md) / saveMarkdownDocument

# Function: saveMarkdownDocument()

```ts
function saveMarkdownDocument(
   content, 
   filename, 
existingHandle?): Promise<MarkdownSaveOutcome>;
```

Defined in: lur.e/src/utils/opfs/markdown-assets.ts:468

Remembered FSA handle → `showSaveFilePicker` → CRX `chrome.downloads`
→ Web Share (Capacitor) → `<a download>`.
WHY: Save must not re-prompt when the last picker handle is still writable.

## Parameters

### content

`string`

### filename

`string`

### existingHandle?

`FileSystemFileHandle` \| `null`

## Returns

`Promise`\<[`MarkdownSaveOutcome`](../type-aliases/MarkdownSaveOutcome.md)\>
