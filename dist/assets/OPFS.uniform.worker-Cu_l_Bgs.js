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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiYXNzZXRzL09QRlMudW5pZm9ybS53b3JrZXItIX57MDAwfX4uanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIihmdW5jdGlvbigpIHtcblxuLy8jcmVnaW9uIFxcMHJvbGxkb3duL3J1bnRpbWUuanNcblx0dmFyIF9fZGVmUHJvcCA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eTtcblx0dmFyIF9fZXNtTWluID0gKGZuLCByZXMsIGVycikgPT4gKCkgPT4ge1xuXHRcdGlmIChlcnIpIHRocm93IGVyclswXTtcblx0XHR0cnkge1xuXHRcdFx0cmV0dXJuIGZuICYmIChyZXMgPSBmbihmbiA9IDApKSwgcmVzO1xuXHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdHRocm93IGVyciA9IFtlXSwgZTtcblx0XHR9XG5cdH07XG5cdHZhciBfX2V4cG9ydEFsbCA9IChhbGwsIG5vX3N5bWJvbHMpID0+IHtcblx0XHRsZXQgdGFyZ2V0ID0ge307XG5cdFx0Zm9yICh2YXIgbmFtZSBpbiBhbGwpIHtcblx0XHRcdF9fZGVmUHJvcCh0YXJnZXQsIG5hbWUsIHtcblx0XHRcdFx0Z2V0OiBhbGxbbmFtZV0sXG5cdFx0XHRcdGVudW1lcmFibGU6IHRydWVcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRpZiAoIW5vX3N5bWJvbHMpIHtcblx0XHRcdF9fZGVmUHJvcCh0YXJnZXQsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogXCJNb2R1bGVcIiB9KTtcblx0XHR9XG5cdFx0cmV0dXJuIHRhcmdldDtcblx0fTtcblxuLy8jZW5kcmVnaW9uXG4vLyNyZWdpb24gLi4vdW5pZm9ybS50cy9zcmMvbmV3ZXIvbmV4dC90eXBlcy9JbnRlcmZhY2UudHNcblx0bGV0IFdSZWZsZWN0QWN0aW9uID0gLyogQF9fUFVSRV9fICovIGZ1bmN0aW9uKFdSZWZsZWN0QWN0aW9uKSB7XG5cdFx0V1JlZmxlY3RBY3Rpb25bXCJHRVRcIl0gPSBcImdldFwiO1xuXHRcdFdSZWZsZWN0QWN0aW9uW1wiU0VUXCJdID0gXCJzZXRcIjtcblx0XHRXUmVmbGVjdEFjdGlvbltcIkNBTExcIl0gPSBcImNhbGxcIjtcblx0XHRXUmVmbGVjdEFjdGlvbltcIkFQUExZXCJdID0gXCJhcHBseVwiO1xuXHRcdFdSZWZsZWN0QWN0aW9uW1wiQ09OU1RSVUNUXCJdID0gXCJjb25zdHJ1Y3RcIjtcblx0XHRXUmVmbGVjdEFjdGlvbltcIkRFTEVURVwiXSA9IFwiZGVsZXRlXCI7XG5cdFx0V1JlZmxlY3RBY3Rpb25bXCJERUxFVEVfUFJPUEVSVFlcIl0gPSBcImRlbGV0ZVByb3BlcnR5XCI7XG5cdFx0V1JlZmxlY3RBY3Rpb25bXCJIQVNcIl0gPSBcImhhc1wiO1xuXHRcdFdSZWZsZWN0QWN0aW9uW1wiT1dOX0tFWVNcIl0gPSBcIm93bktleXNcIjtcblx0XHRXUmVmbGVjdEFjdGlvbltcIkdFVF9PV05fUFJPUEVSVFlfREVTQ1JJUFRPUlwiXSA9IFwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yXCI7XG5cdFx0V1JlZmxlY3RBY3Rpb25bXCJHRVRfUFJPUEVSVFlfREVTQ1JJUFRPUlwiXSA9IFwiZ2V0UHJvcGVydHlEZXNjcmlwdG9yXCI7XG5cdFx0V1JlZmxlY3RBY3Rpb25bXCJHRVRfUFJPVE9UWVBFX09GXCJdID0gXCJnZXRQcm90b3R5cGVPZlwiO1xuXHRcdFdSZWZsZWN0QWN0aW9uW1wiU0VUX1BST1RPVFlQRV9PRlwiXSA9IFwic2V0UHJvdG90eXBlT2ZcIjtcblx0XHRXUmVmbGVjdEFjdGlvbltcIklTX0VYVEVOU0lCTEVcIl0gPSBcImlzRXh0ZW5zaWJsZVwiO1xuXHRcdFdSZWZsZWN0QWN0aW9uW1wiUFJFVkVOVF9FWFRFTlNJT05TXCJdID0gXCJwcmV2ZW50RXh0ZW5zaW9uc1wiO1xuXHRcdFdSZWZsZWN0QWN0aW9uW1wiVFJBTlNGRVJcIl0gPSBcInRyYW5zZmVyXCI7XG5cdFx0V1JlZmxlY3RBY3Rpb25bXCJJTVBPUlRcIl0gPSBcImltcG9ydFwiO1xuXHRcdFdSZWZsZWN0QWN0aW9uW1wiRElTUE9TRVwiXSA9IFwiZGlzcG9zZVwiO1xuXHRcdHJldHVybiBXUmVmbGVjdEFjdGlvbjtcblx0fSh7fSk7XG5cbi8vI2VuZHJlZ2lvblxuLy8jcmVnaW9uIC4uL3VuaWZvcm0udHMvc3JjL25ld2VyL2NvcmUvVHJhbnNwb3J0Q29yZS50c1xuXHRjb25zdCBUUkFOU1BPUlRfVFlQRV9BTElBU0VTID0ge1xuXHRcdFwid3NcIjogXCJ3ZWJzb2NrZXRcIixcblx0XHRcInNvY2tldFwiOiBcIndlYnNvY2tldFwiLFxuXHRcdFwic29ja2V0aW9cIjogXCJzb2NrZXQtaW9cIixcblx0XHRcInNlcnZpY2VcIjogXCJzZXJ2aWNlLXdvcmtlclwiLFxuXHRcdFwic3dcIjogXCJzZXJ2aWNlLXdvcmtlclwiLFxuXHRcdFwic2VydmljZS13b3JrZXItY2xpZW50XCI6IFwic2VydmljZS13b3JrZXJcIixcblx0XHRcInNlcnZpY2Utd29ya2VyLWhvc3RcIjogXCJzZXJ2aWNlLXdvcmtlclwiLFxuXHRcdFwicmluZy1idWZmZXJcIjogXCJhdG9taWNzXCJcblx0fTtcblx0ZnVuY3Rpb24gbm9ybWFsaXplVHJhbnNwb3J0VHlwZUFsaWFzKHRyYW5zcG9ydCkge1xuXHRcdGNvbnN0IHJhdyA9IFN0cmluZyh0cmFuc3BvcnQgPz8gXCJcIikudHJpbSgpLnRvTG93ZXJDYXNlKCk7XG5cdFx0aWYgKCFyYXcpIHJldHVybiBcImludGVybmFsXCI7XG5cdFx0cmV0dXJuIFRSQU5TUE9SVF9UWVBFX0FMSUFTRVNbcmF3XSA/PyByYXc7XG5cdH1cblx0ZnVuY3Rpb24gZGV0ZWN0VHJhbnNwb3J0VHlwZSQxKHRyYW5zcG9ydCkge1xuXHRcdGlmICh0eXBlb2YgdHJhbnNwb3J0ID09PSBcInN0cmluZ1wiKSByZXR1cm4gbm9ybWFsaXplVHJhbnNwb3J0VHlwZUFsaWFzKHRyYW5zcG9ydCk7XG5cdFx0aWYgKHR5cGVvZiBXb3JrZXIgIT09IFwidW5kZWZpbmVkXCIgJiYgdHJhbnNwb3J0IGluc3RhbmNlb2YgV29ya2VyKSByZXR1cm4gXCJ3b3JrZXJcIjtcblx0XHRpZiAodHlwZW9mIFNoYXJlZFdvcmtlciAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0cmFuc3BvcnQgaW5zdGFuY2VvZiBTaGFyZWRXb3JrZXIpIHJldHVybiBcInNoYXJlZC13b3JrZXJcIjtcblx0XHRpZiAodHlwZW9mIE1lc3NhZ2VQb3J0ICE9PSBcInVuZGVmaW5lZFwiICYmIHRyYW5zcG9ydCBpbnN0YW5jZW9mIE1lc3NhZ2VQb3J0KSByZXR1cm4gXCJtZXNzYWdlLXBvcnRcIjtcblx0XHRpZiAodHlwZW9mIEJyb2FkY2FzdENoYW5uZWwgIT09IFwidW5kZWZpbmVkXCIgJiYgdHJhbnNwb3J0IGluc3RhbmNlb2YgQnJvYWRjYXN0Q2hhbm5lbCkgcmV0dXJuIFwiYnJvYWRjYXN0XCI7XG5cdFx0aWYgKHR5cGVvZiBXZWJTb2NrZXQgIT09IFwidW5kZWZpbmVkXCIgJiYgdHJhbnNwb3J0IGluc3RhbmNlb2YgV2ViU29ja2V0KSByZXR1cm4gXCJ3ZWJzb2NrZXRcIjtcblx0XHRpZiAodHlwZW9mIFJUQ0RhdGFDaGFubmVsICE9PSBcInVuZGVmaW5lZFwiICYmIHRyYW5zcG9ydCBpbnN0YW5jZW9mIFJUQ0RhdGFDaGFubmVsKSByZXR1cm4gXCJydGMtZGF0YVwiO1xuXHRcdGlmICh0eXBlb2YgY2hyb21lICE9PSBcInVuZGVmaW5lZFwiICYmIHRyYW5zcG9ydCAmJiB0eXBlb2YgdHJhbnNwb3J0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiB0cmFuc3BvcnQucG9zdE1lc3NhZ2UgPT09IFwiZnVuY3Rpb25cIiAmJiB0cmFuc3BvcnQub25NZXNzYWdlPy5hZGRMaXN0ZW5lcikgcmV0dXJuIFwiY2hyb21lLXBvcnRcIjtcblx0XHRyZXR1cm4gXCJpbnRlcm5hbFwiO1xuXHR9XG5cbi8vI2VuZHJlZ2lvblxuLy8jcmVnaW9uIC4uL2NvcmUudHMvc3JjL3V0aWxzL1ByaW1pdGl2ZS50c1xuXHRjb25zdCAkZnh5ID0gU3ltYm9sLmZvcihcIkBmaXhcIik7XG5cdC8qKlxuXHQqIENoZWNrIGlmIGEgdmFsdWUgaXMgYSBwcmltaXRpdmUgdHlwZSAobnVsbCwgc3RyaW5nLCBudW1iZXIsIGJvb2xlYW4sIGJpZ2ludCwgb3IgdW5kZWZpbmVkKS5cblx0KiBAcGFyYW0gb2JqIC0gVGhlIHZhbHVlIHRvIGNoZWNrXG5cdCogQHJldHVybnMgVHJ1ZSBpZiB0aGUgdmFsdWUgaXMgYSBwcmltaXRpdmUgdHlwZSwgZmFsc2Ugb3RoZXJ3aXNlXG5cdCovXG5cdGNvbnN0IGlzUHJpbWl0aXZlID0gKG9iaikgPT4ge1xuXHRcdHJldHVybiB0eXBlb2Ygb2JqID09IFwic3RyaW5nXCIgfHwgdHlwZW9mIG9iaiA9PSBcIm51bWJlclwiIHx8IHR5cGVvZiBvYmogPT0gXCJib29sZWFuXCIgfHwgdHlwZW9mIG9iaiA9PSBcImJpZ2ludFwiIHx8IHR5cGVvZiBvYmogPT0gXCJ1bmRlZmluZWRcIiB8fCBvYmogPT0gbnVsbDtcblx0fTtcblx0Y29uc3QgdHJ5UGFyc2VCeUhpbnQgPSAodmFsdWUsIGhpbnQpID0+IHtcblx0XHRpZiAoIWlzUHJpbWl0aXZlKHZhbHVlKSkgcmV0dXJuIG51bGw7XG5cdFx0aWYgKGhpbnQgPT0gXCJudW1iZXJcIikgcmV0dXJuIE51bWJlcih2YWx1ZSkgfHwgMDtcblx0XHRpZiAoaGludCA9PSBcInN0cmluZ1wiKSByZXR1cm4gU3RyaW5nKHZhbHVlKSB8fCBcIlwiO1xuXHRcdGlmIChoaW50ID09IFwiYm9vbGVhblwiKSByZXR1cm4gISF2YWx1ZTtcblx0XHRyZXR1cm4gdmFsdWU7XG5cdH07XG5cdGNvbnN0IHVud3JhcCA9IChvYmosIGZhbGxiYWNrKSA9PiB7XG5cdFx0cmV0dXJuIG9iaj8uWyRmeHldID8/IChvYmogIT0gbnVsbCA/IG9iaiA6IGZhbGxiYWNrKSA/PyBmYWxsYmFjaztcblx0fTtcblx0Y29uc3QgZml4RnggPSAob2JqKSA9PiB7XG5cdFx0aWYgKHR5cGVvZiBvYmogPT0gXCJmdW5jdGlvblwiIHx8IG9iaiA9PSBudWxsKSByZXR1cm4gb2JqO1xuXHRcdGNvbnN0IGZ4ID0gZnVuY3Rpb24oKSB7fTtcblx0XHRmeFskZnh5XSA9IG9iajtcblx0XHRyZXR1cm4gZng7XG5cdH07XG5cdGNvbnN0IGdldFJhbmRvbVZhbHVlcyA9IChhcnJheSkgPT4ge1xuXHRcdHJldHVybiBjcnlwdG8/LmdldFJhbmRvbVZhbHVlcyA/IGNyeXB0bz8uZ2V0UmFuZG9tVmFsdWVzPy4oYXJyYXkpIDogKCgpID0+IHtcblx0XHRcdGNvbnN0IHZhbHVlcyA9IG5ldyBVaW50OEFycmF5KGFycmF5Lmxlbmd0aCk7XG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB2YWx1ZXNbaV0gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyNTYpO1xuXHRcdFx0cmV0dXJuIHZhbHVlcztcblx0XHR9KSgpO1xuXHR9O1xuXHRjb25zdCBVVUlEdjQgPSAoKSA9PiBjcnlwdG8/LnJhbmRvbVVVSUQgPyBjcnlwdG8/LnJhbmRvbVVVSUQ/LigpIDogXCIxMDAwMDAwMC0xMDAwLTQwMDAtODAwMC0xMDAwMDAwMDAwMDBcIi5yZXBsYWNlKC9bMDE4XS9nLCAoYykgPT4gKCtjIF4gZ2V0UmFuZG9tVmFsdWVzPy4oLyogQF9fUFVSRV9fICovIG5ldyBVaW50OEFycmF5KDEpKT8uWzBdICYgMTUgPj4gK2MgLyA0KS50b1N0cmluZygxNikpO1xuXHRjb25zdCB1bndyYXBBcnJheSA9IChhcnIpID0+IHtcblx0XHRpZiAoQXJyYXkuaXNBcnJheShhcnIpKSByZXR1cm4gYXJyPy5mbGF0TWFwPy4oKGVsKSA9PiB7XG5cdFx0XHRpZiAoQXJyYXkuaXNBcnJheShlbCkpIHJldHVybiB1bndyYXBBcnJheShlbCk7XG5cdFx0XHRyZXR1cm4gZWw7XG5cdFx0fSk7XG5cdFx0ZWxzZSByZXR1cm4gYXJyO1xuXHR9O1xuXHRjb25zdCBpc05vdENvbXBsZXhBcnJheSA9IChhcnIpID0+IHtcblx0XHRyZXR1cm4gdW53cmFwQXJyYXkoYXJyKT8uZXZlcnk/Lihpc0Nhbkp1c3RSZXR1cm4pO1xuXHR9O1xuXHRjb25zdCBpc0Nhbkp1c3RSZXR1cm4gPSAob2JqKSA9PiB7XG5cdFx0cmV0dXJuIGlzUHJpbWl0aXZlKG9iaikgfHwgdHlwZW9mIFNoYXJlZEFycmF5QnVmZmVyID09IFwiZnVuY3Rpb25cIiAmJiBvYmogaW5zdGFuY2VvZiBTaGFyZWRBcnJheUJ1ZmZlciB8fCBpc1R5cGVkQXJyYXkob2JqKSB8fCBBcnJheS5pc0FycmF5KG9iaikgJiYgaXNOb3RDb21wbGV4QXJyYXkob2JqKTtcblx0fTtcblx0Y29uc3QgaXNUeXBlZEFycmF5ID0gKHZhbHVlKSA9PiB7XG5cdFx0cmV0dXJuIEFycmF5QnVmZmVyLmlzVmlldyh2YWx1ZSkgJiYgISh2YWx1ZSBpbnN0YW5jZW9mIERhdGFWaWV3KTtcblx0fTtcblx0Y29uc3QgaXNDYW5UcmFuc2ZlciA9IChvYmopID0+IHtcblx0XHRyZXR1cm4gaXNQcmltaXRpdmUob2JqKSB8fCB0eXBlb2YgQXJyYXlCdWZmZXIgPT0gXCJmdW5jdGlvblwiICYmIG9iaiBpbnN0YW5jZW9mIEFycmF5QnVmZmVyIHx8IHR5cGVvZiBNZXNzYWdlUG9ydCA9PSBcImZ1bmN0aW9uXCIgJiYgb2JqIGluc3RhbmNlb2YgTWVzc2FnZVBvcnQgfHwgdHlwZW9mIFJlYWRhYmxlU3RyZWFtID09IFwiZnVuY3Rpb25cIiAmJiBvYmogaW5zdGFuY2VvZiBSZWFkYWJsZVN0cmVhbSB8fCB0eXBlb2YgV3JpdGFibGVTdHJlYW0gPT0gXCJmdW5jdGlvblwiICYmIG9iaiBpbnN0YW5jZW9mIFdyaXRhYmxlU3RyZWFtIHx8IHR5cGVvZiBUcmFuc2Zvcm1TdHJlYW0gPT0gXCJmdW5jdGlvblwiICYmIG9iaiBpbnN0YW5jZW9mIFRyYW5zZm9ybVN0cmVhbSB8fCB0eXBlb2YgSW1hZ2VCaXRtYXAgPT0gXCJmdW5jdGlvblwiICYmIG9iaiBpbnN0YW5jZW9mIEltYWdlQml0bWFwIHx8IHR5cGVvZiBWaWRlb0ZyYW1lID09IFwiZnVuY3Rpb25cIiAmJiBvYmogaW5zdGFuY2VvZiBWaWRlb0ZyYW1lIHx8IHR5cGVvZiBPZmZzY3JlZW5DYW52YXMgPT0gXCJmdW5jdGlvblwiICYmIG9iaiBpbnN0YW5jZW9mIE9mZnNjcmVlbkNhbnZhcyB8fCB0eXBlb2YgUlRDRGF0YUNoYW5uZWwgPT0gXCJmdW5jdGlvblwiICYmIG9iaiBpbnN0YW5jZW9mIFJUQ0RhdGFDaGFubmVsIHx8IHR5cGVvZiBBdWRpb0RhdGEgPT0gXCJmdW5jdGlvblwiICYmIG9iaiBpbnN0YW5jZW9mIEF1ZGlvRGF0YSB8fCB0eXBlb2YgV2ViVHJhbnNwb3J0UmVjZWl2ZVN0cmVhbSA9PSBcImZ1bmN0aW9uXCIgJiYgb2JqIGluc3RhbmNlb2YgV2ViVHJhbnNwb3J0UmVjZWl2ZVN0cmVhbSB8fCB0eXBlb2YgV2ViVHJhbnNwb3J0U2VuZFN0cmVhbSA9PSBcImZ1bmN0aW9uXCIgJiYgb2JqIGluc3RhbmNlb2YgV2ViVHJhbnNwb3J0U2VuZFN0cmVhbSB8fCB0eXBlb2YgV2ViVHJhbnNwb3J0UmVjZWl2ZVN0cmVhbSA9PSBcImZ1bmN0aW9uXCIgJiYgb2JqIGluc3RhbmNlb2YgV2ViVHJhbnNwb3J0UmVjZWl2ZVN0cmVhbTtcblx0fTtcblxuLy8jZW5kcmVnaW9uXG4vLyNyZWdpb24gLi4vY29yZS50cy9zcmMvdXRpbHMvUmVzb2x2ZWQudHNcblx0Y29uc3QgJHByb21pc2UgPSBTeW1ib2wuZm9yKFwiQHByb21pc2VcIik7XG5cdGNvbnN0IFNLSVBfS0VZUyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KFtcblx0XHRTeW1ib2wuZm9yKFwiQGV4dHJhY3RcIiksXG5cdFx0U3ltYm9sLmZvcihcIkBvcmlnaW5cIiksXG5cdFx0U3ltYm9sLmZvcihcIkByZWdpc3RyeVwiKSxcblx0XHRTeW1ib2wuZm9yKFwiQHZhbHVlXCIpLFxuXHRcdFN5bWJvbC5mb3IoXCJAcHJvbWlzZVwiKSxcblx0XHRTeW1ib2wuZm9yKFwiQGJlaGF2aW9yXCIpLFxuXHRcdFN5bWJvbC5mb3IoXCJAdHJpZ2dlclwiKSxcblx0XHRTeW1ib2wuZm9yKFwiQHN1YnNjcmliZVwiKSxcblx0XHRTeW1ib2wuZm9yKFwiQHJlYWxQcm9wXCIpLFxuXHRcdFN5bWJvbC5mb3IoXCJAdHJpZ2dlci1sb2NrXCIpLFxuXHRcdFN5bWJvbC5mb3IoXCJAdHJpZ2dlci1sZXNzXCIpLFxuXHRcdFN5bWJvbC5mb3IoXCJAdHJpZ2dlci1jb250cm9sXCIpLFxuXHRcdFN5bWJvbC5mb3IoXCJAaXNOb3RFcXVhbFwiKSxcblx0XHRTeW1ib2wuZm9yKFwiQGZpeFwiKSxcblx0XHRTeW1ib2wuZm9yKFwiQHRhcmdldFwiKSxcblx0XHRTeW1ib2wuZm9yKFwiQHJlc29sdmVkXCIpXG5cdF0pO1xuXHRjb25zdCBpc1RoZW5hYmxlJDEgPSAodmFsdWUpID0+IHZhbHVlIGluc3RhbmNlb2YgUHJvbWlzZSB8fCB0eXBlb2YgdmFsdWU/LnRoZW4gPT0gXCJmdW5jdGlvblwiO1xuXHRjb25zdCBzZXR0bGVPbmUgPSAodmFsdWUpID0+IFByb21pc2UucmVzb2x2ZSh2YWx1ZSkudGhlbigodikgPT4gKHtcblx0XHRzdGF0dXM6IFwiZnVsZmlsbGVkXCIsXG5cdFx0dmFsdWU6IHZcblx0fSksIChyZWFzb24pID0+ICh7XG5cdFx0c3RhdHVzOiBcInJlamVjdGVkXCIsXG5cdFx0cmVhc29uXG5cdH0pKTtcblx0Y29uc3Qgb3duRW51bWVyYWJsZUtleXMgPSAob2JqKSA9PiBSZWZsZWN0Lm93bktleXMob2JqKS5maWx0ZXIoKGtleSkgPT4ge1xuXHRcdGlmIChTS0lQX0tFWVMuaGFzKGtleSkpIHJldHVybiBmYWxzZTtcblx0XHRjb25zdCBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmosIGtleSk7XG5cdFx0cmV0dXJuIGRlc2MgIT09IHZvaWQgMCAmJiBkZXNjLmVudW1lcmFibGU7XG5cdH0pO1xuXHQvKiogVHJ1ZSB3aGVuIGEgdmFsdWUgKG9yIGEgbmVzdGVkIGVudW1lcmFibGUgZmllbGQpIHN0aWxsIG5lZWRzIGEgUHJvbWlzZSBjb21iaW5hdG9yLiAqL1xuXHRjb25zdCBoYXNQZW5kaW5nUHJvbWlzZXMgPSAodmFsdWUsIHNlZW4pID0+IHtcblx0XHRpZiAodmFsdWUgPT0gbnVsbCB8fCBpc1ByaW1pdGl2ZSh2YWx1ZSkpIHJldHVybiBmYWxzZTtcblx0XHRpZiAoaXNUaGVuYWJsZSQxKHZhbHVlKSB8fCBpc1RoZW5hYmxlJDEodmFsdWU/LlskcHJvbWlzZV0pKSByZXR1cm4gdHJ1ZTtcblx0XHRpZiAodHlwZW9mIHZhbHVlICE9IFwib2JqZWN0XCIgJiYgdHlwZW9mIHZhbHVlICE9IFwiZnVuY3Rpb25cIikgcmV0dXJuIGZhbHNlO1xuXHRcdGNvbnN0IHNlZW5TZXQgPSBzZWVuID8/IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha1NldCgpO1xuXHRcdGlmIChzZWVuU2V0Lmhhcyh2YWx1ZSkpIHJldHVybiBmYWxzZTtcblx0XHRzZWVuU2V0LmFkZCh2YWx1ZSk7XG5cdFx0aWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSByZXR1cm4gdmFsdWUuc29tZSgoaXRlbSkgPT4gaGFzUGVuZGluZ1Byb21pc2VzKGl0ZW0sIHNlZW5TZXQpKTtcblx0XHRpZiAodmFsdWUgaW5zdGFuY2VvZiBNYXApIHJldHVybiBbLi4udmFsdWUudmFsdWVzKCldLnNvbWUoKGl0ZW0pID0+IGhhc1BlbmRpbmdQcm9taXNlcyhpdGVtLCBzZWVuU2V0KSk7XG5cdFx0aWYgKHZhbHVlIGluc3RhbmNlb2YgU2V0KSByZXR1cm4gWy4uLnZhbHVlLnZhbHVlcygpXS5zb21lKChpdGVtKSA9PiBoYXNQZW5kaW5nUHJvbWlzZXMoaXRlbSwgc2VlblNldCkpO1xuXHRcdHJldHVybiBvd25FbnVtZXJhYmxlS2V5cyh2YWx1ZSkuc29tZSgoa2V5KSA9PiBoYXNQZW5kaW5nUHJvbWlzZXModmFsdWVba2V5XSwgc2VlblNldCkpO1xuXHR9O1xuXHRmdW5jdGlvbiByZXNvbHZlZERlZXAodmFsdWUsIG1vZGUsIHNlZW4pIHtcblx0XHRpZiAodmFsdWUgPT0gbnVsbCB8fCBpc1ByaW1pdGl2ZSh2YWx1ZSkgfHwgdHlwZW9mIHZhbHVlID09IFwic3ltYm9sXCIpIHJldHVybiB2YWx1ZTtcblx0XHRpZiAoaXNUaGVuYWJsZSQxKHZhbHVlKSkgcmV0dXJuIHZhbHVlO1xuXHRcdGNvbnN0IHNsb3QgPSB2YWx1ZT8uWyRwcm9taXNlXTtcblx0XHRpZiAoaXNUaGVuYWJsZSQxKHNsb3QpKSByZXR1cm4gc2xvdDtcblx0XHRpZiAodHlwZW9mIHZhbHVlICE9IFwib2JqZWN0XCIgJiYgdHlwZW9mIHZhbHVlICE9IFwiZnVuY3Rpb25cIikgcmV0dXJuIHZhbHVlO1xuXHRcdGlmIChzZWVuLmhhcyh2YWx1ZSkpIHJldHVybiB2YWx1ZTtcblx0XHRzZWVuLmFkZCh2YWx1ZSk7XG5cdFx0aWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG5cdFx0XHRjb25zdCBpdGVtcyA9IHZhbHVlLm1hcCgoaXRlbSkgPT4gcmVzb2x2ZWREZWVwKGl0ZW0sIG1vZGUsIHNlZW4pKTtcblx0XHRcdHJldHVybiBtb2RlID09IFwic2V0dGxlZFwiID8gUHJvbWlzZS5hbGxTZXR0bGVkKGl0ZW1zKSA6IFByb21pc2UuYWxsKGl0ZW1zKTtcblx0XHR9XG5cdFx0aWYgKHZhbHVlIGluc3RhbmNlb2YgU2V0KSB7XG5cdFx0XHRjb25zdCBpdGVtcyA9IFsuLi52YWx1ZS52YWx1ZXMoKV0ubWFwKChpdGVtKSA9PiByZXNvbHZlZERlZXAoaXRlbSwgbW9kZSwgc2VlbikpO1xuXHRcdFx0cmV0dXJuIG1vZGUgPT0gXCJzZXR0bGVkXCIgPyBQcm9taXNlLmFsbFNldHRsZWQoaXRlbXMpIDogUHJvbWlzZS5hbGwoaXRlbXMpO1xuXHRcdH1cblx0XHRjb25zdCByZWNvcmQgPSB7fTtcblx0XHRpZiAodmFsdWUgaW5zdGFuY2VvZiBNYXApIGZvciAoY29uc3QgW2tleSwgaXRlbV0gb2YgdmFsdWUuZW50cmllcygpKSByZWNvcmRba2V5XSA9IHJlc29sdmVkRGVlcChpdGVtLCBtb2RlLCBzZWVuKTtcblx0XHRlbHNlIGZvciAoY29uc3Qga2V5IG9mIG93bkVudW1lcmFibGVLZXlzKHZhbHVlKSkgcmVjb3JkW2tleV0gPSByZXNvbHZlZERlZXAodmFsdWVba2V5XSwgbW9kZSwgc2Vlbik7XG5cdFx0cmV0dXJuIG1vZGUgPT0gXCJzZXR0bGVkXCIgPyBQcm9taXNlLmFsbFNldHRsZWRLZXllZChyZWNvcmQpIDogUHJvbWlzZS5hbGxLZXllZChyZWNvcmQpO1xuXHR9XG5cdC8qKlxuXHQqIEF3YWl0IGEgdmFsdWUgd2l0aCB0aGUgbWF0Y2hpbmcgUHJvbWlzZSBjb21iaW5hdG9yIChgYWxsYCAvIGBhbGxLZXllZGAgLyBzZXR0bGVkIHZhcmlhbnRzKS5cblx0KiBOZXN0ZWQgcmVjb3JkcywgYXJyYXlzLCBtYXBzLCBzZXRzLCBhbmQgYEBwcm9taXNlYCBzbG90cyBhcmUgd2Fsa2VkIG9uY2UuXG5cdCovXG5cdGZ1bmN0aW9uIHJlc29sdmVkKHZhbHVlLCBtb2RlID0gXCJhbGxcIikge1xuXHRcdGlmIChpc1RoZW5hYmxlJDEodmFsdWUpKSByZXR1cm4gbW9kZSA9PSBcInNldHRsZWRcIiA/IHNldHRsZU9uZSh2YWx1ZSkgOiBQcm9taXNlLnJlc29sdmUodmFsdWUpO1xuXHRcdGNvbnN0IHNsb3QgPSB2YWx1ZT8uWyRwcm9taXNlXTtcblx0XHRpZiAoaXNUaGVuYWJsZSQxKHNsb3QpKSByZXR1cm4gbW9kZSA9PSBcInNldHRsZWRcIiA/IHNldHRsZU9uZShzbG90KSA6IFByb21pc2UucmVzb2x2ZShzbG90KTtcblx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHJlc29sdmVkRGVlcCh2YWx1ZSwgbW9kZSwgLyogQF9fUFVSRV9fICovIG5ldyBXZWFrU2V0KCkpKTtcblx0fVxuXHRyZXNvbHZlZC5hbGwgPSAodmFsdWUpID0+IHJlc29sdmVkKHZhbHVlLCBcImFsbFwiKTtcblx0cmVzb2x2ZWQuYWxsU2V0dGxlZCA9ICh2YWx1ZSkgPT4gcmVzb2x2ZWQodmFsdWUsIFwic2V0dGxlZFwiKTtcblx0cmVzb2x2ZWQuYWxsS2V5ZWQgPSAodmFsdWUpID0+IFByb21pc2UuYWxsS2V5ZWQodmFsdWUpO1xuXHRyZXNvbHZlZC5hbGxTZXR0bGVkS2V5ZWQgPSAodmFsdWUpID0+IFByb21pc2UuYWxsU2V0dGxlZEtleWVkKHZhbHVlKTtcblx0cmVzb2x2ZWQudHJ5ID0gKGNhbGxiYWNrT3JWYWx1ZSwgLi4uYXJncykgPT4gUHJvbWlzZS50cnkoY2FsbGJhY2tPclZhbHVlLCAuLi5hcmdzKS50aGVuKCh2YWx1ZSkgPT4gcmVzb2x2ZWQodmFsdWUsIFwiYWxsXCIpKTtcblxuLy8jZW5kcmVnaW9uXG4vLyNyZWdpb24gLi4vY29yZS50cy9zcmMvdXRpbHMvT2JqZWN0LnRzXG5cdGNvbnN0IGJvdW5kQ3R4U3ltYm9sID0gU3ltYm9sLmZvcihcIm9iamVjdC5ib3VuZEN0eFwiKTtcblx0Z2xvYmFsVGhpc1tib3VuZEN0eFN5bWJvbF0gPz89IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xuXHRjb25zdCBib3VuZEN0eCA9IGdsb2JhbFRoaXNbYm91bmRDdHhTeW1ib2xdO1xuXHRjb25zdCBkZWVwT3BlcmF0ZUFuZENsb25lID0gKG9iaiwgb3BlcmF0aW9uLCAkcHJldikgPT4ge1xuXHRcdGlmIChBcnJheS5pc0FycmF5KG9iaikpIHtcblx0XHRcdGlmIChvYmouZXZlcnkoaXNDYW5KdXN0UmV0dXJuKSkgcmV0dXJuIG9iai5tYXAob3BlcmF0aW9uKTtcblx0XHRcdHJldHVybiBvYmoubWFwKCh2YWx1ZSwgaW5kZXgpID0+IGRlZXBPcGVyYXRlQW5kQ2xvbmUodmFsdWUsIG9wZXJhdGlvbiwgW29iaiwgaW5kZXhdKSk7XG5cdFx0fVxuXHRcdGlmIChvYmogaW5zdGFuY2VvZiBNYXApIHtcblx0XHRcdGNvbnN0IGVudHJpZXMgPSBBcnJheS5mcm9tKG9iai5lbnRyaWVzKCkpO1xuXHRcdFx0aWYgKGVudHJpZXMubWFwKChba2V5LCB2YWx1ZV0pID0+IHZhbHVlKS5ldmVyeShpc0Nhbkp1c3RSZXR1cm4pKSByZXR1cm4gbmV3IE1hcChlbnRyaWVzLm1hcCgoW2tleSwgdmFsdWVdKSA9PiBba2V5LCBvcGVyYXRpb24odmFsdWUsIGtleSwgb2JqKV0pKTtcblx0XHRcdHJldHVybiBuZXcgTWFwKGVudHJpZXMubWFwKChba2V5LCB2YWx1ZV0pID0+IFtrZXksIGRlZXBPcGVyYXRlQW5kQ2xvbmUodmFsdWUsIG9wZXJhdGlvbiwgW29iaiwga2V5XSldKSk7XG5cdFx0fVxuXHRcdGlmIChvYmogaW5zdGFuY2VvZiBTZXQpIHtcblx0XHRcdGNvbnN0IGVudHJpZXMgPSBBcnJheS5mcm9tKG9iai5lbnRyaWVzKCkpO1xuXHRcdFx0Y29uc3QgdmFsdWVzID0gZW50cmllcy5tYXAoKFtrZXksIHZhbHVlXSkgPT4gdmFsdWUpO1xuXHRcdFx0aWYgKGVudHJpZXMuZXZlcnkoaXNDYW5KdXN0UmV0dXJuKSkgcmV0dXJuIG5ldyBTZXQodmFsdWVzLm1hcChvcGVyYXRpb24pKTtcblx0XHRcdHJldHVybiBuZXcgU2V0KHZhbHVlcy5tYXAoKHZhbHVlKSA9PiBkZWVwT3BlcmF0ZUFuZENsb25lKHZhbHVlLCBvcGVyYXRpb24sIFtvYmosIHZhbHVlXSkpKTtcblx0XHR9XG5cdFx0aWYgKHR5cGVvZiBvYmogPT0gXCJvYmplY3RcIiAmJiBvYmo/LmNvbnN0cnVjdG9yID09IE9iamVjdCAmJiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PSBcIltvYmplY3QgT2JqZWN0XVwiKSB7XG5cdFx0XHRjb25zdCBlbnRyaWVzID0gQXJyYXkuZnJvbShPYmplY3QuZW50cmllcyhvYmopKTtcblx0XHRcdGlmIChlbnRyaWVzLm1hcCgoW2tleSwgdmFsdWVdKSA9PiB2YWx1ZSkuZXZlcnkoaXNDYW5KdXN0UmV0dXJuKSkgcmV0dXJuIE9iamVjdC5mcm9tRW50cmllcyhlbnRyaWVzLm1hcCgoW2tleSwgdmFsdWVdKSA9PiBba2V5LCBvcGVyYXRpb24odmFsdWUsIGtleSwgb2JqKV0pKTtcblx0XHRcdHJldHVybiBPYmplY3QuZnJvbUVudHJpZXMoZW50cmllcy5tYXAoKFtrZXksIHZhbHVlXSkgPT4gW2tleSwgZGVlcE9wZXJhdGVBbmRDbG9uZSh2YWx1ZSwgb3BlcmF0aW9uLCBbb2JqLCBrZXldKV0pKTtcblx0XHR9XG5cdFx0cmV0dXJuIG9wZXJhdGlvbihvYmosICRwcmV2Py5bMV0gPz8gXCJcIiwgJHByZXY/LlswXSA/PyBudWxsKTtcblx0fTtcblxuLy8jZW5kcmVnaW9uXG4vLyNyZWdpb24gLi4vY29yZS50cy9zcmMvdXRpbHMvUHJvbWlzZWQudHNcblx0Y29uc3QgcmVzb2x2ZWRTeW1ib2wgPSBTeW1ib2wuZm9yKFwiQHJlc29sdmVkLXByb21pc2VcIik7XG5cdGNvbnN0IGhhbmRsZWRTeW1ib2wgPSBTeW1ib2wuZm9yKFwiQGhhbmRsZWQtcHJvbWlzZVwiKTtcblx0Z2xvYmFsVGhpc1tyZXNvbHZlZFN5bWJvbF0gPz89IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xuXHRnbG9iYWxUaGlzW2hhbmRsZWRTeW1ib2xdID8/PSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcblx0Y29uc3QgcmVzb2x2ZWRNYXAgPSBnbG9iYWxUaGlzW3Jlc29sdmVkU3ltYm9sXTtcblx0Y29uc3QgaGFuZGxlZE1hcCA9IGdsb2JhbFRoaXNbaGFuZGxlZFN5bWJvbF07XG5cdGNvbnN0ICRleHRyYWN0S2V5JCA9IFN5bWJvbC5mb3IoXCJAZXh0cmFjdFwiKTtcblx0Y29uc3QgaXNUaGVuYWJsZSA9ICh2YWx1ZSkgPT4gdmFsdWUgaW5zdGFuY2VvZiBQcm9taXNlIHx8IHR5cGVvZiB2YWx1ZT8udGhlbiA9PSBcImZ1bmN0aW9uXCI7XG5cdGNvbnN0IGFjdFdpdGggPSAocHJvbWlzZU9yUGxhaW4sIGNiKSA9PiB7XG5cdFx0aWYgKGlzVGhlbmFibGUocHJvbWlzZU9yUGxhaW4pKSB7XG5cdFx0XHRpZiAocmVzb2x2ZWRNYXA/Lmhhcz8uKHByb21pc2VPclBsYWluKSkgcmV0dXJuIGNiKHJlc29sdmVkTWFwPy5nZXQ/Lihwcm9taXNlT3JQbGFpbikpO1xuXHRcdFx0cmV0dXJuIFByb21pc2UudHJ5Py4oYXN5bmMgKCkgPT4ge1xuXHRcdFx0XHRjb25zdCBpdGVtID0gYXdhaXQgcHJvbWlzZU9yUGxhaW47XG5cdFx0XHRcdHJlc29sdmVkTWFwPy5zZXQ/Lihwcm9taXNlT3JQbGFpbiwgaXRlbSk7XG5cdFx0XHRcdHJldHVybiBpdGVtO1xuXHRcdFx0fSk/LnRoZW4/LihjYik7XG5cdFx0fVxuXHRcdHJldHVybiBjYihwcm9taXNlT3JQbGFpbik7XG5cdH07XG5cdHZhciBQcm9taXNlSGFuZGxlciA9IGNsYXNzIHtcblx0XHQjcmVzb2x2ZTtcblx0XHQjcmVqZWN0O1xuXHRcdGNvbnN0cnVjdG9yKHJlc29sdmUsIHJlamVjdCkge1xuXHRcdFx0dGhpcy4jcmVzb2x2ZSA9IHJlc29sdmU7XG5cdFx0XHR0aGlzLiNyZWplY3QgPSByZWplY3Q7XG5cdFx0fVxuXHRcdGRlZmluZVByb3BlcnR5KHRhcmdldCwgcHJvcCwgZGVzY3JpcHRvcikge1xuXHRcdFx0aWYgKHVud3JhcCh0YXJnZXQpIGluc3RhbmNlb2YgUHJvbWlzZSkgcmV0dXJuIFJlZmxlY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBwcm9wLCBkZXNjcmlwdG9yKTtcblx0XHRcdHJldHVybiBhY3RXaXRoKHVud3JhcCh0YXJnZXQpLCAob2JqKSA9PiBSZWZsZWN0LmRlZmluZVByb3BlcnR5KG9iaiwgcHJvcCwgZGVzY3JpcHRvcikpO1xuXHRcdH1cblx0XHRkZWxldGVQcm9wZXJ0eSh0YXJnZXQsIHByb3ApIHtcblx0XHRcdGlmICh1bndyYXAodGFyZ2V0KSBpbnN0YW5jZW9mIFByb21pc2UpIHJldHVybiBSZWZsZWN0LmRlbGV0ZVByb3BlcnR5KHRhcmdldCwgcHJvcCk7XG5cdFx0XHRyZXR1cm4gYWN0V2l0aCh1bndyYXAodGFyZ2V0KSwgKG9iaikgPT4gUmVmbGVjdC5kZWxldGVQcm9wZXJ0eShvYmosIHByb3ApKTtcblx0XHR9XG5cdFx0Z2V0UHJvdG90eXBlT2YodGFyZ2V0KSB7XG5cdFx0XHRpZiAodW53cmFwKHRhcmdldCkgaW5zdGFuY2VvZiBQcm9taXNlKSByZXR1cm4gUmVmbGVjdC5nZXRQcm90b3R5cGVPZih0YXJnZXQpO1xuXHRcdFx0cmV0dXJuIGFjdFdpdGgodW53cmFwKHRhcmdldCksIChvYmopID0+IFJlZmxlY3QuZ2V0UHJvdG90eXBlT2Yob2JqKSk7XG5cdFx0fVxuXHRcdHNldFByb3RvdHlwZU9mKHRhcmdldCwgcHJvdG8pIHtcblx0XHRcdGlmICh1bndyYXAodGFyZ2V0KSBpbnN0YW5jZW9mIFByb21pc2UpIHJldHVybiBSZWZsZWN0LnNldFByb3RvdHlwZU9mKHRhcmdldCwgcHJvdG8pO1xuXHRcdFx0cmV0dXJuIGFjdFdpdGgodW53cmFwKHRhcmdldCksIChvYmopID0+IFJlZmxlY3Quc2V0UHJvdG90eXBlT2Yob2JqLCBwcm90bykpO1xuXHRcdH1cblx0XHRpc0V4dGVuc2libGUodGFyZ2V0KSB7XG5cdFx0XHRpZiAodW53cmFwKHRhcmdldCkgaW5zdGFuY2VvZiBQcm9taXNlKSByZXR1cm4gUmVmbGVjdC5pc0V4dGVuc2libGUodGFyZ2V0KTtcblx0XHRcdHJldHVybiBhY3RXaXRoKHVud3JhcCh0YXJnZXQpLCAob2JqKSA9PiBSZWZsZWN0LmlzRXh0ZW5zaWJsZShvYmopKTtcblx0XHR9XG5cdFx0cHJldmVudEV4dGVuc2lvbnModGFyZ2V0KSB7XG5cdFx0XHRpZiAodW53cmFwKHRhcmdldCkgaW5zdGFuY2VvZiBQcm9taXNlKSByZXR1cm4gUmVmbGVjdC5vd25LZXlzKHRhcmdldCk7XG5cdFx0XHRyZXR1cm4gYWN0V2l0aCh1bndyYXAodGFyZ2V0KSwgKG9iaikgPT4gUmVmbGVjdC5wcmV2ZW50RXh0ZW5zaW9ucyhvYmopKTtcblx0XHR9XG5cdFx0b3duS2V5cyh0YXJnZXQpIHtcblx0XHRcdGNvbnN0IHV3cCA9IHVud3JhcCh0YXJnZXQpO1xuXHRcdFx0aWYgKHV3cCBpbnN0YW5jZW9mIFByb21pc2UpIHJldHVybiBPYmplY3Qua2V5cyh1d3ApO1xuXHRcdFx0cmV0dXJuIGFjdFdpdGgodXdwLCAob2JqKSA9PiB7XG5cdFx0XHRcdHJldHVybiAodHlwZW9mIG9iaiA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBvYmogPT0gXCJmdW5jdGlvblwiKSAmJiBvYmogIT0gbnVsbCA/IE9iamVjdC5rZXlzKG9iaikgOiBbXTtcblx0XHRcdH0pID8/IFtdO1xuXHRcdH1cblx0XHRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBwcm9wKSB7XG5cdFx0XHRpZiAodW53cmFwKHRhcmdldCkgaW5zdGFuY2VvZiBQcm9taXNlKSByZXR1cm4gUmVmbGVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBwcm9wKTtcblx0XHRcdHJldHVybiBhY3RXaXRoKHVud3JhcCh0YXJnZXQpLCAob2JqKSA9PiBSZWZsZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmosIHByb3ApKTtcblx0XHR9XG5cdFx0Y29uc3RydWN0KHRhcmdldCwgYXJncywgbmV3VGFyZ2V0KSB7XG5cdFx0XHRyZXR1cm4gYWN0V2l0aCh1bndyYXAodGFyZ2V0KSwgKGN0KSA9PiBSZWZsZWN0LmNvbnN0cnVjdChjdCwgYXJncywgbmV3VGFyZ2V0KSk7XG5cdFx0fVxuXHRcdGhhcyh0YXJnZXQsIHByb3ApIHtcblx0XHRcdGlmICh1bndyYXAodGFyZ2V0KSBpbnN0YW5jZW9mIFByb21pc2UpIHJldHVybiBSZWZsZWN0Lmhhcyh0YXJnZXQsIHByb3ApO1xuXHRcdFx0cmV0dXJuIGFjdFdpdGgodW53cmFwKHRhcmdldCksIChvYmopID0+IFJlZmxlY3QuaGFzKG9iaiwgcHJvcCkpO1xuXHRcdH1cblx0XHRnZXQodGFyZ2V0LCBwcm9wLCByZWNlaXZlcikge1xuXHRcdFx0dGFyZ2V0ID0gdW53cmFwKHRhcmdldCk7XG5cdFx0XHRpZiAocHJvcCA9PSBcInByb21pc2VcIikgcmV0dXJuIHRhcmdldDtcblx0XHRcdGlmIChwcm9wID09IFwicmVzb2x2ZVwiICYmIHRoaXMuI3Jlc29sdmUpIHJldHVybiAoLi4uYXJncykgPT4ge1xuXHRcdFx0XHRjb25zdCByZXN1bHQgPSB0aGlzLiNyZXNvbHZlPy4oLi4uYXJncyk7XG5cdFx0XHRcdHRoaXMuI3Jlc29sdmUgPSBudWxsO1xuXHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0fTtcblx0XHRcdGlmIChwcm9wID09IFwicmVqZWN0XCIgJiYgdGhpcy4jcmVqZWN0KSByZXR1cm4gKC4uLmFyZ3MpID0+IHtcblx0XHRcdFx0Y29uc3QgcmVzdWx0ID0gdGhpcy4jcmVqZWN0Py4oLi4uYXJncyk7XG5cdFx0XHRcdHRoaXMuI3JlamVjdCA9IG51bGw7XG5cdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0XHR9O1xuXHRcdFx0aWYgKHByb3AgPT0gXCJ0aGVuXCIgfHwgcHJvcCA9PSBcImNhdGNoXCIgfHwgcHJvcCA9PSBcImZpbmFsbHlcIikge1xuXHRcdFx0XHRpZiAodGFyZ2V0IGluc3RhbmNlb2YgUHJvbWlzZSkgcmV0dXJuIHRhcmdldD8uW3Byb3BdPy5iaW5kPy4odGFyZ2V0KTtcblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0Y29uc3QgJHRtcCA9IFByb21pc2UudHJ5KCgpID0+IHRhcmdldCk7XG5cdFx0XHRcdFx0cmV0dXJuICR0bXA/Lltwcm9wXT8uYmluZD8uKCR0bXApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRsZXQgcmVzdWx0ID0gdm9pZCAwO1xuXHRcdFx0aWYgKHJlc29sdmVkTWFwPy5oYXM/Lih0YXJnZXQpICYmIChyZXN1bHQgPSByZXNvbHZlZE1hcD8uZ2V0Py4odGFyZ2V0KSk/Lltwcm9wXSAhPSBudWxsKSByZXN1bHQgPSByZXNvbHZlZE1hcD8uZ2V0Py4odGFyZ2V0KT8uW3Byb3BdO1xuXHRcdFx0ZWxzZSByZXN1bHQgPSBQcm9taXNlZChhY3RXaXRoKHRhcmdldCwgYXN5bmMgKG9iaikgPT4ge1xuXHRcdFx0XHRpZiAodW53cmFwKG9iaikgaW5zdGFuY2VvZiBQcm9taXNlKSByZXR1cm4gUmVmbGVjdC5nZXQob2JqLCBwcm9wLCByZWNlaXZlcik7XG5cdFx0XHRcdGlmIChpc1ByaW1pdGl2ZShvYmopKSByZXR1cm4gcHJvcCA9PSBTeW1ib2wudG9QcmltaXRpdmUgfHwgcHJvcCA9PSBTeW1ib2wudG9TdHJpbmdUYWcgPyBvYmogOiB2b2lkIDA7XG5cdFx0XHRcdGxldCB2YWx1ZSA9IHZvaWQgMDtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHR2YWx1ZSA9IFJlZmxlY3QuZ2V0KG9iaiwgcHJvcCwgcmVjZWl2ZXIpO1xuXHRcdFx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRcdFx0dmFsdWUgPSB0YXJnZXQ/Lltwcm9wXTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodHlwZW9mIHZhbHVlID09IFwiZnVuY3Rpb25cIikgcmV0dXJuIHZhbHVlPy5iaW5kPy4ob2JqKTtcblx0XHRcdFx0cmV0dXJuIHZhbHVlO1xuXHRcdFx0fSkpO1xuXHRcdFx0aWYgKHByb3AgPT0gU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0XHRcdGlmIChpc1ByaW1pdGl2ZShyZXN1bHQpKSByZXR1cm4gU3RyaW5nKHJlc3VsdCA/PyBcIlwiKSB8fCBcIlwiO1xuXHRcdFx0XHRyZXR1cm4gcmVzdWx0Py5bU3ltYm9sLnRvU3RyaW5nVGFnXT8uKCkgfHwgU3RyaW5nKHJlc3VsdCA/PyBcIlwiKSB8fCBcIlwiO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHByb3AgPT0gU3ltYm9sLnRvUHJpbWl0aXZlKSByZXR1cm4gKGhpbnQpID0+IHtcblx0XHRcdFx0aWYgKGlzUHJpbWl0aXZlKHJlc3VsdCkpIHJldHVybiB0cnlQYXJzZUJ5SGludChyZXN1bHQsIGhpbnQpO1xuXHRcdFx0fTtcblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fVxuXHRcdHNldCh0YXJnZXQsIHByb3AsIHZhbHVlKSB7XG5cdFx0XHRyZXR1cm4gYWN0V2l0aCh1bndyYXAodGFyZ2V0KSwgKG9iaikgPT4gUmVmbGVjdC5zZXQob2JqLCBwcm9wLCB2YWx1ZSkpO1xuXHRcdH1cblx0XHRhcHBseSh0YXJnZXQsIHRoaXNBcmcsIGFyZ3MpIHtcblx0XHRcdGlmICh0aGlzLiNyZXNvbHZlKSB7XG5cdFx0XHRcdGNvbnN0IHJlc3VsdCA9IHRoaXMuI3Jlc29sdmU/LiguLi5hcmdzKTtcblx0XHRcdFx0dGhpcy4jcmVzb2x2ZSA9IG51bGw7XG5cdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gYWN0V2l0aCh1bndyYXAodGFyZ2V0LCB0aGlzLiNyZXNvbHZlKSwgKG9iaikgPT4ge1xuXHRcdFx0XHRpZiAodHlwZW9mIG9iaiA9PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdFx0XHRpZiAodW53cmFwKG9iaikgaW5zdGFuY2VvZiBQcm9taXNlKSByZXR1cm4gUmVmbGVjdC5hcHBseShvYmosIHRoaXNBcmcsIGFyZ3MpO1xuXHRcdFx0XHRcdHJldHVybiBSZWZsZWN0LmFwcGx5KG9iaiwgdGhpc0FyZywgYXJncyk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0fTtcblx0ZnVuY3Rpb24gUHJvbWlzZWQocHJvbWlzZSwgcmVzb2x2ZSwgcmVqZWN0KSB7XG5cdFx0aWYgKHByb21pc2UgIT0gbnVsbCAmJiB0eXBlb2YgcHJvbWlzZT8ucmVzb2x2ZWQgPT0gXCJmdW5jdGlvblwiICYmIHByb21pc2VbJGV4dHJhY3RLZXkkXSAhPSBudWxsICYmIGhhc1BlbmRpbmdQcm9taXNlcyhwcm9taXNlKSkgcmV0dXJuIFByb21pc2VkKHByb21pc2UucmVzb2x2ZWQoKSwgcmVzb2x2ZSwgcmVqZWN0KTtcblx0XHRpZiAoIWlzVGhlbmFibGUocHJvbWlzZSkgJiYgaGFzUGVuZGluZ1Byb21pc2VzKHByb21pc2UpKSByZXR1cm4gUHJvbWlzZWQocmVzb2x2ZWQocHJvbWlzZSksIHJlc29sdmUsIHJlamVjdCk7XG5cdFx0aWYgKCFpc1RoZW5hYmxlKHByb21pc2UpKSByZXR1cm4gcHJvbWlzZTtcblx0XHRpZiAocmVzb2x2ZWRNYXA/Lmhhcz8uKHByb21pc2UpKSByZXR1cm4gcmVzb2x2ZWRNYXA/LmdldD8uKHByb21pc2UpO1xuXHRcdGlmICghaGFuZGxlZE1hcD8uaGFzPy4ocHJvbWlzZSkpIHByb21pc2U/LnRoZW4/LigoaXRlbSkgPT4gcmVzb2x2ZWRNYXA/LnNldD8uKHByb21pc2UsIGl0ZW0pKTtcblx0XHRyZXR1cm4gaGFuZGxlZE1hcC5nZXRPckluc2VydENvbXB1dGVkKHByb21pc2UsICgpID0+IG5ldyBQcm94eShmaXhGeChwcm9taXNlKSwgbmV3IFByb21pc2VIYW5kbGVyKHJlc29sdmUsIHJlamVjdCkpKTtcblx0fVxuXHRQcm9taXNlZC5hbGxLZXllZCA9IGZ1bmN0aW9uKHByb21pc2VzLCByZXNvbHZlLCByZWplY3QpIHtcblx0XHRyZXR1cm4gUHJvbWlzZWQoUHJvbWlzZS5hbGxLZXllZChwcm9taXNlcyksIHJlc29sdmUsIHJlamVjdCk7XG5cdH07XG5cdFByb21pc2VkLmFsbFNldHRsZWRLZXllZCA9IGZ1bmN0aW9uKHByb21pc2VzLCByZXNvbHZlLCByZWplY3QpIHtcblx0XHRyZXR1cm4gUHJvbWlzZWQoUHJvbWlzZS5hbGxTZXR0bGVkS2V5ZWQocHJvbWlzZXMpLCByZXNvbHZlLCByZWplY3QpO1xuXHR9O1xuXG4vLyNlbmRyZWdpb25cbi8vI3JlZ2lvbiAuLi91bmlmb3JtLnRzL3NyYy9uZXdlci9uZXh0L29ic2VydmFibGUvT2JzZXJ2YWJsZS50c1xuXHR2YXIgQmFzZVN1YnNjcmlwdGlvbiA9IGNsYXNzIHtcblx0XHRfdW5zdWJzY3JpYmU7XG5cdFx0X2Nsb3NlZCA9IGZhbHNlO1xuXHRcdGNvbnN0cnVjdG9yKF91bnN1YnNjcmliZSkge1xuXHRcdFx0dGhpcy5fdW5zdWJzY3JpYmUgPSBfdW5zdWJzY3JpYmU7XG5cdFx0fVxuXHRcdGdldCBjbG9zZWQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY2xvc2VkO1xuXHRcdH1cblx0XHR1bnN1YnNjcmliZSgpIHtcblx0XHRcdGlmICghdGhpcy5fY2xvc2VkKSB7XG5cdFx0XHRcdHRoaXMuX2Nsb3NlZCA9IHRydWU7XG5cdFx0XHRcdHRoaXMuX3Vuc3Vic2NyaWJlKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXHQvKipcblx0KiBDb3JlIE9ic2VydmFibGUgd2l0aCBwcm9kdWNlciBmdW5jdGlvblxuXHQqL1xuXHR2YXIgT2JzZXJ2YWJsZSA9IGNsYXNzIHtcblx0XHRfcHJvZHVjZXI7XG5cdFx0Y29uc3RydWN0b3IoX3Byb2R1Y2VyKSB7XG5cdFx0XHR0aGlzLl9wcm9kdWNlciA9IF9wcm9kdWNlcjtcblx0XHR9XG5cdFx0c3Vic2NyaWJlKG9ic2VydmVyT3JOZXh0LCBvcHRzKSB7XG5cdFx0XHRjb25zdCBvYnNlcnZlciA9IHR5cGVvZiBvYnNlcnZlck9yTmV4dCA9PT0gXCJmdW5jdGlvblwiID8geyBuZXh0OiBvYnNlcnZlck9yTmV4dCB9IDogb2JzZXJ2ZXJPck5leHQgPz8ge307XG5cdFx0XHRjb25zdCBjdHJsID0gbmV3IEFib3J0Q29udHJvbGxlcigpO1xuXHRcdFx0b3B0cz8uc2lnbmFsPy5hZGRFdmVudExpc3RlbmVyKFwiYWJvcnRcIiwgKCkgPT4gY3RybC5hYm9ydCgpKTtcblx0XHRcdGxldCBhY3RpdmUgPSB0cnVlO1xuXHRcdFx0bGV0IGNsZWFudXA7XG5cdFx0XHRjb25zdCBkb0NsZWFudXAgPSAoKSA9PiB7XG5cdFx0XHRcdGFjdGl2ZSA9IGZhbHNlO1xuXHRcdFx0XHRjdHJsLmFib3J0KCk7XG5cdFx0XHRcdGNsZWFudXA/LigpO1xuXHRcdFx0fTtcblx0XHRcdGNvbnN0IHN1YnNjcmliZXIgPSB7XG5cdFx0XHRcdG5leHQ6ICh2KSA9PiBhY3RpdmUgJiYgb2JzZXJ2ZXIubmV4dD8uKHYpLFxuXHRcdFx0XHRlcnJvcjogKGUpID0+IHtcblx0XHRcdFx0XHRpZiAoYWN0aXZlKSB7XG5cdFx0XHRcdFx0XHRvYnNlcnZlci5lcnJvcj8uKGUpO1xuXHRcdFx0XHRcdFx0ZG9DbGVhbnVwKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRjb21wbGV0ZTogKCkgPT4ge1xuXHRcdFx0XHRcdGlmIChhY3RpdmUpIHtcblx0XHRcdFx0XHRcdG9ic2VydmVyLmNvbXBsZXRlPy4oKTtcblx0XHRcdFx0XHRcdGRvQ2xlYW51cCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0c2lnbmFsOiBjdHJsLnNpZ25hbCxcblx0XHRcdFx0Z2V0IGFjdGl2ZSgpIHtcblx0XHRcdFx0XHRyZXR1cm4gYWN0aXZlICYmICFjdHJsLnNpZ25hbC5hYm9ydGVkO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0Y2xlYW51cCA9IHRoaXMuX3Byb2R1Y2VyKHN1YnNjcmliZXIpO1xuXHRcdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0XHRzdWJzY3JpYmVyLmVycm9yKGUpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG5ldyBCYXNlU3Vic2NyaXB0aW9uKGRvQ2xlYW51cCk7XG5cdFx0fVxuXHRcdHBpcGUoLi4ub3BzKSB7XG5cdFx0XHRyZXR1cm4gb3BzLnJlZHVjZSgocywgb3ApID0+IG9wKHMpLCB0aGlzKTtcblx0XHR9XG5cdH07XG5cdC8qKlxuXHQqIFN1YmplY3QgLSBPYnNlcnZhYmxlIHRoYXQgY2FuIGJlIHB1c2hlZCB0b1xuXHQqL1xuXHR2YXIgQ2hhbm5lbFN1YmplY3QgPSBjbGFzcyB7XG5cdFx0X3N1YnMgPSAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpO1xuXHRcdF9idWZmZXIgPSBbXTtcblx0XHRfbWF4QnVmZmVyO1xuXHRcdF9yZXBsYXk7XG5cdFx0Y29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG5cdFx0XHR0aGlzLl9tYXhCdWZmZXIgPSBvcHRpb25zLmJ1ZmZlclNpemUgPz8gMDtcblx0XHRcdHRoaXMuX3JlcGxheSA9IG9wdGlvbnMucmVwbGF5T25TdWJzY3JpYmUgPz8gZmFsc2U7XG5cdFx0fVxuXHRcdG5leHQodmFsdWUpIHtcblx0XHRcdGlmICh0aGlzLl9tYXhCdWZmZXIgPiAwKSB7XG5cdFx0XHRcdHRoaXMuX2J1ZmZlci5wdXNoKHZhbHVlKTtcblx0XHRcdFx0aWYgKHRoaXMuX2J1ZmZlci5sZW5ndGggPiB0aGlzLl9tYXhCdWZmZXIpIHRoaXMuX2J1ZmZlci5zaGlmdCgpO1xuXHRcdFx0fVxuXHRcdFx0Zm9yIChjb25zdCBzIG9mIHRoaXMuX3N1YnMpIHRyeSB7XG5cdFx0XHRcdHMubmV4dD8uKHZhbHVlKTtcblx0XHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdFx0cy5lcnJvcj8uKGUpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRlcnJvcihlcnIpIHtcblx0XHRcdGZvciAoY29uc3QgcyBvZiB0aGlzLl9zdWJzKSBzLmVycm9yPy4oZXJyKTtcblx0XHR9XG5cdFx0Y29tcGxldGUoKSB7XG5cdFx0XHRmb3IgKGNvbnN0IHMgb2YgdGhpcy5fc3Vicykgcy5jb21wbGV0ZT8uKCk7XG5cdFx0XHR0aGlzLl9zdWJzLmNsZWFyKCk7XG5cdFx0fVxuXHRcdHN1YnNjcmliZShvYnNlcnZlck9yTmV4dCkge1xuXHRcdFx0Y29uc3Qgb2JzID0gdHlwZW9mIG9ic2VydmVyT3JOZXh0ID09PSBcImZ1bmN0aW9uXCIgPyB7IG5leHQ6IG9ic2VydmVyT3JOZXh0IH0gOiBvYnNlcnZlck9yTmV4dDtcblx0XHRcdHRoaXMuX3N1YnMuYWRkKG9icyk7XG5cdFx0XHRpZiAodGhpcy5fcmVwbGF5KSBmb3IgKGNvbnN0IHYgb2YgdGhpcy5fYnVmZmVyKSB0cnkge1xuXHRcdFx0XHRvYnMubmV4dD8uKHYpO1xuXHRcdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0XHRvYnMuZXJyb3I/LihlKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBuZXcgQmFzZVN1YnNjcmlwdGlvbigoKSA9PiB7XG5cdFx0XHRcdHRoaXMuX3N1YnMuZGVsZXRlKG9icyk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0Z2V0VmFsdWUoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fYnVmZmVyLmF0KC0xKTtcblx0XHR9XG5cdFx0Z2V0QnVmZmVyKCkge1xuXHRcdFx0cmV0dXJuIFsuLi50aGlzLl9idWZmZXJdO1xuXHRcdH1cblx0XHRnZXQgc3Vic2NyaWJlckNvdW50KCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX3N1YnMuc2l6ZTtcblx0XHR9XG5cdH07XG5cdGNvbnN0IGZpbHRlciA9IChwcmVkKSA9PiAoc3JjKSA9PiBuZXcgT2JzZXJ2YWJsZSgoc3ViKSA9PiB7XG5cdFx0Y29uc3QgcyA9IHNyYy5zdWJzY3JpYmUoe1xuXHRcdFx0bmV4dDogKHYpID0+IHByZWQodikgJiYgc3ViLm5leHQodiksXG5cdFx0XHRlcnJvcjogKGUpID0+IHN1Yi5lcnJvcihlKSxcblx0XHRcdGNvbXBsZXRlOiAoKSA9PiBzdWIuY29tcGxldGUoKVxuXHRcdH0pO1xuXHRcdHJldHVybiAoKSA9PiBzLnVuc3Vic2NyaWJlKCk7XG5cdH0pO1xuXG4vLyNlbmRyZWdpb25cbi8vI3JlZ2lvbiAuLi91bmlmb3JtLnRzL3NyYy9uZXdlci9uZXh0L3Byb3h5L0ludm9rZXIudHNcblx0ZnVuY3Rpb24gZGV0ZWN0Q29udGV4dFR5cGUoKSB7XG5cdFx0aWYgKHR5cGVvZiBnbG9iYWxUaGlzLkRlbm8gIT09IFwidW5kZWZpbmVkXCIpIHJldHVybiBcImRlbm9cIjtcblx0XHRpZiAodHlwZW9mIGdsb2JhbFRoaXMucHJvY2VzcyAhPT0gXCJ1bmRlZmluZWRcIiAmJiBnbG9iYWxUaGlzLnByb2Nlc3M/LnZlcnNpb25zPy5ub2RlKSByZXR1cm4gXCJub2RlXCI7XG5cdFx0Y29uc3Qgc2VydmljZVdvcmtlclNjb3BlID0gZ2xvYmFsVGhpcy5TZXJ2aWNlV29ya2VyR2xvYmFsU2NvcGU7XG5cdFx0Y29uc3Qgc2hhcmVkV29ya2VyU2NvcGUgPSBnbG9iYWxUaGlzLlNoYXJlZFdvcmtlckdsb2JhbFNjb3BlO1xuXHRcdGNvbnN0IGRlZGljYXRlZFdvcmtlclNjb3BlID0gZ2xvYmFsVGhpcy5EZWRpY2F0ZWRXb3JrZXJHbG9iYWxTY29wZTtcblx0XHRpZiAoc2VydmljZVdvcmtlclNjb3BlICYmIHNlbGYgaW5zdGFuY2VvZiBzZXJ2aWNlV29ya2VyU2NvcGUpIHJldHVybiBcInNlcnZpY2Utd29ya2VyXCI7XG5cdFx0aWYgKHNoYXJlZFdvcmtlclNjb3BlICYmIHNlbGYgaW5zdGFuY2VvZiBzaGFyZWRXb3JrZXJTY29wZSkgcmV0dXJuIFwic2hhcmVkLXdvcmtlclwiO1xuXHRcdGlmIChkZWRpY2F0ZWRXb3JrZXJTY29wZSAmJiBzZWxmIGluc3RhbmNlb2YgZGVkaWNhdGVkV29ya2VyU2NvcGUpIHJldHVybiBcIndvcmtlclwiO1xuXHRcdGlmICh0eXBlb2YgY2hyb21lICE9PSBcInVuZGVmaW5lZFwiICYmIGNocm9tZS5ydW50aW1lPy5pZCkge1xuXHRcdFx0aWYgKHR5cGVvZiBjaHJvbWUucnVudGltZS5nZXRCYWNrZ3JvdW5kUGFnZSA9PT0gXCJmdW5jdGlvblwiIHx8IChjaHJvbWUucnVudGltZS5nZXRNYW5pZmVzdD8uKCk/LmJhY2tncm91bmQpPy5zZXJ2aWNlX3dvcmtlcikgcmV0dXJuIFwiY2hyb21lLWJhY2tncm91bmRcIjtcblx0XHRcdGlmICh0eXBlb2YgY2hyb21lLmRldnRvb2xzICE9PSBcInVuZGVmaW5lZFwiKSByZXR1cm4gXCJjaHJvbWUtZGV2dG9vbHNcIjtcblx0XHRcdGlmICh0eXBlb2YgZG9jdW1lbnQgIT09IFwidW5kZWZpbmVkXCIgJiYgZ2xvYmFsVGhpcz8ubG9jYXRpb24/LnByb3RvY29sID09PSBcImNocm9tZS1leHRlbnNpb246XCIpIHtcblx0XHRcdFx0aWYgKChjaHJvbWUuZXh0ZW5zaW9uPy5nZXRWaWV3cz8uKHsgdHlwZTogXCJwb3B1cFwiIH0pID8/IFtdKS5pbmNsdWRlcyhnbG9iYWxUaGlzKSkgcmV0dXJuIFwiY2hyb21lLXBvcHVwXCI7XG5cdFx0XHR9XG5cdFx0XHRpZiAodHlwZW9mIGRvY3VtZW50ICE9PSBcInVuZGVmaW5lZFwiICYmIGdsb2JhbFRoaXM/LmxvY2F0aW9uPy5wcm90b2NvbCAhPT0gXCJjaHJvbWUtZXh0ZW5zaW9uOlwiKSByZXR1cm4gXCJjaHJvbWUtY29udGVudFwiO1xuXHRcdH1cblx0XHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgIT09IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mIGRvY3VtZW50ICE9PSBcInVuZGVmaW5lZFwiKSByZXR1cm4gXCJ3aW5kb3dcIjtcblx0XHRyZXR1cm4gXCJ1bmtub3duXCI7XG5cdH1cblx0ZnVuY3Rpb24gZGV0ZWN0VHJhbnNwb3J0VHlwZShzb3VyY2UpIHtcblx0XHRpZiAodHlwZW9mIFJUQ0RhdGFDaGFubmVsICE9PSBcInVuZGVmaW5lZFwiICYmIHNvdXJjZSBpbnN0YW5jZW9mIFJUQ0RhdGFDaGFubmVsKSByZXR1cm4gXCJydGMtZGF0YVwiO1xuXHRcdGNvbnN0IGRldGVjdGVkID0gZGV0ZWN0VHJhbnNwb3J0VHlwZSQxKHNvdXJjZSk7XG5cdFx0aWYgKGRldGVjdGVkICYmIGRldGVjdGVkICE9PSBcImludGVybmFsXCIpIHJldHVybiBkZXRlY3RlZDtcblx0XHRpZiAoc291cmNlID09PSBzZWxmIHx8IHNvdXJjZSA9PT0gZ2xvYmFsVGhpcyB8fCBzb3VyY2UgPT09IFwic2VsZlwiKSByZXR1cm4gXCJzZWxmXCI7XG5cdFx0cmV0dXJuIFwiaW50ZXJuYWxcIjtcblx0fVxuXHRmdW5jdGlvbiBkZXRlY3RJbmNvbWluZ0NvbnRleHRUeXBlKGRhdGEpIHtcblx0XHRpZiAoIWRhdGEpIHJldHVybiBcInVua25vd25cIjtcblx0XHRpZiAoZGF0YS5jb250ZXh0VHlwZSkgcmV0dXJuIGRhdGEuY29udGV4dFR5cGU7XG5cdFx0Y29uc3Qgc2VuZGVyID0gZGF0YS5zZW5kZXIgPz8gXCJcIjtcblx0XHRpZiAoc2VuZGVyLmluY2x1ZGVzKFwid29ya2VyXCIpKSByZXR1cm4gXCJ3b3JrZXJcIjtcblx0XHRpZiAoc2VuZGVyLmluY2x1ZGVzKFwic3dcIikgfHwgc2VuZGVyLmluY2x1ZGVzKFwic2VydmljZVwiKSkgcmV0dXJuIFwic2VydmljZS13b3JrZXJcIjtcblx0XHRpZiAoc2VuZGVyLmluY2x1ZGVzKFwiY2hyb21lXCIpIHx8IHNlbmRlci5pbmNsdWRlcyhcImNyeFwiKSkgcmV0dXJuIFwiY2hyb21lLWNvbnRlbnRcIjtcblx0XHRpZiAoc2VuZGVyLmluY2x1ZGVzKFwiYmFja2dyb3VuZFwiKSkgcmV0dXJuIFwiY2hyb21lLWJhY2tncm91bmRcIjtcblx0XHRyZXR1cm4gXCJ1bmtub3duXCI7XG5cdH1cblx0Y29uc3QgRGVmYXVsdFJlZmxlY3QgPSB7XG5cdFx0Z2V0OiAodGFyZ2V0LCBwcm9wKSA9PiBSZWZsZWN0LmdldCh0YXJnZXQsIHByb3ApLFxuXHRcdHNldDogKHRhcmdldCwgcHJvcCwgdmFsdWUpID0+IFJlZmxlY3Quc2V0KHRhcmdldCwgcHJvcCwgdmFsdWUpLFxuXHRcdGhhczogKHRhcmdldCwgcHJvcCkgPT4gUmVmbGVjdC5oYXModGFyZ2V0LCBwcm9wKSxcblx0XHRhcHBseTogKHRhcmdldCwgdGhpc0FyZywgYXJncykgPT4gUmVmbGVjdC5hcHBseSh0YXJnZXQsIHRoaXNBcmcsIGFyZ3MpLFxuXHRcdGNvbnN0cnVjdDogKHRhcmdldCwgYXJncykgPT4gUmVmbGVjdC5jb25zdHJ1Y3QodGFyZ2V0LCBhcmdzKSxcblx0XHRkZWxldGVQcm9wZXJ0eTogKHRhcmdldCwgcHJvcCkgPT4gUmVmbGVjdC5kZWxldGVQcm9wZXJ0eSh0YXJnZXQsIHByb3ApLFxuXHRcdG93bktleXM6ICh0YXJnZXQpID0+IFJlZmxlY3Qub3duS2V5cyh0YXJnZXQpLFxuXHRcdGdldE93blByb3BlcnR5RGVzY3JpcHRvcjogKHRhcmdldCwgcHJvcCkgPT4gUmVmbGVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBwcm9wKSxcblx0XHRnZXRQcm90b3R5cGVPZjogKHRhcmdldCkgPT4gUmVmbGVjdC5nZXRQcm90b3R5cGVPZih0YXJnZXQpLFxuXHRcdHNldFByb3RvdHlwZU9mOiAodGFyZ2V0LCBwcm90bykgPT4gUmVmbGVjdC5zZXRQcm90b3R5cGVPZih0YXJnZXQsIHByb3RvKSxcblx0XHRpc0V4dGVuc2libGU6ICh0YXJnZXQpID0+IFJlZmxlY3QuaXNFeHRlbnNpYmxlKHRhcmdldCksXG5cdFx0cHJldmVudEV4dGVuc2lvbnM6ICh0YXJnZXQpID0+IFJlZmxlY3QucHJldmVudEV4dGVuc2lvbnModGFyZ2V0KVxuXHR9O1xuXG4vLyNlbmRyZWdpb25cbi8vI3JlZ2lvbiAuLi91bmlmb3JtLnRzL3NyYy9uZXdlci9uZXh0L3Byb3h5L1Byb3h5LnRzXG4vKipcblx0KiBQcm94eSAtIFVuaWZpZWQgUmVtb3RlIFByb3h5IENyZWF0aW9uXG5cdCpcblx0KiBTaW5nbGUgc291cmNlIG9mIHRydXRoIGZvciBhbGwgcHJveHktcmVsYXRlZCBmdW5jdGlvbmFsaXR5OlxuXHQqIC0gUmVtb3RlIG9iamVjdCBwcm94aWVzICh0cmFuc3BhcmVudCBSUEMpXG5cdCogLSBEZXNjcmlwdG9yLWJhc2VkIHByb3hpZXNcblx0KiAtIFR5cGUtc2FmZSBwcm94eSBjcmVhdGlvblxuXHQqIC0gRXhwb3NlL2xpc3RlbiBwYXR0ZXJuc1xuXHQqL1xuXHQvKiogU3ltYm9sIHRvIGlkZW50aWZ5IHByb3h5IG9iamVjdHMgKi9cblx0Y29uc3QgUFJPWFlfTUFSS0VSID0gU3ltYm9sLmZvcihcInVuaWZvcm0ucHJveHlcIik7XG5cdC8qKiBTeW1ib2wgdG8gYWNjZXNzIHByb3h5IGludGVybmFscyAqL1xuXHRjb25zdCBQUk9YWV9JTlRFUk5BTFMgPSBTeW1ib2wuZm9yKFwidW5pZm9ybS5wcm94eS5pbnRlcm5hbHNcIik7XG5cdC8qKlxuXHQqIFJlbW90ZVByb3h5SGFuZGxlciAtIFVuaWZpZWQgcHJveHkgaGFuZGxlciBmb3IgcmVtb3RlIGludm9jYXRpb25cblx0KlxuXHQqIEhhbmRsZXMgYWxsIFJlZmxlY3Qgb3BlcmF0aW9ucyBhbmQgZm9yd2FyZHMgdGhlbSB0byB0aGUgaW52b2tlci5cblx0Ki9cblx0dmFyIFJlbW90ZVByb3h5SGFuZGxlciA9IGNsYXNzIHtcblx0XHRfaW52b2tlcjtcblx0XHRfY29uZmlnO1xuXHRcdF9jaGlsZENhY2hlID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0XHRjb25zdHJ1Y3RvcihfaW52b2tlciwgY29uZmlnKSB7XG5cdFx0XHR0aGlzLl9pbnZva2VyID0gX2ludm9rZXI7XG5cdFx0XHR0aGlzLl9jb25maWcgPSB7XG5cdFx0XHRcdGNoYW5uZWw6IGNvbmZpZy5jaGFubmVsLFxuXHRcdFx0XHRiYXNlUGF0aDogY29uZmlnLmJhc2VQYXRoID8/IFtdLFxuXHRcdFx0XHRpbnZva2VyOiBfaW52b2tlcixcblx0XHRcdFx0Y2FjaGU6IGNvbmZpZy5jYWNoZSA/PyB0cnVlLFxuXHRcdFx0XHR0aW1lb3V0OiBjb25maWcudGltZW91dCA/PyAzZTRcblx0XHRcdH07XG5cdFx0fVxuXHRcdC8qKiBHZXQgcHJvcGVydHkgLSByZXR1cm5zIG5lc3RlZCBwcm94eSBvciBpbnZva2VzIEdFVCAqL1xuXHRcdGdldCh0YXJnZXQsIHByb3AsIHJlY2VpdmVyKSB7XG5cdFx0XHRjb25zdCBwcm9wU3RyID0gU3RyaW5nKHByb3ApO1xuXHRcdFx0aWYgKHByb3AgPT09IFBST1hZX01BUktFUikgcmV0dXJuIHRydWU7XG5cdFx0XHRpZiAocHJvcCA9PT0gUFJPWFlfSU5URVJOQUxTKSByZXR1cm4gdGhpcy5fY29uZmlnO1xuXHRcdFx0aWYgKHByb3AgPT09ICRyZXF1ZXN0SGFuZGxlcikgcmV0dXJuIHRydWU7XG5cdFx0XHRpZiAocHJvcCA9PT0gJGRlc2NyaXB0b3IpIHJldHVybiB0aGlzLl9nZXREZXNjcmlwdG9yKCk7XG5cdFx0XHRpZiAocHJvcCA9PT0gXCJ0aGVuXCIgfHwgcHJvcCA9PT0gXCJjYXRjaFwiIHx8IHByb3AgPT09IFwiZmluYWxseVwiKSByZXR1cm4gdm9pZCAwO1xuXHRcdFx0aWYgKHR5cGVvZiBwcm9wID09PSBcInN5bWJvbFwiKSByZXR1cm4gdm9pZCAwO1xuXHRcdFx0aWYgKHByb3AgPT09IFwiJHBhdGhcIikgcmV0dXJuIHRoaXMuX2NvbmZpZy5iYXNlUGF0aDtcblx0XHRcdGlmIChwcm9wID09PSBcIiRjaGFubmVsXCIpIHJldHVybiB0aGlzLl9jb25maWcuY2hhbm5lbDtcblx0XHRcdGlmIChwcm9wID09PSBcIiRkZXNjcmlwdG9yXCIpIHJldHVybiB0aGlzLl9nZXREZXNjcmlwdG9yKCk7XG5cdFx0XHRpZiAocHJvcCA9PT0gXCIkaW52b2tlXCIpIHJldHVybiB0aGlzLl9pbnZva2VyO1xuXHRcdFx0Y29uc3QgY2hpbGRQYXRoID0gWy4uLnRoaXMuX2NvbmZpZy5iYXNlUGF0aCwgcHJvcFN0cl07XG5cdFx0XHRpZiAodGhpcy5fY29uZmlnLmNhY2hlICYmIHRoaXMuX2NoaWxkQ2FjaGUuaGFzKHByb3BTdHIpKSByZXR1cm4gdGhpcy5fY2hpbGRDYWNoZS5nZXQocHJvcFN0cik7XG5cdFx0XHRjb25zdCBjaGlsZFByb3h5ID0gY3JlYXRlUmVtb3RlUHJveHkodGhpcy5faW52b2tlciwge1xuXHRcdFx0XHQuLi50aGlzLl9jb25maWcsXG5cdFx0XHRcdGJhc2VQYXRoOiBjaGlsZFBhdGhcblx0XHRcdH0pO1xuXHRcdFx0aWYgKHRoaXMuX2NvbmZpZy5jYWNoZSkgdGhpcy5fY2hpbGRDYWNoZS5zZXQocHJvcFN0ciwgY2hpbGRQcm94eSk7XG5cdFx0XHRyZXR1cm4gY2hpbGRQcm94eTtcblx0XHR9XG5cdFx0LyoqIFNldCBwcm9wZXJ0eSAqL1xuXHRcdHNldCh0YXJnZXQsIHByb3AsIHZhbHVlLCByZWNlaXZlcikge1xuXHRcdFx0aWYgKHR5cGVvZiBwcm9wID09PSBcInN5bWJvbFwiKSByZXR1cm4gdHJ1ZTtcblx0XHRcdHRoaXMuX2ludm9rZXIoV1JlZmxlY3RBY3Rpb24uU0VULCBbLi4udGhpcy5fY29uZmlnLmJhc2VQYXRoLCBTdHJpbmcocHJvcCldLCBbdmFsdWVdKTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHQvKiogQXBwbHkgZnVuY3Rpb24gKi9cblx0XHRhcHBseSh0YXJnZXQsIHRoaXNBcmcsIGFyZ3MpIHtcblx0XHRcdHJldHVybiB0aGlzLl9pbnZva2VyKFdSZWZsZWN0QWN0aW9uLkFQUExZLCB0aGlzLl9jb25maWcuYmFzZVBhdGgsIFthcmdzXSk7XG5cdFx0fVxuXHRcdC8qKiBDb25zdHJ1Y3QgbmV3IGluc3RhbmNlICovXG5cdFx0Y29uc3RydWN0KHRhcmdldCwgYXJncywgbmV3VGFyZ2V0KSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5faW52b2tlcihXUmVmbGVjdEFjdGlvbi5DT05TVFJVQ1QsIHRoaXMuX2NvbmZpZy5iYXNlUGF0aCwgW2FyZ3NdKTtcblx0XHR9XG5cdFx0LyoqIENoZWNrIGlmIHByb3BlcnR5IGV4aXN0cyAqL1xuXHRcdGhhcyh0YXJnZXQsIHByb3ApIHtcblx0XHRcdGlmICh0eXBlb2YgcHJvcCA9PT0gXCJzeW1ib2xcIikgcmV0dXJuIGZhbHNlO1xuXHRcdFx0cmV0dXJuIHRoaXMuX2ludm9rZXIoV1JlZmxlY3RBY3Rpb24uSEFTLCB0aGlzLl9jb25maWcuYmFzZVBhdGgsIFtwcm9wXSk7XG5cdFx0fVxuXHRcdC8qKiBEZWxldGUgcHJvcGVydHkgKi9cblx0XHRkZWxldGVQcm9wZXJ0eSh0YXJnZXQsIHByb3ApIHtcblx0XHRcdGlmICh0eXBlb2YgcHJvcCA9PT0gXCJzeW1ib2xcIikgcmV0dXJuIHRydWU7XG5cdFx0XHRyZXR1cm4gdGhpcy5faW52b2tlcihXUmVmbGVjdEFjdGlvbi5ERUxFVEVfUFJPUEVSVFksIFsuLi50aGlzLl9jb25maWcuYmFzZVBhdGgsIFN0cmluZyhwcm9wKV0sIFtdKTtcblx0XHR9XG5cdFx0LyoqIEdldCBvd24ga2V5cyAqL1xuXHRcdG93bktleXModGFyZ2V0KSB7XG5cdFx0XHRyZXR1cm4gW107XG5cdFx0fVxuXHRcdC8qKiBHZXQgcHJvcGVydHkgZGVzY3JpcHRvciAqL1xuXHRcdGdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIHByb3ApIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcblx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHRcdFx0d3JpdGFibGU6IHRydWVcblx0XHRcdH07XG5cdFx0fVxuXHRcdC8qKiBHZXQgcHJvdG90eXBlICovXG5cdFx0Z2V0UHJvdG90eXBlT2YodGFyZ2V0KSB7XG5cdFx0XHRyZXR1cm4gRnVuY3Rpb24ucHJvdG90eXBlO1xuXHRcdH1cblx0XHQvKiogU2V0IHByb3RvdHlwZSAqL1xuXHRcdHNldFByb3RvdHlwZU9mKHRhcmdldCwgcHJvdG8pIHtcblx0XHRcdHJldHVybiB0aGlzLl9pbnZva2VyKFdSZWZsZWN0QWN0aW9uLlNFVF9QUk9UT1RZUEVfT0YsIHRoaXMuX2NvbmZpZy5iYXNlUGF0aCwgW3Byb3RvXSk7XG5cdFx0fVxuXHRcdC8qKiBDaGVjayBpZiBleHRlbnNpYmxlICovXG5cdFx0aXNFeHRlbnNpYmxlKHRhcmdldCkge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdC8qKiBQcmV2ZW50IGV4dGVuc2lvbnMgKi9cblx0XHRwcmV2ZW50RXh0ZW5zaW9ucyh0YXJnZXQpIHtcblx0XHRcdHJldHVybiB0aGlzLl9pbnZva2VyKFdSZWZsZWN0QWN0aW9uLlBSRVZFTlRfRVhURU5TSU9OUywgdGhpcy5fY29uZmlnLmJhc2VQYXRoLCBbXSk7XG5cdFx0fVxuXHRcdC8qKiBHZXQgZGVzY3JpcHRvciBmb3IgdGhpcyBwcm94eSAqL1xuXHRcdF9nZXREZXNjcmlwdG9yKCkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0cGF0aDogdGhpcy5fY29uZmlnLmJhc2VQYXRoLFxuXHRcdFx0XHRjaGFubmVsOiB0aGlzLl9jb25maWcuY2hhbm5lbCxcblx0XHRcdFx0cHJpbWl0aXZlOiBmYWxzZVxuXHRcdFx0fTtcblx0XHR9XG5cdH07XG5cdC8qKlxuXHQqIENyZWF0ZSBhIHJlbW90ZSBwcm94eSBmb3IgdHJhbnNwYXJlbnQgUlBDXG5cdCpcblx0KiBAcGFyYW0gaW52b2tlciAtIEZ1bmN0aW9uIHRvIGludm9rZSByZW1vdGUgb3BlcmF0aW9uc1xuXHQqIEBwYXJhbSBjb25maWcgLSBQcm94eSBjb25maWd1cmF0aW9uXG5cdCogQHJldHVybnMgUHJveHkgb2JqZWN0IHRoYXQgZm9yd2FyZHMgYWxsIG9wZXJhdGlvbnMgdG8gcmVtb3RlXG5cdCpcblx0KiBAZXhhbXBsZVxuXHQqIGNvbnN0IHByb3h5ID0gY3JlYXRlUmVtb3RlUHJveHkoXG5cdCogICAgIChhY3Rpb24sIHBhdGgsIGFyZ3MpID0+IGNoYW5uZWwuaW52b2tlKHRhcmdldENoYW5uZWwsIGFjdGlvbiwgcGF0aCwgYXJncyksXG5cdCogICAgIHsgY2hhbm5lbDogXCJ3b3JrZXJcIiB9XG5cdCogKTtcblx0KlxuXHQqIC8vIEFsbCBvcGVyYXRpb25zIGFyZSBmb3J3YXJkZWRcblx0KiBhd2FpdCBwcm94eS5tYXRoLmFkZCgxLCAyKTtcblx0KiBhd2FpdCBwcm94eS51c2VyLm5hbWU7XG5cdCogcHJveHkuY29uZmlnLmRlYnVnID0gdHJ1ZTtcblx0Ki9cblx0ZnVuY3Rpb24gY3JlYXRlUmVtb3RlUHJveHkoaW52b2tlciwgY29uZmlnKSB7XG5cdFx0Y29uc3QgZm4gPSBmdW5jdGlvbigpIHt9O1xuXHRcdGNvbnN0IGhhbmRsZXIgPSBuZXcgUmVtb3RlUHJveHlIYW5kbGVyKGludm9rZXIsIGNvbmZpZyk7XG5cdFx0cmV0dXJuIG5ldyBQcm94eShmbiwgaGFuZGxlcik7XG5cdH1cblx0LyoqXG5cdCogQ3JlYXRlIHByb3h5IGZyb20gZGVzY3JpcHRvclxuXHQqXG5cdCogV3JhcHMgYSBXUmVmbGVjdERlc2NyaXB0b3IgaW50byBhIHVzYWJsZSBwcm94eSBvYmplY3QuXG5cdCpcblx0KiBAcGFyYW0gZGVzY3JpcHRvciAtIFJlbW90ZSBvYmplY3QgZGVzY3JpcHRvclxuXHQqIEBwYXJhbSBpbnZva2VyIC0gRnVuY3Rpb24gdG8gaW52b2tlIHJlbW90ZSBvcGVyYXRpb25zXG5cdCogQHBhcmFtIHRhcmdldENoYW5uZWwgLSBPdmVycmlkZSBjaGFubmVsIGZyb20gZGVzY3JpcHRvclxuXHQqL1xuXHRmdW5jdGlvbiB3cmFwRGVzY3JpcHRvcihkZXNjcmlwdG9yLCBpbnZva2VyLCB0YXJnZXRDaGFubmVsKSB7XG5cdFx0aWYgKCFkZXNjcmlwdG9yIHx8IHR5cGVvZiBkZXNjcmlwdG9yICE9PSBcIm9iamVjdFwiKSByZXR1cm4gZGVzY3JpcHRvcjtcblx0XHRpZiAoZGVzY3JpcHRvci5wcmltaXRpdmUpIHJldHVybiBkZXNjcmlwdG9yO1xuXHRcdGNvbnN0IGNhY2hlZCA9IGRlc2NNYXAuZ2V0KGRlc2NyaXB0b3IpO1xuXHRcdGlmIChjYWNoZWQpIHJldHVybiBjYWNoZWQ7XG5cdFx0Y29uc3QgcHJveHkgPSBjcmVhdGVSZW1vdGVQcm94eShpbnZva2VyLCB7XG5cdFx0XHRjaGFubmVsOiB0YXJnZXRDaGFubmVsID8/IGRlc2NyaXB0b3IuY2hhbm5lbCA/PyBcInVua25vd25cIixcblx0XHRcdGJhc2VQYXRoOiBkZXNjcmlwdG9yLnBhdGggPz8gW11cblx0XHR9KTtcblx0XHRkZXNjTWFwLnNldChkZXNjcmlwdG9yLCBwcm94eSk7XG5cdFx0d3JhcE1hcC5zZXQocHJveHksIGRlc2NyaXB0b3IpO1xuXHRcdHJldHVybiBwcm94eTtcblx0fVxuXHQvKipcblx0KiBDcmVhdGUgYW4gZXhwb3NlIGhhbmRsZXIgZm9yIGFuIG9iamVjdFxuXHQqXG5cdCogVXNlcyB0aGUgdW5pZmllZCBSZXF1ZXN0SGFuZGxlciBmb3IgY29uc2lzdGVudCBiZWhhdmlvci5cblx0KlxuXHQqIEBwYXJhbSB0YXJnZXQgLSBPYmplY3QgdG8gZXhwb3NlXG5cdCogQHBhcmFtIHJlZmxlY3QgLSBPcHRpb25hbCBjdXN0b20gUmVmbGVjdCBpbXBsZW1lbnRhdGlvblxuXHQqIEByZXR1cm5zIEhhbmRsZXIgZnVuY3Rpb24gZm9yIGluY29taW5nIHJlcXVlc3RzXG5cdCovXG5cdGZ1bmN0aW9uIGNyZWF0ZUV4cG9zZUhhbmRsZXIodGFyZ2V0LCByZWZsZWN0KSB7XG5cdFx0cmV0dXJuIGNyZWF0ZU9iamVjdEhhbmRsZXIodGFyZ2V0LCByZWZsZWN0KTtcblx0fVxuXHQvKipcblx0KiBDcmVhdGUgYSBwcm94eSBmb3IgcmVtb3RlIG9iamVjdCBvdmVyIGEgc2VuZGVyIChNZXNzYWdlUG9ydCwgZXRjLilcblx0KlxuXHQqIEBwYXJhbSBzZW5kZXIgLSBPYmplY3Qgd2l0aCByZXF1ZXN0KCkgbWV0aG9kXG5cdCogQHBhcmFtIGJhc2VQYXRoIC0gQmFzZSBwYXRoIGZvciBwcm9wZXJ0eSBhY2Nlc3Ncblx0Ki9cblx0ZnVuY3Rpb24gY3JlYXRlU2VuZGVyUHJveHkoc2VuZGVyLCBiYXNlUGF0aCA9IFtdKSB7XG5cdFx0Y29uc3QgaW52b2tlciA9IChhY3Rpb24sIHBhdGgsIGFyZ3MpID0+IHtcblx0XHRcdHJldHVybiBzZW5kZXIucmVxdWVzdCh7XG5cdFx0XHRcdGlkOiBVVUlEdjQoKSxcblx0XHRcdFx0Y2hhbm5lbDogc2VuZGVyLmNoYW5uZWxOYW1lLFxuXHRcdFx0XHRzZW5kZXI6IHNlbmRlci5zZW5kZXJJZCA/PyBcInByb3h5XCIsXG5cdFx0XHRcdHR5cGU6IFwicmVxdWVzdFwiLFxuXHRcdFx0XHRwYXlsb2FkOiB7XG5cdFx0XHRcdFx0YWN0aW9uLFxuXHRcdFx0XHRcdHBhdGgsXG5cdFx0XHRcdFx0YXJnc1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9O1xuXHRcdHJldHVybiBjcmVhdGVSZW1vdGVQcm94eShpbnZva2VyLCB7XG5cdFx0XHRjaGFubmVsOiBzZW5kZXIuY2hhbm5lbE5hbWUsXG5cdFx0XHRiYXNlUGF0aFxuXHRcdH0pO1xuXHR9XG5cdC8qKiBAZGVwcmVjYXRlZCBVc2Ugd3JhcERlc2NyaXB0b3IgKi9cblx0Y29uc3QgbWFrZVJlcXVlc3RQcm94eSA9IHdyYXBEZXNjcmlwdG9yO1xuXG4vLyNlbmRyZWdpb25cbi8vI3JlZ2lvbiAuLi91bmlmb3JtLnRzL3NyYy9uZXdlci9uZXh0L2NoYW5uZWwvaW50ZXJuYWwvQ29ubmVjdGlvbk1vZGVsLnRzXG5cdGZ1bmN0aW9uIGNyZWF0ZUNvbm5lY3Rpb25LZXkocGFyYW1zKSB7XG5cdFx0cmV0dXJuIFtcblx0XHRcdHBhcmFtcy5sb2NhbENoYW5uZWwsXG5cdFx0XHRwYXJhbXMucmVtb3RlQ2hhbm5lbCxcblx0XHRcdHBhcmFtcy5zZW5kZXIsXG5cdFx0XHRwYXJhbXMudHJhbnNwb3J0VHlwZSxcblx0XHRcdHBhcmFtcy5kaXJlY3Rpb25cblx0XHRdLmpvaW4oXCI6OlwiKTtcblx0fVxuXHRmdW5jdGlvbiBxdWVyeUNvbm5lY3Rpb25zKGNvbm5lY3Rpb25zLCBxdWVyeSA9IHt9KSB7XG5cdFx0Y29uc3QgaW5jbHVkZUNsb3NlZCA9IHF1ZXJ5LmluY2x1ZGVDbG9zZWQgPz8gZmFsc2U7XG5cdFx0Y29uc3QgZGVzaXJlZFN0YXR1cyA9IHF1ZXJ5LnN0YXR1cyA/PyAoaW5jbHVkZUNsb3NlZCA/IHZvaWQgMCA6IFwiYWN0aXZlXCIpO1xuXHRcdHJldHVybiBbLi4uY29ubmVjdGlvbnNdLmZpbHRlcigoY29ubmVjdGlvbikgPT4ge1xuXHRcdFx0aWYgKGRlc2lyZWRTdGF0dXMgJiYgY29ubmVjdGlvbi5zdGF0dXMgIT09IGRlc2lyZWRTdGF0dXMpIHJldHVybiBmYWxzZTtcblx0XHRcdGlmIChxdWVyeS5jaGFubmVsICYmIGNvbm5lY3Rpb24ubG9jYWxDaGFubmVsICE9PSBxdWVyeS5jaGFubmVsICYmIGNvbm5lY3Rpb24ucmVtb3RlQ2hhbm5lbCAhPT0gcXVlcnkuY2hhbm5lbCkgcmV0dXJuIGZhbHNlO1xuXHRcdFx0aWYgKHF1ZXJ5LmxvY2FsQ2hhbm5lbCAmJiBjb25uZWN0aW9uLmxvY2FsQ2hhbm5lbCAhPT0gcXVlcnkubG9jYWxDaGFubmVsKSByZXR1cm4gZmFsc2U7XG5cdFx0XHRpZiAocXVlcnkucmVtb3RlQ2hhbm5lbCAmJiBjb25uZWN0aW9uLnJlbW90ZUNoYW5uZWwgIT09IHF1ZXJ5LnJlbW90ZUNoYW5uZWwpIHJldHVybiBmYWxzZTtcblx0XHRcdGlmIChxdWVyeS5zZW5kZXIgJiYgY29ubmVjdGlvbi5zZW5kZXIgIT09IHF1ZXJ5LnNlbmRlcikgcmV0dXJuIGZhbHNlO1xuXHRcdFx0aWYgKHF1ZXJ5LnRyYW5zcG9ydFR5cGUgJiYgY29ubmVjdGlvbi50cmFuc3BvcnRUeXBlICE9PSBxdWVyeS50cmFuc3BvcnRUeXBlKSByZXR1cm4gZmFsc2U7XG5cdFx0XHRpZiAocXVlcnkuZGlyZWN0aW9uICYmIGNvbm5lY3Rpb24uZGlyZWN0aW9uICE9PSBxdWVyeS5kaXJlY3Rpb24pIHJldHVybiBmYWxzZTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH0pLnNvcnQoKGEsIGIpID0+IGIudXBkYXRlZEF0IC0gYS51cGRhdGVkQXQpO1xuXHR9XG5cdHZhciBDb25uZWN0aW9uUmVnaXN0cnkgPSBjbGFzcyB7XG5cdFx0X2NyZWF0ZUlkO1xuXHRcdF9lbWl0RXZlbnQ7XG5cdFx0X2Nvbm5lY3Rpb25zID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0XHRjb25zdHJ1Y3RvcihfY3JlYXRlSWQsIF9lbWl0RXZlbnQpIHtcblx0XHRcdHRoaXMuX2NyZWF0ZUlkID0gX2NyZWF0ZUlkO1xuXHRcdFx0dGhpcy5fZW1pdEV2ZW50ID0gX2VtaXRFdmVudDtcblx0XHR9XG5cdFx0cmVnaXN0ZXIocGFyYW1zKSB7XG5cdFx0XHRjb25zdCBrZXkgPSBjcmVhdGVDb25uZWN0aW9uS2V5KHBhcmFtcyk7XG5cdFx0XHRjb25zdCBub3cgPSBEYXRlLm5vdygpO1xuXHRcdFx0Y29uc3QgZXhpc3RpbmcgPSB0aGlzLl9jb25uZWN0aW9ucy5nZXQoa2V5KTtcblx0XHRcdGlmIChleGlzdGluZykge1xuXHRcdFx0XHRleGlzdGluZy51cGRhdGVkQXQgPSBub3c7XG5cdFx0XHRcdGV4aXN0aW5nLnN0YXR1cyA9IFwiYWN0aXZlXCI7XG5cdFx0XHRcdGV4aXN0aW5nLm1ldGFkYXRhID0ge1xuXHRcdFx0XHRcdC4uLmV4aXN0aW5nLm1ldGFkYXRhLFxuXHRcdFx0XHRcdC4uLnBhcmFtcy5tZXRhZGF0YVxuXHRcdFx0XHR9O1xuXHRcdFx0XHRyZXR1cm4gZXhpc3Rpbmc7XG5cdFx0XHR9XG5cdFx0XHRjb25zdCBjb25uZWN0aW9uID0ge1xuXHRcdFx0XHRpZDogdGhpcy5fY3JlYXRlSWQoKSxcblx0XHRcdFx0bG9jYWxDaGFubmVsOiBwYXJhbXMubG9jYWxDaGFubmVsLFxuXHRcdFx0XHRyZW1vdGVDaGFubmVsOiBwYXJhbXMucmVtb3RlQ2hhbm5lbCxcblx0XHRcdFx0c2VuZGVyOiBwYXJhbXMuc2VuZGVyLFxuXHRcdFx0XHR0cmFuc3BvcnRUeXBlOiBwYXJhbXMudHJhbnNwb3J0VHlwZSxcblx0XHRcdFx0ZGlyZWN0aW9uOiBwYXJhbXMuZGlyZWN0aW9uLFxuXHRcdFx0XHRzdGF0dXM6IFwiYWN0aXZlXCIsXG5cdFx0XHRcdGNyZWF0ZWRBdDogbm93LFxuXHRcdFx0XHR1cGRhdGVkQXQ6IG5vdyxcblx0XHRcdFx0bWV0YWRhdGE6IHBhcmFtcy5tZXRhZGF0YVxuXHRcdFx0fTtcblx0XHRcdHRoaXMuX2Nvbm5lY3Rpb25zLnNldChrZXksIGNvbm5lY3Rpb24pO1xuXHRcdFx0dGhpcy5fZW1pdEV2ZW50Py4oe1xuXHRcdFx0XHR0eXBlOiBcImNvbm5lY3RlZFwiLFxuXHRcdFx0XHRjb25uZWN0aW9uLFxuXHRcdFx0XHR0aW1lc3RhbXA6IG5vd1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gY29ubmVjdGlvbjtcblx0XHR9XG5cdFx0bWFya05vdGlmaWVkKGNvbm5lY3Rpb24sIHBheWxvYWQpIHtcblx0XHRcdGNvbnN0IG5vdyA9IERhdGUubm93KCk7XG5cdFx0XHRjb25uZWN0aW9uLmxhc3ROb3RpZnlBdCA9IG5vdztcblx0XHRcdGNvbm5lY3Rpb24udXBkYXRlZEF0ID0gbm93O1xuXHRcdFx0dGhpcy5fZW1pdEV2ZW50Py4oe1xuXHRcdFx0XHR0eXBlOiBcIm5vdGlmaWVkXCIsXG5cdFx0XHRcdGNvbm5lY3Rpb24sXG5cdFx0XHRcdHRpbWVzdGFtcDogbm93LFxuXHRcdFx0XHRwYXlsb2FkXG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0Y2xvc2VCeUNoYW5uZWwoY2hhbm5lbCkge1xuXHRcdFx0Y29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcblx0XHRcdGZvciAoY29uc3QgY29ubmVjdGlvbiBvZiB0aGlzLl9jb25uZWN0aW9ucy52YWx1ZXMoKSkge1xuXHRcdFx0XHRpZiAoY29ubmVjdGlvbi5sb2NhbENoYW5uZWwgIT09IGNoYW5uZWwgJiYgY29ubmVjdGlvbi5yZW1vdGVDaGFubmVsICE9PSBjaGFubmVsKSBjb250aW51ZTtcblx0XHRcdFx0aWYgKGNvbm5lY3Rpb24uc3RhdHVzID09PSBcImNsb3NlZFwiKSBjb250aW51ZTtcblx0XHRcdFx0Y29ubmVjdGlvbi5zdGF0dXMgPSBcImNsb3NlZFwiO1xuXHRcdFx0XHRjb25uZWN0aW9uLnVwZGF0ZWRBdCA9IG5vdztcblx0XHRcdFx0dGhpcy5fZW1pdEV2ZW50Py4oe1xuXHRcdFx0XHRcdHR5cGU6IFwiZGlzY29ubmVjdGVkXCIsXG5cdFx0XHRcdFx0Y29ubmVjdGlvbixcblx0XHRcdFx0XHR0aW1lc3RhbXA6IG5vd1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9XG5cdFx0Y2xvc2VBbGwoKSB7XG5cdFx0XHRjb25zdCBub3cgPSBEYXRlLm5vdygpO1xuXHRcdFx0Zm9yIChjb25zdCBjb25uZWN0aW9uIG9mIHRoaXMuX2Nvbm5lY3Rpb25zLnZhbHVlcygpKSB7XG5cdFx0XHRcdGlmIChjb25uZWN0aW9uLnN0YXR1cyA9PT0gXCJjbG9zZWRcIikgY29udGludWU7XG5cdFx0XHRcdGNvbm5lY3Rpb24uc3RhdHVzID0gXCJjbG9zZWRcIjtcblx0XHRcdFx0Y29ubmVjdGlvbi51cGRhdGVkQXQgPSBub3c7XG5cdFx0XHRcdHRoaXMuX2VtaXRFdmVudD8uKHtcblx0XHRcdFx0XHR0eXBlOiBcImRpc2Nvbm5lY3RlZFwiLFxuXHRcdFx0XHRcdGNvbm5lY3Rpb24sXG5cdFx0XHRcdFx0dGltZXN0YW1wOiBub3dcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHF1ZXJ5KHF1ZXJ5ID0ge30pIHtcblx0XHRcdHJldHVybiBxdWVyeUNvbm5lY3Rpb25zKHRoaXMuX2Nvbm5lY3Rpb25zLnZhbHVlcygpLCBxdWVyeSk7XG5cdFx0fVxuXHRcdHZhbHVlcygpIHtcblx0XHRcdHJldHVybiBbLi4udGhpcy5fY29ubmVjdGlvbnMudmFsdWVzKCldO1xuXHRcdH1cblx0XHRjbGVhcigpIHtcblx0XHRcdHRoaXMuX2Nvbm5lY3Rpb25zLmNsZWFyKCk7XG5cdFx0fVxuXHR9O1xuXG4vLyNlbmRyZWdpb25cbi8vI3JlZ2lvbiAuLi91bmlmb3JtLnRzL3NyYy9uZXdlci9uZXh0L2NoYW5uZWwvVW5pZmllZENoYW5uZWwudHNcbi8qKlxuXHQqIFVuaWZpZWQgQ2hhbm5lbCBTeXN0ZW1cblx0KlxuXHQqIE1lcmdlcyBhbmQgdW5pZmllczpcblx0KiAtIFJlcXVlc3RQcm94eSAocHJveHkgY3JlYXRpb24gYW5kIGRpc3BhdGNoKVxuXHQqIC0gSW52b2tlciAoUmVxdWVzdG9yL1Jlc3BvbmRlciBhYnN0cmFjdGlvbilcblx0KiAtIENoYW5uZWxDb250ZXh0IChtdWx0aS1jaGFubmVsIG1hbmFnZW1lbnQpXG5cdCogLSBPYnNlcnZhYmxlQ2hhbm5lbHMgKE9ic2VydmFibGUtYmFzZWQgbWVzc2FnaW5nKVxuXHQqXG5cdCogU2luZ2xlIGVudHJ5IHBvaW50IGZvciBhbGwgY2hhbm5lbCBjb21tdW5pY2F0aW9uIHBhdHRlcm5zOlxuXHQqIC0gYGNyZWF0ZUNoYW5uZWwoKWAgLSBDcmVhdGUgYSB1bmlmaWVkIGNoYW5uZWxcblx0KiAtIGBjaGFubmVsLmV4cG9zZSgpYCAtIEV4cG9zZSBvYmplY3RzIGZvciByZW1vdGUgaW52b2NhdGlvblxuXHQqIC0gYGNoYW5uZWwuaW1wb3J0KClgIC0gSW1wb3J0IHJlbW90ZSBtb2R1bGVzXG5cdCogLSBgY2hhbm5lbC5wcm94eSgpYCAtIENyZWF0ZSB0cmFuc3BhcmVudCBwcm94eSB0byByZW1vdGVcblx0KiAtIGBjaGFubmVsLmNvbm5lY3QoKWAgLSBDb25uZWN0IHRvIHRyYW5zcG9ydFxuXHQqL1xuXHQvKipcblx0KiBVbmlmaWVkQ2hhbm5lbCAtIFNpbmdsZSBlbnRyeSBwb2ludCBmb3IgYWxsIGNoYW5uZWwgY29tbXVuaWNhdGlvblxuXHQqXG5cdCogQ29tYmluZXM6XG5cdCogLSBSZXF1ZXN0b3IgZnVuY3Rpb25hbGl0eSAoaW52b2tlIHJlbW90ZSBtZXRob2RzKVxuXHQqIC0gUmVzcG9uZGVyIGZ1bmN0aW9uYWxpdHkgKGhhbmRsZSBpbmNvbWluZyByZXF1ZXN0cylcblx0KiAtIFByb3h5IGNyZWF0aW9uICh0cmFuc3BhcmVudCByZW1vdGUgYWNjZXNzKVxuXHQqIC0gT2JzZXJ2YWJsZSBtZXNzYWdpbmcgKHN1YnNjcmliZS9uZXh0IHBhdHRlcm4pXG5cdCogLSBNdWx0aS10cmFuc3BvcnQgc3VwcG9ydCAoV29ya2VyLCBQb3J0LCBCcm9hZGNhc3QsIFdlYlNvY2tldCwgQ2hyb21lKVxuXHQqL1xuXHR2YXIgVW5pZmllZENoYW5uZWwgPSBjbGFzcyB7XG5cdFx0X25hbWU7XG5cdFx0X2NvbnRleHRUeXBlO1xuXHRcdF9jb25maWc7XG5cdFx0X3RyYW5zcG9ydHMgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuXHRcdF9kZWZhdWx0VHJhbnNwb3J0ID0gbnVsbDtcblx0XHRfY29ubmVjdGlvbkV2ZW50cyA9IG5ldyBDaGFubmVsU3ViamVjdCh7IGJ1ZmZlclNpemU6IDIwMCB9KTtcblx0XHRfY29ubmVjdGlvblJlZ2lzdHJ5ID0gbmV3IENvbm5lY3Rpb25SZWdpc3RyeSgoKSA9PiBVVUlEdjQoKSwgKGV2ZW50KSA9PiB0aGlzLl9jb25uZWN0aW9uRXZlbnRzLm5leHQoZXZlbnQpKTtcblx0XHRfcGVuZGluZyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG5cdFx0X3N1YnNjcmlwdGlvbnMgPSBbXTtcblx0XHRfaW5ib3VuZCA9IG5ldyBDaGFubmVsU3ViamVjdCh7IGJ1ZmZlclNpemU6IDEwMCB9KTtcblx0XHRfb3V0Ym91bmQgPSBuZXcgQ2hhbm5lbFN1YmplY3QoeyBidWZmZXJTaXplOiAxMDAgfSk7XG5cdFx0X2ludm9jYXRpb25zID0gbmV3IENoYW5uZWxTdWJqZWN0KHsgYnVmZmVyU2l6ZTogMTAwIH0pO1xuXHRcdF9yZXNwb25zZXMgPSBuZXcgQ2hhbm5lbFN1YmplY3QoeyBidWZmZXJTaXplOiAxMDAgfSk7XG5cdFx0X2V4cG9zZWQgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuXHRcdF9wcm94eUNhY2hlID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG5cdFx0X19nZXRQcml2YXRlKGtleSkge1xuXHRcdFx0cmV0dXJuIHRoaXNba2V5XTtcblx0XHR9XG5cdFx0X19zZXRQcml2YXRlKGtleSwgdmFsdWUpIHtcblx0XHRcdHRoaXNba2V5XSA9IHZhbHVlO1xuXHRcdH1cblx0XHRjb25zdHJ1Y3Rvcihjb25maWcpIHtcblx0XHRcdGNvbnN0IGNmZyA9IHR5cGVvZiBjb25maWcgPT09IFwic3RyaW5nXCIgPyB7IG5hbWU6IGNvbmZpZyB9IDogY29uZmlnO1xuXHRcdFx0dGhpcy5fbmFtZSA9IGNmZy5uYW1lO1xuXHRcdFx0dGhpcy5fY29udGV4dFR5cGUgPSBjZmcuYXV0b0RldGVjdCAhPT0gZmFsc2UgPyBkZXRlY3RDb250ZXh0VHlwZSgpIDogXCJ1bmtub3duXCI7XG5cdFx0XHR0aGlzLl9jb25maWcgPSB7XG5cdFx0XHRcdG5hbWU6IGNmZy5uYW1lLFxuXHRcdFx0XHRhdXRvRGV0ZWN0OiBjZmcuYXV0b0RldGVjdCA/PyB0cnVlLFxuXHRcdFx0XHR0aW1lb3V0OiBjZmcudGltZW91dCA/PyAzZTQsXG5cdFx0XHRcdHJlZmxlY3Q6IGNmZy5yZWZsZWN0ID8/IERlZmF1bHRSZWZsZWN0LFxuXHRcdFx0XHRidWZmZXJTaXplOiBjZmcuYnVmZmVyU2l6ZSA/PyAxMDAsXG5cdFx0XHRcdGF1dG9MaXN0ZW46IGNmZy5hdXRvTGlzdGVuID8/IHRydWVcblx0XHRcdH07XG5cdFx0XHRpZiAodGhpcy5fY29uZmlnLmF1dG9MaXN0ZW4gJiYgdGhpcy5faXNXb3JrZXJDb250ZXh0KCkpIHRoaXMubGlzdGVuKHNlbGYpO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIENvbm5lY3QgdG8gYSB0cmFuc3BvcnQgZm9yIHNlbmRpbmcgcmVxdWVzdHNcblx0XHQqXG5cdFx0KiBAcGFyYW0gdGFyZ2V0IC0gV29ya2VyLCBNZXNzYWdlUG9ydCwgQnJvYWRjYXN0Q2hhbm5lbCwgV2ViU29ja2V0LCBvciBzdHJpbmcgaWRlbnRpZmllclxuXHRcdCogQHBhcmFtIG9wdGlvbnMgLSBDb25uZWN0aW9uIG9wdGlvbnNcblx0XHQqL1xuXHRcdGNvbm5lY3QodGFyZ2V0LCBvcHRpb25zID0ge30pIHtcblx0XHRcdGNvbnN0IHRyYW5zcG9ydFR5cGUgPSBkZXRlY3RUcmFuc3BvcnRUeXBlKHRhcmdldCk7XG5cdFx0XHRjb25zdCB0YXJnZXRDaGFubmVsID0gb3B0aW9ucy50YXJnZXRDaGFubmVsID8/IHRoaXMuX2luZmVyVGFyZ2V0Q2hhbm5lbCh0YXJnZXQsIHRyYW5zcG9ydFR5cGUpO1xuXHRcdFx0Y29uc3QgYmluZGluZyA9IHRoaXMuX2NyZWF0ZVRyYW5zcG9ydEJpbmRpbmcodGFyZ2V0LCB0cmFuc3BvcnRUeXBlLCB0YXJnZXRDaGFubmVsLCBvcHRpb25zKTtcblx0XHRcdHRoaXMuX3RyYW5zcG9ydHMuc2V0KHRhcmdldENoYW5uZWwsIGJpbmRpbmcpO1xuXHRcdFx0aWYgKCF0aGlzLl9kZWZhdWx0VHJhbnNwb3J0KSB0aGlzLl9kZWZhdWx0VHJhbnNwb3J0ID0gYmluZGluZztcblx0XHRcdGNvbnN0IGNvbm5lY3Rpb24gPSB0aGlzLl9yZWdpc3RlckNvbm5lY3Rpb24oe1xuXHRcdFx0XHRsb2NhbENoYW5uZWw6IHRoaXMuX25hbWUsXG5cdFx0XHRcdHJlbW90ZUNoYW5uZWw6IHRhcmdldENoYW5uZWwsXG5cdFx0XHRcdHNlbmRlcjogdGhpcy5fbmFtZSxcblx0XHRcdFx0dHJhbnNwb3J0VHlwZSxcblx0XHRcdFx0ZGlyZWN0aW9uOiBcIm91dGdvaW5nXCIsXG5cdFx0XHRcdG1ldGFkYXRhOiB7IHBoYXNlOiBcImNvbm5lY3RcIiB9XG5cdFx0XHR9KTtcblx0XHRcdHRoaXMuX2VtaXRDb25uZWN0aW9uU2lnbmFsKGJpbmRpbmcsIFwiY29ubmVjdFwiLCB7XG5cdFx0XHRcdGNvbm5lY3Rpb25JZDogY29ubmVjdGlvbi5pZCxcblx0XHRcdFx0ZnJvbTogdGhpcy5fbmFtZSxcblx0XHRcdFx0dG86IHRhcmdldENoYW5uZWxcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogTGlzdGVuIG9uIGEgdHJhbnNwb3J0IGZvciBpbmNvbWluZyByZXF1ZXN0c1xuXHRcdCpcblx0XHQqIEBwYXJhbSBzb3VyY2UgLSBUcmFuc3BvcnQgc291cmNlIHRvIGxpc3RlbiBvblxuXHRcdCogQHBhcmFtIG9wdGlvbnMgLSBDb25uZWN0aW9uIG9wdGlvbnNcblx0XHQqL1xuXHRcdGxpc3Rlbihzb3VyY2UsIG9wdGlvbnMgPSB7fSkge1xuXHRcdFx0Y29uc3QgdHJhbnNwb3J0VHlwZSA9IGRldGVjdFRyYW5zcG9ydFR5cGUoc291cmNlKTtcblx0XHRcdGNvbnN0IHNvdXJjZUNoYW5uZWwgPSBvcHRpb25zLnRhcmdldENoYW5uZWwgPz8gdGhpcy5faW5mZXJUYXJnZXRDaGFubmVsKHNvdXJjZSwgdHJhbnNwb3J0VHlwZSk7XG5cdFx0XHRjb25zdCBoYW5kbGVyID0gKGRhdGEpID0+IHRoaXMuX2hhbmRsZUluY29taW5nKGRhdGEpO1xuXHRcdFx0Y29uc3QgY29ubmVjdGlvbiA9IHRoaXMuX3JlZ2lzdGVyQ29ubmVjdGlvbih7XG5cdFx0XHRcdGxvY2FsQ2hhbm5lbDogdGhpcy5fbmFtZSxcblx0XHRcdFx0cmVtb3RlQ2hhbm5lbDogc291cmNlQ2hhbm5lbCxcblx0XHRcdFx0c2VuZGVyOiBzb3VyY2VDaGFubmVsLFxuXHRcdFx0XHR0cmFuc3BvcnRUeXBlLFxuXHRcdFx0XHRkaXJlY3Rpb246IFwiaW5jb21pbmdcIixcblx0XHRcdFx0bWV0YWRhdGE6IHsgcGhhc2U6IFwibGlzdGVuXCIgfVxuXHRcdFx0fSk7XG5cdFx0XHRzd2l0Y2ggKHRyYW5zcG9ydFR5cGUpIHtcblx0XHRcdFx0Y2FzZSBcIndvcmtlclwiOlxuXHRcdFx0XHRjYXNlIFwibWVzc2FnZS1wb3J0XCI6XG5cdFx0XHRcdGNhc2UgXCJicm9hZGNhc3RcIjpcblx0XHRcdFx0XHRpZiAob3B0aW9ucy5hdXRvU3RhcnQgIT09IGZhbHNlICYmIHNvdXJjZS5zdGFydCkgc291cmNlLnN0YXJ0KCk7XG5cdFx0XHRcdFx0c291cmNlLmFkZEV2ZW50TGlzdGVuZXI/LihcIm1lc3NhZ2VcIiwgKChlKSA9PiBoYW5kbGVyKGUuZGF0YSkpKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcIndlYnNvY2tldFwiOlxuXHRcdFx0XHRcdHNvdXJjZS5hZGRFdmVudExpc3RlbmVyPy4oXCJtZXNzYWdlXCIsICgoZSkgPT4ge1xuXHRcdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdFx0aGFuZGxlcihKU09OLnBhcnNlKGUuZGF0YSkpO1xuXHRcdFx0XHRcdFx0fSBjYXRjaCB7fVxuXHRcdFx0XHRcdH0pKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcImNocm9tZS1ydW50aW1lXCI6XG5cdFx0XHRcdFx0Y2hyb21lLnJ1bnRpbWUub25NZXNzYWdlPy5hZGRMaXN0ZW5lcj8uKChtc2csIHNlbmRlciwgc2VuZFJlc3BvbnNlKSA9PiB7XG5cdFx0XHRcdFx0XHRoYW5kbGVyKG1zZyk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcImNocm9tZS10YWJzXCI6XG5cdFx0XHRcdFx0Y2hyb21lLnJ1bnRpbWUub25NZXNzYWdlPy5hZGRMaXN0ZW5lcj8uKChtc2csIHNlbmRlcikgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMudGFiSWQgIT0gbnVsbCAmJiBzZW5kZXI/LnRhYj8uaWQgIT09IG9wdGlvbnMudGFiSWQpIHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHRcdGhhbmRsZXIobXNnKTtcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwiY2hyb21lLXBvcnRcIjpcblx0XHRcdFx0XHRzb3VyY2U/Lm9uTWVzc2FnZT8uYWRkTGlzdGVuZXI/LigobXNnKSA9PiB7XG5cdFx0XHRcdFx0XHRoYW5kbGVyKG1zZyk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJjaHJvbWUtZXh0ZXJuYWxcIjpcblx0XHRcdFx0XHRjaHJvbWUucnVudGltZS5vbk1lc3NhZ2VFeHRlcm5hbD8uYWRkTGlzdGVuZXI/LigobXNnKSA9PiB7XG5cdFx0XHRcdFx0XHRoYW5kbGVyKG1zZyk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcInNlbGZcIjpcblx0XHRcdFx0XHRhZGRFdmVudExpc3RlbmVyPy4oXCJtZXNzYWdlXCIsICgoZSkgPT4gaGFuZGxlcihlLmRhdGEpKSk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGRlZmF1bHQ6IGlmIChvcHRpb25zLm9uTWVzc2FnZSkgb3B0aW9ucy5vbk1lc3NhZ2UoaGFuZGxlcik7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLl9zZW5kU2lnbmFsVG9UYXJnZXQoc291cmNlLCB0cmFuc3BvcnRUeXBlLCB7XG5cdFx0XHRcdGNvbm5lY3Rpb25JZDogY29ubmVjdGlvbi5pZCxcblx0XHRcdFx0ZnJvbTogdGhpcy5fbmFtZSxcblx0XHRcdFx0dG86IHNvdXJjZUNoYW5uZWwsXG5cdFx0XHRcdHRhYklkOiBvcHRpb25zLnRhYklkLFxuXHRcdFx0XHRleHRlcm5hbElkOiBvcHRpb25zLmV4dGVybmFsSWRcblx0XHRcdH0sIFwibm90aWZ5XCIpO1xuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogQ29ubmVjdCBhbmQgbGlzdGVuIG9uIHRoZSBzYW1lIHRyYW5zcG9ydCAoYmlkaXJlY3Rpb25hbClcblx0XHQqL1xuXHRcdGF0dGFjaCh0YXJnZXQsIG9wdGlvbnMgPSB7fSkge1xuXHRcdFx0cmV0dXJuIHRoaXMuY29ubmVjdCh0YXJnZXQsIG9wdGlvbnMpO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIEV4cG9zZSBhbiBvYmplY3QgZm9yIHJlbW90ZSBpbnZvY2F0aW9uXG5cdFx0KlxuXHRcdCogQHBhcmFtIG5hbWUgLSBQYXRoIG5hbWUgZm9yIHRoZSBleHBvc2VkIG9iamVjdFxuXHRcdCogQHBhcmFtIG9iaiAtIE9iamVjdCB0byBleHBvc2Vcblx0XHQqL1xuXHRcdGV4cG9zZShuYW1lLCBvYmopIHtcblx0XHRcdGNvbnN0IHBhdGggPSBbbmFtZV07XG5cdFx0XHR3cml0ZUJ5UGF0aChwYXRoLCBvYmopO1xuXHRcdFx0dGhpcy5fZXhwb3NlZC5zZXQobmFtZSwge1xuXHRcdFx0XHRuYW1lLFxuXHRcdFx0XHRvYmosXG5cdFx0XHRcdHBhdGhcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogRXhwb3NlIG11bHRpcGxlIG9iamVjdHMgYXQgb25jZVxuXHRcdCovXG5cdFx0ZXhwb3NlQWxsKGVudHJpZXMpIHtcblx0XHRcdGZvciAoY29uc3QgW25hbWUsIG9ial0gb2YgT2JqZWN0LmVudHJpZXMoZW50cmllcykpIHRoaXMuZXhwb3NlKG5hbWUsIG9iaik7XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBJbXBvcnQgYSBtb2R1bGUgZnJvbSBhIHJlbW90ZSBjaGFubmVsXG5cdFx0KlxuXHRcdCogQHBhcmFtIHVybCAtIE1vZHVsZSBVUkwgdG8gaW1wb3J0XG5cdFx0KiBAcGFyYW0gdGFyZ2V0Q2hhbm5lbCAtIFRhcmdldCBjaGFubmVsIChkZWZhdWx0cyB0byBmaXJzdCBjb25uZWN0ZWQpXG5cdFx0Ki9cblx0XHRhc3luYyBpbXBvcnQodXJsLCB0YXJnZXRDaGFubmVsKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5pbnZva2UodGFyZ2V0Q2hhbm5lbCA/PyB0aGlzLl9nZXREZWZhdWx0VGFyZ2V0KCksIFdSZWZsZWN0QWN0aW9uLklNUE9SVCwgW10sIFt1cmxdKTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBJbnZva2UgYSBtZXRob2Qgb24gYSByZW1vdGUgb2JqZWN0XG5cdFx0KlxuXHRcdCogQHBhcmFtIHRhcmdldENoYW5uZWwgLSBUYXJnZXQgY2hhbm5lbCBuYW1lXG5cdFx0KiBAcGFyYW0gYWN0aW9uIC0gUmVmbGVjdCBhY3Rpb25cblx0XHQqIEBwYXJhbSBwYXRoIC0gT2JqZWN0IHBhdGhcblx0XHQqIEBwYXJhbSBhcmdzIC0gQXJndW1lbnRzXG5cdFx0Ki9cblx0XHRpbnZva2UodGFyZ2V0Q2hhbm5lbCwgYWN0aW9uLCBwYXRoLCBhcmdzID0gW10pIHtcblx0XHRcdGNvbnN0IGlkID0gVVVJRHY0KCk7XG5cdFx0XHRjb25zdCByZXNvbHZlcnMgPSBQcm9taXNlLndpdGhSZXNvbHZlcnMoKTtcblx0XHRcdHRoaXMuX3BlbmRpbmcuc2V0KGlkLCByZXNvbHZlcnMpO1xuXHRcdFx0Y29uc3QgdGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRpZiAodGhpcy5fcGVuZGluZy5oYXMoaWQpKSB7XG5cdFx0XHRcdFx0dGhpcy5fcGVuZGluZy5kZWxldGUoaWQpO1xuXHRcdFx0XHRcdHJlc29sdmVycy5yZWplY3QoLyogQF9fUFVSRV9fICovIG5ldyBFcnJvcihgUmVxdWVzdCB0aW1lb3V0OiAke2FjdGlvbn0gb24gJHtwYXRoLmpvaW4oXCIuXCIpfWApKTtcblx0XHRcdFx0fVxuXHRcdFx0fSwgdGhpcy5fY29uZmlnLnRpbWVvdXQpO1xuXHRcdFx0Y29uc3QgbWVzc2FnZSA9IHtcblx0XHRcdFx0aWQsXG5cdFx0XHRcdGNoYW5uZWw6IHRhcmdldENoYW5uZWwsXG5cdFx0XHRcdHNlbmRlcjogdGhpcy5fbmFtZSxcblx0XHRcdFx0dHlwZTogXCJyZXF1ZXN0XCIsXG5cdFx0XHRcdHBheWxvYWQ6IHtcblx0XHRcdFx0XHRjaGFubmVsOiB0YXJnZXRDaGFubmVsLFxuXHRcdFx0XHRcdHNlbmRlcjogdGhpcy5fbmFtZSxcblx0XHRcdFx0XHRhY3Rpb24sXG5cdFx0XHRcdFx0cGF0aCxcblx0XHRcdFx0XHRhcmdzXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHRpbWVzdGFtcDogRGF0ZS5ub3coKVxuXHRcdFx0fTtcblx0XHRcdHRoaXMuX3NlbmQodGFyZ2V0Q2hhbm5lbCwgbWVzc2FnZSk7XG5cdFx0XHR0aGlzLl9vdXRib3VuZC5uZXh0KG1lc3NhZ2UpO1xuXHRcdFx0cmV0dXJuIHJlc29sdmVycy5wcm9taXNlLmZpbmFsbHkoKCkgPT4gY2xlYXJUaW1lb3V0KHRpbWVvdXQpKTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBHZXQgcHJvcGVydHkgZnJvbSByZW1vdGUgb2JqZWN0XG5cdFx0Ki9cblx0XHRnZXQodGFyZ2V0Q2hhbm5lbCwgcGF0aCwgcHJvcCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuaW52b2tlKHRhcmdldENoYW5uZWwsIFdSZWZsZWN0QWN0aW9uLkdFVCwgcGF0aCwgW3Byb3BdKTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBTZXQgcHJvcGVydHkgb24gcmVtb3RlIG9iamVjdFxuXHRcdCovXG5cdFx0c2V0KHRhcmdldENoYW5uZWwsIHBhdGgsIHByb3AsIHZhbHVlKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5pbnZva2UodGFyZ2V0Q2hhbm5lbCwgV1JlZmxlY3RBY3Rpb24uU0VULCBwYXRoLCBbcHJvcCwgdmFsdWVdKTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBDYWxsIG1ldGhvZCBvbiByZW1vdGUgb2JqZWN0XG5cdFx0Ki9cblx0XHRjYWxsKHRhcmdldENoYW5uZWwsIHBhdGgsIGFyZ3MgPSBbXSkge1xuXHRcdFx0cmV0dXJuIHRoaXMuaW52b2tlKHRhcmdldENoYW5uZWwsIFdSZWZsZWN0QWN0aW9uLkFQUExZLCBwYXRoLCBbYXJnc10pO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIENvbnN0cnVjdCBuZXcgaW5zdGFuY2Ugb24gcmVtb3RlXG5cdFx0Ki9cblx0XHRjb25zdHJ1Y3QodGFyZ2V0Q2hhbm5lbCwgcGF0aCwgYXJncyA9IFtdKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5pbnZva2UodGFyZ2V0Q2hhbm5lbCwgV1JlZmxlY3RBY3Rpb24uQ09OU1RSVUNULCBwYXRoLCBbYXJnc10pO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIENyZWF0ZSBhIHRyYW5zcGFyZW50IHByb3h5IHRvIGEgcmVtb3RlIGNoYW5uZWxcblx0XHQqXG5cdFx0KiBBbGwgb3BlcmF0aW9ucyBvbiB0aGUgcHJveHkgYXJlIGZvcndhcmRlZCB0byB0aGUgcmVtb3RlLlxuXHRcdCpcblx0XHQqIEBwYXJhbSB0YXJnZXRDaGFubmVsIC0gVGFyZ2V0IGNoYW5uZWwgbmFtZVxuXHRcdCogQHBhcmFtIGJhc2VQYXRoIC0gQmFzZSBwYXRoIGZvciB0aGUgcHJveHlcblx0XHQqL1xuXHRcdHByb3h5KHRhcmdldENoYW5uZWwsIGJhc2VQYXRoID0gW10pIHtcblx0XHRcdGNvbnN0IHRhcmdldCA9IHRhcmdldENoYW5uZWwgPz8gdGhpcy5fZ2V0RGVmYXVsdFRhcmdldCgpO1xuXHRcdFx0cmV0dXJuIHRoaXMuX2NyZWF0ZVByb3h5KHRhcmdldCwgYmFzZVBhdGgpO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIENyZWF0ZSBwcm94eSBmb3IgYSBzcGVjaWZpYyBleHBvc2VkIG1vZHVsZSBvbiByZW1vdGVcblx0XHQqXG5cdFx0KiBAcGFyYW0gbW9kdWxlTmFtZSAtIE5hbWUgb2YgdGhlIGV4cG9zZWQgbW9kdWxlXG5cdFx0KiBAcGFyYW0gdGFyZ2V0Q2hhbm5lbCAtIFRhcmdldCBjaGFubmVsXG5cdFx0Ki9cblx0XHRyZW1vdGUobW9kdWxlTmFtZSwgdGFyZ2V0Q2hhbm5lbCkge1xuXHRcdFx0cmV0dXJuIHRoaXMucHJveHkodGFyZ2V0Q2hhbm5lbCwgW21vZHVsZU5hbWVdKTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBXcmFwIGEgZGVzY3JpcHRvciBhcyBhIHByb3h5XG5cdFx0Ki9cblx0XHR3cmFwRGVzY3JpcHRvcihkZXNjcmlwdG9yLCB0YXJnZXRDaGFubmVsKSB7XG5cdFx0XHRjb25zdCBpbnZva2VyID0gKGFjdGlvbiwgcGF0aCwgYXJncykgPT4ge1xuXHRcdFx0XHRjb25zdCBjaGFubmVsID0gdGFyZ2V0Q2hhbm5lbCA/PyBkZXNjcmlwdG9yPy5jaGFubmVsID8/IHRoaXMuX2dldERlZmF1bHRUYXJnZXQoKTtcblx0XHRcdFx0cmV0dXJuIHRoaXMuaW52b2tlKGNoYW5uZWwsIGFjdGlvbiwgcGF0aCwgYXJncyk7XG5cdFx0XHR9O1xuXHRcdFx0cmV0dXJuIHdyYXBEZXNjcmlwdG9yKGRlc2NyaXB0b3IsIGludm9rZXIsIHRhcmdldENoYW5uZWwgPz8gZGVzY3JpcHRvcj8uY2hhbm5lbCA/PyB0aGlzLl9nZXREZWZhdWx0VGFyZ2V0KCkpO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIFN1YnNjcmliZSB0byBpbmNvbWluZyBtZXNzYWdlc1xuXHRcdCovXG5cdFx0c3Vic2NyaWJlKGhhbmRsZXIpIHtcblx0XHRcdHJldHVybiB0aGlzLl9pbmJvdW5kLnN1YnNjcmliZShoYW5kbGVyKTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBTZW5kIGEgbWVzc2FnZSAoZmlyZS1hbmQtZm9yZ2V0KVxuXHRcdCovXG5cdFx0bmV4dChtZXNzYWdlKSB7XG5cdFx0XHR0aGlzLl9zZW5kKG1lc3NhZ2UuY2hhbm5lbCwgbWVzc2FnZSk7XG5cdFx0XHR0aGlzLl9vdXRib3VuZC5uZXh0KG1lc3NhZ2UpO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIEVtaXQgYW4gZXZlbnQgdG8gYSBjaGFubmVsXG5cdFx0Ki9cblx0XHRlbWl0KHRhcmdldENoYW5uZWwsIGV2ZW50VHlwZSwgZGF0YSkge1xuXHRcdFx0Y29uc3QgbWVzc2FnZSA9IHtcblx0XHRcdFx0aWQ6IFVVSUR2NCgpLFxuXHRcdFx0XHRjaGFubmVsOiB0YXJnZXRDaGFubmVsLFxuXHRcdFx0XHRzZW5kZXI6IHRoaXMuX25hbWUsXG5cdFx0XHRcdHR5cGU6IFwiZXZlbnRcIixcblx0XHRcdFx0cGF5bG9hZDoge1xuXHRcdFx0XHRcdHR5cGU6IGV2ZW50VHlwZSxcblx0XHRcdFx0XHRkYXRhXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHRpbWVzdGFtcDogRGF0ZS5ub3coKVxuXHRcdFx0fTtcblx0XHRcdHRoaXMubmV4dChtZXNzYWdlKTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBFbWl0IGNvbm5lY3Rpb24tbGV2ZWwgc2lnbmFsIHRvIGEgc3BlY2lmaWMgY29ubmVjdGVkIGNoYW5uZWwuXG5cdFx0KiBUaGlzIGlzIHRoZSBjYW5vbmljYWwgbm90aWZ5L2Nvbm5lY3QgQVBJIGZvciBmYWNhZGUgbGF5ZXJzLlxuXHRcdCovXG5cdFx0bm90aWZ5KHRhcmdldENoYW5uZWwsIHBheWxvYWQgPSB7fSwgdHlwZSA9IFwibm90aWZ5XCIpIHtcblx0XHRcdGNvbnN0IGJpbmRpbmcgPSB0aGlzLl90cmFuc3BvcnRzLmdldCh0YXJnZXRDaGFubmVsKTtcblx0XHRcdGlmICghYmluZGluZykgcmV0dXJuIGZhbHNlO1xuXHRcdFx0dGhpcy5fZW1pdENvbm5lY3Rpb25TaWduYWwoYmluZGluZywgdHlwZSwge1xuXHRcdFx0XHRmcm9tOiB0aGlzLl9uYW1lLFxuXHRcdFx0XHR0bzogdGFyZ2V0Q2hhbm5lbCxcblx0XHRcdFx0Li4ucGF5bG9hZFxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0LyoqIE9ic2VydmFibGU6IEluY29taW5nIG1lc3NhZ2VzICovXG5cdFx0Z2V0IG9uTWVzc2FnZSgpIHtcblx0XHRcdHJldHVybiB0aGlzLl9pbmJvdW5kO1xuXHRcdH1cblx0XHQvKiogT2JzZXJ2YWJsZTogT3V0Z29pbmcgbWVzc2FnZXMgKi9cblx0XHRnZXQgb25PdXRib3VuZCgpIHtcblx0XHRcdHJldHVybiB0aGlzLl9vdXRib3VuZDtcblx0XHR9XG5cdFx0LyoqIE9ic2VydmFibGU6IEluY29taW5nIGludm9jYXRpb25zICovXG5cdFx0Z2V0IG9uSW52b2NhdGlvbigpIHtcblx0XHRcdHJldHVybiB0aGlzLl9pbnZvY2F0aW9ucztcblx0XHR9XG5cdFx0LyoqIE9ic2VydmFibGU6IE91dGdvaW5nIHJlc3BvbnNlcyAqL1xuXHRcdGdldCBvblJlc3BvbnNlKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX3Jlc3BvbnNlcztcblx0XHR9XG5cdFx0LyoqIE9ic2VydmFibGU6IENvbm5lY3Rpb24gZXZlbnRzIChjb25uZWN0ZWQvbm90aWZpZWQvZGlzY29ubmVjdGVkKSAqL1xuXHRcdGdldCBvbkNvbm5lY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY29ubmVjdGlvbkV2ZW50cztcblx0XHR9XG5cdFx0c3Vic2NyaWJlQ29ubmVjdGlvbnMoaGFuZGxlcikge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2Nvbm5lY3Rpb25FdmVudHMuc3Vic2NyaWJlKGhhbmRsZXIpO1xuXHRcdH1cblx0XHRxdWVyeUNvbm5lY3Rpb25zKHF1ZXJ5ID0ge30pIHtcblx0XHRcdHJldHVybiB0aGlzLl9jb25uZWN0aW9uUmVnaXN0cnkucXVlcnkocXVlcnkpO1xuXHRcdH1cblx0XHRub3RpZnlDb25uZWN0aW9ucyhwYXlsb2FkID0ge30sIHF1ZXJ5ID0ge30pIHtcblx0XHRcdGxldCBzZW50ID0gMDtcblx0XHRcdGNvbnN0IHRhcmdldHMgPSB0aGlzLnF1ZXJ5Q29ubmVjdGlvbnMoe1xuXHRcdFx0XHQuLi5xdWVyeSxcblx0XHRcdFx0c3RhdHVzOiBcImFjdGl2ZVwiLFxuXHRcdFx0XHRpbmNsdWRlQ2xvc2VkOiBmYWxzZVxuXHRcdFx0fSk7XG5cdFx0XHRmb3IgKGNvbnN0IGNvbm5lY3Rpb24gb2YgdGFyZ2V0cykge1xuXHRcdFx0XHRjb25zdCBiaW5kaW5nID0gdGhpcy5fdHJhbnNwb3J0cy5nZXQoY29ubmVjdGlvbi5yZW1vdGVDaGFubmVsKTtcblx0XHRcdFx0aWYgKCFiaW5kaW5nKSBjb250aW51ZTtcblx0XHRcdFx0dGhpcy5fZW1pdENvbm5lY3Rpb25TaWduYWwoYmluZGluZywgXCJub3RpZnlcIiwge1xuXHRcdFx0XHRcdGNvbm5lY3Rpb25JZDogY29ubmVjdGlvbi5pZCxcblx0XHRcdFx0XHRmcm9tOiB0aGlzLl9uYW1lLFxuXHRcdFx0XHRcdHRvOiBjb25uZWN0aW9uLnJlbW90ZUNoYW5uZWwsXG5cdFx0XHRcdFx0Li4ucGF5bG9hZFxuXHRcdFx0XHR9KTtcblx0XHRcdFx0c2VudCsrO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHNlbnQ7XG5cdFx0fVxuXHRcdC8qKiBDaGFubmVsIG5hbWUgKi9cblx0XHRnZXQgbmFtZSgpIHtcblx0XHRcdHJldHVybiB0aGlzLl9uYW1lO1xuXHRcdH1cblx0XHQvKiogRGV0ZWN0ZWQgY29udGV4dCB0eXBlICovXG5cdFx0Z2V0IGNvbnRleHRUeXBlKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2NvbnRleHRUeXBlO1xuXHRcdH1cblx0XHQvKiogQ29uZmlndXJhdGlvbiAqL1xuXHRcdGdldCBjb25maWcoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY29uZmlnO1xuXHRcdH1cblx0XHQvKiogQ29ubmVjdGVkIHRyYW5zcG9ydCBuYW1lcyAqL1xuXHRcdGdldCBjb25uZWN0ZWRDaGFubmVscygpIHtcblx0XHRcdHJldHVybiBbLi4udGhpcy5fdHJhbnNwb3J0cy5rZXlzKCldO1xuXHRcdH1cblx0XHQvKiogRXhwb3NlZCBtb2R1bGUgbmFtZXMgKi9cblx0XHRnZXQgZXhwb3NlZE1vZHVsZXMoKSB7XG5cdFx0XHRyZXR1cm4gWy4uLnRoaXMuX2V4cG9zZWQua2V5cygpXTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBDbG9zZSBhbGwgY29ubmVjdGlvbnMgYW5kIGNsZWFudXBcblx0XHQqL1xuXHRcdGNsb3NlKCkge1xuXHRcdFx0dGhpcy5fc3Vic2NyaXB0aW9ucy5mb3JFYWNoKChzKSA9PiBzLnVuc3Vic2NyaWJlKCkpO1xuXHRcdFx0dGhpcy5fc3Vic2NyaXB0aW9ucyA9IFtdO1xuXHRcdFx0dGhpcy5fcGVuZGluZy5jbGVhcigpO1xuXHRcdFx0dGhpcy5fbWFya0FsbENvbm5lY3Rpb25zQ2xvc2VkKCk7XG5cdFx0XHRmb3IgKGNvbnN0IGJpbmRpbmcgb2YgdGhpcy5fdHJhbnNwb3J0cy52YWx1ZXMoKSkge1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdGJpbmRpbmcuY2xlYW51cD8uKCk7XG5cdFx0XHRcdH0gY2F0Y2gge31cblx0XHRcdFx0aWYgKGJpbmRpbmcudHJhbnNwb3J0VHlwZSA9PT0gXCJtZXNzYWdlLXBvcnRcIiB8fCBiaW5kaW5nLnRyYW5zcG9ydFR5cGUgPT09IFwiYnJvYWRjYXN0XCIpIHRyeSB7XG5cdFx0XHRcdFx0YmluZGluZy50YXJnZXQ/LmNsb3NlPy4oKTtcblx0XHRcdFx0fSBjYXRjaCB7fVxuXHRcdFx0fVxuXHRcdFx0dGhpcy5fdHJhbnNwb3J0cy5jbGVhcigpO1xuXHRcdFx0dGhpcy5fZGVmYXVsdFRyYW5zcG9ydCA9IG51bGw7XG5cdFx0XHR0aGlzLl9jb25uZWN0aW9uUmVnaXN0cnkuY2xlYXIoKTtcblx0XHRcdHRoaXMuX2luYm91bmQuY29tcGxldGUoKTtcblx0XHRcdHRoaXMuX291dGJvdW5kLmNvbXBsZXRlKCk7XG5cdFx0XHR0aGlzLl9pbnZvY2F0aW9ucy5jb21wbGV0ZSgpO1xuXHRcdFx0dGhpcy5fcmVzcG9uc2VzLmNvbXBsZXRlKCk7XG5cdFx0XHR0aGlzLl9jb25uZWN0aW9uRXZlbnRzLmNvbXBsZXRlKCk7XG5cdFx0fVxuXHRcdF9oYW5kbGVJbmNvbWluZyhkYXRhKSB7XG5cdFx0XHRpZiAoIWRhdGEgfHwgdHlwZW9mIGRhdGEgIT09IFwib2JqZWN0XCIpIHJldHVybjtcblx0XHRcdHRoaXMuX2luYm91bmQubmV4dChkYXRhKTtcblx0XHRcdHN3aXRjaCAoZGF0YS50eXBlKSB7XG5cdFx0XHRcdGNhc2UgXCJyZXF1ZXN0XCI6XG5cdFx0XHRcdFx0aWYgKGRhdGEuY2hhbm5lbCA9PT0gdGhpcy5fbmFtZSkgdGhpcy5faGFuZGxlUmVxdWVzdChkYXRhKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcInJlc3BvbnNlXCI6XG5cdFx0XHRcdFx0dGhpcy5faGFuZGxlUmVzcG9uc2UoZGF0YSk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJldmVudFwiOiBicmVhaztcblx0XHRcdFx0Y2FzZSBcInNpZ25hbFwiOiB0aGlzLl9oYW5kbGVTaWduYWwoZGF0YSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdF9oYW5kbGVSZXNwb25zZShkYXRhKSB7XG5cdFx0XHRjb25zdCBpZCA9IGRhdGEucmVxSWQgPz8gZGF0YS5pZDtcblx0XHRcdGNvbnN0IHJlc29sdmVycyA9IHRoaXMuX3BlbmRpbmcuZ2V0KGlkKTtcblx0XHRcdGlmIChyZXNvbHZlcnMpIHtcblx0XHRcdFx0dGhpcy5fcGVuZGluZy5kZWxldGUoaWQpO1xuXHRcdFx0XHRpZiAoZGF0YS5wYXlsb2FkPy5lcnJvcikgcmVzb2x2ZXJzLnJlamVjdChuZXcgRXJyb3IoZGF0YS5wYXlsb2FkLmVycm9yKSk7XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdGNvbnN0IHJlc3VsdCA9IGRhdGEucGF5bG9hZD8ucmVzdWx0O1xuXHRcdFx0XHRcdGNvbnN0IGRlc2NyaXB0b3IgPSBkYXRhLnBheWxvYWQ/LmRlc2NyaXB0b3I7XG5cdFx0XHRcdFx0aWYgKHJlc3VsdCAhPT0gbnVsbCAmJiByZXN1bHQgIT09IHZvaWQgMCkgcmVzb2x2ZXJzLnJlc29sdmUocmVzdWx0KTtcblx0XHRcdFx0XHRlbHNlIGlmIChkZXNjcmlwdG9yKSByZXNvbHZlcnMucmVzb2x2ZSh0aGlzLndyYXBEZXNjcmlwdG9yKGRlc2NyaXB0b3IsIGRhdGEuc2VuZGVyKSk7XG5cdFx0XHRcdFx0ZWxzZSByZXNvbHZlcnMucmVzb2x2ZSh2b2lkIDApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuX3Jlc3BvbnNlcy5uZXh0KHtcblx0XHRcdFx0XHRpZCxcblx0XHRcdFx0XHRjaGFubmVsOiBkYXRhLmNoYW5uZWwsXG5cdFx0XHRcdFx0c2VuZGVyOiBkYXRhLnNlbmRlcixcblx0XHRcdFx0XHRyZXN1bHQ6IGRhdGEucGF5bG9hZD8ucmVzdWx0LFxuXHRcdFx0XHRcdGRlc2NyaXB0b3I6IGRhdGEucGF5bG9hZD8uZGVzY3JpcHRvcixcblx0XHRcdFx0XHR0aW1lc3RhbXA6IERhdGUubm93KClcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGFzeW5jIF9oYW5kbGVSZXF1ZXN0KGRhdGEpIHtcblx0XHRcdGNvbnN0IHBheWxvYWQgPSBkYXRhLnBheWxvYWQ7XG5cdFx0XHRpZiAoIXBheWxvYWQpIHJldHVybjtcblx0XHRcdGNvbnN0IHsgYWN0aW9uLCBwYXRoLCBhcmdzLCBzZW5kZXIgfSA9IHBheWxvYWQ7XG5cdFx0XHRjb25zdCByZXFJZCA9IGRhdGEucmVxSWQgPz8gZGF0YS5pZDtcblx0XHRcdHRoaXMuX2ludm9jYXRpb25zLm5leHQoe1xuXHRcdFx0XHRpZDogcmVxSWQsXG5cdFx0XHRcdGNoYW5uZWw6IHRoaXMuX25hbWUsXG5cdFx0XHRcdHNlbmRlcixcblx0XHRcdFx0YWN0aW9uLFxuXHRcdFx0XHRwYXRoLFxuXHRcdFx0XHRhcmdzOiBhcmdzID8/IFtdLFxuXHRcdFx0XHR0aW1lc3RhbXA6IERhdGUubm93KCksXG5cdFx0XHRcdGNvbnRleHRUeXBlOiBkZXRlY3RJbmNvbWluZ0NvbnRleHRUeXBlKGRhdGEpXG5cdFx0XHR9KTtcblx0XHRcdGNvbnN0IHsgcmVzdWx0LCB0b1RyYW5zZmVyLCBuZXdQYXRoIH0gPSBhd2FpdCB0aGlzLl9leGVjdXRlQWN0aW9uKGFjdGlvbiwgcGF0aCwgYXJncyA/PyBbXSwgc2VuZGVyKTtcblx0XHRcdGF3YWl0IHRoaXMuX3NlbmRSZXNwb25zZShyZXFJZCwgYWN0aW9uLCBzZW5kZXIsIG5ld1BhdGgsIHJlc3VsdCwgdG9UcmFuc2Zlcik7XG5cdFx0fVxuXHRcdGFzeW5jIF9leGVjdXRlQWN0aW9uKGFjdGlvbiwgcGF0aCwgYXJncywgc2VuZGVyKSB7XG5cdFx0XHRjb25zdCB7IHJlc3VsdCwgdG9UcmFuc2ZlciwgcGF0aDogbmV3UGF0aCB9ID0gZXhlY3V0ZUFjdGlvbihhY3Rpb24sIHBhdGgsIGFyZ3MsIHtcblx0XHRcdFx0Y2hhbm5lbDogdGhpcy5fbmFtZSxcblx0XHRcdFx0c2VuZGVyLFxuXHRcdFx0XHRyZWZsZWN0OiB0aGlzLl9jb25maWcucmVmbGVjdFxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRyZXN1bHQ6IGF3YWl0IHJlc3VsdCxcblx0XHRcdFx0dG9UcmFuc2Zlcixcblx0XHRcdFx0bmV3UGF0aFxuXHRcdFx0fTtcblx0XHR9XG5cdFx0YXN5bmMgX3NlbmRSZXNwb25zZShyZXFJZCwgYWN0aW9uLCBzZW5kZXIsIHBhdGgsIHJhd1Jlc3VsdCwgdG9UcmFuc2Zlcikge1xuXHRcdFx0Y29uc3QgeyByZXNwb25zZTogY29yZVJlc3BvbnNlLCB0cmFuc2ZlciB9ID0gYXdhaXQgYnVpbGRSZXNwb25zZShyZXFJZCwgYWN0aW9uLCB0aGlzLl9uYW1lLCBzZW5kZXIsIHBhdGgsIHJhd1Jlc3VsdCwgdG9UcmFuc2Zlcik7XG5cdFx0XHRjb25zdCByZXNwb25zZSA9IHtcblx0XHRcdFx0aWQ6IHJlcUlkLFxuXHRcdFx0XHQuLi5jb3JlUmVzcG9uc2UsXG5cdFx0XHRcdHRpbWVzdGFtcDogRGF0ZS5ub3coKSxcblx0XHRcdFx0dHJhbnNmZXJhYmxlOiB0cmFuc2ZlclxuXHRcdFx0fTtcblx0XHRcdHRoaXMuX3NlbmQoc2VuZGVyLCByZXNwb25zZSwgdHJhbnNmZXIpO1xuXHRcdH1cblx0XHRfaGFuZGxlU2lnbmFsKGRhdGEpIHtcblx0XHRcdGNvbnN0IHBheWxvYWQgPSBkYXRhPy5wYXlsb2FkID8/IHt9O1xuXHRcdFx0Y29uc3QgcmVtb3RlQ2hhbm5lbCA9IHBheWxvYWQuZnJvbSA/PyBkYXRhLnNlbmRlciA/PyBcInVua25vd25cIjtcblx0XHRcdGNvbnN0IHRyYW5zcG9ydFR5cGUgPSBkYXRhLnRyYW5zcG9ydFR5cGUgPz8gdGhpcy5fdHJhbnNwb3J0cy5nZXQoZGF0YS5jaGFubmVsKT8udHJhbnNwb3J0VHlwZSA/PyBcImludGVybmFsXCI7XG5cdFx0XHRjb25zdCBjb25uZWN0aW9uID0gdGhpcy5fcmVnaXN0ZXJDb25uZWN0aW9uKHtcblx0XHRcdFx0bG9jYWxDaGFubmVsOiB0aGlzLl9uYW1lLFxuXHRcdFx0XHRyZW1vdGVDaGFubmVsLFxuXHRcdFx0XHRzZW5kZXI6IGRhdGEuc2VuZGVyID8/IHJlbW90ZUNoYW5uZWwsXG5cdFx0XHRcdHRyYW5zcG9ydFR5cGUsXG5cdFx0XHRcdGRpcmVjdGlvbjogXCJpbmNvbWluZ1wiXG5cdFx0XHR9KTtcblx0XHRcdHRoaXMuX21hcmtDb25uZWN0aW9uTm90aWZpZWQoY29ubmVjdGlvbiwgcGF5bG9hZCk7XG5cdFx0fVxuXHRcdF9yZWdpc3RlckNvbm5lY3Rpb24ocGFyYW1zKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY29ubmVjdGlvblJlZ2lzdHJ5LnJlZ2lzdGVyKHBhcmFtcyk7XG5cdFx0fVxuXHRcdF9tYXJrQ29ubmVjdGlvbk5vdGlmaWVkKGNvbm5lY3Rpb24sIHBheWxvYWQpIHtcblx0XHRcdHRoaXMuX2Nvbm5lY3Rpb25SZWdpc3RyeS5tYXJrTm90aWZpZWQoY29ubmVjdGlvbiwgcGF5bG9hZCk7XG5cdFx0fVxuXHRcdF9lbWl0Q29ubmVjdGlvblNpZ25hbChiaW5kaW5nLCBzaWduYWxUeXBlLCBwYXlsb2FkID0ge30pIHtcblx0XHRcdGNvbnN0IG1lc3NhZ2UgPSB7XG5cdFx0XHRcdGlkOiBVVUlEdjQoKSxcblx0XHRcdFx0dHlwZTogXCJzaWduYWxcIixcblx0XHRcdFx0Y2hhbm5lbDogYmluZGluZy50YXJnZXRDaGFubmVsLFxuXHRcdFx0XHRzZW5kZXI6IHRoaXMuX25hbWUsXG5cdFx0XHRcdHRyYW5zcG9ydFR5cGU6IGJpbmRpbmcudHJhbnNwb3J0VHlwZSxcblx0XHRcdFx0cGF5bG9hZDoge1xuXHRcdFx0XHRcdHR5cGU6IHNpZ25hbFR5cGUsXG5cdFx0XHRcdFx0ZnJvbTogdGhpcy5fbmFtZSxcblx0XHRcdFx0XHR0bzogYmluZGluZy50YXJnZXRDaGFubmVsLFxuXHRcdFx0XHRcdC4uLnBheWxvYWRcblx0XHRcdFx0fSxcblx0XHRcdFx0dGltZXN0YW1wOiBEYXRlLm5vdygpXG5cdFx0XHR9O1xuXHRcdFx0KGJpbmRpbmc/LnNlbmRlciA/PyBiaW5kaW5nPy5wb3N0TWVzc2FnZSk/LmNhbGwoYmluZGluZywgbWVzc2FnZSk7XG5cdFx0XHRjb25zdCBjb25uZWN0aW9uID0gdGhpcy5fcmVnaXN0ZXJDb25uZWN0aW9uKHtcblx0XHRcdFx0bG9jYWxDaGFubmVsOiB0aGlzLl9uYW1lLFxuXHRcdFx0XHRyZW1vdGVDaGFubmVsOiBiaW5kaW5nLnRhcmdldENoYW5uZWwsXG5cdFx0XHRcdHNlbmRlcjogdGhpcy5fbmFtZSxcblx0XHRcdFx0dHJhbnNwb3J0VHlwZTogYmluZGluZy50cmFuc3BvcnRUeXBlLFxuXHRcdFx0XHRkaXJlY3Rpb246IFwib3V0Z29pbmdcIlxuXHRcdFx0fSk7XG5cdFx0XHR0aGlzLl9tYXJrQ29ubmVjdGlvbk5vdGlmaWVkKGNvbm5lY3Rpb24sIG1lc3NhZ2UucGF5bG9hZCk7XG5cdFx0fVxuXHRcdF9zZW5kU2lnbmFsVG9UYXJnZXQodGFyZ2V0LCB0cmFuc3BvcnRUeXBlLCBwYXlsb2FkLCBzaWduYWxUeXBlKSB7XG5cdFx0XHRjb25zdCBtZXNzYWdlID0ge1xuXHRcdFx0XHRpZDogVVVJRHY0KCksXG5cdFx0XHRcdHR5cGU6IFwic2lnbmFsXCIsXG5cdFx0XHRcdGNoYW5uZWw6IHBheWxvYWQudG8gPz8gdGhpcy5fbmFtZSxcblx0XHRcdFx0c2VuZGVyOiB0aGlzLl9uYW1lLFxuXHRcdFx0XHR0cmFuc3BvcnRUeXBlLFxuXHRcdFx0XHRwYXlsb2FkOiB7XG5cdFx0XHRcdFx0dHlwZTogc2lnbmFsVHlwZSxcblx0XHRcdFx0XHQuLi5wYXlsb2FkXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHRpbWVzdGFtcDogRGF0ZS5ub3coKVxuXHRcdFx0fTtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdGlmICh0cmFuc3BvcnRUeXBlID09PSBcIndlYnNvY2tldFwiKSB7XG5cdFx0XHRcdFx0dGFyZ2V0Py5zZW5kPy4oSlNPTi5zdHJpbmdpZnkobWVzc2FnZSkpO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodHJhbnNwb3J0VHlwZSA9PT0gXCJjaHJvbWUtcnVudGltZVwiKSB7XG5cdFx0XHRcdFx0Y2hyb21lLnJ1bnRpbWU/LnNlbmRNZXNzYWdlPy4obWVzc2FnZSk7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh0cmFuc3BvcnRUeXBlID09PSBcImNocm9tZS10YWJzXCIpIHtcblx0XHRcdFx0XHRjb25zdCB0YWJJZCA9IHBheWxvYWQudGFiSWQ7XG5cdFx0XHRcdFx0aWYgKHRhYklkICE9IG51bGwpIGNocm9tZS50YWJzPy5zZW5kTWVzc2FnZT8uKHRhYklkLCBtZXNzYWdlKTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHRyYW5zcG9ydFR5cGUgPT09IFwiY2hyb21lLXBvcnRcIikge1xuXHRcdFx0XHRcdHRhcmdldD8ucG9zdE1lc3NhZ2U/LihtZXNzYWdlKTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHRyYW5zcG9ydFR5cGUgPT09IFwiY2hyb21lLWV4dGVybmFsXCIpIHtcblx0XHRcdFx0XHRpZiAocGF5bG9hZC5leHRlcm5hbElkKSBjaHJvbWUucnVudGltZT8uc2VuZE1lc3NhZ2U/LihwYXlsb2FkLmV4dGVybmFsSWQsIG1lc3NhZ2UpO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHR0YXJnZXQ/LnBvc3RNZXNzYWdlPy4obWVzc2FnZSwgeyB0cmFuc2ZlcjogW10gfSk7XG5cdFx0XHR9IGNhdGNoIHt9XG5cdFx0fVxuXHRcdF9tYXJrQWxsQ29ubmVjdGlvbnNDbG9zZWQoKSB7XG5cdFx0XHR0aGlzLl9jb25uZWN0aW9uUmVnaXN0cnkuY2xvc2VBbGwoKTtcblx0XHR9XG5cdFx0X2NyZWF0ZVRyYW5zcG9ydEJpbmRpbmcodGFyZ2V0LCB0cmFuc3BvcnRUeXBlLCB0YXJnZXRDaGFubmVsLCBvcHRpb25zKSB7XG5cdFx0XHRsZXQgc2VuZGVyO1xuXHRcdFx0bGV0IGNsZWFudXA7XG5cdFx0XHRzd2l0Y2ggKHRyYW5zcG9ydFR5cGUpIHtcblx0XHRcdFx0Y2FzZSBcIndvcmtlclwiOlxuXHRcdFx0XHRjYXNlIFwibWVzc2FnZS1wb3J0XCI6XG5cdFx0XHRcdGNhc2UgXCJicm9hZGNhc3RcIjpcblx0XHRcdFx0XHRpZiAob3B0aW9ucy5hdXRvU3RhcnQgIT09IGZhbHNlICYmIHRhcmdldC5zdGFydCkgdGFyZ2V0LnN0YXJ0KCk7XG5cdFx0XHRcdFx0c2VuZGVyID0gKG1zZywgdHJhbnNmZXIpID0+IHRhcmdldC5wb3N0TWVzc2FnZShtc2csIHsgdHJhbnNmZXIgfSk7XG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0Y29uc3QgbGlzdGVuZXIgPSAoKGUpID0+IHRoaXMuX2hhbmRsZUluY29taW5nKGUuZGF0YSkpO1xuXHRcdFx0XHRcdFx0dGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXI/LihcIm1lc3NhZ2VcIiwgbGlzdGVuZXIpO1xuXHRcdFx0XHRcdFx0Y2xlYW51cCA9ICgpID0+IHRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyPy4oXCJtZXNzYWdlXCIsIGxpc3RlbmVyKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJ3ZWJzb2NrZXRcIjpcblx0XHRcdFx0XHRzZW5kZXIgPSAobXNnKSA9PiB0YXJnZXQuc2VuZChKU09OLnN0cmluZ2lmeShtc2cpKTtcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRjb25zdCBsaXN0ZW5lciA9ICgoZSkgPT4ge1xuXHRcdFx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuX2hhbmRsZUluY29taW5nKEpTT04ucGFyc2UoZS5kYXRhKSk7XG5cdFx0XHRcdFx0XHRcdH0gY2F0Y2gge31cblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0dGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXI/LihcIm1lc3NhZ2VcIiwgbGlzdGVuZXIpO1xuXHRcdFx0XHRcdFx0Y2xlYW51cCA9ICgpID0+IHRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyPy4oXCJtZXNzYWdlXCIsIGxpc3RlbmVyKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJjaHJvbWUtcnVudGltZVwiOlxuXHRcdFx0XHRcdHNlbmRlciA9IChtc2cpID0+IGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKG1zZyk7XG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0Y29uc3QgbGlzdGVuZXIgPSAobXNnKSA9PiB0aGlzLl9oYW5kbGVJbmNvbWluZyhtc2cpO1xuXHRcdFx0XHRcdFx0Y2hyb21lLnJ1bnRpbWUub25NZXNzYWdlPy5hZGRMaXN0ZW5lcj8uKGxpc3RlbmVyKTtcblx0XHRcdFx0XHRcdGNsZWFudXAgPSAoKSA9PiBjaHJvbWUucnVudGltZS5vbk1lc3NhZ2U/LnJlbW92ZUxpc3RlbmVyPy4obGlzdGVuZXIpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcImNocm9tZS10YWJzXCI6XG5cdFx0XHRcdFx0c2VuZGVyID0gKG1zZykgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMudGFiSWQgIT0gbnVsbCkgY2hyb21lLnRhYnM/LnNlbmRNZXNzYWdlPy4ob3B0aW9ucy50YWJJZCwgbXNnKTtcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGNvbnN0IGxpc3RlbmVyID0gKG1zZywgc2VuZGVyTWV0YSkgPT4ge1xuXHRcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy50YWJJZCAhPSBudWxsICYmIHNlbmRlck1ldGE/LnRhYj8uaWQgIT09IG9wdGlvbnMudGFiSWQpIHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHRcdFx0dGhpcy5faGFuZGxlSW5jb21pbmcobXNnKTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0Y2hyb21lLnJ1bnRpbWUub25NZXNzYWdlPy5hZGRMaXN0ZW5lcj8uKGxpc3RlbmVyKTtcblx0XHRcdFx0XHRcdGNsZWFudXAgPSAoKSA9PiBjaHJvbWUucnVudGltZS5vbk1lc3NhZ2U/LnJlbW92ZUxpc3RlbmVyPy4obGlzdGVuZXIpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcImNocm9tZS1wb3J0XCI6XG5cdFx0XHRcdFx0aWYgKHRhcmdldD8ucG9zdE1lc3NhZ2UgJiYgdGFyZ2V0Py5vbk1lc3NhZ2U/LmFkZExpc3RlbmVyKSB7XG5cdFx0XHRcdFx0XHRzZW5kZXIgPSAobXNnKSA9PiB0YXJnZXQucG9zdE1lc3NhZ2UobXNnKTtcblx0XHRcdFx0XHRcdGNvbnN0IGxpc3RlbmVyID0gKG1zZykgPT4gdGhpcy5faGFuZGxlSW5jb21pbmcobXNnKTtcblx0XHRcdFx0XHRcdHRhcmdldC5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIobGlzdGVuZXIpO1xuXHRcdFx0XHRcdFx0Y2xlYW51cCA9ICgpID0+IHtcblx0XHRcdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdFx0XHR0YXJnZXQub25NZXNzYWdlLnJlbW92ZUxpc3RlbmVyKGxpc3RlbmVyKTtcblx0XHRcdFx0XHRcdFx0fSBjYXRjaCB7fVxuXHRcdFx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0XHRcdHRhcmdldC5kaXNjb25uZWN0Py4oKTtcblx0XHRcdFx0XHRcdFx0fSBjYXRjaCB7fVxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Y29uc3QgcG9ydE5hbWUgPSBvcHRpb25zLnBvcnROYW1lID8/IHRhcmdldENoYW5uZWw7XG5cdFx0XHRcdFx0XHRjb25zdCBwb3J0ID0gb3B0aW9ucy50YWJJZCAhPSBudWxsICYmIGNocm9tZS50YWJzPy5jb25uZWN0ID8gY2hyb21lLnRhYnMuY29ubmVjdChvcHRpb25zLnRhYklkLCB7IG5hbWU6IHBvcnROYW1lIH0pIDogY2hyb21lLnJ1bnRpbWUuY29ubmVjdCh7IG5hbWU6IHBvcnROYW1lIH0pO1xuXHRcdFx0XHRcdFx0c2VuZGVyID0gKG1zZykgPT4gcG9ydC5wb3N0TWVzc2FnZShtc2cpO1xuXHRcdFx0XHRcdFx0Y29uc3QgbGlzdGVuZXIgPSAobXNnKSA9PiB0aGlzLl9oYW5kbGVJbmNvbWluZyhtc2cpO1xuXHRcdFx0XHRcdFx0cG9ydC5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIobGlzdGVuZXIpO1xuXHRcdFx0XHRcdFx0Y2xlYW51cCA9ICgpID0+IHtcblx0XHRcdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdFx0XHRwb3J0Lm9uTWVzc2FnZS5yZW1vdmVMaXN0ZW5lcihsaXN0ZW5lcik7XG5cdFx0XHRcdFx0XHRcdH0gY2F0Y2gge31cblx0XHRcdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdFx0XHRwb3J0LmRpc2Nvbm5lY3QoKTtcblx0XHRcdFx0XHRcdFx0fSBjYXRjaCB7fVxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJjaHJvbWUtZXh0ZXJuYWxcIjpcblx0XHRcdFx0XHRzZW5kZXIgPSAobXNnKSA9PiB7XG5cdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5leHRlcm5hbElkKSBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZShvcHRpb25zLmV4dGVybmFsSWQsIG1zZyk7XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRjb25zdCBsaXN0ZW5lciA9IChtc2cpID0+IHtcblx0XHRcdFx0XHRcdFx0dGhpcy5faGFuZGxlSW5jb21pbmcobXNnKTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0Y2hyb21lLnJ1bnRpbWUub25NZXNzYWdlRXh0ZXJuYWw/LmFkZExpc3RlbmVyPy4obGlzdGVuZXIpO1xuXHRcdFx0XHRcdFx0Y2xlYW51cCA9ICgpID0+IGNocm9tZS5ydW50aW1lLm9uTWVzc2FnZUV4dGVybmFsPy5yZW1vdmVMaXN0ZW5lcj8uKGxpc3RlbmVyKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJzZWxmXCI6XG5cdFx0XHRcdFx0c2VuZGVyID0gKG1zZywgdHJhbnNmZXIpID0+IGdsb2JhbFRoaXMucG9zdE1lc3NhZ2U/Lihtc2csIHsgdHJhbnNmZXI6IHRyYW5zZmVyID8/IFtdIH0pO1xuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGNvbnN0IGxpc3RlbmVyID0gKChlKSA9PiB0aGlzLl9oYW5kbGVJbmNvbWluZyhlLmRhdGEpKTtcblx0XHRcdFx0XHRcdGdsb2JhbFRoaXMuYWRkRXZlbnRMaXN0ZW5lcj8uKFwibWVzc2FnZVwiLCBsaXN0ZW5lcik7XG5cdFx0XHRcdFx0XHRjbGVhbnVwID0gKCkgPT4gZ2xvYmFsVGhpcy5yZW1vdmVFdmVudExpc3RlbmVyPy4oXCJtZXNzYWdlXCIsIGxpc3RlbmVyKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0aWYgKG9wdGlvbnMub25NZXNzYWdlKSBjbGVhbnVwID0gb3B0aW9ucy5vbk1lc3NhZ2UoKG1zZykgPT4gdGhpcy5faGFuZGxlSW5jb21pbmcobXNnKSk7XG5cdFx0XHRcdFx0c2VuZGVyID0gKG1zZykgPT4gdGFyZ2V0Py5wb3N0TWVzc2FnZT8uKG1zZyk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR0YXJnZXQsXG5cdFx0XHRcdHRhcmdldENoYW5uZWwsXG5cdFx0XHRcdHRyYW5zcG9ydFR5cGUsXG5cdFx0XHRcdHNlbmRlcixcblx0XHRcdFx0Y2xlYW51cCxcblx0XHRcdFx0cG9zdE1lc3NhZ2U6IChtZXNzYWdlLCBvcHRpb25zKSA9PiBzZW5kZXI/LihtZXNzYWdlLCBvcHRpb25zKSxcblx0XHRcdFx0c3RhcnQ6ICgpID0+IHRhcmdldD8uc3RhcnQ/LigpLFxuXHRcdFx0XHRjbG9zZTogKCkgPT4gdGFyZ2V0Py5jbG9zZT8uKClcblx0XHRcdH07XG5cdFx0fVxuXHRcdF9zZW5kKHRhcmdldENoYW5uZWwsIG1lc3NhZ2UsIHRyYW5zZmVyKSB7XG5cdFx0XHRjb25zdCBiaW5kaW5nID0gdGhpcy5fdHJhbnNwb3J0cy5nZXQodGFyZ2V0Q2hhbm5lbCkgPz8gdGhpcy5fZGVmYXVsdFRyYW5zcG9ydDtcblx0XHRcdChiaW5kaW5nPy5zZW5kZXIgPz8gYmluZGluZz8ucG9zdE1lc3NhZ2UpPy5jYWxsKGJpbmRpbmcsIG1lc3NhZ2UsIHRyYW5zZmVyKTtcblx0XHR9XG5cdFx0X2dldERlZmF1bHRUYXJnZXQoKSB7XG5cdFx0XHRpZiAodGhpcy5fZGVmYXVsdFRyYW5zcG9ydCkgcmV0dXJuIHRoaXMuX2RlZmF1bHRUcmFuc3BvcnQudGFyZ2V0Q2hhbm5lbDtcblx0XHRcdHJldHVybiBcIndvcmtlclwiO1xuXHRcdH1cblx0XHRfaW5mZXJUYXJnZXRDaGFubmVsKHRhcmdldCwgdHJhbnNwb3J0VHlwZSkge1xuXHRcdFx0aWYgKHRyYW5zcG9ydFR5cGUgPT09IFwid29ya2VyXCIpIHJldHVybiBcIndvcmtlclwiO1xuXHRcdFx0aWYgKHRyYW5zcG9ydFR5cGUgPT09IFwiYnJvYWRjYXN0XCIgJiYgdGFyZ2V0Lm5hbWUpIHJldHVybiB0YXJnZXQubmFtZTtcblx0XHRcdGlmICh0cmFuc3BvcnRUeXBlID09PSBcInNlbGZcIikgcmV0dXJuIFwic2VsZlwiO1xuXHRcdFx0cmV0dXJuIGAke3RyYW5zcG9ydFR5cGV9LSR7VVVJRHY0KCkuc2xpY2UoMCwgOCl9YDtcblx0XHR9XG5cdFx0X2NyZWF0ZVByb3h5KHRhcmdldENoYW5uZWwsIGJhc2VQYXRoKSB7XG5cdFx0XHRjb25zdCBpbnZva2VyID0gKGFjdGlvbiwgcGF0aCwgYXJncykgPT4ge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5pbnZva2UodGFyZ2V0Q2hhbm5lbCwgYWN0aW9uLCBwYXRoLCBhcmdzKTtcblx0XHRcdH07XG5cdFx0XHRyZXR1cm4gY3JlYXRlUmVtb3RlUHJveHkoaW52b2tlciwge1xuXHRcdFx0XHRjaGFubmVsOiB0YXJnZXRDaGFubmVsLFxuXHRcdFx0XHRiYXNlUGF0aCxcblx0XHRcdFx0Y2FjaGU6IHRydWUsXG5cdFx0XHRcdHRpbWVvdXQ6IHRoaXMuX2NvbmZpZy50aW1lb3V0XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0X2lzV29ya2VyQ29udGV4dCgpIHtcblx0XHRcdHJldHVybiBbXG5cdFx0XHRcdFwid29ya2VyXCIsXG5cdFx0XHRcdFwic2hhcmVkLXdvcmtlclwiLFxuXHRcdFx0XHRcInNlcnZpY2Utd29ya2VyXCJcblx0XHRcdF0uaW5jbHVkZXModGhpcy5fY29udGV4dFR5cGUpO1xuXHRcdH1cblx0fTtcblx0LyoqXG5cdCogQ3JlYXRlIGEgdW5pZmllZCBjaGFubmVsXG5cdCpcblx0KiBAZXhhbXBsZVxuXHQqIC8vIEluIHdvcmtlclxuXHQqIGNvbnN0IGNoYW5uZWwgPSBjcmVhdGVVbmlmaWVkQ2hhbm5lbChcIndvcmtlclwiKTtcblx0KiBjaGFubmVsLmV4cG9zZShcImNhbGNcIiwgeyBhZGQ6IChhLCBiKSA9PiBhICsgYiB9KTtcblx0KlxuXHQqIC8vIEluIGhvc3Rcblx0KiBjb25zdCBjaGFubmVsID0gY3JlYXRlVW5pZmllZENoYW5uZWwoXCJob3N0XCIpO1xuXHQqIGNoYW5uZWwuY29ubmVjdCh3b3JrZXIpO1xuXHQqIGNvbnN0IGNhbGMgPSBjaGFubmVsLnByb3h5KFwid29ya2VyXCIsIFtcImNhbGNcIl0pO1xuXHQqIGF3YWl0IGNhbGMuYWRkKDIsIDMpOyAvLyA1XG5cdCovXG5cdGZ1bmN0aW9uIGNyZWF0ZVVuaWZpZWRDaGFubmVsKGNvbmZpZykge1xuXHRcdHJldHVybiBuZXcgVW5pZmllZENoYW5uZWwoY29uZmlnKTtcblx0fVxuXHRsZXQgV09SS0VSX0NIQU5ORUwgPSBudWxsO1xuXHQvKipcblx0KiBHZXQgdGhlIHdvcmtlcidzIHVuaWZpZWQgY2hhbm5lbCAoYXV0by1jcmVhdGVkIGluIHdvcmtlciBjb250ZXh0KVxuXHQqL1xuXHRmdW5jdGlvbiBnZXRXb3JrZXJDaGFubmVsKCkge1xuXHRcdGlmICghV09SS0VSX0NIQU5ORUwpIHtcblx0XHRcdGNvbnN0IGNvbnRleHRUeXBlID0gZGV0ZWN0Q29udGV4dFR5cGUoKTtcblx0XHRcdGlmIChbXG5cdFx0XHRcdFwid29ya2VyXCIsXG5cdFx0XHRcdFwic2hhcmVkLXdvcmtlclwiLFxuXHRcdFx0XHRcInNlcnZpY2Utd29ya2VyXCJcblx0XHRcdF0uaW5jbHVkZXMoY29udGV4dFR5cGUpKSBXT1JLRVJfQ0hBTk5FTCA9IGNyZWF0ZVVuaWZpZWRDaGFubmVsKHtcblx0XHRcdFx0bmFtZTogXCJ3b3JrZXJcIixcblx0XHRcdFx0YXV0b0xpc3RlbjogdHJ1ZVxuXHRcdFx0fSk7XG5cdFx0XHRlbHNlIFdPUktFUl9DSEFOTkVMID0gY3JlYXRlVW5pZmllZENoYW5uZWwoe1xuXHRcdFx0XHRuYW1lOiBcImhvc3RcIixcblx0XHRcdFx0YXV0b0xpc3RlbjogZmFsc2Vcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRyZXR1cm4gV09SS0VSX0NIQU5ORUw7XG5cdH1cblxuLy8jZW5kcmVnaW9uXG4vLyNyZWdpb24gLi4vdW5pZm9ybS50cy9zcmMvbmV3ZXIvY29yZS9BbGlhcy50c1xuXHRjb25zdCBUUyA9IHtcblx0XHRyamI6IFwicmVqZWN0QnlcIixcblx0XHRydmI6IFwicmVzb2x2ZUJ5XCIsXG5cdFx0cmo6IFwicmVqZWN0XCIsXG5cdFx0cnY6IFwicmVzb2x2ZVwiLFxuXHRcdGNyOiBcImNyZWF0ZVwiLFxuXHRcdGNzOiBcImNyZWF0ZVN5bmNcIixcblx0XHRhOiBcImFycmF5XCIsXG5cdFx0dGE6IFwidHlwZWRhcnJheVwiLFxuXHRcdHVkZjogXCJ1bmRlZmluZWRcIlxuXHR9O1xuXG4vLyNlbmRyZWdpb25cbi8vI3JlZ2lvbiAuLi91bmlmb3JtLnRzL3NyYy9uZXdlci9jb3JlL1VzZWZ1bC50c1xuXHRjb25zdCBUcmFuc2ZlcmFibGUgPSBbXG5cdFx0dHlwZW9mIEFycmF5QnVmZmVyICE9IFRTLnVkZiA/IEFycmF5QnVmZmVyIDogbnVsbCxcblx0XHR0eXBlb2YgTWVzc2FnZVBvcnQgIT0gVFMudWRmID8gTWVzc2FnZVBvcnQgOiBudWxsLFxuXHRcdHR5cGVvZiBSZWFkYWJsZVN0cmVhbSAhPSBUUy51ZGYgPyBSZWFkYWJsZVN0cmVhbSA6IG51bGwsXG5cdFx0dHlwZW9mIFdyaXRhYmxlU3RyZWFtICE9IFRTLnVkZiA/IFdyaXRhYmxlU3RyZWFtIDogbnVsbCxcblx0XHR0eXBlb2YgVHJhbnNmb3JtU3RyZWFtICE9IFRTLnVkZiA/IFRyYW5zZm9ybVN0cmVhbSA6IG51bGwsXG5cdFx0dHlwZW9mIFdlYlRyYW5zcG9ydFJlY2VpdmVTdHJlYW0gIT0gVFMudWRmID8gV2ViVHJhbnNwb3J0UmVjZWl2ZVN0cmVhbSA6IG51bGwsXG5cdFx0dHlwZW9mIFdlYlRyYW5zcG9ydFNlbmRTdHJlYW0gIT0gVFMudWRmID8gV2ViVHJhbnNwb3J0U2VuZFN0cmVhbSA6IG51bGwsXG5cdFx0dHlwZW9mIEF1ZGlvRGF0YSAhPSBUUy51ZGYgPyBBdWRpb0RhdGEgOiBudWxsLFxuXHRcdHR5cGVvZiBJbWFnZUJpdG1hcCAhPSBUUy51ZGYgPyBJbWFnZUJpdG1hcCA6IG51bGwsXG5cdFx0dHlwZW9mIFZpZGVvRnJhbWUgIT0gVFMudWRmID8gVmlkZW9GcmFtZSA6IG51bGwsXG5cdFx0dHlwZW9mIE9mZnNjcmVlbkNhbnZhcyAhPSBUUy51ZGYgPyBPZmZzY3JlZW5DYW52YXMgOiBudWxsLFxuXHRcdHR5cGVvZiBSVENEYXRhQ2hhbm5lbCAhPSBUUy51ZGYgPyBSVENEYXRhQ2hhbm5lbCA6IG51bGxcblx0XS5maWx0ZXIoKEUpID0+IEUgIT0gbnVsbCk7XG5cbi8vI2VuZHJlZ2lvblxuLy8jcmVnaW9uIC4uL3VuaWZvcm0udHMvc3JjL25ld2VyL25leHQvdXRpbHMvRW52LnRzXG4vKipcblx0KiBCYXNlIFVSTCBmb3IgYG5ldyBVUkwod29ya2VyUGF0aCwgYmFzZSlgIHdoZW4gc3Bhd25pbmcgd29ya2VycyBmcm9tIGEgc3RyaW5nIHNwZWNpZmllci5cblx0KlxuXHQqIFByZWZlciBgV29ya2VyR2xvYmFsU2NvcGVgIC8gYHdpbmRvd2AgVVJMcyBzbyB0aGlzIG1vZHVsZSBzdGF5cyAqKmBpbXBvcnQubWV0YWAtZnJlZSoqLlxuXHQqIEluY2x1ZGluZyBgaW1wb3J0Lm1ldGEudXJsYCBhbnl3aGVyZSBpbiB0aGUgdW5pZm9ybSBncmFwaCB0cmlwcyBSb2xsZG93bidzIGBFTVBUWV9JTVBPUlRfTUVUQWBcblx0KiB3aGVuIHRoZSBQV0Egc2VydmljZSB3b3JrZXIgaXMgYnVpbHQgYXMgSUlGRSAoYHZpdGUtcGx1Z2luLXB3YWAgaW5qZWN0TWFuaWZlc3QpLlxuXHQqXG5cdCogRGVkaWNhdGVkIHdvcmtlciB0aHJlYWRzIGV4cG9zZSBgZ2xvYmFsVGhpcy5sb2NhdGlvbmAgYXQgdGhlIHdvcmtlciBzY3JpcHQgVVJMOyBNVjMgU1cgZXhwb3NlcyB0aGVcblx0Ki9cblx0ZnVuY3Rpb24gZ2V0V29ya2VyUmVzb2x2ZUJhc2VVcmwoKSB7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IGhyZWYgPSBnbG9iYWxUaGlzLmxvY2F0aW9uPy5ocmVmO1xuXHRcdFx0aWYgKHR5cGVvZiBocmVmID09PSBcInN0cmluZ1wiICYmIGhyZWYubGVuZ3RoID4gMCkgcmV0dXJuIGhyZWY7XG5cdFx0fSBjYXRjaCB7fVxuXHRcdHRyeSB7XG5cdFx0XHRpZiAodHlwZW9mIGRvY3VtZW50ICE9PSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiBkb2N1bWVudC5iYXNlVVJJID09PSBcInN0cmluZ1wiICYmIGRvY3VtZW50LmJhc2VVUkkubGVuZ3RoID4gMCkgcmV0dXJuIGRvY3VtZW50LmJhc2VVUkk7XG5cdFx0fSBjYXRjaCB7fVxuXHRcdHJldHVybiBcIlwiO1xuXHR9XG5cdC8qKiBSZXNvbHZlZCBhYnNvbHV0ZSBocmVmIGZvciBgLi94YC9gL3hgL2Fic29sdXRlIHdvcmtlciBzcGVjaWZpZXJzIChkZWxlZ2F0ZXMgdHJhaWxpbmcgYC9gIG5vcm1hbGl6YXRpb24gdG8gY2FsbGVycykuICovXG5cdGZ1bmN0aW9uIHJlc29sdmVXb3JrZXJTcGVjaWZpZXJIcmVmKHNwZWMpIHtcblx0XHRjb25zdCBiYXNlID0gZ2V0V29ya2VyUmVzb2x2ZUJhc2VVcmwoKTtcblx0XHRpZiAoIWJhc2UubGVuZ3RoKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiW3VuaWZvcm1dIE5vIGJhc2UgVVJMIGZvciB3b3JrZXIgcmVzb2x1dGlvbiAobWlzc2luZyBsb2NhdGlvbiAvIGRvY3VtZW50LmJhc2VVUkkpXCIpO1xuXHRcdGNvbnN0IG5vcm1hbGl6ZWQgPSBzcGVjLnN0YXJ0c1dpdGgoXCIvXCIpID8gc3BlYy5yZXBsYWNlKC9eXFwvLywgXCIuL1wiKSA6IHNwZWM7XG5cdFx0cmV0dXJuIG5ldyBVUkwobm9ybWFsaXplZCwgYmFzZSkuaHJlZjtcblx0fVxuXG4vLyNlbmRyZWdpb25cbi8vI3JlZ2lvbiAuLi91bmlmb3JtLnRzL3NyYy9uZXdlci9uZXh0L2NoYW5uZWwvQ2hhbm5lbHMudHNcblx0Y29uc3QgU0VMRl9DSEFOTkVMID0ge1xuXHRcdG5hbWU6IFwidW5rbm93blwiLFxuXHRcdGluc3RhbmNlOiBudWxsXG5cdH07XG5cdGNvbnN0IENIQU5ORUxfTUFQID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0Y29uc3QgaXNSZWZsZWN0QWN0aW9uJDEgPSAoYWN0aW9uKSA9PiBbLi4uT2JqZWN0LnZhbHVlcyhXUmVmbGVjdEFjdGlvbildLmluY2x1ZGVzKGFjdGlvbik7XG5cdC8qKiBAZGVwcmVjYXRlZCBVc2UgVW5pZmllZENoYW5uZWwucmVtb3RlKCkgaW5zdGVhZCAqL1xuXHR2YXIgUmVtb3RlQ2hhbm5lbEhlbHBlciQxID0gY2xhc3Mge1xuXHRcdGNoYW5uZWxOYW1lO1xuXHRcdG9wdGlvbnM7XG5cdFx0X2NoYW5uZWw7XG5cdFx0Y29uc3RydWN0b3IoY2hhbm5lbE5hbWUsIG9wdGlvbnMgPSB7fSkge1xuXHRcdFx0dGhpcy5jaGFubmVsTmFtZSA9IGNoYW5uZWxOYW1lO1xuXHRcdFx0dGhpcy5vcHRpb25zID0gb3B0aW9ucztcblx0XHRcdHRoaXMuX2NoYW5uZWwgPSBnZXRXb3JrZXJDaGFubmVsKCk7XG5cdFx0fVxuXHRcdHJlcXVlc3QocGF0aCwgYWN0aW9uLCBhcmdzLCBvcHRpb25zID0ge30pIHtcblx0XHRcdGlmICh0eXBlb2YgcGF0aCA9PT0gXCJzdHJpbmdcIikgcGF0aCA9IFtwYXRoXTtcblx0XHRcdGlmIChBcnJheS5pc0FycmF5KGFjdGlvbikgJiYgaXNSZWZsZWN0QWN0aW9uJDEocGF0aCkpIHtcblx0XHRcdFx0b3B0aW9ucyA9IGFyZ3M7XG5cdFx0XHRcdGFyZ3MgPSBhY3Rpb247XG5cdFx0XHRcdGFjdGlvbiA9IHBhdGg7XG5cdFx0XHRcdHBhdGggPSBbXTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzLl9jaGFubmVsLmludm9rZSh0aGlzLmNoYW5uZWxOYW1lLCBhY3Rpb24sIHBhdGgsIGFyZ3MpO1xuXHRcdH1cblx0XHRkb0ltcG9ydE1vZHVsZSh1cmwsIG9wdGlvbnMpIHtcblx0XHRcdHJldHVybiB0aGlzLl9jaGFubmVsLmltcG9ydCh1cmwsIHRoaXMuY2hhbm5lbE5hbWUpO1xuXHRcdH1cblx0fTtcblx0LyoqIEBkZXByZWNhdGVkIFVzZSBVbmlmaWVkQ2hhbm5lbCBpbnN0ZWFkICovXG5cdHZhciBDaGFubmVsSGFuZGxlciQxID0gY2xhc3Mge1xuXHRcdGNoYW5uZWw7XG5cdFx0b3B0aW9ucztcblx0XHRfdW5pZmllZDtcblx0XHRicm9hZGNhc3RzID0ge307XG5cdFx0Y29uc3RydWN0b3IoY2hhbm5lbCwgb3B0aW9ucyA9IHt9KSB7XG5cdFx0XHR0aGlzLmNoYW5uZWwgPSBjaGFubmVsO1xuXHRcdFx0dGhpcy5vcHRpb25zID0gb3B0aW9ucztcblx0XHRcdHRoaXMuX3VuaWZpZWQgPSBjcmVhdGVVbmlmaWVkQ2hhbm5lbCh7XG5cdFx0XHRcdG5hbWU6IGNoYW5uZWwsXG5cdFx0XHRcdGF1dG9MaXN0ZW46IGZhbHNlXG5cdFx0XHR9KTtcblx0XHRcdFNFTEZfQ0hBTk5FTC5uYW1lID0gY2hhbm5lbDtcblx0XHRcdFNFTEZfQ0hBTk5FTC5pbnN0YW5jZSA9IHRoaXM7XG5cdFx0fVxuXHRcdGNyZWF0ZVJlbW90ZUNoYW5uZWwoY2hhbm5lbCwgb3B0aW9ucyA9IHt9LCBicm9hZGNhc3QpIHtcblx0XHRcdGlmIChicm9hZGNhc3QpIHtcblx0XHRcdFx0dGhpcy5fdW5pZmllZC5hdHRhY2goYnJvYWRjYXN0LCB7IHRhcmdldENoYW5uZWw6IGNoYW5uZWwgfSk7XG5cdFx0XHRcdHRoaXMuYnJvYWRjYXN0c1tjaGFubmVsXSA9IGJyb2FkY2FzdDtcblx0XHRcdH1cblx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUobmV3IFJlbW90ZUNoYW5uZWxIZWxwZXIkMShjaGFubmVsLCBvcHRpb25zKSk7XG5cdFx0fVxuXHRcdGdldENoYW5uZWwoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5jaGFubmVsO1xuXHRcdH1cblx0XHRyZXF1ZXN0KHBhdGgsIGFjdGlvbiwgYXJncywgb3B0aW9ucyA9IHt9LCB0b0NoYW5uZWwgPSBcIndvcmtlclwiKSB7XG5cdFx0XHRpZiAodHlwZW9mIHBhdGggPT09IFwic3RyaW5nXCIpIHBhdGggPSBbcGF0aF07XG5cdFx0XHRpZiAoQXJyYXkuaXNBcnJheShhY3Rpb24pICYmIGlzUmVmbGVjdEFjdGlvbiQxKHBhdGgpKSB7XG5cdFx0XHRcdHRvQ2hhbm5lbCA9IG9wdGlvbnM7XG5cdFx0XHRcdG9wdGlvbnMgPSBhcmdzO1xuXHRcdFx0XHRhcmdzID0gYWN0aW9uO1xuXHRcdFx0XHRhY3Rpb24gPSBwYXRoO1xuXHRcdFx0XHRwYXRoID0gW107XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcy5fdW5pZmllZC5pbnZva2UodG9DaGFubmVsLCBhY3Rpb24sIHBhdGgsIGFyZ3MpO1xuXHRcdH1cblx0XHRyZXNvbHZlUmVzcG9uc2UocmVxSWQsIHJlc3VsdCkge1xuXHRcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZShyZXN1bHQpO1xuXHRcdH1cblx0XHRhc3luYyBoYW5kbGVBbmRSZXNwb25zZShyZXF1ZXN0LCByZXFJZCwgcmVzcG9uc2VGbikge1xuXHRcdFx0Y29uc3QgcmVzdWx0ID0gYXdhaXQgaGFuZGxlUmVxdWVzdChyZXF1ZXN0LCByZXFJZCwgdGhpcy5jaGFubmVsKTtcblx0XHRcdGlmICghcmVzdWx0KSByZXR1cm47XG5cdFx0XHRyZXNwb25zZUZuPy4ocmVzdWx0LnJlc3BvbnNlLCByZXN1bHQudHJhbnNmZXIpO1xuXHRcdH1cblx0XHRjbG9zZSgpIHtcblx0XHRcdHRoaXMuX3VuaWZpZWQuY2xvc2UoKTtcblx0XHR9XG5cdH07XG5cdC8qKiBAZGVwcmVjYXRlZCBVc2UgY3JlYXRlVW5pZmllZENoYW5uZWwgaW5zdGVhZCAqL1xuXHRjb25zdCBpbml0Q2hhbm5lbEhhbmRsZXIgPSAoY2hhbm5lbCA9IFwiJGhvc3QkXCIpID0+IHtcblx0XHRpZiAoU0VMRl9DSEFOTkVMPy5pbnN0YW5jZSAmJiBjaGFubmVsID09PSBcIiRob3N0JFwiKSByZXR1cm4gU0VMRl9DSEFOTkVMLmluc3RhbmNlO1xuXHRcdGlmIChDSEFOTkVMX01BUC5oYXMoY2hhbm5lbCkpIHJldHVybiBDSEFOTkVMX01BUC5nZXQoY2hhbm5lbCkgPz8gbnVsbDtcblx0XHRjb25zdCAkY2hhbm5lbCA9IG5ldyBDaGFubmVsSGFuZGxlciQxKGNoYW5uZWwpO1xuXHRcdGlmIChjaGFubmVsID09PSBcIiRob3N0JFwiKSB7XG5cdFx0XHRTRUxGX0NIQU5ORUwubmFtZSA9IGNoYW5uZWw7XG5cdFx0XHRTRUxGX0NIQU5ORUwuaW5zdGFuY2UgPSAkY2hhbm5lbDtcblx0XHR9XG5cdFx0Q0hBTk5FTF9NQVAuc2V0KGNoYW5uZWwsICRjaGFubmVsKTtcblx0XHRyZXR1cm4gJGNoYW5uZWw7XG5cdH07XG5cbi8vI2VuZHJlZ2lvblxuLy8jcmVnaW9uIC4uL3VuaWZvcm0udHMvc3JjL25ld2VyL25leHQvc3RvcmFnZS9EYXRhQmFzZS50c1xuXHRjb25zdCBoYW5kTWFwID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG5cdGNvbnN0IHdyYXBNYXAgPSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcblx0Y29uc3QgZGVzY01hcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xuXHRjb25zdCBvYmplY3RUb1JlZiA9IChvYmosIGNoYW5uZWwgPSBTRUxGX0NIQU5ORUw/Lm5hbWUsIHRvVHJhbnNmZXIpID0+IHtcblx0XHRpZiAodHlwZW9mIG9iaiA9PSBcIm9iamVjdFwiICYmIG9iaiAhPSBudWxsIHx8IHR5cGVvZiBvYmogPT0gXCJmdW5jdGlvblwiICYmIG9iaiAhPSBudWxsKSB7XG5cdFx0XHRpZiAod3JhcE1hcC5oYXMob2JqKSkgcmV0dXJuIHdyYXBNYXAuZ2V0KG9iaik7XG5cdFx0XHRpZiAoaGFuZE1hcC5oYXMob2JqKSkgcmV0dXJuIGhhbmRNYXAuZ2V0KG9iaik7XG5cdFx0XHRpZiAoaXNOb3RDb21wbGV4QXJyYXkob2JqKSkgcmV0dXJuIG9iajtcblx0XHRcdGlmICh0b1RyYW5zZmVyPy5pbmNsdWRlcz8uKG9iaikpIHJldHVybiBvYmo7XG5cdFx0XHRpZiAoY2hhbm5lbCA9PSBTRUxGX0NIQU5ORUw/Lm5hbWUpIHJldHVybiBvYmo7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHQkaXNEZXNjcmlwdG9yOiB0cnVlLFxuXHRcdFx0XHRwYXRoOiByZWdpc3RlcmVkSW5QYXRoLmdldChvYmopID8/ICgoKSA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgcGF0aCA9IFtVVUlEdjQoKV07XG5cdFx0XHRcdFx0d3JpdGVCeVBhdGgocGF0aCwgb2JqKTtcblx0XHRcdFx0XHRyZXR1cm4gcGF0aDtcblx0XHRcdFx0fSkoKSxcblx0XHRcdFx0b3duZXI6IFNFTEZfQ0hBTk5FTD8ubmFtZSxcblx0XHRcdFx0Y2hhbm5lbCxcblx0XHRcdFx0cHJpbWl0aXZlOiBpc1ByaW1pdGl2ZShvYmopLFxuXHRcdFx0XHR3cml0YWJsZTogdHJ1ZSxcblx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHRcdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxuXHRcdFx0XHRhcmd1bWVudENvdW50OiBvYmogaW5zdGFuY2VvZiBGdW5jdGlvbiA/IG9iai5sZW5ndGggOiAtMVxuXHRcdFx0fTtcblx0XHR9XG5cdFx0cmV0dXJuIGlzQ2FuSnVzdFJldHVybihvYmopID8gb2JqIDogbnVsbDtcblx0fTtcblx0Y29uc3QgJHJlcXVlc3RIYW5kbGVyID0gU3ltYm9sLmZvcihcIkByZXF1ZXN0SGFuZGxlclwiKTtcblx0Y29uc3QgJGRlc2NyaXB0b3IgPSBTeW1ib2wuZm9yKFwiQGRlc2NyaXB0b3JcIik7XG5cdGNvbnN0IG5vcm1hbGl6ZVJlZiA9ICh2KSA9PiB7XG5cdFx0aWYgKGlzQ2FuSnVzdFJldHVybih2KSkgcmV0dXJuIHY7XG5cdFx0aWYgKHY/LlskZGVzY3JpcHRvcl0pIHJldHVybiB2O1xuXHRcdGlmICh2Py4kaXNEZXNjcmlwdG9yKSByZXR1cm4gbWFrZVJlcXVlc3RQcm94eSh2LCBhc3luYyAoKSA9PiB2b2lkIDApO1xuXHRcdGlmIChpc05vdENvbXBsZXhBcnJheSh2KSkgcmV0dXJuIHY7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH07XG5cdGNvbnN0IHN0b3JlZERhdGEgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuXHRjb25zdCByZWdpc3RlcmVkSW5QYXRoID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG5cdGNvbnN0IHRyYXZlcnNlQnlQYXRoID0gKG9iaiwgcGF0aCkgPT4ge1xuXHRcdGlmIChwYXRoICE9IG51bGwgJiYgIUFycmF5LmlzQXJyYXkocGF0aCkpIHBhdGggPSBbcGF0aF07XG5cdFx0aWYgKHBhdGggPT0gbnVsbCB8fCBwYXRoPy5sZW5ndGggPCAxKSByZXR1cm4gb2JqO1xuXHRcdGNvbnN0ICRkZXNjID0gb2JqPy5bJGRlc2NyaXB0b3JdID8/IChvYmo/LiRpc0Rlc2NyaXB0b3IgPyBvYmogOiBudWxsKTtcblx0XHRpZiAoJGRlc2MgJiYgJGRlc2M/Lm93bmVyID09IFNFTEZfQ0hBTk5FTD8ubmFtZSkgb2JqID0gcmVhZEJ5UGF0aCgkZGVzYz8ucGF0aCkgPz8gb2JqO1xuXHRcdGlmIChpc1ByaW1pdGl2ZShvYmopKSByZXR1cm4gb2JqO1xuXHRcdGZvciAoY29uc3Qga2V5IG9mIHBhdGgpIHtcblx0XHRcdG9iaiA9IG9iaj8uW2tleV07XG5cdFx0XHRpZiAob2JqID09IG51bGwpIHJldHVybiBvYmo7XG5cdFx0fVxuXHRcdHJldHVybiBvYmo7XG5cdH07XG5cdGNvbnN0IHJlYWRCeVBhdGggPSAocGF0aCkgPT4ge1xuXHRcdGlmIChwYXRoICE9IG51bGwgJiYgIUFycmF5LmlzQXJyYXkocGF0aCkpIHBhdGggPSBbcGF0aF07XG5cdFx0aWYgKHBhdGggPT0gbnVsbCB8fCBwYXRoPy5sZW5ndGggPCAxKSByZXR1cm4gbnVsbDtcblx0XHRjb25zdCByb290ID0gc3RvcmVkRGF0YT8uZ2V0Py4ocGF0aD8uWzBdKSA/PyBudWxsO1xuXHRcdHJldHVybiByb290ICE9IG51bGwgPyB0cmF2ZXJzZUJ5UGF0aChyb290LCBwYXRoPy5zbGljZT8uKDEpKSA6IG51bGw7XG5cdH07XG5cdGNvbnN0IHdyaXRlQnlQYXRoID0gKHBhdGgsIGRhdGEpID0+IHtcblx0XHRjb25zdCAkZGVzYyA9IGRhdGE/LlskZGVzY3JpcHRvcl0gPz8gKGRhdGE/LiRpc0Rlc2NyaXB0b3IgPyBkYXRhIDogbnVsbCk7XG5cdFx0aWYgKCRkZXNjICYmICRkZXNjPy5vd25lciA9PSBTRUxGX0NIQU5ORUw/Lm5hbWUpIGRhdGEgPSByZWFkQnlQYXRoKCRkZXNjPy5wYXRoKSA/PyBkYXRhO1xuXHRcdGlmIChwYXRoICE9IG51bGwgJiYgIUFycmF5LmlzQXJyYXkocGF0aCkpIHBhdGggPSBbcGF0aF07XG5cdFx0aWYgKHBhdGggPT0gbnVsbCB8fCBwYXRoPy5sZW5ndGggPCAxKSByZXR1cm4gbnVsbDtcblx0XHRjb25zdCByb290ID0gc3RvcmVkRGF0YT8uZ2V0Py4ocGF0aD8uWzBdKSA/PyBudWxsO1xuXHRcdGlmIChwYXRoPy5sZW5ndGggPiAxKSB0cmF2ZXJzZUJ5UGF0aChyb290LCBwYXRoPy5zbGljZT8uKDEsIC0xKSlbcGF0aD8uW3BhdGg/Lmxlbmd0aCAtIDFdXSA9IGRhdGE7XG5cdFx0ZWxzZSBzdG9yZWREYXRhPy5zZXQ/LihwYXRoPy5bMF0sIGRhdGEpO1xuXHRcdGlmICh0eXBlb2YgZGF0YSA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBkYXRhID09IFwiZnVuY3Rpb25cIikgcmVnaXN0ZXJlZEluUGF0aD8uc2V0Py4oZGF0YSwgcGF0aCk7XG5cdFx0cmV0dXJuIGRhdGE7XG5cdH07XG5cdGNvbnN0IHJlbW92ZUJ5UGF0aCA9IChwYXRoKSA9PiB7XG5cdFx0aWYgKHBhdGggIT0gbnVsbCAmJiAhQXJyYXkuaXNBcnJheShwYXRoKSkgcGF0aCA9IFtwYXRoXTtcblx0XHRpZiAocGF0aCA9PSBudWxsIHx8IHBhdGg/Lmxlbmd0aCA8IDEpIHJldHVybiBmYWxzZTtcblx0XHRpZiAoIShzdG9yZWREYXRhPy5nZXQ/LihwYXRoPy5bMF0pID8/IG51bGwpICYmIHBhdGg/Lmxlbmd0aCA8PSAxKSB7XG5cdFx0XHRzdG9yZWREYXRhPy5kZWxldGU/LihwYXRoPy5bMF0pO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fSBlbHNlIHJldHVybiBmYWxzZTtcblx0fTtcblx0Y29uc3QgcmVtb3ZlQnlEYXRhID0gKGRhdGEpID0+IHtcblx0XHRjb25zdCAkZGVzYyA9IGRhdGE/LlskZGVzY3JpcHRvcl0gPz8gKGRhdGE/LiRpc0Rlc2NyaXB0b3IgPyBkYXRhIDogbnVsbCk7XG5cdFx0aWYgKCRkZXNjICYmICRkZXNjPy5vd25lciA9PSBTRUxGX0NIQU5ORUw/Lm5hbWUpIGRhdGEgPSByZWFkQnlQYXRoKCRkZXNjPy5wYXRoKSA/PyBkYXRhO1xuXHRcdGNvbnN0IHBhdGggPSByZWdpc3RlcmVkSW5QYXRoPy5nZXQ/LihkYXRhKSA/PyAkZGVzYz8ucGF0aDtcblx0XHRpZiAocGF0aCA9PSBudWxsIHx8IHBhdGg/Lmxlbmd0aCA8IDEpIHJldHVybiBmYWxzZTtcblx0XHRyZW1vdmVCeVBhdGgocGF0aCk7XG5cdFx0aWYgKHR5cGVvZiBkYXRhID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGRhdGEgPT0gXCJmdW5jdGlvblwiKSByZWdpc3RlcmVkSW5QYXRoPy5kZWxldGU/LihkYXRhKTtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fTtcblx0Y29uc3QgaGFzTm9QYXRoID0gKGRhdGEpID0+IHtcblx0XHRjb25zdCAkZGVzYyA9IGRhdGE/LlskZGVzY3JpcHRvcl0gPz8gKGRhdGE/LiRpc0Rlc2NyaXB0b3IgPyBkYXRhIDogbnVsbCk7XG5cdFx0cmV0dXJuIChyZWdpc3RlcmVkSW5QYXRoPy5nZXQ/LihkYXRhKSA/PyAkZGVzYz8ucGF0aCkgPT0gbnVsbDtcblx0fTtcblxuLy8jZW5kcmVnaW9uXG4vLyNyZWdpb24gLi4vdW5pZm9ybS50cy9zcmMvbmV3ZXIvY29yZS9SZXF1ZXN0SGFuZGxlci50c1xuLyoqXG5cdCogUmVxdWVzdCBIYW5kbGVyIENvcmUgLSBVbmlmaWVkIFJlZmxlY3QgQWN0aW9uIEhhbmRsaW5nXG5cdCpcblx0KiBTaW5nbGUgc291cmNlIG9mIHRydXRoIGZvciBhbGwgYWN0aW9uIGV4ZWN1dGlvbjpcblx0KiAtIFVuaWZpZWRDaGFubmVsLCBDaGFubmVsQ29udGV4dCwgUHJveHkgbW9kdWxlXG5cdCogLSBTdXBwb3J0cyBib3RoIERhdGFCYXNlLWJhY2tlZCBhbmQgZGlyZWN0IG9iamVjdCB0YXJnZXRzXG5cdCogLSBTdXBwb3J0cyBjdXN0b20gUmVmbGVjdCBpbXBsZW1lbnRhdGlvbnNcblx0Ki9cblx0Y29uc3QgaXNPYmplY3QgPSAob2JqKSA9PiAodHlwZW9mIG9iaiA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2Ygb2JqID09PSBcImZ1bmN0aW9uXCIpICYmIG9iaiAhPSBudWxsO1xuXHRjb25zdCBkZWZhdWx0UmVmbGVjdCA9IHtcblx0XHRnZXQ6ICh0LCBwKSA9PiB0Py5bcF0sXG5cdFx0c2V0OiAodCwgcCwgdikgPT4ge1xuXHRcdFx0dFtwXSA9IHY7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9LFxuXHRcdGhhczogKHQsIHApID0+IHAgaW4gdCxcblx0XHRhcHBseTogKHQsIGN0eCwgYXJncykgPT4gdC5hcHBseShjdHgsIGFyZ3MpLFxuXHRcdGNvbnN0cnVjdDogKHQsIGFyZ3MpID0+IG5ldyB0KC4uLmFyZ3MpLFxuXHRcdGRlbGV0ZVByb3BlcnR5OiAodCwgcCkgPT4gZGVsZXRlIHRbcF0sXG5cdFx0b3duS2V5czogKHQpID0+IE9iamVjdC5rZXlzKHQpLFxuXHRcdGdldE93blByb3BlcnR5RGVzY3JpcHRvcjogKHQsIHApID0+IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodCwgcCksXG5cdFx0Z2V0UHJvdG90eXBlT2Y6ICh0KSA9PiBPYmplY3QuZ2V0UHJvdG90eXBlT2YodCksXG5cdFx0c2V0UHJvdG90eXBlT2Y6ICh0LCBwKSA9PiBPYmplY3Quc2V0UHJvdG90eXBlT2YodCwgcCksXG5cdFx0aXNFeHRlbnNpYmxlOiAodCkgPT4gT2JqZWN0LmlzRXh0ZW5zaWJsZSh0KSxcblx0XHRwcmV2ZW50RXh0ZW5zaW9uczogKHQpID0+IE9iamVjdC5wcmV2ZW50RXh0ZW5zaW9ucyh0KVxuXHR9O1xuXHQvKipcblx0KiBFeGVjdXRlIGEgcmVmbGVjdCBhY3Rpb25cblx0KlxuXHQqIFVuaWZpZWQgaW1wbGVtZW50YXRpb24gdXNlZCBieSBhbGwgY2hhbm5lbC9wcm94eSBoYW5kbGVycy5cblx0KiBTdXBwb3J0cyBib3RoIERhdGFCYXNlLWJhY2tlZCBwYXRocyBhbmQgZGlyZWN0IG9iamVjdCB0YXJnZXRzLlxuXHQqXG5cdCogQHBhcmFtIGFjdGlvbiAtIEFjdGlvbiB0byBleGVjdXRlIChXUmVmbGVjdEFjdGlvbiBvciBzdHJpbmcpXG5cdCogQHBhcmFtIHBhdGggLSBPYmplY3QgcGF0aFxuXHQqIEBwYXJhbSBhcmdzIC0gQWN0aW9uIGFyZ3VtZW50c1xuXHQqIEBwYXJhbSBvcHRpb25zIC0gRXhlY3V0aW9uIG9wdGlvbnNcblx0Ki9cblx0ZnVuY3Rpb24gZXhlY3V0ZUFjdGlvbihhY3Rpb24sIHBhdGgsIGFyZ3MsIG9wdGlvbnMgPSB7fSkge1xuXHRcdGNvbnN0IHsgY2hhbm5lbCA9IFwiXCIsIHNlbmRlciA9IFwiXCIsIHJlZmxlY3QgPSBkZWZhdWx0UmVmbGVjdCB9ID0gb3B0aW9ucztcblx0XHRjb25zdCBvYmogPSBvcHRpb25zLnRhcmdldCA/PyByZWFkQnlQYXRoKHBhdGgpO1xuXHRcdGNvbnN0IHRvVHJhbnNmZXIgPSBbXTtcblx0XHRsZXQgcmVzdWx0ID0gbnVsbDtcblx0XHRsZXQgbmV3UGF0aCA9IHBhdGg7XG5cdFx0c3dpdGNoIChTdHJpbmcoYWN0aW9uKS50b0xvd2VyQ2FzZSgpKSB7XG5cdFx0XHRjYXNlIFwiaW1wb3J0XCI6XG5cdFx0XHRjYXNlIFdSZWZsZWN0QWN0aW9uLklNUE9SVDpcblx0XHRcdFx0cmVzdWx0ID0gaW1wb3J0KFxuXHRcdFx0XHRcdC8qIEB2aXRlLWlnbm9yZSAqL1xuXHRcdFx0XHRcdGFyZ3M/LlswXVxuKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwidHJhbnNmZXJcIjpcblx0XHRcdGNhc2UgV1JlZmxlY3RBY3Rpb24uVFJBTlNGRVI6XG5cdFx0XHRcdGlmIChpc0NhblRyYW5zZmVyKG9iaikgJiYgY2hhbm5lbCAhPT0gc2VuZGVyKSB0b1RyYW5zZmVyLnB1c2gob2JqKTtcblx0XHRcdFx0cmVzdWx0ID0gb2JqO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCJnZXRcIjpcblx0XHRcdGNhc2UgV1JlZmxlY3RBY3Rpb24uR0VUOiB7XG5cdFx0XHRcdGNvbnN0IHByb3AgPSBhcmdzPy5bMF07XG5cdFx0XHRcdGNvbnN0IGdvdCA9IHJlZmxlY3QuZ2V0Py4ob2JqLCBwcm9wKSA/PyBvYmo/Lltwcm9wXTtcblx0XHRcdFx0cmVzdWx0ID0gdHlwZW9mIGdvdCA9PT0gXCJmdW5jdGlvblwiICYmIG9iaiAhPSBudWxsID8gZ290LmJpbmQob2JqKSA6IGdvdDtcblx0XHRcdFx0bmV3UGF0aCA9IFsuLi5wYXRoLCBTdHJpbmcocHJvcCldO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHRcdGNhc2UgXCJzZXRcIjpcblx0XHRcdGNhc2UgV1JlZmxlY3RBY3Rpb24uU0VUOiB7XG5cdFx0XHRcdGNvbnN0IFtwcm9wLCB2YWx1ZV0gPSBhcmdzO1xuXHRcdFx0XHRjb25zdCBub3JtYWxpemVkVmFsdWUgPSBkZWVwT3BlcmF0ZUFuZENsb25lKHZhbHVlLCBub3JtYWxpemVSZWYpO1xuXHRcdFx0XHRpZiAob3B0aW9ucy50YXJnZXQpIHJlc3VsdCA9IHJlZmxlY3Quc2V0Py4ob2JqLCBwcm9wLCBub3JtYWxpemVkVmFsdWUpID8/IChvYmpbcHJvcF0gPSBub3JtYWxpemVkVmFsdWUsIHRydWUpO1xuXHRcdFx0XHRlbHNlIHJlc3VsdCA9IHJlZmxlY3Quc2V0Py4ob2JqLCBwcm9wLCBub3JtYWxpemVkVmFsdWUpID8/IHdyaXRlQnlQYXRoKFsuLi5wYXRoLCBTdHJpbmcocHJvcCldLCBub3JtYWxpemVkVmFsdWUpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHRcdGNhc2UgXCJhcHBseVwiOlxuXHRcdFx0Y2FzZSBcImNhbGxcIjpcblx0XHRcdGNhc2UgV1JlZmxlY3RBY3Rpb24uQVBQTFk6XG5cdFx0XHRjYXNlIFdSZWZsZWN0QWN0aW9uLkNBTEw6XG5cdFx0XHRcdGlmICh0eXBlb2Ygb2JqID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdFx0XHRjb25zdCBjdHggPSBvcHRpb25zLmNvbnRleHQgPz8gKG9wdGlvbnMudGFyZ2V0ID8gdm9pZCAwIDogcmVhZEJ5UGF0aChwYXRoLnNsaWNlKDAsIC0xKSkpO1xuXHRcdFx0XHRcdGNvbnN0IG5vcm1hbGl6ZWRBcmdzID0gZGVlcE9wZXJhdGVBbmRDbG9uZShhcmdzPy5bMF0gPz8gYXJncyA/PyBbXSwgbm9ybWFsaXplUmVmKTtcblx0XHRcdFx0XHRyZXN1bHQgPSByZWZsZWN0LmFwcGx5Py4ob2JqLCBjdHgsIG5vcm1hbGl6ZWRBcmdzKSA/PyBvYmouYXBwbHkoY3R4LCBub3JtYWxpemVkQXJncyk7XG5cdFx0XHRcdFx0aWYgKGlzQ2FuVHJhbnNmZXIocmVzdWx0KSAmJiBwYXRoPy5hdCgtMSkgPT09IFwidHJhbnNmZXJcIiAmJiBjaGFubmVsICE9PSBzZW5kZXIpIHRvVHJhbnNmZXIucHVzaChyZXN1bHQpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcImNvbnN0cnVjdFwiOlxuXHRcdFx0Y2FzZSBXUmVmbGVjdEFjdGlvbi5DT05TVFJVQ1Q6XG5cdFx0XHRcdGlmICh0eXBlb2Ygb2JqID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdFx0XHRjb25zdCBub3JtYWxpemVkQXJncyA9IGRlZXBPcGVyYXRlQW5kQ2xvbmUoYXJncz8uWzBdID8/IGFyZ3MgPz8gW10sIG5vcm1hbGl6ZVJlZik7XG5cdFx0XHRcdFx0cmVzdWx0ID0gcmVmbGVjdC5jb25zdHJ1Y3Q/LihvYmosIG5vcm1hbGl6ZWRBcmdzKSA/PyBuZXcgb2JqKC4uLm5vcm1hbGl6ZWRBcmdzKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCJkZWxldGVcIjpcblx0XHRcdGNhc2UgXCJkZWxldGVwcm9wZXJ0eVwiOlxuXHRcdFx0Y2FzZSBcImRpc3Bvc2VcIjpcblx0XHRcdGNhc2UgV1JlZmxlY3RBY3Rpb24uREVMRVRFOlxuXHRcdFx0Y2FzZSBXUmVmbGVjdEFjdGlvbi5ERUxFVEVfUFJPUEVSVFk6XG5cdFx0XHRjYXNlIFdSZWZsZWN0QWN0aW9uLkRJU1BPU0U6XG5cdFx0XHRcdGlmIChvcHRpb25zLnRhcmdldCkge1xuXHRcdFx0XHRcdGNvbnN0IHByb3AgPSBwYXRoW3BhdGgubGVuZ3RoIC0gMV07XG5cdFx0XHRcdFx0cmVzdWx0ID0gcmVmbGVjdC5kZWxldGVQcm9wZXJ0eT8uKG9iaiwgcHJvcCkgPz8gZGVsZXRlIG9ialtwcm9wXTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRyZXN1bHQgPSBwYXRoPy5sZW5ndGggPiAwID8gcmVtb3ZlQnlQYXRoKHBhdGgpIDogcmVtb3ZlQnlEYXRhKG9iaik7XG5cdFx0XHRcdFx0aWYgKHJlc3VsdCkgbmV3UGF0aCA9IHJlZ2lzdGVyZWRJblBhdGguZ2V0KG9iaikgPz8gW107XG5cdFx0XHRcdH1cblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwiaGFzXCI6XG5cdFx0XHRjYXNlIFdSZWZsZWN0QWN0aW9uLkhBUzpcblx0XHRcdFx0cmVzdWx0ID0gcmVmbGVjdC5oYXM/LihvYmosIGFyZ3M/LlswXSkgPz8gKGlzT2JqZWN0KG9iaikgPyBhcmdzPy5bMF0gaW4gb2JqIDogZmFsc2UpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCJvd25rZXlzXCI6XG5cdFx0XHRjYXNlIFdSZWZsZWN0QWN0aW9uLk9XTl9LRVlTOlxuXHRcdFx0XHRyZXN1bHQgPSByZWZsZWN0Lm93bktleXM/LihvYmopID8/IChpc09iamVjdChvYmopID8gT2JqZWN0LmtleXMob2JqKSA6IFtdKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwiZ2V0b3ducHJvcGVydHlkZXNjcmlwdG9yXCI6XG5cdFx0XHRjYXNlIFwiZ2V0cHJvcGVydHlkZXNjcmlwdG9yXCI6XG5cdFx0XHRjYXNlIFdSZWZsZWN0QWN0aW9uLkdFVF9PV05fUFJPUEVSVFlfREVTQ1JJUFRPUjpcblx0XHRcdGNhc2UgV1JlZmxlY3RBY3Rpb24uR0VUX1BST1BFUlRZX0RFU0NSSVBUT1I6XG5cdFx0XHRcdHJlc3VsdCA9IHJlZmxlY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yPy4ob2JqLCBhcmdzPy5bMF0gPz8gcGF0aD8uYXQoLTEpID8/IFwiXCIpID8/IChpc09iamVjdChvYmopID8gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmosIGFyZ3M/LlswXSA/PyBwYXRoPy5hdCgtMSkgPz8gXCJcIikgOiB2b2lkIDApO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCJnZXRwcm90b3R5cGVvZlwiOlxuXHRcdFx0Y2FzZSBXUmVmbGVjdEFjdGlvbi5HRVRfUFJPVE9UWVBFX09GOlxuXHRcdFx0XHRyZXN1bHQgPSByZWZsZWN0LmdldFByb3RvdHlwZU9mPy4ob2JqKSA/PyAoaXNPYmplY3Qob2JqKSA/IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmopIDogbnVsbCk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcInNldHByb3RvdHlwZW9mXCI6XG5cdFx0XHRjYXNlIFdSZWZsZWN0QWN0aW9uLlNFVF9QUk9UT1RZUEVfT0Y6XG5cdFx0XHRcdHJlc3VsdCA9IHJlZmxlY3Quc2V0UHJvdG90eXBlT2Y/LihvYmosIGFyZ3M/LlswXSkgPz8gKGlzT2JqZWN0KG9iaikgPyBPYmplY3Quc2V0UHJvdG90eXBlT2Yob2JqLCBhcmdzPy5bMF0pIDogZmFsc2UpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCJpc2V4dGVuc2libGVcIjpcblx0XHRcdGNhc2UgV1JlZmxlY3RBY3Rpb24uSVNfRVhURU5TSUJMRTpcblx0XHRcdFx0cmVzdWx0ID0gcmVmbGVjdC5pc0V4dGVuc2libGU/LihvYmopID8/IChpc09iamVjdChvYmopID8gT2JqZWN0LmlzRXh0ZW5zaWJsZShvYmopIDogdHJ1ZSk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcInByZXZlbnRleHRlbnNpb25zXCI6XG5cdFx0XHRjYXNlIFdSZWZsZWN0QWN0aW9uLlBSRVZFTlRfRVhURU5TSU9OUzogcmVzdWx0ID0gcmVmbGVjdC5wcmV2ZW50RXh0ZW5zaW9ucz8uKG9iaikgPz8gKGlzT2JqZWN0KG9iaikgPyBPYmplY3QucHJldmVudEV4dGVuc2lvbnMob2JqKSA6IGZhbHNlKTtcblx0XHR9XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3VsdCxcblx0XHRcdHRvVHJhbnNmZXIsXG5cdFx0XHRwYXRoOiBuZXdQYXRoXG5cdFx0fTtcblx0fVxuXHQvKipcblx0KiBCdWlsZCByZXNwb25zZSBvYmplY3Qgd2l0aCBkZXNjcmlwdG9yXG5cdCovXG5cdGFzeW5jIGZ1bmN0aW9uIGJ1aWxkUmVzcG9uc2UocmVxSWQsIGFjdGlvbiwgY2hhbm5lbCwgc2VuZGVyLCBwYXRoLCByYXdSZXN1bHQsIHRvVHJhbnNmZXIpIHtcblx0XHRjb25zdCByZXN1bHQgPSBhd2FpdCByYXdSZXN1bHQ7XG5cdFx0Y29uc3QgY2FuQmVSZXR1cm4gPSBpc0NhblRyYW5zZmVyKHJlc3VsdCkgJiYgdG9UcmFuc2Zlci5pbmNsdWRlcyhyZXN1bHQpIHx8IGlzQ2FuSnVzdFJldHVybihyZXN1bHQpO1xuXHRcdGxldCBmaW5hbFBhdGggPSBwYXRoO1xuXHRcdGlmICghY2FuQmVSZXR1cm4gJiYgYWN0aW9uICE9PSBcImdldFwiICYmIGFjdGlvbiAhPT0gV1JlZmxlY3RBY3Rpb24uR0VUICYmICh0eXBlb2YgcmVzdWx0ID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiByZXN1bHQgPT09IFwiZnVuY3Rpb25cIikpIHtcblx0XHRcdGlmIChoYXNOb1BhdGgocmVzdWx0KSkge1xuXHRcdFx0XHRmaW5hbFBhdGggPSBbVVVJRHY0KCldO1xuXHRcdFx0XHR3cml0ZUJ5UGF0aChmaW5hbFBhdGgsIHJlc3VsdCk7XG5cdFx0XHR9IGVsc2UgZmluYWxQYXRoID0gcmVnaXN0ZXJlZEluUGF0aC5nZXQocmVzdWx0KSA/PyBbXTtcblx0XHR9XG5cdFx0Y29uc3QgY3R4ID0gcmVhZEJ5UGF0aChmaW5hbFBhdGgpO1xuXHRcdGNvbnN0IGN0eEtleSA9IGFjdGlvbiA9PT0gXCJnZXRcIiB8fCBhY3Rpb24gPT09IFdSZWZsZWN0QWN0aW9uLkdFVCA/IGZpbmFsUGF0aD8uYXQoLTEpIDogdm9pZCAwO1xuXHRcdGNvbnN0IG9iaiA9IHJlYWRCeVBhdGgocGF0aCk7XG5cdFx0Y29uc3QgcGF5bG9hZCA9IGRlZXBPcGVyYXRlQW5kQ2xvbmUocmVzdWx0LCAoZWwpID0+IG9iamVjdFRvUmVmKGVsLCBjaGFubmVsLCB0b1RyYW5zZmVyKSkgPz8gcmVzdWx0O1xuXHRcdHJldHVybiB7XG5cdFx0XHRyZXNwb25zZToge1xuXHRcdFx0XHRjaGFubmVsOiBzZW5kZXIsXG5cdFx0XHRcdHNlbmRlcjogY2hhbm5lbCxcblx0XHRcdFx0cmVxSWQsXG5cdFx0XHRcdGFjdGlvbixcblx0XHRcdFx0dHlwZTogXCJyZXNwb25zZVwiLFxuXHRcdFx0XHRwYXlsb2FkOiB7XG5cdFx0XHRcdFx0cmVzdWx0OiBjYW5CZVJldHVybiA/IHBheWxvYWQgOiBudWxsLFxuXHRcdFx0XHRcdHR5cGU6IHR5cGVvZiByZXN1bHQsXG5cdFx0XHRcdFx0Y2hhbm5lbDogc2VuZGVyLFxuXHRcdFx0XHRcdHNlbmRlcjogY2hhbm5lbCxcblx0XHRcdFx0XHRkZXNjcmlwdG9yOiB7XG5cdFx0XHRcdFx0XHQkaXNEZXNjcmlwdG9yOiB0cnVlLFxuXHRcdFx0XHRcdFx0cGF0aDogZmluYWxQYXRoLFxuXHRcdFx0XHRcdFx0b3duZXI6IGNoYW5uZWwsXG5cdFx0XHRcdFx0XHRjaGFubmVsLFxuXHRcdFx0XHRcdFx0cHJpbWl0aXZlOiBpc1ByaW1pdGl2ZShyZXN1bHQpLFxuXHRcdFx0XHRcdFx0d3JpdGFibGU6IHRydWUsXG5cdFx0XHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdFx0XHRcdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxuXHRcdFx0XHRcdFx0YXJndW1lbnRDb3VudDogb2JqIGluc3RhbmNlb2YgRnVuY3Rpb24gPyBvYmoubGVuZ3RoIDogLTEsXG5cdFx0XHRcdFx0XHQuLi5pc09iamVjdChjdHgpICYmIGN0eEtleSAhPSBudWxsID8gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihjdHgsIGN0eEtleSkgOiB7fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdHRyYW5zZmVyOiB0b1RyYW5zZmVyXG5cdFx0fTtcblx0fVxuXHQvKipcblx0KiBIYW5kbGUgcmVxdWVzdCBhbmQgcmV0dXJuIHJlc3BvbnNlICh1bmlmaWVkIGhhbmRsZXIpXG5cdCovXG5cdGFzeW5jIGZ1bmN0aW9uIGhhbmRsZVJlcXVlc3QocmVxdWVzdCwgcmVxSWQsIGNoYW5uZWxOYW1lLCBvcHRpb25zKSB7XG5cdFx0Y29uc3QgeyBjaGFubmVsLCBzZW5kZXIsIHBhdGgsIGFjdGlvbiwgYXJncyB9ID0gcmVxdWVzdDtcblx0XHRpZiAoY2hhbm5lbCAhPT0gY2hhbm5lbE5hbWUpIHJldHVybiBudWxsO1xuXHRcdGNvbnN0IHsgcmVzdWx0LCB0b1RyYW5zZmVyLCBwYXRoOiBuZXdQYXRoIH0gPSBleGVjdXRlQWN0aW9uKGFjdGlvbiwgcGF0aCwgYXJncywge1xuXHRcdFx0Y2hhbm5lbCxcblx0XHRcdHNlbmRlcixcblx0XHRcdC4uLm9wdGlvbnNcblx0XHR9KTtcblx0XHRyZXR1cm4gYnVpbGRSZXNwb25zZShyZXFJZCwgYWN0aW9uLCBjaGFubmVsTmFtZSwgc2VuZGVyLCBuZXdQYXRoLCByZXN1bHQsIHRvVHJhbnNmZXIpO1xuXHR9XG5cdC8qKlxuXHQqIENyZWF0ZSBhIHNpbXBsZSBleHBvc2UgaGFuZGxlciBmb3IgYW4gb2JqZWN0XG5cdCpcblx0KiBVbmxpa2UgdGhlIGZ1bGwgZXhlY3V0ZUFjdGlvbiwgdGhpcyB3b3JrcyBkaXJlY3RseSBvbiB0aGUgdGFyZ2V0XG5cdCogd2l0aG91dCBEYXRhQmFzZSBpbnRlZ3JhdGlvbi4gVXNlZCBieSBQcm94eS50cyBjcmVhdGVFeHBvc2VIYW5kbGVyLlxuXHQqXG5cdCogQHBhcmFtIHRhcmdldCAtIE9iamVjdCB0byBleHBvc2Vcblx0KiBAcGFyYW0gcmVmbGVjdCAtIE9wdGlvbmFsIGN1c3RvbSBSZWZsZWN0IGltcGxlbWVudGF0aW9uXG5cdCovXG5cdGZ1bmN0aW9uIGNyZWF0ZU9iamVjdEhhbmRsZXIodGFyZ2V0LCByZWZsZWN0ID0gZGVmYXVsdFJlZmxlY3QpIHtcblx0XHRyZXR1cm4gYXN5bmMgKGFjdGlvbiwgcGF0aCwgYXJncykgPT4ge1xuXHRcdFx0bGV0IHBhcmVudCA9IHRhcmdldDtcblx0XHRcdGxldCBjdXJyZW50ID0gdGFyZ2V0O1xuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBwYXRoLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdHBhcmVudCA9IGN1cnJlbnQ7XG5cdFx0XHRcdGN1cnJlbnQgPSBjdXJyZW50Py5bcGF0aFtpXV07XG5cdFx0XHRcdGlmIChjdXJyZW50ID09PSB2b2lkIDAgJiYgaSA8IHBhdGgubGVuZ3RoIC0gMSkgdGhyb3cgbmV3IEVycm9yKGBQYXRoIHNlZ21lbnQgJyR7cGF0aFtpXX0nIG5vdCBmb3VuZGApO1xuXHRcdFx0fVxuXHRcdFx0Y29uc3QgcHJvcCA9IHBhdGhbcGF0aC5sZW5ndGggLSAxXTtcblx0XHRcdHN3aXRjaCAoU3RyaW5nKGFjdGlvbikudG9Mb3dlckNhc2UoKSkge1xuXHRcdFx0XHRjYXNlIFwiZ2V0XCI6XG5cdFx0XHRcdGNhc2UgV1JlZmxlY3RBY3Rpb24uR0VUOiByZXR1cm4gY3VycmVudDtcblx0XHRcdFx0Y2FzZSBcInNldFwiOlxuXHRcdFx0XHRjYXNlIFdSZWZsZWN0QWN0aW9uLlNFVDpcblx0XHRcdFx0XHRwYXJlbnRbcHJvcF0gPSBhcmdzWzBdO1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRjYXNlIFwiY2FsbFwiOlxuXHRcdFx0XHRjYXNlIFwiYXBwbHlcIjpcblx0XHRcdFx0Y2FzZSBXUmVmbGVjdEFjdGlvbi5BUFBMWTpcblx0XHRcdFx0Y2FzZSBXUmVmbGVjdEFjdGlvbi5DQUxMOlxuXHRcdFx0XHRcdGlmICh0eXBlb2YgY3VycmVudCA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRcdFx0XHRjb25zdCBjYWxsQXJncyA9IEFycmF5LmlzQXJyYXkoYXJnc1swXSkgPyBhcmdzWzBdIDogYXJncztcblx0XHRcdFx0XHRcdHJldHVybiBhd2FpdCBjdXJyZW50LmFwcGx5KHBhcmVudCwgY2FsbEFyZ3MpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYCcke3Byb3B9JyBpcyBub3QgYSBmdW5jdGlvbmApO1xuXHRcdFx0XHRjYXNlIFwiY29uc3RydWN0XCI6XG5cdFx0XHRcdGNhc2UgV1JlZmxlY3RBY3Rpb24uQ09OU1RSVUNUOlxuXHRcdFx0XHRcdGlmICh0eXBlb2YgY3VycmVudCA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRcdFx0XHRjb25zdCBjdG9yQXJncyA9IEFycmF5LmlzQXJyYXkoYXJnc1swXSkgPyBhcmdzWzBdIDogYXJncztcblx0XHRcdFx0XHRcdHJldHVybiBuZXcgY3VycmVudCguLi5jdG9yQXJncyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgJyR7cHJvcH0nIGlzIG5vdCBhIGNvbnN0cnVjdG9yYCk7XG5cdFx0XHRcdGNhc2UgXCJoYXNcIjpcblx0XHRcdFx0Y2FzZSBXUmVmbGVjdEFjdGlvbi5IQVM6IHJldHVybiBwcm9wIGluIHBhcmVudDtcblx0XHRcdFx0Y2FzZSBcImRlbGV0ZVwiOlxuXHRcdFx0XHRjYXNlIFwiZGVsZXRlcHJvcGVydHlcIjpcblx0XHRcdFx0Y2FzZSBXUmVmbGVjdEFjdGlvbi5ERUxFVEVfUFJPUEVSVFk6IHJldHVybiBkZWxldGUgcGFyZW50W3Byb3BdO1xuXHRcdFx0XHRjYXNlIFwib3dua2V5c1wiOlxuXHRcdFx0XHRjYXNlIFdSZWZsZWN0QWN0aW9uLk9XTl9LRVlTOiByZXR1cm4gT2JqZWN0LmtleXMoY3VycmVudCA/PyBwYXJlbnQpO1xuXHRcdFx0XHRkZWZhdWx0OiByZXR1cm4gY3VycmVudDtcblx0XHRcdH1cblx0XHR9O1xuXHR9XG5cbi8vI2VuZHJlZ2lvblxuLy8jcmVnaW9uIC4uL3VuaWZvcm0udHMvc3JjL25ld2VyL25leHQvY2hhbm5lbC9Db25uZWN0aW9uLnRzXG4vKipcblx0KiBDaGFubmVsIENvbm5lY3Rpb24gLSBDb25uZWN0aW9uIGFic3RyYWN0aW9uIGxheWVyXG5cdCpcblx0KiBQcm92aWRlcyBjb25uZWN0aW9uIHBvb2xpbmcsIHN0YXRlIG1hbmFnZW1lbnQsIGFuZCBtZXNzYWdlIHJvdXRpbmcuXG5cdCovXG5cdHZhciBDaGFubmVsQ29ubmVjdGlvbiA9IGNsYXNzIHtcblx0XHRfbmFtZTtcblx0XHRfdHJhbnNwb3J0VHlwZTtcblx0XHRfaWQgPSBVVUlEdjQoKTtcblx0XHRfc3RhdGUgPSBcImRpc2Nvbm5lY3RlZFwiO1xuXHRcdF9pbmJvdW5kID0gbmV3IENoYW5uZWxTdWJqZWN0KHsgYnVmZmVyU2l6ZTogMWUzIH0pO1xuXHRcdF9vdXRib3VuZCA9IG5ldyBDaGFubmVsU3ViamVjdCh7IGJ1ZmZlclNpemU6IDFlMyB9KTtcblx0XHRfc3RhdGVDaGFuZ2VzID0gbmV3IENoYW5uZWxTdWJqZWN0KCk7XG5cdFx0X2Nvbm5lY3RlZFBlZXJzID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0XHRfc3VicyA9IFtdO1xuXHRcdF9zdGF0cyA9IHtcblx0XHRcdG1lc3NhZ2VzU2VudDogMCxcblx0XHRcdG1lc3NhZ2VzUmVjZWl2ZWQ6IDAsXG5cdFx0XHRieXRlc1RyYW5zZmVycmVkOiAwLFxuXHRcdFx0bGF0ZW5jeU1zOiAwLFxuXHRcdFx0dXB0aW1lOiAwLFxuXHRcdFx0cmVjb25uZWN0Q291bnQ6IDBcblx0XHR9O1xuXHRcdF9zdGFydFRpbWUgPSAwO1xuXHRcdF9wZW5kaW5nID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0XHRfYnVmZmVyID0gW107XG5cdFx0X29wdHM7XG5cdFx0Y29uc3RydWN0b3IoX25hbWUsIF90cmFuc3BvcnRUeXBlID0gXCJpbnRlcm5hbFwiLCBvcHRpb25zID0ge30pIHtcblx0XHRcdHRoaXMuX25hbWUgPSBfbmFtZTtcblx0XHRcdHRoaXMuX3RyYW5zcG9ydFR5cGUgPSBfdHJhbnNwb3J0VHlwZTtcblx0XHRcdHRoaXMuX29wdHMgPSB7XG5cdFx0XHRcdHRpbWVvdXQ6IDNlNCxcblx0XHRcdFx0YXV0b1JlY29ubmVjdDogdHJ1ZSxcblx0XHRcdFx0cmVjb25uZWN0SW50ZXJ2YWw6IDFlMyxcblx0XHRcdFx0bWF4UmVjb25uZWN0QXR0ZW1wdHM6IDUsXG5cdFx0XHRcdGJ1ZmZlck1lc3NhZ2VzOiB0cnVlLFxuXHRcdFx0XHRidWZmZXJTaXplOiAxZTMsXG5cdFx0XHRcdG1ldGFkYXRhOiB7fSxcblx0XHRcdFx0Li4ub3B0aW9uc1xuXHRcdFx0fTtcblx0XHRcdHRoaXMuX3NldHVwU3Vic2NyaXB0aW9ucygpO1xuXHRcdH1cblx0XHRzdWJzY3JpYmUob2JzZXJ2ZXIsIGZyb21DaGFubmVsKSB7XG5cdFx0XHRyZXR1cm4gKGZyb21DaGFubmVsID8gZmlsdGVyKChtKSA9PiBtLnNlbmRlciA9PT0gZnJvbUNoYW5uZWwpKHRoaXMuX2luYm91bmQpIDogdGhpcy5faW5ib3VuZCkuc3Vic2NyaWJlKHR5cGVvZiBvYnNlcnZlciA9PT0gXCJmdW5jdGlvblwiID8geyBuZXh0OiBvYnNlcnZlciB9IDogb2JzZXJ2ZXIpO1xuXHRcdH1cblx0XHRuZXh0KG1lc3NhZ2UpIHtcblx0XHRcdGlmICh0aGlzLl9zdGF0ZSAhPT0gXCJjb25uZWN0ZWRcIikge1xuXHRcdFx0XHRpZiAodGhpcy5fb3B0cy5idWZmZXJNZXNzYWdlcyAmJiB0aGlzLl9idWZmZXIubGVuZ3RoIDwgdGhpcy5fb3B0cy5idWZmZXJTaXplKSB0aGlzLl9idWZmZXIucHVzaChtZXNzYWdlKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5fb3V0Ym91bmQubmV4dChtZXNzYWdlKTtcblx0XHRcdHRoaXMuX3N0YXRzLm1lc3NhZ2VzU2VudCsrO1xuXHRcdH1cblx0XHRhc3luYyByZXF1ZXN0KHRvQ2hhbm5lbCwgcGF5bG9hZCwgb3B0cyA9IHt9KSB7XG5cdFx0XHRjb25zdCByZXFJZCA9IFVVSUR2NCgpO1xuXHRcdFx0Y29uc3QgcmVzb2x2ZXJzID0gUHJvbWlzZS53aXRoUmVzb2x2ZXJzKCk7XG5cdFx0XHR0aGlzLl9wZW5kaW5nLnNldChyZXFJZCwgcmVzb2x2ZXJzKTtcblx0XHRcdGNvbnN0IHRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFx0aWYgKHRoaXMuX3BlbmRpbmcuaGFzKHJlcUlkKSkge1xuXHRcdFx0XHRcdHRoaXMuX3BlbmRpbmcuZGVsZXRlKHJlcUlkKTtcblx0XHRcdFx0XHRyZXNvbHZlcnMucmVqZWN0KC8qIEBfX1BVUkVfXyAqLyBuZXcgRXJyb3IoYFJlcXVlc3QgdGltZW91dGApKTtcblx0XHRcdFx0fVxuXHRcdFx0fSwgb3B0cy50aW1lb3V0ID8/IHRoaXMuX29wdHMudGltZW91dCk7XG5cdFx0XHR0aGlzLm5leHQoe1xuXHRcdFx0XHRpZDogVVVJRHY0KCksXG5cdFx0XHRcdGNoYW5uZWw6IHRvQ2hhbm5lbCxcblx0XHRcdFx0c2VuZGVyOiB0aGlzLl9uYW1lLFxuXHRcdFx0XHR0eXBlOiBcInJlcXVlc3RcIixcblx0XHRcdFx0cmVxSWQsXG5cdFx0XHRcdHBheWxvYWQ6IHtcblx0XHRcdFx0XHQuLi5wYXlsb2FkLFxuXHRcdFx0XHRcdGFjdGlvbjogb3B0cy5hY3Rpb24sXG5cdFx0XHRcdFx0cGF0aDogb3B0cy5wYXRoXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHRpbWVzdGFtcDogRGF0ZS5ub3coKVxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gcmVzb2x2ZXJzLnByb21pc2UuZmluYWxseSgoKSA9PiBjbGVhclRpbWVvdXQodGltZW91dCkpO1xuXHRcdH1cblx0XHRyZXNwb25kKG9yaWdpbmFsLCBwYXlsb2FkKSB7XG5cdFx0XHR0aGlzLm5leHQoe1xuXHRcdFx0XHRpZDogVVVJRHY0KCksXG5cdFx0XHRcdGNoYW5uZWw6IG9yaWdpbmFsLnNlbmRlcixcblx0XHRcdFx0c2VuZGVyOiB0aGlzLl9uYW1lLFxuXHRcdFx0XHR0eXBlOiBcInJlc3BvbnNlXCIsXG5cdFx0XHRcdHJlcUlkOiBvcmlnaW5hbC5yZXFJZCxcblx0XHRcdFx0cGF5bG9hZCxcblx0XHRcdFx0dGltZXN0YW1wOiBEYXRlLm5vdygpXG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0ZW1pdCh0b0NoYW5uZWwsIGV2ZW50VHlwZSwgZGF0YSkge1xuXHRcdFx0dGhpcy5uZXh0KHtcblx0XHRcdFx0aWQ6IFVVSUR2NCgpLFxuXHRcdFx0XHRjaGFubmVsOiB0b0NoYW5uZWwsXG5cdFx0XHRcdHNlbmRlcjogdGhpcy5fbmFtZSxcblx0XHRcdFx0dHlwZTogXCJldmVudFwiLFxuXHRcdFx0XHRwYXlsb2FkOiB7XG5cdFx0XHRcdFx0dHlwZTogZXZlbnRUeXBlLFxuXHRcdFx0XHRcdGRhdGFcblx0XHRcdFx0fSxcblx0XHRcdFx0dGltZXN0YW1wOiBEYXRlLm5vdygpXG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0c3Vic2NyaWJlT3V0Ym91bmQob2JzZXJ2ZXIpIHtcblx0XHRcdHJldHVybiB0aGlzLl9vdXRib3VuZC5zdWJzY3JpYmUodHlwZW9mIG9ic2VydmVyID09PSBcImZ1bmN0aW9uXCIgPyB7IG5leHQ6IG9ic2VydmVyIH0gOiBvYnNlcnZlcik7XG5cdFx0fVxuXHRcdHB1c2hJbmJvdW5kKG1lc3NhZ2UpIHtcblx0XHRcdHRoaXMuX3N0YXRzLm1lc3NhZ2VzUmVjZWl2ZWQrKztcblx0XHRcdGlmIChtZXNzYWdlLnR5cGUgPT09IFwicmVzcG9uc2VcIiAmJiBtZXNzYWdlLnJlcUlkKSB7XG5cdFx0XHRcdGNvbnN0IHIgPSB0aGlzLl9wZW5kaW5nLmdldChtZXNzYWdlLnJlcUlkKTtcblx0XHRcdFx0aWYgKHIpIHtcblx0XHRcdFx0XHR0aGlzLl9wZW5kaW5nLmRlbGV0ZShtZXNzYWdlLnJlcUlkKTtcblx0XHRcdFx0XHRyLnJlc29sdmUobWVzc2FnZS5wYXlsb2FkKTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHRoaXMuX2luYm91bmQubmV4dChtZXNzYWdlKTtcblx0XHR9XG5cdFx0YXN5bmMgY29ubmVjdCgpIHtcblx0XHRcdGlmICh0aGlzLl9zdGF0ZSA9PT0gXCJjb25uZWN0ZWRcIikgcmV0dXJuO1xuXHRcdFx0dGhpcy5fc2V0U3RhdGUoXCJjb25uZWN0aW5nXCIpO1xuXHRcdFx0dGhpcy5fc3RhcnRUaW1lID0gRGF0ZS5ub3coKTtcblx0XHRcdHRoaXMuX3NldFN0YXRlKFwiY29ubmVjdGVkXCIpO1xuXHRcdFx0dGhpcy5fZmx1c2hCdWZmZXIoKTtcblx0XHR9XG5cdFx0ZGlzY29ubmVjdCgpIHtcblx0XHRcdGlmICh0aGlzLl9zdGF0ZSA9PT0gXCJkaXNjb25uZWN0ZWRcIiB8fCB0aGlzLl9zdGF0ZSA9PT0gXCJjbG9zZWRcIikgcmV0dXJuO1xuXHRcdFx0dGhpcy5fc2V0U3RhdGUoXCJkaXNjb25uZWN0ZWRcIik7XG5cdFx0XHR0aGlzLl9zdWJzLmZvckVhY2goKHMpID0+IHMudW5zdWJzY3JpYmUoKSk7XG5cdFx0XHR0aGlzLl9zdWJzID0gW107XG5cdFx0fVxuXHRcdGNsb3NlKCkge1xuXHRcdFx0dGhpcy5kaXNjb25uZWN0KCk7XG5cdFx0XHR0aGlzLl9zZXRTdGF0ZShcImNsb3NlZFwiKTtcblx0XHRcdHRoaXMuX2luYm91bmQuY29tcGxldGUoKTtcblx0XHRcdHRoaXMuX291dGJvdW5kLmNvbXBsZXRlKCk7XG5cdFx0XHR0aGlzLl9zdGF0ZUNoYW5nZXMuY29tcGxldGUoKTtcblx0XHR9XG5cdFx0bWFya0Nvbm5lY3RlZCgpIHtcblx0XHRcdHRoaXMuX3NldFN0YXRlKFwiY29ubmVjdGVkXCIpO1xuXHRcdFx0dGhpcy5fZmx1c2hCdWZmZXIoKTtcblx0XHR9XG5cdFx0bWFya0Rpc2Nvbm5lY3RlZCgpIHtcblx0XHRcdHRoaXMuX3NldFN0YXRlKFwiZGlzY29ubmVjdGVkXCIpO1xuXHRcdH1cblx0XHRfc2V0U3RhdGUoc3RhdGUpIHtcblx0XHRcdGlmICh0aGlzLl9zdGF0ZSAhPT0gc3RhdGUpIHtcblx0XHRcdFx0dGhpcy5fc3RhdGUgPSBzdGF0ZTtcblx0XHRcdFx0dGhpcy5fc3RhdGVDaGFuZ2VzLm5leHQoc3RhdGUpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRfZmx1c2hCdWZmZXIoKSB7XG5cdFx0XHRmb3IgKGNvbnN0IG1zZyBvZiB0aGlzLl9idWZmZXIpIHRoaXMuX291dGJvdW5kLm5leHQobXNnKTtcblx0XHRcdHRoaXMuX2J1ZmZlciA9IFtdO1xuXHRcdH1cblx0XHRfc2V0dXBTdWJzY3JpcHRpb25zKCkge1xuXHRcdFx0dGhpcy5fc3Vicy5wdXNoKHRoaXMuX2luYm91bmQuc3Vic2NyaWJlKHsgbmV4dDogKG1zZykgPT4ge1xuXHRcdFx0XHRpZiAobXNnLnR5cGUgPT09IFwic2lnbmFsXCIgJiYgbXNnLnBheWxvYWQ/LnR5cGUgPT09IFwiY29ubmVjdFwiKSB0aGlzLl9jb25uZWN0ZWRQZWVycy5zZXQobXNnLnNlbmRlciwge1xuXHRcdFx0XHRcdG5hbWU6IG1zZy5zZW5kZXIsXG5cdFx0XHRcdFx0c3RhdGU6IFwiY29ubmVjdGVkXCIsXG5cdFx0XHRcdFx0aXNIb3N0OiBmYWxzZVxuXHRcdFx0XHR9KTtcblx0XHRcdH0gfSkpO1xuXHRcdH1cblx0XHRnZXQgaWQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5faWQ7XG5cdFx0fVxuXHRcdGdldCBuYW1lKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX25hbWU7XG5cdFx0fVxuXHRcdGdldCBzdGF0ZSgpIHtcblx0XHRcdHJldHVybiB0aGlzLl9zdGF0ZTtcblx0XHR9XG5cdFx0Z2V0IHRyYW5zcG9ydFR5cGUoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fdHJhbnNwb3J0VHlwZTtcblx0XHR9XG5cdFx0Z2V0IHN0YXRzKCkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0Li4udGhpcy5fc3RhdHMsXG5cdFx0XHRcdHVwdGltZTogdGhpcy5fc3RhcnRUaW1lID8gRGF0ZS5ub3coKSAtIHRoaXMuX3N0YXJ0VGltZSA6IDBcblx0XHRcdH07XG5cdFx0fVxuXHRcdGdldCBzdGF0ZUNoYW5nZXMoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fc3RhdGVDaGFuZ2VzO1xuXHRcdH1cblx0XHRnZXQgY29ubmVjdGVkUGVlcnMoKSB7XG5cdFx0XHRyZXR1cm4gWy4uLnRoaXMuX2Nvbm5lY3RlZFBlZXJzLmtleXMoKV07XG5cdFx0fVxuXHRcdGdldCBtZXRhKCkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0aWQ6IHRoaXMuX2lkLFxuXHRcdFx0XHRuYW1lOiB0aGlzLl9uYW1lLFxuXHRcdFx0XHRzdGF0ZTogdGhpcy5fc3RhdGUsXG5cdFx0XHRcdGlzSG9zdDogZmFsc2UsXG5cdFx0XHRcdGNvbm5lY3RlZENoYW5uZWxzOiBuZXcgU2V0KHRoaXMuX2Nvbm5lY3RlZFBlZXJzLmtleXMoKSlcblx0XHRcdH07XG5cdFx0fVxuXHR9O1xuXHR2YXIgQ29ubmVjdGlvblBvb2wgPSBjbGFzcyBDb25uZWN0aW9uUG9vbCB7XG5cdFx0X2Nvbm5lY3Rpb25zID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0XHRzdGF0aWMgX2luc3RhbmNlID0gbnVsbDtcblx0XHRzdGF0aWMgZ2V0SW5zdGFuY2UoKSB7XG5cdFx0XHRpZiAoIUNvbm5lY3Rpb25Qb29sLl9pbnN0YW5jZSkgQ29ubmVjdGlvblBvb2wuX2luc3RhbmNlID0gbmV3IENvbm5lY3Rpb25Qb29sKCk7XG5cdFx0XHRyZXR1cm4gQ29ubmVjdGlvblBvb2wuX2luc3RhbmNlO1xuXHRcdH1cblx0XHRnZXRPckNyZWF0ZShuYW1lLCB0cmFuc3BvcnRUeXBlID0gXCJpbnRlcm5hbFwiLCBvcHRpb25zID0ge30pIHtcblx0XHRcdGlmICghdGhpcy5fY29ubmVjdGlvbnMuaGFzKG5hbWUpKSB0aGlzLl9jb25uZWN0aW9ucy5zZXQobmFtZSwgbmV3IENoYW5uZWxDb25uZWN0aW9uKG5hbWUsIHRyYW5zcG9ydFR5cGUsIG9wdGlvbnMpKTtcblx0XHRcdHJldHVybiB0aGlzLl9jb25uZWN0aW9ucy5nZXQobmFtZSk7XG5cdFx0fVxuXHRcdGdldChuYW1lKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY29ubmVjdGlvbnMuZ2V0KG5hbWUpO1xuXHRcdH1cblx0XHRoYXMobmFtZSkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2Nvbm5lY3Rpb25zLmhhcyhuYW1lKTtcblx0XHR9XG5cdFx0ZGVsZXRlKG5hbWUpIHtcblx0XHRcdHRoaXMuX2Nvbm5lY3Rpb25zLmdldChuYW1lKT8uY2xvc2UoKTtcblx0XHRcdHJldHVybiB0aGlzLl9jb25uZWN0aW9ucy5kZWxldGUobmFtZSk7XG5cdFx0fVxuXHRcdGNsZWFyKCkge1xuXHRcdFx0dGhpcy5fY29ubmVjdGlvbnMuZm9yRWFjaCgoYykgPT4gYy5jbG9zZSgpKTtcblx0XHRcdHRoaXMuX2Nvbm5lY3Rpb25zLmNsZWFyKCk7XG5cdFx0fVxuXHRcdGdldCBzaXplKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2Nvbm5lY3Rpb25zLnNpemU7XG5cdFx0fVxuXHRcdGdldCBuYW1lcygpIHtcblx0XHRcdHJldHVybiBbLi4udGhpcy5fY29ubmVjdGlvbnMua2V5cygpXTtcblx0XHR9XG5cdH07XG5cdGNvbnN0IGdldENvbm5lY3Rpb25Qb29sID0gKCkgPT4gQ29ubmVjdGlvblBvb2wuZ2V0SW5zdGFuY2UoKTtcblx0Y29uc3QgZ2V0Q29ubmVjdGlvbiA9IChuYW1lLCB0cmFuc3BvcnRUeXBlLCBvcHRpb25zKSA9PiBnZXRDb25uZWN0aW9uUG9vbCgpLmdldE9yQ3JlYXRlKG5hbWUsIHRyYW5zcG9ydFR5cGUsIG9wdGlvbnMpO1xuXG4vLyNlbmRyZWdpb25cbi8vI3JlZ2lvbiAuLi91bmlmb3JtLnRzL3NyYy9uZXdlci9uZXh0L3N0b3JhZ2UvU3RvcmFnZS50c1xuLyoqXG5cdCogSW5kZXhlZERCIEludGVncmF0aW9uIGZvciBDaGFubmVsIFN5c3RlbVxuXHQqXG5cdCogUHJvdmlkZXMgcGVyc2lzdGVudCBzdG9yYWdlIGNhcGFiaWxpdGllcyBmb3IgY2hhbm5lbCBjb21tdW5pY2F0aW9uOlxuXHQqIC0gRGVmZXI6IFF1ZXVlIG1lc3NhZ2VzIGZvciBsYXRlciBkZWxpdmVyeVxuXHQqIC0gUGVuZGluZzogVHJhY2sgcGVuZGluZyBvcGVyYXRpb25zXG5cdCogLSBNYWlsYm94L0luYm94OiBTdG9yZSBtZXNzYWdlcyBwZXIgY2hhbm5lbFxuXHQqIC0gVHJhbnNhY3Rpb25zOiBCYXRjaCBvcGVyYXRpb25zIHdpdGggcm9sbGJhY2tcblx0KiAtIEV4Y2hhbmdlOiBDb29yZGluYXRlIGRhdGEgYmV0d2VlbiBjb250ZXh0c1xuXHQqL1xuXHRjb25zdCBEQl9OQU1FID0gXCJ1bmlmb3JtX2NoYW5uZWxzXCI7XG5cdGNvbnN0IERCX1ZFUlNJT04gPSAxO1xuXHRjb25zdCBTVE9SRVMgPSB7XG5cdFx0TUVTU0FHRVM6IFwibWVzc2FnZXNcIixcblx0XHRNQUlMQk9YOiBcIm1haWxib3hcIixcblx0XHRQRU5ESU5HOiBcInBlbmRpbmdcIixcblx0XHRFWENIQU5HRTogXCJleGNoYW5nZVwiLFxuXHRcdFRSQU5TQUNUSU9OUzogXCJ0cmFuc2FjdGlvbnNcIlxuXHR9O1xuXHQvKipcblx0KiBJbmRleGVkREIgbWFuYWdlciBmb3IgY2hhbm5lbCBzdG9yYWdlXG5cdCovXG5cdHZhciBDaGFubmVsU3RvcmFnZSA9IGNsYXNzIHtcblx0XHRfZGIgPSBudWxsO1xuXHRcdF9pc09wZW4gPSBmYWxzZTtcblx0XHRfb3BlblByb21pc2UgPSBudWxsO1xuXHRcdF9jaGFubmVsTmFtZTtcblx0XHRfbWVzc2FnZVVwZGF0ZXMgPSBuZXcgQ2hhbm5lbFN1YmplY3QoKTtcblx0XHRfZXhjaGFuZ2VVcGRhdGVzID0gbmV3IENoYW5uZWxTdWJqZWN0KCk7XG5cdFx0Y29uc3RydWN0b3IoY2hhbm5lbE5hbWUpIHtcblx0XHRcdHRoaXMuX2NoYW5uZWxOYW1lID0gY2hhbm5lbE5hbWU7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogT3BlbiBkYXRhYmFzZSBjb25uZWN0aW9uXG5cdFx0Ki9cblx0XHRhc3luYyBvcGVuKCkge1xuXHRcdFx0aWYgKHRoaXMuX2RiICYmIHRoaXMuX2lzT3BlbikgcmV0dXJuIHRoaXMuX2RiO1xuXHRcdFx0aWYgKHRoaXMuX29wZW5Qcm9taXNlKSByZXR1cm4gdGhpcy5fb3BlblByb21pc2U7XG5cdFx0XHR0aGlzLl9vcGVuUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdFx0Y29uc3QgcmVxdWVzdCA9IGluZGV4ZWREQi5vcGVuKERCX05BTUUsIERCX1ZFUlNJT04pO1xuXHRcdFx0XHRyZXF1ZXN0Lm9uZXJyb3IgPSAoKSA9PiB7XG5cdFx0XHRcdFx0dGhpcy5fb3BlblByb21pc2UgPSBudWxsO1xuXHRcdFx0XHRcdHJlamVjdCgvKiBAX19QVVJFX18gKi8gbmV3IEVycm9yKFwiRmFpbGVkIHRvIG9wZW4gSW5kZXhlZERCXCIpKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0cmVxdWVzdC5vbnN1Y2Nlc3MgPSAoKSA9PiB7XG5cdFx0XHRcdFx0dGhpcy5fZGIgPSByZXF1ZXN0LnJlc3VsdDtcblx0XHRcdFx0XHR0aGlzLl9pc09wZW4gPSB0cnVlO1xuXHRcdFx0XHRcdHRoaXMuX29wZW5Qcm9taXNlID0gbnVsbDtcblx0XHRcdFx0XHRyZXNvbHZlKHRoaXMuX2RiKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0cmVxdWVzdC5vbnVwZ3JhZGVuZWVkZWQgPSAoZXZlbnQpID0+IHtcblx0XHRcdFx0XHRjb25zdCBkYiA9IGV2ZW50LnRhcmdldC5yZXN1bHQ7XG5cdFx0XHRcdFx0dGhpcy5fY3JlYXRlU3RvcmVzKGRiKTtcblx0XHRcdFx0fTtcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIHRoaXMuX29wZW5Qcm9taXNlO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIENsb3NlIGRhdGFiYXNlIGNvbm5lY3Rpb25cblx0XHQqL1xuXHRcdGNsb3NlKCkge1xuXHRcdFx0aWYgKHRoaXMuX2RiKSB7XG5cdFx0XHRcdHRoaXMuX2RiLmNsb3NlKCk7XG5cdFx0XHRcdHRoaXMuX2RiID0gbnVsbDtcblx0XHRcdFx0dGhpcy5faXNPcGVuID0gZmFsc2U7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdF9jcmVhdGVTdG9yZXMoZGIpIHtcblx0XHRcdGlmICghZGIub2JqZWN0U3RvcmVOYW1lcy5jb250YWlucyhTVE9SRVMuTUVTU0FHRVMpKSB7XG5cdFx0XHRcdGNvbnN0IG1lc3NhZ2VzU3RvcmUgPSBkYi5jcmVhdGVPYmplY3RTdG9yZShTVE9SRVMuTUVTU0FHRVMsIHsga2V5UGF0aDogXCJpZFwiIH0pO1xuXHRcdFx0XHRtZXNzYWdlc1N0b3JlLmNyZWF0ZUluZGV4KFwiY2hhbm5lbFwiLCBcImNoYW5uZWxcIiwgeyB1bmlxdWU6IGZhbHNlIH0pO1xuXHRcdFx0XHRtZXNzYWdlc1N0b3JlLmNyZWF0ZUluZGV4KFwic3RhdHVzXCIsIFwic3RhdHVzXCIsIHsgdW5pcXVlOiBmYWxzZSB9KTtcblx0XHRcdFx0bWVzc2FnZXNTdG9yZS5jcmVhdGVJbmRleChcInJlY2lwaWVudFwiLCBcInJlY2lwaWVudFwiLCB7IHVuaXF1ZTogZmFsc2UgfSk7XG5cdFx0XHRcdG1lc3NhZ2VzU3RvcmUuY3JlYXRlSW5kZXgoXCJjcmVhdGVkQXRcIiwgXCJjcmVhdGVkQXRcIiwgeyB1bmlxdWU6IGZhbHNlIH0pO1xuXHRcdFx0XHRtZXNzYWdlc1N0b3JlLmNyZWF0ZUluZGV4KFwiY2hhbm5lbF9zdGF0dXNcIiwgW1wiY2hhbm5lbFwiLCBcInN0YXR1c1wiXSwgeyB1bmlxdWU6IGZhbHNlIH0pO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCFkYi5vYmplY3RTdG9yZU5hbWVzLmNvbnRhaW5zKFNUT1JFUy5NQUlMQk9YKSkge1xuXHRcdFx0XHRjb25zdCBtYWlsYm94U3RvcmUgPSBkYi5jcmVhdGVPYmplY3RTdG9yZShTVE9SRVMuTUFJTEJPWCwgeyBrZXlQYXRoOiBcImlkXCIgfSk7XG5cdFx0XHRcdG1haWxib3hTdG9yZS5jcmVhdGVJbmRleChcImNoYW5uZWxcIiwgXCJjaGFubmVsXCIsIHsgdW5pcXVlOiBmYWxzZSB9KTtcblx0XHRcdFx0bWFpbGJveFN0b3JlLmNyZWF0ZUluZGV4KFwicHJpb3JpdHlcIiwgXCJwcmlvcml0eVwiLCB7IHVuaXF1ZTogZmFsc2UgfSk7XG5cdFx0XHRcdG1haWxib3hTdG9yZS5jcmVhdGVJbmRleChcImV4cGlyZXNBdFwiLCBcImV4cGlyZXNBdFwiLCB7IHVuaXF1ZTogZmFsc2UgfSk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoIWRiLm9iamVjdFN0b3JlTmFtZXMuY29udGFpbnMoU1RPUkVTLlBFTkRJTkcpKSB7XG5cdFx0XHRcdGNvbnN0IHBlbmRpbmdTdG9yZSA9IGRiLmNyZWF0ZU9iamVjdFN0b3JlKFNUT1JFUy5QRU5ESU5HLCB7IGtleVBhdGg6IFwiaWRcIiB9KTtcblx0XHRcdFx0cGVuZGluZ1N0b3JlLmNyZWF0ZUluZGV4KFwiY2hhbm5lbFwiLCBcImNoYW5uZWxcIiwgeyB1bmlxdWU6IGZhbHNlIH0pO1xuXHRcdFx0XHRwZW5kaW5nU3RvcmUuY3JlYXRlSW5kZXgoXCJjcmVhdGVkQXRcIiwgXCJjcmVhdGVkQXRcIiwgeyB1bmlxdWU6IGZhbHNlIH0pO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCFkYi5vYmplY3RTdG9yZU5hbWVzLmNvbnRhaW5zKFNUT1JFUy5FWENIQU5HRSkpIHtcblx0XHRcdFx0Y29uc3QgZXhjaGFuZ2VTdG9yZSA9IGRiLmNyZWF0ZU9iamVjdFN0b3JlKFNUT1JFUy5FWENIQU5HRSwgeyBrZXlQYXRoOiBcImlkXCIgfSk7XG5cdFx0XHRcdGV4Y2hhbmdlU3RvcmUuY3JlYXRlSW5kZXgoXCJrZXlcIiwgXCJrZXlcIiwgeyB1bmlxdWU6IHRydWUgfSk7XG5cdFx0XHRcdGV4Y2hhbmdlU3RvcmUuY3JlYXRlSW5kZXgoXCJvd25lclwiLCBcIm93bmVyXCIsIHsgdW5pcXVlOiBmYWxzZSB9KTtcblx0XHRcdH1cblx0XHRcdGlmICghZGIub2JqZWN0U3RvcmVOYW1lcy5jb250YWlucyhTVE9SRVMuVFJBTlNBQ1RJT05TKSkgZGIuY3JlYXRlT2JqZWN0U3RvcmUoU1RPUkVTLlRSQU5TQUNUSU9OUywgeyBrZXlQYXRoOiBcImlkXCIgfSkuY3JlYXRlSW5kZXgoXCJjcmVhdGVkQXRcIiwgXCJjcmVhdGVkQXRcIiwgeyB1bmlxdWU6IGZhbHNlIH0pO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIERlZmVyIGEgbWVzc2FnZSBmb3IgbGF0ZXIgZGVsaXZlcnlcblx0XHQqL1xuXHRcdGFzeW5jIGRlZmVyKG1lc3NhZ2UsIG9wdGlvbnMgPSB7fSkge1xuXHRcdFx0Y29uc3QgZGIgPSBhd2FpdCB0aGlzLm9wZW4oKTtcblx0XHRcdGNvbnN0IHN0b3JlZE1lc3NhZ2UgPSB7XG5cdFx0XHRcdGlkOiBVVUlEdjQoKSxcblx0XHRcdFx0Y2hhbm5lbDogbWVzc2FnZS5jaGFubmVsLFxuXHRcdFx0XHRzZW5kZXI6IG1lc3NhZ2Uuc2VuZGVyID8/IHRoaXMuX2NoYW5uZWxOYW1lLFxuXHRcdFx0XHRyZWNpcGllbnQ6IG1lc3NhZ2UuY2hhbm5lbCxcblx0XHRcdFx0dHlwZTogbWVzc2FnZS50eXBlLFxuXHRcdFx0XHRwYXlsb2FkOiBtZXNzYWdlLnBheWxvYWQsXG5cdFx0XHRcdHN0YXR1czogXCJwZW5kaW5nXCIsXG5cdFx0XHRcdHByaW9yaXR5OiBvcHRpb25zLnByaW9yaXR5ID8/IDAsXG5cdFx0XHRcdGNyZWF0ZWRBdDogRGF0ZS5ub3coKSxcblx0XHRcdFx0dXBkYXRlZEF0OiBEYXRlLm5vdygpLFxuXHRcdFx0XHRleHBpcmVzQXQ6IG9wdGlvbnMuZXhwaXJlc0luID8gRGF0ZS5ub3coKSArIG9wdGlvbnMuZXhwaXJlc0luIDogbnVsbCxcblx0XHRcdFx0cmV0cnlDb3VudDogMCxcblx0XHRcdFx0bWF4UmV0cmllczogb3B0aW9ucy5tYXhSZXRyaWVzID8/IDMsXG5cdFx0XHRcdG1ldGFkYXRhOiBvcHRpb25zLm1ldGFkYXRhXG5cdFx0XHR9O1xuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdFx0Y29uc3QgdHggPSBkYi50cmFuc2FjdGlvbihbU1RPUkVTLk1FU1NBR0VTLCBTVE9SRVMuTUFJTEJPWF0sIFwicmVhZHdyaXRlXCIpO1xuXHRcdFx0XHRjb25zdCBtZXNzYWdlc1N0b3JlID0gdHgub2JqZWN0U3RvcmUoU1RPUkVTLk1FU1NBR0VTKTtcblx0XHRcdFx0Y29uc3QgbWFpbGJveFN0b3JlID0gdHgub2JqZWN0U3RvcmUoU1RPUkVTLk1BSUxCT1gpO1xuXHRcdFx0XHRtZXNzYWdlc1N0b3JlLmFkZChzdG9yZWRNZXNzYWdlKTtcblx0XHRcdFx0bWFpbGJveFN0b3JlLmFkZChzdG9yZWRNZXNzYWdlKTtcblx0XHRcdFx0dHgub25jb21wbGV0ZSA9ICgpID0+IHtcblx0XHRcdFx0XHR0aGlzLl9tZXNzYWdlVXBkYXRlcy5uZXh0KHN0b3JlZE1lc3NhZ2UpO1xuXHRcdFx0XHRcdHJlc29sdmUoc3RvcmVkTWVzc2FnZS5pZCk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHR4Lm9uZXJyb3IgPSAoKSA9PiByZWplY3QoLyogQF9fUFVSRV9fICovIG5ldyBFcnJvcihcIkZhaWxlZCB0byBkZWZlciBtZXNzYWdlXCIpKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIEdldCBkZWZlcnJlZCBtZXNzYWdlcyBmb3IgYSBjaGFubmVsXG5cdFx0Ki9cblx0XHRhc3luYyBnZXREZWZlcnJlZE1lc3NhZ2VzKGNoYW5uZWwsIG9wdGlvbnMgPSB7fSkge1xuXHRcdFx0Y29uc3QgZGIgPSBhd2FpdCB0aGlzLm9wZW4oKTtcblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHRcdGNvbnN0IHN0b3JlID0gZGIudHJhbnNhY3Rpb24oU1RPUkVTLk1FU1NBR0VTLCBcInJlYWRvbmx5XCIpLm9iamVjdFN0b3JlKFNUT1JFUy5NRVNTQUdFUyk7XG5cdFx0XHRcdGNvbnN0IGluZGV4ID0gb3B0aW9ucy5zdGF0dXMgPyBzdG9yZS5pbmRleChcImNoYW5uZWxfc3RhdHVzXCIpIDogc3RvcmUuaW5kZXgoXCJjaGFubmVsXCIpO1xuXHRcdFx0XHRjb25zdCBxdWVyeSA9IG9wdGlvbnMuc3RhdHVzID8gSURCS2V5UmFuZ2Uub25seShbY2hhbm5lbCwgb3B0aW9ucy5zdGF0dXNdKSA6IElEQktleVJhbmdlLm9ubHkoY2hhbm5lbCk7XG5cdFx0XHRcdGNvbnN0IHJlcXVlc3QgPSBpbmRleC5nZXRBbGwocXVlcnksIG9wdGlvbnMubGltaXQpO1xuXHRcdFx0XHRyZXF1ZXN0Lm9uc3VjY2VzcyA9ICgpID0+IHtcblx0XHRcdFx0XHRsZXQgcmVzdWx0cyA9IHJlcXVlc3QucmVzdWx0O1xuXHRcdFx0XHRcdGlmIChvcHRpb25zLm9mZnNldCkgcmVzdWx0cyA9IHJlc3VsdHMuc2xpY2Uob3B0aW9ucy5vZmZzZXQpO1xuXHRcdFx0XHRcdHJlc29sdmUocmVzdWx0cyk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHJlcXVlc3Qub25lcnJvciA9ICgpID0+IHJlamVjdCgvKiBAX19QVVJFX18gKi8gbmV3IEVycm9yKFwiRmFpbGVkIHRvIGdldCBkZWZlcnJlZCBtZXNzYWdlc1wiKSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBQcm9jZXNzIG5leHQgcGVuZGluZyBtZXNzYWdlXG5cdFx0Ki9cblx0XHRhc3luYyBwcm9jZXNzTmV4dFBlbmRpbmcoY2hhbm5lbCkge1xuXHRcdFx0Y29uc3QgZGIgPSBhd2FpdCB0aGlzLm9wZW4oKTtcblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHRcdGNvbnN0IHJlcXVlc3QgPSBkYi50cmFuc2FjdGlvbihTVE9SRVMuTUVTU0FHRVMsIFwicmVhZHdyaXRlXCIpLm9iamVjdFN0b3JlKFNUT1JFUy5NRVNTQUdFUykuaW5kZXgoXCJjaGFubmVsX3N0YXR1c1wiKS5vcGVuQ3Vyc29yKElEQktleVJhbmdlLm9ubHkoW2NoYW5uZWwsIFwicGVuZGluZ1wiXSkpO1xuXHRcdFx0XHRyZXF1ZXN0Lm9uc3VjY2VzcyA9ICgpID0+IHtcblx0XHRcdFx0XHRjb25zdCBjdXJzb3IgPSByZXF1ZXN0LnJlc3VsdDtcblx0XHRcdFx0XHRpZiAoY3Vyc29yKSB7XG5cdFx0XHRcdFx0XHRjb25zdCBtZXNzYWdlID0gY3Vyc29yLnZhbHVlO1xuXHRcdFx0XHRcdFx0bWVzc2FnZS5zdGF0dXMgPSBcInByb2Nlc3NpbmdcIjtcblx0XHRcdFx0XHRcdG1lc3NhZ2UudXBkYXRlZEF0ID0gRGF0ZS5ub3coKTtcblx0XHRcdFx0XHRcdGN1cnNvci51cGRhdGUobWVzc2FnZSk7XG5cdFx0XHRcdFx0XHR0aGlzLl9tZXNzYWdlVXBkYXRlcy5uZXh0KG1lc3NhZ2UpO1xuXHRcdFx0XHRcdFx0cmVzb2x2ZShtZXNzYWdlKTtcblx0XHRcdFx0XHR9IGVsc2UgcmVzb2x2ZShudWxsKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0cmVxdWVzdC5vbmVycm9yID0gKCkgPT4gcmVqZWN0KC8qIEBfX1BVUkVfXyAqLyBuZXcgRXJyb3IoXCJGYWlsZWQgdG8gcHJvY2VzcyBwZW5kaW5nIG1lc3NhZ2VcIikpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogTWFyayBtZXNzYWdlIGFzIGRlbGl2ZXJlZFxuXHRcdCovXG5cdFx0YXN5bmMgbWFya0RlbGl2ZXJlZChtZXNzYWdlSWQpIHtcblx0XHRcdGF3YWl0IHRoaXMuX3VwZGF0ZU1lc3NhZ2VTdGF0dXMobWVzc2FnZUlkLCBcImRlbGl2ZXJlZFwiKTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBNYXJrIG1lc3NhZ2UgYXMgZmFpbGVkIGFuZCByZXRyeSBpZiBwb3NzaWJsZVxuXHRcdCovXG5cdFx0YXN5bmMgbWFya0ZhaWxlZChtZXNzYWdlSWQpIHtcblx0XHRcdGNvbnN0IGRiID0gYXdhaXQgdGhpcy5vcGVuKCk7XG5cdFx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0XHRjb25zdCBzdG9yZSA9IGRiLnRyYW5zYWN0aW9uKFNUT1JFUy5NRVNTQUdFUywgXCJyZWFkd3JpdGVcIikub2JqZWN0U3RvcmUoU1RPUkVTLk1FU1NBR0VTKTtcblx0XHRcdFx0Y29uc3QgcmVxdWVzdCA9IHN0b3JlLmdldChtZXNzYWdlSWQpO1xuXHRcdFx0XHRyZXF1ZXN0Lm9uc3VjY2VzcyA9ICgpID0+IHtcblx0XHRcdFx0XHRjb25zdCBtZXNzYWdlID0gcmVxdWVzdC5yZXN1bHQ7XG5cdFx0XHRcdFx0aWYgKCFtZXNzYWdlKSB7XG5cdFx0XHRcdFx0XHRyZXNvbHZlKGZhbHNlKTtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0bWVzc2FnZS5yZXRyeUNvdW50Kys7XG5cdFx0XHRcdFx0bWVzc2FnZS51cGRhdGVkQXQgPSBEYXRlLm5vdygpO1xuXHRcdFx0XHRcdGlmIChtZXNzYWdlLnJldHJ5Q291bnQgPCBtZXNzYWdlLm1heFJldHJpZXMpIG1lc3NhZ2Uuc3RhdHVzID0gXCJwZW5kaW5nXCI7XG5cdFx0XHRcdFx0ZWxzZSBtZXNzYWdlLnN0YXR1cyA9IFwiZmFpbGVkXCI7XG5cdFx0XHRcdFx0c3RvcmUucHV0KG1lc3NhZ2UpO1xuXHRcdFx0XHRcdHRoaXMuX21lc3NhZ2VVcGRhdGVzLm5leHQobWVzc2FnZSk7XG5cdFx0XHRcdFx0cmVzb2x2ZShtZXNzYWdlLnN0YXR1cyA9PT0gXCJwZW5kaW5nXCIpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHRyZXF1ZXN0Lm9uZXJyb3IgPSAoKSA9PiByZWplY3QoLyogQF9fUFVSRV9fICovIG5ldyBFcnJvcihcIkZhaWxlZCB0byBtYXJrIG1lc3NhZ2UgYXMgZmFpbGVkXCIpKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRhc3luYyBfdXBkYXRlTWVzc2FnZVN0YXR1cyhtZXNzYWdlSWQsIHN0YXR1cykge1xuXHRcdFx0Y29uc3QgZGIgPSBhd2FpdCB0aGlzLm9wZW4oKTtcblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHRcdGNvbnN0IHN0b3JlID0gZGIudHJhbnNhY3Rpb24oU1RPUkVTLk1FU1NBR0VTLCBcInJlYWR3cml0ZVwiKS5vYmplY3RTdG9yZShTVE9SRVMuTUVTU0FHRVMpO1xuXHRcdFx0XHRjb25zdCByZXF1ZXN0ID0gc3RvcmUuZ2V0KG1lc3NhZ2VJZCk7XG5cdFx0XHRcdHJlcXVlc3Qub25zdWNjZXNzID0gKCkgPT4ge1xuXHRcdFx0XHRcdGNvbnN0IG1lc3NhZ2UgPSByZXF1ZXN0LnJlc3VsdDtcblx0XHRcdFx0XHRpZiAobWVzc2FnZSkge1xuXHRcdFx0XHRcdFx0bWVzc2FnZS5zdGF0dXMgPSBzdGF0dXM7XG5cdFx0XHRcdFx0XHRtZXNzYWdlLnVwZGF0ZWRBdCA9IERhdGUubm93KCk7XG5cdFx0XHRcdFx0XHRzdG9yZS5wdXQobWVzc2FnZSk7XG5cdFx0XHRcdFx0XHR0aGlzLl9tZXNzYWdlVXBkYXRlcy5uZXh0KG1lc3NhZ2UpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXNvbHZlKCk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHJlcXVlc3Qub25lcnJvciA9ICgpID0+IHJlamVjdCgvKiBAX19QVVJFX18gKi8gbmV3IEVycm9yKFwiRmFpbGVkIHRvIHVwZGF0ZSBtZXNzYWdlIHN0YXR1c1wiKSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBHZXQgbWFpbGJveCBmb3IgYSBjaGFubmVsXG5cdFx0Ki9cblx0XHRhc3luYyBnZXRNYWlsYm94KGNoYW5uZWwsIG9wdGlvbnMgPSB7fSkge1xuXHRcdFx0Y29uc3QgZGIgPSBhd2FpdCB0aGlzLm9wZW4oKTtcblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHRcdGNvbnN0IHJlcXVlc3QgPSBkYi50cmFuc2FjdGlvbihTVE9SRVMuTUFJTEJPWCwgXCJyZWFkb25seVwiKS5vYmplY3RTdG9yZShTVE9SRVMuTUFJTEJPWCkuaW5kZXgoXCJjaGFubmVsXCIpLmdldEFsbChJREJLZXlSYW5nZS5vbmx5KGNoYW5uZWwpLCBvcHRpb25zLmxpbWl0KTtcblx0XHRcdFx0cmVxdWVzdC5vbnN1Y2Nlc3MgPSAoKSA9PiB7XG5cdFx0XHRcdFx0bGV0IHJlc3VsdHMgPSByZXF1ZXN0LnJlc3VsdDtcblx0XHRcdFx0XHRpZiAob3B0aW9ucy5zb3J0QnkgPT09IFwicHJpb3JpdHlcIikgcmVzdWx0cy5zb3J0KChhLCBiKSA9PiBiLnByaW9yaXR5IC0gYS5wcmlvcml0eSk7XG5cdFx0XHRcdFx0ZWxzZSByZXN1bHRzLnNvcnQoKGEsIGIpID0+IGIuY3JlYXRlZEF0IC0gYS5jcmVhdGVkQXQpO1xuXHRcdFx0XHRcdHJlc29sdmUocmVzdWx0cyk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHJlcXVlc3Qub25lcnJvciA9ICgpID0+IHJlamVjdCgvKiBAX19QVVJFX18gKi8gbmV3IEVycm9yKFwiRmFpbGVkIHRvIGdldCBtYWlsYm94XCIpKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIEdldCBtYWlsYm94IHN0YXRpc3RpY3Ncblx0XHQqL1xuXHRcdGFzeW5jIGdldE1haWxib3hTdGF0cyhjaGFubmVsKSB7XG5cdFx0XHRjb25zdCBtZXNzYWdlcyA9IGF3YWl0IHRoaXMuZ2V0RGVmZXJyZWRNZXNzYWdlcyhjaGFubmVsKTtcblx0XHRcdGNvbnN0IHN0YXRzID0ge1xuXHRcdFx0XHR0b3RhbDogbWVzc2FnZXMubGVuZ3RoLFxuXHRcdFx0XHRwZW5kaW5nOiAwLFxuXHRcdFx0XHRwcm9jZXNzaW5nOiAwLFxuXHRcdFx0XHRkZWxpdmVyZWQ6IDAsXG5cdFx0XHRcdGZhaWxlZDogMCxcblx0XHRcdFx0ZXhwaXJlZDogMFxuXHRcdFx0fTtcblx0XHRcdGNvbnN0IG5vdyA9IERhdGUubm93KCk7XG5cdFx0XHRmb3IgKGNvbnN0IG1zZyBvZiBtZXNzYWdlcykgaWYgKG1zZy5leHBpcmVzQXQgJiYgbXNnLmV4cGlyZXNBdCA8IG5vdykgc3RhdHMuZXhwaXJlZCsrO1xuXHRcdFx0ZWxzZSBzdGF0c1ttc2cuc3RhdHVzXSsrO1xuXHRcdFx0cmV0dXJuIHN0YXRzO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIENsZWFyIG1haWxib3ggZm9yIGEgY2hhbm5lbFxuXHRcdCovXG5cdFx0YXN5bmMgY2xlYXJNYWlsYm94KGNoYW5uZWwpIHtcblx0XHRcdGNvbnN0IGRiID0gYXdhaXQgdGhpcy5vcGVuKCk7XG5cdFx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0XHRjb25zdCB0eCA9IGRiLnRyYW5zYWN0aW9uKFNUT1JFUy5NQUlMQk9YLCBcInJlYWR3cml0ZVwiKTtcblx0XHRcdFx0Y29uc3QgaW5kZXggPSB0eC5vYmplY3RTdG9yZShTVE9SRVMuTUFJTEJPWCkuaW5kZXgoXCJjaGFubmVsXCIpO1xuXHRcdFx0XHRsZXQgZGVsZXRlZENvdW50ID0gMDtcblx0XHRcdFx0Y29uc3QgcmVxdWVzdCA9IGluZGV4Lm9wZW5DdXJzb3IoSURCS2V5UmFuZ2Uub25seShjaGFubmVsKSk7XG5cdFx0XHRcdHJlcXVlc3Qub25zdWNjZXNzID0gKCkgPT4ge1xuXHRcdFx0XHRcdGNvbnN0IGN1cnNvciA9IHJlcXVlc3QucmVzdWx0O1xuXHRcdFx0XHRcdGlmIChjdXJzb3IpIHtcblx0XHRcdFx0XHRcdGN1cnNvci5kZWxldGUoKTtcblx0XHRcdFx0XHRcdGRlbGV0ZWRDb3VudCsrO1xuXHRcdFx0XHRcdFx0Y3Vyc29yLmNvbnRpbnVlKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXHRcdFx0XHR0eC5vbmNvbXBsZXRlID0gKCkgPT4gcmVzb2x2ZShkZWxldGVkQ291bnQpO1xuXHRcdFx0XHR0eC5vbmVycm9yID0gKCkgPT4gcmVqZWN0KC8qIEBfX1BVUkVfXyAqLyBuZXcgRXJyb3IoXCJGYWlsZWQgdG8gY2xlYXIgbWFpbGJveFwiKSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBSZWdpc3RlciBhIHBlbmRpbmcgb3BlcmF0aW9uXG5cdFx0Ki9cblx0XHRhc3luYyByZWdpc3RlclBlbmRpbmcob3BlcmF0aW9uKSB7XG5cdFx0XHRjb25zdCBkYiA9IGF3YWl0IHRoaXMub3BlbigpO1xuXHRcdFx0Y29uc3QgcGVuZGluZyA9IHtcblx0XHRcdFx0aWQ6IFVVSUR2NCgpLFxuXHRcdFx0XHRjaGFubmVsOiB0aGlzLl9jaGFubmVsTmFtZSxcblx0XHRcdFx0dHlwZTogb3BlcmF0aW9uLnR5cGUsXG5cdFx0XHRcdGRhdGE6IG9wZXJhdGlvbi5kYXRhLFxuXHRcdFx0XHRtZXRhZGF0YTogb3BlcmF0aW9uLm1ldGFkYXRhLFxuXHRcdFx0XHRjcmVhdGVkQXQ6IERhdGUubm93KCksXG5cdFx0XHRcdHN0YXR1czogXCJwZW5kaW5nXCJcblx0XHRcdH07XG5cdFx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0XHRjb25zdCB0eCA9IGRiLnRyYW5zYWN0aW9uKFNUT1JFUy5QRU5ESU5HLCBcInJlYWR3cml0ZVwiKTtcblx0XHRcdFx0dHgub2JqZWN0U3RvcmUoU1RPUkVTLlBFTkRJTkcpLmFkZChwZW5kaW5nKTtcblx0XHRcdFx0dHgub25jb21wbGV0ZSA9ICgpID0+IHJlc29sdmUocGVuZGluZy5pZCk7XG5cdFx0XHRcdHR4Lm9uZXJyb3IgPSAoKSA9PiByZWplY3QoLyogQF9fUFVSRV9fICovIG5ldyBFcnJvcihcIkZhaWxlZCB0byByZWdpc3RlciBwZW5kaW5nIG9wZXJhdGlvblwiKSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBHZXQgYWxsIHBlbmRpbmcgb3BlcmF0aW9ucyBmb3IgY2hhbm5lbFxuXHRcdCovXG5cdFx0YXN5bmMgZ2V0UGVuZGluZ09wZXJhdGlvbnMoKSB7XG5cdFx0XHRjb25zdCBkYiA9IGF3YWl0IHRoaXMub3BlbigpO1xuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdFx0Y29uc3QgcmVxdWVzdCA9IGRiLnRyYW5zYWN0aW9uKFNUT1JFUy5QRU5ESU5HLCBcInJlYWRvbmx5XCIpLm9iamVjdFN0b3JlKFNUT1JFUy5QRU5ESU5HKS5pbmRleChcImNoYW5uZWxcIikuZ2V0QWxsKElEQktleVJhbmdlLm9ubHkodGhpcy5fY2hhbm5lbE5hbWUpKTtcblx0XHRcdFx0cmVxdWVzdC5vbnN1Y2Nlc3MgPSAoKSA9PiByZXNvbHZlKHJlcXVlc3QucmVzdWx0KTtcblx0XHRcdFx0cmVxdWVzdC5vbmVycm9yID0gKCkgPT4gcmVqZWN0KC8qIEBfX1BVUkVfXyAqLyBuZXcgRXJyb3IoXCJGYWlsZWQgdG8gZ2V0IHBlbmRpbmcgb3BlcmF0aW9uc1wiKSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBDb21wbGV0ZSBhIHBlbmRpbmcgb3BlcmF0aW9uXG5cdFx0Ki9cblx0XHRhc3luYyBjb21wbGV0ZVBlbmRpbmcob3BlcmF0aW9uSWQpIHtcblx0XHRcdGNvbnN0IGRiID0gYXdhaXQgdGhpcy5vcGVuKCk7XG5cdFx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0XHRjb25zdCB0eCA9IGRiLnRyYW5zYWN0aW9uKFNUT1JFUy5QRU5ESU5HLCBcInJlYWR3cml0ZVwiKTtcblx0XHRcdFx0dHgub2JqZWN0U3RvcmUoU1RPUkVTLlBFTkRJTkcpLmRlbGV0ZShvcGVyYXRpb25JZCk7XG5cdFx0XHRcdHR4Lm9uY29tcGxldGUgPSAoKSA9PiByZXNvbHZlKCk7XG5cdFx0XHRcdHR4Lm9uZXJyb3IgPSAoKSA9PiByZWplY3QoLyogQF9fUFVSRV9fICovIG5ldyBFcnJvcihcIkZhaWxlZCB0byBjb21wbGV0ZSBwZW5kaW5nIG9wZXJhdGlvblwiKSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBBd2FpdCBhIHBlbmRpbmcgb3BlcmF0aW9uIChwb2xsIHVudGlsIGNvbXBsZXRlIG9yIHRpbWVvdXQpXG5cdFx0Ki9cblx0XHRhc3luYyBhd2FpdFBlbmRpbmcob3BlcmF0aW9uSWQsIG9wdGlvbnMgPSB7fSkge1xuXHRcdFx0Y29uc3QgdGltZW91dCA9IG9wdGlvbnMudGltZW91dCA/PyAzZTQ7XG5cdFx0XHRjb25zdCBwb2xsSW50ZXJ2YWwgPSBvcHRpb25zLnBvbGxJbnRlcnZhbCA/PyAxMDA7XG5cdFx0XHRjb25zdCBzdGFydFRpbWUgPSBEYXRlLm5vdygpO1xuXHRcdFx0d2hpbGUgKERhdGUubm93KCkgLSBzdGFydFRpbWUgPCB0aW1lb3V0KSB7XG5cdFx0XHRcdGNvbnN0IHBlbmRpbmcgPSBhd2FpdCB0aGlzLl9nZXRQZW5kaW5nQnlJZChvcGVyYXRpb25JZCk7XG5cdFx0XHRcdGlmICghcGVuZGluZykgcmV0dXJuIG51bGw7XG5cdFx0XHRcdGlmIChwZW5kaW5nLnN0YXR1cyA9PT0gXCJjb21wbGV0ZWRcIikge1xuXHRcdFx0XHRcdGF3YWl0IHRoaXMuY29tcGxldGVQZW5kaW5nKG9wZXJhdGlvbklkKTtcblx0XHRcdFx0XHRyZXR1cm4gcGVuZGluZy5yZXN1bHQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0YXdhaXQgbmV3IFByb21pc2UoKHIpID0+IHNldFRpbWVvdXQociwgcG9sbEludGVydmFsKSk7XG5cdFx0XHR9XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFBlbmRpbmcgb3BlcmF0aW9uICR7b3BlcmF0aW9uSWR9IHRpbWVkIG91dGApO1xuXHRcdH1cblx0XHRhc3luYyBfZ2V0UGVuZGluZ0J5SWQoaWQpIHtcblx0XHRcdGNvbnN0IGRiID0gYXdhaXQgdGhpcy5vcGVuKCk7XG5cdFx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0XHRjb25zdCByZXF1ZXN0ID0gZGIudHJhbnNhY3Rpb24oU1RPUkVTLlBFTkRJTkcsIFwicmVhZG9ubHlcIikub2JqZWN0U3RvcmUoU1RPUkVTLlBFTkRJTkcpLmdldChpZCk7XG5cdFx0XHRcdHJlcXVlc3Qub25zdWNjZXNzID0gKCkgPT4gcmVzb2x2ZShyZXF1ZXN0LnJlc3VsdCA/PyBudWxsKTtcblx0XHRcdFx0cmVxdWVzdC5vbmVycm9yID0gKCkgPT4gcmVqZWN0KC8qIEBfX1BVUkVfXyAqLyBuZXcgRXJyb3IoXCJGYWlsZWQgdG8gZ2V0IHBlbmRpbmcgb3BlcmF0aW9uXCIpKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIFB1dCBkYXRhIGluIGV4Y2hhbmdlIChzaGFyZWQgc3RvcmFnZSlcblx0XHQqL1xuXHRcdGFzeW5jIGV4Y2hhbmdlUHV0KGtleSwgdmFsdWUsIG9wdGlvbnMgPSB7fSkge1xuXHRcdFx0Y29uc3QgZGIgPSBhd2FpdCB0aGlzLm9wZW4oKTtcblx0XHRcdGNvbnN0IHJlY29yZCA9IHtcblx0XHRcdFx0aWQ6IFVVSUR2NCgpLFxuXHRcdFx0XHRrZXksXG5cdFx0XHRcdHZhbHVlLFxuXHRcdFx0XHRvd25lcjogdGhpcy5fY2hhbm5lbE5hbWUsXG5cdFx0XHRcdHNoYXJlZFdpdGg6IG9wdGlvbnMuc2hhcmVkV2l0aCA/PyBbXCIqXCJdLFxuXHRcdFx0XHR2ZXJzaW9uOiAxLFxuXHRcdFx0XHRjcmVhdGVkQXQ6IERhdGUubm93KCksXG5cdFx0XHRcdHVwZGF0ZWRBdDogRGF0ZS5ub3coKVxuXHRcdFx0fTtcblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHRcdGNvbnN0IHR4ID0gZGIudHJhbnNhY3Rpb24oU1RPUkVTLkVYQ0hBTkdFLCBcInJlYWR3cml0ZVwiKTtcblx0XHRcdFx0Y29uc3Qgc3RvcmUgPSB0eC5vYmplY3RTdG9yZShTVE9SRVMuRVhDSEFOR0UpO1xuXHRcdFx0XHRjb25zdCBnZXRSZXF1ZXN0ID0gc3RvcmUuaW5kZXgoXCJrZXlcIikuZ2V0KGtleSk7XG5cdFx0XHRcdGdldFJlcXVlc3Qub25zdWNjZXNzID0gKCkgPT4ge1xuXHRcdFx0XHRcdGNvbnN0IGV4aXN0aW5nID0gZ2V0UmVxdWVzdC5yZXN1bHQ7XG5cdFx0XHRcdFx0aWYgKGV4aXN0aW5nKSB7XG5cdFx0XHRcdFx0XHRyZWNvcmQuaWQgPSBleGlzdGluZy5pZDtcblx0XHRcdFx0XHRcdHJlY29yZC52ZXJzaW9uID0gZXhpc3RpbmcudmVyc2lvbiArIDE7XG5cdFx0XHRcdFx0XHRyZWNvcmQuY3JlYXRlZEF0ID0gZXhpc3RpbmcuY3JlYXRlZEF0O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRzdG9yZS5wdXQocmVjb3JkKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dHgub25jb21wbGV0ZSA9ICgpID0+IHtcblx0XHRcdFx0XHR0aGlzLl9leGNoYW5nZVVwZGF0ZXMubmV4dChyZWNvcmQpO1xuXHRcdFx0XHRcdHJlc29sdmUocmVjb3JkLmlkKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0dHgub25lcnJvciA9ICgpID0+IHJlamVjdCgvKiBAX19QVVJFX18gKi8gbmV3IEVycm9yKFwiRmFpbGVkIHRvIHB1dCBleGNoYW5nZSBkYXRhXCIpKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIEdldCBkYXRhIGZyb20gZXhjaGFuZ2Vcblx0XHQqL1xuXHRcdGFzeW5jIGV4Y2hhbmdlR2V0KGtleSkge1xuXHRcdFx0Y29uc3QgZGIgPSBhd2FpdCB0aGlzLm9wZW4oKTtcblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHRcdGNvbnN0IHJlcXVlc3QgPSBkYi50cmFuc2FjdGlvbihTVE9SRVMuRVhDSEFOR0UsIFwicmVhZG9ubHlcIikub2JqZWN0U3RvcmUoU1RPUkVTLkVYQ0hBTkdFKS5pbmRleChcImtleVwiKS5nZXQoa2V5KTtcblx0XHRcdFx0cmVxdWVzdC5vbnN1Y2Nlc3MgPSAoKSA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgcmVjb3JkID0gcmVxdWVzdC5yZXN1bHQ7XG5cdFx0XHRcdFx0aWYgKCFyZWNvcmQpIHtcblx0XHRcdFx0XHRcdHJlc29sdmUobnVsbCk7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICghdGhpcy5fY2FuQWNjZXNzRXhjaGFuZ2UocmVjb3JkKSkge1xuXHRcdFx0XHRcdFx0cmVzb2x2ZShudWxsKTtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmVzb2x2ZShyZWNvcmQudmFsdWUpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHRyZXF1ZXN0Lm9uZXJyb3IgPSAoKSA9PiByZWplY3QoLyogQF9fUFVSRV9fICovIG5ldyBFcnJvcihcIkZhaWxlZCB0byBnZXQgZXhjaGFuZ2UgZGF0YVwiKSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBEZWxldGUgZGF0YSBmcm9tIGV4Y2hhbmdlXG5cdFx0Ki9cblx0XHRhc3luYyBleGNoYW5nZURlbGV0ZShrZXkpIHtcblx0XHRcdGNvbnN0IGRiID0gYXdhaXQgdGhpcy5vcGVuKCk7XG5cdFx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0XHRjb25zdCB0eCA9IGRiLnRyYW5zYWN0aW9uKFNUT1JFUy5FWENIQU5HRSwgXCJyZWFkd3JpdGVcIik7XG5cdFx0XHRcdGNvbnN0IHN0b3JlID0gdHgub2JqZWN0U3RvcmUoU1RPUkVTLkVYQ0hBTkdFKTtcblx0XHRcdFx0Y29uc3QgZ2V0UmVxdWVzdCA9IHN0b3JlLmluZGV4KFwia2V5XCIpLmdldChrZXkpO1xuXHRcdFx0XHRnZXRSZXF1ZXN0Lm9uc3VjY2VzcyA9ICgpID0+IHtcblx0XHRcdFx0XHRjb25zdCByZWNvcmQgPSBnZXRSZXF1ZXN0LnJlc3VsdDtcblx0XHRcdFx0XHRpZiAoIXJlY29yZCkge1xuXHRcdFx0XHRcdFx0cmVzb2x2ZShmYWxzZSk7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmIChyZWNvcmQub3duZXIgIT09IHRoaXMuX2NoYW5uZWxOYW1lKSB7XG5cdFx0XHRcdFx0XHRyZXNvbHZlKGZhbHNlKTtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0c3RvcmUuZGVsZXRlKHJlY29yZC5pZCk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHR4Lm9uY29tcGxldGUgPSAoKSA9PiByZXNvbHZlKHRydWUpO1xuXHRcdFx0XHR0eC5vbmVycm9yID0gKCkgPT4gcmVqZWN0KC8qIEBfX1BVUkVfXyAqLyBuZXcgRXJyb3IoXCJGYWlsZWQgdG8gZGVsZXRlIGV4Y2hhbmdlIGRhdGFcIikpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogQWNxdWlyZSBsb2NrIG9uIGV4Y2hhbmdlIGtleVxuXHRcdCovXG5cdFx0YXN5bmMgZXhjaGFuZ2VMb2NrKGtleSwgb3B0aW9ucyA9IHt9KSB7XG5cdFx0XHRjb25zdCBkYiA9IGF3YWl0IHRoaXMub3BlbigpO1xuXHRcdFx0Y29uc3QgdGltZW91dCA9IG9wdGlvbnMudGltZW91dCA/PyAzZTQ7XG5cdFx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0XHRjb25zdCB0eCA9IGRiLnRyYW5zYWN0aW9uKFNUT1JFUy5FWENIQU5HRSwgXCJyZWFkd3JpdGVcIik7XG5cdFx0XHRcdGNvbnN0IHN0b3JlID0gdHgub2JqZWN0U3RvcmUoU1RPUkVTLkVYQ0hBTkdFKTtcblx0XHRcdFx0Y29uc3QgcmVxdWVzdCA9IHN0b3JlLmluZGV4KFwia2V5XCIpLmdldChrZXkpO1xuXHRcdFx0XHRyZXF1ZXN0Lm9uc3VjY2VzcyA9ICgpID0+IHtcblx0XHRcdFx0XHRjb25zdCByZWNvcmQgPSByZXF1ZXN0LnJlc3VsdDtcblx0XHRcdFx0XHRpZiAoIXJlY29yZCkge1xuXHRcdFx0XHRcdFx0cmVzb2x2ZShmYWxzZSk7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmIChyZWNvcmQubG9jayAmJiByZWNvcmQubG9jay5ob2xkZXIgIT09IHRoaXMuX2NoYW5uZWxOYW1lKSB7XG5cdFx0XHRcdFx0XHRpZiAocmVjb3JkLmxvY2suZXhwaXJlc0F0ID4gRGF0ZS5ub3coKSkge1xuXHRcdFx0XHRcdFx0XHRyZXNvbHZlKGZhbHNlKTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZWNvcmQubG9jayA9IHtcblx0XHRcdFx0XHRcdGhvbGRlcjogdGhpcy5fY2hhbm5lbE5hbWUsXG5cdFx0XHRcdFx0XHRhY3F1aXJlZEF0OiBEYXRlLm5vdygpLFxuXHRcdFx0XHRcdFx0ZXhwaXJlc0F0OiBEYXRlLm5vdygpICsgdGltZW91dFxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0cmVjb3JkLnVwZGF0ZWRBdCA9IERhdGUubm93KCk7XG5cdFx0XHRcdFx0c3RvcmUucHV0KHJlY29yZCk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHR4Lm9uY29tcGxldGUgPSAoKSA9PiByZXNvbHZlKHRydWUpO1xuXHRcdFx0XHR0eC5vbmVycm9yID0gKCkgPT4gcmVqZWN0KC8qIEBfX1BVUkVfXyAqLyBuZXcgRXJyb3IoXCJGYWlsZWQgdG8gYWNxdWlyZSBsb2NrXCIpKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIFJlbGVhc2UgbG9jayBvbiBleGNoYW5nZSBrZXlcblx0XHQqL1xuXHRcdGFzeW5jIGV4Y2hhbmdlVW5sb2NrKGtleSkge1xuXHRcdFx0Y29uc3QgZGIgPSBhd2FpdCB0aGlzLm9wZW4oKTtcblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHRcdGNvbnN0IHR4ID0gZGIudHJhbnNhY3Rpb24oU1RPUkVTLkVYQ0hBTkdFLCBcInJlYWR3cml0ZVwiKTtcblx0XHRcdFx0Y29uc3Qgc3RvcmUgPSB0eC5vYmplY3RTdG9yZShTVE9SRVMuRVhDSEFOR0UpO1xuXHRcdFx0XHRjb25zdCByZXF1ZXN0ID0gc3RvcmUuaW5kZXgoXCJrZXlcIikuZ2V0KGtleSk7XG5cdFx0XHRcdHJlcXVlc3Qub25zdWNjZXNzID0gKCkgPT4ge1xuXHRcdFx0XHRcdGNvbnN0IHJlY29yZCA9IHJlcXVlc3QucmVzdWx0O1xuXHRcdFx0XHRcdGlmIChyZWNvcmQgJiYgcmVjb3JkLmxvY2s/LmhvbGRlciA9PT0gdGhpcy5fY2hhbm5lbE5hbWUpIHtcblx0XHRcdFx0XHRcdGRlbGV0ZSByZWNvcmQubG9jaztcblx0XHRcdFx0XHRcdHJlY29yZC51cGRhdGVkQXQgPSBEYXRlLm5vdygpO1xuXHRcdFx0XHRcdFx0c3RvcmUucHV0KHJlY29yZCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXHRcdFx0XHR0eC5vbmNvbXBsZXRlID0gKCkgPT4gcmVzb2x2ZSgpO1xuXHRcdFx0XHR0eC5vbmVycm9yID0gKCkgPT4gcmVqZWN0KC8qIEBfX1BVUkVfXyAqLyBuZXcgRXJyb3IoXCJGYWlsZWQgdG8gcmVsZWFzZSBsb2NrXCIpKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRfY2FuQWNjZXNzRXhjaGFuZ2UocmVjb3JkKSB7XG5cdFx0XHRpZiAocmVjb3JkLm93bmVyID09PSB0aGlzLl9jaGFubmVsTmFtZSkgcmV0dXJuIHRydWU7XG5cdFx0XHRpZiAocmVjb3JkLnNoYXJlZFdpdGguaW5jbHVkZXMoXCIqXCIpKSByZXR1cm4gdHJ1ZTtcblx0XHRcdHJldHVybiByZWNvcmQuc2hhcmVkV2l0aC5pbmNsdWRlcyh0aGlzLl9jaGFubmVsTmFtZSk7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogQmVnaW4gYSB0cmFuc2FjdGlvbiBmb3IgYmF0Y2ggb3BlcmF0aW9uc1xuXHRcdCovXG5cdFx0YXN5bmMgYmVnaW5UcmFuc2FjdGlvbigpIHtcblx0XHRcdHJldHVybiBuZXcgQ2hhbm5lbFRyYW5zYWN0aW9uKHRoaXMpO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIEV4ZWN1dGUgb3BlcmF0aW9ucyBpbiB0cmFuc2FjdGlvblxuXHRcdCovXG5cdFx0YXN5bmMgZXhlY3V0ZVRyYW5zYWN0aW9uKG9wZXJhdGlvbnMpIHtcblx0XHRcdGNvbnN0IGRiID0gYXdhaXQgdGhpcy5vcGVuKCk7XG5cdFx0XHRjb25zdCBzdG9yZU5hbWVzID0gbmV3IFNldChvcGVyYXRpb25zLm1hcCgob3ApID0+IG9wLnN0b3JlKSk7XG5cdFx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0XHRjb25zdCB0eCA9IGRiLnRyYW5zYWN0aW9uKEFycmF5LmZyb20oc3RvcmVOYW1lcyksIFwicmVhZHdyaXRlXCIpO1xuXHRcdFx0XHRmb3IgKGNvbnN0IG9wIG9mIG9wZXJhdGlvbnMpIHtcblx0XHRcdFx0XHRjb25zdCBzdG9yZSA9IHR4Lm9iamVjdFN0b3JlKG9wLnN0b3JlKTtcblx0XHRcdFx0XHRzd2l0Y2ggKG9wLnR5cGUpIHtcblx0XHRcdFx0XHRcdGNhc2UgXCJwdXRcIjpcblx0XHRcdFx0XHRcdFx0aWYgKG9wLnZhbHVlICE9PSB2b2lkIDApIHN0b3JlLnB1dChvcC52YWx1ZSk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSBcImRlbGV0ZVwiOlxuXHRcdFx0XHRcdFx0XHRpZiAob3Aua2V5ICE9PSB2b2lkIDApIHN0b3JlLmRlbGV0ZShvcC5rZXkpO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgXCJ1cGRhdGVcIjogaWYgKG9wLmtleSAhPT0gdm9pZCAwKSB7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IGdldFJlcSA9IHN0b3JlLmdldChvcC5rZXkpO1xuXHRcdFx0XHRcdFx0XHRnZXRSZXEub25zdWNjZXNzID0gKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdGlmIChnZXRSZXEucmVzdWx0ICYmIG9wLnZhbHVlKSBzdG9yZS5wdXQoe1xuXHRcdFx0XHRcdFx0XHRcdFx0Li4uZ2V0UmVxLnJlc3VsdCxcblx0XHRcdFx0XHRcdFx0XHRcdC4uLm9wLnZhbHVlXG5cdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHR4Lm9uY29tcGxldGUgPSAoKSA9PiByZXNvbHZlKCk7XG5cdFx0XHRcdHR4Lm9uZXJyb3IgPSAoKSA9PiByZWplY3QoLyogQF9fUFVSRV9fICovIG5ldyBFcnJvcihcIlRyYW5zYWN0aW9uIGZhaWxlZFwiKSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBTdWJzY3JpYmUgdG8gbWVzc2FnZSB1cGRhdGVzXG5cdFx0Ki9cblx0XHRvbk1lc3NhZ2VVcGRhdGUoaGFuZGxlcikge1xuXHRcdFx0cmV0dXJuIHRoaXMuX21lc3NhZ2VVcGRhdGVzLnN1YnNjcmliZSh7IG5leHQ6IGhhbmRsZXIgfSk7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogU3Vic2NyaWJlIHRvIGV4Y2hhbmdlIHVwZGF0ZXNcblx0XHQqL1xuXHRcdG9uRXhjaGFuZ2VVcGRhdGUoaGFuZGxlcikge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2V4Y2hhbmdlVXBkYXRlcy5zdWJzY3JpYmUoeyBuZXh0OiBoYW5kbGVyIH0pO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIENsZWFuIHVwIGV4cGlyZWQgbWVzc2FnZXNcblx0XHQqL1xuXHRcdGFzeW5jIGNsZWFudXBFeHBpcmVkKCkge1xuXHRcdFx0Y29uc3QgZGIgPSBhd2FpdCB0aGlzLm9wZW4oKTtcblx0XHRcdGNvbnN0IG5vdyA9IERhdGUubm93KCk7XG5cdFx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0XHRjb25zdCB0eCA9IGRiLnRyYW5zYWN0aW9uKFtTVE9SRVMuTUVTU0FHRVMsIFNUT1JFUy5NQUlMQk9YXSwgXCJyZWFkd3JpdGVcIik7XG5cdFx0XHRcdGNvbnN0IG1lc3NhZ2VzU3RvcmUgPSB0eC5vYmplY3RTdG9yZShTVE9SRVMuTUVTU0FHRVMpO1xuXHRcdFx0XHRjb25zdCBtYWlsYm94U3RvcmUgPSB0eC5vYmplY3RTdG9yZShTVE9SRVMuTUFJTEJPWCk7XG5cdFx0XHRcdGxldCBkZWxldGVkQ291bnQgPSAwO1xuXHRcdFx0XHRjb25zdCBtc2dSZXF1ZXN0ID0gbWVzc2FnZXNTdG9yZS5vcGVuQ3Vyc29yKCk7XG5cdFx0XHRcdG1zZ1JlcXVlc3Qub25zdWNjZXNzID0gKCkgPT4ge1xuXHRcdFx0XHRcdGNvbnN0IGN1cnNvciA9IG1zZ1JlcXVlc3QucmVzdWx0O1xuXHRcdFx0XHRcdGlmIChjdXJzb3IpIHtcblx0XHRcdFx0XHRcdGNvbnN0IG1zZyA9IGN1cnNvci52YWx1ZTtcblx0XHRcdFx0XHRcdGlmIChtc2cuZXhwaXJlc0F0ICYmIG1zZy5leHBpcmVzQXQgPCBub3cpIHtcblx0XHRcdFx0XHRcdFx0Y3Vyc29yLmRlbGV0ZSgpO1xuXHRcdFx0XHRcdFx0XHRkZWxldGVkQ291bnQrKztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGN1cnNvci5jb250aW51ZSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblx0XHRcdFx0Y29uc3QgbWFpbFJlcXVlc3QgPSBtYWlsYm94U3RvcmUub3BlbkN1cnNvcigpO1xuXHRcdFx0XHRtYWlsUmVxdWVzdC5vbnN1Y2Nlc3MgPSAoKSA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgY3Vyc29yID0gbWFpbFJlcXVlc3QucmVzdWx0O1xuXHRcdFx0XHRcdGlmIChjdXJzb3IpIHtcblx0XHRcdFx0XHRcdGNvbnN0IG1zZyA9IGN1cnNvci52YWx1ZTtcblx0XHRcdFx0XHRcdGlmIChtc2cuZXhwaXJlc0F0ICYmIG1zZy5leHBpcmVzQXQgPCBub3cpIHtcblx0XHRcdFx0XHRcdFx0Y3Vyc29yLmRlbGV0ZSgpO1xuXHRcdFx0XHRcdFx0XHRkZWxldGVkQ291bnQrKztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGN1cnNvci5jb250aW51ZSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblx0XHRcdFx0dHgub25jb21wbGV0ZSA9ICgpID0+IHJlc29sdmUoZGVsZXRlZENvdW50KTtcblx0XHRcdFx0dHgub25lcnJvciA9ICgpID0+IHJlamVjdCgvKiBAX19QVVJFX18gKi8gbmV3IEVycm9yKFwiRmFpbGVkIHRvIGNsZWFudXAgZXhwaXJlZFwiKSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH07XG5cdC8qKlxuXHQqIEhlbHBlciBjbGFzcyBmb3IgYmF0Y2ggb3BlcmF0aW9ucyB3aXRoIHJvbGxiYWNrIHN1cHBvcnRcblx0Ki9cblx0dmFyIENoYW5uZWxUcmFuc2FjdGlvbiA9IGNsYXNzIHtcblx0XHRfc3RvcmFnZTtcblx0XHRfb3BlcmF0aW9ucyA9IFtdO1xuXHRcdF9pc0NvbW1pdHRlZCA9IGZhbHNlO1xuXHRcdF9pc1JvbGxlZEJhY2sgPSBmYWxzZTtcblx0XHRjb25zdHJ1Y3Rvcihfc3RvcmFnZSkge1xuXHRcdFx0dGhpcy5fc3RvcmFnZSA9IF9zdG9yYWdlO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIEFkZCBwdXQgb3BlcmF0aW9uXG5cdFx0Ki9cblx0XHRwdXQoc3RvcmUsIHZhbHVlKSB7XG5cdFx0XHR0aGlzLl9jaGVja1N0YXRlKCk7XG5cdFx0XHR0aGlzLl9vcGVyYXRpb25zLnB1c2goe1xuXHRcdFx0XHRpZDogVVVJRHY0KCksXG5cdFx0XHRcdHR5cGU6IFwicHV0XCIsXG5cdFx0XHRcdHN0b3JlLFxuXHRcdFx0XHR2YWx1ZSxcblx0XHRcdFx0dGltZXN0YW1wOiBEYXRlLm5vdygpXG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIEFkZCBkZWxldGUgb3BlcmF0aW9uXG5cdFx0Ki9cblx0XHRkZWxldGUoc3RvcmUsIGtleSkge1xuXHRcdFx0dGhpcy5fY2hlY2tTdGF0ZSgpO1xuXHRcdFx0dGhpcy5fb3BlcmF0aW9ucy5wdXNoKHtcblx0XHRcdFx0aWQ6IFVVSUR2NCgpLFxuXHRcdFx0XHR0eXBlOiBcImRlbGV0ZVwiLFxuXHRcdFx0XHRzdG9yZSxcblx0XHRcdFx0a2V5LFxuXHRcdFx0XHR0aW1lc3RhbXA6IERhdGUubm93KClcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogQWRkIHVwZGF0ZSBvcGVyYXRpb25cblx0XHQqL1xuXHRcdHVwZGF0ZShzdG9yZSwga2V5LCB1cGRhdGVzKSB7XG5cdFx0XHR0aGlzLl9jaGVja1N0YXRlKCk7XG5cdFx0XHR0aGlzLl9vcGVyYXRpb25zLnB1c2goe1xuXHRcdFx0XHRpZDogVVVJRHY0KCksXG5cdFx0XHRcdHR5cGU6IFwidXBkYXRlXCIsXG5cdFx0XHRcdHN0b3JlLFxuXHRcdFx0XHRrZXksXG5cdFx0XHRcdHZhbHVlOiB1cGRhdGVzLFxuXHRcdFx0XHR0aW1lc3RhbXA6IERhdGUubm93KClcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogQ29tbWl0IHRyYW5zYWN0aW9uXG5cdFx0Ki9cblx0XHRhc3luYyBjb21taXQoKSB7XG5cdFx0XHR0aGlzLl9jaGVja1N0YXRlKCk7XG5cdFx0XHRpZiAodGhpcy5fb3BlcmF0aW9ucy5sZW5ndGggPT09IDApIHtcblx0XHRcdFx0dGhpcy5faXNDb21taXR0ZWQgPSB0cnVlO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRhd2FpdCB0aGlzLl9zdG9yYWdlLmV4ZWN1dGVUcmFuc2FjdGlvbih0aGlzLl9vcGVyYXRpb25zKTtcblx0XHRcdHRoaXMuX2lzQ29tbWl0dGVkID0gdHJ1ZTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBSb2xsYmFjayB0cmFuc2FjdGlvbiAoanVzdCBjbGVhciBvcGVyYXRpb25zLCBkb24ndCBleGVjdXRlKVxuXHRcdCovXG5cdFx0cm9sbGJhY2soKSB7XG5cdFx0XHR0aGlzLl9vcGVyYXRpb25zID0gW107XG5cdFx0XHR0aGlzLl9pc1JvbGxlZEJhY2sgPSB0cnVlO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIEdldCBvcGVyYXRpb24gY291bnRcblx0XHQqL1xuXHRcdGdldCBvcGVyYXRpb25Db3VudCgpIHtcblx0XHRcdHJldHVybiB0aGlzLl9vcGVyYXRpb25zLmxlbmd0aDtcblx0XHR9XG5cdFx0X2NoZWNrU3RhdGUoKSB7XG5cdFx0XHRpZiAodGhpcy5faXNDb21taXR0ZWQpIHRocm93IG5ldyBFcnJvcihcIlRyYW5zYWN0aW9uIGFscmVhZHkgY29tbWl0dGVkXCIpO1xuXHRcdFx0aWYgKHRoaXMuX2lzUm9sbGVkQmFjaykgdGhyb3cgbmV3IEVycm9yKFwiVHJhbnNhY3Rpb24gYWxyZWFkeSByb2xsZWQgYmFja1wiKTtcblx0XHR9XG5cdH07XG5cdGNvbnN0IF9zdG9yYWdlSW5zdGFuY2VzID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0LyoqXG5cdCogR2V0IHN0b3JhZ2UgaW5zdGFuY2UgZm9yIGNoYW5uZWxcblx0Ki9cblx0ZnVuY3Rpb24gZ2V0Q2hhbm5lbFN0b3JhZ2UoY2hhbm5lbE5hbWUpIHtcblx0XHRpZiAoIV9zdG9yYWdlSW5zdGFuY2VzLmhhcyhjaGFubmVsTmFtZSkpIF9zdG9yYWdlSW5zdGFuY2VzLnNldChjaGFubmVsTmFtZSwgbmV3IENoYW5uZWxTdG9yYWdlKGNoYW5uZWxOYW1lKSk7XG5cdFx0cmV0dXJuIF9zdG9yYWdlSW5zdGFuY2VzLmdldChjaGFubmVsTmFtZSk7XG5cdH1cblxuLy8jZW5kcmVnaW9uXG4vLyNyZWdpb24gLi4vdW5pZm9ybS50cy9zcmMvbmV3ZXIvbmV4dC9jaGFubmVsL0NoYW5uZWxDb250ZXh0LnRzXG4vKipcblx0KiBDaGFubmVsIENvbnRleHQgLSBNdWx0aS1DaGFubmVsIFN1cHBvcnRcblx0KlxuXHQqIFByb3ZpZGVzIGEgd2F5IHRvIGNyZWF0ZSBtdWx0aXBsZSBpbmRlcGVuZGVudCBjaGFubmVsIGVuZHBvaW50cy9wb3J0c1xuXHQqIGluIHRoZSBzYW1lIGNvbnRleHQuIFN1aXRhYmxlIGZvcjpcblx0KiAtIExhenktbG9hZGVkIGNvbXBvbmVudHNcblx0KiAtIE11bHRpcGxlIERPTSBjb21wb25lbnRzIHdpdGggaXNvbGF0ZWQgY29tbXVuaWNhdGlvblxuXHQqIC0gTWljcm8tZnJvbnRlbmQgYXJjaGl0ZWN0dXJlc1xuXHQqIC0gQ29tcG9uZW50LWxldmVsIGNoYW5uZWwgaXNvbGF0aW9uXG5cdCpcblx0KiB2TmV4dCBhcmNoaXRlY3R1cmUgbm90ZTpcblx0KiAtIENoYW5uZWxDb250ZXh0IGNvbXBvc2VzIFVuaWZpZWRDaGFubmVsIGluc3RhbmNlcyBwZXIgZW5kcG9pbnQuXG5cdCogLSBVbmlmaWVkQ2hhbm5lbCBpcyB0aGUgY2Fub25pY2FsIHRyYW5zcG9ydC9pbnZvY2F0aW9uIHJ1bnRpbWUgZW5naW5lLlxuXHQqL1xuXHRjb25zdCB3b3JrZXJCYXNlID0gZ2V0V29ya2VyUmVzb2x2ZUJhc2VVcmwoKTtcblx0Y29uc3Qgd29ya2VyQ29kZSA9IHdvcmtlckJhc2UubGVuZ3RoID4gMCA/IG5ldyBVUkwoXCIuLi90cmFuc3BvcnQvV29ya2VyLnRzXCIsIHdvcmtlckJhc2UpIDogXCJcIjtcblx0dmFyIFJlbW90ZUNoYW5uZWxIZWxwZXIgPSBjbGFzcyB7XG5cdFx0X2NoYW5uZWw7XG5cdFx0X2NvbnRleHQ7XG5cdFx0X29wdGlvbnM7XG5cdFx0X2Nvbm5lY3Rpb247XG5cdFx0X3N0b3JhZ2U7XG5cdFx0Y29uc3RydWN0b3IoX2NoYW5uZWwsIF9jb250ZXh0LCBfb3B0aW9ucyA9IHt9KSB7XG5cdFx0XHR0aGlzLl9jaGFubmVsID0gX2NoYW5uZWw7XG5cdFx0XHR0aGlzLl9jb250ZXh0ID0gX2NvbnRleHQ7XG5cdFx0XHR0aGlzLl9vcHRpb25zID0gX29wdGlvbnM7XG5cdFx0XHR0aGlzLl9jb25uZWN0aW9uID0gZ2V0Q29ubmVjdGlvbihfY2hhbm5lbCk7XG5cdFx0XHR0aGlzLl9zdG9yYWdlID0gZ2V0Q2hhbm5lbFN0b3JhZ2UoX2NoYW5uZWwpO1xuXHRcdH1cblx0XHRhc3luYyByZXF1ZXN0KHBhdGgsIGFjdGlvbiwgYXJncywgb3B0aW9ucyA9IHt9KSB7XG5cdFx0XHRsZXQgbm9ybWFsaXplZFBhdGggPSB0eXBlb2YgcGF0aCA9PT0gXCJzdHJpbmdcIiA/IFtwYXRoXSA6IHBhdGg7XG5cdFx0XHRsZXQgbm9ybWFsaXplZEFjdGlvbiA9IGFjdGlvbjtcblx0XHRcdGxldCBub3JtYWxpemVkQXJncyA9IGFyZ3M7XG5cdFx0XHRpZiAoQXJyYXkuaXNBcnJheShhY3Rpb24pICYmIGlzUmVmbGVjdEFjdGlvbihwYXRoKSkge1xuXHRcdFx0XHRvcHRpb25zID0gYXJncztcblx0XHRcdFx0bm9ybWFsaXplZEFyZ3MgPSBhY3Rpb247XG5cdFx0XHRcdG5vcm1hbGl6ZWRBY3Rpb24gPSBwYXRoO1xuXHRcdFx0XHRub3JtYWxpemVkUGF0aCA9IFtdO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXMuX2NvbnRleHQuZ2V0SG9zdCgpPy5yZXF1ZXN0KG5vcm1hbGl6ZWRQYXRoLCBub3JtYWxpemVkQWN0aW9uLCBub3JtYWxpemVkQXJncywgb3B0aW9ucywgdGhpcy5fY2hhbm5lbCk7XG5cdFx0fVxuXHRcdGFzeW5jIGRvSW1wb3J0TW9kdWxlKHVybCwgb3B0aW9ucyA9IHt9KSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5yZXF1ZXN0KFtdLCBXUmVmbGVjdEFjdGlvbi5JTVBPUlQsIFt1cmxdLCBvcHRpb25zKTtcblx0XHR9XG5cdFx0YXN5bmMgZGVmZXJNZXNzYWdlKHBheWxvYWQsIG9wdGlvbnMgPSB7fSkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX3N0b3JhZ2UuZGVmZXIoe1xuXHRcdFx0XHRjaGFubmVsOiB0aGlzLl9jaGFubmVsLFxuXHRcdFx0XHRzZW5kZXI6IHRoaXMuX2NvbnRleHQuaG9zdE5hbWUsXG5cdFx0XHRcdHR5cGU6IFwicmVxdWVzdFwiLFxuXHRcdFx0XHRwYXlsb2FkXG5cdFx0XHR9LCBvcHRpb25zKTtcblx0XHR9XG5cdFx0YXN5bmMgZ2V0UGVuZGluZ01lc3NhZ2VzKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX3N0b3JhZ2UuZ2V0RGVmZXJyZWRNZXNzYWdlcyh0aGlzLl9jaGFubmVsLCB7IHN0YXR1czogXCJwZW5kaW5nXCIgfSk7XG5cdFx0fVxuXHRcdGdldCBjb25uZWN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2Nvbm5lY3Rpb247XG5cdFx0fVxuXHRcdGdldCBjaGFubmVsTmFtZSgpIHtcblx0XHRcdHJldHVybiB0aGlzLl9jaGFubmVsO1xuXHRcdH1cblx0XHRnZXQgY29udGV4dCgpIHtcblx0XHRcdHJldHVybiB0aGlzLl9jb250ZXh0O1xuXHRcdH1cblx0fTtcblx0dmFyIENoYW5uZWxIYW5kbGVyID0gY2xhc3Mge1xuXHRcdF9jaGFubmVsO1xuXHRcdF9jb250ZXh0O1xuXHRcdF9vcHRpb25zO1xuXHRcdF9jb25uZWN0aW9uO1xuXHRcdF91bmlmaWVkO1xuXHRcdGdldCBfZm9yUmVzb2x2ZXMoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fdW5pZmllZC5fX2dldFByaXZhdGUoXCJfcGVuZGluZ1wiKTtcblx0XHR9XG5cdFx0Z2V0IF9zdWJzY3JpcHRpb25zKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX3VuaWZpZWQuX19nZXRQcml2YXRlKFwiX3N1YnNjcmlwdGlvbnNcIik7XG5cdFx0fVxuXHRcdGdldCBfYnJvYWRjYXN0cygpIHtcblx0XHRcdHJldHVybiB0aGlzLl91bmlmaWVkLl9fZ2V0UHJpdmF0ZShcIl90cmFuc3BvcnRzXCIpO1xuXHRcdH1cblx0XHRjb25zdHJ1Y3RvcihfY2hhbm5lbCwgX2NvbnRleHQsIF9vcHRpb25zID0ge30pIHtcblx0XHRcdHRoaXMuX2NoYW5uZWwgPSBfY2hhbm5lbDtcblx0XHRcdHRoaXMuX2NvbnRleHQgPSBfY29udGV4dDtcblx0XHRcdHRoaXMuX29wdGlvbnMgPSBfb3B0aW9ucztcblx0XHRcdHRoaXMuX2Nvbm5lY3Rpb24gPSBnZXRDb25uZWN0aW9uUG9vbCgpLmdldE9yQ3JlYXRlKF9jaGFubmVsLCBcImludGVybmFsXCIsIF9vcHRpb25zKTtcblx0XHRcdHRoaXMuX3VuaWZpZWQgPSBuZXcgVW5pZmllZENoYW5uZWwoe1xuXHRcdFx0XHRuYW1lOiBfY2hhbm5lbCxcblx0XHRcdFx0YXV0b0xpc3RlbjogZmFsc2UsXG5cdFx0XHRcdHRpbWVvdXQ6IF9vcHRpb25zPy50aW1lb3V0XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0Y3JlYXRlUmVtb3RlQ2hhbm5lbChjaGFubmVsLCBvcHRpb25zID0ge30sIGJyb2FkY2FzdCkge1xuXHRcdFx0Y29uc3QgdHJhbnNwb3J0ID0gbm9ybWFsaXplVHJhbnNwb3J0QmluZGluZyhicm9hZGNhc3QgPz8gdGhpcy5fY29udGV4dC4kY3JlYXRlT3JVc2VFeGlzdGluZ1JlbW90ZShjaGFubmVsLCBvcHRpb25zLCBicm9hZGNhc3QgPz8gbnVsbCk/Lm1lc3NhZ2VDaGFubmVsPy5wb3J0MSk7XG5cdFx0XHRjb25zdCB0cmFuc3BvcnRUeXBlID0gZ2V0RHluYW1pY1RyYW5zcG9ydFR5cGUodHJhbnNwb3J0Py50YXJnZXQgPz8gdHJhbnNwb3J0KTtcblx0XHRcdHRoaXMuX3VuaWZpZWQubGlzdGVuKHRyYW5zcG9ydD8udGFyZ2V0LCB7IHRhcmdldENoYW5uZWw6IGNoYW5uZWwgfSk7XG5cdFx0XHRpZiAodHJhbnNwb3J0KSB7XG5cdFx0XHRcdHRoaXMuX2Jyb2FkY2FzdHM/LnNldD8uKGNoYW5uZWwsIHRyYW5zcG9ydCk7XG5cdFx0XHRcdGlmICghKHRyYW5zcG9ydFR5cGUgPT09IFwic2VsZlwiICYmIHR5cGVvZiBwb3N0TWVzc2FnZSA9PT0gXCJ1bmRlZmluZWRcIikpIHRoaXMuX3VuaWZpZWQuY29ubmVjdCh0cmFuc3BvcnQsIHsgdGFyZ2V0Q2hhbm5lbDogY2hhbm5lbCB9KTtcblx0XHRcdFx0dGhpcy5fY29udGV4dC4kcmVnaXN0ZXJDb25uZWN0aW9uKHtcblx0XHRcdFx0XHRsb2NhbENoYW5uZWw6IHRoaXMuX2NoYW5uZWwsXG5cdFx0XHRcdFx0cmVtb3RlQ2hhbm5lbDogY2hhbm5lbCxcblx0XHRcdFx0XHRzZW5kZXI6IHRoaXMuX2NoYW5uZWwsXG5cdFx0XHRcdFx0ZGlyZWN0aW9uOiBcIm91dGdvaW5nXCIsXG5cdFx0XHRcdFx0dHJhbnNwb3J0VHlwZVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0dGhpcy5ub3RpZnlDaGFubmVsKGNoYW5uZWwsIHtcblx0XHRcdFx0XHRjb250ZXh0SWQ6IHRoaXMuX2NvbnRleHQuaWQsXG5cdFx0XHRcdFx0Y29udGV4dE5hbWU6IHRoaXMuX2NvbnRleHQuaG9zdE5hbWVcblx0XHRcdFx0fSwgXCJjb25uZWN0XCIpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG5ldyBSZW1vdGVDaGFubmVsSGVscGVyKGNoYW5uZWwsIHRoaXMuX2NvbnRleHQsIG9wdGlvbnMpO1xuXHRcdH1cblx0XHRnZXRDaGFubmVsKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2NoYW5uZWw7XG5cdFx0fVxuXHRcdGdldCBjb25uZWN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2Nvbm5lY3Rpb247XG5cdFx0fVxuXHRcdHJlcXVlc3QocGF0aCwgYWN0aW9uLCBhcmdzLCBvcHRpb25zID0ge30sIHRvQ2hhbm5lbCA9IFwid29ya2VyXCIpIHtcblx0XHRcdGxldCBub3JtYWxpemVkUGF0aCA9IHR5cGVvZiBwYXRoID09PSBcInN0cmluZ1wiID8gW3BhdGhdIDogcGF0aDtcblx0XHRcdGxldCBub3JtYWxpemVkQXJncyA9IGFyZ3M7XG5cdFx0XHRpZiAoQXJyYXkuaXNBcnJheShhY3Rpb24pICYmIGlzUmVmbGVjdEFjdGlvbihwYXRoKSkge1xuXHRcdFx0XHR0b0NoYW5uZWwgPSBvcHRpb25zO1xuXHRcdFx0XHRvcHRpb25zID0gYXJncztcblx0XHRcdFx0bm9ybWFsaXplZEFyZ3MgPSBhY3Rpb247XG5cdFx0XHRcdGFjdGlvbiA9IHBhdGg7XG5cdFx0XHRcdG5vcm1hbGl6ZWRQYXRoID0gW107XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcy5fdW5pZmllZC5pbnZva2UodG9DaGFubmVsLCBhY3Rpb24sIG5vcm1hbGl6ZWRQYXRoID8/IFtdLCBBcnJheS5pc0FycmF5KG5vcm1hbGl6ZWRBcmdzKSA/IG5vcm1hbGl6ZWRBcmdzIDogW25vcm1hbGl6ZWRBcmdzXSk7XG5cdFx0fVxuXHRcdHJlc29sdmVSZXNwb25zZShyZXFJZCwgcmVzdWx0KSB7XG5cdFx0XHR0aGlzLl9mb3JSZXNvbHZlcy5nZXQocmVxSWQpPy5yZXNvbHZlPy4ocmVzdWx0KTtcblx0XHRcdGNvbnN0IHByb21pc2UgPSB0aGlzLl9mb3JSZXNvbHZlcy5nZXQocmVxSWQpPy5wcm9taXNlO1xuXHRcdFx0dGhpcy5fZm9yUmVzb2x2ZXMuZGVsZXRlKHJlcUlkKTtcblx0XHRcdHJldHVybiBwcm9taXNlO1xuXHRcdH1cblx0XHRhc3luYyBoYW5kbGVBbmRSZXNwb25zZShyZXF1ZXN0LCByZXFJZCwgcmVzcG9uc2VGbikge31cblx0XHRub3RpZnlDaGFubmVsKHRhcmdldENoYW5uZWwsIHBheWxvYWQgPSB7fSwgdHlwZSA9IFwibm90aWZ5XCIpIHtcblx0XHRcdHJldHVybiB0aGlzLl91bmlmaWVkLm5vdGlmeSh0YXJnZXRDaGFubmVsLCB7XG5cdFx0XHRcdC4uLnBheWxvYWQsXG5cdFx0XHRcdGZyb206IHRoaXMuX2NoYW5uZWwsXG5cdFx0XHRcdHRvOiB0YXJnZXRDaGFubmVsXG5cdFx0XHR9LCB0eXBlKTtcblx0XHR9XG5cdFx0Z2V0Q29ubmVjdGVkQ2hhbm5lbHMoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fdW5pZmllZC5jb25uZWN0ZWRDaGFubmVscztcblx0XHR9XG5cdFx0Y2xvc2UoKSB7XG5cdFx0XHR0aGlzLl9zdWJzY3JpcHRpb25zLmZvckVhY2goKHMpID0+IHMudW5zdWJzY3JpYmUoKSk7XG5cdFx0XHR0aGlzLl9mb3JSZXNvbHZlcy5jbGVhcigpO1xuXHRcdFx0dGhpcy5fYnJvYWRjYXN0cz8udmFsdWVzPy4oKT8uZm9yRWFjaCgodHJhbnNwb3J0KSA9PiB0cmFuc3BvcnQuY2xvc2U/LigpKTtcblx0XHRcdHRoaXMuX2Jyb2FkY2FzdHM/LmNsZWFyPy4oKTtcblx0XHRcdHRoaXMuX3VuaWZpZWQuY2xvc2UoKTtcblx0XHR9XG5cdFx0Z2V0IHVuaWZpZWQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fdW5pZmllZDtcblx0XHR9XG5cdH07XG5cdC8qKlxuXHQqIENoYW5uZWwgQ29udGV4dCAtIE1hbmFnZXMgbXVsdGlwbGUgY2hhbm5lbHMgaW4gYSBzaW5nbGUgY29udGV4dFxuXHQqXG5cdCogVXNlIHRoaXMgd2hlbiB5b3UgbmVlZCBtdWx0aXBsZSBpbmRlcGVuZGVudCBjaGFubmVscyBpbiB0aGUgc2FtZVxuXHQqIEphdmFTY3JpcHQgY29udGV4dCAoc2FtZSB3aW5kb3csIGlmcmFtZSwgd29ya2VyLCBldGMuKVxuXHQqXG5cdCogU3VwcG9ydHM6XG5cdCogLSBDcmVhdGluZyBtdWx0aXBsZSBjaGFubmVscyBhdCBvbmNlIG9yIGRlZmVycmVkXG5cdCogLSBEeW5hbWljIHRyYW5zcG9ydCBhZGRpdGlvbiAod29ya2VycywgcG9ydHMsIHNvY2tldHMsIGV0Yy4pXG5cdCogLSBHbG9iYWwgc2VsZi9nbG9iYWxUaGlzIGFzIGRlZmF1bHQgdGFyZ2V0XG5cdCovXG5cdHZhciBDaGFubmVsQ29udGV4dCA9IGNsYXNzIHtcblx0XHRfb3B0aW9ucztcblx0XHRfaWQgPSBVVUlEdjQoKTtcblx0XHRfaG9zdE5hbWU7XG5cdFx0X2hvc3QgPSBudWxsO1xuXHRcdF9lbmRwb2ludHMgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuXHRcdF91bmlmaWVkQnlDaGFubmVsID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0XHRfdW5pZmllZENvbm5lY3Rpb25TdWJzID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0XHRfcmVtb3RlQ2hhbm5lbHMgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuXHRcdF9kZWZlcnJlZENoYW5uZWxzID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0XHRfY29ubmVjdGlvbkV2ZW50cyA9IG5ldyBDaGFubmVsU3ViamVjdCh7IGJ1ZmZlclNpemU6IDIwMCB9KTtcblx0XHRfY29ubmVjdGlvblJlZ2lzdHJ5ID0gbmV3IENvbm5lY3Rpb25SZWdpc3RyeSgoKSA9PiBVVUlEdjQoKSwgKGV2ZW50KSA9PiB0aGlzLl9lbWl0Q29ubmVjdGlvbkV2ZW50KGV2ZW50KSk7XG5cdFx0X2Nsb3NlZCA9IGZhbHNlO1xuXHRcdF9nbG9iYWxTZWxmID0gbnVsbDtcblx0XHRjb25zdHJ1Y3Rvcihfb3B0aW9ucyA9IHt9KSB7XG5cdFx0XHR0aGlzLl9vcHRpb25zID0gX29wdGlvbnM7XG5cdFx0XHR0aGlzLl9ob3N0TmFtZSA9IF9vcHRpb25zLm5hbWUgPz8gYGN0eC0ke3RoaXMuX2lkLnNsaWNlKDAsIDgpfWA7XG5cdFx0XHRpZiAoX29wdGlvbnMudXNlR2xvYmFsU2VsZiAhPT0gZmFsc2UpIHRoaXMuX2dsb2JhbFNlbGYgPSB0eXBlb2YgZ2xvYmFsVGhpcyAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFRoaXMgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiBudWxsO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIEluaXRpYWxpemUvZ2V0IHRoZSBob3N0IGNoYW5uZWwgZm9yIHRoaXMgY29udGV4dFxuXHRcdCovXG5cdFx0aW5pdEhvc3QobmFtZSkge1xuXHRcdFx0aWYgKHRoaXMuX2hvc3QgJiYgIW5hbWUpIHJldHVybiB0aGlzLl9ob3N0O1xuXHRcdFx0Y29uc3QgaG9zdE5hbWUgPSBuYW1lID8/IHRoaXMuX2hvc3ROYW1lO1xuXHRcdFx0dGhpcy5faG9zdE5hbWUgPSBob3N0TmFtZTtcblx0XHRcdGlmICh0aGlzLl9lbmRwb2ludHMuaGFzKGhvc3ROYW1lKSkge1xuXHRcdFx0XHR0aGlzLl9ob3N0ID0gdGhpcy5fZW5kcG9pbnRzLmdldChob3N0TmFtZSkuaGFuZGxlcjtcblx0XHRcdFx0cmV0dXJuIHRoaXMuX2hvc3Q7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLl9ob3N0ID0gbmV3IENoYW5uZWxIYW5kbGVyKGhvc3ROYW1lLCB0aGlzLCB0aGlzLl9vcHRpb25zLmRlZmF1bHRPcHRpb25zKTtcblx0XHRcdGNvbnN0IGVuZHBvaW50ID0ge1xuXHRcdFx0XHRuYW1lOiBob3N0TmFtZSxcblx0XHRcdFx0aGFuZGxlcjogdGhpcy5faG9zdCxcblx0XHRcdFx0Y29ubmVjdGlvbjogdGhpcy5faG9zdC5jb25uZWN0aW9uLFxuXHRcdFx0XHRzdWJzY3JpcHRpb25zOiBbXSxcblx0XHRcdFx0cmVhZHk6IFByb21pc2UucmVzb2x2ZShudWxsKSxcblx0XHRcdFx0dW5pZmllZDogdGhpcy5faG9zdC51bmlmaWVkXG5cdFx0XHR9O1xuXHRcdFx0dGhpcy5fZW5kcG9pbnRzLnNldChob3N0TmFtZSwgZW5kcG9pbnQpO1xuXHRcdFx0dGhpcy5fcmVnaXN0ZXJVbmlmaWVkQ2hhbm5lbChob3N0TmFtZSwgdGhpcy5faG9zdC51bmlmaWVkKTtcblx0XHRcdHJldHVybiB0aGlzLl9ob3N0O1xuXHRcdH1cblx0XHQvKipcblx0XHQqIEdldCB0aGUgaG9zdCBjaGFubmVsXG5cdFx0Ki9cblx0XHRnZXRIb3N0KCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2hvc3QgPz8gdGhpcy5pbml0SG9zdCgpO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIEdldCBob3N0IG5hbWVcblx0XHQqL1xuXHRcdGdldCBob3N0TmFtZSgpIHtcblx0XHRcdHJldHVybiB0aGlzLl9ob3N0TmFtZTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBHZXQgY29udGV4dCBJRFxuXHRcdCovXG5cdFx0Z2V0IGlkKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2lkO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIE9ic2VydmFibGU6IGNvbm5lY3Rpb24gZXZlbnRzIGluIHRoaXMgY29udGV4dFxuXHRcdCovXG5cdFx0Z2V0IG9uQ29ubmVjdGlvbigpIHtcblx0XHRcdHJldHVybiB0aGlzLl9jb25uZWN0aW9uRXZlbnRzO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIFN1YnNjcmliZSB0byBjb25uZWN0aW9uIGV2ZW50c1xuXHRcdCovXG5cdFx0c3Vic2NyaWJlQ29ubmVjdGlvbnMoaGFuZGxlcikge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2Nvbm5lY3Rpb25FdmVudHMuc3Vic2NyaWJlKGhhbmRsZXIpO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIE5vdGlmeSBhbGwgY3VycmVudGx5IGtub3duIGFjdGl2ZSBjb25uZWN0aW9ucy5cblx0XHQqIFVzZWZ1bCBmb3Igc2VydmljZSB3b3JrZXIgLyBjcm9zcy10YWIgaGFuZHNoYWtlcy5cblx0XHQqL1xuXHRcdG5vdGlmeUNvbm5lY3Rpb25zKHBheWxvYWQgPSB7fSwgcXVlcnkgPSB7fSkge1xuXHRcdFx0bGV0IHNlbnQgPSAwO1xuXHRcdFx0Zm9yIChjb25zdCBlbmRwb2ludCBvZiB0aGlzLl9lbmRwb2ludHMudmFsdWVzKCkpIHtcblx0XHRcdFx0Y29uc3QgY29ubmVjdGVkVGFyZ2V0cyA9IGVuZHBvaW50LmhhbmRsZXIuZ2V0Q29ubmVjdGVkQ2hhbm5lbHMoKTtcblx0XHRcdFx0Zm9yIChjb25zdCByZW1vdGVDaGFubmVsIG9mIGNvbm5lY3RlZFRhcmdldHMpIHtcblx0XHRcdFx0XHRpZiAocXVlcnkubG9jYWxDaGFubmVsICYmIHF1ZXJ5LmxvY2FsQ2hhbm5lbCAhPT0gZW5kcG9pbnQubmFtZSkgY29udGludWU7XG5cdFx0XHRcdFx0aWYgKHF1ZXJ5LnJlbW90ZUNoYW5uZWwgJiYgcXVlcnkucmVtb3RlQ2hhbm5lbCAhPT0gcmVtb3RlQ2hhbm5lbCkgY29udGludWU7XG5cdFx0XHRcdFx0Y29uc3QgZXhpc3RpbmcgPSB0aGlzLnF1ZXJ5Q29ubmVjdGlvbnMoe1xuXHRcdFx0XHRcdFx0bG9jYWxDaGFubmVsOiBlbmRwb2ludC5uYW1lLFxuXHRcdFx0XHRcdFx0cmVtb3RlQ2hhbm5lbCxcblx0XHRcdFx0XHRcdHN0YXR1czogXCJhY3RpdmVcIlxuXHRcdFx0XHRcdH0pWzBdO1xuXHRcdFx0XHRcdGlmIChxdWVyeS5zZW5kZXIgJiYgZXhpc3Rpbmc/LnNlbmRlciAhPT0gcXVlcnkuc2VuZGVyKSBjb250aW51ZTtcblx0XHRcdFx0XHRpZiAocXVlcnkudHJhbnNwb3J0VHlwZSAmJiBleGlzdGluZz8udHJhbnNwb3J0VHlwZSAhPT0gcXVlcnkudHJhbnNwb3J0VHlwZSkgY29udGludWU7XG5cdFx0XHRcdFx0aWYgKHF1ZXJ5LmNoYW5uZWwgJiYgcXVlcnkuY2hhbm5lbCAhPT0gZW5kcG9pbnQubmFtZSAmJiBxdWVyeS5jaGFubmVsICE9PSByZW1vdGVDaGFubmVsKSBjb250aW51ZTtcblx0XHRcdFx0XHRpZiAoZW5kcG9pbnQuaGFuZGxlci5ub3RpZnlDaGFubmVsKHJlbW90ZUNoYW5uZWwsIHBheWxvYWQsIFwibm90aWZ5XCIpKSBzZW50Kys7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBzZW50O1xuXHRcdH1cblx0XHQvKipcblx0XHQqIFF1ZXJ5IHRyYWNrZWQgY29ubmVjdGlvbnMgd2l0aCBmaWx0ZXJzXG5cdFx0Ki9cblx0XHRxdWVyeUNvbm5lY3Rpb25zKHF1ZXJ5ID0ge30pIHtcblx0XHRcdHJldHVybiB0aGlzLl9jb25uZWN0aW9uUmVnaXN0cnkucXVlcnkocXVlcnkpLm1hcCgoY29ubmVjdGlvbikgPT4gKHtcblx0XHRcdFx0Li4uY29ubmVjdGlvbixcblx0XHRcdFx0Y29udGV4dElkOiB0aGlzLl9pZFxuXHRcdFx0fSkpO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIENyZWF0ZSBhIG5ldyBjaGFubmVsIGVuZHBvaW50IGluIHRoaXMgY29udGV4dFxuXHRcdCpcblx0XHQqIEBwYXJhbSBuYW1lIC0gQ2hhbm5lbCBuYW1lXG5cdFx0KiBAcGFyYW0gb3B0aW9ucyAtIENvbm5lY3Rpb24gb3B0aW9uc1xuXHRcdCogQHJldHVybnMgQ2hhbm5lbEVuZHBvaW50IHdpdGggaGFuZGxlciBhbmQgY29ubmVjdGlvblxuXHRcdCovXG5cdFx0Y3JlYXRlQ2hhbm5lbChuYW1lLCBvcHRpb25zID0ge30pIHtcblx0XHRcdGlmICh0aGlzLl9lbmRwb2ludHMuaGFzKG5hbWUpKSByZXR1cm4gdGhpcy5fZW5kcG9pbnRzLmdldChuYW1lKTtcblx0XHRcdGNvbnN0IGhhbmRsZXIgPSBuZXcgQ2hhbm5lbEhhbmRsZXIobmFtZSwgdGhpcywge1xuXHRcdFx0XHQuLi50aGlzLl9vcHRpb25zLmRlZmF1bHRPcHRpb25zLFxuXHRcdFx0XHQuLi5vcHRpb25zXG5cdFx0XHR9KTtcblx0XHRcdGNvbnN0IGVuZHBvaW50ID0ge1xuXHRcdFx0XHRuYW1lLFxuXHRcdFx0XHRoYW5kbGVyLFxuXHRcdFx0XHRjb25uZWN0aW9uOiBoYW5kbGVyLmNvbm5lY3Rpb24sXG5cdFx0XHRcdHN1YnNjcmlwdGlvbnM6IFtdLFxuXHRcdFx0XHRyZWFkeTogUHJvbWlzZS5yZXNvbHZlKG51bGwpLFxuXHRcdFx0XHR1bmlmaWVkOiBoYW5kbGVyLnVuaWZpZWRcblx0XHRcdH07XG5cdFx0XHR0aGlzLl9lbmRwb2ludHMuc2V0KG5hbWUsIGVuZHBvaW50KTtcblx0XHRcdHRoaXMuX3JlZ2lzdGVyVW5pZmllZENoYW5uZWwobmFtZSwgaGFuZGxlci51bmlmaWVkKTtcblx0XHRcdHJldHVybiBlbmRwb2ludDtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBDcmVhdGUgbXVsdGlwbGUgY2hhbm5lbCBlbmRwb2ludHMgYXQgb25jZVxuXHRcdCpcblx0XHQqIEBwYXJhbSBuYW1lcyAtIEFycmF5IG9mIGNoYW5uZWwgbmFtZXNcblx0XHQqIEBwYXJhbSBvcHRpb25zIC0gU2hhcmVkIGNvbm5lY3Rpb24gb3B0aW9uc1xuXHRcdCogQHJldHVybnMgTWFwIG9mIGNoYW5uZWwgbmFtZXMgdG8gZW5kcG9pbnRzXG5cdFx0Ki9cblx0XHRjcmVhdGVDaGFubmVscyhuYW1lcywgb3B0aW9ucyA9IHt9KSB7XG5cdFx0XHRjb25zdCByZXN1bHQgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuXHRcdFx0Zm9yIChjb25zdCBuYW1lIG9mIG5hbWVzKSByZXN1bHQuc2V0KG5hbWUsIHRoaXMuY3JlYXRlQ2hhbm5lbChuYW1lLCBvcHRpb25zKSk7XG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH1cblx0XHQvKipcblx0XHQqIEdldCBhbiBleGlzdGluZyBjaGFubmVsIGVuZHBvaW50XG5cdFx0Ki9cblx0XHRnZXRDaGFubmVsKG5hbWUpIHtcblx0XHRcdHJldHVybiB0aGlzLl9lbmRwb2ludHMuZ2V0KG5hbWUpO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIEdldCBvciBjcmVhdGUgYSBjaGFubmVsIGVuZHBvaW50XG5cdFx0Ki9cblx0XHRnZXRPckNyZWF0ZUNoYW5uZWwobmFtZSwgb3B0aW9ucyA9IHt9KSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fZW5kcG9pbnRzLmdldChuYW1lKSA/PyB0aGlzLmNyZWF0ZUNoYW5uZWwobmFtZSwgb3B0aW9ucyk7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogQ2hlY2sgaWYgY2hhbm5lbCBleGlzdHMgaW4gdGhpcyBjb250ZXh0XG5cdFx0Ki9cblx0XHRoYXNDaGFubmVsKG5hbWUpIHtcblx0XHRcdHJldHVybiB0aGlzLl9lbmRwb2ludHMuaGFzKG5hbWUpO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIEdldCBhbGwgY2hhbm5lbCBuYW1lcyBpbiB0aGlzIGNvbnRleHRcblx0XHQqL1xuXHRcdGdldENoYW5uZWxOYW1lcygpIHtcblx0XHRcdHJldHVybiBbLi4udGhpcy5fZW5kcG9pbnRzLmtleXMoKV07XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogR2V0IHRvdGFsIG51bWJlciBvZiBjaGFubmVsc1xuXHRcdCovXG5cdFx0Z2V0IHNpemUoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fZW5kcG9pbnRzLnNpemU7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogUmVnaXN0ZXIgYSBkZWZlcnJlZCBjaGFubmVsIHRoYXQgd2lsbCBiZSBpbml0aWFsaXplZCBvbiBmaXJzdCB1c2Vcblx0XHQqXG5cdFx0KiBAcGFyYW0gbmFtZSAtIENoYW5uZWwgbmFtZVxuXHRcdCogQHBhcmFtIGluaXRGbiAtIEZ1bmN0aW9uIHRvIGluaXRpYWxpemUgdGhlIGNoYW5uZWxcblx0XHQqL1xuXHRcdGRlZmVyKG5hbWUsIGluaXRGbikge1xuXHRcdFx0dGhpcy5fZGVmZXJyZWRDaGFubmVscy5zZXQobmFtZSwgaW5pdEZuKTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBJbml0aWFsaXplIGEgcHJldmlvdXNseSBkZWZlcnJlZCBjaGFubmVsXG5cdFx0Ki9cblx0XHRhc3luYyBpbml0RGVmZXJyZWQobmFtZSkge1xuXHRcdFx0Y29uc3QgaW5pdEZuID0gdGhpcy5fZGVmZXJyZWRDaGFubmVscy5nZXQobmFtZSk7XG5cdFx0XHRpZiAoIWluaXRGbikgcmV0dXJuIG51bGw7XG5cdFx0XHRjb25zdCBlbmRwb2ludCA9IGF3YWl0IGluaXRGbigpO1xuXHRcdFx0dGhpcy5fZW5kcG9pbnRzLnNldChuYW1lLCBlbmRwb2ludCk7XG5cdFx0XHR0aGlzLl9kZWZlcnJlZENoYW5uZWxzLmRlbGV0ZShuYW1lKTtcblx0XHRcdHJldHVybiBlbmRwb2ludDtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBDaGVjayBpZiBjaGFubmVsIGlzIGRlZmVycmVkIChub3QgeWV0IGluaXRpYWxpemVkKVxuXHRcdCovXG5cdFx0aXNEZWZlcnJlZChuYW1lKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fZGVmZXJyZWRDaGFubmVscy5oYXMobmFtZSk7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogR2V0IGNoYW5uZWwsIGluaXRpYWxpemluZyBkZWZlcnJlZCBpZiBuZWVkZWRcblx0XHQqL1xuXHRcdGFzeW5jIGdldENoYW5uZWxBc3luYyhuYW1lKSB7XG5cdFx0XHRpZiAodGhpcy5fZW5kcG9pbnRzLmhhcyhuYW1lKSkgcmV0dXJuIHRoaXMuX2VuZHBvaW50cy5nZXQobmFtZSk7XG5cdFx0XHRpZiAodGhpcy5fZGVmZXJyZWRDaGFubmVscy5oYXMobmFtZSkpIHJldHVybiB0aGlzLmluaXREZWZlcnJlZChuYW1lKTtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIEFkZCBhIFdvcmtlciBjaGFubmVsIGR5bmFtaWNhbGx5XG5cdFx0KlxuXHRcdCogQHBhcmFtIG5hbWUgLSBDaGFubmVsIG5hbWVcblx0XHQqIEBwYXJhbSB3b3JrZXIgLSBXb3JrZXIgaW5zdGFuY2UsIFVSTCwgb3IgY29kZSBzdHJpbmdcblx0XHQqIEBwYXJhbSBvcHRpb25zIC0gQ29ubmVjdGlvbiBvcHRpb25zXG5cdFx0Ki9cblx0XHRhc3luYyBhZGRXb3JrZXIobmFtZSwgd29ya2VyLCBvcHRpb25zID0ge30pIHtcblx0XHRcdGNvbnN0IHdvcmtlckluc3RhbmNlID0gbG9hZFdvcmtlcih3b3JrZXIpO1xuXHRcdFx0aWYgKCF3b3JrZXJJbnN0YW5jZSkgdGhyb3cgbmV3IEVycm9yKGBGYWlsZWQgdG8gY3JlYXRlIHdvcmtlciBmb3IgY2hhbm5lbDogJHtuYW1lfWApO1xuXHRcdFx0Y29uc3QgaGFuZGxlciA9IG5ldyBDaGFubmVsSGFuZGxlcihuYW1lLCB0aGlzLCB7XG5cdFx0XHRcdC4uLnRoaXMuX29wdGlvbnMuZGVmYXVsdE9wdGlvbnMsXG5cdFx0XHRcdC4uLm9wdGlvbnNcblx0XHRcdH0pO1xuXHRcdFx0Y29uc3QgcmVhZHkgPSBoYW5kbGVyLmNyZWF0ZVJlbW90ZUNoYW5uZWwobmFtZSwgb3B0aW9ucywgd29ya2VySW5zdGFuY2UpO1xuXHRcdFx0Y29uc3QgZW5kcG9pbnQgPSB7XG5cdFx0XHRcdG5hbWUsXG5cdFx0XHRcdGhhbmRsZXIsXG5cdFx0XHRcdGNvbm5lY3Rpb246IGhhbmRsZXIuY29ubmVjdGlvbixcblx0XHRcdFx0c3Vic2NyaXB0aW9uczogW10sXG5cdFx0XHRcdHRyYW5zcG9ydFR5cGU6IFwid29ya2VyXCIsXG5cdFx0XHRcdHJlYWR5OiBQcm9taXNlLnJlc29sdmUocmVhZHkpLFxuXHRcdFx0XHR1bmlmaWVkOiBoYW5kbGVyLnVuaWZpZWRcblx0XHRcdH07XG5cdFx0XHR0aGlzLl9lbmRwb2ludHMuc2V0KG5hbWUsIGVuZHBvaW50KTtcblx0XHRcdHRoaXMuX3JlZ2lzdGVyVW5pZmllZENoYW5uZWwobmFtZSwgaGFuZGxlci51bmlmaWVkKTtcblx0XHRcdHRoaXMuX3JlbW90ZUNoYW5uZWxzLnNldChuYW1lLCB7XG5cdFx0XHRcdGNoYW5uZWw6IG5hbWUsXG5cdFx0XHRcdGNvbnRleHQ6IHRoaXMsXG5cdFx0XHRcdHJlbW90ZTogUHJvbWlzZS5yZXNvbHZlKHJlYWR5KSxcblx0XHRcdFx0dHJhbnNwb3J0OiB3b3JrZXJJbnN0YW5jZSxcblx0XHRcdFx0dHJhbnNwb3J0VHlwZTogXCJ3b3JrZXJcIlxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gZW5kcG9pbnQ7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogQWRkIGEgTWVzc2FnZVBvcnQgY2hhbm5lbCBkeW5hbWljYWxseVxuXHRcdCpcblx0XHQqIEBwYXJhbSBuYW1lIC0gQ2hhbm5lbCBuYW1lXG5cdFx0KiBAcGFyYW0gcG9ydCAtIE1lc3NhZ2VQb3J0IGluc3RhbmNlXG5cdFx0KiBAcGFyYW0gb3B0aW9ucyAtIENvbm5lY3Rpb24gb3B0aW9uc1xuXHRcdCovXG5cdFx0YXN5bmMgYWRkUG9ydChuYW1lLCBwb3J0LCBvcHRpb25zID0ge30pIHtcblx0XHRcdGNvbnN0IGhhbmRsZXIgPSBuZXcgQ2hhbm5lbEhhbmRsZXIobmFtZSwgdGhpcywge1xuXHRcdFx0XHQuLi50aGlzLl9vcHRpb25zLmRlZmF1bHRPcHRpb25zLFxuXHRcdFx0XHQuLi5vcHRpb25zXG5cdFx0XHR9KTtcblx0XHRcdHBvcnQuc3RhcnQ/LigpO1xuXHRcdFx0Y29uc3QgcmVhZHkgPSBoYW5kbGVyLmNyZWF0ZVJlbW90ZUNoYW5uZWwobmFtZSwgb3B0aW9ucywgcG9ydCk7XG5cdFx0XHRjb25zdCBlbmRwb2ludCA9IHtcblx0XHRcdFx0bmFtZSxcblx0XHRcdFx0aGFuZGxlcixcblx0XHRcdFx0Y29ubmVjdGlvbjogaGFuZGxlci5jb25uZWN0aW9uLFxuXHRcdFx0XHRzdWJzY3JpcHRpb25zOiBbXSxcblx0XHRcdFx0dHJhbnNwb3J0VHlwZTogXCJtZXNzYWdlLXBvcnRcIixcblx0XHRcdFx0cmVhZHk6IFByb21pc2UucmVzb2x2ZShyZWFkeSksXG5cdFx0XHRcdHVuaWZpZWQ6IGhhbmRsZXIudW5pZmllZFxuXHRcdFx0fTtcblx0XHRcdHRoaXMuX2VuZHBvaW50cy5zZXQobmFtZSwgZW5kcG9pbnQpO1xuXHRcdFx0dGhpcy5fcmVnaXN0ZXJVbmlmaWVkQ2hhbm5lbChuYW1lLCBoYW5kbGVyLnVuaWZpZWQpO1xuXHRcdFx0dGhpcy5fcmVtb3RlQ2hhbm5lbHMuc2V0KG5hbWUsIHtcblx0XHRcdFx0Y2hhbm5lbDogbmFtZSxcblx0XHRcdFx0Y29udGV4dDogdGhpcyxcblx0XHRcdFx0cmVtb3RlOiBQcm9taXNlLnJlc29sdmUocmVhZHkpLFxuXHRcdFx0XHR0cmFuc3BvcnQ6IHBvcnQsXG5cdFx0XHRcdHRyYW5zcG9ydFR5cGU6IFwibWVzc2FnZS1wb3J0XCJcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIGVuZHBvaW50O1xuXHRcdH1cblx0XHQvKipcblx0XHQqIEFkZCBhIEJyb2FkY2FzdENoYW5uZWwgZHluYW1pY2FsbHlcblx0XHQqXG5cdFx0KiBAcGFyYW0gbmFtZSAtIENoYW5uZWwgbmFtZSAoYWxzbyB1c2VkIGFzIEJyb2FkY2FzdENoYW5uZWwgbmFtZSBpZiBub3QgcHJvdmlkZWQpXG5cdFx0KiBAcGFyYW0gYnJvYWRjYXN0TmFtZSAtIE9wdGlvbmFsIEJyb2FkY2FzdENoYW5uZWwgbmFtZSAoZGVmYXVsdHMgdG8gY2hhbm5lbCBuYW1lKVxuXHRcdCogQHBhcmFtIG9wdGlvbnMgLSBDb25uZWN0aW9uIG9wdGlvbnNcblx0XHQqL1xuXHRcdGFzeW5jIGFkZEJyb2FkY2FzdChuYW1lLCBicm9hZGNhc3ROYW1lLCBvcHRpb25zID0ge30pIHtcblx0XHRcdGNvbnN0IGJjID0gbmV3IEJyb2FkY2FzdENoYW5uZWwoYnJvYWRjYXN0TmFtZSA/PyBuYW1lKTtcblx0XHRcdGNvbnN0IGhhbmRsZXIgPSBuZXcgQ2hhbm5lbEhhbmRsZXIobmFtZSwgdGhpcywge1xuXHRcdFx0XHQuLi50aGlzLl9vcHRpb25zLmRlZmF1bHRPcHRpb25zLFxuXHRcdFx0XHQuLi5vcHRpb25zXG5cdFx0XHR9KTtcblx0XHRcdGNvbnN0IHJlYWR5ID0gaGFuZGxlci5jcmVhdGVSZW1vdGVDaGFubmVsKG5hbWUsIG9wdGlvbnMsIGJjKTtcblx0XHRcdGNvbnN0IGVuZHBvaW50ID0ge1xuXHRcdFx0XHRuYW1lLFxuXHRcdFx0XHRoYW5kbGVyLFxuXHRcdFx0XHRjb25uZWN0aW9uOiBoYW5kbGVyLmNvbm5lY3Rpb24sXG5cdFx0XHRcdHN1YnNjcmlwdGlvbnM6IFtdLFxuXHRcdFx0XHR0cmFuc3BvcnRUeXBlOiBcImJyb2FkY2FzdFwiLFxuXHRcdFx0XHRyZWFkeTogUHJvbWlzZS5yZXNvbHZlKHJlYWR5KSxcblx0XHRcdFx0dW5pZmllZDogaGFuZGxlci51bmlmaWVkXG5cdFx0XHR9O1xuXHRcdFx0dGhpcy5fZW5kcG9pbnRzLnNldChuYW1lLCBlbmRwb2ludCk7XG5cdFx0XHR0aGlzLl9yZWdpc3RlclVuaWZpZWRDaGFubmVsKG5hbWUsIGhhbmRsZXIudW5pZmllZCk7XG5cdFx0XHR0aGlzLl9yZW1vdGVDaGFubmVscy5zZXQobmFtZSwge1xuXHRcdFx0XHRjaGFubmVsOiBuYW1lLFxuXHRcdFx0XHRjb250ZXh0OiB0aGlzLFxuXHRcdFx0XHRyZW1vdGU6IFByb21pc2UucmVzb2x2ZShyZWFkeSksXG5cdFx0XHRcdHRyYW5zcG9ydDogYmMsXG5cdFx0XHRcdHRyYW5zcG9ydFR5cGU6IFwiYnJvYWRjYXN0XCJcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIGVuZHBvaW50O1xuXHRcdH1cblx0XHQvKipcblx0XHQqIEFkZCBhIGNoYW5uZWwgdXNpbmcgc2VsZi9nbG9iYWxUaGlzIChmb3Igc2FtZS1jb250ZXh0IGNvbW11bmljYXRpb24pXG5cdFx0KlxuXHRcdCogQHBhcmFtIG5hbWUgLSBDaGFubmVsIG5hbWVcblx0XHQqIEBwYXJhbSBvcHRpb25zIC0gQ29ubmVjdGlvbiBvcHRpb25zXG5cdFx0Ki9cblx0XHRhZGRTZWxmQ2hhbm5lbChuYW1lLCBvcHRpb25zID0ge30pIHtcblx0XHRcdGNvbnN0IGhhbmRsZXIgPSBuZXcgQ2hhbm5lbEhhbmRsZXIobmFtZSwgdGhpcywge1xuXHRcdFx0XHQuLi50aGlzLl9vcHRpb25zLmRlZmF1bHRPcHRpb25zLFxuXHRcdFx0XHQuLi5vcHRpb25zXG5cdFx0XHR9KTtcblx0XHRcdGNvbnN0IHNlbGZUYXJnZXQgPSB0aGlzLl9nbG9iYWxTZWxmID8/ICh0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiBudWxsKTtcblx0XHRcdGNvbnN0IGVuZHBvaW50ID0ge1xuXHRcdFx0XHRuYW1lLFxuXHRcdFx0XHRoYW5kbGVyLFxuXHRcdFx0XHRjb25uZWN0aW9uOiBoYW5kbGVyLmNvbm5lY3Rpb24sXG5cdFx0XHRcdHN1YnNjcmlwdGlvbnM6IFtdLFxuXHRcdFx0XHR0cmFuc3BvcnRUeXBlOiBcInNlbGZcIixcblx0XHRcdFx0cmVhZHk6IFByb21pc2UucmVzb2x2ZShzZWxmVGFyZ2V0ID8gaGFuZGxlci5jcmVhdGVSZW1vdGVDaGFubmVsKG5hbWUsIG9wdGlvbnMsIHNlbGZUYXJnZXQpIDogbnVsbCksXG5cdFx0XHRcdHVuaWZpZWQ6IGhhbmRsZXIudW5pZmllZFxuXHRcdFx0fTtcblx0XHRcdHRoaXMuX2VuZHBvaW50cy5zZXQobmFtZSwgZW5kcG9pbnQpO1xuXHRcdFx0dGhpcy5fcmVnaXN0ZXJVbmlmaWVkQ2hhbm5lbChuYW1lLCBoYW5kbGVyLnVuaWZpZWQpO1xuXHRcdFx0cmV0dXJuIGVuZHBvaW50O1xuXHRcdH1cblx0XHQvKipcblx0XHQqIEFkZCBjaGFubmVsIHdpdGggZHluYW1pYyB0cmFuc3BvcnQgY29uZmlndXJhdGlvblxuXHRcdCpcblx0XHQqIEBwYXJhbSBuYW1lIC0gQ2hhbm5lbCBuYW1lXG5cdFx0KiBAcGFyYW0gY29uZmlnIC0gVHJhbnNwb3J0IGNvbmZpZ3VyYXRpb25cblx0XHQqL1xuXHRcdGFzeW5jIGFkZFRyYW5zcG9ydChuYW1lLCBjb25maWcpIHtcblx0XHRcdGNvbnN0IG9wdGlvbnMgPSBjb25maWcub3B0aW9ucyA/PyB7fTtcblx0XHRcdHN3aXRjaCAoY29uZmlnLnR5cGUpIHtcblx0XHRcdFx0Y2FzZSBcIndvcmtlclwiOlxuXHRcdFx0XHRcdGlmICghY29uZmlnLndvcmtlcikgdGhyb3cgbmV3IEVycm9yKFwiV29ya2VyIHJlcXVpcmVkIGZvciB3b3JrZXIgdHJhbnNwb3J0XCIpO1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLmFkZFdvcmtlcihuYW1lLCBjb25maWcud29ya2VyLCBvcHRpb25zKTtcblx0XHRcdFx0Y2FzZSBcIm1lc3NhZ2UtcG9ydFwiOlxuXHRcdFx0XHRcdGlmICghY29uZmlnLnBvcnQpIHRocm93IG5ldyBFcnJvcihcIlBvcnQgcmVxdWlyZWQgZm9yIG1lc3NhZ2UtcG9ydCB0cmFuc3BvcnRcIik7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuYWRkUG9ydChuYW1lLCBjb25maWcucG9ydCwgb3B0aW9ucyk7XG5cdFx0XHRcdGNhc2UgXCJicm9hZGNhc3RcIjpcblx0XHRcdFx0XHRjb25zdCBiY05hbWUgPSB0eXBlb2YgY29uZmlnLmJyb2FkY2FzdCA9PT0gXCJzdHJpbmdcIiA/IGNvbmZpZy5icm9hZGNhc3QgOiB2b2lkIDA7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuYWRkQnJvYWRjYXN0KG5hbWUsIGJjTmFtZSwgb3B0aW9ucyk7XG5cdFx0XHRcdGNhc2UgXCJzZWxmXCI6IHJldHVybiB0aGlzLmFkZFNlbGZDaGFubmVsKG5hbWUsIG9wdGlvbnMpO1xuXHRcdFx0XHRkZWZhdWx0OiByZXR1cm4gdGhpcy5jcmVhdGVDaGFubmVsKG5hbWUsIG9wdGlvbnMpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHQvKipcblx0XHQqIENyZWF0ZSBhIE1lc3NhZ2VDaGFubmVsIHBhaXIgZm9yIGJpZGlyZWN0aW9uYWwgY29tbXVuaWNhdGlvblxuXHRcdCpcblx0XHQqIEBwYXJhbSBuYW1lMSAtIEZpcnN0IGNoYW5uZWwgbmFtZVxuXHRcdCogQHBhcmFtIG5hbWUyIC0gU2Vjb25kIGNoYW5uZWwgbmFtZVxuXHRcdCogQHJldHVybnMgQm90aCBlbmRwb2ludHMgY29ubmVjdGVkIHZpYSBNZXNzYWdlQ2hhbm5lbFxuXHRcdCovXG5cdFx0Y3JlYXRlQ2hhbm5lbFBhaXIobmFtZTEsIG5hbWUyLCBvcHRpb25zID0ge30pIHtcblx0XHRcdGNvbnN0IG1jID0gbmV3IE1lc3NhZ2VDaGFubmVsKCk7XG5cdFx0XHRjb25zdCBoYW5kbGVyMSA9IG5ldyBDaGFubmVsSGFuZGxlcihuYW1lMSwgdGhpcywge1xuXHRcdFx0XHQuLi50aGlzLl9vcHRpb25zLmRlZmF1bHRPcHRpb25zLFxuXHRcdFx0XHQuLi5vcHRpb25zXG5cdFx0XHR9KTtcblx0XHRcdGNvbnN0IGhhbmRsZXIyID0gbmV3IENoYW5uZWxIYW5kbGVyKG5hbWUyLCB0aGlzLCB7XG5cdFx0XHRcdC4uLnRoaXMuX29wdGlvbnMuZGVmYXVsdE9wdGlvbnMsXG5cdFx0XHRcdC4uLm9wdGlvbnNcblx0XHRcdH0pO1xuXHRcdFx0bWMucG9ydDEuc3RhcnQoKTtcblx0XHRcdG1jLnBvcnQyLnN0YXJ0KCk7XG5cdFx0XHRjb25zdCByZWFkeTEgPSBQcm9taXNlLnJlc29sdmUoaGFuZGxlcjEuY3JlYXRlUmVtb3RlQ2hhbm5lbChuYW1lMiwgb3B0aW9ucywgbWMucG9ydDEpKTtcblx0XHRcdGNvbnN0IHJlYWR5MiA9IFByb21pc2UucmVzb2x2ZShoYW5kbGVyMi5jcmVhdGVSZW1vdGVDaGFubmVsKG5hbWUxLCBvcHRpb25zLCBtYy5wb3J0MikpO1xuXHRcdFx0Y29uc3QgY2hhbm5lbDEgPSB7XG5cdFx0XHRcdG5hbWU6IG5hbWUxLFxuXHRcdFx0XHRoYW5kbGVyOiBoYW5kbGVyMSxcblx0XHRcdFx0Y29ubmVjdGlvbjogaGFuZGxlcjEuY29ubmVjdGlvbixcblx0XHRcdFx0c3Vic2NyaXB0aW9uczogW10sXG5cdFx0XHRcdHRyYW5zcG9ydFR5cGU6IFwibWVzc2FnZS1wb3J0XCIsXG5cdFx0XHRcdHJlYWR5OiByZWFkeTEsXG5cdFx0XHRcdHVuaWZpZWQ6IGhhbmRsZXIxLnVuaWZpZWRcblx0XHRcdH07XG5cdFx0XHRjb25zdCBjaGFubmVsMiA9IHtcblx0XHRcdFx0bmFtZTogbmFtZTIsXG5cdFx0XHRcdGhhbmRsZXI6IGhhbmRsZXIyLFxuXHRcdFx0XHRjb25uZWN0aW9uOiBoYW5kbGVyMi5jb25uZWN0aW9uLFxuXHRcdFx0XHRzdWJzY3JpcHRpb25zOiBbXSxcblx0XHRcdFx0dHJhbnNwb3J0VHlwZTogXCJtZXNzYWdlLXBvcnRcIixcblx0XHRcdFx0cmVhZHk6IHJlYWR5Mixcblx0XHRcdFx0dW5pZmllZDogaGFuZGxlcjIudW5pZmllZFxuXHRcdFx0fTtcblx0XHRcdHRoaXMuX2VuZHBvaW50cy5zZXQobmFtZTEsIGNoYW5uZWwxKTtcblx0XHRcdHRoaXMuX2VuZHBvaW50cy5zZXQobmFtZTIsIGNoYW5uZWwyKTtcblx0XHRcdHRoaXMuX3JlZ2lzdGVyVW5pZmllZENoYW5uZWwobmFtZTEsIGhhbmRsZXIxLnVuaWZpZWQpO1xuXHRcdFx0dGhpcy5fcmVnaXN0ZXJVbmlmaWVkQ2hhbm5lbChuYW1lMiwgaGFuZGxlcjIudW5pZmllZCk7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRjaGFubmVsMSxcblx0XHRcdFx0Y2hhbm5lbDIsXG5cdFx0XHRcdG1lc3NhZ2VDaGFubmVsOiBtY1xuXHRcdFx0fTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBHZXQgdGhlIGdsb2JhbCBzZWxmIHJlZmVyZW5jZVxuXHRcdCovXG5cdFx0Z2V0IGdsb2JhbFNlbGYoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fZ2xvYmFsU2VsZjtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBDb25uZWN0IHRvIGEgcmVtb3RlIGNoYW5uZWwgKGUuZy4sIGluIGEgV29ya2VyKVxuXHRcdCovXG5cdFx0YXN5bmMgY29ubmVjdFJlbW90ZShjaGFubmVsTmFtZSwgb3B0aW9ucyA9IHt9LCBicm9hZGNhc3QpIHtcblx0XHRcdHRoaXMuaW5pdEhvc3QoKTtcblx0XHRcdHJldHVybiB0aGlzLl9ob3N0LmNyZWF0ZVJlbW90ZUNoYW5uZWwoY2hhbm5lbE5hbWUsIG9wdGlvbnMsIGJyb2FkY2FzdCk7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogSW1wb3J0IGEgbW9kdWxlIGluIGEgcmVtb3RlIGNoYW5uZWxcblx0XHQqL1xuXHRcdGFzeW5jIGltcG9ydE1vZHVsZUluQ2hhbm5lbChjaGFubmVsTmFtZSwgdXJsLCBvcHRpb25zID0ge30sIGJyb2FkY2FzdCkge1xuXHRcdFx0cmV0dXJuIChhd2FpdCB0aGlzLmNvbm5lY3RSZW1vdGUoY2hhbm5lbE5hbWUsIG9wdGlvbnMuY2hhbm5lbE9wdGlvbnMsIGJyb2FkY2FzdCkpPy5kb0ltcG9ydE1vZHVsZT8uKHVybCwgb3B0aW9ucy5pbXBvcnRPcHRpb25zKTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBJbnRlcm5hbDogQ3JlYXRlIG9yIHVzZSBleGlzdGluZyByZW1vdGUgY2hhbm5lbFxuXHRcdCovXG5cdFx0JGNyZWF0ZU9yVXNlRXhpc3RpbmdSZW1vdGUoY2hhbm5lbCwgb3B0aW9ucyA9IHt9LCBicm9hZGNhc3QpIHtcblx0XHRcdGlmIChjaGFubmVsID09IG51bGwgfHwgYnJvYWRjYXN0KSByZXR1cm4gbnVsbDtcblx0XHRcdGlmICh0aGlzLl9yZW1vdGVDaGFubmVscy5oYXMoY2hhbm5lbCkpIHJldHVybiB0aGlzLl9yZW1vdGVDaGFubmVscy5nZXQoY2hhbm5lbCk7XG5cdFx0XHRjb25zdCBtc2dDaGFubmVsID0gbmV3IE1lc3NhZ2VDaGFubmVsKCk7XG5cdFx0XHRjb25zdCBwcm9taXNlID0gUHJvbWlzZWQobmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcblx0XHRcdFx0Y29uc3Qgd29ya2VyID0gbG9hZFdvcmtlcih3b3JrZXJDb2RlKTtcblx0XHRcdFx0d29ya2VyPy5hZGRFdmVudExpc3RlbmVyPy4oXCJtZXNzYWdlXCIsIChldmVudCkgPT4ge1xuXHRcdFx0XHRcdGlmIChldmVudC5kYXRhLnR5cGUgPT09IFwiY2hhbm5lbENyZWF0ZWRcIikge1xuXHRcdFx0XHRcdFx0bXNnQ2hhbm5lbC5wb3J0MT8uc3RhcnQ/LigpO1xuXHRcdFx0XHRcdFx0cmVzb2x2ZShuZXcgUmVtb3RlQ2hhbm5lbEhlbHBlcihldmVudC5kYXRhLmNoYW5uZWwsIHRoaXMsIG9wdGlvbnMpKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHR3b3JrZXI/LnBvc3RNZXNzYWdlPy4oe1xuXHRcdFx0XHRcdHR5cGU6IFwiY3JlYXRlQ2hhbm5lbFwiLFxuXHRcdFx0XHRcdGNoYW5uZWwsXG5cdFx0XHRcdFx0c2VuZGVyOiB0aGlzLl9ob3N0TmFtZSxcblx0XHRcdFx0XHRvcHRpb25zLFxuXHRcdFx0XHRcdG1lc3NhZ2VQb3J0OiBtc2dDaGFubmVsLnBvcnQyXG5cdFx0XHRcdH0sIHsgdHJhbnNmZXI6IFttc2dDaGFubmVsLnBvcnQyXSB9KTtcblx0XHRcdH0pKTtcblx0XHRcdGNvbnN0IGluZm8gPSB7XG5cdFx0XHRcdGNoYW5uZWwsXG5cdFx0XHRcdGNvbnRleHQ6IHRoaXMsXG5cdFx0XHRcdG1lc3NhZ2VDaGFubmVsOiBtc2dDaGFubmVsLFxuXHRcdFx0XHRyZW1vdGU6IHByb21pc2Vcblx0XHRcdH07XG5cdFx0XHR0aGlzLl9yZW1vdGVDaGFubmVscy5zZXQoY2hhbm5lbCwgaW5mbyk7XG5cdFx0XHRyZXR1cm4gaW5mbztcblx0XHR9XG5cdFx0JHJlZ2lzdGVyQ29ubmVjdGlvbihwYXJhbXMpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdC4uLnRoaXMuX2Nvbm5lY3Rpb25SZWdpc3RyeS5yZWdpc3RlcihwYXJhbXMpLFxuXHRcdFx0XHRjb250ZXh0SWQ6IHRoaXMuX2lkXG5cdFx0XHR9O1xuXHRcdH1cblx0XHQkbWFya05vdGlmaWVkKHBhcmFtcykge1xuXHRcdFx0Y29uc3QgY29ubmVjdGlvbiA9IHRoaXMuX2Nvbm5lY3Rpb25SZWdpc3RyeS5yZWdpc3Rlcih7XG5cdFx0XHRcdGxvY2FsQ2hhbm5lbDogcGFyYW1zLmxvY2FsQ2hhbm5lbCxcblx0XHRcdFx0cmVtb3RlQ2hhbm5lbDogcGFyYW1zLnJlbW90ZUNoYW5uZWwsXG5cdFx0XHRcdHNlbmRlcjogcGFyYW1zLnNlbmRlcixcblx0XHRcdFx0ZGlyZWN0aW9uOiBwYXJhbXMuZGlyZWN0aW9uLFxuXHRcdFx0XHR0cmFuc3BvcnRUeXBlOiBwYXJhbXMudHJhbnNwb3J0VHlwZVxuXHRcdFx0fSk7XG5cdFx0XHR0aGlzLl9jb25uZWN0aW9uUmVnaXN0cnkubWFya05vdGlmaWVkKGNvbm5lY3Rpb24sIHBhcmFtcy5wYXlsb2FkKTtcblx0XHR9XG5cdFx0JG9ic2VydmVTaWduYWwocGFyYW1zKSB7XG5cdFx0XHRjb25zdCBkaXJlY3Rpb24gPSAocGFyYW1zLnBheWxvYWQ/LnR5cGUgPz8gXCJub3RpZnlcIikgPT09IFwiY29ubmVjdFwiID8gXCJpbmNvbWluZ1wiIDogXCJpbmNvbWluZ1wiO1xuXHRcdFx0dGhpcy4kbWFya05vdGlmaWVkKHtcblx0XHRcdFx0bG9jYWxDaGFubmVsOiBwYXJhbXMubG9jYWxDaGFubmVsLFxuXHRcdFx0XHRyZW1vdGVDaGFubmVsOiBwYXJhbXMucmVtb3RlQ2hhbm5lbCxcblx0XHRcdFx0c2VuZGVyOiBwYXJhbXMuc2VuZGVyLFxuXHRcdFx0XHRkaXJlY3Rpb24sXG5cdFx0XHRcdHRyYW5zcG9ydFR5cGU6IHBhcmFtcy50cmFuc3BvcnRUeXBlLFxuXHRcdFx0XHRwYXlsb2FkOiBwYXJhbXMucGF5bG9hZFxuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdCRmb3J3YXJkVW5pZmllZENvbm5lY3Rpb25FdmVudChjaGFubmVsLCBldmVudCkge1xuXHRcdFx0Y29uc3QgbWFwcGVkVHJhbnNwb3J0VHlwZSA9IGV2ZW50LmNvbm5lY3Rpb24udHJhbnNwb3J0VHlwZSA/PyBcImludGVybmFsXCI7XG5cdFx0XHRjb25zdCBjb25uZWN0aW9uID0gdGhpcy5fY29ubmVjdGlvblJlZ2lzdHJ5LnJlZ2lzdGVyKHtcblx0XHRcdFx0bG9jYWxDaGFubmVsOiBldmVudC5jb25uZWN0aW9uLmxvY2FsQ2hhbm5lbCB8fCBjaGFubmVsLFxuXHRcdFx0XHRyZW1vdGVDaGFubmVsOiBldmVudC5jb25uZWN0aW9uLnJlbW90ZUNoYW5uZWwsXG5cdFx0XHRcdHNlbmRlcjogZXZlbnQuY29ubmVjdGlvbi5zZW5kZXIsXG5cdFx0XHRcdGRpcmVjdGlvbjogZXZlbnQuY29ubmVjdGlvbi5kaXJlY3Rpb24sXG5cdFx0XHRcdHRyYW5zcG9ydFR5cGU6IG1hcHBlZFRyYW5zcG9ydFR5cGUsXG5cdFx0XHRcdG1ldGFkYXRhOiBldmVudC5jb25uZWN0aW9uLm1ldGFkYXRhXG5cdFx0XHR9KTtcblx0XHRcdGlmIChldmVudC50eXBlID09PSBcIm5vdGlmaWVkXCIpIHRoaXMuX2Nvbm5lY3Rpb25SZWdpc3RyeS5tYXJrTm90aWZpZWQoY29ubmVjdGlvbiwgZXZlbnQucGF5bG9hZCk7XG5cdFx0XHRlbHNlIGlmIChldmVudC50eXBlID09PSBcImRpc2Nvbm5lY3RlZFwiKSB0aGlzLl9jb25uZWN0aW9uUmVnaXN0cnkuY2xvc2VCeUNoYW5uZWwoZXZlbnQuY29ubmVjdGlvbi5sb2NhbENoYW5uZWwpO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIENsb3NlIGEgc3BlY2lmaWMgY2hhbm5lbFxuXHRcdCovXG5cdFx0Y2xvc2VDaGFubmVsKG5hbWUpIHtcblx0XHRcdGNvbnN0IGVuZHBvaW50ID0gdGhpcy5fZW5kcG9pbnRzLmdldChuYW1lKTtcblx0XHRcdGlmICghZW5kcG9pbnQpIHJldHVybiBmYWxzZTtcblx0XHRcdGVuZHBvaW50LnN1YnNjcmlwdGlvbnMuZm9yRWFjaCgocykgPT4gcy51bnN1YnNjcmliZSgpKTtcblx0XHRcdGVuZHBvaW50LmhhbmRsZXIuY2xvc2UoKTtcblx0XHRcdGVuZHBvaW50LnRyYW5zcG9ydD8uZGV0YWNoKCk7XG5cdFx0XHR0aGlzLl91bmlmaWVkQ29ubmVjdGlvblN1YnMuZ2V0KG5hbWUpPy51bnN1YnNjcmliZSgpO1xuXHRcdFx0dGhpcy5fdW5pZmllZENvbm5lY3Rpb25TdWJzLmRlbGV0ZShuYW1lKTtcblx0XHRcdHRoaXMuX3VuaWZpZWRCeUNoYW5uZWwuZGVsZXRlKG5hbWUpO1xuXHRcdFx0dGhpcy5fZW5kcG9pbnRzLmRlbGV0ZShuYW1lKTtcblx0XHRcdGlmIChuYW1lID09PSB0aGlzLl9ob3N0TmFtZSkgdGhpcy5faG9zdCA9IG51bGw7XG5cdFx0XHR0aGlzLl9jb25uZWN0aW9uUmVnaXN0cnkuY2xvc2VCeUNoYW5uZWwobmFtZSk7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBDbG9zZSBhbGwgY2hhbm5lbHMgYW5kIGNsZWFudXBcblx0XHQqL1xuXHRcdGNsb3NlKCkge1xuXHRcdFx0aWYgKHRoaXMuX2Nsb3NlZCkgcmV0dXJuO1xuXHRcdFx0dGhpcy5fY2xvc2VkID0gdHJ1ZTtcblx0XHRcdGZvciAoY29uc3QgW25hbWVdIG9mIHRoaXMuX2VuZHBvaW50cykgdGhpcy5jbG9zZUNoYW5uZWwobmFtZSk7XG5cdFx0XHR0aGlzLl9yZW1vdGVDaGFubmVscy5jbGVhcigpO1xuXHRcdFx0dGhpcy5faG9zdCA9IG51bGw7XG5cdFx0XHR0aGlzLl91bmlmaWVkQ29ubmVjdGlvblN1YnMuZm9yRWFjaCgoc3ViKSA9PiBzdWIudW5zdWJzY3JpYmUoKSk7XG5cdFx0XHR0aGlzLl91bmlmaWVkQ29ubmVjdGlvblN1YnMuY2xlYXIoKTtcblx0XHRcdHRoaXMuX3VuaWZpZWRCeUNoYW5uZWwuY2xlYXIoKTtcblx0XHRcdHRoaXMuX2Nvbm5lY3Rpb25SZWdpc3RyeS5jbGVhcigpO1xuXHRcdFx0dGhpcy5fY29ubmVjdGlvbkV2ZW50cy5jb21wbGV0ZSgpO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIENoZWNrIGlmIGNvbnRleHQgaXMgY2xvc2VkXG5cdFx0Ki9cblx0XHRnZXQgY2xvc2VkKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2Nsb3NlZDtcblx0XHR9XG5cdFx0X3JlZ2lzdGVyVW5pZmllZENoYW5uZWwobmFtZSwgdW5pZmllZCkge1xuXHRcdFx0dGhpcy5fdW5pZmllZEJ5Q2hhbm5lbC5zZXQobmFtZSwgdW5pZmllZCk7XG5cdFx0XHR0aGlzLl91bmlmaWVkQ29ubmVjdGlvblN1YnMuZ2V0KG5hbWUpPy51bnN1YnNjcmliZSgpO1xuXHRcdFx0Y29uc3Qgc3Vic2NyaXB0aW9uID0gdW5pZmllZC5zdWJzY3JpYmVDb25uZWN0aW9ucygoZXZlbnQpID0+IHtcblx0XHRcdFx0dGhpcy4kZm9yd2FyZFVuaWZpZWRDb25uZWN0aW9uRXZlbnQobmFtZSwgZXZlbnQpO1xuXHRcdFx0fSk7XG5cdFx0XHR0aGlzLl91bmlmaWVkQ29ubmVjdGlvblN1YnMuc2V0KG5hbWUsIHN1YnNjcmlwdGlvbik7XG5cdFx0fVxuXHRcdF9lbWl0Q29ubmVjdGlvbkV2ZW50KGV2ZW50KSB7XG5cdFx0XHR0aGlzLl9jb25uZWN0aW9uRXZlbnRzLm5leHQoe1xuXHRcdFx0XHQuLi5ldmVudCxcblx0XHRcdFx0Y29ubmVjdGlvbjoge1xuXHRcdFx0XHRcdC4uLmV2ZW50LmNvbm5lY3Rpb24sXG5cdFx0XHRcdFx0Y29udGV4dElkOiB0aGlzLl9pZFxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cdH07XG5cdGZ1bmN0aW9uIGlzUmVmbGVjdEFjdGlvbihhY3Rpb24pIHtcblx0XHRyZXR1cm4gWy4uLk9iamVjdC52YWx1ZXMoV1JlZmxlY3RBY3Rpb24pXS5pbmNsdWRlcyhhY3Rpb24pO1xuXHR9XG5cdGZ1bmN0aW9uIG5vcm1hbGl6ZVRyYW5zcG9ydEJpbmRpbmcodGFyZ2V0KSB7XG5cdFx0aWYgKCF0YXJnZXQpIHJldHVybiBudWxsO1xuXHRcdGlmIChpc1RyYW5zcG9ydEJpbmRpbmcodGFyZ2V0KSkgcmV0dXJuIHRhcmdldDtcblx0XHRjb25zdCBuYXRpdmVUYXJnZXQgPSB0YXJnZXQ7XG5cdFx0Y29uc3QgdHJhbnNwb3J0VHlwZSA9IGdldER5bmFtaWNUcmFuc3BvcnRUeXBlKG5hdGl2ZVRhcmdldCk7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHRhcmdldDogbmF0aXZlVGFyZ2V0LFxuXHRcdFx0dGFyZ2V0Q2hhbm5lbDogXCJ1bmtub3duXCIsXG5cdFx0XHR0cmFuc3BvcnRUeXBlOiB0cmFuc3BvcnRUeXBlID09PSBcImludGVybmFsXCIgPyBcInNlbGZcIiA6IHRyYW5zcG9ydFR5cGUsXG5cdFx0XHRzZW5kZXI6IChtZXNzYWdlLCB0cmFuc2ZlcikgPT4ge1xuXHRcdFx0XHRpZiAodHlwZW9mIFdlYlNvY2tldCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBuYXRpdmVUYXJnZXQgaW5zdGFuY2VvZiBXZWJTb2NrZXQpIHtcblx0XHRcdFx0XHRuYXRpdmVUYXJnZXQuc2VuZChKU09OLnN0cmluZ2lmeShtZXNzYWdlKSk7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdG5hdGl2ZVRhcmdldC5wb3N0TWVzc2FnZT8uKG1lc3NhZ2UsIHRyYW5zZmVyPy5sZW5ndGggPyB7IHRyYW5zZmVyIH0gOiB2b2lkIDApO1xuXHRcdFx0fSxcblx0XHRcdHBvc3RNZXNzYWdlOiAobWVzc2FnZSwgb3B0aW9ucykgPT4ge1xuXHRcdFx0XHRuYXRpdmVUYXJnZXQucG9zdE1lc3NhZ2U/LihtZXNzYWdlLCBvcHRpb25zKTtcblx0XHRcdH0sXG5cdFx0XHRhZGRFdmVudExpc3RlbmVyOiBuYXRpdmVUYXJnZXQuYWRkRXZlbnRMaXN0ZW5lcj8uYmluZChuYXRpdmVUYXJnZXQpLFxuXHRcdFx0cmVtb3ZlRXZlbnRMaXN0ZW5lcjogbmF0aXZlVGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXI/LmJpbmQobmF0aXZlVGFyZ2V0KSxcblx0XHRcdHN0YXJ0OiBuYXRpdmVUYXJnZXQuc3RhcnQ/LmJpbmQobmF0aXZlVGFyZ2V0KSxcblx0XHRcdGNsb3NlOiBuYXRpdmVUYXJnZXQuY2xvc2U/LmJpbmQobmF0aXZlVGFyZ2V0KVxuXHRcdH07XG5cdH1cblx0ZnVuY3Rpb24gaXNUcmFuc3BvcnRCaW5kaW5nKHZhbHVlKSB7XG5cdFx0cmV0dXJuICEhdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmIFwidGFyZ2V0XCIgaW4gdmFsdWUgJiYgdHlwZW9mIHZhbHVlLnBvc3RNZXNzYWdlID09PSBcImZ1bmN0aW9uXCI7XG5cdH1cblx0ZnVuY3Rpb24gZ2V0RHluYW1pY1RyYW5zcG9ydFR5cGUodGFyZ2V0KSB7XG5cdFx0Y29uc3QgZWZmZWN0aXZlVGFyZ2V0ID0gaXNUcmFuc3BvcnRCaW5kaW5nKHRhcmdldCkgPyB0YXJnZXQudGFyZ2V0IDogdGFyZ2V0O1xuXHRcdGlmICghZWZmZWN0aXZlVGFyZ2V0KSByZXR1cm4gXCJpbnRlcm5hbFwiO1xuXHRcdGlmIChlZmZlY3RpdmVUYXJnZXQgPT09IFwiY2hyb21lLXJ1bnRpbWVcIikgcmV0dXJuIFwiY2hyb21lLXJ1bnRpbWVcIjtcblx0XHRpZiAoZWZmZWN0aXZlVGFyZ2V0ID09PSBcImNocm9tZS10YWJzXCIpIHJldHVybiBcImNocm9tZS10YWJzXCI7XG5cdFx0aWYgKGVmZmVjdGl2ZVRhcmdldCA9PT0gXCJjaHJvbWUtcG9ydFwiKSByZXR1cm4gXCJjaHJvbWUtcG9ydFwiO1xuXHRcdGlmIChlZmZlY3RpdmVUYXJnZXQgPT09IFwiY2hyb21lLWV4dGVybmFsXCIpIHJldHVybiBcImNocm9tZS1leHRlcm5hbFwiO1xuXHRcdGlmICh0eXBlb2YgTWVzc2FnZVBvcnQgIT09IFwidW5kZWZpbmVkXCIgJiYgZWZmZWN0aXZlVGFyZ2V0IGluc3RhbmNlb2YgTWVzc2FnZVBvcnQpIHJldHVybiBcIm1lc3NhZ2UtcG9ydFwiO1xuXHRcdGlmICh0eXBlb2YgQnJvYWRjYXN0Q2hhbm5lbCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBlZmZlY3RpdmVUYXJnZXQgaW5zdGFuY2VvZiBCcm9hZGNhc3RDaGFubmVsKSByZXR1cm4gXCJicm9hZGNhc3RcIjtcblx0XHRpZiAodHlwZW9mIFdvcmtlciAhPT0gXCJ1bmRlZmluZWRcIiAmJiBlZmZlY3RpdmVUYXJnZXQgaW5zdGFuY2VvZiBXb3JrZXIpIHJldHVybiBcIndvcmtlclwiO1xuXHRcdGlmICh0eXBlb2YgV2ViU29ja2V0ICE9PSBcInVuZGVmaW5lZFwiICYmIGVmZmVjdGl2ZVRhcmdldCBpbnN0YW5jZW9mIFdlYlNvY2tldCkgcmV0dXJuIFwid2Vic29ja2V0XCI7XG5cdFx0aWYgKHR5cGVvZiBjaHJvbWUgIT09IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mIGVmZmVjdGl2ZVRhcmdldCA9PT0gXCJvYmplY3RcIiAmJiBlZmZlY3RpdmVUYXJnZXQgJiYgdHlwZW9mIGVmZmVjdGl2ZVRhcmdldC5wb3N0TWVzc2FnZSA9PT0gXCJmdW5jdGlvblwiICYmIGVmZmVjdGl2ZVRhcmdldC5vbk1lc3NhZ2U/LmFkZExpc3RlbmVyKSByZXR1cm4gXCJjaHJvbWUtcG9ydFwiO1xuXHRcdGlmICh0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiAmJiBlZmZlY3RpdmVUYXJnZXQgPT09IHNlbGYpIHJldHVybiBcInNlbGZcIjtcblx0XHRyZXR1cm4gXCJpbnRlcm5hbFwiO1xuXHR9XG5cdGZ1bmN0aW9uIGxvYWRXb3JrZXIoV1gpIHtcblx0XHRpZiAoV1ggaW5zdGFuY2VvZiBXb3JrZXIpIHJldHVybiBXWDtcblx0XHRpZiAoV1ggaW5zdGFuY2VvZiBVUkwpIHJldHVybiBuZXcgV29ya2VyKFdYLmhyZWYsIHsgdHlwZTogXCJtb2R1bGVcIiB9KTtcblx0XHRpZiAodHlwZW9mIFdYID09PSBcImZ1bmN0aW9uXCIpIHRyeSB7XG5cdFx0XHRyZXR1cm4gbmV3IFdYKHsgdHlwZTogXCJtb2R1bGVcIiB9KTtcblx0XHR9IGNhdGNoIHtcblx0XHRcdHJldHVybiBXWCh7IHR5cGU6IFwibW9kdWxlXCIgfSk7XG5cdFx0fVxuXHRcdGlmICh0eXBlb2YgV1ggPT09IFwic3RyaW5nXCIpIHtcblx0XHRcdGlmIChXWC5zdGFydHNXaXRoKFwiL1wiKSkgcmV0dXJuIG5ldyBXb3JrZXIocmVzb2x2ZVdvcmtlclNwZWNpZmllckhyZWYoV1gucmVwbGFjZSgvXlxcLy8sIFwiLi9cIikpLCB7IHR5cGU6IFwibW9kdWxlXCIgfSk7XG5cdFx0XHRpZiAoVVJMLmNhblBhcnNlKFdYKSB8fCBXWC5zdGFydHNXaXRoKFwiLi9cIikpIHJldHVybiBuZXcgV29ya2VyKHJlc29sdmVXb3JrZXJTcGVjaWZpZXJIcmVmKFdYKSwgeyB0eXBlOiBcIm1vZHVsZVwiIH0pO1xuXHRcdFx0cmV0dXJuIG5ldyBXb3JrZXIoVVJMLmNyZWF0ZU9iamVjdFVSTChuZXcgQmxvYihbV1hdLCB7IHR5cGU6IFwiYXBwbGljYXRpb24vamF2YXNjcmlwdFwiIH0pKSwgeyB0eXBlOiBcIm1vZHVsZVwiIH0pO1xuXHRcdH1cblx0XHRpZiAoV1ggaW5zdGFuY2VvZiBCbG9iIHx8IFdYIGluc3RhbmNlb2YgRmlsZSkgcmV0dXJuIG5ldyBXb3JrZXIoVVJMLmNyZWF0ZU9iamVjdFVSTChXWCksIHsgdHlwZTogXCJtb2R1bGVcIiB9KTtcblx0XHRyZXR1cm4gV1ggPz8gKHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IG51bGwpO1xuXHR9XG5cdC8qKiBHbG9iYWwgY29udGV4dCByZWdpc3RyeSBmb3Igc2hhcmVkIGNvbnRleHRzICovXG5cdGNvbnN0IENPTlRFWFRfUkVHSVNUUlkgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuXHQvKipcblx0KiBDcmVhdGUgYSBuZXcgY2hhbm5lbCBjb250ZXh0XG5cdCpcblx0KiBVc2UgdGhpcyBmb3IgaXNvbGF0ZWQgY2hhbm5lbCBtYW5hZ2VtZW50IGluIGNvbXBvbmVudHNcblx0Ki9cblx0ZnVuY3Rpb24gY3JlYXRlQ2hhbm5lbENvbnRleHQob3B0aW9ucyA9IHt9KSB7XG5cdFx0Y29uc3QgY3R4ID0gbmV3IENoYW5uZWxDb250ZXh0KG9wdGlvbnMpO1xuXHRcdGlmIChvcHRpb25zLm5hbWUpIENPTlRFWFRfUkVHSVNUUlkuc2V0KG9wdGlvbnMubmFtZSwgY3R4KTtcblx0XHRyZXR1cm4gY3R4O1xuXHR9XG5cbi8vI2VuZHJlZ2lvblxuLy8jcmVnaW9uIC4uL3VuaWZvcm0udHMvc3JjL25ld2VyL25leHQvdHJhbnNwb3J0L1dvcmtlci50c1xuLyoqXG5cdCogV29ya2VyIEVudHJ5IFBvaW50IC0gTXVsdGktQ2hhbm5lbCBTdXBwb3J0XG5cdCpcblx0KiBUaGlzIHdvcmtlciBjb250ZXh0IHN1cHBvcnRzOlxuXHQqIC0gTXVsdGlwbGUgY2hhbm5lbCBjcmVhdGlvbi9pbml0aWFsaXphdGlvblxuXHQqIC0gT2JzZXJ2aW5nIG5ldyBpbmNvbWluZyBjaGFubmVsIGNvbm5lY3Rpb25zXG5cdCogLSBEeW5hbWljIGNoYW5uZWwgYWRkaXRpb24gYWZ0ZXIgaW5pdGlhbGl6YXRpb25cblx0KiAtIENvbm5lY3Rpb24gZnJvbSByZW1vdGUvaG9zdCBjb250ZXh0c1xuXHQqL1xuXHQvKipcblx0KiBXb3JrZXJDb250ZXh0IC0gTWFuYWdlcyBjaGFubmVscyB3aXRoaW4gYSBXb3JrZXJcblx0KlxuXHQqIFN1cHBvcnRzIG9ic2VydmluZyBuZXcgaW5jb21pbmcgY29ubmVjdGlvbnMgZnJvbSBob3N0L3JlbW90ZSBjb250ZXh0cy5cblx0Ki9cblx0dmFyIFdvcmtlckNvbnRleHQgPSBjbGFzcyB7XG5cdFx0X2NvbnRleHQ7XG5cdFx0X2NvbmZpZztcblx0XHRfc3Vic2NyaXB0aW9ucyA9IFtdO1xuXHRcdF9pbmNvbWluZ0Nvbm5lY3Rpb25zID0gbmV3IENoYW5uZWxTdWJqZWN0KHsgYnVmZmVyU2l6ZTogMTAwIH0pO1xuXHRcdF9jaGFubmVsQ3JlYXRlZCA9IG5ldyBDaGFubmVsU3ViamVjdCh7IGJ1ZmZlclNpemU6IDEwMCB9KTtcblx0XHRfY2hhbm5lbENsb3NlZCA9IG5ldyBDaGFubmVsU3ViamVjdCgpO1xuXHRcdGNvbnN0cnVjdG9yKGNvbmZpZyA9IHt9KSB7XG5cdFx0XHR0aGlzLl9jb25maWcgPSB7XG5cdFx0XHRcdG5hbWU6IGNvbmZpZy5uYW1lID8/IFwid29ya2VyXCIsXG5cdFx0XHRcdHdvcmtlck5hbWU6IGNvbmZpZy53b3JrZXJOYW1lID8/IGB3b3JrZXItJHtVVUlEdjQoKS5zbGljZSgwLCA4KX1gLFxuXHRcdFx0XHRhdXRvQWNjZXB0Q2hhbm5lbHM6IGNvbmZpZy5hdXRvQWNjZXB0Q2hhbm5lbHMgPz8gdHJ1ZSxcblx0XHRcdFx0YWxsb3dlZENoYW5uZWxzOiBjb25maWcuYWxsb3dlZENoYW5uZWxzID8/IFtdLFxuXHRcdFx0XHRtYXhDaGFubmVsczogY29uZmlnLm1heENoYW5uZWxzID8/IDEwMCxcblx0XHRcdFx0YXV0b0Nvbm5lY3Q6IGNvbmZpZy5hdXRvQ29ubmVjdCA/PyB0cnVlLFxuXHRcdFx0XHR1c2VHbG9iYWxTZWxmOiB0cnVlLFxuXHRcdFx0XHRkZWZhdWx0T3B0aW9uczogY29uZmlnLmRlZmF1bHRPcHRpb25zID8/IHt9LFxuXHRcdFx0XHRpc29sYXRlZFN0b3JhZ2U6IGNvbmZpZy5pc29sYXRlZFN0b3JhZ2UgPz8gZmFsc2UsXG5cdFx0XHRcdC4uLmNvbmZpZ1xuXHRcdFx0fTtcblx0XHRcdHRoaXMuX2NvbnRleHQgPSBjcmVhdGVDaGFubmVsQ29udGV4dCh7XG5cdFx0XHRcdG5hbWU6IHRoaXMuX2NvbmZpZy5uYW1lLFxuXHRcdFx0XHR1c2VHbG9iYWxTZWxmOiB0cnVlLFxuXHRcdFx0XHRkZWZhdWx0T3B0aW9uczogY29uZmlnLmRlZmF1bHRPcHRpb25zXG5cdFx0XHR9KTtcblx0XHRcdHRoaXMuX3NldHVwTWVzc2FnZUxpc3RlbmVyKCk7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogT2JzZXJ2YWJsZTogTmV3IGluY29taW5nIGNvbm5lY3Rpb24gcmVxdWVzdHNcblx0XHQqL1xuXHRcdGdldCBvbkNvbm5lY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5faW5jb21pbmdDb25uZWN0aW9ucztcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBPYnNlcnZhYmxlOiBDaGFubmVsIGNyZWF0ZWQgZXZlbnRzXG5cdFx0Ki9cblx0XHRnZXQgb25DaGFubmVsQ3JlYXRlZCgpIHtcblx0XHRcdHJldHVybiB0aGlzLl9jaGFubmVsQ3JlYXRlZDtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBPYnNlcnZhYmxlOiBDaGFubmVsIGNsb3NlZCBldmVudHNcblx0XHQqL1xuXHRcdGdldCBvbkNoYW5uZWxDbG9zZWQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY2hhbm5lbENsb3NlZDtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBTdWJzY3JpYmUgdG8gaW5jb21pbmcgY29ubmVjdGlvbnNcblx0XHQqL1xuXHRcdHN1YnNjcmliZUNvbm5lY3Rpb25zKGhhbmRsZXIpIHtcblx0XHRcdHJldHVybiB0aGlzLl9pbmNvbWluZ0Nvbm5lY3Rpb25zLnN1YnNjcmliZShoYW5kbGVyKTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBTdWJzY3JpYmUgdG8gY2hhbm5lbCBjcmVhdGlvblxuXHRcdCovXG5cdFx0c3Vic2NyaWJlQ2hhbm5lbENyZWF0ZWQoaGFuZGxlcikge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2NoYW5uZWxDcmVhdGVkLnN1YnNjcmliZShoYW5kbGVyKTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBBY2NlcHQgYW4gaW5jb21pbmcgY29ubmVjdGlvbiBhbmQgY3JlYXRlIHRoZSBjaGFubmVsXG5cdFx0Ki9cblx0XHRhY2NlcHRDb25uZWN0aW9uKGNvbm5lY3Rpb24pIHtcblx0XHRcdGlmICghdGhpcy5fY2FuQWNjZXB0Q2hhbm5lbChjb25uZWN0aW9uLmNoYW5uZWwpKSByZXR1cm4gbnVsbDtcblx0XHRcdGNvbnN0IGVuZHBvaW50ID0gdGhpcy5fY29udGV4dC5jcmVhdGVDaGFubmVsKGNvbm5lY3Rpb24uY2hhbm5lbCwgY29ubmVjdGlvbi5vcHRpb25zKTtcblx0XHRcdGlmIChjb25uZWN0aW9uLnBvcnQpIHtcblx0XHRcdFx0Y29ubmVjdGlvbi5wb3J0LnN0YXJ0Py4oKTtcblx0XHRcdFx0ZW5kcG9pbnQuaGFuZGxlci5jcmVhdGVSZW1vdGVDaGFubmVsKGNvbm5lY3Rpb24uc2VuZGVyLCBjb25uZWN0aW9uLm9wdGlvbnMsIGNvbm5lY3Rpb24ucG9ydCk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLl9jaGFubmVsQ3JlYXRlZC5uZXh0KHtcblx0XHRcdFx0Y2hhbm5lbDogY29ubmVjdGlvbi5jaGFubmVsLFxuXHRcdFx0XHRlbmRwb2ludCxcblx0XHRcdFx0c2VuZGVyOiBjb25uZWN0aW9uLnNlbmRlcixcblx0XHRcdFx0dGltZXN0YW1wOiBEYXRlLm5vdygpXG5cdFx0XHR9KTtcblx0XHRcdHRoaXMuX3Bvc3RDaGFubmVsQ3JlYXRlZChjb25uZWN0aW9uLmNoYW5uZWwsIGNvbm5lY3Rpb24uc2VuZGVyLCBjb25uZWN0aW9uLmlkKTtcblx0XHRcdHJldHVybiBlbmRwb2ludDtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBDcmVhdGUgYSBuZXcgY2hhbm5lbCBpbiB0aGlzIHdvcmtlciBjb250ZXh0XG5cdFx0Ki9cblx0XHRjcmVhdGVDaGFubmVsKG5hbWUsIG9wdGlvbnMpIHtcblx0XHRcdHJldHVybiB0aGlzLl9jb250ZXh0LmNyZWF0ZUNoYW5uZWwobmFtZSwgb3B0aW9ucyk7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogR2V0IGFuIGV4aXN0aW5nIGNoYW5uZWxcblx0XHQqL1xuXHRcdGdldENoYW5uZWwobmFtZSkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2NvbnRleHQuZ2V0Q2hhbm5lbChuYW1lKTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBDaGVjayBpZiBjaGFubmVsIGV4aXN0c1xuXHRcdCovXG5cdFx0aGFzQ2hhbm5lbChuYW1lKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY29udGV4dC5oYXNDaGFubmVsKG5hbWUpO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIEdldCBhbGwgY2hhbm5lbCBuYW1lc1xuXHRcdCovXG5cdFx0Z2V0Q2hhbm5lbE5hbWVzKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2NvbnRleHQuZ2V0Q2hhbm5lbE5hbWVzKCk7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogUXVlcnkgY3VycmVudGx5IHRyYWNrZWQgY2hhbm5lbCBjb25uZWN0aW9ucyBpbiB0aGlzIHdvcmtlci5cblx0XHQqL1xuXHRcdHF1ZXJ5Q29ubmVjdGlvbnMocXVlcnkgPSB7fSkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2NvbnRleHQucXVlcnlDb25uZWN0aW9ucyhxdWVyeSk7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogTm90aWZ5IGFjdGl2ZSBjb25uZWN0aW9ucyAodXNlZnVsIGZvciB3b3JrZXI8LT5ob3N0IHN5bmMpLlxuXHRcdCovXG5cdFx0bm90aWZ5Q29ubmVjdGlvbnMocGF5bG9hZCA9IHt9LCBxdWVyeSA9IHt9KSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY29udGV4dC5ub3RpZnlDb25uZWN0aW9ucyhwYXlsb2FkLCBxdWVyeSk7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogQ2xvc2UgYSBzcGVjaWZpYyBjaGFubmVsXG5cdFx0Ki9cblx0XHRjbG9zZUNoYW5uZWwobmFtZSkge1xuXHRcdFx0Y29uc3QgY2xvc2VkID0gdGhpcy5fY29udGV4dC5jbG9zZUNoYW5uZWwobmFtZSk7XG5cdFx0XHRpZiAoY2xvc2VkKSB0aGlzLl9jaGFubmVsQ2xvc2VkLm5leHQoe1xuXHRcdFx0XHRjaGFubmVsOiBuYW1lLFxuXHRcdFx0XHR0aW1lc3RhbXA6IERhdGUubm93KClcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIGNsb3NlZDtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBHZXQgdGhlIHVuZGVybHlpbmcgY29udGV4dFxuXHRcdCovXG5cdFx0Z2V0IGNvbnRleHQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY29udGV4dDtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBHZXQgd29ya2VyIGNvbmZpZ3VyYXRpb25cblx0XHQqL1xuXHRcdGdldCBjb25maWcoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY29uZmlnO1xuXHRcdH1cblx0XHRfc2V0dXBNZXNzYWdlTGlzdGVuZXIoKSB7XG5cdFx0XHRhZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCAoKGV2ZW50KSA9PiB7XG5cdFx0XHRcdHRoaXMuX2hhbmRsZUluY29taW5nTWVzc2FnZShldmVudCk7XG5cdFx0XHR9KSk7XG5cdFx0fVxuXHRcdF9oYW5kbGVJbmNvbWluZ01lc3NhZ2UoZXZlbnQpIHtcblx0XHRcdGNvbnN0IGRhdGEgPSBldmVudC5kYXRhO1xuXHRcdFx0aWYgKCFkYXRhIHx8IHR5cGVvZiBkYXRhICE9PSBcIm9iamVjdFwiKSByZXR1cm47XG5cdFx0XHRzd2l0Y2ggKGRhdGEudHlwZSkge1xuXHRcdFx0XHRjYXNlIFwiY3JlYXRlQ2hhbm5lbFwiOlxuXHRcdFx0XHRcdHRoaXMuX2hhbmRsZUNyZWF0ZUNoYW5uZWwoZGF0YSk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJjb25uZWN0Q2hhbm5lbFwiOlxuXHRcdFx0XHRcdHRoaXMuX2hhbmRsZUNvbm5lY3RDaGFubmVsKGRhdGEpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwiYWRkUG9ydFwiOlxuXHRcdFx0XHRcdHRoaXMuX2hhbmRsZUFkZFBvcnQoZGF0YSk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJsaXN0Q2hhbm5lbHNcIjpcblx0XHRcdFx0XHR0aGlzLl9oYW5kbGVMaXN0Q2hhbm5lbHMoZGF0YSk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJjbG9zZUNoYW5uZWxcIjpcblx0XHRcdFx0XHR0aGlzLl9oYW5kbGVDbG9zZUNoYW5uZWwoZGF0YSk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJwaW5nXCI6XG5cdFx0XHRcdFx0cG9zdE1lc3NhZ2Uoe1xuXHRcdFx0XHRcdFx0dHlwZTogXCJwb25nXCIsXG5cdFx0XHRcdFx0XHRpZDogZGF0YS5pZCxcblx0XHRcdFx0XHRcdHRpbWVzdGFtcDogRGF0ZS5ub3coKVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRkZWZhdWx0OiBpZiAoZGF0YS5jaGFubmVsICYmIHRoaXMuX2NvbnRleHQuaGFzQ2hhbm5lbChkYXRhLmNoYW5uZWwpKSAodGhpcy5fY29udGV4dC5nZXRDaGFubmVsKGRhdGEuY2hhbm5lbCk/LmhhbmRsZXIpPy5oYW5kbGVBbmRSZXNwb25zZT8uKGRhdGEucGF5bG9hZCwgZGF0YS5yZXFJZCk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdF9oYW5kbGVDcmVhdGVDaGFubmVsKGRhdGEpIHtcblx0XHRcdGNvbnN0IGNvbm5lY3Rpb24gPSB7XG5cdFx0XHRcdGlkOiBkYXRhLnJlcUlkID8/IFVVSUR2NCgpLFxuXHRcdFx0XHRjaGFubmVsOiBkYXRhLmNoYW5uZWwsXG5cdFx0XHRcdHNlbmRlcjogZGF0YS5zZW5kZXIgPz8gXCJ1bmtub3duXCIsXG5cdFx0XHRcdHR5cGU6IFwiY2hhbm5lbFwiLFxuXHRcdFx0XHRwb3J0OiBkYXRhLm1lc3NhZ2VQb3J0LFxuXHRcdFx0XHR0aW1lc3RhbXA6IERhdGUubm93KCksXG5cdFx0XHRcdG9wdGlvbnM6IGRhdGEub3B0aW9uc1xuXHRcdFx0fTtcblx0XHRcdHRoaXMuX2luY29taW5nQ29ubmVjdGlvbnMubmV4dChjb25uZWN0aW9uKTtcblx0XHRcdGlmICh0aGlzLl9jb25maWcuYXV0b0FjY2VwdENoYW5uZWxzKSB0aGlzLmFjY2VwdENvbm5lY3Rpb24oY29ubmVjdGlvbik7XG5cdFx0fVxuXHRcdF9oYW5kbGVDb25uZWN0Q2hhbm5lbChkYXRhKSB7XG5cdFx0XHRjb25zdCBjb25uZWN0aW9uID0ge1xuXHRcdFx0XHRpZDogZGF0YS5yZXFJZCA/PyBVVUlEdjQoKSxcblx0XHRcdFx0Y2hhbm5lbDogZGF0YS5jaGFubmVsLFxuXHRcdFx0XHRzZW5kZXI6IGRhdGEuc2VuZGVyID8/IFwidW5rbm93blwiLFxuXHRcdFx0XHR0eXBlOiBkYXRhLnBvcnRUeXBlID8/IFwiY2hhbm5lbFwiLFxuXHRcdFx0XHRwb3J0OiBkYXRhLnBvcnQsXG5cdFx0XHRcdHRpbWVzdGFtcDogRGF0ZS5ub3coKSxcblx0XHRcdFx0b3B0aW9uczogZGF0YS5vcHRpb25zXG5cdFx0XHR9O1xuXHRcdFx0dGhpcy5faW5jb21pbmdDb25uZWN0aW9ucy5uZXh0KGNvbm5lY3Rpb24pO1xuXHRcdFx0aWYgKHRoaXMuX2NvbmZpZy5hdXRvQWNjZXB0Q2hhbm5lbHMgJiYgdGhpcy5fY2FuQWNjZXB0Q2hhbm5lbChkYXRhLmNoYW5uZWwpKSB7XG5cdFx0XHRcdGNvbnN0IGVuZHBvaW50ID0gdGhpcy5fY29udGV4dC5nZXRPckNyZWF0ZUNoYW5uZWwoZGF0YS5jaGFubmVsLCBkYXRhLm9wdGlvbnMpO1xuXHRcdFx0XHRpZiAoZGF0YS5wb3J0KSB7XG5cdFx0XHRcdFx0ZGF0YS5wb3J0LnN0YXJ0Py4oKTtcblx0XHRcdFx0XHRlbmRwb2ludC5oYW5kbGVyLmNyZWF0ZVJlbW90ZUNoYW5uZWwoZGF0YS5zZW5kZXIsIGRhdGEub3B0aW9ucywgZGF0YS5wb3J0KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRwb3N0TWVzc2FnZSh7XG5cdFx0XHRcdFx0dHlwZTogXCJjaGFubmVsQ29ubmVjdGVkXCIsXG5cdFx0XHRcdFx0Y2hhbm5lbDogZGF0YS5jaGFubmVsLFxuXHRcdFx0XHRcdHJlcUlkOiBkYXRhLnJlcUlkXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRfaGFuZGxlQWRkUG9ydChkYXRhKSB7XG5cdFx0XHRpZiAoIWRhdGEucG9ydCB8fCAhZGF0YS5jaGFubmVsKSByZXR1cm47XG5cdFx0XHRjb25zdCBjb25uZWN0aW9uID0ge1xuXHRcdFx0XHRpZDogZGF0YS5yZXFJZCA/PyBVVUlEdjQoKSxcblx0XHRcdFx0Y2hhbm5lbDogZGF0YS5jaGFubmVsLFxuXHRcdFx0XHRzZW5kZXI6IGRhdGEuc2VuZGVyID8/IFwidW5rbm93blwiLFxuXHRcdFx0XHR0eXBlOiBcInBvcnRcIixcblx0XHRcdFx0cG9ydDogZGF0YS5wb3J0LFxuXHRcdFx0XHR0aW1lc3RhbXA6IERhdGUubm93KCksXG5cdFx0XHRcdG9wdGlvbnM6IGRhdGEub3B0aW9uc1xuXHRcdFx0fTtcblx0XHRcdHRoaXMuX2luY29taW5nQ29ubmVjdGlvbnMubmV4dChjb25uZWN0aW9uKTtcblx0XHRcdGlmICh0aGlzLl9jb25maWcuYXV0b0FjY2VwdENoYW5uZWxzKSB0aGlzLmFjY2VwdENvbm5lY3Rpb24oY29ubmVjdGlvbik7XG5cdFx0fVxuXHRcdF9oYW5kbGVMaXN0Q2hhbm5lbHMoZGF0YSkge1xuXHRcdFx0cG9zdE1lc3NhZ2Uoe1xuXHRcdFx0XHR0eXBlOiBcImNoYW5uZWxMaXN0XCIsXG5cdFx0XHRcdGNoYW5uZWxzOiB0aGlzLmdldENoYW5uZWxOYW1lcygpLFxuXHRcdFx0XHRyZXFJZDogZGF0YS5yZXFJZFxuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdF9oYW5kbGVDbG9zZUNoYW5uZWwoZGF0YSkge1xuXHRcdFx0aWYgKGRhdGEuY2hhbm5lbCkge1xuXHRcdFx0XHR0aGlzLmNsb3NlQ2hhbm5lbChkYXRhLmNoYW5uZWwpO1xuXHRcdFx0XHRwb3N0TWVzc2FnZSh7XG5cdFx0XHRcdFx0dHlwZTogXCJjaGFubmVsQ2xvc2VkXCIsXG5cdFx0XHRcdFx0Y2hhbm5lbDogZGF0YS5jaGFubmVsLFxuXHRcdFx0XHRcdHJlcUlkOiBkYXRhLnJlcUlkXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRfY2FuQWNjZXB0Q2hhbm5lbChjaGFubmVsKSB7XG5cdFx0XHRpZiAodGhpcy5fY29udGV4dC5zaXplID49IHRoaXMuX2NvbmZpZy5tYXhDaGFubmVscykgcmV0dXJuIGZhbHNlO1xuXHRcdFx0aWYgKHRoaXMuX2NvbmZpZy5hbGxvd2VkQ2hhbm5lbHMubGVuZ3RoID4gMCkgcmV0dXJuIHRoaXMuX2NvbmZpZy5hbGxvd2VkQ2hhbm5lbHMuaW5jbHVkZXMoY2hhbm5lbCk7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0X3Bvc3RDaGFubmVsQ3JlYXRlZChjaGFubmVsLCBzZW5kZXIsIHJlcUlkKSB7XG5cdFx0XHRwb3N0TWVzc2FnZSh7XG5cdFx0XHRcdHR5cGU6IFwiY2hhbm5lbENyZWF0ZWRcIixcblx0XHRcdFx0Y2hhbm5lbCxcblx0XHRcdFx0c2VuZGVyLFxuXHRcdFx0XHRyZXFJZCxcblx0XHRcdFx0dGltZXN0YW1wOiBEYXRlLm5vdygpXG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0Y2xvc2UoKSB7XG5cdFx0XHR0aGlzLl9zdWJzY3JpcHRpb25zLmZvckVhY2goKHMpID0+IHMudW5zdWJzY3JpYmUoKSk7XG5cdFx0XHR0aGlzLl9zdWJzY3JpcHRpb25zID0gW107XG5cdFx0XHR0aGlzLl9pbmNvbWluZ0Nvbm5lY3Rpb25zLmNvbXBsZXRlKCk7XG5cdFx0XHR0aGlzLl9jaGFubmVsQ3JlYXRlZC5jb21wbGV0ZSgpO1xuXHRcdFx0dGhpcy5fY2hhbm5lbENsb3NlZC5jb21wbGV0ZSgpO1xuXHRcdFx0dGhpcy5fY29udGV4dC5jbG9zZSgpO1xuXHRcdH1cblx0fTtcblx0bGV0IFdPUktFUl9DT05URVhUID0gbnVsbDtcblx0LyoqXG5cdCogR2V0IG9yIGNyZWF0ZSB0aGUgd29ya2VyIGNvbnRleHQgc2luZ2xldG9uXG5cdCovXG5cdGZ1bmN0aW9uIGdldFdvcmtlckNvbnRleHQoY29uZmlnKSB7XG5cdFx0aWYgKCFXT1JLRVJfQ09OVEVYVCkgV09SS0VSX0NPTlRFWFQgPSBuZXcgV29ya2VyQ29udGV4dChjb25maWcpO1xuXHRcdHJldHVybiBXT1JLRVJfQ09OVEVYVDtcblx0fVxuXHRjb25zdCBjdHggPSBnZXRXb3JrZXJDb250ZXh0KHsgbmFtZTogXCJ3b3JrZXJcIiB9KTtcblxuLy8jZW5kcmVnaW9uXG4vLyNyZWdpb24gLi4vdW5pZm9ybS50cy9zcmMvbmV3ZXIvbmV4dC90cmFuc3BvcnQvUG9ydFRyYW5zcG9ydC50c1xuLyoqXG5cdCogTWVzc2FnZVBvcnQvTWVzc2FnZUNoYW5uZWwgRW5oYW5jZWQgVHJhbnNwb3J0XG5cdCpcblx0KiBBZHZhbmNlZCBwb3J0LWJhc2VkIGNvbW11bmljYXRpb24gd2l0aDpcblx0KiAtIE1lc3NhZ2VDaGFubmVsIHBhaXIgY3JlYXRpb25cblx0KiAtIFBvcnQgcG9vbGluZyBhbmQgbWFuYWdlbWVudFxuXHQqIC0gQ3Jvc3MtY29udGV4dCB0cmFuc2ZlciAoaWZyYW1lLCB3b3JrZXIsIHdpbmRvdylcblx0KiAtIEF1dG9tYXRpYyByZWNvbm5lY3Rpb25cblx0KiAtIFJlcXVlc3QvcmVzcG9uc2Ugd2l0aCB0aW1lb3V0XG5cdCovXG5cdHZhciBQb3J0VHJhbnNwb3J0ID0gY2xhc3Mge1xuXHRcdF9jaGFubmVsTmFtZTtcblx0XHRfY29uZmlnO1xuXHRcdF9wb3J0O1xuXHRcdF9zdWJzID0gLyogQF9fUFVSRV9fICovIG5ldyBTZXQoKTtcblx0XHRfcGVuZGluZyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG5cdFx0X2xpc3RlbmluZyA9IGZhbHNlO1xuXHRcdF9jbGVhbnVwID0gbnVsbDtcblx0XHRfcG9ydElkID0gVVVJRHY0KCk7XG5cdFx0X3N0YXRlID0gbmV3IENoYW5uZWxTdWJqZWN0KCk7XG5cdFx0X2tlZXBBbGl2ZVRpbWVyID0gbnVsbDtcblx0XHRjb25zdHJ1Y3Rvcihwb3J0LCBfY2hhbm5lbE5hbWUsIF9jb25maWcgPSB7fSkge1xuXHRcdFx0dGhpcy5fY2hhbm5lbE5hbWUgPSBfY2hhbm5lbE5hbWU7XG5cdFx0XHR0aGlzLl9jb25maWcgPSBfY29uZmlnO1xuXHRcdFx0dGhpcy5fcG9ydCA9IHBvcnQ7XG5cdFx0XHR0aGlzLl9zZXR1cFBvcnQoKTtcblx0XHRcdGlmIChfY29uZmlnLmF1dG9TdGFydCAhPT0gZmFsc2UpIHRoaXMuc3RhcnQoKTtcblx0XHR9XG5cdFx0X3NldHVwUG9ydCgpIHtcblx0XHRcdGNvbnN0IG1zZ0hhbmRsZXIgPSAoZSkgPT4ge1xuXHRcdFx0XHRjb25zdCBkYXRhID0gZS5kYXRhO1xuXHRcdFx0XHRpZiAoZGF0YS50eXBlID09PSBcInJlc3BvbnNlXCIgJiYgZGF0YS5yZXFJZCkge1xuXHRcdFx0XHRcdGNvbnN0IHAgPSB0aGlzLl9wZW5kaW5nLmdldChkYXRhLnJlcUlkKTtcblx0XHRcdFx0XHRpZiAocCkge1xuXHRcdFx0XHRcdFx0dGhpcy5fcGVuZGluZy5kZWxldGUoZGF0YS5yZXFJZCk7XG5cdFx0XHRcdFx0XHRpZiAoZGF0YS5wYXlsb2FkPy5lcnJvcikgcC5yZWplY3QobmV3IEVycm9yKGRhdGEucGF5bG9hZC5lcnJvcikpO1xuXHRcdFx0XHRcdFx0ZWxzZSBwLnJlc29sdmUoZGF0YS5wYXlsb2FkPy5yZXN1bHQgPz8gZGF0YS5wYXlsb2FkKTtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGRhdGEudHlwZSA9PT0gXCJzaWduYWxcIiAmJiBkYXRhLnBheWxvYWQ/LmFjdGlvbiA9PT0gXCJwaW5nXCIpIHtcblx0XHRcdFx0XHR0aGlzLnNlbmQoe1xuXHRcdFx0XHRcdFx0aWQ6IFVVSUR2NCgpLFxuXHRcdFx0XHRcdFx0Y2hhbm5lbDogdGhpcy5fY2hhbm5lbE5hbWUsXG5cdFx0XHRcdFx0XHRzZW5kZXI6IHRoaXMuX3BvcnRJZCxcblx0XHRcdFx0XHRcdHR5cGU6IFwic2lnbmFsXCIsXG5cdFx0XHRcdFx0XHRwYXlsb2FkOiB7IGFjdGlvbjogXCJwb25nXCIgfVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHRkYXRhLnBvcnRJZCA9IGRhdGEucG9ydElkID8/IHRoaXMuX3BvcnRJZDtcblx0XHRcdFx0Zm9yIChjb25zdCBzIG9mIHRoaXMuX3N1YnMpIHRyeSB7XG5cdFx0XHRcdFx0cy5uZXh0Py4oZGF0YSk7XG5cdFx0XHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdFx0XHRzLmVycm9yPy4oZSk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0XHRjb25zdCBlcnJIYW5kbGVyID0gKCkgPT4ge1xuXHRcdFx0XHR0aGlzLl9zdGF0ZS5uZXh0KFwiZXJyb3JcIik7XG5cdFx0XHRcdGNvbnN0IGVyciA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgRXJyb3IoXCJQb3J0IGVycm9yXCIpO1xuXHRcdFx0XHRmb3IgKGNvbnN0IHMgb2YgdGhpcy5fc3Vicykgcy5lcnJvcj8uKGVycik7XG5cdFx0XHR9O1xuXHRcdFx0dGhpcy5fcG9ydC5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBtc2dIYW5kbGVyKTtcblx0XHRcdHRoaXMuX3BvcnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VlcnJvclwiLCBlcnJIYW5kbGVyKTtcblx0XHRcdHRoaXMuX2NsZWFudXAgPSAoKSA9PiB7XG5cdFx0XHRcdHRoaXMuX3BvcnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgbXNnSGFuZGxlcik7XG5cdFx0XHRcdHRoaXMuX3BvcnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VlcnJvclwiLCBlcnJIYW5kbGVyKTtcblx0XHRcdH07XG5cdFx0fVxuXHRcdHN0YXJ0KCkge1xuXHRcdFx0aWYgKHRoaXMuX2xpc3RlbmluZykgcmV0dXJuO1xuXHRcdFx0dGhpcy5fcG9ydC5zdGFydCgpO1xuXHRcdFx0dGhpcy5fbGlzdGVuaW5nID0gdHJ1ZTtcblx0XHRcdHRoaXMuX3N0YXRlLm5leHQoXCJyZWFkeVwiKTtcblx0XHRcdGlmICh0aGlzLl9jb25maWcua2VlcEFsaXZlKSB0aGlzLl9zdGFydEtlZXBBbGl2ZSgpO1xuXHRcdH1cblx0XHRzZW5kKG1zZywgdHJhbnNmZXIpIHtcblx0XHRcdGNvbnN0IHsgdHJhbnNmZXJhYmxlLCAuLi5kYXRhIH0gPSBtc2c7XG5cdFx0XHR0aGlzLl9wb3J0LnBvc3RNZXNzYWdlKHtcblx0XHRcdFx0Li4uZGF0YSxcblx0XHRcdFx0cG9ydElkOiB0aGlzLl9wb3J0SWRcblx0XHRcdH0sIHRyYW5zZmVyID8/IFtdKTtcblx0XHR9XG5cdFx0cmVxdWVzdChtc2cpIHtcblx0XHRcdGNvbnN0IHJlcUlkID0gbXNnLnJlcUlkID8/IFVVSUR2NCgpO1xuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdFx0Y29uc3QgdGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRcdHRoaXMuX3BlbmRpbmcuZGVsZXRlKHJlcUlkKTtcblx0XHRcdFx0XHRyZWplY3QoLyogQF9fUFVSRV9fICovIG5ldyBFcnJvcihcIlJlcXVlc3QgdGltZW91dFwiKSk7XG5cdFx0XHRcdH0sIHRoaXMuX2NvbmZpZy50aW1lb3V0ID8/IDNlNCk7XG5cdFx0XHRcdHRoaXMuX3BlbmRpbmcuc2V0KHJlcUlkLCB7XG5cdFx0XHRcdFx0cmVzb2x2ZTogKHYpID0+IHtcblx0XHRcdFx0XHRcdGNsZWFyVGltZW91dCh0aW1lb3V0KTtcblx0XHRcdFx0XHRcdHJlc29sdmUodik7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRyZWplY3Q6IChlKSA9PiB7XG5cdFx0XHRcdFx0XHRjbGVhclRpbWVvdXQodGltZW91dCk7XG5cdFx0XHRcdFx0XHRyZWplY3QoZSk7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR0aW1lc3RhbXA6IERhdGUubm93KClcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHRoaXMuc2VuZCh7XG5cdFx0XHRcdFx0Li4ubXNnLFxuXHRcdFx0XHRcdHJlcUlkLFxuXHRcdFx0XHRcdHR5cGU6IFwicmVxdWVzdFwiXG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdHN1YnNjcmliZShvYnNlcnZlcikge1xuXHRcdFx0Y29uc3Qgb2JzID0gdHlwZW9mIG9ic2VydmVyID09PSBcImZ1bmN0aW9uXCIgPyB7IG5leHQ6IG9ic2VydmVyIH0gOiBvYnNlcnZlcjtcblx0XHRcdHRoaXMuX3N1YnMuYWRkKG9icyk7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRjbG9zZWQ6IGZhbHNlLFxuXHRcdFx0XHR1bnN1YnNjcmliZTogKCkgPT4ge1xuXHRcdFx0XHRcdHRoaXMuX3N1YnMuZGVsZXRlKG9icyk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0fVxuXHRcdF9zdGFydEtlZXBBbGl2ZSgpIHtcblx0XHRcdHRoaXMuX2tlZXBBbGl2ZVRpbWVyID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuXHRcdFx0XHR0aGlzLnNlbmQoe1xuXHRcdFx0XHRcdGlkOiBVVUlEdjQoKSxcblx0XHRcdFx0XHRjaGFubmVsOiB0aGlzLl9jaGFubmVsTmFtZSxcblx0XHRcdFx0XHRzZW5kZXI6IHRoaXMuX3BvcnRJZCxcblx0XHRcdFx0XHR0eXBlOiBcInNpZ25hbFwiLFxuXHRcdFx0XHRcdHBheWxvYWQ6IHsgYWN0aW9uOiBcInBpbmdcIiB9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSwgdGhpcy5fY29uZmlnLmtlZXBBbGl2ZUludGVydmFsID8/IDNlNCk7XG5cdFx0fVxuXHRcdGNsb3NlKCkge1xuXHRcdFx0aWYgKHRoaXMuX2tlZXBBbGl2ZVRpbWVyKSB7XG5cdFx0XHRcdGNsZWFySW50ZXJ2YWwodGhpcy5fa2VlcEFsaXZlVGltZXIpO1xuXHRcdFx0XHR0aGlzLl9rZWVwQWxpdmVUaW1lciA9IG51bGw7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLl9jbGVhbnVwPy4oKTtcblx0XHRcdHRoaXMuX3N1YnMuZm9yRWFjaCgocykgPT4gcy5jb21wbGV0ZT8uKCkpO1xuXHRcdFx0dGhpcy5fc3Vicy5jbGVhcigpO1xuXHRcdFx0dGhpcy5fcG9ydC5jbG9zZSgpO1xuXHRcdFx0dGhpcy5fc3RhdGUubmV4dChcImNsb3NlZFwiKTtcblx0XHR9XG5cdFx0Z2V0IHBvcnQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fcG9ydDtcblx0XHR9XG5cdFx0Z2V0IHBvcnRJZCgpIHtcblx0XHRcdHJldHVybiB0aGlzLl9wb3J0SWQ7XG5cdFx0fVxuXHRcdGdldCBpc0xpc3RlbmluZygpIHtcblx0XHRcdHJldHVybiB0aGlzLl9saXN0ZW5pbmc7XG5cdFx0fVxuXHRcdGdldCBzdGF0ZSgpIHtcblx0XHRcdHJldHVybiB0aGlzLl9zdGF0ZTtcblx0XHR9XG5cdFx0Z2V0IGNoYW5uZWxOYW1lKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2NoYW5uZWxOYW1lO1xuXHRcdH1cblx0fTtcblx0LyoqXG5cdCogQ3JlYXRlIGEgTWVzc2FnZUNoYW5uZWwgcGFpciB3aXRoIGNvbmZpZ3VyZWQgbG9jYWwgdHJhbnNwb3J0XG5cdCovXG5cdGZ1bmN0aW9uIGNyZWF0ZUNoYW5uZWxQYWlyKGNoYW5uZWxOYW1lLCBjb25maWcpIHtcblx0XHRjb25zdCBjaGFubmVsID0gbmV3IE1lc3NhZ2VDaGFubmVsKCk7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGxvY2FsOiBuZXcgUG9ydFRyYW5zcG9ydChjaGFubmVsLnBvcnQxLCBjaGFubmVsTmFtZSwgY29uZmlnKSxcblx0XHRcdHJlbW90ZTogY2hhbm5lbC5wb3J0Mixcblx0XHRcdHRyYW5zZmVyOiAoKSA9PiB7XG5cdFx0XHRcdHJldHVybiBjaGFubmVsLnBvcnQyO1xuXHRcdFx0fVxuXHRcdH07XG5cdH1cblx0dmFyIFBvcnRQb29sID0gY2xhc3Mge1xuXHRcdF9kZWZhdWx0Q29uZmlnO1xuXHRcdF9jaGFubmVscyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG5cdFx0X21haW5Qb3J0ID0gbnVsbDtcblx0XHRfc3VicyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCk7XG5cdFx0Y29uc3RydWN0b3IoX2RlZmF1bHRDb25maWcgPSB7fSkge1xuXHRcdFx0dGhpcy5fZGVmYXVsdENvbmZpZyA9IF9kZWZhdWx0Q29uZmlnO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIENyZWF0ZSBuZXcgY2hhbm5lbCBpbiBwb29sXG5cdFx0Ki9cblx0XHRjcmVhdGUoY2hhbm5lbE5hbWUsIGNvbmZpZykge1xuXHRcdFx0Y29uc3QgcmVzdWx0ID0gY3JlYXRlQ2hhbm5lbFBhaXIoY2hhbm5lbE5hbWUsIHtcblx0XHRcdFx0Li4udGhpcy5fZGVmYXVsdENvbmZpZyxcblx0XHRcdFx0Li4uY29uZmlnXG5cdFx0XHR9KTtcblx0XHRcdHJlc3VsdC5sb2NhbC5zdWJzY3JpYmUoeyBuZXh0OiAobXNnKSA9PiB7XG5cdFx0XHRcdGZvciAoY29uc3QgcyBvZiB0aGlzLl9zdWJzKSB0cnkge1xuXHRcdFx0XHRcdHMubmV4dD8uKG1zZyk7XG5cdFx0XHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdFx0XHRzLmVycm9yPy4oZSk7XG5cdFx0XHRcdH1cblx0XHRcdH0gfSk7XG5cdFx0XHR0aGlzLl9jaGFubmVscy5zZXQoY2hhbm5lbE5hbWUsIHJlc3VsdC5sb2NhbCk7XG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH1cblx0XHQvKipcblx0XHQqIEFkZCBleGlzdGluZyBwb3J0IHRvIHBvb2xcblx0XHQqL1xuXHRcdGFkZChjaGFubmVsTmFtZSwgcG9ydCwgY29uZmlnKSB7XG5cdFx0XHRjb25zdCB0cmFuc3BvcnQgPSBuZXcgUG9ydFRyYW5zcG9ydChwb3J0LCBjaGFubmVsTmFtZSwge1xuXHRcdFx0XHQuLi50aGlzLl9kZWZhdWx0Q29uZmlnLFxuXHRcdFx0XHQuLi5jb25maWdcblx0XHRcdH0pO1xuXHRcdFx0dHJhbnNwb3J0LnN1YnNjcmliZSh7IG5leHQ6IChtc2cpID0+IHtcblx0XHRcdFx0Zm9yIChjb25zdCBzIG9mIHRoaXMuX3N1YnMpIHRyeSB7XG5cdFx0XHRcdFx0cy5uZXh0Py4obXNnKTtcblx0XHRcdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0XHRcdHMuZXJyb3I/LihlKTtcblx0XHRcdFx0fVxuXHRcdFx0fSB9KTtcblx0XHRcdHRoaXMuX2NoYW5uZWxzLnNldChjaGFubmVsTmFtZSwgdHJhbnNwb3J0KTtcblx0XHRcdHJldHVybiB0cmFuc3BvcnQ7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogR2V0IGNoYW5uZWwgYnkgbmFtZVxuXHRcdCovXG5cdFx0Z2V0KGNoYW5uZWxOYW1lKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY2hhbm5lbHMuZ2V0KGNoYW5uZWxOYW1lKTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBTZW5kIHRvIHNwZWNpZmljIGNoYW5uZWxcblx0XHQqL1xuXHRcdHNlbmQoY2hhbm5lbE5hbWUsIG1zZywgdHJhbnNmZXIpIHtcblx0XHRcdHRoaXMuX2NoYW5uZWxzLmdldChjaGFubmVsTmFtZSk/LnNlbmQobXNnLCB0cmFuc2Zlcik7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogQnJvYWRjYXN0IHRvIGFsbCBjaGFubmVsc1xuXHRcdCovXG5cdFx0YnJvYWRjYXN0KG1zZywgdHJhbnNmZXIpIHtcblx0XHRcdGZvciAoY29uc3QgdHJhbnNwb3J0IG9mIHRoaXMuX2NoYW5uZWxzLnZhbHVlcygpKSB0cmFuc3BvcnQuc2VuZChtc2csIHRyYW5zZmVyKTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBSZXF1ZXN0IG9uIHNwZWNpZmljIGNoYW5uZWxcblx0XHQqL1xuXHRcdHJlcXVlc3QoY2hhbm5lbE5hbWUsIG1zZykge1xuXHRcdFx0Y29uc3QgY2hhbm5lbCA9IHRoaXMuX2NoYW5uZWxzLmdldChjaGFubmVsTmFtZSk7XG5cdFx0XHRpZiAoIWNoYW5uZWwpIHJldHVybiBQcm9taXNlLnJlamVjdCgvKiBAX19QVVJFX18gKi8gbmV3IEVycm9yKGBDaGFubmVsICR7Y2hhbm5lbE5hbWV9IG5vdCBmb3VuZGApKTtcblx0XHRcdHJldHVybiBjaGFubmVsLnJlcXVlc3QobXNnKTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBTdWJzY3JpYmUgdG8gYWxsIGNoYW5uZWxzXG5cdFx0Ki9cblx0XHRzdWJzY3JpYmUob2JzZXJ2ZXIpIHtcblx0XHRcdGNvbnN0IG9icyA9IHR5cGVvZiBvYnNlcnZlciA9PT0gXCJmdW5jdGlvblwiID8geyBuZXh0OiBvYnNlcnZlciB9IDogb2JzZXJ2ZXI7XG5cdFx0XHR0aGlzLl9zdWJzLmFkZChvYnMpO1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0Y2xvc2VkOiBmYWxzZSxcblx0XHRcdFx0dW5zdWJzY3JpYmU6ICgpID0+IHtcblx0XHRcdFx0XHR0aGlzLl9zdWJzLmRlbGV0ZShvYnMpO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdH1cblx0XHQvKipcblx0XHQqIFJlbW92ZSBjaGFubmVsXG5cdFx0Ki9cblx0XHRyZW1vdmUoY2hhbm5lbE5hbWUpIHtcblx0XHRcdGNvbnN0IGNoYW5uZWwgPSB0aGlzLl9jaGFubmVscy5nZXQoY2hhbm5lbE5hbWUpO1xuXHRcdFx0aWYgKGNoYW5uZWwpIHtcblx0XHRcdFx0Y2hhbm5lbC5jbG9zZSgpO1xuXHRcdFx0XHR0aGlzLl9jaGFubmVscy5kZWxldGUoY2hhbm5lbE5hbWUpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHQvKipcblx0XHQqIENsb3NlIGFsbCBjaGFubmVsc1xuXHRcdCovXG5cdFx0Y2xvc2UoKSB7XG5cdFx0XHR0aGlzLl9zdWJzLmZvckVhY2goKHMpID0+IHMuY29tcGxldGU/LigpKTtcblx0XHRcdHRoaXMuX3N1YnMuY2xlYXIoKTtcblx0XHRcdGZvciAoY29uc3QgY2hhbm5lbCBvZiB0aGlzLl9jaGFubmVscy52YWx1ZXMoKSkgY2hhbm5lbC5jbG9zZSgpO1xuXHRcdFx0dGhpcy5fY2hhbm5lbHMuY2xlYXIoKTtcblx0XHR9XG5cdFx0Z2V0IGNoYW5uZWxOYW1lcygpIHtcblx0XHRcdHJldHVybiBBcnJheS5mcm9tKHRoaXMuX2NoYW5uZWxzLmtleXMoKSk7XG5cdFx0fVxuXHRcdGdldCBzaXplKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2NoYW5uZWxzLnNpemU7XG5cdFx0fVxuXHR9O1xuXHQvKipcblx0KiBDb25uZWN0IHRvIHdpbmRvdy9pZnJhbWUgdmlhIE1lc3NhZ2VDaGFubmVsXG5cdCovXG5cdHZhciBXaW5kb3dQb3J0Q29ubmVjdG9yID0gY2xhc3Mge1xuXHRcdF90YXJnZXQ7XG5cdFx0X2NoYW5uZWxOYW1lO1xuXHRcdF9jb25maWc7XG5cdFx0X3RyYW5zcG9ydCA9IG51bGw7XG5cdFx0X3N0YXRlID0gbmV3IENoYW5uZWxTdWJqZWN0KCk7XG5cdFx0X2hhbmRzaGFrZUNvbXBsZXRlID0gZmFsc2U7XG5cdFx0Y29uc3RydWN0b3IoX3RhcmdldCwgX2NoYW5uZWxOYW1lLCBfY29uZmlnID0ge30pIHtcblx0XHRcdHRoaXMuX3RhcmdldCA9IF90YXJnZXQ7XG5cdFx0XHR0aGlzLl9jaGFubmVsTmFtZSA9IF9jaGFubmVsTmFtZTtcblx0XHRcdHRoaXMuX2NvbmZpZyA9IF9jb25maWc7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogSW5pdGlhdGUgY29ubmVjdGlvbiB0byB0YXJnZXQgd2luZG93XG5cdFx0Ki9cblx0XHRhc3luYyBjb25uZWN0KCkge1xuXHRcdFx0aWYgKHRoaXMuX3RyYW5zcG9ydCAmJiB0aGlzLl9oYW5kc2hha2VDb21wbGV0ZSkgcmV0dXJuIHRoaXMuX3RyYW5zcG9ydDtcblx0XHRcdHRoaXMuX3N0YXRlLm5leHQoXCJjb25uZWN0aW5nXCIpO1xuXHRcdFx0Y29uc3QgeyBsb2NhbCwgcmVtb3RlIH0gPSBjcmVhdGVDaGFubmVsUGFpcih0aGlzLl9jaGFubmVsTmFtZSwgdGhpcy5fY29uZmlnKTtcblx0XHRcdHRoaXMuX3RhcmdldC5wb3N0TWVzc2FnZSh7XG5cdFx0XHRcdHR5cGU6IFwicG9ydC1jb25uZWN0XCIsXG5cdFx0XHRcdGNoYW5uZWxOYW1lOiB0aGlzLl9jaGFubmVsTmFtZSxcblx0XHRcdFx0cG9ydElkOiBsb2NhbC5wb3J0SWRcblx0XHRcdH0sIHRoaXMuX2NvbmZpZy50YXJnZXRPcmlnaW4gPz8gXCIqXCIsIFtyZW1vdGVdKTtcblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHRcdGNvbnN0IHRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFx0XHRyZWplY3QoLyogQF9fUFVSRV9fICovIG5ldyBFcnJvcihcIkhhbmRzaGFrZSB0aW1lb3V0XCIpKTtcblx0XHRcdFx0XHR0aGlzLl9zdGF0ZS5uZXh0KFwiZXJyb3JcIik7XG5cdFx0XHRcdH0sIHRoaXMuX2NvbmZpZy5oYW5kc2hha2VUaW1lb3V0ID8/IDFlNCk7XG5cdFx0XHRcdGNvbnN0IHN1YiA9IGxvY2FsLnN1YnNjcmliZSh7IG5leHQ6IChtc2cpID0+IHtcblx0XHRcdFx0XHRpZiAobXNnLnR5cGUgPT09IFwic2lnbmFsXCIgJiYgbXNnLnBheWxvYWQ/LmFjdGlvbiA9PT0gXCJoYW5kc2hha2UtYWNrXCIpIHtcblx0XHRcdFx0XHRcdGNsZWFyVGltZW91dCh0aW1lb3V0KTtcblx0XHRcdFx0XHRcdHRoaXMuX2hhbmRzaGFrZUNvbXBsZXRlID0gdHJ1ZTtcblx0XHRcdFx0XHRcdHRoaXMuX3RyYW5zcG9ydCA9IGxvY2FsO1xuXHRcdFx0XHRcdFx0dGhpcy5fc3RhdGUubmV4dChcImNvbm5lY3RlZFwiKTtcblx0XHRcdFx0XHRcdHN1Yi51bnN1YnNjcmliZSgpO1xuXHRcdFx0XHRcdFx0cmVzb2x2ZShsb2NhbCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IH0pO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogTGlzdGVuIGZvciBpbmNvbWluZyBjb25uZWN0aW9ucyAodGFyZ2V0IHNpZGUpXG5cdFx0Ki9cblx0XHRzdGF0aWMgbGlzdGVuKGNoYW5uZWxOYW1lLCBoYW5kbGVyLCBjb25maWcpIHtcblx0XHRcdGNvbnN0IG1zZ0hhbmRsZXIgPSAoZSkgPT4ge1xuXHRcdFx0XHRpZiAoZS5kYXRhPy50eXBlICE9PSBcInBvcnQtY29ubmVjdFwiIHx8IGUuZGF0YT8uY2hhbm5lbE5hbWUgIT09IGNoYW5uZWxOYW1lKSByZXR1cm47XG5cdFx0XHRcdGlmICghZS5wb3J0c1swXSkgcmV0dXJuO1xuXHRcdFx0XHRjb25zdCB0cmFuc3BvcnQgPSBuZXcgUG9ydFRyYW5zcG9ydChlLnBvcnRzWzBdLCBjaGFubmVsTmFtZSwgY29uZmlnKTtcblx0XHRcdFx0dHJhbnNwb3J0LnNlbmQoe1xuXHRcdFx0XHRcdGlkOiBVVUlEdjQoKSxcblx0XHRcdFx0XHRjaGFubmVsOiBjaGFubmVsTmFtZSxcblx0XHRcdFx0XHRzZW5kZXI6IHRyYW5zcG9ydC5wb3J0SWQsXG5cdFx0XHRcdFx0dHlwZTogXCJzaWduYWxcIixcblx0XHRcdFx0XHRwYXlsb2FkOiB7IGFjdGlvbjogXCJoYW5kc2hha2UtYWNrXCIgfVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0aGFuZGxlcih0cmFuc3BvcnQpO1xuXHRcdFx0fTtcblx0XHRcdGdsb2JhbFRoaXMuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgbXNnSGFuZGxlcik7XG5cdFx0XHRyZXR1cm4gKCkgPT4gZ2xvYmFsVGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBtc2dIYW5kbGVyKTtcblx0XHR9XG5cdFx0ZGlzY29ubmVjdCgpIHtcblx0XHRcdHRoaXMuX3RyYW5zcG9ydD8uY2xvc2UoKTtcblx0XHRcdHRoaXMuX3RyYW5zcG9ydCA9IG51bGw7XG5cdFx0XHR0aGlzLl9oYW5kc2hha2VDb21wbGV0ZSA9IGZhbHNlO1xuXHRcdFx0dGhpcy5fc3RhdGUubmV4dChcImRpc2Nvbm5lY3RlZFwiKTtcblx0XHR9XG5cdFx0Z2V0IGlzQ29ubmVjdGVkKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2hhbmRzaGFrZUNvbXBsZXRlO1xuXHRcdH1cblx0XHRnZXQgc3RhdGUoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fc3RhdGU7XG5cdFx0fVxuXHRcdGdldCB0cmFuc3BvcnQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fdHJhbnNwb3J0O1xuXHRcdH1cblx0fTtcblx0LyoqXG5cdCogQ3JlYXRlIHByb3h5IGZvciByZW1vdGUgb2JqZWN0IG92ZXIgUG9ydFRyYW5zcG9ydFxuXHQqXG5cdCogVXNlcyB1bmlmaWVkIFByb3h5IG1vZHVsZSBmb3IgY29uc2lzdGVudCBiZWhhdmlvci5cblx0Ki9cblx0ZnVuY3Rpb24gY3JlYXRlUG9ydFByb3h5KHRyYW5zcG9ydCwgdGFyZ2V0UGF0aCA9IFtdKSB7XG5cdFx0cmV0dXJuIGNyZWF0ZVNlbmRlclByb3h5KHtcblx0XHRcdHJlcXVlc3Q6IChtc2cpID0+IHRyYW5zcG9ydC5yZXF1ZXN0KG1zZyksXG5cdFx0XHRjaGFubmVsTmFtZTogdHJhbnNwb3J0LmNoYW5uZWxOYW1lLFxuXHRcdFx0c2VuZGVySWQ6IHRyYW5zcG9ydC5wb3J0SWRcblx0XHR9LCB0YXJnZXRQYXRoKTtcblx0fVxuXHQvKipcblx0KiBFeHBvc2Ugb2JqZWN0IG1ldGhvZHMgb3ZlciBQb3J0VHJhbnNwb3J0XG5cdCpcblx0KiBVc2VzIHVuaWZpZWQgUHJveHkgbW9kdWxlJ3MgZXhwb3NlIGhhbmRsZXIuXG5cdCovXG5cdGZ1bmN0aW9uIGV4cG9zZU92ZXJQb3J0KHRyYW5zcG9ydCwgdGFyZ2V0KSB7XG5cdFx0Y29uc3QgaGFuZGxlciA9IGNyZWF0ZUV4cG9zZUhhbmRsZXIodGFyZ2V0KTtcblx0XHRyZXR1cm4gdHJhbnNwb3J0LnN1YnNjcmliZSh7IG5leHQ6IGFzeW5jIChtc2cpID0+IHtcblx0XHRcdGlmIChtc2cudHlwZSAhPT0gXCJyZXF1ZXN0XCIgfHwgIW1zZy5wYXlsb2FkPy5wYXRoKSByZXR1cm47XG5cdFx0XHRjb25zdCB7IGFjdGlvbiwgcGF0aCwgYXJncyB9ID0gbXNnLnBheWxvYWQ7XG5cdFx0XHRsZXQgcmVzdWx0O1xuXHRcdFx0bGV0IGVycm9yO1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0cmVzdWx0ID0gYXdhaXQgaGFuZGxlcihhY3Rpb24sIHBhdGgsIGFyZ3MgPz8gW10pO1xuXHRcdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0XHRlcnJvciA9IGUgaW5zdGFuY2VvZiBFcnJvciA/IGUubWVzc2FnZSA6IFN0cmluZyhlKTtcblx0XHRcdH1cblx0XHRcdHRyYW5zcG9ydC5zZW5kKHtcblx0XHRcdFx0aWQ6IFVVSUR2NCgpLFxuXHRcdFx0XHRjaGFubmVsOiBtc2cuc2VuZGVyLFxuXHRcdFx0XHRzZW5kZXI6IHRyYW5zcG9ydC5wb3J0SWQsXG5cdFx0XHRcdHR5cGU6IFwicmVzcG9uc2VcIixcblx0XHRcdFx0cmVxSWQ6IG1zZy5yZXFJZCxcblx0XHRcdFx0cGF5bG9hZDogZXJyb3IgPyB7IGVycm9yIH0gOiB7IHJlc3VsdCB9XG5cdFx0XHR9KTtcblx0XHR9IH0pO1xuXHR9XG5cdGNvbnN0IFBvcnRUcmFuc3BvcnRGYWN0b3J5ID0ge1xuXHRcdGNyZWF0ZTogKHBvcnQsIG5hbWUsIGNvbmZpZykgPT4gbmV3IFBvcnRUcmFuc3BvcnQocG9ydCwgbmFtZSwgY29uZmlnKSxcblx0XHRjcmVhdGVQYWlyOiAobmFtZSwgY29uZmlnKSA9PiBjcmVhdGVDaGFubmVsUGFpcihuYW1lLCBjb25maWcpLFxuXHRcdGNyZWF0ZVBvb2w6IChjb25maWcpID0+IG5ldyBQb3J0UG9vbChjb25maWcpLFxuXHRcdGNyZWF0ZVdpbmRvd0Nvbm5lY3RvcjogKHRhcmdldCwgbmFtZSwgY29uZmlnKSA9PiBuZXcgV2luZG93UG9ydENvbm5lY3Rvcih0YXJnZXQsIG5hbWUsIGNvbmZpZyksXG5cdFx0bGlzdGVuOiBXaW5kb3dQb3J0Q29ubmVjdG9yLmxpc3Rlbixcblx0XHRjcmVhdGVQcm94eTogY3JlYXRlUG9ydFByb3h5LFxuXHRcdGV4cG9zZTogZXhwb3NlT3ZlclBvcnRcblx0fTtcblxuLy8jZW5kcmVnaW9uXG4vLyNyZWdpb24gLi4vdW5pZm9ybS50cy9zcmMvbmV3ZXIvbmV4dC9zdG9yYWdlL1F1ZXVlZC50c1xuLyoqXG5cdCogU2ltcGxpZmllZCB3b3JrZXIgcmVnaXN0cmF0aW9uIGZvciBjb21tb24gcGF0dGVybnNcblx0Ki9cblx0Y29uc3QgcmVnaXN0ZXJXb3JrZXJBUEkgPSAoYXBpLCBjaGFubmVsTmFtZSA9IFwid29ya2VyXCIpID0+IHtcblx0XHRjb25zdCBjaGFubmVsSGFuZGxlciA9IGluaXRDaGFubmVsSGFuZGxlcihjaGFubmVsTmFtZSA/PyBcIndvcmtlclwiKTtcblx0XHRPYmplY3Qua2V5cyhhcGkpLmZvckVhY2goKG1ldGhvZE5hbWUpID0+IHtcblx0XHRcdGlmICh0eXBlb2YgYXBpW21ldGhvZE5hbWVdID09PSBcImZ1bmN0aW9uXCIpIHt9XG5cdFx0fSk7XG5cdFx0cmV0dXJuIGNoYW5uZWxIYW5kbGVyO1xuXHR9O1xuXG4vLyNlbmRyZWdpb25cbi8vI3JlZ2lvbiBzcmMvdXRpbHMvb3Bmcy9PUEZTLndvcmtlci50c1xuXHR2YXIgT1BGU193b3JrZXJfZXhwb3J0cyA9IC8qIEBfX1BVUkVfXyAqLyBfX2V4cG9ydEFsbCh7XG5cdFx0Z2V0RGlySGFuZGxlOiAoKSA9PiBnZXREaXJIYW5kbGUsXG5cdFx0Z2V0RmlsZVN5c3RlbVJvb3Q6ICgpID0+IGdldEZpbGVTeXN0ZW1Sb290LFxuXHRcdGhhbmRsZXJzOiAoKSA9PiBoYW5kbGVycyxcblx0XHRub3JtYWxpemVQYXRoOiAoKSA9PiBub3JtYWxpemVQYXRoLFxuXHRcdHJlc29sdmVGaWxlU3lzdGVtSGFuZGxlOiAoKSA9PiByZXNvbHZlRmlsZVN5c3RlbUhhbmRsZVxuXHR9KTtcblx0dmFyIG1hcHBlZFJvb3RzLCBhY3RpdmVPYnNlcnZlcnMsIGdldEZpbGVTeXN0ZW1Sb290LCBub3JtYWxpemVQYXRoLCByZXNvbHZlRmlsZVN5c3RlbUhhbmRsZSwgZ2V0RGlySGFuZGxlLCBoYW5kbGVycywgU1dfQlJJREdFX0NIQU5ORUxfTkFNRSwgc3dCcmlkZ2VDaGFubmVsO1xuXHR2YXIgaW5pdF9PUEZTX3dvcmtlciA9IF9fZXNtTWluKCgoKSA9PiB7XG5cdFx0bWFwcGVkUm9vdHMgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuXHRcdGFjdGl2ZU9ic2VydmVycyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG5cdFx0Z2V0RmlsZVN5c3RlbVJvb3QgPSBhc3luYyAoaWQgPSBcIlwiKSA9PiB7XG5cdFx0XHRpZiAoaWQgJiYgbWFwcGVkUm9vdHMuaGFzKGlkKSkgcmV0dXJuIG1hcHBlZFJvb3RzLmdldChpZCk7XG5cdFx0XHRyZXR1cm4gYXdhaXQgbmF2aWdhdG9yLnN0b3JhZ2UuZ2V0RGlyZWN0b3J5KCk7XG5cdFx0fTtcblx0XHRub3JtYWxpemVQYXRoID0gKHBhdGgpID0+IHtcblx0XHRcdHJldHVybiBwYXRoPy50cmltPy4oKT8ucmVwbGFjZSgvXFwvKy9nLCBcIi9cIikgfHwgXCIvXCI7XG5cdFx0fTtcblx0XHRyZXNvbHZlRmlsZVN5c3RlbUhhbmRsZSA9IGFzeW5jIChyb290LCBwYXRoLCBjcmVhdGUgPSBmYWxzZSkgPT4ge1xuXHRcdFx0Y29uc3QgcGFydHMgPSBub3JtYWxpemVQYXRoKHBhdGgpLnNwbGl0KFwiL1wiKS5maWx0ZXIoKHApID0+IHAgJiYgcCAhPT0gXCIuXCIpO1xuXHRcdFx0bGV0IGN1cnJlbnQgPSByb290O1xuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBwYXJ0cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRjb25zdCBwYXJ0ID0gcGFydHNbaV07XG5cdFx0XHRcdGlmIChpID09PSBwYXJ0cy5sZW5ndGggLSAxKSB0cnkge1xuXHRcdFx0XHRcdHJldHVybiBhd2FpdCBjdXJyZW50LmdldERpcmVjdG9yeUhhbmRsZShwYXJ0LCB7IGNyZWF0ZSB9KTtcblx0XHRcdFx0fSBjYXRjaCB7XG5cdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdHJldHVybiBhd2FpdCBjdXJyZW50LmdldEZpbGVIYW5kbGUocGFydCwgeyBjcmVhdGUgfSk7XG5cdFx0XHRcdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0XHRcdFx0aWYgKGNyZWF0ZSkgdGhyb3cgZTtcblx0XHRcdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGN1cnJlbnQgPSBhd2FpdCBjdXJyZW50LmdldERpcmVjdG9yeUhhbmRsZShwYXJ0LCB7IGNyZWF0ZSB9KTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBjdXJyZW50O1xuXHRcdH07XG5cdFx0Z2V0RGlySGFuZGxlID0gYXN5bmMgKHJvb3QsIHBhdGgsIGNyZWF0ZSkgPT4ge1xuXHRcdFx0Y29uc3QgcGFydHMgPSBub3JtYWxpemVQYXRoKHBhdGgpLnNwbGl0KFwiL1wiKS5maWx0ZXIoKHApID0+IHApO1xuXHRcdFx0bGV0IGN1cnJlbnQgPSByb290O1xuXHRcdFx0Zm9yIChjb25zdCBwYXJ0IG9mIHBhcnRzKSBjdXJyZW50ID0gYXdhaXQgY3VycmVudC5nZXREaXJlY3RvcnlIYW5kbGUocGFydCwgeyBjcmVhdGUgfSk7XG5cdFx0XHRyZXR1cm4gY3VycmVudDtcblx0XHR9O1xuXHRcdGhhbmRsZXJzID0ge1xuXHRcdFx0bW91bnQ6IGFzeW5jICh7IGlkLCBoYW5kbGUgfSkgPT4ge1xuXHRcdFx0XHRtYXBwZWRSb290cy5zZXQoaWQsIGhhbmRsZSk7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fSxcblx0XHRcdHVubW91bnQ6IGFzeW5jICh7IGlkIH0pID0+IHtcblx0XHRcdFx0bWFwcGVkUm9vdHMuZGVsZXRlKGlkKTtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9LFxuXHRcdFx0cmVhZERpcmVjdG9yeTogYXN5bmMgKHsgcm9vdElkLCBwYXRoLCBjcmVhdGUgfSkgPT4ge1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdGNvbnN0IHJvb3QgPSBhd2FpdCBnZXRGaWxlU3lzdGVtUm9vdChyb290SWQpO1xuXHRcdFx0XHRcdGNvbnN0IGhhbmRsZSA9IGF3YWl0IGdldERpckhhbmRsZShyb290LCBwYXRoLCBjcmVhdGUpO1xuXHRcdFx0XHRcdGNvbnN0IGVudHJpZXMgPSBbXTtcblx0XHRcdFx0XHRmb3IgYXdhaXQgKGNvbnN0IFtuYW1lLCBlbnRyeV0gb2YgaGFuZGxlLmVudHJpZXMoKSkgZW50cmllcy5wdXNoKFtuYW1lLCBlbnRyeV0pO1xuXHRcdFx0XHRcdHJldHVybiBlbnRyaWVzO1xuXHRcdFx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRcdFx0Y29uc29sZS53YXJuKFwiV29ya2VyIHJlYWREaXJlY3RvcnkgZXJyb3I6XCIsIGUpO1xuXHRcdFx0XHRcdHJldHVybiBbXTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdHJlYWRGaWxlOiBhc3luYyAoeyByb290SWQsIHBhdGgsIHR5cGUgfSkgPT4ge1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdGNvbnN0IHJvb3QgPSBhd2FpdCBnZXRGaWxlU3lzdGVtUm9vdChyb290SWQpO1xuXHRcdFx0XHRcdGNvbnN0IHBhcnRzID0gbm9ybWFsaXplUGF0aChwYXRoKS5zcGxpdChcIi9cIikuZmlsdGVyKChwKSA9PiBwKTtcblx0XHRcdFx0XHRjb25zdCBmaWxlbmFtZSA9IHBhcnRzLnBvcCgpO1xuXHRcdFx0XHRcdGNvbnN0IGRpclBhdGggPSBwYXJ0cy5qb2luKFwiL1wiKTtcblx0XHRcdFx0XHRjb25zdCBmaWxlID0gYXdhaXQgKGF3YWl0IChhd2FpdCBnZXREaXJIYW5kbGUocm9vdCwgZGlyUGF0aCwgZmFsc2UpKS5nZXRGaWxlSGFuZGxlKGZpbGVuYW1lLCB7IGNyZWF0ZTogZmFsc2UgfSkpLmdldEZpbGUoKTtcblx0XHRcdFx0XHRpZiAodHlwZSA9PT0gXCJ0ZXh0XCIpIHJldHVybiBhd2FpdCBmaWxlLnRleHQoKTtcblx0XHRcdFx0XHRpZiAodHlwZSA9PT0gXCJhcnJheUJ1ZmZlclwiKSByZXR1cm4gYXdhaXQgZmlsZS5hcnJheUJ1ZmZlcigpO1xuXHRcdFx0XHRcdGlmICh0eXBlID09PSBcImJsb2JcIikgcmV0dXJuIGZpbGU7XG5cdFx0XHRcdFx0cmV0dXJuIGZpbGU7XG5cdFx0XHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdFx0XHRjb25zb2xlLndhcm4oXCJXb3JrZXIgcmVhZEZpbGUgZXJyb3I6XCIsIGUpO1xuXHRcdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0d3JpdGVGaWxlOiBhc3luYyAoeyByb290SWQsIHBhdGgsIGRhdGEgfSkgPT4ge1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdGNvbnN0IHJvb3QgPSBhd2FpdCBnZXRGaWxlU3lzdGVtUm9vdChyb290SWQpO1xuXHRcdFx0XHRcdGNvbnN0IHBhcnRzID0gbm9ybWFsaXplUGF0aChwYXRoKS5zcGxpdChcIi9cIikuZmlsdGVyKChwKSA9PiBwKTtcblx0XHRcdFx0XHRjb25zdCBmaWxlbmFtZSA9IHBhcnRzLnBvcCgpO1xuXHRcdFx0XHRcdGNvbnN0IGRpclBhdGggPSBwYXJ0cy5qb2luKFwiL1wiKTtcblx0XHRcdFx0XHRjb25zdCB3cml0YWJsZSA9IGF3YWl0IChhd2FpdCAoYXdhaXQgZ2V0RGlySGFuZGxlKHJvb3QsIGRpclBhdGgsIHRydWUpKS5nZXRGaWxlSGFuZGxlKGZpbGVuYW1lLCB7IGNyZWF0ZTogdHJ1ZSB9KSkuY3JlYXRlV3JpdGFibGUoKTtcblx0XHRcdFx0XHRhd2FpdCB3cml0YWJsZS53cml0ZShkYXRhKTtcblx0XHRcdFx0XHRhd2FpdCB3cml0YWJsZS5jbG9zZSgpO1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRcdFx0Y29uc29sZS53YXJuKFwiV29ya2VyIHdyaXRlRmlsZSBlcnJvcjpcIiwgZSk7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0cmVtb3ZlOiBhc3luYyAoeyByb290SWQsIHBhdGgsIHJlY3Vyc2l2ZSB9KSA9PiB7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0Y29uc3Qgcm9vdCA9IGF3YWl0IGdldEZpbGVTeXN0ZW1Sb290KHJvb3RJZCk7XG5cdFx0XHRcdFx0Y29uc3QgcGFydHMgPSBub3JtYWxpemVQYXRoKHBhdGgpLnNwbGl0KFwiL1wiKS5maWx0ZXIoKHApID0+IHApO1xuXHRcdFx0XHRcdGNvbnN0IG5hbWUgPSBwYXJ0cy5wb3AoKTtcblx0XHRcdFx0XHRjb25zdCBkaXJQYXRoID0gcGFydHMuam9pbihcIi9cIik7XG5cdFx0XHRcdFx0YXdhaXQgKGF3YWl0IGdldERpckhhbmRsZShyb290LCBkaXJQYXRoLCBmYWxzZSkpLnJlbW92ZUVudHJ5KG5hbWUsIHsgcmVjdXJzaXZlIH0pO1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0b2JzZXJ2ZTogYXN5bmMgKHsgcm9vdElkLCBwYXRoLCBpZCB9KSA9PiB7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0aWYgKGFjdGl2ZU9ic2VydmVycy5oYXMoaWQpKSByZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHRjb25zdCByb290ID0gYXdhaXQgZ2V0RmlsZVN5c3RlbVJvb3Qocm9vdElkKTtcblx0XHRcdFx0XHRjb25zdCBoYW5kbGUgPSBhd2FpdCBnZXREaXJIYW5kbGUocm9vdCwgcGF0aCwgZmFsc2UpO1xuXHRcdFx0XHRcdGlmICh0eXBlb2YgRmlsZVN5c3RlbU9ic2VydmVyICE9PSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRcdFx0XHRjb25zdCBvYnNlcnZlciA9IG5ldyBGaWxlU3lzdGVtT2JzZXJ2ZXIoKHJlY29yZHMpID0+IHtcblx0XHRcdFx0XHRcdFx0Y29uc3QgY2hhbmdlcyA9IHJlY29yZHMubWFwKChyKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0Y29uc3QgbmFtZSA9IHIuY2hhbmdlZEhhbmRsZT8ubmFtZSB8fCByLnJlbGF0aXZlUGF0aENvbXBvbmVudHM/LmF0KC0xKTtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0dHlwZTogci50eXBlLFxuXHRcdFx0XHRcdFx0XHRcdFx0bmFtZSxcblx0XHRcdFx0XHRcdFx0XHRcdGtpbmQ6IHIuY2hhbmdlZEhhbmRsZT8ua2luZCB8fCAobmFtZT8uaW5jbHVkZXMoXCIuXCIpID8gXCJmaWxlXCIgOiBcImRpcmVjdG9yeVwiKSxcblx0XHRcdFx0XHRcdFx0XHRcdGhhbmRsZTogci5jaGFuZ2VkSGFuZGxlLFxuXHRcdFx0XHRcdFx0XHRcdFx0cGF0aDogci5yZWxhdGl2ZVBhdGhDb21wb25lbnRzLmpvaW4oXCIvXCIpXG5cdFx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdHNlbGYucG9zdE1lc3NhZ2Uoe1xuXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwib2JzZXJ2YXRpb25cIixcblx0XHRcdFx0XHRcdFx0XHRpZCxcblx0XHRcdFx0XHRcdFx0XHRjaGFuZ2VzXG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRvYnNlcnZlci5vYnNlcnZlKGhhbmRsZSk7XG5cdFx0XHRcdFx0XHRhY3RpdmVPYnNlcnZlcnMuc2V0KGlkLCBvYnNlcnZlcik7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0dW5vYnNlcnZlOiBhc3luYyAoeyBpZCB9KSA9PiB7XG5cdFx0XHRcdGNvbnN0IG9ic2VydmVyID0gYWN0aXZlT2JzZXJ2ZXJzLmdldChpZCk7XG5cdFx0XHRcdGlmIChvYnNlcnZlcikge1xuXHRcdFx0XHRcdG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcblx0XHRcdFx0XHRhY3RpdmVPYnNlcnZlcnMuZGVsZXRlKGlkKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH0sXG5cdFx0XHRjb3B5OiBhc3luYyAoeyBmcm9tLCB0byB9KSA9PiB7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0Y29uc3QgY29weVJlY3Vyc2l2ZSA9IGFzeW5jIChzb3VyY2UsIGRlc3QpID0+IHtcblx0XHRcdFx0XHRcdGlmIChzb3VyY2Uua2luZCA9PT0gXCJkaXJlY3RvcnlcIikgZm9yIGF3YWl0IChjb25zdCBbbmFtZSwgZW50cnldIG9mIHNvdXJjZS5lbnRyaWVzKCkpIGlmIChlbnRyeS5raW5kID09PSBcImRpcmVjdG9yeVwiKSB7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IG5ld0Rlc3QgPSBhd2FpdCBkZXN0LmdldERpcmVjdG9yeUhhbmRsZShuYW1lLCB7IGNyZWF0ZTogdHJ1ZSB9KTtcblx0XHRcdFx0XHRcdFx0YXdhaXQgY29weVJlY3Vyc2l2ZShlbnRyeSwgbmV3RGVzdCk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRjb25zdCBmaWxlID0gYXdhaXQgZW50cnkuZ2V0RmlsZSgpO1xuXHRcdFx0XHRcdFx0XHRjb25zdCB3cml0YWJsZSA9IGF3YWl0IChhd2FpdCBkZXN0LmdldEZpbGVIYW5kbGUobmFtZSwgeyBjcmVhdGU6IHRydWUgfSkpLmNyZWF0ZVdyaXRhYmxlKCk7XG5cdFx0XHRcdFx0XHRcdGF3YWl0IHdyaXRhYmxlLndyaXRlKGZpbGUpO1xuXHRcdFx0XHRcdFx0XHRhd2FpdCB3cml0YWJsZS5jbG9zZSgpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IGZpbGUgPSBhd2FpdCBzb3VyY2UuZ2V0RmlsZSgpO1xuXHRcdFx0XHRcdFx0XHRjb25zdCB3cml0YWJsZSA9IGF3YWl0IGRlc3QuY3JlYXRlV3JpdGFibGUoKTtcblx0XHRcdFx0XHRcdFx0YXdhaXQgd3JpdGFibGUud3JpdGUoZmlsZSk7XG5cdFx0XHRcdFx0XHRcdGF3YWl0IHdyaXRhYmxlLmNsb3NlKCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRhd2FpdCBjb3B5UmVjdXJzaXZlKGZyb20sIHRvKTtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0XHRcdGNvbnNvbGUud2FybihcIldvcmtlciBjb3B5IGVycm9yOlwiLCBlKTtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9O1xuXHRcdFNXX0JSSURHRV9DSEFOTkVMX05BTUUgPSBcIm9wZnMtc3ctYnJpZGdlLXYxXCI7XG5cdFx0c3dCcmlkZ2VDaGFubmVsID0gbnVsbDtcblx0XHR0cnkge1xuXHRcdFx0aWYgKHR5cGVvZiBCcm9hZGNhc3RDaGFubmVsICE9PSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRcdHN3QnJpZGdlQ2hhbm5lbCA9IG5ldyBCcm9hZGNhc3RDaGFubmVsKFNXX0JSSURHRV9DSEFOTkVMX05BTUUpO1xuXHRcdFx0XHRzd0JyaWRnZUNoYW5uZWwub25tZXNzYWdlID0gYXN5bmMgKGV2ZW50KSA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgZGF0YSA9IGV2ZW50Py5kYXRhIHx8IHt9O1xuXHRcdFx0XHRcdGlmICghZGF0YSB8fCB0eXBlb2YgZGF0YSAhPT0gXCJvYmplY3RcIikgcmV0dXJuO1xuXHRcdFx0XHRcdGlmIChkYXRhPy50eXBlICE9PSBcIm9wZnMtc3ctcmVxdWVzdFwiKSByZXR1cm47XG5cdFx0XHRcdFx0Y29uc3QgcmVxdWVzdElkID0gU3RyaW5nKGRhdGE/LnJlcXVlc3RJZCB8fCBcIlwiKTtcblx0XHRcdFx0XHRjb25zdCBhY3Rpb24gPSBTdHJpbmcoZGF0YT8uYWN0aW9uIHx8IFwiXCIpO1xuXHRcdFx0XHRcdGNvbnN0IHBheWxvYWQgPSBkYXRhPy5wYXlsb2FkO1xuXHRcdFx0XHRcdGlmICghcmVxdWVzdElkIHx8ICFhY3Rpb24pIHJldHVybjtcblx0XHRcdFx0XHRjb25zdCBoYW5kbGVyID0gaGFuZGxlcnNbYWN0aW9uXTtcblx0XHRcdFx0XHRpZiAoIWhhbmRsZXIpIHtcblx0XHRcdFx0XHRcdHN3QnJpZGdlQ2hhbm5lbD8ucG9zdE1lc3NhZ2U/Lih7XG5cdFx0XHRcdFx0XHRcdHR5cGU6IFwib3Bmcy1zdy1yZXNwb25zZVwiLFxuXHRcdFx0XHRcdFx0XHRyZXF1ZXN0SWQsXG5cdFx0XHRcdFx0XHRcdG9rOiBmYWxzZSxcblx0XHRcdFx0XHRcdFx0ZXJyb3I6IGBVbmtub3duIG9wZXJhdGlvbiB0eXBlOiAke2FjdGlvbn1gXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdGNvbnN0IHJlc3VsdCA9IGF3YWl0IGhhbmRsZXIocGF5bG9hZCk7XG5cdFx0XHRcdFx0XHRzd0JyaWRnZUNoYW5uZWw/LnBvc3RNZXNzYWdlPy4oe1xuXHRcdFx0XHRcdFx0XHR0eXBlOiBcIm9wZnMtc3ctcmVzcG9uc2VcIixcblx0XHRcdFx0XHRcdFx0cmVxdWVzdElkLFxuXHRcdFx0XHRcdFx0XHRvazogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0cmVzdWx0XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0XHRcdFx0c3dCcmlkZ2VDaGFubmVsPy5wb3N0TWVzc2FnZT8uKHtcblx0XHRcdFx0XHRcdFx0dHlwZTogXCJvcGZzLXN3LXJlc3BvbnNlXCIsXG5cdFx0XHRcdFx0XHRcdHJlcXVlc3RJZCxcblx0XHRcdFx0XHRcdFx0b2s6IGZhbHNlLFxuXHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyb3I/Lm1lc3NhZ2UgfHwgU3RyaW5nKGVycm9yKVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdH0gY2F0Y2gge1xuXHRcdFx0c3dCcmlkZ2VDaGFubmVsID0gbnVsbDtcblx0XHR9XG5cdFx0c2VsZi5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBhc3luYyAoZSkgPT4ge1xuXHRcdFx0aWYgKCFlLmRhdGEgfHwgdHlwZW9mIGUuZGF0YSAhPT0gXCJvYmplY3RcIikgcmV0dXJuO1xuXHRcdFx0Y29uc3QgeyBpZCwgdHlwZSwgcGF5bG9hZCB9ID0gZS5kYXRhO1xuXHRcdFx0aWYgKGhhbmRsZXJzW3R5cGVdKSB0cnkge1xuXHRcdFx0XHRjb25zdCByZXN1bHQgPSBhd2FpdCBoYW5kbGVyc1t0eXBlXShwYXlsb2FkKTtcblx0XHRcdFx0c2VsZi5wb3N0TWVzc2FnZSh7XG5cdFx0XHRcdFx0aWQsXG5cdFx0XHRcdFx0cmVzdWx0XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdFx0c2VsZi5wb3N0TWVzc2FnZSh7XG5cdFx0XHRcdFx0aWQsXG5cdFx0XHRcdFx0ZXJyb3I6IGVycm9yPy5tZXNzYWdlIHx8IFN0cmluZyhlcnJvcilcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmIChpZCkgc2VsZi5wb3N0TWVzc2FnZSh7XG5cdFx0XHRcdGlkLFxuXHRcdFx0XHRlcnJvcjogYFVua25vd24gb3BlcmF0aW9uIHR5cGU6ICR7dHlwZX1gXG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fSkpO1xuXG4vLyNlbmRyZWdpb25cbi8vI3JlZ2lvbiBzcmMvdXRpbHMvb3Bmcy9PUEZTLnVuaWZvcm0ud29ya2VyLnRzXG5cdGluaXRfT1BGU193b3JrZXIoKTtcblx0aWYgKGhhbmRsZXJzKSByZWdpc3RlcldvcmtlckFQSShoYW5kbGVycyk7XG5cdGNvbnN0IHByb2Nlc3NNZXNzYWdlID0gYXN5bmMgKGVudmVsb3BlKSA9PiB7XG5cdFx0dHJ5IHtcblx0XHRcdGlmIChlbnZlbG9wZS50eXBlID09PSBcImJhdGNoXCIpIHtcblx0XHRcdFx0Y29uc3QgcmVzdWx0cyA9IFtdO1xuXHRcdFx0XHRmb3IgKGNvbnN0IG1zZyBvZiBlbnZlbG9wZS5wYXlsb2FkKSB7XG5cdFx0XHRcdFx0Y29uc3QgcmVzdWx0ID0gYXdhaXQgcHJvY2Vzc1NpbmdsZU1lc3NhZ2UobXNnKTtcblx0XHRcdFx0XHRyZXN1bHRzLnB1c2gocmVzdWx0KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gcmVzdWx0cztcblx0XHRcdH0gZWxzZSByZXR1cm4gYXdhaXQgcHJvY2Vzc1NpbmdsZU1lc3NhZ2UoZW52ZWxvcGUpO1xuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKFwiW09QRlMgV29ya2VyXSBNZXNzYWdlIHByb2Nlc3NpbmcgZXJyb3I6XCIsIGVycm9yKTtcblx0XHRcdHRocm93IGVycm9yO1xuXHRcdH1cblx0fTtcblx0Y29uc3QgcHJvY2Vzc1NpbmdsZU1lc3NhZ2UgPSBhc3luYyAoZW52ZWxvcGUpID0+IHtcblx0XHRjb25zdCBoYW5kbGVyID0gaGFuZGxlcnNbZW52ZWxvcGUudHlwZV07XG5cdFx0aWYgKCFoYW5kbGVyKSB0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gbWVzc2FnZSB0eXBlOiAke2VudmVsb3BlLnR5cGV9YCk7XG5cdFx0cmV0dXJuIGF3YWl0IGhhbmRsZXIoZW52ZWxvcGUucGF5bG9hZCk7XG5cdH07XG5cdGdsb2JhbFRoaXMucHJvY2Vzc01lc3NhZ2UgPSBwcm9jZXNzTWVzc2FnZTtcblx0Y29uc3QgaW5pdFdvcmtlciA9IGFzeW5jICgpID0+IHtcblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgaGFuZGxlcnMgPSAoYXdhaXQgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiAoaW5pdF9PUEZTX3dvcmtlcigpLCBPUEZTX3dvcmtlcl9leHBvcnRzKSkpLmhhbmRsZXJzO1xuXHRcdFx0aWYgKGhhbmRsZXJzKSByZWdpc3RlcldvcmtlckFQSShoYW5kbGVycyk7XG5cdFx0XHRjb25zb2xlLmxvZyhcIltPUEZTIFdvcmtlcl0gSW5pdGlhbGl6ZWQgd2l0aCBoYW5kbGVyczpcIiwgT2JqZWN0LmtleXMoaGFuZGxlcnMgfHwge30pKTtcblx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0Y29uc29sZS5lcnJvcihcIltPUEZTIFdvcmtlcl0gRmFpbGVkIHRvIGluaXRpYWxpemU6XCIsIGVycm9yKTtcblx0XHR9XG5cdH07XG5cdGluaXRXb3JrZXIoKTtcblxuLy8jZW5kcmVnaW9uXG59KSgpOyJdLAogICJtYXBwaW5ncyI6ICJjQUFDLFVBQVcsQ0FHWCxJQUFJQSxHQUFZLE9BQU8sZUFDbkJDLEdBQVcsQ0FBQ0MsRUFBSUMsRUFBS0MsSUFBUSxJQUFNLENBQ3RDLEdBQUlBLEVBQUssTUFBTUEsRUFBSSxDQUFDLEVBQ3BCLEdBQUksQ0FDSCxPQUFPRixJQUFPQyxFQUFNRCxFQUFHQSxFQUFLLENBQUMsR0FBSUMsQ0FDbEMsT0FBU0UsRUFBRyxDQUNYLE1BQU1ELEVBQU0sQ0FBQ0MsQ0FBQyxFQUFHQSxDQUNsQixDQUNELEVBQ0lDLEdBQWMsQ0FBQ0MsRUFBS0MsSUFBZSxDQUN0QyxJQUFJQyxFQUFTLENBQUMsRUFDZCxRQUFTQyxLQUFRSCxFQUNoQlAsR0FBVVMsRUFBUUMsRUFBTSxDQUN2QixJQUFLSCxFQUFJRyxDQUFJLEVBQ2IsV0FBWSxFQUNiLENBQUMsRUFFRixPQUFLRixHQUNKUixHQUFVUyxFQUFRLE9BQU8sWUFBYSxDQUFFLE1BQU8sUUFBUyxDQUFDLEVBRW5EQSxDQUNSLEVBSUEsSUFBSUUsR0FBaUMsU0FBU0EsRUFBZ0IsQ0FDN0QsT0FBQUEsRUFBZSxJQUFTLE1BQ3hCQSxFQUFlLElBQVMsTUFDeEJBLEVBQWUsS0FBVSxPQUN6QkEsRUFBZSxNQUFXLFFBQzFCQSxFQUFlLFVBQWUs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QSxFQUFTLE9BQVMsUUFBUyxDQUM5QixNQUFNOUgsRUFBVSxDQUFDLEVBQ2pCLFVBQVd6RyxLQUFPdU8sRUFBUyxRQUFTLENBQ25DLE1BQU1oVSxFQUFTLE1BQU1pVSxHQUFxQnhPLENBQUcsRUFDN0N5RyxFQUFRLEtBQUtsTSxDQUFNLENBQ3BCLENBQ0EsT0FBT2tNLENBQ1IsS0FBTyxRQUFPLE1BQU0rSCxHQUFxQkQsQ0FBUSxDQUNsRCxPQUFTckMsRUFBTyxDQUNmLGNBQVEsTUFBTSwwQ0FBMkNBLENBQUssRUFDeERBLENBQ1AsQ0FDRCxFQUNNc0MsR0FBdUIsTUFBT0QsR0FBYSxDQUNoRCxNQUFNN1EsRUFBVWlQLEVBQVM0QixFQUFTLElBQUksRUFDdEMsR0FBSSxDQUFDN1EsRUFBUyxNQUFNLElBQUksTUFBTSx5QkFBeUI2USxFQUFTLElBQUksRUFBRSxFQUN0RSxPQUFPLE1BQU03USxFQUFRNlEsRUFBUyxPQUFPLENBQ3RDLEVBQ0EsV0FBVyxlQUFpQkQsSUFDVCxTQUFZLENBQzlCLEdBQUksQ0FDSCxNQUFNM0IsR0FBWSxNQUFNLFFBQVEsUUFBUSxFQUFFLEtBQUssS0FBT08sR0FBaUIsRUFBR1YsR0FBb0IsR0FBRyxTQUM3RkcsR0FBVVAsR0FBa0JPLENBQVEsRUFDeEMsUUFBUSxJQUFJLDJDQUE0QyxPQUFPLEtBQUtBLEdBQVksQ0FBQyxDQUFDLENBQUMsQ0FDcEYsT0FBU1QsRUFBTyxDQUNmLFFBQVEsTUFBTSxzQ0FBdUNBLENBQUssQ0FDM0QsQ0FDRCxHQUNXLENBR1osR0FBRyIsCiAgIm5hbWVzIjogWyJfX2RlZlByb3AiLCAiX19lc21NaW4iLCAiZm4iLCAicmVzIiwgImVyciIsICJlIiwgIl9fZXhwb3J0QWxsIiwgImFsbCIsICJub19zeW1ib2xzIiwgInRhcmdldCIsICJuYW1lIiwgIldSZWZsZWN0QWN0aW9uIiwgIlRSQU5TUE9SVF9UWVBFX0FMSUFTRVMiLCAibm9ybWFsaXplVHJhbnNwb3J0VHlwZUFsaWFzIiwgInRyYW5zcG9ydCIsICJyYXciLCAiZGV0ZWN0VHJhbnNwb3J0VHlwZSQxIiwgIiRmeHkiLCAiaXNQcmltaXRpdmUiLCAib2JqIiwgInRyeVBhcnNlQnlIaW50IiwgInZhbHVlIiwgImhpbnQiLCAidW53cmFwIiwgImZhbGxiYWNrIiwgImZpeEZ4IiwgImZ4IiwgImdldFJhbmRvbVZhbHVlcyIsICJhcnJheSIsICJ2YWx1ZXMiLCAiaSIsICJVVUlEdjQiLCAiYyIsICJ1bndyYXBBcnJheSIsICJhcnIiLCAiZWwiLCAiaXNOb3RDb21wbGV4QXJyYXkiLCAiaXNDYW5KdXN0UmV0dXJuIiwgImlzVHlwZWRBcnJheSIsICJpc0NhblRyYW5zZmVyIiwgIiRwcm9taXNlIiwgIlNLSVBfS0VZUyIsICJpc1RoZW5hYmxlJDEiLCAic2V0dGxlT25lIiwgInYiLCAicmVhc29uIiwgIm93bkVudW1lcmFibGVLZXlzIiwgImtleSIsICJkZXNjIiwgImhhc1BlbmRpbmdQcm9taXNlcyIsICJzZWVuIiwgInNlZW5TZXQiLCAiaXRlbSIsICJyZXNvbHZlZERlZXAiLCAibW9kZSIsICJzbG90IiwgIml0ZW1zIiwgInJlY29yZCIsICJyZXNvbHZlZCIsICJjYWxsYmFja09yVmFsdWUiLCAiYXJncyIsICJib3VuZEN0eFN5bWJvbCIsICJib3VuZEN0eCIsICJkZWVwT3BlcmF0ZUFuZENsb25lIiwgIm9wZXJhdGlvbiIsICIkcHJldiIsICJpbmRleCIsICJlbnRyaWVzIiwgInJlc29sdmVkU3ltYm9sIiwgImhhbmRsZWRTeW1ib2wiLCAicmVzb2x2ZWRNYXAiLCAiaGFuZGxlZE1hcCIsICIkZXh0cmFjdEtleSQiLCAiaXNUaGVuYWJsZSIsICJhY3RXaXRoIiwgInByb21pc2VPclBsYWluIiwgImNiIiwgIlByb21pc2VIYW5kbGVyIiwgIiNyZXNvbHZlIiwgIiNyZWplY3QiLCAicmVzb2x2ZSIsICJyZWplY3QiLCAicHJvcCIsICJkZXNjcmlwdG9yIiwgInByb3RvIiwgInV3cCIsICJuZXdUYXJnZXQiLCAiY3QiLCAicmVjZWl2ZXIiLCAicmVzdWx0IiwgIiR0bXAiLCAiUHJvbWlzZWQiLCAidGhpc0FyZyIsICJwcm9taXNlIiwgInByb21pc2VzIiwgIkJhc2VTdWJzY3JpcHRpb24iLCAiX3Vuc3Vic2NyaWJlIiwgIk9ic2VydmFibGUiLCAiX3Byb2R1Y2VyIiwgIm9ic2VydmVyT3JOZXh0IiwgIm9wdHMiLCAib2JzZXJ2ZXIiLCAiY3RybCIsICJhY3RpdmUiLCAiY2xlYW51cCIsICJkb0NsZWFudXAiLCAic3Vic2NyaWJlciIsICJvcHMiLCAicyIsICJvcCIsICJDaGFubmVsU3ViamVjdCIsICJvcHRpb25zIiwgIm9icyIsICJmaWx0ZXIiLCAicHJlZCIsICJzcmMiLCAic3ViIiwgImRldGVjdENvbnRleHRUeXBlIiwgInNlcnZpY2VXb3JrZXJTY29wZSIsICJzaGFyZWRXb3JrZXJTY29wZSIsICJkZWRpY2F0ZWRXb3JrZXJTY29wZSIsICJkZXRlY3RUcmFuc3BvcnRUeXBlIiwgInNvdXJjZSIsICJkZXRlY3RlZCIsICJkZXRlY3RJbmNvbWluZ0NvbnRleHRUeXBlIiwgImRhdGEiLCAic2VuZGVyIiwgIkRlZmF1bHRSZWZsZWN0IiwgIlBST1hZX01BUktFUiIsICJQUk9YWV9JTlRFUk5BTFMiLCAiUmVtb3RlUHJveHlIYW5kbGVyIiwgIl9pbnZva2VyIiwgImNvbmZpZyIsICJwcm9wU3RyIiwgIiRyZXF1ZXN0SGFuZGxlciIsICIkZGVzY3JpcHRvciIsICJjaGlsZFBhdGgiLCAiY2hpbGRQcm94eSIsICJjcmVhdGVSZW1vdGVQcm94eSIsICJpbnZva2VyIiwgImhhbmRsZXIiLCAid3JhcERlc2NyaXB0b3IiLCAidGFyZ2V0Q2hhbm5lbCIsICJjYWNoZWQiLCAiZGVzY01hcCIsICJwcm94eSIsICJ3cmFwTWFwIiwgImNyZWF0ZUV4cG9zZUhhbmRsZXIiLCAicmVmbGVjdCIsICJjcmVhdGVPYmplY3RIYW5kbGVyIiwgImNyZWF0ZVNlbmRlclByb3h5IiwgImJhc2VQYXRoIiwgImFjdGlvbiIsICJwYXRoIiwgIm1ha2VSZXF1ZXN0UHJveHkiLCAiY3JlYXRlQ29ubmVjdGlvbktleSIsICJwYXJhbXMiLCAicXVlcnlDb25uZWN0aW9ucyIsICJjb25uZWN0aW9ucyIsICJxdWVyeSIsICJpbmNsdWRlQ2xvc2VkIiwgImRlc2lyZWRTdGF0dXMiLCAiY29ubmVjdGlvbiIsICJhIiwgImIiLCAiQ29ubmVjdGlvblJlZ2lzdHJ5IiwgIl9jcmVhdGVJZCIsICJfZW1pdEV2ZW50IiwgIm5vdyIsICJleGlzdGluZyIsICJwYXlsb2FkIiwgImNoYW5uZWwiLCAiVW5pZmllZENoYW5uZWwiLCAiZXZlbnQiLCAiY2ZnIiwgInRyYW5zcG9ydFR5cGUiLCAiYmluZGluZyIsICJzb3VyY2VDaGFubmVsIiwgIm1zZyIsICJzZW5kUmVzcG9uc2UiLCAid3JpdGVCeVBhdGgiLCAidXJsIiwgImlkIiwgInJlc29sdmVycyIsICJ0aW1lb3V0IiwgIm1lc3NhZ2UiLCAibW9kdWxlTmFtZSIsICJldmVudFR5cGUiLCAidHlwZSIsICJzZW50IiwgInRhcmdldHMiLCAicmVxSWQiLCAidG9UcmFuc2ZlciIsICJuZXdQYXRoIiwgImV4ZWN1dGVBY3Rpb24iLCAicmF3UmVzdWx0IiwgImNvcmVSZXNwb25zZSIsICJ0cmFuc2ZlciIsICJidWlsZFJlc3BvbnNlIiwgInJlc3BvbnNlIiwgInJlbW90ZUNoYW5uZWwiLCAic2lnbmFsVHlwZSIsICJ0YWJJZCIsICJsaXN0ZW5lciIsICJzZW5kZXJNZXRhIiwgInBvcnROYW1lIiwgInBvcnQiLCAiY3JlYXRlVW5pZmllZENoYW5uZWwiLCAiV09SS0VSX0NIQU5ORUwiLCAiZ2V0V29ya2VyQ2hhbm5lbCIsICJjb250ZXh0VHlwZSIsICJUUyIsICJUcmFuc2ZlcmFibGUiLCAiRSIsICJnZXRXb3JrZXJSZXNvbHZlQmFzZVVybCIsICJocmVmIiwgInJlc29sdmVXb3JrZXJTcGVjaWZpZXJIcmVmIiwgInNwZWMiLCAiYmFzZSIsICJub3JtYWxpemVkIiwgIlNFTEZfQ0hBTk5FTCIsICJDSEFOTkVMX01BUCIsICJpc1JlZmxlY3RBY3Rpb24kMSIsICJSZW1vdGVDaGFubmVsSGVscGVyJDEiLCAiY2hhbm5lbE5hbWUiLCAiQ2hhbm5lbEhhbmRsZXIkMSIsICJicm9hZGNhc3QiLCAidG9DaGFubmVsIiwgInJlcXVlc3QiLCAicmVzcG9uc2VGbiIsICJoYW5kbGVSZXF1ZXN0IiwgImluaXRDaGFubmVsSGFuZGxlciIsICIkY2hhbm5lbCIsICJoYW5kTWFwIiwgIm9iamVjdFRvUmVmIiwgInJlZ2lzdGVyZWRJblBhdGgiLCAibm9ybWFsaXplUmVmIiwgInN0b3JlZERhdGEiLCAidHJhdmVyc2VCeVBhdGgiLCAiJGRlc2MiLCAicmVhZEJ5UGF0aCIsICJyb290IiwgInJlbW92ZUJ5UGF0aCIsICJyZW1vdmVCeURhdGEiLCAiaGFzTm9QYXRoIiwgImlzT2JqZWN0IiwgImRlZmF1bHRSZWZsZWN0IiwgInQiLCAicCIsICJjdHgiLCAiZ290IiwgIm5vcm1hbGl6ZWRWYWx1ZSIsICJub3JtYWxpemVkQXJncyIsICJjYW5CZVJldHVybiIsICJmaW5hbFBhdGgiLCAiY3R4S2V5IiwgInBhcmVudCIsICJjdXJyZW50IiwgImNhbGxBcmdzIiwgImN0b3JBcmdzIiwgIkNoYW5uZWxDb25uZWN0aW9uIiwgIl9uYW1lIiwgIl90cmFuc3BvcnRUeXBlIiwgImZyb21DaGFubmVsIiwgIm0iLCAib3JpZ2luYWwiLCAiciIsICJzdGF0ZSIsICJDb25uZWN0aW9uUG9vbCIsICJnZXRDb25uZWN0aW9uUG9vbCIsICJnZXRDb25uZWN0aW9uIiwgIkRCX05BTUUiLCAiREJfVkVSU0lPTiIsICJTVE9SRVMiLCAiQ2hhbm5lbFN0b3JhZ2UiLCAiZGIiLCAibWVzc2FnZXNTdG9yZSIsICJtYWlsYm94U3RvcmUiLCAicGVuZGluZ1N0b3JlIiwgImV4Y2hhbmdlU3RvcmUiLCAic3RvcmVkTWVzc2FnZSIsICJ0eCIsICJzdG9yZSIsICJyZXN1bHRzIiwgImN1cnNvciIsICJtZXNzYWdlSWQiLCAic3RhdHVzIiwgIm1lc3NhZ2VzIiwgInN0YXRzIiwgImRlbGV0ZWRDb3VudCIsICJwZW5kaW5nIiwgIm9wZXJhdGlvbklkIiwgInBvbGxJbnRlcnZhbCIsICJzdGFydFRpbWUiLCAiZ2V0UmVxdWVzdCIsICJDaGFubmVsVHJhbnNhY3Rpb24iLCAib3BlcmF0aW9ucyIsICJzdG9yZU5hbWVzIiwgImdldFJlcSIsICJtc2dSZXF1ZXN0IiwgIm1haWxSZXF1ZXN0IiwgIl9zdG9yYWdlIiwgInVwZGF0ZXMiLCAiX3N0b3JhZ2VJbnN0YW5jZXMiLCAiZ2V0Q2hhbm5lbFN0b3JhZ2UiLCAid29ya2VyQmFzZSIsICJ3b3JrZXJDb2RlIiwgIlJlbW90ZUNoYW5uZWxIZWxwZXIiLCAiX2NoYW5uZWwiLCAiX2NvbnRleHQiLCAiX29wdGlvbnMiLCAibm9ybWFsaXplZFBhdGgiLCAibm9ybWFsaXplZEFjdGlvbiIsICJpc1JlZmxlY3RBY3Rpb24iLCAiQ2hhbm5lbEhhbmRsZXIiLCAibm9ybWFsaXplVHJhbnNwb3J0QmluZGluZyIsICJnZXREeW5hbWljVHJhbnNwb3J0VHlwZSIsICJDaGFubmVsQ29udGV4dCIsICJob3N0TmFtZSIsICJlbmRwb2ludCIsICJjb25uZWN0ZWRUYXJnZXRzIiwgIm5hbWVzIiwgImluaXRGbiIsICJ3b3JrZXIiLCAid29ya2VySW5zdGFuY2UiLCAibG9hZFdvcmtlciIsICJyZWFkeSIsICJicm9hZGNhc3ROYW1lIiwgImJjIiwgInNlbGZUYXJnZXQiLCAiYmNOYW1lIiwgIm5hbWUxIiwgIm5hbWUyIiwgIm1jIiwgImhhbmRsZXIxIiwgImhhbmRsZXIyIiwgInJlYWR5MSIsICJyZWFkeTIiLCAiY2hhbm5lbDEiLCAiY2hhbm5lbDIiLCAibXNnQ2hhbm5lbCIsICJpbmZvIiwgImRpcmVjdGlvbiIsICJtYXBwZWRUcmFuc3BvcnRUeXBlIiwgInVuaWZpZWQiLCAic3Vic2NyaXB0aW9uIiwgImlzVHJhbnNwb3J0QmluZGluZyIsICJuYXRpdmVUYXJnZXQiLCAiZWZmZWN0aXZlVGFyZ2V0IiwgIldYIiwgIkNPTlRFWFRfUkVHSVNUUlkiLCAiY3JlYXRlQ2hhbm5lbENvbnRleHQiLCAiV29ya2VyQ29udGV4dCIsICJjbG9zZWQiLCAiV09SS0VSX0NPTlRFWFQiLCAiZ2V0V29ya2VyQ29udGV4dCIsICJQb3J0VHJhbnNwb3J0IiwgIl9jaGFubmVsTmFtZSIsICJfY29uZmlnIiwgIm1zZ0hhbmRsZXIiLCAiZXJySGFuZGxlciIsICJ0cmFuc2ZlcmFibGUiLCAiY3JlYXRlQ2hhbm5lbFBhaXIiLCAiUG9ydFBvb2wiLCAiX2RlZmF1bHRDb25maWciLCAiV2luZG93UG9ydENvbm5lY3RvciIsICJfdGFyZ2V0IiwgImxvY2FsIiwgInJlbW90ZSIsICJjcmVhdGVQb3J0UHJveHkiLCAidGFyZ2V0UGF0aCIsICJleHBvc2VPdmVyUG9ydCIsICJlcnJvciIsICJQb3J0VHJhbnNwb3J0RmFjdG9yeSIsICJyZWdpc3RlcldvcmtlckFQSSIsICJhcGkiLCAiY2hhbm5lbEhhbmRsZXIiLCAibWV0aG9kTmFtZSIsICJPUEZTX3dvcmtlcl9leHBvcnRzIiwgImdldERpckhhbmRsZSIsICJnZXRGaWxlU3lzdGVtUm9vdCIsICJoYW5kbGVycyIsICJub3JtYWxpemVQYXRoIiwgInJlc29sdmVGaWxlU3lzdGVtSGFuZGxlIiwgIm1hcHBlZFJvb3RzIiwgImFjdGl2ZU9ic2VydmVycyIsICJTV19CUklER0VfQ0hBTk5FTF9OQU1FIiwgInN3QnJpZGdlQ2hhbm5lbCIsICJpbml0X09QRlNfd29ya2VyIiwgImNyZWF0ZSIsICJwYXJ0cyIsICJwYXJ0IiwgImhhbmRsZSIsICJyb290SWQiLCAiZW50cnkiLCAiZmlsZW5hbWUiLCAiZGlyUGF0aCIsICJmaWxlIiwgIndyaXRhYmxlIiwgInJlY3Vyc2l2ZSIsICJyZWNvcmRzIiwgImNoYW5nZXMiLCAiZnJvbSIsICJ0byIsICJjb3B5UmVjdXJzaXZlIiwgImRlc3QiLCAibmV3RGVzdCIsICJyZXF1ZXN0SWQiLCAicHJvY2Vzc01lc3NhZ2UiLCAiZW52ZWxvcGUiLCAicHJvY2Vzc1NpbmdsZU1lc3NhZ2UiXQp9Cg==
