[**@fest-lib/lure v0.1.51**](../README.md)

***

[@fest-lib/lure](../README.md) / ScrollDrivenOptions

# Interface: ScrollDrivenOptions

Defined in: style.ts/src/types.ts:166

## Properties

### axis?

```ts
optional axis?: "block" | "inline" | "x" | "y";
```

Defined in: style.ts/src/types.ts:176

***

### kind

```ts
kind: "scroll";
```

Defined in: style.ts/src/types.ts:167

***

### rangeEnd?

```ts
optional rangeEnd?: string;
```

Defined in: style.ts/src/types.ts:179

***

### rangeStart?

```ts
optional rangeStart?: string;
```

Defined in: style.ts/src/types.ts:178

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

Defined in: style.ts/src/types.ts:175

Источник скролла:
- "nearest" (default) — ближайший скроллируемый предок
- "root" — документ
- "self" — сам элемент
- Element | { value: Element } — конкретный скроллер (в т.ч. реактивный)
