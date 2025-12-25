import { numberRef, subscribe } from "fest/object";
import {
    Vector2D, vector2Ref, operated,
    addVector2D, subtractVector2D, multiplyVector2D, divideVector2D,
    Rect2D, createRect2D, rectContainsPoint, rectIntersects
} from "./index";

// Grid-specific mathematical types and operations

/**
 * Grid coordinate system with row/column addressing
 */
export interface GridCoord {
    row: ReturnType<typeof numberRef>;
    col: ReturnType<typeof numberRef>;
}

/**
 * Grid cell definition with position and span
 */
export interface GridCell extends GridCoord {
    rowSpan: ReturnType<typeof numberRef>;
    colSpan: ReturnType<typeof numberRef>;
}

/**
 * Grid layout configuration
 */
export interface GridConfig {
    rows: ReturnType<typeof numberRef>;
    cols: ReturnType<typeof numberRef>;
    cellWidth: ReturnType<typeof numberRef>;
    cellHeight: ReturnType<typeof numberRef>;
    gap: ReturnType<typeof numberRef>; // Gap between cells
    padding: Vector2D; // Grid padding
}

/**
 * Grid coordinate utilities
 */
export class GridCoordUtils {
    // Create reactive grid coordinate
    static create(row: number = 0, col: number = 0): GridCoord {
        return {
            row: numberRef(row),
            col: numberRef(col)
        };
    }

    // Convert grid coordinates to pixel position
    static toPixel(coord: GridCoord, config: GridConfig): Vector2D {
        return operated([
            coord.row, coord.col,
            config.cellWidth, config.cellHeight,
            config.gap, config.padding.x, config.padding.y
        ], () => {
            const x = config.padding.x.value +
                     coord.col.value * (config.cellWidth.value + config.gap.value);
            const y = config.padding.y.value +
                     coord.row.value * (config.cellHeight.value + config.gap.value);
            return vector2Ref(x, y);
        });
    }

    // Convert pixel position to grid coordinates
    static fromPixel(pixel: Vector2D, config: GridConfig): GridCoord {
        const coord = operated([
            pixel.x, pixel.y,
            config.cellWidth, config.cellHeight,
            config.gap, config.padding.x, config.padding.y
        ], () => {
            const col = Math.floor(
                (pixel.x.value - config.padding.x.value) /
                (config.cellWidth.value + config.gap.value)
            );
            const row = Math.floor(
                (pixel.y.value - config.padding.y.value) /
                (config.cellHeight.value + config.gap.value)
            );
            return GridCoordUtils.create(row, col);
        });

        return {
            row: operated([coord], () => (coord.value as any).row.value),
            col: operated([coord], () => (coord.value as any).col.value)
        };
    }

    // Snap pixel position to nearest grid intersection
    static snapToGrid(pixel: Vector2D, config: GridConfig): Vector2D {
        const gridCoord = this.fromPixel(pixel, config);
        return this.toPixel(gridCoord, config);
    }

    // Snap pixel position to nearest grid cell center
    static snapToCellCenter(pixel: Vector2D, config: GridConfig): Vector2D {
        const gridCoord = this.fromPixel(pixel, config);
        const cellTopLeft = this.toPixel(gridCoord, config);

        return operated([
            cellTopLeft.x, cellTopLeft.y,
            config.cellWidth, config.cellHeight
        ], () => {
            const centerX = cellTopLeft.x.value + config.cellWidth.value / 2;
            const centerY = cellTopLeft.y.value + config.cellHeight.value / 2;
            return vector2Ref(centerX, centerY);
        });
    }

    // Get adjacent coordinates
    static adjacent(coord: GridCoord, direction: 'up' | 'down' | 'left' | 'right'): GridCoord {
        const deltas = {
            up: { row: -1, col: 0 },
            down: { row: 1, col: 0 },
            left: { row: 0, col: -1 },
            right: { row: 0, col: 1 }
        };

        const delta = deltas[direction];
        return {
            row: operated([coord.row], () => coord.row.value + delta.row),
            col: operated([coord.col], () => coord.col.value + delta.col)
        };
    }

