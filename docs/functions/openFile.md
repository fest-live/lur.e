[**@fest-lib/lure v0.1.40**](../README.md)

***

[@fest-lib/lure](../README.md) / openFile

# Function: openFile()

```ts
function openFile(types?): Promise<
  | {
  content: string;
  filename: string;
}
| null>;
```

Defined in: lur.e/src/utils/opfs/file-utils.ts:238

Open file using File System Access API (with fallback)

## Parameters

### types?

`object`[] = `...`

## Returns

`Promise`\<
  \| \{
  `content`: `string`;
  `filename`: `string`;
\}
  \| `null`\>
