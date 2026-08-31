[**@fest-lib/lure v0.1.52**](../README.md)

***

[@fest-lib/lure](../README.md) / CustomElementLifecycle

# Interface: CustomElementLifecycle

Defined in: lur.e/src/lure/misc/Glit.ts:122

Интерфейс lifecycle callbacks для Custom Elements

## Extended by

- [`CustomElementBase`](CustomElementBase.md)
- [`GLitElementInstance`](GLitElementInstance.md)

## Methods

### adoptedCallback()?

```ts
optional adoptedCallback(): void | CustomElementLifecycle | undefined;
```

Defined in: lur.e/src/lure/misc/Glit.ts:125

#### Returns

`void` \| `CustomElementLifecycle` \| `undefined`

***

### attributeChangedCallback()?

```ts
optional attributeChangedCallback(
   name, 
   oldValue, 
   newValue): void | CustomElementLifecycle | undefined;
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

`void` \| `CustomElementLifecycle` \| `undefined`

***

### connectedCallback()?

```ts
optional connectedCallback(): void | CustomElementLifecycle | undefined;
```

Defined in: lur.e/src/lure/misc/Glit.ts:123

#### Returns

`void` \| `CustomElementLifecycle` \| `undefined`

***

### disconnectedCallback()?

```ts
optional disconnectedCallback(): void | CustomElementLifecycle | undefined;
```

Defined in: lur.e/src/lure/misc/Glit.ts:124

#### Returns

`void` \| `CustomElementLifecycle` \| `undefined`
