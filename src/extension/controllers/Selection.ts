import { addEvent, removeEvent, setStyleProperty, getBoundingOrientRect } from "fest/dom";
import { makeShiftTrigger } from "./Trigger";
import { bindDraggable } from "./PointerAPI";
import {
    Vector2D, vector2Ref, Rect2D, createRect2D,
    rectCenter, rectContainsPoint, rectIntersects, rectArea,
    clampPointToRect, pointToRectDistance, addVector2D, subtractVector2D
} from "fest/lure";
import { numberRef, affected } from "fest/object";

export interface SelectionOptions {
    target?: HTMLElement;      // Element to attach selection to (default: document.body)
    minSize?: Vector2D;        // Minimum selection size
    maxSize?: Vector2D;        // Maximum selection size
    aspectRatio?: number;      // Fixed aspect ratio
    snapToGrid?: { size: Vector2D, offset: Vector2D }; // Grid snapping
    bounds?: Rect2D;           // Selection bounds
    style?: {
        border?: string;
        background?: string;
        borderRadius?: string;
        zIndex?: number;
    };
    showHandles?: boolean;     // Show resize handles
    onSelect?: (rect: Rect2D) => void;    // Selection callback
    onChange?: (rect: Rect2D) => void;    // Change callback
    onCancel?: () => void;     // Cancel callback
}

/**
 * Selection controller for creating snipping rectangles on screen/canvas
 * Supports drag-to-create, resize, constraints, and grid snapping
 */
export class SelectionController {
    private target: HTMLElement;
    private options: SelectionOptions;
    private selectionRect?: Rect2D;
    private overlayElement?: HTMLElement;
    private isActive = false;
    private startPoint?: Vector2D;
    private currentPoint?: Vector2D;
    private dragStart?: Vector2D;
    private resizeHandle?: string; // 'nw', 'ne', 'sw', 'se', 'n', 's', 'e', 'w'

    constructor(options: SelectionOptions = {}) {
        this.options = {
            target: document.body,
            minSize: vector2Ref(10, 10),
            maxSize: vector2Ref(globalThis.innerWidth, globalThis.innerHeight),
            showHandles: true,
            style: {
                border: '2px solid #007acc',
                background: 'rgba(0, 122, 204, 0.1)',
                borderRadius: '0',
                zIndex: 9999
            },
            ...options
        };
        this.target = this.options.target!;
    }

    /**
     * Start selection mode - attaches event listeners
     */
    start(): void {
        if (this.isActive) return;

        this.isActive = true;
        this.createOverlay();
        this.attachEvents();
    }

    /**
     * Stop selection mode - removes event listeners and overlay
     */
    stop(): void {
        if (!this.isActive) return;

        this.isActive = false;
        this.removeOverlay();
        this.detachEvents();
        this.options.onCancel?.();
    }

    /**
     * Get current selection rectangle
     */
    getSelection(): Rect2D | null {
        return this.selectionRect || null;
    }

    /**
     * Set selection programmatically
     */
    setSelection(rect: Rect2D): void {
        this.selectionRect = rect;
        this.updateOverlay();
        this.options.onChange?.(rect);
    }

    /**
     * Clear current selection
     */
    clearSelection(): void {
        this.selectionRect = undefined;
        this.updateOverlay();
        this.options.onCancel?.();
    }

    private createOverlay(): void {
        if (this.overlayElement) return;

        this.overlayElement = document.createElement('div');
        Object.assign(this.overlayElement.style, {
            position: 'fixed',
            pointerEvents: 'none',
            boxSizing: 'border-box',
            ...this.options.style
        });

        // Create resize handles if enabled
        if (this.options.showHandles) {
            this.createResizeHandles();
        }

        this.target.appendChild(this.overlayElement);
    }