    // Check if coordinate is within grid bounds
    static isValid(coord: GridCoord, config: GridConfig): ReturnType<typeof numberRef> {
        return operated([coord.row, coord.col, config.rows, config.cols], () =>
            coord.row.value >= 0 && coord.row.value < config.rows.value &&
            coord.col.value >= 0 && coord.col.value < config.cols.value
        );
    }

    // Manhattan distance between grid coordinates
    static manhattanDistance(a: GridCoord, b: GridCoord): ReturnType<typeof numberRef> {
        return operated([a.row, a.col, b.row, b.col], () =>
            Math.abs(a.row.value - b.row.value) + Math.abs(a.col.value - b.col.value)
        );
    }

    // Euclidean distance between grid coordinates
    static euclideanDistance(a: GridCoord, b: GridCoord): ReturnType<typeof numberRef> {
        return operated([a.row, a.col, b.row, b.col], () =>
            Math.sqrt(
                Math.pow(a.row.value - b.row.value, 2) +
                Math.pow(a.col.value - b.col.value, 2)
            )
        );
    }
}

/**
 * Grid cell utilities with span support
 */
export class GridCellUtils {
    // Create reactive grid cell
    static create(row: number = 0, col: number = 0, rowSpan: number = 1, colSpan: number = 1): GridCell {
        return {
            row: numberRef(row),
            col: numberRef(col),
            rowSpan: numberRef(rowSpan),
            colSpan: numberRef(colSpan)
        };
    }

    // Convert grid cell to pixel rectangle
    static toRect(cell: GridCell, config: GridConfig): Rect2D {
        const topLeft = GridCoordUtils.toPixel(cell, config);

        // Calculate width and height considering spans
        const width = operated([
            cell.colSpan, config.cellWidth, config.gap
        ], () =>
            cell.colSpan.value * config.cellWidth.value +
            (cell.colSpan.value - 1) * config.gap.value
        );

        const height = operated([
            cell.rowSpan, config.cellHeight, config.gap
        ], () =>
            cell.rowSpan.value * config.cellHeight.value +
            (cell.rowSpan.value - 1) * config.gap.value
        );

        return createRect2D(topLeft.x, topLeft.y, width, height);
    }

    // Get cell center point
    static getCenter(cell: GridCell, config: GridConfig): Vector2D {
        const rect = this.toRect(cell, config);
        return operated([rect.position.x, rect.position.y, rect.size.x, rect.size.y], () =>
            vector2Ref(
                rect.position.x.value + rect.size.x.value / 2,
                rect.position.y.value + rect.size.y.value / 2
            )
        );
    }

    // Check if cells overlap (considering spans)
    static overlaps(a: GridCell, b: GridCell): ReturnType<typeof numberRef> {
        return operated([
            a.row, a.col, a.rowSpan, a.colSpan,
            b.row, b.col, b.rowSpan, b.colSpan
        ], () => {
            const aRight = a.col.value + a.colSpan.value;
            const aBottom = a.row.value + a.rowSpan.value;
            const bRight = b.col.value + b.colSpan.value;
            const bBottom = b.row.value + b.rowSpan.value;

            return !(a.col.value >= bRight || aRight <= b.col.value ||
                    a.row.value >= bBottom || aBottom <= b.row.value);
        });
    }

    // Get cells that a spanning cell occupies
    static getOccupiedCells(cell: GridCell): GridCoord[] {
        const cells: GridCoord[] = [];

        for (let r = 0; r < cell.rowSpan.value; r++) {
            for (let c = 0; c < cell.colSpan.value; c++) {
                cells.push(GridCoordUtils.create(
                    cell.row.value + r,
                    cell.col.value + c
                ));
            }
        }

        return cells;
    }
}

