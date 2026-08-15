[**@fest-lib/lure v0.1.32**](../README.md)

***

[@fest-lib/lure](../README.md) / ViewDrivenOptions

# Interface: ViewDrivenOptions

Defined in: lur.e/src/lure/misc/Animate.ts:24

## Properties

### axis?

```ts
optional axis?: "block" | "inline" | "x" | "y";
```

Defined in: lur.e/src/lure/misc/Animate.ts:28

***

### inset?

```ts
optional inset?: string;
```

Defined in: lur.e/src/lure/misc/Animate.ts:29

***

### kind

```ts
kind: "view";
```

Defined in: lur.e/src/lure/misc/Animate.ts:25

***

### rangeEnd?

```ts
optional rangeEnd?: string;
```

Defined in: lur.e/src/lure/misc/Animate.ts:32

***

### rangeStart?

```ts
optional rangeStart?: string;
```

Defined in: lur.e/src/lure/misc/Animate.ts:31

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

Defined in: lur.e/src/lure/misc/Animate.ts:27

Отслеживаемый subject; по умолчанию сам элемент.
