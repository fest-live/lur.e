
import { numberRef } from "fest/object";

export class Vector4D {
    private _x: ReturnType<typeof numberRef>;
    private _y: ReturnType<typeof numberRef>;
    private _z: ReturnType<typeof numberRef>;
    private _w: ReturnType<typeof numberRef>;

    constructor(x: number | ReturnType<typeof numberRef> = 0, y: number | ReturnType<typeof numberRef> = 0, z: number | ReturnType<typeof numberRef> = 0, w: number | ReturnType<typeof numberRef> = 1) {
        this._x = typeof x === 'number' ? numberRef(x) : x;
        this._y = typeof y === 'number' ? numberRef(y) : y;
        this._z = typeof z === 'number' ? numberRef(z) : z;
        this._w = typeof w === 'number' ? numberRef(w) : w;
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

    get w() { return this._w; }
    set w(value: number | ReturnType<typeof numberRef>) {
        if (typeof value === 'number') {
            this._w.value = value;
        } else {
            this._w = value;
        }
    }

    // Array-like access for compatibility
    get 0() { return this._x; }
    get 1() { return this._y; }
    get 2() { return this._z; }
    get 3() { return this._w; }

    // Convert to plain array for operations
    toArray() {
        return [this._x, this._y, this._z, this._w];
    }

    // Clone the vector
    clone() {
        return new Vector4D(this._x.value, this._y.value, this._z.value, this._w.value);
    }

    // Set values
    set(x: number, y: number, z: number, w: number = 1) {
        this._x.value = x;
        this._y.value = y;
        this._z.value = z;
        this._w.value = w;
        return this;
    }

    // Copy from another vector
    copy(v: Vector4D) {
        this._x.value = v.x.value;
        this._y.value = v.y.value;
        this._z.value = v.z.value;
        this._w.value = v.w.value;
        return this;
    }
}

export const vector4Ref = (x: number | ReturnType<typeof numberRef> = 0, y: number | ReturnType<typeof numberRef> = 0, z: number | ReturnType<typeof numberRef> = 0, w: number | ReturnType<typeof numberRef> = 1) => {
    return new Vector4D(x, y, z, w);
}

export class Matrix4D {
    private _elements: ReturnType<typeof numberRef>[];

    constructor(
        a: number | ReturnType<typeof numberRef> = 1, b: number | ReturnType<typeof numberRef> = 0, c: number | ReturnType<typeof numberRef> = 0, d: number | ReturnType<typeof numberRef> = 0,
        e: number | ReturnType<typeof numberRef> = 0, f: number | ReturnType<typeof numberRef> = 1, g: number | ReturnType<typeof numberRef> = 0, h: number | ReturnType<typeof numberRef> = 0,
        i: number | ReturnType<typeof numberRef> = 0, j: number | ReturnType<typeof numberRef> = 0, k: number | ReturnType<typeof numberRef> = 1, l: number | ReturnType<typeof numberRef> = 0,
        m: number | ReturnType<typeof numberRef> = 0, n: number | ReturnType<typeof numberRef> = 0, o: number | ReturnType<typeof numberRef> = 0, p: number | ReturnType<typeof numberRef> = 1
    ) {
        this._elements = [
            typeof a === 'number' ? numberRef(a) : a, typeof b === 'number' ? numberRef(b) : b, typeof c === 'number' ? numberRef(c) : c, typeof d === 'number' ? numberRef(d) : d,
            typeof e === 'number' ? numberRef(e) : e, typeof f === 'number' ? numberRef(f) : f, typeof g === 'number' ? numberRef(g) : g, typeof h === 'number' ? numberRef(h) : h,
            typeof i === 'number' ? numberRef(i) : i, typeof j === 'number' ? numberRef(j) : j, typeof k === 'number' ? numberRef(k) : k, typeof l === 'number' ? numberRef(l) : l,
            typeof m === 'number' ? numberRef(m) : m, typeof n === 'number' ? numberRef(n) : n, typeof o === 'number' ? numberRef(o) : o, typeof p === 'number' ? numberRef(p) : p
        ];
    }

    get elements() { return this._elements; }

    // Matrix elements access
    get m00() { return this._elements[0]; }  get m01() { return this._elements[1]; }  get m02() { return this._elements[2]; }  get m03() { return this._elements[3]; }
    get m10() { return this._elements[4]; }  get m11() { return this._elements[5]; }  get m12() { return this._elements[6]; }  get m13() { return this._elements[7]; }
    get m20() { return this._elements[8]; }  get m21() { return this._elements[9]; }  get m22() { return this._elements[10]; } get m23() { return this._elements[11]; }
    get m30() { return this._elements[12]; } get m31() { return this._elements[13]; } get m32() { return this._elements[14]; } get m33() { return this._elements[15]; }