/**
 * Grid layout algorithms
 */
export class GridLayoutUtils {
    // Fit cells into grid without overlap (basic bin packing)
    static fitCells(cells: GridCell[], config: GridConfig): GridCell[] {
        const placed: GridCell[] = [];
        const occupied = new Set<string>();

        cells.forEach(cell => {
            let placedCell = { ...cell };

            // Try to find a valid position
            for (let row = 0; row < config.rows.value; row++) {
                for (let col = 0; col < config.cols.value; col++) {
                    placedCell.row = numberRef(row);
                    placedCell.col = numberRef(col);

                    // Check if this position fits
                    if (this.canPlaceCell(placedCell, occupied, config)) {
                        this.markOccupied(placedCell, occupied);
                        placed.push(placedCell);
                        return;
                    }
                }
            }

            // If no position found, place at origin (will overlap)
            placed.push(placedCell);
        });

        return placed;
    }

    // Check if a cell can be placed at its current position
    static canPlaceCell(cell: GridCell, occupied: Set<string>, config: GridConfig): boolean {
        // Check bounds
        if (!GridCoordUtils.isValid(cell, config).value) return false;

        // Check if any occupied cells conflict
        const occupiedCells = GridCellUtils.getOccupiedCells(cell);
        return !occupiedCells.some(coord =>
            occupied.has(`${coord.row.value},${coord.col.value}`)
        );
    }

    // Mark cells as occupied
    static markOccupied(cell: GridCell, occupied: Set<string>): void {
        const occupiedCells = GridCellUtils.getOccupiedCells(cell);
        occupiedCells.forEach(coord => {
            occupied.add(`${coord.row.value},${coord.col.value}`);
        });
    }

    // Calculate optimal grid size for given cells
    static calculateOptimalSize(cells: GridCell[]): { rows: number, cols: number } {
        let maxRow = 0, maxCol = 0;

        cells.forEach(cell => {
            maxRow = Math.max(maxRow, cell.row.value + cell.rowSpan.value);
            maxCol = Math.max(maxCol, cell.col.value + cell.colSpan.value);
        });

        return { rows: maxRow, cols: maxCol };
    }

    // Redistribute cells using different algorithms
    static redistributeCells(
        cells: GridCell[],
        config: GridConfig,
        algorithm: 'row-major' | 'column-major' | 'diagonal' = 'row-major'
    ): GridCell[] {
        const redistributed: GridCell[] = [];
        let currentRow = 0, currentCol = 0;

        cells.forEach((cell, index) => {
            switch (algorithm) {
                case 'row-major':
                    if (currentCol + cell.colSpan.value > config.cols.value) {
                        currentRow++;
                        currentCol = 0;
                    }
                    cell.row = numberRef(currentRow);
                    cell.col = numberRef(currentCol);
                    currentCol += cell.colSpan.value;
                    break;

                case 'column-major':
                    if (currentRow + cell.rowSpan.value > config.rows.value) {
                        currentCol++;
                        currentRow = 0;
                    }
                    cell.row = numberRef(currentRow);
                    cell.col = numberRef(currentCol);
                    currentRow += cell.rowSpan.value;
                    break;

                case 'diagonal':
                    const diagonal = Math.floor(index / Math.sqrt(cells.length));
                    cell.row = numberRef(diagonal);
                    cell.col = numberRef(index % Math.ceil(Math.sqrt(cells.length)));
                    break;
            }

            redistributed.push(cell);
        });

        return redistributed;
    }
}

/**
 * Grid animation and transition utilities
 */
