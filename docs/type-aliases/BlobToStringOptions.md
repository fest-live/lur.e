[**@fest-lib/lure v0.1.35**](../README.md)

***

[@fest-lib/lure](../README.md) / BlobToStringOptions

# Type Alias: BlobToStringOptions

```ts
type BlobToStringOptions = object;
```

Defined in: lur.e/src/utils/opfs/Base64Data.ts:19

## Properties

### base64?

```ts
optional base64?: boolean;
```

Defined in: lur.e/src/utils/opfs/Base64Data.ts:32

Output as base64 (default true for non-text). If false, output as text (optionally URI-encoded).

***

### base64Options?

```ts
optional base64Options?: EncodeBase64Options;
```

Defined in: lur.e/src/utils/opfs/Base64Data.ts:36

Base64 encoding options for base64/base64url.

***

### mimeType?

```ts
optional mimeType?: string;
```

Defined in: lur.e/src/utils/opfs/Base64Data.ts:28

If provided, overrides blob.type when producing a data URL.

***

### textEncoding?

```ts
optional textEncoding?: "utf-8";
```

Defined in: lur.e/src/utils/opfs/Base64Data.ts:40

For text serialization.

***

### uriComponent?

```ts
optional uriComponent?: boolean;
```

Defined in: lur.e/src/utils/opfs/Base64Data.ts:24

When true, encode raw text payload with encodeURIComponent().
Common for SVG: data:image/svg+xml,${encodeURIComponent(svg)}.
