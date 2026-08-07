[**@fest-lib/lure v0.1.3**](../README.md)

***

[@fest-lib/lure](../README.md) / opfsModifyJson

# Function: opfsModifyJson()

```ts
function opfsModifyJson(options): Promise<{
  changed: number;
  errors: number;
  processed: number;
}>;
```

Defined in: lur.e/src/utils/opfs/OPFSMod.ts:38

Walk a directory tree inside OPFS, apply a transform to every JSON-like file,
and optionally perform a dry run without writing changes.

## Parameters

### options

`OpfsModifyOptions`

## Returns

`Promise`\<\{
  `changed`: `number`;
  `errors`: `number`;
  `processed`: `number`;
\}\>
