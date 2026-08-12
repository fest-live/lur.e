[**@fest-lib/lure v0.1.18**](../README.md)

***

[@fest-lib/lure](../README.md) / GLitElementInstance

# Interface: GLitElementInstance

Defined in: lur.e/src/lure/misc/Glit.ts:139

Интерфейс для расширенных свойств GLitElement

## Extends

- [`CustomElementLifecycle`](CustomElementLifecycle.md)

## Properties

### adoptedStyleSheets

```ts
adoptedStyleSheets: CSSStyleSheet[];
```

Defined in: lur.e/src/lure/misc/Glit.ts:143

***

### initialAttributes?

```ts
optional initialAttributes?: Record<string, any> | (() => Record<string, any>);
```

Defined in: lur.e/src/lure/misc/Glit.ts:141

***

### styleLibs

```ts
styleLibs: HTMLStyleElement[];
```

Defined in: lur.e/src/lure/misc/Glit.ts:142

***

### styles?

```ts
optional styles?: any;
```

Defined in: lur.e/src/lure/misc/Glit.ts:140

## Methods

### $init()?

```ts
optional $init(): void;
```

Defined in: lur.e/src/lure/misc/Glit.ts:150

#### Returns

`void`

***

### adoptedCallback()?

```ts
optional adoptedCallback(): void | GLitElementInstance | undefined;
```

Defined in: lur.e/src/lure/misc/Glit.ts:119

#### Returns

`void` \| `GLitElementInstance` \| `undefined`

#### Inherited from

[`CustomElementLifecycle`](CustomElementLifecycle.md).[`adoptedCallback`](CustomElementLifecycle.md#adoptedcallback)

***

### attributeChangedCallback()?

```ts
optional attributeChangedCallback(
   name, 
   oldValue, 
   newValue): void | GLitElementInstance | undefined;
```

Defined in: lur.e/src/lure/misc/Glit.ts:120

#### Parameters

##### name

`string`

##### oldValue

`string` \| `null`

##### newValue

`string` \| `null`

#### Returns

`void` \| `GLitElementInstance` \| `undefined`

#### Inherited from

[`CustomElementLifecycle`](CustomElementLifecycle.md).[`attributeChangedCallback`](CustomElementLifecycle.md#attributechangedcallback)

***

### connectedCallback()?

```ts
optional connectedCallback(): void | GLitElementInstance | undefined;
```

Defined in: lur.e/src/lure/misc/Glit.ts:117

#### Returns

`void` \| `GLitElementInstance` \| `undefined`

#### Inherited from

[`CustomElementLifecycle`](CustomElementLifecycle.md).[`connectedCallback`](CustomElementLifecycle.md#connectedcallback)

***

### createShadowRoot()

```ts
createShadowRoot(): ShadowRoot;
```

Defined in: lur.e/src/lure/misc/Glit.ts:149

#### Returns

`ShadowRoot`

***

### disconnectedCallback()?

```ts
optional disconnectedCallback(): void | GLitElementInstance | undefined;
```

Defined in: lur.e/src/lure/misc/Glit.ts:118

#### Returns

`void` \| `GLitElementInstance` \| `undefined`

#### Inherited from

[`CustomElementLifecycle`](CustomElementLifecycle.md).[`disconnectedCallback`](CustomElementLifecycle.md#disconnectedcallback)

***

### loadStyleLibrary()

```ts
loadStyleLibrary(module): void | GLitElementInstance | undefined;
```

Defined in: lur.e/src/lure/misc/Glit.ts:148

#### Parameters

##### module

`any`

#### Returns

`void` \| `GLitElementInstance` \| `undefined`

***

### onInitialize()

```ts
onInitialize(weak?): void | GLitElementInstance | undefined;
```

Defined in: lur.e/src/lure/misc/Glit.ts:146

#### Parameters

##### weak?

`WeakRef`\<`any`\>

#### Returns

`void` \| `GLitElementInstance` \| `undefined`

***

### onRender()

```ts
onRender(weak?): void | GLitElementInstance | undefined;
```

Defined in: lur.e/src/lure/misc/Glit.ts:147

#### Parameters

##### weak?

`WeakRef`\<`any`\>

#### Returns

`void` \| `GLitElementInstance` \| `undefined`

***

### render()

```ts
render(weak?): Node | HTMLElement | DocumentFragment;
```

Defined in: lur.e/src/lure/misc/Glit.ts:145

#### Parameters

##### weak?

`WeakRef`\<`any`\>

#### Returns

`Node` \| `HTMLElement` \| `DocumentFragment`

***

### styleLayers()

```ts
styleLayers(): string[];
```

Defined in: lur.e/src/lure/misc/Glit.ts:144

#### Returns

`string`[]