export class GridAnimationUtils {
    // Animate cell movement along grid
    static animateCellMovement(
        cell: GridCell,
        targetCoord: GridCoord,
        config: GridConfig,
        duration: number = 300
    ): Promise<void> {
        return new Promise(resolve => {
            const startRow = cell.row.value;
            const startCol = cell.col.value;
            const endRow = targetCoord.row.value;
            const endCol = targetCoord.col.value;

            const startTime = performance.now();

            const animate = (currentTime: number) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Easing function (ease-out cubic)
                const eased = 1 - Math.pow(1 - progress, 3);

                cell.row.value = startRow + (endRow - startRow) * eased;
                cell.col.value = startCol + (endCol - startCol) * eased;

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };

            requestAnimationFrame(animate);
        });
    }

    // Animate cell resizing
    static animateCellResize(
        cell: GridCell,
        targetRowSpan: number,
        targetColSpan: number,
        duration: number = 300
    ): Promise<void> {
        return new Promise(resolve => {
            const startRowSpan = cell.rowSpan.value;
            const startColSpan = cell.colSpan.value;

            const startTime = performance.now();

            const animate = (currentTime: number) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                const eased = 1 - Math.pow(1 - progress, 3);

                cell.rowSpan.value = startRowSpan + (targetRowSpan - startRowSpan) * eased;
                cell.colSpan.value = startColSpan + (targetColSpan - startColSpan) * eased;

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };

            requestAnimationFrame(animate);
        });
    }

    // Chain animations for complex transitions
    static createAnimationChain(cell: GridCell, config: GridConfig) {
        return {
            moveTo: (targetCoord: GridCoord, duration?: number) =>
                GridAnimationUtils.animateCellMovement(cell, targetCoord, config, duration),

            resizeTo: (rowSpan: number, colSpan: number, duration?: number) =>
                GridAnimationUtils.animateCellResize(cell, rowSpan, colSpan, duration),

            then: function(callback: () => void) {
                return this;
            }
        };
    }
}

/**
 * Grid collision and interaction utilities
 */
export class GridInteractionUtils {
    // Find cell at pixel position
    static getCellAtPixel(pixel: Vector2D, config: GridConfig): GridCoord {
        return GridCoordUtils.fromPixel(pixel, config);
    }

    // Get all cells in a pixel rectangle
    static getCellsInRect(rect: Rect2D, config: GridConfig): GridCoord[] {
        const cells: GridCoord[] = [];

        // Convert rect corners to grid coordinates
        const topLeft = GridCoordUtils.fromPixel(rect.position, config);
        const bottomRight = GridCoordUtils.fromPixel(
            addVector2D(rect.position, rect.size),
            config
        );

        for (let row = topLeft.row.value; row <= bottomRight.row.value; row++) {
            for (let col = topLeft.col.value; col <= bottomRight.col.value; col++) {
                if (row >= 0 && row < config.rows.value &&
                    col >= 0 && col < config.cols.value) {
                    cells.push(GridCoordUtils.create(row, col));
                }
            }
        }

        return cells;
    }

    // Check if dragging a cell to a new position would cause overlaps
    static wouldOverlap(cell: GridCell, newCoord: GridCoord, existingCells: GridCell[]): boolean {
        const testCell = GridCellUtils.create(
            newCoord.row.value,
            newCoord.col.value,
            cell.rowSpan.value,
            cell.colSpan.value
        );

        return existingCells.some(otherCell =>
            otherCell !== cell && GridCellUtils.overlaps(testCell, otherCell).value
        );
    }

    // Find valid drop positions for a cell
    static findValidPositions(cell: GridCell, config: GridConfig, existingCells: GridCell[]): GridCoord[] {
        const validPositions: GridCoord[] = [];

        for (let row = 0; row < config.rows.value - cell.rowSpan.value + 1; row++) {
            for (let col = 0; col < config.cols.value - cell.colSpan.value + 1; col++) {
                const testCoord = GridCoordUtils.create(row, col);
                if (!this.wouldOverlap(cell, testCoord, existingCells)) {
                    validPositions.push(testCoord);
                }
            }
        }

        return validPositions;
    }

