import { getDirectoryHandle, readFile, writeFile } from "./OPFS";
import { createClient, type FileStat } from "webdav";

//
const downloadContentsToOPFS = async (client, path = "/") => {
    const files = await Array.fromAsync(await client.getDirectoryContents(path)?.catch?.((e) => { console.log(e); return []; }) as any);
    for (const file of files as FileStat[]) {
        if (new Date(file.lastmod).getTime() > new Date((await readFile(null, file.filename))?.lastModified).getTime()) {
            const fileContent = file?.type == "directory" ? await downloadContentsToOPFS(client, file.filename) : await client.getFileContents(file.filename);
            writeFile(null, file.filename, fileContent);
        }
    }
}

//
const uploadOPFSToWebDav = async (client, path = "/") => {
    const files = await Array.fromAsync((await getDirectoryHandle(null, path))?.entries?.() ?? []);
    await Promise.all((files as FileSystemDirectoryHandle[] | FileSystemFileHandle[])?.map(async (fileOrDir) => {
        if (fileOrDir instanceof FileSystemDirectoryHandle) { await uploadOPFSToWebDav(client, path + "/" + fileOrDir.name + "/") }
        if (fileOrDir instanceof FileSystemFileHandle) {
            const fileContent = await (await fileOrDir)?.getFile?.();
            if (new Date(await fileContent?.lastModified).getTime() > new Date((await client.stat(path + "/" + fileOrDir.name) as FileStat)?.lastmod).getTime()) {
                await client.putFileContents(path + "/" + fileOrDir.name, await fileContent?.arrayBuffer());
            }
        }
    }));
}

//
export const WebDavSync = (address, options: any = {}) => {
    const client = createClient(address, options);

    //
    return {
        client,
        download: async () => {
            return downloadContentsToOPFS(client);
        },
        upload: async () => {
            return uploadOPFSToWebDav(client);
        }
    }
}

//
export default WebDavSync;
