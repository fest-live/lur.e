[**@fest-lib/lure v0.1.57**](../README.md)

***

[@fest-lib/lure](../README.md) / Matrix2D

# Class: Matrix2D

Defined in: lur.e/src/utils/math/Point2D.ts:215

## Constructors

### Constructor

```ts
new Matrix2D(
   a?, 
   b?, 
   c?, 
   d?): Matrix2D;
```

Defined in: lur.e/src/utils/math/Point2D.ts:218

#### Parameters

##### a?

`any` = `1`

##### b?

`any` = `0`

##### c?

`any` = `0`

##### d?

`any` = `1`

#### Returns

`Matrix2D`

## Accessors

### 0

#### Get Signature

```ts
get 0(): any;
```

Defined in: lur.e/src/utils/math/Point2D.ts:256

##### Returns

`any`

***

### 1

#### Get Signature

```ts
get 1(): any;
```

Defined in: lur.e/src/utils/math/Point2D.ts:257

##### Returns

`any`

***

### 2

#### Get Signature

```ts
get 2(): any;
```

Defined in: lur.e/src/utils/math/Point2D.ts:258

##### Returns

`any`

***

### 3

#### Get Signature

```ts
get 3(): any;
```

Defined in: lur.e/src/utils/math/Point2D.ts:259

##### Returns

`any`

***

### elements

#### Get Signature

```ts
get elements(): any[];
```

Defined in: lur.e/src/utils/math/Point2D.ts:230

##### Returns

`any`[]

***

### m00

#### Get Signature

```ts
get m00(): any;
```

Defined in: lur.e/src/utils/math/Point2D.ts:233

##### Returns

`any`

#### Set Signature

```ts
set m00(value): void;
```

Defined in: lur.e/src/utils/math/Point2D.ts:238

##### Parameters

###### value

`any`

##### Returns

`void`

***

### m01

#### Get Signature

```ts
get m01(): any;
```

Defined in: lur.e/src/utils/math/Point2D.ts:234

##### Returns

`any`

#### Set Signature

```ts
set m01(value): void;
```

Defined in: lur.e/src/utils/math/Point2D.ts:242

##### Parameters

###### value

`any`

##### Returns

`void`

***

### m10

#### Get Signature

```ts
get m10(): any;
```

Defined in: lur.e/src/utils/math/Point2D.ts:235

##### Returns

`any`

#### Set Signature

```ts
set m10(value): void;
```

Defined in: lur.e/src/utils/math/Point2D.ts:246

##### Parameters

###### value

`any`

##### Returns

`void`

***

### m11

#### Get Signature

```ts
get m11(): any;
```

Defined in: lur.e/src/utils/math/Point2D.ts:236

##### Returns

`any`

#### Set Signature

```ts
set m11(value): void;
```

Defined in: lur.e/src/utils/math/Point2D.ts:250

##### Parameters

###### value

`any`

##### Returns

`void`

## Methods

### clone()

```ts
clone(): Matrix2D;
```

Defined in: lur.e/src/utils/math/Point2D.ts:267

#### Returns

`Matrix2D`

***

### copy()

```ts
copy(m): Matrix2D;
```

Defined in: lur.e/src/utils/math/Point2D.ts:289

#### Parameters

##### m

`Matrix2D`

#### Returns

`Matrix2D`

***

### determinant()

```ts
determinant(): number;
```

Defined in: lur.e/src/utils/math/Point2D.ts:325

#### Returns

`number`

***

### equals()

```ts
equals(m, tolerance?): boolean;
```

Defined in: lur.e/src/utils/math/Point2D.ts:351

#### Parameters

##### m

`Matrix2D`

##### tolerance?

`number` = `1e-6`

#### Returns

`boolean`

***

### identity()

```ts
identity(): Matrix2D;
```

Defined in: lur.e/src/utils/math/Point2D.ts:284

#### Returns

`Matrix2D`

***

### inverse()

```ts
inverse(): Matrix2D | null;
```

Defined in: lur.e/src/utils/math/Point2D.ts:331

#### Returns

`Matrix2D` \| `null`

***

### multiply()

```ts
multiply(m): Matrix2D;
```

Defined in: lur.e/src/utils/math/Point2D.ts:298

#### Parameters

##### m

`Matrix2D`

#### Returns

`Matrix2D`

***

### multiplyScalar()

```ts
multiplyScalar(s): Matrix2D;
```

Defined in: lur.e/src/utils/math/Point2D.ts:310

#### Parameters

##### s

`number`

#### Returns

`Matrix2D`

***

### set()

```ts
set(
   a, 
   b, 
   c, 
   d): Matrix2D;
```

Defined in: lur.e/src/utils/math/Point2D.ts:275

#### Parameters

##### a

`number`

##### b

`number`

##### c

`number`

##### d

`number`

#### Returns

`Matrix2D`

***

### toArray()

```ts
toArray(): any[];
```

Defined in: lur.e/src/utils/math/Point2D.ts:262

#### Returns

`any`[]

***

### transformVector()

```ts
transformVector(v): Vector2D;
```

Defined in: lur.e/src/utils/math/Point2D.ts:318

#### Parameters

##### v

[`Vector2D`](Vector2D.md)

#### Returns

[`Vector2D`](Vector2D.md)

***

### transpose()

```ts
transpose(): Matrix2D;
```

Defined in: lur.e/src/utils/math/Point2D.ts:343

#### Returns

`Matrix2D`

***

### rotation()

```ts
static rotation(angle): Matrix2D;
```

Defined in: lur.e/src/utils/math/Point2D.ts:361

#### Parameters

##### angle

`number`

#### Returns

`Matrix2D`

***

### scale()

```ts
static scale(sx, sy?): Matrix2D;
```

Defined in: lur.e/src/utils/math/Point2D.ts:368

#### Parameters

##### sx

`number`

##### sy?

`number` = `sx`

#### Returns

`Matrix2D`

***

### shear()

```ts
static shear(sx, sy): Matrix2D;
```

Defined in: lur.e/src/utils/math/Point2D.ts:373

#### Parameters

##### sx

`number`

##### sy

`number`

#### Returns

`Matrix2D`
