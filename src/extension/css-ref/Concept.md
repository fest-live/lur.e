# New Concept of Season 2

## CSS Ref

You not able to listen or affected to CSS properties directly.

It works internally. You NOT able to use `affected` to listen to CSS properties.

### Primitives CSS Refs

- Native Typed OM Values or Units
  - When trying to read, getting `value` of CSS property or unit object.
  - Typically, reactivity works when bound with element style attribute map.
- `ScrollTimeline`, `ViewTimeline` (wrappers)
  - Always has element source.
  - Has own unique anchor ID (JS Animation API can avoid this requirement).
  - When trying to read, getting `scrollLeft` and `scrollTop` (based) values.
  - Set value doing `scrollTo`...
  - TODO: needs to implement relative set values (like `scrollBy`).
  - (Thinking about) `"scroll"` event able to affected to, but isn't known about view.
  - (Thinking about) `IntersectionObserver` able to affected to, but isn't known about view.
- `CSS Anchor` binding (wrappers)
  - Have own unique anchor ID.
  - Practically always has anchor element source.
  - When trying to read, getting `left`, `top`, `width`, `height` (property) values.
  - Can be only binding only with elements.
  - Set value isn't implemented yet.
