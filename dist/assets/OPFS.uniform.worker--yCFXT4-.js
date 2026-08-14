"use strict";
(function() {
	var Z = Object.defineProperty, De = (e, t, n) => () => {
		if (n) throw n[0];
		try {
			return e && (t = e(e = 0)), t;
		} catch (s) {
			throw n = [s], s;
		}
	}, Ne = (e, t) => {
		let n = {};
		for (var s in e) Z(n, s, {
			get: e[s],
			enumerable: !0
		});
		return t || Z(n, Symbol.toStringTag, { value: "Module" }), n;
	};
	function Le() {
		const e = globalThis;
		if (typeof e.HTMLElement == "function") return;
		const t = class {}, n = (s) => {
			typeof e[s] != "function" && (e[s] = t);
		};
		n("EventTarget"), n("Node"), n("Element"), n("HTMLElement"), n("SVGElement"), n("Text"), n("Comment"), n("DocumentFragment"), n("ShadowRoot"), n("HTMLDocument"), n("Document"), n("HTMLBodyElement"), n("HTMLHeadElement"), n("HTMLCanvasElement"), n("HTMLInputElement"), n("HTMLLinkElement"), n("HTMLStyleElement"), n("HTMLPreElement"), n("HTMLDivElement"), n("CSSStyleRule"), n("CSSLayerBlockRule");
	}
	var je = class {
		channels = /* @__PURE__ */ new Map();
		listeners = /* @__PURE__ */ new Map();
		register(e, t) {
			this.channels.set(e, t);
			const n = this.listeners.get(e);
			if (n) for (const s of n) try {
				s(t);
			} catch (r) {
				console.error(`[ChannelRegistry] Listener error for ${e}:`, r);
			}
			return t;
		}
		get(e) {
			return this.channels.get(e);
		}
		has(e) {
			return this.channels.has(e);
		}
		unregister(e) {
			const t = this.channels.delete(e);
			if (t) {
				const n = this.listeners.get(e);
				if (n) for (const s of n) try {
					s(null);
				} catch (r) {
					console.error(`[ChannelRegistry] Unregister listener error for ${e}:`, r);
				}
			}
			return t;
		}
		onChannelChange(e, t) {
			this.listeners.has(e) || this.listeners.set(e, /* @__PURE__ */ new Set());
			const n = this.listeners.get(e);
			if (n.add(t), this.channels.has(e)) try {
				t(this.channels.get(e));
			} catch (s) {
				console.error(`[ChannelRegistry] Initial listener error for ${e}:`, s);
			}
			return () => {
				n.delete(t), n.size === 0 && this.listeners.delete(e);
			};
		}
		getChannelNames() {
			return Array.from(this.channels.keys());
		}
		clear() {
			this.channels.clear(), this.listeners.clear();
		}
	};
	new je();
	var qe = class {
		healthChecks = /* @__PURE__ */ new Map();
		intervals = /* @__PURE__ */ new Map();
		healthStatus = /* @__PURE__ */ new Map();
		registerHealthCheck(e, t, n = 3e4) {
			this.healthChecks.set(e, t);
			const s = this.intervals.get(e);
			s && clearInterval(s);
			const r = setInterval(async () => {
				try {
					const o = await t();
					this.healthStatus.set(e, o), o || console.warn(`[ChannelHealth] Channel '${e}' is unhealthy`);
				} catch (o) {
					console.error(`[ChannelHealth] Health check failed for '${e}':`, o), this.healthStatus.set(e, !1);
				}
			}, n);
			this.intervals.set(e, r), t().then((o) => {
				this.healthStatus.set(e, o);
			}).catch(() => {
				this.healthStatus.set(e, !1);
			});
		}
		isHealthy(e) {
			return this.healthStatus.get(e) ?? !1;
		}
		getAllHealthStatuses() {
			const e = {};
			for (const [t, n] of this.healthStatus) e[t] = n;
			return e;
		}
		stopMonitoring(e) {
			const t = this.intervals.get(e);
			t && (clearInterval(t), this.intervals.delete(e)), this.healthChecks.delete(e), this.healthStatus.delete(e);
		}
		stopAllMonitoring() {
			for (const e of this.intervals.values()) clearInterval(e);
			this.intervals.clear(), this.healthChecks.clear(), this.healthStatus.clear();
		}
	};
	new qe();
	WeakMap.prototype.getOrInsert ??= function(e, t) {
		return this.has(e) || this.set(e, t), this.get(e);
	}, WeakMap.prototype.getOrInsertComputed ??= function(e, t) {
		return this.has(e) || this.set(e, t(e)), this.get(e);
	}, Map.prototype.getOrInsert ??= function(e, t) {
		return this.has(e) || this.set(e, t), this.get(e);
	}, Map.prototype.getOrInsertComputed ??= function(e, t) {
		return this.has(e) || this.set(e, t(e)), this.get(e);
	};
	var ee = Symbol.for("@fix"), C = (e) => typeof e == "string" || typeof e == "number" || typeof e == "boolean" || typeof e == "bigint" || typeof e > "u" || e == null, Be = (e, t) => C(e) ? t == "number" ? Number(e) || 0 : t == "string" ? String(e) || "" : t == "boolean" ? !!e : e : null, f = (e, t) => e?.[ee] ?? e ?? t ?? t, We = (e) => {
		if (typeof e == "function" || e == null) return e;
		const t = function() {};
		return t[ee] = e, t;
	}, He = (e) => crypto?.getRandomValues ? crypto?.getRandomValues?.(e) : (() => {
		const t = new Uint8Array(e.length);
		for (let n = 0; n < e.length; n++) t[n] = Math.floor(Math.random() * 256);
		return t;
	})(), d = () => crypto?.randomUUID ? crypto?.randomUUID?.() : "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (e) => (+e ^ He?.(/* @__PURE__ */ new Uint8Array(1))?.[0] & 15 >> +e / 4).toString(16)), te = (e) => Array.isArray(e) ? e?.flatMap?.((t) => Array.isArray(t) ? te(t) : t) : e, $ = (e) => te(e)?.every?.(S), S = (e) => C(e) || typeof SharedArrayBuffer == "function" && e instanceof SharedArrayBuffer || Fe(e) || Array.isArray(e) && $(e), Fe = (e) => ArrayBuffer.isView(e) && !(e instanceof DataView), U = (e) => C(e) || typeof ArrayBuffer == "function" && e instanceof ArrayBuffer || typeof MessagePort == "function" && e instanceof MessagePort || typeof ReadableStream == "function" && e instanceof ReadableStream || typeof WritableStream == "function" && e instanceof WritableStream || typeof TransformStream == "function" && e instanceof TransformStream || typeof ImageBitmap == "function" && e instanceof ImageBitmap || typeof VideoFrame == "function" && e instanceof VideoFrame || typeof OffscreenCanvas == "function" && e instanceof OffscreenCanvas || typeof RTCDataChannel == "function" && e instanceof RTCDataChannel || typeof AudioData == "function" && e instanceof AudioData || typeof WebTransportReceiveStream == "function" && e instanceof WebTransportReceiveStream || typeof WebTransportSendStream == "function" && e instanceof WebTransportSendStream || typeof WebTransportReceiveStream == "function" && e instanceof WebTransportReceiveStream, ne = Symbol.for("object.boundCtx");
	globalThis[ne] ??= /* @__PURE__ */ new WeakMap();
	globalThis[ne];
	var k = (e, t, n) => {
		if (Array.isArray(e)) return e.every(S) ? e.map(t) : e.map((s, r) => k(s, t, [e, r]));
		if (e instanceof Map) {
			const s = Array.from(e.entries());
			return s.map(([r, o]) => o).every(S) ? new Map(s.map(([r, o]) => [r, t(o, r, e)])) : new Map(s.map(([r, o]) => [r, k(o, t, [e, r])]));
		}
		if (e instanceof Set) {
			const s = Array.from(e.entries()), r = s.map(([o, a]) => a);
			return s.every(S) ? new Set(r.map(t)) : new Set(r.map((o) => k(o, t, [e, o])));
		}
		if (typeof e == "object" && e?.constructor == Object && Object.prototype.toString.call(e) == "[object Object]") {
			const s = Array.from(Object.entries(e));
			return s.map(([r, o]) => o).every(S) ? Object.fromEntries(s.map(([r, o]) => [r, t(o, r, e)])) : Object.fromEntries(s.map(([r, o]) => [r, k(o, t, [e, r])]));
		}
		return t(e, n?.[1] ?? "", n?.[0] ?? null);
	}, v = /* @__PURE__ */ new WeakMap(), se = /* @__PURE__ */ new WeakMap(), m = (e, t) => e instanceof Promise || typeof e?.then == "function" ? v?.has?.(e) ? t(v?.get?.(e)) : Promise.try?.(async () => {
		const n = await e;
		return v?.set?.(e, n), n;
	})?.then?.(t) : t(e), Ge = class {
		#e;
		#t;
		constructor(e, t) {
			this.#e = e, this.#t = t;
		}
		defineProperty(e, t, n) {
			return f(e) instanceof Promise ? Reflect.defineProperty(e, t, n) : m(f(e), (s) => Reflect.defineProperty(s, t, n));
		}
		deleteProperty(e, t) {
			return f(e) instanceof Promise ? Reflect.deleteProperty(e, t) : m(f(e), (n) => Reflect.deleteProperty(n, t));
		}
		getPrototypeOf(e) {
			return f(e) instanceof Promise ? Reflect.getPrototypeOf(e) : m(f(e), (t) => Reflect.getPrototypeOf(t));
		}
		setPrototypeOf(e, t) {
			return f(e) instanceof Promise ? Reflect.setPrototypeOf(e, t) : m(f(e), (n) => Reflect.setPrototypeOf(n, t));
		}
		isExtensible(e) {
			return f(e) instanceof Promise ? Reflect.isExtensible(e) : m(f(e), (t) => Reflect.isExtensible(t));
		}
		preventExtensions(e) {
			return f(e) instanceof Promise ? Reflect.ownKeys(e) : m(f(e), (t) => Reflect.preventExtensions(t));
		}
		ownKeys(e) {
			const t = f(e);
			return t instanceof Promise ? Object.keys(t) : m(t, (n) => (typeof n == "object" || typeof n == "function") && n != null ? Object.keys(n) : []) ?? [];
		}
		getOwnPropertyDescriptor(e, t) {
			return f(e) instanceof Promise ? Reflect.getOwnPropertyDescriptor(e, t) : m(f(e), (n) => Reflect.getOwnPropertyDescriptor(n, t));
		}
		construct(e, t, n) {
			return m(f(e), (s) => Reflect.construct(s, t, n));
		}
		has(e, t) {
			return f(e) instanceof Promise ? Reflect.has(e, t) : m(f(e), (n) => Reflect.has(n, t));
		}
		get(e, t, n) {
			if (e = f(e), t == "promise") return e;
			if (t == "resolve" && this.#e) return (...r) => {
				const o = this.#e?.(...r);
				return this.#e = null, o;
			};
			if (t == "reject" && this.#t) return (...r) => {
				const o = this.#t?.(...r);
				return this.#t = null, o;
			};
			if (t == "then" || t == "catch" || t == "finally") {
				if (e instanceof Promise) return e?.[t]?.bind?.(e);
				{
					const r = Promise.try(() => e);
					return r?.[t]?.bind?.(r);
				}
			}
			let s;
			return v?.has?.(e) && (s = v?.get?.(e))?.[t] != null ? s = v?.get?.(e)?.[t] : s = re(m(e, async (r) => {
				if (f(r) instanceof Promise) return Reflect.get(r, t, n);
				if (C(r)) return t == Symbol.toPrimitive || t == Symbol.toStringTag ? r : void 0;
				let o;
				try {
					o = Reflect.get(r, t, n);
				} catch {
					o = e?.[t];
				}
				return typeof o == "function" ? o?.bind?.(r) : o;
			})), t == Symbol.toStringTag ? C(s) ? String(s ?? "") || "" : s?.[Symbol.toStringTag]?.() || String(s ?? "") || "" : t == Symbol.toPrimitive ? (r) => {
				if (C(s)) return Be(s, r);
			} : s;
		}
		set(e, t, n) {
			return m(f(e), (s) => Reflect.set(s, t, n));
		}
		apply(e, t, n) {
			if (this.#e) {
				const s = this.#e?.(...n);
				return this.#e = null, s;
			}
			return m(f(e, this.#e), (s) => {
				if (typeof s == "function") return f(s) instanceof Promise, Reflect.apply(s, t, n);
			});
		}
	};
	function re(e, t, n) {
		return e instanceof Promise || typeof e?.then == "function" ? v?.has?.(e) ? v?.get?.(e) : (se?.has?.(e) || e?.then?.((s) => v?.set?.(e, s)), se?.getOrInsertComputed?.(e, () => new Proxy(We(e), new Ge(t, n)))) : e;
	}
	Le();
	var u = (function(e) {
		return e.GET = "get", e.SET = "set", e.CALL = "call", e.APPLY = "apply", e.CONSTRUCT = "construct", e.DELETE = "delete", e.DELETE_PROPERTY = "deleteProperty", e.HAS = "has", e.OWN_KEYS = "ownKeys", e.GET_OWN_PROPERTY_DESCRIPTOR = "getOwnPropertyDescriptor", e.GET_PROPERTY_DESCRIPTOR = "getPropertyDescriptor", e.GET_PROTOTYPE_OF = "getPrototypeOf", e.SET_PROTOTYPE_OF = "setPrototypeOf", e.IS_EXTENSIBLE = "isExtensible", e.PREVENT_EXTENSIONS = "preventExtensions", e.TRANSFER = "transfer", e.IMPORT = "import", e.DISPOSE = "dispose", e;
	})({}), $e = {
		ws: "websocket",
		socket: "websocket",
		socketio: "socket-io",
		service: "service-worker",
		sw: "service-worker",
		"service-worker-client": "service-worker",
		"service-worker-host": "service-worker",
		"ring-buffer": "atomics"
	};
	function Ue(e) {
		const t = String(e ?? "").trim().toLowerCase();
		return t ? $e[t] ?? t : "internal";
	}
	function Xe(e) {
		return typeof e == "string" ? Ue(e) : typeof Worker < "u" && e instanceof Worker ? "worker" : typeof SharedWorker < "u" && e instanceof SharedWorker ? "shared-worker" : typeof MessagePort < "u" && e instanceof MessagePort ? "message-port" : typeof BroadcastChannel < "u" && e instanceof BroadcastChannel ? "broadcast" : typeof WebSocket < "u" && e instanceof WebSocket ? "websocket" : typeof RTCDataChannel < "u" && e instanceof RTCDataChannel ? "rtc-data" : typeof chrome < "u" && e && typeof e == "object" && typeof e.postMessage == "function" && e.onMessage?.addListener ? "chrome-port" : "internal";
	}
	var oe = class {
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
	}, ze = class {
		_producer;
		constructor(e) {
			this._producer = e;
		}
		subscribe(e, t) {
			const n = typeof e == "function" ? { next: e } : e ?? {}, s = new AbortController();
			t?.signal?.addEventListener("abort", () => s.abort());
			let r = !0, o;
			const a = () => {
				r = !1, s.abort(), o?.();
			}, i = {
				next: (c) => r && n.next?.(c),
				error: (c) => {
					r && (n.error?.(c), a());
				},
				complete: () => {
					r && (n.complete?.(), a());
				},
				signal: s.signal,
				get active() {
					return r && !s.signal.aborted;
				}
			};
			try {
				o = this._producer(i);
			} catch (c) {
				i.error(c);
			}
			return new oe(a);
		}
		pipe(...e) {
			return e.reduce((t, n) => n(t), this);
		}
	}, g = class {
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
			} catch (s) {
				t.error?.(s);
			}
			return new oe(() => {
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
	}, Ye = (e) => (t) => new ze((n) => {
		const s = t.subscribe({
			next: (r) => e(r) && n.next(r),
			error: (r) => n.error(r),
			complete: () => n.complete()
		});
		return () => s.unsubscribe();
	});
	function ae() {
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
	function ie(e) {
		if (typeof RTCDataChannel < "u" && e instanceof RTCDataChannel) return "rtc-data";
		const t = Xe(e);
		return t && t !== "internal" ? t : e === self || e === globalThis || e === "self" ? "self" : "internal";
	}
	function Ke(e) {
		if (!e) return "unknown";
		if (e.contextType) return e.contextType;
		const t = e.sender ?? "";
		return t.includes("worker") ? "worker" : t.includes("sw") || t.includes("service") ? "service-worker" : t.includes("chrome") || t.includes("crx") ? "chrome-content" : t.includes("background") ? "chrome-background" : "unknown";
	}
	var Ve = {
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
	}, Je = Symbol.for("uniform.proxy"), Qe = Symbol.for("uniform.proxy.internals"), Ze = class {
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
			const s = String(t);
			if (t === Je) return !0;
			if (t === Qe) return this._config;
			if (t === ht) return !0;
			if (t === D) return this._getDescriptor();
			if (t === "then" || t === "catch" || t === "finally" || typeof t == "symbol") return;
			if (t === "$path") return this._config.basePath;
			if (t === "$channel") return this._config.channel;
			if (t === "$descriptor") return this._getDescriptor();
			if (t === "$invoke") return this._invoker;
			const r = [...this._config.basePath, s];
			if (this._config.cache && this._childCache.has(s)) return this._childCache.get(s);
			const o = W(this._invoker, {
				...this._config,
				basePath: r
			});
			return this._config.cache && this._childCache.set(s, o), o;
		}
		set(e, t, n, s) {
			return typeof t == "symbol" || this._invoker(u.SET, [...this._config.basePath, String(t)], [n]), !0;
		}
		apply(e, t, n) {
			return this._invoker(u.APPLY, this._config.basePath, [n]);
		}
		construct(e, t, n) {
			return this._invoker(u.CONSTRUCT, this._config.basePath, [t]);
		}
		has(e, t) {
			return typeof t == "symbol" ? !1 : this._invoker(u.HAS, this._config.basePath, [t]);
		}
		deleteProperty(e, t) {
			return typeof t == "symbol" ? !0 : this._invoker(u.DELETE_PROPERTY, [...this._config.basePath, String(t)], []);
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
			return this._invoker(u.SET_PROTOTYPE_OF, this._config.basePath, [t]);
		}
		isExtensible(e) {
			return !0;
		}
		preventExtensions(e) {
			return this._invoker(u.PREVENT_EXTENSIONS, this._config.basePath, []);
		}
		_getDescriptor() {
			return {
				path: this._config.basePath,
				channel: this._config.channel,
				primitive: !1
			};
		}
	};
	function W(e, t) {
		const n = function() {}, s = new Ze(e, t);
		return new Proxy(n, s);
	}
	function ce(e, t, n) {
		if (!e || typeof e != "object" || e.primitive) return e;
		const s = _e.get(e);
		if (s) return s;
		const r = W(t, {
			channel: n ?? e.channel ?? "unknown",
			basePath: e.path ?? []
		});
		return _e.set(e, r), Y.set(r, e), r;
	}
	var nt = ce;
	function st(e) {
		return [
			e.localChannel,
			e.remoteChannel,
			e.sender,
			e.transportType,
			e.direction
		].join("::");
	}
	function rt(e, t = {}) {
		const n = t.includeClosed ?? !1, s = t.status ?? (n ? void 0 : "active");
		return [...e].filter((r) => !(s && r.status !== s || t.channel && r.localChannel !== t.channel && r.remoteChannel !== t.channel || t.localChannel && r.localChannel !== t.localChannel || t.remoteChannel && r.remoteChannel !== t.remoteChannel || t.sender && r.sender !== t.sender || t.transportType && r.transportType !== t.transportType || t.direction && r.direction !== t.direction)).sort((r, o) => o.updatedAt - r.updatedAt);
	}
	var le = class {
		_createId;
		_emitEvent;
		_connections = /* @__PURE__ */ new Map();
		constructor(e, t) {
			this._createId = e, this._emitEvent = t;
		}
		register(e) {
			const t = st(e), n = Date.now(), s = this._connections.get(t);
			if (s) return s.updatedAt = n, s.status = "active", s.metadata = {
				...s.metadata,
				...e.metadata
			}, s;
			const r = {
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
			return this._connections.set(t, r), this._emitEvent?.({
				type: "connected",
				connection: r,
				timestamp: n
			}), r;
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
			return rt(this._connections.values(), e);
		}
		values() {
			return [...this._connections.values()];
		}
		clear() {
			this._connections.clear();
		}
	}, he = class {
		_name;
		_contextType;
		_config;
		_transports = /* @__PURE__ */ new Map();
		_defaultTransport = null;
		_connectionEvents = new g({ bufferSize: 200 });
		_connectionRegistry = new le(() => d(), (e) => this._connectionEvents.next(e));
		_pending = /* @__PURE__ */ new Map();
		_subscriptions = [];
		_inbound = new g({ bufferSize: 100 });
		_outbound = new g({ bufferSize: 100 });
		_invocations = new g({ bufferSize: 100 });
		_responses = new g({ bufferSize: 100 });
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
			this._name = t.name, this._contextType = t.autoDetect !== !1 ? ae() : "unknown", this._config = {
				name: t.name,
				autoDetect: t.autoDetect ?? !0,
				timeout: t.timeout ?? 3e4,
				reflect: t.reflect ?? Ve,
				bufferSize: t.bufferSize ?? 100,
				autoListen: t.autoListen ?? !0
			}, this._config.autoListen && this._isWorkerContext() && this.listen(self);
		}
		connect(e, t = {}) {
			const n = ie(e), s = t.targetChannel ?? this._inferTargetChannel(e, n), r = this._createTransportBinding(e, n, s, t);
			this._transports.set(s, r), this._defaultTransport || (this._defaultTransport = r);
			const o = this._registerConnection({
				localChannel: this._name,
				remoteChannel: s,
				sender: this._name,
				transportType: n,
				direction: "outgoing",
				metadata: { phase: "connect" }
			});
			return this._emitConnectionSignal(r, "connect", {
				connectionId: o.id,
				from: this._name,
				to: s
			}), this;
		}
		listen(e, t = {}) {
			const n = ie(e), s = t.targetChannel ?? this._inferTargetChannel(e, n), r = (a) => this._handleIncoming(a), o = this._registerConnection({
				localChannel: this._name,
				remoteChannel: s,
				sender: s,
				transportType: n,
				direction: "incoming",
				metadata: { phase: "listen" }
			});
			switch (n) {
				case "worker":
				case "message-port":
				case "broadcast":
					t.autoStart !== !1 && e.start && e.start(), e.addEventListener?.("message", ((a) => r(a.data)));
					break;
				case "websocket":
					e.addEventListener?.("message", ((a) => {
						try {
							r(JSON.parse(a.data));
						} catch {}
					}));
					break;
				case "chrome-runtime":
					chrome.runtime.onMessage?.addListener?.((a, i, c) => (r(a), !0));
					break;
				case "chrome-tabs":
					chrome.runtime.onMessage?.addListener?.((a, i) => t.tabId != null && i?.tab?.id !== t.tabId ? !1 : (r(a), !0));
					break;
				case "chrome-port":
					e?.onMessage?.addListener?.((a) => {
						r(a);
					});
					break;
				case "chrome-external":
					chrome.runtime.onMessageExternal?.addListener?.((a) => (r(a), !0));
					break;
				case "self":
					addEventListener?.("message", ((a) => r(a.data)));
					break;
				default: t.onMessage && t.onMessage(r);
			}
			return this._sendSignalToTarget(e, n, {
				connectionId: o.id,
				from: this._name,
				to: s,
				tabId: t.tabId,
				externalId: t.externalId
			}, "notify"), this;
		}
		attach(e, t = {}) {
			return this.connect(e, t);
		}
		expose(e, t) {
			const n = [e];
			return F(n, t), this._exposed.set(e, {
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
			return this.invoke(t ?? this._getDefaultTarget(), u.IMPORT, [], [e]);
		}
		invoke(e, t, n, s = []) {
			const r = d(), o = Promise.withResolvers();
			this._pending.set(r, o);
			const a = setTimeout(() => {
				this._pending.has(r) && (this._pending.delete(r), o.reject(/* @__PURE__ */ new Error(`Request timeout: ${t} on ${n.join(".")}`)));
			}, this._config.timeout), i = {
				id: r,
				channel: e,
				sender: this._name,
				type: "request",
				payload: {
					channel: e,
					sender: this._name,
					action: t,
					path: n,
					args: s
				},
				timestamp: Date.now()
			};
			return this._send(e, i), this._outbound.next(i), o.promise.finally(() => clearTimeout(a));
		}
		get(e, t, n) {
			return this.invoke(e, u.GET, t, [n]);
		}
		set(e, t, n, s) {
			return this.invoke(e, u.SET, t, [n, s]);
		}
		call(e, t, n = []) {
			return this.invoke(e, u.APPLY, t, [n]);
		}
		construct(e, t, n = []) {
			return this.invoke(e, u.CONSTRUCT, t, [n]);
		}
		proxy(e, t = []) {
			const n = e ?? this._getDefaultTarget();
			return this._createProxy(n, t);
		}
		remote(e, t) {
			return this.proxy(t, [e]);
		}
		wrapDescriptor(e, t) {
			return ce(e, (n, s, r) => {
				const o = t ?? e?.channel ?? this._getDefaultTarget();
				return this.invoke(o, n, s, r);
			}, t ?? e?.channel ?? this._getDefaultTarget());
		}
		subscribe(e) {
			return this._inbound.subscribe(e);
		}
		next(e) {
			this._send(e.channel, e), this._outbound.next(e);
		}
		emit(e, t, n) {
			const s = {
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
			this.next(s);
		}
		notify(e, t = {}, n = "notify") {
			const s = this._transports.get(e);
			return s ? (this._emitConnectionSignal(s, n, {
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
			const s = this.queryConnections({
				...t,
				status: "active",
				includeClosed: !1
			});
			for (const r of s) {
				const o = this._transports.get(r.remoteChannel);
				o && (this._emitConnectionSignal(o, "notify", {
					connectionId: r.id,
					from: this._name,
					to: r.remoteChannel,
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
					const s = e.payload?.result, r = e.payload?.descriptor;
					s != null ? n.resolve(s) : r ? n.resolve(this.wrapDescriptor(r, e.sender)) : n.resolve(void 0);
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
			const { action: n, path: s, args: r, sender: o } = t, a = e.reqId ?? e.id;
			this._invocations.next({
				id: a,
				channel: this._name,
				sender: o,
				action: n,
				path: s,
				args: r ?? [],
				timestamp: Date.now(),
				contextType: Ke(e)
			});
			const { result: i, toTransfer: c, newPath: l } = await this._executeAction(n, s, r ?? [], o);
			await this._sendResponse(a, n, o, l, i, c);
		}
		async _executeAction(e, t, n, s) {
			const { result: r, toTransfer: o, path: a } = be(e, t, n, {
				channel: this._name,
				sender: s,
				reflect: this._config.reflect
			});
			return {
				result: await r,
				toTransfer: o,
				newPath: a
			};
		}
		async _sendResponse(e, t, n, s, r, o) {
			const { response: a, transfer: i } = await we(e, t, this._name, n, s, r, o), c = {
				id: e,
				...a,
				timestamp: Date.now(),
				transferable: i
			};
			this._send(n, c, i);
		}
		_handleSignal(e) {
			const t = e?.payload ?? {}, n = t.from ?? e.sender ?? "unknown", s = e.transportType ?? this._transports.get(e.channel)?.transportType ?? "internal", r = this._registerConnection({
				localChannel: this._name,
				remoteChannel: n,
				sender: e.sender ?? n,
				transportType: s,
				direction: "incoming"
			});
			this._markConnectionNotified(r, t);
		}
		_registerConnection(e) {
			return this._connectionRegistry.register(e);
		}
		_markConnectionNotified(e, t) {
			this._connectionRegistry.markNotified(e, t);
		}
		_emitConnectionSignal(e, t, n = {}) {
			const s = {
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
			(e?.sender ?? e?.postMessage)?.call(e, s);
			const r = this._registerConnection({
				localChannel: this._name,
				remoteChannel: e.targetChannel,
				sender: this._name,
				transportType: e.transportType,
				direction: "outgoing"
			});
			this._markConnectionNotified(r, s.payload);
		}
		_sendSignalToTarget(e, t, n, s) {
			const r = {
				id: d(),
				type: "signal",
				channel: n.to ?? this._name,
				sender: this._name,
				transportType: t,
				payload: {
					type: s,
					...n
				},
				timestamp: Date.now()
			};
			try {
				if (t === "websocket") {
					e?.send?.(JSON.stringify(r));
					return;
				}
				if (t === "chrome-runtime") {
					chrome.runtime?.sendMessage?.(r);
					return;
				}
				if (t === "chrome-tabs") {
					const o = n.tabId;
					o != null && chrome.tabs?.sendMessage?.(o, r);
					return;
				}
				if (t === "chrome-port") {
					e?.postMessage?.(r);
					return;
				}
				if (t === "chrome-external") {
					n.externalId && chrome.runtime?.sendMessage?.(n.externalId, r);
					return;
				}
				e?.postMessage?.(r, { transfer: [] });
			} catch {}
		}
		_markAllConnectionsClosed() {
			this._connectionRegistry.closeAll();
		}
		_createTransportBinding(e, t, n, s) {
			let r, o;
			switch (t) {
				case "worker":
				case "message-port":
				case "broadcast":
					s.autoStart !== !1 && e.start && e.start(), r = (a, i) => e.postMessage(a, { transfer: i });
					{
						const a = ((i) => this._handleIncoming(i.data));
						e.addEventListener?.("message", a), o = () => e.removeEventListener?.("message", a);
					}
					break;
				case "websocket":
					r = (a) => e.send(JSON.stringify(a));
					{
						const a = ((i) => {
							try {
								this._handleIncoming(JSON.parse(i.data));
							} catch {}
						});
						e.addEventListener?.("message", a), o = () => e.removeEventListener?.("message", a);
					}
					break;
				case "chrome-runtime":
					r = (a) => chrome.runtime.sendMessage(a);
					{
						const a = (i) => this._handleIncoming(i);
						chrome.runtime.onMessage?.addListener?.(a), o = () => chrome.runtime.onMessage?.removeListener?.(a);
					}
					break;
				case "chrome-tabs":
					r = (a) => {
						s.tabId != null && chrome.tabs?.sendMessage?.(s.tabId, a);
					};
					{
						const a = (i, c) => s.tabId != null && c?.tab?.id !== s.tabId ? !1 : (this._handleIncoming(i), !0);
						chrome.runtime.onMessage?.addListener?.(a), o = () => chrome.runtime.onMessage?.removeListener?.(a);
					}
					break;
				case "chrome-port":
					if (e?.postMessage && e?.onMessage?.addListener) {
						r = (i) => e.postMessage(i);
						const a = (i) => this._handleIncoming(i);
						e.onMessage.addListener(a), o = () => {
							try {
								e.onMessage.removeListener(a);
							} catch {}
							try {
								e.disconnect?.();
							} catch {}
						};
					} else {
						const a = s.portName ?? n, i = s.tabId != null && chrome.tabs?.connect ? chrome.tabs.connect(s.tabId, { name: a }) : chrome.runtime.connect({ name: a });
						r = (l) => i.postMessage(l);
						const c = (l) => this._handleIncoming(l);
						i.onMessage.addListener(c), o = () => {
							try {
								i.onMessage.removeListener(c);
							} catch {}
							try {
								i.disconnect();
							} catch {}
						};
					}
					break;
				case "chrome-external":
					r = (a) => {
						s.externalId && chrome.runtime.sendMessage(s.externalId, a);
					};
					{
						const a = (i) => (this._handleIncoming(i), !0);
						chrome.runtime.onMessageExternal?.addListener?.(a), o = () => chrome.runtime.onMessageExternal?.removeListener?.(a);
					}
					break;
				case "self":
					r = (a, i) => globalThis.postMessage?.(a, { transfer: i ?? [] });
					{
						const a = ((i) => this._handleIncoming(i.data));
						globalThis.addEventListener?.("message", a), o = () => globalThis.removeEventListener?.("message", a);
					}
					break;
				default: s.onMessage && (o = s.onMessage((a) => this._handleIncoming(a))), r = (a) => e?.postMessage?.(a);
			}
			return {
				target: e,
				targetChannel: n,
				transportType: t,
				sender: r,
				cleanup: o,
				postMessage: (a, i) => r?.(a, i),
				start: () => e?.start?.(),
				close: () => e?.close?.()
			};
		}
		_send(e, t, n) {
			const s = this._transports.get(e) ?? this._defaultTransport;
			(s?.sender ?? s?.postMessage)?.call(s, t, n);
		}
		_getDefaultTarget() {
			return this._defaultTransport ? this._defaultTransport.targetChannel : "worker";
		}
		_inferTargetChannel(e, t) {
			return t === "worker" ? "worker" : t === "broadcast" && e.name ? e.name : t === "self" ? "self" : `${t}-${d().slice(0, 8)}`;
		}
		_createProxy(e, t) {
			return W((n, s, r) => this.invoke(e, n, s, r), {
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
	function X(e) {
		return new he(e);
	}
	var H = null;
	function ot() {
		if (!H) {
			const e = ae();
			[
				"worker",
				"shared-worker",
				"service-worker"
			].includes(e) ? H = X({
				name: "worker",
				autoListen: !0
			}) : H = X({
				name: "host",
				autoListen: !1
			});
		}
		return H;
	}
	var y = {
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
		typeof ArrayBuffer != y.udf ? ArrayBuffer : null,
		typeof MessagePort != y.udf ? MessagePort : null,
		typeof ReadableStream != y.udf ? ReadableStream : null,
		typeof WritableStream != y.udf ? WritableStream : null,
		typeof TransformStream != y.udf ? TransformStream : null,
		typeof WebTransportReceiveStream != y.udf ? WebTransportReceiveStream : null,
		typeof WebTransportSendStream != y.udf ? WebTransportSendStream : null,
		typeof AudioData != y.udf ? AudioData : null,
		typeof ImageBitmap != y.udf ? ImageBitmap : null,
		typeof VideoFrame != y.udf ? VideoFrame : null,
		typeof OffscreenCanvas != y.udf ? OffscreenCanvas : null,
		typeof RTCDataChannel != y.udf ? RTCDataChannel : null
	].filter((e) => e != null);
	function ue() {
		try {
			const e = globalThis.location?.href;
			if (typeof e == "string" && e.length > 0) return e;
		} catch {}
		try {
			if (typeof document < "u" && typeof document.baseURI == "string" && document.baseURI.length > 0) return document.baseURI;
		} catch {}
		return "";
	}
	function de(e) {
		const t = ue();
		if (!t.length) throw new TypeError("[uniform] No base URL for worker resolution (missing location / document.baseURI)");
		const n = e.startsWith("/") ? e.replace(/^\//, "./") : e;
		return new URL(n, t).href;
	}
	var b = {
		name: "unknown",
		instance: null
	}, z = /* @__PURE__ */ new Map(), pe = (e) => [...Object.values(u)].includes(e), at = class {
		channelName;
		options;
		_channel;
		constructor(e, t = {}) {
			this.channelName = e, this.options = t, this._channel = ot();
		}
		request(e, t, n, s = {}) {
			return typeof e == "string" && (e = [e]), Array.isArray(t) && pe(e) && (s = n, n = t, t = e, e = []), this._channel.invoke(this.channelName, t, e, n);
		}
		doImportModule(e, t) {
			return this._channel.import(e, this.channelName);
		}
	}, it = class {
		channel;
		options;
		_unified;
		broadcasts = {};
		constructor(e, t = {}) {
			this.channel = e, this.options = t, this._unified = X({
				name: e,
				autoListen: !1
			}), b.name = e, b.instance = this;
		}
		createRemoteChannel(e, t = {}, n) {
			return n && (this._unified.attach(n, { targetChannel: e }), this.broadcasts[e] = n), Promise.resolve(new at(e, t));
		}
		getChannel() {
			return this.channel;
		}
		request(e, t, n, s = {}, r = "worker") {
			return typeof e == "string" && (e = [e]), Array.isArray(t) && pe(e) && (r = s, s = n, n = t, t = e, e = []), this._unified.invoke(r, t, e, n);
		}
		resolveResponse(e, t) {
			return Promise.resolve(t);
		}
		async handleAndResponse(e, t, n) {
			const s = await pt(e, t, this.channel);
			s && n?.(s.response, s.transfer);
		}
		close() {
			this._unified.close();
		}
	}, ct = (e = "$host$") => {
		if (b?.instance && e === "$host$") return b.instance;
		if (z.has(e)) return z.get(e) ?? null;
		const t = new it(e);
		return e === "$host$" && (b.name = e, b.instance = t), z.set(e, t), t;
	}, fe = /* @__PURE__ */ new WeakMap(), Y = /* @__PURE__ */ new WeakMap(), _e = /* @__PURE__ */ new WeakMap(), lt = (e, t = b?.name, n) => typeof e == "object" && e != null || typeof e == "function" && e != null ? Y.has(e) ? Y.get(e) : fe.has(e) ? fe.get(e) : $(e) || n?.includes?.(e) || t == b?.name ? e : {
		$isDescriptor: !0,
		path: T.get(e) ?? (() => {
			const s = [d()];
			return F(s, e), s;
		})(),
		owner: b?.name,
		channel: t,
		primitive: C(e),
		writable: !0,
		enumerable: !0,
		configurable: !0,
		argumentCount: e instanceof Function ? e.length : -1
	} : S(e) ? e : null, ht = Symbol.for("@requestHandler"), D = Symbol.for("@descriptor"), K = (e) => S(e) || e?.[D] ? e : e?.$isDescriptor ? nt(e, async () => {}) : $(e) ? e : null, L = /* @__PURE__ */ new Map(), T = /* @__PURE__ */ new WeakMap(), ge = (e, t) => {
		if (t != null && !Array.isArray(t) && (t = [t]), t == null || t?.length < 1) return e;
		const n = e?.[D] ?? (e?.$isDescriptor ? e : null);
		if (n && n?.owner == b?.name && (e = R(n?.path) ?? e), C(e)) return e;
		for (const s of t) if (e = e?.[s], e == null) return e;
		return e;
	}, R = (e) => {
		if (e != null && !Array.isArray(e) && (e = [e]), e == null || e?.length < 1) return null;
		const t = L?.get?.(e?.[0]) ?? null;
		return t != null ? ge(t, e?.slice?.(1)) : null;
	}, F = (e, t) => {
		const n = t?.[D] ?? (t?.$isDescriptor ? t : null);
		if (n && n?.owner == b?.name && (t = R(n?.path) ?? t), e != null && !Array.isArray(e) && (e = [e]), e == null || e?.length < 1) return null;
		const s = L?.get?.(e?.[0]) ?? null;
		return e?.length > 1 ? ge(s, e?.slice?.(1, -1))[e?.[e?.length - 1]] = t : L?.set?.(e?.[0], t), (typeof t == "object" || typeof t == "function") && T?.set?.(t, e), t;
	}, me = (e) => (e != null && !Array.isArray(e) && (e = [e]), e == null || e?.length < 1 ? !1 : !(L?.get?.(e?.[0]) ?? null) && e?.length <= 1 ? (L?.delete?.(e?.[0]), !0) : !1), ut = (e) => {
		const t = e?.[D] ?? (e?.$isDescriptor ? e : null);
		t && t?.owner == b?.name && (e = R(t?.path) ?? e);
		const n = T?.get?.(e) ?? t?.path;
		return n == null || n?.length < 1 ? !1 : (me(n), (typeof e == "object" || typeof e == "function") && T?.delete?.(e), !0);
	}, dt = (e) => {
		const t = e?.[D] ?? (e?.$isDescriptor ? e : null);
		return (T?.get?.(e) ?? t?.path) == null;
	}, E = (e) => (typeof e == "object" || typeof e == "function") && e != null, ye = {
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
	function be(e, t, n, s = {}) {
		const { channel: r = "", sender: o = "", reflect: a = ye } = s, i = s.target ?? R(t), c = [];
		let l = null, _ = t;
		switch (String(e).toLowerCase()) {
			case "import":
			case u.IMPORT:
				l = import(n?.[0]);
				break;
			case "transfer":
			case u.TRANSFER:
				U(i) && r !== o && c.push(i), l = i;
				break;
			case "get":
			case u.GET: {
				const p = n?.[0], w = a.get?.(i, p) ?? i?.[p];
				l = typeof w == "function" && i != null ? w.bind(i) : w, _ = [...t, String(p)];
				break;
			}
			case "set":
			case u.SET: {
				const [p, w] = n, N = k(w, K);
				s.target ? l = a.set?.(i, p, N) ?? (i[p] = N, !0) : l = a.set?.(i, p, N) ?? F([...t, String(p)], N);
				break;
			}
			case "apply":
			case "call":
			case u.APPLY:
			case u.CALL:
				if (typeof i == "function") {
					const p = s.context ?? (s.target ? void 0 : R(t.slice(0, -1))), w = k(n?.[0] ?? n ?? [], K);
					l = a.apply?.(i, p, w) ?? i.apply(p, w), U(l) && t?.at(-1) === "transfer" && r !== o && c.push(l);
				}
				break;
			case "construct":
			case u.CONSTRUCT:
				if (typeof i == "function") {
					const p = k(n?.[0] ?? n ?? [], K);
					l = a.construct?.(i, p) ?? new i(...p);
				}
				break;
			case "delete":
			case "deleteproperty":
			case "dispose":
			case u.DELETE:
			case u.DELETE_PROPERTY:
			case u.DISPOSE:
				if (s.target) {
					const p = t[t.length - 1];
					l = a.deleteProperty?.(i, p) ?? delete i[p];
				} else l = t?.length > 0 ? me(t) : ut(i), l && (_ = T.get(i) ?? []);
				break;
			case "has":
			case u.HAS:
				l = a.has?.(i, n?.[0]) ?? (E(i) ? n?.[0] in i : !1);
				break;
			case "ownkeys":
			case u.OWN_KEYS:
				l = a.ownKeys?.(i) ?? (E(i) ? Object.keys(i) : []);
				break;
			case "getownpropertydescriptor":
			case "getpropertydescriptor":
			case u.GET_OWN_PROPERTY_DESCRIPTOR:
			case u.GET_PROPERTY_DESCRIPTOR:
				l = a.getOwnPropertyDescriptor?.(i, n?.[0] ?? t?.at(-1) ?? "") ?? (E(i) ? Object.getOwnPropertyDescriptor(i, n?.[0] ?? t?.at(-1) ?? "") : void 0);
				break;
			case "getprototypeof":
			case u.GET_PROTOTYPE_OF:
				l = a.getPrototypeOf?.(i) ?? (E(i) ? Object.getPrototypeOf(i) : null);
				break;
			case "setprototypeof":
			case u.SET_PROTOTYPE_OF:
				l = a.setPrototypeOf?.(i, n?.[0]) ?? (E(i) ? Object.setPrototypeOf(i, n?.[0]) : !1);
				break;
			case "isextensible":
			case u.IS_EXTENSIBLE:
				l = a.isExtensible?.(i) ?? (E(i) ? Object.isExtensible(i) : !0);
				break;
			case "preventextensions":
			case u.PREVENT_EXTENSIONS: l = a.preventExtensions?.(i) ?? (E(i) ? Object.preventExtensions(i) : !1);
		}
		return {
			result: l,
			toTransfer: c,
			path: _
		};
	}
	async function we(e, t, n, s, r, o, a) {
		const i = await o, c = U(i) && a.includes(i) || S(i);
		let l = r;
		!c && t !== "get" && t !== u.GET && (typeof i == "object" || typeof i == "function") && (dt(i) ? (l = [d()], F(l, i)) : l = T.get(i) ?? []);
		const _ = R(l), p = t === "get" || t === u.GET ? l?.at(-1) : void 0, w = R(r), N = k(i, (Nt) => lt(Nt, n, a)) ?? i;
		return {
			response: {
				channel: s,
				sender: n,
				reqId: e,
				action: t,
				type: "response",
				payload: {
					result: c ? N : null,
					type: typeof i,
					channel: s,
					sender: n,
					descriptor: {
						$isDescriptor: !0,
						path: l,
						owner: n,
						channel: n,
						primitive: C(i),
						writable: !0,
						enumerable: !0,
						configurable: !0,
						argumentCount: w instanceof Function ? w.length : -1,
						...E(_) && p != null ? Object.getOwnPropertyDescriptor(_, p) : {}
					}
				}
			},
			transfer: a
		};
	}
	async function pt(e, t, n, s) {
		const { channel: r, sender: o, path: a, action: i, args: c } = e;
		if (r !== n) return null;
		const { result: l, toTransfer: _, path: p } = be(i, a, c, {
			channel: r,
			sender: o,
			...s
		});
		return we(t, i, n, o, p, l, _);
	}
	var _t = class {
		_name;
		_transportType;
		_id = d();
		_state = "disconnected";
		_inbound = new g({ bufferSize: 1e3 });
		_outbound = new g({ bufferSize: 1e3 });
		_stateChanges = new g();
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
			return (t ? Ye((n) => n.sender === t)(this._inbound) : this._inbound).subscribe(typeof e == "function" ? { next: e } : e);
		}
		next(e) {
			if (this._state !== "connected") {
				this._opts.bufferMessages && this._buffer.length < this._opts.bufferSize && this._buffer.push(e);
				return;
			}
			this._outbound.next(e), this._stats.messagesSent++;
		}
		async request(e, t, n = {}) {
			const s = d(), r = Promise.withResolvers();
			this._pending.set(s, r);
			const o = setTimeout(() => {
				this._pending.has(s) && (this._pending.delete(s), r.reject(/* @__PURE__ */ new Error("Request timeout")));
			}, n.timeout ?? this._opts.timeout);
			return this.next({
				id: d(),
				channel: e,
				sender: this._name,
				type: "request",
				reqId: s,
				payload: {
					...t,
					action: n.action,
					path: n.path
				},
				timestamp: Date.now()
			}), r.promise.finally(() => clearTimeout(o));
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
	}, gt = class B {
		_connections = /* @__PURE__ */ new Map();
		static _instance = null;
		static getInstance() {
			return B._instance || (B._instance = new B()), B._instance;
		}
		getOrCreate(t, n = "internal", s = {}) {
			return this._connections.has(t) || this._connections.set(t, new _t(t, n, s)), this._connections.get(t);
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
	}, Ce = () => gt.getInstance(), mt = (e, t, n) => Ce().getOrCreate(e, t, n), yt = "uniform_channels", bt = 1, h = {
		MESSAGES: "messages",
		MAILBOX: "mailbox",
		PENDING: "pending",
		EXCHANGE: "exchange",
		TRANSACTIONS: "transactions"
	}, wt = class {
		_db = null;
		_isOpen = !1;
		_openPromise = null;
		_channelName;
		_messageUpdates = new g();
		_exchangeUpdates = new g();
		constructor(e) {
			this._channelName = e;
		}
		async open() {
			return this._db && this._isOpen ? this._db : this._openPromise ? this._openPromise : (this._openPromise = new Promise((e, t) => {
				const n = indexedDB.open(yt, bt);
				n.onerror = () => {
					this._openPromise = null, t(/* @__PURE__ */ new Error("Failed to open IndexedDB"));
				}, n.onsuccess = () => {
					this._db = n.result, this._isOpen = !0, this._openPromise = null, e(this._db);
				}, n.onupgradeneeded = (s) => {
					const r = s.target.result;
					this._createStores(r);
				};
			}), this._openPromise);
		}
		close() {
			this._db && (this._db.close(), this._db = null, this._isOpen = !1);
		}
		_createStores(e) {
			if (!e.objectStoreNames.contains(h.MESSAGES)) {
				const t = e.createObjectStore(h.MESSAGES, { keyPath: "id" });
				t.createIndex("channel", "channel", { unique: !1 }), t.createIndex("status", "status", { unique: !1 }), t.createIndex("recipient", "recipient", { unique: !1 }), t.createIndex("createdAt", "createdAt", { unique: !1 }), t.createIndex("channel_status", ["channel", "status"], { unique: !1 });
			}
			if (!e.objectStoreNames.contains(h.MAILBOX)) {
				const t = e.createObjectStore(h.MAILBOX, { keyPath: "id" });
				t.createIndex("channel", "channel", { unique: !1 }), t.createIndex("priority", "priority", { unique: !1 }), t.createIndex("expiresAt", "expiresAt", { unique: !1 });
			}
			if (!e.objectStoreNames.contains(h.PENDING)) {
				const t = e.createObjectStore(h.PENDING, { keyPath: "id" });
				t.createIndex("channel", "channel", { unique: !1 }), t.createIndex("createdAt", "createdAt", { unique: !1 });
			}
			if (!e.objectStoreNames.contains(h.EXCHANGE)) {
				const t = e.createObjectStore(h.EXCHANGE, { keyPath: "id" });
				t.createIndex("key", "key", { unique: !0 }), t.createIndex("owner", "owner", { unique: !1 });
			}
			e.objectStoreNames.contains(h.TRANSACTIONS) || e.createObjectStore(h.TRANSACTIONS, { keyPath: "id" }).createIndex("createdAt", "createdAt", { unique: !1 });
		}
		async defer(e, t = {}) {
			const n = await this.open(), s = {
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
			return new Promise((r, o) => {
				const a = n.transaction([h.MESSAGES, h.MAILBOX], "readwrite"), i = a.objectStore(h.MESSAGES), c = a.objectStore(h.MAILBOX);
				i.add(s), c.add(s), a.oncomplete = () => {
					this._messageUpdates.next(s), r(s.id);
				}, a.onerror = () => o(/* @__PURE__ */ new Error("Failed to defer message"));
			});
		}
		async getDeferredMessages(e, t = {}) {
			const n = await this.open();
			return new Promise((s, r) => {
				const o = n.transaction(h.MESSAGES, "readonly").objectStore(h.MESSAGES), a = t.status ? o.index("channel_status") : o.index("channel"), i = t.status ? IDBKeyRange.only([e, t.status]) : IDBKeyRange.only(e), c = a.getAll(i, t.limit);
				c.onsuccess = () => {
					let l = c.result;
					t.offset && (l = l.slice(t.offset)), s(l);
				}, c.onerror = () => r(/* @__PURE__ */ new Error("Failed to get deferred messages"));
			});
		}
		async processNextPending(e) {
			const t = await this.open();
			return new Promise((n, s) => {
				const r = t.transaction(h.MESSAGES, "readwrite").objectStore(h.MESSAGES).index("channel_status").openCursor(IDBKeyRange.only([e, "pending"]));
				r.onsuccess = () => {
					const o = r.result;
					if (o) {
						const a = o.value;
						a.status = "processing", a.updatedAt = Date.now(), o.update(a), this._messageUpdates.next(a), n(a);
					} else n(null);
				}, r.onerror = () => s(/* @__PURE__ */ new Error("Failed to process pending message"));
			});
		}
		async markDelivered(e) {
			await this._updateMessageStatus(e, "delivered");
		}
		async markFailed(e) {
			const t = await this.open();
			return new Promise((n, s) => {
				const r = t.transaction(h.MESSAGES, "readwrite").objectStore(h.MESSAGES), o = r.get(e);
				o.onsuccess = () => {
					const a = o.result;
					if (!a) {
						n(!1);
						return;
					}
					a.retryCount++, a.updatedAt = Date.now(), a.retryCount < a.maxRetries ? a.status = "pending" : a.status = "failed", r.put(a), this._messageUpdates.next(a), n(a.status === "pending");
				}, o.onerror = () => s(/* @__PURE__ */ new Error("Failed to mark message as failed"));
			});
		}
		async _updateMessageStatus(e, t) {
			const n = await this.open();
			return new Promise((s, r) => {
				const o = n.transaction(h.MESSAGES, "readwrite").objectStore(h.MESSAGES), a = o.get(e);
				a.onsuccess = () => {
					const i = a.result;
					i && (i.status = t, i.updatedAt = Date.now(), o.put(i), this._messageUpdates.next(i)), s();
				}, a.onerror = () => r(/* @__PURE__ */ new Error("Failed to update message status"));
			});
		}
		async getMailbox(e, t = {}) {
			const n = await this.open();
			return new Promise((s, r) => {
				const o = n.transaction(h.MAILBOX, "readonly").objectStore(h.MAILBOX).index("channel").getAll(IDBKeyRange.only(e), t.limit);
				o.onsuccess = () => {
					let a = o.result;
					t.sortBy === "priority" ? a.sort((i, c) => c.priority - i.priority) : a.sort((i, c) => c.createdAt - i.createdAt), s(a);
				}, o.onerror = () => r(/* @__PURE__ */ new Error("Failed to get mailbox"));
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
			}, s = Date.now();
			for (const r of t) r.expiresAt && r.expiresAt < s ? n.expired++ : n[r.status]++;
			return n;
		}
		async clearMailbox(e) {
			const t = await this.open();
			return new Promise((n, s) => {
				const r = t.transaction(h.MAILBOX, "readwrite"), o = r.objectStore(h.MAILBOX).index("channel");
				let a = 0;
				const i = o.openCursor(IDBKeyRange.only(e));
				i.onsuccess = () => {
					const c = i.result;
					c && (c.delete(), a++, c.continue());
				}, r.oncomplete = () => n(a), r.onerror = () => s(/* @__PURE__ */ new Error("Failed to clear mailbox"));
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
			return new Promise((s, r) => {
				const o = t.transaction(h.PENDING, "readwrite");
				o.objectStore(h.PENDING).add(n), o.oncomplete = () => s(n.id), o.onerror = () => r(/* @__PURE__ */ new Error("Failed to register pending operation"));
			});
		}
		async getPendingOperations() {
			const e = await this.open();
			return new Promise((t, n) => {
				const s = e.transaction(h.PENDING, "readonly").objectStore(h.PENDING).index("channel").getAll(IDBKeyRange.only(this._channelName));
				s.onsuccess = () => t(s.result), s.onerror = () => n(/* @__PURE__ */ new Error("Failed to get pending operations"));
			});
		}
		async completePending(e) {
			const t = await this.open();
			return new Promise((n, s) => {
				const r = t.transaction(h.PENDING, "readwrite");
				r.objectStore(h.PENDING).delete(e), r.oncomplete = () => n(), r.onerror = () => s(/* @__PURE__ */ new Error("Failed to complete pending operation"));
			});
		}
		async awaitPending(e, t = {}) {
			const n = t.timeout ?? 3e4, s = t.pollInterval ?? 100, r = Date.now();
			for (; Date.now() - r < n;) {
				const o = await this._getPendingById(e);
				if (!o) return null;
				if (o.status === "completed") return await this.completePending(e), o.result;
				await new Promise((a) => setTimeout(a, s));
			}
			throw new Error(`Pending operation ${e} timed out`);
		}
		async _getPendingById(e) {
			const t = await this.open();
			return new Promise((n, s) => {
				const r = t.transaction(h.PENDING, "readonly").objectStore(h.PENDING).get(e);
				r.onsuccess = () => n(r.result ?? null), r.onerror = () => s(/* @__PURE__ */ new Error("Failed to get pending operation"));
			});
		}
		async exchangePut(e, t, n = {}) {
			const s = await this.open(), r = {
				id: d(),
				key: e,
				value: t,
				owner: this._channelName,
				sharedWith: n.sharedWith ?? ["*"],
				version: 1,
				createdAt: Date.now(),
				updatedAt: Date.now()
			};
			return new Promise((o, a) => {
				const i = s.transaction(h.EXCHANGE, "readwrite"), c = i.objectStore(h.EXCHANGE), l = c.index("key").get(e);
				l.onsuccess = () => {
					const _ = l.result;
					_ && (r.id = _.id, r.version = _.version + 1, r.createdAt = _.createdAt), c.put(r);
				}, i.oncomplete = () => {
					this._exchangeUpdates.next(r), o(r.id);
				}, i.onerror = () => a(/* @__PURE__ */ new Error("Failed to put exchange data"));
			});
		}
		async exchangeGet(e) {
			const t = await this.open();
			return new Promise((n, s) => {
				const r = t.transaction(h.EXCHANGE, "readonly").objectStore(h.EXCHANGE).index("key").get(e);
				r.onsuccess = () => {
					const o = r.result;
					if (!o) {
						n(null);
						return;
					}
					if (!this._canAccessExchange(o)) {
						n(null);
						return;
					}
					n(o.value);
				}, r.onerror = () => s(/* @__PURE__ */ new Error("Failed to get exchange data"));
			});
		}
		async exchangeDelete(e) {
			const t = await this.open();
			return new Promise((n, s) => {
				const r = t.transaction(h.EXCHANGE, "readwrite"), o = r.objectStore(h.EXCHANGE), a = o.index("key").get(e);
				a.onsuccess = () => {
					const i = a.result;
					if (!i) {
						n(!1);
						return;
					}
					if (i.owner !== this._channelName) {
						n(!1);
						return;
					}
					o.delete(i.id);
				}, r.oncomplete = () => n(!0), r.onerror = () => s(/* @__PURE__ */ new Error("Failed to delete exchange data"));
			});
		}
		async exchangeLock(e, t = {}) {
			const n = await this.open(), s = t.timeout ?? 3e4;
			return new Promise((r, o) => {
				const a = n.transaction(h.EXCHANGE, "readwrite"), i = a.objectStore(h.EXCHANGE), c = i.index("key").get(e);
				c.onsuccess = () => {
					const l = c.result;
					if (!l) {
						r(!1);
						return;
					}
					if (l.lock && l.lock.holder !== this._channelName && l.lock.expiresAt > Date.now()) {
						r(!1);
						return;
					}
					l.lock = {
						holder: this._channelName,
						acquiredAt: Date.now(),
						expiresAt: Date.now() + s
					}, l.updatedAt = Date.now(), i.put(l);
				}, a.oncomplete = () => r(!0), a.onerror = () => o(/* @__PURE__ */ new Error("Failed to acquire lock"));
			});
		}
		async exchangeUnlock(e) {
			const t = await this.open();
			return new Promise((n, s) => {
				const r = t.transaction(h.EXCHANGE, "readwrite"), o = r.objectStore(h.EXCHANGE), a = o.index("key").get(e);
				a.onsuccess = () => {
					const i = a.result;
					i && i.lock?.holder === this._channelName && (delete i.lock, i.updatedAt = Date.now(), o.put(i));
				}, r.oncomplete = () => n(), r.onerror = () => s(/* @__PURE__ */ new Error("Failed to release lock"));
			});
		}
		_canAccessExchange(e) {
			return e.owner === this._channelName || e.sharedWith.includes("*") ? !0 : e.sharedWith.includes(this._channelName);
		}
		async beginTransaction() {
			return new Ct(this);
		}
		async executeTransaction(e) {
			const t = await this.open(), n = new Set(e.map((s) => s.store));
			return new Promise((s, r) => {
				const o = t.transaction(Array.from(n), "readwrite");
				for (const a of e) {
					const i = o.objectStore(a.store);
					switch (a.type) {
						case "put":
							a.value !== void 0 && i.put(a.value);
							break;
						case "delete":
							a.key !== void 0 && i.delete(a.key);
							break;
						case "update": if (a.key !== void 0) {
							const c = i.get(a.key);
							c.onsuccess = () => {
								c.result && a.value && i.put({
									...c.result,
									...a.value
								});
							};
						}
					}
				}
				o.oncomplete = () => s(), o.onerror = () => r(/* @__PURE__ */ new Error("Transaction failed"));
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
			return new Promise((n, s) => {
				const r = e.transaction([h.MESSAGES, h.MAILBOX], "readwrite"), o = r.objectStore(h.MESSAGES), a = r.objectStore(h.MAILBOX);
				let i = 0;
				const c = o.openCursor();
				c.onsuccess = () => {
					const _ = c.result;
					if (_) {
						const p = _.value;
						p.expiresAt && p.expiresAt < t && (_.delete(), i++), _.continue();
					}
				};
				const l = a.openCursor();
				l.onsuccess = () => {
					const _ = l.result;
					if (_) {
						const p = _.value;
						p.expiresAt && p.expiresAt < t && (_.delete(), i++), _.continue();
					}
				}, r.oncomplete = () => n(i), r.onerror = () => s(/* @__PURE__ */ new Error("Failed to cleanup expired"));
			});
		}
	}, Ct = class {
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
	}, V = /* @__PURE__ */ new Map();
	function vt(e) {
		return V.has(e) || V.set(e, new wt(e)), V.get(e);
	}
	var ve = ue(), St = ve.length > 0 ? new URL("../transport/Worker.ts", ve) : "", Se = class {
		_channel;
		_context;
		_options;
		_connection;
		_storage;
		constructor(e, t, n = {}) {
			this._channel = e, this._context = t, this._options = n, this._connection = mt(e), this._storage = vt(e);
		}
		async request(e, t, n, s = {}) {
			let r = typeof e == "string" ? [e] : e, o = t, a = n;
			return Array.isArray(t) && ke(e) && (s = n, a = t, o = e, r = []), this._context.getHost()?.request(r, o, a, s, this._channel);
		}
		async doImportModule(e, t = {}) {
			return this.request([], u.IMPORT, [e], t);
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
	}, P = class {
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
			this._channel = e, this._context = t, this._options = n, this._connection = Ce().getOrCreate(e, "internal", n), this._unified = new he({
				name: e,
				autoListen: !1,
				timeout: n?.timeout
			});
		}
		createRemoteChannel(e, t = {}, n) {
			const s = Et(n ?? this._context.$createOrUseExistingRemote(e, t, n ?? null)?.messageChannel?.port1), r = Pe(s?.target ?? s);
			return this._unified.listen(s?.target, { targetChannel: e }), s && (this._broadcasts?.set?.(e, s), r === "self" && typeof postMessage > "u" || this._unified.connect(s, { targetChannel: e }), this._context.$registerConnection({
				localChannel: this._channel,
				remoteChannel: e,
				sender: this._channel,
				direction: "outgoing",
				transportType: r
			}), this.notifyChannel(e, {
				contextId: this._context.id,
				contextName: this._context.hostName
			}, "connect")), new Se(e, this._context, t);
		}
		getChannel() {
			return this._channel;
		}
		get connection() {
			return this._connection;
		}
		request(e, t, n, s = {}, r = "worker") {
			let o = typeof e == "string" ? [e] : e, a = n;
			return Array.isArray(t) && ke(e) && (r = s, s = n, a = t, t = e, o = []), this._unified.invoke(r, t, o ?? [], Array.isArray(a) ? a : [a]);
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
	}, kt = class {
		_options;
		_id = d();
		_hostName;
		_host = null;
		_endpoints = /* @__PURE__ */ new Map();
		_unifiedByChannel = /* @__PURE__ */ new Map();
		_unifiedConnectionSubs = /* @__PURE__ */ new Map();
		_remoteChannels = /* @__PURE__ */ new Map();
		_deferredChannels = /* @__PURE__ */ new Map();
		_connectionEvents = new g({ bufferSize: 200 });
		_connectionRegistry = new le(() => d(), (e) => this._emitConnectionEvent(e));
		_closed = !1;
		_globalSelf = null;
		constructor(e = {}) {
			this._options = e, this._hostName = e.name ?? `ctx-${this._id.slice(0, 8)}`, e.useGlobalSelf !== !1 && (this._globalSelf = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : null);
		}
		initHost(e) {
			if (this._host && !e) return this._host;
			const t = e ?? this._hostName;
			if (this._hostName = t, this._endpoints.has(t)) return this._host = this._endpoints.get(t).handler, this._host;
			this._host = new P(t, this, this._options.defaultOptions);
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
			for (const s of this._endpoints.values()) {
				const r = s.handler.getConnectedChannels();
				for (const o of r) {
					if (t.localChannel && t.localChannel !== s.name || t.remoteChannel && t.remoteChannel !== o) continue;
					const a = this.queryConnections({
						localChannel: s.name,
						remoteChannel: o,
						status: "active"
					})[0];
					t.sender && a?.sender !== t.sender || t.transportType && a?.transportType !== t.transportType || t.channel && t.channel !== s.name && t.channel !== o || s.handler.notifyChannel(o, e, "notify") && n++;
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
			const n = new P(e, this, {
				...this._options.defaultOptions,
				...t
			}), s = {
				name: e,
				handler: n,
				connection: n.connection,
				subscriptions: [],
				ready: Promise.resolve(null),
				unified: n.unified
			};
			return this._endpoints.set(e, s), this._registerUnifiedChannel(e, n.unified), s;
		}
		createChannels(e, t = {}) {
			const n = /* @__PURE__ */ new Map();
			for (const s of e) n.set(s, this.createChannel(s, t));
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
			const s = xe(t);
			if (!s) throw new Error(`Failed to create worker for channel: ${e}`);
			const r = new P(e, this, {
				...this._options.defaultOptions,
				...n
			}), o = r.createRemoteChannel(e, n, s), a = {
				name: e,
				handler: r,
				connection: r.connection,
				subscriptions: [],
				transportType: "worker",
				ready: Promise.resolve(o),
				unified: r.unified
			};
			return this._endpoints.set(e, a), this._registerUnifiedChannel(e, r.unified), this._remoteChannels.set(e, {
				channel: e,
				context: this,
				remote: Promise.resolve(o),
				transport: s,
				transportType: "worker"
			}), a;
		}
		async addPort(e, t, n = {}) {
			const s = new P(e, this, {
				...this._options.defaultOptions,
				...n
			});
			t.start?.();
			const r = s.createRemoteChannel(e, n, t), o = {
				name: e,
				handler: s,
				connection: s.connection,
				subscriptions: [],
				transportType: "message-port",
				ready: Promise.resolve(r),
				unified: s.unified
			};
			return this._endpoints.set(e, o), this._registerUnifiedChannel(e, s.unified), this._remoteChannels.set(e, {
				channel: e,
				context: this,
				remote: Promise.resolve(r),
				transport: t,
				transportType: "message-port"
			}), o;
		}
		async addBroadcast(e, t, n = {}) {
			const s = new BroadcastChannel(t ?? e), r = new P(e, this, {
				...this._options.defaultOptions,
				...n
			}), o = r.createRemoteChannel(e, n, s), a = {
				name: e,
				handler: r,
				connection: r.connection,
				subscriptions: [],
				transportType: "broadcast",
				ready: Promise.resolve(o),
				unified: r.unified
			};
			return this._endpoints.set(e, a), this._registerUnifiedChannel(e, r.unified), this._remoteChannels.set(e, {
				channel: e,
				context: this,
				remote: Promise.resolve(o),
				transport: s,
				transportType: "broadcast"
			}), a;
		}
		addSelfChannel(e, t = {}) {
			const n = new P(e, this, {
				...this._options.defaultOptions,
				...t
			}), s = this._globalSelf ?? (typeof self < "u" ? self : null), r = {
				name: e,
				handler: n,
				connection: n.connection,
				subscriptions: [],
				transportType: "self",
				ready: Promise.resolve(s ? n.createRemoteChannel(e, t, s) : null),
				unified: n.unified
			};
			return this._endpoints.set(e, r), this._registerUnifiedChannel(e, n.unified), r;
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
					const s = typeof t.broadcast == "string" ? t.broadcast : void 0;
					return this.addBroadcast(e, s, n);
				case "self": return this.addSelfChannel(e, n);
				default: return this.createChannel(e, n);
			}
		}
		createChannelPair(e, t, n = {}) {
			const s = new MessageChannel(), r = new P(e, this, {
				...this._options.defaultOptions,
				...n
			}), o = new P(t, this, {
				...this._options.defaultOptions,
				...n
			});
			s.port1.start(), s.port2.start();
			const a = Promise.resolve(r.createRemoteChannel(t, n, s.port1)), i = Promise.resolve(o.createRemoteChannel(e, n, s.port2)), c = {
				name: e,
				handler: r,
				connection: r.connection,
				subscriptions: [],
				transportType: "message-port",
				ready: a,
				unified: r.unified
			}, l = {
				name: t,
				handler: o,
				connection: o.connection,
				subscriptions: [],
				transportType: "message-port",
				ready: i,
				unified: o.unified
			};
			return this._endpoints.set(e, c), this._endpoints.set(t, l), this._registerUnifiedChannel(e, r.unified), this._registerUnifiedChannel(t, o.unified), {
				channel1: c,
				channel2: l,
				messageChannel: s
			};
		}
		get globalSelf() {
			return this._globalSelf;
		}
		async connectRemote(e, t = {}, n) {
			return this.initHost(), this._host.createRemoteChannel(e, t, n);
		}
		async importModuleInChannel(e, t, n = {}, s) {
			return (await this.connectRemote(e, n.channelOptions, s))?.doImportModule?.(t, n.importOptions);
		}
		$createOrUseExistingRemote(e, t = {}, n) {
			if (e == null || n) return null;
			if (this._remoteChannels.has(e)) return this._remoteChannels.get(e);
			const s = new MessageChannel(), r = re(new Promise((a) => {
				const i = xe(St);
				i?.addEventListener?.("message", (c) => {
					c.data.type === "channelCreated" && (s.port1?.start?.(), a(new Se(c.data.channel, this, t)));
				}), i?.postMessage?.({
					type: "createChannel",
					channel: e,
					sender: this._hostName,
					options: t,
					messagePort: s.port2
				}, { transfer: [s.port2] });
			})), o = {
				channel: e,
				context: this,
				messageChannel: s,
				remote: r
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
			const n = t.connection.transportType ?? "internal", s = this._connectionRegistry.register({
				localChannel: t.connection.localChannel || e,
				remoteChannel: t.connection.remoteChannel,
				sender: t.connection.sender,
				direction: t.connection.direction,
				transportType: n,
				metadata: t.connection.metadata
			});
			t.type === "notified" ? this._connectionRegistry.markNotified(s, t.payload) : t.type === "disconnected" && this._connectionRegistry.closeByChannel(t.connection.localChannel);
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
			const n = t.subscribeConnections((s) => {
				this.$forwardUnifiedConnectionEvent(e, s);
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
	function ke(e) {
		return [...Object.values(u)].includes(e);
	}
	function Et(e) {
		if (!e) return null;
		if (Ee(e)) return e;
		const t = e, n = Pe(t);
		return {
			target: t,
			targetChannel: "unknown",
			transportType: n === "internal" ? "self" : n,
			sender: (s, r) => {
				if (typeof WebSocket < "u" && t instanceof WebSocket) {
					t.send(JSON.stringify(s));
					return;
				}
				t.postMessage?.(s, r?.length ? { transfer: r } : void 0);
			},
			postMessage: (s, r) => {
				t.postMessage?.(s, r);
			},
			addEventListener: t.addEventListener?.bind(t),
			removeEventListener: t.removeEventListener?.bind(t),
			start: t.start?.bind(t),
			close: t.close?.bind(t)
		};
	}
	function Ee(e) {
		return !!e && typeof e == "object" && "target" in e && typeof e.postMessage == "function";
	}
	function Pe(e) {
		const t = Ee(e) ? e.target : e;
		return t ? t === "chrome-runtime" ? "chrome-runtime" : t === "chrome-tabs" ? "chrome-tabs" : t === "chrome-port" ? "chrome-port" : t === "chrome-external" ? "chrome-external" : typeof MessagePort < "u" && t instanceof MessagePort ? "message-port" : typeof BroadcastChannel < "u" && t instanceof BroadcastChannel ? "broadcast" : typeof Worker < "u" && t instanceof Worker ? "worker" : typeof WebSocket < "u" && t instanceof WebSocket ? "websocket" : typeof chrome < "u" && typeof t == "object" && t && typeof t.postMessage == "function" && t.onMessage?.addListener ? "chrome-port" : typeof self < "u" && t === self ? "self" : "internal" : "internal";
	}
	function xe(e) {
		if (e instanceof Worker) return e;
		if (e instanceof URL) return new Worker(e.href, { type: "module" });
		if (typeof e == "function") try {
			return new e({ type: "module" });
		} catch {
			return e({ type: "module" });
		}
		return typeof e == "string" ? e.startsWith("/") ? new Worker(de(e.replace(/^\//, "./")), { type: "module" }) : URL.canParse(e) || e.startsWith("./") ? new Worker(de(e), { type: "module" }) : new Worker(URL.createObjectURL(new Blob([e], { type: "application/javascript" })), { type: "module" }) : e instanceof Blob || e instanceof File ? new Worker(URL.createObjectURL(e), { type: "module" }) : e ?? (typeof self < "u" ? self : null);
	}
	var Pt = /* @__PURE__ */ new Map();
	function xt(e = {}) {
		const t = new kt(e);
		return e.name && Pt.set(e.name, t), t;
	}
	var Tt = class {
		_context;
		_config;
		_subscriptions = [];
		_incomingConnections = new g({ bufferSize: 100 });
		_channelCreated = new g({ bufferSize: 100 });
		_channelClosed = new g();
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
			}, this._context = xt({
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
	}, J = null;
	function Rt(e) {
		return J || (J = new Tt(e)), J;
	}
	Rt({ name: "worker" });
	var G = class {
		_channelName;
		_config;
		_port;
		_subs = /* @__PURE__ */ new Set();
		_pending = /* @__PURE__ */ new Map();
		_listening = !1;
		_cleanup = null;
		_portId = d();
		_state = new g();
		_keepAliveTimer = null;
		constructor(e, t, n = {}) {
			this._channelName = t, this._config = n, this._port = e, this._setupPort(), n.autoStart !== !1 && this.start();
		}
		_setupPort() {
			const e = (n) => {
				const s = n.data;
				if (s.type === "response" && s.reqId) {
					const r = this._pending.get(s.reqId);
					if (r) {
						this._pending.delete(s.reqId), s.payload?.error ? r.reject(new Error(s.payload.error)) : r.resolve(s.payload?.result ?? s.payload);
						return;
					}
				}
				if (s.type === "signal" && s.payload?.action === "ping") {
					this.send({
						id: d(),
						channel: this._channelName,
						sender: this._portId,
						type: "signal",
						payload: { action: "pong" }
					});
					return;
				}
				s.portId = s.portId ?? this._portId;
				for (const r of this._subs) try {
					r.next?.(s);
				} catch (o) {
					r.error?.(o);
				}
			}, t = () => {
				this._state.next("error");
				const n = /* @__PURE__ */ new Error("Port error");
				for (const s of this._subs) s.error?.(n);
			};
			this._port.addEventListener("message", e), this._port.addEventListener("messageerror", t), this._cleanup = () => {
				this._port.removeEventListener("message", e), this._port.removeEventListener("messageerror", t);
			};
		}
		start() {
			this._listening || (this._port.start(), this._listening = !0, this._state.next("ready"), this._config.keepAlive && this._startKeepAlive());
		}
		send(e, t) {
			const { transferable: n, ...s } = e;
			this._port.postMessage({
				...s,
				portId: this._portId
			}, t ?? []);
		}
		request(e) {
			const t = e.reqId ?? d();
			return new Promise((n, s) => {
				const r = setTimeout(() => {
					this._pending.delete(t), s(/* @__PURE__ */ new Error("Request timeout"));
				}, this._config.timeout ?? 3e4);
				this._pending.set(t, {
					resolve: (o) => {
						clearTimeout(r), n(o);
					},
					reject: (o) => {
						clearTimeout(r), s(o);
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
	function Q(e, t) {
		const n = new MessageChannel();
		return {
			local: new G(n.port1, e, t),
			remote: n.port2,
			transfer: () => n.port2
		};
	}
	var Te = class {
		_target;
		_channelName;
		_config;
		_transport = null;
		_state = new g();
		_handshakeComplete = !1;
		constructor(e, t, n = {}) {
			this._target = e, this._channelName = t, this._config = n;
		}
		async connect() {
			if (this._transport && this._handshakeComplete) return this._transport;
			this._state.next("connecting");
			const { local: e, remote: t } = Q(this._channelName, this._config);
			return this._target.postMessage({
				type: "port-connect",
				channelName: this._channelName,
				portId: e.portId
			}, this._config.targetOrigin ?? "*", [t]), new Promise((n, s) => {
				const r = setTimeout(() => {
					s(/* @__PURE__ */ new Error("Handshake timeout")), this._state.next("error");
				}, this._config.handshakeTimeout ?? 1e4), o = e.subscribe({ next: (a) => {
					a.type === "signal" && a.payload?.action === "handshake-ack" && (clearTimeout(r), this._handshakeComplete = !0, this._transport = e, this._state.next("connected"), o.unsubscribe(), n(e));
				} });
			});
		}
		static listen(e, t, n) {
			const s = (r) => {
				if (r.data?.type !== "port-connect" || r.data?.channelName !== e || !r.ports[0]) return;
				const o = new G(r.ports[0], e, n);
				o.send({
					id: d(),
					channel: e,
					sender: o.portId,
					type: "signal",
					payload: { action: "handshake-ack" }
				}), t(o);
			};
			return globalThis.addEventListener("message", s), () => globalThis.removeEventListener("message", s);
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
	Te.listen;
	var Re = (e, t = "worker") => {
		const n = ct(t ?? "worker");
		return Object.keys(e).forEach((s) => {
			e[s];
		}), n;
	}, Ot = Ne({
		getDirHandle: () => I,
		getFileSystemRoot: () => A,
		handlers: () => x,
		normalizePath: () => M,
		resolveFileSystemHandle: () => Ae
	}), j, q, A, M, Ae, I, x, Me, O, Ie = De((() => {
		j = /* @__PURE__ */ new Map(), q = /* @__PURE__ */ new Map(), A = async (e = "") => e && j.has(e) ? j.get(e) : await navigator.storage.getDirectory(), M = (e) => e?.trim?.()?.replace(/\/+/g, "/") || "/", Ae = async (e, t, n = !1) => {
			const s = M(t).split("/").filter((o) => o && o !== ".");
			let r = e;
			for (let o = 0; o < s.length; o++) {
				const a = s[o];
				if (o === s.length - 1) try {
					return await r.getDirectoryHandle(a, { create: n });
				} catch {
					try {
						return await r.getFileHandle(a, { create: n });
					} catch (i) {
						if (n) throw i;
						return null;
					}
				}
				else r = await r.getDirectoryHandle(a, { create: n });
			}
			return r;
		}, I = async (e, t, n) => {
			const s = M(t).split("/").filter((o) => o);
			let r = e;
			for (const o of s) r = await r.getDirectoryHandle(o, { create: n });
			return r;
		}, x = {
			mount: async ({ id: e, handle: t }) => (j.set(e, t), !0),
			unmount: async ({ id: e }) => (j.delete(e), !0),
			readDirectory: async ({ rootId: e, path: t, create: n }) => {
				try {
					const s = await A(e), r = await I(s, t, n), o = [];
					for await (const [a, i] of r.entries()) o.push([a, i]);
					return o;
				} catch (s) {
					return console.warn("Worker readDirectory error:", s), [];
				}
			},
			readFile: async ({ rootId: e, path: t, type: n }) => {
				try {
					const s = await A(e), r = M(t).split("/").filter((c) => c), o = r.pop(), a = r.join("/"), i = await (await (await I(s, a, !1)).getFileHandle(o, { create: !1 })).getFile();
					return n === "text" ? await i.text() : n === "arrayBuffer" ? await i.arrayBuffer() : i;
				} catch (s) {
					return console.warn("Worker readFile error:", s), null;
				}
			},
			writeFile: async ({ rootId: e, path: t, data: n }) => {
				try {
					const s = await A(e), r = M(t).split("/").filter((c) => c), o = r.pop(), a = r.join("/"), i = await (await (await I(s, a, !0)).getFileHandle(o, { create: !0 })).createWritable();
					return await i.write(n), await i.close(), !0;
				} catch (s) {
					return console.warn("Worker writeFile error:", s), !1;
				}
			},
			remove: async ({ rootId: e, path: t, recursive: n }) => {
				try {
					const s = await A(e), r = M(t).split("/").filter((i) => i), o = r.pop(), a = r.join("/");
					return await (await I(s, a, !1)).removeEntry(o, { recursive: n }), !0;
				} catch {
					return !1;
				}
			},
			observe: async ({ rootId: e, path: t, id: n }) => {
				try {
					if (q.has(n)) return !0;
					const s = await A(e), r = await I(s, t, !1);
					if (typeof FileSystemObserver < "u") {
						const o = new FileSystemObserver((a) => {
							const i = a.map((c) => {
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
								changes: i
							});
						});
						return o.observe(r), q.set(n, o), !0;
					}
					return !1;
				} catch {
					return !1;
				}
			},
			unobserve: async ({ id: e }) => {
				const t = q.get(e);
				return t && (t.disconnect(), q.delete(e)), !0;
			},
			copy: async ({ from: e, to: t }) => {
				try {
					const n = async (s, r) => {
						if (s.kind === "directory") for await (const [o, a] of s.entries()) if (a.kind === "directory") {
							const i = await r.getDirectoryHandle(o, { create: !0 });
							await n(a, i);
						} else {
							const i = await a.getFile(), c = await (await r.getFileHandle(o, { create: !0 })).createWritable();
							await c.write(i), await c.close();
						}
						else {
							const o = await s.getFile(), a = await r.createWritable();
							await a.write(o), await a.close();
						}
					};
					return await n(e, t), !0;
				} catch (n) {
					return console.warn("Worker copy error:", n), !1;
				}
			}
		}, Me = "opfs-sw-bridge-v1", O = null;
		try {
			typeof BroadcastChannel < "u" && (O = new BroadcastChannel(Me), O.onmessage = async (e) => {
				const t = e?.data || {};
				if (!t || typeof t != "object" || t?.type !== "opfs-sw-request") return;
				const n = String(t?.requestId || ""), s = String(t?.action || ""), r = t?.payload;
				if (!n || !s) return;
				const o = x[s];
				if (!o) {
					O?.postMessage?.({
						type: "opfs-sw-response",
						requestId: n,
						ok: !1,
						error: `Unknown operation type: ${s}`
					});
					return;
				}
				try {
					const a = await o(r);
					O?.postMessage?.({
						type: "opfs-sw-response",
						requestId: n,
						ok: !0,
						result: a
					});
				} catch (a) {
					O?.postMessage?.({
						type: "opfs-sw-response",
						requestId: n,
						ok: !1,
						error: a?.message || String(a)
					});
				}
			});
		} catch {
			O = null;
		}
		self.addEventListener("message", async (e) => {
			if (!e.data || typeof e.data != "object") return;
			const { id: t, type: n, payload: s } = e.data;
			if (x[n]) try {
				const r = await x[n](s);
				self.postMessage({
					id: t,
					result: r
				});
			} catch (r) {
				self.postMessage({
					id: t,
					error: r?.message || String(r)
				});
			}
			else t && self.postMessage({
				id: t,
				error: `Unknown operation type: ${n}`
			});
		});
	}));
	Ie(), x && Re(x);
	const Dt = async (e) => {
		try {
			if (e.type === "batch") {
				const t = [];
				for (const n of e.payload) {
					const s = await Oe(n);
					t.push(s);
				}
				return t;
			} else return await Oe(e);
		} catch (t) {
			throw console.error("[OPFS Worker] Message processing error:", t), t;
		}
	}, Oe = async (e) => {
		const t = x[e.type];
		if (!t) throw new Error(`Unknown message type: ${e.type}`);
		return await t(e.payload);
	};
	globalThis.processMessage = Dt, (async () => {
		try {
			const e = (await Promise.resolve().then(() => (Ie(), Ot))).handlers;
			e && Re(e), console.log("[OPFS Worker] Initialized with handlers:", Object.keys(e || {}));
		} catch (e) {
			console.error("[OPFS Worker] Failed to initialize:", e);
		}
	})();
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiYXNzZXRzL09QRlMudW5pZm9ybS53b3JrZXItIX57MDAwfX4uanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIihmdW5jdGlvbigpIHtcblxuLy8jcmVnaW9uIFxcMHJvbGxkb3duL3J1bnRpbWUuanNcblx0dmFyIF9fZGVmUHJvcCA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eTtcblx0dmFyIF9fZXNtTWluID0gKGZuLCByZXMsIGVycikgPT4gKCkgPT4ge1xuXHRcdGlmIChlcnIpIHRocm93IGVyclswXTtcblx0XHR0cnkge1xuXHRcdFx0cmV0dXJuIGZuICYmIChyZXMgPSBmbihmbiA9IDApKSwgcmVzO1xuXHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdHRocm93IGVyciA9IFtlXSwgZTtcblx0XHR9XG5cdH07XG5cdHZhciBfX2V4cG9ydEFsbCA9IChhbGwsIG5vX3N5bWJvbHMpID0+IHtcblx0XHRsZXQgdGFyZ2V0ID0ge307XG5cdFx0Zm9yICh2YXIgbmFtZSBpbiBhbGwpIHtcblx0XHRcdF9fZGVmUHJvcCh0YXJnZXQsIG5hbWUsIHtcblx0XHRcdFx0Z2V0OiBhbGxbbmFtZV0sXG5cdFx0XHRcdGVudW1lcmFibGU6IHRydWVcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRpZiAoIW5vX3N5bWJvbHMpIHtcblx0XHRcdF9fZGVmUHJvcCh0YXJnZXQsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogXCJNb2R1bGVcIiB9KTtcblx0XHR9XG5cdFx0cmV0dXJuIHRhcmdldDtcblx0fTtcblxuLy8jZW5kcmVnaW9uXG4vLyNyZWdpb24gLi4vY29yZS50cy9kaXN0L2NvcmUuanNcblx0ZnVuY3Rpb24gWCQxKCkge1xuXHRcdGNvbnN0IGUgPSBnbG9iYWxUaGlzO1xuXHRcdGlmICh0eXBlb2YgZS5IVE1MRWxlbWVudCA9PSBcImZ1bmN0aW9uXCIpIHJldHVybjtcblx0XHRjb25zdCB0ID0gY2xhc3Mge30sIHIgPSAobikgPT4ge1xuXHRcdFx0dHlwZW9mIGVbbl0gIT0gXCJmdW5jdGlvblwiICYmIChlW25dID0gdCk7XG5cdFx0fTtcblx0XHRyKFwiRXZlbnRUYXJnZXRcIiksIHIoXCJOb2RlXCIpLCByKFwiRWxlbWVudFwiKSwgcihcIkhUTUxFbGVtZW50XCIpLCByKFwiU1ZHRWxlbWVudFwiKSwgcihcIlRleHRcIiksIHIoXCJDb21tZW50XCIpLCByKFwiRG9jdW1lbnRGcmFnbWVudFwiKSwgcihcIlNoYWRvd1Jvb3RcIiksIHIoXCJIVE1MRG9jdW1lbnRcIiksIHIoXCJEb2N1bWVudFwiKSwgcihcIkhUTUxCb2R5RWxlbWVudFwiKSwgcihcIkhUTUxIZWFkRWxlbWVudFwiKSwgcihcIkhUTUxDYW52YXNFbGVtZW50XCIpLCByKFwiSFRNTElucHV0RWxlbWVudFwiKSwgcihcIkhUTUxMaW5rRWxlbWVudFwiKSwgcihcIkhUTUxTdHlsZUVsZW1lbnRcIiksIHIoXCJIVE1MUHJlRWxlbWVudFwiKSwgcihcIkhUTUxEaXZFbGVtZW50XCIpLCByKFwiQ1NTU3R5bGVSdWxlXCIpLCByKFwiQ1NTTGF5ZXJCbG9ja1J1bGVcIik7XG5cdH1cblx0dmFyIFokMSA9IGNsYXNzIHtcblx0XHRjaGFubmVscyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG5cdFx0bGlzdGVuZXJzID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0XHRyZWdpc3RlcihlLCB0KSB7XG5cdFx0XHR0aGlzLmNoYW5uZWxzLnNldChlLCB0KTtcblx0XHRcdGNvbnN0IHIgPSB0aGlzLmxpc3RlbmVycy5nZXQoZSk7XG5cdFx0XHRpZiAocikgZm9yIChjb25zdCBuIG9mIHIpIHRyeSB7XG5cdFx0XHRcdG4odCk7XG5cdFx0XHR9IGNhdGNoIChpKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoYFtDaGFubmVsUmVnaXN0cnldIExpc3RlbmVyIGVycm9yIGZvciAke2V9OmAsIGkpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHQ7XG5cdFx0fVxuXHRcdGdldChlKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5jaGFubmVscy5nZXQoZSk7XG5cdFx0fVxuXHRcdGhhcyhlKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5jaGFubmVscy5oYXMoZSk7XG5cdFx0fVxuXHRcdHVucmVnaXN0ZXIoZSkge1xuXHRcdFx0Y29uc3QgdCA9IHRoaXMuY2hhbm5lbHMuZGVsZXRlKGUpO1xuXHRcdFx0aWYgKHQpIHtcblx0XHRcdFx0Y29uc3QgciA9IHRoaXMubGlzdGVuZXJzLmdldChlKTtcblx0XHRcdFx0aWYgKHIpIGZvciAoY29uc3QgbiBvZiByKSB0cnkge1xuXHRcdFx0XHRcdG4obnVsbCk7XG5cdFx0XHRcdH0gY2F0Y2ggKGkpIHtcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKGBbQ2hhbm5lbFJlZ2lzdHJ5XSBVbnJlZ2lzdGVyIGxpc3RlbmVyIGVycm9yIGZvciAke2V9OmAsIGkpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdDtcblx0XHR9XG5cdFx0b25DaGFubmVsQ2hhbmdlKGUsIHQpIHtcblx0XHRcdHRoaXMubGlzdGVuZXJzLmhhcyhlKSB8fCB0aGlzLmxpc3RlbmVycy5zZXQoZSwgLyogQF9fUFVSRV9fICovIG5ldyBTZXQoKSk7XG5cdFx0XHRjb25zdCByID0gdGhpcy5saXN0ZW5lcnMuZ2V0KGUpO1xuXHRcdFx0aWYgKHIuYWRkKHQpLCB0aGlzLmNoYW5uZWxzLmhhcyhlKSkgdHJ5IHtcblx0XHRcdFx0dCh0aGlzLmNoYW5uZWxzLmdldChlKSk7XG5cdFx0XHR9IGNhdGNoIChuKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoYFtDaGFubmVsUmVnaXN0cnldIEluaXRpYWwgbGlzdGVuZXIgZXJyb3IgZm9yICR7ZX06YCwgbik7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gKCkgPT4ge1xuXHRcdFx0XHRyLmRlbGV0ZSh0KSwgci5zaXplID09PSAwICYmIHRoaXMubGlzdGVuZXJzLmRlbGV0ZShlKTtcblx0XHRcdH07XG5cdFx0fVxuXHRcdGdldENoYW5uZWxOYW1lcygpIHtcblx0XHRcdHJldHVybiBBcnJheS5mcm9tKHRoaXMuY2hhbm5lbHMua2V5cygpKTtcblx0XHR9XG5cdFx0Y2xlYXIoKSB7XG5cdFx0XHR0aGlzLmNoYW5uZWxzLmNsZWFyKCksIHRoaXMubGlzdGVuZXJzLmNsZWFyKCk7XG5cdFx0fVxuXHR9O1xuXHR2YXIgRGUkMSA9IG5ldyBaJDEoKTtcblx0dmFyIFkgPSBjbGFzcyB7XG5cdFx0aGVhbHRoQ2hlY2tzID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0XHRpbnRlcnZhbHMgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuXHRcdGhlYWx0aFN0YXR1cyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG5cdFx0cmVnaXN0ZXJIZWFsdGhDaGVjayhlLCB0LCByID0gM2U0KSB7XG5cdFx0XHR0aGlzLmhlYWx0aENoZWNrcy5zZXQoZSwgdCk7XG5cdFx0XHRjb25zdCBuID0gdGhpcy5pbnRlcnZhbHMuZ2V0KGUpO1xuXHRcdFx0biAmJiBjbGVhckludGVydmFsKG4pO1xuXHRcdFx0Y29uc3QgaSA9IHNldEludGVydmFsKGFzeW5jICgpID0+IHtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRjb25zdCBzID0gYXdhaXQgdCgpO1xuXHRcdFx0XHRcdHRoaXMuaGVhbHRoU3RhdHVzLnNldChlLCBzKSwgcyB8fCBjb25zb2xlLndhcm4oYFtDaGFubmVsSGVhbHRoXSBDaGFubmVsICcke2V9JyBpcyB1bmhlYWx0aHlgKTtcblx0XHRcdFx0fSBjYXRjaCAocykge1xuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoYFtDaGFubmVsSGVhbHRoXSBIZWFsdGggY2hlY2sgZmFpbGVkIGZvciAnJHtlfSc6YCwgcyksIHRoaXMuaGVhbHRoU3RhdHVzLnNldChlLCAhMSk7XG5cdFx0XHRcdH1cblx0XHRcdH0sIHIpO1xuXHRcdFx0dGhpcy5pbnRlcnZhbHMuc2V0KGUsIGkpLCB0KCkudGhlbigocykgPT4ge1xuXHRcdFx0XHR0aGlzLmhlYWx0aFN0YXR1cy5zZXQoZSwgcyk7XG5cdFx0XHR9KS5jYXRjaCgoKSA9PiB7XG5cdFx0XHRcdHRoaXMuaGVhbHRoU3RhdHVzLnNldChlLCAhMSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0aXNIZWFsdGh5KGUpIHtcblx0XHRcdHJldHVybiB0aGlzLmhlYWx0aFN0YXR1cy5nZXQoZSkgPz8gITE7XG5cdFx0fVxuXHRcdGdldEFsbEhlYWx0aFN0YXR1c2VzKCkge1xuXHRcdFx0Y29uc3QgZSA9IHt9O1xuXHRcdFx0Zm9yIChjb25zdCBbdCwgcl0gb2YgdGhpcy5oZWFsdGhTdGF0dXMpIGVbdF0gPSByO1xuXHRcdFx0cmV0dXJuIGU7XG5cdFx0fVxuXHRcdHN0b3BNb25pdG9yaW5nKGUpIHtcblx0XHRcdGNvbnN0IHQgPSB0aGlzLmludGVydmFscy5nZXQoZSk7XG5cdFx0XHR0ICYmIChjbGVhckludGVydmFsKHQpLCB0aGlzLmludGVydmFscy5kZWxldGUoZSkpLCB0aGlzLmhlYWx0aENoZWNrcy5kZWxldGUoZSksIHRoaXMuaGVhbHRoU3RhdHVzLmRlbGV0ZShlKTtcblx0XHR9XG5cdFx0c3RvcEFsbE1vbml0b3JpbmcoKSB7XG5cdFx0XHRmb3IgKGNvbnN0IGUgb2YgdGhpcy5pbnRlcnZhbHMudmFsdWVzKCkpIGNsZWFySW50ZXJ2YWwoZSk7XG5cdFx0XHR0aGlzLmludGVydmFscy5jbGVhcigpLCB0aGlzLmhlYWx0aENoZWNrcy5jbGVhcigpLCB0aGlzLmhlYWx0aFN0YXR1cy5jbGVhcigpO1xuXHRcdH1cblx0fTtcblx0dmFyIE5lID0gbmV3IFkoKTtcblx0V2Vha01hcC5wcm90b3R5cGUuZ2V0T3JJbnNlcnQgPz89IGZ1bmN0aW9uKGUsIHQpIHtcblx0XHRyZXR1cm4gdGhpcy5oYXMoZSkgfHwgdGhpcy5zZXQoZSwgdCksIHRoaXMuZ2V0KGUpO1xuXHR9O1xuXHRXZWFrTWFwLnByb3RvdHlwZS5nZXRPckluc2VydENvbXB1dGVkID8/PSBmdW5jdGlvbihlLCB0KSB7XG5cdFx0cmV0dXJuIHRoaXMuaGFzKGUpIHx8IHRoaXMuc2V0KGUsIHQoZSkpLCB0aGlzLmdldChlKTtcblx0fTtcblx0TWFwLnByb3RvdHlwZS5nZXRPckluc2VydCA/Pz0gZnVuY3Rpb24oZSwgdCkge1xuXHRcdHJldHVybiB0aGlzLmhhcyhlKSB8fCB0aGlzLnNldChlLCB0KSwgdGhpcy5nZXQoZSk7XG5cdH07XG5cdE1hcC5wcm90b3R5cGUuZ2V0T3JJbnNlcnRDb21wdXRlZCA/Pz0gZnVuY3Rpb24oZSwgdCkge1xuXHRcdHJldHVybiB0aGlzLmhhcyhlKSB8fCB0aGlzLnNldChlLCB0KGUpKSwgdGhpcy5nZXQoZSk7XG5cdH07XG5cdHZhciBGID0gLyogQF9fUFVSRV9fICovIFN5bWJvbC5mb3IoXCJAZml4XCIpO1xuXHR2YXIgZyA9IChlKSA9PiB0eXBlb2YgZSA9PSBcInN0cmluZ1wiIHx8IHR5cGVvZiBlID09IFwibnVtYmVyXCIgfHwgdHlwZW9mIGUgPT0gXCJib29sZWFuXCIgfHwgdHlwZW9mIGUgPT0gXCJiaWdpbnRcIiB8fCB0eXBlb2YgZSA+IFwidVwiIHx8IGUgPT0gbnVsbDtcblx0dmFyIFEkMSA9IChlLCB0KSA9PiBnKGUpID8gdCA9PSBcIm51bWJlclwiID8gTnVtYmVyKGUpIHx8IDAgOiB0ID09IFwic3RyaW5nXCIgPyBTdHJpbmcoZSkgfHwgXCJcIiA6IHQgPT0gXCJib29sZWFuXCIgPyAhIWUgOiBlIDogbnVsbDtcblx0dmFyIGMgPSAoZSwgdCkgPT4gZT8uW0ZdID8/IGUgPz8gdCA/PyB0O1xuXHR2YXIgdGUkMSA9IChlKSA9PiB7XG5cdFx0aWYgKHR5cGVvZiBlID09IFwiZnVuY3Rpb25cIiB8fCBlID09IG51bGwpIHJldHVybiBlO1xuXHRcdGNvbnN0IHQgPSBmdW5jdGlvbigpIHt9O1xuXHRcdHJldHVybiB0W0ZdID0gZSwgdDtcblx0fTtcblx0dmFyIHJlJDEgPSAoZSkgPT4gY3J5cHRvPy5nZXRSYW5kb21WYWx1ZXMgPyBjcnlwdG8/LmdldFJhbmRvbVZhbHVlcz8uKGUpIDogKCgpID0+IHtcblx0XHRjb25zdCB0ID0gbmV3IFVpbnQ4QXJyYXkoZS5sZW5ndGgpO1xuXHRcdGZvciAobGV0IHIgPSAwOyByIDwgZS5sZW5ndGg7IHIrKykgdFtyXSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDI1Nik7XG5cdFx0cmV0dXJuIHQ7XG5cdH0pKCk7XG5cdHZhciAkZSA9ICgpID0+IGNyeXB0bz8ucmFuZG9tVVVJRCA/IGNyeXB0bz8ucmFuZG9tVVVJRD8uKCkgOiBcIjEwMDAwMDAwLTEwMDAtNDAwMC04MDAwLTEwMDAwMDAwMDAwMFwiLnJlcGxhY2UoL1swMThdL2csIChlKSA9PiAoK2UgXiByZSQxPy4oLyogQF9fUFVSRV9fICovIG5ldyBVaW50OEFycmF5KDEpKT8uWzBdICYgMTUgPj4gK2UgLyA0KS50b1N0cmluZygxNikpO1xuXHR2YXIgViA9IChlKSA9PiBBcnJheS5pc0FycmF5KGUpID8gZT8uZmxhdE1hcD8uKCh0KSA9PiBBcnJheS5pc0FycmF5KHQpID8gVih0KSA6IHQpIDogZTtcblx0dmFyIHNlID0gKGUpID0+IFYoZSk/LmV2ZXJ5Py4oYik7XG5cdHZhciBiID0gKGUpID0+IGcoZSkgfHwgdHlwZW9mIFNoYXJlZEFycmF5QnVmZmVyID09IFwiZnVuY3Rpb25cIiAmJiBlIGluc3RhbmNlb2YgU2hhcmVkQXJyYXlCdWZmZXIgfHwgb2UoZSkgfHwgQXJyYXkuaXNBcnJheShlKSAmJiBzZShlKTtcblx0dmFyIG9lID0gKGUpID0+IEFycmF5QnVmZmVyLmlzVmlldyhlKSAmJiAhKGUgaW5zdGFuY2VvZiBEYXRhVmlldyk7XG5cdHZhciBwdCQxID0gKGUpID0+IGcoZSkgfHwgdHlwZW9mIEFycmF5QnVmZmVyID09IFwiZnVuY3Rpb25cIiAmJiBlIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIgfHwgdHlwZW9mIE1lc3NhZ2VQb3J0ID09IFwiZnVuY3Rpb25cIiAmJiBlIGluc3RhbmNlb2YgTWVzc2FnZVBvcnQgfHwgdHlwZW9mIFJlYWRhYmxlU3RyZWFtID09IFwiZnVuY3Rpb25cIiAmJiBlIGluc3RhbmNlb2YgUmVhZGFibGVTdHJlYW0gfHwgdHlwZW9mIFdyaXRhYmxlU3RyZWFtID09IFwiZnVuY3Rpb25cIiAmJiBlIGluc3RhbmNlb2YgV3JpdGFibGVTdHJlYW0gfHwgdHlwZW9mIFRyYW5zZm9ybVN0cmVhbSA9PSBcImZ1bmN0aW9uXCIgJiYgZSBpbnN0YW5jZW9mIFRyYW5zZm9ybVN0cmVhbSB8fCB0eXBlb2YgSW1hZ2VCaXRtYXAgPT0gXCJmdW5jdGlvblwiICYmIGUgaW5zdGFuY2VvZiBJbWFnZUJpdG1hcCB8fCB0eXBlb2YgVmlkZW9GcmFtZSA9PSBcImZ1bmN0aW9uXCIgJiYgZSBpbnN0YW5jZW9mIFZpZGVvRnJhbWUgfHwgdHlwZW9mIE9mZnNjcmVlbkNhbnZhcyA9PSBcImZ1bmN0aW9uXCIgJiYgZSBpbnN0YW5jZW9mIE9mZnNjcmVlbkNhbnZhcyB8fCB0eXBlb2YgUlRDRGF0YUNoYW5uZWwgPT0gXCJmdW5jdGlvblwiICYmIGUgaW5zdGFuY2VvZiBSVENEYXRhQ2hhbm5lbCB8fCB0eXBlb2YgQXVkaW9EYXRhID09IFwiZnVuY3Rpb25cIiAmJiBlIGluc3RhbmNlb2YgQXVkaW9EYXRhIHx8IHR5cGVvZiBXZWJUcmFuc3BvcnRSZWNlaXZlU3RyZWFtID09IFwiZnVuY3Rpb25cIiAmJiBlIGluc3RhbmNlb2YgV2ViVHJhbnNwb3J0UmVjZWl2ZVN0cmVhbSB8fCB0eXBlb2YgV2ViVHJhbnNwb3J0U2VuZFN0cmVhbSA9PSBcImZ1bmN0aW9uXCIgJiYgZSBpbnN0YW5jZW9mIFdlYlRyYW5zcG9ydFNlbmRTdHJlYW0gfHwgdHlwZW9mIFdlYlRyYW5zcG9ydFJlY2VpdmVTdHJlYW0gPT0gXCJmdW5jdGlvblwiICYmIGUgaW5zdGFuY2VvZiBXZWJUcmFuc3BvcnRSZWNlaXZlU3RyZWFtO1xuXHR2YXIgJCA9IC8qIEBfX1BVUkVfXyAqLyBTeW1ib2wuZm9yKFwib2JqZWN0LmJvdW5kQ3R4XCIpO1xuXHRnbG9iYWxUaGlzWyRdID8/PSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcblx0dmFyIGxlID0gZ2xvYmFsVGhpc1skXTtcblx0dmFyIE8gPSAoZSwgdCwgcikgPT4ge1xuXHRcdGlmIChBcnJheS5pc0FycmF5KGUpKSByZXR1cm4gZS5ldmVyeShiKSA/IGUubWFwKHQpIDogZS5tYXAoKG4sIGkpID0+IE8obiwgdCwgW2UsIGldKSk7XG5cdFx0aWYgKGUgaW5zdGFuY2VvZiBNYXApIHtcblx0XHRcdGNvbnN0IG4gPSBBcnJheS5mcm9tKGUuZW50cmllcygpKTtcblx0XHRcdHJldHVybiBuLm1hcCgoW2ksIHNdKSA9PiBzKS5ldmVyeShiKSA/IG5ldyBNYXAobi5tYXAoKFtpLCBzXSkgPT4gW2ksIHQocywgaSwgZSldKSkgOiBuZXcgTWFwKG4ubWFwKChbaSwgc10pID0+IFtpLCBPKHMsIHQsIFtlLCBpXSldKSk7XG5cdFx0fVxuXHRcdGlmIChlIGluc3RhbmNlb2YgU2V0KSB7XG5cdFx0XHRjb25zdCBuID0gQXJyYXkuZnJvbShlLmVudHJpZXMoKSksIGkgPSBuLm1hcCgoW3MsIGZdKSA9PiBmKTtcblx0XHRcdHJldHVybiBuLmV2ZXJ5KGIpID8gbmV3IFNldChpLm1hcCh0KSkgOiBuZXcgU2V0KGkubWFwKChzKSA9PiBPKHMsIHQsIFtlLCBzXSkpKTtcblx0XHR9XG5cdFx0aWYgKHR5cGVvZiBlID09IFwib2JqZWN0XCIgJiYgZT8uY29uc3RydWN0b3IgPT0gT2JqZWN0ICYmIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChlKSA9PSBcIltvYmplY3QgT2JqZWN0XVwiKSB7XG5cdFx0XHRjb25zdCBuID0gQXJyYXkuZnJvbShPYmplY3QuZW50cmllcyhlKSk7XG5cdFx0XHRyZXR1cm4gbi5tYXAoKFtpLCBzXSkgPT4gcykuZXZlcnkoYikgPyBPYmplY3QuZnJvbUVudHJpZXMobi5tYXAoKFtpLCBzXSkgPT4gW2ksIHQocywgaSwgZSldKSkgOiBPYmplY3QuZnJvbUVudHJpZXMobi5tYXAoKFtpLCBzXSkgPT4gW2ksIE8ocywgdCwgW2UsIGldKV0pKTtcblx0XHR9XG5cdFx0cmV0dXJuIHQoZSwgcj8uWzFdID8/IFwiXCIsIHI/LlswXSA/PyBudWxsKTtcblx0fTtcblx0dmFyIHAgPSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcblx0dmFyIEgkMSA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xuXHR2YXIgbSA9IChlLCB0KSA9PiBlIGluc3RhbmNlb2YgUHJvbWlzZSB8fCB0eXBlb2YgZT8udGhlbiA9PSBcImZ1bmN0aW9uXCIgPyBwPy5oYXM/LihlKSA/IHQocD8uZ2V0Py4oZSkpIDogUHJvbWlzZS50cnk/Lihhc3luYyAoKSA9PiB7XG5cdFx0Y29uc3QgciA9IGF3YWl0IGU7XG5cdFx0cmV0dXJuIHA/LnNldD8uKGUsIHIpLCByO1xuXHR9KT8udGhlbj8uKHQpIDogdChlKTtcblx0dmFyIHllID0gY2xhc3Mge1xuXHRcdCNlO1xuXHRcdCN0O1xuXHRcdGNvbnN0cnVjdG9yKGUsIHQpIHtcblx0XHRcdHRoaXMuI2UgPSBlLCB0aGlzLiN0ID0gdDtcblx0XHR9XG5cdFx0ZGVmaW5lUHJvcGVydHkoZSwgdCwgcikge1xuXHRcdFx0cmV0dXJuIGMoZSkgaW5zdGFuY2VvZiBQcm9taXNlID8gUmVmbGVjdC5kZWZpbmVQcm9wZXJ0eShlLCB0LCByKSA6IG0oYyhlKSwgKG4pID0+IFJlZmxlY3QuZGVmaW5lUHJvcGVydHkobiwgdCwgcikpO1xuXHRcdH1cblx0XHRkZWxldGVQcm9wZXJ0eShlLCB0KSB7XG5cdFx0XHRyZXR1cm4gYyhlKSBpbnN0YW5jZW9mIFByb21pc2UgPyBSZWZsZWN0LmRlbGV0ZVByb3BlcnR5KGUsIHQpIDogbShjKGUpLCAocikgPT4gUmVmbGVjdC5kZWxldGVQcm9wZXJ0eShyLCB0KSk7XG5cdFx0fVxuXHRcdGdldFByb3RvdHlwZU9mKGUpIHtcblx0XHRcdHJldHVybiBjKGUpIGluc3RhbmNlb2YgUHJvbWlzZSA/IFJlZmxlY3QuZ2V0UHJvdG90eXBlT2YoZSkgOiBtKGMoZSksICh0KSA9PiBSZWZsZWN0LmdldFByb3RvdHlwZU9mKHQpKTtcblx0XHR9XG5cdFx0c2V0UHJvdG90eXBlT2YoZSwgdCkge1xuXHRcdFx0cmV0dXJuIGMoZSkgaW5zdGFuY2VvZiBQcm9taXNlID8gUmVmbGVjdC5zZXRQcm90b3R5cGVPZihlLCB0KSA6IG0oYyhlKSwgKHIpID0+IFJlZmxlY3Quc2V0UHJvdG90eXBlT2YociwgdCkpO1xuXHRcdH1cblx0XHRpc0V4dGVuc2libGUoZSkge1xuXHRcdFx0cmV0dXJuIGMoZSkgaW5zdGFuY2VvZiBQcm9taXNlID8gUmVmbGVjdC5pc0V4dGVuc2libGUoZSkgOiBtKGMoZSksICh0KSA9PiBSZWZsZWN0LmlzRXh0ZW5zaWJsZSh0KSk7XG5cdFx0fVxuXHRcdHByZXZlbnRFeHRlbnNpb25zKGUpIHtcblx0XHRcdHJldHVybiBjKGUpIGluc3RhbmNlb2YgUHJvbWlzZSA/IFJlZmxlY3Qub3duS2V5cyhlKSA6IG0oYyhlKSwgKHQpID0+IFJlZmxlY3QucHJldmVudEV4dGVuc2lvbnModCkpO1xuXHRcdH1cblx0XHRvd25LZXlzKGUpIHtcblx0XHRcdGNvbnN0IHQgPSBjKGUpO1xuXHRcdFx0cmV0dXJuIHQgaW5zdGFuY2VvZiBQcm9taXNlID8gT2JqZWN0LmtleXModCkgOiBtKHQsIChyKSA9PiAodHlwZW9mIHIgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgciA9PSBcImZ1bmN0aW9uXCIpICYmIHIgIT0gbnVsbCA/IE9iamVjdC5rZXlzKHIpIDogW10pID8/IFtdO1xuXHRcdH1cblx0XHRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoZSwgdCkge1xuXHRcdFx0cmV0dXJuIGMoZSkgaW5zdGFuY2VvZiBQcm9taXNlID8gUmVmbGVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoZSwgdCkgOiBtKGMoZSksIChyKSA9PiBSZWZsZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihyLCB0KSk7XG5cdFx0fVxuXHRcdGNvbnN0cnVjdChlLCB0LCByKSB7XG5cdFx0XHRyZXR1cm4gbShjKGUpLCAobikgPT4gUmVmbGVjdC5jb25zdHJ1Y3QobiwgdCwgcikpO1xuXHRcdH1cblx0XHRoYXMoZSwgdCkge1xuXHRcdFx0cmV0dXJuIGMoZSkgaW5zdGFuY2VvZiBQcm9taXNlID8gUmVmbGVjdC5oYXMoZSwgdCkgOiBtKGMoZSksIChyKSA9PiBSZWZsZWN0LmhhcyhyLCB0KSk7XG5cdFx0fVxuXHRcdGdldChlLCB0LCByKSB7XG5cdFx0XHRpZiAoZSA9IGMoZSksIHQgPT0gXCJwcm9taXNlXCIpIHJldHVybiBlO1xuXHRcdFx0aWYgKHQgPT0gXCJyZXNvbHZlXCIgJiYgdGhpcy4jZSkgcmV0dXJuICguLi5pKSA9PiB7XG5cdFx0XHRcdGNvbnN0IHMgPSB0aGlzLiNlPy4oLi4uaSk7XG5cdFx0XHRcdHJldHVybiB0aGlzLiNlID0gbnVsbCwgcztcblx0XHRcdH07XG5cdFx0XHRpZiAodCA9PSBcInJlamVjdFwiICYmIHRoaXMuI3QpIHJldHVybiAoLi4uaSkgPT4ge1xuXHRcdFx0XHRjb25zdCBzID0gdGhpcy4jdD8uKC4uLmkpO1xuXHRcdFx0XHRyZXR1cm4gdGhpcy4jdCA9IG51bGwsIHM7XG5cdFx0XHR9O1xuXHRcdFx0aWYgKHQgPT0gXCJ0aGVuXCIgfHwgdCA9PSBcImNhdGNoXCIgfHwgdCA9PSBcImZpbmFsbHlcIikge1xuXHRcdFx0XHRpZiAoZSBpbnN0YW5jZW9mIFByb21pc2UpIHJldHVybiBlPy5bdF0/LmJpbmQ/LihlKTtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGNvbnN0IGkgPSBQcm9taXNlLnRyeSgoKSA9PiBlKTtcblx0XHRcdFx0XHRyZXR1cm4gaT8uW3RdPy5iaW5kPy4oaSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGxldCBuO1xuXHRcdFx0cmV0dXJuIHA/Lmhhcz8uKGUpICYmIChuID0gcD8uZ2V0Py4oZSkpPy5bdF0gIT0gbnVsbCA/IG4gPSBwPy5nZXQ/LihlKT8uW3RdIDogbiA9IGhlKG0oZSwgYXN5bmMgKGkpID0+IHtcblx0XHRcdFx0aWYgKGMoaSkgaW5zdGFuY2VvZiBQcm9taXNlKSByZXR1cm4gUmVmbGVjdC5nZXQoaSwgdCwgcik7XG5cdFx0XHRcdGlmIChnKGkpKSByZXR1cm4gdCA9PSBTeW1ib2wudG9QcmltaXRpdmUgfHwgdCA9PSBTeW1ib2wudG9TdHJpbmdUYWcgPyBpIDogdm9pZCAwO1xuXHRcdFx0XHRsZXQgcztcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRzID0gUmVmbGVjdC5nZXQoaSwgdCwgcik7XG5cdFx0XHRcdH0gY2F0Y2gge1xuXHRcdFx0XHRcdHMgPSBlPy5bdF07XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHR5cGVvZiBzID09IFwiZnVuY3Rpb25cIiA/IHM/LmJpbmQ/LihpKSA6IHM7XG5cdFx0XHR9KSksIHQgPT0gU3ltYm9sLnRvU3RyaW5nVGFnID8gZyhuKSA/IFN0cmluZyhuID8/IFwiXCIpIHx8IFwiXCIgOiBuPy5bU3ltYm9sLnRvU3RyaW5nVGFnXT8uKCkgfHwgU3RyaW5nKG4gPz8gXCJcIikgfHwgXCJcIiA6IHQgPT0gU3ltYm9sLnRvUHJpbWl0aXZlID8gKGkpID0+IHtcblx0XHRcdFx0aWYgKGcobikpIHJldHVybiBRJDEobiwgaSk7XG5cdFx0XHR9IDogbjtcblx0XHR9XG5cdFx0c2V0KGUsIHQsIHIpIHtcblx0XHRcdHJldHVybiBtKGMoZSksIChuKSA9PiBSZWZsZWN0LnNldChuLCB0LCByKSk7XG5cdFx0fVxuXHRcdGFwcGx5KGUsIHQsIHIpIHtcblx0XHRcdGlmICh0aGlzLiNlKSB7XG5cdFx0XHRcdGNvbnN0IG4gPSB0aGlzLiNlPy4oLi4ucik7XG5cdFx0XHRcdHJldHVybiB0aGlzLiNlID0gbnVsbCwgbjtcblx0XHRcdH1cblx0XHRcdHJldHVybiBtKGMoZSwgdGhpcy4jZSksIChuKSA9PiB7XG5cdFx0XHRcdGlmICh0eXBlb2YgbiA9PSBcImZ1bmN0aW9uXCIpIHJldHVybiBjKG4pIGluc3RhbmNlb2YgUHJvbWlzZSwgUmVmbGVjdC5hcHBseShuLCB0LCByKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fTtcblx0ZnVuY3Rpb24gaGUoZSwgdCwgcikge1xuXHRcdHJldHVybiBlIGluc3RhbmNlb2YgUHJvbWlzZSB8fCB0eXBlb2YgZT8udGhlbiA9PSBcImZ1bmN0aW9uXCIgPyBwPy5oYXM/LihlKSA/IHA/LmdldD8uKGUpIDogKEgkMT8uaGFzPy4oZSkgfHwgZT8udGhlbj8uKChuKSA9PiBwPy5zZXQ/LihlLCBuKSksIEgkMT8uZ2V0T3JJbnNlcnRDb21wdXRlZD8uKGUsICgpID0+IG5ldyBQcm94eSh0ZSQxKGUpLCBuZXcgeWUodCwgcikpKSkgOiBlO1xuXHR9XG5cdFgkMSgpO1xuXG4vLyNlbmRyZWdpb25cbi8vI3JlZ2lvbiAuLi91bmlmb3JtLnRzL2Rpc3QvdW5pZm9ybS5qc1xuXHR2YXIgZCA9IC8qIEBfX1BVUkVfXyAqLyAoZnVuY3Rpb24oZSkge1xuXHRcdHJldHVybiBlLkdFVCA9IFwiZ2V0XCIsIGUuU0VUID0gXCJzZXRcIiwgZS5DQUxMID0gXCJjYWxsXCIsIGUuQVBQTFkgPSBcImFwcGx5XCIsIGUuQ09OU1RSVUNUID0gXCJjb25zdHJ1Y3RcIiwgZS5ERUxFVEUgPSBcImRlbGV0ZVwiLCBlLkRFTEVURV9QUk9QRVJUWSA9IFwiZGVsZXRlUHJvcGVydHlcIiwgZS5IQVMgPSBcImhhc1wiLCBlLk9XTl9LRVlTID0gXCJvd25LZXlzXCIsIGUuR0VUX09XTl9QUk9QRVJUWV9ERVNDUklQVE9SID0gXCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JcIiwgZS5HRVRfUFJPUEVSVFlfREVTQ1JJUFRPUiA9IFwiZ2V0UHJvcGVydHlEZXNjcmlwdG9yXCIsIGUuR0VUX1BST1RPVFlQRV9PRiA9IFwiZ2V0UHJvdG90eXBlT2ZcIiwgZS5TRVRfUFJPVE9UWVBFX09GID0gXCJzZXRQcm90b3R5cGVPZlwiLCBlLklTX0VYVEVOU0lCTEUgPSBcImlzRXh0ZW5zaWJsZVwiLCBlLlBSRVZFTlRfRVhURU5TSU9OUyA9IFwicHJldmVudEV4dGVuc2lvbnNcIiwgZS5UUkFOU0ZFUiA9IFwidHJhbnNmZXJcIiwgZS5JTVBPUlQgPSBcImltcG9ydFwiLCBlLkRJU1BPU0UgPSBcImRpc3Bvc2VcIiwgZTtcblx0fSkoe30pO1xuXHR2YXIgb24gPSB7XG5cdFx0d3M6IFwid2Vic29ja2V0XCIsXG5cdFx0c29ja2V0OiBcIndlYnNvY2tldFwiLFxuXHRcdHNvY2tldGlvOiBcInNvY2tldC1pb1wiLFxuXHRcdHNlcnZpY2U6IFwic2VydmljZS13b3JrZXJcIixcblx0XHRzdzogXCJzZXJ2aWNlLXdvcmtlclwiLFxuXHRcdFwic2VydmljZS13b3JrZXItY2xpZW50XCI6IFwic2VydmljZS13b3JrZXJcIixcblx0XHRcInNlcnZpY2Utd29ya2VyLWhvc3RcIjogXCJzZXJ2aWNlLXdvcmtlclwiLFxuXHRcdFwicmluZy1idWZmZXJcIjogXCJhdG9taWNzXCJcblx0fTtcblx0ZnVuY3Rpb24gYW4oZSkge1xuXHRcdGNvbnN0IHQgPSBTdHJpbmcoZSA/PyBcIlwiKS50cmltKCkudG9Mb3dlckNhc2UoKTtcblx0XHRyZXR1cm4gdCA/IG9uW3RdID8/IHQgOiBcImludGVybmFsXCI7XG5cdH1cblx0ZnVuY3Rpb24gWihlKSB7XG5cdFx0cmV0dXJuIHR5cGVvZiBlID09IFwic3RyaW5nXCIgPyBhbihlKSA6IHR5cGVvZiBXb3JrZXIgPCBcInVcIiAmJiBlIGluc3RhbmNlb2YgV29ya2VyID8gXCJ3b3JrZXJcIiA6IHR5cGVvZiBTaGFyZWRXb3JrZXIgPCBcInVcIiAmJiBlIGluc3RhbmNlb2YgU2hhcmVkV29ya2VyID8gXCJzaGFyZWQtd29ya2VyXCIgOiB0eXBlb2YgTWVzc2FnZVBvcnQgPCBcInVcIiAmJiBlIGluc3RhbmNlb2YgTWVzc2FnZVBvcnQgPyBcIm1lc3NhZ2UtcG9ydFwiIDogdHlwZW9mIEJyb2FkY2FzdENoYW5uZWwgPCBcInVcIiAmJiBlIGluc3RhbmNlb2YgQnJvYWRjYXN0Q2hhbm5lbCA/IFwiYnJvYWRjYXN0XCIgOiB0eXBlb2YgV2ViU29ja2V0IDwgXCJ1XCIgJiYgZSBpbnN0YW5jZW9mIFdlYlNvY2tldCA/IFwid2Vic29ja2V0XCIgOiB0eXBlb2YgUlRDRGF0YUNoYW5uZWwgPCBcInVcIiAmJiBlIGluc3RhbmNlb2YgUlRDRGF0YUNoYW5uZWwgPyBcInJ0Yy1kYXRhXCIgOiB0eXBlb2YgY2hyb21lIDwgXCJ1XCIgJiYgZSAmJiB0eXBlb2YgZSA9PSBcIm9iamVjdFwiICYmIHR5cGVvZiBlLnBvc3RNZXNzYWdlID09IFwiZnVuY3Rpb25cIiAmJiBlLm9uTWVzc2FnZT8uYWRkTGlzdGVuZXIgPyBcImNocm9tZS1wb3J0XCIgOiBcImludGVybmFsXCI7XG5cdH1cblx0dmFyIFJlID0gY2xhc3Mge1xuXHRcdF91bnN1YnNjcmliZTtcblx0XHRfY2xvc2VkID0gITE7XG5cdFx0Y29uc3RydWN0b3IoZSkge1xuXHRcdFx0dGhpcy5fdW5zdWJzY3JpYmUgPSBlO1xuXHRcdH1cblx0XHRnZXQgY2xvc2VkKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2Nsb3NlZDtcblx0XHR9XG5cdFx0dW5zdWJzY3JpYmUoKSB7XG5cdFx0XHR0aGlzLl9jbG9zZWQgfHwgKHRoaXMuX2Nsb3NlZCA9ICEwLCB0aGlzLl91bnN1YnNjcmliZSgpKTtcblx0XHR9XG5cdH07XG5cdHZhciB2ID0gY2xhc3Mge1xuXHRcdF9wcm9kdWNlcjtcblx0XHRjb25zdHJ1Y3RvcihlKSB7XG5cdFx0XHR0aGlzLl9wcm9kdWNlciA9IGU7XG5cdFx0fVxuXHRcdHN1YnNjcmliZShlLCB0KSB7XG5cdFx0XHRjb25zdCBuID0gdHlwZW9mIGUgPT0gXCJmdW5jdGlvblwiID8geyBuZXh0OiBlIH0gOiBlID8/IHt9LCBzID0gbmV3IEFib3J0Q29udHJvbGxlcigpO1xuXHRcdFx0dD8uc2lnbmFsPy5hZGRFdmVudExpc3RlbmVyKFwiYWJvcnRcIiwgKCkgPT4gcy5hYm9ydCgpKTtcblx0XHRcdGxldCByID0gITAsIGk7XG5cdFx0XHRjb25zdCBvID0gKCkgPT4ge1xuXHRcdFx0XHRyID0gITEsIHMuYWJvcnQoKSwgaT8uKCk7XG5cdFx0XHR9LCBhID0ge1xuXHRcdFx0XHRuZXh0OiAoYykgPT4gciAmJiBuLm5leHQ/LihjKSxcblx0XHRcdFx0ZXJyb3I6IChjKSA9PiB7XG5cdFx0XHRcdFx0ciAmJiAobi5lcnJvcj8uKGMpLCBvKCkpO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRjb21wbGV0ZTogKCkgPT4ge1xuXHRcdFx0XHRcdHIgJiYgKG4uY29tcGxldGU/LigpLCBvKCkpO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRzaWduYWw6IHMuc2lnbmFsLFxuXHRcdFx0XHRnZXQgYWN0aXZlKCkge1xuXHRcdFx0XHRcdHJldHVybiByICYmICFzLnNpZ25hbC5hYm9ydGVkO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0aSA9IHRoaXMuX3Byb2R1Y2VyKGEpO1xuXHRcdFx0fSBjYXRjaCAoYykge1xuXHRcdFx0XHRhLmVycm9yKGMpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG5ldyBSZShvKTtcblx0XHR9XG5cdFx0cGlwZSguLi5lKSB7XG5cdFx0XHRyZXR1cm4gZS5yZWR1Y2UoKHQsIG4pID0+IG4odCksIHRoaXMpO1xuXHRcdH1cblx0fTtcblx0dmFyIF8gPSBjbGFzcyB7XG5cdFx0X3N1YnMgPSAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpO1xuXHRcdF9idWZmZXIgPSBbXTtcblx0XHRfbWF4QnVmZmVyO1xuXHRcdF9yZXBsYXk7XG5cdFx0Y29uc3RydWN0b3IoZSA9IHt9KSB7XG5cdFx0XHR0aGlzLl9tYXhCdWZmZXIgPSBlLmJ1ZmZlclNpemUgPz8gMCwgdGhpcy5fcmVwbGF5ID0gZS5yZXBsYXlPblN1YnNjcmliZSA/PyAhMTtcblx0XHR9XG5cdFx0bmV4dChlKSB7XG5cdFx0XHR0aGlzLl9tYXhCdWZmZXIgPiAwICYmICh0aGlzLl9idWZmZXIucHVzaChlKSwgdGhpcy5fYnVmZmVyLmxlbmd0aCA+IHRoaXMuX21heEJ1ZmZlciAmJiB0aGlzLl9idWZmZXIuc2hpZnQoKSk7XG5cdFx0XHRmb3IgKGNvbnN0IHQgb2YgdGhpcy5fc3VicykgdHJ5IHtcblx0XHRcdFx0dC5uZXh0Py4oZSk7XG5cdFx0XHR9IGNhdGNoIChuKSB7XG5cdFx0XHRcdHQuZXJyb3I/LihuKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZXJyb3IoZSkge1xuXHRcdFx0Zm9yIChjb25zdCB0IG9mIHRoaXMuX3N1YnMpIHQuZXJyb3I/LihlKTtcblx0XHR9XG5cdFx0Y29tcGxldGUoKSB7XG5cdFx0XHRmb3IgKGNvbnN0IGUgb2YgdGhpcy5fc3VicykgZS5jb21wbGV0ZT8uKCk7XG5cdFx0XHR0aGlzLl9zdWJzLmNsZWFyKCk7XG5cdFx0fVxuXHRcdHN1YnNjcmliZShlKSB7XG5cdFx0XHRjb25zdCB0ID0gdHlwZW9mIGUgPT0gXCJmdW5jdGlvblwiID8geyBuZXh0OiBlIH0gOiBlO1xuXHRcdFx0aWYgKHRoaXMuX3N1YnMuYWRkKHQpLCB0aGlzLl9yZXBsYXkpIGZvciAoY29uc3QgbiBvZiB0aGlzLl9idWZmZXIpIHRyeSB7XG5cdFx0XHRcdHQubmV4dD8uKG4pO1xuXHRcdFx0fSBjYXRjaCAocykge1xuXHRcdFx0XHR0LmVycm9yPy4ocyk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gbmV3IFJlKCgpID0+IHtcblx0XHRcdFx0dGhpcy5fc3Vicy5kZWxldGUodCk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0Z2V0VmFsdWUoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fYnVmZmVyLmF0KC0xKTtcblx0XHR9XG5cdFx0Z2V0QnVmZmVyKCkge1xuXHRcdFx0cmV0dXJuIFsuLi50aGlzLl9idWZmZXJdO1xuXHRcdH1cblx0XHRnZXQgc3Vic2NyaWJlckNvdW50KCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX3N1YnMuc2l6ZTtcblx0XHR9XG5cdH07XG5cdHZhciB1dCA9IChlKSA9PiAodCkgPT4gbmV3IHYoKG4pID0+IHtcblx0XHRjb25zdCBzID0gdC5zdWJzY3JpYmUoe1xuXHRcdFx0bmV4dDogKHIpID0+IGUocikgJiYgbi5uZXh0KHIpLFxuXHRcdFx0ZXJyb3I6IChyKSA9PiBuLmVycm9yKHIpLFxuXHRcdFx0Y29tcGxldGU6ICgpID0+IG4uY29tcGxldGUoKVxuXHRcdH0pO1xuXHRcdHJldHVybiAoKSA9PiBzLnVuc3Vic2NyaWJlKCk7XG5cdH0pO1xuXHRmdW5jdGlvbiBIKCkge1xuXHRcdGlmICh0eXBlb2YgZ2xvYmFsVGhpcy5EZW5vIDwgXCJ1XCIpIHJldHVybiBcImRlbm9cIjtcblx0XHRpZiAodHlwZW9mIGdsb2JhbFRoaXMucHJvY2VzcyA8IFwidVwiICYmIGdsb2JhbFRoaXMucHJvY2Vzcz8udmVyc2lvbnM/Lm5vZGUpIHJldHVybiBcIm5vZGVcIjtcblx0XHRjb25zdCBlID0gZ2xvYmFsVGhpcy5TZXJ2aWNlV29ya2VyR2xvYmFsU2NvcGUsIHQgPSBnbG9iYWxUaGlzLlNoYXJlZFdvcmtlckdsb2JhbFNjb3BlLCBuID0gZ2xvYmFsVGhpcy5EZWRpY2F0ZWRXb3JrZXJHbG9iYWxTY29wZTtcblx0XHRpZiAoZSAmJiBzZWxmIGluc3RhbmNlb2YgZSkgcmV0dXJuIFwic2VydmljZS13b3JrZXJcIjtcblx0XHRpZiAodCAmJiBzZWxmIGluc3RhbmNlb2YgdCkgcmV0dXJuIFwic2hhcmVkLXdvcmtlclwiO1xuXHRcdGlmIChuICYmIHNlbGYgaW5zdGFuY2VvZiBuKSByZXR1cm4gXCJ3b3JrZXJcIjtcblx0XHRpZiAodHlwZW9mIGNocm9tZSA8IFwidVwiICYmIGNocm9tZS5ydW50aW1lPy5pZCkge1xuXHRcdFx0aWYgKHR5cGVvZiBjaHJvbWUucnVudGltZS5nZXRCYWNrZ3JvdW5kUGFnZSA9PSBcImZ1bmN0aW9uXCIgfHwgY2hyb21lLnJ1bnRpbWUuZ2V0TWFuaWZlc3Q/LigpPy5iYWNrZ3JvdW5kPy5zZXJ2aWNlX3dvcmtlcikgcmV0dXJuIFwiY2hyb21lLWJhY2tncm91bmRcIjtcblx0XHRcdGlmICh0eXBlb2YgY2hyb21lLmRldnRvb2xzIDwgXCJ1XCIpIHJldHVybiBcImNocm9tZS1kZXZ0b29sc1wiO1xuXHRcdFx0aWYgKHR5cGVvZiBkb2N1bWVudCA8IFwidVwiICYmIGdsb2JhbFRoaXM/LmxvY2F0aW9uPy5wcm90b2NvbCA9PT0gXCJjaHJvbWUtZXh0ZW5zaW9uOlwiICYmIChjaHJvbWUuZXh0ZW5zaW9uPy5nZXRWaWV3cz8uKHsgdHlwZTogXCJwb3B1cFwiIH0pID8/IFtdKS5pbmNsdWRlcyhnbG9iYWxUaGlzKSkgcmV0dXJuIFwiY2hyb21lLXBvcHVwXCI7XG5cdFx0XHRpZiAodHlwZW9mIGRvY3VtZW50IDwgXCJ1XCIgJiYgZ2xvYmFsVGhpcz8ubG9jYXRpb24/LnByb3RvY29sICE9PSBcImNocm9tZS1leHRlbnNpb246XCIpIHJldHVybiBcImNocm9tZS1jb250ZW50XCI7XG5cdFx0fVxuXHRcdHJldHVybiB0eXBlb2YgZ2xvYmFsVGhpcyA8IFwidVwiICYmIHR5cGVvZiBkb2N1bWVudCA8IFwidVwiID8gXCJ3aW5kb3dcIiA6IFwidW5rbm93blwiO1xuXHR9XG5cdGZ1bmN0aW9uIEtlKGUpIHtcblx0XHRpZiAodHlwZW9mIFJUQ0RhdGFDaGFubmVsIDwgXCJ1XCIgJiYgZSBpbnN0YW5jZW9mIFJUQ0RhdGFDaGFubmVsKSByZXR1cm4gXCJydGMtZGF0YVwiO1xuXHRcdGNvbnN0IHQgPSBaKGUpO1xuXHRcdHJldHVybiB0ICYmIHQgIT09IFwiaW50ZXJuYWxcIiA/IHQgOiBlID09PSBzZWxmIHx8IGUgPT09IGdsb2JhbFRoaXMgfHwgZSA9PT0gXCJzZWxmXCIgPyBcInNlbGZcIiA6IFwiaW50ZXJuYWxcIjtcblx0fVxuXHRmdW5jdGlvbiBibihlKSB7XG5cdFx0aWYgKCFlKSByZXR1cm4gXCJ1bmtub3duXCI7XG5cdFx0aWYgKGUuY29udGV4dFR5cGUpIHJldHVybiBlLmNvbnRleHRUeXBlO1xuXHRcdGNvbnN0IHQgPSBlLnNlbmRlciA/PyBcIlwiO1xuXHRcdHJldHVybiB0LmluY2x1ZGVzKFwid29ya2VyXCIpID8gXCJ3b3JrZXJcIiA6IHQuaW5jbHVkZXMoXCJzd1wiKSB8fCB0LmluY2x1ZGVzKFwic2VydmljZVwiKSA/IFwic2VydmljZS13b3JrZXJcIiA6IHQuaW5jbHVkZXMoXCJjaHJvbWVcIikgfHwgdC5pbmNsdWRlcyhcImNyeFwiKSA/IFwiY2hyb21lLWNvbnRlbnRcIiA6IHQuaW5jbHVkZXMoXCJiYWNrZ3JvdW5kXCIpID8gXCJjaHJvbWUtYmFja2dyb3VuZFwiIDogXCJ1bmtub3duXCI7XG5cdH1cblx0dmFyIHluID0ge1xuXHRcdGdldDogKGUsIHQpID0+IFJlZmxlY3QuZ2V0KGUsIHQpLFxuXHRcdHNldDogKGUsIHQsIG4pID0+IFJlZmxlY3Quc2V0KGUsIHQsIG4pLFxuXHRcdGhhczogKGUsIHQpID0+IFJlZmxlY3QuaGFzKGUsIHQpLFxuXHRcdGFwcGx5OiAoZSwgdCwgbikgPT4gUmVmbGVjdC5hcHBseShlLCB0LCBuKSxcblx0XHRjb25zdHJ1Y3Q6IChlLCB0KSA9PiBSZWZsZWN0LmNvbnN0cnVjdChlLCB0KSxcblx0XHRkZWxldGVQcm9wZXJ0eTogKGUsIHQpID0+IFJlZmxlY3QuZGVsZXRlUHJvcGVydHkoZSwgdCksXG5cdFx0b3duS2V5czogKGUpID0+IFJlZmxlY3Qub3duS2V5cyhlKSxcblx0XHRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I6IChlLCB0KSA9PiBSZWZsZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihlLCB0KSxcblx0XHRnZXRQcm90b3R5cGVPZjogKGUpID0+IFJlZmxlY3QuZ2V0UHJvdG90eXBlT2YoZSksXG5cdFx0c2V0UHJvdG90eXBlT2Y6IChlLCB0KSA9PiBSZWZsZWN0LnNldFByb3RvdHlwZU9mKGUsIHQpLFxuXHRcdGlzRXh0ZW5zaWJsZTogKGUpID0+IFJlZmxlY3QuaXNFeHRlbnNpYmxlKGUpLFxuXHRcdHByZXZlbnRFeHRlbnNpb25zOiAoZSkgPT4gUmVmbGVjdC5wcmV2ZW50RXh0ZW5zaW9ucyhlKVxuXHR9O1xuXHR2YXIgcHQgPSAvKiBAX19QVVJFX18gKi8gU3ltYm9sLmZvcihcInVuaWZvcm0ucHJveHlcIik7XG5cdHZhciBfdCA9IC8qIEBfX1BVUkVfXyAqLyBTeW1ib2wuZm9yKFwidW5pZm9ybS5wcm94eS5pbnRlcm5hbHNcIik7XG5cdHZhciBDbiA9IGNsYXNzIHtcblx0XHRfaW52b2tlcjtcblx0XHRfY29uZmlnO1xuXHRcdF9jaGlsZENhY2hlID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0XHRjb25zdHJ1Y3RvcihlLCB0KSB7XG5cdFx0XHR0aGlzLl9pbnZva2VyID0gZSwgdGhpcy5fY29uZmlnID0ge1xuXHRcdFx0XHRjaGFubmVsOiB0LmNoYW5uZWwsXG5cdFx0XHRcdGJhc2VQYXRoOiB0LmJhc2VQYXRoID8/IFtdLFxuXHRcdFx0XHRpbnZva2VyOiBlLFxuXHRcdFx0XHRjYWNoZTogdC5jYWNoZSA/PyAhMCxcblx0XHRcdFx0dGltZW91dDogdC50aW1lb3V0ID8/IDNlNFxuXHRcdFx0fTtcblx0XHR9XG5cdFx0Z2V0KGUsIHQsIG4pIHtcblx0XHRcdGNvbnN0IHMgPSBTdHJpbmcodCk7XG5cdFx0XHRpZiAodCA9PT0gcHQpIHJldHVybiAhMDtcblx0XHRcdGlmICh0ID09PSBfdCkgcmV0dXJuIHRoaXMuX2NvbmZpZztcblx0XHRcdGlmICh0ID09PSBxbikgcmV0dXJuICEwO1xuXHRcdFx0aWYgKHQgPT09IFEpIHJldHVybiB0aGlzLl9nZXREZXNjcmlwdG9yKCk7XG5cdFx0XHRpZiAodCA9PT0gXCJ0aGVuXCIgfHwgdCA9PT0gXCJjYXRjaFwiIHx8IHQgPT09IFwiZmluYWxseVwiIHx8IHR5cGVvZiB0ID09IFwic3ltYm9sXCIpIHJldHVybjtcblx0XHRcdGlmICh0ID09PSBcIiRwYXRoXCIpIHJldHVybiB0aGlzLl9jb25maWcuYmFzZVBhdGg7XG5cdFx0XHRpZiAodCA9PT0gXCIkY2hhbm5lbFwiKSByZXR1cm4gdGhpcy5fY29uZmlnLmNoYW5uZWw7XG5cdFx0XHRpZiAodCA9PT0gXCIkZGVzY3JpcHRvclwiKSByZXR1cm4gdGhpcy5fZ2V0RGVzY3JpcHRvcigpO1xuXHRcdFx0aWYgKHQgPT09IFwiJGludm9rZVwiKSByZXR1cm4gdGhpcy5faW52b2tlcjtcblx0XHRcdGNvbnN0IHIgPSBbLi4udGhpcy5fY29uZmlnLmJhc2VQYXRoLCBzXTtcblx0XHRcdGlmICh0aGlzLl9jb25maWcuY2FjaGUgJiYgdGhpcy5fY2hpbGRDYWNoZS5oYXMocykpIHJldHVybiB0aGlzLl9jaGlsZENhY2hlLmdldChzKTtcblx0XHRcdGNvbnN0IGkgPSBlZSh0aGlzLl9pbnZva2VyLCB7XG5cdFx0XHRcdC4uLnRoaXMuX2NvbmZpZyxcblx0XHRcdFx0YmFzZVBhdGg6IHJcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIHRoaXMuX2NvbmZpZy5jYWNoZSAmJiB0aGlzLl9jaGlsZENhY2hlLnNldChzLCBpKSwgaTtcblx0XHR9XG5cdFx0c2V0KGUsIHQsIG4sIHMpIHtcblx0XHRcdHJldHVybiB0eXBlb2YgdCA9PSBcInN5bWJvbFwiIHx8IHRoaXMuX2ludm9rZXIoZC5TRVQsIFsuLi50aGlzLl9jb25maWcuYmFzZVBhdGgsIFN0cmluZyh0KV0sIFtuXSksICEwO1xuXHRcdH1cblx0XHRhcHBseShlLCB0LCBuKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5faW52b2tlcihkLkFQUExZLCB0aGlzLl9jb25maWcuYmFzZVBhdGgsIFtuXSk7XG5cdFx0fVxuXHRcdGNvbnN0cnVjdChlLCB0LCBuKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5faW52b2tlcihkLkNPTlNUUlVDVCwgdGhpcy5fY29uZmlnLmJhc2VQYXRoLCBbdF0pO1xuXHRcdH1cblx0XHRoYXMoZSwgdCkge1xuXHRcdFx0cmV0dXJuIHR5cGVvZiB0ID09IFwic3ltYm9sXCIgPyAhMSA6IHRoaXMuX2ludm9rZXIoZC5IQVMsIHRoaXMuX2NvbmZpZy5iYXNlUGF0aCwgW3RdKTtcblx0XHR9XG5cdFx0ZGVsZXRlUHJvcGVydHkoZSwgdCkge1xuXHRcdFx0cmV0dXJuIHR5cGVvZiB0ID09IFwic3ltYm9sXCIgPyAhMCA6IHRoaXMuX2ludm9rZXIoZC5ERUxFVEVfUFJPUEVSVFksIFsuLi50aGlzLl9jb25maWcuYmFzZVBhdGgsIFN0cmluZyh0KV0sIFtdKTtcblx0XHR9XG5cdFx0b3duS2V5cyhlKSB7XG5cdFx0XHRyZXR1cm4gW107XG5cdFx0fVxuXHRcdGdldE93blByb3BlcnR5RGVzY3JpcHRvcihlLCB0KSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRjb25maWd1cmFibGU6ICEwLFxuXHRcdFx0XHRlbnVtZXJhYmxlOiAhMCxcblx0XHRcdFx0d3JpdGFibGU6ICEwXG5cdFx0XHR9O1xuXHRcdH1cblx0XHRnZXRQcm90b3R5cGVPZihlKSB7XG5cdFx0XHRyZXR1cm4gRnVuY3Rpb24ucHJvdG90eXBlO1xuXHRcdH1cblx0XHRzZXRQcm90b3R5cGVPZihlLCB0KSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5faW52b2tlcihkLlNFVF9QUk9UT1RZUEVfT0YsIHRoaXMuX2NvbmZpZy5iYXNlUGF0aCwgW3RdKTtcblx0XHR9XG5cdFx0aXNFeHRlbnNpYmxlKGUpIHtcblx0XHRcdHJldHVybiAhMDtcblx0XHR9XG5cdFx0cHJldmVudEV4dGVuc2lvbnMoZSkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2ludm9rZXIoZC5QUkVWRU5UX0VYVEVOU0lPTlMsIHRoaXMuX2NvbmZpZy5iYXNlUGF0aCwgW10pO1xuXHRcdH1cblx0XHRfZ2V0RGVzY3JpcHRvcigpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHBhdGg6IHRoaXMuX2NvbmZpZy5iYXNlUGF0aCxcblx0XHRcdFx0Y2hhbm5lbDogdGhpcy5fY29uZmlnLmNoYW5uZWwsXG5cdFx0XHRcdHByaW1pdGl2ZTogITFcblx0XHRcdH07XG5cdFx0fVxuXHR9O1xuXHRmdW5jdGlvbiBlZShlLCB0KSB7XG5cdFx0Y29uc3QgbiA9IGZ1bmN0aW9uKCkge30sIHMgPSBuZXcgQ24oZSwgdCk7XG5cdFx0cmV0dXJuIG5ldyBQcm94eShuLCBzKTtcblx0fVxuXHRmdW5jdGlvbiBtdChlLCB0LCBuKSB7XG5cdFx0aWYgKCFlIHx8IHR5cGVvZiBlICE9IFwib2JqZWN0XCIgfHwgZS5wcmltaXRpdmUpIHJldHVybiBlO1xuXHRcdGNvbnN0IHMgPSBZZS5nZXQoZSk7XG5cdFx0aWYgKHMpIHJldHVybiBzO1xuXHRcdGNvbnN0IHIgPSBlZSh0LCB7XG5cdFx0XHRjaGFubmVsOiBuID8/IGUuY2hhbm5lbCA/PyBcInVua25vd25cIixcblx0XHRcdGJhc2VQYXRoOiBlLnBhdGggPz8gW11cblx0XHR9KTtcblx0XHRyZXR1cm4gWWUuc2V0KGUsIHIpLCBkZS5zZXQociwgZSksIHI7XG5cdH1cblx0ZnVuY3Rpb24geG4oZSwgdCkge1xuXHRcdHJldHVybiBMbihlLCB0KTtcblx0fVxuXHRmdW5jdGlvbiBrbihlLCB0ID0gW10pIHtcblx0XHRyZXR1cm4gZWUoKHMsIHIsIGkpID0+IGUucmVxdWVzdCh7XG5cdFx0XHRpZDogJGUoKSxcblx0XHRcdGNoYW5uZWw6IGUuY2hhbm5lbE5hbWUsXG5cdFx0XHRzZW5kZXI6IGUuc2VuZGVySWQgPz8gXCJwcm94eVwiLFxuXHRcdFx0dHlwZTogXCJyZXF1ZXN0XCIsXG5cdFx0XHRwYXlsb2FkOiB7XG5cdFx0XHRcdGFjdGlvbjogcyxcblx0XHRcdFx0cGF0aDogcixcblx0XHRcdFx0YXJnczogaVxuXHRcdFx0fVxuXHRcdH0pLCB7XG5cdFx0XHRjaGFubmVsOiBlLmNoYW5uZWxOYW1lLFxuXHRcdFx0YmFzZVBhdGg6IHRcblx0XHR9KTtcblx0fVxuXHR2YXIgRW4gPSBtdDtcblx0ZnVuY3Rpb24gSW4oZSkge1xuXHRcdHJldHVybiBbXG5cdFx0XHRlLmxvY2FsQ2hhbm5lbCxcblx0XHRcdGUucmVtb3RlQ2hhbm5lbCxcblx0XHRcdGUuc2VuZGVyLFxuXHRcdFx0ZS50cmFuc3BvcnRUeXBlLFxuXHRcdFx0ZS5kaXJlY3Rpb25cblx0XHRdLmpvaW4oXCI6OlwiKTtcblx0fVxuXHRmdW5jdGlvbiBUbihlLCB0ID0ge30pIHtcblx0XHRjb25zdCBuID0gdC5pbmNsdWRlQ2xvc2VkID8/ICExLCBzID0gdC5zdGF0dXMgPz8gKG4gPyB2b2lkIDAgOiBcImFjdGl2ZVwiKTtcblx0XHRyZXR1cm4gWy4uLmVdLmZpbHRlcigocikgPT4gIShzICYmIHIuc3RhdHVzICE9PSBzIHx8IHQuY2hhbm5lbCAmJiByLmxvY2FsQ2hhbm5lbCAhPT0gdC5jaGFubmVsICYmIHIucmVtb3RlQ2hhbm5lbCAhPT0gdC5jaGFubmVsIHx8IHQubG9jYWxDaGFubmVsICYmIHIubG9jYWxDaGFubmVsICE9PSB0LmxvY2FsQ2hhbm5lbCB8fCB0LnJlbW90ZUNoYW5uZWwgJiYgci5yZW1vdGVDaGFubmVsICE9PSB0LnJlbW90ZUNoYW5uZWwgfHwgdC5zZW5kZXIgJiYgci5zZW5kZXIgIT09IHQuc2VuZGVyIHx8IHQudHJhbnNwb3J0VHlwZSAmJiByLnRyYW5zcG9ydFR5cGUgIT09IHQudHJhbnNwb3J0VHlwZSB8fCB0LmRpcmVjdGlvbiAmJiByLmRpcmVjdGlvbiAhPT0gdC5kaXJlY3Rpb24pKS5zb3J0KChyLCBpKSA9PiBpLnVwZGF0ZWRBdCAtIHIudXBkYXRlZEF0KTtcblx0fVxuXHR2YXIgYnQgPSBjbGFzcyB7XG5cdFx0X2NyZWF0ZUlkO1xuXHRcdF9lbWl0RXZlbnQ7XG5cdFx0X2Nvbm5lY3Rpb25zID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0XHRjb25zdHJ1Y3RvcihlLCB0KSB7XG5cdFx0XHR0aGlzLl9jcmVhdGVJZCA9IGUsIHRoaXMuX2VtaXRFdmVudCA9IHQ7XG5cdFx0fVxuXHRcdHJlZ2lzdGVyKGUpIHtcblx0XHRcdGNvbnN0IHQgPSBJbihlKSwgbiA9IERhdGUubm93KCksIHMgPSB0aGlzLl9jb25uZWN0aW9ucy5nZXQodCk7XG5cdFx0XHRpZiAocykgcmV0dXJuIHMudXBkYXRlZEF0ID0gbiwgcy5zdGF0dXMgPSBcImFjdGl2ZVwiLCBzLm1ldGFkYXRhID0ge1xuXHRcdFx0XHQuLi5zLm1ldGFkYXRhLFxuXHRcdFx0XHQuLi5lLm1ldGFkYXRhXG5cdFx0XHR9LCBzO1xuXHRcdFx0Y29uc3QgciA9IHtcblx0XHRcdFx0aWQ6IHRoaXMuX2NyZWF0ZUlkKCksXG5cdFx0XHRcdGxvY2FsQ2hhbm5lbDogZS5sb2NhbENoYW5uZWwsXG5cdFx0XHRcdHJlbW90ZUNoYW5uZWw6IGUucmVtb3RlQ2hhbm5lbCxcblx0XHRcdFx0c2VuZGVyOiBlLnNlbmRlcixcblx0XHRcdFx0dHJhbnNwb3J0VHlwZTogZS50cmFuc3BvcnRUeXBlLFxuXHRcdFx0XHRkaXJlY3Rpb246IGUuZGlyZWN0aW9uLFxuXHRcdFx0XHRzdGF0dXM6IFwiYWN0aXZlXCIsXG5cdFx0XHRcdGNyZWF0ZWRBdDogbixcblx0XHRcdFx0dXBkYXRlZEF0OiBuLFxuXHRcdFx0XHRtZXRhZGF0YTogZS5tZXRhZGF0YVxuXHRcdFx0fTtcblx0XHRcdHJldHVybiB0aGlzLl9jb25uZWN0aW9ucy5zZXQodCwgciksIHRoaXMuX2VtaXRFdmVudD8uKHtcblx0XHRcdFx0dHlwZTogXCJjb25uZWN0ZWRcIixcblx0XHRcdFx0Y29ubmVjdGlvbjogcixcblx0XHRcdFx0dGltZXN0YW1wOiBuXG5cdFx0XHR9KSwgcjtcblx0XHR9XG5cdFx0bWFya05vdGlmaWVkKGUsIHQpIHtcblx0XHRcdGNvbnN0IG4gPSBEYXRlLm5vdygpO1xuXHRcdFx0ZS5sYXN0Tm90aWZ5QXQgPSBuLCBlLnVwZGF0ZWRBdCA9IG4sIHRoaXMuX2VtaXRFdmVudD8uKHtcblx0XHRcdFx0dHlwZTogXCJub3RpZmllZFwiLFxuXHRcdFx0XHRjb25uZWN0aW9uOiBlLFxuXHRcdFx0XHR0aW1lc3RhbXA6IG4sXG5cdFx0XHRcdHBheWxvYWQ6IHRcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRjbG9zZUJ5Q2hhbm5lbChlKSB7XG5cdFx0XHRjb25zdCB0ID0gRGF0ZS5ub3coKTtcblx0XHRcdGZvciAoY29uc3QgbiBvZiB0aGlzLl9jb25uZWN0aW9ucy52YWx1ZXMoKSkgbi5sb2NhbENoYW5uZWwgIT09IGUgJiYgbi5yZW1vdGVDaGFubmVsICE9PSBlIHx8IG4uc3RhdHVzICE9PSBcImNsb3NlZFwiICYmIChuLnN0YXR1cyA9IFwiY2xvc2VkXCIsIG4udXBkYXRlZEF0ID0gdCwgdGhpcy5fZW1pdEV2ZW50Py4oe1xuXHRcdFx0XHR0eXBlOiBcImRpc2Nvbm5lY3RlZFwiLFxuXHRcdFx0XHRjb25uZWN0aW9uOiBuLFxuXHRcdFx0XHR0aW1lc3RhbXA6IHRcblx0XHRcdH0pKTtcblx0XHR9XG5cdFx0Y2xvc2VBbGwoKSB7XG5cdFx0XHRjb25zdCBlID0gRGF0ZS5ub3coKTtcblx0XHRcdGZvciAoY29uc3QgdCBvZiB0aGlzLl9jb25uZWN0aW9ucy52YWx1ZXMoKSkgdC5zdGF0dXMgIT09IFwiY2xvc2VkXCIgJiYgKHQuc3RhdHVzID0gXCJjbG9zZWRcIiwgdC51cGRhdGVkQXQgPSBlLCB0aGlzLl9lbWl0RXZlbnQ/Lih7XG5cdFx0XHRcdHR5cGU6IFwiZGlzY29ubmVjdGVkXCIsXG5cdFx0XHRcdGNvbm5lY3Rpb246IHQsXG5cdFx0XHRcdHRpbWVzdGFtcDogZVxuXHRcdFx0fSkpO1xuXHRcdH1cblx0XHRxdWVyeShlID0ge30pIHtcblx0XHRcdHJldHVybiBUbih0aGlzLl9jb25uZWN0aW9ucy52YWx1ZXMoKSwgZSk7XG5cdFx0fVxuXHRcdHZhbHVlcygpIHtcblx0XHRcdHJldHVybiBbLi4udGhpcy5fY29ubmVjdGlvbnMudmFsdWVzKCldO1xuXHRcdH1cblx0XHRjbGVhcigpIHtcblx0XHRcdHRoaXMuX2Nvbm5lY3Rpb25zLmNsZWFyKCk7XG5cdFx0fVxuXHR9O1xuXHR2YXIgeXQgPSBjbGFzcyB7XG5cdFx0X25hbWU7XG5cdFx0X2NvbnRleHRUeXBlO1xuXHRcdF9jb25maWc7XG5cdFx0X3RyYW5zcG9ydHMgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuXHRcdF9kZWZhdWx0VHJhbnNwb3J0ID0gbnVsbDtcblx0XHRfY29ubmVjdGlvbkV2ZW50cyA9IG5ldyBfKHsgYnVmZmVyU2l6ZTogMjAwIH0pO1xuXHRcdF9jb25uZWN0aW9uUmVnaXN0cnkgPSBuZXcgYnQoKCkgPT4gJGUoKSwgKGUpID0+IHRoaXMuX2Nvbm5lY3Rpb25FdmVudHMubmV4dChlKSk7XG5cdFx0X3BlbmRpbmcgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuXHRcdF9zdWJzY3JpcHRpb25zID0gW107XG5cdFx0X2luYm91bmQgPSBuZXcgXyh7IGJ1ZmZlclNpemU6IDEwMCB9KTtcblx0XHRfb3V0Ym91bmQgPSBuZXcgXyh7IGJ1ZmZlclNpemU6IDEwMCB9KTtcblx0XHRfaW52b2NhdGlvbnMgPSBuZXcgXyh7IGJ1ZmZlclNpemU6IDEwMCB9KTtcblx0XHRfcmVzcG9uc2VzID0gbmV3IF8oeyBidWZmZXJTaXplOiAxMDAgfSk7XG5cdFx0X2V4cG9zZWQgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuXHRcdF9wcm94eUNhY2hlID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG5cdFx0X19nZXRQcml2YXRlKGUpIHtcblx0XHRcdHJldHVybiB0aGlzW2VdO1xuXHRcdH1cblx0XHRfX3NldFByaXZhdGUoZSwgdCkge1xuXHRcdFx0dGhpc1tlXSA9IHQ7XG5cdFx0fVxuXHRcdGNvbnN0cnVjdG9yKGUpIHtcblx0XHRcdGNvbnN0IHQgPSB0eXBlb2YgZSA9PSBcInN0cmluZ1wiID8geyBuYW1lOiBlIH0gOiBlO1xuXHRcdFx0dGhpcy5fbmFtZSA9IHQubmFtZSwgdGhpcy5fY29udGV4dFR5cGUgPSB0LmF1dG9EZXRlY3QgIT09ICExID8gSCgpIDogXCJ1bmtub3duXCIsIHRoaXMuX2NvbmZpZyA9IHtcblx0XHRcdFx0bmFtZTogdC5uYW1lLFxuXHRcdFx0XHRhdXRvRGV0ZWN0OiB0LmF1dG9EZXRlY3QgPz8gITAsXG5cdFx0XHRcdHRpbWVvdXQ6IHQudGltZW91dCA/PyAzZTQsXG5cdFx0XHRcdHJlZmxlY3Q6IHQucmVmbGVjdCA/PyB5bixcblx0XHRcdFx0YnVmZmVyU2l6ZTogdC5idWZmZXJTaXplID8/IDEwMCxcblx0XHRcdFx0YXV0b0xpc3RlbjogdC5hdXRvTGlzdGVuID8/ICEwXG5cdFx0XHR9LCB0aGlzLl9jb25maWcuYXV0b0xpc3RlbiAmJiB0aGlzLl9pc1dvcmtlckNvbnRleHQoKSAmJiB0aGlzLmxpc3RlbihzZWxmKTtcblx0XHR9XG5cdFx0Y29ubmVjdChlLCB0ID0ge30pIHtcblx0XHRcdGNvbnN0IG4gPSBLZShlKSwgcyA9IHQudGFyZ2V0Q2hhbm5lbCA/PyB0aGlzLl9pbmZlclRhcmdldENoYW5uZWwoZSwgbiksIHIgPSB0aGlzLl9jcmVhdGVUcmFuc3BvcnRCaW5kaW5nKGUsIG4sIHMsIHQpO1xuXHRcdFx0dGhpcy5fdHJhbnNwb3J0cy5zZXQocywgciksIHRoaXMuX2RlZmF1bHRUcmFuc3BvcnQgfHwgKHRoaXMuX2RlZmF1bHRUcmFuc3BvcnQgPSByKTtcblx0XHRcdGNvbnN0IGkgPSB0aGlzLl9yZWdpc3RlckNvbm5lY3Rpb24oe1xuXHRcdFx0XHRsb2NhbENoYW5uZWw6IHRoaXMuX25hbWUsXG5cdFx0XHRcdHJlbW90ZUNoYW5uZWw6IHMsXG5cdFx0XHRcdHNlbmRlcjogdGhpcy5fbmFtZSxcblx0XHRcdFx0dHJhbnNwb3J0VHlwZTogbixcblx0XHRcdFx0ZGlyZWN0aW9uOiBcIm91dGdvaW5nXCIsXG5cdFx0XHRcdG1ldGFkYXRhOiB7IHBoYXNlOiBcImNvbm5lY3RcIiB9XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiB0aGlzLl9lbWl0Q29ubmVjdGlvblNpZ25hbChyLCBcImNvbm5lY3RcIiwge1xuXHRcdFx0XHRjb25uZWN0aW9uSWQ6IGkuaWQsXG5cdFx0XHRcdGZyb206IHRoaXMuX25hbWUsXG5cdFx0XHRcdHRvOiBzXG5cdFx0XHR9KSwgdGhpcztcblx0XHR9XG5cdFx0bGlzdGVuKGUsIHQgPSB7fSkge1xuXHRcdFx0Y29uc3QgbiA9IEtlKGUpLCBzID0gdC50YXJnZXRDaGFubmVsID8/IHRoaXMuX2luZmVyVGFyZ2V0Q2hhbm5lbChlLCBuKSwgciA9IChvKSA9PiB0aGlzLl9oYW5kbGVJbmNvbWluZyhvKSwgaSA9IHRoaXMuX3JlZ2lzdGVyQ29ubmVjdGlvbih7XG5cdFx0XHRcdGxvY2FsQ2hhbm5lbDogdGhpcy5fbmFtZSxcblx0XHRcdFx0cmVtb3RlQ2hhbm5lbDogcyxcblx0XHRcdFx0c2VuZGVyOiBzLFxuXHRcdFx0XHR0cmFuc3BvcnRUeXBlOiBuLFxuXHRcdFx0XHRkaXJlY3Rpb246IFwiaW5jb21pbmdcIixcblx0XHRcdFx0bWV0YWRhdGE6IHsgcGhhc2U6IFwibGlzdGVuXCIgfVxuXHRcdFx0fSk7XG5cdFx0XHRzd2l0Y2ggKG4pIHtcblx0XHRcdFx0Y2FzZSBcIndvcmtlclwiOlxuXHRcdFx0XHRjYXNlIFwibWVzc2FnZS1wb3J0XCI6XG5cdFx0XHRcdGNhc2UgXCJicm9hZGNhc3RcIjpcblx0XHRcdFx0XHR0LmF1dG9TdGFydCAhPT0gITEgJiYgZS5zdGFydCAmJiBlLnN0YXJ0KCksIGUuYWRkRXZlbnRMaXN0ZW5lcj8uKFwibWVzc2FnZVwiLCAoKG8pID0+IHIoby5kYXRhKSkpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwid2Vic29ja2V0XCI6XG5cdFx0XHRcdFx0ZS5hZGRFdmVudExpc3RlbmVyPy4oXCJtZXNzYWdlXCIsICgobykgPT4ge1xuXHRcdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdFx0cihKU09OLnBhcnNlKG8uZGF0YSkpO1xuXHRcdFx0XHRcdFx0fSBjYXRjaCB7fVxuXHRcdFx0XHRcdH0pKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcImNocm9tZS1ydW50aW1lXCI6XG5cdFx0XHRcdFx0Y2hyb21lLnJ1bnRpbWUub25NZXNzYWdlPy5hZGRMaXN0ZW5lcj8uKChvLCBhLCBjKSA9PiAocihvKSwgITApKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcImNocm9tZS10YWJzXCI6XG5cdFx0XHRcdFx0Y2hyb21lLnJ1bnRpbWUub25NZXNzYWdlPy5hZGRMaXN0ZW5lcj8uKChvLCBhKSA9PiB0LnRhYklkICE9IG51bGwgJiYgYT8udGFiPy5pZCAhPT0gdC50YWJJZCA/ICExIDogKHIobyksICEwKSk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJjaHJvbWUtcG9ydFwiOlxuXHRcdFx0XHRcdGU/Lm9uTWVzc2FnZT8uYWRkTGlzdGVuZXI/LigobykgPT4ge1xuXHRcdFx0XHRcdFx0cihvKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcImNocm9tZS1leHRlcm5hbFwiOlxuXHRcdFx0XHRcdGNocm9tZS5ydW50aW1lLm9uTWVzc2FnZUV4dGVybmFsPy5hZGRMaXN0ZW5lcj8uKChvKSA9PiAocihvKSwgITApKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcInNlbGZcIjpcblx0XHRcdFx0XHRhZGRFdmVudExpc3RlbmVyPy4oXCJtZXNzYWdlXCIsICgobykgPT4gcihvLmRhdGEpKSk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGRlZmF1bHQ6IHQub25NZXNzYWdlICYmIHQub25NZXNzYWdlKHIpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXMuX3NlbmRTaWduYWxUb1RhcmdldChlLCBuLCB7XG5cdFx0XHRcdGNvbm5lY3Rpb25JZDogaS5pZCxcblx0XHRcdFx0ZnJvbTogdGhpcy5fbmFtZSxcblx0XHRcdFx0dG86IHMsXG5cdFx0XHRcdHRhYklkOiB0LnRhYklkLFxuXHRcdFx0XHRleHRlcm5hbElkOiB0LmV4dGVybmFsSWRcblx0XHRcdH0sIFwibm90aWZ5XCIpLCB0aGlzO1xuXHRcdH1cblx0XHRhdHRhY2goZSwgdCA9IHt9KSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5jb25uZWN0KGUsIHQpO1xuXHRcdH1cblx0XHRleHBvc2UoZSwgdCkge1xuXHRcdFx0Y29uc3QgbiA9IFtlXTtcblx0XHRcdHJldHVybiBmZShuLCB0KSwgdGhpcy5fZXhwb3NlZC5zZXQoZSwge1xuXHRcdFx0XHRuYW1lOiBlLFxuXHRcdFx0XHRvYmo6IHQsXG5cdFx0XHRcdHBhdGg6IG5cblx0XHRcdH0pLCB0aGlzO1xuXHRcdH1cblx0XHRleHBvc2VBbGwoZSkge1xuXHRcdFx0Zm9yIChjb25zdCBbdCwgbl0gb2YgT2JqZWN0LmVudHJpZXMoZSkpIHRoaXMuZXhwb3NlKHQsIG4pO1xuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fVxuXHRcdGFzeW5jIGltcG9ydChlLCB0KSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5pbnZva2UodCA/PyB0aGlzLl9nZXREZWZhdWx0VGFyZ2V0KCksIGQuSU1QT1JULCBbXSwgW2VdKTtcblx0XHR9XG5cdFx0aW52b2tlKGUsIHQsIG4sIHMgPSBbXSkge1xuXHRcdFx0Y29uc3QgciA9ICRlKCksIGkgPSBQcm9taXNlLndpdGhSZXNvbHZlcnMoKTtcblx0XHRcdHRoaXMuX3BlbmRpbmcuc2V0KHIsIGkpO1xuXHRcdFx0Y29uc3QgbyA9IHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHR0aGlzLl9wZW5kaW5nLmhhcyhyKSAmJiAodGhpcy5fcGVuZGluZy5kZWxldGUociksIGkucmVqZWN0KC8qIEBfX1BVUkVfXyAqLyBuZXcgRXJyb3IoYFJlcXVlc3QgdGltZW91dDogJHt0fSBvbiAke24uam9pbihcIi5cIil9YCkpKTtcblx0XHRcdH0sIHRoaXMuX2NvbmZpZy50aW1lb3V0KSwgYSA9IHtcblx0XHRcdFx0aWQ6IHIsXG5cdFx0XHRcdGNoYW5uZWw6IGUsXG5cdFx0XHRcdHNlbmRlcjogdGhpcy5fbmFtZSxcblx0XHRcdFx0dHlwZTogXCJyZXF1ZXN0XCIsXG5cdFx0XHRcdHBheWxvYWQ6IHtcblx0XHRcdFx0XHRjaGFubmVsOiBlLFxuXHRcdFx0XHRcdHNlbmRlcjogdGhpcy5fbmFtZSxcblx0XHRcdFx0XHRhY3Rpb246IHQsXG5cdFx0XHRcdFx0cGF0aDogbixcblx0XHRcdFx0XHRhcmdzOiBzXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHRpbWVzdGFtcDogRGF0ZS5ub3coKVxuXHRcdFx0fTtcblx0XHRcdHJldHVybiB0aGlzLl9zZW5kKGUsIGEpLCB0aGlzLl9vdXRib3VuZC5uZXh0KGEpLCBpLnByb21pc2UuZmluYWxseSgoKSA9PiBjbGVhclRpbWVvdXQobykpO1xuXHRcdH1cblx0XHRnZXQoZSwgdCwgbikge1xuXHRcdFx0cmV0dXJuIHRoaXMuaW52b2tlKGUsIGQuR0VULCB0LCBbbl0pO1xuXHRcdH1cblx0XHRzZXQoZSwgdCwgbiwgcykge1xuXHRcdFx0cmV0dXJuIHRoaXMuaW52b2tlKGUsIGQuU0VULCB0LCBbbiwgc10pO1xuXHRcdH1cblx0XHRjYWxsKGUsIHQsIG4gPSBbXSkge1xuXHRcdFx0cmV0dXJuIHRoaXMuaW52b2tlKGUsIGQuQVBQTFksIHQsIFtuXSk7XG5cdFx0fVxuXHRcdGNvbnN0cnVjdChlLCB0LCBuID0gW10pIHtcblx0XHRcdHJldHVybiB0aGlzLmludm9rZShlLCBkLkNPTlNUUlVDVCwgdCwgW25dKTtcblx0XHR9XG5cdFx0cHJveHkoZSwgdCA9IFtdKSB7XG5cdFx0XHRjb25zdCBuID0gZSA/PyB0aGlzLl9nZXREZWZhdWx0VGFyZ2V0KCk7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY3JlYXRlUHJveHkobiwgdCk7XG5cdFx0fVxuXHRcdHJlbW90ZShlLCB0KSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5wcm94eSh0LCBbZV0pO1xuXHRcdH1cblx0XHR3cmFwRGVzY3JpcHRvcihlLCB0KSB7XG5cdFx0XHRyZXR1cm4gbXQoZSwgKHMsIHIsIGkpID0+IHtcblx0XHRcdFx0Y29uc3QgbyA9IHQgPz8gZT8uY2hhbm5lbCA/PyB0aGlzLl9nZXREZWZhdWx0VGFyZ2V0KCk7XG5cdFx0XHRcdHJldHVybiB0aGlzLmludm9rZShvLCBzLCByLCBpKTtcblx0XHRcdH0sIHQgPz8gZT8uY2hhbm5lbCA/PyB0aGlzLl9nZXREZWZhdWx0VGFyZ2V0KCkpO1xuXHRcdH1cblx0XHRzdWJzY3JpYmUoZSkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2luYm91bmQuc3Vic2NyaWJlKGUpO1xuXHRcdH1cblx0XHRuZXh0KGUpIHtcblx0XHRcdHRoaXMuX3NlbmQoZS5jaGFubmVsLCBlKSwgdGhpcy5fb3V0Ym91bmQubmV4dChlKTtcblx0XHR9XG5cdFx0ZW1pdChlLCB0LCBuKSB7XG5cdFx0XHRjb25zdCBzID0ge1xuXHRcdFx0XHRpZDogJGUoKSxcblx0XHRcdFx0Y2hhbm5lbDogZSxcblx0XHRcdFx0c2VuZGVyOiB0aGlzLl9uYW1lLFxuXHRcdFx0XHR0eXBlOiBcImV2ZW50XCIsXG5cdFx0XHRcdHBheWxvYWQ6IHtcblx0XHRcdFx0XHR0eXBlOiB0LFxuXHRcdFx0XHRcdGRhdGE6IG5cblx0XHRcdFx0fSxcblx0XHRcdFx0dGltZXN0YW1wOiBEYXRlLm5vdygpXG5cdFx0XHR9O1xuXHRcdFx0dGhpcy5uZXh0KHMpO1xuXHRcdH1cblx0XHRub3RpZnkoZSwgdCA9IHt9LCBuID0gXCJub3RpZnlcIikge1xuXHRcdFx0Y29uc3QgcyA9IHRoaXMuX3RyYW5zcG9ydHMuZ2V0KGUpO1xuXHRcdFx0cmV0dXJuIHMgPyAodGhpcy5fZW1pdENvbm5lY3Rpb25TaWduYWwocywgbiwge1xuXHRcdFx0XHRmcm9tOiB0aGlzLl9uYW1lLFxuXHRcdFx0XHR0bzogZSxcblx0XHRcdFx0Li4udFxuXHRcdFx0fSksICEwKSA6ICExO1xuXHRcdH1cblx0XHRnZXQgb25NZXNzYWdlKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2luYm91bmQ7XG5cdFx0fVxuXHRcdGdldCBvbk91dGJvdW5kKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX291dGJvdW5kO1xuXHRcdH1cblx0XHRnZXQgb25JbnZvY2F0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2ludm9jYXRpb25zO1xuXHRcdH1cblx0XHRnZXQgb25SZXNwb25zZSgpIHtcblx0XHRcdHJldHVybiB0aGlzLl9yZXNwb25zZXM7XG5cdFx0fVxuXHRcdGdldCBvbkNvbm5lY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY29ubmVjdGlvbkV2ZW50cztcblx0XHR9XG5cdFx0c3Vic2NyaWJlQ29ubmVjdGlvbnMoZSkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2Nvbm5lY3Rpb25FdmVudHMuc3Vic2NyaWJlKGUpO1xuXHRcdH1cblx0XHRxdWVyeUNvbm5lY3Rpb25zKGUgPSB7fSkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2Nvbm5lY3Rpb25SZWdpc3RyeS5xdWVyeShlKTtcblx0XHR9XG5cdFx0bm90aWZ5Q29ubmVjdGlvbnMoZSA9IHt9LCB0ID0ge30pIHtcblx0XHRcdGxldCBuID0gMDtcblx0XHRcdGNvbnN0IHMgPSB0aGlzLnF1ZXJ5Q29ubmVjdGlvbnMoe1xuXHRcdFx0XHQuLi50LFxuXHRcdFx0XHRzdGF0dXM6IFwiYWN0aXZlXCIsXG5cdFx0XHRcdGluY2x1ZGVDbG9zZWQ6ICExXG5cdFx0XHR9KTtcblx0XHRcdGZvciAoY29uc3QgciBvZiBzKSB7XG5cdFx0XHRcdGNvbnN0IGkgPSB0aGlzLl90cmFuc3BvcnRzLmdldChyLnJlbW90ZUNoYW5uZWwpO1xuXHRcdFx0XHRpICYmICh0aGlzLl9lbWl0Q29ubmVjdGlvblNpZ25hbChpLCBcIm5vdGlmeVwiLCB7XG5cdFx0XHRcdFx0Y29ubmVjdGlvbklkOiByLmlkLFxuXHRcdFx0XHRcdGZyb206IHRoaXMuX25hbWUsXG5cdFx0XHRcdFx0dG86IHIucmVtb3RlQ2hhbm5lbCxcblx0XHRcdFx0XHQuLi5lXG5cdFx0XHRcdH0pLCBuKyspO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG47XG5cdFx0fVxuXHRcdGdldCBuYW1lKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX25hbWU7XG5cdFx0fVxuXHRcdGdldCBjb250ZXh0VHlwZSgpIHtcblx0XHRcdHJldHVybiB0aGlzLl9jb250ZXh0VHlwZTtcblx0XHR9XG5cdFx0Z2V0IGNvbmZpZygpIHtcblx0XHRcdHJldHVybiB0aGlzLl9jb25maWc7XG5cdFx0fVxuXHRcdGdldCBjb25uZWN0ZWRDaGFubmVscygpIHtcblx0XHRcdHJldHVybiBbLi4udGhpcy5fdHJhbnNwb3J0cy5rZXlzKCldO1xuXHRcdH1cblx0XHRnZXQgZXhwb3NlZE1vZHVsZXMoKSB7XG5cdFx0XHRyZXR1cm4gWy4uLnRoaXMuX2V4cG9zZWQua2V5cygpXTtcblx0XHR9XG5cdFx0Y2xvc2UoKSB7XG5cdFx0XHR0aGlzLl9zdWJzY3JpcHRpb25zLmZvckVhY2goKGUpID0+IGUudW5zdWJzY3JpYmUoKSksIHRoaXMuX3N1YnNjcmlwdGlvbnMgPSBbXSwgdGhpcy5fcGVuZGluZy5jbGVhcigpLCB0aGlzLl9tYXJrQWxsQ29ubmVjdGlvbnNDbG9zZWQoKTtcblx0XHRcdGZvciAoY29uc3QgZSBvZiB0aGlzLl90cmFuc3BvcnRzLnZhbHVlcygpKSB7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0ZS5jbGVhbnVwPy4oKTtcblx0XHRcdFx0fSBjYXRjaCB7fVxuXHRcdFx0XHRpZiAoZS50cmFuc3BvcnRUeXBlID09PSBcIm1lc3NhZ2UtcG9ydFwiIHx8IGUudHJhbnNwb3J0VHlwZSA9PT0gXCJicm9hZGNhc3RcIikgdHJ5IHtcblx0XHRcdFx0XHRlLnRhcmdldD8uY2xvc2U/LigpO1xuXHRcdFx0XHR9IGNhdGNoIHt9XG5cdFx0XHR9XG5cdFx0XHR0aGlzLl90cmFuc3BvcnRzLmNsZWFyKCksIHRoaXMuX2RlZmF1bHRUcmFuc3BvcnQgPSBudWxsLCB0aGlzLl9jb25uZWN0aW9uUmVnaXN0cnkuY2xlYXIoKSwgdGhpcy5faW5ib3VuZC5jb21wbGV0ZSgpLCB0aGlzLl9vdXRib3VuZC5jb21wbGV0ZSgpLCB0aGlzLl9pbnZvY2F0aW9ucy5jb21wbGV0ZSgpLCB0aGlzLl9yZXNwb25zZXMuY29tcGxldGUoKSwgdGhpcy5fY29ubmVjdGlvbkV2ZW50cy5jb21wbGV0ZSgpO1xuXHRcdH1cblx0XHRfaGFuZGxlSW5jb21pbmcoZSkge1xuXHRcdFx0aWYgKCEoIWUgfHwgdHlwZW9mIGUgIT0gXCJvYmplY3RcIikpIHN3aXRjaCAodGhpcy5faW5ib3VuZC5uZXh0KGUpLCBlLnR5cGUpIHtcblx0XHRcdFx0Y2FzZSBcInJlcXVlc3RcIjpcblx0XHRcdFx0XHRlLmNoYW5uZWwgPT09IHRoaXMuX25hbWUgJiYgdGhpcy5faGFuZGxlUmVxdWVzdChlKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcInJlc3BvbnNlXCI6XG5cdFx0XHRcdFx0dGhpcy5faGFuZGxlUmVzcG9uc2UoZSk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJldmVudFwiOiBicmVhaztcblx0XHRcdFx0Y2FzZSBcInNpZ25hbFwiOiB0aGlzLl9oYW5kbGVTaWduYWwoZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdF9oYW5kbGVSZXNwb25zZShlKSB7XG5cdFx0XHRjb25zdCB0ID0gZS5yZXFJZCA/PyBlLmlkLCBuID0gdGhpcy5fcGVuZGluZy5nZXQodCk7XG5cdFx0XHRpZiAobikge1xuXHRcdFx0XHRpZiAodGhpcy5fcGVuZGluZy5kZWxldGUodCksIGUucGF5bG9hZD8uZXJyb3IpIG4ucmVqZWN0KG5ldyBFcnJvcihlLnBheWxvYWQuZXJyb3IpKTtcblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0Y29uc3QgcyA9IGUucGF5bG9hZD8ucmVzdWx0LCByID0gZS5wYXlsb2FkPy5kZXNjcmlwdG9yO1xuXHRcdFx0XHRcdHMgIT0gbnVsbCA/IG4ucmVzb2x2ZShzKSA6IHIgPyBuLnJlc29sdmUodGhpcy53cmFwRGVzY3JpcHRvcihyLCBlLnNlbmRlcikpIDogbi5yZXNvbHZlKHZvaWQgMCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhpcy5fcmVzcG9uc2VzLm5leHQoe1xuXHRcdFx0XHRcdGlkOiB0LFxuXHRcdFx0XHRcdGNoYW5uZWw6IGUuY2hhbm5lbCxcblx0XHRcdFx0XHRzZW5kZXI6IGUuc2VuZGVyLFxuXHRcdFx0XHRcdHJlc3VsdDogZS5wYXlsb2FkPy5yZXN1bHQsXG5cdFx0XHRcdFx0ZGVzY3JpcHRvcjogZS5wYXlsb2FkPy5kZXNjcmlwdG9yLFxuXHRcdFx0XHRcdHRpbWVzdGFtcDogRGF0ZS5ub3coKVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9XG5cdFx0YXN5bmMgX2hhbmRsZVJlcXVlc3QoZSkge1xuXHRcdFx0Y29uc3QgdCA9IGUucGF5bG9hZDtcblx0XHRcdGlmICghdCkgcmV0dXJuO1xuXHRcdFx0Y29uc3QgeyBhY3Rpb246IG4sIHBhdGg6IHMsIGFyZ3M6IHIsIHNlbmRlcjogaSB9ID0gdCwgbyA9IGUucmVxSWQgPz8gZS5pZDtcblx0XHRcdHRoaXMuX2ludm9jYXRpb25zLm5leHQoe1xuXHRcdFx0XHRpZDogbyxcblx0XHRcdFx0Y2hhbm5lbDogdGhpcy5fbmFtZSxcblx0XHRcdFx0c2VuZGVyOiBpLFxuXHRcdFx0XHRhY3Rpb246IG4sXG5cdFx0XHRcdHBhdGg6IHMsXG5cdFx0XHRcdGFyZ3M6IHIgPz8gW10sXG5cdFx0XHRcdHRpbWVzdGFtcDogRGF0ZS5ub3coKSxcblx0XHRcdFx0Y29udGV4dFR5cGU6IGJuKGUpXG5cdFx0XHR9KTtcblx0XHRcdGNvbnN0IHsgcmVzdWx0OiBhLCB0b1RyYW5zZmVyOiBjLCBuZXdQYXRoOiBsIH0gPSBhd2FpdCB0aGlzLl9leGVjdXRlQWN0aW9uKG4sIHMsIHIgPz8gW10sIGkpO1xuXHRcdFx0YXdhaXQgdGhpcy5fc2VuZFJlc3BvbnNlKG8sIG4sIGksIGwsIGEsIGMpO1xuXHRcdH1cblx0XHRhc3luYyBfZXhlY3V0ZUFjdGlvbihlLCB0LCBuLCBzKSB7XG5cdFx0XHRjb25zdCB7IHJlc3VsdDogciwgdG9UcmFuc2ZlcjogaSwgcGF0aDogbyB9ID0gUHQoZSwgdCwgbiwge1xuXHRcdFx0XHRjaGFubmVsOiB0aGlzLl9uYW1lLFxuXHRcdFx0XHRzZW5kZXI6IHMsXG5cdFx0XHRcdHJlZmxlY3Q6IHRoaXMuX2NvbmZpZy5yZWZsZWN0XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHJlc3VsdDogYXdhaXQgcixcblx0XHRcdFx0dG9UcmFuc2ZlcjogaSxcblx0XHRcdFx0bmV3UGF0aDogb1xuXHRcdFx0fTtcblx0XHR9XG5cdFx0YXN5bmMgX3NlbmRSZXNwb25zZShlLCB0LCBuLCBzLCByLCBpKSB7XG5cdFx0XHRjb25zdCB7IHJlc3BvbnNlOiBvLCB0cmFuc2ZlcjogYSB9ID0gYXdhaXQgTXQoZSwgdCwgdGhpcy5fbmFtZSwgbiwgcywgciwgaSksIGMgPSB7XG5cdFx0XHRcdGlkOiBlLFxuXHRcdFx0XHQuLi5vLFxuXHRcdFx0XHR0aW1lc3RhbXA6IERhdGUubm93KCksXG5cdFx0XHRcdHRyYW5zZmVyYWJsZTogYVxuXHRcdFx0fTtcblx0XHRcdHRoaXMuX3NlbmQobiwgYywgYSk7XG5cdFx0fVxuXHRcdF9oYW5kbGVTaWduYWwoZSkge1xuXHRcdFx0Y29uc3QgdCA9IGU/LnBheWxvYWQgPz8ge30sIG4gPSB0LmZyb20gPz8gZS5zZW5kZXIgPz8gXCJ1bmtub3duXCIsIHMgPSBlLnRyYW5zcG9ydFR5cGUgPz8gdGhpcy5fdHJhbnNwb3J0cy5nZXQoZS5jaGFubmVsKT8udHJhbnNwb3J0VHlwZSA/PyBcImludGVybmFsXCIsIHIgPSB0aGlzLl9yZWdpc3RlckNvbm5lY3Rpb24oe1xuXHRcdFx0XHRsb2NhbENoYW5uZWw6IHRoaXMuX25hbWUsXG5cdFx0XHRcdHJlbW90ZUNoYW5uZWw6IG4sXG5cdFx0XHRcdHNlbmRlcjogZS5zZW5kZXIgPz8gbixcblx0XHRcdFx0dHJhbnNwb3J0VHlwZTogcyxcblx0XHRcdFx0ZGlyZWN0aW9uOiBcImluY29taW5nXCJcblx0XHRcdH0pO1xuXHRcdFx0dGhpcy5fbWFya0Nvbm5lY3Rpb25Ob3RpZmllZChyLCB0KTtcblx0XHR9XG5cdFx0X3JlZ2lzdGVyQ29ubmVjdGlvbihlKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY29ubmVjdGlvblJlZ2lzdHJ5LnJlZ2lzdGVyKGUpO1xuXHRcdH1cblx0XHRfbWFya0Nvbm5lY3Rpb25Ob3RpZmllZChlLCB0KSB7XG5cdFx0XHR0aGlzLl9jb25uZWN0aW9uUmVnaXN0cnkubWFya05vdGlmaWVkKGUsIHQpO1xuXHRcdH1cblx0XHRfZW1pdENvbm5lY3Rpb25TaWduYWwoZSwgdCwgbiA9IHt9KSB7XG5cdFx0XHRjb25zdCBzID0ge1xuXHRcdFx0XHRpZDogJGUoKSxcblx0XHRcdFx0dHlwZTogXCJzaWduYWxcIixcblx0XHRcdFx0Y2hhbm5lbDogZS50YXJnZXRDaGFubmVsLFxuXHRcdFx0XHRzZW5kZXI6IHRoaXMuX25hbWUsXG5cdFx0XHRcdHRyYW5zcG9ydFR5cGU6IGUudHJhbnNwb3J0VHlwZSxcblx0XHRcdFx0cGF5bG9hZDoge1xuXHRcdFx0XHRcdHR5cGU6IHQsXG5cdFx0XHRcdFx0ZnJvbTogdGhpcy5fbmFtZSxcblx0XHRcdFx0XHR0bzogZS50YXJnZXRDaGFubmVsLFxuXHRcdFx0XHRcdC4uLm5cblx0XHRcdFx0fSxcblx0XHRcdFx0dGltZXN0YW1wOiBEYXRlLm5vdygpXG5cdFx0XHR9O1xuXHRcdFx0KGU/LnNlbmRlciA/PyBlPy5wb3N0TWVzc2FnZSk/LmNhbGwoZSwgcyk7XG5cdFx0XHRjb25zdCByID0gdGhpcy5fcmVnaXN0ZXJDb25uZWN0aW9uKHtcblx0XHRcdFx0bG9jYWxDaGFubmVsOiB0aGlzLl9uYW1lLFxuXHRcdFx0XHRyZW1vdGVDaGFubmVsOiBlLnRhcmdldENoYW5uZWwsXG5cdFx0XHRcdHNlbmRlcjogdGhpcy5fbmFtZSxcblx0XHRcdFx0dHJhbnNwb3J0VHlwZTogZS50cmFuc3BvcnRUeXBlLFxuXHRcdFx0XHRkaXJlY3Rpb246IFwib3V0Z29pbmdcIlxuXHRcdFx0fSk7XG5cdFx0XHR0aGlzLl9tYXJrQ29ubmVjdGlvbk5vdGlmaWVkKHIsIHMucGF5bG9hZCk7XG5cdFx0fVxuXHRcdF9zZW5kU2lnbmFsVG9UYXJnZXQoZSwgdCwgbiwgcykge1xuXHRcdFx0Y29uc3QgciA9IHtcblx0XHRcdFx0aWQ6ICRlKCksXG5cdFx0XHRcdHR5cGU6IFwic2lnbmFsXCIsXG5cdFx0XHRcdGNoYW5uZWw6IG4udG8gPz8gdGhpcy5fbmFtZSxcblx0XHRcdFx0c2VuZGVyOiB0aGlzLl9uYW1lLFxuXHRcdFx0XHR0cmFuc3BvcnRUeXBlOiB0LFxuXHRcdFx0XHRwYXlsb2FkOiB7XG5cdFx0XHRcdFx0dHlwZTogcyxcblx0XHRcdFx0XHQuLi5uXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHRpbWVzdGFtcDogRGF0ZS5ub3coKVxuXHRcdFx0fTtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdGlmICh0ID09PSBcIndlYnNvY2tldFwiKSB7XG5cdFx0XHRcdFx0ZT8uc2VuZD8uKEpTT04uc3RyaW5naWZ5KHIpKTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHQgPT09IFwiY2hyb21lLXJ1bnRpbWVcIikge1xuXHRcdFx0XHRcdGNocm9tZS5ydW50aW1lPy5zZW5kTWVzc2FnZT8uKHIpO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodCA9PT0gXCJjaHJvbWUtdGFic1wiKSB7XG5cdFx0XHRcdFx0Y29uc3QgaSA9IG4udGFiSWQ7XG5cdFx0XHRcdFx0aSAhPSBudWxsICYmIGNocm9tZS50YWJzPy5zZW5kTWVzc2FnZT8uKGksIHIpO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodCA9PT0gXCJjaHJvbWUtcG9ydFwiKSB7XG5cdFx0XHRcdFx0ZT8ucG9zdE1lc3NhZ2U/LihyKTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHQgPT09IFwiY2hyb21lLWV4dGVybmFsXCIpIHtcblx0XHRcdFx0XHRuLmV4dGVybmFsSWQgJiYgY2hyb21lLnJ1bnRpbWU/LnNlbmRNZXNzYWdlPy4obi5leHRlcm5hbElkLCByKTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0ZT8ucG9zdE1lc3NhZ2U/LihyLCB7IHRyYW5zZmVyOiBbXSB9KTtcblx0XHRcdH0gY2F0Y2gge31cblx0XHR9XG5cdFx0X21hcmtBbGxDb25uZWN0aW9uc0Nsb3NlZCgpIHtcblx0XHRcdHRoaXMuX2Nvbm5lY3Rpb25SZWdpc3RyeS5jbG9zZUFsbCgpO1xuXHRcdH1cblx0XHRfY3JlYXRlVHJhbnNwb3J0QmluZGluZyhlLCB0LCBuLCBzKSB7XG5cdFx0XHRsZXQgciwgaTtcblx0XHRcdHN3aXRjaCAodCkge1xuXHRcdFx0XHRjYXNlIFwid29ya2VyXCI6XG5cdFx0XHRcdGNhc2UgXCJtZXNzYWdlLXBvcnRcIjpcblx0XHRcdFx0Y2FzZSBcImJyb2FkY2FzdFwiOlxuXHRcdFx0XHRcdHMuYXV0b1N0YXJ0ICE9PSAhMSAmJiBlLnN0YXJ0ICYmIGUuc3RhcnQoKSwgciA9IChvLCBhKSA9PiBlLnBvc3RNZXNzYWdlKG8sIHsgdHJhbnNmZXI6IGEgfSk7XG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0Y29uc3QgbyA9ICgoYSkgPT4gdGhpcy5faGFuZGxlSW5jb21pbmcoYS5kYXRhKSk7XG5cdFx0XHRcdFx0XHRlLmFkZEV2ZW50TGlzdGVuZXI/LihcIm1lc3NhZ2VcIiwgbyksIGkgPSAoKSA9PiBlLnJlbW92ZUV2ZW50TGlzdGVuZXI/LihcIm1lc3NhZ2VcIiwgbyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwid2Vic29ja2V0XCI6XG5cdFx0XHRcdFx0ciA9IChvKSA9PiBlLnNlbmQoSlNPTi5zdHJpbmdpZnkobykpO1xuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGNvbnN0IG8gPSAoKGEpID0+IHtcblx0XHRcdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdFx0XHR0aGlzLl9oYW5kbGVJbmNvbWluZyhKU09OLnBhcnNlKGEuZGF0YSkpO1xuXHRcdFx0XHRcdFx0XHR9IGNhdGNoIHt9XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdGUuYWRkRXZlbnRMaXN0ZW5lcj8uKFwibWVzc2FnZVwiLCBvKSwgaSA9ICgpID0+IGUucmVtb3ZlRXZlbnRMaXN0ZW5lcj8uKFwibWVzc2FnZVwiLCBvKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJjaHJvbWUtcnVudGltZVwiOlxuXHRcdFx0XHRcdHIgPSAobykgPT4gY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2Uobyk7XG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0Y29uc3QgbyA9IChhKSA9PiB0aGlzLl9oYW5kbGVJbmNvbWluZyhhKTtcblx0XHRcdFx0XHRcdGNocm9tZS5ydW50aW1lLm9uTWVzc2FnZT8uYWRkTGlzdGVuZXI/LihvKSwgaSA9ICgpID0+IGNocm9tZS5ydW50aW1lLm9uTWVzc2FnZT8ucmVtb3ZlTGlzdGVuZXI/LihvKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJjaHJvbWUtdGFic1wiOlxuXHRcdFx0XHRcdHIgPSAobykgPT4ge1xuXHRcdFx0XHRcdFx0cy50YWJJZCAhPSBudWxsICYmIGNocm9tZS50YWJzPy5zZW5kTWVzc2FnZT8uKHMudGFiSWQsIG8pO1xuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0Y29uc3QgbyA9IChhLCBjKSA9PiBzLnRhYklkICE9IG51bGwgJiYgYz8udGFiPy5pZCAhPT0gcy50YWJJZCA/ICExIDogKHRoaXMuX2hhbmRsZUluY29taW5nKGEpLCAhMCk7XG5cdFx0XHRcdFx0XHRjaHJvbWUucnVudGltZS5vbk1lc3NhZ2U/LmFkZExpc3RlbmVyPy4obyksIGkgPSAoKSA9PiBjaHJvbWUucnVudGltZS5vbk1lc3NhZ2U/LnJlbW92ZUxpc3RlbmVyPy4obyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwiY2hyb21lLXBvcnRcIjpcblx0XHRcdFx0XHRpZiAoZT8ucG9zdE1lc3NhZ2UgJiYgZT8ub25NZXNzYWdlPy5hZGRMaXN0ZW5lcikge1xuXHRcdFx0XHRcdFx0ciA9IChhKSA9PiBlLnBvc3RNZXNzYWdlKGEpO1xuXHRcdFx0XHRcdFx0Y29uc3QgbyA9IChhKSA9PiB0aGlzLl9oYW5kbGVJbmNvbWluZyhhKTtcblx0XHRcdFx0XHRcdGUub25NZXNzYWdlLmFkZExpc3RlbmVyKG8pLCBpID0gKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0XHRcdGUub25NZXNzYWdlLnJlbW92ZUxpc3RlbmVyKG8pO1xuXHRcdFx0XHRcdFx0XHR9IGNhdGNoIHt9XG5cdFx0XHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRcdFx0ZS5kaXNjb25uZWN0Py4oKTtcblx0XHRcdFx0XHRcdFx0fSBjYXRjaCB7fVxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Y29uc3QgbyA9IHMucG9ydE5hbWUgPz8gbiwgYSA9IHMudGFiSWQgIT0gbnVsbCAmJiBjaHJvbWUudGFicz8uY29ubmVjdCA/IGNocm9tZS50YWJzLmNvbm5lY3Qocy50YWJJZCwgeyBuYW1lOiBvIH0pIDogY2hyb21lLnJ1bnRpbWUuY29ubmVjdCh7IG5hbWU6IG8gfSk7XG5cdFx0XHRcdFx0XHRyID0gKGwpID0+IGEucG9zdE1lc3NhZ2UobCk7XG5cdFx0XHRcdFx0XHRjb25zdCBjID0gKGwpID0+IHRoaXMuX2hhbmRsZUluY29taW5nKGwpO1xuXHRcdFx0XHRcdFx0YS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoYyksIGkgPSAoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRcdFx0YS5vbk1lc3NhZ2UucmVtb3ZlTGlzdGVuZXIoYyk7XG5cdFx0XHRcdFx0XHRcdH0gY2F0Y2gge31cblx0XHRcdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdFx0XHRhLmRpc2Nvbm5lY3QoKTtcblx0XHRcdFx0XHRcdFx0fSBjYXRjaCB7fVxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJjaHJvbWUtZXh0ZXJuYWxcIjpcblx0XHRcdFx0XHRyID0gKG8pID0+IHtcblx0XHRcdFx0XHRcdHMuZXh0ZXJuYWxJZCAmJiBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZShzLmV4dGVybmFsSWQsIG8pO1xuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0Y29uc3QgbyA9IChhKSA9PiAodGhpcy5faGFuZGxlSW5jb21pbmcoYSksICEwKTtcblx0XHRcdFx0XHRcdGNocm9tZS5ydW50aW1lLm9uTWVzc2FnZUV4dGVybmFsPy5hZGRMaXN0ZW5lcj8uKG8pLCBpID0gKCkgPT4gY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlRXh0ZXJuYWw/LnJlbW92ZUxpc3RlbmVyPy4obyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwic2VsZlwiOlxuXHRcdFx0XHRcdHIgPSAobywgYSkgPT4gZ2xvYmFsVGhpcy5wb3N0TWVzc2FnZT8uKG8sIHsgdHJhbnNmZXI6IGEgPz8gW10gfSk7XG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0Y29uc3QgbyA9ICgoYSkgPT4gdGhpcy5faGFuZGxlSW5jb21pbmcoYS5kYXRhKSk7XG5cdFx0XHRcdFx0XHRnbG9iYWxUaGlzLmFkZEV2ZW50TGlzdGVuZXI/LihcIm1lc3NhZ2VcIiwgbyksIGkgPSAoKSA9PiBnbG9iYWxUaGlzLnJlbW92ZUV2ZW50TGlzdGVuZXI/LihcIm1lc3NhZ2VcIiwgbyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRkZWZhdWx0OiBzLm9uTWVzc2FnZSAmJiAoaSA9IHMub25NZXNzYWdlKChvKSA9PiB0aGlzLl9oYW5kbGVJbmNvbWluZyhvKSkpLCByID0gKG8pID0+IGU/LnBvc3RNZXNzYWdlPy4obyk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR0YXJnZXQ6IGUsXG5cdFx0XHRcdHRhcmdldENoYW5uZWw6IG4sXG5cdFx0XHRcdHRyYW5zcG9ydFR5cGU6IHQsXG5cdFx0XHRcdHNlbmRlcjogcixcblx0XHRcdFx0Y2xlYW51cDogaSxcblx0XHRcdFx0cG9zdE1lc3NhZ2U6IChvLCBhKSA9PiByPy4obywgYSksXG5cdFx0XHRcdHN0YXJ0OiAoKSA9PiBlPy5zdGFydD8uKCksXG5cdFx0XHRcdGNsb3NlOiAoKSA9PiBlPy5jbG9zZT8uKClcblx0XHRcdH07XG5cdFx0fVxuXHRcdF9zZW5kKGUsIHQsIG4pIHtcblx0XHRcdGNvbnN0IHMgPSB0aGlzLl90cmFuc3BvcnRzLmdldChlKSA/PyB0aGlzLl9kZWZhdWx0VHJhbnNwb3J0O1xuXHRcdFx0KHM/LnNlbmRlciA/PyBzPy5wb3N0TWVzc2FnZSk/LmNhbGwocywgdCwgbik7XG5cdFx0fVxuXHRcdF9nZXREZWZhdWx0VGFyZ2V0KCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2RlZmF1bHRUcmFuc3BvcnQgPyB0aGlzLl9kZWZhdWx0VHJhbnNwb3J0LnRhcmdldENoYW5uZWwgOiBcIndvcmtlclwiO1xuXHRcdH1cblx0XHRfaW5mZXJUYXJnZXRDaGFubmVsKGUsIHQpIHtcblx0XHRcdHJldHVybiB0ID09PSBcIndvcmtlclwiID8gXCJ3b3JrZXJcIiA6IHQgPT09IFwiYnJvYWRjYXN0XCIgJiYgZS5uYW1lID8gZS5uYW1lIDogdCA9PT0gXCJzZWxmXCIgPyBcInNlbGZcIiA6IGAke3R9LSR7JGUoKS5zbGljZSgwLCA4KX1gO1xuXHRcdH1cblx0XHRfY3JlYXRlUHJveHkoZSwgdCkge1xuXHRcdFx0cmV0dXJuIGVlKChzLCByLCBpKSA9PiB0aGlzLmludm9rZShlLCBzLCByLCBpKSwge1xuXHRcdFx0XHRjaGFubmVsOiBlLFxuXHRcdFx0XHRiYXNlUGF0aDogdCxcblx0XHRcdFx0Y2FjaGU6ICEwLFxuXHRcdFx0XHR0aW1lb3V0OiB0aGlzLl9jb25maWcudGltZW91dFxuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdF9pc1dvcmtlckNvbnRleHQoKSB7XG5cdFx0XHRyZXR1cm4gW1xuXHRcdFx0XHRcIndvcmtlclwiLFxuXHRcdFx0XHRcInNoYXJlZC13b3JrZXJcIixcblx0XHRcdFx0XCJzZXJ2aWNlLXdvcmtlclwiXG5cdFx0XHRdLmluY2x1ZGVzKHRoaXMuX2NvbnRleHRUeXBlKTtcblx0XHR9XG5cdH07XG5cdGZ1bmN0aW9uIFMoZSkge1xuXHRcdHJldHVybiBuZXcgeXQoZSk7XG5cdH1cblx0dmFyIHJlID0gbnVsbDtcblx0ZnVuY3Rpb24gdGUoKSB7XG5cdFx0aWYgKCFyZSkge1xuXHRcdFx0Y29uc3QgZSA9IEgoKTtcblx0XHRcdFtcblx0XHRcdFx0XCJ3b3JrZXJcIixcblx0XHRcdFx0XCJzaGFyZWQtd29ya2VyXCIsXG5cdFx0XHRcdFwic2VydmljZS13b3JrZXJcIlxuXHRcdFx0XS5pbmNsdWRlcyhlKSA/IHJlID0gUyh7XG5cdFx0XHRcdG5hbWU6IFwid29ya2VyXCIsXG5cdFx0XHRcdGF1dG9MaXN0ZW46ICEwXG5cdFx0XHR9KSA6IHJlID0gUyh7XG5cdFx0XHRcdG5hbWU6IFwiaG9zdFwiLFxuXHRcdFx0XHRhdXRvTGlzdGVuOiAhMVxuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdHJldHVybiByZTtcblx0fVxuXHR2YXIgQyA9IHtcblx0XHRyamI6IFwicmVqZWN0QnlcIixcblx0XHRydmI6IFwicmVzb2x2ZUJ5XCIsXG5cdFx0cmo6IFwicmVqZWN0XCIsXG5cdFx0cnY6IFwicmVzb2x2ZVwiLFxuXHRcdGNyOiBcImNyZWF0ZVwiLFxuXHRcdGNzOiBcImNyZWF0ZVN5bmNcIixcblx0XHRhOiBcImFycmF5XCIsXG5cdFx0dGE6IFwidHlwZWRhcnJheVwiLFxuXHRcdHVkZjogXCJ1bmRlZmluZWRcIlxuXHR9O1xuXHRbXG5cdFx0dHlwZW9mIEFycmF5QnVmZmVyICE9IEMudWRmID8gQXJyYXlCdWZmZXIgOiBudWxsLFxuXHRcdHR5cGVvZiBNZXNzYWdlUG9ydCAhPSBDLnVkZiA/IE1lc3NhZ2VQb3J0IDogbnVsbCxcblx0XHR0eXBlb2YgUmVhZGFibGVTdHJlYW0gIT0gQy51ZGYgPyBSZWFkYWJsZVN0cmVhbSA6IG51bGwsXG5cdFx0dHlwZW9mIFdyaXRhYmxlU3RyZWFtICE9IEMudWRmID8gV3JpdGFibGVTdHJlYW0gOiBudWxsLFxuXHRcdHR5cGVvZiBUcmFuc2Zvcm1TdHJlYW0gIT0gQy51ZGYgPyBUcmFuc2Zvcm1TdHJlYW0gOiBudWxsLFxuXHRcdHR5cGVvZiBXZWJUcmFuc3BvcnRSZWNlaXZlU3RyZWFtICE9IEMudWRmID8gV2ViVHJhbnNwb3J0UmVjZWl2ZVN0cmVhbSA6IG51bGwsXG5cdFx0dHlwZW9mIFdlYlRyYW5zcG9ydFNlbmRTdHJlYW0gIT0gQy51ZGYgPyBXZWJUcmFuc3BvcnRTZW5kU3RyZWFtIDogbnVsbCxcblx0XHR0eXBlb2YgQXVkaW9EYXRhICE9IEMudWRmID8gQXVkaW9EYXRhIDogbnVsbCxcblx0XHR0eXBlb2YgSW1hZ2VCaXRtYXAgIT0gQy51ZGYgPyBJbWFnZUJpdG1hcCA6IG51bGwsXG5cdFx0dHlwZW9mIFZpZGVvRnJhbWUgIT0gQy51ZGYgPyBWaWRlb0ZyYW1lIDogbnVsbCxcblx0XHR0eXBlb2YgT2Zmc2NyZWVuQ2FudmFzICE9IEMudWRmID8gT2Zmc2NyZWVuQ2FudmFzIDogbnVsbCxcblx0XHR0eXBlb2YgUlRDRGF0YUNoYW5uZWwgIT0gQy51ZGYgPyBSVENEYXRhQ2hhbm5lbCA6IG51bGxcblx0XS5maWx0ZXIoKGUpID0+IGUgIT0gbnVsbCk7XG5cdGZ1bmN0aW9uIEN0KCkge1xuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBlID0gZ2xvYmFsVGhpcy5sb2NhdGlvbj8uaHJlZjtcblx0XHRcdGlmICh0eXBlb2YgZSA9PSBcInN0cmluZ1wiICYmIGUubGVuZ3RoID4gMCkgcmV0dXJuIGU7XG5cdFx0fSBjYXRjaCB7fVxuXHRcdHRyeSB7XG5cdFx0XHRpZiAodHlwZW9mIGRvY3VtZW50IDwgXCJ1XCIgJiYgdHlwZW9mIGRvY3VtZW50LmJhc2VVUkkgPT0gXCJzdHJpbmdcIiAmJiBkb2N1bWVudC5iYXNlVVJJLmxlbmd0aCA+IDApIHJldHVybiBkb2N1bWVudC5iYXNlVVJJO1xuXHRcdH0gY2F0Y2gge31cblx0XHRyZXR1cm4gXCJcIjtcblx0fVxuXHRmdW5jdGlvbiBQKGUpIHtcblx0XHRjb25zdCB0ID0gQ3QoKTtcblx0XHRpZiAoIXQubGVuZ3RoKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiW3VuaWZvcm1dIE5vIGJhc2UgVVJMIGZvciB3b3JrZXIgcmVzb2x1dGlvbiAobWlzc2luZyBsb2NhdGlvbiAvIGRvY3VtZW50LmJhc2VVUkkpXCIpO1xuXHRcdGNvbnN0IG4gPSBlLnN0YXJ0c1dpdGgoXCIvXCIpID8gZS5yZXBsYWNlKC9eXFwvLywgXCIuL1wiKSA6IGU7XG5cdFx0cmV0dXJuIG5ldyBVUkwobiwgdCkuaHJlZjtcblx0fVxuXHR2YXIgdyA9IHtcblx0XHRuYW1lOiBcInVua25vd25cIixcblx0XHRpbnN0YW5jZTogbnVsbFxuXHR9O1xuXHR2YXIgd2UgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuXHR2YXIgeHQgPSAoZSkgPT4gWy4uLk9iamVjdC52YWx1ZXMoZCldLmluY2x1ZGVzKGUpO1xuXHR2YXIga3QgPSBjbGFzcyB7XG5cdFx0Y2hhbm5lbE5hbWU7XG5cdFx0b3B0aW9ucztcblx0XHRfY2hhbm5lbDtcblx0XHRjb25zdHJ1Y3RvcihlLCB0ID0ge30pIHtcblx0XHRcdHRoaXMuY2hhbm5lbE5hbWUgPSBlLCB0aGlzLm9wdGlvbnMgPSB0LCB0aGlzLl9jaGFubmVsID0gdGUoKTtcblx0XHR9XG5cdFx0cmVxdWVzdChlLCB0LCBuLCBzID0ge30pIHtcblx0XHRcdHJldHVybiB0eXBlb2YgZSA9PSBcInN0cmluZ1wiICYmIChlID0gW2VdKSwgQXJyYXkuaXNBcnJheSh0KSAmJiB4dChlKSAmJiAocyA9IG4sIG4gPSB0LCB0ID0gZSwgZSA9IFtdKSwgdGhpcy5fY2hhbm5lbC5pbnZva2UodGhpcy5jaGFubmVsTmFtZSwgdCwgZSwgbik7XG5cdFx0fVxuXHRcdGRvSW1wb3J0TW9kdWxlKGUsIHQpIHtcblx0XHRcdHJldHVybiB0aGlzLl9jaGFubmVsLmltcG9ydChlLCB0aGlzLmNoYW5uZWxOYW1lKTtcblx0XHR9XG5cdH07XG5cdHZhciBBbiA9IGNsYXNzIHtcblx0XHRjaGFubmVsO1xuXHRcdG9wdGlvbnM7XG5cdFx0X3VuaWZpZWQ7XG5cdFx0YnJvYWRjYXN0cyA9IHt9O1xuXHRcdGNvbnN0cnVjdG9yKGUsIHQgPSB7fSkge1xuXHRcdFx0dGhpcy5jaGFubmVsID0gZSwgdGhpcy5vcHRpb25zID0gdCwgdGhpcy5fdW5pZmllZCA9IFMoe1xuXHRcdFx0XHRuYW1lOiBlLFxuXHRcdFx0XHRhdXRvTGlzdGVuOiAhMVxuXHRcdFx0fSksIHcubmFtZSA9IGUsIHcuaW5zdGFuY2UgPSB0aGlzO1xuXHRcdH1cblx0XHRjcmVhdGVSZW1vdGVDaGFubmVsKGUsIHQgPSB7fSwgbikge1xuXHRcdFx0cmV0dXJuIG4gJiYgKHRoaXMuX3VuaWZpZWQuYXR0YWNoKG4sIHsgdGFyZ2V0Q2hhbm5lbDogZSB9KSwgdGhpcy5icm9hZGNhc3RzW2VdID0gbiksIFByb21pc2UucmVzb2x2ZShuZXcga3QoZSwgdCkpO1xuXHRcdH1cblx0XHRnZXRDaGFubmVsKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuY2hhbm5lbDtcblx0XHR9XG5cdFx0cmVxdWVzdChlLCB0LCBuLCBzID0ge30sIHIgPSBcIndvcmtlclwiKSB7XG5cdFx0XHRyZXR1cm4gdHlwZW9mIGUgPT0gXCJzdHJpbmdcIiAmJiAoZSA9IFtlXSksIEFycmF5LmlzQXJyYXkodCkgJiYgeHQoZSkgJiYgKHIgPSBzLCBzID0gbiwgbiA9IHQsIHQgPSBlLCBlID0gW10pLCB0aGlzLl91bmlmaWVkLmludm9rZShyLCB0LCBlLCBuKTtcblx0XHR9XG5cdFx0cmVzb2x2ZVJlc3BvbnNlKGUsIHQpIHtcblx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUodCk7XG5cdFx0fVxuXHRcdGFzeW5jIGhhbmRsZUFuZFJlc3BvbnNlKGUsIHQsIG4pIHtcblx0XHRcdGNvbnN0IHMgPSBhd2FpdCBEZShlLCB0LCB0aGlzLmNoYW5uZWwpO1xuXHRcdFx0cyAmJiBuPy4ocy5yZXNwb25zZSwgcy50cmFuc2Zlcik7XG5cdFx0fVxuXHRcdGNsb3NlKCkge1xuXHRcdFx0dGhpcy5fdW5pZmllZC5jbG9zZSgpO1xuXHRcdH1cblx0fTtcblx0dmFyIE9lID0gKGUgPSBcIiRob3N0JFwiKSA9PiB7XG5cdFx0aWYgKHc/Lmluc3RhbmNlICYmIGUgPT09IFwiJGhvc3QkXCIpIHJldHVybiB3Lmluc3RhbmNlO1xuXHRcdGlmICh3ZS5oYXMoZSkpIHJldHVybiB3ZS5nZXQoZSkgPz8gbnVsbDtcblx0XHRjb25zdCB0ID0gbmV3IEFuKGUpO1xuXHRcdHJldHVybiBlID09PSBcIiRob3N0JFwiICYmICh3Lm5hbWUgPSBlLCB3Lmluc3RhbmNlID0gdCksIHdlLnNldChlLCB0KSwgdDtcblx0fTtcblx0dmFyIHVlID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG5cdHZhciBkZSA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xuXHR2YXIgWWUgPSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcblx0dmFyIFJuID0gKGUsIHQgPSB3Py5uYW1lLCBuKSA9PiB0eXBlb2YgZSA9PSBcIm9iamVjdFwiICYmIGUgIT0gbnVsbCB8fCB0eXBlb2YgZSA9PSBcImZ1bmN0aW9uXCIgJiYgZSAhPSBudWxsID8gZGUuaGFzKGUpID8gZGUuZ2V0KGUpIDogdWUuaGFzKGUpID8gdWUuZ2V0KGUpIDogc2UoZSkgfHwgbj8uaW5jbHVkZXM/LihlKSB8fCB0ID09IHc/Lm5hbWUgPyBlIDoge1xuXHRcdCRpc0Rlc2NyaXB0b3I6ICEwLFxuXHRcdHBhdGg6IEQuZ2V0KGUpID8/ICgoKSA9PiB7XG5cdFx0XHRjb25zdCBzID0gWyRlKCldO1xuXHRcdFx0cmV0dXJuIGZlKHMsIGUpLCBzO1xuXHRcdH0pKCksXG5cdFx0b3duZXI6IHc/Lm5hbWUsXG5cdFx0Y2hhbm5lbDogdCxcblx0XHRwcmltaXRpdmU6IGcoZSksXG5cdFx0d3JpdGFibGU6ICEwLFxuXHRcdGVudW1lcmFibGU6ICEwLFxuXHRcdGNvbmZpZ3VyYWJsZTogITAsXG5cdFx0YXJndW1lbnRDb3VudDogZSBpbnN0YW5jZW9mIEZ1bmN0aW9uID8gZS5sZW5ndGggOiAtMVxuXHR9IDogYihlKSA/IGUgOiBudWxsO1xuXHR2YXIgcW4gPSAvKiBAX19QVVJFX18gKi8gU3ltYm9sLmZvcihcIkByZXF1ZXN0SGFuZGxlclwiKTtcblx0dmFyIFEgPSAvKiBAX19QVVJFX18gKi8gU3ltYm9sLmZvcihcIkBkZXNjcmlwdG9yXCIpO1xuXHR2YXIgdmUgPSAoZSkgPT4gYihlKSB8fCBlPy5bUV0gPyBlIDogZT8uJGlzRGVzY3JpcHRvciA/IEVuKGUsIGFzeW5jICgpID0+IHt9KSA6IHNlKGUpID8gZSA6IG51bGw7XG5cdHZhciBYID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0dmFyIEQgPSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcblx0dmFyIEV0ID0gKGUsIHQpID0+IHtcblx0XHRpZiAodCAhPSBudWxsICYmICFBcnJheS5pc0FycmF5KHQpICYmICh0ID0gW3RdKSwgdCA9PSBudWxsIHx8IHQ/Lmxlbmd0aCA8IDEpIHJldHVybiBlO1xuXHRcdGNvbnN0IG4gPSBlPy5bUV0gPz8gKGU/LiRpc0Rlc2NyaXB0b3IgPyBlIDogbnVsbCk7XG5cdFx0aWYgKG4gJiYgbj8ub3duZXIgPT0gdz8ubmFtZSAmJiAoZSA9IEwobj8ucGF0aCkgPz8gZSksIGcoZSkpIHJldHVybiBlO1xuXHRcdGZvciAoY29uc3QgcyBvZiB0KSBpZiAoZSA9IGU/LltzXSwgZSA9PSBudWxsKSByZXR1cm4gZTtcblx0XHRyZXR1cm4gZTtcblx0fTtcblx0dmFyIEwgPSAoZSkgPT4ge1xuXHRcdGlmIChlICE9IG51bGwgJiYgIUFycmF5LmlzQXJyYXkoZSkgJiYgKGUgPSBbZV0pLCBlID09IG51bGwgfHwgZT8ubGVuZ3RoIDwgMSkgcmV0dXJuIG51bGw7XG5cdFx0Y29uc3QgdCA9IFg/LmdldD8uKGU/LlswXSkgPz8gbnVsbDtcblx0XHRyZXR1cm4gdCAhPSBudWxsID8gRXQodCwgZT8uc2xpY2U/LigxKSkgOiBudWxsO1xuXHR9O1xuXHR2YXIgZmUgPSAoZSwgdCkgPT4ge1xuXHRcdGNvbnN0IG4gPSB0Py5bUV0gPz8gKHQ/LiRpc0Rlc2NyaXB0b3IgPyB0IDogbnVsbCk7XG5cdFx0aWYgKG4gJiYgbj8ub3duZXIgPT0gdz8ubmFtZSAmJiAodCA9IEwobj8ucGF0aCkgPz8gdCksIGUgIT0gbnVsbCAmJiAhQXJyYXkuaXNBcnJheShlKSAmJiAoZSA9IFtlXSksIGUgPT0gbnVsbCB8fCBlPy5sZW5ndGggPCAxKSByZXR1cm4gbnVsbDtcblx0XHRjb25zdCBzID0gWD8uZ2V0Py4oZT8uWzBdKSA/PyBudWxsO1xuXHRcdHJldHVybiBlPy5sZW5ndGggPiAxID8gRXQocywgZT8uc2xpY2U/LigxLCAtMSkpW2U/LltlPy5sZW5ndGggLSAxXV0gPSB0IDogWD8uc2V0Py4oZT8uWzBdLCB0KSwgKHR5cGVvZiB0ID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIHQgPT0gXCJmdW5jdGlvblwiKSAmJiBEPy5zZXQ/Lih0LCBlKSwgdDtcblx0fTtcblx0dmFyIEl0ID0gKGUpID0+IChlICE9IG51bGwgJiYgIUFycmF5LmlzQXJyYXkoZSkgJiYgKGUgPSBbZV0pLCBlID09IG51bGwgfHwgZT8ubGVuZ3RoIDwgMSA/ICExIDogIShYPy5nZXQ/LihlPy5bMF0pID8/IG51bGwpICYmIGU/Lmxlbmd0aCA8PSAxID8gKFg/LmRlbGV0ZT8uKGU/LlswXSksICEwKSA6ICExKTtcblx0dmFyIE9uID0gKGUpID0+IHtcblx0XHRjb25zdCB0ID0gZT8uW1FdID8/IChlPy4kaXNEZXNjcmlwdG9yID8gZSA6IG51bGwpO1xuXHRcdHQgJiYgdD8ub3duZXIgPT0gdz8ubmFtZSAmJiAoZSA9IEwodD8ucGF0aCkgPz8gZSk7XG5cdFx0Y29uc3QgbiA9IEQ/LmdldD8uKGUpID8/IHQ/LnBhdGg7XG5cdFx0cmV0dXJuIG4gPT0gbnVsbCB8fCBuPy5sZW5ndGggPCAxID8gITEgOiAoSXQobiksICh0eXBlb2YgZSA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBlID09IFwiZnVuY3Rpb25cIikgJiYgRD8uZGVsZXRlPy4oZSksICEwKTtcblx0fTtcblx0dmFyIERuID0gKGUpID0+IHtcblx0XHRjb25zdCB0ID0gZT8uW1FdID8/IChlPy4kaXNEZXNjcmlwdG9yID8gZSA6IG51bGwpO1xuXHRcdHJldHVybiAoRD8uZ2V0Py4oZSkgPz8gdD8ucGF0aCkgPT0gbnVsbDtcblx0fTtcblx0dmFyIFIgPSAoZSkgPT4gKHR5cGVvZiBlID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGUgPT0gXCJmdW5jdGlvblwiKSAmJiBlICE9IG51bGw7XG5cdHZhciBUdCA9IHtcblx0XHRnZXQ6IChlLCB0KSA9PiBlPy5bdF0sXG5cdFx0c2V0OiAoZSwgdCwgbikgPT4gKGVbdF0gPSBuLCAhMCksXG5cdFx0aGFzOiAoZSwgdCkgPT4gdCBpbiBlLFxuXHRcdGFwcGx5OiAoZSwgdCwgbikgPT4gZS5hcHBseSh0LCBuKSxcblx0XHRjb25zdHJ1Y3Q6IChlLCB0KSA9PiBuZXcgZSguLi50KSxcblx0XHRkZWxldGVQcm9wZXJ0eTogKGUsIHQpID0+IGRlbGV0ZSBlW3RdLFxuXHRcdG93bktleXM6IChlKSA9PiBPYmplY3Qua2V5cyhlKSxcblx0XHRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I6IChlLCB0KSA9PiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGUsIHQpLFxuXHRcdGdldFByb3RvdHlwZU9mOiAoZSkgPT4gT2JqZWN0LmdldFByb3RvdHlwZU9mKGUpLFxuXHRcdHNldFByb3RvdHlwZU9mOiAoZSwgdCkgPT4gT2JqZWN0LnNldFByb3RvdHlwZU9mKGUsIHQpLFxuXHRcdGlzRXh0ZW5zaWJsZTogKGUpID0+IE9iamVjdC5pc0V4dGVuc2libGUoZSksXG5cdFx0cHJldmVudEV4dGVuc2lvbnM6IChlKSA9PiBPYmplY3QucHJldmVudEV4dGVuc2lvbnMoZSlcblx0fTtcblx0ZnVuY3Rpb24gUHQoZSwgdCwgbiwgcyA9IHt9KSB7XG5cdFx0Y29uc3QgeyBjaGFubmVsOiByID0gXCJcIiwgc2VuZGVyOiBpID0gXCJcIiwgcmVmbGVjdDogbyA9IFR0IH0gPSBzLCBhID0gcy50YXJnZXQgPz8gTCh0KSwgYyA9IFtdO1xuXHRcdGxldCBsID0gbnVsbCwgdSA9IHQ7XG5cdFx0c3dpdGNoIChTdHJpbmcoZSkudG9Mb3dlckNhc2UoKSkge1xuXHRcdFx0Y2FzZSBcImltcG9ydFwiOlxuXHRcdFx0Y2FzZSBkLklNUE9SVDpcblx0XHRcdFx0bCA9IGltcG9ydChcblx0XHRcdFx0XHQvKiBAdml0ZS1pZ25vcmUgKi9cblx0XHRcdFx0XHRuPy5bMF1cbik7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcInRyYW5zZmVyXCI6XG5cdFx0XHRjYXNlIGQuVFJBTlNGRVI6XG5cdFx0XHRcdHB0JDEoYSkgJiYgciAhPT0gaSAmJiBjLnB1c2goYSksIGwgPSBhO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCJnZXRcIjpcblx0XHRcdGNhc2UgZC5HRVQ6IHtcblx0XHRcdFx0Y29uc3QgcCA9IG4/LlswXSwgeSA9IG8uZ2V0Py4oYSwgcCkgPz8gYT8uW3BdO1xuXHRcdFx0XHRsID0gdHlwZW9mIHkgPT0gXCJmdW5jdGlvblwiICYmIGEgIT0gbnVsbCA/IHkuYmluZChhKSA6IHksIHUgPSBbLi4udCwgU3RyaW5nKHApXTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRjYXNlIFwic2V0XCI6XG5cdFx0XHRjYXNlIGQuU0VUOiB7XG5cdFx0XHRcdGNvbnN0IFtwLCB5XSA9IG4sIHggPSBPKHksIHZlKTtcblx0XHRcdFx0cy50YXJnZXQgPyBsID0gby5zZXQ/LihhLCBwLCB4KSA/PyAoYVtwXSA9IHgsICEwKSA6IGwgPSBvLnNldD8uKGEsIHAsIHgpID8/IGZlKFsuLi50LCBTdHJpbmcocCldLCB4KTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRjYXNlIFwiYXBwbHlcIjpcblx0XHRcdGNhc2UgXCJjYWxsXCI6XG5cdFx0XHRjYXNlIGQuQVBQTFk6XG5cdFx0XHRjYXNlIGQuQ0FMTDpcblx0XHRcdFx0aWYgKHR5cGVvZiBhID09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0XHRcdGNvbnN0IHAgPSBzLmNvbnRleHQgPz8gKHMudGFyZ2V0ID8gdm9pZCAwIDogTCh0LnNsaWNlKDAsIC0xKSkpLCB5ID0gTyhuPy5bMF0gPz8gbiA/PyBbXSwgdmUpO1xuXHRcdFx0XHRcdGwgPSBvLmFwcGx5Py4oYSwgcCwgeSkgPz8gYS5hcHBseShwLCB5KSwgcHQkMShsKSAmJiB0Py5hdCgtMSkgPT09IFwidHJhbnNmZXJcIiAmJiByICE9PSBpICYmIGMucHVzaChsKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCJjb25zdHJ1Y3RcIjpcblx0XHRcdGNhc2UgZC5DT05TVFJVQ1Q6XG5cdFx0XHRcdGlmICh0eXBlb2YgYSA9PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdFx0XHRjb25zdCBwID0gTyhuPy5bMF0gPz8gbiA/PyBbXSwgdmUpO1xuXHRcdFx0XHRcdGwgPSBvLmNvbnN0cnVjdD8uKGEsIHApID8/IG5ldyBhKC4uLnApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcImRlbGV0ZVwiOlxuXHRcdFx0Y2FzZSBcImRlbGV0ZXByb3BlcnR5XCI6XG5cdFx0XHRjYXNlIFwiZGlzcG9zZVwiOlxuXHRcdFx0Y2FzZSBkLkRFTEVURTpcblx0XHRcdGNhc2UgZC5ERUxFVEVfUFJPUEVSVFk6XG5cdFx0XHRjYXNlIGQuRElTUE9TRTpcblx0XHRcdFx0aWYgKHMudGFyZ2V0KSB7XG5cdFx0XHRcdFx0Y29uc3QgcCA9IHRbdC5sZW5ndGggLSAxXTtcblx0XHRcdFx0XHRsID0gby5kZWxldGVQcm9wZXJ0eT8uKGEsIHApID8/IGRlbGV0ZSBhW3BdO1xuXHRcdFx0XHR9IGVsc2UgbCA9IHQ/Lmxlbmd0aCA+IDAgPyBJdCh0KSA6IE9uKGEpLCBsICYmICh1ID0gRC5nZXQoYSkgPz8gW10pO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCJoYXNcIjpcblx0XHRcdGNhc2UgZC5IQVM6XG5cdFx0XHRcdGwgPSBvLmhhcz8uKGEsIG4/LlswXSkgPz8gKFIoYSkgPyBuPy5bMF0gaW4gYSA6ICExKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwib3dua2V5c1wiOlxuXHRcdFx0Y2FzZSBkLk9XTl9LRVlTOlxuXHRcdFx0XHRsID0gby5vd25LZXlzPy4oYSkgPz8gKFIoYSkgPyBPYmplY3Qua2V5cyhhKSA6IFtdKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwiZ2V0b3ducHJvcGVydHlkZXNjcmlwdG9yXCI6XG5cdFx0XHRjYXNlIFwiZ2V0cHJvcGVydHlkZXNjcmlwdG9yXCI6XG5cdFx0XHRjYXNlIGQuR0VUX09XTl9QUk9QRVJUWV9ERVNDUklQVE9SOlxuXHRcdFx0Y2FzZSBkLkdFVF9QUk9QRVJUWV9ERVNDUklQVE9SOlxuXHRcdFx0XHRsID0gby5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I/LihhLCBuPy5bMF0gPz8gdD8uYXQoLTEpID8/IFwiXCIpID8/IChSKGEpID8gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihhLCBuPy5bMF0gPz8gdD8uYXQoLTEpID8/IFwiXCIpIDogdm9pZCAwKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwiZ2V0cHJvdG90eXBlb2ZcIjpcblx0XHRcdGNhc2UgZC5HRVRfUFJPVE9UWVBFX09GOlxuXHRcdFx0XHRsID0gby5nZXRQcm90b3R5cGVPZj8uKGEpID8/IChSKGEpID8gT2JqZWN0LmdldFByb3RvdHlwZU9mKGEpIDogbnVsbCk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcInNldHByb3RvdHlwZW9mXCI6XG5cdFx0XHRjYXNlIGQuU0VUX1BST1RPVFlQRV9PRjpcblx0XHRcdFx0bCA9IG8uc2V0UHJvdG90eXBlT2Y/LihhLCBuPy5bMF0pID8/IChSKGEpID8gT2JqZWN0LnNldFByb3RvdHlwZU9mKGEsIG4/LlswXSkgOiAhMSk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcImlzZXh0ZW5zaWJsZVwiOlxuXHRcdFx0Y2FzZSBkLklTX0VYVEVOU0lCTEU6XG5cdFx0XHRcdGwgPSBvLmlzRXh0ZW5zaWJsZT8uKGEpID8/IChSKGEpID8gT2JqZWN0LmlzRXh0ZW5zaWJsZShhKSA6ICEwKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwicHJldmVudGV4dGVuc2lvbnNcIjpcblx0XHRcdGNhc2UgZC5QUkVWRU5UX0VYVEVOU0lPTlM6IGwgPSBvLnByZXZlbnRFeHRlbnNpb25zPy4oYSkgPz8gKFIoYSkgPyBPYmplY3QucHJldmVudEV4dGVuc2lvbnMoYSkgOiAhMSk7XG5cdFx0fVxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN1bHQ6IGwsXG5cdFx0XHR0b1RyYW5zZmVyOiBjLFxuXHRcdFx0cGF0aDogdVxuXHRcdH07XG5cdH1cblx0YXN5bmMgZnVuY3Rpb24gTXQoZSwgdCwgbiwgcywgciwgaSwgbykge1xuXHRcdGNvbnN0IGEgPSBhd2FpdCBpLCBjID0gcHQkMShhKSAmJiBvLmluY2x1ZGVzKGEpIHx8IGIoYSk7XG5cdFx0bGV0IGwgPSByO1xuXHRcdCFjICYmIHQgIT09IFwiZ2V0XCIgJiYgdCAhPT0gZC5HRVQgJiYgKHR5cGVvZiBhID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGEgPT0gXCJmdW5jdGlvblwiKSAmJiAoRG4oYSkgPyAobCA9IFskZSgpXSwgZmUobCwgYSkpIDogbCA9IEQuZ2V0KGEpID8/IFtdKTtcblx0XHRjb25zdCB1ID0gTChsKSwgcCA9IHQgPT09IFwiZ2V0XCIgfHwgdCA9PT0gZC5HRVQgPyBsPy5hdCgtMSkgOiB2b2lkIDAsIHkgPSBMKHIpLCB4ID0gTyhhLCAoc24pID0+IFJuKHNuLCBuLCBvKSkgPz8gYTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzcG9uc2U6IHtcblx0XHRcdFx0Y2hhbm5lbDogcyxcblx0XHRcdFx0c2VuZGVyOiBuLFxuXHRcdFx0XHRyZXFJZDogZSxcblx0XHRcdFx0YWN0aW9uOiB0LFxuXHRcdFx0XHR0eXBlOiBcInJlc3BvbnNlXCIsXG5cdFx0XHRcdHBheWxvYWQ6IHtcblx0XHRcdFx0XHRyZXN1bHQ6IGMgPyB4IDogbnVsbCxcblx0XHRcdFx0XHR0eXBlOiB0eXBlb2YgYSxcblx0XHRcdFx0XHRjaGFubmVsOiBzLFxuXHRcdFx0XHRcdHNlbmRlcjogbixcblx0XHRcdFx0XHRkZXNjcmlwdG9yOiB7XG5cdFx0XHRcdFx0XHQkaXNEZXNjcmlwdG9yOiAhMCxcblx0XHRcdFx0XHRcdHBhdGg6IGwsXG5cdFx0XHRcdFx0XHRvd25lcjogbixcblx0XHRcdFx0XHRcdGNoYW5uZWw6IG4sXG5cdFx0XHRcdFx0XHRwcmltaXRpdmU6IGcoYSksXG5cdFx0XHRcdFx0XHR3cml0YWJsZTogITAsXG5cdFx0XHRcdFx0XHRlbnVtZXJhYmxlOiAhMCxcblx0XHRcdFx0XHRcdGNvbmZpZ3VyYWJsZTogITAsXG5cdFx0XHRcdFx0XHRhcmd1bWVudENvdW50OiB5IGluc3RhbmNlb2YgRnVuY3Rpb24gPyB5Lmxlbmd0aCA6IC0xLFxuXHRcdFx0XHRcdFx0Li4uUih1KSAmJiBwICE9IG51bGwgPyBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHUsIHApIDoge31cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHR0cmFuc2Zlcjogb1xuXHRcdH07XG5cdH1cblx0YXN5bmMgZnVuY3Rpb24gRGUoZSwgdCwgbiwgcykge1xuXHRcdGNvbnN0IHsgY2hhbm5lbDogciwgc2VuZGVyOiBpLCBwYXRoOiBvLCBhY3Rpb246IGEsIGFyZ3M6IGMgfSA9IGU7XG5cdFx0aWYgKHIgIT09IG4pIHJldHVybiBudWxsO1xuXHRcdGNvbnN0IHsgcmVzdWx0OiBsLCB0b1RyYW5zZmVyOiB1LCBwYXRoOiBwIH0gPSBQdChhLCBvLCBjLCB7XG5cdFx0XHRjaGFubmVsOiByLFxuXHRcdFx0c2VuZGVyOiBpLFxuXHRcdFx0Li4uc1xuXHRcdH0pO1xuXHRcdHJldHVybiBNdCh0LCBhLCBuLCBpLCBwLCBsLCB1KTtcblx0fVxuXHRmdW5jdGlvbiBMbihlLCB0ID0gVHQpIHtcblx0XHRyZXR1cm4gYXN5bmMgKG4sIHMsIHIpID0+IHtcblx0XHRcdGxldCBpID0gZSwgbyA9IGU7XG5cdFx0XHRmb3IgKGxldCBjID0gMDsgYyA8IHMubGVuZ3RoOyBjKyspIGlmIChpID0gbywgbyA9IG8/LltzW2NdXSwgbyA9PT0gdm9pZCAwICYmIGMgPCBzLmxlbmd0aCAtIDEpIHRocm93IG5ldyBFcnJvcihgUGF0aCBzZWdtZW50ICcke3NbY119JyBub3QgZm91bmRgKTtcblx0XHRcdGNvbnN0IGEgPSBzW3MubGVuZ3RoIC0gMV07XG5cdFx0XHRzd2l0Y2ggKFN0cmluZyhuKS50b0xvd2VyQ2FzZSgpKSB7XG5cdFx0XHRcdGNhc2UgXCJnZXRcIjpcblx0XHRcdFx0Y2FzZSBkLkdFVDogcmV0dXJuIG87XG5cdFx0XHRcdGNhc2UgXCJzZXRcIjpcblx0XHRcdFx0Y2FzZSBkLlNFVDogcmV0dXJuIGlbYV0gPSByWzBdLCAhMDtcblx0XHRcdFx0Y2FzZSBcImNhbGxcIjpcblx0XHRcdFx0Y2FzZSBcImFwcGx5XCI6XG5cdFx0XHRcdGNhc2UgZC5BUFBMWTpcblx0XHRcdFx0Y2FzZSBkLkNBTEw6XG5cdFx0XHRcdFx0aWYgKHR5cGVvZiBvID09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0XHRcdFx0Y29uc3QgYyA9IEFycmF5LmlzQXJyYXkoclswXSkgPyByWzBdIDogcjtcblx0XHRcdFx0XHRcdHJldHVybiBhd2FpdCBvLmFwcGx5KGksIGMpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYCcke2F9JyBpcyBub3QgYSBmdW5jdGlvbmApO1xuXHRcdFx0XHRjYXNlIFwiY29uc3RydWN0XCI6XG5cdFx0XHRcdGNhc2UgZC5DT05TVFJVQ1Q6XG5cdFx0XHRcdFx0aWYgKHR5cGVvZiBvID09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0XHRcdFx0Y29uc3QgYyA9IEFycmF5LmlzQXJyYXkoclswXSkgPyByWzBdIDogcjtcblx0XHRcdFx0XHRcdHJldHVybiBuZXcgbyguLi5jKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGAnJHthfScgaXMgbm90IGEgY29uc3RydWN0b3JgKTtcblx0XHRcdFx0Y2FzZSBcImhhc1wiOlxuXHRcdFx0XHRjYXNlIGQuSEFTOiByZXR1cm4gYSBpbiBpO1xuXHRcdFx0XHRjYXNlIFwiZGVsZXRlXCI6XG5cdFx0XHRcdGNhc2UgXCJkZWxldGVwcm9wZXJ0eVwiOlxuXHRcdFx0XHRjYXNlIGQuREVMRVRFX1BST1BFUlRZOiByZXR1cm4gZGVsZXRlIGlbYV07XG5cdFx0XHRcdGNhc2UgXCJvd25rZXlzXCI6XG5cdFx0XHRcdGNhc2UgZC5PV05fS0VZUzogcmV0dXJuIE9iamVjdC5rZXlzKG8gPz8gaSk7XG5cdFx0XHRcdGRlZmF1bHQ6IHJldHVybiBvO1xuXHRcdFx0fVxuXHRcdH07XG5cdH1cblx0dmFyIEJuID0gY2xhc3Mge1xuXHRcdF9uYW1lO1xuXHRcdF90cmFuc3BvcnRUeXBlO1xuXHRcdF9pZCA9ICRlKCk7XG5cdFx0X3N0YXRlID0gXCJkaXNjb25uZWN0ZWRcIjtcblx0XHRfaW5ib3VuZCA9IG5ldyBfKHsgYnVmZmVyU2l6ZTogMWUzIH0pO1xuXHRcdF9vdXRib3VuZCA9IG5ldyBfKHsgYnVmZmVyU2l6ZTogMWUzIH0pO1xuXHRcdF9zdGF0ZUNoYW5nZXMgPSBuZXcgXygpO1xuXHRcdF9jb25uZWN0ZWRQZWVycyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG5cdFx0X3N1YnMgPSBbXTtcblx0XHRfc3RhdHMgPSB7XG5cdFx0XHRtZXNzYWdlc1NlbnQ6IDAsXG5cdFx0XHRtZXNzYWdlc1JlY2VpdmVkOiAwLFxuXHRcdFx0Ynl0ZXNUcmFuc2ZlcnJlZDogMCxcblx0XHRcdGxhdGVuY3lNczogMCxcblx0XHRcdHVwdGltZTogMCxcblx0XHRcdHJlY29ubmVjdENvdW50OiAwXG5cdFx0fTtcblx0XHRfc3RhcnRUaW1lID0gMDtcblx0XHRfcGVuZGluZyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG5cdFx0X2J1ZmZlciA9IFtdO1xuXHRcdF9vcHRzO1xuXHRcdGNvbnN0cnVjdG9yKGUsIHQgPSBcImludGVybmFsXCIsIG4gPSB7fSkge1xuXHRcdFx0dGhpcy5fbmFtZSA9IGUsIHRoaXMuX3RyYW5zcG9ydFR5cGUgPSB0LCB0aGlzLl9vcHRzID0ge1xuXHRcdFx0XHR0aW1lb3V0OiAzZTQsXG5cdFx0XHRcdGF1dG9SZWNvbm5lY3Q6ICEwLFxuXHRcdFx0XHRyZWNvbm5lY3RJbnRlcnZhbDogMWUzLFxuXHRcdFx0XHRtYXhSZWNvbm5lY3RBdHRlbXB0czogNSxcblx0XHRcdFx0YnVmZmVyTWVzc2FnZXM6ICEwLFxuXHRcdFx0XHRidWZmZXJTaXplOiAxZTMsXG5cdFx0XHRcdG1ldGFkYXRhOiB7fSxcblx0XHRcdFx0Li4ublxuXHRcdFx0fSwgdGhpcy5fc2V0dXBTdWJzY3JpcHRpb25zKCk7XG5cdFx0fVxuXHRcdHN1YnNjcmliZShlLCB0KSB7XG5cdFx0XHRyZXR1cm4gKHQgPyB1dCgobikgPT4gbi5zZW5kZXIgPT09IHQpKHRoaXMuX2luYm91bmQpIDogdGhpcy5faW5ib3VuZCkuc3Vic2NyaWJlKHR5cGVvZiBlID09IFwiZnVuY3Rpb25cIiA/IHsgbmV4dDogZSB9IDogZSk7XG5cdFx0fVxuXHRcdG5leHQoZSkge1xuXHRcdFx0aWYgKHRoaXMuX3N0YXRlICE9PSBcImNvbm5lY3RlZFwiKSB7XG5cdFx0XHRcdHRoaXMuX29wdHMuYnVmZmVyTWVzc2FnZXMgJiYgdGhpcy5fYnVmZmVyLmxlbmd0aCA8IHRoaXMuX29wdHMuYnVmZmVyU2l6ZSAmJiB0aGlzLl9idWZmZXIucHVzaChlKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5fb3V0Ym91bmQubmV4dChlKSwgdGhpcy5fc3RhdHMubWVzc2FnZXNTZW50Kys7XG5cdFx0fVxuXHRcdGFzeW5jIHJlcXVlc3QoZSwgdCwgbiA9IHt9KSB7XG5cdFx0XHRjb25zdCBzID0gJGUoKSwgciA9IFByb21pc2Uud2l0aFJlc29sdmVycygpO1xuXHRcdFx0dGhpcy5fcGVuZGluZy5zZXQocywgcik7XG5cdFx0XHRjb25zdCBpID0gc2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdHRoaXMuX3BlbmRpbmcuaGFzKHMpICYmICh0aGlzLl9wZW5kaW5nLmRlbGV0ZShzKSwgci5yZWplY3QoLyogQF9fUFVSRV9fICovIG5ldyBFcnJvcihcIlJlcXVlc3QgdGltZW91dFwiKSkpO1xuXHRcdFx0fSwgbi50aW1lb3V0ID8/IHRoaXMuX29wdHMudGltZW91dCk7XG5cdFx0XHRyZXR1cm4gdGhpcy5uZXh0KHtcblx0XHRcdFx0aWQ6ICRlKCksXG5cdFx0XHRcdGNoYW5uZWw6IGUsXG5cdFx0XHRcdHNlbmRlcjogdGhpcy5fbmFtZSxcblx0XHRcdFx0dHlwZTogXCJyZXF1ZXN0XCIsXG5cdFx0XHRcdHJlcUlkOiBzLFxuXHRcdFx0XHRwYXlsb2FkOiB7XG5cdFx0XHRcdFx0Li4udCxcblx0XHRcdFx0XHRhY3Rpb246IG4uYWN0aW9uLFxuXHRcdFx0XHRcdHBhdGg6IG4ucGF0aFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR0aW1lc3RhbXA6IERhdGUubm93KClcblx0XHRcdH0pLCByLnByb21pc2UuZmluYWxseSgoKSA9PiBjbGVhclRpbWVvdXQoaSkpO1xuXHRcdH1cblx0XHRyZXNwb25kKGUsIHQpIHtcblx0XHRcdHRoaXMubmV4dCh7XG5cdFx0XHRcdGlkOiAkZSgpLFxuXHRcdFx0XHRjaGFubmVsOiBlLnNlbmRlcixcblx0XHRcdFx0c2VuZGVyOiB0aGlzLl9uYW1lLFxuXHRcdFx0XHR0eXBlOiBcInJlc3BvbnNlXCIsXG5cdFx0XHRcdHJlcUlkOiBlLnJlcUlkLFxuXHRcdFx0XHRwYXlsb2FkOiB0LFxuXHRcdFx0XHR0aW1lc3RhbXA6IERhdGUubm93KClcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRlbWl0KGUsIHQsIG4pIHtcblx0XHRcdHRoaXMubmV4dCh7XG5cdFx0XHRcdGlkOiAkZSgpLFxuXHRcdFx0XHRjaGFubmVsOiBlLFxuXHRcdFx0XHRzZW5kZXI6IHRoaXMuX25hbWUsXG5cdFx0XHRcdHR5cGU6IFwiZXZlbnRcIixcblx0XHRcdFx0cGF5bG9hZDoge1xuXHRcdFx0XHRcdHR5cGU6IHQsXG5cdFx0XHRcdFx0ZGF0YTogblxuXHRcdFx0XHR9LFxuXHRcdFx0XHR0aW1lc3RhbXA6IERhdGUubm93KClcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRzdWJzY3JpYmVPdXRib3VuZChlKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fb3V0Ym91bmQuc3Vic2NyaWJlKHR5cGVvZiBlID09IFwiZnVuY3Rpb25cIiA/IHsgbmV4dDogZSB9IDogZSk7XG5cdFx0fVxuXHRcdHB1c2hJbmJvdW5kKGUpIHtcblx0XHRcdGlmICh0aGlzLl9zdGF0cy5tZXNzYWdlc1JlY2VpdmVkKyssIGUudHlwZSA9PT0gXCJyZXNwb25zZVwiICYmIGUucmVxSWQpIHtcblx0XHRcdFx0Y29uc3QgdCA9IHRoaXMuX3BlbmRpbmcuZ2V0KGUucmVxSWQpO1xuXHRcdFx0XHRpZiAodCkge1xuXHRcdFx0XHRcdHRoaXMuX3BlbmRpbmcuZGVsZXRlKGUucmVxSWQpLCB0LnJlc29sdmUoZS5wYXlsb2FkKTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHRoaXMuX2luYm91bmQubmV4dChlKTtcblx0XHR9XG5cdFx0YXN5bmMgY29ubmVjdCgpIHtcblx0XHRcdHRoaXMuX3N0YXRlICE9PSBcImNvbm5lY3RlZFwiICYmICh0aGlzLl9zZXRTdGF0ZShcImNvbm5lY3RpbmdcIiksIHRoaXMuX3N0YXJ0VGltZSA9IERhdGUubm93KCksIHRoaXMuX3NldFN0YXRlKFwiY29ubmVjdGVkXCIpLCB0aGlzLl9mbHVzaEJ1ZmZlcigpKTtcblx0XHR9XG5cdFx0ZGlzY29ubmVjdCgpIHtcblx0XHRcdHRoaXMuX3N0YXRlID09PSBcImRpc2Nvbm5lY3RlZFwiIHx8IHRoaXMuX3N0YXRlID09PSBcImNsb3NlZFwiIHx8ICh0aGlzLl9zZXRTdGF0ZShcImRpc2Nvbm5lY3RlZFwiKSwgdGhpcy5fc3Vicy5mb3JFYWNoKChlKSA9PiBlLnVuc3Vic2NyaWJlKCkpLCB0aGlzLl9zdWJzID0gW10pO1xuXHRcdH1cblx0XHRjbG9zZSgpIHtcblx0XHRcdHRoaXMuZGlzY29ubmVjdCgpLCB0aGlzLl9zZXRTdGF0ZShcImNsb3NlZFwiKSwgdGhpcy5faW5ib3VuZC5jb21wbGV0ZSgpLCB0aGlzLl9vdXRib3VuZC5jb21wbGV0ZSgpLCB0aGlzLl9zdGF0ZUNoYW5nZXMuY29tcGxldGUoKTtcblx0XHR9XG5cdFx0bWFya0Nvbm5lY3RlZCgpIHtcblx0XHRcdHRoaXMuX3NldFN0YXRlKFwiY29ubmVjdGVkXCIpLCB0aGlzLl9mbHVzaEJ1ZmZlcigpO1xuXHRcdH1cblx0XHRtYXJrRGlzY29ubmVjdGVkKCkge1xuXHRcdFx0dGhpcy5fc2V0U3RhdGUoXCJkaXNjb25uZWN0ZWRcIik7XG5cdFx0fVxuXHRcdF9zZXRTdGF0ZShlKSB7XG5cdFx0XHR0aGlzLl9zdGF0ZSAhPT0gZSAmJiAodGhpcy5fc3RhdGUgPSBlLCB0aGlzLl9zdGF0ZUNoYW5nZXMubmV4dChlKSk7XG5cdFx0fVxuXHRcdF9mbHVzaEJ1ZmZlcigpIHtcblx0XHRcdGZvciAoY29uc3QgZSBvZiB0aGlzLl9idWZmZXIpIHRoaXMuX291dGJvdW5kLm5leHQoZSk7XG5cdFx0XHR0aGlzLl9idWZmZXIgPSBbXTtcblx0XHR9XG5cdFx0X3NldHVwU3Vic2NyaXB0aW9ucygpIHtcblx0XHRcdHRoaXMuX3N1YnMucHVzaCh0aGlzLl9pbmJvdW5kLnN1YnNjcmliZSh7IG5leHQ6IChlKSA9PiB7XG5cdFx0XHRcdGUudHlwZSA9PT0gXCJzaWduYWxcIiAmJiBlLnBheWxvYWQ/LnR5cGUgPT09IFwiY29ubmVjdFwiICYmIHRoaXMuX2Nvbm5lY3RlZFBlZXJzLnNldChlLnNlbmRlciwge1xuXHRcdFx0XHRcdG5hbWU6IGUuc2VuZGVyLFxuXHRcdFx0XHRcdHN0YXRlOiBcImNvbm5lY3RlZFwiLFxuXHRcdFx0XHRcdGlzSG9zdDogITFcblx0XHRcdFx0fSk7XG5cdFx0XHR9IH0pKTtcblx0XHR9XG5cdFx0Z2V0IGlkKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2lkO1xuXHRcdH1cblx0XHRnZXQgbmFtZSgpIHtcblx0XHRcdHJldHVybiB0aGlzLl9uYW1lO1xuXHRcdH1cblx0XHRnZXQgc3RhdGUoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fc3RhdGU7XG5cdFx0fVxuXHRcdGdldCB0cmFuc3BvcnRUeXBlKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX3RyYW5zcG9ydFR5cGU7XG5cdFx0fVxuXHRcdGdldCBzdGF0cygpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdC4uLnRoaXMuX3N0YXRzLFxuXHRcdFx0XHR1cHRpbWU6IHRoaXMuX3N0YXJ0VGltZSA/IERhdGUubm93KCkgLSB0aGlzLl9zdGFydFRpbWUgOiAwXG5cdFx0XHR9O1xuXHRcdH1cblx0XHRnZXQgc3RhdGVDaGFuZ2VzKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX3N0YXRlQ2hhbmdlcztcblx0XHR9XG5cdFx0Z2V0IGNvbm5lY3RlZFBlZXJzKCkge1xuXHRcdFx0cmV0dXJuIFsuLi50aGlzLl9jb25uZWN0ZWRQZWVycy5rZXlzKCldO1xuXHRcdH1cblx0XHRnZXQgbWV0YSgpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGlkOiB0aGlzLl9pZCxcblx0XHRcdFx0bmFtZTogdGhpcy5fbmFtZSxcblx0XHRcdFx0c3RhdGU6IHRoaXMuX3N0YXRlLFxuXHRcdFx0XHRpc0hvc3Q6ICExLFxuXHRcdFx0XHRjb25uZWN0ZWRDaGFubmVsczogbmV3IFNldCh0aGlzLl9jb25uZWN0ZWRQZWVycy5rZXlzKCkpXG5cdFx0XHR9O1xuXHRcdH1cblx0fTtcblx0dmFyIFduID0gY2xhc3MgWSB7XG5cdFx0X2Nvbm5lY3Rpb25zID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0XHRzdGF0aWMgX2luc3RhbmNlID0gbnVsbDtcblx0XHRzdGF0aWMgZ2V0SW5zdGFuY2UoKSB7XG5cdFx0XHRyZXR1cm4gWS5faW5zdGFuY2UgfHwgKFkuX2luc3RhbmNlID0gbmV3IFkoKSksIFkuX2luc3RhbmNlO1xuXHRcdH1cblx0XHRnZXRPckNyZWF0ZSh0LCBuID0gXCJpbnRlcm5hbFwiLCBzID0ge30pIHtcblx0XHRcdHJldHVybiB0aGlzLl9jb25uZWN0aW9ucy5oYXModCkgfHwgdGhpcy5fY29ubmVjdGlvbnMuc2V0KHQsIG5ldyBCbih0LCBuLCBzKSksIHRoaXMuX2Nvbm5lY3Rpb25zLmdldCh0KTtcblx0XHR9XG5cdFx0Z2V0KHQpIHtcblx0XHRcdHJldHVybiB0aGlzLl9jb25uZWN0aW9ucy5nZXQodCk7XG5cdFx0fVxuXHRcdGhhcyh0KSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY29ubmVjdGlvbnMuaGFzKHQpO1xuXHRcdH1cblx0XHRkZWxldGUodCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2Nvbm5lY3Rpb25zLmdldCh0KT8uY2xvc2UoKSwgdGhpcy5fY29ubmVjdGlvbnMuZGVsZXRlKHQpO1xuXHRcdH1cblx0XHRjbGVhcigpIHtcblx0XHRcdHRoaXMuX2Nvbm5lY3Rpb25zLmZvckVhY2goKHQpID0+IHQuY2xvc2UoKSksIHRoaXMuX2Nvbm5lY3Rpb25zLmNsZWFyKCk7XG5cdFx0fVxuXHRcdGdldCBzaXplKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2Nvbm5lY3Rpb25zLnNpemU7XG5cdFx0fVxuXHRcdGdldCBuYW1lcygpIHtcblx0XHRcdHJldHVybiBbLi4udGhpcy5fY29ubmVjdGlvbnMua2V5cygpXTtcblx0XHR9XG5cdH07XG5cdHZhciBMZSA9ICgpID0+IFduLmdldEluc3RhbmNlKCk7XG5cdHZhciBBdCA9IChlLCB0LCBuKSA9PiBMZSgpLmdldE9yQ3JlYXRlKGUsIHQsIG4pO1xuXHR2YXIgWW4gPSBcInVuaWZvcm1fY2hhbm5lbHNcIjtcblx0dmFyIEpuID0gMTtcblx0dmFyIGYgPSB7XG5cdFx0TUVTU0FHRVM6IFwibWVzc2FnZXNcIixcblx0XHRNQUlMQk9YOiBcIm1haWxib3hcIixcblx0XHRQRU5ESU5HOiBcInBlbmRpbmdcIixcblx0XHRFWENIQU5HRTogXCJleGNoYW5nZVwiLFxuXHRcdFRSQU5TQUNUSU9OUzogXCJ0cmFuc2FjdGlvbnNcIlxuXHR9O1xuXHR2YXIgWG4gPSBjbGFzcyB7XG5cdFx0X2RiID0gbnVsbDtcblx0XHRfaXNPcGVuID0gITE7XG5cdFx0X29wZW5Qcm9taXNlID0gbnVsbDtcblx0XHRfY2hhbm5lbE5hbWU7XG5cdFx0X21lc3NhZ2VVcGRhdGVzID0gbmV3IF8oKTtcblx0XHRfZXhjaGFuZ2VVcGRhdGVzID0gbmV3IF8oKTtcblx0XHRjb25zdHJ1Y3RvcihlKSB7XG5cdFx0XHR0aGlzLl9jaGFubmVsTmFtZSA9IGU7XG5cdFx0fVxuXHRcdGFzeW5jIG9wZW4oKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fZGIgJiYgdGhpcy5faXNPcGVuID8gdGhpcy5fZGIgOiB0aGlzLl9vcGVuUHJvbWlzZSA/IHRoaXMuX29wZW5Qcm9taXNlIDogKHRoaXMuX29wZW5Qcm9taXNlID0gbmV3IFByb21pc2UoKGUsIHQpID0+IHtcblx0XHRcdFx0Y29uc3QgbiA9IGluZGV4ZWREQi5vcGVuKFluLCBKbik7XG5cdFx0XHRcdG4ub25lcnJvciA9ICgpID0+IHtcblx0XHRcdFx0XHR0aGlzLl9vcGVuUHJvbWlzZSA9IG51bGwsIHQoLyogQF9fUFVSRV9fICovIG5ldyBFcnJvcihcIkZhaWxlZCB0byBvcGVuIEluZGV4ZWREQlwiKSk7XG5cdFx0XHRcdH0sIG4ub25zdWNjZXNzID0gKCkgPT4ge1xuXHRcdFx0XHRcdHRoaXMuX2RiID0gbi5yZXN1bHQsIHRoaXMuX2lzT3BlbiA9ICEwLCB0aGlzLl9vcGVuUHJvbWlzZSA9IG51bGwsIGUodGhpcy5fZGIpO1xuXHRcdFx0XHR9LCBuLm9udXBncmFkZW5lZWRlZCA9IChzKSA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgciA9IHMudGFyZ2V0LnJlc3VsdDtcblx0XHRcdFx0XHR0aGlzLl9jcmVhdGVTdG9yZXMocik7XG5cdFx0XHRcdH07XG5cdFx0XHR9KSwgdGhpcy5fb3BlblByb21pc2UpO1xuXHRcdH1cblx0XHRjbG9zZSgpIHtcblx0XHRcdHRoaXMuX2RiICYmICh0aGlzLl9kYi5jbG9zZSgpLCB0aGlzLl9kYiA9IG51bGwsIHRoaXMuX2lzT3BlbiA9ICExKTtcblx0XHR9XG5cdFx0X2NyZWF0ZVN0b3JlcyhlKSB7XG5cdFx0XHRpZiAoIWUub2JqZWN0U3RvcmVOYW1lcy5jb250YWlucyhmLk1FU1NBR0VTKSkge1xuXHRcdFx0XHRjb25zdCB0ID0gZS5jcmVhdGVPYmplY3RTdG9yZShmLk1FU1NBR0VTLCB7IGtleVBhdGg6IFwiaWRcIiB9KTtcblx0XHRcdFx0dC5jcmVhdGVJbmRleChcImNoYW5uZWxcIiwgXCJjaGFubmVsXCIsIHsgdW5pcXVlOiAhMSB9KSwgdC5jcmVhdGVJbmRleChcInN0YXR1c1wiLCBcInN0YXR1c1wiLCB7IHVuaXF1ZTogITEgfSksIHQuY3JlYXRlSW5kZXgoXCJyZWNpcGllbnRcIiwgXCJyZWNpcGllbnRcIiwgeyB1bmlxdWU6ICExIH0pLCB0LmNyZWF0ZUluZGV4KFwiY3JlYXRlZEF0XCIsIFwiY3JlYXRlZEF0XCIsIHsgdW5pcXVlOiAhMSB9KSwgdC5jcmVhdGVJbmRleChcImNoYW5uZWxfc3RhdHVzXCIsIFtcImNoYW5uZWxcIiwgXCJzdGF0dXNcIl0sIHsgdW5pcXVlOiAhMSB9KTtcblx0XHRcdH1cblx0XHRcdGlmICghZS5vYmplY3RTdG9yZU5hbWVzLmNvbnRhaW5zKGYuTUFJTEJPWCkpIHtcblx0XHRcdFx0Y29uc3QgdCA9IGUuY3JlYXRlT2JqZWN0U3RvcmUoZi5NQUlMQk9YLCB7IGtleVBhdGg6IFwiaWRcIiB9KTtcblx0XHRcdFx0dC5jcmVhdGVJbmRleChcImNoYW5uZWxcIiwgXCJjaGFubmVsXCIsIHsgdW5pcXVlOiAhMSB9KSwgdC5jcmVhdGVJbmRleChcInByaW9yaXR5XCIsIFwicHJpb3JpdHlcIiwgeyB1bmlxdWU6ICExIH0pLCB0LmNyZWF0ZUluZGV4KFwiZXhwaXJlc0F0XCIsIFwiZXhwaXJlc0F0XCIsIHsgdW5pcXVlOiAhMSB9KTtcblx0XHRcdH1cblx0XHRcdGlmICghZS5vYmplY3RTdG9yZU5hbWVzLmNvbnRhaW5zKGYuUEVORElORykpIHtcblx0XHRcdFx0Y29uc3QgdCA9IGUuY3JlYXRlT2JqZWN0U3RvcmUoZi5QRU5ESU5HLCB7IGtleVBhdGg6IFwiaWRcIiB9KTtcblx0XHRcdFx0dC5jcmVhdGVJbmRleChcImNoYW5uZWxcIiwgXCJjaGFubmVsXCIsIHsgdW5pcXVlOiAhMSB9KSwgdC5jcmVhdGVJbmRleChcImNyZWF0ZWRBdFwiLCBcImNyZWF0ZWRBdFwiLCB7IHVuaXF1ZTogITEgfSk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoIWUub2JqZWN0U3RvcmVOYW1lcy5jb250YWlucyhmLkVYQ0hBTkdFKSkge1xuXHRcdFx0XHRjb25zdCB0ID0gZS5jcmVhdGVPYmplY3RTdG9yZShmLkVYQ0hBTkdFLCB7IGtleVBhdGg6IFwiaWRcIiB9KTtcblx0XHRcdFx0dC5jcmVhdGVJbmRleChcImtleVwiLCBcImtleVwiLCB7IHVuaXF1ZTogITAgfSksIHQuY3JlYXRlSW5kZXgoXCJvd25lclwiLCBcIm93bmVyXCIsIHsgdW5pcXVlOiAhMSB9KTtcblx0XHRcdH1cblx0XHRcdGUub2JqZWN0U3RvcmVOYW1lcy5jb250YWlucyhmLlRSQU5TQUNUSU9OUykgfHwgZS5jcmVhdGVPYmplY3RTdG9yZShmLlRSQU5TQUNUSU9OUywgeyBrZXlQYXRoOiBcImlkXCIgfSkuY3JlYXRlSW5kZXgoXCJjcmVhdGVkQXRcIiwgXCJjcmVhdGVkQXRcIiwgeyB1bmlxdWU6ICExIH0pO1xuXHRcdH1cblx0XHRhc3luYyBkZWZlcihlLCB0ID0ge30pIHtcblx0XHRcdGNvbnN0IG4gPSBhd2FpdCB0aGlzLm9wZW4oKSwgcyA9IHtcblx0XHRcdFx0aWQ6ICRlKCksXG5cdFx0XHRcdGNoYW5uZWw6IGUuY2hhbm5lbCxcblx0XHRcdFx0c2VuZGVyOiBlLnNlbmRlciA/PyB0aGlzLl9jaGFubmVsTmFtZSxcblx0XHRcdFx0cmVjaXBpZW50OiBlLmNoYW5uZWwsXG5cdFx0XHRcdHR5cGU6IGUudHlwZSxcblx0XHRcdFx0cGF5bG9hZDogZS5wYXlsb2FkLFxuXHRcdFx0XHRzdGF0dXM6IFwicGVuZGluZ1wiLFxuXHRcdFx0XHRwcmlvcml0eTogdC5wcmlvcml0eSA/PyAwLFxuXHRcdFx0XHRjcmVhdGVkQXQ6IERhdGUubm93KCksXG5cdFx0XHRcdHVwZGF0ZWRBdDogRGF0ZS5ub3coKSxcblx0XHRcdFx0ZXhwaXJlc0F0OiB0LmV4cGlyZXNJbiA/IERhdGUubm93KCkgKyB0LmV4cGlyZXNJbiA6IG51bGwsXG5cdFx0XHRcdHJldHJ5Q291bnQ6IDAsXG5cdFx0XHRcdG1heFJldHJpZXM6IHQubWF4UmV0cmllcyA/PyAzLFxuXHRcdFx0XHRtZXRhZGF0YTogdC5tZXRhZGF0YVxuXHRcdFx0fTtcblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZSgociwgaSkgPT4ge1xuXHRcdFx0XHRjb25zdCBvID0gbi50cmFuc2FjdGlvbihbZi5NRVNTQUdFUywgZi5NQUlMQk9YXSwgXCJyZWFkd3JpdGVcIiksIGEgPSBvLm9iamVjdFN0b3JlKGYuTUVTU0FHRVMpLCBjID0gby5vYmplY3RTdG9yZShmLk1BSUxCT1gpO1xuXHRcdFx0XHRhLmFkZChzKSwgYy5hZGQocyksIG8ub25jb21wbGV0ZSA9ICgpID0+IHtcblx0XHRcdFx0XHR0aGlzLl9tZXNzYWdlVXBkYXRlcy5uZXh0KHMpLCByKHMuaWQpO1xuXHRcdFx0XHR9LCBvLm9uZXJyb3IgPSAoKSA9PiBpKC8qIEBfX1BVUkVfXyAqLyBuZXcgRXJyb3IoXCJGYWlsZWQgdG8gZGVmZXIgbWVzc2FnZVwiKSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0YXN5bmMgZ2V0RGVmZXJyZWRNZXNzYWdlcyhlLCB0ID0ge30pIHtcblx0XHRcdGNvbnN0IG4gPSBhd2FpdCB0aGlzLm9wZW4oKTtcblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZSgocywgcikgPT4ge1xuXHRcdFx0XHRjb25zdCBpID0gbi50cmFuc2FjdGlvbihmLk1FU1NBR0VTLCBcInJlYWRvbmx5XCIpLm9iamVjdFN0b3JlKGYuTUVTU0FHRVMpLCBvID0gdC5zdGF0dXMgPyBpLmluZGV4KFwiY2hhbm5lbF9zdGF0dXNcIikgOiBpLmluZGV4KFwiY2hhbm5lbFwiKSwgYSA9IHQuc3RhdHVzID8gSURCS2V5UmFuZ2Uub25seShbZSwgdC5zdGF0dXNdKSA6IElEQktleVJhbmdlLm9ubHkoZSksIGMgPSBvLmdldEFsbChhLCB0LmxpbWl0KTtcblx0XHRcdFx0Yy5vbnN1Y2Nlc3MgPSAoKSA9PiB7XG5cdFx0XHRcdFx0bGV0IGwgPSBjLnJlc3VsdDtcblx0XHRcdFx0XHR0Lm9mZnNldCAmJiAobCA9IGwuc2xpY2UodC5vZmZzZXQpKSwgcyhsKTtcblx0XHRcdFx0fSwgYy5vbmVycm9yID0gKCkgPT4gcigvKiBAX19QVVJFX18gKi8gbmV3IEVycm9yKFwiRmFpbGVkIHRvIGdldCBkZWZlcnJlZCBtZXNzYWdlc1wiKSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0YXN5bmMgcHJvY2Vzc05leHRQZW5kaW5nKGUpIHtcblx0XHRcdGNvbnN0IHQgPSBhd2FpdCB0aGlzLm9wZW4oKTtcblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZSgobiwgcykgPT4ge1xuXHRcdFx0XHRjb25zdCByID0gdC50cmFuc2FjdGlvbihmLk1FU1NBR0VTLCBcInJlYWR3cml0ZVwiKS5vYmplY3RTdG9yZShmLk1FU1NBR0VTKS5pbmRleChcImNoYW5uZWxfc3RhdHVzXCIpLm9wZW5DdXJzb3IoSURCS2V5UmFuZ2Uub25seShbZSwgXCJwZW5kaW5nXCJdKSk7XG5cdFx0XHRcdHIub25zdWNjZXNzID0gKCkgPT4ge1xuXHRcdFx0XHRcdGNvbnN0IGkgPSByLnJlc3VsdDtcblx0XHRcdFx0XHRpZiAoaSkge1xuXHRcdFx0XHRcdFx0Y29uc3QgbyA9IGkudmFsdWU7XG5cdFx0XHRcdFx0XHRvLnN0YXR1cyA9IFwicHJvY2Vzc2luZ1wiLCBvLnVwZGF0ZWRBdCA9IERhdGUubm93KCksIGkudXBkYXRlKG8pLCB0aGlzLl9tZXNzYWdlVXBkYXRlcy5uZXh0KG8pLCBuKG8pO1xuXHRcdFx0XHRcdH0gZWxzZSBuKG51bGwpO1xuXHRcdFx0XHR9LCByLm9uZXJyb3IgPSAoKSA9PiBzKC8qIEBfX1BVUkVfXyAqLyBuZXcgRXJyb3IoXCJGYWlsZWQgdG8gcHJvY2VzcyBwZW5kaW5nIG1lc3NhZ2VcIikpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdGFzeW5jIG1hcmtEZWxpdmVyZWQoZSkge1xuXHRcdFx0YXdhaXQgdGhpcy5fdXBkYXRlTWVzc2FnZVN0YXR1cyhlLCBcImRlbGl2ZXJlZFwiKTtcblx0XHR9XG5cdFx0YXN5bmMgbWFya0ZhaWxlZChlKSB7XG5cdFx0XHRjb25zdCB0ID0gYXdhaXQgdGhpcy5vcGVuKCk7XG5cdFx0XHRyZXR1cm4gbmV3IFByb21pc2UoKG4sIHMpID0+IHtcblx0XHRcdFx0Y29uc3QgciA9IHQudHJhbnNhY3Rpb24oZi5NRVNTQUdFUywgXCJyZWFkd3JpdGVcIikub2JqZWN0U3RvcmUoZi5NRVNTQUdFUyksIGkgPSByLmdldChlKTtcblx0XHRcdFx0aS5vbnN1Y2Nlc3MgPSAoKSA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgbyA9IGkucmVzdWx0O1xuXHRcdFx0XHRcdGlmICghbykge1xuXHRcdFx0XHRcdFx0bighMSk7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdG8ucmV0cnlDb3VudCsrLCBvLnVwZGF0ZWRBdCA9IERhdGUubm93KCksIG8ucmV0cnlDb3VudCA8IG8ubWF4UmV0cmllcyA/IG8uc3RhdHVzID0gXCJwZW5kaW5nXCIgOiBvLnN0YXR1cyA9IFwiZmFpbGVkXCIsIHIucHV0KG8pLCB0aGlzLl9tZXNzYWdlVXBkYXRlcy5uZXh0KG8pLCBuKG8uc3RhdHVzID09PSBcInBlbmRpbmdcIik7XG5cdFx0XHRcdH0sIGkub25lcnJvciA9ICgpID0+IHMoLyogQF9fUFVSRV9fICovIG5ldyBFcnJvcihcIkZhaWxlZCB0byBtYXJrIG1lc3NhZ2UgYXMgZmFpbGVkXCIpKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRhc3luYyBfdXBkYXRlTWVzc2FnZVN0YXR1cyhlLCB0KSB7XG5cdFx0XHRjb25zdCBuID0gYXdhaXQgdGhpcy5vcGVuKCk7XG5cdFx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHMsIHIpID0+IHtcblx0XHRcdFx0Y29uc3QgaSA9IG4udHJhbnNhY3Rpb24oZi5NRVNTQUdFUywgXCJyZWFkd3JpdGVcIikub2JqZWN0U3RvcmUoZi5NRVNTQUdFUyksIG8gPSBpLmdldChlKTtcblx0XHRcdFx0by5vbnN1Y2Nlc3MgPSAoKSA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgYSA9IG8ucmVzdWx0O1xuXHRcdFx0XHRcdGEgJiYgKGEuc3RhdHVzID0gdCwgYS51cGRhdGVkQXQgPSBEYXRlLm5vdygpLCBpLnB1dChhKSwgdGhpcy5fbWVzc2FnZVVwZGF0ZXMubmV4dChhKSksIHMoKTtcblx0XHRcdFx0fSwgby5vbmVycm9yID0gKCkgPT4gcigvKiBAX19QVVJFX18gKi8gbmV3IEVycm9yKFwiRmFpbGVkIHRvIHVwZGF0ZSBtZXNzYWdlIHN0YXR1c1wiKSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0YXN5bmMgZ2V0TWFpbGJveChlLCB0ID0ge30pIHtcblx0XHRcdGNvbnN0IG4gPSBhd2FpdCB0aGlzLm9wZW4oKTtcblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZSgocywgcikgPT4ge1xuXHRcdFx0XHRjb25zdCBpID0gbi50cmFuc2FjdGlvbihmLk1BSUxCT1gsIFwicmVhZG9ubHlcIikub2JqZWN0U3RvcmUoZi5NQUlMQk9YKS5pbmRleChcImNoYW5uZWxcIikuZ2V0QWxsKElEQktleVJhbmdlLm9ubHkoZSksIHQubGltaXQpO1xuXHRcdFx0XHRpLm9uc3VjY2VzcyA9ICgpID0+IHtcblx0XHRcdFx0XHRsZXQgbyA9IGkucmVzdWx0O1xuXHRcdFx0XHRcdHQuc29ydEJ5ID09PSBcInByaW9yaXR5XCIgPyBvLnNvcnQoKGEsIGMpID0+IGMucHJpb3JpdHkgLSBhLnByaW9yaXR5KSA6IG8uc29ydCgoYSwgYykgPT4gYy5jcmVhdGVkQXQgLSBhLmNyZWF0ZWRBdCksIHMobyk7XG5cdFx0XHRcdH0sIGkub25lcnJvciA9ICgpID0+IHIoLyogQF9fUFVSRV9fICovIG5ldyBFcnJvcihcIkZhaWxlZCB0byBnZXQgbWFpbGJveFwiKSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0YXN5bmMgZ2V0TWFpbGJveFN0YXRzKGUpIHtcblx0XHRcdGNvbnN0IHQgPSBhd2FpdCB0aGlzLmdldERlZmVycmVkTWVzc2FnZXMoZSksIG4gPSB7XG5cdFx0XHRcdHRvdGFsOiB0Lmxlbmd0aCxcblx0XHRcdFx0cGVuZGluZzogMCxcblx0XHRcdFx0cHJvY2Vzc2luZzogMCxcblx0XHRcdFx0ZGVsaXZlcmVkOiAwLFxuXHRcdFx0XHRmYWlsZWQ6IDAsXG5cdFx0XHRcdGV4cGlyZWQ6IDBcblx0XHRcdH0sIHMgPSBEYXRlLm5vdygpO1xuXHRcdFx0Zm9yIChjb25zdCByIG9mIHQpIHIuZXhwaXJlc0F0ICYmIHIuZXhwaXJlc0F0IDwgcyA/IG4uZXhwaXJlZCsrIDogbltyLnN0YXR1c10rKztcblx0XHRcdHJldHVybiBuO1xuXHRcdH1cblx0XHRhc3luYyBjbGVhck1haWxib3goZSkge1xuXHRcdFx0Y29uc3QgdCA9IGF3YWl0IHRoaXMub3BlbigpO1xuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKChuLCBzKSA9PiB7XG5cdFx0XHRcdGNvbnN0IHIgPSB0LnRyYW5zYWN0aW9uKGYuTUFJTEJPWCwgXCJyZWFkd3JpdGVcIiksIGkgPSByLm9iamVjdFN0b3JlKGYuTUFJTEJPWCkuaW5kZXgoXCJjaGFubmVsXCIpO1xuXHRcdFx0XHRsZXQgbyA9IDA7XG5cdFx0XHRcdGNvbnN0IGEgPSBpLm9wZW5DdXJzb3IoSURCS2V5UmFuZ2Uub25seShlKSk7XG5cdFx0XHRcdGEub25zdWNjZXNzID0gKCkgPT4ge1xuXHRcdFx0XHRcdGNvbnN0IGMgPSBhLnJlc3VsdDtcblx0XHRcdFx0XHRjICYmIChjLmRlbGV0ZSgpLCBvKyssIGMuY29udGludWUoKSk7XG5cdFx0XHRcdH0sIHIub25jb21wbGV0ZSA9ICgpID0+IG4obyksIHIub25lcnJvciA9ICgpID0+IHMoLyogQF9fUFVSRV9fICovIG5ldyBFcnJvcihcIkZhaWxlZCB0byBjbGVhciBtYWlsYm94XCIpKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRhc3luYyByZWdpc3RlclBlbmRpbmcoZSkge1xuXHRcdFx0Y29uc3QgdCA9IGF3YWl0IHRoaXMub3BlbigpLCBuID0ge1xuXHRcdFx0XHRpZDogJGUoKSxcblx0XHRcdFx0Y2hhbm5lbDogdGhpcy5fY2hhbm5lbE5hbWUsXG5cdFx0XHRcdHR5cGU6IGUudHlwZSxcblx0XHRcdFx0ZGF0YTogZS5kYXRhLFxuXHRcdFx0XHRtZXRhZGF0YTogZS5tZXRhZGF0YSxcblx0XHRcdFx0Y3JlYXRlZEF0OiBEYXRlLm5vdygpLFxuXHRcdFx0XHRzdGF0dXM6IFwicGVuZGluZ1wiXG5cdFx0XHR9O1xuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKChzLCByKSA9PiB7XG5cdFx0XHRcdGNvbnN0IGkgPSB0LnRyYW5zYWN0aW9uKGYuUEVORElORywgXCJyZWFkd3JpdGVcIik7XG5cdFx0XHRcdGkub2JqZWN0U3RvcmUoZi5QRU5ESU5HKS5hZGQobiksIGkub25jb21wbGV0ZSA9ICgpID0+IHMobi5pZCksIGkub25lcnJvciA9ICgpID0+IHIoLyogQF9fUFVSRV9fICovIG5ldyBFcnJvcihcIkZhaWxlZCB0byByZWdpc3RlciBwZW5kaW5nIG9wZXJhdGlvblwiKSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0YXN5bmMgZ2V0UGVuZGluZ09wZXJhdGlvbnMoKSB7XG5cdFx0XHRjb25zdCBlID0gYXdhaXQgdGhpcy5vcGVuKCk7XG5cdFx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHQsIG4pID0+IHtcblx0XHRcdFx0Y29uc3QgcyA9IGUudHJhbnNhY3Rpb24oZi5QRU5ESU5HLCBcInJlYWRvbmx5XCIpLm9iamVjdFN0b3JlKGYuUEVORElORykuaW5kZXgoXCJjaGFubmVsXCIpLmdldEFsbChJREJLZXlSYW5nZS5vbmx5KHRoaXMuX2NoYW5uZWxOYW1lKSk7XG5cdFx0XHRcdHMub25zdWNjZXNzID0gKCkgPT4gdChzLnJlc3VsdCksIHMub25lcnJvciA9ICgpID0+IG4oLyogQF9fUFVSRV9fICovIG5ldyBFcnJvcihcIkZhaWxlZCB0byBnZXQgcGVuZGluZyBvcGVyYXRpb25zXCIpKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRhc3luYyBjb21wbGV0ZVBlbmRpbmcoZSkge1xuXHRcdFx0Y29uc3QgdCA9IGF3YWl0IHRoaXMub3BlbigpO1xuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKChuLCBzKSA9PiB7XG5cdFx0XHRcdGNvbnN0IHIgPSB0LnRyYW5zYWN0aW9uKGYuUEVORElORywgXCJyZWFkd3JpdGVcIik7XG5cdFx0XHRcdHIub2JqZWN0U3RvcmUoZi5QRU5ESU5HKS5kZWxldGUoZSksIHIub25jb21wbGV0ZSA9ICgpID0+IG4oKSwgci5vbmVycm9yID0gKCkgPT4gcygvKiBAX19QVVJFX18gKi8gbmV3IEVycm9yKFwiRmFpbGVkIHRvIGNvbXBsZXRlIHBlbmRpbmcgb3BlcmF0aW9uXCIpKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRhc3luYyBhd2FpdFBlbmRpbmcoZSwgdCA9IHt9KSB7XG5cdFx0XHRjb25zdCBuID0gdC50aW1lb3V0ID8/IDNlNCwgcyA9IHQucG9sbEludGVydmFsID8/IDEwMCwgciA9IERhdGUubm93KCk7XG5cdFx0XHRmb3IgKDsgRGF0ZS5ub3coKSAtIHIgPCBuOykge1xuXHRcdFx0XHRjb25zdCBpID0gYXdhaXQgdGhpcy5fZ2V0UGVuZGluZ0J5SWQoZSk7XG5cdFx0XHRcdGlmICghaSkgcmV0dXJuIG51bGw7XG5cdFx0XHRcdGlmIChpLnN0YXR1cyA9PT0gXCJjb21wbGV0ZWRcIikgcmV0dXJuIGF3YWl0IHRoaXMuY29tcGxldGVQZW5kaW5nKGUpLCBpLnJlc3VsdDtcblx0XHRcdFx0YXdhaXQgbmV3IFByb21pc2UoKG8pID0+IHNldFRpbWVvdXQobywgcykpO1xuXHRcdFx0fVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBQZW5kaW5nIG9wZXJhdGlvbiAke2V9IHRpbWVkIG91dGApO1xuXHRcdH1cblx0XHRhc3luYyBfZ2V0UGVuZGluZ0J5SWQoZSkge1xuXHRcdFx0Y29uc3QgdCA9IGF3YWl0IHRoaXMub3BlbigpO1xuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKChuLCBzKSA9PiB7XG5cdFx0XHRcdGNvbnN0IHIgPSB0LnRyYW5zYWN0aW9uKGYuUEVORElORywgXCJyZWFkb25seVwiKS5vYmplY3RTdG9yZShmLlBFTkRJTkcpLmdldChlKTtcblx0XHRcdFx0ci5vbnN1Y2Nlc3MgPSAoKSA9PiBuKHIucmVzdWx0ID8/IG51bGwpLCByLm9uZXJyb3IgPSAoKSA9PiBzKC8qIEBfX1BVUkVfXyAqLyBuZXcgRXJyb3IoXCJGYWlsZWQgdG8gZ2V0IHBlbmRpbmcgb3BlcmF0aW9uXCIpKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRhc3luYyBleGNoYW5nZVB1dChlLCB0LCBuID0ge30pIHtcblx0XHRcdGNvbnN0IHMgPSBhd2FpdCB0aGlzLm9wZW4oKSwgciA9IHtcblx0XHRcdFx0aWQ6ICRlKCksXG5cdFx0XHRcdGtleTogZSxcblx0XHRcdFx0dmFsdWU6IHQsXG5cdFx0XHRcdG93bmVyOiB0aGlzLl9jaGFubmVsTmFtZSxcblx0XHRcdFx0c2hhcmVkV2l0aDogbi5zaGFyZWRXaXRoID8/IFtcIipcIl0sXG5cdFx0XHRcdHZlcnNpb246IDEsXG5cdFx0XHRcdGNyZWF0ZWRBdDogRGF0ZS5ub3coKSxcblx0XHRcdFx0dXBkYXRlZEF0OiBEYXRlLm5vdygpXG5cdFx0XHR9O1xuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKChpLCBvKSA9PiB7XG5cdFx0XHRcdGNvbnN0IGEgPSBzLnRyYW5zYWN0aW9uKGYuRVhDSEFOR0UsIFwicmVhZHdyaXRlXCIpLCBjID0gYS5vYmplY3RTdG9yZShmLkVYQ0hBTkdFKSwgbCA9IGMuaW5kZXgoXCJrZXlcIikuZ2V0KGUpO1xuXHRcdFx0XHRsLm9uc3VjY2VzcyA9ICgpID0+IHtcblx0XHRcdFx0XHRjb25zdCB1ID0gbC5yZXN1bHQ7XG5cdFx0XHRcdFx0dSAmJiAoci5pZCA9IHUuaWQsIHIudmVyc2lvbiA9IHUudmVyc2lvbiArIDEsIHIuY3JlYXRlZEF0ID0gdS5jcmVhdGVkQXQpLCBjLnB1dChyKTtcblx0XHRcdFx0fSwgYS5vbmNvbXBsZXRlID0gKCkgPT4ge1xuXHRcdFx0XHRcdHRoaXMuX2V4Y2hhbmdlVXBkYXRlcy5uZXh0KHIpLCBpKHIuaWQpO1xuXHRcdFx0XHR9LCBhLm9uZXJyb3IgPSAoKSA9PiBvKC8qIEBfX1BVUkVfXyAqLyBuZXcgRXJyb3IoXCJGYWlsZWQgdG8gcHV0IGV4Y2hhbmdlIGRhdGFcIikpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdGFzeW5jIGV4Y2hhbmdlR2V0KGUpIHtcblx0XHRcdGNvbnN0IHQgPSBhd2FpdCB0aGlzLm9wZW4oKTtcblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZSgobiwgcykgPT4ge1xuXHRcdFx0XHRjb25zdCByID0gdC50cmFuc2FjdGlvbihmLkVYQ0hBTkdFLCBcInJlYWRvbmx5XCIpLm9iamVjdFN0b3JlKGYuRVhDSEFOR0UpLmluZGV4KFwia2V5XCIpLmdldChlKTtcblx0XHRcdFx0ci5vbnN1Y2Nlc3MgPSAoKSA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgaSA9IHIucmVzdWx0O1xuXHRcdFx0XHRcdGlmICghaSkge1xuXHRcdFx0XHRcdFx0bihudWxsKTtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKCF0aGlzLl9jYW5BY2Nlc3NFeGNoYW5nZShpKSkge1xuXHRcdFx0XHRcdFx0bihudWxsKTtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0bihpLnZhbHVlKTtcblx0XHRcdFx0fSwgci5vbmVycm9yID0gKCkgPT4gcygvKiBAX19QVVJFX18gKi8gbmV3IEVycm9yKFwiRmFpbGVkIHRvIGdldCBleGNoYW5nZSBkYXRhXCIpKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRhc3luYyBleGNoYW5nZURlbGV0ZShlKSB7XG5cdFx0XHRjb25zdCB0ID0gYXdhaXQgdGhpcy5vcGVuKCk7XG5cdFx0XHRyZXR1cm4gbmV3IFByb21pc2UoKG4sIHMpID0+IHtcblx0XHRcdFx0Y29uc3QgciA9IHQudHJhbnNhY3Rpb24oZi5FWENIQU5HRSwgXCJyZWFkd3JpdGVcIiksIGkgPSByLm9iamVjdFN0b3JlKGYuRVhDSEFOR0UpLCBvID0gaS5pbmRleChcImtleVwiKS5nZXQoZSk7XG5cdFx0XHRcdG8ub25zdWNjZXNzID0gKCkgPT4ge1xuXHRcdFx0XHRcdGNvbnN0IGEgPSBvLnJlc3VsdDtcblx0XHRcdFx0XHRpZiAoIWEpIHtcblx0XHRcdFx0XHRcdG4oITEpO1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoYS5vd25lciAhPT0gdGhpcy5fY2hhbm5lbE5hbWUpIHtcblx0XHRcdFx0XHRcdG4oITEpO1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpLmRlbGV0ZShhLmlkKTtcblx0XHRcdFx0fSwgci5vbmNvbXBsZXRlID0gKCkgPT4gbighMCksIHIub25lcnJvciA9ICgpID0+IHMoLyogQF9fUFVSRV9fICovIG5ldyBFcnJvcihcIkZhaWxlZCB0byBkZWxldGUgZXhjaGFuZ2UgZGF0YVwiKSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0YXN5bmMgZXhjaGFuZ2VMb2NrKGUsIHQgPSB7fSkge1xuXHRcdFx0Y29uc3QgbiA9IGF3YWl0IHRoaXMub3BlbigpLCBzID0gdC50aW1lb3V0ID8/IDNlNDtcblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZSgociwgaSkgPT4ge1xuXHRcdFx0XHRjb25zdCBvID0gbi50cmFuc2FjdGlvbihmLkVYQ0hBTkdFLCBcInJlYWR3cml0ZVwiKSwgYSA9IG8ub2JqZWN0U3RvcmUoZi5FWENIQU5HRSksIGMgPSBhLmluZGV4KFwia2V5XCIpLmdldChlKTtcblx0XHRcdFx0Yy5vbnN1Y2Nlc3MgPSAoKSA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgbCA9IGMucmVzdWx0O1xuXHRcdFx0XHRcdGlmICghbCkge1xuXHRcdFx0XHRcdFx0cighMSk7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmIChsLmxvY2sgJiYgbC5sb2NrLmhvbGRlciAhPT0gdGhpcy5fY2hhbm5lbE5hbWUgJiYgbC5sb2NrLmV4cGlyZXNBdCA+IERhdGUubm93KCkpIHtcblx0XHRcdFx0XHRcdHIoITEpO1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRsLmxvY2sgPSB7XG5cdFx0XHRcdFx0XHRob2xkZXI6IHRoaXMuX2NoYW5uZWxOYW1lLFxuXHRcdFx0XHRcdFx0YWNxdWlyZWRBdDogRGF0ZS5ub3coKSxcblx0XHRcdFx0XHRcdGV4cGlyZXNBdDogRGF0ZS5ub3coKSArIHNcblx0XHRcdFx0XHR9LCBsLnVwZGF0ZWRBdCA9IERhdGUubm93KCksIGEucHV0KGwpO1xuXHRcdFx0XHR9LCBvLm9uY29tcGxldGUgPSAoKSA9PiByKCEwKSwgby5vbmVycm9yID0gKCkgPT4gaSgvKiBAX19QVVJFX18gKi8gbmV3IEVycm9yKFwiRmFpbGVkIHRvIGFjcXVpcmUgbG9ja1wiKSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0YXN5bmMgZXhjaGFuZ2VVbmxvY2soZSkge1xuXHRcdFx0Y29uc3QgdCA9IGF3YWl0IHRoaXMub3BlbigpO1xuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKChuLCBzKSA9PiB7XG5cdFx0XHRcdGNvbnN0IHIgPSB0LnRyYW5zYWN0aW9uKGYuRVhDSEFOR0UsIFwicmVhZHdyaXRlXCIpLCBpID0gci5vYmplY3RTdG9yZShmLkVYQ0hBTkdFKSwgbyA9IGkuaW5kZXgoXCJrZXlcIikuZ2V0KGUpO1xuXHRcdFx0XHRvLm9uc3VjY2VzcyA9ICgpID0+IHtcblx0XHRcdFx0XHRjb25zdCBhID0gby5yZXN1bHQ7XG5cdFx0XHRcdFx0YSAmJiBhLmxvY2s/LmhvbGRlciA9PT0gdGhpcy5fY2hhbm5lbE5hbWUgJiYgKGRlbGV0ZSBhLmxvY2ssIGEudXBkYXRlZEF0ID0gRGF0ZS5ub3coKSwgaS5wdXQoYSkpO1xuXHRcdFx0XHR9LCByLm9uY29tcGxldGUgPSAoKSA9PiBuKCksIHIub25lcnJvciA9ICgpID0+IHMoLyogQF9fUFVSRV9fICovIG5ldyBFcnJvcihcIkZhaWxlZCB0byByZWxlYXNlIGxvY2tcIikpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdF9jYW5BY2Nlc3NFeGNoYW5nZShlKSB7XG5cdFx0XHRyZXR1cm4gZS5vd25lciA9PT0gdGhpcy5fY2hhbm5lbE5hbWUgfHwgZS5zaGFyZWRXaXRoLmluY2x1ZGVzKFwiKlwiKSA/ICEwIDogZS5zaGFyZWRXaXRoLmluY2x1ZGVzKHRoaXMuX2NoYW5uZWxOYW1lKTtcblx0XHR9XG5cdFx0YXN5bmMgYmVnaW5UcmFuc2FjdGlvbigpIHtcblx0XHRcdHJldHVybiBuZXcgWm4odGhpcyk7XG5cdFx0fVxuXHRcdGFzeW5jIGV4ZWN1dGVUcmFuc2FjdGlvbihlKSB7XG5cdFx0XHRjb25zdCB0ID0gYXdhaXQgdGhpcy5vcGVuKCksIG4gPSBuZXcgU2V0KGUubWFwKChzKSA9PiBzLnN0b3JlKSk7XG5cdFx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHMsIHIpID0+IHtcblx0XHRcdFx0Y29uc3QgaSA9IHQudHJhbnNhY3Rpb24oQXJyYXkuZnJvbShuKSwgXCJyZWFkd3JpdGVcIik7XG5cdFx0XHRcdGZvciAoY29uc3QgbyBvZiBlKSB7XG5cdFx0XHRcdFx0Y29uc3QgYSA9IGkub2JqZWN0U3RvcmUoby5zdG9yZSk7XG5cdFx0XHRcdFx0c3dpdGNoIChvLnR5cGUpIHtcblx0XHRcdFx0XHRcdGNhc2UgXCJwdXRcIjpcblx0XHRcdFx0XHRcdFx0by52YWx1ZSAhPT0gdm9pZCAwICYmIGEucHV0KG8udmFsdWUpO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgXCJkZWxldGVcIjpcblx0XHRcdFx0XHRcdFx0by5rZXkgIT09IHZvaWQgMCAmJiBhLmRlbGV0ZShvLmtleSk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSBcInVwZGF0ZVwiOiBpZiAoby5rZXkgIT09IHZvaWQgMCkge1xuXHRcdFx0XHRcdFx0XHRjb25zdCBjID0gYS5nZXQoby5rZXkpO1xuXHRcdFx0XHRcdFx0XHRjLm9uc3VjY2VzcyA9ICgpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRjLnJlc3VsdCAmJiBvLnZhbHVlICYmIGEucHV0KHtcblx0XHRcdFx0XHRcdFx0XHRcdC4uLmMucmVzdWx0LFxuXHRcdFx0XHRcdFx0XHRcdFx0Li4uby52YWx1ZVxuXHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpLm9uY29tcGxldGUgPSAoKSA9PiBzKCksIGkub25lcnJvciA9ICgpID0+IHIoLyogQF9fUFVSRV9fICovIG5ldyBFcnJvcihcIlRyYW5zYWN0aW9uIGZhaWxlZFwiKSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0b25NZXNzYWdlVXBkYXRlKGUpIHtcblx0XHRcdHJldHVybiB0aGlzLl9tZXNzYWdlVXBkYXRlcy5zdWJzY3JpYmUoeyBuZXh0OiBlIH0pO1xuXHRcdH1cblx0XHRvbkV4Y2hhbmdlVXBkYXRlKGUpIHtcblx0XHRcdHJldHVybiB0aGlzLl9leGNoYW5nZVVwZGF0ZXMuc3Vic2NyaWJlKHsgbmV4dDogZSB9KTtcblx0XHR9XG5cdFx0YXN5bmMgY2xlYW51cEV4cGlyZWQoKSB7XG5cdFx0XHRjb25zdCBlID0gYXdhaXQgdGhpcy5vcGVuKCksIHQgPSBEYXRlLm5vdygpO1xuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKChuLCBzKSA9PiB7XG5cdFx0XHRcdGNvbnN0IHIgPSBlLnRyYW5zYWN0aW9uKFtmLk1FU1NBR0VTLCBmLk1BSUxCT1hdLCBcInJlYWR3cml0ZVwiKSwgaSA9IHIub2JqZWN0U3RvcmUoZi5NRVNTQUdFUyksIG8gPSByLm9iamVjdFN0b3JlKGYuTUFJTEJPWCk7XG5cdFx0XHRcdGxldCBhID0gMDtcblx0XHRcdFx0Y29uc3QgYyA9IGkub3BlbkN1cnNvcigpO1xuXHRcdFx0XHRjLm9uc3VjY2VzcyA9ICgpID0+IHtcblx0XHRcdFx0XHRjb25zdCB1ID0gYy5yZXN1bHQ7XG5cdFx0XHRcdFx0aWYgKHUpIHtcblx0XHRcdFx0XHRcdGNvbnN0IHAgPSB1LnZhbHVlO1xuXHRcdFx0XHRcdFx0cC5leHBpcmVzQXQgJiYgcC5leHBpcmVzQXQgPCB0ICYmICh1LmRlbGV0ZSgpLCBhKyspLCB1LmNvbnRpbnVlKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXHRcdFx0XHRjb25zdCBsID0gby5vcGVuQ3Vyc29yKCk7XG5cdFx0XHRcdGwub25zdWNjZXNzID0gKCkgPT4ge1xuXHRcdFx0XHRcdGNvbnN0IHUgPSBsLnJlc3VsdDtcblx0XHRcdFx0XHRpZiAodSkge1xuXHRcdFx0XHRcdFx0Y29uc3QgcCA9IHUudmFsdWU7XG5cdFx0XHRcdFx0XHRwLmV4cGlyZXNBdCAmJiBwLmV4cGlyZXNBdCA8IHQgJiYgKHUuZGVsZXRlKCksIGErKyksIHUuY29udGludWUoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sIHIub25jb21wbGV0ZSA9ICgpID0+IG4oYSksIHIub25lcnJvciA9ICgpID0+IHMoLyogQF9fUFVSRV9fICovIG5ldyBFcnJvcihcIkZhaWxlZCB0byBjbGVhbnVwIGV4cGlyZWRcIikpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9O1xuXHR2YXIgWm4gPSBjbGFzcyB7XG5cdFx0X3N0b3JhZ2U7XG5cdFx0X29wZXJhdGlvbnMgPSBbXTtcblx0XHRfaXNDb21taXR0ZWQgPSAhMTtcblx0XHRfaXNSb2xsZWRCYWNrID0gITE7XG5cdFx0Y29uc3RydWN0b3IoZSkge1xuXHRcdFx0dGhpcy5fc3RvcmFnZSA9IGU7XG5cdFx0fVxuXHRcdHB1dChlLCB0KSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY2hlY2tTdGF0ZSgpLCB0aGlzLl9vcGVyYXRpb25zLnB1c2goe1xuXHRcdFx0XHRpZDogJGUoKSxcblx0XHRcdFx0dHlwZTogXCJwdXRcIixcblx0XHRcdFx0c3RvcmU6IGUsXG5cdFx0XHRcdHZhbHVlOiB0LFxuXHRcdFx0XHR0aW1lc3RhbXA6IERhdGUubm93KClcblx0XHRcdH0pLCB0aGlzO1xuXHRcdH1cblx0XHRkZWxldGUoZSwgdCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2NoZWNrU3RhdGUoKSwgdGhpcy5fb3BlcmF0aW9ucy5wdXNoKHtcblx0XHRcdFx0aWQ6ICRlKCksXG5cdFx0XHRcdHR5cGU6IFwiZGVsZXRlXCIsXG5cdFx0XHRcdHN0b3JlOiBlLFxuXHRcdFx0XHRrZXk6IHQsXG5cdFx0XHRcdHRpbWVzdGFtcDogRGF0ZS5ub3coKVxuXHRcdFx0fSksIHRoaXM7XG5cdFx0fVxuXHRcdHVwZGF0ZShlLCB0LCBuKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY2hlY2tTdGF0ZSgpLCB0aGlzLl9vcGVyYXRpb25zLnB1c2goe1xuXHRcdFx0XHRpZDogJGUoKSxcblx0XHRcdFx0dHlwZTogXCJ1cGRhdGVcIixcblx0XHRcdFx0c3RvcmU6IGUsXG5cdFx0XHRcdGtleTogdCxcblx0XHRcdFx0dmFsdWU6IG4sXG5cdFx0XHRcdHRpbWVzdGFtcDogRGF0ZS5ub3coKVxuXHRcdFx0fSksIHRoaXM7XG5cdFx0fVxuXHRcdGFzeW5jIGNvbW1pdCgpIHtcblx0XHRcdGlmICh0aGlzLl9jaGVja1N0YXRlKCksIHRoaXMuX29wZXJhdGlvbnMubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdHRoaXMuX2lzQ29tbWl0dGVkID0gITA7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdGF3YWl0IHRoaXMuX3N0b3JhZ2UuZXhlY3V0ZVRyYW5zYWN0aW9uKHRoaXMuX29wZXJhdGlvbnMpLCB0aGlzLl9pc0NvbW1pdHRlZCA9ICEwO1xuXHRcdH1cblx0XHRyb2xsYmFjaygpIHtcblx0XHRcdHRoaXMuX29wZXJhdGlvbnMgPSBbXSwgdGhpcy5faXNSb2xsZWRCYWNrID0gITA7XG5cdFx0fVxuXHRcdGdldCBvcGVyYXRpb25Db3VudCgpIHtcblx0XHRcdHJldHVybiB0aGlzLl9vcGVyYXRpb25zLmxlbmd0aDtcblx0XHR9XG5cdFx0X2NoZWNrU3RhdGUoKSB7XG5cdFx0XHRpZiAodGhpcy5faXNDb21taXR0ZWQpIHRocm93IG5ldyBFcnJvcihcIlRyYW5zYWN0aW9uIGFscmVhZHkgY29tbWl0dGVkXCIpO1xuXHRcdFx0aWYgKHRoaXMuX2lzUm9sbGVkQmFjaykgdGhyb3cgbmV3IEVycm9yKFwiVHJhbnNhY3Rpb24gYWxyZWFkeSByb2xsZWQgYmFja1wiKTtcblx0XHR9XG5cdH07XG5cdHZhciBKID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0ZnVuY3Rpb24gUnQoZSkge1xuXHRcdHJldHVybiBKLmhhcyhlKSB8fCBKLnNldChlLCBuZXcgWG4oZSkpLCBKLmdldChlKTtcblx0fVxuXHR2YXIgSmUgPSBDdCgpO1xuXHR2YXIgZXMgPSBKZS5sZW5ndGggPiAwID8gbmV3IFVSTChcIi4uL3RyYW5zcG9ydC9Xb3JrZXIudHNcIiwgSmUpIDogXCJcIjtcblx0dmFyIHF0ID0gY2xhc3Mge1xuXHRcdF9jaGFubmVsO1xuXHRcdF9jb250ZXh0O1xuXHRcdF9vcHRpb25zO1xuXHRcdF9jb25uZWN0aW9uO1xuXHRcdF9zdG9yYWdlO1xuXHRcdGNvbnN0cnVjdG9yKGUsIHQsIG4gPSB7fSkge1xuXHRcdFx0dGhpcy5fY2hhbm5lbCA9IGUsIHRoaXMuX2NvbnRleHQgPSB0LCB0aGlzLl9vcHRpb25zID0gbiwgdGhpcy5fY29ubmVjdGlvbiA9IEF0KGUpLCB0aGlzLl9zdG9yYWdlID0gUnQoZSk7XG5cdFx0fVxuXHRcdGFzeW5jIHJlcXVlc3QoZSwgdCwgbiwgcyA9IHt9KSB7XG5cdFx0XHRsZXQgciA9IHR5cGVvZiBlID09IFwic3RyaW5nXCIgPyBbZV0gOiBlLCBpID0gdCwgbyA9IG47XG5cdFx0XHRyZXR1cm4gQXJyYXkuaXNBcnJheSh0KSAmJiBPdChlKSAmJiAocyA9IG4sIG8gPSB0LCBpID0gZSwgciA9IFtdKSwgdGhpcy5fY29udGV4dC5nZXRIb3N0KCk/LnJlcXVlc3QociwgaSwgbywgcywgdGhpcy5fY2hhbm5lbCk7XG5cdFx0fVxuXHRcdGFzeW5jIGRvSW1wb3J0TW9kdWxlKGUsIHQgPSB7fSkge1xuXHRcdFx0cmV0dXJuIHRoaXMucmVxdWVzdChbXSwgZC5JTVBPUlQsIFtlXSwgdCk7XG5cdFx0fVxuXHRcdGFzeW5jIGRlZmVyTWVzc2FnZShlLCB0ID0ge30pIHtcblx0XHRcdHJldHVybiB0aGlzLl9zdG9yYWdlLmRlZmVyKHtcblx0XHRcdFx0Y2hhbm5lbDogdGhpcy5fY2hhbm5lbCxcblx0XHRcdFx0c2VuZGVyOiB0aGlzLl9jb250ZXh0Lmhvc3ROYW1lLFxuXHRcdFx0XHR0eXBlOiBcInJlcXVlc3RcIixcblx0XHRcdFx0cGF5bG9hZDogZVxuXHRcdFx0fSwgdCk7XG5cdFx0fVxuXHRcdGFzeW5jIGdldFBlbmRpbmdNZXNzYWdlcygpIHtcblx0XHRcdHJldHVybiB0aGlzLl9zdG9yYWdlLmdldERlZmVycmVkTWVzc2FnZXModGhpcy5fY2hhbm5lbCwgeyBzdGF0dXM6IFwicGVuZGluZ1wiIH0pO1xuXHRcdH1cblx0XHRnZXQgY29ubmVjdGlvbigpIHtcblx0XHRcdHJldHVybiB0aGlzLl9jb25uZWN0aW9uO1xuXHRcdH1cblx0XHRnZXQgY2hhbm5lbE5hbWUoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY2hhbm5lbDtcblx0XHR9XG5cdFx0Z2V0IGNvbnRleHQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY29udGV4dDtcblx0XHR9XG5cdH07XG5cdHZhciBBID0gY2xhc3Mge1xuXHRcdF9jaGFubmVsO1xuXHRcdF9jb250ZXh0O1xuXHRcdF9vcHRpb25zO1xuXHRcdF9jb25uZWN0aW9uO1xuXHRcdF91bmlmaWVkO1xuXHRcdGdldCBfZm9yUmVzb2x2ZXMoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fdW5pZmllZC5fX2dldFByaXZhdGUoXCJfcGVuZGluZ1wiKTtcblx0XHR9XG5cdFx0Z2V0IF9zdWJzY3JpcHRpb25zKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX3VuaWZpZWQuX19nZXRQcml2YXRlKFwiX3N1YnNjcmlwdGlvbnNcIik7XG5cdFx0fVxuXHRcdGdldCBfYnJvYWRjYXN0cygpIHtcblx0XHRcdHJldHVybiB0aGlzLl91bmlmaWVkLl9fZ2V0UHJpdmF0ZShcIl90cmFuc3BvcnRzXCIpO1xuXHRcdH1cblx0XHRjb25zdHJ1Y3RvcihlLCB0LCBuID0ge30pIHtcblx0XHRcdHRoaXMuX2NoYW5uZWwgPSBlLCB0aGlzLl9jb250ZXh0ID0gdCwgdGhpcy5fb3B0aW9ucyA9IG4sIHRoaXMuX2Nvbm5lY3Rpb24gPSBMZSgpLmdldE9yQ3JlYXRlKGUsIFwiaW50ZXJuYWxcIiwgbiksIHRoaXMuX3VuaWZpZWQgPSBuZXcgeXQoe1xuXHRcdFx0XHRuYW1lOiBlLFxuXHRcdFx0XHRhdXRvTGlzdGVuOiAhMSxcblx0XHRcdFx0dGltZW91dDogbj8udGltZW91dFxuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdGNyZWF0ZVJlbW90ZUNoYW5uZWwoZSwgdCA9IHt9LCBuKSB7XG5cdFx0XHRjb25zdCBzID0gdHMobiA/PyB0aGlzLl9jb250ZXh0LiRjcmVhdGVPclVzZUV4aXN0aW5nUmVtb3RlKGUsIHQsIG4gPz8gbnVsbCk/Lm1lc3NhZ2VDaGFubmVsPy5wb3J0MSksIHIgPSBMdChzPy50YXJnZXQgPz8gcyk7XG5cdFx0XHRyZXR1cm4gdGhpcy5fdW5pZmllZC5saXN0ZW4ocz8udGFyZ2V0LCB7IHRhcmdldENoYW5uZWw6IGUgfSksIHMgJiYgKHRoaXMuX2Jyb2FkY2FzdHM/LnNldD8uKGUsIHMpLCByID09PSBcInNlbGZcIiAmJiB0eXBlb2YgcG9zdE1lc3NhZ2UgPiBcInVcIiB8fCB0aGlzLl91bmlmaWVkLmNvbm5lY3QocywgeyB0YXJnZXRDaGFubmVsOiBlIH0pLCB0aGlzLl9jb250ZXh0LiRyZWdpc3RlckNvbm5lY3Rpb24oe1xuXHRcdFx0XHRsb2NhbENoYW5uZWw6IHRoaXMuX2NoYW5uZWwsXG5cdFx0XHRcdHJlbW90ZUNoYW5uZWw6IGUsXG5cdFx0XHRcdHNlbmRlcjogdGhpcy5fY2hhbm5lbCxcblx0XHRcdFx0ZGlyZWN0aW9uOiBcIm91dGdvaW5nXCIsXG5cdFx0XHRcdHRyYW5zcG9ydFR5cGU6IHJcblx0XHRcdH0pLCB0aGlzLm5vdGlmeUNoYW5uZWwoZSwge1xuXHRcdFx0XHRjb250ZXh0SWQ6IHRoaXMuX2NvbnRleHQuaWQsXG5cdFx0XHRcdGNvbnRleHROYW1lOiB0aGlzLl9jb250ZXh0Lmhvc3ROYW1lXG5cdFx0XHR9LCBcImNvbm5lY3RcIikpLCBuZXcgcXQoZSwgdGhpcy5fY29udGV4dCwgdCk7XG5cdFx0fVxuXHRcdGdldENoYW5uZWwoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY2hhbm5lbDtcblx0XHR9XG5cdFx0Z2V0IGNvbm5lY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY29ubmVjdGlvbjtcblx0XHR9XG5cdFx0cmVxdWVzdChlLCB0LCBuLCBzID0ge30sIHIgPSBcIndvcmtlclwiKSB7XG5cdFx0XHRsZXQgaSA9IHR5cGVvZiBlID09IFwic3RyaW5nXCIgPyBbZV0gOiBlLCBvID0gbjtcblx0XHRcdHJldHVybiBBcnJheS5pc0FycmF5KHQpICYmIE90KGUpICYmIChyID0gcywgcyA9IG4sIG8gPSB0LCB0ID0gZSwgaSA9IFtdKSwgdGhpcy5fdW5pZmllZC5pbnZva2UociwgdCwgaSA/PyBbXSwgQXJyYXkuaXNBcnJheShvKSA/IG8gOiBbb10pO1xuXHRcdH1cblx0XHRyZXNvbHZlUmVzcG9uc2UoZSwgdCkge1xuXHRcdFx0dGhpcy5fZm9yUmVzb2x2ZXMuZ2V0KGUpPy5yZXNvbHZlPy4odCk7XG5cdFx0XHRjb25zdCBuID0gdGhpcy5fZm9yUmVzb2x2ZXMuZ2V0KGUpPy5wcm9taXNlO1xuXHRcdFx0cmV0dXJuIHRoaXMuX2ZvclJlc29sdmVzLmRlbGV0ZShlKSwgbjtcblx0XHR9XG5cdFx0YXN5bmMgaGFuZGxlQW5kUmVzcG9uc2UoZSwgdCwgbikge31cblx0XHRub3RpZnlDaGFubmVsKGUsIHQgPSB7fSwgbiA9IFwibm90aWZ5XCIpIHtcblx0XHRcdHJldHVybiB0aGlzLl91bmlmaWVkLm5vdGlmeShlLCB7XG5cdFx0XHRcdC4uLnQsXG5cdFx0XHRcdGZyb206IHRoaXMuX2NoYW5uZWwsXG5cdFx0XHRcdHRvOiBlXG5cdFx0XHR9LCBuKTtcblx0XHR9XG5cdFx0Z2V0Q29ubmVjdGVkQ2hhbm5lbHMoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fdW5pZmllZC5jb25uZWN0ZWRDaGFubmVscztcblx0XHR9XG5cdFx0Y2xvc2UoKSB7XG5cdFx0XHR0aGlzLl9zdWJzY3JpcHRpb25zLmZvckVhY2goKGUpID0+IGUudW5zdWJzY3JpYmUoKSksIHRoaXMuX2ZvclJlc29sdmVzLmNsZWFyKCksIHRoaXMuX2Jyb2FkY2FzdHM/LnZhbHVlcz8uKCk/LmZvckVhY2goKGUpID0+IGUuY2xvc2U/LigpKSwgdGhpcy5fYnJvYWRjYXN0cz8uY2xlYXI/LigpLCB0aGlzLl91bmlmaWVkLmNsb3NlKCk7XG5cdFx0fVxuXHRcdGdldCB1bmlmaWVkKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX3VuaWZpZWQ7XG5cdFx0fVxuXHR9O1xuXHR2YXIgTnQgPSBjbGFzcyB7XG5cdFx0X29wdGlvbnM7XG5cdFx0X2lkID0gJGUoKTtcblx0XHRfaG9zdE5hbWU7XG5cdFx0X2hvc3QgPSBudWxsO1xuXHRcdF9lbmRwb2ludHMgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuXHRcdF91bmlmaWVkQnlDaGFubmVsID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0XHRfdW5pZmllZENvbm5lY3Rpb25TdWJzID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0XHRfcmVtb3RlQ2hhbm5lbHMgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuXHRcdF9kZWZlcnJlZENoYW5uZWxzID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0XHRfY29ubmVjdGlvbkV2ZW50cyA9IG5ldyBfKHsgYnVmZmVyU2l6ZTogMjAwIH0pO1xuXHRcdF9jb25uZWN0aW9uUmVnaXN0cnkgPSBuZXcgYnQoKCkgPT4gJGUoKSwgKGUpID0+IHRoaXMuX2VtaXRDb25uZWN0aW9uRXZlbnQoZSkpO1xuXHRcdF9jbG9zZWQgPSAhMTtcblx0XHRfZ2xvYmFsU2VsZiA9IG51bGw7XG5cdFx0Y29uc3RydWN0b3IoZSA9IHt9KSB7XG5cdFx0XHR0aGlzLl9vcHRpb25zID0gZSwgdGhpcy5faG9zdE5hbWUgPSBlLm5hbWUgPz8gYGN0eC0ke3RoaXMuX2lkLnNsaWNlKDAsIDgpfWAsIGUudXNlR2xvYmFsU2VsZiAhPT0gITEgJiYgKHRoaXMuX2dsb2JhbFNlbGYgPSB0eXBlb2YgZ2xvYmFsVGhpcyA8IFwidVwiID8gZ2xvYmFsVGhpcyA6IHR5cGVvZiBzZWxmIDwgXCJ1XCIgPyBzZWxmIDogbnVsbCk7XG5cdFx0fVxuXHRcdGluaXRIb3N0KGUpIHtcblx0XHRcdGlmICh0aGlzLl9ob3N0ICYmICFlKSByZXR1cm4gdGhpcy5faG9zdDtcblx0XHRcdGNvbnN0IHQgPSBlID8/IHRoaXMuX2hvc3ROYW1lO1xuXHRcdFx0aWYgKHRoaXMuX2hvc3ROYW1lID0gdCwgdGhpcy5fZW5kcG9pbnRzLmhhcyh0KSkgcmV0dXJuIHRoaXMuX2hvc3QgPSB0aGlzLl9lbmRwb2ludHMuZ2V0KHQpLmhhbmRsZXIsIHRoaXMuX2hvc3Q7XG5cdFx0XHR0aGlzLl9ob3N0ID0gbmV3IEEodCwgdGhpcywgdGhpcy5fb3B0aW9ucy5kZWZhdWx0T3B0aW9ucyk7XG5cdFx0XHRjb25zdCBuID0ge1xuXHRcdFx0XHRuYW1lOiB0LFxuXHRcdFx0XHRoYW5kbGVyOiB0aGlzLl9ob3N0LFxuXHRcdFx0XHRjb25uZWN0aW9uOiB0aGlzLl9ob3N0LmNvbm5lY3Rpb24sXG5cdFx0XHRcdHN1YnNjcmlwdGlvbnM6IFtdLFxuXHRcdFx0XHRyZWFkeTogUHJvbWlzZS5yZXNvbHZlKG51bGwpLFxuXHRcdFx0XHR1bmlmaWVkOiB0aGlzLl9ob3N0LnVuaWZpZWRcblx0XHRcdH07XG5cdFx0XHRyZXR1cm4gdGhpcy5fZW5kcG9pbnRzLnNldCh0LCBuKSwgdGhpcy5fcmVnaXN0ZXJVbmlmaWVkQ2hhbm5lbCh0LCB0aGlzLl9ob3N0LnVuaWZpZWQpLCB0aGlzLl9ob3N0O1xuXHRcdH1cblx0XHRnZXRIb3N0KCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2hvc3QgPz8gdGhpcy5pbml0SG9zdCgpO1xuXHRcdH1cblx0XHRnZXQgaG9zdE5hbWUoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5faG9zdE5hbWU7XG5cdFx0fVxuXHRcdGdldCBpZCgpIHtcblx0XHRcdHJldHVybiB0aGlzLl9pZDtcblx0XHR9XG5cdFx0Z2V0IG9uQ29ubmVjdGlvbigpIHtcblx0XHRcdHJldHVybiB0aGlzLl9jb25uZWN0aW9uRXZlbnRzO1xuXHRcdH1cblx0XHRzdWJzY3JpYmVDb25uZWN0aW9ucyhlKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY29ubmVjdGlvbkV2ZW50cy5zdWJzY3JpYmUoZSk7XG5cdFx0fVxuXHRcdG5vdGlmeUNvbm5lY3Rpb25zKGUgPSB7fSwgdCA9IHt9KSB7XG5cdFx0XHRsZXQgbiA9IDA7XG5cdFx0XHRmb3IgKGNvbnN0IHMgb2YgdGhpcy5fZW5kcG9pbnRzLnZhbHVlcygpKSB7XG5cdFx0XHRcdGNvbnN0IHIgPSBzLmhhbmRsZXIuZ2V0Q29ubmVjdGVkQ2hhbm5lbHMoKTtcblx0XHRcdFx0Zm9yIChjb25zdCBpIG9mIHIpIHtcblx0XHRcdFx0XHRpZiAodC5sb2NhbENoYW5uZWwgJiYgdC5sb2NhbENoYW5uZWwgIT09IHMubmFtZSB8fCB0LnJlbW90ZUNoYW5uZWwgJiYgdC5yZW1vdGVDaGFubmVsICE9PSBpKSBjb250aW51ZTtcblx0XHRcdFx0XHRjb25zdCBvID0gdGhpcy5xdWVyeUNvbm5lY3Rpb25zKHtcblx0XHRcdFx0XHRcdGxvY2FsQ2hhbm5lbDogcy5uYW1lLFxuXHRcdFx0XHRcdFx0cmVtb3RlQ2hhbm5lbDogaSxcblx0XHRcdFx0XHRcdHN0YXR1czogXCJhY3RpdmVcIlxuXHRcdFx0XHRcdH0pWzBdO1xuXHRcdFx0XHRcdHQuc2VuZGVyICYmIG8/LnNlbmRlciAhPT0gdC5zZW5kZXIgfHwgdC50cmFuc3BvcnRUeXBlICYmIG8/LnRyYW5zcG9ydFR5cGUgIT09IHQudHJhbnNwb3J0VHlwZSB8fCB0LmNoYW5uZWwgJiYgdC5jaGFubmVsICE9PSBzLm5hbWUgJiYgdC5jaGFubmVsICE9PSBpIHx8IHMuaGFuZGxlci5ub3RpZnlDaGFubmVsKGksIGUsIFwibm90aWZ5XCIpICYmIG4rKztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG47XG5cdFx0fVxuXHRcdHF1ZXJ5Q29ubmVjdGlvbnMoZSA9IHt9KSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY29ubmVjdGlvblJlZ2lzdHJ5LnF1ZXJ5KGUpLm1hcCgodCkgPT4gKHtcblx0XHRcdFx0Li4udCxcblx0XHRcdFx0Y29udGV4dElkOiB0aGlzLl9pZFxuXHRcdFx0fSkpO1xuXHRcdH1cblx0XHRjcmVhdGVDaGFubmVsKGUsIHQgPSB7fSkge1xuXHRcdFx0aWYgKHRoaXMuX2VuZHBvaW50cy5oYXMoZSkpIHJldHVybiB0aGlzLl9lbmRwb2ludHMuZ2V0KGUpO1xuXHRcdFx0Y29uc3QgbiA9IG5ldyBBKGUsIHRoaXMsIHtcblx0XHRcdFx0Li4udGhpcy5fb3B0aW9ucy5kZWZhdWx0T3B0aW9ucyxcblx0XHRcdFx0Li4udFxuXHRcdFx0fSksIHMgPSB7XG5cdFx0XHRcdG5hbWU6IGUsXG5cdFx0XHRcdGhhbmRsZXI6IG4sXG5cdFx0XHRcdGNvbm5lY3Rpb246IG4uY29ubmVjdGlvbixcblx0XHRcdFx0c3Vic2NyaXB0aW9uczogW10sXG5cdFx0XHRcdHJlYWR5OiBQcm9taXNlLnJlc29sdmUobnVsbCksXG5cdFx0XHRcdHVuaWZpZWQ6IG4udW5pZmllZFxuXHRcdFx0fTtcblx0XHRcdHJldHVybiB0aGlzLl9lbmRwb2ludHMuc2V0KGUsIHMpLCB0aGlzLl9yZWdpc3RlclVuaWZpZWRDaGFubmVsKGUsIG4udW5pZmllZCksIHM7XG5cdFx0fVxuXHRcdGNyZWF0ZUNoYW5uZWxzKGUsIHQgPSB7fSkge1xuXHRcdFx0Y29uc3QgbiA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG5cdFx0XHRmb3IgKGNvbnN0IHMgb2YgZSkgbi5zZXQocywgdGhpcy5jcmVhdGVDaGFubmVsKHMsIHQpKTtcblx0XHRcdHJldHVybiBuO1xuXHRcdH1cblx0XHRnZXRDaGFubmVsKGUpIHtcblx0XHRcdHJldHVybiB0aGlzLl9lbmRwb2ludHMuZ2V0KGUpO1xuXHRcdH1cblx0XHRnZXRPckNyZWF0ZUNoYW5uZWwoZSwgdCA9IHt9KSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fZW5kcG9pbnRzLmdldChlKSA/PyB0aGlzLmNyZWF0ZUNoYW5uZWwoZSwgdCk7XG5cdFx0fVxuXHRcdGhhc0NoYW5uZWwoZSkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2VuZHBvaW50cy5oYXMoZSk7XG5cdFx0fVxuXHRcdGdldENoYW5uZWxOYW1lcygpIHtcblx0XHRcdHJldHVybiBbLi4udGhpcy5fZW5kcG9pbnRzLmtleXMoKV07XG5cdFx0fVxuXHRcdGdldCBzaXplKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2VuZHBvaW50cy5zaXplO1xuXHRcdH1cblx0XHRkZWZlcihlLCB0KSB7XG5cdFx0XHR0aGlzLl9kZWZlcnJlZENoYW5uZWxzLnNldChlLCB0KTtcblx0XHR9XG5cdFx0YXN5bmMgaW5pdERlZmVycmVkKGUpIHtcblx0XHRcdGNvbnN0IHQgPSB0aGlzLl9kZWZlcnJlZENoYW5uZWxzLmdldChlKTtcblx0XHRcdGlmICghdCkgcmV0dXJuIG51bGw7XG5cdFx0XHRjb25zdCBuID0gYXdhaXQgdCgpO1xuXHRcdFx0cmV0dXJuIHRoaXMuX2VuZHBvaW50cy5zZXQoZSwgbiksIHRoaXMuX2RlZmVycmVkQ2hhbm5lbHMuZGVsZXRlKGUpLCBuO1xuXHRcdH1cblx0XHRpc0RlZmVycmVkKGUpIHtcblx0XHRcdHJldHVybiB0aGlzLl9kZWZlcnJlZENoYW5uZWxzLmhhcyhlKTtcblx0XHR9XG5cdFx0YXN5bmMgZ2V0Q2hhbm5lbEFzeW5jKGUpIHtcblx0XHRcdHJldHVybiB0aGlzLl9lbmRwb2ludHMuaGFzKGUpID8gdGhpcy5fZW5kcG9pbnRzLmdldChlKSA6IHRoaXMuX2RlZmVycmVkQ2hhbm5lbHMuaGFzKGUpID8gdGhpcy5pbml0RGVmZXJyZWQoZSkgOiBudWxsO1xuXHRcdH1cblx0XHRhc3luYyBhZGRXb3JrZXIoZSwgdCwgbiA9IHt9KSB7XG5cdFx0XHRjb25zdCBzID0gWGUodCk7XG5cdFx0XHRpZiAoIXMpIHRocm93IG5ldyBFcnJvcihgRmFpbGVkIHRvIGNyZWF0ZSB3b3JrZXIgZm9yIGNoYW5uZWw6ICR7ZX1gKTtcblx0XHRcdGNvbnN0IHIgPSBuZXcgQShlLCB0aGlzLCB7XG5cdFx0XHRcdC4uLnRoaXMuX29wdGlvbnMuZGVmYXVsdE9wdGlvbnMsXG5cdFx0XHRcdC4uLm5cblx0XHRcdH0pLCBpID0gci5jcmVhdGVSZW1vdGVDaGFubmVsKGUsIG4sIHMpLCBvID0ge1xuXHRcdFx0XHRuYW1lOiBlLFxuXHRcdFx0XHRoYW5kbGVyOiByLFxuXHRcdFx0XHRjb25uZWN0aW9uOiByLmNvbm5lY3Rpb24sXG5cdFx0XHRcdHN1YnNjcmlwdGlvbnM6IFtdLFxuXHRcdFx0XHR0cmFuc3BvcnRUeXBlOiBcIndvcmtlclwiLFxuXHRcdFx0XHRyZWFkeTogUHJvbWlzZS5yZXNvbHZlKGkpLFxuXHRcdFx0XHR1bmlmaWVkOiByLnVuaWZpZWRcblx0XHRcdH07XG5cdFx0XHRyZXR1cm4gdGhpcy5fZW5kcG9pbnRzLnNldChlLCBvKSwgdGhpcy5fcmVnaXN0ZXJVbmlmaWVkQ2hhbm5lbChlLCByLnVuaWZpZWQpLCB0aGlzLl9yZW1vdGVDaGFubmVscy5zZXQoZSwge1xuXHRcdFx0XHRjaGFubmVsOiBlLFxuXHRcdFx0XHRjb250ZXh0OiB0aGlzLFxuXHRcdFx0XHRyZW1vdGU6IFByb21pc2UucmVzb2x2ZShpKSxcblx0XHRcdFx0dHJhbnNwb3J0OiBzLFxuXHRcdFx0XHR0cmFuc3BvcnRUeXBlOiBcIndvcmtlclwiXG5cdFx0XHR9KSwgbztcblx0XHR9XG5cdFx0YXN5bmMgYWRkUG9ydChlLCB0LCBuID0ge30pIHtcblx0XHRcdGNvbnN0IHMgPSBuZXcgQShlLCB0aGlzLCB7XG5cdFx0XHRcdC4uLnRoaXMuX29wdGlvbnMuZGVmYXVsdE9wdGlvbnMsXG5cdFx0XHRcdC4uLm5cblx0XHRcdH0pO1xuXHRcdFx0dC5zdGFydD8uKCk7XG5cdFx0XHRjb25zdCByID0gcy5jcmVhdGVSZW1vdGVDaGFubmVsKGUsIG4sIHQpLCBpID0ge1xuXHRcdFx0XHRuYW1lOiBlLFxuXHRcdFx0XHRoYW5kbGVyOiBzLFxuXHRcdFx0XHRjb25uZWN0aW9uOiBzLmNvbm5lY3Rpb24sXG5cdFx0XHRcdHN1YnNjcmlwdGlvbnM6IFtdLFxuXHRcdFx0XHR0cmFuc3BvcnRUeXBlOiBcIm1lc3NhZ2UtcG9ydFwiLFxuXHRcdFx0XHRyZWFkeTogUHJvbWlzZS5yZXNvbHZlKHIpLFxuXHRcdFx0XHR1bmlmaWVkOiBzLnVuaWZpZWRcblx0XHRcdH07XG5cdFx0XHRyZXR1cm4gdGhpcy5fZW5kcG9pbnRzLnNldChlLCBpKSwgdGhpcy5fcmVnaXN0ZXJVbmlmaWVkQ2hhbm5lbChlLCBzLnVuaWZpZWQpLCB0aGlzLl9yZW1vdGVDaGFubmVscy5zZXQoZSwge1xuXHRcdFx0XHRjaGFubmVsOiBlLFxuXHRcdFx0XHRjb250ZXh0OiB0aGlzLFxuXHRcdFx0XHRyZW1vdGU6IFByb21pc2UucmVzb2x2ZShyKSxcblx0XHRcdFx0dHJhbnNwb3J0OiB0LFxuXHRcdFx0XHR0cmFuc3BvcnRUeXBlOiBcIm1lc3NhZ2UtcG9ydFwiXG5cdFx0XHR9KSwgaTtcblx0XHR9XG5cdFx0YXN5bmMgYWRkQnJvYWRjYXN0KGUsIHQsIG4gPSB7fSkge1xuXHRcdFx0Y29uc3QgcyA9IG5ldyBCcm9hZGNhc3RDaGFubmVsKHQgPz8gZSksIHIgPSBuZXcgQShlLCB0aGlzLCB7XG5cdFx0XHRcdC4uLnRoaXMuX29wdGlvbnMuZGVmYXVsdE9wdGlvbnMsXG5cdFx0XHRcdC4uLm5cblx0XHRcdH0pLCBpID0gci5jcmVhdGVSZW1vdGVDaGFubmVsKGUsIG4sIHMpLCBvID0ge1xuXHRcdFx0XHRuYW1lOiBlLFxuXHRcdFx0XHRoYW5kbGVyOiByLFxuXHRcdFx0XHRjb25uZWN0aW9uOiByLmNvbm5lY3Rpb24sXG5cdFx0XHRcdHN1YnNjcmlwdGlvbnM6IFtdLFxuXHRcdFx0XHR0cmFuc3BvcnRUeXBlOiBcImJyb2FkY2FzdFwiLFxuXHRcdFx0XHRyZWFkeTogUHJvbWlzZS5yZXNvbHZlKGkpLFxuXHRcdFx0XHR1bmlmaWVkOiByLnVuaWZpZWRcblx0XHRcdH07XG5cdFx0XHRyZXR1cm4gdGhpcy5fZW5kcG9pbnRzLnNldChlLCBvKSwgdGhpcy5fcmVnaXN0ZXJVbmlmaWVkQ2hhbm5lbChlLCByLnVuaWZpZWQpLCB0aGlzLl9yZW1vdGVDaGFubmVscy5zZXQoZSwge1xuXHRcdFx0XHRjaGFubmVsOiBlLFxuXHRcdFx0XHRjb250ZXh0OiB0aGlzLFxuXHRcdFx0XHRyZW1vdGU6IFByb21pc2UucmVzb2x2ZShpKSxcblx0XHRcdFx0dHJhbnNwb3J0OiBzLFxuXHRcdFx0XHR0cmFuc3BvcnRUeXBlOiBcImJyb2FkY2FzdFwiXG5cdFx0XHR9KSwgbztcblx0XHR9XG5cdFx0YWRkU2VsZkNoYW5uZWwoZSwgdCA9IHt9KSB7XG5cdFx0XHRjb25zdCBuID0gbmV3IEEoZSwgdGhpcywge1xuXHRcdFx0XHQuLi50aGlzLl9vcHRpb25zLmRlZmF1bHRPcHRpb25zLFxuXHRcdFx0XHQuLi50XG5cdFx0XHR9KSwgcyA9IHRoaXMuX2dsb2JhbFNlbGYgPz8gKHR5cGVvZiBzZWxmIDwgXCJ1XCIgPyBzZWxmIDogbnVsbCksIHIgPSB7XG5cdFx0XHRcdG5hbWU6IGUsXG5cdFx0XHRcdGhhbmRsZXI6IG4sXG5cdFx0XHRcdGNvbm5lY3Rpb246IG4uY29ubmVjdGlvbixcblx0XHRcdFx0c3Vic2NyaXB0aW9uczogW10sXG5cdFx0XHRcdHRyYW5zcG9ydFR5cGU6IFwic2VsZlwiLFxuXHRcdFx0XHRyZWFkeTogUHJvbWlzZS5yZXNvbHZlKHMgPyBuLmNyZWF0ZVJlbW90ZUNoYW5uZWwoZSwgdCwgcykgOiBudWxsKSxcblx0XHRcdFx0dW5pZmllZDogbi51bmlmaWVkXG5cdFx0XHR9O1xuXHRcdFx0cmV0dXJuIHRoaXMuX2VuZHBvaW50cy5zZXQoZSwgciksIHRoaXMuX3JlZ2lzdGVyVW5pZmllZENoYW5uZWwoZSwgbi51bmlmaWVkKSwgcjtcblx0XHR9XG5cdFx0YXN5bmMgYWRkVHJhbnNwb3J0KGUsIHQpIHtcblx0XHRcdGNvbnN0IG4gPSB0Lm9wdGlvbnMgPz8ge307XG5cdFx0XHRzd2l0Y2ggKHQudHlwZSkge1xuXHRcdFx0XHRjYXNlIFwid29ya2VyXCI6XG5cdFx0XHRcdFx0aWYgKCF0LndvcmtlcikgdGhyb3cgbmV3IEVycm9yKFwiV29ya2VyIHJlcXVpcmVkIGZvciB3b3JrZXIgdHJhbnNwb3J0XCIpO1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLmFkZFdvcmtlcihlLCB0Lndvcmtlciwgbik7XG5cdFx0XHRcdGNhc2UgXCJtZXNzYWdlLXBvcnRcIjpcblx0XHRcdFx0XHRpZiAoIXQucG9ydCkgdGhyb3cgbmV3IEVycm9yKFwiUG9ydCByZXF1aXJlZCBmb3IgbWVzc2FnZS1wb3J0IHRyYW5zcG9ydFwiKTtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5hZGRQb3J0KGUsIHQucG9ydCwgbik7XG5cdFx0XHRcdGNhc2UgXCJicm9hZGNhc3RcIjpcblx0XHRcdFx0XHRjb25zdCBzID0gdHlwZW9mIHQuYnJvYWRjYXN0ID09IFwic3RyaW5nXCIgPyB0LmJyb2FkY2FzdCA6IHZvaWQgMDtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5hZGRCcm9hZGNhc3QoZSwgcywgbik7XG5cdFx0XHRcdGNhc2UgXCJzZWxmXCI6IHJldHVybiB0aGlzLmFkZFNlbGZDaGFubmVsKGUsIG4pO1xuXHRcdFx0XHRkZWZhdWx0OiByZXR1cm4gdGhpcy5jcmVhdGVDaGFubmVsKGUsIG4pO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRjcmVhdGVDaGFubmVsUGFpcihlLCB0LCBuID0ge30pIHtcblx0XHRcdGNvbnN0IHMgPSBuZXcgTWVzc2FnZUNoYW5uZWwoKSwgciA9IG5ldyBBKGUsIHRoaXMsIHtcblx0XHRcdFx0Li4udGhpcy5fb3B0aW9ucy5kZWZhdWx0T3B0aW9ucyxcblx0XHRcdFx0Li4ublxuXHRcdFx0fSksIGkgPSBuZXcgQSh0LCB0aGlzLCB7XG5cdFx0XHRcdC4uLnRoaXMuX29wdGlvbnMuZGVmYXVsdE9wdGlvbnMsXG5cdFx0XHRcdC4uLm5cblx0XHRcdH0pO1xuXHRcdFx0cy5wb3J0MS5zdGFydCgpLCBzLnBvcnQyLnN0YXJ0KCk7XG5cdFx0XHRjb25zdCBvID0gUHJvbWlzZS5yZXNvbHZlKHIuY3JlYXRlUmVtb3RlQ2hhbm5lbCh0LCBuLCBzLnBvcnQxKSksIGEgPSBQcm9taXNlLnJlc29sdmUoaS5jcmVhdGVSZW1vdGVDaGFubmVsKGUsIG4sIHMucG9ydDIpKSwgYyA9IHtcblx0XHRcdFx0bmFtZTogZSxcblx0XHRcdFx0aGFuZGxlcjogcixcblx0XHRcdFx0Y29ubmVjdGlvbjogci5jb25uZWN0aW9uLFxuXHRcdFx0XHRzdWJzY3JpcHRpb25zOiBbXSxcblx0XHRcdFx0dHJhbnNwb3J0VHlwZTogXCJtZXNzYWdlLXBvcnRcIixcblx0XHRcdFx0cmVhZHk6IG8sXG5cdFx0XHRcdHVuaWZpZWQ6IHIudW5pZmllZFxuXHRcdFx0fSwgbCA9IHtcblx0XHRcdFx0bmFtZTogdCxcblx0XHRcdFx0aGFuZGxlcjogaSxcblx0XHRcdFx0Y29ubmVjdGlvbjogaS5jb25uZWN0aW9uLFxuXHRcdFx0XHRzdWJzY3JpcHRpb25zOiBbXSxcblx0XHRcdFx0dHJhbnNwb3J0VHlwZTogXCJtZXNzYWdlLXBvcnRcIixcblx0XHRcdFx0cmVhZHk6IGEsXG5cdFx0XHRcdHVuaWZpZWQ6IGkudW5pZmllZFxuXHRcdFx0fTtcblx0XHRcdHJldHVybiB0aGlzLl9lbmRwb2ludHMuc2V0KGUsIGMpLCB0aGlzLl9lbmRwb2ludHMuc2V0KHQsIGwpLCB0aGlzLl9yZWdpc3RlclVuaWZpZWRDaGFubmVsKGUsIHIudW5pZmllZCksIHRoaXMuX3JlZ2lzdGVyVW5pZmllZENoYW5uZWwodCwgaS51bmlmaWVkKSwge1xuXHRcdFx0XHRjaGFubmVsMTogYyxcblx0XHRcdFx0Y2hhbm5lbDI6IGwsXG5cdFx0XHRcdG1lc3NhZ2VDaGFubmVsOiBzXG5cdFx0XHR9O1xuXHRcdH1cblx0XHRnZXQgZ2xvYmFsU2VsZigpIHtcblx0XHRcdHJldHVybiB0aGlzLl9nbG9iYWxTZWxmO1xuXHRcdH1cblx0XHRhc3luYyBjb25uZWN0UmVtb3RlKGUsIHQgPSB7fSwgbikge1xuXHRcdFx0cmV0dXJuIHRoaXMuaW5pdEhvc3QoKSwgdGhpcy5faG9zdC5jcmVhdGVSZW1vdGVDaGFubmVsKGUsIHQsIG4pO1xuXHRcdH1cblx0XHRhc3luYyBpbXBvcnRNb2R1bGVJbkNoYW5uZWwoZSwgdCwgbiA9IHt9LCBzKSB7XG5cdFx0XHRyZXR1cm4gKGF3YWl0IHRoaXMuY29ubmVjdFJlbW90ZShlLCBuLmNoYW5uZWxPcHRpb25zLCBzKSk/LmRvSW1wb3J0TW9kdWxlPy4odCwgbi5pbXBvcnRPcHRpb25zKTtcblx0XHR9XG5cdFx0JGNyZWF0ZU9yVXNlRXhpc3RpbmdSZW1vdGUoZSwgdCA9IHt9LCBuKSB7XG5cdFx0XHRpZiAoZSA9PSBudWxsIHx8IG4pIHJldHVybiBudWxsO1xuXHRcdFx0aWYgKHRoaXMuX3JlbW90ZUNoYW5uZWxzLmhhcyhlKSkgcmV0dXJuIHRoaXMuX3JlbW90ZUNoYW5uZWxzLmdldChlKTtcblx0XHRcdGNvbnN0IHMgPSBuZXcgTWVzc2FnZUNoYW5uZWwoKSwgciA9IGhlKG5ldyBQcm9taXNlKChvKSA9PiB7XG5cdFx0XHRcdGNvbnN0IGEgPSBYZShlcyk7XG5cdFx0XHRcdGE/LmFkZEV2ZW50TGlzdGVuZXI/LihcIm1lc3NhZ2VcIiwgKGMpID0+IHtcblx0XHRcdFx0XHRjLmRhdGEudHlwZSA9PT0gXCJjaGFubmVsQ3JlYXRlZFwiICYmIChzLnBvcnQxPy5zdGFydD8uKCksIG8obmV3IHF0KGMuZGF0YS5jaGFubmVsLCB0aGlzLCB0KSkpO1xuXHRcdFx0XHR9KSwgYT8ucG9zdE1lc3NhZ2U/Lih7XG5cdFx0XHRcdFx0dHlwZTogXCJjcmVhdGVDaGFubmVsXCIsXG5cdFx0XHRcdFx0Y2hhbm5lbDogZSxcblx0XHRcdFx0XHRzZW5kZXI6IHRoaXMuX2hvc3ROYW1lLFxuXHRcdFx0XHRcdG9wdGlvbnM6IHQsXG5cdFx0XHRcdFx0bWVzc2FnZVBvcnQ6IHMucG9ydDJcblx0XHRcdFx0fSwgeyB0cmFuc2ZlcjogW3MucG9ydDJdIH0pO1xuXHRcdFx0fSkpLCBpID0ge1xuXHRcdFx0XHRjaGFubmVsOiBlLFxuXHRcdFx0XHRjb250ZXh0OiB0aGlzLFxuXHRcdFx0XHRtZXNzYWdlQ2hhbm5lbDogcyxcblx0XHRcdFx0cmVtb3RlOiByXG5cdFx0XHR9O1xuXHRcdFx0cmV0dXJuIHRoaXMuX3JlbW90ZUNoYW5uZWxzLnNldChlLCBpKSwgaTtcblx0XHR9XG5cdFx0JHJlZ2lzdGVyQ29ubmVjdGlvbihlKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHQuLi50aGlzLl9jb25uZWN0aW9uUmVnaXN0cnkucmVnaXN0ZXIoZSksXG5cdFx0XHRcdGNvbnRleHRJZDogdGhpcy5faWRcblx0XHRcdH07XG5cdFx0fVxuXHRcdCRtYXJrTm90aWZpZWQoZSkge1xuXHRcdFx0Y29uc3QgdCA9IHRoaXMuX2Nvbm5lY3Rpb25SZWdpc3RyeS5yZWdpc3Rlcih7XG5cdFx0XHRcdGxvY2FsQ2hhbm5lbDogZS5sb2NhbENoYW5uZWwsXG5cdFx0XHRcdHJlbW90ZUNoYW5uZWw6IGUucmVtb3RlQ2hhbm5lbCxcblx0XHRcdFx0c2VuZGVyOiBlLnNlbmRlcixcblx0XHRcdFx0ZGlyZWN0aW9uOiBlLmRpcmVjdGlvbixcblx0XHRcdFx0dHJhbnNwb3J0VHlwZTogZS50cmFuc3BvcnRUeXBlXG5cdFx0XHR9KTtcblx0XHRcdHRoaXMuX2Nvbm5lY3Rpb25SZWdpc3RyeS5tYXJrTm90aWZpZWQodCwgZS5wYXlsb2FkKTtcblx0XHR9XG5cdFx0JG9ic2VydmVTaWduYWwoZSkge1xuXHRcdFx0Y29uc3QgdCA9IChlLnBheWxvYWQ/LnR5cGUsIFwiaW5jb21pbmdcIik7XG5cdFx0XHR0aGlzLiRtYXJrTm90aWZpZWQoe1xuXHRcdFx0XHRsb2NhbENoYW5uZWw6IGUubG9jYWxDaGFubmVsLFxuXHRcdFx0XHRyZW1vdGVDaGFubmVsOiBlLnJlbW90ZUNoYW5uZWwsXG5cdFx0XHRcdHNlbmRlcjogZS5zZW5kZXIsXG5cdFx0XHRcdGRpcmVjdGlvbjogdCxcblx0XHRcdFx0dHJhbnNwb3J0VHlwZTogZS50cmFuc3BvcnRUeXBlLFxuXHRcdFx0XHRwYXlsb2FkOiBlLnBheWxvYWRcblx0XHRcdH0pO1xuXHRcdH1cblx0XHQkZm9yd2FyZFVuaWZpZWRDb25uZWN0aW9uRXZlbnQoZSwgdCkge1xuXHRcdFx0Y29uc3QgbiA9IHQuY29ubmVjdGlvbi50cmFuc3BvcnRUeXBlID8/IFwiaW50ZXJuYWxcIiwgcyA9IHRoaXMuX2Nvbm5lY3Rpb25SZWdpc3RyeS5yZWdpc3Rlcih7XG5cdFx0XHRcdGxvY2FsQ2hhbm5lbDogdC5jb25uZWN0aW9uLmxvY2FsQ2hhbm5lbCB8fCBlLFxuXHRcdFx0XHRyZW1vdGVDaGFubmVsOiB0LmNvbm5lY3Rpb24ucmVtb3RlQ2hhbm5lbCxcblx0XHRcdFx0c2VuZGVyOiB0LmNvbm5lY3Rpb24uc2VuZGVyLFxuXHRcdFx0XHRkaXJlY3Rpb246IHQuY29ubmVjdGlvbi5kaXJlY3Rpb24sXG5cdFx0XHRcdHRyYW5zcG9ydFR5cGU6IG4sXG5cdFx0XHRcdG1ldGFkYXRhOiB0LmNvbm5lY3Rpb24ubWV0YWRhdGFcblx0XHRcdH0pO1xuXHRcdFx0dC50eXBlID09PSBcIm5vdGlmaWVkXCIgPyB0aGlzLl9jb25uZWN0aW9uUmVnaXN0cnkubWFya05vdGlmaWVkKHMsIHQucGF5bG9hZCkgOiB0LnR5cGUgPT09IFwiZGlzY29ubmVjdGVkXCIgJiYgdGhpcy5fY29ubmVjdGlvblJlZ2lzdHJ5LmNsb3NlQnlDaGFubmVsKHQuY29ubmVjdGlvbi5sb2NhbENoYW5uZWwpO1xuXHRcdH1cblx0XHRjbG9zZUNoYW5uZWwoZSkge1xuXHRcdFx0Y29uc3QgdCA9IHRoaXMuX2VuZHBvaW50cy5nZXQoZSk7XG5cdFx0XHRyZXR1cm4gdCA/ICh0LnN1YnNjcmlwdGlvbnMuZm9yRWFjaCgobikgPT4gbi51bnN1YnNjcmliZSgpKSwgdC5oYW5kbGVyLmNsb3NlKCksIHQudHJhbnNwb3J0Py5kZXRhY2goKSwgdGhpcy5fdW5pZmllZENvbm5lY3Rpb25TdWJzLmdldChlKT8udW5zdWJzY3JpYmUoKSwgdGhpcy5fdW5pZmllZENvbm5lY3Rpb25TdWJzLmRlbGV0ZShlKSwgdGhpcy5fdW5pZmllZEJ5Q2hhbm5lbC5kZWxldGUoZSksIHRoaXMuX2VuZHBvaW50cy5kZWxldGUoZSksIGUgPT09IHRoaXMuX2hvc3ROYW1lICYmICh0aGlzLl9ob3N0ID0gbnVsbCksIHRoaXMuX2Nvbm5lY3Rpb25SZWdpc3RyeS5jbG9zZUJ5Q2hhbm5lbChlKSwgITApIDogITE7XG5cdFx0fVxuXHRcdGNsb3NlKCkge1xuXHRcdFx0aWYgKCF0aGlzLl9jbG9zZWQpIHtcblx0XHRcdFx0dGhpcy5fY2xvc2VkID0gITA7XG5cdFx0XHRcdGZvciAoY29uc3QgW2VdIG9mIHRoaXMuX2VuZHBvaW50cykgdGhpcy5jbG9zZUNoYW5uZWwoZSk7XG5cdFx0XHRcdHRoaXMuX3JlbW90ZUNoYW5uZWxzLmNsZWFyKCksIHRoaXMuX2hvc3QgPSBudWxsLCB0aGlzLl91bmlmaWVkQ29ubmVjdGlvblN1YnMuZm9yRWFjaCgoZSkgPT4gZS51bnN1YnNjcmliZSgpKSwgdGhpcy5fdW5pZmllZENvbm5lY3Rpb25TdWJzLmNsZWFyKCksIHRoaXMuX3VuaWZpZWRCeUNoYW5uZWwuY2xlYXIoKSwgdGhpcy5fY29ubmVjdGlvblJlZ2lzdHJ5LmNsZWFyKCksIHRoaXMuX2Nvbm5lY3Rpb25FdmVudHMuY29tcGxldGUoKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0Z2V0IGNsb3NlZCgpIHtcblx0XHRcdHJldHVybiB0aGlzLl9jbG9zZWQ7XG5cdFx0fVxuXHRcdF9yZWdpc3RlclVuaWZpZWRDaGFubmVsKGUsIHQpIHtcblx0XHRcdHRoaXMuX3VuaWZpZWRCeUNoYW5uZWwuc2V0KGUsIHQpLCB0aGlzLl91bmlmaWVkQ29ubmVjdGlvblN1YnMuZ2V0KGUpPy51bnN1YnNjcmliZSgpO1xuXHRcdFx0Y29uc3QgbiA9IHQuc3Vic2NyaWJlQ29ubmVjdGlvbnMoKHMpID0+IHtcblx0XHRcdFx0dGhpcy4kZm9yd2FyZFVuaWZpZWRDb25uZWN0aW9uRXZlbnQoZSwgcyk7XG5cdFx0XHR9KTtcblx0XHRcdHRoaXMuX3VuaWZpZWRDb25uZWN0aW9uU3Vicy5zZXQoZSwgbik7XG5cdFx0fVxuXHRcdF9lbWl0Q29ubmVjdGlvbkV2ZW50KGUpIHtcblx0XHRcdHRoaXMuX2Nvbm5lY3Rpb25FdmVudHMubmV4dCh7XG5cdFx0XHRcdC4uLmUsXG5cdFx0XHRcdGNvbm5lY3Rpb246IHtcblx0XHRcdFx0XHQuLi5lLmNvbm5lY3Rpb24sXG5cdFx0XHRcdFx0Y29udGV4dElkOiB0aGlzLl9pZFxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cdH07XG5cdGZ1bmN0aW9uIE90KGUpIHtcblx0XHRyZXR1cm4gWy4uLk9iamVjdC52YWx1ZXMoZCldLmluY2x1ZGVzKGUpO1xuXHR9XG5cdGZ1bmN0aW9uIHRzKGUpIHtcblx0XHRpZiAoIWUpIHJldHVybiBudWxsO1xuXHRcdGlmIChEdChlKSkgcmV0dXJuIGU7XG5cdFx0Y29uc3QgdCA9IGUsIG4gPSBMdCh0KTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dGFyZ2V0OiB0LFxuXHRcdFx0dGFyZ2V0Q2hhbm5lbDogXCJ1bmtub3duXCIsXG5cdFx0XHR0cmFuc3BvcnRUeXBlOiBuID09PSBcImludGVybmFsXCIgPyBcInNlbGZcIiA6IG4sXG5cdFx0XHRzZW5kZXI6IChzLCByKSA9PiB7XG5cdFx0XHRcdGlmICh0eXBlb2YgV2ViU29ja2V0IDwgXCJ1XCIgJiYgdCBpbnN0YW5jZW9mIFdlYlNvY2tldCkge1xuXHRcdFx0XHRcdHQuc2VuZChKU09OLnN0cmluZ2lmeShzKSk7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHQucG9zdE1lc3NhZ2U/LihzLCByPy5sZW5ndGggPyB7IHRyYW5zZmVyOiByIH0gOiB2b2lkIDApO1xuXHRcdFx0fSxcblx0XHRcdHBvc3RNZXNzYWdlOiAocywgcikgPT4ge1xuXHRcdFx0XHR0LnBvc3RNZXNzYWdlPy4ocywgcik7XG5cdFx0XHR9LFxuXHRcdFx0YWRkRXZlbnRMaXN0ZW5lcjogdC5hZGRFdmVudExpc3RlbmVyPy5iaW5kKHQpLFxuXHRcdFx0cmVtb3ZlRXZlbnRMaXN0ZW5lcjogdC5yZW1vdmVFdmVudExpc3RlbmVyPy5iaW5kKHQpLFxuXHRcdFx0c3RhcnQ6IHQuc3RhcnQ/LmJpbmQodCksXG5cdFx0XHRjbG9zZTogdC5jbG9zZT8uYmluZCh0KVxuXHRcdH07XG5cdH1cblx0ZnVuY3Rpb24gRHQoZSkge1xuXHRcdHJldHVybiAhIWUgJiYgdHlwZW9mIGUgPT0gXCJvYmplY3RcIiAmJiBcInRhcmdldFwiIGluIGUgJiYgdHlwZW9mIGUucG9zdE1lc3NhZ2UgPT0gXCJmdW5jdGlvblwiO1xuXHR9XG5cdGZ1bmN0aW9uIEx0KGUpIHtcblx0XHRjb25zdCB0ID0gRHQoZSkgPyBlLnRhcmdldCA6IGU7XG5cdFx0cmV0dXJuIHQgPyB0ID09PSBcImNocm9tZS1ydW50aW1lXCIgPyBcImNocm9tZS1ydW50aW1lXCIgOiB0ID09PSBcImNocm9tZS10YWJzXCIgPyBcImNocm9tZS10YWJzXCIgOiB0ID09PSBcImNocm9tZS1wb3J0XCIgPyBcImNocm9tZS1wb3J0XCIgOiB0ID09PSBcImNocm9tZS1leHRlcm5hbFwiID8gXCJjaHJvbWUtZXh0ZXJuYWxcIiA6IHR5cGVvZiBNZXNzYWdlUG9ydCA8IFwidVwiICYmIHQgaW5zdGFuY2VvZiBNZXNzYWdlUG9ydCA/IFwibWVzc2FnZS1wb3J0XCIgOiB0eXBlb2YgQnJvYWRjYXN0Q2hhbm5lbCA8IFwidVwiICYmIHQgaW5zdGFuY2VvZiBCcm9hZGNhc3RDaGFubmVsID8gXCJicm9hZGNhc3RcIiA6IHR5cGVvZiBXb3JrZXIgPCBcInVcIiAmJiB0IGluc3RhbmNlb2YgV29ya2VyID8gXCJ3b3JrZXJcIiA6IHR5cGVvZiBXZWJTb2NrZXQgPCBcInVcIiAmJiB0IGluc3RhbmNlb2YgV2ViU29ja2V0ID8gXCJ3ZWJzb2NrZXRcIiA6IHR5cGVvZiBjaHJvbWUgPCBcInVcIiAmJiB0eXBlb2YgdCA9PSBcIm9iamVjdFwiICYmIHQgJiYgdHlwZW9mIHQucG9zdE1lc3NhZ2UgPT0gXCJmdW5jdGlvblwiICYmIHQub25NZXNzYWdlPy5hZGRMaXN0ZW5lciA/IFwiY2hyb21lLXBvcnRcIiA6IHR5cGVvZiBzZWxmIDwgXCJ1XCIgJiYgdCA9PT0gc2VsZiA/IFwic2VsZlwiIDogXCJpbnRlcm5hbFwiIDogXCJpbnRlcm5hbFwiO1xuXHR9XG5cdGZ1bmN0aW9uIFhlKGUpIHtcblx0XHRpZiAoZSBpbnN0YW5jZW9mIFdvcmtlcikgcmV0dXJuIGU7XG5cdFx0aWYgKGUgaW5zdGFuY2VvZiBVUkwpIHJldHVybiBuZXcgV29ya2VyKGUuaHJlZiwgeyB0eXBlOiBcIm1vZHVsZVwiIH0pO1xuXHRcdGlmICh0eXBlb2YgZSA9PSBcImZ1bmN0aW9uXCIpIHRyeSB7XG5cdFx0XHRyZXR1cm4gbmV3IGUoeyB0eXBlOiBcIm1vZHVsZVwiIH0pO1xuXHRcdH0gY2F0Y2gge1xuXHRcdFx0cmV0dXJuIGUoeyB0eXBlOiBcIm1vZHVsZVwiIH0pO1xuXHRcdH1cblx0XHRyZXR1cm4gdHlwZW9mIGUgPT0gXCJzdHJpbmdcIiA/IGUuc3RhcnRzV2l0aChcIi9cIikgPyBuZXcgV29ya2VyKFAoZS5yZXBsYWNlKC9eXFwvLywgXCIuL1wiKSksIHsgdHlwZTogXCJtb2R1bGVcIiB9KSA6IFVSTC5jYW5QYXJzZShlKSB8fCBlLnN0YXJ0c1dpdGgoXCIuL1wiKSA/IG5ldyBXb3JrZXIoUChlKSwgeyB0eXBlOiBcIm1vZHVsZVwiIH0pIDogbmV3IFdvcmtlcihVUkwuY3JlYXRlT2JqZWN0VVJMKG5ldyBCbG9iKFtlXSwgeyB0eXBlOiBcImFwcGxpY2F0aW9uL2phdmFzY3JpcHRcIiB9KSksIHsgdHlwZTogXCJtb2R1bGVcIiB9KSA6IGUgaW5zdGFuY2VvZiBCbG9iIHx8IGUgaW5zdGFuY2VvZiBGaWxlID8gbmV3IFdvcmtlcihVUkwuY3JlYXRlT2JqZWN0VVJMKGUpLCB7IHR5cGU6IFwibW9kdWxlXCIgfSkgOiBlID8/ICh0eXBlb2Ygc2VsZiA8IFwidVwiID8gc2VsZiA6IG51bGwpO1xuXHR9XG5cdHZhciBxID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0ZnVuY3Rpb24gbmUoZSA9IHt9KSB7XG5cdFx0Y29uc3QgdCA9IG5ldyBOdChlKTtcblx0XHRyZXR1cm4gZS5uYW1lICYmIHEuc2V0KGUubmFtZSwgdCksIHQ7XG5cdH1cblx0dmFyIEJ0ID0gY2xhc3Mge1xuXHRcdF9jb250ZXh0O1xuXHRcdF9jb25maWc7XG5cdFx0X3N1YnNjcmlwdGlvbnMgPSBbXTtcblx0XHRfaW5jb21pbmdDb25uZWN0aW9ucyA9IG5ldyBfKHsgYnVmZmVyU2l6ZTogMTAwIH0pO1xuXHRcdF9jaGFubmVsQ3JlYXRlZCA9IG5ldyBfKHsgYnVmZmVyU2l6ZTogMTAwIH0pO1xuXHRcdF9jaGFubmVsQ2xvc2VkID0gbmV3IF8oKTtcblx0XHRjb25zdHJ1Y3RvcihlID0ge30pIHtcblx0XHRcdHRoaXMuX2NvbmZpZyA9IHtcblx0XHRcdFx0bmFtZTogZS5uYW1lID8/IFwid29ya2VyXCIsXG5cdFx0XHRcdHdvcmtlck5hbWU6IGUud29ya2VyTmFtZSA/PyBgd29ya2VyLSR7JGUoKS5zbGljZSgwLCA4KX1gLFxuXHRcdFx0XHRhdXRvQWNjZXB0Q2hhbm5lbHM6IGUuYXV0b0FjY2VwdENoYW5uZWxzID8/ICEwLFxuXHRcdFx0XHRhbGxvd2VkQ2hhbm5lbHM6IGUuYWxsb3dlZENoYW5uZWxzID8/IFtdLFxuXHRcdFx0XHRtYXhDaGFubmVsczogZS5tYXhDaGFubmVscyA/PyAxMDAsXG5cdFx0XHRcdGF1dG9Db25uZWN0OiBlLmF1dG9Db25uZWN0ID8/ICEwLFxuXHRcdFx0XHR1c2VHbG9iYWxTZWxmOiAhMCxcblx0XHRcdFx0ZGVmYXVsdE9wdGlvbnM6IGUuZGVmYXVsdE9wdGlvbnMgPz8ge30sXG5cdFx0XHRcdGlzb2xhdGVkU3RvcmFnZTogZS5pc29sYXRlZFN0b3JhZ2UgPz8gITEsXG5cdFx0XHRcdC4uLmVcblx0XHRcdH0sIHRoaXMuX2NvbnRleHQgPSBuZSh7XG5cdFx0XHRcdG5hbWU6IHRoaXMuX2NvbmZpZy5uYW1lLFxuXHRcdFx0XHR1c2VHbG9iYWxTZWxmOiAhMCxcblx0XHRcdFx0ZGVmYXVsdE9wdGlvbnM6IGUuZGVmYXVsdE9wdGlvbnNcblx0XHRcdH0pLCB0aGlzLl9zZXR1cE1lc3NhZ2VMaXN0ZW5lcigpO1xuXHRcdH1cblx0XHRnZXQgb25Db25uZWN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2luY29taW5nQ29ubmVjdGlvbnM7XG5cdFx0fVxuXHRcdGdldCBvbkNoYW5uZWxDcmVhdGVkKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2NoYW5uZWxDcmVhdGVkO1xuXHRcdH1cblx0XHRnZXQgb25DaGFubmVsQ2xvc2VkKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2NoYW5uZWxDbG9zZWQ7XG5cdFx0fVxuXHRcdHN1YnNjcmliZUNvbm5lY3Rpb25zKGUpIHtcblx0XHRcdHJldHVybiB0aGlzLl9pbmNvbWluZ0Nvbm5lY3Rpb25zLnN1YnNjcmliZShlKTtcblx0XHR9XG5cdFx0c3Vic2NyaWJlQ2hhbm5lbENyZWF0ZWQoZSkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2NoYW5uZWxDcmVhdGVkLnN1YnNjcmliZShlKTtcblx0XHR9XG5cdFx0YWNjZXB0Q29ubmVjdGlvbihlKSB7XG5cdFx0XHRpZiAoIXRoaXMuX2NhbkFjY2VwdENoYW5uZWwoZS5jaGFubmVsKSkgcmV0dXJuIG51bGw7XG5cdFx0XHRjb25zdCB0ID0gdGhpcy5fY29udGV4dC5jcmVhdGVDaGFubmVsKGUuY2hhbm5lbCwgZS5vcHRpb25zKTtcblx0XHRcdHJldHVybiBlLnBvcnQgJiYgKGUucG9ydC5zdGFydD8uKCksIHQuaGFuZGxlci5jcmVhdGVSZW1vdGVDaGFubmVsKGUuc2VuZGVyLCBlLm9wdGlvbnMsIGUucG9ydCkpLCB0aGlzLl9jaGFubmVsQ3JlYXRlZC5uZXh0KHtcblx0XHRcdFx0Y2hhbm5lbDogZS5jaGFubmVsLFxuXHRcdFx0XHRlbmRwb2ludDogdCxcblx0XHRcdFx0c2VuZGVyOiBlLnNlbmRlcixcblx0XHRcdFx0dGltZXN0YW1wOiBEYXRlLm5vdygpXG5cdFx0XHR9KSwgdGhpcy5fcG9zdENoYW5uZWxDcmVhdGVkKGUuY2hhbm5lbCwgZS5zZW5kZXIsIGUuaWQpLCB0O1xuXHRcdH1cblx0XHRjcmVhdGVDaGFubmVsKGUsIHQpIHtcblx0XHRcdHJldHVybiB0aGlzLl9jb250ZXh0LmNyZWF0ZUNoYW5uZWwoZSwgdCk7XG5cdFx0fVxuXHRcdGdldENoYW5uZWwoZSkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2NvbnRleHQuZ2V0Q2hhbm5lbChlKTtcblx0XHR9XG5cdFx0aGFzQ2hhbm5lbChlKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY29udGV4dC5oYXNDaGFubmVsKGUpO1xuXHRcdH1cblx0XHRnZXRDaGFubmVsTmFtZXMoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY29udGV4dC5nZXRDaGFubmVsTmFtZXMoKTtcblx0XHR9XG5cdFx0cXVlcnlDb25uZWN0aW9ucyhlID0ge30pIHtcblx0XHRcdHJldHVybiB0aGlzLl9jb250ZXh0LnF1ZXJ5Q29ubmVjdGlvbnMoZSk7XG5cdFx0fVxuXHRcdG5vdGlmeUNvbm5lY3Rpb25zKGUgPSB7fSwgdCA9IHt9KSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY29udGV4dC5ub3RpZnlDb25uZWN0aW9ucyhlLCB0KTtcblx0XHR9XG5cdFx0Y2xvc2VDaGFubmVsKGUpIHtcblx0XHRcdGNvbnN0IHQgPSB0aGlzLl9jb250ZXh0LmNsb3NlQ2hhbm5lbChlKTtcblx0XHRcdHJldHVybiB0ICYmIHRoaXMuX2NoYW5uZWxDbG9zZWQubmV4dCh7XG5cdFx0XHRcdGNoYW5uZWw6IGUsXG5cdFx0XHRcdHRpbWVzdGFtcDogRGF0ZS5ub3coKVxuXHRcdFx0fSksIHQ7XG5cdFx0fVxuXHRcdGdldCBjb250ZXh0KCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2NvbnRleHQ7XG5cdFx0fVxuXHRcdGdldCBjb25maWcoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY29uZmlnO1xuXHRcdH1cblx0XHRfc2V0dXBNZXNzYWdlTGlzdGVuZXIoKSB7XG5cdFx0XHRhZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCAoKGUpID0+IHtcblx0XHRcdFx0dGhpcy5faGFuZGxlSW5jb21pbmdNZXNzYWdlKGUpO1xuXHRcdFx0fSkpO1xuXHRcdH1cblx0XHRfaGFuZGxlSW5jb21pbmdNZXNzYWdlKGUpIHtcblx0XHRcdGNvbnN0IHQgPSBlLmRhdGE7XG5cdFx0XHRpZiAoISghdCB8fCB0eXBlb2YgdCAhPSBcIm9iamVjdFwiKSkgc3dpdGNoICh0LnR5cGUpIHtcblx0XHRcdFx0Y2FzZSBcImNyZWF0ZUNoYW5uZWxcIjpcblx0XHRcdFx0XHR0aGlzLl9oYW5kbGVDcmVhdGVDaGFubmVsKHQpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwiY29ubmVjdENoYW5uZWxcIjpcblx0XHRcdFx0XHR0aGlzLl9oYW5kbGVDb25uZWN0Q2hhbm5lbCh0KTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcImFkZFBvcnRcIjpcblx0XHRcdFx0XHR0aGlzLl9oYW5kbGVBZGRQb3J0KHQpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwibGlzdENoYW5uZWxzXCI6XG5cdFx0XHRcdFx0dGhpcy5faGFuZGxlTGlzdENoYW5uZWxzKHQpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwiY2xvc2VDaGFubmVsXCI6XG5cdFx0XHRcdFx0dGhpcy5faGFuZGxlQ2xvc2VDaGFubmVsKHQpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwicGluZ1wiOlxuXHRcdFx0XHRcdHBvc3RNZXNzYWdlKHtcblx0XHRcdFx0XHRcdHR5cGU6IFwicG9uZ1wiLFxuXHRcdFx0XHRcdFx0aWQ6IHQuaWQsXG5cdFx0XHRcdFx0XHR0aW1lc3RhbXA6IERhdGUubm93KClcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0ZGVmYXVsdDogdC5jaGFubmVsICYmIHRoaXMuX2NvbnRleHQuaGFzQ2hhbm5lbCh0LmNoYW5uZWwpICYmIHRoaXMuX2NvbnRleHQuZ2V0Q2hhbm5lbCh0LmNoYW5uZWwpPy5oYW5kbGVyPy5oYW5kbGVBbmRSZXNwb25zZT8uKHQucGF5bG9hZCwgdC5yZXFJZCk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdF9oYW5kbGVDcmVhdGVDaGFubmVsKGUpIHtcblx0XHRcdGNvbnN0IHQgPSB7XG5cdFx0XHRcdGlkOiBlLnJlcUlkID8/ICRlKCksXG5cdFx0XHRcdGNoYW5uZWw6IGUuY2hhbm5lbCxcblx0XHRcdFx0c2VuZGVyOiBlLnNlbmRlciA/PyBcInVua25vd25cIixcblx0XHRcdFx0dHlwZTogXCJjaGFubmVsXCIsXG5cdFx0XHRcdHBvcnQ6IGUubWVzc2FnZVBvcnQsXG5cdFx0XHRcdHRpbWVzdGFtcDogRGF0ZS5ub3coKSxcblx0XHRcdFx0b3B0aW9uczogZS5vcHRpb25zXG5cdFx0XHR9O1xuXHRcdFx0dGhpcy5faW5jb21pbmdDb25uZWN0aW9ucy5uZXh0KHQpLCB0aGlzLl9jb25maWcuYXV0b0FjY2VwdENoYW5uZWxzICYmIHRoaXMuYWNjZXB0Q29ubmVjdGlvbih0KTtcblx0XHR9XG5cdFx0X2hhbmRsZUNvbm5lY3RDaGFubmVsKGUpIHtcblx0XHRcdGNvbnN0IHQgPSB7XG5cdFx0XHRcdGlkOiBlLnJlcUlkID8/ICRlKCksXG5cdFx0XHRcdGNoYW5uZWw6IGUuY2hhbm5lbCxcblx0XHRcdFx0c2VuZGVyOiBlLnNlbmRlciA/PyBcInVua25vd25cIixcblx0XHRcdFx0dHlwZTogZS5wb3J0VHlwZSA/PyBcImNoYW5uZWxcIixcblx0XHRcdFx0cG9ydDogZS5wb3J0LFxuXHRcdFx0XHR0aW1lc3RhbXA6IERhdGUubm93KCksXG5cdFx0XHRcdG9wdGlvbnM6IGUub3B0aW9uc1xuXHRcdFx0fTtcblx0XHRcdGlmICh0aGlzLl9pbmNvbWluZ0Nvbm5lY3Rpb25zLm5leHQodCksIHRoaXMuX2NvbmZpZy5hdXRvQWNjZXB0Q2hhbm5lbHMgJiYgdGhpcy5fY2FuQWNjZXB0Q2hhbm5lbChlLmNoYW5uZWwpKSB7XG5cdFx0XHRcdGNvbnN0IG4gPSB0aGlzLl9jb250ZXh0LmdldE9yQ3JlYXRlQ2hhbm5lbChlLmNoYW5uZWwsIGUub3B0aW9ucyk7XG5cdFx0XHRcdGUucG9ydCAmJiAoZS5wb3J0LnN0YXJ0Py4oKSwgbi5oYW5kbGVyLmNyZWF0ZVJlbW90ZUNoYW5uZWwoZS5zZW5kZXIsIGUub3B0aW9ucywgZS5wb3J0KSksIHBvc3RNZXNzYWdlKHtcblx0XHRcdFx0XHR0eXBlOiBcImNoYW5uZWxDb25uZWN0ZWRcIixcblx0XHRcdFx0XHRjaGFubmVsOiBlLmNoYW5uZWwsXG5cdFx0XHRcdFx0cmVxSWQ6IGUucmVxSWRcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdF9oYW5kbGVBZGRQb3J0KGUpIHtcblx0XHRcdGlmICghZS5wb3J0IHx8ICFlLmNoYW5uZWwpIHJldHVybjtcblx0XHRcdGNvbnN0IHQgPSB7XG5cdFx0XHRcdGlkOiBlLnJlcUlkID8/ICRlKCksXG5cdFx0XHRcdGNoYW5uZWw6IGUuY2hhbm5lbCxcblx0XHRcdFx0c2VuZGVyOiBlLnNlbmRlciA/PyBcInVua25vd25cIixcblx0XHRcdFx0dHlwZTogXCJwb3J0XCIsXG5cdFx0XHRcdHBvcnQ6IGUucG9ydCxcblx0XHRcdFx0dGltZXN0YW1wOiBEYXRlLm5vdygpLFxuXHRcdFx0XHRvcHRpb25zOiBlLm9wdGlvbnNcblx0XHRcdH07XG5cdFx0XHR0aGlzLl9pbmNvbWluZ0Nvbm5lY3Rpb25zLm5leHQodCksIHRoaXMuX2NvbmZpZy5hdXRvQWNjZXB0Q2hhbm5lbHMgJiYgdGhpcy5hY2NlcHRDb25uZWN0aW9uKHQpO1xuXHRcdH1cblx0XHRfaGFuZGxlTGlzdENoYW5uZWxzKGUpIHtcblx0XHRcdHBvc3RNZXNzYWdlKHtcblx0XHRcdFx0dHlwZTogXCJjaGFubmVsTGlzdFwiLFxuXHRcdFx0XHRjaGFubmVsczogdGhpcy5nZXRDaGFubmVsTmFtZXMoKSxcblx0XHRcdFx0cmVxSWQ6IGUucmVxSWRcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRfaGFuZGxlQ2xvc2VDaGFubmVsKGUpIHtcblx0XHRcdGUuY2hhbm5lbCAmJiAodGhpcy5jbG9zZUNoYW5uZWwoZS5jaGFubmVsKSwgcG9zdE1lc3NhZ2Uoe1xuXHRcdFx0XHR0eXBlOiBcImNoYW5uZWxDbG9zZWRcIixcblx0XHRcdFx0Y2hhbm5lbDogZS5jaGFubmVsLFxuXHRcdFx0XHRyZXFJZDogZS5yZXFJZFxuXHRcdFx0fSkpO1xuXHRcdH1cblx0XHRfY2FuQWNjZXB0Q2hhbm5lbChlKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY29udGV4dC5zaXplID49IHRoaXMuX2NvbmZpZy5tYXhDaGFubmVscyA/ICExIDogdGhpcy5fY29uZmlnLmFsbG93ZWRDaGFubmVscy5sZW5ndGggPiAwID8gdGhpcy5fY29uZmlnLmFsbG93ZWRDaGFubmVscy5pbmNsdWRlcyhlKSA6ICEwO1xuXHRcdH1cblx0XHRfcG9zdENoYW5uZWxDcmVhdGVkKGUsIHQsIG4pIHtcblx0XHRcdHBvc3RNZXNzYWdlKHtcblx0XHRcdFx0dHlwZTogXCJjaGFubmVsQ3JlYXRlZFwiLFxuXHRcdFx0XHRjaGFubmVsOiBlLFxuXHRcdFx0XHRzZW5kZXI6IHQsXG5cdFx0XHRcdHJlcUlkOiBuLFxuXHRcdFx0XHR0aW1lc3RhbXA6IERhdGUubm93KClcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRjbG9zZSgpIHtcblx0XHRcdHRoaXMuX3N1YnNjcmlwdGlvbnMuZm9yRWFjaCgoZSkgPT4gZS51bnN1YnNjcmliZSgpKSwgdGhpcy5fc3Vic2NyaXB0aW9ucyA9IFtdLCB0aGlzLl9pbmNvbWluZ0Nvbm5lY3Rpb25zLmNvbXBsZXRlKCksIHRoaXMuX2NoYW5uZWxDcmVhdGVkLmNvbXBsZXRlKCksIHRoaXMuX2NoYW5uZWxDbG9zZWQuY29tcGxldGUoKSwgdGhpcy5fY29udGV4dC5jbG9zZSgpO1xuXHRcdH1cblx0fTtcblx0dmFyIGogPSBudWxsO1xuXHRmdW5jdGlvbiBCZShlKSB7XG5cdFx0cmV0dXJuIGogfHwgKGogPSBuZXcgQnQoZSkpLCBqO1xuXHR9XG5cdHZhciByaSA9IEJlKHsgbmFtZTogXCJ3b3JrZXJcIiB9KTtcblx0dmFyIEIgPSBjbGFzcyB7XG5cdFx0X2NoYW5uZWxOYW1lO1xuXHRcdF9jb25maWc7XG5cdFx0X3BvcnQ7XG5cdFx0X3N1YnMgPSAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpO1xuXHRcdF9wZW5kaW5nID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0XHRfbGlzdGVuaW5nID0gITE7XG5cdFx0X2NsZWFudXAgPSBudWxsO1xuXHRcdF9wb3J0SWQgPSAkZSgpO1xuXHRcdF9zdGF0ZSA9IG5ldyBfKCk7XG5cdFx0X2tlZXBBbGl2ZVRpbWVyID0gbnVsbDtcblx0XHRjb25zdHJ1Y3RvcihlLCB0LCBuID0ge30pIHtcblx0XHRcdHRoaXMuX2NoYW5uZWxOYW1lID0gdCwgdGhpcy5fY29uZmlnID0gbiwgdGhpcy5fcG9ydCA9IGUsIHRoaXMuX3NldHVwUG9ydCgpLCBuLmF1dG9TdGFydCAhPT0gITEgJiYgdGhpcy5zdGFydCgpO1xuXHRcdH1cblx0XHRfc2V0dXBQb3J0KCkge1xuXHRcdFx0Y29uc3QgZSA9IChuKSA9PiB7XG5cdFx0XHRcdGNvbnN0IHMgPSBuLmRhdGE7XG5cdFx0XHRcdGlmIChzLnR5cGUgPT09IFwicmVzcG9uc2VcIiAmJiBzLnJlcUlkKSB7XG5cdFx0XHRcdFx0Y29uc3QgciA9IHRoaXMuX3BlbmRpbmcuZ2V0KHMucmVxSWQpO1xuXHRcdFx0XHRcdGlmIChyKSB7XG5cdFx0XHRcdFx0XHR0aGlzLl9wZW5kaW5nLmRlbGV0ZShzLnJlcUlkKSwgcy5wYXlsb2FkPy5lcnJvciA/IHIucmVqZWN0KG5ldyBFcnJvcihzLnBheWxvYWQuZXJyb3IpKSA6IHIucmVzb2x2ZShzLnBheWxvYWQ/LnJlc3VsdCA/PyBzLnBheWxvYWQpO1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAocy50eXBlID09PSBcInNpZ25hbFwiICYmIHMucGF5bG9hZD8uYWN0aW9uID09PSBcInBpbmdcIikge1xuXHRcdFx0XHRcdHRoaXMuc2VuZCh7XG5cdFx0XHRcdFx0XHRpZDogJGUoKSxcblx0XHRcdFx0XHRcdGNoYW5uZWw6IHRoaXMuX2NoYW5uZWxOYW1lLFxuXHRcdFx0XHRcdFx0c2VuZGVyOiB0aGlzLl9wb3J0SWQsXG5cdFx0XHRcdFx0XHR0eXBlOiBcInNpZ25hbFwiLFxuXHRcdFx0XHRcdFx0cGF5bG9hZDogeyBhY3Rpb246IFwicG9uZ1wiIH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0cy5wb3J0SWQgPSBzLnBvcnRJZCA/PyB0aGlzLl9wb3J0SWQ7XG5cdFx0XHRcdGZvciAoY29uc3QgciBvZiB0aGlzLl9zdWJzKSB0cnkge1xuXHRcdFx0XHRcdHIubmV4dD8uKHMpO1xuXHRcdFx0XHR9IGNhdGNoIChpKSB7XG5cdFx0XHRcdFx0ci5lcnJvcj8uKGkpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LCB0ID0gKCkgPT4ge1xuXHRcdFx0XHR0aGlzLl9zdGF0ZS5uZXh0KFwiZXJyb3JcIik7XG5cdFx0XHRcdGNvbnN0IG4gPSAvKiBAX19QVVJFX18gKi8gbmV3IEVycm9yKFwiUG9ydCBlcnJvclwiKTtcblx0XHRcdFx0Zm9yIChjb25zdCBzIG9mIHRoaXMuX3N1YnMpIHMuZXJyb3I/LihuKTtcblx0XHRcdH07XG5cdFx0XHR0aGlzLl9wb3J0LmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIGUpLCB0aGlzLl9wb3J0LmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlZXJyb3JcIiwgdCksIHRoaXMuX2NsZWFudXAgPSAoKSA9PiB7XG5cdFx0XHRcdHRoaXMuX3BvcnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgZSksIHRoaXMuX3BvcnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VlcnJvclwiLCB0KTtcblx0XHRcdH07XG5cdFx0fVxuXHRcdHN0YXJ0KCkge1xuXHRcdFx0dGhpcy5fbGlzdGVuaW5nIHx8ICh0aGlzLl9wb3J0LnN0YXJ0KCksIHRoaXMuX2xpc3RlbmluZyA9ICEwLCB0aGlzLl9zdGF0ZS5uZXh0KFwicmVhZHlcIiksIHRoaXMuX2NvbmZpZy5rZWVwQWxpdmUgJiYgdGhpcy5fc3RhcnRLZWVwQWxpdmUoKSk7XG5cdFx0fVxuXHRcdHNlbmQoZSwgdCkge1xuXHRcdFx0Y29uc3QgeyB0cmFuc2ZlcmFibGU6IG4sIC4uLnMgfSA9IGU7XG5cdFx0XHR0aGlzLl9wb3J0LnBvc3RNZXNzYWdlKHtcblx0XHRcdFx0Li4ucyxcblx0XHRcdFx0cG9ydElkOiB0aGlzLl9wb3J0SWRcblx0XHRcdH0sIHQgPz8gW10pO1xuXHRcdH1cblx0XHRyZXF1ZXN0KGUpIHtcblx0XHRcdGNvbnN0IHQgPSBlLnJlcUlkID8/ICRlKCk7XG5cdFx0XHRyZXR1cm4gbmV3IFByb21pc2UoKG4sIHMpID0+IHtcblx0XHRcdFx0Y29uc3QgciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRcdHRoaXMuX3BlbmRpbmcuZGVsZXRlKHQpLCBzKC8qIEBfX1BVUkVfXyAqLyBuZXcgRXJyb3IoXCJSZXF1ZXN0IHRpbWVvdXRcIikpO1xuXHRcdFx0XHR9LCB0aGlzLl9jb25maWcudGltZW91dCA/PyAzZTQpO1xuXHRcdFx0XHR0aGlzLl9wZW5kaW5nLnNldCh0LCB7XG5cdFx0XHRcdFx0cmVzb2x2ZTogKGkpID0+IHtcblx0XHRcdFx0XHRcdGNsZWFyVGltZW91dChyKSwgbihpKTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHJlamVjdDogKGkpID0+IHtcblx0XHRcdFx0XHRcdGNsZWFyVGltZW91dChyKSwgcyhpKTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHRpbWVzdGFtcDogRGF0ZS5ub3coKVxuXHRcdFx0XHR9KSwgdGhpcy5zZW5kKHtcblx0XHRcdFx0XHQuLi5lLFxuXHRcdFx0XHRcdHJlcUlkOiB0LFxuXHRcdFx0XHRcdHR5cGU6IFwicmVxdWVzdFwiXG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdHN1YnNjcmliZShlKSB7XG5cdFx0XHRjb25zdCB0ID0gdHlwZW9mIGUgPT0gXCJmdW5jdGlvblwiID8geyBuZXh0OiBlIH0gOiBlO1xuXHRcdFx0cmV0dXJuIHRoaXMuX3N1YnMuYWRkKHQpLCB7XG5cdFx0XHRcdGNsb3NlZDogITEsXG5cdFx0XHRcdHVuc3Vic2NyaWJlOiAoKSA9PiB7XG5cdFx0XHRcdFx0dGhpcy5fc3Vicy5kZWxldGUodCk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0fVxuXHRcdF9zdGFydEtlZXBBbGl2ZSgpIHtcblx0XHRcdHRoaXMuX2tlZXBBbGl2ZVRpbWVyID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuXHRcdFx0XHR0aGlzLnNlbmQoe1xuXHRcdFx0XHRcdGlkOiAkZSgpLFxuXHRcdFx0XHRcdGNoYW5uZWw6IHRoaXMuX2NoYW5uZWxOYW1lLFxuXHRcdFx0XHRcdHNlbmRlcjogdGhpcy5fcG9ydElkLFxuXHRcdFx0XHRcdHR5cGU6IFwic2lnbmFsXCIsXG5cdFx0XHRcdFx0cGF5bG9hZDogeyBhY3Rpb246IFwicGluZ1wiIH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9LCB0aGlzLl9jb25maWcua2VlcEFsaXZlSW50ZXJ2YWwgPz8gM2U0KTtcblx0XHR9XG5cdFx0Y2xvc2UoKSB7XG5cdFx0XHR0aGlzLl9rZWVwQWxpdmVUaW1lciAmJiAoY2xlYXJJbnRlcnZhbCh0aGlzLl9rZWVwQWxpdmVUaW1lciksIHRoaXMuX2tlZXBBbGl2ZVRpbWVyID0gbnVsbCksIHRoaXMuX2NsZWFudXA/LigpLCB0aGlzLl9zdWJzLmZvckVhY2goKGUpID0+IGUuY29tcGxldGU/LigpKSwgdGhpcy5fc3Vicy5jbGVhcigpLCB0aGlzLl9wb3J0LmNsb3NlKCksIHRoaXMuX3N0YXRlLm5leHQoXCJjbG9zZWRcIik7XG5cdFx0fVxuXHRcdGdldCBwb3J0KCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX3BvcnQ7XG5cdFx0fVxuXHRcdGdldCBwb3J0SWQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fcG9ydElkO1xuXHRcdH1cblx0XHRnZXQgaXNMaXN0ZW5pbmcoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fbGlzdGVuaW5nO1xuXHRcdH1cblx0XHRnZXQgc3RhdGUoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fc3RhdGU7XG5cdFx0fVxuXHRcdGdldCBjaGFubmVsTmFtZSgpIHtcblx0XHRcdHJldHVybiB0aGlzLl9jaGFubmVsTmFtZTtcblx0XHR9XG5cdH07XG5cdGZ1bmN0aW9uIGJlKGUsIHQpIHtcblx0XHRjb25zdCBuID0gbmV3IE1lc3NhZ2VDaGFubmVsKCk7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGxvY2FsOiBuZXcgQihuLnBvcnQxLCBlLCB0KSxcblx0XHRcdHJlbW90ZTogbi5wb3J0Mixcblx0XHRcdHRyYW5zZmVyOiAoKSA9PiBuLnBvcnQyXG5cdFx0fTtcblx0fVxuXHR2YXIgUXQgPSBjbGFzcyB7XG5cdFx0X2RlZmF1bHRDb25maWc7XG5cdFx0X2NoYW5uZWxzID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0XHRfbWFpblBvcnQgPSBudWxsO1xuXHRcdF9zdWJzID0gLyogQF9fUFVSRV9fICovIG5ldyBTZXQoKTtcblx0XHRjb25zdHJ1Y3RvcihlID0ge30pIHtcblx0XHRcdHRoaXMuX2RlZmF1bHRDb25maWcgPSBlO1xuXHRcdH1cblx0XHRjcmVhdGUoZSwgdCkge1xuXHRcdFx0Y29uc3QgbiA9IGJlKGUsIHtcblx0XHRcdFx0Li4udGhpcy5fZGVmYXVsdENvbmZpZyxcblx0XHRcdFx0Li4udFxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gbi5sb2NhbC5zdWJzY3JpYmUoeyBuZXh0OiAocykgPT4ge1xuXHRcdFx0XHRmb3IgKGNvbnN0IHIgb2YgdGhpcy5fc3VicykgdHJ5IHtcblx0XHRcdFx0XHRyLm5leHQ/LihzKTtcblx0XHRcdFx0fSBjYXRjaCAoaSkge1xuXHRcdFx0XHRcdHIuZXJyb3I/LihpKTtcblx0XHRcdFx0fVxuXHRcdFx0fSB9KSwgdGhpcy5fY2hhbm5lbHMuc2V0KGUsIG4ubG9jYWwpLCBuO1xuXHRcdH1cblx0XHRhZGQoZSwgdCwgbikge1xuXHRcdFx0Y29uc3QgcyA9IG5ldyBCKHQsIGUsIHtcblx0XHRcdFx0Li4udGhpcy5fZGVmYXVsdENvbmZpZyxcblx0XHRcdFx0Li4ublxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gcy5zdWJzY3JpYmUoeyBuZXh0OiAocikgPT4ge1xuXHRcdFx0XHRmb3IgKGNvbnN0IGkgb2YgdGhpcy5fc3VicykgdHJ5IHtcblx0XHRcdFx0XHRpLm5leHQ/LihyKTtcblx0XHRcdFx0fSBjYXRjaCAobykge1xuXHRcdFx0XHRcdGkuZXJyb3I/LihvKTtcblx0XHRcdFx0fVxuXHRcdFx0fSB9KSwgdGhpcy5fY2hhbm5lbHMuc2V0KGUsIHMpLCBzO1xuXHRcdH1cblx0XHRnZXQoZSkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2NoYW5uZWxzLmdldChlKTtcblx0XHR9XG5cdFx0c2VuZChlLCB0LCBuKSB7XG5cdFx0XHR0aGlzLl9jaGFubmVscy5nZXQoZSk/LnNlbmQodCwgbik7XG5cdFx0fVxuXHRcdGJyb2FkY2FzdChlLCB0KSB7XG5cdFx0XHRmb3IgKGNvbnN0IG4gb2YgdGhpcy5fY2hhbm5lbHMudmFsdWVzKCkpIG4uc2VuZChlLCB0KTtcblx0XHR9XG5cdFx0cmVxdWVzdChlLCB0KSB7XG5cdFx0XHRjb25zdCBuID0gdGhpcy5fY2hhbm5lbHMuZ2V0KGUpO1xuXHRcdFx0cmV0dXJuIG4gPyBuLnJlcXVlc3QodCkgOiBQcm9taXNlLnJlamVjdCgvKiBAX19QVVJFX18gKi8gbmV3IEVycm9yKGBDaGFubmVsICR7ZX0gbm90IGZvdW5kYCkpO1xuXHRcdH1cblx0XHRzdWJzY3JpYmUoZSkge1xuXHRcdFx0Y29uc3QgdCA9IHR5cGVvZiBlID09IFwiZnVuY3Rpb25cIiA/IHsgbmV4dDogZSB9IDogZTtcblx0XHRcdHJldHVybiB0aGlzLl9zdWJzLmFkZCh0KSwge1xuXHRcdFx0XHRjbG9zZWQ6ICExLFxuXHRcdFx0XHR1bnN1YnNjcmliZTogKCkgPT4ge1xuXHRcdFx0XHRcdHRoaXMuX3N1YnMuZGVsZXRlKHQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdH1cblx0XHRyZW1vdmUoZSkge1xuXHRcdFx0Y29uc3QgdCA9IHRoaXMuX2NoYW5uZWxzLmdldChlKTtcblx0XHRcdHQgJiYgKHQuY2xvc2UoKSwgdGhpcy5fY2hhbm5lbHMuZGVsZXRlKGUpKTtcblx0XHR9XG5cdFx0Y2xvc2UoKSB7XG5cdFx0XHR0aGlzLl9zdWJzLmZvckVhY2goKGUpID0+IGUuY29tcGxldGU/LigpKSwgdGhpcy5fc3Vicy5jbGVhcigpO1xuXHRcdFx0Zm9yIChjb25zdCBlIG9mIHRoaXMuX2NoYW5uZWxzLnZhbHVlcygpKSBlLmNsb3NlKCk7XG5cdFx0XHR0aGlzLl9jaGFubmVscy5jbGVhcigpO1xuXHRcdH1cblx0XHRnZXQgY2hhbm5lbE5hbWVzKCkge1xuXHRcdFx0cmV0dXJuIEFycmF5LmZyb20odGhpcy5fY2hhbm5lbHMua2V5cygpKTtcblx0XHR9XG5cdFx0Z2V0IHNpemUoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY2hhbm5lbHMuc2l6ZTtcblx0XHR9XG5cdH07XG5cdHZhciBUZSA9IGNsYXNzIHtcblx0XHRfdGFyZ2V0O1xuXHRcdF9jaGFubmVsTmFtZTtcblx0XHRfY29uZmlnO1xuXHRcdF90cmFuc3BvcnQgPSBudWxsO1xuXHRcdF9zdGF0ZSA9IG5ldyBfKCk7XG5cdFx0X2hhbmRzaGFrZUNvbXBsZXRlID0gITE7XG5cdFx0Y29uc3RydWN0b3IoZSwgdCwgbiA9IHt9KSB7XG5cdFx0XHR0aGlzLl90YXJnZXQgPSBlLCB0aGlzLl9jaGFubmVsTmFtZSA9IHQsIHRoaXMuX2NvbmZpZyA9IG47XG5cdFx0fVxuXHRcdGFzeW5jIGNvbm5lY3QoKSB7XG5cdFx0XHRpZiAodGhpcy5fdHJhbnNwb3J0ICYmIHRoaXMuX2hhbmRzaGFrZUNvbXBsZXRlKSByZXR1cm4gdGhpcy5fdHJhbnNwb3J0O1xuXHRcdFx0dGhpcy5fc3RhdGUubmV4dChcImNvbm5lY3RpbmdcIik7XG5cdFx0XHRjb25zdCB7IGxvY2FsOiBlLCByZW1vdGU6IHQgfSA9IGJlKHRoaXMuX2NoYW5uZWxOYW1lLCB0aGlzLl9jb25maWcpO1xuXHRcdFx0cmV0dXJuIHRoaXMuX3RhcmdldC5wb3N0TWVzc2FnZSh7XG5cdFx0XHRcdHR5cGU6IFwicG9ydC1jb25uZWN0XCIsXG5cdFx0XHRcdGNoYW5uZWxOYW1lOiB0aGlzLl9jaGFubmVsTmFtZSxcblx0XHRcdFx0cG9ydElkOiBlLnBvcnRJZFxuXHRcdFx0fSwgdGhpcy5fY29uZmlnLnRhcmdldE9yaWdpbiA/PyBcIipcIiwgW3RdKSwgbmV3IFByb21pc2UoKG4sIHMpID0+IHtcblx0XHRcdFx0Y29uc3QgciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRcdHMoLyogQF9fUFVSRV9fICovIG5ldyBFcnJvcihcIkhhbmRzaGFrZSB0aW1lb3V0XCIpKSwgdGhpcy5fc3RhdGUubmV4dChcImVycm9yXCIpO1xuXHRcdFx0XHR9LCB0aGlzLl9jb25maWcuaGFuZHNoYWtlVGltZW91dCA/PyAxZTQpLCBpID0gZS5zdWJzY3JpYmUoeyBuZXh0OiAobykgPT4ge1xuXHRcdFx0XHRcdG8udHlwZSA9PT0gXCJzaWduYWxcIiAmJiBvLnBheWxvYWQ/LmFjdGlvbiA9PT0gXCJoYW5kc2hha2UtYWNrXCIgJiYgKGNsZWFyVGltZW91dChyKSwgdGhpcy5faGFuZHNoYWtlQ29tcGxldGUgPSAhMCwgdGhpcy5fdHJhbnNwb3J0ID0gZSwgdGhpcy5fc3RhdGUubmV4dChcImNvbm5lY3RlZFwiKSwgaS51bnN1YnNjcmliZSgpLCBuKGUpKTtcblx0XHRcdFx0fSB9KTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRzdGF0aWMgbGlzdGVuKGUsIHQsIG4pIHtcblx0XHRcdGNvbnN0IHMgPSAocikgPT4ge1xuXHRcdFx0XHRpZiAoci5kYXRhPy50eXBlICE9PSBcInBvcnQtY29ubmVjdFwiIHx8IHIuZGF0YT8uY2hhbm5lbE5hbWUgIT09IGUgfHwgIXIucG9ydHNbMF0pIHJldHVybjtcblx0XHRcdFx0Y29uc3QgaSA9IG5ldyBCKHIucG9ydHNbMF0sIGUsIG4pO1xuXHRcdFx0XHRpLnNlbmQoe1xuXHRcdFx0XHRcdGlkOiAkZSgpLFxuXHRcdFx0XHRcdGNoYW5uZWw6IGUsXG5cdFx0XHRcdFx0c2VuZGVyOiBpLnBvcnRJZCxcblx0XHRcdFx0XHR0eXBlOiBcInNpZ25hbFwiLFxuXHRcdFx0XHRcdHBheWxvYWQ6IHsgYWN0aW9uOiBcImhhbmRzaGFrZS1hY2tcIiB9XG5cdFx0XHRcdH0pLCB0KGkpO1xuXHRcdFx0fTtcblx0XHRcdHJldHVybiBnbG9iYWxUaGlzLmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIHMpLCAoKSA9PiBnbG9iYWxUaGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIHMpO1xuXHRcdH1cblx0XHRkaXNjb25uZWN0KCkge1xuXHRcdFx0dGhpcy5fdHJhbnNwb3J0Py5jbG9zZSgpLCB0aGlzLl90cmFuc3BvcnQgPSBudWxsLCB0aGlzLl9oYW5kc2hha2VDb21wbGV0ZSA9ICExLCB0aGlzLl9zdGF0ZS5uZXh0KFwiZGlzY29ubmVjdGVkXCIpO1xuXHRcdH1cblx0XHRnZXQgaXNDb25uZWN0ZWQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5faGFuZHNoYWtlQ29tcGxldGU7XG5cdFx0fVxuXHRcdGdldCBzdGF0ZSgpIHtcblx0XHRcdHJldHVybiB0aGlzLl9zdGF0ZTtcblx0XHR9XG5cdFx0Z2V0IHRyYW5zcG9ydCgpIHtcblx0XHRcdHJldHVybiB0aGlzLl90cmFuc3BvcnQ7XG5cdFx0fVxuXHR9O1xuXHRmdW5jdGlvbiB3cyhlLCB0ID0gW10pIHtcblx0XHRyZXR1cm4ga24oe1xuXHRcdFx0cmVxdWVzdDogKG4pID0+IGUucmVxdWVzdChuKSxcblx0XHRcdGNoYW5uZWxOYW1lOiBlLmNoYW5uZWxOYW1lLFxuXHRcdFx0c2VuZGVySWQ6IGUucG9ydElkXG5cdFx0fSwgdCk7XG5cdH1cblx0ZnVuY3Rpb24gdnMoZSwgdCkge1xuXHRcdGNvbnN0IG4gPSB4bih0KTtcblx0XHRyZXR1cm4gZS5zdWJzY3JpYmUoeyBuZXh0OiBhc3luYyAocykgPT4ge1xuXHRcdFx0aWYgKHMudHlwZSAhPT0gXCJyZXF1ZXN0XCIgfHwgIXMucGF5bG9hZD8ucGF0aCkgcmV0dXJuO1xuXHRcdFx0Y29uc3QgeyBhY3Rpb246IHIsIHBhdGg6IGksIGFyZ3M6IG8gfSA9IHMucGF5bG9hZDtcblx0XHRcdGxldCBhLCBjO1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0YSA9IGF3YWl0IG4ociwgaSwgbyA/PyBbXSk7XG5cdFx0XHR9IGNhdGNoIChsKSB7XG5cdFx0XHRcdGMgPSBsIGluc3RhbmNlb2YgRXJyb3IgPyBsLm1lc3NhZ2UgOiBTdHJpbmcobCk7XG5cdFx0XHR9XG5cdFx0XHRlLnNlbmQoe1xuXHRcdFx0XHRpZDogJGUoKSxcblx0XHRcdFx0Y2hhbm5lbDogcy5zZW5kZXIsXG5cdFx0XHRcdHNlbmRlcjogZS5wb3J0SWQsXG5cdFx0XHRcdHR5cGU6IFwicmVzcG9uc2VcIixcblx0XHRcdFx0cmVxSWQ6IHMucmVxSWQsXG5cdFx0XHRcdHBheWxvYWQ6IGMgPyB7IGVycm9yOiBjIH0gOiB7IHJlc3VsdDogYSB9XG5cdFx0XHR9KTtcblx0XHR9IH0pO1xuXHR9XG5cdHZhciBnaSA9IHtcblx0XHRjcmVhdGU6IChlLCB0LCBuKSA9PiBuZXcgQihlLCB0LCBuKSxcblx0XHRjcmVhdGVQYWlyOiAoZSwgdCkgPT4gYmUoZSwgdCksXG5cdFx0Y3JlYXRlUG9vbDogKGUpID0+IG5ldyBRdChlKSxcblx0XHRjcmVhdGVXaW5kb3dDb25uZWN0b3I6IChlLCB0LCBuKSA9PiBuZXcgVGUoZSwgdCwgbiksXG5cdFx0bGlzdGVuOiBUZS5saXN0ZW4sXG5cdFx0Y3JlYXRlUHJveHk6IHdzLFxuXHRcdGV4cG9zZTogdnNcblx0fTtcblx0dmFyIHhpID0gKGUsIHQgPSBcIndvcmtlclwiKSA9PiB7XG5cdFx0Y29uc3QgbiA9IE9lKHQgPz8gXCJ3b3JrZXJcIik7XG5cdFx0cmV0dXJuIE9iamVjdC5rZXlzKGUpLmZvckVhY2goKHMpID0+IHtcblx0XHRcdGVbc107XG5cdFx0fSksIG47XG5cdH07XG5cbi8vI2VuZHJlZ2lvblxuLy8jcmVnaW9uIHNyYy91dGlscy9vcGZzL09QRlMud29ya2VyLnRzXG5cdHZhciBPUEZTX3dvcmtlcl9leHBvcnRzID0gLyogQF9fUFVSRV9fICovIF9fZXhwb3J0QWxsKHtcblx0XHRnZXREaXJIYW5kbGU6ICgpID0+IGdldERpckhhbmRsZSxcblx0XHRnZXRGaWxlU3lzdGVtUm9vdDogKCkgPT4gZ2V0RmlsZVN5c3RlbVJvb3QsXG5cdFx0aGFuZGxlcnM6ICgpID0+IGhhbmRsZXJzLFxuXHRcdG5vcm1hbGl6ZVBhdGg6ICgpID0+IG5vcm1hbGl6ZVBhdGgsXG5cdFx0cmVzb2x2ZUZpbGVTeXN0ZW1IYW5kbGU6ICgpID0+IHJlc29sdmVGaWxlU3lzdGVtSGFuZGxlXG5cdH0pO1xuXHR2YXIgbWFwcGVkUm9vdHMsIGFjdGl2ZU9ic2VydmVycywgZ2V0RmlsZVN5c3RlbVJvb3QsIG5vcm1hbGl6ZVBhdGgsIHJlc29sdmVGaWxlU3lzdGVtSGFuZGxlLCBnZXREaXJIYW5kbGUsIGhhbmRsZXJzLCBTV19CUklER0VfQ0hBTk5FTF9OQU1FLCBzd0JyaWRnZUNoYW5uZWw7XG5cdHZhciBpbml0X09QRlNfd29ya2VyID0gX19lc21NaW4oKCgpID0+IHtcblx0XHRtYXBwZWRSb290cyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG5cdFx0YWN0aXZlT2JzZXJ2ZXJzID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0XHRnZXRGaWxlU3lzdGVtUm9vdCA9IGFzeW5jIChpZCA9IFwiXCIpID0+IHtcblx0XHRcdGlmIChpZCAmJiBtYXBwZWRSb290cy5oYXMoaWQpKSByZXR1cm4gbWFwcGVkUm9vdHMuZ2V0KGlkKTtcblx0XHRcdHJldHVybiBhd2FpdCBuYXZpZ2F0b3Iuc3RvcmFnZS5nZXREaXJlY3RvcnkoKTtcblx0XHR9O1xuXHRcdG5vcm1hbGl6ZVBhdGggPSAocGF0aCkgPT4ge1xuXHRcdFx0cmV0dXJuIHBhdGg/LnRyaW0/LigpPy5yZXBsYWNlKC9cXC8rL2csIFwiL1wiKSB8fCBcIi9cIjtcblx0XHR9O1xuXHRcdHJlc29sdmVGaWxlU3lzdGVtSGFuZGxlID0gYXN5bmMgKHJvb3QsIHBhdGgsIGNyZWF0ZSA9IGZhbHNlKSA9PiB7XG5cdFx0XHRjb25zdCBwYXJ0cyA9IG5vcm1hbGl6ZVBhdGgocGF0aCkuc3BsaXQoXCIvXCIpLmZpbHRlcigocCkgPT4gcCAmJiBwICE9PSBcIi5cIik7XG5cdFx0XHRsZXQgY3VycmVudCA9IHJvb3Q7XG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHBhcnRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGNvbnN0IHBhcnQgPSBwYXJ0c1tpXTtcblx0XHRcdFx0aWYgKGkgPT09IHBhcnRzLmxlbmd0aCAtIDEpIHRyeSB7XG5cdFx0XHRcdFx0cmV0dXJuIGF3YWl0IGN1cnJlbnQuZ2V0RGlyZWN0b3J5SGFuZGxlKHBhcnQsIHsgY3JlYXRlIH0pO1xuXHRcdFx0XHR9IGNhdGNoIHtcblx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGF3YWl0IGN1cnJlbnQuZ2V0RmlsZUhhbmRsZShwYXJ0LCB7IGNyZWF0ZSB9KTtcblx0XHRcdFx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRcdFx0XHRpZiAoY3JlYXRlKSB0aHJvdyBlO1xuXHRcdFx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgY3VycmVudCA9IGF3YWl0IGN1cnJlbnQuZ2V0RGlyZWN0b3J5SGFuZGxlKHBhcnQsIHsgY3JlYXRlIH0pO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGN1cnJlbnQ7XG5cdFx0fTtcblx0XHRnZXREaXJIYW5kbGUgPSBhc3luYyAocm9vdCwgcGF0aCwgY3JlYXRlKSA9PiB7XG5cdFx0XHRjb25zdCBwYXJ0cyA9IG5vcm1hbGl6ZVBhdGgocGF0aCkuc3BsaXQoXCIvXCIpLmZpbHRlcigocCkgPT4gcCk7XG5cdFx0XHRsZXQgY3VycmVudCA9IHJvb3Q7XG5cdFx0XHRmb3IgKGNvbnN0IHBhcnQgb2YgcGFydHMpIGN1cnJlbnQgPSBhd2FpdCBjdXJyZW50LmdldERpcmVjdG9yeUhhbmRsZShwYXJ0LCB7IGNyZWF0ZSB9KTtcblx0XHRcdHJldHVybiBjdXJyZW50O1xuXHRcdH07XG5cdFx0aGFuZGxlcnMgPSB7XG5cdFx0XHRtb3VudDogYXN5bmMgKHsgaWQsIGhhbmRsZSB9KSA9PiB7XG5cdFx0XHRcdG1hcHBlZFJvb3RzLnNldChpZCwgaGFuZGxlKTtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9LFxuXHRcdFx0dW5tb3VudDogYXN5bmMgKHsgaWQgfSkgPT4ge1xuXHRcdFx0XHRtYXBwZWRSb290cy5kZWxldGUoaWQpO1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH0sXG5cdFx0XHRyZWFkRGlyZWN0b3J5OiBhc3luYyAoeyByb290SWQsIHBhdGgsIGNyZWF0ZSB9KSA9PiB7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0Y29uc3Qgcm9vdCA9IGF3YWl0IGdldEZpbGVTeXN0ZW1Sb290KHJvb3RJZCk7XG5cdFx0XHRcdFx0Y29uc3QgaGFuZGxlID0gYXdhaXQgZ2V0RGlySGFuZGxlKHJvb3QsIHBhdGgsIGNyZWF0ZSk7XG5cdFx0XHRcdFx0Y29uc3QgZW50cmllcyA9IFtdO1xuXHRcdFx0XHRcdGZvciBhd2FpdCAoY29uc3QgW25hbWUsIGVudHJ5XSBvZiBoYW5kbGUuZW50cmllcygpKSBlbnRyaWVzLnB1c2goW25hbWUsIGVudHJ5XSk7XG5cdFx0XHRcdFx0cmV0dXJuIGVudHJpZXM7XG5cdFx0XHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdFx0XHRjb25zb2xlLndhcm4oXCJXb3JrZXIgcmVhZERpcmVjdG9yeSBlcnJvcjpcIiwgZSk7XG5cdFx0XHRcdFx0cmV0dXJuIFtdO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0cmVhZEZpbGU6IGFzeW5jICh7IHJvb3RJZCwgcGF0aCwgdHlwZSB9KSA9PiB7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0Y29uc3Qgcm9vdCA9IGF3YWl0IGdldEZpbGVTeXN0ZW1Sb290KHJvb3RJZCk7XG5cdFx0XHRcdFx0Y29uc3QgcGFydHMgPSBub3JtYWxpemVQYXRoKHBhdGgpLnNwbGl0KFwiL1wiKS5maWx0ZXIoKHApID0+IHApO1xuXHRcdFx0XHRcdGNvbnN0IGZpbGVuYW1lID0gcGFydHMucG9wKCk7XG5cdFx0XHRcdFx0Y29uc3QgZGlyUGF0aCA9IHBhcnRzLmpvaW4oXCIvXCIpO1xuXHRcdFx0XHRcdGNvbnN0IGZpbGUgPSBhd2FpdCAoYXdhaXQgKGF3YWl0IGdldERpckhhbmRsZShyb290LCBkaXJQYXRoLCBmYWxzZSkpLmdldEZpbGVIYW5kbGUoZmlsZW5hbWUsIHsgY3JlYXRlOiBmYWxzZSB9KSkuZ2V0RmlsZSgpO1xuXHRcdFx0XHRcdGlmICh0eXBlID09PSBcInRleHRcIikgcmV0dXJuIGF3YWl0IGZpbGUudGV4dCgpO1xuXHRcdFx0XHRcdGlmICh0eXBlID09PSBcImFycmF5QnVmZmVyXCIpIHJldHVybiBhd2FpdCBmaWxlLmFycmF5QnVmZmVyKCk7XG5cdFx0XHRcdFx0aWYgKHR5cGUgPT09IFwiYmxvYlwiKSByZXR1cm4gZmlsZTtcblx0XHRcdFx0XHRyZXR1cm4gZmlsZTtcblx0XHRcdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0XHRcdGNvbnNvbGUud2FybihcIldvcmtlciByZWFkRmlsZSBlcnJvcjpcIiwgZSk7XG5cdFx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHR3cml0ZUZpbGU6IGFzeW5jICh7IHJvb3RJZCwgcGF0aCwgZGF0YSB9KSA9PiB7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0Y29uc3Qgcm9vdCA9IGF3YWl0IGdldEZpbGVTeXN0ZW1Sb290KHJvb3RJZCk7XG5cdFx0XHRcdFx0Y29uc3QgcGFydHMgPSBub3JtYWxpemVQYXRoKHBhdGgpLnNwbGl0KFwiL1wiKS5maWx0ZXIoKHApID0+IHApO1xuXHRcdFx0XHRcdGNvbnN0IGZpbGVuYW1lID0gcGFydHMucG9wKCk7XG5cdFx0XHRcdFx0Y29uc3QgZGlyUGF0aCA9IHBhcnRzLmpvaW4oXCIvXCIpO1xuXHRcdFx0XHRcdGNvbnN0IHdyaXRhYmxlID0gYXdhaXQgKGF3YWl0IChhd2FpdCBnZXREaXJIYW5kbGUocm9vdCwgZGlyUGF0aCwgdHJ1ZSkpLmdldEZpbGVIYW5kbGUoZmlsZW5hbWUsIHsgY3JlYXRlOiB0cnVlIH0pKS5jcmVhdGVXcml0YWJsZSgpO1xuXHRcdFx0XHRcdGF3YWl0IHdyaXRhYmxlLndyaXRlKGRhdGEpO1xuXHRcdFx0XHRcdGF3YWl0IHdyaXRhYmxlLmNsb3NlKCk7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdFx0XHRjb25zb2xlLndhcm4oXCJXb3JrZXIgd3JpdGVGaWxlIGVycm9yOlwiLCBlKTtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRyZW1vdmU6IGFzeW5jICh7IHJvb3RJZCwgcGF0aCwgcmVjdXJzaXZlIH0pID0+IHtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRjb25zdCByb290ID0gYXdhaXQgZ2V0RmlsZVN5c3RlbVJvb3Qocm9vdElkKTtcblx0XHRcdFx0XHRjb25zdCBwYXJ0cyA9IG5vcm1hbGl6ZVBhdGgocGF0aCkuc3BsaXQoXCIvXCIpLmZpbHRlcigocCkgPT4gcCk7XG5cdFx0XHRcdFx0Y29uc3QgbmFtZSA9IHBhcnRzLnBvcCgpO1xuXHRcdFx0XHRcdGNvbnN0IGRpclBhdGggPSBwYXJ0cy5qb2luKFwiL1wiKTtcblx0XHRcdFx0XHRhd2FpdCAoYXdhaXQgZ2V0RGlySGFuZGxlKHJvb3QsIGRpclBhdGgsIGZhbHNlKSkucmVtb3ZlRW50cnkobmFtZSwgeyByZWN1cnNpdmUgfSk7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRvYnNlcnZlOiBhc3luYyAoeyByb290SWQsIHBhdGgsIGlkIH0pID0+IHtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRpZiAoYWN0aXZlT2JzZXJ2ZXJzLmhhcyhpZCkpIHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdGNvbnN0IHJvb3QgPSBhd2FpdCBnZXRGaWxlU3lzdGVtUm9vdChyb290SWQpO1xuXHRcdFx0XHRcdGNvbnN0IGhhbmRsZSA9IGF3YWl0IGdldERpckhhbmRsZShyb290LCBwYXRoLCBmYWxzZSk7XG5cdFx0XHRcdFx0aWYgKHR5cGVvZiBGaWxlU3lzdGVtT2JzZXJ2ZXIgIT09IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0XHRcdGNvbnN0IG9ic2VydmVyID0gbmV3IEZpbGVTeXN0ZW1PYnNlcnZlcigocmVjb3JkcykgPT4ge1xuXHRcdFx0XHRcdFx0XHRjb25zdCBjaGFuZ2VzID0gcmVjb3Jkcy5tYXAoKHIpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRjb25zdCBuYW1lID0gci5jaGFuZ2VkSGFuZGxlPy5uYW1lIHx8IHIucmVsYXRpdmVQYXRoQ29tcG9uZW50cz8uYXQoLTEpO1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0XHRcdFx0XHR0eXBlOiByLnR5cGUsXG5cdFx0XHRcdFx0XHRcdFx0XHRuYW1lLFxuXHRcdFx0XHRcdFx0XHRcdFx0a2luZDogci5jaGFuZ2VkSGFuZGxlPy5raW5kIHx8IChuYW1lPy5pbmNsdWRlcyhcIi5cIikgPyBcImZpbGVcIiA6IFwiZGlyZWN0b3J5XCIpLFxuXHRcdFx0XHRcdFx0XHRcdFx0aGFuZGxlOiByLmNoYW5nZWRIYW5kbGUsXG5cdFx0XHRcdFx0XHRcdFx0XHRwYXRoOiByLnJlbGF0aXZlUGF0aENvbXBvbmVudHMuam9pbihcIi9cIilcblx0XHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0c2VsZi5wb3N0TWVzc2FnZSh7XG5cdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJvYnNlcnZhdGlvblwiLFxuXHRcdFx0XHRcdFx0XHRcdGlkLFxuXHRcdFx0XHRcdFx0XHRcdGNoYW5nZXNcblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdG9ic2VydmVyLm9ic2VydmUoaGFuZGxlKTtcblx0XHRcdFx0XHRcdGFjdGl2ZU9ic2VydmVycy5zZXQoaWQsIG9ic2VydmVyKTtcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHR1bm9ic2VydmU6IGFzeW5jICh7IGlkIH0pID0+IHtcblx0XHRcdFx0Y29uc3Qgb2JzZXJ2ZXIgPSBhY3RpdmVPYnNlcnZlcnMuZ2V0KGlkKTtcblx0XHRcdFx0aWYgKG9ic2VydmVyKSB7XG5cdFx0XHRcdFx0b2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuXHRcdFx0XHRcdGFjdGl2ZU9ic2VydmVycy5kZWxldGUoaWQpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fSxcblx0XHRcdGNvcHk6IGFzeW5jICh7IGZyb20sIHRvIH0pID0+IHtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRjb25zdCBjb3B5UmVjdXJzaXZlID0gYXN5bmMgKHNvdXJjZSwgZGVzdCkgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKHNvdXJjZS5raW5kID09PSBcImRpcmVjdG9yeVwiKSBmb3IgYXdhaXQgKGNvbnN0IFtuYW1lLCBlbnRyeV0gb2Ygc291cmNlLmVudHJpZXMoKSkgaWYgKGVudHJ5LmtpbmQgPT09IFwiZGlyZWN0b3J5XCIpIHtcblx0XHRcdFx0XHRcdFx0Y29uc3QgbmV3RGVzdCA9IGF3YWl0IGRlc3QuZ2V0RGlyZWN0b3J5SGFuZGxlKG5hbWUsIHsgY3JlYXRlOiB0cnVlIH0pO1xuXHRcdFx0XHRcdFx0XHRhd2FpdCBjb3B5UmVjdXJzaXZlKGVudHJ5LCBuZXdEZXN0KTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IGZpbGUgPSBhd2FpdCBlbnRyeS5nZXRGaWxlKCk7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IHdyaXRhYmxlID0gYXdhaXQgKGF3YWl0IGRlc3QuZ2V0RmlsZUhhbmRsZShuYW1lLCB7IGNyZWF0ZTogdHJ1ZSB9KSkuY3JlYXRlV3JpdGFibGUoKTtcblx0XHRcdFx0XHRcdFx0YXdhaXQgd3JpdGFibGUud3JpdGUoZmlsZSk7XG5cdFx0XHRcdFx0XHRcdGF3YWl0IHdyaXRhYmxlLmNsb3NlKCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdFx0Y29uc3QgZmlsZSA9IGF3YWl0IHNvdXJjZS5nZXRGaWxlKCk7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IHdyaXRhYmxlID0gYXdhaXQgZGVzdC5jcmVhdGVXcml0YWJsZSgpO1xuXHRcdFx0XHRcdFx0XHRhd2FpdCB3cml0YWJsZS53cml0ZShmaWxlKTtcblx0XHRcdFx0XHRcdFx0YXdhaXQgd3JpdGFibGUuY2xvc2UoKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdGF3YWl0IGNvcHlSZWN1cnNpdmUoZnJvbSwgdG8pO1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRcdFx0Y29uc29sZS53YXJuKFwiV29ya2VyIGNvcHkgZXJyb3I6XCIsIGUpO1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cdFx0U1dfQlJJREdFX0NIQU5ORUxfTkFNRSA9IFwib3Bmcy1zdy1icmlkZ2UtdjFcIjtcblx0XHRzd0JyaWRnZUNoYW5uZWwgPSBudWxsO1xuXHRcdHRyeSB7XG5cdFx0XHRpZiAodHlwZW9mIEJyb2FkY2FzdENoYW5uZWwgIT09IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0c3dCcmlkZ2VDaGFubmVsID0gbmV3IEJyb2FkY2FzdENoYW5uZWwoU1dfQlJJREdFX0NIQU5ORUxfTkFNRSk7XG5cdFx0XHRcdHN3QnJpZGdlQ2hhbm5lbC5vbm1lc3NhZ2UgPSBhc3luYyAoZXZlbnQpID0+IHtcblx0XHRcdFx0XHRjb25zdCBkYXRhID0gZXZlbnQ/LmRhdGEgfHwge307XG5cdFx0XHRcdFx0aWYgKCFkYXRhIHx8IHR5cGVvZiBkYXRhICE9PSBcIm9iamVjdFwiKSByZXR1cm47XG5cdFx0XHRcdFx0aWYgKGRhdGE/LnR5cGUgIT09IFwib3Bmcy1zdy1yZXF1ZXN0XCIpIHJldHVybjtcblx0XHRcdFx0XHRjb25zdCByZXF1ZXN0SWQgPSBTdHJpbmcoZGF0YT8ucmVxdWVzdElkIHx8IFwiXCIpO1xuXHRcdFx0XHRcdGNvbnN0IGFjdGlvbiA9IFN0cmluZyhkYXRhPy5hY3Rpb24gfHwgXCJcIik7XG5cdFx0XHRcdFx0Y29uc3QgcGF5bG9hZCA9IGRhdGE/LnBheWxvYWQ7XG5cdFx0XHRcdFx0aWYgKCFyZXF1ZXN0SWQgfHwgIWFjdGlvbikgcmV0dXJuO1xuXHRcdFx0XHRcdGNvbnN0IGhhbmRsZXIgPSBoYW5kbGVyc1thY3Rpb25dO1xuXHRcdFx0XHRcdGlmICghaGFuZGxlcikge1xuXHRcdFx0XHRcdFx0c3dCcmlkZ2VDaGFubmVsPy5wb3N0TWVzc2FnZT8uKHtcblx0XHRcdFx0XHRcdFx0dHlwZTogXCJvcGZzLXN3LXJlc3BvbnNlXCIsXG5cdFx0XHRcdFx0XHRcdHJlcXVlc3RJZCxcblx0XHRcdFx0XHRcdFx0b2s6IGZhbHNlLFxuXHRcdFx0XHRcdFx0XHRlcnJvcjogYFVua25vd24gb3BlcmF0aW9uIHR5cGU6ICR7YWN0aW9ufWBcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0Y29uc3QgcmVzdWx0ID0gYXdhaXQgaGFuZGxlcihwYXlsb2FkKTtcblx0XHRcdFx0XHRcdHN3QnJpZGdlQ2hhbm5lbD8ucG9zdE1lc3NhZ2U/Lih7XG5cdFx0XHRcdFx0XHRcdHR5cGU6IFwib3Bmcy1zdy1yZXNwb25zZVwiLFxuXHRcdFx0XHRcdFx0XHRyZXF1ZXN0SWQsXG5cdFx0XHRcdFx0XHRcdG9rOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRyZXN1bHRcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdFx0XHRzd0JyaWRnZUNoYW5uZWw/LnBvc3RNZXNzYWdlPy4oe1xuXHRcdFx0XHRcdFx0XHR0eXBlOiBcIm9wZnMtc3ctcmVzcG9uc2VcIixcblx0XHRcdFx0XHRcdFx0cmVxdWVzdElkLFxuXHRcdFx0XHRcdFx0XHRvazogZmFsc2UsXG5cdFx0XHRcdFx0XHRcdGVycm9yOiBlcnJvcj8ubWVzc2FnZSB8fCBTdHJpbmcoZXJyb3IpXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0fSBjYXRjaCB7XG5cdFx0XHRzd0JyaWRnZUNoYW5uZWwgPSBudWxsO1xuXHRcdH1cblx0XHRzZWxmLmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIGFzeW5jIChlKSA9PiB7XG5cdFx0XHRpZiAoIWUuZGF0YSB8fCB0eXBlb2YgZS5kYXRhICE9PSBcIm9iamVjdFwiKSByZXR1cm47XG5cdFx0XHRjb25zdCB7IGlkLCB0eXBlLCBwYXlsb2FkIH0gPSBlLmRhdGE7XG5cdFx0XHRpZiAoaGFuZGxlcnNbdHlwZV0pIHRyeSB7XG5cdFx0XHRcdGNvbnN0IHJlc3VsdCA9IGF3YWl0IGhhbmRsZXJzW3R5cGVdKHBheWxvYWQpO1xuXHRcdFx0XHRzZWxmLnBvc3RNZXNzYWdlKHtcblx0XHRcdFx0XHRpZCxcblx0XHRcdFx0XHRyZXN1bHRcblx0XHRcdFx0fSk7XG5cdFx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0XHRzZWxmLnBvc3RNZXNzYWdlKHtcblx0XHRcdFx0XHRpZCxcblx0XHRcdFx0XHRlcnJvcjogZXJyb3I/Lm1lc3NhZ2UgfHwgU3RyaW5nKGVycm9yKVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKGlkKSBzZWxmLnBvc3RNZXNzYWdlKHtcblx0XHRcdFx0aWQsXG5cdFx0XHRcdGVycm9yOiBgVW5rbm93biBvcGVyYXRpb24gdHlwZTogJHt0eXBlfWBcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9KSk7XG5cbi8vI2VuZHJlZ2lvblxuLy8jcmVnaW9uIHNyYy91dGlscy9vcGZzL09QRlMudW5pZm9ybS53b3JrZXIudHNcblx0aW5pdF9PUEZTX3dvcmtlcigpO1xuXHRpZiAoaGFuZGxlcnMpIHhpKGhhbmRsZXJzKTtcblx0Y29uc3QgcHJvY2Vzc01lc3NhZ2UgPSBhc3luYyAoZW52ZWxvcGUpID0+IHtcblx0XHR0cnkge1xuXHRcdFx0aWYgKGVudmVsb3BlLnR5cGUgPT09IFwiYmF0Y2hcIikge1xuXHRcdFx0XHRjb25zdCByZXN1bHRzID0gW107XG5cdFx0XHRcdGZvciAoY29uc3QgbXNnIG9mIGVudmVsb3BlLnBheWxvYWQpIHtcblx0XHRcdFx0XHRjb25zdCByZXN1bHQgPSBhd2FpdCBwcm9jZXNzU2luZ2xlTWVzc2FnZShtc2cpO1xuXHRcdFx0XHRcdHJlc3VsdHMucHVzaChyZXN1bHQpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiByZXN1bHRzO1xuXHRcdFx0fSBlbHNlIHJldHVybiBhd2FpdCBwcm9jZXNzU2luZ2xlTWVzc2FnZShlbnZlbG9wZSk7XG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoXCJbT1BGUyBXb3JrZXJdIE1lc3NhZ2UgcHJvY2Vzc2luZyBlcnJvcjpcIiwgZXJyb3IpO1xuXHRcdFx0dGhyb3cgZXJyb3I7XG5cdFx0fVxuXHR9O1xuXHRjb25zdCBwcm9jZXNzU2luZ2xlTWVzc2FnZSA9IGFzeW5jIChlbnZlbG9wZSkgPT4ge1xuXHRcdGNvbnN0IGhhbmRsZXIgPSBoYW5kbGVyc1tlbnZlbG9wZS50eXBlXTtcblx0XHRpZiAoIWhhbmRsZXIpIHRocm93IG5ldyBFcnJvcihgVW5rbm93biBtZXNzYWdlIHR5cGU6ICR7ZW52ZWxvcGUudHlwZX1gKTtcblx0XHRyZXR1cm4gYXdhaXQgaGFuZGxlcihlbnZlbG9wZS5wYXlsb2FkKTtcblx0fTtcblx0Z2xvYmFsVGhpcy5wcm9jZXNzTWVzc2FnZSA9IHByb2Nlc3NNZXNzYWdlO1xuXHRjb25zdCBpbml0V29ya2VyID0gYXN5bmMgKCkgPT4ge1xuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBoYW5kbGVycyA9IChhd2FpdCBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IChpbml0X09QRlNfd29ya2VyKCksIE9QRlNfd29ya2VyX2V4cG9ydHMpKSkuaGFuZGxlcnM7XG5cdFx0XHRpZiAoaGFuZGxlcnMpIHhpKGhhbmRsZXJzKTtcblx0XHRcdGNvbnNvbGUubG9nKFwiW09QRlMgV29ya2VyXSBJbml0aWFsaXplZCB3aXRoIGhhbmRsZXJzOlwiLCBPYmplY3Qua2V5cyhoYW5kbGVycyB8fCB7fSkpO1xuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKFwiW09QRlMgV29ya2VyXSBGYWlsZWQgdG8gaW5pdGlhbGl6ZTpcIiwgZXJyb3IpO1xuXHRcdH1cblx0fTtcblx0aW5pdFdvcmtlcigpO1xuXG4vLyNlbmRyZWdpb25cbn0pKCk7Il0sCiAgIm1hcHBpbmdzIjogImNBQUMsVUFBVyxDQUdYLElBQUlBLEVBQVksT0FBTyxlQUNuQkMsR0FBVyxDQUFDQyxFQUFJQyxFQUFLQyxJQUFRLElBQU0sQ0FDdEMsR0FBSUEsRUFBSyxNQUFNQSxFQUFJLENBQUMsRUFDcEIsR0FBSSxDQUNILE9BQU9GLElBQU9DLEVBQU1ELEVBQUdBLEVBQUssQ0FBQyxHQUFJQyxDQUNsQyxPQUFTRSxFQUFHLENBQ1gsTUFBTUQsRUFBTSxDQUFDQyxDQUFDLEVBQUdBLENBQ2xCLENBQ0QsRUFDSUMsR0FBYyxDQUFDQyxFQUFLQyxJQUFlLENBQ3RDLElBQUlDLEVBQVMsQ0FBQyxFQUNkLFFBQVNDLEtBQVFILEVBQ2hCUCxFQUFVUyxFQUFRQyxFQUFNLENBQ3ZCLElBQUtILEVBQUlHLENBQUksRUFDYixXQUFZLEVBQ2IsQ0FBQyxFQUVGLE9BQUtGLEdBQ0pSLEVBQVVTLEVBQVEsT0FBTyxZQUFhLENBQUUsTUFBTyxRQUFTLENBQUMsRUFFbkRBLENBQ1IsRUFJQSxTQUFTRSxJQUFNLENBQ2QsTUFBTSxFQUFJLFdBQ1YsR0FBSSxPQUFPLEVBQUUsYUFBZSxXQUFZLE9BQ3hDLE1BQU0sRUFBSSxLQUFNLENBQUMsRUFBR0MsRUFBS0MsR0FBTSxDQUM5QixPQUFPLEVBQUVBLENBQUMsR0FBSyxhQUFlLEVBQUVBLENBQUMsRUFBSSxFQUN0QyxFQUNBRCxFQUFFLGFBQWEsRUFBR0EsRUFBRSxNQUFNLEVBQUdBLEVBQUUsU0FBUyxFQUFHQSxFQUFFLGFBQWEsRUFBR0EsRUFBRSxZQUFZLEVBQUdBLEVBQUUsTUFBTSxFQUFHQSxFQUFFLFNBQVMsRUFBR0EsRUFBRSxrQkFBa0IsRUFBR0EsRUFBRSxZQUFZLEVBQUdBLEVBQUUsY0FBYyxFQUFHQSxFQUFFLFVBQVUsRUFBR0EsRUFBRSxpQkFBaUIsRUFBR0EsRUFBRSxpQkFBaUIs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LENBQ25DLE1BQU1ILEVBQVMsTUFBTU0sR0FBcUJELENBQUcsRUFDN0NELEVBQVEsS0FBS0osQ0FBTSxDQUNwQixDQUNBLE9BQU9JLENBQ1IsS0FBTyxRQUFPLE1BQU1FLEdBQXFCSCxDQUFRLENBQ2xELE9BQVNGLEVBQU8sQ0FDZixjQUFRLE1BQU0sMENBQTJDQSxDQUFLLEVBQ3hEQSxDQUNQLENBQ0QsRUFDTUssR0FBdUIsTUFBT0gsR0FBYSxDQUNoRCxNQUFNSixFQUFVdkMsRUFBUzJDLEVBQVMsSUFBSSxFQUN0QyxHQUFJLENBQUNKLEVBQVMsTUFBTSxJQUFJLE1BQU0seUJBQXlCSSxFQUFTLElBQUksRUFBRSxFQUN0RSxPQUFPLE1BQU1KLEVBQVFJLEVBQVMsT0FBTyxDQUN0QyxFQUNBLFdBQVcsZUFBaUJELElBQ1QsU0FBWSxDQUM5QixHQUFJLENBQ0gsTUFBTTFDLEdBQVksTUFBTSxRQUFRLFFBQVEsRUFBRSxLQUFLLEtBQU9PLEdBQWlCLEVBQUdWLEdBQW9CLEdBQUcsU0FDN0ZHLEdBQVVKLEdBQUdJLENBQVEsRUFDekIsUUFBUSxJQUFJLDJDQUE0QyxPQUFPLEtBQUtBLEdBQVksQ0FBQyxDQUFDLENBQUMsQ0FDcEYsT0FBU3lDLEVBQU8sQ0FDZixRQUFRLE1BQU0sc0NBQXVDQSxDQUFLLENBQzNELENBQ0QsR0FDVyxDQUdaLEdBQUciLAogICJuYW1lcyI6IFsiX19kZWZQcm9wIiwgIl9fZXNtTWluIiwgImZuIiwgInJlcyIsICJlcnIiLCAiZSIsICJfX2V4cG9ydEFsbCIsICJhbGwiLCAibm9fc3ltYm9scyIsICJ0YXJnZXQiLCAibmFtZSIsICJYJDEiLCAiciIsICJuIiwgIlokMSIsICJpIiwgIkRlJDEiLCAiWSIsICJzIiwgIk5lIiwgIkYiLCAiZyIsICJRJDEiLCAiYyIsICJ0ZSQxIiwgInJlJDEiLCAiJGUiLCAiViIsICJzZSIsICJiIiwgIm9lIiwgInB0JDEiLCAiJCIsICJsZSIsICJPIiwgImYiLCAicCIsICJIJDEiLCAieWUiLCAiaGUiLCAiZCIsICJvbiIsICJhbiIsICJaIiwgIlJlIiwgInYiLCAibyIsICJhIiwgIl8iLCAidXQiLCAiSCIsICJLZSIsICJibiIsICJ5biIsICJwdCIsICJfdCIsICJDbiIsICJxbiIsICJRIiwgImVlIiwgIm10IiwgIlllIiwgImRlIiwgInhuIiwgIkxuIiwgImtuIiwgIkVuIiwgIkluIiwgIlRuIiwgImJ0IiwgInl0IiwgImZlIiwgIlB0IiwgIk10IiwgIlMiLCAicmUiLCAidGUiLCAiQyIsICJDdCIsICJQIiwgInciLCAid2UiLCAieHQiLCAia3QiLCAiQW4iLCAiRGUiLCAiT2UiLCAidWUiLCAiUm4iLCAiRCIsICJ2ZSIsICJYIiwgIkV0IiwgIkwiLCAiSXQiLCAiT24iLCAiRG4iLCAiUiIsICJUdCIsICJ1IiwgInkiLCAieCIsICJzbiIsICJCbiIsICJXbiIsICJMZSIsICJBdCIsICJZbiIsICJKbiIsICJYbiIsICJabiIsICJKIiwgIlJ0IiwgIkplIiwgImVzIiwgInF0IiwgIk90IiwgIkEiLCAidHMiLCAiTHQiLCAiTnQiLCAiWGUiLCAiRHQiLCAicSIsICJuZSIsICJCdCIsICJqIiwgIkJlIiwgInJpIiwgIkIiLCAiYmUiLCAiUXQiLCAid3MiLCAidnMiLCAiZ2kiLCAieGkiLCAiT1BGU193b3JrZXJfZXhwb3J0cyIsICJnZXREaXJIYW5kbGUiLCAiZ2V0RmlsZVN5c3RlbVJvb3QiLCAiaGFuZGxlcnMiLCAibm9ybWFsaXplUGF0aCIsICJyZXNvbHZlRmlsZVN5c3RlbUhhbmRsZSIsICJtYXBwZWRSb290cyIsICJhY3RpdmVPYnNlcnZlcnMiLCAiU1dfQlJJREdFX0NIQU5ORUxfTkFNRSIsICJzd0JyaWRnZUNoYW5uZWwiLCAiaW5pdF9PUEZTX3dvcmtlciIsICJpZCIsICJwYXRoIiwgInJvb3QiLCAiY3JlYXRlIiwgInBhcnRzIiwgImN1cnJlbnQiLCAicGFydCIsICJoYW5kbGUiLCAicm9vdElkIiwgImVudHJpZXMiLCAiZW50cnkiLCAidHlwZSIsICJmaWxlbmFtZSIsICJkaXJQYXRoIiwgImZpbGUiLCAiZGF0YSIsICJ3cml0YWJsZSIsICJyZWN1cnNpdmUiLCAib2JzZXJ2ZXIiLCAicmVjb3JkcyIsICJjaGFuZ2VzIiwgImZyb20iLCAidG8iLCAiY29weVJlY3Vyc2l2ZSIsICJzb3VyY2UiLCAiZGVzdCIsICJuZXdEZXN0IiwgImV2ZW50IiwgInJlcXVlc3RJZCIsICJhY3Rpb24iLCAicGF5bG9hZCIsICJoYW5kbGVyIiwgInJlc3VsdCIsICJlcnJvciIsICJwcm9jZXNzTWVzc2FnZSIsICJlbnZlbG9wZSIsICJyZXN1bHRzIiwgIm1zZyIsICJwcm9jZXNzU2luZ2xlTWVzc2FnZSJdCn0K