    private createResizeHandles(): void {
        if (!this.overlayElement) return;

        const handles = ['nw', 'ne', 'sw', 'se', 'n', 's', 'e', 'w'];
        const handleElements: HTMLElement[] = [];

        handles.forEach(handle => {
            const handleEl = document.createElement('div');
            handleEl.setAttribute('data-handle', handle);
            Object.assign(handleEl.style, {
                position: 'absolute',
                width: handle.length === 1 ? '100%' : '8px',
                height: handle.length === 1 ? '8px' : '100%',
                background: this.options.style?.border || '#007acc',
                cursor: this.getCursorForHandle(handle),
                pointerEvents: 'auto'
            });

            // Position the handle
            this.positionHandle(handleEl, handle);

            handleEl.addEventListener('pointerdown', (e) => {
                e.stopPropagation();
                this.startResize(handle, vector2Ref(e.clientX, e.clientY));
            });

            this.overlayElement!.appendChild(handleEl);
            handleElements.push(handleEl);
        });
    }

    private positionHandle(handleEl: HTMLElement, handle: string): void {
        const style = handleEl.style;
        switch (handle) {
            case 'nw': style.top = style.left = '0'; break;
            case 'ne': style.top = '0'; style.right = '0'; break;
            case 'sw': style.bottom = style.left = '0'; break;
            case 'se': style.bottom = style.right = '0'; break;
            case 'n': style.top = '0'; style.left = '50%'; style.transform = 'translateX(-50%)'; break;
            case 's': style.bottom = '0'; style.left = '50%'; style.transform = 'translateX(-50%)'; break;
            case 'e': style.top = '50%'; style.right = '0'; style.transform = 'translateY(-50%)'; break;
            case 'w': style.top = '50%'; style.left = '0'; style.transform = 'translateY(-50%)'; break;
        }
    }

    private getCursorForHandle(handle: string): string {
        const cursors: Record<string, string> = {
            'nw': 'nw-resize', 'ne': 'ne-resize', 'sw': 'sw-resize', 'se': 'se-resize',
            'n': 'n-resize', 's': 's-resize', 'e': 'e-resize', 'w': 'w-resize'
        };
        return cursors[handle] || 'pointer';
    }

    private attachEvents(): void {
        this.target.addEventListener('pointerdown', this.handlePointerDown);
        this.target.addEventListener('pointermove', this.handlePointerMove);
        this.target.addEventListener('pointerup', this.handlePointerUp);
        document.addEventListener('keydown', this.handleKeyDown);
    }

    private detachEvents(): void {
        this.target.removeEventListener('pointerdown', this.handlePointerDown);
        this.target.removeEventListener('pointermove', this.handlePointerMove);
        this.target.removeEventListener('pointerup', this.handlePointerUp);
        document.removeEventListener('keydown', this.handleKeyDown);
    }

    private handlePointerDown = (e: PointerEvent): void => {
        if (e.button !== 0) return; // Only left mouse button

        const point = vector2Ref(e.clientX, e.clientY);

        // Check if clicking on a resize handle
        const handle = this.getHandleAtPoint(point);
        if (handle) {
            this.startResize(handle, point);
            return;
        }

        // Check if clicking inside existing selection
        if (this.selectionRect && rectContainsPoint(this.selectionRect, point).value) {
            this.startDrag(point);
            return;
        }

        // Start new selection
        this.startSelection(point);
    };

    private handlePointerMove = (e: PointerEvent): void => {
        const point = vector2Ref(e.clientX, e.clientY);

        if (this.resizeHandle) {
            this.updateResize(point);
        } else if (this.dragStart) {
            this.updateDrag(point);
        } else if (this.startPoint) {
            this.updateSelection(point);
        }
    };

    private handlePointerUp = (e: PointerEvent): void => {
        if (this.resizeHandle) {
            this.endResize();
        } else if (this.dragStart) {
            this.endDrag();
        } else if (this.startPoint) {
            this.endSelection();
        }
    };

    private handleKeyDown = (e: KeyboardEvent): void => {
        if (e.key === 'Escape') {
            this.clearSelection();
        } else if (e.key === 'Enter' && this.selectionRect) {
            this.options.onSelect?.(this.selectionRect);
        }
    };

