<h1 align="center">🌀 LUR-E 🌀</h1>
<p align="center"><img src="./logo/logo-0.png" width="128" alt="LUR-E Logo"/></p>

---

<p align="center">
  <a href="https://github.com/unite-2-re/lur.e/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/unite-2-re/lur.e?style=flat-square" alt="License"/>
  </a>
  <a href="https://github.com/unite-2-re/lur.e/stargazers">
    <img src="https://img.shields.io/github/stars/unite-2-re/lur.e?style=flat-square" alt="GitHub stars"/>
  </a>
  <a href="https://github.com/unite-2-re/lur.e/commits/main">
    <img src="https://img.shields.io/github/last-commit/unite-2-re/lur.e?style=flat-square" alt="Last Commit"/>
  </a>
  <a href="https://github.com/unite-2-re/lur.e/issues">
    <img src="https://img.shields.io/github/issues/unite-2-re/lur.e?style=flat-square" alt="Issues"/>
  </a>
</p>

## Overview

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

## 📦 Dependencies

- [`Object.TS`](https://github.com/unite-2-re/object.ts) – Reactivity engine
- [`DOM.ts`](https://github.com/unite-2-re/dom.ts) – DOM utilities

## 🔗 Integrations

- [`Theme.Core`](https://github.com/unite-2-re/theme.core) – Optional theme loader

## 🧩 Subsets

- [`UI.System`](https://github.com/unite-2-re/ui.system) (from v3, **rigid**, non-interactive)

---

## 🔌 API Overview

The core API provides a concise and powerful way to work with the DOM:

- `E(Element|Selector, { attributes, dataset, style, ... }, children[] | mapped)`
  - Create a DOM element with specified properties and children.
- `M(Array|Set, generateCb)`
  - Map arrays or sets to DOM elements.
- `H(DOMCode)`
  - Create static DOM HTML from code.
- `L(String|StringRef)`
  - Create a TextNode object.

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
Feel free to check [issues page](https://github.com/unite-2-re/lur.e/issues).

---

<p align="center">
  <b>Made with ❤️ by unite-2-re</b>
</p>
