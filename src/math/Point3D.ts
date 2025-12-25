
import { numberRef } from "fest/object";

export class Vector3D {
    private _x: ReturnType<typeof numberRef>;
    private _y: ReturnType<typeof numberRef>;
    private _z: ReturnType<typeof numberRef>;

    constructor(x: number | ReturnType<typeof numberRef> = 0, y: number | ReturnType<typeof numberRef> = 0, z: number | ReturnType<typeof numberRef> = 0) {
        this._x = typeof x === 'number' ? numberRef(x) : x;
        this._y = typeof y === 'number' ? numberRef(y) : y;
        this._z = typeof z === 'number' ? numberRef(z) : z;
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

    get z() { return this._z; }
    set z(value: number | ReturnType<typeof numberRef>) {
        if (typeof value === 'number') {
            this._z.value = value;
        } else {
            this._z = value;
        }
    }

    // Array-like access for compatibility
    get 0() { return this._x; }
    get 1() { return this._y; }
    get 2() { return this._z; }

    // Convert to plain array for operations
    toArray() {
        return [this._x, this._y, this._z];
    }

    // Clone the vector
    clone() {
        return new Vector3D(this._x.value, this._y.value, this._z.value);
    }

    // Set values
    set(x: number, y: number, z: number) {
        this._x.value = x;
        this._y.value = y;
        this._z.value = z;
        return this;
    }

    // Copy from another vector
    copy(v: Vector3D) {
        this._x.value = v.x.value;
        this._y.value = v.y.value;
        this._z.value = v.z.value;
        return this;
    }
}

export const vector3Ref = (x: number | ReturnType<typeof numberRef> = 0, y: number | ReturnType<typeof numberRef> = 0, z: number | ReturnType<typeof numberRef> = 0) => {
    return new Vector3D(x, y, z);
}

export class Matrix3D {
    private _elements: ReturnType<typeof numberRef>[];

    constructor(
        a: number | ReturnType<typeof numberRef> = 1, b: number | ReturnType<typeof numberRef> = 0, c: number | ReturnType<typeof numberRef> = 0,
        d: number | ReturnType<typeof numberRef> = 0, e: number | ReturnType<typeof numberRef> = 1, f: number | ReturnType<typeof numberRef> = 0,
        g: number | ReturnType<typeof numberRef> = 0, h: number | ReturnType<typeof numberRef> = 0, i: number | ReturnType<typeof numberRef> = 1
    ) {
        this._elements = [
            typeof a === 'number' ? numberRef(a) : a,
            typeof b === 'number' ? numberRef(b) : b,
            typeof c === 'number' ? numberRef(c) : c,
            typeof d === 'number' ? numberRef(d) : d,
            typeof e === 'number' ? numberRef(e) : e,
            typeof f === 'number' ? numberRef(f) : f,
            typeof g === 'number' ? numberRef(g) : g,
            typeof h === 'number' ? numberRef(h) : h,
            typeof i === 'number' ? numberRef(i) : i
        ];
    }

    get elements() { return this._elements; }

    // Matrix elements access
    get m00() { return this._elements[0]; } get m01() { return this._elements[1]; } get m02() { return this._elements[2]; }
    get m10() { return this._elements[3]; } get m11() { return this._elements[4]; } get m12() { return this._elements[5]; }
    get m20() { return this._elements[6]; } get m21() { return this._elements[7]; } get m22() { return this._elements[8]; }

    set m00(value: number | ReturnType<typeof numberRef>) { if (typeof value === 'number') this._elements[0].value = value; else this._elements[0] = value; }
    set m01(value: number | ReturnType<typeof numberRef>) { if (typeof value === 'number') this._elements[1].value = value; else this._elements[1] = value; }
    set m02(value: number | ReturnType<typeof numberRef>) { if (typeof value === 'number') this._elements[2].value = value; else this._elements[2] = value; }
    set m10(value: number | ReturnType<typeof numberRef>) { if (typeof value === 'number') this._elements[3].value = value; else this._elements[3] = value; }
    set m11(value: number | ReturnType<typeof numberRef>) { if (typeof value === 'number') this._elements[4].value = value; else this._elements[4] = value; }
    set m12(value: number | ReturnType<typeof numberRef>) { if (typeof value === 'number') this._elements[5].value = value; else this._elements[5] = value; }
    set m20(value: number | ReturnType<typeof numberRef>) { if (typeof value === 'number') this._elements[6].value = value; else this._elements[6] = value; }
    set m21(value: number | ReturnType<typeof numberRef>) { if (typeof value === 'number') this._elements[7].value = value; else this._elements[7] = value; }
    set m22(value: number | ReturnType<typeof numberRef>) { if (typeof value === 'number') this._elements[8].value = value; else this._elements[8] = value; }

    // Array-like access for compatibility
    get 0() { return this._elements[0]; } get 1() { return this._elements[1]; } get 2() { return this._elements[2]; }
    get 3() { return this._elements[3]; } get 4() { return this._elements[4]; } get 5() { return this._elements[5]; }
    get 6() { return this._elements[6]; } get 7() { return this._elements[7]; } get 8() { return this._elements[8]; }

    // Convert to plain array for operations
    toArray() {
        return [...this._elements];
    }

    // Clone the matrix
    clone() {
        return new Matrix3D(
            this._elements[0].value, this._elements[1].value, this._elements[2].value,
            this._elements[3].value, this._elements[4].value, this._elements[5].value,
            this._elements[6].value, this._elements[7].value, this._elements[8].value
        );
    }

    // Set values
    set(a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number) {
        this._elements[0].value = a; this._elements[1].value = b; this._elements[2].value = c;
        this._elements[3].value = d; this._elements[4].value = e; this._elements[5].value = f;
        this._elements[6].value = g; this._elements[7].value = h; this._elements[8].value = i;
        return this;
    }

    // Identity matrix
    identity() {
        return this.set(1, 0, 0, 0, 1, 0, 0, 0, 1);
    }

    // Copy from another matrix
    copy(m: Matrix3D) {
        for (let i = 0; i < 9; i++) {
            this._elements[i].value = m.elements[i].value;
        }
        return this;
    }
}

export const matrix3x3Ref = (
    a: number | ReturnType<typeof numberRef> = 1, b: number | ReturnType<typeof numberRef> = 0, c: number | ReturnType<typeof numberRef> = 0,
    d: number | ReturnType<typeof numberRef> = 0, e: number | ReturnType<typeof numberRef> = 1, f: number | ReturnType<typeof numberRef> = 0,
    g: number | ReturnType<typeof numberRef> = 0, h: number | ReturnType<typeof numberRef> = 0, i: number | ReturnType<typeof numberRef> = 1
) => {
    return new Matrix3D(a, b, c, d, e, f, g, h, i);
}