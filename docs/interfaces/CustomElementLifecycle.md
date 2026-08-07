[**@fest-lib/lure v0.1.3**](../README.md)

***

[@fest-lib/lure](../README.md) / CustomElementLifecycle

# Interface: CustomElementLifecycle

Defined in: lur.e/src/lure/misc/Glit.ts:97

Интерфейс lifecycle callbacks для Custom Elements

## Extended by

- [`CustomElementBase`](CustomElementBase.md)
- [`GLitElementInstance`](GLitElementInstance.md)

## Methods

### adoptedCallback()?

```ts
optional adoptedCallback(): void | CustomElementLifecycle | undefined;
```

Defined in: lur.e/src/lure/misc/Glit.ts:100

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

Defined in: lur.e/src/lure/misc/Glit.ts:101

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

Defined in: lur.e/src/lure/misc/Glit.ts:98

#### Returns

`void` \| `CustomElementLifecycle` \| `undefined`

***

### disconnectedCallback()?

```ts
optional disconnectedCallback(): void | CustomElementLifecycle | undefined;
```

Defined in: lur.e/src/lure/misc/Glit.ts:99

#### Returns

`void` \| `CustomElementLifecycle` \| `undefined`
