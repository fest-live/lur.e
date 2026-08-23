[**@fest-lib/lure v0.1.47**](../README.md)

***

[@fest-lib/lure](../README.md) / ViewDrivenOptions

# Interface: ViewDrivenOptions

Defined in: lur.e/src/lure/misc/Animatable.ts:97

## Properties

### axis?

```ts
optional axis?: "block" | "inline" | "x" | "y";
```

Defined in: lur.e/src/lure/misc/Animatable.ts:101

***

### inset?

```ts
optional inset?: string;
```

Defined in: lur.e/src/lure/misc/Animatable.ts:102

***

### kind

```ts
kind: "view";
```

Defined in: lur.e/src/lure/misc/Animatable.ts:98

***

### rangeEnd?

```ts
optional rangeEnd?: string;
```

Defined in: lur.e/src/lure/misc/Animatable.ts:105

***

### rangeStart?

```ts
optional rangeStart?: string;
```

Defined in: lur.e/src/lure/misc/Animatable.ts:104

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

Defined in: lur.e/src/lure/misc/Animatable.ts:100

Отслеживаемый subject; по умолчанию сам элемент.
