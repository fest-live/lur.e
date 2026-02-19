import { numberRef, observe } from "fest/object";

export class Vector2D {
    private _x: ReturnType<typeof numberRef>;
    private _y: ReturnType<typeof numberRef>;

    constructor(x: number | ReturnType<typeof numberRef> = 0, y: number | ReturnType<typeof numberRef> = 0) {
        this._x = typeof x === 'number' ? numberRef(x) : x;
        this._y = typeof y === 'number' ? numberRef(y) : y;
    }

    get x() { return this._x; }
    set x(value: number | ReturnType<typeof numberRef>) {
        if (typeof value === 'number') {
            this._x.value = value;
        } else {
            this._x = value;
        }
    }

    get y() { return this._y; }
    set y(value: number | ReturnType<typeof numberRef>) {
        if (typeof value === 'number') {
            this._y.value = value;
        } else {
            this._y = value;
        }
    }

    // Array-like access for compatibility
    get 0() { return this._x; }
    get 1() { return this._y; }

    // Convert to plain array for operations
    toArray() {
        return [this._x, this._y];
    }

    // Clone the vector
    clone() {
        return new Vector2D(this._x.value, this._y.value);
    }

    // Set values
    set(x: number, y: number) {
        this._x.value = x;
        this._y.value = y;
        return this;
    }

    // Copy from another vector
    copy(v: Vector2D) {
        this._x.value = v.x.value;
        this._y.value = v.y.value;
        return this;
    }

    // Vector operations
    add(v: Vector2D): Vector2D {
        return new Vector2D(this._x.value + v.x.value, this._y.value + v.y.value);
    }

    subtract(v: Vector2D): Vector2D {
        return new Vector2D(this._x.value - v.x.value, this._y.value - v.y.value);
    }

    multiply(scalar: number): Vector2D {
        return new Vector2D(this._x.value * scalar, this._y.value * scalar);
    }

    divide(scalar: number): Vector2D {
        if (scalar === 0) throw new Error("Division by zero");
        return new Vector2D(this._x.value / scalar, this._y.value / scalar);
    }

    // Dot product
    dot(v: Vector2D): number {
        return this._x.value * v.x.value + this._y.value * v.y.value;
    }

    // Cross product (returns scalar in 2D)
    cross(v: Vector2D): number {
        return this._x.value * v.y.value - this._y.value * v.x.value;
    }

    // Magnitude (length)
    magnitude(): number {
        return Math.sqrt(this._x.value * this._x.value + this._y.value * this._y.value);
    }

    // Squared magnitude (faster than magnitude for comparisons)
    magnitudeSquared(): number {
        return this._x.value * this._x.value + this._y.value * this._y.value;
    }

    // Distance to another vector
    distanceTo(v: Vector2D): number {
        const dx = this._x.value - v.x.value;
        const dy = this._y.value - v.y.value;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // Squared distance (faster for comparisons)
    distanceToSquared(v: Vector2D): number {
        const dx = this._x.value - v.x.value;
        const dy = this._y.value - v.y.value;
        return dx * dx + dy * dy;
    }

    // Normalize (make unit length)
    normalize(): Vector2D {
        const mag = this.magnitude();
        if (mag === 0) return new Vector2D(0, 0);
        return new Vector2D(this._x.value / mag, this._y.value / mag);
    }

    // Check if vectors are equal
    equals(v: Vector2D, tolerance: number = 1e-6): boolean {
        return Math.abs(this._x.value - v.x.value) < tolerance &&
               Math.abs(this._y.value - v.y.value) < tolerance;
    }

    // Linear interpolation
    lerp(v: Vector2D, t: number): Vector2D {
        const clampedT = Math.max(0, Math.min(1, t));
        return new Vector2D(
            this._x.value + (v.x.value - this._x.value) * clampedT,
            this._y.value + (v.y.value - this._y.value) * clampedT
        );
    }

    // Angle with another vector (in radians)
    angleTo(v: Vector2D): number {
        const dot = this.dot(v);
        const det = this.cross(v);
        return Math.atan2(det, dot);
    }

    // Rotate vector by angle (in radians)
    rotate(angle: number): Vector2D {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return new Vector2D(
            this._x.value * cos - this._y.value * sin,
            this._x.value * sin + this._y.value * cos
        );
    }

    // Project onto another vector
    projectOnto(v: Vector2D): Vector2D {
        const scalar = this.dot(v) / v.magnitudeSquared();
        return v.multiply(scalar);
    }

    // Reflect across a normal vector
    reflect(normal: Vector2D): Vector2D {
        const normalizedNormal = normal.normalize();
        const dotProduct = this.dot(normalizedNormal);
        return this.subtract(normalizedNormal.multiply(2 * dotProduct));
    }

    // Clamp vector components
    clamp(min: Vector2D, max: Vector2D): Vector2D {
        return new Vector2D(
            Math.max(min.x.value, Math.min(max.x.value, this._x.value)),
            Math.max(min.y.value, Math.min(max.y.value, this._y.value))
        );
    }

    // Get the minimum component
    min(): number {
        return Math.min(this._x.value, this._y.value);
    }

    // Get the maximum component
    max(): number {
        return Math.max(this._x.value, this._y.value);
    }

    // Static utility methods
    static zero(): Vector2D {
        return new Vector2D(0, 0);
    }

    static one(): Vector2D {
        return new Vector2D(1, 1);
    }

    static unitX(): Vector2D {
        return new Vector2D(1, 0);
    }

    static unitY(): Vector2D {
        return new Vector2D(0, 1);
    }

    // Create vector from angle (in radians)
    static fromAngle(angle: number, length: number = 1): Vector2D {
        return new Vector2D(
            Math.cos(angle) * length,
            Math.sin(angle) * length
        );
    }

    // Create vector from polar coordinates
    static fromPolar(angle: number, radius: number): Vector2D {
        return Vector2D.fromAngle(angle, radius);
    }
}

export const vector2Ref = (x: number | ReturnType<typeof numberRef> = 0, y: number | ReturnType<typeof numberRef> = 0) => {
    return new Vector2D(x, y);
}

export class Matrix2D {
    private _elements: ReturnType<typeof numberRef>[];

