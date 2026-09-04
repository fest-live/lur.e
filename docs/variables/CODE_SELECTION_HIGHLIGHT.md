[**@fest-lib/lure v0.1.60**](../README.md)

***

[@fest-lib/lure](../README.md) / CODE\_SELECTION\_HIGHLIGHT

# Variable: CODE\_SELECTION\_HIGHLIGHT

```ts
const CODE_SELECTION_HIGHLIGHT: "code-selection" = "code-selection";
```

Defined in: lur.e/src/lure/misc/CodeOverlay.ts:10

Visual code overlay locked to a text host (code / textarea / contenteditable).

FIND:code-overlay
TAG:code-highlight
WHY: highlight.js must not wrap the selectable source; the overlay is paint-only
(`pointer-events: none`). Selection stays on the host; CSS Custom Highlight
mirrors it onto the overlay when `CSS.highlights` exists.
