[**@fest-lib/lure v0.1.50**](../README.md)

***

[@fest-lib/lure](../README.md) / ViewDrivenOptions

# Interface: ViewDrivenOptions

Defined in: style.ts/src/Animatable.ts:97

## Properties

### axis?

```ts
optional axis?: "block" | "inline" | "x" | "y";
```

Defined in: style.ts/src/Animatable.ts:101

***

### inset?

```ts
optional inset?: string;
```

Defined in: style.ts/src/Animatable.ts:102

***

### kind

```ts
kind: "view";
```

Defined in: style.ts/src/Animatable.ts:98

***

### rangeEnd?

```ts
optional rangeEnd?: string;
```

Defined in: style.ts/src/Animatable.ts:105

***

### rangeStart?

```ts
optional rangeStart?: string;
```

Defined in: style.ts/src/Animatable.ts:104

"entry 0%", "cover 50%", "exit 100%"...

***

### subject?

```ts
optional subject?: 
  | Element
  | {
  value: any;
};
```

Defined in: style.ts/src/Animatable.ts:100

Отслеживаемый subject; по умолчанию сам элемент.