    private startSelection(point: Vector2D): void {
        this.startPoint = point;
        this.currentPoint = point;
        this.selectionRect = createRect2D(point.x, point.y, 0, 0);
        this.updateOverlay();
    }

    private updateSelection(point: Vector2D): void {
        if (!this.startPoint || !this.selectionRect) return;

        this.currentPoint = point;

        // Calculate selection rectangle
        const minX = Math.min(this.startPoint.x.value, point.x.value);
        const minY = Math.min(this.startPoint.y.value, point.y.value);
        const maxX = Math.max(this.startPoint.x.value, point.x.value);
        const maxY = Math.max(this.startPoint.y.value, point.y.value);

        this.selectionRect.position.x.value = minX;
        this.selectionRect.position.y.value = minY;
        this.selectionRect.size.x.value = maxX - minX;
        this.selectionRect.size.y.value = maxY - minY;

        // Apply constraints
        this.applyConstraints();

        this.updateOverlay();
        this.options.onChange?.(this.selectionRect);
    }

    private endSelection(): void {
        if (!this.selectionRect) return;

        // Ensure minimum size
        if (this.selectionRect.size.x.value < this.options.minSize!.x.value ||
            this.selectionRect.size.y.value < this.options.minSize!.y.value) {
            this.clearSelection();
            return;
        }

        this.options.onSelect?.(this.selectionRect);
        this.startPoint = undefined;
        this.currentPoint = undefined;
    }

    private startDrag(point: Vector2D): void {
        if (!this.selectionRect) return;
        this.dragStart = point;
    }

    private updateDrag(point: Vector2D): void {
        if (!this.dragStart || !this.selectionRect) return;

        const delta = subtractVector2D(point, this.dragStart);
        this.selectionRect.position = addVector2D(this.selectionRect.position, delta);
        this.dragStart = point;

        // Apply bounds constraints
        if (this.options.bounds) {
            this.selectionRect.position = clampPointToRect(this.selectionRect.position, this.options.bounds);
        }

        this.updateOverlay();
        this.options.onChange?.(this.selectionRect);
    }

    private endDrag(): void {
        this.dragStart = undefined;
    }

    private startResize(handle: string, point: Vector2D): void {
        this.resizeHandle = handle;
        this.dragStart = point;
    }

    private updateResize(point: Vector2D): void {
        if (!this.resizeHandle || !this.dragStart || !this.selectionRect) return;

        const delta = subtractVector2D(point, this.dragStart);
        this.resizeFromHandle(this.resizeHandle, delta);
        this.dragStart = point;

        this.applyConstraints();
        this.updateOverlay();
        this.options.onChange?.(this.selectionRect);
    }

    private resizeFromHandle(handle: string, delta: Vector2D): void {
        if (!this.selectionRect) return;

        const rect = this.selectionRect;
        let newX = rect.position.x.value;
        let newY = rect.position.y.value;
        let newWidth = rect.size.x.value;
        let newHeight = rect.size.y.value;

        switch (handle) {
            case 'nw':
                newX += delta.x.value;
                newY += delta.y.value;
                newWidth -= delta.x.value;
                newHeight -= delta.y.value;
                break;
            case 'ne':
                newY += delta.y.value;
                newWidth += delta.x.value;
                newHeight -= delta.y.value;
                break;
            case 'sw':
                newX += delta.x.value;
                newWidth -= delta.x.value;
                newHeight += delta.y.value;
                break;
            case 'se':
                newWidth += delta.x.value;
                newHeight += delta.y.value;
                break;
            case 'n':
                newY += delta.y.value;
                newHeight -= delta.y.value;
                break;
            case 's':
                newHeight += delta.y.value;
                break;
            case 'e':
                newWidth += delta.x.value;
                break;
            case 'w':
                newX += delta.x.value;
                newWidth -= delta.x.value;
                break;
        }

        // Prevent negative dimensions
        if (newWidth < 0) {
            newX += newWidth;
            newWidth = -newWidth;
        }
        if (newHeight < 0) {
            newY += newHeight;
            newHeight = -newHeight;
        }

        rect.position.x.value = newX;
        rect.position.y.value = newY;
        rect.size.x.value = newWidth;
        rect.size.y.value = newY;
    }

