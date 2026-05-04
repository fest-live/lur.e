/**
 * UI-facing filesystem operations.
 *
 * These helpers connect browser picker/clipboard/drop interactions with the
 * higher-level storage and recognition pipelines so views do not have to know
 * about OPFS handles or import-heavy recognition modules directly.
 */
import { getDirectoryHandle, handleIncomingEntries, writeFileSmart } from "fest/lure";

/** Bind drag-and-drop ingestion for a directory target and emit a local `dir-dropped` event on success. */
export const bindDropToDir = (host: HTMLElement, dir: string) => {
    const onDragOver = (ev: DragEvent) => {
        ev.preventDefault();
        (host as any).dataset.dragover = 'true';
    };
    const onDragLeave = () => { delete (host as any).dataset.dragover; };
    const onDrop = async (ev: DragEvent) => {
        ev.preventDefault();
        delete (host as any).dataset.dragover;
        try {
            await handleIncomingEntries(ev.dataTransfer, dir);
            const count = (ev.dataTransfer?.items?.length || ev.dataTransfer?.files?.length || 0);
            host.dispatchEvent(new CustomEvent('dir-dropped', { detail: { count }, bubbles: true }));
        } catch (e) { console.warn(e); }
    };
    host.addEventListener('dragover', onDragOver);
    host.addEventListener('dragleave', onDragLeave);
    host.addEventListener('drop', onDrop);
    return () => {
        host.removeEventListener('dragover', onDragOver);
        host.removeEventListener('dragleave', onDragLeave);
        host.removeEventListener('drop', onDrop);
    };
}

/** Write every provided file into the target directory using the canonical smart-write helper. */
export const writeFilesToDir = async (dir: string, files: File[] | FileList) => {
    const items = Array.from(files as any as File[]);
    for (const file of items) {
        dir = dir?.trim?.();
        dir = dir?.endsWith?.('/') ? dir : (dir + '/');
        await writeFileSmart(null, dir, file);
    }
    return items.length;
}

/** Open a native file picker and write the selected files into the target directory. */
export const openPickerAndWrite = async (dir: string, accept = "*/*", multiple = true) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    (input as any).multiple = multiple;
    const result = await new Promise<number>((resolve) => {
        input.onchange = async () => {
            dir = dir?.trim?.();
            dir = dir?.endsWith?.('/') ? dir : (dir + '/');
            try { resolve(await writeFilesToDir(dir, input.files || ([] as any))); }
            catch { resolve(0); }
        };
        input.click();
    });
    return result;
}

/** Download a file that already exists in OPFS by path. */
export const downloadByPath = async (path: string, suggestedName?: string) => {
    const lastSlash = path.lastIndexOf('/');
    const dir = path.slice(0, Math.max(0, lastSlash + 1));
    const name = suggestedName || path.slice(lastSlash + 1);
    const dirHandle: any = await getDirectoryHandle(null, dir);
    const fileHandle: any = await dirHandle.getFileHandle(name, { create: false });
    const file = await fileHandle.getFile();
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url; a.download = name; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}