    // Calculate drag preview position (snapped to valid positions)
    static calculateDragPreview(cell: GridCell, dragPosition: Vector2D, config: GridConfig, existingCells: GridCell[]): GridCoord {
        const snappedCoord = GridCoordUtils.fromPixel(dragPosition, config);

        // Clamp to valid range
        const clampedRow = Math.max(0, Math.min(
            snappedCoord.row.value,
            config.rows.value - cell.rowSpan.value
        ));
        const clampedCol = Math.max(0, Math.min(
            snappedCoord.col.value,
            config.cols.value - cell.colSpan.value
        ));

        const clampedCoord = GridCoordUtils.create(clampedRow, clampedCol);

        // If position would overlap, find nearest valid position
        if (this.wouldOverlap(cell, clampedCoord, existingCells)) {
            const validPositions = this.findValidPositions(cell, config, existingCells);
            if (validPositions.length > 0) {
                // Find closest valid position
                let closest = validPositions[0];
                let minDistance = GridCoordUtils.euclideanDistance(clampedCoord, closest).value;

                validPositions.forEach(pos => {
                    const distance = GridCoordUtils.euclideanDistance(clampedCoord, pos).value;
                    if (distance < minDistance) {
                        minDistance = distance;
                        closest = pos;
                    }
                });

                return closest;
            }
        }

        return clampedCoord;
    }
}

/*
// Export all grid math utilities
export {
    GridCoordUtils,
    GridCellUtils,
    GridLayoutUtils,
    GridAnimationUtils,
    GridInteractionUtils
};
*/


// ============================================================================
// Enhanced Grid Cell Utilities using GridMath
// ============================================================================
// These functions leverage the comprehensive GridMath library to provide:
// - Reactive grid coordinate management
// - Proper bounds checking and validation
// - Grid-aware snapping and rounding
// - Pathfinding and collision detection
// - Layout optimization algorithms
//
// All functions maintain backward compatibility with existing [x, y] array format
// while adding powerful new GridMath capabilities.
//
// Key GridMath integrations:
// - GridCoordUtils: Coordinate conversion, validation, distance calculations
// - GridCellUtils: Cell spanning, collision detection, geometry
// - GridLayoutUtils: Auto-arrangement, optimization algorithms
// - GridInteractionUtils: Drag preview, position validation
// ============================================================================

// Enhanced cell utilities using GridMath (keeping backward compatibility)
export const clampCell = (cellPos: Vector2D | [number, number], layout: [number, number]): Vector2D => {
    // Create reactive grid coordinate from input
    const inputCoord = cellPos instanceof Vector2D
        ? GridCoordUtils.create(cellPos.y.value, cellPos.x.value)  // Note: y=row, x=col
        : GridCoordUtils.create(cellPos[1], cellPos[0]);          // [x, y] -> [col, row]

    // Create grid config for validation
    const config: GridConfig = {
        rows: numberRef(layout[1]),
        cols: numberRef(layout[0]),
        cellWidth: numberRef(1),
        cellHeight: numberRef(1),
        gap: numberRef(0),
        padding: vector2Ref(0, 0)
    };

    // Clamp coordinate within grid bounds
    const clampedRow = Math.max(0, Math.min(inputCoord.row.value, layout[1] - 1));
    const clampedCol = Math.max(0, Math.min(inputCoord.col.value, layout[0] - 1));

    const clampedCoord = GridCoordUtils.create(clampedRow, clampedCol);

    // Validate the coordinate is within grid (reactive check)
    if (!GridCoordUtils.isValid(clampedCoord, config).value) {
        // Fallback to origin if invalid
        return vector2Ref(0, 0);
    }

    return vector2Ref(clampedCoord.col.value, clampedCoord.row.value);
};

// Enhanced grid-aware cell rounding using GridMath
export const floorCell = (cellPos: Vector2D | [number, number], N = 1): Vector2D => {
    const x = cellPos instanceof Vector2D ? cellPos.x.value : cellPos[0];
    const y = cellPos instanceof Vector2D ? cellPos.y.value : cellPos[1];

    // Use grid-aware flooring - snap to nearest N-cell boundary
    const flooredCol = Math.floor(x / N) * N;
    const flooredRow = Math.floor(y / N) * N;

    return vector2Ref(flooredCol, flooredRow);
};

