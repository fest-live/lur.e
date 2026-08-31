[**@fest-lib/lure v0.1.53**](../README.md)

***

[@fest-lib/lure](../README.md) / updateThemeBase

# Function: updateThemeBase()

```ts
function updateThemeBase(originColor?): Promise<any[] | undefined>;
```

Defined in: lur.e/src/design/color/StyleRules.ts:33

Set brand seed on `:root`. Prefer applyThemeFromWallpaper from `fest/image`
when the source is a wallpaper; this helper remains for manual / persisted overrides.

## Parameters

### originColor?

`string` \| `null`

## Returns

`Promise`\<`any`[] \| `undefined`\>
