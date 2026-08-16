[**@fest-lib/lure v0.1.42**](../README.md)

***

[@fest-lib/lure](../README.md) / AnimatableApplyPlan

# Interface: AnimatableApplyPlan

Defined in: lur.e/src/lure/misc/Animatable.ts:60

Описание того, КАК слот применён в шаблоне.
Это решает `applyStyleTemplate`, а не сам animatable.

## Properties

### mode

```ts
mode: "property" | "custom-property";
```

Defined in: lur.e/src/lure/misc/Animatable.ts:69

"property" — слот занимает всё значение декларации
  (`opacity:${anim}`), анимируем CSS-свойство напрямую.

"custom-property" — слот участвует в выражении
  (`translateX(${anim}px)`, `calc(${anim} * 2px)`),
  анимируем зарегистрированное --fest-anim-* число.

***

### target

```ts
target: string;
```

Defined in: lur.e/src/lure/misc/Animatable.ts:71

Имя CSS-свойства ("opacity") или маркера ("--fest-anim-3-0").

***

### unit?

```ts
optional unit?: string;
```

Defined in: lur.e/src/lure/misc/Animatable.ts:73

Приклеенная единица для сериализации значений в mode:"property".
