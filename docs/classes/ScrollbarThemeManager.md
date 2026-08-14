[**@fest-lib/lure v0.1.19**](../README.md)

***

[@fest-lib/lure](../README.md) / ScrollbarThemeManager

# Class: ScrollbarThemeManager

Defined in: lur.e/src/design/color/ScrollbarTheme.ts:126

## Constructors

### Constructor

```ts
new ScrollbarThemeManager(scrollbarElement, initialTheme?): ScrollbarThemeManager;
```

Defined in: lur.e/src/design/color/ScrollbarTheme.ts:131

#### Parameters

##### scrollbarElement

`HTMLElement`

##### initialTheme?

[`ScrollbarTheme`](../interfaces/ScrollbarTheme.md) = `scrollbarThemes.light`

#### Returns

`ScrollbarThemeManager`

## Methods

### destroy()

```ts
destroy(): void;
```

Defined in: lur.e/src/design/color/ScrollbarTheme.ts:214

#### Returns

`void`

***

### getCurrentTheme()

```ts
getCurrentTheme(): ScrollbarTheme;
```

Defined in: lur.e/src/design/color/ScrollbarTheme.ts:157

#### Returns

[`ScrollbarTheme`](../interfaces/ScrollbarTheme.md)

***

### setTheme()

```ts
setTheme(theme): void;
```

Defined in: lur.e/src/design/color/ScrollbarTheme.ts:137

#### Parameters

##### theme

  \| [`ScrollbarTheme`](../interfaces/ScrollbarTheme.md)
  \| `"light"`
  \| `"dark"`
  \| `"minimal"`
  \| `"rounded"`
  \| `"colorful"`

#### Returns

`void`

***

### updateTheme()

```ts
updateTheme(updates): void;
```

Defined in: lur.e/src/design/color/ScrollbarTheme.ts:152

#### Parameters

##### updates

`Partial`\<[`ScrollbarTheme`](../interfaces/ScrollbarTheme.md)\>

#### Returns

`void`

***

### colorful()

```ts
static colorful(): ScrollbarTheme;
```

Defined in: lur.e/src/design/color/ScrollbarTheme.ts:212

#### Returns

[`ScrollbarTheme`](../interfaces/ScrollbarTheme.md)

***

### dark()

```ts
static dark(): ScrollbarTheme;
```

Defined in: lur.e/src/design/color/ScrollbarTheme.ts:209

#### Returns

[`ScrollbarTheme`](../interfaces/ScrollbarTheme.md)

***

### light()

```ts
static light(): ScrollbarTheme;
```

Defined in: lur.e/src/design/color/ScrollbarTheme.ts:208

#### Returns

[`ScrollbarTheme`](../interfaces/ScrollbarTheme.md)

***

### minimal()

```ts
static minimal(): ScrollbarTheme;
```

Defined in: lur.e/src/design/color/ScrollbarTheme.ts:210

#### Returns

[`ScrollbarTheme`](../interfaces/ScrollbarTheme.md)

***

### rounded()

```ts
static rounded(): ScrollbarTheme;
```

Defined in: lur.e/src/design/color/ScrollbarTheme.ts:211

#### Returns

[`ScrollbarTheme`](../interfaces/ScrollbarTheme.md)
