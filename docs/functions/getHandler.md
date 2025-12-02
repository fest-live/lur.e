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
  | null
  | {
  handle: any;
  type: string;
}>;
```

Defined in: [modules/projects/lur.e/src/extension/misc/OPFS.ts:255](https://github.com/fest-live/lur.e/blob/8033cbe33e37b11f63de4da332415467e40bf204/src/extension/misc/OPFS.ts#L255)

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
  \| `null`
  \| \{
  `handle`: `any`;
  `type`: `string`;
\}\>
