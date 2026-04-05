import { handleDataTransferInputEvent, type shareTargetFormData } from "@rs-core/storage/FileSystem";
import { isInFocus } from "fest/dom";

//
const allowedElements = "ui-tabbed-box";

//
export const implementPasteEvent = (container: HTMLElement | null, handler: (payload: shareTargetFormData) => Promise<void>) => {
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
            handleDataTransferInputEvent(dataTransfer, handler);
        }
    });
}

//
export const implementDropEvent = (container: HTMLElement, handler: (payload: shareTargetFormData) => Promise<void>) => {
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
            handleDataTransferInputEvent(dataTransfer, handler);
        }
    });
}
