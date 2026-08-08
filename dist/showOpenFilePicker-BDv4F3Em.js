var { showOpenFilePicker: h, showSaveFilePicker: k } = globalThis.showOpenFilePicker ?? typeof document == "object" ? (() => {
  const l = /* @__PURE__ */ new WeakMap(), i = FileSystemHandle.prototype, r = FileSystemFileHandle.prototype;
  document.createElement("a");
  const n = (t) => {
    const e = { async getFile() {
      return t;
    } };
    return l.set(e, t), e;
  }, s = (t) => a(Object(t?.accept)).join(","), { create: d, defineProperties: m, getOwnPropertyDescriptors: c, values: a } = Object, { name: y, kind: F, ...O } = c(i), { getFile: w, ...f } = c(r);
  return WritableStream, {
    showOpenFilePicker(t = null) {
      const e = document.createElement("input");
      e.type = "file", e.multiple = !!t?.multiple, e.accept = [].concat(t?.types ?? []).map(s).join(",");
      const o = new Promise((p, u) => {
        e.addEventListener("change", () => {
          p([...e.files].map(n)), e.value = null, e.files = null;
        }, { once: !0 }), e.addEventListener("cancel", () => {
          u(new DOMException("The user aborted a request."));
        }, { once: !0 });
      });
      return e.click(), o;
    },
    async showSaveFilePicker(t = null) {
      const e = [].concat(Object.entries(Object([].concat(t?.types ?? [])[0]?.accept)))[0] || ["text/plain", [".txt"]];
      return n(new File([], t?.suggestedName ?? "Untitled" + (e?.[1]?.[0] || ".txt"), { type: e?.[0] || "text/plain" }));
    }
  };
})() : {
  async showOpenFilePicker() {
    return [];
  },
  async showSaveFilePicker() {
    return [];
  }
};
export {
  h as showOpenFilePicker,
  k as showSaveFilePicker
};
