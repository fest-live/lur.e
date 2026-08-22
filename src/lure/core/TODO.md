# Planned for V2

Change model to:

- Link (which based ref)
  - Source  (element, media, etc.)
  - Trigger (which triggers changes)
  - Store   (where and how is storing)
  - Getter  (collection from events, properties, attributes, etc.)
  - Setter  (changing properties of handler)

And...

- `Ref` builds froms `link` (`trigger`, `store` and `getter`, `setter`).

Also, `trigger` system also planned to be changed in future...

## Deferred interaction roadmap

- Keyboard, focus/blur, click-outside consolidation, and menu trigger composition.
- Swipe, selection, pinch/zoom, and resolving junction ownership with `fest/dom`.
- Point-based positioning: visual viewport, device-fixed, cursor, selection, draggable, and scroll-driven points.
- UI primitives: menus, modal/notification/toast/prompt layers, tooltip, file/date pickers, and input rework.
- Canvas, image-loader, and color utilities, followed by focused API documentation and demos.
