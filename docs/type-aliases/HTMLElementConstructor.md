[**@fest-lib/lure v0.1.24**](../README.md)

***

[@fest-lib/lure](../README.md) / HTMLElementConstructor

# Type Alias: HTMLElementConstructor\<T\>

```ts
type HTMLElementConstructor<T> = {
(...args): T & CustomElementLifecycle;
  prototype: T & CustomElementLifecycle;
} & CustomElementStatic;
```

Defined in: lur.e/src/lure/misc/Glit.ts:156

Тип конструктора для HTMLElement и его наследников с поддержкой lifecycle

## Type Parameters

### T

`T` *extends* `HTMLElement` = `HTMLElement`
