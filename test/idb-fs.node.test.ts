import assert from "node:assert/strict";
import test from "node:test";

import {
    isIdbScopePath,
    stripStorageScopePrefix
} from "@fest-lib/core";
import {
    createMemoryIdbFsStore,
    getIdbRoot,
    isIdbFsHandle,
    normalizeIdbNodePath
} from "../src/utils/opfs/IdbFs";
import {
    asProvidedFile,
    isProvidedDirectory,
    provideFromBackend,
    provideFromHandle,
    registerProvideBackend,
    unregisterProvideBackend
} from "../src/utils/opfs/provide";
import { createRemoteProvideBackend } from "../src/utils/opfs/remote-fs";

test("IDB handles write, list, read, and remove a nested file", async () => {
    const store = createMemoryIdbFsStore();
    const root = await getIdbRoot(store);
    assert.ok(root);
    assert.equal(isIdbFsHandle(root), true);

    const notes = await root.getDirectoryHandle("notes", { create: true });
    const file = await notes.getFileHandle("hello.md", { create: true });
    const writable = await file.createWritable();
    await writable.write(new Blob(["# hi"], { type: "text/markdown" }));
    await writable.close();

    const names: string[] = [];
    for await (const [name, handle] of notes.entries()) {
        names.push(name);
        assert.equal(handle.kind, "file");
    }
    assert.deepEqual(names, ["hello.md"]);

    const restored = await (await notes.getFileHandle("hello.md")).getFile();
    assert.equal(await restored.text(), "# hi");
    assert.equal(restored.name, "hello.md");

    await root.removeEntry("notes", { recursive: true });
    const leftover: string[] = [];
    for await (const [name] of root.entries()) leftover.push(name);
    assert.deepEqual(leftover, []);
});

test("normalizeIdbNodePath rejects parent traversal", () => {
    assert.equal(normalizeIdbNodePath("/a/../b"), "/b");
    assert.equal(normalizeIdbNodePath("notes/hello.md"), "/notes/hello.md");
    assert.equal(normalizeIdbNodePath("/"), "/");
});

test("storage scope helpers strip /user/ and /idb/", () => {
    assert.equal(isIdbScopePath("/idb/notes/a.md"), true);
    assert.equal(stripStorageScopePrefix("/idb/notes/a.md"), "/notes/a.md");
    assert.equal(stripStorageScopePrefix("/user/notes/a.md"), "/notes/a.md");
});

test("provideFromHandle lists a directory and reads a file", async () => {
    const store = createMemoryIdbFsStore();
    const root = await getIdbRoot(store);
    assert.ok(root);
    const notes = await root.getDirectoryHandle("notes", { create: true });
    const handle = await notes.getFileHandle("a.md", { create: true });
    const writable = await handle.createWritable();
    await writable.write("hello");
    await writable.close();

    const dir = await provideFromHandle(root, "/idb/notes/", "/idb/");
    assert.equal(isProvidedDirectory(dir), true);
    if (!isProvidedDirectory(dir)) return;
    assert.equal(dir.entries[0]?.name, "a.md");
    assert.equal(dir.entries[0]?.path, "/idb/notes/a.md");

    const file = asProvidedFile(await provideFromHandle(root, "/idb/notes/a.md", "/idb/"));
    assert.ok(file);
    assert.equal(await file.text(), "hello");
});

test("provideFromBackend lists /sdcard/ and reads a file", async () => {
    registerProvideBackend({
        root: "/sdcard/",
        async list() {
            return [{ name: "photo.jpg", kind: "file", path: "/sdcard/DCIM/photo.jpg" }];
        },
        async readFile() {
            return new File(["img"], "photo.jpg", { type: "image/jpeg" });
        }
    });
    const dir = await provideFromBackend(
        { root: "/sdcard/", async list() { return [{ name: "DCIM", kind: "directory", path: "/sdcard/DCIM/" }]; } },
        "/sdcard/"
    );
    assert.equal(isProvidedDirectory(dir), true);
    const file = asProvidedFile(await provideFromBackend(
        {
            root: "/sdcard/",
            async list() { return []; },
            async readFile() { return new File(["img"], "photo.jpg"); }
        },
        "/sdcard/DCIM/photo.jpg"
    ));
    assert.ok(file);
    assert.equal(file.name, "photo.jpg");
    unregisterProvideBackend("/sdcard/");
});

test("remote provide backend lists /assets/ and reads a file", async () => {
    const transport = {
        async request(req: { op: string; path?: string }) {
            if (req.op === "list") {
                return {
                    t: "fs-result" as const,
                    id: "1",
                    ok: true,
                    entries: [{ name: "logo.svg", kind: "file" as const, path: "/assets/logo.svg" }]
                };
            }
            return {
                t: "fs-result" as const,
                id: "2",
                ok: true,
                file: {
                    name: "logo.svg",
                    type: "image/svg+xml",
                    encoding: "utf8" as const,
                    body: "<svg/>"
                }
            };
        }
    };
    const backend = createRemoteProvideBackend("/assets/", transport);
    const dir = await provideFromBackend(backend, "/assets/");
    assert.equal(isProvidedDirectory(dir), true);
    const file = asProvidedFile(await provideFromBackend(backend, "/assets/logo.svg"));
    assert.ok(file);
    assert.equal(await file.text(), "<svg/>");
});
