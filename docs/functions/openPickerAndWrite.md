[**@fest-lib/lure v0.1.55**](../README.md)

***

[@fest-lib/lure](../README.md) / openPickerAndWrite

# Function: openPickerAndWrite()

```ts
function openPickerAndWrite(
   dir, 
   accept?, 
multiple?): Promise<number>;
```

Defined in: lur.e/src/utils/opfs/FileOps.ts:48

Open a native file picker and write the selected files into the target directory.

## Parameters

### dir

`string`

### accept?

`string` = `"*/*"`

### multiple?

`boolean` = `true`

## Returns

`Promise`\<`number`\>
