// deno-lint-ignore-file require-await constructor-super
/** @type {import('./showOpenFilePicker').Ponyfills} */
const { showOpenFilePicker, showSaveFilePicker } = globalThis.showOpenFilePicker ?? typeof document === 'object' ? (() => {
    const mapOfFiles = new WeakMap()
    const prototypeOfFileSystemHandle = FileSystemHandle.prototype
    const prototypeOfFileSystemFileHandle = FileSystemFileHandle.prototype
    const a = document.createElement('a')

    const getFileHandle = file => {
        const fileHandle = {
            async getFile() { return file; }
        }//create(prototypeOfFileSystemFileHandle)
        mapOfFiles.set(fileHandle, file)
        return fileHandle
    }

    const getAcceptType = type => values(Object(type?.accept)).join(',')

    const { create, defineProperties, getOwnPropertyDescriptors, values } = Object
    const { name, kind, ...descriptorsOfFileSystemHandle }  = getOwnPropertyDescriptors(prototypeOfFileSystemHandle)
    const { getFile, ...descriptorsOfFileSystemFileHandle } = getOwnPropertyDescriptors(prototypeOfFileSystemFileHandle)

    /*
    defineProperties(prototypeOfFileSystemHandle, {
        ...descriptorsOfFileSystemHandle,
        ...getOwnPropertyDescriptors({
            get name() {
                return mapOfFiles.get(this)?.name ?? name.call(this)
            },
            get kind() {
                return mapOfFiles.has(this) ? 'file' : kind.call(this)
            },
        }),
    })

    defineProperties(prototypeOfFileSystemFileHandle, {
        ...descriptorsOfFileSystemFileHandle,
        ...getOwnPropertyDescriptors({
            async getFile() {
                return await (mapOfFiles?.get?.(this) || getFile?.call?.(this))
            },
            async createWritable() {
                const stream = new FileSystemWritableFileStream()
                mapOfFiles?.set(stream, mapOfFiles?.get?.(this))
                return stream
            },
        }),
    })*/

    //
    class FileSystemWritableFileStream extends WritableStream {
        constructor() {
            const answer = super({
                write: async (chunk) => {
                    const file = mapOfFiles.get(this)
                    mapOfFiles?.set?.(this, new File([
                        file,
                        chunk instanceof Blob || chunk instanceof Uint8Array || typeof chunk === 'string'
                            ? chunk
                            : ArrayBuffer.isView(chunk) || chunk instanceof ArrayBuffer
                                ? new Uint8Array(chunk)
                                : chunk instanceof DataView
                                    ? new Uint8Array(chunk.buffer)
                                    : new Uint8Array(new TextEncoder().encode(String(chunk))),
                    ], file.name, {
                        type: file.type,
                        lastModified: file.lastModified,
                    }))
                },
            });
            mapOfFiles?.set?.(answer, new File([], 'Untitled.txt', { type: 'text/plain' }))
        }

        async write(data) {
            const writer = this.getWriter()
            await writer.write(data)
            writer.releaseLock()
        }

        async close() {
            const file = mapOfFiles.get(this)
            if (file != null) {
                const url = URL.createObjectURL(file)

                document.documentElement.append(a)

                a.href = url
                a.download = file.name
                a.type = file.type

                a.click()
                a.remove()

                URL.revokeObjectURL(url)
            }
        }
    }

    return {
        showOpenFilePicker(options = null) {
            const input = document.createElement('input')
            input.type = 'file'
            input.multiple = ( options?.multiple ? true : false);
            input.accept = [].concat(options?.types ?? []).map(getAcceptType).join(',')
            const promise = new Promise((resolve, reject) => {
                input.addEventListener('change', () => {
                    resolve([...input.files].map(getFileHandle))
                    input.value = null;
                    input.files = null;
                }, { once: true })

                input.addEventListener('cancel', () => {
                    reject(new DOMException('The user aborted a request.'))
                }, { once: true })
            })
            input.click()
            return promise;
        },
        async showSaveFilePicker(options = null) {
            const accept = [].concat(
                Object.entries(
                    Object(
                        [].concat(options?.types ?? [])[0]?.accept
                    )
                )
            )[0] || ["text/plain", [".txt"]]

            return getFileHandle(
                new File(
                    [],
                    options?.suggestedName ?? 'Untitled' + (accept?.[1]?.[0] || '.txt'),
                    {
                        type: accept?.[0] || 'text/plain'
                    }
                )
            )
        },
    }
})() : {
    async showOpenFilePicker() {
        return []
    },
    async showSaveFilePicker() {
        return []
    },
}

//
export { showOpenFilePicker, showSaveFilePicker };
