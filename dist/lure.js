var kd = /* @__PURE__ */ Symbol.for("dom.ts@__registeredCssProperties"), vl = globalThis[kd] ??= /* @__PURE__ */ new Set();
[
  {
    name: "--screen-width",
    syntax: "<length-percentage>",
    inherits: !0,
    initialValue: "0px"
  },
  {
    name: "--screen-height",
    syntax: "<length-percentage>",
    inherits: !0,
    initialValue: "0px"
  },
  {
    name: "--visual-width",
    syntax: "<length-percentage>",
    inherits: !0,
    initialValue: "0px"
  },
  {
    name: "--visual-height",
    syntax: "<length-percentage>",
    inherits: !0,
    initialValue: "0px"
  },
  {
    name: "--clip-ampl",
    syntax: "<number>",
    inherits: !0,
    initialValue: "0"
  },
  {
    name: "--clip-freq",
    syntax: "<number>",
    inherits: !0,
    initialValue: "0"
  },
  {
    name: "--avail-width",
    syntax: "<length-percentage>",
    inherits: !0,
    initialValue: "0px"
  },
  {
    name: "--avail-height",
    syntax: "<length-percentage>",
    inherits: !0,
    initialValue: "0px"
  },
  {
    name: "--pixel-ratio",
    syntax: "<number>",
    inherits: !0,
    initialValue: "1"
  },
  {
    name: "--percent",
    syntax: "<number>",
    inherits: !0,
    initialValue: "0"
  },
  {
    name: "--percent-x",
    syntax: "<number>",
    inherits: !0,
    initialValue: "0"
  },
  {
    name: "--percent-y",
    syntax: "<number>",
    inherits: !0,
    initialValue: "0"
  },
  {
    name: "--scroll-left",
    syntax: "<number>",
    inherits: !0,
    initialValue: "0"
  },
  {
    name: "--scroll-top",
    syntax: "<number>",
    inherits: !0,
    initialValue: "0"
  },
  {
    name: "--drag-x",
    syntax: "<length>",
    inherits: !1,
    initialValue: "0px"
  },
  {
    name: "--drag-y",
    syntax: "<length>",
    inherits: !1,
    initialValue: "0px"
  },
  {
    name: "--grid-r",
    syntax: "<number>",
    inherits: !1,
    initialValue: "0"
  },
  {
    name: "--grid-c",
    syntax: "<number>",
    inherits: !1,
    initialValue: "0"
  },
  {
    name: "--resize-x",
    syntax: "<length>",
    inherits: !1,
    initialValue: "0px"
  },
  {
    name: "--resize-y",
    syntax: "<length>",
    inherits: !1,
    initialValue: "0px"
  },
  {
    name: "--shift-x",
    syntax: "<length>",
    inherits: !1,
    initialValue: "0px"
  },
  {
    name: "--shift-y",
    syntax: "<length>",
    inherits: !1,
    initialValue: "0px"
  },
  {
    name: "--cs-grid-r",
    syntax: "<number>",
    inherits: !1,
    initialValue: "0"
  },
  {
    name: "--cs-grid-c",
    syntax: "<number>",
    inherits: !1,
    initialValue: "0"
  },
  {
    name: "--cs-p-grid-r",
    syntax: "<number>",
    inherits: !1,
    initialValue: "0"
  },
  {
    name: "--cs-p-grid-c",
    syntax: "<number>",
    inherits: !1,
    initialValue: "0"
  },
  {
    name: "--os-grid-r",
    syntax: "<number>",
    inherits: !1,
    initialValue: "0"
  },
  {
    name: "--os-grid-c",
    syntax: "<number>",
    inherits: !1,
    initialValue: "0"
  },
  {
    name: "--rv-grid-r",
    syntax: "<number>",
    inherits: !1,
    initialValue: "0"
  },
  {
    name: "--rv-grid-c",
    syntax: "<number>",
    inherits: !1,
    initialValue: "0"
  },
  {
    name: "--cell-x",
    syntax: "<integer>",
    inherits: !1,
    initialValue: "0"
  },
  {
    name: "--cell-y",
    syntax: "<integer>",
    inherits: !1,
    initialValue: "0"
  }
].forEach((e) => {
  if (typeof CSS > "u" || typeof CSS?.registerProperty != "function") return;
  const t = String(e?.name || "").trim();
  if (!(!t || vl.has(t)))
    try {
      CSS.registerProperty(e);
    } catch (n) {
      String(n?.name || "").toLowerCase() !== "invalidmodificationerror" && console.warn(n);
    } finally {
      vl.add(t);
    }
});
var Uc = /* @__PURE__ */ Symbol.for("@fix"), ci = (e) => Array.isArray(e) || e instanceof Set || e instanceof Map, L = (e) => typeof e == "string" || typeof e == "number" || typeof e == "boolean" || typeof e == "bigint" || typeof e > "u" || e == null, xt = (e, t) => L(e) ? t == "number" ? Number(e) || 0 : t == "string" ? String(e) || "" : t == "boolean" ? !!e : e : null, oa = (e, t = "value") => (typeof e == "object" || typeof e == "function") && e != null && (t in e || e?.[t] != null), ne = (e) => oa(e, "value"), Be = (e) => L(e) ? e : ne(e) ? e?.value : e, me = (e, t) => e?.[Uc] ?? e ?? t ?? t, pe = (e) => e != null && (typeof e == "object" || typeof e == "function") && (e instanceof WeakRef || typeof e?.deref == "function") ? pe(e?.deref?.()) : e, Ed = (e) => {
  if (typeof e == "function" || e == null) return e;
  const t = function() {
  };
  return t[Uc] = e, t;
}, aa = (e, t, n) => (e = pe(e), e != null && (typeof e == "object" || typeof e == "function") ? e[t] = Be(n = pe(n)) : e), Cd = (e) => crypto?.getRandomValues ? crypto?.getRandomValues?.(e) : (() => {
  const t = new Uint8Array(e.length);
  for (let n = 0; n < e.length; n++) t[n] = Math.floor(Math.random() * 256);
  return t;
})(), gl = (e, t, n) => Math.max(e, Math.min(t, n)), bl = (e, t) => typeof t == "function" ? t?.bind?.(e) ?? t : t, Z = () => crypto?.randomUUID ? crypto?.randomUUID?.() : "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (e) => (+e ^ Cd?.(/* @__PURE__ */ new Uint8Array(1))?.[0] & 15 >> +e / 4).toString(16)), Qr = (e) => e && e?.replace?.(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(), Vc = (e) => e && e?.replace?.(/-([a-z])/g, (t, n) => n.toUpperCase()), Pd = (e) => typeof CSSStyleValue < "u" && e instanceof CSSStyleValue, Ad = (e) => e != null && (typeof e == "boolean" ? e !== !1 : !0) && typeof e != "object" && typeof e != "function", Ot = (e) => typeof e == "boolean" ? e ? "" : null : typeof e == "number" ? String(e) : e, Zn = /* @__PURE__ */ Symbol.for("@trigger-lock"), _t = (e, t, n = "value") => {
  oa(e, n) && (e[Zn] = !0);
  let r;
  try {
    r = t?.();
  } finally {
    oa(e, n) && delete e[Zn];
  }
  return r;
}, qc = (e) => {
  if (typeof e != "string") return null;
  const t = [...e?.matchAll?.(/^\d+(\.\d+)?$/g)];
  if (t?.length != 1) return null;
  const n = parseFloat(t[0][0]);
  return !Number.isNaN(n) && Number.isFinite(n) ? n : null;
}, Td = /^\d+$/g, Md = (e) => {
  if (typeof e != "string" || (e = e?.trim?.(), e == "" || e == null)) return null;
  const t = [...e?.matchAll?.(Td)];
  if (t?.length != 1) return null;
  const n = parseInt(t[0][0]);
  return !Number.isNaN(n) && Number.isInteger(n) ? n : null;
}, Rd = (e) => typeof e == "string" ? Md(e) != null : typeof e == "number" && Number.isInteger(e) && e >= 0, Od = (e) => Array.isArray(e) || e != null && typeof e == "object" && typeof e[Symbol.iterator] == "function", la = (e, t, n) => {
  e = e instanceof WeakRef ? e.deref() : e;
  const r = [...Object.entries(n)].map?.(([i, s]) => e?.[t]?.call?.(e, i, s));
  return () => {
    r?.forEach?.((i) => i?.());
  };
}, Gc = (e) => e instanceof WeakRef || typeof e?.deref == "function", Id = (e) => Gc(e) ? pe(e) : e, Ye = (e) => e != null ? Gc(e) ? e : typeof e == "function" || typeof e == "object" ? new WeakRef(e) : e : e, ct = (e) => (typeof e == "object" || typeof e == "function") && (e?.value != null || e != null && "value" in e), Nt = (e) => e != null && (typeof e == "object" || typeof e == "function"), Xc = (e) => ne(e) ? e?.value : e, Nd = (e, t) => e instanceof Promise || typeof e?.then == "function" ? e?.then?.(t) : t?.(e), zd = (e, t) => e instanceof Promise || typeof e?.then == "function" ? e?.then?.(t) : t?.(e), ds = function(e) {
  return (t) => {
    e[Zn] = !0;
    let n;
    try {
      n = t?.();
    } finally {
      e[Zn] = !1;
    }
    return n;
  };
}, Yc = (e) => Array.isArray(e) ? e?.flatMap?.((t) => Array.isArray(t) ? Yc(t) : t) : e, $a = (e) => Yc(e)?.every?.(Zt), Zt = (e) => L(e) || typeof SharedArrayBuffer == "function" && e instanceof SharedArrayBuffer || Ld(e) || Array.isArray(e) && $a(e), Ld = (e) => ArrayBuffer.isView(e) && !(e instanceof DataView), ca = (e) => L(e) || typeof ArrayBuffer == "function" && e instanceof ArrayBuffer || typeof MessagePort == "function" && e instanceof MessagePort || typeof ReadableStream == "function" && e instanceof ReadableStream || typeof WritableStream == "function" && e instanceof WritableStream || typeof TransformStream == "function" && e instanceof TransformStream || typeof ImageBitmap == "function" && e instanceof ImageBitmap || typeof VideoFrame == "function" && e instanceof VideoFrame || typeof OffscreenCanvas == "function" && e instanceof OffscreenCanvas || typeof RTCDataChannel == "function" && e instanceof RTCDataChannel || typeof AudioData == "function" && e instanceof AudioData || typeof WebTransportReceiveStream == "function" && e instanceof WebTransportReceiveStream || typeof WebTransportSendStream == "function" && e instanceof WebTransportSendStream || typeof WebTransportReceiveStream == "function" && e instanceof WebTransportReceiveStream, $d = (e) => {
  switch (typeof e) {
    case "number":
      return 0;
    case "string":
      return "";
    case "boolean":
      return !1;
    case "object":
      return null;
    case "function":
      return null;
    case "symbol":
      return null;
    case "bigint":
      return 0n;
  }
}, Dd = (e) => typeof e?.[Symbol.iterator] == "function", or = (e) => [
  "symbol",
  "string",
  "number"
].indexOf(typeof e) >= 0, Fd = (e) => e != null && (typeof e == "function" || typeof e == "object") && !(e instanceof WeakRef), Wd = (e, t) => Hd.getOrInsert(e, /* @__PURE__ */ new WeakMap()).getOrInsert(t, t?.bind?.(e)), Cn = (e, t) => (typeof t == "function" ? Wd(e, t) : t) ?? t, Di = (e, t, n, r) => {
  if (t == Symbol.iterator) return Da(e, n, r);
  if (t == null || typeof t == "symbol" || typeof t == "object" || typeof t == "function") return;
  const i = (s, ...o) => {
    if (s != null) return n?.(s, ...o);
  };
  if (e instanceof Map || e instanceof WeakMap) {
    if (e.has(t)) return i?.(e.get(t), t, null, "@set");
  } else if (e instanceof Set || e instanceof WeakSet) {
    if (e.has(t)) return i?.(t, t, null, "@add");
  } else if (Array.isArray(e) && typeof t == "string" && [...t?.matchAll?.(/^\d+$/g)].length == 1 && Number.isInteger(typeof t == "string" ? parseInt(t) : t)) {
    const s = typeof t == "string" ? parseInt(t) : t;
    return i?.(e?.[s], s, null, "@add");
  } else if (typeof e == "function" || typeof e == "object") return i?.(e?.[t], t, null, "@set");
}, Da = (e, t, n) => {
  if (e == null) return;
  let r = [];
  if (e instanceof Set || e instanceof Map || typeof e?.keys == "function") return [...e?.keys?.() || r].forEach?.((i) => Di(e, i, t, n));
  if (Array.isArray(e) || Dd(e)) return [...e].forEach?.((i, s) => Di(e, s, t, n));
  if (typeof e == "object" || typeof e == "function") return [...Object.keys(e) || r].forEach?.((i) => Di(e, i, t, n));
}, xe = (e, t) => e == null && t == null ? !1 : e == null || t == null ? !0 : typeof e == "boolean" && typeof t == "boolean" ? e != t : typeof e == "number" && typeof t == "number" ? !(e == t || Math.abs(e - t) < 1e-9) : typeof e == "string" && typeof t == "string" ? e != "" && t != "" && e != t || e !== t : typeof e != typeof t ? e !== t : e && t && e != t || e !== t, Kc = /* @__PURE__ */ Symbol.for("object.boundCtx");
globalThis[Kc] ??= /* @__PURE__ */ new WeakMap();
var Hd = globalThis[Kc], ua = (e, t) => {
  const n = e == null || e < 0 || typeof e != "number" || e == Symbol.iterator || (t != null ? e >= (t?.length || 0) : !1);
  return t != null ? Array.isArray(t) && n : !1;
}, Bd = /* @__PURE__ */ new WeakMap(), jd = (e, t) => typeof e?.[t] == "function" ? e?.[t]?.bind?.(e) : e?.[t], en = (e, t, n) => {
  if (Array.isArray(e))
    return e.every(Zt) ? e.map(t) : e.map((r, i) => en(r, t, [e, i]));
  if (e instanceof Map) {
    const r = Array.from(e.entries());
    return r.map(([i, s]) => s).every(Zt) ? new Map(r.map(([i, s]) => [i, t(s, i, e)])) : new Map(r.map(([i, s]) => [i, en(s, t, [e, i])]));
  }
  if (e instanceof Set) {
    const r = Array.from(e.entries()), i = r.map(([s, o]) => o);
    return r.every(Zt) ? new Set(i.map(t)) : new Set(i.map((s) => en(s, t, [e, s])));
  }
  if (typeof e == "object" && e?.constructor == Object && Object.prototype.toString.call(e) == "[object Object]") {
    const r = Array.from(Object.entries(e));
    return r.map(([i, s]) => s).every(Zt) ? Object.fromEntries(r.map(([i, s]) => [i, t(s, i, e)])) : Object.fromEntries(r.map(([i, s]) => [i, en(s, t, [e, i])]));
  }
  return t(e, n?.[1] ?? "", n?.[0] ?? null);
}, wl = (e, t, n) => {
  if (e?.[t] != null) {
    const r = e[t];
    return Array.isArray(n) ? r.add(...n) : typeof n == "function" && r.add(n), e;
  }
  return e[t] ??= Array.isArray(n) ? new Set(n) : typeof n == "function" ? /* @__PURE__ */ new Set([n]) : n, e;
}, Ut = /* @__PURE__ */ new WeakMap(), Sl = /* @__PURE__ */ new WeakMap(), st = (e, t) => e instanceof Promise || typeof e?.then == "function" ? Ut?.has?.(e) ? t(Ut?.get?.(e)) : Promise.try?.(async () => {
  const n = await e;
  return Ut?.set?.(e, n), n;
})?.then?.(t) : t(e), Ud = class {
  #e;
  #t;
  constructor(e, t) {
    this.#e = e, this.#t = t;
  }
  defineProperty(e, t, n) {
    return me(e) instanceof Promise ? Reflect.defineProperty(e, t, n) : st(me(e), (r) => Reflect.defineProperty(r, t, n));
  }
  deleteProperty(e, t) {
    return me(e) instanceof Promise ? Reflect.deleteProperty(e, t) : st(me(e), (n) => Reflect.deleteProperty(n, t));
  }
  getPrototypeOf(e) {
    return me(e) instanceof Promise ? Reflect.getPrototypeOf(e) : st(me(e), (t) => Reflect.getPrototypeOf(t));
  }
  setPrototypeOf(e, t) {
    return me(e) instanceof Promise ? Reflect.setPrototypeOf(e, t) : st(me(e), (n) => Reflect.setPrototypeOf(n, t));
  }
  isExtensible(e) {
    return me(e) instanceof Promise ? Reflect.isExtensible(e) : st(me(e), (t) => Reflect.isExtensible(t));
  }
  preventExtensions(e) {
    return me(e) instanceof Promise ? Reflect.ownKeys(e) : st(me(e), (t) => Reflect.preventExtensions(t));
  }
  ownKeys(e) {
    const t = me(e);
    return t instanceof Promise ? Object.keys(t) : st(t, (n) => (typeof n == "object" || typeof n == "function") && n != null ? Object.keys(n) : []) ?? [];
  }
  getOwnPropertyDescriptor(e, t) {
    return me(e) instanceof Promise ? Reflect.getOwnPropertyDescriptor(e, t) : st(me(e), (n) => Reflect.getOwnPropertyDescriptor(n, t));
  }
  construct(e, t, n) {
    return st(me(e), (r) => Reflect.construct(r, t, n));
  }
  has(e, t) {
    return me(e) instanceof Promise ? Reflect.has(e, t) : st(me(e), (n) => Reflect.has(n, t));
  }
  get(e, t, n) {
    if (e = me(e), t == "promise") return e;
    if (t == "resolve" && this.#e) return (...i) => {
      const s = this.#e?.(...i);
      return this.#e = null, s;
    };
    if (t == "reject" && this.#t) return (...i) => {
      const s = this.#t?.(...i);
      return this.#t = null, s;
    };
    if (t == "then" || t == "catch" || t == "finally") {
      if (e instanceof Promise) return e?.[t]?.bind?.(e);
      {
        const i = Promise.try(() => e);
        return i?.[t]?.bind?.(i);
      }
    }
    let r;
    return Ut?.has?.(e) && (r = Ut?.get?.(e))?.[t] != null ? r = Ut?.get?.(e)?.[t] : r = Bi(st(e, async (i) => {
      if (me(i) instanceof Promise) return Reflect.get(i, t, n);
      if (L(i)) return t == Symbol.toPrimitive || t == Symbol.toStringTag ? i : void 0;
      let s;
      try {
        s = Reflect.get(i, t, n);
      } catch {
        s = e?.[t];
      }
      return typeof s == "function" ? s?.bind?.(i) : s;
    })), t == Symbol.toStringTag ? L(r) ? String(r ?? "") || "" : r?.[Symbol.toStringTag]?.() || String(r ?? "") || "" : t == Symbol.toPrimitive ? (i) => {
      if (L(r)) return xt(r, i);
    } : r;
  }
  set(e, t, n) {
    return st(me(e), (r) => Reflect.set(r, t, n));
  }
  apply(e, t, n) {
    if (this.#e) {
      const r = this.#e?.(...n);
      return this.#e = null, r;
    }
    return st(me(e, this.#e), (r) => {
      if (typeof r == "function")
        return me(r) instanceof Promise, Reflect.apply(r, t, n);
    });
  }
};
function Bi(e, t, n) {
  return e instanceof Promise || typeof e?.then == "function" ? Ut?.has?.(e) ? Ut?.get?.(e) : (Sl?.has?.(e) || e?.then?.((r) => Ut?.set?.(e, r)), Sl?.getOrInsertComputed?.(e, () => new Proxy(Ed(e), new Ud(t, n)))) : e;
}
var Ds = /* @__PURE__ */ new WeakMap(), Vd = class {
  _deref(e) {
    return e instanceof WeakRef || typeof e?.deref == "function" ? e?.deref?.() : e;
  }
  get(e, t, n) {
    const r = this._deref(e), i = r?.[t];
    return (t == "element" || t == "value") && r && (i == null || !(t in r)) ? r : t == "deref" ? () => this._deref(e) : typeof i == "function" ? (...s) => this._deref(e)?.[t]?.(...s) : i;
  }
  set(e, t, n, r) {
    const i = this._deref(e);
    return i ? Reflect.set(i, t, n) : !0;
  }
  has(e, t) {
    const n = this._deref(e);
    return n ? t in n : !1;
  }
  ownKeys(e) {
    const t = this._deref(e);
    return t ? Reflect.ownKeys(t) : [];
  }
  getOwnPropertyDescriptor(e, t) {
    const n = this._deref(e);
    if (n)
      return Object.getOwnPropertyDescriptor(n, t);
  }
  deleteProperty(e, t) {
    const n = this._deref(e);
    return n ? Reflect.deleteProperty(n, t) : !0;
  }
  defineProperty(e, t, n) {
    const r = this._deref(e);
    return r ? Reflect.defineProperty(r, t, n) : !0;
  }
  getPrototypeOf(e) {
    const t = this._deref(e);
    return t ? Object.getPrototypeOf(t) : null;
  }
  setPrototypeOf(e, t) {
    const n = this._deref(e);
    return n ? Reflect.setPrototypeOf(n, t) : !0;
  }
  isExtensible(e) {
    const t = this._deref(e);
    return t ? Reflect.isExtensible(t) : !1;
  }
  preventExtensions(e) {
    const t = this._deref(e);
    return t ? Reflect.preventExtensions(t) : !0;
  }
};
function Jc(e) {
  if (!(typeof e == "object" || typeof e == "function") || typeof e == "symbol") return e;
  const t = e instanceof WeakRef || typeof e?.deref == "function";
  if (e = t ? e?.deref?.() : e, e != null && Ds.has(e)) return Ds.get(e);
  const n = new Vd(), r = new Proxy(t ? e : new WeakRef(e), n);
  return Ds.set(e, r), r;
}
var fa = (e, t, n = 0) => {
  const r = [...t], i = [...e];
  return n % 2 && (i.reverse(), r.reverse()), [(n == 0 || n == 3 ? i[0] : r[0] - i[0]) || 0, (n == 0 || n == 1 ? i[1] : r[1] - i[1]) || 0];
}, Fa = (e) => {
  const t = String(e ?? "").trim();
  return t ? (t.startsWith("/") ? t : `/${t}`).replace(/\/+/g, "/") : "/";
}, qd = (e) => {
  const t = Fa(e);
  return t === "/user" || t.startsWith("/user/");
}, yt = (e) => {
  const t = Fa(e);
  return t === "/user" ? "/" : t.startsWith("/user/") ? t.slice(5) || "/" : t;
}, Gd = (e) => {
  const t = Fa(e), n = yt(t);
  return qd(t) ? Array.from(/* @__PURE__ */ new Set([n, t])) : [n];
}, Xd = () => ({
  didTimeout: !1,
  timeRemaining: () => 0
}), xl = (e, t = 1e3) => typeof globalThis.requestIdleCallback == "function" ? globalThis.requestIdleCallback(e, { timeout: t }) : setTimeout(() => e(Xd()), 0), Wa = () => {
  const e = {
    canceled: !1,
    rAFs: /* @__PURE__ */ new Set(),
    last: null,
    cancel() {
      return this.canceled = !0, cancelAnimationFrame(this.last), this;
    },
    shedule(t) {
      return this.rAFs.add(t), this;
    }
  };
  return (async () => {
    for (; !e?.canceled; )
      await Promise.all((e?.rAFs?.values?.() ?? [])?.map?.((t) => Promise.try(t)?.catch?.(console.warn.bind(console)))), e.rAFs?.clear?.(), typeof requestAnimationFrame < "u" ? await new Promise((t) => {
        e.last = requestAnimationFrame(t);
      }) : await new Promise((t) => {
        setTimeout(t, 16);
      });
  })(), e;
}, Yd = (e = Wa()) => (t) => e.shedule(t), hs = typeof document < "u" ? document?.documentElement : null, Kd = (e, t = {}) => {
  if (!(!t || typeof t != "object" || !e))
    return Array.from(Object.entries(t)).map(([n, r]) => {
      const i = e.getAttribute(n);
      r == null ? e.removeAttribute(n) : r != i && e.setAttribute(n, i == "" ? r ?? i : i ?? r);
    });
}, Jd = /* @__PURE__ */ new Map(), ps = (e, t = 1e3, ...n) => {
  const r = {
    running: !0,
    cancel: () => {
      r.running = !1;
    }
  };
  return xl(async () => {
    if (!(!e || typeof e != "function")) {
      for (; r.running; )
        await Promise.all([Promise.try(e, ...n), new Promise((i) => setTimeout(i, t))]).catch?.(console.warn.bind(console)), await Promise.any([new Promise((i) => xl(i, t)), new Promise((i) => setTimeout(i, t))]);
      r.cancel = () => {
      };
    }
  }, { timeout: t }), r?.cancel;
};
typeof requestAnimationFrame < "u" && requestAnimationFrame(async () => {
  for (; ; )
    Jd.forEach((e) => e?.()), await new Promise((e) => requestAnimationFrame(e));
});
var ji = /* @__PURE__ */ Symbol("@border-box-width"), Ui = /* @__PURE__ */ Symbol("@border-box-height"), Vi = /* @__PURE__ */ Symbol("@content-box-width"), qi = /* @__PURE__ */ Symbol("@content-box-height"), _l = /* @__PURE__ */ new WeakMap(), kl = /* @__PURE__ */ new WeakMap(), Qd = (e, t = () => {
}) => {
  if (e instanceof HTMLElement && !kl.has(e)) {
    e[Vi] = e.clientWidth, e[qi] = e.clientHeight;
    const n = new ResizeObserver((r) => {
      for (const i of r) if (i.contentBoxSize) {
        const s = i.contentBoxSize[0];
        s && (e[Vi] = Math.min(s.inlineSize, e.clientWidth), e[qi] = Math.min(s.blockSize, e.clientHeight), t?.(e));
      }
    });
    kl.set(e, n), n.observe(e?.element ?? e, { box: "content-box" });
  }
}, Zd = (e, t = () => {
}) => {
  if (e instanceof HTMLElement && !_l.has(e)) {
    e[ji] = e.offsetWidth, e[Ui] = e.offsetHeight;
    const n = new ResizeObserver((r) => {
      for (const i of r) if (i.borderBoxSize) {
        const s = i.borderBoxSize[0];
        s && (e[ji] = Math.min(s.inlineSize, e.offsetWidth), e[Ui] = Math.min(s.blockSize, e.offsetHeight), t?.(e));
      }
    });
    _l.set(e, n), n.observe(e?.element ?? e, { box: "border-box" });
  }
}, ln = (e, t, n) => {
  t != null && e.checked != t && (e?.type == "checkbox" || e?.type == "radio" && !e?.checked ? (e?.click?.(), n?.preventDefault?.()) : (e.checked = !!t, e?.dispatchEvent?.(new Event("change", {
    bubbles: !0,
    cancelable: !0
  }))));
}, te = (e) => e != null && e instanceof HTMLElement && !(e instanceof DocumentFragment || e instanceof HTMLBodyElement) ? e : null, Qc = (e, t) => e == null || t == null ? -1 : Array.from(e?.childNodes ?? [])?.indexOf?.(t) ?? -1;
var eh = (e) => {
  if (e == ":fragment:") return document.createDocumentFragment();
  const t = document.createElement.bind(document);
  for (var n = t("div"), r, i = ""; e && (r = e.match(`^(?:(-?[_a-zA-Z]+[_a-zA-Z0-9-]*))|^#(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)|^\\.(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)|^\\[(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)(?:([*$|~^]?=)(["'])((?:(?=(\\\\?))\\8.)*?)\\6)?\\]`)); )
    r[1] && (n = t(r[1])), r[2] && (n.id = r[2]), r[3] && (i += " " + r[3]), r[4] && n.setAttribute(r[4], r[7] || ""), e = e.slice(r[0].length);
  return i && (n.className = i.slice(1)), n;
}, _e = (e) => e != null && (e instanceof Node || e instanceof Text || e instanceof Element || e instanceof Comment || e instanceof HTMLElement || e instanceof DocumentFragment) ? e : null, Fs = (e, t) => e.querySelector(t) ?? (e.matches(t) ? e : null), Ws = (e, t) => {
  for (; e; ) {
    if (!(e?.element ?? e)) return !1;
    if ((e?.element ?? e) === (t?.element ?? t)) return !0;
    e = e.parentElement ?? (e.parentNode == e?.getRootNode?.({ composed: !0 }) ? e?.getRootNode?.({ composed: !0 })?.host : e?.parentNode);
  }
}, Zc = {};
function T(e, t, n, r = Zc) {
  e?.addEventListener?.(t, n, r);
  const i = typeof e == "object" || typeof e == "function" && !e?.deref ? new WeakRef(e) : e;
  return () => i?.deref?.()?.removeEventListener?.(t, n, r);
}
function xn(e, t, n, r = Zc) {
  e?.removeEventListener?.(t, n, r);
}
var kt = (e, t) => (e = e instanceof WeakRef ? e.deref() : e, [...Object.entries(t)].map?.(([n, r]) => Array.isArray(r) ? T(e, n, ...r) : T(e, n, r))), th = (e, t) => {
  if (t) {
    let n = t;
    return t instanceof Map ? n = [...t.entries()] : n = [...Object.entries(t)], n.map(([r, i]) => ((Od(i) ? [...i] : i) ?? [])?.map?.((s) => T(e, r, s)));
  }
}, Hn = (e, t) => (e = e instanceof WeakRef ? e.deref() : e, [...Object.entries(t)].map?.(([n, r]) => Array.isArray(r) ? xn(e, n, ...r) : xn(e, n, r))), nh = (e) => {
  if (!e) return null;
  if (e?.composedPath && typeof e.composedPath == "function") {
    const n = e.composedPath();
    for (const r of n) if (r instanceof HTMLElement || r instanceof Element) return r;
  }
  const t = e?.target;
  return t instanceof HTMLElement || t instanceof Element ? t : null;
}, ui = (e, t, n) => {
  if (t == null || !(t instanceof Node) && t?.element == null) return !1;
  if (e == t || (e?.element ?? e) == (t?.element ?? t)) return !0;
  if (n?.composedPath && typeof n.composedPath == "function") {
    const r = n.composedPath(), i = e?.element ?? e, s = t?.element ?? t;
    if (r.includes(i) && r.includes(s)) {
      const o = r.indexOf(i), a = r.indexOf(s);
      if (a >= 0 && o >= 0 && a < o) return !0;
    }
  }
  return !!(e?.contains?.(t?.element ?? t) || e?.getRootNode({ composed: !0 })?.host == (t?.element ?? t));
}, Dr = (e, t, n) => {
  if (n?.composedPath && typeof n.composedPath == "function") {
    const a = n.composedPath();
    for (const l of a) if ((l instanceof HTMLElement || l instanceof Element) && l.matches?.(t))
      return l;
  }
  const r = e?.matches?.(t) ? e : null, i = (e?.getRootNode({ composed: !0 }) ?? e?.parentElement?.getRootNode({ composed: !0 }))?.host, s = i?.matches?.(t) ? i : null, o = e?.closest?.(t) ?? r?.closest?.(t) ?? s?.closest?.(t) ?? null;
  return r ?? o ?? s;
}, da = (e, t, n = "parent") => {
  if (!e || e.checkVisibility && !e.checkVisibility({
    checkOpacity: !0,
    checkVisibilityCSS: !0
  }) || !e.checkVisibility && e.offsetParent === null && e.style.position !== "fixed") return !1;
  let r = document.activeElement;
  for (; r && r.shadowRoot && r.shadowRoot.activeElement; ) r = r.shadowRoot.activeElement;
  const i = r === e || Ws(r, e), s = e.matches(":hover");
  if (!i && !s && !t) return !1;
  if (t) {
    if (typeof t == "string") {
      if (n === "parent") return !!Dr(e, t);
      {
        const o = i ? r : e.querySelector(":hover") || e, a = !!Dr(o, t);
        return e?.querySelector?.(t) != null || e?.matches?.(t) || a;
      }
    } else if (t instanceof HTMLElement) return n === "parent" ? Ws(e, t) || !1 : Ws(t, e) || !1;
  }
  return !0;
}, rh = /* @__PURE__ */ Symbol.for("dom.ts@zoomValues"), ih = globalThis[rh] ??= /* @__PURE__ */ new WeakMap(), sh = (e = document.documentElement) => ih.getOrInsertComputed(e, () => {
  const t = (e?.matches?.(".ui-orientbox") ? e : null) || e?.closest?.(".ui-orientbox") || document.body;
  if (t?.zoom) return t?.zoom || 1;
  if (e?.currentCSSZoom) return e?.currentCSSZoom || 1;
}), oh = (e = document.documentElement) => (e?.currentCSSZoom != null ? 1 : sh(e)) || 1, ah = (e = document.documentElement) => (e?.currentCSSZoom == null ? 1 : e?.currentCSSZoom) || 1, Pn = (e = document.documentElement) => {
  const t = (e?.matches?.('[orient], [data-mixin="ui-orientbox"]') ? e : null) || e?.closest?.('[orient], [data-mixin="ui-orientbox"]') || e;
  if (t?.hasAttribute?.("orient")) return parseInt(t?.getAttribute?.("orient") || "0") || 0;
  if (t?.orient != null && Number.isFinite(Number(t.orient))) return Number(t.orient) || 0;
  try {
    const n = t?.style?.getPropertyValue?.("--orient") || (typeof getComputedStyle == "function" && t ? getComputedStyle(t).getPropertyValue("--orient") : "") || "", r = parseInt(String(n).trim(), 10);
    if (Number.isFinite(r)) return r;
  } catch {
  }
  return 0;
}, Fr = (e, t = null) => {
  const n = ah(e) || 1, r = e?.getBoundingClientRect?.(), i = {
    left: r?.left / n,
    right: r?.right / n,
    top: r?.top / n,
    bottom: r?.bottom / n,
    width: r?.width / n,
    height: r?.height / n
  }, s = t ?? (Pn(e) || 0), o = typeof window < "u" ? window.visualViewport : null, a = [((o?.width ?? document.documentElement?.clientWidth ?? window.innerWidth) || 1) / n, ((o?.height ?? document.documentElement?.clientHeight ?? window.innerHeight) || 1) / n], [l, c] = fa([i.left, i.top], a, s), [u, d] = fa([i.right, i.bottom], a, s), [p, f] = s == 0 || s == 3 ? [l, u] : [u, l], [h, y] = s == 0 || s == 1 ? [c, d] : [d, c], [b, m] = s % 2 ? [i.height, i.width] : [i.width, i.height];
  return {
    left: p,
    top: h,
    right: f,
    bottom: y,
    width: b,
    height: m
  };
}, lh = (e, t = null) => (t ?? Pn(e)) % 2 ? e[Ui] ?? e?.clientHeight : e[ji] ?? e?.clientWidth, ch = (e, t = null) => (t ?? Pn(e)) % 2 ? e[ji] ?? e?.clientWidth : e[Ui] ?? e?.clientHeight, uh = (e, t = null) => (t ?? Pn(e)) % 2 ? e[qi] ?? e?.clientHeight : e[Vi] ?? e?.clientWidth, fh = (e, t = null) => (t ?? Pn(e)) % 2 ? e[Vi] ?? e?.clientWidth : e[qi] ?? e?.clientHeight, dh = (e, t = 100) => typeof globalThis.requestIdleCallback == "function" ? globalThis.requestIdleCallback(e, { timeout: t }) : setTimeout(() => e({
  didTimeout: !1,
  timeRemaining: () => 0
}), 0), eu = () => {
  const e = typeof matchMedia < "u" ? matchMedia("(orientation: landscape)")?.matches : !1, t = typeof window < "u" ? window.visualViewport : null, n = t ? {
    "--vv-width": `${t.width}px`,
    "--vv-height": `${t.height}px`,
    "--vv-offset-left": `${t.offsetLeft}px`,
    "--vv-offset-top": `${t.offsetTop}px`,
    "--vv-scale": String(t.scale ?? 1)
  } : {
    "--vv-width": typeof window < "u" ? `${window.innerWidth}px` : "0px",
    "--vv-height": typeof window < "u" ? `${window.innerHeight}px` : "0px",
    "--vv-offset-left": "0px",
    "--vv-offset-top": "0px",
    "--vv-scale": "1"
  };
  if (typeof screen < "u") {
    const r = screen?.availWidth + "px", i = screen?.availHeight + "px";
    return {
      "--screen-width": Math.min(screen?.width, screen?.availWidth) + "px",
      "--screen-height": Math.min(screen?.height, screen?.availHeight) + "px",
      "--avail-width": e ? i : r,
      "--avail-height": e ? r : i,
      "--view-height": Math.min(screen?.availHeight, window?.innerHeight) + "px",
      "--pixel-ratio": String(devicePixelRatio || 1),
      ...n
    };
  }
  return {
    "--screen-width": "0px",
    "--screen-height": "0px",
    "--avail-width": "0px",
    "--avail-height": "0px",
    "--view-height": "0px",
    "--pixel-ratio": "1",
    ...n
  };
}, El = eu(), Cl = {
  "portrait-primary": 0,
  "landscape-primary": 1,
  "portrait-secondary": 2,
  "landscape-secondary": 3
}, hh = (e) => {
  const t = document.documentElement;
  Object.assign(El, eu()), Object.entries(El).forEach(([n, r]) => {
    const i = t?.style?.getPropertyValue(n);
    (!i || i != r) && t?.style?.setProperty?.(n, r || "", "");
  }), document.documentElement.style.setProperty("--orientation-secondary", screen?.orientation?.type?.endsWith?.("secondary") ? "1" : "0");
}, Pl = () => {
  let e = screen?.orientation?.type || "portrait-primary";
  return globalThis.matchMedia("((display-mode: fullscreen) or (display-mode: standalone) or (display-mode: window-controls-overlay))").matches || (matchMedia("(orientation: portrait)").matches ? e = e.replace("landscape", "portrait") : matchMedia("(orientation: landscape)").matches && (e = e.replace("portrait", "landscape"))), e;
}, Hs = { passive: !0 }, ph = (e) => {
  let t = !1;
  const n = () => {
    t || (requestAnimationFrame(() => {
      hh(), e(), t = !1;
    }), t = !0);
  }, r = [];
  return r.push(T(navigator?.virtualKeyboard, "geometrychange", n, Hs)), r.push(T(window?.visualViewport, "scroll", n, Hs)), r.push(T(window?.visualViewport, "resize", n, Hs)), r.push(T(screen?.orientation, "change", n)), r.push(T(window, "resize", n)), r.push(T(document?.documentElement, "fullscreenchange", n)), r.push(T(document, "DOMContentLoaded", n)), r.push(T(matchMedia("(orientation: portrait)"), "change", n)), r.push(T(matchMedia("(orientation: landscape)"), "change", n)), n(), dh(() => n(), 100), () => r.forEach((i) => i());
}, ww = new OffscreenCanvas(1, 1).getContext("2d"), yh = /* @__PURE__ */ Symbol.for("dom.ts@onBorderObserve"), Sw = globalThis[yh] ??= /* @__PURE__ */ new WeakMap(), mh = /* @__PURE__ */ Symbol.for("dom.ts@onContentObserve"), dr = globalThis[mh] ??= /* @__PURE__ */ new WeakMap(), ys = (e) => (typeof e?.current == "object" && (e = e?.element ?? e?.current ?? (typeof e?.self == "object" ? e?.self : null) ?? e), e), vh = (e, t) => {
  if (!dr.has(e = ys(e))) {
    const n = [], r = new ResizeObserver((i) => {
      for (const s of i) if (s.contentBoxSize) {
        const o = s.contentBoxSize[0];
        o && n.forEach((a) => a?.(o, r));
      }
    });
    t?.({
      inlineSize: e.clientWidth,
      blockSize: e.clientHeight
    }, r), dr.set(e, n), (e?.element ?? e) instanceof Node && r.observe(e?.element ?? e, { box: "content-box" });
  }
  return dr.get(e)?.push?.(t), { disconnect: () => dr.get(e)?.splice?.(dr.get(e)?.indexOf(t) || -1, 1) };
}, tu = (e, t, n) => {
  if (typeof e?.selector == "string") return Ha(e, e?.selector, t, n);
  const r = new Set((t.split(",") || [t]).map((s) => s.trim())), i = new MutationObserver((s, o) => {
    for (const a of s) a.attributeName && r.has(a.attributeName) && n(a, o);
  });
  return (e?.element ?? e) instanceof Node && i.observe(e = ys(e), {
    attributes: !0,
    attributeOldValue: !0,
    attributeFilter: [...r]
  }), r.forEach((s) => n({
    target: e,
    type: "attributes",
    attributeName: s,
    oldValue: e?.getAttribute?.(s)
  }, i)), i;
}, Ha = (e, t, n, r) => {
  const i = new Set([...n.split(",") || [n]].map((o) => o.trim())), s = new MutationObserver((o, a) => {
    for (const l of o) if (l.type == "childList") {
      const c = Array.from(l.addedNodes) || [], u = Array.from(l.removedNodes) || [];
      c.push(...Array.from(l.addedNodes || []).flatMap((d) => Array.from(d?.querySelectorAll?.(t) || []))), u.push(...Array.from(l.removedNodes || []).flatMap((d) => Array.from(d?.querySelectorAll?.(t) || []))), [...new Set(c)].filter((d) => d?.matches?.(t))?.map?.((d) => {
        i.forEach((p) => {
          r({
            target: d,
            type: "attributes",
            attributeName: p,
            oldValue: d?.getAttribute?.(p)
          }, a);
        });
      });
    } else l.target?.matches?.(t) && l.attributeName && i.has(l.attributeName) && r(l, a);
  });
  return s.observe(e = ys(e), {
    attributeOldValue: !0,
    attributes: !0,
    attributeFilter: [...i],
    childList: !0,
    subtree: !0,
    characterData: !0
  }), [...e.querySelectorAll(t)].map((o) => i.forEach((a) => r({
    target: o,
    type: "attributes",
    attributeName: a,
    oldValue: o?.getAttribute?.(a)
  }, s))), s;
}, Gi = (e, t = "*", n = (r, i) => {
}) => {
  const r = (p) => {
    const f = Array.from(p || []) || [];
    return f.push(...Array.from(p || []).flatMap((h) => Array.from(h?.querySelectorAll?.(t) || []))), [...Array.from(new Set(f).values())].filter((h) => h?.matches?.(t));
  }, i = (p) => {
    const f = u?.deref?.(), h = r(p.addedNodes), y = r(p.removedNodes);
    (h.length > 0 || y.length > 0) && n?.({
      type: p.type,
      target: p.target,
      attributeName: p.attributeName,
      attributeNamespace: p.attributeNamespace,
      nextSibling: p.nextSibling,
      oldValue: p.oldValue,
      previousSibling: p.previousSibling,
      addedNodes: h,
      removedNodes: y
    }, f);
  }, s = (p) => {
    i({
      addedNodes: [p?.target].filter((f) => !!f),
      removedNodes: [p?.relatedTarget].filter((f) => !!f),
      type: "childList",
      target: p?.currentTarget
    });
  }, o = (p) => {
    i({
      addedNodes: [p?.relatedTarget].filter((f) => !!f),
      removedNodes: [p?.target].filter((f) => !!f),
      type: "childList",
      target: p?.currentTarget
    });
  }, a = (p) => {
    i({
      addedNodes: [p?.target].filter((f) => !!f),
      removedNodes: [p?.relatedTarget || document?.activeElement].filter((f) => !!f),
      type: "childList",
      target: p?.currentTarget
    });
  }, l = {
    passive: !0,
    capture: !1
  };
  if (t?.includes?.(":hover") && t?.includes?.(":active"))
    return e.addEventListener("pointerover", s, l), e.addEventListener("pointerout", o, l), e.addEventListener("pointerdown", s, l), e.addEventListener("pointerup", o, l), e.addEventListener("pointercancel", o, l), { disconnect: () => {
      e.removeEventListener("pointerover", s, l), e.removeEventListener("pointerout", o, l), e.removeEventListener("pointerdown", s, l), e.removeEventListener("pointerup", o, l), e.removeEventListener("pointercancel", o, l);
    } };
  if (t?.includes?.(":hover"))
    return e.addEventListener("pointerover", s, l), e.addEventListener("pointerout", o, l), { disconnect: () => {
      e.removeEventListener("pointerover", s, l), e.removeEventListener("pointerout", o, l);
    } };
  if (t?.includes?.(":active"))
    return e.addEventListener("pointerdown", s, l), e.addEventListener("pointerup", o, l), e.addEventListener("pointercancel", o, l), { disconnect: () => {
      e.removeEventListener("pointerdown", s, l), e.removeEventListener("pointerup", o, l), e.removeEventListener("pointercancel", o, l);
    } };
  if (t?.includes?.(":focus") && t?.includes?.(":focus-within") && t?.includes?.(":focus-visible"))
    return e.addEventListener("focusin", s, l), e.addEventListener("focusout", o, l), e.addEventListener("click", a, l), { disconnect: () => {
      e.removeEventListener("focusin", s, l), e.removeEventListener("focusout", o, l), e.removeEventListener("click", a, l);
    } };
  const c = new MutationObserver((p, f) => {
    for (const h of p) h.type == "childList" && i(h);
  }), u = new WeakRef(c);
  (e?.element ?? e) instanceof Node && c.observe(e = ys(e), {
    childList: !0,
    subtree: !0
  });
  const d = Array.from(e.querySelectorAll(t));
  return d.length > 0 && n?.({
    addedNodes: d,
    removedNodes: []
  }, c), c;
}, nu = () => typeof globalThis < "u" && typeof globalThis.CSSStyleSheet == "function", Al = (e) => typeof e == "string" && /@import\b/i.test(e), Ba = "DOM", Bs = typeof document < "u" ? document.createElement("style") : null;
Bs && (typeof document < "u" && document.querySelector("head")?.appendChild?.(Bs), Bs.dataset.owner = Ba);
var Tl = (e, t, n = "") => {
  e[0][e[1]] = e[1] == "innerHTML" ? `@import url("${t}") ${n && typeof n == "string" ? `layer(${n})` : ""};` : t;
}, ms = typeof CSSStyleValue < "u" && typeof CSSUnitValue < "u", qn = (e) => ms && e instanceof CSSStyleValue, $n = (e) => ms && e instanceof CSSUnitValue, tn = (e, t, n, r = "") => {
  if (!(!e || !t)) {
    if (n == null) {
      e.getPropertyValue(t) !== "" && e.removeProperty(t);
      return;
    }
    e.getPropertyValue(t) !== n && e.setProperty(t, n, r);
  }
}, gh = (e, t, n, r = "") => {
  if (!e || !t) return e;
  const i = Qr(t), s = e.style, o = e.attributeStyleMap ?? e.styleMap;
  if (!ms || !o) return ru(e, t, n, r);
  let a = ne(n) && !(qn(n) || $n(n)) ? n?.value : n;
  if (a == null)
    return o.delete?.(i), s && tn(s, i, null, r), e;
  if (qn(a)) {
    const l = o.get(i);
    if ($n(a) && $n(l)) {
      if (l.value === a.value && l.unit === a.unit) return e;
    } else if (l === a) return e;
    return o.set(i, a), e;
  }
  if (typeof a == "number") if (CSS?.number && !i.startsWith("--")) {
    const l = CSS.number(a), c = o.get(i);
    return $n(c) && c.value === l.value && c.unit === l.unit || o.set(i, l), e;
  } else
    return tn(s, i, String(a), r), e;
  if (typeof a == "string" && !qn(a)) {
    const l = qc(a);
    if (typeof l == "number" && CSS?.number && !i.startsWith("--")) {
      const c = CSS.number(l), u = o.get(i);
      return $n(u) && u.value === c.value && u.unit === c.unit || o.set(i, c), e;
    } else
      return tn(s, i, a, r), e;
  }
  return tn(s, i, String(a), r), e;
}, ru = (e, t, n, r = "") => {
  if (!e || !t) return e;
  const i = Qr(t), s = e.style;
  if (!s) return e;
  let o = ne(n) && !(qn(n) || $n(n)) ? n?.value : n;
  return typeof o == "string" && !qn(o) && (o = qc(o) ?? o), o == null ? (tn(s, i, null, r), e) : (qn(o) || typeof o == "number", tn(s, i, String(o), r), e);
}, iu = (e, t) => typeof e?.then == "function" ? e?.then?.(t) : t(e), bh = /* @__PURE__ */ Symbol.for("dom.ts@blobURLMap"), hr = globalThis[bh] ??= /* @__PURE__ */ new WeakMap(), wh = /* @__PURE__ */ Symbol.for("dom.ts@cacheMap"), yn = globalThis[wh] ??= /* @__PURE__ */ new Map(), Sh = (e) => {
  if (!e) return null;
  if (yn.has(e)) return yn.get(e);
  if (e instanceof Blob || e instanceof File) {
    if (hr.has(e)) return hr.get(e);
    const t = URL.createObjectURL(e);
    return hr.set(e, t), yn.set(t, t), t;
  }
  if (URL.canParse(e) || e?.trim?.()?.startsWith?.("./")) {
    const t = fetch(e?.replace?.("?url", "?raw"), {
      cache: "force-cache",
      mode: "same-origin",
      priority: "high"
    })?.then?.(async (n) => {
      const r = await n.blob(), i = URL.createObjectURL(r);
      return hr.set(r, i), yn.set(e, i), yn.set(i, i), i;
    });
    return yn.set(e, t), t;
  }
  if (typeof e == "string") {
    const t = new Blob([e], { type: "text/css" }), n = URL.createObjectURL(t);
    return hr.set(t, n), yn.set(n, n), n;
  }
  return e;
}, pr = /* @__PURE__ */ new Map(), fi = /* @__PURE__ */ new WeakMap(), xh = (e) => {
  if (!e) return "";
  if (pr.has(e)) return pr.get(e) ?? "";
  if (e instanceof Blob || e instanceof File) {
    if (fi.has(e)) return fi.get(e) ?? "";
    const t = e?.text?.()?.then?.((n) => (fi.set(e, n), n));
    return fi.set(e, t), t;
  }
  if (URL.canParse(e) || e?.trim?.()?.startsWith?.("./")) {
    const t = fetch(e?.replace?.("?url", "?raw"), {
      cache: "force-cache",
      mode: "same-origin",
      priority: "high"
    })?.then?.(async (n) => {
      const r = await n.text();
      return pr.set(e, r), r;
    });
    return pr.set(e, t), t;
  }
  return typeof e == "string" && pr.set(e, e), e;
}, _h = /* @__PURE__ */ Symbol.for("dom.ts@adoptedSelectorMap"), Ml = globalThis[_h] ??= /* @__PURE__ */ new Map(), kh = /* @__PURE__ */ Symbol.for("dom.ts@adoptedShadowSelectorMap"), Rl = globalThis[kh] ??= /* @__PURE__ */ new WeakMap(), Eh = /* @__PURE__ */ Symbol.for("dom.ts@adoptedLayerMap"), Ol = globalThis[Eh] ??= /* @__PURE__ */ new Map(), Ch = /* @__PURE__ */ Symbol.for("dom.ts@adoptedShadowLayerMap"), di = globalThis[Ch] ??= /* @__PURE__ */ new WeakMap(), su = (e, t = "ux-query", n = null) => {
  if (!e || !nu()) return null;
  const r = n instanceof ShadowRoot ? n : n?.getRootNode ? n.getRootNode({ composed: !0 }) : null, i = r instanceof ShadowRoot, s = i ? r.adoptedStyleSheets : typeof document < "u" ? document.adoptedStyleSheets : null;
  if (!s) return null;
  const o = `${t || ""}:${e}`;
  let a;
  if (i) {
    let u = Rl.get(r);
    u || (u = /* @__PURE__ */ new Map(), Rl.set(r, u)), a = u.get(o), a || (a = new CSSStyleSheet(), u.set(o, a), s.includes(a) || s.push(a));
  } else
    a = Ml.get(o), a || (a = new CSSStyleSheet(), Ml.set(o, a), s.includes(a) || s.push(a));
  if (t) {
    let u;
    if (i) {
      let d = di.get(r);
      d || (d = /* @__PURE__ */ new Map(), di.set(r, d)), u = d.get(t);
    } else u = Ol.get(t);
    if (!u) {
      const d = Array.from(a.cssRules || []), p = d.findIndex((f) => f instanceof CSSLayerBlockRule && f.name === t);
      if (p === -1) try {
        a.insertRule(`@layer ${t} {}`, a.cssRules.length);
        const f = a.cssRules[a.cssRules.length - 1];
        f instanceof CSSLayerBlockRule && (u = f);
      } catch {
        u = void 0;
      }
      else u = d[p];
      if (u) if (i) {
        let f = di.get(r);
        f || (f = /* @__PURE__ */ new Map(), di.set(r, f)), f.set(t, u);
      } else Ol.set(t, u);
    }
    if (u) {
      let d = Array.from(u.cssRules || []).findIndex((p) => p instanceof CSSStyleRule && p.selectorText?.trim?.() === e?.trim?.());
      if (d === -1) try {
        d = u.insertRule(`${e} {}`, u.cssRules.length);
      } catch {
        return null;
      }
      return u.cssRules[d];
    }
  }
  let l = Array.from(a.cssRules || []).findIndex((u) => u instanceof CSSStyleRule && u.selectorText?.trim?.() === e?.trim?.());
  if (l === -1) try {
    l = a.insertRule(`${e} {}`, a.cssRules.length);
  } catch {
    return null;
  }
  const c = a.cssRules[l];
  return c instanceof CSSStyleRule ? c : null;
}, St = (e, t, n, r = "") => ms ? gh(e, t, n, r) : ru(e, t, n, r), ou = (e, t, n = "", r) => {
  const i = Sh(e), s = typeof e == "string" && URL.canParse(e) ? e : i;
  return t?.[0] && (t[0].fetchPriority = "high"), t && s && typeof s == "string" && Tl(t, s, n), t?.[0] && (!URL.canParse(e) || r) && t?.[0] instanceof HTMLLinkElement, iu(i, (o) => {
    t?.[0] && o && (Tl(t, o, n), t?.[0].setAttribute("loaded", ""));
  })?.catch?.((o) => {
    console.warn("Failed to load style sheet:", o);
  });
}, Ph = (e) => {
  const t = typeof document < "u" ? document.createElement("link") : null;
  return t && (t.fetchPriority = "high"), t ? (Object.assign(t, {
    rel: "stylesheet",
    type: "text/css",
    crossOrigin: "same-origin"
  }), t.dataset.owner = Ba, ou(e, [t, "href"]), typeof document < "u" && document.head.append(t), t) : null;
}, Dn = (e, t = typeof document < "u" ? document?.head : null, n = "") => {
  const r = t?.querySelector?.("head") ?? t;
  if (typeof HTMLHeadElement < "u" && r instanceof HTMLHeadElement) return Ph(e);
  const i = typeof document < "u" ? document.createElement("style") : null;
  return i ? (i.dataset.owner = Ba, ou(e, [i, "innerHTML"], n), r?.prepend?.(i), i) : null;
}, Er = (e, t, n, r = "") => St(e, t, n, r), Ah = /* @__PURE__ */ Symbol.for("dom.ts@adoptedMap"), Dt = globalThis[Ah] ??= /* @__PURE__ */ new Map(), Th = /* @__PURE__ */ Symbol.for("dom.ts@adoptedBlobMap"), yr = globalThis[Th] ??= /* @__PURE__ */ new WeakMap(), Mh = /* @__PURE__ */ Symbol.for("dom.ts@layerCounter"), xw = globalThis[Mh] ??= 0, Il = (e, t) => {
  if (!e || !t) return !1;
  try {
    return e.replaceSync(t), !0;
  } catch (n) {
    const r = String(n?.message || "").toLowerCase();
    return r.includes("@import rules are not allowed") || r.includes("@import") && r.includes("not allowed") || console.warn("[DOM] Failed to apply adopted stylesheet:", n), !1;
  }
}, au = (e, t = null) => {
  if (!nu())
    return typeof e == "string" && Dn(e, void 0, t || ""), null;
  if (typeof e == "string" && Al(e))
    return Dn(e, void 0, t || ""), null;
  if (typeof e == "string" && Dt?.has?.(e)) {
    const r = Dt.get(e);
    return typeof document < "u" && document.adoptedStyleSheets && !document.adoptedStyleSheets.includes(r) && document.adoptedStyleSheets.push(r), r;
  }
  if ((e instanceof Blob || e instanceof File) && yr?.has?.(e)) {
    const r = yr.get(e);
    return typeof document < "u" && document.adoptedStyleSheets && !document.adoptedStyleSheets.includes(r) && document.adoptedStyleSheets.push(r), r;
  }
  if (!e) return null;
  const n = typeof e == "string" ? Dt.getOrInsertComputed(e, (r) => new CSSStyleSheet()) : yr.getOrInsertComputed(e, (r) => new CSSStyleSheet());
  if (typeof document < "u" && document.adoptedStyleSheets && !document.adoptedStyleSheets.includes(n) && document.adoptedStyleSheets.push(n), typeof e == "string" && !URL.canParse(e)) {
    const r = t ? `@layer ${t} { ${e} }` : e;
    return Dt.set(e, n), Il(n, r) || (js(n), Dt.delete(e), Dn(e)), n;
  } else iu(xh(e), (r) => {
    if (Dt.set(r, n), r) {
      if (Al(r))
        return js(n), Dt.delete(r), yr.delete(e), Dn(r, void 0, t || ""), n;
      const i = t ? `@layer ${t} { ${r} }` : r;
      return Il(n, i) || (js(n), Dt.delete(r), yr.delete(e), Dn(r, void 0, t || "")), n;
    }
  });
  return n;
}, js = (e) => {
  if (!e) return !1;
  const t = typeof e == "string" ? Dt.get(e) : e;
  if (!t || typeof document > "u") return !1;
  const n = document.adoptedStyleSheets, r = n.indexOf(t);
  return r !== -1 ? (n.splice(r, 1), !0) : !1;
}, hi = (e, t) => {
  if ("computedStyleMap" in e) {
    const n = e?.computedStyleMap?.()?.get(t);
    return n instanceof CSSUnitValue ? n?.value || 0 : n?.toString?.();
  }
  if (e instanceof HTMLElement) {
    const n = getComputedStyle?.(e, "");
    return parseFloat(n?.getPropertyValue?.(t)?.replace?.("px", "")) || 0;
  }
  return parseFloat((e?.style ?? e).getPropertyValue?.(t)?.replace?.("px", "")) || 0;
}, ja = (e, t) => t == "inline" ? hi(e, "padding-inline-start") + hi(e, "padding-inline-end") : hi(e, "padding-block-start") + hi(e, "padding-block-end"), lu = /* @__PURE__ */ new WeakMap(), Rh = (e, t, n) => (new WeakRef(e), t.has(n) || t.add(n), e), Oh = (e, t) => {
  if (e) {
    if (t) {
      const n = lu.getOrInsert(e, /* @__PURE__ */ new Set());
      [...t?.values?.() || []].map((r) => Rh(e, n, r));
    }
    return e;
  }
}, Ih = /* @__PURE__ */ Symbol.for("dom.ts@namedStoreMaps"), er = globalThis[Ih] ??= /* @__PURE__ */ new Map(), Nh = (e, t) => {
  const n = [...e.entries() || []];
  return new Map(n?.map?.(([r, i]) => [r, i?.get?.(t)])?.filter?.(([r, i]) => !!i) || []);
}, zh = (e) => (typeof e == "object" || typeof e == "function") && e != null, Lh = (e, t, n) => {
  if (!zh(e) && e != null) return e;
  let r = er.get(t);
  return r || (r = /* @__PURE__ */ new WeakMap(), er.set(t, r)), !r.has(e) && e != null && r.set(e, n), e;
}, $h = (e, t) => {
  if (!(!e || !t)) {
    for (const [n, r] of t.entries()) Lh(e, n, r);
    return e;
  }
}, Dh = (e, t) => {
  if (e) {
    if (t) {
      const n = sn?.get?.(e) ?? /* @__PURE__ */ new WeakSet();
      sn?.has?.(e) || sn?.set?.(e, n), [...t?.values?.() || []].map((r) => Fh(e, r, n));
    }
    return e;
  }
}, Ar = (e) => ({
  storeSet: Nh(er, e),
  mixinSet: sn?.get?.(e),
  behaviorSet: lu?.get?.(e)
}), Fh = (e, t, n) => {
  const r = new WeakRef(e);
  return n ||= sn?.get?.(e), n?.has?.(t) || (n?.add?.(t), Bn?.get?.(t)?.add?.(e), t.name && e?.setAttribute?.("data-mixin", [...e?.getAttribute?.("data-mixin")?.split?.(" ") || [], t.name].filter((i) => !!i).join(" ")), t?.connect?.(r, t, Ar(e))), e;
}, Wh = /* @__PURE__ */ Symbol.for("dom.ts@boundMixinSet"), sn = globalThis[Wh] ??= /* @__PURE__ */ new WeakMap(), Hh = /* @__PURE__ */ Symbol.for("dom.ts@mixinElements"), Bn = globalThis[Hh] ??= /* @__PURE__ */ new WeakMap(), Bh = /* @__PURE__ */ Symbol.for("dom.ts@mixinRegistry"), Wr = globalThis[Bh] ??= /* @__PURE__ */ new Map(), jh = /* @__PURE__ */ Symbol.for("dom.ts@mixinNamespace"), Xi = globalThis[jh] ??= /* @__PURE__ */ new WeakMap(), cu = (e, t) => {
  typeof t == "string" && (t = Wr?.get?.(t));
  const n = /* @__PURE__ */ new Set([...e?.getAttribute?.("data-mixin")?.split?.(" ") || []]), r = new Set([...n].map((o) => Wr?.get?.(o)).filter((o) => !!o)), i = sn?.get?.(e) ?? /* @__PURE__ */ new WeakSet();
  Bn?.has?.(t) || Bn?.set?.(t, /* @__PURE__ */ new WeakSet()), sn?.has?.(e) || sn?.set?.(e, i);
  const s = new WeakRef(e);
  i?.has?.(t) || (r.has(t) || t?.disconnect?.(s, t, Ar(e)), (r.has(t) || !Bn?.get?.(t)?.has?.(e)) && (t?.connect?.(s, t, Ar(e)), n.add(Xi?.get?.(t)), i?.add?.(t), e?.setAttribute?.("data-mixin", [...n].filter((o) => !!o).join(" "))), Bn?.get?.(t)?.add?.(e)), i?.has?.(t) && (r.has(t) || (i?.delete?.(t), t?.disconnect?.(s, t, Ar(e))));
}, ha = /* @__PURE__ */ new Set(), pa = (e = typeof document < "u" ? document : null) => {
  if (e)
    return ha?.has?.(e) || (ha?.add?.(e), Ha(e, "*", "data-mixin", (t) => Hr(t.target)), Gi(e, "[data-mixin]", (t) => {
      for (const n of t.addedNodes) n instanceof HTMLElement && Hr(n);
    })), e;
}, Hr = (e) => {
  const t = /* @__PURE__ */ new Set([...e?.getAttribute?.("data-mixin")?.split?.(" ") || []]);
  [...new Set([...t].map((n) => Wr?.get?.(n)).filter((n) => !!n))].map?.((n) => cu(e, n));
}, Uh = (e, t) => {
  e.forEach((n) => t ? cu(n, t) : Hr(n));
}, Vh = (e) => {
  for (const t of ha) Uh(t?.querySelectorAll?.("[data-mixin]"), e);
}, qh = new FinalizationRegistry((e) => {
  Wr?.delete?.(e);
}), Gh = (e, t) => {
  if (!Xi?.has?.(t)) {
    const n = e?.trim?.();
    n && (Xi?.set?.(t, n), Wr?.set?.(n, t), qh?.register?.(t, n), Vh(t));
  }
};
pa(typeof document < "u" ? document : null);
var vs = class {
  constructor(e = null) {
    e && Gh(e, this);
  }
  connect(e, t, n) {
    return this;
  }
  disconnect(e, t, n) {
    return this;
  }
  storeForElement(e) {
    return er.get(this.name || "")?.get?.(e);
  }
  relatedForElement(e) {
    return Ar(e);
  }
  get elements() {
    return Bn?.get?.(this);
  }
  get storage() {
    return er?.get?.(this.name || "");
  }
  get name() {
    return Xi?.get?.(this);
  }
}, uu = (e, t, n) => {
  const r = n;
  ne(n) && (n = n.value);
  const i = (n = Ot(n)) != null && n !== !1;
  return _t(r, () => {
    e instanceof HTMLInputElement ? e.hidden = !i : i ? e?.removeAttribute?.("data-hidden") : e?.setAttribute?.("data-hidden", "");
  }), e;
}, _n = (e, t, n) => {
  if (!(t = typeof t == "string" ? Vc(t) : t) || !e || [
    "style",
    "dataset",
    "attributeStyleMap",
    "styleMap",
    "computedStyleMap"
  ].indexOf(t || "") != -1) return e;
  const r = n;
  return ne(n) && (n = n.value), e?.[t] === n || e?.[t] !== n && _t(r, () => {
    n != null ? e[t] = n : delete e[t];
  }), e;
}, Us = (e, t, n) => {
  const r = e?.dataset;
  if (!t || !e || !r) return e;
  const i = n;
  return ne(n) && (n = n?.value), t = Vc(t), r?.[t] === (n = Ot(n)) || (n == null || n === !1 ? delete r[t] : _t(i, () => {
    typeof n != "object" && typeof n != "function" ? r[t] = String(n) : delete r[t];
  })), e;
}, Xh = (e, t) => e.style.removeProperty(Qr(t)), R = (e, t, n) => {
  const r = e?.style;
  return !t || typeof t != "string" || !e || !r || _t(n, () => {
    Ad(n) || ne(n) || Pd(n) ? St(e, t, n) : n == null && Xh(e, t);
  }), e;
}, Ae = (e, t, n) => {
  if (!t || !e) return e;
  const r = n;
  return ne(n) && (n = n.value), t = Qr(t), e?.getAttribute?.(t) === (n = Ot(n)) || _t(r, () => {
    typeof n != "object" && typeof n != "function" && n != null && (typeof n != "boolean" || n == !0) ? e?.setAttribute?.(t, String(n)) : e?.removeAttribute?.(t);
  }), e;
};
function Vs(e, t) {
  const n = Math.min(e.x, t.x), r = Math.min(e.y, t.y), i = Math.max(e.x, t.x), s = Math.max(e.y, t.y);
  return {
    left: n,
    top: r,
    right: i,
    bottom: s,
    width: i - n,
    height: s - r
  };
}
var pi = {
  start: "junction-select:start",
  move: "junction-select:move",
  end: "junction-select:end",
  cancel: "junction-select:cancel"
}, qs = {
  start: "junction-drag:start",
  move: "junction-drag:move",
  end: "junction-drag:end"
}, Gs = {
  start: "junction-resize:start",
  move: "junction-resize:move",
  end: "junction-resize:end"
}, Yh = /* @__PURE__ */ Symbol.for("dom.ts@mixinDisposers"), Yi = globalThis[Yh] ??= /* @__PURE__ */ new WeakMap(), Ze = (e, t, n) => {
  const r = Yi.get(e) ?? /* @__PURE__ */ new Map(), i = r.get(t) ?? [];
  i.push(n), r.set(t, i), Yi.set(e, r);
}, Ua = (e, t) => {
  const n = Yi.get(e), r = n?.get(t);
  if (r) {
    for (const i of r) try {
      i();
    } catch {
    }
    n.delete(t), n.size === 0 && Yi.delete(e);
  }
}, Nn = (e, t) => {
  const n = globalThis.getComputedStyle?.(e)?.getPropertyValue?.(t)?.trim?.() ?? "", r = parseFloat(n);
  return Number.isFinite(r) ? r : 0;
}, fu = (e, t, n) => {
  const r = e.getAttribute(t)?.trim();
  if (!r) return n;
  const i = e.querySelector(r);
  return i instanceof HTMLElement ? i : n;
}, Kh = class extends vs {
  constructor() {
    super("ui-junction-select");
  }
  connect(e) {
    const t = e?.deref?.();
    if (!t) return this;
    const n = document.createElement("div");
    n.className = "ui-junction-select-overlay", n.setAttribute("data-junction-overlay", ""), n.style.cssText = "position:absolute;pointer-events:none;z-index:9999;box-sizing:border-box;border:1px dashed color-mix(in oklab, #3794ff 70%, transparent);background:color-mix(in oklab, #3794ff 14%, transparent);display:none;inset:auto;min-width:0;min-height:0;", globalThis.getComputedStyle?.(t)?.position === "static" && (t.style.position = "relative"), t.appendChild(n);
    let i = !1, s = {
      x: 0,
      y: 0
    }, o = {
      x: 0,
      y: 0
    };
    const a = (h) => {
      const y = t.getBoundingClientRect();
      return {
        x: h.clientX - y.left,
        y: h.clientY - y.top
      };
    }, l = () => {
      const h = Vs(s, o);
      if (h.width < 1 && h.height < 1) {
        n.style.display = "none";
        return;
      }
      n.style.display = "block", n.style.left = `${h.left}px`, n.style.top = `${h.top}px`, n.style.width = `${h.width}px`, n.style.height = `${h.height}px`;
    }, c = (h) => {
      h.button === 0 && (h.target?.closest?.("[data-junction-ignore-select], [data-junction-drag-handle], [data-junction-resize-handle], button, a, input, textarea, select") || (h.target === t || t.contains(h.target)) && (i = !0, s = a(h), o = { ...s }, t.setPointerCapture(h.pointerId), t.dispatchEvent(new CustomEvent(pi.start, {
        bubbles: !0,
        detail: {
          a: { ...s },
          b: { ...o },
          host: t
        }
      })), l()));
    }, u = (h) => {
      if (!i) return;
      o = a(h), l();
      const y = Vs(s, o);
      t.dispatchEvent(new CustomEvent(pi.move, {
        bubbles: !0,
        detail: {
          a: { ...s },
          b: { ...o },
          box: y,
          host: t
        }
      }));
    }, d = (h) => {
      if (!i) return;
      i = !1;
      try {
        t.releasePointerCapture(h.pointerId);
      } catch {
      }
      const y = Vs(s, o);
      t.dispatchEvent(new CustomEvent(pi.end, {
        bubbles: !0,
        detail: {
          a: { ...s },
          b: { ...o },
          box: y,
          host: t
        }
      }));
    }, p = (h) => {
      i && d(h);
    }, f = (h) => {
      if (i) {
        i = !1, n.style.display = "none";
        try {
          t.releasePointerCapture(h.pointerId);
        } catch {
        }
        t.dispatchEvent(new CustomEvent(pi.cancel, {
          bubbles: !0,
          detail: { host: t }
        }));
      }
    };
    return Ze(t, "ui-junction-select", () => {
      n.remove();
    }), Ze(t, "ui-junction-select", T(t, "pointerdown", c)), Ze(t, "ui-junction-select", T(t, "pointermove", u)), Ze(t, "ui-junction-select", T(t, "pointerup", p)), Ze(t, "ui-junction-select", T(t, "pointercancel", f)), this;
  }
  disconnect(e) {
    const t = e?.deref?.();
    return t && Ua(t, "ui-junction-select"), this;
  }
}, Jh = class extends vs {
  constructor() {
    super("ui-junction-drag");
  }
  connect(e) {
    const t = e?.deref?.();
    if (!t) return this;
    St(t, "--jx-drag-x", Nn(t, "--jx-drag-x")), St(t, "--jx-drag-y", Nn(t, "--jx-drag-y"));
    const n = t.style.transform;
    (!t.style.transform || t.style.transform === "none") && (t.style.transform = "translate3d(calc(var(--jx-drag-x, 0) * 1px), calc(var(--jx-drag-y, 0) * 1px), 0)");
    const r = fu(t, "data-junction-drag-handle", t);
    let i = !1, s = 0, o = 0, a = 0, l = 0;
    const c = (p) => {
      p.button === 0 && (p.target !== r && !r.contains(p.target) || (i = !0, s = p.clientX, o = p.clientY, a = Nn(t, "--jx-drag-x"), l = Nn(t, "--jx-drag-y"), r.setPointerCapture(p.pointerId), t.dispatchEvent(new CustomEvent(qs.start, {
        bubbles: !0,
        detail: {
          host: t,
          clientX: p.clientX,
          clientY: p.clientY,
          baseX: a,
          baseY: l
        }
      }))));
    }, u = (p) => {
      if (!i) return;
      const f = p.clientX - s, h = p.clientY - o, y = a + f, b = l + h;
      St(t, "--jx-drag-x", y), St(t, "--jx-drag-y", b), t.dispatchEvent(new CustomEvent(qs.move, {
        bubbles: !0,
        detail: {
          host: t,
          dx: f,
          dy: h,
          x: y,
          y: b
        }
      }));
    }, d = (p) => {
      if (i) {
        i = !1;
        try {
          r.releasePointerCapture(p.pointerId);
        } catch {
        }
        t.dispatchEvent(new CustomEvent(qs.end, {
          bubbles: !0,
          detail: {
            host: t,
            x: Nn(t, "--jx-drag-x"),
            y: Nn(t, "--jx-drag-y")
          }
        }));
      }
    };
    return Ze(t, "ui-junction-drag", () => {
      t.style.transform = n;
    }), Ze(t, "ui-junction-drag", T(r, "pointerdown", c)), Ze(t, "ui-junction-drag", T(r, "pointermove", u)), Ze(t, "ui-junction-drag", T(r, "pointerup", d)), Ze(t, "ui-junction-drag", T(r, "pointercancel", d)), this;
  }
  disconnect(e) {
    const t = e?.deref?.();
    return t && Ua(t, "ui-junction-drag"), this;
  }
}, Qh = class extends vs {
  constructor() {
    super("ui-junction-resize");
  }
  connect(e) {
    const t = e?.deref?.();
    if (!t) return this;
    const n = fu(t, "data-junction-resize-handle", t);
    let r = !1, i = 0, s = 0, o = 0, a = 0;
    const l = Math.max(120, parseFloat(t.getAttribute("data-junction-resize-min-w") || "") || 120), c = Math.max(80, parseFloat(t.getAttribute("data-junction-resize-min-h") || "") || 80), u = (f) => {
      f.button === 0 && (f.target !== n && !n.contains(f.target) || (r = !0, i = f.clientX, s = f.clientY, o = t.offsetWidth, a = t.offsetHeight, n.setPointerCapture(f.pointerId), t.dispatchEvent(new CustomEvent(Gs.start, {
        bubbles: !0,
        detail: {
          host: t,
          width: o,
          height: a
        }
      }))));
    }, d = (f) => {
      if (!r) return;
      const h = Math.max(l, o + (f.clientX - i)), y = Math.max(c, a + (f.clientY - s));
      t.style.width = `${h}px`, t.style.height = `${y}px`, t.dispatchEvent(new CustomEvent(Gs.move, {
        bubbles: !0,
        detail: {
          host: t,
          width: h,
          height: y
        }
      }));
    }, p = (f) => {
      if (r) {
        r = !1;
        try {
          n.releasePointerCapture(f.pointerId);
        } catch {
        }
        t.dispatchEvent(new CustomEvent(Gs.end, {
          bubbles: !0,
          detail: {
            host: t,
            width: t.offsetWidth,
            height: t.offsetHeight
          }
        }));
      }
    };
    return Ze(t, "ui-junction-resize", T(n, "pointerdown", u)), Ze(t, "ui-junction-resize", T(n, "pointermove", d)), Ze(t, "ui-junction-resize", T(n, "pointerup", p)), Ze(t, "ui-junction-resize", T(n, "pointercancel", p)), this;
  }
  disconnect(e) {
    const t = e?.deref?.();
    return t && Ua(t, "ui-junction-resize"), this;
  }
};
new Kh();
new Jh();
new Qh();
Symbol.observable ||= /* @__PURE__ */ Symbol.for("observable");
Symbol.subscribe ||= /* @__PURE__ */ Symbol.for("subscribe");
Symbol.unsubscribe ||= /* @__PURE__ */ Symbol.for("unsubscribe");
var U = /* @__PURE__ */ Symbol.for("@value"), Te = /* @__PURE__ */ Symbol.for("@extract"), qt = /* @__PURE__ */ Symbol.for("@origin"), Br = /* @__PURE__ */ Symbol.for("@registry"), On = /* @__PURE__ */ Symbol.for("@behavior"), Zr = /* @__PURE__ */ Symbol.for("@promise"), ei = /* @__PURE__ */ Symbol.for("@trigger-less"), j = /* @__PURE__ */ Symbol.for("@trigger-lock"), du = /* @__PURE__ */ Symbol.for("@trigger-control"), lt = /* @__PURE__ */ Symbol.for("@trigger"), An = /* @__PURE__ */ Symbol.for("@subscribe"), Zh = /* @__PURE__ */ Symbol.for("@isNotEqual"), Ki = /* @__PURE__ */ Symbol.for("@realProp"), Fi = (e) => {
  const t = typeof e == "object" || typeof e == "function" ? e?.[Te] ?? e : e, n = (r) => Fi(r);
  return Array.isArray(t) ? t?.map?.(n) || Array.from(t || [])?.map?.(n) || [] : t instanceof Map || t instanceof WeakMap ? new Map(Array.from(t?.entries?.() || [])?.map?.(([r, i]) => [r, Fi(i)])) : t instanceof Set || t instanceof WeakSet ? new Set(Array.from(t?.values?.() || [])?.map?.(n)) : t != null && typeof t == "function" || typeof t == "object" ? Object.fromEntries(Array.from(Object.entries(t || {}) || [])?.filter?.(([r]) => r != Te && r != qt && r != Br)?.map?.(([r, i]) => [r, Fi(i)])) : t;
}, gs = (e) => e?.[Te] ?? e?.["@target"] ?? e, at = (e, t = !1) => {
  const n = e;
  if (L(e) || typeof e == "symbol") return e;
  if (e != null && (e instanceof WeakRef || "deref" in e && typeof e?.deref == "function") && (e = e?.deref?.()), e != null && (typeof e == "object" || typeof e == "function")) {
    e = gs(e);
    const r = t && ne(e) && e?.value;
    if (r != null && (typeof r == "object" || typeof r == "function") && (e = r), n != e) return at(e, t);
  }
  return e;
}, ya = (e) => e != null && typeof e.then == "function", ep = (e, t) => L(e) || typeof e == "function" ? t?.(e) : ya(e) ? e.then(t) : e?.promise && ya(e.promise) ? e.promise.then(t) : t?.(e), Nl = /* @__PURE__ */ new WeakMap(), tp = new FinalizationRegistry((e) => {
  e?.forEach?.((t) => t?.());
});
function J(e, t, n) {
  if (!(!n || typeof n != "function" || typeof e != "object" && typeof e != "function"))
    if (t == Symbol.dispose) {
      const r = e?.[Te] ?? e;
      Nl?.getOrInsertComputed?.(r, () => {
        const i = /* @__PURE__ */ new Set();
        return (typeof r == "object" || typeof r == "function") && (tp.register(r, i), Nl.set(r, i), r[Symbol.dispose] ??= () => i.forEach((s) => {
          s?.();
        })), i;
      })?.add?.(n);
    } else e[t] = function(...r) {
      const i = e?.[t];
      typeof i == "function" && i.apply(this, r), n.apply(this, r);
    };
}
var hu = /* @__PURE__ */ Symbol.for("object.ts@withUnsub");
globalThis[hu] ??= /* @__PURE__ */ new WeakMap();
var np = globalThis[hu], rp = (e, t, n) => np.getOrInsert(e, () => {
  const r = t?.deref?.();
  r?.affected?.(n);
  const i = e?.complete?.bind?.(e), s = () => {
    const o = i?.();
    return r?.unaffected?.(n), o;
  };
  return e.complete = s, {
    unaffected: s,
    [Symbol.dispose]: s,
    [Symbol.asyncDispose]: s
  };
}), pu = /* @__PURE__ */ Symbol.for("object.ts@subscriptRegistry");
globalThis[pu] ??= /* @__PURE__ */ new WeakMap();
var ge = globalThis[pu] ??= /* @__PURE__ */ new WeakMap(), yu = /* @__PURE__ */ Symbol.for("object.ts@globalEffectListeners");
globalThis[yu] ??= /* @__PURE__ */ new Map();
var zl = globalThis[yu], mu = /* @__PURE__ */ Symbol.for("object.ts@wrapped");
globalThis[mu] ??= /* @__PURE__ */ new WeakMap();
var ip = globalThis[mu], sp = (e, t) => {
  const n = e?.[Te] ?? e;
  let r = ge.get(n);
  return r ? r.bindSource(n) : (r = new lp(n), ge.set(n, r)), t;
}, ti = (e, t) => (e = at(e?.[Te] ?? e), typeof e == "symbol" || !(typeof e == "object" || typeof e == "function") || e == null ? e : ip.getOrInsertComputed(e, () => new Proxy(e, sp(e, t)))), mr = /* @__PURE__ */ Symbol.for("@allProps"), vu = /* @__PURE__ */ new Set(["*", "all"]), Va = /* @__PURE__ */ new Map([
  ["set", ["setter", "@set"]],
  ["add", ["@add"]],
  ["delete", ["@delete"]],
  ["invalidate", ["@invalidate"]],
  ["manual", ["@manual"]],
  ["custom", ["@custom"]],
  ["setAll", ["@setAll"]],
  ["addAll", ["@addAll"]],
  ["deleteAll", ["@deleteAll", "@clear"]]
]), gu = /* @__PURE__ */ Symbol.for("object.ts@triggerCanonicalNames");
globalThis[gu] ??= new Map(Array.from(Va.entries()).flatMap(([e, t]) => t.map((n) => [n, e])));
var op = globalThis[gu], jr = (e = "set") => {
  if (e == null) return e;
  const t = String(e || "set");
  return op.get(t) ?? t;
}, bu = (e) => {
  const t = e == null ? "all" : String(jr(e) ?? "all");
  return [t, ...Va.get(t) ?? []];
}, Ll = (e = ["*"]) => new Set([...Ji(e)].flatMap((t) => [t, ...Va.get(t) ?? []])), Ji = (e = ["*"]) => {
  const t = typeof e == "string" ? [e] : Array.from(e ?? ["*"]), n = new Set(t.map((r) => {
    const i = String(r || "*");
    return vu.has(i) ? i : String(jr(i) ?? i);
  }));
  return n.size ? n : /* @__PURE__ */ new Set(["*"]);
}, Gn = (e, t) => {
  const n = e instanceof Set ? e : Ji(e);
  return [...vu].some((r) => n.has(r)) || bu(t).some((r) => n.has(r));
}, ap = (e) => !!e && typeof e == "object" && !Array.isArray(e) && ("affectTypes" in e || "triggers" in e || "triggerImmediately" in e), bs = (e = ["*"]) => {
  if (ap(e)) return {
    affectTypes: Ji(e.affectTypes ?? e.triggers ?? ["*"]),
    triggerImmediately: e.triggerImmediately !== !1
  };
  const t = Ji(e);
  return {
    affectTypes: t,
    triggerImmediately: Gn(t, "initial")
  };
}, wu = /* @__PURE__ */ Symbol.for("object.ts@Subscript");
globalThis[wu] ??= class {
  compatible;
  #e;
  #t;
  #n = /* @__PURE__ */ new WeakSet();
  #s;
  #o;
  #a = /* @__PURE__ */ new Set();
  #l = /* @__PURE__ */ new Set();
  #r;
  #u = /* @__PURE__ */ new Map();
  #i = /* @__PURE__ */ new Map();
  #c = !1;
  constructor(t) {
    this.#e = t, this.#t = /* @__PURE__ */ new Map(), this.#n = /* @__PURE__ */ new WeakSet(), this.#r = {
      enable: (i = ["*"], s) => s ? this.withTriggers(i, !0, s) : this.setTriggersEnabled(i, !0),
      disable: (i = ["*"], s) => s ? this.withTriggers(i, !1, s) : this.setTriggersEnabled(i, !1),
      set: (i, s) => this.setTriggersEnabled(i, s),
      with: (i, s) => this.withTriggers(i, !0, s),
      without: (i, s) => this.withTriggers(i, !1, s),
      isEnabled: (i) => this.isTriggerEnabled(i)
    }, this.#o = { next: (i) => {
      i && (Array.isArray(i) ? this.#d(...i) : this.#d(i));
    } };
    const n = new WeakRef(this), r = function(i) {
      const s = i?.next?.bind?.(i);
      return rp(i, n, s);
    };
    this.#s = typeof Observable < "u" ? new Observable(r) : null, this.compatible = () => this.#s;
  }
  bindSource(t) {
    return this.#e ??= t, this;
  }
  $safeExec(t, ...n) {
    if (!(!t || this.#n.has(t))) {
      this.#n.add(t);
      try {
        const r = t(...n);
        if (r && typeof r.then == "function") {
          r.catch(console.warn);
          return;
        }
        return r;
      } catch (r) {
        console.warn(r);
      } finally {
        this.#n.delete(t);
      }
    }
  }
  #d(t, n = null, r, i = "all", ...s) {
    i = jr(i) ?? i;
    const o = this.#t;
    if (o?.size)
      for (const [a, l] of o.entries()) (l.prop === t || l.prop === mr || l.prop === null) && Gn(l.triggers, i) && this.$safeExec(a, n, t, r, i, ...s);
    if (zl.size) {
      const a = {
        source: this.#e,
        target: this.#e,
        value: n,
        prop: t,
        name: t,
        oldValue: r,
        trigger: i,
        args: s
      };
      for (const [l, c] of zl.entries()) Gn(c, i) && this.$safeExec(l, a);
    }
  }
  wrap(t) {
    return Array.isArray(t) ? ti(t, this) : t;
  }
  get triggerControl() {
    return this.#r;
  }
  isTriggerEnabled(t) {
    return !Gn(this.#l, "all") && !bu(t).some((n) => this.#l.has(n));
  }
  setTriggersEnabled(t = ["*"], n = !0) {
    const r = Ll(t);
    for (const i of r) n ? this.#l.delete(i) : this.#l.add(i);
  }
  withTriggers(t, n, r) {
    const i = [...Ll(t)], s = new Map(i.map((a) => [a, this.#l.has(a)])), o = () => {
      s.forEach((a, l) => {
        a ? this.#l.add(l) : this.#l.delete(l);
      });
    };
    this.setTriggersEnabled(i, n);
    try {
      const a = r?.();
      return a && typeof a.finally == "function" ? a.finally(o) : (o(), a);
    } catch (a) {
      throw o(), a;
    }
  }
  affected(t, n, r = ["*"]) {
    if (t == null || typeof t != "function") return;
    const i = bs(r);
    return this.#t.set(t, {
      prop: n || mr,
      triggers: i.affectTypes
    }), () => this.unaffected(t, n || mr);
  }
  unaffected(t, n) {
    if (t != null && typeof t == "function") {
      const r = this.#t, i = r?.get(t);
      if (i && (i.prop == n || n == null || n == mr))
        return r.delete(t), () => this.affected(t, n || mr, i.triggers);
    }
    return this.#t.clear();
  }
  trigger(t, n, r, i = "set", ...s) {
    if (typeof t == "symbol" || (i === void 0 && (i = "set"), i = jr(i) ?? i, !this.isTriggerEnabled(i))) return;
    const o = `${i ?? "all"}`;
    let a = this.#i.get(t);
    a || (a = /* @__PURE__ */ new Map(), this.#i.set(t, a)), a.set(o, [
      t,
      n,
      r,
      i,
      s
    ]), !this.#c && (this.#c = !0, queueMicrotask(() => {
      this.#c = !1;
      const l = this.#i;
      this.#i = /* @__PURE__ */ new Map();
      for (const [c, u] of l)
        if (!(c != null && this.#a.has(c))) {
          c != null && this.#a.add(c);
          try {
            for (const [, d] of u) {
              const [p, f, h, y, b] = d;
              try {
                this.#d(p, f, h, y, ...b ?? []);
              } catch (m) {
                console.warn(m);
              }
            }
          } finally {
            c != null && this.#a.delete(c);
          }
        }
    }));
  }
  get iterator() {
    return this.#o;
  }
};
var lp = globalThis[wu], cp = /* @__PURE__ */ Symbol.for("object.ts@__safeGetGuard"), up = /* @__PURE__ */ new Set([
  Symbol.toStringTag,
  Symbol.iterator,
  Symbol.asyncIterator,
  Symbol.toPrimitive,
  "toString",
  "valueOf",
  "inspect",
  "constructor",
  "__proto__",
  "prototype",
  "then",
  "catch",
  "finally",
  "next"
]), Tr = (e, t) => {
  if (!up.has(t)) return null;
  const n = C(e, t);
  return typeof n == "function" ? Cn(e, n) : n;
}, et = globalThis[cp] ??= /* @__PURE__ */ new WeakMap();
function fp(e, t) {
  let n = !0;
  try {
    et?.getOrInsert?.(e, /* @__PURE__ */ new Set())?.add?.(t), et?.get?.(e)?.has?.(t) && (n = !0), n = typeof Reflect.getOwnPropertyDescriptor(e, t)?.get == "function";
  } catch {
    n = !0;
  } finally {
    et?.get?.(e)?.delete?.(t);
  }
  return n;
}
var wn = (e, t) => {
  if (L(e)) return e;
  const n = C(e, t);
  if (n == null && t != "value") {
    const r = C(e, "value");
    return r != null && !L(r) ? wn(r, t) : n;
  } else if (t == "value" && n != null && !L(n) && typeof n != "function") return wn(n, t) ?? n ?? e;
  return n ?? e;
}, dp = (e, t, n) => {
  if (e == null) return !1;
  let r = __safeSetGuard?.getOrInsert?.(e, /* @__PURE__ */ new Set());
  return r?.has?.(t) ? !1 : (r?.add?.(t), Reflect.set(e, t, n));
}, C = (e, t, n) => {
  let r;
  if (e == null) return e;
  let i = et?.getOrInsert?.(e, /* @__PURE__ */ new Set());
  if (i?.has?.(t)) return null;
  if (!fp(e, t)) r ??= Reflect.get(e, t, n ?? e);
  else {
    i?.add?.(t);
    try {
      r = Reflect.get(e, t, n ?? e);
    } catch {
      r = void 0;
    } finally {
      i.delete(t), i?.size === 0 && et?.delete?.(e);
    }
  }
  return typeof r == "function" ? Cn(e, r) : r;
}, Mt = (e, t) => Object.prototype.hasOwnProperty.call(e, t), Xs = (e, t = !1) => !!e && typeof e == "object" && !Array.isArray(e) && (Mt(e, "key") || Mt(e, "name") || Mt(e, "oldValue") || Mt(e, "old") || Mt(e, "op") || Mt(e, "trigger") || t && Mt(e, "value")), cn = (e, t, n) => Mt(e, t) ? e[t] : t == "oldValue" && Mt(e, "old") ? e.old : n(), ws = (e, t = "manual") => jr(e.trigger ?? e.op ?? t), hp = (e) => typeof e == "string" || typeof e == "number" || typeof e == "symbol", Qi = (e) => {
  const t = C(e, Ki) ?? C(e, "realProp");
  return hp(t) ? t : null;
}, $l = (e, t) => t == "value" ? Qi(e) ?? t : t, pp = (e, t) => {
  const n = Qi(e);
  return n != null && t == n ? C(e, "value") ?? C(e, U) ?? C(e, t) : t == null ? void 0 : C(e, t);
}, Ss = (e, t) => {
  const n = (i, s, o) => (Xs(s) || (o ??= s), t(Xs(i) ? i : Xs(s, !0) ? {
    key: i,
    trigger: o,
    ...s
  } : {
    key: i,
    trigger: o ?? s
  })), r = e?.triggerControl;
  return r && Object.assign(n, r), n.custom = (i, s, o, a) => n({
    key: s,
    trigger: i,
    value: o,
    oldValue: a
  }), n;
}, xs = (e, t, n) => {
  if (e == null || L(e)) return e;
  if (([
    "deref",
    "bind",
    "@target",
    qt,
    Te,
    Br
  ].indexOf(t) < 0 ? C(e, t)?.bind?.(e) : null) != null) return null;
  if ([Te, qt].indexOf(t) >= 0) return C(e, t) ?? e;
  if (t == U) return C(e, t) ?? C(e, "value");
  if (t == Br) return n;
  if (t == du) return n?.triggerControl;
  if (t == Symbol.observable) return n?.compatible;
  if (t == Symbol.subscribe) return (r, i, s) => W(i != null ? [e, i] : e, r, s);
  if (t == Symbol.iterator || t == Symbol.asyncIterator) return C(e, t);
  if (t == Symbol.dispose) return (r) => {
    C(e, Symbol.dispose)?.(r), Wi(r != null ? [e, r] : e);
  };
  if (t == Symbol.asyncDispose) return (r) => {
    C(e, Symbol.asyncDispose)?.(r), Wi(r != null ? [e, r] : e);
  };
  if (t == Symbol.unsubscribe) return (r) => Wi(r != null ? [e, r] : e);
  if (typeof t == "symbol" && (t in e || C(e, t) != null)) return C(e, t);
}, _s = (e, t, n) => {
  if (t == "subscribe") return n?.compatible?.[t] ?? ((r) => {
    if (typeof r == "function") return W(e, r);
    if ("next" in r && r?.next != null) {
      const i = W(e, r?.next), s = r?.complete;
      return r.complete = (...o) => (i?.(), s?.(...o)), r.complete;
    }
  });
}, yp = class {
  #e;
  #t;
  #n;
  constructor(e, t, n) {
    this.#e = e, this.#t = t, this.#n = n;
  }
  get(e, t, n) {
    const r = Tr(e, t);
    return r ?? Reflect.get(e, t, n);
  }
  apply(e, t, n) {
    let r = [], i = [], s = [], o = [...this.#t], a = -1;
    const l = Reflect.apply(e, t || this.#t, n);
    if (this.#n?.[j])
      return Array.isArray(l) ? ma(l) : l;
    switch (this.#e) {
      case "push":
        a = o?.length, r = n;
        break;
      case "unshift":
        a = 0, r = n;
        break;
      case "pop":
        a = o?.length - 1, o.length > 0 && (i = [o[a]]);
        break;
      case "shift":
        a = 0, o.length > 0 && (i = [o[a]]);
        break;
      case "splice":
        a = n[0];
        for (let u = 0; u < Math.max(o.length, this.#t.length); u++) {
          const d = o[u], p = this.#t[u];
          p === void 0 && u >= this.#t.length ? i.push(d) : d === void 0 && u >= o.length ? s.push([
            u,
            p,
            void 0,
            !1
          ]) : xe(d, p) && s.push([
            u,
            p,
            d,
            !0
          ]);
        }
        break;
      case "sort":
      case "fill":
      case "reverse":
      case "copyWithin":
        a = 0;
        for (let u = 0; u < o.length; u++) xe(o[u], this.#t[u]) && s.push([
          a + u,
          this.#t[u],
          o[u],
          !0
        ]);
        break;
      case "set":
        a = n[1], s.push([
          a,
          n[0],
          o?.[a],
          a in o
        ]);
        break;
    }
    const c = ge.get(this.#t);
    return r?.length == 1 ? c?.trigger?.(a, r[0], null, "add") : r?.length > 1 && (c?.trigger?.(a, r, null, "addAll"), r.forEach((u, d) => c?.trigger?.(a + d, u, null, "add"))), s?.length == 1 ? c?.trigger?.(s[0]?.[0] ?? a, s[0]?.[1], s[0]?.[2], s[0]?.[3] === !1 ? "add" : "set") : s?.length > 1 && (c?.trigger?.(a, s, o, "setAll"), s.forEach((u, d) => c?.trigger?.(u?.[0] ?? a + d, u?.[1], u?.[2], u?.[3] === !1 ? "add" : "set"))), i?.length == 1 ? c?.trigger?.(a, null, i[0], "delete") : i?.length > 1 && (c?.trigger?.(a, null, i, "deleteAll"), i.forEach((u, d) => c?.trigger?.(a + d, null, u, "delete"))), l == e ? new Proxy(l, this.#n) : Array.isArray(l) ? ma(l) : l;
  }
}, mp = (e, t, n, r) => {
  const i = Number.isInteger(n) && Number.isInteger(r) && r < n ? t.slice(r, n) : [];
  if (!e[j] && n !== r) {
    const s = ge.get(t);
    i.length === 1 ? s?.trigger?.(r, null, i[0], "delete") : i.length > 1 && (s?.trigger?.(r, null, i, "deleteAll"), i.forEach((a, l) => s?.trigger?.(r + l, null, a, "delete")));
    const o = Number.isInteger(n) && Number.isInteger(r) && r > n ? r - n : 0;
    if (o === 1) s?.trigger?.(n, void 0, null, "add");
    else if (o > 1) {
      const a = Array(o).fill(void 0);
      s?.trigger?.(n, a, null, "addAll"), a.forEach((l, c) => s?.trigger?.(n + c, void 0, null, "add"));
    }
  }
}, vp = class {
  [j];
  constructor() {
  }
  has(e, t) {
    return Reflect.has(e, t);
  }
  get(e, t, n) {
    const r = Tr(e, t);
    if (r != null) return r;
    if ([
      Te,
      qt,
      "@target",
      "deref"
    ].indexOf(t) >= 0 && C(e, t) != null && C(e, t) != e) return typeof C(e, t) == "function" ? C(e, t)?.bind?.(e) : C(e, t);
    const i = ge?.get?.(e), s = xs(e, t, i);
    if (s != null) return s;
    const o = _s(e, t, i);
    if (o != null) return o;
    if (t == ei) return ds.call(this, this);
    if (t == lt) return Ss(i, (l) => {
      const c = l.key ?? l.name ?? 0, u = cn(l, "value", () => C(e, c)), d = cn(l, "oldValue", () => {
      });
      return i?.trigger?.(c, u, d, ws(l, "manual"));
    });
    if (t == "@target" || t == Te) return e;
    if (t == "x") return () => e?.x ?? e?.[0];
    if (t == "y") return () => e?.y ?? e?.[1];
    if (t == "z") return () => e?.z ?? e?.[2];
    if (t == "w") return () => e?.w ?? e?.[3];
    if (t == "r") return () => e?.r ?? e?.[0];
    if (t == "g") return () => e?.g ?? e?.[1];
    if (t == "b") return () => e?.b ?? e?.[2];
    if (t == "a") return () => e?.a ?? e?.[3];
    const a = C(e, t) ?? (t == "value" ? C(e, U) : null);
    return typeof a == "function" ? new Proxy(typeof a == "function" ? a?.bind?.(e) : a, new yp(t, e, this)) : a;
  }
  set(e, t, n) {
    if (typeof t != "symbol" && Number.isInteger(parseInt(t)) && (t = parseInt(t) ?? t), t == j && n)
      return this[j] = !!n, !0;
    if (t == j && !n)
      return delete this[j], !0;
    const r = C(e, t), i = [
      "x",
      "y",
      "z",
      "w"
    ], s = [
      "r",
      "g",
      "b",
      "a"
    ], o = i.indexOf(t), a = s.indexOf(t);
    let l = !1;
    return o >= 0 ? l = Reflect.set(e, o, n) : a >= 0 ? l = Reflect.set(e, a, n) : l = Reflect.set(e, t, n), t == "length" && xe(r, n) && mp(this, e, r, n), !this[j] && typeof t != "symbol" && xe(r, n) && ge?.get?.(e)?.trigger?.(t, n, r, "set"), l;
  }
  deleteProperty(e, t) {
    if (typeof t != "symbol" && Number.isInteger(parseInt(t)) && (t = parseInt(t) ?? t), t == j)
      return delete this[j], !0;
    const n = C(e, t), r = Reflect.deleteProperty(e, t);
    return !this[j] && t != "length" && t != j && typeof t != "symbol" && n != null && ge.get(e)?.trigger?.(t, t, n, "delete"), r;
  }
}, gp = class {
  [j];
  constructor() {
  }
  get(e, t, n) {
    if ([
      Te,
      qt,
      "@target",
      "deref",
      "then",
      "catch",
      "finally"
    ].indexOf(t) >= 0 && C(e, t) != null && C(e, t) != e) return typeof C(e, t) == "function" ? Cn(e, C(e, t)) : C(e, t);
    const r = ge.get(e) ?? ge.get(C(e, "value") ?? e), i = xs(e, t, r);
    if (i != null) return i;
    C(e, t) == null && t != "value" && ne(e) && C(e, "value") != null && (typeof C(e, "value") == "object" || typeof C(e, "value") == "function") && C(C(e, "value"), t) != null && (e = C(e, "value") ?? e);
    const s = _s(e, t, r);
    return s ?? (t == ei ? ds.call(this, this) : t == lt ? Ss(r, (o) => {
      const a = $l(e, o.key ?? o.name ?? Qi(e) ?? "value"), l = cn(o, "oldValue", () => a == "value" || a == Qi(e) ? C(e, U) : void 0), c = cn(o, "value", () => pp(e, a));
      return r?.trigger?.(a, c, l, ws(o, "manual"));
    }) : t == Symbol.toPrimitive ? (o) => {
      const a = wn(e, t);
      return C(a, t) ? C(a, t)?.(o) : L(a) ? xt(a, o) : L(C(a, "value")) ? xt(C(a, "value"), o) : xt(C(a, "value") ?? a, o);
    } : t == Symbol.toStringTag ? () => {
      const o = wn(e, t);
      return C(o, t) ? C(o, t)?.() : L(o) ? String(o ?? "") || "" : L(C(o, "value")) ? String(C(o, "value") ?? "") || "" : String(C(o, "value") ?? o ?? "") || "";
    } : t == "toString" ? () => {
      const o = wn(e, t);
      return C(o, t) ? C(o, t)?.() : C(o, Symbol.toStringTag) ? C(o, Symbol.toStringTag)?.() : L(o) ? String(o ?? "") || "" : L(C(o, "value")) ? String(C(o, "value") ?? "") || "" : String(C(o, "value") ?? o ?? "") || "";
    } : t == "valueOf" ? () => {
      const o = wn(e, t);
      return C(o, t) ? C(o, t)?.() : C(o, Symbol.toPrimitive) ? C(o, Symbol.toPrimitive)?.() : L(o) ? o : L(C(o, "value")) ? C(o, "value") : C(o, "value") ?? o;
    } : typeof t == "symbol" && (t in e || C(e, t) != null) ? C(e, t) : wn(e, t));
  }
  apply(e, t, n) {
    return Reflect.apply(e, t, n);
  }
  ownKeys(e) {
    return Reflect.ownKeys(e);
  }
  construct(e, t, n) {
    return Reflect.construct(e, t, n);
  }
  isExtensible(e) {
    return Reflect.isExtensible(e);
  }
  getOwnPropertyDescriptor(e, t) {
    let n;
    try {
      et?.getOrInsert?.(e, /* @__PURE__ */ new Set())?.add?.(t), et?.get?.(e)?.has?.(t) && (n = void 0), n = Reflect.getOwnPropertyDescriptor(e, t);
    } catch {
      n = void 0;
    } finally {
      et?.get?.(e)?.delete?.(t);
    }
    return n;
  }
  has(e, t) {
    return t in e;
  }
  set(e, t, n) {
    const r = Tr(e, t);
    return r ?? Nd(n, (i) => {
      const s = Tr(i, t);
      if (s != null) return s;
      if (t == j && n)
        return this[j] = !!n, !0;
      if (t == j && !n)
        return delete this[j], !0;
      const o = e;
      if (C(e, t) == null && t != "value" && ne(e) && C(e, "value") != null && (typeof C(e, "value") == "object" || typeof C(e, "value") == "function") && C(C(e, "value"), t) != null && (e = C(e, "value") ?? e), typeof t == "symbol" && !(C(e, t) != null && t in e)) return;
      const a = $l(e, t), l = t == "value" ? C(e, U) ?? C(e, t) : C(e, t);
      e[t] = i;
      const c = C(e, t) ?? i;
      return !this[j] && typeof t != "symbol" && (C(e, Zh) ?? xe)?.(l, c) && (ge.get(e) ?? ge.get(o))?.trigger?.(a, i, l), !0;
    });
  }
  defineProperty(e, t, n) {
    const r = Tr(e, t);
    if (r != null) return r;
    if (t == j && n.value)
      return this[j] = !!n.value, !0;
    if (t == j && !n.value)
      return delete this[j], !0;
    if (C(e, t) == null && t != "value" && ne(e) && C(e, "value") != null && (typeof C(e, "value") == "object" || typeof C(e, "value") == "function") && C(C(e, "value"), t) != null && (e = C(e, "value") ?? e), n.get == null && n.set == null) return Reflect.defineProperty(e, t, n);
    const i = C(e, t), s = Reflect.defineProperty(e, t, {
      get: n.get,
      set: n.set,
      enumerable: n.enumerable ?? !0,
      configurable: n.configurable ?? !0
    });
    return dp(e, t, i), s;
  }
  deleteProperty(e, t) {
    if (t == j)
      return delete this[j], !0;
    C(e, t) == null && t != "value" && ne(e) && C(e, "value") != null && (typeof C(e, "value") == "object" || typeof C(e, "value") == "function") && C(C(e, "value"), t) != null && (e = C(e, "value") ?? e);
    const n = C(e, t), r = Reflect.deleteProperty(e, t);
    return !this[j] && t != j && typeof t != "symbol" && ge.get(e)?.trigger?.(t, null, n, "delete"), r;
  }
}, bp = class {
  [j];
  constructor() {
  }
  get(e, t, n) {
    if ([
      Te,
      qt,
      "@target",
      "deref"
    ].indexOf(t) >= 0 && C(e, t) != null && C(e, t) != e) return typeof C(e, t) == "function" ? Cn(e, C(e, t)) : C(e, t);
    const r = ge.get(e), i = xs(e, t, r);
    if (i != null) return i;
    const s = _s(e, t, r);
    if (s != null) return s;
    e = C(e, Te) ?? C(e, qt) ?? e;
    const o = Cn(e, C(e, t));
    return typeof t == "symbol" && (t in e || C(e, t) != null) ? o : t == ei ? ds.call(this, this) : t == lt ? Ss(r, (a) => {
      const l = a.key ?? a.name;
      if (l == null) return;
      const c = cn(a, "value", () => e.get(l));
      if (c == null && !Mt(a, "value")) return;
      const u = cn(a, "oldValue", () => {
      });
      return r?.trigger?.(l, c, u, ws(a, "manual"));
    }) : t == "clear" ? () => {
      const a = Array.from(e?.entries?.() || []), l = o();
      return a.forEach(([c, u]) => {
        this[j] || ge.get(e)?.trigger?.(c, null, u, "delete");
      }), l;
    } : t == "delete" ? (a, l = null) => {
      const c = e.has(a), u = e.get(a), d = o(a);
      return !this[j] && c && ge.get(e)?.trigger?.(a, null, u, "delete"), d;
    } : t == "set" ? (a, l) => zd(l, (c) => {
      const u = e.has(a), d = e.get(a), p = o(a, c);
      return (!u || xe(d, c)) && (this[j] || ge.get(e)?.trigger?.(a, c, u ? d : null, u ? "set" : "add")), p;
    }) : o;
  }
  set(e, t, n) {
    return t == j ? (this[j] = !!n, !0) : t == j && !n ? (delete this[j], !0) : Reflect.set(e, t, n);
  }
  has(e, t) {
    return Reflect.has(e, t);
  }
  apply(e, t, n) {
    return Reflect.apply(e, t, n);
  }
  construct(e, t, n) {
    return Reflect.construct(e, t, n);
  }
  ownKeys(e) {
    return Reflect.ownKeys(e);
  }
  isExtensible(e) {
    return Reflect.isExtensible(e);
  }
  getOwnPropertyDescriptor(e, t) {
    let n;
    try {
      et?.getOrInsert?.(e, /* @__PURE__ */ new Set())?.add?.(t), et?.get?.(e)?.has?.(t) && (n = void 0), n = Reflect.getOwnPropertyDescriptor(e, t);
    } catch {
      n = void 0;
    } finally {
      et?.get?.(e)?.delete?.(t);
    }
    return n;
  }
  deleteProperty(e, t) {
    return t == j ? (delete this[j], !0) : Reflect.deleteProperty(e, t);
  }
}, wp = class {
  [j] = !1;
  constructor() {
  }
  get(e, t, n) {
    if ([
      Te,
      qt,
      "@target",
      "deref"
    ].indexOf(t) >= 0 && C(e, t) != null && C(e, t) != e) return typeof C(e, t) == "function" ? Cn(e, C(e, t)) : C(e, t);
    const r = ge.get(e), i = xs(e, t, r);
    if (i != null) return i;
    const s = _s(e, t, r);
    if (s != null) return s;
    e = C(e, Te) ?? C(e, qt) ?? e;
    const o = Cn(e, C(e, t));
    return typeof t == "symbol" && (t in e || C(e, t) != null) ? o : t == ei ? ds.call(this, this) : t == lt ? Ss(r, (a) => {
      const l = a.key ?? a.name;
      if (l == null) return;
      const c = cn(a, "value", () => e.has(l)), u = cn(a, "oldValue", () => {
      });
      return r?.trigger?.(l, c, u, ws(a, "manual"));
    }) : t == "clear" ? () => {
      const a = Array.from(e?.values?.() || []), l = o();
      return a.forEach((c) => {
        this[j] || ge.get(e)?.trigger?.(null, null, c, "delete");
      }), l;
    } : t == "delete" ? (a) => {
      const l = e.has(a), c = l ? a : null, u = o(a);
      return !this[j] && l && ge.get(e)?.trigger?.(a, null, c, "delete"), u;
    } : t == "add" ? (a) => {
      const l = e.has(a), c = l ? a : null, u = o(a);
      return l || this[j] || ge.get(e)?.trigger?.(a, a, c, "add"), u;
    } : o;
  }
  set(e, t, n) {
    return t == j && n ? (this[j] = !!n, !0) : t == j && !n ? (delete this[j], !0) : Reflect.set(e, t, n);
  }
  has(e, t) {
    return Reflect.has(e, t);
  }
  apply(e, t, n) {
    return Reflect.apply(e, t, n);
  }
  construct(e, t, n) {
    return Reflect.construct(e, t, n);
  }
  ownKeys(e) {
    return Reflect.ownKeys(e);
  }
  isExtensible(e) {
    return Reflect.isExtensible(e);
  }
  getOwnPropertyDescriptor(e, t) {
    let n;
    try {
      et?.getOrInsert?.(e, /* @__PURE__ */ new Set())?.add?.(t), et?.get?.(e)?.has?.(t) && (n = void 0), n = Reflect.getOwnPropertyDescriptor(e, t);
    } catch {
      n = void 0;
    } finally {
      et?.get?.(e)?.delete?.(t);
    }
    return n;
  }
  deleteProperty(e, t) {
    return t == j ? (delete this[j], !0) : Reflect.deleteProperty(e, t);
  }
}, tr = (e) => !!((typeof e == "object" || typeof e == "function") && e != null && (e?.[Te] || e?.[An])), ma = (e) => tr(e) ? e : ti(e, new vp()), Sp = (e) => tr(e) ? e : ti(e, new gp()), xp = (e) => tr(e) ? e : ti(e, new bp()), _p = (e) => tr(e) ? e : ti(e, new wp()), w = (e, t) => {
  const n = e instanceof Promise || typeof e?.then == "function", r = be({
    [Zr]: n ? e : null,
    [U]: n ? 0 : Number(at(e) || 0) || 0,
    [On]: t,
    [Symbol?.toStringTag]() {
      return String(this?.[U] ?? "") || "";
    },
    [Symbol?.toPrimitive](i) {
      return xt((typeof this?.[U] != "object" ? this?.[U] : this?.[U]?.value || 0) ?? 0, i);
    },
    set value(i) {
      this[U] = (i != null && !Number.isNaN(i) ? Number(i) : this[U]) || 0;
    },
    get value() {
      return Number(this[U] || 0) || 0;
    }
  });
  return e?.then?.((i) => r.value = i), r;
}, Je = (e, t) => {
  const n = e instanceof Promise || typeof e?.then == "function", r = be({
    [Zr]: n ? e : null,
    [U]: (n ? "" : String(at(typeof e == "number" ? String(e) : e || ""))) ?? "",
    [On]: t,
    [Symbol?.toStringTag]() {
      return String(this?.[U] ?? "") ?? "";
    },
    [Symbol?.toPrimitive](i) {
      return xt(this?.[U] ?? "", i);
    },
    set value(i) {
      this[U] = String(typeof i == "number" ? String(i) : i || "") ?? "";
    },
    get value() {
      return String(this[U] ?? "") ?? "";
    }
  });
  return e?.then?.((i) => r.value = i), r;
}, Gt = (e, t) => {
  const n = e instanceof Promise || typeof e?.then == "function", r = be({
    [Zr]: n ? e : null,
    [U]: (n ? !1 : (at(e) != null ? typeof at(e) == "string" ? !0 : !!at(e) : !1) || !1) || !1,
    [On]: t,
    [Symbol?.toStringTag]() {
      return String(this?.[U] ?? "") || "";
    },
    [Symbol?.toPrimitive](i) {
      return xt(!!this?.[U] || !1, i);
    },
    set value(i) {
      this[U] = (i != null ? typeof i == "string" ? !0 : !!i : this[U]) || !1;
    },
    get value() {
      return this[U] || !1;
    }
  });
  return e?.then?.((i) => r.value = i), r;
}, Dl = (e, t) => {
  const n = e instanceof Promise || typeof e?.then == "function", r = be({
    [Zr]: n ? e : null,
    [On]: t,
    [Symbol?.toStringTag]() {
      return String(this.value ?? "") || "";
    },
    [Symbol?.toPrimitive](i) {
      return xt(this.value, i);
    },
    value: n ? null : at(e)
  });
  return e?.then?.((i) => r.value = i), W(e, (i) => {
    r?.[lt]?.();
  }), r;
}, Ys = (e, t) => {
  if (e == null || typeof e != "object" && typeof e != "function") return e;
  try {
    Object.defineProperty(e, Ki, {
      value: t,
      writable: !0,
      configurable: !0
    });
  } catch {
    try {
      e[Ki] = t;
    } catch {
    }
  }
  try {
    Object.defineProperty(e, "realProp", {
      value: t,
      writable: !0,
      configurable: !0
    });
  } catch {
    try {
      e.realProp = t;
    } catch {
    }
  }
  return e;
}, kp = (e, t = "value", n, r) => {
  if (L(e) || !e) return e;
  Array.isArray(e) && e.length == 2 && e[0] != null && (e[0] instanceof Map || e[0] instanceof WeakMap || e[0] instanceof Set || e[0] instanceof WeakSet) ? ((t == null || t === "value") && (t = e[1]), e = e[0]) : Array.isArray(e) && !ua(e?.[1], e) && (Array.isArray(e?.[0]) || typeof e?.[0] == "object" || typeof e?.[0] == "function") && (e = e?.[0]);
  const i = e instanceof Map || e instanceof WeakMap, s = e instanceof Set || e instanceof WeakSet;
  if (i || s) {
    if (t == null) return;
  } else if ((t ??= Array.isArray(e) ? null : "value") == null || ua(t, e)) return;
  const o = () => i ? e.get(t) : s ? e.has(t) : e?.[t], a = (d) => i ? (e.set(t, d), d) : s ? (d ? e.add(t) : e.delete(t), e.has(t)) : e[t] = d;
  i && n !== void 0 && !e.has(t) ? e.set(t, n) : s && n && !e.has(t) && e.add(t);
  const l = o();
  if (!s && t != null && ne(l) && Tn(l)) return Ys(Cp(l), t);
  if (!i && !s && t && typeof e?.getProperty == "function" && Tn(e?.getProperty?.(t))) return Ys(e?.getProperty?.(t), t);
  !i && !s && (e[t] ??= n ?? e[t]);
  const c = be({
    [U]: s ? !!o() : o() ?? n,
    [On]: r,
    [Symbol?.toStringTag]() {
      return String(o() ?? this[U] ?? "") || "";
    },
    [Symbol?.toPrimitive](d) {
      return xt(o(), d);
    },
    set value(d) {
      if (c[Zn] = !0, s) this[U] = a(d);
      else {
        const p = d ?? $d(o());
        this[U] = a(p);
      }
      c[Zn] = !1;
    },
    get value() {
      const d = o();
      return this[U] = s ? !!d : d ?? this[U];
    }
  });
  Ys(c, t);
  const u = W(e, (d, p, f, h) => {
    if (p === t) {
      const y = s ? d != null : d, b = s ? f != null : f;
      c?.[lt]?.({
        key: t,
        value: y,
        oldValue: b,
        trigger: h
      });
    }
  });
  return J(c, Symbol.dispose, u), c;
}, Ep = (e, t) => {
  switch (typeof e) {
    case "boolean":
      return Gt(e, t);
    case "number":
      return w(e, t);
    case "string":
      return Je(e, t);
    case "object":
      if (e != null) return Dl(be(e), t);
    default:
      return Dl(e, t);
  }
}, fn = (e, t = "value", n) => {
  const r = Tn(e) ? e : Ep(e, n);
  return t != null ? kp(r, t, n) : r;
};
function be(e, t) {
  if (e == null || typeof e == "symbol" || !(typeof e == "object" || typeof e == "function") || tr(e) || (e = at?.(e)) == null || e instanceof Promise || e instanceof WeakRef || tr(e)) return e;
  const n = e;
  if (n == null || typeof n == "symbol" || !(typeof n == "object" || typeof n == "function") || n instanceof Promise || n instanceof WeakRef) return n;
  let r = n;
  return Array.isArray(n) ? (r = ma(n), r) : n instanceof Map ? (r = xp(n), r) : n instanceof Set ? (r = _p(n), r) : ((typeof n == "function" || typeof n == "object") && (r = Sp(n)), r);
}
var Tn = (e) => typeof HTMLInputElement < "u" && e instanceof HTMLInputElement ? !0 : !!((typeof e == "object" || typeof e == "function") && e != null && (e?.[Te] || e?.[An] || ge?.has?.(e))), Cp = (e) => Tn(e) ? be(e) : null, Pp = /* @__PURE__ */ Symbol.for("object.ts@specializedSubscribe"), zn = globalThis[Pp] ??= /* @__PURE__ */ new WeakMap(), qa = (e) => {
  if (!(typeof e == "symbol" || e == null || !(typeof e == "object" || typeof e == "function")))
    return e;
}, Zi = "initial", Ga = (e) => {
  const t = e?.[Ki] ?? e?.realProp;
  return or(t) ? t : null;
}, Su = (e, t) => {
  const n = Ga(e);
  return n != null && (t == null || t == "value") ? n : t;
}, Ap = (e, t) => t != null && t == Ga(e) ? e?.value : e?.[t], va = (e, t, n, r) => {
  if (t != null && t == Ga(e)) {
    const i = Ap(e, t);
    if (i != null) return n?.(i, t, null, "set");
  }
  return Di(e, t, n, r);
}, xu = (e, t, n) => {
  const r = bs(t);
  if (n == Zi) {
    if (!r.triggerImmediately) return;
  } else if (!Gn(r.affectTypes, n)) return;
  return (i, s, o, ...a) => e?.(i, s, o, n, ...a);
}, Tp = (e, t, n, r = ["*"]) => {
  if (!e || !qa(e)) return;
  const i = t != Symbol.iterator ? Su(e, t) : null;
  let s = e?.[Br] ?? ge.get(e);
  e = e?.[Te] ?? e, queueMicrotask(() => {
    const a = xu(n, r, Zi);
    a && (i != null && i != Symbol.iterator ? va(e, i, a, null) : Da(e, a, null));
  });
  let o = s?.affected?.(n, i, r);
  return e?.[Symbol.dispose] || (J(o, Symbol.dispose, o), J(o, Symbol.asyncDispose, o), J(e, Symbol.dispose, o), J(e, Symbol.asyncDispose, o)), o;
}, Mp = (e, t, n, r = ["*"]) => {
  const i = bs(r).affectTypes, s = {};
  let o = e?.value;
  const a = (l) => {
    const c = l?.target?.value;
    Gn(i, "set") && n?.(c, "value", o, "set", l), o = c;
  };
  return e?.addEventListener?.("change", a, s), () => e?.removeEventListener?.("change", a, s);
}, Ks = (e) => Array.isArray(e) && e?.length == 2 && qa(e?.[0]) && (or(e?.[1]) || e?.[1] == Symbol.iterator), Rp = (e, t, n, r = ["*"]) => {
  const i = or(e?.[1]) ? e?.[1] : null;
  return W(e?.[0], i, n, r);
}, Op = (e, t, n, r = ["*"]) => e?.then?.((i) => W?.(i, t, n, r))?.catch?.((i) => (console.warn(i), null)), W = (e, t, n = () => {
}, r) => {
  if (typeof t == "function" ? (r = n, n = t, t = null) : t = Su(e, t), (typeof n == "object" || Array.isArray(n)) && (r = n, n = () => {
  }), (L(e) || typeof e == "symbol") && bs(r).triggerImmediately)
    return Bi(globalThis?.Promise?.try?.(() => n?.(e, null, null, null, Zi)));
  if (typeof e?.[An] == "function") return e?.[An]?.(n, t, r);
  if (qa(e)) {
    const i = e;
    if (zn?.has?.(e = e?.[Te] ?? e)) return zn?.get?.(e)?.(i, t, n, r);
    if (Tn(i) || Ks(e) && Tn(e?.[0])) return ya(e) ? zn?.getOrInsert?.(e, Op)?.(e, t, n, r) : Ks(e) ? zn?.getOrInsert?.(e, Rp)?.(e, t, n, r) : typeof HTMLInputElement < "u" && e instanceof HTMLInputElement ? zn?.getOrInsert?.(e, Mp)?.(e, t, n, r) : zn?.getOrInsert?.(e, Tp)?.(i, t, n, r);
    {
      const s = xu(n, r, Zi);
      return s ? Bi(globalThis?.Promise?.try?.(() => Ks(e) ? va?.(e?.[0], e?.[1], s, null) : t != null && t != Symbol.iterator ? va?.(e, t, s, null) : Da?.(e, s, null))) : void 0;
    }
  }
}, Xa = class {
  #e = /* @__PURE__ */ new WeakMap();
  #t(e) {
    if (e == null || typeof e != "object" && typeof e != "function" && typeof e != "symbol") throw new TypeError("DoubleWeakMap keyL1 must be an object|function|symbol (use pair [keyL1, keyL2])");
    let t = this.#e.get(e);
    return t || (t = /* @__PURE__ */ new WeakMap(), this.#e.set(e, t)), t;
  }
  #n(e) {
    if (!Array.isArray(e) || e.length !== 2) throw new TypeError("DoubleWeakMap key must be a pair: [keyL1, keyL2]");
    return e;
  }
  hasL1(e) {
    return this.#e.has(e);
  }
  set(e, t) {
    const [n, r] = this.#n(e);
    return this.#t(n).set(r, t), this;
  }
  get(e) {
    const [t, n] = this.#n(e);
    return this.#e.get(t)?.get(n);
  }
  has(e) {
    const [t, n] = this.#n(e);
    return this.#e.get(t)?.has(n) ?? !1;
  }
  delete(e) {
    const [t, n] = this.#n(e), r = this.#e.get(t);
    return r ? r.delete(n) : !1;
  }
  deleteTop(e) {
    return this.#e.delete(e);
  }
  getOrCreate(e, t) {
    const [n, r] = this.#n(e), i = this.#t(n);
    if (i.has(r)) return i.get(r);
    const s = t();
    return i.set(r, s), s;
  }
  getOrInsert(e, t) {
    const [n, r] = this.#n(e), i = this.#t(n);
    return i.has(r) ? i.get(r) : (i.set(r, t), t);
  }
  getOrInsertComputed(e, t) {
    const [n, r] = this.#n(e), i = this.#t(n);
    if (i.has(r)) return i.get(r);
    const s = t([n, r]);
    return i.set(r, s), s;
  }
}, Js = new Xa();
function Ya(e, t, n = ["*"]) {
  if (!e) return;
  if (Js.has([e, t])) return Js.get([e, t]);
  const r = (i, s, o, a) => {
    if (s == "value") {
      const l = (o?.value ?? o)?.entries?.(), c = e?.value ?? i?.value ?? i;
      if (l) for (const [u, d] of l) {
        const p = d ?? (o?.value ?? o)?.[u] ?? null, f = c?.[u];
        p == null && f != null ? t(f, u, null, "add") : p != null && f == null ? t(null, u, p, "delete") : xe(p, f) && t(f, u, p, "set");
      }
      return Ya(i ?? e?.value, t, n);
    }
    return s == null ? void 0 : e[s];
  };
  return Js.getOrInsertComputed([e, t], () => e instanceof Set ? W([zp(e), Symbol.iterator], t, n) : e instanceof Map ? W(e, t, n) : ne(e) ? W(e, r, n) : Array.isArray(e) && !(e?.length == 2 && or(e?.[1]) && Tn(e?.[0])) ? W([e, Symbol.iterator], t, n) : W(e, t, n));
}
function Wi(e, t) {
  return ep(e, (n) => {
    const r = Array.isArray(n) && n?.length == 2 && ["object", "function"].indexOf(typeof n?.[0]) >= 0 && or(n?.[1]), i = r ? n?.[1] : null;
    n = r && i != null ? n?.[0] ?? n : n;
    const s = typeof n == "object" || typeof n == "function" ? n?.[Te] ?? n : n;
    (n?.[Br] ?? ge.get(s))?.unaffected?.(t, i);
  });
}
var Ip = (e, t, n, r) => {
  if (L(e)) return e ? t : n;
  const i = () => t, s = () => n, o = (c) => (c != null && (e.value = ne(c) ? c?.value : c), (ne(e) ? e?.value : e) ? i() : s()), a = be({
    [U]: o(),
    [On]: r,
    [Symbol?.toStringTag]() {
      return String(o() ?? this[U] ?? "") || "";
    },
    [Symbol?.toPrimitive](c) {
      return xt(o() ?? this[U], c);
    },
    set value(c) {
      this[U] = o(c);
    },
    get value() {
      return this[U] = o() ?? this[U];
    }
  }), l = W([e, "value"], () => {
    const c = a?.[U], u = o();
    a[U] = u, a?.[lt]?.({
      key: "value",
      value: u,
      oldValue: c,
      trigger: "manual"
    });
  });
  return J(a, Symbol.dispose, l), a;
}, Np = Ip, zp = (e) => {
  const t = be([]);
  return t.push(...Array.from(e?.values?.() || [])), J(t, Symbol.dispose, W(e, (n, r, i) => {
    if (xe(n, i)) if (i == null && n != null) t.push(n);
    else if (i != null && n == null) {
      const s = t.indexOf(i);
      s >= 0 && t.splice(s, 1);
    } else {
      const s = t.indexOf(i);
      s >= 0 && xe(t[s], n) && (t[s] = n);
    }
  })), t;
}, Ur = (e, t, n, r = "value") => {
  const i = typeof e?.[1] == "function" && e?.length == 2, s = (or(e?.[1]) || e?.[1] == Symbol.iterator) && e?.length == 2;
  let o = s && !i ? e?.[1] : Array.isArray(e) ? null : r;
  if (!s && !i && (e = [s ? e?.[0] : e, o]), i && (e[1] = o), o == null || ua(o, e?.[0])) return;
  const a = (d) => {
    let p;
    return d != null && (p = e[0][o], e[0][o] = d), t?.(e?.[0]?.[o], o, p);
  }, l = a(), c = be({
    [Zr]: void 0,
    [U]: l,
    [On]: n,
    [Symbol?.toStringTag]() {
      return String(a() ?? this[U] ?? "") || "";
    },
    [Symbol?.toPrimitive](d) {
      return xt(a() ?? this[U], d);
    },
    set value(d) {
      this[U] = a(d);
    },
    get value() {
      return this[U] = a() ?? this[U];
    }
  }), u = W([e?.[0] ?? e, o ?? "value"], () => {
    const d = c?.[U], p = a();
    c[U] = p, c?.[lt]?.({
      key: "value",
      value: p,
      oldValue: d,
      trigger: "manual"
    });
  });
  return J(c, Symbol.dispose, u), c;
}, Lp = class {
  animations = /* @__PURE__ */ new Map();
  transitions = /* @__PURE__ */ new Map();
  setAnimation(e, t) {
    this.animations.set(e, t);
  }
  getAnimation(e) {
    return this.animations.get(e);
  }
  cancelAnimation(e) {
    const t = this.animations.get(e);
    t && (t.cancel(), this.animations.delete(e));
  }
  setTransition(e, t, n) {
    const r = `${t} ${n.duration || 200}ms ${n.easing || "ease"} ${n.delay || 0}ms`;
    this.transitions.get(t) !== r && (this.transitions.set(t, r), this.updateElementTransitions(e));
  }
  updateElementTransitions(e) {
    const t = Array.from(this.transitions.values()).join(", ");
    e.style.transition = t;
  }
  clearTransitions(e) {
    this.transitions.clear(), e.style.transition = "";
  }
  cancelAll(e) {
    const t = Array.from(this.animations.values());
    for (const n of t) n.cancel();
    this.animations.clear(), this.clearTransitions(e);
  }
  getAnimations() {
    return this.animations;
  }
}, es = /* @__PURE__ */ new WeakMap();
function ks(e) {
  let t = es.get(e);
  return t || (t = new Lp(), es.set(e, t)), t;
}
function $p(e, t, n, r = {}) {
  if (!e || !t) return;
  const i = ks(e), s = e.style.getPropertyValue(t) || getComputedStyle(e)[t], o = Be(n);
  if (s === o) return;
  i.cancelAnimation(t);
  const a = [{ [t]: s }, { [t]: o }], l = {
    duration: r.duration || 200,
    easing: r.easing || "ease",
    delay: r.delay || 0,
    direction: r.direction || "normal",
    iterations: r.iterations || 1,
    fill: r.fill || "forwards"
  }, c = e.animate(a, l);
  i.setAnimation(t, c), c.addEventListener("finish", () => {
    i.cancelAnimation(t), e.style.setProperty(t, o);
  });
}
function Dp(e, t, n, r = {}) {
  if (!e || !t) return;
  const i = ks(e), s = Be(n);
  i.setTransition(e, t, r), e.style.setProperty(t, s);
}
function Fp(e, t, n, r = {}) {
  if (!e || !t) return;
  const i = ks(e), s = Be(n), o = parseFloat(e.style.getPropertyValue(t)) || parseFloat(getComputedStyle(e)[t]) || 0;
  if (Math.abs(o - s) < 0.01) return;
  i.cancelAnimation(t);
  const a = r.stiffness || 100, l = r.damping || 10, c = r.mass || 1, u = r.velocity || 0;
  let d = o, p = u, f;
  const h = () => {
    const y = (-a * (d - s) + -l * p) / c;
    p += y * 0.016, d += p * 0.016;
    const b = t.includes("scale") || t.includes("opacity") ? d.toString() : `${d}px`;
    e.style.setProperty(t, b), Math.abs(d - s) > 0.01 || Math.abs(p) > 0.01 ? f = requestAnimationFrame(h) : (e.style.setProperty(t, t.includes("scale") || t.includes("opacity") ? s.toString() : `${s}px`), i.cancelAnimation(t));
  };
  i.setAnimation(t, { cancel: () => cancelAnimationFrame(f) }), f = requestAnimationFrame(h);
}
function ga(e, t, n = {}) {
  if (!e || !t) return;
  const r = ks(e), i = [{}, {}];
  for (const [a, l] of Object.entries(t)) {
    const c = e.style.getPropertyValue(a) || getComputedStyle(e)[a], u = Be(l);
    i[0][a] = c, i[1][a] = u;
  }
  for (const a of Object.keys(t)) r.cancelAnimation(a);
  const s = {
    duration: n.duration || 300,
    easing: n.easing || "ease-out",
    delay: n.delay || 0,
    direction: n.direction || "normal",
    iterations: n.iterations || 1,
    fill: n.fill || "forwards"
  }, o = e.animate(i, s);
  for (const a of Object.keys(t)) r.setAnimation(a, o);
  o.addEventListener("finish", () => {
    for (const a of Object.keys(t)) {
      r.cancelAnimation(a);
      const l = Be(t[a]);
      e.style.setProperty(a, l);
    }
  });
}
function ni(e, t, n, r = "animate", i = {}) {
  const s = Ye(e), o = Ye(n);
  if (r === "morph") {
    const a = t;
    return ga(pe(s), a, i), W(n, (l) => {
      ga(pe(s), a, i);
    });
  } else {
    const a = t, l = r === "animate" ? $p : r === "transition" ? Dp : Fp;
    return l(pe(s), a, Be(pe(o)), i), W(n, (c) => {
      l(pe(s), a, c, i);
    });
  }
}
var Wp = class _u {
  steps = [];
  addStep(t, n = {}, r = 0) {
    return this.steps.push({
      properties: t,
      options: n,
      delay: r
    }), this;
  }
  async play(t) {
    for (const n of this.steps)
      n.delay && await new Promise((r) => setTimeout(r, n.delay)), await new Promise((r) => {
        ga(t, n.properties, {
          ...n.options,
          fill: "forwards"
        }), setTimeout(r, n.options.duration || 200);
      });
  }
  static create() {
    return new _u();
  }
}, Hp = {
  fade: {
    duration: 200,
    easing: "ease-in-out"
  },
  bounce: {
    duration: 400,
    easing: "cubic-bezier(0.68, -0.55, 0.265, 1.55)"
  },
  elastic: {
    duration: 600,
    easing: "cubic-bezier(0.68, -0.55, 0.265, 1.55)"
  },
  slideIn: (e) => ({
    duration: 300,
    easing: "ease-out",
    transform: `translate${e === "left" || e === "right" ? "X" : "Y"}(${e === "left" || e === "up" ? "-" : ""}100%)`
  }),
  scale: {
    duration: 200,
    easing: "ease-in-out"
  }
};
function Bp(e) {
  const t = es.get(e);
  t && (t.cancelAll(e), es.delete(e));
}
function jp(e, t = "animate", n = {}) {
  const r = typeof e == "number" ? w(e) : Je(e);
  return r.$animationType = t, r.$animationOptions = n, r;
}
var Up = {
  fill: "both",
  delay: 0,
  easing: "linear",
  rangeStart: "cover 0%",
  rangeEnd: "cover 100%",
  duration: 1
}, Vp = async (e, t = {}, n) => {
  if (!e || !n) return;
  const r = n instanceof ScrollTimeline || n instanceof ViewTimeline ? n : n?.timeline;
  if (r instanceof ScrollTimeline || r instanceof ViewTimeline) return e?.animate?.(t, {
    ...Up,
    timeline: r
  });
  const i = Ye(e), s = Ye(n), o = ([c, u]) => {
    const d = pe(i);
    if (d) {
      const p = pe(s)?.value || 0, f = u;
      Er(d, c, f[0] * (1 - p) + f[1] * p);
    }
  }, a = Wa(), l = () => Object.entries(t)?.forEach?.(o);
  return W(n, (c) => a?.schedule?.(l));
}, Qs = (e, t = 100) => typeof globalThis.requestIdleCallback == "function" ? globalThis.requestIdleCallback(e, { timeout: t }) : setTimeout(() => e({
  didTimeout: !1,
  timeRemaining: () => 0
}), 0), qp = /* @__PURE__ */ Symbol.for("lur.e@bank"), kw = globalThis[qp] ??= new Xa(), Gp = /* @__PURE__ */ Symbol.for("lur.e@elMap"), En = globalThis[Gp] ??= new Xa(), Xp = /* @__PURE__ */ Symbol.for("lur.e@alives"), Yp = globalThis[Xp] ??= new FinalizationRegistry((e) => e?.()), Vr = /* @__PURE__ */ Symbol.for("@mapped"), Kp = /* @__PURE__ */ Symbol.for("@virtual"), Fl = /* @__PURE__ */ Symbol.for("@behavior"), Ka = (e) => !!e && typeof e == "object" && "ref" in e && typeof e?.unbind == "function", Ew = (e, t, n) => {
  const r = Ye(e), i = t?.[0] ?? t?.name;
  if (t?.[1] ?? t?.value, n) {
    const s = W?.(t, (o, a, l) => {
      const c = er?.get?.(i);
      n?.([
        o,
        a,
        l
      ], [
        r,
        t,
        c?.get(pe(r))
      ]);
    });
    J(t, Symbol.dispose, s);
  }
  return e;
}, ku = (e, t) => {
  if (Ka(t)) {
    t.bind?.();
    const i = () => t.unbind?.();
    return J(e, Symbol.dispose, i), i;
  }
  const n = {
    click: t,
    input: t,
    change: t
  };
  t?.({ target: e });
  const r = la?.(e, "addEventListener", n);
  return J(e, Symbol.dispose, r), r;
}, Jp = (e, t) => {
  if (t) for (let n of t) ku(e, n);
  return e;
}, Qp = (e, t, n = "value") => {
  const r = Ye(e), i = Ye(t), s = (a) => {
    aa(i, "value", pe(r)?.[n ?? "value"] ?? Be(pe(i)));
  }, o = {
    click: s,
    input: s,
    change: s
  };
  return s?.({ target: e }), la?.(e, "addEventListener", o), aa(i, "value", e?.[n ?? "value"] ?? Be(pe(t))), () => la?.(e, "removeEventListener", o);
}, Zp = (e, t, n = "") => {
  Ye(e);
  const r = Ye(t), i = Qr(n);
  return tu(e, i, (o) => {
    if (o.type == "attributes" && o.attributeName == i) {
      const a = o?.target?.getAttribute?.(o.attributeName), l = pe(r), c = Be(l);
      xe(o.oldValue, a) && l != null && (typeof l == "object" || typeof l == "function") && (xe(c, a) || c == null) && aa(l, "value", a);
    }
  });
}, ey = (e, t, n) => {
  const r = En.get([e, t]);
  if (r) {
    const i = r[n]?.[1];
    delete r[n], i?.();
  }
}, ty = (e, t, n, r) => {
  const i = En.getOrInsertComputed([e, t], () => ({}));
  return i?.[n]?.[1]?.(), i[n] = r, !0;
}, Cw = (e, t) => En.has([e, t]), ri = (e, t, n, r, i, s) => {
  const o = Ka(t) ? t : null;
  o && (o.bind?.(), t = o.ref);
  const a = Ye(e);
  if (e = pe(a), !e || !(e instanceof Node || e?.element instanceof Node)) return;
  let l;
  l && l?.abort?.(), l = new AbortController();
  const c = Ye(t);
  r?.(e, n, t);
  const u = W?.([t, "value"], (f, h, y) => {
    const b = pe(c), m = pe(i), x = pe(a), k = Be(b) ?? Be(f);
    (!m || m?.[n] == b) && (typeof b?.[Fl] == "function" ? b?.[Fl]?.((v = f) => r(x, n, k), [
      f,
      n,
      y
    ], [
      l?.signal,
      n,
      a
    ]) : r(x, n, k));
  });
  let d = null;
  typeof s == "boolean" && s && (r == Ae && (d = Zp(e, t, n)), r == _n && (d = Qp(e, t, n))), typeof s == "function" && (d = s(e, n, t));
  const p = () => {
    d?.disconnect?.(), d != null && typeof d == "function" && d?.(), o?.unbind?.(), u?.(), l?.abort?.(), ey?.(e, r, n);
  };
  if (J(t, Symbol.dispose, p), Yp.register(e, p), !ty(e, r, n, [t, p])) return p;
}, yi = (e, t) => {
  const n = 'input:where([type="text"], [type="number"], [type="range"])', r = Fs(e, "input"), i = r?.name || e?.dataset?.name || "";
  if (t?.[i] != null || i in t) {
    if (t && r?.matches?.(n) && r.value != t[i] && _t(t, () => {
      r.value = t[i], r.dispatchEvent(new Event("change", {
        bubbles: !0,
        cancelable: !0
      }));
    }, i), t) {
      const o = Fs(e, `input:where([type="radio"][name="${i}"][value="${t?.[i]}"])`);
      t && o && t[i] == o.value && !o.checked && _t(t, () => {
        ln(o, t[i]);
      }, i);
    }
    const s = Fs(e, 'input:where([type="checkbox"])');
    t && s && t[i] != s.checked && _t(t, () => {
      ln(s, t[i]);
    }, i);
  }
}, A = (e, t, n, r, i, s) => (r(e, t, Ka(n) ? n.ref : n), ri(e, n, t, r, i, s)), Pw = (e = document.documentElement, t = ".u2-input", n = {}) => {
  n ??= be({});
  const r = new WeakRef(n), i = (c) => {
    const u = pe(r);
    if (!u) return;
    const d = nh(c) ?? c?.target, p = d?.matches?.("input") ? d : d?.querySelector?.("input"), f = (d?.matches?.(t) ? d : p?.closest?.(t)) ?? p, h = p?.name || f?.name || f?.dataset?.name;
    if (u?.[h] != null || h in u) {
      if (p?.matches?.('input:where([type="text"], [type="number"], [type="range"])')) {
        const y = p.valueAsNumber != null && !isNaN(p.valueAsNumber) ? p.valueAsNumber : p.value;
        u[h] != y && (u[h] = y);
      }
      p?.matches?.('input[type="radio"]') && u[h] != p?.value && p?.checked && (u[h] = p.value), p?.matches?.('input[type="checkbox"]') && u[h] != p?.checked && (u[h] = p.checked);
    }
  }, s = () => Qs(() => e.querySelectorAll(t).forEach((c) => yi(c, n)), 100), o = Gi(e, t, (c) => c.addedNodes.forEach((u) => Qs(() => yi(n, u), 100))), a = W?.(n, (c, u) => e.querySelectorAll(t).forEach((d) => yi(d, n)));
  Qs(() => e.querySelectorAll(t).forEach((c) => yi(c, n)), 100), e.addEventListener("input", i), e.addEventListener("change", i), e.addEventListener("u2-appear", s);
  const l = new WeakRef(e);
  return J(n, Symbol.dispose, () => {
    const c = pe(l);
    c?.removeEventListener?.("input", i), c?.removeEventListener?.("change", i), c?.removeEventListener?.("u2-appear", s), o?.disconnect?.(), a?.(), Wi(n);
  }), n;
}, Ge = (e, t, n, r = {}) => ni(e, t, n, "animate", r), wt = (e, t, n, r = {}) => ni(e, t, n, "transition", r), Wt = (e, t, n, r = {}) => ni(e, t, n, "spring", r), ny = (e, t, n = {}) => ni(e, "", t, "morph", n), Aw = jp, Tw = () => Wp.create(), Mw = Bp, Rw = (e, t, n, r = "instant", i = {}) => r === "instant" ? A(e, t, n, R) : (r === "animate" ? Ge : r === "transition" ? wt : Wt)(e, t, n, i), Ow = (e, t) => {
  const n = [];
  return t.forEach((r, i) => {
    const s = r.delay || i * 50, o = {
      ...r.options,
      delay: (r.options?.delay || 0) + s
    }, a = ni(e, r.property, r.value, r.animationType || "animate", o);
    n.push(a);
  }), () => n.forEach((r) => r?.());
}, Iw = {
  fade: (e, t, n = 200) => Ge(e, "opacity", t, {
    duration: n,
    easing: "ease-in-out"
  }),
  slideX: (e, t, n = 300) => Ge(e, "transform", t, {
    duration: n,
    easing: "ease-out"
  }),
  slideY: (e, t, n = 300) => Ge(e, "transform", t, {
    duration: n,
    easing: "ease-out"
  }),
  scale: (e, t, n = 200) => Ge(e, "transform", t, {
    duration: n,
    easing: "ease-in-out"
  }),
  color: (e, t, n = 300) => wt(e, "color", t, {
    duration: n,
    easing: "ease-in-out"
  }),
  backgroundColor: (e, t, n = 300) => wt(e, "background-color", t, {
    duration: n,
    easing: "ease-in-out"
  }),
  bounce: (e, t, n) => Wt(e, t, n, {
    stiffness: 200,
    damping: 15
  }),
  elastic: (e, t, n) => Ge(e, t, n, Hp.elastic)
}, Nw = (e, t, n) => {
  const r = Ye(e), i = Ye(t);
  let s = [];
  const o = (l) => {
    s.forEach((u) => u?.()), s = [];
    const c = l ? n.true : n.false;
    c && c.forEach((u) => {
      const d = Ge(pe(r), u.property, u.value, u.options);
      s.push(d);
    });
  };
  o(Be(pe(i)));
  const a = W(t, (l) => {
    o(!!l);
  });
  return () => {
    s.forEach((l) => l?.()), a?.();
  };
}, mi = (e) => typeof e == "number" && Number.isFinite(e) ? `${e}px` : e, ry = (e, t) => {
  if (!e) return () => {
  };
  const n = [A(e, "--client-x", mi(t?.[0]), R), A(e, "--client-y", mi(t?.[1]), R)];
  return t?.[2] != null && n.push(A(e, "--anchor-width", mi(t?.[2]), R)), t?.[3] != null && n.push(A(e, "--anchor-height", mi(t?.[3]), R)), () => n?.forEach?.((r) => r?.());
}, iy = (e, t) => {
  if (!e) return () => {
  };
  let n = null, r = !1;
  const i = () => {
    if (!r) {
      if (!e.isConnected) {
        n && (n(), n = null);
        return;
      }
      if (!n) {
        const c = t();
        n = typeof c == "function" ? c : null;
      }
    }
  }, s = typeof document < "u" ? document.documentElement : null, o = e?.element ?? e, a = o instanceof Node ? o : null;
  if (!a) return () => {
  };
  const l = typeof MutationObserver < "u" && s ? new MutationObserver((c) => {
    for (const u of c) {
      const d = u.target;
      if (d === a || d instanceof Node && d.contains(a)) {
        i();
        return;
      }
      const p = [...Array.from(u?.addedNodes || []), ...Array.from(u?.removedNodes || [])];
      for (const f of p) if (f === a || f instanceof Node && f.contains(a)) {
        i();
        return;
      }
    }
  }) : null;
  return l && s && l.observe(s, {
    childList: !0,
    subtree: !0
  }), queueMicrotask(() => i()), () => {
    r = !0, l?.disconnect?.(), n?.(), n = null;
  };
}, sy = 0, oy = /* @__PURE__ */ new Set([
  "%",
  "px",
  "cm",
  "mm",
  "q",
  "in",
  "pc",
  "pt",
  "em",
  "ex",
  "ch",
  "cap",
  "ic",
  "lh",
  "rem",
  "rex",
  "rch",
  "rcap",
  "ric",
  "rlh",
  "vw",
  "vh",
  "vi",
  "vb",
  "vmin",
  "vmax",
  "svw",
  "svh",
  "svi",
  "svb",
  "svmin",
  "svmax",
  "lvw",
  "lvh",
  "lvi",
  "lvb",
  "lvmin",
  "lvmax",
  "dvw",
  "dvh",
  "dvi",
  "dvb",
  "dvmin",
  "dvmax",
  "cqw",
  "cqh",
  "cqi",
  "cqb",
  "cqmin",
  "cqmax",
  "deg",
  "grad",
  "rad",
  "turn",
  "s",
  "ms",
  "hz",
  "khz",
  "dpi",
  "dpcm",
  "dppx",
  "x",
  "fr"
]), Eu = (e) => {
  const t = typeof e == "string" ? e.trim() : "";
  if (!t) return !0;
  for (const n of t.split(";")) {
    const r = n.trim();
    if (!r) continue;
    const i = r.indexOf(":");
    if (i < 0 || r.slice(i + 1).trim().length > 0) return !1;
  }
  return !0;
}, Cu = (e) => {
  if (e == null) return;
  const t = e.getAttribute("style");
  t != null && Eu(t) && (e.style.cssText = "", e.removeAttribute("style"));
}, ts = (e, t) => {
  if (Eu(t)) {
    e.style.cssText = "", e.removeAttribute("style");
    return;
  }
  e.style.cssText = t;
}, ns = (e) => {
  if (e == null || typeof e != "object") return !1;
  try {
    const t = globalThis.CSSStyleValue;
    if (typeof t == "function" && e instanceof t) return !0;
    for (let n = e; n; n = Object.getPrototypeOf(n)) if (n?.constructor?.name === "CSSStyleValue") return !0;
  } catch {
  }
  return !1;
}, Pu = (e) => {
  if (e == null || typeof e != "object" || ns(e)) return !1;
  try {
    return "value" in e;
  } catch {
    return !1;
  }
}, Wl = (e) => e == null || typeof e != "object" && typeof e != "function", qr = (e) => e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), Hl = (e, t) => new RegExp(`var\\(\\s*${qr(t)}\\s*\\)`).test(e), ay = (e) => {
  const t = /^(%|[a-zA-Z]+)/.exec(e);
  if (!t) return null;
  const n = t[0], r = n.toLowerCase();
  return oy.has(r) ? {
    authored: n,
    normalized: r,
    length: n.length
  } : null;
}, ly = (e) => {
  switch (e.toLowerCase()) {
    case "%":
      return "percent";
    case "q":
      return "Q";
    case "hz":
      return "Hz";
    case "khz":
      return "kHz";
    case "fr":
      return "flex";
    default:
      return e.toLowerCase();
  }
}, cy = (e) => e.toLowerCase() === "%" ? "percent" : e.toLowerCase(), Gr = (e, t) => e?.[t] ?? globalThis?.[t], qe = (e, t, n) => {
  const r = e?.CSS, i = ly(t), s = r?.[i];
  if (typeof s == "function") return s.call(r, n);
  const o = Gr(e, "CSSUnitValue");
  if (typeof o != "function") throw new TypeError(`Typed OM does not support CSS unit "${t}"`);
  return new o(n, cy(t));
}, Mr = (e) => {
  const t = e.value?.value, n = typeof t == "number" ? t : Number(t);
  if (!Number.isFinite(n)) throw new TypeError(`Reactive CSS value "${String(t)}" is not finite`);
  return n;
}, uy = (e) => {
  const t = Number(e?.value);
  return Number.isFinite(t) ? t : 0;
}, Bl = (e, t) => {
  let n = e;
  for (const r of t) n = n.replace(new RegExp(`var\\(\\s*${qr(r.marker)}\\s*\\)`, "g"), String(r.value));
  return n;
}, jl = (e, t) => {
  const n = qr(t);
  return new RegExp(`^var\\(\\s*${n}\\s*\\)$`).test(e.trim());
}, Ul = (e, t, n) => {
  if (!n) return !1;
  const r = qr(t), i = qr(n);
  return new RegExp(`^calc\\(\\s*var\\(\\s*${r}\\s*\\)\\s*\\*\\s*1${i}\\s*\\)$`, "i").test(e.trim());
}, fy = (e, t, n, r) => {
  if (typeof t?.parseAll == "function") {
    const i = t.parseAll(n, r);
    e.set(n, ...i);
    return;
  }
  if (typeof t?.parse == "function") {
    e.set(n, t.parse(n, r));
    return;
  }
  e.set(n, r);
}, Au = (e) => {
  const t = [];
  let n = 0;
  for (; n < e.length; ) {
    const r = e.slice(n), i = /^\s+/.exec(r);
    if (i) {
      n += i[0].length;
      continue;
    }
    const s = /^var\(\s*(--[a-zA-Z0-9_-]+)\s*\)/.exec(r);
    if (s) {
      t.push({
        kind: "variable",
        marker: s[1]
      }), n += s[0].length;
      continue;
    }
    const o = /^(?:\d*\.\d+|\d+\.?\d*)(?:[eE][+-]?\d+)?/.exec(r);
    if (o) {
      n += o[0].length;
      const c = /^(%|[a-zA-Z]+)/.exec(e.slice(n)), u = c?.[0] ?? null;
      c && (n += c[0].length), t.push({
        kind: "number",
        value: Number(o[0]),
        unit: u == null ? null : u.toLowerCase()
      });
      continue;
    }
    const a = /^[a-zA-Z_][a-zA-Z0-9_-]*/.exec(r);
    if (a) {
      t.push({
        kind: "identifier",
        value: a[0].toLowerCase()
      }), n += a[0].length;
      continue;
    }
    const l = r[0];
    if (l === "+" || l === "-" || l === "*" || l === "/" || l === "(" || l === ")" || l === ",") {
      t.push({
        kind: "symbol",
        value: l
      }), n++;
      continue;
    }
    throw new SyntaxError(`Unsupported Typed OM numeric token near "${r}"`);
  }
  return t;
}, Tu = class {
  tokens;
  win;
  reactiveByMarker;
  typedByMarker;
  index = 0;
  leaves = [];
  constructor(e, t, n, r) {
    this.tokens = e, this.win = t, this.reactiveByMarker = n, this.typedByMarker = r;
  }
  parse() {
    const e = this.parseSum();
    if (this.index !== this.tokens.length) throw new SyntaxError("Unexpected trailing Typed OM expression");
    return {
      root: e,
      leaves: this.leaves
    };
  }
  current() {
    return this.tokens[this.index];
  }
  consume() {
    const e = this.tokens[this.index];
    if (!e) throw new SyntaxError("Unexpected end of Typed OM expression");
    return this.index++, e;
  }
  consumeSymbol(e) {
    const t = this.consume();
    if (t.kind !== "symbol" || t.value !== e) throw new SyntaxError(`Expected "${e}"`);
  }
  matchesSymbol(e) {
    const t = this.current();
    return t?.kind === "symbol" && t.value === e;
  }
  createMath(e, ...t) {
    const n = Gr(this.win, e);
    if (typeof n != "function") throw new TypeError(`${e} is not supported`);
    return new n(...t);
  }
  parseSum() {
    let e = this.parseProduct();
    for (; this.matchesSymbol("+") || this.matchesSymbol("-"); ) {
      const t = this.consume(), n = this.parseProduct();
      if (t.kind !== "symbol") throw new SyntaxError("Expected a sum operator");
      t.value === "+" ? e = this.createMath("CSSMathSum", e, n) : e = this.createMath("CSSMathSum", e, this.createMath("CSSMathNegate", n));
    }
    return e;
  }
  parseProduct() {
    let e = this.parseUnary();
    for (; this.matchesSymbol("*") || this.matchesSymbol("/"); ) {
      const t = this.consume(), n = this.parseUnary();
      if (t.kind !== "symbol") throw new SyntaxError("Expected a product operator");
      t.value === "*" ? e = this.createMath("CSSMathProduct", e, n) : e = this.createMath("CSSMathProduct", e, this.createMath("CSSMathInvert", n));
    }
    return e;
  }
  parseUnary() {
    return this.matchesSymbol("+") ? (this.consume(), this.parseUnary()) : this.matchesSymbol("-") ? (this.consume(), this.createMath("CSSMathNegate", this.parseUnary())) : this.parsePrimary();
  }
  parsePrimary() {
    const e = this.consume();
    if (e.kind === "number") return qe(this.win, e.unit ?? "number", e.value);
    if (e.kind === "variable") {
      const t = this.reactiveByMarker.get(e.marker);
      if (t) {
        if (this.matchesSymbol("*")) {
          const i = this.index;
          this.consume();
          const s = this.current();
          if (s?.kind === "number" && s.value === 1 && typeof s.unit == "string" && (!t.multipliedByUnit || t.multipliedByUnit === s.unit.toLowerCase())) {
            this.consume();
            const o = qe(this.win, s.unit.toLowerCase(), Mr(t));
            return this.leaves.push({
              slot: t,
              value: o
            }), o;
          }
          this.index = i;
        }
        const r = qe(this.win, "number", Mr(t));
        return this.leaves.push({
          slot: t,
          value: r
        }), r;
      }
      const n = this.typedByMarker.get(e.marker);
      if (n) return n.value;
      throw new SyntaxError(`Unknown style slot "${e.marker}"`);
    }
    if (e.kind === "symbol" && e.value === "(") {
      const t = this.parseSum();
      return this.consumeSymbol(")"), t;
    }
    if (e.kind === "identifier") return this.parseFunction(e.value);
    throw new SyntaxError("Expected a Typed OM numeric value");
  }
  parseFunction(e) {
    if (this.consumeSymbol("("), e === "calc") {
      const n = this.parseSum();
      return this.consumeSymbol(")"), n;
    }
    const t = [];
    if (!this.matchesSymbol(")"))
      for (t.push(this.parseSum()); this.matchesSymbol(","); )
        this.consume(), t.push(this.parseSum());
    if (this.consumeSymbol(")"), e === "min") {
      if (t.length === 0) throw new SyntaxError("min() requires a value");
      return this.createMath("CSSMathMin", ...t);
    }
    if (e === "max") {
      if (t.length === 0) throw new SyntaxError("max() requires a value");
      return this.createMath("CSSMathMax", ...t);
    }
    if (e === "clamp") {
      if (t.length !== 3) throw new SyntaxError("clamp() requires three values");
      return this.createMath("CSSMathClamp", t[0], t[1], t[2]);
    }
    throw new SyntaxError(`Unsupported Typed OM function "${e}"`);
  }
}, dy = (e, t, n, r) => {
  const i = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map();
  for (const o of n) i.set(o.marker, o);
  for (const o of r) s.set(o.marker, o);
  return new Tu(Au(e), t, i, s).parse();
}, hy = (e) => e.trim().toLowerCase() === "transform", py = (e, t, n, r) => {
  const i = Au(e), s = [], o = [], a = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map();
  for (const k of n) a.set(k.marker, k);
  for (const k of r) l.set(k.marker, k);
  const c = () => qe(t, "px", 0), u = () => qe(t, "number", 1);
  let d = 0;
  const p = () => i[d], f = () => {
    const k = i[d];
    if (!k) throw new SyntaxError("Unexpected end of transform expression");
    return d++, k;
  }, h = (k) => {
    const v = f();
    if (v.kind !== "symbol" || v.value !== k) throw new SyntaxError(`Expected "${k}"`);
  }, y = () => {
    const k = d;
    let v = 0;
    for (; d < i.length; ) {
      const O = i[d];
      if (O.kind === "symbol" && O.value === "(") {
        v++, d++;
        continue;
      }
      if (O.kind === "symbol" && O.value === ")") {
        if (v === 0) break;
        v--, d++;
        continue;
      }
      if (O.kind === "symbol" && O.value === "," && v === 0) break;
      d++;
    }
    const S = i.slice(k, d);
    if (S.length === 0) throw new SyntaxError("Empty transform function argument");
    const M = new Tu(S, t, a, l).parse();
    return s.push(...M.leaves), M.root;
  }, b = () => {
    const k = [];
    if (h("("), !(p()?.kind === "symbol" && p()?.value === ")"))
      for (k.push(y()); p()?.kind === "symbol" && p()?.value === ","; )
        f(), k.push(y());
    return h(")"), k;
  }, m = (k, v) => {
    const S = (M) => {
      const O = Gr(t, M);
      if (typeof O != "function") throw new TypeError(`${M} is not supported`);
      return O;
    };
    switch (k) {
      case "translate": {
        const M = S("CSSTranslate");
        if (v.length === 1) return new M(v[0], c());
        if (v.length === 2) return new M(v[0], v[1]);
        if (v.length === 3) return new M(v[0], v[1], v[2]);
        throw new SyntaxError("translate() expects 1..3 args");
      }
      case "translatex":
        return new (S("CSSTranslate"))(v[0], c());
      case "translatey":
        return new (S("CSSTranslate"))(c(), v[0]);
      case "translatez":
        return new (S("CSSTranslate"))(c(), c(), v[0]);
      case "translate3d":
        if (v.length !== 3) throw new SyntaxError("translate3d() expects 3 args");
        return new (S("CSSTranslate"))(v[0], v[1], v[2]);
      case "scale": {
        const M = S("CSSScale");
        if (v.length === 1) return new M(v[0], v[0]);
        if (v.length === 2) return new M(v[0], v[1]);
        if (v.length === 3) return new M(v[0], v[1], v[2]);
        throw new SyntaxError("scale() expects 1..3 args");
      }
      case "scalex":
        return new (S("CSSScale"))(v[0], u());
      case "scaley":
        return new (S("CSSScale"))(u(), v[0]);
      case "scalez":
        return new (S("CSSScale"))(u(), u(), v[0]);
      case "scale3d":
        if (v.length !== 3) throw new SyntaxError("scale3d() expects 3 args");
        return new (S("CSSScale"))(v[0], v[1], v[2]);
      case "rotate": {
        const M = S("CSSRotate");
        if (v.length === 1) return new M(v[0]);
        if (v.length === 4) return new M(v[0], v[1], v[2], v[3]);
        throw new SyntaxError("rotate() expects 1 or 4 args");
      }
      case "rotatex":
        return new (S("CSSRotate"))(u(), qe(t, "number", 0), qe(t, "number", 0), v[0]);
      case "rotatey":
        return new (S("CSSRotate"))(qe(t, "number", 0), u(), qe(t, "number", 0), v[0]);
      case "rotatez":
        return new (S("CSSRotate"))(qe(t, "number", 0), qe(t, "number", 0), u(), v[0]);
      case "rotate3d":
        if (v.length !== 4) throw new SyntaxError("rotate3d() expects 4 args");
        return new (S("CSSRotate"))(v[0], v[1], v[2], v[3]);
      case "skew": {
        const M = S("CSSSkew");
        if (v.length === 1) return new M(v[0], qe(t, "deg", 0));
        if (v.length === 2) return new M(v[0], v[1]);
        throw new SyntaxError("skew() expects 1..2 args");
      }
      case "skewx":
        return new (S("CSSSkewX"))(v[0]);
      case "skewy":
        return new (S("CSSSkewY"))(v[0]);
      case "perspective":
        return new (S("CSSPerspective"))(v[0]);
      default:
        throw new SyntaxError(`Unsupported transform function "${k}"`);
    }
  };
  for (; d < i.length; ) {
    const k = f();
    if (k.kind !== "identifier") throw new SyntaxError("Expected a transform function name");
    const v = b();
    o.push(m(k.value, v));
  }
  if (o.length === 0) throw new SyntaxError("Empty transform list");
  const x = Gr(t, "CSSTransformValue");
  if (typeof x != "function") throw new TypeError("CSSTransformValue is not supported");
  return {
    root: new x(o),
    leaves: s
  };
}, Vl = (e, t, n, r, i) => hy(e) ? py(t, n, r, i) : dy(t, n, r, i), Zs = (e, t) => {
  for (const n of t) {
    const r = e.get(n.slot.marker);
    r ? r.push(n) : e.set(n.slot.marker, [n]);
  }
}, eo = (e, t, n) => e.map((r) => ({
  slot: r.slot,
  value: r.value,
  property: t,
  root: n
})), yy = (e, t, n, r, i) => {
  const s = e.ownerDocument.createElement("span");
  s.style.cssText = t, ts(e, "");
  const o = e, a = o.attributeStyleMap ?? o.styleMap, l = e.ownerDocument.defaultView ?? globalThis, c = l?.CSSStyleValue ?? globalThis.CSSStyleValue, u = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Set(), p = [];
  for (let f = 0; f < s.style.length; f++) {
    const h = s.style.item(f), y = s.style.getPropertyValue(h), b = s.style.getPropertyPriority(h), m = n.filter((M) => Hl(y, M.marker)), x = r.filter((M) => Hl(y, M.marker));
    if (m.length === 0 && x.length === 0) {
      e.style.setProperty(h, y, b);
      continue;
    }
    const k = a?.set && !b && !h.startsWith("--");
    let v = !1;
    if (k && x.length > 0) try {
      const M = x.length === 1 && m.length === 0 ? x[0] : null;
      if (M && Ul(y, M.marker, M.multipliedByUnit)) {
        const O = qe(l, M.multipliedByUnit, Mr(M));
        a.set(h, O), Zs(u, eo([{
          slot: M,
          value: O
        }], h, O)), v = !0;
      } else if (M && jl(y, M.marker)) {
        const O = qe(l, "number", Mr(M));
        a.set(h, O), Zs(u, eo([{
          slot: M,
          value: O
        }], h, O)), v = !0;
      } else {
        const O = Vl(h, y, l, x, m);
        a.set(h, O.root), Zs(u, eo(O.leaves, h, O.root)), v = !0;
      }
    } catch {
    }
    if (v) continue;
    if (k && x.length === 0 && m.length > 0) try {
      const M = m.length === 1 ? m[0] : null;
      if (M && jl(y, M.marker))
        a.set(h, M.value), v = !0;
      else if (M && Ul(y, M.marker, M.multipliedByUnit)) {
        const O = Gr(l, "CSSMathProduct");
        if (typeof O != "function") throw new TypeError("CSSMathProduct is not supported");
        const re = new O(M.value, qe(l, M.multipliedByUnit, 1));
        a.set(h, re), v = !0;
      } else {
        try {
          const O = Vl(h, y, l, [], m);
          a.set(h, O.root);
        } catch {
          const O = Bl(y, m);
          fy(a, c, h, O);
        }
        v = !0;
      }
    } catch {
    }
    if (v) continue;
    const S = Bl(y, m);
    e.style.setProperty(h, S, b);
    for (const M of x) d.add(M.marker);
  }
  for (const f of r) {
    const h = u.get(f.marker) ?? [], y = d.has(f.marker);
    if (h.length === 0 && !y) continue;
    const b = A(e, f.marker, f.value, function(...m) {
      if (h.length > 0) try {
        const x = Mr(f), k = /* @__PURE__ */ new Map();
        for (const v of h)
          v.value.value = x, k.set(v.property, v.root);
        if (a?.set) for (const [v, S] of k) a.set(v, S);
      } catch {
      }
      y && R.apply(this, m);
    });
    p.push(b);
  }
  for (const f of d) {
    if (r.some((y) => y.marker === f)) continue;
    const h = i.get(f);
    h != null && p.push(A(e, f, h, R));
  }
  return Cu(e), () => {
    for (const f of p) f?.();
  };
}, ba = (e, ...t) => {
  const n = sy++, r = [], i = /* @__PURE__ */ new Map(), s = [], o = [], a = [], l = new Array(e.length).fill(0);
  for (let c = 0; c < e.length; c++) {
    if (a.push(e[c].slice(l[c])), c >= t.length) continue;
    const u = t[c], d = e[c + 1] ?? "", p = ay(d);
    if (ns(u)) {
      const f = `--fest-typed-${n}-${s.length}`;
      s.push({
        marker: f,
        value: u,
        multipliedByUnit: p?.normalized
      }), p ? (a.push(`calc(var(${f}) * 1${p.authored})`), l[c + 1] += p.length) : a.push(`var(${f})`);
      continue;
    }
    if (Pu(u)) {
      const f = `--fest-ref-${n}-${o.length}`;
      o.push({
        marker: f,
        value: u,
        multipliedByUnit: p?.normalized
      }), p ? (a.push(`calc(var(${f}) * 1${p.authored})`), l[c + 1] += p.length) : a.push(`var(${f})`);
      const h = uy(u);
      r.push(`@property ${f} { syntax: "<number>"; initial-value: ${h}; inherits: true; };`), i.set(f, u);
      continue;
    }
    typeof u != "object" && typeof u != "function" && u != null && String(u).trim() !== "" && a.push(String(u));
  }
  return [
    (c) => yy(c, a.join(""), s, o, i),
    r,
    i
  ];
}, zw = (e, ...t) => ba(e, ...t), my = (e, t) => {
  const n = [], r = [], i = /#\{(\d+)\}/g;
  let s = 0, o;
  for (; (o = i.exec(e)) != null; ) {
    const a = Number.parseInt(o[1], 10);
    !Number.isSafeInteger(a) || a < 0 || (n.push(e.slice(s, o.index)), r.push(t[a]), s = o.index + o[0].length);
  }
  return r.length === 0 ? null : (n.push(e.slice(s)), {
    strings: n,
    values: r
  });
}, vy = (e, t) => {
  let n = e[0] ?? "";
  for (let r = 0; r < t.length; r++) {
    const i = t[r];
    i != null && (n += String(i)), n += e[r + 1] ?? "";
  }
  return n;
}, gy = (e, t) => {
  const n = my(e, t);
  if (!n) return null;
  const { strings: r, values: i } = n;
  return i.length === 1 && (r[0] ?? "").trim() === "" && (r[1] ?? "").trim() === "" && !Wl(i[0]) && !ns(i[0]) ? {
    kind: "direct",
    value: i[0]
  } : i.some((s) => Pu(s) || ns(s)) ? {
    kind: "template",
    binding: ba(r, ...i)
  } : i.every(Wl) ? {
    kind: "static",
    cssText: vy(r, i)
  } : {
    kind: "template",
    binding: ba(r, ...i)
  };
}, by = (e, t) => {
  const n = Array.isArray(t) ? t[0] : t;
  if (typeof n != "function") return () => {
  };
  const r = n(e);
  return () => {
    if (typeof r == "function") {
      r();
      return;
    }
    r?.unbind?.();
  };
}, Mu = (e = null, t, n = !0) => {
  const r = [], i = () => {
    r?.forEach?.(([o, a]) => o?.(...a)), r?.splice?.(0, r?.length);
  };
  return (o, a, l, c, u = null) => {
    const d = te(u) ?? te(e), p = de(o, t, a, d), f = de(l, t, a, d);
    let h = te(p?.parentElement ?? f?.parentElement) ?? d;
    if (!h) return;
    e != h && (e = h);
    const y = Qc(h, f);
    ([
      "add",
      "set",
      "delete"
    ].indexOf(c || "") >= 0 || !c) && (p == null && f != null || c == "delete" ? r?.push?.([Ir, [
      h,
      f,
      null,
      y >= 0 ? y : a
    ]]) : p != null && f == null || c == "add" ? r?.push?.([Xr, [
      h,
      p,
      null,
      a
    ]]) : (p != null && f != null || c == "set") && r?.push?.([Ay, [
      h,
      p,
      null,
      y >= 0 ? y : a,
      f
    ]])), (c && c != "get" && [
      "add",
      "set",
      "delete"
    ].indexOf(c) >= 0 || !c && !n) && i?.();
  };
}, wy = (e) => ((e instanceof Map || e instanceof Set) && (e = Array.from(e?.values?.())), e), ql = (e, t = [], n) => {
  if (!t || !e) return e;
  n = (t?.[Vr] ? t?.mapper : n) ?? n, t = (t?.[Vr] ? t?.children : t) ?? t;
  const r = Array.from(t?.keys?.() || []), i = wy(t)?.map?.((s, o) => de(s, n, r?.[o] ?? o, e));
  return Ty(e, i), i?.forEach?.((s) => Xr(e, s)), e;
}, Sy = class {
  #e = document.createComment("");
  #t;
  #n;
  #s = null;
  #o = null;
  #a = !1;
  #l = {};
  #r;
  #u = null;
  #i = null;
  #c = null;
  makeUpdater(e = null) {
    e && (this.#o?.(), this.#o = null, this.#s = null, this.#s ??= Mu(e, null, !1), this.#o ??= W?.([this.#t, "value"], this._onUpdate.bind(this)));
  }
  get boundParent() {
    return this.#c;
  }
  set boundParent(e) {
    e instanceof HTMLElement && te(e) && e != this.#c && (this.#c = e, this.makeUpdater(e), this.#r && (this.#r?.parentNode != null && this.#r?.remove?.(), this.#r = null), this.element);
  }
  constructor(e, t = (r) => r, n = null) {
    this.#e = document.createComment(""), ne(t) && (typeof e == "function" || typeof e == "object") && !ne(e) && ([e, t] = [t, e]), !n && t != null && typeof t == "object" && !ne(t) && (n = t), this.#u = (t != null ? typeof t == "function" ? t : typeof t == "object" ? t?.mapper : null : null) ?? ((s) => s), this.#r = null, this.#t = (ne(e) ? e : t?.(e, -1)) ?? e, this.#n = document.createDocumentFragment();
    const r = {
      removeNotExistsWhenHasPrimitives: !0,
      uniquePrimitives: !0,
      preMap: !0
    }, i = (te(n) ? null : n) || {};
    this.#l = Object.assign(r, i), this.boundParent = te(this.#l?.boundParent) ?? te(n) ?? null;
  }
  $getNodeBy(e, t) {
    const n = L(ne(t) ? t?.value : t) ? this.#i ??= nr(t) : de(t, t == e ? null : this.#u, -1, e);
    return this.#i != null && (L(t) || ne(t)) && (this.#i.textContent = "" + (t?.value ?? (L(t) ? t : ""))), n;
  }
  $getNode(e, t = !0) {
    const n = L(this.#t?.value) ? this.#i ??= nr(this.#t) : de(this.#t?.value, e == this.#t?.value ? null : this.#u, -1, e);
    return this.#i != null && (L(this.#t) || ne(this.#t)) && (this.#i.textContent = "" + (L(this.#t) ? this.#t : this.#t?.value ?? "")), n != null && t && (this.#r = n), n;
  }
  get [Vr]() {
    return !0;
  }
  elementForPotentialParent(e) {
    return Promise.try(() => {
      const t = this.$getNode(e);
      if (!(!t || !e || t?.contains?.(e) || e == t) && e instanceof HTMLElement && te(e))
        if (Array.from(e?.children).find((n) => n === t)) this.boundParent = e;
        else {
          const n = new MutationObserver((r) => {
            for (const i of r) i.type === "childList" && i.addedNodes.length > 0 && Array.from(i.addedNodes || []).find((s) => s === t) && (this.boundParent = e, n.disconnect());
          });
          n.observe(e, { childList: !0 });
        }
    })?.catch?.(console.warn.bind(console)), this.element;
  }
  get self() {
    const e = this.$getNode(this.boundParent) ?? this.#e, t = te(e?.parentElement) ? e?.parentElement : this.boundParent;
    return this.boundParent ??= te(t) ?? this.boundParent, queueMicrotask(() => {
      const n = te(e?.parentElement) ? e?.parentElement : this.boundParent;
      this.boundParent ??= te(n) ?? this.boundParent;
    }), t ?? this.boundParent ?? e;
  }
  get element() {
    const e = this.$getNode(this.boundParent) ?? this.#e, t = te(e?.parentElement) ? e?.parentElement : this.boundParent;
    return this.boundParent ??= te(t) ?? this.boundParent, queueMicrotask(() => {
      const n = te(e?.parentElement) ? e?.parentElement : this.boundParent;
      this.boundParent ??= te(n) ?? this.boundParent;
    }), e;
  }
  _onUpdate(e, t, n, r) {
    if (L(n) && L(e)) return;
    let i = L(n) ? this.#r : this.$getNodeBy(this.boundParent, n), s = this.$getNode(this.boundParent, !1) ?? this.#e;
    (i && !i?.parentNode || this.#r?.parentNode) && (i = this.#r ?? i);
    let o = this.#s?.(s, Qc(this.boundParent, i), i, r, this.boundParent);
    return s != null && s != this.#r ? this.#r = s : s == null && i != this.#r && (this.#r = i), o;
  }
}, xy = (e) => (typeof e == "object" || typeof e == "function" || typeof e == "symbol") && e != null, Ru = (e, t, n = null) => {
  let r = null;
  if (e instanceof HTMLElement) return Ke(e);
  if (e == null) return document.createComment(":NULL:");
  const i = (typeof t == "function" ? t(e, -1) : e) ?? e;
  if (L(i)) return r ??= nr(ne(e) ? e : i);
  if (r != null && L(i) && (r.textContent = "" + i), i != null && ne(i) && !t) {
    if (L(i?.value)) return i?.value != null ? r ??= nr(i) : document.createComment(":NULL:");
    if (typeof i == "object" || typeof i == "function") return rs.getOrInsertComputed(xy(e) ? e : i, () => new Sy(e, t, n));
  }
  return de(i, null, -1, n);
}, Ou = (e, t) => (t && t != e && !e?.contains?.(t) && te(t) ? e?.elementForPotentialParent?.(t) : null) ?? e?.element, Iu = (e, t) => Ou(e, t) ?? (ne(e) && _e(e?.value) ? e?.value : e), _y = /* @__PURE__ */ Symbol.for("lur.e@__nodeGuard"), to = globalThis[_y] ??= /* @__PURE__ */ new WeakSet(), ky = /* @__PURE__ */ Symbol.for("lur.e@nodeElMap"), rs = globalThis[ky] ??= /* @__PURE__ */ new WeakMap(), Ey = /* @__PURE__ */ Symbol.for("lur.e@tmMap"), Nu = globalThis[Ey] ??= /* @__PURE__ */ new WeakMap(), Es = (e) => L(e) ? e : ne(e) && L(e?.value) && e != null ? Nu?.get(e) : (typeof e == "object" || typeof e == "function") && e != null ? rs?.get?.(e) : e, zu = /* @__PURE__ */ Symbol.for("lur.e@$promiseResolvedMap");
globalThis[zu] ??= /* @__PURE__ */ new WeakMap();
var no = globalThis[zu], Ja = (e, t) => {
  if (no?.has?.(e)) return no?.get?.(e);
  const n = document.createComment(":PROMISE:");
  return e?.then?.((r) => {
    const i = typeof t == "function" ? t(r) : r;
    no?.set?.(e, i), queueMicrotask(() => {
      try {
        if (typeof n?.replaceWith == "function") {
          if (!n?.isConnected) return;
          _e(i) && n?.replaceWith?.(i);
        } else n?.isConnected && _e(i) && n?.parentNode?.replaceChild?.(n, i);
      } catch {
        if (!n?.isConnected) return;
        n?.remove?.();
      }
    });
  }), n;
}, Rr = (e, t, n = -1, r) => t != null ? e = Rr(t?.(e, n), null, -1, r) : ((e instanceof WeakRef || typeof e?.deref == "function") && (e = e.deref()), e instanceof Promise || typeof e?.then == "function" ? Ja(e, (i) => Rr(i, t, n, r)) : _e(e) && !e?.element || _e(e?.element) ? e : ne(e) ? (e instanceof HTMLElement ? Ke : Ru)(e) : typeof e == "object" && e != null ? Es(e) : typeof e == "function" ? Rr(e?.(), t, n, r) : L(e) && e != null ? nr(e) : document.createComment(":NULL:")), Gl = (e, t) => Iu(e, t) ?? _e(e), Cy = (e, t, n = -1, r) => t != null ? e = de(t?.(e, n), null, -1, r) : ((e instanceof WeakRef || typeof e?.deref == "function") && (e = e.deref()), e instanceof Promise || typeof e?.then == "function" ? Ja(e, (i) => de(i, t, n, r)) : _e(e) && !e?.element ? e : _e(e?.element) ? Iu(e, r) : ne(e) ? (e instanceof HTMLElement ? Ke : Ru)(e)?.element : typeof e == "object" && e != null ? Es(e) : typeof e == "function" ? de(e?.(), t, n, r) : L(e) && e != null ? nr(e) : document.createComment(":NULL:")), Xn = (e) => (typeof e == "object" || typeof e == "function" || typeof e == "symbol") && e != null, Lu = (e, t, n = -1, r) => {
  if ((e instanceof WeakRef || typeof e?.deref == "function") && (e = e.deref()), e instanceof Promise || typeof e?.then == "function") return Ja(e, (i) => Lu(i, t, n, r));
  if (Xn(e) && !_e(e)) {
    if (rs.has(e)) {
      const s = Es(e) ?? Rr(e, t, n, r);
      return Gl(s instanceof WeakRef ? s?.deref?.() : s, r);
    }
    const i = Rr(e, t, n, r);
    return !t && i != null && i != e && Xn(e) && !_e(e) && e != null && rs.set(e, i), Gl(i, r);
  }
  return Cy(e, t, n, r);
}, de = (e, t, n = -1, r) => {
  if (Xn(e) && to.has(e)) return Es(e) ?? _e(e);
  Xn(e) && to.add(e);
  const i = Lu(e, t, n, r);
  return Xn(e) && to.delete(e), i;
}, Xl = (e, t, n = -1) => {
  _e(t) && t != null && t?.parentNode != e && (Number.isInteger(n) && n >= 0 && n < e?.childNodes?.length ? e?.insertBefore?.(t, e?.childNodes?.[n]) : e?.append?.(t));
}, Or = (e, t, n = -1) => {
  if (!(!_e(t) || e == t || t?.parentNode == e)) {
    if (t = t?._onUpdate ? Ou(t, e) : t, !t?.parentNode && _e(t)) {
      Xl(e, t, n);
      return;
    }
    e?.parentNode != t?.parentNode && _e(t) && Xl(e, t, n);
  }
}, Py = (e) => ((e instanceof Map || e instanceof Set) && (e = Array.from(e?.values?.())), e), Yl = (e, t, n, r = -1) => {
  const i = t?.length ?? 0;
  if (Array.isArray(gs(t)) || t instanceof Map || t instanceof Set) {
    const s = Py(t)?.map?.((a, l) => de(a, n, l, e))?.filter?.((a) => a != null), o = document.createDocumentFragment();
    s?.forEach?.((a) => Or(o, a)), Or(e, o, r);
  } else {
    const s = de(t, n, i, e);
    s != null && Or(e, s, r);
  }
}, Xr = (e, t, n, r = -1) => {
  n != null && (t = n?.(t, r)), t?.children && Array.isArray(gs(t?.children)) && (t?.[Kp] || t?.[Vr]) ? Yl(e, t?.children, null, r) : Yl(e, t, null, r);
}, $u = (e, t, n = -1) => !e || t?.parentNode == e && t?.parentNode != null ? t : t?.parentNode != e && !te(t?.parentNode) && Number.isInteger(n) && n >= 0 && Array.from(e?.childNodes || [])?.length > n ? e.childNodes?.[n] : t, is = (e, t, n) => {
  if (t?.parentNode) if (t?.parentNode == n?.parentNode)
    if (e = t?.parentNode ?? e, t.nextSibling === n) e.insertBefore(n, t);
    else if (n.nextSibling === t) e.insertBefore(t, n);
    else {
      const r = t.nextSibling;
      e.replaceChild(n, t), e.insertBefore(t, r);
    }
  else t?.replaceWith?.(n);
}, Ay = (e, t, n, r = -1, i) => {
  n != null && (t = n?.(t, r)), e || (e = i?.parentNode);
  const s = $u(e, de(i, n, r), r);
  if (s instanceof Text && typeof t == "string") s.textContent = t;
  else if (t != null) {
    const o = de(t);
    s?.parentNode == e && s != o && s instanceof Text && o instanceof Text ? s?.textContent != o?.textContent && (s.textContent = o?.textContent?.trim?.() ?? "") : s?.parentNode == e && s != o && s != null && s?.parentNode != null ? is(e, s, o) : (s?.parentNode != e || s?.parentNode == null) && Xr(e, o, null, r);
  }
}, Ir = (e, t, n, r = -1) => {
  const i = de(t, n);
  if (e || (e = i?.parentNode), Array.from(e?.childNodes ?? [])?.length < 1) return;
  const s = $u(e, i, r);
  return s?.parentNode == e && s?.remove?.(), e;
}, Ty = (e, t, n) => {
  const r = Array.from(gs(t) || [])?.map?.((i, s) => de(i, n, s));
  return Array.from(e.childNodes).forEach((i) => {
    r?.find?.((s) => !xe?.(s, i)) || i?.remove?.();
  }), e;
}, nr = (e) => {
  if (L(e) && e != null) return document.createTextNode(e);
  if (e == null) return document.createComment(":NULL:");
  if (Xn(e)) return Nu.getOrInsertComputed(e, () => {
    const t = document.createTextNode(((ne(e) ? e?.value : e) ?? "")?.trim?.() ?? "");
    return W([e, "value"], (n) => {
      const r = "" + (n?.innerText ?? n?.textContent ?? n?.value ?? n ?? "");
      t.textContent = r?.trim?.() ?? "";
    }), t;
  });
}, Du = /* @__PURE__ */ Symbol.for("lure.existsQueries");
globalThis[Du] ??= /* @__PURE__ */ new WeakMap();
var Yn = globalThis[Du], Fu = /* @__PURE__ */ Symbol.for("lure.alreadyUsed");
globalThis[Fu] ??= /* @__PURE__ */ new WeakMap();
var Kl = globalThis[Fu], wa = {
  logAll(e) {
    return () => console.log("attributes:", [...e?.attributes].map((t) => ({
      name: t.name,
      value: t.value
    })));
  },
  append(e) {
    return (...t) => t?.forEach?.((n) => Xr(e, n, null, -1));
  },
  appendChildren(e) {
    return (...t) => t?.forEach?.((n) => Xr(e, n, null, -1));
  },
  removeChildren(e) {
    return (...t) => t?.forEach?.((n) => Ir(e, n, null, -1));
  },
  removeChild(e) {
    return (t) => Ir(e, t, null, -1);
  },
  replaceChild(e) {
    return (t, n) => is(e, t, n);
  },
  remove(e) {
    return () => Ir(e?.parentNode, e, null, -1);
  },
  replace(e) {
    return (t) => is(e?.parentNode, e, t);
  },
  current(e) {
    return e;
  }
}, My = 0;
function Wu(e) {
  if (typeof e != "string") throw new TypeError("Pseudo-element type must be a string");
  let t = e.trim();
  if ((t === ":before" || t === ":after") && (t = `:${t}`), !/^::[-_a-zA-Z][-\w]*(?:\((?:[^()"']|"(?:\\.|[^"])*"|'(?:\\.|[^'])*')*\))?$/u.test(t)) throw new TypeError(`Invalid pseudo-element selector: ${t}`);
  return t;
}
function Ry(e) {
  const t = e.getRootNode?.();
  return typeof ShadowRoot < "u" && t instanceof ShadowRoot ? t : e.ownerDocument?.documentElement ?? document.documentElement;
}
function Hu(e, t, n = null) {
  const r = new Iy(e, t, n), i = new Proxy(/* @__PURE__ */ Object.create(null), r);
  return r.self = i, i;
}
var Oy = (e) => (typeof e == "object" || typeof e == "function") && e != null, Iy = class {
  resolveOrigin;
  types;
  pseudoParent;
  self;
  token = `ux-pseudo-${(++My).toString(36)}`;
  children = /* @__PURE__ */ new Map();
  attachedElement = null;
  styleActivated = !1;
  constructor(e, t, n) {
    this.resolveOrigin = e, this.types = t, this.pseudoParent = n;
  }
  get suffix() {
    return this.types.join("");
  }
  get localType() {
    return this.types[this.types.length - 1];
  }
  resolveElement() {
    const e = this.resolveOrigin();
    return this.styleActivated && e !== this.attachedElement ? (this.attachedElement?.classList?.remove?.(this.token), e?.classList?.add?.(this.token), this.attachedElement = e) : this.styleActivated && e && !e.classList.contains(this.token) && e.classList.add(this.token), e;
  }
  activateStyleTarget() {
    return this.styleActivated = !0, this.resolveElement();
  }
  getSelector() {
    return this.activateStyleTarget() ? `.${this.token}${this.suffix}` : null;
  }
  getRule() {
    const e = this.activateStyleTarget();
    if (e)
      return su(`.${this.token}${this.suffix}`, "ux-query-pseudo", Ry(e));
  }
  getStyle() {
    return this.getRule()?.style;
  }
  getComputedStyle() {
    const e = this.resolveElement();
    if (e)
      return (e.ownerDocument?.defaultView ?? window).getComputedStyle(e, this.suffix);
  }
  getNativePseudo() {
    let e = this.resolveElement();
    if (!e) return null;
    for (const t of this.types)
      if (typeof e?.pseudo != "function" || (e = e.pseudo(t), !e)) return null;
    return e;
  }
  getChild(e) {
    const t = Wu(e), n = this.children.get(t);
    if (n) return n;
    const r = Hu(this.resolveOrigin, [...this.types, t], this.self);
    return Oy(t) && this.children.set(t, r), r;
  }
  get(e, t) {
    switch (t) {
      case "type":
        return this.localType;
      case "element":
        return this.resolveElement();
      case "parent":
        return this.pseudoParent ?? this.resolveElement();
      case "native":
        return this.getNativePseudo();
      case "selector":
        return this.getSelector();
      case "style":
        return this.getStyle();
      case "attributeStyleMap": {
        const r = this.getRule();
        return r?.styleMap ?? r?.attributeStyleMap;
      }
      case "computedStyle":
        return this.getComputedStyle();
      case "getComputedStyle":
        return () => this.getComputedStyle();
      case "pseudo":
        return (r) => this.getChild(r);
      case "addEventListener":
        return (...r) => {
          const i = this.getNativePseudo();
          if (typeof i?.addEventListener != "function") throw new DOMException("CSSPseudoElement events are not supported by this browser", "NotSupportedError");
          return i.addEventListener(...r);
        };
      case "removeEventListener":
        return (...r) => {
          const i = this.getNativePseudo();
          if (typeof i?.removeEventListener == "function")
            return i.removeEventListener(...r);
        };
      case "dispose":
        return () => {
          this.attachedElement?.classList?.remove?.(this.token), this.attachedElement = null, this.styleActivated = !1;
        };
      case Symbol.toStringTag:
        return "CSSPseudoElement";
      case Symbol.toPrimitive:
        return () => this.getSelector() ?? this.suffix;
    }
    const n = this.getNativePseudo();
    if (n && t in n) {
      const r = n[t];
      return typeof r == "function" ? r.bind(n) : r;
    }
    if (typeof t == "string") {
      const r = this.getStyle();
      if (r && (t.startsWith("--") || t in r)) return r[t];
    }
  }
  set(e, t, n) {
    if (typeof t != "string") return !1;
    const r = this.getStyle();
    return r ? t === "cssText" ? (r.cssText = String(n ?? ""), !0) : t.startsWith("--") ? (r.setProperty(t, String(n ?? "")), !0) : t in r ? (r[t] = n == null ? "" : String(n), !0) : !1 : !1;
  }
  has(e, t) {
    if (t === "type" || t === "element" || t === "parent" || t === "native" || t === "selector" || t === "style" || t === "computedStyle" || t === "attributeStyleMap" || t === "getComputedStyle" || t === "pseudo") return !0;
    const n = this.getNativePseudo();
    if (n && t in n) return !0;
    if (typeof t == "string") {
      const r = this.getStyle();
      return !!r && (t.startsWith("--") || t in r);
    }
    return !1;
  }
  deleteProperty(e, t) {
    if (typeof t != "string") return !1;
    const n = this.getStyle();
    return n ? t.startsWith("--") ? (n.removeProperty(t), !0) : t in n ? (n[t] = "", !0) : !1 : !1;
  }
}, Ny = class {
  target;
  currentTarget;
  selector;
  eventName;
  callback;
  constructor(e, t, n, r, i) {
    this.target = e, this.currentTarget = t, this.selector = n, this.eventName = r, this.callback = i;
  }
  get(e, t, n) {
    return t === "currentTarget" && typeof this.selector == "string" ? Dr(this.target, this.selector) : t === "currentTarget" && typeof this.selector != "string" ? this.currentTarget ?? this.selector : Reflect.get(this.target, t, n);
  }
  set(e, t, n) {
    return Reflect.set(this.target, t, n);
  }
  has(e, t) {
    return Reflect.has(this.target, t);
  }
  deleteProperty(e, t) {
    return Reflect.deleteProperty(this.target, t);
  }
  ownKeys(e) {
    return Reflect.ownKeys(this.target);
  }
  defineProperty(e, t, n) {
    return Reflect.defineProperty(this.target, t, n);
  }
  apply(e, t, n) {
    return Reflect.apply(this.target, t, n);
  }
  construct(e, t) {
    return Reflect.construct(this.target, t);
  }
  getPrototypeOf(e) {
    return Reflect.getPrototypeOf(this.target);
  }
  setPrototypeOf(e, t) {
    return Reflect.setPrototypeOf(this.target, t);
  }
  isExtensible(e) {
    return Reflect.isExtensible(this.target);
  }
  preventExtensions(e) {
    return Reflect.preventExtensions(this.target);
  }
  getOwnPropertyDescriptor(e, t) {
    return Reflect.getOwnPropertyDescriptor(this.target, t);
  }
}, ro = class {
  direction = "children";
  selector;
  index = 0;
  _pseudoMap = /* @__PURE__ */ new Map();
  _observeMap = /* @__PURE__ */ new WeakMap();
  _callbackMap = /* @__PURE__ */ new WeakMap();
  _eventMap = /* @__PURE__ */ new WeakMap();
  constructor(e, t = 0, n = "children") {
    this.index = t, this.selector = e, this.direction = n;
  }
  _resolveSelectedElement(e) {
    const t = this._getArray(e), n = t.length > 0 ? t[this.index] : this._getSelected(e), r = n?.element ?? n;
    return r instanceof Element ? r : null;
  }
  _getPseudo(e, t) {
    const n = Wu(t), r = this._pseudoMap.get(n);
    if (r) return r;
    const i = Hu(() => this._resolveSelectedElement(e), [n], null);
    return this._pseudoMap.set(n, i), i;
  }
  _observeDOMChange(e, t, n) {
    return typeof t == "string" ? Gi(e, t, n) : null;
  }
  _observeAttributes(e, t, n) {
    return typeof this.selector == "string" ? Ha(e, this.selector, t, n) : tu(e ?? this.selector, t, n);
  }
  _getArrayPrimary(e) {
    if (typeof e == "function" && (e = this.selector || e?.(this.selector)), !this.selector) return [e];
    if (typeof this.selector == "string") {
      const t = typeof e?.matches == "function" && e?.element != null && e?.matches?.(this.selector) ? [e] : [];
      if (this.direction == "children") {
        const n = typeof e?.querySelectorAll == "function" && e?.element != null ? [...e?.querySelectorAll?.(this.selector)] : [];
        return n?.length >= 1 ? [...n] : t;
      } else if (this.direction == "parent") {
        const n = e?.closest?.(this.selector);
        return n ? [n] : t;
      }
      return t;
    }
    return Array.isArray(this.selector) ? this.selector : [this.selector];
  }
  _getArray(e) {
    const t = e?.self ?? e;
    return this._observeMap.getOrInsertComputed(t, () => {
      const n = this._getArrayPrimary(t);
      let r = be(Array.isArray(n) ? n : [this._getSelected(t)]);
      return this.direction == "children" && Gi(t, typeof this.selector == "string" ? this.selector : void 0, (i, s) => {
        (i?.addedNodes?.length > 0 || i?.removedNodes?.length > 0) && (i?.addedNodes?.forEach((o) => {
          (o?.element ?? o) && !r?.includes?.(o?.element ?? o) && r?.push?.(o?.element ?? o);
        }), i?.removedNodes?.forEach((o) => {
          const a = r.indexOf(o?.element ?? o);
          a > -1 && r.splice(a, 1);
        }));
      }), r;
    });
  }
  _getSelected(e) {
    const t = e?.self ?? e, n = this._selector(e);
    if (typeof n == "string") {
      if (this.direction == "children") return t?.matches?.(n) ? t : t?.querySelector?.(n);
      if (this.direction == "parent") return t?.matches?.(n) ? t : t?.closest?.(n);
    }
    return t == (n?.element ?? n) ? n?.element ?? n : null;
  }
  _redirectToBubble(e) {
    return typeof this._selector() == "string" && {
      pointerenter: "pointerover",
      pointerleave: "pointerout",
      mouseenter: "mouseover",
      mouseleave: "mouseout",
      focus: "focusin",
      blur: "focusout"
    }[e] || e;
  }
  _addEventListener(e, t, n, r) {
    const i = this._selector(e), s = (u) => n?.call?.(u?.target ?? e, new Proxy(u, new Ny(u?.target ?? e, u?.currentTarget ?? e, i, t, n)));
    if (this._callbackMap.set(n, {
      wrap: s,
      option: r
    }), typeof i != "string")
      return i?.addEventListener?.(t, s, r), s;
    const o = this._redirectToBubble(t), a = e?.self ?? e, l = (u) => {
      const d = this._selector(e), p = u?.currentTarget ?? a;
      let f = null;
      if (u?.composedPath && typeof u.composedPath == "function") {
        const h = u.composedPath();
        for (const y of h) if (y instanceof HTMLElement || y instanceof Element) {
          const b = y?.element ?? y;
          if (typeof d == "string") {
            if (Dr(b, d, u)) {
              f = b;
              break;
            }
          } else if (ui(d, b, u)) {
            f = b;
            break;
          }
        }
      }
      f || (f = u?.target ?? this._getSelected(e) ?? p, f = f?.element ?? f), typeof d == "string" ? ui(p, Dr(f, d, u), u) && this._callbackMap.get(n)?.wrap?.call?.(f, u) : ui(p, d, u) && ui(d, f, u) && this._callbackMap.get(n)?.wrap?.call?.(f, u);
    };
    a?.addEventListener?.(o, l, r);
    const c = this._eventMap.getOrInsert(a, /* @__PURE__ */ new Map()).getOrInsert(o, /* @__PURE__ */ new WeakMap());
    return c.set(n, {
      wrap: l,
      option: r
    }), c.set(s, {
      wrap: l,
      option: r
    }), l;
  }
  _removeEventListener(e, t, n, r) {
    n = this._callbackMap.get(n)?.wrap ?? n, r = this._callbackMap.get(n)?.option ?? r;
    const i = this._selector(e);
    if (typeof i != "string")
      return i?.removeEventListener?.(t, n, r), n;
    const s = e?.self ?? e, o = this._redirectToBubble(t), a = this._eventMap.get(s);
    if (!a) return;
    const l = a.get(o)?.get?.(n);
    s?.removeEventListener?.(o, l?.wrap ?? n, r ?? l?.option ?? {}), l?.size != null && l?.size == 0 && a?.delete?.(o), a?.size == 0 && this._eventMap.delete(s);
  }
  _selector(e) {
    return typeof this.selector == "string" && typeof e?.selector == "string" ? ((e?.selector || "") + " " + this.selector).trim?.() : this.selector;
  }
  get(e, t, n) {
    const r = this._getArray(e), i = r.length > 0 ? r[this.index] : this._getSelected(e);
    if (t === "pseudo") return (o) => this._getPseudo(e, o);
    if (t in wa) return wa?.[t]?.(i);
    if (t == "length" && r?.length != null) return r?.length;
    if (t == "_updateSelector") return (o) => this.selector = o || this.selector;
    if (["style", "attributeStyleMap"].indexOf(t) >= 0) {
      const o = e?.self ?? e, a = this._selector(e), l = typeof a == "string" ? su(a, "ux-query", o) : i;
      return t == "attributeStyleMap" ? l?.styleMap ?? l?.attributeStyleMap : l?.[t];
    }
    if (t == "self") return e?.self ?? e;
    if (t == "selector") return this._selector(e);
    if (t == "observeAttr") return (o, a) => this._observeAttributes(e, o, a);
    if (t == "DOMChange") return (o) => this._observeDOMChange(e, this.selector, o);
    if (t == "addEventListener") return (o, a, l) => this._addEventListener(e, o, a, l);
    if (t == "removeEventListener") return (o, a, l) => this._removeEventListener(e, o, a, l);
    if (t == "getAttribute") return (o) => {
      const a = this._getArray(e), l = a.length > 0 ? a[this.index] : this._getSelected(e), c = Yn?.get?.(e)?.get?.(this.selector) ?? l, u = En?.get?.([c, Ae]);
      return u?.[o] ? u[o]?.[0] : l?.getAttribute?.(o);
    };
    if (t == "setAttribute") return (o, a) => {
      const l = this._getArray(e), c = l.length > 0 ? l[this.index] : this._getSelected(e);
      return typeof a == "object" && (a?.value != null || "value" in a) ? A(c, o, a, Ae, null, !0) : c?.setAttribute?.(o, a);
    };
    if (t == "removeAttribute") return (o) => {
      const a = this._getArray(e), l = a.length > 0 ? a[this.index] : this._getSelected(e), c = Yn?.get?.(e)?.get?.(this.selector) ?? l, u = En?.get?.([c, Ae]);
      return u?.[o] ? u[o]?.[1]?.() : l?.removeAttribute?.(o);
    };
    if (t == "hasAttribute") return (o) => {
      const a = this._getArray(e), l = a.length > 0 ? a[this.index] : this._getSelected(e), c = Yn?.get?.(e)?.get?.(this.selector) ?? l;
      return En?.get?.([c, Ae])?.[o] ? !0 : l?.hasAttribute?.(o);
    };
    if (t == "element") {
      if (r?.length <= 1) return i?.element ?? i;
      const o = document.createDocumentFragment();
      return o.append(...r), o;
    }
    if (t == Symbol.toPrimitive && (this.selector?.includes?.("input") || this.selector?.matches?.("input")))
      return (o) => o == "number" ? (i?.element ?? i)?.valueAsNumber ?? parseFloat((i?.element ?? i)?.value) : o == "string" ? String((i?.element ?? i)?.value ?? i?.element ?? i) : o == "boolean" ? (i?.element ?? i)?.checked : (i?.element ?? i)?.checked ?? (i?.element ?? i)?.value ?? i?.element ?? i;
    if (t == "checked" && (this.selector?.includes?.("input") || this.selector?.matches?.("input")))
      return (i?.element ?? i)?.checked;
    if (t == "value" && (this.selector?.includes?.("input") || this.selector?.matches?.("input")))
      return (i?.element ?? i)?.valueAsNumber ?? (i?.element ?? i)?.valueAsDate ?? (i?.element ?? i)?.value ?? (i?.element ?? i)?.checked;
    if (t == An && (this.selector?.includes?.("input") || this.selector?.matches?.("input")))
      return (o) => {
        let a = i?.value;
        const l = [(c) => {
          const u = this._getSelected(c?.target);
          o?.(u?.value, "value", a), a = u?.value;
        }, { passive: !0 }];
        return this._addEventListener(e, "change", ...l), () => this._removeEventListener(e, "change", ...l);
      };
    if (t == "deref" && (typeof i == "object" || typeof i == "function") && i != null) {
      const o = new WeakRef(i);
      return () => o?.deref?.()?.element ?? o?.deref?.();
    }
    if (typeof t == "string" && /^\d+$/.test(t)) return r[parseInt(t)];
    const s = i;
    return s?.[t] != null ? typeof s[t] == "function" ? s[t].bind(s) : s[t] : r?.[t] != null ? typeof r[t] == "function" ? r[t].bind(r) : r[t] : typeof e?.[t] == "function" ? e?.[t].bind(s) : e?.[t];
  }
  set(e, t, n) {
    const r = this._getArray(e), i = r.length > 0 ? r[this.index] : this._getSelected(e);
    return typeof t == "string" && /^\d+$/.test(t) || r[t] != null ? !1 : (i && (i[t] = n), !0);
  }
  has(e, t) {
    const n = this._getArray(e), r = n.length > 0 ? n[this.index] : this._getSelected(e);
    return typeof t == "string" && /^\d+$/.test(t) && n[parseInt(t)] != null || n[t] != null || r && t in r;
  }
  deleteProperty(e, t) {
    const n = this._getArray(e), r = n.length > 0 ? n[this.index] : this._getSelected(e);
    return r && t in r ? (delete r[t], !0) : !1;
  }
  ownKeys(e) {
    const t = this._getArray(e), n = t.length > 0 ? t[this.index] : this._getSelected(e), r = /* @__PURE__ */ new Set();
    return t.forEach((i, s) => r.add(s.toString())), Object.getOwnPropertyNames(t).forEach((i) => r.add(i)), n && Object.getOwnPropertyNames(n).forEach((i) => r.add(i)), Array.from(r);
  }
  defineProperty(e, t, n) {
    return Reflect.defineProperty(e, t, n);
  }
}, Ke = (e, t = document.documentElement, n = 0, r = "children") => {
  if ((e?.element ?? e) instanceof HTMLElement) {
    const i = e?.element ?? e;
    return Kl.getOrInsert(i, new Proxy(i, new ro("", n, r)));
  }
  if (typeof e == "function") {
    const i = e;
    return Kl.getOrInsert(i, new Proxy(i, new ro("", n, r)));
  }
  return t == null || typeof t == "string" || typeof t == "number" || typeof t == "boolean" || typeof t == "symbol" || typeof t > "u" ? null : Yn?.get?.(t)?.has?.(e) ? Yn?.get?.(t)?.get?.(e) : Yn?.getOrInsert?.(t, /* @__PURE__ */ new Map())?.getOrInsertComputed?.(e, () => new Proxy(t, new ro(e, n, r)));
}, Lw = (e = {}) => Object.assign(wa, e), ar = (e) => L(e) ? [] : Array.isArray(e) ? e.map((t, n) => [n, t]) : e instanceof Map ? Array.from(e.entries()) : e instanceof Set ? Array.from(e.values()) : Array.from(Object.entries(e)), zy = (e) => Array.isArray(e) && typeof e[0] == "function", Ly = (e, t) => {
  if (!t) return e;
  const n = new WeakRef(t), r = new WeakRef(e);
  if (typeof t == "object" || typeof t == "function") {
    ar(t).forEach(([s, o]) => {
      Ae(r?.deref?.(), s, o);
    });
    const i = W(t, (s, o) => {
      Ae(r?.deref?.(), o, s), ri(r?.deref?.(), s, o, Ae, n, !0);
    });
    J(t, Symbol.dispose, i), J(e, Symbol.dispose, i);
  } else console.warn("Invalid attributes object:", t);
}, $y = (e, t) => {
  if (!t) return e;
  const n = new WeakRef(t), r = new WeakRef(e);
  if (typeof t == "object" || typeof t == "function") {
    ar(t).forEach(([s, o]) => {
      Ae(r?.deref?.(), "aria-" + (s?.toString?.() || s || ""), o);
    });
    const i = W(t, (s, o) => {
      Ae(r?.deref?.(), "aria-" + (o?.toString?.() || o || ""), s, !0), ri(r, s, o, Ae, n, !0);
    });
    J(t, Symbol.dispose, i), J(e, Symbol.dispose, i);
  } else console.warn("Invalid ARIA object:", t);
  return e;
}, Dy = (e, t) => {
  if (!t) return e;
  const n = new WeakRef(t), r = new WeakRef(e);
  if (typeof t == "object" || typeof t == "function") {
    ar(t).forEach(([s, o]) => {
      Us(r?.deref?.(), s, o);
    });
    const i = W(t, (s, o) => {
      Us(r?.deref?.(), o, s), ri(r?.deref?.(), s, o, Us, n);
    });
    J(t, Symbol.dispose, i), J(e, Symbol.dispose, i);
  } else console.warn("Invalid dataset object:", t);
  return e;
}, Bu = (e, t) => {
  if (!t) return e;
  if (typeof t == "string") ts(e, t);
  else if (typeof t?.value == "string") W([t, "value"], (n) => {
    ts(e, n ?? "");
  });
  else if (zy(t) || typeof t == "function") by(e, t);
  else if (typeof t == "object") {
    const n = new WeakRef(t), r = new WeakRef(e);
    ar(t).forEach(([s, o]) => {
      R(r?.deref?.(), s, o);
    });
    const i = W(t, (s, o) => {
      R(r?.deref?.(), o, s), ri(r?.deref?.(), s, o, R, n?.deref?.());
    });
    J(t, Symbol.dispose, i), J(e, Symbol.dispose, i);
  } else console.warn("Invalid styles object:", t);
  return e;
}, Fy = async (e, t) => {
  const n = await t?.(e);
  return Bu(e, n);
}, Wy = (e, t) => {
  if (!t) return e;
  const n = new WeakRef(t), r = new WeakRef(e), i = (o) => {
    const a = Ke("input", o?.target);
    a?.value != null && xe(a?.value, t?.value) && (t.value = a?.value), a?.valueAsNumber != null && xe(a?.valueAsNumber, t?.valueAsNumber) && (t.valueAsNumber = a?.valueAsNumber), a?.checked != null && xe(a?.checked, t?.checked) && (t.checked = a?.checked);
  };
  ar(t).forEach(([o, a]) => {
    _n(r?.deref?.(), o, a);
  });
  const s = W(t, (o, a) => {
    const l = r.deref();
    l && (a == "checked" ? ln(l, o) : A(l, a, o, _n, n?.deref?.(), !0));
  });
  return J(t, Symbol.dispose, s), J(e, Symbol.dispose, s), e.addEventListener("change", i), e;
}, Hy = (e, t) => {
  if (!t) return e;
  const n = new WeakRef(e);
  ar(t).forEach(([i, s]) => {
    const o = e;
    typeof s > "u" || s == null ? o.classList.contains(s) && o.classList.remove(s) : o.classList.contains(s) || o.classList.add(s);
  });
  const r = Ya(t, (i) => {
    const s = n?.deref?.();
    s && (typeof i > "u" || i == null ? s.classList.contains(i) && s.classList.remove(i) : s.classList.contains(i) || s.classList.add(i));
  });
  return J(t, Symbol.dispose, r), J(e, Symbol.dispose, r), e;
}, By = (e) => ((e instanceof Map || e instanceof Set) && (e = Array.from(e?.values?.())), e), io = (e) => e != null && e.nodeType === 1 && e.nodeName !== "BODY" && typeof e.insertBefore == "function", jy = class {
  #e;
  #t;
  #n;
  #s;
  #o;
  #a;
  #l = null;
  #r = null;
  #u = {};
  #i = document.createComment("");
  #c = /* @__PURE__ */ new Set();
  #d = !1;
  #y = null;
  #h = null;
  #f() {
    const e = this.#e, t = e?.value ?? e;
    return t instanceof Map || t instanceof Set ? Array.from(t.values()) : Array.isArray(t) ? t : [];
  }
  #v(e) {
    const t = this.#e?.value ?? this.#e;
    return !(t instanceof Map) || typeof e != "number" ? e : Array.from(t.keys())[e];
  }
  #g() {
    const e = this.#e?.value ?? this.#e;
    if (!(e instanceof Map)) {
      this.#a.clear();
      return;
    }
    const t = new Set(e.keys());
    for (const n of this.#a.keys()) t.has(n) || this.#a.delete(n);
  }
  #p() {
    this.#y?.disconnect(), this.#y = null;
  }
  #m() {
    const e = this.#h;
    if (!e) return;
    this.#g();
    const t = [];
    this.#f().forEach((i, s) => {
      const o = de(i, this.mapper.bind(this), s, e);
      o instanceof DocumentFragment ? t.push(...Array.from(o.childNodes)) : o instanceof Node && t.push(o);
    });
    const n = new Set(t);
    if (this.#i.parentNode !== e) {
      const i = t.find((s) => s.parentNode === e);
      i ? e.insertBefore(this.#i, i) : e.appendChild(this.#i);
    }
    for (const i of this.#c) !n.has(i) && i.parentNode === e && i.parentNode.removeChild(i);
    let r = this.#i.nextSibling;
    for (const i of t)
      (i.parentNode !== e || i !== r) && e.insertBefore(i, r), r = i.nextSibling;
    this.#c = n;
  }
  #b() {
    this.#d || (this.#d = !0, queueMicrotask(() => {
      this.#d = !1, this.#m();
    }));
  }
  makeUpdater(e = null) {
    e && (this.#r?.(), this.#r = null, this.#l = null, this.#l ??= Mu(e, this.mapper.bind(this), !0), this.#r ??= Ya?.(this.#e, this._onUpdate.bind(this)));
  }
  get boundParent() {
    return this.#h;
  }
  set boundParent(e) {
    if (io(e) && e != this.#h) {
      this.#p();
      const t = this.#h;
      for (const n of this.#c) n.parentNode === t && t !== e && t?.removeChild(n);
      this.#h = e, this.makeUpdater(e), this.#m();
    }
  }
  constructor(e, t = (r) => r, n = null) {
    ci(t) && (typeof e == "function" || typeof e == "object") && !ci(e) && ([e, t] = [t, e]), !n && t != null && typeof t == "object" && !ci(t) && (n = t), this.#i = document.createComment(""), this.#s = /* @__PURE__ */ new WeakMap(), this.#o = /* @__PURE__ */ new Map(), this.#a = /* @__PURE__ */ new Map(), this.#n = (t != null ? typeof t == "function" ? t : typeof t == "object" ? t?.mapper : null : null) ?? ((s) => s), this.#e = (ci(e) ? e : e?.iterator ?? t?.iterator ?? e) ?? [], this.#t = document.createDocumentFragment();
    const r = {
      removeNotExistsWhenHasPrimitives: !0,
      uniquePrimitives: !0,
      preMap: !0
    }, i = (te(n) ? null : n) || {};
    this.#u = Object.assign(r, i), this.boundParent = te(this.#u?.boundParent) ?? te(n) ?? null, this.boundParent || this.#u.preMap && (ql(this.#t, this.#f(), this.mapper.bind(this)), this.#t.childNodes.length === 0 && this.#t.appendChild(this.#i));
  }
  get [Vr]() {
    return !0;
  }
  elementForPotentialParent(e) {
    try {
      if (this.#f().length === 0 && io(e))
        return this.#p(), this.#h = e, this.makeUpdater(e), this.#m(), this.element;
      const t = de(this.#f()?.[0], this.mapper.bind(this), 0);
      if (!e || t?.contains?.(e) || e == t) return;
      if (io(e)) if (!t) this.boundParent = e;
      else if (Array.from(e?.children).find((n) => n === t)) this.boundParent = e;
      else {
        this.#p();
        const n = new MutationObserver((r) => {
          for (const i of r) i.type === "childList" && i.addedNodes.length > 0 && Array.from(i.addedNodes || []).find((s) => s === t) && (this.boundParent = e, n.disconnect());
        });
        this.#y = n, n.observe(e, { childList: !0 });
      }
    } catch (t) {
      console.warn(t);
    }
    return this.element;
  }
  get children() {
    return By(this.#f());
  }
  get self() {
    const e = de(this.#f()?.[0], this.mapper.bind(this), 0), t = te(e?.parentElement) ? e?.parentElement : this.boundParent;
    return this.boundParent ??= te(t) ?? this.boundParent, queueMicrotask(() => {
      const n = te(e?.parentElement) ? e?.parentElement : this.boundParent;
      this.boundParent ??= te(n) ?? this.boundParent;
    }), t ?? this.boundParent ?? ql(this.#t, this.#f(), this.mapper.bind(this));
  }
  get element() {
    const e = this.#t?.childNodes?.length > 0 ? this.#t : de(this.#f()?.[0], this.mapper.bind(this), 0), t = te(e?.parentElement) ? e?.parentElement : this.boundParent;
    return this.boundParent ??= te(t) ?? this.boundParent, queueMicrotask(() => {
      const n = te(e?.parentElement) ? e?.parentElement : this.boundParent;
      this.boundParent ??= te(n) ?? this.boundParent;
    }), e;
  }
  get mapper() {
    return (...e) => {
      const t = this.#e?.value ?? this.#e;
      if (e?.[0] == null) return null;
      if (e?.[0] instanceof Node) return e?.[0];
      if (e?.[0] instanceof Promise || typeof e?.[0]?.then == "function") return null;
      if (t instanceof Map) {
        const n = this.#v(e?.[1]), r = [
          e?.[0],
          n,
          ...e.slice(2)
        ], i = this.#a.get(n);
        if (i && Object.is(i.value, e?.[0])) return i.node;
        const s = this.#n(...r);
        return this.#a.set(n, {
          value: e?.[0],
          node: s
        }), s;
      }
      if (!((e?.[1] == null || e?.[1] < 0 || typeof e?.[1] != "number" || !Rd(e?.[1])) && (Array.isArray(t) || t instanceof Set))) {
        if (e?.[0] != null && (typeof e?.[0] == "object" || typeof e?.[0] == "function" || typeof e?.[0] == "symbol")) return this.#s.getOrInsert(e?.[0], this.#n(...e));
        if (e?.[0] != null && t instanceof Set) return this.#o.getOrInsert(e?.[0], this.#n(...e));
        if (e?.[0] != null) return this.#u?.uniquePrimitives && L(e?.[0]) ? this.#o.getOrInsert(e?.[0], this.#n(...e)) : this.#n(...e);
      }
    };
  }
  _onUpdate(e, t, n, r = "") {
    this.#b();
  }
  [Symbol.dispose]() {
    this.#r?.(), this.#r = null, this.#p(), this.#d = !1;
    for (const e of this.#c) e.parentNode && e.parentNode.removeChild(e);
    this.#c.clear(), this.#i.parentNode?.removeChild(this.#i), this.#a.clear(), this.#o.clear(), this.#s = /* @__PURE__ */ new WeakMap(), this.#h = null;
  }
  *[Symbol.iterator]() {
    let e = 0;
    if (this.#f()) for (let t of this.#f()) yield this.mapper(t, e++);
  }
}, Qa = (e, t, n = null) => new jy(e, t, n), Uy = (e, t = document.documentElement) => {
  if (e?.value == null) return Ke(e, t);
  const n = Ke(e?.value, t);
  return W(e, (r, i) => n?._updateSelector(r)), n;
}, Vy = (e) => {
  if (typeof e == "string") {
    const t = Uy(eh(e));
    return t?.element ?? t;
  } else return e instanceof HTMLElement || e instanceof Element || e instanceof DocumentFragment || e instanceof Document || e instanceof Node ? e : null;
}, Cs = (e, t = {}, n) => {
  const r = de(typeof e == "string" ? Vy(e) : e, null, -1);
  return r && n && Qa(n, (i) => i, r), r && t && (t.ctrls != null && Jp(r, t.ctrls), t.attributes != null && Ly(r, t.attributes), t.properties != null && Wy(r, t.properties), t.classList != null && Hy(r, t.classList), t.behaviors != null && Oh(r, t.behaviors), t.dataset != null && Dy(r, t.dataset), t.stores != null && $h(r, t.stores), t.mixins != null && Dh(r, t.mixins), t.style != null && Bu(r, t.style), t.aria != null && $y(r, t.aria), "value" in t && A(r, "value", t.value, _n, t, !0), "placeholder" in t && A(r, "placeholder", t.placeholder, _n, t, !0), t.is != null && A(r, "is", t.is, Ae, t, !0), t.role != null && A(r, "role", t.role, _n, t), t.slot != null && A(r, "slot", t.slot, _n, t), t.part != null && A(r, "part", t.part, Ae, t, !0), t.name != null && A(r, "name", t.name, Ae, t, !0), t.type != null && A(r, "type", t.type, Ae, t, !0), t.icon != null && A(r, "icon", t.icon, Ae, t, !0), t.inert != null && A(r, "inert", t.inert, Ae, t, !0), t.hidden != null && A(r, "hidden", t.visible ?? t.hidden, uu, t), t.on != null && th(r, t.on), t.rules != null && t.rules.forEach?.((i) => Fy(r, i))), Ke(r);
}, qy = (e, t) => typeof t == "number" && t < 0 || typeof t == "string" && !t || t == null ? { element: "" } : e instanceof Map || typeof e?.get == "function" ? e.get(t) : e instanceof Set || typeof e?.has == "function" ? e.has(t) ? t : null : e?.[t] ?? { element: "" }, We = (e, t, n = null) => de(qy(e, t), null, -1, n), Jl = class {
  #e = document.createComment("");
  current;
  mapped;
  boundParent = null;
  constructor(e, t) {
    this.#e = document.createComment(""), this.current = e?.current ?? { value: -1 }, this.mapped = e?.mapped ?? t ?? [];
    const n = W([e?.current, "value"], (r, i, s) => this._onUpdate(r, i, s));
    n && J(this, Symbol.dispose, n);
  }
  get element() {
    const e = We(this.mapped, this.current?.value ?? -1, this.boundParent) ?? this.#e, t = te(e?.parentElement) ? e?.parentElement : this.boundParent;
    return this.boundParent ??= te(t) ?? this.boundParent, e != null && (e?.parentNode != this.boundParent || !e?.parentNode) && this.boundParent && Or(this.boundParent, e), queueMicrotask(() => {
      const n = te(e?.parentElement) ? e?.parentElement : this.boundParent;
      this.boundParent ??= te(n) ?? this.boundParent;
    }), e;
  }
  elementForPotentialParent(e) {
    return te(e) && (this.boundParent = e), this.current?.[lt]?.(), this.element;
  }
  _onUpdate(e, t, n) {
    const r = e ?? this.current?.value;
    if (!n || xe(r, n)) {
      const i = n ?? this.current?.value;
      this.current && (this.current.value = r ?? -1);
      const s = We(this.mapped, i ?? r ?? -1)?.parentNode ?? this.boundParent;
      this.boundParent = s ?? this.boundParent;
      const o = We(this.mapped, r ?? -1, s) ?? this.#e, a = We(this.mapped, i ?? -1, s);
      if (_e(s))
        if (_e(o)) if (_e(a)) try {
          is(s, a, o);
        } catch (l) {
          console.warn(l);
        }
        else Or(s, o);
        else a && !o && Ir(s, a);
    }
  }
}, Gy = class {
  constructor() {
  }
  set(e, t, n) {
    return Reflect.set(We(e?.mapped, e?.current?.value ?? -1) ?? e, t, n);
  }
  has(e, t) {
    return Reflect.has(We(e?.mapped, e?.current?.value ?? -1) ?? e, t);
  }
  get(e, t, n) {
    return t == "elementForPotentialParent" && (t in e || e?.[t] != null) ? e?.elementForPotentialParent?.bind(e) : t == "element" && (t in e || e?.[t] != null) ? e?.element : t == "_onUpdate" && (t in e || e?.[t] != null) ? e?._onUpdate?.bind(e) : jd(We(e?.mapped, e?.current?.value ?? -1) ?? e, t);
  }
  ownKeys(e) {
    return Reflect.ownKeys(We(e?.mapped, e?.current?.value ?? -1) ?? e);
  }
  apply(e, t, n) {
    return Reflect.apply(We(e?.mapped, e?.current?.value ?? -1) ?? e, t, n);
  }
  deleteProperty(e, t) {
    return Reflect.deleteProperty(We(e?.mapped, e?.current?.value ?? -1) ?? e, t);
  }
  setPrototypeOf(e, t) {
    return Reflect.setPrototypeOf(We(e?.mapped, e?.current?.value ?? -1) ?? e, t);
  }
  getPrototypeOf(e) {
    return Reflect.getPrototypeOf(We(e?.mapped, e?.current?.value ?? -1) ?? e);
  }
  defineProperty(e, t, n) {
    return Reflect.defineProperty(We(e?.mapped, e?.current?.value ?? -1) ?? e, t, n);
  }
  getOwnPropertyDescriptor(e, t) {
    return Reflect.getOwnPropertyDescriptor(We(e?.mapped, e?.current?.value ?? -1) ?? e, t);
  }
  preventExtensions(e) {
    return Reflect.preventExtensions(We(e?.mapped, e?.current?.value ?? -1) ?? e);
  }
  isExtensible(e) {
    return Reflect.isExtensible(We(e?.mapped, e?.current?.value ?? -1) ?? e);
  }
}, Xy = (e, t) => Bd?.getOrInsertComputed?.(e, () => new Proxy(e instanceof Jl ? e : new Jl(e, t), new Gy())), $w = (e, t = {}, n, ...r) => {
  let i = {}, s, o = {}, a = {}, l = {}, c = {}, u = {}, d = {};
  for (const h in t) if (h == "ref")
    typeof e != "function" && (s = typeof t[h] != "function" ? t[h] : Ke(t[h]));
  else if (h == "classList") l = t[h];
  else if (h == "style") c = t[h];
  else if (h?.startsWith?.("@")) {
    const y = h.replace("@", "").trim();
    y ? wl(d, y, t[h]) : d = t[h];
  } else if (h?.startsWith?.("on:")) {
    const y = h.replace("on:", "").trim();
    y ? wl(d, y, t[h]) : d = t[h];
  } else if (h?.startsWith?.("prop:")) {
    const y = h.replace("prop:", "").trim();
    y ? a[y] = t[h] : a = t[h];
  } else if (h?.startsWith?.("attr:")) {
    const y = h.replace("attr:", "").trim();
    y ? o[y] = t[h] : o = t[h];
  } else if (h?.startsWith?.("ctrl:")) {
    const y = h.replace("ctrl:", "").trim();
    y ? u.set(y, t[h]) : u = t[h];
  } else o[h.trim()] = t[h];
  Object.assign(i, {
    attributes: o,
    properties: a,
    classList: l,
    style: c,
    on: d
  });
  const p = Array.isArray(n) ? n : r?.length > 0 ? [n, ...r] : (typeof n == "object" || typeof n == "function") && !(n instanceof Node) || n instanceof DocumentFragment ? n : [n];
  if (typeof e == "function") return e(t, p);
  if (e == "For") return Qa(t, p);
  if (e == "Switch") return Xy(t, p);
  const f = Cs(e, i, p);
  return f && (Promise.try(() => {
    s && (typeof s == "function" ? s?.(f) : s.value = f);
  })?.catch?.(console.warn.bind(console)), f);
}, jn = "rs-nav-ctx", ju = "rs-nav-stack", B = be({
  index: 0,
  length: 0,
  action: "MANUAL",
  view: "",
  canBack: !1,
  canForward: !1,
  entries: []
}), Fn = () => {
  try {
    return history.state?.[jn] || B?.entries?.[B?.index] || {};
  } catch {
    return {};
  }
}, vr = () => {
  try {
    sessionStorage.setItem(ju, JSON.stringify(B?.entries));
  } catch {
  }
}, Yy = () => {
  try {
    const e = sessionStorage.getItem(ju);
    return e ? JSON.parse(e) : [];
  } catch {
    return [];
  }
}, vi = (e, t) => {
  try {
    const n = t !== void 0 ? t : history?.state || {};
    return L(n) && n !== null ? {
      value: n,
      [jn]: e
    } : n === null ? { [jn]: e } : {
      ...n,
      [jn]: e
    };
  } catch {
    return { [jn]: e };
  }
}, Ql = !1, Ky = typeof history < "u" ? history.pushState.bind(history) : void 0, Jy = typeof history < "u" ? history.replaceState.bind(history) : void 0, Qy = typeof history < "u" ? history.go.bind(history) : void 0, Zy = typeof history < "u" ? history.forward.bind(history) : void 0, Dw = typeof history < "u" ? history.back.bind(history) : void 0, em = (e = "") => {
  if (Ql) return;
  Ql = !0;
  const t = Fn(), n = e || location.hash || "#";
  let r = Yy();
  const i = t.index || 0;
  if (r && (r?.length === 0 || i >= r?.length) && r.length <= i && (r[i] = {
    index: i,
    depth: history.length,
    action: t?.action || "REPLACE",
    view: n,
    timestamp: Date.now()
  }), B.entries = r, t.timestamp)
    B.index = t.index || 0, B.view = t.view || n, B?.entries?.[B?.index] || (B.entries[B.index] = t, vr());
  else {
    const s = {
      index: i,
      depth: history.length,
      action: "REPLACE",
      view: n,
      timestamp: Date.now()
    };
    history?.replaceState?.(vi(s), "", location.hash), B?.entries && (B.entries[i] = s), vr();
  }
  mn(Fn()?.action || "REPLACE", n), history.go = (s = 0) => {
    const o = Fn();
    o.index = Math.max(0, Math.min(B.length, (o.index || 0) + s));
    const a = B.entries[o.index];
    Object.assign(o, a || {}), Xe(!0);
    const l = Qy?.(s);
    return setTimeout(() => {
      Xe(!1);
    }, 0), mn(o?.action || "POP", o?.view), l;
  }, history.back = () => history.go(-1), history.forward = () => history.go(1), history.pushState = (s, o, a) => {
    const l = Fn(), c = (l.index || 0) + 1, u = {
      index: c,
      depth: history.length + 1,
      action: "PUSH",
      view: a ? String(a) : l.view || "",
      timestamp: Date.now()
    }, d = Ky?.(vi(u, s), o, a);
    return B.entries = B?.entries?.slice?.(0, c), B.entries?.push?.(u), vr(), mn("PUSH", u.view), d;
  }, history.replaceState = (s, o, a) => {
    const l = Fn(), c = l?.index || 0, u = {
      ...l,
      index: c,
      depth: history.length,
      action: "REPLACE",
      view: a ? String(a) : l?.view || "",
      timestamp: Date.now()
    }, d = Jy?.(vi(u, s), o, a);
    return B?.entries && (B.entries[c] = u, B.entries[B.index].view = a ? String(a) : l?.view || ""), vr(), mn("REPLACE", u.view), d;
  }, T(window, "popstate", (s) => {
    const o = s.state?.[jn], a = B.index ?? 0;
    if (o) {
      const l = o?.index ?? 0;
      let c = "POP";
      l < a ? c = "BACK" : l > a && (c = "FORWARD"), mn(c, o?.view || location.hash);
    } else {
      const l = {
        index: a + 1,
        depth: history.length,
        action: "PUSH",
        view: location.hash || "#",
        timestamp: Date.now()
      };
      history.replaceState(vi(l, s.state), "", location.hash), B.entries = B?.entries?.slice?.(0, l.index), B?.entries?.push?.(l), vr(), mn("PUSH", l.view);
      return;
    }
  }), T(window, "hashchange", (s) => {
    if (Za()) return;
    const o = location.hash || "#";
    B.view !== o && mn("PUSH", o);
  });
}, mn = (e, t) => {
  const n = Fn();
  B.index = n.index || 0, B.length = history.length, B.action = e || "POP", B.view = t || n.view || location.hash, B.canBack = B.index > 0;
}, tm = (e, t = !1) => {
  const n = e.startsWith("#") ? e : `#${e}`;
  if (t && B?.index > 0) {
    const r = B?.entries?.[B?.index - 1];
    if (r && r.view === n) {
      history.back();
      return;
    }
  }
  t ? (B?.entries?.[B.index]?.view !== n || B?.entries?.[B.index]?.view) && history?.replaceState?.(null, "", n) : history?.pushState?.(null, "", n);
}, Fw = (e = `#${location.hash?.replace?.(/^#/, "") || "home"}`, t = {}) => {
  const n = be({ value: e });
  let r = !1, i = !1;
  return W([B, "view"], (s) => {
    if (i || t.ignoreBack && B.action === "BACK") return;
    let o = s;
    t.withoutHashPrefix && (o = s.replace(/^#/, "")), n.value !== o && (r = !0, n.value = o, r = !1);
  }), W([n, "value"], (s) => {
    if (r) return;
    let o = s;
    t.withoutHashPrefix && !s.startsWith("#") && (o = `#${s}`), B.view !== o && (i = !0, tm(o), i = !1);
  }), n;
}, Uu = /* @__PURE__ */ (function(e) {
  return e[e.CONTEXT_MENU = 100] = "CONTEXT_MENU", e[e.DROPDOWN = 90] = "DROPDOWN", e[e.MODAL = 80] = "MODAL", e[e.DIALOG = 70] = "DIALOG", e[e.SIDEBAR = 60] = "SIDEBAR", e[e.OVERLAY = 50] = "OVERLAY", e[e.PANEL = 40] = "PANEL", e[e.TOAST = 30] = "TOAST", e[e.TASK = 20] = "TASK", e[e.VIEW = 10] = "VIEW", e[e.DEFAULT = 0] = "DEFAULT", e;
})({}), Mn = /* @__PURE__ */ new Map(), so = !1, gr = !1, Zl = 0, Kn = {}, Ht = !1, Xe = (e) => {
  Ht = e;
}, Za = () => Ht, ii = () => `closeable-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, lr = (e) => {
  const t = e.id || ii(), n = Object.assign(e, { id: t });
  return n?.hashId == null && (n.hashId = t), Mn.set(t, n), Kn.debug && console.log("[BackNav] Registered:", t, "priority:", e.priority), () => nm(t);
}, nm = (e) => {
  const t = Mn.delete(e);
  return Kn.debug && t && console.log("[BackNav] Unregistered:", e), t;
}, rm = (e) => Array.from(Mn.values()).filter((t) => t.element && !t.element.deref() ? (Mn.delete(t.id), !1) : t.isActive(e)).sort((t, n) => n.priority - t.priority), Vu = (e) => rm(e)[0] || null, im = (e) => {
  const t = Vu(e);
  return t ? (Kn.debug && console.log("[BackNav] Closing:", t.id, "priority:", t.priority), t?.close?.(e) != !1 ? t : null) : null;
}, Ww = (e) => {
  let t = 0;
  for (const n of Mn.values()) n.group === e && n.isActive() && (Mn?.delete?.(n.id), n.close() !== !1 && t++);
  return t;
}, Hw = (e) => Vu(e) != null, sm = (e) => {
  if (gr) return !1;
  if (Ht)
    return Ht = !1, !1;
  if (e?.state?.action) return !1;
  gr = !0;
  try {
    Ht = !0;
    let t;
    if (B.entries && (B.action === "BACK" || B.action === "POP")) {
      const n = B.entries[B.index + 1];
      n && (t = n.view);
    }
    return im(t) ?? !0 ? (Ht = !1, gr = !1, !1) : (e.preventDefault?.(), Ht = !0, Zy?.(), setTimeout(() => {
      Ht = !1;
    }, 0), gr = !1, !0);
  } finally {
    return Ht = !1, gr = !1, !1;
  }
}, om = (e = {}) => {
  if (so)
    return console.warn("[BackNav] Already initialized"), () => {
    };
  if (Kn = { ...e }, so = !0, em(location.hash), e.pushInitialState !== !1 && !e.skipPopstateHandler) {
    Zl = 0, Xe(!0);
    const n = {
      ...history.state || {},
      backNav: !0,
      depth: Zl
    };
    history.pushState(n, "", location.hash || "#"), Xe(!1);
  }
  let t;
  return e.skipPopstateHandler || (t = T(window, "popstate", (r) => {
    r?.state?.action || !sm(r) && e.preventDefaultNavigation;
  })), Kn.debug && console.log("[BackNav] Initialized", e.skipPopstateHandler ? "(external handler)" : ""), () => {
    t?.(), so = !1, Mn.clear(), Kn.debug && console.log("[BackNav] Destroyed");
  };
}, am = (e, t, n) => lr({
  id: `ctx-menu-${e.id || ii()}`,
  priority: 100,
  element: new WeakRef(e),
  group: "context-menu",
  isActive: () => t.value === !0,
  close: () => (t.value = !1, n?.(), !1)
}), lm = (e, t, n) => lr({
  id: `modal-${e.id || ii()}`,
  priority: 80,
  element: new WeakRef(e),
  group: "modal",
  isActive: t ?? (() => {
    const r = e;
    return r?.isConnected && !r?.hasAttribute?.("data-hidden") && r?.checkVisibility?.({
      opacityProperty: !0,
      visibilityProperty: !0
    }) !== !1;
  }),
  close: () => (n?.(), e?.remove?.(), !1)
}), Bw = (e, t, n) => lr({
  id: `sidebar-${e.id || ii()}`,
  priority: 60,
  element: new WeakRef(e),
  group: "sidebar",
  isActive: () => {
    const r = t.value;
    return !!r && String(r) !== "false";
  },
  close: () => (t.value = !1, n?.(), !1)
}), jw = (e, t, n, r = 50) => lr({
  id: `overlay-${e.id || ii()}`,
  priority: r,
  element: new WeakRef(e),
  group: "overlay",
  isActive: t,
  close: () => (n(), !1)
}), Uw = (e, t = {}) => {
  const { backdropClass: n = "rs-modal-backdrop", closeOnBackdropClick: r = !0, closeOnEscape: i = !0, onClose: s } = t, o = document.createElement("div");
  o.className = n, o.appendChild(e);
  const a = () => {
    s?.(), o.remove(), document.removeEventListener("keydown", l);
  }, l = (c) => {
    c.key === "Escape" && i && a();
  };
  return i && document.addEventListener("keydown", l), r && o.addEventListener("click", (c) => {
    c.target === o && a();
  }), {
    element: o,
    close: a,
    unregister: lm(o, void 0, a)
  };
}, Un = /* @__PURE__ */ new Map(), cm = (e) => {
  if (!e) return;
  if (typeof e == "function") return e;
  const t = e;
  if (typeof t?.disconnect == "function") return () => t.disconnect?.();
  if (typeof t?.unsubscribe == "function") return () => t.unsubscribe?.();
}, um = (e, t) => {
  const n = e?.[du];
  return typeof n?.without == "function" ? n.without(["setter", "set"], t) : _t(e, t);
}, fm = (e, t, n = "value") => !e || !(typeof e == "object" || typeof e == "function") ? t : xe(e[n], t) ? um(e, () => {
  e[n] = t;
}) : t, el = (e, t, n = "input") => {
  const r = t?.target ?? e;
  return r?.matches?.(n) ? r : r?.querySelector?.(n) ?? e;
}, qu = (e) => e?.matches?.('input[type="radio"]') ? e?.form ?? e?.parentNode ?? e : e, dm = (e, t) => t || (e?.type == "radio" && e?.name ? e.name : e?.querySelector?.('input[type="radio"]:checked')?.name ?? e?.querySelector?.('input[type="radio"]')?.name ?? ""), tl = (e) => `input[type="radio"]${e ? `[name="${globalThis.CSS?.escape?.(e) ?? e}"]` : ""}`, ec = (e, t) => {
  const n = qu(e);
  return e?.type == "radio" && (!t || e.name == t) && e.checked ? e : n?.querySelector?.(`${tl(t)}:checked`) ?? null;
}, hm = (e, t, n) => [...qu(e)?.querySelectorAll?.(tl(n)) ?? (e?.type == "radio" ? [e] : [])].find((r) => r?.value == t) ?? null, cr = (e, t) => {
  const n = Array.isArray(e) ? e : [e];
  return ({ source: r, commit: i }) => {
    const s = r?.element ?? r?.self ?? r;
    if (!s?.addEventListener) return;
    const o = (a) => i(a);
    return n.forEach((a) => s.addEventListener(a, o, t)), () => n.forEach((a) => s.removeEventListener?.(a, o, t));
  };
}, pm = (e) => ({ source: t, commit: n }) => {
  const r = t?.element ?? t?.self ?? t;
  if (!r || typeof MutationObserver > "u") return;
  const i = new MutationObserver((s) => {
    (!e || s.some((o) => o.type == "attributes" && o.attributeName == e)) && n(s);
  });
  return i.observe(r, {
    attributes: !0,
    attributeFilter: e ? [e] : void 0
  }), () => i.disconnect();
}, Vw = (e) => ({ source: t, commit: n }) => {
  const r = t?.element ?? t?.self ?? t;
  if (!r || typeof ResizeObserver > "u") return;
  const i = new ResizeObserver((s) => n(s));
  return i.observe(r, { box: e }), () => i.disconnect();
}, In = (e) => {
  const t = typeof e.source == "function" ? e.source() : e.source, n = e.forProp ?? "value", r = {
    source: t,
    ref: e.ref,
    forProp: n,
    get(i, s = n) {
      return e.getter?.({
        source: t,
        ref: r.ref,
        linker: r,
        forProp: s,
        event: i,
        reason: i ? "source" : "manual"
      });
    },
    set(i, s, o = n) {
      return e.setter?.(i, {
        source: t,
        ref: r.ref,
        linker: r,
        forProp: o,
        event: s,
        reason: "ref"
      });
    },
    store(i, s, o = n) {
      const a = {
        source: t,
        ref: r.ref,
        linker: r,
        forProp: o,
        event: s,
        reason: "source"
      };
      return e.store ? e.store(i, a) : fm(r.ref, i, o);
    },
    trigger(i, s = n) {
      const o = r.get(i, s);
      return r.store(o, i, s);
    },
    bind() {
      r.unbind(), e.bindImmediately && r.trigger();
      const i = cm(e.trigger?.({
        source: t,
        ref: r.ref,
        linker: r,
        forProp: n,
        reason: "initial",
        commit: (o, a = n) => r.trigger(o, a)
      })), s = r.ref && e.setter ? W([r.ref, n], (o) => {
        r.set(o, void 0, n);
      }, {
        affectTypes: e.affectTypes ?? ["setter", "manual"],
        triggerImmediately: e.triggerImmediately ?? !0
      }) : null;
      return r.__cleanup = () => {
        i?.(), s?.();
      }, r;
    },
    unbind() {
      r.__cleanup?.(), r.__cleanup = null;
    },
    [Symbol.dispose]() {
      r.unbind();
    },
    __cleanup: null
  };
  return r;
}, ym = (e, t, n, r) => {
  if (n != null)
    return Un.has(n) && (Un.get(n)?.[0]?.(), Un.delete(n)), Un.getOrInsertComputed?.(n, () => {
      const i = (e ?? localStorage).getItem(n) ?? r?.value ?? r, s = ct(t) ? t : Je(i);
      s.value ??= i;
      const o = new WeakRef(s), a = W([s, "value"], (c) => {
        _t(o?.deref?.(), () => {
          (e ?? localStorage).setItem(n, c);
        });
      }), l = (c) => {
        c.storageArea == (e ?? localStorage) && c.key == n && xe(s.value, c.newValue) && (s.value = c.newValue);
      };
      return addEventListener("storage", l), [() => {
        a?.(), removeEventListener("storage", l);
      }, s];
    });
}, vt = (e, t = !0) => e == null ? t ? "#" : "" : !t && e?.startsWith?.("#") ? e?.replace?.("#", "") || "" : t && !e?.startsWith?.("#") ? `#${e || ""}` : (t ? e?.startsWith?.("#") ? e : `#${e || ""}` : e?.replace?.("#", "")) || "", mm = (e, t, n, r = !1) => {
  const i = vt(vt(location?.hash || "", !1) || vt(n || "", !1) || "", r) || "", s = ct(t) ? t : Je(i);
  Nt(s) && (s.value ||= i);
  let o = !1, a = 0;
  const l = (d) => {
    Za() || a <= 0 && (a = 1, setTimeout(() => {
      const p = vt(location?.hash, !1), f = vt(p || vt(s.value || "", !1), r) || "";
      vt(s.value, !1) !== vt(f, !1) && (o || (o = !0, s.value = f, setTimeout(() => o = !1, 0))), a = 0;
    }, 0));
  }, c = new WeakRef(s), u = W([s, "value"], (d) => {
    const p = vt(vt(Be(c?.deref?.()) || d, !1) || vt(location?.hash, !1), !0);
    p != location.hash && _t(c?.deref?.(), () => {
      o || (Xe(!0), history.pushState("", "", p || location.hash), setTimeout(() => Xe(!1), 0));
    });
  });
  return addEventListener("popstate", l), addEventListener("hashchange", l), () => {
    u?.(), removeEventListener("popstate", l), removeEventListener("hashchange", l);
  };
}, vm = (e, t, n) => {
  if (n == null) return;
  const r = e ?? matchMedia(n), i = r?.matches || !1, s = ct(t) ? t : Gt(i);
  s.value ??= i;
  const o = (a) => s.value = a.matches;
  return r?.addEventListener?.("change", o), () => {
    r?.removeEventListener?.("change", o);
  };
}, gm = (e, t, n) => {
  if (e == null) return;
  const r = n?.value ?? (typeof n != "object" ? n : null) ?? e?.getAttribute?.("data-hidden") == null, i = ct(t) ? t : Gt(!!r), s = In({
    source: e,
    ref: i,
    getter: ({ event: o }) => o?.type != "u2-hidden",
    setter: (o, { source: a }) => uu(a, "data-hidden", o),
    trigger: cr(["u2-hidden", "u2-appear"], { passive: !0 })
  }).bind();
  return () => s.unbind();
}, Gu = (e, t, n, r) => {
  const i = e?.getAttribute?.(n) ?? (typeof r == "boolean" ? r ? "" : null : Xc(r));
  if (!e) return;
  const s = ct(t) ? t : Je(i);
  Nt(s) && !Ot(s.value) && (s.value = Ot(i) ?? s.value ?? "");
  const o = In({
    source: e,
    ref: s,
    getter: ({ source: a }) => a?.getAttribute?.(n),
    setter: (a, { source: l }) => Ae(l, n, Ot(a)),
    trigger: pm(n)
  }).bind();
  return () => o.unbind();
}, bm = (e, t, n, r) => {
  const i = r == "border-box" ? e?.[n == "inline" ? "offsetWidth" : "offsetHeight"] : e?.[n == "inline" ? "clientWidth" : "clientHeight"] - ja(e, n), s = ct(t) ? t : w(i);
  Nt(s) && (s.value ||= (i ?? s.value) || 1);
  const o = new ResizeObserver((a) => {
    Nt(s) && (r == "border-box" && (s.value = n == "inline" ? a[0].borderBoxSize[0].inlineSize : a[0].borderBoxSize[0].blockSize), r == "content-box" && (s.value = n == "inline" ? a[0].contentBoxSize[0].inlineSize : a[0].contentBoxSize[0].blockSize), r == "device-pixel-content-box" && (s.value = n == "inline" ? a[0].devicePixelContentBoxSize[0].inlineSize : a[0].devicePixelContentBoxSize[0].blockSize));
  });
  return (e?.element ?? e?.self ?? e) instanceof HTMLElement && o?.observe?.(e?.element ?? e?.self ?? e, { box: r }), () => o?.disconnect?.();
}, wm = (e, t, n, r) => {
  r != null && typeof (r?.value ?? r) == "number" && e?.scrollTo?.({ [n == "block" ? "top" : "left"]: r?.value ?? r });
  const i = e?.[n == "block" ? "scrollTop" : "scrollLeft"], s = ct(t) ? t : w(i || 0);
  Nt(s) && (s.value ||= (i ?? s.value) || 1), s.value ||= (i ?? s.value) || 0;
  const o = n == "block" ? "scrollTop" : "scrollLeft", a = n == "block" ? "top" : "left", l = In({
    source: e,
    ref: s,
    getter: ({ source: c }) => c?.[o] || 0,
    setter: (c, { source: u }) => {
      Math.abs((u?.[o] || 0) - Number(c || 0)) > 1e-3 && u?.scrollTo?.({ [a]: Number(c || 0) });
    },
    trigger: cr("scroll", { passive: !0 })
  }).bind();
  return () => l.unbind();
}, Sm = (e, t) => {
  const n = !!e?.checked || !1, r = ct(t) ? t : Gt(n);
  Nt(r) && r.value !== n && (r.value = n);
  const i = (e?.type == "radio" ? e?.closest?.("input[type='radio']") : e) ?? e, s = In({
    source: i,
    ref: r,
    getter: ({ source: o, event: a }) => el(o, a, 'input[type="checkbox"], input:checked')?.checked ?? e?.checked ?? r?.value,
    setter: (o) => {
      e && e?.checked != o && ln(e, o);
    },
    trigger: cr([
      "click",
      "input",
      "change"
    ])
  }).bind();
  return () => s.unbind();
}, xm = (e, t, n, r) => {
  if (L(e) || !e || !(e instanceof Node || e?.element instanceof Node)) return;
  const i = dm(e, n), s = ec(e, i)?.value ?? Xc(r) ?? "", o = ct(t) ? t : Je(s);
  Nt(o) && !Ot(o.value) && (o.value = Ot(s) ?? o.value ?? ""), Nt(o) && xe(o.value, s) && (o.value = s);
  const a = In({
    source: e,
    ref: o,
    getter: ({ source: l, event: c }) => {
      const u = c?.target;
      return u?.matches?.(tl(i)) && u?.checked ? u.value : ec(l, i)?.value ?? o?.value ?? "";
    },
    setter: (l, { source: c }) => {
      const u = hm(c, Be(l), i);
      u && !u.checked && (ln(u, !0), u.dispatchEvent?.(new Event("change", { bubbles: !0 })));
    },
    trigger: cr([
      "click",
      "input",
      "change"
    ])
  }).bind();
  return () => a.unbind();
}, _m = (e, t) => {
  if (L(e) || !e || !(e instanceof Node || e?.element instanceof Node)) return;
  const n = e?.value ?? "", r = ct(t) ? t : Je(n);
  Nt(r) && !Ot(r.value) && (r.value = Ot(n) ?? r.value ?? "");
  const i = In({
    source: e,
    ref: r,
    getter: ({ source: s, event: o }) => el(s, o)?.value ?? s?.value ?? r?.value ?? "",
    setter: (s, { source: o }) => {
      const a = Be(s);
      o && xe(o?.value, a) && (o.value = a ?? "", o?.dispatchEvent?.(new Event("change", { bubbles: !0 })));
    },
    trigger: cr([
      "click",
      "input",
      "change"
    ])
  }).bind();
  return () => i.unbind();
}, km = (e, t) => {
  if (L(e) || !e || !(e instanceof Node || e?.element instanceof Node)) return;
  const n = Number(e?.valueAsNumber) || 0, r = ct(t) ? t : w(n);
  Nt(r) && !r.value && n && (r.value = n);
  const i = In({
    source: e,
    ref: r,
    getter: ({ source: s, event: o }) => Number(el(s, o)?.valueAsNumber || s?.valueAsNumber || 0) || 0,
    setter: (s, { source: o }) => {
      o && (o.type == "range" || o.type == "number") && typeof o?.valueAsNumber == "number" && xe(o?.valueAsNumber, s) && (o.valueAsNumber = Number(s), o?.dispatchEvent?.(new Event("change", { bubbles: !0 })));
    },
    trigger: cr([
      "click",
      "input",
      "change"
    ])
  }).bind();
  return () => i.unbind();
}, qw = (e, t, n, r) => {
  if (L(e) || !e || !(e instanceof Node || e?.element instanceof Node)) return;
  r || (r = ct(t) ? t : be({}));
  let i = null;
  return (i = new ResizeObserver((s) => {
    n == "border-box" && (r.inlineSize = `${s[0].borderBoxSize[0].inlineSize}px`, r.blockSize = `${s[0].borderBoxSize[0].blockSize}px`), n == "content-box" && (r.inlineSize = `${s[0].contentBoxSize[0].inlineSize}px`, r.blockSize = `${s[0].contentBoxSize[0].blockSize}px`), n == "device-pixel-content-box" && (r.inlineSize = `${s[0].devicePixelContentBoxSize[0].inlineSize}px`, r.blockSize = `${s[0].devicePixelContentBoxSize[0].blockSize}px`);
  })).observe(e?.element ?? e?.self ?? e, { box: n }), () => {
    i?.disconnect?.();
  };
}, Gw = (e) => L(e) ? e : fn(e), Em = (e, t) => {
  const n = Cl?.[Pl()] || 0, r = Number(n) || 0, i = ct(t) ? t : w(r);
  return ne(i) && (i.value = r), ph(() => {
    i.value = Cl?.[Pl()] || 0;
  });
}, Cm = (e, t = "click", n = 0, r = "client", i) => {
  if (L(e) || !e || !(e instanceof Node || e?.element instanceof Node)) return;
  const s = w(0), o = w(0), a = w(n || 0);
  i ? (Object.defineProperty(i, "x", {
    get: () => s.value,
    set: (c) => s.value = c,
    enumerable: !0
  }), Object.defineProperty(i, "y", {
    get: () => o.value,
    set: (c) => o.value = c,
    enumerable: !0
  }), Object.defineProperty(i, "pointerId", {
    get: () => a.value,
    set: (c) => a.value = c,
    enumerable: !0
  })) : i ??= be({
    get x() {
      return s.value;
    },
    get y() {
      return o.value;
    },
    set x(c) {
      s.value = c;
    },
    set y(c) {
      o.value = c;
    },
    set pointerId(c) {
      a.value = c;
    },
    get pointerId() {
      return a.value;
    }
  });
  const l = T(e, t || "click", (c) => (c?.pointerId == (n || 0) && (s.value = c[(r || "client") + "X"], o.value = c[(r || "client") + "Y"], a.value = c.pointerId), !0));
  return () => {
    l?.(), s?.(), o?.(), a?.();
  };
}, Y = class De {
  _x;
  _y;
  constructor(t = 0, n = 0) {
    this._x = typeof t == "number" ? w(t) : t, this._y = typeof n == "number" ? w(n) : n;
  }
  get x() {
    return this._x;
  }
  set x(t) {
    typeof t == "number" ? this._x.value = t : this._x = t;
  }
  get y() {
    return this._y;
  }
  set y(t) {
    typeof t == "number" ? this._y.value = t : this._y = t;
  }
  get 0() {
    return this._x;
  }
  get 1() {
    return this._y;
  }
  toArray() {
    return [this._x, this._y];
  }
  clone() {
    return new De(this._x.value, this._y.value);
  }
  set(t, n) {
    return this._x.value = t, this._y.value = n, this;
  }
  copy(t) {
    return this._x.value = t.x.value, this._y.value = t.y.value, this;
  }
  add(t) {
    return new De(this._x.value + t.x.value, this._y.value + t.y.value);
  }
  subtract(t) {
    return new De(this._x.value - t.x.value, this._y.value - t.y.value);
  }
  multiply(t) {
    return new De(this._x.value * t, this._y.value * t);
  }
  divide(t) {
    if (t === 0) throw new Error("Division by zero");
    return new De(this._x.value / t, this._y.value / t);
  }
  dot(t) {
    return this._x.value * t.x.value + this._y.value * t.y.value;
  }
  cross(t) {
    return this._x.value * t.y.value - this._y.value * t.x.value;
  }
  magnitude() {
    return Math.sqrt(this._x.value * this._x.value + this._y.value * this._y.value);
  }
  magnitudeSquared() {
    return this._x.value * this._x.value + this._y.value * this._y.value;
  }
  distanceTo(t) {
    const n = this._x.value - t.x.value, r = this._y.value - t.y.value;
    return Math.sqrt(n * n + r * r);
  }
  distanceToSquared(t) {
    const n = this._x.value - t.x.value, r = this._y.value - t.y.value;
    return n * n + r * r;
  }
  normalize() {
    const t = this.magnitude();
    return t === 0 ? new De(0, 0) : new De(this._x.value / t, this._y.value / t);
  }
  equals(t, n = 1e-6) {
    return Math.abs(this._x.value - t.x.value) < n && Math.abs(this._y.value - t.y.value) < n;
  }
  lerp(t, n) {
    const r = Math.max(0, Math.min(1, n));
    return new De(this._x.value + (t.x.value - this._x.value) * r, this._y.value + (t.y.value - this._y.value) * r);
  }
  angleTo(t) {
    const n = this.dot(t), r = this.cross(t);
    return Math.atan2(r, n);
  }
  rotate(t) {
    const n = Math.cos(t), r = Math.sin(t);
    return new De(this._x.value * n - this._y.value * r, this._x.value * r + this._y.value * n);
  }
  projectOnto(t) {
    const n = this.dot(t) / t.magnitudeSquared();
    return t.multiply(n);
  }
  reflect(t) {
    const n = t.normalize(), r = this.dot(n);
    return this.subtract(n.multiply(2 * r));
  }
  clamp(t, n) {
    return new De(Math.max(t.x.value, Math.min(n.x.value, this._x.value)), Math.max(t.y.value, Math.min(n.y.value, this._y.value)));
  }
  min() {
    return Math.min(this._x.value, this._y.value);
  }
  max() {
    return Math.max(this._x.value, this._y.value);
  }
  static zero() {
    return new De(0, 0);
  }
  static one() {
    return new De(1, 1);
  }
  static unitX() {
    return new De(1, 0);
  }
  static unitY() {
    return new De(0, 1);
  }
  static fromAngle(t, n = 1) {
    return new De(Math.cos(t) * n, Math.sin(t) * n);
  }
  static fromPolar(t, n) {
    return De.fromAngle(t, n);
  }
}, X = (e = 0, t = 0) => new Y(e, t), Pm = class Ft {
  _elements;
  constructor(t = 1, n = 0, r = 0, i = 1) {
    this._elements = [
      typeof t == "number" ? w(t) : t,
      typeof n == "number" ? w(n) : n,
      typeof r == "number" ? w(r) : r,
      typeof i == "number" ? w(i) : i
    ];
  }
  get elements() {
    return this._elements;
  }
  get m00() {
    return this._elements[0];
  }
  get m01() {
    return this._elements[1];
  }
  get m10() {
    return this._elements[2];
  }
  get m11() {
    return this._elements[3];
  }
  set m00(t) {
    typeof t == "number" ? this._elements[0].value = t : this._elements[0] = t;
  }
  set m01(t) {
    typeof t == "number" ? this._elements[1].value = t : this._elements[1] = t;
  }
  set m10(t) {
    typeof t == "number" ? this._elements[2].value = t : this._elements[2] = t;
  }
  set m11(t) {
    typeof t == "number" ? this._elements[3].value = t : this._elements[3] = t;
  }
  get 0() {
    return this._elements[0];
  }
  get 1() {
    return this._elements[1];
  }
  get 2() {
    return this._elements[2];
  }
  get 3() {
    return this._elements[3];
  }
  toArray() {
    return [...this._elements];
  }
  clone() {
    return new Ft(this._elements[0].value, this._elements[1].value, this._elements[2].value, this._elements[3].value);
  }
  set(t, n, r, i) {
    return this._elements[0].value = t, this._elements[1].value = n, this._elements[2].value = r, this._elements[3].value = i, this;
  }
  identity() {
    return this.set(1, 0, 0, 1);
  }
  copy(t) {
    return this._elements[0].value = t.elements[0].value, this._elements[1].value = t.elements[1].value, this._elements[2].value = t.elements[2].value, this._elements[3].value = t.elements[3].value, this;
  }
  multiply(t) {
    const n = this._elements[0].value, r = this._elements[1].value, i = this._elements[2].value, s = this._elements[3].value, o = t.elements[0].value, a = t.elements[1].value, l = t.elements[2].value, c = t.elements[3].value;
    return new Ft(n * o + r * l, n * a + r * c, i * o + s * l, i * a + s * c);
  }
  multiplyScalar(t) {
    return new Ft(this._elements[0].value * t, this._elements[1].value * t, this._elements[2].value * t, this._elements[3].value * t);
  }
  transformVector(t) {
    const n = this._elements[0].value * t.x.value + this._elements[1].value * t.y.value, r = this._elements[2].value * t.x.value + this._elements[3].value * t.y.value;
    return new Y(n, r);
  }
  determinant() {
    return this._elements[0].value * this._elements[3].value - this._elements[1].value * this._elements[2].value;
  }
  inverse() {
    const t = this.determinant();
    if (t === 0) return null;
    const n = 1 / t;
    return new Ft(this._elements[3].value * n, -this._elements[1].value * n, -this._elements[2].value * n, this._elements[0].value * n);
  }
  transpose() {
    return new Ft(this._elements[0].value, this._elements[2].value, this._elements[1].value, this._elements[3].value);
  }
  equals(t, n = 1e-6) {
    for (let r = 0; r < 4; r++) if (Math.abs(this._elements[r].value - t.elements[r].value) > n) return !1;
    return !0;
  }
  static rotation(t) {
    const n = Math.cos(t), r = Math.sin(t);
    return new Ft(n, -r, r, n);
  }
  static scale(t, n = t) {
    return new Ft(t, 0, 0, n);
  }
  static shear(t, n) {
    return new Ft(1, t, n, 1);
  }
}, Xw = (e = 1, t = 0, n = 0, r = 1) => new Pm(e, t, n, r), Xt = class Xu {
  _x;
  _y;
  _z;
  constructor(t = 0, n = 0, r = 0) {
    this._x = typeof t == "number" ? w(t) : t, this._y = typeof n == "number" ? w(n) : n, this._z = typeof r == "number" ? w(r) : r;
  }
  get x() {
    return this._x;
  }
  set x(t) {
    typeof t == "number" ? this._x.value = t : this._x = t;
  }
  get y() {
    return this._y;
  }
  set y(t) {
    typeof t == "number" ? this._y.value = t : this._y = t;
  }
  get z() {
    return this._z;
  }
  set z(t) {
    typeof t == "number" ? this._z.value = t : this._z = t;
  }
  get 0() {
    return this._x;
  }
  get 1() {
    return this._y;
  }
  get 2() {
    return this._z;
  }
  toArray() {
    return [
      this._x,
      this._y,
      this._z
    ];
  }
  clone() {
    return new Xu(this._x.value, this._y.value, this._z.value);
  }
  set(t, n, r) {
    return this._x.value = t, this._y.value = n, this._z.value = r, this;
  }
  copy(t) {
    return this._x.value = t.x.value, this._y.value = t.y.value, this._z.value = t.z.value, this;
  }
}, Yw = (e = 0, t = 0, n = 0) => new Xt(e, t, n), Am = class Yu {
  _elements;
  constructor(t = 1, n = 0, r = 0, i = 0, s = 1, o = 0, a = 0, l = 0, c = 1) {
    this._elements = [
      typeof t == "number" ? w(t) : t,
      typeof n == "number" ? w(n) : n,
      typeof r == "number" ? w(r) : r,
      typeof i == "number" ? w(i) : i,
      typeof s == "number" ? w(s) : s,
      typeof o == "number" ? w(o) : o,
      typeof a == "number" ? w(a) : a,
      typeof l == "number" ? w(l) : l,
      typeof c == "number" ? w(c) : c
    ];
  }
  get elements() {
    return this._elements;
  }
  get m00() {
    return this._elements[0];
  }
  get m01() {
    return this._elements[1];
  }
  get m02() {
    return this._elements[2];
  }
  get m10() {
    return this._elements[3];
  }
  get m11() {
    return this._elements[4];
  }
  get m12() {
    return this._elements[5];
  }
  get m20() {
    return this._elements[6];
  }
  get m21() {
    return this._elements[7];
  }
  get m22() {
    return this._elements[8];
  }
  set m00(t) {
    typeof t == "number" ? this._elements[0].value = t : this._elements[0] = t;
  }
  set m01(t) {
    typeof t == "number" ? this._elements[1].value = t : this._elements[1] = t;
  }
  set m02(t) {
    typeof t == "number" ? this._elements[2].value = t : this._elements[2] = t;
  }
  set m10(t) {
    typeof t == "number" ? this._elements[3].value = t : this._elements[3] = t;
  }
  set m11(t) {
    typeof t == "number" ? this._elements[4].value = t : this._elements[4] = t;
  }
  set m12(t) {
    typeof t == "number" ? this._elements[5].value = t : this._elements[5] = t;
  }
  set m20(t) {
    typeof t == "number" ? this._elements[6].value = t : this._elements[6] = t;
  }
  set m21(t) {
    typeof t == "number" ? this._elements[7].value = t : this._elements[7] = t;
  }
  set m22(t) {
    typeof t == "number" ? this._elements[8].value = t : this._elements[8] = t;
  }
  get 0() {
    return this._elements[0];
  }
  get 1() {
    return this._elements[1];
  }
  get 2() {
    return this._elements[2];
  }
  get 3() {
    return this._elements[3];
  }
  get 4() {
    return this._elements[4];
  }
  get 5() {
    return this._elements[5];
  }
  get 6() {
    return this._elements[6];
  }
  get 7() {
    return this._elements[7];
  }
  get 8() {
    return this._elements[8];
  }
  toArray() {
    return [...this._elements];
  }
  clone() {
    return new Yu(this._elements[0].value, this._elements[1].value, this._elements[2].value, this._elements[3].value, this._elements[4].value, this._elements[5].value, this._elements[6].value, this._elements[7].value, this._elements[8].value);
  }
  set(t, n, r, i, s, o, a, l, c) {
    return this._elements[0].value = t, this._elements[1].value = n, this._elements[2].value = r, this._elements[3].value = i, this._elements[4].value = s, this._elements[5].value = o, this._elements[6].value = a, this._elements[7].value = l, this._elements[8].value = c, this;
  }
  identity() {
    return this.set(1, 0, 0, 0, 1, 0, 0, 0, 1);
  }
  copy(t) {
    for (let n = 0; n < 9; n++) this._elements[n].value = t.elements[n].value;
    return this;
  }
}, Kw = (e = 1, t = 0, n = 0, r = 0, i = 1, s = 0, o = 0, a = 0, l = 1) => new Am(e, t, n, r, i, s, o, a, l), dn = class Ku {
  _x;
  _y;
  _z;
  _w;
  constructor(t = 0, n = 0, r = 0, i = 1) {
    this._x = typeof t == "number" ? w(t) : t, this._y = typeof n == "number" ? w(n) : n, this._z = typeof r == "number" ? w(r) : r, this._w = typeof i == "number" ? w(i) : i;
  }
  get x() {
    return this._x;
  }
  set x(t) {
    typeof t == "number" ? this._x.value = t : this._x = t;
  }
  get y() {
    return this._y;
  }
  set y(t) {
    typeof t == "number" ? this._y.value = t : this._y = t;
  }
  get z() {
    return this._z;
  }
  set z(t) {
    typeof t == "number" ? this._z.value = t : this._z = t;
  }
  get w() {
    return this._w;
  }
  set w(t) {
    typeof t == "number" ? this._w.value = t : this._w = t;
  }
  get 0() {
    return this._x;
  }
  get 1() {
    return this._y;
  }
  get 2() {
    return this._z;
  }
  get 3() {
    return this._w;
  }
  toArray() {
    return [
      this._x,
      this._y,
      this._z,
      this._w
    ];
  }
  clone() {
    return new Ku(this._x.value, this._y.value, this._z.value, this._w.value);
  }
  set(t, n, r, i = 1) {
    return this._x.value = t, this._y.value = n, this._z.value = r, this._w.value = i, this;
  }
  copy(t) {
    return this._x.value = t.x.value, this._y.value = t.y.value, this._z.value = t.z.value, this._w.value = t.w.value, this;
  }
}, Jw = (e = 0, t = 0, n = 0, r = 1) => new dn(e, t, n, r), Ju = class Qu {
  _elements;
  constructor(t = 1, n = 0, r = 0, i = 0, s = 0, o = 1, a = 0, l = 0, c = 0, u = 0, d = 1, p = 0, f = 0, h = 0, y = 0, b = 1) {
    this._elements = [
      typeof t == "number" ? w(t) : t,
      typeof n == "number" ? w(n) : n,
      typeof r == "number" ? w(r) : r,
      typeof i == "number" ? w(i) : i,
      typeof s == "number" ? w(s) : s,
      typeof o == "number" ? w(o) : o,
      typeof a == "number" ? w(a) : a,
      typeof l == "number" ? w(l) : l,
      typeof c == "number" ? w(c) : c,
      typeof u == "number" ? w(u) : u,
      typeof d == "number" ? w(d) : d,
      typeof p == "number" ? w(p) : p,
      typeof f == "number" ? w(f) : f,
      typeof h == "number" ? w(h) : h,
      typeof y == "number" ? w(y) : y,
      typeof b == "number" ? w(b) : b
    ];
  }
  get elements() {
    return this._elements;
  }
  get m00() {
    return this._elements[0];
  }
  get m01() {
    return this._elements[1];
  }
  get m02() {
    return this._elements[2];
  }
  get m03() {
    return this._elements[3];
  }
  get m10() {
    return this._elements[4];
  }
  get m11() {
    return this._elements[5];
  }
  get m12() {
    return this._elements[6];
  }
  get m13() {
    return this._elements[7];
  }
  get m20() {
    return this._elements[8];
  }
  get m21() {
    return this._elements[9];
  }
  get m22() {
    return this._elements[10];
  }
  get m23() {
    return this._elements[11];
  }
  get m30() {
    return this._elements[12];
  }
  get m31() {
    return this._elements[13];
  }
  get m32() {
    return this._elements[14];
  }
  get m33() {
    return this._elements[15];
  }
  set m00(t) {
    typeof t == "number" ? this._elements[0].value = t : this._elements[0] = t;
  }
  set m01(t) {
    typeof t == "number" ? this._elements[1].value = t : this._elements[1] = t;
  }
  set m02(t) {
    typeof t == "number" ? this._elements[2].value = t : this._elements[2] = t;
  }
  set m03(t) {
    typeof t == "number" ? this._elements[3].value = t : this._elements[3] = t;
  }
  set m10(t) {
    typeof t == "number" ? this._elements[4].value = t : this._elements[4] = t;
  }
  set m11(t) {
    typeof t == "number" ? this._elements[5].value = t : this._elements[5] = t;
  }
  set m12(t) {
    typeof t == "number" ? this._elements[6].value = t : this._elements[6] = t;
  }
  set m13(t) {
    typeof t == "number" ? this._elements[7].value = t : this._elements[7] = t;
  }
  set m20(t) {
    typeof t == "number" ? this._elements[8].value = t : this._elements[8] = t;
  }
  set m21(t) {
    typeof t == "number" ? this._elements[9].value = t : this._elements[9] = t;
  }
  set m22(t) {
    typeof t == "number" ? this._elements[10].value = t : this._elements[10] = t;
  }
  set m23(t) {
    typeof t == "number" ? this._elements[11].value = t : this._elements[11] = t;
  }
  set m30(t) {
    typeof t == "number" ? this._elements[12].value = t : this._elements[12] = t;
  }
  set m31(t) {
    typeof t == "number" ? this._elements[13].value = t : this._elements[13] = t;
  }
  set m32(t) {
    typeof t == "number" ? this._elements[14].value = t : this._elements[14] = t;
  }
  set m33(t) {
    typeof t == "number" ? this._elements[15].value = t : this._elements[15] = t;
  }
  get 0() {
    return this._elements[0];
  }
  get 1() {
    return this._elements[1];
  }
  get 2() {
    return this._elements[2];
  }
  get 3() {
    return this._elements[3];
  }
  get 4() {
    return this._elements[4];
  }
  get 5() {
    return this._elements[5];
  }
  get 6() {
    return this._elements[6];
  }
  get 7() {
    return this._elements[7];
  }
  get 8() {
    return this._elements[8];
  }
  get 9() {
    return this._elements[9];
  }
  get 10() {
    return this._elements[10];
  }
  get 11() {
    return this._elements[11];
  }
  get 12() {
    return this._elements[12];
  }
  get 13() {
    return this._elements[13];
  }
  get 14() {
    return this._elements[14];
  }
  get 15() {
    return this._elements[15];
  }
  toArray() {
    return [...this._elements];
  }
  clone() {
    return new Qu(this._elements[0].value, this._elements[1].value, this._elements[2].value, this._elements[3].value, this._elements[4].value, this._elements[5].value, this._elements[6].value, this._elements[7].value, this._elements[8].value, this._elements[9].value, this._elements[10].value, this._elements[11].value, this._elements[12].value, this._elements[13].value, this._elements[14].value, this._elements[15].value);
  }
  set(t, n, r, i, s, o, a, l, c, u, d, p, f, h, y, b) {
    return this._elements[0].value = t, this._elements[1].value = n, this._elements[2].value = r, this._elements[3].value = i, this._elements[4].value = s, this._elements[5].value = o, this._elements[6].value = a, this._elements[7].value = l, this._elements[8].value = c, this._elements[9].value = u, this._elements[10].value = d, this._elements[11].value = p, this._elements[12].value = f, this._elements[13].value = h, this._elements[14].value = y, this._elements[15].value = b, this;
  }
  identity() {
    return this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  }
  copy(t) {
    for (let n = 0; n < 16; n++) this._elements[n].value = t.elements[n].value;
    return this;
  }
}, Qw = (e = 1, t = 0, n = 0, r = 0, i = 0, s = 1, o = 0, a = 0, l = 0, c = 0, u = 1, d = 0, p = 0, f = 0, h = 0, y = 1) => new Ju(e, t, n, r, i, s, o, a, l, c, u, d, p, f, h, y), Zw = (e) => {
  switch (e.length) {
    case 2:
      return new Y(e[0], e[1]);
    case 3:
      return new Xt(e[0], e[1], e[2]);
    case 4:
      return new dn(e[0], e[1], e[2], e[3]);
    default:
      throw new Error(`Unsupported vector dimension: ${e.length}`);
  }
}, e0 = (e) => {
  if (e instanceof Y) return [e.x, e.y];
  if (e instanceof Xt) return [
    e.x,
    e.y,
    e.z
  ];
  if (e instanceof dn) return [
    e.x,
    e.y,
    e.z,
    e.w
  ];
  throw new Error("Unsupported vector type");
}, t0 = (e, t, n) => on(e, new Y(t, n)), n0 = (e, t, n = t) => new Y(g([e.x, t], () => e.x.value * t.value), g([e.y, n], () => e.y.value * n.value)), r0 = (e, t) => {
  const n = g([t], () => Math.cos(t.value)), r = g([t], () => Math.sin(t.value));
  return new Y(g([
    e.x,
    e.y,
    n,
    r
  ], () => e.x.value * n.value - e.y.value * r.value), g([
    e.x,
    e.y,
    n,
    r
  ], () => e.x.value * r.value + e.y.value * n.value));
}, nl = (e = 0, t = 0, n = 0, r = 0) => ({
  position: X(e, t),
  size: X(n, r)
}), Zu = (e) => on(e.position, Sa(e.size, w(0.5))), ef = (e, t) => g([
  e.position.x,
  e.position.y,
  e.size.x,
  e.size.y,
  t.x,
  t.y
], () => {
  const n = t.x.value >= e.position.x.value && t.x.value <= e.position.x.value + e.size.x.value, r = t.y.value >= e.position.y.value && t.y.value <= e.position.y.value + e.size.y.value;
  return n && r;
}), Tm = (e, t) => g([
  e.position.x,
  e.position.y,
  e.size.x,
  e.size.y,
  t.position.x,
  t.position.y,
  t.size.x,
  t.size.y
], () => {
  const n = e.position.x.value + e.size.x.value, r = e.position.y.value + e.size.y.value, i = t.position.x.value + t.size.x.value, s = t.position.y.value + t.size.y.value;
  return !(e.position.x.value > i || n < t.position.x.value || e.position.y.value > s || r < t.position.y.value);
}), Mm = (e, t) => {
  const n = g([e.position.x, t.position.x], () => Math.min(e.position.x.value, t.position.x.value)), r = g([e.position.y, t.position.y], () => Math.min(e.position.y.value, t.position.y.value)), i = g([
    e.position.x,
    e.size.x,
    t.position.x,
    t.size.x
  ], () => Math.max(e.position.x.value + e.size.x.value, t.position.x.value + t.size.x.value)), s = g([
    e.position.y,
    e.size.y,
    t.position.y,
    t.size.y
  ], () => Math.max(e.position.y.value + e.size.y.value, t.position.y.value + t.size.y.value));
  return {
    position: new Y(n, r),
    size: new Y(g([i, n], () => i.value - n.value), g([s, r], () => s.value - r.value))
  };
}, Ps = (e, t) => new Y(g([
  e.x,
  t.position.x,
  t.size.x
], () => Math.max(t.position.x.value, Math.min(e.x.value, t.position.x.value + t.size.x.value))), g([
  e.y,
  t.position.y,
  t.size.y
], () => Math.max(t.position.y.value, Math.min(e.y.value, t.position.y.value + t.size.y.value)))), Rm = (e, t) => {
  const n = Ps(e, t);
  return tf(ss(e, n));
}, Om = (e) => g([e.size.x, e.size.y], () => e.size.x.value * e.size.y.value), i0 = (e, t) => {
  const n = Zu(e), r = Sa(e.size, t);
  return {
    position: ss(n, Sa(r, w(0.5))),
    size: r
  };
}, s0 = (e, t) => {
  const n = [
    e.position,
    on(e.position, new Y(e.size.x, w(0))),
    on(e.position, e.size),
    on(e.position, new Y(w(0), e.size.y))
  ].map(t);
  return Mm({
    position: n[0],
    size: X(0, 0)
  }, {
    position: n[1],
    size: X(0, 0)
  });
}, o0 = (e, t) => new Y(g([e.x, t.position.x], () => e.x.value - t.position.x.value), g([e.y, t.position.y], () => e.y.value - t.position.y.value)), a0 = (e, t) => on(e, t.position), l0 = (e, t, n = "fit") => g([
  e.size.x,
  e.size.y,
  t
], () => {
  const r = e.size.x.value / e.size.y.value, i = t.value;
  let s = e.size.x.value, o = e.size.y.value;
  return n === "fit" ? r > i ? o = s / i : s = o * i : r > i ? s = o * i : o = s / i, {
    position: e.position,
    size: X(s, o)
  };
}), c0 = (e, t, n = w(0.1)) => g([
  e,
  t,
  n
], () => {
  const r = t.value - e.value;
  return e.value + r * n.value;
}), u0 = (e, t, n, r) => g([
  e,
  t,
  n,
  r
], () => (e.value - t.value) / (n.value - t.value) * r.value), f0 = (e, t, n) => {
  const r = g([e, t], () => {
    const i = t.value / e.value;
    return Math.max(20, i * t.value);
  });
  return {
    thumbSize: r,
    thumbPosition: g([
      n,
      e,
      t,
      r
    ], () => {
      const i = e.value - t.value;
      return (i > 0 ? n.value / i : 0) * (t.value - r.value);
    })
  };
}, d0 = (e, t, n = "x") => {
  const r = n === "x" ? t.position.x : t.position.y, i = n === "x" ? t.size.x : t.size.y;
  return g([
    e,
    r,
    i
  ], () => {
    const s = e.value - r.value;
    return Math.max(0, Math.min(1, s / i.value));
  });
}, h0 = (e) => g([e], () => {
  const t = e.value;
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}), p0 = (e) => g([e], () => {
  let t = e.value;
  const n = 7.5625, r = 2.75;
  return t < 1 / r ? n * t * t : t < 2 / r ? (t -= 1.5 / r, n * t * t + 0.75) : t < 2.5 / r ? (t -= 2.25 / r, n * t * t + 0.9375) : (t -= 2.625 / r, n * t * t + 0.984375);
}), y0 = (e, t = w(0.95), n = w(0.01)) => g([
  e,
  t,
  n
], () => {
  const r = e.value * t.value;
  return Math.abs(r) < n.value ? 0 : r;
}), m0 = (e, t, n, r = w(50)) => g([
  e,
  t,
  n,
  r
], () => {
  const i = t.value - n.value;
  if (e.value < 0) return -Math.min(r.value, Math.abs(e.value)) * 0.3;
  if (e.value > i) {
    const s = e.value - i;
    return i + Math.min(r.value, s) * 0.3;
  }
  return e.value;
}), tc = (e) => {
  const t = [], n = (r) => {
    r && typeof r == "object" && "value" in r ? t.push(r) : Array.isArray(r) ? r.forEach(n) : r && typeof r == "object" && Object.values(r).forEach(n);
  };
  return n(e), t;
}, g = (e, t) => {
  const n = () => e.map((o) => o && typeof o == "object" && "value" in o ? o.value : o), r = t(...n());
  if (typeof r == "number") {
    const o = w(r), a = () => {
      o.value = t(...n());
    };
    return tc(e).forEach((l) => W(l, a)), o;
  }
  let i = r;
  const s = () => {
    i = t(...n());
  };
  return tc(e).forEach((o) => W(o, s)), i;
}, v0 = (e, t) => g([e, t], () => e.value + t.value), g0 = (e, t) => g([e, t], () => e.value - t.value), b0 = (e, t) => g([e, t], () => e.value * t.value), w0 = (e, t) => g([e, t], () => e.value / t.value), S0 = (e, t) => g([e, t], () => e.value % t.value), x0 = (e, t) => g([e, t], () => Math.pow(e.value, t.value)), _0 = (e) => g(e, () => Math.sin(e.value)), k0 = (e) => g(e, () => Math.cos(e.value)), E0 = (e) => g(e, () => Math.tan(e.value)), C0 = (e) => g(e, () => Math.asin(e.value)), P0 = (e) => g(e, () => Math.acos(e.value)), A0 = (e) => g(e, () => Math.atan(e.value)), T0 = (e, t) => g([e, t], () => Math.atan2(e.value, t.value)), M0 = (e, t) => g([e, t], () => Math.hypot(e.value, t.value)), R0 = (e) => g(e, () => Math.sqrt(e.value)), O0 = (e) => g(e, () => Math.cbrt(e.value)), I0 = (e) => g(e, () => Math.abs(e.value)), N0 = (e) => g(e, () => Math.sign(e.value)), z0 = (e, t, n) => g([
  e,
  t,
  n
], () => Math.min(Math.max(e.value, t.value), n.value)), on = (e, t) => new Y(g([e.x, t.x], () => e.x.value + t.x.value), g([e.y, t.y], () => e.y.value + t.y.value)), ss = (e, t) => new Y(g([e.x, t.x], () => e.x.value - t.x.value), g([e.y, t.y], () => e.y.value - t.y.value)), Sa = (e, t) => new Y(g([e.x, t], () => e.x.value * t.value), g([e.y, t], () => e.y.value * t.value)), L0 = (e, t) => new Y(g([e.x, t], () => e.x.value / t.value), g([e.y, t], () => e.y.value / t.value)), $0 = (e, t) => g([
  e.x,
  e.y,
  t.x,
  t.y
], () => e.x.value * t.x.value + e.y.value * t.y.value), tf = (e) => g([e.x, e.y], () => Math.sqrt(e.x.value * e.x.value + e.y.value * e.y.value)), D0 = (e) => {
  const t = tf(e);
  return new Y(g([e.x, t], () => e.x.value / t.value), g([e.y, t], () => e.y.value / t.value));
}, F0 = (e, t) => new Xt(g([e.x, t.x], () => e.x.value + t.x.value), g([e.y, t.y], () => e.y.value + t.y.value), g([e.z, t.z], () => e.z.value + t.z.value)), W0 = (e, t) => new Xt(g([e.x, t.x], () => e.x.value - t.x.value), g([e.y, t.y], () => e.y.value - t.y.value), g([e.z, t.z], () => e.z.value - t.z.value)), H0 = (e, t) => new Xt(g([e.x, t], () => e.x.value * t.value), g([e.y, t], () => e.y.value * t.value), g([e.z, t], () => e.z.value * t.value)), B0 = (e, t) => new Xt(g([e.x, t], () => e.x.value / t.value), g([e.y, t], () => e.y.value / t.value), g([e.z, t], () => e.z.value / t.value)), j0 = (e, t) => g([
  e.x,
  e.y,
  e.z,
  t.x,
  t.y,
  t.z
], () => e.x.value * t.x.value + e.y.value * t.y.value + e.z.value * t.z.value), U0 = (e, t) => new Xt(g([
  e.y,
  e.z,
  t.y,
  t.z
], () => e.y.value * t.z.value - e.z.value * t.y.value), g([
  e.z,
  e.x,
  t.z,
  t.x
], () => e.z.value * t.x.value - e.x.value * t.z.value), g([
  e.x,
  e.y,
  t.x,
  t.y
], () => e.x.value * t.y.value - e.y.value * t.x.value)), Im = (e) => g([
  e.x,
  e.y,
  e.z
], () => Math.sqrt(e.x.value * e.x.value + e.y.value * e.y.value + e.z.value * e.z.value)), V0 = (e) => {
  const t = Im(e);
  return new Xt(g([e.x, t], () => e.x.value / t.value), g([e.y, t], () => e.y.value / t.value), g([e.z, t], () => e.z.value / t.value));
}, q0 = (e, t) => new dn(g([e.x, t.x], () => e.x.value + t.x.value), g([e.y, t.y], () => e.y.value + t.y.value), g([e.z, t.z], () => e.z.value + t.z.value), g([e.w, t.w], () => e.w.value + t.w.value)), G0 = (e, t) => new dn(g([e.x, t.x], () => e.x.value - t.x.value), g([e.y, t.y], () => e.y.value - t.y.value), g([e.z, t.z], () => e.z.value - t.z.value), g([e.w, t.w], () => e.w.value - t.w.value)), X0 = (e, t) => new dn(g([e.x, t], () => e.x.value * t.value), g([e.y, t], () => e.y.value * t.value), g([e.z, t], () => e.z.value * t.value), g([e.w, t], () => e.w.value * t.value)), Y0 = (e, t) => new dn(g([e.x, t], () => e.x.value / t.value), g([e.y, t], () => e.y.value / t.value), g([e.z, t], () => e.z.value / t.value), g([e.w, t], () => e.w.value / t.value)), K0 = (e, t) => g([
  e.x,
  e.y,
  e.z,
  e.w,
  t.x,
  t.y,
  t.z,
  t.w
], () => e.x.value * t.x.value + e.y.value * t.y.value + e.z.value * t.z.value + e.w.value * t.w.value), Nm = (e) => g([
  e.x,
  e.y,
  e.z,
  e.w
], () => Math.sqrt(e.x.value * e.x.value + e.y.value * e.y.value + e.z.value * e.z.value + e.w.value * e.w.value)), J0 = (e) => {
  const t = Nm(e);
  return new dn(g([e.x, t], () => e.x.value / t.value), g([e.y, t], () => e.y.value / t.value), g([e.z, t], () => e.z.value / t.value), g([e.w, t], () => e.w.value / t.value));
}, mt = (e, t, n, ...r) => {
  if (n == Gu || n == Ae) {
    const c = En?.get?.([e, Ae])?.[r[0]]?.[0];
    if (c) return c;
  }
  const i = (t ?? fn)?.(null), s = n?.(e, i, ...r), o = s && typeof s == "object" && typeof s?.unbind == "function" ? s : null, a = o?.ref ?? i, l = o ? () => o.unbind() : s;
  return l && a && J(a, Symbol.dispose, l), a;
}, Q0 = (e, ...t) => mt(e, w, Em, ...t), zm = (e, ...t) => mt(e, Je, Gu, ...t), Lm = (e, ...t) => mt(e, Je, _m, ...t), Z0 = (e, ...t) => mt(e, Je, xm, ...t), $m = (e, ...t) => mt(e, w, km, ...t), nf = (...e) => {
  if (Un.has(e[0])) return Un.get(e[0])?.[1];
  const t = ym, n = (Je ?? fn)?.(null), [r, i] = t?.(null, n, ...e);
  return r && n && J(n, Symbol.dispose, r), n;
}, Qt = (e, ...t) => mt(e, w, bm, ...t), Dm = (e, ...t) => mt(e, Gt, Sm, ...t), As = (e, ...t) => mt(e, w, wm, ...t), Fm = (e, ...t) => mt(e, Gt, gm, ...t), Wm = (...e) => mt(null, Gt, vm, ...e), eS = (...e) => mt(null, Je, mm, ...e), tS = (e, t) => {
  const n = at(e);
  return Fd(n) ? be(Jc(n)) : fn(n, t);
}, Hm = (e, t = 0, n) => {
  const r = toRef(e), i = (c) => at(r)?.[["scrollWidth", "scrollHeight"][t] || "scrollWidth"] - 1 || 1, s = As(e, ["inline", "block"][t]), o = Qt(e, ["inline", "block"][t], "content-box"), a = Ur(s, i), l = () => {
    s?.[lt]?.(), a?.[lt]?.();
  };
  return W(o, (c) => {
    l?.();
  }), T(n || e, "input", () => {
    l?.();
  }), T(n || e, "change", () => {
    l?.();
  }), queueMicrotask(() => {
    l?.();
  }), a;
}, nS = (e, t, n) => {
  const r = t === 0 ? g([], () => e.clientWidth) : g([], () => e.clientHeight);
  return g([r, n], () => {
    const i = r.value / n.value;
    return Math.max(20, i * r.value);
  });
}, Bm = (e, t, n) => {
  asWeak(e);
  const r = As(e, ["inline", "block"][t]), i = Qt(e, ["inline", "block"][t], "content-box"), s = Ur(i, (a) => a + (ja(e, ["inline", "block"][t]) || 0)), o = () => {
    i?.[lt]?.(), s?.[lt]?.();
  };
  return W(r, (a) => {
    o?.();
  }), T(n || e, "input", () => {
    o?.();
  }), T(n || e, "change", () => {
    o?.();
  }), queueMicrotask(() => {
    o?.();
  }), s;
}, rS = (e, ...t) => mt(e, be({
  x: 0,
  y: 0,
  pointerId: 0
}), Cm, ...t);
function rf(e, t = 4) {
  let n = 0;
  for (let r = 0; r < e.length; r++) {
    const i = e[r];
    if (i === " ") n += 1;
    else if (i === "	") n += t - n % t;
    else break;
  }
  return n;
}
function sf(e, t, n = 4) {
  let r = 0, i = 0;
  for (; i < e.length && r < t; ) {
    const s = e[i];
    if (s === " ")
      r += 1, i++;
    else if (s === "	")
      r += n - r % n, i++;
    else break;
  }
  return e.slice(i);
}
function jm(e) {
  return e.includes(`\r
`) ? `\r
` : e.includes("\r") ? "\r" : `
`;
}
function Um(e, t) {
  for (e = Math.abs(e), t = Math.abs(t); t; ) [e, t] = [t, e % t];
  return e;
}
function Vm(e, { ignoreFirstLine: t = !0, tabWidth: n = 4 } = {}) {
  const r = e.split(/\r\n|\n|\r/), i = t ? 1 : 0, s = [];
  for (let d = i; d < r.length; d++) {
    const p = r[d];
    p.trim() !== "" && s.push(rf(p, n));
  }
  if (s.length === 0) return {
    min: 0,
    step: 0,
    allEven: !0,
    allDiv4: !0
  };
  const o = Math.min(...s), a = s.map((d) => d - o).filter((d) => d > 0);
  let l = 0;
  for (const d of a) l = l ? Um(l, d) : d;
  const c = s.every((d) => d % 2 === 0), u = s.every((d) => d % 4 === 0);
  return l === 0 ? l = u ? 4 : c ? 2 : 1 : l % 4 === 0 ? l = 4 : l % 2 === 0 ? l = 2 : l = 1, {
    min: o,
    step: l,
    allEven: c,
    allDiv4: u
  };
}
function qm(e, t, n = "floor", r = 4) {
  if (!t || t <= 1) return e;
  const i = rf(e, r);
  if (i === 0) return e;
  let s;
  n === "nearest" ? s = Math.round(i / t) * t : n === "ceil" ? s = Math.ceil(i / t) * t : s = Math.floor(i / t) * t;
  const o = i - s;
  return o > 0 ? sf(e, o, r) : o < 0 ? " ".repeat(-o) + e : e;
}
function Gm(e, { scope: t = "void-only" } = {}) {
  if (!e || typeof e != "string") return e;
  const n = /* @__PURE__ */ new Set([
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr"
  ]);
  let r = "", i = 0;
  const s = e.length;
  for (; i < s; ) {
    const o = e[i];
    if (o !== "<") {
      r += o, i++;
      continue;
    }
    if (e.startsWith("<!--", i)) {
      const b = e.indexOf("-->", i + 4);
      if (b === -1) {
        r += e.slice(i);
        break;
      }
      r += e.slice(i, b + 3), i = b + 3;
      continue;
    }
    if (e[i + 1] === "!" || e[i + 1] === "?") {
      const b = e.indexOf(">", i + 2);
      if (b === -1) {
        r += e.slice(i);
        break;
      }
      r += e.slice(i, b + 1), i = b + 1;
      continue;
    }
    if (e[i + 1] === "/") {
      const b = e.indexOf(">", i + 2);
      if (b === -1) {
        r += e.slice(i);
        break;
      }
      r += e.slice(i, b + 1), i = b + 1;
      continue;
    }
    let a = i + 1;
    for (; a < s && /\s/.test(e[a]); ) a++;
    const l = a;
    for (; a < s && /[A-Za-z0-9:-]/.test(e[a]); ) a++;
    const c = e.slice(l, a).toLowerCase();
    let u = a, d = null;
    for (; u < s; ) {
      const b = e[u];
      if (d)
        b === d && (d = null), u++;
      else if (b === '"' || b === "'")
        d = b, u++;
      else {
        if (b === ">") break;
        u++;
      }
    }
    if (u >= s) {
      r += e.slice(i);
      break;
    }
    const p = e.slice(i, u + 1);
    if (!(t === "all" || t === "input-only" && c === "input" || t === "void-only" && n.has(c))) {
      r += p, i = u + 1;
      continue;
    }
    let f = "", h = null, y = !1;
    for (let b = 0; b < p.length; b++) {
      const m = p[b];
      if (h) {
        f += m, m === h && (h = null);
        continue;
      }
      if (m === '"' || m === "'") {
        h = m, f += m, y = !1;
        continue;
      }
      if (m === `
` || m === "\r" || m === "	" || m === " ") {
        y || (f += " ", y = !0);
        continue;
      }
      f += m, y = !1;
    }
    f = f.replace(/\s*(\/?)\s*>$/, "$1>"), r += f, i = u + 1;
  }
  return r;
}
function Xm(e, { preserveCommentGaps: t = !0 } = {}) {
  if (!e || typeof e != "string") return e;
  if (!t) return e.replace(/>\s+</g, "><");
  const n = "";
  let r = e;
  return r = r.replace(/-->([^\S\r\n]+)<!--/g, `-->${n}<!--`).replace(/-->([^\S\r\n]+)</g, `-->${n}<`).replace(/>([^\S\r\n]+)<!--/g, `>${n}<!--`), r = r.replace(/>\s+</g, "><"), r = r.replace(new RegExp(n, "g"), " "), r;
}
function of(e, { normalizeIndent: t = !0, ignoreFirstLine: n = !0, tabWidth: r = 4, alignStep: i = "auto", quantize: s = "none" } = {}) {
  if (!e || typeof e != "string" || e.indexOf("<") === -1) return e;
  e = e?.trim?.();
  const o = [], a = e.replace(/<(pre|textarea|script|style)\b[\s\S]*?<\/\1>/gi, (y) => `\0${o.push(y) - 1}\0`), l = jm(a), c = a.split(/\r\n|\n|\r/), u = n ? 1 : 0, { min: d, step: p } = Vm(a, {
    ignoreFirstLine: n,
    tabWidth: r
  });
  if (t && d > 0) for (let y = u; y < c.length; y++) {
    const b = c[y];
    b.trim() !== "" && (c[y] = sf(b, d, r));
  }
  let f = i === "auto" ? p : i;
  if (s !== "none" && f > 1) for (let y = u; y < c.length; y++) {
    const b = c[y];
    b.trim() !== "" && (c[y] = qm(b, f, s, r));
  }
  let h = c.join(l);
  return h = Gm(h, { scope: "void-only" }), h = Xm(h), h.replace(/\u0000(\d+)\u0000/g, (y, b) => o[+b])?.trim?.();
}
function Ym(e, ...t) {
  const n = t?.[0] ?? "", r = e.indexOf(n);
  if (r < 0) {
    const l = t?.join?.("") ?? "";
    return /<([A-Za-z\/!?])[\w\W]*$/.test(l) && !/>[\w\W]*$/.test(l);
  }
  const i = e.slice(0, r + 1).join("");
  let s = !1, o = !1, a = !1;
  for (let l = 0; l < i.length; l++) {
    const c = i[l], u = i[l + 1] ?? "";
    if (!s) {
      c === "<" && /[A-Za-z\/!?]/.test(u) && (s = !0, o = !1, a = !1);
      continue;
    }
    if (!o && !a) {
      if (c === '"') {
        a = !0;
        continue;
      }
      if (c === "'") {
        o = !0;
        continue;
      }
      if (c === ">") {
        s = !1;
        continue;
      }
    } else if (a) {
      if (c === '"') {
        a = !1;
        continue;
      }
    } else if (o && c === "'") {
      o = !1;
      continue;
    }
  }
  return s;
}
var oo = /* @__PURE__ */ new WeakMap(), Km = (e) => {
  const t = e.match(/^([a-zA-Z0-9\-]+)?(?:#([a-zA-Z0-9\-_]+))?((?:\.[a-zA-Z0-9\-_]+)*)$/);
  if (!t) return {
    tag: e,
    id: null,
    className: null
  };
  const [, n = "div", r, i] = t;
  return {
    tag: n,
    id: r,
    className: i ? i.replace(/\./g, " ").trim() : null
  };
}, ao = (e) => {
  if (typeof e != "string" || !e?.trim?.()) return -1;
  const t = e.match(/^#\{(\d+)\}$/);
  if (t) return parseInt(t[1] ?? "-1", 10);
  const n = e.match(/#\{(\d+)\}/);
  return n ? parseInt(n[1] ?? "-1", 10) : -1;
}, Jm = (e, t, n, r) => {
  if (!e) return e;
  const i = e.getAttribute("style"), s = i != null ? gy(i, t) : null;
  if (e != null) {
    const o = [], a = (m) => {
      const x = Array.from(e?.attributes || []).find((k) => k.name == m && k.value?.includes?.("#{"));
      if (x) {
        const k = [m, ao(x?.value) ?? -1];
        return o.push(k), k;
      }
      return [m, -1];
    };
    [
      "dataset",
      "style",
      "classList",
      "visible",
      "aria",
      "value",
      "placeholder",
      "ref"
    ].forEach((m) => {
      m === "style" && s != null || a(m);
    });
    const l = (m, x) => {
      const k = [];
      for (const v of Array.from(e?.attributes || [])) {
        const S = Array.isArray(m) ? m?.some?.((Me) => Me == "") : m == "", M = (Array.isArray(m) ? m.find((Me) => v.name?.startsWith?.(Me)) : m = v.name?.startsWith?.(m) ? m : "") ?? "", O = v.name.trim()?.replace?.(M, ""), re = v.value?.includes?.("#{") && v.value?.includes?.("}"), ie = ao(v?.value), ye = Array.isArray(x) ? x?.some?.((Me) => O?.startsWith?.(Me)) : x == O;
        re && (M == "" && S || M != "") && ie >= 0 && !ye && k.push([O, ie]);
      }
      return k;
    }, c = (m, x, k = "") => {
      const v = /* @__PURE__ */ new Map();
      for (const S of Array.from(e?.attributes || [])) {
        const M = Array.isArray(m) ? m?.some?.((Ee) => Ee == "") : m == "", O = (Array.isArray(m) ? m.find((Ee) => S.name?.startsWith?.(Ee)) : m = S.name?.startsWith?.(m) ? m : "") ?? "", re = S.name.trim()?.replace?.(O, ""), ie = S.value?.includes?.("#{") && S.value?.includes?.("}"), ye = ao(S?.value) ?? -1, Me = Array.isArray(x) ? x?.some?.((Ee) => re?.startsWith?.(Ee)) : x == re, ke = (Array.isArray(k) ? k?.some?.((Ee) => S.name === Ee) : S.name === k) && k !== "";
        if (ie && (O == "" && M || O != "" || ke) && ye >= 0 && !Me) {
          const Ee = ke ? S.name : re;
          v.has(Ee) || v.set(Ee, []), v.get(Ee)?.push(ye);
        }
      }
      return Array.from(v.entries());
    };
    let u = l(["prop:"], []), d = c(["on:", "@"], [], ""), p = c(["ref:"], [], ["ref"]), f = l(["attr:", ""], [
      "ref",
      "value",
      "placeholder"
    ]);
    s != null && (f = f.filter(([m]) => m !== "style"));
    const h = Object.fromEntries(o?.filter?.((m) => m[1] >= 0)?.map?.((m) => [m[0], t?.[m[1]] ?? null]) ?? []);
    h.attributes = Object.fromEntries(f?.filter?.((m) => m[1] >= 0)?.map?.((m) => [m[0], t?.[m[1]] ?? null]) ?? []), h.properties = Object.fromEntries(u?.filter?.((m) => m[1] >= 0)?.map?.((m) => [m[0], t?.[m[1]] ?? null]) ?? []), h.on = Object.fromEntries(d?.filter?.((m) => m[1]?.some?.((x) => x >= 0))?.map?.((m) => [m[0], m[1]?.map?.((x) => t?.[x]).filter((x) => x != null)]) ?? []), s?.kind === "direct" ? h.style = s.value : s?.kind === "template" && (h.style = s.binding), h.attributes = Object.fromEntries(f?.filter?.((m) => m[1] >= 0)?.map?.((m) => [m[0], t?.[m[1]] ?? null]) ?? []), h.properties = Object.fromEntries(u?.filter?.((m) => m[1] >= 0)?.map?.((m) => [m[0], t?.[m[1]] ?? null]) ?? []), h.on = Object.fromEntries(d?.filter?.((m) => m[1]?.some?.((x) => x >= 0))?.map?.((m) => [m[0], m[1]?.map?.((x) => t?.[x]).filter((x) => x != null)]) ?? []);
    const y = o?.find?.((m) => m[0] == "ref" && m[1] >= 0)?.[1];
    if (y != null && y >= 0) {
      const m = t?.[y];
      typeof m == "function" ? m?.(e) : m != null && typeof m == "object" && (m.value = e);
    }
    p?.forEach?.((m) => {
      m?.[1]?.filter?.((x) => x != null && x >= 0)?.map?.((x) => t?.[x])?.filter?.((x) => x != null)?.forEach?.((x) => {
        typeof x == "function" ? x?.(e) : x != null && typeof x == "object" && (x.value = e);
      });
    });
    const b = (m) => {
      if (m == null) return;
      const x = (k) => f?.some?.((v) => v[0] == k) || o?.some?.((v) => v[0] == k) || k?.startsWith?.("ref:") || k == "ref";
      for (const k of Array.from(m?.attributes || [])) (k.value?.includes?.("#{") && k.value?.includes?.("}") && x(k.name) || k.value?.startsWith?.("#{") && k.value?.endsWith?.("}") || k.name?.includes?.(":") || k.name?.includes?.("ref:") || k.name == "ref") && m?.removeAttribute?.(k.name);
      for (const k of Array.from(m?.attributes || [])) typeof k.value == "string" && /#\{\d+\}/.test(k.value) && m?.removeAttribute?.(k.name);
    };
    s?.kind === "static" && ts(e, s.cssText), b(e), Cu(e), oo?.has?.(e) || oo?.set?.(e, Cs(e, h));
  }
  return oo?.get?.(e) ?? e;
}, Qm = (e, ...t) => {
  const n = [];
  for (let i = 0; i < e?.length; i++) {
    const s = e?.[i], o = t?.[i];
    n.push(Pe(s)), n.push(o);
  }
  if (n?.length <= 1) return de(n?.[0], null, 0);
  const r = document.createDocumentFragment();
  return r.append(...n?.filter?.((i) => i != null)?.map?.((i, s) => de(i, null, s))?.filter?.((i) => i != null)), r;
};
function Zm(e, ...t) {
  return e?.at?.(0)?.trim?.()?.startsWith?.("<") && e?.at?.(-1)?.trim?.()?.endsWith?.(">") ? tv({ createElement: null })(e, ...t) : Qm(e, ...t);
}
var ev = (e) => e != null && e instanceof HTMLElement && !(e instanceof DocumentFragment || e instanceof HTMLBodyElement && e != document.body), nc = (e, t, n) => {
  n != null && (n.boundParent = e);
  let r = de(n, null, -1, e);
  _e(r) ? r?.parentNode != e && !r?.contains?.(e) && r != null && t?.replaceWith?.(ne(r) && (typeof r?.value == "object" || typeof r?.value == "function") && _e(r?.value) ? r?.value : r) : t?.remove?.();
};
function tv({ createElement: e = null } = {}) {
  return function(t, ...n) {
    let r = [];
    const i = [], s = [];
    for (let f = 0; f < t.length; f++)
      if (r.push(t?.[f] || ""), f < n.length) if (t[f]?.trim()?.endsWith?.("<")) {
        const h = Km(n?.[f]);
        r.push(h.tag || "div"), h.id && r.push(` id="${h.id}"`), h.className && r.push(` class="${h.className}"`);
      } else {
        const h = Ym(t, t?.[f] || "", t?.[f + 1] || ""), y = /[\w:\-\.\]]\s*=\s*$/.test(t[f]?.trim?.() ?? "") || t[f]?.trim?.()?.endsWith?.("="), b = t[f]?.trim?.()?.match?.(/['"]$/), m = t[f + 1]?.trim?.()?.match?.(/^['"]/) ?? b, x = b && m, k = y;
        if ((k || x) && h) {
          const v = k && !x, S = s.length;
          r.push((typeof n?.[f] == "string" ? n?.[f]?.trim?.() != "" : n?.[f] != null) ? v ? `"#{${S}}"` : `#{${S}}` : ""), s.push(n?.[f]);
        } else if (!h) {
          const v = i.length;
          r.push((typeof n?.[f] == "string" ? n?.[f]?.trim?.() != "" : n?.[f] != null) ? L(n?.[f]) ? String(n?.[f])?.trim?.() : `<!--o:${v}-->` : ""), i.push(n?.[f]);
        }
      }
    const o = of(r.join("").trim()), a = /* @__PURE__ */ new WeakMap(), l = new DOMParser().parseFromString(o, "text/html"), c = (l instanceof HTMLTemplateElement || l?.matches?.("template") ? l : l.querySelector("template"))?.content ?? l.body ?? l, u = document.createDocumentFragment(), d = Array.from(c.childNodes)?.filter((f) => f instanceof Node).map((f) => (!ev(f?.parentNode) && f?.parentNode != u && (f?.remove?.(), f != null && u?.append?.(f)), f));
    let p = [];
    return d.forEach((f) => {
      const h = f ? document.createTreeWalker(f, NodeFilter.SHOW_ALL, null) : null;
      do {
        const y = h?.currentNode;
        p.push(y);
      } while (h?.nextNode?.());
    }), p?.filter?.((f) => f?.nodeType == Node.COMMENT_NODE)?.forEach?.((f) => {
      if (f?.nodeValue?.trim?.()?.includes?.("o:") && Number.isInteger(parseInt(f?.nodeValue?.trim?.()?.slice?.(2) ?? "-1"))) {
        let h = i?.[parseInt(f?.nodeValue?.trim?.()?.slice?.(2) ?? "-1") ?? -1];
        if (h == null || h === void 0 || (typeof h == "string" ? h : null)?.trim?.() == "") f?.remove?.();
        else {
          const y = f?.parentNode;
          Array.isArray(h) || h instanceof Map || h instanceof Set ? nc?.(y, f, h = Qa(h, null, y)) : h != null && nc?.(y, f, h);
        }
      }
      f?.isConnected && f?.remove?.();
    }), p?.filter((f) => f.nodeType == Node.ELEMENT_NODE)?.map?.((f) => {
      Jm(f, s, i, a);
    }), Array.from(u?.childNodes)?.length > 1 ? u : u?.childNodes?.[0];
  };
}
var Pe = (e, ...t) => {
  if (typeof e == "string") {
    if (e?.trim?.()?.startsWith?.("<") && e?.trim?.()?.endsWith?.(">")) {
      const n = new DOMParser().parseFromString(of(e?.trim?.()), "text/html"), r = n.querySelector("template")?.content ?? n.body;
      if (r instanceof HTMLBodyElement) {
        const i = document.createDocumentFragment();
        return i.append(...Array.from(r.childNodes ?? [])), Array.from(i.childNodes)?.length > 1 ? i : i?.childNodes?.[0];
      }
      if (r instanceof DocumentFragment) return r;
      if (r?.childNodes?.length > 1) {
        const i = document.createDocumentFragment();
        return i.append(...Array.from(r?.childNodes ?? [])), i;
      }
      return r?.childNodes?.[0] ?? new Text(e);
    }
    return new Text(e);
  } else {
    if (typeof e == "function") return Pe(e?.());
    if (Array.isArray(e) && t) return Zm(e, ...t);
    if (e instanceof Node) return e;
  }
  return de(e);
}, af = /* @__PURE__ */ Symbol.for("lur.e@styleCache");
globalThis[af] ??= /* @__PURE__ */ new Map();
var nv = globalThis[af], lf = /* @__PURE__ */ Symbol.for("lur.e@styleElementCache");
globalThis[lf] ??= /* @__PURE__ */ new WeakMap();
var rv = globalThis[lf], cf = /* @__PURE__ */ Symbol.for("lur.e@propStore");
globalThis[cf] ??= /* @__PURE__ */ new WeakMap();
var gi = globalThis[cf], uf = /* @__PURE__ */ Symbol.for("lur.e@CSM");
globalThis[uf] ??= /* @__PURE__ */ new WeakMap();
var rc = globalThis[uf], ff = (e) => e.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(), ic = (e) => {
  const t = ff(e);
  return [
    "border-box",
    "content-box",
    "device-pixel-content-box"
  ].indexOf(t) >= 0 ? t : null;
}, bi = (e) => {
  const t = ff(e);
  return t?.startsWith?.("inline") ? "inline" : t?.startsWith?.("block") ? "block" : null;
}, iv = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", bn = /* @__PURE__ */ Symbol.for("@render@"), Nr = /* @__PURE__ */ Symbol.for("@defKeys@"), Yr = typeof document < "u" ? document?.createElement?.("style") : null, sc = (e, t, n) => e == "attr" ? zm.bind(null, t, n || "") : e == "media" ? Wm : e == "query" ? (r) => Ke?.(n || r || "", t) : e == "query-shadow" ? (r) => Ke?.(n || r || "", t?.shadowRoot ?? t) : e == "localStorage" ? nf : e == "inline-size" ? Qt.bind(null, t, "inline", ic(n) || "border-box") : e == "content-box" ? Qt.bind(null, t, bi(n) || "inline", "content-box") : e == "block-size" ? Qt.bind(null, t, "block", ic(n) || "border-box") : e == "border-box" ? Qt.bind(null, t, bi(n) || "inline", "border-box") : e == "scroll" ? As.bind(null, t, bi(n) || "inline") : e == "device-pixel-content-box" ? Qt.bind(null, t, bi(n) || "inline", "device-pixel-content-box") : e == "checked" ? Dm.bind(null, t) : e == "value" ? Lm.bind(null, t) : e == "value-as-number" ? $m.bind(null, t) : fn;
Yr && typeof document < "u" && document.querySelector?.("head")?.appendChild?.(Yr);
var oc = (e) => e == "query" || e == "query-shadow" ? "input" : e == "media" ? !1 : e == "localStorage" || e == "attr" ? null : e == "inline-size" || e == "block-size" || e == "border-box" || e == "content-box" || e == "scroll" || e == "device-pixel-content-box" ? 0 : e == "checked" ? !1 : e == "value" ? "" : e == "value-as-number" ? 0 : null;
Yr && (Yr.innerHTML = `@layer ux-preload {
        :host { display: none; }
    }`);
function sv(e) {
  const t = e.prototype ?? Object.getPrototypeOf(e) ?? e, n = t?.$init ?? e?.$init;
  return t.$init = function(...r) {
    n?.call?.(this, ...r);
    const i = {};
    let s = Object.getPrototypeOf(this) ?? this;
    for (; s; ) {
      if (Object.hasOwn(s, Nr)) {
        const o = Object.assign({}, Object.getOwnPropertyDescriptors(s), s[Nr] ?? {});
        for (const a of Object.keys(o)) a in i || (i[a] = o[a]);
      }
      s = Object.getPrototypeOf(s);
    }
    for (const [o, a] of Object.entries(i)) {
      const l = typeof o == "string" && typeof this.getAttribute == "function" ? this.getAttribute(o) : null, c = this[o];
      a != null && Object.defineProperty(this, o, a);
      try {
        const u = l != null && String(l).length > 0 ? l : c;
        u != null && u !== "" && (this[o] = u);
      } catch {
      }
    }
    return this;
  }, e;
}
function iS(e = 8) {
  let t = "";
  for (let r = 0; r < e; r++) t += iv.charAt(Math.floor(Math.random() * 52));
  return t;
}
function ov(e, t) {
  return function(n, r) {
    const i = globalThis?.customElements;
    try {
      if (!i || !e || typeof i.get != "function" || typeof i.define != "function") return n;
      const s = i.get(e);
      if (s) return s;
      i?.define?.(e, n, t);
    } catch (s) {
      if (s?.name === "NotSupportedError" || /has already been used|already been defined/i.test(s?.message || "")) return i?.get?.(e) ?? n;
      throw s;
    }
    return n;
  };
}
function sS(e = {}) {
  const { attribute: t, source: n, name: r, from: i } = e;
  return function(s, o) {
    const a = typeof t == "string" ? t : r ?? o;
    if (t !== !1 && a != null) {
      const l = s.constructor;
      l.observedAttributes || (l.observedAttributes = []), l.observedAttributes.indexOf(a) < 0 && l.observedAttributes.push(a);
    }
    Object.hasOwn(s, Nr) || (s[Nr] = {}), s[Nr][o] = {
      get() {
        const l = this, c = l[bn], u = i ? i instanceof HTMLElement ? i : typeof i == "string" ? Ke?.(i, l) : l : l;
        let d = gi.get(l), p = d?.get?.(o);
        return p == null && n != null && (d || gi.set(l, d = /* @__PURE__ */ new Map()), d?.has?.(o) || d?.set?.(o, p = sc(n, u, r || o)?.(oc(n)))), c ? p : p?.element instanceof HTMLElement ? p?.element : (typeof p == "object" || typeof p == "function") && (p?.value != null || "value" in p) ? p?.value : p;
      },
      set(l) {
        const c = this, u = i ? i instanceof HTMLElement ? i : typeof i == "string" ? Ke?.(i, c) : c : c;
        let d = gi.get(c), p = d?.get?.(o);
        if (p == null && n != null) {
          if (d || gi.set(c, d = /* @__PURE__ */ new Map()), !d?.has?.(o)) {
            const f = (typeof l == "object" || typeof l == "function" ? l?.value : null) ?? l ?? oc(n);
            d?.set?.(o, p = sc(n, u, r || o)?.(f));
          }
        } else if (typeof p == "object" || typeof p == "function") try {
          typeof l == "object" && l != null && (l?.value == null && !("value" in l) || typeof l?.value == "object" || typeof l?.value == "function") ? Object.assign(p, l?.value ?? l) : p.value = (typeof l == "object" || typeof l == "function" ? l?.value : null) ?? l;
        } catch (f) {
          console.warn("Error setting property value:", f);
        }
      },
      enumerable: !0,
      configurable: !0
    };
  };
}
var jt = /* @__PURE__ */ new WeakMap(), ac = (e, t) => {
  let n = jt.get(e);
  n || jt.set(e, n = []), t && n.indexOf(t) < 0 && n.push(t), e.shadowRoot && (e.shadowRoot.adoptedStyleSheets = [...e.shadowRoot.adoptedStyleSheets || [], ...n.filter((r) => !e.shadowRoot.adoptedStyleSheets?.includes(r))]);
}, df = (e, t) => {
  if (!t) return null;
  let n = t;
  if (typeof t == "function") try {
    const a = new WeakRef(e);
    n = t.call(e, a);
  } catch (a) {
    return console.warn("Error calling styles function:", a), null;
  }
  if (n && typeof CSSStyleSheet < "u" && n instanceof CSSStyleSheet)
    return ac(e, n), null;
  if (n instanceof Promise)
    return n.then((a) => {
      a instanceof CSSStyleSheet ? ac(e, a) : a != null && df(e, a);
    }).catch((a) => {
      console.warn("Error loading adopted stylesheet:", a);
    }), null;
  if (typeof n == "string" || n instanceof Blob || n instanceof File) {
    const a = au(n, "");
    if (a) {
      let l = jt.get(e);
      l || jt.set(e, l = []);
      const c = (u) => {
        u && l.indexOf(u) < 0 && l.push(u), e.shadowRoot && (e.shadowRoot.adoptedStyleSheets = [...e.shadowRoot.adoptedStyleSheets || [], ...l.filter((d) => !e.shadowRoot.adoptedStyleSheets?.includes(d))]);
      };
      return a instanceof Promise ? (a.then(c).catch((u) => {
        console.warn("Error loading adopted stylesheet:", u);
      }), null) : (c(a), null);
    }
  }
  const r = typeof t == "function" || typeof t == "object" ? rv : nv, i = r.get(t);
  let s = i?.styleElement, o = i?.vars;
  if (!i) {
    let a = "", l = [];
    typeof n == "string" ? a = n || "" : typeof n == "object" && n != null && (n instanceof HTMLStyleElement ? s = n : (a = typeof n.css == "string" ? n.css : typeof n == "string" ? n : String(n), l = n?.props ?? l, o = n?.vars ?? o)), !s && a && (s = Dn(a, e, "ux-layer")), r.set(t, {
      css: a,
      props: l,
      vars: o,
      styleElement: s
    });
  }
  return s;
}, lo = (e) => !(e instanceof HTMLDivElement || e instanceof HTMLImageElement || e instanceof HTMLVideoElement || e instanceof HTMLCanvasElement) && !(e?.hasAttribute?.("is") || e?.getAttribute?.("is") != null), oS = ov;
function aS(e) {
  const t = globalThis.HTMLElement ?? class {
  }, n = e ?? t, r = rc.get(n);
  if (r) return r;
  class i extends n {
    #e;
    #t;
    #n;
    #s = !1;
    styleLibs = [];
    adoptedStyleSheets = [];
    get styles() {
    }
    get initialAttributes() {
    }
    styleLayers() {
      return [];
    }
    render(a) {
      return document.createElement("slot");
    }
    constructor(...a) {
      if (super(...a), lo(this)) {
        const l = pa(this.shadowRoot ?? this.createShadowRoot?.() ?? this.attachShadow({ mode: "open" })), c = this.#n ??= Yr?.cloneNode?.(!0), u = l.querySelector('style[data-type="ux-layer"]');
        u ? u.after(c) : l.prepend(c);
      }
      this.styleLibs ??= [];
    }
    $makeLayers() {
      return `@layer ${[
        "ux-preload",
        "ux-layer",
        ...this.styleLayers?.() ?? []
      ].join?.(",") ?? ""};`;
    }
    onInitialize(a) {
      return this;
    }
    onRender(a) {
      return this;
    }
    getProperty(a) {
      const l = this[bn];
      this[bn] = !0;
      const c = this[a];
      return this[bn] = l, l || delete this[bn], c;
    }
    loadStyleLibrary(a) {
      const l = this.shadowRoot, c = typeof a == "function" ? a?.(l) : a;
      if (c instanceof HTMLStyleElement)
        this.styleLibs?.push?.(c), this.#t?.isConnected ? this.#t?.before?.(c) : this.shadowRoot?.prepend?.(c);
      else if (c instanceof CSSStyleSheet) {
        let u = jt.get(this);
        u || jt.set(this, u = []), u.indexOf(c) < 0 && u.push(c), l && (l.adoptedStyleSheets = [...l.adoptedStyleSheets || [], ...u.filter((d) => !l.adoptedStyleSheets?.includes(d))]);
      } else {
        const u = au(c, "ux-layer");
        let d = jt.get(this);
        d || jt.set(this, d = []);
        const p = (f) => {
          f && d.indexOf(f) < 0 && d.push(f), l && (l.adoptedStyleSheets = [...l.adoptedStyleSheets || [], ...d.filter((h) => !l.adoptedStyleSheets?.includes(h))]);
        };
        u instanceof Promise ? u.then(p).catch(() => {
        }) : u && p(u);
      }
      return this;
    }
    createShadowRoot() {
      return this.shadowRoot ?? this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
      super.connectedCallback && super.connectedCallback();
      const a = new WeakRef(this);
      if (!this.#s) {
        this.#s = !0;
        const l = lo(this) ? this.createShadowRoot?.() ?? this.shadowRoot ?? this.attachShadow({ mode: "open" }) : this.shadowRoot, c = this.constructor, u = this.$init ?? c.prototype?.$init;
        typeof u == "function" && u.call(this);
        const d = typeof this.initialAttributes == "function" ? this.initialAttributes() : this.initialAttributes;
        if (Kd(this, d), this.onInitialize?.call(this, a), this[bn] = !0, lo(this) && l) {
          const p = this.render?.call?.(this, a) ?? document.createElement("slot"), f = df(this, this.styles);
          f instanceof HTMLStyleElement && (this.#t = f);
          const h = [
            Pe`<style data-type="ux-layer" prop:innerHTML=${this.$makeLayers()}></style>`,
            this.#n,
            ...this.styleLibs.map((b) => b.cloneNode?.(!0)) || [],
            f,
            p
          ].filter((b) => b != null && _e(b));
          l.append(...h);
          const y = jt.get(this) || [];
          y.length > 0 && (l.adoptedStyleSheets = [...y.filter((b) => !l.adoptedStyleSheets?.includes(b)), .../* @__PURE__ */ new Set([...l.adoptedStyleSheets || []])]);
        }
        this.onRender?.call?.(this, a), delete this[bn], l && pa(l);
      }
    }
    disconnectedCallback() {
      super.disconnectedCallback && super.disconnectedCallback();
    }
    adoptedCallback() {
      super.adoptedCallback && super.adoptedCallback();
    }
    attributeChangedCallback(a, l, c) {
      super.attributeChangedCallback && super.attributeChangedCallback(a, l, c);
    }
  }
  const s = sv(i);
  return rc.set(n, s), console.log("result", s), s;
}
var xa = (e = [], t) => e.find((n) => t == n || typeof n.taskId == "string" && n.taskId?.replace?.(/^#/, "") == (typeof t == "string" ? t?.replace?.(/^#/, "") : null)), _a = (e) => {
  const t = String(e || "").trim(), n = t ? t.startsWith("#") ? t : `#${t.replace(/^#/, "")}` : "";
  try {
    return `${location.pathname}${location.search}${n}`;
  } catch {
    return n || "#";
  }
}, lS = (e = []) => {
  Xe(!0), history?.back?.();
  const t = nn(e, !1)?.taskId || "";
  return location?.hash?.trim?.()?.replace?.(/^#/, "")?.trim?.() != t?.trim?.()?.replace?.(/^#/, "")?.trim?.() && (Xe(!0), history?.replaceState?.("", "", _a(t))), e;
}, nn = (e = [], t = !0) => e.findLast((n) => n.active) ?? (t ? e?.find?.((n) => n.taskId?.replace?.(/^#/, "") == location.hash?.replace?.(/^#/, "")) : null), av = (e, t) => lr({
  id: `task-${e.taskId?.replace?.(/^#/, "") ?? e.taskId}`,
  priority: Uu.TASK,
  group: "task",
  isActive: () => e.active === !0,
  close: (n) => (e.active = !1, t?.() ?? !1)
}), cS = (e, t) => {
  let n = !1;
  if (om({
    preventDefaultNavigation: !1,
    pushInitialState: !1
  }), t && lr({
    id: "task-env-manager",
    priority: Uu.VIEW,
    isActive: () => !!nn(e, !0),
    close: () => {
      const r = nn(e, !0);
      return !!(r && t(r));
    }
  }), T(window, "hashchange", (r) => {
    if (!(n || Za())) {
      n = !0;
      try {
        const i = xa(e, location.hash);
        if (i) i.focus = !0;
        else {
          const s = nn(e, !1)?.taskId || location.hash || "";
          if (location.hash?.trim?.()?.replace?.(/^#/, "")?.trim?.() != s?.trim?.()?.replace?.(/^#/, "")?.trim?.()) {
            Xe(!0);
            const o = history.state || {};
            history?.replaceState?.(o, "", _a(s));
          }
        }
      } finally {
        n = !1;
      }
    }
  }), !history.state?.backNav) {
    Xe(!0);
    const r = history.state || {};
    history?.replaceState?.({
      ...r,
      backNav: !0,
      depth: history.length
    }, "", _a(location.hash || "")), Xe(!1);
  }
  return e;
}, lc = (e) => {
  const t = String(e || "").trim(), n = t ? t.startsWith("#") ? t : `#${t.replace(/^#/, "")}` : "";
  try {
    return `${location.pathname}${location.search}${n}`;
  } catch {
    return n || "#";
  }
}, cc = class {
  $active = !1;
  $action;
  payload;
  taskId;
  list;
  _unregisterBack;
  constructor(e, t, n = null, r = {}, i) {
    this.taskId = e, this.list = t, this.payload = r, Object.assign(this, n), this.$action = i ?? (() => {
      if (location.hash != this.taskId && this.taskId) {
        Xe(!0), history.replaceState("", "", lc(this.taskId || location.hash)), Xe(!1);
        return;
      }
    }), this.addSelfToList(t, !1);
  }
  addSelfToList(e, t = !1) {
    if (e == null) return this;
    const n = xa(e, this);
    if (n != this && (n ? Object.assign(n, this) : e?.push(co(this))), this.list = e, t) {
      this.focus = !0, Xe(!0);
      const r = nn(e, !1)?.taskId || this.taskId || location.hash || "";
      history.pushState({ backNav: !0 }, "", lc(r)), Xe(!1), document.dispatchEvent(new CustomEvent("task-focus", {
        detail: this,
        bubbles: !0,
        composed: !0,
        cancelable: !0
      }));
    }
    return this;
  }
  get active() {
    return !!this.$active;
  }
  get order() {
    return this.list?.findIndex?.((e) => e == this || typeof e.taskId == "string" && e.taskId == this.taskId) ?? -1;
  }
  get focus() {
    if (!this.taskId) return !1;
    const e = this.list?.findLast?.((t) => t.active) ?? null;
    return e ? !!(e?.taskId && e?.taskId == this.taskId) : !1;
  }
  set active(e) {
    this != null && this?.$active != e && (this.$active = e, e ? this._unregisterBack = av(this) : (this._unregisterBack?.(), this._unregisterBack = void 0), document.dispatchEvent(new CustomEvent("task-focus", {
      detail: nn(this.list ?? [], !1),
      bubbles: !0,
      composed: !0,
      cancelable: !0
    })));
  }
  set focus(e) {
    if (e && e != this.focus) {
      const t = this.order;
      if (!this.focus && t >= 0) {
        const n = this.list?.findLastIndex?.((r) => r.focus) ?? -1;
        if (t < n || n < 0) {
          if (this.list)
            for (const r of this.list) r != this && r?.taskId != this.taskId && (r.focus = !1);
          this.list?.[ei]?.(() => {
            this.list?.splice?.(t, 1), this.list?.push?.(co(this));
          }), document.dispatchEvent(new CustomEvent("task-focus", {
            detail: nn(this.list ?? [], !1),
            bubbles: !0,
            composed: !0,
            cancelable: !0
          }));
        }
        this.takeAction();
      }
    }
  }
  takeAction() {
    return this.$action?.call?.(this);
  }
  removeFromList() {
    if (!this.list) return this;
    const e = this.list.indexOf(xa(this.list, this) ?? co(this)) ?? -1;
    e >= 0 && this.list.splice(e, 1);
    const t = this.list;
    return this.list = null, document.dispatchEvent(new CustomEvent("task-focus", {
      detail: nn(t ?? [], !1),
      bubbles: !0,
      composed: !0,
      cancelable: !0
    })), this;
  }
}, co = (e, t, n = null, r = {}, i) => e instanceof cc ? be(e) : be(new cc(e, t, n, r, i)), uS = (e) => {
  const t = be([]);
  return e(t), t;
}, wi = /* @__PURE__ */ new WeakMap(), lv = (e, t) => `${e}|c:${t?.capture ? "1" : "0"}|p:${t?.passive ? "1" : "0"}`, zr = (e, t, n, r = {}) => {
  if (!e || typeof e.addEventListener != "function") return () => {
  };
  const i = {
    capture: !!r.capture,
    passive: !!r.passive
  }, s = lv(t, i);
  let o = wi.get(e);
  o || (o = /* @__PURE__ */ new Map(), wi.set(e, o));
  let a = o.get(s);
  if (!a) {
    const l = /* @__PURE__ */ new Set(), c = (u) => {
      for (const d of Array.from(l)) try {
        d(u);
      } catch (p) {
        console.warn(p);
      }
    };
    o.set(s, a = {
      handlers: l,
      listener: c,
      options: i
    }), e.addEventListener(t, c, i);
  }
  return a.handlers.add(n), () => {
    const l = wi.get(e), c = l?.get(s);
    c && (c.handlers.delete(n), !(c.handlers.size > 0) && (e.removeEventListener(t, c.listener, c.options), l?.delete(s), l && l.size === 0 && wi.delete(e)));
  };
}, Si = /* @__PURE__ */ new WeakMap(), br = (e) => {
  const t = e?.element ?? e;
  return t instanceof HTMLElement ? t : null;
}, uo = (e, t, n) => e ? e === "handled" ? n : t : !1, cv = (e, t, n = {
  capture: !0,
  passive: !1
}, r = {}) => {
  const i = e;
  if (!i || typeof i.addEventListener != "function") return (u, d) => () => {
  };
  const s = {
    capture: !!n.capture,
    passive: !!n.passive
  }, o = r.strategy ?? "closest", a = `${t}|c:${s.capture ? "1" : "0"}|p:${s.passive ? "1" : "0"}|s:${o}|pd:${String(r.preventDefault ?? "")}|sp:${String(r.stopPropagation ?? "")}|sip:${String(r.stopImmediatePropagation ?? "")}`;
  let l = Si.get(i);
  l || (l = /* @__PURE__ */ new Map(), Si.set(i, l));
  let c = l.get(a);
  if (!c) {
    const u = /* @__PURE__ */ new Map();
    c = {
      targets: u,
      unbindGlobal: null,
      options: s,
      strategy: o,
      config: r,
      dispatch: (p) => {
        let f = !1, h = !1;
        const y = (m) => {
          if (!(!m || m.size === 0)) {
            f = !0;
            for (const x of Array.from(m)) x(p) && (h = !0);
          }
        }, b = p?.composedPath?.();
        if (Array.isArray(b)) if (o === "closest") for (const m of b) {
          const x = br(m);
          if (!x) continue;
          const k = u.get(x);
          if (k) {
            y(k);
            break;
          }
        }
        else for (const m of b) {
          const x = br(m);
          x && y(u.get(x));
        }
        else {
          let m = br(p?.target);
          for (; m; ) {
            const x = u.get(m);
            if (x && (y(x), o === "closest"))
              break;
            const k = m.getRootNode?.();
            m = m.parentElement || (k instanceof ShadowRoot ? k.host : null);
          }
        }
        uo(r.preventDefault, f, h) && p?.preventDefault?.(), uo(r.stopImmediatePropagation, f, h) && p?.stopImmediatePropagation?.(), uo(r.stopPropagation, f, h) && p?.stopPropagation?.();
      }
    }, l.set(a, c);
  }
  return (u, d) => {
    const p = br(u);
    if (!p) return () => {
    };
    c.targets.size === 0 && !c.unbindGlobal && (c.unbindGlobal = zr(i, t, c.dispatch, c.options));
    let f = c.targets.get(p);
    return f || (f = /* @__PURE__ */ new Set(), c.targets.set(p, f)), f.add(d), () => {
      const h = Si.get(i), y = h?.get(a);
      if (!y) return;
      const b = br(u);
      if (!b) return;
      const m = y.targets.get(b);
      m && (m.delete(d), m.size === 0 && y.targets.delete(b), y.targets.size === 0 && (y.unbindGlobal?.(), y.unbindGlobal = null, h?.delete(a), h && h.size === 0 && Si.delete(i)));
    };
  };
}, uv = typeof document < "u" ? document?.documentElement : null, ka = (e, t, n) => {
  if (e?.deref?.() != null) return e.deref()[t] = n;
};
function hf(e = null, t = Gt(!1), n = [
  "pointerdown",
  "click",
  "contextmenu",
  "scroll"
], r = document?.documentElement) {
  if (!r) return () => {
  };
  const i = new WeakRef(t), s = typeof t == "function" ? t : (l) => {
    (!(e?.contains?.(l?.target) || l?.target == (e?.element ?? e)) || !e) && ka(i, "value", !1);
  }, o = n.map((l) => zr(r, l, s, {
    capture: !1,
    passive: !1
  })), a = () => o.forEach((l) => l?.());
  return J(t, Symbol.dispose, a), a;
}
var pf = (e, t) => {
  if (!e) throw Error("Element is null...");
  t && Qd(t), Zd(e);
}, rl = (e, t) => ((n) => {
  const r = n;
  if (t ??= r?.target ?? t, !t.dataset.dragging) {
    const i = [r.clientX, r.clientY];
    r?.pointerId >= 0 && t?.setPointerCapture?.(r?.pointerId);
    const s = ((u) => {
      const d = u;
      if (d?.preventDefault?.(), d?.pointerId == r?.pointerId) {
        const p = [u.clientX, u.clientY], f = [p[0] - i[0], p[1] - i[1]];
        Math.hypot(...f) > 2 && (t?.style?.setProperty?.("will-change", "inset, transform, translate, z-index"), l?.(d), e?.(r));
      }
    }), o = ((u) => {
      const d = u;
      d?.pointerId == r?.pointerId && (t?.releasePointerCapture?.(r?.pointerId), l?.(d));
    }), a = {
      pointermove: s,
      pointercancel: o,
      pointerup: o
    }, l = ((u) => {
      u?.pointerId == r?.pointerId && c?.forEach((d) => d?.());
    }), c = kt(uv, a);
  }
});
function fv(e, t) {
  let n = t;
  for (; n; ) {
    if (n === e) return !0;
    const r = n;
    if (r.assignedSlot) {
      n = r.assignedSlot;
      continue;
    }
    if (n.parentNode) {
      n = n.parentNode;
      continue;
    }
    const i = n.getRootNode?.();
    i && i.host ? n = i.host : n = null;
  }
  return !1;
}
function xi(e, t) {
  if ("composedPath" in e && typeof e.composedPath == "function") return e.composedPath().includes(t);
  const n = e.target ? e.target : e;
  return n ? fv(t, n) : !1;
}
function fS(e, t = null, n, r = {}) {
  const { root: i = typeof document < "u" ? document?.documentElement : null, closeEvents: s = [
    "scroll",
    "click",
    "pointerdown"
  ], mouseLeaveDelay: o = 100 } = r, a = new WeakRef(e);
  function l(p) {
    !xi(p, n?.element ?? n) && !xi(p, t?.element ?? t) && ka(a, "value", !1);
  }
  function c(p) {
    const f = p;
    !xi(f, n?.element ?? n) && !xi(f, t?.element ?? t) && ka(a, "value", !1);
  }
  const u = [...kt(i, Object.fromEntries(s.map((p) => [p, l]))), T(i, "pointerdown", c)];
  function d() {
    u.forEach((p) => p?.());
  }
  return J(e, Symbol.dispose, d), e;
}
var dS = (e, t, n, r = typeof document < "u" ? document?.documentElement : null) => {
  t = Ye(t);
  const i = (o) => {
    let a = Id(t);
    const l = n ? o?.target?.matches?.(n) ? o?.target : (o?.target ?? r)?.querySelector?.(n) : o?.target;
    (!l || e != l) && (a.value = !1);
  }, s = () => {
    r?.removeEventListener?.("click", i);
  };
  return r && r.addEventListener?.("click", i), s;
}, q = class yf {
  static create(t = 0, n = 0) {
    return {
      row: w(t),
      col: w(n)
    };
  }
  static toPixel(t, n) {
    return g([
      t.row,
      t.col,
      n.cellWidth,
      n.cellHeight,
      n.gap,
      n.padding.x,
      n.padding.y
    ], () => X(n.padding.x.value + t.col.value * (n.cellWidth.value + n.gap.value), n.padding.y.value + t.row.value * (n.cellHeight.value + n.gap.value)));
  }
  static fromPixel(t, n) {
    const r = g([
      t.x,
      t.y,
      n.cellWidth,
      n.cellHeight,
      n.gap,
      n.padding.x,
      n.padding.y
    ], () => {
      const i = Math.floor((t.x.value - n.padding.x.value) / (n.cellWidth.value + n.gap.value)), s = Math.floor((t.y.value - n.padding.y.value) / (n.cellHeight.value + n.gap.value));
      return yf.create(s, i);
    });
    return {
      row: g([r], () => r.value.row.value),
      col: g([r], () => r.value.col.value)
    };
  }
  static snapToGrid(t, n) {
    const r = this.fromPixel(t, n);
    return this.toPixel(r, n);
  }
  static snapToCellCenter(t, n) {
    const r = this.fromPixel(t, n), i = this.toPixel(r, n);
    return g([
      i.x,
      i.y,
      n.cellWidth,
      n.cellHeight
    ], () => X(i.x.value + n.cellWidth.value / 2, i.y.value + n.cellHeight.value / 2));
  }
  static adjacent(t, n) {
    const r = {
      up: {
        row: -1,
        col: 0
      },
      down: {
        row: 1,
        col: 0
      },
      left: {
        row: 0,
        col: -1
      },
      right: {
        row: 0,
        col: 1
      }
    }[n];
    return {
      row: g([t.row], () => t.row.value + r.row),
      col: g([t.col], () => t.col.value + r.col)
    };
  }
  static isValid(t, n) {
    return g([
      t.row,
      t.col,
      n.rows,
      n.cols
    ], () => t.row.value >= 0 && t.row.value < n.rows.value && t.col.value >= 0 && t.col.value < n.cols.value);
  }
  static manhattanDistance(t, n) {
    return g([
      t.row,
      t.col,
      n.row,
      n.col
    ], () => Math.abs(t.row.value - n.row.value) + Math.abs(t.col.value - n.col.value));
  }
  static euclideanDistance(t, n) {
    return g([
      t.row,
      t.col,
      n.row,
      n.col
    ], () => Math.sqrt(Math.pow(t.row.value - n.row.value, 2) + Math.pow(t.col.value - n.col.value, 2)));
  }
}, an = class {
  static create(e = 0, t = 0, n = 1, r = 1) {
    return {
      row: w(e),
      col: w(t),
      rowSpan: w(n),
      colSpan: w(r)
    };
  }
  static toRect(e, t) {
    const n = q.toPixel(e, t), r = g([
      e.colSpan,
      t.cellWidth,
      t.gap
    ], () => e.colSpan.value * t.cellWidth.value + (e.colSpan.value - 1) * t.gap.value), i = g([
      e.rowSpan,
      t.cellHeight,
      t.gap
    ], () => e.rowSpan.value * t.cellHeight.value + (e.rowSpan.value - 1) * t.gap.value);
    return nl(n.x, n.y, r, i);
  }
  static getCenter(e, t) {
    const n = this.toRect(e, t);
    return g([
      n.position.x,
      n.position.y,
      n.size.x,
      n.size.y
    ], () => X(n.position.x.value + n.size.x.value / 2, n.position.y.value + n.size.y.value / 2));
  }
  static overlaps(e, t) {
    return g([
      e.row,
      e.col,
      e.rowSpan,
      e.colSpan,
      t.row,
      t.col,
      t.rowSpan,
      t.colSpan
    ], () => {
      const n = e.col.value + e.colSpan.value, r = e.row.value + e.rowSpan.value, i = t.col.value + t.colSpan.value, s = t.row.value + t.rowSpan.value;
      return !(e.col.value >= i || n <= t.col.value || e.row.value >= s || r <= t.row.value);
    });
  }
  static getOccupiedCells(e) {
    const t = [];
    for (let n = 0; n < e.rowSpan.value; n++) for (let r = 0; r < e.colSpan.value; r++) t.push(q.create(e.row.value + n, e.col.value + r));
    return t;
  }
}, dv = class {
  static fitCells(e, t) {
    const n = [], r = /* @__PURE__ */ new Set();
    return e.forEach((i) => {
      let s = { ...i };
      for (let o = 0; o < t.rows.value; o++) for (let a = 0; a < t.cols.value; a++)
        if (s.row = w(o), s.col = w(a), this.canPlaceCell(s, r, t)) {
          this.markOccupied(s, r), n.push(s);
          return;
        }
      n.push(s);
    }), n;
  }
  static canPlaceCell(e, t, n) {
    return q.isValid(e, n).value ? !an.getOccupiedCells(e).some((r) => t.has(`${r.row.value},${r.col.value}`)) : !1;
  }
  static markOccupied(e, t) {
    an.getOccupiedCells(e).forEach((n) => {
      t.add(`${n.row.value},${n.col.value}`);
    });
  }
  static calculateOptimalSize(e) {
    let t = 0, n = 0;
    return e.forEach((r) => {
      t = Math.max(t, r.row.value + r.rowSpan.value), n = Math.max(n, r.col.value + r.colSpan.value);
    }), {
      rows: t,
      cols: n
    };
  }
  static redistributeCells(e, t, n = "row-major") {
    const r = [];
    let i = 0, s = 0;
    return e.forEach((o, a) => {
      switch (n) {
        case "row-major":
          s + o.colSpan.value > t.cols.value && (i++, s = 0), o.row = w(i), o.col = w(s), s += o.colSpan.value;
          break;
        case "column-major":
          i + o.rowSpan.value > t.rows.value && (s++, i = 0), o.row = w(i), o.col = w(s), i += o.rowSpan.value;
          break;
        case "diagonal":
          o.row = w(Math.floor(a / Math.sqrt(e.length))), o.col = w(a % Math.ceil(Math.sqrt(e.length)));
          break;
      }
      r.push(o);
    }), r;
  }
}, hS = class Ea {
  static animateCellMovement(t, n, r, i = 300) {
    return new Promise((s) => {
      const o = t.row.value, a = t.col.value, l = n.row.value, c = n.col.value, u = performance.now(), d = (p) => {
        const f = p - u, h = Math.min(f / i, 1), y = 1 - Math.pow(1 - h, 3);
        t.row.value = o + (l - o) * y, t.col.value = a + (c - a) * y, h < 1 ? requestAnimationFrame(d) : s();
      };
      requestAnimationFrame(d);
    });
  }
  static animateCellResize(t, n, r, i = 300) {
    return new Promise((s) => {
      const o = t.rowSpan.value, a = t.colSpan.value, l = performance.now(), c = (u) => {
        const d = u - l, p = Math.min(d / i, 1), f = 1 - Math.pow(1 - p, 3);
        t.rowSpan.value = o + (n - o) * f, t.colSpan.value = a + (r - a) * f, p < 1 ? requestAnimationFrame(c) : s();
      };
      requestAnimationFrame(c);
    });
  }
  static createAnimationChain(t, n) {
    return {
      moveTo: (r, i) => Ea.animateCellMovement(t, r, n, i),
      resizeTo: (r, i, s) => Ea.animateCellResize(t, r, i, s),
      then: function(r) {
        return this;
      }
    };
  }
}, pS = class {
  static getCellAtPixel(e, t) {
    return q.fromPixel(e, t);
  }
  static getCellsInRect(e, t) {
    const n = [], r = q.fromPixel(e.position, t), i = q.fromPixel(on(e.position, e.size), t);
    for (let s = r.row.value; s <= i.row.value; s++) for (let o = r.col.value; o <= i.col.value; o++) s >= 0 && s < t.rows.value && o >= 0 && o < t.cols.value && n.push(q.create(s, o));
    return n;
  }
  static wouldOverlap(e, t, n) {
    const r = an.create(t.row.value, t.col.value, e.rowSpan.value, e.colSpan.value);
    return n.some((i) => i !== e && an.overlaps(r, i).value);
  }
  static findValidPositions(e, t, n) {
    const r = [];
    for (let i = 0; i < t.rows.value - e.rowSpan.value + 1; i++) for (let s = 0; s < t.cols.value - e.colSpan.value + 1; s++) {
      const o = q.create(i, s);
      this.wouldOverlap(e, o, n) || r.push(o);
    }
    return r;
  }
  static calculateDragPreview(e, t, n, r) {
    const i = q.fromPixel(t, n), s = Math.max(0, Math.min(i.row.value, n.rows.value - e.rowSpan.value)), o = Math.max(0, Math.min(i.col.value, n.cols.value - e.colSpan.value)), a = q.create(s, o);
    if (this.wouldOverlap(e, a, r)) {
      const l = this.findValidPositions(e, n, r);
      if (l.length > 0) {
        let c = l[0], u = q.euclideanDistance(a, c).value;
        return l.forEach((d) => {
          const p = q.euclideanDistance(a, d).value;
          p < u && (u = p, c = d);
        }), c;
      }
    }
    return a;
  }
}, yS = (e, t) => {
  let n, r;
  if (e instanceof Y)
    n = e.x?.value ?? 0, r = e.y?.value ?? 0;
  else if (Array.isArray(e) && e.length >= 2)
    n = e[0] ?? 0, r = e[1] ?? 0;
  else return X(0, 0);
  if (!isFinite(n) || !isFinite(r)) return X(0, 0);
  const i = Math.max(1, t[0] || 1), s = Math.max(1, t[1] || 1);
  return X(Math.max(0, Math.min(Math.floor(n), i - 1)), Math.max(0, Math.min(Math.floor(r), s - 1)));
}, mS = (e, t = 1) => {
  const n = e instanceof Y ? e.x.value : e[0], r = e instanceof Y ? e.y.value : e[1];
  return X(Math.floor(n / t) * t, Math.floor(r / t) * t);
}, vS = (e, t = 1) => {
  const n = e instanceof Y ? e.x.value : e[0], r = e instanceof Y ? e.y.value : e[1];
  return X(Math.ceil(n / t) * t, Math.ceil(r / t) * t);
}, gS = (e, t = 1) => {
  const n = e instanceof Y ? e.x.value : e[0], r = e instanceof Y ? e.y.value : e[1];
  return X(Math.round(n / t) * t, Math.round(r / t) * t);
}, bS = (e, t) => {
  const n = e instanceof Y ? q.create(e.y.value, e.x.value) : q.create(e[1], e[0]), r = {
    rows: w(t[1]),
    cols: w(t[0]),
    cellWidth: w(1),
    cellHeight: w(1),
    gap: w(0),
    padding: X(0, 0)
  }, i = q.create(Math.max(0, Math.min(n.row.value, r.rows.value - 1)), Math.max(0, Math.min(n.col.value, r.cols.value - 1)));
  return X(i.col.value, i.row.value);
}, wS = (e, t) => {
  const n = e instanceof Y ? q.create(e.y.value, e.x.value) : q.create(e[1], e[0]), r = t instanceof Y ? q.create(t.y.value, t.x.value) : q.create(t[1], t[0]);
  return q.manhattanDistance(n, r).value;
}, SS = (e, t) => {
  const n = e instanceof Y ? q.create(e.y.value, e.x.value) : q.create(e[1], e[0]), r = {
    rows: w(t[1]),
    cols: w(t[0]),
    cellWidth: w(1),
    cellHeight: w(1),
    gap: w(0),
    padding: X(0, 0)
  }, i = [];
  for (const s of [
    "up",
    "down",
    "left",
    "right"
  ]) {
    const o = q.adjacent(n, s);
    q.isValid(o, r).value && i.push(X(o.col.value, o.row.value));
  }
  return i;
}, xS = (e, t, n) => {
  const r = e instanceof Y ? q.create(e.y.value, e.x.value) : q.create(e[1], e[0]);
  w(n[1]), w(n[0]), w(1), w(1), w(0), X(0, 0);
  const i = [];
  for (let s = Math.max(0, r.row.value - t); s <= Math.min(n[1] - 1, r.row.value + t); s++) for (let o = Math.max(0, r.col.value - t); o <= Math.min(n[0] - 1, r.col.value + t); o++) {
    const a = q.create(s, o);
    q.manhattanDistance(r, a).value <= t && i.push(X(o, s));
  }
  return i;
}, _S = (e, t, n, r = []) => {
  const i = e instanceof Y ? q.create(e.y.value, e.x.value) : q.create(e[1], e[0]), s = t instanceof Y ? q.create(t.y.value, t.x.value) : q.create(t[1], t[0]), o = new Set(r.map((d) => {
    const p = d instanceof Y ? q.create(d.y.value, d.x.value) : q.create(d[1], d[0]);
    return `${p.row.value},${p.col.value}`;
  })), a = {
    rows: w(n[1]),
    cols: w(n[0]),
    cellWidth: w(1),
    cellHeight: w(1),
    gap: w(0),
    padding: X(0, 0)
  }, l = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Set(), u = `${i.row.value},${i.col.value}`;
  for (l.set(u, {
    coord: i,
    f: q.manhattanDistance(i, s).value,
    g: 0,
    parent: null
  }); l.size > 0; ) {
    let d = "", p = 1 / 0;
    for (const [h, y] of l) y.f < p && (p = y.f, d = h);
    const f = l.get(d);
    if (l.delete(d), c.add(d), f.coord.row.value === s.row.value && f.coord.col.value === s.col.value) {
      const h = [];
      let y = f;
      for (; y && (h.unshift(X(y.coord.col.value, y.coord.row.value)), !!y.parent); ) {
        const b = `${y.parent.row.value},${y.parent.col.value}`;
        y = l.get(b) || null;
      }
      return h;
    }
    for (const h of [
      "up",
      "down",
      "left",
      "right"
    ]) {
      const y = q.adjacent(f.coord, h), b = `${y.row.value},${y.col.value}`;
      if (!q.isValid(y, a).value || c.has(b) || o.has(b)) continue;
      const m = f.g + 1, x = m + q.manhattanDistance(y, s).value, k = l.get(b);
      (!k || m < k.g) && l.set(b, {
        coord: y,
        f: x,
        g: m,
        parent: f.coord
      });
    }
  }
  return [];
}, kS = (e, t, n = [1, 1], r = [1, 1]) => {
  const i = e instanceof Y ? q.create(e.y.value, e.x.value) : q.create(e[1], e[0]), s = t instanceof Y ? q.create(t.y.value, t.x.value) : q.create(t[1], t[0]), o = an.create(i.row.value, i.col.value, n[1], n[0]), a = an.create(s.row.value, s.col.value, r[1], r[0]);
  return an.overlaps(o, a).value;
}, ES = (e, t) => {
  const n = {
    rows: w(t[1]),
    cols: w(t[0]),
    cellWidth: w(1),
    cellHeight: w(1),
    gap: w(0),
    padding: X(0, 0)
  }, r = e.map((i, s) => {
    const o = i.pos instanceof Y ? q.create(i.pos.y.value, i.pos.x.value) : q.create(i.pos[1], i.pos[0]);
    return an.create(o.row.value, o.col.value, i.size[1], i.size[0]);
  });
  return dv.fitCells(r, n).map((i, s) => ({
    pos: X(i.col.value, i.row.value),
    size: [i.colSpan.value, i.rowSpan.value]
  }));
}, hv = class {
  static unitPatterns = {
    px: /(-?\d*\.?\d+)px/g,
    em: /(-?\d*\.?\d+)em/g,
    rem: /(-?\d*\.?\d+)rem/g,
    vh: /(-?\d*\.?\d+)vh/g,
    vw: /(-?\d*\.?\d+)vw/g,
    vmin: /(-?\d*\.?\d+)vmin/g,
    vmax: /(-?\d*\.?\d+)vmax/g,
    percent: /(-?\d*\.?\d+)%/g
  };
  static toPixels(e, t) {
    if (!e) return 0;
    const n = t || document.body, r = document.createElement("div");
    r.style.position = "absolute", r.style.visibility = "hidden", r.style.width = e, n.appendChild(r);
    const i = r.offsetWidth;
    return n.removeChild(r), i;
  }
  static fromPixels(e, t = "px") {
    switch (t) {
      case "em":
        return `${e / parseFloat(getComputedStyle(document.body).fontSize)}em`;
      case "rem":
        return `${e / parseFloat(getComputedStyle(document.documentElement).fontSize)}rem`;
      case "%":
        return `${e / globalThis.innerWidth * 100}%`;
      default:
        return `${e}px`;
    }
  }
  static parseValue(e) {
    const t = e.match(/^(-?\d*\.?\d+)([a-z%]+)?$/);
    return t ? {
      value: parseFloat(t[1]),
      unit: t[2] || "px"
    } : {
      value: 0,
      unit: "px"
    };
  }
  static convertUnits(e, t, n, r) {
    if (t === n) return e;
    let i;
    switch (t) {
      case "px":
        i = e;
        break;
      case "em":
        i = e * parseFloat(getComputedStyle(r || document.body).fontSize);
        break;
      case "rem":
        i = e * parseFloat(getComputedStyle(document.documentElement).fontSize);
        break;
      case "%":
        i = e / 100 * globalThis.innerWidth;
        break;
      case "vw":
        i = e / 100 * globalThis.innerWidth;
        break;
      case "vh":
        i = e / 100 * globalThis.innerHeight;
        break;
      default:
        i = e;
    }
    switch (n) {
      case "px":
        return i;
      case "em":
        const s = parseFloat(getComputedStyle(r || document.body).fontSize);
        return i / s;
      case "rem":
        const o = parseFloat(getComputedStyle(document.documentElement).fontSize);
        return i / o;
      case "%":
        return i / globalThis.innerWidth * 100;
      case "vw":
        return i / globalThis.innerWidth * 100;
      case "vh":
        return i / globalThis.innerHeight * 100;
      default:
        return i;
    }
  }
}, Cr = class {
  static translate2D(e) {
    return g([e.x, e.y], () => `translate(${e.x.value}px, ${e.y.value}px)`);
  }
  static translate3D(e, t = w(0)) {
    return g([
      e.x,
      e.y,
      t
    ], () => `translate3d(${e.x.value}px, ${e.y.value}px, ${t.value}px)`);
  }
  static scale2D(e) {
    return g([e.x, e.y], () => `scale(${e.x.value}, ${e.y.value})`);
  }
  static rotate(e) {
    return g([e], () => `rotate(${e.value}deg)`);
  }
  static combine(e) {
    return g(e, () => e.map((t) => t.value).join(" "));
  }
  static matrix2D(e) {
    return g(e.elements, () => `matrix(${e.elements.map((t) => t.value).join(", ")})`);
  }
  static matrix3D(e) {
    return g(e.elements, () => `matrix3d(${e.elements.map((t) => t.value).join(", ")})`);
  }
}, uc = class {
  static leftTop(e) {
    return {
      left: g([e.x], () => `${e.x.value}px`),
      top: g([e.y], () => `${e.y.value}px`)
    };
  }
  static inset(e) {
    return { inset: g([e.x, e.y], () => `${e.y.value}px ${e.x.value}px`) };
  }
  static size(e) {
    return {
      width: g([e.x], () => `${e.x.value}px`),
      height: g([e.y], () => `${e.y.value}px`)
    };
  }
}, tt = class {
  static bindTransform(e, t, n = "instant", r) {
    const i = Cr.translate2D(t);
    return (n === "instant" ? A : n === "animate" ? Ge : n === "transition" ? wt : Wt)(e, "transform", i, r) ?? (() => {
    });
  }
  static bindPosition(e, t, n = "instant", r) {
    const i = uc.leftTop(t), s = n === "instant" ? A : n === "animate" ? Ge : n === "transition" ? wt : Wt, o = s(e, "left", i.left, r) ?? (() => {
    }), a = s(e, "top", i.top, r) ?? (() => {
    });
    return () => {
      o?.(), a?.();
    };
  }
  static bindSize(e, t, n = "instant", r) {
    const i = uc.size(t), s = n === "instant" ? A : n === "animate" ? Ge : n === "transition" ? wt : Wt, o = s(e, "width", i.width, r) ?? (() => {
    }), a = s(e, "height", i.height, r) ?? (() => {
    });
    return () => {
      o?.(), a?.();
    };
  }
  static bindWithUnit(e, t, n, r = "px", i = "instant", s) {
    const o = g([n], () => `${n.value}${r}`);
    return (i === "instant" ? A : i === "animate" ? Ge : i === "transition" ? wt : Wt)(e, t, o, s) ?? (() => {
    });
  }
  static bindVectorWithUnit(e, t, n = "px", r = "instant", i) {
    const s = g([t.x, t.y], () => `${t.x.value}${n} ${t.y.value}${n}`);
    return (r === "instant" ? A : r === "animate" ? Ge : r === "transition" ? wt : Wt)(e, "transform", s, {
      ...i,
      handler: r === "instant" ? void 0 : (o, a) => {
        o.style.setProperty("transform", `translate(${a})`);
      }
    }) ?? (() => {
    });
  }
  static bindTransformMorph(e, t, n = {}) {
    const r = {};
    if (t.translate && (r.transform = g([t.translate.x, t.translate.y], () => `translate(${t.translate.x.value}px, ${t.translate.y.value}px)`)), t.scale) {
      const i = t.scale instanceof Y ? g([t.scale.x, t.scale.y], () => `scale(${t.scale.x.value}, ${t.scale.y.value})`) : g([t.scale], () => `scale(${t.scale.value})`);
      r.transform = r.transform ? g([r.transform, i], (s, o) => `${s} ${o}`) : i;
    }
    if (t.rotate) {
      const i = g([t.rotate], () => `rotate(${t.rotate.value}deg)`);
      r.transform = r.transform ? g([r.transform, i], (s, o) => `${s} ${o}`) : i;
    }
    if (t.skew) {
      const i = g([t.skew.x, t.skew.y], () => `skew(${t.skew.x.value}deg, ${t.skew.y.value}deg)`);
      r.transform = r.transform ? g([r.transform, i], (s, o) => `${s} ${o}`) : i;
    }
    return ny(e, r, n);
  }
  static bindColor(e, t, n, r = "transition", i = {
    duration: 300,
    easing: "ease-in-out"
  }) {
    return (r === "instant" ? A : r === "animate" ? Ge : wt)(e, t, typeof n == "string" ? n : g([n], () => `hsl(${n.value}, 70%, 50%)`), i) ?? (() => {
    });
  }
  static bindOpacity(e, t, n = "transition", r = {
    duration: 200,
    easing: "ease-in-out"
  }) {
    return (n === "instant" ? A : n === "animate" ? Ge : n === "transition" ? wt : Wt)(e, "opacity", t, r) ?? (() => {
    });
  }
  static bindBorderRadius(e, t, n = "animate", r = {
    duration: 300,
    easing: "ease-out"
  }) {
    return (n === "instant" ? A : n === "animate" ? Ge : n === "transition" ? wt : Wt)(e, "border-radius", t instanceof Y ? g([t.x, t.y], () => `${t.x.value}px ${t.y.value}px`) : g([t], () => `${t.value}px`), r) ?? (() => {
    });
  }
}, rr = class {
  static add(e, t, n = "px") {
    return g([e, t], () => `calc(${e.value}${n} + ${t.value}${n})`);
  }
  static subtract(e, t, n = "px") {
    return g([e, t], () => `calc(${e.value}${n} - ${t.value}${n})`);
  }
  static multiply(e, t) {
    return g([e, t], () => `calc(${e.value} * ${t.value})`);
  }
  static divide(e, t) {
    return g([e, t], () => `calc(${e.value} / ${t.value})`);
  }
  static clamp(e, t, n, r = "px") {
    return g([
      e,
      t,
      n
    ], () => `clamp(${t.value}${r}, ${e.value}${r}, ${n.value}${r})`);
  }
  static min(e, t, n = "px") {
    return g([e, t], () => `min(${e.value}${n}, ${t.value}${n})`);
  }
  static max(e, t, n = "px") {
    return g([e, t], () => `max(${e.value}${n}, ${t.value}${n})`);
  }
}, CS = class {
  static toDOMMatrix(e) {
    return new DOMMatrix(e.elements.map((t) => t.value));
  }
  static fromDOMMatrix(e) {
    const t = Array.from(e.toFloat32Array()).map((n) => w(n));
    return new Ju(t[0], t[1], t[2], t[3], t[4], t[5], t[6], t[7], t[8], t[9], t[10], t[11], t[12], t[13], t[14], t[15]);
  }
  static applyTransform(e, t) {
    return this.fromDOMMatrix(e), e.multiplySelf(this.toDOMMatrix(t));
  }
}, PS = class {
  static bindProperty(e, t, n, r = "") {
    return g([n], () => (e.style.setProperty(t, `${n.value}${r}`), () => {
    }));
  }
  static bindVectorProperties(e, t, n, r = "px") {
    const i = this.bindProperty(e, `${t}-x`, n.x, r), s = this.bindProperty(e, `${t}-y`, n.y, r);
    return () => {
      i(), s();
    };
  }
  static getReactiveProperty(e, t) {
    const n = w(parseFloat(getComputedStyle(e).getPropertyValue(t)) || 0);
    return new MutationObserver(() => {
      const r = parseFloat(getComputedStyle(e).getPropertyValue(t)) || 0;
      n.value = r;
    }).observe(e, {
      attributes: !0,
      attributeFilter: ["style"]
    }), n;
  }
}, D = class {
  static asPx(e) {
    return typeof e == "number" ? `${e || 0}px` : typeof e == "string" ? e || "0px" : g([e], (t) => `${t || 0}px`);
  }
  static asPercent(e) {
    return typeof e == "number" ? `${e || 0}%` : typeof e == "string" ? e || "0%" : g([e], (t) => `${t || 0}%`);
  }
  static asEm(e) {
    return typeof e == "number" ? `${e || 0}em` : typeof e == "string" ? e || "0em" : g([e], (t) => `${t || 0}em`);
  }
  static asRem(e) {
    return typeof e == "number" ? `${e || 0}rem` : typeof e == "string" ? e || "0rem" : g([e], (t) => `${t || 0}rem`);
  }
  static asVw(e) {
    return typeof e == "number" ? `${e || 0}vw` : typeof e == "string" ? e || "0vw" : g([e], (t) => `${t || 0}vw`);
  }
  static asVh(e) {
    return typeof e == "number" ? `${e || 0}vh` : typeof e == "string" ? e || "0vh" : g([e], (t) => `${t || 0}vh`);
  }
  static asUnit(e, t, n = 0) {
    return typeof e == "number" ? `${e || n}${t}` : typeof e == "string" ? e || `${n}${t}` : g([e], (r) => `${r || n}${t}`);
  }
  static calc(e) {
    return `calc(${e})`;
  }
  static reactiveCalc(e, t) {
    return g(e, (...n) => `calc(${n.join(` ${t} `)})`);
  }
  static clamp(e, t, n) {
    return g([
      typeof e == "number" || typeof e == "string" ? e : g([e], (r) => r),
      typeof t == "number" || typeof t == "string" ? t : g([t], (r) => r),
      typeof n == "number" || typeof n == "string" ? n : g([n], (r) => r)
    ].filter((r) => typeof r != "string"), () => `clamp(${typeof e == "number" || typeof e == "string" ? e : e.value}, ${typeof t == "number" || typeof t == "string" ? t : t.value}, ${typeof n == "number" || typeof n == "string" ? n : n.value})`);
  }
  static max(e) {
    return g(e.filter((t) => typeof t != "string"), (...t) => `max(${e.map((n) => typeof n == "number" || typeof n == "string" ? n : n.value).join(", ")})`);
  }
  static min(e) {
    return g(e.filter((t) => typeof t != "string"), (...t) => `min(${e.map((n) => typeof n == "number" || typeof n == "string" ? n : n.value).join(", ")})`);
  }
}, AS = class {
  static bindSliderThumb(e, t, n, r, i) {
    const s = g([
      t,
      n,
      r,
      i
    ], () => `translateX(${(t.value - n.value) / (r.value - n.value) * 100}%)`);
    return tt.bindTransform(e, s);
  }
  static bindProgressFill(e, t) {
    return A(e, "width", g([t], () => `${t.value * 100}%`), R) ?? (() => {
    });
  }
  static bindToggleState(e, t) {
    const n = g([t], () => t.value ? "scale(1)" : "scale(0)"), r = g([t], () => t.value ? "1" : "0"), i = tt.bindTransform(e, n), s = A(e, "opacity", r, R) ?? (() => {
    });
    return () => {
      i?.(), s?.();
    };
  }
}, TS = class {
  static bindScrollbarThumb(e, t, n, r, i = "vertical") {
    const s = g([n, r], () => {
      const u = r.value / n.value;
      return Math.max(20, u * r.value);
    }), o = g([
      t,
      n,
      r,
      s
    ], () => {
      const u = Math.max(0, n.value - r.value);
      return (u > 0 ? t.value / u : 0) * (r.value - s.value);
    }), a = i === "vertical" ? g([o], () => `translateY(${o.value}px)`) : g([o], () => `translateX(${o.value}px)`), l = i === "vertical" ? A(e, "height", g([s], (u) => `${u}px`), R) : A(e, "width", g([s], (u) => `${u}px`), R), c = tt.bindTransform(e, a);
    return () => {
      l?.(), c?.();
    };
  }
  static bindScrollbarVisibility(e, t, n = 300) {
    const r = g([t], () => t.value), i = g([t], () => t.value > 0 ? "visible" : "hidden"), s = g([t], () => t.value > 0 ? "auto" : "none"), o = A(e, "opacity", r, R), a = A(e, "visibility", i, R), l = A(e, "pointer-events", s, R);
    return e.style.transition = `opacity ${n}ms ease-in-out`, () => {
      o?.(), a?.(), l?.();
    };
  }
  static bindScrollbarTheme(e, t) {
    const n = [];
    return t.trackColor && n.push(A(e, "--scrollbar-track-color", g([t.trackColor], (r) => `rgba(${r.value}, ${r.value}, ${r.value}, 0.1)`), R) ?? (() => {
    })), t.thumbColor && n.push(A(e, "--scrollbar-thumb-color", g([t.thumbColor], (r) => `rgba(${r.value}, ${r.value}, ${r.value}, 0.5)`), R) ?? (() => {
    })), t.borderRadius && n.push(A(e, "--scrollbar-border-radius", g([t.borderRadius], (r) => `${r.value}px`), R) ?? (() => {
    })), t.thickness && n.push(A(e, "--scrollbar-thickness", g([t.thickness], (r) => `${r.value}px`), R) ?? (() => {
    })), () => n.forEach((r) => r?.());
  }
}, MS = class {
  static createMomentumScroll(e, t, n = 0.92) {
    return new Promise((r) => {
      let i;
      const s = () => {
        if (t.value *= n, Math.abs(t.value) < 0.1) {
          t.value = 0, cancelAnimationFrame(i), r();
          return;
        }
        e.scrollBy({
          top: t.value,
          behavior: "instant"
        }), i = requestAnimationFrame(s);
      };
      s();
    });
  }
  static createBounceBack(e, t, n = 300) {
    return new Promise((r) => {
      const i = performance.now(), s = t.value, o = (a) => {
        const l = a - i, c = Math.min(l / n, 1), u = 1 - Math.pow(1 - c, 3);
        t.value = s * (1 - u), c < 1 ? requestAnimationFrame(o) : (t.value = 0, r());
      };
      requestAnimationFrame(o);
    });
  }
}, RS = class {
  static bindFocusRing(e, t, n = "rgba(59, 130, 246, 0.5)") {
    return A(e, "box-shadow", g([t], () => t.value ? `0 0 0 2px ${n}` : "none"), R) ?? (() => {
    });
  }
  static bindHoverState(e, t, n = "scale(1.05)") {
    const r = g([t], () => t.value ? n : "none");
    return tt.bindTransform(e, r) ?? (() => {
    });
  }
  static bindActiveState(e, t, n = "scale(0.95)") {
    const r = g([t], () => t.value ? n : "none");
    return tt.bindTransform(e, r) ?? (() => {
    });
  }
}, pv = class {
  #e;
  constructor(e) {
    this.#e = e;
  }
  get(e, t) {
    return bl(this.#e, this.#e?.[t]) ?? bl(e, e?.[t]);
  }
  set(e, t, n) {
    return Reflect.set(e, t, n) || (this.#e[t] = n), !0;
  }
  ownKeys(e) {
    return [...Reflect.ownKeys(e) ?? [], ...Reflect.ownKeys(this.#e) ?? []];
  }
  getOwnPropertyDescriptor(e, t) {
    return Reflect.getOwnPropertyDescriptor(e, t) ?? Reflect.getOwnPropertyDescriptor(this.#e, t);
  }
  getPrototypeOf(e) {
    return Reflect.getPrototypeOf(e) ?? Reflect.getPrototypeOf(this.#e);
  }
  setPrototypeOf(e, t) {
    return Reflect.setPrototypeOf(e, t) ?? Reflect.setPrototypeOf(this.#e, t);
  }
  isExtensible(e) {
    return Reflect.isExtensible(e) ?? Reflect.isExtensible(this.#e);
  }
  preventExtensions(e) {
    return Reflect.preventExtensions(e) ?? Reflect.preventExtensions(this.#e);
  }
  defineProperty(e, t, n) {
    return Reflect.defineProperty(this.#e, t, n) ?? Reflect.defineProperty(e, t, n);
  }
  deleteProperty(e, t) {
    return Reflect.deleteProperty(this.#e, t) ?? Reflect.deleteProperty(e, t);
  }
}, yv = /* @__PURE__ */ new WeakMap(), OS = (e) => (n) => {
  const r = (n?.target?.matches?.(".ui-orientbox") ? n?.target : null) || n?.target?.closest?.(".ui-orientbox");
  if (!r) return e(n);
  let { pointerCache: i, pointerMap: s } = yv?.getOrInsert?.(r, {
    pointerCache: /* @__PURE__ */ new Map(),
    pointerMap: /* @__PURE__ */ new Map()
  });
  const o = [n?.clientX || 0, n?.clientY || 0], a = i?.getOrInsert?.(n?.pointerId || 0, {
    client: o,
    orient: null,
    boundingBox: null,
    movement: X(0, 0)
  });
  a.delta = [o[0] - a.client[0], o[1] - a.client[1]], a.movement.x.value = a.delta[0], a.movement.y.value = a.delta[1], a.orient = null, a.client = o;
  const l = s?.getOrInsert?.(n?.pointerId || 0, {
    type: n?.type || "pointer",
    event: n,
    target: n?.target || r,
    cs_box: [r?.offsetWidth || 1, r?.offsetHeight || 1],
    cap_element: null,
    get client() {
      return a.client;
    },
    get orient() {
      return a.orient ??= fa([...l.client || a.client], [r?.offsetWidth || 1, r?.offsetHeight || 1], Pn(n.target || r) || 0);
    },
    get movement() {
      return [a.movement.x.value, a.movement.y.value];
    },
    get boundingBox() {
      return a.boundingBox ??= Fr(n?.target || r, Pn(n.target || r) || 0);
    },
    capture(c = n?.target || r) {
      return l.cap_element = c?.setPointerCapture?.(n?.pointerId || 0);
    },
    release(c = null) {
      (c || l.cap_element || n?.target || r)?.releasePointerCapture?.(n?.pointerId || 0), l.cap_element = null;
    }
  });
  if (Object.assign(l, {
    type: n?.type || "pointer",
    event: n,
    target: n?.target || r,
    cs_box: [r?.offsetWidth || 1, r?.offsetHeight || 1],
    pointerId: n?.pointerId || 0
  }), (n?.type == "contextmenu" || n?.type == "click" || n?.type == "pointerup" || n?.type == "pointercancel") && (s?.delete?.(n?.pointerId || 0), i?.delete?.(n?.pointerId || 0), n?.type == "pointercancel" && l?.release?.()), l && n) return e(new Proxy(n, new pv(l)));
}, _i = /* @__PURE__ */ new Map(), fc = (e, t = 0) => {
  if (_i.has(t)) return;
  const n = () => {
    _i.delete(t), o?.forEach?.((l) => l?.()), a?.forEach?.((l) => l?.());
  }, r = (l) => {
    l?.pointerId == t || l?.pointerId == null || t == null || t < 0 ? (l.preventDefault(), _i.set(t, !0), n()) : _i.delete(t);
  }, i = [r, { once: !0 }], s = [r, {
    once: !0,
    capture: !0
  }], o = kt(document.documentElement, {
    click: s,
    pointerdown: s,
    contextmenu: s
  }), a = kt(e, {
    click: i,
    pointerdown: i,
    contextmenu: i
  });
  setTimeout(n, 10);
}, Lr = null;
typeof PointerEvent < "u" ? Lr = class extends PointerEvent {
  #e;
  constructor(t, n) {
    super(t, n), this.#e = n?.holding;
  }
  get holding() {
    return this.#e;
  }
  get event() {
    return this.#e?.event;
  }
  get result() {
    return this.#e?.result;
  }
  get shifting() {
    return this.#e?.shifting;
  }
  get modified() {
    return this.#e?.modified;
  }
  get canceled() {
    return this.#e?.canceled;
  }
  get duration() {
    return this.#e?.duration;
  }
  get element() {
    return this.#e?.element?.deref?.() ?? null;
  }
  get propertyName() {
    return this.#e?.propertyName ?? "drag";
  }
} : Lr = class {
  #e;
  constructor(t, n) {
    this.#e = n?.holding;
  }
  get holding() {
    return this.#e;
  }
};
var zS = /* @__PURE__ */ new WeakMap(), mv = (e, t = {
  pointerId: 0,
  pointerType: "mouse"
}, { shifting: n = [0, 0], result: r = [{ value: 0 }, { value: 0 }] } = {}) => {
  let i = 0.01, s = performance.now(), o;
  const a = 100, l = () => {
    var h = (o = performance.now()) - s;
    return i += (h - i) / a, s = o, i;
  }, c = {
    result: r,
    movement: [...t?.movement || [0, 0]],
    shifting: [...n],
    modified: [...n],
    canceled: !1,
    duration: i,
    element: new WeakRef(e),
    client: null
  }, u = [((h) => {
    if (t?.pointerId == h?.pointerId) {
      h?.preventDefault?.();
      const y = [...h?.client || [h?.clientX || 0, h?.clientY || 0]];
      c.duration = l(), c.movement = [...c.client ? [y?.[0] - (c.client?.[0] || 0), y?.[1] - (c.client?.[1] || 0)] : [0, 0]], c.client = y, c.shifting[0] += c.movement[0] || 0, c.shifting[1] += c.movement[1] || 0, c.modified[0] = (c.shifting[0] ?? c.modified[0]) || 0, c.modified[1] = (c.shifting[1] ?? c.modified[1]) || 0, e?.dispatchEvent?.(new Lr("m-dragging", {
        ...h,
        bubbles: !0,
        holding: c,
        event: h
      })), c?.result?.[0] != null && (c.result[0].value = c.modified[0] || 0), c?.result?.[1] != null && (c.result[1].value = c.modified[1] || 0), c?.result?.[2] != null && (c.result[2].value = 0);
    }
  }), { capture: !0 }], d = Promise.withResolvers(), p = [((h) => {
    if (t?.pointerId == h?.pointerId) {
      const y = e?.element || e;
      h?.type == "pointerup" && fc(y, h?.pointerId), queueMicrotask(() => d?.resolve?.(r)), f?.forEach?.((b) => b?.());
      try {
        y?.releasePointerCapture?.(h?.pointerId);
      } catch {
      }
      try {
        y?.releaseCapturePointer?.(h?.pointerId);
      } catch {
      }
      y?.dispatchEvent?.(new Lr("m-dragend", {
        ...h,
        bubbles: !0,
        holding: c,
        event: h
      })), c.canceled = !0;
      try {
        t.pointerId = -1;
      } catch {
      }
    }
  }), { capture: !0 }];
  let f = null;
  return fc(e, t?.pointerId), queueMicrotask(() => {
    e?.dispatchEvent?.(new Lr("m-dragstart", {
      ...t,
      bubbles: !0,
      holding: c,
      event: t
    })) ? (e?.setPointerCapture?.(t?.pointerId), f = kt(e, {
      pointermove: u,
      pointercancel: p,
      pointerup: p
    }), f?.push?.(...kt(document.documentElement, {
      pointercancel: p,
      pointerup: p
    }))) : c.canceled = !0;
  }), d?.promise ?? r;
}, il = (e, t = () => {
}, n = [{ value: 0 }, { value: 0 }], r = [0, 0]) => {
  if (!n) return;
  const i = (o, a) => mv(a ?? e, o, {
    result: n,
    shifting: typeof r == "function" ? r?.(n) : r
  })?.then?.(t);
  if (typeof e?.addEventListener == "function") T(e, "pointerdown", i);
  else if (typeof e == "function") e(i);
  else throw new Error("bindDraggable: elementOrEventListener is not a function or an object with addEventListener");
  return {
    draggable: n,
    dispose: () => {
      typeof e?.removeEventListener == "function" && xn(e, "pointerdown", i);
    },
    process: i
  };
}, LS = class {
  #e;
  #t;
  #n = 0;
  #s;
  #o;
  #a;
  get #l() {
    return this.#e.offsetParent ?? this.#e?.host ?? hs;
  }
  constructor(e, t) {
    if (!e) throw Error("Element is null...");
    pf(this.#e = e, this.#l), this.#t = X(0, 0), this.#s = X(0, 0), this.#o = t, St(this.#e, "--drag-x", 0), St(this.#e, "--drag-y", 0), this.#u(), t && this.draggable(t);
  }
  #r(e = 0, t = 0) {
    let n = e || 0, r = t || 0;
    if (this.#o?.constraints?.bounds) {
      const i = this.#o.constraints.bounds, s = this.#o.constraints.centerOffset || X(0, 0), o = X(this.#e.offsetWidth, this.#e.offsetHeight);
      nl(n, r, o.x, o.y);
      const a = Ps(new Y(n + s.x.value, r + s.y.value), i);
      n = a.x.value - s.x.value, r = a.y.value - s.y.value;
    }
    if (this.#o?.constraints?.snapToGrid) {
      const { size: i, offset: s } = this.#o.constraints.snapToGrid;
      n = Math.round((n - s.x.value) / i.x.value) * i.x.value + s.x.value, r = Math.round((r - s.y.value) / i.y.value) * i.y.value + s.y.value;
    }
    this.#s.x.value = n, this.#s.y.value = r, !this.#n && (this.#n = requestAnimationFrame(() => {
      this.#n = 0;
      const i = this.#s.x.value, s = this.#s.y.value;
      St(this.#e, "transform", `translate3d(
                clamp(calc(-1px * var(--shift-x, 0)), ${i || 0}px, calc(100cqi - 100% - var(--shift-x, 0) * 1px)),
                clamp(calc(-1px * var(--shift-y, 0)), ${s || 0}px, calc(100cqb - 100% - var(--shift-y, 0) * 1px)),
                0px)`.trim?.()?.replaceAll?.(/\s+/g, " ")?.replaceAll?.(/\n+/g, " ")?.trim?.() ?? "");
    }));
  }
  #u() {
    if (this.#a) return;
    const e = () => {
      this.#r(this.#t.x.value, this.#t.y.value);
    };
    this.#a = [W(this.#t.x, e), W(this.#t.y, e)], e();
  }
  draggable(e) {
    const t = e.handler ?? this.#e;
    this.#t, this.#u();
    const n = new WeakRef(this.#e);
    return il((s) => t.addEventListener("pointerdown", rl((o) => s(o, this.#e), this.#e)), (s) => {
      const o = n?.deref?.();
      o?.style?.removeProperty?.("will-change"), queueMicrotask(() => {
        o?.removeAttribute?.("data-dragging"), o?.style?.removeProperty?.("transform");
      });
      const a = o?.getBoundingClientRect?.();
      this.#t.x.value = 0, this.#t.y.value = 0, this.#r(0, 0), St(o, "--shift-x", `${a?.left || 0}px`), St(o, "--shift-y", `${a?.top || 0}px`);
    }, [this.#t.x, this.#t.y], () => {
      const s = n?.deref?.();
      return s?.setAttribute?.("data-dragging", ""), s?.style?.setProperty("will-change", "inset, translate, transform, opacity, z-index"), this.#r(this.#t.x.value, this.#t.y.value), [0, 0];
    });
  }
}, $S = class {
  #e;
  #t;
  get #n() {
    return this.#e.offsetParent ?? this.#e?.host ?? hs;
  }
  constructor(e, t) {
    if (!e) throw Error("Element is null...");
    pf(this.#e = e, this.#n), this.#t = X(0, 0), t && this.resizable(t);
  }
  limitResize(e, t, n, r) {
    const i = uh(n) - (lh(n) - (this.#t.x.value || 0)), s = fh(n) - (ch(n) - (this.#t.y.value || 0));
    return e[0] = gl(0, t?.[0] || 0, i) || 0, e[1] = gl(0, t?.[1] || 0, s) || 0, e;
  }
  resizable(e) {
    const t = e.handler ?? this.#e;
    this.#t;
    const n = new WeakRef(this.#e), r = new WeakRef(this), i = (l) => {
      const c = n?.deref?.();
      c?.style?.removeProperty?.("will-change"), queueMicrotask(() => {
        c?.removeAttribute?.("data-resizing");
      });
    }, s = (l) => t.addEventListener("pointerdown", rl((c) => l(c, this.#e), this.#e)), o = () => {
      const l = [this.#t.x.value || 0, this.#t.y.value || 0], c = n?.deref?.(), u = this.#n;
      return r?.deref?.()?.limitResize?.(l, l, c, u), c?.setAttribute?.("data-resizing", ""), l;
    }, a = [this.#t.x, this.#t.y];
    return Cs(this.#e, { style: {
      "--resize-x": this.#t.x,
      "--resize-y": this.#t.y
    } }), il(s, i, a, o);
  }
}, DS = class {
  target;
  options;
  selectionRect;
  overlayElement;
  isActive = !1;
  startPoint;
  currentPoint;
  dragStart;
  resizeHandle;
  constructor(e = {}) {
    this.options = {
      target: document.body,
      minSize: X(10, 10),
      maxSize: X(globalThis.innerWidth, globalThis.innerHeight),
      showHandles: !0,
      style: {
        border: "2px solid #007acc",
        background: "rgba(0, 122, 204, 0.1)",
        borderRadius: "0",
        zIndex: 9999
      },
      ...e
    }, this.target = this.options.target;
  }
  start() {
    this.isActive || (this.isActive = !0, this.createOverlay(), this.attachEvents());
  }
  stop() {
    this.isActive && (this.isActive = !1, this.removeOverlay(), this.detachEvents(), this.options.onCancel?.());
  }
  getSelection() {
    return this.selectionRect || null;
  }
  setSelection(e) {
    this.selectionRect = e, this.updateOverlay(), this.options.onChange?.(e);
  }
  clearSelection() {
    this.selectionRect = void 0, this.updateOverlay(), this.options.onCancel?.();
  }
  createOverlay() {
    this.overlayElement || (this.overlayElement = document.createElement("div"), Object.assign(this.overlayElement.style, {
      position: "fixed",
      pointerEvents: "none",
      boxSizing: "border-box",
      ...this.options.style
    }), this.options.showHandles && this.createResizeHandles(), this.target.appendChild(this.overlayElement));
  }
  createResizeHandles() {
    if (!this.overlayElement) return;
    const e = [
      "nw",
      "ne",
      "sw",
      "se",
      "n",
      "s",
      "e",
      "w"
    ], t = [];
    e.forEach((n) => {
      const r = document.createElement("div");
      r.setAttribute("data-handle", n), Object.assign(r.style, {
        position: "absolute",
        width: n.length === 1 ? "100%" : "8px",
        height: n.length === 1 ? "8px" : "100%",
        background: this.options.style?.border || "#007acc",
        cursor: this.getCursorForHandle(n),
        pointerEvents: "auto"
      }), this.positionHandle(r, n), r.addEventListener("pointerdown", (i) => {
        i.stopPropagation(), this.startResize(n, X(i.clientX, i.clientY));
      }), this.overlayElement.appendChild(r), t.push(r);
    });
  }
  positionHandle(e, t) {
    const n = e.style;
    switch (t) {
      case "nw":
        n.top = n.left = "0";
        break;
      case "ne":
        n.top = "0", n.right = "0";
        break;
      case "sw":
        n.bottom = n.left = "0";
        break;
      case "se":
        n.bottom = n.right = "0";
        break;
      case "n":
        n.top = "0", n.left = "50%", n.transform = "translateX(-50%)";
        break;
      case "s":
        n.bottom = "0", n.left = "50%", n.transform = "translateX(-50%)";
        break;
      case "e":
        n.top = "50%", n.right = "0", n.transform = "translateY(-50%)";
        break;
      case "w":
        n.top = "50%", n.left = "0", n.transform = "translateY(-50%)";
        break;
    }
  }
  getCursorForHandle(e) {
    return {
      nw: "nw-resize",
      ne: "ne-resize",
      sw: "sw-resize",
      se: "se-resize",
      n: "n-resize",
      s: "s-resize",
      e: "e-resize",
      w: "w-resize"
    }[e] || "pointer";
  }
  attachEvents() {
    this.target.addEventListener("pointerdown", this.handlePointerDown), this.target.addEventListener("pointermove", this.handlePointerMove), this.target.addEventListener("pointerup", this.handlePointerUp), document.addEventListener("keydown", this.handleKeyDown);
  }
  detachEvents() {
    this.target.removeEventListener("pointerdown", this.handlePointerDown), this.target.removeEventListener("pointermove", this.handlePointerMove), this.target.removeEventListener("pointerup", this.handlePointerUp), document.removeEventListener("keydown", this.handleKeyDown);
  }
  handlePointerDown = (e) => {
    if (e.button !== 0) return;
    const t = X(e.clientX, e.clientY), n = this.getHandleAtPoint(t);
    if (n) {
      this.startResize(n, t);
      return;
    }
    if (this.selectionRect && ef(this.selectionRect, t).value) {
      this.startDrag(t);
      return;
    }
    this.startSelection(t);
  };
  handlePointerMove = (e) => {
    const t = X(e.clientX, e.clientY);
    this.resizeHandle ? this.updateResize(t) : this.dragStart ? this.updateDrag(t) : this.startPoint && this.updateSelection(t);
  };
  handlePointerUp = (e) => {
    this.resizeHandle ? this.endResize() : this.dragStart ? this.endDrag() : this.startPoint && this.endSelection();
  };
  handleKeyDown = (e) => {
    e.key === "Escape" ? this.clearSelection() : e.key === "Enter" && this.selectionRect && this.options.onSelect?.(this.selectionRect);
  };
  startSelection(e) {
    this.startPoint = e, this.currentPoint = e, this.selectionRect = nl(e.x, e.y, 0, 0), this.updateOverlay();
  }
  updateSelection(e) {
    if (!this.startPoint || !this.selectionRect) return;
    this.currentPoint = e;
    const t = Math.min(this.startPoint.x.value, e.x.value), n = Math.min(this.startPoint.y.value, e.y.value), r = Math.max(this.startPoint.x.value, e.x.value), i = Math.max(this.startPoint.y.value, e.y.value);
    this.selectionRect.position.x.value = t, this.selectionRect.position.y.value = n, this.selectionRect.size.x.value = r - t, this.selectionRect.size.y.value = i - n, this.applyConstraints(), this.updateOverlay(), this.options.onChange?.(this.selectionRect);
  }
  endSelection() {
    if (this.selectionRect) {
      if (this.selectionRect.size.x.value < this.options.minSize.x.value || this.selectionRect.size.y.value < this.options.minSize.y.value) {
        this.clearSelection();
        return;
      }
      this.options.onSelect?.(this.selectionRect), this.startPoint = void 0, this.currentPoint = void 0;
    }
  }
  startDrag(e) {
    this.selectionRect && (this.dragStart = e);
  }
  updateDrag(e) {
    if (!this.dragStart || !this.selectionRect) return;
    const t = ss(e, this.dragStart);
    this.selectionRect.position = on(this.selectionRect.position, t), this.dragStart = e, this.options.bounds && (this.selectionRect.position = Ps(this.selectionRect.position, this.options.bounds)), this.updateOverlay(), this.options.onChange?.(this.selectionRect);
  }
  endDrag() {
    this.dragStart = void 0;
  }
  startResize(e, t) {
    this.resizeHandle = e, this.dragStart = t;
  }
  updateResize(e) {
    if (!this.resizeHandle || !this.dragStart || !this.selectionRect) return;
    const t = ss(e, this.dragStart);
    this.resizeFromHandle(this.resizeHandle, t), this.dragStart = e, this.applyConstraints(), this.updateOverlay(), this.options.onChange?.(this.selectionRect);
  }
  resizeFromHandle(e, t) {
    if (!this.selectionRect) return;
    const n = this.selectionRect;
    let r = n.position.x.value, i = n.position.y.value, s = n.size.x.value, o = n.size.y.value;
    switch (e) {
      case "nw":
        r += t.x.value, i += t.y.value, s -= t.x.value, o -= t.y.value;
        break;
      case "ne":
        i += t.y.value, s += t.x.value, o -= t.y.value;
        break;
      case "sw":
        r += t.x.value, s -= t.x.value, o += t.y.value;
        break;
      case "se":
        s += t.x.value, o += t.y.value;
        break;
      case "n":
        i += t.y.value, o -= t.y.value;
        break;
      case "s":
        o += t.y.value;
        break;
      case "e":
        s += t.x.value;
        break;
      case "w":
        r += t.x.value, s -= t.x.value;
        break;
    }
    s < 0 && (r += s, s = -s), o < 0 && (i += o, o = -o), n.position.x.value = r, n.position.y.value = i, n.size.x.value = s, n.size.y.value = i;
  }
  endResize() {
    this.resizeHandle = void 0, this.dragStart = void 0;
  }
  applyConstraints() {
    if (!this.selectionRect) return;
    const e = this.selectionRect;
    if (this.options.aspectRatio) {
      const t = e.size.x.value / e.size.y.value, n = this.options.aspectRatio;
      Math.abs(t - n) > 0.01 && (t > n ? e.size.y.value = e.size.x.value / n : e.size.x.value = e.size.y.value * n);
    }
    if (e.size.x.value = Math.max(this.options.minSize.x.value, Math.min(this.options.maxSize.x.value, e.size.x.value)), e.size.y.value = Math.max(this.options.minSize.y.value, Math.min(this.options.maxSize.y.value, e.size.y.value)), this.options.bounds && (e.position.x.value = Math.max(this.options.bounds.position.x.value, Math.min(e.position.x.value, this.options.bounds.position.x.value + this.options.bounds.size.x.value - e.size.x.value)), e.position.y.value = Math.max(this.options.bounds.position.y.value, Math.min(e.position.y.value, this.options.bounds.position.y.value + this.options.bounds.size.y.value - e.size.y.value))), this.options.snapToGrid) {
      const { size: t, offset: n } = this.options.snapToGrid;
      e.position.x.value = Math.round((e.position.x.value - n.x.value) / t.x.value) * t.x.value + n.x.value, e.position.y.value = Math.round((e.position.y.value - n.y.value) / t.y.value) * t.y.value + n.y.value;
    }
  }
  updateOverlay() {
    if (!this.overlayElement) return;
    if (!this.selectionRect) {
      this.overlayElement.style.display = "none";
      return;
    }
    const e = this.selectionRect;
    Object.assign(this.overlayElement.style, {
      display: "block",
      left: `${e.position.x.value}px`,
      top: `${e.position.y.value}px`,
      width: `${e.size.x.value}px`,
      height: `${e.size.y.value}px`
    });
  }
  removeOverlay() {
    this.overlayElement && (this.overlayElement.remove(), this.overlayElement = void 0);
  }
  getHandleAtPoint(e) {
    if (!this.overlayElement || !this.selectionRect) return null;
    this.selectionRect;
    const t = this.overlayElement.querySelectorAll("[data-handle]");
    for (let n = 0; n < t.length; n++) {
      const r = t[n], i = r.getBoundingClientRect();
      if (e.x.value >= i.left && e.x.value <= i.right && e.y.value >= i.top && e.y.value <= i.bottom) return r.getAttribute("data-handle");
    }
    return null;
  }
  async getSelectionImage() {
    return this.selectionRect, null;
  }
  destroy() {
    this.stop(), this.clearSelection();
  }
}, FS = class {
  #e;
  constructor(e, t, n = (r) => {
    r.target.dispatchEvent(new PointerEvent("long-hover", {
      ...r,
      bubbles: !0
    }));
  }) {
    if (this.#e = e, e["@control"] = this, !e) throw Error("Element is null...");
    t && this.longHover(t, n);
  }
  defaultHandler(e, t) {
    return t?.deref()?.dispatchEvent?.(new PointerEvent("long-hover", {
      ...e,
      bubbles: !0
    }));
  }
  longHover(e, t = (n) => {
    n.target.dispatchEvent(new PointerEvent("long-hover", {
      ...n,
      bubbles: !0
    }));
  }) {
    const n = {
      pointerId: -1,
      timer: null
    }, r = ((s) => {
      const o = s;
      (o.target.matches(e.selector) || o.target.closest(e.selector)) && n.pointerId < 0 && (n.pointerId = o.pointerId, n.timer = setTimeout(() => {
        t?.(o);
      }, e.holdTime ?? 300));
    }), i = ((s) => {
      const o = s;
      (o.target.matches(e.selector) || o.target.closest(e.selector)) && n.pointerId == o.pointerId && (n.timer && clearTimeout(n.timer), n.timer = null, n.pointerId = -1);
    });
    kt(hs, {
      pointerover: r,
      pointerdown: r,
      pointerout: i,
      pointerup: i,
      pointercancel: i
    });
  }
}, ki = {
  anyPointer: !0,
  mouseImmediate: !0,
  minHoldTime: 100,
  maxHoldTime: 2e3,
  maxOffsetRadius: 10
}, Ei = [(e) => {
  e.preventDefault(), e.stopPropagation();
}, { once: !0 }], WS = class {
  #e;
  #t;
  constructor(e, t = { ...ki }, n) {
    if ((this.#e = e)["@control"] = this, this.#t = /* @__PURE__ */ new Set(), !e) throw Error("Element is null...");
    t || (t = { ...ki });
    const r = { ...t };
    Object.assign(t, ki, r), t && this.longPress(t, n);
  }
  defaultHandler(e, t) {
    return t?.deref()?.dispatchEvent?.(new PointerEvent("long-press", {
      ...e,
      bubbles: !0
    }));
  }
  longPress(e = { ...ki }, t) {
    const n = document.documentElement, r = new WeakRef(this.#e), i = this.initializeActionState();
    this.holding = {
      actionState: i,
      options: e,
      fx: t || ((l) => this.defaultHandler(l, r))
    };
    const s = (l) => this.onPointerDown(this.holding, l, r), o = (l) => this.onPointerMove(this.holding, l), a = (l) => this.onPointerUp(this.holding, l);
    kt(n, {
      pointerdown: s,
      pointermove: o,
      pointerup: a,
      pointercancel: a
    });
  }
  initializeActionState() {
    return {
      timerId: null,
      immediateTimerId: null,
      pointerId: -1,
      startCoord: [0, 0],
      lastCoord: [0, 0],
      isReadyForLongPress: !1,
      cancelCallback: () => {
      },
      cancelPromiseResolver: null,
      cancelPromiseRejector: null
    };
  }
  preventFromClicking(e, t) {
    this.#t.has(t.pointerId) || (this.#t.add(t.pointerId), e?.addEventListener?.("click", ...Ei), e?.addEventListener?.("contextmenu", ...Ei));
  }
  releasePreventing(e, t) {
    this.#t.has(t) && (this.#t.delete(t), e?.removeEventListener?.("click", ...Ei), e?.removeEventListener?.("contextmenu", ...Ei));
  }
  onPointerDown(e, t, n) {
    if (!this.isValidTarget(e, t.target, n) || !(e.options?.anyPointer || t?.pointerType == "touch")) return;
    t.preventDefault(), this.resetAction(e, e.actionState);
    const { actionState: r } = e;
    r.pointerId = t.pointerId, r.startCoord = [t.clientX, t.clientY], r.lastCoord = [...r.startCoord];
    const i = Promise.withResolvers();
    if (r.cancelPromiseResolver = i.resolve, r.cancelPromiseRejector = i.reject, r.cancelCallback = () => {
      clearTimeout(r.timerId), clearTimeout(r.immediateTimerId), r.isReadyForLongPress = !1, i.resolve(), this.resetAction(e, r);
    }, e.options?.mouseImmediate && t.pointerType === "mouse")
      return e.fx?.(t), r.cancelCallback();
    r.timerId = setTimeout(() => {
      r.isReadyForLongPress = !0;
    }, e.options?.minHoldTime), r.immediateTimerId = setTimeout(() => {
      this.isInPlace(e) && (this.preventFromClicking(e, t), e.fx?.(t), r.cancelCallback());
    }, e.options?.maxHoldTime), Promise.race([i.promise, new Promise((s, o) => setTimeout(() => o(/* @__PURE__ */ new Error("Timeout")), 3e3))]).catch(console.warn);
  }
  onPointerMove(e, t) {
    const { actionState: n } = e;
    if (t.pointerId === n.pointerId) {
      if (n.lastCoord = [t.clientX, t.clientY], !this.isInPlace(e)) return n.cancelCallback();
      this.preventFromClicking(e, t), n.startCoord = [t.clientX, t.clientY];
    }
  }
  resetAction(e, t) {
    this.releasePreventing(e, t.pointerId), t.pointerId = -1, t.cancelPromiseResolver = null, t.cancelPromiseRejector = null, t.isReadyForLongPress = !1, t.cancelCallback = null;
  }
  onPointerUp(e, t) {
    const { actionState: n } = e;
    t.pointerId === n.pointerId && (n.lastCoord = [t.clientX, t.clientY], n.isReadyForLongPress && this.isInPlace(e) && (e.fx?.(t), this.preventFromClicking(e, t)), n.cancelCallback(), this.resetAction(e, n));
  }
  holding = {
    fx: null,
    options: {},
    actionState: {}
  };
  hasParent(e, t) {
    for (; e; ) {
      if (e === t) return !0;
      e = e.parentElement;
    }
  }
  isInPlace(e) {
    const { actionState: t } = e, [n, r] = t.startCoord, [i, s] = t.lastCoord;
    return Math.hypot(i - n, s - r) <= e.options?.maxOffsetRadius;
  }
  isValidTarget(e, t, n) {
    const r = n?.deref?.();
    return r && (this.hasParent(t, r) || t === r) && (!e.options?.handler || t.matches(e.options?.handler));
  }
}, HS = class {
  #e;
  constructor(e, t) {
    if ((this.#e = e)["@control"] = this, !e) throw Error("Element is null...");
    t && this.swipe(t);
  }
  swipe(e) {
    if (e?.handler) {
      const t = /* @__PURE__ */ new Map([]), n = new WeakRef(t), r = (a) => {
        const l = a;
        if (t?.has?.(l.pointerId)) {
          const c = t?.get?.(l.pointerId);
          Object.assign(c || {}, {
            current: [...l.client || [l?.clientX, l?.clientY]],
            pointerId: l.pointerId,
            time: performance.now()
          });
        }
      }, i = (a, l) => (a - l + 540) % 360 - 180, s = (a) => {
        const l = a.pointerId;
        if (t?.has?.(l)) {
          const c = n?.deref()?.get?.(l), u = [c.start[0] - c.current[0], c.start[1] - c.current[1]], d = performance.now() - c.startTime;
          (c.speed = Math.hypot(...u) / d) > (e.threshold || 0.5) && (c.direction = "name", c.swipeAngle = Math.atan2(c.current[1] - c.start[1], c.current[0] - c.start[0]), Math.abs(i(c.swipeAngle * (180 / Math.PI), 0)) <= 20 && (c.direction = "left"), Math.abs(i(c.swipeAngle * (180 / Math.PI), 180)) <= 20 && (c.direction = "right"), Math.abs(i(c.swipeAngle * (180 / Math.PI), 270)) <= 20 && (c.direction = "up"), Math.abs(i(c.swipeAngle * (180 / Math.PI), 90)) <= 20 && (c.direction = "down"), e?.trigger?.(c)), n?.deref()?.delete?.(l);
        }
      };
      kt(hs, {
        pointerdown: ((a) => {
          const l = a;
          l.target == e?.handler && (t?.set(l.pointerId, {
            target: l.target,
            start: [...l.client || [l?.clientX, l?.clientY]],
            current: [...l.client || [l?.clientX, l?.clientY]],
            pointerId: l.pointerId,
            startTime: performance.now(),
            time: performance.now(),
            speed: 0
          }), l?.capture?.());
        }),
        pointermove: r,
        pointerup: s,
        pointercancel: s
      });
    }
  }
}, sl = (e, t = typeof document < "u" ? document?.documentElement : null) => {
  if (!t) return () => {
  };
  let n = -1;
  const r = (o) => {
    n = -1;
  }, i = (o) => {
    n < 0 && (n = o.pointerId), n == o.pointerId && e?.(o);
  }, s = [
    T(t, "pointerup", r),
    T(t, "pointercancel", r),
    T(t, "pointermove", i)
  ];
  return () => {
    s.forEach((o) => o?.());
  };
}, BS = (e, t, n = typeof document < "u" ? document?.documentElement : null) => {
  if (!n) return () => {
  };
  const r = (o) => t?.(o), i = [T(e, "scroll", r), T(n, "resize", r)], s = vh(e, r);
  return () => {
    i.forEach((o) => o?.()), s?.disconnect?.();
  };
}, vv = /^--[-\w]+$/;
function gv(e, t, n) {
  return e.setAttribute(t, n), `[${t}="${n}"]`;
}
function dc(e, t, n) {
  if (!(!t || t === e))
    return gv(t, "data-jx-anchor-ctl", `${n}-${Math.random().toString(36).slice(2, 10)}`);
}
function fo(e, t) {
  !e || !t || vv.test(t) && e.style.setProperty("anchor-name", t);
}
function jS(e) {
  const { frame: t } = e, n = t.getAttribute("data-mixin") ?? "", r = t.getAttribute("data-junction-drag-handle"), i = t.getAttribute("data-junction-resize-handle"), s = t.getAttribute("data-junction-resize-min-w"), o = t.getAttribute("data-junction-resize-min-h"), a = e.resizeHandle !== null, l = new Set(n.split(/\s+/).filter(Boolean));
  if (l.add("ui-junction-drag"), a ? l.add("ui-junction-resize") : l.delete("ui-junction-resize"), t.setAttribute("data-mixin", [...l].join(" ")), typeof e.dragHandle == "string") t.setAttribute("data-junction-drag-handle", e.dragHandle);
  else if (e.dragHandle instanceof HTMLElement) {
    const y = dc(t, e.dragHandle, "drag");
    y && t.setAttribute("data-junction-drag-handle", y);
  }
  if (a) {
    if (typeof e.resizeHandle == "string") t.setAttribute("data-junction-resize-handle", e.resizeHandle);
    else if (e.resizeHandle instanceof HTMLElement) {
      const y = dc(t, e.resizeHandle, "rz");
      y && t.setAttribute("data-junction-resize-handle", y);
    }
  } else t.removeAttribute("data-junction-resize-handle");
  e.minWidth != null && t.setAttribute("data-junction-resize-min-w", String(e.minWidth)), e.minHeight != null && t.setAttribute("data-junction-resize-min-h", String(e.minHeight));
  const c = e.anchors ?? {}, u = c.frame ?? "--jx-frame", d = c.dragHandle ?? "--jx-drag-handle", p = c.resizeHandle ?? "--jx-resize-handle";
  fo(t, u);
  let f;
  typeof e.dragHandle == "string" ? f = t.querySelector(e.dragHandle) : f = e.dragHandle, fo(f, f && f !== t ? d : void 0);
  let h;
  return a && (typeof e.resizeHandle == "string" ? h = t.querySelector(e.resizeHandle) : h = e.resizeHandle ?? void 0, fo(h, p)), Hr(t), () => {
    n ? t.setAttribute("data-mixin", n) : t.removeAttribute("data-mixin"), r != null ? t.setAttribute("data-junction-drag-handle", r) : t.removeAttribute("data-junction-drag-handle"), i != null ? t.setAttribute("data-junction-resize-handle", i) : t.removeAttribute("data-junction-resize-handle"), s != null ? t.setAttribute("data-junction-resize-min-w", s) : t.removeAttribute("data-junction-resize-min-w"), o != null ? t.setAttribute("data-junction-resize-min-h", o) : t.removeAttribute("data-junction-resize-min-h"), t.style.removeProperty("anchor-name"), f?.style?.removeProperty("anchor-name"), h?.removeAttribute("data-jx-anchor-ctl"), f?.removeAttribute("data-jx-anchor-ctl"), h?.style?.removeProperty("anchor-name"), Hr(t);
  };
}
var bv = () => "--" + Math.random().toString(36).substring(2, 15).replace(/[0-9]/g, ""), wv = (e) => e?.computedStyleMap ? Number(e.computedStyleMap().get("z-index")?.toString() || 0) || 0 : Number(getComputedStyle(e?.element ?? e).getPropertyValue("z-index") || 0) || 0, Ca = (e) => e ? e?.attributeStyleMap && e.attributeStyleMap.get("z-index") != null ? Number(e.attributeStyleMap.get("z-index")?.value ?? 0) || 0 : e?.style && "zIndex" in e.style && e.style.zIndex != null ? Number(e.style.zIndex || 0) || 0 : wv(e) : 0, US = class {
  value;
  unit;
  constructor(e, t = "px") {
    const n = typeof e == "string" ? hv.parseValue(e) : {
      value: e,
      unit: t
    };
    this.value = w(n.value), this.unit = n.unit;
  }
  get cssValue() {
    return tt.bindWithUnit({}, "", this.value, this.unit);
  }
  toUnit(e) {
    return rr.multiply(this.value, w(1));
  }
  bindTo(e, t) {
    return tt.bindWithUnit(e, t, this.value, this.unit);
  }
}, mf = class {
  transforms = [];
  translate(e, t) {
    const n = typeof e == "number" && typeof t == "number" ? {
      x: w(e),
      y: w(t)
    } : {
      x: typeof e == "number" ? w(e) : e,
      y: typeof t == "number" ? w(t) : t
    };
    return this.transforms.push(Cr.translate2D(n)), this;
  }
  scale(e, t) {
    const n = typeof e == "number" ? w(e) : e, r = t !== void 0 ? typeof t == "number" ? w(t) : t : n;
    return this.transforms.push(Cr.scale2D({
      x: n,
      y: r
    })), this;
  }
  rotate(e) {
    const t = typeof e == "number" ? w(e) : e;
    return this.transforms.push(Cr.rotate(t)), this;
  }
  get value() {
    return Cr.combine(this.transforms);
  }
  bindTo(e) {
    return tt.bindTransform(e, {
      x: w(0),
      y: w(0)
    });
  }
}, VS = class {
  element;
  properties;
  duration;
  easing;
  constructor(e, t = 1e3, n = "ease-out") {
    this.element = e, this.properties = /* @__PURE__ */ new Map(), this.duration = t, this.easing = n;
  }
  animateProperty(e, t, n) {
    const r = w(t);
    return this.properties.set(e, r), tt.bindWithUnit(this.element, e, r), this.animateValue(r, t, n), this;
  }
  animateValue(e, t, n) {
    const r = performance.now(), i = (s) => {
      const o = s - r, a = Math.min(o / this.duration, 1), l = this.applyEasing(a);
      e.value = t + (n - t) * l, a < 1 && requestAnimationFrame(i);
    };
    requestAnimationFrame(i);
  }
  applyEasing(e) {
    switch (this.easing) {
      case "ease-out":
        return 1 - Math.pow(1 - e, 3);
      case "ease-in":
        return e * e * e;
      case "ease-in-out":
        return e < 0.5 ? 4 * e * e * e : 1 - Math.pow(-2 * e + 2, 3) / 2;
      default:
        return e;
    }
  }
}, qS = class {
  query;
  matches;
  constructor(e) {
    this.query = e, this.matches = w(0);
    const t = window?.matchMedia(e);
    this.matches.value = t.matches ? 1 : 0, t?.addEventListener("change", (n) => {
      this.matches.value = n.matches ? 1 : 0;
    });
  }
  get reactiveMatches() {
    return this.matches;
  }
  valueIfMatches(e, t) {
    return this.matches.value ? e : t;
  }
}, Sv = class {
  static width = w(typeof window < "u" ? window?.innerWidth : 0);
  static height = w(typeof window < "u" ? window?.innerHeight : 0);
  static init() {
    const e = () => {
      this.width.value = window?.innerWidth, this.height.value = window?.innerHeight;
    };
    typeof window < "u" && window?.addEventListener?.("resize", e);
  }
  static center() {
    return {
      x: rr.divide(this.width, w(2)),
      y: rr.divide(this.height, w(2))
    };
  }
};
Sv.init();
var vf = class {
  element;
  size;
  observer;
  constructor(e) {
    this.element = e, this.size = {
      width: w(e.offsetWidth),
      height: w(e.offsetHeight)
    }, this.observer = new ResizeObserver((t) => {
      for (const n of t) n.target === e && (this.size.width.value = n.contentRect.width, this.size.height.value = n.contentRect.height);
    }), this.observer.observe(e);
  }
  get width() {
    return this.size.width;
  }
  get height() {
    return this.size.height;
  }
  center() {
    return {
      x: rr.divide(this.size.width, w(2)),
      y: rr.divide(this.size.height, w(2))
    };
  }
  destroy() {
    this.observer.disconnect();
  }
}, GS = class {
  element;
  scrollLeft;
  scrollTop;
  constructor(e = document.documentElement) {
    this.element = e, this.scrollLeft = w(e.scrollLeft), this.scrollTop = w(e.scrollTop), e.addEventListener("scroll", () => {
      this.scrollLeft.value = e.scrollLeft, this.scrollTop.value = e.scrollTop;
    });
  }
  get left() {
    return this.scrollLeft;
  }
  get top() {
    return this.scrollTop;
  }
  progress(e = "y") {
    const t = e === "x" ? this.element.scrollWidth - this.element.clientWidth : this.element.scrollHeight - this.element.clientHeight, n = e === "x" ? this.scrollLeft : this.scrollTop;
    return rr.divide(n, w(Math.max(t, 1)));
  }
}, gf = (e) => e === "underlying" ? -1 : 1;
function xv(e, t) {
  const n = t.role, r = t.stackMode ?? "shift", i = Ca(e), s = (e.style?.zIndex ?? "").trim(), o = !s || s === "auto";
  if (r === "order-equal")
    return o ? null : i;
  const a = t.zIndexShift ?? gf(n);
  return Math.max(o ? 0 : i + a, 0);
}
var _v = /* @__PURE__ */ new WeakMap(), bf = /* @__PURE__ */ new WeakMap(), kv = class {
  source;
  anchorId;
  constructor(e) {
    this.source = e, bf.set(e, this), this.anchorId = _v.getOrInsert(e, bv()), this.source.style.setProperty("anchor-name", this.anchorId), this.source.style.setProperty("position-visibility", "always");
  }
  connectElement(e, { placement: t = "fill", zIndexShift: n = 1, inset: r = 0, size: i = "100%", transformOrigin: s = "50% 50%" }) {
    return t == "fill" ? (e.style.setProperty("inset-block-start", `anchor(start, ${r}px)`), e.style.setProperty("inset-inline-start", `anchor(start, ${r}px)`), e.style.setProperty("inset-block-end", `anchor(end, ${r}px)`), e.style.setProperty("inset-inline-end", `anchor(end, ${r}px)`), e.style.setProperty("inline-size", `anchor-size(inline, ${i})`), e.style.setProperty("block-size", `anchor-size(block, ${i})`), e.style.setProperty("transform-origin", s)) : t == "bottom" ? (e.style.setProperty("inset-block-start", `anchor(end, ${r}px)`), e.style.setProperty("inset-inline-start", `anchor(start, ${r}px)`), e.style.setProperty("inline-size", `anchor-size(self-inline, ${i})`), e.style.setProperty("transform-origin", s)) : t == "top" ? (e.style.setProperty("inset-block-end", `anchor(start, ${r}px)`), e.style.setProperty("inset-inline-start", `anchor(start, ${r}px)`), e.style.setProperty("inline-size", `anchor-size(self-inline, ${i})`), e.style.setProperty("transform-origin", s)) : t == "left" ? (e.style.setProperty("inset-inline-start", `anchor(end, ${r}px)`), e.style.setProperty("inset-block-start", `anchor(start, ${r}px)`), e.style.setProperty("block-size", `anchor-size(self-block, ${i})`), e.style.setProperty("transform-origin", s)) : t == "right" ? (e.style.setProperty("inset-inline-end", `anchor(start, ${r}px)`), e.style.setProperty("inset-block-start", `anchor(start, ${r}px)`), e.style.setProperty("block-size", `anchor-size(self-block, ${i})`), e.style.setProperty("transform-origin", s)) : t == "center" && (e.style.setProperty("inset-inline-start", `anchor(center, ${r}px)`), e.style.setProperty("inset-block-start", `anchor(center, ${r}px)`), e.style.setProperty("inline-size", `anchor-size(self-inline, ${i})`), e.style.setProperty("block-size", `anchor-size(self-block, ${i})`), e.style.setProperty("transform-origin", s)), e.style.setProperty("position-visibility", "always"), e.style.setProperty("position-anchor", this.anchorId), e.style.setProperty("position", "absolute"), e.style.setProperty("position-area", "span-all"), e.style.setProperty("z-index", String(Ca(this.source ?? e) + n)), this;
  }
  connectWithContainerQuery(e, { placement: t = "fill", containerQuery: n = "(min-width: 768px)", fallbackPlacement: r = "bottom", zIndexShift: i = 1, inset: s = 0, size: o = "100%" }) {
    const a = globalThis.matchMedia ? globalThis.matchMedia(n) : null, l = () => {
      if (CSS.supports && CSS.supports("anchor-name", this.anchorId) && a?.matches) this.connectElement(e, {
        placement: t,
        zIndexShift: i,
        inset: s,
        size: o
      });
      else {
        e.style.removeProperty("position-anchor"), e.style.removeProperty("anchor-name"), e.style.setProperty("position", "absolute"), e.style.setProperty("z-index", String(Ca(this.source ?? e) + i));
        const c = this.source.getBoundingClientRect();
        r === "bottom" ? (e.style.setProperty("top", `${c.bottom + s}px`), e.style.setProperty("left", `${c.left + s}px`), e.style.setProperty("width", o)) : r === "top" ? (e.style.setProperty("bottom", `${globalThis.innerHeight - c.top + s}px`), e.style.setProperty("left", `${c.left + s}px`), e.style.setProperty("width", o)) : r === "right" ? (e.style.setProperty("top", `${c.top + s}px`), e.style.setProperty("left", `${c.right + s}px`), e.style.setProperty("height", o)) : r === "left" && (e.style.setProperty("top", `${c.top + s}px`), e.style.setProperty("right", `${globalThis.innerWidth - c.left + s}px`), e.style.setProperty("height", o));
      }
    };
    return a && (a.addEventListener("change", l), l()), () => a?.removeEventListener("change", l);
  }
}, wf = (e) => bf.getOrInsert(e, new kv(e));
function Ts(e, t) {
  if (!e) return () => {
  };
  const n = X(0, 0), r = X(0, 0), i = [
    n.x,
    n.y,
    r.x,
    r.y,
    w(0),
    w(0)
  ], s = {
    position: n,
    size: r
  }, o = Zu(s), a = Om(s), { root: l = e?.offsetParent ?? document.documentElement, observeResize: c = !0, observeMutations: u = !1 } = t || {}, d = new vf(e);
  function p() {
    const m = e?.getBoundingClientRect?.() ?? {};
    n.x.value = m?.left, n.y.value = m?.top, r.x.value = m?.right - m?.left, r.y.value = m?.bottom - m?.top, i[4].value = m?.right, i[5].value = m?.bottom;
  }
  const f = [
    T(l, "scroll", p, { capture: !0 }),
    T(window, "resize", p),
    T(window, "scroll", p, { capture: !0 })
  ];
  let h;
  c && "ResizeObserver" in window && typeof ResizeObserver < "u" && (h = typeof ResizeObserver < "u" ? new ResizeObserver(p) : void 0, h?.observe(e));
  let y;
  u && (y = typeof MutationObserver < "u" ? new MutationObserver(p) : void 0, y?.observe(e, {
    attributes: !0,
    childList: !0,
    subtree: !0
  })), p();
  function b() {
    f.forEach((m) => m?.()), h?.disconnect?.(), y?.disconnect?.();
  }
  return b && i.forEach((m) => J(m, Symbol.dispose, b)), Object.assign(i, {
    position: n,
    size: r,
    rect: s,
    center: o,
    area: a,
    elementSize: d,
    containsPoint: (m) => ef(s, m),
    intersects: (m) => Tm(s, m),
    clampPoint: (m) => Ps(m, s),
    distanceToPoint: (m) => Rm(m, s),
    bindPosition: (m) => tt.bindPosition(m, n),
    bindSize: (m) => tt.bindSize(m, r),
    bindCenter: (m) => tt.bindPosition(m, o),
    destroy: () => {
      d.destroy(), b();
    }
  });
}
var XS = (e, t, n) => {
  if (!e) return () => {
  };
  if (t?.connectElement) return t?.connectElement?.(e, n || {});
  const [r, i, s, o, a, l] = t, c = [];
  return n?.placement == "fill" ? (c.push(A(e, "inset-block-start", D.asPx(r), R)), c.push(A(e, "inset-inline-start", D.asPx(i), R)), c.push(A(e, "inset-block-end", D.asPx(a), R)), c.push(A(e, "inset-inline-end", D.asPx(l), R)), c.push(A(e, "inline-size", D.asPx(s), R)), c.push(A(e, "block-size", D.asPx(o), R))) : n?.placement == "bottom" ? (c.push(A(e, "inset-block-start", D.asPx(l), R)), c.push(A(e, "inset-inline-start", D.asPx(r), R)), c.push(A(e, "inline-size", D.asPx(s), R))) : n?.placement == "top" ? (c.push(A(e, "inset-block-end", D.asPx(i), R)), c.push(A(e, "inset-inline-start", D.asPx(r), R)), c.push(A(e, "inline-size", D.asPx(s), R))) : n?.placement == "left" ? (c.push(A(e, "inset-inline-end", D.asPx(a), R)), c.push(A(e, "inset-block-start", D.asPx(i), R)), c.push(A(e, "block-size", D.asPx(o), R))) : n?.placement == "right" ? (c.push(A(e, "inset-inline-start", D.asPx(r), R)), c.push(A(e, "inset-block-start", D.asPx(i), R)), c.push(A(e, "block-size", D.asPx(o), R))) : n?.placement == "center" && (c.push(A(e, "inset-inline-start", D.asPx(r), R)), c.push(A(e, "inset-block-start", D.asPx(i), R)), c.push(A(e, "inline-size", D.asPx(s), R)), c.push(A(e, "block-size", D.asPx(o), R))), () => {
    c?.forEach?.((u) => u?.());
  };
}, hc = (e, t, n, r) => {
  const { useIntersection: i = !1, zIndexShift: s = 1 } = r || {}, o = [];
  return t?.connectElement ? t?.connectElement?.(e, Object.assign(r || {}, { placement: n == "horizontal" ? "bottom" : "right" })) : (e.style.position = i ? "fixed" : "absolute", e.style.zIndex = `${s}`, n === "horizontal" ? (o.push(A(e, "left", D.asPx(t[0]), R)), o.push(A(e, "top", D.asPx(t[5]), R)), o.push(A(e, "width", D.asPx(t[2]), R))) : (o.push(A(e, "left", D.asPx(t[4]), R)), o.push(A(e, "top", D.asPx(t[1]), R)), o.push(A(e, "height", D.asPx(t[3]), R))), () => {
    o?.forEach?.((a) => a?.());
  });
}, ht = (e, t = document.documentElement, n = !1) => {
  const r = Fr(t) ?? t?.getBoundingClientRect?.(), i = Fr(e) ?? e?.getBoundingClientRect?.();
  if (!i) return n ? {
    intersection: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      width: 0,
      height: 0
    },
    anchor: {
      left: 0,
      top: 0,
      width: 0,
      height: 0
    },
    root: r
  } : {
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    width: 0,
    height: 0
  };
  const s = Math.max(r.left, i.left), o = Math.max(r.top, i.top), a = Math.min(r.right, i.right), l = Math.min(r.bottom, i.bottom), c = a > s && l > o ? {
    left: s,
    top: o,
    right: a,
    bottom: l,
    width: a - s,
    height: l - o
  } : {
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    width: 0,
    height: 0
  };
  return n ? {
    intersection: c,
    anchor: i,
    root: r,
    anchorLeft: i.left,
    anchorTop: i.top,
    anchorRight: i.right,
    anchorBottom: i.bottom,
    anchorWidth: i.width,
    anchorHeight: i.height,
    rootLeft: r.left,
    rootTop: r.top,
    rootWidth: r.width,
    rootHeight: r.height
  } : c;
};
function YS(e, t) {
  if (!e) return () => {
  };
  const n = [
    w(0),
    w(0),
    w(0),
    w(0),
    w(0),
    w(0)
  ], { root: r = e?.offsetParent ?? document.documentElement, iterateResize: i = !0, iterateMutations: s = !0, iterateIntersection: o = !0 } = t || {};
  function a(f) {
    const h = f ? {
      left: f.left,
      top: f.top,
      width: f.width,
      height: f.height,
      right: f.right,
      bottom: f.bottom
    } : ht(e, r, !1);
    n[0].value = h?.left ?? 0, n[1].value = h?.top ?? 0, n[2].value = h?.width ?? 0, n[3].value = h?.height ?? 0, n[4].value = h?.right ?? 0, n[5].value = h?.bottom ?? 0;
  }
  let l;
  observeResize && "ResizeObserver" in window && typeof ResizeObserver < "u" && (l = typeof ResizeObserver < "u" ? new ResizeObserver((f) => {
    for (const h of f) a(h.contentRect);
  }) : void 0, l?.observe(e));
  let c;
  observeMutations && (c = typeof MutationObserver < "u" ? new MutationObserver((f) => {
    for (const h of f) a(ht(e, r, !1));
  }) : void 0, c?.observe(e, {
    attributes: !0,
    childList: !0,
    subtree: !0
  }));
  let u;
  observeIntersection && (u = typeof IntersectionObserver < "u" ? new IntersectionObserver((f) => {
    for (const h of f) a(h.intersectionRect);
  }, {
    root: r instanceof HTMLElement ? r : null,
    threshold: [0],
    rootMargin: "0px"
  }) : void 0, u?.observe(e));
  const d = [
    T(r, "scroll", () => a(ht(e, r, !1)), { capture: !0 }),
    T(window, "resize", () => a(ht(e, r, !1))),
    T(window, "scroll", () => a(ht(e, r, !1)), { capture: !0 })
  ];
  a(ht(e, r, !1));
  function p() {
    d.forEach((f) => f?.()), l?.disconnect?.(), c?.disconnect?.(), u?.disconnect?.();
  }
  return p && n.forEach((f) => J(f, Symbol.dispose, p)), n;
}
function Sf(e, t) {
  if (!e) return () => {
  };
  const n = [
    w(0),
    w(0),
    w(0),
    w(0),
    w(0),
    w(0),
    w(0),
    w(0),
    w(0),
    w(0),
    w(0),
    w(0),
    w(0),
    w(0)
  ], { root: r = e?.offsetParent ?? document.documentElement, iterateResize: i = !0, iterateMutations: s = !0, iterateIntersection: o = !0 } = t || {};
  function a(f) {
    const h = f ? {
      intersection: {
        left: f.left,
        top: f.top,
        right: f.right,
        bottom: f.bottom,
        width: f.width,
        height: f.height
      },
      anchor: Fr(e) ?? e?.getBoundingClientRect?.(),
      root: (r instanceof HTMLElement ? Fr(r) ?? r?.getBoundingClientRect?.() : null) ?? {
        left: 0,
        top: 0,
        right: globalThis.innerWidth,
        bottom: globalThis.innerHeight,
        width: globalThis.innerWidth,
        height: globalThis.innerHeight
      }
    } : ht(e, r, !0);
    h.anchor && (n[0].value = h.intersection.left ?? 0, n[1].value = h.intersection.top ?? 0, n[2].value = h.intersection.width ?? 0, n[3].value = h.intersection.height ?? 0, n[4].value = h.intersection.right ?? 0, n[5].value = h.intersection.bottom ?? 0, n[6].value = h.anchor.left ?? 0, n[7].value = h.anchor.top ?? 0, n[8].value = h.anchor.width ?? 0, n[9].value = h.anchor.height ?? 0, n[10].value = h.root.left ?? 0, n[11].value = h.root.top ?? 0, n[12].value = h.root.width ?? 0, n[13].value = h.root.height ?? 0);
  }
  let l;
  observeResize && "ResizeObserver" in window && typeof ResizeObserver < "u" && (l = typeof ResizeObserver < "u" ? new ResizeObserver((f) => {
    for (const h of f) a(h.contentRect);
  }) : void 0, l?.observe(e));
  let c;
  observeMutations && (c = typeof MutationObserver < "u" ? new MutationObserver((f) => {
    for (const h of f) a(ht(e, r, !0).intersection);
  }) : void 0, c?.observe(e, {
    attributes: !0,
    childList: !0,
    subtree: !0
  }));
  let u;
  observeIntersection && (u = typeof IntersectionObserver < "u" ? new IntersectionObserver((f) => {
    for (const h of f) a(h.intersectionRect);
  }, {
    root: r instanceof HTMLElement ? r : null,
    threshold: [
      0,
      0.1,
      0.2,
      0.3,
      0.4,
      0.5,
      0.6,
      0.7,
      0.8,
      0.9,
      1
    ],
    rootMargin: "0px"
  }) : void 0, u?.observe(e));
  const d = [
    T(r, "scroll", () => a(ht(e, r, !0).intersection), { capture: !0 }),
    T(window, "resize", () => a(ht(e, r, !0).intersection)),
    T(window, "scroll", () => a(ht(e, r, !0).intersection), { capture: !0 })
  ];
  a(ht(e, r, !0).intersection);
  function p() {
    d.forEach((f) => f?.()), l?.disconnect?.(), c?.disconnect?.(), u?.disconnect?.();
  }
  return p && n.forEach((f) => J(f, Symbol.dispose, p)), n;
}
var $r = (e) => e?.parentElement ? e?.parentElement instanceof DocumentFragment ? void 0 : e?.parentElement : e?.host?.shadowRoot, Pa = (e, t) => {
  if (!e?.isConnected) return t();
  const n = new MutationObserver((s, o) => {
    for (const a of s) a.type == "childList" && Array.from(a?.removedNodes || []).some((l) => l === e || l?.contains?.(e)) && (queueMicrotask(() => t(a)), o?.disconnect?.());
  }), r = $r(e) ?? document.documentElement, i = (r instanceof HTMLElement ? r : r?.host) ?? r;
  queueMicrotask(() => n.observe(i, {
    subtree: !0,
    childList: !0
  }));
}, Aa = (e, t) => {
  if (e?.isConnected) return t();
  const n = new MutationObserver((s, o) => {
    e?.isConnected && (queueMicrotask(() => t()), o?.disconnect?.());
  }), r = $r(e), i = (r instanceof HTMLElement && r.isConnected ? r : null) ?? document.documentElement;
  queueMicrotask(() => {
    if (e?.isConnected) {
      t(), n.disconnect();
      return;
    }
    n.observe(i, {
      subtree: !0,
      childList: !0
    });
  });
}, Ev = (e, t, n, r, i, s, o) => {
  n === "scrollbar-x" ? e.connectElement(t, {
    placement: "bottom",
    zIndexShift: r,
    inset: i,
    size: s,
    transformOrigin: o
  }) : n === "scrollbar-y" ? e.connectElement(t, {
    placement: "right",
    zIndexShift: r,
    inset: i,
    size: s,
    transformOrigin: o
  }) : e.connectElement(t, {
    placement: n,
    zIndexShift: r,
    inset: i,
    size: s,
    transformOrigin: o
  });
}, xf = (e, t, n, r) => {
  const i = r?.role ?? "overlaying", s = r?.stackMode ?? "shift", o = r?.zIndexShift ?? gf(i), a = r?.placement ?? "fill", l = r?.positioning ?? "anchor", c = r?.inset ?? 0, u = r?.size ?? "100%", d = r?.transformOrigin ?? "50% 50%";
  if (e ??= n?.children?.[0] ?? e, !e && (n?.children?.length ?? 0) < 1) {
    const h = document.createElement("div");
    h.classList.add("ui-window-frame-anchor-box"), h.style.position = "relative", h.style.inlineSize = "stretch", h.style.blockSize = "stretch", h.style.zIndex = String(Math.max(o - 0, 0)), h.style.pointerEvents = "none", h.style.opacity = "1", h.style.visibility = "visible", h.style.backgroundColor = "transparent", n?.append?.(e = h);
  }
  if (e == null || t == null) return;
  const p = xv(e, {
    role: i,
    stackMode: s,
    zIndexShift: o
  });
  if (p == null ? t.style.removeProperty("z-index") : t.style.setProperty("z-index", String(p)), i === "underlying" && (t.style.pointerEvents || (t.style.pointerEvents = "none")), l === "contain") {
    const h = (n instanceof HTMLElement ? n : null) ?? $r(e) ?? e.parentElement;
    return h instanceof HTMLElement && getComputedStyle(h).position === "static" && (h.style.position = "relative"), t.style.position = "absolute", t.style.inset = c ? `${c}px` : "0", t.style.inlineSize = "auto", t.style.blockSize = "auto", t.style.removeProperty("position-anchor"), t.style.removeProperty("position-area"), t.style.removeProperty("anchor-name"), Aa(e, () => {
      const y = (n instanceof HTMLElement ? n : null) ?? $r(e) ?? e.parentElement;
      i === "underlying" ? e?.before?.(t) : e?.after?.(t), Pa(y ?? e, () => t?.remove?.());
    }), e;
  }
  const f = wf(e);
  return Ev(f, t, a, o, c, u, d), p == null ? t.style.removeProperty("z-index") : t.style.setProperty("z-index", String(p)), Aa(e, () => {
    const h = $r(e) ?? n;
    (h instanceof HTMLElement ? h : h?.host)?.style?.setProperty?.("anchor-scope", f.anchorId), i === "underlying" ? e?.before?.(t) : e?.after?.(t), Pa(h, () => t?.remove?.());
  }), e;
}, _f = (e, t, n, r) => {
  let i = null, s;
  return n && typeof n.nodeType == "number" ? (i = n, s = r) : s = n, xf(e, t, i, {
    placement: "fill",
    ...s,
    role: "underlying"
  });
}, Cv = (e, t, n, r) => xf(e, t, n, {
  ...r,
  placement: r?.placement ?? "fill",
  zIndexShift: r?.zIndexShift ?? 1,
  stackMode: r?.stackMode ?? "shift",
  role: "overlaying"
}), Pv = (e, t, n, r) => {
  const { zIndexShift: i = 1, autoPosition: s = !0, useIntersection: o = !1, theme: a = "default" } = r || {};
  t.classList.add(`scrollbar-theme-${a}`), t.setAttribute("data-axis", n);
  const l = [];
  if (s) if (o) {
    const c = Sf(e, {
      root: window,
      observeResize: !0,
      observeMutations: !0,
      observeIntersection: !0
    });
    l.push(hc(t, c, n, {
      useIntersection: !0,
      zIndexShift: i
    }));
  } else {
    const c = Ts(e, {
      observeResize: !0,
      observeMutations: !0
    });
    l.push(hc(t, c, n, {
      useIntersection: !1,
      zIndexShift: i
    }));
  }
  return t.parentNode || document.body.appendChild(t), Pa(e, () => {
    l.forEach((c) => c()), t.remove();
  }), t;
}, KS = (e, t = "vertical") => {
  const n = document.createElement("div");
  return n.className = `reactive-scrollbar reactive-scrollbar-${t}`, n.style.background = "rgba(0,0,0,0.3)", n.style.borderRadius = "4px", n.style.position = "absolute", n.style.zIndex = "1000", t === "horizontal" ? (n.style.height = "8px", n.style.width = "100px") : (n.style.width = "8px", n.style.height = "100px"), Pv(e, n, t, {
    autoPosition: !0,
    useIntersection: !0,
    theme: "default"
  });
}, Av = /* @__PURE__ */ new Map(), kf = (e, t, n = { role: "overlaying" }) => {
  const r = /* @__PURE__ */ new WeakMap(), i = (a, l, c) => {
    if (a?.style?.anchorName || r?.has?.(a)) return !1;
    if (a) {
      const u = t?.(a, l, c);
      r?.set?.(a, u), n.role === "underlying" ? _f(a, u, l) : Cv(a, u, l);
    }
    return !0;
  };
  class s extends vs {
    constructor(l) {
      super(l);
    }
    connect(l) {
      const c = l?.deref?.() ?? l;
      r?.has?.(c) || i(c);
    }
  }
  const o = [
    r,
    i,
    s
  ];
  return Av.set(e, o), new s(e), o;
}, JS = (e, t) => kf(e, t, { role: "overlaying" }), QS = (e, t) => kf(e, t, { role: "underlying" }), Tv = class {
  shadowContainer;
  shadowElement;
  geometryClone;
  target;
  options;
  anchorBox;
  cleanupFunctions = [];
  constructor(e) {
    this.target = e.target, this.options = {
      shadowType: "drop-shadow",
      shadowColor: "rgba(0, 0, 0, 0.25)",
      shadowBlur: 8,
      shadowOffsetX: 0,
      shadowOffsetY: 4,
      spreadRadius: 0,
      opacity: 1,
      inset: 0,
      zIndexShift: -1,
      useIntersection: !1,
      cloneGeometry: !0,
      updateOnScroll: !0,
      updateOnResize: !0,
      positioning: "contain",
      ...e
    }, this.createShadowElements(), this.setupPositioning(), this.setupGeometryCloning(), this.applyShadowStyle(), this.attachToDOM();
  }
  get positioningMode() {
    return this.options.positioning ?? "contain";
  }
  get geometryHost() {
    return this.options.geometrySource ?? this.target;
  }
  createShadowElements() {
    this.shadowContainer = document.createElement("div"), this.shadowContainer.className = ["underlying-shadow-container", this.options.className || ""].filter(Boolean).join(" "), this.shadowContainer.setAttribute("aria-hidden", "true"), this.shadowContainer.style.pointerEvents = "none", this.shadowContainer.style.overflow = "visible", this.shadowContainer.style.isolation = "isolate", this.shadowContainer.style.contentVisibility = "visible", this.options.cloneGeometry ? (this.geometryClone = document.createElement("div"), this.geometryClone.className = "underlying-shadow-geometry underlying-shadow-element", this.geometryClone.style.width = "100%", this.geometryClone.style.height = "100%", this.geometryClone.style.position = "relative", this.geometryClone.style.overflow = "hidden", this.geometryClone.style.contentVisibility = "visible", this.geometryClone.style.visibility = "visible", this.shadowContainer.appendChild(this.geometryClone), this.shadowElement = this.geometryClone) : (this.shadowElement = document.createElement("div"), this.shadowElement.className = "underlying-shadow-element", this.shadowElement.style.width = "100%", this.shadowElement.style.height = "100%", this.shadowElement.style.position = "relative", this.shadowElement.style.overflow = "hidden", this.shadowElement.style.contentVisibility = "visible", this.shadowElement.style.visibility = "visible", this.shadowContainer.appendChild(this.shadowElement));
  }
  setupPositioning() {
    const e = this.positioningMode;
    if (e === "contain") {
      this.shadowContainer.style.position = "absolute";
      return;
    }
    if (e !== "anchor" && (e === "fixed" ? this.shadowContainer.style.position = "fixed" : this.shadowContainer.style.position = "absolute", this.options.useIntersection ? (this.anchorBox = Sf(this.target, {
      root: window,
      observeResize: this.options.updateOnResize,
      observeMutations: !0,
      observeIntersection: !0
    }), A(this.shadowContainer, "left", D.asPx(this.anchorBox?.[6]), R), A(this.shadowContainer, "top", D.asPx(this.anchorBox?.[7]), R), A(this.shadowContainer, "width", D.asPx(this.anchorBox?.[8]), R), A(this.shadowContainer, "height", D.asPx(this.anchorBox?.[9]), R)) : (this.anchorBox = Ts(this.target, {
      observeResize: this.options.updateOnResize,
      observeMutations: !0
    }), A(this.shadowContainer, "left", D.asPx(this.anchorBox?.[0]), R), A(this.shadowContainer, "top", D.asPx(this.anchorBox?.[1]), R), A(this.shadowContainer, "width", D.asPx(this.anchorBox?.[2]), R), A(this.shadowContainer, "height", D.asPx(this.anchorBox?.[3]), R)), this.options.inset !== 0)) {
      const t = D.asPx(this.options.inset);
      Er(this.shadowContainer, "left", `calc(var(--left) + ${t})`), Er(this.shadowContainer, "top", `calc(var(--top) + ${t})`), Er(this.shadowContainer, "width", `calc(var(--width) - ${2 * t})`), Er(this.shadowContainer, "height", `calc(var(--height) - ${2 * t})`);
    }
  }
  setupGeometryCloning() {
    if (!this.geometryClone) return;
    const e = () => {
      const n = this.geometryHost, r = getComputedStyle(n), i = r.borderRadius;
      i && i !== "0px" && (this.geometryClone.style.borderRadius = i);
      const s = r.clipPath;
      s && s !== "none" && (this.geometryClone.style.clipPath = s), r.borderShape && r.borderShape !== "none" && (this.geometryClone.style.borderShape = r.borderShape), r.cornerShape && r.cornerShape !== "none" && (this.geometryClone.style.cornerShape = r.cornerShape);
      const o = r.maskImage || r.webkitMaskImage;
      o && o !== "none" && (this.geometryClone.style.maskImage = o, this.geometryClone.style.webkitMaskImage = o);
      const a = n.getAttribute("data-shape");
      a && this.geometryClone.setAttribute("data-shape", a);
      const l = r.borderWidth, c = r.borderStyle;
      l && l !== "0px" && c !== "none" && (this.geometryClone.style.border = `${l} ${c} transparent`), this.options.shadowType !== "box-shadow" && (this.geometryClone.style.background = "#000000"), this.geometryClone.style.opacity = "1";
    };
    e();
    const t = new MutationObserver(e);
    t.observe(this.geometryHost, {
      attributes: !0,
      attributeFilter: [
        "style",
        "class",
        "data-shape"
      ]
    }), this.cleanupFunctions.push(() => t.disconnect());
  }
  applyShadowStyle() {
    const { shadowType: e, shadowColor: t, shadowBlur: n, shadowOffsetX: r, shadowOffsetY: i, spreadRadius: s, opacity: o } = this.options;
    if (e === "drop-shadow") {
      const a = `drop-shadow(${D.asPx(r || 0)} ${D.asPx(i || 0)} ${D.asPx(n || 0)} ${t})`;
      this.shadowContainer.style.filter = a, this.shadowContainer.style.opacity = o.toString() || "1", this.shadowContainer.style.boxShadow = "none";
    } else if (e === "blur") {
      const a = `blur(${D.asPx(n || 0)})`;
      this.shadowContainer.style.filter = a, this.shadowContainer.style.opacity = o.toString() || "1", this.geometryClone && (this.geometryClone.style.backgroundColor = t);
    } else if (e === "box-shadow") {
      const a = `${D.asPx(r || 0)} ${D.asPx(i || 0)} ${D.asPx(n || 0)} ${D.asPx(s || 0)} ${t}`;
      this.geometryClone ? (this.shadowContainer.style.background = "transparent", this.shadowContainer.style.boxShadow = a) : this.shadowContainer.style.boxShadow = a, this.shadowContainer.style.filter = "none", this.shadowContainer.style.opacity = o.toString() || "1";
    }
  }
  attachToDOM() {
    if (!this.shadowContainer) return;
    const e = this.positioningMode;
    if (e === "fixed") {
      const r = this.shadowContainer;
      r.style.position = "fixed", r.style.pointerEvents = "none";
      const i = this.options.zIndexShift ?? -1, s = Number.parseInt(getComputedStyle(this.target).zIndex || "0", 10);
      Number.isFinite(s) ? r.style.zIndex = String(Math.max(s + i, 0)) : r.style.zIndex = String(Math.max(i, 0));
      const o = () => {
        this.target.isConnected && this.target.before(r);
      };
      Aa(this.target, o), this.target.isConnected && o();
    } else _f(this.target, this.shadowContainer, {
      stackMode: "shift",
      zIndexShift: this.options.zIndexShift ?? -1,
      placement: "fill",
      positioning: e === "contain" ? "contain" : "anchor",
      useIntersection: this.options.useIntersection
    });
    const t = this.target.parentElement ?? document.body, n = new MutationObserver((r) => {
      r.forEach((i) => {
        i.removedNodes.forEach((s) => {
          (s === this.target || s.contains?.(this.target)) && this.destroy();
        });
      });
    });
    t && (n.observe(t, {
      childList: !0,
      subtree: !0
    }), this.cleanupFunctions.push(() => n.disconnect()));
  }
  updateOptions(e) {
    Object.assign(this.options, e), this.applyShadowStyle(), e.cloneGeometry !== void 0 && this.setupGeometryCloning();
  }
  setVisible(e) {
    this.shadowContainer.style.display = e ? "block" : "none";
  }
  getShadowElement() {
    return this.shadowContainer;
  }
  destroy() {
    this.cleanupFunctions.forEach((e) => e()), this.shadowContainer?.parentNode && this.shadowContainer.parentNode.removeChild(this.shadowContainer), this.anchorBox && this.anchorBox.forEach((e) => {
      e && typeof e[Symbol.dispose] == "function" && e[Symbol.dispose]();
    });
  }
};
function ol(e) {
  return new Tv(e);
}
function ZS(e, t) {
  return ol({
    target: e,
    shadowType: "drop-shadow",
    shadowColor: "rgba(0, 0, 0, 0.6)",
    shadowBlur: 6,
    shadowOffsetX: 0,
    shadowOffsetY: 3,
    positioning: "contain",
    ...t
  });
}
function ex(e, t) {
  return ol({
    target: e,
    shadowType: "blur",
    shadowColor: "rgba(0, 0, 0, 0.2)",
    shadowBlur: 4,
    shadowOffsetX: 0,
    shadowOffsetY: 2,
    positioning: "contain",
    ...t
  });
}
function Ef(e, t) {
  return ol({
    target: e,
    shadowType: "box-shadow",
    shadowColor: "rgba(0, 0, 0, 0.2)",
    shadowBlur: 8,
    shadowOffsetX: 0,
    shadowOffsetY: 4,
    spreadRadius: 0,
    positioning: "contain",
    ...t
  });
}
function tx(e, t) {
  return Ef(e, {
    shadowType: "blur",
    className: "ui-ws-item-icon-under",
    shadowColor: "rgba(0, 0, 0, 0.6)",
    shadowBlur: 24,
    shadowOffsetY: 6,
    shadowOffsetX: 0,
    spreadRadius: -8,
    opacity: 1,
    cloneGeometry: !0,
    positioning: "anchor",
    geometrySource: t?.geometrySource ?? e.querySelector(".ui-ws-item-icon") ?? e,
    ...t
  });
}
function nx(e, t) {
  return Ef(e, {
    className: "cw-context-menu-under",
    shadowColor: "rgba(0, 0, 0, 0.45)",
    shadowBlur: 36,
    shadowOffsetY: 14,
    shadowOffsetX: 0,
    spreadRadius: 0,
    cloneGeometry: !0,
    positioning: "fixed",
    updateOnScroll: !0,
    updateOnResize: !0,
    ...t
  });
}
var Mv = (e, t) => {
  const n = Ke("[data-id]", e?.target, 0, "parent")?.getAttribute?.("data-id"), r = t?.items?.find?.((s) => s?.some?.((o) => o?.id == n))?.find?.((s) => s?.id == n);
  (r?.action ?? t?.defaultAction)?.(t?.openedWith?.initiator, r, t?.openedWith?.event ?? e), t?.openedWith?.close?.();
  const i = os(t?.openedWith?.element);
  i != null && (i.value = !1);
}, Rv = /* @__PURE__ */ new WeakMap(), Cf = typeof document < "u" && document?.documentElement ? cv(document.documentElement, "contextmenu", {
  capture: !0,
  passive: !1
}, {
  strategy: "closest",
  preventDefault: "handled",
  stopImmediatePropagation: "handled"
}) : (e, t) => () => {
}, os = (e) => e == null ? null : Rv?.getOrInsertComputed?.(e, () => Fm(e, !1)), Ov = (e, t) => {
  const r = T(e, "click", (i) => {
    Mv(i, t);
  }, { composed: !0 });
  return () => r?.();
}, Pf = (e = document) => {
  let t = Ke('ui-modal[type="contextmenu"]', e);
  return t || (t = Pe`<ui-modal type="contextmenu"></ui-modal>`, (e instanceof Document ? e.body : e).append(t)), t;
}, Af = (e, t, n, r) => (i) => {
  let s = !1;
  const o = r || Pf(), a = os(o), l = i?.target ?? e ?? document.elementFromPoint(i?.clientX || 0, i?.clientY || 0), c = {
    event: i,
    initiator: l,
    trigger: e,
    menu: o,
    ctxMenuDesc: n
  };
  if (n.context = c, n?.onBeforeOpen?.(c) === !1) return s;
  const u = n?.buildItems?.(c);
  if (Array.isArray(u) && u.length && (n.items = u), a?.value && i?.type !== "contextmenu")
    return a.value = !1, n?.openedWith?.close?.(), s;
  if (l && a) {
    s = !0, o.innerHTML = "", a.value = !0, o?.append?.(...n?.items?.map?.((y, b) => {
      const m = y?.map?.((k) => Pe`<li data-id=${k?.id || ""}><ui-icon icon=${k?.icon || ""} icon-style="duotone"></ui-icon><span>${k?.label || ""}</span></li>`), x = y?.length > 1 && b !== (n?.items?.length || 0) - 1 ? Pe`<li class="ctx-menu-separator"></li>` : null;
      return [...m, x];
    })?.flat?.()?.filter?.((y) => !!y) || []);
    const d = ry?.(o, t?.(i, l)), p = Ov(o, n), f = hf?.(o, (y) => {
      const b = o;
      if (!(o?.contains?.(y?.target ?? null) || y?.target == (b?.element ?? b)) || !y?.target) {
        n?.openedWith?.close?.();
        const m = os(o);
        m != null && (m.value = !1);
      }
    }, [
      "click",
      "pointerdown",
      "scroll"
    ]), h = Cf(o, () => !0);
    n.openedWith = {
      initiator: l,
      element: o,
      event: i,
      context: n?.context,
      close() {
        a.value = !1, n.openedWith = null, p?.(), d?.(), f?.(), h?.(), n._backUnreg && (n._backUnreg(), n._backUnreg = null);
      }
    }, !n._backUnreg && a && (n._backUnreg = am(o, a, () => {
      n?.openedWith?.close?.();
    }));
  }
  return s;
}, rx = (e, t, n) => {
  const r = Af(e, (s) => [
    s?.clientX,
    s?.clientY,
    200
  ], t, n), i = iy(e, () => Cf(e, r));
  return () => {
    i?.();
  };
}, ix = (e, t, n) => {
  const r = n || Ke('ui-modal[type="menulist"]', document.body) || Pf(), i = e, s = Af(e, (l) => Ts(i)?.slice?.(0, 3), t, r), o = hf?.(r, (l) => {
    if (!(r?.contains?.(l?.target) || l?.target == (e?.element ?? e)) || !l?.target) {
      t?.openedWith?.close?.();
      const c = os(r);
      c != null && (c.value = !1);
    }
  }, [
    "click",
    "pointerdown",
    "scroll"
  ]), a = T(e, "click", s, { composed: !0 });
  return () => {
    o?.(), a?.();
  };
}, Tf = "rs-clipboard", Iv = 256e3, Nv = 2e6, zv = 12e3, si = (e) => {
  if (typeof globalThis.requestAnimationFrame == "function") {
    globalThis.requestAnimationFrame(e);
    return;
  }
  if (typeof MessageChannel < "u") {
    const t = new MessageChannel();
    t.port1.onmessage = () => e(), t.port2.postMessage(void 0);
    return;
  }
  if (typeof setTimeout == "function") {
    setTimeout(() => e(), 16);
    return;
  }
  if (typeof queueMicrotask == "function") {
    queueMicrotask(() => e());
    return;
  }
  e();
}, oi = (e) => {
  if (e == null) return "";
  if (typeof e == "string") return e;
  try {
    return JSON.stringify(e, null, 2);
  } catch {
    return String(e);
  }
}, Lv = (e, t) => Promise.race([e.then(() => "ok").catch(() => "error"), new Promise((n) => {
  globalThis.setTimeout(() => n("timeout"), t);
})]), Kr = async (e) => {
  const t = oi(e);
  if (!t.trim()) return {
    ok: !1,
    error: "Empty content"
  };
  if (t.length > Nv) return {
    ok: !1,
    error: "Content too large to copy safely"
  };
  const n = t.trim();
  return new Promise((r) => {
    si(() => {
      typeof document < "u" && document.hasFocus && !document.hasFocus() && globalThis?.focus?.(), (async () => {
        const s = async () => {
          if (typeof navigator > "u" || !navigator.clipboard?.writeText) return !1;
          const o = await Lv(navigator.clipboard.writeText(n), zv);
          return o === "ok" ? !0 : (o === "timeout" && console.warn("[Clipboard] writeText timed out"), !1);
        };
        try {
          if (await s()) {
            r({
              ok: !0,
              data: n,
              method: "clipboard-api"
            });
            return;
          }
        } catch (o) {
          console.warn("[Clipboard] Direct write failed:", o);
        }
        if (n.length > Iv) {
          r({
            ok: !1,
            error: "Content too large for fallback copy"
          });
          return;
        }
        try {
          if (typeof document < "u") {
            const o = document.createElement("textarea");
            o.value = n, o.style.cssText = "position:fixed;left:-9999px;top:-9999px;opacity:0;pointer-events:none;", document.body.appendChild(o), o.select(), o.remove();
          }
        } catch (o) {
          console.warn("[Clipboard] Legacy execCommand failed:", o);
        }
        r({
          ok: !1,
          error: "All clipboard methods failed"
        });
      })();
    });
  });
}, $v = async (e, t) => {
  const n = e.trim(), r = (t ?? n).trim();
  return n ? new Promise((i) => {
    si(() => {
      typeof document < "u" && document.hasFocus && !document.hasFocus() && globalThis?.focus?.(), (async () => {
        try {
          if (typeof navigator < "u" && navigator.clipboard?.write) {
            const o = new Blob([n], { type: "text/html" }), a = new Blob([r], { type: "text/plain" });
            return await navigator.clipboard.write([new ClipboardItem({
              "text/html": o,
              "text/plain": a
            })]), i({
              ok: !0,
              data: n,
              method: "clipboard-api"
            });
          }
        } catch (o) {
          console.warn("[Clipboard] HTML write failed:", o);
        }
        i(await Kr(r));
      })();
    });
  }) : {
    ok: !1,
    error: "Empty content"
  };
}, pc = async (e) => new Promise((t) => {
  si(async () => {
    typeof document < "u" && document.hasFocus && !document.hasFocus() && globalThis?.focus?.();
    try {
      let n;
      if (typeof e == "string" ? e.startsWith("data:") ? n = await (await fetch(e)).blob() : n = await (await fetch(e)).blob() : n = e, typeof navigator < "u" && navigator.clipboard?.write) {
        const r = n.type === "image/png" ? n : await Dv(n);
        await navigator.clipboard.write([new ClipboardItem({ [r.type]: r })]), t({
          ok: !0,
          method: "clipboard-api"
        });
        return;
      }
    } catch (n) {
      console.warn("[Clipboard] Image write failed:", n);
    }
    t({
      ok: !1,
      error: "Image clipboard not supported"
    });
  });
}), Dv = async (e) => new Promise((t, n) => {
  if (typeof document > "u") {
    n(/* @__PURE__ */ new Error("No document context"));
    return;
  }
  const r = new Image(), i = URL.createObjectURL(e);
  r.onload = () => {
    const s = document.createElement("canvas");
    s.width = r.naturalWidth, s.height = r.naturalHeight;
    const o = s.getContext("2d");
    if (!o) {
      URL.revokeObjectURL(i), n(/* @__PURE__ */ new Error("Canvas context failed"));
      return;
    }
    o.drawImage(r, 0, 0), s.toBlob((a) => {
      URL.revokeObjectURL(i), a ? t(a) : n(/* @__PURE__ */ new Error("PNG conversion failed"));
    }, "image/png");
  }, r.onerror = () => {
    URL.revokeObjectURL(i), n(/* @__PURE__ */ new Error("Image load failed"));
  }, r.src = i;
}), sx = async () => new Promise((e) => {
  si(() => {
    (async () => {
      try {
        if (typeof navigator < "u" && navigator.clipboard?.readText) {
          e({
            ok: !0,
            data: await navigator.clipboard.readText(),
            method: "clipboard-api"
          });
          return;
        }
      } catch (n) {
        console.warn("[Clipboard] Read failed:", n);
      }
      e({
        ok: !1,
        error: "Clipboard read not available"
      });
    })();
  });
}), Fv = async (e, t = {}) => {
  const { type: n, showFeedback: r = !1, silentOnError: i = !1 } = t;
  return new Promise((s) => {
    si(async () => {
      let o;
      if (e instanceof Blob) if (e.type.startsWith("image/")) o = await pc(e);
      else {
        const a = await e.text();
        o = await Kr(a);
      }
      else n === "html" || typeof e == "string" && e.trim().startsWith("<") ? o = await $v(String(e)) : n === "image" ? o = await pc(e) : o = await Kr(oi(e));
      r && (o.ok || !i) && Wv(o), s(o);
    });
  });
}, Wv = (e) => {
  try {
    const t = new BroadcastChannel("rs-toast");
    t.postMessage({
      type: "show-toast",
      options: {
        message: e.ok ? "Copied to clipboard" : e.error || "Copy failed",
        kind: e.ok ? "success" : "error",
        duration: 2e3
      }
    }), t.close();
  } catch (t) {
    console.warn("[Clipboard] Feedback broadcast failed:", t);
  }
}, Hv = (e, t) => {
  try {
    const n = new BroadcastChannel(Tf);
    n.postMessage({
      type: "copy",
      data: e,
      options: t
    }), n.close();
  } catch (n) {
    console.warn("[Clipboard] Request broadcast failed:", n);
  }
}, ho = null, wr = 0, po = null, yc = Promise.resolve(), Bv = () => {
  if (typeof BroadcastChannel > "u") return () => {
  };
  if (wr === 0) {
    const e = new BroadcastChannel(Tf), t = (n) => {
      if (n.data?.type !== "copy") return;
      const r = n.data.options || {}, i = n.data.data;
      yc = yc.then(async () => {
        try {
          await Fv(i, {
            ...r,
            showFeedback: r.showFeedback !== !1,
            silentOnError: r.silentOnError === !0
          });
        } catch (s) {
          console.warn("[Clipboard] Broadcast copy failed:", s);
        }
      });
    };
    e.addEventListener("message", t), ho = e, po = t;
  }
  return wr++, () => {
    if (wr--, wr <= 0) {
      const e = ho, t = po;
      e && t && (e.removeEventListener("message", t), e.close()), ho = null, po = null, wr = 0;
    }
  };
}, ox = () => Bv(), ax = () => typeof navigator < "u" && !!navigator.clipboard, lx = () => typeof navigator < "u" && typeof navigator.clipboard?.writeText == "function", jv = () => {
  try {
    return typeof chrome < "u" && !!chrome?.runtime?.id;
  } catch {
    return !1;
  }
}, cx = async (e, t) => {
  const { tabId: n, offscreenFallback: r } = typeof t == "number" ? { tabId: t } : t || {}, i = oi(e).trim();
  if (!i) return {
    ok: !1,
    error: "Empty content"
  };
  if (jv() && typeof chrome?.tabs?.sendMessage == "function") {
    try {
      if (typeof n == "number" && n >= 0) {
        const s = await chrome.tabs.sendMessage(n, {
          type: "COPY_HACK",
          data: i
        });
        if (s?.ok) return {
          ok: !0,
          data: s?.data,
          method: s?.method ?? "broadcast"
        };
      } else {
        const s = await chrome.tabs.query({
          currentWindow: !0,
          active: !0
        });
        for (const o of s || []) if (o?.id != null && o.id >= 0) try {
          const a = await chrome.tabs.sendMessage(o.id, {
            type: "COPY_HACK",
            data: i
          });
          if (a?.ok) return {
            ok: !0,
            data: a?.data,
            method: a?.method ?? "broadcast"
          };
        } catch {
        }
      }
    } catch (s) {
      console.warn("[Clipboard] CRX content script message failed:", s);
    }
    if (r) try {
      if (await r(i)) return {
        ok: !0,
        data: i,
        method: "offscreen"
      };
    } catch (s) {
      console.warn("[Clipboard] Offscreen fallback failed:", s);
    }
  }
  return Hv(e, { showFeedback: !0 }), {
    ok: !1,
    error: "Broadcast sent, result pending",
    method: "broadcast"
  };
}, ux = async (e) => (await Kr(oi(e))).ok, fx = async (e) => Kr(oi(e)), Uv = (e, t) => {
  const n = /* @__PURE__ */ new Set();
  let r = e?.target || document.activeElement || document.body;
  if (r instanceof HTMLInputElement || r instanceof HTMLTextAreaElement || r.isContentEditable) return [];
  let i = r;
  const s = /* @__PURE__ */ new Set();
  for (; i && !s.has(i); ) {
    s.add(i), typeof i[t] == "function" && n.add(i), i.operativeInstance && typeof i.operativeInstance[t] == "function" && n.add(i.operativeInstance);
    const o = i.shadowRoot?.host;
    if (o && o !== i) i = o;
    else {
      const a = i.getRootNode?.()?.host, l = i.parentElement || a;
      i = l && l !== i ? l : null;
    }
  }
  if (e.currentTarget instanceof Node || typeof document < "u") {
    const o = e.currentTarget instanceof Node ? e.currentTarget instanceof Document ? e.currentTarget.body : e.currentTarget : document.body;
    if (o) {
      const a = document.createTreeWalker(o, NodeFilter.SHOW_ELEMENT, { acceptNode(l) {
        return typeof l[t] == "function" || l.operativeInstance && typeof l.operativeInstance[t] == "function" ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      } });
      for (; a.nextNode(); ) {
        const l = a.currentNode;
        typeof l[t] == "function" && n.add(l), l.operativeInstance && typeof l.operativeInstance[t] == "function" && n.add(l.operativeInstance);
      }
    }
  }
  return Array.from(n);
}, yo = (e, t) => {
  const n = Uv(e, t), r = /* @__PURE__ */ new Set();
  for (const i of n) {
    if (r.has(i)) continue;
    const s = i?.operativeInstance;
    s && r.has(s) || (r.add(i), s && r.add(s), i[t]?.(e));
  }
}, mc = !1, dx = () => {
  typeof window > "u" || mc || (mc = !0, zr(window, "copy", (e) => yo(e, "onCopy"), {
    capture: !1,
    passive: !0
  }), zr(window, "cut", (e) => yo(e, "onCut"), {
    capture: !1,
    passive: !0
  }), zr(window, "paste", (e) => yo(e, "onPaste"), {
    capture: !1,
    passive: !1
  }));
}, al = "cw-oriented-desktop-layout-v1", Ms = `${al}.draft`, vc = (e) => {
  try {
    return localStorage.getItem(e);
  } catch {
    return null;
  }
}, Mf = (e, t) => {
  try {
    localStorage.setItem(e, t);
  } catch {
  }
}, Rf = (e) => {
  try {
    localStorage.removeItem(e);
  } catch {
  }
};
function Of(e, t, n) {
  const r = {
    v: 2,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    columns: e,
    rows: t,
    items: n
  };
  return JSON.stringify(r);
}
function gc(e) {
  try {
    const t = JSON.parse(e);
    if (!t || typeof t != "object") return null;
    const n = t.items;
    if (!Array.isArray(n)) return null;
    const r = Math.max(0, Number(t.columns)), i = Math.max(0, Number(t.rows));
    return t.v === 2 && Number.isFinite(r) && Number.isFinite(i) ? {
      v: 2,
      updatedAt: String(t.updatedAt || (/* @__PURE__ */ new Date()).toISOString()),
      columns: r || 6,
      rows: i || 8,
      items: n
    } : {
      v: 2,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      columns: Number.isFinite(r) && r > 0 ? r : 6,
      rows: Number.isFinite(i) && i > 0 ? i : 8,
      items: n
    };
  } catch {
    return null;
  }
}
function hx() {
  const e = vc(al), t = vc(Ms);
  if (!e) return t;
  if (!t) return e;
  const n = gc(e), r = gc(t);
  if (!n) return t;
  if (!r) return e;
  const i = Date.parse(n.updatedAt || ""), s = Date.parse(r.updatedAt || "");
  return Number.isFinite(s) && Number.isFinite(i) && s > i ? t : e;
}
function px(e, t, n) {
  Mf(al, Of(e, t, n)), Rf(Ms);
}
function yx(e, t, n) {
  Mf(Ms, Of(e, t, n));
}
function mx() {
  Rf(Ms);
}
var If = /^https:\/\/www\.google\.com\/s2\/favicons\?[^#]*domain=([^&]+)/i, ai = (e) => {
  const t = String(e || "").trim().toLowerCase().replace(/\.$/, "");
  return !!(!t || t === "localhost" || t.endsWith(".local") || t === "::1" || /^127\.\d+\.\d+\.\d+$/.test(t) || /^10\.\d+\.\d+\.\d+$/.test(t) || /^192\.168\.\d+\.\d+$/.test(t) || /^172\.(1[6-9]|2\d|3[01])\.\d+\.\d+$/.test(t) || /^0\.0\.0\.0$/.test(t));
}, Vv = (e, t) => {
  const n = String(e || "").trim();
  if (!n) return !1;
  try {
    const r = t || (typeof location < "u" ? location.href : "https://local.invalid/"), i = new URL(n, r);
    if (!/^https?:$/i.test(i.protocol)) return !1;
    const s = String(i.hostname || "").toLowerCase();
    return !(!s || ai(s) || typeof location < "u" && location.hostname && s === location.hostname.toLowerCase() || typeof location < "u" && i.origin === location.origin);
  } catch {
    return !1;
  }
}, qv = (e) => {
  const t = String(e || "").trim();
  return t ? t.startsWith("https://") ? `S${t.slice(8)}` : t.startsWith("http://") ? `H${t.slice(7)}` : `R${t}` : "";
}, Gv = (e) => {
  const t = String(e || "").trim();
  return t ? t.startsWith("S") ? `https://${t.slice(1)}` : t.startsWith("H") ? `http://${t.slice(1)}` : t.startsWith("R") ? t.slice(1) : t : "";
}, ir = (e) => {
  const t = String(e || "").trim().toLowerCase().replace(/\.$/, "");
  return !t || ai(t) || typeof location < "u" && location.hostname && t === location.hostname.toLowerCase() ? "" : `g:${t}`;
}, Xv = (e) => {
  const t = String(e || "").trim();
  if (!t || ai(t)) return "";
  try {
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(t.replace(/^\./, ""))}&sz=128`;
  } catch {
    return "";
  }
}, Nf = (e, t) => {
  if (!Vv(e, t)) return "";
  try {
    const n = t || (typeof location < "u" ? location.href : "https://local.invalid/"), r = new URL(String(e || "").trim(), n);
    return ir(r.hostname);
  } catch {
    return "";
  }
}, vx = (e, t, n) => {
  const r = String(e || "").trim();
  if (/^(data:|blob:)/i.test(r)) return "";
  if (r.startsWith("g:")) {
    const s = r.slice(2).trim().toLowerCase();
    return ir(s);
  }
  const i = r.match(If);
  if (i) try {
    const s = decodeURIComponent(i[1]).toLowerCase();
    return ir(s);
  } catch {
    return "";
  }
  if (/^https?:\/\//i.test(r) && r.length < 2048) try {
    const s = new URL(r);
    return ai(s.hostname) || typeof location < "u" && s.origin === location.origin ? "" : r;
  } catch {
    return r;
  }
  return !r && String(n || "") === "open-link" && t ? Nf(String(t)) : "";
}, gx = (e) => {
  const t = String(e || "").trim();
  if (!t || /^(data:|blob:)/i.test(t)) return "";
  if (t.startsWith("g:")) {
    const n = t.slice(2);
    return ir(n) ? Xv(n) : "";
  }
  return t;
}, Yv = (e, t, n) => {
  const r = String(e || "").trim();
  if (/^(data:|blob:)/i.test(r)) return "";
  if (r.startsWith("g:")) return ir(r.slice(2));
  const i = r.match(If);
  if (i) try {
    const s = decodeURIComponent(i[1]).toLowerCase();
    return ir(s);
  } catch {
    return "";
  }
  if (String(t || "") === "open-link" && n) {
    const s = Nf(String(n));
    if (s) return s;
  }
  if (/^https?:\/\//i.test(r) && r.length < 2048) try {
    const s = new URL(r);
    return ai(s.hostname) || typeof location < "u" && s.origin === location.origin ? "" : r;
  } catch {
    return r;
  }
  return "";
}, Kv = "cw-sdi", bx = (e) => {
  const t = e.href ? qv(e.href) : "", n = Yv(String(e.iconSrc || ""), e.action, e.href);
  return JSON.stringify({
    k: Kv,
    v: 1,
    i: {
      id: e.id,
      l: e.label,
      n: e.icon,
      c: e.cell,
      a: e.action || "open-view",
      w: e.viewId,
      ...t ? { u: t } : {},
      ...n ? { g: n } : {},
      ...e.shape ? { s: e.shape } : {}
    }
  });
}, wx = (e) => {
  if (!e || typeof e != "object") return null;
  const t = e;
  if (t.k !== "cw-sdi" || !t.i || typeof t.i != "object") return null;
  const n = t.i, r = n.c, i = Array.isArray(r) ? Number(r[0]) : NaN, s = Array.isArray(r) ? Number(r[1]) : NaN, o = typeof n.u == "string" ? n.u : "", a = o ? Gv(o) : "", l = String(n.a || (a ? "open-link" : "open-view"));
  return {
    id: String(n.id || ""),
    label: String(n.l ?? "Item"),
    icon: String(n.n ?? "sparkle"),
    iconSrc: typeof n.g == "string" ? String(n.g) : "",
    viewId: String(n.w ?? (l === "open-link" ? "home" : "viewer")),
    cell: [Number.isFinite(i) ? i : 0, Number.isFinite(s) ? s : 0],
    action: l,
    href: a,
    shape: n.s
  };
}, Jv = class {
  storageKey;
  maxEntries;
  autoSave;
  entries = [];
  constructor(e = {}) {
    this.storageKey = e.storageKey || "rs-basic-history", this.maxEntries = e.maxEntries || 100, this.autoSave = e.autoSave !== !1, this.loadHistory();
  }
  addEntry(e) {
    const t = {
      ...e,
      id: this.generateId(),
      ts: Date.now()
    };
    return this.entries.unshift(t), this.entries.length > this.maxEntries && (this.entries = this.entries.slice(0, this.maxEntries)), this.autoSave && this.saveHistory(), t;
  }
  getAllEntries() {
    return [...this.entries];
  }
  getRecentEntries(e = 10) {
    return this.entries.slice(0, e);
  }
  getEntryById(e) {
    return this.entries.find((t) => t.id === e);
  }
  removeEntry(e) {
    const t = this.entries.findIndex((n) => n.id === e);
    return t === -1 ? !1 : (this.entries.splice(t, 1), this.autoSave && this.saveHistory(), !0);
  }
  clearHistory() {
    this.entries = [], this.autoSave && this.saveHistory();
  }
  searchEntries(e) {
    const t = e.toLowerCase();
    return this.entries.filter((n) => n.prompt.toLowerCase().includes(t) || n.before.toLowerCase().includes(t) || n.after.toLowerCase().includes(t));
  }
  getSuccessfulEntries() {
    return this.entries.filter((e) => e.ok);
  }
  getFailedEntries() {
    return this.entries.filter((e) => !e.ok);
  }
  getStatistics() {
    const e = this.entries.length, t = this.entries.filter((i) => i.ok).length, n = e - t, r = this.entries.filter((i) => i.duration).reduce((i, s) => i + (s.duration || 0), 0) / Math.max(1, this.entries.filter((i) => i.duration).length);
    return {
      total: e,
      successful: t,
      failed: n,
      successRate: e > 0 ? t / e * 100 : 0,
      averageDuration: r || 0
    };
  }
  exportHistory() {
    return JSON.stringify(this.entries, null, 2);
  }
  importHistory(e) {
    try {
      const t = JSON.parse(e);
      if (!Array.isArray(t)) throw new Error("Invalid history data: not an array");
      for (const s of t) if (typeof s.ts != "number" || typeof s.prompt != "string") throw new Error("Invalid history entry: missing required fields");
      const n = t.map((s) => ({
        ...s,
        id: s.id || this.generateId()
      })), r = new Set(this.entries.map((s) => s.id)), i = n.filter((s) => !r.has(s.id));
      return this.entries.unshift(...i), this.entries.length > this.maxEntries && (this.entries = this.entries.slice(0, this.maxEntries)), this.autoSave && this.saveHistory(), !0;
    } catch (t) {
      return console.error("Failed to import history:", t), !1;
    }
  }
  createHistoryView(e) {
    const t = Pe`<div class="history-view">
      <div class="history-header">
        <h3>Processing History</h3>
        <div class="history-actions">
          <button class="btn small" data-action="clear-history">Clear All</button>
          <button class="btn small" data-action="export-history">Export</button>
        </div>
      </div>

      <div class="history-stats">
        ${this.createStatsDisplay()}
      </div>

      <div class="history-list">
        ${this.entries.length === 0 ? Pe`<div class="empty-history">No history yet. Start processing some content!</div>` : this.entries.map((n) => this.createHistoryItem(n, e))}
      </div>
    </div>`;
    return t.addEventListener("click", (n) => {
      const r = n.target, i = r.getAttribute("data-action"), s = r.getAttribute("data-entry-id");
      if (i === "clear-history") {
        if (confirm("Are you sure you want to clear all history?")) {
          this.clearHistory();
          const o = this.createHistoryView(e);
          t.replaceWith(o);
        }
      } else if (i === "export-history") this.exportHistoryToFile();
      else if (i === "use-entry" && s) {
        const o = this.getEntryById(s);
        o && e?.(o);
      }
    }), t;
  }
  createRecentHistoryView(e = 3, t) {
    const n = this.getRecentEntries(e), r = Pe`<div class="recent-history">
      <div class="recent-header">
        <h4>Recent Activity</h4>
        <button class="btn small" data-action="view-full-history">View All</button>
      </div>

      ${n.length === 0 ? Pe`<div class="no-recent">No recent activity</div>` : n.map((i) => this.createCompactHistoryItem(i, t))}
    </div>`;
    return r.addEventListener("click", (i) => {
      const s = i.target, o = s.getAttribute("data-action"), a = s.getAttribute("data-entry-id");
      if (o === "view-full-history") console.log("View full history requested");
      else if (o === "use-entry" && a) {
        const l = this.getEntryById(a);
        l && t?.(l);
      }
    }), r;
  }
  createStatsDisplay() {
    const e = this.getStatistics();
    return Pe`<div class="stats-grid">
      <div class="stat-item">
        <span class="stat-value">${e.total}</span>
        <span class="stat-label">Total</span>
      </div>
      <div class="stat-item">
        <span class="stat-value success">${e.successful}</span>
        <span class="stat-label">Success</span>
      </div>
      <div class="stat-item">
        <span class="stat-value error">${e.failed}</span>
        <span class="stat-label">Failed</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">${e.successRate.toFixed(1)}%</span>
        <span class="stat-label">Success Rate</span>
      </div>
    </div>`;
  }
  createHistoryItem(e, t) {
    const n = new Date(e.ts).toLocaleString(), r = e.duration ? ` (${(e.duration / 1e3).toFixed(1)}s)` : "";
    return Pe`<div class="history-item ${e.ok ? "success" : "error"}">
      <div class="history-meta">
        <span class="history-status ${e.ok ? "success" : "error"}">
          ${e.ok ? "✓" : "✗"}
        </span>
        <span class="history-time">${n}${r}</span>
        ${e.model ? Pe`<span class="history-model">${e.model}</span>` : ""}
      </div>

      <div class="history-content">
        <div class="history-prompt">${e.prompt}</div>
        <div class="history-input">Input: ${e.before}</div>
        ${e.error ? Pe`<div class="history-error">Error: ${e.error}</div>` : ""}
      </div>

      <div class="history-actions">
        <button class="btn small" data-action="use-entry" data-entry-id="${e.id}">Use Prompt</button>
        ${e.ok ? Pe`<button class="btn small" data-action="view-result" data-entry-id="${e.id}">View Result</button>` : ""}
      </div>
    </div>`;
  }
  createCompactHistoryItem(e, t) {
    const n = new Date(e.ts).toLocaleString(), r = e.prompt.length > 40 ? e.prompt.substring(0, 40) + "..." : e.prompt;
    return Pe`<div class="history-item-compact ${e.ok ? "success" : "error"}">
      <div class="history-meta">
        <span class="history-status ${e.ok ? "success" : "error"}">${e.ok ? "✓" : "✗"}</span>
        <span class="history-prompt">${r}</span>
      </div>
      <div class="history-time">${n}</div>
      <button class="btn small" data-action="use-entry" data-entry-id="${e.id}">Use</button>
    </div>`;
  }
  exportHistoryToFile() {
    const e = this.exportHistory(), t = new Blob([e], { type: "application/json" }), n = URL.createObjectURL(t), r = document.createElement("a");
    r.href = n, r.download = `ai-history-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.json`, document.body.append(r), r.click(), r.remove(), URL.revokeObjectURL(n);
  }
  generateId() {
    return `history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  loadHistory() {
    try {
      if (typeof localStorage > "u") return;
      const e = localStorage.getItem(this.storageKey);
      if (e) {
        const t = JSON.parse(e);
        this.entries = t.map((n) => ({
          ...n,
          id: n.id || this.generateId()
        }));
      }
    } catch (e) {
      console.warn("Failed to load history from storage:", e), this.entries = [];
    }
  }
  saveHistory() {
    try {
      if (typeof localStorage > "u") return;
      localStorage.setItem(this.storageKey, JSON.stringify(this.entries));
    } catch (e) {
      console.warn("Failed to save history to storage:", e);
    }
  }
};
function Sx(e) {
  return new Jv(e);
}
var Qv = JSON, Q = {};
Q.JSOX = Q;
Q.version = "1.2.125";
var Zv = typeof BigInt == "function", mo = -1, ve = 0, vo = 1, go = 2, bo = 3, gt = 4, wo = 5, Ln = 6, So = 7, xo = 8, _o = 9, ko = 10, Ci = 12, Sr = 13, eg = [
  "ab",
  "u8",
  "cu8",
  "s8",
  "u16",
  "s16",
  "u32",
  "s32",
  "u64",
  "s64",
  "f32",
  "f64"
], Pi = null, xr = null, tg = [
  ArrayBuffer,
  Uint8Array,
  Uint8ClampedArray,
  Int8Array,
  Uint16Array,
  Int16Array,
  Uint32Array,
  Int32Array,
  null,
  null,
  Float32Array,
  Float64Array
], F = 0, Eo = 1, Co = 2, Po = 3, Ao = 5, To = 6, Mo = 7, Ro = 8, Oo = 9, Io = 10, No = 11, zo = 12, Lo = 13, $o = 14, Do = 15, Fo = 16, Wo = 17, Ho = 18, Bo = 19, Ai = 20, jo = 21, Ti = 22, Uo = 23, Vo = 24, qo = 25, Go = 26, Xo = 27, Yo = 28, Oe = 29, Qe = 30, he = 31, bc = 32, Se = 0, $t = 1, ot = 2, ft = 3, vn = 4, gn = 5, ng = 6, rg = {
  true: !0,
  false: !1,
  null: null,
  NaN: NaN,
  Infinity: 1 / 0,
  undefined: void 0
}, ll = class extends Date {
  constructor(e, t) {
    super(e), this.ns = t || 0;
  }
};
Q.DateNS = ll;
var zf = [];
function wc() {
  let e = zf.pop();
  return e || (e = {
    context: Se,
    current_proto: null,
    current_class: null,
    current_class_field: 0,
    arrayType: -1,
    valueType: ve,
    elements: null
  }), e;
}
function Mi(e) {
  zf.push(e);
}
Q.updateContext = function() {
};
var Lf = [];
function ig() {
  let e = Lf.pop();
  return e ? e.n = 0 : e = {
    buf: null,
    n: 0
  }, e;
}
function sg(e) {
  Lf.push(e);
}
Q.escape = function(e) {
  let t, n = "";
  if (!e) return e;
  for (t = 0; t < e.length; t++)
    (e[t] == '"' || e[t] == "\\" || e[t] == "`" || e[t] == "'") && (n += "\\"), n += e[t];
  return n;
};
var ue = /* @__PURE__ */ new WeakMap(), as = /* @__PURE__ */ new Map(), Rt = /* @__PURE__ */ new Map(), Sn = [];
Q.reset = function() {
  ue = /* @__PURE__ */ new WeakMap(), as = /* @__PURE__ */ new Map(), Rt = /* @__PURE__ */ new Map(), Sn = [];
};
Q.begin = function(e, t) {
  const n = {
    name: null,
    value_type: ve,
    string: "",
    contains: null,
    className: null
  }, r = {
    line: 1,
    col: 1
  };
  let i = 0, s, o = /* @__PURE__ */ new Map(), a = F, l = !0, c = !1, u = !1, d = null, p = null, f, h = {
    first: null,
    last: null,
    saved: null,
    push(z) {
      let $ = this.saved;
      $ ? (this.saved = $.next, $.node = z, $.next = null, $.prior = this.last) : $ = {
        node: z,
        next: null,
        prior: this.last
      }, this.last ? this.last.next = $ : this.first = $, this.last = $, this.length++;
    },
    pop() {
      let z = this.last;
      return (this.last = z.prior) || (this.first = null), z.next = this.saved, this.last && (this.last.next = null), z.next || (z.first = null), this.saved = z, this.length--, z.node;
    },
    length: 0
  }, y = [], b = {}, m = null, x = null, k = 0, v = -1, S = Se, M = 0, O = !1, re = !1, ie = !1, ye = !1, Me = !1, ke = {
    first: null,
    last: null,
    saved: null,
    push(z) {
      let $ = this.saved;
      $ ? (this.saved = $.next, $.node = z, $.next = null, $.prior = this.last) : $ = {
        node: z,
        next: null,
        prior: this.last
      }, this.last ? this.last.next = $ : this.first = $, this.last = $;
    },
    shift() {
      let z = this.first;
      return z ? ((this.first = z.next) || (this.last = null), z.next = this.saved, this.saved = z, z.node) : null;
    },
    unshift(z) {
      let $ = this.saved;
      this.saved = $.next, $.node = z, $.next = this.first, $.prior = null, this.first || (this.last = $), this.first = $;
    }
  }, Ee = null, ut = !1, Et = !1, Ue = !1, Ct = !1, hn = !1, Re = !1, Le = !1, oe = 0, ee = 0, K = !1, Ie = !1, Ve = !1;
  function rt(z) {
    throw new Error(`${z} at ${i} [${r.line}:${r.col}]`);
  }
  return {
    fromJSOX(z, $, _) {
      if (o.get(z)) throw new Error("Existing fromJSOX has been registered for prototype");
      function ce() {
      }
      if ($ || ($ = ce), $ && !("constructor" in $)) throw new Error("Please pass a prototype like thing...");
      o.set(z, {
        protoCon: $.prototype.constructor,
        cb: _
      });
    },
    registerFromJSOX(z, $) {
      throw new Error("registerFromJSOX is deprecated, please update to use fromJSOX instead:" + z + $.toString());
    },
    finalError() {
      M !== 0 && (M === 1 && rt("Comment began at end of document"), M === 3 && rt("Open comment '/*' is missing close at end of document"), M === 4 && rt("Incomplete '/* *' close at end of document")), ut && rt("Incomplete string");
    },
    value() {
      this.finalError();
      let z = d;
      return d = void 0, z;
    },
    reset() {
      a = F, l = !0, ke.last && (ke.last.next = ke.save), ke.save = ke.first, ke.first = ke.last = null, h.last && (h.last.next = h.save), h.length = 0, h.save = ke.first, h.first = h.last = null, f = void 0, S = Se, y = [], b = {}, m = null, x = null, k = 0, n.value_type = ve, n.name = null, n.string = "", n.className = null, r.line = 1, r.col = 1, u = !1, M = 0, K = !1, ut = !1, Ue = !1, Ct = !1, Ie = !1;
    },
    usePrototype(z, $) {
      b[z] = $;
    },
    write(z) {
      let $;
      if (typeof z != "string" && typeof z < "u" && (z = String(z)), !l) throw new Error("Parser is still in an error state, please reset before resuming");
      for ($ = this._write(z, !1); $ > 0 && (typeof t == "function" && (function _(ce, ae) {
        let Ne, I, se = ce[ae];
        if (se && typeof se == "object")
          for (Ne in se) Object.prototype.hasOwnProperty.call(se, Ne) && (I = _(se, Ne), I !== void 0 ? se[Ne] = I : delete se[Ne]);
        return t.call(ce, ae, se);
      })({ "": d }, ""), d = e(d), !($ < 2)); $ = this._write())
        ;
    },
    parse(z, $) {
      typeof z != "string" && (z = String(z)), this.reset();
      const _ = this._write(z, !0);
      if (_ > 0) {
        _ > 1;
        let ce = this.value();
        if (typeof ce > "u" && _ > 1) throw new Error("Pending value could not complete");
        return ce = typeof $ == "function" ? (function ae(Ne, I) {
          let se, Pt, Ce = Ne[I];
          if (Ce && typeof Ce == "object")
            for (se in Ce) Object.prototype.hasOwnProperty.call(Ce, se) && (Pt = ae(Ce, se), Pt !== void 0 ? Ce[se] = Pt : delete Ce[se]);
          return $.call(Ne, I, Ce);
        })({ "": ce }, "") : ce, ce;
      }
      this.finalError();
    },
    _write(z, $) {
      let _, ce, ae, Ne = 0;
      function I(E, P) {
        throw new Error(`${E} '${String.fromCodePoint(P)}' unexpected at ${i} (near '${ae.substr(i > 4 ? i - 4 : 0, i > 4 ? 3 : i - 1)}[${String.fromCodePoint(P)}]${ae.substr(i, 10)}') [${r.line}:${r.col}]`);
      }
      function se() {
        n.value_type = ve, n.string = "", n.contains = null;
      }
      function Pt() {
        let E = null;
        switch (n.value_type) {
          case wo:
            if ((n.string.length > 13 || n.string.length == 13 && n[0] > "2") && !Ie && !Me && !ye && !re && (Ve = !0), Ve) {
              if (Zv) return BigInt(n.string);
              throw new Error("no builtin BigInt()", 0);
            }
            if (Ie) {
              const P = n.string.match(/\.(\d\d\d\d*)/), N = P ? P[1] : null;
              if (!N || N.length < 4) {
                const le = new Date(n.string);
                return isNaN(le.getTime()) && I("Bad Date format", _), le;
              } else {
                let le = N.substr(3);
                for (; le.length < 6; ) le = le + "0";
                const ze = new ll(n.string, Number(le));
                return isNaN(ze.getTime()) && I("Bad DateNS format" + ze + ze.getTime(), _), ze;
              }
            }
            return (u ? -1 : 1) * Number(n.string);
          case gt:
            if (n.className) {
              if (E = o.get(n.className), E || (E = Rt.get(n.className)), E && E.cb)
                return n.className = null, E.cb.call(n.string);
              throw new Error("Double string error, no constructor for: new " + n.className + "(" + n.string + ")");
            }
            return n.string;
          case go:
            return !0;
          case bo:
            return !1;
          case So:
            return NaN;
          case xo:
            return NaN;
          case _o:
            return -1 / 0;
          case ko:
            return 1 / 0;
          case vo:
            return null;
          case mo:
            return;
          case Ci:
            return;
          case Ln:
            return n.className && (E = o.get(n.className), E || (E = Rt.get(n.className)), n.className = null, E && E.cb) ? n.contains = E.cb.call(n.contains) : n.contains;
          case Sr:
            if (v >= 0) {
              let P;
              if (n.contains.length ? P = _c(n.contains[0]) : P = _c(n.string), v === 0)
                return v = -1, P;
              {
                const N = new tg[v](P);
                return v = -1, N;
              }
            } else if (v === -2) {
              let P = p, N;
              const le = n.contains.length;
              for (N = 0; N < le; N++) {
                const ze = n.contains[N];
                let we = P[ze];
                if (!we) {
                  let $e = h.first, it = 0;
                  for (; $e && it < le && it < h.length; ) {
                    const pn = n.contains[it];
                    if (!$e.next || pn !== $e.next.node.name) break;
                    if ($e.next) if (typeof pn == "number") {
                      const $s = $e.next.node.elements;
                      if ($s && pn >= $s.length) if (it === h.length - 1) {
                        console.log("This is actually at the current object so use that", it, n.contains, f), we = f, it++, $e = $e.next;
                        break;
                      } else {
                        if ($e.next.next && pn === $s.length) {
                          we = $e.next.next.node.elements, $e = $e.next, it++, P = we;
                          continue;
                        }
                        we = f, it++;
                        break;
                      }
                    } else if (pn !== $e.next.node.name) {
                      we = $e.next.node.elements[pn], N = it;
                      break;
                    } else $e.next.next ? we = $e.next.next.node.elements : we = f;
                    else we = we[pn];
                    $e = $e.next, it++;
                  }
                  it < le ? N = it - 1 : N = it;
                }
                if (typeof we == "object" && !we) throw new Error("Path did not resolve properly:" + n.contains + " at " + ze + "(" + N + ")");
                P = we;
              }
              return v = -3, P;
            }
            return n.className && (E = o.get(n.className), E || (E = Rt.get(n.className)), n.className = null, E && E.cb) ? E.cb.call(n.contains) : n.contains;
          default:
            console.log("Unhandled value conversion.", n);
            break;
        }
      }
      function Ce() {
        if (v == -3) {
          n.value_type === Ln && f.push(n.contains), v = -1;
          return;
        }
        n.value_type === Ci ? (f.push(void 0), delete f[f.length - 1]) : f.push(Pt()), se();
      }
      function fe() {
        if (v === -3 && n.value_type === Sr) {
          se(), v = -1;
          return;
        }
        if (n.value_type === Ci) return;
        !n.name && x && (n.name = x.fields[k++]);
        let E = Pt();
        m && m.protoDef && m.protoDef.cb ? (E = m.protoDef.cb.call(f, n.name, E), E && (f[n.name] = E)) : f[n.name] = E, se();
      }
      function V(E) {
        if (a !== F) {
          switch (u && I("Negative outside of quotes, being converted to a string (would lose count of leading '-' characters)", E), a) {
            case he:
              switch (n.value_type) {
                case go:
                  n.string += "true";
                  break;
                case bo:
                  n.string += "false";
                  break;
                case vo:
                  n.string += "null";
                  break;
                case ko:
                  n.string += "Infinity";
                  break;
                case _o:
                  n.string += "-Infinity", I("Negative outside of quotes, being converted to a string", E);
                  break;
                case xo:
                  n.string += "NaN";
                  break;
                case So:
                  n.string += "-NaN", I("Negative outside of quotes, being converted to a string", E);
                  break;
                case mo:
                  n.string += "undefined";
                  break;
                case gt:
                  break;
                case ve:
                  break;
                default:
                  console.log("Value of type " + n.value_type + " is not restored...");
              }
              break;
            case Eo:
              n.string += "t";
              break;
            case Co:
              n.string += "tr";
              break;
            case Po:
              n.string += "tru";
              break;
            case Ao:
              n.string += "f";
              break;
            case To:
              n.string += "fa";
              break;
            case Mo:
              n.string += "fal";
              break;
            case Ro:
              n.string += "fals";
              break;
            case Oo:
              n.string += "n";
              break;
            case Io:
              n.string += "nu";
              break;
            case No:
              n.string += "nul";
              break;
            case zo:
              n.string += "u";
              break;
            case Lo:
              n.string += "un";
              break;
            case $o:
              n.string += "und";
              break;
            case Do:
              n.string += "unde";
              break;
            case Fo:
              n.string += "undef";
              break;
            case Wo:
              n.string += "undefi";
              break;
            case Ho:
              n.string += "undefin";
              break;
            case Bo:
              n.string += "undefine";
              break;
            case Ai:
              n.string += "N";
              break;
            case jo:
              n.string += "Na";
              break;
            case Ti:
              n.string += "I";
              break;
            case Uo:
              n.string += "In";
              break;
            case Vo:
              n.string += "Inf";
              break;
            case qo:
              n.string += "Infi";
              break;
            case Go:
              n.string += "Infin";
              break;
            case Xo:
              n.string += "Infini";
              break;
            case Yo:
              n.string += "Infinit";
              break;
            case F:
              break;
            case Oe:
              break;
            case Qe:
              break;
            case bc:
              I("String-keyword recovery fail (after whitespace)", E);
              break;
            default:
          }
          n.value_type = gt, a < Oe && (a = he);
        } else
          a = he, n.value_type = gt;
        if (E == 123) pl();
        else if (E == 91) yl();
        else if (E != 44) {
          if (E == 32 || E == 13 || E == 10 || E == 9 || E == 65279 || E == 8232 || E == 8233) return;
          E == 44 || E == 125 || E == 93 || E == 58 || (n.string += s);
        }
      }
      function zs(E) {
        let P = 0;
        for (; P == 0 && i < ae.length; ) {
          s = ae.charAt(i);
          let N = ae.codePointAt(i++);
          if (N >= 65536 && (s += ae.charAt(i), i++), r.col++, N == E) Ue ? (Le ? I("Incomplete hexidecimal sequence", N) : Re ? I("Incomplete long unicode sequence", N) : hn && I("Incomplete unicode sequence", N), Ct ? (Ct = !1, P = 1) : n.string += s, Ue = !1) : P = 1;
          else if (Ue) {
            if (hn) {
              if (N == 125) {
                n.string += String.fromCodePoint(oe), hn = !1, Re = !1, Ue = !1;
                continue;
              }
              if (oe *= 16, N >= 48 && N <= 57) oe += N - 48;
              else if (N >= 65 && N <= 70) oe += N - 65 + 10;
              else if (N >= 97 && N <= 102) oe += N - 97 + 10;
              else {
                I("(escaped character, parsing hex of \\u)", N), P = -1, hn = !1, Ue = !1;
                continue;
              }
              continue;
            } else if (Le || Re) {
              if (ee === 0 && N === 123) {
                hn = !0;
                continue;
              }
              if (ee < 2 || Re && ee < 4) {
                if (oe *= 16, N >= 48 && N <= 57) oe += N - 48;
                else if (N >= 65 && N <= 70) oe += N - 65 + 10;
                else if (N >= 97 && N <= 102) oe += N - 97 + 10;
                else {
                  I(Re ? "(escaped character, parsing hex of \\u)" : "(escaped character, parsing hex of \\x)", N), P = -1, Le = !1, Ue = !1;
                  continue;
                }
                ee++, Re ? ee == 4 && (n.string += String.fromCodePoint(oe), Re = !1, Ue = !1) : ee == 2 && (n.string += String.fromCodePoint(oe), Le = !1, Ue = !1);
                continue;
              }
            }
            switch (N) {
              case 13:
                Ct = !0, r.col = 1;
                continue;
              case 8232:
              case 8233:
                r.col = 1;
              case 10:
                Ct ? Ct = !1 : r.col = 1, r.line++;
                break;
              case 116:
                n.string += "	";
                break;
              case 98:
                n.string += "\b";
                break;
              case 110:
                n.string += `
`;
                break;
              case 114:
                n.string += "\r";
                break;
              case 102:
                n.string += "\f";
                break;
              case 118:
                n.string += "\v";
                break;
              case 48:
                n.string += "\0";
                break;
              case 120:
                Le = !0, ee = 0, oe = 0;
                continue;
              case 117:
                Re = !0, ee = 0, oe = 0;
                continue;
              default:
                n.string += s;
                break;
            }
            Ue = !1;
          } else N === 92 ? Ue ? (n.string += "\\", Ue = !1) : (Ue = !0, oe = 0, ee = 0) : (Ct && (Ct = !1, r.line++, r.col = 2), n.string += s);
        }
        return P;
      }
      function Ls() {
        let E;
        for (; (E = i) < ae.length; ) {
          s = ae.charAt(E);
          let P = ae.codePointAt(i++);
          if (P >= 256) {
            r.col -= i - E, i = E;
            break;
          } else {
            if (P == 95) continue;
            if (r.col++, P >= 48 && P <= 57)
              ie && (Me = !0), n.string += s;
            else if (P == 45 || P == 43) n.string.length == 0 || ie && !ye && !Me ? (P == 45 && !ie && (u = !u), n.string += s, ye = !0) : (u && (n.string = "-" + n.string, u = !1), n.string += s, Ie = !0);
            else if (P == 78) {
              if (a == F) {
                Et = !1, a = Ai;
                return;
              }
              I("fault while parsing number;", P);
              break;
            } else if (P == 73) {
              if (a == F) {
                Et = !1, a = Ti;
                return;
              }
              I("fault while parsing number;", P);
              break;
            } else if (P == 58 && Ie)
              u && (n.string = "-" + n.string, u = !1), n.string += s, Ie = !0;
            else if (P == 84 && Ie)
              u && (n.string = "-" + n.string, u = !1), n.string += s, Ie = !0;
            else if (P == 90 && Ie)
              u && (n.string = "-" + n.string, u = !1), n.string += s, Ie = !0;
            else if (P == 46) if (!re && !O && !ie)
              n.string += s, re = !0;
            else {
              l = !1, I("fault while parsing number;", P);
              break;
            }
            else if (P == 110) {
              Ve = !0;
              break;
            } else if (O && (P >= 95 && P <= 102 || P >= 65 && P <= 70)) n.string += s;
            else if (P == 120 || P == 98 || P == 111 || P == 88 || P == 66 || P == 79) if (!O && n.string == "0")
              O = !0, n.string += s;
            else {
              l = !1, I("fault while parsing number;", P);
              break;
            }
            else if (P == 101 || P == 69) if (!ie)
              n.string += s, ie = !0;
            else {
              l = !1, I("fault while parsing number;", P);
              break;
            }
            else if (P == 32 || P == 13 || P == 10 || P == 9 || P == 47 || P == 35 || P == 44 || P == 125 || P == 93 || P == 123 || P == 91 || P == 34 || P == 39 || P == 96 || P == 58) {
              r.col -= i - E, i = E;
              break;
            } else {
              $ && (l = !1, I("fault while parsing number;", P));
              break;
            }
          }
        }
        !$ && i == ae.length ? Et = !0 : (Et = !1, n.value_type = wo, S == Se && (K = !0));
      }
      function pl() {
        let E = ot, P = null, N = {};
        a > F && a < Oe && V(123);
        let le;
        if (le = ml(), S == Se) if (a == Oe || a == he && (le || n.string.length)) {
          if (le && le.protoDef && le.protoDef.protoCon && (N = new le.protoDef.protoCon()), !le || !le.protoDef && n.string) {
            if (P = y.find((we) => we.name === n.string), P)
              c ? (P.fields.length = 0, E = vn) : (N = new P.protoCon(), E = gn);
            else {
              let we = function() {
              };
              y.push(P = {
                name: n.string,
                protoCon: le && le.protoDef && le.protoDef.protoCon || we.constructor,
                fields: []
              }), E = vn;
            }
            c = !1;
          }
          x = P, a = F;
        } else a = Oe;
        else if (a == Oe || S === $t || S === ft || S == gn) if (a != F || n.value_type == gt) {
          if (le && le.protoDef) N = new le.protoDef.protoCon();
          else if (P = y.find((we) => we.name === n.string), P)
            E = gn, N = {};
          else {
            let we = function() {
            };
            o.set(n.string, {
              protoCon: we.prototype.constructor,
              cb: null
            }), N = new we();
          }
          a = F;
        } else a = F;
        else if (S == ot && a == F)
          return I("fault while parsing; getting field name unexpected ", _), l = !1, !1;
        let ze = wc();
        return n.value_type = Ln, S === Se ? f = N : S == $t ? (v == -1, n.name = f.length) : (S == ft || S == gn) && (!n.name && x && (n.name = x.fields[k++]), f[n.name] = N), ze.context = S, ze.elements = f, ze.name = n.name, ze.current_proto = m, ze.current_class = x, ze.current_class_field = k, ze.valueType = n.value_type, ze.arrayType = v, ze.className = n.className, n.className = null, n.name = null, m = le, x = P, k = 0, f = N, p || (p = f), h.push(ze), se(), S = E, !0;
      }
      function yl() {
        if (a > F && a < Oe && V(91), a == he && n.string.length) {
          let E = eg.findIndex((P) => P === n.string);
          a = F, E >= 0 ? (v = E, n.className = n.string, n.string = null) : n.string === "ref" ? (n.className = null, v = -2) : o.get(n.string) || Rt.get(n.string) ? n.className = n.string : I(`Unknown type '${n.string}' specified for array`, _);
        } else if (S == ot || a == Oe || a == Qe)
          return I("Fault while parsing; while getting field name unexpected", _), l = !1, !1;
        {
          let E = wc();
          n.value_type = Sr;
          let P = [];
          if (S == Se) f = P;
          else if (S == $t)
            v == -1 && f.push(P), n.name = f.length;
          else if (S == ft)
            if (n.name || (console.log("This says it's resolved......."), v = -3), m && m.protoDef) if (m.protoDef.cb) {
              const N = m.protoDef.cb.call(f, n.name, P);
              N !== void 0 && (P = f[n.name] = N);
            } else f[n.name] = P;
            else f[n.name] = P;
          E.context = S, E.elements = f, E.name = n.name, E.current_proto = m, E.current_class = x, E.current_class_field = k, E.valueType = n.value_type, E.arrayType = v == -1 ? -3 : v, E.className = n.className, v = -1, n.className = null, n.name = null, m = null, x = null, k = 0, f = P, p || (p = P), h.push(E), se(), S = $t;
        }
        return !0;
      }
      function ml() {
        const E = {
          protoDef: null,
          cls: null
        };
        return ((E.protoDef = o.get(n.string)) || (E.protoDef = Rt.get(n.string))) && (n.className || (n.className = n.string, n.string = null)), n.string && (E.cls = y.find((P) => P.name === n.string), !E.protoDef && E.cls), E.protoDef || E.cls ? E : null;
      }
      if (!l) return -1;
      for (z && z.length ? (ce = ig(), ce.buf = z, ke.push(ce)) : (Et && (Et = !1, n.value_type = wo, S == Se && (K = !0), Ne = 1), S !== Se && I("Unclosed object at end of stream.", _)); l && (ce = ke.shift()); ) {
        if (i = ce.n, ae = ce.buf, ut) {
          let E = zs(Ee);
          E < 0 ? l = !1 : E > 0 && (ut = !1, l && (n.value_type = gt));
        }
        for (Et && Ls(); !K && l && i < ae.length; ) {
          if (s = ae.charAt(i), _ = ae.codePointAt(i++), _ >= 65536 && (s += ae.charAt(i), i++), r.col++, M) {
            if (M == 1) if (_ == 42) M = 3;
            else {
              if (_ != 47) return I("fault while parsing;", _);
              M = 2;
            }
            else M == 2 ? (_ == 10 || _ == 13) && (M = 0) : M == 3 ? _ == 42 && (M = 4) : _ == 47 ? M = 0 : M = 3;
            continue;
          }
          switch (_) {
            case 35:
              M = 2;
              break;
            case 47:
              M = 1;
              break;
            case 123:
              pl();
              break;
            case 91:
              yl();
              break;
            case 58:
              if (S == gn)
                a = F, n.name = n.string, n.string = "", n.value_type = ve;
              else if (S == ot || S == vn) if (S == vn) {
                if (!Object.keys(f).length) {
                  console.log("This is a full object, not a class def...", n.className);
                  const E = () => {
                  };
                  o.set(h.last.node.current_class.name, {
                    protoCon: E.prototype.constructor,
                    cb: null
                  }), f = new E(), S = ft, n.name = n.string, a = F, n.string = "", n.value_type = ve, console.log("don't do default;s do a revive...");
                }
              } else
                a != F && a != he && a != Oe && a != Qe && V(32), a = F, n.name = n.string, n.string = "", S = S === ot ? ft : ng, n.value_type = ve;
              else if (S == Se) {
                console.log("Override colon found, allow class redefinition", S), c = !0;
                break;
              } else
                S == $t ? I("(in array, got colon out of string):parsing fault;", _) : S == ft ? I("String unexpected", _) : I("(outside any object, got colon out of string):parsing fault;", _), l = !1;
              break;
            case 125:
              if (a == he && (a = F), S == vn) if (x) {
                n.string && x.fields.push(n.string), se();
                let E = h.pop();
                S = Se, a = F, n.name = E.name, f = E.elements, x = E.current_class, k = E.current_class_field, v = E.arrayType, n.value_type = E.valueType, n.className = E.className, p = null, Mi(E);
              } else I("State error; gathering class fields, and lost the class", _);
              else if (S == ot || S == gn) {
                n.value_type != ve && (x && (n.name = x.fields[k++]), fe()), n.value_type = Ln, m && m.protoDef && (console.log("SOMETHING SHOULD AHVE BEEN REPLACED HERE??", m), console.log("The other version only revives on init"), f = new m.protoDef.cb(f, void 0, void 0)), n.contains = f, n.string = "";
                let E = h.pop();
                S = E.context, n.name = E.name, f = E.elements, x = E.current_class, m = E.current_proto, k = E.current_class_field, v = E.arrayType, n.value_type = E.valueType, n.className = E.className, Mi(E), S == Se && (K = !0);
              } else if (S == ft) {
                n.value_type === ve && (a == F ? I("Fault while parsing; unexpected", _) : V(_)), fe(), n.value_type = Ln, n.contains = f, a = F;
                let E = h.pop();
                S = E.context, n.name = E.name, f = E.elements, m = E.current_proto, x = E.current_class, k = E.current_class_field, v = E.arrayType, n.value_type = E.valueType, n.className = E.className, Mi(E), S == Se && (K = !0);
              } else
                I("Fault while parsing; unexpected", _), l = !1;
              u = !1;
              break;
            case 93:
              if (a >= Qe && (a = F), S == $t) {
                n.value_type != ve ? Ce() : a !== F && (V(_), Ce()), n.contains = f;
                {
                  let E = h.pop();
                  n.name = E.name, n.className = E.className, S = E.context, f = E.elements, m = E.current_proto, x = E.current_class, k = E.current_class_field, v = E.arrayType, n.value_type = E.valueType, Mi(E);
                }
                n.value_type = Sr, S == Se && (K = !0);
              } else
                I(`bad context ${S}; fault while parsing`, _), l = !1;
              u = !1;
              break;
            case 44:
              a < Qe && a != F && V(_), (a == he || a == Oe) && (a = F), S == vn ? x ? (x.fields.push(n.string), n.string = "", a = Oe) : I("State error; gathering class fields, and lost the class", _) : S == ot ? x ? (n.name = x.fields[k++], n.value_type != ve && (fe(), se())) : (n.string || n.value_type) && I("State error; comma in field name and/or lost the class", _) : S == gn ? (x ? (v != -3 && !n.name && (n.name = x.fields[k++]), n.value_type != ve && (v != -3 && fe(), se())) : n.value_type != ve && (fe(), se()), n.name = null) : S == $t ? (n.value_type == ve && (n.value_type = Ci), Ce(), se(), a = F) : S == ft && n.value_type != ve ? (S = ot, n.value_type != ve && (fe(), se()), a = F) : (l = !1, I("bad context; excessive commas while parsing;", _)), u = !1;
              break;
            default:
              switch (_) {
                default:
                  if (S == Se || S == ft && a == Oe || S == ot || a == Oe || S == vn) switch (_) {
                    case 96:
                    case 34:
                    case 39:
                      a == F || a == Oe ? (n.string.length && (console.log("IN ARRAY AND FIXING?"), n.className = n.string, n.string = ""), zs(_) ? n.value_type = gt : (Ee = _, ut = !0)) : I("fault while parsing; quote not at start of field name", _);
                      break;
                    case 10:
                      r.line++, r.col = 1;
                    case 13:
                    case 32:
                    case 8232:
                    case 8233:
                    case 9:
                    case 65279:
                      if (S === Se && a === he) {
                        a = F, S === Se && (K = !0);
                        break;
                      }
                      if (a === F || a === Qe) {
                        S == Se && n.value_type && (K = !0);
                        break;
                      } else if (a === Oe) {
                        if (S === Se) {
                          a = F, K = !0;
                          break;
                        }
                        n.string.length && console.log("STEP TO NEXT TOKEN."), a = Qe;
                      } else
                        l = !1, I("fault while parsing; whitepsace unexpected", _);
                      break;
                    default:
                      if (a == F && (_ >= 48 && _ <= 57 || _ == 43 || _ == 46 || _ == 45)) {
                        O = !1, ie = !1, Ie = !1, Ve = !1, ye = !1, Me = !1, re = !1, n.string = s, ce.n = i, Ls();
                        break;
                      }
                      if (a === Qe && (l = !1, I("fault while parsing; character unexpected", _)), a === F) {
                        a = Oe, n.value_type = gt, n.string += s;
                        break;
                      }
                      if (n.value_type == ve)
                        a !== F && a !== he && V(_);
                      else {
                        if (a === he || a === Oe) {
                          n.string += s;
                          break;
                        }
                        if (S == ot) {
                          if (a == Oe) {
                            n.string += s;
                            break;
                          }
                          I("Multiple values found in field name", _);
                        }
                        S == ft && I("String unexpected", _);
                      }
                      break;
                  }
                  else {
                    if (a == F && (_ >= 48 && _ <= 57 || _ == 43 || _ == 46 || _ == 45))
                      O = !1, ie = !1, Ie = !1, Ve = !1, ye = !1, Me = !1, re = !1, n.string = s, ce.n = i, Ls();
                    else if (n.value_type == ve) a != F ? V(_) : (a = he, n.string += s, n.value_type = gt);
                    else if (S == ot) I("Multiple values found in field name", _);
                    else if (S == ft)
                      n.value_type != gt && ((n.value_type == Ln || n.value_type == Sr) && I("String unexpected", _), V(_)), a == Qe ? ml() ? n.string = s : I("String unexpected", _) : a == he ? n.string += s : I("String unexpected", _);
                    else if (S == $t)
                      if (a == Qe) {
                        n.className || (n.className = n.string, n.string = ""), n.string += s;
                        break;
                      } else a == he && (n.string += s);
                    break;
                  }
                  break;
                case 96:
                case 34:
                case 39:
                  n.string && (n.className = n.string), n.string = "", zs(_) ? (n.value_type = gt, a = he) : (Ee = _, ut = !0);
                  break;
                case 10:
                  r.line++, r.col = 1;
                case 32:
                case 9:
                case 13:
                case 8232:
                case 8233:
                case 65279:
                  if (a == he) {
                    if (S == Se) {
                      a = F, K = !0;
                      break;
                    } else if (S == ft) {
                      a = bc;
                      break;
                    } else if (S == ot) {
                      a = Qe;
                      break;
                    } else if (S == $t) {
                      a = Qe;
                      break;
                    }
                  }
                  if (a == F || a == Qe) break;
                  a == Oe ? n.string.length && (a = Qe) : a < he && V(_);
                  break;
                case 116:
                  a == F ? a = Eo : a == Xo ? a = Yo : V(_);
                  break;
                case 114:
                  a == Eo ? a = Co : V(_);
                  break;
                case 117:
                  a == Co ? a = Po : a == Oo ? a = Io : a == F ? a = zo : V(_);
                  break;
                case 101:
                  a == Po ? (n.value_type = go, a = he) : a == Ro ? (n.value_type = bo, a = he) : a == $o ? a = Do : a == Ho ? a = Bo : V(_);
                  break;
                case 110:
                  a == F ? a = Oo : a == zo ? a = Lo : a == Wo ? a = Ho : a == Ti ? a = Uo : a == qo ? a = Go : V(_);
                  break;
                case 100:
                  a == Lo ? a = $o : a == Bo ? (n.value_type = mo, a = he) : V(_);
                  break;
                case 105:
                  a == Fo ? a = Wo : a == Vo ? a = qo : a == Go ? a = Xo : V(_);
                  break;
                case 108:
                  a == Io ? a = No : a == No ? (n.value_type = vo, a = he) : a == To ? a = Mo : V(_);
                  break;
                case 102:
                  a == F ? a = Ao : a == Do ? a = Fo : a == Uo ? a = Vo : V(_);
                  break;
                case 97:
                  a == Ao ? a = To : a == Ai ? a = jo : V(_);
                  break;
                case 115:
                  a == Mo ? a = Ro : V(_);
                  break;
                case 73:
                  a == F ? a = Ti : V(_);
                  break;
                case 78:
                  a == F ? a = Ai : a == jo ? (n.value_type = u ? So : xo, u = !1, a = he) : V(_);
                  break;
                case 121:
                  a == Yo ? (n.value_type = u ? _o : ko, u = !1, a = he) : V(_);
                  break;
                case 45:
                  a == F ? u = !u : V(_);
                  break;
                case 43:
                  a !== F && V(_);
                  break;
              }
              break;
          }
          if (K) {
            a == he && (a = F);
            break;
          }
        }
        if (i == ae.length ? (sg(ce), n.value_type == ve && $ && a != F && V(32), ut || Et || S == ot ? Ne = 0 : S == Se && (n.value_type != ve || d) && (K = !0, Ne = 1)) : (ce.n = i, ke.unshift(ce), Ne = 2), K) {
          p = null;
          break;
        }
      }
      return l ? (K && n.value_type != ve && (a = F, d = Pt(), u = !1, n.string = "", n.value_type = ve), K = !1, Ne) : -1;
    }
  };
};
var Ko = [Object.freeze(Q.begin())], Sc = 0;
Q.parse = function(e, t) {
  let n = Sc++, r;
  Ko.length <= n && Ko.push(Object.freeze(Q.begin())), r = Ko[n], typeof e != "string" && (e = String(e)), r.reset();
  const i = r._write(e, !0);
  if (i > 0) {
    i > 1;
    let s = r.value();
    if (typeof s > "u" && i > 1) throw new Error("Pending value could not complete");
    return s = typeof t == "function" ? (function o(a, l) {
      let c, u, d = a[l];
      if (d && typeof d == "object")
        for (c in d) Object.prototype.hasOwnProperty.call(d, c) && (u = o(d, c), u !== void 0 ? d[c] = u : delete d[c]);
      return t.call(a, l, d);
    })({ "": s }, "") : s, Sc--, s;
  }
  r.finalError();
};
function xc() {
  return this && this.valueOf();
}
Q.defineClass = function(e, t) {
  let n, r = Object.keys(t);
  for (let i = 1; i < r.length; i++) {
    let s, o;
    (s = r[i - 1]) > (o = r[i]) && (r[i - 1] = o, r[i] = s, i ? i -= 2 : i--);
  }
  Sn.push(n = {
    name: e,
    tag: r.toString(),
    proto: Object.getPrototypeOf(t),
    fields: Object.keys(t)
  });
  for (let i = 1; i < n.fields.length; i++) if (n.fields[i] < n.fields[i - 1]) {
    let s = n.fields[i - 1];
    n.fields[i - 1] = n.fields[i], n.fields[i] = s, i > 1 && (i -= 2);
  }
  n.proto === Object.getPrototypeOf({}) && (n.proto = null);
};
Q.registerToJSOX = function(e, t, n) {
  throw new Error("registerToJSOX deprecated; please use toJSOX:" + prototypeName + prototype.toString());
};
Q.toJSOX = function(e, t, n) {
  if (!t.prototype || t.prototype !== Object.prototype) {
    if (ue.get(t.prototype)) throw new Error("Existing toJSOX has been registered for prototype");
    ue.set(t.prototype, {
      external: !0,
      name: e || n.constructor.name,
      cb: n
    });
  } else {
    let r = Object.keys(t).toString();
    if (as.get(r)) throw new Error("Existing toJSOX has been registered for object type");
    as.set(r, {
      external: !0,
      name: e,
      cb: n
    });
  }
};
Q.fromJSOX = function(e, t, n) {
  function r() {
  }
  if (t || (t = r.prototype), Rt.get(e)) throw new Error("Existing fromJSOX has been registered for prototype");
  if (t && !("constructor" in t)) throw new Error("Please pass a prototype like thing...");
  Rt.set(e, {
    protoCon: t.prototype.constructor,
    cb: n
  });
};
Q.registerFromJSOX = function(e, t) {
  throw new Error("deprecated; please adjust code to use fromJSOX:" + e + t.toString());
};
Q.addType = function(e, t, n, r) {
  Q.toJSOX(e, t, n), Q.fromJSOX(e, t, r);
};
Q.registerToFrom = function(e, t) {
  throw new Error("registerToFrom deprecated; please use addType:" + e + t.toString());
};
Q.stringifier = function() {
  let e = [], t = '"', n = /* @__PURE__ */ new WeakMap();
  const r = [];
  let i = [];
  const s = /* @__PURE__ */ new WeakMap(), o = /* @__PURE__ */ new Map();
  let a = null;
  const l = [];
  let c = !1;
  function u(y) {
    return typeof y == "string" && y === "" ? '""' : typeof y == "number" && !isNaN(y) ? [
      "'",
      y.toString(),
      "'"
    ].join("") : y.includes("\uFEFF") || y in rg || /[0-9\-]/.test(y[0]) || /[\n\r\t #\[\]{}()<>\~!+*/.:,\-"'`]/.test(y) ? t + Q.escape(y) + t : y;
  }
  ue.get(Object.prototype) || (ue.set(Object.prototype, {
    external: !1,
    name: Object.prototype.constructor.name,
    cb: null
  }), ue.set(Date.prototype, {
    external: !1,
    name: "Date",
    cb: function() {
      if (this.getTime() === -621672192e5) return "0000-01-01T00:00:00.000Z";
      let y = -this.getTimezoneOffset(), b = y >= 0 ? "+" : "-", m = function(k) {
        let v = Math.floor(Math.abs(k));
        return (v < 10 ? "0" : "") + v;
      }, x = function(k) {
        let v = Math.floor(Math.abs(k));
        return (v < 100 ? "0" : "") + (v < 10 ? "0" : "") + v;
      };
      return [
        this.getFullYear(),
        "-",
        m(this.getMonth() + 1),
        "-",
        m(this.getDate()),
        "T",
        m(this.getHours()),
        ":",
        m(this.getMinutes()),
        ":",
        m(this.getSeconds()),
        "." + x(this.getMilliseconds()) + b,
        m(y / 60),
        ":",
        m(y % 60)
      ].join("");
    }
  }), ue.set(ll.prototype, {
    external: !1,
    name: "DateNS",
    cb: function() {
      let y = -this.getTimezoneOffset(), b = y >= 0 ? "+" : "-", m = function(v) {
        let S = Math.floor(Math.abs(v));
        return (S < 10 ? "0" : "") + S;
      }, x = function(v) {
        let S = Math.floor(Math.abs(v));
        return (S < 100 ? "0" : "") + (S < 10 ? "0" : "") + S;
      }, k = function(v) {
        let S = Math.floor(Math.abs(v));
        return (S < 1e5 ? "0" : "") + (S < 1e4 ? "0" : "") + (S < 1e3 ? "0" : "") + (S < 100 ? "0" : "") + (S < 10 ? "0" : "") + S;
      };
      return [
        this.getFullYear(),
        "-",
        m(this.getMonth() + 1),
        "-",
        m(this.getDate()),
        "T",
        m(this.getHours()),
        ":",
        m(this.getMinutes()),
        ":",
        m(this.getSeconds()),
        "." + x(this.getMilliseconds()) + k(this.ns) + b,
        m(y / 60),
        ":",
        m(y % 60)
      ].join("");
    }
  }), ue.set(Boolean.prototype, {
    external: !1,
    name: "Boolean",
    cb: xc
  }), ue.set(Number.prototype, {
    external: !1,
    name: "Number",
    cb: function() {
      return isNaN(this) ? "NaN" : isFinite(this) ? String(this) : this < 0 ? "-Infinity" : "Infinity";
    }
  }), ue.set(String.prototype, {
    external: !1,
    name: "String",
    cb: function() {
      return '"' + Q.escape(xc.apply(this)) + '"';
    }
  }), typeof BigInt == "function" && ue.set(BigInt.prototype, {
    external: !1,
    name: "BigInt",
    cb: function() {
      return this + "n";
    }
  }), ue.set(ArrayBuffer.prototype, {
    external: !0,
    name: "ab",
    cb: function() {
      return "[" + u(bt(this)) + "]";
    }
  }), ue.set(Uint8Array.prototype, {
    external: !0,
    name: "u8",
    cb: function() {
      return "[" + u(bt(this.buffer)) + "]";
    }
  }), ue.set(Uint8ClampedArray.prototype, {
    external: !0,
    name: "uc8",
    cb: function() {
      return "[" + u(bt(this.buffer)) + "]";
    }
  }), ue.set(Int8Array.prototype, {
    external: !0,
    name: "s8",
    cb: function() {
      return "[" + u(bt(this.buffer)) + "]";
    }
  }), ue.set(Uint16Array.prototype, {
    external: !0,
    name: "u16",
    cb: function() {
      return "[" + u(bt(this.buffer)) + "]";
    }
  }), ue.set(Int16Array.prototype, {
    external: !0,
    name: "s16",
    cb: function() {
      return "[" + u(bt(this.buffer)) + "]";
    }
  }), ue.set(Uint32Array.prototype, {
    external: !0,
    name: "u32",
    cb: function() {
      return "[" + u(bt(this.buffer)) + "]";
    }
  }), ue.set(Int32Array.prototype, {
    external: !0,
    name: "s32",
    cb: function() {
      return "[" + u(bt(this.buffer)) + "]";
    }
  }), ue.set(Float32Array.prototype, {
    external: !0,
    name: "f32",
    cb: function() {
      return "[" + u(bt(this.buffer)) + "]";
    }
  }), ue.set(Float64Array.prototype, {
    external: !0,
    name: "f64",
    cb: function() {
      return "[" + u(bt(this.buffer)) + "]";
    }
  }), ue.set(Float64Array.prototype, {
    external: !0,
    name: "f64",
    cb: function() {
      return "[" + u(bt(this.buffer)) + "]";
    }
  }), ue.set(RegExp.prototype, xr = {
    external: !0,
    name: "regex",
    cb: function(y, b) {
      return "'" + escape(this.source) + "'";
    }
  }), Rt.set("regex", {
    protoCon: RegExp,
    cb: function(y, b) {
      return new RegExp(this);
    }
  }), ue.set(Map.prototype, xr = {
    external: !0,
    name: "map",
    cb: null
  }), Rt.set("map", {
    protoCon: Map,
    cb: function(y, b) {
      if (y) {
        this.set(y, b);
        return;
      }
      return this;
    }
  }), ue.set(Array.prototype, Pi = {
    external: !1,
    name: Array.prototype.constructor.name,
    cb: null
  }));
  const d = {
    defineClass(y, b) {
      let m, x = Object.keys(b);
      for (let k = 1; k < x.length; k++) {
        let v, S;
        (v = x[k - 1]) > (S = x[k]) && (x[k - 1] = S, x[k] = v, k ? k -= 2 : k--);
      }
      e.push(m = {
        name: y,
        tag: x.toString(),
        proto: Object.getPrototypeOf(b),
        fields: Object.keys(b)
      });
      for (let k = 1; k < m.fields.length; k++) if (m.fields[k] < m.fields[k - 1]) {
        let v = m.fields[k - 1];
        m.fields[k - 1] = m.fields[k], m.fields[k] = v, k > 1 && (k -= 2);
      }
      m.proto === Object.getPrototypeOf({}) && (m.proto = null);
    },
    setDefaultObjectToJSOX(y) {
      a = y;
    },
    isEncoding(y) {
      return !!i.find((b, m) => b === y && m < i.length - 1);
    },
    encodeObject(y) {
      return a ? a.apply(y, [this]) : y;
    },
    stringify(y, b, m) {
      return h(y, b, m);
    },
    setQuote(y) {
      t = y;
    },
    registerToJSOX(y, b, m) {
      return this.toJSOX(y, b, m);
    },
    toJSOX(y, b, m) {
      if (b.prototype && b.prototype !== Object.prototype) {
        if (s.get(b.prototype)) throw new Error("Existing toJSOX has been registered for prototype");
        s.set(b.prototype, {
          external: !0,
          name: y || m.constructor.name,
          cb: m
        });
      } else {
        let x = Object.keys(b).toString();
        if (o.get(x)) throw new Error("Existing toJSOX has been registered for object type");
        o.set(x, {
          external: !0,
          name: y,
          cb: m
        });
      }
    },
    get ignoreNonEnumerable() {
      return c;
    },
    set ignoreNonEnumerable(y) {
      c = y;
    }
  };
  return d;
  function p(y) {
    if (y === null) return;
    let b = n.get(y);
    if (!b) {
      n.set(y, Qv.stringify(r));
      return;
    }
    return "ref" + b;
  }
  function f(y, b) {
    let m, x, k = Object.getPrototypeOf(y);
    if (x = e.find((v) => {
      if (v.proto && v.proto === k) return !0;
    }), x) return x;
    if (e.length || Sn.length) {
      if (b)
        b = b.map((v) => {
          if (typeof v == "string") return v;
        }), m = b.toString();
      else {
        let v = Object.keys(y);
        for (let S = 1; S < v.length; S++) {
          let M, O;
          (M = v[S - 1]) > (O = v[S]) && (v[S - 1] = O, v[S] = M, S ? S -= 2 : S--);
        }
        m = v.toString();
      }
      x = e.find((v) => {
        if (v.tag === m) return !0;
      }), x || (x = Sn.find((v) => {
        if (v.tag === m) return !0;
      }));
    }
    return x;
  }
  function h(y, b, m) {
    if (y === void 0) return "undefined";
    if (y === null) return;
    let x, k, v, S;
    const M = typeof m, O = typeof b;
    if (x = "", k = "", M === "number") for (S = 0; S < m; S += 1) k += " ";
    else M === "string" && (k = m);
    if (v = b, b && O !== "function" && (O !== "object" || typeof b.length != "number")) throw new Error("JSOX.stringify");
    r.length = 0, n = /* @__PURE__ */ new WeakMap();
    const re = ie("", { "": y });
    return Sn.length = 0, re;
    function ie(ye, Me) {
      var ke = x;
      const Ee = Pi.cb, ut = xr.cb;
      Pi.cb = Ue, xr.cb = Ct;
      const Et = hn(ye, Me);
      return Pi.cb = Ee, xr.cb = ut, Et;
      function Ue() {
        let Re, Le = [], oe = r.length;
        for (let ee = 0; ee < this.length; ee += 1)
          r[oe] = ee, Le[ee] = ie(ee, this) || "null";
        return r.length = oe, i.length = oe, Re = Le.length === 0 ? "[]" : x ? [
          `[
`,
          x,
          Le.join(`,
` + x),
          `
`,
          ke,
          "]"
        ].join("") : "[" + Le.join(",") + "]", Re;
      }
      function Ct() {
        let Re = { tmp: null }, Le = "{", oe = !0;
        for (let [ee, K] of this) {
          Re.tmp = K;
          let Ie = r.length;
          r[Ie] = ee, Le += (oe ? "" : ",") + u(ee) + ":" + ie("tmp", Re), r.length = Ie, oe = !1;
        }
        return Le += "}", Le;
      }
      function hn(Re, Le) {
        let oe, ee, K, Ie, Ve, rt, z = r.length, $ = !0, _ = Le[Re], ce = typeof _ == "object", ae;
        ce && _ !== null && a && (l.find((Ce) => Ce === _) || (l.push(_), i[z] = _, $ = !1, _ = a.apply(_, [d]), ce = typeof _ == "object", l.pop(), i.length = z, ce = typeof _ == "object"));
        const Ne = _ != null && Object.getPrototypeOf(_);
        let I = Ne && (s.get(Ne) || ue.get(Ne) || null), se = !I && _ !== void 0 && _ !== null && (o.get(Object.keys(_).toString()) || as.get(Object.keys(_).toString()) || null);
        typeof v == "function" && ($ = !1, _ = v.call(Le, Re, _));
        let Pt = I && I.cb || se && se.cb;
        if (_ != null && typeof _ == "object" && typeof Pt == "function") if (l.find((Ce) => Ce === _))
          K = p(_);
        else {
          if (typeof _ == "object" && (K = p(_), K))
            return K;
          l.push(_), i[z] = _, _ = Pt.call(_, d), $ = !1, l.pop(), I && I.name && typeof _ == "string" && _[0] !== "-" && (_[0] < "0" || _[0] > "9") && _[0] !== '"' && _[0] !== "'" && _[0] !== "`" && _[0] !== "[" && _[0] !== "{" && (_ = " " + _), i.length = z;
        }
        else if (typeof _ == "object" && (K = p(_), K))
          return K;
        switch (typeof _) {
          case "bigint":
            return _ + "n";
          case "string": {
            _ = $ ? u(_) : _;
            let fe = "";
            return Re === "" && (fe = e.map((V) => V.name + "{" + V.fields.join(",") + "}").join(x ? `
` : "") + Sn.map((V) => V.name + "{" + V.fields.join(",") + "}").join(x ? `
` : "") + (x ? `
` : "")), I && I.external ? fe + I.name + _ : se && se.external ? fe + se.name + _ : fe + _;
          }
          case "number":
          case "boolean":
          case "null":
            return String(_);
          case "object":
            if (K) return K;
            if (!_) return "null";
            if (x += k, Ve = null, rt = [], v && typeof v == "object") {
              for (Ie = v.length, Ve = f(_, v), oe = 0; oe < Ie; oe += 1) typeof v[oe] == "string" && (ee = v[oe], r[z] = ee, K = ie(ee, _), K !== void 0 && (Ve ? rt.push(K) : rt.push(u(ee) + (x ? ": " : ":") + K)));
              r.splice(z, 1);
            } else {
              Ve = f(_);
              let fe = [];
              for (ee in _)
                if (!(c && !Object.prototype.propertyIsEnumerable.call(_, ee)) && Object.prototype.hasOwnProperty.call(_, ee)) {
                  let V;
                  for (V = 0; V < fe.length; V++) if (fe[V] > ee) {
                    fe.splice(V, 0, ee);
                    break;
                  }
                  V == fe.length && fe.push(ee);
                }
              for (let V = 0; V < fe.length; V++)
                ee = fe[V], Object.prototype.hasOwnProperty.call(_, ee) && (r[z] = ee, K = ie(ee, _), K !== void 0 && (Ve ? rt.push(K) : rt.push(u(ee) + (x ? ": " : ":") + K)));
              r.splice(z, 1);
            }
            Re === "" ? ae = (e.map((fe) => fe.name + "{" + fe.fields.join(",") + "}").join(x ? `
` : "") || Sn.map((fe) => fe.name + "{" + fe.fields.join(",") + "}").join(x ? `
` : "")) + (x ? `
` : "") : ae = "", I && I.external && (ae = ae + u(I.name));
            let Ce = null;
            return Ve && (Ce = u(Ve.name)), K = ae + (rt.length === 0 ? "{}" : x ? (Ve ? Ce : "") + `{
` + x + rt.join(`,
` + x) + `
` + ke + "}" : (Ve ? Ce : "") + "{" + rt.join(",") + "}"), x = ke, K;
        }
      }
    }
  }
};
var Tt = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$_", Bt = {
  "~": -1,
  "=": -1,
  $: 62,
  _: 63,
  "+": 62,
  "-": 62,
  ".": 62,
  "/": 63,
  ",": 63
};
for (let e = 0; e < 64; e++) Bt[Tt[e]] = e;
Object.freeze(Bt);
function bt(e) {
  let t = "", n = new Uint8Array(e), r = n.byteLength, i = r % 3, s = r - i, o, a, l, c, u;
  for (let d = 0; d < s; d = d + 3)
    u = n[d] << 16 | n[d + 1] << 8 | n[d + 2], o = (u & 16515072) >> 18, a = (u & 258048) >> 12, l = (u & 4032) >> 6, c = u & 63, t += Tt[o] + Tt[a] + Tt[l] + Tt[c];
  return i == 1 ? (u = n[s], o = (u & 252) >> 2, a = (u & 3) << 4, t += Tt[o] + Tt[a] + "==") : i == 2 && (u = n[s] << 8 | n[s + 1], o = (u & 64512) >> 10, a = (u & 1008) >> 4, l = (u & 15) << 2, t += Tt[o] + Tt[a] + Tt[l] + "="), t;
}
function _c(e) {
  let t;
  e.length % 4 == 1 ? t = ((e.length + 3) / 4 | 0) * 3 - 3 : e.length % 4 == 2 ? t = ((e.length + 3) / 4 | 0) * 3 - 2 : e.length % 4 == 3 ? t = ((e.length + 3) / 4 | 0) * 3 - 1 : Bt[e[e.length - 3]] == -1 ? t = ((e.length + 3) / 4 | 0) * 3 - 3 : Bt[e[e.length - 2]] == -1 ? t = ((e.length + 3) / 4 | 0) * 3 - 2 : Bt[e[e.length - 1]] == -1 ? t = ((e.length + 3) / 4 | 0) * 3 - 1 : t = ((e.length + 3) / 4 | 0) * 3;
  let n = new ArrayBuffer(t), r = new Uint8Array(n), i, s = e.length + 3 >> 2;
  for (i = 0; i < s; i++) {
    let o = Bt[e[i * 4]], a = i * 4 + 1 < e.length ? Bt[e[i * 4 + 1]] : -1, l = a >= 0 && i * 4 + 2 < e.length ? Bt[e[i * 4 + 2]] : -1, c = l >= 0 && i * 4 + 3 < e.length ? Bt[e[i * 4 + 3]] : -1;
    a >= 0 && (r[i * 3 + 0] = o << 2 | a >> 4), l >= 0 && (r[i * 3 + 1] = a << 4 | l >> 2 & 15), c >= 0 && (r[i * 3 + 2] = l << 6 | c & 63);
  }
  return n;
}
Q.stringify = function(e, t, n) {
  return Q.stringifier().stringify(e, t, n);
};
[[
  0,
  256,
  [
    16767487,
    16739071,
    130048,
    3670016,
    0,
    16777208,
    16777215,
    8388607
  ]
]].map((e) => ({
  firstChar: e[0],
  lastChar: e[1],
  bits: e[2]
}));
var og = (e) => e ? e instanceof Map ? Array.from(e.entries()) : Array.isArray(e) ? e.map((t, n) => Array.isArray(t) && t.length === 2 ? t : [n, t]) : e instanceof Set ? Array.from(e.values()).map((t, n) => [n, t]) : typeof e == "object" ? Object.entries(e) : [] : [], ag = Object.prototype.hasOwnProperty, ls = (e) => !e || typeof e != "object" || Array.isArray(e) ? !1 : !(e instanceof Map) && !(e instanceof Set), Hi = (e, t) => {
  if (e && typeof e == "object") {
    if ("id" in e && e.id != null) return e.id;
    if ("key" in e && e.key != null) return e.key;
  }
  return t;
}, kc = (e, t, n) => {
  if (e != null) return e;
  const r = Hi(t);
  return r ?? n;
}, $f = (e, t) => {
  for (const n of Object.keys(t)) {
    const r = t[n], i = e[n];
    if (ls(i) && ls(r)) {
      $f(i, r);
      continue;
    }
    i !== r && (e[n] = r);
  }
  return e;
}, Ri = (e, t) => {
  if (e === t) return e;
  const n = t && typeof t == "object";
  return e instanceof Map && n || e instanceof Set && n || Array.isArray(e) && n ? (rn(e, t), e) : ls(e) && ls(t) ? ($f(e, t), e) : t;
}, rn = (e, t) => {
  if (!e || !t) return e;
  const n = og(t);
  if (!n.length) return e;
  if (e instanceof Set) {
    const r = /* @__PURE__ */ new Map();
    for (const s of e.values()) {
      const o = Hi(s);
      o != null && r.set(o, s);
    }
    const i = /* @__PURE__ */ new Set();
    for (const [s, o] of n) {
      const a = kc(s, o);
      if (a == null) {
        e.has(o) || e.add(o);
        continue;
      }
      const l = r.has(a), c = l ? r.get(a) : void 0;
      if (l) {
        const u = Ri(c, o);
        u !== c && (e.delete(c), e.add(u), r.set(a, u));
      } else
        e.add(o), r.set(a, o);
      i.add(a);
    }
    if (i.size) for (const s of Array.from(e.values())) {
      const o = Hi(s);
      o != null && !i.has(o) && e.delete(s);
    }
    return e;
  }
  if (e instanceof Map) {
    const r = new Map(n);
    for (const i of Array.from(e.keys())) r.has(i) || e.delete(i);
    for (const [i, s] of r.entries()) if (e.has(i)) {
      const o = e.get(i), a = Ri(o, s);
      a !== o && e.set(i, a);
    } else e.set(i, s);
    return e;
  }
  if (Array.isArray(e)) {
    const r = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new WeakMap();
    e.forEach((u, d) => {
      r.add(d);
      const p = Hi(u, d);
      p != null && !i.has(p) && i.set(p, d), u && typeof u == "object" && s.set(u, d);
    });
    const o = (u) => {
      if (u != null && r.has(u))
        return r.delete(u), u;
    }, a = () => {
      const u = r.values().next();
      if (u.done) return;
      const d = u.value;
      return r.delete(d), d;
    };
    let l = 0, c = 0;
    for (const [u, d] of n) {
      const p = kc(u, d, c++);
      let f = o(p != null ? i.get(p) : void 0);
      f == null && d && typeof d == "object" && (f = o(s.get(d))), f == null && (f = a());
      const h = f != null ? e[f] : void 0, y = h !== void 0 ? Ri(h, d) : d;
      l < e.length ? e[l] !== y && (e[l] = y) : e.push(y), l++;
    }
    for (; e.length > l; ) e.pop();
    return e;
  }
  if (typeof e == "object") {
    const r = new Set(n.map(([i]) => String(i)));
    for (const i of Object.keys(e)) r.has(i) || delete e[i];
    for (const [i, s] of n) {
      const o = String(i);
      if (ag.call(e, o)) {
        const a = e[o], l = Ri(a, s);
        l !== a && (e[o] = l);
      } else e[o] = s;
    }
    return e;
  }
  return e;
}, _r = (e, t = "id") => {
  if (e && (e instanceof Set || Array.isArray(e))) {
    const n = Array.from(e?.values?.() || []).map((r) => [r?.[t], r]).filter((r) => r?.[0] != null);
    return rn(e, new Map(n));
  }
  return e;
}, Oi = () => typeof chrome < "u" && chrome?.storage?.local, Jo = "__CWSP_UI_STATE_SAVE_BY_KEY_V1__", Df = () => {
  const e = globalThis;
  return e[Jo] instanceof Map || (e[Jo] = /* @__PURE__ */ new Map()), e[Jo];
}, xx = (e, t) => {
  const n = Df().get(e);
  typeof n == "function" && n(t);
}, _x = (e, t, n, r = (o) => Fi(o), i = "id", s = 6e3) => {
  let o = null;
  o = _r(t?.() || {}, i);
  let a = !Oi();
  if (Oi()) chrome.storage.local.get([e], (c) => {
    try {
      if (c[e]) {
        const u = n(Q.parse(c?.[e] || "{}"));
        rn(o, u), _r(o, i);
      }
    } finally {
      a = !0;
    }
  });
  else if (typeof localStorage < "u") {
    if (localStorage.getItem(e)) {
      const c = n(Q.parse(localStorage.getItem(e) || "{}"));
      rn(o, c), _r(o, i);
    } else localStorage.setItem(e, Q.stringify(r(o)));
    a = !0;
  }
  const l = (c) => {
    if (!a) return;
    const u = Q.stringify(r(_r(o, i)));
    Oi() ? chrome.storage.local.set({ [e]: u }) : typeof localStorage < "u" && localStorage.setItem(e, u);
  };
  if (Df().set(e, l), ps(l, s), typeof window < "u" && typeof document < "u") {
    const c = [
      T(document, "visibilitychange", (u) => {
        document.visibilityState === "hidden" && l(u);
      }),
      T(window, "beforeunload", (u) => l(u)),
      T(window, "pagehide", (u) => l(u)),
      T(window, "storage", (u) => {
        u.storageArea == localStorage && u.key == e && rn(o, n(Q.parse(u?.newValue || Q.stringify(r(_r(o, i))))));
      })
    ];
    J(o, Symbol.dispose, () => c.forEach((u) => u?.()));
  }
  if (Oi()) {
    const c = (u, d) => {
      if (d === "local" && u[e]) {
        const p = u[e].newValue;
        p && rn(o, n(Q.parse(p)));
      }
    };
    chrome.storage.onChanged.addListener(c);
  }
  if (o && typeof o == "object") try {
    Object.defineProperty(o, "$save", {
      value: l,
      configurable: !0,
      enumerable: !1,
      writable: !0
    });
  } catch {
    o.$save = l;
  }
  return o;
}, lg = class {
  recognition = null;
  isListening = !1;
  options;
  constructor(e = {}) {
    this.options = {
      language: "en-US",
      continuous: !1,
      interimResults: !1,
      maxAlternatives: 1,
      ...e
    }, this.initializeRecognition();
  }
  initializeRecognition() {
    const e = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!e) {
      console.warn("Speech recognition not supported in this browser");
      return;
    }
    this.recognition = new e(), this.recognition.lang = this.options.language, this.recognition.continuous = this.options.continuous, this.recognition.interimResults = this.options.interimResults, this.recognition.maxAlternatives = this.options.maxAlternatives;
  }
  isSupported() {
    return this.recognition !== null;
  }
  startListening() {
    return new Promise((e, t) => {
      if (!this.recognition) {
        t(/* @__PURE__ */ new Error("Speech recognition not supported"));
        return;
      }
      if (this.isListening) {
        t(/* @__PURE__ */ new Error("Already listening"));
        return;
      }
      let n = !1;
      const r = (i) => {
        if (!n) {
          n = !0, this.isListening = !1;
          try {
            this.recognition.stop();
          } catch {
          }
          i ? e(i) : t(/* @__PURE__ */ new Error("No speech detected"));
        }
      };
      this.recognition.onresult = (i) => {
        const s = String(i?.results?.[0]?.[0]?.transcript || "").trim();
        r(s || null);
      }, this.recognition.onerror = () => r(null), this.recognition.onend = () => r(null);
      try {
        this.isListening = !0, this.recognition.start();
      } catch (i) {
        this.isListening = !1, t(i);
      }
    });
  }
  stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch {
      }
      this.isListening = !1;
    }
  }
  getIsListening() {
    return this.isListening;
  }
  setLanguage(e) {
    this.options.language = e, this.recognition && (this.recognition.lang = e);
  }
  getAvailableLanguages() {
    return [
      "en-US",
      "en-GB",
      "en-AU",
      "en-CA",
      "en-IN",
      "en-IE",
      "es-ES",
      "es-US",
      "es-MX",
      "es-AR",
      "es-CO",
      "es-CL",
      "fr-FR",
      "fr-CA",
      "de-DE",
      "it-IT",
      "pt-BR",
      "pt-PT",
      "ru-RU",
      "ja-JP",
      "ko-KR",
      "zh-CN",
      "zh-TW",
      "ar-SA",
      "hi-IN",
      "nl-NL",
      "sv-SE",
      "no-NO",
      "da-DK",
      "fi-FI"
    ];
  }
  destroy() {
    this.stopListening(), this.recognition = null;
  }
};
async function kx(e = {}) {
  const { timeout: t = 1e4, ...n } = e, r = new lg(n);
  if (!r.isSupported())
    return console.warn("Speech recognition not supported"), null;
  try {
    const i = r.startListening(), s = new Promise((o, a) => {
      setTimeout(() => {
        r.stopListening(), a(/* @__PURE__ */ new Error("Speech recognition timeout"));
      }, t);
    });
    return await Promise.race([i, s]);
  } catch (i) {
    return console.warn("Speech recognition failed:", i), null;
  } finally {
    r.destroy();
  }
}
function Ex() {
  return !!window.SpeechRecognition || !!window.webkitSpeechRecognition;
}
async function Cx() {
  try {
    return (await navigator.mediaDevices.getUserMedia({ audio: !0 })).getTracks().forEach((e) => e.stop()), !0;
  } catch {
    return !1;
  }
}
var Ta = "ui-tabbed-box", Px = (e, t) => {
  (e || globalThis)?.addEventListener("paste", (n) => {
    if (da(n?.target, Ta)) {
      const r = n.clipboardData, i = r?.items, s = r?.files ?? [];
      (i || s && s?.length > 0) && (n.preventDefault(), n.stopPropagation()), r ? t(r) : navigator.clipboard?.read()?.then?.((o) => {
        o && o.length > 0 && t({
          items: o,
          files: s
        });
      }).catch((o) => (console.error("Failed to read clipboard:", o), null));
    }
  });
}, Ax = (e, t) => {
  e.addEventListener("dragover", (n) => {
    da(n?.target, Ta) && (n.preventDefault(), n.stopPropagation());
  }), e.addEventListener("drop", (n) => {
    if (da(n?.target, Ta)) {
      const r = n.dataTransfer, i = r?.files ?? [];
      (r?.items || i && i?.length > 0) && (n.preventDefault(), n.stopPropagation()), t(r);
    }
  });
}, cg = (e = typeof document < "u" ? document?.documentElement : null) => {
  if (!e) return () => {
  };
  const t = [w(0), w(0)];
  return t.push(Jc(sl((n) => {
    t[0].value = n.clientX, t[1].value = n.clientY;
  }, e))), (t[2]?.deref?.() ?? t[2]) && J(t, Symbol.dispose, t[2]?.deref?.() ?? t[2]), t;
}, Tx = (e) => {
  const t = Gt(!1), n = sl((r) => {
    const i = typeof document < "u" ? document.elementFromPoint(r.clientX, r.clientY) : null;
    t.value = i?.matches?.(e) ?? !1;
  });
  return n && J(t, Symbol.dispose, n), t;
}, Mx = (e = "data-tooltip") => {
  const t = Je(""), n = sl((r) => {
    const i = typeof document < "u" ? document.elementFromPoint(r.clientX, r.clientY) : null;
    t.value = i?.getAttribute?.(e)?.(`[${e}]`) ?? "";
  });
  return n && J(t, Symbol.dispose, n), t;
}, Ff = /* @__PURE__ */ Symbol.for("__extract"), ug = /* @__PURE__ */ Symbol.for("__element"), fg = {
  [/* @__PURE__ */ Symbol.for("__extract")](e) {
    return e.source;
  },
  get(e, t, n) {
    return t in e ? Reflect.get(e, t, n ?? e) : t == "value" ? (e?.currentTime ?? 0) / (e?.duration ?? 1) : t == An && (e instanceof ScrollTimeline || e instanceof ViewTimeline) ? (r, i) => {
      const s = () => {
        queueMicrotask(() => r((e?.currentTime ?? 0) / (e?.duration ?? 1), "value"));
      };
      if (e instanceof ScrollTimeline) {
        e?.source?.addEventListener?.("scroll", s);
        const o = new ResizeObserver((a) => a.forEach((l) => s?.()));
        return o.observe(e?.source, { box: "content-box" }), e?.source?.addEventListener?.("scroll", s), () => {
          o.disconnect(), e?.source?.removeEventListener?.("scroll", s);
        };
      } else if (e instanceof ViewTimeline) {
        const o = new IntersectionObserver((a) => a.forEach((l) => s?.()), e?.observerOptions ?? {
          root: e?.source?.offsetParent ?? document.documentElement,
          rootMargin: "0px",
          threshold: [
            0,
            0.1,
            0.2,
            0.3,
            0.4,
            0.5,
            0.6,
            0.7,
            0.8,
            0.9,
            1
          ]
        });
        return o.observe(e?.source), e?.source?.addEventListener?.("scroll", s), () => {
          o.disconnect(), e?.source?.removeEventListener?.("scroll", s);
        };
      }
    } : t == Ff ? e : t == ug || t == "element" ? e.source?.element ?? e.source : Reflect.get(e.source, t, n ?? e.source);
  },
  set(e, t, n, r) {
    return t in e ? Reflect.set(e, t, n, r ?? e) : e.source && Reflect.set(e.source, t, n, r ?? e.source), !0;
  },
  has(e, t) {
    return Reflect.has(e, t) || Reflect.has(e.source, t);
  },
  deleteProperty(e, t) {
    return t in e ? Reflect.deleteProperty(e, t) : e.source ? Reflect.deleteProperty(e.source, t) : !0;
  },
  ownKeys(e) {
    return [...Reflect.ownKeys(e), ...Reflect.ownKeys(e.source)];
  },
  getOwnPropertyDescriptor(e, t) {
    return {
      ...Reflect.getOwnPropertyDescriptor(e, t),
      ...Reflect.getOwnPropertyDescriptor(e.source, t)
    };
  },
  getPrototypeOf(e) {
    return Reflect.getPrototypeOf(e);
  },
  setPrototypeOf(e, t) {
    return Reflect.setPrototypeOf(e, t);
  },
  isExtensible(e) {
    return Reflect.isExtensible(e);
  },
  preventExtensions(e) {
    return Reflect.preventExtensions(e);
  }
}, dg = (e, t) => new Proxy(new ScrollTimeline({
  source: e?.element ?? e,
  axis: t
}), fg), hg = class {
  source;
  axis;
  timeline;
  anchor;
  constructor(e, t) {
    let n = e instanceof HTMLElement ? {} : e;
    e instanceof HTMLElement ? (this.source = e, this.axis = typeof t == "string" ? t : "inline") : (this.source = n?.source, this.axis = n?.axis ?? "inline", this.anchor = n?.anchorElement), this.timeline = dg(this.source, this.axis), typeof t != "string" && t?.useAnchor && !this.anchor && (this.anchor = wf(this.source));
  }
  get [Ff]() {
    return this.timeline?.source ?? this.source;
  }
  get [An]() {
    return (e, t) => {
      const n = () => {
        queueMicrotask(() => e((this.timeline?.currentTime ?? 0) / (this.timeline?.duration ?? 1), "value"));
      };
      return this.timeline?.addEventListener?.("scroll", n), () => this.timeline?.removeEventListener?.("scroll", n);
    };
  }
  get element() {
    const e = this.timeline?.source ?? this.source;
    return e?.element ?? e;
  }
  get value() {
    return this.progress;
  }
  get currentTime() {
    return this.timeline?.currentTime ?? 0;
  }
  get duration() {
    return this.timeline?.duration ?? 1;
  }
  get progress() {
    try {
      const e = this.source[["scrollWidth", "scrollHeight"][this.axis === "inline" ? 0 : 1]] - this.source[["clientWidth", "clientHeight"][this.axis === "inline" ? 0 : 1]], t = this.source[["scrollLeft", "scrollTop"][this.axis === "inline" ? 0 : 1]];
      return e > 0 ? t / e : 0;
    } catch {
      return 0;
    }
  }
  scrollTo(e, t = !0) {
    const n = this.source[["scrollWidth", "scrollHeight"][this.axis === "inline" ? 0 : 1]] - this.source[["clientWidth", "clientHeight"][this.axis === "inline" ? 0 : 1]], r = Math.max(0, Math.min(1, e)) * n;
    this.source.scrollTo({
      [["left", "top"][this.axis === "inline" ? 0 : 1]]: r,
      behavior: t ? "smooth" : "instant"
    });
  }
  scrollBy(e, t = !0) {
    this.source.scrollBy({
      [["left", "top"][this.axis === "inline" ? 0 : 1]]: e,
      behavior: t ? "smooth" : "instant"
    });
  }
  getScrollInfo() {
    const e = this.axis === "inline" ? 0 : 1;
    return {
      scrollSize: this.source[["scrollWidth", "scrollHeight"][e]],
      clientSize: this.source[["clientWidth", "clientHeight"][e]],
      scrollPos: this.source[["scrollLeft", "scrollTop"][e]],
      maxScroll: this.source[["scrollWidth", "scrollHeight"][e]] - this.source[["clientWidth", "clientHeight"][e]],
      progress: this.progress
    };
  }
}, pg = (e, t) => {
  if (typeof ScrollTimeline < "u") return new hg({
    source: e?.element ?? e,
    axis: t
  });
  const n = Ye(e), r = As(e, ["inline", "block"][t]), i = Ur(Qt(e, ["inline", "block"][t], "content-box"), (o) => o + ja(e, ["inline", "block"][t])), s = Ur(r, (o) => (o || 0) / (at(n)?.[["scrollWidth", "scrollHeight"][t]] - i?.value || 1));
  return W(i, (o) => (r?.value || 0) / (at(n)?.[["scrollWidth", "scrollHeight"][t]] - o || 1)), s;
}, yg = class {
  container;
  queries;
  activeQueries = /* @__PURE__ */ new Set();
  queryStates = /* @__PURE__ */ new Map();
  constructor(e = {}) {
    this.container = e.container || document.documentElement, this.queries = /* @__PURE__ */ new Map();
    const t = {
      mobile: "(max-width: 767px)",
      tablet: "(min-width: 768px) and (max-width: 1023px)",
      desktop: "(min-width: 1024px)",
      touch: "(hover: none) and (pointer: coarse)",
      hover: "(hover: hover) and (pointer: fine)",
      dark: "(prefers-color-scheme: dark)",
      light: "(prefers-color-scheme: light)",
      "reduced-motion": "(prefers-reduced-motion: reduce)",
      ...e.queries || {}
    };
    for (const [n, r] of Object.entries(t)) this.addQuery(n, r);
    e.defaultQuery && this.queries.has(e.defaultQuery) && this.activeQueries.add(e.defaultQuery);
  }
  addQuery(e, t) {
    const n = globalThis.matchMedia(t);
    this.queries.set(e, n), this.queryStates.set(e, w(n.matches ? 1 : 0)), n.addEventListener("change", (r) => {
      const i = this.queryStates.get(e);
      i && (i.value = r.matches ? 1 : 0), r.matches ? this.activeQueries.add(e) : this.activeQueries.delete(e);
    }), n.matches && this.activeQueries.add(e);
  }
  removeQuery(e) {
    this.queries.get(e) && (this.queries.delete(e), this.queryStates.delete(e), this.activeQueries.delete(e));
  }
  matches(e) {
    return this.activeQueries.has(e);
  }
  getState(e) {
    return this.queryStates.get(e);
  }
  getActiveQueries() {
    return Array.from(this.activeQueries);
  }
  onQueryChange(e, t) {
    const n = this.queryStates.get(e);
    return n ? W(n, (r) => t(r === 1)) : () => {
    };
  }
  destroy() {
    this.queries.clear(), this.queryStates.clear(), this.activeQueries.clear();
  }
}, mg = class {
  container;
  sizeRef = w(0);
  widthRef = w(0);
  heightRef = w(0);
  aspectRatioRef = w(0);
  resizeObserver;
  constructor(e) {
    this.container = e, this.updateSize(), typeof ResizeObserver < "u" ? (this.resizeObserver = new ResizeObserver(() => {
      this.updateSize();
    }), this.resizeObserver.observe(e)) : T(window, "resize", () => this.updateSize());
  }
  updateSize() {
    const e = this.container.getBoundingClientRect();
    this.widthRef.value = e.width, this.heightRef.value = e.height, this.sizeRef.value = Math.sqrt(e.width * e.height), this.aspectRatioRef.value = e.width / e.height;
  }
  get width() {
    return this.widthRef;
  }
  get height() {
    return this.heightRef;
  }
  get size() {
    return this.sizeRef;
  }
  get aspectRatio() {
    return this.aspectRatioRef;
  }
  destroy() {
    this.resizeObserver?.disconnect();
  }
};
function vg(e) {
  const t = new mg(e), n = new yg({ container: e }), r = {
    mobile: {
      thickness: 12,
      showOnHover: !1,
      autoHide: !1,
      fadeDelay: 0
    },
    tablet: {
      thickness: 10,
      showOnHover: !0,
      autoHide: !0,
      fadeDelay: 1e3
    },
    desktop: {
      thickness: 8,
      showOnHover: !0,
      autoHide: !0,
      fadeDelay: 1500
    }
  }, i = w(0), s = () => {
    n.matches("desktop") ? i.value = 2 : n.matches("tablet") ? i.value = 1 : i.value = 0;
  };
  return n.onQueryChange("desktop", s), n.onQueryChange("tablet", s), n.onQueryChange("mobile", s), s(), {
    sizeTracker: t,
    queryManager: n,
    configs: r,
    currentConfig: i,
    getCurrentConfig: () => {
      const o = i.value;
      return r[Object.keys(r)[o]];
    },
    destroy: () => {
      t.destroy(), n.destroy();
    }
  };
}
var Yt = {
  light: {
    trackColor: "rgba(0, 0, 0, 0.1)",
    thumbColor: "rgba(0, 0, 0, 0.3)",
    thumbHoverColor: "rgba(0, 0, 0, 0.5)",
    thumbActiveColor: "rgba(0, 0, 0, 0.7)",
    thickness: 8,
    borderRadius: 4,
    minThumbSize: 30,
    showOnHover: !0,
    autoHide: !0,
    fadeDelay: 1500,
    smoothScroll: !0,
    transitionDuration: 0.2,
    transitionEasing: "ease-out",
    focusOutlineColor: "#007acc",
    focusOutlineWidth: 2
  },
  dark: {
    trackColor: "rgba(255, 255, 255, 0.1)",
    thumbColor: "rgba(255, 255, 255, 0.3)",
    thumbHoverColor: "rgba(255, 255, 255, 0.5)",
    thumbActiveColor: "rgba(255, 255, 255, 0.7)",
    thickness: 8,
    borderRadius: 4,
    minThumbSize: 30,
    showOnHover: !0,
    autoHide: !0,
    fadeDelay: 1500,
    smoothScroll: !0,
    transitionDuration: 0.2,
    transitionEasing: "ease-out",
    focusOutlineColor: "#00aacc",
    focusOutlineWidth: 2
  },
  minimal: {
    trackColor: "transparent",
    thumbColor: "rgba(0, 0, 0, 0.2)",
    thumbHoverColor: "rgba(0, 0, 0, 0.4)",
    thumbActiveColor: "rgba(0, 0, 0, 0.6)",
    thickness: 6,
    borderRadius: 3,
    minThumbSize: 20,
    showOnHover: !0,
    autoHide: !0,
    fadeDelay: 1e3,
    smoothScroll: !0,
    transitionDuration: 0.15,
    transitionEasing: "ease-out",
    focusOutlineColor: "#666",
    focusOutlineWidth: 1
  },
  rounded: {
    trackColor: "rgba(0, 0, 0, 0.05)",
    thumbColor: "rgba(0, 0, 0, 0.3)",
    thumbHoverColor: "rgba(0, 0, 0, 0.5)",
    thumbActiveColor: "rgba(0, 0, 0, 0.7)",
    thickness: 10,
    borderRadius: 5,
    minThumbSize: 40,
    showOnHover: !0,
    autoHide: !0,
    fadeDelay: 2e3,
    smoothScroll: !0,
    transitionDuration: 0.3,
    transitionEasing: "ease-in-out",
    focusOutlineColor: "#007acc",
    focusOutlineWidth: 2
  },
  colorful: {
    trackColor: "rgba(255, 255, 255, 0.1)",
    thumbColor: "linear-gradient(45deg, #ff6b6b, #4ecdc4)",
    thumbHoverColor: "linear-gradient(45deg, #ff5252, #26d0ce)",
    thumbActiveColor: "linear-gradient(45deg, #ff3838, #00b8d4)",
    thickness: 12,
    borderRadius: 6,
    minThumbSize: 50,
    showOnHover: !0,
    autoHide: !1,
    fadeDelay: 0,
    smoothScroll: !0,
    transitionDuration: 0.4,
    transitionEasing: "cubic-bezier(0.4, 0, 0.2, 1)",
    focusOutlineColor: "#ff6b6b",
    focusOutlineWidth: 3
  }
}, gg = class {
  currentTheme;
  scrollbarElement;
  styleElement;
  constructor(e, t = Yt.light) {
    this.scrollbarElement = e, this.currentTheme = { ...t }, this.applyTheme();
  }
  setTheme(e) {
    if (typeof e == "string") {
      const t = Yt[e];
      t ? this.currentTheme = { ...t } : (console.warn(`Scrollbar theme "${e}" not found. Using light theme as fallback.`), this.currentTheme = { ...Yt.light });
    } else this.currentTheme = { ...e };
    this.applyTheme();
  }
  updateTheme(e) {
    this.currentTheme = {
      ...this.currentTheme,
      ...e
    }, this.applyTheme();
  }
  getCurrentTheme() {
    return { ...this.currentTheme };
  }
  applyTheme() {
    const e = this.currentTheme, t = {
      "--scrollbar-thickness": `${e.thickness}px`,
      "--scrollbar-border-radius": `${e.borderRadius}px`,
      "--scrollbar-min-thumb-size": `${e.minThumbSize}px`,
      "--scrollbar-track-color": e.trackColor,
      "--scrollbar-thumb-color": e.thumbColor,
      "--scrollbar-thumb-hover-color": e.thumbHoverColor,
      "--scrollbar-thumb-active-color": e.thumbActiveColor,
      "--scrollbar-transition-duration": `${e.transitionDuration}s`,
      "--scrollbar-transition-easing": e.transitionEasing,
      "--scrollbar-focus-outline-color": e.focusOutlineColor,
      "--scrollbar-focus-outline-width": `${e.focusOutlineWidth}px`
    };
    Object.entries(t).forEach(([n, r]) => {
      this.scrollbarElement.style.setProperty(n, r || "");
    }), this.scrollbarElement.setAttribute("data-scrollbar-autohide", e.autoHide ? "true" : "false"), this.scrollbarElement.setAttribute("data-scrollbar-hover", e.showOnHover ? "true" : "false"), this.scrollbarElement.setAttribute("data-scrollbar-smooth", e.smoothScroll ? "true" : "false"), e.customCSS ? (this.ensureStyleElement(), this.styleElement && (this.styleElement.textContent = e.customCSS)) : this.styleElement && (this.styleElement.textContent = "");
  }
  ensureStyleElement() {
    this.styleElement || (this.styleElement = document.createElement("style"), this.styleElement.setAttribute("data-scrollbar-theme", "custom"), document.head.appendChild(this.styleElement));
  }
  static light() {
    return Yt.light;
  }
  static dark() {
    return Yt.dark;
  }
  static minimal() {
    return Yt.minimal;
  }
  static rounded() {
    return Yt.rounded;
  }
  static colorful() {
    return Yt.colorful;
  }
  destroy() {
    this.styleElement && this.styleElement.parentNode && this.styleElement.parentNode.removeChild(this.styleElement);
  }
};
function Rx(e, t) {
  return `
        ${e} {
            --scrollbar-thickness: ${t.thickness}px;
            --scrollbar-border-radius: ${t.borderRadius}px;
            --scrollbar-min-thumb-size: ${t.minThumbSize}px;
            --scrollbar-track-color: ${t.trackColor};
            --scrollbar-thumb-color: ${t.thumbColor};
            --scrollbar-thumb-hover-color: ${t.thumbHoverColor};
            --scrollbar-thumb-active-color: ${t.thumbActiveColor};
            --scrollbar-transition-duration: ${t.transitionDuration}s;
            --scrollbar-transition-easing: ${t.transitionEasing};
            --scrollbar-focus-outline-color: ${t.focusOutlineColor};
            --scrollbar-focus-outline-width: ${t.focusOutlineWidth}px;
        }

        ${e}::-webkit-scrollbar {
            width: var(--scrollbar-thickness);
            height: var(--scrollbar-thickness);
        }

        ${e}::-webkit-scrollbar-track {
            background: var(--scrollbar-track-color);
            border-radius: var(--scrollbar-border-radius);
        }

        ${e}::-webkit-scrollbar-thumb {
            background: var(--scrollbar-thumb-color);
            border-radius: var(--scrollbar-border-radius);
            transition: background-color var(--scrollbar-transition-duration) var(--scrollbar-transition-easing);
        }

        ${e}::-webkit-scrollbar-thumb:hover {
            background: var(--scrollbar-thumb-hover-color);
        }

        ${e}::-webkit-scrollbar-thumb:active {
            background: var(--scrollbar-thumb-active-color);
        }

        ${e}[data-scrollbar-autohide="true"] {
            scrollbar-width: thin;
        }

        ${e}[data-scrollbar-autohide="true"]:not(:hover)::-webkit-scrollbar {
            width: 0;
            height: 0;
        }

        ${e}:focus {
            outline: var(--scrollbar-focus-outline-width) solid var(--scrollbar-focus-outline-color);
            outline-offset: 2px;
        }
    `;
}
var bg = class {
  element;
  options;
  isActive = !1;
  startTime = 0;
  startPosition = {
    x: 0,
    y: 0
  };
  currentPosition = {
    x: 0,
    y: 0
  };
  velocity = {
    x: 0,
    y: 0
  };
  lastPosition = {
    x: 0,
    y: 0
  };
  lastTime = 0;
  pointers = /* @__PURE__ */ new Map();
  initialDistance = 0;
  currentDistance = 0;
  onStart;
  onMove;
  onEnd;
  onMomentum;
  onSwipe;
  onPinch;
  momentumFrame;
  constructor(e, t = {}) {
    this.element = e, this.options = {
      enableMomentum: !0,
      momentumDecay: 0.95,
      minVelocity: 0.01,
      maxVelocity: 4,
      enablePinch: !1,
      pinchThreshold: 10,
      enableSwipe: !0,
      swipeThreshold: 50,
      touchAction: "none",
      ...t
    }, this.setupEventListeners(), this.element.style.touchAction = this.options.touchAction;
  }
  setupEventListeners() {
    const e = {
      pointerdown: this.handlePointerDown.bind(this),
      pointermove: this.handlePointerMove.bind(this),
      pointerup: this.handlePointerUp.bind(this),
      pointercancel: this.handlePointerCancel.bind(this),
      pointerleave: this.handlePointerCancel.bind(this)
    };
    kt(this.element, e);
  }
  handlePointerDown(e) {
    e.preventDefault(), this.pointers.set(e.pointerId, e), this.element.setPointerCapture(e.pointerId), this.pointers.size === 1 ? this.startGesture(e) : this.pointers.size === 2 && this.options.enablePinch && this.startPinch();
  }
  handlePointerMove(e) {
    e.preventDefault(), this.pointers.set(e.pointerId, e), this.pointers.size === 1 && this.isActive ? this.updateGesture(e) : this.pointers.size === 2 && this.options.enablePinch && this.updatePinch();
  }
  handlePointerUp(e) {
    e.preventDefault(), this.pointers.delete(e.pointerId), this.element.releasePointerCapture(e.pointerId), this.pointers.size === 0 && this.isActive && this.endGesture();
  }
  handlePointerCancel(e) {
    this.pointers.delete(e.pointerId), this.element.releasePointerCapture(e.pointerId), this.pointers.size === 0 && this.isActive && this.cancelGesture();
  }
  startGesture(e) {
    this.isActive = !0, this.startTime = performance.now(), this.lastTime = this.startTime, this.startPosition = {
      x: e.clientX,
      y: e.clientY
    }, this.currentPosition = { ...this.startPosition }, this.lastPosition = { ...this.startPosition }, this.velocity = {
      x: 0,
      y: 0
    }, this.onStart?.({
      startPosition: this.startPosition,
      timestamp: this.startTime
    });
  }
  updateGesture(e) {
    const t = performance.now(), n = t - this.lastTime;
    this.lastPosition = { ...this.currentPosition }, this.currentPosition = {
      x: e.clientX,
      y: e.clientY
    }, n > 0 && (this.velocity.x = (this.currentPosition.x - this.lastPosition.x) / n, this.velocity.y = (this.currentPosition.y - this.lastPosition.y) / n, this.velocity.x = Math.max(-this.options.maxVelocity, Math.min(this.options.maxVelocity, this.velocity.x)), this.velocity.y = Math.max(-this.options.maxVelocity, Math.min(this.options.maxVelocity, this.velocity.y))), this.lastTime = t, this.onMove?.({
      currentPosition: this.currentPosition,
      delta: {
        x: this.currentPosition.x - this.lastPosition.x,
        y: this.currentPosition.y - this.lastPosition.y
      },
      velocity: this.velocity,
      timestamp: t
    });
  }
  endGesture() {
    this.isActive = !1;
    const e = performance.now() - this.startTime, t = {
      x: this.currentPosition.x - this.startPosition.x,
      y: this.currentPosition.y - this.startPosition.y
    };
    if (this.options.enableSwipe && e < 500 && Math.hypot(t.x, t.y) > this.options.swipeThreshold) {
      const n = Math.atan2(t.y, t.x) * 180 / Math.PI;
      let r = "";
      n >= -45 && n < 45 ? r = "right" : n >= 45 && n < 135 ? r = "down" : n >= -135 && n < -45 ? r = "up" : r = "left";
      const i = Math.hypot(this.velocity.x, this.velocity.y);
      this.onSwipe?.(r, i);
    }
    this.options.enableMomentum && Math.hypot(this.velocity.x, this.velocity.y) > this.options.minVelocity && this.startMomentum(), this.onEnd?.({
      startPosition: this.startPosition,
      endPosition: this.currentPosition,
      totalDelta: t,
      velocity: this.velocity,
      duration: e
    });
  }
  cancelGesture() {
    this.isActive = !1, this.momentumFrame && (cancelAnimationFrame(this.momentumFrame), this.momentumFrame = void 0);
  }
  startPinch() {
    const e = Array.from(this.pointers.values()), t = e[0], n = e[1];
    this.initialDistance = Math.hypot(n.clientX - t.clientX, n.clientY - t.clientY);
  }
  updatePinch() {
    if (!this.options.enablePinch) return;
    const e = Array.from(this.pointers.values()), t = e[0], n = e[1];
    if (this.currentDistance = Math.hypot(n.clientX - t.clientX, n.clientY - t.clientY), Math.abs(this.currentDistance - this.initialDistance) > this.options.pinchThreshold) {
      const r = this.currentDistance / this.initialDistance, i = {
        x: (t.clientX + n.clientX) / 2,
        y: (t.clientY + n.clientY) / 2
      };
      this.onPinch?.(r, i);
    }
  }
  startMomentum() {
    let e = { ...this.velocity };
    const t = () => {
      e.x *= this.options.momentumDecay, e.y *= this.options.momentumDecay, Math.hypot(e.x, e.y) > this.options.minVelocity ? (this.onMomentum?.(e), this.momentumFrame = requestAnimationFrame(t)) : this.momentumFrame = void 0;
    };
    this.momentumFrame = requestAnimationFrame(t);
  }
  setCallbacks(e) {
    Object.assign(this, e);
  }
  destroy() {
    this.momentumFrame && cancelAnimationFrame(this.momentumFrame), Hn(this.element, [
      "pointerdown",
      "pointermove",
      "pointerup",
      "pointercancel",
      "pointerleave"
    ]), this.pointers.clear();
  }
}, wg = class extends bg {
  scrollbar;
  content;
  axis;
  scrollPosition = 0;
  constructor(e, t, n, r) {
    super(e, {
      enableMomentum: !0,
      enableSwipe: !1,
      enablePinch: !1,
      ...r
    }), this.scrollbar = e, this.content = t, this.axis = n, this.setCallbacks({
      onStart: this.handleGestureStart.bind(this),
      onMove: this.handleGestureMove.bind(this),
      onEnd: this.handleGestureEnd.bind(this),
      onMomentum: this.handleMomentum.bind(this)
    });
  }
  handleGestureStart(e) {
    this.scrollPosition = this.axis === "horizontal" ? this.content.scrollLeft : this.content.scrollTop;
  }
  handleGestureMove(e) {
    const t = this.axis === "horizontal" ? this.scrollbar.offsetWidth : this.scrollbar.offsetHeight, n = this.axis === "horizontal" ? this.content.scrollWidth : this.content.scrollHeight, r = this.axis === "horizontal" ? this.content.clientWidth : this.content.clientHeight;
    if (r >= n) return;
    const i = t * (r / n), s = (this.axis === "horizontal" ? e.delta.x : e.delta.y) / (t - i) * (n - r), o = Math.max(0, Math.min(n - r, this.scrollPosition + s));
    this.axis === "horizontal" ? this.content.scrollLeft = o : this.content.scrollTop = o;
  }
  handleGestureEnd(e) {
  }
  handleMomentum(e) {
    const t = this.axis === "horizontal" ? e.x : e.y, n = this.axis === "horizontal" ? this.scrollbar.offsetWidth : this.scrollbar.offsetHeight, r = this.axis === "horizontal" ? this.content.scrollWidth : this.content.scrollHeight, i = this.axis === "horizontal" ? this.content.clientWidth : this.content.clientHeight;
    if (i >= r) return;
    const s = t / (n - n * (i / r)) * (r - i);
    this.axis === "horizontal" ? this.content.scrollBy({
      left: s,
      behavior: "auto"
    }) : this.content.scrollBy({
      top: s,
      behavior: "auto"
    });
  }
}, Ec = [{
  name: "x",
  tName: "inline",
  cssScrollProperty: ["--scroll-left", "calc(var(--percent-x, 0) * max(calc(var(--scroll-size, 1) - var(--content-size, 1)), 0))"],
  cssPercentProperty: "--percent-x"
}, {
  name: "y",
  tName: "block",
  cssScrollProperty: ["--scroll-top", "calc(var(--percent-y, 0) * max(calc(var(--scroll-size, 1) - var(--content-size, 1)), 0))"],
  cssPercentProperty: "--percent-y"
}], Qo = ["clientX", "clientY"], Zo = (e) => e instanceof WeakRef || typeof e?.deref == "function" ? e : new WeakRef(e);
Wa();
var Ox = {
  fill: "both",
  delay: 0,
  easing: "linear",
  rangeStart: "cover 0%",
  rangeEnd: "cover 100%",
  duration: 1
};
try {
  CSS.registerProperty({
    name: "--percent-x",
    syntax: "<number>",
    inherits: !0,
    initialValue: "0"
  });
} catch {
}
try {
  CSS.registerProperty({
    name: "--percent-y",
    syntax: "<number>",
    inherits: !0,
    initialValue: "0"
  });
} catch {
}
try {
  CSS.registerProperty({
    name: "--scroll-coef",
    syntax: "<number>",
    inherits: !0,
    initialValue: "1"
  });
} catch {
}
try {
  CSS.registerProperty({
    name: "--determinant",
    syntax: "<number>",
    inherits: !0,
    initialValue: "0"
  });
} catch {
}
try {
  CSS.registerProperty({
    name: "--scroll-size",
    syntax: "<length-percentage>",
    inherits: !0,
    initialValue: "0px"
  });
} catch {
}
try {
  CSS.registerProperty({
    name: "--content-size",
    syntax: "<length-percentage>",
    inherits: !0,
    initialValue: "0px"
  });
} catch {
}
try {
  CSS.registerProperty({
    name: "--clamped-size",
    syntax: "<length-percentage>",
    inherits: !0,
    initialValue: "0px"
  });
} catch {
}
try {
  CSS.registerProperty({
    name: "--thumb-size",
    syntax: "<length-percentage>",
    inherits: !0,
    initialValue: "0px"
  });
} catch {
}
try {
  CSS.registerProperty({
    name: "--max-offset",
    syntax: "<length-percentage>",
    inherits: !0,
    initialValue: "0px"
  });
} catch {
}
try {
  CSS.registerProperty({
    name: "--max-size",
    syntax: "<length-percentage>",
    inherits: !0,
    initialValue: "0px"
  });
} catch {
}
var Cc = (e, t, n, r = 0, i = {}, s, o) => {
  const a = Zo(i), l = Zo(t), c = Zo(o), u = (f) => {
    const h = f, y = a?.deref?.();
    if (self && y?.pointerId == h.pointerId) {
      f?.preventDefault?.();
      const b = h[Qo[r]] || 0, m = b - y.point || 0, x = t?.[["scrollWidth", "scrollHeight"][r]] - t?.[["clientWidth", "clientHeight"][r]], k = n?.[["clientWidth", "clientHeight"][r]] - d?.[["offsetWidth", "offsetHeight"][r] || 0], v = m * x / k;
      y.point = b, l?.deref?.()?.scrollBy?.({
        [["left", "top"][r]]: v,
        behavior: "instant"
      });
    }
  }, d = n?.querySelector?.("*") ?? n, p = (f) => {
    const h = f, y = a?.deref?.();
    y && y?.pointerId == h.pointerId && (f?.preventDefault?.(), y.point = h[Qo[r]] || 0, c?.deref?.() && (c.deref().value = 0), (d?.element ?? h.target)?.releasePointerCapture?.(y.pointerId), y.pointerId = -1, Hn(d, {
      pointerup: p,
      pointermove: u,
      pointercancel: p
    }));
  };
  d && T(d, "pointerdown", (f) => {
    const h = f, y = a?.deref?.();
    self && y?.pointerId < 0 && (f?.preventDefault?.(), (d?.element ?? h.target)?.setPointerCapture?.(y.pointerId = h.pointerId || 0), c?.deref?.() && (c.deref().value = 1), y.point = h[Qo[r]] || 0, y.scroll = l?.deref?.()?.[["scrollLeft", "scrollTop"][r]] || 0, kt(d, {
      pointerup: p,
      pointermove: u,
      pointercancel: p
    }));
  });
}, Ix = class {
  scrollbar;
  content;
  status;
  holder;
  inputChange;
  layout;
  preferAutoHide;
  axis = 0;
  _thumbSyncCleanup;
  spatialAnchor;
  pointerAnchor;
  _spatialAnchorCleanup;
  _pointerAnchorCleanup;
  enhancedTimeline;
  isVisible = w(1);
  isDragging = w(0);
  thumbPosition = X(0, 0);
  thumbSize = X(20, 20);
  containerSize = X(0, 0);
  thumbTransform = new mf();
  scrollbarOpacity = w(1);
  responsiveConfig;
  _unsubscribeAutoHide;
  _unsubscribeAccessibility;
  gestureHandler;
  themeManager;
  constructor({ holder: e, scrollbar: t, content: n, inputChange: r, layout: i = "anchored", autoHide: s = !0 }, o = 0) {
    if (this.scrollbar = t, this.holder = e, this.content = n, this.status = {
      delta: 0,
      scroll: 0,
      point: 0,
      pointerId: -1
    }, this.inputChange = r, this.layout = i, this.preferAutoHide = s, this.axis = o, this.layout === "anchored") {
      this.scrollbarOpacity.value = 1, Cc(this.holder, this.content, this.scrollbar, o, this.status, this.inputChange, this.isDragging), this.bindThumbMetrics(o), this.setupAccessibility();
      return;
    }
    this.initializeResponsiveBehavior(), this.initializeGestureHandling(o), this.initializeTheming(), this.preferAutoHide ? this.setupAutoHideBehavior() : this.scrollbarOpacity.value = 1, this.setupAccessibility();
    const a = Ec[o], l = this.scrollbar, c = this.content ?? this.holder;
    l?.style?.setProperty(...a.cssScrollProperty, "");
    const u = { [a.cssPercentProperty]: [0, 1] };
    (this.enhancedTimeline = pg(c, o === 0 ? "inline" : "block")) && Vp(l, u, this.enhancedTimeline), Cc(this.holder, this.content, this.scrollbar, o, this.status, this.inputChange, this.isDragging), A(this.scrollbar, "--content-size", D.asPx(Bm(this.content, o, this.inputChange)), R), A(this.scrollbar, "--scroll-size", D.asPx(Hm(this.content, o, this.inputChange)), R), A(this.scrollbar, "opacity", this.scrollbarOpacity, R), A(this.scrollbar, "--is-dragging", this.isDragging, R), this.bindThumbMetrics(o), this.layout === "spatial" && this.initializeSpatialAwareness(o);
  }
  bindThumbMetrics(e) {
    const t = this.scrollbar.querySelector(".ui-thumb, .thumb, *") ?? null;
    if (!t) return;
    const n = Ec[e].cssPercentProperty;
    let r = 0;
    const i = () => {
      const c = this.scrollbar.getBoundingClientRect(), u = e === 0 ? c.width : c.height;
      return u > 0 ? u : e === 0 ? this.scrollbar.clientWidth : this.scrollbar.clientHeight;
    }, s = () => {
      const c = this.content[["scrollWidth", "scrollHeight"][e]] || 1, u = this.content[["clientWidth", "clientHeight"][e]] || 1, d = this.content[["scrollLeft", "scrollTop"][e]] || 0, p = Math.max(0, c - u), f = i();
      if (f <= 0) {
        r++ < 120 && requestAnimationFrame(s);
        return;
      }
      r = 0;
      const h = p <= 0 ? f : Math.max(20, u / c * f), y = Math.max(0, f - h), b = p <= 0 ? 0 : Math.min(1, Math.max(0, d / p));
      e === 0 ? (t.style.boxSizing = "border-box", t.style.width = `${h}px`, t.style.height = "100%", t.style.transform = `translate3d(${y * b}px, 0, 0)`, this.thumbSize.x.value = h) : (t.style.boxSizing = "border-box", t.style.height = `${h}px`, t.style.width = "100%", t.style.transform = `translate3d(0, ${y * b}px, 0)`, this.thumbSize.y.value = h), this.scrollbar.style.setProperty(n, String(b)), this.scrollbar.style.setProperty("--scroll-coef", String(p <= 0 ? 1 : u / c)), this.scrollbar.setAttribute("aria-valuenow", String(Math.round(b * 100)));
    }, o = () => s();
    this.content.addEventListener("scroll", o, { passive: !0 });
    const a = new ResizeObserver(() => s());
    a.observe(this.content), a.observe(this.scrollbar);
    const l = new MutationObserver(() => queueMicrotask(s));
    l.observe(this.content, {
      childList: !0,
      subtree: !0,
      characterData: !0
    }), queueMicrotask(s), requestAnimationFrame(s), this._thumbSyncCleanup = () => {
      this.content.removeEventListener("scroll", o), a.disconnect(), l.disconnect();
    };
  }
  initializeSpatialAwareness(e) {
    const t = Ts(this.content, {
      observeResize: !0,
      observeMutations: !0
    });
    Array.isArray(t) && (this.spatialAnchor = t);
    const n = cg(this.holder);
    Array.isArray(n) && (this.pointerAnchor = n.slice(0, 2), this._pointerAnchorCleanup = n[2]), this.spatialAnchor && W(this.spatialAnchor[e === 0 ? 2 : 3], () => {
      this.updateSpatialPosition(e);
    });
  }
  initializeResponsiveBehavior() {
    this.responsiveConfig = vg(this.holder), W(this.responsiveConfig.currentConfig, () => {
      const t = this.responsiveConfig.getCurrentConfig();
      this.updateScrollbarThickness(t.thickness);
    });
    const e = this.responsiveConfig.getCurrentConfig();
    this.updateScrollbarThickness(e.thickness);
  }
  updateScrollbarThickness(e) {
    this.scrollbar.style.setProperty("--scrollbar-thickness", `${e}px`), this.axis === 0 ? (!this.scrollbar.style.height || !this.scrollbar.style.height.includes("var(--scrollbar-thickness)")) && (this.scrollbar.style.height = `${e}px`) : (!this.scrollbar.style.width || !this.scrollbar.style.width.includes("var(--scrollbar-thickness)")) && (this.scrollbar.style.width = `${e}px`);
  }
  initializeGestureHandling(e) {
    this.gestureHandler = new wg(this.scrollbar, this.content, e === 0 ? "horizontal" : "vertical", {
      enableMomentum: !0,
      momentumDecay: 0.92,
      minVelocity: 0.1,
      maxVelocity: 3,
      touchAction: "none"
    }), this.gestureHandler.setCallbacks({
      onStart: (t) => {
        this.isDragging.value = 1;
      },
      onEnd: (t) => {
        this.isDragging.value = 0;
      }
    });
  }
  updateSpatialPosition(e) {
    if (!this.spatialAnchor || !this.scrollbar) return;
    const [t, n, r, i] = this.spatialAnchor;
    e === 0 ? this.scrollbar.offsetWidth : this.scrollbar.offsetHeight, e === 0 ? r.value : i.value, e === 0 ? (this.scrollbar.style.left = `${t.value}px`, this.scrollbar.style.top = `${n.value + i.value}px`, this.scrollbar.style.width = `${r.value}px`) : (this.scrollbar.style.left = `${t.value + r.value}px`, this.scrollbar.style.top = `${n.value}px`, this.scrollbar.style.height = `${i.value}px`);
  }
  setupAutoHideBehavior() {
    let e, t;
    const n = () => this.responsiveConfig?.getCurrentConfig() || {
      showOnHover: !0,
      autoHide: !0,
      fadeDelay: 1500
    }, r = () => {
      const o = n();
      o.autoHide && (this.scrollbarOpacity.value = 1, clearTimeout(e), e = globalThis.setTimeout(() => {
        this.isDragging.value === 0 && (this.scrollbarOpacity.value = 0);
      }, o.fadeDelay));
    }, i = () => {
      const o = n();
      o.autoHide && this.isDragging.value === 0 && (e = globalThis.setTimeout(() => {
        this.scrollbarOpacity.value = 0;
      }, o.fadeDelay));
    }, s = () => {
      const o = n();
      T(this.content, "scroll", r, { passive: !0 }), o.showOnHover && (T(this.scrollbar, "mouseenter", r), T(this.scrollbar, "mouseleave", i)), T(this.scrollbar, "focus", r), this.scrollbarOpacity.value = o.autoHide ? 0 : 1;
    };
    t = W(this.responsiveConfig.currentConfig, () => {
      s();
    }), s(), this._unsubscribeAutoHide = () => {
      t?.(), clearTimeout(e), Hn(this.content, ["scroll"]), Hn(this.scrollbar, [
        "mouseenter",
        "mouseleave",
        "focus"
      ]);
    };
  }
  setupAccessibility() {
    const e = (this.content.scrollWidth > this.content.clientWidth ? 0 : 1) == 0 ? "horizontal" : "vertical";
    this.content.id || (this.content.id = `scrollable-content-${Math.random().toString(36).substr(2, 9)}`), this.scrollbar.setAttribute("role", "scrollbar"), this.scrollbar.setAttribute("aria-controls", this.content.id), this.scrollbar.setAttribute("aria-orientation", e), this.scrollbar.setAttribute("tabindex", "0"), this.scrollbar.setAttribute("aria-label", `Scroll ${e}`);
    const t = document.createElement("div");
    t.setAttribute("aria-live", "polite"), t.setAttribute("aria-atomic", "true"), t.style.position = "absolute", t.style.left = "-10000px", t.style.width = "1px", t.style.height = "1px", t.style.overflow = "hidden", this.scrollbar.appendChild(t);
    const n = () => {
      const i = this.getScrollInfo();
      if (!i) return;
      const s = Math.round(i.progress * 100), o = 100, a = s;
      this.scrollbar.setAttribute("aria-valuenow", a.toString()), this.scrollbar.setAttribute("aria-valuemin", "0"), this.scrollbar.setAttribute("aria-valuemax", o.toString()), t.textContent = `Scrolled ${s}% ${e}`, this.scrollbar.setAttribute("aria-valuetext", `${s}% scrolled`);
    };
    n();
    const r = W(this.enhancedTimeline?.progress || w(0), n);
    T(this.content, "scroll", n, { passive: !0 }), T(this.scrollbar, "focus", () => {
      this.scrollbar.setAttribute("aria-expanded", "true"), this.scrollbarOpacity.value = 1;
    }), T(this.scrollbar, "blur", () => {
      this.scrollbar.setAttribute("aria-expanded", "false");
    }), this._unsubscribeAccessibility = () => {
      r?.(), xn(this.content, "scroll", n), xn(this.scrollbar, "keydown", () => {
      }), xn(this.scrollbar, "focus", () => {
      }), xn(this.scrollbar, "blur", () => {
      });
    };
  }
  initializeTheming() {
    this.themeManager = new gg(this.scrollbar);
  }
  setTheme(e) {
    return this.themeManager?.setTheme(e), this;
  }
  updateTheme(e) {
    return this.themeManager?.updateTheme(e), this;
  }
  getTheme() {
    return this.themeManager?.getCurrentTheme();
  }
  scrollTo(e, t = !0) {
    this.enhancedTimeline?.scrollTo(e, t);
  }
  scrollBy(e, t = !0) {
    this.enhancedTimeline?.scrollBy(e, t);
  }
  getScrollInfo() {
    return this.enhancedTimeline?.getScrollInfo();
  }
  destroy() {
    this._thumbSyncCleanup?.(), this._thumbSyncCleanup = void 0, this.spatialAnchor?.forEach((e) => {
      e && typeof e[Symbol.dispose] == "function" && e[Symbol.dispose]();
    }), this._pointerAnchorCleanup?.(), this.responsiveConfig?.destroy(), this._unsubscribeAutoHide?.(), this.gestureHandler?.destroy(), this._unsubscribeAccessibility?.(), this.themeManager?.destroy(), Hn(this.content, ["scroll"]), Hn(this.scrollbar, [
      "mouseenter",
      "mouseleave",
      "focus",
      "keydown"
    ]);
  }
}, Nx = (e) => Np(e, "badge-check", "badge"), zx = (e) => Ur(e, (t) => (parseFloat(t) || 0)?.toLocaleString?.("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 1
})), Wf = (e, t) => {
  const n = t ? new vf(t) : null, r = Uf(e);
  return g([r, n?.width || w(100)], () => {
    const i = n?.width.value || 100;
    return r.value * i;
  });
}, Lx = (e, t) => {
  const n = Wf(e, t);
  return new mf(), g([n], () => `translateX(${n.value}px)`);
}, $x = (e) => {
  const [t, n, r] = ur(e);
  if (e?.type == "number" || e?.type == "range") return (t - n) / (r - n);
  if (e?.type == "checkbox") return t ? 1 : 0;
  if (e?.type == "radio") {
    const i = [...e?.parentNode?.querySelectorAll?.('input[type="radio"]')], s = i?.length;
    return i.indexOf(e) / (s - 1);
  }
  return t;
}, Hf = (e, t, n) => {
  const r = (t?.[0]?.value || 0) / (n?.offsetWidth || 1), [i, s, o] = ur(e);
  return e?.type == "checkbox" ? Math.sign(t?.[0]?.value) : e?.type == "range" || e?.type == "number" ? r * (o - s) : e?.type == "radio" ? Math.round(r * o) : r;
}, Bf = (e, t) => {
  if (e?.type == "number" || e?.type == "range") return t;
  if (e?.type == "checkbox") return t > 0.5;
  if (e?.type == "radio") {
    const n = [...e?.parentNode?.querySelectorAll?.('input[type="radio"]')].length;
    return Math.max(Math.min(Math.round(t), n), 0);
  }
}, Sg = (e, t, n) => {
  const r = t / (n?.offsetWidth || 1), [i, s, o] = ur(e), a = r * (o - s) + s;
  return Bf(e, a);
}, xg = (e, t) => {
  const n = ur(e);
  return Bf(e, n?.[0] + t);
}, jf = (e, t) => {
  const [n, r, i] = ur(e);
  if (e?.type == "number" || e?.type == "range")
    t != e.valueAsNumber && (e.valueAsNumber = t, e?.dispatchEvent?.(new Event("change", { bubbles: !0 })));
  else if (e?.type == "checkbox") ln(e, t > 0.5);
  else if (e?.type == "radio") {
    const s = [...e?.parentNode?.querySelectorAll?.('input[type="radio"]')];
    t != 0 && ln(s[Math.max(Math.min(Math.round(t), i), r)], t);
  }
}, _g = (e, t) => jf(e, xg(e, t)), kg = (e, t, n) => jf(e, Sg(e, t, n)), Eg = (e, t, n) => {
  _g(e, Hf(e, t, n));
  try {
    t[0].value = 0, t[1].value = 0;
  } catch {
  }
  return [0, 0];
}, ur = (e) => {
  if ((e?.type == "number" || e?.type == "range") && e?.valueAsNumber != null) return [
    e?.valueAsNumber || 0,
    parseFloat(e?.min || 0),
    parseFloat(e?.max || 0)
  ];
  if (e?.type == "checkbox") return [
    e?.checked ? 1 : 0,
    0,
    1
  ];
  if (e?.type == "radio") {
    const t = [...e?.parentNode?.querySelectorAll?.('input[type="radio"]')], n = t?.length;
    return [
      t?.indexOf?.(e) ?? -1,
      0,
      n - 1
    ];
  }
  return [
    0,
    0,
    0
  ];
}, Cg = (e, t, n) => (e - t) / (n - t), Pc = (e) => Cg(...ur(e)), Uf = (e) => {
  const t = w(Pc(e));
  return ku?.(e, (r) => {
    t.value = Pc(r?.target ?? e);
  }), t;
}, Dx = (e, t, n) => {
  const r = { id: -1 }, i = () => {
    try {
      a[0].value = 0, a[1].value = 0;
    } catch {
    }
    return [0, 0];
  }, s = (p) => {
    const f = rl((b) => {
      e?.setPointerCapture?.(r.id = b?.pointerId), e?.setAttribute?.("data-dragging", "true"), i(), p?.(b, e);
    }, e), h = T(t, "pointerdown", f), y = T(e, "pointerdown", f);
    return o.push(h, y), h;
  }, o = [T(t, "click", (p) => {
    (n?.type == "checkbox" || n?.type == "radio") && ln(n, n?.checked, p);
  }), T(t, "pointerdown", (p) => {
    p?.target?.matches?.(".ui-thumb") || p?.target?.closest?.(".ui-thumb") || (p?.target == (t?.element ?? t) || t.contains(p?.target)) && kg(n, p?.layerX || 0, t);
  })], a = [w(0), w(0)], l = g([a[0]], () => `translateX(${a[0].value}px)`);
  Wf(n, t), tt.bindTransform(e, l), tt.bindTransform(t, l);
  const c = g([a[0]], (p) => Hf(n, a, t)), u = Uf(n);
  A?.(t, "--relate", c, R), A?.(t, "--value", u, R);
  const d = il(s, (p) => {
    e?.removeAttribute?.("data-dragging"), r.id >= 0 && (e?.releasePointerCapture?.(r.id), r.id = -1), Eg(n, p, t);
  }, a, i);
  return () => {
    o.forEach((p) => p?.()), d?.dispose?.();
  };
}, Pg = class {
  storageKey;
  templates = [];
  defaultTemplates;
  constructor(e = {}) {
    this.storageKey = e.storageKey || "rs-prompt-templates", this.defaultTemplates = e.defaultTemplates || this.getDefaultTemplates(), this.loadTemplates();
  }
  getAllTemplates() {
    return [...this.templates];
  }
  getTemplateById(e) {
    return this.templates.find((t) => t.id === e);
  }
  addTemplate(e) {
    const t = {
      ...e,
      id: this.generateId(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      usageCount: 0
    };
    return this.templates.push(t), this.saveTemplates(), t;
  }
  updateTemplate(e, t) {
    const n = this.templates.findIndex((r) => r.id === e);
    return n === -1 ? !1 : (this.templates[n] = {
      ...this.templates[n],
      ...t,
      updatedAt: Date.now()
    }, this.saveTemplates(), !0);
  }
  removeTemplate(e) {
    const t = this.templates.findIndex((n) => n.id === e);
    return t === -1 ? !1 : (this.templates.splice(t, 1), this.saveTemplates(), !0);
  }
  incrementUsageCount(e) {
    const t = this.templates.find((n) => n.id === e);
    t && (t.usageCount = (t.usageCount || 0) + 1, this.saveTemplates());
  }
  searchTemplates(e) {
    const t = e.toLowerCase();
    return this.templates.filter((n) => n.name.toLowerCase().includes(t) || n.prompt.toLowerCase().includes(t) || n.tags?.some((r) => r.toLowerCase().includes(t)));
  }
  getTemplatesByCategory(e) {
    return this.templates.filter((t) => t.category === e);
  }
  getMostUsedTemplates(e = 5) {
    return this.templates.sort((t, n) => (n.usageCount || 0) - (t.usageCount || 0)).slice(0, e);
  }
  exportTemplates() {
    return JSON.stringify(this.templates, null, 2);
  }
  importTemplates(e) {
    try {
      const t = JSON.parse(e);
      if (!Array.isArray(t)) throw new Error("Invalid template data: not an array");
      for (const r of t) if (!r.name || !r.prompt) throw new Error("Invalid template: missing name or prompt");
      const n = t.map((r) => ({
        ...r,
        id: this.generateId(),
        createdAt: r.createdAt || Date.now(),
        updatedAt: Date.now()
      }));
      return this.templates.push(...n), this.saveTemplates(), !0;
    } catch (t) {
      return console.error("Failed to import templates:", t), !1;
    }
  }
  resetToDefaults() {
    this.templates = this.defaultTemplates.map((e) => ({
      ...e,
      id: this.generateId(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      usageCount: 0
    })), this.saveTemplates();
  }
  createTemplateEditor(e, t) {
    const n = Pe`<div class="template-editor-modal">
      <div class="modal-overlay">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Prompt Templates</h3>
          </div>

          <div class="template-list">
            ${this.templates.map((r, i) => Pe`<div class="template-item">
                <div class="template-header">
                  <input type="text" class="template-name" value="${r.name}" data-index="${i}" placeholder="Template name">
                  <button class="btn small remove-template" data-index="${i}" title="Remove template">✕</button>
                </div>
                <textarea class="template-prompt" data-index="${i}" placeholder="Enter your prompt template...">${r.prompt}</textarea>
                <div class="template-meta">
                  ${r.usageCount ? Pe`<span class="usage-count">Used ${r.usageCount} times</span>` : ""}
                  ${r.category ? Pe`<span class="category">${r.category}</span>` : ""}
                </div>
              </div>`)}
          </div>

          <div class="modal-actions">
            <button class="btn" data-action="add-template">Add Template</button>
            <button class="btn" data-action="reset-defaults">Reset to Defaults</button>
            <button class="btn primary" data-action="save-templates">Save Changes</button>
            <button class="btn" data-action="close-editor">Close</button>
          </div>
        </div>
      </div>
    </div>`;
    n.addEventListener("click", (r) => {
      const i = r.target, s = i.getAttribute("data-action"), o = i.getAttribute("data-index");
      if (s === "add-template")
        this.addTemplate({
          name: "New Template",
          prompt: "Enter your prompt template here...",
          category: "Custom"
        }), n.remove(), this.createTemplateEditor(e, t);
      else if (s === "reset-defaults")
        confirm("Are you sure you want to reset all templates to defaults? This will remove all custom templates.") && (this.resetToDefaults(), n.remove(), this.createTemplateEditor(e, t));
      else if (s === "save-templates") {
        const a = n.querySelectorAll(".template-name"), l = n.querySelectorAll(".template-prompt");
        this.templates = Array.from(a).map((c, u) => {
          const d = parseInt(c.getAttribute("data-index") || "0");
          return {
            ...this.templates[d],
            name: c.value.trim() || "Untitled Template",
            prompt: l[u].value.trim() || "Enter your prompt...",
            updatedAt: Date.now()
          };
        }), this.saveTemplates(), n.remove(), t?.();
      } else if (s === "close-editor") n.remove();
      else if (i.classList.contains("remove-template") && o !== null) {
        const a = parseInt(o), l = this.templates[a];
        confirm(`Remove template "${l.name}"?`) && (this.removeTemplate(l.id), n.remove(), this.createTemplateEditor(e, t));
      }
    }), e.append(n);
  }
  createTemplateSelect(e) {
    const t = document.createElement("select");
    t.className = "template-select";
    const n = document.createElement("option");
    return n.value = "", n.textContent = "Select Template...", t.append(n), this.templates.forEach((r) => {
      const i = document.createElement("option");
      i.value = r.prompt, i.textContent = r.name, r.category && (i.textContent += ` (${r.category})`), t.append(i);
    }), e && (t.value = e), t;
  }
  getDefaultTemplates() {
    return [].map((e) => ({
      ...e,
      id: this.generateId(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      usageCount: 0
    }));
  }
  generateId() {
    return `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  loadTemplates() {
    try {
      const e = localStorage.getItem(this.storageKey);
      if (e) {
        const t = JSON.parse(e);
        this.templates = t.map((n) => ({
          ...n,
          id: n.id || this.generateId(),
          createdAt: n.createdAt || Date.now(),
          updatedAt: n.updatedAt || Date.now(),
          usageCount: n.usageCount || 0
        }));
      } else this.resetToDefaults();
    } catch (e) {
      console.warn("Failed to load templates from storage:", e), this.resetToDefaults();
    }
  }
  saveTemplates() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.templates));
    } catch (e) {
      console.warn("Failed to save templates to storage:", e);
    }
  }
};
function Fx(e) {
  return new Pg(e);
}
var Wx = () => {
  const e = fn("battery-charging"), t = navigator.getBattery?.(), n = /* @__PURE__ */ new Map([
    [0, "battery-warning"],
    [25, "battery"],
    [50, "battery-low"],
    [75, "battery-medium"],
    [100, "battery-full"]
  ]), r = (s = 1) => n.get(Math.max(Math.min(Math.round(s * 4) * 25, 100), 0)) || "battery", i = () => {
    let s = "battery-charging";
    t ? t?.then?.((o) => {
      o.charging ? s = "battery-charging" : s = r(o.level) || "battery", e.value = s;
    })?.catch?.(console.warn.bind(console)) : e.value = s;
  };
  return i(), ps(i, 1e3), t?.then?.((s) => {
    T(s, "chargingchange", i), T(s, "levelchange", i), i();
  }), e;
}, Hx = () => {
  const e = fn("00:00:00"), t = () => e.value = (/* @__PURE__ */ new Date()).toLocaleTimeString(navigator.language, {
    hour12: !1,
    timeStyle: "short"
  });
  return ps(t, 15e3), document.addEventListener("DOMContentLoaded", t, { once: !0 }), e;
}, Bx = () => {
  const e = fn("wifi-off"), t = () => e.value = n[navigator.onLine ? navigator?.connection?.effectiveType || "4g" : "offline"], n = {
    offline: "wifi-off",
    "4g": "wifi",
    "3g": "wifi-high",
    "2g": "wifi-low",
    "slow-2g": "wifi-zero"
  };
  return T(navigator.connection, "change", t), ps(t, 1e3), t?.(), e;
}, jx = () => {
  const e = document.createElement("canvas"), t = document.createElement("div");
  e.width = 1, e.height = 1, e.classList.add("u2-renderer"), e.classList.add("u2-implement"), t.classList.add("u2-fallback"), t.classList.add("u2-renderer"), t.style.inlineSize = "stretch", t.style.blockSize = "stretch", t.style.contain = "layout paint", t.style.containIntrinsicInlineSize = "1px", t.style.containIntrinsicBlockSize = "1px", t.style.maxInlineSize = "min(100cqi, 100dvi)", t.style.maxBlockSize = "min(100cqb, 100dvb)", t.style.pointerEvents = "auto", e.style.inlineSize = "stretch", e.style.blockSize = "stretch", e.style.objectFit = "contain", e.style.objectPosition = "center", e.style.imageRendering = "auto", e.style.imageRendering = "optimizeQuality", e.style.imageRendering = "smooth", e.style.imageRendering = "high-quality", e.style.contain = "layout paint", e.style.containIntrinsicInlineSize = "1px", e.style.containIntrinsicBlockSize = "1px", e.style.maxInlineSize = "min(100cqi, 100dvi)", e.style.maxBlockSize = "min(100cqb, 100dvb)", e.style.pointerEvents = "auto", e.layoutsubtree = !0, e.setAttribute("layoutsubtree", "true");
  const n = e?.getContext?.("2d");
  if (!n || n?.drawElement == null && n?.drawElementImage == null) return t;
  const r = n?.drawElementImage != null ? n?.drawElementImage?.bind?.(n) : n?.drawElement?.bind?.(n);
  if (r == null) return t;
  const i = (l) => {
    const c = l ?? e.children?.[0];
    if (c != null)
      try {
        n.setHitTestRegions([{
          element: c,
          rect: {
            x: 0,
            y: 0,
            width: c?.offsetWidth * devicePixelRatio,
            height: c?.offsetHeight * devicePixelRatio
          }
        }]);
      } catch (u) {
        console.warn(u);
      }
  }, s = Yd(), o = () => {
    const l = e.children?.[0];
    if (!(r == null || l == null || !e.checkVisibility() || e.dataset.dragging != null || e.closest?.("[data-dragging]") != null)) {
      n.reset(), n.save(), n.scale(devicePixelRatio || 1, devicePixelRatio || 1);
      try {
        r(l, 0, 0, e.width / devicePixelRatio, e.height / devicePixelRatio);
      } catch (c) {
        console.warn(c);
      }
      i(), n.restore();
    }
  }, a = new ResizeObserver((l) => {
    const c = l.find((p) => p.target === e), u = Math.min(c?.devicePixelContentBoxSize?.[0]?.inlineSize || e.width, (e?.offsetParent || document.documentElement)?.clientWidth * devicePixelRatio), d = Math.min(c?.devicePixelContentBoxSize?.[0]?.blockSize || e.height, (e?.offsetParent || document.documentElement)?.clientHeight * devicePixelRatio);
    u != e.width && (e.width = u), d != e.height && (e.height = d), (u != e.width || d != e.height) && s(o);
  });
  return queueMicrotask(() => {
    a.observe(e, {
      box: ["device-pixel-content-box"],
      fireOnEveryPaint: !0
    });
  }), (async () => {
    for (; ; )
      await new Promise((l) => requestAnimationFrame(l)), e.checkVisibility() && e.dataset.dragging == null && e.closest?.("[data-dragging]") == null && o();
  })(), e;
}, Fe = (e, t = 100) => typeof globalThis.requestIdleCallback == "function" ? globalThis.requestIdleCallback(e, { timeout: t }) : setTimeout(() => e({
  didTimeout: !1,
  timeRemaining: () => 0
}), 0), Ux = "electronBridge";
function Ag(e) {
  if (typeof e != "string") return null;
  let t = e.trim().toLowerCase();
  if (t === "transparent") return 0;
  if (t.startsWith("#")) {
    const i = t;
    if (i.length === 4 || i.length === 7) return 1;
    if (i.length === 5) {
      const s = i[4], o = s + s;
      return Ii(parseInt(o, 16) / 255, 0, 1);
    }
    if (i.length === 9) {
      const s = i.slice(7, 9);
      return Ii(parseInt(s, 16) / 255, 0, 1);
    }
    return null;
  }
  const n = t.match(/^([a-z-]+)\((.*)\)$/i);
  if (!n) return null;
  n[1];
  const r = n[2].trim();
  {
    const i = r.lastIndexOf("/");
    if (i !== -1) {
      const s = Ac(r.slice(i + 1).trim());
      return s != null ? Ii(s, 0, 1) : null;
    }
  }
  if (r.includes(",")) {
    const i = r.split(",").map((s) => s.trim());
    if (i.length >= 4) {
      const s = Ac(i[3]);
      return s != null ? Ii(s, 0, 1) : null;
    }
    return 1;
  }
  return 1;
}
function Ac(e) {
  if (!e) return null;
  if (e.endsWith("%")) {
    const n = parseFloat(e);
    return Number.isNaN(n) ? null : n / 100;
  }
  const t = parseFloat(e);
  return Number.isNaN(t) ? null : t;
}
function Ii(e, t, n) {
  return Math.min(n, Math.max(t, e));
}
var Jn = (e) => !e || e == null ? 0 : (Ag?.(e) || 0) > 0.1, cl = (e, t = 1e3, ...n) => {
  Fe(async () => {
    if (!(!e || typeof e != "function"))
      for (; ; )
        await Promise.try(e, ...n), await new Promise((r) => setTimeout(r, t)), await new Promise((r) => Fe(r, 100)), await new Promise((r) => requestAnimationFrame(r));
  }, 1e3);
}, Tg = () => {
  if (typeof document > "u") return null;
  try {
    const e = document.querySelectorAll("[data-shell]");
    for (const t of e) {
      const n = t.shadowRoot;
      if (!n) continue;
      const r = n.querySelector(".app-shell__nav, .app-shell__toolbar");
      if (!r) continue;
      const i = getComputedStyle(r).backgroundColor;
      if (Jn(i)) return i;
    }
  } catch {
  }
  return null;
}, Mg = () => {
  if (typeof document > "u" || !globalThis.matchMedia?.("(display-mode: window-controls-overlay)")?.matches) return null;
  const e = document.createElement("div");
  e.setAttribute("data-wco-theme-probe", "true"), e.style.cssText = [
    "position:fixed",
    "visibility:hidden",
    "pointer-events:none",
    "z-index:-2147483648",
    "left:env(titlebar-area-x,0px)",
    "top:env(titlebar-area-y,0px)",
    "width:env(titlebar-area-width,0px)",
    "height:env(titlebar-area-height,0px)"
  ].join(";"), document.documentElement.appendChild(e);
  try {
    const t = e.getBoundingClientRect();
    if (t.width < 1 || t.height < 1) return null;
    const n = Math.floor(t.left + Math.min(40, t.width * 0.2)), r = Math.floor(t.top + t.height * 0.5), i = cs(n, r);
    return Jn(i) ? i : null;
  } finally {
    e.remove();
  }
}, cs = (e, t, n = null) => {
  const r = Array.from(document.elementsFromPoint(e, t))?.filter?.((i) => i instanceof HTMLElement && i != n && (i?.dataset?.alpha != null ? parseFloat(i?.dataset?.alpha) > 0.01 : !0) && i?.checkVisibility?.({
    contentVisibilityAuto: !0,
    opacityProperty: !0,
    visibilityProperty: !0
  }) && i?.matches?.(":not([data-hidden])") && i?.style?.getPropertyValue("display") != "none").map((i) => {
    const s = getComputedStyle?.(i);
    return {
      element: i,
      zIndex: parseInt(s?.zIndex || "0", 10) || 0,
      color: s?.backgroundColor || "transparent"
    };
  }).sort((i, s) => Math.sign(s.zIndex - i.zIndex)).filter(({ color: i }) => Jn(i));
  return r?.[0]?.element instanceof HTMLElement && r?.[0]?.color || "transparent";
}, Ma = (e) => {
  const t = e?.getBoundingClientRect();
  if (t) {
    const n = 0.5 * (oh?.() || 1), r = [(t.left + t.right) * n, (t.top + t.bottom) * n];
    return cs(...r, e);
  }
}, Vf = (e = document.documentElement) => {
  let t = e?.querySelector?.("meta[data-theme-color]") ?? e?.querySelector?.('meta[name="theme-color"]');
  !t && e == document.documentElement && (t = document.createElement("meta"), t.setAttribute("name", "theme-color"), t.setAttribute("data-theme-color", ""), t.setAttribute("content", "transparent"), document.head.appendChild(t));
  try {
    const o = !!globalThis?.__CWSP_NATIVE_THEME_COLOR_OWNED__, a = document.querySelector("ui-window[native-mode]:not([minimized])") || document.querySelector("ui-window[data-desk-max]:not([minimized]), ui-window[maximized]:not([minimized]), ui-window[data-mobile-max]:not([minimized])");
    if (o || a) {
      if (o) return;
      if (a?.shadowRoot && e == document.documentElement) {
        const l = a.shadowRoot.querySelector(".title-handler"), c = l && getComputedStyle(l).getPropertyValue("--ui-win-titlebar-bg").trim() || getComputedStyle(a).getPropertyValue("--ui-win-titlebar-bg").trim() || getComputedStyle(document.documentElement).getPropertyValue("--color-surface-container").trim(), u = l ? getComputedStyle(l).backgroundColor : "", d = (u && Jn(u) ? u : null) || (c && Jn(c) ? c : null);
        if (d) {
          const p = String(d).toLowerCase();
          !/#007acc\b/.test(p) && !/rgba?\(\s*0\s*,\s*122\s*,\s*204/.test(p) && t?.setAttribute?.("content", d);
          return;
        }
      }
      return;
    }
  } catch {
  }
  const n = Tg(), r = n ? null : Mg(), i = !n && !r ? (() => {
    try {
      const o = getComputedStyle(document.documentElement).getPropertyValue("--color-surface-container").trim();
      return o && Jn(o) ? o : null;
    } catch {
      return null;
    }
  })() : null, s = n || r || i;
  s && s !== "transparent" && (t || window?.electronBridge) && e == document.documentElement && t?.setAttribute?.("content", s);
}, Ra = (e = document.documentElement) => {
  e.querySelectorAll("body, body > *, body > * > *").forEach((t) => {
    t && Ma(t);
  });
}, Rg = (e = document.documentElement) => {
  const t = "__LURE_DYNAMIC_THEME_STARTED__";
  if (globalThis?.[t]) return;
  globalThis[t] = !0, matchMedia("(prefers-color-scheme: dark)").addEventListener("change", ({}) => Ra(e));
  const n = () => {
    Vf(e), Ra(e);
  };
  T(e, "u2-appear", () => Fe(n, 100)), T(e, "u2-hidden", () => Fe(n, 100)), T(e, "u2-theme-change", () => Fe(n, 100)), T(window, "load", () => Fe(n, 100)), T(document, "visibilitychange", () => Fe(n, 100)), cl(n, 500);
}, Vx = (e, t, n = document.documentElement, r = 500) => {
  const i = Je(cs(e, t, n)), s = () => {
    const o = cs(e, t, n);
    i.value = o;
  };
  return T(n, "u2-appear", () => Fe(s, 100)), T(n, "u2-hidden", () => Fe(s, 100)), T(n, "u2-theme-change", () => Fe(s, 100)), T(window, "load", () => Fe(s, 100)), T(document, "visibilitychange", () => Fe(s, 100)), cl(s, r), i;
}, qx = (e, t = document.documentElement, n = 500) => {
  const r = Je(Ma(e)), i = () => {
    const s = Ma(e);
    r.value = s;
  };
  return T(t, "u2-appear", () => Fe(i, 100)), T(t, "u2-hidden", () => Fe(i, 100)), T(t, "u2-theme-change", () => Fe(i, 100)), T(window, "load", () => Fe(i, 100)), T(document, "visibilitychange", () => Fe(i, 100)), cl(i, n), r;
}, Og = async () => {
  Vf(), Ra();
}, Ig = () => {
  typeof document > "u" || globalThis?.__LURE_AUTO_THEME_ENGINE__ === !0 && (requestAnimationFrame(() => Og?.()), Rg?.());
};
Ig();
var Gx = async (e = null) => {
  const t = nf("--primary", e);
  e != null && t.value != e && (t.value = e);
  const n = String(t.value || e || "").trim();
  return Cs(document.documentElement, { style: {
    "--primary": t,
    ...n ? {
      "--color-primary": n,
      "--base-color": n,
      "--wf-md-primary": n,
      "--wf-md-seed": n
    } : {}
  } }), n && document.dispatchEvent(new CustomEvent("u2-theme-change", { detail: {
    source: "style-rules",
    primary: n
  } })), [t];
};
var G = /* @__PURE__ */ (function(e) {
  return e.GET = "get", e.SET = "set", e.CALL = "call", e.APPLY = "apply", e.CONSTRUCT = "construct", e.DELETE = "delete", e.DELETE_PROPERTY = "deleteProperty", e.HAS = "has", e.OWN_KEYS = "ownKeys", e.GET_OWN_PROPERTY_DESCRIPTOR = "getOwnPropertyDescriptor", e.GET_PROPERTY_DESCRIPTOR = "getPropertyDescriptor", e.GET_PROTOTYPE_OF = "getPrototypeOf", e.SET_PROTOTYPE_OF = "setPrototypeOf", e.IS_EXTENSIBLE = "isExtensible", e.PREVENT_EXTENSIONS = "preventExtensions", e.TRANSFER = "transfer", e.IMPORT = "import", e.DISPOSE = "dispose", e;
})({}), Ng = {
  ws: "websocket",
  socket: "websocket",
  socketio: "socket-io",
  service: "service-worker",
  sw: "service-worker",
  "service-worker-client": "service-worker",
  "service-worker-host": "service-worker",
  "ring-buffer": "atomics"
};
function zg(e) {
  const t = String(e ?? "").trim().toLowerCase();
  return t ? Ng[t] ?? t : "internal";
}
function Lg(e) {
  return typeof e == "string" ? zg(e) : typeof Worker < "u" && e instanceof Worker ? "worker" : typeof SharedWorker < "u" && e instanceof SharedWorker ? "shared-worker" : typeof MessagePort < "u" && e instanceof MessagePort ? "message-port" : typeof BroadcastChannel < "u" && e instanceof BroadcastChannel ? "broadcast" : typeof WebSocket < "u" && e instanceof WebSocket ? "websocket" : typeof RTCDataChannel < "u" && e instanceof RTCDataChannel ? "rtc-data" : typeof chrome < "u" && e && typeof e == "object" && typeof e.postMessage == "function" && e.onMessage?.addListener ? "chrome-port" : "internal";
}
var qf = class {
  _unsubscribe;
  _closed = !1;
  constructor(e) {
    this._unsubscribe = e;
  }
  get closed() {
    return this._closed;
  }
  unsubscribe() {
    this._closed || (this._closed = !0, this._unsubscribe());
  }
}, $g = class {
  _producer;
  constructor(e) {
    this._producer = e;
  }
  subscribe(e, t) {
    const n = typeof e == "function" ? { next: e } : e ?? {}, r = new AbortController();
    t?.signal?.addEventListener("abort", () => r.abort());
    let i = !0, s;
    const o = () => {
      i = !1, r.abort(), s?.();
    }, a = {
      next: (l) => i && n.next?.(l),
      error: (l) => {
        i && (n.error?.(l), o());
      },
      complete: () => {
        i && (n.complete?.(), o());
      },
      signal: r.signal,
      get active() {
        return i && !r.signal.aborted;
      }
    };
    try {
      s = this._producer(a);
    } catch (l) {
      a.error(l);
    }
    return new qf(o);
  }
  pipe(...e) {
    return e.reduce((t, n) => n(t), this);
  }
}, He = class {
  _subs = /* @__PURE__ */ new Set();
  _buffer = [];
  _maxBuffer;
  _replay;
  constructor(e = {}) {
    this._maxBuffer = e.bufferSize ?? 0, this._replay = e.replayOnSubscribe ?? !1;
  }
  next(e) {
    this._maxBuffer > 0 && (this._buffer.push(e), this._buffer.length > this._maxBuffer && this._buffer.shift());
    for (const t of this._subs) try {
      t.next?.(e);
    } catch (n) {
      t.error?.(n);
    }
  }
  error(e) {
    for (const t of this._subs) t.error?.(e);
  }
  complete() {
    for (const e of this._subs) e.complete?.();
    this._subs.clear();
  }
  subscribe(e) {
    const t = typeof e == "function" ? { next: e } : e;
    if (this._subs.add(t), this._replay) for (const n of this._buffer) try {
      t.next?.(n);
    } catch (r) {
      t.error?.(r);
    }
    return new qf(() => {
      this._subs.delete(t);
    });
  }
  getValue() {
    return this._buffer.at(-1);
  }
  getBuffer() {
    return [...this._buffer];
  }
  get subscriberCount() {
    return this._subs.size;
  }
}, Dg = (e) => (t) => new $g((n) => {
  const r = t.subscribe({
    next: (i) => e(i) && n.next(i),
    error: (i) => n.error(i),
    complete: () => n.complete()
  });
  return () => r.unsubscribe();
});
function Gf() {
  if (typeof globalThis.Deno < "u") return "deno";
  if (typeof globalThis.process < "u" && globalThis.process?.versions?.node) return "node";
  const e = globalThis.ServiceWorkerGlobalScope, t = globalThis.SharedWorkerGlobalScope, n = globalThis.DedicatedWorkerGlobalScope;
  if (e && self instanceof e) return "service-worker";
  if (t && self instanceof t) return "shared-worker";
  if (n && self instanceof n) return "worker";
  if (typeof chrome < "u" && chrome.runtime?.id) {
    if (typeof chrome.runtime.getBackgroundPage == "function" || chrome.runtime.getManifest?.()?.background?.service_worker) return "chrome-background";
    if (typeof chrome.devtools < "u") return "chrome-devtools";
    if (typeof document < "u" && globalThis?.location?.protocol === "chrome-extension:" && (chrome.extension?.getViews?.({ type: "popup" }) ?? []).includes(globalThis))
      return "chrome-popup";
    if (typeof document < "u" && globalThis?.location?.protocol !== "chrome-extension:") return "chrome-content";
  }
  return typeof globalThis < "u" && typeof document < "u" ? "window" : "unknown";
}
function Tc(e) {
  if (typeof RTCDataChannel < "u" && e instanceof RTCDataChannel) return "rtc-data";
  const t = Lg(e);
  return t && t !== "internal" ? t : e === self || e === globalThis || e === "self" ? "self" : "internal";
}
function Fg(e) {
  if (!e) return "unknown";
  if (e.contextType) return e.contextType;
  const t = e.sender ?? "";
  return t.includes("worker") ? "worker" : t.includes("sw") || t.includes("service") ? "service-worker" : t.includes("chrome") || t.includes("crx") ? "chrome-content" : t.includes("background") ? "chrome-background" : "unknown";
}
var Wg = {
  get: (e, t) => Reflect.get(e, t),
  set: (e, t, n) => Reflect.set(e, t, n),
  has: (e, t) => Reflect.has(e, t),
  apply: (e, t, n) => Reflect.apply(e, t, n),
  construct: (e, t) => Reflect.construct(e, t),
  deleteProperty: (e, t) => Reflect.deleteProperty(e, t),
  ownKeys: (e) => Reflect.ownKeys(e),
  getOwnPropertyDescriptor: (e, t) => Reflect.getOwnPropertyDescriptor(e, t),
  getPrototypeOf: (e) => Reflect.getPrototypeOf(e),
  setPrototypeOf: (e, t) => Reflect.setPrototypeOf(e, t),
  isExtensible: (e) => Reflect.isExtensible(e),
  preventExtensions: (e) => Reflect.preventExtensions(e)
}, Hg = /* @__PURE__ */ Symbol.for("uniform.proxy"), Bg = /* @__PURE__ */ Symbol.for("uniform.proxy.internals"), jg = class {
  _invoker;
  _config;
  _childCache = /* @__PURE__ */ new Map();
  constructor(e, t) {
    this._invoker = e, this._config = {
      channel: t.channel,
      basePath: t.basePath ?? [],
      invoker: e,
      cache: t.cache ?? !0,
      timeout: t.timeout ?? 3e4
    };
  }
  get(e, t, n) {
    const r = String(t);
    if (t === Hg) return !0;
    if (t === Bg) return this._config;
    if (t === nb) return !0;
    if (t === fr) return this._getDescriptor();
    if (t === "then" || t === "catch" || t === "finally" || typeof t == "symbol") return;
    if (t === "$path") return this._config.basePath;
    if (t === "$channel") return this._config.channel;
    if (t === "$descriptor") return this._getDescriptor();
    if (t === "$invoke") return this._invoker;
    const i = [...this._config.basePath, r];
    if (this._config.cache && this._childCache.has(r)) return this._childCache.get(r);
    const s = Rs(this._invoker, {
      ...this._config,
      basePath: i
    });
    return this._config.cache && this._childCache.set(r, s), s;
  }
  set(e, t, n, r) {
    return typeof t == "symbol" || this._invoker(G.SET, [...this._config.basePath, String(t)], [n]), !0;
  }
  apply(e, t, n) {
    return this._invoker(G.APPLY, this._config.basePath, [n]);
  }
  construct(e, t, n) {
    return this._invoker(G.CONSTRUCT, this._config.basePath, [t]);
  }
  has(e, t) {
    return typeof t == "symbol" ? !1 : this._invoker(G.HAS, this._config.basePath, [t]);
  }
  deleteProperty(e, t) {
    return typeof t == "symbol" ? !0 : this._invoker(G.DELETE_PROPERTY, [...this._config.basePath, String(t)], []);
  }
  ownKeys(e) {
    return [];
  }
  getOwnPropertyDescriptor(e, t) {
    return {
      configurable: !0,
      enumerable: !0,
      writable: !0
    };
  }
  getPrototypeOf(e) {
    return Function.prototype;
  }
  setPrototypeOf(e, t) {
    return this._invoker(G.SET_PROTOTYPE_OF, this._config.basePath, [t]);
  }
  isExtensible(e) {
    return !0;
  }
  preventExtensions(e) {
    return this._invoker(G.PREVENT_EXTENSIONS, this._config.basePath, []);
  }
  _getDescriptor() {
    return {
      path: this._config.basePath,
      channel: this._config.channel,
      primitive: !1
    };
  }
};
function Rs(e, t) {
  const n = function() {
  }, r = new jg(e, t);
  return new Proxy(n, r);
}
function Xf(e, t, n) {
  if (!e || typeof e != "object" || e.primitive) return e;
  const r = Rc.get(e);
  if (r) return r;
  const i = Rs(t, {
    channel: n ?? e.channel ?? "unknown",
    basePath: e.path ?? []
  });
  return Rc.set(e, i), Ia.set(i, e), i;
}
function Ug(e, t) {
  return ob(e, t);
}
function Vg(e, t = []) {
  return Rs((r, i, s) => e.request({
    id: Z(),
    channel: e.channelName,
    sender: e.senderId ?? "proxy",
    type: "request",
    payload: {
      action: r,
      path: i,
      args: s
    }
  }), {
    channel: e.channelName,
    basePath: t
  });
}
var qg = Xf;
function Gg(e) {
  return [
    e.localChannel,
    e.remoteChannel,
    e.sender,
    e.transportType,
    e.direction
  ].join("::");
}
function Xg(e, t = {}) {
  const n = t.includeClosed ?? !1, r = t.status ?? (n ? void 0 : "active");
  return [...e].filter((i) => !(r && i.status !== r || t.channel && i.localChannel !== t.channel && i.remoteChannel !== t.channel || t.localChannel && i.localChannel !== t.localChannel || t.remoteChannel && i.remoteChannel !== t.remoteChannel || t.sender && i.sender !== t.sender || t.transportType && i.transportType !== t.transportType || t.direction && i.direction !== t.direction)).sort((i, s) => s.updatedAt - i.updatedAt);
}
var Yf = class {
  _createId;
  _emitEvent;
  _connections = /* @__PURE__ */ new Map();
  constructor(e, t) {
    this._createId = e, this._emitEvent = t;
  }
  register(e) {
    const t = Gg(e), n = Date.now(), r = this._connections.get(t);
    if (r)
      return r.updatedAt = n, r.status = "active", r.metadata = {
        ...r.metadata,
        ...e.metadata
      }, r;
    const i = {
      id: this._createId(),
      localChannel: e.localChannel,
      remoteChannel: e.remoteChannel,
      sender: e.sender,
      transportType: e.transportType,
      direction: e.direction,
      status: "active",
      createdAt: n,
      updatedAt: n,
      metadata: e.metadata
    };
    return this._connections.set(t, i), this._emitEvent?.({
      type: "connected",
      connection: i,
      timestamp: n
    }), i;
  }
  markNotified(e, t) {
    const n = Date.now();
    e.lastNotifyAt = n, e.updatedAt = n, this._emitEvent?.({
      type: "notified",
      connection: e,
      timestamp: n,
      payload: t
    });
  }
  closeByChannel(e) {
    const t = Date.now();
    for (const n of this._connections.values())
      n.localChannel !== e && n.remoteChannel !== e || n.status !== "closed" && (n.status = "closed", n.updatedAt = t, this._emitEvent?.({
        type: "disconnected",
        connection: n,
        timestamp: t
      }));
  }
  closeAll() {
    const e = Date.now();
    for (const t of this._connections.values())
      t.status !== "closed" && (t.status = "closed", t.updatedAt = e, this._emitEvent?.({
        type: "disconnected",
        connection: t,
        timestamp: e
      }));
  }
  query(e = {}) {
    return Xg(this._connections.values(), e);
  }
  values() {
    return [...this._connections.values()];
  }
  clear() {
    this._connections.clear();
  }
}, Kf = class {
  _name;
  _contextType;
  _config;
  _transports = /* @__PURE__ */ new Map();
  _defaultTransport = null;
  _connectionEvents = new He({ bufferSize: 200 });
  _connectionRegistry = new Yf(() => Z(), (e) => this._connectionEvents.next(e));
  _pending = /* @__PURE__ */ new Map();
  _subscriptions = [];
  _inbound = new He({ bufferSize: 100 });
  _outbound = new He({ bufferSize: 100 });
  _invocations = new He({ bufferSize: 100 });
  _responses = new He({ bufferSize: 100 });
  _exposed = /* @__PURE__ */ new Map();
  _proxyCache = /* @__PURE__ */ new WeakMap();
  __getPrivate(e) {
    return this[e];
  }
  __setPrivate(e, t) {
    this[e] = t;
  }
  constructor(e) {
    const t = typeof e == "string" ? { name: e } : e;
    this._name = t.name, this._contextType = t.autoDetect !== !1 ? Gf() : "unknown", this._config = {
      name: t.name,
      autoDetect: t.autoDetect ?? !0,
      timeout: t.timeout ?? 3e4,
      reflect: t.reflect ?? Wg,
      bufferSize: t.bufferSize ?? 100,
      autoListen: t.autoListen ?? !0
    }, this._config.autoListen && this._isWorkerContext() && this.listen(self);
  }
  connect(e, t = {}) {
    const n = Tc(e), r = t.targetChannel ?? this._inferTargetChannel(e, n), i = this._createTransportBinding(e, n, r, t);
    this._transports.set(r, i), this._defaultTransport || (this._defaultTransport = i);
    const s = this._registerConnection({
      localChannel: this._name,
      remoteChannel: r,
      sender: this._name,
      transportType: n,
      direction: "outgoing",
      metadata: { phase: "connect" }
    });
    return this._emitConnectionSignal(i, "connect", {
      connectionId: s.id,
      from: this._name,
      to: r
    }), this;
  }
  listen(e, t = {}) {
    const n = Tc(e), r = t.targetChannel ?? this._inferTargetChannel(e, n), i = (o) => this._handleIncoming(o), s = this._registerConnection({
      localChannel: this._name,
      remoteChannel: r,
      sender: r,
      transportType: n,
      direction: "incoming",
      metadata: { phase: "listen" }
    });
    switch (n) {
      case "worker":
      case "message-port":
      case "broadcast":
        t.autoStart !== !1 && e.start && e.start(), e.addEventListener?.("message", ((o) => i(o.data)));
        break;
      case "websocket":
        e.addEventListener?.("message", ((o) => {
          try {
            i(JSON.parse(o.data));
          } catch {
          }
        }));
        break;
      case "chrome-runtime":
        chrome.runtime.onMessage?.addListener?.((o, a, l) => (i(o), !0));
        break;
      case "chrome-tabs":
        chrome.runtime.onMessage?.addListener?.((o, a) => t.tabId != null && a?.tab?.id !== t.tabId ? !1 : (i(o), !0));
        break;
      case "chrome-port":
        e?.onMessage?.addListener?.((o) => {
          i(o);
        });
        break;
      case "chrome-external":
        chrome.runtime.onMessageExternal?.addListener?.((o) => (i(o), !0));
        break;
      case "self":
        addEventListener?.("message", ((o) => i(o.data)));
        break;
      default:
        t.onMessage && t.onMessage(i);
    }
    return this._sendSignalToTarget(e, n, {
      connectionId: s.id,
      from: this._name,
      to: r,
      tabId: t.tabId,
      externalId: t.externalId
    }, "notify"), this;
  }
  attach(e, t = {}) {
    return this.connect(e, t);
  }
  expose(e, t) {
    const n = [e];
    return Os(n, t), this._exposed.set(e, {
      name: e,
      obj: t,
      path: n
    }), this;
  }
  exposeAll(e) {
    for (const [t, n] of Object.entries(e)) this.expose(t, n);
    return this;
  }
  async import(e, t) {
    return this.invoke(t ?? this._getDefaultTarget(), G.IMPORT, [], [e]);
  }
  invoke(e, t, n, r = []) {
    const i = Z(), s = Promise.withResolvers();
    this._pending.set(i, s);
    const o = setTimeout(() => {
      this._pending.has(i) && (this._pending.delete(i), s.reject(/* @__PURE__ */ new Error(`Request timeout: ${t} on ${n.join(".")}`)));
    }, this._config.timeout), a = {
      id: i,
      channel: e,
      sender: this._name,
      type: "request",
      payload: {
        channel: e,
        sender: this._name,
        action: t,
        path: n,
        args: r
      },
      timestamp: Date.now()
    };
    return this._send(e, a), this._outbound.next(a), s.promise.finally(() => clearTimeout(o));
  }
  get(e, t, n) {
    return this.invoke(e, G.GET, t, [n]);
  }
  set(e, t, n, r) {
    return this.invoke(e, G.SET, t, [n, r]);
  }
  call(e, t, n = []) {
    return this.invoke(e, G.APPLY, t, [n]);
  }
  construct(e, t, n = []) {
    return this.invoke(e, G.CONSTRUCT, t, [n]);
  }
  proxy(e, t = []) {
    const n = e ?? this._getDefaultTarget();
    return this._createProxy(n, t);
  }
  remote(e, t) {
    return this.proxy(t, [e]);
  }
  wrapDescriptor(e, t) {
    return Xf(e, (r, i, s) => {
      const o = t ?? e?.channel ?? this._getDefaultTarget();
      return this.invoke(o, r, i, s);
    }, t ?? e?.channel ?? this._getDefaultTarget());
  }
  subscribe(e) {
    return this._inbound.subscribe(e);
  }
  next(e) {
    this._send(e.channel, e), this._outbound.next(e);
  }
  emit(e, t, n) {
    const r = {
      id: Z(),
      channel: e,
      sender: this._name,
      type: "event",
      payload: {
        type: t,
        data: n
      },
      timestamp: Date.now()
    };
    this.next(r);
  }
  notify(e, t = {}, n = "notify") {
    const r = this._transports.get(e);
    return r ? (this._emitConnectionSignal(r, n, {
      from: this._name,
      to: e,
      ...t
    }), !0) : !1;
  }
  get onMessage() {
    return this._inbound;
  }
  get onOutbound() {
    return this._outbound;
  }
  get onInvocation() {
    return this._invocations;
  }
  get onResponse() {
    return this._responses;
  }
  get onConnection() {
    return this._connectionEvents;
  }
  subscribeConnections(e) {
    return this._connectionEvents.subscribe(e);
  }
  queryConnections(e = {}) {
    return this._connectionRegistry.query(e);
  }
  notifyConnections(e = {}, t = {}) {
    let n = 0;
    const r = this.queryConnections({
      ...t,
      status: "active",
      includeClosed: !1
    });
    for (const i of r) {
      const s = this._transports.get(i.remoteChannel);
      s && (this._emitConnectionSignal(s, "notify", {
        connectionId: i.id,
        from: this._name,
        to: i.remoteChannel,
        ...e
      }), n++);
    }
    return n;
  }
  get name() {
    return this._name;
  }
  get contextType() {
    return this._contextType;
  }
  get config() {
    return this._config;
  }
  get connectedChannels() {
    return [...this._transports.keys()];
  }
  get exposedModules() {
    return [...this._exposed.keys()];
  }
  close() {
    this._subscriptions.forEach((e) => e.unsubscribe()), this._subscriptions = [], this._pending.clear(), this._markAllConnectionsClosed();
    for (const e of this._transports.values()) {
      try {
        e.cleanup?.();
      } catch {
      }
      if (e.transportType === "message-port" || e.transportType === "broadcast") try {
        e.target?.close?.();
      } catch {
      }
    }
    this._transports.clear(), this._defaultTransport = null, this._connectionRegistry.clear(), this._inbound.complete(), this._outbound.complete(), this._invocations.complete(), this._responses.complete(), this._connectionEvents.complete();
  }
  _handleIncoming(e) {
    if (!(!e || typeof e != "object"))
      switch (this._inbound.next(e), e.type) {
        case "request":
          e.channel === this._name && this._handleRequest(e);
          break;
        case "response":
          this._handleResponse(e);
          break;
        case "event":
          break;
        case "signal":
          this._handleSignal(e);
          break;
      }
  }
  _handleResponse(e) {
    const t = e.reqId ?? e.id, n = this._pending.get(t);
    if (n) {
      if (this._pending.delete(t), e.payload?.error) n.reject(new Error(e.payload.error));
      else {
        const r = e.payload?.result, i = e.payload?.descriptor;
        r != null ? n.resolve(r) : i ? n.resolve(this.wrapDescriptor(i, e.sender)) : n.resolve(void 0);
      }
      this._responses.next({
        id: t,
        channel: e.channel,
        sender: e.sender,
        result: e.payload?.result,
        descriptor: e.payload?.descriptor,
        timestamp: Date.now()
      });
    }
  }
  async _handleRequest(e) {
    const t = e.payload;
    if (!t) return;
    const { action: n, path: r, args: i, sender: s } = t, o = e.reqId ?? e.id;
    this._invocations.next({
      id: o,
      channel: this._name,
      sender: s,
      action: n,
      path: r,
      args: i ?? [],
      timestamp: Date.now(),
      contextType: Fg(e)
    });
    const { result: a, toTransfer: l, newPath: c } = await this._executeAction(n, r, i ?? [], s);
    await this._sendResponse(o, n, s, c, a, l);
  }
  async _executeAction(e, t, n, r) {
    const { result: i, toTransfer: s, path: o } = td(e, t, n, {
      channel: this._name,
      sender: r,
      reflect: this._config.reflect
    });
    return {
      result: await i,
      toTransfer: s,
      newPath: o
    };
  }
  async _sendResponse(e, t, n, r, i, s) {
    const { response: o, transfer: a } = await nd(e, t, this._name, n, r, i, s), l = {
      id: e,
      ...o,
      timestamp: Date.now(),
      transferable: a
    };
    this._send(n, l, a);
  }
  _handleSignal(e) {
    const t = e?.payload ?? {}, n = t.from ?? e.sender ?? "unknown", r = e.transportType ?? this._transports.get(e.channel)?.transportType ?? "internal", i = this._registerConnection({
      localChannel: this._name,
      remoteChannel: n,
      sender: e.sender ?? n,
      transportType: r,
      direction: "incoming"
    });
    this._markConnectionNotified(i, t);
  }
  _registerConnection(e) {
    return this._connectionRegistry.register(e);
  }
  _markConnectionNotified(e, t) {
    this._connectionRegistry.markNotified(e, t);
  }
  _emitConnectionSignal(e, t, n = {}) {
    const r = {
      id: Z(),
      type: "signal",
      channel: e.targetChannel,
      sender: this._name,
      transportType: e.transportType,
      payload: {
        type: t,
        from: this._name,
        to: e.targetChannel,
        ...n
      },
      timestamp: Date.now()
    };
    (e?.sender ?? e?.postMessage)?.call(e, r);
    const i = this._registerConnection({
      localChannel: this._name,
      remoteChannel: e.targetChannel,
      sender: this._name,
      transportType: e.transportType,
      direction: "outgoing"
    });
    this._markConnectionNotified(i, r.payload);
  }
  _sendSignalToTarget(e, t, n, r) {
    const i = {
      id: Z(),
      type: "signal",
      channel: n.to ?? this._name,
      sender: this._name,
      transportType: t,
      payload: {
        type: r,
        ...n
      },
      timestamp: Date.now()
    };
    try {
      if (t === "websocket") {
        e?.send?.(JSON.stringify(i));
        return;
      }
      if (t === "chrome-runtime") {
        chrome.runtime?.sendMessage?.(i);
        return;
      }
      if (t === "chrome-tabs") {
        const s = n.tabId;
        s != null && chrome.tabs?.sendMessage?.(s, i);
        return;
      }
      if (t === "chrome-port") {
        e?.postMessage?.(i);
        return;
      }
      if (t === "chrome-external") {
        n.externalId && chrome.runtime?.sendMessage?.(n.externalId, i);
        return;
      }
      e?.postMessage?.(i, { transfer: [] });
    } catch {
    }
  }
  _markAllConnectionsClosed() {
    this._connectionRegistry.closeAll();
  }
  _createTransportBinding(e, t, n, r) {
    let i, s;
    switch (t) {
      case "worker":
      case "message-port":
      case "broadcast":
        r.autoStart !== !1 && e.start && e.start(), i = (o, a) => e.postMessage(o, { transfer: a });
        {
          const o = ((a) => this._handleIncoming(a.data));
          e.addEventListener?.("message", o), s = () => e.removeEventListener?.("message", o);
        }
        break;
      case "websocket":
        i = (o) => e.send(JSON.stringify(o));
        {
          const o = ((a) => {
            try {
              this._handleIncoming(JSON.parse(a.data));
            } catch {
            }
          });
          e.addEventListener?.("message", o), s = () => e.removeEventListener?.("message", o);
        }
        break;
      case "chrome-runtime":
        i = (o) => chrome.runtime.sendMessage(o);
        {
          const o = (a) => this._handleIncoming(a);
          chrome.runtime.onMessage?.addListener?.(o), s = () => chrome.runtime.onMessage?.removeListener?.(o);
        }
        break;
      case "chrome-tabs":
        i = (o) => {
          r.tabId != null && chrome.tabs?.sendMessage?.(r.tabId, o);
        };
        {
          const o = (a, l) => r.tabId != null && l?.tab?.id !== r.tabId ? !1 : (this._handleIncoming(a), !0);
          chrome.runtime.onMessage?.addListener?.(o), s = () => chrome.runtime.onMessage?.removeListener?.(o);
        }
        break;
      case "chrome-port":
        if (e?.postMessage && e?.onMessage?.addListener) {
          i = (a) => e.postMessage(a);
          const o = (a) => this._handleIncoming(a);
          e.onMessage.addListener(o), s = () => {
            try {
              e.onMessage.removeListener(o);
            } catch {
            }
            try {
              e.disconnect?.();
            } catch {
            }
          };
        } else {
          const o = r.portName ?? n, a = r.tabId != null && chrome.tabs?.connect ? chrome.tabs.connect(r.tabId, { name: o }) : chrome.runtime.connect({ name: o });
          i = (c) => a.postMessage(c);
          const l = (c) => this._handleIncoming(c);
          a.onMessage.addListener(l), s = () => {
            try {
              a.onMessage.removeListener(l);
            } catch {
            }
            try {
              a.disconnect();
            } catch {
            }
          };
        }
        break;
      case "chrome-external":
        i = (o) => {
          r.externalId && chrome.runtime.sendMessage(r.externalId, o);
        };
        {
          const o = (a) => (this._handleIncoming(a), !0);
          chrome.runtime.onMessageExternal?.addListener?.(o), s = () => chrome.runtime.onMessageExternal?.removeListener?.(o);
        }
        break;
      case "self":
        i = (o, a) => globalThis.postMessage?.(o, { transfer: a ?? [] });
        {
          const o = ((a) => this._handleIncoming(a.data));
          globalThis.addEventListener?.("message", o), s = () => globalThis.removeEventListener?.("message", o);
        }
        break;
      default:
        r.onMessage && (s = r.onMessage((o) => this._handleIncoming(o))), i = (o) => e?.postMessage?.(o);
    }
    return {
      target: e,
      targetChannel: n,
      transportType: t,
      sender: i,
      cleanup: s,
      postMessage: (o, a) => i?.(o, a),
      start: () => e?.start?.(),
      close: () => e?.close?.()
    };
  }
  _send(e, t, n) {
    const r = this._transports.get(e) ?? this._defaultTransport;
    (r?.sender ?? r?.postMessage)?.call(r, t, n);
  }
  _getDefaultTarget() {
    return this._defaultTransport ? this._defaultTransport.targetChannel : "worker";
  }
  _inferTargetChannel(e, t) {
    return t === "worker" ? "worker" : t === "broadcast" && e.name ? e.name : t === "self" ? "self" : `${t}-${Z().slice(0, 8)}`;
  }
  _createProxy(e, t) {
    return Rs((r, i, s) => this.invoke(e, r, i, s), {
      channel: e,
      basePath: t,
      cache: !0,
      timeout: this._config.timeout
    });
  }
  _isWorkerContext() {
    return [
      "worker",
      "shared-worker",
      "service-worker"
    ].includes(this._contextType);
  }
};
function Oa(e) {
  return new Kf(e);
}
var Ni = null;
function Yg() {
  if (!Ni) {
    const e = Gf();
    [
      "worker",
      "shared-worker",
      "service-worker"
    ].includes(e) ? Ni = Oa({
      name: "worker",
      autoListen: !0
    }) : Ni = Oa({
      name: "host",
      autoListen: !1
    });
  }
  return Ni;
}
var dt = {
  rjb: "rejectBy",
  rvb: "resolveBy",
  rj: "reject",
  rv: "resolve",
  cr: "create",
  cs: "createSync",
  a: "array",
  ta: "typedarray",
  udf: "undefined"
}, Xx = [
  typeof ArrayBuffer != dt.udf ? ArrayBuffer : null,
  typeof MessagePort != dt.udf ? MessagePort : null,
  typeof ReadableStream != dt.udf ? ReadableStream : null,
  typeof WritableStream != dt.udf ? WritableStream : null,
  typeof TransformStream != dt.udf ? TransformStream : null,
  typeof WebTransportReceiveStream != dt.udf ? WebTransportReceiveStream : null,
  typeof WebTransportSendStream != dt.udf ? WebTransportSendStream : null,
  typeof AudioData != dt.udf ? AudioData : null,
  typeof ImageBitmap != dt.udf ? ImageBitmap : null,
  typeof VideoFrame != dt.udf ? VideoFrame : null,
  typeof OffscreenCanvas != dt.udf ? OffscreenCanvas : null,
  typeof RTCDataChannel != dt.udf ? RTCDataChannel : null
].filter((e) => e != null);
function Jf() {
  try {
    const e = globalThis.location?.href;
    if (typeof e == "string" && e.length > 0) return e;
  } catch {
  }
  try {
    if (typeof document < "u" && typeof document.baseURI == "string" && document.baseURI.length > 0) return document.baseURI;
  } catch {
  }
  return "";
}
function us(e) {
  const t = Jf();
  if (!t.length) throw new TypeError("[uniform] No base URL for worker resolution (missing location / document.baseURI)");
  const n = e.startsWith("/") ? e.replace(/^\//, "./") : e;
  return new URL(n, t).href;
}
var pt = {
  name: "unknown",
  instance: null
}, ea = /* @__PURE__ */ new Map(), Qf = (e) => [...Object.values(G)].includes(e), Kg = class {
  channelName;
  options;
  _channel;
  constructor(e, t = {}) {
    this.channelName = e, this.options = t, this._channel = Yg();
  }
  request(e, t, n, r = {}) {
    return typeof e == "string" && (e = [e]), Array.isArray(t) && Qf(e) && (r = n, n = t, t = e, e = []), this._channel.invoke(this.channelName, t, e, n);
  }
  doImportModule(e, t) {
    return this._channel.import(e, this.channelName);
  }
}, Jg = class {
  channel;
  options;
  _unified;
  broadcasts = {};
  constructor(e, t = {}) {
    this.channel = e, this.options = t, this._unified = Oa({
      name: e,
      autoListen: !1
    }), pt.name = e, pt.instance = this;
  }
  createRemoteChannel(e, t = {}, n) {
    return n && (this._unified.attach(n, { targetChannel: e }), this.broadcasts[e] = n), Promise.resolve(new Kg(e, t));
  }
  getChannel() {
    return this.channel;
  }
  request(e, t, n, r = {}, i = "worker") {
    return typeof e == "string" && (e = [e]), Array.isArray(t) && Qf(e) && (i = r, r = n, n = t, t = e, e = []), this._unified.invoke(i, t, e, n);
  }
  resolveResponse(e, t) {
    return Promise.resolve(t);
  }
  async handleAndResponse(e, t, n) {
    const r = await sb(e, t, this.channel);
    r && n?.(r.response, r.transfer);
  }
  close() {
    this._unified.close();
  }
}, Qg = (e = "$host$") => {
  if (pt?.instance && e === "$host$") return pt.instance;
  if (ea.has(e)) return ea.get(e) ?? null;
  const t = new Jg(e);
  return e === "$host$" && (pt.name = e, pt.instance = t), ea.set(e, t), t;
}, Zg = (e = "$host$") => Qg(e), eb = (e, t = {}, n = typeof self < "u" ? self : null) => {
  const r = Zg(e ?? "$host$");
  return r?.createRemoteChannel?.(e, t, n) ?? r;
}, Mc = /* @__PURE__ */ new WeakMap(), Ia = /* @__PURE__ */ new WeakMap(), Rc = /* @__PURE__ */ new WeakMap(), tb = (e, t = pt?.name, n) => typeof e == "object" && e != null || typeof e == "function" && e != null ? Ia.has(e) ? Ia.get(e) : Mc.has(e) ? Mc.get(e) : $a(e) || n?.includes?.(e) || t == pt?.name ? e : {
  $isDescriptor: !0,
  path: un.get(e) ?? (() => {
    const r = [Z()];
    return Os(r, e), r;
  })(),
  owner: pt?.name,
  channel: t,
  primitive: L(e),
  writable: !0,
  enumerable: !0,
  configurable: !0,
  argumentCount: e instanceof Function ? e.length : -1
} : Zt(e) ? e : null, nb = /* @__PURE__ */ Symbol.for("@requestHandler"), fr = /* @__PURE__ */ Symbol.for("@descriptor"), ta = (e) => Zt(e) || e?.[fr] ? e : e?.$isDescriptor ? qg(e, async () => {
}) : $a(e) ? e : null, Jr = /* @__PURE__ */ new Map(), un = /* @__PURE__ */ new WeakMap(), ul = (e, t) => {
  if (t != null && !Array.isArray(t) && (t = [t]), t == null || t?.length < 1) return e;
  const n = e?.[fr] ?? (e?.$isDescriptor ? e : null);
  if (n && n?.owner == pt?.name && (e = Rn(n?.path) ?? e), L(e)) return e;
  for (const r of t)
    if (e = e?.[r], e == null) return e;
  return e;
}, Rn = (e) => {
  if (e != null && !Array.isArray(e) && (e = [e]), e == null || e?.length < 1) return null;
  const t = Jr?.get?.(e?.[0]) ?? null;
  return t != null ? ul(t, e?.slice?.(1)) : null;
}, Os = (e, t) => {
  const n = t?.[fr] ?? (t?.$isDescriptor ? t : null);
  if (n && n?.owner == pt?.name && (t = Rn(n?.path) ?? t), e != null && !Array.isArray(e) && (e = [e]), e == null || e?.length < 1) return null;
  const r = Jr?.get?.(e?.[0]) ?? null;
  return e?.length > 1 ? ul(r, e?.slice?.(1, -1))[e?.[e?.length - 1]] = t : Jr?.set?.(e?.[0], t), (typeof t == "object" || typeof t == "function") && un?.set?.(t, e), t;
}, Zf = (e) => {
  if (e != null && !Array.isArray(e) && (e = [e]), e == null || e?.length < 1) return !1;
  const t = Jr?.get?.(e?.[0]) ?? null;
  return !t && e?.length <= 1 ? (Jr?.delete?.(e?.[0]), !0) : !1;
}, rb = (e) => {
  const t = e?.[fr] ?? (e?.$isDescriptor ? e : null);
  t && t?.owner == pt?.name && (e = Rn(t?.path) ?? e);
  const n = un?.get?.(e) ?? t?.path;
  return n == null || n?.length < 1 ? !1 : (Zf(n), (typeof e == "object" || typeof e == "function") && un?.delete?.(e), !0);
}, ib = (e) => {
  const t = e?.[fr] ?? (e?.$isDescriptor ? e : null);
  return (un?.get?.(e) ?? t?.path) == null;
}, Jt = (e) => (typeof e == "object" || typeof e == "function") && e != null, ed = {
  get: (e, t) => e?.[t],
  set: (e, t, n) => (e[t] = n, !0),
  has: (e, t) => t in e,
  apply: (e, t, n) => e.apply(t, n),
  construct: (e, t) => new e(...t),
  deleteProperty: (e, t) => delete e[t],
  ownKeys: (e) => Object.keys(e),
  getOwnPropertyDescriptor: (e, t) => Object.getOwnPropertyDescriptor(e, t),
  getPrototypeOf: (e) => Object.getPrototypeOf(e),
  setPrototypeOf: (e, t) => Object.setPrototypeOf(e, t),
  isExtensible: (e) => Object.isExtensible(e),
  preventExtensions: (e) => Object.preventExtensions(e)
};
function td(e, t, n, r = {}) {
  const { channel: i = "", sender: s = "", reflect: o = ed } = r, a = r.target ?? Rn(t), l = [];
  let c = null, u = t;
  switch (String(e).toLowerCase()) {
    case "import":
    case G.IMPORT:
      c = import(
        /* @vite-ignore */
        n?.[0]
      );
      break;
    case "transfer":
    case G.TRANSFER:
      ca(a) && i !== s && l.push(a), c = a;
      break;
    case "get":
    case G.GET: {
      const d = n?.[0], p = o.get?.(a, d) ?? a?.[d];
      c = typeof p == "function" && a != null ? p.bind(a) : p, u = [...t, String(d)];
      break;
    }
    case "set":
    case G.SET: {
      const [d, p] = n, f = en(p, ta);
      r.target ? c = o.set?.(a, d, f) ?? (a[d] = f, !0) : c = o.set?.(a, d, f) ?? Os([...t, String(d)], f);
      break;
    }
    case "apply":
    case "call":
    case G.APPLY:
    case G.CALL:
      if (typeof a == "function") {
        const d = r.context ?? (r.target ? void 0 : Rn(t.slice(0, -1))), p = en(n?.[0] ?? n ?? [], ta);
        c = o.apply?.(a, d, p) ?? a.apply(d, p), ca(c) && t?.at(-1) === "transfer" && i !== s && l.push(c);
      }
      break;
    case "construct":
    case G.CONSTRUCT:
      if (typeof a == "function") {
        const d = en(n?.[0] ?? n ?? [], ta);
        c = o.construct?.(a, d) ?? new a(...d);
      }
      break;
    case "delete":
    case "deleteproperty":
    case "dispose":
    case G.DELETE:
    case G.DELETE_PROPERTY:
    case G.DISPOSE:
      if (r.target) {
        const d = t[t.length - 1];
        c = o.deleteProperty?.(a, d) ?? delete a[d];
      } else
        c = t?.length > 0 ? Zf(t) : rb(a), c && (u = un.get(a) ?? []);
      break;
    case "has":
    case G.HAS:
      c = o.has?.(a, n?.[0]) ?? (Jt(a) ? n?.[0] in a : !1);
      break;
    case "ownkeys":
    case G.OWN_KEYS:
      c = o.ownKeys?.(a) ?? (Jt(a) ? Object.keys(a) : []);
      break;
    case "getownpropertydescriptor":
    case "getpropertydescriptor":
    case G.GET_OWN_PROPERTY_DESCRIPTOR:
    case G.GET_PROPERTY_DESCRIPTOR:
      c = o.getOwnPropertyDescriptor?.(a, n?.[0] ?? t?.at(-1) ?? "") ?? (Jt(a) ? Object.getOwnPropertyDescriptor(a, n?.[0] ?? t?.at(-1) ?? "") : void 0);
      break;
    case "getprototypeof":
    case G.GET_PROTOTYPE_OF:
      c = o.getPrototypeOf?.(a) ?? (Jt(a) ? Object.getPrototypeOf(a) : null);
      break;
    case "setprototypeof":
    case G.SET_PROTOTYPE_OF:
      c = o.setPrototypeOf?.(a, n?.[0]) ?? (Jt(a) ? Object.setPrototypeOf(a, n?.[0]) : !1);
      break;
    case "isextensible":
    case G.IS_EXTENSIBLE:
      c = o.isExtensible?.(a) ?? (Jt(a) ? Object.isExtensible(a) : !0);
      break;
    case "preventextensions":
    case G.PREVENT_EXTENSIONS:
      c = o.preventExtensions?.(a) ?? (Jt(a) ? Object.preventExtensions(a) : !1);
      break;
  }
  return {
    result: c,
    toTransfer: l,
    path: u
  };
}
async function nd(e, t, n, r, i, s, o) {
  const a = await s, l = ca(a) && o.includes(a) || Zt(a);
  let c = i;
  !l && t !== "get" && t !== G.GET && (typeof a == "object" || typeof a == "function") && (ib(a) ? (c = [Z()], Os(c, a)) : c = un.get(a) ?? []);
  const u = Rn(c), d = t === "get" || t === G.GET ? c?.at(-1) : void 0, p = Rn(i), f = en(a, (h) => tb(h, n, o)) ?? a;
  return {
    response: {
      channel: r,
      sender: n,
      reqId: e,
      action: t,
      type: "response",
      payload: {
        result: l ? f : null,
        type: typeof a,
        channel: r,
        sender: n,
        descriptor: {
          $isDescriptor: !0,
          path: c,
          owner: n,
          channel: n,
          primitive: L(a),
          writable: !0,
          enumerable: !0,
          configurable: !0,
          argumentCount: p instanceof Function ? p.length : -1,
          ...Jt(u) && d != null ? Object.getOwnPropertyDescriptor(u, d) : {}
        }
      }
    },
    transfer: o
  };
}
async function sb(e, t, n, r) {
  const { channel: i, sender: s, path: o, action: a, args: l } = e;
  if (i !== n) return null;
  const { result: c, toTransfer: u, path: d } = td(a, o, l, {
    channel: i,
    sender: s,
    ...r
  });
  return nd(t, a, n, s, d, c, u);
}
function ob(e, t = ed) {
  return async (n, r, i) => {
    let s = e, o = e;
    for (let l = 0; l < r.length; l++)
      if (s = o, o = o?.[r[l]], o === void 0 && l < r.length - 1) throw new Error(`Path segment '${r[l]}' not found`);
    const a = r[r.length - 1];
    switch (String(n).toLowerCase()) {
      case "get":
      case G.GET:
        return o;
      case "set":
      case G.SET:
        return s[a] = i[0], !0;
      case "call":
      case "apply":
      case G.APPLY:
      case G.CALL:
        if (typeof o == "function") {
          const l = Array.isArray(i[0]) ? i[0] : i;
          return await o.apply(s, l);
        }
        throw new Error(`'${a}' is not a function`);
      case "construct":
      case G.CONSTRUCT:
        if (typeof o == "function") {
          const l = Array.isArray(i[0]) ? i[0] : i;
          return new o(...l);
        }
        throw new Error(`'${a}' is not a constructor`);
      case "has":
      case G.HAS:
        return a in s;
      case "delete":
      case "deleteproperty":
      case G.DELETE_PROPERTY:
        return delete s[a];
      case "ownkeys":
      case G.OWN_KEYS:
        return Object.keys(o ?? s);
      default:
        return o;
    }
  };
}
var ab = class {
  _name;
  _transportType;
  _id = Z();
  _state = "disconnected";
  _inbound = new He({ bufferSize: 1e3 });
  _outbound = new He({ bufferSize: 1e3 });
  _stateChanges = new He();
  _connectedPeers = /* @__PURE__ */ new Map();
  _subs = [];
  _stats = {
    messagesSent: 0,
    messagesReceived: 0,
    bytesTransferred: 0,
    latencyMs: 0,
    uptime: 0,
    reconnectCount: 0
  };
  _startTime = 0;
  _pending = /* @__PURE__ */ new Map();
  _buffer = [];
  _opts;
  constructor(e, t = "internal", n = {}) {
    this._name = e, this._transportType = t, this._opts = {
      timeout: 3e4,
      autoReconnect: !0,
      reconnectInterval: 1e3,
      maxReconnectAttempts: 5,
      bufferMessages: !0,
      bufferSize: 1e3,
      metadata: {},
      ...n
    }, this._setupSubscriptions();
  }
  subscribe(e, t) {
    return (t ? Dg((n) => n.sender === t)(this._inbound) : this._inbound).subscribe(typeof e == "function" ? { next: e } : e);
  }
  next(e) {
    if (this._state !== "connected") {
      this._opts.bufferMessages && this._buffer.length < this._opts.bufferSize && this._buffer.push(e);
      return;
    }
    this._outbound.next(e), this._stats.messagesSent++;
  }
  async request(e, t, n = {}) {
    const r = Z(), i = Promise.withResolvers();
    this._pending.set(r, i);
    const s = setTimeout(() => {
      this._pending.has(r) && (this._pending.delete(r), i.reject(/* @__PURE__ */ new Error("Request timeout")));
    }, n.timeout ?? this._opts.timeout);
    return this.next({
      id: Z(),
      channel: e,
      sender: this._name,
      type: "request",
      reqId: r,
      payload: {
        ...t,
        action: n.action,
        path: n.path
      },
      timestamp: Date.now()
    }), i.promise.finally(() => clearTimeout(s));
  }
  respond(e, t) {
    this.next({
      id: Z(),
      channel: e.sender,
      sender: this._name,
      type: "response",
      reqId: e.reqId,
      payload: t,
      timestamp: Date.now()
    });
  }
  emit(e, t, n) {
    this.next({
      id: Z(),
      channel: e,
      sender: this._name,
      type: "event",
      payload: {
        type: t,
        data: n
      },
      timestamp: Date.now()
    });
  }
  subscribeOutbound(e) {
    return this._outbound.subscribe(typeof e == "function" ? { next: e } : e);
  }
  pushInbound(e) {
    if (this._stats.messagesReceived++, e.type === "response" && e.reqId) {
      const t = this._pending.get(e.reqId);
      if (t) {
        this._pending.delete(e.reqId), t.resolve(e.payload);
        return;
      }
    }
    this._inbound.next(e);
  }
  async connect() {
    this._state !== "connected" && (this._setState("connecting"), this._startTime = Date.now(), this._setState("connected"), this._flushBuffer());
  }
  disconnect() {
    this._state === "disconnected" || this._state === "closed" || (this._setState("disconnected"), this._subs.forEach((e) => e.unsubscribe()), this._subs = []);
  }
  close() {
    this.disconnect(), this._setState("closed"), this._inbound.complete(), this._outbound.complete(), this._stateChanges.complete();
  }
  markConnected() {
    this._setState("connected"), this._flushBuffer();
  }
  markDisconnected() {
    this._setState("disconnected");
  }
  _setState(e) {
    this._state !== e && (this._state = e, this._stateChanges.next(e));
  }
  _flushBuffer() {
    for (const e of this._buffer) this._outbound.next(e);
    this._buffer = [];
  }
  _setupSubscriptions() {
    this._subs.push(this._inbound.subscribe({ next: (e) => {
      e.type === "signal" && e.payload?.type === "connect" && this._connectedPeers.set(e.sender, {
        name: e.sender,
        state: "connected",
        isHost: !1
      });
    } }));
  }
  get id() {
    return this._id;
  }
  get name() {
    return this._name;
  }
  get state() {
    return this._state;
  }
  get transportType() {
    return this._transportType;
  }
  get stats() {
    return {
      ...this._stats,
      uptime: this._startTime ? Date.now() - this._startTime : 0
    };
  }
  get stateChanges() {
    return this._stateChanges;
  }
  get connectedPeers() {
    return [...this._connectedPeers.keys()];
  }
  get meta() {
    return {
      id: this._id,
      name: this._name,
      state: this._state,
      isHost: !1,
      connectedChannels: new Set(this._connectedPeers.keys())
    };
  }
}, lb = class Pr {
  _connections = /* @__PURE__ */ new Map();
  static _instance = null;
  static getInstance() {
    return Pr._instance || (Pr._instance = new Pr()), Pr._instance;
  }
  getOrCreate(t, n = "internal", r = {}) {
    return this._connections.has(t) || this._connections.set(t, new ab(t, n, r)), this._connections.get(t);
  }
  get(t) {
    return this._connections.get(t);
  }
  has(t) {
    return this._connections.has(t);
  }
  delete(t) {
    return this._connections.get(t)?.close(), this._connections.delete(t);
  }
  clear() {
    this._connections.forEach((t) => t.close()), this._connections.clear();
  }
  get size() {
    return this._connections.size;
  }
  get names() {
    return [...this._connections.keys()];
  }
}, rd = () => lb.getInstance(), cb = (e, t, n) => rd().getOrCreate(e, t, n), ub = "uniform_channels", fb = 1, H = {
  MESSAGES: "messages",
  MAILBOX: "mailbox",
  PENDING: "pending",
  EXCHANGE: "exchange",
  TRANSACTIONS: "transactions"
}, db = class {
  _db = null;
  _isOpen = !1;
  _openPromise = null;
  _channelName;
  _messageUpdates = new He();
  _exchangeUpdates = new He();
  constructor(e) {
    this._channelName = e;
  }
  async open() {
    return this._db && this._isOpen ? this._db : this._openPromise ? this._openPromise : (this._openPromise = new Promise((e, t) => {
      const n = indexedDB.open(ub, fb);
      n.onerror = () => {
        this._openPromise = null, t(/* @__PURE__ */ new Error("Failed to open IndexedDB"));
      }, n.onsuccess = () => {
        this._db = n.result, this._isOpen = !0, this._openPromise = null, e(this._db);
      }, n.onupgradeneeded = (r) => {
        const i = r.target.result;
        this._createStores(i);
      };
    }), this._openPromise);
  }
  close() {
    this._db && (this._db.close(), this._db = null, this._isOpen = !1);
  }
  _createStores(e) {
    if (!e.objectStoreNames.contains(H.MESSAGES)) {
      const t = e.createObjectStore(H.MESSAGES, { keyPath: "id" });
      t.createIndex("channel", "channel", { unique: !1 }), t.createIndex("status", "status", { unique: !1 }), t.createIndex("recipient", "recipient", { unique: !1 }), t.createIndex("createdAt", "createdAt", { unique: !1 }), t.createIndex("channel_status", ["channel", "status"], { unique: !1 });
    }
    if (!e.objectStoreNames.contains(H.MAILBOX)) {
      const t = e.createObjectStore(H.MAILBOX, { keyPath: "id" });
      t.createIndex("channel", "channel", { unique: !1 }), t.createIndex("priority", "priority", { unique: !1 }), t.createIndex("expiresAt", "expiresAt", { unique: !1 });
    }
    if (!e.objectStoreNames.contains(H.PENDING)) {
      const t = e.createObjectStore(H.PENDING, { keyPath: "id" });
      t.createIndex("channel", "channel", { unique: !1 }), t.createIndex("createdAt", "createdAt", { unique: !1 });
    }
    if (!e.objectStoreNames.contains(H.EXCHANGE)) {
      const t = e.createObjectStore(H.EXCHANGE, { keyPath: "id" });
      t.createIndex("key", "key", { unique: !0 }), t.createIndex("owner", "owner", { unique: !1 });
    }
    e.objectStoreNames.contains(H.TRANSACTIONS) || e.createObjectStore(H.TRANSACTIONS, { keyPath: "id" }).createIndex("createdAt", "createdAt", { unique: !1 });
  }
  async defer(e, t = {}) {
    const n = await this.open(), r = {
      id: Z(),
      channel: e.channel,
      sender: e.sender ?? this._channelName,
      recipient: e.channel,
      type: e.type,
      payload: e.payload,
      status: "pending",
      priority: t.priority ?? 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      expiresAt: t.expiresIn ? Date.now() + t.expiresIn : null,
      retryCount: 0,
      maxRetries: t.maxRetries ?? 3,
      metadata: t.metadata
    };
    return new Promise((i, s) => {
      const o = n.transaction([H.MESSAGES, H.MAILBOX], "readwrite"), a = o.objectStore(H.MESSAGES), l = o.objectStore(H.MAILBOX);
      a.add(r), l.add(r), o.oncomplete = () => {
        this._messageUpdates.next(r), i(r.id);
      }, o.onerror = () => s(/* @__PURE__ */ new Error("Failed to defer message"));
    });
  }
  async getDeferredMessages(e, t = {}) {
    const n = await this.open();
    return new Promise((r, i) => {
      const s = n.transaction(H.MESSAGES, "readonly").objectStore(H.MESSAGES), o = t.status ? s.index("channel_status") : s.index("channel"), a = t.status ? IDBKeyRange.only([e, t.status]) : IDBKeyRange.only(e), l = o.getAll(a, t.limit);
      l.onsuccess = () => {
        let c = l.result;
        t.offset && (c = c.slice(t.offset)), r(c);
      }, l.onerror = () => i(/* @__PURE__ */ new Error("Failed to get deferred messages"));
    });
  }
  async processNextPending(e) {
    const t = await this.open();
    return new Promise((n, r) => {
      const i = t.transaction(H.MESSAGES, "readwrite").objectStore(H.MESSAGES).index("channel_status").openCursor(IDBKeyRange.only([e, "pending"]));
      i.onsuccess = () => {
        const s = i.result;
        if (s) {
          const o = s.value;
          o.status = "processing", o.updatedAt = Date.now(), s.update(o), this._messageUpdates.next(o), n(o);
        } else n(null);
      }, i.onerror = () => r(/* @__PURE__ */ new Error("Failed to process pending message"));
    });
  }
  async markDelivered(e) {
    await this._updateMessageStatus(e, "delivered");
  }
  async markFailed(e) {
    const t = await this.open();
    return new Promise((n, r) => {
      const i = t.transaction(H.MESSAGES, "readwrite").objectStore(H.MESSAGES), s = i.get(e);
      s.onsuccess = () => {
        const o = s.result;
        if (!o) {
          n(!1);
          return;
        }
        o.retryCount++, o.updatedAt = Date.now(), o.retryCount < o.maxRetries ? o.status = "pending" : o.status = "failed", i.put(o), this._messageUpdates.next(o), n(o.status === "pending");
      }, s.onerror = () => r(/* @__PURE__ */ new Error("Failed to mark message as failed"));
    });
  }
  async _updateMessageStatus(e, t) {
    const n = await this.open();
    return new Promise((r, i) => {
      const s = n.transaction(H.MESSAGES, "readwrite").objectStore(H.MESSAGES), o = s.get(e);
      o.onsuccess = () => {
        const a = o.result;
        a && (a.status = t, a.updatedAt = Date.now(), s.put(a), this._messageUpdates.next(a)), r();
      }, o.onerror = () => i(/* @__PURE__ */ new Error("Failed to update message status"));
    });
  }
  async getMailbox(e, t = {}) {
    const n = await this.open();
    return new Promise((r, i) => {
      const s = n.transaction(H.MAILBOX, "readonly").objectStore(H.MAILBOX).index("channel").getAll(IDBKeyRange.only(e), t.limit);
      s.onsuccess = () => {
        let o = s.result;
        t.sortBy === "priority" ? o.sort((a, l) => l.priority - a.priority) : o.sort((a, l) => l.createdAt - a.createdAt), r(o);
      }, s.onerror = () => i(/* @__PURE__ */ new Error("Failed to get mailbox"));
    });
  }
  async getMailboxStats(e) {
    const t = await this.getDeferredMessages(e), n = {
      total: t.length,
      pending: 0,
      processing: 0,
      delivered: 0,
      failed: 0,
      expired: 0
    }, r = Date.now();
    for (const i of t) i.expiresAt && i.expiresAt < r ? n.expired++ : n[i.status]++;
    return n;
  }
  async clearMailbox(e) {
    const t = await this.open();
    return new Promise((n, r) => {
      const i = t.transaction(H.MAILBOX, "readwrite"), s = i.objectStore(H.MAILBOX).index("channel");
      let o = 0;
      const a = s.openCursor(IDBKeyRange.only(e));
      a.onsuccess = () => {
        const l = a.result;
        l && (l.delete(), o++, l.continue());
      }, i.oncomplete = () => n(o), i.onerror = () => r(/* @__PURE__ */ new Error("Failed to clear mailbox"));
    });
  }
  async registerPending(e) {
    const t = await this.open(), n = {
      id: Z(),
      channel: this._channelName,
      type: e.type,
      data: e.data,
      metadata: e.metadata,
      createdAt: Date.now(),
      status: "pending"
    };
    return new Promise((r, i) => {
      const s = t.transaction(H.PENDING, "readwrite");
      s.objectStore(H.PENDING).add(n), s.oncomplete = () => r(n.id), s.onerror = () => i(/* @__PURE__ */ new Error("Failed to register pending operation"));
    });
  }
  async getPendingOperations() {
    const e = await this.open();
    return new Promise((t, n) => {
      const r = e.transaction(H.PENDING, "readonly").objectStore(H.PENDING).index("channel").getAll(IDBKeyRange.only(this._channelName));
      r.onsuccess = () => t(r.result), r.onerror = () => n(/* @__PURE__ */ new Error("Failed to get pending operations"));
    });
  }
  async completePending(e) {
    const t = await this.open();
    return new Promise((n, r) => {
      const i = t.transaction(H.PENDING, "readwrite");
      i.objectStore(H.PENDING).delete(e), i.oncomplete = () => n(), i.onerror = () => r(/* @__PURE__ */ new Error("Failed to complete pending operation"));
    });
  }
  async awaitPending(e, t = {}) {
    const n = t.timeout ?? 3e4, r = t.pollInterval ?? 100, i = Date.now();
    for (; Date.now() - i < n; ) {
      const s = await this._getPendingById(e);
      if (!s) return null;
      if (s.status === "completed")
        return await this.completePending(e), s.result;
      await new Promise((o) => setTimeout(o, r));
    }
    throw new Error(`Pending operation ${e} timed out`);
  }
  async _getPendingById(e) {
    const t = await this.open();
    return new Promise((n, r) => {
      const i = t.transaction(H.PENDING, "readonly").objectStore(H.PENDING).get(e);
      i.onsuccess = () => n(i.result ?? null), i.onerror = () => r(/* @__PURE__ */ new Error("Failed to get pending operation"));
    });
  }
  async exchangePut(e, t, n = {}) {
    const r = await this.open(), i = {
      id: Z(),
      key: e,
      value: t,
      owner: this._channelName,
      sharedWith: n.sharedWith ?? ["*"],
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    return new Promise((s, o) => {
      const a = r.transaction(H.EXCHANGE, "readwrite"), l = a.objectStore(H.EXCHANGE), c = l.index("key").get(e);
      c.onsuccess = () => {
        const u = c.result;
        u && (i.id = u.id, i.version = u.version + 1, i.createdAt = u.createdAt), l.put(i);
      }, a.oncomplete = () => {
        this._exchangeUpdates.next(i), s(i.id);
      }, a.onerror = () => o(/* @__PURE__ */ new Error("Failed to put exchange data"));
    });
  }
  async exchangeGet(e) {
    const t = await this.open();
    return new Promise((n, r) => {
      const i = t.transaction(H.EXCHANGE, "readonly").objectStore(H.EXCHANGE).index("key").get(e);
      i.onsuccess = () => {
        const s = i.result;
        if (!s) {
          n(null);
          return;
        }
        if (!this._canAccessExchange(s)) {
          n(null);
          return;
        }
        n(s.value);
      }, i.onerror = () => r(/* @__PURE__ */ new Error("Failed to get exchange data"));
    });
  }
  async exchangeDelete(e) {
    const t = await this.open();
    return new Promise((n, r) => {
      const i = t.transaction(H.EXCHANGE, "readwrite"), s = i.objectStore(H.EXCHANGE), o = s.index("key").get(e);
      o.onsuccess = () => {
        const a = o.result;
        if (!a) {
          n(!1);
          return;
        }
        if (a.owner !== this._channelName) {
          n(!1);
          return;
        }
        s.delete(a.id);
      }, i.oncomplete = () => n(!0), i.onerror = () => r(/* @__PURE__ */ new Error("Failed to delete exchange data"));
    });
  }
  async exchangeLock(e, t = {}) {
    const n = await this.open(), r = t.timeout ?? 3e4;
    return new Promise((i, s) => {
      const o = n.transaction(H.EXCHANGE, "readwrite"), a = o.objectStore(H.EXCHANGE), l = a.index("key").get(e);
      l.onsuccess = () => {
        const c = l.result;
        if (!c) {
          i(!1);
          return;
        }
        if (c.lock && c.lock.holder !== this._channelName && c.lock.expiresAt > Date.now()) {
          i(!1);
          return;
        }
        c.lock = {
          holder: this._channelName,
          acquiredAt: Date.now(),
          expiresAt: Date.now() + r
        }, c.updatedAt = Date.now(), a.put(c);
      }, o.oncomplete = () => i(!0), o.onerror = () => s(/* @__PURE__ */ new Error("Failed to acquire lock"));
    });
  }
  async exchangeUnlock(e) {
    const t = await this.open();
    return new Promise((n, r) => {
      const i = t.transaction(H.EXCHANGE, "readwrite"), s = i.objectStore(H.EXCHANGE), o = s.index("key").get(e);
      o.onsuccess = () => {
        const a = o.result;
        a && a.lock?.holder === this._channelName && (delete a.lock, a.updatedAt = Date.now(), s.put(a));
      }, i.oncomplete = () => n(), i.onerror = () => r(/* @__PURE__ */ new Error("Failed to release lock"));
    });
  }
  _canAccessExchange(e) {
    return e.owner === this._channelName || e.sharedWith.includes("*") ? !0 : e.sharedWith.includes(this._channelName);
  }
  async beginTransaction() {
    return new hb(this);
  }
  async executeTransaction(e) {
    const t = await this.open(), n = new Set(e.map((r) => r.store));
    return new Promise((r, i) => {
      const s = t.transaction(Array.from(n), "readwrite");
      for (const o of e) {
        const a = s.objectStore(o.store);
        switch (o.type) {
          case "put":
            o.value !== void 0 && a.put(o.value);
            break;
          case "delete":
            o.key !== void 0 && a.delete(o.key);
            break;
          case "update":
            if (o.key !== void 0) {
              const l = a.get(o.key);
              l.onsuccess = () => {
                l.result && o.value && a.put({
                  ...l.result,
                  ...o.value
                });
              };
            }
            break;
        }
      }
      s.oncomplete = () => r(), s.onerror = () => i(/* @__PURE__ */ new Error("Transaction failed"));
    });
  }
  onMessageUpdate(e) {
    return this._messageUpdates.subscribe({ next: e });
  }
  onExchangeUpdate(e) {
    return this._exchangeUpdates.subscribe({ next: e });
  }
  async cleanupExpired() {
    const e = await this.open(), t = Date.now();
    return new Promise((n, r) => {
      const i = e.transaction([H.MESSAGES, H.MAILBOX], "readwrite"), s = i.objectStore(H.MESSAGES), o = i.objectStore(H.MAILBOX);
      let a = 0;
      const l = s.openCursor();
      l.onsuccess = () => {
        const u = l.result;
        if (u) {
          const d = u.value;
          d.expiresAt && d.expiresAt < t && (u.delete(), a++), u.continue();
        }
      };
      const c = o.openCursor();
      c.onsuccess = () => {
        const u = c.result;
        if (u) {
          const d = u.value;
          d.expiresAt && d.expiresAt < t && (u.delete(), a++), u.continue();
        }
      }, i.oncomplete = () => n(a), i.onerror = () => r(/* @__PURE__ */ new Error("Failed to cleanup expired"));
    });
  }
}, hb = class {
  _storage;
  _operations = [];
  _isCommitted = !1;
  _isRolledBack = !1;
  constructor(e) {
    this._storage = e;
  }
  put(e, t) {
    return this._checkState(), this._operations.push({
      id: Z(),
      type: "put",
      store: e,
      value: t,
      timestamp: Date.now()
    }), this;
  }
  delete(e, t) {
    return this._checkState(), this._operations.push({
      id: Z(),
      type: "delete",
      store: e,
      key: t,
      timestamp: Date.now()
    }), this;
  }
  update(e, t, n) {
    return this._checkState(), this._operations.push({
      id: Z(),
      type: "update",
      store: e,
      key: t,
      value: n,
      timestamp: Date.now()
    }), this;
  }
  async commit() {
    if (this._checkState(), this._operations.length === 0) {
      this._isCommitted = !0;
      return;
    }
    await this._storage.executeTransaction(this._operations), this._isCommitted = !0;
  }
  rollback() {
    this._operations = [], this._isRolledBack = !0;
  }
  get operationCount() {
    return this._operations.length;
  }
  _checkState() {
    if (this._isCommitted) throw new Error("Transaction already committed");
    if (this._isRolledBack) throw new Error("Transaction already rolled back");
  }
}, na = /* @__PURE__ */ new Map();
function pb(e) {
  return na.has(e) || na.set(e, new db(e)), na.get(e);
}
var Oc = Jf(), yb = Oc.length > 0 ? new URL("../transport/Worker.ts", Oc) : "", id = class {
  _channel;
  _context;
  _options;
  _connection;
  _storage;
  constructor(e, t, n = {}) {
    this._channel = e, this._context = t, this._options = n, this._connection = cb(e), this._storage = pb(e);
  }
  async request(e, t, n, r = {}) {
    let i = typeof e == "string" ? [e] : e, s = t, o = n;
    return Array.isArray(t) && sd(e) && (r = n, o = t, s = e, i = []), this._context.getHost()?.request(i, s, o, r, this._channel);
  }
  async doImportModule(e, t = {}) {
    return this.request([], G.IMPORT, [e], t);
  }
  async deferMessage(e, t = {}) {
    return this._storage.defer({
      channel: this._channel,
      sender: this._context.hostName,
      type: "request",
      payload: e
    }, t);
  }
  async getPendingMessages() {
    return this._storage.getDeferredMessages(this._channel, { status: "pending" });
  }
  get connection() {
    return this._connection;
  }
  get channelName() {
    return this._channel;
  }
  get context() {
    return this._context;
  }
}, Kt = class {
  _channel;
  _context;
  _options;
  _connection;
  _unified;
  get _forResolves() {
    return this._unified.__getPrivate("_pending");
  }
  get _subscriptions() {
    return this._unified.__getPrivate("_subscriptions");
  }
  get _broadcasts() {
    return this._unified.__getPrivate("_transports");
  }
  constructor(e, t, n = {}) {
    this._channel = e, this._context = t, this._options = n, this._connection = rd().getOrCreate(e, "internal", n), this._unified = new Kf({
      name: e,
      autoListen: !1,
      timeout: n?.timeout
    });
  }
  createRemoteChannel(e, t = {}, n) {
    const r = vb(n ?? this._context.$createOrUseExistingRemote(e, t, n ?? null)?.messageChannel?.port1), i = ad(r?.target ?? r);
    return this._unified.listen(r?.target, { targetChannel: e }), r && (this._broadcasts?.set?.(e, r), i === "self" && typeof postMessage > "u" || this._unified.connect(r, { targetChannel: e }), this._context.$registerConnection({
      localChannel: this._channel,
      remoteChannel: e,
      sender: this._channel,
      direction: "outgoing",
      transportType: i
    }), this.notifyChannel(e, {
      contextId: this._context.id,
      contextName: this._context.hostName
    }, "connect")), new id(e, this._context, t);
  }
  getChannel() {
    return this._channel;
  }
  get connection() {
    return this._connection;
  }
  request(e, t, n, r = {}, i = "worker") {
    let s = typeof e == "string" ? [e] : e, o = n;
    return Array.isArray(t) && sd(e) && (i = r, r = n, o = t, t = e, s = []), this._unified.invoke(i, t, s ?? [], Array.isArray(o) ? o : [o]);
  }
  resolveResponse(e, t) {
    this._forResolves.get(e)?.resolve?.(t);
    const n = this._forResolves.get(e)?.promise;
    return this._forResolves.delete(e), n;
  }
  async handleAndResponse(e, t, n) {
  }
  notifyChannel(e, t = {}, n = "notify") {
    return this._unified.notify(e, {
      ...t,
      from: this._channel,
      to: e
    }, n);
  }
  getConnectedChannels() {
    return this._unified.connectedChannels;
  }
  close() {
    this._subscriptions.forEach((e) => e.unsubscribe()), this._forResolves.clear(), this._broadcasts?.values?.()?.forEach((e) => e.close?.()), this._broadcasts?.clear?.(), this._unified.close();
  }
  get unified() {
    return this._unified;
  }
}, mb = class {
  _options;
  _id = Z();
  _hostName;
  _host = null;
  _endpoints = /* @__PURE__ */ new Map();
  _unifiedByChannel = /* @__PURE__ */ new Map();
  _unifiedConnectionSubs = /* @__PURE__ */ new Map();
  _remoteChannels = /* @__PURE__ */ new Map();
  _deferredChannels = /* @__PURE__ */ new Map();
  _connectionEvents = new He({ bufferSize: 200 });
  _connectionRegistry = new Yf(() => Z(), (e) => this._emitConnectionEvent(e));
  _closed = !1;
  _globalSelf = null;
  constructor(e = {}) {
    this._options = e, this._hostName = e.name ?? `ctx-${this._id.slice(0, 8)}`, e.useGlobalSelf !== !1 && (this._globalSelf = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : null);
  }
  initHost(e) {
    if (this._host && !e) return this._host;
    const t = e ?? this._hostName;
    if (this._hostName = t, this._endpoints.has(t))
      return this._host = this._endpoints.get(t).handler, this._host;
    this._host = new Kt(t, this, this._options.defaultOptions);
    const n = {
      name: t,
      handler: this._host,
      connection: this._host.connection,
      subscriptions: [],
      ready: Promise.resolve(null),
      unified: this._host.unified
    };
    return this._endpoints.set(t, n), this._registerUnifiedChannel(t, this._host.unified), this._host;
  }
  getHost() {
    return this._host ?? this.initHost();
  }
  get hostName() {
    return this._hostName;
  }
  get id() {
    return this._id;
  }
  get onConnection() {
    return this._connectionEvents;
  }
  subscribeConnections(e) {
    return this._connectionEvents.subscribe(e);
  }
  notifyConnections(e = {}, t = {}) {
    let n = 0;
    for (const r of this._endpoints.values()) {
      const i = r.handler.getConnectedChannels();
      for (const s of i) {
        if (t.localChannel && t.localChannel !== r.name || t.remoteChannel && t.remoteChannel !== s) continue;
        const o = this.queryConnections({
          localChannel: r.name,
          remoteChannel: s,
          status: "active"
        })[0];
        t.sender && o?.sender !== t.sender || t.transportType && o?.transportType !== t.transportType || t.channel && t.channel !== r.name && t.channel !== s || r.handler.notifyChannel(s, e, "notify") && n++;
      }
    }
    return n;
  }
  queryConnections(e = {}) {
    return this._connectionRegistry.query(e).map((t) => ({
      ...t,
      contextId: this._id
    }));
  }
  createChannel(e, t = {}) {
    if (this._endpoints.has(e)) return this._endpoints.get(e);
    const n = new Kt(e, this, {
      ...this._options.defaultOptions,
      ...t
    }), r = {
      name: e,
      handler: n,
      connection: n.connection,
      subscriptions: [],
      ready: Promise.resolve(null),
      unified: n.unified
    };
    return this._endpoints.set(e, r), this._registerUnifiedChannel(e, n.unified), r;
  }
  createChannels(e, t = {}) {
    const n = /* @__PURE__ */ new Map();
    for (const r of e) n.set(r, this.createChannel(r, t));
    return n;
  }
  getChannel(e) {
    return this._endpoints.get(e);
  }
  getOrCreateChannel(e, t = {}) {
    return this._endpoints.get(e) ?? this.createChannel(e, t);
  }
  hasChannel(e) {
    return this._endpoints.has(e);
  }
  getChannelNames() {
    return [...this._endpoints.keys()];
  }
  get size() {
    return this._endpoints.size;
  }
  defer(e, t) {
    this._deferredChannels.set(e, t);
  }
  async initDeferred(e) {
    const t = this._deferredChannels.get(e);
    if (!t) return null;
    const n = await t();
    return this._endpoints.set(e, n), this._deferredChannels.delete(e), n;
  }
  isDeferred(e) {
    return this._deferredChannels.has(e);
  }
  async getChannelAsync(e) {
    return this._endpoints.has(e) ? this._endpoints.get(e) : this._deferredChannels.has(e) ? this.initDeferred(e) : null;
  }
  async addWorker(e, t, n = {}) {
    const r = Ic(t);
    if (!r) throw new Error(`Failed to create worker for channel: ${e}`);
    const i = new Kt(e, this, {
      ...this._options.defaultOptions,
      ...n
    }), s = i.createRemoteChannel(e, n, r), o = {
      name: e,
      handler: i,
      connection: i.connection,
      subscriptions: [],
      transportType: "worker",
      ready: Promise.resolve(s),
      unified: i.unified
    };
    return this._endpoints.set(e, o), this._registerUnifiedChannel(e, i.unified), this._remoteChannels.set(e, {
      channel: e,
      context: this,
      remote: Promise.resolve(s),
      transport: r,
      transportType: "worker"
    }), o;
  }
  async addPort(e, t, n = {}) {
    const r = new Kt(e, this, {
      ...this._options.defaultOptions,
      ...n
    });
    t.start?.();
    const i = r.createRemoteChannel(e, n, t), s = {
      name: e,
      handler: r,
      connection: r.connection,
      subscriptions: [],
      transportType: "message-port",
      ready: Promise.resolve(i),
      unified: r.unified
    };
    return this._endpoints.set(e, s), this._registerUnifiedChannel(e, r.unified), this._remoteChannels.set(e, {
      channel: e,
      context: this,
      remote: Promise.resolve(i),
      transport: t,
      transportType: "message-port"
    }), s;
  }
  async addBroadcast(e, t, n = {}) {
    const r = new BroadcastChannel(t ?? e), i = new Kt(e, this, {
      ...this._options.defaultOptions,
      ...n
    }), s = i.createRemoteChannel(e, n, r), o = {
      name: e,
      handler: i,
      connection: i.connection,
      subscriptions: [],
      transportType: "broadcast",
      ready: Promise.resolve(s),
      unified: i.unified
    };
    return this._endpoints.set(e, o), this._registerUnifiedChannel(e, i.unified), this._remoteChannels.set(e, {
      channel: e,
      context: this,
      remote: Promise.resolve(s),
      transport: r,
      transportType: "broadcast"
    }), o;
  }
  addSelfChannel(e, t = {}) {
    const n = new Kt(e, this, {
      ...this._options.defaultOptions,
      ...t
    }), r = this._globalSelf ?? (typeof self < "u" ? self : null), i = {
      name: e,
      handler: n,
      connection: n.connection,
      subscriptions: [],
      transportType: "self",
      ready: Promise.resolve(r ? n.createRemoteChannel(e, t, r) : null),
      unified: n.unified
    };
    return this._endpoints.set(e, i), this._registerUnifiedChannel(e, n.unified), i;
  }
  async addTransport(e, t) {
    const n = t.options ?? {};
    switch (t.type) {
      case "worker":
        if (!t.worker) throw new Error("Worker required for worker transport");
        return this.addWorker(e, t.worker, n);
      case "message-port":
        if (!t.port) throw new Error("Port required for message-port transport");
        return this.addPort(e, t.port, n);
      case "broadcast":
        const r = typeof t.broadcast == "string" ? t.broadcast : void 0;
        return this.addBroadcast(e, r, n);
      case "self":
        return this.addSelfChannel(e, n);
      default:
        return this.createChannel(e, n);
    }
  }
  createChannelPair(e, t, n = {}) {
    const r = new MessageChannel(), i = new Kt(e, this, {
      ...this._options.defaultOptions,
      ...n
    }), s = new Kt(t, this, {
      ...this._options.defaultOptions,
      ...n
    });
    r.port1.start(), r.port2.start();
    const o = Promise.resolve(i.createRemoteChannel(t, n, r.port1)), a = Promise.resolve(s.createRemoteChannel(e, n, r.port2)), l = {
      name: e,
      handler: i,
      connection: i.connection,
      subscriptions: [],
      transportType: "message-port",
      ready: o,
      unified: i.unified
    }, c = {
      name: t,
      handler: s,
      connection: s.connection,
      subscriptions: [],
      transportType: "message-port",
      ready: a,
      unified: s.unified
    };
    return this._endpoints.set(e, l), this._endpoints.set(t, c), this._registerUnifiedChannel(e, i.unified), this._registerUnifiedChannel(t, s.unified), {
      channel1: l,
      channel2: c,
      messageChannel: r
    };
  }
  get globalSelf() {
    return this._globalSelf;
  }
  async connectRemote(e, t = {}, n) {
    return this.initHost(), this._host.createRemoteChannel(e, t, n);
  }
  async importModuleInChannel(e, t, n = {}, r) {
    return (await this.connectRemote(e, n.channelOptions, r))?.doImportModule?.(t, n.importOptions);
  }
  $createOrUseExistingRemote(e, t = {}, n) {
    if (e == null || n) return null;
    if (this._remoteChannels.has(e)) return this._remoteChannels.get(e);
    const r = new MessageChannel(), i = Bi(new Promise((o) => {
      const a = Ic(yb);
      a?.addEventListener?.("message", (l) => {
        l.data.type === "channelCreated" && (r.port1?.start?.(), o(new id(l.data.channel, this, t)));
      }), a?.postMessage?.({
        type: "createChannel",
        channel: e,
        sender: this._hostName,
        options: t,
        messagePort: r.port2
      }, { transfer: [r.port2] });
    })), s = {
      channel: e,
      context: this,
      messageChannel: r,
      remote: i
    };
    return this._remoteChannels.set(e, s), s;
  }
  $registerConnection(e) {
    return {
      ...this._connectionRegistry.register(e),
      contextId: this._id
    };
  }
  $markNotified(e) {
    const t = this._connectionRegistry.register({
      localChannel: e.localChannel,
      remoteChannel: e.remoteChannel,
      sender: e.sender,
      direction: e.direction,
      transportType: e.transportType
    });
    this._connectionRegistry.markNotified(t, e.payload);
  }
  $observeSignal(e) {
    const t = ((e.payload?.type ?? "notify") === "connect", "incoming");
    this.$markNotified({
      localChannel: e.localChannel,
      remoteChannel: e.remoteChannel,
      sender: e.sender,
      direction: t,
      transportType: e.transportType,
      payload: e.payload
    });
  }
  $forwardUnifiedConnectionEvent(e, t) {
    const n = t.connection.transportType ?? "internal", r = this._connectionRegistry.register({
      localChannel: t.connection.localChannel || e,
      remoteChannel: t.connection.remoteChannel,
      sender: t.connection.sender,
      direction: t.connection.direction,
      transportType: n,
      metadata: t.connection.metadata
    });
    t.type === "notified" ? this._connectionRegistry.markNotified(r, t.payload) : t.type === "disconnected" && this._connectionRegistry.closeByChannel(t.connection.localChannel);
  }
  closeChannel(e) {
    const t = this._endpoints.get(e);
    return t ? (t.subscriptions.forEach((n) => n.unsubscribe()), t.handler.close(), t.transport?.detach(), this._unifiedConnectionSubs.get(e)?.unsubscribe(), this._unifiedConnectionSubs.delete(e), this._unifiedByChannel.delete(e), this._endpoints.delete(e), e === this._hostName && (this._host = null), this._connectionRegistry.closeByChannel(e), !0) : !1;
  }
  close() {
    if (!this._closed) {
      this._closed = !0;
      for (const [e] of this._endpoints) this.closeChannel(e);
      this._remoteChannels.clear(), this._host = null, this._unifiedConnectionSubs.forEach((e) => e.unsubscribe()), this._unifiedConnectionSubs.clear(), this._unifiedByChannel.clear(), this._connectionRegistry.clear(), this._connectionEvents.complete();
    }
  }
  get closed() {
    return this._closed;
  }
  _registerUnifiedChannel(e, t) {
    this._unifiedByChannel.set(e, t), this._unifiedConnectionSubs.get(e)?.unsubscribe();
    const n = t.subscribeConnections((r) => {
      this.$forwardUnifiedConnectionEvent(e, r);
    });
    this._unifiedConnectionSubs.set(e, n);
  }
  _emitConnectionEvent(e) {
    this._connectionEvents.next({
      ...e,
      connection: {
        ...e.connection,
        contextId: this._id
      }
    });
  }
};
function sd(e) {
  return [...Object.values(G)].includes(e);
}
function vb(e) {
  if (!e) return null;
  if (od(e)) return e;
  const t = e, n = ad(t);
  return {
    target: t,
    targetChannel: "unknown",
    transportType: n === "internal" ? "self" : n,
    sender: (r, i) => {
      if (typeof WebSocket < "u" && t instanceof WebSocket) {
        t.send(JSON.stringify(r));
        return;
      }
      t.postMessage?.(r, i?.length ? { transfer: i } : void 0);
    },
    postMessage: (r, i) => {
      t.postMessage?.(r, i);
    },
    addEventListener: t.addEventListener?.bind(t),
    removeEventListener: t.removeEventListener?.bind(t),
    start: t.start?.bind(t),
    close: t.close?.bind(t)
  };
}
function od(e) {
  return !!e && typeof e == "object" && "target" in e && typeof e.postMessage == "function";
}
function ad(e) {
  const t = od(e) ? e.target : e;
  return t ? t === "chrome-runtime" ? "chrome-runtime" : t === "chrome-tabs" ? "chrome-tabs" : t === "chrome-port" ? "chrome-port" : t === "chrome-external" ? "chrome-external" : typeof MessagePort < "u" && t instanceof MessagePort ? "message-port" : typeof BroadcastChannel < "u" && t instanceof BroadcastChannel ? "broadcast" : typeof Worker < "u" && t instanceof Worker ? "worker" : typeof WebSocket < "u" && t instanceof WebSocket ? "websocket" : typeof chrome < "u" && typeof t == "object" && t && typeof t.postMessage == "function" && t.onMessage?.addListener ? "chrome-port" : typeof self < "u" && t === self ? "self" : "internal" : "internal";
}
function Ic(e) {
  if (e instanceof Worker) return e;
  if (e instanceof URL) return new Worker(e.href, { type: "module" });
  if (typeof e == "function") try {
    return new e({ type: "module" });
  } catch {
    return e({ type: "module" });
  }
  return typeof e == "string" ? e.startsWith("/") ? new Worker(us(e.replace(/^\//, "./")), { type: "module" }) : URL.canParse(e) || e.startsWith("./") ? new Worker(us(e), { type: "module" }) : new Worker(URL.createObjectURL(new Blob([e], { type: "application/javascript" })), { type: "module" }) : e instanceof Blob || e instanceof File ? new Worker(URL.createObjectURL(e), { type: "module" }) : e ?? (typeof self < "u" ? self : null);
}
var gb = /* @__PURE__ */ new Map();
function bb(e = {}) {
  const t = new mb(e);
  return e.name && gb.set(e.name, t), t;
}
var wb = class {
  _context;
  _config;
  _subscriptions = [];
  _incomingConnections = new He({ bufferSize: 100 });
  _channelCreated = new He({ bufferSize: 100 });
  _channelClosed = new He();
  constructor(e = {}) {
    this._config = {
      name: e.name ?? "worker",
      workerName: e.workerName ?? `worker-${Z().slice(0, 8)}`,
      autoAcceptChannels: e.autoAcceptChannels ?? !0,
      allowedChannels: e.allowedChannels ?? [],
      maxChannels: e.maxChannels ?? 100,
      autoConnect: e.autoConnect ?? !0,
      useGlobalSelf: !0,
      defaultOptions: e.defaultOptions ?? {},
      isolatedStorage: e.isolatedStorage ?? !1,
      ...e
    }, this._context = bb({
      name: this._config.name,
      useGlobalSelf: !0,
      defaultOptions: e.defaultOptions
    }), this._setupMessageListener();
  }
  get onConnection() {
    return this._incomingConnections;
  }
  get onChannelCreated() {
    return this._channelCreated;
  }
  get onChannelClosed() {
    return this._channelClosed;
  }
  subscribeConnections(e) {
    return this._incomingConnections.subscribe(e);
  }
  subscribeChannelCreated(e) {
    return this._channelCreated.subscribe(e);
  }
  acceptConnection(e) {
    if (!this._canAcceptChannel(e.channel)) return null;
    const t = this._context.createChannel(e.channel, e.options);
    return e.port && (e.port.start?.(), t.handler.createRemoteChannel(e.sender, e.options, e.port)), this._channelCreated.next({
      channel: e.channel,
      endpoint: t,
      sender: e.sender,
      timestamp: Date.now()
    }), this._postChannelCreated(e.channel, e.sender, e.id), t;
  }
  createChannel(e, t) {
    return this._context.createChannel(e, t);
  }
  getChannel(e) {
    return this._context.getChannel(e);
  }
  hasChannel(e) {
    return this._context.hasChannel(e);
  }
  getChannelNames() {
    return this._context.getChannelNames();
  }
  queryConnections(e = {}) {
    return this._context.queryConnections(e);
  }
  notifyConnections(e = {}, t = {}) {
    return this._context.notifyConnections(e, t);
  }
  closeChannel(e) {
    const t = this._context.closeChannel(e);
    return t && this._channelClosed.next({
      channel: e,
      timestamp: Date.now()
    }), t;
  }
  get context() {
    return this._context;
  }
  get config() {
    return this._config;
  }
  _setupMessageListener() {
    addEventListener("message", ((e) => {
      this._handleIncomingMessage(e);
    }));
  }
  _handleIncomingMessage(e) {
    const t = e.data;
    if (!(!t || typeof t != "object"))
      switch (t.type) {
        case "createChannel":
          this._handleCreateChannel(t);
          break;
        case "connectChannel":
          this._handleConnectChannel(t);
          break;
        case "addPort":
          this._handleAddPort(t);
          break;
        case "listChannels":
          this._handleListChannels(t);
          break;
        case "closeChannel":
          this._handleCloseChannel(t);
          break;
        case "ping":
          postMessage({
            type: "pong",
            id: t.id,
            timestamp: Date.now()
          });
          break;
        default:
          t.channel && this._context.hasChannel(t.channel) && this._context.getChannel(t.channel)?.handler?.handleAndResponse?.(t.payload, t.reqId);
      }
  }
  _handleCreateChannel(e) {
    const t = {
      id: e.reqId ?? Z(),
      channel: e.channel,
      sender: e.sender ?? "unknown",
      type: "channel",
      port: e.messagePort,
      timestamp: Date.now(),
      options: e.options
    };
    this._incomingConnections.next(t), this._config.autoAcceptChannels && this.acceptConnection(t);
  }
  _handleConnectChannel(e) {
    const t = {
      id: e.reqId ?? Z(),
      channel: e.channel,
      sender: e.sender ?? "unknown",
      type: e.portType ?? "channel",
      port: e.port,
      timestamp: Date.now(),
      options: e.options
    };
    if (this._incomingConnections.next(t), this._config.autoAcceptChannels && this._canAcceptChannel(e.channel)) {
      const n = this._context.getOrCreateChannel(e.channel, e.options);
      e.port && (e.port.start?.(), n.handler.createRemoteChannel(e.sender, e.options, e.port)), postMessage({
        type: "channelConnected",
        channel: e.channel,
        reqId: e.reqId
      });
    }
  }
  _handleAddPort(e) {
    if (!e.port || !e.channel) return;
    const t = {
      id: e.reqId ?? Z(),
      channel: e.channel,
      sender: e.sender ?? "unknown",
      type: "port",
      port: e.port,
      timestamp: Date.now(),
      options: e.options
    };
    this._incomingConnections.next(t), this._config.autoAcceptChannels && this.acceptConnection(t);
  }
  _handleListChannels(e) {
    postMessage({
      type: "channelList",
      channels: this.getChannelNames(),
      reqId: e.reqId
    });
  }
  _handleCloseChannel(e) {
    e.channel && (this.closeChannel(e.channel), postMessage({
      type: "channelClosed",
      channel: e.channel,
      reqId: e.reqId
    }));
  }
  _canAcceptChannel(e) {
    return this._context.size >= this._config.maxChannels ? !1 : this._config.allowedChannels.length > 0 ? this._config.allowedChannels.includes(e) : !0;
  }
  _postChannelCreated(e, t, n) {
    postMessage({
      type: "channelCreated",
      channel: e,
      sender: t,
      reqId: n,
      timestamp: Date.now()
    });
  }
  close() {
    this._subscriptions.forEach((e) => e.unsubscribe()), this._subscriptions = [], this._incomingConnections.complete(), this._channelCreated.complete(), this._channelClosed.complete(), this._context.close();
  }
}, ra = null;
function Sb(e) {
  return ra || (ra = new wb(e)), ra;
}
var Yx = Sb({ name: "worker" }), Is = class {
  _channelName;
  _config;
  _port;
  _subs = /* @__PURE__ */ new Set();
  _pending = /* @__PURE__ */ new Map();
  _listening = !1;
  _cleanup = null;
  _portId = Z();
  _state = new He();
  _keepAliveTimer = null;
  constructor(e, t, n = {}) {
    this._channelName = t, this._config = n, this._port = e, this._setupPort(), n.autoStart !== !1 && this.start();
  }
  _setupPort() {
    const e = (n) => {
      const r = n.data;
      if (r.type === "response" && r.reqId) {
        const i = this._pending.get(r.reqId);
        if (i) {
          this._pending.delete(r.reqId), r.payload?.error ? i.reject(new Error(r.payload.error)) : i.resolve(r.payload?.result ?? r.payload);
          return;
        }
      }
      if (r.type === "signal" && r.payload?.action === "ping") {
        this.send({
          id: Z(),
          channel: this._channelName,
          sender: this._portId,
          type: "signal",
          payload: { action: "pong" }
        });
        return;
      }
      r.portId = r.portId ?? this._portId;
      for (const i of this._subs) try {
        i.next?.(r);
      } catch (s) {
        i.error?.(s);
      }
    }, t = () => {
      this._state.next("error");
      const n = /* @__PURE__ */ new Error("Port error");
      for (const r of this._subs) r.error?.(n);
    };
    this._port.addEventListener("message", e), this._port.addEventListener("messageerror", t), this._cleanup = () => {
      this._port.removeEventListener("message", e), this._port.removeEventListener("messageerror", t);
    };
  }
  start() {
    this._listening || (this._port.start(), this._listening = !0, this._state.next("ready"), this._config.keepAlive && this._startKeepAlive());
  }
  send(e, t) {
    const { transferable: n, ...r } = e;
    this._port.postMessage({
      ...r,
      portId: this._portId
    }, t ?? []);
  }
  request(e) {
    const t = e.reqId ?? Z();
    return new Promise((n, r) => {
      const i = setTimeout(() => {
        this._pending.delete(t), r(/* @__PURE__ */ new Error("Request timeout"));
      }, this._config.timeout ?? 3e4);
      this._pending.set(t, {
        resolve: (s) => {
          clearTimeout(i), n(s);
        },
        reject: (s) => {
          clearTimeout(i), r(s);
        },
        timestamp: Date.now()
      }), this.send({
        ...e,
        reqId: t,
        type: "request"
      });
    });
  }
  subscribe(e) {
    const t = typeof e == "function" ? { next: e } : e;
    return this._subs.add(t), {
      closed: !1,
      unsubscribe: () => {
        this._subs.delete(t);
      }
    };
  }
  _startKeepAlive() {
    this._keepAliveTimer = setInterval(() => {
      this.send({
        id: Z(),
        channel: this._channelName,
        sender: this._portId,
        type: "signal",
        payload: { action: "ping" }
      });
    }, this._config.keepAliveInterval ?? 3e4);
  }
  close() {
    this._keepAliveTimer && (clearInterval(this._keepAliveTimer), this._keepAliveTimer = null), this._cleanup?.(), this._subs.forEach((e) => e.complete?.()), this._subs.clear(), this._port.close(), this._state.next("closed");
  }
  get port() {
    return this._port;
  }
  get portId() {
    return this._portId;
  }
  get isListening() {
    return this._listening;
  }
  get state() {
    return this._state;
  }
  get channelName() {
    return this._channelName;
  }
};
function fl(e, t) {
  const n = new MessageChannel();
  return {
    local: new Is(n.port1, e, t),
    remote: n.port2,
    transfer: () => n.port2
  };
}
var xb = class {
  _defaultConfig;
  _channels = /* @__PURE__ */ new Map();
  _mainPort = null;
  _subs = /* @__PURE__ */ new Set();
  constructor(e = {}) {
    this._defaultConfig = e;
  }
  create(e, t) {
    const n = fl(e, {
      ...this._defaultConfig,
      ...t
    });
    return n.local.subscribe({ next: (r) => {
      for (const i of this._subs) try {
        i.next?.(r);
      } catch (s) {
        i.error?.(s);
      }
    } }), this._channels.set(e, n.local), n;
  }
  add(e, t, n) {
    const r = new Is(t, e, {
      ...this._defaultConfig,
      ...n
    });
    return r.subscribe({ next: (i) => {
      for (const s of this._subs) try {
        s.next?.(i);
      } catch (o) {
        s.error?.(o);
      }
    } }), this._channels.set(e, r), r;
  }
  get(e) {
    return this._channels.get(e);
  }
  send(e, t, n) {
    this._channels.get(e)?.send(t, n);
  }
  broadcast(e, t) {
    for (const n of this._channels.values()) n.send(e, t);
  }
  request(e, t) {
    const n = this._channels.get(e);
    return n ? n.request(t) : Promise.reject(/* @__PURE__ */ new Error(`Channel ${e} not found`));
  }
  subscribe(e) {
    const t = typeof e == "function" ? { next: e } : e;
    return this._subs.add(t), {
      closed: !1,
      unsubscribe: () => {
        this._subs.delete(t);
      }
    };
  }
  remove(e) {
    const t = this._channels.get(e);
    t && (t.close(), this._channels.delete(e));
  }
  close() {
    this._subs.forEach((e) => e.complete?.()), this._subs.clear();
    for (const e of this._channels.values()) e.close();
    this._channels.clear();
  }
  get channelNames() {
    return Array.from(this._channels.keys());
  }
  get size() {
    return this._channels.size;
  }
}, Nc = class {
  _target;
  _channelName;
  _config;
  _transport = null;
  _state = new He();
  _handshakeComplete = !1;
  constructor(e, t, n = {}) {
    this._target = e, this._channelName = t, this._config = n;
  }
  async connect() {
    if (this._transport && this._handshakeComplete) return this._transport;
    this._state.next("connecting");
    const { local: e, remote: t } = fl(this._channelName, this._config);
    return this._target.postMessage({
      type: "port-connect",
      channelName: this._channelName,
      portId: e.portId
    }, this._config.targetOrigin ?? "*", [t]), new Promise((n, r) => {
      const i = setTimeout(() => {
        r(/* @__PURE__ */ new Error("Handshake timeout")), this._state.next("error");
      }, this._config.handshakeTimeout ?? 1e4), s = e.subscribe({ next: (o) => {
        o.type === "signal" && o.payload?.action === "handshake-ack" && (clearTimeout(i), this._handshakeComplete = !0, this._transport = e, this._state.next("connected"), s.unsubscribe(), n(e));
      } });
    });
  }
  static listen(e, t, n) {
    const r = (i) => {
      if (i.data?.type !== "port-connect" || i.data?.channelName !== e || !i.ports[0]) return;
      const s = new Is(i.ports[0], e, n);
      s.send({
        id: Z(),
        channel: e,
        sender: s.portId,
        type: "signal",
        payload: { action: "handshake-ack" }
      }), t(s);
    };
    return globalThis.addEventListener("message", r), () => globalThis.removeEventListener("message", r);
  }
  disconnect() {
    this._transport?.close(), this._transport = null, this._handshakeComplete = !1, this._state.next("disconnected");
  }
  get isConnected() {
    return this._handshakeComplete;
  }
  get state() {
    return this._state;
  }
  get transport() {
    return this._transport;
  }
};
function _b(e, t = []) {
  return Vg({
    request: (n) => e.request(n),
    channelName: e.channelName,
    senderId: e.portId
  }, t);
}
function kb(e, t) {
  const n = Ug(t);
  return e.subscribe({ next: async (r) => {
    if (r.type !== "request" || !r.payload?.path) return;
    const { action: i, path: s, args: o } = r.payload;
    let a, l;
    try {
      a = await n(i, s, o ?? []);
    } catch (c) {
      l = c instanceof Error ? c.message : String(c);
    }
    e.send({
      id: Z(),
      channel: r.sender,
      sender: e.portId,
      type: "response",
      reqId: r.reqId,
      payload: l ? { error: l } : { result: a }
    });
  } });
}
var Kx = {
  create: (e, t, n) => new Is(e, t, n),
  createPair: (e, t) => fl(e, t),
  createPool: (e) => new xb(e),
  createWindowConnector: (e, t, n) => new Nc(e, t, n),
  listen: Nc.listen,
  createProxy: _b,
  expose: kb
}, Eb = class {
  config;
  onChannelReady;
  underlyingChannel = null;
  isConnected = !1;
  requestQueue = [];
  connectionPromise = null;
  connectionResolver = null;
  context;
  constructor(e, t) {
    this.config = e, this.onChannelReady = t, this.context = e.context ?? "unknown";
  }
  async connect(e = null) {
    this.underlyingChannel = e;
  }
  async request(e, t = []) {
    return this.isConnected && this.underlyingChannel ? this.underlyingChannel.request(e, t) : new Promise((n, r) => {
      const i = {
        id: Z(),
        method: e,
        args: t,
        resolve: n,
        reject: r,
        timestamp: Date.now()
      };
      this.requestQueue.push(i), this.connectionPromise || this.connect().catch((s) => {
        this.rejectAllQueued(s);
      });
    });
  }
  async flushQueue() {
    if (!this.underlyingChannel) return;
    const e = [...this.requestQueue];
    this.requestQueue = [];
    for (const t of e) try {
      const n = await this.underlyingChannel.request(t.method, t.args);
      t.resolve(n);
    } catch (n) {
      t.reject(n);
    }
  }
  rejectAllQueued(e) {
    const t = [...this.requestQueue];
    this.requestQueue = [];
    for (const n of t) n.reject(e);
  }
  getQueueStatus() {
    return {
      isConnected: this.isConnected,
      queuedRequests: this.requestQueue.length,
      isConnecting: !!this.connectionPromise && !this.isConnected
    };
  }
  close() {
    this.rejectAllQueued(/* @__PURE__ */ new Error("Channel closed")), this.underlyingChannel?.close(), this.underlyingChannel = null, this.isConnected = !1, this.connectionPromise = null;
  }
}, Cb = async (e) => ({
  async request(t, n = []) {
    return new Promise((r, i) => {
      const s = new BroadcastChannel(`${e.name}-sw-channel`), o = Z(), a = setTimeout(() => {
        s.close(), i(/* @__PURE__ */ new Error(`Service worker request timeout: ${t}`));
      }, 1e4);
      s.onmessage = (l) => {
        const { id: c, result: u, error: d } = l.data;
        c === o && (clearTimeout(a), s.close(), d ? i(new Error(d)) : r(u));
      }, s.postMessage({
        id: o,
        type: "request",
        method: t,
        args: n
      });
    });
  },
  close() {
  }
}), Pb = async (e) => {
  const t = e.context;
  if (t === "service-worker") return Cb(e);
  let n;
  if (typeof e.script == "function") n = e.script();
  else if (e.script instanceof Worker) n = e.script;
  else if (t === "chrome-extension") try {
    n = new Worker(chrome.runtime.getURL(e.script), e.options);
  } catch {
    n = new Worker(us(e.script), e.options);
  }
  else n = new Worker(us(e.script), e.options);
  return await eb(e.name, {}, n);
};
function Ab(e) {
  return new Worker("/assets/OPFS.uniform.worker-CDqHwWLq.js", { name: e?.name });
}
var zi = null, dl = typeof ServiceWorkerGlobalScope < "u" && self instanceof ServiceWorkerGlobalScope, Tb = "opfs-sw-bridge-v1", zc = /* @__PURE__ */ new Map(), Li = null, $i = null, Mb = 0, Rb = () => {
  if (!dl) return null;
  if ($i) return $i;
  try {
    return typeof BroadcastChannel > "u" ? null : ($i = new BroadcastChannel(Tb), $i);
  } catch {
    return null;
  }
}, Ob = (e, t = {}, n = 2500) => {
  const r = Rb();
  if (!r) return Promise.reject(/* @__PURE__ */ new Error("SW OPFS bridge is unavailable"));
  const i = `sw-opfs-${Date.now()}-${++Mb}`;
  return new Promise((s, o) => {
    let a = null;
    const l = (c) => {
      const u = c?.data || {};
      !u || typeof u != "object" || u?.type === "opfs-sw-response" && String(u?.requestId || "") === i && (r.removeEventListener("message", l), a && clearTimeout(a), u?.ok ? s(u?.result) : o(new Error(String(u?.error || "Unknown bridge error"))));
    };
    r.addEventListener("message", l), a = setTimeout(() => {
      r.removeEventListener("message", l), o(/* @__PURE__ */ new Error("SW OPFS bridge timeout"));
    }, n), r.postMessage({
      type: "opfs-sw-request",
      requestId: i,
      action: e,
      payload: t
    });
  });
}, Ib = () => Li || (Li = new Promise(async (e) => {
  if (typeof Worker < "u" && !dl) try {
    const t = await Pb({
      name: "opfs-worker",
      script: Ab
    });
    zi = new Eb("opfs-worker", async () => t, {
      timeout: 3e4,
      retries: 3,
      batching: !0,
      compression: !1
    }), e(zi);
  } catch (t) {
    console.warn("OPFSUniformWorker instantiation failed, falling back to main thread...", t), zi = null, e(null);
  }
  else
    zi = null, e(null);
}), Li), At = {
  readDirectory: async ({ rootId: e, path: t, create: n }) => {
    try {
      const r = await navigator.storage.getDirectory(), i = (t || "").trim().replace(/\/+/g, "/").split("/").filter((a) => a);
      let s = r;
      for (const a of i) s = await s.getDirectoryHandle(a, { create: n });
      const o = [];
      for await (const [a, l] of s.entries()) o.push([a, l]);
      return o;
    } catch (r) {
      return console.warn("Direct readDirectory error:", r), [];
    }
  },
  readFile: async ({ rootId: e, path: t, type: n }) => {
    try {
      const r = await navigator.storage.getDirectory(), i = (t || "").trim().replace(/\/+/g, "/").split("/").filter((l) => l), s = i.pop();
      let o = r;
      for (const l of i) o = await o.getDirectoryHandle(l, { create: !1 });
      const a = await (await o.getFileHandle(s, { create: !1 })).getFile();
      return n === "text" ? await a.text() : n === "arrayBuffer" ? await a.arrayBuffer() : a;
    } catch (r) {
      return console.warn("Direct readFile error:", r), null;
    }
  },
  writeFile: async ({ rootId: e, path: t, data: n }) => {
    try {
      const r = await navigator.storage.getDirectory(), i = (t || "").trim().replace(/\/+/g, "/").split("/").filter((l) => l), s = i.pop();
      let o = r;
      for (const l of i) o = await o.getDirectoryHandle(l, { create: !0 });
      const a = await (await o.getFileHandle(s, { create: !0 })).createWritable();
      return await a.write(n), await a.close(), !0;
    } catch (r) {
      return console.warn("Direct writeFile error:", r), !1;
    }
  },
  remove: async ({ rootId: e, path: t, recursive: n }) => {
    try {
      const r = await navigator.storage.getDirectory(), i = (t || "").trim().replace(/\/+/g, "/").split("/").filter((a) => a), s = i.pop();
      let o = r;
      for (const a of i) o = await o.getDirectoryHandle(a, { create: !1 });
      return await o.removeEntry(s, { recursive: n }), !0;
    } catch {
      return !1;
    }
  },
  copy: async ({ from: e, to: t }) => {
    try {
      const n = async (r, i) => {
        if (r.kind === "directory") for await (const [s, o] of r.entries()) if (o.kind === "directory") {
          const a = await i.getDirectoryHandle(s, { create: !0 });
          await n(o, a);
        } else {
          const a = await o.getFile(), l = await (await i.getFileHandle(s, { create: !0 })).createWritable();
          await l.write(a), await l.close();
        }
        else {
          const s = await r.getFile(), o = await i.createWritable();
          await o.write(s), await o.close();
        }
      };
      return await n(e, t), !0;
    } catch (n) {
      return console.warn("Direct copy error:", n), !1;
    }
  },
  observe: async () => !1,
  unobserve: async () => !0,
  mount: async () => !0,
  unmount: async () => !0
}, It = (e, t = {}, n = []) => dl && At[e] ? Ob(e, t).catch(() => At[e](t)) : new Promise(async (r, i) => {
  try {
    const s = await Ib();
    if (!s)
      return At[e] ? r(At[e](t)) : i(/* @__PURE__ */ new Error("No worker channel available"));
    let o;
    try {
      o = await s.request(e, t);
    } catch (a) {
      if (At[e]) return r(At[e](t));
      throw a;
    }
    if (o === !1 && (e === "writeFile" || e === "remove" || e === "copy") && At[e])
      return r(At[e](t));
    r(o);
  } catch (s) {
    if (At[e]) try {
      return r(At[e](t));
    } catch (o) {
      return i(o);
    }
    i(s);
  }
}), Nb = (e) => {
  if (typeof e != "string") return e;
  e = e?.trim?.() || e, e?.endsWith?.("/") || (e = e?.trim?.()?.split?.("/")?.slice(0, -1)?.join?.("/")?.trim?.() || e);
  const t = e?.trim()?.endsWith("/") ? e : e + "/";
  return t?.startsWith("/") ? t : "/" + t;
}, zb = {
  startIn: "pictures",
  multiple: !1,
  types: [{
    description: "wallpaper",
    accept: { "image/*": [
      ".png",
      ".gif",
      ".jpg",
      ".jpeg",
      ".webp",
      ".jxl"
    ] }
  }]
}, Lb = {
  startIn: "documents",
  multiple: !1,
  types: [{
    description: "files",
    accept: { "application/*": [
      ".txt",
      ".md",
      ".html",
      ".htm",
      ".css",
      ".js",
      ".json",
      ".csv",
      ".xml",
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".webp",
      ".svg",
      ".ico",
      ".mp3",
      ".wav",
      ".mp4",
      ".webm",
      ".pdf",
      ".zip",
      ".rar",
      ".7z"
    ] }
  }]
}, Lc = /* @__PURE__ */ new Map([
  ["/", async () => await navigator?.storage?.getDirectory?.()],
  ["/user/", async () => await navigator?.storage?.getDirectory?.()],
  ["/assets/", async () => (console.warn("Backend related API not implemented!"), null)]
]), Na = /* @__PURE__ */ new Map(), Jx = async (e, t) => {
  const n = e?.trim?.()?.replace?.(/^\//, "")?.trim?.()?.split?.("/")?.filter?.((i) => !!i?.trim?.())?.at?.(0), r = Na?.get(n) ?? await showDirectoryPicker?.({
    mode: "readwrite",
    id: `${n}`
  })?.catch?.(console.warn.bind(console));
  if (r && n && typeof n == "string" && Na?.set?.(n, r), r && typeof localStorage < "u" && localStorage?.setItem?.("opfs.mounted", JSON.stringify([...JSON.parse(localStorage?.getItem?.("opfs.mounted") || "[]"), n])), r && It("mount", {
    id: n,
    handle: r
  }), t && r && n == "user") {
    const i = await navigator?.storage?.getDirectory?.();
    await sr(i, r, {})?.catch?.(console.warn.bind(console));
  }
  return r;
}, Qx = async (e) => {
  typeof localStorage < "u" && localStorage?.setItem?.("opfs.mounted", JSON.stringify(JSON.parse(localStorage?.getItem?.("opfs.mounted") || "[]").filter((t) => t != e))), It("unmount", { id: e });
};
async function li(e, t = "") {
  (e == null || e == null || e?.trim?.()?.length == 0) && (e = "/user/");
  const n = typeof e == "string" ? e?.trim?.()?.replace?.(/^\//, "")?.trim?.()?.split?.("/")?.filter?.((a) => !!a?.trim?.())?.at?.(0) : null;
  if (n && (typeof localStorage < "u" && JSON.parse(localStorage?.getItem?.("opfs.mounted") || "[]").includes(n) && (e = Na?.get(n)), e || (e = await Lc?.get?.(`/${n}/`)?.() ?? await navigator.storage.getDirectory())), e instanceof FileSystemDirectoryHandle) return e;
  const r = t?.trim?.() || "/", i = r.startsWith("/") ? r : "/" + r;
  let s = null, o = 0;
  for (const [a, l] of Lc.entries()) i.startsWith(a) && a.length > o && (s = l, o = a.length);
  try {
    return (s ? await s() : null) || await navigator?.storage?.getDirectory?.();
  } catch (a) {
    return console.warn("Failed to resolve root handle, falling back to OPFS root:", a), await navigator?.storage?.getDirectory?.();
  }
}
function $b(e = "", t) {
  if (!t?.trim()) return e;
  const n = t.trim();
  if (n.startsWith("/")) return n;
  const r = e.split("/").filter((s) => s?.trim()), i = n.split("/").filter((s) => s?.trim());
  for (const s of i) s !== "." && (s === ".." ? r.length > 0 && r.pop() : r.push(s));
  return "/" + r.join("/");
}
async function Lt(e, t, n = "") {
  const r = $b(n, t);
  return {
    rootHandle: await li(e, r),
    resolvedPath: r
  };
}
function nt(e, t, n) {
  return e?.(t, n), null;
}
function je(e, t) {
  console.trace(`[${e}] ${t}`);
}
function Zx(e) {
  return e?.trim?.()?.split?.(".")?.[1];
}
function ld(e) {
  return e?.trim()?.endsWith?.("/") ? "directory" : "file";
}
function e_(e) {
  return {
    txt: "text/plain",
    md: "text/markdown",
    html: "text/html",
    htm: "text/html",
    css: "text/css",
    js: "application/javascript",
    json: "application/json",
    csv: "text/csv",
    xml: "application/xml",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
    ico: "image/x-icon",
    mp3: "audio/mpeg",
    wav: "audio/wav",
    mp4: "video/mp4",
    webm: "video/webm",
    pdf: "application/pdf",
    zip: "application/zip",
    rar: "application/vnd.rar",
    "7z": "application/x-7z-compressed"
  }[e?.split?.(".")?.pop?.()?.toLowerCase?.()] || "application/octet-stream";
}
var Db = (e) => e?.trim?.()?.split?.(".")?.[1]?.trim?.()?.length > 0;
async function zt(e, t, { create: n = !1, basePath: r = "" } = {}, i = je) {
  try {
    const { rootHandle: s, resolvedPath: o } = await Lt(e, t, r), a = yt(o).split("/").filter((c) => !!c?.trim?.());
    a.length > 0 && Db(a[a.length - 1]?.trim?.()) && a?.pop?.();
    let l = s;
    if (a?.length > 0) {
      for (const c of a)
        if (l = await l?.getDirectoryHandle?.(c, { create: n }), !l) break;
    }
    return l;
  } catch (s) {
    return nt(i, "error", `getDirectoryHandle: ${s.message}`);
  }
}
async function Ns(e, t, { create: n = !1, basePath: r = "" } = {}, i = je) {
  try {
    const { rootHandle: s, resolvedPath: o } = await Lt(e, t, r), a = yt(o), l = a.split("/").filter((d) => !!d?.trim?.());
    if (l?.length == 0) return null;
    const c = l.length > 0 ? l[l.length - 1]?.trim?.()?.replace?.(/\s+/g, "-") : "", u = l.length > 1 ? l?.slice(0, -1)?.join?.("/")?.trim?.()?.replace?.(/\s+/g, "-") : "";
    return a?.trim?.()?.endsWith?.("/") ? null : (await zt(s, u, {
      create: n,
      basePath: r
    }, i))?.getFileHandle?.(c, { create: n });
  } catch (s) {
    return nt(i, "error", `getFileHandle: ${s.message}`);
  }
}
async function Fb(e, t, n = {}, r = je) {
  try {
    const { rootHandle: i, resolvedPath: s } = await Lt(e, t, n?.basePath || "");
    if (ld(s) == "directory") {
      const o = await zt(i, s?.trim?.()?.replace?.(/\/$/, ""), n, r);
      if (o) return {
        type: "directory",
        handle: o
      };
    } else {
      const o = await Ns(i, s, n, r);
      if (o) return {
        type: "file",
        handle: o
      };
    }
    return null;
  } catch (i) {
    return nt(r, "error", `getHandler: ${i.message}`);
  }
}
async function t_(e, t, n = {}, r = je) {
  try {
    const { rootHandle: i, resolvedPath: s } = await Lt(e, t, n?.basePath || "");
    return ld(s) == "directory" ? await zt(i, s?.trim?.()?.replace?.(/\/$/, ""), n, r) : await Ns(i, s, n, r);
  } catch (i) {
    return nt(r, "error", `createHandler: ${i.message}`);
  }
}
var ia = /* @__PURE__ */ new Map(), n_ = (e, t, n = console.warn.bind(console)) => {
  if (typeof e?.then == "function") return e?.then?.(t)?.catch?.(n);
  try {
    return t(e);
  } catch (r) {
    return n(r), null;
  }
};
function r_(e, t, n = { create: !1 }, r = je) {
  let i = "", s = be(/* @__PURE__ */ new Map());
  const o = (async () => {
    try {
      const { rootHandle: p, resolvedPath: f } = await Lt(e, t, n?.basePath || "");
      return i = `${p?.name || "root"}:${f}`, {
        rootHandle: p,
        resolvedPath: f
      };
    } catch {
      return {
        rootHandle: null,
        resolvedPath: ""
      };
    }
  })().then(async ({ rootHandle: p, resolvedPath: f }) => {
    if (!f) return null;
    const h = ia.get(i);
    if (h)
      return h.refCount++, s = h.mapCache, h;
    const y = be(/* @__PURE__ */ new Map());
    s = y;
    const b = Z(), m = zt(p, f, n, r), x = async () => {
      const O = yt(f), re = await It("readDirectory", {
        rootId: "",
        path: O,
        create: n.create
      }, p ? [p] : []);
      if (!re) return y;
      const ie = new Map(re);
      for (const ye of y.keys()) ie.has(ye) || y.delete(ye);
      for (const [ye, Me] of ie) y.has(ye) || y.set(ye, Me);
      return y;
    }, k = () => {
      It("unobserve", { id: b }), zc.delete(b), ia.delete(i);
    };
    zc.set(b, (O) => {
      for (const re of O)
        re?.name && (re.type === "modified" || re.type === "created" || re.type === "appeared" ? y.set(re.name, re.handle) : (re.type === "deleted" || re.type === "disappeared") && y.delete(re.name));
    });
    const v = yt(f);
    It("observe", {
      rootId: "",
      path: v,
      id: b
    }, p ? [p] : []), x();
    const S = {
      mapCache: y,
      dirHandle: m,
      resolvePath: f,
      observationId: b,
      refCount: 1,
      cleanup: k,
      updateCache: x
    };
    ia.set(i, S);
    const M = await Promise.all(await Array.fromAsync((await m)?.entries?.() ?? []));
    for (const [O, re] of M) y.has(O) || y.set(O, re);
    return {
      ...S,
      mapCache: y
    };
  });
  let a = !1;
  const l = () => {
    a || (a = !0, o.then((p) => {
      p && (p.refCount--, p.refCount <= 0 && p.cleanup());
    }).catch(console.warn));
  }, c = {
    get(p, f) {
      if (!(f === Symbol.toStringTag || f === Symbol.iterator || f === "toString" || f === "valueOf" || f === "inspect" || f === "constructor" || f === "__proto__" || f === "prototype")) {
        if (f === "dispose") return l;
        if (f === "getMap") return () => s;
        if (f === "entries") return () => s.entries();
        if (f === "keys") return () => s.keys();
        if (f === "values") return () => s.values();
        if (f === Symbol.iterator) return () => s[Symbol.iterator]();
        if (f === "size") return s.size;
        if (f === "has") return (h) => s.has(h);
        if (f === "get") return (h) => s.get(h);
        if (f === "entries") return () => s.entries();
        if (f === "keys") return () => s.keys();
        if (f === "values") return () => s.values();
        if (f === "refresh") return () => o.then((h) => h?.updateCache?.()).then(() => d);
        if (f === "then" || f === "catch" || f === "finally") {
          const h = o.then(() => !0);
          return h[f].bind(h);
        }
        return (...h) => o.then(async (y) => {
          if (!y) return;
          const b = await y.dirHandle, m = b?.[f];
          return typeof m == "function" ? m.apply(b, h) : m;
        });
      }
    },
    ownKeys() {
      return Array.from(s.keys());
    },
    getOwnPropertyDescriptor() {
      return {
        enumerable: !0,
        configurable: !0
      };
    }
  }, u = function() {
  }, d = new Proxy(u, c);
  return d;
}
async function cd(e, t, n = {}, r = je) {
  try {
    const { rootHandle: i, resolvedPath: s } = await Lt(e, t, n?.basePath || ""), o = yt(s);
    return await It("readFile", {
      rootId: "",
      path: o,
      type: "blob"
    }, i ? [i] : []);
  } catch (i) {
    return nt(r, "error", `readFile: ${i.message}`);
  }
}
async function i_(e, t, n = {}, r = je) {
  try {
    const i = await cd(e, t, n, r);
    return i ? URL.createObjectURL(i) : null;
  } catch (i) {
    return nt(r, "error", `readAsObjectURL: ${i.message}`);
  }
}
async function s_(e, t, n = {}, r = je) {
  try {
    const i = await cd(e, t, n, r);
    return i ? await i.text() : "";
  } catch (i) {
    return nt(r, "error", `readFileUTF8: ${i.message}`);
  }
}
async function Wn(e, t, n, r = je) {
  if (n instanceof FileSystemFileHandle && (n = await n.getFile()), n instanceof FileSystemDirectoryHandle) {
    const i = await zt(await li(e), t + (t?.trim?.()?.endsWith?.("/") ? "" : "/") + (n?.name || "")?.trim?.()?.replace?.(/\s+/g, "-"), { create: !0 });
    return await sr(n, i, {})?.catch?.(console.warn.bind(console));
  } else try {
    const { rootHandle: i, resolvedPath: s } = await Lt(e, t, ""), o = yt(s);
    return await It("writeFile", {
      rootId: "",
      path: o,
      data: n
    }, i ? [i] : []) !== !1;
  } catch (i) {
    return nt(r, "error", `writeFile: ${i.message}`);
  }
}
async function o_(e, t, n = { create: !0 }, r = je) {
  try {
    const { rootHandle: i, resolvedPath: s } = await Lt(e, t, n?.basePath || "");
    return (await Ns(i, s, n, r))?.createWritable?.();
  } catch (i) {
    return nt(r, "error", `getFileWriter: ${i.message}`);
  }
}
async function ud(e, t, n = { recursive: !0 }, r = je) {
  try {
    const { rootHandle: i, resolvedPath: s } = await Lt(e, t, n?.basePath || ""), o = Gd(s);
    let a = !1;
    for (const l of o)
      if (a = await It("remove", {
        rootId: "",
        path: l,
        recursive: n.recursive
      }, i ? [i] : []), a !== !1) return !0;
    return a !== !1;
  } catch (i) {
    return nt(r, "error", `removeFile: ${i.message}`);
  }
}
async function a_(e, t, n = { recursive: !0 }, r = je) {
  try {
    return ud(e, t, n, r);
  } catch (i) {
    return nt(r, "error", `removeDirectory: ${i.message}`);
  }
}
async function l_(e, t, n = {}, r = je) {
  try {
    return ud(e, t, {
      recursive: !0,
      ...n
    }, r);
  } catch (i) {
    return nt(r, "error", `remove: ${i.message}`);
  }
}
var c_ = async () => {
  const e = "showOpenFilePicker";
  return (window?.[e]?.bind?.(window) ?? (await import("./showOpenFilePicker-BDv4F3Em.js"))?.[e])(zb);
}, Wb = async (e, t) => {
  if (e instanceof FileSystemFileHandle && (e = await e.getFile()), typeof e == "string" && (e = await fd(e)), t = t ?? e?.name, !t) return;
  if ("msSaveOrOpenBlob" in self.navigator && self.navigator.msSaveOrOpenBlob(e, t), e instanceof FileSystemDirectoryHandle) {
    let r = await showDirectoryPicker?.({ mode: "readwrite" })?.catch?.(console.warn.bind(console));
    return e && r ? (r = await zt(r, e?.name || "", { create: !0 })?.catch?.(console.warn.bind(console)) || r, await sr(e, r, {})?.catch?.(console.warn.bind(console))) : void 0;
  }
  const n = await (self?.showOpenFilePicker ? new Promise((r) => r({
    showOpenFilePicker: self?.showOpenFilePicker?.bind?.(window),
    showSaveFilePicker: self?.showSaveFilePicker?.bind?.(window)
  })) : import("./showOpenFilePicker-BDv4F3Em.js"));
  if (window?.showSaveFilePicker) {
    const r = await (await n?.showSaveFilePicker?.({ suggestedName: t })?.catch?.(console.warn.bind(console)))?.createWritable?.({ keepExistingData: !0 })?.catch?.(console.warn.bind(console));
    await r?.write?.(e)?.catch?.(console.warn.bind(console)), await r?.close?.()?.catch?.(console.warn.bind(console));
  } else {
    const r = document.createElement("a");
    try {
      r.href = URL.createObjectURL(e);
    } catch (i) {
      console.warn(i);
    }
    r.download = t, document.body.appendChild(r), r.click(), setTimeout(function() {
      document.body.removeChild(r), globalThis.URL.revokeObjectURL(r.href);
    }, 0);
  }
}, fd = async (e = "", t = !1) => {
  const n = (typeof e == "string" ? e : e?.url || "").trim();
  if (!n) return null;
  let r = n;
  try {
    r = new URL(n, location?.origin || self?.location?.origin || "http://localhost").pathname || n;
  } catch {
  }
  const i = r?.trim?.() || "/";
  if (i?.startsWith?.("/user")) {
    const s = yt(i), o = await navigator?.storage?.getDirectory?.();
    if (!o) return null;
    const a = await Ns(o, s, { create: !!t }).catch(() => null);
    return a ? t ? a?.createWritable?.() : a?.getFile?.() : null;
  }
  if (t) return null;
  try {
    const s = String(location?.origin || self?.location?.origin || "").trim(), o = i.startsWith("/") ? new URL(i, s || "http://localhost").toString() : n, a = await fetch(o), l = await a?.blob()?.catch?.(console.warn.bind(console)), c = a?.headers?.get?.("Last-Modified"), u = c ? Date.parse(c) : 0;
    if (l) {
      const d = i?.substring?.(i?.lastIndexOf?.("/") + 1) || "resource";
      return new File([l], d, {
        type: l?.type,
        lastModified: isNaN(u) ? 0 : u
      });
    }
  } catch (s) {
    return nt(je, "error", `provide: ${s.message}`);
  }
  return null;
}, Hb = (e) => e?.types?.length > 0 ? e?.getType?.(Array.from(e?.types || [])?.at?.(-1)) : null, dd = async (e, t = "/user/".trim?.()?.replace?.(/\s+/g, "-"), n) => {
  const r = await li(null), i = Nb(yt(t))?.replace?.("/user", "")?.trim?.();
  e = e instanceof File ? e : new File([e], Z() + "." + (e?.type?.split?.("/")?.[1] || "tmp"));
  const s = i + (e?.name || "wallpaper")?.trim?.()?.replace?.(/\s+/g, "-");
  return await Wn(r, s, e), n?.set?.("/user" + s?.trim?.()?.replace?.(/\s+/g, "-"), e), "/user" + s?.trim?.();
}, u_ = async (e = "/user/", t = null) => {
  if (e = yt(e), !globalThis.showDirectoryPicker) return;
  const n = await showDirectoryPicker?.({
    mode: "readonly",
    id: t
  })?.catch?.(console.warn.bind(console));
  if (!n) return;
  const r = await zt(await li(null), e + (e?.trim?.()?.endsWith?.("/") ? "" : "/") + n.name?.trim?.()?.replace?.(/\s+/g, "-"), { create: !0 });
  if (r)
    return await sr(n, r, {})?.catch?.(console.warn.bind(console));
}, f_ = async (e = "/user/".trim?.()?.replace?.(/\s+/g, "-"), t) => {
  const n = "showOpenFilePicker";
  return e = yt(e), (window?.[n]?.bind?.(window) ?? (await import("./showOpenFilePicker-BDv4F3Em.js"))?.[n])({
    ...Lb,
    multiple: !0
  })?.then?.(async (r = []) => {
    for (const i of r) {
      const s = i instanceof File ? i : await i?.getFile?.();
      await dd(s, e, t);
    }
  });
}, kr = typeof Image < "u" ? new Image() : null;
if (kr) {
  kr.decoding = "async", kr.width = 24, kr.height = 24;
  try {
    kr.src = URL.createObjectURL(new Blob(['<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 384 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 288c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128z"/></svg>'], { type: "image/svg+xml" }));
  } catch {
  }
}
var d_ = (e, t, n = "") => {
  try {
    const r = URL.createObjectURL(t);
    t?.type && t?.type != "text/plain" ? e?.items?.add?.(t, t?.type || "text/plain") : e?.add?.(t), n && e?.items?.add?.(n, "text/plain"), e?.setData?.("text/uri-list", r), e?.setData?.("DownloadURL", t?.type + ":" + t?.name + ":" + r);
  } catch {
  }
}, h_ = async (e) => {
  const t = e?.items?.[0], n = t?.types?.find?.((i) => i?.startsWith?.("image/")), r = await (e?.files?.[0] ?? ((n ? t?.getType?.(n) : null) || Hb(t)));
  return dd(r, "/user/temp/".trim?.()?.replace?.(/\s+/g, "-"));
}, p_ = async (e = null, t = "", n = {}, r = je) => {
  try {
    const { rootHandle: i, resolvedPath: s } = await Lt(e, t, n?.basePath || ""), o = yt(s);
    await It("remove", {
      rootId: "",
      path: o,
      recursive: !0
    }, i ? [i] : []);
  } catch (i) {
    return nt(r, "error", `clearAllInDirectory: ${i.message}`);
  }
}, sr = async (e, t, n = {}, r = je) => It("copy", {
  from: e,
  to: t
}, [e, t]), Bb = (e, t = "/user/", n = null, r) => {
  const i = [], s = Array.from(e?.items ?? []), o = Array.from(e?.files ?? []), a = Array.isArray(e) ? e : [...e?.[Symbol.iterator] ? e : [e]];
  return Promise.try(async () => {
    const l = await li(n), c = async (d) => {
      let p;
      if (d.kind === "file" || d.kind === "directory") try {
        p = await d.getAsFileSystemHandle?.();
      } catch {
      }
      if (p) {
        if (p.kind === "directory") {
          const f = await zt(l, t + (p.name || "").trim().replace(/\s+/g, "-"), { create: !0 });
          f && i.push(sr(p, f, { create: !0 }));
        } else {
          const f = await p.getFile(), h = t + (f.name || p.name).trim().replace(/\s+/g, "-");
          i.push(Wn(l, h, f).then(() => r?.(f, h)));
        }
        return;
      }
      if (d.kind === "file" || d instanceof File) {
        const f = d instanceof File ? d : d.getAsFile();
        if (f) {
          const h = t + f.name.trim().replace(/\s+/g, "-");
          i.push(Wn(l, h, f).then(() => r?.(f, h)));
        }
        return;
      }
    };
    if (s?.length > 0) for (const d of s) await c(d);
    if (o?.length > 0) for (const d of o) await c(d);
    if (a?.length > 0) for (const d of a) await c(d);
    const u = e?.getData?.("text/uri-list") || e?.getData?.("text/plain");
    if (u && typeof u == "string") {
      const d = u.split(/\r?\n/).filter(Boolean);
      for (const p of d)
        if (!p.startsWith("file://"))
          if (p.startsWith("/user/")) {
            const f = p.trim();
            i.push(Promise.try(async () => {
              const h = await Fb(l, f);
              if (h?.handle) {
                const y = f.split("/").filter(Boolean).pop();
                if (h.type === "directory") {
                  const b = await zt(l, t + y, { create: !0 });
                  await sr(h.handle, b, { create: !0 });
                } else {
                  const b = await h.handle.getFile(), m = t + y;
                  await Wn(l, m, b), r?.(b, m);
                }
              }
            }));
          } else i.push(Promise.try(async () => {
            const f = await fd(p);
            if (f) {
              const h = t + f.name;
              await Wn(l, h, f), r?.(f, h);
            }
          }));
    }
    if (a?.[0] instanceof ClipboardItem) {
      for (const d of a) for (const p of d.types) if (p.startsWith("image/") || p.startsWith("text/")) {
        const f = await d.getType(p), h = p.split("/")[1].split("+")[0] || "txt", y = new File([f], `clipboard-${Date.now()}.${h}`, { type: p }), b = t + y.name;
        i.push(Wn(l, b, y).then(() => r?.(y, b)));
      }
    }
    await Promise.allSettled(i).catch(console.warn.bind(console));
  });
};
function y_(e) {
  const t = typeof e == "string" ? e : e.name, n = typeof e == "string" ? "" : e.type;
  return /\.(md|markdown|mdown|mkd|mkdn|mdtxt|mdtext)$/i.test(t) || n === "text/markdown";
}
function m_(e) {
  const t = typeof e == "string" ? e : e.name;
  return (typeof e == "string" ? "" : e.type).startsWith("text/") ? !0 : /\.(txt|text|log|json|xml|yaml|yml|toml|ini|cfg|conf)$/i.test(t);
}
function v_(e) {
  const t = typeof e == "string" ? e : e.name;
  return (typeof e == "string" ? "" : e.type).startsWith("image/") ? !0 : /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico|avif)$/i.test(t);
}
function g_(e) {
  const t = typeof e == "string" ? e : e.name;
  return /\.(js|ts|jsx|tsx|py|rb|go|rs|c|cpp|h|hpp|java|kt|swift|php|cs|css|scss|sass|less|html|vue|svelte)$/i.test(t);
}
async function jb(e) {
  return new Promise((t, n) => {
    const r = new FileReader();
    r.onload = () => t(r.result), r.onerror = () => n(/* @__PURE__ */ new Error("Failed to read file")), r.readAsText(e);
  });
}
async function b_(e) {
  return new Promise((t, n) => {
    const r = new FileReader();
    r.onload = () => t(r.result), r.onerror = () => n(/* @__PURE__ */ new Error("Failed to read file")), r.readAsDataURL(e);
  });
}
async function w_(e) {
  return new Promise((t, n) => {
    const r = new FileReader();
    r.onload = () => t(r.result), r.onerror = () => n(/* @__PURE__ */ new Error("Failed to read file")), r.readAsArrayBuffer(e);
  });
}
function S_(e, t, n = "text/plain") {
  return new File([e], t, { type: n });
}
function x_(e, t = "document.md") {
  return new File([e], t, { type: "text/markdown" });
}
function __(e, t = "data.json") {
  const n = JSON.stringify(e, null, 2);
  return new File([n], t, { type: "application/json" });
}
function hd(e, t, n = "text/plain") {
  Wb(new Blob([e], { type: n }), t);
}
function k_(e, t = "document.md") {
  hd(e, t, "text/markdown");
}
async function pd(e = "*") {
  return new Promise((t) => {
    const n = document.createElement("input");
    n.type = "file", n.accept = e, n.onchange = () => {
      t(n.files?.[0] || null);
    }, n.oncancel = () => t(null), n.click();
  });
}
async function E_(e = "*") {
  return new Promise((t) => {
    const n = document.createElement("input");
    n.type = "file", n.accept = e, n.multiple = !0, n.onchange = () => {
      t(Array.from(n.files || []));
    }, n.oncancel = () => t([]), n.click();
  });
}
async function C_() {
  return pd(".md,.markdown,.txt,text/markdown,text/plain");
}
async function P_(e, t = "document.md", n = [{
  description: "Markdown",
  accept: { "text/markdown": [".md"] }
}]) {
  try {
    if ("showSaveFilePicker" in window) {
      const r = await (await window.showSaveFilePicker({
        suggestedName: t,
        types: n
      })).createWritable();
      return await r.write(e), await r.close(), !0;
    }
  } catch (r) {
    if (r.name === "AbortError") return !1;
  }
  return hd(e, t), !0;
}
async function A_(e = [{
  description: "Markdown",
  accept: { "text/markdown": [".md", ".markdown"] }
}]) {
  try {
    if ("showOpenFilePicker" in window) {
      const [n] = await window.showOpenFilePicker({ types: e }), r = await n.getFile();
      return {
        content: await r.text(),
        filename: r.name
      };
    }
  } catch (n) {
    if (n.name === "AbortError") return null;
  }
  const t = await pd();
  return t ? {
    content: await jb(t),
    filename: t.name
  } : null;
}
var Vt = "application/octet-stream", Ub = /^data:(?<mime>[^;,]+)?(?<params>(?:;[^,]*)*?),(?<data>[\s\S]*)$/i;
function Vb() {
  return typeof Uint8Array.fromBase64 == "function";
}
function qb(e) {
  return typeof e.toBase64 == "function";
}
function Vn(e) {
  try {
    return decodeURIComponent(e);
  } catch {
    return e;
  }
}
function za(e) {
  return /%[0-9A-Fa-f]{2}/.test(e) || e.includes("+");
}
function Gb(e) {
  const t = (e || "").toLowerCase();
  return t.startsWith("text/") || t.includes("json") || t.includes("xml") || t.includes("svg") || t.includes("javascript") || t.includes("ecmascript");
}
function $c(e) {
  const t = e.buffer;
  if (t instanceof ArrayBuffer) return t.slice(e.byteOffset, e.byteOffset + e.byteLength);
  const n = new ArrayBuffer(e.byteLength);
  return new Uint8Array(n).set(e), n;
}
function La(e) {
  const t = (e || "").trim();
  if (!t.toLowerCase().startsWith("data:")) return null;
  const n = t.match(Ub);
  return n?.groups ? {
    mimeType: (n.groups.mime || Vt).trim() || Vt,
    isBase64: (n.groups.params || "").toLowerCase().includes(";base64"),
    data: n.groups.data ?? ""
  } : null;
}
function Dc(e, t = {}) {
  const n = t.alphabet || "base64", r = t.lastChunkHandling || "loose", i = (e || "").trim();
  if (Vb()) return Uint8Array.fromBase64(i, {
    alphabet: n,
    lastChunkHandling: r
  });
  const s = n === "base64url" ? i.replace(/-/g, "+").replace(/_/g, "/") : i, o = (4 - s.length % 4) % 4, a = s + "=".repeat(o), l = typeof atob == "function" ? atob(a) : "", c = new Uint8Array(l.length);
  for (let u = 0; u < l.length; u++) c[u] = l.charCodeAt(u);
  return c;
}
function Xb(e, t = {}) {
  const n = t.alphabet || "base64";
  if (qb(e)) return e.toBase64({ alphabet: n });
  const r = 32768;
  let i = "";
  for (let o = 0; o < e.length; o += r) i += String.fromCharCode(...e.subarray(o, o + r));
  const s = typeof btoa == "function" ? btoa(i) : "";
  return n !== "base64url" ? s : s.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
async function hl(e) {
  const t = await e.arrayBuffer();
  return new Uint8Array(t);
}
async function Yb(e, t = "utf-8") {
  if (typeof e.text == "function") return await e.text();
  const n = await hl(e);
  return new TextDecoder(t).decode(n);
}
async function Kb(e, t = {}) {
  return Xb(await hl(e), t);
}
async function Jb(e, t = {}) {
  const n = (t.mimeType || e.type || Vt).trim() || Vt;
  if (t.base64 ?? !Gb(n)) return `data:${n};base64,${await Kb(e, t.base64Options || {})}`;
  const r = await Yb(e, t.textEncoding || "utf-8");
  return `data:${n},${t.uriComponent ? encodeURIComponent(r) : r}`;
}
async function T_(e, t = {}) {
  return await Jb(e, t);
}
function yd(e) {
  const t = (e || "").trim();
  if (!t) return {
    isBase64: !1,
    alphabet: "base64"
  };
  const n = /[-_]/.test(t) && !/[+/]/.test(t) ? "base64url" : "base64", r = (n === "base64url" ? t.replace(/-/g, "+").replace(/_/g, "/") : t).replace(/[\r\n\s]/g, "");
  return /^[A-Za-z0-9+/]*={0,2}$/.test(r) ? r.length < 8 ? {
    isBase64: !1,
    alphabet: n
  } : {
    isBase64: !0,
    alphabet: n
  } : {
    isBase64: !1,
    alphabet: n
  };
}
function Fc(e) {
  try {
    return typeof URL > "u" ? !1 : typeof URL.canParse == "function" ? URL.canParse(e) : (new URL(e), !0);
  } catch {
    return !1;
  }
}
function Qb(e) {
  const t = (e || "").toLowerCase().split(";")[0].trim();
  if (!t) return "bin";
  const n = {
    "text/plain": "txt",
    "text/markdown": "md",
    "text/html": "html",
    "application/json": "json",
    "application/xml": "xml",
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/svg+xml": "svg",
    "application/pdf": "pdf"
  };
  if (n[t]) return n[t];
  const r = t.indexOf("/");
  if (r <= 0 || r >= t.length - 1) return "bin";
  let i = t.slice(r + 1);
  return i.includes("+") && (i = i.split("+")[0]), i.includes(".") && (i = i.split(".").pop() || i), i || "bin";
}
function Wc(e) {
  let t = 2166136261;
  for (let n = 0; n < e.length; n++)
    t ^= e[n], t = Math.imul(t, 16777619);
  return (t >>> 0).toString(16).padStart(8, "0").repeat(8);
}
async function Zb(e) {
  try {
    const t = globalThis.crypto?.subtle;
    if (!t) return Wc(e);
    const n = await t.digest("SHA-256", e), r = new Uint8Array(n);
    return Array.from(r, (i) => i.toString(16).padStart(2, "0")).join("");
  } catch {
    return Wc(e);
  }
}
function Hc(e) {
  return yd(e).isBase64;
}
async function M_(e, t = {}) {
  const n = t.maxBytes ?? 52428800, r = (t.namePrefix || "asset").trim() || "asset", i = t.preserveFileName ?? !1;
  let s = "text", o, a = null;
  if (e instanceof File)
    s = "file", a = e, o = t.mimeType && t.mimeType !== e.type ? new Blob([await e.arrayBuffer()], { type: t.mimeType }) : e;
  else if (e instanceof Blob)
    s = "blob", o = t.mimeType && t.mimeType !== e.type ? new Blob([await e.arrayBuffer()], { type: t.mimeType }) : e;
  else {
    const y = (e instanceof URL ? e.toString() : String(e ?? "")).trim(), b = La(y), m = t.uriComponent || za(y) ? Vn(y) : y;
    b ? s = "data-url" : Fc(y) ? s = "url" : Hc(y) ? s = "base64" : m !== y && (La(m) || Hc(m) || Fc(m)) ? s = "uri" : s = "text", o = await ew(s === "uri" ? m : y, {
      mimeType: t.mimeType,
      uriComponent: t.uriComponent,
      isBase64: s === "base64" ? !0 : void 0,
      maxBytes: n
    });
  }
  const l = await hl(o);
  if (l.byteLength > n) throw new Error(`Data too large: ${l.byteLength} bytes`);
  const c = await Zb(l), u = (t.mimeType || o.type || Vt).trim() || Vt, d = Qb(u), p = t.filename || `${r}-${c.slice(0, 16)}.${d}`, f = i && a?.name ? a.name : p, h = a && i && !t.mimeType ? a : new File([o], f, { type: u });
  return {
    hash: c,
    name: h.name,
    type: h.type || u,
    size: h.size,
    source: s,
    file: h
  };
}
async function md(e, t = {}) {
  const n = t.maxBytes ?? 52428800, r = (e ?? "").trim(), i = La(r);
  if (i) {
    const u = t.mimeType || i.mimeType || Vt, d = t.uriComponent || za(i.data) ? Vn(i.data) : i.data;
    if (t.isBase64 ?? i.isBase64) {
      const f = Dc(d, {
        alphabet: t.base64?.alphabet || "base64",
        lastChunkHandling: t.base64?.lastChunkHandling || "loose"
      });
      if (f.byteLength > n) throw new Error(`Decoded data too large: ${f.byteLength} bytes`);
      const h = new Blob([$c(f)], { type: u });
      return t.asFile ? new File([h], t.filename || "file", { type: u }) : h;
    }
    const p = new Blob([d], { type: u });
    return t.asFile ? new File([p], t.filename || "file", { type: u }) : p;
  }
  try {
    if (typeof URL < "u" && URL.canParse?.(r)) {
      const u = await (await fetch(r)).blob(), d = t.mimeType || u.type || Vt, p = u.type === d ? u : new Blob([await u.arrayBuffer()], { type: d });
      return t.asFile ? new File([p], t.filename || "file", { type: d }) : p;
    }
  } catch {
  }
  const s = t.uriComponent || za(r) ? Vn(r) : r, o = yd(s), a = t.isBase64 ?? o.isBase64, l = t.mimeType || (a ? Vt : "text/plain;charset=utf-8");
  if (a) {
    const u = Dc(s, {
      alphabet: t.base64?.alphabet || o.alphabet,
      lastChunkHandling: t.base64?.lastChunkHandling || "loose"
    });
    if (u.byteLength > n) throw new Error(`Decoded data too large: ${u.byteLength} bytes`);
    const d = new Blob([$c(u)], { type: l });
    return t.asFile ? new File([d], t.filename || "file", { type: l }) : d;
  }
  const c = new Blob([s], { type: l });
  return t.asFile ? new File([c], t.filename || "file", { type: l }) : c;
}
async function ew(e, t = {}) {
  return await md(e, {
    ...t,
    asFile: !1
  });
}
async function R_(e, t, n = {}) {
  return await md(e, {
    ...n,
    asFile: !0,
    filename: t
  });
}
async function O_(e) {
  const { dirPath: t, transform: n, filter: r, indent: i = 2, dryRun: s = !1, prettyStable: o = !0 } = e;
  nw();
  const a = await navigator.storage.getDirectory()?.catch?.(() => null);
  if (!a) return {
    processed: 0,
    changed: 0,
    errors: 0
  };
  const l = tw(t), c = await rw(a, l);
  if (!c) return {
    processed: 0,
    changed: 0,
    errors: 0
  };
  let u = 0, d = 0, p = 0;
  for await (const { handle: f, name: h, fullPath: y } of vd(c, l))
    if (!(f.kind !== "file" || !h.toLowerCase().endsWith(".json")) && !(r && !r(h, y)))
      try {
        const b = await (await f.getFile()).text();
        let m;
        try {
          m = b.trim() === "" ? null : Q.parse(b);
        } catch {
          try {
            m = b.trim() === "" ? null : JSON.parse(b);
          } catch (S) {
            console.warn(`JSON parse error: ${y}`, S), p++;
            continue;
          }
        }
        const x = await n(m, {
          path: l,
          name: h,
          fullPath: y
        });
        if (typeof x > "u") {
          u++;
          continue;
        }
        const k = iw(x, {
          indent: i,
          prettyStable: o
        });
        if (Bc(k) === Bc(b)) {
          u++;
          continue;
        }
        if (s) console.log(`[dry-run] Would update: ${y}`);
        else {
          const v = await f.createWritable();
          await v.truncate(0), await v.write(k), await v.close(), console.log(`Updated: ${y}`);
        }
        u++, d++;
      } catch (b) {
        console.error(`Failed on ${y}:`, b), p++;
      }
  return {
    processed: u,
    changed: d,
    errors: p
  };
}
function tw(e) {
  return !e || e === "/" || e === "." ? "" : e.split("/").filter(Boolean).join("/");
}
function nw() {
  if (!("storage" in navigator) || typeof navigator.storage.getDirectory != "function") throw new Error("OPFS is not available in this browser/context. Need navigator.storage.getDirectory().");
}
async function rw(e, t) {
  if (!t || t === "/" || t === ".") return e;
  const n = t.split("/").map((i) => i.trim()).filter(Boolean);
  let r = e;
  for (const i of n) {
    try {
      r = await r?.getDirectoryHandle?.(i, { create: !1 });
    } catch (s) {
      if (s?.name === "NotFoundError" || s?.name === "AbortError") return null;
      throw s;
    }
    if (!r) return null;
  }
  return r;
}
async function* vd(e, t = "") {
  for await (const [n, r] of e.entries()) {
    const i = t ? `${t}/${n}` : n;
    r.kind === "directory" ? yield* vd(r, i) : yield {
      handle: r,
      name: n,
      fullPath: i
    };
  }
}
function iw(e, { indent: t = 2, prettyStable: n = !0 } = {}) {
  return JSON.stringify(e, n ? sw : void 0, t) + `
`;
}
function sw(e, t) {
  if (t && typeof t == "object" && !Array.isArray(t)) {
    const n = {};
    for (const r of Object.keys(t).sort()) n[r] = t[r];
    return n;
  }
  return t;
}
function Bc(e) {
  return e.replace(/\r\n/g, `
`);
}
var I_ = (e, t) => {
  const n = (s) => {
    s.preventDefault(), e.dataset.dragover = "true";
  }, r = () => {
    delete e.dataset.dragover;
  }, i = async (s) => {
    s.preventDefault(), delete e.dataset.dragover;
    try {
      await Bb(s.dataTransfer, t);
      const o = s.dataTransfer?.items?.length || s.dataTransfer?.files?.length || 0;
      e.dispatchEvent(new CustomEvent("dir-dropped", {
        detail: { count: o },
        bubbles: !0
      }));
    } catch (o) {
      console.warn(o);
    }
  };
  return e.addEventListener("dragover", n), e.addEventListener("dragleave", r), e.addEventListener("drop", i), () => {
    e.removeEventListener("dragover", n), e.removeEventListener("dragleave", r), e.removeEventListener("drop", i);
  };
}, ow = async (e, t) => {
  const n = Array.from(t);
  for (const r of n)
    e = e?.trim?.(), e = e?.endsWith?.("/") ? e : e + "/", await pw(null, e, r);
  return n.length;
}, N_ = async (e, t = "*/*", n = !0) => {
  const r = document.createElement("input");
  return r.type = "file", r.accept = t, r.multiple = n, await new Promise((i) => {
    r.onchange = async () => {
      e = e?.trim?.(), e = e?.endsWith?.("/") ? e : e + "/";
      try {
        i(await ow(e, r.files || []));
      } catch {
        i(0);
      }
    }, r.click();
  });
}, z_ = async (e, t) => {
  const n = e.lastIndexOf("/"), r = e.slice(0, Math.max(0, n + 1)), i = t || e.slice(n + 1), s = await (await (await zt(null, r)).getFileHandle(i, { create: !1 })).getFile(), o = URL.createObjectURL(s), a = document.createElement("a");
  a.href = o, a.download = i, a.click(), setTimeout(() => URL.revokeObjectURL(o), 1e3);
}, sa = null, gd = () => (sa || (sa = import("./lure.js").then((e) => ({
  readFile: e.readFile,
  writeFile: e.writeFile
}))), sa), L_ = (e, t = "") => {
  const n = (String(e || "").split("/").pop() || "").replace(/\s+/g, "-").replace(/[^a-zA-Z0-9_.\-+#&]/g, "-");
  return t && !n.includes(".") ? `${n || Date.now()}${t.startsWith(".") ? "" : "."}${t}` : n || `${Date.now()}`;
}, bd = (e, t = !0) => {
  let n = String(e || "").trim();
  return t && (n = n.toLowerCase()), n = n.replace(/\s+/g, "-"), n = n.replace(/[^a-z0-9_.\-+#&]/g, "-"), n = n.replace(/-+/g, "-"), n;
}, aw = (e = "") => e ? e.includes("json") ? "json" : e.includes("markdown") ? "md" : e.includes("plain") ? "txt" : e === "image/jpeg" || e === "image/jpg" ? "jpg" : e === "image/png" ? "png" : e.startsWith("image/") ? e.split("/").pop() || "" : e.includes("html") ? "html" : "" : "", wd = (e) => String(e || "").split("/").filter(Boolean), lw = (e) => e.endsWith("/") ? e : e + "/", cw = (e, t = !0) => (t ? "/" : "") + e.filter(Boolean).join("/"), uw = (e) => {
  const t = wd(e);
  return cw(t.map((n) => bd(n)));
}, fw = [
  "id",
  "_id",
  "key",
  "slug",
  "name"
], fs = (e) => Object.prototype.toString.call(e) === "[object Object]";
function dw(e, t) {
  const n = Array.isArray(t.arrayKey) ? t.arrayKey : t.arrayKey ? [t.arrayKey] : fw, r = [], i = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set();
  for (const a of e)
    if (a != null)
      if (fs(a)) {
        let l;
        for (const c of n) if (c in a && a[c] != null) {
          l = String(a[c]);
          break;
        }
        if (l != null)
          s.has(l) || (s.set(l, a), r.push(a));
        else {
          const c = jc(a);
          o.has(c) || (o.add(c), r.push(a));
        }
      } else if (Array.isArray(a)) {
        const l = jc(a);
        o.has(l) || (o.add(l), r.push(a));
      } else i.has(a) || (i.add(a), r.push(a));
  return r;
}
function Sd(e, t, n) {
  if (Array.isArray(e) && Array.isArray(t)) switch (n.arrayStrategy) {
    case "replace":
      return t.slice();
    case "concat":
      return e.concat(t);
    default:
      return dw(e.concat(t), { arrayKey: n.arrayKey });
  }
  if (fs(e) && fs(t)) {
    const r = { ...e };
    for (const i of Object.keys(t)) i in e ? r[i] = Sd(e[i], t[i], n) : r[i] = t[i];
    return r;
  }
  return t;
}
function jc(e) {
  if (!fs(e)) return JSON.stringify(e);
  const t = Object.keys(e).sort(), n = {};
  for (const r of t) n[r] = e[r];
  return JSON.stringify(n);
}
async function xd(e) {
  return await e.text();
}
async function hw(e, t) {
  try {
    const { readFile: n } = await gd(), r = await n(e, t)?.catch?.(console.warn.bind(console));
    if (!r) return null;
    const i = await xd(r);
    return i?.trim() ? Q.parse(i) : null;
  } catch {
    return null;
  }
}
var pw = async (e, t, n, r = {}) => {
  const { writeFile: i } = await gd(), { forceExt: s, ensureJson: o, toLower: a = !0, sanitize: l = !0, mergeJson: c, arrayStrategy: u = "union", arrayKey: d, jsonSpace: p = 2 } = r;
  let f = String(t || "").trim();
  const h = f.endsWith("/"), y = !h && wd(f).length > 0 && f.includes(".");
  let b = h ? f : y ? f.split("/").slice(0, -1).join("/") : f, m = y ? f.split("/").pop() || "" : n?.name || "";
  b = b || "/", m = m || Date.now() + "";
  const x = m.lastIndexOf(".");
  let k = x > 0 ? m.slice(0, x) : m, v = s || (o ? "json" : x > 0 ? m.slice(x + 1) : aw(n?.type || "")) || "";
  l && (b = uw(b), k = bd(k, a));
  const S = v ? `${k}.${v}` : k, M = lw(b) + S;
  if (c !== !1 && (o || v.toLowerCase() === "json" || n?.type === "application/json")) try {
    let ie;
    if (n instanceof File || n instanceof Blob) {
      const ut = await xd(n);
      ie = ut?.trim() ? Q.parse(ut) : {};
    } else ie = n;
    const ye = await hw(e, M)?.catch?.(console.warn.bind(console));
    let Me = ye != null ? Sd(ye, ie, {
      arrayStrategy: u,
      arrayKey: d
    }) : ie;
    const ke = JSON.stringify(Me, void 0, p), Ee = await i(e, M, new File([ke], S, { type: "application/json" }))?.catch?.(console.warn.bind(console));
    return typeof document < "u" && document?.dispatchEvent?.(new CustomEvent("rs-fs-changed", {
      detail: Ee,
      bubbles: !0,
      composed: !0,
      cancelable: !0
    })), Ee;
  } catch (ie) {
    console.warn("writeFileSmart JSON merge failed, falling back to raw write:", ie);
  }
  let O;
  if (n instanceof File) if (n.name === S) O = n;
  else {
    const ie = n.type || (v ? `application/${v}` : "application/octet-stream"), ye = await n.arrayBuffer();
    O = new File([ye], S, { type: ie });
  }
  else {
    const ie = n.type || (v ? `application/${v}` : "application/octet-stream");
    O = new File([await n.arrayBuffer()], S, { type: ie });
  }
  const re = await i(e, M, O)?.catch?.(console.warn.bind(console));
  return typeof document < "u" && document?.dispatchEvent?.(new CustomEvent("rs-fs-changed", {
    detail: re,
    bubbles: !0,
    composed: !0,
    cancelable: !0
  })), re;
}, yw = (e = "", t = "") => {
  const n = t.endsWith("/") ? t : `${t}/`;
  return e.startsWith(n);
}, _d = new BroadcastChannel("rs-fs"), kn = /* @__PURE__ */ new Map();
_d.addEventListener("close", () => kn.clear());
_d.addEventListener("message", (e) => {
  const t = e?.data;
  if (!t || t.type !== "commit-result" && t.type !== "commit-to-clipboard") return;
  const n = t?.results ?? [];
  if (!(!Array.isArray(n) || !n.length)) {
    for (const [r, i] of kn.entries())
      if (i.size && n.some((s) => yw(s?.path, r)))
        for (const s of i) try {
          s();
        } catch (o) {
          console.warn(o);
        }
  }
});
var $_ = () => kn.clear(), D_ = (e, t) => {
  if (!e || typeof t != "function") return () => {
  };
  const n = e.endsWith("/") ? e : `${e}/`;
  let r = kn.get(n);
  return r || (r = /* @__PURE__ */ new Set(), kn.set(n, r)), r.add(t), () => {
    const i = kn.get(n);
    i && (i.delete(t), i.size || kn.delete(n));
  };
}, F_ = async (e) => await (await e?.getFile?.())?.text?.() || "", W_ = async (e) => {
  if (Array.isArray(e) && (e = e?.[0]), !e) return null;
  const t = await e?.getFile?.();
  return mw(await t?.text?.() || "{}");
}, mw = (e) => {
  if (!e) return null;
  if (typeof e != "string") return e;
  try {
    return JSON.parse(e);
  } catch {
    return console.warn("Failed to parse JSON", e), e;
  }
}, vw = class {
  options;
  dragOverElements = /* @__PURE__ */ new Set();
  constructor(e) {
    this.options = { ...e };
  }
  addFiles(e) {
    if (!(!Array.isArray(e) || e.length === 0))
      return this.options.onFilesAdded(e);
  }
  setupFileInput(e, t = "*") {
    const n = document.createElement("input");
    return n.type = "file", n.multiple = !0, n.accept = t, n.style.display = "none", n.addEventListener("change", (r) => {
      const i = Array.from(r.target.files || []);
      i.length > 0 && this.options.onFilesAdded(i), n.value = "";
    }), e.append(n), n;
  }
  setupDragAndDrop(e) {
    e.addEventListener("dragover", (t) => {
      t.preventDefault(), t.stopPropagation(), this.addDragOver(e);
    }), e.addEventListener("dragleave", (t) => {
      t.preventDefault(), t.stopPropagation(), this.removeDragOver(e);
    }), e.addEventListener("drop", (t) => {
      t.preventDefault(), t.stopPropagation(), this.removeDragOver(e);
      const n = Array.from(t.dataTransfer?.files || []);
      n.length > 0 && this.options.onFilesAdded(n);
    });
  }
  setupPasteHandling(e) {
    e.addEventListener("paste", (t) => {
      const n = Array.from(t.clipboardData?.files || []);
      n.length > 0 && (t.preventDefault(), this.options.onFilesAdded(n));
    });
  }
  setupCompleteFileHandling(e, t, n, r = "*") {
    const i = this.setupFileInput(e, r);
    t.addEventListener("click", () => {
      i.click();
    }), n && this.setupDragAndDrop(n), this.setupPasteHandling(e);
  }
  validateFiles(e, t = {}) {
    const { maxSize: n, allowedTypes: r, maxFiles: i } = t, s = [], o = [];
    i && e.length > i && (o.push(...e.slice(i).map((a) => ({
      file: a,
      reason: `Too many files. Maximum ${i} files allowed.`
    }))), e = e.slice(0, i));
    for (const a of e) {
      let l = !0, c = "";
      n && a.size > n && (l = !1, c = `File too large. Maximum size is ${this.formatFileSize(n)}.`), r && r.length > 0 && (r.some((u) => u.includes("*") ? a.type.startsWith(u.replace("/*", "/")) : a.type === u) || (l = !1, c = c || `File type not allowed. Allowed types: ${r.join(", ")}.`)), l ? s.push(a) : o.push({
        file: a,
        reason: c
      });
    }
    return {
      valid: s,
      invalid: o
    };
  }
  async readFileAsText(e, t) {
    return new Promise((n, r) => {
      const i = new FileReader();
      i.onload = () => n(i.result), i.onerror = () => r(/* @__PURE__ */ new Error(`Failed to read file: ${e.name}`)), t && (i.onprogress = (s) => {
        s.lengthComputable && t(s.loaded, s.total);
      }), i.readAsText(e);
    });
  }
  async readFileAsArrayBuffer(e) {
    return new Promise((t, n) => {
      const r = new FileReader();
      r.onload = () => t(r.result), r.onerror = () => n(/* @__PURE__ */ new Error(`Failed to read file: ${e.name}`)), r.readAsArrayBuffer(e);
    });
  }
  async readFileAsDataURL(e) {
    return new Promise((t, n) => {
      const r = new FileReader();
      r.onload = () => t(r.result), r.onerror = () => n(/* @__PURE__ */ new Error(`Failed to read file: ${e.name}`)), r.readAsDataURL(e);
    });
  }
  async readFilesAsText(e, t) {
    const n = [];
    for (const r of e) try {
      const i = await this.readFileAsText(r, (s, o) => {
        t?.(r, s, o);
      });
      n.push({
        file: r,
        content: i
      });
    } catch (i) {
      console.warn(`Failed to read file ${r.name}:`, i);
    }
    return n;
  }
  getFileIcon(e) {
    return e.startsWith("image/") ? "🖼️" : e === "application/pdf" ? "📄" : e.includes("json") ? "📋" : e.includes("text") || e.includes("markdown") ? "📝" : e.includes("javascript") || e.includes("typescript") ? "📜" : e.includes("css") ? "🎨" : e.includes("html") ? "🌐" : e.startsWith("video/") ? "🎥" : e.startsWith("audio/") ? "🎵" : e.includes("zip") || e.includes("rar") ? "📦" : "📄";
  }
  formatFileSize(e) {
    return e < 1024 ? `${e} B` : e < 1024 * 1024 ? `${(e / 1024).toFixed(1)} KB` : e < 1024 * 1024 * 1024 ? `${(e / (1024 * 1024)).toFixed(1)} MB` : `${(e / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  }
  isMarkdownFile(e) {
    const t = e.name.toLowerCase(), n = e.type.toLowerCase();
    return t.endsWith(".md") || t.endsWith(".markdown") || t.endsWith(".mdown") || t.endsWith(".mkd") || t.endsWith(".mkdn") || t.endsWith(".mdtxt") || t.endsWith(".mdtext") || n.includes("markdown") || n.includes("text");
  }
  isImageFile(e) {
    return e.type.startsWith("image/");
  }
  isTextFile(e) {
    return e.type.startsWith("text/") || this.isMarkdownFile(e) || e.type.includes("javascript") || e.type.includes("typescript") || e.type.includes("css") || e.type.includes("html") || e.type.includes("json") || e.type.includes("xml");
  }
  isBinaryFile(e) {
    return !this.isTextFile(e) && !this.isImageFile(e);
  }
  getFileMetadata(e) {
    const t = e.name.split(".").pop()?.toLowerCase() || "", n = this.isTextFile(e), r = this.isImageFile(e), i = this.isBinaryFile(e);
    return {
      name: e.name,
      extension: t,
      size: e.size,
      type: e.type,
      lastModified: e.lastModified,
      isText: n,
      isImage: r,
      isBinary: i,
      formattedSize: this.formatFileSize(e.size),
      icon: this.getFileIcon(e.type)
    };
  }
  getFilesMetadata(e) {
    return e.map((t) => this.getFileMetadata(t));
  }
  addDragOver(e) {
    this.dragOverElements.has(e) || (this.dragOverElements.add(e), e.classList.add("drag-over"));
  }
  removeDragOver(e) {
    this.dragOverElements.has(e) && (this.dragOverElements.delete(e), e.classList.remove("drag-over"));
  }
  processFiles(e) {
    this.options.onFilesAdded(e);
  }
  createDownloadableFile(e, t, n) {
    let r;
    e instanceof Blob ? r = e : e instanceof ArrayBuffer ? r = new Blob([e], { type: n || "application/octet-stream" }) : r = new Blob([e], { type: n || "text/plain;charset=utf-8" });
    const i = URL.createObjectURL(r), s = document.createElement("a");
    s.href = i, s.download = t, s.style.display = "none", document.body.appendChild(s), s.click(), document.body.removeChild(s), setTimeout(() => URL.revokeObjectURL(i), 100);
  }
  createFileURL(e) {
    return URL.createObjectURL(e);
  }
  revokeFileURL(e) {
    URL.revokeObjectURL(e);
  }
  destroy() {
    this.dragOverElements.clear();
  }
};
function H_(e) {
  return new vw(e);
}
async function B_(e) {
  try {
    const t = await fetch(e, {
      credentials: "include",
      cache: "no-store"
    });
    if (!t.ok) return null;
    const n = t.headers.get("content-type") || "";
    return !n.includes("text") && !n.includes("markdown") ? null : await t.text();
  } catch {
    return null;
  }
}
async function j_(e) {
  try {
    const t = e.getData("text/uri-list");
    if (t?.trim()) return t.trim();
  } catch {
  }
  try {
    const t = e.getData("text/plain");
    if (t?.trim()) return t;
  } catch {
  }
  return null;
}
async function gw(e, t) {
  const { cssPath: n, componentName: r } = t;
  if (console.log(`[LazyLoader] Loading component: ${r}`), n) try {
    await bw(n);
  } catch (i) {
    console.warn(`[LazyLoader] Failed to load CSS for ${r}:`, i);
  }
  try {
    const i = await e();
    return console.log(`[LazyLoader] Successfully loaded component: ${r}`), { component: i };
  } catch (i) {
    throw console.error(`[LazyLoader] Failed to load component ${r}:`, i), i;
  }
}
async function bw(e) {
  return new Promise((t, n) => {
    if (document.querySelectorAll(`link[href="${e}"]`).length > 0) {
      t();
      return;
    }
    const r = document.createElement("link");
    r.rel = "stylesheet", r.href = e, r.onload = () => t(), r.onerror = () => n(/* @__PURE__ */ new Error(`Failed to load CSS: ${e}`)), document.head.appendChild(r);
  });
}
var Qn = /* @__PURE__ */ new Map();
async function U_(e, t, n) {
  if (Qn.has(e)) return Qn.get(e);
  const r = await gw(t, n);
  return Qn.set(e, r), r;
}
function V_() {
  Qn.clear();
}
function q_() {
  for (const [, e] of Qn) e.dispose && e.dispose();
  Qn.clear();
}
export {
  Fl as $behavior,
  Vy as $createElement,
  Vr as $mapped,
  Zp as $observeAttribute,
  Qp as $observeInput,
  Kp as $virtual,
  Ru as C,
  ux as COPY_HACK,
  rc as CSM,
  kv as CSSAnchor,
  tt as CSSBinder,
  rr as CSSCalc,
  PS as CSSCustomProps,
  AS as CSSInputControls,
  RS as CSSInteractionStates,
  MS as CSSMomentumScrolling,
  uc as CSSPosition,
  TS as CSSScrollbarControls,
  Cr as CSSTransform,
  hv as CSSUnitConverter,
  D as CSSUnitUtils,
  Uu as ClosePriority,
  Ms as DESKTOP_DRAFT_KEY,
  al as DESKTOP_MAIN_KEY,
  CS as DOMMatrixAdapter,
  pv as DecorWith,
  LS as DragHandler,
  Cs as E,
  Ny as EventHandler,
  vw as FileHandler,
  aS as GLitElement,
  hS as GridAnimationUtils,
  an as GridCellUtils,
  q as GridCoordUtils,
  pS as GridInteractionUtils,
  dv as GridLayoutUtils,
  Pe as H,
  Jv as HistoryManager,
  Xy as I,
  Kv as ITEM_COMPACT_KIND,
  qs as JUNCTION_DRAG_EVENTS,
  Gs as JUNCTION_RESIZE_EVENTS,
  pi as JUNCTION_SELECT_EVENTS,
  Jh as JunctionDragMixin,
  Qh as JunctionResizeMixin,
  Kh as JunctionSelectMixin,
  FS as LongHoverHandler,
  WS as LongPressHandler,
  Qa as M,
  Pm as Matrix2D,
  Am as Matrix3D,
  Ju as Matrix4D,
  dS as OOBTrigger,
  Ke as Q,
  Uy as Qp,
  VS as ReactiveAnimation,
  US as ReactiveCSSValue,
  vf as ReactiveElementSize,
  qS as ReactiveMediaQuery,
  GS as ReactiveScroll,
  mf as ReactiveTransform,
  Sv as ReactiveViewport,
  $S as ResizeHandler,
  ba as S,
  Ix as ScrollBar,
  gg as ScrollbarThemeManager,
  DS as SelectionController,
  Jl as SwM,
  HS as SwipeHandler,
  nr as T,
  cc as Task,
  Pg as TemplateManager,
  Tv as UnderlyingShadow,
  Y as Vector2D,
  Xt as Vector3D,
  dn as Vector4D,
  lg as VoiceInputManager,
  a0 as absolutePosition,
  I0 as absoluteRef,
  P0 as acosRef,
  cv as addProxiedEvent,
  v0 as addRef,
  ty as addToBank,
  on as addVector2D,
  F0 as addVector3D,
  q0 as addVector4D,
  OS as agWrapEvent,
  Yp as alives,
  xf as appendAsLayer,
  Cv as appendAsOverlay,
  _f as appendAsUnderlying,
  Xr as appendChild,
  Pv as appendScrollbarOverlay,
  fo as applyAnchorName,
  ts as applyNormalizedInlineStyle,
  C0 as asinRef,
  T0 as atan2Ref,
  A0 as atanRef,
  d_ as attachFile,
  Gu as attrLink,
  zm as attrRef,
  kw as bank,
  Wx as batteryStatusRef,
  jS as bindAnchorableDragResize,
  Ge as bindAnimated,
  Ow as bindAnimatedBatch,
  Ew as bindBeh,
  Nw as bindConditionalAnimation,
  ku as bindCtrl,
  il as bindDraggable,
  I_ as bindDropToDir,
  Pw as bindForms,
  ri as bindHandler,
  Ov as bindMenuItemClickHandler,
  ny as bindMorph,
  Iw as bindPreset,
  hc as bindScrollbarPosition,
  Wt as bindSpring,
  by as bindStyle,
  wt as bindTransition,
  iy as bindWhileConnected,
  A as bindWith,
  Rw as bindWithAnimation,
  XS as bindWithRect,
  Kb as blobToBase64,
  hl as blobToBytes,
  Jb as blobToDataUrl,
  Yb as blobToText,
  Nx as boolDepIconRef,
  Gt as booleanRef,
  Ts as boundingBoxAnchorRef,
  Mw as cancelAnimations,
  vS as ceilCell,
  kS as checkCellCollision,
  Sm as checkedLink,
  Dm as checkedRef,
  yS as clampCell,
  Ps as clampPointToRect,
  z0 as clampRef,
  Uf as clampedValueRef,
  p_ as clearAllInDirectory,
  V_ as clearComponentCache,
  mx as clearDesktopDraft,
  fc as clickPrevention,
  Ww as closeByGroup,
  im as closeHighestPriority,
  Og as colorScheme,
  Yv as compactIconSrcForStorage,
  gy as compileInlineStyleAttribute,
  l0 as constrainRectAspectRatio,
  Sg as convertPointerToValue,
  Hf as convertPointerToValueShift,
  $x as convertValueToPointer,
  Fv as copy,
  sr as copyFromOneHandlerToAnother,
  fx as copyWithResult,
  Bf as correctValue,
  k0 as cosRef,
  Aw as createAnimatedRef,
  Tw as createAnimationSequence,
  Uw as createBackNavigableModal,
  ex as createBlurShadow,
  Ef as createBoxShadow,
  ZS as createDropShadow,
  $w as createElement,
  H_ as createFileHandler,
  t_ as createHandler,
  Sx as createHistoryManager,
  __ as createJsonFile,
  x_ as createMarkdownFile,
  nx as createPanelUnderShadow,
  KS as createReactiveScrollbarOverlay,
  nl as createRect2D,
  tx as createShapedTileShadow,
  Fx as createTemplateManager,
  S_ as createTextFile,
  ol as createUnderlyingShadow,
  U0 as crossProduct3D,
  zw as css,
  rx as ctxMenuTrigger,
  O0 as cubeRootRef,
  qx as currentColorFromCenterRef,
  Vx as currentColorFromPointRef,
  Na as currentHandleMap,
  oS as customElement,
  Dc as decodeBase64ToBytes,
  gc as decodeDesktopState,
  je as defaultLogger,
  gf as defaultZIndexShift,
  ov as defineElement,
  ld as detectTypeByRelPath,
  At as directHandlers,
  ia as directoryCacheMap,
  q_ as disposeCachedComponents,
  w0 as divideRef,
  L0 as divideVector2D,
  B0 as divideVector3D,
  Y0 as divideVector4D,
  pf as doObserve,
  $0 as dotProduct2D,
  j0 as dotProduct3D,
  K0 as dotProduct4D,
  z_ as downloadByPath,
  Wb as downloadFile,
  k_ as downloadMarkdown,
  hd as downloadTextFile,
  Dx as dragSlider,
  zS as draggingPointerMap,
  h_ as dropAsTempFile,
  dd as dropFile,
  ix as dropMenuTrigger,
  Ra as dynamicBgColors,
  Vf as dynamicNativeFrame,
  Rg as dynamicTheme,
  h0 as easeInOutCubic,
  p0 as easeOutBounce,
  Ox as effectProperty,
  En as elMap,
  Ux as electronAPI,
  yv as elementPointerMap,
  Xb as encodeBytesToBase64,
  Of as encodeDesktopState,
  Sf as enhancedIntersectionBoxAnchorRef,
  Ib as ensureWorker,
  cr as eventTrigger,
  gx as expandIconSrcForDom,
  Lw as extendQueryPrototype,
  j_ as extractTextFromDataTransfer,
  Nf as faviconRefForHref,
  Xv as faviconUrlForHostname,
  T_ as fileToDataUrl,
  _S as findPathBetweenCells,
  mS as floorCell,
  Lb as generalFileImportDesc,
  bv as generateAnchorId,
  iS as generateName,
  Rx as generateScrollbarCSS,
  Vu as getActiveCloseable,
  rm as getActiveCloseables,
  SS as getAdjacentCells,
  xa as getBy,
  U_ as getCachedComponent,
  wS as getCellDistance,
  xS as getCellsInRange,
  Pc as getClampedValue,
  wv as getComputedZIndex,
  Nb as getDir,
  zt as getDirectoryHandle,
  Ca as getExistsZIndex,
  Zx as getFileExtension,
  Ns as getFileHandle,
  o_ as getFileWriter,
  nn as getFocused,
  Pf as getGlobalContextMenu,
  Fb as getHandler,
  Za as getIgnoreNextPopState,
  ur as getInputValues,
  W_ as getJSONFromFile,
  Hb as getLeast,
  F_ as getMarkDownFromFile,
  e_ as getMimeTypeByFilename,
  $r as getParentOrShadowRoot,
  kx as getSpeechPrompt,
  xg as getValueWithShift,
  kr as ghostImage,
  mv as grabForDrag,
  sl as handleByPointer,
  nt as handleError,
  BS as handleForFixPosition,
  Bb as handleIncomingEntries,
  Hw as hasActiveCloseable,
  Db as hasFileExtension,
  Cw as hasInBank,
  mm as hashTargetLink,
  eS as hashTargetRef,
  lS as historyBack,
  B as historyState,
  Fw as historyViewRef,
  ir as hostnameToFaviconRef,
  Zm as html,
  tv as htmlBuilder,
  M0 as hypotRef,
  Ht as ignoreNextPopState,
  zb as imageImportDesc,
  Ax as implementDropEvent,
  Px as implementPasteEvent,
  zx as indicationRef,
  om as initBackNavigation,
  ox as initClipboardReceiver,
  dx as initGlobalClipboard,
  em as initHistory,
  YS as intersectionBoxAnchorRef,
  Hc as isBase64Like,
  jv as isChromeExtension,
  ax as isClipboardAvailable,
  lx as isClipboardWriteAvailable,
  g_ as isCodeFile,
  Eu as isEffectivelyEmptyStyleText,
  Vv as isExternalHttpHrefForFavicon,
  v_ as isImageFile,
  y_ as isMarkdownFile,
  ns as isNativeCSSStyleValue,
  lo as isNotExtended,
  Pu as isReactiveStyleValue,
  Ex as isSpeechRecognitionAvailable,
  m_ as isTextFile,
  Mv as itemClickHandle,
  Vs as junctionToBox,
  zr as lazyAddEventListener,
  gw as lazyLoadComponent,
  Bv as listenForClipboardRequests,
  df as loadCachedStyles,
  hx as loadDesktopRaw,
  ym as localStorageLink,
  Un as localStorageLinkMap,
  nf as localStorageRef,
  tf as magnitude2D,
  Im as magnitude3D,
  Nm as magnitude4D,
  wf as makeAnchorElement,
  fS as makeClickOutsideTrigger,
  Cc as makeInteractive,
  hf as makeInterruptTrigger,
  In as makeLinker,
  Af as makeMenuHandler,
  mt as makeRef,
  jx as makeRenderer,
  rl as makeShiftTrigger,
  co as makeTask,
  uS as makeTasks,
  _x as makeUIState,
  tS as makeWeakRef,
  Lc as mappedRoots,
  vm as matchMediaLink,
  Wm as matchMediaRef,
  Xw as matrix2x2Ref,
  Kw as matrix3x3Ref,
  Qw as matrix4x4Ref,
  n_ as mayNotPromise,
  Ig as maybeStartThemeEngine,
  _r as mergeByKey,
  Yi as mixinDisposers,
  S0 as modulusRef,
  y0 as momentumScroll,
  Jx as mountAsRoot,
  b0 as multiplyRef,
  Sa as multiplyVector2D,
  H0 as multiplyVector3D,
  X0 as multiplyVector4D,
  pm as mutationTrigger,
  tm as navigate,
  cS as navigationEnable,
  D0 as normalize2D,
  V0 as normalize3D,
  J0 as normalize4D,
  M_ as normalizeDataAsset,
  vx as normalizeIconSrcFromPayload,
  $b as normalizePath,
  w as numberRef,
  Aa as observeConnect,
  Pa as observeDisconnect,
  qw as observeSizeLink,
  r_ as openDirectory,
  A_ as openFile,
  c_ as openImageFilePicker,
  N_ as openPickerAndWrite,
  g as operated,
  O_ as opfsModifyJson,
  ES as optimizeCellLayout,
  Em as orientLink,
  Q0 as orientRef,
  Dw as originalBack,
  Zy as originalForward,
  Qy as originalGo,
  Ky as originalPush,
  Jy as originalReplace,
  qv as packHrefInline,
  Bm as paddingBoxSize,
  La as parseDataUrl,
  wx as parseDesktopItemCompact,
  mw as parseJsonSafely,
  yx as persistDesktopDraft,
  px as persistDesktopMain,
  cs as pickBgColor,
  pd as pickFile,
  E_ as pickFiles,
  Ma as pickFromCenter,
  C_ as pickMarkdownFile,
  Rm as pointToRectDistance,
  cg as pointerAnchorRef,
  Cm as pointerEventLink,
  rS as pointerEventRef,
  It as post,
  x0 as powerRef,
  Cg as progress,
  gi as propStore,
  sS as property,
  fd as provide,
  Cu as pruneEmptyStyleAttribute,
  xm as radioValueLink,
  Z0 as radioValueRef,
  Lx as reactiveInputHandleTransform,
  Wf as reactiveInputPosition,
  nS as reactiveScrollbarSize,
  i_ as readAsObjectURL,
  cd as readFile,
  w_ as readFileAsArrayBuffer,
  b_ as readFileAsDataURL,
  jb as readFileAsText,
  s_ as readFileUTF8,
  B_ as readMarkdownFromUrl,
  sx as readText,
  Om as rectArea,
  Zu as rectCenter,
  ef as rectContainsPoint,
  Tm as rectIntersects,
  Mm as rectUnion,
  Gw as refCtl,
  Jp as reflectControllers,
  lr as registerCloseable,
  am as registerContextMenu,
  kf as registerLayerElement,
  lm as registerModal,
  jw as registerOverlay,
  JS as registerOverlayElement,
  Bw as registerSidebar,
  av as registerTask,
  QS as registerUnderlyingElement,
  o0 as relativePosition,
  rn as reloadInto,
  l_ as remove,
  Ir as removeChild,
  a_ as removeDirectory,
  ud as removeFile,
  ey as removeFromBank,
  Ay as replaceChildren,
  Hv as requestCopy,
  cx as requestCopyViaCRX,
  Cx as requestMicrophonePermission,
  Vw as resizeTrigger,
  Eg as resolveDragging,
  xv as resolveLayerZIndex,
  Lt as resolvePath,
  li as resolveRootHandle,
  r0 as rotate2D,
  gS as roundCell,
  L_ as sanitizeFileName,
  P_ as saveFile,
  xx as saveUIState,
  n0 as scale2D,
  i0 as scaleRectAroundCenter,
  d0 as screenToControlValue,
  m0 as scrollBoundsWithBounce,
  wm as scrollLink,
  As as scrollRef,
  Hm as scrollSize,
  f0 as scrollbarMetrics,
  Yt as scrollbarThemes,
  bx as serializeDesktopItemCompact,
  Xe as setIgnoreNextPopState,
  jf as setInputValue,
  kg as setValueByPointer,
  _g as setValueByShift,
  Mx as showAttributeRef,
  N0 as signRef,
  Bx as signalStatusRef,
  _0 as sinRef,
  bm as sizeLink,
  Qt as sizeRef,
  u0 as sliderThumbPosition,
  c0 as smoothValueTransition,
  bS as snapToGridCell,
  R0 as squareRootRef,
  $_ as stopAllWatchers,
  ew as stringToBlob,
  md as stringToBlobOrFile,
  R_ as stringToFile,
  nv as styleCache,
  rv as styleElementCache,
  g0 as subtractRef,
  ss as subtractVector2D,
  W0 as subtractVector3D,
  G0 as subtractVector4D,
  E0 as tanRef,
  Hx as timeStatusRef,
  oi as toText,
  s0 as transformRect2D,
  t0 as translate2D,
  Qx as unmountAsRoot,
  Gv as unpackHrefInline,
  nm as unregisterCloseable,
  yi as updateInput,
  Gx as updateThemeBase,
  u_ as uploadDirectory,
  f_ as uploadFile,
  km as valueAsNumberLink,
  $m as valueAsNumberRef,
  _m as valueLink,
  Lm as valueRef,
  X as vector2Ref,
  Yw as vector3Ref,
  Jw as vector4Ref,
  Zw as vectorFromArray,
  e0 as vectorToArray,
  Tx as visibleBySelectorRef,
  gm as visibleLink,
  Fm as visibleRef,
  D_ as watchFsDirectory,
  ry as withInsetWithPointer,
  sv as withProperties,
  Wn as writeFile,
  pw as writeFileSmart,
  ow as writeFilesToDir,
  $v as writeHTML,
  pc as writeImage,
  Kr as writeText
};
