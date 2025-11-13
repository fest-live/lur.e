<h1 align="center">🌀 LUR-E 🌀</h1>
<p align="center"><img src="./assets/logo/logo-0.png" width="128" alt="LUR-E Logo"/></p>

---

<p align="center">
  <a href="https://github.com/fest-live/lur.e/blob/main/LICENSE"><img src="https://img.shields.io/github/license/fest-live/lur.e?style=flat-square" alt="License"/></a>
  <a href="https://github.com/fest-live/lur.e/stargazers"><img src="https://img.shields.io/github/stars/fest-live/lur.e?style=flat-square" alt="GitHub stars"/></a>
  <a href="https://github.com/fest-live/lur.e/commits/main"><img src="https://img.shields.io/github/last-commit/fest-live/lur.e?style=flat-square" alt="Last Commit"/></a>
  <a href="https://github.com/fest-live/lur.e/issues"><img src="https://img.shields.io/github/issues/fest-live/lur.e?style=flat-square" alt="Issues"/></a>
</p>

## *Overview*

**LUR-E** is an experimental UI library focused on efficient memory management, advanced reactivity, and compatibility with modern web standards. It provides a low-level API for DOM manipulation, enhanced CSS integration, and supports web components out of the box.

---

## ✨ Features

- **Efficient Memory Management**
- **Advanced Cache & Reaction System**
- **Low-Level DOM Manipulation**
- **Full CSS Compatibility**
- **Web Components Support**
- **Experimental Typed OM**
- **Attribute Mutation Observer**
- **Reactive Input Handling**

---

## 🔌 API Overview

The core API provides a concise and powerful way to work with the DOM:

- `E(Element|Selector, { attributes, dataset, style, ... }, children[] | mapped)`
  - Create a DOM element with specified properties and children.
- `M(Array|Set, generateCb)`
  - Map arrays or sets to DOM elements.
- `H(DOMCode)`
  - Create static DOM HTML from code.
- `T(String|StringRef)`
  - Create a TextNode object.

---

## API Specification

This is a consolidated, human-friendly overview of the public API exported from `src/index.ts`. For the full, generated reference, see the markdown files under `./docs/`.

### Imports

```ts
import {
  // Core
  bindBeh, bindCtrl, bindHandler, bindWith, bindForms,
  $observeInput, $observeAttribute,
  // Refs
  makeRef, attrRef, valueRef, valueAsNumberRef, localStorageRef,
  sizeRef, checkedRef, scrollRef, visibleRef, matchMediaRef, hashTargetRef, orientRef, makeWeakRef,
  // Node
  E, M, Q, createElement, H,
  // Extensions (selected)
  bindDraggable, grabForDrag, agWrapEvent,
} from "fest/lure";
```

### Quick Start

```ts
// Create an element
const el = E("div", {
  attributes: { id: "app" },
  classList: new Set(["box"]),
  style: { padding: "8px" },
}, [
  "Hello",
]);

document.body.append(el as Node);
```

### Core

- `bindBeh(element, store, behavior)`: Invoke `behavior` on store changes.
- `bindCtrl(element, ctrlCb)`: Wire common input/change/click listeners.
- `bindHandler(element, value, prop, handler, set?, withObserver?)`: Generic bridge for refs → DOM.
- `bindWith(el, prop, value, handler, set?, withObserver?)`: Apply once and subscribe.
- `bindForms(fields?, wrapper?, state?)`: Two-way bind inputs within a container to a reactive `state`.
- `$observeInput(element, ref?, prop = "value")`: Sync input property to ref.
- `$observeAttribute(el, ref?, prop)`: Sync attribute to ref.

### Refs

Create reactive references, often linked to DOM state:

- `makeRef(host?, type?, link?, ...args)`
- `attrRef(host, name)`, `valueRef(host, name)`, `valueAsNumberRef(host, name)`
- `localStorageRef(key)`, `sizeRef(host, prop?)`, `checkedRef(host)`, `scrollRef(host, prop?)`, `visibleRef(host)`
- `matchMediaRef(query)`, `hashTargetRef()`, `orientRef(host)`
- `makeWeakRef(initial?, behavior?)`

