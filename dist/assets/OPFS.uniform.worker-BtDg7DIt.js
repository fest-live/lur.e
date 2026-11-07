"use strict";
(function() {
	var ie = Object.defineProperty, $e = (e, t, n) => () => {
		if (n) throw n[0];
		try {
			return e && (t = e(e = 0)), t;
		} catch (r) {
			throw n = [r], r;
		}
	}, ze = (e, t) => {
		let n = {};
		for (var r in e) ie(n, r, {
			get: e[r],
			enumerable: !0
		});
		return t || ie(n, Symbol.toStringTag, { value: "Module" }), n;
	};
	let h = (function(e) {
		return e.GET = "get", e.SET = "set", e.CALL = "call", e.APPLY = "apply", e.CONSTRUCT = "construct", e.DELETE = "delete", e.DELETE_PROPERTY = "deleteProperty", e.HAS = "has", e.OWN_KEYS = "ownKeys", e.GET_OWN_PROPERTY_DESCRIPTOR = "getOwnPropertyDescriptor", e.GET_PROPERTY_DESCRIPTOR = "getPropertyDescriptor", e.GET_PROTOTYPE_OF = "getPrototypeOf", e.SET_PROTOTYPE_OF = "setPrototypeOf", e.IS_EXTENSIBLE = "isExtensible", e.PREVENT_EXTENSIONS = "preventExtensions", e.TRANSFER = "transfer", e.IMPORT = "import", e.DISPOSE = "dispose", e;
	})({});
	const Ke = {
		ws: "websocket",
		socket: "websocket",
		socketio: "socket-io",
		service: "service-worker",
		sw: "service-worker",
		"service-worker-client": "service-worker",
		"service-worker-host": "service-worker",
		"ring-buffer": "atomics"
	};
	function Ye(e) {
		const t = String(e ?? "").trim().toLowerCase();
		return t ? Ke[t] ?? t : "internal";
	}
	function Ve(e) {
		return typeof e == "string" ? Ye(e) : typeof Worker < "u" && e instanceof Worker ? "worker" : typeof SharedWorker < "u" && e instanceof SharedWorker ? "shared-worker" : typeof MessagePort < "u" && e instanceof MessagePort ? "message-port" : typeof BroadcastChannel < "u" && e instanceof BroadcastChannel ? "broadcast" : typeof WebSocket < "u" && e instanceof WebSocket ? "websocket" : typeof RTCDataChannel < "u" && e instanceof RTCDataChannel ? "rtc-data" : typeof chrome < "u" && e && typeof e == "object" && typeof e.postMessage == "function" && e.onMessage?.addListener ? "chrome-port" : "internal";
	}
	const ae = Symbol.for("@fix"), b = (e) => typeof e == "string" || typeof e == "number" || typeof e == "boolean" || typeof e == "bigint" || typeof e > "u" || e == null, Xe = (e, t) => b(e) ? t == "number" ? Number(e) || 0 : t == "string" ? String(e) || "" : t == "boolean" ? !!e : e : null, p = (e, t) => e?.[ae] ?? e ?? t ?? t, je = (e) => {
		if (typeof e == "function" || e == null) return e;
		const t = function() {};
		return t[ae] = e, t;
	}, Je = (e) => crypto?.getRandomValues ? crypto?.getRandomValues?.(e) : (() => {
		const t = new Uint8Array(e.length);
		for (let n = 0; n < e.length; n++) t[n] = Math.floor(Math.random() * 256);
		return t;
	})(), d = () => crypto?.randomUUID ? crypto?.randomUUID?.() : "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (e) => (+e ^ Je?.(/* @__PURE__ */ new Uint8Array(1))?.[0] & 15 >> +e / 4).toString(16)), ce = (e) => Array.isArray(e) ? e?.flatMap?.((t) => Array.isArray(t) ? ce(t) : t) : e, X = (e) => ce(e)?.every?.(x), x = (e) => b(e) || typeof SharedArrayBuffer == "function" && e instanceof SharedArrayBuffer || Qe(e) || Array.isArray(e) && X(e), Qe = (e) => ArrayBuffer.isView(e) && !(e instanceof DataView), j = (e) => b(e) || typeof ArrayBuffer == "function" && e instanceof ArrayBuffer || typeof MessagePort == "function" && e instanceof MessagePort || typeof ReadableStream == "function" && e instanceof ReadableStream || typeof WritableStream == "function" && e instanceof WritableStream || typeof TransformStream == "function" && e instanceof TransformStream || typeof ImageBitmap == "function" && e instanceof ImageBitmap || typeof VideoFrame == "function" && e instanceof VideoFrame || typeof OffscreenCanvas == "function" && e instanceof OffscreenCanvas || typeof RTCDataChannel == "function" && e instanceof RTCDataChannel || typeof AudioData == "function" && e instanceof AudioData || typeof WebTransportReceiveStream == "function" && e instanceof WebTransportReceiveStream || typeof WebTransportSendStream == "function" && e instanceof WebTransportSendStream || typeof WebTransportReceiveStream == "function" && e instanceof WebTransportReceiveStream, J = Symbol.for("@promise"), Ze = /* @__PURE__ */ new Set([
		Symbol.for("@extract"),
		Symbol.for("@origin"),
		Symbol.for("@registry"),
		Symbol.for("@value"),
		Symbol.for("@promise"),
		Symbol.for("@behavior"),
		Symbol.for("@trigger"),
		Symbol.for("@subscribe"),
		Symbol.for("@realProp"),
		Symbol.for("@trigger-lock"),
		Symbol.for("@trigger-less"),
		Symbol.for("@trigger-control"),
		Symbol.for("@isNotEqual"),
		Symbol.for("@fix"),
		Symbol.for("@target"),
		Symbol.for("@resolved")
	]), L = (e) => e instanceof Promise || typeof e?.then == "function", le = (e) => Promise.resolve(e).then((t) => ({
		status: "fulfilled",
		value: t
	}), (t) => ({
		status: "rejected",
		reason: t
	})), ue = (e) => Reflect.ownKeys(e).filter((t) => {
		if (Ze.has(t)) return !1;
		const n = Object.getOwnPropertyDescriptor(e, t);
		return n !== void 0 && n.enumerable;
	}), B = (e, t) => {
		if (e == null || b(e)) return !1;
		if (L(e) || L(e?.[J])) return !0;
		if (typeof e != "object" && typeof e != "function") return !1;
		const n = t ?? /* @__PURE__ */ new WeakSet();
		return n.has(e) ? !1 : (n.add(e), Array.isArray(e) ? e.some((r) => B(r, n)) : e instanceof Map ? [...e.values()].some((r) => B(r, n)) : e instanceof Set ? [...e.values()].some((r) => B(r, n)) : ue(e).some((r) => B(e[r], n)));
	};
	function H(e, t, n) {
		if (e == null || b(e) || typeof e == "symbol" || L(e)) return e;
		const r = e?.[J];
		if (L(r)) return r;
		if (typeof e != "object" && typeof e != "function" || n.has(e)) return e;
		if (n.add(e), Array.isArray(e)) {
			const o = e.map((i) => H(i, t, n));
			return t == "settled" ? Promise.allSettled(o) : Promise.all(o);
		}
		if (e instanceof Set) {
			const o = [...e.values()].map((i) => H(i, t, n));
			return t == "settled" ? Promise.allSettled(o) : Promise.all(o);
		}
		const s = {};
		if (e instanceof Map) for (const [o, i] of e.entries()) s[o] = H(i, t, n);
		else for (const o of ue(e)) s[o] = H(e[o], t, n);
		return t == "settled" ? Promise.allSettledKeyed(s) : Promise.allKeyed(s);
	}
	function S(e, t = "all") {
		if (L(e)) return t == "settled" ? le(e) : Promise.resolve(e);
		const n = e?.[J];
		return L(n) ? t == "settled" ? le(n) : Promise.resolve(n) : Promise.resolve(H(e, t, /* @__PURE__ */ new WeakSet()));
	}
	S.all = (e) => S(e, "all"), S.allSettled = (e) => S(e, "settled"), S.allKeyed = (e) => Promise.allKeyed(e), S.allSettledKeyed = (e) => Promise.allSettledKeyed(e), S.try = (e, ...t) => Promise.try(e, ...t).then((n) => S(n, "all"));
	const he = Symbol.for("object.boundCtx");
	globalThis[he] ??= /* @__PURE__ */ new WeakMap();
	globalThis[he];
	const k = (e, t, n) => {
		if (Array.isArray(e)) return e.every(x) ? e.map(t) : e.map((r, s) => k(r, t, [e, s]));
		if (e instanceof Map) {
			const r = Array.from(e.entries());
			return r.map(([s, o]) => o).every(x) ? new Map(r.map(([s, o]) => [s, t(o, s, e)])) : new Map(r.map(([s, o]) => [s, k(o, t, [e, s])]));
		}
		if (e instanceof Set) {
			const r = Array.from(e.entries()), s = r.map(([o, i]) => i);
			return r.every(x) ? new Set(s.map(t)) : new Set(s.map((o) => k(o, t, [e, o])));
		}
		if (typeof e == "object" && e?.constructor == Object && Object.prototype.toString.call(e) == "[object Object]") {
			const r = Array.from(Object.entries(e));
			return r.map(([s, o]) => o).every(x) ? Object.fromEntries(r.map(([s, o]) => [s, t(o, s, e)])) : Object.fromEntries(r.map(([s, o]) => [s, k(o, t, [e, s])]));
		}
		return t(e, n?.[1] ?? "", n?.[0] ?? null);
	}, de = Symbol.for("@resolved-promise"), fe = Symbol.for("@handled-promise");
	globalThis[de] ??= /* @__PURE__ */ new WeakMap(), globalThis[fe] ??= /* @__PURE__ */ new WeakMap();
	const P = globalThis[de], pe = globalThis[fe], et = Symbol.for("@extract"), Q = (e) => e instanceof Promise || typeof e?.then == "function", m = (e, t) => Q(e) ? P?.has?.(e) ? t(P?.get?.(e)) : Promise.try?.(async () => {
		const n = await e;
		return P?.set?.(e, n), n;
	})?.then?.(t) : t(e);
	var tt = class {
		#e;
		#t;
		constructor(e, t) {
			this.#e = e, this.#t = t;
		}
		defineProperty(e, t, n) {
			return p(e) instanceof Promise ? Reflect.defineProperty(e, t, n) : m(p(e), (r) => Reflect.defineProperty(r, t, n));
		}
		deleteProperty(e, t) {
			return p(e) instanceof Promise ? Reflect.deleteProperty(e, t) : m(p(e), (n) => Reflect.deleteProperty(n, t));
		}
		getPrototypeOf(e) {
			return p(e) instanceof Promise ? Reflect.getPrototypeOf(e) : m(p(e), (t) => Reflect.getPrototypeOf(t));
		}
		setPrototypeOf(e, t) {
			return p(e) instanceof Promise ? Reflect.setPrototypeOf(e, t) : m(p(e), (n) => Reflect.setPrototypeOf(n, t));
		}
		isExtensible(e) {
			return p(e) instanceof Promise ? Reflect.isExtensible(e) : m(p(e), (t) => Reflect.isExtensible(t));
		}
		preventExtensions(e) {
			return p(e) instanceof Promise ? Reflect.ownKeys(e) : m(p(e), (t) => Reflect.preventExtensions(t));
		}
		ownKeys(e) {
			const t = p(e);
			return t instanceof Promise ? Object.keys(t) : m(t, (n) => (typeof n == "object" || typeof n == "function") && n != null ? Object.keys(n) : []) ?? [];
		}
		getOwnPropertyDescriptor(e, t) {
			return p(e) instanceof Promise ? Reflect.getOwnPropertyDescriptor(e, t) : m(p(e), (n) => Reflect.getOwnPropertyDescriptor(n, t));
		}
		construct(e, t, n) {
			return m(p(e), (r) => Reflect.construct(r, t, n));
		}
		has(e, t) {
			return p(e) instanceof Promise ? Reflect.has(e, t) : m(p(e), (n) => Reflect.has(n, t));
		}
		get(e, t, n) {
			if (e = p(e), t == "promise") return e;
			if (t == "resolve" && this.#e) return (...s) => {
				const o = this.#e?.(...s);
				return this.#e = null, o;
			};
			if (t == "reject" && this.#t) return (...s) => {
				const o = this.#t?.(...s);
				return this.#t = null, o;
			};
			if (t == "then" || t == "catch" || t == "finally") {
				if (e instanceof Promise) return e?.[t]?.bind?.(e);
				{
					const s = Promise.try(() => e);
					return s?.[t]?.bind?.(s);
				}
			}
			let r;
			return P?.has?.(e) && (r = P?.get?.(e))?.[t] != null ? r = P?.get?.(e)?.[t] : r = E(m(e, async (s) => {
				if (p(s) instanceof Promise) return Reflect.get(s, t, n);
				if (b(s)) return t == Symbol.toPrimitive || t == Symbol.toStringTag ? s : void 0;
				let o;
				try {
					o = Reflect.get(s, t, n);
				} catch {
					o = e?.[t];
				}
				return typeof o == "function" ? o?.bind?.(s) : o;
			})), t == Symbol.toStringTag ? b(r) ? String(r ?? "") || "" : r?.[Symbol.toStringTag]?.() || String(r ?? "") || "" : t == Symbol.toPrimitive ? (s) => {
				if (b(r)) return Xe(r, s);
			} : r;
		}
		set(e, t, n) {
			return m(p(e), (r) => Reflect.set(r, t, n));
		}
		apply(e, t, n) {
			if (this.#e) {
				const r = this.#e?.(...n);
				return this.#e = null, r;
			}
			return m(p(e, this.#e), (r) => {
				if (typeof r == "function") return p(r) instanceof Promise, Reflect.apply(r, t, n);
			});
		}
	};
	function E(e, t, n) {
		return e != null && typeof e?.resolved == "function" && e[et] != null && B(e) ? E(e.resolved(), t, n) : !Q(e) && B(e) ? E(S(e), t, n) : Q(e) ? P?.has?.(e) ? P?.get?.(e) : (pe?.has?.(e) || e?.then?.((r) => P?.set?.(e, r)), pe.getOrInsertComputed(e, () => new Proxy(je(e), new tt(t, n)))) : e;
	}
	E.allKeyed = function(e, t, n) {
		return E(Promise.allKeyed(e), t, n);
	}, E.allSettledKeyed = function(e, t, n) {
		return E(Promise.allSettledKeyed(e), t, n);
	};
	var _e = class {
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
	}, nt = class {
		_producer;
		constructor(e) {
			this._producer = e;
		}
		subscribe(e, t) {
			const n = typeof e == "function" ? { next: e } : e ?? {}, r = new AbortController();
			t?.signal?.addEventListener("abort", () => r.abort());
			let s = !0, o;
			const i = () => {
				s = !1, r.abort(), o?.();
			}, a = {
				next: (c) => s && n.next?.(c),
				error: (c) => {
					s && (n.error?.(c), i());
				},
				complete: () => {
					s && (n.complete?.(), i());
				},
				signal: r.signal,
				get active() {
					return s && !r.signal.aborted;
				}
			};
			try {
				o = this._producer(a);
			} catch (c) {
				a.error(c);
			}
			return new _e(i);
		}
		pipe(...e) {
			return e.reduce((t, n) => n(t), this);
		}
	}, y = class {
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
			return new _e(() => {
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
	};
	const rt = (e) => (t) => new nt((n) => {
		const r = t.subscribe({
			next: (s) => e(s) && n.next(s),
			error: (s) => n.error(s),
			complete: () => n.complete()
		});
		return () => r.unsubscribe();
	});
	function ye() {
		if (typeof globalThis.Deno < "u") return "deno";
		if (typeof globalThis.process < "u" && globalThis.process?.versions?.node) return "node";
		const e = globalThis.ServiceWorkerGlobalScope, t = globalThis.SharedWorkerGlobalScope, n = globalThis.DedicatedWorkerGlobalScope;
		if (e && self instanceof e) return "service-worker";
		if (t && self instanceof t) return "shared-worker";
		if (n && self instanceof n) return "worker";
		if (typeof chrome < "u" && chrome.runtime?.id) {
			if (typeof chrome.runtime.getBackgroundPage == "function" || chrome.runtime.getManifest?.()?.background?.service_worker) return "chrome-background";
			if (typeof chrome.devtools < "u") return "chrome-devtools";
			if (typeof document < "u" && globalThis?.location?.protocol === "chrome-extension:" && (chrome.extension?.getViews?.({ type: "popup" }) ?? []).includes(globalThis)) return "chrome-popup";
			if (typeof document < "u" && globalThis?.location?.protocol !== "chrome-extension:") return "chrome-content";
		}
		return typeof globalThis < "u" && typeof document < "u" ? "window" : "unknown";
	}
	function me(e) {
		if (typeof RTCDataChannel < "u" && e instanceof RTCDataChannel) return "rtc-data";
		const t = Ve(e);
		return t && t !== "internal" ? t : e === self || e === globalThis || e === "self" ? "self" : "internal";
	}
	function st(e) {
		if (!e) return "unknown";
		if (e.contextType) return e.contextType;
		const t = e.sender ?? "";
		return t.includes("worker") ? "worker" : t.includes("sw") || t.includes("service") ? "service-worker" : t.includes("chrome") || t.includes("crx") ? "chrome-content" : t.includes("background") ? "chrome-background" : "unknown";
	}
	const ot = {
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
	}, it = Symbol.for("uniform.proxy"), at = Symbol.for("uniform.proxy.internals");
	var ct = class {
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
			if (t === it) return !0;
			if (t === at) return this._config;
			if (t === wt) return !0;
			if (t === q) return this._getDescriptor();
			if (t === "then" || t === "catch" || t === "finally" || typeof t == "symbol") return;
			if (t === "$path") return this._config.basePath;
			if (t === "$channel") return this._config.channel;
			if (t === "$descriptor") return this._getDescriptor();
			if (t === "$invoke") return this._invoker;
			const s = [...this._config.basePath, r];
			if (this._config.cache && this._childCache.has(r)) return this._childCache.get(r);
			const o = z(this._invoker, {
				...this._config,
				basePath: s
			});
			return this._config.cache && this._childCache.set(r, o), o;
		}
		set(e, t, n, r) {
			return typeof t == "symbol" || this._invoker(h.SET, [...this._config.basePath, String(t)], [n]), !0;
		}
		apply(e, t, n) {
			return this._invoker(h.APPLY, this._config.basePath, [n]);
		}
		construct(e, t, n) {
			return this._invoker(h.CONSTRUCT, this._config.basePath, [t]);
		}
		has(e, t) {
			return typeof t == "symbol" ? !1 : this._invoker(h.HAS, this._config.basePath, [t]);
		}
		deleteProperty(e, t) {
			return typeof t == "symbol" ? !0 : this._invoker(h.DELETE_PROPERTY, [...this._config.basePath, String(t)], []);
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
			return this._invoker(h.SET_PROTOTYPE_OF, this._config.basePath, [t]);
		}
		isExtensible(e) {
			return !0;
		}
		preventExtensions(e) {
			return this._invoker(h.PREVENT_EXTENSIONS, this._config.basePath, []);
		}
		_getDescriptor() {
			return {
				path: this._config.basePath,
				channel: this._config.channel,
				primitive: !1
			};
		}
	};
	function z(e, t) {
		const n = function() {}, r = new ct(e, t);
		return new Proxy(n, r);
	}
	function ge(e, t, n) {
		if (!e || typeof e != "object" || e.primitive) return e;
		const r = ke.get(e);
		if (r) return r;
		const s = z(t, {
			channel: n ?? e.channel ?? "unknown",
			basePath: e.path ?? []
		});
		return ke.set(e, s), te.set(s, e), s;
	}
	const ht = ge;
	function dt(e) {
		return [
			e.localChannel,
			e.remoteChannel,
			e.sender,
			e.transportType,
			e.direction
		].join("::");
	}
	function ft(e, t = {}) {
		const n = t.includeClosed ?? !1, r = t.status ?? (n ? void 0 : "active");
		return [...e].filter((s) => !(r && s.status !== r || t.channel && s.localChannel !== t.channel && s.remoteChannel !== t.channel || t.localChannel && s.localChannel !== t.localChannel || t.remoteChannel && s.remoteChannel !== t.remoteChannel || t.sender && s.sender !== t.sender || t.transportType && s.transportType !== t.transportType || t.direction && s.direction !== t.direction)).sort((s, o) => o.updatedAt - s.updatedAt);
	}
	var we = class {
		_createId;
		_emitEvent;
		_connections = /* @__PURE__ */ new Map();
		constructor(e, t) {
			this._createId = e, this._emitEvent = t;
		}
		register(e) {
			const t = dt(e), n = Date.now(), r = this._connections.get(t);
			if (r) return r.updatedAt = n, r.status = "active", r.metadata = {
				...r.metadata,
				...e.metadata
			}, r;
			const s = {
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
			return this._connections.set(t, s), this._emitEvent?.({
				type: "connected",
				connection: s,
				timestamp: n
			}), s;
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
			for (const n of this._connections.values()) n.localChannel !== e && n.remoteChannel !== e || n.status !== "closed" && (n.status = "closed", n.updatedAt = t, this._emitEvent?.({
				type: "disconnected",
				connection: n,
				timestamp: t
			}));
		}
		closeAll() {
			const e = Date.now();
			for (const t of this._connections.values()) t.status !== "closed" && (t.status = "closed", t.updatedAt = e, this._emitEvent?.({
				type: "disconnected",
				connection: t,
				timestamp: e
			}));
		}
		query(e = {}) {
			return ft(this._connections.values(), e);
		}
		values() {
			return [...this._connections.values()];
		}
		clear() {
			this._connections.clear();
		}
	}, be = class {
		_name;
		_contextType;
		_config;
		_transports = /* @__PURE__ */ new Map();
		_defaultTransport = null;
		_connectionEvents = new y({ bufferSize: 200 });
		_connectionRegistry = new we(() => d(), (e) => this._connectionEvents.next(e));
		_pending = /* @__PURE__ */ new Map();
		_subscriptions = [];
		_inbound = new y({ bufferSize: 100 });
		_outbound = new y({ bufferSize: 100 });
		_invocations = new y({ bufferSize: 100 });
		_responses = new y({ bufferSize: 100 });
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
			this._name = t.name, this._contextType = t.autoDetect !== !1 ? ye() : "unknown", this._config = {
				name: t.name,
				autoDetect: t.autoDetect ?? !0,
				timeout: t.timeout ?? 3e4,
				reflect: t.reflect ?? ot,
				bufferSize: t.bufferSize ?? 100,
				autoListen: t.autoListen ?? !0
			}, this._config.autoListen && this._isWorkerContext() && this.listen(self);
		}
		connect(e, t = {}) {
			const n = me(e), r = t.targetChannel ?? this._inferTargetChannel(e, n), s = this._createTransportBinding(e, n, r, t);
			this._transports.set(r, s), this._defaultTransport || (this._defaultTransport = s);
			const o = this._registerConnection({
				localChannel: this._name,
				remoteChannel: r,
				sender: this._name,
				transportType: n,
				direction: "outgoing",
				metadata: { phase: "connect" }
			});
			return this._emitConnectionSignal(s, "connect", {
				connectionId: o.id,
				from: this._name,
				to: r
			}), this;
		}
		listen(e, t = {}) {
			const n = me(e), r = t.targetChannel ?? this._inferTargetChannel(e, n), s = (i) => this._handleIncoming(i), o = this._registerConnection({
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
					t.autoStart !== !1 && e.start && e.start(), e.addEventListener?.("message", ((i) => s(i.data)));
					break;
				case "websocket":
					e.addEventListener?.("message", ((i) => {
						try {
							s(JSON.parse(i.data));
						} catch {}
					}));
					break;
				case "chrome-runtime":
					chrome.runtime.onMessage?.addListener?.((i, a, c) => (s(i), !0));
					break;
				case "chrome-tabs":
					chrome.runtime.onMessage?.addListener?.((i, a) => t.tabId != null && a?.tab?.id !== t.tabId ? !1 : (s(i), !0));
					break;
				case "chrome-port":
					e?.onMessage?.addListener?.((i) => {
						s(i);
					});
					break;
				case "chrome-external":
					chrome.runtime.onMessageExternal?.addListener?.((i) => (s(i), !0));
					break;
				case "self":
					addEventListener?.("message", ((i) => s(i.data)));
					break;
				default: t.onMessage && t.onMessage(s);
			}
			return this._sendSignalToTarget(e, n, {
				connectionId: o.id,
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
			return Y(n, t), this._exposed.set(e, {
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
			return this.invoke(t ?? this._getDefaultTarget(), h.IMPORT, [], [e]);
		}
		invoke(e, t, n, r = []) {
			const s = d(), o = Promise.withResolvers();
			this._pending.set(s, o);
			const i = setTimeout(() => {
				this._pending.has(s) && (this._pending.delete(s), o.reject(/* @__PURE__ */ new Error(`Request timeout: ${t} on ${n.join(".")}`)));
			}, this._config.timeout), a = {
				id: s,
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
			return this._send(e, a), this._outbound.next(a), o.promise.finally(() => clearTimeout(i));
		}
		get(e, t, n) {
			return this.invoke(e, h.GET, t, [n]);
		}
		set(e, t, n, r) {
			return this.invoke(e, h.SET, t, [n, r]);
		}
		call(e, t, n = []) {
			return this.invoke(e, h.APPLY, t, [n]);
		}
		construct(e, t, n = []) {
			return this.invoke(e, h.CONSTRUCT, t, [n]);
		}
		proxy(e, t = []) {
			const n = e ?? this._getDefaultTarget();
			return this._createProxy(n, t);
		}
		remote(e, t) {
			return this.proxy(t, [e]);
		}
		wrapDescriptor(e, t) {
			return ge(e, (r, s, o) => {
				const i = t ?? e?.channel ?? this._getDefaultTarget();
				return this.invoke(i, r, s, o);
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
				id: d(),
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
			for (const s of r) {
				const o = this._transports.get(s.remoteChannel);
				o && (this._emitConnectionSignal(o, "notify", {
					connectionId: s.id,
					from: this._name,
					to: s.remoteChannel,
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
				} catch {}
				if (e.transportType === "message-port" || e.transportType === "broadcast") try {
					e.target?.close?.();
				} catch {}
			}
			this._transports.clear(), this._defaultTransport = null, this._connectionRegistry.clear(), this._inbound.complete(), this._outbound.complete(), this._invocations.complete(), this._responses.complete(), this._connectionEvents.complete();
		}
		_handleIncoming(e) {
			if (!(!e || typeof e != "object")) switch (this._inbound.next(e), e.type) {
				case "request":
					e.channel === this._name && this._handleRequest(e);
					break;
				case "response":
					this._handleResponse(e);
					break;
				case "event": break;
				case "signal": this._handleSignal(e);
			}
		}
		_handleResponse(e) {
			const t = e.reqId ?? e.id, n = this._pending.get(t);
			if (n) {
				if (this._pending.delete(t), e.payload?.error) n.reject(new Error(e.payload.error));
				else {
					const r = e.payload?.result, s = e.payload?.descriptor;
					r != null ? n.resolve(r) : s ? n.resolve(this.wrapDescriptor(s, e.sender)) : n.resolve(void 0);
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
			const { action: n, path: r, args: s, sender: o } = t, i = e.reqId ?? e.id;
			this._invocations.next({
				id: i,
				channel: this._name,
				sender: o,
				action: n,
				path: r,
				args: s ?? [],
				timestamp: Date.now(),
				contextType: st(e)
			});
			const { result: a, toTransfer: c, newPath: l } = await this._executeAction(n, r, s ?? [], o);
			await this._sendResponse(i, n, o, l, a, c);
		}
		async _executeAction(e, t, n, r) {
			const { result: s, toTransfer: o, path: i } = Re(e, t, n, {
				channel: this._name,
				sender: r,
				reflect: this._config.reflect
			});
			return {
				result: await s,
				toTransfer: o,
				newPath: i
			};
		}
		async _sendResponse(e, t, n, r, s, o) {
			const { response: i, transfer: a } = await Ae(e, t, this._name, n, r, s, o), c = {
				id: e,
				...i,
				timestamp: Date.now(),
				transferable: a
			};
			this._send(n, c, a);
		}
		_handleSignal(e) {
			const t = e?.payload ?? {}, n = t.from ?? e.sender ?? "unknown", r = e.transportType ?? this._transports.get(e.channel)?.transportType ?? "internal", s = this._registerConnection({
				localChannel: this._name,
				remoteChannel: n,
				sender: e.sender ?? n,
				transportType: r,
				direction: "incoming"
			});
			this._markConnectionNotified(s, t);
		}
		_registerConnection(e) {
			return this._connectionRegistry.register(e);
		}
		_markConnectionNotified(e, t) {
			this._connectionRegistry.markNotified(e, t);
		}
		_emitConnectionSignal(e, t, n = {}) {
			const r = {
				id: d(),
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
			const s = this._registerConnection({
				localChannel: this._name,
				remoteChannel: e.targetChannel,
				sender: this._name,
				transportType: e.transportType,
				direction: "outgoing"
			});
			this._markConnectionNotified(s, r.payload);
		}
		_sendSignalToTarget(e, t, n, r) {
			const s = {
				id: d(),
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
					e?.send?.(JSON.stringify(s));
					return;
				}
				if (t === "chrome-runtime") {
					chrome.runtime?.sendMessage?.(s);
					return;
				}
				if (t === "chrome-tabs") {
					const o = n.tabId;
					o != null && chrome.tabs?.sendMessage?.(o, s);
					return;
				}
				if (t === "chrome-port") {
					e?.postMessage?.(s);
					return;
				}
				if (t === "chrome-external") {
					n.externalId && chrome.runtime?.sendMessage?.(n.externalId, s);
					return;
				}
				e?.postMessage?.(s, { transfer: [] });
			} catch {}
		}
		_markAllConnectionsClosed() {
			this._connectionRegistry.closeAll();
		}
		_createTransportBinding(e, t, n, r) {
			let s, o;
			switch (t) {
				case "worker":
				case "message-port":
				case "broadcast":
					r.autoStart !== !1 && e.start && e.start(), s = (i, a) => e.postMessage(i, { transfer: a });
					{
						const i = ((a) => this._handleIncoming(a.data));
						e.addEventListener?.("message", i), o = () => e.removeEventListener?.("message", i);
					}
					break;
				case "websocket":
					s = (i) => e.send(JSON.stringify(i));
					{
						const i = ((a) => {
							try {
								this._handleIncoming(JSON.parse(a.data));
							} catch {}
						});
						e.addEventListener?.("message", i), o = () => e.removeEventListener?.("message", i);
					}
					break;
				case "chrome-runtime":
					s = (i) => chrome.runtime.sendMessage(i);
					{
						const i = (a) => this._handleIncoming(a);
						chrome.runtime.onMessage?.addListener?.(i), o = () => chrome.runtime.onMessage?.removeListener?.(i);
					}
					break;
				case "chrome-tabs":
					s = (i) => {
						r.tabId != null && chrome.tabs?.sendMessage?.(r.tabId, i);
					};
					{
						const i = (a, c) => r.tabId != null && c?.tab?.id !== r.tabId ? !1 : (this._handleIncoming(a), !0);
						chrome.runtime.onMessage?.addListener?.(i), o = () => chrome.runtime.onMessage?.removeListener?.(i);
					}
					break;
				case "chrome-port":
					if (e?.postMessage && e?.onMessage?.addListener) {
						s = (a) => e.postMessage(a);
						const i = (a) => this._handleIncoming(a);
						e.onMessage.addListener(i), o = () => {
							try {
								e.onMessage.removeListener(i);
							} catch {}
							try {
								e.disconnect?.();
							} catch {}
						};
					} else {
						const i = r.portName ?? n, a = r.tabId != null && chrome.tabs?.connect ? chrome.tabs.connect(r.tabId, { name: i }) : chrome.runtime.connect({ name: i });
						s = (l) => a.postMessage(l);
						const c = (l) => this._handleIncoming(l);
						a.onMessage.addListener(c), o = () => {
							try {
								a.onMessage.removeListener(c);
							} catch {}
							try {
								a.disconnect();
							} catch {}
						};
					}
					break;
				case "chrome-external":
					s = (i) => {
						r.externalId && chrome.runtime.sendMessage(r.externalId, i);
					};
					{
						const i = (a) => (this._handleIncoming(a), !0);
						chrome.runtime.onMessageExternal?.addListener?.(i), o = () => chrome.runtime.onMessageExternal?.removeListener?.(i);
					}
					break;
				case "self":
					s = (i, a) => globalThis.postMessage?.(i, { transfer: a ?? [] });
					{
						const i = ((a) => this._handleIncoming(a.data));
						globalThis.addEventListener?.("message", i), o = () => globalThis.removeEventListener?.("message", i);
					}
					break;
				default: r.onMessage && (o = r.onMessage((i) => this._handleIncoming(i))), s = (i) => e?.postMessage?.(i);
			}
			return {
				target: e,
				targetChannel: n,
				transportType: t,
				sender: s,
				cleanup: o,
				postMessage: (i, a) => s?.(i, a),
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
			return t === "worker" ? "worker" : t === "broadcast" && e.name ? e.name : t === "self" ? "self" : `${t}-${d().slice(0, 8)}`;
		}
		_createProxy(e, t) {
			return z((r, s, o) => this.invoke(e, r, s, o), {
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
	function Z(e) {
		return new be(e);
	}
	let K = null;
	function pt() {
		if (!K) {
			const e = ye();
			[
				"worker",
				"shared-worker",
				"service-worker"
			].includes(e) ? K = Z({
				name: "worker",
				autoListen: !0
			}) : K = Z({
				name: "host",
				autoListen: !1
			});
		}
		return K;
	}
	const g = {
		rjb: "rejectBy",
		rvb: "resolveBy",
		rj: "reject",
		rv: "resolve",
		cr: "create",
		cs: "createSync",
		a: "array",
		ta: "typedarray",
		udf: "undefined"
	};
	[
		typeof ArrayBuffer != g.udf ? ArrayBuffer : null,
		typeof MessagePort != g.udf ? MessagePort : null,
		typeof ReadableStream != g.udf ? ReadableStream : null,
		typeof WritableStream != g.udf ? WritableStream : null,
		typeof TransformStream != g.udf ? TransformStream : null,
		typeof WebTransportReceiveStream != g.udf ? WebTransportReceiveStream : null,
		typeof WebTransportSendStream != g.udf ? WebTransportSendStream : null,
		typeof AudioData != g.udf ? AudioData : null,
		typeof ImageBitmap != g.udf ? ImageBitmap : null,
		typeof VideoFrame != g.udf ? VideoFrame : null,
		typeof OffscreenCanvas != g.udf ? OffscreenCanvas : null,
		typeof RTCDataChannel != g.udf ? RTCDataChannel : null
	].filter((e) => e != null);
	function Ce() {
		try {
			const e = globalThis.location?.href;
			if (typeof e == "string" && e.length > 0) return e;
		} catch {}
		try {
			if (typeof document < "u" && typeof document.baseURI == "string" && document.baseURI.length > 0) return document.baseURI;
		} catch {}
		return "";
	}
	function Se(e) {
		const t = Ce();
		if (!t.length) throw new TypeError("[uniform] No base URL for worker resolution (missing location / document.baseURI)");
		const n = e.startsWith("/") ? e.replace(/^\//, "./") : e;
		return new URL(n, t).href;
	}
	const w = {
		name: "unknown",
		instance: null
	}, ee = /* @__PURE__ */ new Map(), Pe = (e) => [...Object.values(h)].includes(e);
	var _t = class {
		channelName;
		options;
		_channel;
		constructor(e, t = {}) {
			this.channelName = e, this.options = t, this._channel = pt();
		}
		request(e, t, n, r = {}) {
			return typeof e == "string" && (e = [e]), Array.isArray(t) && Pe(e) && (r = n, n = t, t = e, e = []), this._channel.invoke(this.channelName, t, e, n);
		}
		doImportModule(e, t) {
			return this._channel.import(e, this.channelName);
		}
	}, yt = class {
		channel;
		options;
		_unified;
		broadcasts = {};
		constructor(e, t = {}) {
			this.channel = e, this.options = t, this._unified = Z({
				name: e,
				autoListen: !1
			}), w.name = e, w.instance = this;
		}
		createRemoteChannel(e, t = {}, n) {
			return n && (this._unified.attach(n, { targetChannel: e }), this.broadcasts[e] = n), Promise.resolve(new _t(e, t));
		}
		getChannel() {
			return this.channel;
		}
		request(e, t, n, r = {}, s = "worker") {
			return typeof e == "string" && (e = [e]), Array.isArray(t) && Pe(e) && (s = r, r = n, n = t, t = e, e = []), this._unified.invoke(s, t, e, n);
		}
		resolveResponse(e, t) {
			return Promise.resolve(t);
		}
		async handleAndResponse(e, t, n) {
			const r = await St(e, t, this.channel);
			r && n?.(r.response, r.transfer);
		}
		close() {
			this._unified.close();
		}
	};
	const mt = (e = "$host$") => {
		if (w?.instance && e === "$host$") return w.instance;
		if (ee.has(e)) return ee.get(e) ?? null;
		const t = new yt(e);
		return e === "$host$" && (w.name = e, w.instance = t), ee.set(e, t), t;
	}, xe = /* @__PURE__ */ new WeakMap(), te = /* @__PURE__ */ new WeakMap(), ke = /* @__PURE__ */ new WeakMap(), gt = (e, t = w?.name, n) => typeof e == "object" && e != null || typeof e == "function" && e != null ? te.has(e) ? te.get(e) : xe.has(e) ? xe.get(e) : X(e) || n?.includes?.(e) || t == w?.name ? e : {
		$isDescriptor: !0,
		path: A.get(e) ?? (() => {
			const r = [d()];
			return Y(r, e), r;
		})(),
		owner: w?.name,
		channel: t,
		primitive: b(e),
		writable: !0,
		enumerable: !0,
		configurable: !0,
		argumentCount: e instanceof Function ? e.length : -1
	} : x(e) ? e : null, wt = Symbol.for("@requestHandler"), q = Symbol.for("@descriptor"), ne = (e) => x(e) || e?.[q] ? e : e?.$isDescriptor ? ht(e, async () => {}) : X(e) ? e : null, G = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new WeakMap(), Ee = (e, t) => {
		if (t != null && !Array.isArray(t) && (t = [t]), t == null || t?.length < 1) return e;
		const n = e?.[q] ?? (e?.$isDescriptor ? e : null);
		if (n && n?.owner == w?.name && (e = I(n?.path) ?? e), b(e)) return e;
		for (const r of t) if (e = e?.[r], e == null) return e;
		return e;
	}, I = (e) => {
		if (e != null && !Array.isArray(e) && (e = [e]), e == null || e?.length < 1) return null;
		const t = G?.get?.(e?.[0]) ?? null;
		return t != null ? Ee(t, e?.slice?.(1)) : null;
	}, Y = (e, t) => {
		const n = t?.[q] ?? (t?.$isDescriptor ? t : null);
		if (n && n?.owner == w?.name && (t = I(n?.path) ?? t), e != null && !Array.isArray(e) && (e = [e]), e == null || e?.length < 1) return null;
		const r = G?.get?.(e?.[0]) ?? null;
		return e?.length > 1 ? Ee(r, e?.slice?.(1, -1))[e?.[e?.length - 1]] = t : G?.set?.(e?.[0], t), (typeof t == "object" || typeof t == "function") && A?.set?.(t, e), t;
	}, Te = (e) => (e != null && !Array.isArray(e) && (e = [e]), e == null || e?.length < 1 ? !1 : !(G?.get?.(e?.[0]) ?? null) && e?.length <= 1 ? (G?.delete?.(e?.[0]), !0) : !1), bt = (e) => {
		const t = e?.[q] ?? (e?.$isDescriptor ? e : null);
		t && t?.owner == w?.name && (e = I(t?.path) ?? e);
		const n = A?.get?.(e) ?? t?.path;
		return n == null || n?.length < 1 ? !1 : (Te(n), (typeof e == "object" || typeof e == "function") && A?.delete?.(e), !0);
	}, Ct = (e) => {
		const t = e?.[q] ?? (e?.$isDescriptor ? e : null);
		return (A?.get?.(e) ?? t?.path) == null;
	}, T = (e) => (typeof e == "object" || typeof e == "function") && e != null, ve = {
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
	function Re(e, t, n, r = {}) {
		const { channel: s = "", sender: o = "", reflect: i = ve } = r, a = r.target ?? I(t), c = [];
		let l = null, _ = t;
		switch (String(e).toLowerCase()) {
			case "import":
			case h.IMPORT:
				l = import(n?.[0]);
				break;
			case "transfer":
			case h.TRANSFER:
				j(a) && s !== o && c.push(a), l = a;
				break;
			case "get":
			case h.GET: {
				const f = n?.[0], C = i.get?.(a, f) ?? a?.[f];
				l = typeof C == "function" && a != null ? C.bind(a) : C, _ = [...t, String(f)];
				break;
			}
			case "set":
			case h.SET: {
				const [f, C] = n, F = k(C, ne);
				r.target ? l = i.set?.(a, f, F) ?? (a[f] = F, !0) : l = i.set?.(a, f, F) ?? Y([...t, String(f)], F);
				break;
			}
			case "apply":
			case "call":
			case h.APPLY:
			case h.CALL:
				if (typeof a == "function") {
					const f = r.context ?? (r.target ? void 0 : I(t.slice(0, -1))), C = k(n?.[0] ?? n ?? [], ne);
					l = i.apply?.(a, f, C) ?? a.apply(f, C), j(l) && t?.at(-1) === "transfer" && s !== o && c.push(l);
				}
				break;
			case "construct":
			case h.CONSTRUCT:
				if (typeof a == "function") {
					const f = k(n?.[0] ?? n ?? [], ne);
					l = i.construct?.(a, f) ?? new a(...f);
				}
				break;
			case "delete":
			case "deleteproperty":
			case "dispose":
			case h.DELETE:
			case h.DELETE_PROPERTY:
			case h.DISPOSE:
				if (r.target) {
					const f = t[t.length - 1];
					l = i.deleteProperty?.(a, f) ?? delete a[f];
				} else l = t?.length > 0 ? Te(t) : bt(a), l && (_ = A.get(a) ?? []);
				break;
			case "has":
			case h.HAS:
				l = i.has?.(a, n?.[0]) ?? (T(a) ? n?.[0] in a : !1);
				break;
			case "ownkeys":
			case h.OWN_KEYS:
				l = i.ownKeys?.(a) ?? (T(a) ? Object.keys(a) : []);
				break;
			case "getownpropertydescriptor":
			case "getpropertydescriptor":
			case h.GET_OWN_PROPERTY_DESCRIPTOR:
			case h.GET_PROPERTY_DESCRIPTOR:
				l = i.getOwnPropertyDescriptor?.(a, n?.[0] ?? t?.at(-1) ?? "") ?? (T(a) ? Object.getOwnPropertyDescriptor(a, n?.[0] ?? t?.at(-1) ?? "") : void 0);
				break;
			case "getprototypeof":
			case h.GET_PROTOTYPE_OF:
				l = i.getPrototypeOf?.(a) ?? (T(a) ? Object.getPrototypeOf(a) : null);
				break;
			case "setprototypeof":
			case h.SET_PROTOTYPE_OF:
				l = i.setPrototypeOf?.(a, n?.[0]) ?? (T(a) ? Object.setPrototypeOf(a, n?.[0]) : !1);
				break;
			case "isextensible":
			case h.IS_EXTENSIBLE:
				l = i.isExtensible?.(a) ?? (T(a) ? Object.isExtensible(a) : !0);
				break;
			case "preventextensions":
			case h.PREVENT_EXTENSIONS: l = i.preventExtensions?.(a) ?? (T(a) ? Object.preventExtensions(a) : !1);
		}
		return {
			result: l,
			toTransfer: c,
			path: _
		};
	}
	async function Ae(e, t, n, r, s, o, i) {
		const a = await o, c = j(a) && i.includes(a) || x(a);
		let l = s;
		!c && t !== "get" && t !== h.GET && (typeof a == "object" || typeof a == "function") && (Ct(a) ? (l = [d()], Y(l, a)) : l = A.get(a) ?? []);
		const _ = I(l), f = t === "get" || t === h.GET ? l?.at(-1) : void 0, C = I(s), F = k(a, ($t) => gt($t, n, i)) ?? a;
		return {
			response: {
				channel: r,
				sender: n,
				reqId: e,
				action: t,
				type: "response",
				payload: {
					result: c ? F : null,
					type: typeof a,
					channel: r,
					sender: n,
					descriptor: {
						$isDescriptor: !0,
						path: l,
						owner: n,
						channel: n,
						primitive: b(a),
						writable: !0,
						enumerable: !0,
						configurable: !0,
						argumentCount: C instanceof Function ? C.length : -1,
						...T(_) && f != null ? Object.getOwnPropertyDescriptor(_, f) : {}
					}
				}
			},
			transfer: i
		};
	}
	async function St(e, t, n, r) {
		const { channel: s, sender: o, path: i, action: a, args: c } = e;
		if (s !== n) return null;
		const { result: l, toTransfer: _, path: f } = Re(a, i, c, {
			channel: s,
			sender: o,
			...r
		});
		return Ae(t, a, n, o, f, l, _);
	}
	var xt = class {
		_name;
		_transportType;
		_id = d();
		_state = "disconnected";
		_inbound = new y({ bufferSize: 1e3 });
		_outbound = new y({ bufferSize: 1e3 });
		_stateChanges = new y();
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
			return (t ? rt((n) => n.sender === t)(this._inbound) : this._inbound).subscribe(typeof e == "function" ? { next: e } : e);
		}
		next(e) {
			if (this._state !== "connected") {
				this._opts.bufferMessages && this._buffer.length < this._opts.bufferSize && this._buffer.push(e);
				return;
			}
			this._outbound.next(e), this._stats.messagesSent++;
		}
		async request(e, t, n = {}) {
			const r = d(), s = Promise.withResolvers();
			this._pending.set(r, s);
			const o = setTimeout(() => {
				this._pending.has(r) && (this._pending.delete(r), s.reject(/* @__PURE__ */ new Error("Request timeout")));
			}, n.timeout ?? this._opts.timeout);
			return this.next({
				id: d(),
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
			}), s.promise.finally(() => clearTimeout(o));
		}
		respond(e, t) {
			this.next({
				id: d(),
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
				id: d(),
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
	}, kt = class $ {
		_connections = /* @__PURE__ */ new Map();
		static _instance = null;
		static getInstance() {
			return $._instance || ($._instance = new $()), $._instance;
		}
		getOrCreate(t, n = "internal", r = {}) {
			return this._connections.has(t) || this._connections.set(t, new xt(t, n, r)), this._connections.get(t);
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
	};
	const Ie = () => kt.getInstance(), Et = (e, t, n) => Ie().getOrCreate(e, t, n), Tt = "uniform_channels", vt = 1, u = {
		MESSAGES: "messages",
		MAILBOX: "mailbox",
		PENDING: "pending",
		EXCHANGE: "exchange",
		TRANSACTIONS: "transactions"
	};
	var Rt = class {
		_db = null;
		_isOpen = !1;
		_openPromise = null;
		_channelName;
		_messageUpdates = new y();
		_exchangeUpdates = new y();
		constructor(e) {
			this._channelName = e;
		}
		async open() {
			return this._db && this._isOpen ? this._db : this._openPromise ? this._openPromise : (this._openPromise = new Promise((e, t) => {
				const n = indexedDB.open(Tt, vt);
				n.onerror = () => {
					this._openPromise = null, t(/* @__PURE__ */ new Error("Failed to open IndexedDB"));
				}, n.onsuccess = () => {
					this._db = n.result, this._isOpen = !0, this._openPromise = null, e(this._db);
				}, n.onupgradeneeded = (r) => {
					const s = r.target.result;
					this._createStores(s);
				};
			}), this._openPromise);
		}
		close() {
			this._db && (this._db.close(), this._db = null, this._isOpen = !1);
		}
		_createStores(e) {
			if (!e.objectStoreNames.contains(u.MESSAGES)) {
				const t = e.createObjectStore(u.MESSAGES, { keyPath: "id" });
				t.createIndex("channel", "channel", { unique: !1 }), t.createIndex("status", "status", { unique: !1 }), t.createIndex("recipient", "recipient", { unique: !1 }), t.createIndex("createdAt", "createdAt", { unique: !1 }), t.createIndex("channel_status", ["channel", "status"], { unique: !1 });
			}
			if (!e.objectStoreNames.contains(u.MAILBOX)) {
				const t = e.createObjectStore(u.MAILBOX, { keyPath: "id" });
				t.createIndex("channel", "channel", { unique: !1 }), t.createIndex("priority", "priority", { unique: !1 }), t.createIndex("expiresAt", "expiresAt", { unique: !1 });
			}
			if (!e.objectStoreNames.contains(u.PENDING)) {
				const t = e.createObjectStore(u.PENDING, { keyPath: "id" });
				t.createIndex("channel", "channel", { unique: !1 }), t.createIndex("createdAt", "createdAt", { unique: !1 });
			}
			if (!e.objectStoreNames.contains(u.EXCHANGE)) {
				const t = e.createObjectStore(u.EXCHANGE, { keyPath: "id" });
				t.createIndex("key", "key", { unique: !0 }), t.createIndex("owner", "owner", { unique: !1 });
			}
			e.objectStoreNames.contains(u.TRANSACTIONS) || e.createObjectStore(u.TRANSACTIONS, { keyPath: "id" }).createIndex("createdAt", "createdAt", { unique: !1 });
		}
		async defer(e, t = {}) {
			const n = await this.open(), r = {
				id: d(),
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
			return new Promise((s, o) => {
				const i = n.transaction([u.MESSAGES, u.MAILBOX], "readwrite"), a = i.objectStore(u.MESSAGES), c = i.objectStore(u.MAILBOX);
				a.add(r), c.add(r), i.oncomplete = () => {
					this._messageUpdates.next(r), s(r.id);
				}, i.onerror = () => o(/* @__PURE__ */ new Error("Failed to defer message"));
			});
		}
		async getDeferredMessages(e, t = {}) {
			const n = await this.open();
			return new Promise((r, s) => {
				const o = n.transaction(u.MESSAGES, "readonly").objectStore(u.MESSAGES), i = t.status ? o.index("channel_status") : o.index("channel"), a = t.status ? IDBKeyRange.only([e, t.status]) : IDBKeyRange.only(e), c = i.getAll(a, t.limit);
				c.onsuccess = () => {
					let l = c.result;
					t.offset && (l = l.slice(t.offset)), r(l);
				}, c.onerror = () => s(/* @__PURE__ */ new Error("Failed to get deferred messages"));
			});
		}
		async processNextPending(e) {
			const t = await this.open();
			return new Promise((n, r) => {
				const s = t.transaction(u.MESSAGES, "readwrite").objectStore(u.MESSAGES).index("channel_status").openCursor(IDBKeyRange.only([e, "pending"]));
				s.onsuccess = () => {
					const o = s.result;
					if (o) {
						const i = o.value;
						i.status = "processing", i.updatedAt = Date.now(), o.update(i), this._messageUpdates.next(i), n(i);
					} else n(null);
				}, s.onerror = () => r(/* @__PURE__ */ new Error("Failed to process pending message"));
			});
		}
		async markDelivered(e) {
			await this._updateMessageStatus(e, "delivered");
		}
		async markFailed(e) {
			const t = await this.open();
			return new Promise((n, r) => {
				const s = t.transaction(u.MESSAGES, "readwrite").objectStore(u.MESSAGES), o = s.get(e);
				o.onsuccess = () => {
					const i = o.result;
					if (!i) {
						n(!1);
						return;
					}
					i.retryCount++, i.updatedAt = Date.now(), i.retryCount < i.maxRetries ? i.status = "pending" : i.status = "failed", s.put(i), this._messageUpdates.next(i), n(i.status === "pending");
				}, o.onerror = () => r(/* @__PURE__ */ new Error("Failed to mark message as failed"));
			});
		}
		async _updateMessageStatus(e, t) {
			const n = await this.open();
			return new Promise((r, s) => {
				const o = n.transaction(u.MESSAGES, "readwrite").objectStore(u.MESSAGES), i = o.get(e);
				i.onsuccess = () => {
					const a = i.result;
					a && (a.status = t, a.updatedAt = Date.now(), o.put(a), this._messageUpdates.next(a)), r();
				}, i.onerror = () => s(/* @__PURE__ */ new Error("Failed to update message status"));
			});
		}
		async getMailbox(e, t = {}) {
			const n = await this.open();
			return new Promise((r, s) => {
				const o = n.transaction(u.MAILBOX, "readonly").objectStore(u.MAILBOX).index("channel").getAll(IDBKeyRange.only(e), t.limit);
				o.onsuccess = () => {
					let i = o.result;
					t.sortBy === "priority" ? i.sort((a, c) => c.priority - a.priority) : i.sort((a, c) => c.createdAt - a.createdAt), r(i);
				}, o.onerror = () => s(/* @__PURE__ */ new Error("Failed to get mailbox"));
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
			for (const s of t) s.expiresAt && s.expiresAt < r ? n.expired++ : n[s.status]++;
			return n;
		}
		async clearMailbox(e) {
			const t = await this.open();
			return new Promise((n, r) => {
				const s = t.transaction(u.MAILBOX, "readwrite"), o = s.objectStore(u.MAILBOX).index("channel");
				let i = 0;
				const a = o.openCursor(IDBKeyRange.only(e));
				a.onsuccess = () => {
					const c = a.result;
					c && (c.delete(), i++, c.continue());
				}, s.oncomplete = () => n(i), s.onerror = () => r(/* @__PURE__ */ new Error("Failed to clear mailbox"));
			});
		}
		async registerPending(e) {
			const t = await this.open(), n = {
				id: d(),
				channel: this._channelName,
				type: e.type,
				data: e.data,
				metadata: e.metadata,
				createdAt: Date.now(),
				status: "pending"
			};
			return new Promise((r, s) => {
				const o = t.transaction(u.PENDING, "readwrite");
				o.objectStore(u.PENDING).add(n), o.oncomplete = () => r(n.id), o.onerror = () => s(/* @__PURE__ */ new Error("Failed to register pending operation"));
			});
		}
		async getPendingOperations() {
			const e = await this.open();
			return new Promise((t, n) => {
				const r = e.transaction(u.PENDING, "readonly").objectStore(u.PENDING).index("channel").getAll(IDBKeyRange.only(this._channelName));
				r.onsuccess = () => t(r.result), r.onerror = () => n(/* @__PURE__ */ new Error("Failed to get pending operations"));
			});
		}
		async completePending(e) {
			const t = await this.open();
			return new Promise((n, r) => {
				const s = t.transaction(u.PENDING, "readwrite");
				s.objectStore(u.PENDING).delete(e), s.oncomplete = () => n(), s.onerror = () => r(/* @__PURE__ */ new Error("Failed to complete pending operation"));
			});
		}
		async awaitPending(e, t = {}) {
			const n = t.timeout ?? 3e4, r = t.pollInterval ?? 100, s = Date.now();
			for (; Date.now() - s < n;) {
				const o = await this._getPendingById(e);
				if (!o) return null;
				if (o.status === "completed") return await this.completePending(e), o.result;
				await new Promise((i) => setTimeout(i, r));
			}
			throw new Error(`Pending operation ${e} timed out`);
		}
		async _getPendingById(e) {
			const t = await this.open();
			return new Promise((n, r) => {
				const s = t.transaction(u.PENDING, "readonly").objectStore(u.PENDING).get(e);
				s.onsuccess = () => n(s.result ?? null), s.onerror = () => r(/* @__PURE__ */ new Error("Failed to get pending operation"));
			});
		}
		async exchangePut(e, t, n = {}) {
			const r = await this.open(), s = {
				id: d(),
				key: e,
				value: t,
				owner: this._channelName,
				sharedWith: n.sharedWith ?? ["*"],
				version: 1,
				createdAt: Date.now(),
				updatedAt: Date.now()
			};
			return new Promise((o, i) => {
				const a = r.transaction(u.EXCHANGE, "readwrite"), c = a.objectStore(u.EXCHANGE), l = c.index("key").get(e);
				l.onsuccess = () => {
					const _ = l.result;
					_ && (s.id = _.id, s.version = _.version + 1, s.createdAt = _.createdAt), c.put(s);
				}, a.oncomplete = () => {
					this._exchangeUpdates.next(s), o(s.id);
				}, a.onerror = () => i(/* @__PURE__ */ new Error("Failed to put exchange data"));
			});
		}
		async exchangeGet(e) {
			const t = await this.open();
			return new Promise((n, r) => {
				const s = t.transaction(u.EXCHANGE, "readonly").objectStore(u.EXCHANGE).index("key").get(e);
				s.onsuccess = () => {
					const o = s.result;
					if (!o) {
						n(null);
						return;
					}
					if (!this._canAccessExchange(o)) {
						n(null);
						return;
					}
					n(o.value);
				}, s.onerror = () => r(/* @__PURE__ */ new Error("Failed to get exchange data"));
			});
		}
		async exchangeDelete(e) {
			const t = await this.open();
			return new Promise((n, r) => {
				const s = t.transaction(u.EXCHANGE, "readwrite"), o = s.objectStore(u.EXCHANGE), i = o.index("key").get(e);
				i.onsuccess = () => {
					const a = i.result;
					if (!a) {
						n(!1);
						return;
					}
					if (a.owner !== this._channelName) {
						n(!1);
						return;
					}
					o.delete(a.id);
				}, s.oncomplete = () => n(!0), s.onerror = () => r(/* @__PURE__ */ new Error("Failed to delete exchange data"));
			});
		}
		async exchangeLock(e, t = {}) {
			const n = await this.open(), r = t.timeout ?? 3e4;
			return new Promise((s, o) => {
				const i = n.transaction(u.EXCHANGE, "readwrite"), a = i.objectStore(u.EXCHANGE), c = a.index("key").get(e);
				c.onsuccess = () => {
					const l = c.result;
					if (!l) {
						s(!1);
						return;
					}
					if (l.lock && l.lock.holder !== this._channelName && l.lock.expiresAt > Date.now()) {
						s(!1);
						return;
					}
					l.lock = {
						holder: this._channelName,
						acquiredAt: Date.now(),
						expiresAt: Date.now() + r
					}, l.updatedAt = Date.now(), a.put(l);
				}, i.oncomplete = () => s(!0), i.onerror = () => o(/* @__PURE__ */ new Error("Failed to acquire lock"));
			});
		}
		async exchangeUnlock(e) {
			const t = await this.open();
			return new Promise((n, r) => {
				const s = t.transaction(u.EXCHANGE, "readwrite"), o = s.objectStore(u.EXCHANGE), i = o.index("key").get(e);
				i.onsuccess = () => {
					const a = i.result;
					a && a.lock?.holder === this._channelName && (delete a.lock, a.updatedAt = Date.now(), o.put(a));
				}, s.oncomplete = () => n(), s.onerror = () => r(/* @__PURE__ */ new Error("Failed to release lock"));
			});
		}
		_canAccessExchange(e) {
			return e.owner === this._channelName || e.sharedWith.includes("*") ? !0 : e.sharedWith.includes(this._channelName);
		}
		async beginTransaction() {
			return new At(this);
		}
		async executeTransaction(e) {
			const t = await this.open(), n = new Set(e.map((r) => r.store));
			return new Promise((r, s) => {
				const o = t.transaction(Array.from(n), "readwrite");
				for (const i of e) {
					const a = o.objectStore(i.store);
					switch (i.type) {
						case "put":
							i.value !== void 0 && a.put(i.value);
							break;
						case "delete":
							i.key !== void 0 && a.delete(i.key);
							break;
						case "update": if (i.key !== void 0) {
							const c = a.get(i.key);
							c.onsuccess = () => {
								c.result && i.value && a.put({
									...c.result,
									...i.value
								});
							};
						}
					}
				}
				o.oncomplete = () => r(), o.onerror = () => s(/* @__PURE__ */ new Error("Transaction failed"));
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
				const s = e.transaction([u.MESSAGES, u.MAILBOX], "readwrite"), o = s.objectStore(u.MESSAGES), i = s.objectStore(u.MAILBOX);
				let a = 0;
				const c = o.openCursor();
				c.onsuccess = () => {
					const _ = c.result;
					if (_) {
						const f = _.value;
						f.expiresAt && f.expiresAt < t && (_.delete(), a++), _.continue();
					}
				};
				const l = i.openCursor();
				l.onsuccess = () => {
					const _ = l.result;
					if (_) {
						const f = _.value;
						f.expiresAt && f.expiresAt < t && (_.delete(), a++), _.continue();
					}
				}, s.oncomplete = () => n(a), s.onerror = () => r(/* @__PURE__ */ new Error("Failed to cleanup expired"));
			});
		}
	}, At = class {
		_storage;
		_operations = [];
		_isCommitted = !1;
		_isRolledBack = !1;
		constructor(e) {
			this._storage = e;
		}
		put(e, t) {
			return this._checkState(), this._operations.push({
				id: d(),
				type: "put",
				store: e,
				value: t,
				timestamp: Date.now()
			}), this;
		}
		delete(e, t) {
			return this._checkState(), this._operations.push({
				id: d(),
				type: "delete",
				store: e,
				key: t,
				timestamp: Date.now()
			}), this;
		}
		update(e, t, n) {
			return this._checkState(), this._operations.push({
				id: d(),
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
	};
	const re = /* @__PURE__ */ new Map();
	function It(e) {
		return re.has(e) || re.set(e, new Rt(e)), re.get(e);
	}
	const Oe = Ce(), Ot = Oe.length > 0 ? new URL("../transport/Worker.ts", Oe) : "";
	var Me = class {
		_channel;
		_context;
		_options;
		_connection;
		_storage;
		constructor(e, t, n = {}) {
			this._channel = e, this._context = t, this._options = n, this._connection = Et(e), this._storage = It(e);
		}
		async request(e, t, n, r = {}) {
			let s = typeof e == "string" ? [e] : e, o = t, i = n;
			return Array.isArray(t) && De(e) && (r = n, i = t, o = e, s = []), this._context.getHost()?.request(s, o, i, r, this._channel);
		}
		async doImportModule(e, t = {}) {
			return this.request([], h.IMPORT, [e], t);
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
	}, v = class {
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
			this._channel = e, this._context = t, this._options = n, this._connection = Ie().getOrCreate(e, "internal", n), this._unified = new be({
				name: e,
				autoListen: !1,
				timeout: n?.timeout
			});
		}
		createRemoteChannel(e, t = {}, n) {
			const r = Dt(n ?? this._context.$createOrUseExistingRemote(e, t, n ?? null)?.messageChannel?.port1), s = Le(r?.target ?? r);
			return this._unified.listen(r?.target, { targetChannel: e }), r && (this._broadcasts?.set?.(e, r), s === "self" && typeof postMessage > "u" || this._unified.connect(r, { targetChannel: e }), this._context.$registerConnection({
				localChannel: this._channel,
				remoteChannel: e,
				sender: this._channel,
				direction: "outgoing",
				transportType: s
			}), this.notifyChannel(e, {
				contextId: this._context.id,
				contextName: this._context.hostName
			}, "connect")), new Me(e, this._context, t);
		}
		getChannel() {
			return this._channel;
		}
		get connection() {
			return this._connection;
		}
		request(e, t, n, r = {}, s = "worker") {
			let o = typeof e == "string" ? [e] : e, i = n;
			return Array.isArray(t) && De(e) && (s = r, r = n, i = t, t = e, o = []), this._unified.invoke(s, t, o ?? [], Array.isArray(i) ? i : [i]);
		}
		resolveResponse(e, t) {
			this._forResolves.get(e)?.resolve?.(t);
			const n = this._forResolves.get(e)?.promise;
			return this._forResolves.delete(e), n;
		}
		async handleAndResponse(e, t, n) {}
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
	}, Mt = class {
		_options;
		_id = d();
		_hostName;
		_host = null;
		_endpoints = /* @__PURE__ */ new Map();
		_unifiedByChannel = /* @__PURE__ */ new Map();
		_unifiedConnectionSubs = /* @__PURE__ */ new Map();
		_remoteChannels = /* @__PURE__ */ new Map();
		_deferredChannels = /* @__PURE__ */ new Map();
		_connectionEvents = new y({ bufferSize: 200 });
		_connectionRegistry = new we(() => d(), (e) => this._emitConnectionEvent(e));
		_closed = !1;
		_globalSelf = null;
		constructor(e = {}) {
			this._options = e, this._hostName = e.name ?? `ctx-${this._id.slice(0, 8)}`, e.useGlobalSelf !== !1 && (this._globalSelf = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : null);
		}
		initHost(e) {
			if (this._host && !e) return this._host;
			const t = e ?? this._hostName;
			if (this._hostName = t, this._endpoints.has(t)) return this._host = this._endpoints.get(t).handler, this._host;
			this._host = new v(t, this, this._options.defaultOptions);
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
				const s = r.handler.getConnectedChannels();
				for (const o of s) {
					if (t.localChannel && t.localChannel !== r.name || t.remoteChannel && t.remoteChannel !== o) continue;
					const i = this.queryConnections({
						localChannel: r.name,
						remoteChannel: o,
						status: "active"
					})[0];
					t.sender && i?.sender !== t.sender || t.transportType && i?.transportType !== t.transportType || t.channel && t.channel !== r.name && t.channel !== o || r.handler.notifyChannel(o, e, "notify") && n++;
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
			const n = new v(e, this, {
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
			const r = Be(t);
			if (!r) throw new Error(`Failed to create worker for channel: ${e}`);
			const s = new v(e, this, {
				...this._options.defaultOptions,
				...n
			}), o = s.createRemoteChannel(e, n, r), i = {
				name: e,
				handler: s,
				connection: s.connection,
				subscriptions: [],
				transportType: "worker",
				ready: Promise.resolve(o),
				unified: s.unified
			};
			return this._endpoints.set(e, i), this._registerUnifiedChannel(e, s.unified), this._remoteChannels.set(e, {
				channel: e,
				context: this,
				remote: Promise.resolve(o),
				transport: r,
				transportType: "worker"
			}), i;
		}
		async addPort(e, t, n = {}) {
			const r = new v(e, this, {
				...this._options.defaultOptions,
				...n
			});
			t.start?.();
			const s = r.createRemoteChannel(e, n, t), o = {
				name: e,
				handler: r,
				connection: r.connection,
				subscriptions: [],
				transportType: "message-port",
				ready: Promise.resolve(s),
				unified: r.unified
			};
			return this._endpoints.set(e, o), this._registerUnifiedChannel(e, r.unified), this._remoteChannels.set(e, {
				channel: e,
				context: this,
				remote: Promise.resolve(s),
				transport: t,
				transportType: "message-port"
			}), o;
		}
		async addBroadcast(e, t, n = {}) {
			const r = new BroadcastChannel(t ?? e), s = new v(e, this, {
				...this._options.defaultOptions,
				...n
			}), o = s.createRemoteChannel(e, n, r), i = {
				name: e,
				handler: s,
				connection: s.connection,
				subscriptions: [],
				transportType: "broadcast",
				ready: Promise.resolve(o),
				unified: s.unified
			};
			return this._endpoints.set(e, i), this._registerUnifiedChannel(e, s.unified), this._remoteChannels.set(e, {
				channel: e,
				context: this,
				remote: Promise.resolve(o),
				transport: r,
				transportType: "broadcast"
			}), i;
		}
		addSelfChannel(e, t = {}) {
			const n = new v(e, this, {
				...this._options.defaultOptions,
				...t
			}), r = this._globalSelf ?? (typeof self < "u" ? self : null), s = {
				name: e,
				handler: n,
				connection: n.connection,
				subscriptions: [],
				transportType: "self",
				ready: Promise.resolve(r ? n.createRemoteChannel(e, t, r) : null),
				unified: n.unified
			};
			return this._endpoints.set(e, s), this._registerUnifiedChannel(e, n.unified), s;
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
				case "self": return this.addSelfChannel(e, n);
				default: return this.createChannel(e, n);
			}
		}
		createChannelPair(e, t, n = {}) {
			const r = new MessageChannel(), s = new v(e, this, {
				...this._options.defaultOptions,
				...n
			}), o = new v(t, this, {
				...this._options.defaultOptions,
				...n
			});
			r.port1.start(), r.port2.start();
			const i = Promise.resolve(s.createRemoteChannel(t, n, r.port1)), a = Promise.resolve(o.createRemoteChannel(e, n, r.port2)), c = {
				name: e,
				handler: s,
				connection: s.connection,
				subscriptions: [],
				transportType: "message-port",
				ready: i,
				unified: s.unified
			}, l = {
				name: t,
				handler: o,
				connection: o.connection,
				subscriptions: [],
				transportType: "message-port",
				ready: a,
				unified: o.unified
			};
			return this._endpoints.set(e, c), this._endpoints.set(t, l), this._registerUnifiedChannel(e, s.unified), this._registerUnifiedChannel(t, o.unified), {
				channel1: c,
				channel2: l,
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
			const r = new MessageChannel(), s = E(new Promise((i) => {
				const a = Be(Ot);
				a?.addEventListener?.("message", (c) => {
					c.data.type === "channelCreated" && (r.port1?.start?.(), i(new Me(c.data.channel, this, t)));
				}), a?.postMessage?.({
					type: "createChannel",
					channel: e,
					sender: this._hostName,
					options: t,
					messagePort: r.port2
				}, { transfer: [r.port2] });
			})), o = {
				channel: e,
				context: this,
				messageChannel: r,
				remote: s
			};
			return this._remoteChannels.set(e, o), o;
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
			const t = (e.payload?.type, "incoming");
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
	function De(e) {
		return [...Object.values(h)].includes(e);
	}
	function Dt(e) {
		if (!e) return null;
		if (Ne(e)) return e;
		const t = e, n = Le(t);
		return {
			target: t,
			targetChannel: "unknown",
			transportType: n === "internal" ? "self" : n,
			sender: (r, s) => {
				if (typeof WebSocket < "u" && t instanceof WebSocket) {
					t.send(JSON.stringify(r));
					return;
				}
				t.postMessage?.(r, s?.length ? { transfer: s } : void 0);
			},
			postMessage: (r, s) => {
				t.postMessage?.(r, s);
			},
			addEventListener: t.addEventListener?.bind(t),
			removeEventListener: t.removeEventListener?.bind(t),
			start: t.start?.bind(t),
			close: t.close?.bind(t)
		};
	}
	function Ne(e) {
		return !!e && typeof e == "object" && "target" in e && typeof e.postMessage == "function";
	}
	function Le(e) {
		const t = Ne(e) ? e.target : e;
		return t ? t === "chrome-runtime" ? "chrome-runtime" : t === "chrome-tabs" ? "chrome-tabs" : t === "chrome-port" ? "chrome-port" : t === "chrome-external" ? "chrome-external" : typeof MessagePort < "u" && t instanceof MessagePort ? "message-port" : typeof BroadcastChannel < "u" && t instanceof BroadcastChannel ? "broadcast" : typeof Worker < "u" && t instanceof Worker ? "worker" : typeof WebSocket < "u" && t instanceof WebSocket ? "websocket" : typeof chrome < "u" && typeof t == "object" && t && typeof t.postMessage == "function" && t.onMessage?.addListener ? "chrome-port" : typeof self < "u" && t === self ? "self" : "internal" : "internal";
	}
	function Be(e) {
		if (e instanceof Worker) return e;
		if (e instanceof URL) return new Worker(e.href, { type: "module" });
		if (typeof e == "function") try {
			return new e({ type: "module" });
		} catch {
			return e({ type: "module" });
		}
		return typeof e == "string" ? e.startsWith("/") ? new Worker(Se(e.replace(/^\//, "./")), { type: "module" }) : URL.canParse(e) || e.startsWith("./") ? new Worker(Se(e), { type: "module" }) : new Worker(URL.createObjectURL(new Blob([e], { type: "application/javascript" })), { type: "module" }) : e instanceof Blob || e instanceof File ? new Worker(URL.createObjectURL(e), { type: "module" }) : e ?? (typeof self < "u" ? self : null);
	}
	const Nt = /* @__PURE__ */ new Map();
	function Lt(e = {}) {
		const t = new Mt(e);
		return e.name && Nt.set(e.name, t), t;
	}
	var Bt = class {
		_context;
		_config;
		_subscriptions = [];
		_incomingConnections = new y({ bufferSize: 100 });
		_channelCreated = new y({ bufferSize: 100 });
		_channelClosed = new y();
		constructor(e = {}) {
			this._config = {
				name: e.name ?? "worker",
				workerName: e.workerName ?? `worker-${d().slice(0, 8)}`,
				autoAcceptChannels: e.autoAcceptChannels ?? !0,
				allowedChannels: e.allowedChannels ?? [],
				maxChannels: e.maxChannels ?? 100,
				autoConnect: e.autoConnect ?? !0,
				useGlobalSelf: !0,
				defaultOptions: e.defaultOptions ?? {},
				isolatedStorage: e.isolatedStorage ?? !1,
				...e
			}, this._context = Lt({
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
			if (!(!t || typeof t != "object")) switch (t.type) {
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
				default: t.channel && this._context.hasChannel(t.channel) && this._context.getChannel(t.channel)?.handler?.handleAndResponse?.(t.payload, t.reqId);
			}
		}
		_handleCreateChannel(e) {
			const t = {
				id: e.reqId ?? d(),
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
				id: e.reqId ?? d(),
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
				id: e.reqId ?? d(),
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
	};
	let se = null;
	function qt(e) {
		return se || (se = new Bt(e)), se;
	}
	qt({ name: "worker" });
	var V = class {
		_channelName;
		_config;
		_port;
		_subs = /* @__PURE__ */ new Set();
		_pending = /* @__PURE__ */ new Map();
		_listening = !1;
		_cleanup = null;
		_portId = d();
		_state = new y();
		_keepAliveTimer = null;
		constructor(e, t, n = {}) {
			this._channelName = t, this._config = n, this._port = e, this._setupPort(), n.autoStart !== !1 && this.start();
		}
		_setupPort() {
			const e = (n) => {
				const r = n.data;
				if (r.type === "response" && r.reqId) {
					const s = this._pending.get(r.reqId);
					if (s) {
						this._pending.delete(r.reqId), r.payload?.error ? s.reject(new Error(r.payload.error)) : s.resolve(r.payload?.result ?? r.payload);
						return;
					}
				}
				if (r.type === "signal" && r.payload?.action === "ping") {
					this.send({
						id: d(),
						channel: this._channelName,
						sender: this._portId,
						type: "signal",
						payload: { action: "pong" }
					});
					return;
				}
				r.portId = r.portId ?? this._portId;
				for (const s of this._subs) try {
					s.next?.(r);
				} catch (o) {
					s.error?.(o);
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
			const t = e.reqId ?? d();
			return new Promise((n, r) => {
				const s = setTimeout(() => {
					this._pending.delete(t), r(/* @__PURE__ */ new Error("Request timeout"));
				}, this._config.timeout ?? 3e4);
				this._pending.set(t, {
					resolve: (o) => {
						clearTimeout(s), n(o);
					},
					reject: (o) => {
						clearTimeout(s), r(o);
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
					id: d(),
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
	function oe(e, t) {
		const n = new MessageChannel();
		return {
			local: new V(n.port1, e, t),
			remote: n.port2,
			transfer: () => n.port2
		};
	}
	var qe = class {
		_target;
		_channelName;
		_config;
		_transport = null;
		_state = new y();
		_handshakeComplete = !1;
		constructor(e, t, n = {}) {
			this._target = e, this._channelName = t, this._config = n;
		}
		async connect() {
			if (this._transport && this._handshakeComplete) return this._transport;
			this._state.next("connecting");
			const { local: e, remote: t } = oe(this._channelName, this._config);
			return this._target.postMessage({
				type: "port-connect",
				channelName: this._channelName,
				portId: e.portId
			}, this._config.targetOrigin ?? "*", [t]), new Promise((n, r) => {
				const s = setTimeout(() => {
					r(/* @__PURE__ */ new Error("Handshake timeout")), this._state.next("error");
				}, this._config.handshakeTimeout ?? 1e4), o = e.subscribe({ next: (i) => {
					i.type === "signal" && i.payload?.action === "handshake-ack" && (clearTimeout(s), this._handshakeComplete = !0, this._transport = e, this._state.next("connected"), o.unsubscribe(), n(e));
				} });
			});
		}
		static listen(e, t, n) {
			const r = (s) => {
				if (s.data?.type !== "port-connect" || s.data?.channelName !== e || !s.ports[0]) return;
				const o = new V(s.ports[0], e, n);
				o.send({
					id: d(),
					channel: e,
					sender: o.portId,
					type: "signal",
					payload: { action: "handshake-ack" }
				}), t(o);
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
	qe.listen;
	const Fe = (e, t = "worker") => {
		const n = mt(t ?? "worker");
		return Object.keys(e).forEach((r) => {
			e[r];
		}), n;
	};
	var Ut = ze({
		getDirHandle: () => D,
		getFileSystemRoot: () => O,
		handlers: () => R,
		normalizePath: () => M,
		resolveFileSystemHandle: () => He
	}), U, W, O, M, He, D, R, Ge, N, Ue = $e((() => {
		U = /* @__PURE__ */ new Map(), W = /* @__PURE__ */ new Map(), O = async (e = "") => e && U.has(e) ? U.get(e) : await navigator.storage.getDirectory(), M = (e) => e?.trim?.()?.replace(/\/+/g, "/") || "/", He = async (e, t, n = !1) => {
			const r = M(t).split("/").filter((o) => o && o !== ".");
			let s = e;
			for (let o = 0; o < r.length; o++) {
				const i = r[o];
				if (o === r.length - 1) try {
					return await s.getDirectoryHandle(i, { create: n });
				} catch {
					try {
						return await s.getFileHandle(i, { create: n });
					} catch (a) {
						if (n) throw a;
						return null;
					}
				}
				else s = await s.getDirectoryHandle(i, { create: n });
			}
			return s;
		}, D = async (e, t, n) => {
			const r = M(t).split("/").filter((o) => o);
			let s = e;
			for (const o of r) s = await s.getDirectoryHandle(o, { create: n });
			return s;
		}, R = {
			mount: async ({ id: e, handle: t }) => (U.set(e, t), !0),
			unmount: async ({ id: e }) => (U.delete(e), !0),
			readDirectory: async ({ rootId: e, path: t, create: n }) => {
				try {
					const r = await O(e), s = await D(r, t, n), o = [];
					for await (const [i, a] of s.entries()) o.push([i, a]);
					return o;
				} catch (r) {
					return console.warn("Worker readDirectory error:", r), [];
				}
			},
			readFile: async ({ rootId: e, path: t, type: n }) => {
				try {
					const r = await O(e), s = M(t).split("/").filter((c) => c), o = s.pop(), i = s.join("/"), a = await (await (await D(r, i, !1)).getFileHandle(o, { create: !1 })).getFile();
					return n === "text" ? await a.text() : n === "arrayBuffer" ? await a.arrayBuffer() : a;
				} catch (r) {
					return console.warn("Worker readFile error:", r), null;
				}
			},
			writeFile: async ({ rootId: e, path: t, data: n }) => {
				try {
					const r = await O(e), s = M(t).split("/").filter((c) => c), o = s.pop(), i = s.join("/"), a = await (await (await D(r, i, !0)).getFileHandle(o, { create: !0 })).createWritable();
					return await a.write(n), await a.close(), !0;
				} catch (r) {
					return console.warn("Worker writeFile error:", r), !1;
				}
			},
			remove: async ({ rootId: e, path: t, recursive: n }) => {
				try {
					const r = await O(e), s = M(t).split("/").filter((a) => a), o = s.pop(), i = s.join("/");
					return await (await D(r, i, !1)).removeEntry(o, { recursive: n }), !0;
				} catch {
					return !1;
				}
			},
			observe: async ({ rootId: e, path: t, id: n }) => {
				try {
					if (W.has(n)) return !0;
					const r = await O(e), s = await D(r, t, !1);
					if (typeof FileSystemObserver < "u") {
						const o = new FileSystemObserver((i) => {
							const a = i.map((c) => {
								const l = c.changedHandle?.name || c.relativePathComponents?.at(-1);
								return {
									type: c.type,
									name: l,
									kind: c.changedHandle?.kind || (l?.includes(".") ? "file" : "directory"),
									handle: c.changedHandle,
									path: c.relativePathComponents.join("/")
								};
							});
							self.postMessage({
								type: "observation",
								id: n,
								changes: a
							});
						});
						return o.observe(s), W.set(n, o), !0;
					}
					return !1;
				} catch {
					return !1;
				}
			},
			unobserve: async ({ id: e }) => {
				const t = W.get(e);
				return t && (t.disconnect(), W.delete(e)), !0;
			},
			copy: async ({ from: e, to: t }) => {
				try {
					const n = async (r, s) => {
						if (r.kind === "directory") for await (const [o, i] of r.entries()) if (i.kind === "directory") {
							const a = await s.getDirectoryHandle(o, { create: !0 });
							await n(i, a);
						} else {
							const a = await i.getFile(), c = await (await s.getFileHandle(o, { create: !0 })).createWritable();
							await c.write(a), await c.close();
						}
						else {
							const o = await r.getFile(), i = await s.createWritable();
							await i.write(o), await i.close();
						}
					};
					return await n(e, t), !0;
				} catch (n) {
					return console.warn("Worker copy error:", n), !1;
				}
			}
		}, Ge = "opfs-sw-bridge-v1", N = null;
		try {
			typeof BroadcastChannel < "u" && (N = new BroadcastChannel(Ge), N.onmessage = async (e) => {
				const t = e?.data || {};
				if (!t || typeof t != "object" || t?.type !== "opfs-sw-request") return;
				const n = String(t?.requestId || ""), r = String(t?.action || ""), s = t?.payload;
				if (!n || !r) return;
				const o = R[r];
				if (!o) {
					N?.postMessage?.({
						type: "opfs-sw-response",
						requestId: n,
						ok: !1,
						error: `Unknown operation type: ${r}`
					});
					return;
				}
				try {
					const i = await o(s);
					N?.postMessage?.({
						type: "opfs-sw-response",
						requestId: n,
						ok: !0,
						result: i
					});
				} catch (i) {
					N?.postMessage?.({
						type: "opfs-sw-response",
						requestId: n,
						ok: !1,
						error: i?.message || String(i)
					});
				}
			});
		} catch {
			N = null;
		}
		self.addEventListener("message", async (e) => {
			if (!e.data || typeof e.data != "object") return;
			const { id: t, type: n, payload: r } = e.data;
			if (R[n]) try {
				const s = await R[n](r);
				self.postMessage({
					id: t,
					result: s
				});
			} catch (s) {
				self.postMessage({
					id: t,
					error: s?.message || String(s)
				});
			}
			else t && self.postMessage({
				id: t,
				error: `Unknown operation type: ${n}`
			});
		});
	}));
	Ue(), R && Fe(R);
	const Wt = async (e) => {
		try {
			if (e.type === "batch") {
				const t = [];
				for (const n of e.payload) {
					const r = await We(n);
					t.push(r);
				}
				return t;
			} else return await We(e);
		} catch (t) {
			throw console.error("[OPFS Worker] Message processing error:", t), t;
		}
	}, We = async (e) => {
		const t = R[e.type];
		if (!t) throw new Error(`Unknown message type: ${e.type}`);
		return await t(e.payload);
	};
	globalThis.processMessage = Wt, (async () => {
		try {
			const e = (await Promise.resolve().then(() => (Ue(), Ut))).handlers;
			e && Fe(e), console.log("[OPFS Worker] Initialized with handlers:", Object.keys(e || {}));
		} catch (e) {
			console.error("[OPFS Worker] Failed to initialize:", e);
		}
	})();
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiYXNzZXRzL09QRlMudW5pZm9ybS53b3JrZXItIX57MDAwfX4uanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIihmdW5jdGlvbigpIHtcblxuLy8gXFwwcm9sbGRvd24vcnVudGltZS5qc1xuXHR2YXIgX19kZWZQcm9wID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xuXHR2YXIgX19lc21NaW4gPSAoZm4sIHJlcywgZXJyKSA9PiAoKSA9PiB7XG5cdFx0aWYgKGVycikgdGhyb3cgZXJyWzBdO1xuXHRcdHRyeSB7XG5cdFx0XHRyZXR1cm4gZm4gJiYgKHJlcyA9IGZuKGZuID0gMCkpLCByZXM7XG5cdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0dGhyb3cgZXJyID0gW2VdLCBlO1xuXHRcdH1cblx0fTtcblx0dmFyIF9fZXhwb3J0QWxsID0gKGFsbCwgbm9fc3ltYm9scykgPT4ge1xuXHRcdGxldCB0YXJnZXQgPSB7fTtcblx0XHRmb3IgKHZhciBuYW1lIGluIGFsbCkge1xuXHRcdFx0X19kZWZQcm9wKHRhcmdldCwgbmFtZSwge1xuXHRcdFx0XHRnZXQ6IGFsbFtuYW1lXSxcblx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZVxuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdGlmICghbm9fc3ltYm9scykge1xuXHRcdFx0X19kZWZQcm9wKHRhcmdldCwgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiBcIk1vZHVsZVwiIH0pO1xuXHRcdH1cblx0XHRyZXR1cm4gdGFyZ2V0O1xuXHR9O1xuXG4vLyAuLi91bmlmb3JtLnRzL3NyYy9uZXdlci9uZXh0L3R5cGVzL0ludGVyZmFjZS50c1xuXHRsZXQgV1JlZmxlY3RBY3Rpb24gPSAvKiBAX19QVVJFX18gKi8gZnVuY3Rpb24oV1JlZmxlY3RBY3Rpb24pIHtcblx0XHRXUmVmbGVjdEFjdGlvbltcIkdFVFwiXSA9IFwiZ2V0XCI7XG5cdFx0V1JlZmxlY3RBY3Rpb25bXCJTRVRcIl0gPSBcInNldFwiO1xuXHRcdFdSZWZsZWN0QWN0aW9uW1wiQ0FMTFwiXSA9IFwiY2FsbFwiO1xuXHRcdFdSZWZsZWN0QWN0aW9uW1wiQVBQTFlcIl0gPSBcImFwcGx5XCI7XG5cdFx0V1JlZmxlY3RBY3Rpb25bXCJDT05TVFJVQ1RcIl0gPSBcImNvbnN0cnVjdFwiO1xuXHRcdFdSZWZsZWN0QWN0aW9uW1wiREVMRVRFXCJdID0gXCJkZWxldGVcIjtcblx0XHRXUmVmbGVjdEFjdGlvbltcIkRFTEVURV9QUk9QRVJUWVwiXSA9IFwiZGVsZXRlUHJvcGVydHlcIjtcblx0XHRXUmVmbGVjdEFjdGlvbltcIkhBU1wiXSA9IFwiaGFzXCI7XG5cdFx0V1JlZmxlY3RBY3Rpb25bXCJPV05fS0VZU1wiXSA9IFwib3duS2V5c1wiO1xuXHRcdFdSZWZsZWN0QWN0aW9uW1wiR0VUX09XTl9QUk9QRVJUWV9ERVNDUklQVE9SXCJdID0gXCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JcIjtcblx0XHRXUmVmbGVjdEFjdGlvbltcIkdFVF9QUk9QRVJUWV9ERVNDUklQVE9SXCJdID0gXCJnZXRQcm9wZXJ0eURlc2NyaXB0b3JcIjtcblx0XHRXUmVmbGVjdEFjdGlvbltcIkdFVF9QUk9UT1RZUEVfT0ZcIl0gPSBcImdldFByb3RvdHlwZU9mXCI7XG5cdFx0V1JlZmxlY3RBY3Rpb25bXCJTRVRfUFJPVE9UWVBFX09GXCJdID0gXCJzZXRQcm90b3R5cGVPZlwiO1xuXHRcdFdSZWZsZWN0QWN0aW9uW1wiSVNfRVhURU5TSUJMRVwiXSA9IFwiaXNFeHRlbnNpYmxlXCI7XG5cdFx0V1JlZmxlY3RBY3Rpb25bXCJQUkVWRU5UX0VYVEVOU0lPTlNcIl0gPSBcInByZXZlbnRFeHRlbnNpb25zXCI7XG5cdFx0V1JlZmxlY3RBY3Rpb25bXCJUUkFOU0ZFUlwiXSA9IFwidHJhbnNmZXJcIjtcblx0XHRXUmVmbGVjdEFjdGlvbltcIklNUE9SVFwiXSA9IFwiaW1wb3J0XCI7XG5cdFx0V1JlZmxlY3RBY3Rpb25bXCJESVNQT1NFXCJdID0gXCJkaXNwb3NlXCI7XG5cdFx0cmV0dXJuIFdSZWZsZWN0QWN0aW9uO1xuXHR9KHt9KTtcblxuLy8gLi4vdW5pZm9ybS50cy9zcmMvbmV3ZXIvY29yZS9UcmFuc3BvcnRDb3JlLnRzXG5cdGNvbnN0IFRSQU5TUE9SVF9UWVBFX0FMSUFTRVMgPSB7XG5cdFx0XCJ3c1wiOiBcIndlYnNvY2tldFwiLFxuXHRcdFwic29ja2V0XCI6IFwid2Vic29ja2V0XCIsXG5cdFx0XCJzb2NrZXRpb1wiOiBcInNvY2tldC1pb1wiLFxuXHRcdFwic2VydmljZVwiOiBcInNlcnZpY2Utd29ya2VyXCIsXG5cdFx0XCJzd1wiOiBcInNlcnZpY2Utd29ya2VyXCIsXG5cdFx0XCJzZXJ2aWNlLXdvcmtlci1jbGllbnRcIjogXCJzZXJ2aWNlLXdvcmtlclwiLFxuXHRcdFwic2VydmljZS13b3JrZXItaG9zdFwiOiBcInNlcnZpY2Utd29ya2VyXCIsXG5cdFx0XCJyaW5nLWJ1ZmZlclwiOiBcImF0b21pY3NcIlxuXHR9O1xuXHRmdW5jdGlvbiBub3JtYWxpemVUcmFuc3BvcnRUeXBlQWxpYXModHJhbnNwb3J0KSB7XG5cdFx0Y29uc3QgcmF3ID0gU3RyaW5nKHRyYW5zcG9ydCA/PyBcIlwiKS50cmltKCkudG9Mb3dlckNhc2UoKTtcblx0XHRpZiAoIXJhdykgcmV0dXJuIFwiaW50ZXJuYWxcIjtcblx0XHRyZXR1cm4gVFJBTlNQT1JUX1RZUEVfQUxJQVNFU1tyYXddID8/IHJhdztcblx0fVxuXHRmdW5jdGlvbiBkZXRlY3RUcmFuc3BvcnRUeXBlJDEodHJhbnNwb3J0KSB7XG5cdFx0aWYgKHR5cGVvZiB0cmFuc3BvcnQgPT09IFwic3RyaW5nXCIpIHJldHVybiBub3JtYWxpemVUcmFuc3BvcnRUeXBlQWxpYXModHJhbnNwb3J0KTtcblx0XHRpZiAodHlwZW9mIFdvcmtlciAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0cmFuc3BvcnQgaW5zdGFuY2VvZiBXb3JrZXIpIHJldHVybiBcIndvcmtlclwiO1xuXHRcdGlmICh0eXBlb2YgU2hhcmVkV29ya2VyICE9PSBcInVuZGVmaW5lZFwiICYmIHRyYW5zcG9ydCBpbnN0YW5jZW9mIFNoYXJlZFdvcmtlcikgcmV0dXJuIFwic2hhcmVkLXdvcmtlclwiO1xuXHRcdGlmICh0eXBlb2YgTWVzc2FnZVBvcnQgIT09IFwidW5kZWZpbmVkXCIgJiYgdHJhbnNwb3J0IGluc3RhbmNlb2YgTWVzc2FnZVBvcnQpIHJldHVybiBcIm1lc3NhZ2UtcG9ydFwiO1xuXHRcdGlmICh0eXBlb2YgQnJvYWRjYXN0Q2hhbm5lbCAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0cmFuc3BvcnQgaW5zdGFuY2VvZiBCcm9hZGNhc3RDaGFubmVsKSByZXR1cm4gXCJicm9hZGNhc3RcIjtcblx0XHRpZiAodHlwZW9mIFdlYlNvY2tldCAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0cmFuc3BvcnQgaW5zdGFuY2VvZiBXZWJTb2NrZXQpIHJldHVybiBcIndlYnNvY2tldFwiO1xuXHRcdGlmICh0eXBlb2YgUlRDRGF0YUNoYW5uZWwgIT09IFwidW5kZWZpbmVkXCIgJiYgdHJhbnNwb3J0IGluc3RhbmNlb2YgUlRDRGF0YUNoYW5uZWwpIHJldHVybiBcInJ0Yy1kYXRhXCI7XG5cdFx0aWYgKHR5cGVvZiBjaHJvbWUgIT09IFwidW5kZWZpbmVkXCIgJiYgdHJhbnNwb3J0ICYmIHR5cGVvZiB0cmFuc3BvcnQgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIHRyYW5zcG9ydC5wb3N0TWVzc2FnZSA9PT0gXCJmdW5jdGlvblwiICYmIHRyYW5zcG9ydC5vbk1lc3NhZ2U/LmFkZExpc3RlbmVyKSByZXR1cm4gXCJjaHJvbWUtcG9ydFwiO1xuXHRcdHJldHVybiBcImludGVybmFsXCI7XG5cdH1cblxuLy8gLi4vY29yZS50cy9zcmMvdXRpbHMvUHJpbWl0aXZlLnRzXG5cdGNvbnN0ICRmeHkgPSBTeW1ib2wuZm9yKFwiQGZpeFwiKTtcblx0LyoqXG5cdCogQ2hlY2sgaWYgYSB2YWx1ZSBpcyBhIHByaW1pdGl2ZSB0eXBlIChudWxsLCBzdHJpbmcsIG51bWJlciwgYm9vbGVhbiwgYmlnaW50LCBvciB1bmRlZmluZWQpLlxuXHQqIEBwYXJhbSBvYmogLSBUaGUgdmFsdWUgdG8gY2hlY2tcblx0KiBAcmV0dXJucyBUcnVlIGlmIHRoZSB2YWx1ZSBpcyBhIHByaW1pdGl2ZSB0eXBlLCBmYWxzZSBvdGhlcndpc2Vcblx0Ki9cblx0Y29uc3QgaXNQcmltaXRpdmUgPSAob2JqKSA9PiB7XG5cdFx0cmV0dXJuIHR5cGVvZiBvYmogPT0gXCJzdHJpbmdcIiB8fCB0eXBlb2Ygb2JqID09IFwibnVtYmVyXCIgfHwgdHlwZW9mIG9iaiA9PSBcImJvb2xlYW5cIiB8fCB0eXBlb2Ygb2JqID09IFwiYmlnaW50XCIgfHwgdHlwZW9mIG9iaiA9PSBcInVuZGVmaW5lZFwiIHx8IG9iaiA9PSBudWxsO1xuXHR9O1xuXHRjb25zdCB0cnlQYXJzZUJ5SGludCA9ICh2YWx1ZSwgaGludCkgPT4ge1xuXHRcdGlmICghaXNQcmltaXRpdmUodmFsdWUpKSByZXR1cm4gbnVsbDtcblx0XHRpZiAoaGludCA9PSBcIm51bWJlclwiKSByZXR1cm4gTnVtYmVyKHZhbHVlKSB8fCAwO1xuXHRcdGlmIChoaW50ID09IFwic3RyaW5nXCIpIHJldHVybiBTdHJpbmcodmFsdWUpIHx8IFwiXCI7XG5cdFx0aWYgKGhpbnQgPT0gXCJib29sZWFuXCIpIHJldHVybiAhIXZhbHVlO1xuXHRcdHJldHVybiB2YWx1ZTtcblx0fTtcblx0Y29uc3QgdW53cmFwID0gKG9iaiwgZmFsbGJhY2spID0+IHtcblx0XHRyZXR1cm4gb2JqPy5bJGZ4eV0gPz8gKG9iaiAhPSBudWxsID8gb2JqIDogZmFsbGJhY2spID8/IGZhbGxiYWNrO1xuXHR9O1xuXHRjb25zdCBmaXhGeCA9IChvYmopID0+IHtcblx0XHRpZiAodHlwZW9mIG9iaiA9PSBcImZ1bmN0aW9uXCIgfHwgb2JqID09IG51bGwpIHJldHVybiBvYmo7XG5cdFx0Y29uc3QgZnggPSBmdW5jdGlvbigpIHt9O1xuXHRcdGZ4WyRmeHldID0gb2JqO1xuXHRcdHJldHVybiBmeDtcblx0fTtcblx0Y29uc3QgZ2V0UmFuZG9tVmFsdWVzID0gKGFycmF5KSA9PiB7XG5cdFx0cmV0dXJuIGNyeXB0bz8uZ2V0UmFuZG9tVmFsdWVzID8gY3J5cHRvPy5nZXRSYW5kb21WYWx1ZXM/LihhcnJheSkgOiAoKCkgPT4ge1xuXHRcdFx0Y29uc3QgdmFsdWVzID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXkubGVuZ3RoKTtcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHZhbHVlc1tpXSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDI1Nik7XG5cdFx0XHRyZXR1cm4gdmFsdWVzO1xuXHRcdH0pKCk7XG5cdH07XG5cdGNvbnN0IFVVSUR2NCA9ICgpID0+IGNyeXB0bz8ucmFuZG9tVVVJRCA/IGNyeXB0bz8ucmFuZG9tVVVJRD8uKCkgOiBcIjEwMDAwMDAwLTEwMDAtNDAwMC04MDAwLTEwMDAwMDAwMDAwMFwiLnJlcGxhY2UoL1swMThdL2csIChjKSA9PiAoK2MgXiBnZXRSYW5kb21WYWx1ZXM/LigvKiBAX19QVVJFX18gKi8gbmV3IFVpbnQ4QXJyYXkoMSkpPy5bMF0gJiAxNSA+PiArYyAvIDQpLnRvU3RyaW5nKDE2KSk7XG5cdGNvbnN0IHVud3JhcEFycmF5ID0gKGFycikgPT4ge1xuXHRcdGlmIChBcnJheS5pc0FycmF5KGFycikpIHJldHVybiBhcnI/LmZsYXRNYXA/LigoZWwpID0+IHtcblx0XHRcdGlmIChBcnJheS5pc0FycmF5KGVsKSkgcmV0dXJuIHVud3JhcEFycmF5KGVsKTtcblx0XHRcdHJldHVybiBlbDtcblx0XHR9KTtcblx0XHRlbHNlIHJldHVybiBhcnI7XG5cdH07XG5cdGNvbnN0IGlzTm90Q29tcGxleEFycmF5ID0gKGFycikgPT4ge1xuXHRcdHJldHVybiB1bndyYXBBcnJheShhcnIpPy5ldmVyeT8uKGlzQ2FuSnVzdFJldHVybik7XG5cdH07XG5cdGNvbnN0IGlzQ2FuSnVzdFJldHVybiA9IChvYmopID0+IHtcblx0XHRyZXR1cm4gaXNQcmltaXRpdmUob2JqKSB8fCB0eXBlb2YgU2hhcmVkQXJyYXlCdWZmZXIgPT0gXCJmdW5jdGlvblwiICYmIG9iaiBpbnN0YW5jZW9mIFNoYXJlZEFycmF5QnVmZmVyIHx8IGlzVHlwZWRBcnJheShvYmopIHx8IEFycmF5LmlzQXJyYXkob2JqKSAmJiBpc05vdENvbXBsZXhBcnJheShvYmopO1xuXHR9O1xuXHRjb25zdCBpc1R5cGVkQXJyYXkgPSAodmFsdWUpID0+IHtcblx0XHRyZXR1cm4gQXJyYXlCdWZmZXIuaXNWaWV3KHZhbHVlKSAmJiAhKHZhbHVlIGluc3RhbmNlb2YgRGF0YVZpZXcpO1xuXHR9O1xuXHRjb25zdCBpc0NhblRyYW5zZmVyID0gKG9iaikgPT4ge1xuXHRcdHJldHVybiBpc1ByaW1pdGl2ZShvYmopIHx8IHR5cGVvZiBBcnJheUJ1ZmZlciA9PSBcImZ1bmN0aW9uXCIgJiYgb2JqIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIgfHwgdHlwZW9mIE1lc3NhZ2VQb3J0ID09IFwiZnVuY3Rpb25cIiAmJiBvYmogaW5zdGFuY2VvZiBNZXNzYWdlUG9ydCB8fCB0eXBlb2YgUmVhZGFibGVTdHJlYW0gPT0gXCJmdW5jdGlvblwiICYmIG9iaiBpbnN0YW5jZW9mIFJlYWRhYmxlU3RyZWFtIHx8IHR5cGVvZiBXcml0YWJsZVN0cmVhbSA9PSBcImZ1bmN0aW9uXCIgJiYgb2JqIGluc3RhbmNlb2YgV3JpdGFibGVTdHJlYW0gfHwgdHlwZW9mIFRyYW5zZm9ybVN0cmVhbSA9PSBcImZ1bmN0aW9uXCIgJiYgb2JqIGluc3RhbmNlb2YgVHJhbnNmb3JtU3RyZWFtIHx8IHR5cGVvZiBJbWFnZUJpdG1hcCA9PSBcImZ1bmN0aW9uXCIgJiYgb2JqIGluc3RhbmNlb2YgSW1hZ2VCaXRtYXAgfHwgdHlwZW9mIFZpZGVvRnJhbWUgPT0gXCJmdW5jdGlvblwiICYmIG9iaiBpbnN0YW5jZW9mIFZpZGVvRnJhbWUgfHwgdHlwZW9mIE9mZnNjcmVlbkNhbnZhcyA9PSBcImZ1bmN0aW9uXCIgJiYgb2JqIGluc3RhbmNlb2YgT2Zmc2NyZWVuQ2FudmFzIHx8IHR5cGVvZiBSVENEYXRhQ2hhbm5lbCA9PSBcImZ1bmN0aW9uXCIgJiYgb2JqIGluc3RhbmNlb2YgUlRDRGF0YUNoYW5uZWwgfHwgdHlwZW9mIEF1ZGlvRGF0YSA9PSBcImZ1bmN0aW9uXCIgJiYgb2JqIGluc3RhbmNlb2YgQXVkaW9EYXRhIHx8IHR5cGVvZiBXZWJUcmFuc3BvcnRSZWNlaXZlU3RyZWFtID09IFwiZnVuY3Rpb25cIiAmJiBvYmogaW5zdGFuY2VvZiBXZWJUcmFuc3BvcnRSZWNlaXZlU3RyZWFtIHx8IHR5cGVvZiBXZWJUcmFuc3BvcnRTZW5kU3RyZWFtID09IFwiZnVuY3Rpb25cIiAmJiBvYmogaW5zdGFuY2VvZiBXZWJUcmFuc3BvcnRTZW5kU3RyZWFtIHx8IHR5cGVvZiBXZWJUcmFuc3BvcnRSZWNlaXZlU3RyZWFtID09IFwiZnVuY3Rpb25cIiAmJiBvYmogaW5zdGFuY2VvZiBXZWJUcmFuc3BvcnRSZWNlaXZlU3RyZWFtO1xuXHR9O1xuXG4vLyAuLi9jb3JlLnRzL3NyYy91dGlscy9SZXNvbHZlZC50c1xuXHRjb25zdCAkcHJvbWlzZSA9IFN5bWJvbC5mb3IoXCJAcHJvbWlzZVwiKTtcblx0Y29uc3QgU0tJUF9LRVlTID0gLyogQF9fUFVSRV9fICovIG5ldyBTZXQoW1xuXHRcdFN5bWJvbC5mb3IoXCJAZXh0cmFjdFwiKSxcblx0XHRTeW1ib2wuZm9yKFwiQG9yaWdpblwiKSxcblx0XHRTeW1ib2wuZm9yKFwiQHJlZ2lzdHJ5XCIpLFxuXHRcdFN5bWJvbC5mb3IoXCJAdmFsdWVcIiksXG5cdFx0U3ltYm9sLmZvcihcIkBwcm9taXNlXCIpLFxuXHRcdFN5bWJvbC5mb3IoXCJAYmVoYXZpb3JcIiksXG5cdFx0U3ltYm9sLmZvcihcIkB0cmlnZ2VyXCIpLFxuXHRcdFN5bWJvbC5mb3IoXCJAc3Vic2NyaWJlXCIpLFxuXHRcdFN5bWJvbC5mb3IoXCJAcmVhbFByb3BcIiksXG5cdFx0U3ltYm9sLmZvcihcIkB0cmlnZ2VyLWxvY2tcIiksXG5cdFx0U3ltYm9sLmZvcihcIkB0cmlnZ2VyLWxlc3NcIiksXG5cdFx0U3ltYm9sLmZvcihcIkB0cmlnZ2VyLWNvbnRyb2xcIiksXG5cdFx0U3ltYm9sLmZvcihcIkBpc05vdEVxdWFsXCIpLFxuXHRcdFN5bWJvbC5mb3IoXCJAZml4XCIpLFxuXHRcdFN5bWJvbC5mb3IoXCJAdGFyZ2V0XCIpLFxuXHRcdFN5bWJvbC5mb3IoXCJAcmVzb2x2ZWRcIilcblx0XSk7XG5cdGNvbnN0IGlzVGhlbmFibGUkMSA9ICh2YWx1ZSkgPT4gdmFsdWUgaW5zdGFuY2VvZiBQcm9taXNlIHx8IHR5cGVvZiB2YWx1ZT8udGhlbiA9PSBcImZ1bmN0aW9uXCI7XG5cdGNvbnN0IHNldHRsZU9uZSA9ICh2YWx1ZSkgPT4gUHJvbWlzZS5yZXNvbHZlKHZhbHVlKS50aGVuKCh2KSA9PiAoe1xuXHRcdHN0YXR1czogXCJmdWxmaWxsZWRcIixcblx0XHR2YWx1ZTogdlxuXHR9KSwgKHJlYXNvbikgPT4gKHtcblx0XHRzdGF0dXM6IFwicmVqZWN0ZWRcIixcblx0XHRyZWFzb25cblx0fSkpO1xuXHRjb25zdCBvd25FbnVtZXJhYmxlS2V5cyA9IChvYmopID0+IFJlZmxlY3Qub3duS2V5cyhvYmopLmZpbHRlcigoa2V5KSA9PiB7XG5cdFx0aWYgKFNLSVBfS0VZUy5oYXMoa2V5KSkgcmV0dXJuIGZhbHNlO1xuXHRcdGNvbnN0IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaiwga2V5KTtcblx0XHRyZXR1cm4gZGVzYyAhPT0gdm9pZCAwICYmIGRlc2MuZW51bWVyYWJsZTtcblx0fSk7XG5cdC8qKiBUcnVlIHdoZW4gYSB2YWx1ZSAob3IgYSBuZXN0ZWQgZW51bWVyYWJsZSBmaWVsZCkgc3RpbGwgbmVlZHMgYSBQcm9taXNlIGNvbWJpbmF0b3IuICovXG5cdGNvbnN0IGhhc1BlbmRpbmdQcm9taXNlcyA9ICh2YWx1ZSwgc2VlbikgPT4ge1xuXHRcdGlmICh2YWx1ZSA9PSBudWxsIHx8IGlzUHJpbWl0aXZlKHZhbHVlKSkgcmV0dXJuIGZhbHNlO1xuXHRcdGlmIChpc1RoZW5hYmxlJDEodmFsdWUpIHx8IGlzVGhlbmFibGUkMSh2YWx1ZT8uWyRwcm9taXNlXSkpIHJldHVybiB0cnVlO1xuXHRcdGlmICh0eXBlb2YgdmFsdWUgIT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgdmFsdWUgIT0gXCJmdW5jdGlvblwiKSByZXR1cm4gZmFsc2U7XG5cdFx0Y29uc3Qgc2VlblNldCA9IHNlZW4gPz8gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrU2V0KCk7XG5cdFx0aWYgKHNlZW5TZXQuaGFzKHZhbHVlKSkgcmV0dXJuIGZhbHNlO1xuXHRcdHNlZW5TZXQuYWRkKHZhbHVlKTtcblx0XHRpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHJldHVybiB2YWx1ZS5zb21lKChpdGVtKSA9PiBoYXNQZW5kaW5nUHJvbWlzZXMoaXRlbSwgc2VlblNldCkpO1xuXHRcdGlmICh2YWx1ZSBpbnN0YW5jZW9mIE1hcCkgcmV0dXJuIFsuLi52YWx1ZS52YWx1ZXMoKV0uc29tZSgoaXRlbSkgPT4gaGFzUGVuZGluZ1Byb21pc2VzKGl0ZW0sIHNlZW5TZXQpKTtcblx0XHRpZiAodmFsdWUgaW5zdGFuY2VvZiBTZXQpIHJldHVybiBbLi4udmFsdWUudmFsdWVzKCldLnNvbWUoKGl0ZW0pID0+IGhhc1BlbmRpbmdQcm9taXNlcyhpdGVtLCBzZWVuU2V0KSk7XG5cdFx0cmV0dXJuIG93bkVudW1lcmFibGVLZXlzKHZhbHVlKS5zb21lKChrZXkpID0+IGhhc1BlbmRpbmdQcm9taXNlcyh2YWx1ZVtrZXldLCBzZWVuU2V0KSk7XG5cdH07XG5cdGZ1bmN0aW9uIHJlc29sdmVkRGVlcCh2YWx1ZSwgbW9kZSwgc2Vlbikge1xuXHRcdGlmICh2YWx1ZSA9PSBudWxsIHx8IGlzUHJpbWl0aXZlKHZhbHVlKSB8fCB0eXBlb2YgdmFsdWUgPT0gXCJzeW1ib2xcIikgcmV0dXJuIHZhbHVlO1xuXHRcdGlmIChpc1RoZW5hYmxlJDEodmFsdWUpKSByZXR1cm4gdmFsdWU7XG5cdFx0Y29uc3Qgc2xvdCA9IHZhbHVlPy5bJHByb21pc2VdO1xuXHRcdGlmIChpc1RoZW5hYmxlJDEoc2xvdCkpIHJldHVybiBzbG90O1xuXHRcdGlmICh0eXBlb2YgdmFsdWUgIT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgdmFsdWUgIT0gXCJmdW5jdGlvblwiKSByZXR1cm4gdmFsdWU7XG5cdFx0aWYgKHNlZW4uaGFzKHZhbHVlKSkgcmV0dXJuIHZhbHVlO1xuXHRcdHNlZW4uYWRkKHZhbHVlKTtcblx0XHRpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcblx0XHRcdGNvbnN0IGl0ZW1zID0gdmFsdWUubWFwKChpdGVtKSA9PiByZXNvbHZlZERlZXAoaXRlbSwgbW9kZSwgc2VlbikpO1xuXHRcdFx0cmV0dXJuIG1vZGUgPT0gXCJzZXR0bGVkXCIgPyBQcm9taXNlLmFsbFNldHRsZWQoaXRlbXMpIDogUHJvbWlzZS5hbGwoaXRlbXMpO1xuXHRcdH1cblx0XHRpZiAodmFsdWUgaW5zdGFuY2VvZiBTZXQpIHtcblx0XHRcdGNvbnN0IGl0ZW1zID0gWy4uLnZhbHVlLnZhbHVlcygpXS5tYXAoKGl0ZW0pID0+IHJlc29sdmVkRGVlcChpdGVtLCBtb2RlLCBzZWVuKSk7XG5cdFx0XHRyZXR1cm4gbW9kZSA9PSBcInNldHRsZWRcIiA/IFByb21pc2UuYWxsU2V0dGxlZChpdGVtcykgOiBQcm9taXNlLmFsbChpdGVtcyk7XG5cdFx0fVxuXHRcdGNvbnN0IHJlY29yZCA9IHt9O1xuXHRcdGlmICh2YWx1ZSBpbnN0YW5jZW9mIE1hcCkgZm9yIChjb25zdCBba2V5LCBpdGVtXSBvZiB2YWx1ZS5lbnRyaWVzKCkpIHJlY29yZFtrZXldID0gcmVzb2x2ZWREZWVwKGl0ZW0sIG1vZGUsIHNlZW4pO1xuXHRcdGVsc2UgZm9yIChjb25zdCBrZXkgb2Ygb3duRW51bWVyYWJsZUtleXModmFsdWUpKSByZWNvcmRba2V5XSA9IHJlc29sdmVkRGVlcCh2YWx1ZVtrZXldLCBtb2RlLCBzZWVuKTtcblx0XHRyZXR1cm4gbW9kZSA9PSBcInNldHRsZWRcIiA/IFByb21pc2UuYWxsU2V0dGxlZEtleWVkKHJlY29yZCkgOiBQcm9taXNlLmFsbEtleWVkKHJlY29yZCk7XG5cdH1cblx0LyoqXG5cdCogQXdhaXQgYSB2YWx1ZSB3aXRoIHRoZSBtYXRjaGluZyBQcm9taXNlIGNvbWJpbmF0b3IgKGBhbGxgIC8gYGFsbEtleWVkYCAvIHNldHRsZWQgdmFyaWFudHMpLlxuXHQqIE5lc3RlZCByZWNvcmRzLCBhcnJheXMsIG1hcHMsIHNldHMsIGFuZCBgQHByb21pc2VgIHNsb3RzIGFyZSB3YWxrZWQgb25jZS5cblx0Ki9cblx0ZnVuY3Rpb24gcmVzb2x2ZWQodmFsdWUsIG1vZGUgPSBcImFsbFwiKSB7XG5cdFx0aWYgKGlzVGhlbmFibGUkMSh2YWx1ZSkpIHJldHVybiBtb2RlID09IFwic2V0dGxlZFwiID8gc2V0dGxlT25lKHZhbHVlKSA6IFByb21pc2UucmVzb2x2ZSh2YWx1ZSk7XG5cdFx0Y29uc3Qgc2xvdCA9IHZhbHVlPy5bJHByb21pc2VdO1xuXHRcdGlmIChpc1RoZW5hYmxlJDEoc2xvdCkpIHJldHVybiBtb2RlID09IFwic2V0dGxlZFwiID8gc2V0dGxlT25lKHNsb3QpIDogUHJvbWlzZS5yZXNvbHZlKHNsb3QpO1xuXHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUocmVzb2x2ZWREZWVwKHZhbHVlLCBtb2RlLCAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtTZXQoKSkpO1xuXHR9XG5cdHJlc29sdmVkLmFsbCA9ICh2YWx1ZSkgPT4gcmVzb2x2ZWQodmFsdWUsIFwiYWxsXCIpO1xuXHRyZXNvbHZlZC5hbGxTZXR0bGVkID0gKHZhbHVlKSA9PiByZXNvbHZlZCh2YWx1ZSwgXCJzZXR0bGVkXCIpO1xuXHRyZXNvbHZlZC5hbGxLZXllZCA9ICh2YWx1ZSkgPT4gUHJvbWlzZS5hbGxLZXllZCh2YWx1ZSk7XG5cdHJlc29sdmVkLmFsbFNldHRsZWRLZXllZCA9ICh2YWx1ZSkgPT4gUHJvbWlzZS5hbGxTZXR0bGVkS2V5ZWQodmFsdWUpO1xuXHRyZXNvbHZlZC50cnkgPSAoY2FsbGJhY2tPclZhbHVlLCAuLi5hcmdzKSA9PiBQcm9taXNlLnRyeShjYWxsYmFja09yVmFsdWUsIC4uLmFyZ3MpLnRoZW4oKHZhbHVlKSA9PiByZXNvbHZlZCh2YWx1ZSwgXCJhbGxcIikpO1xuXG4vLyAuLi9jb3JlLnRzL3NyYy91dGlscy9PYmplY3QudHNcblx0Y29uc3QgYm91bmRDdHhTeW1ib2wgPSBTeW1ib2wuZm9yKFwib2JqZWN0LmJvdW5kQ3R4XCIpO1xuXHRnbG9iYWxUaGlzW2JvdW5kQ3R4U3ltYm9sXSA/Pz0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG5cdGNvbnN0IGJvdW5kQ3R4ID0gZ2xvYmFsVGhpc1tib3VuZEN0eFN5bWJvbF07XG5cdGNvbnN0IGRlZXBPcGVyYXRlQW5kQ2xvbmUgPSAob2JqLCBvcGVyYXRpb24sICRwcmV2KSA9PiB7XG5cdFx0aWYgKEFycmF5LmlzQXJyYXkob2JqKSkge1xuXHRcdFx0aWYgKG9iai5ldmVyeShpc0Nhbkp1c3RSZXR1cm4pKSByZXR1cm4gb2JqLm1hcChvcGVyYXRpb24pO1xuXHRcdFx0cmV0dXJuIG9iai5tYXAoKHZhbHVlLCBpbmRleCkgPT4gZGVlcE9wZXJhdGVBbmRDbG9uZSh2YWx1ZSwgb3BlcmF0aW9uLCBbb2JqLCBpbmRleF0pKTtcblx0XHR9XG5cdFx0aWYgKG9iaiBpbnN0YW5jZW9mIE1hcCkge1xuXHRcdFx0Y29uc3QgZW50cmllcyA9IEFycmF5LmZyb20ob2JqLmVudHJpZXMoKSk7XG5cdFx0XHRpZiAoZW50cmllcy5tYXAoKFtrZXksIHZhbHVlXSkgPT4gdmFsdWUpLmV2ZXJ5KGlzQ2FuSnVzdFJldHVybikpIHJldHVybiBuZXcgTWFwKGVudHJpZXMubWFwKChba2V5LCB2YWx1ZV0pID0+IFtrZXksIG9wZXJhdGlvbih2YWx1ZSwga2V5LCBvYmopXSkpO1xuXHRcdFx0cmV0dXJuIG5ldyBNYXAoZW50cmllcy5tYXAoKFtrZXksIHZhbHVlXSkgPT4gW2tleSwgZGVlcE9wZXJhdGVBbmRDbG9uZSh2YWx1ZSwgb3BlcmF0aW9uLCBbb2JqLCBrZXldKV0pKTtcblx0XHR9XG5cdFx0aWYgKG9iaiBpbnN0YW5jZW9mIFNldCkge1xuXHRcdFx0Y29uc3QgZW50cmllcyA9IEFycmF5LmZyb20ob2JqLmVudHJpZXMoKSk7XG5cdFx0XHRjb25zdCB2YWx1ZXMgPSBlbnRyaWVzLm1hcCgoW2tleSwgdmFsdWVdKSA9PiB2YWx1ZSk7XG5cdFx0XHRpZiAoZW50cmllcy5ldmVyeShpc0Nhbkp1c3RSZXR1cm4pKSByZXR1cm4gbmV3IFNldCh2YWx1ZXMubWFwKG9wZXJhdGlvbikpO1xuXHRcdFx0cmV0dXJuIG5ldyBTZXQodmFsdWVzLm1hcCgodmFsdWUpID0+IGRlZXBPcGVyYXRlQW5kQ2xvbmUodmFsdWUsIG9wZXJhdGlvbiwgW29iaiwgdmFsdWVdKSkpO1xuXHRcdH1cblx0XHRpZiAodHlwZW9mIG9iaiA9PSBcIm9iamVjdFwiICYmIG9iaj8uY29uc3RydWN0b3IgPT0gT2JqZWN0ICYmIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopID09IFwiW29iamVjdCBPYmplY3RdXCIpIHtcblx0XHRcdGNvbnN0IGVudHJpZXMgPSBBcnJheS5mcm9tKE9iamVjdC5lbnRyaWVzKG9iaikpO1xuXHRcdFx0aWYgKGVudHJpZXMubWFwKChba2V5LCB2YWx1ZV0pID0+IHZhbHVlKS5ldmVyeShpc0Nhbkp1c3RSZXR1cm4pKSByZXR1cm4gT2JqZWN0LmZyb21FbnRyaWVzKGVudHJpZXMubWFwKChba2V5LCB2YWx1ZV0pID0+IFtrZXksIG9wZXJhdGlvbih2YWx1ZSwga2V5LCBvYmopXSkpO1xuXHRcdFx0cmV0dXJuIE9iamVjdC5mcm9tRW50cmllcyhlbnRyaWVzLm1hcCgoW2tleSwgdmFsdWVdKSA9PiBba2V5LCBkZWVwT3BlcmF0ZUFuZENsb25lKHZhbHVlLCBvcGVyYXRpb24sIFtvYmosIGtleV0pXSkpO1xuXHRcdH1cblx0XHRyZXR1cm4gb3BlcmF0aW9uKG9iaiwgJHByZXY/LlsxXSA/PyBcIlwiLCAkcHJldj8uWzBdID8/IG51bGwpO1xuXHR9O1xuXG4vLyAuLi9jb3JlLnRzL3NyYy91dGlscy9Qcm9taXNlZC50c1xuXHRjb25zdCByZXNvbHZlZFN5bWJvbCA9IFN5bWJvbC5mb3IoXCJAcmVzb2x2ZWQtcHJvbWlzZVwiKTtcblx0Y29uc3QgaGFuZGxlZFN5bWJvbCA9IFN5bWJvbC5mb3IoXCJAaGFuZGxlZC1wcm9taXNlXCIpO1xuXHRnbG9iYWxUaGlzW3Jlc29sdmVkU3ltYm9sXSA/Pz0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG5cdGdsb2JhbFRoaXNbaGFuZGxlZFN5bWJvbF0gPz89IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xuXHRjb25zdCByZXNvbHZlZE1hcCA9IGdsb2JhbFRoaXNbcmVzb2x2ZWRTeW1ib2xdO1xuXHRjb25zdCBoYW5kbGVkTWFwID0gZ2xvYmFsVGhpc1toYW5kbGVkU3ltYm9sXTtcblx0Y29uc3QgJGV4dHJhY3RLZXkkID0gU3ltYm9sLmZvcihcIkBleHRyYWN0XCIpO1xuXHRjb25zdCBpc1RoZW5hYmxlID0gKHZhbHVlKSA9PiB2YWx1ZSBpbnN0YW5jZW9mIFByb21pc2UgfHwgdHlwZW9mIHZhbHVlPy50aGVuID09IFwiZnVuY3Rpb25cIjtcblx0Y29uc3QgYWN0V2l0aCA9IChwcm9taXNlT3JQbGFpbiwgY2IpID0+IHtcblx0XHRpZiAoaXNUaGVuYWJsZShwcm9taXNlT3JQbGFpbikpIHtcblx0XHRcdGlmIChyZXNvbHZlZE1hcD8uaGFzPy4ocHJvbWlzZU9yUGxhaW4pKSByZXR1cm4gY2IocmVzb2x2ZWRNYXA/LmdldD8uKHByb21pc2VPclBsYWluKSk7XG5cdFx0XHRyZXR1cm4gUHJvbWlzZS50cnk/Lihhc3luYyAoKSA9PiB7XG5cdFx0XHRcdGNvbnN0IGl0ZW0gPSBhd2FpdCBwcm9taXNlT3JQbGFpbjtcblx0XHRcdFx0cmVzb2x2ZWRNYXA/LnNldD8uKHByb21pc2VPclBsYWluLCBpdGVtKTtcblx0XHRcdFx0cmV0dXJuIGl0ZW07XG5cdFx0XHR9KT8udGhlbj8uKGNiKTtcblx0XHR9XG5cdFx0cmV0dXJuIGNiKHByb21pc2VPclBsYWluKTtcblx0fTtcblx0dmFyIFByb21pc2VIYW5kbGVyID0gY2xhc3Mge1xuXHRcdCNyZXNvbHZlO1xuXHRcdCNyZWplY3Q7XG5cdFx0Y29uc3RydWN0b3IocmVzb2x2ZSwgcmVqZWN0KSB7XG5cdFx0XHR0aGlzLiNyZXNvbHZlID0gcmVzb2x2ZTtcblx0XHRcdHRoaXMuI3JlamVjdCA9IHJlamVjdDtcblx0XHR9XG5cdFx0ZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBwcm9wLCBkZXNjcmlwdG9yKSB7XG5cdFx0XHRpZiAodW53cmFwKHRhcmdldCkgaW5zdGFuY2VvZiBQcm9taXNlKSByZXR1cm4gUmVmbGVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIHByb3AsIGRlc2NyaXB0b3IpO1xuXHRcdFx0cmV0dXJuIGFjdFdpdGgodW53cmFwKHRhcmdldCksIChvYmopID0+IFJlZmxlY3QuZGVmaW5lUHJvcGVydHkob2JqLCBwcm9wLCBkZXNjcmlwdG9yKSk7XG5cdFx0fVxuXHRcdGRlbGV0ZVByb3BlcnR5KHRhcmdldCwgcHJvcCkge1xuXHRcdFx0aWYgKHVud3JhcCh0YXJnZXQpIGluc3RhbmNlb2YgUHJvbWlzZSkgcmV0dXJuIFJlZmxlY3QuZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBwcm9wKTtcblx0XHRcdHJldHVybiBhY3RXaXRoKHVud3JhcCh0YXJnZXQpLCAob2JqKSA9PiBSZWZsZWN0LmRlbGV0ZVByb3BlcnR5KG9iaiwgcHJvcCkpO1xuXHRcdH1cblx0XHRnZXRQcm90b3R5cGVPZih0YXJnZXQpIHtcblx0XHRcdGlmICh1bndyYXAodGFyZ2V0KSBpbnN0YW5jZW9mIFByb21pc2UpIHJldHVybiBSZWZsZWN0LmdldFByb3RvdHlwZU9mKHRhcmdldCk7XG5cdFx0XHRyZXR1cm4gYWN0V2l0aCh1bndyYXAodGFyZ2V0KSwgKG9iaikgPT4gUmVmbGVjdC5nZXRQcm90b3R5cGVPZihvYmopKTtcblx0XHR9XG5cdFx0c2V0UHJvdG90eXBlT2YodGFyZ2V0LCBwcm90bykge1xuXHRcdFx0aWYgKHVud3JhcCh0YXJnZXQpIGluc3RhbmNlb2YgUHJvbWlzZSkgcmV0dXJuIFJlZmxlY3Quc2V0UHJvdG90eXBlT2YodGFyZ2V0LCBwcm90byk7XG5cdFx0XHRyZXR1cm4gYWN0V2l0aCh1bndyYXAodGFyZ2V0KSwgKG9iaikgPT4gUmVmbGVjdC5zZXRQcm90b3R5cGVPZihvYmosIHByb3RvKSk7XG5cdFx0fVxuXHRcdGlzRXh0ZW5zaWJsZSh0YXJnZXQpIHtcblx0XHRcdGlmICh1bndyYXAodGFyZ2V0KSBpbnN0YW5jZW9mIFByb21pc2UpIHJldHVybiBSZWZsZWN0LmlzRXh0ZW5zaWJsZSh0YXJnZXQpO1xuXHRcdFx0cmV0dXJuIGFjdFdpdGgodW53cmFwKHRhcmdldCksIChvYmopID0+IFJlZmxlY3QuaXNFeHRlbnNpYmxlKG9iaikpO1xuXHRcdH1cblx0XHRwcmV2ZW50RXh0ZW5zaW9ucyh0YXJnZXQpIHtcblx0XHRcdGlmICh1bndyYXAodGFyZ2V0KSBpbnN0YW5jZW9mIFByb21pc2UpIHJldHVybiBSZWZsZWN0Lm93bktleXModGFyZ2V0KTtcblx0XHRcdHJldHVybiBhY3RXaXRoKHVud3JhcCh0YXJnZXQpLCAob2JqKSA9PiBSZWZsZWN0LnByZXZlbnRFeHRlbnNpb25zKG9iaikpO1xuXHRcdH1cblx0XHRvd25LZXlzKHRhcmdldCkge1xuXHRcdFx0Y29uc3QgdXdwID0gdW53cmFwKHRhcmdldCk7XG5cdFx0XHRpZiAodXdwIGluc3RhbmNlb2YgUHJvbWlzZSkgcmV0dXJuIE9iamVjdC5rZXlzKHV3cCk7XG5cdFx0XHRyZXR1cm4gYWN0V2l0aCh1d3AsIChvYmopID0+IHtcblx0XHRcdFx0cmV0dXJuICh0eXBlb2Ygb2JqID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIG9iaiA9PSBcImZ1bmN0aW9uXCIpICYmIG9iaiAhPSBudWxsID8gT2JqZWN0LmtleXMob2JqKSA6IFtdO1xuXHRcdFx0fSkgPz8gW107XG5cdFx0fVxuXHRcdGdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIHByb3ApIHtcblx0XHRcdGlmICh1bndyYXAodGFyZ2V0KSBpbnN0YW5jZW9mIFByb21pc2UpIHJldHVybiBSZWZsZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIHByb3ApO1xuXHRcdFx0cmV0dXJuIGFjdFdpdGgodW53cmFwKHRhcmdldCksIChvYmopID0+IFJlZmxlY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaiwgcHJvcCkpO1xuXHRcdH1cblx0XHRjb25zdHJ1Y3QodGFyZ2V0LCBhcmdzLCBuZXdUYXJnZXQpIHtcblx0XHRcdHJldHVybiBhY3RXaXRoKHVud3JhcCh0YXJnZXQpLCAoY3QpID0+IFJlZmxlY3QuY29uc3RydWN0KGN0LCBhcmdzLCBuZXdUYXJnZXQpKTtcblx0XHR9XG5cdFx0aGFzKHRhcmdldCwgcHJvcCkge1xuXHRcdFx0aWYgKHVud3JhcCh0YXJnZXQpIGluc3RhbmNlb2YgUHJvbWlzZSkgcmV0dXJuIFJlZmxlY3QuaGFzKHRhcmdldCwgcHJvcCk7XG5cdFx0XHRyZXR1cm4gYWN0V2l0aCh1bndyYXAodGFyZ2V0KSwgKG9iaikgPT4gUmVmbGVjdC5oYXMob2JqLCBwcm9wKSk7XG5cdFx0fVxuXHRcdGdldCh0YXJnZXQsIHByb3AsIHJlY2VpdmVyKSB7XG5cdFx0XHR0YXJnZXQgPSB1bndyYXAodGFyZ2V0KTtcblx0XHRcdGlmIChwcm9wID09IFwicHJvbWlzZVwiKSByZXR1cm4gdGFyZ2V0O1xuXHRcdFx0aWYgKHByb3AgPT0gXCJyZXNvbHZlXCIgJiYgdGhpcy4jcmVzb2x2ZSkgcmV0dXJuICguLi5hcmdzKSA9PiB7XG5cdFx0XHRcdGNvbnN0IHJlc3VsdCA9IHRoaXMuI3Jlc29sdmU/LiguLi5hcmdzKTtcblx0XHRcdFx0dGhpcy4jcmVzb2x2ZSA9IG51bGw7XG5cdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0XHR9O1xuXHRcdFx0aWYgKHByb3AgPT0gXCJyZWplY3RcIiAmJiB0aGlzLiNyZWplY3QpIHJldHVybiAoLi4uYXJncykgPT4ge1xuXHRcdFx0XHRjb25zdCByZXN1bHQgPSB0aGlzLiNyZWplY3Q/LiguLi5hcmdzKTtcblx0XHRcdFx0dGhpcy4jcmVqZWN0ID0gbnVsbDtcblx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdH07XG5cdFx0XHRpZiAocHJvcCA9PSBcInRoZW5cIiB8fCBwcm9wID09IFwiY2F0Y2hcIiB8fCBwcm9wID09IFwiZmluYWxseVwiKSB7XG5cdFx0XHRcdGlmICh0YXJnZXQgaW5zdGFuY2VvZiBQcm9taXNlKSByZXR1cm4gdGFyZ2V0Py5bcHJvcF0/LmJpbmQ/Lih0YXJnZXQpO1xuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRjb25zdCAkdG1wID0gUHJvbWlzZS50cnkoKCkgPT4gdGFyZ2V0KTtcblx0XHRcdFx0XHRyZXR1cm4gJHRtcD8uW3Byb3BdPy5iaW5kPy4oJHRtcCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGxldCByZXN1bHQgPSB2b2lkIDA7XG5cdFx0XHRpZiAocmVzb2x2ZWRNYXA/Lmhhcz8uKHRhcmdldCkgJiYgKHJlc3VsdCA9IHJlc29sdmVkTWFwPy5nZXQ/Lih0YXJnZXQpKT8uW3Byb3BdICE9IG51bGwpIHJlc3VsdCA9IHJlc29sdmVkTWFwPy5nZXQ/Lih0YXJnZXQpPy5bcHJvcF07XG5cdFx0XHRlbHNlIHJlc3VsdCA9IFByb21pc2VkKGFjdFdpdGgodGFyZ2V0LCBhc3luYyAob2JqKSA9PiB7XG5cdFx0XHRcdGlmICh1bndyYXAob2JqKSBpbnN0YW5jZW9mIFByb21pc2UpIHJldHVybiBSZWZsZWN0LmdldChvYmosIHByb3AsIHJlY2VpdmVyKTtcblx0XHRcdFx0aWYgKGlzUHJpbWl0aXZlKG9iaikpIHJldHVybiBwcm9wID09IFN5bWJvbC50b1ByaW1pdGl2ZSB8fCBwcm9wID09IFN5bWJvbC50b1N0cmluZ1RhZyA/IG9iaiA6IHZvaWQgMDtcblx0XHRcdFx0bGV0IHZhbHVlID0gdm9pZCAwO1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdHZhbHVlID0gUmVmbGVjdC5nZXQob2JqLCBwcm9wLCByZWNlaXZlcik7XG5cdFx0XHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdFx0XHR2YWx1ZSA9IHRhcmdldD8uW3Byb3BdO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh0eXBlb2YgdmFsdWUgPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gdmFsdWU/LmJpbmQ/LihvYmopO1xuXHRcdFx0XHRyZXR1cm4gdmFsdWU7XG5cdFx0XHR9KSk7XG5cdFx0XHRpZiAocHJvcCA9PSBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRcdFx0aWYgKGlzUHJpbWl0aXZlKHJlc3VsdCkpIHJldHVybiBTdHJpbmcocmVzdWx0ID8/IFwiXCIpIHx8IFwiXCI7XG5cdFx0XHRcdHJldHVybiByZXN1bHQ/LltTeW1ib2wudG9TdHJpbmdUYWddPy4oKSB8fCBTdHJpbmcocmVzdWx0ID8/IFwiXCIpIHx8IFwiXCI7XG5cdFx0XHR9XG5cdFx0XHRpZiAocHJvcCA9PSBTeW1ib2wudG9QcmltaXRpdmUpIHJldHVybiAoaGludCkgPT4ge1xuXHRcdFx0XHRpZiAoaXNQcmltaXRpdmUocmVzdWx0KSkgcmV0dXJuIHRyeVBhcnNlQnlIaW50KHJlc3VsdCwgaGludCk7XG5cdFx0XHR9O1xuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9XG5cdFx0c2V0KHRhcmdldCwgcHJvcCwgdmFsdWUpIHtcblx0XHRcdHJldHVybiBhY3RXaXRoKHVud3JhcCh0YXJnZXQpLCAob2JqKSA9PiBSZWZsZWN0LnNldChvYmosIHByb3AsIHZhbHVlKSk7XG5cdFx0fVxuXHRcdGFwcGx5KHRhcmdldCwgdGhpc0FyZywgYXJncykge1xuXHRcdFx0aWYgKHRoaXMuI3Jlc29sdmUpIHtcblx0XHRcdFx0Y29uc3QgcmVzdWx0ID0gdGhpcy4jcmVzb2x2ZT8uKC4uLmFyZ3MpO1xuXHRcdFx0XHR0aGlzLiNyZXNvbHZlID0gbnVsbDtcblx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdH1cblx0XHRcdHJldHVybiBhY3RXaXRoKHVud3JhcCh0YXJnZXQsIHRoaXMuI3Jlc29sdmUpLCAob2JqKSA9PiB7XG5cdFx0XHRcdGlmICh0eXBlb2Ygb2JqID09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0XHRcdGlmICh1bndyYXAob2JqKSBpbnN0YW5jZW9mIFByb21pc2UpIHJldHVybiBSZWZsZWN0LmFwcGx5KG9iaiwgdGhpc0FyZywgYXJncyk7XG5cdFx0XHRcdFx0cmV0dXJuIFJlZmxlY3QuYXBwbHkob2JqLCB0aGlzQXJnLCBhcmdzKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9O1xuXHRmdW5jdGlvbiBQcm9taXNlZChwcm9taXNlLCByZXNvbHZlLCByZWplY3QpIHtcblx0XHRpZiAocHJvbWlzZSAhPSBudWxsICYmIHR5cGVvZiBwcm9taXNlPy5yZXNvbHZlZCA9PSBcImZ1bmN0aW9uXCIgJiYgcHJvbWlzZVskZXh0cmFjdEtleSRdICE9IG51bGwgJiYgaGFzUGVuZGluZ1Byb21pc2VzKHByb21pc2UpKSByZXR1cm4gUHJvbWlzZWQocHJvbWlzZS5yZXNvbHZlZCgpLCByZXNvbHZlLCByZWplY3QpO1xuXHRcdGlmICghaXNUaGVuYWJsZShwcm9taXNlKSAmJiBoYXNQZW5kaW5nUHJvbWlzZXMocHJvbWlzZSkpIHJldHVybiBQcm9taXNlZChyZXNvbHZlZChwcm9taXNlKSwgcmVzb2x2ZSwgcmVqZWN0KTtcblx0XHRpZiAoIWlzVGhlbmFibGUocHJvbWlzZSkpIHJldHVybiBwcm9taXNlO1xuXHRcdGlmIChyZXNvbHZlZE1hcD8uaGFzPy4ocHJvbWlzZSkpIHJldHVybiByZXNvbHZlZE1hcD8uZ2V0Py4ocHJvbWlzZSk7XG5cdFx0aWYgKCFoYW5kbGVkTWFwPy5oYXM/Lihwcm9taXNlKSkgcHJvbWlzZT8udGhlbj8uKChpdGVtKSA9PiByZXNvbHZlZE1hcD8uc2V0Py4ocHJvbWlzZSwgaXRlbSkpO1xuXHRcdHJldHVybiBoYW5kbGVkTWFwLmdldE9ySW5zZXJ0Q29tcHV0ZWQocHJvbWlzZSwgKCkgPT4gbmV3IFByb3h5KGZpeEZ4KHByb21pc2UpLCBuZXcgUHJvbWlzZUhhbmRsZXIocmVzb2x2ZSwgcmVqZWN0KSkpO1xuXHR9XG5cdFByb21pc2VkLmFsbEtleWVkID0gZnVuY3Rpb24ocHJvbWlzZXMsIHJlc29sdmUsIHJlamVjdCkge1xuXHRcdHJldHVybiBQcm9taXNlZChQcm9taXNlLmFsbEtleWVkKHByb21pc2VzKSwgcmVzb2x2ZSwgcmVqZWN0KTtcblx0fTtcblx0UHJvbWlzZWQuYWxsU2V0dGxlZEtleWVkID0gZnVuY3Rpb24ocHJvbWlzZXMsIHJlc29sdmUsIHJlamVjdCkge1xuXHRcdHJldHVybiBQcm9taXNlZChQcm9taXNlLmFsbFNldHRsZWRLZXllZChwcm9taXNlcyksIHJlc29sdmUsIHJlamVjdCk7XG5cdH07XG5cbi8vIC4uL3VuaWZvcm0udHMvc3JjL25ld2VyL25leHQvb2JzZXJ2YWJsZS9PYnNlcnZhYmxlLnRzXG5cdHZhciBCYXNlU3Vic2NyaXB0aW9uID0gY2xhc3Mge1xuXHRcdF91bnN1YnNjcmliZTtcblx0XHRfY2xvc2VkID0gZmFsc2U7XG5cdFx0Y29uc3RydWN0b3IoX3Vuc3Vic2NyaWJlKSB7XG5cdFx0XHR0aGlzLl91bnN1YnNjcmliZSA9IF91bnN1YnNjcmliZTtcblx0XHR9XG5cdFx0Z2V0IGNsb3NlZCgpIHtcblx0XHRcdHJldHVybiB0aGlzLl9jbG9zZWQ7XG5cdFx0fVxuXHRcdHVuc3Vic2NyaWJlKCkge1xuXHRcdFx0aWYgKCF0aGlzLl9jbG9zZWQpIHtcblx0XHRcdFx0dGhpcy5fY2xvc2VkID0gdHJ1ZTtcblx0XHRcdFx0dGhpcy5fdW5zdWJzY3JpYmUoKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cdC8qKlxuXHQqIENvcmUgT2JzZXJ2YWJsZSB3aXRoIHByb2R1Y2VyIGZ1bmN0aW9uXG5cdCovXG5cdHZhciBPYnNlcnZhYmxlID0gY2xhc3Mge1xuXHRcdF9wcm9kdWNlcjtcblx0XHRjb25zdHJ1Y3RvcihfcHJvZHVjZXIpIHtcblx0XHRcdHRoaXMuX3Byb2R1Y2VyID0gX3Byb2R1Y2VyO1xuXHRcdH1cblx0XHRzdWJzY3JpYmUob2JzZXJ2ZXJPck5leHQsIG9wdHMpIHtcblx0XHRcdGNvbnN0IG9ic2VydmVyID0gdHlwZW9mIG9ic2VydmVyT3JOZXh0ID09PSBcImZ1bmN0aW9uXCIgPyB7IG5leHQ6IG9ic2VydmVyT3JOZXh0IH0gOiBvYnNlcnZlck9yTmV4dCA/PyB7fTtcblx0XHRcdGNvbnN0IGN0cmwgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG5cdFx0XHRvcHRzPy5zaWduYWw/LmFkZEV2ZW50TGlzdGVuZXIoXCJhYm9ydFwiLCAoKSA9PiBjdHJsLmFib3J0KCkpO1xuXHRcdFx0bGV0IGFjdGl2ZSA9IHRydWU7XG5cdFx0XHRsZXQgY2xlYW51cDtcblx0XHRcdGNvbnN0IGRvQ2xlYW51cCA9ICgpID0+IHtcblx0XHRcdFx0YWN0aXZlID0gZmFsc2U7XG5cdFx0XHRcdGN0cmwuYWJvcnQoKTtcblx0XHRcdFx0Y2xlYW51cD8uKCk7XG5cdFx0XHR9O1xuXHRcdFx0Y29uc3Qgc3Vic2NyaWJlciA9IHtcblx0XHRcdFx0bmV4dDogKHYpID0+IGFjdGl2ZSAmJiBvYnNlcnZlci5uZXh0Py4odiksXG5cdFx0XHRcdGVycm9yOiAoZSkgPT4ge1xuXHRcdFx0XHRcdGlmIChhY3RpdmUpIHtcblx0XHRcdFx0XHRcdG9ic2VydmVyLmVycm9yPy4oZSk7XG5cdFx0XHRcdFx0XHRkb0NsZWFudXAoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGNvbXBsZXRlOiAoKSA9PiB7XG5cdFx0XHRcdFx0aWYgKGFjdGl2ZSkge1xuXHRcdFx0XHRcdFx0b2JzZXJ2ZXIuY29tcGxldGU/LigpO1xuXHRcdFx0XHRcdFx0ZG9DbGVhbnVwKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRzaWduYWw6IGN0cmwuc2lnbmFsLFxuXHRcdFx0XHRnZXQgYWN0aXZlKCkge1xuXHRcdFx0XHRcdHJldHVybiBhY3RpdmUgJiYgIWN0cmwuc2lnbmFsLmFib3J0ZWQ7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0XHR0cnkge1xuXHRcdFx0XHRjbGVhbnVwID0gdGhpcy5fcHJvZHVjZXIoc3Vic2NyaWJlcik7XG5cdFx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRcdHN1YnNjcmliZXIuZXJyb3IoZSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gbmV3IEJhc2VTdWJzY3JpcHRpb24oZG9DbGVhbnVwKTtcblx0XHR9XG5cdFx0cGlwZSguLi5vcHMpIHtcblx0XHRcdHJldHVybiBvcHMucmVkdWNlKChzLCBvcCkgPT4gb3AocyksIHRoaXMpO1xuXHRcdH1cblx0fTtcblx0LyoqXG5cdCogU3ViamVjdCAtIE9ic2VydmFibGUgdGhhdCBjYW4gYmUgcHVzaGVkIHRvXG5cdCovXG5cdHZhciBDaGFubmVsU3ViamVjdCA9IGNsYXNzIHtcblx0XHRfc3VicyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCk7XG5cdFx0X2J1ZmZlciA9IFtdO1xuXHRcdF9tYXhCdWZmZXI7XG5cdFx0X3JlcGxheTtcblx0XHRjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcblx0XHRcdHRoaXMuX21heEJ1ZmZlciA9IG9wdGlvbnMuYnVmZmVyU2l6ZSA/PyAwO1xuXHRcdFx0dGhpcy5fcmVwbGF5ID0gb3B0aW9ucy5yZXBsYXlPblN1YnNjcmliZSA/PyBmYWxzZTtcblx0XHR9XG5cdFx0bmV4dCh2YWx1ZSkge1xuXHRcdFx0aWYgKHRoaXMuX21heEJ1ZmZlciA+IDApIHtcblx0XHRcdFx0dGhpcy5fYnVmZmVyLnB1c2godmFsdWUpO1xuXHRcdFx0XHRpZiAodGhpcy5fYnVmZmVyLmxlbmd0aCA+IHRoaXMuX21heEJ1ZmZlcikgdGhpcy5fYnVmZmVyLnNoaWZ0KCk7XG5cdFx0XHR9XG5cdFx0XHRmb3IgKGNvbnN0IHMgb2YgdGhpcy5fc3VicykgdHJ5IHtcblx0XHRcdFx0cy5uZXh0Py4odmFsdWUpO1xuXHRcdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0XHRzLmVycm9yPy4oZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGVycm9yKGVycikge1xuXHRcdFx0Zm9yIChjb25zdCBzIG9mIHRoaXMuX3N1YnMpIHMuZXJyb3I/LihlcnIpO1xuXHRcdH1cblx0XHRjb21wbGV0ZSgpIHtcblx0XHRcdGZvciAoY29uc3QgcyBvZiB0aGlzLl9zdWJzKSBzLmNvbXBsZXRlPy4oKTtcblx0XHRcdHRoaXMuX3N1YnMuY2xlYXIoKTtcblx0XHR9XG5cdFx0c3Vic2NyaWJlKG9ic2VydmVyT3JOZXh0KSB7XG5cdFx0XHRjb25zdCBvYnMgPSB0eXBlb2Ygb2JzZXJ2ZXJPck5leHQgPT09IFwiZnVuY3Rpb25cIiA/IHsgbmV4dDogb2JzZXJ2ZXJPck5leHQgfSA6IG9ic2VydmVyT3JOZXh0O1xuXHRcdFx0dGhpcy5fc3Vicy5hZGQob2JzKTtcblx0XHRcdGlmICh0aGlzLl9yZXBsYXkpIGZvciAoY29uc3QgdiBvZiB0aGlzLl9idWZmZXIpIHRyeSB7XG5cdFx0XHRcdG9icy5uZXh0Py4odik7XG5cdFx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRcdG9icy5lcnJvcj8uKGUpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG5ldyBCYXNlU3Vic2NyaXB0aW9uKCgpID0+IHtcblx0XHRcdFx0dGhpcy5fc3Vicy5kZWxldGUob2JzKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRnZXRWYWx1ZSgpIHtcblx0XHRcdHJldHVybiB0aGlzLl9idWZmZXIuYXQoLTEpO1xuXHRcdH1cblx0XHRnZXRCdWZmZXIoKSB7XG5cdFx0XHRyZXR1cm4gWy4uLnRoaXMuX2J1ZmZlcl07XG5cdFx0fVxuXHRcdGdldCBzdWJzY3JpYmVyQ291bnQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fc3Vicy5zaXplO1xuXHRcdH1cblx0fTtcblx0Y29uc3QgZmlsdGVyID0gKHByZWQpID0+IChzcmMpID0+IG5ldyBPYnNlcnZhYmxlKChzdWIpID0+IHtcblx0XHRjb25zdCBzID0gc3JjLnN1YnNjcmliZSh7XG5cdFx0XHRuZXh0OiAodikgPT4gcHJlZCh2KSAmJiBzdWIubmV4dCh2KSxcblx0XHRcdGVycm9yOiAoZSkgPT4gc3ViLmVycm9yKGUpLFxuXHRcdFx0Y29tcGxldGU6ICgpID0+IHN1Yi5jb21wbGV0ZSgpXG5cdFx0fSk7XG5cdFx0cmV0dXJuICgpID0+IHMudW5zdWJzY3JpYmUoKTtcblx0fSk7XG5cbi8vIC4uL3VuaWZvcm0udHMvc3JjL25ld2VyL25leHQvcHJveHkvSW52b2tlci50c1xuXHRmdW5jdGlvbiBkZXRlY3RDb250ZXh0VHlwZSgpIHtcblx0XHRpZiAodHlwZW9mIGdsb2JhbFRoaXMuRGVubyAhPT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuIFwiZGVub1wiO1xuXHRcdGlmICh0eXBlb2YgZ2xvYmFsVGhpcy5wcm9jZXNzICE9PSBcInVuZGVmaW5lZFwiICYmIGdsb2JhbFRoaXMucHJvY2Vzcz8udmVyc2lvbnM/Lm5vZGUpIHJldHVybiBcIm5vZGVcIjtcblx0XHRjb25zdCBzZXJ2aWNlV29ya2VyU2NvcGUgPSBnbG9iYWxUaGlzLlNlcnZpY2VXb3JrZXJHbG9iYWxTY29wZTtcblx0XHRjb25zdCBzaGFyZWRXb3JrZXJTY29wZSA9IGdsb2JhbFRoaXMuU2hhcmVkV29ya2VyR2xvYmFsU2NvcGU7XG5cdFx0Y29uc3QgZGVkaWNhdGVkV29ya2VyU2NvcGUgPSBnbG9iYWxUaGlzLkRlZGljYXRlZFdvcmtlckdsb2JhbFNjb3BlO1xuXHRcdGlmIChzZXJ2aWNlV29ya2VyU2NvcGUgJiYgc2VsZiBpbnN0YW5jZW9mIHNlcnZpY2VXb3JrZXJTY29wZSkgcmV0dXJuIFwic2VydmljZS13b3JrZXJcIjtcblx0XHRpZiAoc2hhcmVkV29ya2VyU2NvcGUgJiYgc2VsZiBpbnN0YW5jZW9mIHNoYXJlZFdvcmtlclNjb3BlKSByZXR1cm4gXCJzaGFyZWQtd29ya2VyXCI7XG5cdFx0aWYgKGRlZGljYXRlZFdvcmtlclNjb3BlICYmIHNlbGYgaW5zdGFuY2VvZiBkZWRpY2F0ZWRXb3JrZXJTY29wZSkgcmV0dXJuIFwid29ya2VyXCI7XG5cdFx0aWYgKHR5cGVvZiBjaHJvbWUgIT09IFwidW5kZWZpbmVkXCIgJiYgY2hyb21lLnJ1bnRpbWU/LmlkKSB7XG5cdFx0XHRpZiAodHlwZW9mIGNocm9tZS5ydW50aW1lLmdldEJhY2tncm91bmRQYWdlID09PSBcImZ1bmN0aW9uXCIgfHwgKGNocm9tZS5ydW50aW1lLmdldE1hbmlmZXN0Py4oKT8uYmFja2dyb3VuZCk/LnNlcnZpY2Vfd29ya2VyKSByZXR1cm4gXCJjaHJvbWUtYmFja2dyb3VuZFwiO1xuXHRcdFx0aWYgKHR5cGVvZiBjaHJvbWUuZGV2dG9vbHMgIT09IFwidW5kZWZpbmVkXCIpIHJldHVybiBcImNocm9tZS1kZXZ0b29sc1wiO1xuXHRcdFx0aWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBnbG9iYWxUaGlzPy5sb2NhdGlvbj8ucHJvdG9jb2wgPT09IFwiY2hyb21lLWV4dGVuc2lvbjpcIikge1xuXHRcdFx0XHRpZiAoKGNocm9tZS5leHRlbnNpb24/LmdldFZpZXdzPy4oeyB0eXBlOiBcInBvcHVwXCIgfSkgPz8gW10pLmluY2x1ZGVzKGdsb2JhbFRoaXMpKSByZXR1cm4gXCJjaHJvbWUtcG9wdXBcIjtcblx0XHRcdH1cblx0XHRcdGlmICh0eXBlb2YgZG9jdW1lbnQgIT09IFwidW5kZWZpbmVkXCIgJiYgZ2xvYmFsVGhpcz8ubG9jYXRpb24/LnByb3RvY29sICE9PSBcImNocm9tZS1leHRlbnNpb246XCIpIHJldHVybiBcImNocm9tZS1jb250ZW50XCI7XG5cdFx0fVxuXHRcdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgZG9jdW1lbnQgIT09IFwidW5kZWZpbmVkXCIpIHJldHVybiBcIndpbmRvd1wiO1xuXHRcdHJldHVybiBcInVua25vd25cIjtcblx0fVxuXHRmdW5jdGlvbiBkZXRlY3RUcmFuc3BvcnRUeXBlKHNvdXJjZSkge1xuXHRcdGlmICh0eXBlb2YgUlRDRGF0YUNoYW5uZWwgIT09IFwidW5kZWZpbmVkXCIgJiYgc291cmNlIGluc3RhbmNlb2YgUlRDRGF0YUNoYW5uZWwpIHJldHVybiBcInJ0Yy1kYXRhXCI7XG5cdFx0Y29uc3QgZGV0ZWN0ZWQgPSBkZXRlY3RUcmFuc3BvcnRUeXBlJDEoc291cmNlKTtcblx0XHRpZiAoZGV0ZWN0ZWQgJiYgZGV0ZWN0ZWQgIT09IFwiaW50ZXJuYWxcIikgcmV0dXJuIGRldGVjdGVkO1xuXHRcdGlmIChzb3VyY2UgPT09IHNlbGYgfHwgc291cmNlID09PSBnbG9iYWxUaGlzIHx8IHNvdXJjZSA9PT0gXCJzZWxmXCIpIHJldHVybiBcInNlbGZcIjtcblx0XHRyZXR1cm4gXCJpbnRlcm5hbFwiO1xuXHR9XG5cdGZ1bmN0aW9uIGRldGVjdEluY29taW5nQ29udGV4dFR5cGUoZGF0YSkge1xuXHRcdGlmICghZGF0YSkgcmV0dXJuIFwidW5rbm93blwiO1xuXHRcdGlmIChkYXRhLmNvbnRleHRUeXBlKSByZXR1cm4gZGF0YS5jb250ZXh0VHlwZTtcblx0XHRjb25zdCBzZW5kZXIgPSBkYXRhLnNlbmRlciA/PyBcIlwiO1xuXHRcdGlmIChzZW5kZXIuaW5jbHVkZXMoXCJ3b3JrZXJcIikpIHJldHVybiBcIndvcmtlclwiO1xuXHRcdGlmIChzZW5kZXIuaW5jbHVkZXMoXCJzd1wiKSB8fCBzZW5kZXIuaW5jbHVkZXMoXCJzZXJ2aWNlXCIpKSByZXR1cm4gXCJzZXJ2aWNlLXdvcmtlclwiO1xuXHRcdGlmIChzZW5kZXIuaW5jbHVkZXMoXCJjaHJvbWVcIikgfHwgc2VuZGVyLmluY2x1ZGVzKFwiY3J4XCIpKSByZXR1cm4gXCJjaHJvbWUtY29udGVudFwiO1xuXHRcdGlmIChzZW5kZXIuaW5jbHVkZXMoXCJiYWNrZ3JvdW5kXCIpKSByZXR1cm4gXCJjaHJvbWUtYmFja2dyb3VuZFwiO1xuXHRcdHJldHVybiBcInVua25vd25cIjtcblx0fVxuXHRjb25zdCBEZWZhdWx0UmVmbGVjdCA9IHtcblx0XHRnZXQ6ICh0YXJnZXQsIHByb3ApID0+IFJlZmxlY3QuZ2V0KHRhcmdldCwgcHJvcCksXG5cdFx0c2V0OiAodGFyZ2V0LCBwcm9wLCB2YWx1ZSkgPT4gUmVmbGVjdC5zZXQodGFyZ2V0LCBwcm9wLCB2YWx1ZSksXG5cdFx0aGFzOiAodGFyZ2V0LCBwcm9wKSA9PiBSZWZsZWN0Lmhhcyh0YXJnZXQsIHByb3ApLFxuXHRcdGFwcGx5OiAodGFyZ2V0LCB0aGlzQXJnLCBhcmdzKSA9PiBSZWZsZWN0LmFwcGx5KHRhcmdldCwgdGhpc0FyZywgYXJncyksXG5cdFx0Y29uc3RydWN0OiAodGFyZ2V0LCBhcmdzKSA9PiBSZWZsZWN0LmNvbnN0cnVjdCh0YXJnZXQsIGFyZ3MpLFxuXHRcdGRlbGV0ZVByb3BlcnR5OiAodGFyZ2V0LCBwcm9wKSA9PiBSZWZsZWN0LmRlbGV0ZVByb3BlcnR5KHRhcmdldCwgcHJvcCksXG5cdFx0b3duS2V5czogKHRhcmdldCkgPT4gUmVmbGVjdC5vd25LZXlzKHRhcmdldCksXG5cdFx0Z2V0T3duUHJvcGVydHlEZXNjcmlwdG9yOiAodGFyZ2V0LCBwcm9wKSA9PiBSZWZsZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIHByb3ApLFxuXHRcdGdldFByb3RvdHlwZU9mOiAodGFyZ2V0KSA9PiBSZWZsZWN0LmdldFByb3RvdHlwZU9mKHRhcmdldCksXG5cdFx0c2V0UHJvdG90eXBlT2Y6ICh0YXJnZXQsIHByb3RvKSA9PiBSZWZsZWN0LnNldFByb3RvdHlwZU9mKHRhcmdldCwgcHJvdG8pLFxuXHRcdGlzRXh0ZW5zaWJsZTogKHRhcmdldCkgPT4gUmVmbGVjdC5pc0V4dGVuc2libGUodGFyZ2V0KSxcblx0XHRwcmV2ZW50RXh0ZW5zaW9uczogKHRhcmdldCkgPT4gUmVmbGVjdC5wcmV2ZW50RXh0ZW5zaW9ucyh0YXJnZXQpXG5cdH07XG5cbi8vIC4uL3VuaWZvcm0udHMvc3JjL25ld2VyL25leHQvcHJveHkvUHJveHkudHNcbi8qKlxuXHQqIFByb3h5IC0gVW5pZmllZCBSZW1vdGUgUHJveHkgQ3JlYXRpb25cblx0KlxuXHQqIFNpbmdsZSBzb3VyY2Ugb2YgdHJ1dGggZm9yIGFsbCBwcm94eS1yZWxhdGVkIGZ1bmN0aW9uYWxpdHk6XG5cdCogLSBSZW1vdGUgb2JqZWN0IHByb3hpZXMgKHRyYW5zcGFyZW50IFJQQylcblx0KiAtIERlc2NyaXB0b3ItYmFzZWQgcHJveGllc1xuXHQqIC0gVHlwZS1zYWZlIHByb3h5IGNyZWF0aW9uXG5cdCogLSBFeHBvc2UvbGlzdGVuIHBhdHRlcm5zXG5cdCovXG5cdC8qKiBTeW1ib2wgdG8gaWRlbnRpZnkgcHJveHkgb2JqZWN0cyAqL1xuXHRjb25zdCBQUk9YWV9NQVJLRVIgPSBTeW1ib2wuZm9yKFwidW5pZm9ybS5wcm94eVwiKTtcblx0LyoqIFN5bWJvbCB0byBhY2Nlc3MgcHJveHkgaW50ZXJuYWxzICovXG5cdGNvbnN0IFBST1hZX0lOVEVSTkFMUyA9IFN5bWJvbC5mb3IoXCJ1bmlmb3JtLnByb3h5LmludGVybmFsc1wiKTtcblx0LyoqXG5cdCogUmVtb3RlUHJveHlIYW5kbGVyIC0gVW5pZmllZCBwcm94eSBoYW5kbGVyIGZvciByZW1vdGUgaW52b2NhdGlvblxuXHQqXG5cdCogSGFuZGxlcyBhbGwgUmVmbGVjdCBvcGVyYXRpb25zIGFuZCBmb3J3YXJkcyB0aGVtIHRvIHRoZSBpbnZva2VyLlxuXHQqL1xuXHR2YXIgUmVtb3RlUHJveHlIYW5kbGVyID0gY2xhc3Mge1xuXHRcdF9pbnZva2VyO1xuXHRcdF9jb25maWc7XG5cdFx0X2NoaWxkQ2FjaGUgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuXHRcdGNvbnN0cnVjdG9yKF9pbnZva2VyLCBjb25maWcpIHtcblx0XHRcdHRoaXMuX2ludm9rZXIgPSBfaW52b2tlcjtcblx0XHRcdHRoaXMuX2NvbmZpZyA9IHtcblx0XHRcdFx0Y2hhbm5lbDogY29uZmlnLmNoYW5uZWwsXG5cdFx0XHRcdGJhc2VQYXRoOiBjb25maWcuYmFzZVBhdGggPz8gW10sXG5cdFx0XHRcdGludm9rZXI6IF9pbnZva2VyLFxuXHRcdFx0XHRjYWNoZTogY29uZmlnLmNhY2hlID8/IHRydWUsXG5cdFx0XHRcdHRpbWVvdXQ6IGNvbmZpZy50aW1lb3V0ID8/IDNlNFxuXHRcdFx0fTtcblx0XHR9XG5cdFx0LyoqIEdldCBwcm9wZXJ0eSAtIHJldHVybnMgbmVzdGVkIHByb3h5IG9yIGludm9rZXMgR0VUICovXG5cdFx0Z2V0KHRhcmdldCwgcHJvcCwgcmVjZWl2ZXIpIHtcblx0XHRcdGNvbnN0IHByb3BTdHIgPSBTdHJpbmcocHJvcCk7XG5cdFx0XHRpZiAocHJvcCA9PT0gUFJPWFlfTUFSS0VSKSByZXR1cm4gdHJ1ZTtcblx0XHRcdGlmIChwcm9wID09PSBQUk9YWV9JTlRFUk5BTFMpIHJldHVybiB0aGlzLl9jb25maWc7XG5cdFx0XHRpZiAocHJvcCA9PT0gJHJlcXVlc3RIYW5kbGVyKSByZXR1cm4gdHJ1ZTtcblx0XHRcdGlmIChwcm9wID09PSAkZGVzY3JpcHRvcikgcmV0dXJuIHRoaXMuX2dldERlc2NyaXB0b3IoKTtcblx0XHRcdGlmIChwcm9wID09PSBcInRoZW5cIiB8fCBwcm9wID09PSBcImNhdGNoXCIgfHwgcHJvcCA9PT0gXCJmaW5hbGx5XCIpIHJldHVybiB2b2lkIDA7XG5cdFx0XHRpZiAodHlwZW9mIHByb3AgPT09IFwic3ltYm9sXCIpIHJldHVybiB2b2lkIDA7XG5cdFx0XHRpZiAocHJvcCA9PT0gXCIkcGF0aFwiKSByZXR1cm4gdGhpcy5fY29uZmlnLmJhc2VQYXRoO1xuXHRcdFx0aWYgKHByb3AgPT09IFwiJGNoYW5uZWxcIikgcmV0dXJuIHRoaXMuX2NvbmZpZy5jaGFubmVsO1xuXHRcdFx0aWYgKHByb3AgPT09IFwiJGRlc2NyaXB0b3JcIikgcmV0dXJuIHRoaXMuX2dldERlc2NyaXB0b3IoKTtcblx0XHRcdGlmIChwcm9wID09PSBcIiRpbnZva2VcIikgcmV0dXJuIHRoaXMuX2ludm9rZXI7XG5cdFx0XHRjb25zdCBjaGlsZFBhdGggPSBbLi4udGhpcy5fY29uZmlnLmJhc2VQYXRoLCBwcm9wU3RyXTtcblx0XHRcdGlmICh0aGlzLl9jb25maWcuY2FjaGUgJiYgdGhpcy5fY2hpbGRDYWNoZS5oYXMocHJvcFN0cikpIHJldHVybiB0aGlzLl9jaGlsZENhY2hlLmdldChwcm9wU3RyKTtcblx0XHRcdGNvbnN0IGNoaWxkUHJveHkgPSBjcmVhdGVSZW1vdGVQcm94eSh0aGlzLl9pbnZva2VyLCB7XG5cdFx0XHRcdC4uLnRoaXMuX2NvbmZpZyxcblx0XHRcdFx0YmFzZVBhdGg6IGNoaWxkUGF0aFxuXHRcdFx0fSk7XG5cdFx0XHRpZiAodGhpcy5fY29uZmlnLmNhY2hlKSB0aGlzLl9jaGlsZENhY2hlLnNldChwcm9wU3RyLCBjaGlsZFByb3h5KTtcblx0XHRcdHJldHVybiBjaGlsZFByb3h5O1xuXHRcdH1cblx0XHQvKiogU2V0IHByb3BlcnR5ICovXG5cdFx0c2V0KHRhcmdldCwgcHJvcCwgdmFsdWUsIHJlY2VpdmVyKSB7XG5cdFx0XHRpZiAodHlwZW9mIHByb3AgPT09IFwic3ltYm9sXCIpIHJldHVybiB0cnVlO1xuXHRcdFx0dGhpcy5faW52b2tlcihXUmVmbGVjdEFjdGlvbi5TRVQsIFsuLi50aGlzLl9jb25maWcuYmFzZVBhdGgsIFN0cmluZyhwcm9wKV0sIFt2YWx1ZV0pO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdC8qKiBBcHBseSBmdW5jdGlvbiAqL1xuXHRcdGFwcGx5KHRhcmdldCwgdGhpc0FyZywgYXJncykge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2ludm9rZXIoV1JlZmxlY3RBY3Rpb24uQVBQTFksIHRoaXMuX2NvbmZpZy5iYXNlUGF0aCwgW2FyZ3NdKTtcblx0XHR9XG5cdFx0LyoqIENvbnN0cnVjdCBuZXcgaW5zdGFuY2UgKi9cblx0XHRjb25zdHJ1Y3QodGFyZ2V0LCBhcmdzLCBuZXdUYXJnZXQpIHtcblx0XHRcdHJldHVybiB0aGlzLl9pbnZva2VyKFdSZWZsZWN0QWN0aW9uLkNPTlNUUlVDVCwgdGhpcy5fY29uZmlnLmJhc2VQYXRoLCBbYXJnc10pO1xuXHRcdH1cblx0XHQvKiogQ2hlY2sgaWYgcHJvcGVydHkgZXhpc3RzICovXG5cdFx0aGFzKHRhcmdldCwgcHJvcCkge1xuXHRcdFx0aWYgKHR5cGVvZiBwcm9wID09PSBcInN5bWJvbFwiKSByZXR1cm4gZmFsc2U7XG5cdFx0XHRyZXR1cm4gdGhpcy5faW52b2tlcihXUmVmbGVjdEFjdGlvbi5IQVMsIHRoaXMuX2NvbmZpZy5iYXNlUGF0aCwgW3Byb3BdKTtcblx0XHR9XG5cdFx0LyoqIERlbGV0ZSBwcm9wZXJ0eSAqL1xuXHRcdGRlbGV0ZVByb3BlcnR5KHRhcmdldCwgcHJvcCkge1xuXHRcdFx0aWYgKHR5cGVvZiBwcm9wID09PSBcInN5bWJvbFwiKSByZXR1cm4gdHJ1ZTtcblx0XHRcdHJldHVybiB0aGlzLl9pbnZva2VyKFdSZWZsZWN0QWN0aW9uLkRFTEVURV9QUk9QRVJUWSwgWy4uLnRoaXMuX2NvbmZpZy5iYXNlUGF0aCwgU3RyaW5nKHByb3ApXSwgW10pO1xuXHRcdH1cblx0XHQvKiogR2V0IG93biBrZXlzICovXG5cdFx0b3duS2V5cyh0YXJnZXQpIHtcblx0XHRcdHJldHVybiBbXTtcblx0XHR9XG5cdFx0LyoqIEdldCBwcm9wZXJ0eSBkZXNjcmlwdG9yICovXG5cdFx0Z2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwgcHJvcCkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxuXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdFx0XHR3cml0YWJsZTogdHJ1ZVxuXHRcdFx0fTtcblx0XHR9XG5cdFx0LyoqIEdldCBwcm90b3R5cGUgKi9cblx0XHRnZXRQcm90b3R5cGVPZih0YXJnZXQpIHtcblx0XHRcdHJldHVybiBGdW5jdGlvbi5wcm90b3R5cGU7XG5cdFx0fVxuXHRcdC8qKiBTZXQgcHJvdG90eXBlICovXG5cdFx0c2V0UHJvdG90eXBlT2YodGFyZ2V0LCBwcm90bykge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2ludm9rZXIoV1JlZmxlY3RBY3Rpb24uU0VUX1BST1RPVFlQRV9PRiwgdGhpcy5fY29uZmlnLmJhc2VQYXRoLCBbcHJvdG9dKTtcblx0XHR9XG5cdFx0LyoqIENoZWNrIGlmIGV4dGVuc2libGUgKi9cblx0XHRpc0V4dGVuc2libGUodGFyZ2V0KSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0LyoqIFByZXZlbnQgZXh0ZW5zaW9ucyAqL1xuXHRcdHByZXZlbnRFeHRlbnNpb25zKHRhcmdldCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2ludm9rZXIoV1JlZmxlY3RBY3Rpb24uUFJFVkVOVF9FWFRFTlNJT05TLCB0aGlzLl9jb25maWcuYmFzZVBhdGgsIFtdKTtcblx0XHR9XG5cdFx0LyoqIEdldCBkZXNjcmlwdG9yIGZvciB0aGlzIHByb3h5ICovXG5cdFx0X2dldERlc2NyaXB0b3IoKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRwYXRoOiB0aGlzLl9jb25maWcuYmFzZVBhdGgsXG5cdFx0XHRcdGNoYW5uZWw6IHRoaXMuX2NvbmZpZy5jaGFubmVsLFxuXHRcdFx0XHRwcmltaXRpdmU6IGZhbHNlXG5cdFx0XHR9O1xuXHRcdH1cblx0fTtcblx0LyoqXG5cdCogQ3JlYXRlIGEgcmVtb3RlIHByb3h5IGZvciB0cmFuc3BhcmVudCBSUENcblx0KlxuXHQqIEBwYXJhbSBpbnZva2VyIC0gRnVuY3Rpb24gdG8gaW52b2tlIHJlbW90ZSBvcGVyYXRpb25zXG5cdCogQHBhcmFtIGNvbmZpZyAtIFByb3h5IGNvbmZpZ3VyYXRpb25cblx0KiBAcmV0dXJucyBQcm94eSBvYmplY3QgdGhhdCBmb3J3YXJkcyBhbGwgb3BlcmF0aW9ucyB0byByZW1vdGVcblx0KlxuXHQqIEBleGFtcGxlXG5cdCogY29uc3QgcHJveHkgPSBjcmVhdGVSZW1vdGVQcm94eShcblx0KiAgICAgKGFjdGlvbiwgcGF0aCwgYXJncykgPT4gY2hhbm5lbC5pbnZva2UodGFyZ2V0Q2hhbm5lbCwgYWN0aW9uLCBwYXRoLCBhcmdzKSxcblx0KiAgICAgeyBjaGFubmVsOiBcIndvcmtlclwiIH1cblx0KiApO1xuXHQqXG5cdCogLy8gQWxsIG9wZXJhdGlvbnMgYXJlIGZvcndhcmRlZFxuXHQqIGF3YWl0IHByb3h5Lm1hdGguYWRkKDEsIDIpO1xuXHQqIGF3YWl0IHByb3h5LnVzZXIubmFtZTtcblx0KiBwcm94eS5jb25maWcuZGVidWcgPSB0cnVlO1xuXHQqL1xuXHRmdW5jdGlvbiBjcmVhdGVSZW1vdGVQcm94eShpbnZva2VyLCBjb25maWcpIHtcblx0XHRjb25zdCBmbiA9IGZ1bmN0aW9uKCkge307XG5cdFx0Y29uc3QgaGFuZGxlciA9IG5ldyBSZW1vdGVQcm94eUhhbmRsZXIoaW52b2tlciwgY29uZmlnKTtcblx0XHRyZXR1cm4gbmV3IFByb3h5KGZuLCBoYW5kbGVyKTtcblx0fVxuXHQvKipcblx0KiBDcmVhdGUgcHJveHkgZnJvbSBkZXNjcmlwdG9yXG5cdCpcblx0KiBXcmFwcyBhIFdSZWZsZWN0RGVzY3JpcHRvciBpbnRvIGEgdXNhYmxlIHByb3h5IG9iamVjdC5cblx0KlxuXHQqIEBwYXJhbSBkZXNjcmlwdG9yIC0gUmVtb3RlIG9iamVjdCBkZXNjcmlwdG9yXG5cdCogQHBhcmFtIGludm9rZXIgLSBGdW5jdGlvbiB0byBpbnZva2UgcmVtb3RlIG9wZXJhdGlvbnNcblx0KiBAcGFyYW0gdGFyZ2V0Q2hhbm5lbCAtIE92ZXJyaWRlIGNoYW5uZWwgZnJvbSBkZXNjcmlwdG9yXG5cdCovXG5cdGZ1bmN0aW9uIHdyYXBEZXNjcmlwdG9yKGRlc2NyaXB0b3IsIGludm9rZXIsIHRhcmdldENoYW5uZWwpIHtcblx0XHRpZiAoIWRlc2NyaXB0b3IgfHwgdHlwZW9mIGRlc2NyaXB0b3IgIT09IFwib2JqZWN0XCIpIHJldHVybiBkZXNjcmlwdG9yO1xuXHRcdGlmIChkZXNjcmlwdG9yLnByaW1pdGl2ZSkgcmV0dXJuIGRlc2NyaXB0b3I7XG5cdFx0Y29uc3QgY2FjaGVkID0gZGVzY01hcC5nZXQoZGVzY3JpcHRvcik7XG5cdFx0aWYgKGNhY2hlZCkgcmV0dXJuIGNhY2hlZDtcblx0XHRjb25zdCBwcm94eSA9IGNyZWF0ZVJlbW90ZVByb3h5KGludm9rZXIsIHtcblx0XHRcdGNoYW5uZWw6IHRhcmdldENoYW5uZWwgPz8gZGVzY3JpcHRvci5jaGFubmVsID8/IFwidW5rbm93blwiLFxuXHRcdFx0YmFzZVBhdGg6IGRlc2NyaXB0b3IucGF0aCA/PyBbXVxuXHRcdH0pO1xuXHRcdGRlc2NNYXAuc2V0KGRlc2NyaXB0b3IsIHByb3h5KTtcblx0XHR3cmFwTWFwLnNldChwcm94eSwgZGVzY3JpcHRvcik7XG5cdFx0cmV0dXJuIHByb3h5O1xuXHR9XG5cdC8qKlxuXHQqIENyZWF0ZSBhbiBleHBvc2UgaGFuZGxlciBmb3IgYW4gb2JqZWN0XG5cdCpcblx0KiBVc2VzIHRoZSB1bmlmaWVkIFJlcXVlc3RIYW5kbGVyIGZvciBjb25zaXN0ZW50IGJlaGF2aW9yLlxuXHQqXG5cdCogQHBhcmFtIHRhcmdldCAtIE9iamVjdCB0byBleHBvc2Vcblx0KiBAcGFyYW0gcmVmbGVjdCAtIE9wdGlvbmFsIGN1c3RvbSBSZWZsZWN0IGltcGxlbWVudGF0aW9uXG5cdCogQHJldHVybnMgSGFuZGxlciBmdW5jdGlvbiBmb3IgaW5jb21pbmcgcmVxdWVzdHNcblx0Ki9cblx0ZnVuY3Rpb24gY3JlYXRlRXhwb3NlSGFuZGxlcih0YXJnZXQsIHJlZmxlY3QpIHtcblx0XHRyZXR1cm4gY3JlYXRlT2JqZWN0SGFuZGxlcih0YXJnZXQsIHJlZmxlY3QpO1xuXHR9XG5cdC8qKlxuXHQqIENyZWF0ZSBhIHByb3h5IGZvciByZW1vdGUgb2JqZWN0IG92ZXIgYSBzZW5kZXIgKE1lc3NhZ2VQb3J0LCBldGMuKVxuXHQqXG5cdCogQHBhcmFtIHNlbmRlciAtIE9iamVjdCB3aXRoIHJlcXVlc3QoKSBtZXRob2Rcblx0KiBAcGFyYW0gYmFzZVBhdGggLSBCYXNlIHBhdGggZm9yIHByb3BlcnR5IGFjY2Vzc1xuXHQqL1xuXHRmdW5jdGlvbiBjcmVhdGVTZW5kZXJQcm94eShzZW5kZXIsIGJhc2VQYXRoID0gW10pIHtcblx0XHRjb25zdCBpbnZva2VyID0gKGFjdGlvbiwgcGF0aCwgYXJncykgPT4ge1xuXHRcdFx0cmV0dXJuIHNlbmRlci5yZXF1ZXN0KHtcblx0XHRcdFx0aWQ6IFVVSUR2NCgpLFxuXHRcdFx0XHRjaGFubmVsOiBzZW5kZXIuY2hhbm5lbE5hbWUsXG5cdFx0XHRcdHNlbmRlcjogc2VuZGVyLnNlbmRlcklkID8/IFwicHJveHlcIixcblx0XHRcdFx0dHlwZTogXCJyZXF1ZXN0XCIsXG5cdFx0XHRcdHBheWxvYWQ6IHtcblx0XHRcdFx0XHRhY3Rpb24sXG5cdFx0XHRcdFx0cGF0aCxcblx0XHRcdFx0XHRhcmdzXG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH07XG5cdFx0cmV0dXJuIGNyZWF0ZVJlbW90ZVByb3h5KGludm9rZXIsIHtcblx0XHRcdGNoYW5uZWw6IHNlbmRlci5jaGFubmVsTmFtZSxcblx0XHRcdGJhc2VQYXRoXG5cdFx0fSk7XG5cdH1cblx0LyoqIEBkZXByZWNhdGVkIFVzZSB3cmFwRGVzY3JpcHRvciAqL1xuXHRjb25zdCBtYWtlUmVxdWVzdFByb3h5ID0gd3JhcERlc2NyaXB0b3I7XG5cbi8vIC4uL3VuaWZvcm0udHMvc3JjL25ld2VyL25leHQvY2hhbm5lbC9pbnRlcm5hbC9Db25uZWN0aW9uTW9kZWwudHNcblx0ZnVuY3Rpb24gY3JlYXRlQ29ubmVjdGlvbktleShwYXJhbXMpIHtcblx0XHRyZXR1cm4gW1xuXHRcdFx0cGFyYW1zLmxvY2FsQ2hhbm5lbCxcblx0XHRcdHBhcmFtcy5yZW1vdGVDaGFubmVsLFxuXHRcdFx0cGFyYW1zLnNlbmRlcixcblx0XHRcdHBhcmFtcy50cmFuc3BvcnRUeXBlLFxuXHRcdFx0cGFyYW1zLmRpcmVjdGlvblxuXHRcdF0uam9pbihcIjo6XCIpO1xuXHR9XG5cdGZ1bmN0aW9uIHF1ZXJ5Q29ubmVjdGlvbnMoY29ubmVjdGlvbnMsIHF1ZXJ5ID0ge30pIHtcblx0XHRjb25zdCBpbmNsdWRlQ2xvc2VkID0gcXVlcnkuaW5jbHVkZUNsb3NlZCA/PyBmYWxzZTtcblx0XHRjb25zdCBkZXNpcmVkU3RhdHVzID0gcXVlcnkuc3RhdHVzID8/IChpbmNsdWRlQ2xvc2VkID8gdm9pZCAwIDogXCJhY3RpdmVcIik7XG5cdFx0cmV0dXJuIFsuLi5jb25uZWN0aW9uc10uZmlsdGVyKChjb25uZWN0aW9uKSA9PiB7XG5cdFx0XHRpZiAoZGVzaXJlZFN0YXR1cyAmJiBjb25uZWN0aW9uLnN0YXR1cyAhPT0gZGVzaXJlZFN0YXR1cykgcmV0dXJuIGZhbHNlO1xuXHRcdFx0aWYgKHF1ZXJ5LmNoYW5uZWwgJiYgY29ubmVjdGlvbi5sb2NhbENoYW5uZWwgIT09IHF1ZXJ5LmNoYW5uZWwgJiYgY29ubmVjdGlvbi5yZW1vdGVDaGFubmVsICE9PSBxdWVyeS5jaGFubmVsKSByZXR1cm4gZmFsc2U7XG5cdFx0XHRpZiAocXVlcnkubG9jYWxDaGFubmVsICYmIGNvbm5lY3Rpb24ubG9jYWxDaGFubmVsICE9PSBxdWVyeS5sb2NhbENoYW5uZWwpIHJldHVybiBmYWxzZTtcblx0XHRcdGlmIChxdWVyeS5yZW1vdGVDaGFubmVsICYmIGNvbm5lY3Rpb24ucmVtb3RlQ2hhbm5lbCAhPT0gcXVlcnkucmVtb3RlQ2hhbm5lbCkgcmV0dXJuIGZhbHNlO1xuXHRcdFx0aWYgKHF1ZXJ5LnNlbmRlciAmJiBjb25uZWN0aW9uLnNlbmRlciAhPT0gcXVlcnkuc2VuZGVyKSByZXR1cm4gZmFsc2U7XG5cdFx0XHRpZiAocXVlcnkudHJhbnNwb3J0VHlwZSAmJiBjb25uZWN0aW9uLnRyYW5zcG9ydFR5cGUgIT09IHF1ZXJ5LnRyYW5zcG9ydFR5cGUpIHJldHVybiBmYWxzZTtcblx0XHRcdGlmIChxdWVyeS5kaXJlY3Rpb24gJiYgY29ubmVjdGlvbi5kaXJlY3Rpb24gIT09IHF1ZXJ5LmRpcmVjdGlvbikgcmV0dXJuIGZhbHNlO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fSkuc29ydCgoYSwgYikgPT4gYi51cGRhdGVkQXQgLSBhLnVwZGF0ZWRBdCk7XG5cdH1cblx0dmFyIENvbm5lY3Rpb25SZWdpc3RyeSA9IGNsYXNzIHtcblx0XHRfY3JlYXRlSWQ7XG5cdFx0X2VtaXRFdmVudDtcblx0XHRfY29ubmVjdGlvbnMgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuXHRcdGNvbnN0cnVjdG9yKF9jcmVhdGVJZCwgX2VtaXRFdmVudCkge1xuXHRcdFx0dGhpcy5fY3JlYXRlSWQgPSBfY3JlYXRlSWQ7XG5cdFx0XHR0aGlzLl9lbWl0RXZlbnQgPSBfZW1pdEV2ZW50O1xuXHRcdH1cblx0XHRyZWdpc3RlcihwYXJhbXMpIHtcblx0XHRcdGNvbnN0IGtleSA9IGNyZWF0ZUNvbm5lY3Rpb25LZXkocGFyYW1zKTtcblx0XHRcdGNvbnN0IG5vdyA9IERhdGUubm93KCk7XG5cdFx0XHRjb25zdCBleGlzdGluZyA9IHRoaXMuX2Nvbm5lY3Rpb25zLmdldChrZXkpO1xuXHRcdFx0aWYgKGV4aXN0aW5nKSB7XG5cdFx0XHRcdGV4aXN0aW5nLnVwZGF0ZWRBdCA9IG5vdztcblx0XHRcdFx0ZXhpc3Rpbmcuc3RhdHVzID0gXCJhY3RpdmVcIjtcblx0XHRcdFx0ZXhpc3RpbmcubWV0YWRhdGEgPSB7XG5cdFx0XHRcdFx0Li4uZXhpc3RpbmcubWV0YWRhdGEsXG5cdFx0XHRcdFx0Li4ucGFyYW1zLm1ldGFkYXRhXG5cdFx0XHRcdH07XG5cdFx0XHRcdHJldHVybiBleGlzdGluZztcblx0XHRcdH1cblx0XHRcdGNvbnN0IGNvbm5lY3Rpb24gPSB7XG5cdFx0XHRcdGlkOiB0aGlzLl9jcmVhdGVJZCgpLFxuXHRcdFx0XHRsb2NhbENoYW5uZWw6IHBhcmFtcy5sb2NhbENoYW5uZWwsXG5cdFx0XHRcdHJlbW90ZUNoYW5uZWw6IHBhcmFtcy5yZW1vdGVDaGFubmVsLFxuXHRcdFx0XHRzZW5kZXI6IHBhcmFtcy5zZW5kZXIsXG5cdFx0XHRcdHRyYW5zcG9ydFR5cGU6IHBhcmFtcy50cmFuc3BvcnRUeXBlLFxuXHRcdFx0XHRkaXJlY3Rpb246IHBhcmFtcy5kaXJlY3Rpb24sXG5cdFx0XHRcdHN0YXR1czogXCJhY3RpdmVcIixcblx0XHRcdFx0Y3JlYXRlZEF0OiBub3csXG5cdFx0XHRcdHVwZGF0ZWRBdDogbm93LFxuXHRcdFx0XHRtZXRhZGF0YTogcGFyYW1zLm1ldGFkYXRhXG5cdFx0XHR9O1xuXHRcdFx0dGhpcy5fY29ubmVjdGlvbnMuc2V0KGtleSwgY29ubmVjdGlvbik7XG5cdFx0XHR0aGlzLl9lbWl0RXZlbnQ/Lih7XG5cdFx0XHRcdHR5cGU6IFwiY29ubmVjdGVkXCIsXG5cdFx0XHRcdGNvbm5lY3Rpb24sXG5cdFx0XHRcdHRpbWVzdGFtcDogbm93XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBjb25uZWN0aW9uO1xuXHRcdH1cblx0XHRtYXJrTm90aWZpZWQoY29ubmVjdGlvbiwgcGF5bG9hZCkge1xuXHRcdFx0Y29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcblx0XHRcdGNvbm5lY3Rpb24ubGFzdE5vdGlmeUF0ID0gbm93O1xuXHRcdFx0Y29ubmVjdGlvbi51cGRhdGVkQXQgPSBub3c7XG5cdFx0XHR0aGlzLl9lbWl0RXZlbnQ/Lih7XG5cdFx0XHRcdHR5cGU6IFwibm90aWZpZWRcIixcblx0XHRcdFx0Y29ubmVjdGlvbixcblx0XHRcdFx0dGltZXN0YW1wOiBub3csXG5cdFx0XHRcdHBheWxvYWRcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRjbG9zZUJ5Q2hhbm5lbChjaGFubmVsKSB7XG5cdFx0XHRjb25zdCBub3cgPSBEYXRlLm5vdygpO1xuXHRcdFx0Zm9yIChjb25zdCBjb25uZWN0aW9uIG9mIHRoaXMuX2Nvbm5lY3Rpb25zLnZhbHVlcygpKSB7XG5cdFx0XHRcdGlmIChjb25uZWN0aW9uLmxvY2FsQ2hhbm5lbCAhPT0gY2hhbm5lbCAmJiBjb25uZWN0aW9uLnJlbW90ZUNoYW5uZWwgIT09IGNoYW5uZWwpIGNvbnRpbnVlO1xuXHRcdFx0XHRpZiAoY29ubmVjdGlvbi5zdGF0dXMgPT09IFwiY2xvc2VkXCIpIGNvbnRpbnVlO1xuXHRcdFx0XHRjb25uZWN0aW9uLnN0YXR1cyA9IFwiY2xvc2VkXCI7XG5cdFx0XHRcdGNvbm5lY3Rpb24udXBkYXRlZEF0ID0gbm93O1xuXHRcdFx0XHR0aGlzLl9lbWl0RXZlbnQ/Lih7XG5cdFx0XHRcdFx0dHlwZTogXCJkaXNjb25uZWN0ZWRcIixcblx0XHRcdFx0XHRjb25uZWN0aW9uLFxuXHRcdFx0XHRcdHRpbWVzdGFtcDogbm93XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRjbG9zZUFsbCgpIHtcblx0XHRcdGNvbnN0IG5vdyA9IERhdGUubm93KCk7XG5cdFx0XHRmb3IgKGNvbnN0IGNvbm5lY3Rpb24gb2YgdGhpcy5fY29ubmVjdGlvbnMudmFsdWVzKCkpIHtcblx0XHRcdFx0aWYgKGNvbm5lY3Rpb24uc3RhdHVzID09PSBcImNsb3NlZFwiKSBjb250aW51ZTtcblx0XHRcdFx0Y29ubmVjdGlvbi5zdGF0dXMgPSBcImNsb3NlZFwiO1xuXHRcdFx0XHRjb25uZWN0aW9uLnVwZGF0ZWRBdCA9IG5vdztcblx0XHRcdFx0dGhpcy5fZW1pdEV2ZW50Py4oe1xuXHRcdFx0XHRcdHR5cGU6IFwiZGlzY29ubmVjdGVkXCIsXG5cdFx0XHRcdFx0Y29ubmVjdGlvbixcblx0XHRcdFx0XHR0aW1lc3RhbXA6IG5vd1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cXVlcnkocXVlcnkgPSB7fSkge1xuXHRcdFx0cmV0dXJuIHF1ZXJ5Q29ubmVjdGlvbnModGhpcy5fY29ubmVjdGlvbnMudmFsdWVzKCksIHF1ZXJ5KTtcblx0XHR9XG5cdFx0dmFsdWVzKCkge1xuXHRcdFx0cmV0dXJuIFsuLi50aGlzLl9jb25uZWN0aW9ucy52YWx1ZXMoKV07XG5cdFx0fVxuXHRcdGNsZWFyKCkge1xuXHRcdFx0dGhpcy5fY29ubmVjdGlvbnMuY2xlYXIoKTtcblx0XHR9XG5cdH07XG5cbi8vIC4uL3VuaWZvcm0udHMvc3JjL25ld2VyL25leHQvY2hhbm5lbC9VbmlmaWVkQ2hhbm5lbC50c1xuLyoqXG5cdCogVW5pZmllZCBDaGFubmVsIFN5c3RlbVxuXHQqXG5cdCogTWVyZ2VzIGFuZCB1bmlmaWVzOlxuXHQqIC0gUmVxdWVzdFByb3h5IChwcm94eSBjcmVhdGlvbiBhbmQgZGlzcGF0Y2gpXG5cdCogLSBJbnZva2VyIChSZXF1ZXN0b3IvUmVzcG9uZGVyIGFic3RyYWN0aW9uKVxuXHQqIC0gQ2hhbm5lbENvbnRleHQgKG11bHRpLWNoYW5uZWwgbWFuYWdlbWVudClcblx0KiAtIE9ic2VydmFibGVDaGFubmVscyAoT2JzZXJ2YWJsZS1iYXNlZCBtZXNzYWdpbmcpXG5cdCpcblx0KiBTaW5nbGUgZW50cnkgcG9pbnQgZm9yIGFsbCBjaGFubmVsIGNvbW11bmljYXRpb24gcGF0dGVybnM6XG5cdCogLSBgY3JlYXRlQ2hhbm5lbCgpYCAtIENyZWF0ZSBhIHVuaWZpZWQgY2hhbm5lbFxuXHQqIC0gYGNoYW5uZWwuZXhwb3NlKClgIC0gRXhwb3NlIG9iamVjdHMgZm9yIHJlbW90ZSBpbnZvY2F0aW9uXG5cdCogLSBgY2hhbm5lbC5pbXBvcnQoKWAgLSBJbXBvcnQgcmVtb3RlIG1vZHVsZXNcblx0KiAtIGBjaGFubmVsLnByb3h5KClgIC0gQ3JlYXRlIHRyYW5zcGFyZW50IHByb3h5IHRvIHJlbW90ZVxuXHQqIC0gYGNoYW5uZWwuY29ubmVjdCgpYCAtIENvbm5lY3QgdG8gdHJhbnNwb3J0XG5cdCovXG5cdC8qKlxuXHQqIFVuaWZpZWRDaGFubmVsIC0gU2luZ2xlIGVudHJ5IHBvaW50IGZvciBhbGwgY2hhbm5lbCBjb21tdW5pY2F0aW9uXG5cdCpcblx0KiBDb21iaW5lczpcblx0KiAtIFJlcXVlc3RvciBmdW5jdGlvbmFsaXR5IChpbnZva2UgcmVtb3RlIG1ldGhvZHMpXG5cdCogLSBSZXNwb25kZXIgZnVuY3Rpb25hbGl0eSAoaGFuZGxlIGluY29taW5nIHJlcXVlc3RzKVxuXHQqIC0gUHJveHkgY3JlYXRpb24gKHRyYW5zcGFyZW50IHJlbW90ZSBhY2Nlc3MpXG5cdCogLSBPYnNlcnZhYmxlIG1lc3NhZ2luZyAoc3Vic2NyaWJlL25leHQgcGF0dGVybilcblx0KiAtIE11bHRpLXRyYW5zcG9ydCBzdXBwb3J0IChXb3JrZXIsIFBvcnQsIEJyb2FkY2FzdCwgV2ViU29ja2V0LCBDaHJvbWUpXG5cdCovXG5cdHZhciBVbmlmaWVkQ2hhbm5lbCA9IGNsYXNzIHtcblx0XHRfbmFtZTtcblx0XHRfY29udGV4dFR5cGU7XG5cdFx0X2NvbmZpZztcblx0XHRfdHJhbnNwb3J0cyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG5cdFx0X2RlZmF1bHRUcmFuc3BvcnQgPSBudWxsO1xuXHRcdF9jb25uZWN0aW9uRXZlbnRzID0gbmV3IENoYW5uZWxTdWJqZWN0KHsgYnVmZmVyU2l6ZTogMjAwIH0pO1xuXHRcdF9jb25uZWN0aW9uUmVnaXN0cnkgPSBuZXcgQ29ubmVjdGlvblJlZ2lzdHJ5KCgpID0+IFVVSUR2NCgpLCAoZXZlbnQpID0+IHRoaXMuX2Nvbm5lY3Rpb25FdmVudHMubmV4dChldmVudCkpO1xuXHRcdF9wZW5kaW5nID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0XHRfc3Vic2NyaXB0aW9ucyA9IFtdO1xuXHRcdF9pbmJvdW5kID0gbmV3IENoYW5uZWxTdWJqZWN0KHsgYnVmZmVyU2l6ZTogMTAwIH0pO1xuXHRcdF9vdXRib3VuZCA9IG5ldyBDaGFubmVsU3ViamVjdCh7IGJ1ZmZlclNpemU6IDEwMCB9KTtcblx0XHRfaW52b2NhdGlvbnMgPSBuZXcgQ2hhbm5lbFN1YmplY3QoeyBidWZmZXJTaXplOiAxMDAgfSk7XG5cdFx0X3Jlc3BvbnNlcyA9IG5ldyBDaGFubmVsU3ViamVjdCh7IGJ1ZmZlclNpemU6IDEwMCB9KTtcblx0XHRfZXhwb3NlZCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG5cdFx0X3Byb3h5Q2FjaGUgPSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcblx0XHRfX2dldFByaXZhdGUoa2V5KSB7XG5cdFx0XHRyZXR1cm4gdGhpc1trZXldO1xuXHRcdH1cblx0XHRfX3NldFByaXZhdGUoa2V5LCB2YWx1ZSkge1xuXHRcdFx0dGhpc1trZXldID0gdmFsdWU7XG5cdFx0fVxuXHRcdGNvbnN0cnVjdG9yKGNvbmZpZykge1xuXHRcdFx0Y29uc3QgY2ZnID0gdHlwZW9mIGNvbmZpZyA9PT0gXCJzdHJpbmdcIiA/IHsgbmFtZTogY29uZmlnIH0gOiBjb25maWc7XG5cdFx0XHR0aGlzLl9uYW1lID0gY2ZnLm5hbWU7XG5cdFx0XHR0aGlzLl9jb250ZXh0VHlwZSA9IGNmZy5hdXRvRGV0ZWN0ICE9PSBmYWxzZSA/IGRldGVjdENvbnRleHRUeXBlKCkgOiBcInVua25vd25cIjtcblx0XHRcdHRoaXMuX2NvbmZpZyA9IHtcblx0XHRcdFx0bmFtZTogY2ZnLm5hbWUsXG5cdFx0XHRcdGF1dG9EZXRlY3Q6IGNmZy5hdXRvRGV0ZWN0ID8/IHRydWUsXG5cdFx0XHRcdHRpbWVvdXQ6IGNmZy50aW1lb3V0ID8/IDNlNCxcblx0XHRcdFx0cmVmbGVjdDogY2ZnLnJlZmxlY3QgPz8gRGVmYXVsdFJlZmxlY3QsXG5cdFx0XHRcdGJ1ZmZlclNpemU6IGNmZy5idWZmZXJTaXplID8/IDEwMCxcblx0XHRcdFx0YXV0b0xpc3RlbjogY2ZnLmF1dG9MaXN0ZW4gPz8gdHJ1ZVxuXHRcdFx0fTtcblx0XHRcdGlmICh0aGlzLl9jb25maWcuYXV0b0xpc3RlbiAmJiB0aGlzLl9pc1dvcmtlckNvbnRleHQoKSkgdGhpcy5saXN0ZW4oc2VsZik7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogQ29ubmVjdCB0byBhIHRyYW5zcG9ydCBmb3Igc2VuZGluZyByZXF1ZXN0c1xuXHRcdCpcblx0XHQqIEBwYXJhbSB0YXJnZXQgLSBXb3JrZXIsIE1lc3NhZ2VQb3J0LCBCcm9hZGNhc3RDaGFubmVsLCBXZWJTb2NrZXQsIG9yIHN0cmluZyBpZGVudGlmaWVyXG5cdFx0KiBAcGFyYW0gb3B0aW9ucyAtIENvbm5lY3Rpb24gb3B0aW9uc1xuXHRcdCovXG5cdFx0Y29ubmVjdCh0YXJnZXQsIG9wdGlvbnMgPSB7fSkge1xuXHRcdFx0Y29uc3QgdHJhbnNwb3J0VHlwZSA9IGRldGVjdFRyYW5zcG9ydFR5cGUodGFyZ2V0KTtcblx0XHRcdGNvbnN0IHRhcmdldENoYW5uZWwgPSBvcHRpb25zLnRhcmdldENoYW5uZWwgPz8gdGhpcy5faW5mZXJUYXJnZXRDaGFubmVsKHRhcmdldCwgdHJhbnNwb3J0VHlwZSk7XG5cdFx0XHRjb25zdCBiaW5kaW5nID0gdGhpcy5fY3JlYXRlVHJhbnNwb3J0QmluZGluZyh0YXJnZXQsIHRyYW5zcG9ydFR5cGUsIHRhcmdldENoYW5uZWwsIG9wdGlvbnMpO1xuXHRcdFx0dGhpcy5fdHJhbnNwb3J0cy5zZXQodGFyZ2V0Q2hhbm5lbCwgYmluZGluZyk7XG5cdFx0XHRpZiAoIXRoaXMuX2RlZmF1bHRUcmFuc3BvcnQpIHRoaXMuX2RlZmF1bHRUcmFuc3BvcnQgPSBiaW5kaW5nO1xuXHRcdFx0Y29uc3QgY29ubmVjdGlvbiA9IHRoaXMuX3JlZ2lzdGVyQ29ubmVjdGlvbih7XG5cdFx0XHRcdGxvY2FsQ2hhbm5lbDogdGhpcy5fbmFtZSxcblx0XHRcdFx0cmVtb3RlQ2hhbm5lbDogdGFyZ2V0Q2hhbm5lbCxcblx0XHRcdFx0c2VuZGVyOiB0aGlzLl9uYW1lLFxuXHRcdFx0XHR0cmFuc3BvcnRUeXBlLFxuXHRcdFx0XHRkaXJlY3Rpb246IFwib3V0Z29pbmdcIixcblx0XHRcdFx0bWV0YWRhdGE6IHsgcGhhc2U6IFwiY29ubmVjdFwiIH1cblx0XHRcdH0pO1xuXHRcdFx0dGhpcy5fZW1pdENvbm5lY3Rpb25TaWduYWwoYmluZGluZywgXCJjb25uZWN0XCIsIHtcblx0XHRcdFx0Y29ubmVjdGlvbklkOiBjb25uZWN0aW9uLmlkLFxuXHRcdFx0XHRmcm9tOiB0aGlzLl9uYW1lLFxuXHRcdFx0XHR0bzogdGFyZ2V0Q2hhbm5lbFxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBMaXN0ZW4gb24gYSB0cmFuc3BvcnQgZm9yIGluY29taW5nIHJlcXVlc3RzXG5cdFx0KlxuXHRcdCogQHBhcmFtIHNvdXJjZSAtIFRyYW5zcG9ydCBzb3VyY2UgdG8gbGlzdGVuIG9uXG5cdFx0KiBAcGFyYW0gb3B0aW9ucyAtIENvbm5lY3Rpb24gb3B0aW9uc1xuXHRcdCovXG5cdFx0bGlzdGVuKHNvdXJjZSwgb3B0aW9ucyA9IHt9KSB7XG5cdFx0XHRjb25zdCB0cmFuc3BvcnRUeXBlID0gZGV0ZWN0VHJhbnNwb3J0VHlwZShzb3VyY2UpO1xuXHRcdFx0Y29uc3Qgc291cmNlQ2hhbm5lbCA9IG9wdGlvbnMudGFyZ2V0Q2hhbm5lbCA/PyB0aGlzLl9pbmZlclRhcmdldENoYW5uZWwoc291cmNlLCB0cmFuc3BvcnRUeXBlKTtcblx0XHRcdGNvbnN0IGhhbmRsZXIgPSAoZGF0YSkgPT4gdGhpcy5faGFuZGxlSW5jb21pbmcoZGF0YSk7XG5cdFx0XHRjb25zdCBjb25uZWN0aW9uID0gdGhpcy5fcmVnaXN0ZXJDb25uZWN0aW9uKHtcblx0XHRcdFx0bG9jYWxDaGFubmVsOiB0aGlzLl9uYW1lLFxuXHRcdFx0XHRyZW1vdGVDaGFubmVsOiBzb3VyY2VDaGFubmVsLFxuXHRcdFx0XHRzZW5kZXI6IHNvdXJjZUNoYW5uZWwsXG5cdFx0XHRcdHRyYW5zcG9ydFR5cGUsXG5cdFx0XHRcdGRpcmVjdGlvbjogXCJpbmNvbWluZ1wiLFxuXHRcdFx0XHRtZXRhZGF0YTogeyBwaGFzZTogXCJsaXN0ZW5cIiB9XG5cdFx0XHR9KTtcblx0XHRcdHN3aXRjaCAodHJhbnNwb3J0VHlwZSkge1xuXHRcdFx0XHRjYXNlIFwid29ya2VyXCI6XG5cdFx0XHRcdGNhc2UgXCJtZXNzYWdlLXBvcnRcIjpcblx0XHRcdFx0Y2FzZSBcImJyb2FkY2FzdFwiOlxuXHRcdFx0XHRcdGlmIChvcHRpb25zLmF1dG9TdGFydCAhPT0gZmFsc2UgJiYgc291cmNlLnN0YXJ0KSBzb3VyY2Uuc3RhcnQoKTtcblx0XHRcdFx0XHRzb3VyY2UuYWRkRXZlbnRMaXN0ZW5lcj8uKFwibWVzc2FnZVwiLCAoKGUpID0+IGhhbmRsZXIoZS5kYXRhKSkpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwid2Vic29ja2V0XCI6XG5cdFx0XHRcdFx0c291cmNlLmFkZEV2ZW50TGlzdGVuZXI/LihcIm1lc3NhZ2VcIiwgKChlKSA9PiB7XG5cdFx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0XHRoYW5kbGVyKEpTT04ucGFyc2UoZS5kYXRhKSk7XG5cdFx0XHRcdFx0XHR9IGNhdGNoIHt9XG5cdFx0XHRcdFx0fSkpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwiY2hyb21lLXJ1bnRpbWVcIjpcblx0XHRcdFx0XHRjaHJvbWUucnVudGltZS5vbk1lc3NhZ2U/LmFkZExpc3RlbmVyPy4oKG1zZywgc2VuZGVyLCBzZW5kUmVzcG9uc2UpID0+IHtcblx0XHRcdFx0XHRcdGhhbmRsZXIobXNnKTtcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwiY2hyb21lLXRhYnNcIjpcblx0XHRcdFx0XHRjaHJvbWUucnVudGltZS5vbk1lc3NhZ2U/LmFkZExpc3RlbmVyPy4oKG1zZywgc2VuZGVyKSA9PiB7XG5cdFx0XHRcdFx0XHRpZiAob3B0aW9ucy50YWJJZCAhPSBudWxsICYmIHNlbmRlcj8udGFiPy5pZCAhPT0gb3B0aW9ucy50YWJJZCkgcmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdFx0aGFuZGxlcihtc2cpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJjaHJvbWUtcG9ydFwiOlxuXHRcdFx0XHRcdHNvdXJjZT8ub25NZXNzYWdlPy5hZGRMaXN0ZW5lcj8uKChtc2cpID0+IHtcblx0XHRcdFx0XHRcdGhhbmRsZXIobXNnKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcImNocm9tZS1leHRlcm5hbFwiOlxuXHRcdFx0XHRcdGNocm9tZS5ydW50aW1lLm9uTWVzc2FnZUV4dGVybmFsPy5hZGRMaXN0ZW5lcj8uKChtc2cpID0+IHtcblx0XHRcdFx0XHRcdGhhbmRsZXIobXNnKTtcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwic2VsZlwiOlxuXHRcdFx0XHRcdGFkZEV2ZW50TGlzdGVuZXI/LihcIm1lc3NhZ2VcIiwgKChlKSA9PiBoYW5kbGVyKGUuZGF0YSkpKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0ZGVmYXVsdDogaWYgKG9wdGlvbnMub25NZXNzYWdlKSBvcHRpb25zLm9uTWVzc2FnZShoYW5kbGVyKTtcblx0XHRcdH1cblx0XHRcdHRoaXMuX3NlbmRTaWduYWxUb1RhcmdldChzb3VyY2UsIHRyYW5zcG9ydFR5cGUsIHtcblx0XHRcdFx0Y29ubmVjdGlvbklkOiBjb25uZWN0aW9uLmlkLFxuXHRcdFx0XHRmcm9tOiB0aGlzLl9uYW1lLFxuXHRcdFx0XHR0bzogc291cmNlQ2hhbm5lbCxcblx0XHRcdFx0dGFiSWQ6IG9wdGlvbnMudGFiSWQsXG5cdFx0XHRcdGV4dGVybmFsSWQ6IG9wdGlvbnMuZXh0ZXJuYWxJZFxuXHRcdFx0fSwgXCJub3RpZnlcIik7XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBDb25uZWN0IGFuZCBsaXN0ZW4gb24gdGhlIHNhbWUgdHJhbnNwb3J0IChiaWRpcmVjdGlvbmFsKVxuXHRcdCovXG5cdFx0YXR0YWNoKHRhcmdldCwgb3B0aW9ucyA9IHt9KSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5jb25uZWN0KHRhcmdldCwgb3B0aW9ucyk7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogRXhwb3NlIGFuIG9iamVjdCBmb3IgcmVtb3RlIGludm9jYXRpb25cblx0XHQqXG5cdFx0KiBAcGFyYW0gbmFtZSAtIFBhdGggbmFtZSBmb3IgdGhlIGV4cG9zZWQgb2JqZWN0XG5cdFx0KiBAcGFyYW0gb2JqIC0gT2JqZWN0IHRvIGV4cG9zZVxuXHRcdCovXG5cdFx0ZXhwb3NlKG5hbWUsIG9iaikge1xuXHRcdFx0Y29uc3QgcGF0aCA9IFtuYW1lXTtcblx0XHRcdHdyaXRlQnlQYXRoKHBhdGgsIG9iaik7XG5cdFx0XHR0aGlzLl9leHBvc2VkLnNldChuYW1lLCB7XG5cdFx0XHRcdG5hbWUsXG5cdFx0XHRcdG9iaixcblx0XHRcdFx0cGF0aFxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBFeHBvc2UgbXVsdGlwbGUgb2JqZWN0cyBhdCBvbmNlXG5cdFx0Ki9cblx0XHRleHBvc2VBbGwoZW50cmllcykge1xuXHRcdFx0Zm9yIChjb25zdCBbbmFtZSwgb2JqXSBvZiBPYmplY3QuZW50cmllcyhlbnRyaWVzKSkgdGhpcy5leHBvc2UobmFtZSwgb2JqKTtcblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIEltcG9ydCBhIG1vZHVsZSBmcm9tIGEgcmVtb3RlIGNoYW5uZWxcblx0XHQqXG5cdFx0KiBAcGFyYW0gdXJsIC0gTW9kdWxlIFVSTCB0byBpbXBvcnRcblx0XHQqIEBwYXJhbSB0YXJnZXRDaGFubmVsIC0gVGFyZ2V0IGNoYW5uZWwgKGRlZmF1bHRzIHRvIGZpcnN0IGNvbm5lY3RlZClcblx0XHQqL1xuXHRcdGFzeW5jIGltcG9ydCh1cmwsIHRhcmdldENoYW5uZWwpIHtcblx0XHRcdHJldHVybiB0aGlzLmludm9rZSh0YXJnZXRDaGFubmVsID8/IHRoaXMuX2dldERlZmF1bHRUYXJnZXQoKSwgV1JlZmxlY3RBY3Rpb24uSU1QT1JULCBbXSwgW3VybF0pO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIEludm9rZSBhIG1ldGhvZCBvbiBhIHJlbW90ZSBvYmplY3Rcblx0XHQqXG5cdFx0KiBAcGFyYW0gdGFyZ2V0Q2hhbm5lbCAtIFRhcmdldCBjaGFubmVsIG5hbWVcblx0XHQqIEBwYXJhbSBhY3Rpb24gLSBSZWZsZWN0IGFjdGlvblxuXHRcdCogQHBhcmFtIHBhdGggLSBPYmplY3QgcGF0aFxuXHRcdCogQHBhcmFtIGFyZ3MgLSBBcmd1bWVudHNcblx0XHQqL1xuXHRcdGludm9rZSh0YXJnZXRDaGFubmVsLCBhY3Rpb24sIHBhdGgsIGFyZ3MgPSBbXSkge1xuXHRcdFx0Y29uc3QgaWQgPSBVVUlEdjQoKTtcblx0XHRcdGNvbnN0IHJlc29sdmVycyA9IFByb21pc2Uud2l0aFJlc29sdmVycygpO1xuXHRcdFx0dGhpcy5fcGVuZGluZy5zZXQoaWQsIHJlc29sdmVycyk7XG5cdFx0XHRjb25zdCB0aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdGlmICh0aGlzLl9wZW5kaW5nLmhhcyhpZCkpIHtcblx0XHRcdFx0XHR0aGlzLl9wZW5kaW5nLmRlbGV0ZShpZCk7XG5cdFx0XHRcdFx0cmVzb2x2ZXJzLnJlamVjdCgvKiBAX19QVVJFX18gKi8gbmV3IEVycm9yKGBSZXF1ZXN0IHRpbWVvdXQ6ICR7YWN0aW9ufSBvbiAke3BhdGguam9pbihcIi5cIil9YCkpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LCB0aGlzLl9jb25maWcudGltZW91dCk7XG5cdFx0XHRjb25zdCBtZXNzYWdlID0ge1xuXHRcdFx0XHRpZCxcblx0XHRcdFx0Y2hhbm5lbDogdGFyZ2V0Q2hhbm5lbCxcblx0XHRcdFx0c2VuZGVyOiB0aGlzLl9uYW1lLFxuXHRcdFx0XHR0eXBlOiBcInJlcXVlc3RcIixcblx0XHRcdFx0cGF5bG9hZDoge1xuXHRcdFx0XHRcdGNoYW5uZWw6IHRhcmdldENoYW5uZWwsXG5cdFx0XHRcdFx0c2VuZGVyOiB0aGlzLl9uYW1lLFxuXHRcdFx0XHRcdGFjdGlvbixcblx0XHRcdFx0XHRwYXRoLFxuXHRcdFx0XHRcdGFyZ3Ncblx0XHRcdFx0fSxcblx0XHRcdFx0dGltZXN0YW1wOiBEYXRlLm5vdygpXG5cdFx0XHR9O1xuXHRcdFx0dGhpcy5fc2VuZCh0YXJnZXRDaGFubmVsLCBtZXNzYWdlKTtcblx0XHRcdHRoaXMuX291dGJvdW5kLm5leHQobWVzc2FnZSk7XG5cdFx0XHRyZXR1cm4gcmVzb2x2ZXJzLnByb21pc2UuZmluYWxseSgoKSA9PiBjbGVhclRpbWVvdXQodGltZW91dCkpO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIEdldCBwcm9wZXJ0eSBmcm9tIHJlbW90ZSBvYmplY3Rcblx0XHQqL1xuXHRcdGdldCh0YXJnZXRDaGFubmVsLCBwYXRoLCBwcm9wKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5pbnZva2UodGFyZ2V0Q2hhbm5lbCwgV1JlZmxlY3RBY3Rpb24uR0VULCBwYXRoLCBbcHJvcF0pO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIFNldCBwcm9wZXJ0eSBvbiByZW1vdGUgb2JqZWN0XG5cdFx0Ki9cblx0XHRzZXQodGFyZ2V0Q2hhbm5lbCwgcGF0aCwgcHJvcCwgdmFsdWUpIHtcblx0XHRcdHJldHVybiB0aGlzLmludm9rZSh0YXJnZXRDaGFubmVsLCBXUmVmbGVjdEFjdGlvbi5TRVQsIHBhdGgsIFtwcm9wLCB2YWx1ZV0pO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIENhbGwgbWV0aG9kIG9uIHJlbW90ZSBvYmplY3Rcblx0XHQqL1xuXHRcdGNhbGwodGFyZ2V0Q2hhbm5lbCwgcGF0aCwgYXJncyA9IFtdKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5pbnZva2UodGFyZ2V0Q2hhbm5lbCwgV1JlZmxlY3RBY3Rpb24uQVBQTFksIHBhdGgsIFthcmdzXSk7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogQ29uc3RydWN0IG5ldyBpbnN0YW5jZSBvbiByZW1vdGVcblx0XHQqL1xuXHRcdGNvbnN0cnVjdCh0YXJnZXRDaGFubmVsLCBwYXRoLCBhcmdzID0gW10pIHtcblx0XHRcdHJldHVybiB0aGlzLmludm9rZSh0YXJnZXRDaGFubmVsLCBXUmVmbGVjdEFjdGlvbi5DT05TVFJVQ1QsIHBhdGgsIFthcmdzXSk7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogQ3JlYXRlIGEgdHJhbnNwYXJlbnQgcHJveHkgdG8gYSByZW1vdGUgY2hhbm5lbFxuXHRcdCpcblx0XHQqIEFsbCBvcGVyYXRpb25zIG9uIHRoZSBwcm94eSBhcmUgZm9yd2FyZGVkIHRvIHRoZSByZW1vdGUuXG5cdFx0KlxuXHRcdCogQHBhcmFtIHRhcmdldENoYW5uZWwgLSBUYXJnZXQgY2hhbm5lbCBuYW1lXG5cdFx0KiBAcGFyYW0gYmFzZVBhdGggLSBCYXNlIHBhdGggZm9yIHRoZSBwcm94eVxuXHRcdCovXG5cdFx0cHJveHkodGFyZ2V0Q2hhbm5lbCwgYmFzZVBhdGggPSBbXSkge1xuXHRcdFx0Y29uc3QgdGFyZ2V0ID0gdGFyZ2V0Q2hhbm5lbCA/PyB0aGlzLl9nZXREZWZhdWx0VGFyZ2V0KCk7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY3JlYXRlUHJveHkodGFyZ2V0LCBiYXNlUGF0aCk7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogQ3JlYXRlIHByb3h5IGZvciBhIHNwZWNpZmljIGV4cG9zZWQgbW9kdWxlIG9uIHJlbW90ZVxuXHRcdCpcblx0XHQqIEBwYXJhbSBtb2R1bGVOYW1lIC0gTmFtZSBvZiB0aGUgZXhwb3NlZCBtb2R1bGVcblx0XHQqIEBwYXJhbSB0YXJnZXRDaGFubmVsIC0gVGFyZ2V0IGNoYW5uZWxcblx0XHQqL1xuXHRcdHJlbW90ZShtb2R1bGVOYW1lLCB0YXJnZXRDaGFubmVsKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5wcm94eSh0YXJnZXRDaGFubmVsLCBbbW9kdWxlTmFtZV0pO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIFdyYXAgYSBkZXNjcmlwdG9yIGFzIGEgcHJveHlcblx0XHQqL1xuXHRcdHdyYXBEZXNjcmlwdG9yKGRlc2NyaXB0b3IsIHRhcmdldENoYW5uZWwpIHtcblx0XHRcdGNvbnN0IGludm9rZXIgPSAoYWN0aW9uLCBwYXRoLCBhcmdzKSA9PiB7XG5cdFx0XHRcdGNvbnN0IGNoYW5uZWwgPSB0YXJnZXRDaGFubmVsID8/IGRlc2NyaXB0b3I/LmNoYW5uZWwgPz8gdGhpcy5fZ2V0RGVmYXVsdFRhcmdldCgpO1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5pbnZva2UoY2hhbm5lbCwgYWN0aW9uLCBwYXRoLCBhcmdzKTtcblx0XHRcdH07XG5cdFx0XHRyZXR1cm4gd3JhcERlc2NyaXB0b3IoZGVzY3JpcHRvciwgaW52b2tlciwgdGFyZ2V0Q2hhbm5lbCA/PyBkZXNjcmlwdG9yPy5jaGFubmVsID8/IHRoaXMuX2dldERlZmF1bHRUYXJnZXQoKSk7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogU3Vic2NyaWJlIHRvIGluY29taW5nIG1lc3NhZ2VzXG5cdFx0Ki9cblx0XHRzdWJzY3JpYmUoaGFuZGxlcikge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2luYm91bmQuc3Vic2NyaWJlKGhhbmRsZXIpO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIFNlbmQgYSBtZXNzYWdlIChmaXJlLWFuZC1mb3JnZXQpXG5cdFx0Ki9cblx0XHRuZXh0KG1lc3NhZ2UpIHtcblx0XHRcdHRoaXMuX3NlbmQobWVzc2FnZS5jaGFubmVsLCBtZXNzYWdlKTtcblx0XHRcdHRoaXMuX291dGJvdW5kLm5leHQobWVzc2FnZSk7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogRW1pdCBhbiBldmVudCB0byBhIGNoYW5uZWxcblx0XHQqL1xuXHRcdGVtaXQodGFyZ2V0Q2hhbm5lbCwgZXZlbnRUeXBlLCBkYXRhKSB7XG5cdFx0XHRjb25zdCBtZXNzYWdlID0ge1xuXHRcdFx0XHRpZDogVVVJRHY0KCksXG5cdFx0XHRcdGNoYW5uZWw6IHRhcmdldENoYW5uZWwsXG5cdFx0XHRcdHNlbmRlcjogdGhpcy5fbmFtZSxcblx0XHRcdFx0dHlwZTogXCJldmVudFwiLFxuXHRcdFx0XHRwYXlsb2FkOiB7XG5cdFx0XHRcdFx0dHlwZTogZXZlbnRUeXBlLFxuXHRcdFx0XHRcdGRhdGFcblx0XHRcdFx0fSxcblx0XHRcdFx0dGltZXN0YW1wOiBEYXRlLm5vdygpXG5cdFx0XHR9O1xuXHRcdFx0dGhpcy5uZXh0KG1lc3NhZ2UpO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIEVtaXQgY29ubmVjdGlvbi1sZXZlbCBzaWduYWwgdG8gYSBzcGVjaWZpYyBjb25uZWN0ZWQgY2hhbm5lbC5cblx0XHQqIFRoaXMgaXMgdGhlIGNhbm9uaWNhbCBub3RpZnkvY29ubmVjdCBBUEkgZm9yIGZhY2FkZSBsYXllcnMuXG5cdFx0Ki9cblx0XHRub3RpZnkodGFyZ2V0Q2hhbm5lbCwgcGF5bG9hZCA9IHt9LCB0eXBlID0gXCJub3RpZnlcIikge1xuXHRcdFx0Y29uc3QgYmluZGluZyA9IHRoaXMuX3RyYW5zcG9ydHMuZ2V0KHRhcmdldENoYW5uZWwpO1xuXHRcdFx0aWYgKCFiaW5kaW5nKSByZXR1cm4gZmFsc2U7XG5cdFx0XHR0aGlzLl9lbWl0Q29ubmVjdGlvblNpZ25hbChiaW5kaW5nLCB0eXBlLCB7XG5cdFx0XHRcdGZyb206IHRoaXMuX25hbWUsXG5cdFx0XHRcdHRvOiB0YXJnZXRDaGFubmVsLFxuXHRcdFx0XHQuLi5wYXlsb2FkXG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHQvKiogT2JzZXJ2YWJsZTogSW5jb21pbmcgbWVzc2FnZXMgKi9cblx0XHRnZXQgb25NZXNzYWdlKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2luYm91bmQ7XG5cdFx0fVxuXHRcdC8qKiBPYnNlcnZhYmxlOiBPdXRnb2luZyBtZXNzYWdlcyAqL1xuXHRcdGdldCBvbk91dGJvdW5kKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX291dGJvdW5kO1xuXHRcdH1cblx0XHQvKiogT2JzZXJ2YWJsZTogSW5jb21pbmcgaW52b2NhdGlvbnMgKi9cblx0XHRnZXQgb25JbnZvY2F0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2ludm9jYXRpb25zO1xuXHRcdH1cblx0XHQvKiogT2JzZXJ2YWJsZTogT3V0Z29pbmcgcmVzcG9uc2VzICovXG5cdFx0Z2V0IG9uUmVzcG9uc2UoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fcmVzcG9uc2VzO1xuXHRcdH1cblx0XHQvKiogT2JzZXJ2YWJsZTogQ29ubmVjdGlvbiBldmVudHMgKGNvbm5lY3RlZC9ub3RpZmllZC9kaXNjb25uZWN0ZWQpICovXG5cdFx0Z2V0IG9uQ29ubmVjdGlvbigpIHtcblx0XHRcdHJldHVybiB0aGlzLl9jb25uZWN0aW9uRXZlbnRzO1xuXHRcdH1cblx0XHRzdWJzY3JpYmVDb25uZWN0aW9ucyhoYW5kbGVyKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY29ubmVjdGlvbkV2ZW50cy5zdWJzY3JpYmUoaGFuZGxlcik7XG5cdFx0fVxuXHRcdHF1ZXJ5Q29ubmVjdGlvbnMocXVlcnkgPSB7fSkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2Nvbm5lY3Rpb25SZWdpc3RyeS5xdWVyeShxdWVyeSk7XG5cdFx0fVxuXHRcdG5vdGlmeUNvbm5lY3Rpb25zKHBheWxvYWQgPSB7fSwgcXVlcnkgPSB7fSkge1xuXHRcdFx0bGV0IHNlbnQgPSAwO1xuXHRcdFx0Y29uc3QgdGFyZ2V0cyA9IHRoaXMucXVlcnlDb25uZWN0aW9ucyh7XG5cdFx0XHRcdC4uLnF1ZXJ5LFxuXHRcdFx0XHRzdGF0dXM6IFwiYWN0aXZlXCIsXG5cdFx0XHRcdGluY2x1ZGVDbG9zZWQ6IGZhbHNlXG5cdFx0XHR9KTtcblx0XHRcdGZvciAoY29uc3QgY29ubmVjdGlvbiBvZiB0YXJnZXRzKSB7XG5cdFx0XHRcdGNvbnN0IGJpbmRpbmcgPSB0aGlzLl90cmFuc3BvcnRzLmdldChjb25uZWN0aW9uLnJlbW90ZUNoYW5uZWwpO1xuXHRcdFx0XHRpZiAoIWJpbmRpbmcpIGNvbnRpbnVlO1xuXHRcdFx0XHR0aGlzLl9lbWl0Q29ubmVjdGlvblNpZ25hbChiaW5kaW5nLCBcIm5vdGlmeVwiLCB7XG5cdFx0XHRcdFx0Y29ubmVjdGlvbklkOiBjb25uZWN0aW9uLmlkLFxuXHRcdFx0XHRcdGZyb206IHRoaXMuX25hbWUsXG5cdFx0XHRcdFx0dG86IGNvbm5lY3Rpb24ucmVtb3RlQ2hhbm5lbCxcblx0XHRcdFx0XHQuLi5wYXlsb2FkXG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRzZW50Kys7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gc2VudDtcblx0XHR9XG5cdFx0LyoqIENoYW5uZWwgbmFtZSAqL1xuXHRcdGdldCBuYW1lKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX25hbWU7XG5cdFx0fVxuXHRcdC8qKiBEZXRlY3RlZCBjb250ZXh0IHR5cGUgKi9cblx0XHRnZXQgY29udGV4dFR5cGUoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY29udGV4dFR5cGU7XG5cdFx0fVxuXHRcdC8qKiBDb25maWd1cmF0aW9uICovXG5cdFx0Z2V0IGNvbmZpZygpIHtcblx0XHRcdHJldHVybiB0aGlzLl9jb25maWc7XG5cdFx0fVxuXHRcdC8qKiBDb25uZWN0ZWQgdHJhbnNwb3J0IG5hbWVzICovXG5cdFx0Z2V0IGNvbm5lY3RlZENoYW5uZWxzKCkge1xuXHRcdFx0cmV0dXJuIFsuLi50aGlzLl90cmFuc3BvcnRzLmtleXMoKV07XG5cdFx0fVxuXHRcdC8qKiBFeHBvc2VkIG1vZHVsZSBuYW1lcyAqL1xuXHRcdGdldCBleHBvc2VkTW9kdWxlcygpIHtcblx0XHRcdHJldHVybiBbLi4udGhpcy5fZXhwb3NlZC5rZXlzKCldO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIENsb3NlIGFsbCBjb25uZWN0aW9ucyBhbmQgY2xlYW51cFxuXHRcdCovXG5cdFx0Y2xvc2UoKSB7XG5cdFx0XHR0aGlzLl9zdWJzY3JpcHRpb25zLmZvckVhY2goKHMpID0+IHMudW5zdWJzY3JpYmUoKSk7XG5cdFx0XHR0aGlzLl9zdWJzY3JpcHRpb25zID0gW107XG5cdFx0XHR0aGlzLl9wZW5kaW5nLmNsZWFyKCk7XG5cdFx0XHR0aGlzLl9tYXJrQWxsQ29ubmVjdGlvbnNDbG9zZWQoKTtcblx0XHRcdGZvciAoY29uc3QgYmluZGluZyBvZiB0aGlzLl90cmFuc3BvcnRzLnZhbHVlcygpKSB7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0YmluZGluZy5jbGVhbnVwPy4oKTtcblx0XHRcdFx0fSBjYXRjaCB7fVxuXHRcdFx0XHRpZiAoYmluZGluZy50cmFuc3BvcnRUeXBlID09PSBcIm1lc3NhZ2UtcG9ydFwiIHx8IGJpbmRpbmcudHJhbnNwb3J0VHlwZSA9PT0gXCJicm9hZGNhc3RcIikgdHJ5IHtcblx0XHRcdFx0XHRiaW5kaW5nLnRhcmdldD8uY2xvc2U/LigpO1xuXHRcdFx0XHR9IGNhdGNoIHt9XG5cdFx0XHR9XG5cdFx0XHR0aGlzLl90cmFuc3BvcnRzLmNsZWFyKCk7XG5cdFx0XHR0aGlzLl9kZWZhdWx0VHJhbnNwb3J0ID0gbnVsbDtcblx0XHRcdHRoaXMuX2Nvbm5lY3Rpb25SZWdpc3RyeS5jbGVhcigpO1xuXHRcdFx0dGhpcy5faW5ib3VuZC5jb21wbGV0ZSgpO1xuXHRcdFx0dGhpcy5fb3V0Ym91bmQuY29tcGxldGUoKTtcblx0XHRcdHRoaXMuX2ludm9jYXRpb25zLmNvbXBsZXRlKCk7XG5cdFx0XHR0aGlzLl9yZXNwb25zZXMuY29tcGxldGUoKTtcblx0XHRcdHRoaXMuX2Nvbm5lY3Rpb25FdmVudHMuY29tcGxldGUoKTtcblx0XHR9XG5cdFx0X2hhbmRsZUluY29taW5nKGRhdGEpIHtcblx0XHRcdGlmICghZGF0YSB8fCB0eXBlb2YgZGF0YSAhPT0gXCJvYmplY3RcIikgcmV0dXJuO1xuXHRcdFx0dGhpcy5faW5ib3VuZC5uZXh0KGRhdGEpO1xuXHRcdFx0c3dpdGNoIChkYXRhLnR5cGUpIHtcblx0XHRcdFx0Y2FzZSBcInJlcXVlc3RcIjpcblx0XHRcdFx0XHRpZiAoZGF0YS5jaGFubmVsID09PSB0aGlzLl9uYW1lKSB0aGlzLl9oYW5kbGVSZXF1ZXN0KGRhdGEpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwicmVzcG9uc2VcIjpcblx0XHRcdFx0XHR0aGlzLl9oYW5kbGVSZXNwb25zZShkYXRhKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcImV2ZW50XCI6IGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwic2lnbmFsXCI6IHRoaXMuX2hhbmRsZVNpZ25hbChkYXRhKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0X2hhbmRsZVJlc3BvbnNlKGRhdGEpIHtcblx0XHRcdGNvbnN0IGlkID0gZGF0YS5yZXFJZCA/PyBkYXRhLmlkO1xuXHRcdFx0Y29uc3QgcmVzb2x2ZXJzID0gdGhpcy5fcGVuZGluZy5nZXQoaWQpO1xuXHRcdFx0aWYgKHJlc29sdmVycykge1xuXHRcdFx0XHR0aGlzLl9wZW5kaW5nLmRlbGV0ZShpZCk7XG5cdFx0XHRcdGlmIChkYXRhLnBheWxvYWQ/LmVycm9yKSByZXNvbHZlcnMucmVqZWN0KG5ldyBFcnJvcihkYXRhLnBheWxvYWQuZXJyb3IpKTtcblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0Y29uc3QgcmVzdWx0ID0gZGF0YS5wYXlsb2FkPy5yZXN1bHQ7XG5cdFx0XHRcdFx0Y29uc3QgZGVzY3JpcHRvciA9IGRhdGEucGF5bG9hZD8uZGVzY3JpcHRvcjtcblx0XHRcdFx0XHRpZiAocmVzdWx0ICE9PSBudWxsICYmIHJlc3VsdCAhPT0gdm9pZCAwKSByZXNvbHZlcnMucmVzb2x2ZShyZXN1bHQpO1xuXHRcdFx0XHRcdGVsc2UgaWYgKGRlc2NyaXB0b3IpIHJlc29sdmVycy5yZXNvbHZlKHRoaXMud3JhcERlc2NyaXB0b3IoZGVzY3JpcHRvciwgZGF0YS5zZW5kZXIpKTtcblx0XHRcdFx0XHRlbHNlIHJlc29sdmVycy5yZXNvbHZlKHZvaWQgMCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhpcy5fcmVzcG9uc2VzLm5leHQoe1xuXHRcdFx0XHRcdGlkLFxuXHRcdFx0XHRcdGNoYW5uZWw6IGRhdGEuY2hhbm5lbCxcblx0XHRcdFx0XHRzZW5kZXI6IGRhdGEuc2VuZGVyLFxuXHRcdFx0XHRcdHJlc3VsdDogZGF0YS5wYXlsb2FkPy5yZXN1bHQsXG5cdFx0XHRcdFx0ZGVzY3JpcHRvcjogZGF0YS5wYXlsb2FkPy5kZXNjcmlwdG9yLFxuXHRcdFx0XHRcdHRpbWVzdGFtcDogRGF0ZS5ub3coKVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9XG5cdFx0YXN5bmMgX2hhbmRsZVJlcXVlc3QoZGF0YSkge1xuXHRcdFx0Y29uc3QgcGF5bG9hZCA9IGRhdGEucGF5bG9hZDtcblx0XHRcdGlmICghcGF5bG9hZCkgcmV0dXJuO1xuXHRcdFx0Y29uc3QgeyBhY3Rpb24sIHBhdGgsIGFyZ3MsIHNlbmRlciB9ID0gcGF5bG9hZDtcblx0XHRcdGNvbnN0IHJlcUlkID0gZGF0YS5yZXFJZCA/PyBkYXRhLmlkO1xuXHRcdFx0dGhpcy5faW52b2NhdGlvbnMubmV4dCh7XG5cdFx0XHRcdGlkOiByZXFJZCxcblx0XHRcdFx0Y2hhbm5lbDogdGhpcy5fbmFtZSxcblx0XHRcdFx0c2VuZGVyLFxuXHRcdFx0XHRhY3Rpb24sXG5cdFx0XHRcdHBhdGgsXG5cdFx0XHRcdGFyZ3M6IGFyZ3MgPz8gW10sXG5cdFx0XHRcdHRpbWVzdGFtcDogRGF0ZS5ub3coKSxcblx0XHRcdFx0Y29udGV4dFR5cGU6IGRldGVjdEluY29taW5nQ29udGV4dFR5cGUoZGF0YSlcblx0XHRcdH0pO1xuXHRcdFx0Y29uc3QgeyByZXN1bHQsIHRvVHJhbnNmZXIsIG5ld1BhdGggfSA9IGF3YWl0IHRoaXMuX2V4ZWN1dGVBY3Rpb24oYWN0aW9uLCBwYXRoLCBhcmdzID8/IFtdLCBzZW5kZXIpO1xuXHRcdFx0YXdhaXQgdGhpcy5fc2VuZFJlc3BvbnNlKHJlcUlkLCBhY3Rpb24sIHNlbmRlciwgbmV3UGF0aCwgcmVzdWx0LCB0b1RyYW5zZmVyKTtcblx0XHR9XG5cdFx0YXN5bmMgX2V4ZWN1dGVBY3Rpb24oYWN0aW9uLCBwYXRoLCBhcmdzLCBzZW5kZXIpIHtcblx0XHRcdGNvbnN0IHsgcmVzdWx0LCB0b1RyYW5zZmVyLCBwYXRoOiBuZXdQYXRoIH0gPSBleGVjdXRlQWN0aW9uKGFjdGlvbiwgcGF0aCwgYXJncywge1xuXHRcdFx0XHRjaGFubmVsOiB0aGlzLl9uYW1lLFxuXHRcdFx0XHRzZW5kZXIsXG5cdFx0XHRcdHJlZmxlY3Q6IHRoaXMuX2NvbmZpZy5yZWZsZWN0XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHJlc3VsdDogYXdhaXQgcmVzdWx0LFxuXHRcdFx0XHR0b1RyYW5zZmVyLFxuXHRcdFx0XHRuZXdQYXRoXG5cdFx0XHR9O1xuXHRcdH1cblx0XHRhc3luYyBfc2VuZFJlc3BvbnNlKHJlcUlkLCBhY3Rpb24sIHNlbmRlciwgcGF0aCwgcmF3UmVzdWx0LCB0b1RyYW5zZmVyKSB7XG5cdFx0XHRjb25zdCB7IHJlc3BvbnNlOiBjb3JlUmVzcG9uc2UsIHRyYW5zZmVyIH0gPSBhd2FpdCBidWlsZFJlc3BvbnNlKHJlcUlkLCBhY3Rpb24sIHRoaXMuX25hbWUsIHNlbmRlciwgcGF0aCwgcmF3UmVzdWx0LCB0b1RyYW5zZmVyKTtcblx0XHRcdGNvbnN0IHJlc3BvbnNlID0ge1xuXHRcdFx0XHRpZDogcmVxSWQsXG5cdFx0XHRcdC4uLmNvcmVSZXNwb25zZSxcblx0XHRcdFx0dGltZXN0YW1wOiBEYXRlLm5vdygpLFxuXHRcdFx0XHR0cmFuc2ZlcmFibGU6IHRyYW5zZmVyXG5cdFx0XHR9O1xuXHRcdFx0dGhpcy5fc2VuZChzZW5kZXIsIHJlc3BvbnNlLCB0cmFuc2Zlcik7XG5cdFx0fVxuXHRcdF9oYW5kbGVTaWduYWwoZGF0YSkge1xuXHRcdFx0Y29uc3QgcGF5bG9hZCA9IGRhdGE/LnBheWxvYWQgPz8ge307XG5cdFx0XHRjb25zdCByZW1vdGVDaGFubmVsID0gcGF5bG9hZC5mcm9tID8/IGRhdGEuc2VuZGVyID8/IFwidW5rbm93blwiO1xuXHRcdFx0Y29uc3QgdHJhbnNwb3J0VHlwZSA9IGRhdGEudHJhbnNwb3J0VHlwZSA/PyB0aGlzLl90cmFuc3BvcnRzLmdldChkYXRhLmNoYW5uZWwpPy50cmFuc3BvcnRUeXBlID8/IFwiaW50ZXJuYWxcIjtcblx0XHRcdGNvbnN0IGNvbm5lY3Rpb24gPSB0aGlzLl9yZWdpc3RlckNvbm5lY3Rpb24oe1xuXHRcdFx0XHRsb2NhbENoYW5uZWw6IHRoaXMuX25hbWUsXG5cdFx0XHRcdHJlbW90ZUNoYW5uZWwsXG5cdFx0XHRcdHNlbmRlcjogZGF0YS5zZW5kZXIgPz8gcmVtb3RlQ2hhbm5lbCxcblx0XHRcdFx0dHJhbnNwb3J0VHlwZSxcblx0XHRcdFx0ZGlyZWN0aW9uOiBcImluY29taW5nXCJcblx0XHRcdH0pO1xuXHRcdFx0dGhpcy5fbWFya0Nvbm5lY3Rpb25Ob3RpZmllZChjb25uZWN0aW9uLCBwYXlsb2FkKTtcblx0XHR9XG5cdFx0X3JlZ2lzdGVyQ29ubmVjdGlvbihwYXJhbXMpIHtcblx0XHRcdHJldHVybiB0aGlzLl9jb25uZWN0aW9uUmVnaXN0cnkucmVnaXN0ZXIocGFyYW1zKTtcblx0XHR9XG5cdFx0X21hcmtDb25uZWN0aW9uTm90aWZpZWQoY29ubmVjdGlvbiwgcGF5bG9hZCkge1xuXHRcdFx0dGhpcy5fY29ubmVjdGlvblJlZ2lzdHJ5Lm1hcmtOb3RpZmllZChjb25uZWN0aW9uLCBwYXlsb2FkKTtcblx0XHR9XG5cdFx0X2VtaXRDb25uZWN0aW9uU2lnbmFsKGJpbmRpbmcsIHNpZ25hbFR5cGUsIHBheWxvYWQgPSB7fSkge1xuXHRcdFx0Y29uc3QgbWVzc2FnZSA9IHtcblx0XHRcdFx0aWQ6IFVVSUR2NCgpLFxuXHRcdFx0XHR0eXBlOiBcInNpZ25hbFwiLFxuXHRcdFx0XHRjaGFubmVsOiBiaW5kaW5nLnRhcmdldENoYW5uZWwsXG5cdFx0XHRcdHNlbmRlcjogdGhpcy5fbmFtZSxcblx0XHRcdFx0dHJhbnNwb3J0VHlwZTogYmluZGluZy50cmFuc3BvcnRUeXBlLFxuXHRcdFx0XHRwYXlsb2FkOiB7XG5cdFx0XHRcdFx0dHlwZTogc2lnbmFsVHlwZSxcblx0XHRcdFx0XHRmcm9tOiB0aGlzLl9uYW1lLFxuXHRcdFx0XHRcdHRvOiBiaW5kaW5nLnRhcmdldENoYW5uZWwsXG5cdFx0XHRcdFx0Li4ucGF5bG9hZFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR0aW1lc3RhbXA6IERhdGUubm93KClcblx0XHRcdH07XG5cdFx0XHQoYmluZGluZz8uc2VuZGVyID8/IGJpbmRpbmc/LnBvc3RNZXNzYWdlKT8uY2FsbChiaW5kaW5nLCBtZXNzYWdlKTtcblx0XHRcdGNvbnN0IGNvbm5lY3Rpb24gPSB0aGlzLl9yZWdpc3RlckNvbm5lY3Rpb24oe1xuXHRcdFx0XHRsb2NhbENoYW5uZWw6IHRoaXMuX25hbWUsXG5cdFx0XHRcdHJlbW90ZUNoYW5uZWw6IGJpbmRpbmcudGFyZ2V0Q2hhbm5lbCxcblx0XHRcdFx0c2VuZGVyOiB0aGlzLl9uYW1lLFxuXHRcdFx0XHR0cmFuc3BvcnRUeXBlOiBiaW5kaW5nLnRyYW5zcG9ydFR5cGUsXG5cdFx0XHRcdGRpcmVjdGlvbjogXCJvdXRnb2luZ1wiXG5cdFx0XHR9KTtcblx0XHRcdHRoaXMuX21hcmtDb25uZWN0aW9uTm90aWZpZWQoY29ubmVjdGlvbiwgbWVzc2FnZS5wYXlsb2FkKTtcblx0XHR9XG5cdFx0X3NlbmRTaWduYWxUb1RhcmdldCh0YXJnZXQsIHRyYW5zcG9ydFR5cGUsIHBheWxvYWQsIHNpZ25hbFR5cGUpIHtcblx0XHRcdGNvbnN0IG1lc3NhZ2UgPSB7XG5cdFx0XHRcdGlkOiBVVUlEdjQoKSxcblx0XHRcdFx0dHlwZTogXCJzaWduYWxcIixcblx0XHRcdFx0Y2hhbm5lbDogcGF5bG9hZC50byA/PyB0aGlzLl9uYW1lLFxuXHRcdFx0XHRzZW5kZXI6IHRoaXMuX25hbWUsXG5cdFx0XHRcdHRyYW5zcG9ydFR5cGUsXG5cdFx0XHRcdHBheWxvYWQ6IHtcblx0XHRcdFx0XHR0eXBlOiBzaWduYWxUeXBlLFxuXHRcdFx0XHRcdC4uLnBheWxvYWRcblx0XHRcdFx0fSxcblx0XHRcdFx0dGltZXN0YW1wOiBEYXRlLm5vdygpXG5cdFx0XHR9O1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0aWYgKHRyYW5zcG9ydFR5cGUgPT09IFwid2Vic29ja2V0XCIpIHtcblx0XHRcdFx0XHR0YXJnZXQ/LnNlbmQ/LihKU09OLnN0cmluZ2lmeShtZXNzYWdlKSk7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh0cmFuc3BvcnRUeXBlID09PSBcImNocm9tZS1ydW50aW1lXCIpIHtcblx0XHRcdFx0XHRjaHJvbWUucnVudGltZT8uc2VuZE1lc3NhZ2U/LihtZXNzYWdlKTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHRyYW5zcG9ydFR5cGUgPT09IFwiY2hyb21lLXRhYnNcIikge1xuXHRcdFx0XHRcdGNvbnN0IHRhYklkID0gcGF5bG9hZC50YWJJZDtcblx0XHRcdFx0XHRpZiAodGFiSWQgIT0gbnVsbCkgY2hyb21lLnRhYnM/LnNlbmRNZXNzYWdlPy4odGFiSWQsIG1lc3NhZ2UpO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodHJhbnNwb3J0VHlwZSA9PT0gXCJjaHJvbWUtcG9ydFwiKSB7XG5cdFx0XHRcdFx0dGFyZ2V0Py5wb3N0TWVzc2FnZT8uKG1lc3NhZ2UpO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodHJhbnNwb3J0VHlwZSA9PT0gXCJjaHJvbWUtZXh0ZXJuYWxcIikge1xuXHRcdFx0XHRcdGlmIChwYXlsb2FkLmV4dGVybmFsSWQpIGNocm9tZS5ydW50aW1lPy5zZW5kTWVzc2FnZT8uKHBheWxvYWQuZXh0ZXJuYWxJZCwgbWVzc2FnZSk7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRhcmdldD8ucG9zdE1lc3NhZ2U/LihtZXNzYWdlLCB7IHRyYW5zZmVyOiBbXSB9KTtcblx0XHRcdH0gY2F0Y2gge31cblx0XHR9XG5cdFx0X21hcmtBbGxDb25uZWN0aW9uc0Nsb3NlZCgpIHtcblx0XHRcdHRoaXMuX2Nvbm5lY3Rpb25SZWdpc3RyeS5jbG9zZUFsbCgpO1xuXHRcdH1cblx0XHRfY3JlYXRlVHJhbnNwb3J0QmluZGluZyh0YXJnZXQsIHRyYW5zcG9ydFR5cGUsIHRhcmdldENoYW5uZWwsIG9wdGlvbnMpIHtcblx0XHRcdGxldCBzZW5kZXI7XG5cdFx0XHRsZXQgY2xlYW51cDtcblx0XHRcdHN3aXRjaCAodHJhbnNwb3J0VHlwZSkge1xuXHRcdFx0XHRjYXNlIFwid29ya2VyXCI6XG5cdFx0XHRcdGNhc2UgXCJtZXNzYWdlLXBvcnRcIjpcblx0XHRcdFx0Y2FzZSBcImJyb2FkY2FzdFwiOlxuXHRcdFx0XHRcdGlmIChvcHRpb25zLmF1dG9TdGFydCAhPT0gZmFsc2UgJiYgdGFyZ2V0LnN0YXJ0KSB0YXJnZXQuc3RhcnQoKTtcblx0XHRcdFx0XHRzZW5kZXIgPSAobXNnLCB0cmFuc2ZlcikgPT4gdGFyZ2V0LnBvc3RNZXNzYWdlKG1zZywgeyB0cmFuc2ZlciB9KTtcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRjb25zdCBsaXN0ZW5lciA9ICgoZSkgPT4gdGhpcy5faGFuZGxlSW5jb21pbmcoZS5kYXRhKSk7XG5cdFx0XHRcdFx0XHR0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcj8uKFwibWVzc2FnZVwiLCBsaXN0ZW5lcik7XG5cdFx0XHRcdFx0XHRjbGVhbnVwID0gKCkgPT4gdGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXI/LihcIm1lc3NhZ2VcIiwgbGlzdGVuZXIpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcIndlYnNvY2tldFwiOlxuXHRcdFx0XHRcdHNlbmRlciA9IChtc2cpID0+IHRhcmdldC5zZW5kKEpTT04uc3RyaW5naWZ5KG1zZykpO1xuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGNvbnN0IGxpc3RlbmVyID0gKChlKSA9PiB7XG5cdFx0XHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5faGFuZGxlSW5jb21pbmcoSlNPTi5wYXJzZShlLmRhdGEpKTtcblx0XHRcdFx0XHRcdFx0fSBjYXRjaCB7fVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHR0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcj8uKFwibWVzc2FnZVwiLCBsaXN0ZW5lcik7XG5cdFx0XHRcdFx0XHRjbGVhbnVwID0gKCkgPT4gdGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXI/LihcIm1lc3NhZ2VcIiwgbGlzdGVuZXIpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcImNocm9tZS1ydW50aW1lXCI6XG5cdFx0XHRcdFx0c2VuZGVyID0gKG1zZykgPT4gY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UobXNnKTtcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRjb25zdCBsaXN0ZW5lciA9IChtc2cpID0+IHRoaXMuX2hhbmRsZUluY29taW5nKG1zZyk7XG5cdFx0XHRcdFx0XHRjaHJvbWUucnVudGltZS5vbk1lc3NhZ2U/LmFkZExpc3RlbmVyPy4obGlzdGVuZXIpO1xuXHRcdFx0XHRcdFx0Y2xlYW51cCA9ICgpID0+IGNocm9tZS5ydW50aW1lLm9uTWVzc2FnZT8ucmVtb3ZlTGlzdGVuZXI/LihsaXN0ZW5lcik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwiY2hyb21lLXRhYnNcIjpcblx0XHRcdFx0XHRzZW5kZXIgPSAobXNnKSA9PiB7XG5cdFx0XHRcdFx0XHRpZiAob3B0aW9ucy50YWJJZCAhPSBudWxsKSBjaHJvbWUudGFicz8uc2VuZE1lc3NhZ2U/LihvcHRpb25zLnRhYklkLCBtc2cpO1xuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0Y29uc3QgbGlzdGVuZXIgPSAobXNnLCBzZW5kZXJNZXRhKSA9PiB7XG5cdFx0XHRcdFx0XHRcdGlmIChvcHRpb25zLnRhYklkICE9IG51bGwgJiYgc2VuZGVyTWV0YT8udGFiPy5pZCAhPT0gb3B0aW9ucy50YWJJZCkgcmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdFx0XHR0aGlzLl9oYW5kbGVJbmNvbWluZyhtc2cpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRjaHJvbWUucnVudGltZS5vbk1lc3NhZ2U/LmFkZExpc3RlbmVyPy4obGlzdGVuZXIpO1xuXHRcdFx0XHRcdFx0Y2xlYW51cCA9ICgpID0+IGNocm9tZS5ydW50aW1lLm9uTWVzc2FnZT8ucmVtb3ZlTGlzdGVuZXI/LihsaXN0ZW5lcik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwiY2hyb21lLXBvcnRcIjpcblx0XHRcdFx0XHRpZiAodGFyZ2V0Py5wb3N0TWVzc2FnZSAmJiB0YXJnZXQ/Lm9uTWVzc2FnZT8uYWRkTGlzdGVuZXIpIHtcblx0XHRcdFx0XHRcdHNlbmRlciA9IChtc2cpID0+IHRhcmdldC5wb3N0TWVzc2FnZShtc2cpO1xuXHRcdFx0XHRcdFx0Y29uc3QgbGlzdGVuZXIgPSAobXNnKSA9PiB0aGlzLl9oYW5kbGVJbmNvbWluZyhtc2cpO1xuXHRcdFx0XHRcdFx0dGFyZ2V0Lm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihsaXN0ZW5lcik7XG5cdFx0XHRcdFx0XHRjbGVhbnVwID0gKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0XHRcdHRhcmdldC5vbk1lc3NhZ2UucmVtb3ZlTGlzdGVuZXIobGlzdGVuZXIpO1xuXHRcdFx0XHRcdFx0XHR9IGNhdGNoIHt9XG5cdFx0XHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRcdFx0dGFyZ2V0LmRpc2Nvbm5lY3Q/LigpO1xuXHRcdFx0XHRcdFx0XHR9IGNhdGNoIHt9XG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRjb25zdCBwb3J0TmFtZSA9IG9wdGlvbnMucG9ydE5hbWUgPz8gdGFyZ2V0Q2hhbm5lbDtcblx0XHRcdFx0XHRcdGNvbnN0IHBvcnQgPSBvcHRpb25zLnRhYklkICE9IG51bGwgJiYgY2hyb21lLnRhYnM/LmNvbm5lY3QgPyBjaHJvbWUudGFicy5jb25uZWN0KG9wdGlvbnMudGFiSWQsIHsgbmFtZTogcG9ydE5hbWUgfSkgOiBjaHJvbWUucnVudGltZS5jb25uZWN0KHsgbmFtZTogcG9ydE5hbWUgfSk7XG5cdFx0XHRcdFx0XHRzZW5kZXIgPSAobXNnKSA9PiBwb3J0LnBvc3RNZXNzYWdlKG1zZyk7XG5cdFx0XHRcdFx0XHRjb25zdCBsaXN0ZW5lciA9IChtc2cpID0+IHRoaXMuX2hhbmRsZUluY29taW5nKG1zZyk7XG5cdFx0XHRcdFx0XHRwb3J0Lm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihsaXN0ZW5lcik7XG5cdFx0XHRcdFx0XHRjbGVhbnVwID0gKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0XHRcdHBvcnQub25NZXNzYWdlLnJlbW92ZUxpc3RlbmVyKGxpc3RlbmVyKTtcblx0XHRcdFx0XHRcdFx0fSBjYXRjaCB7fVxuXHRcdFx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0XHRcdHBvcnQuZGlzY29ubmVjdCgpO1xuXHRcdFx0XHRcdFx0XHR9IGNhdGNoIHt9XG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcImNocm9tZS1leHRlcm5hbFwiOlxuXHRcdFx0XHRcdHNlbmRlciA9IChtc2cpID0+IHtcblx0XHRcdFx0XHRcdGlmIChvcHRpb25zLmV4dGVybmFsSWQpIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKG9wdGlvbnMuZXh0ZXJuYWxJZCwgbXNnKTtcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGNvbnN0IGxpc3RlbmVyID0gKG1zZykgPT4ge1xuXHRcdFx0XHRcdFx0XHR0aGlzLl9oYW5kbGVJbmNvbWluZyhtc2cpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRjaHJvbWUucnVudGltZS5vbk1lc3NhZ2VFeHRlcm5hbD8uYWRkTGlzdGVuZXI/LihsaXN0ZW5lcik7XG5cdFx0XHRcdFx0XHRjbGVhbnVwID0gKCkgPT4gY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlRXh0ZXJuYWw/LnJlbW92ZUxpc3RlbmVyPy4obGlzdGVuZXIpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcInNlbGZcIjpcblx0XHRcdFx0XHRzZW5kZXIgPSAobXNnLCB0cmFuc2ZlcikgPT4gZ2xvYmFsVGhpcy5wb3N0TWVzc2FnZT8uKG1zZywgeyB0cmFuc2ZlcjogdHJhbnNmZXIgPz8gW10gfSk7XG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0Y29uc3QgbGlzdGVuZXIgPSAoKGUpID0+IHRoaXMuX2hhbmRsZUluY29taW5nKGUuZGF0YSkpO1xuXHRcdFx0XHRcdFx0Z2xvYmFsVGhpcy5hZGRFdmVudExpc3RlbmVyPy4oXCJtZXNzYWdlXCIsIGxpc3RlbmVyKTtcblx0XHRcdFx0XHRcdGNsZWFudXAgPSAoKSA9PiBnbG9iYWxUaGlzLnJlbW92ZUV2ZW50TGlzdGVuZXI/LihcIm1lc3NhZ2VcIiwgbGlzdGVuZXIpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbk1lc3NhZ2UpIGNsZWFudXAgPSBvcHRpb25zLm9uTWVzc2FnZSgobXNnKSA9PiB0aGlzLl9oYW5kbGVJbmNvbWluZyhtc2cpKTtcblx0XHRcdFx0XHRzZW5kZXIgPSAobXNnKSA9PiB0YXJnZXQ/LnBvc3RNZXNzYWdlPy4obXNnKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHRhcmdldCxcblx0XHRcdFx0dGFyZ2V0Q2hhbm5lbCxcblx0XHRcdFx0dHJhbnNwb3J0VHlwZSxcblx0XHRcdFx0c2VuZGVyLFxuXHRcdFx0XHRjbGVhbnVwLFxuXHRcdFx0XHRwb3N0TWVzc2FnZTogKG1lc3NhZ2UsIG9wdGlvbnMpID0+IHNlbmRlcj8uKG1lc3NhZ2UsIG9wdGlvbnMpLFxuXHRcdFx0XHRzdGFydDogKCkgPT4gdGFyZ2V0Py5zdGFydD8uKCksXG5cdFx0XHRcdGNsb3NlOiAoKSA9PiB0YXJnZXQ/LmNsb3NlPy4oKVxuXHRcdFx0fTtcblx0XHR9XG5cdFx0X3NlbmQodGFyZ2V0Q2hhbm5lbCwgbWVzc2FnZSwgdHJhbnNmZXIpIHtcblx0XHRcdGNvbnN0IGJpbmRpbmcgPSB0aGlzLl90cmFuc3BvcnRzLmdldCh0YXJnZXRDaGFubmVsKSA/PyB0aGlzLl9kZWZhdWx0VHJhbnNwb3J0O1xuXHRcdFx0KGJpbmRpbmc/LnNlbmRlciA/PyBiaW5kaW5nPy5wb3N0TWVzc2FnZSk/LmNhbGwoYmluZGluZywgbWVzc2FnZSwgdHJhbnNmZXIpO1xuXHRcdH1cblx0XHRfZ2V0RGVmYXVsdFRhcmdldCgpIHtcblx0XHRcdGlmICh0aGlzLl9kZWZhdWx0VHJhbnNwb3J0KSByZXR1cm4gdGhpcy5fZGVmYXVsdFRyYW5zcG9ydC50YXJnZXRDaGFubmVsO1xuXHRcdFx0cmV0dXJuIFwid29ya2VyXCI7XG5cdFx0fVxuXHRcdF9pbmZlclRhcmdldENoYW5uZWwodGFyZ2V0LCB0cmFuc3BvcnRUeXBlKSB7XG5cdFx0XHRpZiAodHJhbnNwb3J0VHlwZSA9PT0gXCJ3b3JrZXJcIikgcmV0dXJuIFwid29ya2VyXCI7XG5cdFx0XHRpZiAodHJhbnNwb3J0VHlwZSA9PT0gXCJicm9hZGNhc3RcIiAmJiB0YXJnZXQubmFtZSkgcmV0dXJuIHRhcmdldC5uYW1lO1xuXHRcdFx0aWYgKHRyYW5zcG9ydFR5cGUgPT09IFwic2VsZlwiKSByZXR1cm4gXCJzZWxmXCI7XG5cdFx0XHRyZXR1cm4gYCR7dHJhbnNwb3J0VHlwZX0tJHtVVUlEdjQoKS5zbGljZSgwLCA4KX1gO1xuXHRcdH1cblx0XHRfY3JlYXRlUHJveHkodGFyZ2V0Q2hhbm5lbCwgYmFzZVBhdGgpIHtcblx0XHRcdGNvbnN0IGludm9rZXIgPSAoYWN0aW9uLCBwYXRoLCBhcmdzKSA9PiB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmludm9rZSh0YXJnZXRDaGFubmVsLCBhY3Rpb24sIHBhdGgsIGFyZ3MpO1xuXHRcdFx0fTtcblx0XHRcdHJldHVybiBjcmVhdGVSZW1vdGVQcm94eShpbnZva2VyLCB7XG5cdFx0XHRcdGNoYW5uZWw6IHRhcmdldENoYW5uZWwsXG5cdFx0XHRcdGJhc2VQYXRoLFxuXHRcdFx0XHRjYWNoZTogdHJ1ZSxcblx0XHRcdFx0dGltZW91dDogdGhpcy5fY29uZmlnLnRpbWVvdXRcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRfaXNXb3JrZXJDb250ZXh0KCkge1xuXHRcdFx0cmV0dXJuIFtcblx0XHRcdFx0XCJ3b3JrZXJcIixcblx0XHRcdFx0XCJzaGFyZWQtd29ya2VyXCIsXG5cdFx0XHRcdFwic2VydmljZS13b3JrZXJcIlxuXHRcdFx0XS5pbmNsdWRlcyh0aGlzLl9jb250ZXh0VHlwZSk7XG5cdFx0fVxuXHR9O1xuXHQvKipcblx0KiBDcmVhdGUgYSB1bmlmaWVkIGNoYW5uZWxcblx0KlxuXHQqIEBleGFtcGxlXG5cdCogLy8gSW4gd29ya2VyXG5cdCogY29uc3QgY2hhbm5lbCA9IGNyZWF0ZVVuaWZpZWRDaGFubmVsKFwid29ya2VyXCIpO1xuXHQqIGNoYW5uZWwuZXhwb3NlKFwiY2FsY1wiLCB7IGFkZDogKGEsIGIpID0+IGEgKyBiIH0pO1xuXHQqXG5cdCogLy8gSW4gaG9zdFxuXHQqIGNvbnN0IGNoYW5uZWwgPSBjcmVhdGVVbmlmaWVkQ2hhbm5lbChcImhvc3RcIik7XG5cdCogY2hhbm5lbC5jb25uZWN0KHdvcmtlcik7XG5cdCogY29uc3QgY2FsYyA9IGNoYW5uZWwucHJveHkoXCJ3b3JrZXJcIiwgW1wiY2FsY1wiXSk7XG5cdCogYXdhaXQgY2FsYy5hZGQoMiwgMyk7IC8vIDVcblx0Ki9cblx0ZnVuY3Rpb24gY3JlYXRlVW5pZmllZENoYW5uZWwoY29uZmlnKSB7XG5cdFx0cmV0dXJuIG5ldyBVbmlmaWVkQ2hhbm5lbChjb25maWcpO1xuXHR9XG5cdGxldCBXT1JLRVJfQ0hBTk5FTCA9IG51bGw7XG5cdC8qKlxuXHQqIEdldCB0aGUgd29ya2VyJ3MgdW5pZmllZCBjaGFubmVsIChhdXRvLWNyZWF0ZWQgaW4gd29ya2VyIGNvbnRleHQpXG5cdCovXG5cdGZ1bmN0aW9uIGdldFdvcmtlckNoYW5uZWwoKSB7XG5cdFx0aWYgKCFXT1JLRVJfQ0hBTk5FTCkge1xuXHRcdFx0Y29uc3QgY29udGV4dFR5cGUgPSBkZXRlY3RDb250ZXh0VHlwZSgpO1xuXHRcdFx0aWYgKFtcblx0XHRcdFx0XCJ3b3JrZXJcIixcblx0XHRcdFx0XCJzaGFyZWQtd29ya2VyXCIsXG5cdFx0XHRcdFwic2VydmljZS13b3JrZXJcIlxuXHRcdFx0XS5pbmNsdWRlcyhjb250ZXh0VHlwZSkpIFdPUktFUl9DSEFOTkVMID0gY3JlYXRlVW5pZmllZENoYW5uZWwoe1xuXHRcdFx0XHRuYW1lOiBcIndvcmtlclwiLFxuXHRcdFx0XHRhdXRvTGlzdGVuOiB0cnVlXG5cdFx0XHR9KTtcblx0XHRcdGVsc2UgV09SS0VSX0NIQU5ORUwgPSBjcmVhdGVVbmlmaWVkQ2hhbm5lbCh7XG5cdFx0XHRcdG5hbWU6IFwiaG9zdFwiLFxuXHRcdFx0XHRhdXRvTGlzdGVuOiBmYWxzZVxuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdHJldHVybiBXT1JLRVJfQ0hBTk5FTDtcblx0fVxuXG4vLyAuLi91bmlmb3JtLnRzL3NyYy9uZXdlci9jb3JlL0FsaWFzLnRzXG5cdGNvbnN0IFRTID0ge1xuXHRcdHJqYjogXCJyZWplY3RCeVwiLFxuXHRcdHJ2YjogXCJyZXNvbHZlQnlcIixcblx0XHRyajogXCJyZWplY3RcIixcblx0XHRydjogXCJyZXNvbHZlXCIsXG5cdFx0Y3I6IFwiY3JlYXRlXCIsXG5cdFx0Y3M6IFwiY3JlYXRlU3luY1wiLFxuXHRcdGE6IFwiYXJyYXlcIixcblx0XHR0YTogXCJ0eXBlZGFycmF5XCIsXG5cdFx0dWRmOiBcInVuZGVmaW5lZFwiXG5cdH07XG5cbi8vIC4uL3VuaWZvcm0udHMvc3JjL25ld2VyL2NvcmUvVXNlZnVsLnRzXG5cdGNvbnN0IFRyYW5zZmVyYWJsZSA9IFtcblx0XHR0eXBlb2YgQXJyYXlCdWZmZXIgIT0gVFMudWRmID8gQXJyYXlCdWZmZXIgOiBudWxsLFxuXHRcdHR5cGVvZiBNZXNzYWdlUG9ydCAhPSBUUy51ZGYgPyBNZXNzYWdlUG9ydCA6IG51bGwsXG5cdFx0dHlwZW9mIFJlYWRhYmxlU3RyZWFtICE9IFRTLnVkZiA/IFJlYWRhYmxlU3RyZWFtIDogbnVsbCxcblx0XHR0eXBlb2YgV3JpdGFibGVTdHJlYW0gIT0gVFMudWRmID8gV3JpdGFibGVTdHJlYW0gOiBudWxsLFxuXHRcdHR5cGVvZiBUcmFuc2Zvcm1TdHJlYW0gIT0gVFMudWRmID8gVHJhbnNmb3JtU3RyZWFtIDogbnVsbCxcblx0XHR0eXBlb2YgV2ViVHJhbnNwb3J0UmVjZWl2ZVN0cmVhbSAhPSBUUy51ZGYgPyBXZWJUcmFuc3BvcnRSZWNlaXZlU3RyZWFtIDogbnVsbCxcblx0XHR0eXBlb2YgV2ViVHJhbnNwb3J0U2VuZFN0cmVhbSAhPSBUUy51ZGYgPyBXZWJUcmFuc3BvcnRTZW5kU3RyZWFtIDogbnVsbCxcblx0XHR0eXBlb2YgQXVkaW9EYXRhICE9IFRTLnVkZiA/IEF1ZGlvRGF0YSA6IG51bGwsXG5cdFx0dHlwZW9mIEltYWdlQml0bWFwICE9IFRTLnVkZiA/IEltYWdlQml0bWFwIDogbnVsbCxcblx0XHR0eXBlb2YgVmlkZW9GcmFtZSAhPSBUUy51ZGYgPyBWaWRlb0ZyYW1lIDogbnVsbCxcblx0XHR0eXBlb2YgT2Zmc2NyZWVuQ2FudmFzICE9IFRTLnVkZiA/IE9mZnNjcmVlbkNhbnZhcyA6IG51bGwsXG5cdFx0dHlwZW9mIFJUQ0RhdGFDaGFubmVsICE9IFRTLnVkZiA/IFJUQ0RhdGFDaGFubmVsIDogbnVsbFxuXHRdLmZpbHRlcigoRSkgPT4gRSAhPSBudWxsKTtcblxuLy8gLi4vdW5pZm9ybS50cy9zcmMvbmV3ZXIvbmV4dC91dGlscy9FbnYudHNcbi8qKlxuXHQqIEJhc2UgVVJMIGZvciBgbmV3IFVSTCh3b3JrZXJQYXRoLCBiYXNlKWAgd2hlbiBzcGF3bmluZyB3b3JrZXJzIGZyb20gYSBzdHJpbmcgc3BlY2lmaWVyLlxuXHQqXG5cdCogUHJlZmVyIGBXb3JrZXJHbG9iYWxTY29wZWAgLyBgd2luZG93YCBVUkxzIHNvIHRoaXMgbW9kdWxlIHN0YXlzICoqYGltcG9ydC5tZXRhYC1mcmVlKiouXG5cdCogSW5jbHVkaW5nIGBpbXBvcnQubWV0YS51cmxgIGFueXdoZXJlIGluIHRoZSB1bmlmb3JtIGdyYXBoIHRyaXBzIFJvbGxkb3duJ3MgYEVNUFRZX0lNUE9SVF9NRVRBYFxuXHQqIHdoZW4gdGhlIFBXQSBzZXJ2aWNlIHdvcmtlciBpcyBidWlsdCBhcyBJSUZFIChgdml0ZS1wbHVnaW4tcHdhYCBpbmplY3RNYW5pZmVzdCkuXG5cdCpcblx0KiBEZWRpY2F0ZWQgd29ya2VyIHRocmVhZHMgZXhwb3NlIGBnbG9iYWxUaGlzLmxvY2F0aW9uYCBhdCB0aGUgd29ya2VyIHNjcmlwdCBVUkw7IE1WMyBTVyBleHBvc2VzIHRoZVxuXHQqL1xuXHRmdW5jdGlvbiBnZXRXb3JrZXJSZXNvbHZlQmFzZVVybCgpIHtcblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgaHJlZiA9IGdsb2JhbFRoaXMubG9jYXRpb24/LmhyZWY7XG5cdFx0XHRpZiAodHlwZW9mIGhyZWYgPT09IFwic3RyaW5nXCIgJiYgaHJlZi5sZW5ndGggPiAwKSByZXR1cm4gaHJlZjtcblx0XHR9IGNhdGNoIHt9XG5cdFx0dHJ5IHtcblx0XHRcdGlmICh0eXBlb2YgZG9jdW1lbnQgIT09IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mIGRvY3VtZW50LmJhc2VVUkkgPT09IFwic3RyaW5nXCIgJiYgZG9jdW1lbnQuYmFzZVVSSS5sZW5ndGggPiAwKSByZXR1cm4gZG9jdW1lbnQuYmFzZVVSSTtcblx0XHR9IGNhdGNoIHt9XG5cdFx0cmV0dXJuIFwiXCI7XG5cdH1cblx0LyoqIFJlc29sdmVkIGFic29sdXRlIGhyZWYgZm9yIGAuL3hgL2AveGAvYWJzb2x1dGUgd29ya2VyIHNwZWNpZmllcnMgKGRlbGVnYXRlcyB0cmFpbGluZyBgL2Agbm9ybWFsaXphdGlvbiB0byBjYWxsZXJzKS4gKi9cblx0ZnVuY3Rpb24gcmVzb2x2ZVdvcmtlclNwZWNpZmllckhyZWYoc3BlYykge1xuXHRcdGNvbnN0IGJhc2UgPSBnZXRXb3JrZXJSZXNvbHZlQmFzZVVybCgpO1xuXHRcdGlmICghYmFzZS5sZW5ndGgpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJbdW5pZm9ybV0gTm8gYmFzZSBVUkwgZm9yIHdvcmtlciByZXNvbHV0aW9uIChtaXNzaW5nIGxvY2F0aW9uIC8gZG9jdW1lbnQuYmFzZVVSSSlcIik7XG5cdFx0Y29uc3Qgbm9ybWFsaXplZCA9IHNwZWMuc3RhcnRzV2l0aChcIi9cIikgPyBzcGVjLnJlcGxhY2UoL15cXC8vLCBcIi4vXCIpIDogc3BlYztcblx0XHRyZXR1cm4gbmV3IFVSTChub3JtYWxpemVkLCBiYXNlKS5ocmVmO1xuXHR9XG5cbi8vIC4uL3VuaWZvcm0udHMvc3JjL25ld2VyL25leHQvY2hhbm5lbC9DaGFubmVscy50c1xuXHRjb25zdCBTRUxGX0NIQU5ORUwgPSB7XG5cdFx0bmFtZTogXCJ1bmtub3duXCIsXG5cdFx0aW5zdGFuY2U6IG51bGxcblx0fTtcblx0Y29uc3QgQ0hBTk5FTF9NQVAgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuXHRjb25zdCBpc1JlZmxlY3RBY3Rpb24kMSA9IChhY3Rpb24pID0+IFsuLi5PYmplY3QudmFsdWVzKFdSZWZsZWN0QWN0aW9uKV0uaW5jbHVkZXMoYWN0aW9uKTtcblx0LyoqIEBkZXByZWNhdGVkIFVzZSBVbmlmaWVkQ2hhbm5lbC5yZW1vdGUoKSBpbnN0ZWFkICovXG5cdHZhciBSZW1vdGVDaGFubmVsSGVscGVyJDEgPSBjbGFzcyB7XG5cdFx0Y2hhbm5lbE5hbWU7XG5cdFx0b3B0aW9ucztcblx0XHRfY2hhbm5lbDtcblx0XHRjb25zdHJ1Y3RvcihjaGFubmVsTmFtZSwgb3B0aW9ucyA9IHt9KSB7XG5cdFx0XHR0aGlzLmNoYW5uZWxOYW1lID0gY2hhbm5lbE5hbWU7XG5cdFx0XHR0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuXHRcdFx0dGhpcy5fY2hhbm5lbCA9IGdldFdvcmtlckNoYW5uZWwoKTtcblx0XHR9XG5cdFx0cmVxdWVzdChwYXRoLCBhY3Rpb24sIGFyZ3MsIG9wdGlvbnMgPSB7fSkge1xuXHRcdFx0aWYgKHR5cGVvZiBwYXRoID09PSBcInN0cmluZ1wiKSBwYXRoID0gW3BhdGhdO1xuXHRcdFx0aWYgKEFycmF5LmlzQXJyYXkoYWN0aW9uKSAmJiBpc1JlZmxlY3RBY3Rpb24kMShwYXRoKSkge1xuXHRcdFx0XHRvcHRpb25zID0gYXJncztcblx0XHRcdFx0YXJncyA9IGFjdGlvbjtcblx0XHRcdFx0YWN0aW9uID0gcGF0aDtcblx0XHRcdFx0cGF0aCA9IFtdO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXMuX2NoYW5uZWwuaW52b2tlKHRoaXMuY2hhbm5lbE5hbWUsIGFjdGlvbiwgcGF0aCwgYXJncyk7XG5cdFx0fVxuXHRcdGRvSW1wb3J0TW9kdWxlKHVybCwgb3B0aW9ucykge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2NoYW5uZWwuaW1wb3J0KHVybCwgdGhpcy5jaGFubmVsTmFtZSk7XG5cdFx0fVxuXHR9O1xuXHQvKiogQGRlcHJlY2F0ZWQgVXNlIFVuaWZpZWRDaGFubmVsIGluc3RlYWQgKi9cblx0dmFyIENoYW5uZWxIYW5kbGVyJDEgPSBjbGFzcyB7XG5cdFx0Y2hhbm5lbDtcblx0XHRvcHRpb25zO1xuXHRcdF91bmlmaWVkO1xuXHRcdGJyb2FkY2FzdHMgPSB7fTtcblx0XHRjb25zdHJ1Y3RvcihjaGFubmVsLCBvcHRpb25zID0ge30pIHtcblx0XHRcdHRoaXMuY2hhbm5lbCA9IGNoYW5uZWw7XG5cdFx0XHR0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuXHRcdFx0dGhpcy5fdW5pZmllZCA9IGNyZWF0ZVVuaWZpZWRDaGFubmVsKHtcblx0XHRcdFx0bmFtZTogY2hhbm5lbCxcblx0XHRcdFx0YXV0b0xpc3RlbjogZmFsc2Vcblx0XHRcdH0pO1xuXHRcdFx0U0VMRl9DSEFOTkVMLm5hbWUgPSBjaGFubmVsO1xuXHRcdFx0U0VMRl9DSEFOTkVMLmluc3RhbmNlID0gdGhpcztcblx0XHR9XG5cdFx0Y3JlYXRlUmVtb3RlQ2hhbm5lbChjaGFubmVsLCBvcHRpb25zID0ge30sIGJyb2FkY2FzdCkge1xuXHRcdFx0aWYgKGJyb2FkY2FzdCkge1xuXHRcdFx0XHR0aGlzLl91bmlmaWVkLmF0dGFjaChicm9hZGNhc3QsIHsgdGFyZ2V0Q2hhbm5lbDogY2hhbm5lbCB9KTtcblx0XHRcdFx0dGhpcy5icm9hZGNhc3RzW2NoYW5uZWxdID0gYnJvYWRjYXN0O1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZShuZXcgUmVtb3RlQ2hhbm5lbEhlbHBlciQxKGNoYW5uZWwsIG9wdGlvbnMpKTtcblx0XHR9XG5cdFx0Z2V0Q2hhbm5lbCgpIHtcblx0XHRcdHJldHVybiB0aGlzLmNoYW5uZWw7XG5cdFx0fVxuXHRcdHJlcXVlc3QocGF0aCwgYWN0aW9uLCBhcmdzLCBvcHRpb25zID0ge30sIHRvQ2hhbm5lbCA9IFwid29ya2VyXCIpIHtcblx0XHRcdGlmICh0eXBlb2YgcGF0aCA9PT0gXCJzdHJpbmdcIikgcGF0aCA9IFtwYXRoXTtcblx0XHRcdGlmIChBcnJheS5pc0FycmF5KGFjdGlvbikgJiYgaXNSZWZsZWN0QWN0aW9uJDEocGF0aCkpIHtcblx0XHRcdFx0dG9DaGFubmVsID0gb3B0aW9ucztcblx0XHRcdFx0b3B0aW9ucyA9IGFyZ3M7XG5cdFx0XHRcdGFyZ3MgPSBhY3Rpb247XG5cdFx0XHRcdGFjdGlvbiA9IHBhdGg7XG5cdFx0XHRcdHBhdGggPSBbXTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzLl91bmlmaWVkLmludm9rZSh0b0NoYW5uZWwsIGFjdGlvbiwgcGF0aCwgYXJncyk7XG5cdFx0fVxuXHRcdHJlc29sdmVSZXNwb25zZShyZXFJZCwgcmVzdWx0KSB7XG5cdFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHJlc3VsdCk7XG5cdFx0fVxuXHRcdGFzeW5jIGhhbmRsZUFuZFJlc3BvbnNlKHJlcXVlc3QsIHJlcUlkLCByZXNwb25zZUZuKSB7XG5cdFx0XHRjb25zdCByZXN1bHQgPSBhd2FpdCBoYW5kbGVSZXF1ZXN0KHJlcXVlc3QsIHJlcUlkLCB0aGlzLmNoYW5uZWwpO1xuXHRcdFx0aWYgKCFyZXN1bHQpIHJldHVybjtcblx0XHRcdHJlc3BvbnNlRm4/LihyZXN1bHQucmVzcG9uc2UsIHJlc3VsdC50cmFuc2Zlcik7XG5cdFx0fVxuXHRcdGNsb3NlKCkge1xuXHRcdFx0dGhpcy5fdW5pZmllZC5jbG9zZSgpO1xuXHRcdH1cblx0fTtcblx0LyoqIEBkZXByZWNhdGVkIFVzZSBjcmVhdGVVbmlmaWVkQ2hhbm5lbCBpbnN0ZWFkICovXG5cdGNvbnN0IGluaXRDaGFubmVsSGFuZGxlciA9IChjaGFubmVsID0gXCIkaG9zdCRcIikgPT4ge1xuXHRcdGlmIChTRUxGX0NIQU5ORUw/Lmluc3RhbmNlICYmIGNoYW5uZWwgPT09IFwiJGhvc3QkXCIpIHJldHVybiBTRUxGX0NIQU5ORUwuaW5zdGFuY2U7XG5cdFx0aWYgKENIQU5ORUxfTUFQLmhhcyhjaGFubmVsKSkgcmV0dXJuIENIQU5ORUxfTUFQLmdldChjaGFubmVsKSA/PyBudWxsO1xuXHRcdGNvbnN0ICRjaGFubmVsID0gbmV3IENoYW5uZWxIYW5kbGVyJDEoY2hhbm5lbCk7XG5cdFx0aWYgKGNoYW5uZWwgPT09IFwiJGhvc3QkXCIpIHtcblx0XHRcdFNFTEZfQ0hBTk5FTC5uYW1lID0gY2hhbm5lbDtcblx0XHRcdFNFTEZfQ0hBTk5FTC5pbnN0YW5jZSA9ICRjaGFubmVsO1xuXHRcdH1cblx0XHRDSEFOTkVMX01BUC5zZXQoY2hhbm5lbCwgJGNoYW5uZWwpO1xuXHRcdHJldHVybiAkY2hhbm5lbDtcblx0fTtcblxuLy8gLi4vdW5pZm9ybS50cy9zcmMvbmV3ZXIvbmV4dC9zdG9yYWdlL0RhdGFCYXNlLnRzXG5cdGNvbnN0IGhhbmRNYXAgPSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcblx0Y29uc3Qgd3JhcE1hcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xuXHRjb25zdCBkZXNjTWFwID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG5cdGNvbnN0IG9iamVjdFRvUmVmID0gKG9iaiwgY2hhbm5lbCA9IFNFTEZfQ0hBTk5FTD8ubmFtZSwgdG9UcmFuc2ZlcikgPT4ge1xuXHRcdGlmICh0eXBlb2Ygb2JqID09IFwib2JqZWN0XCIgJiYgb2JqICE9IG51bGwgfHwgdHlwZW9mIG9iaiA9PSBcImZ1bmN0aW9uXCIgJiYgb2JqICE9IG51bGwpIHtcblx0XHRcdGlmICh3cmFwTWFwLmhhcyhvYmopKSByZXR1cm4gd3JhcE1hcC5nZXQob2JqKTtcblx0XHRcdGlmIChoYW5kTWFwLmhhcyhvYmopKSByZXR1cm4gaGFuZE1hcC5nZXQob2JqKTtcblx0XHRcdGlmIChpc05vdENvbXBsZXhBcnJheShvYmopKSByZXR1cm4gb2JqO1xuXHRcdFx0aWYgKHRvVHJhbnNmZXI/LmluY2x1ZGVzPy4ob2JqKSkgcmV0dXJuIG9iajtcblx0XHRcdGlmIChjaGFubmVsID09IFNFTEZfQ0hBTk5FTD8ubmFtZSkgcmV0dXJuIG9iajtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdCRpc0Rlc2NyaXB0b3I6IHRydWUsXG5cdFx0XHRcdHBhdGg6IHJlZ2lzdGVyZWRJblBhdGguZ2V0KG9iaikgPz8gKCgpID0+IHtcblx0XHRcdFx0XHRjb25zdCBwYXRoID0gW1VVSUR2NCgpXTtcblx0XHRcdFx0XHR3cml0ZUJ5UGF0aChwYXRoLCBvYmopO1xuXHRcdFx0XHRcdHJldHVybiBwYXRoO1xuXHRcdFx0XHR9KSgpLFxuXHRcdFx0XHRvd25lcjogU0VMRl9DSEFOTkVMPy5uYW1lLFxuXHRcdFx0XHRjaGFubmVsLFxuXHRcdFx0XHRwcmltaXRpdmU6IGlzUHJpbWl0aXZlKG9iaiksXG5cdFx0XHRcdHdyaXRhYmxlOiB0cnVlLFxuXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdFx0XHRjb25maWd1cmFibGU6IHRydWUsXG5cdFx0XHRcdGFyZ3VtZW50Q291bnQ6IG9iaiBpbnN0YW5jZW9mIEZ1bmN0aW9uID8gb2JqLmxlbmd0aCA6IC0xXG5cdFx0XHR9O1xuXHRcdH1cblx0XHRyZXR1cm4gaXNDYW5KdXN0UmV0dXJuKG9iaikgPyBvYmogOiBudWxsO1xuXHR9O1xuXHRjb25zdCAkcmVxdWVzdEhhbmRsZXIgPSBTeW1ib2wuZm9yKFwiQHJlcXVlc3RIYW5kbGVyXCIpO1xuXHRjb25zdCAkZGVzY3JpcHRvciA9IFN5bWJvbC5mb3IoXCJAZGVzY3JpcHRvclwiKTtcblx0Y29uc3Qgbm9ybWFsaXplUmVmID0gKHYpID0+IHtcblx0XHRpZiAoaXNDYW5KdXN0UmV0dXJuKHYpKSByZXR1cm4gdjtcblx0XHRpZiAodj8uWyRkZXNjcmlwdG9yXSkgcmV0dXJuIHY7XG5cdFx0aWYgKHY/LiRpc0Rlc2NyaXB0b3IpIHJldHVybiBtYWtlUmVxdWVzdFByb3h5KHYsIGFzeW5jICgpID0+IHZvaWQgMCk7XG5cdFx0aWYgKGlzTm90Q29tcGxleEFycmF5KHYpKSByZXR1cm4gdjtcblx0XHRyZXR1cm4gbnVsbDtcblx0fTtcblx0Y29uc3Qgc3RvcmVkRGF0YSA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG5cdGNvbnN0IHJlZ2lzdGVyZWRJblBhdGggPSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcblx0Y29uc3QgdHJhdmVyc2VCeVBhdGggPSAob2JqLCBwYXRoKSA9PiB7XG5cdFx0aWYgKHBhdGggIT0gbnVsbCAmJiAhQXJyYXkuaXNBcnJheShwYXRoKSkgcGF0aCA9IFtwYXRoXTtcblx0XHRpZiAocGF0aCA9PSBudWxsIHx8IHBhdGg/Lmxlbmd0aCA8IDEpIHJldHVybiBvYmo7XG5cdFx0Y29uc3QgJGRlc2MgPSBvYmo/LlskZGVzY3JpcHRvcl0gPz8gKG9iaj8uJGlzRGVzY3JpcHRvciA/IG9iaiA6IG51bGwpO1xuXHRcdGlmICgkZGVzYyAmJiAkZGVzYz8ub3duZXIgPT0gU0VMRl9DSEFOTkVMPy5uYW1lKSBvYmogPSByZWFkQnlQYXRoKCRkZXNjPy5wYXRoKSA/PyBvYmo7XG5cdFx0aWYgKGlzUHJpbWl0aXZlKG9iaikpIHJldHVybiBvYmo7XG5cdFx0Zm9yIChjb25zdCBrZXkgb2YgcGF0aCkge1xuXHRcdFx0b2JqID0gb2JqPy5ba2V5XTtcblx0XHRcdGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIG9iajtcblx0XHR9XG5cdFx0cmV0dXJuIG9iajtcblx0fTtcblx0Y29uc3QgcmVhZEJ5UGF0aCA9IChwYXRoKSA9PiB7XG5cdFx0aWYgKHBhdGggIT0gbnVsbCAmJiAhQXJyYXkuaXNBcnJheShwYXRoKSkgcGF0aCA9IFtwYXRoXTtcblx0XHRpZiAocGF0aCA9PSBudWxsIHx8IHBhdGg/Lmxlbmd0aCA8IDEpIHJldHVybiBudWxsO1xuXHRcdGNvbnN0IHJvb3QgPSBzdG9yZWREYXRhPy5nZXQ/LihwYXRoPy5bMF0pID8/IG51bGw7XG5cdFx0cmV0dXJuIHJvb3QgIT0gbnVsbCA/IHRyYXZlcnNlQnlQYXRoKHJvb3QsIHBhdGg/LnNsaWNlPy4oMSkpIDogbnVsbDtcblx0fTtcblx0Y29uc3Qgd3JpdGVCeVBhdGggPSAocGF0aCwgZGF0YSkgPT4ge1xuXHRcdGNvbnN0ICRkZXNjID0gZGF0YT8uWyRkZXNjcmlwdG9yXSA/PyAoZGF0YT8uJGlzRGVzY3JpcHRvciA/IGRhdGEgOiBudWxsKTtcblx0XHRpZiAoJGRlc2MgJiYgJGRlc2M/Lm93bmVyID09IFNFTEZfQ0hBTk5FTD8ubmFtZSkgZGF0YSA9IHJlYWRCeVBhdGgoJGRlc2M/LnBhdGgpID8/IGRhdGE7XG5cdFx0aWYgKHBhdGggIT0gbnVsbCAmJiAhQXJyYXkuaXNBcnJheShwYXRoKSkgcGF0aCA9IFtwYXRoXTtcblx0XHRpZiAocGF0aCA9PSBudWxsIHx8IHBhdGg/Lmxlbmd0aCA8IDEpIHJldHVybiBudWxsO1xuXHRcdGNvbnN0IHJvb3QgPSBzdG9yZWREYXRhPy5nZXQ/LihwYXRoPy5bMF0pID8/IG51bGw7XG5cdFx0aWYgKHBhdGg/Lmxlbmd0aCA+IDEpIHRyYXZlcnNlQnlQYXRoKHJvb3QsIHBhdGg/LnNsaWNlPy4oMSwgLTEpKVtwYXRoPy5bcGF0aD8ubGVuZ3RoIC0gMV1dID0gZGF0YTtcblx0XHRlbHNlIHN0b3JlZERhdGE/LnNldD8uKHBhdGg/LlswXSwgZGF0YSk7XG5cdFx0aWYgKHR5cGVvZiBkYXRhID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGRhdGEgPT0gXCJmdW5jdGlvblwiKSByZWdpc3RlcmVkSW5QYXRoPy5zZXQ/LihkYXRhLCBwYXRoKTtcblx0XHRyZXR1cm4gZGF0YTtcblx0fTtcblx0Y29uc3QgcmVtb3ZlQnlQYXRoID0gKHBhdGgpID0+IHtcblx0XHRpZiAocGF0aCAhPSBudWxsICYmICFBcnJheS5pc0FycmF5KHBhdGgpKSBwYXRoID0gW3BhdGhdO1xuXHRcdGlmIChwYXRoID09IG51bGwgfHwgcGF0aD8ubGVuZ3RoIDwgMSkgcmV0dXJuIGZhbHNlO1xuXHRcdGlmICghKHN0b3JlZERhdGE/LmdldD8uKHBhdGg/LlswXSkgPz8gbnVsbCkgJiYgcGF0aD8ubGVuZ3RoIDw9IDEpIHtcblx0XHRcdHN0b3JlZERhdGE/LmRlbGV0ZT8uKHBhdGg/LlswXSk7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9IGVsc2UgcmV0dXJuIGZhbHNlO1xuXHR9O1xuXHRjb25zdCByZW1vdmVCeURhdGEgPSAoZGF0YSkgPT4ge1xuXHRcdGNvbnN0ICRkZXNjID0gZGF0YT8uWyRkZXNjcmlwdG9yXSA/PyAoZGF0YT8uJGlzRGVzY3JpcHRvciA/IGRhdGEgOiBudWxsKTtcblx0XHRpZiAoJGRlc2MgJiYgJGRlc2M/Lm93bmVyID09IFNFTEZfQ0hBTk5FTD8ubmFtZSkgZGF0YSA9IHJlYWRCeVBhdGgoJGRlc2M/LnBhdGgpID8/IGRhdGE7XG5cdFx0Y29uc3QgcGF0aCA9IHJlZ2lzdGVyZWRJblBhdGg/LmdldD8uKGRhdGEpID8/ICRkZXNjPy5wYXRoO1xuXHRcdGlmIChwYXRoID09IG51bGwgfHwgcGF0aD8ubGVuZ3RoIDwgMSkgcmV0dXJuIGZhbHNlO1xuXHRcdHJlbW92ZUJ5UGF0aChwYXRoKTtcblx0XHRpZiAodHlwZW9mIGRhdGEgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgZGF0YSA9PSBcImZ1bmN0aW9uXCIpIHJlZ2lzdGVyZWRJblBhdGg/LmRlbGV0ZT8uKGRhdGEpO1xuXHRcdHJldHVybiB0cnVlO1xuXHR9O1xuXHRjb25zdCBoYXNOb1BhdGggPSAoZGF0YSkgPT4ge1xuXHRcdGNvbnN0ICRkZXNjID0gZGF0YT8uWyRkZXNjcmlwdG9yXSA/PyAoZGF0YT8uJGlzRGVzY3JpcHRvciA/IGRhdGEgOiBudWxsKTtcblx0XHRyZXR1cm4gKHJlZ2lzdGVyZWRJblBhdGg/LmdldD8uKGRhdGEpID8/ICRkZXNjPy5wYXRoKSA9PSBudWxsO1xuXHR9O1xuXG4vLyAuLi91bmlmb3JtLnRzL3NyYy9uZXdlci9jb3JlL1JlcXVlc3RIYW5kbGVyLnRzXG4vKipcblx0KiBSZXF1ZXN0IEhhbmRsZXIgQ29yZSAtIFVuaWZpZWQgUmVmbGVjdCBBY3Rpb24gSGFuZGxpbmdcblx0KlxuXHQqIFNpbmdsZSBzb3VyY2Ugb2YgdHJ1dGggZm9yIGFsbCBhY3Rpb24gZXhlY3V0aW9uOlxuXHQqIC0gVW5pZmllZENoYW5uZWwsIENoYW5uZWxDb250ZXh0LCBQcm94eSBtb2R1bGVcblx0KiAtIFN1cHBvcnRzIGJvdGggRGF0YUJhc2UtYmFja2VkIGFuZCBkaXJlY3Qgb2JqZWN0IHRhcmdldHNcblx0KiAtIFN1cHBvcnRzIGN1c3RvbSBSZWZsZWN0IGltcGxlbWVudGF0aW9uc1xuXHQqL1xuXHRjb25zdCBpc09iamVjdCA9IChvYmopID0+ICh0eXBlb2Ygb2JqID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBvYmogPT09IFwiZnVuY3Rpb25cIikgJiYgb2JqICE9IG51bGw7XG5cdGNvbnN0IGRlZmF1bHRSZWZsZWN0ID0ge1xuXHRcdGdldDogKHQsIHApID0+IHQ/LltwXSxcblx0XHRzZXQ6ICh0LCBwLCB2KSA9PiB7XG5cdFx0XHR0W3BdID0gdjtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH0sXG5cdFx0aGFzOiAodCwgcCkgPT4gcCBpbiB0LFxuXHRcdGFwcGx5OiAodCwgY3R4LCBhcmdzKSA9PiB0LmFwcGx5KGN0eCwgYXJncyksXG5cdFx0Y29uc3RydWN0OiAodCwgYXJncykgPT4gbmV3IHQoLi4uYXJncyksXG5cdFx0ZGVsZXRlUHJvcGVydHk6ICh0LCBwKSA9PiBkZWxldGUgdFtwXSxcblx0XHRvd25LZXlzOiAodCkgPT4gT2JqZWN0LmtleXModCksXG5cdFx0Z2V0T3duUHJvcGVydHlEZXNjcmlwdG9yOiAodCwgcCkgPT4gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0LCBwKSxcblx0XHRnZXRQcm90b3R5cGVPZjogKHQpID0+IE9iamVjdC5nZXRQcm90b3R5cGVPZih0KSxcblx0XHRzZXRQcm90b3R5cGVPZjogKHQsIHApID0+IE9iamVjdC5zZXRQcm90b3R5cGVPZih0LCBwKSxcblx0XHRpc0V4dGVuc2libGU6ICh0KSA9PiBPYmplY3QuaXNFeHRlbnNpYmxlKHQpLFxuXHRcdHByZXZlbnRFeHRlbnNpb25zOiAodCkgPT4gT2JqZWN0LnByZXZlbnRFeHRlbnNpb25zKHQpXG5cdH07XG5cdC8qKlxuXHQqIEV4ZWN1dGUgYSByZWZsZWN0IGFjdGlvblxuXHQqXG5cdCogVW5pZmllZCBpbXBsZW1lbnRhdGlvbiB1c2VkIGJ5IGFsbCBjaGFubmVsL3Byb3h5IGhhbmRsZXJzLlxuXHQqIFN1cHBvcnRzIGJvdGggRGF0YUJhc2UtYmFja2VkIHBhdGhzIGFuZCBkaXJlY3Qgb2JqZWN0IHRhcmdldHMuXG5cdCpcblx0KiBAcGFyYW0gYWN0aW9uIC0gQWN0aW9uIHRvIGV4ZWN1dGUgKFdSZWZsZWN0QWN0aW9uIG9yIHN0cmluZylcblx0KiBAcGFyYW0gcGF0aCAtIE9iamVjdCBwYXRoXG5cdCogQHBhcmFtIGFyZ3MgLSBBY3Rpb24gYXJndW1lbnRzXG5cdCogQHBhcmFtIG9wdGlvbnMgLSBFeGVjdXRpb24gb3B0aW9uc1xuXHQqL1xuXHRmdW5jdGlvbiBleGVjdXRlQWN0aW9uKGFjdGlvbiwgcGF0aCwgYXJncywgb3B0aW9ucyA9IHt9KSB7XG5cdFx0Y29uc3QgeyBjaGFubmVsID0gXCJcIiwgc2VuZGVyID0gXCJcIiwgcmVmbGVjdCA9IGRlZmF1bHRSZWZsZWN0IH0gPSBvcHRpb25zO1xuXHRcdGNvbnN0IG9iaiA9IG9wdGlvbnMudGFyZ2V0ID8/IHJlYWRCeVBhdGgocGF0aCk7XG5cdFx0Y29uc3QgdG9UcmFuc2ZlciA9IFtdO1xuXHRcdGxldCByZXN1bHQgPSBudWxsO1xuXHRcdGxldCBuZXdQYXRoID0gcGF0aDtcblx0XHRzd2l0Y2ggKFN0cmluZyhhY3Rpb24pLnRvTG93ZXJDYXNlKCkpIHtcblx0XHRcdGNhc2UgXCJpbXBvcnRcIjpcblx0XHRcdGNhc2UgV1JlZmxlY3RBY3Rpb24uSU1QT1JUOlxuXHRcdFx0XHRyZXN1bHQgPSBpbXBvcnQoXG5cdFx0XHRcdFx0LyogQHZpdGUtaWdub3JlICovXG5cdFx0XHRcdFx0YXJncz8uWzBdXG4pO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCJ0cmFuc2ZlclwiOlxuXHRcdFx0Y2FzZSBXUmVmbGVjdEFjdGlvbi5UUkFOU0ZFUjpcblx0XHRcdFx0aWYgKGlzQ2FuVHJhbnNmZXIob2JqKSAmJiBjaGFubmVsICE9PSBzZW5kZXIpIHRvVHJhbnNmZXIucHVzaChvYmopO1xuXHRcdFx0XHRyZXN1bHQgPSBvYmo7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcImdldFwiOlxuXHRcdFx0Y2FzZSBXUmVmbGVjdEFjdGlvbi5HRVQ6IHtcblx0XHRcdFx0Y29uc3QgcHJvcCA9IGFyZ3M/LlswXTtcblx0XHRcdFx0Y29uc3QgZ290ID0gcmVmbGVjdC5nZXQ/LihvYmosIHByb3ApID8/IG9iaj8uW3Byb3BdO1xuXHRcdFx0XHRyZXN1bHQgPSB0eXBlb2YgZ290ID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqICE9IG51bGwgPyBnb3QuYmluZChvYmopIDogZ290O1xuXHRcdFx0XHRuZXdQYXRoID0gWy4uLnBhdGgsIFN0cmluZyhwcm9wKV07XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdFx0Y2FzZSBcInNldFwiOlxuXHRcdFx0Y2FzZSBXUmVmbGVjdEFjdGlvbi5TRVQ6IHtcblx0XHRcdFx0Y29uc3QgW3Byb3AsIHZhbHVlXSA9IGFyZ3M7XG5cdFx0XHRcdGNvbnN0IG5vcm1hbGl6ZWRWYWx1ZSA9IGRlZXBPcGVyYXRlQW5kQ2xvbmUodmFsdWUsIG5vcm1hbGl6ZVJlZik7XG5cdFx0XHRcdGlmIChvcHRpb25zLnRhcmdldCkgcmVzdWx0ID0gcmVmbGVjdC5zZXQ/LihvYmosIHByb3AsIG5vcm1hbGl6ZWRWYWx1ZSkgPz8gKG9ialtwcm9wXSA9IG5vcm1hbGl6ZWRWYWx1ZSwgdHJ1ZSk7XG5cdFx0XHRcdGVsc2UgcmVzdWx0ID0gcmVmbGVjdC5zZXQ/LihvYmosIHByb3AsIG5vcm1hbGl6ZWRWYWx1ZSkgPz8gd3JpdGVCeVBhdGgoWy4uLnBhdGgsIFN0cmluZyhwcm9wKV0sIG5vcm1hbGl6ZWRWYWx1ZSk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdFx0Y2FzZSBcImFwcGx5XCI6XG5cdFx0XHRjYXNlIFwiY2FsbFwiOlxuXHRcdFx0Y2FzZSBXUmVmbGVjdEFjdGlvbi5BUFBMWTpcblx0XHRcdGNhc2UgV1JlZmxlY3RBY3Rpb24uQ0FMTDpcblx0XHRcdFx0aWYgKHR5cGVvZiBvYmogPT09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0XHRcdGNvbnN0IGN0eCA9IG9wdGlvbnMuY29udGV4dCA/PyAob3B0aW9ucy50YXJnZXQgPyB2b2lkIDAgOiByZWFkQnlQYXRoKHBhdGguc2xpY2UoMCwgLTEpKSk7XG5cdFx0XHRcdFx0Y29uc3Qgbm9ybWFsaXplZEFyZ3MgPSBkZWVwT3BlcmF0ZUFuZENsb25lKGFyZ3M/LlswXSA/PyBhcmdzID8/IFtdLCBub3JtYWxpemVSZWYpO1xuXHRcdFx0XHRcdHJlc3VsdCA9IHJlZmxlY3QuYXBwbHk/LihvYmosIGN0eCwgbm9ybWFsaXplZEFyZ3MpID8/IG9iai5hcHBseShjdHgsIG5vcm1hbGl6ZWRBcmdzKTtcblx0XHRcdFx0XHRpZiAoaXNDYW5UcmFuc2ZlcihyZXN1bHQpICYmIHBhdGg/LmF0KC0xKSA9PT0gXCJ0cmFuc2ZlclwiICYmIGNoYW5uZWwgIT09IHNlbmRlcikgdG9UcmFuc2Zlci5wdXNoKHJlc3VsdCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwiY29uc3RydWN0XCI6XG5cdFx0XHRjYXNlIFdSZWZsZWN0QWN0aW9uLkNPTlNUUlVDVDpcblx0XHRcdFx0aWYgKHR5cGVvZiBvYmogPT09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0XHRcdGNvbnN0IG5vcm1hbGl6ZWRBcmdzID0gZGVlcE9wZXJhdGVBbmRDbG9uZShhcmdzPy5bMF0gPz8gYXJncyA/PyBbXSwgbm9ybWFsaXplUmVmKTtcblx0XHRcdFx0XHRyZXN1bHQgPSByZWZsZWN0LmNvbnN0cnVjdD8uKG9iaiwgbm9ybWFsaXplZEFyZ3MpID8/IG5ldyBvYmooLi4ubm9ybWFsaXplZEFyZ3MpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcImRlbGV0ZVwiOlxuXHRcdFx0Y2FzZSBcImRlbGV0ZXByb3BlcnR5XCI6XG5cdFx0XHRjYXNlIFwiZGlzcG9zZVwiOlxuXHRcdFx0Y2FzZSBXUmVmbGVjdEFjdGlvbi5ERUxFVEU6XG5cdFx0XHRjYXNlIFdSZWZsZWN0QWN0aW9uLkRFTEVURV9QUk9QRVJUWTpcblx0XHRcdGNhc2UgV1JlZmxlY3RBY3Rpb24uRElTUE9TRTpcblx0XHRcdFx0aWYgKG9wdGlvbnMudGFyZ2V0KSB7XG5cdFx0XHRcdFx0Y29uc3QgcHJvcCA9IHBhdGhbcGF0aC5sZW5ndGggLSAxXTtcblx0XHRcdFx0XHRyZXN1bHQgPSByZWZsZWN0LmRlbGV0ZVByb3BlcnR5Py4ob2JqLCBwcm9wKSA/PyBkZWxldGUgb2JqW3Byb3BdO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJlc3VsdCA9IHBhdGg/Lmxlbmd0aCA+IDAgPyByZW1vdmVCeVBhdGgocGF0aCkgOiByZW1vdmVCeURhdGEob2JqKTtcblx0XHRcdFx0XHRpZiAocmVzdWx0KSBuZXdQYXRoID0gcmVnaXN0ZXJlZEluUGF0aC5nZXQob2JqKSA/PyBbXTtcblx0XHRcdFx0fVxuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCJoYXNcIjpcblx0XHRcdGNhc2UgV1JlZmxlY3RBY3Rpb24uSEFTOlxuXHRcdFx0XHRyZXN1bHQgPSByZWZsZWN0Lmhhcz8uKG9iaiwgYXJncz8uWzBdKSA/PyAoaXNPYmplY3Qob2JqKSA/IGFyZ3M/LlswXSBpbiBvYmogOiBmYWxzZSk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcIm93bmtleXNcIjpcblx0XHRcdGNhc2UgV1JlZmxlY3RBY3Rpb24uT1dOX0tFWVM6XG5cdFx0XHRcdHJlc3VsdCA9IHJlZmxlY3Qub3duS2V5cz8uKG9iaikgPz8gKGlzT2JqZWN0KG9iaikgPyBPYmplY3Qua2V5cyhvYmopIDogW10pO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCJnZXRvd25wcm9wZXJ0eWRlc2NyaXB0b3JcIjpcblx0XHRcdGNhc2UgXCJnZXRwcm9wZXJ0eWRlc2NyaXB0b3JcIjpcblx0XHRcdGNhc2UgV1JlZmxlY3RBY3Rpb24uR0VUX09XTl9QUk9QRVJUWV9ERVNDUklQVE9SOlxuXHRcdFx0Y2FzZSBXUmVmbGVjdEFjdGlvbi5HRVRfUFJPUEVSVFlfREVTQ1JJUFRPUjpcblx0XHRcdFx0cmVzdWx0ID0gcmVmbGVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I/LihvYmosIGFyZ3M/LlswXSA/PyBwYXRoPy5hdCgtMSkgPz8gXCJcIikgPz8gKGlzT2JqZWN0KG9iaikgPyBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaiwgYXJncz8uWzBdID8/IHBhdGg/LmF0KC0xKSA/PyBcIlwiKSA6IHZvaWQgMCk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcImdldHByb3RvdHlwZW9mXCI6XG5cdFx0XHRjYXNlIFdSZWZsZWN0QWN0aW9uLkdFVF9QUk9UT1RZUEVfT0Y6XG5cdFx0XHRcdHJlc3VsdCA9IHJlZmxlY3QuZ2V0UHJvdG90eXBlT2Y/LihvYmopID8/IChpc09iamVjdChvYmopID8gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iaikgOiBudWxsKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwic2V0cHJvdG90eXBlb2ZcIjpcblx0XHRcdGNhc2UgV1JlZmxlY3RBY3Rpb24uU0VUX1BST1RPVFlQRV9PRjpcblx0XHRcdFx0cmVzdWx0ID0gcmVmbGVjdC5zZXRQcm90b3R5cGVPZj8uKG9iaiwgYXJncz8uWzBdKSA/PyAoaXNPYmplY3Qob2JqKSA/IE9iamVjdC5zZXRQcm90b3R5cGVPZihvYmosIGFyZ3M/LlswXSkgOiBmYWxzZSk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcImlzZXh0ZW5zaWJsZVwiOlxuXHRcdFx0Y2FzZSBXUmVmbGVjdEFjdGlvbi5JU19FWFRFTlNJQkxFOlxuXHRcdFx0XHRyZXN1bHQgPSByZWZsZWN0LmlzRXh0ZW5zaWJsZT8uKG9iaikgPz8gKGlzT2JqZWN0KG9iaikgPyBPYmplY3QuaXNFeHRlbnNpYmxlKG9iaikgOiB0cnVlKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwicHJldmVudGV4dGVuc2lvbnNcIjpcblx0XHRcdGNhc2UgV1JlZmxlY3RBY3Rpb24uUFJFVkVOVF9FWFRFTlNJT05TOiByZXN1bHQgPSByZWZsZWN0LnByZXZlbnRFeHRlbnNpb25zPy4ob2JqKSA/PyAoaXNPYmplY3Qob2JqKSA/IE9iamVjdC5wcmV2ZW50RXh0ZW5zaW9ucyhvYmopIDogZmFsc2UpO1xuXHRcdH1cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdWx0LFxuXHRcdFx0dG9UcmFuc2Zlcixcblx0XHRcdHBhdGg6IG5ld1BhdGhcblx0XHR9O1xuXHR9XG5cdC8qKlxuXHQqIEJ1aWxkIHJlc3BvbnNlIG9iamVjdCB3aXRoIGRlc2NyaXB0b3Jcblx0Ki9cblx0YXN5bmMgZnVuY3Rpb24gYnVpbGRSZXNwb25zZShyZXFJZCwgYWN0aW9uLCBjaGFubmVsLCBzZW5kZXIsIHBhdGgsIHJhd1Jlc3VsdCwgdG9UcmFuc2Zlcikge1xuXHRcdGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJhd1Jlc3VsdDtcblx0XHRjb25zdCBjYW5CZVJldHVybiA9IGlzQ2FuVHJhbnNmZXIocmVzdWx0KSAmJiB0b1RyYW5zZmVyLmluY2x1ZGVzKHJlc3VsdCkgfHwgaXNDYW5KdXN0UmV0dXJuKHJlc3VsdCk7XG5cdFx0bGV0IGZpbmFsUGF0aCA9IHBhdGg7XG5cdFx0aWYgKCFjYW5CZVJldHVybiAmJiBhY3Rpb24gIT09IFwiZ2V0XCIgJiYgYWN0aW9uICE9PSBXUmVmbGVjdEFjdGlvbi5HRVQgJiYgKHR5cGVvZiByZXN1bHQgPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIHJlc3VsdCA9PT0gXCJmdW5jdGlvblwiKSkge1xuXHRcdFx0aWYgKGhhc05vUGF0aChyZXN1bHQpKSB7XG5cdFx0XHRcdGZpbmFsUGF0aCA9IFtVVUlEdjQoKV07XG5cdFx0XHRcdHdyaXRlQnlQYXRoKGZpbmFsUGF0aCwgcmVzdWx0KTtcblx0XHRcdH0gZWxzZSBmaW5hbFBhdGggPSByZWdpc3RlcmVkSW5QYXRoLmdldChyZXN1bHQpID8/IFtdO1xuXHRcdH1cblx0XHRjb25zdCBjdHggPSByZWFkQnlQYXRoKGZpbmFsUGF0aCk7XG5cdFx0Y29uc3QgY3R4S2V5ID0gYWN0aW9uID09PSBcImdldFwiIHx8IGFjdGlvbiA9PT0gV1JlZmxlY3RBY3Rpb24uR0VUID8gZmluYWxQYXRoPy5hdCgtMSkgOiB2b2lkIDA7XG5cdFx0Y29uc3Qgb2JqID0gcmVhZEJ5UGF0aChwYXRoKTtcblx0XHRjb25zdCBwYXlsb2FkID0gZGVlcE9wZXJhdGVBbmRDbG9uZShyZXN1bHQsIChlbCkgPT4gb2JqZWN0VG9SZWYoZWwsIGNoYW5uZWwsIHRvVHJhbnNmZXIpKSA/PyByZXN1bHQ7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3BvbnNlOiB7XG5cdFx0XHRcdGNoYW5uZWw6IHNlbmRlcixcblx0XHRcdFx0c2VuZGVyOiBjaGFubmVsLFxuXHRcdFx0XHRyZXFJZCxcblx0XHRcdFx0YWN0aW9uLFxuXHRcdFx0XHR0eXBlOiBcInJlc3BvbnNlXCIsXG5cdFx0XHRcdHBheWxvYWQ6IHtcblx0XHRcdFx0XHRyZXN1bHQ6IGNhbkJlUmV0dXJuID8gcGF5bG9hZCA6IG51bGwsXG5cdFx0XHRcdFx0dHlwZTogdHlwZW9mIHJlc3VsdCxcblx0XHRcdFx0XHRjaGFubmVsOiBzZW5kZXIsXG5cdFx0XHRcdFx0c2VuZGVyOiBjaGFubmVsLFxuXHRcdFx0XHRcdGRlc2NyaXB0b3I6IHtcblx0XHRcdFx0XHRcdCRpc0Rlc2NyaXB0b3I6IHRydWUsXG5cdFx0XHRcdFx0XHRwYXRoOiBmaW5hbFBhdGgsXG5cdFx0XHRcdFx0XHRvd25lcjogY2hhbm5lbCxcblx0XHRcdFx0XHRcdGNoYW5uZWwsXG5cdFx0XHRcdFx0XHRwcmltaXRpdmU6IGlzUHJpbWl0aXZlKHJlc3VsdCksXG5cdFx0XHRcdFx0XHR3cml0YWJsZTogdHJ1ZSxcblx0XHRcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0XHRcdFx0XHRjb25maWd1cmFibGU6IHRydWUsXG5cdFx0XHRcdFx0XHRhcmd1bWVudENvdW50OiBvYmogaW5zdGFuY2VvZiBGdW5jdGlvbiA/IG9iai5sZW5ndGggOiAtMSxcblx0XHRcdFx0XHRcdC4uLmlzT2JqZWN0KGN0eCkgJiYgY3R4S2V5ICE9IG51bGwgPyBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGN0eCwgY3R4S2V5KSA6IHt9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0dHJhbnNmZXI6IHRvVHJhbnNmZXJcblx0XHR9O1xuXHR9XG5cdC8qKlxuXHQqIEhhbmRsZSByZXF1ZXN0IGFuZCByZXR1cm4gcmVzcG9uc2UgKHVuaWZpZWQgaGFuZGxlcilcblx0Ki9cblx0YXN5bmMgZnVuY3Rpb24gaGFuZGxlUmVxdWVzdChyZXF1ZXN0LCByZXFJZCwgY2hhbm5lbE5hbWUsIG9wdGlvbnMpIHtcblx0XHRjb25zdCB7IGNoYW5uZWwsIHNlbmRlciwgcGF0aCwgYWN0aW9uLCBhcmdzIH0gPSByZXF1ZXN0O1xuXHRcdGlmIChjaGFubmVsICE9PSBjaGFubmVsTmFtZSkgcmV0dXJuIG51bGw7XG5cdFx0Y29uc3QgeyByZXN1bHQsIHRvVHJhbnNmZXIsIHBhdGg6IG5ld1BhdGggfSA9IGV4ZWN1dGVBY3Rpb24oYWN0aW9uLCBwYXRoLCBhcmdzLCB7XG5cdFx0XHRjaGFubmVsLFxuXHRcdFx0c2VuZGVyLFxuXHRcdFx0Li4ub3B0aW9uc1xuXHRcdH0pO1xuXHRcdHJldHVybiBidWlsZFJlc3BvbnNlKHJlcUlkLCBhY3Rpb24sIGNoYW5uZWxOYW1lLCBzZW5kZXIsIG5ld1BhdGgsIHJlc3VsdCwgdG9UcmFuc2Zlcik7XG5cdH1cblx0LyoqXG5cdCogQ3JlYXRlIGEgc2ltcGxlIGV4cG9zZSBoYW5kbGVyIGZvciBhbiBvYmplY3Rcblx0KlxuXHQqIFVubGlrZSB0aGUgZnVsbCBleGVjdXRlQWN0aW9uLCB0aGlzIHdvcmtzIGRpcmVjdGx5IG9uIHRoZSB0YXJnZXRcblx0KiB3aXRob3V0IERhdGFCYXNlIGludGVncmF0aW9uLiBVc2VkIGJ5IFByb3h5LnRzIGNyZWF0ZUV4cG9zZUhhbmRsZXIuXG5cdCpcblx0KiBAcGFyYW0gdGFyZ2V0IC0gT2JqZWN0IHRvIGV4cG9zZVxuXHQqIEBwYXJhbSByZWZsZWN0IC0gT3B0aW9uYWwgY3VzdG9tIFJlZmxlY3QgaW1wbGVtZW50YXRpb25cblx0Ki9cblx0ZnVuY3Rpb24gY3JlYXRlT2JqZWN0SGFuZGxlcih0YXJnZXQsIHJlZmxlY3QgPSBkZWZhdWx0UmVmbGVjdCkge1xuXHRcdHJldHVybiBhc3luYyAoYWN0aW9uLCBwYXRoLCBhcmdzKSA9PiB7XG5cdFx0XHRsZXQgcGFyZW50ID0gdGFyZ2V0O1xuXHRcdFx0bGV0IGN1cnJlbnQgPSB0YXJnZXQ7XG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHBhdGgubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0cGFyZW50ID0gY3VycmVudDtcblx0XHRcdFx0Y3VycmVudCA9IGN1cnJlbnQ/LltwYXRoW2ldXTtcblx0XHRcdFx0aWYgKGN1cnJlbnQgPT09IHZvaWQgMCAmJiBpIDwgcGF0aC5sZW5ndGggLSAxKSB0aHJvdyBuZXcgRXJyb3IoYFBhdGggc2VnbWVudCAnJHtwYXRoW2ldfScgbm90IGZvdW5kYCk7XG5cdFx0XHR9XG5cdFx0XHRjb25zdCBwcm9wID0gcGF0aFtwYXRoLmxlbmd0aCAtIDFdO1xuXHRcdFx0c3dpdGNoIChTdHJpbmcoYWN0aW9uKS50b0xvd2VyQ2FzZSgpKSB7XG5cdFx0XHRcdGNhc2UgXCJnZXRcIjpcblx0XHRcdFx0Y2FzZSBXUmVmbGVjdEFjdGlvbi5HRVQ6IHJldHVybiBjdXJyZW50O1xuXHRcdFx0XHRjYXNlIFwic2V0XCI6XG5cdFx0XHRcdGNhc2UgV1JlZmxlY3RBY3Rpb24uU0VUOlxuXHRcdFx0XHRcdHBhcmVudFtwcm9wXSA9IGFyZ3NbMF07XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdGNhc2UgXCJjYWxsXCI6XG5cdFx0XHRcdGNhc2UgXCJhcHBseVwiOlxuXHRcdFx0XHRjYXNlIFdSZWZsZWN0QWN0aW9uLkFQUExZOlxuXHRcdFx0XHRjYXNlIFdSZWZsZWN0QWN0aW9uLkNBTEw6XG5cdFx0XHRcdFx0aWYgKHR5cGVvZiBjdXJyZW50ID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdFx0XHRcdGNvbnN0IGNhbGxBcmdzID0gQXJyYXkuaXNBcnJheShhcmdzWzBdKSA/IGFyZ3NbMF0gOiBhcmdzO1xuXHRcdFx0XHRcdFx0cmV0dXJuIGF3YWl0IGN1cnJlbnQuYXBwbHkocGFyZW50LCBjYWxsQXJncyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgJyR7cHJvcH0nIGlzIG5vdCBhIGZ1bmN0aW9uYCk7XG5cdFx0XHRcdGNhc2UgXCJjb25zdHJ1Y3RcIjpcblx0XHRcdFx0Y2FzZSBXUmVmbGVjdEFjdGlvbi5DT05TVFJVQ1Q6XG5cdFx0XHRcdFx0aWYgKHR5cGVvZiBjdXJyZW50ID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdFx0XHRcdGNvbnN0IGN0b3JBcmdzID0gQXJyYXkuaXNBcnJheShhcmdzWzBdKSA/IGFyZ3NbMF0gOiBhcmdzO1xuXHRcdFx0XHRcdFx0cmV0dXJuIG5ldyBjdXJyZW50KC4uLmN0b3JBcmdzKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGAnJHtwcm9wfScgaXMgbm90IGEgY29uc3RydWN0b3JgKTtcblx0XHRcdFx0Y2FzZSBcImhhc1wiOlxuXHRcdFx0XHRjYXNlIFdSZWZsZWN0QWN0aW9uLkhBUzogcmV0dXJuIHByb3AgaW4gcGFyZW50O1xuXHRcdFx0XHRjYXNlIFwiZGVsZXRlXCI6XG5cdFx0XHRcdGNhc2UgXCJkZWxldGVwcm9wZXJ0eVwiOlxuXHRcdFx0XHRjYXNlIFdSZWZsZWN0QWN0aW9uLkRFTEVURV9QUk9QRVJUWTogcmV0dXJuIGRlbGV0ZSBwYXJlbnRbcHJvcF07XG5cdFx0XHRcdGNhc2UgXCJvd25rZXlzXCI6XG5cdFx0XHRcdGNhc2UgV1JlZmxlY3RBY3Rpb24uT1dOX0tFWVM6IHJldHVybiBPYmplY3Qua2V5cyhjdXJyZW50ID8/IHBhcmVudCk7XG5cdFx0XHRcdGRlZmF1bHQ6IHJldHVybiBjdXJyZW50O1xuXHRcdFx0fVxuXHRcdH07XG5cdH1cblxuLy8gLi4vdW5pZm9ybS50cy9zcmMvbmV3ZXIvbmV4dC9jaGFubmVsL0Nvbm5lY3Rpb24udHNcbi8qKlxuXHQqIENoYW5uZWwgQ29ubmVjdGlvbiAtIENvbm5lY3Rpb24gYWJzdHJhY3Rpb24gbGF5ZXJcblx0KlxuXHQqIFByb3ZpZGVzIGNvbm5lY3Rpb24gcG9vbGluZywgc3RhdGUgbWFuYWdlbWVudCwgYW5kIG1lc3NhZ2Ugcm91dGluZy5cblx0Ki9cblx0dmFyIENoYW5uZWxDb25uZWN0aW9uID0gY2xhc3Mge1xuXHRcdF9uYW1lO1xuXHRcdF90cmFuc3BvcnRUeXBlO1xuXHRcdF9pZCA9IFVVSUR2NCgpO1xuXHRcdF9zdGF0ZSA9IFwiZGlzY29ubmVjdGVkXCI7XG5cdFx0X2luYm91bmQgPSBuZXcgQ2hhbm5lbFN1YmplY3QoeyBidWZmZXJTaXplOiAxZTMgfSk7XG5cdFx0X291dGJvdW5kID0gbmV3IENoYW5uZWxTdWJqZWN0KHsgYnVmZmVyU2l6ZTogMWUzIH0pO1xuXHRcdF9zdGF0ZUNoYW5nZXMgPSBuZXcgQ2hhbm5lbFN1YmplY3QoKTtcblx0XHRfY29ubmVjdGVkUGVlcnMgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuXHRcdF9zdWJzID0gW107XG5cdFx0X3N0YXRzID0ge1xuXHRcdFx0bWVzc2FnZXNTZW50OiAwLFxuXHRcdFx0bWVzc2FnZXNSZWNlaXZlZDogMCxcblx0XHRcdGJ5dGVzVHJhbnNmZXJyZWQ6IDAsXG5cdFx0XHRsYXRlbmN5TXM6IDAsXG5cdFx0XHR1cHRpbWU6IDAsXG5cdFx0XHRyZWNvbm5lY3RDb3VudDogMFxuXHRcdH07XG5cdFx0X3N0YXJ0VGltZSA9IDA7XG5cdFx0X3BlbmRpbmcgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuXHRcdF9idWZmZXIgPSBbXTtcblx0XHRfb3B0cztcblx0XHRjb25zdHJ1Y3RvcihfbmFtZSwgX3RyYW5zcG9ydFR5cGUgPSBcImludGVybmFsXCIsIG9wdGlvbnMgPSB7fSkge1xuXHRcdFx0dGhpcy5fbmFtZSA9IF9uYW1lO1xuXHRcdFx0dGhpcy5fdHJhbnNwb3J0VHlwZSA9IF90cmFuc3BvcnRUeXBlO1xuXHRcdFx0dGhpcy5fb3B0cyA9IHtcblx0XHRcdFx0dGltZW91dDogM2U0LFxuXHRcdFx0XHRhdXRvUmVjb25uZWN0OiB0cnVlLFxuXHRcdFx0XHRyZWNvbm5lY3RJbnRlcnZhbDogMWUzLFxuXHRcdFx0XHRtYXhSZWNvbm5lY3RBdHRlbXB0czogNSxcblx0XHRcdFx0YnVmZmVyTWVzc2FnZXM6IHRydWUsXG5cdFx0XHRcdGJ1ZmZlclNpemU6IDFlMyxcblx0XHRcdFx0bWV0YWRhdGE6IHt9LFxuXHRcdFx0XHQuLi5vcHRpb25zXG5cdFx0XHR9O1xuXHRcdFx0dGhpcy5fc2V0dXBTdWJzY3JpcHRpb25zKCk7XG5cdFx0fVxuXHRcdHN1YnNjcmliZShvYnNlcnZlciwgZnJvbUNoYW5uZWwpIHtcblx0XHRcdHJldHVybiAoZnJvbUNoYW5uZWwgPyBmaWx0ZXIoKG0pID0+IG0uc2VuZGVyID09PSBmcm9tQ2hhbm5lbCkodGhpcy5faW5ib3VuZCkgOiB0aGlzLl9pbmJvdW5kKS5zdWJzY3JpYmUodHlwZW9mIG9ic2VydmVyID09PSBcImZ1bmN0aW9uXCIgPyB7IG5leHQ6IG9ic2VydmVyIH0gOiBvYnNlcnZlcik7XG5cdFx0fVxuXHRcdG5leHQobWVzc2FnZSkge1xuXHRcdFx0aWYgKHRoaXMuX3N0YXRlICE9PSBcImNvbm5lY3RlZFwiKSB7XG5cdFx0XHRcdGlmICh0aGlzLl9vcHRzLmJ1ZmZlck1lc3NhZ2VzICYmIHRoaXMuX2J1ZmZlci5sZW5ndGggPCB0aGlzLl9vcHRzLmJ1ZmZlclNpemUpIHRoaXMuX2J1ZmZlci5wdXNoKG1lc3NhZ2UpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHR0aGlzLl9vdXRib3VuZC5uZXh0KG1lc3NhZ2UpO1xuXHRcdFx0dGhpcy5fc3RhdHMubWVzc2FnZXNTZW50Kys7XG5cdFx0fVxuXHRcdGFzeW5jIHJlcXVlc3QodG9DaGFubmVsLCBwYXlsb2FkLCBvcHRzID0ge30pIHtcblx0XHRcdGNvbnN0IHJlcUlkID0gVVVJRHY0KCk7XG5cdFx0XHRjb25zdCByZXNvbHZlcnMgPSBQcm9taXNlLndpdGhSZXNvbHZlcnMoKTtcblx0XHRcdHRoaXMuX3BlbmRpbmcuc2V0KHJlcUlkLCByZXNvbHZlcnMpO1xuXHRcdFx0Y29uc3QgdGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRpZiAodGhpcy5fcGVuZGluZy5oYXMocmVxSWQpKSB7XG5cdFx0XHRcdFx0dGhpcy5fcGVuZGluZy5kZWxldGUocmVxSWQpO1xuXHRcdFx0XHRcdHJlc29sdmVycy5yZWplY3QoLyogQF9fUFVSRV9fICovIG5ldyBFcnJvcihgUmVxdWVzdCB0aW1lb3V0YCkpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LCBvcHRzLnRpbWVvdXQgPz8gdGhpcy5fb3B0cy50aW1lb3V0KTtcblx0XHRcdHRoaXMubmV4dCh7XG5cdFx0XHRcdGlkOiBVVUlEdjQoKSxcblx0XHRcdFx0Y2hhbm5lbDogdG9DaGFubmVsLFxuXHRcdFx0XHRzZW5kZXI6IHRoaXMuX25hbWUsXG5cdFx0XHRcdHR5cGU6IFwicmVxdWVzdFwiLFxuXHRcdFx0XHRyZXFJZCxcblx0XHRcdFx0cGF5bG9hZDoge1xuXHRcdFx0XHRcdC4uLnBheWxvYWQsXG5cdFx0XHRcdFx0YWN0aW9uOiBvcHRzLmFjdGlvbixcblx0XHRcdFx0XHRwYXRoOiBvcHRzLnBhdGhcblx0XHRcdFx0fSxcblx0XHRcdFx0dGltZXN0YW1wOiBEYXRlLm5vdygpXG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiByZXNvbHZlcnMucHJvbWlzZS5maW5hbGx5KCgpID0+IGNsZWFyVGltZW91dCh0aW1lb3V0KSk7XG5cdFx0fVxuXHRcdHJlc3BvbmQob3JpZ2luYWwsIHBheWxvYWQpIHtcblx0XHRcdHRoaXMubmV4dCh7XG5cdFx0XHRcdGlkOiBVVUlEdjQoKSxcblx0XHRcdFx0Y2hhbm5lbDogb3JpZ2luYWwuc2VuZGVyLFxuXHRcdFx0XHRzZW5kZXI6IHRoaXMuX25hbWUsXG5cdFx0XHRcdHR5cGU6IFwicmVzcG9uc2VcIixcblx0XHRcdFx0cmVxSWQ6IG9yaWdpbmFsLnJlcUlkLFxuXHRcdFx0XHRwYXlsb2FkLFxuXHRcdFx0XHR0aW1lc3RhbXA6IERhdGUubm93KClcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRlbWl0KHRvQ2hhbm5lbCwgZXZlbnRUeXBlLCBkYXRhKSB7XG5cdFx0XHR0aGlzLm5leHQoe1xuXHRcdFx0XHRpZDogVVVJRHY0KCksXG5cdFx0XHRcdGNoYW5uZWw6IHRvQ2hhbm5lbCxcblx0XHRcdFx0c2VuZGVyOiB0aGlzLl9uYW1lLFxuXHRcdFx0XHR0eXBlOiBcImV2ZW50XCIsXG5cdFx0XHRcdHBheWxvYWQ6IHtcblx0XHRcdFx0XHR0eXBlOiBldmVudFR5cGUsXG5cdFx0XHRcdFx0ZGF0YVxuXHRcdFx0XHR9LFxuXHRcdFx0XHR0aW1lc3RhbXA6IERhdGUubm93KClcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRzdWJzY3JpYmVPdXRib3VuZChvYnNlcnZlcikge1xuXHRcdFx0cmV0dXJuIHRoaXMuX291dGJvdW5kLnN1YnNjcmliZSh0eXBlb2Ygb2JzZXJ2ZXIgPT09IFwiZnVuY3Rpb25cIiA/IHsgbmV4dDogb2JzZXJ2ZXIgfSA6IG9ic2VydmVyKTtcblx0XHR9XG5cdFx0cHVzaEluYm91bmQobWVzc2FnZSkge1xuXHRcdFx0dGhpcy5fc3RhdHMubWVzc2FnZXNSZWNlaXZlZCsrO1xuXHRcdFx0aWYgKG1lc3NhZ2UudHlwZSA9PT0gXCJyZXNwb25zZVwiICYmIG1lc3NhZ2UucmVxSWQpIHtcblx0XHRcdFx0Y29uc3QgciA9IHRoaXMuX3BlbmRpbmcuZ2V0KG1lc3NhZ2UucmVxSWQpO1xuXHRcdFx0XHRpZiAocikge1xuXHRcdFx0XHRcdHRoaXMuX3BlbmRpbmcuZGVsZXRlKG1lc3NhZ2UucmVxSWQpO1xuXHRcdFx0XHRcdHIucmVzb2x2ZShtZXNzYWdlLnBheWxvYWQpO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0dGhpcy5faW5ib3VuZC5uZXh0KG1lc3NhZ2UpO1xuXHRcdH1cblx0XHRhc3luYyBjb25uZWN0KCkge1xuXHRcdFx0aWYgKHRoaXMuX3N0YXRlID09PSBcImNvbm5lY3RlZFwiKSByZXR1cm47XG5cdFx0XHR0aGlzLl9zZXRTdGF0ZShcImNvbm5lY3RpbmdcIik7XG5cdFx0XHR0aGlzLl9zdGFydFRpbWUgPSBEYXRlLm5vdygpO1xuXHRcdFx0dGhpcy5fc2V0U3RhdGUoXCJjb25uZWN0ZWRcIik7XG5cdFx0XHR0aGlzLl9mbHVzaEJ1ZmZlcigpO1xuXHRcdH1cblx0XHRkaXNjb25uZWN0KCkge1xuXHRcdFx0aWYgKHRoaXMuX3N0YXRlID09PSBcImRpc2Nvbm5lY3RlZFwiIHx8IHRoaXMuX3N0YXRlID09PSBcImNsb3NlZFwiKSByZXR1cm47XG5cdFx0XHR0aGlzLl9zZXRTdGF0ZShcImRpc2Nvbm5lY3RlZFwiKTtcblx0XHRcdHRoaXMuX3N1YnMuZm9yRWFjaCgocykgPT4gcy51bnN1YnNjcmliZSgpKTtcblx0XHRcdHRoaXMuX3N1YnMgPSBbXTtcblx0XHR9XG5cdFx0Y2xvc2UoKSB7XG5cdFx0XHR0aGlzLmRpc2Nvbm5lY3QoKTtcblx0XHRcdHRoaXMuX3NldFN0YXRlKFwiY2xvc2VkXCIpO1xuXHRcdFx0dGhpcy5faW5ib3VuZC5jb21wbGV0ZSgpO1xuXHRcdFx0dGhpcy5fb3V0Ym91bmQuY29tcGxldGUoKTtcblx0XHRcdHRoaXMuX3N0YXRlQ2hhbmdlcy5jb21wbGV0ZSgpO1xuXHRcdH1cblx0XHRtYXJrQ29ubmVjdGVkKCkge1xuXHRcdFx0dGhpcy5fc2V0U3RhdGUoXCJjb25uZWN0ZWRcIik7XG5cdFx0XHR0aGlzLl9mbHVzaEJ1ZmZlcigpO1xuXHRcdH1cblx0XHRtYXJrRGlzY29ubmVjdGVkKCkge1xuXHRcdFx0dGhpcy5fc2V0U3RhdGUoXCJkaXNjb25uZWN0ZWRcIik7XG5cdFx0fVxuXHRcdF9zZXRTdGF0ZShzdGF0ZSkge1xuXHRcdFx0aWYgKHRoaXMuX3N0YXRlICE9PSBzdGF0ZSkge1xuXHRcdFx0XHR0aGlzLl9zdGF0ZSA9IHN0YXRlO1xuXHRcdFx0XHR0aGlzLl9zdGF0ZUNoYW5nZXMubmV4dChzdGF0ZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdF9mbHVzaEJ1ZmZlcigpIHtcblx0XHRcdGZvciAoY29uc3QgbXNnIG9mIHRoaXMuX2J1ZmZlcikgdGhpcy5fb3V0Ym91bmQubmV4dChtc2cpO1xuXHRcdFx0dGhpcy5fYnVmZmVyID0gW107XG5cdFx0fVxuXHRcdF9zZXR1cFN1YnNjcmlwdGlvbnMoKSB7XG5cdFx0XHR0aGlzLl9zdWJzLnB1c2godGhpcy5faW5ib3VuZC5zdWJzY3JpYmUoeyBuZXh0OiAobXNnKSA9PiB7XG5cdFx0XHRcdGlmIChtc2cudHlwZSA9PT0gXCJzaWduYWxcIiAmJiBtc2cucGF5bG9hZD8udHlwZSA9PT0gXCJjb25uZWN0XCIpIHRoaXMuX2Nvbm5lY3RlZFBlZXJzLnNldChtc2cuc2VuZGVyLCB7XG5cdFx0XHRcdFx0bmFtZTogbXNnLnNlbmRlcixcblx0XHRcdFx0XHRzdGF0ZTogXCJjb25uZWN0ZWRcIixcblx0XHRcdFx0XHRpc0hvc3Q6IGZhbHNlXG5cdFx0XHRcdH0pO1xuXHRcdFx0fSB9KSk7XG5cdFx0fVxuXHRcdGdldCBpZCgpIHtcblx0XHRcdHJldHVybiB0aGlzLl9pZDtcblx0XHR9XG5cdFx0Z2V0IG5hbWUoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fbmFtZTtcblx0XHR9XG5cdFx0Z2V0IHN0YXRlKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX3N0YXRlO1xuXHRcdH1cblx0XHRnZXQgdHJhbnNwb3J0VHlwZSgpIHtcblx0XHRcdHJldHVybiB0aGlzLl90cmFuc3BvcnRUeXBlO1xuXHRcdH1cblx0XHRnZXQgc3RhdHMoKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHQuLi50aGlzLl9zdGF0cyxcblx0XHRcdFx0dXB0aW1lOiB0aGlzLl9zdGFydFRpbWUgPyBEYXRlLm5vdygpIC0gdGhpcy5fc3RhcnRUaW1lIDogMFxuXHRcdFx0fTtcblx0XHR9XG5cdFx0Z2V0IHN0YXRlQ2hhbmdlcygpIHtcblx0XHRcdHJldHVybiB0aGlzLl9zdGF0ZUNoYW5nZXM7XG5cdFx0fVxuXHRcdGdldCBjb25uZWN0ZWRQZWVycygpIHtcblx0XHRcdHJldHVybiBbLi4udGhpcy5fY29ubmVjdGVkUGVlcnMua2V5cygpXTtcblx0XHR9XG5cdFx0Z2V0IG1ldGEoKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRpZDogdGhpcy5faWQsXG5cdFx0XHRcdG5hbWU6IHRoaXMuX25hbWUsXG5cdFx0XHRcdHN0YXRlOiB0aGlzLl9zdGF0ZSxcblx0XHRcdFx0aXNIb3N0OiBmYWxzZSxcblx0XHRcdFx0Y29ubmVjdGVkQ2hhbm5lbHM6IG5ldyBTZXQodGhpcy5fY29ubmVjdGVkUGVlcnMua2V5cygpKVxuXHRcdFx0fTtcblx0XHR9XG5cdH07XG5cdHZhciBDb25uZWN0aW9uUG9vbCA9IGNsYXNzIENvbm5lY3Rpb25Qb29sIHtcblx0XHRfY29ubmVjdGlvbnMgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuXHRcdHN0YXRpYyBfaW5zdGFuY2UgPSBudWxsO1xuXHRcdHN0YXRpYyBnZXRJbnN0YW5jZSgpIHtcblx0XHRcdGlmICghQ29ubmVjdGlvblBvb2wuX2luc3RhbmNlKSBDb25uZWN0aW9uUG9vbC5faW5zdGFuY2UgPSBuZXcgQ29ubmVjdGlvblBvb2woKTtcblx0XHRcdHJldHVybiBDb25uZWN0aW9uUG9vbC5faW5zdGFuY2U7XG5cdFx0fVxuXHRcdGdldE9yQ3JlYXRlKG5hbWUsIHRyYW5zcG9ydFR5cGUgPSBcImludGVybmFsXCIsIG9wdGlvbnMgPSB7fSkge1xuXHRcdFx0aWYgKCF0aGlzLl9jb25uZWN0aW9ucy5oYXMobmFtZSkpIHRoaXMuX2Nvbm5lY3Rpb25zLnNldChuYW1lLCBuZXcgQ2hhbm5lbENvbm5lY3Rpb24obmFtZSwgdHJhbnNwb3J0VHlwZSwgb3B0aW9ucykpO1xuXHRcdFx0cmV0dXJuIHRoaXMuX2Nvbm5lY3Rpb25zLmdldChuYW1lKTtcblx0XHR9XG5cdFx0Z2V0KG5hbWUpIHtcblx0XHRcdHJldHVybiB0aGlzLl9jb25uZWN0aW9ucy5nZXQobmFtZSk7XG5cdFx0fVxuXHRcdGhhcyhuYW1lKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY29ubmVjdGlvbnMuaGFzKG5hbWUpO1xuXHRcdH1cblx0XHRkZWxldGUobmFtZSkge1xuXHRcdFx0dGhpcy5fY29ubmVjdGlvbnMuZ2V0KG5hbWUpPy5jbG9zZSgpO1xuXHRcdFx0cmV0dXJuIHRoaXMuX2Nvbm5lY3Rpb25zLmRlbGV0ZShuYW1lKTtcblx0XHR9XG5cdFx0Y2xlYXIoKSB7XG5cdFx0XHR0aGlzLl9jb25uZWN0aW9ucy5mb3JFYWNoKChjKSA9PiBjLmNsb3NlKCkpO1xuXHRcdFx0dGhpcy5fY29ubmVjdGlvbnMuY2xlYXIoKTtcblx0XHR9XG5cdFx0Z2V0IHNpemUoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY29ubmVjdGlvbnMuc2l6ZTtcblx0XHR9XG5cdFx0Z2V0IG5hbWVzKCkge1xuXHRcdFx0cmV0dXJuIFsuLi50aGlzLl9jb25uZWN0aW9ucy5rZXlzKCldO1xuXHRcdH1cblx0fTtcblx0Y29uc3QgZ2V0Q29ubmVjdGlvblBvb2wgPSAoKSA9PiBDb25uZWN0aW9uUG9vbC5nZXRJbnN0YW5jZSgpO1xuXHRjb25zdCBnZXRDb25uZWN0aW9uID0gKG5hbWUsIHRyYW5zcG9ydFR5cGUsIG9wdGlvbnMpID0+IGdldENvbm5lY3Rpb25Qb29sKCkuZ2V0T3JDcmVhdGUobmFtZSwgdHJhbnNwb3J0VHlwZSwgb3B0aW9ucyk7XG5cbi8vIC4uL3VuaWZvcm0udHMvc3JjL25ld2VyL25leHQvc3RvcmFnZS9TdG9yYWdlLnRzXG4vKipcblx0KiBJbmRleGVkREIgSW50ZWdyYXRpb24gZm9yIENoYW5uZWwgU3lzdGVtXG5cdCpcblx0KiBQcm92aWRlcyBwZXJzaXN0ZW50IHN0b3JhZ2UgY2FwYWJpbGl0aWVzIGZvciBjaGFubmVsIGNvbW11bmljYXRpb246XG5cdCogLSBEZWZlcjogUXVldWUgbWVzc2FnZXMgZm9yIGxhdGVyIGRlbGl2ZXJ5XG5cdCogLSBQZW5kaW5nOiBUcmFjayBwZW5kaW5nIG9wZXJhdGlvbnNcblx0KiAtIE1haWxib3gvSW5ib3g6IFN0b3JlIG1lc3NhZ2VzIHBlciBjaGFubmVsXG5cdCogLSBUcmFuc2FjdGlvbnM6IEJhdGNoIG9wZXJhdGlvbnMgd2l0aCByb2xsYmFja1xuXHQqIC0gRXhjaGFuZ2U6IENvb3JkaW5hdGUgZGF0YSBiZXR3ZWVuIGNvbnRleHRzXG5cdCovXG5cdGNvbnN0IERCX05BTUUgPSBcInVuaWZvcm1fY2hhbm5lbHNcIjtcblx0Y29uc3QgREJfVkVSU0lPTiA9IDE7XG5cdGNvbnN0IFNUT1JFUyA9IHtcblx0XHRNRVNTQUdFUzogXCJtZXNzYWdlc1wiLFxuXHRcdE1BSUxCT1g6IFwibWFpbGJveFwiLFxuXHRcdFBFTkRJTkc6IFwicGVuZGluZ1wiLFxuXHRcdEVYQ0hBTkdFOiBcImV4Y2hhbmdlXCIsXG5cdFx0VFJBTlNBQ1RJT05TOiBcInRyYW5zYWN0aW9uc1wiXG5cdH07XG5cdC8qKlxuXHQqIEluZGV4ZWREQiBtYW5hZ2VyIGZvciBjaGFubmVsIHN0b3JhZ2Vcblx0Ki9cblx0dmFyIENoYW5uZWxTdG9yYWdlID0gY2xhc3Mge1xuXHRcdF9kYiA9IG51bGw7XG5cdFx0X2lzT3BlbiA9IGZhbHNlO1xuXHRcdF9vcGVuUHJvbWlzZSA9IG51bGw7XG5cdFx0X2NoYW5uZWxOYW1lO1xuXHRcdF9tZXNzYWdlVXBkYXRlcyA9IG5ldyBDaGFubmVsU3ViamVjdCgpO1xuXHRcdF9leGNoYW5nZVVwZGF0ZXMgPSBuZXcgQ2hhbm5lbFN1YmplY3QoKTtcblx0XHRjb25zdHJ1Y3RvcihjaGFubmVsTmFtZSkge1xuXHRcdFx0dGhpcy5fY2hhbm5lbE5hbWUgPSBjaGFubmVsTmFtZTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBPcGVuIGRhdGFiYXNlIGNvbm5lY3Rpb25cblx0XHQqL1xuXHRcdGFzeW5jIG9wZW4oKSB7XG5cdFx0XHRpZiAodGhpcy5fZGIgJiYgdGhpcy5faXNPcGVuKSByZXR1cm4gdGhpcy5fZGI7XG5cdFx0XHRpZiAodGhpcy5fb3BlblByb21pc2UpIHJldHVybiB0aGlzLl9vcGVuUHJvbWlzZTtcblx0XHRcdHRoaXMuX29wZW5Qcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0XHRjb25zdCByZXF1ZXN0ID0gaW5kZXhlZERCLm9wZW4oREJfTkFNRSwgREJfVkVSU0lPTik7XG5cdFx0XHRcdHJlcXVlc3Qub25lcnJvciA9ICgpID0+IHtcblx0XHRcdFx0XHR0aGlzLl9vcGVuUHJvbWlzZSA9IG51bGw7XG5cdFx0XHRcdFx0cmVqZWN0KC8qIEBfX1BVUkVfXyAqLyBuZXcgRXJyb3IoXCJGYWlsZWQgdG8gb3BlbiBJbmRleGVkREJcIikpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHRyZXF1ZXN0Lm9uc3VjY2VzcyA9ICgpID0+IHtcblx0XHRcdFx0XHR0aGlzLl9kYiA9IHJlcXVlc3QucmVzdWx0O1xuXHRcdFx0XHRcdHRoaXMuX2lzT3BlbiA9IHRydWU7XG5cdFx0XHRcdFx0dGhpcy5fb3BlblByb21pc2UgPSBudWxsO1xuXHRcdFx0XHRcdHJlc29sdmUodGhpcy5fZGIpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHRyZXF1ZXN0Lm9udXBncmFkZW5lZWRlZCA9IChldmVudCkgPT4ge1xuXHRcdFx0XHRcdGNvbnN0IGRiID0gZXZlbnQudGFyZ2V0LnJlc3VsdDtcblx0XHRcdFx0XHR0aGlzLl9jcmVhdGVTdG9yZXMoZGIpO1xuXHRcdFx0XHR9O1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gdGhpcy5fb3BlblByb21pc2U7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogQ2xvc2UgZGF0YWJhc2UgY29ubmVjdGlvblxuXHRcdCovXG5cdFx0Y2xvc2UoKSB7XG5cdFx0XHRpZiAodGhpcy5fZGIpIHtcblx0XHRcdFx0dGhpcy5fZGIuY2xvc2UoKTtcblx0XHRcdFx0dGhpcy5fZGIgPSBudWxsO1xuXHRcdFx0XHR0aGlzLl9pc09wZW4gPSBmYWxzZTtcblx0XHRcdH1cblx0XHR9XG5cdFx0X2NyZWF0ZVN0b3JlcyhkYikge1xuXHRcdFx0aWYgKCFkYi5vYmplY3RTdG9yZU5hbWVzLmNvbnRhaW5zKFNUT1JFUy5NRVNTQUdFUykpIHtcblx0XHRcdFx0Y29uc3QgbWVzc2FnZXNTdG9yZSA9IGRiLmNyZWF0ZU9iamVjdFN0b3JlKFNUT1JFUy5NRVNTQUdFUywgeyBrZXlQYXRoOiBcImlkXCIgfSk7XG5cdFx0XHRcdG1lc3NhZ2VzU3RvcmUuY3JlYXRlSW5kZXgoXCJjaGFubmVsXCIsIFwiY2hhbm5lbFwiLCB7IHVuaXF1ZTogZmFsc2UgfSk7XG5cdFx0XHRcdG1lc3NhZ2VzU3RvcmUuY3JlYXRlSW5kZXgoXCJzdGF0dXNcIiwgXCJzdGF0dXNcIiwgeyB1bmlxdWU6IGZhbHNlIH0pO1xuXHRcdFx0XHRtZXNzYWdlc1N0b3JlLmNyZWF0ZUluZGV4KFwicmVjaXBpZW50XCIsIFwicmVjaXBpZW50XCIsIHsgdW5pcXVlOiBmYWxzZSB9KTtcblx0XHRcdFx0bWVzc2FnZXNTdG9yZS5jcmVhdGVJbmRleChcImNyZWF0ZWRBdFwiLCBcImNyZWF0ZWRBdFwiLCB7IHVuaXF1ZTogZmFsc2UgfSk7XG5cdFx0XHRcdG1lc3NhZ2VzU3RvcmUuY3JlYXRlSW5kZXgoXCJjaGFubmVsX3N0YXR1c1wiLCBbXCJjaGFubmVsXCIsIFwic3RhdHVzXCJdLCB7IHVuaXF1ZTogZmFsc2UgfSk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoIWRiLm9iamVjdFN0b3JlTmFtZXMuY29udGFpbnMoU1RPUkVTLk1BSUxCT1gpKSB7XG5cdFx0XHRcdGNvbnN0IG1haWxib3hTdG9yZSA9IGRiLmNyZWF0ZU9iamVjdFN0b3JlKFNUT1JFUy5NQUlMQk9YLCB7IGtleVBhdGg6IFwiaWRcIiB9KTtcblx0XHRcdFx0bWFpbGJveFN0b3JlLmNyZWF0ZUluZGV4KFwiY2hhbm5lbFwiLCBcImNoYW5uZWxcIiwgeyB1bmlxdWU6IGZhbHNlIH0pO1xuXHRcdFx0XHRtYWlsYm94U3RvcmUuY3JlYXRlSW5kZXgoXCJwcmlvcml0eVwiLCBcInByaW9yaXR5XCIsIHsgdW5pcXVlOiBmYWxzZSB9KTtcblx0XHRcdFx0bWFpbGJveFN0b3JlLmNyZWF0ZUluZGV4KFwiZXhwaXJlc0F0XCIsIFwiZXhwaXJlc0F0XCIsIHsgdW5pcXVlOiBmYWxzZSB9KTtcblx0XHRcdH1cblx0XHRcdGlmICghZGIub2JqZWN0U3RvcmVOYW1lcy5jb250YWlucyhTVE9SRVMuUEVORElORykpIHtcblx0XHRcdFx0Y29uc3QgcGVuZGluZ1N0b3JlID0gZGIuY3JlYXRlT2JqZWN0U3RvcmUoU1RPUkVTLlBFTkRJTkcsIHsga2V5UGF0aDogXCJpZFwiIH0pO1xuXHRcdFx0XHRwZW5kaW5nU3RvcmUuY3JlYXRlSW5kZXgoXCJjaGFubmVsXCIsIFwiY2hhbm5lbFwiLCB7IHVuaXF1ZTogZmFsc2UgfSk7XG5cdFx0XHRcdHBlbmRpbmdTdG9yZS5jcmVhdGVJbmRleChcImNyZWF0ZWRBdFwiLCBcImNyZWF0ZWRBdFwiLCB7IHVuaXF1ZTogZmFsc2UgfSk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoIWRiLm9iamVjdFN0b3JlTmFtZXMuY29udGFpbnMoU1RPUkVTLkVYQ0hBTkdFKSkge1xuXHRcdFx0XHRjb25zdCBleGNoYW5nZVN0b3JlID0gZGIuY3JlYXRlT2JqZWN0U3RvcmUoU1RPUkVTLkVYQ0hBTkdFLCB7IGtleVBhdGg6IFwiaWRcIiB9KTtcblx0XHRcdFx0ZXhjaGFuZ2VTdG9yZS5jcmVhdGVJbmRleChcImtleVwiLCBcImtleVwiLCB7IHVuaXF1ZTogdHJ1ZSB9KTtcblx0XHRcdFx0ZXhjaGFuZ2VTdG9yZS5jcmVhdGVJbmRleChcIm93bmVyXCIsIFwib3duZXJcIiwgeyB1bmlxdWU6IGZhbHNlIH0pO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCFkYi5vYmplY3RTdG9yZU5hbWVzLmNvbnRhaW5zKFNUT1JFUy5UUkFOU0FDVElPTlMpKSBkYi5jcmVhdGVPYmplY3RTdG9yZShTVE9SRVMuVFJBTlNBQ1RJT05TLCB7IGtleVBhdGg6IFwiaWRcIiB9KS5jcmVhdGVJbmRleChcImNyZWF0ZWRBdFwiLCBcImNyZWF0ZWRBdFwiLCB7IHVuaXF1ZTogZmFsc2UgfSk7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogRGVmZXIgYSBtZXNzYWdlIGZvciBsYXRlciBkZWxpdmVyeVxuXHRcdCovXG5cdFx0YXN5bmMgZGVmZXIobWVzc2FnZSwgb3B0aW9ucyA9IHt9KSB7XG5cdFx0XHRjb25zdCBkYiA9IGF3YWl0IHRoaXMub3BlbigpO1xuXHRcdFx0Y29uc3Qgc3RvcmVkTWVzc2FnZSA9IHtcblx0XHRcdFx0aWQ6IFVVSUR2NCgpLFxuXHRcdFx0XHRjaGFubmVsOiBtZXNzYWdlLmNoYW5uZWwsXG5cdFx0XHRcdHNlbmRlcjogbWVzc2FnZS5zZW5kZXIgPz8gdGhpcy5fY2hhbm5lbE5hbWUsXG5cdFx0XHRcdHJlY2lwaWVudDogbWVzc2FnZS5jaGFubmVsLFxuXHRcdFx0XHR0eXBlOiBtZXNzYWdlLnR5cGUsXG5cdFx0XHRcdHBheWxvYWQ6IG1lc3NhZ2UucGF5bG9hZCxcblx0XHRcdFx0c3RhdHVzOiBcInBlbmRpbmdcIixcblx0XHRcdFx0cHJpb3JpdHk6IG9wdGlvbnMucHJpb3JpdHkgPz8gMCxcblx0XHRcdFx0Y3JlYXRlZEF0OiBEYXRlLm5vdygpLFxuXHRcdFx0XHR1cGRhdGVkQXQ6IERhdGUubm93KCksXG5cdFx0XHRcdGV4cGlyZXNBdDogb3B0aW9ucy5leHBpcmVzSW4gPyBEYXRlLm5vdygpICsgb3B0aW9ucy5leHBpcmVzSW4gOiBudWxsLFxuXHRcdFx0XHRyZXRyeUNvdW50OiAwLFxuXHRcdFx0XHRtYXhSZXRyaWVzOiBvcHRpb25zLm1heFJldHJpZXMgPz8gMyxcblx0XHRcdFx0bWV0YWRhdGE6IG9wdGlvbnMubWV0YWRhdGFcblx0XHRcdH07XG5cdFx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0XHRjb25zdCB0eCA9IGRiLnRyYW5zYWN0aW9uKFtTVE9SRVMuTUVTU0FHRVMsIFNUT1JFUy5NQUlMQk9YXSwgXCJyZWFkd3JpdGVcIik7XG5cdFx0XHRcdGNvbnN0IG1lc3NhZ2VzU3RvcmUgPSB0eC5vYmplY3RTdG9yZShTVE9SRVMuTUVTU0FHRVMpO1xuXHRcdFx0XHRjb25zdCBtYWlsYm94U3RvcmUgPSB0eC5vYmplY3RTdG9yZShTVE9SRVMuTUFJTEJPWCk7XG5cdFx0XHRcdG1lc3NhZ2VzU3RvcmUuYWRkKHN0b3JlZE1lc3NhZ2UpO1xuXHRcdFx0XHRtYWlsYm94U3RvcmUuYWRkKHN0b3JlZE1lc3NhZ2UpO1xuXHRcdFx0XHR0eC5vbmNvbXBsZXRlID0gKCkgPT4ge1xuXHRcdFx0XHRcdHRoaXMuX21lc3NhZ2VVcGRhdGVzLm5leHQoc3RvcmVkTWVzc2FnZSk7XG5cdFx0XHRcdFx0cmVzb2x2ZShzdG9yZWRNZXNzYWdlLmlkKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dHgub25lcnJvciA9ICgpID0+IHJlamVjdCgvKiBAX19QVVJFX18gKi8gbmV3IEVycm9yKFwiRmFpbGVkIHRvIGRlZmVyIG1lc3NhZ2VcIikpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogR2V0IGRlZmVycmVkIG1lc3NhZ2VzIGZvciBhIGNoYW5uZWxcblx0XHQqL1xuXHRcdGFzeW5jIGdldERlZmVycmVkTWVzc2FnZXMoY2hhbm5lbCwgb3B0aW9ucyA9IHt9KSB7XG5cdFx0XHRjb25zdCBkYiA9IGF3YWl0IHRoaXMub3BlbigpO1xuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdFx0Y29uc3Qgc3RvcmUgPSBkYi50cmFuc2FjdGlvbihTVE9SRVMuTUVTU0FHRVMsIFwicmVhZG9ubHlcIikub2JqZWN0U3RvcmUoU1RPUkVTLk1FU1NBR0VTKTtcblx0XHRcdFx0Y29uc3QgaW5kZXggPSBvcHRpb25zLnN0YXR1cyA/IHN0b3JlLmluZGV4KFwiY2hhbm5lbF9zdGF0dXNcIikgOiBzdG9yZS5pbmRleChcImNoYW5uZWxcIik7XG5cdFx0XHRcdGNvbnN0IHF1ZXJ5ID0gb3B0aW9ucy5zdGF0dXMgPyBJREJLZXlSYW5nZS5vbmx5KFtjaGFubmVsLCBvcHRpb25zLnN0YXR1c10pIDogSURCS2V5UmFuZ2Uub25seShjaGFubmVsKTtcblx0XHRcdFx0Y29uc3QgcmVxdWVzdCA9IGluZGV4LmdldEFsbChxdWVyeSwgb3B0aW9ucy5saW1pdCk7XG5cdFx0XHRcdHJlcXVlc3Qub25zdWNjZXNzID0gKCkgPT4ge1xuXHRcdFx0XHRcdGxldCByZXN1bHRzID0gcmVxdWVzdC5yZXN1bHQ7XG5cdFx0XHRcdFx0aWYgKG9wdGlvbnMub2Zmc2V0KSByZXN1bHRzID0gcmVzdWx0cy5zbGljZShvcHRpb25zLm9mZnNldCk7XG5cdFx0XHRcdFx0cmVzb2x2ZShyZXN1bHRzKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0cmVxdWVzdC5vbmVycm9yID0gKCkgPT4gcmVqZWN0KC8qIEBfX1BVUkVfXyAqLyBuZXcgRXJyb3IoXCJGYWlsZWQgdG8gZ2V0IGRlZmVycmVkIG1lc3NhZ2VzXCIpKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIFByb2Nlc3MgbmV4dCBwZW5kaW5nIG1lc3NhZ2Vcblx0XHQqL1xuXHRcdGFzeW5jIHByb2Nlc3NOZXh0UGVuZGluZyhjaGFubmVsKSB7XG5cdFx0XHRjb25zdCBkYiA9IGF3YWl0IHRoaXMub3BlbigpO1xuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdFx0Y29uc3QgcmVxdWVzdCA9IGRiLnRyYW5zYWN0aW9uKFNUT1JFUy5NRVNTQUdFUywgXCJyZWFkd3JpdGVcIikub2JqZWN0U3RvcmUoU1RPUkVTLk1FU1NBR0VTKS5pbmRleChcImNoYW5uZWxfc3RhdHVzXCIpLm9wZW5DdXJzb3IoSURCS2V5UmFuZ2Uub25seShbY2hhbm5lbCwgXCJwZW5kaW5nXCJdKSk7XG5cdFx0XHRcdHJlcXVlc3Qub25zdWNjZXNzID0gKCkgPT4ge1xuXHRcdFx0XHRcdGNvbnN0IGN1cnNvciA9IHJlcXVlc3QucmVzdWx0O1xuXHRcdFx0XHRcdGlmIChjdXJzb3IpIHtcblx0XHRcdFx0XHRcdGNvbnN0IG1lc3NhZ2UgPSBjdXJzb3IudmFsdWU7XG5cdFx0XHRcdFx0XHRtZXNzYWdlLnN0YXR1cyA9IFwicHJvY2Vzc2luZ1wiO1xuXHRcdFx0XHRcdFx0bWVzc2FnZS51cGRhdGVkQXQgPSBEYXRlLm5vdygpO1xuXHRcdFx0XHRcdFx0Y3Vyc29yLnVwZGF0ZShtZXNzYWdlKTtcblx0XHRcdFx0XHRcdHRoaXMuX21lc3NhZ2VVcGRhdGVzLm5leHQobWVzc2FnZSk7XG5cdFx0XHRcdFx0XHRyZXNvbHZlKG1lc3NhZ2UpO1xuXHRcdFx0XHRcdH0gZWxzZSByZXNvbHZlKG51bGwpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHRyZXF1ZXN0Lm9uZXJyb3IgPSAoKSA9PiByZWplY3QoLyogQF9fUFVSRV9fICovIG5ldyBFcnJvcihcIkZhaWxlZCB0byBwcm9jZXNzIHBlbmRpbmcgbWVzc2FnZVwiKSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBNYXJrIG1lc3NhZ2UgYXMgZGVsaXZlcmVkXG5cdFx0Ki9cblx0XHRhc3luYyBtYXJrRGVsaXZlcmVkKG1lc3NhZ2VJZCkge1xuXHRcdFx0YXdhaXQgdGhpcy5fdXBkYXRlTWVzc2FnZVN0YXR1cyhtZXNzYWdlSWQsIFwiZGVsaXZlcmVkXCIpO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIE1hcmsgbWVzc2FnZSBhcyBmYWlsZWQgYW5kIHJldHJ5IGlmIHBvc3NpYmxlXG5cdFx0Ki9cblx0XHRhc3luYyBtYXJrRmFpbGVkKG1lc3NhZ2VJZCkge1xuXHRcdFx0Y29uc3QgZGIgPSBhd2FpdCB0aGlzLm9wZW4oKTtcblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHRcdGNvbnN0IHN0b3JlID0gZGIudHJhbnNhY3Rpb24oU1RPUkVTLk1FU1NBR0VTLCBcInJlYWR3cml0ZVwiKS5vYmplY3RTdG9yZShTVE9SRVMuTUVTU0FHRVMpO1xuXHRcdFx0XHRjb25zdCByZXF1ZXN0ID0gc3RvcmUuZ2V0KG1lc3NhZ2VJZCk7XG5cdFx0XHRcdHJlcXVlc3Qub25zdWNjZXNzID0gKCkgPT4ge1xuXHRcdFx0XHRcdGNvbnN0IG1lc3NhZ2UgPSByZXF1ZXN0LnJlc3VsdDtcblx0XHRcdFx0XHRpZiAoIW1lc3NhZ2UpIHtcblx0XHRcdFx0XHRcdHJlc29sdmUoZmFsc2UpO1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRtZXNzYWdlLnJldHJ5Q291bnQrKztcblx0XHRcdFx0XHRtZXNzYWdlLnVwZGF0ZWRBdCA9IERhdGUubm93KCk7XG5cdFx0XHRcdFx0aWYgKG1lc3NhZ2UucmV0cnlDb3VudCA8IG1lc3NhZ2UubWF4UmV0cmllcykgbWVzc2FnZS5zdGF0dXMgPSBcInBlbmRpbmdcIjtcblx0XHRcdFx0XHRlbHNlIG1lc3NhZ2Uuc3RhdHVzID0gXCJmYWlsZWRcIjtcblx0XHRcdFx0XHRzdG9yZS5wdXQobWVzc2FnZSk7XG5cdFx0XHRcdFx0dGhpcy5fbWVzc2FnZVVwZGF0ZXMubmV4dChtZXNzYWdlKTtcblx0XHRcdFx0XHRyZXNvbHZlKG1lc3NhZ2Uuc3RhdHVzID09PSBcInBlbmRpbmdcIik7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHJlcXVlc3Qub25lcnJvciA9ICgpID0+IHJlamVjdCgvKiBAX19QVVJFX18gKi8gbmV3IEVycm9yKFwiRmFpbGVkIHRvIG1hcmsgbWVzc2FnZSBhcyBmYWlsZWRcIikpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdGFzeW5jIF91cGRhdGVNZXNzYWdlU3RhdHVzKG1lc3NhZ2VJZCwgc3RhdHVzKSB7XG5cdFx0XHRjb25zdCBkYiA9IGF3YWl0IHRoaXMub3BlbigpO1xuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdFx0Y29uc3Qgc3RvcmUgPSBkYi50cmFuc2FjdGlvbihTVE9SRVMuTUVTU0FHRVMsIFwicmVhZHdyaXRlXCIpLm9iamVjdFN0b3JlKFNUT1JFUy5NRVNTQUdFUyk7XG5cdFx0XHRcdGNvbnN0IHJlcXVlc3QgPSBzdG9yZS5nZXQobWVzc2FnZUlkKTtcblx0XHRcdFx0cmVxdWVzdC5vbnN1Y2Nlc3MgPSAoKSA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgbWVzc2FnZSA9IHJlcXVlc3QucmVzdWx0O1xuXHRcdFx0XHRcdGlmIChtZXNzYWdlKSB7XG5cdFx0XHRcdFx0XHRtZXNzYWdlLnN0YXR1cyA9IHN0YXR1cztcblx0XHRcdFx0XHRcdG1lc3NhZ2UudXBkYXRlZEF0ID0gRGF0ZS5ub3coKTtcblx0XHRcdFx0XHRcdHN0b3JlLnB1dChtZXNzYWdlKTtcblx0XHRcdFx0XHRcdHRoaXMuX21lc3NhZ2VVcGRhdGVzLm5leHQobWVzc2FnZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJlc29sdmUoKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0cmVxdWVzdC5vbmVycm9yID0gKCkgPT4gcmVqZWN0KC8qIEBfX1BVUkVfXyAqLyBuZXcgRXJyb3IoXCJGYWlsZWQgdG8gdXBkYXRlIG1lc3NhZ2Ugc3RhdHVzXCIpKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIEdldCBtYWlsYm94IGZvciBhIGNoYW5uZWxcblx0XHQqL1xuXHRcdGFzeW5jIGdldE1haWxib3goY2hhbm5lbCwgb3B0aW9ucyA9IHt9KSB7XG5cdFx0XHRjb25zdCBkYiA9IGF3YWl0IHRoaXMub3BlbigpO1xuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdFx0Y29uc3QgcmVxdWVzdCA9IGRiLnRyYW5zYWN0aW9uKFNUT1JFUy5NQUlMQk9YLCBcInJlYWRvbmx5XCIpLm9iamVjdFN0b3JlKFNUT1JFUy5NQUlMQk9YKS5pbmRleChcImNoYW5uZWxcIikuZ2V0QWxsKElEQktleVJhbmdlLm9ubHkoY2hhbm5lbCksIG9wdGlvbnMubGltaXQpO1xuXHRcdFx0XHRyZXF1ZXN0Lm9uc3VjY2VzcyA9ICgpID0+IHtcblx0XHRcdFx0XHRsZXQgcmVzdWx0cyA9IHJlcXVlc3QucmVzdWx0O1xuXHRcdFx0XHRcdGlmIChvcHRpb25zLnNvcnRCeSA9PT0gXCJwcmlvcml0eVwiKSByZXN1bHRzLnNvcnQoKGEsIGIpID0+IGIucHJpb3JpdHkgLSBhLnByaW9yaXR5KTtcblx0XHRcdFx0XHRlbHNlIHJlc3VsdHMuc29ydCgoYSwgYikgPT4gYi5jcmVhdGVkQXQgLSBhLmNyZWF0ZWRBdCk7XG5cdFx0XHRcdFx0cmVzb2x2ZShyZXN1bHRzKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0cmVxdWVzdC5vbmVycm9yID0gKCkgPT4gcmVqZWN0KC8qIEBfX1BVUkVfXyAqLyBuZXcgRXJyb3IoXCJGYWlsZWQgdG8gZ2V0IG1haWxib3hcIikpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogR2V0IG1haWxib3ggc3RhdGlzdGljc1xuXHRcdCovXG5cdFx0YXN5bmMgZ2V0TWFpbGJveFN0YXRzKGNoYW5uZWwpIHtcblx0XHRcdGNvbnN0IG1lc3NhZ2VzID0gYXdhaXQgdGhpcy5nZXREZWZlcnJlZE1lc3NhZ2VzKGNoYW5uZWwpO1xuXHRcdFx0Y29uc3Qgc3RhdHMgPSB7XG5cdFx0XHRcdHRvdGFsOiBtZXNzYWdlcy5sZW5ndGgsXG5cdFx0XHRcdHBlbmRpbmc6IDAsXG5cdFx0XHRcdHByb2Nlc3Npbmc6IDAsXG5cdFx0XHRcdGRlbGl2ZXJlZDogMCxcblx0XHRcdFx0ZmFpbGVkOiAwLFxuXHRcdFx0XHRleHBpcmVkOiAwXG5cdFx0XHR9O1xuXHRcdFx0Y29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcblx0XHRcdGZvciAoY29uc3QgbXNnIG9mIG1lc3NhZ2VzKSBpZiAobXNnLmV4cGlyZXNBdCAmJiBtc2cuZXhwaXJlc0F0IDwgbm93KSBzdGF0cy5leHBpcmVkKys7XG5cdFx0XHRlbHNlIHN0YXRzW21zZy5zdGF0dXNdKys7XG5cdFx0XHRyZXR1cm4gc3RhdHM7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogQ2xlYXIgbWFpbGJveCBmb3IgYSBjaGFubmVsXG5cdFx0Ki9cblx0XHRhc3luYyBjbGVhck1haWxib3goY2hhbm5lbCkge1xuXHRcdFx0Y29uc3QgZGIgPSBhd2FpdCB0aGlzLm9wZW4oKTtcblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHRcdGNvbnN0IHR4ID0gZGIudHJhbnNhY3Rpb24oU1RPUkVTLk1BSUxCT1gsIFwicmVhZHdyaXRlXCIpO1xuXHRcdFx0XHRjb25zdCBpbmRleCA9IHR4Lm9iamVjdFN0b3JlKFNUT1JFUy5NQUlMQk9YKS5pbmRleChcImNoYW5uZWxcIik7XG5cdFx0XHRcdGxldCBkZWxldGVkQ291bnQgPSAwO1xuXHRcdFx0XHRjb25zdCByZXF1ZXN0ID0gaW5kZXgub3BlbkN1cnNvcihJREJLZXlSYW5nZS5vbmx5KGNoYW5uZWwpKTtcblx0XHRcdFx0cmVxdWVzdC5vbnN1Y2Nlc3MgPSAoKSA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgY3Vyc29yID0gcmVxdWVzdC5yZXN1bHQ7XG5cdFx0XHRcdFx0aWYgKGN1cnNvcikge1xuXHRcdFx0XHRcdFx0Y3Vyc29yLmRlbGV0ZSgpO1xuXHRcdFx0XHRcdFx0ZGVsZXRlZENvdW50Kys7XG5cdFx0XHRcdFx0XHRjdXJzb3IuY29udGludWUoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cdFx0XHRcdHR4Lm9uY29tcGxldGUgPSAoKSA9PiByZXNvbHZlKGRlbGV0ZWRDb3VudCk7XG5cdFx0XHRcdHR4Lm9uZXJyb3IgPSAoKSA9PiByZWplY3QoLyogQF9fUFVSRV9fICovIG5ldyBFcnJvcihcIkZhaWxlZCB0byBjbGVhciBtYWlsYm94XCIpKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIFJlZ2lzdGVyIGEgcGVuZGluZyBvcGVyYXRpb25cblx0XHQqL1xuXHRcdGFzeW5jIHJlZ2lzdGVyUGVuZGluZyhvcGVyYXRpb24pIHtcblx0XHRcdGNvbnN0IGRiID0gYXdhaXQgdGhpcy5vcGVuKCk7XG5cdFx0XHRjb25zdCBwZW5kaW5nID0ge1xuXHRcdFx0XHRpZDogVVVJRHY0KCksXG5cdFx0XHRcdGNoYW5uZWw6IHRoaXMuX2NoYW5uZWxOYW1lLFxuXHRcdFx0XHR0eXBlOiBvcGVyYXRpb24udHlwZSxcblx0XHRcdFx0ZGF0YTogb3BlcmF0aW9uLmRhdGEsXG5cdFx0XHRcdG1ldGFkYXRhOiBvcGVyYXRpb24ubWV0YWRhdGEsXG5cdFx0XHRcdGNyZWF0ZWRBdDogRGF0ZS5ub3coKSxcblx0XHRcdFx0c3RhdHVzOiBcInBlbmRpbmdcIlxuXHRcdFx0fTtcblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHRcdGNvbnN0IHR4ID0gZGIudHJhbnNhY3Rpb24oU1RPUkVTLlBFTkRJTkcsIFwicmVhZHdyaXRlXCIpO1xuXHRcdFx0XHR0eC5vYmplY3RTdG9yZShTVE9SRVMuUEVORElORykuYWRkKHBlbmRpbmcpO1xuXHRcdFx0XHR0eC5vbmNvbXBsZXRlID0gKCkgPT4gcmVzb2x2ZShwZW5kaW5nLmlkKTtcblx0XHRcdFx0dHgub25lcnJvciA9ICgpID0+IHJlamVjdCgvKiBAX19QVVJFX18gKi8gbmV3IEVycm9yKFwiRmFpbGVkIHRvIHJlZ2lzdGVyIHBlbmRpbmcgb3BlcmF0aW9uXCIpKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIEdldCBhbGwgcGVuZGluZyBvcGVyYXRpb25zIGZvciBjaGFubmVsXG5cdFx0Ki9cblx0XHRhc3luYyBnZXRQZW5kaW5nT3BlcmF0aW9ucygpIHtcblx0XHRcdGNvbnN0IGRiID0gYXdhaXQgdGhpcy5vcGVuKCk7XG5cdFx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0XHRjb25zdCByZXF1ZXN0ID0gZGIudHJhbnNhY3Rpb24oU1RPUkVTLlBFTkRJTkcsIFwicmVhZG9ubHlcIikub2JqZWN0U3RvcmUoU1RPUkVTLlBFTkRJTkcpLmluZGV4KFwiY2hhbm5lbFwiKS5nZXRBbGwoSURCS2V5UmFuZ2Uub25seSh0aGlzLl9jaGFubmVsTmFtZSkpO1xuXHRcdFx0XHRyZXF1ZXN0Lm9uc3VjY2VzcyA9ICgpID0+IHJlc29sdmUocmVxdWVzdC5yZXN1bHQpO1xuXHRcdFx0XHRyZXF1ZXN0Lm9uZXJyb3IgPSAoKSA9PiByZWplY3QoLyogQF9fUFVSRV9fICovIG5ldyBFcnJvcihcIkZhaWxlZCB0byBnZXQgcGVuZGluZyBvcGVyYXRpb25zXCIpKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIENvbXBsZXRlIGEgcGVuZGluZyBvcGVyYXRpb25cblx0XHQqL1xuXHRcdGFzeW5jIGNvbXBsZXRlUGVuZGluZyhvcGVyYXRpb25JZCkge1xuXHRcdFx0Y29uc3QgZGIgPSBhd2FpdCB0aGlzLm9wZW4oKTtcblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHRcdGNvbnN0IHR4ID0gZGIudHJhbnNhY3Rpb24oU1RPUkVTLlBFTkRJTkcsIFwicmVhZHdyaXRlXCIpO1xuXHRcdFx0XHR0eC5vYmplY3RTdG9yZShTVE9SRVMuUEVORElORykuZGVsZXRlKG9wZXJhdGlvbklkKTtcblx0XHRcdFx0dHgub25jb21wbGV0ZSA9ICgpID0+IHJlc29sdmUoKTtcblx0XHRcdFx0dHgub25lcnJvciA9ICgpID0+IHJlamVjdCgvKiBAX19QVVJFX18gKi8gbmV3IEVycm9yKFwiRmFpbGVkIHRvIGNvbXBsZXRlIHBlbmRpbmcgb3BlcmF0aW9uXCIpKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIEF3YWl0IGEgcGVuZGluZyBvcGVyYXRpb24gKHBvbGwgdW50aWwgY29tcGxldGUgb3IgdGltZW91dClcblx0XHQqL1xuXHRcdGFzeW5jIGF3YWl0UGVuZGluZyhvcGVyYXRpb25JZCwgb3B0aW9ucyA9IHt9KSB7XG5cdFx0XHRjb25zdCB0aW1lb3V0ID0gb3B0aW9ucy50aW1lb3V0ID8/IDNlNDtcblx0XHRcdGNvbnN0IHBvbGxJbnRlcnZhbCA9IG9wdGlvbnMucG9sbEludGVydmFsID8/IDEwMDtcblx0XHRcdGNvbnN0IHN0YXJ0VGltZSA9IERhdGUubm93KCk7XG5cdFx0XHR3aGlsZSAoRGF0ZS5ub3coKSAtIHN0YXJ0VGltZSA8IHRpbWVvdXQpIHtcblx0XHRcdFx0Y29uc3QgcGVuZGluZyA9IGF3YWl0IHRoaXMuX2dldFBlbmRpbmdCeUlkKG9wZXJhdGlvbklkKTtcblx0XHRcdFx0aWYgKCFwZW5kaW5nKSByZXR1cm4gbnVsbDtcblx0XHRcdFx0aWYgKHBlbmRpbmcuc3RhdHVzID09PSBcImNvbXBsZXRlZFwiKSB7XG5cdFx0XHRcdFx0YXdhaXQgdGhpcy5jb21wbGV0ZVBlbmRpbmcob3BlcmF0aW9uSWQpO1xuXHRcdFx0XHRcdHJldHVybiBwZW5kaW5nLnJlc3VsdDtcblx0XHRcdFx0fVxuXHRcdFx0XHRhd2FpdCBuZXcgUHJvbWlzZSgocikgPT4gc2V0VGltZW91dChyLCBwb2xsSW50ZXJ2YWwpKTtcblx0XHRcdH1cblx0XHRcdHRocm93IG5ldyBFcnJvcihgUGVuZGluZyBvcGVyYXRpb24gJHtvcGVyYXRpb25JZH0gdGltZWQgb3V0YCk7XG5cdFx0fVxuXHRcdGFzeW5jIF9nZXRQZW5kaW5nQnlJZChpZCkge1xuXHRcdFx0Y29uc3QgZGIgPSBhd2FpdCB0aGlzLm9wZW4oKTtcblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHRcdGNvbnN0IHJlcXVlc3QgPSBkYi50cmFuc2FjdGlvbihTVE9SRVMuUEVORElORywgXCJyZWFkb25seVwiKS5vYmplY3RTdG9yZShTVE9SRVMuUEVORElORykuZ2V0KGlkKTtcblx0XHRcdFx0cmVxdWVzdC5vbnN1Y2Nlc3MgPSAoKSA9PiByZXNvbHZlKHJlcXVlc3QucmVzdWx0ID8/IG51bGwpO1xuXHRcdFx0XHRyZXF1ZXN0Lm9uZXJyb3IgPSAoKSA9PiByZWplY3QoLyogQF9fUFVSRV9fICovIG5ldyBFcnJvcihcIkZhaWxlZCB0byBnZXQgcGVuZGluZyBvcGVyYXRpb25cIikpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogUHV0IGRhdGEgaW4gZXhjaGFuZ2UgKHNoYXJlZCBzdG9yYWdlKVxuXHRcdCovXG5cdFx0YXN5bmMgZXhjaGFuZ2VQdXQoa2V5LCB2YWx1ZSwgb3B0aW9ucyA9IHt9KSB7XG5cdFx0XHRjb25zdCBkYiA9IGF3YWl0IHRoaXMub3BlbigpO1xuXHRcdFx0Y29uc3QgcmVjb3JkID0ge1xuXHRcdFx0XHRpZDogVVVJRHY0KCksXG5cdFx0XHRcdGtleSxcblx0XHRcdFx0dmFsdWUsXG5cdFx0XHRcdG93bmVyOiB0aGlzLl9jaGFubmVsTmFtZSxcblx0XHRcdFx0c2hhcmVkV2l0aDogb3B0aW9ucy5zaGFyZWRXaXRoID8/IFtcIipcIl0sXG5cdFx0XHRcdHZlcnNpb246IDEsXG5cdFx0XHRcdGNyZWF0ZWRBdDogRGF0ZS5ub3coKSxcblx0XHRcdFx0dXBkYXRlZEF0OiBEYXRlLm5vdygpXG5cdFx0XHR9O1xuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdFx0Y29uc3QgdHggPSBkYi50cmFuc2FjdGlvbihTVE9SRVMuRVhDSEFOR0UsIFwicmVhZHdyaXRlXCIpO1xuXHRcdFx0XHRjb25zdCBzdG9yZSA9IHR4Lm9iamVjdFN0b3JlKFNUT1JFUy5FWENIQU5HRSk7XG5cdFx0XHRcdGNvbnN0IGdldFJlcXVlc3QgPSBzdG9yZS5pbmRleChcImtleVwiKS5nZXQoa2V5KTtcblx0XHRcdFx0Z2V0UmVxdWVzdC5vbnN1Y2Nlc3MgPSAoKSA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgZXhpc3RpbmcgPSBnZXRSZXF1ZXN0LnJlc3VsdDtcblx0XHRcdFx0XHRpZiAoZXhpc3RpbmcpIHtcblx0XHRcdFx0XHRcdHJlY29yZC5pZCA9IGV4aXN0aW5nLmlkO1xuXHRcdFx0XHRcdFx0cmVjb3JkLnZlcnNpb24gPSBleGlzdGluZy52ZXJzaW9uICsgMTtcblx0XHRcdFx0XHRcdHJlY29yZC5jcmVhdGVkQXQgPSBleGlzdGluZy5jcmVhdGVkQXQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHN0b3JlLnB1dChyZWNvcmQpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR0eC5vbmNvbXBsZXRlID0gKCkgPT4ge1xuXHRcdFx0XHRcdHRoaXMuX2V4Y2hhbmdlVXBkYXRlcy5uZXh0KHJlY29yZCk7XG5cdFx0XHRcdFx0cmVzb2x2ZShyZWNvcmQuaWQpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR0eC5vbmVycm9yID0gKCkgPT4gcmVqZWN0KC8qIEBfX1BVUkVfXyAqLyBuZXcgRXJyb3IoXCJGYWlsZWQgdG8gcHV0IGV4Y2hhbmdlIGRhdGFcIikpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogR2V0IGRhdGEgZnJvbSBleGNoYW5nZVxuXHRcdCovXG5cdFx0YXN5bmMgZXhjaGFuZ2VHZXQoa2V5KSB7XG5cdFx0XHRjb25zdCBkYiA9IGF3YWl0IHRoaXMub3BlbigpO1xuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdFx0Y29uc3QgcmVxdWVzdCA9IGRiLnRyYW5zYWN0aW9uKFNUT1JFUy5FWENIQU5HRSwgXCJyZWFkb25seVwiKS5vYmplY3RTdG9yZShTVE9SRVMuRVhDSEFOR0UpLmluZGV4KFwia2V5XCIpLmdldChrZXkpO1xuXHRcdFx0XHRyZXF1ZXN0Lm9uc3VjY2VzcyA9ICgpID0+IHtcblx0XHRcdFx0XHRjb25zdCByZWNvcmQgPSByZXF1ZXN0LnJlc3VsdDtcblx0XHRcdFx0XHRpZiAoIXJlY29yZCkge1xuXHRcdFx0XHRcdFx0cmVzb2x2ZShudWxsKTtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKCF0aGlzLl9jYW5BY2Nlc3NFeGNoYW5nZShyZWNvcmQpKSB7XG5cdFx0XHRcdFx0XHRyZXNvbHZlKG51bGwpO1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXNvbHZlKHJlY29yZC52YWx1ZSk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHJlcXVlc3Qub25lcnJvciA9ICgpID0+IHJlamVjdCgvKiBAX19QVVJFX18gKi8gbmV3IEVycm9yKFwiRmFpbGVkIHRvIGdldCBleGNoYW5nZSBkYXRhXCIpKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIERlbGV0ZSBkYXRhIGZyb20gZXhjaGFuZ2Vcblx0XHQqL1xuXHRcdGFzeW5jIGV4Y2hhbmdlRGVsZXRlKGtleSkge1xuXHRcdFx0Y29uc3QgZGIgPSBhd2FpdCB0aGlzLm9wZW4oKTtcblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHRcdGNvbnN0IHR4ID0gZGIudHJhbnNhY3Rpb24oU1RPUkVTLkVYQ0hBTkdFLCBcInJlYWR3cml0ZVwiKTtcblx0XHRcdFx0Y29uc3Qgc3RvcmUgPSB0eC5vYmplY3RTdG9yZShTVE9SRVMuRVhDSEFOR0UpO1xuXHRcdFx0XHRjb25zdCBnZXRSZXF1ZXN0ID0gc3RvcmUuaW5kZXgoXCJrZXlcIikuZ2V0KGtleSk7XG5cdFx0XHRcdGdldFJlcXVlc3Qub25zdWNjZXNzID0gKCkgPT4ge1xuXHRcdFx0XHRcdGNvbnN0IHJlY29yZCA9IGdldFJlcXVlc3QucmVzdWx0O1xuXHRcdFx0XHRcdGlmICghcmVjb3JkKSB7XG5cdFx0XHRcdFx0XHRyZXNvbHZlKGZhbHNlKTtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKHJlY29yZC5vd25lciAhPT0gdGhpcy5fY2hhbm5lbE5hbWUpIHtcblx0XHRcdFx0XHRcdHJlc29sdmUoZmFsc2UpO1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRzdG9yZS5kZWxldGUocmVjb3JkLmlkKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dHgub25jb21wbGV0ZSA9ICgpID0+IHJlc29sdmUodHJ1ZSk7XG5cdFx0XHRcdHR4Lm9uZXJyb3IgPSAoKSA9PiByZWplY3QoLyogQF9fUFVSRV9fICovIG5ldyBFcnJvcihcIkZhaWxlZCB0byBkZWxldGUgZXhjaGFuZ2UgZGF0YVwiKSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBBY3F1aXJlIGxvY2sgb24gZXhjaGFuZ2Uga2V5XG5cdFx0Ki9cblx0XHRhc3luYyBleGNoYW5nZUxvY2soa2V5LCBvcHRpb25zID0ge30pIHtcblx0XHRcdGNvbnN0IGRiID0gYXdhaXQgdGhpcy5vcGVuKCk7XG5cdFx0XHRjb25zdCB0aW1lb3V0ID0gb3B0aW9ucy50aW1lb3V0ID8/IDNlNDtcblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHRcdGNvbnN0IHR4ID0gZGIudHJhbnNhY3Rpb24oU1RPUkVTLkVYQ0hBTkdFLCBcInJlYWR3cml0ZVwiKTtcblx0XHRcdFx0Y29uc3Qgc3RvcmUgPSB0eC5vYmplY3RTdG9yZShTVE9SRVMuRVhDSEFOR0UpO1xuXHRcdFx0XHRjb25zdCByZXF1ZXN0ID0gc3RvcmUuaW5kZXgoXCJrZXlcIikuZ2V0KGtleSk7XG5cdFx0XHRcdHJlcXVlc3Qub25zdWNjZXNzID0gKCkgPT4ge1xuXHRcdFx0XHRcdGNvbnN0IHJlY29yZCA9IHJlcXVlc3QucmVzdWx0O1xuXHRcdFx0XHRcdGlmICghcmVjb3JkKSB7XG5cdFx0XHRcdFx0XHRyZXNvbHZlKGZhbHNlKTtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKHJlY29yZC5sb2NrICYmIHJlY29yZC5sb2NrLmhvbGRlciAhPT0gdGhpcy5fY2hhbm5lbE5hbWUpIHtcblx0XHRcdFx0XHRcdGlmIChyZWNvcmQubG9jay5leHBpcmVzQXQgPiBEYXRlLm5vdygpKSB7XG5cdFx0XHRcdFx0XHRcdHJlc29sdmUoZmFsc2UpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJlY29yZC5sb2NrID0ge1xuXHRcdFx0XHRcdFx0aG9sZGVyOiB0aGlzLl9jaGFubmVsTmFtZSxcblx0XHRcdFx0XHRcdGFjcXVpcmVkQXQ6IERhdGUubm93KCksXG5cdFx0XHRcdFx0XHRleHBpcmVzQXQ6IERhdGUubm93KCkgKyB0aW1lb3V0XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRyZWNvcmQudXBkYXRlZEF0ID0gRGF0ZS5ub3coKTtcblx0XHRcdFx0XHRzdG9yZS5wdXQocmVjb3JkKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dHgub25jb21wbGV0ZSA9ICgpID0+IHJlc29sdmUodHJ1ZSk7XG5cdFx0XHRcdHR4Lm9uZXJyb3IgPSAoKSA9PiByZWplY3QoLyogQF9fUFVSRV9fICovIG5ldyBFcnJvcihcIkZhaWxlZCB0byBhY3F1aXJlIGxvY2tcIikpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogUmVsZWFzZSBsb2NrIG9uIGV4Y2hhbmdlIGtleVxuXHRcdCovXG5cdFx0YXN5bmMgZXhjaGFuZ2VVbmxvY2soa2V5KSB7XG5cdFx0XHRjb25zdCBkYiA9IGF3YWl0IHRoaXMub3BlbigpO1xuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdFx0Y29uc3QgdHggPSBkYi50cmFuc2FjdGlvbihTVE9SRVMuRVhDSEFOR0UsIFwicmVhZHdyaXRlXCIpO1xuXHRcdFx0XHRjb25zdCBzdG9yZSA9IHR4Lm9iamVjdFN0b3JlKFNUT1JFUy5FWENIQU5HRSk7XG5cdFx0XHRcdGNvbnN0IHJlcXVlc3QgPSBzdG9yZS5pbmRleChcImtleVwiKS5nZXQoa2V5KTtcblx0XHRcdFx0cmVxdWVzdC5vbnN1Y2Nlc3MgPSAoKSA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgcmVjb3JkID0gcmVxdWVzdC5yZXN1bHQ7XG5cdFx0XHRcdFx0aWYgKHJlY29yZCAmJiByZWNvcmQubG9jaz8uaG9sZGVyID09PSB0aGlzLl9jaGFubmVsTmFtZSkge1xuXHRcdFx0XHRcdFx0ZGVsZXRlIHJlY29yZC5sb2NrO1xuXHRcdFx0XHRcdFx0cmVjb3JkLnVwZGF0ZWRBdCA9IERhdGUubm93KCk7XG5cdFx0XHRcdFx0XHRzdG9yZS5wdXQocmVjb3JkKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cdFx0XHRcdHR4Lm9uY29tcGxldGUgPSAoKSA9PiByZXNvbHZlKCk7XG5cdFx0XHRcdHR4Lm9uZXJyb3IgPSAoKSA9PiByZWplY3QoLyogQF9fUFVSRV9fICovIG5ldyBFcnJvcihcIkZhaWxlZCB0byByZWxlYXNlIGxvY2tcIikpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdF9jYW5BY2Nlc3NFeGNoYW5nZShyZWNvcmQpIHtcblx0XHRcdGlmIChyZWNvcmQub3duZXIgPT09IHRoaXMuX2NoYW5uZWxOYW1lKSByZXR1cm4gdHJ1ZTtcblx0XHRcdGlmIChyZWNvcmQuc2hhcmVkV2l0aC5pbmNsdWRlcyhcIipcIikpIHJldHVybiB0cnVlO1xuXHRcdFx0cmV0dXJuIHJlY29yZC5zaGFyZWRXaXRoLmluY2x1ZGVzKHRoaXMuX2NoYW5uZWxOYW1lKTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBCZWdpbiBhIHRyYW5zYWN0aW9uIGZvciBiYXRjaCBvcGVyYXRpb25zXG5cdFx0Ki9cblx0XHRhc3luYyBiZWdpblRyYW5zYWN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIG5ldyBDaGFubmVsVHJhbnNhY3Rpb24odGhpcyk7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogRXhlY3V0ZSBvcGVyYXRpb25zIGluIHRyYW5zYWN0aW9uXG5cdFx0Ki9cblx0XHRhc3luYyBleGVjdXRlVHJhbnNhY3Rpb24ob3BlcmF0aW9ucykge1xuXHRcdFx0Y29uc3QgZGIgPSBhd2FpdCB0aGlzLm9wZW4oKTtcblx0XHRcdGNvbnN0IHN0b3JlTmFtZXMgPSBuZXcgU2V0KG9wZXJhdGlvbnMubWFwKChvcCkgPT4gb3Auc3RvcmUpKTtcblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHRcdGNvbnN0IHR4ID0gZGIudHJhbnNhY3Rpb24oQXJyYXkuZnJvbShzdG9yZU5hbWVzKSwgXCJyZWFkd3JpdGVcIik7XG5cdFx0XHRcdGZvciAoY29uc3Qgb3Agb2Ygb3BlcmF0aW9ucykge1xuXHRcdFx0XHRcdGNvbnN0IHN0b3JlID0gdHgub2JqZWN0U3RvcmUob3Auc3RvcmUpO1xuXHRcdFx0XHRcdHN3aXRjaCAob3AudHlwZSkge1xuXHRcdFx0XHRcdFx0Y2FzZSBcInB1dFwiOlxuXHRcdFx0XHRcdFx0XHRpZiAob3AudmFsdWUgIT09IHZvaWQgMCkgc3RvcmUucHV0KG9wLnZhbHVlKTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlIFwiZGVsZXRlXCI6XG5cdFx0XHRcdFx0XHRcdGlmIChvcC5rZXkgIT09IHZvaWQgMCkgc3RvcmUuZGVsZXRlKG9wLmtleSk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSBcInVwZGF0ZVwiOiBpZiAob3Aua2V5ICE9PSB2b2lkIDApIHtcblx0XHRcdFx0XHRcdFx0Y29uc3QgZ2V0UmVxID0gc3RvcmUuZ2V0KG9wLmtleSk7XG5cdFx0XHRcdFx0XHRcdGdldFJlcS5vbnN1Y2Nlc3MgPSAoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKGdldFJlcS5yZXN1bHQgJiYgb3AudmFsdWUpIHN0b3JlLnB1dCh7XG5cdFx0XHRcdFx0XHRcdFx0XHQuLi5nZXRSZXEucmVzdWx0LFxuXHRcdFx0XHRcdFx0XHRcdFx0Li4ub3AudmFsdWVcblx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0dHgub25jb21wbGV0ZSA9ICgpID0+IHJlc29sdmUoKTtcblx0XHRcdFx0dHgub25lcnJvciA9ICgpID0+IHJlamVjdCgvKiBAX19QVVJFX18gKi8gbmV3IEVycm9yKFwiVHJhbnNhY3Rpb24gZmFpbGVkXCIpKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIFN1YnNjcmliZSB0byBtZXNzYWdlIHVwZGF0ZXNcblx0XHQqL1xuXHRcdG9uTWVzc2FnZVVwZGF0ZShoYW5kbGVyKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fbWVzc2FnZVVwZGF0ZXMuc3Vic2NyaWJlKHsgbmV4dDogaGFuZGxlciB9KTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBTdWJzY3JpYmUgdG8gZXhjaGFuZ2UgdXBkYXRlc1xuXHRcdCovXG5cdFx0b25FeGNoYW5nZVVwZGF0ZShoYW5kbGVyKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fZXhjaGFuZ2VVcGRhdGVzLnN1YnNjcmliZSh7IG5leHQ6IGhhbmRsZXIgfSk7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogQ2xlYW4gdXAgZXhwaXJlZCBtZXNzYWdlc1xuXHRcdCovXG5cdFx0YXN5bmMgY2xlYW51cEV4cGlyZWQoKSB7XG5cdFx0XHRjb25zdCBkYiA9IGF3YWl0IHRoaXMub3BlbigpO1xuXHRcdFx0Y29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHRcdGNvbnN0IHR4ID0gZGIudHJhbnNhY3Rpb24oW1NUT1JFUy5NRVNTQUdFUywgU1RPUkVTLk1BSUxCT1hdLCBcInJlYWR3cml0ZVwiKTtcblx0XHRcdFx0Y29uc3QgbWVzc2FnZXNTdG9yZSA9IHR4Lm9iamVjdFN0b3JlKFNUT1JFUy5NRVNTQUdFUyk7XG5cdFx0XHRcdGNvbnN0IG1haWxib3hTdG9yZSA9IHR4Lm9iamVjdFN0b3JlKFNUT1JFUy5NQUlMQk9YKTtcblx0XHRcdFx0bGV0IGRlbGV0ZWRDb3VudCA9IDA7XG5cdFx0XHRcdGNvbnN0IG1zZ1JlcXVlc3QgPSBtZXNzYWdlc1N0b3JlLm9wZW5DdXJzb3IoKTtcblx0XHRcdFx0bXNnUmVxdWVzdC5vbnN1Y2Nlc3MgPSAoKSA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgY3Vyc29yID0gbXNnUmVxdWVzdC5yZXN1bHQ7XG5cdFx0XHRcdFx0aWYgKGN1cnNvcikge1xuXHRcdFx0XHRcdFx0Y29uc3QgbXNnID0gY3Vyc29yLnZhbHVlO1xuXHRcdFx0XHRcdFx0aWYgKG1zZy5leHBpcmVzQXQgJiYgbXNnLmV4cGlyZXNBdCA8IG5vdykge1xuXHRcdFx0XHRcdFx0XHRjdXJzb3IuZGVsZXRlKCk7XG5cdFx0XHRcdFx0XHRcdGRlbGV0ZWRDb3VudCsrO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0Y3Vyc29yLmNvbnRpbnVlKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXHRcdFx0XHRjb25zdCBtYWlsUmVxdWVzdCA9IG1haWxib3hTdG9yZS5vcGVuQ3Vyc29yKCk7XG5cdFx0XHRcdG1haWxSZXF1ZXN0Lm9uc3VjY2VzcyA9ICgpID0+IHtcblx0XHRcdFx0XHRjb25zdCBjdXJzb3IgPSBtYWlsUmVxdWVzdC5yZXN1bHQ7XG5cdFx0XHRcdFx0aWYgKGN1cnNvcikge1xuXHRcdFx0XHRcdFx0Y29uc3QgbXNnID0gY3Vyc29yLnZhbHVlO1xuXHRcdFx0XHRcdFx0aWYgKG1zZy5leHBpcmVzQXQgJiYgbXNnLmV4cGlyZXNBdCA8IG5vdykge1xuXHRcdFx0XHRcdFx0XHRjdXJzb3IuZGVsZXRlKCk7XG5cdFx0XHRcdFx0XHRcdGRlbGV0ZWRDb3VudCsrO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0Y3Vyc29yLmNvbnRpbnVlKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXHRcdFx0XHR0eC5vbmNvbXBsZXRlID0gKCkgPT4gcmVzb2x2ZShkZWxldGVkQ291bnQpO1xuXHRcdFx0XHR0eC5vbmVycm9yID0gKCkgPT4gcmVqZWN0KC8qIEBfX1BVUkVfXyAqLyBuZXcgRXJyb3IoXCJGYWlsZWQgdG8gY2xlYW51cCBleHBpcmVkXCIpKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fTtcblx0LyoqXG5cdCogSGVscGVyIGNsYXNzIGZvciBiYXRjaCBvcGVyYXRpb25zIHdpdGggcm9sbGJhY2sgc3VwcG9ydFxuXHQqL1xuXHR2YXIgQ2hhbm5lbFRyYW5zYWN0aW9uID0gY2xhc3Mge1xuXHRcdF9zdG9yYWdlO1xuXHRcdF9vcGVyYXRpb25zID0gW107XG5cdFx0X2lzQ29tbWl0dGVkID0gZmFsc2U7XG5cdFx0X2lzUm9sbGVkQmFjayA9IGZhbHNlO1xuXHRcdGNvbnN0cnVjdG9yKF9zdG9yYWdlKSB7XG5cdFx0XHR0aGlzLl9zdG9yYWdlID0gX3N0b3JhZ2U7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogQWRkIHB1dCBvcGVyYXRpb25cblx0XHQqL1xuXHRcdHB1dChzdG9yZSwgdmFsdWUpIHtcblx0XHRcdHRoaXMuX2NoZWNrU3RhdGUoKTtcblx0XHRcdHRoaXMuX29wZXJhdGlvbnMucHVzaCh7XG5cdFx0XHRcdGlkOiBVVUlEdjQoKSxcblx0XHRcdFx0dHlwZTogXCJwdXRcIixcblx0XHRcdFx0c3RvcmUsXG5cdFx0XHRcdHZhbHVlLFxuXHRcdFx0XHR0aW1lc3RhbXA6IERhdGUubm93KClcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogQWRkIGRlbGV0ZSBvcGVyYXRpb25cblx0XHQqL1xuXHRcdGRlbGV0ZShzdG9yZSwga2V5KSB7XG5cdFx0XHR0aGlzLl9jaGVja1N0YXRlKCk7XG5cdFx0XHR0aGlzLl9vcGVyYXRpb25zLnB1c2goe1xuXHRcdFx0XHRpZDogVVVJRHY0KCksXG5cdFx0XHRcdHR5cGU6IFwiZGVsZXRlXCIsXG5cdFx0XHRcdHN0b3JlLFxuXHRcdFx0XHRrZXksXG5cdFx0XHRcdHRpbWVzdGFtcDogRGF0ZS5ub3coKVxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBBZGQgdXBkYXRlIG9wZXJhdGlvblxuXHRcdCovXG5cdFx0dXBkYXRlKHN0b3JlLCBrZXksIHVwZGF0ZXMpIHtcblx0XHRcdHRoaXMuX2NoZWNrU3RhdGUoKTtcblx0XHRcdHRoaXMuX29wZXJhdGlvbnMucHVzaCh7XG5cdFx0XHRcdGlkOiBVVUlEdjQoKSxcblx0XHRcdFx0dHlwZTogXCJ1cGRhdGVcIixcblx0XHRcdFx0c3RvcmUsXG5cdFx0XHRcdGtleSxcblx0XHRcdFx0dmFsdWU6IHVwZGF0ZXMsXG5cdFx0XHRcdHRpbWVzdGFtcDogRGF0ZS5ub3coKVxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBDb21taXQgdHJhbnNhY3Rpb25cblx0XHQqL1xuXHRcdGFzeW5jIGNvbW1pdCgpIHtcblx0XHRcdHRoaXMuX2NoZWNrU3RhdGUoKTtcblx0XHRcdGlmICh0aGlzLl9vcGVyYXRpb25zLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHR0aGlzLl9pc0NvbW1pdHRlZCA9IHRydWU7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdGF3YWl0IHRoaXMuX3N0b3JhZ2UuZXhlY3V0ZVRyYW5zYWN0aW9uKHRoaXMuX29wZXJhdGlvbnMpO1xuXHRcdFx0dGhpcy5faXNDb21taXR0ZWQgPSB0cnVlO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIFJvbGxiYWNrIHRyYW5zYWN0aW9uIChqdXN0IGNsZWFyIG9wZXJhdGlvbnMsIGRvbid0IGV4ZWN1dGUpXG5cdFx0Ki9cblx0XHRyb2xsYmFjaygpIHtcblx0XHRcdHRoaXMuX29wZXJhdGlvbnMgPSBbXTtcblx0XHRcdHRoaXMuX2lzUm9sbGVkQmFjayA9IHRydWU7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogR2V0IG9wZXJhdGlvbiBjb3VudFxuXHRcdCovXG5cdFx0Z2V0IG9wZXJhdGlvbkNvdW50KCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX29wZXJhdGlvbnMubGVuZ3RoO1xuXHRcdH1cblx0XHRfY2hlY2tTdGF0ZSgpIHtcblx0XHRcdGlmICh0aGlzLl9pc0NvbW1pdHRlZCkgdGhyb3cgbmV3IEVycm9yKFwiVHJhbnNhY3Rpb24gYWxyZWFkeSBjb21taXR0ZWRcIik7XG5cdFx0XHRpZiAodGhpcy5faXNSb2xsZWRCYWNrKSB0aHJvdyBuZXcgRXJyb3IoXCJUcmFuc2FjdGlvbiBhbHJlYWR5IHJvbGxlZCBiYWNrXCIpO1xuXHRcdH1cblx0fTtcblx0Y29uc3QgX3N0b3JhZ2VJbnN0YW5jZXMgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuXHQvKipcblx0KiBHZXQgc3RvcmFnZSBpbnN0YW5jZSBmb3IgY2hhbm5lbFxuXHQqL1xuXHRmdW5jdGlvbiBnZXRDaGFubmVsU3RvcmFnZShjaGFubmVsTmFtZSkge1xuXHRcdGlmICghX3N0b3JhZ2VJbnN0YW5jZXMuaGFzKGNoYW5uZWxOYW1lKSkgX3N0b3JhZ2VJbnN0YW5jZXMuc2V0KGNoYW5uZWxOYW1lLCBuZXcgQ2hhbm5lbFN0b3JhZ2UoY2hhbm5lbE5hbWUpKTtcblx0XHRyZXR1cm4gX3N0b3JhZ2VJbnN0YW5jZXMuZ2V0KGNoYW5uZWxOYW1lKTtcblx0fVxuXG4vLyAuLi91bmlmb3JtLnRzL3NyYy9uZXdlci9uZXh0L2NoYW5uZWwvQ2hhbm5lbENvbnRleHQudHNcbi8qKlxuXHQqIENoYW5uZWwgQ29udGV4dCAtIE11bHRpLUNoYW5uZWwgU3VwcG9ydFxuXHQqXG5cdCogUHJvdmlkZXMgYSB3YXkgdG8gY3JlYXRlIG11bHRpcGxlIGluZGVwZW5kZW50IGNoYW5uZWwgZW5kcG9pbnRzL3BvcnRzXG5cdCogaW4gdGhlIHNhbWUgY29udGV4dC4gU3VpdGFibGUgZm9yOlxuXHQqIC0gTGF6eS1sb2FkZWQgY29tcG9uZW50c1xuXHQqIC0gTXVsdGlwbGUgRE9NIGNvbXBvbmVudHMgd2l0aCBpc29sYXRlZCBjb21tdW5pY2F0aW9uXG5cdCogLSBNaWNyby1mcm9udGVuZCBhcmNoaXRlY3R1cmVzXG5cdCogLSBDb21wb25lbnQtbGV2ZWwgY2hhbm5lbCBpc29sYXRpb25cblx0KlxuXHQqIHZOZXh0IGFyY2hpdGVjdHVyZSBub3RlOlxuXHQqIC0gQ2hhbm5lbENvbnRleHQgY29tcG9zZXMgVW5pZmllZENoYW5uZWwgaW5zdGFuY2VzIHBlciBlbmRwb2ludC5cblx0KiAtIFVuaWZpZWRDaGFubmVsIGlzIHRoZSBjYW5vbmljYWwgdHJhbnNwb3J0L2ludm9jYXRpb24gcnVudGltZSBlbmdpbmUuXG5cdCovXG5cdGNvbnN0IHdvcmtlckJhc2UgPSBnZXRXb3JrZXJSZXNvbHZlQmFzZVVybCgpO1xuXHRjb25zdCB3b3JrZXJDb2RlID0gd29ya2VyQmFzZS5sZW5ndGggPiAwID8gbmV3IFVSTChcIi4uL3RyYW5zcG9ydC9Xb3JrZXIudHNcIiwgd29ya2VyQmFzZSkgOiBcIlwiO1xuXHR2YXIgUmVtb3RlQ2hhbm5lbEhlbHBlciA9IGNsYXNzIHtcblx0XHRfY2hhbm5lbDtcblx0XHRfY29udGV4dDtcblx0XHRfb3B0aW9ucztcblx0XHRfY29ubmVjdGlvbjtcblx0XHRfc3RvcmFnZTtcblx0XHRjb25zdHJ1Y3RvcihfY2hhbm5lbCwgX2NvbnRleHQsIF9vcHRpb25zID0ge30pIHtcblx0XHRcdHRoaXMuX2NoYW5uZWwgPSBfY2hhbm5lbDtcblx0XHRcdHRoaXMuX2NvbnRleHQgPSBfY29udGV4dDtcblx0XHRcdHRoaXMuX29wdGlvbnMgPSBfb3B0aW9ucztcblx0XHRcdHRoaXMuX2Nvbm5lY3Rpb24gPSBnZXRDb25uZWN0aW9uKF9jaGFubmVsKTtcblx0XHRcdHRoaXMuX3N0b3JhZ2UgPSBnZXRDaGFubmVsU3RvcmFnZShfY2hhbm5lbCk7XG5cdFx0fVxuXHRcdGFzeW5jIHJlcXVlc3QocGF0aCwgYWN0aW9uLCBhcmdzLCBvcHRpb25zID0ge30pIHtcblx0XHRcdGxldCBub3JtYWxpemVkUGF0aCA9IHR5cGVvZiBwYXRoID09PSBcInN0cmluZ1wiID8gW3BhdGhdIDogcGF0aDtcblx0XHRcdGxldCBub3JtYWxpemVkQWN0aW9uID0gYWN0aW9uO1xuXHRcdFx0bGV0IG5vcm1hbGl6ZWRBcmdzID0gYXJncztcblx0XHRcdGlmIChBcnJheS5pc0FycmF5KGFjdGlvbikgJiYgaXNSZWZsZWN0QWN0aW9uKHBhdGgpKSB7XG5cdFx0XHRcdG9wdGlvbnMgPSBhcmdzO1xuXHRcdFx0XHRub3JtYWxpemVkQXJncyA9IGFjdGlvbjtcblx0XHRcdFx0bm9ybWFsaXplZEFjdGlvbiA9IHBhdGg7XG5cdFx0XHRcdG5vcm1hbGl6ZWRQYXRoID0gW107XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcy5fY29udGV4dC5nZXRIb3N0KCk/LnJlcXVlc3Qobm9ybWFsaXplZFBhdGgsIG5vcm1hbGl6ZWRBY3Rpb24sIG5vcm1hbGl6ZWRBcmdzLCBvcHRpb25zLCB0aGlzLl9jaGFubmVsKTtcblx0XHR9XG5cdFx0YXN5bmMgZG9JbXBvcnRNb2R1bGUodXJsLCBvcHRpb25zID0ge30pIHtcblx0XHRcdHJldHVybiB0aGlzLnJlcXVlc3QoW10sIFdSZWZsZWN0QWN0aW9uLklNUE9SVCwgW3VybF0sIG9wdGlvbnMpO1xuXHRcdH1cblx0XHRhc3luYyBkZWZlck1lc3NhZ2UocGF5bG9hZCwgb3B0aW9ucyA9IHt9KSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fc3RvcmFnZS5kZWZlcih7XG5cdFx0XHRcdGNoYW5uZWw6IHRoaXMuX2NoYW5uZWwsXG5cdFx0XHRcdHNlbmRlcjogdGhpcy5fY29udGV4dC5ob3N0TmFtZSxcblx0XHRcdFx0dHlwZTogXCJyZXF1ZXN0XCIsXG5cdFx0XHRcdHBheWxvYWRcblx0XHRcdH0sIG9wdGlvbnMpO1xuXHRcdH1cblx0XHRhc3luYyBnZXRQZW5kaW5nTWVzc2FnZXMoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fc3RvcmFnZS5nZXREZWZlcnJlZE1lc3NhZ2VzKHRoaXMuX2NoYW5uZWwsIHsgc3RhdHVzOiBcInBlbmRpbmdcIiB9KTtcblx0XHR9XG5cdFx0Z2V0IGNvbm5lY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY29ubmVjdGlvbjtcblx0XHR9XG5cdFx0Z2V0IGNoYW5uZWxOYW1lKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2NoYW5uZWw7XG5cdFx0fVxuXHRcdGdldCBjb250ZXh0KCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2NvbnRleHQ7XG5cdFx0fVxuXHR9O1xuXHR2YXIgQ2hhbm5lbEhhbmRsZXIgPSBjbGFzcyB7XG5cdFx0X2NoYW5uZWw7XG5cdFx0X2NvbnRleHQ7XG5cdFx0X29wdGlvbnM7XG5cdFx0X2Nvbm5lY3Rpb247XG5cdFx0X3VuaWZpZWQ7XG5cdFx0Z2V0IF9mb3JSZXNvbHZlcygpIHtcblx0XHRcdHJldHVybiB0aGlzLl91bmlmaWVkLl9fZ2V0UHJpdmF0ZShcIl9wZW5kaW5nXCIpO1xuXHRcdH1cblx0XHRnZXQgX3N1YnNjcmlwdGlvbnMoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fdW5pZmllZC5fX2dldFByaXZhdGUoXCJfc3Vic2NyaXB0aW9uc1wiKTtcblx0XHR9XG5cdFx0Z2V0IF9icm9hZGNhc3RzKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX3VuaWZpZWQuX19nZXRQcml2YXRlKFwiX3RyYW5zcG9ydHNcIik7XG5cdFx0fVxuXHRcdGNvbnN0cnVjdG9yKF9jaGFubmVsLCBfY29udGV4dCwgX29wdGlvbnMgPSB7fSkge1xuXHRcdFx0dGhpcy5fY2hhbm5lbCA9IF9jaGFubmVsO1xuXHRcdFx0dGhpcy5fY29udGV4dCA9IF9jb250ZXh0O1xuXHRcdFx0dGhpcy5fb3B0aW9ucyA9IF9vcHRpb25zO1xuXHRcdFx0dGhpcy5fY29ubmVjdGlvbiA9IGdldENvbm5lY3Rpb25Qb29sKCkuZ2V0T3JDcmVhdGUoX2NoYW5uZWwsIFwiaW50ZXJuYWxcIiwgX29wdGlvbnMpO1xuXHRcdFx0dGhpcy5fdW5pZmllZCA9IG5ldyBVbmlmaWVkQ2hhbm5lbCh7XG5cdFx0XHRcdG5hbWU6IF9jaGFubmVsLFxuXHRcdFx0XHRhdXRvTGlzdGVuOiBmYWxzZSxcblx0XHRcdFx0dGltZW91dDogX29wdGlvbnM/LnRpbWVvdXRcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRjcmVhdGVSZW1vdGVDaGFubmVsKGNoYW5uZWwsIG9wdGlvbnMgPSB7fSwgYnJvYWRjYXN0KSB7XG5cdFx0XHRjb25zdCB0cmFuc3BvcnQgPSBub3JtYWxpemVUcmFuc3BvcnRCaW5kaW5nKGJyb2FkY2FzdCA/PyB0aGlzLl9jb250ZXh0LiRjcmVhdGVPclVzZUV4aXN0aW5nUmVtb3RlKGNoYW5uZWwsIG9wdGlvbnMsIGJyb2FkY2FzdCA/PyBudWxsKT8ubWVzc2FnZUNoYW5uZWw/LnBvcnQxKTtcblx0XHRcdGNvbnN0IHRyYW5zcG9ydFR5cGUgPSBnZXREeW5hbWljVHJhbnNwb3J0VHlwZSh0cmFuc3BvcnQ/LnRhcmdldCA/PyB0cmFuc3BvcnQpO1xuXHRcdFx0dGhpcy5fdW5pZmllZC5saXN0ZW4odHJhbnNwb3J0Py50YXJnZXQsIHsgdGFyZ2V0Q2hhbm5lbDogY2hhbm5lbCB9KTtcblx0XHRcdGlmICh0cmFuc3BvcnQpIHtcblx0XHRcdFx0dGhpcy5fYnJvYWRjYXN0cz8uc2V0Py4oY2hhbm5lbCwgdHJhbnNwb3J0KTtcblx0XHRcdFx0aWYgKCEodHJhbnNwb3J0VHlwZSA9PT0gXCJzZWxmXCIgJiYgdHlwZW9mIHBvc3RNZXNzYWdlID09PSBcInVuZGVmaW5lZFwiKSkgdGhpcy5fdW5pZmllZC5jb25uZWN0KHRyYW5zcG9ydCwgeyB0YXJnZXRDaGFubmVsOiBjaGFubmVsIH0pO1xuXHRcdFx0XHR0aGlzLl9jb250ZXh0LiRyZWdpc3RlckNvbm5lY3Rpb24oe1xuXHRcdFx0XHRcdGxvY2FsQ2hhbm5lbDogdGhpcy5fY2hhbm5lbCxcblx0XHRcdFx0XHRyZW1vdGVDaGFubmVsOiBjaGFubmVsLFxuXHRcdFx0XHRcdHNlbmRlcjogdGhpcy5fY2hhbm5lbCxcblx0XHRcdFx0XHRkaXJlY3Rpb246IFwib3V0Z29pbmdcIixcblx0XHRcdFx0XHR0cmFuc3BvcnRUeXBlXG5cdFx0XHRcdH0pO1xuXHRcdFx0XHR0aGlzLm5vdGlmeUNoYW5uZWwoY2hhbm5lbCwge1xuXHRcdFx0XHRcdGNvbnRleHRJZDogdGhpcy5fY29udGV4dC5pZCxcblx0XHRcdFx0XHRjb250ZXh0TmFtZTogdGhpcy5fY29udGV4dC5ob3N0TmFtZVxuXHRcdFx0XHR9LCBcImNvbm5lY3RcIik7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gbmV3IFJlbW90ZUNoYW5uZWxIZWxwZXIoY2hhbm5lbCwgdGhpcy5fY29udGV4dCwgb3B0aW9ucyk7XG5cdFx0fVxuXHRcdGdldENoYW5uZWwoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY2hhbm5lbDtcblx0XHR9XG5cdFx0Z2V0IGNvbm5lY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY29ubmVjdGlvbjtcblx0XHR9XG5cdFx0cmVxdWVzdChwYXRoLCBhY3Rpb24sIGFyZ3MsIG9wdGlvbnMgPSB7fSwgdG9DaGFubmVsID0gXCJ3b3JrZXJcIikge1xuXHRcdFx0bGV0IG5vcm1hbGl6ZWRQYXRoID0gdHlwZW9mIHBhdGggPT09IFwic3RyaW5nXCIgPyBbcGF0aF0gOiBwYXRoO1xuXHRcdFx0bGV0IG5vcm1hbGl6ZWRBcmdzID0gYXJncztcblx0XHRcdGlmIChBcnJheS5pc0FycmF5KGFjdGlvbikgJiYgaXNSZWZsZWN0QWN0aW9uKHBhdGgpKSB7XG5cdFx0XHRcdHRvQ2hhbm5lbCA9IG9wdGlvbnM7XG5cdFx0XHRcdG9wdGlvbnMgPSBhcmdzO1xuXHRcdFx0XHRub3JtYWxpemVkQXJncyA9IGFjdGlvbjtcblx0XHRcdFx0YWN0aW9uID0gcGF0aDtcblx0XHRcdFx0bm9ybWFsaXplZFBhdGggPSBbXTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzLl91bmlmaWVkLmludm9rZSh0b0NoYW5uZWwsIGFjdGlvbiwgbm9ybWFsaXplZFBhdGggPz8gW10sIEFycmF5LmlzQXJyYXkobm9ybWFsaXplZEFyZ3MpID8gbm9ybWFsaXplZEFyZ3MgOiBbbm9ybWFsaXplZEFyZ3NdKTtcblx0XHR9XG5cdFx0cmVzb2x2ZVJlc3BvbnNlKHJlcUlkLCByZXN1bHQpIHtcblx0XHRcdHRoaXMuX2ZvclJlc29sdmVzLmdldChyZXFJZCk/LnJlc29sdmU/LihyZXN1bHQpO1xuXHRcdFx0Y29uc3QgcHJvbWlzZSA9IHRoaXMuX2ZvclJlc29sdmVzLmdldChyZXFJZCk/LnByb21pc2U7XG5cdFx0XHR0aGlzLl9mb3JSZXNvbHZlcy5kZWxldGUocmVxSWQpO1xuXHRcdFx0cmV0dXJuIHByb21pc2U7XG5cdFx0fVxuXHRcdGFzeW5jIGhhbmRsZUFuZFJlc3BvbnNlKHJlcXVlc3QsIHJlcUlkLCByZXNwb25zZUZuKSB7fVxuXHRcdG5vdGlmeUNoYW5uZWwodGFyZ2V0Q2hhbm5lbCwgcGF5bG9hZCA9IHt9LCB0eXBlID0gXCJub3RpZnlcIikge1xuXHRcdFx0cmV0dXJuIHRoaXMuX3VuaWZpZWQubm90aWZ5KHRhcmdldENoYW5uZWwsIHtcblx0XHRcdFx0Li4ucGF5bG9hZCxcblx0XHRcdFx0ZnJvbTogdGhpcy5fY2hhbm5lbCxcblx0XHRcdFx0dG86IHRhcmdldENoYW5uZWxcblx0XHRcdH0sIHR5cGUpO1xuXHRcdH1cblx0XHRnZXRDb25uZWN0ZWRDaGFubmVscygpIHtcblx0XHRcdHJldHVybiB0aGlzLl91bmlmaWVkLmNvbm5lY3RlZENoYW5uZWxzO1xuXHRcdH1cblx0XHRjbG9zZSgpIHtcblx0XHRcdHRoaXMuX3N1YnNjcmlwdGlvbnMuZm9yRWFjaCgocykgPT4gcy51bnN1YnNjcmliZSgpKTtcblx0XHRcdHRoaXMuX2ZvclJlc29sdmVzLmNsZWFyKCk7XG5cdFx0XHR0aGlzLl9icm9hZGNhc3RzPy52YWx1ZXM/LigpPy5mb3JFYWNoKCh0cmFuc3BvcnQpID0+IHRyYW5zcG9ydC5jbG9zZT8uKCkpO1xuXHRcdFx0dGhpcy5fYnJvYWRjYXN0cz8uY2xlYXI/LigpO1xuXHRcdFx0dGhpcy5fdW5pZmllZC5jbG9zZSgpO1xuXHRcdH1cblx0XHRnZXQgdW5pZmllZCgpIHtcblx0XHRcdHJldHVybiB0aGlzLl91bmlmaWVkO1xuXHRcdH1cblx0fTtcblx0LyoqXG5cdCogQ2hhbm5lbCBDb250ZXh0IC0gTWFuYWdlcyBtdWx0aXBsZSBjaGFubmVscyBpbiBhIHNpbmdsZSBjb250ZXh0XG5cdCpcblx0KiBVc2UgdGhpcyB3aGVuIHlvdSBuZWVkIG11bHRpcGxlIGluZGVwZW5kZW50IGNoYW5uZWxzIGluIHRoZSBzYW1lXG5cdCogSmF2YVNjcmlwdCBjb250ZXh0IChzYW1lIHdpbmRvdywgaWZyYW1lLCB3b3JrZXIsIGV0Yy4pXG5cdCpcblx0KiBTdXBwb3J0czpcblx0KiAtIENyZWF0aW5nIG11bHRpcGxlIGNoYW5uZWxzIGF0IG9uY2Ugb3IgZGVmZXJyZWRcblx0KiAtIER5bmFtaWMgdHJhbnNwb3J0IGFkZGl0aW9uICh3b3JrZXJzLCBwb3J0cywgc29ja2V0cywgZXRjLilcblx0KiAtIEdsb2JhbCBzZWxmL2dsb2JhbFRoaXMgYXMgZGVmYXVsdCB0YXJnZXRcblx0Ki9cblx0dmFyIENoYW5uZWxDb250ZXh0ID0gY2xhc3Mge1xuXHRcdF9vcHRpb25zO1xuXHRcdF9pZCA9IFVVSUR2NCgpO1xuXHRcdF9ob3N0TmFtZTtcblx0XHRfaG9zdCA9IG51bGw7XG5cdFx0X2VuZHBvaW50cyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG5cdFx0X3VuaWZpZWRCeUNoYW5uZWwgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuXHRcdF91bmlmaWVkQ29ubmVjdGlvblN1YnMgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuXHRcdF9yZW1vdGVDaGFubmVscyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG5cdFx0X2RlZmVycmVkQ2hhbm5lbHMgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuXHRcdF9jb25uZWN0aW9uRXZlbnRzID0gbmV3IENoYW5uZWxTdWJqZWN0KHsgYnVmZmVyU2l6ZTogMjAwIH0pO1xuXHRcdF9jb25uZWN0aW9uUmVnaXN0cnkgPSBuZXcgQ29ubmVjdGlvblJlZ2lzdHJ5KCgpID0+IFVVSUR2NCgpLCAoZXZlbnQpID0+IHRoaXMuX2VtaXRDb25uZWN0aW9uRXZlbnQoZXZlbnQpKTtcblx0XHRfY2xvc2VkID0gZmFsc2U7XG5cdFx0X2dsb2JhbFNlbGYgPSBudWxsO1xuXHRcdGNvbnN0cnVjdG9yKF9vcHRpb25zID0ge30pIHtcblx0XHRcdHRoaXMuX29wdGlvbnMgPSBfb3B0aW9ucztcblx0XHRcdHRoaXMuX2hvc3ROYW1lID0gX29wdGlvbnMubmFtZSA/PyBgY3R4LSR7dGhpcy5faWQuc2xpY2UoMCwgOCl9YDtcblx0XHRcdGlmIChfb3B0aW9ucy51c2VHbG9iYWxTZWxmICE9PSBmYWxzZSkgdGhpcy5fZ2xvYmFsU2VsZiA9IHR5cGVvZiBnbG9iYWxUaGlzICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsVGhpcyA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IG51bGw7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogSW5pdGlhbGl6ZS9nZXQgdGhlIGhvc3QgY2hhbm5lbCBmb3IgdGhpcyBjb250ZXh0XG5cdFx0Ki9cblx0XHRpbml0SG9zdChuYW1lKSB7XG5cdFx0XHRpZiAodGhpcy5faG9zdCAmJiAhbmFtZSkgcmV0dXJuIHRoaXMuX2hvc3Q7XG5cdFx0XHRjb25zdCBob3N0TmFtZSA9IG5hbWUgPz8gdGhpcy5faG9zdE5hbWU7XG5cdFx0XHR0aGlzLl9ob3N0TmFtZSA9IGhvc3ROYW1lO1xuXHRcdFx0aWYgKHRoaXMuX2VuZHBvaW50cy5oYXMoaG9zdE5hbWUpKSB7XG5cdFx0XHRcdHRoaXMuX2hvc3QgPSB0aGlzLl9lbmRwb2ludHMuZ2V0KGhvc3ROYW1lKS5oYW5kbGVyO1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5faG9zdDtcblx0XHRcdH1cblx0XHRcdHRoaXMuX2hvc3QgPSBuZXcgQ2hhbm5lbEhhbmRsZXIoaG9zdE5hbWUsIHRoaXMsIHRoaXMuX29wdGlvbnMuZGVmYXVsdE9wdGlvbnMpO1xuXHRcdFx0Y29uc3QgZW5kcG9pbnQgPSB7XG5cdFx0XHRcdG5hbWU6IGhvc3ROYW1lLFxuXHRcdFx0XHRoYW5kbGVyOiB0aGlzLl9ob3N0LFxuXHRcdFx0XHRjb25uZWN0aW9uOiB0aGlzLl9ob3N0LmNvbm5lY3Rpb24sXG5cdFx0XHRcdHN1YnNjcmlwdGlvbnM6IFtdLFxuXHRcdFx0XHRyZWFkeTogUHJvbWlzZS5yZXNvbHZlKG51bGwpLFxuXHRcdFx0XHR1bmlmaWVkOiB0aGlzLl9ob3N0LnVuaWZpZWRcblx0XHRcdH07XG5cdFx0XHR0aGlzLl9lbmRwb2ludHMuc2V0KGhvc3ROYW1lLCBlbmRwb2ludCk7XG5cdFx0XHR0aGlzLl9yZWdpc3RlclVuaWZpZWRDaGFubmVsKGhvc3ROYW1lLCB0aGlzLl9ob3N0LnVuaWZpZWQpO1xuXHRcdFx0cmV0dXJuIHRoaXMuX2hvc3Q7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogR2V0IHRoZSBob3N0IGNoYW5uZWxcblx0XHQqL1xuXHRcdGdldEhvc3QoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5faG9zdCA/PyB0aGlzLmluaXRIb3N0KCk7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogR2V0IGhvc3QgbmFtZVxuXHRcdCovXG5cdFx0Z2V0IGhvc3ROYW1lKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2hvc3ROYW1lO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIEdldCBjb250ZXh0IElEXG5cdFx0Ki9cblx0XHRnZXQgaWQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5faWQ7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogT2JzZXJ2YWJsZTogY29ubmVjdGlvbiBldmVudHMgaW4gdGhpcyBjb250ZXh0XG5cdFx0Ki9cblx0XHRnZXQgb25Db25uZWN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2Nvbm5lY3Rpb25FdmVudHM7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogU3Vic2NyaWJlIHRvIGNvbm5lY3Rpb24gZXZlbnRzXG5cdFx0Ki9cblx0XHRzdWJzY3JpYmVDb25uZWN0aW9ucyhoYW5kbGVyKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY29ubmVjdGlvbkV2ZW50cy5zdWJzY3JpYmUoaGFuZGxlcik7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogTm90aWZ5IGFsbCBjdXJyZW50bHkga25vd24gYWN0aXZlIGNvbm5lY3Rpb25zLlxuXHRcdCogVXNlZnVsIGZvciBzZXJ2aWNlIHdvcmtlciAvIGNyb3NzLXRhYiBoYW5kc2hha2VzLlxuXHRcdCovXG5cdFx0bm90aWZ5Q29ubmVjdGlvbnMocGF5bG9hZCA9IHt9LCBxdWVyeSA9IHt9KSB7XG5cdFx0XHRsZXQgc2VudCA9IDA7XG5cdFx0XHRmb3IgKGNvbnN0IGVuZHBvaW50IG9mIHRoaXMuX2VuZHBvaW50cy52YWx1ZXMoKSkge1xuXHRcdFx0XHRjb25zdCBjb25uZWN0ZWRUYXJnZXRzID0gZW5kcG9pbnQuaGFuZGxlci5nZXRDb25uZWN0ZWRDaGFubmVscygpO1xuXHRcdFx0XHRmb3IgKGNvbnN0IHJlbW90ZUNoYW5uZWwgb2YgY29ubmVjdGVkVGFyZ2V0cykge1xuXHRcdFx0XHRcdGlmIChxdWVyeS5sb2NhbENoYW5uZWwgJiYgcXVlcnkubG9jYWxDaGFubmVsICE9PSBlbmRwb2ludC5uYW1lKSBjb250aW51ZTtcblx0XHRcdFx0XHRpZiAocXVlcnkucmVtb3RlQ2hhbm5lbCAmJiBxdWVyeS5yZW1vdGVDaGFubmVsICE9PSByZW1vdGVDaGFubmVsKSBjb250aW51ZTtcblx0XHRcdFx0XHRjb25zdCBleGlzdGluZyA9IHRoaXMucXVlcnlDb25uZWN0aW9ucyh7XG5cdFx0XHRcdFx0XHRsb2NhbENoYW5uZWw6IGVuZHBvaW50Lm5hbWUsXG5cdFx0XHRcdFx0XHRyZW1vdGVDaGFubmVsLFxuXHRcdFx0XHRcdFx0c3RhdHVzOiBcImFjdGl2ZVwiXG5cdFx0XHRcdFx0fSlbMF07XG5cdFx0XHRcdFx0aWYgKHF1ZXJ5LnNlbmRlciAmJiBleGlzdGluZz8uc2VuZGVyICE9PSBxdWVyeS5zZW5kZXIpIGNvbnRpbnVlO1xuXHRcdFx0XHRcdGlmIChxdWVyeS50cmFuc3BvcnRUeXBlICYmIGV4aXN0aW5nPy50cmFuc3BvcnRUeXBlICE9PSBxdWVyeS50cmFuc3BvcnRUeXBlKSBjb250aW51ZTtcblx0XHRcdFx0XHRpZiAocXVlcnkuY2hhbm5lbCAmJiBxdWVyeS5jaGFubmVsICE9PSBlbmRwb2ludC5uYW1lICYmIHF1ZXJ5LmNoYW5uZWwgIT09IHJlbW90ZUNoYW5uZWwpIGNvbnRpbnVlO1xuXHRcdFx0XHRcdGlmIChlbmRwb2ludC5oYW5kbGVyLm5vdGlmeUNoYW5uZWwocmVtb3RlQ2hhbm5lbCwgcGF5bG9hZCwgXCJub3RpZnlcIikpIHNlbnQrKztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHNlbnQ7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogUXVlcnkgdHJhY2tlZCBjb25uZWN0aW9ucyB3aXRoIGZpbHRlcnNcblx0XHQqL1xuXHRcdHF1ZXJ5Q29ubmVjdGlvbnMocXVlcnkgPSB7fSkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2Nvbm5lY3Rpb25SZWdpc3RyeS5xdWVyeShxdWVyeSkubWFwKChjb25uZWN0aW9uKSA9PiAoe1xuXHRcdFx0XHQuLi5jb25uZWN0aW9uLFxuXHRcdFx0XHRjb250ZXh0SWQ6IHRoaXMuX2lkXG5cdFx0XHR9KSk7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogQ3JlYXRlIGEgbmV3IGNoYW5uZWwgZW5kcG9pbnQgaW4gdGhpcyBjb250ZXh0XG5cdFx0KlxuXHRcdCogQHBhcmFtIG5hbWUgLSBDaGFubmVsIG5hbWVcblx0XHQqIEBwYXJhbSBvcHRpb25zIC0gQ29ubmVjdGlvbiBvcHRpb25zXG5cdFx0KiBAcmV0dXJucyBDaGFubmVsRW5kcG9pbnQgd2l0aCBoYW5kbGVyIGFuZCBjb25uZWN0aW9uXG5cdFx0Ki9cblx0XHRjcmVhdGVDaGFubmVsKG5hbWUsIG9wdGlvbnMgPSB7fSkge1xuXHRcdFx0aWYgKHRoaXMuX2VuZHBvaW50cy5oYXMobmFtZSkpIHJldHVybiB0aGlzLl9lbmRwb2ludHMuZ2V0KG5hbWUpO1xuXHRcdFx0Y29uc3QgaGFuZGxlciA9IG5ldyBDaGFubmVsSGFuZGxlcihuYW1lLCB0aGlzLCB7XG5cdFx0XHRcdC4uLnRoaXMuX29wdGlvbnMuZGVmYXVsdE9wdGlvbnMsXG5cdFx0XHRcdC4uLm9wdGlvbnNcblx0XHRcdH0pO1xuXHRcdFx0Y29uc3QgZW5kcG9pbnQgPSB7XG5cdFx0XHRcdG5hbWUsXG5cdFx0XHRcdGhhbmRsZXIsXG5cdFx0XHRcdGNvbm5lY3Rpb246IGhhbmRsZXIuY29ubmVjdGlvbixcblx0XHRcdFx0c3Vic2NyaXB0aW9uczogW10sXG5cdFx0XHRcdHJlYWR5OiBQcm9taXNlLnJlc29sdmUobnVsbCksXG5cdFx0XHRcdHVuaWZpZWQ6IGhhbmRsZXIudW5pZmllZFxuXHRcdFx0fTtcblx0XHRcdHRoaXMuX2VuZHBvaW50cy5zZXQobmFtZSwgZW5kcG9pbnQpO1xuXHRcdFx0dGhpcy5fcmVnaXN0ZXJVbmlmaWVkQ2hhbm5lbChuYW1lLCBoYW5kbGVyLnVuaWZpZWQpO1xuXHRcdFx0cmV0dXJuIGVuZHBvaW50O1xuXHRcdH1cblx0XHQvKipcblx0XHQqIENyZWF0ZSBtdWx0aXBsZSBjaGFubmVsIGVuZHBvaW50cyBhdCBvbmNlXG5cdFx0KlxuXHRcdCogQHBhcmFtIG5hbWVzIC0gQXJyYXkgb2YgY2hhbm5lbCBuYW1lc1xuXHRcdCogQHBhcmFtIG9wdGlvbnMgLSBTaGFyZWQgY29ubmVjdGlvbiBvcHRpb25zXG5cdFx0KiBAcmV0dXJucyBNYXAgb2YgY2hhbm5lbCBuYW1lcyB0byBlbmRwb2ludHNcblx0XHQqL1xuXHRcdGNyZWF0ZUNoYW5uZWxzKG5hbWVzLCBvcHRpb25zID0ge30pIHtcblx0XHRcdGNvbnN0IHJlc3VsdCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG5cdFx0XHRmb3IgKGNvbnN0IG5hbWUgb2YgbmFtZXMpIHJlc3VsdC5zZXQobmFtZSwgdGhpcy5jcmVhdGVDaGFubmVsKG5hbWUsIG9wdGlvbnMpKTtcblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogR2V0IGFuIGV4aXN0aW5nIGNoYW5uZWwgZW5kcG9pbnRcblx0XHQqL1xuXHRcdGdldENoYW5uZWwobmFtZSkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2VuZHBvaW50cy5nZXQobmFtZSk7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogR2V0IG9yIGNyZWF0ZSBhIGNoYW5uZWwgZW5kcG9pbnRcblx0XHQqL1xuXHRcdGdldE9yQ3JlYXRlQ2hhbm5lbChuYW1lLCBvcHRpb25zID0ge30pIHtcblx0XHRcdHJldHVybiB0aGlzLl9lbmRwb2ludHMuZ2V0KG5hbWUpID8/IHRoaXMuY3JlYXRlQ2hhbm5lbChuYW1lLCBvcHRpb25zKTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBDaGVjayBpZiBjaGFubmVsIGV4aXN0cyBpbiB0aGlzIGNvbnRleHRcblx0XHQqL1xuXHRcdGhhc0NoYW5uZWwobmFtZSkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2VuZHBvaW50cy5oYXMobmFtZSk7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogR2V0IGFsbCBjaGFubmVsIG5hbWVzIGluIHRoaXMgY29udGV4dFxuXHRcdCovXG5cdFx0Z2V0Q2hhbm5lbE5hbWVzKCkge1xuXHRcdFx0cmV0dXJuIFsuLi50aGlzLl9lbmRwb2ludHMua2V5cygpXTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBHZXQgdG90YWwgbnVtYmVyIG9mIGNoYW5uZWxzXG5cdFx0Ki9cblx0XHRnZXQgc2l6ZSgpIHtcblx0XHRcdHJldHVybiB0aGlzLl9lbmRwb2ludHMuc2l6ZTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBSZWdpc3RlciBhIGRlZmVycmVkIGNoYW5uZWwgdGhhdCB3aWxsIGJlIGluaXRpYWxpemVkIG9uIGZpcnN0IHVzZVxuXHRcdCpcblx0XHQqIEBwYXJhbSBuYW1lIC0gQ2hhbm5lbCBuYW1lXG5cdFx0KiBAcGFyYW0gaW5pdEZuIC0gRnVuY3Rpb24gdG8gaW5pdGlhbGl6ZSB0aGUgY2hhbm5lbFxuXHRcdCovXG5cdFx0ZGVmZXIobmFtZSwgaW5pdEZuKSB7XG5cdFx0XHR0aGlzLl9kZWZlcnJlZENoYW5uZWxzLnNldChuYW1lLCBpbml0Rm4pO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIEluaXRpYWxpemUgYSBwcmV2aW91c2x5IGRlZmVycmVkIGNoYW5uZWxcblx0XHQqL1xuXHRcdGFzeW5jIGluaXREZWZlcnJlZChuYW1lKSB7XG5cdFx0XHRjb25zdCBpbml0Rm4gPSB0aGlzLl9kZWZlcnJlZENoYW5uZWxzLmdldChuYW1lKTtcblx0XHRcdGlmICghaW5pdEZuKSByZXR1cm4gbnVsbDtcblx0XHRcdGNvbnN0IGVuZHBvaW50ID0gYXdhaXQgaW5pdEZuKCk7XG5cdFx0XHR0aGlzLl9lbmRwb2ludHMuc2V0KG5hbWUsIGVuZHBvaW50KTtcblx0XHRcdHRoaXMuX2RlZmVycmVkQ2hhbm5lbHMuZGVsZXRlKG5hbWUpO1xuXHRcdFx0cmV0dXJuIGVuZHBvaW50O1xuXHRcdH1cblx0XHQvKipcblx0XHQqIENoZWNrIGlmIGNoYW5uZWwgaXMgZGVmZXJyZWQgKG5vdCB5ZXQgaW5pdGlhbGl6ZWQpXG5cdFx0Ki9cblx0XHRpc0RlZmVycmVkKG5hbWUpIHtcblx0XHRcdHJldHVybiB0aGlzLl9kZWZlcnJlZENoYW5uZWxzLmhhcyhuYW1lKTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBHZXQgY2hhbm5lbCwgaW5pdGlhbGl6aW5nIGRlZmVycmVkIGlmIG5lZWRlZFxuXHRcdCovXG5cdFx0YXN5bmMgZ2V0Q2hhbm5lbEFzeW5jKG5hbWUpIHtcblx0XHRcdGlmICh0aGlzLl9lbmRwb2ludHMuaGFzKG5hbWUpKSByZXR1cm4gdGhpcy5fZW5kcG9pbnRzLmdldChuYW1lKTtcblx0XHRcdGlmICh0aGlzLl9kZWZlcnJlZENoYW5uZWxzLmhhcyhuYW1lKSkgcmV0dXJuIHRoaXMuaW5pdERlZmVycmVkKG5hbWUpO1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogQWRkIGEgV29ya2VyIGNoYW5uZWwgZHluYW1pY2FsbHlcblx0XHQqXG5cdFx0KiBAcGFyYW0gbmFtZSAtIENoYW5uZWwgbmFtZVxuXHRcdCogQHBhcmFtIHdvcmtlciAtIFdvcmtlciBpbnN0YW5jZSwgVVJMLCBvciBjb2RlIHN0cmluZ1xuXHRcdCogQHBhcmFtIG9wdGlvbnMgLSBDb25uZWN0aW9uIG9wdGlvbnNcblx0XHQqL1xuXHRcdGFzeW5jIGFkZFdvcmtlcihuYW1lLCB3b3JrZXIsIG9wdGlvbnMgPSB7fSkge1xuXHRcdFx0Y29uc3Qgd29ya2VySW5zdGFuY2UgPSBsb2FkV29ya2VyKHdvcmtlcik7XG5cdFx0XHRpZiAoIXdvcmtlckluc3RhbmNlKSB0aHJvdyBuZXcgRXJyb3IoYEZhaWxlZCB0byBjcmVhdGUgd29ya2VyIGZvciBjaGFubmVsOiAke25hbWV9YCk7XG5cdFx0XHRjb25zdCBoYW5kbGVyID0gbmV3IENoYW5uZWxIYW5kbGVyKG5hbWUsIHRoaXMsIHtcblx0XHRcdFx0Li4udGhpcy5fb3B0aW9ucy5kZWZhdWx0T3B0aW9ucyxcblx0XHRcdFx0Li4ub3B0aW9uc1xuXHRcdFx0fSk7XG5cdFx0XHRjb25zdCByZWFkeSA9IGhhbmRsZXIuY3JlYXRlUmVtb3RlQ2hhbm5lbChuYW1lLCBvcHRpb25zLCB3b3JrZXJJbnN0YW5jZSk7XG5cdFx0XHRjb25zdCBlbmRwb2ludCA9IHtcblx0XHRcdFx0bmFtZSxcblx0XHRcdFx0aGFuZGxlcixcblx0XHRcdFx0Y29ubmVjdGlvbjogaGFuZGxlci5jb25uZWN0aW9uLFxuXHRcdFx0XHRzdWJzY3JpcHRpb25zOiBbXSxcblx0XHRcdFx0dHJhbnNwb3J0VHlwZTogXCJ3b3JrZXJcIixcblx0XHRcdFx0cmVhZHk6IFByb21pc2UucmVzb2x2ZShyZWFkeSksXG5cdFx0XHRcdHVuaWZpZWQ6IGhhbmRsZXIudW5pZmllZFxuXHRcdFx0fTtcblx0XHRcdHRoaXMuX2VuZHBvaW50cy5zZXQobmFtZSwgZW5kcG9pbnQpO1xuXHRcdFx0dGhpcy5fcmVnaXN0ZXJVbmlmaWVkQ2hhbm5lbChuYW1lLCBoYW5kbGVyLnVuaWZpZWQpO1xuXHRcdFx0dGhpcy5fcmVtb3RlQ2hhbm5lbHMuc2V0KG5hbWUsIHtcblx0XHRcdFx0Y2hhbm5lbDogbmFtZSxcblx0XHRcdFx0Y29udGV4dDogdGhpcyxcblx0XHRcdFx0cmVtb3RlOiBQcm9taXNlLnJlc29sdmUocmVhZHkpLFxuXHRcdFx0XHR0cmFuc3BvcnQ6IHdvcmtlckluc3RhbmNlLFxuXHRcdFx0XHR0cmFuc3BvcnRUeXBlOiBcIndvcmtlclwiXG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBlbmRwb2ludDtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBBZGQgYSBNZXNzYWdlUG9ydCBjaGFubmVsIGR5bmFtaWNhbGx5XG5cdFx0KlxuXHRcdCogQHBhcmFtIG5hbWUgLSBDaGFubmVsIG5hbWVcblx0XHQqIEBwYXJhbSBwb3J0IC0gTWVzc2FnZVBvcnQgaW5zdGFuY2Vcblx0XHQqIEBwYXJhbSBvcHRpb25zIC0gQ29ubmVjdGlvbiBvcHRpb25zXG5cdFx0Ki9cblx0XHRhc3luYyBhZGRQb3J0KG5hbWUsIHBvcnQsIG9wdGlvbnMgPSB7fSkge1xuXHRcdFx0Y29uc3QgaGFuZGxlciA9IG5ldyBDaGFubmVsSGFuZGxlcihuYW1lLCB0aGlzLCB7XG5cdFx0XHRcdC4uLnRoaXMuX29wdGlvbnMuZGVmYXVsdE9wdGlvbnMsXG5cdFx0XHRcdC4uLm9wdGlvbnNcblx0XHRcdH0pO1xuXHRcdFx0cG9ydC5zdGFydD8uKCk7XG5cdFx0XHRjb25zdCByZWFkeSA9IGhhbmRsZXIuY3JlYXRlUmVtb3RlQ2hhbm5lbChuYW1lLCBvcHRpb25zLCBwb3J0KTtcblx0XHRcdGNvbnN0IGVuZHBvaW50ID0ge1xuXHRcdFx0XHRuYW1lLFxuXHRcdFx0XHRoYW5kbGVyLFxuXHRcdFx0XHRjb25uZWN0aW9uOiBoYW5kbGVyLmNvbm5lY3Rpb24sXG5cdFx0XHRcdHN1YnNjcmlwdGlvbnM6IFtdLFxuXHRcdFx0XHR0cmFuc3BvcnRUeXBlOiBcIm1lc3NhZ2UtcG9ydFwiLFxuXHRcdFx0XHRyZWFkeTogUHJvbWlzZS5yZXNvbHZlKHJlYWR5KSxcblx0XHRcdFx0dW5pZmllZDogaGFuZGxlci51bmlmaWVkXG5cdFx0XHR9O1xuXHRcdFx0dGhpcy5fZW5kcG9pbnRzLnNldChuYW1lLCBlbmRwb2ludCk7XG5cdFx0XHR0aGlzLl9yZWdpc3RlclVuaWZpZWRDaGFubmVsKG5hbWUsIGhhbmRsZXIudW5pZmllZCk7XG5cdFx0XHR0aGlzLl9yZW1vdGVDaGFubmVscy5zZXQobmFtZSwge1xuXHRcdFx0XHRjaGFubmVsOiBuYW1lLFxuXHRcdFx0XHRjb250ZXh0OiB0aGlzLFxuXHRcdFx0XHRyZW1vdGU6IFByb21pc2UucmVzb2x2ZShyZWFkeSksXG5cdFx0XHRcdHRyYW5zcG9ydDogcG9ydCxcblx0XHRcdFx0dHJhbnNwb3J0VHlwZTogXCJtZXNzYWdlLXBvcnRcIlxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gZW5kcG9pbnQ7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogQWRkIGEgQnJvYWRjYXN0Q2hhbm5lbCBkeW5hbWljYWxseVxuXHRcdCpcblx0XHQqIEBwYXJhbSBuYW1lIC0gQ2hhbm5lbCBuYW1lIChhbHNvIHVzZWQgYXMgQnJvYWRjYXN0Q2hhbm5lbCBuYW1lIGlmIG5vdCBwcm92aWRlZClcblx0XHQqIEBwYXJhbSBicm9hZGNhc3ROYW1lIC0gT3B0aW9uYWwgQnJvYWRjYXN0Q2hhbm5lbCBuYW1lIChkZWZhdWx0cyB0byBjaGFubmVsIG5hbWUpXG5cdFx0KiBAcGFyYW0gb3B0aW9ucyAtIENvbm5lY3Rpb24gb3B0aW9uc1xuXHRcdCovXG5cdFx0YXN5bmMgYWRkQnJvYWRjYXN0KG5hbWUsIGJyb2FkY2FzdE5hbWUsIG9wdGlvbnMgPSB7fSkge1xuXHRcdFx0Y29uc3QgYmMgPSBuZXcgQnJvYWRjYXN0Q2hhbm5lbChicm9hZGNhc3ROYW1lID8/IG5hbWUpO1xuXHRcdFx0Y29uc3QgaGFuZGxlciA9IG5ldyBDaGFubmVsSGFuZGxlcihuYW1lLCB0aGlzLCB7XG5cdFx0XHRcdC4uLnRoaXMuX29wdGlvbnMuZGVmYXVsdE9wdGlvbnMsXG5cdFx0XHRcdC4uLm9wdGlvbnNcblx0XHRcdH0pO1xuXHRcdFx0Y29uc3QgcmVhZHkgPSBoYW5kbGVyLmNyZWF0ZVJlbW90ZUNoYW5uZWwobmFtZSwgb3B0aW9ucywgYmMpO1xuXHRcdFx0Y29uc3QgZW5kcG9pbnQgPSB7XG5cdFx0XHRcdG5hbWUsXG5cdFx0XHRcdGhhbmRsZXIsXG5cdFx0XHRcdGNvbm5lY3Rpb246IGhhbmRsZXIuY29ubmVjdGlvbixcblx0XHRcdFx0c3Vic2NyaXB0aW9uczogW10sXG5cdFx0XHRcdHRyYW5zcG9ydFR5cGU6IFwiYnJvYWRjYXN0XCIsXG5cdFx0XHRcdHJlYWR5OiBQcm9taXNlLnJlc29sdmUocmVhZHkpLFxuXHRcdFx0XHR1bmlmaWVkOiBoYW5kbGVyLnVuaWZpZWRcblx0XHRcdH07XG5cdFx0XHR0aGlzLl9lbmRwb2ludHMuc2V0KG5hbWUsIGVuZHBvaW50KTtcblx0XHRcdHRoaXMuX3JlZ2lzdGVyVW5pZmllZENoYW5uZWwobmFtZSwgaGFuZGxlci51bmlmaWVkKTtcblx0XHRcdHRoaXMuX3JlbW90ZUNoYW5uZWxzLnNldChuYW1lLCB7XG5cdFx0XHRcdGNoYW5uZWw6IG5hbWUsXG5cdFx0XHRcdGNvbnRleHQ6IHRoaXMsXG5cdFx0XHRcdHJlbW90ZTogUHJvbWlzZS5yZXNvbHZlKHJlYWR5KSxcblx0XHRcdFx0dHJhbnNwb3J0OiBiYyxcblx0XHRcdFx0dHJhbnNwb3J0VHlwZTogXCJicm9hZGNhc3RcIlxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gZW5kcG9pbnQ7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogQWRkIGEgY2hhbm5lbCB1c2luZyBzZWxmL2dsb2JhbFRoaXMgKGZvciBzYW1lLWNvbnRleHQgY29tbXVuaWNhdGlvbilcblx0XHQqXG5cdFx0KiBAcGFyYW0gbmFtZSAtIENoYW5uZWwgbmFtZVxuXHRcdCogQHBhcmFtIG9wdGlvbnMgLSBDb25uZWN0aW9uIG9wdGlvbnNcblx0XHQqL1xuXHRcdGFkZFNlbGZDaGFubmVsKG5hbWUsIG9wdGlvbnMgPSB7fSkge1xuXHRcdFx0Y29uc3QgaGFuZGxlciA9IG5ldyBDaGFubmVsSGFuZGxlcihuYW1lLCB0aGlzLCB7XG5cdFx0XHRcdC4uLnRoaXMuX29wdGlvbnMuZGVmYXVsdE9wdGlvbnMsXG5cdFx0XHRcdC4uLm9wdGlvbnNcblx0XHRcdH0pO1xuXHRcdFx0Y29uc3Qgc2VsZlRhcmdldCA9IHRoaXMuX2dsb2JhbFNlbGYgPz8gKHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IG51bGwpO1xuXHRcdFx0Y29uc3QgZW5kcG9pbnQgPSB7XG5cdFx0XHRcdG5hbWUsXG5cdFx0XHRcdGhhbmRsZXIsXG5cdFx0XHRcdGNvbm5lY3Rpb246IGhhbmRsZXIuY29ubmVjdGlvbixcblx0XHRcdFx0c3Vic2NyaXB0aW9uczogW10sXG5cdFx0XHRcdHRyYW5zcG9ydFR5cGU6IFwic2VsZlwiLFxuXHRcdFx0XHRyZWFkeTogUHJvbWlzZS5yZXNvbHZlKHNlbGZUYXJnZXQgPyBoYW5kbGVyLmNyZWF0ZVJlbW90ZUNoYW5uZWwobmFtZSwgb3B0aW9ucywgc2VsZlRhcmdldCkgOiBudWxsKSxcblx0XHRcdFx0dW5pZmllZDogaGFuZGxlci51bmlmaWVkXG5cdFx0XHR9O1xuXHRcdFx0dGhpcy5fZW5kcG9pbnRzLnNldChuYW1lLCBlbmRwb2ludCk7XG5cdFx0XHR0aGlzLl9yZWdpc3RlclVuaWZpZWRDaGFubmVsKG5hbWUsIGhhbmRsZXIudW5pZmllZCk7XG5cdFx0XHRyZXR1cm4gZW5kcG9pbnQ7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogQWRkIGNoYW5uZWwgd2l0aCBkeW5hbWljIHRyYW5zcG9ydCBjb25maWd1cmF0aW9uXG5cdFx0KlxuXHRcdCogQHBhcmFtIG5hbWUgLSBDaGFubmVsIG5hbWVcblx0XHQqIEBwYXJhbSBjb25maWcgLSBUcmFuc3BvcnQgY29uZmlndXJhdGlvblxuXHRcdCovXG5cdFx0YXN5bmMgYWRkVHJhbnNwb3J0KG5hbWUsIGNvbmZpZykge1xuXHRcdFx0Y29uc3Qgb3B0aW9ucyA9IGNvbmZpZy5vcHRpb25zID8/IHt9O1xuXHRcdFx0c3dpdGNoIChjb25maWcudHlwZSkge1xuXHRcdFx0XHRjYXNlIFwid29ya2VyXCI6XG5cdFx0XHRcdFx0aWYgKCFjb25maWcud29ya2VyKSB0aHJvdyBuZXcgRXJyb3IoXCJXb3JrZXIgcmVxdWlyZWQgZm9yIHdvcmtlciB0cmFuc3BvcnRcIik7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuYWRkV29ya2VyKG5hbWUsIGNvbmZpZy53b3JrZXIsIG9wdGlvbnMpO1xuXHRcdFx0XHRjYXNlIFwibWVzc2FnZS1wb3J0XCI6XG5cdFx0XHRcdFx0aWYgKCFjb25maWcucG9ydCkgdGhyb3cgbmV3IEVycm9yKFwiUG9ydCByZXF1aXJlZCBmb3IgbWVzc2FnZS1wb3J0IHRyYW5zcG9ydFwiKTtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5hZGRQb3J0KG5hbWUsIGNvbmZpZy5wb3J0LCBvcHRpb25zKTtcblx0XHRcdFx0Y2FzZSBcImJyb2FkY2FzdFwiOlxuXHRcdFx0XHRcdGNvbnN0IGJjTmFtZSA9IHR5cGVvZiBjb25maWcuYnJvYWRjYXN0ID09PSBcInN0cmluZ1wiID8gY29uZmlnLmJyb2FkY2FzdCA6IHZvaWQgMDtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5hZGRCcm9hZGNhc3QobmFtZSwgYmNOYW1lLCBvcHRpb25zKTtcblx0XHRcdFx0Y2FzZSBcInNlbGZcIjogcmV0dXJuIHRoaXMuYWRkU2VsZkNoYW5uZWwobmFtZSwgb3B0aW9ucyk7XG5cdFx0XHRcdGRlZmF1bHQ6IHJldHVybiB0aGlzLmNyZWF0ZUNoYW5uZWwobmFtZSwgb3B0aW9ucyk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogQ3JlYXRlIGEgTWVzc2FnZUNoYW5uZWwgcGFpciBmb3IgYmlkaXJlY3Rpb25hbCBjb21tdW5pY2F0aW9uXG5cdFx0KlxuXHRcdCogQHBhcmFtIG5hbWUxIC0gRmlyc3QgY2hhbm5lbCBuYW1lXG5cdFx0KiBAcGFyYW0gbmFtZTIgLSBTZWNvbmQgY2hhbm5lbCBuYW1lXG5cdFx0KiBAcmV0dXJucyBCb3RoIGVuZHBvaW50cyBjb25uZWN0ZWQgdmlhIE1lc3NhZ2VDaGFubmVsXG5cdFx0Ki9cblx0XHRjcmVhdGVDaGFubmVsUGFpcihuYW1lMSwgbmFtZTIsIG9wdGlvbnMgPSB7fSkge1xuXHRcdFx0Y29uc3QgbWMgPSBuZXcgTWVzc2FnZUNoYW5uZWwoKTtcblx0XHRcdGNvbnN0IGhhbmRsZXIxID0gbmV3IENoYW5uZWxIYW5kbGVyKG5hbWUxLCB0aGlzLCB7XG5cdFx0XHRcdC4uLnRoaXMuX29wdGlvbnMuZGVmYXVsdE9wdGlvbnMsXG5cdFx0XHRcdC4uLm9wdGlvbnNcblx0XHRcdH0pO1xuXHRcdFx0Y29uc3QgaGFuZGxlcjIgPSBuZXcgQ2hhbm5lbEhhbmRsZXIobmFtZTIsIHRoaXMsIHtcblx0XHRcdFx0Li4udGhpcy5fb3B0aW9ucy5kZWZhdWx0T3B0aW9ucyxcblx0XHRcdFx0Li4ub3B0aW9uc1xuXHRcdFx0fSk7XG5cdFx0XHRtYy5wb3J0MS5zdGFydCgpO1xuXHRcdFx0bWMucG9ydDIuc3RhcnQoKTtcblx0XHRcdGNvbnN0IHJlYWR5MSA9IFByb21pc2UucmVzb2x2ZShoYW5kbGVyMS5jcmVhdGVSZW1vdGVDaGFubmVsKG5hbWUyLCBvcHRpb25zLCBtYy5wb3J0MSkpO1xuXHRcdFx0Y29uc3QgcmVhZHkyID0gUHJvbWlzZS5yZXNvbHZlKGhhbmRsZXIyLmNyZWF0ZVJlbW90ZUNoYW5uZWwobmFtZTEsIG9wdGlvbnMsIG1jLnBvcnQyKSk7XG5cdFx0XHRjb25zdCBjaGFubmVsMSA9IHtcblx0XHRcdFx0bmFtZTogbmFtZTEsXG5cdFx0XHRcdGhhbmRsZXI6IGhhbmRsZXIxLFxuXHRcdFx0XHRjb25uZWN0aW9uOiBoYW5kbGVyMS5jb25uZWN0aW9uLFxuXHRcdFx0XHRzdWJzY3JpcHRpb25zOiBbXSxcblx0XHRcdFx0dHJhbnNwb3J0VHlwZTogXCJtZXNzYWdlLXBvcnRcIixcblx0XHRcdFx0cmVhZHk6IHJlYWR5MSxcblx0XHRcdFx0dW5pZmllZDogaGFuZGxlcjEudW5pZmllZFxuXHRcdFx0fTtcblx0XHRcdGNvbnN0IGNoYW5uZWwyID0ge1xuXHRcdFx0XHRuYW1lOiBuYW1lMixcblx0XHRcdFx0aGFuZGxlcjogaGFuZGxlcjIsXG5cdFx0XHRcdGNvbm5lY3Rpb246IGhhbmRsZXIyLmNvbm5lY3Rpb24sXG5cdFx0XHRcdHN1YnNjcmlwdGlvbnM6IFtdLFxuXHRcdFx0XHR0cmFuc3BvcnRUeXBlOiBcIm1lc3NhZ2UtcG9ydFwiLFxuXHRcdFx0XHRyZWFkeTogcmVhZHkyLFxuXHRcdFx0XHR1bmlmaWVkOiBoYW5kbGVyMi51bmlmaWVkXG5cdFx0XHR9O1xuXHRcdFx0dGhpcy5fZW5kcG9pbnRzLnNldChuYW1lMSwgY2hhbm5lbDEpO1xuXHRcdFx0dGhpcy5fZW5kcG9pbnRzLnNldChuYW1lMiwgY2hhbm5lbDIpO1xuXHRcdFx0dGhpcy5fcmVnaXN0ZXJVbmlmaWVkQ2hhbm5lbChuYW1lMSwgaGFuZGxlcjEudW5pZmllZCk7XG5cdFx0XHR0aGlzLl9yZWdpc3RlclVuaWZpZWRDaGFubmVsKG5hbWUyLCBoYW5kbGVyMi51bmlmaWVkKTtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGNoYW5uZWwxLFxuXHRcdFx0XHRjaGFubmVsMixcblx0XHRcdFx0bWVzc2FnZUNoYW5uZWw6IG1jXG5cdFx0XHR9O1xuXHRcdH1cblx0XHQvKipcblx0XHQqIEdldCB0aGUgZ2xvYmFsIHNlbGYgcmVmZXJlbmNlXG5cdFx0Ki9cblx0XHRnZXQgZ2xvYmFsU2VsZigpIHtcblx0XHRcdHJldHVybiB0aGlzLl9nbG9iYWxTZWxmO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIENvbm5lY3QgdG8gYSByZW1vdGUgY2hhbm5lbCAoZS5nLiwgaW4gYSBXb3JrZXIpXG5cdFx0Ki9cblx0XHRhc3luYyBjb25uZWN0UmVtb3RlKGNoYW5uZWxOYW1lLCBvcHRpb25zID0ge30sIGJyb2FkY2FzdCkge1xuXHRcdFx0dGhpcy5pbml0SG9zdCgpO1xuXHRcdFx0cmV0dXJuIHRoaXMuX2hvc3QuY3JlYXRlUmVtb3RlQ2hhbm5lbChjaGFubmVsTmFtZSwgb3B0aW9ucywgYnJvYWRjYXN0KTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBJbXBvcnQgYSBtb2R1bGUgaW4gYSByZW1vdGUgY2hhbm5lbFxuXHRcdCovXG5cdFx0YXN5bmMgaW1wb3J0TW9kdWxlSW5DaGFubmVsKGNoYW5uZWxOYW1lLCB1cmwsIG9wdGlvbnMgPSB7fSwgYnJvYWRjYXN0KSB7XG5cdFx0XHRyZXR1cm4gKGF3YWl0IHRoaXMuY29ubmVjdFJlbW90ZShjaGFubmVsTmFtZSwgb3B0aW9ucy5jaGFubmVsT3B0aW9ucywgYnJvYWRjYXN0KSk/LmRvSW1wb3J0TW9kdWxlPy4odXJsLCBvcHRpb25zLmltcG9ydE9wdGlvbnMpO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIEludGVybmFsOiBDcmVhdGUgb3IgdXNlIGV4aXN0aW5nIHJlbW90ZSBjaGFubmVsXG5cdFx0Ki9cblx0XHQkY3JlYXRlT3JVc2VFeGlzdGluZ1JlbW90ZShjaGFubmVsLCBvcHRpb25zID0ge30sIGJyb2FkY2FzdCkge1xuXHRcdFx0aWYgKGNoYW5uZWwgPT0gbnVsbCB8fCBicm9hZGNhc3QpIHJldHVybiBudWxsO1xuXHRcdFx0aWYgKHRoaXMuX3JlbW90ZUNoYW5uZWxzLmhhcyhjaGFubmVsKSkgcmV0dXJuIHRoaXMuX3JlbW90ZUNoYW5uZWxzLmdldChjaGFubmVsKTtcblx0XHRcdGNvbnN0IG1zZ0NoYW5uZWwgPSBuZXcgTWVzc2FnZUNoYW5uZWwoKTtcblx0XHRcdGNvbnN0IHByb21pc2UgPSBQcm9taXNlZChuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuXHRcdFx0XHRjb25zdCB3b3JrZXIgPSBsb2FkV29ya2VyKHdvcmtlckNvZGUpO1xuXHRcdFx0XHR3b3JrZXI/LmFkZEV2ZW50TGlzdGVuZXI/LihcIm1lc3NhZ2VcIiwgKGV2ZW50KSA9PiB7XG5cdFx0XHRcdFx0aWYgKGV2ZW50LmRhdGEudHlwZSA9PT0gXCJjaGFubmVsQ3JlYXRlZFwiKSB7XG5cdFx0XHRcdFx0XHRtc2dDaGFubmVsLnBvcnQxPy5zdGFydD8uKCk7XG5cdFx0XHRcdFx0XHRyZXNvbHZlKG5ldyBSZW1vdGVDaGFubmVsSGVscGVyKGV2ZW50LmRhdGEuY2hhbm5lbCwgdGhpcywgb3B0aW9ucykpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHRcdHdvcmtlcj8ucG9zdE1lc3NhZ2U/Lih7XG5cdFx0XHRcdFx0dHlwZTogXCJjcmVhdGVDaGFubmVsXCIsXG5cdFx0XHRcdFx0Y2hhbm5lbCxcblx0XHRcdFx0XHRzZW5kZXI6IHRoaXMuX2hvc3ROYW1lLFxuXHRcdFx0XHRcdG9wdGlvbnMsXG5cdFx0XHRcdFx0bWVzc2FnZVBvcnQ6IG1zZ0NoYW5uZWwucG9ydDJcblx0XHRcdFx0fSwgeyB0cmFuc2ZlcjogW21zZ0NoYW5uZWwucG9ydDJdIH0pO1xuXHRcdFx0fSkpO1xuXHRcdFx0Y29uc3QgaW5mbyA9IHtcblx0XHRcdFx0Y2hhbm5lbCxcblx0XHRcdFx0Y29udGV4dDogdGhpcyxcblx0XHRcdFx0bWVzc2FnZUNoYW5uZWw6IG1zZ0NoYW5uZWwsXG5cdFx0XHRcdHJlbW90ZTogcHJvbWlzZVxuXHRcdFx0fTtcblx0XHRcdHRoaXMuX3JlbW90ZUNoYW5uZWxzLnNldChjaGFubmVsLCBpbmZvKTtcblx0XHRcdHJldHVybiBpbmZvO1xuXHRcdH1cblx0XHQkcmVnaXN0ZXJDb25uZWN0aW9uKHBhcmFtcykge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0Li4udGhpcy5fY29ubmVjdGlvblJlZ2lzdHJ5LnJlZ2lzdGVyKHBhcmFtcyksXG5cdFx0XHRcdGNvbnRleHRJZDogdGhpcy5faWRcblx0XHRcdH07XG5cdFx0fVxuXHRcdCRtYXJrTm90aWZpZWQocGFyYW1zKSB7XG5cdFx0XHRjb25zdCBjb25uZWN0aW9uID0gdGhpcy5fY29ubmVjdGlvblJlZ2lzdHJ5LnJlZ2lzdGVyKHtcblx0XHRcdFx0bG9jYWxDaGFubmVsOiBwYXJhbXMubG9jYWxDaGFubmVsLFxuXHRcdFx0XHRyZW1vdGVDaGFubmVsOiBwYXJhbXMucmVtb3RlQ2hhbm5lbCxcblx0XHRcdFx0c2VuZGVyOiBwYXJhbXMuc2VuZGVyLFxuXHRcdFx0XHRkaXJlY3Rpb246IHBhcmFtcy5kaXJlY3Rpb24sXG5cdFx0XHRcdHRyYW5zcG9ydFR5cGU6IHBhcmFtcy50cmFuc3BvcnRUeXBlXG5cdFx0XHR9KTtcblx0XHRcdHRoaXMuX2Nvbm5lY3Rpb25SZWdpc3RyeS5tYXJrTm90aWZpZWQoY29ubmVjdGlvbiwgcGFyYW1zLnBheWxvYWQpO1xuXHRcdH1cblx0XHQkb2JzZXJ2ZVNpZ25hbChwYXJhbXMpIHtcblx0XHRcdGNvbnN0IGRpcmVjdGlvbiA9IChwYXJhbXMucGF5bG9hZD8udHlwZSA/PyBcIm5vdGlmeVwiKSA9PT0gXCJjb25uZWN0XCIgPyBcImluY29taW5nXCIgOiBcImluY29taW5nXCI7XG5cdFx0XHR0aGlzLiRtYXJrTm90aWZpZWQoe1xuXHRcdFx0XHRsb2NhbENoYW5uZWw6IHBhcmFtcy5sb2NhbENoYW5uZWwsXG5cdFx0XHRcdHJlbW90ZUNoYW5uZWw6IHBhcmFtcy5yZW1vdGVDaGFubmVsLFxuXHRcdFx0XHRzZW5kZXI6IHBhcmFtcy5zZW5kZXIsXG5cdFx0XHRcdGRpcmVjdGlvbixcblx0XHRcdFx0dHJhbnNwb3J0VHlwZTogcGFyYW1zLnRyYW5zcG9ydFR5cGUsXG5cdFx0XHRcdHBheWxvYWQ6IHBhcmFtcy5wYXlsb2FkXG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0JGZvcndhcmRVbmlmaWVkQ29ubmVjdGlvbkV2ZW50KGNoYW5uZWwsIGV2ZW50KSB7XG5cdFx0XHRjb25zdCBtYXBwZWRUcmFuc3BvcnRUeXBlID0gZXZlbnQuY29ubmVjdGlvbi50cmFuc3BvcnRUeXBlID8/IFwiaW50ZXJuYWxcIjtcblx0XHRcdGNvbnN0IGNvbm5lY3Rpb24gPSB0aGlzLl9jb25uZWN0aW9uUmVnaXN0cnkucmVnaXN0ZXIoe1xuXHRcdFx0XHRsb2NhbENoYW5uZWw6IGV2ZW50LmNvbm5lY3Rpb24ubG9jYWxDaGFubmVsIHx8IGNoYW5uZWwsXG5cdFx0XHRcdHJlbW90ZUNoYW5uZWw6IGV2ZW50LmNvbm5lY3Rpb24ucmVtb3RlQ2hhbm5lbCxcblx0XHRcdFx0c2VuZGVyOiBldmVudC5jb25uZWN0aW9uLnNlbmRlcixcblx0XHRcdFx0ZGlyZWN0aW9uOiBldmVudC5jb25uZWN0aW9uLmRpcmVjdGlvbixcblx0XHRcdFx0dHJhbnNwb3J0VHlwZTogbWFwcGVkVHJhbnNwb3J0VHlwZSxcblx0XHRcdFx0bWV0YWRhdGE6IGV2ZW50LmNvbm5lY3Rpb24ubWV0YWRhdGFcblx0XHRcdH0pO1xuXHRcdFx0aWYgKGV2ZW50LnR5cGUgPT09IFwibm90aWZpZWRcIikgdGhpcy5fY29ubmVjdGlvblJlZ2lzdHJ5Lm1hcmtOb3RpZmllZChjb25uZWN0aW9uLCBldmVudC5wYXlsb2FkKTtcblx0XHRcdGVsc2UgaWYgKGV2ZW50LnR5cGUgPT09IFwiZGlzY29ubmVjdGVkXCIpIHRoaXMuX2Nvbm5lY3Rpb25SZWdpc3RyeS5jbG9zZUJ5Q2hhbm5lbChldmVudC5jb25uZWN0aW9uLmxvY2FsQ2hhbm5lbCk7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogQ2xvc2UgYSBzcGVjaWZpYyBjaGFubmVsXG5cdFx0Ki9cblx0XHRjbG9zZUNoYW5uZWwobmFtZSkge1xuXHRcdFx0Y29uc3QgZW5kcG9pbnQgPSB0aGlzLl9lbmRwb2ludHMuZ2V0KG5hbWUpO1xuXHRcdFx0aWYgKCFlbmRwb2ludCkgcmV0dXJuIGZhbHNlO1xuXHRcdFx0ZW5kcG9pbnQuc3Vic2NyaXB0aW9ucy5mb3JFYWNoKChzKSA9PiBzLnVuc3Vic2NyaWJlKCkpO1xuXHRcdFx0ZW5kcG9pbnQuaGFuZGxlci5jbG9zZSgpO1xuXHRcdFx0ZW5kcG9pbnQudHJhbnNwb3J0Py5kZXRhY2goKTtcblx0XHRcdHRoaXMuX3VuaWZpZWRDb25uZWN0aW9uU3Vicy5nZXQobmFtZSk/LnVuc3Vic2NyaWJlKCk7XG5cdFx0XHR0aGlzLl91bmlmaWVkQ29ubmVjdGlvblN1YnMuZGVsZXRlKG5hbWUpO1xuXHRcdFx0dGhpcy5fdW5pZmllZEJ5Q2hhbm5lbC5kZWxldGUobmFtZSk7XG5cdFx0XHR0aGlzLl9lbmRwb2ludHMuZGVsZXRlKG5hbWUpO1xuXHRcdFx0aWYgKG5hbWUgPT09IHRoaXMuX2hvc3ROYW1lKSB0aGlzLl9ob3N0ID0gbnVsbDtcblx0XHRcdHRoaXMuX2Nvbm5lY3Rpb25SZWdpc3RyeS5jbG9zZUJ5Q2hhbm5lbChuYW1lKTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIENsb3NlIGFsbCBjaGFubmVscyBhbmQgY2xlYW51cFxuXHRcdCovXG5cdFx0Y2xvc2UoKSB7XG5cdFx0XHRpZiAodGhpcy5fY2xvc2VkKSByZXR1cm47XG5cdFx0XHR0aGlzLl9jbG9zZWQgPSB0cnVlO1xuXHRcdFx0Zm9yIChjb25zdCBbbmFtZV0gb2YgdGhpcy5fZW5kcG9pbnRzKSB0aGlzLmNsb3NlQ2hhbm5lbChuYW1lKTtcblx0XHRcdHRoaXMuX3JlbW90ZUNoYW5uZWxzLmNsZWFyKCk7XG5cdFx0XHR0aGlzLl9ob3N0ID0gbnVsbDtcblx0XHRcdHRoaXMuX3VuaWZpZWRDb25uZWN0aW9uU3Vicy5mb3JFYWNoKChzdWIpID0+IHN1Yi51bnN1YnNjcmliZSgpKTtcblx0XHRcdHRoaXMuX3VuaWZpZWRDb25uZWN0aW9uU3Vicy5jbGVhcigpO1xuXHRcdFx0dGhpcy5fdW5pZmllZEJ5Q2hhbm5lbC5jbGVhcigpO1xuXHRcdFx0dGhpcy5fY29ubmVjdGlvblJlZ2lzdHJ5LmNsZWFyKCk7XG5cdFx0XHR0aGlzLl9jb25uZWN0aW9uRXZlbnRzLmNvbXBsZXRlKCk7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogQ2hlY2sgaWYgY29udGV4dCBpcyBjbG9zZWRcblx0XHQqL1xuXHRcdGdldCBjbG9zZWQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY2xvc2VkO1xuXHRcdH1cblx0XHRfcmVnaXN0ZXJVbmlmaWVkQ2hhbm5lbChuYW1lLCB1bmlmaWVkKSB7XG5cdFx0XHR0aGlzLl91bmlmaWVkQnlDaGFubmVsLnNldChuYW1lLCB1bmlmaWVkKTtcblx0XHRcdHRoaXMuX3VuaWZpZWRDb25uZWN0aW9uU3Vicy5nZXQobmFtZSk/LnVuc3Vic2NyaWJlKCk7XG5cdFx0XHRjb25zdCBzdWJzY3JpcHRpb24gPSB1bmlmaWVkLnN1YnNjcmliZUNvbm5lY3Rpb25zKChldmVudCkgPT4ge1xuXHRcdFx0XHR0aGlzLiRmb3J3YXJkVW5pZmllZENvbm5lY3Rpb25FdmVudChuYW1lLCBldmVudCk7XG5cdFx0XHR9KTtcblx0XHRcdHRoaXMuX3VuaWZpZWRDb25uZWN0aW9uU3Vicy5zZXQobmFtZSwgc3Vic2NyaXB0aW9uKTtcblx0XHR9XG5cdFx0X2VtaXRDb25uZWN0aW9uRXZlbnQoZXZlbnQpIHtcblx0XHRcdHRoaXMuX2Nvbm5lY3Rpb25FdmVudHMubmV4dCh7XG5cdFx0XHRcdC4uLmV2ZW50LFxuXHRcdFx0XHRjb25uZWN0aW9uOiB7XG5cdFx0XHRcdFx0Li4uZXZlbnQuY29ubmVjdGlvbixcblx0XHRcdFx0XHRjb250ZXh0SWQ6IHRoaXMuX2lkXG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0fTtcblx0ZnVuY3Rpb24gaXNSZWZsZWN0QWN0aW9uKGFjdGlvbikge1xuXHRcdHJldHVybiBbLi4uT2JqZWN0LnZhbHVlcyhXUmVmbGVjdEFjdGlvbildLmluY2x1ZGVzKGFjdGlvbik7XG5cdH1cblx0ZnVuY3Rpb24gbm9ybWFsaXplVHJhbnNwb3J0QmluZGluZyh0YXJnZXQpIHtcblx0XHRpZiAoIXRhcmdldCkgcmV0dXJuIG51bGw7XG5cdFx0aWYgKGlzVHJhbnNwb3J0QmluZGluZyh0YXJnZXQpKSByZXR1cm4gdGFyZ2V0O1xuXHRcdGNvbnN0IG5hdGl2ZVRhcmdldCA9IHRhcmdldDtcblx0XHRjb25zdCB0cmFuc3BvcnRUeXBlID0gZ2V0RHluYW1pY1RyYW5zcG9ydFR5cGUobmF0aXZlVGFyZ2V0KTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dGFyZ2V0OiBuYXRpdmVUYXJnZXQsXG5cdFx0XHR0YXJnZXRDaGFubmVsOiBcInVua25vd25cIixcblx0XHRcdHRyYW5zcG9ydFR5cGU6IHRyYW5zcG9ydFR5cGUgPT09IFwiaW50ZXJuYWxcIiA/IFwic2VsZlwiIDogdHJhbnNwb3J0VHlwZSxcblx0XHRcdHNlbmRlcjogKG1lc3NhZ2UsIHRyYW5zZmVyKSA9PiB7XG5cdFx0XHRcdGlmICh0eXBlb2YgV2ViU29ja2V0ICE9PSBcInVuZGVmaW5lZFwiICYmIG5hdGl2ZVRhcmdldCBpbnN0YW5jZW9mIFdlYlNvY2tldCkge1xuXHRcdFx0XHRcdG5hdGl2ZVRhcmdldC5zZW5kKEpTT04uc3RyaW5naWZ5KG1lc3NhZ2UpKTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0bmF0aXZlVGFyZ2V0LnBvc3RNZXNzYWdlPy4obWVzc2FnZSwgdHJhbnNmZXI/Lmxlbmd0aCA/IHsgdHJhbnNmZXIgfSA6IHZvaWQgMCk7XG5cdFx0XHR9LFxuXHRcdFx0cG9zdE1lc3NhZ2U6IChtZXNzYWdlLCBvcHRpb25zKSA9PiB7XG5cdFx0XHRcdG5hdGl2ZVRhcmdldC5wb3N0TWVzc2FnZT8uKG1lc3NhZ2UsIG9wdGlvbnMpO1xuXHRcdFx0fSxcblx0XHRcdGFkZEV2ZW50TGlzdGVuZXI6IG5hdGl2ZVRhcmdldC5hZGRFdmVudExpc3RlbmVyPy5iaW5kKG5hdGl2ZVRhcmdldCksXG5cdFx0XHRyZW1vdmVFdmVudExpc3RlbmVyOiBuYXRpdmVUYXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcj8uYmluZChuYXRpdmVUYXJnZXQpLFxuXHRcdFx0c3RhcnQ6IG5hdGl2ZVRhcmdldC5zdGFydD8uYmluZChuYXRpdmVUYXJnZXQpLFxuXHRcdFx0Y2xvc2U6IG5hdGl2ZVRhcmdldC5jbG9zZT8uYmluZChuYXRpdmVUYXJnZXQpXG5cdFx0fTtcblx0fVxuXHRmdW5jdGlvbiBpc1RyYW5zcG9ydEJpbmRpbmcodmFsdWUpIHtcblx0XHRyZXR1cm4gISF2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiYgXCJ0YXJnZXRcIiBpbiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUucG9zdE1lc3NhZ2UgPT09IFwiZnVuY3Rpb25cIjtcblx0fVxuXHRmdW5jdGlvbiBnZXREeW5hbWljVHJhbnNwb3J0VHlwZSh0YXJnZXQpIHtcblx0XHRjb25zdCBlZmZlY3RpdmVUYXJnZXQgPSBpc1RyYW5zcG9ydEJpbmRpbmcodGFyZ2V0KSA/IHRhcmdldC50YXJnZXQgOiB0YXJnZXQ7XG5cdFx0aWYgKCFlZmZlY3RpdmVUYXJnZXQpIHJldHVybiBcImludGVybmFsXCI7XG5cdFx0aWYgKGVmZmVjdGl2ZVRhcmdldCA9PT0gXCJjaHJvbWUtcnVudGltZVwiKSByZXR1cm4gXCJjaHJvbWUtcnVudGltZVwiO1xuXHRcdGlmIChlZmZlY3RpdmVUYXJnZXQgPT09IFwiY2hyb21lLXRhYnNcIikgcmV0dXJuIFwiY2hyb21lLXRhYnNcIjtcblx0XHRpZiAoZWZmZWN0aXZlVGFyZ2V0ID09PSBcImNocm9tZS1wb3J0XCIpIHJldHVybiBcImNocm9tZS1wb3J0XCI7XG5cdFx0aWYgKGVmZmVjdGl2ZVRhcmdldCA9PT0gXCJjaHJvbWUtZXh0ZXJuYWxcIikgcmV0dXJuIFwiY2hyb21lLWV4dGVybmFsXCI7XG5cdFx0aWYgKHR5cGVvZiBNZXNzYWdlUG9ydCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBlZmZlY3RpdmVUYXJnZXQgaW5zdGFuY2VvZiBNZXNzYWdlUG9ydCkgcmV0dXJuIFwibWVzc2FnZS1wb3J0XCI7XG5cdFx0aWYgKHR5cGVvZiBCcm9hZGNhc3RDaGFubmVsICE9PSBcInVuZGVmaW5lZFwiICYmIGVmZmVjdGl2ZVRhcmdldCBpbnN0YW5jZW9mIEJyb2FkY2FzdENoYW5uZWwpIHJldHVybiBcImJyb2FkY2FzdFwiO1xuXHRcdGlmICh0eXBlb2YgV29ya2VyICE9PSBcInVuZGVmaW5lZFwiICYmIGVmZmVjdGl2ZVRhcmdldCBpbnN0YW5jZW9mIFdvcmtlcikgcmV0dXJuIFwid29ya2VyXCI7XG5cdFx0aWYgKHR5cGVvZiBXZWJTb2NrZXQgIT09IFwidW5kZWZpbmVkXCIgJiYgZWZmZWN0aXZlVGFyZ2V0IGluc3RhbmNlb2YgV2ViU29ja2V0KSByZXR1cm4gXCJ3ZWJzb2NrZXRcIjtcblx0XHRpZiAodHlwZW9mIGNocm9tZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgZWZmZWN0aXZlVGFyZ2V0ID09PSBcIm9iamVjdFwiICYmIGVmZmVjdGl2ZVRhcmdldCAmJiB0eXBlb2YgZWZmZWN0aXZlVGFyZ2V0LnBvc3RNZXNzYWdlID09PSBcImZ1bmN0aW9uXCIgJiYgZWZmZWN0aXZlVGFyZ2V0Lm9uTWVzc2FnZT8uYWRkTGlzdGVuZXIpIHJldHVybiBcImNocm9tZS1wb3J0XCI7XG5cdFx0aWYgKHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiICYmIGVmZmVjdGl2ZVRhcmdldCA9PT0gc2VsZikgcmV0dXJuIFwic2VsZlwiO1xuXHRcdHJldHVybiBcImludGVybmFsXCI7XG5cdH1cblx0ZnVuY3Rpb24gbG9hZFdvcmtlcihXWCkge1xuXHRcdGlmIChXWCBpbnN0YW5jZW9mIFdvcmtlcikgcmV0dXJuIFdYO1xuXHRcdGlmIChXWCBpbnN0YW5jZW9mIFVSTCkgcmV0dXJuIG5ldyBXb3JrZXIoV1guaHJlZiwgeyB0eXBlOiBcIm1vZHVsZVwiIH0pO1xuXHRcdGlmICh0eXBlb2YgV1ggPT09IFwiZnVuY3Rpb25cIikgdHJ5IHtcblx0XHRcdHJldHVybiBuZXcgV1goeyB0eXBlOiBcIm1vZHVsZVwiIH0pO1xuXHRcdH0gY2F0Y2gge1xuXHRcdFx0cmV0dXJuIFdYKHsgdHlwZTogXCJtb2R1bGVcIiB9KTtcblx0XHR9XG5cdFx0aWYgKHR5cGVvZiBXWCA9PT0gXCJzdHJpbmdcIikge1xuXHRcdFx0aWYgKFdYLnN0YXJ0c1dpdGgoXCIvXCIpKSByZXR1cm4gbmV3IFdvcmtlcihyZXNvbHZlV29ya2VyU3BlY2lmaWVySHJlZihXWC5yZXBsYWNlKC9eXFwvLywgXCIuL1wiKSksIHsgdHlwZTogXCJtb2R1bGVcIiB9KTtcblx0XHRcdGlmIChVUkwuY2FuUGFyc2UoV1gpIHx8IFdYLnN0YXJ0c1dpdGgoXCIuL1wiKSkgcmV0dXJuIG5ldyBXb3JrZXIocmVzb2x2ZVdvcmtlclNwZWNpZmllckhyZWYoV1gpLCB7IHR5cGU6IFwibW9kdWxlXCIgfSk7XG5cdFx0XHRyZXR1cm4gbmV3IFdvcmtlcihVUkwuY3JlYXRlT2JqZWN0VVJMKG5ldyBCbG9iKFtXWF0sIHsgdHlwZTogXCJhcHBsaWNhdGlvbi9qYXZhc2NyaXB0XCIgfSkpLCB7IHR5cGU6IFwibW9kdWxlXCIgfSk7XG5cdFx0fVxuXHRcdGlmIChXWCBpbnN0YW5jZW9mIEJsb2IgfHwgV1ggaW5zdGFuY2VvZiBGaWxlKSByZXR1cm4gbmV3IFdvcmtlcihVUkwuY3JlYXRlT2JqZWN0VVJMKFdYKSwgeyB0eXBlOiBcIm1vZHVsZVwiIH0pO1xuXHRcdHJldHVybiBXWCA/PyAodHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogbnVsbCk7XG5cdH1cblx0LyoqIEdsb2JhbCBjb250ZXh0IHJlZ2lzdHJ5IGZvciBzaGFyZWQgY29udGV4dHMgKi9cblx0Y29uc3QgQ09OVEVYVF9SRUdJU1RSWSA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG5cdC8qKlxuXHQqIENyZWF0ZSBhIG5ldyBjaGFubmVsIGNvbnRleHRcblx0KlxuXHQqIFVzZSB0aGlzIGZvciBpc29sYXRlZCBjaGFubmVsIG1hbmFnZW1lbnQgaW4gY29tcG9uZW50c1xuXHQqL1xuXHRmdW5jdGlvbiBjcmVhdGVDaGFubmVsQ29udGV4dChvcHRpb25zID0ge30pIHtcblx0XHRjb25zdCBjdHggPSBuZXcgQ2hhbm5lbENvbnRleHQob3B0aW9ucyk7XG5cdFx0aWYgKG9wdGlvbnMubmFtZSkgQ09OVEVYVF9SRUdJU1RSWS5zZXQob3B0aW9ucy5uYW1lLCBjdHgpO1xuXHRcdHJldHVybiBjdHg7XG5cdH1cblxuLy8gLi4vdW5pZm9ybS50cy9zcmMvbmV3ZXIvbmV4dC90cmFuc3BvcnQvV29ya2VyLnRzXG4vKipcblx0KiBXb3JrZXIgRW50cnkgUG9pbnQgLSBNdWx0aS1DaGFubmVsIFN1cHBvcnRcblx0KlxuXHQqIFRoaXMgd29ya2VyIGNvbnRleHQgc3VwcG9ydHM6XG5cdCogLSBNdWx0aXBsZSBjaGFubmVsIGNyZWF0aW9uL2luaXRpYWxpemF0aW9uXG5cdCogLSBPYnNlcnZpbmcgbmV3IGluY29taW5nIGNoYW5uZWwgY29ubmVjdGlvbnNcblx0KiAtIER5bmFtaWMgY2hhbm5lbCBhZGRpdGlvbiBhZnRlciBpbml0aWFsaXphdGlvblxuXHQqIC0gQ29ubmVjdGlvbiBmcm9tIHJlbW90ZS9ob3N0IGNvbnRleHRzXG5cdCovXG5cdC8qKlxuXHQqIFdvcmtlckNvbnRleHQgLSBNYW5hZ2VzIGNoYW5uZWxzIHdpdGhpbiBhIFdvcmtlclxuXHQqXG5cdCogU3VwcG9ydHMgb2JzZXJ2aW5nIG5ldyBpbmNvbWluZyBjb25uZWN0aW9ucyBmcm9tIGhvc3QvcmVtb3RlIGNvbnRleHRzLlxuXHQqL1xuXHR2YXIgV29ya2VyQ29udGV4dCA9IGNsYXNzIHtcblx0XHRfY29udGV4dDtcblx0XHRfY29uZmlnO1xuXHRcdF9zdWJzY3JpcHRpb25zID0gW107XG5cdFx0X2luY29taW5nQ29ubmVjdGlvbnMgPSBuZXcgQ2hhbm5lbFN1YmplY3QoeyBidWZmZXJTaXplOiAxMDAgfSk7XG5cdFx0X2NoYW5uZWxDcmVhdGVkID0gbmV3IENoYW5uZWxTdWJqZWN0KHsgYnVmZmVyU2l6ZTogMTAwIH0pO1xuXHRcdF9jaGFubmVsQ2xvc2VkID0gbmV3IENoYW5uZWxTdWJqZWN0KCk7XG5cdFx0Y29uc3RydWN0b3IoY29uZmlnID0ge30pIHtcblx0XHRcdHRoaXMuX2NvbmZpZyA9IHtcblx0XHRcdFx0bmFtZTogY29uZmlnLm5hbWUgPz8gXCJ3b3JrZXJcIixcblx0XHRcdFx0d29ya2VyTmFtZTogY29uZmlnLndvcmtlck5hbWUgPz8gYHdvcmtlci0ke1VVSUR2NCgpLnNsaWNlKDAsIDgpfWAsXG5cdFx0XHRcdGF1dG9BY2NlcHRDaGFubmVsczogY29uZmlnLmF1dG9BY2NlcHRDaGFubmVscyA/PyB0cnVlLFxuXHRcdFx0XHRhbGxvd2VkQ2hhbm5lbHM6IGNvbmZpZy5hbGxvd2VkQ2hhbm5lbHMgPz8gW10sXG5cdFx0XHRcdG1heENoYW5uZWxzOiBjb25maWcubWF4Q2hhbm5lbHMgPz8gMTAwLFxuXHRcdFx0XHRhdXRvQ29ubmVjdDogY29uZmlnLmF1dG9Db25uZWN0ID8/IHRydWUsXG5cdFx0XHRcdHVzZUdsb2JhbFNlbGY6IHRydWUsXG5cdFx0XHRcdGRlZmF1bHRPcHRpb25zOiBjb25maWcuZGVmYXVsdE9wdGlvbnMgPz8ge30sXG5cdFx0XHRcdGlzb2xhdGVkU3RvcmFnZTogY29uZmlnLmlzb2xhdGVkU3RvcmFnZSA/PyBmYWxzZSxcblx0XHRcdFx0Li4uY29uZmlnXG5cdFx0XHR9O1xuXHRcdFx0dGhpcy5fY29udGV4dCA9IGNyZWF0ZUNoYW5uZWxDb250ZXh0KHtcblx0XHRcdFx0bmFtZTogdGhpcy5fY29uZmlnLm5hbWUsXG5cdFx0XHRcdHVzZUdsb2JhbFNlbGY6IHRydWUsXG5cdFx0XHRcdGRlZmF1bHRPcHRpb25zOiBjb25maWcuZGVmYXVsdE9wdGlvbnNcblx0XHRcdH0pO1xuXHRcdFx0dGhpcy5fc2V0dXBNZXNzYWdlTGlzdGVuZXIoKTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBPYnNlcnZhYmxlOiBOZXcgaW5jb21pbmcgY29ubmVjdGlvbiByZXF1ZXN0c1xuXHRcdCovXG5cdFx0Z2V0IG9uQ29ubmVjdGlvbigpIHtcblx0XHRcdHJldHVybiB0aGlzLl9pbmNvbWluZ0Nvbm5lY3Rpb25zO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIE9ic2VydmFibGU6IENoYW5uZWwgY3JlYXRlZCBldmVudHNcblx0XHQqL1xuXHRcdGdldCBvbkNoYW5uZWxDcmVhdGVkKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2NoYW5uZWxDcmVhdGVkO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIE9ic2VydmFibGU6IENoYW5uZWwgY2xvc2VkIGV2ZW50c1xuXHRcdCovXG5cdFx0Z2V0IG9uQ2hhbm5lbENsb3NlZCgpIHtcblx0XHRcdHJldHVybiB0aGlzLl9jaGFubmVsQ2xvc2VkO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIFN1YnNjcmliZSB0byBpbmNvbWluZyBjb25uZWN0aW9uc1xuXHRcdCovXG5cdFx0c3Vic2NyaWJlQ29ubmVjdGlvbnMoaGFuZGxlcikge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2luY29taW5nQ29ubmVjdGlvbnMuc3Vic2NyaWJlKGhhbmRsZXIpO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIFN1YnNjcmliZSB0byBjaGFubmVsIGNyZWF0aW9uXG5cdFx0Ki9cblx0XHRzdWJzY3JpYmVDaGFubmVsQ3JlYXRlZChoYW5kbGVyKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY2hhbm5lbENyZWF0ZWQuc3Vic2NyaWJlKGhhbmRsZXIpO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIEFjY2VwdCBhbiBpbmNvbWluZyBjb25uZWN0aW9uIGFuZCBjcmVhdGUgdGhlIGNoYW5uZWxcblx0XHQqL1xuXHRcdGFjY2VwdENvbm5lY3Rpb24oY29ubmVjdGlvbikge1xuXHRcdFx0aWYgKCF0aGlzLl9jYW5BY2NlcHRDaGFubmVsKGNvbm5lY3Rpb24uY2hhbm5lbCkpIHJldHVybiBudWxsO1xuXHRcdFx0Y29uc3QgZW5kcG9pbnQgPSB0aGlzLl9jb250ZXh0LmNyZWF0ZUNoYW5uZWwoY29ubmVjdGlvbi5jaGFubmVsLCBjb25uZWN0aW9uLm9wdGlvbnMpO1xuXHRcdFx0aWYgKGNvbm5lY3Rpb24ucG9ydCkge1xuXHRcdFx0XHRjb25uZWN0aW9uLnBvcnQuc3RhcnQ/LigpO1xuXHRcdFx0XHRlbmRwb2ludC5oYW5kbGVyLmNyZWF0ZVJlbW90ZUNoYW5uZWwoY29ubmVjdGlvbi5zZW5kZXIsIGNvbm5lY3Rpb24ub3B0aW9ucywgY29ubmVjdGlvbi5wb3J0KTtcblx0XHRcdH1cblx0XHRcdHRoaXMuX2NoYW5uZWxDcmVhdGVkLm5leHQoe1xuXHRcdFx0XHRjaGFubmVsOiBjb25uZWN0aW9uLmNoYW5uZWwsXG5cdFx0XHRcdGVuZHBvaW50LFxuXHRcdFx0XHRzZW5kZXI6IGNvbm5lY3Rpb24uc2VuZGVyLFxuXHRcdFx0XHR0aW1lc3RhbXA6IERhdGUubm93KClcblx0XHRcdH0pO1xuXHRcdFx0dGhpcy5fcG9zdENoYW5uZWxDcmVhdGVkKGNvbm5lY3Rpb24uY2hhbm5lbCwgY29ubmVjdGlvbi5zZW5kZXIsIGNvbm5lY3Rpb24uaWQpO1xuXHRcdFx0cmV0dXJuIGVuZHBvaW50O1xuXHRcdH1cblx0XHQvKipcblx0XHQqIENyZWF0ZSBhIG5ldyBjaGFubmVsIGluIHRoaXMgd29ya2VyIGNvbnRleHRcblx0XHQqL1xuXHRcdGNyZWF0ZUNoYW5uZWwobmFtZSwgb3B0aW9ucykge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2NvbnRleHQuY3JlYXRlQ2hhbm5lbChuYW1lLCBvcHRpb25zKTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBHZXQgYW4gZXhpc3RpbmcgY2hhbm5lbFxuXHRcdCovXG5cdFx0Z2V0Q2hhbm5lbChuYW1lKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY29udGV4dC5nZXRDaGFubmVsKG5hbWUpO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIENoZWNrIGlmIGNoYW5uZWwgZXhpc3RzXG5cdFx0Ki9cblx0XHRoYXNDaGFubmVsKG5hbWUpIHtcblx0XHRcdHJldHVybiB0aGlzLl9jb250ZXh0Lmhhc0NoYW5uZWwobmFtZSk7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogR2V0IGFsbCBjaGFubmVsIG5hbWVzXG5cdFx0Ki9cblx0XHRnZXRDaGFubmVsTmFtZXMoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY29udGV4dC5nZXRDaGFubmVsTmFtZXMoKTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBRdWVyeSBjdXJyZW50bHkgdHJhY2tlZCBjaGFubmVsIGNvbm5lY3Rpb25zIGluIHRoaXMgd29ya2VyLlxuXHRcdCovXG5cdFx0cXVlcnlDb25uZWN0aW9ucyhxdWVyeSA9IHt9KSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY29udGV4dC5xdWVyeUNvbm5lY3Rpb25zKHF1ZXJ5KTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBOb3RpZnkgYWN0aXZlIGNvbm5lY3Rpb25zICh1c2VmdWwgZm9yIHdvcmtlcjwtPmhvc3Qgc3luYykuXG5cdFx0Ki9cblx0XHRub3RpZnlDb25uZWN0aW9ucyhwYXlsb2FkID0ge30sIHF1ZXJ5ID0ge30pIHtcblx0XHRcdHJldHVybiB0aGlzLl9jb250ZXh0Lm5vdGlmeUNvbm5lY3Rpb25zKHBheWxvYWQsIHF1ZXJ5KTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBDbG9zZSBhIHNwZWNpZmljIGNoYW5uZWxcblx0XHQqL1xuXHRcdGNsb3NlQ2hhbm5lbChuYW1lKSB7XG5cdFx0XHRjb25zdCBjbG9zZWQgPSB0aGlzLl9jb250ZXh0LmNsb3NlQ2hhbm5lbChuYW1lKTtcblx0XHRcdGlmIChjbG9zZWQpIHRoaXMuX2NoYW5uZWxDbG9zZWQubmV4dCh7XG5cdFx0XHRcdGNoYW5uZWw6IG5hbWUsXG5cdFx0XHRcdHRpbWVzdGFtcDogRGF0ZS5ub3coKVxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gY2xvc2VkO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIEdldCB0aGUgdW5kZXJseWluZyBjb250ZXh0XG5cdFx0Ki9cblx0XHRnZXQgY29udGV4dCgpIHtcblx0XHRcdHJldHVybiB0aGlzLl9jb250ZXh0O1xuXHRcdH1cblx0XHQvKipcblx0XHQqIEdldCB3b3JrZXIgY29uZmlndXJhdGlvblxuXHRcdCovXG5cdFx0Z2V0IGNvbmZpZygpIHtcblx0XHRcdHJldHVybiB0aGlzLl9jb25maWc7XG5cdFx0fVxuXHRcdF9zZXR1cE1lc3NhZ2VMaXN0ZW5lcigpIHtcblx0XHRcdGFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsICgoZXZlbnQpID0+IHtcblx0XHRcdFx0dGhpcy5faGFuZGxlSW5jb21pbmdNZXNzYWdlKGV2ZW50KTtcblx0XHRcdH0pKTtcblx0XHR9XG5cdFx0X2hhbmRsZUluY29taW5nTWVzc2FnZShldmVudCkge1xuXHRcdFx0Y29uc3QgZGF0YSA9IGV2ZW50LmRhdGE7XG5cdFx0XHRpZiAoIWRhdGEgfHwgdHlwZW9mIGRhdGEgIT09IFwib2JqZWN0XCIpIHJldHVybjtcblx0XHRcdHN3aXRjaCAoZGF0YS50eXBlKSB7XG5cdFx0XHRcdGNhc2UgXCJjcmVhdGVDaGFubmVsXCI6XG5cdFx0XHRcdFx0dGhpcy5faGFuZGxlQ3JlYXRlQ2hhbm5lbChkYXRhKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcImNvbm5lY3RDaGFubmVsXCI6XG5cdFx0XHRcdFx0dGhpcy5faGFuZGxlQ29ubmVjdENoYW5uZWwoZGF0YSk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJhZGRQb3J0XCI6XG5cdFx0XHRcdFx0dGhpcy5faGFuZGxlQWRkUG9ydChkYXRhKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcImxpc3RDaGFubmVsc1wiOlxuXHRcdFx0XHRcdHRoaXMuX2hhbmRsZUxpc3RDaGFubmVscyhkYXRhKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcImNsb3NlQ2hhbm5lbFwiOlxuXHRcdFx0XHRcdHRoaXMuX2hhbmRsZUNsb3NlQ2hhbm5lbChkYXRhKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcInBpbmdcIjpcblx0XHRcdFx0XHRwb3N0TWVzc2FnZSh7XG5cdFx0XHRcdFx0XHR0eXBlOiBcInBvbmdcIixcblx0XHRcdFx0XHRcdGlkOiBkYXRhLmlkLFxuXHRcdFx0XHRcdFx0dGltZXN0YW1wOiBEYXRlLm5vdygpXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGRlZmF1bHQ6IGlmIChkYXRhLmNoYW5uZWwgJiYgdGhpcy5fY29udGV4dC5oYXNDaGFubmVsKGRhdGEuY2hhbm5lbCkpICh0aGlzLl9jb250ZXh0LmdldENoYW5uZWwoZGF0YS5jaGFubmVsKT8uaGFuZGxlcik/LmhhbmRsZUFuZFJlc3BvbnNlPy4oZGF0YS5wYXlsb2FkLCBkYXRhLnJlcUlkKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0X2hhbmRsZUNyZWF0ZUNoYW5uZWwoZGF0YSkge1xuXHRcdFx0Y29uc3QgY29ubmVjdGlvbiA9IHtcblx0XHRcdFx0aWQ6IGRhdGEucmVxSWQgPz8gVVVJRHY0KCksXG5cdFx0XHRcdGNoYW5uZWw6IGRhdGEuY2hhbm5lbCxcblx0XHRcdFx0c2VuZGVyOiBkYXRhLnNlbmRlciA/PyBcInVua25vd25cIixcblx0XHRcdFx0dHlwZTogXCJjaGFubmVsXCIsXG5cdFx0XHRcdHBvcnQ6IGRhdGEubWVzc2FnZVBvcnQsXG5cdFx0XHRcdHRpbWVzdGFtcDogRGF0ZS5ub3coKSxcblx0XHRcdFx0b3B0aW9uczogZGF0YS5vcHRpb25zXG5cdFx0XHR9O1xuXHRcdFx0dGhpcy5faW5jb21pbmdDb25uZWN0aW9ucy5uZXh0KGNvbm5lY3Rpb24pO1xuXHRcdFx0aWYgKHRoaXMuX2NvbmZpZy5hdXRvQWNjZXB0Q2hhbm5lbHMpIHRoaXMuYWNjZXB0Q29ubmVjdGlvbihjb25uZWN0aW9uKTtcblx0XHR9XG5cdFx0X2hhbmRsZUNvbm5lY3RDaGFubmVsKGRhdGEpIHtcblx0XHRcdGNvbnN0IGNvbm5lY3Rpb24gPSB7XG5cdFx0XHRcdGlkOiBkYXRhLnJlcUlkID8/IFVVSUR2NCgpLFxuXHRcdFx0XHRjaGFubmVsOiBkYXRhLmNoYW5uZWwsXG5cdFx0XHRcdHNlbmRlcjogZGF0YS5zZW5kZXIgPz8gXCJ1bmtub3duXCIsXG5cdFx0XHRcdHR5cGU6IGRhdGEucG9ydFR5cGUgPz8gXCJjaGFubmVsXCIsXG5cdFx0XHRcdHBvcnQ6IGRhdGEucG9ydCxcblx0XHRcdFx0dGltZXN0YW1wOiBEYXRlLm5vdygpLFxuXHRcdFx0XHRvcHRpb25zOiBkYXRhLm9wdGlvbnNcblx0XHRcdH07XG5cdFx0XHR0aGlzLl9pbmNvbWluZ0Nvbm5lY3Rpb25zLm5leHQoY29ubmVjdGlvbik7XG5cdFx0XHRpZiAodGhpcy5fY29uZmlnLmF1dG9BY2NlcHRDaGFubmVscyAmJiB0aGlzLl9jYW5BY2NlcHRDaGFubmVsKGRhdGEuY2hhbm5lbCkpIHtcblx0XHRcdFx0Y29uc3QgZW5kcG9pbnQgPSB0aGlzLl9jb250ZXh0LmdldE9yQ3JlYXRlQ2hhbm5lbChkYXRhLmNoYW5uZWwsIGRhdGEub3B0aW9ucyk7XG5cdFx0XHRcdGlmIChkYXRhLnBvcnQpIHtcblx0XHRcdFx0XHRkYXRhLnBvcnQuc3RhcnQ/LigpO1xuXHRcdFx0XHRcdGVuZHBvaW50LmhhbmRsZXIuY3JlYXRlUmVtb3RlQ2hhbm5lbChkYXRhLnNlbmRlciwgZGF0YS5vcHRpb25zLCBkYXRhLnBvcnQpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHBvc3RNZXNzYWdlKHtcblx0XHRcdFx0XHR0eXBlOiBcImNoYW5uZWxDb25uZWN0ZWRcIixcblx0XHRcdFx0XHRjaGFubmVsOiBkYXRhLmNoYW5uZWwsXG5cdFx0XHRcdFx0cmVxSWQ6IGRhdGEucmVxSWRcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdF9oYW5kbGVBZGRQb3J0KGRhdGEpIHtcblx0XHRcdGlmICghZGF0YS5wb3J0IHx8ICFkYXRhLmNoYW5uZWwpIHJldHVybjtcblx0XHRcdGNvbnN0IGNvbm5lY3Rpb24gPSB7XG5cdFx0XHRcdGlkOiBkYXRhLnJlcUlkID8/IFVVSUR2NCgpLFxuXHRcdFx0XHRjaGFubmVsOiBkYXRhLmNoYW5uZWwsXG5cdFx0XHRcdHNlbmRlcjogZGF0YS5zZW5kZXIgPz8gXCJ1bmtub3duXCIsXG5cdFx0XHRcdHR5cGU6IFwicG9ydFwiLFxuXHRcdFx0XHRwb3J0OiBkYXRhLnBvcnQsXG5cdFx0XHRcdHRpbWVzdGFtcDogRGF0ZS5ub3coKSxcblx0XHRcdFx0b3B0aW9uczogZGF0YS5vcHRpb25zXG5cdFx0XHR9O1xuXHRcdFx0dGhpcy5faW5jb21pbmdDb25uZWN0aW9ucy5uZXh0KGNvbm5lY3Rpb24pO1xuXHRcdFx0aWYgKHRoaXMuX2NvbmZpZy5hdXRvQWNjZXB0Q2hhbm5lbHMpIHRoaXMuYWNjZXB0Q29ubmVjdGlvbihjb25uZWN0aW9uKTtcblx0XHR9XG5cdFx0X2hhbmRsZUxpc3RDaGFubmVscyhkYXRhKSB7XG5cdFx0XHRwb3N0TWVzc2FnZSh7XG5cdFx0XHRcdHR5cGU6IFwiY2hhbm5lbExpc3RcIixcblx0XHRcdFx0Y2hhbm5lbHM6IHRoaXMuZ2V0Q2hhbm5lbE5hbWVzKCksXG5cdFx0XHRcdHJlcUlkOiBkYXRhLnJlcUlkXG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0X2hhbmRsZUNsb3NlQ2hhbm5lbChkYXRhKSB7XG5cdFx0XHRpZiAoZGF0YS5jaGFubmVsKSB7XG5cdFx0XHRcdHRoaXMuY2xvc2VDaGFubmVsKGRhdGEuY2hhbm5lbCk7XG5cdFx0XHRcdHBvc3RNZXNzYWdlKHtcblx0XHRcdFx0XHR0eXBlOiBcImNoYW5uZWxDbG9zZWRcIixcblx0XHRcdFx0XHRjaGFubmVsOiBkYXRhLmNoYW5uZWwsXG5cdFx0XHRcdFx0cmVxSWQ6IGRhdGEucmVxSWRcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdF9jYW5BY2NlcHRDaGFubmVsKGNoYW5uZWwpIHtcblx0XHRcdGlmICh0aGlzLl9jb250ZXh0LnNpemUgPj0gdGhpcy5fY29uZmlnLm1heENoYW5uZWxzKSByZXR1cm4gZmFsc2U7XG5cdFx0XHRpZiAodGhpcy5fY29uZmlnLmFsbG93ZWRDaGFubmVscy5sZW5ndGggPiAwKSByZXR1cm4gdGhpcy5fY29uZmlnLmFsbG93ZWRDaGFubmVscy5pbmNsdWRlcyhjaGFubmVsKTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRfcG9zdENoYW5uZWxDcmVhdGVkKGNoYW5uZWwsIHNlbmRlciwgcmVxSWQpIHtcblx0XHRcdHBvc3RNZXNzYWdlKHtcblx0XHRcdFx0dHlwZTogXCJjaGFubmVsQ3JlYXRlZFwiLFxuXHRcdFx0XHRjaGFubmVsLFxuXHRcdFx0XHRzZW5kZXIsXG5cdFx0XHRcdHJlcUlkLFxuXHRcdFx0XHR0aW1lc3RhbXA6IERhdGUubm93KClcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRjbG9zZSgpIHtcblx0XHRcdHRoaXMuX3N1YnNjcmlwdGlvbnMuZm9yRWFjaCgocykgPT4gcy51bnN1YnNjcmliZSgpKTtcblx0XHRcdHRoaXMuX3N1YnNjcmlwdGlvbnMgPSBbXTtcblx0XHRcdHRoaXMuX2luY29taW5nQ29ubmVjdGlvbnMuY29tcGxldGUoKTtcblx0XHRcdHRoaXMuX2NoYW5uZWxDcmVhdGVkLmNvbXBsZXRlKCk7XG5cdFx0XHR0aGlzLl9jaGFubmVsQ2xvc2VkLmNvbXBsZXRlKCk7XG5cdFx0XHR0aGlzLl9jb250ZXh0LmNsb3NlKCk7XG5cdFx0fVxuXHR9O1xuXHRsZXQgV09SS0VSX0NPTlRFWFQgPSBudWxsO1xuXHQvKipcblx0KiBHZXQgb3IgY3JlYXRlIHRoZSB3b3JrZXIgY29udGV4dCBzaW5nbGV0b25cblx0Ki9cblx0ZnVuY3Rpb24gZ2V0V29ya2VyQ29udGV4dChjb25maWcpIHtcblx0XHRpZiAoIVdPUktFUl9DT05URVhUKSBXT1JLRVJfQ09OVEVYVCA9IG5ldyBXb3JrZXJDb250ZXh0KGNvbmZpZyk7XG5cdFx0cmV0dXJuIFdPUktFUl9DT05URVhUO1xuXHR9XG5cdGNvbnN0IGN0eCA9IGdldFdvcmtlckNvbnRleHQoeyBuYW1lOiBcIndvcmtlclwiIH0pO1xuXG4vLyAuLi91bmlmb3JtLnRzL3NyYy9uZXdlci9uZXh0L3RyYW5zcG9ydC9Qb3J0VHJhbnNwb3J0LnRzXG4vKipcblx0KiBNZXNzYWdlUG9ydC9NZXNzYWdlQ2hhbm5lbCBFbmhhbmNlZCBUcmFuc3BvcnRcblx0KlxuXHQqIEFkdmFuY2VkIHBvcnQtYmFzZWQgY29tbXVuaWNhdGlvbiB3aXRoOlxuXHQqIC0gTWVzc2FnZUNoYW5uZWwgcGFpciBjcmVhdGlvblxuXHQqIC0gUG9ydCBwb29saW5nIGFuZCBtYW5hZ2VtZW50XG5cdCogLSBDcm9zcy1jb250ZXh0IHRyYW5zZmVyIChpZnJhbWUsIHdvcmtlciwgd2luZG93KVxuXHQqIC0gQXV0b21hdGljIHJlY29ubmVjdGlvblxuXHQqIC0gUmVxdWVzdC9yZXNwb25zZSB3aXRoIHRpbWVvdXRcblx0Ki9cblx0dmFyIFBvcnRUcmFuc3BvcnQgPSBjbGFzcyB7XG5cdFx0X2NoYW5uZWxOYW1lO1xuXHRcdF9jb25maWc7XG5cdFx0X3BvcnQ7XG5cdFx0X3N1YnMgPSAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpO1xuXHRcdF9wZW5kaW5nID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0XHRfbGlzdGVuaW5nID0gZmFsc2U7XG5cdFx0X2NsZWFudXAgPSBudWxsO1xuXHRcdF9wb3J0SWQgPSBVVUlEdjQoKTtcblx0XHRfc3RhdGUgPSBuZXcgQ2hhbm5lbFN1YmplY3QoKTtcblx0XHRfa2VlcEFsaXZlVGltZXIgPSBudWxsO1xuXHRcdGNvbnN0cnVjdG9yKHBvcnQsIF9jaGFubmVsTmFtZSwgX2NvbmZpZyA9IHt9KSB7XG5cdFx0XHR0aGlzLl9jaGFubmVsTmFtZSA9IF9jaGFubmVsTmFtZTtcblx0XHRcdHRoaXMuX2NvbmZpZyA9IF9jb25maWc7XG5cdFx0XHR0aGlzLl9wb3J0ID0gcG9ydDtcblx0XHRcdHRoaXMuX3NldHVwUG9ydCgpO1xuXHRcdFx0aWYgKF9jb25maWcuYXV0b1N0YXJ0ICE9PSBmYWxzZSkgdGhpcy5zdGFydCgpO1xuXHRcdH1cblx0XHRfc2V0dXBQb3J0KCkge1xuXHRcdFx0Y29uc3QgbXNnSGFuZGxlciA9IChlKSA9PiB7XG5cdFx0XHRcdGNvbnN0IGRhdGEgPSBlLmRhdGE7XG5cdFx0XHRcdGlmIChkYXRhLnR5cGUgPT09IFwicmVzcG9uc2VcIiAmJiBkYXRhLnJlcUlkKSB7XG5cdFx0XHRcdFx0Y29uc3QgcCA9IHRoaXMuX3BlbmRpbmcuZ2V0KGRhdGEucmVxSWQpO1xuXHRcdFx0XHRcdGlmIChwKSB7XG5cdFx0XHRcdFx0XHR0aGlzLl9wZW5kaW5nLmRlbGV0ZShkYXRhLnJlcUlkKTtcblx0XHRcdFx0XHRcdGlmIChkYXRhLnBheWxvYWQ/LmVycm9yKSBwLnJlamVjdChuZXcgRXJyb3IoZGF0YS5wYXlsb2FkLmVycm9yKSk7XG5cdFx0XHRcdFx0XHRlbHNlIHAucmVzb2x2ZShkYXRhLnBheWxvYWQ/LnJlc3VsdCA/PyBkYXRhLnBheWxvYWQpO1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoZGF0YS50eXBlID09PSBcInNpZ25hbFwiICYmIGRhdGEucGF5bG9hZD8uYWN0aW9uID09PSBcInBpbmdcIikge1xuXHRcdFx0XHRcdHRoaXMuc2VuZCh7XG5cdFx0XHRcdFx0XHRpZDogVVVJRHY0KCksXG5cdFx0XHRcdFx0XHRjaGFubmVsOiB0aGlzLl9jaGFubmVsTmFtZSxcblx0XHRcdFx0XHRcdHNlbmRlcjogdGhpcy5fcG9ydElkLFxuXHRcdFx0XHRcdFx0dHlwZTogXCJzaWduYWxcIixcblx0XHRcdFx0XHRcdHBheWxvYWQ6IHsgYWN0aW9uOiBcInBvbmdcIiB9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGRhdGEucG9ydElkID0gZGF0YS5wb3J0SWQgPz8gdGhpcy5fcG9ydElkO1xuXHRcdFx0XHRmb3IgKGNvbnN0IHMgb2YgdGhpcy5fc3VicykgdHJ5IHtcblx0XHRcdFx0XHRzLm5leHQ/LihkYXRhKTtcblx0XHRcdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0XHRcdHMuZXJyb3I/LihlKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHRcdGNvbnN0IGVyckhhbmRsZXIgPSAoKSA9PiB7XG5cdFx0XHRcdHRoaXMuX3N0YXRlLm5leHQoXCJlcnJvclwiKTtcblx0XHRcdFx0Y29uc3QgZXJyID0gLyogQF9fUFVSRV9fICovIG5ldyBFcnJvcihcIlBvcnQgZXJyb3JcIik7XG5cdFx0XHRcdGZvciAoY29uc3QgcyBvZiB0aGlzLl9zdWJzKSBzLmVycm9yPy4oZXJyKTtcblx0XHRcdH07XG5cdFx0XHR0aGlzLl9wb3J0LmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIG1zZ0hhbmRsZXIpO1xuXHRcdFx0dGhpcy5fcG9ydC5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZWVycm9yXCIsIGVyckhhbmRsZXIpO1xuXHRcdFx0dGhpcy5fY2xlYW51cCA9ICgpID0+IHtcblx0XHRcdFx0dGhpcy5fcG9ydC5yZW1vdmVFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBtc2dIYW5kbGVyKTtcblx0XHRcdFx0dGhpcy5fcG9ydC5yZW1vdmVFdmVudExpc3RlbmVyKFwibWVzc2FnZWVycm9yXCIsIGVyckhhbmRsZXIpO1xuXHRcdFx0fTtcblx0XHR9XG5cdFx0c3RhcnQoKSB7XG5cdFx0XHRpZiAodGhpcy5fbGlzdGVuaW5nKSByZXR1cm47XG5cdFx0XHR0aGlzLl9wb3J0LnN0YXJ0KCk7XG5cdFx0XHR0aGlzLl9saXN0ZW5pbmcgPSB0cnVlO1xuXHRcdFx0dGhpcy5fc3RhdGUubmV4dChcInJlYWR5XCIpO1xuXHRcdFx0aWYgKHRoaXMuX2NvbmZpZy5rZWVwQWxpdmUpIHRoaXMuX3N0YXJ0S2VlcEFsaXZlKCk7XG5cdFx0fVxuXHRcdHNlbmQobXNnLCB0cmFuc2Zlcikge1xuXHRcdFx0Y29uc3QgeyB0cmFuc2ZlcmFibGUsIC4uLmRhdGEgfSA9IG1zZztcblx0XHRcdHRoaXMuX3BvcnQucG9zdE1lc3NhZ2Uoe1xuXHRcdFx0XHQuLi5kYXRhLFxuXHRcdFx0XHRwb3J0SWQ6IHRoaXMuX3BvcnRJZFxuXHRcdFx0fSwgdHJhbnNmZXIgPz8gW10pO1xuXHRcdH1cblx0XHRyZXF1ZXN0KG1zZykge1xuXHRcdFx0Y29uc3QgcmVxSWQgPSBtc2cucmVxSWQgPz8gVVVJRHY0KCk7XG5cdFx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0XHRjb25zdCB0aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdFx0dGhpcy5fcGVuZGluZy5kZWxldGUocmVxSWQpO1xuXHRcdFx0XHRcdHJlamVjdCgvKiBAX19QVVJFX18gKi8gbmV3IEVycm9yKFwiUmVxdWVzdCB0aW1lb3V0XCIpKTtcblx0XHRcdFx0fSwgdGhpcy5fY29uZmlnLnRpbWVvdXQgPz8gM2U0KTtcblx0XHRcdFx0dGhpcy5fcGVuZGluZy5zZXQocmVxSWQsIHtcblx0XHRcdFx0XHRyZXNvbHZlOiAodikgPT4ge1xuXHRcdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuXHRcdFx0XHRcdFx0cmVzb2x2ZSh2KTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHJlamVjdDogKGUpID0+IHtcblx0XHRcdFx0XHRcdGNsZWFyVGltZW91dCh0aW1lb3V0KTtcblx0XHRcdFx0XHRcdHJlamVjdChlKTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHRpbWVzdGFtcDogRGF0ZS5ub3coKVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0dGhpcy5zZW5kKHtcblx0XHRcdFx0XHQuLi5tc2csXG5cdFx0XHRcdFx0cmVxSWQsXG5cdFx0XHRcdFx0dHlwZTogXCJyZXF1ZXN0XCJcblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0c3Vic2NyaWJlKG9ic2VydmVyKSB7XG5cdFx0XHRjb25zdCBvYnMgPSB0eXBlb2Ygb2JzZXJ2ZXIgPT09IFwiZnVuY3Rpb25cIiA/IHsgbmV4dDogb2JzZXJ2ZXIgfSA6IG9ic2VydmVyO1xuXHRcdFx0dGhpcy5fc3Vicy5hZGQob2JzKTtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGNsb3NlZDogZmFsc2UsXG5cdFx0XHRcdHVuc3Vic2NyaWJlOiAoKSA9PiB7XG5cdFx0XHRcdFx0dGhpcy5fc3Vicy5kZWxldGUob2JzKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9XG5cdFx0X3N0YXJ0S2VlcEFsaXZlKCkge1xuXHRcdFx0dGhpcy5fa2VlcEFsaXZlVGltZXIgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG5cdFx0XHRcdHRoaXMuc2VuZCh7XG5cdFx0XHRcdFx0aWQ6IFVVSUR2NCgpLFxuXHRcdFx0XHRcdGNoYW5uZWw6IHRoaXMuX2NoYW5uZWxOYW1lLFxuXHRcdFx0XHRcdHNlbmRlcjogdGhpcy5fcG9ydElkLFxuXHRcdFx0XHRcdHR5cGU6IFwic2lnbmFsXCIsXG5cdFx0XHRcdFx0cGF5bG9hZDogeyBhY3Rpb246IFwicGluZ1wiIH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9LCB0aGlzLl9jb25maWcua2VlcEFsaXZlSW50ZXJ2YWwgPz8gM2U0KTtcblx0XHR9XG5cdFx0Y2xvc2UoKSB7XG5cdFx0XHRpZiAodGhpcy5fa2VlcEFsaXZlVGltZXIpIHtcblx0XHRcdFx0Y2xlYXJJbnRlcnZhbCh0aGlzLl9rZWVwQWxpdmVUaW1lcik7XG5cdFx0XHRcdHRoaXMuX2tlZXBBbGl2ZVRpbWVyID0gbnVsbDtcblx0XHRcdH1cblx0XHRcdHRoaXMuX2NsZWFudXA/LigpO1xuXHRcdFx0dGhpcy5fc3Vicy5mb3JFYWNoKChzKSA9PiBzLmNvbXBsZXRlPy4oKSk7XG5cdFx0XHR0aGlzLl9zdWJzLmNsZWFyKCk7XG5cdFx0XHR0aGlzLl9wb3J0LmNsb3NlKCk7XG5cdFx0XHR0aGlzLl9zdGF0ZS5uZXh0KFwiY2xvc2VkXCIpO1xuXHRcdH1cblx0XHRnZXQgcG9ydCgpIHtcblx0XHRcdHJldHVybiB0aGlzLl9wb3J0O1xuXHRcdH1cblx0XHRnZXQgcG9ydElkKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX3BvcnRJZDtcblx0XHR9XG5cdFx0Z2V0IGlzTGlzdGVuaW5nKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2xpc3RlbmluZztcblx0XHR9XG5cdFx0Z2V0IHN0YXRlKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX3N0YXRlO1xuXHRcdH1cblx0XHRnZXQgY2hhbm5lbE5hbWUoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY2hhbm5lbE5hbWU7XG5cdFx0fVxuXHR9O1xuXHQvKipcblx0KiBDcmVhdGUgYSBNZXNzYWdlQ2hhbm5lbCBwYWlyIHdpdGggY29uZmlndXJlZCBsb2NhbCB0cmFuc3BvcnRcblx0Ki9cblx0ZnVuY3Rpb24gY3JlYXRlQ2hhbm5lbFBhaXIoY2hhbm5lbE5hbWUsIGNvbmZpZykge1xuXHRcdGNvbnN0IGNoYW5uZWwgPSBuZXcgTWVzc2FnZUNoYW5uZWwoKTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0bG9jYWw6IG5ldyBQb3J0VHJhbnNwb3J0KGNoYW5uZWwucG9ydDEsIGNoYW5uZWxOYW1lLCBjb25maWcpLFxuXHRcdFx0cmVtb3RlOiBjaGFubmVsLnBvcnQyLFxuXHRcdFx0dHJhbnNmZXI6ICgpID0+IHtcblx0XHRcdFx0cmV0dXJuIGNoYW5uZWwucG9ydDI7XG5cdFx0XHR9XG5cdFx0fTtcblx0fVxuXHR2YXIgUG9ydFBvb2wgPSBjbGFzcyB7XG5cdFx0X2RlZmF1bHRDb25maWc7XG5cdFx0X2NoYW5uZWxzID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0XHRfbWFpblBvcnQgPSBudWxsO1xuXHRcdF9zdWJzID0gLyogQF9fUFVSRV9fICovIG5ldyBTZXQoKTtcblx0XHRjb25zdHJ1Y3RvcihfZGVmYXVsdENvbmZpZyA9IHt9KSB7XG5cdFx0XHR0aGlzLl9kZWZhdWx0Q29uZmlnID0gX2RlZmF1bHRDb25maWc7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogQ3JlYXRlIG5ldyBjaGFubmVsIGluIHBvb2xcblx0XHQqL1xuXHRcdGNyZWF0ZShjaGFubmVsTmFtZSwgY29uZmlnKSB7XG5cdFx0XHRjb25zdCByZXN1bHQgPSBjcmVhdGVDaGFubmVsUGFpcihjaGFubmVsTmFtZSwge1xuXHRcdFx0XHQuLi50aGlzLl9kZWZhdWx0Q29uZmlnLFxuXHRcdFx0XHQuLi5jb25maWdcblx0XHRcdH0pO1xuXHRcdFx0cmVzdWx0LmxvY2FsLnN1YnNjcmliZSh7IG5leHQ6IChtc2cpID0+IHtcblx0XHRcdFx0Zm9yIChjb25zdCBzIG9mIHRoaXMuX3N1YnMpIHRyeSB7XG5cdFx0XHRcdFx0cy5uZXh0Py4obXNnKTtcblx0XHRcdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0XHRcdHMuZXJyb3I/LihlKTtcblx0XHRcdFx0fVxuXHRcdFx0fSB9KTtcblx0XHRcdHRoaXMuX2NoYW5uZWxzLnNldChjaGFubmVsTmFtZSwgcmVzdWx0LmxvY2FsKTtcblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogQWRkIGV4aXN0aW5nIHBvcnQgdG8gcG9vbFxuXHRcdCovXG5cdFx0YWRkKGNoYW5uZWxOYW1lLCBwb3J0LCBjb25maWcpIHtcblx0XHRcdGNvbnN0IHRyYW5zcG9ydCA9IG5ldyBQb3J0VHJhbnNwb3J0KHBvcnQsIGNoYW5uZWxOYW1lLCB7XG5cdFx0XHRcdC4uLnRoaXMuX2RlZmF1bHRDb25maWcsXG5cdFx0XHRcdC4uLmNvbmZpZ1xuXHRcdFx0fSk7XG5cdFx0XHR0cmFuc3BvcnQuc3Vic2NyaWJlKHsgbmV4dDogKG1zZykgPT4ge1xuXHRcdFx0XHRmb3IgKGNvbnN0IHMgb2YgdGhpcy5fc3VicykgdHJ5IHtcblx0XHRcdFx0XHRzLm5leHQ/Lihtc2cpO1xuXHRcdFx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRcdFx0cy5lcnJvcj8uKGUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IH0pO1xuXHRcdFx0dGhpcy5fY2hhbm5lbHMuc2V0KGNoYW5uZWxOYW1lLCB0cmFuc3BvcnQpO1xuXHRcdFx0cmV0dXJuIHRyYW5zcG9ydDtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBHZXQgY2hhbm5lbCBieSBuYW1lXG5cdFx0Ki9cblx0XHRnZXQoY2hhbm5lbE5hbWUpIHtcblx0XHRcdHJldHVybiB0aGlzLl9jaGFubmVscy5nZXQoY2hhbm5lbE5hbWUpO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIFNlbmQgdG8gc3BlY2lmaWMgY2hhbm5lbFxuXHRcdCovXG5cdFx0c2VuZChjaGFubmVsTmFtZSwgbXNnLCB0cmFuc2Zlcikge1xuXHRcdFx0dGhpcy5fY2hhbm5lbHMuZ2V0KGNoYW5uZWxOYW1lKT8uc2VuZChtc2csIHRyYW5zZmVyKTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBCcm9hZGNhc3QgdG8gYWxsIGNoYW5uZWxzXG5cdFx0Ki9cblx0XHRicm9hZGNhc3QobXNnLCB0cmFuc2Zlcikge1xuXHRcdFx0Zm9yIChjb25zdCB0cmFuc3BvcnQgb2YgdGhpcy5fY2hhbm5lbHMudmFsdWVzKCkpIHRyYW5zcG9ydC5zZW5kKG1zZywgdHJhbnNmZXIpO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIFJlcXVlc3Qgb24gc3BlY2lmaWMgY2hhbm5lbFxuXHRcdCovXG5cdFx0cmVxdWVzdChjaGFubmVsTmFtZSwgbXNnKSB7XG5cdFx0XHRjb25zdCBjaGFubmVsID0gdGhpcy5fY2hhbm5lbHMuZ2V0KGNoYW5uZWxOYW1lKTtcblx0XHRcdGlmICghY2hhbm5lbCkgcmV0dXJuIFByb21pc2UucmVqZWN0KC8qIEBfX1BVUkVfXyAqLyBuZXcgRXJyb3IoYENoYW5uZWwgJHtjaGFubmVsTmFtZX0gbm90IGZvdW5kYCkpO1xuXHRcdFx0cmV0dXJuIGNoYW5uZWwucmVxdWVzdChtc2cpO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIFN1YnNjcmliZSB0byBhbGwgY2hhbm5lbHNcblx0XHQqL1xuXHRcdHN1YnNjcmliZShvYnNlcnZlcikge1xuXHRcdFx0Y29uc3Qgb2JzID0gdHlwZW9mIG9ic2VydmVyID09PSBcImZ1bmN0aW9uXCIgPyB7IG5leHQ6IG9ic2VydmVyIH0gOiBvYnNlcnZlcjtcblx0XHRcdHRoaXMuX3N1YnMuYWRkKG9icyk7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRjbG9zZWQ6IGZhbHNlLFxuXHRcdFx0XHR1bnN1YnNjcmliZTogKCkgPT4ge1xuXHRcdFx0XHRcdHRoaXMuX3N1YnMuZGVsZXRlKG9icyk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogUmVtb3ZlIGNoYW5uZWxcblx0XHQqL1xuXHRcdHJlbW92ZShjaGFubmVsTmFtZSkge1xuXHRcdFx0Y29uc3QgY2hhbm5lbCA9IHRoaXMuX2NoYW5uZWxzLmdldChjaGFubmVsTmFtZSk7XG5cdFx0XHRpZiAoY2hhbm5lbCkge1xuXHRcdFx0XHRjaGFubmVsLmNsb3NlKCk7XG5cdFx0XHRcdHRoaXMuX2NoYW5uZWxzLmRlbGV0ZShjaGFubmVsTmFtZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogQ2xvc2UgYWxsIGNoYW5uZWxzXG5cdFx0Ki9cblx0XHRjbG9zZSgpIHtcblx0XHRcdHRoaXMuX3N1YnMuZm9yRWFjaCgocykgPT4gcy5jb21wbGV0ZT8uKCkpO1xuXHRcdFx0dGhpcy5fc3Vicy5jbGVhcigpO1xuXHRcdFx0Zm9yIChjb25zdCBjaGFubmVsIG9mIHRoaXMuX2NoYW5uZWxzLnZhbHVlcygpKSBjaGFubmVsLmNsb3NlKCk7XG5cdFx0XHR0aGlzLl9jaGFubmVscy5jbGVhcigpO1xuXHRcdH1cblx0XHRnZXQgY2hhbm5lbE5hbWVzKCkge1xuXHRcdFx0cmV0dXJuIEFycmF5LmZyb20odGhpcy5fY2hhbm5lbHMua2V5cygpKTtcblx0XHR9XG5cdFx0Z2V0IHNpemUoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY2hhbm5lbHMuc2l6ZTtcblx0XHR9XG5cdH07XG5cdC8qKlxuXHQqIENvbm5lY3QgdG8gd2luZG93L2lmcmFtZSB2aWEgTWVzc2FnZUNoYW5uZWxcblx0Ki9cblx0dmFyIFdpbmRvd1BvcnRDb25uZWN0b3IgPSBjbGFzcyB7XG5cdFx0X3RhcmdldDtcblx0XHRfY2hhbm5lbE5hbWU7XG5cdFx0X2NvbmZpZztcblx0XHRfdHJhbnNwb3J0ID0gbnVsbDtcblx0XHRfc3RhdGUgPSBuZXcgQ2hhbm5lbFN1YmplY3QoKTtcblx0XHRfaGFuZHNoYWtlQ29tcGxldGUgPSBmYWxzZTtcblx0XHRjb25zdHJ1Y3RvcihfdGFyZ2V0LCBfY2hhbm5lbE5hbWUsIF9jb25maWcgPSB7fSkge1xuXHRcdFx0dGhpcy5fdGFyZ2V0ID0gX3RhcmdldDtcblx0XHRcdHRoaXMuX2NoYW5uZWxOYW1lID0gX2NoYW5uZWxOYW1lO1xuXHRcdFx0dGhpcy5fY29uZmlnID0gX2NvbmZpZztcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBJbml0aWF0ZSBjb25uZWN0aW9uIHRvIHRhcmdldCB3aW5kb3dcblx0XHQqL1xuXHRcdGFzeW5jIGNvbm5lY3QoKSB7XG5cdFx0XHRpZiAodGhpcy5fdHJhbnNwb3J0ICYmIHRoaXMuX2hhbmRzaGFrZUNvbXBsZXRlKSByZXR1cm4gdGhpcy5fdHJhbnNwb3J0O1xuXHRcdFx0dGhpcy5fc3RhdGUubmV4dChcImNvbm5lY3RpbmdcIik7XG5cdFx0XHRjb25zdCB7IGxvY2FsLCByZW1vdGUgfSA9IGNyZWF0ZUNoYW5uZWxQYWlyKHRoaXMuX2NoYW5uZWxOYW1lLCB0aGlzLl9jb25maWcpO1xuXHRcdFx0dGhpcy5fdGFyZ2V0LnBvc3RNZXNzYWdlKHtcblx0XHRcdFx0dHlwZTogXCJwb3J0LWNvbm5lY3RcIixcblx0XHRcdFx0Y2hhbm5lbE5hbWU6IHRoaXMuX2NoYW5uZWxOYW1lLFxuXHRcdFx0XHRwb3J0SWQ6IGxvY2FsLnBvcnRJZFxuXHRcdFx0fSwgdGhpcy5fY29uZmlnLnRhcmdldE9yaWdpbiA/PyBcIipcIiwgW3JlbW90ZV0pO1xuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdFx0Y29uc3QgdGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRcdHJlamVjdCgvKiBAX19QVVJFX18gKi8gbmV3IEVycm9yKFwiSGFuZHNoYWtlIHRpbWVvdXRcIikpO1xuXHRcdFx0XHRcdHRoaXMuX3N0YXRlLm5leHQoXCJlcnJvclwiKTtcblx0XHRcdFx0fSwgdGhpcy5fY29uZmlnLmhhbmRzaGFrZVRpbWVvdXQgPz8gMWU0KTtcblx0XHRcdFx0Y29uc3Qgc3ViID0gbG9jYWwuc3Vic2NyaWJlKHsgbmV4dDogKG1zZykgPT4ge1xuXHRcdFx0XHRcdGlmIChtc2cudHlwZSA9PT0gXCJzaWduYWxcIiAmJiBtc2cucGF5bG9hZD8uYWN0aW9uID09PSBcImhhbmRzaGFrZS1hY2tcIikge1xuXHRcdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuXHRcdFx0XHRcdFx0dGhpcy5faGFuZHNoYWtlQ29tcGxldGUgPSB0cnVlO1xuXHRcdFx0XHRcdFx0dGhpcy5fdHJhbnNwb3J0ID0gbG9jYWw7XG5cdFx0XHRcdFx0XHR0aGlzLl9zdGF0ZS5uZXh0KFwiY29ubmVjdGVkXCIpO1xuXHRcdFx0XHRcdFx0c3ViLnVuc3Vic2NyaWJlKCk7XG5cdFx0XHRcdFx0XHRyZXNvbHZlKGxvY2FsKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gfSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBMaXN0ZW4gZm9yIGluY29taW5nIGNvbm5lY3Rpb25zICh0YXJnZXQgc2lkZSlcblx0XHQqL1xuXHRcdHN0YXRpYyBsaXN0ZW4oY2hhbm5lbE5hbWUsIGhhbmRsZXIsIGNvbmZpZykge1xuXHRcdFx0Y29uc3QgbXNnSGFuZGxlciA9IChlKSA9PiB7XG5cdFx0XHRcdGlmIChlLmRhdGE/LnR5cGUgIT09IFwicG9ydC1jb25uZWN0XCIgfHwgZS5kYXRhPy5jaGFubmVsTmFtZSAhPT0gY2hhbm5lbE5hbWUpIHJldHVybjtcblx0XHRcdFx0aWYgKCFlLnBvcnRzWzBdKSByZXR1cm47XG5cdFx0XHRcdGNvbnN0IHRyYW5zcG9ydCA9IG5ldyBQb3J0VHJhbnNwb3J0KGUucG9ydHNbMF0sIGNoYW5uZWxOYW1lLCBjb25maWcpO1xuXHRcdFx0XHR0cmFuc3BvcnQuc2VuZCh7XG5cdFx0XHRcdFx0aWQ6IFVVSUR2NCgpLFxuXHRcdFx0XHRcdGNoYW5uZWw6IGNoYW5uZWxOYW1lLFxuXHRcdFx0XHRcdHNlbmRlcjogdHJhbnNwb3J0LnBvcnRJZCxcblx0XHRcdFx0XHR0eXBlOiBcInNpZ25hbFwiLFxuXHRcdFx0XHRcdHBheWxvYWQ6IHsgYWN0aW9uOiBcImhhbmRzaGFrZS1hY2tcIiB9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRoYW5kbGVyKHRyYW5zcG9ydCk7XG5cdFx0XHR9O1xuXHRcdFx0Z2xvYmFsVGhpcy5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBtc2dIYW5kbGVyKTtcblx0XHRcdHJldHVybiAoKSA9PiBnbG9iYWxUaGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIG1zZ0hhbmRsZXIpO1xuXHRcdH1cblx0XHRkaXNjb25uZWN0KCkge1xuXHRcdFx0dGhpcy5fdHJhbnNwb3J0Py5jbG9zZSgpO1xuXHRcdFx0dGhpcy5fdHJhbnNwb3J0ID0gbnVsbDtcblx0XHRcdHRoaXMuX2hhbmRzaGFrZUNvbXBsZXRlID0gZmFsc2U7XG5cdFx0XHR0aGlzLl9zdGF0ZS5uZXh0KFwiZGlzY29ubmVjdGVkXCIpO1xuXHRcdH1cblx0XHRnZXQgaXNDb25uZWN0ZWQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5faGFuZHNoYWtlQ29tcGxldGU7XG5cdFx0fVxuXHRcdGdldCBzdGF0ZSgpIHtcblx0XHRcdHJldHVybiB0aGlzLl9zdGF0ZTtcblx0XHR9XG5cdFx0Z2V0IHRyYW5zcG9ydCgpIHtcblx0XHRcdHJldHVybiB0aGlzLl90cmFuc3BvcnQ7XG5cdFx0fVxuXHR9O1xuXHQvKipcblx0KiBDcmVhdGUgcHJveHkgZm9yIHJlbW90ZSBvYmplY3Qgb3ZlciBQb3J0VHJhbnNwb3J0XG5cdCpcblx0KiBVc2VzIHVuaWZpZWQgUHJveHkgbW9kdWxlIGZvciBjb25zaXN0ZW50IGJlaGF2aW9yLlxuXHQqL1xuXHRmdW5jdGlvbiBjcmVhdGVQb3J0UHJveHkodHJhbnNwb3J0LCB0YXJnZXRQYXRoID0gW10pIHtcblx0XHRyZXR1cm4gY3JlYXRlU2VuZGVyUHJveHkoe1xuXHRcdFx0cmVxdWVzdDogKG1zZykgPT4gdHJhbnNwb3J0LnJlcXVlc3QobXNnKSxcblx0XHRcdGNoYW5uZWxOYW1lOiB0cmFuc3BvcnQuY2hhbm5lbE5hbWUsXG5cdFx0XHRzZW5kZXJJZDogdHJhbnNwb3J0LnBvcnRJZFxuXHRcdH0sIHRhcmdldFBhdGgpO1xuXHR9XG5cdC8qKlxuXHQqIEV4cG9zZSBvYmplY3QgbWV0aG9kcyBvdmVyIFBvcnRUcmFuc3BvcnRcblx0KlxuXHQqIFVzZXMgdW5pZmllZCBQcm94eSBtb2R1bGUncyBleHBvc2UgaGFuZGxlci5cblx0Ki9cblx0ZnVuY3Rpb24gZXhwb3NlT3ZlclBvcnQodHJhbnNwb3J0LCB0YXJnZXQpIHtcblx0XHRjb25zdCBoYW5kbGVyID0gY3JlYXRlRXhwb3NlSGFuZGxlcih0YXJnZXQpO1xuXHRcdHJldHVybiB0cmFuc3BvcnQuc3Vic2NyaWJlKHsgbmV4dDogYXN5bmMgKG1zZykgPT4ge1xuXHRcdFx0aWYgKG1zZy50eXBlICE9PSBcInJlcXVlc3RcIiB8fCAhbXNnLnBheWxvYWQ/LnBhdGgpIHJldHVybjtcblx0XHRcdGNvbnN0IHsgYWN0aW9uLCBwYXRoLCBhcmdzIH0gPSBtc2cucGF5bG9hZDtcblx0XHRcdGxldCByZXN1bHQ7XG5cdFx0XHRsZXQgZXJyb3I7XG5cdFx0XHR0cnkge1xuXHRcdFx0XHRyZXN1bHQgPSBhd2FpdCBoYW5kbGVyKGFjdGlvbiwgcGF0aCwgYXJncyA/PyBbXSk7XG5cdFx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRcdGVycm9yID0gZSBpbnN0YW5jZW9mIEVycm9yID8gZS5tZXNzYWdlIDogU3RyaW5nKGUpO1xuXHRcdFx0fVxuXHRcdFx0dHJhbnNwb3J0LnNlbmQoe1xuXHRcdFx0XHRpZDogVVVJRHY0KCksXG5cdFx0XHRcdGNoYW5uZWw6IG1zZy5zZW5kZXIsXG5cdFx0XHRcdHNlbmRlcjogdHJhbnNwb3J0LnBvcnRJZCxcblx0XHRcdFx0dHlwZTogXCJyZXNwb25zZVwiLFxuXHRcdFx0XHRyZXFJZDogbXNnLnJlcUlkLFxuXHRcdFx0XHRwYXlsb2FkOiBlcnJvciA/IHsgZXJyb3IgfSA6IHsgcmVzdWx0IH1cblx0XHRcdH0pO1xuXHRcdH0gfSk7XG5cdH1cblx0Y29uc3QgUG9ydFRyYW5zcG9ydEZhY3RvcnkgPSB7XG5cdFx0Y3JlYXRlOiAocG9ydCwgbmFtZSwgY29uZmlnKSA9PiBuZXcgUG9ydFRyYW5zcG9ydChwb3J0LCBuYW1lLCBjb25maWcpLFxuXHRcdGNyZWF0ZVBhaXI6IChuYW1lLCBjb25maWcpID0+IGNyZWF0ZUNoYW5uZWxQYWlyKG5hbWUsIGNvbmZpZyksXG5cdFx0Y3JlYXRlUG9vbDogKGNvbmZpZykgPT4gbmV3IFBvcnRQb29sKGNvbmZpZyksXG5cdFx0Y3JlYXRlV2luZG93Q29ubmVjdG9yOiAodGFyZ2V0LCBuYW1lLCBjb25maWcpID0+IG5ldyBXaW5kb3dQb3J0Q29ubmVjdG9yKHRhcmdldCwgbmFtZSwgY29uZmlnKSxcblx0XHRsaXN0ZW46IFdpbmRvd1BvcnRDb25uZWN0b3IubGlzdGVuLFxuXHRcdGNyZWF0ZVByb3h5OiBjcmVhdGVQb3J0UHJveHksXG5cdFx0ZXhwb3NlOiBleHBvc2VPdmVyUG9ydFxuXHR9O1xuXG4vLyAuLi91bmlmb3JtLnRzL3NyYy9uZXdlci9uZXh0L3N0b3JhZ2UvUXVldWVkLnRzXG4vKipcblx0KiBTaW1wbGlmaWVkIHdvcmtlciByZWdpc3RyYXRpb24gZm9yIGNvbW1vbiBwYXR0ZXJuc1xuXHQqL1xuXHRjb25zdCByZWdpc3RlcldvcmtlckFQSSA9IChhcGksIGNoYW5uZWxOYW1lID0gXCJ3b3JrZXJcIikgPT4ge1xuXHRcdGNvbnN0IGNoYW5uZWxIYW5kbGVyID0gaW5pdENoYW5uZWxIYW5kbGVyKGNoYW5uZWxOYW1lID8/IFwid29ya2VyXCIpO1xuXHRcdE9iamVjdC5rZXlzKGFwaSkuZm9yRWFjaCgobWV0aG9kTmFtZSkgPT4ge1xuXHRcdFx0aWYgKHR5cGVvZiBhcGlbbWV0aG9kTmFtZV0gPT09IFwiZnVuY3Rpb25cIikge31cblx0XHR9KTtcblx0XHRyZXR1cm4gY2hhbm5lbEhhbmRsZXI7XG5cdH07XG5cbi8vIHNyYy91dGlscy9vcGZzL09QRlMud29ya2VyLnRzXG5cdHZhciBPUEZTX3dvcmtlcl9leHBvcnRzID0gLyogQF9fUFVSRV9fICovIF9fZXhwb3J0QWxsKHtcblx0XHRnZXREaXJIYW5kbGU6ICgpID0+IGdldERpckhhbmRsZSxcblx0XHRnZXRGaWxlU3lzdGVtUm9vdDogKCkgPT4gZ2V0RmlsZVN5c3RlbVJvb3QsXG5cdFx0aGFuZGxlcnM6ICgpID0+IGhhbmRsZXJzLFxuXHRcdG5vcm1hbGl6ZVBhdGg6ICgpID0+IG5vcm1hbGl6ZVBhdGgsXG5cdFx0cmVzb2x2ZUZpbGVTeXN0ZW1IYW5kbGU6ICgpID0+IHJlc29sdmVGaWxlU3lzdGVtSGFuZGxlXG5cdH0pO1xuXHR2YXIgbWFwcGVkUm9vdHMsIGFjdGl2ZU9ic2VydmVycywgZ2V0RmlsZVN5c3RlbVJvb3QsIG5vcm1hbGl6ZVBhdGgsIHJlc29sdmVGaWxlU3lzdGVtSGFuZGxlLCBnZXREaXJIYW5kbGUsIGhhbmRsZXJzLCBTV19CUklER0VfQ0hBTk5FTF9OQU1FLCBzd0JyaWRnZUNoYW5uZWw7XG5cdHZhciBpbml0X09QRlNfd29ya2VyID0gX19lc21NaW4oKCgpID0+IHtcblx0XHRtYXBwZWRSb290cyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG5cdFx0YWN0aXZlT2JzZXJ2ZXJzID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0XHRnZXRGaWxlU3lzdGVtUm9vdCA9IGFzeW5jIChpZCA9IFwiXCIpID0+IHtcblx0XHRcdGlmIChpZCAmJiBtYXBwZWRSb290cy5oYXMoaWQpKSByZXR1cm4gbWFwcGVkUm9vdHMuZ2V0KGlkKTtcblx0XHRcdHJldHVybiBhd2FpdCBuYXZpZ2F0b3Iuc3RvcmFnZS5nZXREaXJlY3RvcnkoKTtcblx0XHR9O1xuXHRcdG5vcm1hbGl6ZVBhdGggPSAocGF0aCkgPT4ge1xuXHRcdFx0cmV0dXJuIHBhdGg/LnRyaW0/LigpPy5yZXBsYWNlKC9cXC8rL2csIFwiL1wiKSB8fCBcIi9cIjtcblx0XHR9O1xuXHRcdHJlc29sdmVGaWxlU3lzdGVtSGFuZGxlID0gYXN5bmMgKHJvb3QsIHBhdGgsIGNyZWF0ZSA9IGZhbHNlKSA9PiB7XG5cdFx0XHRjb25zdCBwYXJ0cyA9IG5vcm1hbGl6ZVBhdGgocGF0aCkuc3BsaXQoXCIvXCIpLmZpbHRlcigocCkgPT4gcCAmJiBwICE9PSBcIi5cIik7XG5cdFx0XHRsZXQgY3VycmVudCA9IHJvb3Q7XG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHBhcnRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGNvbnN0IHBhcnQgPSBwYXJ0c1tpXTtcblx0XHRcdFx0aWYgKGkgPT09IHBhcnRzLmxlbmd0aCAtIDEpIHRyeSB7XG5cdFx0XHRcdFx0cmV0dXJuIGF3YWl0IGN1cnJlbnQuZ2V0RGlyZWN0b3J5SGFuZGxlKHBhcnQsIHsgY3JlYXRlIH0pO1xuXHRcdFx0XHR9IGNhdGNoIHtcblx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGF3YWl0IGN1cnJlbnQuZ2V0RmlsZUhhbmRsZShwYXJ0LCB7IGNyZWF0ZSB9KTtcblx0XHRcdFx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRcdFx0XHRpZiAoY3JlYXRlKSB0aHJvdyBlO1xuXHRcdFx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgY3VycmVudCA9IGF3YWl0IGN1cnJlbnQuZ2V0RGlyZWN0b3J5SGFuZGxlKHBhcnQsIHsgY3JlYXRlIH0pO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGN1cnJlbnQ7XG5cdFx0fTtcblx0XHRnZXREaXJIYW5kbGUgPSBhc3luYyAocm9vdCwgcGF0aCwgY3JlYXRlKSA9PiB7XG5cdFx0XHRjb25zdCBwYXJ0cyA9IG5vcm1hbGl6ZVBhdGgocGF0aCkuc3BsaXQoXCIvXCIpLmZpbHRlcigocCkgPT4gcCk7XG5cdFx0XHRsZXQgY3VycmVudCA9IHJvb3Q7XG5cdFx0XHRmb3IgKGNvbnN0IHBhcnQgb2YgcGFydHMpIGN1cnJlbnQgPSBhd2FpdCBjdXJyZW50LmdldERpcmVjdG9yeUhhbmRsZShwYXJ0LCB7IGNyZWF0ZSB9KTtcblx0XHRcdHJldHVybiBjdXJyZW50O1xuXHRcdH07XG5cdFx0aGFuZGxlcnMgPSB7XG5cdFx0XHRtb3VudDogYXN5bmMgKHsgaWQsIGhhbmRsZSB9KSA9PiB7XG5cdFx0XHRcdG1hcHBlZFJvb3RzLnNldChpZCwgaGFuZGxlKTtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9LFxuXHRcdFx0dW5tb3VudDogYXN5bmMgKHsgaWQgfSkgPT4ge1xuXHRcdFx0XHRtYXBwZWRSb290cy5kZWxldGUoaWQpO1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH0sXG5cdFx0XHRyZWFkRGlyZWN0b3J5OiBhc3luYyAoeyByb290SWQsIHBhdGgsIGNyZWF0ZSB9KSA9PiB7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0Y29uc3Qgcm9vdCA9IGF3YWl0IGdldEZpbGVTeXN0ZW1Sb290KHJvb3RJZCk7XG5cdFx0XHRcdFx0Y29uc3QgaGFuZGxlID0gYXdhaXQgZ2V0RGlySGFuZGxlKHJvb3QsIHBhdGgsIGNyZWF0ZSk7XG5cdFx0XHRcdFx0Y29uc3QgZW50cmllcyA9IFtdO1xuXHRcdFx0XHRcdGZvciBhd2FpdCAoY29uc3QgW25hbWUsIGVudHJ5XSBvZiBoYW5kbGUuZW50cmllcygpKSBlbnRyaWVzLnB1c2goW25hbWUsIGVudHJ5XSk7XG5cdFx0XHRcdFx0cmV0dXJuIGVudHJpZXM7XG5cdFx0XHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdFx0XHRjb25zb2xlLndhcm4oXCJXb3JrZXIgcmVhZERpcmVjdG9yeSBlcnJvcjpcIiwgZSk7XG5cdFx0XHRcdFx0cmV0dXJuIFtdO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0cmVhZEZpbGU6IGFzeW5jICh7IHJvb3RJZCwgcGF0aCwgdHlwZSB9KSA9PiB7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0Y29uc3Qgcm9vdCA9IGF3YWl0IGdldEZpbGVTeXN0ZW1Sb290KHJvb3RJZCk7XG5cdFx0XHRcdFx0Y29uc3QgcGFydHMgPSBub3JtYWxpemVQYXRoKHBhdGgpLnNwbGl0KFwiL1wiKS5maWx0ZXIoKHApID0+IHApO1xuXHRcdFx0XHRcdGNvbnN0IGZpbGVuYW1lID0gcGFydHMucG9wKCk7XG5cdFx0XHRcdFx0Y29uc3QgZGlyUGF0aCA9IHBhcnRzLmpvaW4oXCIvXCIpO1xuXHRcdFx0XHRcdGNvbnN0IGZpbGUgPSBhd2FpdCAoYXdhaXQgKGF3YWl0IGdldERpckhhbmRsZShyb290LCBkaXJQYXRoLCBmYWxzZSkpLmdldEZpbGVIYW5kbGUoZmlsZW5hbWUsIHsgY3JlYXRlOiBmYWxzZSB9KSkuZ2V0RmlsZSgpO1xuXHRcdFx0XHRcdGlmICh0eXBlID09PSBcInRleHRcIikgcmV0dXJuIGF3YWl0IGZpbGUudGV4dCgpO1xuXHRcdFx0XHRcdGlmICh0eXBlID09PSBcImFycmF5QnVmZmVyXCIpIHJldHVybiBhd2FpdCBmaWxlLmFycmF5QnVmZmVyKCk7XG5cdFx0XHRcdFx0aWYgKHR5cGUgPT09IFwiYmxvYlwiKSByZXR1cm4gZmlsZTtcblx0XHRcdFx0XHRyZXR1cm4gZmlsZTtcblx0XHRcdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0XHRcdGNvbnNvbGUud2FybihcIldvcmtlciByZWFkRmlsZSBlcnJvcjpcIiwgZSk7XG5cdFx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHR3cml0ZUZpbGU6IGFzeW5jICh7IHJvb3RJZCwgcGF0aCwgZGF0YSB9KSA9PiB7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0Y29uc3Qgcm9vdCA9IGF3YWl0IGdldEZpbGVTeXN0ZW1Sb290KHJvb3RJZCk7XG5cdFx0XHRcdFx0Y29uc3QgcGFydHMgPSBub3JtYWxpemVQYXRoKHBhdGgpLnNwbGl0KFwiL1wiKS5maWx0ZXIoKHApID0+IHApO1xuXHRcdFx0XHRcdGNvbnN0IGZpbGVuYW1lID0gcGFydHMucG9wKCk7XG5cdFx0XHRcdFx0Y29uc3QgZGlyUGF0aCA9IHBhcnRzLmpvaW4oXCIvXCIpO1xuXHRcdFx0XHRcdGNvbnN0IHdyaXRhYmxlID0gYXdhaXQgKGF3YWl0IChhd2FpdCBnZXREaXJIYW5kbGUocm9vdCwgZGlyUGF0aCwgdHJ1ZSkpLmdldEZpbGVIYW5kbGUoZmlsZW5hbWUsIHsgY3JlYXRlOiB0cnVlIH0pKS5jcmVhdGVXcml0YWJsZSgpO1xuXHRcdFx0XHRcdGF3YWl0IHdyaXRhYmxlLndyaXRlKGRhdGEpO1xuXHRcdFx0XHRcdGF3YWl0IHdyaXRhYmxlLmNsb3NlKCk7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdFx0XHRjb25zb2xlLndhcm4oXCJXb3JrZXIgd3JpdGVGaWxlIGVycm9yOlwiLCBlKTtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRyZW1vdmU6IGFzeW5jICh7IHJvb3RJZCwgcGF0aCwgcmVjdXJzaXZlIH0pID0+IHtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRjb25zdCByb290ID0gYXdhaXQgZ2V0RmlsZVN5c3RlbVJvb3Qocm9vdElkKTtcblx0XHRcdFx0XHRjb25zdCBwYXJ0cyA9IG5vcm1hbGl6ZVBhdGgocGF0aCkuc3BsaXQoXCIvXCIpLmZpbHRlcigocCkgPT4gcCk7XG5cdFx0XHRcdFx0Y29uc3QgbmFtZSA9IHBhcnRzLnBvcCgpO1xuXHRcdFx0XHRcdGNvbnN0IGRpclBhdGggPSBwYXJ0cy5qb2luKFwiL1wiKTtcblx0XHRcdFx0XHRhd2FpdCAoYXdhaXQgZ2V0RGlySGFuZGxlKHJvb3QsIGRpclBhdGgsIGZhbHNlKSkucmVtb3ZlRW50cnkobmFtZSwgeyByZWN1cnNpdmUgfSk7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRvYnNlcnZlOiBhc3luYyAoeyByb290SWQsIHBhdGgsIGlkIH0pID0+IHtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRpZiAoYWN0aXZlT2JzZXJ2ZXJzLmhhcyhpZCkpIHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdGNvbnN0IHJvb3QgPSBhd2FpdCBnZXRGaWxlU3lzdGVtUm9vdChyb290SWQpO1xuXHRcdFx0XHRcdGNvbnN0IGhhbmRsZSA9IGF3YWl0IGdldERpckhhbmRsZShyb290LCBwYXRoLCBmYWxzZSk7XG5cdFx0XHRcdFx0aWYgKHR5cGVvZiBGaWxlU3lzdGVtT2JzZXJ2ZXIgIT09IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0XHRcdGNvbnN0IG9ic2VydmVyID0gbmV3IEZpbGVTeXN0ZW1PYnNlcnZlcigocmVjb3JkcykgPT4ge1xuXHRcdFx0XHRcdFx0XHRjb25zdCBjaGFuZ2VzID0gcmVjb3Jkcy5tYXAoKHIpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRjb25zdCBuYW1lID0gci5jaGFuZ2VkSGFuZGxlPy5uYW1lIHx8IHIucmVsYXRpdmVQYXRoQ29tcG9uZW50cz8uYXQoLTEpO1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0XHRcdFx0XHR0eXBlOiByLnR5cGUsXG5cdFx0XHRcdFx0XHRcdFx0XHRuYW1lLFxuXHRcdFx0XHRcdFx0XHRcdFx0a2luZDogci5jaGFuZ2VkSGFuZGxlPy5raW5kIHx8IChuYW1lPy5pbmNsdWRlcyhcIi5cIikgPyBcImZpbGVcIiA6IFwiZGlyZWN0b3J5XCIpLFxuXHRcdFx0XHRcdFx0XHRcdFx0aGFuZGxlOiByLmNoYW5nZWRIYW5kbGUsXG5cdFx0XHRcdFx0XHRcdFx0XHRwYXRoOiByLnJlbGF0aXZlUGF0aENvbXBvbmVudHMuam9pbihcIi9cIilcblx0XHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0c2VsZi5wb3N0TWVzc2FnZSh7XG5cdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJvYnNlcnZhdGlvblwiLFxuXHRcdFx0XHRcdFx0XHRcdGlkLFxuXHRcdFx0XHRcdFx0XHRcdGNoYW5nZXNcblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdG9ic2VydmVyLm9ic2VydmUoaGFuZGxlKTtcblx0XHRcdFx0XHRcdGFjdGl2ZU9ic2VydmVycy5zZXQoaWQsIG9ic2VydmVyKTtcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHR1bm9ic2VydmU6IGFzeW5jICh7IGlkIH0pID0+IHtcblx0XHRcdFx0Y29uc3Qgb2JzZXJ2ZXIgPSBhY3RpdmVPYnNlcnZlcnMuZ2V0KGlkKTtcblx0XHRcdFx0aWYgKG9ic2VydmVyKSB7XG5cdFx0XHRcdFx0b2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuXHRcdFx0XHRcdGFjdGl2ZU9ic2VydmVycy5kZWxldGUoaWQpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fSxcblx0XHRcdGNvcHk6IGFzeW5jICh7IGZyb20sIHRvIH0pID0+IHtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRjb25zdCBjb3B5UmVjdXJzaXZlID0gYXN5bmMgKHNvdXJjZSwgZGVzdCkgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKHNvdXJjZS5raW5kID09PSBcImRpcmVjdG9yeVwiKSBmb3IgYXdhaXQgKGNvbnN0IFtuYW1lLCBlbnRyeV0gb2Ygc291cmNlLmVudHJpZXMoKSkgaWYgKGVudHJ5LmtpbmQgPT09IFwiZGlyZWN0b3J5XCIpIHtcblx0XHRcdFx0XHRcdFx0Y29uc3QgbmV3RGVzdCA9IGF3YWl0IGRlc3QuZ2V0RGlyZWN0b3J5SGFuZGxlKG5hbWUsIHsgY3JlYXRlOiB0cnVlIH0pO1xuXHRcdFx0XHRcdFx0XHRhd2FpdCBjb3B5UmVjdXJzaXZlKGVudHJ5LCBuZXdEZXN0KTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IGZpbGUgPSBhd2FpdCBlbnRyeS5nZXRGaWxlKCk7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IHdyaXRhYmxlID0gYXdhaXQgKGF3YWl0IGRlc3QuZ2V0RmlsZUhhbmRsZShuYW1lLCB7IGNyZWF0ZTogdHJ1ZSB9KSkuY3JlYXRlV3JpdGFibGUoKTtcblx0XHRcdFx0XHRcdFx0YXdhaXQgd3JpdGFibGUud3JpdGUoZmlsZSk7XG5cdFx0XHRcdFx0XHRcdGF3YWl0IHdyaXRhYmxlLmNsb3NlKCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdFx0Y29uc3QgZmlsZSA9IGF3YWl0IHNvdXJjZS5nZXRGaWxlKCk7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IHdyaXRhYmxlID0gYXdhaXQgZGVzdC5jcmVhdGVXcml0YWJsZSgpO1xuXHRcdFx0XHRcdFx0XHRhd2FpdCB3cml0YWJsZS53cml0ZShmaWxlKTtcblx0XHRcdFx0XHRcdFx0YXdhaXQgd3JpdGFibGUuY2xvc2UoKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdGF3YWl0IGNvcHlSZWN1cnNpdmUoZnJvbSwgdG8pO1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRcdFx0Y29uc29sZS53YXJuKFwiV29ya2VyIGNvcHkgZXJyb3I6XCIsIGUpO1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cdFx0U1dfQlJJREdFX0NIQU5ORUxfTkFNRSA9IFwib3Bmcy1zdy1icmlkZ2UtdjFcIjtcblx0XHRzd0JyaWRnZUNoYW5uZWwgPSBudWxsO1xuXHRcdHRyeSB7XG5cdFx0XHRpZiAodHlwZW9mIEJyb2FkY2FzdENoYW5uZWwgIT09IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0c3dCcmlkZ2VDaGFubmVsID0gbmV3IEJyb2FkY2FzdENoYW5uZWwoU1dfQlJJREdFX0NIQU5ORUxfTkFNRSk7XG5cdFx0XHRcdHN3QnJpZGdlQ2hhbm5lbC5vbm1lc3NhZ2UgPSBhc3luYyAoZXZlbnQpID0+IHtcblx0XHRcdFx0XHRjb25zdCBkYXRhID0gZXZlbnQ/LmRhdGEgfHwge307XG5cdFx0XHRcdFx0aWYgKCFkYXRhIHx8IHR5cGVvZiBkYXRhICE9PSBcIm9iamVjdFwiKSByZXR1cm47XG5cdFx0XHRcdFx0aWYgKGRhdGE/LnR5cGUgIT09IFwib3Bmcy1zdy1yZXF1ZXN0XCIpIHJldHVybjtcblx0XHRcdFx0XHRjb25zdCByZXF1ZXN0SWQgPSBTdHJpbmcoZGF0YT8ucmVxdWVzdElkIHx8IFwiXCIpO1xuXHRcdFx0XHRcdGNvbnN0IGFjdGlvbiA9IFN0cmluZyhkYXRhPy5hY3Rpb24gfHwgXCJcIik7XG5cdFx0XHRcdFx0Y29uc3QgcGF5bG9hZCA9IGRhdGE/LnBheWxvYWQ7XG5cdFx0XHRcdFx0aWYgKCFyZXF1ZXN0SWQgfHwgIWFjdGlvbikgcmV0dXJuO1xuXHRcdFx0XHRcdGNvbnN0IGhhbmRsZXIgPSBoYW5kbGVyc1thY3Rpb25dO1xuXHRcdFx0XHRcdGlmICghaGFuZGxlcikge1xuXHRcdFx0XHRcdFx0c3dCcmlkZ2VDaGFubmVsPy5wb3N0TWVzc2FnZT8uKHtcblx0XHRcdFx0XHRcdFx0dHlwZTogXCJvcGZzLXN3LXJlc3BvbnNlXCIsXG5cdFx0XHRcdFx0XHRcdHJlcXVlc3RJZCxcblx0XHRcdFx0XHRcdFx0b2s6IGZhbHNlLFxuXHRcdFx0XHRcdFx0XHRlcnJvcjogYFVua25vd24gb3BlcmF0aW9uIHR5cGU6ICR7YWN0aW9ufWBcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0Y29uc3QgcmVzdWx0ID0gYXdhaXQgaGFuZGxlcihwYXlsb2FkKTtcblx0XHRcdFx0XHRcdHN3QnJpZGdlQ2hhbm5lbD8ucG9zdE1lc3NhZ2U/Lih7XG5cdFx0XHRcdFx0XHRcdHR5cGU6IFwib3Bmcy1zdy1yZXNwb25zZVwiLFxuXHRcdFx0XHRcdFx0XHRyZXF1ZXN0SWQsXG5cdFx0XHRcdFx0XHRcdG9rOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRyZXN1bHRcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdFx0XHRzd0JyaWRnZUNoYW5uZWw/LnBvc3RNZXNzYWdlPy4oe1xuXHRcdFx0XHRcdFx0XHR0eXBlOiBcIm9wZnMtc3ctcmVzcG9uc2VcIixcblx0XHRcdFx0XHRcdFx0cmVxdWVzdElkLFxuXHRcdFx0XHRcdFx0XHRvazogZmFsc2UsXG5cdFx0XHRcdFx0XHRcdGVycm9yOiBlcnJvcj8ubWVzc2FnZSB8fCBTdHJpbmcoZXJyb3IpXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0fSBjYXRjaCB7XG5cdFx0XHRzd0JyaWRnZUNoYW5uZWwgPSBudWxsO1xuXHRcdH1cblx0XHRzZWxmLmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIGFzeW5jIChlKSA9PiB7XG5cdFx0XHRpZiAoIWUuZGF0YSB8fCB0eXBlb2YgZS5kYXRhICE9PSBcIm9iamVjdFwiKSByZXR1cm47XG5cdFx0XHRjb25zdCB7IGlkLCB0eXBlLCBwYXlsb2FkIH0gPSBlLmRhdGE7XG5cdFx0XHRpZiAoaGFuZGxlcnNbdHlwZV0pIHRyeSB7XG5cdFx0XHRcdGNvbnN0IHJlc3VsdCA9IGF3YWl0IGhhbmRsZXJzW3R5cGVdKHBheWxvYWQpO1xuXHRcdFx0XHRzZWxmLnBvc3RNZXNzYWdlKHtcblx0XHRcdFx0XHRpZCxcblx0XHRcdFx0XHRyZXN1bHRcblx0XHRcdFx0fSk7XG5cdFx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0XHRzZWxmLnBvc3RNZXNzYWdlKHtcblx0XHRcdFx0XHRpZCxcblx0XHRcdFx0XHRlcnJvcjogZXJyb3I/Lm1lc3NhZ2UgfHwgU3RyaW5nKGVycm9yKVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKGlkKSBzZWxmLnBvc3RNZXNzYWdlKHtcblx0XHRcdFx0aWQsXG5cdFx0XHRcdGVycm9yOiBgVW5rbm93biBvcGVyYXRpb24gdHlwZTogJHt0eXBlfWBcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9KSk7XG5cbi8vIHNyYy91dGlscy9vcGZzL09QRlMudW5pZm9ybS53b3JrZXIudHNcblx0aW5pdF9PUEZTX3dvcmtlcigpO1xuXHRpZiAoaGFuZGxlcnMpIHJlZ2lzdGVyV29ya2VyQVBJKGhhbmRsZXJzKTtcblx0Y29uc3QgcHJvY2Vzc01lc3NhZ2UgPSBhc3luYyAoZW52ZWxvcGUpID0+IHtcblx0XHR0cnkge1xuXHRcdFx0aWYgKGVudmVsb3BlLnR5cGUgPT09IFwiYmF0Y2hcIikge1xuXHRcdFx0XHRjb25zdCByZXN1bHRzID0gW107XG5cdFx0XHRcdGZvciAoY29uc3QgbXNnIG9mIGVudmVsb3BlLnBheWxvYWQpIHtcblx0XHRcdFx0XHRjb25zdCByZXN1bHQgPSBhd2FpdCBwcm9jZXNzU2luZ2xlTWVzc2FnZShtc2cpO1xuXHRcdFx0XHRcdHJlc3VsdHMucHVzaChyZXN1bHQpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiByZXN1bHRzO1xuXHRcdFx0fSBlbHNlIHJldHVybiBhd2FpdCBwcm9jZXNzU2luZ2xlTWVzc2FnZShlbnZlbG9wZSk7XG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoXCJbT1BGUyBXb3JrZXJdIE1lc3NhZ2UgcHJvY2Vzc2luZyBlcnJvcjpcIiwgZXJyb3IpO1xuXHRcdFx0dGhyb3cgZXJyb3I7XG5cdFx0fVxuXHR9O1xuXHRjb25zdCBwcm9jZXNzU2luZ2xlTWVzc2FnZSA9IGFzeW5jIChlbnZlbG9wZSkgPT4ge1xuXHRcdGNvbnN0IGhhbmRsZXIgPSBoYW5kbGVyc1tlbnZlbG9wZS50eXBlXTtcblx0XHRpZiAoIWhhbmRsZXIpIHRocm93IG5ldyBFcnJvcihgVW5rbm93biBtZXNzYWdlIHR5cGU6ICR7ZW52ZWxvcGUudHlwZX1gKTtcblx0XHRyZXR1cm4gYXdhaXQgaGFuZGxlcihlbnZlbG9wZS5wYXlsb2FkKTtcblx0fTtcblx0Z2xvYmFsVGhpcy5wcm9jZXNzTWVzc2FnZSA9IHByb2Nlc3NNZXNzYWdlO1xuXHRjb25zdCBpbml0V29ya2VyID0gYXN5bmMgKCkgPT4ge1xuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBoYW5kbGVycyA9IChhd2FpdCBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IChpbml0X09QRlNfd29ya2VyKCksIE9QRlNfd29ya2VyX2V4cG9ydHMpKSkuaGFuZGxlcnM7XG5cdFx0XHRpZiAoaGFuZGxlcnMpIHJlZ2lzdGVyV29ya2VyQVBJKGhhbmRsZXJzKTtcblx0XHRcdGNvbnNvbGUubG9nKFwiW09QRlMgV29ya2VyXSBJbml0aWFsaXplZCB3aXRoIGhhbmRsZXJzOlwiLCBPYmplY3Qua2V5cyhoYW5kbGVycyB8fCB7fSkpO1xuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKFwiW09QRlMgV29ya2VyXSBGYWlsZWQgdG8gaW5pdGlhbGl6ZTpcIiwgZXJyb3IpO1xuXHRcdH1cblx0fTtcblx0aW5pdFdvcmtlcigpO1xuXG59KSgpOyJdLAogICJtYXBwaW5ncyI6ICJjQUFDLFVBQVcsQ0FHWCxJQUFJQSxHQUFZLE9BQU8sZUFDbkJDLEdBQVcsQ0FBQ0MsRUFBSUMsRUFBS0MsSUFBUSxJQUFNLENBQ3RDLEdBQUlBLEVBQUssTUFBTUEsRUFBSSxDQUFDLEVBQ3BCLEdBQUksQ0FDSCxPQUFPRixJQUFPQyxFQUFNRCxFQUFHQSxFQUFLLENBQUMsR0FBSUMsQ0FDbEMsT0FBU0UsRUFBRyxDQUNYLE1BQU1ELEVB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RUFDeEMsUUFBUSxJQUFJLDJDQUE0QyxPQUFPLEtBQUtBLEdBQVksQ0FBQyxDQUFDLENBQUMsQ0FDcEYsT0FBU1QsRUFBTyxDQUNmLFFBQVEsTUFBTSxzQ0FBdUNBLENBQUssQ0FDM0QsQ0FDRCxHQUNXLENBRVosR0FBRyIsCiAgIm5hbWVzIjogWyJfX2RlZlByb3AiLCAiX19lc21NaW4iLCAiZm4iLCAicmVzIiwgImVyciIsICJlIiwgIl9fZXhwb3J0QWxsIiwgImFsbCIsICJub19zeW1ib2xzIiwgInRhcmdldCIsICJuYW1lIiwgIldSZWZsZWN0QWN0aW9uIiwgIlRSQU5TUE9SVF9UWVBFX0FMSUFTRVMiLCAibm9ybWFsaXplVHJhbnNwb3J0VHlwZUFsaWFzIiwgInRyYW5zcG9ydCIsICJyYXciLCAiZGV0ZWN0VHJhbnNwb3J0VHlwZSQxIiwgIiRmeHkiLCAiaXNQcmltaXRpdmUiLCAib2JqIiwgInRyeVBhcnNlQnlIaW50IiwgInZhbHVlIiwgImhpbnQiLCAidW53cmFwIiwgImZhbGxiYWNrIiwgImZpeEZ4IiwgImZ4IiwgImdldFJhbmRvbVZhbHVlcyIsICJhcnJheSIsICJ2YWx1ZXMiLCAiaSIsICJVVUlEdjQiLCAiYyIsICJ1bndyYXBBcnJheSIsICJhcnIiLCAiZWwiLCAiaXNOb3RDb21wbGV4QXJyYXkiLCAiaXNDYW5KdXN0UmV0dXJuIiwgImlzVHlwZWRBcnJheSIsICJpc0NhblRyYW5zZmVyIiwgIiRwcm9taXNlIiwgIlNLSVBfS0VZUyIsICJpc1RoZW5hYmxlJDEiLCAic2V0dGxlT25lIiwgInYiLCAicmVhc29uIiwgIm93bkVudW1lcmFibGVLZXlzIiwgImtleSIsICJkZXNjIiwgImhhc1BlbmRpbmdQcm9taXNlcyIsICJzZWVuIiwgInNlZW5TZXQiLCAiaXRlbSIsICJyZXNvbHZlZERlZXAiLCAibW9kZSIsICJzbG90IiwgIml0ZW1zIiwgInJlY29yZCIsICJyZXNvbHZlZCIsICJjYWxsYmFja09yVmFsdWUiLCAiYXJncyIsICJib3VuZEN0eFN5bWJvbCIsICJib3VuZEN0eCIsICJkZWVwT3BlcmF0ZUFuZENsb25lIiwgIm9wZXJhdGlvbiIsICIkcHJldiIsICJpbmRleCIsICJlbnRyaWVzIiwgInJlc29sdmVkU3ltYm9sIiwgImhhbmRsZWRTeW1ib2wiLCAicmVzb2x2ZWRNYXAiLCAiaGFuZGxlZE1hcCIsICIkZXh0cmFjdEtleSQiLCAiaXNUaGVuYWJsZSIsICJhY3RXaXRoIiwgInByb21pc2VPclBsYWluIiwgImNiIiwgIlByb21pc2VIYW5kbGVyIiwgIiNyZXNvbHZlIiwgIiNyZWplY3QiLCAicmVzb2x2ZSIsICJyZWplY3QiLCAicHJvcCIsICJkZXNjcmlwdG9yIiwgInByb3RvIiwgInV3cCIsICJuZXdUYXJnZXQiLCAiY3QiLCAicmVjZWl2ZXIiLCAicmVzdWx0IiwgIiR0bXAiLCAiUHJvbWlzZWQiLCAidGhpc0FyZyIsICJwcm9taXNlIiwgInByb21pc2VzIiwgIkJhc2VTdWJzY3JpcHRpb24iLCAiX3Vuc3Vic2NyaWJlIiwgIk9ic2VydmFibGUiLCAiX3Byb2R1Y2VyIiwgIm9ic2VydmVyT3JOZXh0IiwgIm9wdHMiLCAib2JzZXJ2ZXIiLCAiY3RybCIsICJhY3RpdmUiLCAiY2xlYW51cCIsICJkb0NsZWFudXAiLCAic3Vic2NyaWJlciIsICJvcHMiLCAicyIsICJvcCIsICJDaGFubmVsU3ViamVjdCIsICJvcHRpb25zIiwgIm9icyIsICJmaWx0ZXIiLCAicHJlZCIsICJzcmMiLCAic3ViIiwgImRldGVjdENvbnRleHRUeXBlIiwgInNlcnZpY2VXb3JrZXJTY29wZSIsICJzaGFyZWRXb3JrZXJTY29wZSIsICJkZWRpY2F0ZWRXb3JrZXJTY29wZSIsICJkZXRlY3RUcmFuc3BvcnRUeXBlIiwgInNvdXJjZSIsICJkZXRlY3RlZCIsICJkZXRlY3RJbmNvbWluZ0NvbnRleHRUeXBlIiwgImRhdGEiLCAic2VuZGVyIiwgIkRlZmF1bHRSZWZsZWN0IiwgIlBST1hZX01BUktFUiIsICJQUk9YWV9JTlRFUk5BTFMiLCAiUmVtb3RlUHJveHlIYW5kbGVyIiwgIl9pbnZva2VyIiwgImNvbmZpZyIsICJwcm9wU3RyIiwgIiRyZXF1ZXN0SGFuZGxlciIsICIkZGVzY3JpcHRvciIsICJjaGlsZFBhdGgiLCAiY2hpbGRQcm94eSIsICJjcmVhdGVSZW1vdGVQcm94eSIsICJpbnZva2VyIiwgImhhbmRsZXIiLCAid3JhcERlc2NyaXB0b3IiLCAidGFyZ2V0Q2hhbm5lbCIsICJjYWNoZWQiLCAiZGVzY01hcCIsICJwcm94eSIsICJ3cmFwTWFwIiwgImNyZWF0ZUV4cG9zZUhhbmRsZXIiLCAicmVmbGVjdCIsICJjcmVhdGVPYmplY3RIYW5kbGVyIiwgImNyZWF0ZVNlbmRlclByb3h5IiwgImJhc2VQYXRoIiwgImFjdGlvbiIsICJwYXRoIiwgIm1ha2VSZXF1ZXN0UHJveHkiLCAiY3JlYXRlQ29ubmVjdGlvbktleSIsICJwYXJhbXMiLCAicXVlcnlDb25uZWN0aW9ucyIsICJjb25uZWN0aW9ucyIsICJxdWVyeSIsICJpbmNsdWRlQ2xvc2VkIiwgImRlc2lyZWRTdGF0dXMiLCAiY29ubmVjdGlvbiIsICJhIiwgImIiLCAiQ29ubmVjdGlvblJlZ2lzdHJ5IiwgIl9jcmVhdGVJZCIsICJfZW1pdEV2ZW50IiwgIm5vdyIsICJleGlzdGluZyIsICJwYXlsb2FkIiwgImNoYW5uZWwiLCAiVW5pZmllZENoYW5uZWwiLCAiZXZlbnQiLCAiY2ZnIiwgInRyYW5zcG9ydFR5cGUiLCAiYmluZGluZyIsICJzb3VyY2VDaGFubmVsIiwgIm1zZyIsICJzZW5kUmVzcG9uc2UiLCAid3JpdGVCeVBhdGgiLCAidXJsIiwgImlkIiwgInJlc29sdmVycyIsICJ0aW1lb3V0IiwgIm1lc3NhZ2UiLCAibW9kdWxlTmFtZSIsICJldmVudFR5cGUiLCAidHlwZSIsICJzZW50IiwgInRhcmdldHMiLCAicmVxSWQiLCAidG9UcmFuc2ZlciIsICJuZXdQYXRoIiwgImV4ZWN1dGVBY3Rpb24iLCAicmF3UmVzdWx0IiwgImNvcmVSZXNwb25zZSIsICJ0cmFuc2ZlciIsICJidWlsZFJlc3BvbnNlIiwgInJlc3BvbnNlIiwgInJlbW90ZUNoYW5uZWwiLCAic2lnbmFsVHlwZSIsICJ0YWJJZCIsICJsaXN0ZW5lciIsICJzZW5kZXJNZXRhIiwgInBvcnROYW1lIiwgInBvcnQiLCAiY3JlYXRlVW5pZmllZENoYW5uZWwiLCAiV09SS0VSX0NIQU5ORUwiLCAiZ2V0V29ya2VyQ2hhbm5lbCIsICJjb250ZXh0VHlwZSIsICJUUyIsICJUcmFuc2ZlcmFibGUiLCAiRSIsICJnZXRXb3JrZXJSZXNvbHZlQmFzZVVybCIsICJocmVmIiwgInJlc29sdmVXb3JrZXJTcGVjaWZpZXJIcmVmIiwgInNwZWMiLCAiYmFzZSIsICJub3JtYWxpemVkIiwgIlNFTEZfQ0hBTk5FTCIsICJDSEFOTkVMX01BUCIsICJpc1JlZmxlY3RBY3Rpb24kMSIsICJSZW1vdGVDaGFubmVsSGVscGVyJDEiLCAiY2hhbm5lbE5hbWUiLCAiQ2hhbm5lbEhhbmRsZXIkMSIsICJicm9hZGNhc3QiLCAidG9DaGFubmVsIiwgInJlcXVlc3QiLCAicmVzcG9uc2VGbiIsICJoYW5kbGVSZXF1ZXN0IiwgImluaXRDaGFubmVsSGFuZGxlciIsICIkY2hhbm5lbCIsICJoYW5kTWFwIiwgIm9iamVjdFRvUmVmIiwgInJlZ2lzdGVyZWRJblBhdGgiLCAibm9ybWFsaXplUmVmIiwgInN0b3JlZERhdGEiLCAidHJhdmVyc2VCeVBhdGgiLCAiJGRlc2MiLCAicmVhZEJ5UGF0aCIsICJyb290IiwgInJlbW92ZUJ5UGF0aCIsICJyZW1vdmVCeURhdGEiLCAiaGFzTm9QYXRoIiwgImlzT2JqZWN0IiwgImRlZmF1bHRSZWZsZWN0IiwgInQiLCAicCIsICJjdHgiLCAiZ290IiwgIm5vcm1hbGl6ZWRWYWx1ZSIsICJub3JtYWxpemVkQXJncyIsICJjYW5CZVJldHVybiIsICJmaW5hbFBhdGgiLCAiY3R4S2V5IiwgInBhcmVudCIsICJjdXJyZW50IiwgImNhbGxBcmdzIiwgImN0b3JBcmdzIiwgIkNoYW5uZWxDb25uZWN0aW9uIiwgIl9uYW1lIiwgIl90cmFuc3BvcnRUeXBlIiwgImZyb21DaGFubmVsIiwgIm0iLCAib3JpZ2luYWwiLCAiciIsICJzdGF0ZSIsICJDb25uZWN0aW9uUG9vbCIsICJnZXRDb25uZWN0aW9uUG9vbCIsICJnZXRDb25uZWN0aW9uIiwgIkRCX05BTUUiLCAiREJfVkVSU0lPTiIsICJTVE9SRVMiLCAiQ2hhbm5lbFN0b3JhZ2UiLCAiZGIiLCAibWVzc2FnZXNTdG9yZSIsICJtYWlsYm94U3RvcmUiLCAicGVuZGluZ1N0b3JlIiwgImV4Y2hhbmdlU3RvcmUiLCAic3RvcmVkTWVzc2FnZSIsICJ0eCIsICJzdG9yZSIsICJyZXN1bHRzIiwgImN1cnNvciIsICJtZXNzYWdlSWQiLCAic3RhdHVzIiwgIm1lc3NhZ2VzIiwgInN0YXRzIiwgImRlbGV0ZWRDb3VudCIsICJwZW5kaW5nIiwgIm9wZXJhdGlvbklkIiwgInBvbGxJbnRlcnZhbCIsICJzdGFydFRpbWUiLCAiZ2V0UmVxdWVzdCIsICJDaGFubmVsVHJhbnNhY3Rpb24iLCAib3BlcmF0aW9ucyIsICJzdG9yZU5hbWVzIiwgImdldFJlcSIsICJtc2dSZXF1ZXN0IiwgIm1haWxSZXF1ZXN0IiwgIl9zdG9yYWdlIiwgInVwZGF0ZXMiLCAiX3N0b3JhZ2VJbnN0YW5jZXMiLCAiZ2V0Q2hhbm5lbFN0b3JhZ2UiLCAid29ya2VyQmFzZSIsICJ3b3JrZXJDb2RlIiwgIlJlbW90ZUNoYW5uZWxIZWxwZXIiLCAiX2NoYW5uZWwiLCAiX2NvbnRleHQiLCAiX29wdGlvbnMiLCAibm9ybWFsaXplZFBhdGgiLCAibm9ybWFsaXplZEFjdGlvbiIsICJpc1JlZmxlY3RBY3Rpb24iLCAiQ2hhbm5lbEhhbmRsZXIiLCAibm9ybWFsaXplVHJhbnNwb3J0QmluZGluZyIsICJnZXREeW5hbWljVHJhbnNwb3J0VHlwZSIsICJDaGFubmVsQ29udGV4dCIsICJob3N0TmFtZSIsICJlbmRwb2ludCIsICJjb25uZWN0ZWRUYXJnZXRzIiwgIm5hbWVzIiwgImluaXRGbiIsICJ3b3JrZXIiLCAid29ya2VySW5zdGFuY2UiLCAibG9hZFdvcmtlciIsICJyZWFkeSIsICJicm9hZGNhc3ROYW1lIiwgImJjIiwgInNlbGZUYXJnZXQiLCAiYmNOYW1lIiwgIm5hbWUxIiwgIm5hbWUyIiwgIm1jIiwgImhhbmRsZXIxIiwgImhhbmRsZXIyIiwgInJlYWR5MSIsICJyZWFkeTIiLCAiY2hhbm5lbDEiLCAiY2hhbm5lbDIiLCAibXNnQ2hhbm5lbCIsICJpbmZvIiwgImRpcmVjdGlvbiIsICJtYXBwZWRUcmFuc3BvcnRUeXBlIiwgInVuaWZpZWQiLCAic3Vic2NyaXB0aW9uIiwgImlzVHJhbnNwb3J0QmluZGluZyIsICJuYXRpdmVUYXJnZXQiLCAiZWZmZWN0aXZlVGFyZ2V0IiwgIldYIiwgIkNPTlRFWFRfUkVHSVNUUlkiLCAiY3JlYXRlQ2hhbm5lbENvbnRleHQiLCAiV29ya2VyQ29udGV4dCIsICJjbG9zZWQiLCAiV09SS0VSX0NPTlRFWFQiLCAiZ2V0V29ya2VyQ29udGV4dCIsICJQb3J0VHJhbnNwb3J0IiwgIl9jaGFubmVsTmFtZSIsICJfY29uZmlnIiwgIm1zZ0hhbmRsZXIiLCAiZXJySGFuZGxlciIsICJ0cmFuc2ZlcmFibGUiLCAiY3JlYXRlQ2hhbm5lbFBhaXIiLCAiUG9ydFBvb2wiLCAiX2RlZmF1bHRDb25maWciLCAiV2luZG93UG9ydENvbm5lY3RvciIsICJfdGFyZ2V0IiwgImxvY2FsIiwgInJlbW90ZSIsICJjcmVhdGVQb3J0UHJveHkiLCAidGFyZ2V0UGF0aCIsICJleHBvc2VPdmVyUG9ydCIsICJlcnJvciIsICJQb3J0VHJhbnNwb3J0RmFjdG9yeSIsICJyZWdpc3RlcldvcmtlckFQSSIsICJhcGkiLCAiY2hhbm5lbEhhbmRsZXIiLCAibWV0aG9kTmFtZSIsICJPUEZTX3dvcmtlcl9leHBvcnRzIiwgImdldERpckhhbmRsZSIsICJnZXRGaWxlU3lzdGVtUm9vdCIsICJoYW5kbGVycyIsICJub3JtYWxpemVQYXRoIiwgInJlc29sdmVGaWxlU3lzdGVtSGFuZGxlIiwgIm1hcHBlZFJvb3RzIiwgImFjdGl2ZU9ic2VydmVycyIsICJTV19CUklER0VfQ0hBTk5FTF9OQU1FIiwgInN3QnJpZGdlQ2hhbm5lbCIsICJpbml0X09QRlNfd29ya2VyIiwgImNyZWF0ZSIsICJwYXJ0cyIsICJwYXJ0IiwgImhhbmRsZSIsICJyb290SWQiLCAiZW50cnkiLCAiZmlsZW5hbWUiLCAiZGlyUGF0aCIsICJmaWxlIiwgIndyaXRhYmxlIiwgInJlY3Vyc2l2ZSIsICJyZWNvcmRzIiwgImNoYW5nZXMiLCAiZnJvbSIsICJ0byIsICJjb3B5UmVjdXJzaXZlIiwgImRlc3QiLCAibmV3RGVzdCIsICJyZXF1ZXN0SWQiLCAicHJvY2Vzc01lc3NhZ2UiLCAiZW52ZWxvcGUiLCAicHJvY2Vzc1NpbmdsZU1lc3NhZ2UiXQp9Cg==
