import assert from "node:assert/strict";
import test from "node:test";

import {
    createContentAddressedStore,
    type ContentStoreBackend
} from "../src/utils/opfs/content-addressed-store";

const createMemoryBackend = (): ContentStoreBackend & {
    files: Map<string, Blob>;
} => ({
    files: new Map<string, Blob>(),
    async read(path) {
        return this.files.get(path) ?? null;
    },
    async write(path, data) {
        this.files.set(path, data instanceof Blob ? data : new Blob([data]));
    },
    async removeTree(prefix) {
        for (const path of this.files.keys()) {
            if (path === prefix || path.startsWith(`${prefix}/`)) {
                this.files.delete(path);
            }
        }
    }
});

test("content-addressed store reuses one blob for equal bytes", async () => {
    const backend = createMemoryBackend();
    const store = createContentAddressedStore("/user/workcenter", backend);

    const first = await store.put(new File(["same bytes"], "first.txt", {
        type: "text/plain",
        lastModified: 101
    }));
    const second = await store.put(new File(["same bytes"], "second.txt", {
        type: "text/plain",
        lastModified: 202
    }));

    assert.equal(first.hash, second.hash);
    assert.equal(
        [...backend.files.keys()].filter((path) => path.includes("/blobs/")).length,
        1
    );
});

test("stored blob rehydrates original file metadata", async () => {
    const backend = createMemoryBackend();
    const store = createContentAddressedStore("/user/workcenter", backend);
    const ref = await store.put(new File(["document"], "notes.md", {
        type: "text/markdown",
        lastModified: 1234
    }));

    const restored = await store.get(ref);
    assert.ok(restored);
    assert.equal(restored.name, "notes.md");
    assert.equal(restored.type, "text/markdown");
    assert.equal(restored.lastModified, 1234);
    assert.equal(await restored.text(), "document");
});

test("invalid JSON and missing blobs fail without throwing", async () => {
    const backend = createMemoryBackend();
    const store = createContentAddressedStore("/user/workcenter", backend);

    backend.files.set("/user/workcenter/session.json", new Blob(["{broken"]));
    assert.equal(await store.readJson("/user/workcenter/session.json"), null);
    assert.equal(
        await store.get({
            hash: "missing",
            path: "/user/workcenter/blobs/missing",
            name: "missing.txt",
            type: "text/plain",
            size: 0,
            lastModified: 0
        }),
        null
    );
});

test("clear never deletes content outside its namespace", async () => {
    const backend = createMemoryBackend();
    const store = createContentAddressedStore("/user/workcenter", backend);
    await store.writeJson("session.json", { version: 1 });
    backend.files.set("/user/other/keep.txt", new Blob(["keep"]));

    await store.clear();

    assert.equal(backend.files.has("/user/workcenter/session.json"), false);
    assert.equal(backend.files.has("/user/other/keep.txt"), true);
});