### Node API

#### `E`: Element factory with bindings

```ts
const out = E("button", {
  attributes: { title: "Click me" },
  properties: { disabled: false },
  on: { click: (e) => console.log("clicked", e) },
}, ["OK"]);
```

#### JSX factory

```tsx
// Use with JSX if configured (jsxFactory: createElement)
const v = createElement("div", { className: "c" }, ["hello"]);
```

#### `Q`: Query wrapper

```ts
const box = Q("#app");
box.attr.id = "app2"; // example of reactive wrapper operations
```

#### `M`: Reactive mapping

`M(observable, mapper)` maps a reactive array/set into DOM. Returns a reactive fragment-like node.

```ts
import { makeReactive } from "fest/object";

const rxItems = makeReactive(["A", "B", "C"]);
const list = H`<ul>${M(rxItems, (x) => H`<li>${x}</li>`)}</ul>`;

// later
rxItems.push("D"); // DOM updates
```

### `H` and HTML Templates

`H` supports both raw HTML strings and tagged template strings.

- Raw string starting/ending with `<`/`>` → parsed into `Node`/`DocumentFragment`.
- Plain string → `Text` node.
- Function → invoked and processed recursively.
- Tagged template → interpolates values into content/attributes/events/props.

Attribute/prop/event/ref prefixes inside tagged templates:
- `attr:*` → HTML attribute
- `prop:*` → DOM property
- `on:*` or `@*` → event listener
- `ref` or `ref:*` → assigns element to ref(s)

Examples:

```ts
// Raw string → Node
const el = H("<div class=box>hello</div>");

// Tagged template → content interpolation
const name = "World";
const title = H`<h1 class="title">Hello, ${name}!</h1>`;

// Dynamic tag: supports tag#id.class1.class2
const tag = "button.primary";
const btn = H`<${tag}>Click</${tag}>`;

// Attributes/props/events/refs
const ref = { value: null as HTMLElement | null };
const click = (e: Event) => console.log("clicked", e);
const button = H`<button attr:title=${"Click"} prop:disabled=${false} on:click=${click} ref=${ref}>OK</button>`;
```

Static vs Reactive lists in `H` content:

```ts
// Static (non-reactive) mapping in template content
const items = ["A", "B", "C"];
const listStatic = H`<ul>${items.map(x => H`<li>${x}</li>`)}</ul>`;

// Reactive list: use M(...)
import { makeReactive } from "fest/object";
const rxItems = makeReactive(["A", "B", "C"]);
const listReactive = H`<ul>${M(rxItems, (x) => H`<li>${x}</li>`)}</ul>`;
```

Multiple top-level nodes produce a `DocumentFragment`:

```ts
const frag = H`<div>one</div><div>two</div>`; // DocumentFragment
```

### Extensions (selection)

Pointer helpers and drag handling:

```ts
import { bindDraggable, grabForDrag } from "fest/lure";

const target = H`<div class="draggable" />` as HTMLElement;
bindDraggable(target, () => console.log("drag end"));
```

### Documentation

- Full markdown API reference is generated into `./docs/` by:

```bash
npm run docs:md
```

- HTML documentation can be generated by:

```bash
npm run docs
```

---

## 🚧 Roadmap & Plans

- Investigate advanced MutationObserver and IntersectionObserver features for DOM tree changes.
- Explore integration with [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API).
- Research and implement animation-specific features, including scroll-driven animations and animation worklets.
- Consider adding support for ResizeObserver.

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check [issues page](https://github.com/fest-live/lur.e/issues).

---

<p align="center">
  <b>Made with ❤️ by fest-live</b>
</p>

---

## About naming conflicts...

- Originally, project was named as **BLU.E**.
  - However, I won't have 'B' as first letter.
- Also, **LUR.E** also should been named as **BLUR**.
  - However, I would to save 'E' letter at end.
  - And also, I don't want 'B' as first letter.
- So, I decided to use **LUR.E** naming.
  - However, that naming still controversial.
