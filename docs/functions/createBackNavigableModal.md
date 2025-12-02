[**@fest-lib/lure v0.0.0**](../README.md)

***

[@fest-lib/lure](../README.md) / createBackNavigableModal

# Function: createBackNavigableModal()

```ts
function createBackNavigableModal(content, options): object;
```

Defined in: [modules/projects/lur.e/src/extension/tasking/BackNavigation.ts:388](https://github.com/fest-live/lur.e/blob/211e5159c17466d5ef8d3d0f9ccb52b3f19f48d6/src/extension/tasking/BackNavigation.ts#L388)

Create a modal backdrop with back navigation support
Wraps an existing modal creation pattern

## Parameters

### content

`HTMLElement` | `DocumentFragment`

### options

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

### close()

```ts
close: () => void;
```

#### Returns

`void`

### element

```ts
element: HTMLElement;
```

### unregister()

```ts
unregister: () => void;
```

#### Returns

`void`