    constructor(
        a: number | ReturnType<typeof numberRef> = 1, b: number | ReturnType<typeof numberRef> = 0,
        c: number | ReturnType<typeof numberRef> = 0, d: number | ReturnType<typeof numberRef> = 1
    ) {
        this._elements = [
            typeof a === 'number' ? numberRef(a) : a,
            typeof b === 'number' ? numberRef(b) : b,
            typeof c === 'number' ? numberRef(c) : c,
            typeof d === 'number' ? numberRef(d) : d
        ];
    }

    get elements() { return this._elements; }

    // Matrix elements access
    get m00() { return this._elements[0]; }
    get m01() { return this._elements[1]; }
    get m10() { return this._elements[2]; }
    get m11() { return this._elements[3]; }

    set m00(value: number | ReturnType<typeof numberRef>) {
        if (typeof value === 'number') this._elements[0].value = value;
        else this._elements[0] = value;
    }
    set m01(value: number | ReturnType<typeof numberRef>) {
        if (typeof value === 'number') this._elements[1].value = value;
        else this._elements[1] = value;
    }
    set m10(value: number | ReturnType<typeof numberRef>) {
        if (typeof value === 'number') this._elements[2].value = value;
        else this._elements[2] = value;
    }
    set m11(value: number | ReturnType<typeof numberRef>) {
        if (typeof value === 'number') this._elements[3].value = value;
        else this._elements[3] = value;
    }

    // Array-like access for compatibility
    get 0() { return this._elements[0]; }
    get 1() { return this._elements[1]; }
    get 2() { return this._elements[2]; }
    get 3() { return this._elements[3]; }

    // Convert to plain array for operations
    toArray() {
        return [...this._elements];
    }

    // Clone the matrix
    clone() {
        return new Matrix2D(
            this._elements[0].value, this._elements[1].value,
            this._elements[2].value, this._elements[3].value
        );
    }

    // Set values
    set(a: number, b: number, c: number, d: number) {
        this._elements[0].value = a;
        this._elements[1].value = b;
        this._elements[2].value = c;
        this._elements[3].value = d;
        return this;
    }

    // Identity matrix
    identity() {
        return this.set(1, 0, 0, 1);
    }

    // Copy from another matrix
    copy(m: Matrix2D) {
        this._elements[0].value = m.elements[0].value;
        this._elements[1].value = m.elements[1].value;
        this._elements[2].value = m.elements[2].value;
        this._elements[3].value = m.elements[3].value;
        return this;
    }

    // Matrix operations
    multiply(m: Matrix2D): Matrix2D {
        const a = this._elements[0].value, b = this._elements[1].value;
        const c = this._elements[2].value, d = this._elements[3].value;
        const e = m.elements[0].value, f = m.elements[1].value;
        const g = m.elements[2].value, h = m.elements[3].value;

        return new Matrix2D(
            a * e + b * g, a * f + b * h,
            c * e + d * g, c * f + d * h
        );
    }

    multiplyScalar(s: number): Matrix2D {
        return new Matrix2D(
            this._elements[0].value * s, this._elements[1].value * s,
            this._elements[2].value * s, this._elements[3].value * s
        );
    }

    // Transform a vector
    transformVector(v: Vector2D): Vector2D {
        const x = this._elements[0].value * v.x.value + this._elements[1].value * v.y.value;
        const y = this._elements[2].value * v.x.value + this._elements[3].value * v.y.value;
        return new Vector2D(x, y);
    }

    // Determinant
    determinant(): number {
        return this._elements[0].value * this._elements[3].value -
               this._elements[1].value * this._elements[2].value;
    }

    // Inverse matrix
    inverse(): Matrix2D | null {
        const det = this.determinant();
        if (det === 0) return null; // Not invertible

        const invDet = 1 / det;
        return new Matrix2D(
            this._elements[3].value * invDet, -this._elements[1].value * invDet,
            -this._elements[2].value * invDet, this._elements[0].value * invDet
        );
    }

    // Transpose
    transpose(): Matrix2D {
        return new Matrix2D(
            this._elements[0].value, this._elements[2].value,
            this._elements[1].value, this._elements[3].value
        );
    }

    // Check if matrices are equal
    equals(m: Matrix2D, tolerance: number = 1e-6): boolean {
        for (let i = 0; i < 4; i++) {
            if (Math.abs(this._elements[i].value - m.elements[i].value) > tolerance) {
                return false;
            }
        }
        return true;
    }

    // Create rotation matrix
    static rotation(angle: number): Matrix2D {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return new Matrix2D(cos, -sin, sin, cos);
    }

    // Create scale matrix
    static scale(sx: number, sy: number = sx): Matrix2D {
        return new Matrix2D(sx, 0, 0, sy);
    }

    // Create shear matrix
    static shear(sx: number, sy: number): Matrix2D {
        return new Matrix2D(1, sx, sy, 1);
    }
}

export const matrix2x2Ref = (
    a: number | ReturnType<typeof numberRef> = 1, b: number | ReturnType<typeof numberRef> = 0,
    c: number | ReturnType<typeof numberRef> = 0, d: number | ReturnType<typeof numberRef> = 1
) => {
    return new Matrix2D(a, b, c, d);
}