    set m00(value: number | ReturnType<typeof numberRef>) { if (typeof value === 'number') this._elements[0].value = value; else this._elements[0] = value; }
    set m01(value: number | ReturnType<typeof numberRef>) { if (typeof value === 'number') this._elements[1].value = value; else this._elements[1] = value; }
    set m02(value: number | ReturnType<typeof numberRef>) { if (typeof value === 'number') this._elements[2].value = value; else this._elements[2] = value; }
    set m03(value: number | ReturnType<typeof numberRef>) { if (typeof value === 'number') this._elements[3].value = value; else this._elements[3] = value; }
    set m10(value: number | ReturnType<typeof numberRef>) { if (typeof value === 'number') this._elements[4].value = value; else this._elements[4] = value; }
    set m11(value: number | ReturnType<typeof numberRef>) { if (typeof value === 'number') this._elements[5].value = value; else this._elements[5] = value; }
    set m12(value: number | ReturnType<typeof numberRef>) { if (typeof value === 'number') this._elements[6].value = value; else this._elements[6] = value; }
    set m13(value: number | ReturnType<typeof numberRef>) { if (typeof value === 'number') this._elements[7].value = value; else this._elements[7] = value; }
    set m20(value: number | ReturnType<typeof numberRef>) { if (typeof value === 'number') this._elements[8].value = value; else this._elements[8] = value; }
    set m21(value: number | ReturnType<typeof numberRef>) { if (typeof value === 'number') this._elements[9].value = value; else this._elements[9] = value; }
    set m22(value: number | ReturnType<typeof numberRef>) { if (typeof value === 'number') this._elements[10].value = value; else this._elements[10] = value; }
    set m23(value: number | ReturnType<typeof numberRef>) { if (typeof value === 'number') this._elements[11].value = value; else this._elements[11] = value; }
    set m30(value: number | ReturnType<typeof numberRef>) { if (typeof value === 'number') this._elements[12].value = value; else this._elements[12] = value; }
    set m31(value: number | ReturnType<typeof numberRef>) { if (typeof value === 'number') this._elements[13].value = value; else this._elements[13] = value; }
    set m32(value: number | ReturnType<typeof numberRef>) { if (typeof value === 'number') this._elements[14].value = value; else this._elements[14] = value; }
    set m33(value: number | ReturnType<typeof numberRef>) { if (typeof value === 'number') this._elements[15].value = value; else this._elements[15] = value; }

    // Array-like access for compatibility
    get 0() { return this._elements[0]; }  get 1() { return this._elements[1]; }  get 2() { return this._elements[2]; }  get 3() { return this._elements[3]; }
    get 4() { return this._elements[4]; }  get 5() { return this._elements[5]; }  get 6() { return this._elements[6]; }  get 7() { return this._elements[7]; }
    get 8() { return this._elements[8]; }  get 9() { return this._elements[9]; }  get 10() { return this._elements[10]; } get 11() { return this._elements[11]; }
    get 12() { return this._elements[12]; } get 13() { return this._elements[13]; } get 14() { return this._elements[14]; } get 15() { return this._elements[15]; }

    // Convert to plain array for operations
    toArray() {
        return [...this._elements];
    }

    // Clone the matrix
    clone() {
        return new Matrix4D(
            this._elements[0].value, this._elements[1].value, this._elements[2].value, this._elements[3].value,
            this._elements[4].value, this._elements[5].value, this._elements[6].value, this._elements[7].value,
            this._elements[8].value, this._elements[9].value, this._elements[10].value, this._elements[11].value,
            this._elements[12].value, this._elements[13].value, this._elements[14].value, this._elements[15].value
        );
    }

    // Set values
    set(a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number, n: number, o: number, p: number) {
        this._elements[0].value = a; this._elements[1].value = b; this._elements[2].value = c; this._elements[3].value = d;
        this._elements[4].value = e; this._elements[5].value = f; this._elements[6].value = g; this._elements[7].value = h;
        this._elements[8].value = i; this._elements[9].value = j; this._elements[10].value = k; this._elements[11].value = l;
        this._elements[12].value = m; this._elements[13].value = n; this._elements[14].value = o; this._elements[15].value = p;
        return this;
    }

    // Identity matrix
    identity() {
        return this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }

    // Copy from another matrix
    copy(m: Matrix4D) {
        for (let i = 0; i < 16; i++) {
            this._elements[i].value = m.elements[i].value;
        }
        return this;
    }
}

export const matrix4x4Ref = (
    a: number | ReturnType<typeof numberRef> = 1, b: number | ReturnType<typeof numberRef> = 0, c: number | ReturnType<typeof numberRef> = 0, d: number | ReturnType<typeof numberRef> = 0,
    e: number | ReturnType<typeof numberRef> = 0, f: number | ReturnType<typeof numberRef> = 1, g: number | ReturnType<typeof numberRef> = 0, h: number | ReturnType<typeof numberRef> = 0,
    i: number | ReturnType<typeof numberRef> = 0, j: number | ReturnType<typeof numberRef> = 0, k: number | ReturnType<typeof numberRef> = 1, l: number | ReturnType<typeof numberRef> = 0,
    m: number | ReturnType<typeof numberRef> = 0, n: number | ReturnType<typeof numberRef> = 0, o: number | ReturnType<typeof numberRef> = 0, p: number | ReturnType<typeof numberRef> = 1
) => {
    return new Matrix4D(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p);
}
