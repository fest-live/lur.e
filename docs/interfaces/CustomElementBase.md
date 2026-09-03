[**@fest-lib/lure v0.1.57**](../README.md)

***

[@fest-lib/lure](../README.md) / CustomElementBase

# Interface: CustomElementBase

Defined in: lur.e/src/lure/misc/Glit.ts:140

Базовый интерфейс для Custom Element с lifecycle

## Extends

- `HTMLElement`.[`CustomElementLifecycle`](CustomElementLifecycle.md)

## Methods

### adoptedCallback()?

```ts
optional adoptedCallback(): void | CustomElementBase | undefined;
```

Defined in: lur.e/src/lure/misc/Glit.ts:125

#### Returns

`void` \| `CustomElementBase` \| `undefined`

#### Inherited from

[`CustomElementLifecycle`](CustomElementLifecycle.md).[`adoptedCallback`](CustomElementLifecycle.md#adoptedcallback)

***

### attributeChangedCallback()?

```ts
optional attributeChangedCallback(
   name, 
   oldValue, 
   newValue): void | CustomElementBase | undefined;
```

Defined in: lur.e/src/lure/misc/Glit.ts:126

#### Parameters

##### name

`string`

##### oldValue

`string` \| `null`

##### newValue

`string` \| `null`

#### Returns

`void` \| `CustomElementBase` \| `undefined`

#### Inherited from

[`CustomElementLifecycle`](CustomElementLifecycle.md).[`attributeChangedCallback`](CustomElementLifecycle.md#attributechangedcallback)

***

### connectedCallback()?

```ts
optional connectedCallback(): void | CustomElementBase | undefined;
```

Defined in: lur.e/src/lure/misc/Glit.ts:123

#### Returns

`void` \| `CustomElementBase` \| `undefined`

#### Inherited from

[`CustomElementLifecycle`](CustomElementLifecycle.md).[`connectedCallback`](CustomElementLifecycle.md#connectedcallback)

***

### disconnectedCallback()?

```ts
optional disconnectedCallback(): void | CustomElementBase | undefined;
```

Defined in: lur.e/src/lure/misc/Glit.ts:124

#### Returns

`void` \| `CustomElementBase` \| `undefined`

#### Inherited from

[`CustomElementLifecycle`](CustomElementLifecycle.md).[`disconnectedCallback`](CustomElementLifecycle.md#disconnectedcallback)
