# Planned for V2 (or even V3)

- Different `source`, `trigger`, `setter`, `getter`, `store` system (model) for `link` and `ref`s...
- Reactive per component Math (2D, 3D, etc.).
- Compliance with newer `object.ts` library and `trigger` model.
- New reactive CSS library and framework (such 
  - new `inline` CSS per element, with extended syntax, 
  - reactive and JS controlled `css` properties and variables,
  - properties and variables scopes/scoping/sharing).
- Seamless CSS controllers (without needs explicit JS reactives).
  - Just can be binded with element (or with properties, implicitly).
  - Registered by/in special registry. Transported by JS descriptor object.
  - Some CSS properties can/may be bound directly by these controllers (such as anchor position).
- More and new DOM mixins (new but unused early mechanics, feature)...
