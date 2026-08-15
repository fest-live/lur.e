[**@fest-lib/lure v0.1.31**](../README.md)

***

[@fest-lib/lure](../README.md) / Vector2D

# Class: Vector2D

Defined in: lur.e/src/utils/math/Point2D.ts:3

## Constructors

### Constructor

```ts
new Vector2D(x?, y?): Vector2D;
```

Defined in: lur.e/src/utils/math/Point2D.ts:7

#### Parameters

##### x?

`any` = `0`

##### y?

`any` = `0`

#### Returns

`Vector2D`

## Accessors

### 0

#### Get Signature

```ts
get 0(): any;
```

Defined in: lur.e/src/utils/math/Point2D.ts:31

##### Returns

`any`

***

### 1

#### Get Signature

```ts
get 1(): any;
```

Defined in: lur.e/src/utils/math/Point2D.ts:32

##### Returns

`any`

***

### x

#### Get Signature

```ts
get x(): any;
```

Defined in: lur.e/src/utils/math/Point2D.ts:12

##### Returns

`any`

#### Set Signature

```ts
set x(value): void;
```

Defined in: lur.e/src/utils/math/Point2D.ts:13

##### Parameters

###### value

`any`

##### Returns

`void`

***

### y

#### Get Signature

```ts
get y(): any;
```

Defined in: lur.e/src/utils/math/Point2D.ts:21

##### Returns

`any`

#### Set Signature

```ts
set y(value): void;
```

Defined in: lur.e/src/utils/math/Point2D.ts:22

##### Parameters

###### value

`any`

##### Returns

`void`

## Methods

### add()

```ts
add(v): Vector2D;
```

Defined in: lur.e/src/utils/math/Point2D.ts:59

#### Parameters

##### v

`Vector2D`

#### Returns

`Vector2D`

***

### angleTo()

```ts
angleTo(v): number;
```

Defined in: lur.e/src/utils/math/Point2D.ts:133

#### Parameters

##### v

`Vector2D`

#### Returns

`number`

***

### clamp()

```ts
clamp(min, max): Vector2D;
```

Defined in: lur.e/src/utils/math/Point2D.ts:163

#### Parameters

##### min

`Vector2D`

##### max

`Vector2D`

#### Returns

`Vector2D`

***

### clone()

```ts
clone(): Vector2D;
```

Defined in: lur.e/src/utils/math/Point2D.ts:40

#### Returns

`Vector2D`

***

### copy()

```ts
copy(v): Vector2D;
```

Defined in: lur.e/src/utils/math/Point2D.ts:52

#### Parameters

##### v

`Vector2D`

#### Returns

`Vector2D`

***

### cross()

```ts
cross(v): number;
```

Defined in: lur.e/src/utils/math/Point2D.ts:82

#### Parameters

##### v

`Vector2D`

#### Returns

`number`

***

### distanceTo()

```ts
distanceTo(v): number;
```

Defined in: lur.e/src/utils/math/Point2D.ts:97

#### Parameters

##### v

`Vector2D`

#### Returns

`number`

***

### distanceToSquared()

```ts
distanceToSquared(v): number;
```

Defined in: lur.e/src/utils/math/Point2D.ts:104

#### Parameters

##### v

`Vector2D`

#### Returns

`number`

***

### divide()

```ts
divide(scalar): Vector2D;
```

Defined in: lur.e/src/utils/math/Point2D.ts:71

#### Parameters

##### scalar

`number`

#### Returns

`Vector2D`

***

### dot()

```ts
dot(v): number;
```

Defined in: lur.e/src/utils/math/Point2D.ts:77

#### Parameters

##### v

`Vector2D`

#### Returns

`number`

***

### equals()

```ts
equals(v, tolerance?): boolean;
```

Defined in: lur.e/src/utils/math/Point2D.ts:118

#### Parameters

##### v

`Vector2D`

##### tolerance?

`number` = `1e-6`

#### Returns

`boolean`

***

### lerp()

```ts
lerp(v, t): Vector2D;
```

Defined in: lur.e/src/utils/math/Point2D.ts:124

#### Parameters

##### v

`Vector2D`

##### t

`number`

#### Returns

`Vector2D`

***

### magnitude()

```ts
magnitude(): number;
```

Defined in: lur.e/src/utils/math/Point2D.ts:87

#### Returns

`number`

***

### magnitudeSquared()

```ts
magnitudeSquared(): number;
```

Defined in: lur.e/src/utils/math/Point2D.ts:92

#### Returns

`number`

***

### max()

```ts
max(): number;
```

Defined in: lur.e/src/utils/math/Point2D.ts:176

#### Returns

`number`

***

### min()

```ts
min(): number;
```

Defined in: lur.e/src/utils/math/Point2D.ts:171

#### Returns

`number`

***

### multiply()

```ts
multiply(scalar): Vector2D;
```

Defined in: lur.e/src/utils/math/Point2D.ts:67

#### Parameters

##### scalar

`number`

#### Returns

`Vector2D`

***

### normalize()

```ts
normalize(): Vector2D;
```

Defined in: lur.e/src/utils/math/Point2D.ts:111

#### Returns

`Vector2D`

***

### projectOnto()

```ts
projectOnto(v): Vector2D;
```

Defined in: lur.e/src/utils/math/Point2D.ts:150

#### Parameters

##### v

`Vector2D`

#### Returns

`Vector2D`

***

### reflect()

```ts
reflect(normal): Vector2D;
```

Defined in: lur.e/src/utils/math/Point2D.ts:156

#### Parameters

##### normal

`Vector2D`

#### Returns

`Vector2D`

***

### rotate()

```ts
rotate(angle): Vector2D;
```

Defined in: lur.e/src/utils/math/Point2D.ts:140

#### Parameters

##### angle

`number`

#### Returns

`Vector2D`

***

### set()

```ts
set(x, y): Vector2D;
```

Defined in: lur.e/src/utils/math/Point2D.ts:45

#### Parameters

##### x

`number`

##### y

`number`

#### Returns

`Vector2D`

***

### subtract()

```ts
subtract(v): Vector2D;
```

Defined in: lur.e/src/utils/math/Point2D.ts:63

#### Parameters

##### v

`Vector2D`

#### Returns

`Vector2D`

***

### toArray()

```ts
toArray(): any[];
```

Defined in: lur.e/src/utils/math/Point2D.ts:35

#### Returns

`any`[]

***

### fromAngle()

```ts
static fromAngle(angle, length?): Vector2D;
```

Defined in: lur.e/src/utils/math/Point2D.ts:198

#### Parameters

##### angle

`number`

##### length?

`number` = `1`

#### Returns

`Vector2D`

***

### fromPolar()

```ts
static fromPolar(angle, radius): Vector2D;
```

Defined in: lur.e/src/utils/math/Point2D.ts:206

#### Parameters

##### angle

`number`

##### radius

`number`

#### Returns

`Vector2D`

***

### one()

```ts
static one(): Vector2D;
```

Defined in: lur.e/src/utils/math/Point2D.ts:185

#### Returns

`Vector2D`

***

### unitX()

```ts
static unitX(): Vector2D;
```

Defined in: lur.e/src/utils/math/Point2D.ts:189

#### Returns

`Vector2D`

***

### unitY()

```ts
static unitY(): Vector2D;
```

Defined in: lur.e/src/utils/math/Point2D.ts:193

#### Returns

`Vector2D`

***

### zero()

```ts
static zero(): Vector2D;
```

Defined in: lur.e/src/utils/math/Point2D.ts:181

#### Returns

`Vector2D`
