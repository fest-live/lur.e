import { isInFocus } from "fest/dom";

//
const allowedElements = "ui-tabbed-box";

//
export const implementPasteEvent = (container: HTMLElement | null, handler: (payload: any) => Promise<void>) => {
    (container || globalThis)?.addEventListener("paste", (event: any) => {
        if (isInFocus(event?.target as HTMLElement, allowedElements)) {
            const dataTransfer: DataTransfer | null = event.clipboardData;
            const items = dataTransfer?.items;
            const files = dataTransfer?.files ?? [];

            //
            if (items || (files && (files?.length > 0))) {
                event.preventDefault();
                event.stopPropagation();
            }

            //
            if (dataTransfer) {
                handler(dataTransfer);
            } else {
                void navigator.clipboard?.read()?.then?.((items) => {
                    if (items && items.length > 0) {
                        handler({
                            items: items as ClipboardItem[],
                            files: files as File[]
                        });
                    }
                }).catch((error) => {
                    console.error("Failed to read clipboard:", error);
                    return null;
                });
            }
        }
    });
}

//
export const implementDropEvent = (container: HTMLElement, handler: (payload: any) => Promise<void>) => {
    container.addEventListener("dragover", (event: DragEvent) => {
        if (isInFocus(event?.target as HTMLElement, allowedElements)) {
            event.preventDefault();
            event.stopPropagation();
        }
    });

    //
    container.addEventListener("drop", (event: DragEvent) => {
        if (isInFocus(event?.target as HTMLElement, allowedElements)) {
            const dataTransfer: DataTransfer | null = (event as any).dataTransfer;
            const files = dataTransfer?.files ?? [];
            const items = dataTransfer?.items;

            //
            if (items || (files && (files?.length > 0))) {
                event.preventDefault();
                event.stopPropagation();
            }

            //
            handler(dataTransfer);
        }
    });
}
