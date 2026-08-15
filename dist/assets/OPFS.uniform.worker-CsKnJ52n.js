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
	let h = (function(e) {
		return e.GET = "get", e.SET = "set", e.CALL = "call", e.APPLY = "apply", e.CONSTRUCT = "construct", e.DELETE = "delete", e.DELETE_PROPERTY = "deleteProperty", e.HAS = "has", e.OWN_KEYS = "ownKeys", e.GET_OWN_PROPERTY_DESCRIPTOR = "getOwnPropertyDescriptor", e.GET_PROPERTY_DESCRIPTOR = "getPropertyDescriptor", e.GET_PROTOTYPE_OF = "getPrototypeOf", e.SET_PROTOTYPE_OF = "setPrototypeOf", e.IS_EXTENSIBLE = "isExtensible", e.PREVENT_EXTENSIONS = "preventExtensions", e.TRANSFER = "transfer", e.IMPORT = "import", e.DISPOSE = "dispose", e;
	})({});
	const Le = {
		ws: "websocket",
		socket: "websocket",
		socketio: "socket-io",
		service: "service-worker",
		sw: "service-worker",
		"service-worker-client": "service-worker",
		"service-worker-host": "service-worker",
		"ring-buffer": "atomics"
	};
	function Be(e) {
		const t = String(e ?? "").trim().toLowerCase();
		return t ? Le[t] ?? t : "internal";
	}
	function qe(e) {
		return typeof e == "string" ? Be(e) : typeof Worker < "u" && e instanceof Worker ? "worker" : typeof SharedWorker < "u" && e instanceof SharedWorker ? "shared-worker" : typeof MessagePort < "u" && e instanceof MessagePort ? "message-port" : typeof BroadcastChannel < "u" && e instanceof BroadcastChannel ? "broadcast" : typeof WebSocket < "u" && e instanceof WebSocket ? "websocket" : typeof RTCDataChannel < "u" && e instanceof RTCDataChannel ? "rtc-data" : typeof chrome < "u" && e && typeof e == "object" && typeof e.postMessage == "function" && e.onMessage?.addListener ? "chrome-port" : "internal";
	}
	const ee = Symbol.for("@fix"), C = (e) => typeof e == "string" || typeof e == "number" || typeof e == "boolean" || typeof e == "bigint" || typeof e > "u" || e == null, Fe = (e, t) => C(e) ? t == "number" ? Number(e) || 0 : t == "string" ? String(e) || "" : t == "boolean" ? !!e : e : null, p = (e, t) => e?.[ee] ?? e ?? t ?? t, He = (e) => {
		if (typeof e == "function" || e == null) return e;
		const t = function() {};
		return t[ee] = e, t;
	}, Ge = (e) => crypto?.getRandomValues ? crypto?.getRandomValues?.(e) : (() => {
		const t = new Uint8Array(e.length);
		for (let n = 0; n < e.length; n++) t[n] = Math.floor(Math.random() * 256);
		return t;
	})(), d = () => crypto?.randomUUID ? crypto?.randomUUID?.() : "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (e) => (+e ^ Ge?.(/* @__PURE__ */ new Uint8Array(1))?.[0] & 15 >> +e / 4).toString(16)), te = (e) => Array.isArray(e) ? e?.flatMap?.((t) => Array.isArray(t) ? te(t) : t) : e, $ = (e) => te(e)?.every?.(x), x = (e) => C(e) || typeof SharedArrayBuffer == "function" && e instanceof SharedArrayBuffer || Ue(e) || Array.isArray(e) && $(e), Ue = (e) => ArrayBuffer.isView(e) && !(e instanceof DataView), z = (e) => C(e) || typeof ArrayBuffer == "function" && e instanceof ArrayBuffer || typeof MessagePort == "function" && e instanceof MessagePort || typeof ReadableStream == "function" && e instanceof ReadableStream || typeof WritableStream == "function" && e instanceof WritableStream || typeof TransformStream == "function" && e instanceof TransformStream || typeof ImageBitmap == "function" && e instanceof ImageBitmap || typeof VideoFrame == "function" && e instanceof VideoFrame || typeof OffscreenCanvas == "function" && e instanceof OffscreenCanvas || typeof RTCDataChannel == "function" && e instanceof RTCDataChannel || typeof AudioData == "function" && e instanceof AudioData || typeof WebTransportReceiveStream == "function" && e instanceof WebTransportReceiveStream || typeof WebTransportSendStream == "function" && e instanceof WebTransportSendStream || typeof WebTransportReceiveStream == "function" && e instanceof WebTransportReceiveStream, ne = Symbol.for("object.boundCtx");
	globalThis[ne] ??= /* @__PURE__ */ new WeakMap();
	globalThis[ne];
	const k = (e, t, n) => {
		if (Array.isArray(e)) return e.every(x) ? e.map(t) : e.map((s, r) => k(s, t, [e, r]));
		if (e instanceof Map) {
			const s = Array.from(e.entries());
			return s.map(([r, i]) => i).every(x) ? new Map(s.map(([r, i]) => [r, t(i, r, e)])) : new Map(s.map(([r, i]) => [r, k(i, t, [e, r])]));
		}
		if (e instanceof Set) {
			const s = Array.from(e.entries()), r = s.map(([i, o]) => o);
			return s.every(x) ? new Set(r.map(t)) : new Set(r.map((i) => k(i, t, [e, i])));
		}
		if (typeof e == "object" && e?.constructor == Object && Object.prototype.toString.call(e) == "[object Object]") {
			const s = Array.from(Object.entries(e));
			return s.map(([r, i]) => i).every(x) ? Object.fromEntries(s.map(([r, i]) => [r, t(i, r, e)])) : Object.fromEntries(s.map(([r, i]) => [r, k(i, t, [e, r])]));
		}
		return t(e, n?.[1] ?? "", n?.[0] ?? null);
	}, S = /* @__PURE__ */ new WeakMap(), se = /* @__PURE__ */ new WeakMap(), g = (e, t) => e instanceof Promise || typeof e?.then == "function" ? S?.has?.(e) ? t(S?.get?.(e)) : Promise.try?.(async () => {
		const n = await e;
		return S?.set?.(e, n), n;
	})?.then?.(t) : t(e);
	var We = class {
		#e;
		#t;
		constructor(e, t) {
			this.#e = e, this.#t = t;
		}
		defineProperty(e, t, n) {
			return p(e) instanceof Promise ? Reflect.defineProperty(e, t, n) : g(p(e), (s) => Reflect.defineProperty(s, t, n));
		}
		deleteProperty(e, t) {
			return p(e) instanceof Promise ? Reflect.deleteProperty(e, t) : g(p(e), (n) => Reflect.deleteProperty(n, t));
		}
		getPrototypeOf(e) {
			return p(e) instanceof Promise ? Reflect.getPrototypeOf(e) : g(p(e), (t) => Reflect.getPrototypeOf(t));
		}
		setPrototypeOf(e, t) {
			return p(e) instanceof Promise ? Reflect.setPrototypeOf(e, t) : g(p(e), (n) => Reflect.setPrototypeOf(n, t));
		}
		isExtensible(e) {
			return p(e) instanceof Promise ? Reflect.isExtensible(e) : g(p(e), (t) => Reflect.isExtensible(t));
		}
		preventExtensions(e) {
			return p(e) instanceof Promise ? Reflect.ownKeys(e) : g(p(e), (t) => Reflect.preventExtensions(t));
		}
		ownKeys(e) {
			const t = p(e);
			return t instanceof Promise ? Object.keys(t) : g(t, (n) => (typeof n == "object" || typeof n == "function") && n != null ? Object.keys(n) : []) ?? [];
		}
		getOwnPropertyDescriptor(e, t) {
			return p(e) instanceof Promise ? Reflect.getOwnPropertyDescriptor(e, t) : g(p(e), (n) => Reflect.getOwnPropertyDescriptor(n, t));
		}
		construct(e, t, n) {
			return g(p(e), (s) => Reflect.construct(s, t, n));
		}
		has(e, t) {
			return p(e) instanceof Promise ? Reflect.has(e, t) : g(p(e), (n) => Reflect.has(n, t));
		}
		get(e, t, n) {
			if (e = p(e), t == "promise") return e;
			if (t == "resolve" && this.#e) return (...r) => {
				const i = this.#e?.(...r);
				return this.#e = null, i;
			};
			if (t == "reject" && this.#t) return (...r) => {
				const i = this.#t?.(...r);
				return this.#t = null, i;
			};
			if (t == "then" || t == "catch" || t == "finally") {
				if (e instanceof Promise) return e?.[t]?.bind?.(e);
				{
					const r = Promise.try(() => e);
					return r?.[t]?.bind?.(r);
				}
			}
			let s;
			return S?.has?.(e) && (s = S?.get?.(e))?.[t] != null ? s = S?.get?.(e)?.[t] : s = re(g(e, async (r) => {
				if (p(r) instanceof Promise) return Reflect.get(r, t, n);
				if (C(r)) return t == Symbol.toPrimitive || t == Symbol.toStringTag ? r : void 0;
				let i;
				try {
					i = Reflect.get(r, t, n);
				} catch {
					i = e?.[t];
				}
				return typeof i == "function" ? i?.bind?.(r) : i;
			})), t == Symbol.toStringTag ? C(s) ? String(s ?? "") || "" : s?.[Symbol.toStringTag]?.() || String(s ?? "") || "" : t == Symbol.toPrimitive ? (r) => {
				if (C(s)) return Fe(s, r);
			} : s;
		}
		set(e, t, n) {
			return g(p(e), (s) => Reflect.set(s, t, n));
		}
		apply(e, t, n) {
			if (this.#e) {
				const s = this.#e?.(...n);
				return this.#e = null, s;
			}
			return g(p(e, this.#e), (s) => {
				if (typeof s == "function") return p(s) instanceof Promise, Reflect.apply(s, t, n);
			});
		}
	};
	function re(e, t, n) {
		return e instanceof Promise || typeof e?.then == "function" ? S?.has?.(e) ? S?.get?.(e) : (se?.has?.(e) || e?.then?.((s) => S?.set?.(e, s)), se?.getOrInsertComputed?.(e, () => new Proxy(He(e), new We(t, n)))) : e;
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
	}, $e = class {
		_producer;
		constructor(e) {
			this._producer = e;
		}
		subscribe(e, t) {
			const n = typeof e == "function" ? { next: e } : e ?? {}, s = new AbortController();
			t?.signal?.addEventListener("abort", () => s.abort());
			let r = !0, i;
			const o = () => {
				r = !1, s.abort(), i?.();
			}, a = {
				next: (c) => r && n.next?.(c),
				error: (c) => {
					r && (n.error?.(c), o());
				},
				complete: () => {
					r && (n.complete?.(), o());
				},
				signal: s.signal,
				get active() {
					return r && !s.signal.aborted;
				}
			};
			try {
				i = this._producer(a);
			} catch (c) {
				a.error(c);
			}
			return new oe(o);
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
	};
	const ze = (e) => (t) => new $e((n) => {
		const s = t.subscribe({
			next: (r) => e(r) && n.next(r),
			error: (r) => n.error(r),
			complete: () => n.complete()
		});
		return () => s.unsubscribe();
	});
	function ie() {
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
	function ae(e) {
		if (typeof RTCDataChannel < "u" && e instanceof RTCDataChannel) return "rtc-data";
		const t = qe(e);
		return t && t !== "internal" ? t : e === self || e === globalThis || e === "self" ? "self" : "internal";
	}
	function Ye(e) {
		if (!e) return "unknown";
		if (e.contextType) return e.contextType;
		const t = e.sender ?? "";
		return t.includes("worker") ? "worker" : t.includes("sw") || t.includes("service") ? "service-worker" : t.includes("chrome") || t.includes("crx") ? "chrome-content" : t.includes("background") ? "chrome-background" : "unknown";
	}
	const Ke = {
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
	}, Ve = Symbol.for("uniform.proxy"), Xe = Symbol.for("uniform.proxy.internals");
	var je = class {
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
			if (t === Ve) return !0;
			if (t === Xe) return this._config;
			if (t === at) return !0;
			if (t === D) return this._getDescriptor();
			if (t === "then" || t === "catch" || t === "finally" || typeof t == "symbol") return;
			if (t === "$path") return this._config.basePath;
			if (t === "$channel") return this._config.channel;
			if (t === "$descriptor") return this._getDescriptor();
			if (t === "$invoke") return this._invoker;
			const r = [...this._config.basePath, s];
			if (this._config.cache && this._childCache.has(s)) return this._childCache.get(s);
			const i = H(this._invoker, {
				...this._config,
				basePath: r
			});
			return this._config.cache && this._childCache.set(s, i), i;
		}
		set(e, t, n, s) {
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
	function H(e, t) {
		const n = function() {}, s = new je(e, t);
		return new Proxy(n, s);
	}
	function ce(e, t, n) {
		if (!e || typeof e != "object" || e.primitive) return e;
		const s = _e.get(e);
		if (s) return s;
		const r = H(t, {
			channel: n ?? e.channel ?? "unknown",
			basePath: e.path ?? []
		});
		return _e.set(e, r), V.set(r, e), r;
	}
	const Ze = ce;
	function et(e) {
		return [
			e.localChannel,
			e.remoteChannel,
			e.sender,
			e.transportType,
			e.direction
		].join("::");
	}
	function tt(e, t = {}) {
		const n = t.includeClosed ?? !1, s = t.status ?? (n ? void 0 : "active");
		return [...e].filter((r) => !(s && r.status !== s || t.channel && r.localChannel !== t.channel && r.remoteChannel !== t.channel || t.localChannel && r.localChannel !== t.localChannel || t.remoteChannel && r.remoteChannel !== t.remoteChannel || t.sender && r.sender !== t.sender || t.transportType && r.transportType !== t.transportType || t.direction && r.direction !== t.direction)).sort((r, i) => i.updatedAt - r.updatedAt);
	}
	var le = class {
		_createId;
		_emitEvent;
		_connections = /* @__PURE__ */ new Map();
		constructor(e, t) {
			this._createId = e, this._emitEvent = t;
		}
		register(e) {
			const t = et(e), n = Date.now(), s = this._connections.get(t);
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
			return tt(this._connections.values(), e);
		}
		values() {
			return [...this._connections.values()];
		}
		clear() {
			this._connections.clear();
		}
	}, ue = class {
		_name;
		_contextType;
		_config;
		_transports = /* @__PURE__ */ new Map();
		_defaultTransport = null;
		_connectionEvents = new y({ bufferSize: 200 });
		_connectionRegistry = new le(() => d(), (e) => this._connectionEvents.next(e));
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
			this._name = t.name, this._contextType = t.autoDetect !== !1 ? ie() : "unknown", this._config = {
				name: t.name,
				autoDetect: t.autoDetect ?? !0,
				timeout: t.timeout ?? 3e4,
				reflect: t.reflect ?? Ke,
				bufferSize: t.bufferSize ?? 100,
				autoListen: t.autoListen ?? !0
			}, this._config.autoListen && this._isWorkerContext() && this.listen(self);
		}
		connect(e, t = {}) {
			const n = ae(e), s = t.targetChannel ?? this._inferTargetChannel(e, n), r = this._createTransportBinding(e, n, s, t);
			this._transports.set(s, r), this._defaultTransport || (this._defaultTransport = r);
			const i = this._registerConnection({
				localChannel: this._name,
				remoteChannel: s,
				sender: this._name,
				transportType: n,
				direction: "outgoing",
				metadata: { phase: "connect" }
			});
			return this._emitConnectionSignal(r, "connect", {
				connectionId: i.id,
				from: this._name,
				to: s
			}), this;
		}
		listen(e, t = {}) {
			const n = ae(e), s = t.targetChannel ?? this._inferTargetChannel(e, n), r = (o) => this._handleIncoming(o), i = this._registerConnection({
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
					t.autoStart !== !1 && e.start && e.start(), e.addEventListener?.("message", ((o) => r(o.data)));
					break;
				case "websocket":
					e.addEventListener?.("message", ((o) => {
						try {
							r(JSON.parse(o.data));
						} catch {}
					}));
					break;
				case "chrome-runtime":
					chrome.runtime.onMessage?.addListener?.((o, a, c) => (r(o), !0));
					break;
				case "chrome-tabs":
					chrome.runtime.onMessage?.addListener?.((o, a) => t.tabId != null && a?.tab?.id !== t.tabId ? !1 : (r(o), !0));
					break;
				case "chrome-port":
					e?.onMessage?.addListener?.((o) => {
						r(o);
					});
					break;
				case "chrome-external":
					chrome.runtime.onMessageExternal?.addListener?.((o) => (r(o), !0));
					break;
				case "self":
					addEventListener?.("message", ((o) => r(o.data)));
					break;
				default: t.onMessage && t.onMessage(r);
			}
			return this._sendSignalToTarget(e, n, {
				connectionId: i.id,
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
			return U(n, t), this._exposed.set(e, {
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
		invoke(e, t, n, s = []) {
			const r = d(), i = Promise.withResolvers();
			this._pending.set(r, i);
			const o = setTimeout(() => {
				this._pending.has(r) && (this._pending.delete(r), i.reject(/* @__PURE__ */ new Error(`Request timeout: ${t} on ${n.join(".")}`)));
			}, this._config.timeout), a = {
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
			return this._send(e, a), this._outbound.next(a), i.promise.finally(() => clearTimeout(o));
		}
		get(e, t, n) {
			return this.invoke(e, h.GET, t, [n]);
		}
		set(e, t, n, s) {
			return this.invoke(e, h.SET, t, [n, s]);
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
			return ce(e, (s, r, i) => {
				const o = t ?? e?.channel ?? this._getDefaultTarget();
				return this.invoke(o, s, r, i);
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
				const i = this._transports.get(r.remoteChannel);
				i && (this._emitConnectionSignal(i, "notify", {
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
			const { action: n, path: s, args: r, sender: i } = t, o = e.reqId ?? e.id;
			this._invocations.next({
				id: o,
				channel: this._name,
				sender: i,
				action: n,
				path: s,
				args: r ?? [],
				timestamp: Date.now(),
				contextType: Ye(e)
			});
			const { result: a, toTransfer: c, newPath: l } = await this._executeAction(n, s, r ?? [], i);
			await this._sendResponse(o, n, i, l, a, c);
		}
		async _executeAction(e, t, n, s) {
			const { result: r, toTransfer: i, path: o } = we(e, t, n, {
				channel: this._name,
				sender: s,
				reflect: this._config.reflect
			});
			return {
				result: await r,
				toTransfer: i,
				newPath: o
			};
		}
		async _sendResponse(e, t, n, s, r, i) {
			const { response: o, transfer: a } = await be(e, t, this._name, n, s, r, i), c = {
				id: e,
				...o,
				timestamp: Date.now(),
				transferable: a
			};
			this._send(n, c, a);
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
					const i = n.tabId;
					i != null && chrome.tabs?.sendMessage?.(i, r);
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
			let r, i;
			switch (t) {
				case "worker":
				case "message-port":
				case "broadcast":
					s.autoStart !== !1 && e.start && e.start(), r = (o, a) => e.postMessage(o, { transfer: a });
					{
						const o = ((a) => this._handleIncoming(a.data));
						e.addEventListener?.("message", o), i = () => e.removeEventListener?.("message", o);
					}
					break;
				case "websocket":
					r = (o) => e.send(JSON.stringify(o));
					{
						const o = ((a) => {
							try {
								this._handleIncoming(JSON.parse(a.data));
							} catch {}
						});
						e.addEventListener?.("message", o), i = () => e.removeEventListener?.("message", o);
					}
					break;
				case "chrome-runtime":
					r = (o) => chrome.runtime.sendMessage(o);
					{
						const o = (a) => this._handleIncoming(a);
						chrome.runtime.onMessage?.addListener?.(o), i = () => chrome.runtime.onMessage?.removeListener?.(o);
					}
					break;
				case "chrome-tabs":
					r = (o) => {
						s.tabId != null && chrome.tabs?.sendMessage?.(s.tabId, o);
					};
					{
						const o = (a, c) => s.tabId != null && c?.tab?.id !== s.tabId ? !1 : (this._handleIncoming(a), !0);
						chrome.runtime.onMessage?.addListener?.(o), i = () => chrome.runtime.onMessage?.removeListener?.(o);
					}
					break;
				case "chrome-port":
					if (e?.postMessage && e?.onMessage?.addListener) {
						r = (a) => e.postMessage(a);
						const o = (a) => this._handleIncoming(a);
						e.onMessage.addListener(o), i = () => {
							try {
								e.onMessage.removeListener(o);
							} catch {}
							try {
								e.disconnect?.();
							} catch {}
						};
					} else {
						const o = s.portName ?? n, a = s.tabId != null && chrome.tabs?.connect ? chrome.tabs.connect(s.tabId, { name: o }) : chrome.runtime.connect({ name: o });
						r = (l) => a.postMessage(l);
						const c = (l) => this._handleIncoming(l);
						a.onMessage.addListener(c), i = () => {
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
					r = (o) => {
						s.externalId && chrome.runtime.sendMessage(s.externalId, o);
					};
					{
						const o = (a) => (this._handleIncoming(a), !0);
						chrome.runtime.onMessageExternal?.addListener?.(o), i = () => chrome.runtime.onMessageExternal?.removeListener?.(o);
					}
					break;
				case "self":
					r = (o, a) => globalThis.postMessage?.(o, { transfer: a ?? [] });
					{
						const o = ((a) => this._handleIncoming(a.data));
						globalThis.addEventListener?.("message", o), i = () => globalThis.removeEventListener?.("message", o);
					}
					break;
				default: s.onMessage && (i = s.onMessage((o) => this._handleIncoming(o))), r = (o) => e?.postMessage?.(o);
			}
			return {
				target: e,
				targetChannel: n,
				transportType: t,
				sender: r,
				cleanup: i,
				postMessage: (o, a) => r?.(o, a),
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
			return H((s, r, i) => this.invoke(e, s, r, i), {
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
	function Y(e) {
		return new ue(e);
	}
	let G = null;
	function nt() {
		if (!G) {
			const e = ie();
			[
				"worker",
				"shared-worker",
				"service-worker"
			].includes(e) ? G = Y({
				name: "worker",
				autoListen: !0
			}) : G = Y({
				name: "host",
				autoListen: !1
			});
		}
		return G;
	}
	const m = {
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
		typeof ArrayBuffer != m.udf ? ArrayBuffer : null,
		typeof MessagePort != m.udf ? MessagePort : null,
		typeof ReadableStream != m.udf ? ReadableStream : null,
		typeof WritableStream != m.udf ? WritableStream : null,
		typeof TransformStream != m.udf ? TransformStream : null,
		typeof WebTransportReceiveStream != m.udf ? WebTransportReceiveStream : null,
		typeof WebTransportSendStream != m.udf ? WebTransportSendStream : null,
		typeof AudioData != m.udf ? AudioData : null,
		typeof ImageBitmap != m.udf ? ImageBitmap : null,
		typeof VideoFrame != m.udf ? VideoFrame : null,
		typeof OffscreenCanvas != m.udf ? OffscreenCanvas : null,
		typeof RTCDataChannel != m.udf ? RTCDataChannel : null
	].filter((e) => e != null);
	function he() {
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
		const t = he();
		if (!t.length) throw new TypeError("[uniform] No base URL for worker resolution (missing location / document.baseURI)");
		const n = e.startsWith("/") ? e.replace(/^\//, "./") : e;
		return new URL(n, t).href;
	}
	const w = {
		name: "unknown",
		instance: null
	}, K = /* @__PURE__ */ new Map(), fe = (e) => [...Object.values(h)].includes(e);
	var st = class {
		channelName;
		options;
		_channel;
		constructor(e, t = {}) {
			this.channelName = e, this.options = t, this._channel = nt();
		}
		request(e, t, n, s = {}) {
			return typeof e == "string" && (e = [e]), Array.isArray(t) && fe(e) && (s = n, n = t, t = e, e = []), this._channel.invoke(this.channelName, t, e, n);
		}
		doImportModule(e, t) {
			return this._channel.import(e, this.channelName);
		}
	}, rt = class {
		channel;
		options;
		_unified;
		broadcasts = {};
		constructor(e, t = {}) {
			this.channel = e, this.options = t, this._unified = Y({
				name: e,
				autoListen: !1
			}), w.name = e, w.instance = this;
		}
		createRemoteChannel(e, t = {}, n) {
			return n && (this._unified.attach(n, { targetChannel: e }), this.broadcasts[e] = n), Promise.resolve(new st(e, t));
		}
		getChannel() {
			return this.channel;
		}
		request(e, t, n, s = {}, r = "worker") {
			return typeof e == "string" && (e = [e]), Array.isArray(t) && fe(e) && (r = s, s = n, n = t, t = e, e = []), this._unified.invoke(r, t, e, n);
		}
		resolveResponse(e, t) {
			return Promise.resolve(t);
		}
		async handleAndResponse(e, t, n) {
			const s = await ut(e, t, this.channel);
			s && n?.(s.response, s.transfer);
		}
		close() {
			this._unified.close();
		}
	};
	const ot = (e = "$host$") => {
		if (w?.instance && e === "$host$") return w.instance;
		if (K.has(e)) return K.get(e) ?? null;
		const t = new rt(e);
		return e === "$host$" && (w.name = e, w.instance = t), K.set(e, t), t;
	}, pe = /* @__PURE__ */ new WeakMap(), V = /* @__PURE__ */ new WeakMap(), _e = /* @__PURE__ */ new WeakMap(), it = (e, t = w?.name, n) => typeof e == "object" && e != null || typeof e == "function" && e != null ? V.has(e) ? V.get(e) : pe.has(e) ? pe.get(e) : $(e) || n?.includes?.(e) || t == w?.name ? e : {
		$isDescriptor: !0,
		path: T.get(e) ?? (() => {
			const s = [d()];
			return U(s, e), s;
		})(),
		owner: w?.name,
		channel: t,
		primitive: C(e),
		writable: !0,
		enumerable: !0,
		configurable: !0,
		argumentCount: e instanceof Function ? e.length : -1
	} : x(e) ? e : null, at = Symbol.for("@requestHandler"), D = Symbol.for("@descriptor"), X = (e) => x(e) || e?.[D] ? e : e?.$isDescriptor ? Ze(e, async () => {}) : $(e) ? e : null, L = /* @__PURE__ */ new Map(), T = /* @__PURE__ */ new WeakMap(), ye = (e, t) => {
		if (t != null && !Array.isArray(t) && (t = [t]), t == null || t?.length < 1) return e;
		const n = e?.[D] ?? (e?.$isDescriptor ? e : null);
		if (n && n?.owner == w?.name && (e = R(n?.path) ?? e), C(e)) return e;
		for (const s of t) if (e = e?.[s], e == null) return e;
		return e;
	}, R = (e) => {
		if (e != null && !Array.isArray(e) && (e = [e]), e == null || e?.length < 1) return null;
		const t = L?.get?.(e?.[0]) ?? null;
		return t != null ? ye(t, e?.slice?.(1)) : null;
	}, U = (e, t) => {
		const n = t?.[D] ?? (t?.$isDescriptor ? t : null);
		if (n && n?.owner == w?.name && (t = R(n?.path) ?? t), e != null && !Array.isArray(e) && (e = [e]), e == null || e?.length < 1) return null;
		const s = L?.get?.(e?.[0]) ?? null;
		return e?.length > 1 ? ye(s, e?.slice?.(1, -1))[e?.[e?.length - 1]] = t : L?.set?.(e?.[0], t), (typeof t == "object" || typeof t == "function") && T?.set?.(t, e), t;
	}, ge = (e) => (e != null && !Array.isArray(e) && (e = [e]), e == null || e?.length < 1 ? !1 : !(L?.get?.(e?.[0]) ?? null) && e?.length <= 1 ? (L?.delete?.(e?.[0]), !0) : !1), ct = (e) => {
		const t = e?.[D] ?? (e?.$isDescriptor ? e : null);
		t && t?.owner == w?.name && (e = R(t?.path) ?? e);
		const n = T?.get?.(e) ?? t?.path;
		return n == null || n?.length < 1 ? !1 : (ge(n), (typeof e == "object" || typeof e == "function") && T?.delete?.(e), !0);
	}, lt = (e) => {
		const t = e?.[D] ?? (e?.$isDescriptor ? e : null);
		return (T?.get?.(e) ?? t?.path) == null;
	}, E = (e) => (typeof e == "object" || typeof e == "function") && e != null, me = {
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
	function we(e, t, n, s = {}) {
		const { channel: r = "", sender: i = "", reflect: o = me } = s, a = s.target ?? R(t), c = [];
		let l = null, _ = t;
		switch (String(e).toLowerCase()) {
			case "import":
			case h.IMPORT:
				l = import(n?.[0]);
				break;
			case "transfer":
			case h.TRANSFER:
				z(a) && r !== i && c.push(a), l = a;
				break;
			case "get":
			case h.GET: {
				const f = n?.[0], b = o.get?.(a, f) ?? a?.[f];
				l = typeof b == "function" && a != null ? b.bind(a) : b, _ = [...t, String(f)];
				break;
			}
			case "set":
			case h.SET: {
				const [f, b] = n, N = k(b, X);
				s.target ? l = o.set?.(a, f, N) ?? (a[f] = N, !0) : l = o.set?.(a, f, N) ?? U([...t, String(f)], N);
				break;
			}
			case "apply":
			case "call":
			case h.APPLY:
			case h.CALL:
				if (typeof a == "function") {
					const f = s.context ?? (s.target ? void 0 : R(t.slice(0, -1))), b = k(n?.[0] ?? n ?? [], X);
					l = o.apply?.(a, f, b) ?? a.apply(f, b), z(l) && t?.at(-1) === "transfer" && r !== i && c.push(l);
				}
				break;
			case "construct":
			case h.CONSTRUCT:
				if (typeof a == "function") {
					const f = k(n?.[0] ?? n ?? [], X);
					l = o.construct?.(a, f) ?? new a(...f);
				}
				break;
			case "delete":
			case "deleteproperty":
			case "dispose":
			case h.DELETE:
			case h.DELETE_PROPERTY:
			case h.DISPOSE:
				if (s.target) {
					const f = t[t.length - 1];
					l = o.deleteProperty?.(a, f) ?? delete a[f];
				} else l = t?.length > 0 ? ge(t) : ct(a), l && (_ = T.get(a) ?? []);
				break;
			case "has":
			case h.HAS:
				l = o.has?.(a, n?.[0]) ?? (E(a) ? n?.[0] in a : !1);
				break;
			case "ownkeys":
			case h.OWN_KEYS:
				l = o.ownKeys?.(a) ?? (E(a) ? Object.keys(a) : []);
				break;
			case "getownpropertydescriptor":
			case "getpropertydescriptor":
			case h.GET_OWN_PROPERTY_DESCRIPTOR:
			case h.GET_PROPERTY_DESCRIPTOR:
				l = o.getOwnPropertyDescriptor?.(a, n?.[0] ?? t?.at(-1) ?? "") ?? (E(a) ? Object.getOwnPropertyDescriptor(a, n?.[0] ?? t?.at(-1) ?? "") : void 0);
				break;
			case "getprototypeof":
			case h.GET_PROTOTYPE_OF:
				l = o.getPrototypeOf?.(a) ?? (E(a) ? Object.getPrototypeOf(a) : null);
				break;
			case "setprototypeof":
			case h.SET_PROTOTYPE_OF:
				l = o.setPrototypeOf?.(a, n?.[0]) ?? (E(a) ? Object.setPrototypeOf(a, n?.[0]) : !1);
				break;
			case "isextensible":
			case h.IS_EXTENSIBLE:
				l = o.isExtensible?.(a) ?? (E(a) ? Object.isExtensible(a) : !0);
				break;
			case "preventextensions":
			case h.PREVENT_EXTENSIONS: l = o.preventExtensions?.(a) ?? (E(a) ? Object.preventExtensions(a) : !1);
		}
		return {
			result: l,
			toTransfer: c,
			path: _
		};
	}
	async function be(e, t, n, s, r, i, o) {
		const a = await i, c = z(a) && o.includes(a) || x(a);
		let l = r;
		!c && t !== "get" && t !== h.GET && (typeof a == "object" || typeof a == "function") && (lt(a) ? (l = [d()], U(l, a)) : l = T.get(a) ?? []);
		const _ = R(l), f = t === "get" || t === h.GET ? l?.at(-1) : void 0, b = R(r), N = k(a, (Ot) => it(Ot, n, o)) ?? a;
		return {
			response: {
				channel: s,
				sender: n,
				reqId: e,
				action: t,
				type: "response",
				payload: {
					result: c ? N : null,
					type: typeof a,
					channel: s,
					sender: n,
					descriptor: {
						$isDescriptor: !0,
						path: l,
						owner: n,
						channel: n,
						primitive: C(a),
						writable: !0,
						enumerable: !0,
						configurable: !0,
						argumentCount: b instanceof Function ? b.length : -1,
						...E(_) && f != null ? Object.getOwnPropertyDescriptor(_, f) : {}
					}
				}
			},
			transfer: o
		};
	}
	async function ut(e, t, n, s) {
		const { channel: r, sender: i, path: o, action: a, args: c } = e;
		if (r !== n) return null;
		const { result: l, toTransfer: _, path: f } = we(a, o, c, {
			channel: r,
			sender: i,
			...s
		});
		return be(t, a, n, i, f, l, _);
	}
	var dt = class {
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
			return (t ? ze((n) => n.sender === t)(this._inbound) : this._inbound).subscribe(typeof e == "function" ? { next: e } : e);
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
			const i = setTimeout(() => {
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
			}), r.promise.finally(() => clearTimeout(i));
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
	}, ft = class F {
		_connections = /* @__PURE__ */ new Map();
		static _instance = null;
		static getInstance() {
			return F._instance || (F._instance = new F()), F._instance;
		}
		getOrCreate(t, n = "internal", s = {}) {
			return this._connections.has(t) || this._connections.set(t, new dt(t, n, s)), this._connections.get(t);
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
	const Ce = () => ft.getInstance(), pt = (e, t, n) => Ce().getOrCreate(e, t, n), _t = "uniform_channels", yt = 1, u = {
		MESSAGES: "messages",
		MAILBOX: "mailbox",
		PENDING: "pending",
		EXCHANGE: "exchange",
		TRANSACTIONS: "transactions"
	};
	var gt = class {
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
				const n = indexedDB.open(_t, yt);
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
			return new Promise((r, i) => {
				const o = n.transaction([u.MESSAGES, u.MAILBOX], "readwrite"), a = o.objectStore(u.MESSAGES), c = o.objectStore(u.MAILBOX);
				a.add(s), c.add(s), o.oncomplete = () => {
					this._messageUpdates.next(s), r(s.id);
				}, o.onerror = () => i(/* @__PURE__ */ new Error("Failed to defer message"));
			});
		}
		async getDeferredMessages(e, t = {}) {
			const n = await this.open();
			return new Promise((s, r) => {
				const i = n.transaction(u.MESSAGES, "readonly").objectStore(u.MESSAGES), o = t.status ? i.index("channel_status") : i.index("channel"), a = t.status ? IDBKeyRange.only([e, t.status]) : IDBKeyRange.only(e), c = o.getAll(a, t.limit);
				c.onsuccess = () => {
					let l = c.result;
					t.offset && (l = l.slice(t.offset)), s(l);
				}, c.onerror = () => r(/* @__PURE__ */ new Error("Failed to get deferred messages"));
			});
		}
		async processNextPending(e) {
			const t = await this.open();
			return new Promise((n, s) => {
				const r = t.transaction(u.MESSAGES, "readwrite").objectStore(u.MESSAGES).index("channel_status").openCursor(IDBKeyRange.only([e, "pending"]));
				r.onsuccess = () => {
					const i = r.result;
					if (i) {
						const o = i.value;
						o.status = "processing", o.updatedAt = Date.now(), i.update(o), this._messageUpdates.next(o), n(o);
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
				const r = t.transaction(u.MESSAGES, "readwrite").objectStore(u.MESSAGES), i = r.get(e);
				i.onsuccess = () => {
					const o = i.result;
					if (!o) {
						n(!1);
						return;
					}
					o.retryCount++, o.updatedAt = Date.now(), o.retryCount < o.maxRetries ? o.status = "pending" : o.status = "failed", r.put(o), this._messageUpdates.next(o), n(o.status === "pending");
				}, i.onerror = () => s(/* @__PURE__ */ new Error("Failed to mark message as failed"));
			});
		}
		async _updateMessageStatus(e, t) {
			const n = await this.open();
			return new Promise((s, r) => {
				const i = n.transaction(u.MESSAGES, "readwrite").objectStore(u.MESSAGES), o = i.get(e);
				o.onsuccess = () => {
					const a = o.result;
					a && (a.status = t, a.updatedAt = Date.now(), i.put(a), this._messageUpdates.next(a)), s();
				}, o.onerror = () => r(/* @__PURE__ */ new Error("Failed to update message status"));
			});
		}
		async getMailbox(e, t = {}) {
			const n = await this.open();
			return new Promise((s, r) => {
				const i = n.transaction(u.MAILBOX, "readonly").objectStore(u.MAILBOX).index("channel").getAll(IDBKeyRange.only(e), t.limit);
				i.onsuccess = () => {
					let o = i.result;
					t.sortBy === "priority" ? o.sort((a, c) => c.priority - a.priority) : o.sort((a, c) => c.createdAt - a.createdAt), s(o);
				}, i.onerror = () => r(/* @__PURE__ */ new Error("Failed to get mailbox"));
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
				const r = t.transaction(u.MAILBOX, "readwrite"), i = r.objectStore(u.MAILBOX).index("channel");
				let o = 0;
				const a = i.openCursor(IDBKeyRange.only(e));
				a.onsuccess = () => {
					const c = a.result;
					c && (c.delete(), o++, c.continue());
				}, r.oncomplete = () => n(o), r.onerror = () => s(/* @__PURE__ */ new Error("Failed to clear mailbox"));
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
				const i = t.transaction(u.PENDING, "readwrite");
				i.objectStore(u.PENDING).add(n), i.oncomplete = () => s(n.id), i.onerror = () => r(/* @__PURE__ */ new Error("Failed to register pending operation"));
			});
		}
		async getPendingOperations() {
			const e = await this.open();
			return new Promise((t, n) => {
				const s = e.transaction(u.PENDING, "readonly").objectStore(u.PENDING).index("channel").getAll(IDBKeyRange.only(this._channelName));
				s.onsuccess = () => t(s.result), s.onerror = () => n(/* @__PURE__ */ new Error("Failed to get pending operations"));
			});
		}
		async completePending(e) {
			const t = await this.open();
			return new Promise((n, s) => {
				const r = t.transaction(u.PENDING, "readwrite");
				r.objectStore(u.PENDING).delete(e), r.oncomplete = () => n(), r.onerror = () => s(/* @__PURE__ */ new Error("Failed to complete pending operation"));
			});
		}
		async awaitPending(e, t = {}) {
			const n = t.timeout ?? 3e4, s = t.pollInterval ?? 100, r = Date.now();
			for (; Date.now() - r < n;) {
				const i = await this._getPendingById(e);
				if (!i) return null;
				if (i.status === "completed") return await this.completePending(e), i.result;
				await new Promise((o) => setTimeout(o, s));
			}
			throw new Error(`Pending operation ${e} timed out`);
		}
		async _getPendingById(e) {
			const t = await this.open();
			return new Promise((n, s) => {
				const r = t.transaction(u.PENDING, "readonly").objectStore(u.PENDING).get(e);
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
			return new Promise((i, o) => {
				const a = s.transaction(u.EXCHANGE, "readwrite"), c = a.objectStore(u.EXCHANGE), l = c.index("key").get(e);
				l.onsuccess = () => {
					const _ = l.result;
					_ && (r.id = _.id, r.version = _.version + 1, r.createdAt = _.createdAt), c.put(r);
				}, a.oncomplete = () => {
					this._exchangeUpdates.next(r), i(r.id);
				}, a.onerror = () => o(/* @__PURE__ */ new Error("Failed to put exchange data"));
			});
		}
		async exchangeGet(e) {
			const t = await this.open();
			return new Promise((n, s) => {
				const r = t.transaction(u.EXCHANGE, "readonly").objectStore(u.EXCHANGE).index("key").get(e);
				r.onsuccess = () => {
					const i = r.result;
					if (!i) {
						n(null);
						return;
					}
					if (!this._canAccessExchange(i)) {
						n(null);
						return;
					}
					n(i.value);
				}, r.onerror = () => s(/* @__PURE__ */ new Error("Failed to get exchange data"));
			});
		}
		async exchangeDelete(e) {
			const t = await this.open();
			return new Promise((n, s) => {
				const r = t.transaction(u.EXCHANGE, "readwrite"), i = r.objectStore(u.EXCHANGE), o = i.index("key").get(e);
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
					i.delete(a.id);
				}, r.oncomplete = () => n(!0), r.onerror = () => s(/* @__PURE__ */ new Error("Failed to delete exchange data"));
			});
		}
		async exchangeLock(e, t = {}) {
			const n = await this.open(), s = t.timeout ?? 3e4;
			return new Promise((r, i) => {
				const o = n.transaction(u.EXCHANGE, "readwrite"), a = o.objectStore(u.EXCHANGE), c = a.index("key").get(e);
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
					}, l.updatedAt = Date.now(), a.put(l);
				}, o.oncomplete = () => r(!0), o.onerror = () => i(/* @__PURE__ */ new Error("Failed to acquire lock"));
			});
		}
		async exchangeUnlock(e) {
			const t = await this.open();
			return new Promise((n, s) => {
				const r = t.transaction(u.EXCHANGE, "readwrite"), i = r.objectStore(u.EXCHANGE), o = i.index("key").get(e);
				o.onsuccess = () => {
					const a = o.result;
					a && a.lock?.holder === this._channelName && (delete a.lock, a.updatedAt = Date.now(), i.put(a));
				}, r.oncomplete = () => n(), r.onerror = () => s(/* @__PURE__ */ new Error("Failed to release lock"));
			});
		}
		_canAccessExchange(e) {
			return e.owner === this._channelName || e.sharedWith.includes("*") ? !0 : e.sharedWith.includes(this._channelName);
		}
		async beginTransaction() {
			return new mt(this);
		}
		async executeTransaction(e) {
			const t = await this.open(), n = new Set(e.map((s) => s.store));
			return new Promise((s, r) => {
				const i = t.transaction(Array.from(n), "readwrite");
				for (const o of e) {
					const a = i.objectStore(o.store);
					switch (o.type) {
						case "put":
							o.value !== void 0 && a.put(o.value);
							break;
						case "delete":
							o.key !== void 0 && a.delete(o.key);
							break;
						case "update": if (o.key !== void 0) {
							const c = a.get(o.key);
							c.onsuccess = () => {
								c.result && o.value && a.put({
									...c.result,
									...o.value
								});
							};
						}
					}
				}
				i.oncomplete = () => s(), i.onerror = () => r(/* @__PURE__ */ new Error("Transaction failed"));
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
				const r = e.transaction([u.MESSAGES, u.MAILBOX], "readwrite"), i = r.objectStore(u.MESSAGES), o = r.objectStore(u.MAILBOX);
				let a = 0;
				const c = i.openCursor();
				c.onsuccess = () => {
					const _ = c.result;
					if (_) {
						const f = _.value;
						f.expiresAt && f.expiresAt < t && (_.delete(), a++), _.continue();
					}
				};
				const l = o.openCursor();
				l.onsuccess = () => {
					const _ = l.result;
					if (_) {
						const f = _.value;
						f.expiresAt && f.expiresAt < t && (_.delete(), a++), _.continue();
					}
				}, r.oncomplete = () => n(a), r.onerror = () => s(/* @__PURE__ */ new Error("Failed to cleanup expired"));
			});
		}
	}, mt = class {
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
	const j = /* @__PURE__ */ new Map();
	function wt(e) {
		return j.has(e) || j.set(e, new gt(e)), j.get(e);
	}
	const Se = he(), bt = Se.length > 0 ? new URL("../transport/Worker.ts", Se) : "";
	var xe = class {
		_channel;
		_context;
		_options;
		_connection;
		_storage;
		constructor(e, t, n = {}) {
			this._channel = e, this._context = t, this._options = n, this._connection = pt(e), this._storage = wt(e);
		}
		async request(e, t, n, s = {}) {
			let r = typeof e == "string" ? [e] : e, i = t, o = n;
			return Array.isArray(t) && ke(e) && (s = n, o = t, i = e, r = []), this._context.getHost()?.request(r, i, o, s, this._channel);
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
			this._channel = e, this._context = t, this._options = n, this._connection = Ce().getOrCreate(e, "internal", n), this._unified = new ue({
				name: e,
				autoListen: !1,
				timeout: n?.timeout
			});
		}
		createRemoteChannel(e, t = {}, n) {
			const s = St(n ?? this._context.$createOrUseExistingRemote(e, t, n ?? null)?.messageChannel?.port1), r = Pe(s?.target ?? s);
			return this._unified.listen(s?.target, { targetChannel: e }), s && (this._broadcasts?.set?.(e, s), r === "self" && typeof postMessage > "u" || this._unified.connect(s, { targetChannel: e }), this._context.$registerConnection({
				localChannel: this._channel,
				remoteChannel: e,
				sender: this._channel,
				direction: "outgoing",
				transportType: r
			}), this.notifyChannel(e, {
				contextId: this._context.id,
				contextName: this._context.hostName
			}, "connect")), new xe(e, this._context, t);
		}
		getChannel() {
			return this._channel;
		}
		get connection() {
			return this._connection;
		}
		request(e, t, n, s = {}, r = "worker") {
			let i = typeof e == "string" ? [e] : e, o = n;
			return Array.isArray(t) && ke(e) && (r = s, s = n, o = t, t = e, i = []), this._unified.invoke(r, t, i ?? [], Array.isArray(o) ? o : [o]);
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
	}, Ct = class {
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
				for (const i of r) {
					if (t.localChannel && t.localChannel !== s.name || t.remoteChannel && t.remoteChannel !== i) continue;
					const o = this.queryConnections({
						localChannel: s.name,
						remoteChannel: i,
						status: "active"
					})[0];
					t.sender && o?.sender !== t.sender || t.transportType && o?.transportType !== t.transportType || t.channel && t.channel !== s.name && t.channel !== i || s.handler.notifyChannel(i, e, "notify") && n++;
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
			const s = ve(t);
			if (!s) throw new Error(`Failed to create worker for channel: ${e}`);
			const r = new P(e, this, {
				...this._options.defaultOptions,
				...n
			}), i = r.createRemoteChannel(e, n, s), o = {
				name: e,
				handler: r,
				connection: r.connection,
				subscriptions: [],
				transportType: "worker",
				ready: Promise.resolve(i),
				unified: r.unified
			};
			return this._endpoints.set(e, o), this._registerUnifiedChannel(e, r.unified), this._remoteChannels.set(e, {
				channel: e,
				context: this,
				remote: Promise.resolve(i),
				transport: s,
				transportType: "worker"
			}), o;
		}
		async addPort(e, t, n = {}) {
			const s = new P(e, this, {
				...this._options.defaultOptions,
				...n
			});
			t.start?.();
			const r = s.createRemoteChannel(e, n, t), i = {
				name: e,
				handler: s,
				connection: s.connection,
				subscriptions: [],
				transportType: "message-port",
				ready: Promise.resolve(r),
				unified: s.unified
			};
			return this._endpoints.set(e, i), this._registerUnifiedChannel(e, s.unified), this._remoteChannels.set(e, {
				channel: e,
				context: this,
				remote: Promise.resolve(r),
				transport: t,
				transportType: "message-port"
			}), i;
		}
		async addBroadcast(e, t, n = {}) {
			const s = new BroadcastChannel(t ?? e), r = new P(e, this, {
				...this._options.defaultOptions,
				...n
			}), i = r.createRemoteChannel(e, n, s), o = {
				name: e,
				handler: r,
				connection: r.connection,
				subscriptions: [],
				transportType: "broadcast",
				ready: Promise.resolve(i),
				unified: r.unified
			};
			return this._endpoints.set(e, o), this._registerUnifiedChannel(e, r.unified), this._remoteChannels.set(e, {
				channel: e,
				context: this,
				remote: Promise.resolve(i),
				transport: s,
				transportType: "broadcast"
			}), o;
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
			}), i = new P(t, this, {
				...this._options.defaultOptions,
				...n
			});
			s.port1.start(), s.port2.start();
			const o = Promise.resolve(r.createRemoteChannel(t, n, s.port1)), a = Promise.resolve(i.createRemoteChannel(e, n, s.port2)), c = {
				name: e,
				handler: r,
				connection: r.connection,
				subscriptions: [],
				transportType: "message-port",
				ready: o,
				unified: r.unified
			}, l = {
				name: t,
				handler: i,
				connection: i.connection,
				subscriptions: [],
				transportType: "message-port",
				ready: a,
				unified: i.unified
			};
			return this._endpoints.set(e, c), this._endpoints.set(t, l), this._registerUnifiedChannel(e, r.unified), this._registerUnifiedChannel(t, i.unified), {
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
			const s = new MessageChannel(), r = re(new Promise((o) => {
				const a = ve(bt);
				a?.addEventListener?.("message", (c) => {
					c.data.type === "channelCreated" && (s.port1?.start?.(), o(new xe(c.data.channel, this, t)));
				}), a?.postMessage?.({
					type: "createChannel",
					channel: e,
					sender: this._hostName,
					options: t,
					messagePort: s.port2
				}, { transfer: [s.port2] });
			})), i = {
				channel: e,
				context: this,
				messageChannel: s,
				remote: r
			};
			return this._remoteChannels.set(e, i), i;
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
		return [...Object.values(h)].includes(e);
	}
	function St(e) {
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
	function ve(e) {
		if (e instanceof Worker) return e;
		if (e instanceof URL) return new Worker(e.href, { type: "module" });
		if (typeof e == "function") try {
			return new e({ type: "module" });
		} catch {
			return e({ type: "module" });
		}
		return typeof e == "string" ? e.startsWith("/") ? new Worker(de(e.replace(/^\//, "./")), { type: "module" }) : URL.canParse(e) || e.startsWith("./") ? new Worker(de(e), { type: "module" }) : new Worker(URL.createObjectURL(new Blob([e], { type: "application/javascript" })), { type: "module" }) : e instanceof Blob || e instanceof File ? new Worker(URL.createObjectURL(e), { type: "module" }) : e ?? (typeof self < "u" ? self : null);
	}
	const xt = /* @__PURE__ */ new Map();
	function kt(e = {}) {
		const t = new Ct(e);
		return e.name && xt.set(e.name, t), t;
	}
	var Et = class {
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
			}, this._context = kt({
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
	let J = null;
	function Pt(e) {
		return J || (J = new Et(e)), J;
	}
	Pt({ name: "worker" });
	var W = class {
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
				} catch (i) {
					r.error?.(i);
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
					resolve: (i) => {
						clearTimeout(r), n(i);
					},
					reject: (i) => {
						clearTimeout(r), s(i);
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
			local: new W(n.port1, e, t),
			remote: n.port2,
			transfer: () => n.port2
		};
	}
	var Te = class {
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
			const { local: e, remote: t } = Q(this._channelName, this._config);
			return this._target.postMessage({
				type: "port-connect",
				channelName: this._channelName,
				portId: e.portId
			}, this._config.targetOrigin ?? "*", [t]), new Promise((n, s) => {
				const r = setTimeout(() => {
					s(/* @__PURE__ */ new Error("Handshake timeout")), this._state.next("error");
				}, this._config.handshakeTimeout ?? 1e4), i = e.subscribe({ next: (o) => {
					o.type === "signal" && o.payload?.action === "handshake-ack" && (clearTimeout(r), this._handshakeComplete = !0, this._transport = e, this._state.next("connected"), i.unsubscribe(), n(e));
				} });
			});
		}
		static listen(e, t, n) {
			const s = (r) => {
				if (r.data?.type !== "port-connect" || r.data?.channelName !== e || !r.ports[0]) return;
				const i = new W(r.ports[0], e, n);
				i.send({
					id: d(),
					channel: e,
					sender: i.portId,
					type: "signal",
					payload: { action: "handshake-ack" }
				}), t(i);
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
	const Re = (e, t = "worker") => {
		const n = ot(t ?? "worker");
		return Object.keys(e).forEach((s) => {
			e[s];
		}), n;
	};
	var At = Ne({
		getDirHandle: () => O,
		getFileSystemRoot: () => A,
		handlers: () => v,
		normalizePath: () => I,
		resolveFileSystemHandle: () => Ae
	}), B, q, A, I, Ae, O, v, Ie, M, Oe = De((() => {
		B = /* @__PURE__ */ new Map(), q = /* @__PURE__ */ new Map(), A = async (e = "") => e && B.has(e) ? B.get(e) : await navigator.storage.getDirectory(), I = (e) => e?.trim?.()?.replace(/\/+/g, "/") || "/", Ae = async (e, t, n = !1) => {
			const s = I(t).split("/").filter((i) => i && i !== ".");
			let r = e;
			for (let i = 0; i < s.length; i++) {
				const o = s[i];
				if (i === s.length - 1) try {
					return await r.getDirectoryHandle(o, { create: n });
				} catch {
					try {
						return await r.getFileHandle(o, { create: n });
					} catch (a) {
						if (n) throw a;
						return null;
					}
				}
				else r = await r.getDirectoryHandle(o, { create: n });
			}
			return r;
		}, O = async (e, t, n) => {
			const s = I(t).split("/").filter((i) => i);
			let r = e;
			for (const i of s) r = await r.getDirectoryHandle(i, { create: n });
			return r;
		}, v = {
			mount: async ({ id: e, handle: t }) => (B.set(e, t), !0),
			unmount: async ({ id: e }) => (B.delete(e), !0),
			readDirectory: async ({ rootId: e, path: t, create: n }) => {
				try {
					const s = await A(e), r = await O(s, t, n), i = [];
					for await (const [o, a] of r.entries()) i.push([o, a]);
					return i;
				} catch (s) {
					return console.warn("Worker readDirectory error:", s), [];
				}
			},
			readFile: async ({ rootId: e, path: t, type: n }) => {
				try {
					const s = await A(e), r = I(t).split("/").filter((c) => c), i = r.pop(), o = r.join("/"), a = await (await (await O(s, o, !1)).getFileHandle(i, { create: !1 })).getFile();
					return n === "text" ? await a.text() : n === "arrayBuffer" ? await a.arrayBuffer() : a;
				} catch (s) {
					return console.warn("Worker readFile error:", s), null;
				}
			},
			writeFile: async ({ rootId: e, path: t, data: n }) => {
				try {
					const s = await A(e), r = I(t).split("/").filter((c) => c), i = r.pop(), o = r.join("/"), a = await (await (await O(s, o, !0)).getFileHandle(i, { create: !0 })).createWritable();
					return await a.write(n), await a.close(), !0;
				} catch (s) {
					return console.warn("Worker writeFile error:", s), !1;
				}
			},
			remove: async ({ rootId: e, path: t, recursive: n }) => {
				try {
					const s = await A(e), r = I(t).split("/").filter((a) => a), i = r.pop(), o = r.join("/");
					return await (await O(s, o, !1)).removeEntry(i, { recursive: n }), !0;
				} catch {
					return !1;
				}
			},
			observe: async ({ rootId: e, path: t, id: n }) => {
				try {
					if (q.has(n)) return !0;
					const s = await A(e), r = await O(s, t, !1);
					if (typeof FileSystemObserver < "u") {
						const i = new FileSystemObserver((o) => {
							const a = o.map((c) => {
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
						return i.observe(r), q.set(n, i), !0;
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
						if (s.kind === "directory") for await (const [i, o] of s.entries()) if (o.kind === "directory") {
							const a = await r.getDirectoryHandle(i, { create: !0 });
							await n(o, a);
						} else {
							const a = await o.getFile(), c = await (await r.getFileHandle(i, { create: !0 })).createWritable();
							await c.write(a), await c.close();
						}
						else {
							const i = await s.getFile(), o = await r.createWritable();
							await o.write(i), await o.close();
						}
					};
					return await n(e, t), !0;
				} catch (n) {
					return console.warn("Worker copy error:", n), !1;
				}
			}
		}, Ie = "opfs-sw-bridge-v1", M = null;
		try {
			typeof BroadcastChannel < "u" && (M = new BroadcastChannel(Ie), M.onmessage = async (e) => {
				const t = e?.data || {};
				if (!t || typeof t != "object" || t?.type !== "opfs-sw-request") return;
				const n = String(t?.requestId || ""), s = String(t?.action || ""), r = t?.payload;
				if (!n || !s) return;
				const i = v[s];
				if (!i) {
					M?.postMessage?.({
						type: "opfs-sw-response",
						requestId: n,
						ok: !1,
						error: `Unknown operation type: ${s}`
					});
					return;
				}
				try {
					const o = await i(r);
					M?.postMessage?.({
						type: "opfs-sw-response",
						requestId: n,
						ok: !0,
						result: o
					});
				} catch (o) {
					M?.postMessage?.({
						type: "opfs-sw-response",
						requestId: n,
						ok: !1,
						error: o?.message || String(o)
					});
				}
			});
		} catch {
			M = null;
		}
		self.addEventListener("message", async (e) => {
			if (!e.data || typeof e.data != "object") return;
			const { id: t, type: n, payload: s } = e.data;
			if (v[n]) try {
				const r = await v[n](s);
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
	Oe(), v && Re(v);
	const It = async (e) => {
		try {
			if (e.type === "batch") {
				const t = [];
				for (const n of e.payload) {
					const s = await Me(n);
					t.push(s);
				}
				return t;
			} else return await Me(e);
		} catch (t) {
			throw console.error("[OPFS Worker] Message processing error:", t), t;
		}
	}, Me = async (e) => {
		const t = v[e.type];
		if (!t) throw new Error(`Unknown message type: ${e.type}`);
		return await t(e.payload);
	};
	globalThis.processMessage = It, (async () => {
		try {
			const e = (await Promise.resolve().then(() => (Oe(), At))).handlers;
			e && Re(e), console.log("[OPFS Worker] Initialized with handlers:", Object.keys(e || {}));
		} catch (e) {
			console.error("[OPFS Worker] Failed to initialize:", e);
		}
	})();
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiYXNzZXRzL09QRlMudW5pZm9ybS53b3JrZXItIX57MDAwfX4uanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIihmdW5jdGlvbigpIHtcblxuLy8jcmVnaW9uIFxcMHJvbGxkb3duL3J1bnRpbWUuanNcblx0dmFyIF9fZGVmUHJvcCA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eTtcblx0dmFyIF9fZXNtTWluID0gKGZuLCByZXMsIGVycikgPT4gKCkgPT4ge1xuXHRcdGlmIChlcnIpIHRocm93IGVyclswXTtcblx0XHR0cnkge1xuXHRcdFx0cmV0dXJuIGZuICYmIChyZXMgPSBmbihmbiA9IDApKSwgcmVzO1xuXHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdHRocm93IGVyciA9IFtlXSwgZTtcblx0XHR9XG5cdH07XG5cdHZhciBfX2V4cG9ydEFsbCA9IChhbGwsIG5vX3N5bWJvbHMpID0+IHtcblx0XHRsZXQgdGFyZ2V0ID0ge307XG5cdFx0Zm9yICh2YXIgbmFtZSBpbiBhbGwpIHtcblx0XHRcdF9fZGVmUHJvcCh0YXJnZXQsIG5hbWUsIHtcblx0XHRcdFx0Z2V0OiBhbGxbbmFtZV0sXG5cdFx0XHRcdGVudW1lcmFibGU6IHRydWVcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRpZiAoIW5vX3N5bWJvbHMpIHtcblx0XHRcdF9fZGVmUHJvcCh0YXJnZXQsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogXCJNb2R1bGVcIiB9KTtcblx0XHR9XG5cdFx0cmV0dXJuIHRhcmdldDtcblx0fTtcblxuLy8jZW5kcmVnaW9uXG4vLyNyZWdpb24gLi4vdW5pZm9ybS50cy9zcmMvbmV3ZXIvbmV4dC90eXBlcy9JbnRlcmZhY2UudHNcblx0bGV0IFdSZWZsZWN0QWN0aW9uID0gLyogQF9fUFVSRV9fICovIGZ1bmN0aW9uKFdSZWZsZWN0QWN0aW9uKSB7XG5cdFx0V1JlZmxlY3RBY3Rpb25bXCJHRVRcIl0gPSBcImdldFwiO1xuXHRcdFdSZWZsZWN0QWN0aW9uW1wiU0VUXCJdID0gXCJzZXRcIjtcblx0XHRXUmVmbGVjdEFjdGlvbltcIkNBTExcIl0gPSBcImNhbGxcIjtcblx0XHRXUmVmbGVjdEFjdGlvbltcIkFQUExZXCJdID0gXCJhcHBseVwiO1xuXHRcdFdSZWZsZWN0QWN0aW9uW1wiQ09OU1RSVUNUXCJdID0gXCJjb25zdHJ1Y3RcIjtcblx0XHRXUmVmbGVjdEFjdGlvbltcIkRFTEVURVwiXSA9IFwiZGVsZXRlXCI7XG5cdFx0V1JlZmxlY3RBY3Rpb25bXCJERUxFVEVfUFJPUEVSVFlcIl0gPSBcImRlbGV0ZVByb3BlcnR5XCI7XG5cdFx0V1JlZmxlY3RBY3Rpb25bXCJIQVNcIl0gPSBcImhhc1wiO1xuXHRcdFdSZWZsZWN0QWN0aW9uW1wiT1dOX0tFWVNcIl0gPSBcIm93bktleXNcIjtcblx0XHRXUmVmbGVjdEFjdGlvbltcIkdFVF9PV05fUFJPUEVSVFlfREVTQ1JJUFRPUlwiXSA9IFwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yXCI7XG5cdFx0V1JlZmxlY3RBY3Rpb25bXCJHRVRfUFJPUEVSVFlfREVTQ1JJUFRPUlwiXSA9IFwiZ2V0UHJvcGVydHlEZXNjcmlwdG9yXCI7XG5cdFx0V1JlZmxlY3RBY3Rpb25bXCJHRVRfUFJPVE9UWVBFX09GXCJdID0gXCJnZXRQcm90b3R5cGVPZlwiO1xuXHRcdFdSZWZsZWN0QWN0aW9uW1wiU0VUX1BST1RPVFlQRV9PRlwiXSA9IFwic2V0UHJvdG90eXBlT2ZcIjtcblx0XHRXUmVmbGVjdEFjdGlvbltcIklTX0VYVEVOU0lCTEVcIl0gPSBcImlzRXh0ZW5zaWJsZVwiO1xuXHRcdFdSZWZsZWN0QWN0aW9uW1wiUFJFVkVOVF9FWFRFTlNJT05TXCJdID0gXCJwcmV2ZW50RXh0ZW5zaW9uc1wiO1xuXHRcdFdSZWZsZWN0QWN0aW9uW1wiVFJBTlNGRVJcIl0gPSBcInRyYW5zZmVyXCI7XG5cdFx0V1JlZmxlY3RBY3Rpb25bXCJJTVBPUlRcIl0gPSBcImltcG9ydFwiO1xuXHRcdFdSZWZsZWN0QWN0aW9uW1wiRElTUE9TRVwiXSA9IFwiZGlzcG9zZVwiO1xuXHRcdHJldHVybiBXUmVmbGVjdEFjdGlvbjtcblx0fSh7fSk7XG5cbi8vI2VuZHJlZ2lvblxuLy8jcmVnaW9uIC4uL3VuaWZvcm0udHMvc3JjL25ld2VyL2NvcmUvVHJhbnNwb3J0Q29yZS50c1xuXHRjb25zdCBUUkFOU1BPUlRfVFlQRV9BTElBU0VTID0ge1xuXHRcdFwid3NcIjogXCJ3ZWJzb2NrZXRcIixcblx0XHRcInNvY2tldFwiOiBcIndlYnNvY2tldFwiLFxuXHRcdFwic29ja2V0aW9cIjogXCJzb2NrZXQtaW9cIixcblx0XHRcInNlcnZpY2VcIjogXCJzZXJ2aWNlLXdvcmtlclwiLFxuXHRcdFwic3dcIjogXCJzZXJ2aWNlLXdvcmtlclwiLFxuXHRcdFwic2VydmljZS13b3JrZXItY2xpZW50XCI6IFwic2VydmljZS13b3JrZXJcIixcblx0XHRcInNlcnZpY2Utd29ya2VyLWhvc3RcIjogXCJzZXJ2aWNlLXdvcmtlclwiLFxuXHRcdFwicmluZy1idWZmZXJcIjogXCJhdG9taWNzXCJcblx0fTtcblx0ZnVuY3Rpb24gbm9ybWFsaXplVHJhbnNwb3J0VHlwZUFsaWFzKHRyYW5zcG9ydCkge1xuXHRcdGNvbnN0IHJhdyA9IFN0cmluZyh0cmFuc3BvcnQgPz8gXCJcIikudHJpbSgpLnRvTG93ZXJDYXNlKCk7XG5cdFx0aWYgKCFyYXcpIHJldHVybiBcImludGVybmFsXCI7XG5cdFx0cmV0dXJuIFRSQU5TUE9SVF9UWVBFX0FMSUFTRVNbcmF3XSA/PyByYXc7XG5cdH1cblx0ZnVuY3Rpb24gZGV0ZWN0VHJhbnNwb3J0VHlwZSQxKHRyYW5zcG9ydCkge1xuXHRcdGlmICh0eXBlb2YgdHJhbnNwb3J0ID09PSBcInN0cmluZ1wiKSByZXR1cm4gbm9ybWFsaXplVHJhbnNwb3J0VHlwZUFsaWFzKHRyYW5zcG9ydCk7XG5cdFx0aWYgKHR5cGVvZiBXb3JrZXIgIT09IFwidW5kZWZpbmVkXCIgJiYgdHJhbnNwb3J0IGluc3RhbmNlb2YgV29ya2VyKSByZXR1cm4gXCJ3b3JrZXJcIjtcblx0XHRpZiAodHlwZW9mIFNoYXJlZFdvcmtlciAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0cmFuc3BvcnQgaW5zdGFuY2VvZiBTaGFyZWRXb3JrZXIpIHJldHVybiBcInNoYXJlZC13b3JrZXJcIjtcblx0XHRpZiAodHlwZW9mIE1lc3NhZ2VQb3J0ICE9PSBcInVuZGVmaW5lZFwiICYmIHRyYW5zcG9ydCBpbnN0YW5jZW9mIE1lc3NhZ2VQb3J0KSByZXR1cm4gXCJtZXNzYWdlLXBvcnRcIjtcblx0XHRpZiAodHlwZW9mIEJyb2FkY2FzdENoYW5uZWwgIT09IFwidW5kZWZpbmVkXCIgJiYgdHJhbnNwb3J0IGluc3RhbmNlb2YgQnJvYWRjYXN0Q2hhbm5lbCkgcmV0dXJuIFwiYnJvYWRjYXN0XCI7XG5cdFx0aWYgKHR5cGVvZiBXZWJTb2NrZXQgIT09IFwidW5kZWZpbmVkXCIgJiYgdHJhbnNwb3J0IGluc3RhbmNlb2YgV2ViU29ja2V0KSByZXR1cm4gXCJ3ZWJzb2NrZXRcIjtcblx0XHRpZiAodHlwZW9mIFJUQ0RhdGFDaGFubmVsICE9PSBcInVuZGVmaW5lZFwiICYmIHRyYW5zcG9ydCBpbnN0YW5jZW9mIFJUQ0RhdGFDaGFubmVsKSByZXR1cm4gXCJydGMtZGF0YVwiO1xuXHRcdGlmICh0eXBlb2YgY2hyb21lICE9PSBcInVuZGVmaW5lZFwiICYmIHRyYW5zcG9ydCAmJiB0eXBlb2YgdHJhbnNwb3J0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiB0cmFuc3BvcnQucG9zdE1lc3NhZ2UgPT09IFwiZnVuY3Rpb25cIiAmJiB0cmFuc3BvcnQub25NZXNzYWdlPy5hZGRMaXN0ZW5lcikgcmV0dXJuIFwiY2hyb21lLXBvcnRcIjtcblx0XHRyZXR1cm4gXCJpbnRlcm5hbFwiO1xuXHR9XG5cbi8vI2VuZHJlZ2lvblxuLy8jcmVnaW9uIC4uL2NvcmUudHMvc3JjL3V0aWxzL1ByaW1pdGl2ZS50c1xuXHRjb25zdCAkZnh5ID0gU3ltYm9sLmZvcihcIkBmaXhcIik7XG5cdC8qKlxuXHQqIENoZWNrIGlmIGEgdmFsdWUgaXMgYSBwcmltaXRpdmUgdHlwZSAobnVsbCwgc3RyaW5nLCBudW1iZXIsIGJvb2xlYW4sIGJpZ2ludCwgb3IgdW5kZWZpbmVkKS5cblx0KiBAcGFyYW0gb2JqIC0gVGhlIHZhbHVlIHRvIGNoZWNrXG5cdCogQHJldHVybnMgVHJ1ZSBpZiB0aGUgdmFsdWUgaXMgYSBwcmltaXRpdmUgdHlwZSwgZmFsc2Ugb3RoZXJ3aXNlXG5cdCovXG5cdGNvbnN0IGlzUHJpbWl0aXZlID0gKG9iaikgPT4ge1xuXHRcdHJldHVybiB0eXBlb2Ygb2JqID09IFwic3RyaW5nXCIgfHwgdHlwZW9mIG9iaiA9PSBcIm51bWJlclwiIHx8IHR5cGVvZiBvYmogPT0gXCJib29sZWFuXCIgfHwgdHlwZW9mIG9iaiA9PSBcImJpZ2ludFwiIHx8IHR5cGVvZiBvYmogPT0gXCJ1bmRlZmluZWRcIiB8fCBvYmogPT0gbnVsbDtcblx0fTtcblx0Y29uc3QgdHJ5UGFyc2VCeUhpbnQgPSAodmFsdWUsIGhpbnQpID0+IHtcblx0XHRpZiAoIWlzUHJpbWl0aXZlKHZhbHVlKSkgcmV0dXJuIG51bGw7XG5cdFx0aWYgKGhpbnQgPT0gXCJudW1iZXJcIikgcmV0dXJuIE51bWJlcih2YWx1ZSkgfHwgMDtcblx0XHRpZiAoaGludCA9PSBcInN0cmluZ1wiKSByZXR1cm4gU3RyaW5nKHZhbHVlKSB8fCBcIlwiO1xuXHRcdGlmIChoaW50ID09IFwiYm9vbGVhblwiKSByZXR1cm4gISF2YWx1ZTtcblx0XHRyZXR1cm4gdmFsdWU7XG5cdH07XG5cdGNvbnN0IHVud3JhcCA9IChvYmosIGZhbGxiYWNrKSA9PiB7XG5cdFx0cmV0dXJuIG9iaj8uWyRmeHldID8/IChvYmogIT0gbnVsbCA/IG9iaiA6IGZhbGxiYWNrKSA/PyBmYWxsYmFjaztcblx0fTtcblx0Y29uc3QgZml4RnggPSAob2JqKSA9PiB7XG5cdFx0aWYgKHR5cGVvZiBvYmogPT0gXCJmdW5jdGlvblwiIHx8IG9iaiA9PSBudWxsKSByZXR1cm4gb2JqO1xuXHRcdGNvbnN0IGZ4ID0gZnVuY3Rpb24oKSB7fTtcblx0XHRmeFskZnh5XSA9IG9iajtcblx0XHRyZXR1cm4gZng7XG5cdH07XG5cdGNvbnN0IGdldFJhbmRvbVZhbHVlcyA9IChhcnJheSkgPT4ge1xuXHRcdHJldHVybiBjcnlwdG8/LmdldFJhbmRvbVZhbHVlcyA/IGNyeXB0bz8uZ2V0UmFuZG9tVmFsdWVzPy4oYXJyYXkpIDogKCgpID0+IHtcblx0XHRcdGNvbnN0IHZhbHVlcyA9IG5ldyBVaW50OEFycmF5KGFycmF5Lmxlbmd0aCk7XG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB2YWx1ZXNbaV0gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyNTYpO1xuXHRcdFx0cmV0dXJuIHZhbHVlcztcblx0XHR9KSgpO1xuXHR9O1xuXHRjb25zdCBVVUlEdjQgPSAoKSA9PiBjcnlwdG8/LnJhbmRvbVVVSUQgPyBjcnlwdG8/LnJhbmRvbVVVSUQ/LigpIDogXCIxMDAwMDAwMC0xMDAwLTQwMDAtODAwMC0xMDAwMDAwMDAwMDBcIi5yZXBsYWNlKC9bMDE4XS9nLCAoYykgPT4gKCtjIF4gZ2V0UmFuZG9tVmFsdWVzPy4oLyogQF9fUFVSRV9fICovIG5ldyBVaW50OEFycmF5KDEpKT8uWzBdICYgMTUgPj4gK2MgLyA0KS50b1N0cmluZygxNikpO1xuXHRjb25zdCB1bndyYXBBcnJheSA9IChhcnIpID0+IHtcblx0XHRpZiAoQXJyYXkuaXNBcnJheShhcnIpKSByZXR1cm4gYXJyPy5mbGF0TWFwPy4oKGVsKSA9PiB7XG5cdFx0XHRpZiAoQXJyYXkuaXNBcnJheShlbCkpIHJldHVybiB1bndyYXBBcnJheShlbCk7XG5cdFx0XHRyZXR1cm4gZWw7XG5cdFx0fSk7XG5cdFx0ZWxzZSByZXR1cm4gYXJyO1xuXHR9O1xuXHRjb25zdCBpc05vdENvbXBsZXhBcnJheSA9IChhcnIpID0+IHtcblx0XHRyZXR1cm4gdW53cmFwQXJyYXkoYXJyKT8uZXZlcnk/Lihpc0Nhbkp1c3RSZXR1cm4pO1xuXHR9O1xuXHRjb25zdCBpc0Nhbkp1c3RSZXR1cm4gPSAob2JqKSA9PiB7XG5cdFx0cmV0dXJuIGlzUHJpbWl0aXZlKG9iaikgfHwgdHlwZW9mIFNoYXJlZEFycmF5QnVmZmVyID09IFwiZnVuY3Rpb25cIiAmJiBvYmogaW5zdGFuY2VvZiBTaGFyZWRBcnJheUJ1ZmZlciB8fCBpc1R5cGVkQXJyYXkob2JqKSB8fCBBcnJheS5pc0FycmF5KG9iaikgJiYgaXNOb3RDb21wbGV4QXJyYXkob2JqKTtcblx0fTtcblx0Y29uc3QgaXNUeXBlZEFycmF5ID0gKHZhbHVlKSA9PiB7XG5cdFx0cmV0dXJuIEFycmF5QnVmZmVyLmlzVmlldyh2YWx1ZSkgJiYgISh2YWx1ZSBpbnN0YW5jZW9mIERhdGFWaWV3KTtcblx0fTtcblx0Y29uc3QgaXNDYW5UcmFuc2ZlciA9IChvYmopID0+IHtcblx0XHRyZXR1cm4gaXNQcmltaXRpdmUob2JqKSB8fCB0eXBlb2YgQXJyYXlCdWZmZXIgPT0gXCJmdW5jdGlvblwiICYmIG9iaiBpbnN0YW5jZW9mIEFycmF5QnVmZmVyIHx8IHR5cGVvZiBNZXNzYWdlUG9ydCA9PSBcImZ1bmN0aW9uXCIgJiYgb2JqIGluc3RhbmNlb2YgTWVzc2FnZVBvcnQgfHwgdHlwZW9mIFJlYWRhYmxlU3RyZWFtID09IFwiZnVuY3Rpb25cIiAmJiBvYmogaW5zdGFuY2VvZiBSZWFkYWJsZVN0cmVhbSB8fCB0eXBlb2YgV3JpdGFibGVTdHJlYW0gPT0gXCJmdW5jdGlvblwiICYmIG9iaiBpbnN0YW5jZW9mIFdyaXRhYmxlU3RyZWFtIHx8IHR5cGVvZiBUcmFuc2Zvcm1TdHJlYW0gPT0gXCJmdW5jdGlvblwiICYmIG9iaiBpbnN0YW5jZW9mIFRyYW5zZm9ybVN0cmVhbSB8fCB0eXBlb2YgSW1hZ2VCaXRtYXAgPT0gXCJmdW5jdGlvblwiICYmIG9iaiBpbnN0YW5jZW9mIEltYWdlQml0bWFwIHx8IHR5cGVvZiBWaWRlb0ZyYW1lID09IFwiZnVuY3Rpb25cIiAmJiBvYmogaW5zdGFuY2VvZiBWaWRlb0ZyYW1lIHx8IHR5cGVvZiBPZmZzY3JlZW5DYW52YXMgPT0gXCJmdW5jdGlvblwiICYmIG9iaiBpbnN0YW5jZW9mIE9mZnNjcmVlbkNhbnZhcyB8fCB0eXBlb2YgUlRDRGF0YUNoYW5uZWwgPT0gXCJmdW5jdGlvblwiICYmIG9iaiBpbnN0YW5jZW9mIFJUQ0RhdGFDaGFubmVsIHx8IHR5cGVvZiBBdWRpb0RhdGEgPT0gXCJmdW5jdGlvblwiICYmIG9iaiBpbnN0YW5jZW9mIEF1ZGlvRGF0YSB8fCB0eXBlb2YgV2ViVHJhbnNwb3J0UmVjZWl2ZVN0cmVhbSA9PSBcImZ1bmN0aW9uXCIgJiYgb2JqIGluc3RhbmNlb2YgV2ViVHJhbnNwb3J0UmVjZWl2ZVN0cmVhbSB8fCB0eXBlb2YgV2ViVHJhbnNwb3J0U2VuZFN0cmVhbSA9PSBcImZ1bmN0aW9uXCIgJiYgb2JqIGluc3RhbmNlb2YgV2ViVHJhbnNwb3J0U2VuZFN0cmVhbSB8fCB0eXBlb2YgV2ViVHJhbnNwb3J0UmVjZWl2ZVN0cmVhbSA9PSBcImZ1bmN0aW9uXCIgJiYgb2JqIGluc3RhbmNlb2YgV2ViVHJhbnNwb3J0UmVjZWl2ZVN0cmVhbTtcblx0fTtcblxuLy8jZW5kcmVnaW9uXG4vLyNyZWdpb24gLi4vY29yZS50cy9zcmMvdXRpbHMvT2JqZWN0LnRzXG5cdGNvbnN0IGJvdW5kQ3R4U3ltYm9sID0gU3ltYm9sLmZvcihcIm9iamVjdC5ib3VuZEN0eFwiKTtcblx0Z2xvYmFsVGhpc1tib3VuZEN0eFN5bWJvbF0gPz89IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xuXHRjb25zdCBib3VuZEN0eCA9IGdsb2JhbFRoaXNbYm91bmRDdHhTeW1ib2xdO1xuXHRjb25zdCBkZWVwT3BlcmF0ZUFuZENsb25lID0gKG9iaiwgb3BlcmF0aW9uLCAkcHJldikgPT4ge1xuXHRcdGlmIChBcnJheS5pc0FycmF5KG9iaikpIHtcblx0XHRcdGlmIChvYmouZXZlcnkoaXNDYW5KdXN0UmV0dXJuKSkgcmV0dXJuIG9iai5tYXAob3BlcmF0aW9uKTtcblx0XHRcdHJldHVybiBvYmoubWFwKCh2YWx1ZSwgaW5kZXgpID0+IGRlZXBPcGVyYXRlQW5kQ2xvbmUodmFsdWUsIG9wZXJhdGlvbiwgW29iaiwgaW5kZXhdKSk7XG5cdFx0fVxuXHRcdGlmIChvYmogaW5zdGFuY2VvZiBNYXApIHtcblx0XHRcdGNvbnN0IGVudHJpZXMgPSBBcnJheS5mcm9tKG9iai5lbnRyaWVzKCkpO1xuXHRcdFx0aWYgKGVudHJpZXMubWFwKChba2V5LCB2YWx1ZV0pID0+IHZhbHVlKS5ldmVyeShpc0Nhbkp1c3RSZXR1cm4pKSByZXR1cm4gbmV3IE1hcChlbnRyaWVzLm1hcCgoW2tleSwgdmFsdWVdKSA9PiBba2V5LCBvcGVyYXRpb24odmFsdWUsIGtleSwgb2JqKV0pKTtcblx0XHRcdHJldHVybiBuZXcgTWFwKGVudHJpZXMubWFwKChba2V5LCB2YWx1ZV0pID0+IFtrZXksIGRlZXBPcGVyYXRlQW5kQ2xvbmUodmFsdWUsIG9wZXJhdGlvbiwgW29iaiwga2V5XSldKSk7XG5cdFx0fVxuXHRcdGlmIChvYmogaW5zdGFuY2VvZiBTZXQpIHtcblx0XHRcdGNvbnN0IGVudHJpZXMgPSBBcnJheS5mcm9tKG9iai5lbnRyaWVzKCkpO1xuXHRcdFx0Y29uc3QgdmFsdWVzID0gZW50cmllcy5tYXAoKFtrZXksIHZhbHVlXSkgPT4gdmFsdWUpO1xuXHRcdFx0aWYgKGVudHJpZXMuZXZlcnkoaXNDYW5KdXN0UmV0dXJuKSkgcmV0dXJuIG5ldyBTZXQodmFsdWVzLm1hcChvcGVyYXRpb24pKTtcblx0XHRcdHJldHVybiBuZXcgU2V0KHZhbHVlcy5tYXAoKHZhbHVlKSA9PiBkZWVwT3BlcmF0ZUFuZENsb25lKHZhbHVlLCBvcGVyYXRpb24sIFtvYmosIHZhbHVlXSkpKTtcblx0XHR9XG5cdFx0aWYgKHR5cGVvZiBvYmogPT0gXCJvYmplY3RcIiAmJiBvYmo/LmNvbnN0cnVjdG9yID09IE9iamVjdCAmJiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PSBcIltvYmplY3QgT2JqZWN0XVwiKSB7XG5cdFx0XHRjb25zdCBlbnRyaWVzID0gQXJyYXkuZnJvbShPYmplY3QuZW50cmllcyhvYmopKTtcblx0XHRcdGlmIChlbnRyaWVzLm1hcCgoW2tleSwgdmFsdWVdKSA9PiB2YWx1ZSkuZXZlcnkoaXNDYW5KdXN0UmV0dXJuKSkgcmV0dXJuIE9iamVjdC5mcm9tRW50cmllcyhlbnRyaWVzLm1hcCgoW2tleSwgdmFsdWVdKSA9PiBba2V5LCBvcGVyYXRpb24odmFsdWUsIGtleSwgb2JqKV0pKTtcblx0XHRcdHJldHVybiBPYmplY3QuZnJvbUVudHJpZXMoZW50cmllcy5tYXAoKFtrZXksIHZhbHVlXSkgPT4gW2tleSwgZGVlcE9wZXJhdGVBbmRDbG9uZSh2YWx1ZSwgb3BlcmF0aW9uLCBbb2JqLCBrZXldKV0pKTtcblx0XHR9XG5cdFx0cmV0dXJuIG9wZXJhdGlvbihvYmosICRwcmV2Py5bMV0gPz8gXCJcIiwgJHByZXY/LlswXSA/PyBudWxsKTtcblx0fTtcblxuLy8jZW5kcmVnaW9uXG4vLyNyZWdpb24gLi4vY29yZS50cy9zcmMvdXRpbHMvUHJvbWlzZWQudHNcblx0Y29uc3QgcmVzb2x2ZWRNYXAgPSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcblx0Y29uc3QgaGFuZGxlZE1hcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xuXHRjb25zdCBhY3RXaXRoID0gKHByb21pc2VPclBsYWluLCBjYikgPT4ge1xuXHRcdGlmIChwcm9taXNlT3JQbGFpbiBpbnN0YW5jZW9mIFByb21pc2UgfHwgdHlwZW9mIHByb21pc2VPclBsYWluPy50aGVuID09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0aWYgKHJlc29sdmVkTWFwPy5oYXM/Lihwcm9taXNlT3JQbGFpbikpIHJldHVybiBjYihyZXNvbHZlZE1hcD8uZ2V0Py4ocHJvbWlzZU9yUGxhaW4pKTtcblx0XHRcdHJldHVybiBQcm9taXNlLnRyeT8uKGFzeW5jICgpID0+IHtcblx0XHRcdFx0Y29uc3QgaXRlbSA9IGF3YWl0IHByb21pc2VPclBsYWluO1xuXHRcdFx0XHRyZXNvbHZlZE1hcD8uc2V0Py4ocHJvbWlzZU9yUGxhaW4sIGl0ZW0pO1xuXHRcdFx0XHRyZXR1cm4gaXRlbTtcblx0XHRcdH0pPy50aGVuPy4oY2IpO1xuXHRcdH1cblx0XHRyZXR1cm4gY2IocHJvbWlzZU9yUGxhaW4pO1xuXHR9O1xuXHR2YXIgUHJvbWlzZUhhbmRsZXIgPSBjbGFzcyB7XG5cdFx0I3Jlc29sdmU7XG5cdFx0I3JlamVjdDtcblx0XHRjb25zdHJ1Y3RvcihyZXNvbHZlLCByZWplY3QpIHtcblx0XHRcdHRoaXMuI3Jlc29sdmUgPSByZXNvbHZlO1xuXHRcdFx0dGhpcy4jcmVqZWN0ID0gcmVqZWN0O1xuXHRcdH1cblx0XHRkZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIHByb3AsIGRlc2NyaXB0b3IpIHtcblx0XHRcdGlmICh1bndyYXAodGFyZ2V0KSBpbnN0YW5jZW9mIFByb21pc2UpIHJldHVybiBSZWZsZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgcHJvcCwgZGVzY3JpcHRvcik7XG5cdFx0XHRyZXR1cm4gYWN0V2l0aCh1bndyYXAodGFyZ2V0KSwgKG9iaikgPT4gUmVmbGVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIHByb3AsIGRlc2NyaXB0b3IpKTtcblx0XHR9XG5cdFx0ZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBwcm9wKSB7XG5cdFx0XHRpZiAodW53cmFwKHRhcmdldCkgaW5zdGFuY2VvZiBQcm9taXNlKSByZXR1cm4gUmVmbGVjdC5kZWxldGVQcm9wZXJ0eSh0YXJnZXQsIHByb3ApO1xuXHRcdFx0cmV0dXJuIGFjdFdpdGgodW53cmFwKHRhcmdldCksIChvYmopID0+IFJlZmxlY3QuZGVsZXRlUHJvcGVydHkob2JqLCBwcm9wKSk7XG5cdFx0fVxuXHRcdGdldFByb3RvdHlwZU9mKHRhcmdldCkge1xuXHRcdFx0aWYgKHVud3JhcCh0YXJnZXQpIGluc3RhbmNlb2YgUHJvbWlzZSkgcmV0dXJuIFJlZmxlY3QuZ2V0UHJvdG90eXBlT2YodGFyZ2V0KTtcblx0XHRcdHJldHVybiBhY3RXaXRoKHVud3JhcCh0YXJnZXQpLCAob2JqKSA9PiBSZWZsZWN0LmdldFByb3RvdHlwZU9mKG9iaikpO1xuXHRcdH1cblx0XHRzZXRQcm90b3R5cGVPZih0YXJnZXQsIHByb3RvKSB7XG5cdFx0XHRpZiAodW53cmFwKHRhcmdldCkgaW5zdGFuY2VvZiBQcm9taXNlKSByZXR1cm4gUmVmbGVjdC5zZXRQcm90b3R5cGVPZih0YXJnZXQsIHByb3RvKTtcblx0XHRcdHJldHVybiBhY3RXaXRoKHVud3JhcCh0YXJnZXQpLCAob2JqKSA9PiBSZWZsZWN0LnNldFByb3RvdHlwZU9mKG9iaiwgcHJvdG8pKTtcblx0XHR9XG5cdFx0aXNFeHRlbnNpYmxlKHRhcmdldCkge1xuXHRcdFx0aWYgKHVud3JhcCh0YXJnZXQpIGluc3RhbmNlb2YgUHJvbWlzZSkgcmV0dXJuIFJlZmxlY3QuaXNFeHRlbnNpYmxlKHRhcmdldCk7XG5cdFx0XHRyZXR1cm4gYWN0V2l0aCh1bndyYXAodGFyZ2V0KSwgKG9iaikgPT4gUmVmbGVjdC5pc0V4dGVuc2libGUob2JqKSk7XG5cdFx0fVxuXHRcdHByZXZlbnRFeHRlbnNpb25zKHRhcmdldCkge1xuXHRcdFx0aWYgKHVud3JhcCh0YXJnZXQpIGluc3RhbmNlb2YgUHJvbWlzZSkgcmV0dXJuIFJlZmxlY3Qub3duS2V5cyh0YXJnZXQpO1xuXHRcdFx0cmV0dXJuIGFjdFdpdGgodW53cmFwKHRhcmdldCksIChvYmopID0+IFJlZmxlY3QucHJldmVudEV4dGVuc2lvbnMob2JqKSk7XG5cdFx0fVxuXHRcdG93bktleXModGFyZ2V0KSB7XG5cdFx0XHRjb25zdCB1d3AgPSB1bndyYXAodGFyZ2V0KTtcblx0XHRcdGlmICh1d3AgaW5zdGFuY2VvZiBQcm9taXNlKSByZXR1cm4gT2JqZWN0LmtleXModXdwKTtcblx0XHRcdHJldHVybiBhY3RXaXRoKHV3cCwgKG9iaikgPT4ge1xuXHRcdFx0XHRyZXR1cm4gKHR5cGVvZiBvYmogPT0gXCJvYmplY3RcIiB8fCB0eXBlb2Ygb2JqID09IFwiZnVuY3Rpb25cIikgJiYgb2JqICE9IG51bGwgPyBPYmplY3Qua2V5cyhvYmopIDogW107XG5cdFx0XHR9KSA/PyBbXTtcblx0XHR9XG5cdFx0Z2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwgcHJvcCkge1xuXHRcdFx0aWYgKHVud3JhcCh0YXJnZXQpIGluc3RhbmNlb2YgUHJvbWlzZSkgcmV0dXJuIFJlZmxlY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwgcHJvcCk7XG5cdFx0XHRyZXR1cm4gYWN0V2l0aCh1bndyYXAodGFyZ2V0KSwgKG9iaikgPT4gUmVmbGVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqLCBwcm9wKSk7XG5cdFx0fVxuXHRcdGNvbnN0cnVjdCh0YXJnZXQsIGFyZ3MsIG5ld1RhcmdldCkge1xuXHRcdFx0cmV0dXJuIGFjdFdpdGgodW53cmFwKHRhcmdldCksIChjdCkgPT4gUmVmbGVjdC5jb25zdHJ1Y3QoY3QsIGFyZ3MsIG5ld1RhcmdldCkpO1xuXHRcdH1cblx0XHRoYXModGFyZ2V0LCBwcm9wKSB7XG5cdFx0XHRpZiAodW53cmFwKHRhcmdldCkgaW5zdGFuY2VvZiBQcm9taXNlKSByZXR1cm4gUmVmbGVjdC5oYXModGFyZ2V0LCBwcm9wKTtcblx0XHRcdHJldHVybiBhY3RXaXRoKHVud3JhcCh0YXJnZXQpLCAob2JqKSA9PiBSZWZsZWN0LmhhcyhvYmosIHByb3ApKTtcblx0XHR9XG5cdFx0Z2V0KHRhcmdldCwgcHJvcCwgcmVjZWl2ZXIpIHtcblx0XHRcdHRhcmdldCA9IHVud3JhcCh0YXJnZXQpO1xuXHRcdFx0aWYgKHByb3AgPT0gXCJwcm9taXNlXCIpIHJldHVybiB0YXJnZXQ7XG5cdFx0XHRpZiAocHJvcCA9PSBcInJlc29sdmVcIiAmJiB0aGlzLiNyZXNvbHZlKSByZXR1cm4gKC4uLmFyZ3MpID0+IHtcblx0XHRcdFx0Y29uc3QgcmVzdWx0ID0gdGhpcy4jcmVzb2x2ZT8uKC4uLmFyZ3MpO1xuXHRcdFx0XHR0aGlzLiNyZXNvbHZlID0gbnVsbDtcblx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdH07XG5cdFx0XHRpZiAocHJvcCA9PSBcInJlamVjdFwiICYmIHRoaXMuI3JlamVjdCkgcmV0dXJuICguLi5hcmdzKSA9PiB7XG5cdFx0XHRcdGNvbnN0IHJlc3VsdCA9IHRoaXMuI3JlamVjdD8uKC4uLmFyZ3MpO1xuXHRcdFx0XHR0aGlzLiNyZWplY3QgPSBudWxsO1xuXHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0fTtcblx0XHRcdGlmIChwcm9wID09IFwidGhlblwiIHx8IHByb3AgPT0gXCJjYXRjaFwiIHx8IHByb3AgPT0gXCJmaW5hbGx5XCIpIHtcblx0XHRcdFx0aWYgKHRhcmdldCBpbnN0YW5jZW9mIFByb21pc2UpIHJldHVybiB0YXJnZXQ/Lltwcm9wXT8uYmluZD8uKHRhcmdldCk7XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdGNvbnN0ICR0bXAgPSBQcm9taXNlLnRyeSgoKSA9PiB0YXJnZXQpO1xuXHRcdFx0XHRcdHJldHVybiAkdG1wPy5bcHJvcF0/LmJpbmQ/LigkdG1wKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0bGV0IHJlc3VsdCA9IHZvaWQgMDtcblx0XHRcdGlmIChyZXNvbHZlZE1hcD8uaGFzPy4odGFyZ2V0KSAmJiAocmVzdWx0ID0gcmVzb2x2ZWRNYXA/LmdldD8uKHRhcmdldCkpPy5bcHJvcF0gIT0gbnVsbCkgcmVzdWx0ID0gcmVzb2x2ZWRNYXA/LmdldD8uKHRhcmdldCk/Lltwcm9wXTtcblx0XHRcdGVsc2UgcmVzdWx0ID0gUHJvbWlzZWQoYWN0V2l0aCh0YXJnZXQsIGFzeW5jIChvYmopID0+IHtcblx0XHRcdFx0aWYgKHVud3JhcChvYmopIGluc3RhbmNlb2YgUHJvbWlzZSkgcmV0dXJuIFJlZmxlY3QuZ2V0KG9iaiwgcHJvcCwgcmVjZWl2ZXIpO1xuXHRcdFx0XHRpZiAoaXNQcmltaXRpdmUob2JqKSkgcmV0dXJuIHByb3AgPT0gU3ltYm9sLnRvUHJpbWl0aXZlIHx8IHByb3AgPT0gU3ltYm9sLnRvU3RyaW5nVGFnID8gb2JqIDogdm9pZCAwO1xuXHRcdFx0XHRsZXQgdmFsdWUgPSB2b2lkIDA7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0dmFsdWUgPSBSZWZsZWN0LmdldChvYmosIHByb3AsIHJlY2VpdmVyKTtcblx0XHRcdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0XHRcdHZhbHVlID0gdGFyZ2V0Py5bcHJvcF07XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHR5cGVvZiB2YWx1ZSA9PSBcImZ1bmN0aW9uXCIpIHJldHVybiB2YWx1ZT8uYmluZD8uKG9iaik7XG5cdFx0XHRcdHJldHVybiB2YWx1ZTtcblx0XHRcdH0pKTtcblx0XHRcdGlmIChwcm9wID09IFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdFx0XHRpZiAoaXNQcmltaXRpdmUocmVzdWx0KSkgcmV0dXJuIFN0cmluZyhyZXN1bHQgPz8gXCJcIikgfHwgXCJcIjtcblx0XHRcdFx0cmV0dXJuIHJlc3VsdD8uW1N5bWJvbC50b1N0cmluZ1RhZ10/LigpIHx8IFN0cmluZyhyZXN1bHQgPz8gXCJcIikgfHwgXCJcIjtcblx0XHRcdH1cblx0XHRcdGlmIChwcm9wID09IFN5bWJvbC50b1ByaW1pdGl2ZSkgcmV0dXJuIChoaW50KSA9PiB7XG5cdFx0XHRcdGlmIChpc1ByaW1pdGl2ZShyZXN1bHQpKSByZXR1cm4gdHJ5UGFyc2VCeUhpbnQocmVzdWx0LCBoaW50KTtcblx0XHRcdH07XG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH1cblx0XHRzZXQodGFyZ2V0LCBwcm9wLCB2YWx1ZSkge1xuXHRcdFx0cmV0dXJuIGFjdFdpdGgodW53cmFwKHRhcmdldCksIChvYmopID0+IFJlZmxlY3Quc2V0KG9iaiwgcHJvcCwgdmFsdWUpKTtcblx0XHR9XG5cdFx0YXBwbHkodGFyZ2V0LCB0aGlzQXJnLCBhcmdzKSB7XG5cdFx0XHRpZiAodGhpcy4jcmVzb2x2ZSkge1xuXHRcdFx0XHRjb25zdCByZXN1bHQgPSB0aGlzLiNyZXNvbHZlPy4oLi4uYXJncyk7XG5cdFx0XHRcdHRoaXMuI3Jlc29sdmUgPSBudWxsO1xuXHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGFjdFdpdGgodW53cmFwKHRhcmdldCwgdGhpcy4jcmVzb2x2ZSksIChvYmopID0+IHtcblx0XHRcdFx0aWYgKHR5cGVvZiBvYmogPT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRcdFx0aWYgKHVud3JhcChvYmopIGluc3RhbmNlb2YgUHJvbWlzZSkgcmV0dXJuIFJlZmxlY3QuYXBwbHkob2JqLCB0aGlzQXJnLCBhcmdzKTtcblx0XHRcdFx0XHRyZXR1cm4gUmVmbGVjdC5hcHBseShvYmosIHRoaXNBcmcsIGFyZ3MpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cdH07XG5cdC8qKlxuXHQqIFdyYXAgYSBwcm9taXNlIG9yIHZhbHVlIGluIGEgUHJveHkgdGhhdCBhbGxvd3Mgc3luY2hyb25vdXMgcHJvcGVydHkgYWNjZXNzLlxuXHQqIEZvciByZXNvbHZlZCBwcm9taXNlcywgdGhpcyBlbmFibGVzIGFjY2Vzc2luZyBwcm9wZXJ0aWVzIGFzIGlmIHRoZSBwcm9taXNlIHdhcyBhbHJlYWR5IHJlc29sdmVkLlxuXHQqIEB0ZW1wbGF0ZSBUIC0gVGhlIHJlc29sdmVkIHZhbHVlIHR5cGVcblx0KiBAcGFyYW0gcHJvbWlzZSAtIFRoZSBwcm9taXNlIG9yIHZhbHVlIHRvIHdyYXBcblx0KiBAcGFyYW0gcmVzb2x2ZSAtIE9wdGlvbmFsIHJlc29sdmUgY2FsbGJhY2tcblx0KiBAcGFyYW0gcmVqZWN0IC0gT3B0aW9uYWwgcmVqZWN0IGNhbGxiYWNrXG5cdCogQHJldHVybnMgQSBwcm94eSB0aGF0IGFsbG93cyBzeW5jaHJvbm91cy1zdHlsZSBhY2Nlc3MgdG8gcHJvbWlzZSB2YWx1ZXNcblx0Ki9cblx0ZnVuY3Rpb24gUHJvbWlzZWQocHJvbWlzZSwgcmVzb2x2ZSwgcmVqZWN0KSB7XG5cdFx0aWYgKCEocHJvbWlzZSBpbnN0YW5jZW9mIFByb21pc2UgfHwgdHlwZW9mIHByb21pc2U/LnRoZW4gPT0gXCJmdW5jdGlvblwiKSkgcmV0dXJuIHByb21pc2U7XG5cdFx0aWYgKHJlc29sdmVkTWFwPy5oYXM/Lihwcm9taXNlKSkgcmV0dXJuIHJlc29sdmVkTWFwPy5nZXQ/Lihwcm9taXNlKTtcblx0XHRpZiAoIWhhbmRsZWRNYXA/Lmhhcz8uKHByb21pc2UpKSBwcm9taXNlPy50aGVuPy4oKGl0ZW0pID0+IHJlc29sdmVkTWFwPy5zZXQ/Lihwcm9taXNlLCBpdGVtKSk7XG5cdFx0cmV0dXJuIGhhbmRsZWRNYXA/LmdldE9ySW5zZXJ0Q29tcHV0ZWQ/Lihwcm9taXNlLCAoKSA9PiBuZXcgUHJveHkoZml4RngocHJvbWlzZSksIG5ldyBQcm9taXNlSGFuZGxlcihyZXNvbHZlLCByZWplY3QpKSk7XG5cdH1cblxuLy8jZW5kcmVnaW9uXG4vLyNyZWdpb24gLi4vdW5pZm9ybS50cy9zcmMvbmV3ZXIvbmV4dC9vYnNlcnZhYmxlL09ic2VydmFibGUudHNcblx0dmFyIEJhc2VTdWJzY3JpcHRpb24gPSBjbGFzcyB7XG5cdFx0X3Vuc3Vic2NyaWJlO1xuXHRcdF9jbG9zZWQgPSBmYWxzZTtcblx0XHRjb25zdHJ1Y3RvcihfdW5zdWJzY3JpYmUpIHtcblx0XHRcdHRoaXMuX3Vuc3Vic2NyaWJlID0gX3Vuc3Vic2NyaWJlO1xuXHRcdH1cblx0XHRnZXQgY2xvc2VkKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2Nsb3NlZDtcblx0XHR9XG5cdFx0dW5zdWJzY3JpYmUoKSB7XG5cdFx0XHRpZiAoIXRoaXMuX2Nsb3NlZCkge1xuXHRcdFx0XHR0aGlzLl9jbG9zZWQgPSB0cnVlO1xuXHRcdFx0XHR0aGlzLl91bnN1YnNjcmliZSgpO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblx0LyoqXG5cdCogQ29yZSBPYnNlcnZhYmxlIHdpdGggcHJvZHVjZXIgZnVuY3Rpb25cblx0Ki9cblx0dmFyIE9ic2VydmFibGUgPSBjbGFzcyB7XG5cdFx0X3Byb2R1Y2VyO1xuXHRcdGNvbnN0cnVjdG9yKF9wcm9kdWNlcikge1xuXHRcdFx0dGhpcy5fcHJvZHVjZXIgPSBfcHJvZHVjZXI7XG5cdFx0fVxuXHRcdHN1YnNjcmliZShvYnNlcnZlck9yTmV4dCwgb3B0cykge1xuXHRcdFx0Y29uc3Qgb2JzZXJ2ZXIgPSB0eXBlb2Ygb2JzZXJ2ZXJPck5leHQgPT09IFwiZnVuY3Rpb25cIiA/IHsgbmV4dDogb2JzZXJ2ZXJPck5leHQgfSA6IG9ic2VydmVyT3JOZXh0ID8/IHt9O1xuXHRcdFx0Y29uc3QgY3RybCA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKTtcblx0XHRcdG9wdHM/LnNpZ25hbD8uYWRkRXZlbnRMaXN0ZW5lcihcImFib3J0XCIsICgpID0+IGN0cmwuYWJvcnQoKSk7XG5cdFx0XHRsZXQgYWN0aXZlID0gdHJ1ZTtcblx0XHRcdGxldCBjbGVhbnVwO1xuXHRcdFx0Y29uc3QgZG9DbGVhbnVwID0gKCkgPT4ge1xuXHRcdFx0XHRhY3RpdmUgPSBmYWxzZTtcblx0XHRcdFx0Y3RybC5hYm9ydCgpO1xuXHRcdFx0XHRjbGVhbnVwPy4oKTtcblx0XHRcdH07XG5cdFx0XHRjb25zdCBzdWJzY3JpYmVyID0ge1xuXHRcdFx0XHRuZXh0OiAodikgPT4gYWN0aXZlICYmIG9ic2VydmVyLm5leHQ/Lih2KSxcblx0XHRcdFx0ZXJyb3I6IChlKSA9PiB7XG5cdFx0XHRcdFx0aWYgKGFjdGl2ZSkge1xuXHRcdFx0XHRcdFx0b2JzZXJ2ZXIuZXJyb3I/LihlKTtcblx0XHRcdFx0XHRcdGRvQ2xlYW51cCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0Y29tcGxldGU6ICgpID0+IHtcblx0XHRcdFx0XHRpZiAoYWN0aXZlKSB7XG5cdFx0XHRcdFx0XHRvYnNlcnZlci5jb21wbGV0ZT8uKCk7XG5cdFx0XHRcdFx0XHRkb0NsZWFudXAoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHNpZ25hbDogY3RybC5zaWduYWwsXG5cdFx0XHRcdGdldCBhY3RpdmUoKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGFjdGl2ZSAmJiAhY3RybC5zaWduYWwuYWJvcnRlZDtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdGNsZWFudXAgPSB0aGlzLl9wcm9kdWNlcihzdWJzY3JpYmVyKTtcblx0XHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdFx0c3Vic2NyaWJlci5lcnJvcihlKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBuZXcgQmFzZVN1YnNjcmlwdGlvbihkb0NsZWFudXApO1xuXHRcdH1cblx0XHRwaXBlKC4uLm9wcykge1xuXHRcdFx0cmV0dXJuIG9wcy5yZWR1Y2UoKHMsIG9wKSA9PiBvcChzKSwgdGhpcyk7XG5cdFx0fVxuXHR9O1xuXHQvKipcblx0KiBTdWJqZWN0IC0gT2JzZXJ2YWJsZSB0aGF0IGNhbiBiZSBwdXNoZWQgdG9cblx0Ki9cblx0dmFyIENoYW5uZWxTdWJqZWN0ID0gY2xhc3Mge1xuXHRcdF9zdWJzID0gLyogQF9fUFVSRV9fICovIG5ldyBTZXQoKTtcblx0XHRfYnVmZmVyID0gW107XG5cdFx0X21heEJ1ZmZlcjtcblx0XHRfcmVwbGF5O1xuXHRcdGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuXHRcdFx0dGhpcy5fbWF4QnVmZmVyID0gb3B0aW9ucy5idWZmZXJTaXplID8/IDA7XG5cdFx0XHR0aGlzLl9yZXBsYXkgPSBvcHRpb25zLnJlcGxheU9uU3Vic2NyaWJlID8/IGZhbHNlO1xuXHRcdH1cblx0XHRuZXh0KHZhbHVlKSB7XG5cdFx0XHRpZiAodGhpcy5fbWF4QnVmZmVyID4gMCkge1xuXHRcdFx0XHR0aGlzLl9idWZmZXIucHVzaCh2YWx1ZSk7XG5cdFx0XHRcdGlmICh0aGlzLl9idWZmZXIubGVuZ3RoID4gdGhpcy5fbWF4QnVmZmVyKSB0aGlzLl9idWZmZXIuc2hpZnQoKTtcblx0XHRcdH1cblx0XHRcdGZvciAoY29uc3QgcyBvZiB0aGlzLl9zdWJzKSB0cnkge1xuXHRcdFx0XHRzLm5leHQ/Lih2YWx1ZSk7XG5cdFx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRcdHMuZXJyb3I/LihlKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZXJyb3IoZXJyKSB7XG5cdFx0XHRmb3IgKGNvbnN0IHMgb2YgdGhpcy5fc3Vicykgcy5lcnJvcj8uKGVycik7XG5cdFx0fVxuXHRcdGNvbXBsZXRlKCkge1xuXHRcdFx0Zm9yIChjb25zdCBzIG9mIHRoaXMuX3N1YnMpIHMuY29tcGxldGU/LigpO1xuXHRcdFx0dGhpcy5fc3Vicy5jbGVhcigpO1xuXHRcdH1cblx0XHRzdWJzY3JpYmUob2JzZXJ2ZXJPck5leHQpIHtcblx0XHRcdGNvbnN0IG9icyA9IHR5cGVvZiBvYnNlcnZlck9yTmV4dCA9PT0gXCJmdW5jdGlvblwiID8geyBuZXh0OiBvYnNlcnZlck9yTmV4dCB9IDogb2JzZXJ2ZXJPck5leHQ7XG5cdFx0XHR0aGlzLl9zdWJzLmFkZChvYnMpO1xuXHRcdFx0aWYgKHRoaXMuX3JlcGxheSkgZm9yIChjb25zdCB2IG9mIHRoaXMuX2J1ZmZlcikgdHJ5IHtcblx0XHRcdFx0b2JzLm5leHQ/Lih2KTtcblx0XHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdFx0b2JzLmVycm9yPy4oZSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gbmV3IEJhc2VTdWJzY3JpcHRpb24oKCkgPT4ge1xuXHRcdFx0XHR0aGlzLl9zdWJzLmRlbGV0ZShvYnMpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdGdldFZhbHVlKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2J1ZmZlci5hdCgtMSk7XG5cdFx0fVxuXHRcdGdldEJ1ZmZlcigpIHtcblx0XHRcdHJldHVybiBbLi4udGhpcy5fYnVmZmVyXTtcblx0XHR9XG5cdFx0Z2V0IHN1YnNjcmliZXJDb3VudCgpIHtcblx0XHRcdHJldHVybiB0aGlzLl9zdWJzLnNpemU7XG5cdFx0fVxuXHR9O1xuXHRjb25zdCBmaWx0ZXIgPSAocHJlZCkgPT4gKHNyYykgPT4gbmV3IE9ic2VydmFibGUoKHN1YikgPT4ge1xuXHRcdGNvbnN0IHMgPSBzcmMuc3Vic2NyaWJlKHtcblx0XHRcdG5leHQ6ICh2KSA9PiBwcmVkKHYpICYmIHN1Yi5uZXh0KHYpLFxuXHRcdFx0ZXJyb3I6IChlKSA9PiBzdWIuZXJyb3IoZSksXG5cdFx0XHRjb21wbGV0ZTogKCkgPT4gc3ViLmNvbXBsZXRlKClcblx0XHR9KTtcblx0XHRyZXR1cm4gKCkgPT4gcy51bnN1YnNjcmliZSgpO1xuXHR9KTtcblxuLy8jZW5kcmVnaW9uXG4vLyNyZWdpb24gLi4vdW5pZm9ybS50cy9zcmMvbmV3ZXIvbmV4dC9wcm94eS9JbnZva2VyLnRzXG5cdGZ1bmN0aW9uIGRldGVjdENvbnRleHRUeXBlKCkge1xuXHRcdGlmICh0eXBlb2YgZ2xvYmFsVGhpcy5EZW5vICE9PSBcInVuZGVmaW5lZFwiKSByZXR1cm4gXCJkZW5vXCI7XG5cdFx0aWYgKHR5cGVvZiBnbG9iYWxUaGlzLnByb2Nlc3MgIT09IFwidW5kZWZpbmVkXCIgJiYgZ2xvYmFsVGhpcy5wcm9jZXNzPy52ZXJzaW9ucz8ubm9kZSkgcmV0dXJuIFwibm9kZVwiO1xuXHRcdGNvbnN0IHNlcnZpY2VXb3JrZXJTY29wZSA9IGdsb2JhbFRoaXMuU2VydmljZVdvcmtlckdsb2JhbFNjb3BlO1xuXHRcdGNvbnN0IHNoYXJlZFdvcmtlclNjb3BlID0gZ2xvYmFsVGhpcy5TaGFyZWRXb3JrZXJHbG9iYWxTY29wZTtcblx0XHRjb25zdCBkZWRpY2F0ZWRXb3JrZXJTY29wZSA9IGdsb2JhbFRoaXMuRGVkaWNhdGVkV29ya2VyR2xvYmFsU2NvcGU7XG5cdFx0aWYgKHNlcnZpY2VXb3JrZXJTY29wZSAmJiBzZWxmIGluc3RhbmNlb2Ygc2VydmljZVdvcmtlclNjb3BlKSByZXR1cm4gXCJzZXJ2aWNlLXdvcmtlclwiO1xuXHRcdGlmIChzaGFyZWRXb3JrZXJTY29wZSAmJiBzZWxmIGluc3RhbmNlb2Ygc2hhcmVkV29ya2VyU2NvcGUpIHJldHVybiBcInNoYXJlZC13b3JrZXJcIjtcblx0XHRpZiAoZGVkaWNhdGVkV29ya2VyU2NvcGUgJiYgc2VsZiBpbnN0YW5jZW9mIGRlZGljYXRlZFdvcmtlclNjb3BlKSByZXR1cm4gXCJ3b3JrZXJcIjtcblx0XHRpZiAodHlwZW9mIGNocm9tZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBjaHJvbWUucnVudGltZT8uaWQpIHtcblx0XHRcdGlmICh0eXBlb2YgY2hyb21lLnJ1bnRpbWUuZ2V0QmFja2dyb3VuZFBhZ2UgPT09IFwiZnVuY3Rpb25cIiB8fCAoY2hyb21lLnJ1bnRpbWUuZ2V0TWFuaWZlc3Q/LigpPy5iYWNrZ3JvdW5kKT8uc2VydmljZV93b3JrZXIpIHJldHVybiBcImNocm9tZS1iYWNrZ3JvdW5kXCI7XG5cdFx0XHRpZiAodHlwZW9mIGNocm9tZS5kZXZ0b29scyAhPT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuIFwiY2hyb21lLWRldnRvb2xzXCI7XG5cdFx0XHRpZiAodHlwZW9mIGRvY3VtZW50ICE9PSBcInVuZGVmaW5lZFwiICYmIGdsb2JhbFRoaXM/LmxvY2F0aW9uPy5wcm90b2NvbCA9PT0gXCJjaHJvbWUtZXh0ZW5zaW9uOlwiKSB7XG5cdFx0XHRcdGlmICgoY2hyb21lLmV4dGVuc2lvbj8uZ2V0Vmlld3M/Lih7IHR5cGU6IFwicG9wdXBcIiB9KSA/PyBbXSkuaW5jbHVkZXMoZ2xvYmFsVGhpcykpIHJldHVybiBcImNocm9tZS1wb3B1cFwiO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBnbG9iYWxUaGlzPy5sb2NhdGlvbj8ucHJvdG9jb2wgIT09IFwiY2hyb21lLWV4dGVuc2lvbjpcIikgcmV0dXJuIFwiY2hyb21lLWNvbnRlbnRcIjtcblx0XHR9XG5cdFx0aWYgKHR5cGVvZiBnbG9iYWxUaGlzICE9PSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiBkb2N1bWVudCAhPT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuIFwid2luZG93XCI7XG5cdFx0cmV0dXJuIFwidW5rbm93blwiO1xuXHR9XG5cdGZ1bmN0aW9uIGRldGVjdFRyYW5zcG9ydFR5cGUoc291cmNlKSB7XG5cdFx0aWYgKHR5cGVvZiBSVENEYXRhQ2hhbm5lbCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBzb3VyY2UgaW5zdGFuY2VvZiBSVENEYXRhQ2hhbm5lbCkgcmV0dXJuIFwicnRjLWRhdGFcIjtcblx0XHRjb25zdCBkZXRlY3RlZCA9IGRldGVjdFRyYW5zcG9ydFR5cGUkMShzb3VyY2UpO1xuXHRcdGlmIChkZXRlY3RlZCAmJiBkZXRlY3RlZCAhPT0gXCJpbnRlcm5hbFwiKSByZXR1cm4gZGV0ZWN0ZWQ7XG5cdFx0aWYgKHNvdXJjZSA9PT0gc2VsZiB8fCBzb3VyY2UgPT09IGdsb2JhbFRoaXMgfHwgc291cmNlID09PSBcInNlbGZcIikgcmV0dXJuIFwic2VsZlwiO1xuXHRcdHJldHVybiBcImludGVybmFsXCI7XG5cdH1cblx0ZnVuY3Rpb24gZGV0ZWN0SW5jb21pbmdDb250ZXh0VHlwZShkYXRhKSB7XG5cdFx0aWYgKCFkYXRhKSByZXR1cm4gXCJ1bmtub3duXCI7XG5cdFx0aWYgKGRhdGEuY29udGV4dFR5cGUpIHJldHVybiBkYXRhLmNvbnRleHRUeXBlO1xuXHRcdGNvbnN0IHNlbmRlciA9IGRhdGEuc2VuZGVyID8/IFwiXCI7XG5cdFx0aWYgKHNlbmRlci5pbmNsdWRlcyhcIndvcmtlclwiKSkgcmV0dXJuIFwid29ya2VyXCI7XG5cdFx0aWYgKHNlbmRlci5pbmNsdWRlcyhcInN3XCIpIHx8IHNlbmRlci5pbmNsdWRlcyhcInNlcnZpY2VcIikpIHJldHVybiBcInNlcnZpY2Utd29ya2VyXCI7XG5cdFx0aWYgKHNlbmRlci5pbmNsdWRlcyhcImNocm9tZVwiKSB8fCBzZW5kZXIuaW5jbHVkZXMoXCJjcnhcIikpIHJldHVybiBcImNocm9tZS1jb250ZW50XCI7XG5cdFx0aWYgKHNlbmRlci5pbmNsdWRlcyhcImJhY2tncm91bmRcIikpIHJldHVybiBcImNocm9tZS1iYWNrZ3JvdW5kXCI7XG5cdFx0cmV0dXJuIFwidW5rbm93blwiO1xuXHR9XG5cdGNvbnN0IERlZmF1bHRSZWZsZWN0ID0ge1xuXHRcdGdldDogKHRhcmdldCwgcHJvcCkgPT4gUmVmbGVjdC5nZXQodGFyZ2V0LCBwcm9wKSxcblx0XHRzZXQ6ICh0YXJnZXQsIHByb3AsIHZhbHVlKSA9PiBSZWZsZWN0LnNldCh0YXJnZXQsIHByb3AsIHZhbHVlKSxcblx0XHRoYXM6ICh0YXJnZXQsIHByb3ApID0+IFJlZmxlY3QuaGFzKHRhcmdldCwgcHJvcCksXG5cdFx0YXBwbHk6ICh0YXJnZXQsIHRoaXNBcmcsIGFyZ3MpID0+IFJlZmxlY3QuYXBwbHkodGFyZ2V0LCB0aGlzQXJnLCBhcmdzKSxcblx0XHRjb25zdHJ1Y3Q6ICh0YXJnZXQsIGFyZ3MpID0+IFJlZmxlY3QuY29uc3RydWN0KHRhcmdldCwgYXJncyksXG5cdFx0ZGVsZXRlUHJvcGVydHk6ICh0YXJnZXQsIHByb3ApID0+IFJlZmxlY3QuZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBwcm9wKSxcblx0XHRvd25LZXlzOiAodGFyZ2V0KSA9PiBSZWZsZWN0Lm93bktleXModGFyZ2V0KSxcblx0XHRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I6ICh0YXJnZXQsIHByb3ApID0+IFJlZmxlY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwgcHJvcCksXG5cdFx0Z2V0UHJvdG90eXBlT2Y6ICh0YXJnZXQpID0+IFJlZmxlY3QuZ2V0UHJvdG90eXBlT2YodGFyZ2V0KSxcblx0XHRzZXRQcm90b3R5cGVPZjogKHRhcmdldCwgcHJvdG8pID0+IFJlZmxlY3Quc2V0UHJvdG90eXBlT2YodGFyZ2V0LCBwcm90byksXG5cdFx0aXNFeHRlbnNpYmxlOiAodGFyZ2V0KSA9PiBSZWZsZWN0LmlzRXh0ZW5zaWJsZSh0YXJnZXQpLFxuXHRcdHByZXZlbnRFeHRlbnNpb25zOiAodGFyZ2V0KSA9PiBSZWZsZWN0LnByZXZlbnRFeHRlbnNpb25zKHRhcmdldClcblx0fTtcblxuLy8jZW5kcmVnaW9uXG4vLyNyZWdpb24gLi4vdW5pZm9ybS50cy9zcmMvbmV3ZXIvbmV4dC9wcm94eS9Qcm94eS50c1xuLyoqXG5cdCogUHJveHkgLSBVbmlmaWVkIFJlbW90ZSBQcm94eSBDcmVhdGlvblxuXHQqXG5cdCogU2luZ2xlIHNvdXJjZSBvZiB0cnV0aCBmb3IgYWxsIHByb3h5LXJlbGF0ZWQgZnVuY3Rpb25hbGl0eTpcblx0KiAtIFJlbW90ZSBvYmplY3QgcHJveGllcyAodHJhbnNwYXJlbnQgUlBDKVxuXHQqIC0gRGVzY3JpcHRvci1iYXNlZCBwcm94aWVzXG5cdCogLSBUeXBlLXNhZmUgcHJveHkgY3JlYXRpb25cblx0KiAtIEV4cG9zZS9saXN0ZW4gcGF0dGVybnNcblx0Ki9cblx0LyoqIFN5bWJvbCB0byBpZGVudGlmeSBwcm94eSBvYmplY3RzICovXG5cdGNvbnN0IFBST1hZX01BUktFUiA9IFN5bWJvbC5mb3IoXCJ1bmlmb3JtLnByb3h5XCIpO1xuXHQvKiogU3ltYm9sIHRvIGFjY2VzcyBwcm94eSBpbnRlcm5hbHMgKi9cblx0Y29uc3QgUFJPWFlfSU5URVJOQUxTID0gU3ltYm9sLmZvcihcInVuaWZvcm0ucHJveHkuaW50ZXJuYWxzXCIpO1xuXHQvKipcblx0KiBSZW1vdGVQcm94eUhhbmRsZXIgLSBVbmlmaWVkIHByb3h5IGhhbmRsZXIgZm9yIHJlbW90ZSBpbnZvY2F0aW9uXG5cdCpcblx0KiBIYW5kbGVzIGFsbCBSZWZsZWN0IG9wZXJhdGlvbnMgYW5kIGZvcndhcmRzIHRoZW0gdG8gdGhlIGludm9rZXIuXG5cdCovXG5cdHZhciBSZW1vdGVQcm94eUhhbmRsZXIgPSBjbGFzcyB7XG5cdFx0X2ludm9rZXI7XG5cdFx0X2NvbmZpZztcblx0XHRfY2hpbGRDYWNoZSA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG5cdFx0Y29uc3RydWN0b3IoX2ludm9rZXIsIGNvbmZpZykge1xuXHRcdFx0dGhpcy5faW52b2tlciA9IF9pbnZva2VyO1xuXHRcdFx0dGhpcy5fY29uZmlnID0ge1xuXHRcdFx0XHRjaGFubmVsOiBjb25maWcuY2hhbm5lbCxcblx0XHRcdFx0YmFzZVBhdGg6IGNvbmZpZy5iYXNlUGF0aCA/PyBbXSxcblx0XHRcdFx0aW52b2tlcjogX2ludm9rZXIsXG5cdFx0XHRcdGNhY2hlOiBjb25maWcuY2FjaGUgPz8gdHJ1ZSxcblx0XHRcdFx0dGltZW91dDogY29uZmlnLnRpbWVvdXQgPz8gM2U0XG5cdFx0XHR9O1xuXHRcdH1cblx0XHQvKiogR2V0IHByb3BlcnR5IC0gcmV0dXJucyBuZXN0ZWQgcHJveHkgb3IgaW52b2tlcyBHRVQgKi9cblx0XHRnZXQodGFyZ2V0LCBwcm9wLCByZWNlaXZlcikge1xuXHRcdFx0Y29uc3QgcHJvcFN0ciA9IFN0cmluZyhwcm9wKTtcblx0XHRcdGlmIChwcm9wID09PSBQUk9YWV9NQVJLRVIpIHJldHVybiB0cnVlO1xuXHRcdFx0aWYgKHByb3AgPT09IFBST1hZX0lOVEVSTkFMUykgcmV0dXJuIHRoaXMuX2NvbmZpZztcblx0XHRcdGlmIChwcm9wID09PSAkcmVxdWVzdEhhbmRsZXIpIHJldHVybiB0cnVlO1xuXHRcdFx0aWYgKHByb3AgPT09ICRkZXNjcmlwdG9yKSByZXR1cm4gdGhpcy5fZ2V0RGVzY3JpcHRvcigpO1xuXHRcdFx0aWYgKHByb3AgPT09IFwidGhlblwiIHx8IHByb3AgPT09IFwiY2F0Y2hcIiB8fCBwcm9wID09PSBcImZpbmFsbHlcIikgcmV0dXJuIHZvaWQgMDtcblx0XHRcdGlmICh0eXBlb2YgcHJvcCA9PT0gXCJzeW1ib2xcIikgcmV0dXJuIHZvaWQgMDtcblx0XHRcdGlmIChwcm9wID09PSBcIiRwYXRoXCIpIHJldHVybiB0aGlzLl9jb25maWcuYmFzZVBhdGg7XG5cdFx0XHRpZiAocHJvcCA9PT0gXCIkY2hhbm5lbFwiKSByZXR1cm4gdGhpcy5fY29uZmlnLmNoYW5uZWw7XG5cdFx0XHRpZiAocHJvcCA9PT0gXCIkZGVzY3JpcHRvclwiKSByZXR1cm4gdGhpcy5fZ2V0RGVzY3JpcHRvcigpO1xuXHRcdFx0aWYgKHByb3AgPT09IFwiJGludm9rZVwiKSByZXR1cm4gdGhpcy5faW52b2tlcjtcblx0XHRcdGNvbnN0IGNoaWxkUGF0aCA9IFsuLi50aGlzLl9jb25maWcuYmFzZVBhdGgsIHByb3BTdHJdO1xuXHRcdFx0aWYgKHRoaXMuX2NvbmZpZy5jYWNoZSAmJiB0aGlzLl9jaGlsZENhY2hlLmhhcyhwcm9wU3RyKSkgcmV0dXJuIHRoaXMuX2NoaWxkQ2FjaGUuZ2V0KHByb3BTdHIpO1xuXHRcdFx0Y29uc3QgY2hpbGRQcm94eSA9IGNyZWF0ZVJlbW90ZVByb3h5KHRoaXMuX2ludm9rZXIsIHtcblx0XHRcdFx0Li4udGhpcy5fY29uZmlnLFxuXHRcdFx0XHRiYXNlUGF0aDogY2hpbGRQYXRoXG5cdFx0XHR9KTtcblx0XHRcdGlmICh0aGlzLl9jb25maWcuY2FjaGUpIHRoaXMuX2NoaWxkQ2FjaGUuc2V0KHByb3BTdHIsIGNoaWxkUHJveHkpO1xuXHRcdFx0cmV0dXJuIGNoaWxkUHJveHk7XG5cdFx0fVxuXHRcdC8qKiBTZXQgcHJvcGVydHkgKi9cblx0XHRzZXQodGFyZ2V0LCBwcm9wLCB2YWx1ZSwgcmVjZWl2ZXIpIHtcblx0XHRcdGlmICh0eXBlb2YgcHJvcCA9PT0gXCJzeW1ib2xcIikgcmV0dXJuIHRydWU7XG5cdFx0XHR0aGlzLl9pbnZva2VyKFdSZWZsZWN0QWN0aW9uLlNFVCwgWy4uLnRoaXMuX2NvbmZpZy5iYXNlUGF0aCwgU3RyaW5nKHByb3ApXSwgW3ZhbHVlXSk7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0LyoqIEFwcGx5IGZ1bmN0aW9uICovXG5cdFx0YXBwbHkodGFyZ2V0LCB0aGlzQXJnLCBhcmdzKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5faW52b2tlcihXUmVmbGVjdEFjdGlvbi5BUFBMWSwgdGhpcy5fY29uZmlnLmJhc2VQYXRoLCBbYXJnc10pO1xuXHRcdH1cblx0XHQvKiogQ29uc3RydWN0IG5ldyBpbnN0YW5jZSAqL1xuXHRcdGNvbnN0cnVjdCh0YXJnZXQsIGFyZ3MsIG5ld1RhcmdldCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2ludm9rZXIoV1JlZmxlY3RBY3Rpb24uQ09OU1RSVUNULCB0aGlzLl9jb25maWcuYmFzZVBhdGgsIFthcmdzXSk7XG5cdFx0fVxuXHRcdC8qKiBDaGVjayBpZiBwcm9wZXJ0eSBleGlzdHMgKi9cblx0XHRoYXModGFyZ2V0LCBwcm9wKSB7XG5cdFx0XHRpZiAodHlwZW9mIHByb3AgPT09IFwic3ltYm9sXCIpIHJldHVybiBmYWxzZTtcblx0XHRcdHJldHVybiB0aGlzLl9pbnZva2VyKFdSZWZsZWN0QWN0aW9uLkhBUywgdGhpcy5fY29uZmlnLmJhc2VQYXRoLCBbcHJvcF0pO1xuXHRcdH1cblx0XHQvKiogRGVsZXRlIHByb3BlcnR5ICovXG5cdFx0ZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBwcm9wKSB7XG5cdFx0XHRpZiAodHlwZW9mIHByb3AgPT09IFwic3ltYm9sXCIpIHJldHVybiB0cnVlO1xuXHRcdFx0cmV0dXJuIHRoaXMuX2ludm9rZXIoV1JlZmxlY3RBY3Rpb24uREVMRVRFX1BST1BFUlRZLCBbLi4udGhpcy5fY29uZmlnLmJhc2VQYXRoLCBTdHJpbmcocHJvcCldLCBbXSk7XG5cdFx0fVxuXHRcdC8qKiBHZXQgb3duIGtleXMgKi9cblx0XHRvd25LZXlzKHRhcmdldCkge1xuXHRcdFx0cmV0dXJuIFtdO1xuXHRcdH1cblx0XHQvKiogR2V0IHByb3BlcnR5IGRlc2NyaXB0b3IgKi9cblx0XHRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBwcm9wKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRjb25maWd1cmFibGU6IHRydWUsXG5cdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0XHRcdHdyaXRhYmxlOiB0cnVlXG5cdFx0XHR9O1xuXHRcdH1cblx0XHQvKiogR2V0IHByb3RvdHlwZSAqL1xuXHRcdGdldFByb3RvdHlwZU9mKHRhcmdldCkge1xuXHRcdFx0cmV0dXJuIEZ1bmN0aW9uLnByb3RvdHlwZTtcblx0XHR9XG5cdFx0LyoqIFNldCBwcm90b3R5cGUgKi9cblx0XHRzZXRQcm90b3R5cGVPZih0YXJnZXQsIHByb3RvKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5faW52b2tlcihXUmVmbGVjdEFjdGlvbi5TRVRfUFJPVE9UWVBFX09GLCB0aGlzLl9jb25maWcuYmFzZVBhdGgsIFtwcm90b10pO1xuXHRcdH1cblx0XHQvKiogQ2hlY2sgaWYgZXh0ZW5zaWJsZSAqL1xuXHRcdGlzRXh0ZW5zaWJsZSh0YXJnZXQpIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHQvKiogUHJldmVudCBleHRlbnNpb25zICovXG5cdFx0cHJldmVudEV4dGVuc2lvbnModGFyZ2V0KSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5faW52b2tlcihXUmVmbGVjdEFjdGlvbi5QUkVWRU5UX0VYVEVOU0lPTlMsIHRoaXMuX2NvbmZpZy5iYXNlUGF0aCwgW10pO1xuXHRcdH1cblx0XHQvKiogR2V0IGRlc2NyaXB0b3IgZm9yIHRoaXMgcHJveHkgKi9cblx0XHRfZ2V0RGVzY3JpcHRvcigpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHBhdGg6IHRoaXMuX2NvbmZpZy5iYXNlUGF0aCxcblx0XHRcdFx0Y2hhbm5lbDogdGhpcy5fY29uZmlnLmNoYW5uZWwsXG5cdFx0XHRcdHByaW1pdGl2ZTogZmFsc2Vcblx0XHRcdH07XG5cdFx0fVxuXHR9O1xuXHQvKipcblx0KiBDcmVhdGUgYSByZW1vdGUgcHJveHkgZm9yIHRyYW5zcGFyZW50IFJQQ1xuXHQqXG5cdCogQHBhcmFtIGludm9rZXIgLSBGdW5jdGlvbiB0byBpbnZva2UgcmVtb3RlIG9wZXJhdGlvbnNcblx0KiBAcGFyYW0gY29uZmlnIC0gUHJveHkgY29uZmlndXJhdGlvblxuXHQqIEByZXR1cm5zIFByb3h5IG9iamVjdCB0aGF0IGZvcndhcmRzIGFsbCBvcGVyYXRpb25zIHRvIHJlbW90ZVxuXHQqXG5cdCogQGV4YW1wbGVcblx0KiBjb25zdCBwcm94eSA9IGNyZWF0ZVJlbW90ZVByb3h5KFxuXHQqICAgICAoYWN0aW9uLCBwYXRoLCBhcmdzKSA9PiBjaGFubmVsLmludm9rZSh0YXJnZXRDaGFubmVsLCBhY3Rpb24sIHBhdGgsIGFyZ3MpLFxuXHQqICAgICB7IGNoYW5uZWw6IFwid29ya2VyXCIgfVxuXHQqICk7XG5cdCpcblx0KiAvLyBBbGwgb3BlcmF0aW9ucyBhcmUgZm9yd2FyZGVkXG5cdCogYXdhaXQgcHJveHkubWF0aC5hZGQoMSwgMik7XG5cdCogYXdhaXQgcHJveHkudXNlci5uYW1lO1xuXHQqIHByb3h5LmNvbmZpZy5kZWJ1ZyA9IHRydWU7XG5cdCovXG5cdGZ1bmN0aW9uIGNyZWF0ZVJlbW90ZVByb3h5KGludm9rZXIsIGNvbmZpZykge1xuXHRcdGNvbnN0IGZuID0gZnVuY3Rpb24oKSB7fTtcblx0XHRjb25zdCBoYW5kbGVyID0gbmV3IFJlbW90ZVByb3h5SGFuZGxlcihpbnZva2VyLCBjb25maWcpO1xuXHRcdHJldHVybiBuZXcgUHJveHkoZm4sIGhhbmRsZXIpO1xuXHR9XG5cdC8qKlxuXHQqIENyZWF0ZSBwcm94eSBmcm9tIGRlc2NyaXB0b3Jcblx0KlxuXHQqIFdyYXBzIGEgV1JlZmxlY3REZXNjcmlwdG9yIGludG8gYSB1c2FibGUgcHJveHkgb2JqZWN0LlxuXHQqXG5cdCogQHBhcmFtIGRlc2NyaXB0b3IgLSBSZW1vdGUgb2JqZWN0IGRlc2NyaXB0b3Jcblx0KiBAcGFyYW0gaW52b2tlciAtIEZ1bmN0aW9uIHRvIGludm9rZSByZW1vdGUgb3BlcmF0aW9uc1xuXHQqIEBwYXJhbSB0YXJnZXRDaGFubmVsIC0gT3ZlcnJpZGUgY2hhbm5lbCBmcm9tIGRlc2NyaXB0b3Jcblx0Ki9cblx0ZnVuY3Rpb24gd3JhcERlc2NyaXB0b3IoZGVzY3JpcHRvciwgaW52b2tlciwgdGFyZ2V0Q2hhbm5lbCkge1xuXHRcdGlmICghZGVzY3JpcHRvciB8fCB0eXBlb2YgZGVzY3JpcHRvciAhPT0gXCJvYmplY3RcIikgcmV0dXJuIGRlc2NyaXB0b3I7XG5cdFx0aWYgKGRlc2NyaXB0b3IucHJpbWl0aXZlKSByZXR1cm4gZGVzY3JpcHRvcjtcblx0XHRjb25zdCBjYWNoZWQgPSBkZXNjTWFwLmdldChkZXNjcmlwdG9yKTtcblx0XHRpZiAoY2FjaGVkKSByZXR1cm4gY2FjaGVkO1xuXHRcdGNvbnN0IHByb3h5ID0gY3JlYXRlUmVtb3RlUHJveHkoaW52b2tlciwge1xuXHRcdFx0Y2hhbm5lbDogdGFyZ2V0Q2hhbm5lbCA/PyBkZXNjcmlwdG9yLmNoYW5uZWwgPz8gXCJ1bmtub3duXCIsXG5cdFx0XHRiYXNlUGF0aDogZGVzY3JpcHRvci5wYXRoID8/IFtdXG5cdFx0fSk7XG5cdFx0ZGVzY01hcC5zZXQoZGVzY3JpcHRvciwgcHJveHkpO1xuXHRcdHdyYXBNYXAuc2V0KHByb3h5LCBkZXNjcmlwdG9yKTtcblx0XHRyZXR1cm4gcHJveHk7XG5cdH1cblx0LyoqXG5cdCogQ3JlYXRlIGFuIGV4cG9zZSBoYW5kbGVyIGZvciBhbiBvYmplY3Rcblx0KlxuXHQqIFVzZXMgdGhlIHVuaWZpZWQgUmVxdWVzdEhhbmRsZXIgZm9yIGNvbnNpc3RlbnQgYmVoYXZpb3IuXG5cdCpcblx0KiBAcGFyYW0gdGFyZ2V0IC0gT2JqZWN0IHRvIGV4cG9zZVxuXHQqIEBwYXJhbSByZWZsZWN0IC0gT3B0aW9uYWwgY3VzdG9tIFJlZmxlY3QgaW1wbGVtZW50YXRpb25cblx0KiBAcmV0dXJucyBIYW5kbGVyIGZ1bmN0aW9uIGZvciBpbmNvbWluZyByZXF1ZXN0c1xuXHQqL1xuXHRmdW5jdGlvbiBjcmVhdGVFeHBvc2VIYW5kbGVyKHRhcmdldCwgcmVmbGVjdCkge1xuXHRcdHJldHVybiBjcmVhdGVPYmplY3RIYW5kbGVyKHRhcmdldCwgcmVmbGVjdCk7XG5cdH1cblx0LyoqXG5cdCogQ3JlYXRlIGEgcHJveHkgZm9yIHJlbW90ZSBvYmplY3Qgb3ZlciBhIHNlbmRlciAoTWVzc2FnZVBvcnQsIGV0Yy4pXG5cdCpcblx0KiBAcGFyYW0gc2VuZGVyIC0gT2JqZWN0IHdpdGggcmVxdWVzdCgpIG1ldGhvZFxuXHQqIEBwYXJhbSBiYXNlUGF0aCAtIEJhc2UgcGF0aCBmb3IgcHJvcGVydHkgYWNjZXNzXG5cdCovXG5cdGZ1bmN0aW9uIGNyZWF0ZVNlbmRlclByb3h5KHNlbmRlciwgYmFzZVBhdGggPSBbXSkge1xuXHRcdGNvbnN0IGludm9rZXIgPSAoYWN0aW9uLCBwYXRoLCBhcmdzKSA9PiB7XG5cdFx0XHRyZXR1cm4gc2VuZGVyLnJlcXVlc3Qoe1xuXHRcdFx0XHRpZDogVVVJRHY0KCksXG5cdFx0XHRcdGNoYW5uZWw6IHNlbmRlci5jaGFubmVsTmFtZSxcblx0XHRcdFx0c2VuZGVyOiBzZW5kZXIuc2VuZGVySWQgPz8gXCJwcm94eVwiLFxuXHRcdFx0XHR0eXBlOiBcInJlcXVlc3RcIixcblx0XHRcdFx0cGF5bG9hZDoge1xuXHRcdFx0XHRcdGFjdGlvbixcblx0XHRcdFx0XHRwYXRoLFxuXHRcdFx0XHRcdGFyZ3Ncblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fTtcblx0XHRyZXR1cm4gY3JlYXRlUmVtb3RlUHJveHkoaW52b2tlciwge1xuXHRcdFx0Y2hhbm5lbDogc2VuZGVyLmNoYW5uZWxOYW1lLFxuXHRcdFx0YmFzZVBhdGhcblx0XHR9KTtcblx0fVxuXHQvKiogQGRlcHJlY2F0ZWQgVXNlIHdyYXBEZXNjcmlwdG9yICovXG5cdGNvbnN0IG1ha2VSZXF1ZXN0UHJveHkgPSB3cmFwRGVzY3JpcHRvcjtcblxuLy8jZW5kcmVnaW9uXG4vLyNyZWdpb24gLi4vdW5pZm9ybS50cy9zcmMvbmV3ZXIvbmV4dC9jaGFubmVsL2ludGVybmFsL0Nvbm5lY3Rpb25Nb2RlbC50c1xuXHRmdW5jdGlvbiBjcmVhdGVDb25uZWN0aW9uS2V5KHBhcmFtcykge1xuXHRcdHJldHVybiBbXG5cdFx0XHRwYXJhbXMubG9jYWxDaGFubmVsLFxuXHRcdFx0cGFyYW1zLnJlbW90ZUNoYW5uZWwsXG5cdFx0XHRwYXJhbXMuc2VuZGVyLFxuXHRcdFx0cGFyYW1zLnRyYW5zcG9ydFR5cGUsXG5cdFx0XHRwYXJhbXMuZGlyZWN0aW9uXG5cdFx0XS5qb2luKFwiOjpcIik7XG5cdH1cblx0ZnVuY3Rpb24gcXVlcnlDb25uZWN0aW9ucyhjb25uZWN0aW9ucywgcXVlcnkgPSB7fSkge1xuXHRcdGNvbnN0IGluY2x1ZGVDbG9zZWQgPSBxdWVyeS5pbmNsdWRlQ2xvc2VkID8/IGZhbHNlO1xuXHRcdGNvbnN0IGRlc2lyZWRTdGF0dXMgPSBxdWVyeS5zdGF0dXMgPz8gKGluY2x1ZGVDbG9zZWQgPyB2b2lkIDAgOiBcImFjdGl2ZVwiKTtcblx0XHRyZXR1cm4gWy4uLmNvbm5lY3Rpb25zXS5maWx0ZXIoKGNvbm5lY3Rpb24pID0+IHtcblx0XHRcdGlmIChkZXNpcmVkU3RhdHVzICYmIGNvbm5lY3Rpb24uc3RhdHVzICE9PSBkZXNpcmVkU3RhdHVzKSByZXR1cm4gZmFsc2U7XG5cdFx0XHRpZiAocXVlcnkuY2hhbm5lbCAmJiBjb25uZWN0aW9uLmxvY2FsQ2hhbm5lbCAhPT0gcXVlcnkuY2hhbm5lbCAmJiBjb25uZWN0aW9uLnJlbW90ZUNoYW5uZWwgIT09IHF1ZXJ5LmNoYW5uZWwpIHJldHVybiBmYWxzZTtcblx0XHRcdGlmIChxdWVyeS5sb2NhbENoYW5uZWwgJiYgY29ubmVjdGlvbi5sb2NhbENoYW5uZWwgIT09IHF1ZXJ5LmxvY2FsQ2hhbm5lbCkgcmV0dXJuIGZhbHNlO1xuXHRcdFx0aWYgKHF1ZXJ5LnJlbW90ZUNoYW5uZWwgJiYgY29ubmVjdGlvbi5yZW1vdGVDaGFubmVsICE9PSBxdWVyeS5yZW1vdGVDaGFubmVsKSByZXR1cm4gZmFsc2U7XG5cdFx0XHRpZiAocXVlcnkuc2VuZGVyICYmIGNvbm5lY3Rpb24uc2VuZGVyICE9PSBxdWVyeS5zZW5kZXIpIHJldHVybiBmYWxzZTtcblx0XHRcdGlmIChxdWVyeS50cmFuc3BvcnRUeXBlICYmIGNvbm5lY3Rpb24udHJhbnNwb3J0VHlwZSAhPT0gcXVlcnkudHJhbnNwb3J0VHlwZSkgcmV0dXJuIGZhbHNlO1xuXHRcdFx0aWYgKHF1ZXJ5LmRpcmVjdGlvbiAmJiBjb25uZWN0aW9uLmRpcmVjdGlvbiAhPT0gcXVlcnkuZGlyZWN0aW9uKSByZXR1cm4gZmFsc2U7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9KS5zb3J0KChhLCBiKSA9PiBiLnVwZGF0ZWRBdCAtIGEudXBkYXRlZEF0KTtcblx0fVxuXHR2YXIgQ29ubmVjdGlvblJlZ2lzdHJ5ID0gY2xhc3Mge1xuXHRcdF9jcmVhdGVJZDtcblx0XHRfZW1pdEV2ZW50O1xuXHRcdF9jb25uZWN0aW9ucyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG5cdFx0Y29uc3RydWN0b3IoX2NyZWF0ZUlkLCBfZW1pdEV2ZW50KSB7XG5cdFx0XHR0aGlzLl9jcmVhdGVJZCA9IF9jcmVhdGVJZDtcblx0XHRcdHRoaXMuX2VtaXRFdmVudCA9IF9lbWl0RXZlbnQ7XG5cdFx0fVxuXHRcdHJlZ2lzdGVyKHBhcmFtcykge1xuXHRcdFx0Y29uc3Qga2V5ID0gY3JlYXRlQ29ubmVjdGlvbktleShwYXJhbXMpO1xuXHRcdFx0Y29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcblx0XHRcdGNvbnN0IGV4aXN0aW5nID0gdGhpcy5fY29ubmVjdGlvbnMuZ2V0KGtleSk7XG5cdFx0XHRpZiAoZXhpc3RpbmcpIHtcblx0XHRcdFx0ZXhpc3RpbmcudXBkYXRlZEF0ID0gbm93O1xuXHRcdFx0XHRleGlzdGluZy5zdGF0dXMgPSBcImFjdGl2ZVwiO1xuXHRcdFx0XHRleGlzdGluZy5tZXRhZGF0YSA9IHtcblx0XHRcdFx0XHQuLi5leGlzdGluZy5tZXRhZGF0YSxcblx0XHRcdFx0XHQuLi5wYXJhbXMubWV0YWRhdGFcblx0XHRcdFx0fTtcblx0XHRcdFx0cmV0dXJuIGV4aXN0aW5nO1xuXHRcdFx0fVxuXHRcdFx0Y29uc3QgY29ubmVjdGlvbiA9IHtcblx0XHRcdFx0aWQ6IHRoaXMuX2NyZWF0ZUlkKCksXG5cdFx0XHRcdGxvY2FsQ2hhbm5lbDogcGFyYW1zLmxvY2FsQ2hhbm5lbCxcblx0XHRcdFx0cmVtb3RlQ2hhbm5lbDogcGFyYW1zLnJlbW90ZUNoYW5uZWwsXG5cdFx0XHRcdHNlbmRlcjogcGFyYW1zLnNlbmRlcixcblx0XHRcdFx0dHJhbnNwb3J0VHlwZTogcGFyYW1zLnRyYW5zcG9ydFR5cGUsXG5cdFx0XHRcdGRpcmVjdGlvbjogcGFyYW1zLmRpcmVjdGlvbixcblx0XHRcdFx0c3RhdHVzOiBcImFjdGl2ZVwiLFxuXHRcdFx0XHRjcmVhdGVkQXQ6IG5vdyxcblx0XHRcdFx0dXBkYXRlZEF0OiBub3csXG5cdFx0XHRcdG1ldGFkYXRhOiBwYXJhbXMubWV0YWRhdGFcblx0XHRcdH07XG5cdFx0XHR0aGlzLl9jb25uZWN0aW9ucy5zZXQoa2V5LCBjb25uZWN0aW9uKTtcblx0XHRcdHRoaXMuX2VtaXRFdmVudD8uKHtcblx0XHRcdFx0dHlwZTogXCJjb25uZWN0ZWRcIixcblx0XHRcdFx0Y29ubmVjdGlvbixcblx0XHRcdFx0dGltZXN0YW1wOiBub3dcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIGNvbm5lY3Rpb247XG5cdFx0fVxuXHRcdG1hcmtOb3RpZmllZChjb25uZWN0aW9uLCBwYXlsb2FkKSB7XG5cdFx0XHRjb25zdCBub3cgPSBEYXRlLm5vdygpO1xuXHRcdFx0Y29ubmVjdGlvbi5sYXN0Tm90aWZ5QXQgPSBub3c7XG5cdFx0XHRjb25uZWN0aW9uLnVwZGF0ZWRBdCA9IG5vdztcblx0XHRcdHRoaXMuX2VtaXRFdmVudD8uKHtcblx0XHRcdFx0dHlwZTogXCJub3RpZmllZFwiLFxuXHRcdFx0XHRjb25uZWN0aW9uLFxuXHRcdFx0XHR0aW1lc3RhbXA6IG5vdyxcblx0XHRcdFx0cGF5bG9hZFxuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdGNsb3NlQnlDaGFubmVsKGNoYW5uZWwpIHtcblx0XHRcdGNvbnN0IG5vdyA9IERhdGUubm93KCk7XG5cdFx0XHRmb3IgKGNvbnN0IGNvbm5lY3Rpb24gb2YgdGhpcy5fY29ubmVjdGlvbnMudmFsdWVzKCkpIHtcblx0XHRcdFx0aWYgKGNvbm5lY3Rpb24ubG9jYWxDaGFubmVsICE9PSBjaGFubmVsICYmIGNvbm5lY3Rpb24ucmVtb3RlQ2hhbm5lbCAhPT0gY2hhbm5lbCkgY29udGludWU7XG5cdFx0XHRcdGlmIChjb25uZWN0aW9uLnN0YXR1cyA9PT0gXCJjbG9zZWRcIikgY29udGludWU7XG5cdFx0XHRcdGNvbm5lY3Rpb24uc3RhdHVzID0gXCJjbG9zZWRcIjtcblx0XHRcdFx0Y29ubmVjdGlvbi51cGRhdGVkQXQgPSBub3c7XG5cdFx0XHRcdHRoaXMuX2VtaXRFdmVudD8uKHtcblx0XHRcdFx0XHR0eXBlOiBcImRpc2Nvbm5lY3RlZFwiLFxuXHRcdFx0XHRcdGNvbm5lY3Rpb24sXG5cdFx0XHRcdFx0dGltZXN0YW1wOiBub3dcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGNsb3NlQWxsKCkge1xuXHRcdFx0Y29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcblx0XHRcdGZvciAoY29uc3QgY29ubmVjdGlvbiBvZiB0aGlzLl9jb25uZWN0aW9ucy52YWx1ZXMoKSkge1xuXHRcdFx0XHRpZiAoY29ubmVjdGlvbi5zdGF0dXMgPT09IFwiY2xvc2VkXCIpIGNvbnRpbnVlO1xuXHRcdFx0XHRjb25uZWN0aW9uLnN0YXR1cyA9IFwiY2xvc2VkXCI7XG5cdFx0XHRcdGNvbm5lY3Rpb24udXBkYXRlZEF0ID0gbm93O1xuXHRcdFx0XHR0aGlzLl9lbWl0RXZlbnQ/Lih7XG5cdFx0XHRcdFx0dHlwZTogXCJkaXNjb25uZWN0ZWRcIixcblx0XHRcdFx0XHRjb25uZWN0aW9uLFxuXHRcdFx0XHRcdHRpbWVzdGFtcDogbm93XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRxdWVyeShxdWVyeSA9IHt9KSB7XG5cdFx0XHRyZXR1cm4gcXVlcnlDb25uZWN0aW9ucyh0aGlzLl9jb25uZWN0aW9ucy52YWx1ZXMoKSwgcXVlcnkpO1xuXHRcdH1cblx0XHR2YWx1ZXMoKSB7XG5cdFx0XHRyZXR1cm4gWy4uLnRoaXMuX2Nvbm5lY3Rpb25zLnZhbHVlcygpXTtcblx0XHR9XG5cdFx0Y2xlYXIoKSB7XG5cdFx0XHR0aGlzLl9jb25uZWN0aW9ucy5jbGVhcigpO1xuXHRcdH1cblx0fTtcblxuLy8jZW5kcmVnaW9uXG4vLyNyZWdpb24gLi4vdW5pZm9ybS50cy9zcmMvbmV3ZXIvbmV4dC9jaGFubmVsL1VuaWZpZWRDaGFubmVsLnRzXG4vKipcblx0KiBVbmlmaWVkIENoYW5uZWwgU3lzdGVtXG5cdCpcblx0KiBNZXJnZXMgYW5kIHVuaWZpZXM6XG5cdCogLSBSZXF1ZXN0UHJveHkgKHByb3h5IGNyZWF0aW9uIGFuZCBkaXNwYXRjaClcblx0KiAtIEludm9rZXIgKFJlcXVlc3Rvci9SZXNwb25kZXIgYWJzdHJhY3Rpb24pXG5cdCogLSBDaGFubmVsQ29udGV4dCAobXVsdGktY2hhbm5lbCBtYW5hZ2VtZW50KVxuXHQqIC0gT2JzZXJ2YWJsZUNoYW5uZWxzIChPYnNlcnZhYmxlLWJhc2VkIG1lc3NhZ2luZylcblx0KlxuXHQqIFNpbmdsZSBlbnRyeSBwb2ludCBmb3IgYWxsIGNoYW5uZWwgY29tbXVuaWNhdGlvbiBwYXR0ZXJuczpcblx0KiAtIGBjcmVhdGVDaGFubmVsKClgIC0gQ3JlYXRlIGEgdW5pZmllZCBjaGFubmVsXG5cdCogLSBgY2hhbm5lbC5leHBvc2UoKWAgLSBFeHBvc2Ugb2JqZWN0cyBmb3IgcmVtb3RlIGludm9jYXRpb25cblx0KiAtIGBjaGFubmVsLmltcG9ydCgpYCAtIEltcG9ydCByZW1vdGUgbW9kdWxlc1xuXHQqIC0gYGNoYW5uZWwucHJveHkoKWAgLSBDcmVhdGUgdHJhbnNwYXJlbnQgcHJveHkgdG8gcmVtb3RlXG5cdCogLSBgY2hhbm5lbC5jb25uZWN0KClgIC0gQ29ubmVjdCB0byB0cmFuc3BvcnRcblx0Ki9cblx0LyoqXG5cdCogVW5pZmllZENoYW5uZWwgLSBTaW5nbGUgZW50cnkgcG9pbnQgZm9yIGFsbCBjaGFubmVsIGNvbW11bmljYXRpb25cblx0KlxuXHQqIENvbWJpbmVzOlxuXHQqIC0gUmVxdWVzdG9yIGZ1bmN0aW9uYWxpdHkgKGludm9rZSByZW1vdGUgbWV0aG9kcylcblx0KiAtIFJlc3BvbmRlciBmdW5jdGlvbmFsaXR5IChoYW5kbGUgaW5jb21pbmcgcmVxdWVzdHMpXG5cdCogLSBQcm94eSBjcmVhdGlvbiAodHJhbnNwYXJlbnQgcmVtb3RlIGFjY2Vzcylcblx0KiAtIE9ic2VydmFibGUgbWVzc2FnaW5nIChzdWJzY3JpYmUvbmV4dCBwYXR0ZXJuKVxuXHQqIC0gTXVsdGktdHJhbnNwb3J0IHN1cHBvcnQgKFdvcmtlciwgUG9ydCwgQnJvYWRjYXN0LCBXZWJTb2NrZXQsIENocm9tZSlcblx0Ki9cblx0dmFyIFVuaWZpZWRDaGFubmVsID0gY2xhc3Mge1xuXHRcdF9uYW1lO1xuXHRcdF9jb250ZXh0VHlwZTtcblx0XHRfY29uZmlnO1xuXHRcdF90cmFuc3BvcnRzID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0XHRfZGVmYXVsdFRyYW5zcG9ydCA9IG51bGw7XG5cdFx0X2Nvbm5lY3Rpb25FdmVudHMgPSBuZXcgQ2hhbm5lbFN1YmplY3QoeyBidWZmZXJTaXplOiAyMDAgfSk7XG5cdFx0X2Nvbm5lY3Rpb25SZWdpc3RyeSA9IG5ldyBDb25uZWN0aW9uUmVnaXN0cnkoKCkgPT4gVVVJRHY0KCksIChldmVudCkgPT4gdGhpcy5fY29ubmVjdGlvbkV2ZW50cy5uZXh0KGV2ZW50KSk7XG5cdFx0X3BlbmRpbmcgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuXHRcdF9zdWJzY3JpcHRpb25zID0gW107XG5cdFx0X2luYm91bmQgPSBuZXcgQ2hhbm5lbFN1YmplY3QoeyBidWZmZXJTaXplOiAxMDAgfSk7XG5cdFx0X291dGJvdW5kID0gbmV3IENoYW5uZWxTdWJqZWN0KHsgYnVmZmVyU2l6ZTogMTAwIH0pO1xuXHRcdF9pbnZvY2F0aW9ucyA9IG5ldyBDaGFubmVsU3ViamVjdCh7IGJ1ZmZlclNpemU6IDEwMCB9KTtcblx0XHRfcmVzcG9uc2VzID0gbmV3IENoYW5uZWxTdWJqZWN0KHsgYnVmZmVyU2l6ZTogMTAwIH0pO1xuXHRcdF9leHBvc2VkID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0XHRfcHJveHlDYWNoZSA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xuXHRcdF9fZ2V0UHJpdmF0ZShrZXkpIHtcblx0XHRcdHJldHVybiB0aGlzW2tleV07XG5cdFx0fVxuXHRcdF9fc2V0UHJpdmF0ZShrZXksIHZhbHVlKSB7XG5cdFx0XHR0aGlzW2tleV0gPSB2YWx1ZTtcblx0XHR9XG5cdFx0Y29uc3RydWN0b3IoY29uZmlnKSB7XG5cdFx0XHRjb25zdCBjZmcgPSB0eXBlb2YgY29uZmlnID09PSBcInN0cmluZ1wiID8geyBuYW1lOiBjb25maWcgfSA6IGNvbmZpZztcblx0XHRcdHRoaXMuX25hbWUgPSBjZmcubmFtZTtcblx0XHRcdHRoaXMuX2NvbnRleHRUeXBlID0gY2ZnLmF1dG9EZXRlY3QgIT09IGZhbHNlID8gZGV0ZWN0Q29udGV4dFR5cGUoKSA6IFwidW5rbm93blwiO1xuXHRcdFx0dGhpcy5fY29uZmlnID0ge1xuXHRcdFx0XHRuYW1lOiBjZmcubmFtZSxcblx0XHRcdFx0YXV0b0RldGVjdDogY2ZnLmF1dG9EZXRlY3QgPz8gdHJ1ZSxcblx0XHRcdFx0dGltZW91dDogY2ZnLnRpbWVvdXQgPz8gM2U0LFxuXHRcdFx0XHRyZWZsZWN0OiBjZmcucmVmbGVjdCA/PyBEZWZhdWx0UmVmbGVjdCxcblx0XHRcdFx0YnVmZmVyU2l6ZTogY2ZnLmJ1ZmZlclNpemUgPz8gMTAwLFxuXHRcdFx0XHRhdXRvTGlzdGVuOiBjZmcuYXV0b0xpc3RlbiA/PyB0cnVlXG5cdFx0XHR9O1xuXHRcdFx0aWYgKHRoaXMuX2NvbmZpZy5hdXRvTGlzdGVuICYmIHRoaXMuX2lzV29ya2VyQ29udGV4dCgpKSB0aGlzLmxpc3RlbihzZWxmKTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBDb25uZWN0IHRvIGEgdHJhbnNwb3J0IGZvciBzZW5kaW5nIHJlcXVlc3RzXG5cdFx0KlxuXHRcdCogQHBhcmFtIHRhcmdldCAtIFdvcmtlciwgTWVzc2FnZVBvcnQsIEJyb2FkY2FzdENoYW5uZWwsIFdlYlNvY2tldCwgb3Igc3RyaW5nIGlkZW50aWZpZXJcblx0XHQqIEBwYXJhbSBvcHRpb25zIC0gQ29ubmVjdGlvbiBvcHRpb25zXG5cdFx0Ki9cblx0XHRjb25uZWN0KHRhcmdldCwgb3B0aW9ucyA9IHt9KSB7XG5cdFx0XHRjb25zdCB0cmFuc3BvcnRUeXBlID0gZGV0ZWN0VHJhbnNwb3J0VHlwZSh0YXJnZXQpO1xuXHRcdFx0Y29uc3QgdGFyZ2V0Q2hhbm5lbCA9IG9wdGlvbnMudGFyZ2V0Q2hhbm5lbCA/PyB0aGlzLl9pbmZlclRhcmdldENoYW5uZWwodGFyZ2V0LCB0cmFuc3BvcnRUeXBlKTtcblx0XHRcdGNvbnN0IGJpbmRpbmcgPSB0aGlzLl9jcmVhdGVUcmFuc3BvcnRCaW5kaW5nKHRhcmdldCwgdHJhbnNwb3J0VHlwZSwgdGFyZ2V0Q2hhbm5lbCwgb3B0aW9ucyk7XG5cdFx0XHR0aGlzLl90cmFuc3BvcnRzLnNldCh0YXJnZXRDaGFubmVsLCBiaW5kaW5nKTtcblx0XHRcdGlmICghdGhpcy5fZGVmYXVsdFRyYW5zcG9ydCkgdGhpcy5fZGVmYXVsdFRyYW5zcG9ydCA9IGJpbmRpbmc7XG5cdFx0XHRjb25zdCBjb25uZWN0aW9uID0gdGhpcy5fcmVnaXN0ZXJDb25uZWN0aW9uKHtcblx0XHRcdFx0bG9jYWxDaGFubmVsOiB0aGlzLl9uYW1lLFxuXHRcdFx0XHRyZW1vdGVDaGFubmVsOiB0YXJnZXRDaGFubmVsLFxuXHRcdFx0XHRzZW5kZXI6IHRoaXMuX25hbWUsXG5cdFx0XHRcdHRyYW5zcG9ydFR5cGUsXG5cdFx0XHRcdGRpcmVjdGlvbjogXCJvdXRnb2luZ1wiLFxuXHRcdFx0XHRtZXRhZGF0YTogeyBwaGFzZTogXCJjb25uZWN0XCIgfVxuXHRcdFx0fSk7XG5cdFx0XHR0aGlzLl9lbWl0Q29ubmVjdGlvblNpZ25hbChiaW5kaW5nLCBcImNvbm5lY3RcIiwge1xuXHRcdFx0XHRjb25uZWN0aW9uSWQ6IGNvbm5lY3Rpb24uaWQsXG5cdFx0XHRcdGZyb206IHRoaXMuX25hbWUsXG5cdFx0XHRcdHRvOiB0YXJnZXRDaGFubmVsXG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIExpc3RlbiBvbiBhIHRyYW5zcG9ydCBmb3IgaW5jb21pbmcgcmVxdWVzdHNcblx0XHQqXG5cdFx0KiBAcGFyYW0gc291cmNlIC0gVHJhbnNwb3J0IHNvdXJjZSB0byBsaXN0ZW4gb25cblx0XHQqIEBwYXJhbSBvcHRpb25zIC0gQ29ubmVjdGlvbiBvcHRpb25zXG5cdFx0Ki9cblx0XHRsaXN0ZW4oc291cmNlLCBvcHRpb25zID0ge30pIHtcblx0XHRcdGNvbnN0IHRyYW5zcG9ydFR5cGUgPSBkZXRlY3RUcmFuc3BvcnRUeXBlKHNvdXJjZSk7XG5cdFx0XHRjb25zdCBzb3VyY2VDaGFubmVsID0gb3B0aW9ucy50YXJnZXRDaGFubmVsID8/IHRoaXMuX2luZmVyVGFyZ2V0Q2hhbm5lbChzb3VyY2UsIHRyYW5zcG9ydFR5cGUpO1xuXHRcdFx0Y29uc3QgaGFuZGxlciA9IChkYXRhKSA9PiB0aGlzLl9oYW5kbGVJbmNvbWluZyhkYXRhKTtcblx0XHRcdGNvbnN0IGNvbm5lY3Rpb24gPSB0aGlzLl9yZWdpc3RlckNvbm5lY3Rpb24oe1xuXHRcdFx0XHRsb2NhbENoYW5uZWw6IHRoaXMuX25hbWUsXG5cdFx0XHRcdHJlbW90ZUNoYW5uZWw6IHNvdXJjZUNoYW5uZWwsXG5cdFx0XHRcdHNlbmRlcjogc291cmNlQ2hhbm5lbCxcblx0XHRcdFx0dHJhbnNwb3J0VHlwZSxcblx0XHRcdFx0ZGlyZWN0aW9uOiBcImluY29taW5nXCIsXG5cdFx0XHRcdG1ldGFkYXRhOiB7IHBoYXNlOiBcImxpc3RlblwiIH1cblx0XHRcdH0pO1xuXHRcdFx0c3dpdGNoICh0cmFuc3BvcnRUeXBlKSB7XG5cdFx0XHRcdGNhc2UgXCJ3b3JrZXJcIjpcblx0XHRcdFx0Y2FzZSBcIm1lc3NhZ2UtcG9ydFwiOlxuXHRcdFx0XHRjYXNlIFwiYnJvYWRjYXN0XCI6XG5cdFx0XHRcdFx0aWYgKG9wdGlvbnMuYXV0b1N0YXJ0ICE9PSBmYWxzZSAmJiBzb3VyY2Uuc3RhcnQpIHNvdXJjZS5zdGFydCgpO1xuXHRcdFx0XHRcdHNvdXJjZS5hZGRFdmVudExpc3RlbmVyPy4oXCJtZXNzYWdlXCIsICgoZSkgPT4gaGFuZGxlcihlLmRhdGEpKSk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJ3ZWJzb2NrZXRcIjpcblx0XHRcdFx0XHRzb3VyY2UuYWRkRXZlbnRMaXN0ZW5lcj8uKFwibWVzc2FnZVwiLCAoKGUpID0+IHtcblx0XHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRcdGhhbmRsZXIoSlNPTi5wYXJzZShlLmRhdGEpKTtcblx0XHRcdFx0XHRcdH0gY2F0Y2gge31cblx0XHRcdFx0XHR9KSk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJjaHJvbWUtcnVudGltZVwiOlxuXHRcdFx0XHRcdGNocm9tZS5ydW50aW1lLm9uTWVzc2FnZT8uYWRkTGlzdGVuZXI/LigobXNnLCBzZW5kZXIsIHNlbmRSZXNwb25zZSkgPT4ge1xuXHRcdFx0XHRcdFx0aGFuZGxlcihtc2cpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJjaHJvbWUtdGFic1wiOlxuXHRcdFx0XHRcdGNocm9tZS5ydW50aW1lLm9uTWVzc2FnZT8uYWRkTGlzdGVuZXI/LigobXNnLCBzZW5kZXIpID0+IHtcblx0XHRcdFx0XHRcdGlmIChvcHRpb25zLnRhYklkICE9IG51bGwgJiYgc2VuZGVyPy50YWI/LmlkICE9PSBvcHRpb25zLnRhYklkKSByZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0XHRoYW5kbGVyKG1zZyk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcImNocm9tZS1wb3J0XCI6XG5cdFx0XHRcdFx0c291cmNlPy5vbk1lc3NhZ2U/LmFkZExpc3RlbmVyPy4oKG1zZykgPT4ge1xuXHRcdFx0XHRcdFx0aGFuZGxlcihtc2cpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwiY2hyb21lLWV4dGVybmFsXCI6XG5cdFx0XHRcdFx0Y2hyb21lLnJ1bnRpbWUub25NZXNzYWdlRXh0ZXJuYWw/LmFkZExpc3RlbmVyPy4oKG1zZykgPT4ge1xuXHRcdFx0XHRcdFx0aGFuZGxlcihtc2cpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJzZWxmXCI6XG5cdFx0XHRcdFx0YWRkRXZlbnRMaXN0ZW5lcj8uKFwibWVzc2FnZVwiLCAoKGUpID0+IGhhbmRsZXIoZS5kYXRhKSkpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRkZWZhdWx0OiBpZiAob3B0aW9ucy5vbk1lc3NhZ2UpIG9wdGlvbnMub25NZXNzYWdlKGhhbmRsZXIpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5fc2VuZFNpZ25hbFRvVGFyZ2V0KHNvdXJjZSwgdHJhbnNwb3J0VHlwZSwge1xuXHRcdFx0XHRjb25uZWN0aW9uSWQ6IGNvbm5lY3Rpb24uaWQsXG5cdFx0XHRcdGZyb206IHRoaXMuX25hbWUsXG5cdFx0XHRcdHRvOiBzb3VyY2VDaGFubmVsLFxuXHRcdFx0XHR0YWJJZDogb3B0aW9ucy50YWJJZCxcblx0XHRcdFx0ZXh0ZXJuYWxJZDogb3B0aW9ucy5leHRlcm5hbElkXG5cdFx0XHR9LCBcIm5vdGlmeVwiKTtcblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIENvbm5lY3QgYW5kIGxpc3RlbiBvbiB0aGUgc2FtZSB0cmFuc3BvcnQgKGJpZGlyZWN0aW9uYWwpXG5cdFx0Ki9cblx0XHRhdHRhY2godGFyZ2V0LCBvcHRpb25zID0ge30pIHtcblx0XHRcdHJldHVybiB0aGlzLmNvbm5lY3QodGFyZ2V0LCBvcHRpb25zKTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBFeHBvc2UgYW4gb2JqZWN0IGZvciByZW1vdGUgaW52b2NhdGlvblxuXHRcdCpcblx0XHQqIEBwYXJhbSBuYW1lIC0gUGF0aCBuYW1lIGZvciB0aGUgZXhwb3NlZCBvYmplY3Rcblx0XHQqIEBwYXJhbSBvYmogLSBPYmplY3QgdG8gZXhwb3NlXG5cdFx0Ki9cblx0XHRleHBvc2UobmFtZSwgb2JqKSB7XG5cdFx0XHRjb25zdCBwYXRoID0gW25hbWVdO1xuXHRcdFx0d3JpdGVCeVBhdGgocGF0aCwgb2JqKTtcblx0XHRcdHRoaXMuX2V4cG9zZWQuc2V0KG5hbWUsIHtcblx0XHRcdFx0bmFtZSxcblx0XHRcdFx0b2JqLFxuXHRcdFx0XHRwYXRoXG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIEV4cG9zZSBtdWx0aXBsZSBvYmplY3RzIGF0IG9uY2Vcblx0XHQqL1xuXHRcdGV4cG9zZUFsbChlbnRyaWVzKSB7XG5cdFx0XHRmb3IgKGNvbnN0IFtuYW1lLCBvYmpdIG9mIE9iamVjdC5lbnRyaWVzKGVudHJpZXMpKSB0aGlzLmV4cG9zZShuYW1lLCBvYmopO1xuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogSW1wb3J0IGEgbW9kdWxlIGZyb20gYSByZW1vdGUgY2hhbm5lbFxuXHRcdCpcblx0XHQqIEBwYXJhbSB1cmwgLSBNb2R1bGUgVVJMIHRvIGltcG9ydFxuXHRcdCogQHBhcmFtIHRhcmdldENoYW5uZWwgLSBUYXJnZXQgY2hhbm5lbCAoZGVmYXVsdHMgdG8gZmlyc3QgY29ubmVjdGVkKVxuXHRcdCovXG5cdFx0YXN5bmMgaW1wb3J0KHVybCwgdGFyZ2V0Q2hhbm5lbCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuaW52b2tlKHRhcmdldENoYW5uZWwgPz8gdGhpcy5fZ2V0RGVmYXVsdFRhcmdldCgpLCBXUmVmbGVjdEFjdGlvbi5JTVBPUlQsIFtdLCBbdXJsXSk7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogSW52b2tlIGEgbWV0aG9kIG9uIGEgcmVtb3RlIG9iamVjdFxuXHRcdCpcblx0XHQqIEBwYXJhbSB0YXJnZXRDaGFubmVsIC0gVGFyZ2V0IGNoYW5uZWwgbmFtZVxuXHRcdCogQHBhcmFtIGFjdGlvbiAtIFJlZmxlY3QgYWN0aW9uXG5cdFx0KiBAcGFyYW0gcGF0aCAtIE9iamVjdCBwYXRoXG5cdFx0KiBAcGFyYW0gYXJncyAtIEFyZ3VtZW50c1xuXHRcdCovXG5cdFx0aW52b2tlKHRhcmdldENoYW5uZWwsIGFjdGlvbiwgcGF0aCwgYXJncyA9IFtdKSB7XG5cdFx0XHRjb25zdCBpZCA9IFVVSUR2NCgpO1xuXHRcdFx0Y29uc3QgcmVzb2x2ZXJzID0gUHJvbWlzZS53aXRoUmVzb2x2ZXJzKCk7XG5cdFx0XHR0aGlzLl9wZW5kaW5nLnNldChpZCwgcmVzb2x2ZXJzKTtcblx0XHRcdGNvbnN0IHRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFx0aWYgKHRoaXMuX3BlbmRpbmcuaGFzKGlkKSkge1xuXHRcdFx0XHRcdHRoaXMuX3BlbmRpbmcuZGVsZXRlKGlkKTtcblx0XHRcdFx0XHRyZXNvbHZlcnMucmVqZWN0KC8qIEBfX1BVUkVfXyAqLyBuZXcgRXJyb3IoYFJlcXVlc3QgdGltZW91dDogJHthY3Rpb259IG9uICR7cGF0aC5qb2luKFwiLlwiKX1gKSk7XG5cdFx0XHRcdH1cblx0XHRcdH0sIHRoaXMuX2NvbmZpZy50aW1lb3V0KTtcblx0XHRcdGNvbnN0IG1lc3NhZ2UgPSB7XG5cdFx0XHRcdGlkLFxuXHRcdFx0XHRjaGFubmVsOiB0YXJnZXRDaGFubmVsLFxuXHRcdFx0XHRzZW5kZXI6IHRoaXMuX25hbWUsXG5cdFx0XHRcdHR5cGU6IFwicmVxdWVzdFwiLFxuXHRcdFx0XHRwYXlsb2FkOiB7XG5cdFx0XHRcdFx0Y2hhbm5lbDogdGFyZ2V0Q2hhbm5lbCxcblx0XHRcdFx0XHRzZW5kZXI6IHRoaXMuX25hbWUsXG5cdFx0XHRcdFx0YWN0aW9uLFxuXHRcdFx0XHRcdHBhdGgsXG5cdFx0XHRcdFx0YXJnc1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR0aW1lc3RhbXA6IERhdGUubm93KClcblx0XHRcdH07XG5cdFx0XHR0aGlzLl9zZW5kKHRhcmdldENoYW5uZWwsIG1lc3NhZ2UpO1xuXHRcdFx0dGhpcy5fb3V0Ym91bmQubmV4dChtZXNzYWdlKTtcblx0XHRcdHJldHVybiByZXNvbHZlcnMucHJvbWlzZS5maW5hbGx5KCgpID0+IGNsZWFyVGltZW91dCh0aW1lb3V0KSk7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogR2V0IHByb3BlcnR5IGZyb20gcmVtb3RlIG9iamVjdFxuXHRcdCovXG5cdFx0Z2V0KHRhcmdldENoYW5uZWwsIHBhdGgsIHByb3ApIHtcblx0XHRcdHJldHVybiB0aGlzLmludm9rZSh0YXJnZXRDaGFubmVsLCBXUmVmbGVjdEFjdGlvbi5HRVQsIHBhdGgsIFtwcm9wXSk7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogU2V0IHByb3BlcnR5IG9uIHJlbW90ZSBvYmplY3Rcblx0XHQqL1xuXHRcdHNldCh0YXJnZXRDaGFubmVsLCBwYXRoLCBwcm9wLCB2YWx1ZSkge1xuXHRcdFx0cmV0dXJuIHRoaXMuaW52b2tlKHRhcmdldENoYW5uZWwsIFdSZWZsZWN0QWN0aW9uLlNFVCwgcGF0aCwgW3Byb3AsIHZhbHVlXSk7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogQ2FsbCBtZXRob2Qgb24gcmVtb3RlIG9iamVjdFxuXHRcdCovXG5cdFx0Y2FsbCh0YXJnZXRDaGFubmVsLCBwYXRoLCBhcmdzID0gW10pIHtcblx0XHRcdHJldHVybiB0aGlzLmludm9rZSh0YXJnZXRDaGFubmVsLCBXUmVmbGVjdEFjdGlvbi5BUFBMWSwgcGF0aCwgW2FyZ3NdKTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBDb25zdHJ1Y3QgbmV3IGluc3RhbmNlIG9uIHJlbW90ZVxuXHRcdCovXG5cdFx0Y29uc3RydWN0KHRhcmdldENoYW5uZWwsIHBhdGgsIGFyZ3MgPSBbXSkge1xuXHRcdFx0cmV0dXJuIHRoaXMuaW52b2tlKHRhcmdldENoYW5uZWwsIFdSZWZsZWN0QWN0aW9uLkNPTlNUUlVDVCwgcGF0aCwgW2FyZ3NdKTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBDcmVhdGUgYSB0cmFuc3BhcmVudCBwcm94eSB0byBhIHJlbW90ZSBjaGFubmVsXG5cdFx0KlxuXHRcdCogQWxsIG9wZXJhdGlvbnMgb24gdGhlIHByb3h5IGFyZSBmb3J3YXJkZWQgdG8gdGhlIHJlbW90ZS5cblx0XHQqXG5cdFx0KiBAcGFyYW0gdGFyZ2V0Q2hhbm5lbCAtIFRhcmdldCBjaGFubmVsIG5hbWVcblx0XHQqIEBwYXJhbSBiYXNlUGF0aCAtIEJhc2UgcGF0aCBmb3IgdGhlIHByb3h5XG5cdFx0Ki9cblx0XHRwcm94eSh0YXJnZXRDaGFubmVsLCBiYXNlUGF0aCA9IFtdKSB7XG5cdFx0XHRjb25zdCB0YXJnZXQgPSB0YXJnZXRDaGFubmVsID8/IHRoaXMuX2dldERlZmF1bHRUYXJnZXQoKTtcblx0XHRcdHJldHVybiB0aGlzLl9jcmVhdGVQcm94eSh0YXJnZXQsIGJhc2VQYXRoKTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBDcmVhdGUgcHJveHkgZm9yIGEgc3BlY2lmaWMgZXhwb3NlZCBtb2R1bGUgb24gcmVtb3RlXG5cdFx0KlxuXHRcdCogQHBhcmFtIG1vZHVsZU5hbWUgLSBOYW1lIG9mIHRoZSBleHBvc2VkIG1vZHVsZVxuXHRcdCogQHBhcmFtIHRhcmdldENoYW5uZWwgLSBUYXJnZXQgY2hhbm5lbFxuXHRcdCovXG5cdFx0cmVtb3RlKG1vZHVsZU5hbWUsIHRhcmdldENoYW5uZWwpIHtcblx0XHRcdHJldHVybiB0aGlzLnByb3h5KHRhcmdldENoYW5uZWwsIFttb2R1bGVOYW1lXSk7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogV3JhcCBhIGRlc2NyaXB0b3IgYXMgYSBwcm94eVxuXHRcdCovXG5cdFx0d3JhcERlc2NyaXB0b3IoZGVzY3JpcHRvciwgdGFyZ2V0Q2hhbm5lbCkge1xuXHRcdFx0Y29uc3QgaW52b2tlciA9IChhY3Rpb24sIHBhdGgsIGFyZ3MpID0+IHtcblx0XHRcdFx0Y29uc3QgY2hhbm5lbCA9IHRhcmdldENoYW5uZWwgPz8gZGVzY3JpcHRvcj8uY2hhbm5lbCA/PyB0aGlzLl9nZXREZWZhdWx0VGFyZ2V0KCk7XG5cdFx0XHRcdHJldHVybiB0aGlzLmludm9rZShjaGFubmVsLCBhY3Rpb24sIHBhdGgsIGFyZ3MpO1xuXHRcdFx0fTtcblx0XHRcdHJldHVybiB3cmFwRGVzY3JpcHRvcihkZXNjcmlwdG9yLCBpbnZva2VyLCB0YXJnZXRDaGFubmVsID8/IGRlc2NyaXB0b3I/LmNoYW5uZWwgPz8gdGhpcy5fZ2V0RGVmYXVsdFRhcmdldCgpKTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBTdWJzY3JpYmUgdG8gaW5jb21pbmcgbWVzc2FnZXNcblx0XHQqL1xuXHRcdHN1YnNjcmliZShoYW5kbGVyKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5faW5ib3VuZC5zdWJzY3JpYmUoaGFuZGxlcik7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogU2VuZCBhIG1lc3NhZ2UgKGZpcmUtYW5kLWZvcmdldClcblx0XHQqL1xuXHRcdG5leHQobWVzc2FnZSkge1xuXHRcdFx0dGhpcy5fc2VuZChtZXNzYWdlLmNoYW5uZWwsIG1lc3NhZ2UpO1xuXHRcdFx0dGhpcy5fb3V0Ym91bmQubmV4dChtZXNzYWdlKTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBFbWl0IGFuIGV2ZW50IHRvIGEgY2hhbm5lbFxuXHRcdCovXG5cdFx0ZW1pdCh0YXJnZXRDaGFubmVsLCBldmVudFR5cGUsIGRhdGEpIHtcblx0XHRcdGNvbnN0IG1lc3NhZ2UgPSB7XG5cdFx0XHRcdGlkOiBVVUlEdjQoKSxcblx0XHRcdFx0Y2hhbm5lbDogdGFyZ2V0Q2hhbm5lbCxcblx0XHRcdFx0c2VuZGVyOiB0aGlzLl9uYW1lLFxuXHRcdFx0XHR0eXBlOiBcImV2ZW50XCIsXG5cdFx0XHRcdHBheWxvYWQ6IHtcblx0XHRcdFx0XHR0eXBlOiBldmVudFR5cGUsXG5cdFx0XHRcdFx0ZGF0YVxuXHRcdFx0XHR9LFxuXHRcdFx0XHR0aW1lc3RhbXA6IERhdGUubm93KClcblx0XHRcdH07XG5cdFx0XHR0aGlzLm5leHQobWVzc2FnZSk7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogRW1pdCBjb25uZWN0aW9uLWxldmVsIHNpZ25hbCB0byBhIHNwZWNpZmljIGNvbm5lY3RlZCBjaGFubmVsLlxuXHRcdCogVGhpcyBpcyB0aGUgY2Fub25pY2FsIG5vdGlmeS9jb25uZWN0IEFQSSBmb3IgZmFjYWRlIGxheWVycy5cblx0XHQqL1xuXHRcdG5vdGlmeSh0YXJnZXRDaGFubmVsLCBwYXlsb2FkID0ge30sIHR5cGUgPSBcIm5vdGlmeVwiKSB7XG5cdFx0XHRjb25zdCBiaW5kaW5nID0gdGhpcy5fdHJhbnNwb3J0cy5nZXQodGFyZ2V0Q2hhbm5lbCk7XG5cdFx0XHRpZiAoIWJpbmRpbmcpIHJldHVybiBmYWxzZTtcblx0XHRcdHRoaXMuX2VtaXRDb25uZWN0aW9uU2lnbmFsKGJpbmRpbmcsIHR5cGUsIHtcblx0XHRcdFx0ZnJvbTogdGhpcy5fbmFtZSxcblx0XHRcdFx0dG86IHRhcmdldENoYW5uZWwsXG5cdFx0XHRcdC4uLnBheWxvYWRcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdC8qKiBPYnNlcnZhYmxlOiBJbmNvbWluZyBtZXNzYWdlcyAqL1xuXHRcdGdldCBvbk1lc3NhZ2UoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5faW5ib3VuZDtcblx0XHR9XG5cdFx0LyoqIE9ic2VydmFibGU6IE91dGdvaW5nIG1lc3NhZ2VzICovXG5cdFx0Z2V0IG9uT3V0Ym91bmQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fb3V0Ym91bmQ7XG5cdFx0fVxuXHRcdC8qKiBPYnNlcnZhYmxlOiBJbmNvbWluZyBpbnZvY2F0aW9ucyAqL1xuXHRcdGdldCBvbkludm9jYXRpb24oKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5faW52b2NhdGlvbnM7XG5cdFx0fVxuXHRcdC8qKiBPYnNlcnZhYmxlOiBPdXRnb2luZyByZXNwb25zZXMgKi9cblx0XHRnZXQgb25SZXNwb25zZSgpIHtcblx0XHRcdHJldHVybiB0aGlzLl9yZXNwb25zZXM7XG5cdFx0fVxuXHRcdC8qKiBPYnNlcnZhYmxlOiBDb25uZWN0aW9uIGV2ZW50cyAoY29ubmVjdGVkL25vdGlmaWVkL2Rpc2Nvbm5lY3RlZCkgKi9cblx0XHRnZXQgb25Db25uZWN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2Nvbm5lY3Rpb25FdmVudHM7XG5cdFx0fVxuXHRcdHN1YnNjcmliZUNvbm5lY3Rpb25zKGhhbmRsZXIpIHtcblx0XHRcdHJldHVybiB0aGlzLl9jb25uZWN0aW9uRXZlbnRzLnN1YnNjcmliZShoYW5kbGVyKTtcblx0XHR9XG5cdFx0cXVlcnlDb25uZWN0aW9ucyhxdWVyeSA9IHt9KSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY29ubmVjdGlvblJlZ2lzdHJ5LnF1ZXJ5KHF1ZXJ5KTtcblx0XHR9XG5cdFx0bm90aWZ5Q29ubmVjdGlvbnMocGF5bG9hZCA9IHt9LCBxdWVyeSA9IHt9KSB7XG5cdFx0XHRsZXQgc2VudCA9IDA7XG5cdFx0XHRjb25zdCB0YXJnZXRzID0gdGhpcy5xdWVyeUNvbm5lY3Rpb25zKHtcblx0XHRcdFx0Li4ucXVlcnksXG5cdFx0XHRcdHN0YXR1czogXCJhY3RpdmVcIixcblx0XHRcdFx0aW5jbHVkZUNsb3NlZDogZmFsc2Vcblx0XHRcdH0pO1xuXHRcdFx0Zm9yIChjb25zdCBjb25uZWN0aW9uIG9mIHRhcmdldHMpIHtcblx0XHRcdFx0Y29uc3QgYmluZGluZyA9IHRoaXMuX3RyYW5zcG9ydHMuZ2V0KGNvbm5lY3Rpb24ucmVtb3RlQ2hhbm5lbCk7XG5cdFx0XHRcdGlmICghYmluZGluZykgY29udGludWU7XG5cdFx0XHRcdHRoaXMuX2VtaXRDb25uZWN0aW9uU2lnbmFsKGJpbmRpbmcsIFwibm90aWZ5XCIsIHtcblx0XHRcdFx0XHRjb25uZWN0aW9uSWQ6IGNvbm5lY3Rpb24uaWQsXG5cdFx0XHRcdFx0ZnJvbTogdGhpcy5fbmFtZSxcblx0XHRcdFx0XHR0bzogY29ubmVjdGlvbi5yZW1vdGVDaGFubmVsLFxuXHRcdFx0XHRcdC4uLnBheWxvYWRcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHNlbnQrKztcblx0XHRcdH1cblx0XHRcdHJldHVybiBzZW50O1xuXHRcdH1cblx0XHQvKiogQ2hhbm5lbCBuYW1lICovXG5cdFx0Z2V0IG5hbWUoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fbmFtZTtcblx0XHR9XG5cdFx0LyoqIERldGVjdGVkIGNvbnRleHQgdHlwZSAqL1xuXHRcdGdldCBjb250ZXh0VHlwZSgpIHtcblx0XHRcdHJldHVybiB0aGlzLl9jb250ZXh0VHlwZTtcblx0XHR9XG5cdFx0LyoqIENvbmZpZ3VyYXRpb24gKi9cblx0XHRnZXQgY29uZmlnKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2NvbmZpZztcblx0XHR9XG5cdFx0LyoqIENvbm5lY3RlZCB0cmFuc3BvcnQgbmFtZXMgKi9cblx0XHRnZXQgY29ubmVjdGVkQ2hhbm5lbHMoKSB7XG5cdFx0XHRyZXR1cm4gWy4uLnRoaXMuX3RyYW5zcG9ydHMua2V5cygpXTtcblx0XHR9XG5cdFx0LyoqIEV4cG9zZWQgbW9kdWxlIG5hbWVzICovXG5cdFx0Z2V0IGV4cG9zZWRNb2R1bGVzKCkge1xuXHRcdFx0cmV0dXJuIFsuLi50aGlzLl9leHBvc2VkLmtleXMoKV07XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogQ2xvc2UgYWxsIGNvbm5lY3Rpb25zIGFuZCBjbGVhbnVwXG5cdFx0Ki9cblx0XHRjbG9zZSgpIHtcblx0XHRcdHRoaXMuX3N1YnNjcmlwdGlvbnMuZm9yRWFjaCgocykgPT4gcy51bnN1YnNjcmliZSgpKTtcblx0XHRcdHRoaXMuX3N1YnNjcmlwdGlvbnMgPSBbXTtcblx0XHRcdHRoaXMuX3BlbmRpbmcuY2xlYXIoKTtcblx0XHRcdHRoaXMuX21hcmtBbGxDb25uZWN0aW9uc0Nsb3NlZCgpO1xuXHRcdFx0Zm9yIChjb25zdCBiaW5kaW5nIG9mIHRoaXMuX3RyYW5zcG9ydHMudmFsdWVzKCkpIHtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRiaW5kaW5nLmNsZWFudXA/LigpO1xuXHRcdFx0XHR9IGNhdGNoIHt9XG5cdFx0XHRcdGlmIChiaW5kaW5nLnRyYW5zcG9ydFR5cGUgPT09IFwibWVzc2FnZS1wb3J0XCIgfHwgYmluZGluZy50cmFuc3BvcnRUeXBlID09PSBcImJyb2FkY2FzdFwiKSB0cnkge1xuXHRcdFx0XHRcdGJpbmRpbmcudGFyZ2V0Py5jbG9zZT8uKCk7XG5cdFx0XHRcdH0gY2F0Y2gge31cblx0XHRcdH1cblx0XHRcdHRoaXMuX3RyYW5zcG9ydHMuY2xlYXIoKTtcblx0XHRcdHRoaXMuX2RlZmF1bHRUcmFuc3BvcnQgPSBudWxsO1xuXHRcdFx0dGhpcy5fY29ubmVjdGlvblJlZ2lzdHJ5LmNsZWFyKCk7XG5cdFx0XHR0aGlzLl9pbmJvdW5kLmNvbXBsZXRlKCk7XG5cdFx0XHR0aGlzLl9vdXRib3VuZC5jb21wbGV0ZSgpO1xuXHRcdFx0dGhpcy5faW52b2NhdGlvbnMuY29tcGxldGUoKTtcblx0XHRcdHRoaXMuX3Jlc3BvbnNlcy5jb21wbGV0ZSgpO1xuXHRcdFx0dGhpcy5fY29ubmVjdGlvbkV2ZW50cy5jb21wbGV0ZSgpO1xuXHRcdH1cblx0XHRfaGFuZGxlSW5jb21pbmcoZGF0YSkge1xuXHRcdFx0aWYgKCFkYXRhIHx8IHR5cGVvZiBkYXRhICE9PSBcIm9iamVjdFwiKSByZXR1cm47XG5cdFx0XHR0aGlzLl9pbmJvdW5kLm5leHQoZGF0YSk7XG5cdFx0XHRzd2l0Y2ggKGRhdGEudHlwZSkge1xuXHRcdFx0XHRjYXNlIFwicmVxdWVzdFwiOlxuXHRcdFx0XHRcdGlmIChkYXRhLmNoYW5uZWwgPT09IHRoaXMuX25hbWUpIHRoaXMuX2hhbmRsZVJlcXVlc3QoZGF0YSk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJyZXNwb25zZVwiOlxuXHRcdFx0XHRcdHRoaXMuX2hhbmRsZVJlc3BvbnNlKGRhdGEpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwiZXZlbnRcIjogYnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJzaWduYWxcIjogdGhpcy5faGFuZGxlU2lnbmFsKGRhdGEpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRfaGFuZGxlUmVzcG9uc2UoZGF0YSkge1xuXHRcdFx0Y29uc3QgaWQgPSBkYXRhLnJlcUlkID8/IGRhdGEuaWQ7XG5cdFx0XHRjb25zdCByZXNvbHZlcnMgPSB0aGlzLl9wZW5kaW5nLmdldChpZCk7XG5cdFx0XHRpZiAocmVzb2x2ZXJzKSB7XG5cdFx0XHRcdHRoaXMuX3BlbmRpbmcuZGVsZXRlKGlkKTtcblx0XHRcdFx0aWYgKGRhdGEucGF5bG9hZD8uZXJyb3IpIHJlc29sdmVycy5yZWplY3QobmV3IEVycm9yKGRhdGEucGF5bG9hZC5lcnJvcikpO1xuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRjb25zdCByZXN1bHQgPSBkYXRhLnBheWxvYWQ/LnJlc3VsdDtcblx0XHRcdFx0XHRjb25zdCBkZXNjcmlwdG9yID0gZGF0YS5wYXlsb2FkPy5kZXNjcmlwdG9yO1xuXHRcdFx0XHRcdGlmIChyZXN1bHQgIT09IG51bGwgJiYgcmVzdWx0ICE9PSB2b2lkIDApIHJlc29sdmVycy5yZXNvbHZlKHJlc3VsdCk7XG5cdFx0XHRcdFx0ZWxzZSBpZiAoZGVzY3JpcHRvcikgcmVzb2x2ZXJzLnJlc29sdmUodGhpcy53cmFwRGVzY3JpcHRvcihkZXNjcmlwdG9yLCBkYXRhLnNlbmRlcikpO1xuXHRcdFx0XHRcdGVsc2UgcmVzb2x2ZXJzLnJlc29sdmUodm9pZCAwKTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLl9yZXNwb25zZXMubmV4dCh7XG5cdFx0XHRcdFx0aWQsXG5cdFx0XHRcdFx0Y2hhbm5lbDogZGF0YS5jaGFubmVsLFxuXHRcdFx0XHRcdHNlbmRlcjogZGF0YS5zZW5kZXIsXG5cdFx0XHRcdFx0cmVzdWx0OiBkYXRhLnBheWxvYWQ/LnJlc3VsdCxcblx0XHRcdFx0XHRkZXNjcmlwdG9yOiBkYXRhLnBheWxvYWQ/LmRlc2NyaXB0b3IsXG5cdFx0XHRcdFx0dGltZXN0YW1wOiBEYXRlLm5vdygpXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRhc3luYyBfaGFuZGxlUmVxdWVzdChkYXRhKSB7XG5cdFx0XHRjb25zdCBwYXlsb2FkID0gZGF0YS5wYXlsb2FkO1xuXHRcdFx0aWYgKCFwYXlsb2FkKSByZXR1cm47XG5cdFx0XHRjb25zdCB7IGFjdGlvbiwgcGF0aCwgYXJncywgc2VuZGVyIH0gPSBwYXlsb2FkO1xuXHRcdFx0Y29uc3QgcmVxSWQgPSBkYXRhLnJlcUlkID8/IGRhdGEuaWQ7XG5cdFx0XHR0aGlzLl9pbnZvY2F0aW9ucy5uZXh0KHtcblx0XHRcdFx0aWQ6IHJlcUlkLFxuXHRcdFx0XHRjaGFubmVsOiB0aGlzLl9uYW1lLFxuXHRcdFx0XHRzZW5kZXIsXG5cdFx0XHRcdGFjdGlvbixcblx0XHRcdFx0cGF0aCxcblx0XHRcdFx0YXJnczogYXJncyA/PyBbXSxcblx0XHRcdFx0dGltZXN0YW1wOiBEYXRlLm5vdygpLFxuXHRcdFx0XHRjb250ZXh0VHlwZTogZGV0ZWN0SW5jb21pbmdDb250ZXh0VHlwZShkYXRhKVxuXHRcdFx0fSk7XG5cdFx0XHRjb25zdCB7IHJlc3VsdCwgdG9UcmFuc2ZlciwgbmV3UGF0aCB9ID0gYXdhaXQgdGhpcy5fZXhlY3V0ZUFjdGlvbihhY3Rpb24sIHBhdGgsIGFyZ3MgPz8gW10sIHNlbmRlcik7XG5cdFx0XHRhd2FpdCB0aGlzLl9zZW5kUmVzcG9uc2UocmVxSWQsIGFjdGlvbiwgc2VuZGVyLCBuZXdQYXRoLCByZXN1bHQsIHRvVHJhbnNmZXIpO1xuXHRcdH1cblx0XHRhc3luYyBfZXhlY3V0ZUFjdGlvbihhY3Rpb24sIHBhdGgsIGFyZ3MsIHNlbmRlcikge1xuXHRcdFx0Y29uc3QgeyByZXN1bHQsIHRvVHJhbnNmZXIsIHBhdGg6IG5ld1BhdGggfSA9IGV4ZWN1dGVBY3Rpb24oYWN0aW9uLCBwYXRoLCBhcmdzLCB7XG5cdFx0XHRcdGNoYW5uZWw6IHRoaXMuX25hbWUsXG5cdFx0XHRcdHNlbmRlcixcblx0XHRcdFx0cmVmbGVjdDogdGhpcy5fY29uZmlnLnJlZmxlY3Rcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0cmVzdWx0OiBhd2FpdCByZXN1bHQsXG5cdFx0XHRcdHRvVHJhbnNmZXIsXG5cdFx0XHRcdG5ld1BhdGhcblx0XHRcdH07XG5cdFx0fVxuXHRcdGFzeW5jIF9zZW5kUmVzcG9uc2UocmVxSWQsIGFjdGlvbiwgc2VuZGVyLCBwYXRoLCByYXdSZXN1bHQsIHRvVHJhbnNmZXIpIHtcblx0XHRcdGNvbnN0IHsgcmVzcG9uc2U6IGNvcmVSZXNwb25zZSwgdHJhbnNmZXIgfSA9IGF3YWl0IGJ1aWxkUmVzcG9uc2UocmVxSWQsIGFjdGlvbiwgdGhpcy5fbmFtZSwgc2VuZGVyLCBwYXRoLCByYXdSZXN1bHQsIHRvVHJhbnNmZXIpO1xuXHRcdFx0Y29uc3QgcmVzcG9uc2UgPSB7XG5cdFx0XHRcdGlkOiByZXFJZCxcblx0XHRcdFx0Li4uY29yZVJlc3BvbnNlLFxuXHRcdFx0XHR0aW1lc3RhbXA6IERhdGUubm93KCksXG5cdFx0XHRcdHRyYW5zZmVyYWJsZTogdHJhbnNmZXJcblx0XHRcdH07XG5cdFx0XHR0aGlzLl9zZW5kKHNlbmRlciwgcmVzcG9uc2UsIHRyYW5zZmVyKTtcblx0XHR9XG5cdFx0X2hhbmRsZVNpZ25hbChkYXRhKSB7XG5cdFx0XHRjb25zdCBwYXlsb2FkID0gZGF0YT8ucGF5bG9hZCA/PyB7fTtcblx0XHRcdGNvbnN0IHJlbW90ZUNoYW5uZWwgPSBwYXlsb2FkLmZyb20gPz8gZGF0YS5zZW5kZXIgPz8gXCJ1bmtub3duXCI7XG5cdFx0XHRjb25zdCB0cmFuc3BvcnRUeXBlID0gZGF0YS50cmFuc3BvcnRUeXBlID8/IHRoaXMuX3RyYW5zcG9ydHMuZ2V0KGRhdGEuY2hhbm5lbCk/LnRyYW5zcG9ydFR5cGUgPz8gXCJpbnRlcm5hbFwiO1xuXHRcdFx0Y29uc3QgY29ubmVjdGlvbiA9IHRoaXMuX3JlZ2lzdGVyQ29ubmVjdGlvbih7XG5cdFx0XHRcdGxvY2FsQ2hhbm5lbDogdGhpcy5fbmFtZSxcblx0XHRcdFx0cmVtb3RlQ2hhbm5lbCxcblx0XHRcdFx0c2VuZGVyOiBkYXRhLnNlbmRlciA/PyByZW1vdGVDaGFubmVsLFxuXHRcdFx0XHR0cmFuc3BvcnRUeXBlLFxuXHRcdFx0XHRkaXJlY3Rpb246IFwiaW5jb21pbmdcIlxuXHRcdFx0fSk7XG5cdFx0XHR0aGlzLl9tYXJrQ29ubmVjdGlvbk5vdGlmaWVkKGNvbm5lY3Rpb24sIHBheWxvYWQpO1xuXHRcdH1cblx0XHRfcmVnaXN0ZXJDb25uZWN0aW9uKHBhcmFtcykge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2Nvbm5lY3Rpb25SZWdpc3RyeS5yZWdpc3RlcihwYXJhbXMpO1xuXHRcdH1cblx0XHRfbWFya0Nvbm5lY3Rpb25Ob3RpZmllZChjb25uZWN0aW9uLCBwYXlsb2FkKSB7XG5cdFx0XHR0aGlzLl9jb25uZWN0aW9uUmVnaXN0cnkubWFya05vdGlmaWVkKGNvbm5lY3Rpb24sIHBheWxvYWQpO1xuXHRcdH1cblx0XHRfZW1pdENvbm5lY3Rpb25TaWduYWwoYmluZGluZywgc2lnbmFsVHlwZSwgcGF5bG9hZCA9IHt9KSB7XG5cdFx0XHRjb25zdCBtZXNzYWdlID0ge1xuXHRcdFx0XHRpZDogVVVJRHY0KCksXG5cdFx0XHRcdHR5cGU6IFwic2lnbmFsXCIsXG5cdFx0XHRcdGNoYW5uZWw6IGJpbmRpbmcudGFyZ2V0Q2hhbm5lbCxcblx0XHRcdFx0c2VuZGVyOiB0aGlzLl9uYW1lLFxuXHRcdFx0XHR0cmFuc3BvcnRUeXBlOiBiaW5kaW5nLnRyYW5zcG9ydFR5cGUsXG5cdFx0XHRcdHBheWxvYWQ6IHtcblx0XHRcdFx0XHR0eXBlOiBzaWduYWxUeXBlLFxuXHRcdFx0XHRcdGZyb206IHRoaXMuX25hbWUsXG5cdFx0XHRcdFx0dG86IGJpbmRpbmcudGFyZ2V0Q2hhbm5lbCxcblx0XHRcdFx0XHQuLi5wYXlsb2FkXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHRpbWVzdGFtcDogRGF0ZS5ub3coKVxuXHRcdFx0fTtcblx0XHRcdChiaW5kaW5nPy5zZW5kZXIgPz8gYmluZGluZz8ucG9zdE1lc3NhZ2UpPy5jYWxsKGJpbmRpbmcsIG1lc3NhZ2UpO1xuXHRcdFx0Y29uc3QgY29ubmVjdGlvbiA9IHRoaXMuX3JlZ2lzdGVyQ29ubmVjdGlvbih7XG5cdFx0XHRcdGxvY2FsQ2hhbm5lbDogdGhpcy5fbmFtZSxcblx0XHRcdFx0cmVtb3RlQ2hhbm5lbDogYmluZGluZy50YXJnZXRDaGFubmVsLFxuXHRcdFx0XHRzZW5kZXI6IHRoaXMuX25hbWUsXG5cdFx0XHRcdHRyYW5zcG9ydFR5cGU6IGJpbmRpbmcudHJhbnNwb3J0VHlwZSxcblx0XHRcdFx0ZGlyZWN0aW9uOiBcIm91dGdvaW5nXCJcblx0XHRcdH0pO1xuXHRcdFx0dGhpcy5fbWFya0Nvbm5lY3Rpb25Ob3RpZmllZChjb25uZWN0aW9uLCBtZXNzYWdlLnBheWxvYWQpO1xuXHRcdH1cblx0XHRfc2VuZFNpZ25hbFRvVGFyZ2V0KHRhcmdldCwgdHJhbnNwb3J0VHlwZSwgcGF5bG9hZCwgc2lnbmFsVHlwZSkge1xuXHRcdFx0Y29uc3QgbWVzc2FnZSA9IHtcblx0XHRcdFx0aWQ6IFVVSUR2NCgpLFxuXHRcdFx0XHR0eXBlOiBcInNpZ25hbFwiLFxuXHRcdFx0XHRjaGFubmVsOiBwYXlsb2FkLnRvID8/IHRoaXMuX25hbWUsXG5cdFx0XHRcdHNlbmRlcjogdGhpcy5fbmFtZSxcblx0XHRcdFx0dHJhbnNwb3J0VHlwZSxcblx0XHRcdFx0cGF5bG9hZDoge1xuXHRcdFx0XHRcdHR5cGU6IHNpZ25hbFR5cGUsXG5cdFx0XHRcdFx0Li4ucGF5bG9hZFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR0aW1lc3RhbXA6IERhdGUubm93KClcblx0XHRcdH07XG5cdFx0XHR0cnkge1xuXHRcdFx0XHRpZiAodHJhbnNwb3J0VHlwZSA9PT0gXCJ3ZWJzb2NrZXRcIikge1xuXHRcdFx0XHRcdHRhcmdldD8uc2VuZD8uKEpTT04uc3RyaW5naWZ5KG1lc3NhZ2UpKTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHRyYW5zcG9ydFR5cGUgPT09IFwiY2hyb21lLXJ1bnRpbWVcIikge1xuXHRcdFx0XHRcdGNocm9tZS5ydW50aW1lPy5zZW5kTWVzc2FnZT8uKG1lc3NhZ2UpO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodHJhbnNwb3J0VHlwZSA9PT0gXCJjaHJvbWUtdGFic1wiKSB7XG5cdFx0XHRcdFx0Y29uc3QgdGFiSWQgPSBwYXlsb2FkLnRhYklkO1xuXHRcdFx0XHRcdGlmICh0YWJJZCAhPSBudWxsKSBjaHJvbWUudGFicz8uc2VuZE1lc3NhZ2U/Lih0YWJJZCwgbWVzc2FnZSk7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh0cmFuc3BvcnRUeXBlID09PSBcImNocm9tZS1wb3J0XCIpIHtcblx0XHRcdFx0XHR0YXJnZXQ/LnBvc3RNZXNzYWdlPy4obWVzc2FnZSk7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh0cmFuc3BvcnRUeXBlID09PSBcImNocm9tZS1leHRlcm5hbFwiKSB7XG5cdFx0XHRcdFx0aWYgKHBheWxvYWQuZXh0ZXJuYWxJZCkgY2hyb21lLnJ1bnRpbWU/LnNlbmRNZXNzYWdlPy4ocGF5bG9hZC5leHRlcm5hbElkLCBtZXNzYWdlKTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0dGFyZ2V0Py5wb3N0TWVzc2FnZT8uKG1lc3NhZ2UsIHsgdHJhbnNmZXI6IFtdIH0pO1xuXHRcdFx0fSBjYXRjaCB7fVxuXHRcdH1cblx0XHRfbWFya0FsbENvbm5lY3Rpb25zQ2xvc2VkKCkge1xuXHRcdFx0dGhpcy5fY29ubmVjdGlvblJlZ2lzdHJ5LmNsb3NlQWxsKCk7XG5cdFx0fVxuXHRcdF9jcmVhdGVUcmFuc3BvcnRCaW5kaW5nKHRhcmdldCwgdHJhbnNwb3J0VHlwZSwgdGFyZ2V0Q2hhbm5lbCwgb3B0aW9ucykge1xuXHRcdFx0bGV0IHNlbmRlcjtcblx0XHRcdGxldCBjbGVhbnVwO1xuXHRcdFx0c3dpdGNoICh0cmFuc3BvcnRUeXBlKSB7XG5cdFx0XHRcdGNhc2UgXCJ3b3JrZXJcIjpcblx0XHRcdFx0Y2FzZSBcIm1lc3NhZ2UtcG9ydFwiOlxuXHRcdFx0XHRjYXNlIFwiYnJvYWRjYXN0XCI6XG5cdFx0XHRcdFx0aWYgKG9wdGlvbnMuYXV0b1N0YXJ0ICE9PSBmYWxzZSAmJiB0YXJnZXQuc3RhcnQpIHRhcmdldC5zdGFydCgpO1xuXHRcdFx0XHRcdHNlbmRlciA9IChtc2csIHRyYW5zZmVyKSA9PiB0YXJnZXQucG9zdE1lc3NhZ2UobXNnLCB7IHRyYW5zZmVyIH0pO1xuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGNvbnN0IGxpc3RlbmVyID0gKChlKSA9PiB0aGlzLl9oYW5kbGVJbmNvbWluZyhlLmRhdGEpKTtcblx0XHRcdFx0XHRcdHRhcmdldC5hZGRFdmVudExpc3RlbmVyPy4oXCJtZXNzYWdlXCIsIGxpc3RlbmVyKTtcblx0XHRcdFx0XHRcdGNsZWFudXAgPSAoKSA9PiB0YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcj8uKFwibWVzc2FnZVwiLCBsaXN0ZW5lcik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwid2Vic29ja2V0XCI6XG5cdFx0XHRcdFx0c2VuZGVyID0gKG1zZykgPT4gdGFyZ2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkobXNnKSk7XG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0Y29uc3QgbGlzdGVuZXIgPSAoKGUpID0+IHtcblx0XHRcdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdFx0XHR0aGlzLl9oYW5kbGVJbmNvbWluZyhKU09OLnBhcnNlKGUuZGF0YSkpO1xuXHRcdFx0XHRcdFx0XHR9IGNhdGNoIHt9XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdHRhcmdldC5hZGRFdmVudExpc3RlbmVyPy4oXCJtZXNzYWdlXCIsIGxpc3RlbmVyKTtcblx0XHRcdFx0XHRcdGNsZWFudXAgPSAoKSA9PiB0YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcj8uKFwibWVzc2FnZVwiLCBsaXN0ZW5lcik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwiY2hyb21lLXJ1bnRpbWVcIjpcblx0XHRcdFx0XHRzZW5kZXIgPSAobXNnKSA9PiBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZShtc2cpO1xuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGNvbnN0IGxpc3RlbmVyID0gKG1zZykgPT4gdGhpcy5faGFuZGxlSW5jb21pbmcobXNnKTtcblx0XHRcdFx0XHRcdGNocm9tZS5ydW50aW1lLm9uTWVzc2FnZT8uYWRkTGlzdGVuZXI/LihsaXN0ZW5lcik7XG5cdFx0XHRcdFx0XHRjbGVhbnVwID0gKCkgPT4gY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlPy5yZW1vdmVMaXN0ZW5lcj8uKGxpc3RlbmVyKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJjaHJvbWUtdGFic1wiOlxuXHRcdFx0XHRcdHNlbmRlciA9IChtc2cpID0+IHtcblx0XHRcdFx0XHRcdGlmIChvcHRpb25zLnRhYklkICE9IG51bGwpIGNocm9tZS50YWJzPy5zZW5kTWVzc2FnZT8uKG9wdGlvbnMudGFiSWQsIG1zZyk7XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRjb25zdCBsaXN0ZW5lciA9IChtc2csIHNlbmRlck1ldGEpID0+IHtcblx0XHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMudGFiSWQgIT0gbnVsbCAmJiBzZW5kZXJNZXRhPy50YWI/LmlkICE9PSBvcHRpb25zLnRhYklkKSByZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdHRoaXMuX2hhbmRsZUluY29taW5nKG1zZyk7XG5cdFx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdGNocm9tZS5ydW50aW1lLm9uTWVzc2FnZT8uYWRkTGlzdGVuZXI/LihsaXN0ZW5lcik7XG5cdFx0XHRcdFx0XHRjbGVhbnVwID0gKCkgPT4gY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlPy5yZW1vdmVMaXN0ZW5lcj8uKGxpc3RlbmVyKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJjaHJvbWUtcG9ydFwiOlxuXHRcdFx0XHRcdGlmICh0YXJnZXQ/LnBvc3RNZXNzYWdlICYmIHRhcmdldD8ub25NZXNzYWdlPy5hZGRMaXN0ZW5lcikge1xuXHRcdFx0XHRcdFx0c2VuZGVyID0gKG1zZykgPT4gdGFyZ2V0LnBvc3RNZXNzYWdlKG1zZyk7XG5cdFx0XHRcdFx0XHRjb25zdCBsaXN0ZW5lciA9IChtc2cpID0+IHRoaXMuX2hhbmRsZUluY29taW5nKG1zZyk7XG5cdFx0XHRcdFx0XHR0YXJnZXQub25NZXNzYWdlLmFkZExpc3RlbmVyKGxpc3RlbmVyKTtcblx0XHRcdFx0XHRcdGNsZWFudXAgPSAoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRcdFx0dGFyZ2V0Lm9uTWVzc2FnZS5yZW1vdmVMaXN0ZW5lcihsaXN0ZW5lcik7XG5cdFx0XHRcdFx0XHRcdH0gY2F0Y2gge31cblx0XHRcdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdFx0XHR0YXJnZXQuZGlzY29ubmVjdD8uKCk7XG5cdFx0XHRcdFx0XHRcdH0gY2F0Y2gge31cblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGNvbnN0IHBvcnROYW1lID0gb3B0aW9ucy5wb3J0TmFtZSA/PyB0YXJnZXRDaGFubmVsO1xuXHRcdFx0XHRcdFx0Y29uc3QgcG9ydCA9IG9wdGlvbnMudGFiSWQgIT0gbnVsbCAmJiBjaHJvbWUudGFicz8uY29ubmVjdCA/IGNocm9tZS50YWJzLmNvbm5lY3Qob3B0aW9ucy50YWJJZCwgeyBuYW1lOiBwb3J0TmFtZSB9KSA6IGNocm9tZS5ydW50aW1lLmNvbm5lY3QoeyBuYW1lOiBwb3J0TmFtZSB9KTtcblx0XHRcdFx0XHRcdHNlbmRlciA9IChtc2cpID0+IHBvcnQucG9zdE1lc3NhZ2UobXNnKTtcblx0XHRcdFx0XHRcdGNvbnN0IGxpc3RlbmVyID0gKG1zZykgPT4gdGhpcy5faGFuZGxlSW5jb21pbmcobXNnKTtcblx0XHRcdFx0XHRcdHBvcnQub25NZXNzYWdlLmFkZExpc3RlbmVyKGxpc3RlbmVyKTtcblx0XHRcdFx0XHRcdGNsZWFudXAgPSAoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRcdFx0cG9ydC5vbk1lc3NhZ2UucmVtb3ZlTGlzdGVuZXIobGlzdGVuZXIpO1xuXHRcdFx0XHRcdFx0XHR9IGNhdGNoIHt9XG5cdFx0XHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRcdFx0cG9ydC5kaXNjb25uZWN0KCk7XG5cdFx0XHRcdFx0XHRcdH0gY2F0Y2gge31cblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwiY2hyb21lLWV4dGVybmFsXCI6XG5cdFx0XHRcdFx0c2VuZGVyID0gKG1zZykgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMuZXh0ZXJuYWxJZCkgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2Uob3B0aW9ucy5leHRlcm5hbElkLCBtc2cpO1xuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0Y29uc3QgbGlzdGVuZXIgPSAobXNnKSA9PiB7XG5cdFx0XHRcdFx0XHRcdHRoaXMuX2hhbmRsZUluY29taW5nKG1zZyk7XG5cdFx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdGNocm9tZS5ydW50aW1lLm9uTWVzc2FnZUV4dGVybmFsPy5hZGRMaXN0ZW5lcj8uKGxpc3RlbmVyKTtcblx0XHRcdFx0XHRcdGNsZWFudXAgPSAoKSA9PiBjaHJvbWUucnVudGltZS5vbk1lc3NhZ2VFeHRlcm5hbD8ucmVtb3ZlTGlzdGVuZXI/LihsaXN0ZW5lcik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwic2VsZlwiOlxuXHRcdFx0XHRcdHNlbmRlciA9IChtc2csIHRyYW5zZmVyKSA9PiBnbG9iYWxUaGlzLnBvc3RNZXNzYWdlPy4obXNnLCB7IHRyYW5zZmVyOiB0cmFuc2ZlciA/PyBbXSB9KTtcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRjb25zdCBsaXN0ZW5lciA9ICgoZSkgPT4gdGhpcy5faGFuZGxlSW5jb21pbmcoZS5kYXRhKSk7XG5cdFx0XHRcdFx0XHRnbG9iYWxUaGlzLmFkZEV2ZW50TGlzdGVuZXI/LihcIm1lc3NhZ2VcIiwgbGlzdGVuZXIpO1xuXHRcdFx0XHRcdFx0Y2xlYW51cCA9ICgpID0+IGdsb2JhbFRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcj8uKFwibWVzc2FnZVwiLCBsaXN0ZW5lcik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdGlmIChvcHRpb25zLm9uTWVzc2FnZSkgY2xlYW51cCA9IG9wdGlvbnMub25NZXNzYWdlKChtc2cpID0+IHRoaXMuX2hhbmRsZUluY29taW5nKG1zZykpO1xuXHRcdFx0XHRcdHNlbmRlciA9IChtc2cpID0+IHRhcmdldD8ucG9zdE1lc3NhZ2U/Lihtc2cpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dGFyZ2V0LFxuXHRcdFx0XHR0YXJnZXRDaGFubmVsLFxuXHRcdFx0XHR0cmFuc3BvcnRUeXBlLFxuXHRcdFx0XHRzZW5kZXIsXG5cdFx0XHRcdGNsZWFudXAsXG5cdFx0XHRcdHBvc3RNZXNzYWdlOiAobWVzc2FnZSwgb3B0aW9ucykgPT4gc2VuZGVyPy4obWVzc2FnZSwgb3B0aW9ucyksXG5cdFx0XHRcdHN0YXJ0OiAoKSA9PiB0YXJnZXQ/LnN0YXJ0Py4oKSxcblx0XHRcdFx0Y2xvc2U6ICgpID0+IHRhcmdldD8uY2xvc2U/LigpXG5cdFx0XHR9O1xuXHRcdH1cblx0XHRfc2VuZCh0YXJnZXRDaGFubmVsLCBtZXNzYWdlLCB0cmFuc2Zlcikge1xuXHRcdFx0Y29uc3QgYmluZGluZyA9IHRoaXMuX3RyYW5zcG9ydHMuZ2V0KHRhcmdldENoYW5uZWwpID8/IHRoaXMuX2RlZmF1bHRUcmFuc3BvcnQ7XG5cdFx0XHQoYmluZGluZz8uc2VuZGVyID8/IGJpbmRpbmc/LnBvc3RNZXNzYWdlKT8uY2FsbChiaW5kaW5nLCBtZXNzYWdlLCB0cmFuc2Zlcik7XG5cdFx0fVxuXHRcdF9nZXREZWZhdWx0VGFyZ2V0KCkge1xuXHRcdFx0aWYgKHRoaXMuX2RlZmF1bHRUcmFuc3BvcnQpIHJldHVybiB0aGlzLl9kZWZhdWx0VHJhbnNwb3J0LnRhcmdldENoYW5uZWw7XG5cdFx0XHRyZXR1cm4gXCJ3b3JrZXJcIjtcblx0XHR9XG5cdFx0X2luZmVyVGFyZ2V0Q2hhbm5lbCh0YXJnZXQsIHRyYW5zcG9ydFR5cGUpIHtcblx0XHRcdGlmICh0cmFuc3BvcnRUeXBlID09PSBcIndvcmtlclwiKSByZXR1cm4gXCJ3b3JrZXJcIjtcblx0XHRcdGlmICh0cmFuc3BvcnRUeXBlID09PSBcImJyb2FkY2FzdFwiICYmIHRhcmdldC5uYW1lKSByZXR1cm4gdGFyZ2V0Lm5hbWU7XG5cdFx0XHRpZiAodHJhbnNwb3J0VHlwZSA9PT0gXCJzZWxmXCIpIHJldHVybiBcInNlbGZcIjtcblx0XHRcdHJldHVybiBgJHt0cmFuc3BvcnRUeXBlfS0ke1VVSUR2NCgpLnNsaWNlKDAsIDgpfWA7XG5cdFx0fVxuXHRcdF9jcmVhdGVQcm94eSh0YXJnZXRDaGFubmVsLCBiYXNlUGF0aCkge1xuXHRcdFx0Y29uc3QgaW52b2tlciA9IChhY3Rpb24sIHBhdGgsIGFyZ3MpID0+IHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuaW52b2tlKHRhcmdldENoYW5uZWwsIGFjdGlvbiwgcGF0aCwgYXJncyk7XG5cdFx0XHR9O1xuXHRcdFx0cmV0dXJuIGNyZWF0ZVJlbW90ZVByb3h5KGludm9rZXIsIHtcblx0XHRcdFx0Y2hhbm5lbDogdGFyZ2V0Q2hhbm5lbCxcblx0XHRcdFx0YmFzZVBhdGgsXG5cdFx0XHRcdGNhY2hlOiB0cnVlLFxuXHRcdFx0XHR0aW1lb3V0OiB0aGlzLl9jb25maWcudGltZW91dFxuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdF9pc1dvcmtlckNvbnRleHQoKSB7XG5cdFx0XHRyZXR1cm4gW1xuXHRcdFx0XHRcIndvcmtlclwiLFxuXHRcdFx0XHRcInNoYXJlZC13b3JrZXJcIixcblx0XHRcdFx0XCJzZXJ2aWNlLXdvcmtlclwiXG5cdFx0XHRdLmluY2x1ZGVzKHRoaXMuX2NvbnRleHRUeXBlKTtcblx0XHR9XG5cdH07XG5cdC8qKlxuXHQqIENyZWF0ZSBhIHVuaWZpZWQgY2hhbm5lbFxuXHQqXG5cdCogQGV4YW1wbGVcblx0KiAvLyBJbiB3b3JrZXJcblx0KiBjb25zdCBjaGFubmVsID0gY3JlYXRlVW5pZmllZENoYW5uZWwoXCJ3b3JrZXJcIik7XG5cdCogY2hhbm5lbC5leHBvc2UoXCJjYWxjXCIsIHsgYWRkOiAoYSwgYikgPT4gYSArIGIgfSk7XG5cdCpcblx0KiAvLyBJbiBob3N0XG5cdCogY29uc3QgY2hhbm5lbCA9IGNyZWF0ZVVuaWZpZWRDaGFubmVsKFwiaG9zdFwiKTtcblx0KiBjaGFubmVsLmNvbm5lY3Qod29ya2VyKTtcblx0KiBjb25zdCBjYWxjID0gY2hhbm5lbC5wcm94eShcIndvcmtlclwiLCBbXCJjYWxjXCJdKTtcblx0KiBhd2FpdCBjYWxjLmFkZCgyLCAzKTsgLy8gNVxuXHQqL1xuXHRmdW5jdGlvbiBjcmVhdGVVbmlmaWVkQ2hhbm5lbChjb25maWcpIHtcblx0XHRyZXR1cm4gbmV3IFVuaWZpZWRDaGFubmVsKGNvbmZpZyk7XG5cdH1cblx0bGV0IFdPUktFUl9DSEFOTkVMID0gbnVsbDtcblx0LyoqXG5cdCogR2V0IHRoZSB3b3JrZXIncyB1bmlmaWVkIGNoYW5uZWwgKGF1dG8tY3JlYXRlZCBpbiB3b3JrZXIgY29udGV4dClcblx0Ki9cblx0ZnVuY3Rpb24gZ2V0V29ya2VyQ2hhbm5lbCgpIHtcblx0XHRpZiAoIVdPUktFUl9DSEFOTkVMKSB7XG5cdFx0XHRjb25zdCBjb250ZXh0VHlwZSA9IGRldGVjdENvbnRleHRUeXBlKCk7XG5cdFx0XHRpZiAoW1xuXHRcdFx0XHRcIndvcmtlclwiLFxuXHRcdFx0XHRcInNoYXJlZC13b3JrZXJcIixcblx0XHRcdFx0XCJzZXJ2aWNlLXdvcmtlclwiXG5cdFx0XHRdLmluY2x1ZGVzKGNvbnRleHRUeXBlKSkgV09SS0VSX0NIQU5ORUwgPSBjcmVhdGVVbmlmaWVkQ2hhbm5lbCh7XG5cdFx0XHRcdG5hbWU6IFwid29ya2VyXCIsXG5cdFx0XHRcdGF1dG9MaXN0ZW46IHRydWVcblx0XHRcdH0pO1xuXHRcdFx0ZWxzZSBXT1JLRVJfQ0hBTk5FTCA9IGNyZWF0ZVVuaWZpZWRDaGFubmVsKHtcblx0XHRcdFx0bmFtZTogXCJob3N0XCIsXG5cdFx0XHRcdGF1dG9MaXN0ZW46IGZhbHNlXG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0cmV0dXJuIFdPUktFUl9DSEFOTkVMO1xuXHR9XG5cbi8vI2VuZHJlZ2lvblxuLy8jcmVnaW9uIC4uL3VuaWZvcm0udHMvc3JjL25ld2VyL2NvcmUvQWxpYXMudHNcblx0Y29uc3QgVFMgPSB7XG5cdFx0cmpiOiBcInJlamVjdEJ5XCIsXG5cdFx0cnZiOiBcInJlc29sdmVCeVwiLFxuXHRcdHJqOiBcInJlamVjdFwiLFxuXHRcdHJ2OiBcInJlc29sdmVcIixcblx0XHRjcjogXCJjcmVhdGVcIixcblx0XHRjczogXCJjcmVhdGVTeW5jXCIsXG5cdFx0YTogXCJhcnJheVwiLFxuXHRcdHRhOiBcInR5cGVkYXJyYXlcIixcblx0XHR1ZGY6IFwidW5kZWZpbmVkXCJcblx0fTtcblxuLy8jZW5kcmVnaW9uXG4vLyNyZWdpb24gLi4vdW5pZm9ybS50cy9zcmMvbmV3ZXIvY29yZS9Vc2VmdWwudHNcblx0Y29uc3QgVHJhbnNmZXJhYmxlID0gW1xuXHRcdHR5cGVvZiBBcnJheUJ1ZmZlciAhPSBUUy51ZGYgPyBBcnJheUJ1ZmZlciA6IG51bGwsXG5cdFx0dHlwZW9mIE1lc3NhZ2VQb3J0ICE9IFRTLnVkZiA/IE1lc3NhZ2VQb3J0IDogbnVsbCxcblx0XHR0eXBlb2YgUmVhZGFibGVTdHJlYW0gIT0gVFMudWRmID8gUmVhZGFibGVTdHJlYW0gOiBudWxsLFxuXHRcdHR5cGVvZiBXcml0YWJsZVN0cmVhbSAhPSBUUy51ZGYgPyBXcml0YWJsZVN0cmVhbSA6IG51bGwsXG5cdFx0dHlwZW9mIFRyYW5zZm9ybVN0cmVhbSAhPSBUUy51ZGYgPyBUcmFuc2Zvcm1TdHJlYW0gOiBudWxsLFxuXHRcdHR5cGVvZiBXZWJUcmFuc3BvcnRSZWNlaXZlU3RyZWFtICE9IFRTLnVkZiA/IFdlYlRyYW5zcG9ydFJlY2VpdmVTdHJlYW0gOiBudWxsLFxuXHRcdHR5cGVvZiBXZWJUcmFuc3BvcnRTZW5kU3RyZWFtICE9IFRTLnVkZiA/IFdlYlRyYW5zcG9ydFNlbmRTdHJlYW0gOiBudWxsLFxuXHRcdHR5cGVvZiBBdWRpb0RhdGEgIT0gVFMudWRmID8gQXVkaW9EYXRhIDogbnVsbCxcblx0XHR0eXBlb2YgSW1hZ2VCaXRtYXAgIT0gVFMudWRmID8gSW1hZ2VCaXRtYXAgOiBudWxsLFxuXHRcdHR5cGVvZiBWaWRlb0ZyYW1lICE9IFRTLnVkZiA/IFZpZGVvRnJhbWUgOiBudWxsLFxuXHRcdHR5cGVvZiBPZmZzY3JlZW5DYW52YXMgIT0gVFMudWRmID8gT2Zmc2NyZWVuQ2FudmFzIDogbnVsbCxcblx0XHR0eXBlb2YgUlRDRGF0YUNoYW5uZWwgIT0gVFMudWRmID8gUlRDRGF0YUNoYW5uZWwgOiBudWxsXG5cdF0uZmlsdGVyKChFKSA9PiBFICE9IG51bGwpO1xuXG4vLyNlbmRyZWdpb25cbi8vI3JlZ2lvbiAuLi91bmlmb3JtLnRzL3NyYy9uZXdlci9uZXh0L3V0aWxzL0Vudi50c1xuLyoqXG5cdCogQmFzZSBVUkwgZm9yIGBuZXcgVVJMKHdvcmtlclBhdGgsIGJhc2UpYCB3aGVuIHNwYXduaW5nIHdvcmtlcnMgZnJvbSBhIHN0cmluZyBzcGVjaWZpZXIuXG5cdCpcblx0KiBQcmVmZXIgYFdvcmtlckdsb2JhbFNjb3BlYCAvIGB3aW5kb3dgIFVSTHMgc28gdGhpcyBtb2R1bGUgc3RheXMgKipgaW1wb3J0Lm1ldGFgLWZyZWUqKi5cblx0KiBJbmNsdWRpbmcgYGltcG9ydC5tZXRhLnVybGAgYW55d2hlcmUgaW4gdGhlIHVuaWZvcm0gZ3JhcGggdHJpcHMgUm9sbGRvd24ncyBgRU1QVFlfSU1QT1JUX01FVEFgXG5cdCogd2hlbiB0aGUgUFdBIHNlcnZpY2Ugd29ya2VyIGlzIGJ1aWx0IGFzIElJRkUgKGB2aXRlLXBsdWdpbi1wd2FgIGluamVjdE1hbmlmZXN0KS5cblx0KlxuXHQqIERlZGljYXRlZCB3b3JrZXIgdGhyZWFkcyBleHBvc2UgYGdsb2JhbFRoaXMubG9jYXRpb25gIGF0IHRoZSB3b3JrZXIgc2NyaXB0IFVSTDsgTVYzIFNXIGV4cG9zZXMgdGhlXG5cdCovXG5cdGZ1bmN0aW9uIGdldFdvcmtlclJlc29sdmVCYXNlVXJsKCkge1xuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBocmVmID0gZ2xvYmFsVGhpcy5sb2NhdGlvbj8uaHJlZjtcblx0XHRcdGlmICh0eXBlb2YgaHJlZiA9PT0gXCJzdHJpbmdcIiAmJiBocmVmLmxlbmd0aCA+IDApIHJldHVybiBocmVmO1xuXHRcdH0gY2F0Y2gge31cblx0XHR0cnkge1xuXHRcdFx0aWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgZG9jdW1lbnQuYmFzZVVSSSA9PT0gXCJzdHJpbmdcIiAmJiBkb2N1bWVudC5iYXNlVVJJLmxlbmd0aCA+IDApIHJldHVybiBkb2N1bWVudC5iYXNlVVJJO1xuXHRcdH0gY2F0Y2gge31cblx0XHRyZXR1cm4gXCJcIjtcblx0fVxuXHQvKiogUmVzb2x2ZWQgYWJzb2x1dGUgaHJlZiBmb3IgYC4veGAvYC94YC9hYnNvbHV0ZSB3b3JrZXIgc3BlY2lmaWVycyAoZGVsZWdhdGVzIHRyYWlsaW5nIGAvYCBub3JtYWxpemF0aW9uIHRvIGNhbGxlcnMpLiAqL1xuXHRmdW5jdGlvbiByZXNvbHZlV29ya2VyU3BlY2lmaWVySHJlZihzcGVjKSB7XG5cdFx0Y29uc3QgYmFzZSA9IGdldFdvcmtlclJlc29sdmVCYXNlVXJsKCk7XG5cdFx0aWYgKCFiYXNlLmxlbmd0aCkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlt1bmlmb3JtXSBObyBiYXNlIFVSTCBmb3Igd29ya2VyIHJlc29sdXRpb24gKG1pc3NpbmcgbG9jYXRpb24gLyBkb2N1bWVudC5iYXNlVVJJKVwiKTtcblx0XHRjb25zdCBub3JtYWxpemVkID0gc3BlYy5zdGFydHNXaXRoKFwiL1wiKSA/IHNwZWMucmVwbGFjZSgvXlxcLy8sIFwiLi9cIikgOiBzcGVjO1xuXHRcdHJldHVybiBuZXcgVVJMKG5vcm1hbGl6ZWQsIGJhc2UpLmhyZWY7XG5cdH1cblxuLy8jZW5kcmVnaW9uXG4vLyNyZWdpb24gLi4vdW5pZm9ybS50cy9zcmMvbmV3ZXIvbmV4dC9jaGFubmVsL0NoYW5uZWxzLnRzXG5cdGNvbnN0IFNFTEZfQ0hBTk5FTCA9IHtcblx0XHRuYW1lOiBcInVua25vd25cIixcblx0XHRpbnN0YW5jZTogbnVsbFxuXHR9O1xuXHRjb25zdCBDSEFOTkVMX01BUCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG5cdGNvbnN0IGlzUmVmbGVjdEFjdGlvbiQxID0gKGFjdGlvbikgPT4gWy4uLk9iamVjdC52YWx1ZXMoV1JlZmxlY3RBY3Rpb24pXS5pbmNsdWRlcyhhY3Rpb24pO1xuXHQvKiogQGRlcHJlY2F0ZWQgVXNlIFVuaWZpZWRDaGFubmVsLnJlbW90ZSgpIGluc3RlYWQgKi9cblx0dmFyIFJlbW90ZUNoYW5uZWxIZWxwZXIkMSA9IGNsYXNzIHtcblx0XHRjaGFubmVsTmFtZTtcblx0XHRvcHRpb25zO1xuXHRcdF9jaGFubmVsO1xuXHRcdGNvbnN0cnVjdG9yKGNoYW5uZWxOYW1lLCBvcHRpb25zID0ge30pIHtcblx0XHRcdHRoaXMuY2hhbm5lbE5hbWUgPSBjaGFubmVsTmFtZTtcblx0XHRcdHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cdFx0XHR0aGlzLl9jaGFubmVsID0gZ2V0V29ya2VyQ2hhbm5lbCgpO1xuXHRcdH1cblx0XHRyZXF1ZXN0KHBhdGgsIGFjdGlvbiwgYXJncywgb3B0aW9ucyA9IHt9KSB7XG5cdFx0XHRpZiAodHlwZW9mIHBhdGggPT09IFwic3RyaW5nXCIpIHBhdGggPSBbcGF0aF07XG5cdFx0XHRpZiAoQXJyYXkuaXNBcnJheShhY3Rpb24pICYmIGlzUmVmbGVjdEFjdGlvbiQxKHBhdGgpKSB7XG5cdFx0XHRcdG9wdGlvbnMgPSBhcmdzO1xuXHRcdFx0XHRhcmdzID0gYWN0aW9uO1xuXHRcdFx0XHRhY3Rpb24gPSBwYXRoO1xuXHRcdFx0XHRwYXRoID0gW107XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcy5fY2hhbm5lbC5pbnZva2UodGhpcy5jaGFubmVsTmFtZSwgYWN0aW9uLCBwYXRoLCBhcmdzKTtcblx0XHR9XG5cdFx0ZG9JbXBvcnRNb2R1bGUodXJsLCBvcHRpb25zKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY2hhbm5lbC5pbXBvcnQodXJsLCB0aGlzLmNoYW5uZWxOYW1lKTtcblx0XHR9XG5cdH07XG5cdC8qKiBAZGVwcmVjYXRlZCBVc2UgVW5pZmllZENoYW5uZWwgaW5zdGVhZCAqL1xuXHR2YXIgQ2hhbm5lbEhhbmRsZXIkMSA9IGNsYXNzIHtcblx0XHRjaGFubmVsO1xuXHRcdG9wdGlvbnM7XG5cdFx0X3VuaWZpZWQ7XG5cdFx0YnJvYWRjYXN0cyA9IHt9O1xuXHRcdGNvbnN0cnVjdG9yKGNoYW5uZWwsIG9wdGlvbnMgPSB7fSkge1xuXHRcdFx0dGhpcy5jaGFubmVsID0gY2hhbm5lbDtcblx0XHRcdHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cdFx0XHR0aGlzLl91bmlmaWVkID0gY3JlYXRlVW5pZmllZENoYW5uZWwoe1xuXHRcdFx0XHRuYW1lOiBjaGFubmVsLFxuXHRcdFx0XHRhdXRvTGlzdGVuOiBmYWxzZVxuXHRcdFx0fSk7XG5cdFx0XHRTRUxGX0NIQU5ORUwubmFtZSA9IGNoYW5uZWw7XG5cdFx0XHRTRUxGX0NIQU5ORUwuaW5zdGFuY2UgPSB0aGlzO1xuXHRcdH1cblx0XHRjcmVhdGVSZW1vdGVDaGFubmVsKGNoYW5uZWwsIG9wdGlvbnMgPSB7fSwgYnJvYWRjYXN0KSB7XG5cdFx0XHRpZiAoYnJvYWRjYXN0KSB7XG5cdFx0XHRcdHRoaXMuX3VuaWZpZWQuYXR0YWNoKGJyb2FkY2FzdCwgeyB0YXJnZXRDaGFubmVsOiBjaGFubmVsIH0pO1xuXHRcdFx0XHR0aGlzLmJyb2FkY2FzdHNbY2hhbm5lbF0gPSBicm9hZGNhc3Q7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG5ldyBSZW1vdGVDaGFubmVsSGVscGVyJDEoY2hhbm5lbCwgb3B0aW9ucykpO1xuXHRcdH1cblx0XHRnZXRDaGFubmVsKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuY2hhbm5lbDtcblx0XHR9XG5cdFx0cmVxdWVzdChwYXRoLCBhY3Rpb24sIGFyZ3MsIG9wdGlvbnMgPSB7fSwgdG9DaGFubmVsID0gXCJ3b3JrZXJcIikge1xuXHRcdFx0aWYgKHR5cGVvZiBwYXRoID09PSBcInN0cmluZ1wiKSBwYXRoID0gW3BhdGhdO1xuXHRcdFx0aWYgKEFycmF5LmlzQXJyYXkoYWN0aW9uKSAmJiBpc1JlZmxlY3RBY3Rpb24kMShwYXRoKSkge1xuXHRcdFx0XHR0b0NoYW5uZWwgPSBvcHRpb25zO1xuXHRcdFx0XHRvcHRpb25zID0gYXJncztcblx0XHRcdFx0YXJncyA9IGFjdGlvbjtcblx0XHRcdFx0YWN0aW9uID0gcGF0aDtcblx0XHRcdFx0cGF0aCA9IFtdO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXMuX3VuaWZpZWQuaW52b2tlKHRvQ2hhbm5lbCwgYWN0aW9uLCBwYXRoLCBhcmdzKTtcblx0XHR9XG5cdFx0cmVzb2x2ZVJlc3BvbnNlKHJlcUlkLCByZXN1bHQpIHtcblx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUocmVzdWx0KTtcblx0XHR9XG5cdFx0YXN5bmMgaGFuZGxlQW5kUmVzcG9uc2UocmVxdWVzdCwgcmVxSWQsIHJlc3BvbnNlRm4pIHtcblx0XHRcdGNvbnN0IHJlc3VsdCA9IGF3YWl0IGhhbmRsZVJlcXVlc3QocmVxdWVzdCwgcmVxSWQsIHRoaXMuY2hhbm5lbCk7XG5cdFx0XHRpZiAoIXJlc3VsdCkgcmV0dXJuO1xuXHRcdFx0cmVzcG9uc2VGbj8uKHJlc3VsdC5yZXNwb25zZSwgcmVzdWx0LnRyYW5zZmVyKTtcblx0XHR9XG5cdFx0Y2xvc2UoKSB7XG5cdFx0XHR0aGlzLl91bmlmaWVkLmNsb3NlKCk7XG5cdFx0fVxuXHR9O1xuXHQvKiogQGRlcHJlY2F0ZWQgVXNlIGNyZWF0ZVVuaWZpZWRDaGFubmVsIGluc3RlYWQgKi9cblx0Y29uc3QgaW5pdENoYW5uZWxIYW5kbGVyID0gKGNoYW5uZWwgPSBcIiRob3N0JFwiKSA9PiB7XG5cdFx0aWYgKFNFTEZfQ0hBTk5FTD8uaW5zdGFuY2UgJiYgY2hhbm5lbCA9PT0gXCIkaG9zdCRcIikgcmV0dXJuIFNFTEZfQ0hBTk5FTC5pbnN0YW5jZTtcblx0XHRpZiAoQ0hBTk5FTF9NQVAuaGFzKGNoYW5uZWwpKSByZXR1cm4gQ0hBTk5FTF9NQVAuZ2V0KGNoYW5uZWwpID8/IG51bGw7XG5cdFx0Y29uc3QgJGNoYW5uZWwgPSBuZXcgQ2hhbm5lbEhhbmRsZXIkMShjaGFubmVsKTtcblx0XHRpZiAoY2hhbm5lbCA9PT0gXCIkaG9zdCRcIikge1xuXHRcdFx0U0VMRl9DSEFOTkVMLm5hbWUgPSBjaGFubmVsO1xuXHRcdFx0U0VMRl9DSEFOTkVMLmluc3RhbmNlID0gJGNoYW5uZWw7XG5cdFx0fVxuXHRcdENIQU5ORUxfTUFQLnNldChjaGFubmVsLCAkY2hhbm5lbCk7XG5cdFx0cmV0dXJuICRjaGFubmVsO1xuXHR9O1xuXG4vLyNlbmRyZWdpb25cbi8vI3JlZ2lvbiAuLi91bmlmb3JtLnRzL3NyYy9uZXdlci9uZXh0L3N0b3JhZ2UvRGF0YUJhc2UudHNcblx0Y29uc3QgaGFuZE1hcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xuXHRjb25zdCB3cmFwTWFwID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG5cdGNvbnN0IGRlc2NNYXAgPSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcblx0Y29uc3Qgb2JqZWN0VG9SZWYgPSAob2JqLCBjaGFubmVsID0gU0VMRl9DSEFOTkVMPy5uYW1lLCB0b1RyYW5zZmVyKSA9PiB7XG5cdFx0aWYgKHR5cGVvZiBvYmogPT0gXCJvYmplY3RcIiAmJiBvYmogIT0gbnVsbCB8fCB0eXBlb2Ygb2JqID09IFwiZnVuY3Rpb25cIiAmJiBvYmogIT0gbnVsbCkge1xuXHRcdFx0aWYgKHdyYXBNYXAuaGFzKG9iaikpIHJldHVybiB3cmFwTWFwLmdldChvYmopO1xuXHRcdFx0aWYgKGhhbmRNYXAuaGFzKG9iaikpIHJldHVybiBoYW5kTWFwLmdldChvYmopO1xuXHRcdFx0aWYgKGlzTm90Q29tcGxleEFycmF5KG9iaikpIHJldHVybiBvYmo7XG5cdFx0XHRpZiAodG9UcmFuc2Zlcj8uaW5jbHVkZXM/LihvYmopKSByZXR1cm4gb2JqO1xuXHRcdFx0aWYgKGNoYW5uZWwgPT0gU0VMRl9DSEFOTkVMPy5uYW1lKSByZXR1cm4gb2JqO1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0JGlzRGVzY3JpcHRvcjogdHJ1ZSxcblx0XHRcdFx0cGF0aDogcmVnaXN0ZXJlZEluUGF0aC5nZXQob2JqKSA/PyAoKCkgPT4ge1xuXHRcdFx0XHRcdGNvbnN0IHBhdGggPSBbVVVJRHY0KCldO1xuXHRcdFx0XHRcdHdyaXRlQnlQYXRoKHBhdGgsIG9iaik7XG5cdFx0XHRcdFx0cmV0dXJuIHBhdGg7XG5cdFx0XHRcdH0pKCksXG5cdFx0XHRcdG93bmVyOiBTRUxGX0NIQU5ORUw/Lm5hbWUsXG5cdFx0XHRcdGNoYW5uZWwsXG5cdFx0XHRcdHByaW1pdGl2ZTogaXNQcmltaXRpdmUob2JqKSxcblx0XHRcdFx0d3JpdGFibGU6IHRydWUsXG5cdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcblx0XHRcdFx0YXJndW1lbnRDb3VudDogb2JqIGluc3RhbmNlb2YgRnVuY3Rpb24gPyBvYmoubGVuZ3RoIDogLTFcblx0XHRcdH07XG5cdFx0fVxuXHRcdHJldHVybiBpc0Nhbkp1c3RSZXR1cm4ob2JqKSA/IG9iaiA6IG51bGw7XG5cdH07XG5cdGNvbnN0ICRyZXF1ZXN0SGFuZGxlciA9IFN5bWJvbC5mb3IoXCJAcmVxdWVzdEhhbmRsZXJcIik7XG5cdGNvbnN0ICRkZXNjcmlwdG9yID0gU3ltYm9sLmZvcihcIkBkZXNjcmlwdG9yXCIpO1xuXHRjb25zdCBub3JtYWxpemVSZWYgPSAodikgPT4ge1xuXHRcdGlmIChpc0Nhbkp1c3RSZXR1cm4odikpIHJldHVybiB2O1xuXHRcdGlmICh2Py5bJGRlc2NyaXB0b3JdKSByZXR1cm4gdjtcblx0XHRpZiAodj8uJGlzRGVzY3JpcHRvcikgcmV0dXJuIG1ha2VSZXF1ZXN0UHJveHkodiwgYXN5bmMgKCkgPT4gdm9pZCAwKTtcblx0XHRpZiAoaXNOb3RDb21wbGV4QXJyYXkodikpIHJldHVybiB2O1xuXHRcdHJldHVybiBudWxsO1xuXHR9O1xuXHRjb25zdCBzdG9yZWREYXRhID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0Y29uc3QgcmVnaXN0ZXJlZEluUGF0aCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xuXHRjb25zdCB0cmF2ZXJzZUJ5UGF0aCA9IChvYmosIHBhdGgpID0+IHtcblx0XHRpZiAocGF0aCAhPSBudWxsICYmICFBcnJheS5pc0FycmF5KHBhdGgpKSBwYXRoID0gW3BhdGhdO1xuXHRcdGlmIChwYXRoID09IG51bGwgfHwgcGF0aD8ubGVuZ3RoIDwgMSkgcmV0dXJuIG9iajtcblx0XHRjb25zdCAkZGVzYyA9IG9iaj8uWyRkZXNjcmlwdG9yXSA/PyAob2JqPy4kaXNEZXNjcmlwdG9yID8gb2JqIDogbnVsbCk7XG5cdFx0aWYgKCRkZXNjICYmICRkZXNjPy5vd25lciA9PSBTRUxGX0NIQU5ORUw/Lm5hbWUpIG9iaiA9IHJlYWRCeVBhdGgoJGRlc2M/LnBhdGgpID8/IG9iajtcblx0XHRpZiAoaXNQcmltaXRpdmUob2JqKSkgcmV0dXJuIG9iajtcblx0XHRmb3IgKGNvbnN0IGtleSBvZiBwYXRoKSB7XG5cdFx0XHRvYmogPSBvYmo/LltrZXldO1xuXHRcdFx0aWYgKG9iaiA9PSBudWxsKSByZXR1cm4gb2JqO1xuXHRcdH1cblx0XHRyZXR1cm4gb2JqO1xuXHR9O1xuXHRjb25zdCByZWFkQnlQYXRoID0gKHBhdGgpID0+IHtcblx0XHRpZiAocGF0aCAhPSBudWxsICYmICFBcnJheS5pc0FycmF5KHBhdGgpKSBwYXRoID0gW3BhdGhdO1xuXHRcdGlmIChwYXRoID09IG51bGwgfHwgcGF0aD8ubGVuZ3RoIDwgMSkgcmV0dXJuIG51bGw7XG5cdFx0Y29uc3Qgcm9vdCA9IHN0b3JlZERhdGE/LmdldD8uKHBhdGg/LlswXSkgPz8gbnVsbDtcblx0XHRyZXR1cm4gcm9vdCAhPSBudWxsID8gdHJhdmVyc2VCeVBhdGgocm9vdCwgcGF0aD8uc2xpY2U/LigxKSkgOiBudWxsO1xuXHR9O1xuXHRjb25zdCB3cml0ZUJ5UGF0aCA9IChwYXRoLCBkYXRhKSA9PiB7XG5cdFx0Y29uc3QgJGRlc2MgPSBkYXRhPy5bJGRlc2NyaXB0b3JdID8/IChkYXRhPy4kaXNEZXNjcmlwdG9yID8gZGF0YSA6IG51bGwpO1xuXHRcdGlmICgkZGVzYyAmJiAkZGVzYz8ub3duZXIgPT0gU0VMRl9DSEFOTkVMPy5uYW1lKSBkYXRhID0gcmVhZEJ5UGF0aCgkZGVzYz8ucGF0aCkgPz8gZGF0YTtcblx0XHRpZiAocGF0aCAhPSBudWxsICYmICFBcnJheS5pc0FycmF5KHBhdGgpKSBwYXRoID0gW3BhdGhdO1xuXHRcdGlmIChwYXRoID09IG51bGwgfHwgcGF0aD8ubGVuZ3RoIDwgMSkgcmV0dXJuIG51bGw7XG5cdFx0Y29uc3Qgcm9vdCA9IHN0b3JlZERhdGE/LmdldD8uKHBhdGg/LlswXSkgPz8gbnVsbDtcblx0XHRpZiAocGF0aD8ubGVuZ3RoID4gMSkgdHJhdmVyc2VCeVBhdGgocm9vdCwgcGF0aD8uc2xpY2U/LigxLCAtMSkpW3BhdGg/LltwYXRoPy5sZW5ndGggLSAxXV0gPSBkYXRhO1xuXHRcdGVsc2Ugc3RvcmVkRGF0YT8uc2V0Py4ocGF0aD8uWzBdLCBkYXRhKTtcblx0XHRpZiAodHlwZW9mIGRhdGEgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgZGF0YSA9PSBcImZ1bmN0aW9uXCIpIHJlZ2lzdGVyZWRJblBhdGg/LnNldD8uKGRhdGEsIHBhdGgpO1xuXHRcdHJldHVybiBkYXRhO1xuXHR9O1xuXHRjb25zdCByZW1vdmVCeVBhdGggPSAocGF0aCkgPT4ge1xuXHRcdGlmIChwYXRoICE9IG51bGwgJiYgIUFycmF5LmlzQXJyYXkocGF0aCkpIHBhdGggPSBbcGF0aF07XG5cdFx0aWYgKHBhdGggPT0gbnVsbCB8fCBwYXRoPy5sZW5ndGggPCAxKSByZXR1cm4gZmFsc2U7XG5cdFx0aWYgKCEoc3RvcmVkRGF0YT8uZ2V0Py4ocGF0aD8uWzBdKSA/PyBudWxsKSAmJiBwYXRoPy5sZW5ndGggPD0gMSkge1xuXHRcdFx0c3RvcmVkRGF0YT8uZGVsZXRlPy4ocGF0aD8uWzBdKTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH0gZWxzZSByZXR1cm4gZmFsc2U7XG5cdH07XG5cdGNvbnN0IHJlbW92ZUJ5RGF0YSA9IChkYXRhKSA9PiB7XG5cdFx0Y29uc3QgJGRlc2MgPSBkYXRhPy5bJGRlc2NyaXB0b3JdID8/IChkYXRhPy4kaXNEZXNjcmlwdG9yID8gZGF0YSA6IG51bGwpO1xuXHRcdGlmICgkZGVzYyAmJiAkZGVzYz8ub3duZXIgPT0gU0VMRl9DSEFOTkVMPy5uYW1lKSBkYXRhID0gcmVhZEJ5UGF0aCgkZGVzYz8ucGF0aCkgPz8gZGF0YTtcblx0XHRjb25zdCBwYXRoID0gcmVnaXN0ZXJlZEluUGF0aD8uZ2V0Py4oZGF0YSkgPz8gJGRlc2M/LnBhdGg7XG5cdFx0aWYgKHBhdGggPT0gbnVsbCB8fCBwYXRoPy5sZW5ndGggPCAxKSByZXR1cm4gZmFsc2U7XG5cdFx0cmVtb3ZlQnlQYXRoKHBhdGgpO1xuXHRcdGlmICh0eXBlb2YgZGF0YSA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBkYXRhID09IFwiZnVuY3Rpb25cIikgcmVnaXN0ZXJlZEluUGF0aD8uZGVsZXRlPy4oZGF0YSk7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH07XG5cdGNvbnN0IGhhc05vUGF0aCA9IChkYXRhKSA9PiB7XG5cdFx0Y29uc3QgJGRlc2MgPSBkYXRhPy5bJGRlc2NyaXB0b3JdID8/IChkYXRhPy4kaXNEZXNjcmlwdG9yID8gZGF0YSA6IG51bGwpO1xuXHRcdHJldHVybiAocmVnaXN0ZXJlZEluUGF0aD8uZ2V0Py4oZGF0YSkgPz8gJGRlc2M/LnBhdGgpID09IG51bGw7XG5cdH07XG5cbi8vI2VuZHJlZ2lvblxuLy8jcmVnaW9uIC4uL3VuaWZvcm0udHMvc3JjL25ld2VyL2NvcmUvUmVxdWVzdEhhbmRsZXIudHNcbi8qKlxuXHQqIFJlcXVlc3QgSGFuZGxlciBDb3JlIC0gVW5pZmllZCBSZWZsZWN0IEFjdGlvbiBIYW5kbGluZ1xuXHQqXG5cdCogU2luZ2xlIHNvdXJjZSBvZiB0cnV0aCBmb3IgYWxsIGFjdGlvbiBleGVjdXRpb246XG5cdCogLSBVbmlmaWVkQ2hhbm5lbCwgQ2hhbm5lbENvbnRleHQsIFByb3h5IG1vZHVsZVxuXHQqIC0gU3VwcG9ydHMgYm90aCBEYXRhQmFzZS1iYWNrZWQgYW5kIGRpcmVjdCBvYmplY3QgdGFyZ2V0c1xuXHQqIC0gU3VwcG9ydHMgY3VzdG9tIFJlZmxlY3QgaW1wbGVtZW50YXRpb25zXG5cdCovXG5cdGNvbnN0IGlzT2JqZWN0ID0gKG9iaikgPT4gKHR5cGVvZiBvYmogPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIG9iaiA9PT0gXCJmdW5jdGlvblwiKSAmJiBvYmogIT0gbnVsbDtcblx0Y29uc3QgZGVmYXVsdFJlZmxlY3QgPSB7XG5cdFx0Z2V0OiAodCwgcCkgPT4gdD8uW3BdLFxuXHRcdHNldDogKHQsIHAsIHYpID0+IHtcblx0XHRcdHRbcF0gPSB2O1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fSxcblx0XHRoYXM6ICh0LCBwKSA9PiBwIGluIHQsXG5cdFx0YXBwbHk6ICh0LCBjdHgsIGFyZ3MpID0+IHQuYXBwbHkoY3R4LCBhcmdzKSxcblx0XHRjb25zdHJ1Y3Q6ICh0LCBhcmdzKSA9PiBuZXcgdCguLi5hcmdzKSxcblx0XHRkZWxldGVQcm9wZXJ0eTogKHQsIHApID0+IGRlbGV0ZSB0W3BdLFxuXHRcdG93bktleXM6ICh0KSA9PiBPYmplY3Qua2V5cyh0KSxcblx0XHRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I6ICh0LCBwKSA9PiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHQsIHApLFxuXHRcdGdldFByb3RvdHlwZU9mOiAodCkgPT4gT2JqZWN0LmdldFByb3RvdHlwZU9mKHQpLFxuXHRcdHNldFByb3RvdHlwZU9mOiAodCwgcCkgPT4gT2JqZWN0LnNldFByb3RvdHlwZU9mKHQsIHApLFxuXHRcdGlzRXh0ZW5zaWJsZTogKHQpID0+IE9iamVjdC5pc0V4dGVuc2libGUodCksXG5cdFx0cHJldmVudEV4dGVuc2lvbnM6ICh0KSA9PiBPYmplY3QucHJldmVudEV4dGVuc2lvbnModClcblx0fTtcblx0LyoqXG5cdCogRXhlY3V0ZSBhIHJlZmxlY3QgYWN0aW9uXG5cdCpcblx0KiBVbmlmaWVkIGltcGxlbWVudGF0aW9uIHVzZWQgYnkgYWxsIGNoYW5uZWwvcHJveHkgaGFuZGxlcnMuXG5cdCogU3VwcG9ydHMgYm90aCBEYXRhQmFzZS1iYWNrZWQgcGF0aHMgYW5kIGRpcmVjdCBvYmplY3QgdGFyZ2V0cy5cblx0KlxuXHQqIEBwYXJhbSBhY3Rpb24gLSBBY3Rpb24gdG8gZXhlY3V0ZSAoV1JlZmxlY3RBY3Rpb24gb3Igc3RyaW5nKVxuXHQqIEBwYXJhbSBwYXRoIC0gT2JqZWN0IHBhdGhcblx0KiBAcGFyYW0gYXJncyAtIEFjdGlvbiBhcmd1bWVudHNcblx0KiBAcGFyYW0gb3B0aW9ucyAtIEV4ZWN1dGlvbiBvcHRpb25zXG5cdCovXG5cdGZ1bmN0aW9uIGV4ZWN1dGVBY3Rpb24oYWN0aW9uLCBwYXRoLCBhcmdzLCBvcHRpb25zID0ge30pIHtcblx0XHRjb25zdCB7IGNoYW5uZWwgPSBcIlwiLCBzZW5kZXIgPSBcIlwiLCByZWZsZWN0ID0gZGVmYXVsdFJlZmxlY3QgfSA9IG9wdGlvbnM7XG5cdFx0Y29uc3Qgb2JqID0gb3B0aW9ucy50YXJnZXQgPz8gcmVhZEJ5UGF0aChwYXRoKTtcblx0XHRjb25zdCB0b1RyYW5zZmVyID0gW107XG5cdFx0bGV0IHJlc3VsdCA9IG51bGw7XG5cdFx0bGV0IG5ld1BhdGggPSBwYXRoO1xuXHRcdHN3aXRjaCAoU3RyaW5nKGFjdGlvbikudG9Mb3dlckNhc2UoKSkge1xuXHRcdFx0Y2FzZSBcImltcG9ydFwiOlxuXHRcdFx0Y2FzZSBXUmVmbGVjdEFjdGlvbi5JTVBPUlQ6XG5cdFx0XHRcdHJlc3VsdCA9IGltcG9ydChcblx0XHRcdFx0XHQvKiBAdml0ZS1pZ25vcmUgKi9cblx0XHRcdFx0XHRhcmdzPy5bMF1cbik7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcInRyYW5zZmVyXCI6XG5cdFx0XHRjYXNlIFdSZWZsZWN0QWN0aW9uLlRSQU5TRkVSOlxuXHRcdFx0XHRpZiAoaXNDYW5UcmFuc2ZlcihvYmopICYmIGNoYW5uZWwgIT09IHNlbmRlcikgdG9UcmFuc2Zlci5wdXNoKG9iaik7XG5cdFx0XHRcdHJlc3VsdCA9IG9iajtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwiZ2V0XCI6XG5cdFx0XHRjYXNlIFdSZWZsZWN0QWN0aW9uLkdFVDoge1xuXHRcdFx0XHRjb25zdCBwcm9wID0gYXJncz8uWzBdO1xuXHRcdFx0XHRjb25zdCBnb3QgPSByZWZsZWN0LmdldD8uKG9iaiwgcHJvcCkgPz8gb2JqPy5bcHJvcF07XG5cdFx0XHRcdHJlc3VsdCA9IHR5cGVvZiBnb3QgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmogIT0gbnVsbCA/IGdvdC5iaW5kKG9iaikgOiBnb3Q7XG5cdFx0XHRcdG5ld1BhdGggPSBbLi4ucGF0aCwgU3RyaW5nKHByb3ApXTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRjYXNlIFwic2V0XCI6XG5cdFx0XHRjYXNlIFdSZWZsZWN0QWN0aW9uLlNFVDoge1xuXHRcdFx0XHRjb25zdCBbcHJvcCwgdmFsdWVdID0gYXJncztcblx0XHRcdFx0Y29uc3Qgbm9ybWFsaXplZFZhbHVlID0gZGVlcE9wZXJhdGVBbmRDbG9uZSh2YWx1ZSwgbm9ybWFsaXplUmVmKTtcblx0XHRcdFx0aWYgKG9wdGlvbnMudGFyZ2V0KSByZXN1bHQgPSByZWZsZWN0LnNldD8uKG9iaiwgcHJvcCwgbm9ybWFsaXplZFZhbHVlKSA/PyAob2JqW3Byb3BdID0gbm9ybWFsaXplZFZhbHVlLCB0cnVlKTtcblx0XHRcdFx0ZWxzZSByZXN1bHQgPSByZWZsZWN0LnNldD8uKG9iaiwgcHJvcCwgbm9ybWFsaXplZFZhbHVlKSA/PyB3cml0ZUJ5UGF0aChbLi4ucGF0aCwgU3RyaW5nKHByb3ApXSwgbm9ybWFsaXplZFZhbHVlKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRjYXNlIFwiYXBwbHlcIjpcblx0XHRcdGNhc2UgXCJjYWxsXCI6XG5cdFx0XHRjYXNlIFdSZWZsZWN0QWN0aW9uLkFQUExZOlxuXHRcdFx0Y2FzZSBXUmVmbGVjdEFjdGlvbi5DQUxMOlxuXHRcdFx0XHRpZiAodHlwZW9mIG9iaiA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRcdFx0Y29uc3QgY3R4ID0gb3B0aW9ucy5jb250ZXh0ID8/IChvcHRpb25zLnRhcmdldCA/IHZvaWQgMCA6IHJlYWRCeVBhdGgocGF0aC5zbGljZSgwLCAtMSkpKTtcblx0XHRcdFx0XHRjb25zdCBub3JtYWxpemVkQXJncyA9IGRlZXBPcGVyYXRlQW5kQ2xvbmUoYXJncz8uWzBdID8/IGFyZ3MgPz8gW10sIG5vcm1hbGl6ZVJlZik7XG5cdFx0XHRcdFx0cmVzdWx0ID0gcmVmbGVjdC5hcHBseT8uKG9iaiwgY3R4LCBub3JtYWxpemVkQXJncykgPz8gb2JqLmFwcGx5KGN0eCwgbm9ybWFsaXplZEFyZ3MpO1xuXHRcdFx0XHRcdGlmIChpc0NhblRyYW5zZmVyKHJlc3VsdCkgJiYgcGF0aD8uYXQoLTEpID09PSBcInRyYW5zZmVyXCIgJiYgY2hhbm5lbCAhPT0gc2VuZGVyKSB0b1RyYW5zZmVyLnB1c2gocmVzdWx0KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCJjb25zdHJ1Y3RcIjpcblx0XHRcdGNhc2UgV1JlZmxlY3RBY3Rpb24uQ09OU1RSVUNUOlxuXHRcdFx0XHRpZiAodHlwZW9mIG9iaiA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRcdFx0Y29uc3Qgbm9ybWFsaXplZEFyZ3MgPSBkZWVwT3BlcmF0ZUFuZENsb25lKGFyZ3M/LlswXSA/PyBhcmdzID8/IFtdLCBub3JtYWxpemVSZWYpO1xuXHRcdFx0XHRcdHJlc3VsdCA9IHJlZmxlY3QuY29uc3RydWN0Py4ob2JqLCBub3JtYWxpemVkQXJncykgPz8gbmV3IG9iaiguLi5ub3JtYWxpemVkQXJncyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwiZGVsZXRlXCI6XG5cdFx0XHRjYXNlIFwiZGVsZXRlcHJvcGVydHlcIjpcblx0XHRcdGNhc2UgXCJkaXNwb3NlXCI6XG5cdFx0XHRjYXNlIFdSZWZsZWN0QWN0aW9uLkRFTEVURTpcblx0XHRcdGNhc2UgV1JlZmxlY3RBY3Rpb24uREVMRVRFX1BST1BFUlRZOlxuXHRcdFx0Y2FzZSBXUmVmbGVjdEFjdGlvbi5ESVNQT1NFOlxuXHRcdFx0XHRpZiAob3B0aW9ucy50YXJnZXQpIHtcblx0XHRcdFx0XHRjb25zdCBwcm9wID0gcGF0aFtwYXRoLmxlbmd0aCAtIDFdO1xuXHRcdFx0XHRcdHJlc3VsdCA9IHJlZmxlY3QuZGVsZXRlUHJvcGVydHk/LihvYmosIHByb3ApID8/IGRlbGV0ZSBvYmpbcHJvcF07XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cmVzdWx0ID0gcGF0aD8ubGVuZ3RoID4gMCA/IHJlbW92ZUJ5UGF0aChwYXRoKSA6IHJlbW92ZUJ5RGF0YShvYmopO1xuXHRcdFx0XHRcdGlmIChyZXN1bHQpIG5ld1BhdGggPSByZWdpc3RlcmVkSW5QYXRoLmdldChvYmopID8/IFtdO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcImhhc1wiOlxuXHRcdFx0Y2FzZSBXUmVmbGVjdEFjdGlvbi5IQVM6XG5cdFx0XHRcdHJlc3VsdCA9IHJlZmxlY3QuaGFzPy4ob2JqLCBhcmdzPy5bMF0pID8/IChpc09iamVjdChvYmopID8gYXJncz8uWzBdIGluIG9iaiA6IGZhbHNlKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwib3dua2V5c1wiOlxuXHRcdFx0Y2FzZSBXUmVmbGVjdEFjdGlvbi5PV05fS0VZUzpcblx0XHRcdFx0cmVzdWx0ID0gcmVmbGVjdC5vd25LZXlzPy4ob2JqKSA/PyAoaXNPYmplY3Qob2JqKSA/IE9iamVjdC5rZXlzKG9iaikgOiBbXSk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcImdldG93bnByb3BlcnR5ZGVzY3JpcHRvclwiOlxuXHRcdFx0Y2FzZSBcImdldHByb3BlcnR5ZGVzY3JpcHRvclwiOlxuXHRcdFx0Y2FzZSBXUmVmbGVjdEFjdGlvbi5HRVRfT1dOX1BST1BFUlRZX0RFU0NSSVBUT1I6XG5cdFx0XHRjYXNlIFdSZWZsZWN0QWN0aW9uLkdFVF9QUk9QRVJUWV9ERVNDUklQVE9SOlxuXHRcdFx0XHRyZXN1bHQgPSByZWZsZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcj8uKG9iaiwgYXJncz8uWzBdID8/IHBhdGg/LmF0KC0xKSA/PyBcIlwiKSA/PyAoaXNPYmplY3Qob2JqKSA/IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqLCBhcmdzPy5bMF0gPz8gcGF0aD8uYXQoLTEpID8/IFwiXCIpIDogdm9pZCAwKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwiZ2V0cHJvdG90eXBlb2ZcIjpcblx0XHRcdGNhc2UgV1JlZmxlY3RBY3Rpb24uR0VUX1BST1RPVFlQRV9PRjpcblx0XHRcdFx0cmVzdWx0ID0gcmVmbGVjdC5nZXRQcm90b3R5cGVPZj8uKG9iaikgPz8gKGlzT2JqZWN0KG9iaikgPyBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqKSA6IG51bGwpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCJzZXRwcm90b3R5cGVvZlwiOlxuXHRcdFx0Y2FzZSBXUmVmbGVjdEFjdGlvbi5TRVRfUFJPVE9UWVBFX09GOlxuXHRcdFx0XHRyZXN1bHQgPSByZWZsZWN0LnNldFByb3RvdHlwZU9mPy4ob2JqLCBhcmdzPy5bMF0pID8/IChpc09iamVjdChvYmopID8gT2JqZWN0LnNldFByb3RvdHlwZU9mKG9iaiwgYXJncz8uWzBdKSA6IGZhbHNlKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwiaXNleHRlbnNpYmxlXCI6XG5cdFx0XHRjYXNlIFdSZWZsZWN0QWN0aW9uLklTX0VYVEVOU0lCTEU6XG5cdFx0XHRcdHJlc3VsdCA9IHJlZmxlY3QuaXNFeHRlbnNpYmxlPy4ob2JqKSA/PyAoaXNPYmplY3Qob2JqKSA/IE9iamVjdC5pc0V4dGVuc2libGUob2JqKSA6IHRydWUpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCJwcmV2ZW50ZXh0ZW5zaW9uc1wiOlxuXHRcdFx0Y2FzZSBXUmVmbGVjdEFjdGlvbi5QUkVWRU5UX0VYVEVOU0lPTlM6IHJlc3VsdCA9IHJlZmxlY3QucHJldmVudEV4dGVuc2lvbnM/LihvYmopID8/IChpc09iamVjdChvYmopID8gT2JqZWN0LnByZXZlbnRFeHRlbnNpb25zKG9iaikgOiBmYWxzZSk7XG5cdFx0fVxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN1bHQsXG5cdFx0XHR0b1RyYW5zZmVyLFxuXHRcdFx0cGF0aDogbmV3UGF0aFxuXHRcdH07XG5cdH1cblx0LyoqXG5cdCogQnVpbGQgcmVzcG9uc2Ugb2JqZWN0IHdpdGggZGVzY3JpcHRvclxuXHQqL1xuXHRhc3luYyBmdW5jdGlvbiBidWlsZFJlc3BvbnNlKHJlcUlkLCBhY3Rpb24sIGNoYW5uZWwsIHNlbmRlciwgcGF0aCwgcmF3UmVzdWx0LCB0b1RyYW5zZmVyKSB7XG5cdFx0Y29uc3QgcmVzdWx0ID0gYXdhaXQgcmF3UmVzdWx0O1xuXHRcdGNvbnN0IGNhbkJlUmV0dXJuID0gaXNDYW5UcmFuc2ZlcihyZXN1bHQpICYmIHRvVHJhbnNmZXIuaW5jbHVkZXMocmVzdWx0KSB8fCBpc0Nhbkp1c3RSZXR1cm4ocmVzdWx0KTtcblx0XHRsZXQgZmluYWxQYXRoID0gcGF0aDtcblx0XHRpZiAoIWNhbkJlUmV0dXJuICYmIGFjdGlvbiAhPT0gXCJnZXRcIiAmJiBhY3Rpb24gIT09IFdSZWZsZWN0QWN0aW9uLkdFVCAmJiAodHlwZW9mIHJlc3VsdCA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgcmVzdWx0ID09PSBcImZ1bmN0aW9uXCIpKSB7XG5cdFx0XHRpZiAoaGFzTm9QYXRoKHJlc3VsdCkpIHtcblx0XHRcdFx0ZmluYWxQYXRoID0gW1VVSUR2NCgpXTtcblx0XHRcdFx0d3JpdGVCeVBhdGgoZmluYWxQYXRoLCByZXN1bHQpO1xuXHRcdFx0fSBlbHNlIGZpbmFsUGF0aCA9IHJlZ2lzdGVyZWRJblBhdGguZ2V0KHJlc3VsdCkgPz8gW107XG5cdFx0fVxuXHRcdGNvbnN0IGN0eCA9IHJlYWRCeVBhdGgoZmluYWxQYXRoKTtcblx0XHRjb25zdCBjdHhLZXkgPSBhY3Rpb24gPT09IFwiZ2V0XCIgfHwgYWN0aW9uID09PSBXUmVmbGVjdEFjdGlvbi5HRVQgPyBmaW5hbFBhdGg/LmF0KC0xKSA6IHZvaWQgMDtcblx0XHRjb25zdCBvYmogPSByZWFkQnlQYXRoKHBhdGgpO1xuXHRcdGNvbnN0IHBheWxvYWQgPSBkZWVwT3BlcmF0ZUFuZENsb25lKHJlc3VsdCwgKGVsKSA9PiBvYmplY3RUb1JlZihlbCwgY2hhbm5lbCwgdG9UcmFuc2ZlcikpID8/IHJlc3VsdDtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzcG9uc2U6IHtcblx0XHRcdFx0Y2hhbm5lbDogc2VuZGVyLFxuXHRcdFx0XHRzZW5kZXI6IGNoYW5uZWwsXG5cdFx0XHRcdHJlcUlkLFxuXHRcdFx0XHRhY3Rpb24sXG5cdFx0XHRcdHR5cGU6IFwicmVzcG9uc2VcIixcblx0XHRcdFx0cGF5bG9hZDoge1xuXHRcdFx0XHRcdHJlc3VsdDogY2FuQmVSZXR1cm4gPyBwYXlsb2FkIDogbnVsbCxcblx0XHRcdFx0XHR0eXBlOiB0eXBlb2YgcmVzdWx0LFxuXHRcdFx0XHRcdGNoYW5uZWw6IHNlbmRlcixcblx0XHRcdFx0XHRzZW5kZXI6IGNoYW5uZWwsXG5cdFx0XHRcdFx0ZGVzY3JpcHRvcjoge1xuXHRcdFx0XHRcdFx0JGlzRGVzY3JpcHRvcjogdHJ1ZSxcblx0XHRcdFx0XHRcdHBhdGg6IGZpbmFsUGF0aCxcblx0XHRcdFx0XHRcdG93bmVyOiBjaGFubmVsLFxuXHRcdFx0XHRcdFx0Y2hhbm5lbCxcblx0XHRcdFx0XHRcdHByaW1pdGl2ZTogaXNQcmltaXRpdmUocmVzdWx0KSxcblx0XHRcdFx0XHRcdHdyaXRhYmxlOiB0cnVlLFxuXHRcdFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHRcdFx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcblx0XHRcdFx0XHRcdGFyZ3VtZW50Q291bnQ6IG9iaiBpbnN0YW5jZW9mIEZ1bmN0aW9uID8gb2JqLmxlbmd0aCA6IC0xLFxuXHRcdFx0XHRcdFx0Li4uaXNPYmplY3QoY3R4KSAmJiBjdHhLZXkgIT0gbnVsbCA/IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoY3R4LCBjdHhLZXkpIDoge31cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHR0cmFuc2ZlcjogdG9UcmFuc2ZlclxuXHRcdH07XG5cdH1cblx0LyoqXG5cdCogSGFuZGxlIHJlcXVlc3QgYW5kIHJldHVybiByZXNwb25zZSAodW5pZmllZCBoYW5kbGVyKVxuXHQqL1xuXHRhc3luYyBmdW5jdGlvbiBoYW5kbGVSZXF1ZXN0KHJlcXVlc3QsIHJlcUlkLCBjaGFubmVsTmFtZSwgb3B0aW9ucykge1xuXHRcdGNvbnN0IHsgY2hhbm5lbCwgc2VuZGVyLCBwYXRoLCBhY3Rpb24sIGFyZ3MgfSA9IHJlcXVlc3Q7XG5cdFx0aWYgKGNoYW5uZWwgIT09IGNoYW5uZWxOYW1lKSByZXR1cm4gbnVsbDtcblx0XHRjb25zdCB7IHJlc3VsdCwgdG9UcmFuc2ZlciwgcGF0aDogbmV3UGF0aCB9ID0gZXhlY3V0ZUFjdGlvbihhY3Rpb24sIHBhdGgsIGFyZ3MsIHtcblx0XHRcdGNoYW5uZWwsXG5cdFx0XHRzZW5kZXIsXG5cdFx0XHQuLi5vcHRpb25zXG5cdFx0fSk7XG5cdFx0cmV0dXJuIGJ1aWxkUmVzcG9uc2UocmVxSWQsIGFjdGlvbiwgY2hhbm5lbE5hbWUsIHNlbmRlciwgbmV3UGF0aCwgcmVzdWx0LCB0b1RyYW5zZmVyKTtcblx0fVxuXHQvKipcblx0KiBDcmVhdGUgYSBzaW1wbGUgZXhwb3NlIGhhbmRsZXIgZm9yIGFuIG9iamVjdFxuXHQqXG5cdCogVW5saWtlIHRoZSBmdWxsIGV4ZWN1dGVBY3Rpb24sIHRoaXMgd29ya3MgZGlyZWN0bHkgb24gdGhlIHRhcmdldFxuXHQqIHdpdGhvdXQgRGF0YUJhc2UgaW50ZWdyYXRpb24uIFVzZWQgYnkgUHJveHkudHMgY3JlYXRlRXhwb3NlSGFuZGxlci5cblx0KlxuXHQqIEBwYXJhbSB0YXJnZXQgLSBPYmplY3QgdG8gZXhwb3NlXG5cdCogQHBhcmFtIHJlZmxlY3QgLSBPcHRpb25hbCBjdXN0b20gUmVmbGVjdCBpbXBsZW1lbnRhdGlvblxuXHQqL1xuXHRmdW5jdGlvbiBjcmVhdGVPYmplY3RIYW5kbGVyKHRhcmdldCwgcmVmbGVjdCA9IGRlZmF1bHRSZWZsZWN0KSB7XG5cdFx0cmV0dXJuIGFzeW5jIChhY3Rpb24sIHBhdGgsIGFyZ3MpID0+IHtcblx0XHRcdGxldCBwYXJlbnQgPSB0YXJnZXQ7XG5cdFx0XHRsZXQgY3VycmVudCA9IHRhcmdldDtcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgcGF0aC5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRwYXJlbnQgPSBjdXJyZW50O1xuXHRcdFx0XHRjdXJyZW50ID0gY3VycmVudD8uW3BhdGhbaV1dO1xuXHRcdFx0XHRpZiAoY3VycmVudCA9PT0gdm9pZCAwICYmIGkgPCBwYXRoLmxlbmd0aCAtIDEpIHRocm93IG5ldyBFcnJvcihgUGF0aCBzZWdtZW50ICcke3BhdGhbaV19JyBub3QgZm91bmRgKTtcblx0XHRcdH1cblx0XHRcdGNvbnN0IHByb3AgPSBwYXRoW3BhdGgubGVuZ3RoIC0gMV07XG5cdFx0XHRzd2l0Y2ggKFN0cmluZyhhY3Rpb24pLnRvTG93ZXJDYXNlKCkpIHtcblx0XHRcdFx0Y2FzZSBcImdldFwiOlxuXHRcdFx0XHRjYXNlIFdSZWZsZWN0QWN0aW9uLkdFVDogcmV0dXJuIGN1cnJlbnQ7XG5cdFx0XHRcdGNhc2UgXCJzZXRcIjpcblx0XHRcdFx0Y2FzZSBXUmVmbGVjdEFjdGlvbi5TRVQ6XG5cdFx0XHRcdFx0cGFyZW50W3Byb3BdID0gYXJnc1swXTtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0Y2FzZSBcImNhbGxcIjpcblx0XHRcdFx0Y2FzZSBcImFwcGx5XCI6XG5cdFx0XHRcdGNhc2UgV1JlZmxlY3RBY3Rpb24uQVBQTFk6XG5cdFx0XHRcdGNhc2UgV1JlZmxlY3RBY3Rpb24uQ0FMTDpcblx0XHRcdFx0XHRpZiAodHlwZW9mIGN1cnJlbnQgPT09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0XHRcdFx0Y29uc3QgY2FsbEFyZ3MgPSBBcnJheS5pc0FycmF5KGFyZ3NbMF0pID8gYXJnc1swXSA6IGFyZ3M7XG5cdFx0XHRcdFx0XHRyZXR1cm4gYXdhaXQgY3VycmVudC5hcHBseShwYXJlbnQsIGNhbGxBcmdzKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGAnJHtwcm9wfScgaXMgbm90IGEgZnVuY3Rpb25gKTtcblx0XHRcdFx0Y2FzZSBcImNvbnN0cnVjdFwiOlxuXHRcdFx0XHRjYXNlIFdSZWZsZWN0QWN0aW9uLkNPTlNUUlVDVDpcblx0XHRcdFx0XHRpZiAodHlwZW9mIGN1cnJlbnQgPT09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0XHRcdFx0Y29uc3QgY3RvckFyZ3MgPSBBcnJheS5pc0FycmF5KGFyZ3NbMF0pID8gYXJnc1swXSA6IGFyZ3M7XG5cdFx0XHRcdFx0XHRyZXR1cm4gbmV3IGN1cnJlbnQoLi4uY3RvckFyZ3MpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYCcke3Byb3B9JyBpcyBub3QgYSBjb25zdHJ1Y3RvcmApO1xuXHRcdFx0XHRjYXNlIFwiaGFzXCI6XG5cdFx0XHRcdGNhc2UgV1JlZmxlY3RBY3Rpb24uSEFTOiByZXR1cm4gcHJvcCBpbiBwYXJlbnQ7XG5cdFx0XHRcdGNhc2UgXCJkZWxldGVcIjpcblx0XHRcdFx0Y2FzZSBcImRlbGV0ZXByb3BlcnR5XCI6XG5cdFx0XHRcdGNhc2UgV1JlZmxlY3RBY3Rpb24uREVMRVRFX1BST1BFUlRZOiByZXR1cm4gZGVsZXRlIHBhcmVudFtwcm9wXTtcblx0XHRcdFx0Y2FzZSBcIm93bmtleXNcIjpcblx0XHRcdFx0Y2FzZSBXUmVmbGVjdEFjdGlvbi5PV05fS0VZUzogcmV0dXJuIE9iamVjdC5rZXlzKGN1cnJlbnQgPz8gcGFyZW50KTtcblx0XHRcdFx0ZGVmYXVsdDogcmV0dXJuIGN1cnJlbnQ7XG5cdFx0XHR9XG5cdFx0fTtcblx0fVxuXG4vLyNlbmRyZWdpb25cbi8vI3JlZ2lvbiAuLi91bmlmb3JtLnRzL3NyYy9uZXdlci9uZXh0L2NoYW5uZWwvQ29ubmVjdGlvbi50c1xuLyoqXG5cdCogQ2hhbm5lbCBDb25uZWN0aW9uIC0gQ29ubmVjdGlvbiBhYnN0cmFjdGlvbiBsYXllclxuXHQqXG5cdCogUHJvdmlkZXMgY29ubmVjdGlvbiBwb29saW5nLCBzdGF0ZSBtYW5hZ2VtZW50LCBhbmQgbWVzc2FnZSByb3V0aW5nLlxuXHQqL1xuXHR2YXIgQ2hhbm5lbENvbm5lY3Rpb24gPSBjbGFzcyB7XG5cdFx0X25hbWU7XG5cdFx0X3RyYW5zcG9ydFR5cGU7XG5cdFx0X2lkID0gVVVJRHY0KCk7XG5cdFx0X3N0YXRlID0gXCJkaXNjb25uZWN0ZWRcIjtcblx0XHRfaW5ib3VuZCA9IG5ldyBDaGFubmVsU3ViamVjdCh7IGJ1ZmZlclNpemU6IDFlMyB9KTtcblx0XHRfb3V0Ym91bmQgPSBuZXcgQ2hhbm5lbFN1YmplY3QoeyBidWZmZXJTaXplOiAxZTMgfSk7XG5cdFx0X3N0YXRlQ2hhbmdlcyA9IG5ldyBDaGFubmVsU3ViamVjdCgpO1xuXHRcdF9jb25uZWN0ZWRQZWVycyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG5cdFx0X3N1YnMgPSBbXTtcblx0XHRfc3RhdHMgPSB7XG5cdFx0XHRtZXNzYWdlc1NlbnQ6IDAsXG5cdFx0XHRtZXNzYWdlc1JlY2VpdmVkOiAwLFxuXHRcdFx0Ynl0ZXNUcmFuc2ZlcnJlZDogMCxcblx0XHRcdGxhdGVuY3lNczogMCxcblx0XHRcdHVwdGltZTogMCxcblx0XHRcdHJlY29ubmVjdENvdW50OiAwXG5cdFx0fTtcblx0XHRfc3RhcnRUaW1lID0gMDtcblx0XHRfcGVuZGluZyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG5cdFx0X2J1ZmZlciA9IFtdO1xuXHRcdF9vcHRzO1xuXHRcdGNvbnN0cnVjdG9yKF9uYW1lLCBfdHJhbnNwb3J0VHlwZSA9IFwiaW50ZXJuYWxcIiwgb3B0aW9ucyA9IHt9KSB7XG5cdFx0XHR0aGlzLl9uYW1lID0gX25hbWU7XG5cdFx0XHR0aGlzLl90cmFuc3BvcnRUeXBlID0gX3RyYW5zcG9ydFR5cGU7XG5cdFx0XHR0aGlzLl9vcHRzID0ge1xuXHRcdFx0XHR0aW1lb3V0OiAzZTQsXG5cdFx0XHRcdGF1dG9SZWNvbm5lY3Q6IHRydWUsXG5cdFx0XHRcdHJlY29ubmVjdEludGVydmFsOiAxZTMsXG5cdFx0XHRcdG1heFJlY29ubmVjdEF0dGVtcHRzOiA1LFxuXHRcdFx0XHRidWZmZXJNZXNzYWdlczogdHJ1ZSxcblx0XHRcdFx0YnVmZmVyU2l6ZTogMWUzLFxuXHRcdFx0XHRtZXRhZGF0YToge30sXG5cdFx0XHRcdC4uLm9wdGlvbnNcblx0XHRcdH07XG5cdFx0XHR0aGlzLl9zZXR1cFN1YnNjcmlwdGlvbnMoKTtcblx0XHR9XG5cdFx0c3Vic2NyaWJlKG9ic2VydmVyLCBmcm9tQ2hhbm5lbCkge1xuXHRcdFx0cmV0dXJuIChmcm9tQ2hhbm5lbCA/IGZpbHRlcigobSkgPT4gbS5zZW5kZXIgPT09IGZyb21DaGFubmVsKSh0aGlzLl9pbmJvdW5kKSA6IHRoaXMuX2luYm91bmQpLnN1YnNjcmliZSh0eXBlb2Ygb2JzZXJ2ZXIgPT09IFwiZnVuY3Rpb25cIiA/IHsgbmV4dDogb2JzZXJ2ZXIgfSA6IG9ic2VydmVyKTtcblx0XHR9XG5cdFx0bmV4dChtZXNzYWdlKSB7XG5cdFx0XHRpZiAodGhpcy5fc3RhdGUgIT09IFwiY29ubmVjdGVkXCIpIHtcblx0XHRcdFx0aWYgKHRoaXMuX29wdHMuYnVmZmVyTWVzc2FnZXMgJiYgdGhpcy5fYnVmZmVyLmxlbmd0aCA8IHRoaXMuX29wdHMuYnVmZmVyU2l6ZSkgdGhpcy5fYnVmZmVyLnB1c2gobWVzc2FnZSk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdHRoaXMuX291dGJvdW5kLm5leHQobWVzc2FnZSk7XG5cdFx0XHR0aGlzLl9zdGF0cy5tZXNzYWdlc1NlbnQrKztcblx0XHR9XG5cdFx0YXN5bmMgcmVxdWVzdCh0b0NoYW5uZWwsIHBheWxvYWQsIG9wdHMgPSB7fSkge1xuXHRcdFx0Y29uc3QgcmVxSWQgPSBVVUlEdjQoKTtcblx0XHRcdGNvbnN0IHJlc29sdmVycyA9IFByb21pc2Uud2l0aFJlc29sdmVycygpO1xuXHRcdFx0dGhpcy5fcGVuZGluZy5zZXQocmVxSWQsIHJlc29sdmVycyk7XG5cdFx0XHRjb25zdCB0aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdGlmICh0aGlzLl9wZW5kaW5nLmhhcyhyZXFJZCkpIHtcblx0XHRcdFx0XHR0aGlzLl9wZW5kaW5nLmRlbGV0ZShyZXFJZCk7XG5cdFx0XHRcdFx0cmVzb2x2ZXJzLnJlamVjdCgvKiBAX19QVVJFX18gKi8gbmV3IEVycm9yKGBSZXF1ZXN0IHRpbWVvdXRgKSk7XG5cdFx0XHRcdH1cblx0XHRcdH0sIG9wdHMudGltZW91dCA/PyB0aGlzLl9vcHRzLnRpbWVvdXQpO1xuXHRcdFx0dGhpcy5uZXh0KHtcblx0XHRcdFx0aWQ6IFVVSUR2NCgpLFxuXHRcdFx0XHRjaGFubmVsOiB0b0NoYW5uZWwsXG5cdFx0XHRcdHNlbmRlcjogdGhpcy5fbmFtZSxcblx0XHRcdFx0dHlwZTogXCJyZXF1ZXN0XCIsXG5cdFx0XHRcdHJlcUlkLFxuXHRcdFx0XHRwYXlsb2FkOiB7XG5cdFx0XHRcdFx0Li4ucGF5bG9hZCxcblx0XHRcdFx0XHRhY3Rpb246IG9wdHMuYWN0aW9uLFxuXHRcdFx0XHRcdHBhdGg6IG9wdHMucGF0aFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR0aW1lc3RhbXA6IERhdGUubm93KClcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIHJlc29sdmVycy5wcm9taXNlLmZpbmFsbHkoKCkgPT4gY2xlYXJUaW1lb3V0KHRpbWVvdXQpKTtcblx0XHR9XG5cdFx0cmVzcG9uZChvcmlnaW5hbCwgcGF5bG9hZCkge1xuXHRcdFx0dGhpcy5uZXh0KHtcblx0XHRcdFx0aWQ6IFVVSUR2NCgpLFxuXHRcdFx0XHRjaGFubmVsOiBvcmlnaW5hbC5zZW5kZXIsXG5cdFx0XHRcdHNlbmRlcjogdGhpcy5fbmFtZSxcblx0XHRcdFx0dHlwZTogXCJyZXNwb25zZVwiLFxuXHRcdFx0XHRyZXFJZDogb3JpZ2luYWwucmVxSWQsXG5cdFx0XHRcdHBheWxvYWQsXG5cdFx0XHRcdHRpbWVzdGFtcDogRGF0ZS5ub3coKVxuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdGVtaXQodG9DaGFubmVsLCBldmVudFR5cGUsIGRhdGEpIHtcblx0XHRcdHRoaXMubmV4dCh7XG5cdFx0XHRcdGlkOiBVVUlEdjQoKSxcblx0XHRcdFx0Y2hhbm5lbDogdG9DaGFubmVsLFxuXHRcdFx0XHRzZW5kZXI6IHRoaXMuX25hbWUsXG5cdFx0XHRcdHR5cGU6IFwiZXZlbnRcIixcblx0XHRcdFx0cGF5bG9hZDoge1xuXHRcdFx0XHRcdHR5cGU6IGV2ZW50VHlwZSxcblx0XHRcdFx0XHRkYXRhXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHRpbWVzdGFtcDogRGF0ZS5ub3coKVxuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdHN1YnNjcmliZU91dGJvdW5kKG9ic2VydmVyKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fb3V0Ym91bmQuc3Vic2NyaWJlKHR5cGVvZiBvYnNlcnZlciA9PT0gXCJmdW5jdGlvblwiID8geyBuZXh0OiBvYnNlcnZlciB9IDogb2JzZXJ2ZXIpO1xuXHRcdH1cblx0XHRwdXNoSW5ib3VuZChtZXNzYWdlKSB7XG5cdFx0XHR0aGlzLl9zdGF0cy5tZXNzYWdlc1JlY2VpdmVkKys7XG5cdFx0XHRpZiAobWVzc2FnZS50eXBlID09PSBcInJlc3BvbnNlXCIgJiYgbWVzc2FnZS5yZXFJZCkge1xuXHRcdFx0XHRjb25zdCByID0gdGhpcy5fcGVuZGluZy5nZXQobWVzc2FnZS5yZXFJZCk7XG5cdFx0XHRcdGlmIChyKSB7XG5cdFx0XHRcdFx0dGhpcy5fcGVuZGluZy5kZWxldGUobWVzc2FnZS5yZXFJZCk7XG5cdFx0XHRcdFx0ci5yZXNvbHZlKG1lc3NhZ2UucGF5bG9hZCk7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHR0aGlzLl9pbmJvdW5kLm5leHQobWVzc2FnZSk7XG5cdFx0fVxuXHRcdGFzeW5jIGNvbm5lY3QoKSB7XG5cdFx0XHRpZiAodGhpcy5fc3RhdGUgPT09IFwiY29ubmVjdGVkXCIpIHJldHVybjtcblx0XHRcdHRoaXMuX3NldFN0YXRlKFwiY29ubmVjdGluZ1wiKTtcblx0XHRcdHRoaXMuX3N0YXJ0VGltZSA9IERhdGUubm93KCk7XG5cdFx0XHR0aGlzLl9zZXRTdGF0ZShcImNvbm5lY3RlZFwiKTtcblx0XHRcdHRoaXMuX2ZsdXNoQnVmZmVyKCk7XG5cdFx0fVxuXHRcdGRpc2Nvbm5lY3QoKSB7XG5cdFx0XHRpZiAodGhpcy5fc3RhdGUgPT09IFwiZGlzY29ubmVjdGVkXCIgfHwgdGhpcy5fc3RhdGUgPT09IFwiY2xvc2VkXCIpIHJldHVybjtcblx0XHRcdHRoaXMuX3NldFN0YXRlKFwiZGlzY29ubmVjdGVkXCIpO1xuXHRcdFx0dGhpcy5fc3Vicy5mb3JFYWNoKChzKSA9PiBzLnVuc3Vic2NyaWJlKCkpO1xuXHRcdFx0dGhpcy5fc3VicyA9IFtdO1xuXHRcdH1cblx0XHRjbG9zZSgpIHtcblx0XHRcdHRoaXMuZGlzY29ubmVjdCgpO1xuXHRcdFx0dGhpcy5fc2V0U3RhdGUoXCJjbG9zZWRcIik7XG5cdFx0XHR0aGlzLl9pbmJvdW5kLmNvbXBsZXRlKCk7XG5cdFx0XHR0aGlzLl9vdXRib3VuZC5jb21wbGV0ZSgpO1xuXHRcdFx0dGhpcy5fc3RhdGVDaGFuZ2VzLmNvbXBsZXRlKCk7XG5cdFx0fVxuXHRcdG1hcmtDb25uZWN0ZWQoKSB7XG5cdFx0XHR0aGlzLl9zZXRTdGF0ZShcImNvbm5lY3RlZFwiKTtcblx0XHRcdHRoaXMuX2ZsdXNoQnVmZmVyKCk7XG5cdFx0fVxuXHRcdG1hcmtEaXNjb25uZWN0ZWQoKSB7XG5cdFx0XHR0aGlzLl9zZXRTdGF0ZShcImRpc2Nvbm5lY3RlZFwiKTtcblx0XHR9XG5cdFx0X3NldFN0YXRlKHN0YXRlKSB7XG5cdFx0XHRpZiAodGhpcy5fc3RhdGUgIT09IHN0YXRlKSB7XG5cdFx0XHRcdHRoaXMuX3N0YXRlID0gc3RhdGU7XG5cdFx0XHRcdHRoaXMuX3N0YXRlQ2hhbmdlcy5uZXh0KHN0YXRlKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0X2ZsdXNoQnVmZmVyKCkge1xuXHRcdFx0Zm9yIChjb25zdCBtc2cgb2YgdGhpcy5fYnVmZmVyKSB0aGlzLl9vdXRib3VuZC5uZXh0KG1zZyk7XG5cdFx0XHR0aGlzLl9idWZmZXIgPSBbXTtcblx0XHR9XG5cdFx0X3NldHVwU3Vic2NyaXB0aW9ucygpIHtcblx0XHRcdHRoaXMuX3N1YnMucHVzaCh0aGlzLl9pbmJvdW5kLnN1YnNjcmliZSh7IG5leHQ6IChtc2cpID0+IHtcblx0XHRcdFx0aWYgKG1zZy50eXBlID09PSBcInNpZ25hbFwiICYmIG1zZy5wYXlsb2FkPy50eXBlID09PSBcImNvbm5lY3RcIikgdGhpcy5fY29ubmVjdGVkUGVlcnMuc2V0KG1zZy5zZW5kZXIsIHtcblx0XHRcdFx0XHRuYW1lOiBtc2cuc2VuZGVyLFxuXHRcdFx0XHRcdHN0YXRlOiBcImNvbm5lY3RlZFwiLFxuXHRcdFx0XHRcdGlzSG9zdDogZmFsc2Vcblx0XHRcdFx0fSk7XG5cdFx0XHR9IH0pKTtcblx0XHR9XG5cdFx0Z2V0IGlkKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2lkO1xuXHRcdH1cblx0XHRnZXQgbmFtZSgpIHtcblx0XHRcdHJldHVybiB0aGlzLl9uYW1lO1xuXHRcdH1cblx0XHRnZXQgc3RhdGUoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fc3RhdGU7XG5cdFx0fVxuXHRcdGdldCB0cmFuc3BvcnRUeXBlKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX3RyYW5zcG9ydFR5cGU7XG5cdFx0fVxuXHRcdGdldCBzdGF0cygpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdC4uLnRoaXMuX3N0YXRzLFxuXHRcdFx0XHR1cHRpbWU6IHRoaXMuX3N0YXJ0VGltZSA/IERhdGUubm93KCkgLSB0aGlzLl9zdGFydFRpbWUgOiAwXG5cdFx0XHR9O1xuXHRcdH1cblx0XHRnZXQgc3RhdGVDaGFuZ2VzKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX3N0YXRlQ2hhbmdlcztcblx0XHR9XG5cdFx0Z2V0IGNvbm5lY3RlZFBlZXJzKCkge1xuXHRcdFx0cmV0dXJuIFsuLi50aGlzLl9jb25uZWN0ZWRQZWVycy5rZXlzKCldO1xuXHRcdH1cblx0XHRnZXQgbWV0YSgpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGlkOiB0aGlzLl9pZCxcblx0XHRcdFx0bmFtZTogdGhpcy5fbmFtZSxcblx0XHRcdFx0c3RhdGU6IHRoaXMuX3N0YXRlLFxuXHRcdFx0XHRpc0hvc3Q6IGZhbHNlLFxuXHRcdFx0XHRjb25uZWN0ZWRDaGFubmVsczogbmV3IFNldCh0aGlzLl9jb25uZWN0ZWRQZWVycy5rZXlzKCkpXG5cdFx0XHR9O1xuXHRcdH1cblx0fTtcblx0dmFyIENvbm5lY3Rpb25Qb29sID0gY2xhc3MgQ29ubmVjdGlvblBvb2wge1xuXHRcdF9jb25uZWN0aW9ucyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG5cdFx0c3RhdGljIF9pbnN0YW5jZSA9IG51bGw7XG5cdFx0c3RhdGljIGdldEluc3RhbmNlKCkge1xuXHRcdFx0aWYgKCFDb25uZWN0aW9uUG9vbC5faW5zdGFuY2UpIENvbm5lY3Rpb25Qb29sLl9pbnN0YW5jZSA9IG5ldyBDb25uZWN0aW9uUG9vbCgpO1xuXHRcdFx0cmV0dXJuIENvbm5lY3Rpb25Qb29sLl9pbnN0YW5jZTtcblx0XHR9XG5cdFx0Z2V0T3JDcmVhdGUobmFtZSwgdHJhbnNwb3J0VHlwZSA9IFwiaW50ZXJuYWxcIiwgb3B0aW9ucyA9IHt9KSB7XG5cdFx0XHRpZiAoIXRoaXMuX2Nvbm5lY3Rpb25zLmhhcyhuYW1lKSkgdGhpcy5fY29ubmVjdGlvbnMuc2V0KG5hbWUsIG5ldyBDaGFubmVsQ29ubmVjdGlvbihuYW1lLCB0cmFuc3BvcnRUeXBlLCBvcHRpb25zKSk7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY29ubmVjdGlvbnMuZ2V0KG5hbWUpO1xuXHRcdH1cblx0XHRnZXQobmFtZSkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2Nvbm5lY3Rpb25zLmdldChuYW1lKTtcblx0XHR9XG5cdFx0aGFzKG5hbWUpIHtcblx0XHRcdHJldHVybiB0aGlzLl9jb25uZWN0aW9ucy5oYXMobmFtZSk7XG5cdFx0fVxuXHRcdGRlbGV0ZShuYW1lKSB7XG5cdFx0XHR0aGlzLl9jb25uZWN0aW9ucy5nZXQobmFtZSk/LmNsb3NlKCk7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY29ubmVjdGlvbnMuZGVsZXRlKG5hbWUpO1xuXHRcdH1cblx0XHRjbGVhcigpIHtcblx0XHRcdHRoaXMuX2Nvbm5lY3Rpb25zLmZvckVhY2goKGMpID0+IGMuY2xvc2UoKSk7XG5cdFx0XHR0aGlzLl9jb25uZWN0aW9ucy5jbGVhcigpO1xuXHRcdH1cblx0XHRnZXQgc2l6ZSgpIHtcblx0XHRcdHJldHVybiB0aGlzLl9jb25uZWN0aW9ucy5zaXplO1xuXHRcdH1cblx0XHRnZXQgbmFtZXMoKSB7XG5cdFx0XHRyZXR1cm4gWy4uLnRoaXMuX2Nvbm5lY3Rpb25zLmtleXMoKV07XG5cdFx0fVxuXHR9O1xuXHRjb25zdCBnZXRDb25uZWN0aW9uUG9vbCA9ICgpID0+IENvbm5lY3Rpb25Qb29sLmdldEluc3RhbmNlKCk7XG5cdGNvbnN0IGdldENvbm5lY3Rpb24gPSAobmFtZSwgdHJhbnNwb3J0VHlwZSwgb3B0aW9ucykgPT4gZ2V0Q29ubmVjdGlvblBvb2woKS5nZXRPckNyZWF0ZShuYW1lLCB0cmFuc3BvcnRUeXBlLCBvcHRpb25zKTtcblxuLy8jZW5kcmVnaW9uXG4vLyNyZWdpb24gLi4vdW5pZm9ybS50cy9zcmMvbmV3ZXIvbmV4dC9zdG9yYWdlL1N0b3JhZ2UudHNcbi8qKlxuXHQqIEluZGV4ZWREQiBJbnRlZ3JhdGlvbiBmb3IgQ2hhbm5lbCBTeXN0ZW1cblx0KlxuXHQqIFByb3ZpZGVzIHBlcnNpc3RlbnQgc3RvcmFnZSBjYXBhYmlsaXRpZXMgZm9yIGNoYW5uZWwgY29tbXVuaWNhdGlvbjpcblx0KiAtIERlZmVyOiBRdWV1ZSBtZXNzYWdlcyBmb3IgbGF0ZXIgZGVsaXZlcnlcblx0KiAtIFBlbmRpbmc6IFRyYWNrIHBlbmRpbmcgb3BlcmF0aW9uc1xuXHQqIC0gTWFpbGJveC9JbmJveDogU3RvcmUgbWVzc2FnZXMgcGVyIGNoYW5uZWxcblx0KiAtIFRyYW5zYWN0aW9uczogQmF0Y2ggb3BlcmF0aW9ucyB3aXRoIHJvbGxiYWNrXG5cdCogLSBFeGNoYW5nZTogQ29vcmRpbmF0ZSBkYXRhIGJldHdlZW4gY29udGV4dHNcblx0Ki9cblx0Y29uc3QgREJfTkFNRSA9IFwidW5pZm9ybV9jaGFubmVsc1wiO1xuXHRjb25zdCBEQl9WRVJTSU9OID0gMTtcblx0Y29uc3QgU1RPUkVTID0ge1xuXHRcdE1FU1NBR0VTOiBcIm1lc3NhZ2VzXCIsXG5cdFx0TUFJTEJPWDogXCJtYWlsYm94XCIsXG5cdFx0UEVORElORzogXCJwZW5kaW5nXCIsXG5cdFx0RVhDSEFOR0U6IFwiZXhjaGFuZ2VcIixcblx0XHRUUkFOU0FDVElPTlM6IFwidHJhbnNhY3Rpb25zXCJcblx0fTtcblx0LyoqXG5cdCogSW5kZXhlZERCIG1hbmFnZXIgZm9yIGNoYW5uZWwgc3RvcmFnZVxuXHQqL1xuXHR2YXIgQ2hhbm5lbFN0b3JhZ2UgPSBjbGFzcyB7XG5cdFx0X2RiID0gbnVsbDtcblx0XHRfaXNPcGVuID0gZmFsc2U7XG5cdFx0X29wZW5Qcm9taXNlID0gbnVsbDtcblx0XHRfY2hhbm5lbE5hbWU7XG5cdFx0X21lc3NhZ2VVcGRhdGVzID0gbmV3IENoYW5uZWxTdWJqZWN0KCk7XG5cdFx0X2V4Y2hhbmdlVXBkYXRlcyA9IG5ldyBDaGFubmVsU3ViamVjdCgpO1xuXHRcdGNvbnN0cnVjdG9yKGNoYW5uZWxOYW1lKSB7XG5cdFx0XHR0aGlzLl9jaGFubmVsTmFtZSA9IGNoYW5uZWxOYW1lO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIE9wZW4gZGF0YWJhc2UgY29ubmVjdGlvblxuXHRcdCovXG5cdFx0YXN5bmMgb3BlbigpIHtcblx0XHRcdGlmICh0aGlzLl9kYiAmJiB0aGlzLl9pc09wZW4pIHJldHVybiB0aGlzLl9kYjtcblx0XHRcdGlmICh0aGlzLl9vcGVuUHJvbWlzZSkgcmV0dXJuIHRoaXMuX29wZW5Qcm9taXNlO1xuXHRcdFx0dGhpcy5fb3BlblByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHRcdGNvbnN0IHJlcXVlc3QgPSBpbmRleGVkREIub3BlbihEQl9OQU1FLCBEQl9WRVJTSU9OKTtcblx0XHRcdFx0cmVxdWVzdC5vbmVycm9yID0gKCkgPT4ge1xuXHRcdFx0XHRcdHRoaXMuX29wZW5Qcm9taXNlID0gbnVsbDtcblx0XHRcdFx0XHRyZWplY3QoLyogQF9fUFVSRV9fICovIG5ldyBFcnJvcihcIkZhaWxlZCB0byBvcGVuIEluZGV4ZWREQlwiKSk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHJlcXVlc3Qub25zdWNjZXNzID0gKCkgPT4ge1xuXHRcdFx0XHRcdHRoaXMuX2RiID0gcmVxdWVzdC5yZXN1bHQ7XG5cdFx0XHRcdFx0dGhpcy5faXNPcGVuID0gdHJ1ZTtcblx0XHRcdFx0XHR0aGlzLl9vcGVuUHJvbWlzZSA9IG51bGw7XG5cdFx0XHRcdFx0cmVzb2x2ZSh0aGlzLl9kYik7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHJlcXVlc3Qub251cGdyYWRlbmVlZGVkID0gKGV2ZW50KSA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgZGIgPSBldmVudC50YXJnZXQucmVzdWx0O1xuXHRcdFx0XHRcdHRoaXMuX2NyZWF0ZVN0b3JlcyhkYik7XG5cdFx0XHRcdH07XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiB0aGlzLl9vcGVuUHJvbWlzZTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBDbG9zZSBkYXRhYmFzZSBjb25uZWN0aW9uXG5cdFx0Ki9cblx0XHRjbG9zZSgpIHtcblx0XHRcdGlmICh0aGlzLl9kYikge1xuXHRcdFx0XHR0aGlzLl9kYi5jbG9zZSgpO1xuXHRcdFx0XHR0aGlzLl9kYiA9IG51bGw7XG5cdFx0XHRcdHRoaXMuX2lzT3BlbiA9IGZhbHNlO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRfY3JlYXRlU3RvcmVzKGRiKSB7XG5cdFx0XHRpZiAoIWRiLm9iamVjdFN0b3JlTmFtZXMuY29udGFpbnMoU1RPUkVTLk1FU1NBR0VTKSkge1xuXHRcdFx0XHRjb25zdCBtZXNzYWdlc1N0b3JlID0gZGIuY3JlYXRlT2JqZWN0U3RvcmUoU1RPUkVTLk1FU1NBR0VTLCB7IGtleVBhdGg6IFwiaWRcIiB9KTtcblx0XHRcdFx0bWVzc2FnZXNTdG9yZS5jcmVhdGVJbmRleChcImNoYW5uZWxcIiwgXCJjaGFubmVsXCIsIHsgdW5pcXVlOiBmYWxzZSB9KTtcblx0XHRcdFx0bWVzc2FnZXNTdG9yZS5jcmVhdGVJbmRleChcInN0YXR1c1wiLCBcInN0YXR1c1wiLCB7IHVuaXF1ZTogZmFsc2UgfSk7XG5cdFx0XHRcdG1lc3NhZ2VzU3RvcmUuY3JlYXRlSW5kZXgoXCJyZWNpcGllbnRcIiwgXCJyZWNpcGllbnRcIiwgeyB1bmlxdWU6IGZhbHNlIH0pO1xuXHRcdFx0XHRtZXNzYWdlc1N0b3JlLmNyZWF0ZUluZGV4KFwiY3JlYXRlZEF0XCIsIFwiY3JlYXRlZEF0XCIsIHsgdW5pcXVlOiBmYWxzZSB9KTtcblx0XHRcdFx0bWVzc2FnZXNTdG9yZS5jcmVhdGVJbmRleChcImNoYW5uZWxfc3RhdHVzXCIsIFtcImNoYW5uZWxcIiwgXCJzdGF0dXNcIl0sIHsgdW5pcXVlOiBmYWxzZSB9KTtcblx0XHRcdH1cblx0XHRcdGlmICghZGIub2JqZWN0U3RvcmVOYW1lcy5jb250YWlucyhTVE9SRVMuTUFJTEJPWCkpIHtcblx0XHRcdFx0Y29uc3QgbWFpbGJveFN0b3JlID0gZGIuY3JlYXRlT2JqZWN0U3RvcmUoU1RPUkVTLk1BSUxCT1gsIHsga2V5UGF0aDogXCJpZFwiIH0pO1xuXHRcdFx0XHRtYWlsYm94U3RvcmUuY3JlYXRlSW5kZXgoXCJjaGFubmVsXCIsIFwiY2hhbm5lbFwiLCB7IHVuaXF1ZTogZmFsc2UgfSk7XG5cdFx0XHRcdG1haWxib3hTdG9yZS5jcmVhdGVJbmRleChcInByaW9yaXR5XCIsIFwicHJpb3JpdHlcIiwgeyB1bmlxdWU6IGZhbHNlIH0pO1xuXHRcdFx0XHRtYWlsYm94U3RvcmUuY3JlYXRlSW5kZXgoXCJleHBpcmVzQXRcIiwgXCJleHBpcmVzQXRcIiwgeyB1bmlxdWU6IGZhbHNlIH0pO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCFkYi5vYmplY3RTdG9yZU5hbWVzLmNvbnRhaW5zKFNUT1JFUy5QRU5ESU5HKSkge1xuXHRcdFx0XHRjb25zdCBwZW5kaW5nU3RvcmUgPSBkYi5jcmVhdGVPYmplY3RTdG9yZShTVE9SRVMuUEVORElORywgeyBrZXlQYXRoOiBcImlkXCIgfSk7XG5cdFx0XHRcdHBlbmRpbmdTdG9yZS5jcmVhdGVJbmRleChcImNoYW5uZWxcIiwgXCJjaGFubmVsXCIsIHsgdW5pcXVlOiBmYWxzZSB9KTtcblx0XHRcdFx0cGVuZGluZ1N0b3JlLmNyZWF0ZUluZGV4KFwiY3JlYXRlZEF0XCIsIFwiY3JlYXRlZEF0XCIsIHsgdW5pcXVlOiBmYWxzZSB9KTtcblx0XHRcdH1cblx0XHRcdGlmICghZGIub2JqZWN0U3RvcmVOYW1lcy5jb250YWlucyhTVE9SRVMuRVhDSEFOR0UpKSB7XG5cdFx0XHRcdGNvbnN0IGV4Y2hhbmdlU3RvcmUgPSBkYi5jcmVhdGVPYmplY3RTdG9yZShTVE9SRVMuRVhDSEFOR0UsIHsga2V5UGF0aDogXCJpZFwiIH0pO1xuXHRcdFx0XHRleGNoYW5nZVN0b3JlLmNyZWF0ZUluZGV4KFwia2V5XCIsIFwia2V5XCIsIHsgdW5pcXVlOiB0cnVlIH0pO1xuXHRcdFx0XHRleGNoYW5nZVN0b3JlLmNyZWF0ZUluZGV4KFwib3duZXJcIiwgXCJvd25lclwiLCB7IHVuaXF1ZTogZmFsc2UgfSk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoIWRiLm9iamVjdFN0b3JlTmFtZXMuY29udGFpbnMoU1RPUkVTLlRSQU5TQUNUSU9OUykpIGRiLmNyZWF0ZU9iamVjdFN0b3JlKFNUT1JFUy5UUkFOU0FDVElPTlMsIHsga2V5UGF0aDogXCJpZFwiIH0pLmNyZWF0ZUluZGV4KFwiY3JlYXRlZEF0XCIsIFwiY3JlYXRlZEF0XCIsIHsgdW5pcXVlOiBmYWxzZSB9KTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBEZWZlciBhIG1lc3NhZ2UgZm9yIGxhdGVyIGRlbGl2ZXJ5XG5cdFx0Ki9cblx0XHRhc3luYyBkZWZlcihtZXNzYWdlLCBvcHRpb25zID0ge30pIHtcblx0XHRcdGNvbnN0IGRiID0gYXdhaXQgdGhpcy5vcGVuKCk7XG5cdFx0XHRjb25zdCBzdG9yZWRNZXNzYWdlID0ge1xuXHRcdFx0XHRpZDogVVVJRHY0KCksXG5cdFx0XHRcdGNoYW5uZWw6IG1lc3NhZ2UuY2hhbm5lbCxcblx0XHRcdFx0c2VuZGVyOiBtZXNzYWdlLnNlbmRlciA/PyB0aGlzLl9jaGFubmVsTmFtZSxcblx0XHRcdFx0cmVjaXBpZW50OiBtZXNzYWdlLmNoYW5uZWwsXG5cdFx0XHRcdHR5cGU6IG1lc3NhZ2UudHlwZSxcblx0XHRcdFx0cGF5bG9hZDogbWVzc2FnZS5wYXlsb2FkLFxuXHRcdFx0XHRzdGF0dXM6IFwicGVuZGluZ1wiLFxuXHRcdFx0XHRwcmlvcml0eTogb3B0aW9ucy5wcmlvcml0eSA/PyAwLFxuXHRcdFx0XHRjcmVhdGVkQXQ6IERhdGUubm93KCksXG5cdFx0XHRcdHVwZGF0ZWRBdDogRGF0ZS5ub3coKSxcblx0XHRcdFx0ZXhwaXJlc0F0OiBvcHRpb25zLmV4cGlyZXNJbiA/IERhdGUubm93KCkgKyBvcHRpb25zLmV4cGlyZXNJbiA6IG51bGwsXG5cdFx0XHRcdHJldHJ5Q291bnQ6IDAsXG5cdFx0XHRcdG1heFJldHJpZXM6IG9wdGlvbnMubWF4UmV0cmllcyA/PyAzLFxuXHRcdFx0XHRtZXRhZGF0YTogb3B0aW9ucy5tZXRhZGF0YVxuXHRcdFx0fTtcblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHRcdGNvbnN0IHR4ID0gZGIudHJhbnNhY3Rpb24oW1NUT1JFUy5NRVNTQUdFUywgU1RPUkVTLk1BSUxCT1hdLCBcInJlYWR3cml0ZVwiKTtcblx0XHRcdFx0Y29uc3QgbWVzc2FnZXNTdG9yZSA9IHR4Lm9iamVjdFN0b3JlKFNUT1JFUy5NRVNTQUdFUyk7XG5cdFx0XHRcdGNvbnN0IG1haWxib3hTdG9yZSA9IHR4Lm9iamVjdFN0b3JlKFNUT1JFUy5NQUlMQk9YKTtcblx0XHRcdFx0bWVzc2FnZXNTdG9yZS5hZGQoc3RvcmVkTWVzc2FnZSk7XG5cdFx0XHRcdG1haWxib3hTdG9yZS5hZGQoc3RvcmVkTWVzc2FnZSk7XG5cdFx0XHRcdHR4Lm9uY29tcGxldGUgPSAoKSA9PiB7XG5cdFx0XHRcdFx0dGhpcy5fbWVzc2FnZVVwZGF0ZXMubmV4dChzdG9yZWRNZXNzYWdlKTtcblx0XHRcdFx0XHRyZXNvbHZlKHN0b3JlZE1lc3NhZ2UuaWQpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR0eC5vbmVycm9yID0gKCkgPT4gcmVqZWN0KC8qIEBfX1BVUkVfXyAqLyBuZXcgRXJyb3IoXCJGYWlsZWQgdG8gZGVmZXIgbWVzc2FnZVwiKSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBHZXQgZGVmZXJyZWQgbWVzc2FnZXMgZm9yIGEgY2hhbm5lbFxuXHRcdCovXG5cdFx0YXN5bmMgZ2V0RGVmZXJyZWRNZXNzYWdlcyhjaGFubmVsLCBvcHRpb25zID0ge30pIHtcblx0XHRcdGNvbnN0IGRiID0gYXdhaXQgdGhpcy5vcGVuKCk7XG5cdFx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0XHRjb25zdCBzdG9yZSA9IGRiLnRyYW5zYWN0aW9uKFNUT1JFUy5NRVNTQUdFUywgXCJyZWFkb25seVwiKS5vYmplY3RTdG9yZShTVE9SRVMuTUVTU0FHRVMpO1xuXHRcdFx0XHRjb25zdCBpbmRleCA9IG9wdGlvbnMuc3RhdHVzID8gc3RvcmUuaW5kZXgoXCJjaGFubmVsX3N0YXR1c1wiKSA6IHN0b3JlLmluZGV4KFwiY2hhbm5lbFwiKTtcblx0XHRcdFx0Y29uc3QgcXVlcnkgPSBvcHRpb25zLnN0YXR1cyA/IElEQktleVJhbmdlLm9ubHkoW2NoYW5uZWwsIG9wdGlvbnMuc3RhdHVzXSkgOiBJREJLZXlSYW5nZS5vbmx5KGNoYW5uZWwpO1xuXHRcdFx0XHRjb25zdCByZXF1ZXN0ID0gaW5kZXguZ2V0QWxsKHF1ZXJ5LCBvcHRpb25zLmxpbWl0KTtcblx0XHRcdFx0cmVxdWVzdC5vbnN1Y2Nlc3MgPSAoKSA9PiB7XG5cdFx0XHRcdFx0bGV0IHJlc3VsdHMgPSByZXF1ZXN0LnJlc3VsdDtcblx0XHRcdFx0XHRpZiAob3B0aW9ucy5vZmZzZXQpIHJlc3VsdHMgPSByZXN1bHRzLnNsaWNlKG9wdGlvbnMub2Zmc2V0KTtcblx0XHRcdFx0XHRyZXNvbHZlKHJlc3VsdHMpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHRyZXF1ZXN0Lm9uZXJyb3IgPSAoKSA9PiByZWplY3QoLyogQF9fUFVSRV9fICovIG5ldyBFcnJvcihcIkZhaWxlZCB0byBnZXQgZGVmZXJyZWQgbWVzc2FnZXNcIikpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogUHJvY2VzcyBuZXh0IHBlbmRpbmcgbWVzc2FnZVxuXHRcdCovXG5cdFx0YXN5bmMgcHJvY2Vzc05leHRQZW5kaW5nKGNoYW5uZWwpIHtcblx0XHRcdGNvbnN0IGRiID0gYXdhaXQgdGhpcy5vcGVuKCk7XG5cdFx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0XHRjb25zdCByZXF1ZXN0ID0gZGIudHJhbnNhY3Rpb24oU1RPUkVTLk1FU1NBR0VTLCBcInJlYWR3cml0ZVwiKS5vYmplY3RTdG9yZShTVE9SRVMuTUVTU0FHRVMpLmluZGV4KFwiY2hhbm5lbF9zdGF0dXNcIikub3BlbkN1cnNvcihJREJLZXlSYW5nZS5vbmx5KFtjaGFubmVsLCBcInBlbmRpbmdcIl0pKTtcblx0XHRcdFx0cmVxdWVzdC5vbnN1Y2Nlc3MgPSAoKSA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgY3Vyc29yID0gcmVxdWVzdC5yZXN1bHQ7XG5cdFx0XHRcdFx0aWYgKGN1cnNvcikge1xuXHRcdFx0XHRcdFx0Y29uc3QgbWVzc2FnZSA9IGN1cnNvci52YWx1ZTtcblx0XHRcdFx0XHRcdG1lc3NhZ2Uuc3RhdHVzID0gXCJwcm9jZXNzaW5nXCI7XG5cdFx0XHRcdFx0XHRtZXNzYWdlLnVwZGF0ZWRBdCA9IERhdGUubm93KCk7XG5cdFx0XHRcdFx0XHRjdXJzb3IudXBkYXRlKG1lc3NhZ2UpO1xuXHRcdFx0XHRcdFx0dGhpcy5fbWVzc2FnZVVwZGF0ZXMubmV4dChtZXNzYWdlKTtcblx0XHRcdFx0XHRcdHJlc29sdmUobWVzc2FnZSk7XG5cdFx0XHRcdFx0fSBlbHNlIHJlc29sdmUobnVsbCk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHJlcXVlc3Qub25lcnJvciA9ICgpID0+IHJlamVjdCgvKiBAX19QVVJFX18gKi8gbmV3IEVycm9yKFwiRmFpbGVkIHRvIHByb2Nlc3MgcGVuZGluZyBtZXNzYWdlXCIpKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIE1hcmsgbWVzc2FnZSBhcyBkZWxpdmVyZWRcblx0XHQqL1xuXHRcdGFzeW5jIG1hcmtEZWxpdmVyZWQobWVzc2FnZUlkKSB7XG5cdFx0XHRhd2FpdCB0aGlzLl91cGRhdGVNZXNzYWdlU3RhdHVzKG1lc3NhZ2VJZCwgXCJkZWxpdmVyZWRcIik7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogTWFyayBtZXNzYWdlIGFzIGZhaWxlZCBhbmQgcmV0cnkgaWYgcG9zc2libGVcblx0XHQqL1xuXHRcdGFzeW5jIG1hcmtGYWlsZWQobWVzc2FnZUlkKSB7XG5cdFx0XHRjb25zdCBkYiA9IGF3YWl0IHRoaXMub3BlbigpO1xuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdFx0Y29uc3Qgc3RvcmUgPSBkYi50cmFuc2FjdGlvbihTVE9SRVMuTUVTU0FHRVMsIFwicmVhZHdyaXRlXCIpLm9iamVjdFN0b3JlKFNUT1JFUy5NRVNTQUdFUyk7XG5cdFx0XHRcdGNvbnN0IHJlcXVlc3QgPSBzdG9yZS5nZXQobWVzc2FnZUlkKTtcblx0XHRcdFx0cmVxdWVzdC5vbnN1Y2Nlc3MgPSAoKSA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgbWVzc2FnZSA9IHJlcXVlc3QucmVzdWx0O1xuXHRcdFx0XHRcdGlmICghbWVzc2FnZSkge1xuXHRcdFx0XHRcdFx0cmVzb2x2ZShmYWxzZSk7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdG1lc3NhZ2UucmV0cnlDb3VudCsrO1xuXHRcdFx0XHRcdG1lc3NhZ2UudXBkYXRlZEF0ID0gRGF0ZS5ub3coKTtcblx0XHRcdFx0XHRpZiAobWVzc2FnZS5yZXRyeUNvdW50IDwgbWVzc2FnZS5tYXhSZXRyaWVzKSBtZXNzYWdlLnN0YXR1cyA9IFwicGVuZGluZ1wiO1xuXHRcdFx0XHRcdGVsc2UgbWVzc2FnZS5zdGF0dXMgPSBcImZhaWxlZFwiO1xuXHRcdFx0XHRcdHN0b3JlLnB1dChtZXNzYWdlKTtcblx0XHRcdFx0XHR0aGlzLl9tZXNzYWdlVXBkYXRlcy5uZXh0KG1lc3NhZ2UpO1xuXHRcdFx0XHRcdHJlc29sdmUobWVzc2FnZS5zdGF0dXMgPT09IFwicGVuZGluZ1wiKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0cmVxdWVzdC5vbmVycm9yID0gKCkgPT4gcmVqZWN0KC8qIEBfX1BVUkVfXyAqLyBuZXcgRXJyb3IoXCJGYWlsZWQgdG8gbWFyayBtZXNzYWdlIGFzIGZhaWxlZFwiKSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0YXN5bmMgX3VwZGF0ZU1lc3NhZ2VTdGF0dXMobWVzc2FnZUlkLCBzdGF0dXMpIHtcblx0XHRcdGNvbnN0IGRiID0gYXdhaXQgdGhpcy5vcGVuKCk7XG5cdFx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0XHRjb25zdCBzdG9yZSA9IGRiLnRyYW5zYWN0aW9uKFNUT1JFUy5NRVNTQUdFUywgXCJyZWFkd3JpdGVcIikub2JqZWN0U3RvcmUoU1RPUkVTLk1FU1NBR0VTKTtcblx0XHRcdFx0Y29uc3QgcmVxdWVzdCA9IHN0b3JlLmdldChtZXNzYWdlSWQpO1xuXHRcdFx0XHRyZXF1ZXN0Lm9uc3VjY2VzcyA9ICgpID0+IHtcblx0XHRcdFx0XHRjb25zdCBtZXNzYWdlID0gcmVxdWVzdC5yZXN1bHQ7XG5cdFx0XHRcdFx0aWYgKG1lc3NhZ2UpIHtcblx0XHRcdFx0XHRcdG1lc3NhZ2Uuc3RhdHVzID0gc3RhdHVzO1xuXHRcdFx0XHRcdFx0bWVzc2FnZS51cGRhdGVkQXQgPSBEYXRlLm5vdygpO1xuXHRcdFx0XHRcdFx0c3RvcmUucHV0KG1lc3NhZ2UpO1xuXHRcdFx0XHRcdFx0dGhpcy5fbWVzc2FnZVVwZGF0ZXMubmV4dChtZXNzYWdlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmVzb2x2ZSgpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHRyZXF1ZXN0Lm9uZXJyb3IgPSAoKSA9PiByZWplY3QoLyogQF9fUFVSRV9fICovIG5ldyBFcnJvcihcIkZhaWxlZCB0byB1cGRhdGUgbWVzc2FnZSBzdGF0dXNcIikpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogR2V0IG1haWxib3ggZm9yIGEgY2hhbm5lbFxuXHRcdCovXG5cdFx0YXN5bmMgZ2V0TWFpbGJveChjaGFubmVsLCBvcHRpb25zID0ge30pIHtcblx0XHRcdGNvbnN0IGRiID0gYXdhaXQgdGhpcy5vcGVuKCk7XG5cdFx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0XHRjb25zdCByZXF1ZXN0ID0gZGIudHJhbnNhY3Rpb24oU1RPUkVTLk1BSUxCT1gsIFwicmVhZG9ubHlcIikub2JqZWN0U3RvcmUoU1RPUkVTLk1BSUxCT1gpLmluZGV4KFwiY2hhbm5lbFwiKS5nZXRBbGwoSURCS2V5UmFuZ2Uub25seShjaGFubmVsKSwgb3B0aW9ucy5saW1pdCk7XG5cdFx0XHRcdHJlcXVlc3Qub25zdWNjZXNzID0gKCkgPT4ge1xuXHRcdFx0XHRcdGxldCByZXN1bHRzID0gcmVxdWVzdC5yZXN1bHQ7XG5cdFx0XHRcdFx0aWYgKG9wdGlvbnMuc29ydEJ5ID09PSBcInByaW9yaXR5XCIpIHJlc3VsdHMuc29ydCgoYSwgYikgPT4gYi5wcmlvcml0eSAtIGEucHJpb3JpdHkpO1xuXHRcdFx0XHRcdGVsc2UgcmVzdWx0cy5zb3J0KChhLCBiKSA9PiBiLmNyZWF0ZWRBdCAtIGEuY3JlYXRlZEF0KTtcblx0XHRcdFx0XHRyZXNvbHZlKHJlc3VsdHMpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHRyZXF1ZXN0Lm9uZXJyb3IgPSAoKSA9PiByZWplY3QoLyogQF9fUFVSRV9fICovIG5ldyBFcnJvcihcIkZhaWxlZCB0byBnZXQgbWFpbGJveFwiKSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBHZXQgbWFpbGJveCBzdGF0aXN0aWNzXG5cdFx0Ki9cblx0XHRhc3luYyBnZXRNYWlsYm94U3RhdHMoY2hhbm5lbCkge1xuXHRcdFx0Y29uc3QgbWVzc2FnZXMgPSBhd2FpdCB0aGlzLmdldERlZmVycmVkTWVzc2FnZXMoY2hhbm5lbCk7XG5cdFx0XHRjb25zdCBzdGF0cyA9IHtcblx0XHRcdFx0dG90YWw6IG1lc3NhZ2VzLmxlbmd0aCxcblx0XHRcdFx0cGVuZGluZzogMCxcblx0XHRcdFx0cHJvY2Vzc2luZzogMCxcblx0XHRcdFx0ZGVsaXZlcmVkOiAwLFxuXHRcdFx0XHRmYWlsZWQ6IDAsXG5cdFx0XHRcdGV4cGlyZWQ6IDBcblx0XHRcdH07XG5cdFx0XHRjb25zdCBub3cgPSBEYXRlLm5vdygpO1xuXHRcdFx0Zm9yIChjb25zdCBtc2cgb2YgbWVzc2FnZXMpIGlmIChtc2cuZXhwaXJlc0F0ICYmIG1zZy5leHBpcmVzQXQgPCBub3cpIHN0YXRzLmV4cGlyZWQrKztcblx0XHRcdGVsc2Ugc3RhdHNbbXNnLnN0YXR1c10rKztcblx0XHRcdHJldHVybiBzdGF0cztcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBDbGVhciBtYWlsYm94IGZvciBhIGNoYW5uZWxcblx0XHQqL1xuXHRcdGFzeW5jIGNsZWFyTWFpbGJveChjaGFubmVsKSB7XG5cdFx0XHRjb25zdCBkYiA9IGF3YWl0IHRoaXMub3BlbigpO1xuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdFx0Y29uc3QgdHggPSBkYi50cmFuc2FjdGlvbihTVE9SRVMuTUFJTEJPWCwgXCJyZWFkd3JpdGVcIik7XG5cdFx0XHRcdGNvbnN0IGluZGV4ID0gdHgub2JqZWN0U3RvcmUoU1RPUkVTLk1BSUxCT1gpLmluZGV4KFwiY2hhbm5lbFwiKTtcblx0XHRcdFx0bGV0IGRlbGV0ZWRDb3VudCA9IDA7XG5cdFx0XHRcdGNvbnN0IHJlcXVlc3QgPSBpbmRleC5vcGVuQ3Vyc29yKElEQktleVJhbmdlLm9ubHkoY2hhbm5lbCkpO1xuXHRcdFx0XHRyZXF1ZXN0Lm9uc3VjY2VzcyA9ICgpID0+IHtcblx0XHRcdFx0XHRjb25zdCBjdXJzb3IgPSByZXF1ZXN0LnJlc3VsdDtcblx0XHRcdFx0XHRpZiAoY3Vyc29yKSB7XG5cdFx0XHRcdFx0XHRjdXJzb3IuZGVsZXRlKCk7XG5cdFx0XHRcdFx0XHRkZWxldGVkQ291bnQrKztcblx0XHRcdFx0XHRcdGN1cnNvci5jb250aW51ZSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblx0XHRcdFx0dHgub25jb21wbGV0ZSA9ICgpID0+IHJlc29sdmUoZGVsZXRlZENvdW50KTtcblx0XHRcdFx0dHgub25lcnJvciA9ICgpID0+IHJlamVjdCgvKiBAX19QVVJFX18gKi8gbmV3IEVycm9yKFwiRmFpbGVkIHRvIGNsZWFyIG1haWxib3hcIikpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogUmVnaXN0ZXIgYSBwZW5kaW5nIG9wZXJhdGlvblxuXHRcdCovXG5cdFx0YXN5bmMgcmVnaXN0ZXJQZW5kaW5nKG9wZXJhdGlvbikge1xuXHRcdFx0Y29uc3QgZGIgPSBhd2FpdCB0aGlzLm9wZW4oKTtcblx0XHRcdGNvbnN0IHBlbmRpbmcgPSB7XG5cdFx0XHRcdGlkOiBVVUlEdjQoKSxcblx0XHRcdFx0Y2hhbm5lbDogdGhpcy5fY2hhbm5lbE5hbWUsXG5cdFx0XHRcdHR5cGU6IG9wZXJhdGlvbi50eXBlLFxuXHRcdFx0XHRkYXRhOiBvcGVyYXRpb24uZGF0YSxcblx0XHRcdFx0bWV0YWRhdGE6IG9wZXJhdGlvbi5tZXRhZGF0YSxcblx0XHRcdFx0Y3JlYXRlZEF0OiBEYXRlLm5vdygpLFxuXHRcdFx0XHRzdGF0dXM6IFwicGVuZGluZ1wiXG5cdFx0XHR9O1xuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdFx0Y29uc3QgdHggPSBkYi50cmFuc2FjdGlvbihTVE9SRVMuUEVORElORywgXCJyZWFkd3JpdGVcIik7XG5cdFx0XHRcdHR4Lm9iamVjdFN0b3JlKFNUT1JFUy5QRU5ESU5HKS5hZGQocGVuZGluZyk7XG5cdFx0XHRcdHR4Lm9uY29tcGxldGUgPSAoKSA9PiByZXNvbHZlKHBlbmRpbmcuaWQpO1xuXHRcdFx0XHR0eC5vbmVycm9yID0gKCkgPT4gcmVqZWN0KC8qIEBfX1BVUkVfXyAqLyBuZXcgRXJyb3IoXCJGYWlsZWQgdG8gcmVnaXN0ZXIgcGVuZGluZyBvcGVyYXRpb25cIikpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogR2V0IGFsbCBwZW5kaW5nIG9wZXJhdGlvbnMgZm9yIGNoYW5uZWxcblx0XHQqL1xuXHRcdGFzeW5jIGdldFBlbmRpbmdPcGVyYXRpb25zKCkge1xuXHRcdFx0Y29uc3QgZGIgPSBhd2FpdCB0aGlzLm9wZW4oKTtcblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHRcdGNvbnN0IHJlcXVlc3QgPSBkYi50cmFuc2FjdGlvbihTVE9SRVMuUEVORElORywgXCJyZWFkb25seVwiKS5vYmplY3RTdG9yZShTVE9SRVMuUEVORElORykuaW5kZXgoXCJjaGFubmVsXCIpLmdldEFsbChJREJLZXlSYW5nZS5vbmx5KHRoaXMuX2NoYW5uZWxOYW1lKSk7XG5cdFx0XHRcdHJlcXVlc3Qub25zdWNjZXNzID0gKCkgPT4gcmVzb2x2ZShyZXF1ZXN0LnJlc3VsdCk7XG5cdFx0XHRcdHJlcXVlc3Qub25lcnJvciA9ICgpID0+IHJlamVjdCgvKiBAX19QVVJFX18gKi8gbmV3IEVycm9yKFwiRmFpbGVkIHRvIGdldCBwZW5kaW5nIG9wZXJhdGlvbnNcIikpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogQ29tcGxldGUgYSBwZW5kaW5nIG9wZXJhdGlvblxuXHRcdCovXG5cdFx0YXN5bmMgY29tcGxldGVQZW5kaW5nKG9wZXJhdGlvbklkKSB7XG5cdFx0XHRjb25zdCBkYiA9IGF3YWl0IHRoaXMub3BlbigpO1xuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdFx0Y29uc3QgdHggPSBkYi50cmFuc2FjdGlvbihTVE9SRVMuUEVORElORywgXCJyZWFkd3JpdGVcIik7XG5cdFx0XHRcdHR4Lm9iamVjdFN0b3JlKFNUT1JFUy5QRU5ESU5HKS5kZWxldGUob3BlcmF0aW9uSWQpO1xuXHRcdFx0XHR0eC5vbmNvbXBsZXRlID0gKCkgPT4gcmVzb2x2ZSgpO1xuXHRcdFx0XHR0eC5vbmVycm9yID0gKCkgPT4gcmVqZWN0KC8qIEBfX1BVUkVfXyAqLyBuZXcgRXJyb3IoXCJGYWlsZWQgdG8gY29tcGxldGUgcGVuZGluZyBvcGVyYXRpb25cIikpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogQXdhaXQgYSBwZW5kaW5nIG9wZXJhdGlvbiAocG9sbCB1bnRpbCBjb21wbGV0ZSBvciB0aW1lb3V0KVxuXHRcdCovXG5cdFx0YXN5bmMgYXdhaXRQZW5kaW5nKG9wZXJhdGlvbklkLCBvcHRpb25zID0ge30pIHtcblx0XHRcdGNvbnN0IHRpbWVvdXQgPSBvcHRpb25zLnRpbWVvdXQgPz8gM2U0O1xuXHRcdFx0Y29uc3QgcG9sbEludGVydmFsID0gb3B0aW9ucy5wb2xsSW50ZXJ2YWwgPz8gMTAwO1xuXHRcdFx0Y29uc3Qgc3RhcnRUaW1lID0gRGF0ZS5ub3coKTtcblx0XHRcdHdoaWxlIChEYXRlLm5vdygpIC0gc3RhcnRUaW1lIDwgdGltZW91dCkge1xuXHRcdFx0XHRjb25zdCBwZW5kaW5nID0gYXdhaXQgdGhpcy5fZ2V0UGVuZGluZ0J5SWQob3BlcmF0aW9uSWQpO1xuXHRcdFx0XHRpZiAoIXBlbmRpbmcpIHJldHVybiBudWxsO1xuXHRcdFx0XHRpZiAocGVuZGluZy5zdGF0dXMgPT09IFwiY29tcGxldGVkXCIpIHtcblx0XHRcdFx0XHRhd2FpdCB0aGlzLmNvbXBsZXRlUGVuZGluZyhvcGVyYXRpb25JZCk7XG5cdFx0XHRcdFx0cmV0dXJuIHBlbmRpbmcucmVzdWx0O1xuXHRcdFx0XHR9XG5cdFx0XHRcdGF3YWl0IG5ldyBQcm9taXNlKChyKSA9PiBzZXRUaW1lb3V0KHIsIHBvbGxJbnRlcnZhbCkpO1xuXHRcdFx0fVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBQZW5kaW5nIG9wZXJhdGlvbiAke29wZXJhdGlvbklkfSB0aW1lZCBvdXRgKTtcblx0XHR9XG5cdFx0YXN5bmMgX2dldFBlbmRpbmdCeUlkKGlkKSB7XG5cdFx0XHRjb25zdCBkYiA9IGF3YWl0IHRoaXMub3BlbigpO1xuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdFx0Y29uc3QgcmVxdWVzdCA9IGRiLnRyYW5zYWN0aW9uKFNUT1JFUy5QRU5ESU5HLCBcInJlYWRvbmx5XCIpLm9iamVjdFN0b3JlKFNUT1JFUy5QRU5ESU5HKS5nZXQoaWQpO1xuXHRcdFx0XHRyZXF1ZXN0Lm9uc3VjY2VzcyA9ICgpID0+IHJlc29sdmUocmVxdWVzdC5yZXN1bHQgPz8gbnVsbCk7XG5cdFx0XHRcdHJlcXVlc3Qub25lcnJvciA9ICgpID0+IHJlamVjdCgvKiBAX19QVVJFX18gKi8gbmV3IEVycm9yKFwiRmFpbGVkIHRvIGdldCBwZW5kaW5nIG9wZXJhdGlvblwiKSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBQdXQgZGF0YSBpbiBleGNoYW5nZSAoc2hhcmVkIHN0b3JhZ2UpXG5cdFx0Ki9cblx0XHRhc3luYyBleGNoYW5nZVB1dChrZXksIHZhbHVlLCBvcHRpb25zID0ge30pIHtcblx0XHRcdGNvbnN0IGRiID0gYXdhaXQgdGhpcy5vcGVuKCk7XG5cdFx0XHRjb25zdCByZWNvcmQgPSB7XG5cdFx0XHRcdGlkOiBVVUlEdjQoKSxcblx0XHRcdFx0a2V5LFxuXHRcdFx0XHR2YWx1ZSxcblx0XHRcdFx0b3duZXI6IHRoaXMuX2NoYW5uZWxOYW1lLFxuXHRcdFx0XHRzaGFyZWRXaXRoOiBvcHRpb25zLnNoYXJlZFdpdGggPz8gW1wiKlwiXSxcblx0XHRcdFx0dmVyc2lvbjogMSxcblx0XHRcdFx0Y3JlYXRlZEF0OiBEYXRlLm5vdygpLFxuXHRcdFx0XHR1cGRhdGVkQXQ6IERhdGUubm93KClcblx0XHRcdH07XG5cdFx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0XHRjb25zdCB0eCA9IGRiLnRyYW5zYWN0aW9uKFNUT1JFUy5FWENIQU5HRSwgXCJyZWFkd3JpdGVcIik7XG5cdFx0XHRcdGNvbnN0IHN0b3JlID0gdHgub2JqZWN0U3RvcmUoU1RPUkVTLkVYQ0hBTkdFKTtcblx0XHRcdFx0Y29uc3QgZ2V0UmVxdWVzdCA9IHN0b3JlLmluZGV4KFwia2V5XCIpLmdldChrZXkpO1xuXHRcdFx0XHRnZXRSZXF1ZXN0Lm9uc3VjY2VzcyA9ICgpID0+IHtcblx0XHRcdFx0XHRjb25zdCBleGlzdGluZyA9IGdldFJlcXVlc3QucmVzdWx0O1xuXHRcdFx0XHRcdGlmIChleGlzdGluZykge1xuXHRcdFx0XHRcdFx0cmVjb3JkLmlkID0gZXhpc3RpbmcuaWQ7XG5cdFx0XHRcdFx0XHRyZWNvcmQudmVyc2lvbiA9IGV4aXN0aW5nLnZlcnNpb24gKyAxO1xuXHRcdFx0XHRcdFx0cmVjb3JkLmNyZWF0ZWRBdCA9IGV4aXN0aW5nLmNyZWF0ZWRBdDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0c3RvcmUucHV0KHJlY29yZCk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHR4Lm9uY29tcGxldGUgPSAoKSA9PiB7XG5cdFx0XHRcdFx0dGhpcy5fZXhjaGFuZ2VVcGRhdGVzLm5leHQocmVjb3JkKTtcblx0XHRcdFx0XHRyZXNvbHZlKHJlY29yZC5pZCk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHR4Lm9uZXJyb3IgPSAoKSA9PiByZWplY3QoLyogQF9fUFVSRV9fICovIG5ldyBFcnJvcihcIkZhaWxlZCB0byBwdXQgZXhjaGFuZ2UgZGF0YVwiKSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBHZXQgZGF0YSBmcm9tIGV4Y2hhbmdlXG5cdFx0Ki9cblx0XHRhc3luYyBleGNoYW5nZUdldChrZXkpIHtcblx0XHRcdGNvbnN0IGRiID0gYXdhaXQgdGhpcy5vcGVuKCk7XG5cdFx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0XHRjb25zdCByZXF1ZXN0ID0gZGIudHJhbnNhY3Rpb24oU1RPUkVTLkVYQ0hBTkdFLCBcInJlYWRvbmx5XCIpLm9iamVjdFN0b3JlKFNUT1JFUy5FWENIQU5HRSkuaW5kZXgoXCJrZXlcIikuZ2V0KGtleSk7XG5cdFx0XHRcdHJlcXVlc3Qub25zdWNjZXNzID0gKCkgPT4ge1xuXHRcdFx0XHRcdGNvbnN0IHJlY29yZCA9IHJlcXVlc3QucmVzdWx0O1xuXHRcdFx0XHRcdGlmICghcmVjb3JkKSB7XG5cdFx0XHRcdFx0XHRyZXNvbHZlKG51bGwpO1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoIXRoaXMuX2NhbkFjY2Vzc0V4Y2hhbmdlKHJlY29yZCkpIHtcblx0XHRcdFx0XHRcdHJlc29sdmUobnVsbCk7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJlc29sdmUocmVjb3JkLnZhbHVlKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0cmVxdWVzdC5vbmVycm9yID0gKCkgPT4gcmVqZWN0KC8qIEBfX1BVUkVfXyAqLyBuZXcgRXJyb3IoXCJGYWlsZWQgdG8gZ2V0IGV4Y2hhbmdlIGRhdGFcIikpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogRGVsZXRlIGRhdGEgZnJvbSBleGNoYW5nZVxuXHRcdCovXG5cdFx0YXN5bmMgZXhjaGFuZ2VEZWxldGUoa2V5KSB7XG5cdFx0XHRjb25zdCBkYiA9IGF3YWl0IHRoaXMub3BlbigpO1xuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdFx0Y29uc3QgdHggPSBkYi50cmFuc2FjdGlvbihTVE9SRVMuRVhDSEFOR0UsIFwicmVhZHdyaXRlXCIpO1xuXHRcdFx0XHRjb25zdCBzdG9yZSA9IHR4Lm9iamVjdFN0b3JlKFNUT1JFUy5FWENIQU5HRSk7XG5cdFx0XHRcdGNvbnN0IGdldFJlcXVlc3QgPSBzdG9yZS5pbmRleChcImtleVwiKS5nZXQoa2V5KTtcblx0XHRcdFx0Z2V0UmVxdWVzdC5vbnN1Y2Nlc3MgPSAoKSA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgcmVjb3JkID0gZ2V0UmVxdWVzdC5yZXN1bHQ7XG5cdFx0XHRcdFx0aWYgKCFyZWNvcmQpIHtcblx0XHRcdFx0XHRcdHJlc29sdmUoZmFsc2UpO1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAocmVjb3JkLm93bmVyICE9PSB0aGlzLl9jaGFubmVsTmFtZSkge1xuXHRcdFx0XHRcdFx0cmVzb2x2ZShmYWxzZSk7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHN0b3JlLmRlbGV0ZShyZWNvcmQuaWQpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR0eC5vbmNvbXBsZXRlID0gKCkgPT4gcmVzb2x2ZSh0cnVlKTtcblx0XHRcdFx0dHgub25lcnJvciA9ICgpID0+IHJlamVjdCgvKiBAX19QVVJFX18gKi8gbmV3IEVycm9yKFwiRmFpbGVkIHRvIGRlbGV0ZSBleGNoYW5nZSBkYXRhXCIpKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIEFjcXVpcmUgbG9jayBvbiBleGNoYW5nZSBrZXlcblx0XHQqL1xuXHRcdGFzeW5jIGV4Y2hhbmdlTG9jayhrZXksIG9wdGlvbnMgPSB7fSkge1xuXHRcdFx0Y29uc3QgZGIgPSBhd2FpdCB0aGlzLm9wZW4oKTtcblx0XHRcdGNvbnN0IHRpbWVvdXQgPSBvcHRpb25zLnRpbWVvdXQgPz8gM2U0O1xuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdFx0Y29uc3QgdHggPSBkYi50cmFuc2FjdGlvbihTVE9SRVMuRVhDSEFOR0UsIFwicmVhZHdyaXRlXCIpO1xuXHRcdFx0XHRjb25zdCBzdG9yZSA9IHR4Lm9iamVjdFN0b3JlKFNUT1JFUy5FWENIQU5HRSk7XG5cdFx0XHRcdGNvbnN0IHJlcXVlc3QgPSBzdG9yZS5pbmRleChcImtleVwiKS5nZXQoa2V5KTtcblx0XHRcdFx0cmVxdWVzdC5vbnN1Y2Nlc3MgPSAoKSA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgcmVjb3JkID0gcmVxdWVzdC5yZXN1bHQ7XG5cdFx0XHRcdFx0aWYgKCFyZWNvcmQpIHtcblx0XHRcdFx0XHRcdHJlc29sdmUoZmFsc2UpO1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAocmVjb3JkLmxvY2sgJiYgcmVjb3JkLmxvY2suaG9sZGVyICE9PSB0aGlzLl9jaGFubmVsTmFtZSkge1xuXHRcdFx0XHRcdFx0aWYgKHJlY29yZC5sb2NrLmV4cGlyZXNBdCA+IERhdGUubm93KCkpIHtcblx0XHRcdFx0XHRcdFx0cmVzb2x2ZShmYWxzZSk7XG5cdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmVjb3JkLmxvY2sgPSB7XG5cdFx0XHRcdFx0XHRob2xkZXI6IHRoaXMuX2NoYW5uZWxOYW1lLFxuXHRcdFx0XHRcdFx0YWNxdWlyZWRBdDogRGF0ZS5ub3coKSxcblx0XHRcdFx0XHRcdGV4cGlyZXNBdDogRGF0ZS5ub3coKSArIHRpbWVvdXRcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdHJlY29yZC51cGRhdGVkQXQgPSBEYXRlLm5vdygpO1xuXHRcdFx0XHRcdHN0b3JlLnB1dChyZWNvcmQpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR0eC5vbmNvbXBsZXRlID0gKCkgPT4gcmVzb2x2ZSh0cnVlKTtcblx0XHRcdFx0dHgub25lcnJvciA9ICgpID0+IHJlamVjdCgvKiBAX19QVVJFX18gKi8gbmV3IEVycm9yKFwiRmFpbGVkIHRvIGFjcXVpcmUgbG9ja1wiKSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBSZWxlYXNlIGxvY2sgb24gZXhjaGFuZ2Uga2V5XG5cdFx0Ki9cblx0XHRhc3luYyBleGNoYW5nZVVubG9jayhrZXkpIHtcblx0XHRcdGNvbnN0IGRiID0gYXdhaXQgdGhpcy5vcGVuKCk7XG5cdFx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0XHRjb25zdCB0eCA9IGRiLnRyYW5zYWN0aW9uKFNUT1JFUy5FWENIQU5HRSwgXCJyZWFkd3JpdGVcIik7XG5cdFx0XHRcdGNvbnN0IHN0b3JlID0gdHgub2JqZWN0U3RvcmUoU1RPUkVTLkVYQ0hBTkdFKTtcblx0XHRcdFx0Y29uc3QgcmVxdWVzdCA9IHN0b3JlLmluZGV4KFwia2V5XCIpLmdldChrZXkpO1xuXHRcdFx0XHRyZXF1ZXN0Lm9uc3VjY2VzcyA9ICgpID0+IHtcblx0XHRcdFx0XHRjb25zdCByZWNvcmQgPSByZXF1ZXN0LnJlc3VsdDtcblx0XHRcdFx0XHRpZiAocmVjb3JkICYmIHJlY29yZC5sb2NrPy5ob2xkZXIgPT09IHRoaXMuX2NoYW5uZWxOYW1lKSB7XG5cdFx0XHRcdFx0XHRkZWxldGUgcmVjb3JkLmxvY2s7XG5cdFx0XHRcdFx0XHRyZWNvcmQudXBkYXRlZEF0ID0gRGF0ZS5ub3coKTtcblx0XHRcdFx0XHRcdHN0b3JlLnB1dChyZWNvcmQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblx0XHRcdFx0dHgub25jb21wbGV0ZSA9ICgpID0+IHJlc29sdmUoKTtcblx0XHRcdFx0dHgub25lcnJvciA9ICgpID0+IHJlamVjdCgvKiBAX19QVVJFX18gKi8gbmV3IEVycm9yKFwiRmFpbGVkIHRvIHJlbGVhc2UgbG9ja1wiKSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0X2NhbkFjY2Vzc0V4Y2hhbmdlKHJlY29yZCkge1xuXHRcdFx0aWYgKHJlY29yZC5vd25lciA9PT0gdGhpcy5fY2hhbm5lbE5hbWUpIHJldHVybiB0cnVlO1xuXHRcdFx0aWYgKHJlY29yZC5zaGFyZWRXaXRoLmluY2x1ZGVzKFwiKlwiKSkgcmV0dXJuIHRydWU7XG5cdFx0XHRyZXR1cm4gcmVjb3JkLnNoYXJlZFdpdGguaW5jbHVkZXModGhpcy5fY2hhbm5lbE5hbWUpO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIEJlZ2luIGEgdHJhbnNhY3Rpb24gZm9yIGJhdGNoIG9wZXJhdGlvbnNcblx0XHQqL1xuXHRcdGFzeW5jIGJlZ2luVHJhbnNhY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gbmV3IENoYW5uZWxUcmFuc2FjdGlvbih0aGlzKTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBFeGVjdXRlIG9wZXJhdGlvbnMgaW4gdHJhbnNhY3Rpb25cblx0XHQqL1xuXHRcdGFzeW5jIGV4ZWN1dGVUcmFuc2FjdGlvbihvcGVyYXRpb25zKSB7XG5cdFx0XHRjb25zdCBkYiA9IGF3YWl0IHRoaXMub3BlbigpO1xuXHRcdFx0Y29uc3Qgc3RvcmVOYW1lcyA9IG5ldyBTZXQob3BlcmF0aW9ucy5tYXAoKG9wKSA9PiBvcC5zdG9yZSkpO1xuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdFx0Y29uc3QgdHggPSBkYi50cmFuc2FjdGlvbihBcnJheS5mcm9tKHN0b3JlTmFtZXMpLCBcInJlYWR3cml0ZVwiKTtcblx0XHRcdFx0Zm9yIChjb25zdCBvcCBvZiBvcGVyYXRpb25zKSB7XG5cdFx0XHRcdFx0Y29uc3Qgc3RvcmUgPSB0eC5vYmplY3RTdG9yZShvcC5zdG9yZSk7XG5cdFx0XHRcdFx0c3dpdGNoIChvcC50eXBlKSB7XG5cdFx0XHRcdFx0XHRjYXNlIFwicHV0XCI6XG5cdFx0XHRcdFx0XHRcdGlmIChvcC52YWx1ZSAhPT0gdm9pZCAwKSBzdG9yZS5wdXQob3AudmFsdWUpO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgXCJkZWxldGVcIjpcblx0XHRcdFx0XHRcdFx0aWYgKG9wLmtleSAhPT0gdm9pZCAwKSBzdG9yZS5kZWxldGUob3Aua2V5KTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlIFwidXBkYXRlXCI6IGlmIChvcC5rZXkgIT09IHZvaWQgMCkge1xuXHRcdFx0XHRcdFx0XHRjb25zdCBnZXRSZXEgPSBzdG9yZS5nZXQob3Aua2V5KTtcblx0XHRcdFx0XHRcdFx0Z2V0UmVxLm9uc3VjY2VzcyA9ICgpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRpZiAoZ2V0UmVxLnJlc3VsdCAmJiBvcC52YWx1ZSkgc3RvcmUucHV0KHtcblx0XHRcdFx0XHRcdFx0XHRcdC4uLmdldFJlcS5yZXN1bHQsXG5cdFx0XHRcdFx0XHRcdFx0XHQuLi5vcC52YWx1ZVxuXHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHR0eC5vbmNvbXBsZXRlID0gKCkgPT4gcmVzb2x2ZSgpO1xuXHRcdFx0XHR0eC5vbmVycm9yID0gKCkgPT4gcmVqZWN0KC8qIEBfX1BVUkVfXyAqLyBuZXcgRXJyb3IoXCJUcmFuc2FjdGlvbiBmYWlsZWRcIikpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogU3Vic2NyaWJlIHRvIG1lc3NhZ2UgdXBkYXRlc1xuXHRcdCovXG5cdFx0b25NZXNzYWdlVXBkYXRlKGhhbmRsZXIpIHtcblx0XHRcdHJldHVybiB0aGlzLl9tZXNzYWdlVXBkYXRlcy5zdWJzY3JpYmUoeyBuZXh0OiBoYW5kbGVyIH0pO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIFN1YnNjcmliZSB0byBleGNoYW5nZSB1cGRhdGVzXG5cdFx0Ki9cblx0XHRvbkV4Y2hhbmdlVXBkYXRlKGhhbmRsZXIpIHtcblx0XHRcdHJldHVybiB0aGlzLl9leGNoYW5nZVVwZGF0ZXMuc3Vic2NyaWJlKHsgbmV4dDogaGFuZGxlciB9KTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBDbGVhbiB1cCBleHBpcmVkIG1lc3NhZ2VzXG5cdFx0Ki9cblx0XHRhc3luYyBjbGVhbnVwRXhwaXJlZCgpIHtcblx0XHRcdGNvbnN0IGRiID0gYXdhaXQgdGhpcy5vcGVuKCk7XG5cdFx0XHRjb25zdCBub3cgPSBEYXRlLm5vdygpO1xuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdFx0Y29uc3QgdHggPSBkYi50cmFuc2FjdGlvbihbU1RPUkVTLk1FU1NBR0VTLCBTVE9SRVMuTUFJTEJPWF0sIFwicmVhZHdyaXRlXCIpO1xuXHRcdFx0XHRjb25zdCBtZXNzYWdlc1N0b3JlID0gdHgub2JqZWN0U3RvcmUoU1RPUkVTLk1FU1NBR0VTKTtcblx0XHRcdFx0Y29uc3QgbWFpbGJveFN0b3JlID0gdHgub2JqZWN0U3RvcmUoU1RPUkVTLk1BSUxCT1gpO1xuXHRcdFx0XHRsZXQgZGVsZXRlZENvdW50ID0gMDtcblx0XHRcdFx0Y29uc3QgbXNnUmVxdWVzdCA9IG1lc3NhZ2VzU3RvcmUub3BlbkN1cnNvcigpO1xuXHRcdFx0XHRtc2dSZXF1ZXN0Lm9uc3VjY2VzcyA9ICgpID0+IHtcblx0XHRcdFx0XHRjb25zdCBjdXJzb3IgPSBtc2dSZXF1ZXN0LnJlc3VsdDtcblx0XHRcdFx0XHRpZiAoY3Vyc29yKSB7XG5cdFx0XHRcdFx0XHRjb25zdCBtc2cgPSBjdXJzb3IudmFsdWU7XG5cdFx0XHRcdFx0XHRpZiAobXNnLmV4cGlyZXNBdCAmJiBtc2cuZXhwaXJlc0F0IDwgbm93KSB7XG5cdFx0XHRcdFx0XHRcdGN1cnNvci5kZWxldGUoKTtcblx0XHRcdFx0XHRcdFx0ZGVsZXRlZENvdW50Kys7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRjdXJzb3IuY29udGludWUoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cdFx0XHRcdGNvbnN0IG1haWxSZXF1ZXN0ID0gbWFpbGJveFN0b3JlLm9wZW5DdXJzb3IoKTtcblx0XHRcdFx0bWFpbFJlcXVlc3Qub25zdWNjZXNzID0gKCkgPT4ge1xuXHRcdFx0XHRcdGNvbnN0IGN1cnNvciA9IG1haWxSZXF1ZXN0LnJlc3VsdDtcblx0XHRcdFx0XHRpZiAoY3Vyc29yKSB7XG5cdFx0XHRcdFx0XHRjb25zdCBtc2cgPSBjdXJzb3IudmFsdWU7XG5cdFx0XHRcdFx0XHRpZiAobXNnLmV4cGlyZXNBdCAmJiBtc2cuZXhwaXJlc0F0IDwgbm93KSB7XG5cdFx0XHRcdFx0XHRcdGN1cnNvci5kZWxldGUoKTtcblx0XHRcdFx0XHRcdFx0ZGVsZXRlZENvdW50Kys7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRjdXJzb3IuY29udGludWUoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cdFx0XHRcdHR4Lm9uY29tcGxldGUgPSAoKSA9PiByZXNvbHZlKGRlbGV0ZWRDb3VudCk7XG5cdFx0XHRcdHR4Lm9uZXJyb3IgPSAoKSA9PiByZWplY3QoLyogQF9fUFVSRV9fICovIG5ldyBFcnJvcihcIkZhaWxlZCB0byBjbGVhbnVwIGV4cGlyZWRcIikpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9O1xuXHQvKipcblx0KiBIZWxwZXIgY2xhc3MgZm9yIGJhdGNoIG9wZXJhdGlvbnMgd2l0aCByb2xsYmFjayBzdXBwb3J0XG5cdCovXG5cdHZhciBDaGFubmVsVHJhbnNhY3Rpb24gPSBjbGFzcyB7XG5cdFx0X3N0b3JhZ2U7XG5cdFx0X29wZXJhdGlvbnMgPSBbXTtcblx0XHRfaXNDb21taXR0ZWQgPSBmYWxzZTtcblx0XHRfaXNSb2xsZWRCYWNrID0gZmFsc2U7XG5cdFx0Y29uc3RydWN0b3IoX3N0b3JhZ2UpIHtcblx0XHRcdHRoaXMuX3N0b3JhZ2UgPSBfc3RvcmFnZTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBBZGQgcHV0IG9wZXJhdGlvblxuXHRcdCovXG5cdFx0cHV0KHN0b3JlLCB2YWx1ZSkge1xuXHRcdFx0dGhpcy5fY2hlY2tTdGF0ZSgpO1xuXHRcdFx0dGhpcy5fb3BlcmF0aW9ucy5wdXNoKHtcblx0XHRcdFx0aWQ6IFVVSUR2NCgpLFxuXHRcdFx0XHR0eXBlOiBcInB1dFwiLFxuXHRcdFx0XHRzdG9yZSxcblx0XHRcdFx0dmFsdWUsXG5cdFx0XHRcdHRpbWVzdGFtcDogRGF0ZS5ub3coKVxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBBZGQgZGVsZXRlIG9wZXJhdGlvblxuXHRcdCovXG5cdFx0ZGVsZXRlKHN0b3JlLCBrZXkpIHtcblx0XHRcdHRoaXMuX2NoZWNrU3RhdGUoKTtcblx0XHRcdHRoaXMuX29wZXJhdGlvbnMucHVzaCh7XG5cdFx0XHRcdGlkOiBVVUlEdjQoKSxcblx0XHRcdFx0dHlwZTogXCJkZWxldGVcIixcblx0XHRcdFx0c3RvcmUsXG5cdFx0XHRcdGtleSxcblx0XHRcdFx0dGltZXN0YW1wOiBEYXRlLm5vdygpXG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIEFkZCB1cGRhdGUgb3BlcmF0aW9uXG5cdFx0Ki9cblx0XHR1cGRhdGUoc3RvcmUsIGtleSwgdXBkYXRlcykge1xuXHRcdFx0dGhpcy5fY2hlY2tTdGF0ZSgpO1xuXHRcdFx0dGhpcy5fb3BlcmF0aW9ucy5wdXNoKHtcblx0XHRcdFx0aWQ6IFVVSUR2NCgpLFxuXHRcdFx0XHR0eXBlOiBcInVwZGF0ZVwiLFxuXHRcdFx0XHRzdG9yZSxcblx0XHRcdFx0a2V5LFxuXHRcdFx0XHR2YWx1ZTogdXBkYXRlcyxcblx0XHRcdFx0dGltZXN0YW1wOiBEYXRlLm5vdygpXG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIENvbW1pdCB0cmFuc2FjdGlvblxuXHRcdCovXG5cdFx0YXN5bmMgY29tbWl0KCkge1xuXHRcdFx0dGhpcy5fY2hlY2tTdGF0ZSgpO1xuXHRcdFx0aWYgKHRoaXMuX29wZXJhdGlvbnMubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdHRoaXMuX2lzQ29tbWl0dGVkID0gdHJ1ZTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0YXdhaXQgdGhpcy5fc3RvcmFnZS5leGVjdXRlVHJhbnNhY3Rpb24odGhpcy5fb3BlcmF0aW9ucyk7XG5cdFx0XHR0aGlzLl9pc0NvbW1pdHRlZCA9IHRydWU7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogUm9sbGJhY2sgdHJhbnNhY3Rpb24gKGp1c3QgY2xlYXIgb3BlcmF0aW9ucywgZG9uJ3QgZXhlY3V0ZSlcblx0XHQqL1xuXHRcdHJvbGxiYWNrKCkge1xuXHRcdFx0dGhpcy5fb3BlcmF0aW9ucyA9IFtdO1xuXHRcdFx0dGhpcy5faXNSb2xsZWRCYWNrID0gdHJ1ZTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBHZXQgb3BlcmF0aW9uIGNvdW50XG5cdFx0Ki9cblx0XHRnZXQgb3BlcmF0aW9uQ291bnQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fb3BlcmF0aW9ucy5sZW5ndGg7XG5cdFx0fVxuXHRcdF9jaGVja1N0YXRlKCkge1xuXHRcdFx0aWYgKHRoaXMuX2lzQ29tbWl0dGVkKSB0aHJvdyBuZXcgRXJyb3IoXCJUcmFuc2FjdGlvbiBhbHJlYWR5IGNvbW1pdHRlZFwiKTtcblx0XHRcdGlmICh0aGlzLl9pc1JvbGxlZEJhY2spIHRocm93IG5ldyBFcnJvcihcIlRyYW5zYWN0aW9uIGFscmVhZHkgcm9sbGVkIGJhY2tcIik7XG5cdFx0fVxuXHR9O1xuXHRjb25zdCBfc3RvcmFnZUluc3RhbmNlcyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG5cdC8qKlxuXHQqIEdldCBzdG9yYWdlIGluc3RhbmNlIGZvciBjaGFubmVsXG5cdCovXG5cdGZ1bmN0aW9uIGdldENoYW5uZWxTdG9yYWdlKGNoYW5uZWxOYW1lKSB7XG5cdFx0aWYgKCFfc3RvcmFnZUluc3RhbmNlcy5oYXMoY2hhbm5lbE5hbWUpKSBfc3RvcmFnZUluc3RhbmNlcy5zZXQoY2hhbm5lbE5hbWUsIG5ldyBDaGFubmVsU3RvcmFnZShjaGFubmVsTmFtZSkpO1xuXHRcdHJldHVybiBfc3RvcmFnZUluc3RhbmNlcy5nZXQoY2hhbm5lbE5hbWUpO1xuXHR9XG5cbi8vI2VuZHJlZ2lvblxuLy8jcmVnaW9uIC4uL3VuaWZvcm0udHMvc3JjL25ld2VyL25leHQvY2hhbm5lbC9DaGFubmVsQ29udGV4dC50c1xuLyoqXG5cdCogQ2hhbm5lbCBDb250ZXh0IC0gTXVsdGktQ2hhbm5lbCBTdXBwb3J0XG5cdCpcblx0KiBQcm92aWRlcyBhIHdheSB0byBjcmVhdGUgbXVsdGlwbGUgaW5kZXBlbmRlbnQgY2hhbm5lbCBlbmRwb2ludHMvcG9ydHNcblx0KiBpbiB0aGUgc2FtZSBjb250ZXh0LiBTdWl0YWJsZSBmb3I6XG5cdCogLSBMYXp5LWxvYWRlZCBjb21wb25lbnRzXG5cdCogLSBNdWx0aXBsZSBET00gY29tcG9uZW50cyB3aXRoIGlzb2xhdGVkIGNvbW11bmljYXRpb25cblx0KiAtIE1pY3JvLWZyb250ZW5kIGFyY2hpdGVjdHVyZXNcblx0KiAtIENvbXBvbmVudC1sZXZlbCBjaGFubmVsIGlzb2xhdGlvblxuXHQqXG5cdCogdk5leHQgYXJjaGl0ZWN0dXJlIG5vdGU6XG5cdCogLSBDaGFubmVsQ29udGV4dCBjb21wb3NlcyBVbmlmaWVkQ2hhbm5lbCBpbnN0YW5jZXMgcGVyIGVuZHBvaW50LlxuXHQqIC0gVW5pZmllZENoYW5uZWwgaXMgdGhlIGNhbm9uaWNhbCB0cmFuc3BvcnQvaW52b2NhdGlvbiBydW50aW1lIGVuZ2luZS5cblx0Ki9cblx0Y29uc3Qgd29ya2VyQmFzZSA9IGdldFdvcmtlclJlc29sdmVCYXNlVXJsKCk7XG5cdGNvbnN0IHdvcmtlckNvZGUgPSB3b3JrZXJCYXNlLmxlbmd0aCA+IDAgPyBuZXcgVVJMKFwiLi4vdHJhbnNwb3J0L1dvcmtlci50c1wiLCB3b3JrZXJCYXNlKSA6IFwiXCI7XG5cdHZhciBSZW1vdGVDaGFubmVsSGVscGVyID0gY2xhc3Mge1xuXHRcdF9jaGFubmVsO1xuXHRcdF9jb250ZXh0O1xuXHRcdF9vcHRpb25zO1xuXHRcdF9jb25uZWN0aW9uO1xuXHRcdF9zdG9yYWdlO1xuXHRcdGNvbnN0cnVjdG9yKF9jaGFubmVsLCBfY29udGV4dCwgX29wdGlvbnMgPSB7fSkge1xuXHRcdFx0dGhpcy5fY2hhbm5lbCA9IF9jaGFubmVsO1xuXHRcdFx0dGhpcy5fY29udGV4dCA9IF9jb250ZXh0O1xuXHRcdFx0dGhpcy5fb3B0aW9ucyA9IF9vcHRpb25zO1xuXHRcdFx0dGhpcy5fY29ubmVjdGlvbiA9IGdldENvbm5lY3Rpb24oX2NoYW5uZWwpO1xuXHRcdFx0dGhpcy5fc3RvcmFnZSA9IGdldENoYW5uZWxTdG9yYWdlKF9jaGFubmVsKTtcblx0XHR9XG5cdFx0YXN5bmMgcmVxdWVzdChwYXRoLCBhY3Rpb24sIGFyZ3MsIG9wdGlvbnMgPSB7fSkge1xuXHRcdFx0bGV0IG5vcm1hbGl6ZWRQYXRoID0gdHlwZW9mIHBhdGggPT09IFwic3RyaW5nXCIgPyBbcGF0aF0gOiBwYXRoO1xuXHRcdFx0bGV0IG5vcm1hbGl6ZWRBY3Rpb24gPSBhY3Rpb247XG5cdFx0XHRsZXQgbm9ybWFsaXplZEFyZ3MgPSBhcmdzO1xuXHRcdFx0aWYgKEFycmF5LmlzQXJyYXkoYWN0aW9uKSAmJiBpc1JlZmxlY3RBY3Rpb24ocGF0aCkpIHtcblx0XHRcdFx0b3B0aW9ucyA9IGFyZ3M7XG5cdFx0XHRcdG5vcm1hbGl6ZWRBcmdzID0gYWN0aW9uO1xuXHRcdFx0XHRub3JtYWxpemVkQWN0aW9uID0gcGF0aDtcblx0XHRcdFx0bm9ybWFsaXplZFBhdGggPSBbXTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzLl9jb250ZXh0LmdldEhvc3QoKT8ucmVxdWVzdChub3JtYWxpemVkUGF0aCwgbm9ybWFsaXplZEFjdGlvbiwgbm9ybWFsaXplZEFyZ3MsIG9wdGlvbnMsIHRoaXMuX2NoYW5uZWwpO1xuXHRcdH1cblx0XHRhc3luYyBkb0ltcG9ydE1vZHVsZSh1cmwsIG9wdGlvbnMgPSB7fSkge1xuXHRcdFx0cmV0dXJuIHRoaXMucmVxdWVzdChbXSwgV1JlZmxlY3RBY3Rpb24uSU1QT1JULCBbdXJsXSwgb3B0aW9ucyk7XG5cdFx0fVxuXHRcdGFzeW5jIGRlZmVyTWVzc2FnZShwYXlsb2FkLCBvcHRpb25zID0ge30pIHtcblx0XHRcdHJldHVybiB0aGlzLl9zdG9yYWdlLmRlZmVyKHtcblx0XHRcdFx0Y2hhbm5lbDogdGhpcy5fY2hhbm5lbCxcblx0XHRcdFx0c2VuZGVyOiB0aGlzLl9jb250ZXh0Lmhvc3ROYW1lLFxuXHRcdFx0XHR0eXBlOiBcInJlcXVlc3RcIixcblx0XHRcdFx0cGF5bG9hZFxuXHRcdFx0fSwgb3B0aW9ucyk7XG5cdFx0fVxuXHRcdGFzeW5jIGdldFBlbmRpbmdNZXNzYWdlcygpIHtcblx0XHRcdHJldHVybiB0aGlzLl9zdG9yYWdlLmdldERlZmVycmVkTWVzc2FnZXModGhpcy5fY2hhbm5lbCwgeyBzdGF0dXM6IFwicGVuZGluZ1wiIH0pO1xuXHRcdH1cblx0XHRnZXQgY29ubmVjdGlvbigpIHtcblx0XHRcdHJldHVybiB0aGlzLl9jb25uZWN0aW9uO1xuXHRcdH1cblx0XHRnZXQgY2hhbm5lbE5hbWUoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY2hhbm5lbDtcblx0XHR9XG5cdFx0Z2V0IGNvbnRleHQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY29udGV4dDtcblx0XHR9XG5cdH07XG5cdHZhciBDaGFubmVsSGFuZGxlciA9IGNsYXNzIHtcblx0XHRfY2hhbm5lbDtcblx0XHRfY29udGV4dDtcblx0XHRfb3B0aW9ucztcblx0XHRfY29ubmVjdGlvbjtcblx0XHRfdW5pZmllZDtcblx0XHRnZXQgX2ZvclJlc29sdmVzKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX3VuaWZpZWQuX19nZXRQcml2YXRlKFwiX3BlbmRpbmdcIik7XG5cdFx0fVxuXHRcdGdldCBfc3Vic2NyaXB0aW9ucygpIHtcblx0XHRcdHJldHVybiB0aGlzLl91bmlmaWVkLl9fZ2V0UHJpdmF0ZShcIl9zdWJzY3JpcHRpb25zXCIpO1xuXHRcdH1cblx0XHRnZXQgX2Jyb2FkY2FzdHMoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fdW5pZmllZC5fX2dldFByaXZhdGUoXCJfdHJhbnNwb3J0c1wiKTtcblx0XHR9XG5cdFx0Y29uc3RydWN0b3IoX2NoYW5uZWwsIF9jb250ZXh0LCBfb3B0aW9ucyA9IHt9KSB7XG5cdFx0XHR0aGlzLl9jaGFubmVsID0gX2NoYW5uZWw7XG5cdFx0XHR0aGlzLl9jb250ZXh0ID0gX2NvbnRleHQ7XG5cdFx0XHR0aGlzLl9vcHRpb25zID0gX29wdGlvbnM7XG5cdFx0XHR0aGlzLl9jb25uZWN0aW9uID0gZ2V0Q29ubmVjdGlvblBvb2woKS5nZXRPckNyZWF0ZShfY2hhbm5lbCwgXCJpbnRlcm5hbFwiLCBfb3B0aW9ucyk7XG5cdFx0XHR0aGlzLl91bmlmaWVkID0gbmV3IFVuaWZpZWRDaGFubmVsKHtcblx0XHRcdFx0bmFtZTogX2NoYW5uZWwsXG5cdFx0XHRcdGF1dG9MaXN0ZW46IGZhbHNlLFxuXHRcdFx0XHR0aW1lb3V0OiBfb3B0aW9ucz8udGltZW91dFxuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdGNyZWF0ZVJlbW90ZUNoYW5uZWwoY2hhbm5lbCwgb3B0aW9ucyA9IHt9LCBicm9hZGNhc3QpIHtcblx0XHRcdGNvbnN0IHRyYW5zcG9ydCA9IG5vcm1hbGl6ZVRyYW5zcG9ydEJpbmRpbmcoYnJvYWRjYXN0ID8/IHRoaXMuX2NvbnRleHQuJGNyZWF0ZU9yVXNlRXhpc3RpbmdSZW1vdGUoY2hhbm5lbCwgb3B0aW9ucywgYnJvYWRjYXN0ID8/IG51bGwpPy5tZXNzYWdlQ2hhbm5lbD8ucG9ydDEpO1xuXHRcdFx0Y29uc3QgdHJhbnNwb3J0VHlwZSA9IGdldER5bmFtaWNUcmFuc3BvcnRUeXBlKHRyYW5zcG9ydD8udGFyZ2V0ID8/IHRyYW5zcG9ydCk7XG5cdFx0XHR0aGlzLl91bmlmaWVkLmxpc3Rlbih0cmFuc3BvcnQ/LnRhcmdldCwgeyB0YXJnZXRDaGFubmVsOiBjaGFubmVsIH0pO1xuXHRcdFx0aWYgKHRyYW5zcG9ydCkge1xuXHRcdFx0XHR0aGlzLl9icm9hZGNhc3RzPy5zZXQ/LihjaGFubmVsLCB0cmFuc3BvcnQpO1xuXHRcdFx0XHRpZiAoISh0cmFuc3BvcnRUeXBlID09PSBcInNlbGZcIiAmJiB0eXBlb2YgcG9zdE1lc3NhZ2UgPT09IFwidW5kZWZpbmVkXCIpKSB0aGlzLl91bmlmaWVkLmNvbm5lY3QodHJhbnNwb3J0LCB7IHRhcmdldENoYW5uZWw6IGNoYW5uZWwgfSk7XG5cdFx0XHRcdHRoaXMuX2NvbnRleHQuJHJlZ2lzdGVyQ29ubmVjdGlvbih7XG5cdFx0XHRcdFx0bG9jYWxDaGFubmVsOiB0aGlzLl9jaGFubmVsLFxuXHRcdFx0XHRcdHJlbW90ZUNoYW5uZWw6IGNoYW5uZWwsXG5cdFx0XHRcdFx0c2VuZGVyOiB0aGlzLl9jaGFubmVsLFxuXHRcdFx0XHRcdGRpcmVjdGlvbjogXCJvdXRnb2luZ1wiLFxuXHRcdFx0XHRcdHRyYW5zcG9ydFR5cGVcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHRoaXMubm90aWZ5Q2hhbm5lbChjaGFubmVsLCB7XG5cdFx0XHRcdFx0Y29udGV4dElkOiB0aGlzLl9jb250ZXh0LmlkLFxuXHRcdFx0XHRcdGNvbnRleHROYW1lOiB0aGlzLl9jb250ZXh0Lmhvc3ROYW1lXG5cdFx0XHRcdH0sIFwiY29ubmVjdFwiKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBuZXcgUmVtb3RlQ2hhbm5lbEhlbHBlcihjaGFubmVsLCB0aGlzLl9jb250ZXh0LCBvcHRpb25zKTtcblx0XHR9XG5cdFx0Z2V0Q2hhbm5lbCgpIHtcblx0XHRcdHJldHVybiB0aGlzLl9jaGFubmVsO1xuXHRcdH1cblx0XHRnZXQgY29ubmVjdGlvbigpIHtcblx0XHRcdHJldHVybiB0aGlzLl9jb25uZWN0aW9uO1xuXHRcdH1cblx0XHRyZXF1ZXN0KHBhdGgsIGFjdGlvbiwgYXJncywgb3B0aW9ucyA9IHt9LCB0b0NoYW5uZWwgPSBcIndvcmtlclwiKSB7XG5cdFx0XHRsZXQgbm9ybWFsaXplZFBhdGggPSB0eXBlb2YgcGF0aCA9PT0gXCJzdHJpbmdcIiA/IFtwYXRoXSA6IHBhdGg7XG5cdFx0XHRsZXQgbm9ybWFsaXplZEFyZ3MgPSBhcmdzO1xuXHRcdFx0aWYgKEFycmF5LmlzQXJyYXkoYWN0aW9uKSAmJiBpc1JlZmxlY3RBY3Rpb24ocGF0aCkpIHtcblx0XHRcdFx0dG9DaGFubmVsID0gb3B0aW9ucztcblx0XHRcdFx0b3B0aW9ucyA9IGFyZ3M7XG5cdFx0XHRcdG5vcm1hbGl6ZWRBcmdzID0gYWN0aW9uO1xuXHRcdFx0XHRhY3Rpb24gPSBwYXRoO1xuXHRcdFx0XHRub3JtYWxpemVkUGF0aCA9IFtdO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXMuX3VuaWZpZWQuaW52b2tlKHRvQ2hhbm5lbCwgYWN0aW9uLCBub3JtYWxpemVkUGF0aCA/PyBbXSwgQXJyYXkuaXNBcnJheShub3JtYWxpemVkQXJncykgPyBub3JtYWxpemVkQXJncyA6IFtub3JtYWxpemVkQXJnc10pO1xuXHRcdH1cblx0XHRyZXNvbHZlUmVzcG9uc2UocmVxSWQsIHJlc3VsdCkge1xuXHRcdFx0dGhpcy5fZm9yUmVzb2x2ZXMuZ2V0KHJlcUlkKT8ucmVzb2x2ZT8uKHJlc3VsdCk7XG5cdFx0XHRjb25zdCBwcm9taXNlID0gdGhpcy5fZm9yUmVzb2x2ZXMuZ2V0KHJlcUlkKT8ucHJvbWlzZTtcblx0XHRcdHRoaXMuX2ZvclJlc29sdmVzLmRlbGV0ZShyZXFJZCk7XG5cdFx0XHRyZXR1cm4gcHJvbWlzZTtcblx0XHR9XG5cdFx0YXN5bmMgaGFuZGxlQW5kUmVzcG9uc2UocmVxdWVzdCwgcmVxSWQsIHJlc3BvbnNlRm4pIHt9XG5cdFx0bm90aWZ5Q2hhbm5lbCh0YXJnZXRDaGFubmVsLCBwYXlsb2FkID0ge30sIHR5cGUgPSBcIm5vdGlmeVwiKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fdW5pZmllZC5ub3RpZnkodGFyZ2V0Q2hhbm5lbCwge1xuXHRcdFx0XHQuLi5wYXlsb2FkLFxuXHRcdFx0XHRmcm9tOiB0aGlzLl9jaGFubmVsLFxuXHRcdFx0XHR0bzogdGFyZ2V0Q2hhbm5lbFxuXHRcdFx0fSwgdHlwZSk7XG5cdFx0fVxuXHRcdGdldENvbm5lY3RlZENoYW5uZWxzKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX3VuaWZpZWQuY29ubmVjdGVkQ2hhbm5lbHM7XG5cdFx0fVxuXHRcdGNsb3NlKCkge1xuXHRcdFx0dGhpcy5fc3Vic2NyaXB0aW9ucy5mb3JFYWNoKChzKSA9PiBzLnVuc3Vic2NyaWJlKCkpO1xuXHRcdFx0dGhpcy5fZm9yUmVzb2x2ZXMuY2xlYXIoKTtcblx0XHRcdHRoaXMuX2Jyb2FkY2FzdHM/LnZhbHVlcz8uKCk/LmZvckVhY2goKHRyYW5zcG9ydCkgPT4gdHJhbnNwb3J0LmNsb3NlPy4oKSk7XG5cdFx0XHR0aGlzLl9icm9hZGNhc3RzPy5jbGVhcj8uKCk7XG5cdFx0XHR0aGlzLl91bmlmaWVkLmNsb3NlKCk7XG5cdFx0fVxuXHRcdGdldCB1bmlmaWVkKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX3VuaWZpZWQ7XG5cdFx0fVxuXHR9O1xuXHQvKipcblx0KiBDaGFubmVsIENvbnRleHQgLSBNYW5hZ2VzIG11bHRpcGxlIGNoYW5uZWxzIGluIGEgc2luZ2xlIGNvbnRleHRcblx0KlxuXHQqIFVzZSB0aGlzIHdoZW4geW91IG5lZWQgbXVsdGlwbGUgaW5kZXBlbmRlbnQgY2hhbm5lbHMgaW4gdGhlIHNhbWVcblx0KiBKYXZhU2NyaXB0IGNvbnRleHQgKHNhbWUgd2luZG93LCBpZnJhbWUsIHdvcmtlciwgZXRjLilcblx0KlxuXHQqIFN1cHBvcnRzOlxuXHQqIC0gQ3JlYXRpbmcgbXVsdGlwbGUgY2hhbm5lbHMgYXQgb25jZSBvciBkZWZlcnJlZFxuXHQqIC0gRHluYW1pYyB0cmFuc3BvcnQgYWRkaXRpb24gKHdvcmtlcnMsIHBvcnRzLCBzb2NrZXRzLCBldGMuKVxuXHQqIC0gR2xvYmFsIHNlbGYvZ2xvYmFsVGhpcyBhcyBkZWZhdWx0IHRhcmdldFxuXHQqL1xuXHR2YXIgQ2hhbm5lbENvbnRleHQgPSBjbGFzcyB7XG5cdFx0X29wdGlvbnM7XG5cdFx0X2lkID0gVVVJRHY0KCk7XG5cdFx0X2hvc3ROYW1lO1xuXHRcdF9ob3N0ID0gbnVsbDtcblx0XHRfZW5kcG9pbnRzID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0XHRfdW5pZmllZEJ5Q2hhbm5lbCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG5cdFx0X3VuaWZpZWRDb25uZWN0aW9uU3VicyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG5cdFx0X3JlbW90ZUNoYW5uZWxzID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0XHRfZGVmZXJyZWRDaGFubmVscyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG5cdFx0X2Nvbm5lY3Rpb25FdmVudHMgPSBuZXcgQ2hhbm5lbFN1YmplY3QoeyBidWZmZXJTaXplOiAyMDAgfSk7XG5cdFx0X2Nvbm5lY3Rpb25SZWdpc3RyeSA9IG5ldyBDb25uZWN0aW9uUmVnaXN0cnkoKCkgPT4gVVVJRHY0KCksIChldmVudCkgPT4gdGhpcy5fZW1pdENvbm5lY3Rpb25FdmVudChldmVudCkpO1xuXHRcdF9jbG9zZWQgPSBmYWxzZTtcblx0XHRfZ2xvYmFsU2VsZiA9IG51bGw7XG5cdFx0Y29uc3RydWN0b3IoX29wdGlvbnMgPSB7fSkge1xuXHRcdFx0dGhpcy5fb3B0aW9ucyA9IF9vcHRpb25zO1xuXHRcdFx0dGhpcy5faG9zdE5hbWUgPSBfb3B0aW9ucy5uYW1lID8/IGBjdHgtJHt0aGlzLl9pZC5zbGljZSgwLCA4KX1gO1xuXHRcdFx0aWYgKF9vcHRpb25zLnVzZUdsb2JhbFNlbGYgIT09IGZhbHNlKSB0aGlzLl9nbG9iYWxTZWxmID0gdHlwZW9mIGdsb2JhbFRoaXMgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxUaGlzIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogbnVsbDtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBJbml0aWFsaXplL2dldCB0aGUgaG9zdCBjaGFubmVsIGZvciB0aGlzIGNvbnRleHRcblx0XHQqL1xuXHRcdGluaXRIb3N0KG5hbWUpIHtcblx0XHRcdGlmICh0aGlzLl9ob3N0ICYmICFuYW1lKSByZXR1cm4gdGhpcy5faG9zdDtcblx0XHRcdGNvbnN0IGhvc3ROYW1lID0gbmFtZSA/PyB0aGlzLl9ob3N0TmFtZTtcblx0XHRcdHRoaXMuX2hvc3ROYW1lID0gaG9zdE5hbWU7XG5cdFx0XHRpZiAodGhpcy5fZW5kcG9pbnRzLmhhcyhob3N0TmFtZSkpIHtcblx0XHRcdFx0dGhpcy5faG9zdCA9IHRoaXMuX2VuZHBvaW50cy5nZXQoaG9zdE5hbWUpLmhhbmRsZXI7XG5cdFx0XHRcdHJldHVybiB0aGlzLl9ob3N0O1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5faG9zdCA9IG5ldyBDaGFubmVsSGFuZGxlcihob3N0TmFtZSwgdGhpcywgdGhpcy5fb3B0aW9ucy5kZWZhdWx0T3B0aW9ucyk7XG5cdFx0XHRjb25zdCBlbmRwb2ludCA9IHtcblx0XHRcdFx0bmFtZTogaG9zdE5hbWUsXG5cdFx0XHRcdGhhbmRsZXI6IHRoaXMuX2hvc3QsXG5cdFx0XHRcdGNvbm5lY3Rpb246IHRoaXMuX2hvc3QuY29ubmVjdGlvbixcblx0XHRcdFx0c3Vic2NyaXB0aW9uczogW10sXG5cdFx0XHRcdHJlYWR5OiBQcm9taXNlLnJlc29sdmUobnVsbCksXG5cdFx0XHRcdHVuaWZpZWQ6IHRoaXMuX2hvc3QudW5pZmllZFxuXHRcdFx0fTtcblx0XHRcdHRoaXMuX2VuZHBvaW50cy5zZXQoaG9zdE5hbWUsIGVuZHBvaW50KTtcblx0XHRcdHRoaXMuX3JlZ2lzdGVyVW5pZmllZENoYW5uZWwoaG9zdE5hbWUsIHRoaXMuX2hvc3QudW5pZmllZCk7XG5cdFx0XHRyZXR1cm4gdGhpcy5faG9zdDtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBHZXQgdGhlIGhvc3QgY2hhbm5lbFxuXHRcdCovXG5cdFx0Z2V0SG9zdCgpIHtcblx0XHRcdHJldHVybiB0aGlzLl9ob3N0ID8/IHRoaXMuaW5pdEhvc3QoKTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBHZXQgaG9zdCBuYW1lXG5cdFx0Ki9cblx0XHRnZXQgaG9zdE5hbWUoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5faG9zdE5hbWU7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogR2V0IGNvbnRleHQgSURcblx0XHQqL1xuXHRcdGdldCBpZCgpIHtcblx0XHRcdHJldHVybiB0aGlzLl9pZDtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBPYnNlcnZhYmxlOiBjb25uZWN0aW9uIGV2ZW50cyBpbiB0aGlzIGNvbnRleHRcblx0XHQqL1xuXHRcdGdldCBvbkNvbm5lY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY29ubmVjdGlvbkV2ZW50cztcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBTdWJzY3JpYmUgdG8gY29ubmVjdGlvbiBldmVudHNcblx0XHQqL1xuXHRcdHN1YnNjcmliZUNvbm5lY3Rpb25zKGhhbmRsZXIpIHtcblx0XHRcdHJldHVybiB0aGlzLl9jb25uZWN0aW9uRXZlbnRzLnN1YnNjcmliZShoYW5kbGVyKTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBOb3RpZnkgYWxsIGN1cnJlbnRseSBrbm93biBhY3RpdmUgY29ubmVjdGlvbnMuXG5cdFx0KiBVc2VmdWwgZm9yIHNlcnZpY2Ugd29ya2VyIC8gY3Jvc3MtdGFiIGhhbmRzaGFrZXMuXG5cdFx0Ki9cblx0XHRub3RpZnlDb25uZWN0aW9ucyhwYXlsb2FkID0ge30sIHF1ZXJ5ID0ge30pIHtcblx0XHRcdGxldCBzZW50ID0gMDtcblx0XHRcdGZvciAoY29uc3QgZW5kcG9pbnQgb2YgdGhpcy5fZW5kcG9pbnRzLnZhbHVlcygpKSB7XG5cdFx0XHRcdGNvbnN0IGNvbm5lY3RlZFRhcmdldHMgPSBlbmRwb2ludC5oYW5kbGVyLmdldENvbm5lY3RlZENoYW5uZWxzKCk7XG5cdFx0XHRcdGZvciAoY29uc3QgcmVtb3RlQ2hhbm5lbCBvZiBjb25uZWN0ZWRUYXJnZXRzKSB7XG5cdFx0XHRcdFx0aWYgKHF1ZXJ5LmxvY2FsQ2hhbm5lbCAmJiBxdWVyeS5sb2NhbENoYW5uZWwgIT09IGVuZHBvaW50Lm5hbWUpIGNvbnRpbnVlO1xuXHRcdFx0XHRcdGlmIChxdWVyeS5yZW1vdGVDaGFubmVsICYmIHF1ZXJ5LnJlbW90ZUNoYW5uZWwgIT09IHJlbW90ZUNoYW5uZWwpIGNvbnRpbnVlO1xuXHRcdFx0XHRcdGNvbnN0IGV4aXN0aW5nID0gdGhpcy5xdWVyeUNvbm5lY3Rpb25zKHtcblx0XHRcdFx0XHRcdGxvY2FsQ2hhbm5lbDogZW5kcG9pbnQubmFtZSxcblx0XHRcdFx0XHRcdHJlbW90ZUNoYW5uZWwsXG5cdFx0XHRcdFx0XHRzdGF0dXM6IFwiYWN0aXZlXCJcblx0XHRcdFx0XHR9KVswXTtcblx0XHRcdFx0XHRpZiAocXVlcnkuc2VuZGVyICYmIGV4aXN0aW5nPy5zZW5kZXIgIT09IHF1ZXJ5LnNlbmRlcikgY29udGludWU7XG5cdFx0XHRcdFx0aWYgKHF1ZXJ5LnRyYW5zcG9ydFR5cGUgJiYgZXhpc3Rpbmc/LnRyYW5zcG9ydFR5cGUgIT09IHF1ZXJ5LnRyYW5zcG9ydFR5cGUpIGNvbnRpbnVlO1xuXHRcdFx0XHRcdGlmIChxdWVyeS5jaGFubmVsICYmIHF1ZXJ5LmNoYW5uZWwgIT09IGVuZHBvaW50Lm5hbWUgJiYgcXVlcnkuY2hhbm5lbCAhPT0gcmVtb3RlQ2hhbm5lbCkgY29udGludWU7XG5cdFx0XHRcdFx0aWYgKGVuZHBvaW50LmhhbmRsZXIubm90aWZ5Q2hhbm5lbChyZW1vdGVDaGFubmVsLCBwYXlsb2FkLCBcIm5vdGlmeVwiKSkgc2VudCsrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gc2VudDtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBRdWVyeSB0cmFja2VkIGNvbm5lY3Rpb25zIHdpdGggZmlsdGVyc1xuXHRcdCovXG5cdFx0cXVlcnlDb25uZWN0aW9ucyhxdWVyeSA9IHt9KSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY29ubmVjdGlvblJlZ2lzdHJ5LnF1ZXJ5KHF1ZXJ5KS5tYXAoKGNvbm5lY3Rpb24pID0+ICh7XG5cdFx0XHRcdC4uLmNvbm5lY3Rpb24sXG5cdFx0XHRcdGNvbnRleHRJZDogdGhpcy5faWRcblx0XHRcdH0pKTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBDcmVhdGUgYSBuZXcgY2hhbm5lbCBlbmRwb2ludCBpbiB0aGlzIGNvbnRleHRcblx0XHQqXG5cdFx0KiBAcGFyYW0gbmFtZSAtIENoYW5uZWwgbmFtZVxuXHRcdCogQHBhcmFtIG9wdGlvbnMgLSBDb25uZWN0aW9uIG9wdGlvbnNcblx0XHQqIEByZXR1cm5zIENoYW5uZWxFbmRwb2ludCB3aXRoIGhhbmRsZXIgYW5kIGNvbm5lY3Rpb25cblx0XHQqL1xuXHRcdGNyZWF0ZUNoYW5uZWwobmFtZSwgb3B0aW9ucyA9IHt9KSB7XG5cdFx0XHRpZiAodGhpcy5fZW5kcG9pbnRzLmhhcyhuYW1lKSkgcmV0dXJuIHRoaXMuX2VuZHBvaW50cy5nZXQobmFtZSk7XG5cdFx0XHRjb25zdCBoYW5kbGVyID0gbmV3IENoYW5uZWxIYW5kbGVyKG5hbWUsIHRoaXMsIHtcblx0XHRcdFx0Li4udGhpcy5fb3B0aW9ucy5kZWZhdWx0T3B0aW9ucyxcblx0XHRcdFx0Li4ub3B0aW9uc1xuXHRcdFx0fSk7XG5cdFx0XHRjb25zdCBlbmRwb2ludCA9IHtcblx0XHRcdFx0bmFtZSxcblx0XHRcdFx0aGFuZGxlcixcblx0XHRcdFx0Y29ubmVjdGlvbjogaGFuZGxlci5jb25uZWN0aW9uLFxuXHRcdFx0XHRzdWJzY3JpcHRpb25zOiBbXSxcblx0XHRcdFx0cmVhZHk6IFByb21pc2UucmVzb2x2ZShudWxsKSxcblx0XHRcdFx0dW5pZmllZDogaGFuZGxlci51bmlmaWVkXG5cdFx0XHR9O1xuXHRcdFx0dGhpcy5fZW5kcG9pbnRzLnNldChuYW1lLCBlbmRwb2ludCk7XG5cdFx0XHR0aGlzLl9yZWdpc3RlclVuaWZpZWRDaGFubmVsKG5hbWUsIGhhbmRsZXIudW5pZmllZCk7XG5cdFx0XHRyZXR1cm4gZW5kcG9pbnQ7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogQ3JlYXRlIG11bHRpcGxlIGNoYW5uZWwgZW5kcG9pbnRzIGF0IG9uY2Vcblx0XHQqXG5cdFx0KiBAcGFyYW0gbmFtZXMgLSBBcnJheSBvZiBjaGFubmVsIG5hbWVzXG5cdFx0KiBAcGFyYW0gb3B0aW9ucyAtIFNoYXJlZCBjb25uZWN0aW9uIG9wdGlvbnNcblx0XHQqIEByZXR1cm5zIE1hcCBvZiBjaGFubmVsIG5hbWVzIHRvIGVuZHBvaW50c1xuXHRcdCovXG5cdFx0Y3JlYXRlQ2hhbm5lbHMobmFtZXMsIG9wdGlvbnMgPSB7fSkge1xuXHRcdFx0Y29uc3QgcmVzdWx0ID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0XHRcdGZvciAoY29uc3QgbmFtZSBvZiBuYW1lcykgcmVzdWx0LnNldChuYW1lLCB0aGlzLmNyZWF0ZUNoYW5uZWwobmFtZSwgb3B0aW9ucykpO1xuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBHZXQgYW4gZXhpc3RpbmcgY2hhbm5lbCBlbmRwb2ludFxuXHRcdCovXG5cdFx0Z2V0Q2hhbm5lbChuYW1lKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fZW5kcG9pbnRzLmdldChuYW1lKTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBHZXQgb3IgY3JlYXRlIGEgY2hhbm5lbCBlbmRwb2ludFxuXHRcdCovXG5cdFx0Z2V0T3JDcmVhdGVDaGFubmVsKG5hbWUsIG9wdGlvbnMgPSB7fSkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2VuZHBvaW50cy5nZXQobmFtZSkgPz8gdGhpcy5jcmVhdGVDaGFubmVsKG5hbWUsIG9wdGlvbnMpO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIENoZWNrIGlmIGNoYW5uZWwgZXhpc3RzIGluIHRoaXMgY29udGV4dFxuXHRcdCovXG5cdFx0aGFzQ2hhbm5lbChuYW1lKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fZW5kcG9pbnRzLmhhcyhuYW1lKTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBHZXQgYWxsIGNoYW5uZWwgbmFtZXMgaW4gdGhpcyBjb250ZXh0XG5cdFx0Ki9cblx0XHRnZXRDaGFubmVsTmFtZXMoKSB7XG5cdFx0XHRyZXR1cm4gWy4uLnRoaXMuX2VuZHBvaW50cy5rZXlzKCldO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIEdldCB0b3RhbCBudW1iZXIgb2YgY2hhbm5lbHNcblx0XHQqL1xuXHRcdGdldCBzaXplKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2VuZHBvaW50cy5zaXplO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIFJlZ2lzdGVyIGEgZGVmZXJyZWQgY2hhbm5lbCB0aGF0IHdpbGwgYmUgaW5pdGlhbGl6ZWQgb24gZmlyc3QgdXNlXG5cdFx0KlxuXHRcdCogQHBhcmFtIG5hbWUgLSBDaGFubmVsIG5hbWVcblx0XHQqIEBwYXJhbSBpbml0Rm4gLSBGdW5jdGlvbiB0byBpbml0aWFsaXplIHRoZSBjaGFubmVsXG5cdFx0Ki9cblx0XHRkZWZlcihuYW1lLCBpbml0Rm4pIHtcblx0XHRcdHRoaXMuX2RlZmVycmVkQ2hhbm5lbHMuc2V0KG5hbWUsIGluaXRGbik7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogSW5pdGlhbGl6ZSBhIHByZXZpb3VzbHkgZGVmZXJyZWQgY2hhbm5lbFxuXHRcdCovXG5cdFx0YXN5bmMgaW5pdERlZmVycmVkKG5hbWUpIHtcblx0XHRcdGNvbnN0IGluaXRGbiA9IHRoaXMuX2RlZmVycmVkQ2hhbm5lbHMuZ2V0KG5hbWUpO1xuXHRcdFx0aWYgKCFpbml0Rm4pIHJldHVybiBudWxsO1xuXHRcdFx0Y29uc3QgZW5kcG9pbnQgPSBhd2FpdCBpbml0Rm4oKTtcblx0XHRcdHRoaXMuX2VuZHBvaW50cy5zZXQobmFtZSwgZW5kcG9pbnQpO1xuXHRcdFx0dGhpcy5fZGVmZXJyZWRDaGFubmVscy5kZWxldGUobmFtZSk7XG5cdFx0XHRyZXR1cm4gZW5kcG9pbnQ7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogQ2hlY2sgaWYgY2hhbm5lbCBpcyBkZWZlcnJlZCAobm90IHlldCBpbml0aWFsaXplZClcblx0XHQqL1xuXHRcdGlzRGVmZXJyZWQobmFtZSkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2RlZmVycmVkQ2hhbm5lbHMuaGFzKG5hbWUpO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIEdldCBjaGFubmVsLCBpbml0aWFsaXppbmcgZGVmZXJyZWQgaWYgbmVlZGVkXG5cdFx0Ki9cblx0XHRhc3luYyBnZXRDaGFubmVsQXN5bmMobmFtZSkge1xuXHRcdFx0aWYgKHRoaXMuX2VuZHBvaW50cy5oYXMobmFtZSkpIHJldHVybiB0aGlzLl9lbmRwb2ludHMuZ2V0KG5hbWUpO1xuXHRcdFx0aWYgKHRoaXMuX2RlZmVycmVkQ2hhbm5lbHMuaGFzKG5hbWUpKSByZXR1cm4gdGhpcy5pbml0RGVmZXJyZWQobmFtZSk7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBBZGQgYSBXb3JrZXIgY2hhbm5lbCBkeW5hbWljYWxseVxuXHRcdCpcblx0XHQqIEBwYXJhbSBuYW1lIC0gQ2hhbm5lbCBuYW1lXG5cdFx0KiBAcGFyYW0gd29ya2VyIC0gV29ya2VyIGluc3RhbmNlLCBVUkwsIG9yIGNvZGUgc3RyaW5nXG5cdFx0KiBAcGFyYW0gb3B0aW9ucyAtIENvbm5lY3Rpb24gb3B0aW9uc1xuXHRcdCovXG5cdFx0YXN5bmMgYWRkV29ya2VyKG5hbWUsIHdvcmtlciwgb3B0aW9ucyA9IHt9KSB7XG5cdFx0XHRjb25zdCB3b3JrZXJJbnN0YW5jZSA9IGxvYWRXb3JrZXIod29ya2VyKTtcblx0XHRcdGlmICghd29ya2VySW5zdGFuY2UpIHRocm93IG5ldyBFcnJvcihgRmFpbGVkIHRvIGNyZWF0ZSB3b3JrZXIgZm9yIGNoYW5uZWw6ICR7bmFtZX1gKTtcblx0XHRcdGNvbnN0IGhhbmRsZXIgPSBuZXcgQ2hhbm5lbEhhbmRsZXIobmFtZSwgdGhpcywge1xuXHRcdFx0XHQuLi50aGlzLl9vcHRpb25zLmRlZmF1bHRPcHRpb25zLFxuXHRcdFx0XHQuLi5vcHRpb25zXG5cdFx0XHR9KTtcblx0XHRcdGNvbnN0IHJlYWR5ID0gaGFuZGxlci5jcmVhdGVSZW1vdGVDaGFubmVsKG5hbWUsIG9wdGlvbnMsIHdvcmtlckluc3RhbmNlKTtcblx0XHRcdGNvbnN0IGVuZHBvaW50ID0ge1xuXHRcdFx0XHRuYW1lLFxuXHRcdFx0XHRoYW5kbGVyLFxuXHRcdFx0XHRjb25uZWN0aW9uOiBoYW5kbGVyLmNvbm5lY3Rpb24sXG5cdFx0XHRcdHN1YnNjcmlwdGlvbnM6IFtdLFxuXHRcdFx0XHR0cmFuc3BvcnRUeXBlOiBcIndvcmtlclwiLFxuXHRcdFx0XHRyZWFkeTogUHJvbWlzZS5yZXNvbHZlKHJlYWR5KSxcblx0XHRcdFx0dW5pZmllZDogaGFuZGxlci51bmlmaWVkXG5cdFx0XHR9O1xuXHRcdFx0dGhpcy5fZW5kcG9pbnRzLnNldChuYW1lLCBlbmRwb2ludCk7XG5cdFx0XHR0aGlzLl9yZWdpc3RlclVuaWZpZWRDaGFubmVsKG5hbWUsIGhhbmRsZXIudW5pZmllZCk7XG5cdFx0XHR0aGlzLl9yZW1vdGVDaGFubmVscy5zZXQobmFtZSwge1xuXHRcdFx0XHRjaGFubmVsOiBuYW1lLFxuXHRcdFx0XHRjb250ZXh0OiB0aGlzLFxuXHRcdFx0XHRyZW1vdGU6IFByb21pc2UucmVzb2x2ZShyZWFkeSksXG5cdFx0XHRcdHRyYW5zcG9ydDogd29ya2VySW5zdGFuY2UsXG5cdFx0XHRcdHRyYW5zcG9ydFR5cGU6IFwid29ya2VyXCJcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIGVuZHBvaW50O1xuXHRcdH1cblx0XHQvKipcblx0XHQqIEFkZCBhIE1lc3NhZ2VQb3J0IGNoYW5uZWwgZHluYW1pY2FsbHlcblx0XHQqXG5cdFx0KiBAcGFyYW0gbmFtZSAtIENoYW5uZWwgbmFtZVxuXHRcdCogQHBhcmFtIHBvcnQgLSBNZXNzYWdlUG9ydCBpbnN0YW5jZVxuXHRcdCogQHBhcmFtIG9wdGlvbnMgLSBDb25uZWN0aW9uIG9wdGlvbnNcblx0XHQqL1xuXHRcdGFzeW5jIGFkZFBvcnQobmFtZSwgcG9ydCwgb3B0aW9ucyA9IHt9KSB7XG5cdFx0XHRjb25zdCBoYW5kbGVyID0gbmV3IENoYW5uZWxIYW5kbGVyKG5hbWUsIHRoaXMsIHtcblx0XHRcdFx0Li4udGhpcy5fb3B0aW9ucy5kZWZhdWx0T3B0aW9ucyxcblx0XHRcdFx0Li4ub3B0aW9uc1xuXHRcdFx0fSk7XG5cdFx0XHRwb3J0LnN0YXJ0Py4oKTtcblx0XHRcdGNvbnN0IHJlYWR5ID0gaGFuZGxlci5jcmVhdGVSZW1vdGVDaGFubmVsKG5hbWUsIG9wdGlvbnMsIHBvcnQpO1xuXHRcdFx0Y29uc3QgZW5kcG9pbnQgPSB7XG5cdFx0XHRcdG5hbWUsXG5cdFx0XHRcdGhhbmRsZXIsXG5cdFx0XHRcdGNvbm5lY3Rpb246IGhhbmRsZXIuY29ubmVjdGlvbixcblx0XHRcdFx0c3Vic2NyaXB0aW9uczogW10sXG5cdFx0XHRcdHRyYW5zcG9ydFR5cGU6IFwibWVzc2FnZS1wb3J0XCIsXG5cdFx0XHRcdHJlYWR5OiBQcm9taXNlLnJlc29sdmUocmVhZHkpLFxuXHRcdFx0XHR1bmlmaWVkOiBoYW5kbGVyLnVuaWZpZWRcblx0XHRcdH07XG5cdFx0XHR0aGlzLl9lbmRwb2ludHMuc2V0KG5hbWUsIGVuZHBvaW50KTtcblx0XHRcdHRoaXMuX3JlZ2lzdGVyVW5pZmllZENoYW5uZWwobmFtZSwgaGFuZGxlci51bmlmaWVkKTtcblx0XHRcdHRoaXMuX3JlbW90ZUNoYW5uZWxzLnNldChuYW1lLCB7XG5cdFx0XHRcdGNoYW5uZWw6IG5hbWUsXG5cdFx0XHRcdGNvbnRleHQ6IHRoaXMsXG5cdFx0XHRcdHJlbW90ZTogUHJvbWlzZS5yZXNvbHZlKHJlYWR5KSxcblx0XHRcdFx0dHJhbnNwb3J0OiBwb3J0LFxuXHRcdFx0XHR0cmFuc3BvcnRUeXBlOiBcIm1lc3NhZ2UtcG9ydFwiXG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBlbmRwb2ludDtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBBZGQgYSBCcm9hZGNhc3RDaGFubmVsIGR5bmFtaWNhbGx5XG5cdFx0KlxuXHRcdCogQHBhcmFtIG5hbWUgLSBDaGFubmVsIG5hbWUgKGFsc28gdXNlZCBhcyBCcm9hZGNhc3RDaGFubmVsIG5hbWUgaWYgbm90IHByb3ZpZGVkKVxuXHRcdCogQHBhcmFtIGJyb2FkY2FzdE5hbWUgLSBPcHRpb25hbCBCcm9hZGNhc3RDaGFubmVsIG5hbWUgKGRlZmF1bHRzIHRvIGNoYW5uZWwgbmFtZSlcblx0XHQqIEBwYXJhbSBvcHRpb25zIC0gQ29ubmVjdGlvbiBvcHRpb25zXG5cdFx0Ki9cblx0XHRhc3luYyBhZGRCcm9hZGNhc3QobmFtZSwgYnJvYWRjYXN0TmFtZSwgb3B0aW9ucyA9IHt9KSB7XG5cdFx0XHRjb25zdCBiYyA9IG5ldyBCcm9hZGNhc3RDaGFubmVsKGJyb2FkY2FzdE5hbWUgPz8gbmFtZSk7XG5cdFx0XHRjb25zdCBoYW5kbGVyID0gbmV3IENoYW5uZWxIYW5kbGVyKG5hbWUsIHRoaXMsIHtcblx0XHRcdFx0Li4udGhpcy5fb3B0aW9ucy5kZWZhdWx0T3B0aW9ucyxcblx0XHRcdFx0Li4ub3B0aW9uc1xuXHRcdFx0fSk7XG5cdFx0XHRjb25zdCByZWFkeSA9IGhhbmRsZXIuY3JlYXRlUmVtb3RlQ2hhbm5lbChuYW1lLCBvcHRpb25zLCBiYyk7XG5cdFx0XHRjb25zdCBlbmRwb2ludCA9IHtcblx0XHRcdFx0bmFtZSxcblx0XHRcdFx0aGFuZGxlcixcblx0XHRcdFx0Y29ubmVjdGlvbjogaGFuZGxlci5jb25uZWN0aW9uLFxuXHRcdFx0XHRzdWJzY3JpcHRpb25zOiBbXSxcblx0XHRcdFx0dHJhbnNwb3J0VHlwZTogXCJicm9hZGNhc3RcIixcblx0XHRcdFx0cmVhZHk6IFByb21pc2UucmVzb2x2ZShyZWFkeSksXG5cdFx0XHRcdHVuaWZpZWQ6IGhhbmRsZXIudW5pZmllZFxuXHRcdFx0fTtcblx0XHRcdHRoaXMuX2VuZHBvaW50cy5zZXQobmFtZSwgZW5kcG9pbnQpO1xuXHRcdFx0dGhpcy5fcmVnaXN0ZXJVbmlmaWVkQ2hhbm5lbChuYW1lLCBoYW5kbGVyLnVuaWZpZWQpO1xuXHRcdFx0dGhpcy5fcmVtb3RlQ2hhbm5lbHMuc2V0KG5hbWUsIHtcblx0XHRcdFx0Y2hhbm5lbDogbmFtZSxcblx0XHRcdFx0Y29udGV4dDogdGhpcyxcblx0XHRcdFx0cmVtb3RlOiBQcm9taXNlLnJlc29sdmUocmVhZHkpLFxuXHRcdFx0XHR0cmFuc3BvcnQ6IGJjLFxuXHRcdFx0XHR0cmFuc3BvcnRUeXBlOiBcImJyb2FkY2FzdFwiXG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBlbmRwb2ludDtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBBZGQgYSBjaGFubmVsIHVzaW5nIHNlbGYvZ2xvYmFsVGhpcyAoZm9yIHNhbWUtY29udGV4dCBjb21tdW5pY2F0aW9uKVxuXHRcdCpcblx0XHQqIEBwYXJhbSBuYW1lIC0gQ2hhbm5lbCBuYW1lXG5cdFx0KiBAcGFyYW0gb3B0aW9ucyAtIENvbm5lY3Rpb24gb3B0aW9uc1xuXHRcdCovXG5cdFx0YWRkU2VsZkNoYW5uZWwobmFtZSwgb3B0aW9ucyA9IHt9KSB7XG5cdFx0XHRjb25zdCBoYW5kbGVyID0gbmV3IENoYW5uZWxIYW5kbGVyKG5hbWUsIHRoaXMsIHtcblx0XHRcdFx0Li4udGhpcy5fb3B0aW9ucy5kZWZhdWx0T3B0aW9ucyxcblx0XHRcdFx0Li4ub3B0aW9uc1xuXHRcdFx0fSk7XG5cdFx0XHRjb25zdCBzZWxmVGFyZ2V0ID0gdGhpcy5fZ2xvYmFsU2VsZiA/PyAodHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogbnVsbCk7XG5cdFx0XHRjb25zdCBlbmRwb2ludCA9IHtcblx0XHRcdFx0bmFtZSxcblx0XHRcdFx0aGFuZGxlcixcblx0XHRcdFx0Y29ubmVjdGlvbjogaGFuZGxlci5jb25uZWN0aW9uLFxuXHRcdFx0XHRzdWJzY3JpcHRpb25zOiBbXSxcblx0XHRcdFx0dHJhbnNwb3J0VHlwZTogXCJzZWxmXCIsXG5cdFx0XHRcdHJlYWR5OiBQcm9taXNlLnJlc29sdmUoc2VsZlRhcmdldCA/IGhhbmRsZXIuY3JlYXRlUmVtb3RlQ2hhbm5lbChuYW1lLCBvcHRpb25zLCBzZWxmVGFyZ2V0KSA6IG51bGwpLFxuXHRcdFx0XHR1bmlmaWVkOiBoYW5kbGVyLnVuaWZpZWRcblx0XHRcdH07XG5cdFx0XHR0aGlzLl9lbmRwb2ludHMuc2V0KG5hbWUsIGVuZHBvaW50KTtcblx0XHRcdHRoaXMuX3JlZ2lzdGVyVW5pZmllZENoYW5uZWwobmFtZSwgaGFuZGxlci51bmlmaWVkKTtcblx0XHRcdHJldHVybiBlbmRwb2ludDtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBBZGQgY2hhbm5lbCB3aXRoIGR5bmFtaWMgdHJhbnNwb3J0IGNvbmZpZ3VyYXRpb25cblx0XHQqXG5cdFx0KiBAcGFyYW0gbmFtZSAtIENoYW5uZWwgbmFtZVxuXHRcdCogQHBhcmFtIGNvbmZpZyAtIFRyYW5zcG9ydCBjb25maWd1cmF0aW9uXG5cdFx0Ki9cblx0XHRhc3luYyBhZGRUcmFuc3BvcnQobmFtZSwgY29uZmlnKSB7XG5cdFx0XHRjb25zdCBvcHRpb25zID0gY29uZmlnLm9wdGlvbnMgPz8ge307XG5cdFx0XHRzd2l0Y2ggKGNvbmZpZy50eXBlKSB7XG5cdFx0XHRcdGNhc2UgXCJ3b3JrZXJcIjpcblx0XHRcdFx0XHRpZiAoIWNvbmZpZy53b3JrZXIpIHRocm93IG5ldyBFcnJvcihcIldvcmtlciByZXF1aXJlZCBmb3Igd29ya2VyIHRyYW5zcG9ydFwiKTtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5hZGRXb3JrZXIobmFtZSwgY29uZmlnLndvcmtlciwgb3B0aW9ucyk7XG5cdFx0XHRcdGNhc2UgXCJtZXNzYWdlLXBvcnRcIjpcblx0XHRcdFx0XHRpZiAoIWNvbmZpZy5wb3J0KSB0aHJvdyBuZXcgRXJyb3IoXCJQb3J0IHJlcXVpcmVkIGZvciBtZXNzYWdlLXBvcnQgdHJhbnNwb3J0XCIpO1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLmFkZFBvcnQobmFtZSwgY29uZmlnLnBvcnQsIG9wdGlvbnMpO1xuXHRcdFx0XHRjYXNlIFwiYnJvYWRjYXN0XCI6XG5cdFx0XHRcdFx0Y29uc3QgYmNOYW1lID0gdHlwZW9mIGNvbmZpZy5icm9hZGNhc3QgPT09IFwic3RyaW5nXCIgPyBjb25maWcuYnJvYWRjYXN0IDogdm9pZCAwO1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLmFkZEJyb2FkY2FzdChuYW1lLCBiY05hbWUsIG9wdGlvbnMpO1xuXHRcdFx0XHRjYXNlIFwic2VsZlwiOiByZXR1cm4gdGhpcy5hZGRTZWxmQ2hhbm5lbChuYW1lLCBvcHRpb25zKTtcblx0XHRcdFx0ZGVmYXVsdDogcmV0dXJuIHRoaXMuY3JlYXRlQ2hhbm5lbChuYW1lLCBvcHRpb25zKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBDcmVhdGUgYSBNZXNzYWdlQ2hhbm5lbCBwYWlyIGZvciBiaWRpcmVjdGlvbmFsIGNvbW11bmljYXRpb25cblx0XHQqXG5cdFx0KiBAcGFyYW0gbmFtZTEgLSBGaXJzdCBjaGFubmVsIG5hbWVcblx0XHQqIEBwYXJhbSBuYW1lMiAtIFNlY29uZCBjaGFubmVsIG5hbWVcblx0XHQqIEByZXR1cm5zIEJvdGggZW5kcG9pbnRzIGNvbm5lY3RlZCB2aWEgTWVzc2FnZUNoYW5uZWxcblx0XHQqL1xuXHRcdGNyZWF0ZUNoYW5uZWxQYWlyKG5hbWUxLCBuYW1lMiwgb3B0aW9ucyA9IHt9KSB7XG5cdFx0XHRjb25zdCBtYyA9IG5ldyBNZXNzYWdlQ2hhbm5lbCgpO1xuXHRcdFx0Y29uc3QgaGFuZGxlcjEgPSBuZXcgQ2hhbm5lbEhhbmRsZXIobmFtZTEsIHRoaXMsIHtcblx0XHRcdFx0Li4udGhpcy5fb3B0aW9ucy5kZWZhdWx0T3B0aW9ucyxcblx0XHRcdFx0Li4ub3B0aW9uc1xuXHRcdFx0fSk7XG5cdFx0XHRjb25zdCBoYW5kbGVyMiA9IG5ldyBDaGFubmVsSGFuZGxlcihuYW1lMiwgdGhpcywge1xuXHRcdFx0XHQuLi50aGlzLl9vcHRpb25zLmRlZmF1bHRPcHRpb25zLFxuXHRcdFx0XHQuLi5vcHRpb25zXG5cdFx0XHR9KTtcblx0XHRcdG1jLnBvcnQxLnN0YXJ0KCk7XG5cdFx0XHRtYy5wb3J0Mi5zdGFydCgpO1xuXHRcdFx0Y29uc3QgcmVhZHkxID0gUHJvbWlzZS5yZXNvbHZlKGhhbmRsZXIxLmNyZWF0ZVJlbW90ZUNoYW5uZWwobmFtZTIsIG9wdGlvbnMsIG1jLnBvcnQxKSk7XG5cdFx0XHRjb25zdCByZWFkeTIgPSBQcm9taXNlLnJlc29sdmUoaGFuZGxlcjIuY3JlYXRlUmVtb3RlQ2hhbm5lbChuYW1lMSwgb3B0aW9ucywgbWMucG9ydDIpKTtcblx0XHRcdGNvbnN0IGNoYW5uZWwxID0ge1xuXHRcdFx0XHRuYW1lOiBuYW1lMSxcblx0XHRcdFx0aGFuZGxlcjogaGFuZGxlcjEsXG5cdFx0XHRcdGNvbm5lY3Rpb246IGhhbmRsZXIxLmNvbm5lY3Rpb24sXG5cdFx0XHRcdHN1YnNjcmlwdGlvbnM6IFtdLFxuXHRcdFx0XHR0cmFuc3BvcnRUeXBlOiBcIm1lc3NhZ2UtcG9ydFwiLFxuXHRcdFx0XHRyZWFkeTogcmVhZHkxLFxuXHRcdFx0XHR1bmlmaWVkOiBoYW5kbGVyMS51bmlmaWVkXG5cdFx0XHR9O1xuXHRcdFx0Y29uc3QgY2hhbm5lbDIgPSB7XG5cdFx0XHRcdG5hbWU6IG5hbWUyLFxuXHRcdFx0XHRoYW5kbGVyOiBoYW5kbGVyMixcblx0XHRcdFx0Y29ubmVjdGlvbjogaGFuZGxlcjIuY29ubmVjdGlvbixcblx0XHRcdFx0c3Vic2NyaXB0aW9uczogW10sXG5cdFx0XHRcdHRyYW5zcG9ydFR5cGU6IFwibWVzc2FnZS1wb3J0XCIsXG5cdFx0XHRcdHJlYWR5OiByZWFkeTIsXG5cdFx0XHRcdHVuaWZpZWQ6IGhhbmRsZXIyLnVuaWZpZWRcblx0XHRcdH07XG5cdFx0XHR0aGlzLl9lbmRwb2ludHMuc2V0KG5hbWUxLCBjaGFubmVsMSk7XG5cdFx0XHR0aGlzLl9lbmRwb2ludHMuc2V0KG5hbWUyLCBjaGFubmVsMik7XG5cdFx0XHR0aGlzLl9yZWdpc3RlclVuaWZpZWRDaGFubmVsKG5hbWUxLCBoYW5kbGVyMS51bmlmaWVkKTtcblx0XHRcdHRoaXMuX3JlZ2lzdGVyVW5pZmllZENoYW5uZWwobmFtZTIsIGhhbmRsZXIyLnVuaWZpZWQpO1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0Y2hhbm5lbDEsXG5cdFx0XHRcdGNoYW5uZWwyLFxuXHRcdFx0XHRtZXNzYWdlQ2hhbm5lbDogbWNcblx0XHRcdH07XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogR2V0IHRoZSBnbG9iYWwgc2VsZiByZWZlcmVuY2Vcblx0XHQqL1xuXHRcdGdldCBnbG9iYWxTZWxmKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2dsb2JhbFNlbGY7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogQ29ubmVjdCB0byBhIHJlbW90ZSBjaGFubmVsIChlLmcuLCBpbiBhIFdvcmtlcilcblx0XHQqL1xuXHRcdGFzeW5jIGNvbm5lY3RSZW1vdGUoY2hhbm5lbE5hbWUsIG9wdGlvbnMgPSB7fSwgYnJvYWRjYXN0KSB7XG5cdFx0XHR0aGlzLmluaXRIb3N0KCk7XG5cdFx0XHRyZXR1cm4gdGhpcy5faG9zdC5jcmVhdGVSZW1vdGVDaGFubmVsKGNoYW5uZWxOYW1lLCBvcHRpb25zLCBicm9hZGNhc3QpO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIEltcG9ydCBhIG1vZHVsZSBpbiBhIHJlbW90ZSBjaGFubmVsXG5cdFx0Ki9cblx0XHRhc3luYyBpbXBvcnRNb2R1bGVJbkNoYW5uZWwoY2hhbm5lbE5hbWUsIHVybCwgb3B0aW9ucyA9IHt9LCBicm9hZGNhc3QpIHtcblx0XHRcdHJldHVybiAoYXdhaXQgdGhpcy5jb25uZWN0UmVtb3RlKGNoYW5uZWxOYW1lLCBvcHRpb25zLmNoYW5uZWxPcHRpb25zLCBicm9hZGNhc3QpKT8uZG9JbXBvcnRNb2R1bGU/Lih1cmwsIG9wdGlvbnMuaW1wb3J0T3B0aW9ucyk7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogSW50ZXJuYWw6IENyZWF0ZSBvciB1c2UgZXhpc3RpbmcgcmVtb3RlIGNoYW5uZWxcblx0XHQqL1xuXHRcdCRjcmVhdGVPclVzZUV4aXN0aW5nUmVtb3RlKGNoYW5uZWwsIG9wdGlvbnMgPSB7fSwgYnJvYWRjYXN0KSB7XG5cdFx0XHRpZiAoY2hhbm5lbCA9PSBudWxsIHx8IGJyb2FkY2FzdCkgcmV0dXJuIG51bGw7XG5cdFx0XHRpZiAodGhpcy5fcmVtb3RlQ2hhbm5lbHMuaGFzKGNoYW5uZWwpKSByZXR1cm4gdGhpcy5fcmVtb3RlQ2hhbm5lbHMuZ2V0KGNoYW5uZWwpO1xuXHRcdFx0Y29uc3QgbXNnQ2hhbm5lbCA9IG5ldyBNZXNzYWdlQ2hhbm5lbCgpO1xuXHRcdFx0Y29uc3QgcHJvbWlzZSA9IFByb21pc2VkKG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG5cdFx0XHRcdGNvbnN0IHdvcmtlciA9IGxvYWRXb3JrZXIod29ya2VyQ29kZSk7XG5cdFx0XHRcdHdvcmtlcj8uYWRkRXZlbnRMaXN0ZW5lcj8uKFwibWVzc2FnZVwiLCAoZXZlbnQpID0+IHtcblx0XHRcdFx0XHRpZiAoZXZlbnQuZGF0YS50eXBlID09PSBcImNoYW5uZWxDcmVhdGVkXCIpIHtcblx0XHRcdFx0XHRcdG1zZ0NoYW5uZWwucG9ydDE/LnN0YXJ0Py4oKTtcblx0XHRcdFx0XHRcdHJlc29sdmUobmV3IFJlbW90ZUNoYW5uZWxIZWxwZXIoZXZlbnQuZGF0YS5jaGFubmVsLCB0aGlzLCBvcHRpb25zKSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0d29ya2VyPy5wb3N0TWVzc2FnZT8uKHtcblx0XHRcdFx0XHR0eXBlOiBcImNyZWF0ZUNoYW5uZWxcIixcblx0XHRcdFx0XHRjaGFubmVsLFxuXHRcdFx0XHRcdHNlbmRlcjogdGhpcy5faG9zdE5hbWUsXG5cdFx0XHRcdFx0b3B0aW9ucyxcblx0XHRcdFx0XHRtZXNzYWdlUG9ydDogbXNnQ2hhbm5lbC5wb3J0MlxuXHRcdFx0XHR9LCB7IHRyYW5zZmVyOiBbbXNnQ2hhbm5lbC5wb3J0Ml0gfSk7XG5cdFx0XHR9KSk7XG5cdFx0XHRjb25zdCBpbmZvID0ge1xuXHRcdFx0XHRjaGFubmVsLFxuXHRcdFx0XHRjb250ZXh0OiB0aGlzLFxuXHRcdFx0XHRtZXNzYWdlQ2hhbm5lbDogbXNnQ2hhbm5lbCxcblx0XHRcdFx0cmVtb3RlOiBwcm9taXNlXG5cdFx0XHR9O1xuXHRcdFx0dGhpcy5fcmVtb3RlQ2hhbm5lbHMuc2V0KGNoYW5uZWwsIGluZm8pO1xuXHRcdFx0cmV0dXJuIGluZm87XG5cdFx0fVxuXHRcdCRyZWdpc3RlckNvbm5lY3Rpb24ocGFyYW1zKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHQuLi50aGlzLl9jb25uZWN0aW9uUmVnaXN0cnkucmVnaXN0ZXIocGFyYW1zKSxcblx0XHRcdFx0Y29udGV4dElkOiB0aGlzLl9pZFxuXHRcdFx0fTtcblx0XHR9XG5cdFx0JG1hcmtOb3RpZmllZChwYXJhbXMpIHtcblx0XHRcdGNvbnN0IGNvbm5lY3Rpb24gPSB0aGlzLl9jb25uZWN0aW9uUmVnaXN0cnkucmVnaXN0ZXIoe1xuXHRcdFx0XHRsb2NhbENoYW5uZWw6IHBhcmFtcy5sb2NhbENoYW5uZWwsXG5cdFx0XHRcdHJlbW90ZUNoYW5uZWw6IHBhcmFtcy5yZW1vdGVDaGFubmVsLFxuXHRcdFx0XHRzZW5kZXI6IHBhcmFtcy5zZW5kZXIsXG5cdFx0XHRcdGRpcmVjdGlvbjogcGFyYW1zLmRpcmVjdGlvbixcblx0XHRcdFx0dHJhbnNwb3J0VHlwZTogcGFyYW1zLnRyYW5zcG9ydFR5cGVcblx0XHRcdH0pO1xuXHRcdFx0dGhpcy5fY29ubmVjdGlvblJlZ2lzdHJ5Lm1hcmtOb3RpZmllZChjb25uZWN0aW9uLCBwYXJhbXMucGF5bG9hZCk7XG5cdFx0fVxuXHRcdCRvYnNlcnZlU2lnbmFsKHBhcmFtcykge1xuXHRcdFx0Y29uc3QgZGlyZWN0aW9uID0gKHBhcmFtcy5wYXlsb2FkPy50eXBlID8/IFwibm90aWZ5XCIpID09PSBcImNvbm5lY3RcIiA/IFwiaW5jb21pbmdcIiA6IFwiaW5jb21pbmdcIjtcblx0XHRcdHRoaXMuJG1hcmtOb3RpZmllZCh7XG5cdFx0XHRcdGxvY2FsQ2hhbm5lbDogcGFyYW1zLmxvY2FsQ2hhbm5lbCxcblx0XHRcdFx0cmVtb3RlQ2hhbm5lbDogcGFyYW1zLnJlbW90ZUNoYW5uZWwsXG5cdFx0XHRcdHNlbmRlcjogcGFyYW1zLnNlbmRlcixcblx0XHRcdFx0ZGlyZWN0aW9uLFxuXHRcdFx0XHR0cmFuc3BvcnRUeXBlOiBwYXJhbXMudHJhbnNwb3J0VHlwZSxcblx0XHRcdFx0cGF5bG9hZDogcGFyYW1zLnBheWxvYWRcblx0XHRcdH0pO1xuXHRcdH1cblx0XHQkZm9yd2FyZFVuaWZpZWRDb25uZWN0aW9uRXZlbnQoY2hhbm5lbCwgZXZlbnQpIHtcblx0XHRcdGNvbnN0IG1hcHBlZFRyYW5zcG9ydFR5cGUgPSBldmVudC5jb25uZWN0aW9uLnRyYW5zcG9ydFR5cGUgPz8gXCJpbnRlcm5hbFwiO1xuXHRcdFx0Y29uc3QgY29ubmVjdGlvbiA9IHRoaXMuX2Nvbm5lY3Rpb25SZWdpc3RyeS5yZWdpc3Rlcih7XG5cdFx0XHRcdGxvY2FsQ2hhbm5lbDogZXZlbnQuY29ubmVjdGlvbi5sb2NhbENoYW5uZWwgfHwgY2hhbm5lbCxcblx0XHRcdFx0cmVtb3RlQ2hhbm5lbDogZXZlbnQuY29ubmVjdGlvbi5yZW1vdGVDaGFubmVsLFxuXHRcdFx0XHRzZW5kZXI6IGV2ZW50LmNvbm5lY3Rpb24uc2VuZGVyLFxuXHRcdFx0XHRkaXJlY3Rpb246IGV2ZW50LmNvbm5lY3Rpb24uZGlyZWN0aW9uLFxuXHRcdFx0XHR0cmFuc3BvcnRUeXBlOiBtYXBwZWRUcmFuc3BvcnRUeXBlLFxuXHRcdFx0XHRtZXRhZGF0YTogZXZlbnQuY29ubmVjdGlvbi5tZXRhZGF0YVxuXHRcdFx0fSk7XG5cdFx0XHRpZiAoZXZlbnQudHlwZSA9PT0gXCJub3RpZmllZFwiKSB0aGlzLl9jb25uZWN0aW9uUmVnaXN0cnkubWFya05vdGlmaWVkKGNvbm5lY3Rpb24sIGV2ZW50LnBheWxvYWQpO1xuXHRcdFx0ZWxzZSBpZiAoZXZlbnQudHlwZSA9PT0gXCJkaXNjb25uZWN0ZWRcIikgdGhpcy5fY29ubmVjdGlvblJlZ2lzdHJ5LmNsb3NlQnlDaGFubmVsKGV2ZW50LmNvbm5lY3Rpb24ubG9jYWxDaGFubmVsKTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBDbG9zZSBhIHNwZWNpZmljIGNoYW5uZWxcblx0XHQqL1xuXHRcdGNsb3NlQ2hhbm5lbChuYW1lKSB7XG5cdFx0XHRjb25zdCBlbmRwb2ludCA9IHRoaXMuX2VuZHBvaW50cy5nZXQobmFtZSk7XG5cdFx0XHRpZiAoIWVuZHBvaW50KSByZXR1cm4gZmFsc2U7XG5cdFx0XHRlbmRwb2ludC5zdWJzY3JpcHRpb25zLmZvckVhY2goKHMpID0+IHMudW5zdWJzY3JpYmUoKSk7XG5cdFx0XHRlbmRwb2ludC5oYW5kbGVyLmNsb3NlKCk7XG5cdFx0XHRlbmRwb2ludC50cmFuc3BvcnQ/LmRldGFjaCgpO1xuXHRcdFx0dGhpcy5fdW5pZmllZENvbm5lY3Rpb25TdWJzLmdldChuYW1lKT8udW5zdWJzY3JpYmUoKTtcblx0XHRcdHRoaXMuX3VuaWZpZWRDb25uZWN0aW9uU3Vicy5kZWxldGUobmFtZSk7XG5cdFx0XHR0aGlzLl91bmlmaWVkQnlDaGFubmVsLmRlbGV0ZShuYW1lKTtcblx0XHRcdHRoaXMuX2VuZHBvaW50cy5kZWxldGUobmFtZSk7XG5cdFx0XHRpZiAobmFtZSA9PT0gdGhpcy5faG9zdE5hbWUpIHRoaXMuX2hvc3QgPSBudWxsO1xuXHRcdFx0dGhpcy5fY29ubmVjdGlvblJlZ2lzdHJ5LmNsb3NlQnlDaGFubmVsKG5hbWUpO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogQ2xvc2UgYWxsIGNoYW5uZWxzIGFuZCBjbGVhbnVwXG5cdFx0Ki9cblx0XHRjbG9zZSgpIHtcblx0XHRcdGlmICh0aGlzLl9jbG9zZWQpIHJldHVybjtcblx0XHRcdHRoaXMuX2Nsb3NlZCA9IHRydWU7XG5cdFx0XHRmb3IgKGNvbnN0IFtuYW1lXSBvZiB0aGlzLl9lbmRwb2ludHMpIHRoaXMuY2xvc2VDaGFubmVsKG5hbWUpO1xuXHRcdFx0dGhpcy5fcmVtb3RlQ2hhbm5lbHMuY2xlYXIoKTtcblx0XHRcdHRoaXMuX2hvc3QgPSBudWxsO1xuXHRcdFx0dGhpcy5fdW5pZmllZENvbm5lY3Rpb25TdWJzLmZvckVhY2goKHN1YikgPT4gc3ViLnVuc3Vic2NyaWJlKCkpO1xuXHRcdFx0dGhpcy5fdW5pZmllZENvbm5lY3Rpb25TdWJzLmNsZWFyKCk7XG5cdFx0XHR0aGlzLl91bmlmaWVkQnlDaGFubmVsLmNsZWFyKCk7XG5cdFx0XHR0aGlzLl9jb25uZWN0aW9uUmVnaXN0cnkuY2xlYXIoKTtcblx0XHRcdHRoaXMuX2Nvbm5lY3Rpb25FdmVudHMuY29tcGxldGUoKTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBDaGVjayBpZiBjb250ZXh0IGlzIGNsb3NlZFxuXHRcdCovXG5cdFx0Z2V0IGNsb3NlZCgpIHtcblx0XHRcdHJldHVybiB0aGlzLl9jbG9zZWQ7XG5cdFx0fVxuXHRcdF9yZWdpc3RlclVuaWZpZWRDaGFubmVsKG5hbWUsIHVuaWZpZWQpIHtcblx0XHRcdHRoaXMuX3VuaWZpZWRCeUNoYW5uZWwuc2V0KG5hbWUsIHVuaWZpZWQpO1xuXHRcdFx0dGhpcy5fdW5pZmllZENvbm5lY3Rpb25TdWJzLmdldChuYW1lKT8udW5zdWJzY3JpYmUoKTtcblx0XHRcdGNvbnN0IHN1YnNjcmlwdGlvbiA9IHVuaWZpZWQuc3Vic2NyaWJlQ29ubmVjdGlvbnMoKGV2ZW50KSA9PiB7XG5cdFx0XHRcdHRoaXMuJGZvcndhcmRVbmlmaWVkQ29ubmVjdGlvbkV2ZW50KG5hbWUsIGV2ZW50KTtcblx0XHRcdH0pO1xuXHRcdFx0dGhpcy5fdW5pZmllZENvbm5lY3Rpb25TdWJzLnNldChuYW1lLCBzdWJzY3JpcHRpb24pO1xuXHRcdH1cblx0XHRfZW1pdENvbm5lY3Rpb25FdmVudChldmVudCkge1xuXHRcdFx0dGhpcy5fY29ubmVjdGlvbkV2ZW50cy5uZXh0KHtcblx0XHRcdFx0Li4uZXZlbnQsXG5cdFx0XHRcdGNvbm5lY3Rpb246IHtcblx0XHRcdFx0XHQuLi5ldmVudC5jb25uZWN0aW9uLFxuXHRcdFx0XHRcdGNvbnRleHRJZDogdGhpcy5faWRcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9O1xuXHRmdW5jdGlvbiBpc1JlZmxlY3RBY3Rpb24oYWN0aW9uKSB7XG5cdFx0cmV0dXJuIFsuLi5PYmplY3QudmFsdWVzKFdSZWZsZWN0QWN0aW9uKV0uaW5jbHVkZXMoYWN0aW9uKTtcblx0fVxuXHRmdW5jdGlvbiBub3JtYWxpemVUcmFuc3BvcnRCaW5kaW5nKHRhcmdldCkge1xuXHRcdGlmICghdGFyZ2V0KSByZXR1cm4gbnVsbDtcblx0XHRpZiAoaXNUcmFuc3BvcnRCaW5kaW5nKHRhcmdldCkpIHJldHVybiB0YXJnZXQ7XG5cdFx0Y29uc3QgbmF0aXZlVGFyZ2V0ID0gdGFyZ2V0O1xuXHRcdGNvbnN0IHRyYW5zcG9ydFR5cGUgPSBnZXREeW5hbWljVHJhbnNwb3J0VHlwZShuYXRpdmVUYXJnZXQpO1xuXHRcdHJldHVybiB7XG5cdFx0XHR0YXJnZXQ6IG5hdGl2ZVRhcmdldCxcblx0XHRcdHRhcmdldENoYW5uZWw6IFwidW5rbm93blwiLFxuXHRcdFx0dHJhbnNwb3J0VHlwZTogdHJhbnNwb3J0VHlwZSA9PT0gXCJpbnRlcm5hbFwiID8gXCJzZWxmXCIgOiB0cmFuc3BvcnRUeXBlLFxuXHRcdFx0c2VuZGVyOiAobWVzc2FnZSwgdHJhbnNmZXIpID0+IHtcblx0XHRcdFx0aWYgKHR5cGVvZiBXZWJTb2NrZXQgIT09IFwidW5kZWZpbmVkXCIgJiYgbmF0aXZlVGFyZ2V0IGluc3RhbmNlb2YgV2ViU29ja2V0KSB7XG5cdFx0XHRcdFx0bmF0aXZlVGFyZ2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkobWVzc2FnZSkpO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHRuYXRpdmVUYXJnZXQucG9zdE1lc3NhZ2U/LihtZXNzYWdlLCB0cmFuc2Zlcj8ubGVuZ3RoID8geyB0cmFuc2ZlciB9IDogdm9pZCAwKTtcblx0XHRcdH0sXG5cdFx0XHRwb3N0TWVzc2FnZTogKG1lc3NhZ2UsIG9wdGlvbnMpID0+IHtcblx0XHRcdFx0bmF0aXZlVGFyZ2V0LnBvc3RNZXNzYWdlPy4obWVzc2FnZSwgb3B0aW9ucyk7XG5cdFx0XHR9LFxuXHRcdFx0YWRkRXZlbnRMaXN0ZW5lcjogbmF0aXZlVGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXI/LmJpbmQobmF0aXZlVGFyZ2V0KSxcblx0XHRcdHJlbW92ZUV2ZW50TGlzdGVuZXI6IG5hdGl2ZVRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyPy5iaW5kKG5hdGl2ZVRhcmdldCksXG5cdFx0XHRzdGFydDogbmF0aXZlVGFyZ2V0LnN0YXJ0Py5iaW5kKG5hdGl2ZVRhcmdldCksXG5cdFx0XHRjbG9zZTogbmF0aXZlVGFyZ2V0LmNsb3NlPy5iaW5kKG5hdGl2ZVRhcmdldClcblx0XHR9O1xuXHR9XG5cdGZ1bmN0aW9uIGlzVHJhbnNwb3J0QmluZGluZyh2YWx1ZSkge1xuXHRcdHJldHVybiAhIXZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJiBcInRhcmdldFwiIGluIHZhbHVlICYmIHR5cGVvZiB2YWx1ZS5wb3N0TWVzc2FnZSA9PT0gXCJmdW5jdGlvblwiO1xuXHR9XG5cdGZ1bmN0aW9uIGdldER5bmFtaWNUcmFuc3BvcnRUeXBlKHRhcmdldCkge1xuXHRcdGNvbnN0IGVmZmVjdGl2ZVRhcmdldCA9IGlzVHJhbnNwb3J0QmluZGluZyh0YXJnZXQpID8gdGFyZ2V0LnRhcmdldCA6IHRhcmdldDtcblx0XHRpZiAoIWVmZmVjdGl2ZVRhcmdldCkgcmV0dXJuIFwiaW50ZXJuYWxcIjtcblx0XHRpZiAoZWZmZWN0aXZlVGFyZ2V0ID09PSBcImNocm9tZS1ydW50aW1lXCIpIHJldHVybiBcImNocm9tZS1ydW50aW1lXCI7XG5cdFx0aWYgKGVmZmVjdGl2ZVRhcmdldCA9PT0gXCJjaHJvbWUtdGFic1wiKSByZXR1cm4gXCJjaHJvbWUtdGFic1wiO1xuXHRcdGlmIChlZmZlY3RpdmVUYXJnZXQgPT09IFwiY2hyb21lLXBvcnRcIikgcmV0dXJuIFwiY2hyb21lLXBvcnRcIjtcblx0XHRpZiAoZWZmZWN0aXZlVGFyZ2V0ID09PSBcImNocm9tZS1leHRlcm5hbFwiKSByZXR1cm4gXCJjaHJvbWUtZXh0ZXJuYWxcIjtcblx0XHRpZiAodHlwZW9mIE1lc3NhZ2VQb3J0ICE9PSBcInVuZGVmaW5lZFwiICYmIGVmZmVjdGl2ZVRhcmdldCBpbnN0YW5jZW9mIE1lc3NhZ2VQb3J0KSByZXR1cm4gXCJtZXNzYWdlLXBvcnRcIjtcblx0XHRpZiAodHlwZW9mIEJyb2FkY2FzdENoYW5uZWwgIT09IFwidW5kZWZpbmVkXCIgJiYgZWZmZWN0aXZlVGFyZ2V0IGluc3RhbmNlb2YgQnJvYWRjYXN0Q2hhbm5lbCkgcmV0dXJuIFwiYnJvYWRjYXN0XCI7XG5cdFx0aWYgKHR5cGVvZiBXb3JrZXIgIT09IFwidW5kZWZpbmVkXCIgJiYgZWZmZWN0aXZlVGFyZ2V0IGluc3RhbmNlb2YgV29ya2VyKSByZXR1cm4gXCJ3b3JrZXJcIjtcblx0XHRpZiAodHlwZW9mIFdlYlNvY2tldCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBlZmZlY3RpdmVUYXJnZXQgaW5zdGFuY2VvZiBXZWJTb2NrZXQpIHJldHVybiBcIndlYnNvY2tldFwiO1xuXHRcdGlmICh0eXBlb2YgY2hyb21lICE9PSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiBlZmZlY3RpdmVUYXJnZXQgPT09IFwib2JqZWN0XCIgJiYgZWZmZWN0aXZlVGFyZ2V0ICYmIHR5cGVvZiBlZmZlY3RpdmVUYXJnZXQucG9zdE1lc3NhZ2UgPT09IFwiZnVuY3Rpb25cIiAmJiBlZmZlY3RpdmVUYXJnZXQub25NZXNzYWdlPy5hZGRMaXN0ZW5lcikgcmV0dXJuIFwiY2hyb21lLXBvcnRcIjtcblx0XHRpZiAodHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgJiYgZWZmZWN0aXZlVGFyZ2V0ID09PSBzZWxmKSByZXR1cm4gXCJzZWxmXCI7XG5cdFx0cmV0dXJuIFwiaW50ZXJuYWxcIjtcblx0fVxuXHRmdW5jdGlvbiBsb2FkV29ya2VyKFdYKSB7XG5cdFx0aWYgKFdYIGluc3RhbmNlb2YgV29ya2VyKSByZXR1cm4gV1g7XG5cdFx0aWYgKFdYIGluc3RhbmNlb2YgVVJMKSByZXR1cm4gbmV3IFdvcmtlcihXWC5ocmVmLCB7IHR5cGU6IFwibW9kdWxlXCIgfSk7XG5cdFx0aWYgKHR5cGVvZiBXWCA9PT0gXCJmdW5jdGlvblwiKSB0cnkge1xuXHRcdFx0cmV0dXJuIG5ldyBXWCh7IHR5cGU6IFwibW9kdWxlXCIgfSk7XG5cdFx0fSBjYXRjaCB7XG5cdFx0XHRyZXR1cm4gV1goeyB0eXBlOiBcIm1vZHVsZVwiIH0pO1xuXHRcdH1cblx0XHRpZiAodHlwZW9mIFdYID09PSBcInN0cmluZ1wiKSB7XG5cdFx0XHRpZiAoV1guc3RhcnRzV2l0aChcIi9cIikpIHJldHVybiBuZXcgV29ya2VyKHJlc29sdmVXb3JrZXJTcGVjaWZpZXJIcmVmKFdYLnJlcGxhY2UoL15cXC8vLCBcIi4vXCIpKSwgeyB0eXBlOiBcIm1vZHVsZVwiIH0pO1xuXHRcdFx0aWYgKFVSTC5jYW5QYXJzZShXWCkgfHwgV1guc3RhcnRzV2l0aChcIi4vXCIpKSByZXR1cm4gbmV3IFdvcmtlcihyZXNvbHZlV29ya2VyU3BlY2lmaWVySHJlZihXWCksIHsgdHlwZTogXCJtb2R1bGVcIiB9KTtcblx0XHRcdHJldHVybiBuZXcgV29ya2VyKFVSTC5jcmVhdGVPYmplY3RVUkwobmV3IEJsb2IoW1dYXSwgeyB0eXBlOiBcImFwcGxpY2F0aW9uL2phdmFzY3JpcHRcIiB9KSksIHsgdHlwZTogXCJtb2R1bGVcIiB9KTtcblx0XHR9XG5cdFx0aWYgKFdYIGluc3RhbmNlb2YgQmxvYiB8fCBXWCBpbnN0YW5jZW9mIEZpbGUpIHJldHVybiBuZXcgV29ya2VyKFVSTC5jcmVhdGVPYmplY3RVUkwoV1gpLCB7IHR5cGU6IFwibW9kdWxlXCIgfSk7XG5cdFx0cmV0dXJuIFdYID8/ICh0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiBudWxsKTtcblx0fVxuXHQvKiogR2xvYmFsIGNvbnRleHQgcmVnaXN0cnkgZm9yIHNoYXJlZCBjb250ZXh0cyAqL1xuXHRjb25zdCBDT05URVhUX1JFR0lTVFJZID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0LyoqXG5cdCogQ3JlYXRlIGEgbmV3IGNoYW5uZWwgY29udGV4dFxuXHQqXG5cdCogVXNlIHRoaXMgZm9yIGlzb2xhdGVkIGNoYW5uZWwgbWFuYWdlbWVudCBpbiBjb21wb25lbnRzXG5cdCovXG5cdGZ1bmN0aW9uIGNyZWF0ZUNoYW5uZWxDb250ZXh0KG9wdGlvbnMgPSB7fSkge1xuXHRcdGNvbnN0IGN0eCA9IG5ldyBDaGFubmVsQ29udGV4dChvcHRpb25zKTtcblx0XHRpZiAob3B0aW9ucy5uYW1lKSBDT05URVhUX1JFR0lTVFJZLnNldChvcHRpb25zLm5hbWUsIGN0eCk7XG5cdFx0cmV0dXJuIGN0eDtcblx0fVxuXG4vLyNlbmRyZWdpb25cbi8vI3JlZ2lvbiAuLi91bmlmb3JtLnRzL3NyYy9uZXdlci9uZXh0L3RyYW5zcG9ydC9Xb3JrZXIudHNcbi8qKlxuXHQqIFdvcmtlciBFbnRyeSBQb2ludCAtIE11bHRpLUNoYW5uZWwgU3VwcG9ydFxuXHQqXG5cdCogVGhpcyB3b3JrZXIgY29udGV4dCBzdXBwb3J0czpcblx0KiAtIE11bHRpcGxlIGNoYW5uZWwgY3JlYXRpb24vaW5pdGlhbGl6YXRpb25cblx0KiAtIE9ic2VydmluZyBuZXcgaW5jb21pbmcgY2hhbm5lbCBjb25uZWN0aW9uc1xuXHQqIC0gRHluYW1pYyBjaGFubmVsIGFkZGl0aW9uIGFmdGVyIGluaXRpYWxpemF0aW9uXG5cdCogLSBDb25uZWN0aW9uIGZyb20gcmVtb3RlL2hvc3QgY29udGV4dHNcblx0Ki9cblx0LyoqXG5cdCogV29ya2VyQ29udGV4dCAtIE1hbmFnZXMgY2hhbm5lbHMgd2l0aGluIGEgV29ya2VyXG5cdCpcblx0KiBTdXBwb3J0cyBvYnNlcnZpbmcgbmV3IGluY29taW5nIGNvbm5lY3Rpb25zIGZyb20gaG9zdC9yZW1vdGUgY29udGV4dHMuXG5cdCovXG5cdHZhciBXb3JrZXJDb250ZXh0ID0gY2xhc3Mge1xuXHRcdF9jb250ZXh0O1xuXHRcdF9jb25maWc7XG5cdFx0X3N1YnNjcmlwdGlvbnMgPSBbXTtcblx0XHRfaW5jb21pbmdDb25uZWN0aW9ucyA9IG5ldyBDaGFubmVsU3ViamVjdCh7IGJ1ZmZlclNpemU6IDEwMCB9KTtcblx0XHRfY2hhbm5lbENyZWF0ZWQgPSBuZXcgQ2hhbm5lbFN1YmplY3QoeyBidWZmZXJTaXplOiAxMDAgfSk7XG5cdFx0X2NoYW5uZWxDbG9zZWQgPSBuZXcgQ2hhbm5lbFN1YmplY3QoKTtcblx0XHRjb25zdHJ1Y3Rvcihjb25maWcgPSB7fSkge1xuXHRcdFx0dGhpcy5fY29uZmlnID0ge1xuXHRcdFx0XHRuYW1lOiBjb25maWcubmFtZSA/PyBcIndvcmtlclwiLFxuXHRcdFx0XHR3b3JrZXJOYW1lOiBjb25maWcud29ya2VyTmFtZSA/PyBgd29ya2VyLSR7VVVJRHY0KCkuc2xpY2UoMCwgOCl9YCxcblx0XHRcdFx0YXV0b0FjY2VwdENoYW5uZWxzOiBjb25maWcuYXV0b0FjY2VwdENoYW5uZWxzID8/IHRydWUsXG5cdFx0XHRcdGFsbG93ZWRDaGFubmVsczogY29uZmlnLmFsbG93ZWRDaGFubmVscyA/PyBbXSxcblx0XHRcdFx0bWF4Q2hhbm5lbHM6IGNvbmZpZy5tYXhDaGFubmVscyA/PyAxMDAsXG5cdFx0XHRcdGF1dG9Db25uZWN0OiBjb25maWcuYXV0b0Nvbm5lY3QgPz8gdHJ1ZSxcblx0XHRcdFx0dXNlR2xvYmFsU2VsZjogdHJ1ZSxcblx0XHRcdFx0ZGVmYXVsdE9wdGlvbnM6IGNvbmZpZy5kZWZhdWx0T3B0aW9ucyA/PyB7fSxcblx0XHRcdFx0aXNvbGF0ZWRTdG9yYWdlOiBjb25maWcuaXNvbGF0ZWRTdG9yYWdlID8/IGZhbHNlLFxuXHRcdFx0XHQuLi5jb25maWdcblx0XHRcdH07XG5cdFx0XHR0aGlzLl9jb250ZXh0ID0gY3JlYXRlQ2hhbm5lbENvbnRleHQoe1xuXHRcdFx0XHRuYW1lOiB0aGlzLl9jb25maWcubmFtZSxcblx0XHRcdFx0dXNlR2xvYmFsU2VsZjogdHJ1ZSxcblx0XHRcdFx0ZGVmYXVsdE9wdGlvbnM6IGNvbmZpZy5kZWZhdWx0T3B0aW9uc1xuXHRcdFx0fSk7XG5cdFx0XHR0aGlzLl9zZXR1cE1lc3NhZ2VMaXN0ZW5lcigpO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIE9ic2VydmFibGU6IE5ldyBpbmNvbWluZyBjb25uZWN0aW9uIHJlcXVlc3RzXG5cdFx0Ki9cblx0XHRnZXQgb25Db25uZWN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2luY29taW5nQ29ubmVjdGlvbnM7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogT2JzZXJ2YWJsZTogQ2hhbm5lbCBjcmVhdGVkIGV2ZW50c1xuXHRcdCovXG5cdFx0Z2V0IG9uQ2hhbm5lbENyZWF0ZWQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY2hhbm5lbENyZWF0ZWQ7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogT2JzZXJ2YWJsZTogQ2hhbm5lbCBjbG9zZWQgZXZlbnRzXG5cdFx0Ki9cblx0XHRnZXQgb25DaGFubmVsQ2xvc2VkKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2NoYW5uZWxDbG9zZWQ7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogU3Vic2NyaWJlIHRvIGluY29taW5nIGNvbm5lY3Rpb25zXG5cdFx0Ki9cblx0XHRzdWJzY3JpYmVDb25uZWN0aW9ucyhoYW5kbGVyKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5faW5jb21pbmdDb25uZWN0aW9ucy5zdWJzY3JpYmUoaGFuZGxlcik7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogU3Vic2NyaWJlIHRvIGNoYW5uZWwgY3JlYXRpb25cblx0XHQqL1xuXHRcdHN1YnNjcmliZUNoYW5uZWxDcmVhdGVkKGhhbmRsZXIpIHtcblx0XHRcdHJldHVybiB0aGlzLl9jaGFubmVsQ3JlYXRlZC5zdWJzY3JpYmUoaGFuZGxlcik7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogQWNjZXB0IGFuIGluY29taW5nIGNvbm5lY3Rpb24gYW5kIGNyZWF0ZSB0aGUgY2hhbm5lbFxuXHRcdCovXG5cdFx0YWNjZXB0Q29ubmVjdGlvbihjb25uZWN0aW9uKSB7XG5cdFx0XHRpZiAoIXRoaXMuX2NhbkFjY2VwdENoYW5uZWwoY29ubmVjdGlvbi5jaGFubmVsKSkgcmV0dXJuIG51bGw7XG5cdFx0XHRjb25zdCBlbmRwb2ludCA9IHRoaXMuX2NvbnRleHQuY3JlYXRlQ2hhbm5lbChjb25uZWN0aW9uLmNoYW5uZWwsIGNvbm5lY3Rpb24ub3B0aW9ucyk7XG5cdFx0XHRpZiAoY29ubmVjdGlvbi5wb3J0KSB7XG5cdFx0XHRcdGNvbm5lY3Rpb24ucG9ydC5zdGFydD8uKCk7XG5cdFx0XHRcdGVuZHBvaW50LmhhbmRsZXIuY3JlYXRlUmVtb3RlQ2hhbm5lbChjb25uZWN0aW9uLnNlbmRlciwgY29ubmVjdGlvbi5vcHRpb25zLCBjb25uZWN0aW9uLnBvcnQpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5fY2hhbm5lbENyZWF0ZWQubmV4dCh7XG5cdFx0XHRcdGNoYW5uZWw6IGNvbm5lY3Rpb24uY2hhbm5lbCxcblx0XHRcdFx0ZW5kcG9pbnQsXG5cdFx0XHRcdHNlbmRlcjogY29ubmVjdGlvbi5zZW5kZXIsXG5cdFx0XHRcdHRpbWVzdGFtcDogRGF0ZS5ub3coKVxuXHRcdFx0fSk7XG5cdFx0XHR0aGlzLl9wb3N0Q2hhbm5lbENyZWF0ZWQoY29ubmVjdGlvbi5jaGFubmVsLCBjb25uZWN0aW9uLnNlbmRlciwgY29ubmVjdGlvbi5pZCk7XG5cdFx0XHRyZXR1cm4gZW5kcG9pbnQ7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogQ3JlYXRlIGEgbmV3IGNoYW5uZWwgaW4gdGhpcyB3b3JrZXIgY29udGV4dFxuXHRcdCovXG5cdFx0Y3JlYXRlQ2hhbm5lbChuYW1lLCBvcHRpb25zKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY29udGV4dC5jcmVhdGVDaGFubmVsKG5hbWUsIG9wdGlvbnMpO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIEdldCBhbiBleGlzdGluZyBjaGFubmVsXG5cdFx0Ki9cblx0XHRnZXRDaGFubmVsKG5hbWUpIHtcblx0XHRcdHJldHVybiB0aGlzLl9jb250ZXh0LmdldENoYW5uZWwobmFtZSk7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogQ2hlY2sgaWYgY2hhbm5lbCBleGlzdHNcblx0XHQqL1xuXHRcdGhhc0NoYW5uZWwobmFtZSkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2NvbnRleHQuaGFzQ2hhbm5lbChuYW1lKTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBHZXQgYWxsIGNoYW5uZWwgbmFtZXNcblx0XHQqL1xuXHRcdGdldENoYW5uZWxOYW1lcygpIHtcblx0XHRcdHJldHVybiB0aGlzLl9jb250ZXh0LmdldENoYW5uZWxOYW1lcygpO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIFF1ZXJ5IGN1cnJlbnRseSB0cmFja2VkIGNoYW5uZWwgY29ubmVjdGlvbnMgaW4gdGhpcyB3b3JrZXIuXG5cdFx0Ki9cblx0XHRxdWVyeUNvbm5lY3Rpb25zKHF1ZXJ5ID0ge30pIHtcblx0XHRcdHJldHVybiB0aGlzLl9jb250ZXh0LnF1ZXJ5Q29ubmVjdGlvbnMocXVlcnkpO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIE5vdGlmeSBhY3RpdmUgY29ubmVjdGlvbnMgKHVzZWZ1bCBmb3Igd29ya2VyPC0+aG9zdCBzeW5jKS5cblx0XHQqL1xuXHRcdG5vdGlmeUNvbm5lY3Rpb25zKHBheWxvYWQgPSB7fSwgcXVlcnkgPSB7fSkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2NvbnRleHQubm90aWZ5Q29ubmVjdGlvbnMocGF5bG9hZCwgcXVlcnkpO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIENsb3NlIGEgc3BlY2lmaWMgY2hhbm5lbFxuXHRcdCovXG5cdFx0Y2xvc2VDaGFubmVsKG5hbWUpIHtcblx0XHRcdGNvbnN0IGNsb3NlZCA9IHRoaXMuX2NvbnRleHQuY2xvc2VDaGFubmVsKG5hbWUpO1xuXHRcdFx0aWYgKGNsb3NlZCkgdGhpcy5fY2hhbm5lbENsb3NlZC5uZXh0KHtcblx0XHRcdFx0Y2hhbm5lbDogbmFtZSxcblx0XHRcdFx0dGltZXN0YW1wOiBEYXRlLm5vdygpXG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBjbG9zZWQ7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogR2V0IHRoZSB1bmRlcmx5aW5nIGNvbnRleHRcblx0XHQqL1xuXHRcdGdldCBjb250ZXh0KCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2NvbnRleHQ7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogR2V0IHdvcmtlciBjb25maWd1cmF0aW9uXG5cdFx0Ki9cblx0XHRnZXQgY29uZmlnKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2NvbmZpZztcblx0XHR9XG5cdFx0X3NldHVwTWVzc2FnZUxpc3RlbmVyKCkge1xuXHRcdFx0YWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgKChldmVudCkgPT4ge1xuXHRcdFx0XHR0aGlzLl9oYW5kbGVJbmNvbWluZ01lc3NhZ2UoZXZlbnQpO1xuXHRcdFx0fSkpO1xuXHRcdH1cblx0XHRfaGFuZGxlSW5jb21pbmdNZXNzYWdlKGV2ZW50KSB7XG5cdFx0XHRjb25zdCBkYXRhID0gZXZlbnQuZGF0YTtcblx0XHRcdGlmICghZGF0YSB8fCB0eXBlb2YgZGF0YSAhPT0gXCJvYmplY3RcIikgcmV0dXJuO1xuXHRcdFx0c3dpdGNoIChkYXRhLnR5cGUpIHtcblx0XHRcdFx0Y2FzZSBcImNyZWF0ZUNoYW5uZWxcIjpcblx0XHRcdFx0XHR0aGlzLl9oYW5kbGVDcmVhdGVDaGFubmVsKGRhdGEpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwiY29ubmVjdENoYW5uZWxcIjpcblx0XHRcdFx0XHR0aGlzLl9oYW5kbGVDb25uZWN0Q2hhbm5lbChkYXRhKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcImFkZFBvcnRcIjpcblx0XHRcdFx0XHR0aGlzLl9oYW5kbGVBZGRQb3J0KGRhdGEpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwibGlzdENoYW5uZWxzXCI6XG5cdFx0XHRcdFx0dGhpcy5faGFuZGxlTGlzdENoYW5uZWxzKGRhdGEpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwiY2xvc2VDaGFubmVsXCI6XG5cdFx0XHRcdFx0dGhpcy5faGFuZGxlQ2xvc2VDaGFubmVsKGRhdGEpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwicGluZ1wiOlxuXHRcdFx0XHRcdHBvc3RNZXNzYWdlKHtcblx0XHRcdFx0XHRcdHR5cGU6IFwicG9uZ1wiLFxuXHRcdFx0XHRcdFx0aWQ6IGRhdGEuaWQsXG5cdFx0XHRcdFx0XHR0aW1lc3RhbXA6IERhdGUubm93KClcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0ZGVmYXVsdDogaWYgKGRhdGEuY2hhbm5lbCAmJiB0aGlzLl9jb250ZXh0Lmhhc0NoYW5uZWwoZGF0YS5jaGFubmVsKSkgKHRoaXMuX2NvbnRleHQuZ2V0Q2hhbm5lbChkYXRhLmNoYW5uZWwpPy5oYW5kbGVyKT8uaGFuZGxlQW5kUmVzcG9uc2U/LihkYXRhLnBheWxvYWQsIGRhdGEucmVxSWQpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRfaGFuZGxlQ3JlYXRlQ2hhbm5lbChkYXRhKSB7XG5cdFx0XHRjb25zdCBjb25uZWN0aW9uID0ge1xuXHRcdFx0XHRpZDogZGF0YS5yZXFJZCA/PyBVVUlEdjQoKSxcblx0XHRcdFx0Y2hhbm5lbDogZGF0YS5jaGFubmVsLFxuXHRcdFx0XHRzZW5kZXI6IGRhdGEuc2VuZGVyID8/IFwidW5rbm93blwiLFxuXHRcdFx0XHR0eXBlOiBcImNoYW5uZWxcIixcblx0XHRcdFx0cG9ydDogZGF0YS5tZXNzYWdlUG9ydCxcblx0XHRcdFx0dGltZXN0YW1wOiBEYXRlLm5vdygpLFxuXHRcdFx0XHRvcHRpb25zOiBkYXRhLm9wdGlvbnNcblx0XHRcdH07XG5cdFx0XHR0aGlzLl9pbmNvbWluZ0Nvbm5lY3Rpb25zLm5leHQoY29ubmVjdGlvbik7XG5cdFx0XHRpZiAodGhpcy5fY29uZmlnLmF1dG9BY2NlcHRDaGFubmVscykgdGhpcy5hY2NlcHRDb25uZWN0aW9uKGNvbm5lY3Rpb24pO1xuXHRcdH1cblx0XHRfaGFuZGxlQ29ubmVjdENoYW5uZWwoZGF0YSkge1xuXHRcdFx0Y29uc3QgY29ubmVjdGlvbiA9IHtcblx0XHRcdFx0aWQ6IGRhdGEucmVxSWQgPz8gVVVJRHY0KCksXG5cdFx0XHRcdGNoYW5uZWw6IGRhdGEuY2hhbm5lbCxcblx0XHRcdFx0c2VuZGVyOiBkYXRhLnNlbmRlciA/PyBcInVua25vd25cIixcblx0XHRcdFx0dHlwZTogZGF0YS5wb3J0VHlwZSA/PyBcImNoYW5uZWxcIixcblx0XHRcdFx0cG9ydDogZGF0YS5wb3J0LFxuXHRcdFx0XHR0aW1lc3RhbXA6IERhdGUubm93KCksXG5cdFx0XHRcdG9wdGlvbnM6IGRhdGEub3B0aW9uc1xuXHRcdFx0fTtcblx0XHRcdHRoaXMuX2luY29taW5nQ29ubmVjdGlvbnMubmV4dChjb25uZWN0aW9uKTtcblx0XHRcdGlmICh0aGlzLl9jb25maWcuYXV0b0FjY2VwdENoYW5uZWxzICYmIHRoaXMuX2NhbkFjY2VwdENoYW5uZWwoZGF0YS5jaGFubmVsKSkge1xuXHRcdFx0XHRjb25zdCBlbmRwb2ludCA9IHRoaXMuX2NvbnRleHQuZ2V0T3JDcmVhdGVDaGFubmVsKGRhdGEuY2hhbm5lbCwgZGF0YS5vcHRpb25zKTtcblx0XHRcdFx0aWYgKGRhdGEucG9ydCkge1xuXHRcdFx0XHRcdGRhdGEucG9ydC5zdGFydD8uKCk7XG5cdFx0XHRcdFx0ZW5kcG9pbnQuaGFuZGxlci5jcmVhdGVSZW1vdGVDaGFubmVsKGRhdGEuc2VuZGVyLCBkYXRhLm9wdGlvbnMsIGRhdGEucG9ydCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cG9zdE1lc3NhZ2Uoe1xuXHRcdFx0XHRcdHR5cGU6IFwiY2hhbm5lbENvbm5lY3RlZFwiLFxuXHRcdFx0XHRcdGNoYW5uZWw6IGRhdGEuY2hhbm5lbCxcblx0XHRcdFx0XHRyZXFJZDogZGF0YS5yZXFJZFxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9XG5cdFx0X2hhbmRsZUFkZFBvcnQoZGF0YSkge1xuXHRcdFx0aWYgKCFkYXRhLnBvcnQgfHwgIWRhdGEuY2hhbm5lbCkgcmV0dXJuO1xuXHRcdFx0Y29uc3QgY29ubmVjdGlvbiA9IHtcblx0XHRcdFx0aWQ6IGRhdGEucmVxSWQgPz8gVVVJRHY0KCksXG5cdFx0XHRcdGNoYW5uZWw6IGRhdGEuY2hhbm5lbCxcblx0XHRcdFx0c2VuZGVyOiBkYXRhLnNlbmRlciA/PyBcInVua25vd25cIixcblx0XHRcdFx0dHlwZTogXCJwb3J0XCIsXG5cdFx0XHRcdHBvcnQ6IGRhdGEucG9ydCxcblx0XHRcdFx0dGltZXN0YW1wOiBEYXRlLm5vdygpLFxuXHRcdFx0XHRvcHRpb25zOiBkYXRhLm9wdGlvbnNcblx0XHRcdH07XG5cdFx0XHR0aGlzLl9pbmNvbWluZ0Nvbm5lY3Rpb25zLm5leHQoY29ubmVjdGlvbik7XG5cdFx0XHRpZiAodGhpcy5fY29uZmlnLmF1dG9BY2NlcHRDaGFubmVscykgdGhpcy5hY2NlcHRDb25uZWN0aW9uKGNvbm5lY3Rpb24pO1xuXHRcdH1cblx0XHRfaGFuZGxlTGlzdENoYW5uZWxzKGRhdGEpIHtcblx0XHRcdHBvc3RNZXNzYWdlKHtcblx0XHRcdFx0dHlwZTogXCJjaGFubmVsTGlzdFwiLFxuXHRcdFx0XHRjaGFubmVsczogdGhpcy5nZXRDaGFubmVsTmFtZXMoKSxcblx0XHRcdFx0cmVxSWQ6IGRhdGEucmVxSWRcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRfaGFuZGxlQ2xvc2VDaGFubmVsKGRhdGEpIHtcblx0XHRcdGlmIChkYXRhLmNoYW5uZWwpIHtcblx0XHRcdFx0dGhpcy5jbG9zZUNoYW5uZWwoZGF0YS5jaGFubmVsKTtcblx0XHRcdFx0cG9zdE1lc3NhZ2Uoe1xuXHRcdFx0XHRcdHR5cGU6IFwiY2hhbm5lbENsb3NlZFwiLFxuXHRcdFx0XHRcdGNoYW5uZWw6IGRhdGEuY2hhbm5lbCxcblx0XHRcdFx0XHRyZXFJZDogZGF0YS5yZXFJZFxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9XG5cdFx0X2NhbkFjY2VwdENoYW5uZWwoY2hhbm5lbCkge1xuXHRcdFx0aWYgKHRoaXMuX2NvbnRleHQuc2l6ZSA+PSB0aGlzLl9jb25maWcubWF4Q2hhbm5lbHMpIHJldHVybiBmYWxzZTtcblx0XHRcdGlmICh0aGlzLl9jb25maWcuYWxsb3dlZENoYW5uZWxzLmxlbmd0aCA+IDApIHJldHVybiB0aGlzLl9jb25maWcuYWxsb3dlZENoYW5uZWxzLmluY2x1ZGVzKGNoYW5uZWwpO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdF9wb3N0Q2hhbm5lbENyZWF0ZWQoY2hhbm5lbCwgc2VuZGVyLCByZXFJZCkge1xuXHRcdFx0cG9zdE1lc3NhZ2Uoe1xuXHRcdFx0XHR0eXBlOiBcImNoYW5uZWxDcmVhdGVkXCIsXG5cdFx0XHRcdGNoYW5uZWwsXG5cdFx0XHRcdHNlbmRlcixcblx0XHRcdFx0cmVxSWQsXG5cdFx0XHRcdHRpbWVzdGFtcDogRGF0ZS5ub3coKVxuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdGNsb3NlKCkge1xuXHRcdFx0dGhpcy5fc3Vic2NyaXB0aW9ucy5mb3JFYWNoKChzKSA9PiBzLnVuc3Vic2NyaWJlKCkpO1xuXHRcdFx0dGhpcy5fc3Vic2NyaXB0aW9ucyA9IFtdO1xuXHRcdFx0dGhpcy5faW5jb21pbmdDb25uZWN0aW9ucy5jb21wbGV0ZSgpO1xuXHRcdFx0dGhpcy5fY2hhbm5lbENyZWF0ZWQuY29tcGxldGUoKTtcblx0XHRcdHRoaXMuX2NoYW5uZWxDbG9zZWQuY29tcGxldGUoKTtcblx0XHRcdHRoaXMuX2NvbnRleHQuY2xvc2UoKTtcblx0XHR9XG5cdH07XG5cdGxldCBXT1JLRVJfQ09OVEVYVCA9IG51bGw7XG5cdC8qKlxuXHQqIEdldCBvciBjcmVhdGUgdGhlIHdvcmtlciBjb250ZXh0IHNpbmdsZXRvblxuXHQqL1xuXHRmdW5jdGlvbiBnZXRXb3JrZXJDb250ZXh0KGNvbmZpZykge1xuXHRcdGlmICghV09SS0VSX0NPTlRFWFQpIFdPUktFUl9DT05URVhUID0gbmV3IFdvcmtlckNvbnRleHQoY29uZmlnKTtcblx0XHRyZXR1cm4gV09SS0VSX0NPTlRFWFQ7XG5cdH1cblx0Y29uc3QgY3R4ID0gZ2V0V29ya2VyQ29udGV4dCh7IG5hbWU6IFwid29ya2VyXCIgfSk7XG5cbi8vI2VuZHJlZ2lvblxuLy8jcmVnaW9uIC4uL3VuaWZvcm0udHMvc3JjL25ld2VyL25leHQvdHJhbnNwb3J0L1BvcnRUcmFuc3BvcnQudHNcbi8qKlxuXHQqIE1lc3NhZ2VQb3J0L01lc3NhZ2VDaGFubmVsIEVuaGFuY2VkIFRyYW5zcG9ydFxuXHQqXG5cdCogQWR2YW5jZWQgcG9ydC1iYXNlZCBjb21tdW5pY2F0aW9uIHdpdGg6XG5cdCogLSBNZXNzYWdlQ2hhbm5lbCBwYWlyIGNyZWF0aW9uXG5cdCogLSBQb3J0IHBvb2xpbmcgYW5kIG1hbmFnZW1lbnRcblx0KiAtIENyb3NzLWNvbnRleHQgdHJhbnNmZXIgKGlmcmFtZSwgd29ya2VyLCB3aW5kb3cpXG5cdCogLSBBdXRvbWF0aWMgcmVjb25uZWN0aW9uXG5cdCogLSBSZXF1ZXN0L3Jlc3BvbnNlIHdpdGggdGltZW91dFxuXHQqL1xuXHR2YXIgUG9ydFRyYW5zcG9ydCA9IGNsYXNzIHtcblx0XHRfY2hhbm5lbE5hbWU7XG5cdFx0X2NvbmZpZztcblx0XHRfcG9ydDtcblx0XHRfc3VicyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCk7XG5cdFx0X3BlbmRpbmcgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuXHRcdF9saXN0ZW5pbmcgPSBmYWxzZTtcblx0XHRfY2xlYW51cCA9IG51bGw7XG5cdFx0X3BvcnRJZCA9IFVVSUR2NCgpO1xuXHRcdF9zdGF0ZSA9IG5ldyBDaGFubmVsU3ViamVjdCgpO1xuXHRcdF9rZWVwQWxpdmVUaW1lciA9IG51bGw7XG5cdFx0Y29uc3RydWN0b3IocG9ydCwgX2NoYW5uZWxOYW1lLCBfY29uZmlnID0ge30pIHtcblx0XHRcdHRoaXMuX2NoYW5uZWxOYW1lID0gX2NoYW5uZWxOYW1lO1xuXHRcdFx0dGhpcy5fY29uZmlnID0gX2NvbmZpZztcblx0XHRcdHRoaXMuX3BvcnQgPSBwb3J0O1xuXHRcdFx0dGhpcy5fc2V0dXBQb3J0KCk7XG5cdFx0XHRpZiAoX2NvbmZpZy5hdXRvU3RhcnQgIT09IGZhbHNlKSB0aGlzLnN0YXJ0KCk7XG5cdFx0fVxuXHRcdF9zZXR1cFBvcnQoKSB7XG5cdFx0XHRjb25zdCBtc2dIYW5kbGVyID0gKGUpID0+IHtcblx0XHRcdFx0Y29uc3QgZGF0YSA9IGUuZGF0YTtcblx0XHRcdFx0aWYgKGRhdGEudHlwZSA9PT0gXCJyZXNwb25zZVwiICYmIGRhdGEucmVxSWQpIHtcblx0XHRcdFx0XHRjb25zdCBwID0gdGhpcy5fcGVuZGluZy5nZXQoZGF0YS5yZXFJZCk7XG5cdFx0XHRcdFx0aWYgKHApIHtcblx0XHRcdFx0XHRcdHRoaXMuX3BlbmRpbmcuZGVsZXRlKGRhdGEucmVxSWQpO1xuXHRcdFx0XHRcdFx0aWYgKGRhdGEucGF5bG9hZD8uZXJyb3IpIHAucmVqZWN0KG5ldyBFcnJvcihkYXRhLnBheWxvYWQuZXJyb3IpKTtcblx0XHRcdFx0XHRcdGVsc2UgcC5yZXNvbHZlKGRhdGEucGF5bG9hZD8ucmVzdWx0ID8/IGRhdGEucGF5bG9hZCk7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChkYXRhLnR5cGUgPT09IFwic2lnbmFsXCIgJiYgZGF0YS5wYXlsb2FkPy5hY3Rpb24gPT09IFwicGluZ1wiKSB7XG5cdFx0XHRcdFx0dGhpcy5zZW5kKHtcblx0XHRcdFx0XHRcdGlkOiBVVUlEdjQoKSxcblx0XHRcdFx0XHRcdGNoYW5uZWw6IHRoaXMuX2NoYW5uZWxOYW1lLFxuXHRcdFx0XHRcdFx0c2VuZGVyOiB0aGlzLl9wb3J0SWQsXG5cdFx0XHRcdFx0XHR0eXBlOiBcInNpZ25hbFwiLFxuXHRcdFx0XHRcdFx0cGF5bG9hZDogeyBhY3Rpb246IFwicG9uZ1wiIH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0ZGF0YS5wb3J0SWQgPSBkYXRhLnBvcnRJZCA/PyB0aGlzLl9wb3J0SWQ7XG5cdFx0XHRcdGZvciAoY29uc3QgcyBvZiB0aGlzLl9zdWJzKSB0cnkge1xuXHRcdFx0XHRcdHMubmV4dD8uKGRhdGEpO1xuXHRcdFx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRcdFx0cy5lcnJvcj8uKGUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdFx0Y29uc3QgZXJySGFuZGxlciA9ICgpID0+IHtcblx0XHRcdFx0dGhpcy5fc3RhdGUubmV4dChcImVycm9yXCIpO1xuXHRcdFx0XHRjb25zdCBlcnIgPSAvKiBAX19QVVJFX18gKi8gbmV3IEVycm9yKFwiUG9ydCBlcnJvclwiKTtcblx0XHRcdFx0Zm9yIChjb25zdCBzIG9mIHRoaXMuX3N1YnMpIHMuZXJyb3I/LihlcnIpO1xuXHRcdFx0fTtcblx0XHRcdHRoaXMuX3BvcnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgbXNnSGFuZGxlcik7XG5cdFx0XHR0aGlzLl9wb3J0LmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlZXJyb3JcIiwgZXJySGFuZGxlcik7XG5cdFx0XHR0aGlzLl9jbGVhbnVwID0gKCkgPT4ge1xuXHRcdFx0XHR0aGlzLl9wb3J0LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIG1zZ0hhbmRsZXIpO1xuXHRcdFx0XHR0aGlzLl9wb3J0LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlZXJyb3JcIiwgZXJySGFuZGxlcik7XG5cdFx0XHR9O1xuXHRcdH1cblx0XHRzdGFydCgpIHtcblx0XHRcdGlmICh0aGlzLl9saXN0ZW5pbmcpIHJldHVybjtcblx0XHRcdHRoaXMuX3BvcnQuc3RhcnQoKTtcblx0XHRcdHRoaXMuX2xpc3RlbmluZyA9IHRydWU7XG5cdFx0XHR0aGlzLl9zdGF0ZS5uZXh0KFwicmVhZHlcIik7XG5cdFx0XHRpZiAodGhpcy5fY29uZmlnLmtlZXBBbGl2ZSkgdGhpcy5fc3RhcnRLZWVwQWxpdmUoKTtcblx0XHR9XG5cdFx0c2VuZChtc2csIHRyYW5zZmVyKSB7XG5cdFx0XHRjb25zdCB7IHRyYW5zZmVyYWJsZSwgLi4uZGF0YSB9ID0gbXNnO1xuXHRcdFx0dGhpcy5fcG9ydC5wb3N0TWVzc2FnZSh7XG5cdFx0XHRcdC4uLmRhdGEsXG5cdFx0XHRcdHBvcnRJZDogdGhpcy5fcG9ydElkXG5cdFx0XHR9LCB0cmFuc2ZlciA/PyBbXSk7XG5cdFx0fVxuXHRcdHJlcXVlc3QobXNnKSB7XG5cdFx0XHRjb25zdCByZXFJZCA9IG1zZy5yZXFJZCA/PyBVVUlEdjQoKTtcblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHRcdGNvbnN0IHRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFx0XHR0aGlzLl9wZW5kaW5nLmRlbGV0ZShyZXFJZCk7XG5cdFx0XHRcdFx0cmVqZWN0KC8qIEBfX1BVUkVfXyAqLyBuZXcgRXJyb3IoXCJSZXF1ZXN0IHRpbWVvdXRcIikpO1xuXHRcdFx0XHR9LCB0aGlzLl9jb25maWcudGltZW91dCA/PyAzZTQpO1xuXHRcdFx0XHR0aGlzLl9wZW5kaW5nLnNldChyZXFJZCwge1xuXHRcdFx0XHRcdHJlc29sdmU6ICh2KSA9PiB7XG5cdFx0XHRcdFx0XHRjbGVhclRpbWVvdXQodGltZW91dCk7XG5cdFx0XHRcdFx0XHRyZXNvbHZlKHYpO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0cmVqZWN0OiAoZSkgPT4ge1xuXHRcdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuXHRcdFx0XHRcdFx0cmVqZWN0KGUpO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0dGltZXN0YW1wOiBEYXRlLm5vdygpXG5cdFx0XHRcdH0pO1xuXHRcdFx0XHR0aGlzLnNlbmQoe1xuXHRcdFx0XHRcdC4uLm1zZyxcblx0XHRcdFx0XHRyZXFJZCxcblx0XHRcdFx0XHR0eXBlOiBcInJlcXVlc3RcIlxuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRzdWJzY3JpYmUob2JzZXJ2ZXIpIHtcblx0XHRcdGNvbnN0IG9icyA9IHR5cGVvZiBvYnNlcnZlciA9PT0gXCJmdW5jdGlvblwiID8geyBuZXh0OiBvYnNlcnZlciB9IDogb2JzZXJ2ZXI7XG5cdFx0XHR0aGlzLl9zdWJzLmFkZChvYnMpO1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0Y2xvc2VkOiBmYWxzZSxcblx0XHRcdFx0dW5zdWJzY3JpYmU6ICgpID0+IHtcblx0XHRcdFx0XHR0aGlzLl9zdWJzLmRlbGV0ZShvYnMpO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdH1cblx0XHRfc3RhcnRLZWVwQWxpdmUoKSB7XG5cdFx0XHR0aGlzLl9rZWVwQWxpdmVUaW1lciA9IHNldEludGVydmFsKCgpID0+IHtcblx0XHRcdFx0dGhpcy5zZW5kKHtcblx0XHRcdFx0XHRpZDogVVVJRHY0KCksXG5cdFx0XHRcdFx0Y2hhbm5lbDogdGhpcy5fY2hhbm5lbE5hbWUsXG5cdFx0XHRcdFx0c2VuZGVyOiB0aGlzLl9wb3J0SWQsXG5cdFx0XHRcdFx0dHlwZTogXCJzaWduYWxcIixcblx0XHRcdFx0XHRwYXlsb2FkOiB7IGFjdGlvbjogXCJwaW5nXCIgfVxuXHRcdFx0XHR9KTtcblx0XHRcdH0sIHRoaXMuX2NvbmZpZy5rZWVwQWxpdmVJbnRlcnZhbCA/PyAzZTQpO1xuXHRcdH1cblx0XHRjbG9zZSgpIHtcblx0XHRcdGlmICh0aGlzLl9rZWVwQWxpdmVUaW1lcikge1xuXHRcdFx0XHRjbGVhckludGVydmFsKHRoaXMuX2tlZXBBbGl2ZVRpbWVyKTtcblx0XHRcdFx0dGhpcy5fa2VlcEFsaXZlVGltZXIgPSBudWxsO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5fY2xlYW51cD8uKCk7XG5cdFx0XHR0aGlzLl9zdWJzLmZvckVhY2goKHMpID0+IHMuY29tcGxldGU/LigpKTtcblx0XHRcdHRoaXMuX3N1YnMuY2xlYXIoKTtcblx0XHRcdHRoaXMuX3BvcnQuY2xvc2UoKTtcblx0XHRcdHRoaXMuX3N0YXRlLm5leHQoXCJjbG9zZWRcIik7XG5cdFx0fVxuXHRcdGdldCBwb3J0KCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX3BvcnQ7XG5cdFx0fVxuXHRcdGdldCBwb3J0SWQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fcG9ydElkO1xuXHRcdH1cblx0XHRnZXQgaXNMaXN0ZW5pbmcoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fbGlzdGVuaW5nO1xuXHRcdH1cblx0XHRnZXQgc3RhdGUoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fc3RhdGU7XG5cdFx0fVxuXHRcdGdldCBjaGFubmVsTmFtZSgpIHtcblx0XHRcdHJldHVybiB0aGlzLl9jaGFubmVsTmFtZTtcblx0XHR9XG5cdH07XG5cdC8qKlxuXHQqIENyZWF0ZSBhIE1lc3NhZ2VDaGFubmVsIHBhaXIgd2l0aCBjb25maWd1cmVkIGxvY2FsIHRyYW5zcG9ydFxuXHQqL1xuXHRmdW5jdGlvbiBjcmVhdGVDaGFubmVsUGFpcihjaGFubmVsTmFtZSwgY29uZmlnKSB7XG5cdFx0Y29uc3QgY2hhbm5lbCA9IG5ldyBNZXNzYWdlQ2hhbm5lbCgpO1xuXHRcdHJldHVybiB7XG5cdFx0XHRsb2NhbDogbmV3IFBvcnRUcmFuc3BvcnQoY2hhbm5lbC5wb3J0MSwgY2hhbm5lbE5hbWUsIGNvbmZpZyksXG5cdFx0XHRyZW1vdGU6IGNoYW5uZWwucG9ydDIsXG5cdFx0XHR0cmFuc2ZlcjogKCkgPT4ge1xuXHRcdFx0XHRyZXR1cm4gY2hhbm5lbC5wb3J0Mjtcblx0XHRcdH1cblx0XHR9O1xuXHR9XG5cdHZhciBQb3J0UG9vbCA9IGNsYXNzIHtcblx0XHRfZGVmYXVsdENvbmZpZztcblx0XHRfY2hhbm5lbHMgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuXHRcdF9tYWluUG9ydCA9IG51bGw7XG5cdFx0X3N1YnMgPSAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpO1xuXHRcdGNvbnN0cnVjdG9yKF9kZWZhdWx0Q29uZmlnID0ge30pIHtcblx0XHRcdHRoaXMuX2RlZmF1bHRDb25maWcgPSBfZGVmYXVsdENvbmZpZztcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBDcmVhdGUgbmV3IGNoYW5uZWwgaW4gcG9vbFxuXHRcdCovXG5cdFx0Y3JlYXRlKGNoYW5uZWxOYW1lLCBjb25maWcpIHtcblx0XHRcdGNvbnN0IHJlc3VsdCA9IGNyZWF0ZUNoYW5uZWxQYWlyKGNoYW5uZWxOYW1lLCB7XG5cdFx0XHRcdC4uLnRoaXMuX2RlZmF1bHRDb25maWcsXG5cdFx0XHRcdC4uLmNvbmZpZ1xuXHRcdFx0fSk7XG5cdFx0XHRyZXN1bHQubG9jYWwuc3Vic2NyaWJlKHsgbmV4dDogKG1zZykgPT4ge1xuXHRcdFx0XHRmb3IgKGNvbnN0IHMgb2YgdGhpcy5fc3VicykgdHJ5IHtcblx0XHRcdFx0XHRzLm5leHQ/Lihtc2cpO1xuXHRcdFx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRcdFx0cy5lcnJvcj8uKGUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IH0pO1xuXHRcdFx0dGhpcy5fY2hhbm5lbHMuc2V0KGNoYW5uZWxOYW1lLCByZXN1bHQubG9jYWwpO1xuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBBZGQgZXhpc3RpbmcgcG9ydCB0byBwb29sXG5cdFx0Ki9cblx0XHRhZGQoY2hhbm5lbE5hbWUsIHBvcnQsIGNvbmZpZykge1xuXHRcdFx0Y29uc3QgdHJhbnNwb3J0ID0gbmV3IFBvcnRUcmFuc3BvcnQocG9ydCwgY2hhbm5lbE5hbWUsIHtcblx0XHRcdFx0Li4udGhpcy5fZGVmYXVsdENvbmZpZyxcblx0XHRcdFx0Li4uY29uZmlnXG5cdFx0XHR9KTtcblx0XHRcdHRyYW5zcG9ydC5zdWJzY3JpYmUoeyBuZXh0OiAobXNnKSA9PiB7XG5cdFx0XHRcdGZvciAoY29uc3QgcyBvZiB0aGlzLl9zdWJzKSB0cnkge1xuXHRcdFx0XHRcdHMubmV4dD8uKG1zZyk7XG5cdFx0XHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdFx0XHRzLmVycm9yPy4oZSk7XG5cdFx0XHRcdH1cblx0XHRcdH0gfSk7XG5cdFx0XHR0aGlzLl9jaGFubmVscy5zZXQoY2hhbm5lbE5hbWUsIHRyYW5zcG9ydCk7XG5cdFx0XHRyZXR1cm4gdHJhbnNwb3J0O1xuXHRcdH1cblx0XHQvKipcblx0XHQqIEdldCBjaGFubmVsIGJ5IG5hbWVcblx0XHQqL1xuXHRcdGdldChjaGFubmVsTmFtZSkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2NoYW5uZWxzLmdldChjaGFubmVsTmFtZSk7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogU2VuZCB0byBzcGVjaWZpYyBjaGFubmVsXG5cdFx0Ki9cblx0XHRzZW5kKGNoYW5uZWxOYW1lLCBtc2csIHRyYW5zZmVyKSB7XG5cdFx0XHR0aGlzLl9jaGFubmVscy5nZXQoY2hhbm5lbE5hbWUpPy5zZW5kKG1zZywgdHJhbnNmZXIpO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIEJyb2FkY2FzdCB0byBhbGwgY2hhbm5lbHNcblx0XHQqL1xuXHRcdGJyb2FkY2FzdChtc2csIHRyYW5zZmVyKSB7XG5cdFx0XHRmb3IgKGNvbnN0IHRyYW5zcG9ydCBvZiB0aGlzLl9jaGFubmVscy52YWx1ZXMoKSkgdHJhbnNwb3J0LnNlbmQobXNnLCB0cmFuc2Zlcik7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogUmVxdWVzdCBvbiBzcGVjaWZpYyBjaGFubmVsXG5cdFx0Ki9cblx0XHRyZXF1ZXN0KGNoYW5uZWxOYW1lLCBtc2cpIHtcblx0XHRcdGNvbnN0IGNoYW5uZWwgPSB0aGlzLl9jaGFubmVscy5nZXQoY2hhbm5lbE5hbWUpO1xuXHRcdFx0aWYgKCFjaGFubmVsKSByZXR1cm4gUHJvbWlzZS5yZWplY3QoLyogQF9fUFVSRV9fICovIG5ldyBFcnJvcihgQ2hhbm5lbCAke2NoYW5uZWxOYW1lfSBub3QgZm91bmRgKSk7XG5cdFx0XHRyZXR1cm4gY2hhbm5lbC5yZXF1ZXN0KG1zZyk7XG5cdFx0fVxuXHRcdC8qKlxuXHRcdCogU3Vic2NyaWJlIHRvIGFsbCBjaGFubmVsc1xuXHRcdCovXG5cdFx0c3Vic2NyaWJlKG9ic2VydmVyKSB7XG5cdFx0XHRjb25zdCBvYnMgPSB0eXBlb2Ygb2JzZXJ2ZXIgPT09IFwiZnVuY3Rpb25cIiA/IHsgbmV4dDogb2JzZXJ2ZXIgfSA6IG9ic2VydmVyO1xuXHRcdFx0dGhpcy5fc3Vicy5hZGQob2JzKTtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGNsb3NlZDogZmFsc2UsXG5cdFx0XHRcdHVuc3Vic2NyaWJlOiAoKSA9PiB7XG5cdFx0XHRcdFx0dGhpcy5fc3Vicy5kZWxldGUob2JzKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBSZW1vdmUgY2hhbm5lbFxuXHRcdCovXG5cdFx0cmVtb3ZlKGNoYW5uZWxOYW1lKSB7XG5cdFx0XHRjb25zdCBjaGFubmVsID0gdGhpcy5fY2hhbm5lbHMuZ2V0KGNoYW5uZWxOYW1lKTtcblx0XHRcdGlmIChjaGFubmVsKSB7XG5cdFx0XHRcdGNoYW5uZWwuY2xvc2UoKTtcblx0XHRcdFx0dGhpcy5fY2hhbm5lbHMuZGVsZXRlKGNoYW5uZWxOYW1lKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0LyoqXG5cdFx0KiBDbG9zZSBhbGwgY2hhbm5lbHNcblx0XHQqL1xuXHRcdGNsb3NlKCkge1xuXHRcdFx0dGhpcy5fc3Vicy5mb3JFYWNoKChzKSA9PiBzLmNvbXBsZXRlPy4oKSk7XG5cdFx0XHR0aGlzLl9zdWJzLmNsZWFyKCk7XG5cdFx0XHRmb3IgKGNvbnN0IGNoYW5uZWwgb2YgdGhpcy5fY2hhbm5lbHMudmFsdWVzKCkpIGNoYW5uZWwuY2xvc2UoKTtcblx0XHRcdHRoaXMuX2NoYW5uZWxzLmNsZWFyKCk7XG5cdFx0fVxuXHRcdGdldCBjaGFubmVsTmFtZXMoKSB7XG5cdFx0XHRyZXR1cm4gQXJyYXkuZnJvbSh0aGlzLl9jaGFubmVscy5rZXlzKCkpO1xuXHRcdH1cblx0XHRnZXQgc2l6ZSgpIHtcblx0XHRcdHJldHVybiB0aGlzLl9jaGFubmVscy5zaXplO1xuXHRcdH1cblx0fTtcblx0LyoqXG5cdCogQ29ubmVjdCB0byB3aW5kb3cvaWZyYW1lIHZpYSBNZXNzYWdlQ2hhbm5lbFxuXHQqL1xuXHR2YXIgV2luZG93UG9ydENvbm5lY3RvciA9IGNsYXNzIHtcblx0XHRfdGFyZ2V0O1xuXHRcdF9jaGFubmVsTmFtZTtcblx0XHRfY29uZmlnO1xuXHRcdF90cmFuc3BvcnQgPSBudWxsO1xuXHRcdF9zdGF0ZSA9IG5ldyBDaGFubmVsU3ViamVjdCgpO1xuXHRcdF9oYW5kc2hha2VDb21wbGV0ZSA9IGZhbHNlO1xuXHRcdGNvbnN0cnVjdG9yKF90YXJnZXQsIF9jaGFubmVsTmFtZSwgX2NvbmZpZyA9IHt9KSB7XG5cdFx0XHR0aGlzLl90YXJnZXQgPSBfdGFyZ2V0O1xuXHRcdFx0dGhpcy5fY2hhbm5lbE5hbWUgPSBfY2hhbm5lbE5hbWU7XG5cdFx0XHR0aGlzLl9jb25maWcgPSBfY29uZmlnO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIEluaXRpYXRlIGNvbm5lY3Rpb24gdG8gdGFyZ2V0IHdpbmRvd1xuXHRcdCovXG5cdFx0YXN5bmMgY29ubmVjdCgpIHtcblx0XHRcdGlmICh0aGlzLl90cmFuc3BvcnQgJiYgdGhpcy5faGFuZHNoYWtlQ29tcGxldGUpIHJldHVybiB0aGlzLl90cmFuc3BvcnQ7XG5cdFx0XHR0aGlzLl9zdGF0ZS5uZXh0KFwiY29ubmVjdGluZ1wiKTtcblx0XHRcdGNvbnN0IHsgbG9jYWwsIHJlbW90ZSB9ID0gY3JlYXRlQ2hhbm5lbFBhaXIodGhpcy5fY2hhbm5lbE5hbWUsIHRoaXMuX2NvbmZpZyk7XG5cdFx0XHR0aGlzLl90YXJnZXQucG9zdE1lc3NhZ2Uoe1xuXHRcdFx0XHR0eXBlOiBcInBvcnQtY29ubmVjdFwiLFxuXHRcdFx0XHRjaGFubmVsTmFtZTogdGhpcy5fY2hhbm5lbE5hbWUsXG5cdFx0XHRcdHBvcnRJZDogbG9jYWwucG9ydElkXG5cdFx0XHR9LCB0aGlzLl9jb25maWcudGFyZ2V0T3JpZ2luID8/IFwiKlwiLCBbcmVtb3RlXSk7XG5cdFx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0XHRjb25zdCB0aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdFx0cmVqZWN0KC8qIEBfX1BVUkVfXyAqLyBuZXcgRXJyb3IoXCJIYW5kc2hha2UgdGltZW91dFwiKSk7XG5cdFx0XHRcdFx0dGhpcy5fc3RhdGUubmV4dChcImVycm9yXCIpO1xuXHRcdFx0XHR9LCB0aGlzLl9jb25maWcuaGFuZHNoYWtlVGltZW91dCA/PyAxZTQpO1xuXHRcdFx0XHRjb25zdCBzdWIgPSBsb2NhbC5zdWJzY3JpYmUoeyBuZXh0OiAobXNnKSA9PiB7XG5cdFx0XHRcdFx0aWYgKG1zZy50eXBlID09PSBcInNpZ25hbFwiICYmIG1zZy5wYXlsb2FkPy5hY3Rpb24gPT09IFwiaGFuZHNoYWtlLWFja1wiKSB7XG5cdFx0XHRcdFx0XHRjbGVhclRpbWVvdXQodGltZW91dCk7XG5cdFx0XHRcdFx0XHR0aGlzLl9oYW5kc2hha2VDb21wbGV0ZSA9IHRydWU7XG5cdFx0XHRcdFx0XHR0aGlzLl90cmFuc3BvcnQgPSBsb2NhbDtcblx0XHRcdFx0XHRcdHRoaXMuX3N0YXRlLm5leHQoXCJjb25uZWN0ZWRcIik7XG5cdFx0XHRcdFx0XHRzdWIudW5zdWJzY3JpYmUoKTtcblx0XHRcdFx0XHRcdHJlc29sdmUobG9jYWwpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSB9KTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHQvKipcblx0XHQqIExpc3RlbiBmb3IgaW5jb21pbmcgY29ubmVjdGlvbnMgKHRhcmdldCBzaWRlKVxuXHRcdCovXG5cdFx0c3RhdGljIGxpc3RlbihjaGFubmVsTmFtZSwgaGFuZGxlciwgY29uZmlnKSB7XG5cdFx0XHRjb25zdCBtc2dIYW5kbGVyID0gKGUpID0+IHtcblx0XHRcdFx0aWYgKGUuZGF0YT8udHlwZSAhPT0gXCJwb3J0LWNvbm5lY3RcIiB8fCBlLmRhdGE/LmNoYW5uZWxOYW1lICE9PSBjaGFubmVsTmFtZSkgcmV0dXJuO1xuXHRcdFx0XHRpZiAoIWUucG9ydHNbMF0pIHJldHVybjtcblx0XHRcdFx0Y29uc3QgdHJhbnNwb3J0ID0gbmV3IFBvcnRUcmFuc3BvcnQoZS5wb3J0c1swXSwgY2hhbm5lbE5hbWUsIGNvbmZpZyk7XG5cdFx0XHRcdHRyYW5zcG9ydC5zZW5kKHtcblx0XHRcdFx0XHRpZDogVVVJRHY0KCksXG5cdFx0XHRcdFx0Y2hhbm5lbDogY2hhbm5lbE5hbWUsXG5cdFx0XHRcdFx0c2VuZGVyOiB0cmFuc3BvcnQucG9ydElkLFxuXHRcdFx0XHRcdHR5cGU6IFwic2lnbmFsXCIsXG5cdFx0XHRcdFx0cGF5bG9hZDogeyBhY3Rpb246IFwiaGFuZHNoYWtlLWFja1wiIH1cblx0XHRcdFx0fSk7XG5cdFx0XHRcdGhhbmRsZXIodHJhbnNwb3J0KTtcblx0XHRcdH07XG5cdFx0XHRnbG9iYWxUaGlzLmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIG1zZ0hhbmRsZXIpO1xuXHRcdFx0cmV0dXJuICgpID0+IGdsb2JhbFRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgbXNnSGFuZGxlcik7XG5cdFx0fVxuXHRcdGRpc2Nvbm5lY3QoKSB7XG5cdFx0XHR0aGlzLl90cmFuc3BvcnQ/LmNsb3NlKCk7XG5cdFx0XHR0aGlzLl90cmFuc3BvcnQgPSBudWxsO1xuXHRcdFx0dGhpcy5faGFuZHNoYWtlQ29tcGxldGUgPSBmYWxzZTtcblx0XHRcdHRoaXMuX3N0YXRlLm5leHQoXCJkaXNjb25uZWN0ZWRcIik7XG5cdFx0fVxuXHRcdGdldCBpc0Nvbm5lY3RlZCgpIHtcblx0XHRcdHJldHVybiB0aGlzLl9oYW5kc2hha2VDb21wbGV0ZTtcblx0XHR9XG5cdFx0Z2V0IHN0YXRlKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX3N0YXRlO1xuXHRcdH1cblx0XHRnZXQgdHJhbnNwb3J0KCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX3RyYW5zcG9ydDtcblx0XHR9XG5cdH07XG5cdC8qKlxuXHQqIENyZWF0ZSBwcm94eSBmb3IgcmVtb3RlIG9iamVjdCBvdmVyIFBvcnRUcmFuc3BvcnRcblx0KlxuXHQqIFVzZXMgdW5pZmllZCBQcm94eSBtb2R1bGUgZm9yIGNvbnNpc3RlbnQgYmVoYXZpb3IuXG5cdCovXG5cdGZ1bmN0aW9uIGNyZWF0ZVBvcnRQcm94eSh0cmFuc3BvcnQsIHRhcmdldFBhdGggPSBbXSkge1xuXHRcdHJldHVybiBjcmVhdGVTZW5kZXJQcm94eSh7XG5cdFx0XHRyZXF1ZXN0OiAobXNnKSA9PiB0cmFuc3BvcnQucmVxdWVzdChtc2cpLFxuXHRcdFx0Y2hhbm5lbE5hbWU6IHRyYW5zcG9ydC5jaGFubmVsTmFtZSxcblx0XHRcdHNlbmRlcklkOiB0cmFuc3BvcnQucG9ydElkXG5cdFx0fSwgdGFyZ2V0UGF0aCk7XG5cdH1cblx0LyoqXG5cdCogRXhwb3NlIG9iamVjdCBtZXRob2RzIG92ZXIgUG9ydFRyYW5zcG9ydFxuXHQqXG5cdCogVXNlcyB1bmlmaWVkIFByb3h5IG1vZHVsZSdzIGV4cG9zZSBoYW5kbGVyLlxuXHQqL1xuXHRmdW5jdGlvbiBleHBvc2VPdmVyUG9ydCh0cmFuc3BvcnQsIHRhcmdldCkge1xuXHRcdGNvbnN0IGhhbmRsZXIgPSBjcmVhdGVFeHBvc2VIYW5kbGVyKHRhcmdldCk7XG5cdFx0cmV0dXJuIHRyYW5zcG9ydC5zdWJzY3JpYmUoeyBuZXh0OiBhc3luYyAobXNnKSA9PiB7XG5cdFx0XHRpZiAobXNnLnR5cGUgIT09IFwicmVxdWVzdFwiIHx8ICFtc2cucGF5bG9hZD8ucGF0aCkgcmV0dXJuO1xuXHRcdFx0Y29uc3QgeyBhY3Rpb24sIHBhdGgsIGFyZ3MgfSA9IG1zZy5wYXlsb2FkO1xuXHRcdFx0bGV0IHJlc3VsdDtcblx0XHRcdGxldCBlcnJvcjtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdHJlc3VsdCA9IGF3YWl0IGhhbmRsZXIoYWN0aW9uLCBwYXRoLCBhcmdzID8/IFtdKTtcblx0XHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdFx0ZXJyb3IgPSBlIGluc3RhbmNlb2YgRXJyb3IgPyBlLm1lc3NhZ2UgOiBTdHJpbmcoZSk7XG5cdFx0XHR9XG5cdFx0XHR0cmFuc3BvcnQuc2VuZCh7XG5cdFx0XHRcdGlkOiBVVUlEdjQoKSxcblx0XHRcdFx0Y2hhbm5lbDogbXNnLnNlbmRlcixcblx0XHRcdFx0c2VuZGVyOiB0cmFuc3BvcnQucG9ydElkLFxuXHRcdFx0XHR0eXBlOiBcInJlc3BvbnNlXCIsXG5cdFx0XHRcdHJlcUlkOiBtc2cucmVxSWQsXG5cdFx0XHRcdHBheWxvYWQ6IGVycm9yID8geyBlcnJvciB9IDogeyByZXN1bHQgfVxuXHRcdFx0fSk7XG5cdFx0fSB9KTtcblx0fVxuXHRjb25zdCBQb3J0VHJhbnNwb3J0RmFjdG9yeSA9IHtcblx0XHRjcmVhdGU6IChwb3J0LCBuYW1lLCBjb25maWcpID0+IG5ldyBQb3J0VHJhbnNwb3J0KHBvcnQsIG5hbWUsIGNvbmZpZyksXG5cdFx0Y3JlYXRlUGFpcjogKG5hbWUsIGNvbmZpZykgPT4gY3JlYXRlQ2hhbm5lbFBhaXIobmFtZSwgY29uZmlnKSxcblx0XHRjcmVhdGVQb29sOiAoY29uZmlnKSA9PiBuZXcgUG9ydFBvb2woY29uZmlnKSxcblx0XHRjcmVhdGVXaW5kb3dDb25uZWN0b3I6ICh0YXJnZXQsIG5hbWUsIGNvbmZpZykgPT4gbmV3IFdpbmRvd1BvcnRDb25uZWN0b3IodGFyZ2V0LCBuYW1lLCBjb25maWcpLFxuXHRcdGxpc3RlbjogV2luZG93UG9ydENvbm5lY3Rvci5saXN0ZW4sXG5cdFx0Y3JlYXRlUHJveHk6IGNyZWF0ZVBvcnRQcm94eSxcblx0XHRleHBvc2U6IGV4cG9zZU92ZXJQb3J0XG5cdH07XG5cbi8vI2VuZHJlZ2lvblxuLy8jcmVnaW9uIC4uL3VuaWZvcm0udHMvc3JjL25ld2VyL25leHQvc3RvcmFnZS9RdWV1ZWQudHNcbi8qKlxuXHQqIFNpbXBsaWZpZWQgd29ya2VyIHJlZ2lzdHJhdGlvbiBmb3IgY29tbW9uIHBhdHRlcm5zXG5cdCovXG5cdGNvbnN0IHJlZ2lzdGVyV29ya2VyQVBJID0gKGFwaSwgY2hhbm5lbE5hbWUgPSBcIndvcmtlclwiKSA9PiB7XG5cdFx0Y29uc3QgY2hhbm5lbEhhbmRsZXIgPSBpbml0Q2hhbm5lbEhhbmRsZXIoY2hhbm5lbE5hbWUgPz8gXCJ3b3JrZXJcIik7XG5cdFx0T2JqZWN0LmtleXMoYXBpKS5mb3JFYWNoKChtZXRob2ROYW1lKSA9PiB7XG5cdFx0XHRpZiAodHlwZW9mIGFwaVttZXRob2ROYW1lXSA9PT0gXCJmdW5jdGlvblwiKSB7fVxuXHRcdH0pO1xuXHRcdHJldHVybiBjaGFubmVsSGFuZGxlcjtcblx0fTtcblxuLy8jZW5kcmVnaW9uXG4vLyNyZWdpb24gc3JjL3V0aWxzL29wZnMvT1BGUy53b3JrZXIudHNcblx0dmFyIE9QRlNfd29ya2VyX2V4cG9ydHMgPSAvKiBAX19QVVJFX18gKi8gX19leHBvcnRBbGwoe1xuXHRcdGdldERpckhhbmRsZTogKCkgPT4gZ2V0RGlySGFuZGxlLFxuXHRcdGdldEZpbGVTeXN0ZW1Sb290OiAoKSA9PiBnZXRGaWxlU3lzdGVtUm9vdCxcblx0XHRoYW5kbGVyczogKCkgPT4gaGFuZGxlcnMsXG5cdFx0bm9ybWFsaXplUGF0aDogKCkgPT4gbm9ybWFsaXplUGF0aCxcblx0XHRyZXNvbHZlRmlsZVN5c3RlbUhhbmRsZTogKCkgPT4gcmVzb2x2ZUZpbGVTeXN0ZW1IYW5kbGVcblx0fSk7XG5cdHZhciBtYXBwZWRSb290cywgYWN0aXZlT2JzZXJ2ZXJzLCBnZXRGaWxlU3lzdGVtUm9vdCwgbm9ybWFsaXplUGF0aCwgcmVzb2x2ZUZpbGVTeXN0ZW1IYW5kbGUsIGdldERpckhhbmRsZSwgaGFuZGxlcnMsIFNXX0JSSURHRV9DSEFOTkVMX05BTUUsIHN3QnJpZGdlQ2hhbm5lbDtcblx0dmFyIGluaXRfT1BGU193b3JrZXIgPSBfX2VzbU1pbigoKCkgPT4ge1xuXHRcdG1hcHBlZFJvb3RzID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0XHRhY3RpdmVPYnNlcnZlcnMgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuXHRcdGdldEZpbGVTeXN0ZW1Sb290ID0gYXN5bmMgKGlkID0gXCJcIikgPT4ge1xuXHRcdFx0aWYgKGlkICYmIG1hcHBlZFJvb3RzLmhhcyhpZCkpIHJldHVybiBtYXBwZWRSb290cy5nZXQoaWQpO1xuXHRcdFx0cmV0dXJuIGF3YWl0IG5hdmlnYXRvci5zdG9yYWdlLmdldERpcmVjdG9yeSgpO1xuXHRcdH07XG5cdFx0bm9ybWFsaXplUGF0aCA9IChwYXRoKSA9PiB7XG5cdFx0XHRyZXR1cm4gcGF0aD8udHJpbT8uKCk/LnJlcGxhY2UoL1xcLysvZywgXCIvXCIpIHx8IFwiL1wiO1xuXHRcdH07XG5cdFx0cmVzb2x2ZUZpbGVTeXN0ZW1IYW5kbGUgPSBhc3luYyAocm9vdCwgcGF0aCwgY3JlYXRlID0gZmFsc2UpID0+IHtcblx0XHRcdGNvbnN0IHBhcnRzID0gbm9ybWFsaXplUGF0aChwYXRoKS5zcGxpdChcIi9cIikuZmlsdGVyKChwKSA9PiBwICYmIHAgIT09IFwiLlwiKTtcblx0XHRcdGxldCBjdXJyZW50ID0gcm9vdDtcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgcGFydHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0Y29uc3QgcGFydCA9IHBhcnRzW2ldO1xuXHRcdFx0XHRpZiAoaSA9PT0gcGFydHMubGVuZ3RoIC0gMSkgdHJ5IHtcblx0XHRcdFx0XHRyZXR1cm4gYXdhaXQgY3VycmVudC5nZXREaXJlY3RvcnlIYW5kbGUocGFydCwgeyBjcmVhdGUgfSk7XG5cdFx0XHRcdH0gY2F0Y2gge1xuXHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gYXdhaXQgY3VycmVudC5nZXRGaWxlSGFuZGxlKHBhcnQsIHsgY3JlYXRlIH0pO1xuXHRcdFx0XHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdFx0XHRcdGlmIChjcmVhdGUpIHRocm93IGU7XG5cdFx0XHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBjdXJyZW50ID0gYXdhaXQgY3VycmVudC5nZXREaXJlY3RvcnlIYW5kbGUocGFydCwgeyBjcmVhdGUgfSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gY3VycmVudDtcblx0XHR9O1xuXHRcdGdldERpckhhbmRsZSA9IGFzeW5jIChyb290LCBwYXRoLCBjcmVhdGUpID0+IHtcblx0XHRcdGNvbnN0IHBhcnRzID0gbm9ybWFsaXplUGF0aChwYXRoKS5zcGxpdChcIi9cIikuZmlsdGVyKChwKSA9PiBwKTtcblx0XHRcdGxldCBjdXJyZW50ID0gcm9vdDtcblx0XHRcdGZvciAoY29uc3QgcGFydCBvZiBwYXJ0cykgY3VycmVudCA9IGF3YWl0IGN1cnJlbnQuZ2V0RGlyZWN0b3J5SGFuZGxlKHBhcnQsIHsgY3JlYXRlIH0pO1xuXHRcdFx0cmV0dXJuIGN1cnJlbnQ7XG5cdFx0fTtcblx0XHRoYW5kbGVycyA9IHtcblx0XHRcdG1vdW50OiBhc3luYyAoeyBpZCwgaGFuZGxlIH0pID0+IHtcblx0XHRcdFx0bWFwcGVkUm9vdHMuc2V0KGlkLCBoYW5kbGUpO1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH0sXG5cdFx0XHR1bm1vdW50OiBhc3luYyAoeyBpZCB9KSA9PiB7XG5cdFx0XHRcdG1hcHBlZFJvb3RzLmRlbGV0ZShpZCk7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fSxcblx0XHRcdHJlYWREaXJlY3Rvcnk6IGFzeW5jICh7IHJvb3RJZCwgcGF0aCwgY3JlYXRlIH0pID0+IHtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRjb25zdCByb290ID0gYXdhaXQgZ2V0RmlsZVN5c3RlbVJvb3Qocm9vdElkKTtcblx0XHRcdFx0XHRjb25zdCBoYW5kbGUgPSBhd2FpdCBnZXREaXJIYW5kbGUocm9vdCwgcGF0aCwgY3JlYXRlKTtcblx0XHRcdFx0XHRjb25zdCBlbnRyaWVzID0gW107XG5cdFx0XHRcdFx0Zm9yIGF3YWl0IChjb25zdCBbbmFtZSwgZW50cnldIG9mIGhhbmRsZS5lbnRyaWVzKCkpIGVudHJpZXMucHVzaChbbmFtZSwgZW50cnldKTtcblx0XHRcdFx0XHRyZXR1cm4gZW50cmllcztcblx0XHRcdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0XHRcdGNvbnNvbGUud2FybihcIldvcmtlciByZWFkRGlyZWN0b3J5IGVycm9yOlwiLCBlKTtcblx0XHRcdFx0XHRyZXR1cm4gW107XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRyZWFkRmlsZTogYXN5bmMgKHsgcm9vdElkLCBwYXRoLCB0eXBlIH0pID0+IHtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRjb25zdCByb290ID0gYXdhaXQgZ2V0RmlsZVN5c3RlbVJvb3Qocm9vdElkKTtcblx0XHRcdFx0XHRjb25zdCBwYXJ0cyA9IG5vcm1hbGl6ZVBhdGgocGF0aCkuc3BsaXQoXCIvXCIpLmZpbHRlcigocCkgPT4gcCk7XG5cdFx0XHRcdFx0Y29uc3QgZmlsZW5hbWUgPSBwYXJ0cy5wb3AoKTtcblx0XHRcdFx0XHRjb25zdCBkaXJQYXRoID0gcGFydHMuam9pbihcIi9cIik7XG5cdFx0XHRcdFx0Y29uc3QgZmlsZSA9IGF3YWl0IChhd2FpdCAoYXdhaXQgZ2V0RGlySGFuZGxlKHJvb3QsIGRpclBhdGgsIGZhbHNlKSkuZ2V0RmlsZUhhbmRsZShmaWxlbmFtZSwgeyBjcmVhdGU6IGZhbHNlIH0pKS5nZXRGaWxlKCk7XG5cdFx0XHRcdFx0aWYgKHR5cGUgPT09IFwidGV4dFwiKSByZXR1cm4gYXdhaXQgZmlsZS50ZXh0KCk7XG5cdFx0XHRcdFx0aWYgKHR5cGUgPT09IFwiYXJyYXlCdWZmZXJcIikgcmV0dXJuIGF3YWl0IGZpbGUuYXJyYXlCdWZmZXIoKTtcblx0XHRcdFx0XHRpZiAodHlwZSA9PT0gXCJibG9iXCIpIHJldHVybiBmaWxlO1xuXHRcdFx0XHRcdHJldHVybiBmaWxlO1xuXHRcdFx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRcdFx0Y29uc29sZS53YXJuKFwiV29ya2VyIHJlYWRGaWxlIGVycm9yOlwiLCBlKTtcblx0XHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdHdyaXRlRmlsZTogYXN5bmMgKHsgcm9vdElkLCBwYXRoLCBkYXRhIH0pID0+IHtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRjb25zdCByb290ID0gYXdhaXQgZ2V0RmlsZVN5c3RlbVJvb3Qocm9vdElkKTtcblx0XHRcdFx0XHRjb25zdCBwYXJ0cyA9IG5vcm1hbGl6ZVBhdGgocGF0aCkuc3BsaXQoXCIvXCIpLmZpbHRlcigocCkgPT4gcCk7XG5cdFx0XHRcdFx0Y29uc3QgZmlsZW5hbWUgPSBwYXJ0cy5wb3AoKTtcblx0XHRcdFx0XHRjb25zdCBkaXJQYXRoID0gcGFydHMuam9pbihcIi9cIik7XG5cdFx0XHRcdFx0Y29uc3Qgd3JpdGFibGUgPSBhd2FpdCAoYXdhaXQgKGF3YWl0IGdldERpckhhbmRsZShyb290LCBkaXJQYXRoLCB0cnVlKSkuZ2V0RmlsZUhhbmRsZShmaWxlbmFtZSwgeyBjcmVhdGU6IHRydWUgfSkpLmNyZWF0ZVdyaXRhYmxlKCk7XG5cdFx0XHRcdFx0YXdhaXQgd3JpdGFibGUud3JpdGUoZGF0YSk7XG5cdFx0XHRcdFx0YXdhaXQgd3JpdGFibGUuY2xvc2UoKTtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0XHRcdGNvbnNvbGUud2FybihcIldvcmtlciB3cml0ZUZpbGUgZXJyb3I6XCIsIGUpO1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdHJlbW92ZTogYXN5bmMgKHsgcm9vdElkLCBwYXRoLCByZWN1cnNpdmUgfSkgPT4ge1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdGNvbnN0IHJvb3QgPSBhd2FpdCBnZXRGaWxlU3lzdGVtUm9vdChyb290SWQpO1xuXHRcdFx0XHRcdGNvbnN0IHBhcnRzID0gbm9ybWFsaXplUGF0aChwYXRoKS5zcGxpdChcIi9cIikuZmlsdGVyKChwKSA9PiBwKTtcblx0XHRcdFx0XHRjb25zdCBuYW1lID0gcGFydHMucG9wKCk7XG5cdFx0XHRcdFx0Y29uc3QgZGlyUGF0aCA9IHBhcnRzLmpvaW4oXCIvXCIpO1xuXHRcdFx0XHRcdGF3YWl0IChhd2FpdCBnZXREaXJIYW5kbGUocm9vdCwgZGlyUGF0aCwgZmFsc2UpKS5yZW1vdmVFbnRyeShuYW1lLCB7IHJlY3Vyc2l2ZSB9KTtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdG9ic2VydmU6IGFzeW5jICh7IHJvb3RJZCwgcGF0aCwgaWQgfSkgPT4ge1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdGlmIChhY3RpdmVPYnNlcnZlcnMuaGFzKGlkKSkgcmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0Y29uc3Qgcm9vdCA9IGF3YWl0IGdldEZpbGVTeXN0ZW1Sb290KHJvb3RJZCk7XG5cdFx0XHRcdFx0Y29uc3QgaGFuZGxlID0gYXdhaXQgZ2V0RGlySGFuZGxlKHJvb3QsIHBhdGgsIGZhbHNlKTtcblx0XHRcdFx0XHRpZiAodHlwZW9mIEZpbGVTeXN0ZW1PYnNlcnZlciAhPT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0XHRcdFx0Y29uc3Qgb2JzZXJ2ZXIgPSBuZXcgRmlsZVN5c3RlbU9ic2VydmVyKChyZWNvcmRzKSA9PiB7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IGNoYW5nZXMgPSByZWNvcmRzLm1hcCgocikgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdGNvbnN0IG5hbWUgPSByLmNoYW5nZWRIYW5kbGU/Lm5hbWUgfHwgci5yZWxhdGl2ZVBhdGhDb21wb25lbnRzPy5hdCgtMSk7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdFx0XHRcdHR5cGU6IHIudHlwZSxcblx0XHRcdFx0XHRcdFx0XHRcdG5hbWUsXG5cdFx0XHRcdFx0XHRcdFx0XHRraW5kOiByLmNoYW5nZWRIYW5kbGU/LmtpbmQgfHwgKG5hbWU/LmluY2x1ZGVzKFwiLlwiKSA/IFwiZmlsZVwiIDogXCJkaXJlY3RvcnlcIiksXG5cdFx0XHRcdFx0XHRcdFx0XHRoYW5kbGU6IHIuY2hhbmdlZEhhbmRsZSxcblx0XHRcdFx0XHRcdFx0XHRcdHBhdGg6IHIucmVsYXRpdmVQYXRoQ29tcG9uZW50cy5qb2luKFwiL1wiKVxuXHRcdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRzZWxmLnBvc3RNZXNzYWdlKHtcblx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcIm9ic2VydmF0aW9uXCIsXG5cdFx0XHRcdFx0XHRcdFx0aWQsXG5cdFx0XHRcdFx0XHRcdFx0Y2hhbmdlc1xuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0b2JzZXJ2ZXIub2JzZXJ2ZShoYW5kbGUpO1xuXHRcdFx0XHRcdFx0YWN0aXZlT2JzZXJ2ZXJzLnNldChpZCwgb2JzZXJ2ZXIpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdHVub2JzZXJ2ZTogYXN5bmMgKHsgaWQgfSkgPT4ge1xuXHRcdFx0XHRjb25zdCBvYnNlcnZlciA9IGFjdGl2ZU9ic2VydmVycy5nZXQoaWQpO1xuXHRcdFx0XHRpZiAob2JzZXJ2ZXIpIHtcblx0XHRcdFx0XHRvYnNlcnZlci5kaXNjb25uZWN0KCk7XG5cdFx0XHRcdFx0YWN0aXZlT2JzZXJ2ZXJzLmRlbGV0ZShpZCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9LFxuXHRcdFx0Y29weTogYXN5bmMgKHsgZnJvbSwgdG8gfSkgPT4ge1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdGNvbnN0IGNvcHlSZWN1cnNpdmUgPSBhc3luYyAoc291cmNlLCBkZXN0KSA9PiB7XG5cdFx0XHRcdFx0XHRpZiAoc291cmNlLmtpbmQgPT09IFwiZGlyZWN0b3J5XCIpIGZvciBhd2FpdCAoY29uc3QgW25hbWUsIGVudHJ5XSBvZiBzb3VyY2UuZW50cmllcygpKSBpZiAoZW50cnkua2luZCA9PT0gXCJkaXJlY3RvcnlcIikge1xuXHRcdFx0XHRcdFx0XHRjb25zdCBuZXdEZXN0ID0gYXdhaXQgZGVzdC5nZXREaXJlY3RvcnlIYW5kbGUobmFtZSwgeyBjcmVhdGU6IHRydWUgfSk7XG5cdFx0XHRcdFx0XHRcdGF3YWl0IGNvcHlSZWN1cnNpdmUoZW50cnksIG5ld0Rlc3QpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0Y29uc3QgZmlsZSA9IGF3YWl0IGVudHJ5LmdldEZpbGUoKTtcblx0XHRcdFx0XHRcdFx0Y29uc3Qgd3JpdGFibGUgPSBhd2FpdCAoYXdhaXQgZGVzdC5nZXRGaWxlSGFuZGxlKG5hbWUsIHsgY3JlYXRlOiB0cnVlIH0pKS5jcmVhdGVXcml0YWJsZSgpO1xuXHRcdFx0XHRcdFx0XHRhd2FpdCB3cml0YWJsZS53cml0ZShmaWxlKTtcblx0XHRcdFx0XHRcdFx0YXdhaXQgd3JpdGFibGUuY2xvc2UoKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRjb25zdCBmaWxlID0gYXdhaXQgc291cmNlLmdldEZpbGUoKTtcblx0XHRcdFx0XHRcdFx0Y29uc3Qgd3JpdGFibGUgPSBhd2FpdCBkZXN0LmNyZWF0ZVdyaXRhYmxlKCk7XG5cdFx0XHRcdFx0XHRcdGF3YWl0IHdyaXRhYmxlLndyaXRlKGZpbGUpO1xuXHRcdFx0XHRcdFx0XHRhd2FpdCB3cml0YWJsZS5jbG9zZSgpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0YXdhaXQgY29weVJlY3Vyc2l2ZShmcm9tLCB0byk7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdFx0XHRjb25zb2xlLndhcm4oXCJXb3JrZXIgY29weSBlcnJvcjpcIiwgZSk7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblx0XHRTV19CUklER0VfQ0hBTk5FTF9OQU1FID0gXCJvcGZzLXN3LWJyaWRnZS12MVwiO1xuXHRcdHN3QnJpZGdlQ2hhbm5lbCA9IG51bGw7XG5cdFx0dHJ5IHtcblx0XHRcdGlmICh0eXBlb2YgQnJvYWRjYXN0Q2hhbm5lbCAhPT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0XHRzd0JyaWRnZUNoYW5uZWwgPSBuZXcgQnJvYWRjYXN0Q2hhbm5lbChTV19CUklER0VfQ0hBTk5FTF9OQU1FKTtcblx0XHRcdFx0c3dCcmlkZ2VDaGFubmVsLm9ubWVzc2FnZSA9IGFzeW5jIChldmVudCkgPT4ge1xuXHRcdFx0XHRcdGNvbnN0IGRhdGEgPSBldmVudD8uZGF0YSB8fCB7fTtcblx0XHRcdFx0XHRpZiAoIWRhdGEgfHwgdHlwZW9mIGRhdGEgIT09IFwib2JqZWN0XCIpIHJldHVybjtcblx0XHRcdFx0XHRpZiAoZGF0YT8udHlwZSAhPT0gXCJvcGZzLXN3LXJlcXVlc3RcIikgcmV0dXJuO1xuXHRcdFx0XHRcdGNvbnN0IHJlcXVlc3RJZCA9IFN0cmluZyhkYXRhPy5yZXF1ZXN0SWQgfHwgXCJcIik7XG5cdFx0XHRcdFx0Y29uc3QgYWN0aW9uID0gU3RyaW5nKGRhdGE/LmFjdGlvbiB8fCBcIlwiKTtcblx0XHRcdFx0XHRjb25zdCBwYXlsb2FkID0gZGF0YT8ucGF5bG9hZDtcblx0XHRcdFx0XHRpZiAoIXJlcXVlc3RJZCB8fCAhYWN0aW9uKSByZXR1cm47XG5cdFx0XHRcdFx0Y29uc3QgaGFuZGxlciA9IGhhbmRsZXJzW2FjdGlvbl07XG5cdFx0XHRcdFx0aWYgKCFoYW5kbGVyKSB7XG5cdFx0XHRcdFx0XHRzd0JyaWRnZUNoYW5uZWw/LnBvc3RNZXNzYWdlPy4oe1xuXHRcdFx0XHRcdFx0XHR0eXBlOiBcIm9wZnMtc3ctcmVzcG9uc2VcIixcblx0XHRcdFx0XHRcdFx0cmVxdWVzdElkLFxuXHRcdFx0XHRcdFx0XHRvazogZmFsc2UsXG5cdFx0XHRcdFx0XHRcdGVycm9yOiBgVW5rbm93biBvcGVyYXRpb24gdHlwZTogJHthY3Rpb259YFxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRjb25zdCByZXN1bHQgPSBhd2FpdCBoYW5kbGVyKHBheWxvYWQpO1xuXHRcdFx0XHRcdFx0c3dCcmlkZ2VDaGFubmVsPy5wb3N0TWVzc2FnZT8uKHtcblx0XHRcdFx0XHRcdFx0dHlwZTogXCJvcGZzLXN3LXJlc3BvbnNlXCIsXG5cdFx0XHRcdFx0XHRcdHJlcXVlc3RJZCxcblx0XHRcdFx0XHRcdFx0b2s6IHRydWUsXG5cdFx0XHRcdFx0XHRcdHJlc3VsdFxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdFx0XHRcdHN3QnJpZGdlQ2hhbm5lbD8ucG9zdE1lc3NhZ2U/Lih7XG5cdFx0XHRcdFx0XHRcdHR5cGU6IFwib3Bmcy1zdy1yZXNwb25zZVwiLFxuXHRcdFx0XHRcdFx0XHRyZXF1ZXN0SWQsXG5cdFx0XHRcdFx0XHRcdG9rOiBmYWxzZSxcblx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVycm9yPy5tZXNzYWdlIHx8IFN0cmluZyhlcnJvcilcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHR9IGNhdGNoIHtcblx0XHRcdHN3QnJpZGdlQ2hhbm5lbCA9IG51bGw7XG5cdFx0fVxuXHRcdHNlbGYuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgYXN5bmMgKGUpID0+IHtcblx0XHRcdGlmICghZS5kYXRhIHx8IHR5cGVvZiBlLmRhdGEgIT09IFwib2JqZWN0XCIpIHJldHVybjtcblx0XHRcdGNvbnN0IHsgaWQsIHR5cGUsIHBheWxvYWQgfSA9IGUuZGF0YTtcblx0XHRcdGlmIChoYW5kbGVyc1t0eXBlXSkgdHJ5IHtcblx0XHRcdFx0Y29uc3QgcmVzdWx0ID0gYXdhaXQgaGFuZGxlcnNbdHlwZV0ocGF5bG9hZCk7XG5cdFx0XHRcdHNlbGYucG9zdE1lc3NhZ2Uoe1xuXHRcdFx0XHRcdGlkLFxuXHRcdFx0XHRcdHJlc3VsdFxuXHRcdFx0XHR9KTtcblx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdHNlbGYucG9zdE1lc3NhZ2Uoe1xuXHRcdFx0XHRcdGlkLFxuXHRcdFx0XHRcdGVycm9yOiBlcnJvcj8ubWVzc2FnZSB8fCBTdHJpbmcoZXJyb3IpXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAoaWQpIHNlbGYucG9zdE1lc3NhZ2Uoe1xuXHRcdFx0XHRpZCxcblx0XHRcdFx0ZXJyb3I6IGBVbmtub3duIG9wZXJhdGlvbiB0eXBlOiAke3R5cGV9YFxuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH0pKTtcblxuLy8jZW5kcmVnaW9uXG4vLyNyZWdpb24gc3JjL3V0aWxzL29wZnMvT1BGUy51bmlmb3JtLndvcmtlci50c1xuXHRpbml0X09QRlNfd29ya2VyKCk7XG5cdGlmIChoYW5kbGVycykgcmVnaXN0ZXJXb3JrZXJBUEkoaGFuZGxlcnMpO1xuXHRjb25zdCBwcm9jZXNzTWVzc2FnZSA9IGFzeW5jIChlbnZlbG9wZSkgPT4ge1xuXHRcdHRyeSB7XG5cdFx0XHRpZiAoZW52ZWxvcGUudHlwZSA9PT0gXCJiYXRjaFwiKSB7XG5cdFx0XHRcdGNvbnN0IHJlc3VsdHMgPSBbXTtcblx0XHRcdFx0Zm9yIChjb25zdCBtc2cgb2YgZW52ZWxvcGUucGF5bG9hZCkge1xuXHRcdFx0XHRcdGNvbnN0IHJlc3VsdCA9IGF3YWl0IHByb2Nlc3NTaW5nbGVNZXNzYWdlKG1zZyk7XG5cdFx0XHRcdFx0cmVzdWx0cy5wdXNoKHJlc3VsdCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHJlc3VsdHM7XG5cdFx0XHR9IGVsc2UgcmV0dXJuIGF3YWl0IHByb2Nlc3NTaW5nbGVNZXNzYWdlKGVudmVsb3BlKTtcblx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0Y29uc29sZS5lcnJvcihcIltPUEZTIFdvcmtlcl0gTWVzc2FnZSBwcm9jZXNzaW5nIGVycm9yOlwiLCBlcnJvcik7XG5cdFx0XHR0aHJvdyBlcnJvcjtcblx0XHR9XG5cdH07XG5cdGNvbnN0IHByb2Nlc3NTaW5nbGVNZXNzYWdlID0gYXN5bmMgKGVudmVsb3BlKSA9PiB7XG5cdFx0Y29uc3QgaGFuZGxlciA9IGhhbmRsZXJzW2VudmVsb3BlLnR5cGVdO1xuXHRcdGlmICghaGFuZGxlcikgdGhyb3cgbmV3IEVycm9yKGBVbmtub3duIG1lc3NhZ2UgdHlwZTogJHtlbnZlbG9wZS50eXBlfWApO1xuXHRcdHJldHVybiBhd2FpdCBoYW5kbGVyKGVudmVsb3BlLnBheWxvYWQpO1xuXHR9O1xuXHRnbG9iYWxUaGlzLnByb2Nlc3NNZXNzYWdlID0gcHJvY2Vzc01lc3NhZ2U7XG5cdGNvbnN0IGluaXRXb3JrZXIgPSBhc3luYyAoKSA9PiB7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IGhhbmRsZXJzID0gKGF3YWl0IFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4gKGluaXRfT1BGU193b3JrZXIoKSwgT1BGU193b3JrZXJfZXhwb3J0cykpKS5oYW5kbGVycztcblx0XHRcdGlmIChoYW5kbGVycykgcmVnaXN0ZXJXb3JrZXJBUEkoaGFuZGxlcnMpO1xuXHRcdFx0Y29uc29sZS5sb2coXCJbT1BGUyBXb3JrZXJdIEluaXRpYWxpemVkIHdpdGggaGFuZGxlcnM6XCIsIE9iamVjdC5rZXlzKGhhbmRsZXJzIHx8IHt9KSk7XG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoXCJbT1BGUyBXb3JrZXJdIEZhaWxlZCB0byBpbml0aWFsaXplOlwiLCBlcnJvcik7XG5cdFx0fVxuXHR9O1xuXHRpbml0V29ya2VyKCk7XG5cbi8vI2VuZHJlZ2lvblxufSkoKTsiXSwKICAibWFwcGluZ3MiOiAiY0FBQyxVQUFXLENBR1gsSUFBSUEsRUFBWSxPQUFPLGVBQ25CQyxHQUFXLENBQUNDLEVBQUlDLEVBQUtDLElBQVEsSUFBTSxDQUN0QyxHQUFJQSxFQUFLLE1BQU1BLEVBQUksQ0FBQyxFQUNwQixHQUFJLENBQ0gsT0FBT0YsSUFBT0MsRUFBTUQsRUFBR0EsRUFBSyxDQUFDLEdBQUlDLENBQ2xDLE9BQVNFLEVBQUcsQ0FDWCxNQUFNRCxFQUFNLENBQUNDLENBQUMsRUFBR0EsQ0FDbEIsQ0FDRCxFQUNJQyxHQUFjLENBQUNDLEVBQUtDLElBQWUsQ0FDdEMsSUFBSUMsRUFBUyxDQUFDLEVBQ2QsUUFBU0MsS0FBUUgsRUFDaEJQLEVBQVVTLEVBQVFDLEVBQU0sQ0FDdkIsSUFBS0gsRUFBSUcsQ0FBSSxFQUNiLFdBQVksRUFDYixDQUFDLEVBRUYsT0FBS0YsR0FDSlIsRUFBVVMsRUFBUSxPQUFPLFlBQWEsQ0FBRSxNQUFPLFFBQVMsQ0FBQyxFQUVuREEsQ0FDUixFQUlBLElBQUlFLEdBQWlDLFNBQVNBLEVBQWdCLENBQzdELE9BQUFBLEVBQWUsSUFBUyxNQUN4QkEsRUFBZSxJQUFTLE1BQ3hCQSxFQUFlLEtBQVUsT0FDekJBLEVBQWUsTUFBVyxRQUMxQkEsRUFBZSxVQUFlLFlBQzlCQSxFQUFlLE9BQVksU0FDM0JBLEVBQWUsZ0JBQXFCLGlCQUNwQ0EsRUFBZSxJQUFTLE1BQ3hCQSxFQUFlLFNBQWMsVUFDN0JBLEVBQWUsNEJBQWlDLDJCQUNoREEsRUFBZSx3QkFBNkIs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TUFBT0MsR0FBYSxDQUMxQyxHQUFJLENBQ0gsR0FBSUEsRUFBUyxPQUFTLFFBQVMsQ0FDOUIsTUFBTS9ILEVBQVUsQ0FBQyxFQUNqQixVQUFXekcsS0FBT3dPLEVBQVMsUUFBUyxDQUNuQyxNQUFNalUsRUFBUyxNQUFNa1UsR0FBcUJ6TyxDQUFHLEVBQzdDeUcsRUFBUSxLQUFLbE0sQ0FBTSxDQUNwQixDQUNBLE9BQU9rTSxDQUNSLEtBQU8sUUFBTyxNQUFNZ0ksR0FBcUJELENBQVEsQ0FDbEQsT0FBU3JDLEVBQU8sQ0FDZixjQUFRLE1BQU0sMENBQTJDQSxDQUFLLEVBQ3hEQSxDQUNQLENBQ0QsRUFDTXNDLEdBQXVCLE1BQU9ELEdBQWEsQ0FDaEQsTUFBTTlRLEVBQVVrUCxFQUFTNEIsRUFBUyxJQUFJLEVBQ3RDLEdBQUksQ0FBQzlRLEVBQVMsTUFBTSxJQUFJLE1BQU0seUJBQXlCOFEsRUFBUyxJQUFJLEVBQUUsRUFDdEUsT0FBTyxNQUFNOVEsRUFBUThRLEVBQVMsT0FBTyxDQUN0QyxFQUNBLFdBQVcsZUFBaUJELElBQ1QsU0FBWSxDQUM5QixHQUFJLENBQ0gsTUFBTTNCLEdBQVksTUFBTSxRQUFRLFFBQVEsRUFBRSxLQUFLLEtBQU9PLEdBQWlCLEVBQUdWLEdBQW9CLEdBQUcsU0FDN0ZHLEdBQVVQLEdBQWtCTyxDQUFRLEVBQ3hDLFFBQVEsSUFBSSwyQ0FBNEMsT0FBTyxLQUFLQSxHQUFZLENBQUMsQ0FBQyxDQUFDLENBQ3BGLE9BQVNULEVBQU8sQ0FDZixRQUFRLE1BQU0sc0NBQXVDQSxDQUFLLENBQzNELENBQ0QsR0FDVyxDQUdaLEdBQUciLAogICJuYW1lcyI6IFsiX19kZWZQcm9wIiwgIl9fZXNtTWluIiwgImZuIiwgInJlcyIsICJlcnIiLCAiZSIsICJfX2V4cG9ydEFsbCIsICJhbGwiLCAibm9fc3ltYm9scyIsICJ0YXJnZXQiLCAibmFtZSIsICJXUmVmbGVjdEFjdGlvbiIsICJUUkFOU1BPUlRfVFlQRV9BTElBU0VTIiwgIm5vcm1hbGl6ZVRyYW5zcG9ydFR5cGVBbGlhcyIsICJ0cmFuc3BvcnQiLCAicmF3IiwgImRldGVjdFRyYW5zcG9ydFR5cGUkMSIsICIkZnh5IiwgImlzUHJpbWl0aXZlIiwgIm9iaiIsICJ0cnlQYXJzZUJ5SGludCIsICJ2YWx1ZSIsICJoaW50IiwgInVud3JhcCIsICJmYWxsYmFjayIsICJmaXhGeCIsICJmeCIsICJnZXRSYW5kb21WYWx1ZXMiLCAiYXJyYXkiLCAidmFsdWVzIiwgImkiLCAiVVVJRHY0IiwgImMiLCAidW53cmFwQXJyYXkiLCAiYXJyIiwgImVsIiwgImlzTm90Q29tcGxleEFycmF5IiwgImlzQ2FuSnVzdFJldHVybiIsICJpc1R5cGVkQXJyYXkiLCAiaXNDYW5UcmFuc2ZlciIsICJib3VuZEN0eFN5bWJvbCIsICJib3VuZEN0eCIsICJkZWVwT3BlcmF0ZUFuZENsb25lIiwgIm9wZXJhdGlvbiIsICIkcHJldiIsICJpbmRleCIsICJlbnRyaWVzIiwgImtleSIsICJyZXNvbHZlZE1hcCIsICJoYW5kbGVkTWFwIiwgImFjdFdpdGgiLCAicHJvbWlzZU9yUGxhaW4iLCAiY2IiLCAiaXRlbSIsICJQcm9taXNlSGFuZGxlciIsICIjcmVzb2x2ZSIsICIjcmVqZWN0IiwgInJlc29sdmUiLCAicmVqZWN0IiwgInByb3AiLCAiZGVzY3JpcHRvciIsICJwcm90byIsICJ1d3AiLCAiYXJncyIsICJuZXdUYXJnZXQiLCAiY3QiLCAicmVjZWl2ZXIiLCAicmVzdWx0IiwgIiR0bXAiLCAiUHJvbWlzZWQiLCAidGhpc0FyZyIsICJwcm9taXNlIiwgIkJhc2VTdWJzY3JpcHRpb24iLCAiX3Vuc3Vic2NyaWJlIiwgIk9ic2VydmFibGUiLCAiX3Byb2R1Y2VyIiwgIm9ic2VydmVyT3JOZXh0IiwgIm9wdHMiLCAib2JzZXJ2ZXIiLCAiY3RybCIsICJhY3RpdmUiLCAiY2xlYW51cCIsICJkb0NsZWFudXAiLCAic3Vic2NyaWJlciIsICJ2IiwgIm9wcyIsICJzIiwgIm9wIiwgIkNoYW5uZWxTdWJqZWN0IiwgIm9wdGlvbnMiLCAib2JzIiwgImZpbHRlciIsICJwcmVkIiwgInNyYyIsICJzdWIiLCAiZGV0ZWN0Q29udGV4dFR5cGUiLCAic2VydmljZVdvcmtlclNjb3BlIiwgInNoYXJlZFdvcmtlclNjb3BlIiwgImRlZGljYXRlZFdvcmtlclNjb3BlIiwgImRldGVjdFRyYW5zcG9ydFR5cGUiLCAic291cmNlIiwgImRldGVjdGVkIiwgImRldGVjdEluY29taW5nQ29udGV4dFR5cGUiLCAiZGF0YSIsICJzZW5kZXIiLCAiRGVmYXVsdFJlZmxlY3QiLCAiUFJPWFlfTUFSS0VSIiwgIlBST1hZX0lOVEVSTkFMUyIsICJSZW1vdGVQcm94eUhhbmRsZXIiLCAiX2ludm9rZXIiLCAiY29uZmlnIiwgInByb3BTdHIiLCAiJHJlcXVlc3RIYW5kbGVyIiwgIiRkZXNjcmlwdG9yIiwgImNoaWxkUGF0aCIsICJjaGlsZFByb3h5IiwgImNyZWF0ZVJlbW90ZVByb3h5IiwgImludm9rZXIiLCAiaGFuZGxlciIsICJ3cmFwRGVzY3JpcHRvciIsICJ0YXJnZXRDaGFubmVsIiwgImNhY2hlZCIsICJkZXNjTWFwIiwgInByb3h5IiwgIndyYXBNYXAiLCAiY3JlYXRlRXhwb3NlSGFuZGxlciIsICJyZWZsZWN0IiwgImNyZWF0ZU9iamVjdEhhbmRsZXIiLCAiY3JlYXRlU2VuZGVyUHJveHkiLCAiYmFzZVBhdGgiLCAiYWN0aW9uIiwgInBhdGgiLCAibWFrZVJlcXVlc3RQcm94eSIsICJjcmVhdGVDb25uZWN0aW9uS2V5IiwgInBhcmFtcyIsICJxdWVyeUNvbm5lY3Rpb25zIiwgImNvbm5lY3Rpb25zIiwgInF1ZXJ5IiwgImluY2x1ZGVDbG9zZWQiLCAiZGVzaXJlZFN0YXR1cyIsICJjb25uZWN0aW9uIiwgImEiLCAiYiIsICJDb25uZWN0aW9uUmVnaXN0cnkiLCAiX2NyZWF0ZUlkIiwgIl9lbWl0RXZlbnQiLCAibm93IiwgImV4aXN0aW5nIiwgInBheWxvYWQiLCAiY2hhbm5lbCIsICJVbmlmaWVkQ2hhbm5lbCIsICJldmVudCIsICJjZmciLCAidHJhbnNwb3J0VHlwZSIsICJiaW5kaW5nIiwgInNvdXJjZUNoYW5uZWwiLCAibXNnIiwgInNlbmRSZXNwb25zZSIsICJ3cml0ZUJ5UGF0aCIsICJ1cmwiLCAiaWQiLCAicmVzb2x2ZXJzIiwgInRpbWVvdXQiLCAibWVzc2FnZSIsICJtb2R1bGVOYW1lIiwgImV2ZW50VHlwZSIsICJ0eXBlIiwgInNlbnQiLCAidGFyZ2V0cyIsICJyZXFJZCIsICJ0b1RyYW5zZmVyIiwgIm5ld1BhdGgiLCAiZXhlY3V0ZUFjdGlvbiIsICJyYXdSZXN1bHQiLCAiY29yZVJlc3BvbnNlIiwgInRyYW5zZmVyIiwgImJ1aWxkUmVzcG9uc2UiLCAicmVzcG9uc2UiLCAicmVtb3RlQ2hhbm5lbCIsICJzaWduYWxUeXBlIiwgInRhYklkIiwgImxpc3RlbmVyIiwgInNlbmRlck1ldGEiLCAicG9ydE5hbWUiLCAicG9ydCIsICJjcmVhdGVVbmlmaWVkQ2hhbm5lbCIsICJXT1JLRVJfQ0hBTk5FTCIsICJnZXRXb3JrZXJDaGFubmVsIiwgImNvbnRleHRUeXBlIiwgIlRTIiwgIlRyYW5zZmVyYWJsZSIsICJFIiwgImdldFdvcmtlclJlc29sdmVCYXNlVXJsIiwgImhyZWYiLCAicmVzb2x2ZVdvcmtlclNwZWNpZmllckhyZWYiLCAic3BlYyIsICJiYXNlIiwgIm5vcm1hbGl6ZWQiLCAiU0VMRl9DSEFOTkVMIiwgIkNIQU5ORUxfTUFQIiwgImlzUmVmbGVjdEFjdGlvbiQxIiwgIlJlbW90ZUNoYW5uZWxIZWxwZXIkMSIsICJjaGFubmVsTmFtZSIsICJDaGFubmVsSGFuZGxlciQxIiwgImJyb2FkY2FzdCIsICJ0b0NoYW5uZWwiLCAicmVxdWVzdCIsICJyZXNwb25zZUZuIiwgImhhbmRsZVJlcXVlc3QiLCAiaW5pdENoYW5uZWxIYW5kbGVyIiwgIiRjaGFubmVsIiwgImhhbmRNYXAiLCAib2JqZWN0VG9SZWYiLCAicmVnaXN0ZXJlZEluUGF0aCIsICJub3JtYWxpemVSZWYiLCAic3RvcmVkRGF0YSIsICJ0cmF2ZXJzZUJ5UGF0aCIsICIkZGVzYyIsICJyZWFkQnlQYXRoIiwgInJvb3QiLCAicmVtb3ZlQnlQYXRoIiwgInJlbW92ZUJ5RGF0YSIsICJoYXNOb1BhdGgiLCAiaXNPYmplY3QiLCAiZGVmYXVsdFJlZmxlY3QiLCAidCIsICJwIiwgImN0eCIsICJnb3QiLCAibm9ybWFsaXplZFZhbHVlIiwgIm5vcm1hbGl6ZWRBcmdzIiwgImNhbkJlUmV0dXJuIiwgImZpbmFsUGF0aCIsICJjdHhLZXkiLCAicGFyZW50IiwgImN1cnJlbnQiLCAiY2FsbEFyZ3MiLCAiY3RvckFyZ3MiLCAiQ2hhbm5lbENvbm5lY3Rpb24iLCAiX25hbWUiLCAiX3RyYW5zcG9ydFR5cGUiLCAiZnJvbUNoYW5uZWwiLCAibSIsICJvcmlnaW5hbCIsICJyIiwgInN0YXRlIiwgIkNvbm5lY3Rpb25Qb29sIiwgImdldENvbm5lY3Rpb25Qb29sIiwgImdldENvbm5lY3Rpb24iLCAiREJfTkFNRSIsICJEQl9WRVJTSU9OIiwgIlNUT1JFUyIsICJDaGFubmVsU3RvcmFnZSIsICJkYiIsICJtZXNzYWdlc1N0b3JlIiwgIm1haWxib3hTdG9yZSIsICJwZW5kaW5nU3RvcmUiLCAiZXhjaGFuZ2VTdG9yZSIsICJzdG9yZWRNZXNzYWdlIiwgInR4IiwgInN0b3JlIiwgInJlc3VsdHMiLCAiY3Vyc29yIiwgIm1lc3NhZ2VJZCIsICJzdGF0dXMiLCAibWVzc2FnZXMiLCAic3RhdHMiLCAiZGVsZXRlZENvdW50IiwgInBlbmRpbmciLCAib3BlcmF0aW9uSWQiLCAicG9sbEludGVydmFsIiwgInN0YXJ0VGltZSIsICJyZWNvcmQiLCAiZ2V0UmVxdWVzdCIsICJDaGFubmVsVHJhbnNhY3Rpb24iLCAib3BlcmF0aW9ucyIsICJzdG9yZU5hbWVzIiwgImdldFJlcSIsICJtc2dSZXF1ZXN0IiwgIm1haWxSZXF1ZXN0IiwgIl9zdG9yYWdlIiwgInVwZGF0ZXMiLCAiX3N0b3JhZ2VJbnN0YW5jZXMiLCAiZ2V0Q2hhbm5lbFN0b3JhZ2UiLCAid29ya2VyQmFzZSIsICJ3b3JrZXJDb2RlIiwgIlJlbW90ZUNoYW5uZWxIZWxwZXIiLCAiX2NoYW5uZWwiLCAiX2NvbnRleHQiLCAiX29wdGlvbnMiLCAibm9ybWFsaXplZFBhdGgiLCAibm9ybWFsaXplZEFjdGlvbiIsICJpc1JlZmxlY3RBY3Rpb24iLCAiQ2hhbm5lbEhhbmRsZXIiLCAibm9ybWFsaXplVHJhbnNwb3J0QmluZGluZyIsICJnZXREeW5hbWljVHJhbnNwb3J0VHlwZSIsICJDaGFubmVsQ29udGV4dCIsICJob3N0TmFtZSIsICJlbmRwb2ludCIsICJjb25uZWN0ZWRUYXJnZXRzIiwgIm5hbWVzIiwgImluaXRGbiIsICJ3b3JrZXIiLCAid29ya2VySW5zdGFuY2UiLCAibG9hZFdvcmtlciIsICJyZWFkeSIsICJicm9hZGNhc3ROYW1lIiwgImJjIiwgInNlbGZUYXJnZXQiLCAiYmNOYW1lIiwgIm5hbWUxIiwgIm5hbWUyIiwgIm1jIiwgImhhbmRsZXIxIiwgImhhbmRsZXIyIiwgInJlYWR5MSIsICJyZWFkeTIiLCAiY2hhbm5lbDEiLCAiY2hhbm5lbDIiLCAibXNnQ2hhbm5lbCIsICJpbmZvIiwgImRpcmVjdGlvbiIsICJtYXBwZWRUcmFuc3BvcnRUeXBlIiwgInVuaWZpZWQiLCAic3Vic2NyaXB0aW9uIiwgImlzVHJhbnNwb3J0QmluZGluZyIsICJuYXRpdmVUYXJnZXQiLCAiZWZmZWN0aXZlVGFyZ2V0IiwgIldYIiwgIkNPTlRFWFRfUkVHSVNUUlkiLCAiY3JlYXRlQ2hhbm5lbENvbnRleHQiLCAiV29ya2VyQ29udGV4dCIsICJjbG9zZWQiLCAiV09SS0VSX0NPTlRFWFQiLCAiZ2V0V29ya2VyQ29udGV4dCIsICJQb3J0VHJhbnNwb3J0IiwgIl9jaGFubmVsTmFtZSIsICJfY29uZmlnIiwgIm1zZ0hhbmRsZXIiLCAiZXJySGFuZGxlciIsICJ0cmFuc2ZlcmFibGUiLCAiY3JlYXRlQ2hhbm5lbFBhaXIiLCAiUG9ydFBvb2wiLCAiX2RlZmF1bHRDb25maWciLCAiV2luZG93UG9ydENvbm5lY3RvciIsICJfdGFyZ2V0IiwgImxvY2FsIiwgInJlbW90ZSIsICJjcmVhdGVQb3J0UHJveHkiLCAidGFyZ2V0UGF0aCIsICJleHBvc2VPdmVyUG9ydCIsICJlcnJvciIsICJQb3J0VHJhbnNwb3J0RmFjdG9yeSIsICJyZWdpc3RlcldvcmtlckFQSSIsICJhcGkiLCAiY2hhbm5lbEhhbmRsZXIiLCAibWV0aG9kTmFtZSIsICJPUEZTX3dvcmtlcl9leHBvcnRzIiwgImdldERpckhhbmRsZSIsICJnZXRGaWxlU3lzdGVtUm9vdCIsICJoYW5kbGVycyIsICJub3JtYWxpemVQYXRoIiwgInJlc29sdmVGaWxlU3lzdGVtSGFuZGxlIiwgIm1hcHBlZFJvb3RzIiwgImFjdGl2ZU9ic2VydmVycyIsICJTV19CUklER0VfQ0hBTk5FTF9OQU1FIiwgInN3QnJpZGdlQ2hhbm5lbCIsICJpbml0X09QRlNfd29ya2VyIiwgImNyZWF0ZSIsICJwYXJ0cyIsICJwYXJ0IiwgImhhbmRsZSIsICJyb290SWQiLCAiZW50cnkiLCAiZmlsZW5hbWUiLCAiZGlyUGF0aCIsICJmaWxlIiwgIndyaXRhYmxlIiwgInJlY3Vyc2l2ZSIsICJyZWNvcmRzIiwgImNoYW5nZXMiLCAiZnJvbSIsICJ0byIsICJjb3B5UmVjdXJzaXZlIiwgImRlc3QiLCAibmV3RGVzdCIsICJyZXF1ZXN0SWQiLCAicHJvY2Vzc01lc3NhZ2UiLCAiZW52ZWxvcGUiLCAicHJvY2Vzc1NpbmdsZU1lc3NhZ2UiXQp9Cg==