export const ceilCell = (cellPos: Vector2D | [number, number], N = 1): Vector2D => {
    const x = cellPos instanceof Vector2D ? cellPos.x.value : cellPos[0];
    const y = cellPos instanceof Vector2D ? cellPos.y.value : cellPos[1];

    // Use grid-aware ceiling - snap to next N-cell boundary
    const ceiledCol = Math.ceil(x / N) * N;
    const ceiledRow = Math.ceil(y / N) * N;

    return vector2Ref(ceiledCol, ceiledRow);
};

export const roundCell = (cellPos: Vector2D | [number, number], N = 1): Vector2D => {
    const x = cellPos instanceof Vector2D ? cellPos.x.value : cellPos[0];
    const y = cellPos instanceof Vector2D ? cellPos.y.value : cellPos[1];

    // Use grid-aware rounding - snap to nearest N-cell boundary
    const roundedCol = Math.round(x / N) * N;
    const roundedRow = Math.round(y / N) * N;

    return vector2Ref(roundedCol, roundedRow);
};

// Additional grid-aware utility functions using GridMath
export const snapToGridCell = (cellPos: Vector2D | [number, number], layout: [number, number]): Vector2D => {
    // Convert to grid coordinate, then snap to valid grid position
    const coord = cellPos instanceof Vector2D
        ? GridCoordUtils.create(cellPos.y.value, cellPos.x.value)
        : GridCoordUtils.create(cellPos[1], cellPos[0]);

    const config: GridConfig = {
        rows: numberRef(layout[1]),
        cols: numberRef(layout[0]),
        cellWidth: numberRef(1),
        cellHeight: numberRef(1),
        gap: numberRef(0),
        padding: vector2Ref(0, 0)
    };

    // Find nearest valid grid intersection
    const validCoord = GridCoordUtils.create(
        Math.max(0, Math.min(coord.row.value, config.rows.value - 1)),
        Math.max(0, Math.min(coord.col.value, config.cols.value - 1))
    );

    return vector2Ref(validCoord.col.value, validCoord.row.value);
};

export const getCellDistance = (cellA: Vector2D | [number, number], cellB: Vector2D | [number, number]): number => {
    // Calculate Manhattan distance between grid cells
    const coordA = cellA instanceof Vector2D
        ? GridCoordUtils.create(cellA.y.value, cellA.x.value)
        : GridCoordUtils.create(cellA[1], cellA[0]);

    const coordB = cellB instanceof Vector2D
        ? GridCoordUtils.create(cellB.y.value, cellB.x.value)
        : GridCoordUtils.create(cellB[1], cellB[0]);

    return GridCoordUtils.manhattanDistance(coordA, coordB).value;
};

export const getAdjacentCells = (cellPos: Vector2D | [number, number], layout: [number, number]): Vector2D[] => {
    // Get all adjacent cells (4-way or 8-way adjacency)
    const centerCoord = cellPos instanceof Vector2D
        ? GridCoordUtils.create(cellPos.y.value, cellPos.x.value)
        : GridCoordUtils.create(cellPos[1], cellPos[0]);

    const config: GridConfig = {
        rows: numberRef(layout[1]),
        cols: numberRef(layout[0]),
        cellWidth: numberRef(1),
        cellHeight: numberRef(1),
        gap: numberRef(0),
        padding: vector2Ref(0, 0)
    };

    const adjacent: Vector2D[] = [];
    const directions: ('up' | 'down' | 'left' | 'right')[] =
        ['up', 'down', 'left', 'right'];

    for (const direction of directions) {
        const adjacentCoord = GridCoordUtils.adjacent(centerCoord, direction);
        if (GridCoordUtils.isValid(adjacentCoord, config).value) {
            adjacent.push(vector2Ref(adjacentCoord.col.value, adjacentCoord.row.value));
        }
    }

    return adjacent;
};

