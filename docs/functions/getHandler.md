[**@fest-lib/lure v0.1.61**](../README.md)

***

[@fest-lib/lure](../README.md) / getHandler

# Function: getHandler()

```ts
function getHandler(
   rootHandle, 
   relPath, 
   options?, 
   logger?): Promise<
  | {
  handle: any;
  type: string;
}
| null>;
```

Defined in: lur.e/src/utils/opfs/OPFS.ts:704

## Parameters

### rootHandle

`any`

### relPath

`any`

### options?

#### basePath?

`string`

### logger?

(`status`, `message`) => `void`

## Returns

`Promise`\<
  \| \{
  `handle`: `any`;
  `type`: `string`;
\}
  \| `null`\>
