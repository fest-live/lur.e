[**@fest-lib/lure v0.1.52**](../README.md)

***

[@fest-lib/lure](../README.md) / AnimatableApplyPlan

# Interface: AnimatableApplyPlan

Defined in: style.ts/src/types.ts:247

Описание того, КАК слот применён в шаблоне.
Это решает `applyStyleTemplate`, а не сам animatable.

## Properties

### mode

```ts
mode: "property" | "custom-property";
```

Defined in: style.ts/src/types.ts:256

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

Defined in: style.ts/src/types.ts:258

Имя CSS-свойства ("opacity") или маркера ("--fest-anim-3-0").

***

### unit?

```ts
optional unit?: string;
```

Defined in: style.ts/src/types.ts:260

Приклеенная единица для сериализации значений в mode:"property".