    private endResize(): void {
        this.resizeHandle = undefined;
        this.dragStart = undefined;
    }

    private applyConstraints(): void {
        if (!this.selectionRect) return;

        const rect = this.selectionRect;

        // Apply aspect ratio
        if (this.options.aspectRatio) {
            const currentRatio = rect.size.x.value / rect.size.y.value;
            const targetRatio = this.options.aspectRatio;

            if (Math.abs(currentRatio - targetRatio) > 0.01) {
                if (currentRatio > targetRatio) {
                    rect.size.y.value = rect.size.x.value / targetRatio;
                } else {
                    rect.size.x.value = rect.size.y.value * targetRatio;
                }
            }
        }

        // Apply size limits
        rect.size.x.value = Math.max(this.options.minSize!.x.value,
            Math.min(this.options.maxSize!.x.value, rect.size.x.value));
        rect.size.y.value = Math.max(this.options.minSize!.y.value,
            Math.min(this.options.maxSize!.y.value, rect.size.y.value));

        // Apply bounds
        if (this.options.bounds) {
            rect.position.x.value = Math.max(this.options.bounds.position.x.value,
                Math.min(rect.position.x.value,
                    this.options.bounds.position.x.value + this.options.bounds.size.x.value - rect.size.x.value));
            rect.position.y.value = Math.max(this.options.bounds.position.y.value,
                Math.min(rect.position.y.value,
                    this.options.bounds.position.y.value + this.options.bounds.size.y.value - rect.size.y.value));
        }

        // Apply grid snapping
        if (this.options.snapToGrid) {
            const { size: gridSize, offset: gridOffset } = this.options.snapToGrid;
            rect.position.x.value = Math.round((rect.position.x.value - gridOffset.x.value) / gridSize.x.value) *
                gridSize.x.value + gridOffset.x.value;
            rect.position.y.value = Math.round((rect.position.y.value - gridOffset.y.value) / gridSize.y.value) *
                gridSize.y.value + gridOffset.y.value;
        }
    }

    private updateOverlay(): void {
        if (!this.overlayElement) return;

        if (!this.selectionRect) {
            this.overlayElement.style.display = 'none';
            return;
        }

        const rect = this.selectionRect;
        Object.assign(this.overlayElement.style, {
            display: 'block',
            left: `${rect.position.x.value}px`,
            top: `${rect.position.y.value}px`,
            width: `${rect.size.x.value}px`,
            height: `${rect.size.y.value}px`
        });
    }

    private removeOverlay(): void {
        if (this.overlayElement) {
            this.overlayElement.remove();
            this.overlayElement = undefined;
        }
    }

    private getHandleAtPoint(point: Vector2D): string | null {
        if (!this.overlayElement || !this.selectionRect) return null;

        const rect = this.selectionRect;
        const handles = this.overlayElement.querySelectorAll('[data-handle]');
        const handleSize = 8; // pixels

        for (let i = 0; i < handles.length; i++) {
            const handle = handles[i];
            const handleRect = (handle as HTMLElement).getBoundingClientRect();
            if (point.x.value >= handleRect.left && point.x.value <= handleRect.right &&
                point.y.value >= handleRect.top && point.y.value <= handleRect.bottom) {
                return handle.getAttribute('data-handle');
            }
        }

        return null;
    }

    /**
     * Get selection as image data (for canvas/screen capture)
     */
    async getSelectionImage(): Promise<ImageData | null> {
        if (!this.selectionRect) return null;

        // This would require additional canvas/screen capture implementation
        // For now, return null
        return null;
    }

    /**
     * Destroy the selection controller
     */
    destroy(): void {
        this.stop();
        this.clearSelection();
    }
}

// Export default
export default SelectionController;
