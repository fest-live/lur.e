[**@fest-lib/lure v0.1.58**](../README.md)

***

[@fest-lib/lure](../README.md) / StringToBinaryOptions

# Type Alias: StringToBinaryOptions

```ts
type StringToBinaryOptions = object;
```

Defined in: lur.e/src/utils/opfs/Base64Data.ts:43

## Properties

### asFile?

```ts
optional asFile?: boolean;
```

Defined in: lur.e/src/utils/opfs/Base64Data.ts:60

When true, return a File. Otherwise return a Blob.

***

### base64?

```ts
optional base64?: DecodeBase64Options;
```

Defined in: lur.e/src/utils/opfs/Base64Data.ts:69

Decode options for base64/base64url.

***

### filename?

```ts
optional filename?: string;
```

Defined in: lur.e/src/utils/opfs/Base64Data.ts:56

When creating a File, use this filename.

***

### isBase64?

```ts
optional isBase64?: boolean;
```

Defined in: lur.e/src/utils/opfs/Base64Data.ts:65

If true, treat input as base64 (or base64url) bytes (not UTF-8 text).
If omitted, auto-detect via data URL or base64 shape.

***

### maxBytes?

```ts
optional maxBytes?: number;
```

Defined in: lur.e/src/utils/opfs/Base64Data.ts:73

Max bytes allowed for decoded binary data.

***

### mimeType?

```ts
optional mimeType?: string;
```

Defined in: lur.e/src/utils/opfs/Base64Data.ts:52

If provided, overrides any mime type derived from a data URL.

***

### uriComponent?

```ts
optional uriComponent?: boolean;
```

Defined in: lur.e/src/utils/opfs/Base64Data.ts:48

Prefer/force decoding a URL-encoded payload via decodeURIComponent.
If omitted, we auto-detect by trying to decode only when it looks encoded.