// Advanced grid utility functions using GridMath
export const getCellsInRange = (centerCell: Vector2D | [number, number], radius: number, layout: [number, number]): Vector2D[] => {
    // Get all cells within Manhattan distance radius
    const centerCoord = centerCell instanceof Vector2D
        ? GridCoordUtils.create(centerCell.y.value, centerCell.x.value)
        : GridCoordUtils.create(centerCell[1], centerCell[0]);

    const config: GridConfig = {
        rows: numberRef(layout[1]),
        cols: numberRef(layout[0]),
        cellWidth: numberRef(1),
        cellHeight: numberRef(1),
        gap: numberRef(0),
        padding: vector2Ref(0, 0)
    };

    const cellsInRange: Vector2D[] = [];

    for (let row = Math.max(0, centerCoord.row.value - radius);
         row <= Math.min(layout[1] - 1, centerCoord.row.value + radius);
         row++) {
        for (let col = Math.max(0, centerCoord.col.value - radius);
             col <= Math.min(layout[0] - 1, centerCoord.col.value + radius);
             col++) {

            const testCoord = GridCoordUtils.create(row, col);
            const distance = GridCoordUtils.manhattanDistance(centerCoord, testCoord).value;

            if (distance <= radius) {
                cellsInRange.push(vector2Ref(col, row));
            }
        }
    }

    return cellsInRange;
};

export const findPathBetweenCells = (
    startCell: Vector2D | [number, number],
    endCell: Vector2D | [number, number],
    layout: [number, number],
    obstacles: (Vector2D | [number, number])[] = []
): Vector2D[] => {
    // Simple A* pathfinding between grid cells
    const startCoord = startCell instanceof Vector2D
        ? GridCoordUtils.create(startCell.y.value, startCell.x.value)
        : GridCoordUtils.create(startCell[1], startCell[0]);

    const endCoord = endCell instanceof Vector2D
        ? GridCoordUtils.create(endCell.y.value, endCell.x.value)
        : GridCoordUtils.create(endCell[1], endCell[0]);

    // Convert obstacles to coordinate set for fast lookup
    const obstacleSet = new Set(
        obstacles.map(obs => {
            const coord = obs instanceof Vector2D
                ? GridCoordUtils.create(obs.y.value, obs.x.value)
                : GridCoordUtils.create(obs[1], obs[0]);
            return `${coord.row.value},${coord.col.value}`;
        })
    );

    const config: GridConfig = {
        rows: numberRef(layout[1]),
        cols: numberRef(layout[0]),
        cellWidth: numberRef(1),
        cellHeight: numberRef(1),
        gap: numberRef(0),
        padding: vector2Ref(0, 0)
    };

    // A* implementation (simplified)
    const openSet = new Map<string, { coord: GridCoord, f: number, g: number, parent: GridCoord | null }>();
    const closedSet = new Set<string>();

    const startKey = `${startCoord.row.value},${startCoord.col.value}`;
    openSet.set(startKey, {
        coord: startCoord,
        f: GridCoordUtils.manhattanDistance(startCoord, endCoord).value,
        g: 0,
        parent: null
    });

    while (openSet.size > 0) {
        // Find node with lowest f score
        let currentKey = '';
        let lowestF = Infinity;

        for (const [key, node] of openSet) {
            if (node.f < lowestF) {
                lowestF = node.f;
                currentKey = key;
            }
        }

        const current = openSet.get(currentKey)!;
        openSet.delete(currentKey);
        closedSet.add(currentKey);

        // Check if we reached the end
        if (current.coord.row.value === endCoord.row.value &&
            current.coord.col.value === endCoord.col.value) {
            // Reconstruct path
            const path: Vector2D[] = [];
            let node: typeof current | null = current;

            while (node) {
                path.unshift(vector2Ref(node.coord.col.value, node.coord.row.value));
                if (!node.parent) break;

                const parentKey = `${node.parent.row.value},${node.parent.col.value}`;
                node = openSet.get(parentKey) || null;
            }

            return path;
        }

        // Check adjacent cells
        const directions: (keyof typeof GridCoordUtils.adjacent extends (coord: any, direction: infer D) => any ? D : never)[] =
            ['up', 'down', 'left', 'right'];

        for (const direction of directions) {
            const neighborCoord = GridCoordUtils.adjacent(current.coord, direction as 'up' | 'down' | 'left' | 'right');
            const neighborKey = `${neighborCoord.row.value},${neighborCoord.col.value}`;

            if (!GridCoordUtils.isValid(neighborCoord, config).value ||
                closedSet.has(neighborKey) ||
                obstacleSet.has(neighborKey)) {
                continue;
            }

            const gScore = current.g + 1; // Movement cost of 1
            const hScore = GridCoordUtils.manhattanDistance(neighborCoord, endCoord).value;
            const fScore = gScore + hScore;

            const existing = openSet.get(neighborKey);
            if (!existing || gScore < existing.g) {
                openSet.set(neighborKey, {
                    coord: neighborCoord,
                    f: fScore,
                    g: gScore,
                    parent: current.coord
                });
            }
        }
    }

    // No path found
    return [];
};

