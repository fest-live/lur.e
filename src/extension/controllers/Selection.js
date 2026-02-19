import { vector2Ref, createRect2D, rectContainsPoint, clampPointToRect, addVector2D, subtractVector2D } from "fest/lure";
/**
 * Selection controller for creating snipping rectangles on screen/canvas
 * Supports drag-to-create, resize, constraints, and grid snapping
 */
export class SelectionController {
    target;
    options;
    selectionRect;
    overlayElement;
    isActive = false;
    startPoint;
    currentPoint;
    dragStart;
    resizeHandle; // 'nw', 'ne', 'sw', 'se', 'n', 's', 'e', 'w'
    constructor(options = {}) {
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
        this.target = this.options.target;
    }
    /**
     * Start selection mode - attaches event listeners
     */
    start() {
        if (this.isActive)
            return;
        this.isActive = true;
        this.createOverlay();
        this.attachEvents();
    }
    /**
     * Stop selection mode - removes event listeners and overlay
     */
    stop() {
        if (!this.isActive)
            return;
        this.isActive = false;
        this.removeOverlay();
        this.detachEvents();
        this.options.onCancel?.();
    }
    /**
     * Get current selection rectangle
     */
    getSelection() {
        return this.selectionRect || null;
    }
    /**
     * Set selection programmatically
     */
    setSelection(rect) {
        this.selectionRect = rect;
        this.updateOverlay();
        this.options.onChange?.(rect);
    }
    /**
     * Clear current selection
     */
    clearSelection() {
        this.selectionRect = undefined;
        this.updateOverlay();
        this.options.onCancel?.();
    }
    createOverlay() {
        if (this.overlayElement)
            return;
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
    createResizeHandles() {
        if (!this.overlayElement)
            return;
        const handles = ['nw', 'ne', 'sw', 'se', 'n', 's', 'e', 'w'];
        const handleElements = [];
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
            this.overlayElement.appendChild(handleEl);
            handleElements.push(handleEl);
        });
    }
    positionHandle(handleEl, handle) {
        const style = handleEl.style;
        switch (handle) {
            case 'nw':
                style.top = style.left = '0';
                break;
            case 'ne':
                style.top = '0';
                style.right = '0';
                break;
            case 'sw':
                style.bottom = style.left = '0';
                break;
            case 'se':
                style.bottom = style.right = '0';
                break;
            case 'n':
                style.top = '0';
                style.left = '50%';
                style.transform = 'translateX(-50%)';
                break;
            case 's':
                style.bottom = '0';
                style.left = '50%';
                style.transform = 'translateX(-50%)';
                break;
            case 'e':
                style.top = '50%';
                style.right = '0';
                style.transform = 'translateY(-50%)';
                break;
            case 'w':
                style.top = '50%';
                style.left = '0';
                style.transform = 'translateY(-50%)';
                break;
        }
    }
    getCursorForHandle(handle) {
        const cursors = {
            'nw': 'nw-resize', 'ne': 'ne-resize', 'sw': 'sw-resize', 'se': 'se-resize',
            'n': 'n-resize', 's': 's-resize', 'e': 'e-resize', 'w': 'w-resize'
        };
        return cursors[handle] || 'pointer';
    }
    attachEvents() {
        this.target.addEventListener('pointerdown', this.handlePointerDown);
        this.target.addEventListener('pointermove', this.handlePointerMove);
        this.target.addEventListener('pointerup', this.handlePointerUp);
        document.addEventListener('keydown', this.handleKeyDown);
    }
    detachEvents() {
        this.target.removeEventListener('pointerdown', this.handlePointerDown);
        this.target.removeEventListener('pointermove', this.handlePointerMove);
        this.target.removeEventListener('pointerup', this.handlePointerUp);
        document.removeEventListener('keydown', this.handleKeyDown);
    }
    handlePointerDown = (e) => {
        if (e.button !== 0)
            return; // Only left mouse button
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
    handlePointerMove = (e) => {
        const point = vector2Ref(e.clientX, e.clientY);
        if (this.resizeHandle) {
            this.updateResize(point);
        }
        else if (this.dragStart) {
            this.updateDrag(point);
        }
        else if (this.startPoint) {
            this.updateSelection(point);
        }
    };
    handlePointerUp = (e) => {
        if (this.resizeHandle) {
            this.endResize();
        }
        else if (this.dragStart) {
            this.endDrag();
        }
        else if (this.startPoint) {
            this.endSelection();
        }
    };
    handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            this.clearSelection();
        }
        else if (e.key === 'Enter' && this.selectionRect) {
            this.options.onSelect?.(this.selectionRect);
        }
    };
    startSelection(point) {
        this.startPoint = point;
        this.currentPoint = point;
        this.selectionRect = createRect2D(point.x, point.y, 0, 0);
        this.updateOverlay();
    }
    updateSelection(point) {
        if (!this.startPoint || !this.selectionRect)
            return;
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
    endSelection() {
        if (!this.selectionRect)
            return;
        // Ensure minimum size
        if (this.selectionRect.size.x.value < this.options.minSize.x.value ||
            this.selectionRect.size.y.value < this.options.minSize.y.value) {
            this.clearSelection();
            return;
        }
        this.options.onSelect?.(this.selectionRect);
        this.startPoint = undefined;
        this.currentPoint = undefined;
    }
    startDrag(point) {
        if (!this.selectionRect)
            return;
        this.dragStart = point;
    }
    updateDrag(point) {
        if (!this.dragStart || !this.selectionRect)
            return;
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
    endDrag() {
        this.dragStart = undefined;
    }
    startResize(handle, point) {
        this.resizeHandle = handle;
        this.dragStart = point;
    }
    updateResize(point) {
        if (!this.resizeHandle || !this.dragStart || !this.selectionRect)
            return;
        const delta = subtractVector2D(point, this.dragStart);
        this.resizeFromHandle(this.resizeHandle, delta);
        this.dragStart = point;
        this.applyConstraints();
        this.updateOverlay();
        this.options.onChange?.(this.selectionRect);
    }
    resizeFromHandle(handle, delta) {
        if (!this.selectionRect)
            return;
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
    endResize() {
        this.resizeHandle = undefined;
        this.dragStart = undefined;
    }
    applyConstraints() {
        if (!this.selectionRect)
            return;
        const rect = this.selectionRect;
        // Apply aspect ratio
        if (this.options.aspectRatio) {
            const currentRatio = rect.size.x.value / rect.size.y.value;
            const targetRatio = this.options.aspectRatio;
            if (Math.abs(currentRatio - targetRatio) > 0.01) {
                if (currentRatio > targetRatio) {
                    rect.size.y.value = rect.size.x.value / targetRatio;
                }
                else {
                    rect.size.x.value = rect.size.y.value * targetRatio;
                }
            }
        }
        // Apply size limits
        rect.size.x.value = Math.max(this.options.minSize.x.value, Math.min(this.options.maxSize.x.value, rect.size.x.value));
        rect.size.y.value = Math.max(this.options.minSize.y.value, Math.min(this.options.maxSize.y.value, rect.size.y.value));
        // Apply bounds
        if (this.options.bounds) {
            rect.position.x.value = Math.max(this.options.bounds.position.x.value, Math.min(rect.position.x.value, this.options.bounds.position.x.value + this.options.bounds.size.x.value - rect.size.x.value));
            rect.position.y.value = Math.max(this.options.bounds.position.y.value, Math.min(rect.position.y.value, this.options.bounds.position.y.value + this.options.bounds.size.y.value - rect.size.y.value));
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
    updateOverlay() {
        if (!this.overlayElement)
            return;
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
    removeOverlay() {
        if (this.overlayElement) {
            this.overlayElement.remove();
            this.overlayElement = undefined;
        }
    }
    getHandleAtPoint(point) {
        if (!this.overlayElement || !this.selectionRect)
            return null;
        const rect = this.selectionRect;
        const handles = this.overlayElement.querySelectorAll('[data-handle]');
        const handleSize = 8; // pixels
        for (let i = 0; i < handles.length; i++) {
            const handle = handles[i];
            const handleRect = handle.getBoundingClientRect();
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
    async getSelectionImage() {
        if (!this.selectionRect)
            return null;
        // This would require additional canvas/screen capture implementation
        // For now, return null
        return null;
    }
    /**
     * Destroy the selection controller
     */
    destroy() {
        this.stop();
        this.clearSelection();
    }
}
// Export default
export default SelectionController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VsZWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiU2VsZWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUdBLE9BQU8sRUFDTyxVQUFVLEVBQVUsWUFBWSxFQUM5QixpQkFBaUIsRUFDN0IsZ0JBQWdCLEVBQXVCLFdBQVcsRUFBRSxnQkFBZ0IsRUFDdkUsTUFBTSxXQUFXLENBQUM7QUFzQm5COzs7R0FHRztBQUNILE1BQU0sT0FBTyxtQkFBbUI7SUFDcEIsTUFBTSxDQUFjO0lBQ3BCLE9BQU8sQ0FBbUI7SUFDMUIsYUFBYSxDQUFVO0lBQ3ZCLGNBQWMsQ0FBZTtJQUM3QixRQUFRLEdBQUcsS0FBSyxDQUFDO0lBQ2pCLFVBQVUsQ0FBWTtJQUN0QixZQUFZLENBQVk7SUFDeEIsU0FBUyxDQUFZO0lBQ3JCLFlBQVksQ0FBVSxDQUFDLDZDQUE2QztJQUU1RSxZQUFZLFVBQTRCLEVBQUU7UUFDdEMsSUFBSSxDQUFDLE9BQU8sR0FBRztZQUNYLE1BQU0sRUFBRSxRQUFRLENBQUMsSUFBSTtZQUNyQixPQUFPLEVBQUUsVUFBVSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDM0IsT0FBTyxFQUFFLFVBQVUsQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxXQUFXLENBQUM7WUFDbEUsV0FBVyxFQUFFLElBQUk7WUFDakIsS0FBSyxFQUFFO2dCQUNILE1BQU0sRUFBRSxtQkFBbUI7Z0JBQzNCLFVBQVUsRUFBRSx3QkFBd0I7Z0JBQ3BDLFlBQVksRUFBRSxHQUFHO2dCQUNqQixNQUFNLEVBQUUsSUFBSTthQUNmO1lBQ0QsR0FBRyxPQUFPO1NBQ2IsQ0FBQztRQUNGLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFPLENBQUM7SUFDdkMsQ0FBQztJQUVEOztPQUVHO0lBQ0gsS0FBSztRQUNELElBQUksSUFBSSxDQUFDLFFBQVE7WUFBRSxPQUFPO1FBRTFCLElBQUksQ0FBQyxRQUFRLEdBQUcs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LElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUVsQyxRQUFRLE1BQU0sRUFBRSxDQUFDO1lBQ2IsS0FBSyxJQUFJO2dCQUNMLElBQUksSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztnQkFDdEIsSUFBSSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO2dCQUN0QixRQUFRLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7Z0JBQzFCLFNBQVMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztnQkFDM0IsTUFBTTtZQUNWLEtBQUssSUFBSTtnQkFDTCxJQUFJLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7Z0JBQ3RCLFFBQVEsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztnQkFDMUIsU0FBUyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO2dCQUMzQixNQUFNO1lBQ1YsS0FBSyxJQUFJO2dCQUNMLElBQUksSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztnQkFDdEIsUUFBUSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO2dCQUMxQixTQUFTLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7Z0JBQzNCLE1BQU07WUFDVixLQUFLLElBQUk7Z0JBQ0wsUUFBUSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO2dCQUMxQixTQUFTLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7Z0JBQzNCLE1BQU07WUFDVixLQUFLLEdBQUc7Z0JBQ0osSUFBSSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO2dCQUN0QixTQUFTLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7Z0JBQzNCLE1BQU07WUFDVixLQUFLLEdBQUc7Z0JBQ0osU0FBUyxJQUFJ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LENBQUMsS0FBSyxFQUN0RCxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUVoRSxlQUFlO1FBQ2YsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ3RCLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUNqRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFDMUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUN0RyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFDakUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQzFCLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDMUcsQ0FBQztRQUVELHNCQUFzQjtRQUN0QixJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDMUIsTUFBTSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDO1lBQ3ZFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7Z0JBQy9GLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1lBQzFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7Z0JBQy9GLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQzlDLENBQUM7SUFDTCxDQUFDO0lBRU8sYUFBYTtRQUNqQixJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWM7WUFBRSxPQUFPO1FBRWpDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDdEIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztZQUMzQyxPQUFPO1FBQ1gsQ0FBQztRQUVELE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7UUFDaEMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRTtZQUNyQyxPQUFPLEVBQUUsT0FBTztZQUNoQixJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUk7WUFDbEMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJO1lBQ2pDLEtBQUssRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSTtZQUMvQixNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUk7U0FDbkMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVPLGFBQWE7UUFDakIsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDdEIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUM3QixJQUFJLENBQUMsY0FBYyxHQUFHLFNBQVMsQ0FBQztRQUNwQyxDQUFDO0lBQ0wsQ0FBQztJQUVPLGdCQUFnQixDQUFDLEtBQWU7UUFDcEMsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYTtZQUFFLE9BQU8sSUFBSSxDQUFDO1FBRTdELE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7UUFDaEMsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUN0RSxNQUFNLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQyxTQUFTO1FBRS9CLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDdEMsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFCLE1BQU0sVUFBVSxHQUFJLE1BQXNCLENBQUMscUJBQXFCLEVBQUUsQ0FBQztZQUNuRSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLFVBQVUsQ0FBQyxJQUFJLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksVUFBVSxDQUFDLEtBQUs7Z0JBQ3JFLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLFVBQVUsQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUN4RSxPQUFPLE1BQU0sQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDOUMsQ0FBQztRQUNMLENBQUM7UUFFRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQ7O09BRUc7SUFDSCxLQUFLLENBQUMsaUJBQWlCO1FBQ25CLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYTtZQUFFLE9BQU8sSUFBSSxDQUFDO1FBRXJDLHFFQUFxRTtRQUNyRSx1QkFBdUI7UUFDdkIsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVEOztPQUVHO0lBQ0gsT0FBTztRQUNILElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNaLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUMxQixDQUFDO0NBQ0o7QUFFRCxpQkFBaUI7QUFDakIsZUFBZSxtQkFBbUIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGFkZEV2ZW50LCByZW1vdmVFdmVudCwgc2V0U3R5bGVQcm9wZXJ0eSwgZ2V0Qm91bmRpbmdPcmllbnRSZWN0IH0gZnJvbSBcImZlc3QvZG9tXCI7XG5pbXBvcnQgeyBtYWtlU2hpZnRUcmlnZ2VyIH0gZnJvbSBcIi4vVHJpZ2dlclwiO1xuaW1wb3J0IHsgYmluZERyYWdnYWJsZSB9IGZyb20gXCIuL1BvaW50ZXJBUElcIjtcbmltcG9ydCB7XG4gICAgVmVjdG9yMkQsIHZlY3RvcjJSZWYsIFJlY3QyRCwgY3JlYXRlUmVjdDJELFxuICAgIHJlY3RDZW50ZXIsIHJlY3RDb250YWluc1BvaW50LCByZWN0SW50ZXJzZWN0cywgcmVjdEFyZWEsXG4gICAgY2xhbXBQb2ludFRvUmVjdCwgcG9pbnRUb1JlY3REaXN0YW5jZSwgYWRkVmVjdG9yMkQsIHN1YnRyYWN0VmVjdG9yMkRcbn0gZnJvbSBcImZlc3QvbHVyZVwiO1xuaW1wb3J0IHsgbnVtYmVyUmVmLCBhZmZlY3RlZCB9IGZyb20gXCJmZXN0L29iamVjdFwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIFNlbGVjdGlvbk9wdGlvbnMge1xuICAgIHRhcmdldD86IEhUTUxFbGVtZW50OyAgICAgIC8vIEVsZW1lbnQgdG8gYXR0YWNoIHNlbGVjdGlvbiB0byAoZGVmYXVsdDogZG9jdW1lbnQuYm9keSlcbiAgICBtaW5TaXplPzogVmVjdG9yMkQ7ICAgICAgICAvLyBNaW5pbXVtIHNlbGVjdGlvbiBzaXplXG4gICAgbWF4U2l6ZT86IFZlY3RvcjJEOyAgICAgICAgLy8gTWF4aW11bSBzZWxlY3Rpb24gc2l6ZVxuICAgIGFzcGVjdFJhdGlvPzogbnVtYmVyOyAgICAgIC8vIEZpeGVkIGFzcGVjdCByYXRpb1xuICAgIHNuYXBUb0dyaWQ/OiB7IHNpemU6IFZlY3RvcjJELCBvZmZzZXQ6IFZlY3RvcjJEIH07IC8vIEdyaWQgc25hcHBpbmdcbiAgICBib3VuZHM/OiBSZWN0MkQ7ICAgICAgICAgICAvLyBTZWxlY3Rpb24gYm91bmRzXG4gICAgc3R5bGU/OiB7XG4gICAgICAgIGJvcmRlcj86IHN0cmluZztcbiAgICAgICAgYmFja2dyb3VuZD86IHN0cmluZztcbiAgICAgICAgYm9yZGVyUmFkaXVzPzogc3RyaW5nO1xuICAgICAgICB6SW5kZXg/OiBudW1iZXI7XG4gICAgfTtcbiAgICBzaG93SGFuZGxlcz86IGJvb2xlYW47ICAgICAvLyBTaG93IHJlc2l6ZSBoYW5kbGVzXG4gICAgb25TZWxlY3Q/OiAocmVjdDogUmVjdDJEKSA9PiB2b2lkOyAgICAvLyBTZWxlY3Rpb24gY2FsbGJhY2tcbiAgICBvbkNoYW5nZT86IChyZWN0OiBSZWN0MkQpID0+IHZvaWQ7ICAgIC8vIENoYW5nZSBjYWxsYmFja1xuICAgIG9uQ2FuY2VsPzogKCkgPT4gdm9pZDsgICAgIC8vIENhbmNlbCBjYWxsYmFja1xufVxuXG4vKipcbiAqIFNlbGVjdGlvbiBjb250cm9sbGVyIGZvciBjcmVhdGluZyBzbmlwcGluZyByZWN0YW5nbGVzIG9uIHNjcmVlbi9jYW52YXNcbiAqIFN1cHBvcnRzIGRyYWctdG8tY3JlYXRlLCByZXNpemUsIGNvbnN0cmFpbnRzLCBhbmQgZ3JpZCBzbmFwcGluZ1xuICovXG5leHBvcnQgY2xhc3MgU2VsZWN0aW9uQ29udHJvbGxlciB7XG4gICAgcHJpdmF0ZSB0YXJnZXQ6IEhUTUxFbGVtZW50O1xuICAgIHByaXZhdGUgb3B0aW9uczogU2VsZWN0aW9uT3B0aW9ucztcbiAgICBwcml2YXRlIHNlbGVjdGlvblJlY3Q/OiBSZWN0MkQ7XG4gICAgcHJpdmF0ZSBvdmVybGF5RWxlbWVudD86IEhUTUxFbGVtZW50O1xuICAgIHByaXZhdGUgaXNBY3RpdmUgPSBmYWxzZTtcbiAgICBwcml2YXRlIHN0YXJ0UG9pbnQ/OiBWZWN0b3IyRDtcbiAgICBwcml2YXRlIGN1cnJlbnRQb2ludD86IFZlY3RvcjJEO1xuICAgIHByaXZhdGUgZHJhZ1N0YXJ0PzogVmVjdG9yMkQ7XG4gICAgcHJpdmF0ZSByZXNpemVIYW5kbGU/OiBzdHJpbmc7IC8vICdudycsICduZScsICdzdycsICdzZScsICduJywgJ3MnLCAnZScsICd3J1xuXG4gICAgY29uc3RydWN0b3Iob3B0aW9uczogU2VsZWN0aW9uT3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IHtcbiAgICAgICAgICAgIHRhcmdldDogZG9jdW1lbnQuYm9keSxcbiAgICAgICAgICAgIG1pblNpemU6IHZlY3RvcjJSZWYoMTAsIDEwKSxcbiAgICAgICAgICAgIG1heFNpemU6IHZlY3RvcjJSZWYoZ2xvYmFsVGhpcy5pbm5lcldpZHRoLCBnbG9iYWxUaGlzLmlubmVySGVpZ2h0KSxcbiAgICAgICAgICAgIHNob3dIYW5kbGVzOiB0cnVlLFxuICAgICAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgICAgICBib3JkZXI6ICcycHggc29saWQgIzAwN2FjYycsXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZDogJ3JnYmEoMCwgMTIyLCAyMDQsIDAuMSknLFxuICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzAnLFxuICAgICAgICAgICAgICAgIHpJbmRleDogOTk5OVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC4uLm9wdGlvbnNcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy50YXJnZXQgPSB0aGlzLm9wdGlvbnMudGFyZ2V0ITtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTdGFydCBzZWxlY3Rpb24gbW9kZSAtIGF0dGFjaGVzIGV2ZW50IGxpc3RlbmVyc1xuICAgICAqL1xuICAgIHN0YXJ0KCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5pc0FjdGl2ZSkgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMuaXNBY3RpdmUgPSB0cnVlO1xuICAgICAgICB0aGlzLmNyZWF0ZU92ZXJsYXkoKTtcbiAgICAgICAgdGhpcy5hdHRhY2hFdmVudHMoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTdG9wIHNlbGVjdGlvbiBtb2RlIC0gcmVtb3ZlcyBldmVudCBsaXN0ZW5lcnMgYW5kIG92ZXJsYXlcbiAgICAgKi9cbiAgICBzdG9wKCk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMuaXNBY3RpdmUpIHJldHVybjtcblxuICAgICAgICB0aGlzLmlzQWN0aXZlID0gZmFsc2U7XG4gICAgICAgIHRoaXMucmVtb3ZlT3ZlcmxheSgpO1xuICAgICAgICB0aGlzLmRldGFjaEV2ZW50cygpO1xuICAgICAgICB0aGlzLm9wdGlvbnMub25DYW5jZWw/LigpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBjdXJyZW50IHNlbGVjdGlvbiByZWN0YW5nbGVcbiAgICAgKi9cbiAgICBnZXRTZWxlY3Rpb24oKTogUmVjdDJEIHwgbnVsbCB7XG4gICAgICAgIHJldHVybiB0aGlzLnNlbGVjdGlvblJlY3QgfHwgbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXQgc2VsZWN0aW9uIHByb2dyYW1tYXRpY2FsbHlcbiAgICAgKi9cbiAgICBzZXRTZWxlY3Rpb24ocmVjdDogUmVjdDJEKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc2VsZWN0aW9uUmVjdCA9IHJlY3Q7XG4gICAgICAgIHRoaXMudXBkYXRlT3ZlcmxheSgpO1xuICAgICAgICB0aGlzLm9wdGlvbnMub25DaGFuZ2U/LihyZWN0KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDbGVhciBjdXJyZW50IHNlbGVjdGlvblxuICAgICAqL1xuICAgIGNsZWFyU2VsZWN0aW9uKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnNlbGVjdGlvblJlY3QgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMudXBkYXRlT3ZlcmxheSgpO1xuICAgICAgICB0aGlzLm9wdGlvbnMub25DYW5jZWw/LigpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlT3ZlcmxheSgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMub3ZlcmxheUVsZW1lbnQpIHJldHVybjtcblxuICAgICAgICB0aGlzLm92ZXJsYXlFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcy5vdmVybGF5RWxlbWVudC5zdHlsZSwge1xuICAgICAgICAgICAgcG9zaXRpb246ICdmaXhlZCcsXG4gICAgICAgICAgICBwb2ludGVyRXZlbnRzOiAnbm9uZScsXG4gICAgICAgICAgICBib3hTaXppbmc6ICdib3JkZXItYm94JyxcbiAgICAgICAgICAgIC4uLnRoaXMub3B0aW9ucy5zdHlsZVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBDcmVhdGUgcmVzaXplIGhhbmRsZXMgaWYgZW5hYmxlZFxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNob3dIYW5kbGVzKSB7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVJlc2l6ZUhhbmRsZXMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudGFyZ2V0LmFwcGVuZENoaWxkKHRoaXMub3ZlcmxheUVsZW1lbnQpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlUmVzaXplSGFuZGxlcygpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLm92ZXJsYXlFbGVtZW50KSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgaGFuZGxlcyA9IFsnbncnLCAnbmUnLCAnc3cnLCAnc2UnLCAnbicsICdzJywgJ2UnLCAndyddO1xuICAgICAgICBjb25zdCBoYW5kbGVFbGVtZW50czogSFRNTEVsZW1lbnRbXSA9IFtdO1xuXG4gICAgICAgIGhhbmRsZXMuZm9yRWFjaChoYW5kbGUgPT4ge1xuICAgICAgICAgICAgY29uc3QgaGFuZGxlRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIGhhbmRsZUVsLnNldEF0dHJpYnV0ZSgnZGF0YS1oYW5kbGUnLCBoYW5kbGUpO1xuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihoYW5kbGVFbC5zdHlsZSwge1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiBoYW5kbGUubGVuZ3RoID09PSAxID8gJzEwMCUnIDogJzhweCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiBoYW5kbGUubGVuZ3RoID09PSAxID8gJzhweCcgOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZDogdGhpcy5vcHRpb25zLnN0eWxlPy5ib3JkZXIgfHwgJyMwMDdhY2MnLFxuICAgICAgICAgICAgICAgIGN1cnNvcjogdGhpcy5nZXRDdXJzb3JGb3JIYW5kbGUoaGFuZGxlKSxcbiAgICAgICAgICAgICAgICBwb2ludGVyRXZlbnRzOiAnYXV0bydcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBQb3NpdGlvbiB0aGUgaGFuZGxlXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uSGFuZGxlKGhhbmRsZUVsLCBoYW5kbGUpO1xuXG4gICAgICAgICAgICBoYW5kbGVFbC5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVyZG93bicsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0UmVzaXplKGhhbmRsZSwgdmVjdG9yMlJlZihlLmNsaWVudFgsIGUuY2xpZW50WSkpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMub3ZlcmxheUVsZW1lbnQhLmFwcGVuZENoaWxkKGhhbmRsZUVsKTtcbiAgICAgICAgICAgIGhhbmRsZUVsZW1lbnRzLnB1c2goaGFuZGxlRWwpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHBvc2l0aW9uSGFuZGxlKGhhbmRsZUVsOiBIVE1MRWxlbWVudCwgaGFuZGxlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgY29uc3Qgc3R5bGUgPSBoYW5kbGVFbC5zdHlsZTtcbiAgICAgICAgc3dpdGNoIChoYW5kbGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ253Jzogc3R5bGUudG9wID0gc3R5bGUubGVmdCA9ICcwJzsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICduZSc6IHN0eWxlLnRvcCA9ICcwJzsgc3R5bGUucmlnaHQgPSAnMCc7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnc3cnOiBzdHlsZS5ib3R0b20gPSBzdHlsZS5sZWZ0ID0gJzAnOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3NlJzogc3R5bGUuYm90dG9tID0gc3R5bGUucmlnaHQgPSAnMCc7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnbic6IHN0eWxlLnRvcCA9ICcwJzsgc3R5bGUubGVmdCA9ICc1MCUnOyBzdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlWCgtNTAlKSc7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAncyc6IHN0eWxlLmJvdHRvbSA9ICcwJzsgc3R5bGUubGVmdCA9ICc1MCUnOyBzdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlWCgtNTAlKSc7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZSc6IHN0eWxlLnRvcCA9ICc1MCUnOyBzdHlsZS5yaWdodCA9ICcwJzsgc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVkoLTUwJSknOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3cnOiBzdHlsZS50b3AgPSAnNTAlJzsgc3R5bGUubGVmdCA9ICcwJzsgc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVkoLTUwJSknOyBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0Q3Vyc29yRm9ySGFuZGxlKGhhbmRsZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgY29uc3QgY3Vyc29yczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgICAgICAgICAgICdudyc6ICdudy1yZXNpemUnLCAnbmUnOiAnbmUtcmVzaXplJywgJ3N3JzogJ3N3LXJlc2l6ZScsICdzZSc6ICdzZS1yZXNpemUnLFxuICAgICAgICAgICAgJ24nOiAnbi1yZXNpemUnLCAncyc6ICdzLXJlc2l6ZScsICdlJzogJ2UtcmVzaXplJywgJ3cnOiAndy1yZXNpemUnXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBjdXJzb3JzW2hhbmRsZV0gfHwgJ3BvaW50ZXInO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXR0YWNoRXZlbnRzKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVyZG93bicsIHRoaXMuaGFuZGxlUG9pbnRlckRvd24pO1xuICAgICAgICB0aGlzLnRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVybW92ZScsIHRoaXMuaGFuZGxlUG9pbnRlck1vdmUpO1xuICAgICAgICB0aGlzLnRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVydXAnLCB0aGlzLmhhbmRsZVBvaW50ZXJVcCk7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmhhbmRsZUtleURvd24pO1xuICAgIH1cblxuICAgIHByaXZhdGUgZGV0YWNoRXZlbnRzKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKCdwb2ludGVyZG93bicsIHRoaXMuaGFuZGxlUG9pbnRlckRvd24pO1xuICAgICAgICB0aGlzLnRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKCdwb2ludGVybW92ZScsIHRoaXMuaGFuZGxlUG9pbnRlck1vdmUpO1xuICAgICAgICB0aGlzLnRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKCdwb2ludGVydXAnLCB0aGlzLmhhbmRsZVBvaW50ZXJVcCk7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmhhbmRsZUtleURvd24pO1xuICAgIH1cblxuICAgIHByaXZhdGUgaGFuZGxlUG9pbnRlckRvd24gPSAoZTogUG9pbnRlckV2ZW50KTogdm9pZCA9PiB7XG4gICAgICAgIGlmIChlLmJ1dHRvbiAhPT0gMCkgcmV0dXJuOyAvLyBPbmx5IGxlZnQgbW91c2UgYnV0dG9uXG5cbiAgICAgICAgY29uc3QgcG9pbnQgPSB2ZWN0b3IyUmVmKGUuY2xpZW50WCwgZS5jbGllbnRZKTtcblxuICAgICAgICAvLyBDaGVjayBpZiBjbGlja2luZyBvbiBhIHJlc2l6ZSBoYW5kbGVcbiAgICAgICAgY29uc3QgaGFuZGxlID0gdGhpcy5nZXRIYW5kbGVBdFBvaW50KHBvaW50KTtcbiAgICAgICAgaWYgKGhhbmRsZSkge1xuICAgICAgICAgICAgdGhpcy5zdGFydFJlc2l6ZShoYW5kbGUsIHBvaW50KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENoZWNrIGlmIGNsaWNraW5nIGluc2lkZSBleGlzdGluZyBzZWxlY3Rpb25cbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0aW9uUmVjdCAmJiByZWN0Q29udGFpbnNQb2ludCh0aGlzLnNlbGVjdGlvblJlY3QsIHBvaW50KS52YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5zdGFydERyYWcocG9pbnQpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU3RhcnQgbmV3IHNlbGVjdGlvblxuICAgICAgICB0aGlzLnN0YXJ0U2VsZWN0aW9uKHBvaW50KTtcbiAgICB9O1xuXG4gICAgcHJpdmF0ZSBoYW5kbGVQb2ludGVyTW92ZSA9IChlOiBQb2ludGVyRXZlbnQpOiB2b2lkID0+IHtcbiAgICAgICAgY29uc3QgcG9pbnQgPSB2ZWN0b3IyUmVmKGUuY2xpZW50WCwgZS5jbGllbnRZKTtcblxuICAgICAgICBpZiAodGhpcy5yZXNpemVIYW5kbGUpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUmVzaXplKHBvaW50KTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmRyYWdTdGFydCkge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVEcmFnKHBvaW50KTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnN0YXJ0UG9pbnQpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU2VsZWN0aW9uKHBvaW50KTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBwcml2YXRlIGhhbmRsZVBvaW50ZXJVcCA9IChlOiBQb2ludGVyRXZlbnQpOiB2b2lkID0+IHtcbiAgICAgICAgaWYgKHRoaXMucmVzaXplSGFuZGxlKSB7XG4gICAgICAgICAgICB0aGlzLmVuZFJlc2l6ZSgpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZHJhZ1N0YXJ0KSB7XG4gICAgICAgICAgICB0aGlzLmVuZERyYWcoKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnN0YXJ0UG9pbnQpIHtcbiAgICAgICAgICAgIHRoaXMuZW5kU2VsZWN0aW9uKCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgcHJpdmF0ZSBoYW5kbGVLZXlEb3duID0gKGU6IEtleWJvYXJkRXZlbnQpOiB2b2lkID0+IHtcbiAgICAgICAgaWYgKGUua2V5ID09PSAnRXNjYXBlJykge1xuICAgICAgICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xuICAgICAgICB9IGVsc2UgaWYgKGUua2V5ID09PSAnRW50ZXInICYmIHRoaXMuc2VsZWN0aW9uUmVjdCkge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zLm9uU2VsZWN0Py4odGhpcy5zZWxlY3Rpb25SZWN0KTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBwcml2YXRlIHN0YXJ0U2VsZWN0aW9uKHBvaW50OiBWZWN0b3IyRCk6IHZvaWQge1xuICAgICAgICB0aGlzLnN0YXJ0UG9pbnQgPSBwb2ludDtcbiAgICAgICAgdGhpcy5jdXJyZW50UG9pbnQgPSBwb2ludDtcbiAgICAgICAgdGhpcy5zZWxlY3Rpb25SZWN0ID0gY3JlYXRlUmVjdDJEKHBvaW50LngsIHBvaW50LnksIDAsIDApO1xuICAgICAgICB0aGlzLnVwZGF0ZU92ZXJsYXkoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZVNlbGVjdGlvbihwb2ludDogVmVjdG9yMkQpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLnN0YXJ0UG9pbnQgfHwgIXRoaXMuc2VsZWN0aW9uUmVjdCkgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMuY3VycmVudFBvaW50ID0gcG9pbnQ7XG5cbiAgICAgICAgLy8gQ2FsY3VsYXRlIHNlbGVjdGlvbiByZWN0YW5nbGVcbiAgICAgICAgY29uc3QgbWluWCA9IE1hdGgubWluKHRoaXMuc3RhcnRQb2ludC54LnZhbHVlLCBwb2ludC54LnZhbHVlKTtcbiAgICAgICAgY29uc3QgbWluWSA9IE1hdGgubWluKHRoaXMuc3RhcnRQb2ludC55LnZhbHVlLCBwb2ludC55LnZhbHVlKTtcbiAgICAgICAgY29uc3QgbWF4WCA9IE1hdGgubWF4KHRoaXMuc3RhcnRQb2ludC54LnZhbHVlLCBwb2ludC54LnZhbHVlKTtcbiAgICAgICAgY29uc3QgbWF4WSA9IE1hdGgubWF4KHRoaXMuc3RhcnRQb2ludC55LnZhbHVlLCBwb2ludC55LnZhbHVlKTtcblxuICAgICAgICB0aGlzLnNlbGVjdGlvblJlY3QucG9zaXRpb24ueC52YWx1ZSA9IG1pblg7XG4gICAgICAgIHRoaXMuc2VsZWN0aW9uUmVjdC5wb3NpdGlvbi55LnZhbHVlID0gbWluWTtcbiAgICAgICAgdGhpcy5zZWxlY3Rpb25SZWN0LnNpemUueC52YWx1ZSA9IG1heFggLSBtaW5YO1xuICAgICAgICB0aGlzLnNlbGVjdGlvblJlY3Quc2l6ZS55LnZhbHVlID0gbWF4WSAtIG1pblk7XG5cbiAgICAgICAgLy8gQXBwbHkgY29uc3RyYWludHNcbiAgICAgICAgdGhpcy5hcHBseUNvbnN0cmFpbnRzKCk7XG5cbiAgICAgICAgdGhpcy51cGRhdGVPdmVybGF5KCk7XG4gICAgICAgIHRoaXMub3B0aW9ucy5vbkNoYW5nZT8uKHRoaXMuc2VsZWN0aW9uUmVjdCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBlbmRTZWxlY3Rpb24oKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5zZWxlY3Rpb25SZWN0KSByZXR1cm47XG5cbiAgICAgICAgLy8gRW5zdXJlIG1pbmltdW0gc2l6ZVxuICAgICAgICBpZiAodGhpcy5zZWxlY3Rpb25SZWN0LnNpemUueC52YWx1ZSA8IHRoaXMub3B0aW9ucy5taW5TaXplIS54LnZhbHVlIHx8XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGlvblJlY3Quc2l6ZS55LnZhbHVlIDwgdGhpcy5vcHRpb25zLm1pblNpemUhLnkudmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuY2xlYXJTZWxlY3Rpb24oKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMub3B0aW9ucy5vblNlbGVjdD8uKHRoaXMuc2VsZWN0aW9uUmVjdCk7XG4gICAgICAgIHRoaXMuc3RhcnRQb2ludCA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5jdXJyZW50UG9pbnQgPSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGFydERyYWcocG9pbnQ6IFZlY3RvcjJEKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5zZWxlY3Rpb25SZWN0KSByZXR1cm47XG4gICAgICAgIHRoaXMuZHJhZ1N0YXJ0ID0gcG9pbnQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVEcmFnKHBvaW50OiBWZWN0b3IyRCk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMuZHJhZ1N0YXJ0IHx8ICF0aGlzLnNlbGVjdGlvblJlY3QpIHJldHVybjtcblxuICAgICAgICBjb25zdCBkZWx0YSA9IHN1YnRyYWN0VmVjdG9yMkQocG9pbnQsIHRoaXMuZHJhZ1N0YXJ0KTtcbiAgICAgICAgdGhpcy5zZWxlY3Rpb25SZWN0LnBvc2l0aW9uID0gYWRkVmVjdG9yMkQodGhpcy5zZWxlY3Rpb25SZWN0LnBvc2l0aW9uLCBkZWx0YSk7XG4gICAgICAgIHRoaXMuZHJhZ1N0YXJ0ID0gcG9pbnQ7XG5cbiAgICAgICAgLy8gQXBwbHkgYm91bmRzIGNvbnN0cmFpbnRzXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuYm91bmRzKSB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGlvblJlY3QucG9zaXRpb24gPSBjbGFtcFBvaW50VG9SZWN0KHRoaXMuc2VsZWN0aW9uUmVjdC5wb3NpdGlvbiwgdGhpcy5vcHRpb25zLmJvdW5kcyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnVwZGF0ZU92ZXJsYXkoKTtcbiAgICAgICAgdGhpcy5vcHRpb25zLm9uQ2hhbmdlPy4odGhpcy5zZWxlY3Rpb25SZWN0KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGVuZERyYWcoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZHJhZ1N0YXJ0ID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHByaXZhdGUgc3RhcnRSZXNpemUoaGFuZGxlOiBzdHJpbmcsIHBvaW50OiBWZWN0b3IyRCk6IHZvaWQge1xuICAgICAgICB0aGlzLnJlc2l6ZUhhbmRsZSA9IGhhbmRsZTtcbiAgICAgICAgdGhpcy5kcmFnU3RhcnQgPSBwb2ludDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZVJlc2l6ZShwb2ludDogVmVjdG9yMkQpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLnJlc2l6ZUhhbmRsZSB8fCAhdGhpcy5kcmFnU3RhcnQgfHwgIXRoaXMuc2VsZWN0aW9uUmVjdCkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGRlbHRhID0gc3VidHJhY3RWZWN0b3IyRChwb2ludCwgdGhpcy5kcmFnU3RhcnQpO1xuICAgICAgICB0aGlzLnJlc2l6ZUZyb21IYW5kbGUodGhpcy5yZXNpemVIYW5kbGUsIGRlbHRhKTtcbiAgICAgICAgdGhpcy5kcmFnU3RhcnQgPSBwb2ludDtcblxuICAgICAgICB0aGlzLmFwcGx5Q29uc3RyYWludHMoKTtcbiAgICAgICAgdGhpcy51cGRhdGVPdmVybGF5KCk7XG4gICAgICAgIHRoaXMub3B0aW9ucy5vbkNoYW5nZT8uKHRoaXMuc2VsZWN0aW9uUmVjdCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZXNpemVGcm9tSGFuZGxlKGhhbmRsZTogc3RyaW5nLCBkZWx0YTogVmVjdG9yMkQpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLnNlbGVjdGlvblJlY3QpIHJldHVybjtcblxuICAgICAgICBjb25zdCByZWN0ID0gdGhpcy5zZWxlY3Rpb25SZWN0O1xuICAgICAgICBsZXQgbmV3WCA9IHJlY3QucG9zaXRpb24ueC52YWx1ZTtcbiAgICAgICAgbGV0IG5ld1kgPSByZWN0LnBvc2l0aW9uLnkudmFsdWU7XG4gICAgICAgIGxldCBuZXdXaWR0aCA9IHJlY3Quc2l6ZS54LnZhbHVlO1xuICAgICAgICBsZXQgbmV3SGVpZ2h0ID0gcmVjdC5zaXplLnkudmFsdWU7XG5cbiAgICAgICAgc3dpdGNoIChoYW5kbGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ253JzpcbiAgICAgICAgICAgICAgICBuZXdYICs9IGRlbHRhLngudmFsdWU7XG4gICAgICAgICAgICAgICAgbmV3WSArPSBkZWx0YS55LnZhbHVlO1xuICAgICAgICAgICAgICAgIG5ld1dpZHRoIC09IGRlbHRhLngudmFsdWU7XG4gICAgICAgICAgICAgICAgbmV3SGVpZ2h0IC09IGRlbHRhLnkudmFsdWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICduZSc6XG4gICAgICAgICAgICAgICAgbmV3WSArPSBkZWx0YS55LnZhbHVlO1xuICAgICAgICAgICAgICAgIG5ld1dpZHRoICs9IGRlbHRhLngudmFsdWU7XG4gICAgICAgICAgICAgICAgbmV3SGVpZ2h0IC09IGRlbHRhLnkudmFsdWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdzdyc6XG4gICAgICAgICAgICAgICAgbmV3WCArPSBkZWx0YS54LnZhbHVlO1xuICAgICAgICAgICAgICAgIG5ld1dpZHRoIC09IGRlbHRhLngudmFsdWU7XG4gICAgICAgICAgICAgICAgbmV3SGVpZ2h0ICs9IGRlbHRhLnkudmFsdWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdzZSc6XG4gICAgICAgICAgICAgICAgbmV3V2lkdGggKz0gZGVsdGEueC52YWx1ZTtcbiAgICAgICAgICAgICAgICBuZXdIZWlnaHQgKz0gZGVsdGEueS52YWx1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ24nOlxuICAgICAgICAgICAgICAgIG5ld1kgKz0gZGVsdGEueS52YWx1ZTtcbiAgICAgICAgICAgICAgICBuZXdIZWlnaHQgLT0gZGVsdGEueS52YWx1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3MnOlxuICAgICAgICAgICAgICAgIG5ld0hlaWdodCArPSBkZWx0YS55LnZhbHVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZSc6XG4gICAgICAgICAgICAgICAgbmV3V2lkdGggKz0gZGVsdGEueC52YWx1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3cnOlxuICAgICAgICAgICAgICAgIG5ld1ggKz0gZGVsdGEueC52YWx1ZTtcbiAgICAgICAgICAgICAgICBuZXdXaWR0aCAtPSBkZWx0YS54LnZhbHVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUHJldmVudCBuZWdhdGl2ZSBkaW1lbnNpb25zXG4gICAgICAgIGlmIChuZXdXaWR0aCA8IDApIHtcbiAgICAgICAgICAgIG5ld1ggKz0gbmV3V2lkdGg7XG4gICAgICAgICAgICBuZXdXaWR0aCA9IC1uZXdXaWR0aDtcbiAgICAgICAgfVxuICAgICAgICBpZiAobmV3SGVpZ2h0IDwgMCkge1xuICAgICAgICAgICAgbmV3WSArPSBuZXdIZWlnaHQ7XG4gICAgICAgICAgICBuZXdIZWlnaHQgPSAtbmV3SGVpZ2h0O1xuICAgICAgICB9XG5cbiAgICAgICAgcmVjdC5wb3NpdGlvbi54LnZhbHVlID0gbmV3WDtcbiAgICAgICAgcmVjdC5wb3NpdGlvbi55LnZhbHVlID0gbmV3WTtcbiAgICAgICAgcmVjdC5zaXplLngudmFsdWUgPSBuZXdXaWR0aDtcbiAgICAgICAgcmVjdC5zaXplLnkudmFsdWUgPSBuZXdZO1xuICAgIH1cblxuICAgIHByaXZhdGUgZW5kUmVzaXplKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnJlc2l6ZUhhbmRsZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5kcmFnU3RhcnQgPSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhcHBseUNvbnN0cmFpbnRzKCk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMuc2VsZWN0aW9uUmVjdCkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IHJlY3QgPSB0aGlzLnNlbGVjdGlvblJlY3Q7XG5cbiAgICAgICAgLy8gQXBwbHkgYXNwZWN0IHJhdGlvXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuYXNwZWN0UmF0aW8pIHtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRSYXRpbyA9IHJlY3Quc2l6ZS54LnZhbHVlIC8gcmVjdC5zaXplLnkudmFsdWU7XG4gICAgICAgICAgICBjb25zdCB0YXJnZXRSYXRpbyA9IHRoaXMub3B0aW9ucy5hc3BlY3RSYXRpbztcblxuICAgICAgICAgICAgaWYgKE1hdGguYWJzKGN1cnJlbnRSYXRpbyAtIHRhcmdldFJhdGlvKSA+IDAuMDEpIHtcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudFJhdGlvID4gdGFyZ2V0UmF0aW8pIHtcbiAgICAgICAgICAgICAgICAgICAgcmVjdC5zaXplLnkudmFsdWUgPSByZWN0LnNpemUueC52YWx1ZSAvIHRhcmdldFJhdGlvO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlY3Quc2l6ZS54LnZhbHVlID0gcmVjdC5zaXplLnkudmFsdWUgKiB0YXJnZXRSYXRpbztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBcHBseSBzaXplIGxpbWl0c1xuICAgICAgICByZWN0LnNpemUueC52YWx1ZSA9IE1hdGgubWF4KHRoaXMub3B0aW9ucy5taW5TaXplIS54LnZhbHVlLFxuICAgICAgICAgICAgTWF0aC5taW4odGhpcy5vcHRpb25zLm1heFNpemUhLngudmFsdWUsIHJlY3Quc2l6ZS54LnZhbHVlKSk7XG4gICAgICAgIHJlY3Quc2l6ZS55LnZhbHVlID0gTWF0aC5tYXgodGhpcy5vcHRpb25zLm1pblNpemUhLnkudmFsdWUsXG4gICAgICAgICAgICBNYXRoLm1pbih0aGlzLm9wdGlvbnMubWF4U2l6ZSEueS52YWx1ZSwgcmVjdC5zaXplLnkudmFsdWUpKTtcblxuICAgICAgICAvLyBBcHBseSBib3VuZHNcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5ib3VuZHMpIHtcbiAgICAgICAgICAgIHJlY3QucG9zaXRpb24ueC52YWx1ZSA9IE1hdGgubWF4KHRoaXMub3B0aW9ucy5ib3VuZHMucG9zaXRpb24ueC52YWx1ZSxcbiAgICAgICAgICAgICAgICBNYXRoLm1pbihyZWN0LnBvc2l0aW9uLngudmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5ib3VuZHMucG9zaXRpb24ueC52YWx1ZSArIHRoaXMub3B0aW9ucy5ib3VuZHMuc2l6ZS54LnZhbHVlIC0gcmVjdC5zaXplLngudmFsdWUpKTtcbiAgICAgICAgICAgIHJlY3QucG9zaXRpb24ueS52YWx1ZSA9IE1hdGgubWF4KHRoaXMub3B0aW9ucy5ib3VuZHMucG9zaXRpb24ueS52YWx1ZSxcbiAgICAgICAgICAgICAgICBNYXRoLm1pbihyZWN0LnBvc2l0aW9uLnkudmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5ib3VuZHMucG9zaXRpb24ueS52YWx1ZSArIHRoaXMub3B0aW9ucy5ib3VuZHMuc2l6ZS55LnZhbHVlIC0gcmVjdC5zaXplLnkudmFsdWUpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFwcGx5IGdyaWQgc25hcHBpbmdcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zbmFwVG9HcmlkKSB7XG4gICAgICAgICAgICBjb25zdCB7IHNpemU6IGdyaWRTaXplLCBvZmZzZXQ6IGdyaWRPZmZzZXQgfSA9IHRoaXMub3B0aW9ucy5zbmFwVG9HcmlkO1xuICAgICAgICAgICAgcmVjdC5wb3NpdGlvbi54LnZhbHVlID0gTWF0aC5yb3VuZCgocmVjdC5wb3NpdGlvbi54LnZhbHVlIC0gZ3JpZE9mZnNldC54LnZhbHVlKSAvIGdyaWRTaXplLngudmFsdWUpICpcbiAgICAgICAgICAgICAgICBncmlkU2l6ZS54LnZhbHVlICsgZ3JpZE9mZnNldC54LnZhbHVlO1xuICAgICAgICAgICAgcmVjdC5wb3NpdGlvbi55LnZhbHVlID0gTWF0aC5yb3VuZCgocmVjdC5wb3NpdGlvbi55LnZhbHVlIC0gZ3JpZE9mZnNldC55LnZhbHVlKSAvIGdyaWRTaXplLnkudmFsdWUpICpcbiAgICAgICAgICAgICAgICBncmlkU2l6ZS55LnZhbHVlICsgZ3JpZE9mZnNldC55LnZhbHVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVPdmVybGF5KCk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMub3ZlcmxheUVsZW1lbnQpIHJldHVybjtcblxuICAgICAgICBpZiAoIXRoaXMuc2VsZWN0aW9uUmVjdCkge1xuICAgICAgICAgICAgdGhpcy5vdmVybGF5RWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmVjdCA9IHRoaXMuc2VsZWN0aW9uUmVjdDtcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLm92ZXJsYXlFbGVtZW50LnN0eWxlLCB7XG4gICAgICAgICAgICBkaXNwbGF5OiAnYmxvY2snLFxuICAgICAgICAgICAgbGVmdDogYCR7cmVjdC5wb3NpdGlvbi54LnZhbHVlfXB4YCxcbiAgICAgICAgICAgIHRvcDogYCR7cmVjdC5wb3NpdGlvbi55LnZhbHVlfXB4YCxcbiAgICAgICAgICAgIHdpZHRoOiBgJHtyZWN0LnNpemUueC52YWx1ZX1weGAsXG4gICAgICAgICAgICBoZWlnaHQ6IGAke3JlY3Quc2l6ZS55LnZhbHVlfXB4YFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlbW92ZU92ZXJsYXkoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLm92ZXJsYXlFbGVtZW50KSB7XG4gICAgICAgICAgICB0aGlzLm92ZXJsYXlFbGVtZW50LnJlbW92ZSgpO1xuICAgICAgICAgICAgdGhpcy5vdmVybGF5RWxlbWVudCA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0SGFuZGxlQXRQb2ludChwb2ludDogVmVjdG9yMkQpOiBzdHJpbmcgfCBudWxsIHtcbiAgICAgICAgaWYgKCF0aGlzLm92ZXJsYXlFbGVtZW50IHx8ICF0aGlzLnNlbGVjdGlvblJlY3QpIHJldHVybiBudWxsO1xuXG4gICAgICAgIGNvbnN0IHJlY3QgPSB0aGlzLnNlbGVjdGlvblJlY3Q7XG4gICAgICAgIGNvbnN0IGhhbmRsZXMgPSB0aGlzLm92ZXJsYXlFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWhhbmRsZV0nKTtcbiAgICAgICAgY29uc3QgaGFuZGxlU2l6ZSA9IDg7IC8vIHBpeGVsc1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaGFuZGxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgaGFuZGxlID0gaGFuZGxlc1tpXTtcbiAgICAgICAgICAgIGNvbnN0IGhhbmRsZVJlY3QgPSAoaGFuZGxlIGFzIEhUTUxFbGVtZW50KS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgIGlmIChwb2ludC54LnZhbHVlID49IGhhbmRsZVJlY3QubGVmdCAmJiBwb2ludC54LnZhbHVlIDw9IGhhbmRsZVJlY3QucmlnaHQgJiZcbiAgICAgICAgICAgICAgICBwb2ludC55LnZhbHVlID49IGhhbmRsZVJlY3QudG9wICYmIHBvaW50LnkudmFsdWUgPD0gaGFuZGxlUmVjdC5ib3R0b20pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlLmdldEF0dHJpYnV0ZSgnZGF0YS1oYW5kbGUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBzZWxlY3Rpb24gYXMgaW1hZ2UgZGF0YSAoZm9yIGNhbnZhcy9zY3JlZW4gY2FwdHVyZSlcbiAgICAgKi9cbiAgICBhc3luYyBnZXRTZWxlY3Rpb25JbWFnZSgpOiBQcm9taXNlPEltYWdlRGF0YSB8IG51bGw+IHtcbiAgICAgICAgaWYgKCF0aGlzLnNlbGVjdGlvblJlY3QpIHJldHVybiBudWxsO1xuXG4gICAgICAgIC8vIFRoaXMgd291bGQgcmVxdWlyZSBhZGRpdGlvbmFsIGNhbnZhcy9zY3JlZW4gY2FwdHVyZSBpbXBsZW1lbnRhdGlvblxuICAgICAgICAvLyBGb3Igbm93LCByZXR1cm4gbnVsbFxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEZXN0cm95IHRoZSBzZWxlY3Rpb24gY29udHJvbGxlclxuICAgICAqL1xuICAgIGRlc3Ryb3koKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgICB0aGlzLmNsZWFyU2VsZWN0aW9uKCk7XG4gICAgfVxufVxuXG4vLyBFeHBvcnQgZGVmYXVsdFxuZXhwb3J0IGRlZmF1bHQgU2VsZWN0aW9uQ29udHJvbGxlcjtcbiJdfQ==