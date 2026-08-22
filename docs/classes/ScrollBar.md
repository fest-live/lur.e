[**@fest-lib/lure v0.1.44**](../README.md)

***

[@fest-lib/lure](../README.md) / ScrollBar

# Class: ScrollBar

Defined in: lur.e/src/interactive/modules/ScrollBar.ts:168

## Constructors

### Constructor

```ts
new ScrollBar(__namedParameters, axis?): ScrollBar;
```

Defined in: lur.e/src/interactive/modules/ScrollBar.ts:211

#### Parameters

##### \_\_namedParameters

[`ScrollBarInit`](../interfaces/ScrollBarInit.md)

##### axis?

`number` = `0`

#### Returns

`ScrollBar`

## Properties

### containerSize

```ts
containerSize: Vector2D;
```

Defined in: lur.e/src/interactive/modules/ScrollBar.ts:193

***

### content

```ts
content: HTMLDivElement;
```

Defined in: lur.e/src/interactive/modules/ScrollBar.ts:170

***

### enhancedTimeline?

```ts
optional enhancedTimeline?: EnhancedScrollTimeline;
```

Defined in: lur.e/src/interactive/modules/ScrollBar.ts:184

***

### gestureHandler?

```ts
optional gestureHandler?: ScrollbarGestureHandler;
```

Defined in: lur.e/src/interactive/modules/ScrollBar.ts:205

***

### holder

```ts
holder: HTMLElement;
```

Defined in: lur.e/src/interactive/modules/ScrollBar.ts:172

***

### inputChange

```ts
inputChange: any;
```

Defined in: lur.e/src/interactive/modules/ScrollBar.ts:173

***

### isDragging

```ts
isDragging: any;
```

Defined in: lur.e/src/interactive/modules/ScrollBar.ts:188

***

### isVisible

```ts
isVisible: any;
```

Defined in: lur.e/src/interactive/modules/ScrollBar.ts:187

***

### layout

```ts
layout: ScrollBarLayout;
```

Defined in: lur.e/src/interactive/modules/ScrollBar.ts:174

***

### pointerAnchor?

```ts
optional pointerAnchor?: any[];
```

Defined in: lur.e/src/interactive/modules/ScrollBar.ts:181

***

### responsiveConfig?

```ts
optional responsiveConfig?: any;
```

Defined in: lur.e/src/interactive/modules/ScrollBar.ts:200

***

### scrollbar

```ts
scrollbar: HTMLDivElement;
```

Defined in: lur.e/src/interactive/modules/ScrollBar.ts:169

***

### scrollbarOpacity

```ts
scrollbarOpacity: any;
```

Defined in: lur.e/src/interactive/modules/ScrollBar.ts:197

***

### spatialAnchor?

```ts
optional spatialAnchor?: any[];
```

Defined in: lur.e/src/interactive/modules/ScrollBar.ts:180

***

### status

```ts
status: ScrollBarStatus;
```

Defined in: lur.e/src/interactive/modules/ScrollBar.ts:171

***

### themeManager?

```ts
optional themeManager?: ScrollbarThemeManager;
```

Defined in: lur.e/src/interactive/modules/ScrollBar.ts:208

***

### thumbPosition

```ts
thumbPosition: Vector2D;
```

Defined in: lur.e/src/interactive/modules/ScrollBar.ts:191

***

### thumbSize

```ts
thumbSize: Vector2D;
```

Defined in: lur.e/src/interactive/modules/ScrollBar.ts:192

***

### thumbTransform

```ts
thumbTransform: ReactiveTransform;
```

Defined in: lur.e/src/interactive/modules/ScrollBar.ts:196

## Methods

### destroy()

```ts
destroy(): void;
```

Defined in: lur.e/src/interactive/modules/ScrollBar.ts:693

#### Returns

`void`

***

### getScrollInfo()

```ts
getScrollInfo(): 
  | {
  clientSize: any;
  maxScroll: number;
  progress: number;
  scrollPos: any;
  scrollSize: any;
}
  | undefined;
```

Defined in: lur.e/src/interactive/modules/ScrollBar.ts:689

#### Returns

  \| \{
  `clientSize`: `any`;
  `maxScroll`: `number`;
  `progress`: `number`;
  `scrollPos`: `any`;
  `scrollSize`: `any`;
\}
  \| `undefined`

***

### getTheme()

```ts
getTheme(): ScrollbarTheme | undefined;
```

Defined in: lur.e/src/interactive/modules/ScrollBar.ts:676

#### Returns

[`ScrollbarTheme`](../interfaces/ScrollbarTheme.md) \| `undefined`

***

### scrollBy()

```ts
scrollBy(delta, smooth?): void;
```

Defined in: lur.e/src/interactive/modules/ScrollBar.ts:685

#### Parameters

##### delta

`number`

##### smooth?

`boolean` = `true`

#### Returns

`void`

***

### scrollTo()

```ts
scrollTo(progress, smooth?): void;
```

Defined in: lur.e/src/interactive/modules/ScrollBar.ts:681

#### Parameters

##### progress

`number`

##### smooth?

`boolean` = `true`

#### Returns

`void`

***

### setTheme()

```ts
setTheme(theme): ScrollBar;
```

Defined in: lur.e/src/interactive/modules/ScrollBar.ts:666

#### Parameters

##### theme

  \| [`ScrollbarTheme`](../interfaces/ScrollbarTheme.md)
  \| `"light"`
  \| `"dark"`
  \| `"minimal"`
  \| `"rounded"`
  \| `"colorful"`

#### Returns

`ScrollBar`

***

### updateTheme()

```ts
updateTheme(updates): ScrollBar;
```

Defined in: lur.e/src/interactive/modules/ScrollBar.ts:671

#### Parameters

##### updates

`Partial`\<[`ScrollbarTheme`](../interfaces/ScrollbarTheme.md)\>

#### Returns

`ScrollBar`