export const checkCellCollision = (
    cellA: Vector2D | [number, number],
    cellB: Vector2D | [number, number],
    cellSizeA: [number, number] = [1, 1],
    cellSizeB: [number, number] = [1, 1]
): boolean => {
    // Check if two cells with spans collide
    const coordA = cellA instanceof Vector2D
        ? GridCoordUtils.create(cellA.y.value, cellA.x.value)
        : GridCoordUtils.create(cellA[1], cellA[0]);

    const coordB = cellB instanceof Vector2D
        ? GridCoordUtils.create(cellB.y.value, cellB.x.value)
        : GridCoordUtils.create(cellB[1], cellB[0]);

    // Create grid cells with spans
    const gridCellA = GridCellUtils.create(
        coordA.row.value, coordA.col.value,
        cellSizeA[1], cellSizeA[0]  // Note: [width, height] -> [colSpan, rowSpan]
    );

    const gridCellB = GridCellUtils.create(
        coordB.row.value, coordB.col.value,
        cellSizeB[1], cellSizeB[0]
    );

    return GridCellUtils.overlaps(gridCellA, gridCellB).value;
};

export const optimizeCellLayout = (
    cells: Array<{ pos: Vector2D | [number, number], size: [number, number] }>,
    layout: [number, number]
): Array<{ pos: Vector2D, size: [number, number] }> => {
    // Use GridMath layout algorithms to optimize cell positioning
    const config: GridConfig = {
        rows: numberRef(layout[1]),
        cols: numberRef(layout[0]),
        cellWidth: numberRef(1),
        cellHeight: numberRef(1),
        gap: numberRef(0),
        padding: vector2Ref(0, 0)
    };

    // Convert to GridCell format
    const gridCells = cells.map((cell, index) => {
        const coord = cell.pos instanceof Vector2D
            ? GridCoordUtils.create(cell.pos.y.value, cell.pos.x.value)
            : GridCoordUtils.create(cell.pos[1], cell.pos[0]);

        return GridCellUtils.create(
            coord.row.value, coord.col.value,
            cell.size[1], cell.size[0]  // [width, height] -> [colSpan, rowSpan]
        );
    });

    // Use GridMath to fit cells without overlap
    const fittedCells = GridLayoutUtils.fitCells(gridCells, config);

    // Convert back to original format
    return fittedCells.map((fittedCell, index) => ({
        pos: vector2Ref(fittedCell.col.value, fittedCell.row.value),
        size: [fittedCell.colSpan.value, fittedCell.rowSpan.value]
    }));
};
