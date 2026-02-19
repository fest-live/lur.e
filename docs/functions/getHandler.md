[**@fest-lib/lure v0.0.0**](../README.md)

***

[@fest-lib/lure](../README.md) / getHandler

# Function: getHandler()

```ts
function getHandler(
   rootHandle, 
   relPath, 
   options, 
   logger): Promise<
  | {
  handle: any;
  type: string;
}
| null>;
```

Defined in: [modules/projects/lur.e/src/extension/misc/OPFS.ts:459](https://github.com/fest-live/lur.e/blob/845e11d38ceeba5a7b19fbeb61bfed0b0338af9f/src/extension/misc/OPFS.ts#L459)

## Parameters

### rootHandle

`any`

### relPath

`any`

### options

#### basePath?

`string`

### logger

(`status`, `message`) => `void`

## Returns

`Promise`\<
  \| \{
  `handle`: `any`;
  `type`: `string`;
\}
  \| `null`\>
