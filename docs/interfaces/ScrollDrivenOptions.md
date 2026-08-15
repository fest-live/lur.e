[**@fest-lib/lure v0.1.32**](../README.md)

***

[@fest-lib/lure](../README.md) / ScrollDrivenOptions

# Interface: ScrollDrivenOptions

Defined in: lur.e/src/lure/misc/Animate.ts:8

## Properties

### axis?

```ts
optional axis?: "block" | "inline" | "x" | "y";
```

Defined in: lur.e/src/lure/misc/Animate.ts:18

***

### kind

```ts
kind: "scroll";
```

Defined in: lur.e/src/lure/misc/Animate.ts:9

***

### rangeEnd?

```ts
optional rangeEnd?: string;
```

Defined in: lur.e/src/lure/misc/Animate.ts:21

***

### rangeStart?

```ts
optional rangeStart?: string;
```

Defined in: lur.e/src/lure/misc/Animate.ts:20

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

Defined in: lur.e/src/lure/misc/Animate.ts:17

Источник скролла:
- "nearest" (default) — ближайший скроллируемый предок
- "root" — документ
- "self" — сам элемент
- Element | { value: Element } — конкретный скроллер (в т.ч. реактивный)
