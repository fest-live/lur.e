(function() {
	var ee = Object.defineProperty, Me = (e, t, n) => () => {
		if (n) throw n[0];
		try {
			return e && (t = e(e = 0)), t;
		} catch (s) {
			throw n = [s], s;
		}
	}, De = (e, t) => {
		let n = {};
		for (var s in e) ee(n, s, {
			get: e[s],
			enumerable: !0
		});
		return t || ee(n, Symbol.toStringTag, { value: "Module" }), n;
	};
	let h = (function(e) {
		return e.GET = "get", e.SET = "set", e.CALL = "call", e.APPLY = "apply", e.CONSTRUCT = "construct", e.DELETE = "delete", e.DELETE_PROPERTY = "deleteProperty", e.HAS = "has", e.OWN_KEYS = "ownKeys", e.GET_OWN_PROPERTY_DESCRIPTOR = "getOwnPropertyDescriptor", e.GET_PROPERTY_DESCRIPTOR = "getPropertyDescriptor", e.GET_PROTOTYPE_OF = "getPrototypeOf", e.SET_PROTOTYPE_OF = "setPrototypeOf", e.IS_EXTENSIBLE = "isExtensible", e.PREVENT_EXTENSIONS = "preventExtensions", e.TRANSFER = "transfer", e.IMPORT = "import", e.DISPOSE = "dispose", e;
	})({});
	const Ne = {
		ws: "websocket",
		socket: "websocket",
		socketio: "socket-io",
		service: "service-worker",
		sw: "service-worker",
		"service-worker-client": "service-worker",
		"service-worker-host": "service-worker",
		"ring-buffer": "atomics"
	};
	function Le(e) {
		const t = String(e ?? "").trim().toLowerCase();
		return t ? Ne[t] ?? t : "internal";
	}
	function Be(e) {
		return typeof e == "string" ? Le(e) : typeof Worker < "u" && e instanceof Worker ? "worker" : typeof SharedWorker < "u" && e instanceof SharedWorker ? "shared-worker" : typeof MessagePort < "u" && e instanceof MessagePort ? "message-port" : typeof BroadcastChannel < "u" && e instanceof BroadcastChannel ? "broadcast" : typeof WebSocket < "u" && e instanceof WebSocket ? "websocket" : typeof RTCDataChannel < "u" && e instanceof RTCDataChannel ? "rtc-data" : typeof chrome < "u" && e && typeof e == "object" && typeof e.postMessage == "function" && e.onMessage?.addListener ? "chrome-port" : "internal";
	}
	const te = Symbol.for("@fix"), C = (e) => typeof e == "string" || typeof e == "number" || typeof e == "boolean" || typeof e == "bigint" || typeof e > "u" || e == null, qe = (e, t) => C(e) ? t == "number" ? Number(e) || 0 : t == "string" ? String(e) || "" : t == "boolean" ? !!e : e : null, p = (e, t) => e?.[te] ?? e ?? t ?? t, Fe = (e) => {
		if (typeof e == "function" || e == null) return e;
		const t = function() {};
		return t[te] = e, t;
	}, He = (e) => crypto?.getRandomValues ? crypto?.getRandomValues?.(e) : (() => {
		const t = new Uint8Array(e.length);
		for (let n = 0; n < e.length; n++) t[n] = Math.floor(Math.random() * 256);
		return t;
	})(), d = () => crypto?.randomUUID ? crypto?.randomUUID?.() : "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (e) => (+e ^ He?.(/* @__PURE__ */ new Uint8Array(1))?.[0] & 15 >> +e / 4).toString(16)), ne = (e) => Array.isArray(e) ? e?.flatMap?.((t) => Array.isArray(t) ? ne(t) : t) : e, $ = (e) => ne(e)?.every?.(x), x = (e) => C(e) || typeof SharedArrayBuffer == "function" && e instanceof SharedArrayBuffer || Ge(e) || Array.isArray(e) && $(e), Ge = (e) => ArrayBuffer.isView(e) && !(e instanceof DataView), z = (e) => C(e) || typeof ArrayBuffer == "function" && e instanceof ArrayBuffer || typeof MessagePort == "function" && e instanceof MessagePort || typeof ReadableStream == "function" && e instanceof ReadableStream || typeof WritableStream == "function" && e instanceof WritableStream || typeof TransformStream == "function" && e instanceof TransformStream || typeof ImageBitmap == "function" && e instanceof ImageBitmap || typeof VideoFrame == "function" && e instanceof VideoFrame || typeof OffscreenCanvas == "function" && e instanceof OffscreenCanvas || typeof RTCDataChannel == "function" && e instanceof RTCDataChannel || typeof AudioData == "function" && e instanceof AudioData || typeof WebTransportReceiveStream == "function" && e instanceof WebTransportReceiveStream || typeof WebTransportSendStream == "function" && e instanceof WebTransportSendStream || typeof WebTransportReceiveStream == "function" && e instanceof WebTransportReceiveStream, k = (e, t, n) => {
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
	var Ue = class {
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
				if (C(s)) return qe(s, r);
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
		return e instanceof Promise || typeof e?.then == "function" ? S?.has?.(e) ? S?.get?.(e) : (se?.has?.(e) || e?.then?.((s) => S?.set?.(e, s)), se?.getOrInsertComputed?.(e, () => new Proxy(Fe(e), new Ue(t, n)))) : e;
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
	}, We = class {
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
	const $e = (e) => (t) => new We((n) => {
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
		const t = Be(e);
		return t && t !== "internal" ? t : e === self || e === globalThis || e === "self" ? "self" : "internal";
	}
	function ze(e) {
		if (!e) return "unknown";
		if (e.contextType) return e.contextType;
		const t = e.sender ?? "";
		return t.includes("worker") ? "worker" : t.includes("sw") || t.includes("service") ? "service-worker" : t.includes("chrome") || t.includes("crx") ? "chrome-content" : t.includes("background") ? "chrome-background" : "unknown";
	}
	const Ye = {
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
	}, Ke = Symbol.for("uniform.proxy"), Ve = Symbol.for("uniform.proxy.internals");
	var Xe = class {
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
			if (t === Ke) return !0;
			if (t === Ve) return this._config;
			if (t === it) return !0;
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
		const n = function() {}, s = new Xe(e, t);
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
	const Qe = ce;
	function Ze(e) {
		return [
			e.localChannel,
			e.remoteChannel,
			e.sender,
			e.transportType,
			e.direction
		].join("::");
	}
	function et(e, t = {}) {
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
			const t = Ze(e), n = Date.now(), s = this._connections.get(t);
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
			return et(this._connections.values(), e);
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
				reflect: t.reflect ?? Ye,
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
				contextType: ze(e)
			});
			const { result: a, toTransfer: c, newPath: l } = await this._executeAction(n, s, r ?? [], i);
			await this._sendResponse(o, n, i, l, a, c);
		}
		async _executeAction(e, t, n, s) {
			const { result: r, toTransfer: i, path: o } = me(e, t, n, {
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
			const { response: o, transfer: a } = await we(e, t, this._name, n, s, r, i), c = {
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
	function tt() {
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
	var nt = class {
		channelName;
		options;
		_channel;
		constructor(e, t = {}) {
			this.channelName = e, this.options = t, this._channel = tt();
		}
		request(e, t, n, s = {}) {
			return typeof e == "string" && (e = [e]), Array.isArray(t) && fe(e) && (s = n, n = t, t = e, e = []), this._channel.invoke(this.channelName, t, e, n);
		}
		doImportModule(e, t) {
			return this._channel.import(e, this.channelName);
		}
	}, st = class {
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
			return n && (this._unified.attach(n, { targetChannel: e }), this.broadcasts[e] = n), Promise.resolve(new nt(e, t));
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
			const s = await lt(e, t, this.channel);
			s && n?.(s.response, s.transfer);
		}
		close() {
			this._unified.close();
		}
	};
	const rt = (e = "$host$") => {
		if (w?.instance && e === "$host$") return w.instance;
		if (K.has(e)) return K.get(e) ?? null;
		const t = new st(e);
		return e === "$host$" && (w.name = e, w.instance = t), K.set(e, t), t;
	}, pe = /* @__PURE__ */ new WeakMap(), V = /* @__PURE__ */ new WeakMap(), _e = /* @__PURE__ */ new WeakMap(), ot = (e, t = w?.name, n) => typeof e == "object" && e != null || typeof e == "function" && e != null ? V.has(e) ? V.get(e) : pe.has(e) ? pe.get(e) : $(e) || n?.includes?.(e) || t == w?.name ? e : {
		$isDescriptor: !0,
		path: E.get(e) ?? (() => {
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
	} : x(e) ? e : null, it = Symbol.for("@requestHandler"), D = Symbol.for("@descriptor"), X = (e) => x(e) || e?.[D] ? e : e?.$isDescriptor ? Qe(e, async () => {}) : $(e) ? e : null, L = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new WeakMap(), j = (e, t) => {
		if (t != null && !Array.isArray(t) && (t = [t]), t == null || t?.length < 1) return e;
		const n = e?.[D] ?? (e?.$isDescriptor ? e : null);
		if (n && n?.owner == w?.name && (e = R(n?.path) ?? e), C(e)) return e;
		for (const s of t) if (e = e?.[s], e == null) return e;
		return e;
	}, R = (e) => {
		if (e != null && !Array.isArray(e) && (e = [e]), e == null || e?.length < 1) return null;
		const t = L?.get?.(e?.[0]) ?? null;
		return t != null ? j(t, e?.slice?.(1)) : null;
	}, U = (e, t) => {
		const n = t?.[D] ?? (t?.$isDescriptor ? t : null);
		if (n && n?.owner == w?.name && (t = R(n?.path) ?? t), e != null && !Array.isArray(e) && (e = [e]), e == null || e?.length < 1) return null;
		const s = L?.get?.(e?.[0]) ?? null;
		return e?.length > 1 ? j(s, e?.slice?.(1, -1))[e?.[e?.length - 1]] = t : L?.set?.(e?.[0], t), (typeof t == "object" || typeof t == "function") && E?.set?.(t, e), t;
	}, ye = (e) => {
		if (e != null && !Array.isArray(e) && (e = [e]), e == null || e?.length < 1) return !1;
		return !(L?.get?.(e?.[0]) ?? null) && e?.length <= 1 ? (L?.delete?.(e?.[0]), !0) : !1;
	}, at = (e) => {
		const t = e?.[D] ?? (e?.$isDescriptor ? e : null);
		t && t?.owner == w?.name && (e = R(t?.path) ?? e);
		const n = E?.get?.(e) ?? t?.path;
		return n == null || n?.length < 1 ? !1 : (ye(n), (typeof e == "object" || typeof e == "function") && E?.delete?.(e), !0);
	}, ct = (e) => {
		const t = e?.[D] ?? (e?.$isDescriptor ? e : null);
		return (E?.get?.(e) ?? t?.path) == null;
	}, P = (e) => (typeof e == "object" || typeof e == "function") && e != null, ge = {
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
	function me(e, t, n, s = {}) {
		const { channel: r = "", sender: i = "", reflect: o = ge } = s, a = s.target ?? R(t), c = [];
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
				} else l = t?.length > 0 ? ye(t) : at(a), l && (_ = E.get(a) ?? []);
				break;
			case "has":
			case h.HAS:
				l = o.has?.(a, n?.[0]) ?? (P(a) ? n?.[0] in a : !1);
				break;
			case "ownkeys":
			case h.OWN_KEYS:
				l = o.ownKeys?.(a) ?? (P(a) ? Object.keys(a) : []);
				break;
			case "getownpropertydescriptor":
			case "getpropertydescriptor":
			case h.GET_OWN_PROPERTY_DESCRIPTOR:
			case h.GET_PROPERTY_DESCRIPTOR:
				l = o.getOwnPropertyDescriptor?.(a, n?.[0] ?? t?.at(-1) ?? "") ?? (P(a) ? Object.getOwnPropertyDescriptor(a, n?.[0] ?? t?.at(-1) ?? "") : void 0);
				break;
			case "getprototypeof":
			case h.GET_PROTOTYPE_OF:
				l = o.getPrototypeOf?.(a) ?? (P(a) ? Object.getPrototypeOf(a) : null);
				break;
			case "setprototypeof":
			case h.SET_PROTOTYPE_OF:
				l = o.setPrototypeOf?.(a, n?.[0]) ?? (P(a) ? Object.setPrototypeOf(a, n?.[0]) : !1);
				break;
			case "isextensible":
			case h.IS_EXTENSIBLE:
				l = o.isExtensible?.(a) ?? (P(a) ? Object.isExtensible(a) : !0);
				break;
			case "preventextensions":
			case h.PREVENT_EXTENSIONS:
				l = o.preventExtensions?.(a) ?? (P(a) ? Object.preventExtensions(a) : !1);
				break;
		}
		return {
			result: l,
			toTransfer: c,
			path: _
		};
	}
	async function we(e, t, n, s, r, i, o) {
		const a = await i, c = z(a) && o.includes(a) || x(a);
		let l = r;
		!c && t !== "get" && t !== h.GET && (typeof a == "object" || typeof a == "function") && (ct(a) ? (l = [d()], U(l, a)) : l = E.get(a) ?? []);
		const _ = R(l), f = t === "get" || t === h.GET ? l?.at(-1) : void 0, b = R(r), N = k(a, (It) => ot(It, n, o)) ?? a;
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
						...P(_) && f != null ? Object.getOwnPropertyDescriptor(_, f) : {}
					}
				}
			},
			transfer: o
		};
	}
	async function lt(e, t, n, s) {
		const { channel: r, sender: i, path: o, action: a, args: c } = e;
		if (r !== n) return null;
		const { result: l, toTransfer: _, path: f } = me(a, o, c, {
			channel: r,
			sender: i,
			...s
		});
		return we(t, a, n, i, f, l, _);
	}
	var ht = class {
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
			return (t ? $e((n) => n.sender === t)(this._inbound) : this._inbound).subscribe(typeof e == "function" ? { next: e } : e);
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
	}, dt = class F {
		_connections = /* @__PURE__ */ new Map();
		static _instance = null;
		static getInstance() {
			return F._instance || (F._instance = new F()), F._instance;
		}
		getOrCreate(t, n = "internal", s = {}) {
			return this._connections.has(t) || this._connections.set(t, new ht(t, n, s)), this._connections.get(t);
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
	const be = () => dt.getInstance(), ft = (e, t, n) => be().getOrCreate(e, t, n), pt = "uniform_channels", _t = 1, u = {
		MESSAGES: "messages",
		MAILBOX: "mailbox",
		PENDING: "pending",
		EXCHANGE: "exchange",
		TRANSACTIONS: "transactions"
	};
	var yt = class {
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
				const n = indexedDB.open(pt, _t);
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
			return new gt(this);
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
						case "update":
							if (o.key !== void 0) {
								const c = a.get(o.key);
								c.onsuccess = () => {
									c.result && o.value && a.put({
										...c.result,
										...o.value
									});
								};
							}
							break;
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
	}, gt = class {
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
	const J = /* @__PURE__ */ new Map();
	function mt(e) {
		return J.has(e) || J.set(e, new yt(e)), J.get(e);
	}
	const Ce = he(), wt = Ce.length > 0 ? new URL("../transport/Worker.ts", Ce) : "";
	var Se = class {
		_channel;
		_context;
		_options;
		_connection;
		_storage;
		constructor(e, t, n = {}) {
			this._channel = e, this._context = t, this._options = n, this._connection = ft(e), this._storage = mt(e);
		}
		async request(e, t, n, s = {}) {
			let r = typeof e == "string" ? [e] : e, i = t, o = n;
			return Array.isArray(t) && xe(e) && (s = n, o = t, i = e, r = []), this._context.getHost()?.request(r, i, o, s, this._channel);
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
			this._channel = e, this._context = t, this._options = n, this._connection = be().getOrCreate(e, "internal", n), this._unified = new ue({
				name: e,
				autoListen: !1,
				timeout: n?.timeout
			});
		}
		createRemoteChannel(e, t = {}, n) {
			const s = Ct(n ?? this._context.$createOrUseExistingRemote(e, t, n ?? null)?.messageChannel?.port1), r = Ee(s?.target ?? s);
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
			let i = typeof e == "string" ? [e] : e, o = n;
			return Array.isArray(t) && xe(e) && (r = s, s = n, o = t, t = e, i = []), this._unified.invoke(r, t, i ?? [], Array.isArray(o) ? o : [o]);
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
	}, bt = class {
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
			const n = new v(e, this, {
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
			const s = Pe(t);
			if (!s) throw new Error(`Failed to create worker for channel: ${e}`);
			const r = new v(e, this, {
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
			const s = new v(e, this, {
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
			const s = new BroadcastChannel(t ?? e), r = new v(e, this, {
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
			const n = new v(e, this, {
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
			const s = new MessageChannel(), r = new v(e, this, {
				...this._options.defaultOptions,
				...n
			}), i = new v(t, this, {
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
				const a = Pe(wt);
				a?.addEventListener?.("message", (c) => {
					c.data.type === "channelCreated" && (s.port1?.start?.(), o(new Se(c.data.channel, this, t)));
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
	function xe(e) {
		return [...Object.values(h)].includes(e);
	}
	function Ct(e) {
		if (!e) return null;
		if (ke(e)) return e;
		const t = e, n = Ee(t);
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
	function ke(e) {
		return !!e && typeof e == "object" && "target" in e && typeof e.postMessage == "function";
	}
	function Ee(e) {
		const t = ke(e) ? e.target : e;
		return t ? t === "chrome-runtime" ? "chrome-runtime" : t === "chrome-tabs" ? "chrome-tabs" : t === "chrome-port" ? "chrome-port" : t === "chrome-external" ? "chrome-external" : typeof MessagePort < "u" && t instanceof MessagePort ? "message-port" : typeof BroadcastChannel < "u" && t instanceof BroadcastChannel ? "broadcast" : typeof Worker < "u" && t instanceof Worker ? "worker" : typeof WebSocket < "u" && t instanceof WebSocket ? "websocket" : typeof chrome < "u" && typeof t == "object" && t && typeof t.postMessage == "function" && t.onMessage?.addListener ? "chrome-port" : typeof self < "u" && t === self ? "self" : "internal" : "internal";
	}
	function Pe(e) {
		if (e instanceof Worker) return e;
		if (e instanceof URL) return new Worker(e.href, { type: "module" });
		if (typeof e == "function") try {
			return new e({ type: "module" });
		} catch {
			return e({ type: "module" });
		}
		return typeof e == "string" ? e.startsWith("/") ? new Worker(de(e.replace(/^\//, "./")), { type: "module" }) : URL.canParse(e) || e.startsWith("./") ? new Worker(de(e), { type: "module" }) : new Worker(URL.createObjectURL(new Blob([e], { type: "application/javascript" })), { type: "module" }) : e instanceof Blob || e instanceof File ? new Worker(URL.createObjectURL(e), { type: "module" }) : e ?? (typeof self < "u" ? self : null);
	}
	const St = /* @__PURE__ */ new Map();
	function xt(e = {}) {
		const t = new bt(e);
		return e.name && St.set(e.name, t), t;
	}
	var kt = class {
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
	};
	let Q = null;
	function Et(e) {
		return Q || (Q = new kt(e)), Q;
	}
	Et({ name: "worker" });
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
	function Z(e, t) {
		const n = new MessageChannel();
		return {
			local: new W(n.port1, e, t),
			remote: n.port2,
			transfer: () => n.port2
		};
	}
	var ve = class {
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
			const { local: e, remote: t } = Z(this._channelName, this._config);
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
	ve.listen;
	const Te = (e, t = "worker") => {
		const n = rt(t ?? "worker");
		return Object.keys(e).forEach((s) => {
			e[s];
		}), n;
	};
	var Rt = De({
		getDirHandle: () => O,
		getFileSystemRoot: () => A,
		handlers: () => T,
		normalizePath: () => I,
		resolveFileSystemHandle: () => Re
	}), B, q, A, I, Re, O, T, Ae, M, Ie = Me((() => {
		B = /* @__PURE__ */ new Map(), q = /* @__PURE__ */ new Map(), A = async (e = "") => e && B.has(e) ? B.get(e) : await navigator.storage.getDirectory(), I = (e) => e?.trim?.()?.replace(/\/+/g, "/") || "/", Re = async (e, t, n = !1) => {
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
		}, T = {
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
		}, Ae = "opfs-sw-bridge-v1", M = null;
		try {
			typeof BroadcastChannel < "u" && (M = new BroadcastChannel(Ae), M.onmessage = async (e) => {
				const t = e?.data || {};
				if (!t || typeof t != "object" || t?.type !== "opfs-sw-request") return;
				const n = String(t?.requestId || ""), s = String(t?.action || ""), r = t?.payload;
				if (!n || !s) return;
				const i = T[s];
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
			if (T[n]) try {
				const r = await T[n](s);
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
	Ie(), T && Te(T);
	const At = async (e) => {
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
		const t = T[e.type];
		if (!t) throw new Error(`Unknown message type: ${e.type}`);
		return await t(e.payload);
	};
	globalThis.processMessage = At, (async () => {
		try {
			const e = (await Promise.resolve().then(() => (Ie(), Rt))).handlers;
			e && Te(e), console.log("[OPFS Worker] Initialized with handlers:", Object.keys(e || {}));
		} catch (e) {
			console.error("[OPFS Worker] Failed to initialize:", e);
		}
	})();
})();
