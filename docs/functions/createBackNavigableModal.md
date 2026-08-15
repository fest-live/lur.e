[**@fest-lib/lure v0.1.39**](../README.md)

***

[@fest-lib/lure](../README.md) / createBackNavigableModal

# Function: createBackNavigableModal()

```ts
function createBackNavigableModal(content, options?): object;
```

Defined in: lur.e/src/interactive/tasking/BackNavigation.ts:387

Create a modal backdrop with back navigation support
Wraps an existing modal creation pattern

## Parameters

### content

`HTMLElement` \| `DocumentFragment`

### options?

#### backdropClass?

`string`

#### closeOnBackdropClick?

`boolean`

#### closeOnEscape?

`boolean`

#### onClose?

() => `void`

## Returns

`object`

### close

```ts
close: () => void;
```

#### Returns

`void`

### element

```ts
element: HTMLElement;
```

### unregister

```ts
unregister: () => void;
```

#### Returns

`void`
