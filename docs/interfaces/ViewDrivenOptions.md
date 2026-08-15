[**@fest-lib/lure v0.1.35**](../README.md)

***

[@fest-lib/lure](../README.md) / ViewDrivenOptions

# Interface: ViewDrivenOptions

Defined in: lur.e/src/lure/misc/Animatable.ts:90

## Properties

### axis?

```ts
optional axis?: "block" | "inline" | "x" | "y";
```

Defined in: lur.e/src/lure/misc/Animatable.ts:94

***

### inset?

```ts
optional inset?: string;
```

Defined in: lur.e/src/lure/misc/Animatable.ts:95

***

### kind

```ts
kind: "view";
```

Defined in: lur.e/src/lure/misc/Animatable.ts:91

***

### rangeEnd?

```ts
optional rangeEnd?: string;
```

Defined in: lur.e/src/lure/misc/Animatable.ts:98

***

### rangeStart?

```ts
optional rangeStart?: string;
```

Defined in: lur.e/src/lure/misc/Animatable.ts:97

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

Defined in: lur.e/src/lure/misc/Animatable.ts:93

Отслеживаемый subject; по умолчанию сам элемент.
