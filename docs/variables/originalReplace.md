[**@fest-lib/lure v0.1.26**](../README.md)

***

[@fest-lib/lure](../README.md) / originalReplace

# Variable: originalReplace

```ts
const originalReplace: ((data, unused, url?) => void) | undefined;
```

Defined in: lur.e/src/interactive/tasking/History.ts:87

## Union Members

### Function

```ts
(data, unused, url?) => void
```

The **`replaceState()`** method of the History interface modifies the current history entry, replacing it with the state object and URL passed in the method parameters. This method is particularly useful when you want to update the state object or URL of the current history entry in response to some user action.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/History/replaceState)

#### Parameters

##### data

`any`

##### unused

`string`

##### url?

`string` \| `URL` \| `null`

#### Returns

`void`

***

`undefined`
