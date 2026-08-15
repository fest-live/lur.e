[**@fest-lib/lure v0.1.39**](../README.md)

***

[@fest-lib/lure](../README.md) / GLitElementConstructor

# Type Alias: GLitElementConstructor\<T\>

```ts
type GLitElementConstructor<T> = {
(...args): T & GLitElementInstance;
  prototype: T & GLitElementInstance;
} & CustomElementStatic;
```

Defined in: lur.e/src/lure/misc/Glit.ts:164

Тип для результата GLitElement - конструктор с полной поддержкой lifecycle

## Type Parameters

### T

`T` *extends* `HTMLElement` = `HTMLElement`
