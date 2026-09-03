[**@fest-lib/lure v0.1.57**](../README.md)

***

[@fest-lib/lure](../README.md) / rehydrateAdoptedStyleSheets

# Function: rehydrateAdoptedStyleSheets()

```ts
function rehydrateAdoptedStyleSheets(root?): void;
```

Defined in: style.ts/src/component.ts:70

WHY: Capacitor WebView drops `shadowRoot.adoptedStyleSheets` or empties cssRules; cache + source text restore them.

## Parameters

### root?

`Document` \| `ParentNode` \| `null`

## Returns

`void`
