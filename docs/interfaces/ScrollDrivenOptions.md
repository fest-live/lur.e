[**@fest-lib/lure v0.1.49**](../README.md)

***

[@fest-lib/lure](../README.md) / ScrollDrivenOptions

# Interface: ScrollDrivenOptions

Defined in: lur.e/src/lure/misc/Animatable.ts:81

## Properties

### axis?

```ts
optional axis?: "block" | "inline" | "x" | "y";
```

Defined in: lur.e/src/lure/misc/Animatable.ts:91

***

### kind

```ts
kind: "scroll";
```

Defined in: lur.e/src/lure/misc/Animatable.ts:82

***

### rangeEnd?

```ts
optional rangeEnd?: string;
```

Defined in: lur.e/src/lure/misc/Animatable.ts:94

***

### rangeStart?

```ts
optional rangeStart?: string;
```

Defined in: lur.e/src/lure/misc/Animatable.ts:93

animation-range: "0%" / "100px" / "contain 0%" и т.п.

***

### source?

```ts
optional source?: 
  | Element
  | "nearest"
  | "root"
  | "self"
  | {
  value: any;
};
```

Defined in: lur.e/src/lure/misc/Animatable.ts:90

Источник скролла:
- "nearest" (default) — ближайший скроллируемый предок
- "root" — документ
- "self" — сам элемент
- Element | { value: Element } — конкретный скроллер (в т.ч. реактивный)
