[**@fest-lib/lure v0.1.49**](../README.md)

***

[@fest-lib/lure](../README.md) / DESKTOP\_MAIN\_KEY

# Variable: DESKTOP\_MAIN\_KEY

```ts
const DESKTOP_MAIN_KEY: "cw-oriented-desktop-layout-v1" = "cw-oriented-desktop-layout-v1";
```

Defined in: lur.e/src/interactive/modules/DesktopStateStorage.ts:7

Versioned JSON persistence for the orient-layer speed dial / desktop grid.
- Main key: canonical layout + items
- Draft key: debounced snapshot while dragging (crash recovery if main never flushed)
