# 🌀 *LUR-E* 🌀

---

<table>
<tr>
<td align="center" colspan="2">
<img width="128" alt="Logo" src="./logo/logo-0.png"/>
</td>
</tr>
<tr>
<td valign="top">

### 🌀 Features 🌀

Own experimental **UI** library.

- Better memory managment
- Cache and reaction system
- Low level (DOM managment)
- Better CSS compatible
- Web components compatible
- Experimental Typed OM
- Mutation Observer (attributes)
- Input changes `value` key to reactive

</td>
<td valign="top">

### 🔌 API 🔌

Shortly, most notable **core** concept.

- `E(Element|Selector, { attributes: {}, dataset: {}, style: {}, ... }, children[] | mapped)`
   - create DOM element with nodes
- `M(Array|Set, generateCb)`
   - make mapped elements from array
- `H(DOMCode)`
   - create static DOM HTML from code
- `L(String|StringRef)`
   - make TextNode object

</td>
</tr>
</table>

---

## *Plans*

- I have no viable ideas about MutationObserver DOM tree features, same as Intersection Observers.
- I don't know how to use [Web Animations](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) in context of that framework.
- I would somehow implement animation-specific features, but current don't know how it can be implemented, and doesn't know viable conceptions.
- Also I would to implement scroll-driven animations (timelines) and animation worklets, but also have no any viable ideas.
- Have very weak ideas for ResizeObserver's.

<table>
<tr>
<td valign="top">

## *Dependency*

- [`Object.TS`](https://github.com/unite-2-re/object.ts) most notable.
- [`DOM.ts`](https://github.com/unite-2-re/dom.ts) DOM utils.

</td>
<td valign="top">

## *Interaction*

- [`Theme.Core`](https://github.com/unite-2-re/theme.core) optional loading theme.

</td>
<td valign="top">

## *Subsets*

- [`UI.System`](https://github.com/unite-2-re/ui.system) from v3 (***rigid***, no-active).

</td>
</tr>
</table>
