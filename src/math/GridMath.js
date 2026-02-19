import { numberRef } from "fest/object";
import { operated, vector2Ref, Vector2D, addVector2D, createRect2D, } from "./index";
/**
 * Grid coordinate utilities
 */
export class GridCoordUtils {
    // Create reactive grid coordinate
    static create(row = 0, col = 0) {
        return {
            row: numberRef(row),
            col: numberRef(col)
        };
    }
    // Convert grid coordinates to pixel position
    static toPixel(coord, config) {
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
    static fromPixel(pixel, config) {
        const coord = operated([
            pixel.x, pixel.y,
            config.cellWidth, config.cellHeight,
            config.gap, config.padding.x, config.padding.y
        ], () => {
            const col = Math.floor((pixel.x.value - config.padding.x.value) /
                (config.cellWidth.value + config.gap.value));
            const row = Math.floor((pixel.y.value - config.padding.y.value) /
                (config.cellHeight.value + config.gap.value));
            return GridCoordUtils.create(row, col);
        });
        return {
            row: operated([coord], () => coord.value.row.value),
            col: operated([coord], () => coord.value.col.value)
        };
    }
    // Snap pixel position to nearest grid intersection
    static snapToGrid(pixel, config) {
        const gridCoord = this.fromPixel(pixel, config);
        return this.toPixel(gridCoord, config);
    }
    // Snap pixel position to nearest grid cell center
    static snapToCellCenter(pixel, config) {
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
    static adjacent(coord, direction) {
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
    static isValid(coord, config) {
        return operated([coord.row, coord.col, config.rows, config.cols], () => coord.row.value >= 0 && coord.row.value < config.rows.value &&
            coord.col.value >= 0 && coord.col.value < config.cols.value);
    }
    // Manhattan distance between grid coordinates
    static manhattanDistance(a, b) {
        return operated([a.row, a.col, b.row, b.col], () => Math.abs(a.row.value - b.row.value) + Math.abs(a.col.value - b.col.value));
    }
    // Euclidean distance between grid coordinates
    static euclideanDistance(a, b) {
        return operated([a.row, a.col, b.row, b.col], () => Math.sqrt(Math.pow(a.row.value - b.row.value, 2) +
            Math.pow(a.col.value - b.col.value, 2)));
    }
}
/**
 * Grid cell utilities with span support
 */
export class GridCellUtils {
    // Create reactive grid cell
    static create(row = 0, col = 0, rowSpan = 1, colSpan = 1) {
        return {
            row: numberRef(row),
            col: numberRef(col),
            rowSpan: numberRef(rowSpan),
            colSpan: numberRef(colSpan)
        };
    }
    // Convert grid cell to pixel rectangle
    static toRect(cell, config) {
        const topLeft = GridCoordUtils.toPixel(cell, config);
        // Calculate width and height considering spans
        const width = operated([
            cell.colSpan, config.cellWidth, config.gap
        ], () => cell.colSpan.value * config.cellWidth.value +
            (cell.colSpan.value - 1) * config.gap.value);
        const height = operated([
            cell.rowSpan, config.cellHeight, config.gap
        ], () => cell.rowSpan.value * config.cellHeight.value +
            (cell.rowSpan.value - 1) * config.gap.value);
        return createRect2D(topLeft.x, topLeft.y, width, height);
    }
    // Get cell center point
    static getCenter(cell, config) {
        const rect = this.toRect(cell, config);
        return operated([rect.position.x, rect.position.y, rect.size.x, rect.size.y], () => vector2Ref(rect.position.x.value + rect.size.x.value / 2, rect.position.y.value + rect.size.y.value / 2));
    }
    // Check if cells overlap (considering spans)
    static overlaps(a, b) {
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
    static getOccupiedCells(cell) {
        const cells = [];
        for (let r = 0; r < cell.rowSpan.value; r++) {
            for (let c = 0; c < cell.colSpan.value; c++) {
                cells.push(GridCoordUtils.create(cell.row.value + r, cell.col.value + c));
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
    static fitCells(cells, config) {
        const placed = [];
        const occupied = new Set();
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
    static canPlaceCell(cell, occupied, config) {
        // Check bounds
        if (!GridCoordUtils.isValid(cell, config).value)
            return false;
        // Check if any occupied cells conflict
        const occupiedCells = GridCellUtils.getOccupiedCells(cell);
        return !occupiedCells.some(coord => occupied.has(`${coord.row.value},${coord.col.value}`));
    }
    // Mark cells as occupied
    static markOccupied(cell, occupied) {
        const occupiedCells = GridCellUtils.getOccupiedCells(cell);
        occupiedCells.forEach(coord => {
            occupied.add(`${coord.row.value},${coord.col.value}`);
        });
    }
    // Calculate optimal grid size for given cells
    static calculateOptimalSize(cells) {
        let maxRow = 0, maxCol = 0;
        cells.forEach(cell => {
            maxRow = Math.max(maxRow, cell.row.value + cell.rowSpan.value);
            maxCol = Math.max(maxCol, cell.col.value + cell.colSpan.value);
        });
        return { rows: maxRow, cols: maxCol };
    }
    // Redistribute cells using different algorithms
    static redistributeCells(cells, config, algorithm = 'row-major') {
        const redistributed = [];
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
    static animateCellMovement(cell, targetCoord, config, duration = 300) {
        return new Promise(resolve => {
            const startRow = cell.row.value;
            const startCol = cell.col.value;
            const endRow = targetCoord.row.value;
            const endCol = targetCoord.col.value;
            const startTime = performance.now();
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Easing function (ease-out cubic)
                const eased = 1 - Math.pow(1 - progress, 3);
                cell.row.value = startRow + (endRow - startRow) * eased;
                cell.col.value = startCol + (endCol - startCol) * eased;
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
                else {
                    resolve();
                }
            };
            requestAnimationFrame(animate);
        });
    }
    // Animate cell resizing
    static animateCellResize(cell, targetRowSpan, targetColSpan, duration = 300) {
        return new Promise(resolve => {
            const startRowSpan = cell.rowSpan.value;
            const startColSpan = cell.colSpan.value;
            const startTime = performance.now();
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                cell.rowSpan.value = startRowSpan + (targetRowSpan - startRowSpan) * eased;
                cell.colSpan.value = startColSpan + (targetColSpan - startColSpan) * eased;
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
                else {
                    resolve();
                }
            };
            requestAnimationFrame(animate);
        });
    }
    // Chain animations for complex transitions
    static createAnimationChain(cell, config) {
        return {
            moveTo: (targetCoord, duration) => GridAnimationUtils.animateCellMovement(cell, targetCoord, config, duration),
            resizeTo: (rowSpan, colSpan, duration) => GridAnimationUtils.animateCellResize(cell, rowSpan, colSpan, duration),
            then: function (callback) {
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
    static getCellAtPixel(pixel, config) {
        return GridCoordUtils.fromPixel(pixel, config);
    }
    // Get all cells in a pixel rectangle
    static getCellsInRect(rect, config) {
        const cells = [];
        // Convert rect corners to grid coordinates
        const topLeft = GridCoordUtils.fromPixel(rect.position, config);
        const bottomRight = GridCoordUtils.fromPixel(addVector2D(rect.position, rect.size), config);
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
    static wouldOverlap(cell, newCoord, existingCells) {
        const testCell = GridCellUtils.create(newCoord.row.value, newCoord.col.value, cell.rowSpan.value, cell.colSpan.value);
        return existingCells.some(otherCell => otherCell !== cell && GridCellUtils.overlaps(testCell, otherCell).value);
    }
    // Find valid drop positions for a cell
    static findValidPositions(cell, config, existingCells) {
        const validPositions = [];
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
    static calculateDragPreview(cell, dragPosition, config, existingCells) {
        const snappedCoord = GridCoordUtils.fromPixel(dragPosition, config);
        // Clamp to valid range
        const clampedRow = Math.max(0, Math.min(snappedCoord.row.value, config.rows.value - cell.rowSpan.value));
        const clampedCol = Math.max(0, Math.min(snappedCoord.col.value, config.cols.value - cell.colSpan.value));
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
export const clampCell = (cellPos, layout) => {
    // Extract coordinates from input (handles both Vector2D and array formats)
    let x, y;
    if (cellPos instanceof Vector2D) {
        x = cellPos.x?.value ?? 0;
        y = cellPos.y?.value ?? 0;
    }
    else if (Array.isArray(cellPos) && cellPos.length >= 2) {
        x = cellPos[0] ?? 0;
        y = cellPos[1] ?? 0;
    }
    else {
        // Invalid input, return origin
        return vector2Ref(0, 0);
    }
    // Handle NaN/infinite values
    if (!isFinite(x) || !isFinite(y)) {
        return vector2Ref(0, 0);
    }
    // Validate layout
    const cols = Math.max(1, layout[0] || 1);
    const rows = Math.max(1, layout[1] || 1);
    // Clamp coordinates to valid grid bounds
    const clampedX = Math.max(0, Math.min(Math.floor(x), cols - 1));
    const clampedY = Math.max(0, Math.min(Math.floor(y), rows - 1));
    return vector2Ref(clampedX, clampedY);
};
// Enhanced grid-aware cell rounding using GridMath
export const floorCell = (cellPos, N = 1) => {
    const x = cellPos instanceof Vector2D ? cellPos.x.value : cellPos[0];
    const y = cellPos instanceof Vector2D ? cellPos.y.value : cellPos[1];
    // Use grid-aware flooring - snap to nearest N-cell boundary
    const flooredCol = Math.floor(x / N) * N;
    const flooredRow = Math.floor(y / N) * N;
    return vector2Ref(flooredCol, flooredRow);
};
export const ceilCell = (cellPos, N = 1) => {
    const x = cellPos instanceof Vector2D ? cellPos.x.value : cellPos[0];
    const y = cellPos instanceof Vector2D ? cellPos.y.value : cellPos[1];
    // Use grid-aware ceiling - snap to next N-cell boundary
    const ceiledCol = Math.ceil(x / N) * N;
    const ceiledRow = Math.ceil(y / N) * N;
    return vector2Ref(ceiledCol, ceiledRow);
};
export const roundCell = (cellPos, N = 1) => {
    const x = cellPos instanceof Vector2D ? cellPos.x.value : cellPos[0];
    const y = cellPos instanceof Vector2D ? cellPos.y.value : cellPos[1];
    // Use grid-aware rounding - snap to nearest N-cell boundary
    const roundedCol = Math.round(x / N) * N;
    const roundedRow = Math.round(y / N) * N;
    return vector2Ref(roundedCol, roundedRow);
};
// Additional grid-aware utility functions using GridMath
export const snapToGridCell = (cellPos, layout) => {
    // Convert to grid coordinate, then snap to valid grid position
    const coord = cellPos instanceof Vector2D
        ? GridCoordUtils.create(cellPos.y.value, cellPos.x.value)
        : GridCoordUtils.create(cellPos[1], cellPos[0]);
    const config = {
        rows: numberRef(layout[1]),
        cols: numberRef(layout[0]),
        cellWidth: numberRef(1),
        cellHeight: numberRef(1),
        gap: numberRef(0),
        padding: vector2Ref(0, 0)
    };
    // Find nearest valid grid intersection
    const validCoord = GridCoordUtils.create(Math.max(0, Math.min(coord.row.value, config.rows.value - 1)), Math.max(0, Math.min(coord.col.value, config.cols.value - 1)));
    return vector2Ref(validCoord.col.value, validCoord.row.value);
};
export const getCellDistance = (cellA, cellB) => {
    // Calculate Manhattan distance between grid cells
    const coordA = cellA instanceof Vector2D
        ? GridCoordUtils.create(cellA.y.value, cellA.x.value)
        : GridCoordUtils.create(cellA[1], cellA[0]);
    const coordB = cellB instanceof Vector2D
        ? GridCoordUtils.create(cellB.y.value, cellB.x.value)
        : GridCoordUtils.create(cellB[1], cellB[0]);
    return GridCoordUtils.manhattanDistance(coordA, coordB).value;
};
export const getAdjacentCells = (cellPos, layout) => {
    // Get all adjacent cells (4-way or 8-way adjacency)
    const centerCoord = cellPos instanceof Vector2D
        ? GridCoordUtils.create(cellPos.y.value, cellPos.x.value)
        : GridCoordUtils.create(cellPos[1], cellPos[0]);
    const config = {
        rows: numberRef(layout[1]),
        cols: numberRef(layout[0]),
        cellWidth: numberRef(1),
        cellHeight: numberRef(1),
        gap: numberRef(0),
        padding: vector2Ref(0, 0)
    };
    const adjacent = [];
    const directions = ['up', 'down', 'left', 'right'];
    for (const direction of directions) {
        const adjacentCoord = GridCoordUtils.adjacent(centerCoord, direction);
        if (GridCoordUtils.isValid(adjacentCoord, config).value) {
            adjacent.push(vector2Ref(adjacentCoord.col.value, adjacentCoord.row.value));
        }
    }
    return adjacent;
};
// Advanced grid utility functions using GridMath
export const getCellsInRange = (centerCell, radius, layout) => {
    // Get all cells within Manhattan distance radius
    const centerCoord = centerCell instanceof Vector2D
        ? GridCoordUtils.create(centerCell.y.value, centerCell.x.value)
        : GridCoordUtils.create(centerCell[1], centerCell[0]);
    const config = {
        rows: numberRef(layout[1]),
        cols: numberRef(layout[0]),
        cellWidth: numberRef(1),
        cellHeight: numberRef(1),
        gap: numberRef(0),
        padding: vector2Ref(0, 0)
    };
    const cellsInRange = [];
    for (let row = Math.max(0, centerCoord.row.value - radius); row <= Math.min(layout[1] - 1, centerCoord.row.value + radius); row++) {
        for (let col = Math.max(0, centerCoord.col.value - radius); col <= Math.min(layout[0] - 1, centerCoord.col.value + radius); col++) {
            const testCoord = GridCoordUtils.create(row, col);
            const distance = GridCoordUtils.manhattanDistance(centerCoord, testCoord).value;
            if (distance <= radius) {
                cellsInRange.push(vector2Ref(col, row));
            }
        }
    }
    return cellsInRange;
};
export const findPathBetweenCells = (startCell, endCell, layout, obstacles = []) => {
    // Simple A* pathfinding between grid cells
    const startCoord = startCell instanceof Vector2D
        ? GridCoordUtils.create(startCell.y.value, startCell.x.value)
        : GridCoordUtils.create(startCell[1], startCell[0]);
    const endCoord = endCell instanceof Vector2D
        ? GridCoordUtils.create(endCell.y.value, endCell.x.value)
        : GridCoordUtils.create(endCell[1], endCell[0]);
    // Convert obstacles to coordinate set for fast lookup
    const obstacleSet = new Set(obstacles.map(obs => {
        const coord = obs instanceof Vector2D
            ? GridCoordUtils.create(obs.y.value, obs.x.value)
            : GridCoordUtils.create(obs[1], obs[0]);
        return `${coord.row.value},${coord.col.value}`;
    }));
    const config = {
        rows: numberRef(layout[1]),
        cols: numberRef(layout[0]),
        cellWidth: numberRef(1),
        cellHeight: numberRef(1),
        gap: numberRef(0),
        padding: vector2Ref(0, 0)
    };
    // A* implementation (simplified)
    const openSet = new Map();
    const closedSet = new Set();
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
        const current = openSet.get(currentKey);
        openSet.delete(currentKey);
        closedSet.add(currentKey);
        // Check if we reached the end
        if (current.coord.row.value === endCoord.row.value &&
            current.coord.col.value === endCoord.col.value) {
            // Reconstruct path
            const path = [];
            let node = current;
            while (node) {
                path.unshift(vector2Ref(node.coord.col.value, node.coord.row.value));
                if (!node.parent)
                    break;
                const parentKey = `${node.parent.row.value},${node.parent.col.value}`;
                node = openSet.get(parentKey) || null;
            }
            return path;
        }
        // Check adjacent cells
        const directions = ['up', 'down', 'left', 'right'];
        for (const direction of directions) {
            const neighborCoord = GridCoordUtils.adjacent(current.coord, direction);
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
export const checkCellCollision = (cellA, cellB, cellSizeA = [1, 1], cellSizeB = [1, 1]) => {
    // Check if two cells with spans collide
    const coordA = cellA instanceof Vector2D
        ? GridCoordUtils.create(cellA.y.value, cellA.x.value)
        : GridCoordUtils.create(cellA[1], cellA[0]);
    const coordB = cellB instanceof Vector2D
        ? GridCoordUtils.create(cellB.y.value, cellB.x.value)
        : GridCoordUtils.create(cellB[1], cellB[0]);
    // Create grid cells with spans
    const gridCellA = GridCellUtils.create(coordA.row.value, coordA.col.value, cellSizeA[1], cellSizeA[0] // Note: [width, height] -> [colSpan, rowSpan]
    );
    const gridCellB = GridCellUtils.create(coordB.row.value, coordB.col.value, cellSizeB[1], cellSizeB[0]);
    return GridCellUtils.overlaps(gridCellA, gridCellB).value;
};
export const optimizeCellLayout = (cells, layout) => {
    // Use GridMath layout algorithms to optimize cell positioning
    const config = {
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
        return GridCellUtils.create(coord.row.value, coord.col.value, cell.size[1], cell.size[0] // [width, height] -> [colSpan, rowSpan]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3JpZE1hdGguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJHcmlkTWF0aC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ3hDLE9BQU8sRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQVUsWUFBWSxHQUFHLE1BQU0sU0FBUyxDQUFDO0FBZ0M3Rjs7R0FFRztBQUNILE1BQU0sT0FBTyxjQUFjO0lBQ3ZCLGtDQUFrQztJQUNsQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQWMsQ0FBQyxFQUFFLE1BQWMsQ0FBQztRQUMxQyxPQUFPO1lBQ0gsR0FBRyxFQUFFLFNBQVMsQ0FBQyxHQUFHLENBQUM7WUFDbkIsR0FBRyxFQUFFLFNBQVMsQ0FBQyxHQUFHLENBQUM7U0FDdEIsQ0FBQztJQUNOLENBQUM7SUFFRCw2Q0FBNkM7SUFDN0MsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFnQixFQUFFLE1BQWtCO1FBQy9DLE9BQU8sUUFBUSxDQUFDO1lBQ1osS0FBSyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRztZQUNwQixNQUFNLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxVQUFVO1lBQ25DLE1BQU0sQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ2pELEVBQUUsR0FBRyxFQUFFO1lBQ0osTUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSztnQkFDdkIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3ZFLE1BQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUs7Z0JB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LENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JFLE1BQU0sQ0FBQyxHQUFHLE9BQU8sWUFBWSxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFckUsNERBQTREO0lBQzVELE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN6QyxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFekMsT0FBTyxVQUFVLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQzlDLENBQUMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLFFBQVEsR0FBRyxDQUFDLE9BQW9DLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBWSxFQUFFO0lBQzlFLE1BQU0sQ0FBQyxHQUFHLE9BQU8sWUFBWSxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckUsTUFBTSxDQUFDLEdBQUcsT0FBTyxZQUFZLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVyRSx3REFBd0Q7SUFDeEQsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3ZDLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUV2QyxPQUFPLFVBQVUsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDNUMsQ0FBQyxDQUFDO0FBRUYsTUFBTSxDQUFDLE1BQU0sU0FBUyxHQUFHLENBQUMsT0FBb0MsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFZLEVBQUU7SUFDL0UsTUFBTSxDQUFDLEdBQUcsT0FBTyxZQUFZLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNyRSxNQUFNLENBQUMsR0FBRyxPQUFPLFlBQVksUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRXJFLDREQUE0RDtJQUM1RCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDekMsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBRXpDLE9BQU8sVUFBVSxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUM5QyxDQUFDLENBQUM7QUFFRix5REFBeUQ7QUFDekQsTUFBTSxDQUFDLE1BQU0sY0FBYyxHQUFHLENBQUMsT0FBb0MsRUFBRSxNQUF3QixFQUFZLEVBQUU7SUFDdkcsK0RBQStEO0lBQy9ELE1BQU0sS0FBSyxHQUFHLE9BQU8sWUFBWSxRQUFRO1FBQ3JDLENBQUMsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQ3pELENBQUMsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVwRCxNQUFNLE1BQU0sR0FBZTtRQUN2QixJQUFJLEVBQUUsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxQixJQUFJLEVBQUUsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxQixTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUN2QixVQUFVLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUN4QixHQUFHLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUNqQixPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDNUIsQ0FBQztJQUVGLHVDQUF1QztJQUN2QyxNQUFNLFVBQVUsR0FBRyxjQUFjLENBQUMsTUFBTSxDQUNwQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQzdELElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FDaEUsQ0FBQztJQUVGLE9BQU8sVUFBVSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDbEUsQ0FBQyxDQUFDO0FBRUYsTUFBTSxDQUFDLE1BQU0sZUFBZSxHQUFHLENBQUMsS0FBa0MsRUFBRSxLQUFrQyxFQUFVLEVBQUU7SUFDOUcsa0RBQWtEO0lBQ2xELE1BQU0sTUFBTSxHQUFHLEtBQUssWUFBWSxRQUFRO1FBQ3BDLENBQUMsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQ3JELENBQUMsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVoRCxNQUFNLE1BQU0sR0FBRyxLQUFLLFlBQVksUUFBUTtRQUNwQyxDQUFDLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUNyRCxDQUFDLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFaEQsT0FBTyxjQUFjLENBQUMsaUJBQWlCLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQztBQUNsRSxDQUFDLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSxnQkFBZ0IsR0FBRyxDQUFDLE9BQW9DLEVBQUUsTUFBd0IsRUFBYyxFQUFFO0lBQzNHLG9EQUFvRDtJQUNwRCxNQUFNLFdBQVcsR0FBRyxPQUFPLFlBQVksUUFBUTtRQUMzQyxDQUFDLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUN6RCxDQUFDLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFcEQsTUFBTSxNQUFNLEdBQWU7UUFDdkIsSUFBSSxFQUFFLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUIsSUFBSSxFQUFFLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUIsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDdkIsVUFBVSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDeEIsR0FBRyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDakIsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQzVCLENBQUM7SUFFRixNQUFNLFFBQVEsR0FBZSxFQUFFLENBQUM7SUFDaEMsTUFBTSxVQUFVLEdBQ1osQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztJQUVwQyxLQUFLLE1BQU0sU0FBUyxJQUFJLFVBQVUsRUFBRSxDQUFDO1FBQ2pDLE1BQU0sYUFBYSxHQUFHLGNBQWMsQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ3RFLElBQUksY0FBYyxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDdEQsUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsYUFBYSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ2hGLENBQUM7SUFDTCxDQUFDO0lBRUQsT0FBTyxRQUFRLENBQUM7QUFDcEIsQ0FBQyxDQUFDO0FBRUYsaURBQWlEO0FBQ2pELE1BQU0sQ0FBQyxNQUFNLGVBQWUsR0FBRyxDQUFDLFVBQXVDLEVBQUUsTUFBYyxFQUFFLE1BQXdCLEVBQWMsRUFBRTtJQUM3SCxpREFBaUQ7SUFDakQsTUFBTSxXQUFXLEdBQUcsVUFBVSxZQUFZLFFBQVE7UUFDOUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDL0QsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRTFELE1BQU0sTUFBTSxHQUFlO1FBQ3ZCLElBQUksRUFBRSxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFCLElBQUksRUFBRSxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFCLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ3ZCLFVBQVUsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ3hCLEdBQUcsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ2pCLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUM1QixDQUFDO0lBRUYsTUFBTSxZQUFZLEdBQWUsRUFBRSxDQUFDO0lBRXBDLEtBQUssSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsV0FBVyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLEVBQ3JELEdBQUcsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsV0FBVyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLEVBQzlELEdBQUcsRUFBRSxFQUFFLENBQUM7UUFDVCxLQUFLLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxFQUNyRCxHQUFHLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxFQUM5RCxHQUFHLEVBQUUsRUFBRSxDQUFDO1lBRVQsTUFBTSxTQUFTLEdBQUcsY0FBYyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDbEQsTUFBTSxRQUFRLEdBQUcsY0FBYyxDQUFDLGlCQUFpQixDQUFDLFdBQVcsRUFBRSxTQUFTLENBQUMsQ0FBQyxLQUFLLENBQUM7WUFFaEYsSUFBSSxRQUFRLElBQUksTUFBTSxFQUFFLENBQUM7Z0JBQ3JCLFlBQVksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQzVDLENBQUM7UUFDTCxDQUFDO0lBQ0wsQ0FBQztJQUVELE9BQU8sWUFBWSxDQUFDO0FBQ3hCLENBQUMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLG9CQUFvQixHQUFHLENBQ2hDLFNBQXNDLEVBQ3RDLE9BQW9DLEVBQ3BDLE1BQXdCLEVBQ3hCLFlBQTZDLEVBQUUsRUFDckMsRUFBRTtJQUNaLDJDQUEyQztJQUMzQyxNQUFNLFVBQVUsR0FBRyxTQUFTLFlBQVksUUFBUTtRQUM1QyxDQUFDLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUM3RCxDQUFDLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFeEQsTUFBTSxRQUFRLEdBQUcsT0FBTyxZQUFZLFFBQVE7UUFDeEMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDekQsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRXBELHNEQUFzRDtJQUN0RCxNQUFNLFdBQVcsR0FBRyxJQUFJLEdBQUcsQ0FDdkIsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUNoQixNQUFNLEtBQUssR0FBRyxHQUFHLFlBQVksUUFBUTtZQUNqQyxDQUFDLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztZQUNqRCxDQUFDLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDbkQsQ0FBQyxDQUFDLENBQ0wsQ0FBQztJQUVGLE1BQU0sTUFBTSxHQUFlO1FBQ3ZCLElBQUksRUFBRSxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFCLElBQUksRUFBRSxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFCLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ3ZCLFVBQVUsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ3hCLEdBQUcsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ2pCLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUM1QixDQUFDO0lBRUYsaUNBQWlDO0lBQ2pDLE1BQU0sT0FBTyxHQUFHLElBQUksR0FBRyxFQUFnRixDQUFDO0lBQ3hHLE1BQU0sU0FBUyxHQUFHLElBQUksR0FBRyxFQUFVLENBQUM7SUFFcEMsTUFBTSxRQUFRLEdBQUcsR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLEtBQUssSUFBSSxVQUFVLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ25FLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFO1FBQ2xCLEtBQUssRUFBRSxVQUFVO1FBQ2pCLENBQUMsRUFBRSxjQUFjLENBQUMsaUJBQWlCLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDLEtBQUs7UUFDL0QsQ0FBQyxFQUFFLENBQUM7UUFDSixNQUFNLEVBQUUsSUFBSTtLQUNmLENBQUMsQ0FBQztJQUVILE9BQU8sT0FBTyxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUUsQ0FBQztRQUN0QixnQ0FBZ0M7UUFDaEMsSUFBSSxVQUFVLEdBQUcsRUFBRSxDQUFDO1FBQ3BCLElBQUksT0FBTyxHQUFHLFFBQVEsQ0FBQztRQUV2QixLQUFLLE1BQU0sQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLElBQUksT0FBTyxFQUFFLENBQUM7WUFDaEMsSUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLE9BQU8sRUFBRSxDQUFDO2dCQUNuQixPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDakIsVUFBVSxHQUFHLEdBQUcsQ0FBQztZQUNyQixDQUFDO1FBQ0wsQ0FBQztRQUVELE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFFLENBQUM7UUFDekMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUMzQixTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRTFCLDhCQUE4QjtRQUM5QixJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssS0FBSyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUs7WUFDOUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxLQUFLLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDakQsbUJBQW1CO1lBQ25CLE1BQU0sSUFBSSxHQUFlLEVBQUUsQ0FBQztZQUM1QixJQUFJLElBQUksR0FBMEIsT0FBTyxDQUFDO1lBRTFDLE9BQU8sSUFBSSxFQUFFLENBQUM7Z0JBQ1YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ3JFLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTTtvQkFBRSxNQUFNO2dCQUV4QixNQUFNLFNBQVMsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDdEUsSUFBSSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksSUFBSSxDQUFDO1lBQzFDLENBQUM7WUFFRCxPQUFPLElBQUksQ0FBQztRQUNoQixDQUFDO1FBRUQsdUJBQXVCO1FBQ3ZCLE1BQU0sVUFBVSxHQUNaLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFcEMsS0FBSyxNQUFNLFNBQVMsSUFBSSxVQUFVLEVBQUUsQ0FBQztZQUNqQyxNQUFNLGFBQWEsR0FBRyxjQUFjLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsU0FBNkMsQ0FBQyxDQUFDO1lBQzVHLE1BQU0sV0FBVyxHQUFHLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQyxLQUFLLElBQUksYUFBYSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUU1RSxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDLENBQUMsS0FBSztnQkFDcEQsU0FBUyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUM7Z0JBQzFCLFdBQVcsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQztnQkFDL0IsU0FBUztZQUNiLENBQUM7WUFFRCxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLHFCQUFxQjtZQUNuRCxNQUFNLE1BQU0sR0FBRyxjQUFjLENBQUMsaUJBQWlCLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQztZQUMvRSxNQUFNLE1BQU0sR0FBRyxNQUFNLEdBQUcsTUFBTSxDQUFDO1lBRS9CLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDMUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDO2dCQUNuQyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRTtvQkFDckIsS0FBSyxFQUFFLGFBQWE7b0JBQ3BCLENBQUMsRUFBRSxNQUFNO29CQUNULENBQUMsRUFBRSxNQUFNO29CQUNULE1BQU0sRUFBRSxPQUFPLENBQUMsS0FBSztpQkFDeEIsQ0FBQyxDQUFDO1lBQ1AsQ0FBQztRQUNMLENBQUM7SUFDTCxDQUFDO0lBRUQsZ0JBQWdCO0lBQ2hCLE9BQU8sRUFBRSxDQUFDO0FBQ2QsQ0FBQyxDQUFDO0FBRUYsTUFBTSxDQUFDLE1BQU0sa0JBQWtCLEdBQUcsQ0FDOUIsS0FBa0MsRUFDbEMsS0FBa0MsRUFDbEMsWUFBOEIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQ3BDLFlBQThCLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUM3QixFQUFFO0lBQ1Qsd0NBQXdDO0lBQ3hDLE1BQU0sTUFBTSxHQUFHLEtBQUssWUFBWSxRQUFRO1FBQ3BDLENBQUMsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQ3JELENBQUMsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVoRCxNQUFNLE1BQU0sR0FBRyxLQUFLLFlBQVksUUFBUTtRQUNwQyxDQUFDLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUNyRCxDQUFDLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFaEQsK0JBQStCO0lBQy9CLE1BQU0sU0FBUyxHQUFHLGFBQWEsQ0FBQyxNQUFNLENBQ2xDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUNsQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFFLDhDQUE4QztLQUM3RSxDQUFDO0lBRUYsTUFBTSxTQUFTLEdBQUcsYUFBYSxDQUFDLE1BQU0sQ0FDbEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQ2xDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQzdCLENBQUM7SUFFRixPQUFPLGFBQWEsQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDLEtBQUssQ0FBQztBQUM5RCxDQUFDLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSxrQkFBa0IsR0FBRyxDQUM5QixLQUEwRSxFQUMxRSxNQUF3QixFQUN3QixFQUFFO0lBQ2xELDhEQUE4RDtJQUM5RCxNQUFNLE1BQU0sR0FBZTtRQUN2QixJQUFJLEVBQUUsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxQixJQUFJLEVBQUUsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxQixTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUN2QixVQUFVLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUN4QixHQUFHLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUNqQixPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDNUIsQ0FBQztJQUVGLDZCQUE2QjtJQUM3QixNQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO1FBQ3hDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLFlBQVksUUFBUTtZQUN0QyxDQUFDLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1lBQzNELENBQUMsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXRELE9BQU8sYUFBYSxDQUFDLE1BQU0sQ0FDdkIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQ2hDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBRSx3Q0FBd0M7U0FDdkUsQ0FBQztJQUNOLENBQUMsQ0FBQyxDQUFDO0lBRUgsNENBQTRDO0lBQzVDLE1BQU0sV0FBVyxHQUFHLGVBQWUsQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBRWhFLGtDQUFrQztJQUNsQyxPQUFPLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxVQUFVLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzNDLEdBQUcsRUFBRSxVQUFVLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUM7UUFDM0QsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7S0FDN0QsQ0FBQyxDQUFDLENBQUM7QUFDUixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBudW1iZXJSZWYgfSBmcm9tIFwiZmVzdC9vYmplY3RcIjtcbmltcG9ydCB7IG9wZXJhdGVkLCB2ZWN0b3IyUmVmLCBWZWN0b3IyRCwgYWRkVmVjdG9yMkQsIFJlY3QyRCwgY3JlYXRlUmVjdDJELCB9IGZyb20gXCIuL2luZGV4XCI7XG5cbi8vIEdyaWQtc3BlY2lmaWMgbWF0aGVtYXRpY2FsIHR5cGVzIGFuZCBvcGVyYXRpb25zXG5cbi8qKlxuICogR3JpZCBjb29yZGluYXRlIHN5c3RlbSB3aXRoIHJvdy9jb2x1bW4gYWRkcmVzc2luZ1xuICovXG5leHBvcnQgaW50ZXJmYWNlIEdyaWRDb29yZCB7XG4gICAgcm93OiBSZXR1cm5UeXBlPHR5cGVvZiBudW1iZXJSZWY+O1xuICAgIGNvbDogUmV0dXJuVHlwZTx0eXBlb2YgbnVtYmVyUmVmPjtcbn1cblxuLyoqXG4gKiBHcmlkIGNlbGwgZGVmaW5pdGlvbiB3aXRoIHBvc2l0aW9uIGFuZCBzcGFuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgR3JpZENlbGwgZXh0ZW5kcyBHcmlkQ29vcmQge1xuICAgIHJvd1NwYW46IFJldHVyblR5cGU8dHlwZW9mIG51bWJlclJlZj47XG4gICAgY29sU3BhbjogUmV0dXJuVHlwZTx0eXBlb2YgbnVtYmVyUmVmPjtcbn1cblxuLyoqXG4gKiBHcmlkIGxheW91dCBjb25maWd1cmF0aW9uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgR3JpZENvbmZpZyB7XG4gICAgcm93czogUmV0dXJuVHlwZTx0eXBlb2YgbnVtYmVyUmVmPjtcbiAgICBjb2xzOiBSZXR1cm5UeXBlPHR5cGVvZiBudW1iZXJSZWY+O1xuICAgIGNlbGxXaWR0aDogUmV0dXJuVHlwZTx0eXBlb2YgbnVtYmVyUmVmPjtcbiAgICBjZWxsSGVpZ2h0OiBSZXR1cm5UeXBlPHR5cGVvZiBudW1iZXJSZWY+O1xuICAgIGdhcDogUmV0dXJuVHlwZTx0eXBlb2YgbnVtYmVyUmVmPjsgLy8gR2FwIGJldHdlZW4gY2VsbHNcbiAgICBwYWRkaW5nOiBWZWN0b3IyRDsgLy8gR3JpZCBwYWRkaW5nXG59XG5cbi8qKlxuICogR3JpZCBjb29yZGluYXRlIHV0aWxpdGllc1xuICovXG5leHBvcnQgY2xhc3MgR3JpZENvb3JkVXRpbHMge1xuICAgIC8vIENyZWF0ZSByZWFjdGl2ZSBncmlkIGNvb3JkaW5hdGVcbiAgICBzdGF0aWMgY3JlYXRlKHJvdzogbnVtYmVyID0gMCwgY29sOiBudW1iZXIgPSAwKTogR3JpZENvb3JkIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJvdzogbnVtYmVyUmVmKHJvdyksXG4gICAgICAgICAgICBjb2w6IG51bWJlclJlZihjb2wpXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gQ29udmVydCBncmlkIGNvb3JkaW5hdGVzIHRvIHBpeGVsIHBvc2l0aW9uXG4gICAgc3RhdGljIHRvUGl4ZWwoY29vcmQ6IEdyaWRDb29yZCwgY29uZmlnOiBHcmlkQ29uZmlnKTogVmVjdG9yMkQge1xuICAgICAgICByZXR1cm4gb3BlcmF0ZWQoW1xuICAgICAgICAgICAgY29vcmQucm93LCBjb29yZC5jb2wsXG4gICAgICAgICAgICBjb25maWcuY2VsbFdpZHRoLCBjb25maWcuY2VsbEhlaWdodCxcbiAgICAgICAgICAgIGNvbmZpZy5nYXAsIGNvbmZpZy5wYWRkaW5nLngsIGNvbmZpZy5wYWRkaW5nLnlcbiAgICAgICAgXSwgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgeCA9IGNvbmZpZy5wYWRkaW5nLngudmFsdWUgK1xuICAgICAgICAgICAgICAgICAgICAgY29vcmQuY29sLnZhbHVlICogKGNvbmZpZy5jZWxsV2lkdGgudmFsdWUgKyBjb25maWcuZ2FwLnZhbHVlKTtcbiAgICAgICAgICAgIGNvbnN0IHkgPSBjb25maWcucGFkZGluZy55LnZhbHVlICtcbiAgICAgICAgICAgICAgICAgICAgIGNvb3JkLnJvdy52YWx1ZSAqIChjb25maWcuY2VsbEhlaWdodC52YWx1ZSArIGNvbmZpZy5nYXAudmFsdWUpO1xuICAgICAgICAgICAgcmV0dXJuIHZlY3RvcjJSZWYoeCwgeSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIENvbnZlcnQgcGl4ZWwgcG9zaXRpb24gdG8gZ3JpZCBjb29yZGluYXRlc1xuICAgIHN0YXRpYyBmcm9tUGl4ZWwocGl4ZWw6IFZlY3RvcjJELCBjb25maWc6IEdyaWRDb25maWcpOiBHcmlkQ29vcmQge1xuICAgICAgICBjb25zdCBjb29yZCA9IG9wZXJhdGVkKFtcbiAgICAgICAgICAgIHBpeGVsLngsIHBpeGVsLnksXG4gICAgICAgICAgICBjb25maWcuY2VsbFdpZHRoLCBjb25maWcuY2VsbEhlaWdodCxcbiAgICAgICAgICAgIGNvbmZpZy5nYXAsIGNvbmZpZy5wYWRkaW5nLngsIGNvbmZpZy5wYWRkaW5nLnlcbiAgICAgICAgXSwgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgY29sID0gTWF0aC5mbG9vcihcbiAgICAgICAgICAgICAgICAocGl4ZWwueC52YWx1ZSAtIGNvbmZpZy5wYWRkaW5nLngudmFsdWUpIC9cbiAgICAgICAgICAgICAgICAoY29uZmlnLmNlbGxXaWR0aC52YWx1ZSArIGNvbmZpZy5nYXAudmFsdWUpXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgY29uc3Qgcm93ID0gTWF0aC5mbG9vcihcbiAgICAgICAgICAgICAgICAocGl4ZWwueS52YWx1ZSAtIGNvbmZpZy5wYWRkaW5nLnkudmFsdWUpIC9cbiAgICAgICAgICAgICAgICAoY29uZmlnLmNlbGxIZWlnaHQudmFsdWUgKyBjb25maWcuZ2FwLnZhbHVlKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBHcmlkQ29vcmRVdGlscy5jcmVhdGUocm93LCBjb2wpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcm93OiBvcGVyYXRlZChbY29vcmRdLCAoKSA9PiAoY29vcmQudmFsdWUgYXMgYW55KS5yb3cudmFsdWUpLFxuICAgICAgICAgICAgY29sOiBvcGVyYXRlZChbY29vcmRdLCAoKSA9PiAoY29vcmQudmFsdWUgYXMgYW55KS5jb2wudmFsdWUpXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gU25hcCBwaXhlbCBwb3NpdGlvbiB0byBuZWFyZXN0IGdyaWQgaW50ZXJzZWN0aW9uXG4gICAgc3RhdGljIHNuYXBUb0dyaWQocGl4ZWw6IFZlY3RvcjJELCBjb25maWc6IEdyaWRDb25maWcpOiBWZWN0b3IyRCB7XG4gICAgICAgIGNvbnN0IGdyaWRDb29yZCA9IHRoaXMuZnJvbVBpeGVsKHBpeGVsLCBjb25maWcpO1xuICAgICAgICByZXR1cm4gdGhpcy50b1BpeGVsKGdyaWRDb29yZCwgY29uZmlnKTtcbiAgICB9XG5cbiAgICAvLyBTbmFwIHBpeGVsIHBvc2l0aW9uIHRvIG5lYXJlc3QgZ3JpZCBjZWxsIGNlbnRlclxuICAgIHN0YXRpYyBzbmFwVG9DZWxsQ2VudGVyKHBpeGVsOiBWZWN0b3IyRCwgY29uZmlnOiBHcmlkQ29uZmlnKTogVmVjdG9yMkQge1xuICAgICAgICBjb25zdCBncmlkQ29vcmQgPSB0aGlzLmZyb21QaXhlbChwaXhlbCwgY29uZmlnKTtcbiAgICAgICAgY29uc3QgY2VsbFRvcExlZnQgPSB0aGlzLnRvUGl4ZWwoZ3JpZENvb3JkLCBjb25maWcpO1xuXG4gICAgICAgIHJldHVybiBvcGVyYXRlZChbXG4gICAgICAgICAgICBjZWxsVG9wTGVmdC54LCBjZWxsVG9wTGVmdC55LFxuICAgICAgICAgICAgY29uZmlnLmNlbGxXaWR0aCwgY29uZmlnLmNlbGxIZWlnaHRcbiAgICAgICAgXSwgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgY2VudGVyWCA9IGNlbGxUb3BMZWZ0LngudmFsdWUgKyBjb25maWcuY2VsbFdpZHRoLnZhbHVlIC8gMjtcbiAgICAgICAgICAgIGNvbnN0IGNlbnRlclkgPSBjZWxsVG9wTGVmdC55LnZhbHVlICsgY29uZmlnLmNlbGxIZWlnaHQudmFsdWUgLyAyO1xuICAgICAgICAgICAgcmV0dXJuIHZlY3RvcjJSZWYoY2VudGVyWCwgY2VudGVyWSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIEdldCBhZGphY2VudCBjb29yZGluYXRlc1xuICAgIHN0YXRpYyBhZGphY2VudChjb29yZDogR3JpZENvb3JkLCBkaXJlY3Rpb246ICd1cCcgfCAnZG93bicgfCAnbGVmdCcgfCAncmlnaHQnKTogR3JpZENvb3JkIHtcbiAgICAgICAgY29uc3QgZGVsdGFzID0ge1xuICAgICAgICAgICAgdXA6IHsgcm93OiAtMSwgY29sOiAwIH0sXG4gICAgICAgICAgICBkb3duOiB7IHJvdzogMSwgY29sOiAwIH0sXG4gICAgICAgICAgICBsZWZ0OiB7IHJvdzogMCwgY29sOiAtMSB9LFxuICAgICAgICAgICAgcmlnaHQ6IHsgcm93OiAwLCBjb2w6IDEgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IGRlbHRhID0gZGVsdGFzW2RpcmVjdGlvbl07XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByb3c6IG9wZXJhdGVkKFtjb29yZC5yb3ddLCAoKSA9PiBjb29yZC5yb3cudmFsdWUgKyBkZWx0YS5yb3cpLFxuICAgICAgICAgICAgY29sOiBvcGVyYXRlZChbY29vcmQuY29sXSwgKCkgPT4gY29vcmQuY29sLnZhbHVlICsgZGVsdGEuY29sKVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vIENoZWNrIGlmIGNvb3JkaW5hdGUgaXMgd2l0aGluIGdyaWQgYm91bmRzXG4gICAgc3RhdGljIGlzVmFsaWQoY29vcmQ6IEdyaWRDb29yZCwgY29uZmlnOiBHcmlkQ29uZmlnKTogUmV0dXJuVHlwZTx0eXBlb2YgbnVtYmVyUmVmPiB7XG4gICAgICAgIHJldHVybiBvcGVyYXRlZChbY29vcmQucm93LCBjb29yZC5jb2wsIGNvbmZpZy5yb3dzLCBjb25maWcuY29sc10sICgpID0+XG4gICAgICAgICAgICBjb29yZC5yb3cudmFsdWUgPj0gMCAmJiBjb29yZC5yb3cudmFsdWUgPCBjb25maWcucm93cy52YWx1ZSAmJlxuICAgICAgICAgICAgY29vcmQuY29sLnZhbHVlID49IDAgJiYgY29vcmQuY29sLnZhbHVlIDwgY29uZmlnLmNvbHMudmFsdWVcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBNYW5oYXR0YW4gZGlzdGFuY2UgYmV0d2VlbiBncmlkIGNvb3JkaW5hdGVzXG4gICAgc3RhdGljIG1hbmhhdHRhbkRpc3RhbmNlKGE6IEdyaWRDb29yZCwgYjogR3JpZENvb3JkKTogUmV0dXJuVHlwZTx0eXBlb2YgbnVtYmVyUmVmPiB7XG4gICAgICAgIHJldHVybiBvcGVyYXRlZChbYS5yb3csIGEuY29sLCBiLnJvdywgYi5jb2xdLCAoKSA9PlxuICAgICAgICAgICAgTWF0aC5hYnMoYS5yb3cudmFsdWUgLSBiLnJvdy52YWx1ZSkgKyBNYXRoLmFicyhhLmNvbC52YWx1ZSAtIGIuY29sLnZhbHVlKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8vIEV1Y2xpZGVhbiBkaXN0YW5jZSBiZXR3ZWVuIGdyaWQgY29vcmRpbmF0ZXNcbiAgICBzdGF0aWMgZXVjbGlkZWFuRGlzdGFuY2UoYTogR3JpZENvb3JkLCBiOiBHcmlkQ29vcmQpOiBSZXR1cm5UeXBlPHR5cGVvZiBudW1iZXJSZWY+IHtcbiAgICAgICAgcmV0dXJuIG9wZXJhdGVkKFthLnJvdywgYS5jb2wsIGIucm93LCBiLmNvbF0sICgpID0+XG4gICAgICAgICAgICBNYXRoLnNxcnQoXG4gICAgICAgICAgICAgICAgTWF0aC5wb3coYS5yb3cudmFsdWUgLSBiLnJvdy52YWx1ZSwgMikgK1xuICAgICAgICAgICAgICAgIE1hdGgucG93KGEuY29sLnZhbHVlIC0gYi5jb2wudmFsdWUsIDIpXG4gICAgICAgICAgICApXG4gICAgICAgICk7XG4gICAgfVxufVxuXG4vKipcbiAqIEdyaWQgY2VsbCB1dGlsaXRpZXMgd2l0aCBzcGFuIHN1cHBvcnRcbiAqL1xuZXhwb3J0IGNsYXNzIEdyaWRDZWxsVXRpbHMge1xuICAgIC8vIENyZWF0ZSByZWFjdGl2ZSBncmlkIGNlbGxcbiAgICBzdGF0aWMgY3JlYXRlKHJvdzogbnVtYmVyID0gMCwgY29sOiBudW1iZXIgPSAwLCByb3dTcGFuOiBudW1iZXIgPSAxLCBjb2xTcGFuOiBudW1iZXIgPSAxKTogR3JpZENlbGwge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcm93OiBudW1iZXJSZWYocm93KSxcbiAgICAgICAgICAgIGNvbDogbnVtYmVyUmVmKGNvbCksXG4gICAgICAgICAgICByb3dTcGFuOiBudW1iZXJSZWYocm93U3BhbiksXG4gICAgICAgICAgICBjb2xTcGFuOiBudW1iZXJSZWYoY29sU3BhbilcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBDb252ZXJ0IGdyaWQgY2VsbCB0byBwaXhlbCByZWN0YW5nbGVcbiAgICBzdGF0aWMgdG9SZWN0KGNlbGw6IEdyaWRDZWxsLCBjb25maWc6IEdyaWRDb25maWcpOiBSZWN0MkQge1xuICAgICAgICBjb25zdCB0b3BMZWZ0ID0gR3JpZENvb3JkVXRpbHMudG9QaXhlbChjZWxsLCBjb25maWcpO1xuXG4gICAgICAgIC8vIENhbGN1bGF0ZSB3aWR0aCBhbmQgaGVpZ2h0IGNvbnNpZGVyaW5nIHNwYW5zXG4gICAgICAgIGNvbnN0IHdpZHRoID0gb3BlcmF0ZWQoW1xuICAgICAgICAgICAgY2VsbC5jb2xTcGFuLCBjb25maWcuY2VsbFdpZHRoLCBjb25maWcuZ2FwXG4gICAgICAgIF0sICgpID0+XG4gICAgICAgICAgICBjZWxsLmNvbFNwYW4udmFsdWUgKiBjb25maWcuY2VsbFdpZHRoLnZhbHVlICtcbiAgICAgICAgICAgIChjZWxsLmNvbFNwYW4udmFsdWUgLSAxKSAqIGNvbmZpZy5nYXAudmFsdWVcbiAgICAgICAgKTtcblxuICAgICAgICBjb25zdCBoZWlnaHQgPSBvcGVyYXRlZChbXG4gICAgICAgICAgICBjZWxsLnJvd1NwYW4sIGNvbmZpZy5jZWxsSGVpZ2h0LCBjb25maWcuZ2FwXG4gICAgICAgIF0sICgpID0+XG4gICAgICAgICAgICBjZWxsLnJvd1NwYW4udmFsdWUgKiBjb25maWcuY2VsbEhlaWdodC52YWx1ZSArXG4gICAgICAgICAgICAoY2VsbC5yb3dTcGFuLnZhbHVlIC0gMSkgKiBjb25maWcuZ2FwLnZhbHVlXG4gICAgICAgICk7XG5cbiAgICAgICAgcmV0dXJuIGNyZWF0ZVJlY3QyRCh0b3BMZWZ0LngsIHRvcExlZnQueSwgd2lkdGgsIGhlaWdodCk7XG4gICAgfVxuXG4gICAgLy8gR2V0IGNlbGwgY2VudGVyIHBvaW50XG4gICAgc3RhdGljIGdldENlbnRlcihjZWxsOiBHcmlkQ2VsbCwgY29uZmlnOiBHcmlkQ29uZmlnKTogVmVjdG9yMkQge1xuICAgICAgICBjb25zdCByZWN0ID0gdGhpcy50b1JlY3QoY2VsbCwgY29uZmlnKTtcbiAgICAgICAgcmV0dXJuIG9wZXJhdGVkKFtyZWN0LnBvc2l0aW9uLngsIHJlY3QucG9zaXRpb24ueSwgcmVjdC5zaXplLngsIHJlY3Quc2l6ZS55XSwgKCkgPT5cbiAgICAgICAgICAgIHZlY3RvcjJSZWYoXG4gICAgICAgICAgICAgICAgcmVjdC5wb3NpdGlvbi54LnZhbHVlICsgcmVjdC5zaXplLngudmFsdWUgLyAyLFxuICAgICAgICAgICAgICAgIHJlY3QucG9zaXRpb24ueS52YWx1ZSArIHJlY3Quc2l6ZS55LnZhbHVlIC8gMlxuICAgICAgICAgICAgKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8vIENoZWNrIGlmIGNlbGxzIG92ZXJsYXAgKGNvbnNpZGVyaW5nIHNwYW5zKVxuICAgIHN0YXRpYyBvdmVybGFwcyhhOiBHcmlkQ2VsbCwgYjogR3JpZENlbGwpOiBSZXR1cm5UeXBlPHR5cGVvZiBudW1iZXJSZWY+IHtcbiAgICAgICAgcmV0dXJuIG9wZXJhdGVkKFtcbiAgICAgICAgICAgIGEucm93LCBhLmNvbCwgYS5yb3dTcGFuLCBhLmNvbFNwYW4sXG4gICAgICAgICAgICBiLnJvdywgYi5jb2wsIGIucm93U3BhbiwgYi5jb2xTcGFuXG4gICAgICAgIF0sICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGFSaWdodCA9IGEuY29sLnZhbHVlICsgYS5jb2xTcGFuLnZhbHVlO1xuICAgICAgICAgICAgY29uc3QgYUJvdHRvbSA9IGEucm93LnZhbHVlICsgYS5yb3dTcGFuLnZhbHVlO1xuICAgICAgICAgICAgY29uc3QgYlJpZ2h0ID0gYi5jb2wudmFsdWUgKyBiLmNvbFNwYW4udmFsdWU7XG4gICAgICAgICAgICBjb25zdCBiQm90dG9tID0gYi5yb3cudmFsdWUgKyBiLnJvd1NwYW4udmFsdWU7XG5cbiAgICAgICAgICAgIHJldHVybiAhKGEuY29sLnZhbHVlID49IGJSaWdodCB8fCBhUmlnaHQgPD0gYi5jb2wudmFsdWUgfHxcbiAgICAgICAgICAgICAgICAgICAgYS5yb3cudmFsdWUgPj0gYkJvdHRvbSB8fCBhQm90dG9tIDw9IGIucm93LnZhbHVlKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gR2V0IGNlbGxzIHRoYXQgYSBzcGFubmluZyBjZWxsIG9jY3VwaWVzXG4gICAgc3RhdGljIGdldE9jY3VwaWVkQ2VsbHMoY2VsbDogR3JpZENlbGwpOiBHcmlkQ29vcmRbXSB7XG4gICAgICAgIGNvbnN0IGNlbGxzOiBHcmlkQ29vcmRbXSA9IFtdO1xuXG4gICAgICAgIGZvciAobGV0IHIgPSAwOyByIDwgY2VsbC5yb3dTcGFuLnZhbHVlOyByKyspIHtcbiAgICAgICAgICAgIGZvciAobGV0IGMgPSAwOyBjIDwgY2VsbC5jb2xTcGFuLnZhbHVlOyBjKyspIHtcbiAgICAgICAgICAgICAgICBjZWxscy5wdXNoKEdyaWRDb29yZFV0aWxzLmNyZWF0ZShcbiAgICAgICAgICAgICAgICAgICAgY2VsbC5yb3cudmFsdWUgKyByLFxuICAgICAgICAgICAgICAgICAgICBjZWxsLmNvbC52YWx1ZSArIGNcbiAgICAgICAgICAgICAgICApKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjZWxscztcbiAgICB9XG59XG5cbi8qKlxuICogR3JpZCBsYXlvdXQgYWxnb3JpdGhtc1xuICovXG5leHBvcnQgY2xhc3MgR3JpZExheW91dFV0aWxzIHtcbiAgICAvLyBGaXQgY2VsbHMgaW50byBncmlkIHdpdGhvdXQgb3ZlcmxhcCAoYmFzaWMgYmluIHBhY2tpbmcpXG4gICAgc3RhdGljIGZpdENlbGxzKGNlbGxzOiBHcmlkQ2VsbFtdLCBjb25maWc6IEdyaWRDb25maWcpOiBHcmlkQ2VsbFtdIHtcbiAgICAgICAgY29uc3QgcGxhY2VkOiBHcmlkQ2VsbFtdID0gW107XG4gICAgICAgIGNvbnN0IG9jY3VwaWVkID0gbmV3IFNldDxzdHJpbmc+KCk7XG5cbiAgICAgICAgY2VsbHMuZm9yRWFjaChjZWxsID0+IHtcbiAgICAgICAgICAgIGxldCBwbGFjZWRDZWxsID0geyAuLi5jZWxsIH07XG5cbiAgICAgICAgICAgIC8vIFRyeSB0byBmaW5kIGEgdmFsaWQgcG9zaXRpb25cbiAgICAgICAgICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IGNvbmZpZy5yb3dzLnZhbHVlOyByb3crKykge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IGNvbmZpZy5jb2xzLnZhbHVlOyBjb2wrKykge1xuICAgICAgICAgICAgICAgICAgICBwbGFjZWRDZWxsLnJvdyA9IG51bWJlclJlZihyb3cpO1xuICAgICAgICAgICAgICAgICAgICBwbGFjZWRDZWxsLmNvbCA9IG51bWJlclJlZihjb2wpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoaXMgcG9zaXRpb24gZml0c1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jYW5QbGFjZUNlbGwocGxhY2VkQ2VsbCwgb2NjdXBpZWQsIGNvbmZpZykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWFya09jY3VwaWVkKHBsYWNlZENlbGwsIG9jY3VwaWVkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlZC5wdXNoKHBsYWNlZENlbGwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBJZiBubyBwb3NpdGlvbiBmb3VuZCwgcGxhY2UgYXQgb3JpZ2luICh3aWxsIG92ZXJsYXApXG4gICAgICAgICAgICBwbGFjZWQucHVzaChwbGFjZWRDZWxsKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHBsYWNlZDtcbiAgICB9XG5cbiAgICAvLyBDaGVjayBpZiBhIGNlbGwgY2FuIGJlIHBsYWNlZCBhdCBpdHMgY3VycmVudCBwb3NpdGlvblxuICAgIHN0YXRpYyBjYW5QbGFjZUNlbGwoY2VsbDogR3JpZENlbGwsIG9jY3VwaWVkOiBTZXQ8c3RyaW5nPiwgY29uZmlnOiBHcmlkQ29uZmlnKTogYm9vbGVhbiB7XG4gICAgICAgIC8vIENoZWNrIGJvdW5kc1xuICAgICAgICBpZiAoIUdyaWRDb29yZFV0aWxzLmlzVmFsaWQoY2VsbCwgY29uZmlnKS52YWx1ZSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIC8vIENoZWNrIGlmIGFueSBvY2N1cGllZCBjZWxscyBjb25mbGljdFxuICAgICAgICBjb25zdCBvY2N1cGllZENlbGxzID0gR3JpZENlbGxVdGlscy5nZXRPY2N1cGllZENlbGxzKGNlbGwpO1xuICAgICAgICByZXR1cm4gIW9jY3VwaWVkQ2VsbHMuc29tZShjb29yZCA9PlxuICAgICAgICAgICAgb2NjdXBpZWQuaGFzKGAke2Nvb3JkLnJvdy52YWx1ZX0sJHtjb29yZC5jb2wudmFsdWV9YClcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBNYXJrIGNlbGxzIGFzIG9jY3VwaWVkXG4gICAgc3RhdGljIG1hcmtPY2N1cGllZChjZWxsOiBHcmlkQ2VsbCwgb2NjdXBpZWQ6IFNldDxzdHJpbmc+KTogdm9pZCB7XG4gICAgICAgIGNvbnN0IG9jY3VwaWVkQ2VsbHMgPSBHcmlkQ2VsbFV0aWxzLmdldE9jY3VwaWVkQ2VsbHMoY2VsbCk7XG4gICAgICAgIG9jY3VwaWVkQ2VsbHMuZm9yRWFjaChjb29yZCA9PiB7XG4gICAgICAgICAgICBvY2N1cGllZC5hZGQoYCR7Y29vcmQucm93LnZhbHVlfSwke2Nvb3JkLmNvbC52YWx1ZX1gKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gQ2FsY3VsYXRlIG9wdGltYWwgZ3JpZCBzaXplIGZvciBnaXZlbiBjZWxsc1xuICAgIHN0YXRpYyBjYWxjdWxhdGVPcHRpbWFsU2l6ZShjZWxsczogR3JpZENlbGxbXSk6IHsgcm93czogbnVtYmVyLCBjb2xzOiBudW1iZXIgfSB7XG4gICAgICAgIGxldCBtYXhSb3cgPSAwLCBtYXhDb2wgPSAwO1xuXG4gICAgICAgIGNlbGxzLmZvckVhY2goY2VsbCA9PiB7XG4gICAgICAgICAgICBtYXhSb3cgPSBNYXRoLm1heChtYXhSb3csIGNlbGwucm93LnZhbHVlICsgY2VsbC5yb3dTcGFuLnZhbHVlKTtcbiAgICAgICAgICAgIG1heENvbCA9IE1hdGgubWF4KG1heENvbCwgY2VsbC5jb2wudmFsdWUgKyBjZWxsLmNvbFNwYW4udmFsdWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4geyByb3dzOiBtYXhSb3csIGNvbHM6IG1heENvbCB9O1xuICAgIH1cblxuICAgIC8vIFJlZGlzdHJpYnV0ZSBjZWxscyB1c2luZyBkaWZmZXJlbnQgYWxnb3JpdGhtc1xuICAgIHN0YXRpYyByZWRpc3RyaWJ1dGVDZWxscyhcbiAgICAgICAgY2VsbHM6IEdyaWRDZWxsW10sXG4gICAgICAgIGNvbmZpZzogR3JpZENvbmZpZyxcbiAgICAgICAgYWxnb3JpdGhtOiAncm93LW1ham9yJyB8ICdjb2x1bW4tbWFqb3InIHwgJ2RpYWdvbmFsJyA9ICdyb3ctbWFqb3InXG4gICAgKTogR3JpZENlbGxbXSB7XG4gICAgICAgIGNvbnN0IHJlZGlzdHJpYnV0ZWQ6IEdyaWRDZWxsW10gPSBbXTtcbiAgICAgICAgbGV0IGN1cnJlbnRSb3cgPSAwLCBjdXJyZW50Q29sID0gMDtcblxuICAgICAgICBjZWxscy5mb3JFYWNoKChjZWxsLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgc3dpdGNoIChhbGdvcml0aG0pIHtcbiAgICAgICAgICAgICAgICBjYXNlICdyb3ctbWFqb3InOlxuICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudENvbCArIGNlbGwuY29sU3Bhbi52YWx1ZSA+IGNvbmZpZy5jb2xzLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50Um93Kys7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50Q29sID0gMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjZWxsLnJvdyA9IG51bWJlclJlZihjdXJyZW50Um93KTtcbiAgICAgICAgICAgICAgICAgICAgY2VsbC5jb2wgPSBudW1iZXJSZWYoY3VycmVudENvbCk7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRDb2wgKz0gY2VsbC5jb2xTcGFuLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ2NvbHVtbi1tYWpvcic6XG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50Um93ICsgY2VsbC5yb3dTcGFuLnZhbHVlID4gY29uZmlnLnJvd3MudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRDb2wrKztcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRSb3cgPSAwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNlbGwucm93ID0gbnVtYmVyUmVmKGN1cnJlbnRSb3cpO1xuICAgICAgICAgICAgICAgICAgICBjZWxsLmNvbCA9IG51bWJlclJlZihjdXJyZW50Q29sKTtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFJvdyArPSBjZWxsLnJvd1NwYW4udmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnZGlhZ29uYWwnOlxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkaWFnb25hbCA9IE1hdGguZmxvb3IoaW5kZXggLyBNYXRoLnNxcnQoY2VsbHMubGVuZ3RoKSk7XG4gICAgICAgICAgICAgICAgICAgIGNlbGwucm93ID0gbnVtYmVyUmVmKGRpYWdvbmFsKTtcbiAgICAgICAgICAgICAgICAgICAgY2VsbC5jb2wgPSBudW1iZXJSZWYoaW5kZXggJSBNYXRoLmNlaWwoTWF0aC5zcXJ0KGNlbGxzLmxlbmd0aCkpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJlZGlzdHJpYnV0ZWQucHVzaChjZWxsKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHJlZGlzdHJpYnV0ZWQ7XG4gICAgfVxufVxuXG4vKipcbiAqIEdyaWQgYW5pbWF0aW9uIGFuZCB0cmFuc2l0aW9uIHV0aWxpdGllc1xuICovXG5leHBvcnQgY2xhc3MgR3JpZEFuaW1hdGlvblV0aWxzIHtcbiAgICAvLyBBbmltYXRlIGNlbGwgbW92ZW1lbnQgYWxvbmcgZ3JpZFxuICAgIHN0YXRpYyBhbmltYXRlQ2VsbE1vdmVtZW50KFxuICAgICAgICBjZWxsOiBHcmlkQ2VsbCxcbiAgICAgICAgdGFyZ2V0Q29vcmQ6IEdyaWRDb29yZCxcbiAgICAgICAgY29uZmlnOiBHcmlkQ29uZmlnLFxuICAgICAgICBkdXJhdGlvbjogbnVtYmVyID0gMzAwXG4gICAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHN0YXJ0Um93ID0gY2VsbC5yb3cudmFsdWU7XG4gICAgICAgICAgICBjb25zdCBzdGFydENvbCA9IGNlbGwuY29sLnZhbHVlO1xuICAgICAgICAgICAgY29uc3QgZW5kUm93ID0gdGFyZ2V0Q29vcmQucm93LnZhbHVlO1xuICAgICAgICAgICAgY29uc3QgZW5kQ29sID0gdGFyZ2V0Q29vcmQuY29sLnZhbHVlO1xuXG4gICAgICAgICAgICBjb25zdCBzdGFydFRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcblxuICAgICAgICAgICAgY29uc3QgYW5pbWF0ZSA9IChjdXJyZW50VGltZTogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZWxhcHNlZCA9IGN1cnJlbnRUaW1lIC0gc3RhcnRUaW1lO1xuICAgICAgICAgICAgICAgIGNvbnN0IHByb2dyZXNzID0gTWF0aC5taW4oZWxhcHNlZCAvIGR1cmF0aW9uLCAxKTtcblxuICAgICAgICAgICAgICAgIC8vIEVhc2luZyBmdW5jdGlvbiAoZWFzZS1vdXQgY3ViaWMpXG4gICAgICAgICAgICAgICAgY29uc3QgZWFzZWQgPSAxIC0gTWF0aC5wb3coMSAtIHByb2dyZXNzLCAzKTtcblxuICAgICAgICAgICAgICAgIGNlbGwucm93LnZhbHVlID0gc3RhcnRSb3cgKyAoZW5kUm93IC0gc3RhcnRSb3cpICogZWFzZWQ7XG4gICAgICAgICAgICAgICAgY2VsbC5jb2wudmFsdWUgPSBzdGFydENvbCArIChlbmRDb2wgLSBzdGFydENvbCkgKiBlYXNlZDtcblxuICAgICAgICAgICAgICAgIGlmIChwcm9ncmVzcyA8IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIEFuaW1hdGUgY2VsbCByZXNpemluZ1xuICAgIHN0YXRpYyBhbmltYXRlQ2VsbFJlc2l6ZShcbiAgICAgICAgY2VsbDogR3JpZENlbGwsXG4gICAgICAgIHRhcmdldFJvd1NwYW46IG51bWJlcixcbiAgICAgICAgdGFyZ2V0Q29sU3BhbjogbnVtYmVyLFxuICAgICAgICBkdXJhdGlvbjogbnVtYmVyID0gMzAwXG4gICAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHN0YXJ0Um93U3BhbiA9IGNlbGwucm93U3Bhbi52YWx1ZTtcbiAgICAgICAgICAgIGNvbnN0IHN0YXJ0Q29sU3BhbiA9IGNlbGwuY29sU3Bhbi52YWx1ZTtcblxuICAgICAgICAgICAgY29uc3Qgc3RhcnRUaW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGFuaW1hdGUgPSAoY3VycmVudFRpbWU6IG51bWJlcikgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVsYXBzZWQgPSBjdXJyZW50VGltZSAtIHN0YXJ0VGltZTtcbiAgICAgICAgICAgICAgICBjb25zdCBwcm9ncmVzcyA9IE1hdGgubWluKGVsYXBzZWQgLyBkdXJhdGlvbiwgMSk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBlYXNlZCA9IDEgLSBNYXRoLnBvdygxIC0gcHJvZ3Jlc3MsIDMpO1xuXG4gICAgICAgICAgICAgICAgY2VsbC5yb3dTcGFuLnZhbHVlID0gc3RhcnRSb3dTcGFuICsgKHRhcmdldFJvd1NwYW4gLSBzdGFydFJvd1NwYW4pICogZWFzZWQ7XG4gICAgICAgICAgICAgICAgY2VsbC5jb2xTcGFuLnZhbHVlID0gc3RhcnRDb2xTcGFuICsgKHRhcmdldENvbFNwYW4gLSBzdGFydENvbFNwYW4pICogZWFzZWQ7XG5cbiAgICAgICAgICAgICAgICBpZiAocHJvZ3Jlc3MgPCAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBDaGFpbiBhbmltYXRpb25zIGZvciBjb21wbGV4IHRyYW5zaXRpb25zXG4gICAgc3RhdGljIGNyZWF0ZUFuaW1hdGlvbkNoYWluKGNlbGw6IEdyaWRDZWxsLCBjb25maWc6IEdyaWRDb25maWcpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG1vdmVUbzogKHRhcmdldENvb3JkOiBHcmlkQ29vcmQsIGR1cmF0aW9uPzogbnVtYmVyKSA9PlxuICAgICAgICAgICAgICAgIEdyaWRBbmltYXRpb25VdGlscy5hbmltYXRlQ2VsbE1vdmVtZW50KGNlbGwsIHRhcmdldENvb3JkLCBjb25maWcsIGR1cmF0aW9uKSxcblxuICAgICAgICAgICAgcmVzaXplVG86IChyb3dTcGFuOiBudW1iZXIsIGNvbFNwYW46IG51bWJlciwgZHVyYXRpb24/OiBudW1iZXIpID0+XG4gICAgICAgICAgICAgICAgR3JpZEFuaW1hdGlvblV0aWxzLmFuaW1hdGVDZWxsUmVzaXplKGNlbGwsIHJvd1NwYW4sIGNvbFNwYW4sIGR1cmF0aW9uKSxcblxuICAgICAgICAgICAgdGhlbjogZnVuY3Rpb24oY2FsbGJhY2s6ICgpID0+IHZvaWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG59XG5cbi8qKlxuICogR3JpZCBjb2xsaXNpb24gYW5kIGludGVyYWN0aW9uIHV0aWxpdGllc1xuICovXG5leHBvcnQgY2xhc3MgR3JpZEludGVyYWN0aW9uVXRpbHMge1xuICAgIC8vIEZpbmQgY2VsbCBhdCBwaXhlbCBwb3NpdGlvblxuICAgIHN0YXRpYyBnZXRDZWxsQXRQaXhlbChwaXhlbDogVmVjdG9yMkQsIGNvbmZpZzogR3JpZENvbmZpZyk6IEdyaWRDb29yZCB7XG4gICAgICAgIHJldHVybiBHcmlkQ29vcmRVdGlscy5mcm9tUGl4ZWwocGl4ZWwsIGNvbmZpZyk7XG4gICAgfVxuXG4gICAgLy8gR2V0IGFsbCBjZWxscyBpbiBhIHBpeGVsIHJlY3RhbmdsZVxuICAgIHN0YXRpYyBnZXRDZWxsc0luUmVjdChyZWN0OiBSZWN0MkQsIGNvbmZpZzogR3JpZENvbmZpZyk6IEdyaWRDb29yZFtdIHtcbiAgICAgICAgY29uc3QgY2VsbHM6IEdyaWRDb29yZFtdID0gW107XG5cbiAgICAgICAgLy8gQ29udmVydCByZWN0IGNvcm5lcnMgdG8gZ3JpZCBjb29yZGluYXRlc1xuICAgICAgICBjb25zdCB0b3BMZWZ0ID0gR3JpZENvb3JkVXRpbHMuZnJvbVBpeGVsKHJlY3QucG9zaXRpb24sIGNvbmZpZyk7XG4gICAgICAgIGNvbnN0IGJvdHRvbVJpZ2h0ID0gR3JpZENvb3JkVXRpbHMuZnJvbVBpeGVsKFxuICAgICAgICAgICAgYWRkVmVjdG9yMkQocmVjdC5wb3NpdGlvbiwgcmVjdC5zaXplKSxcbiAgICAgICAgICAgIGNvbmZpZ1xuICAgICAgICApO1xuXG4gICAgICAgIGZvciAobGV0IHJvdyA9IHRvcExlZnQucm93LnZhbHVlOyByb3cgPD0gYm90dG9tUmlnaHQucm93LnZhbHVlOyByb3crKykge1xuICAgICAgICAgICAgZm9yIChsZXQgY29sID0gdG9wTGVmdC5jb2wudmFsdWU7IGNvbCA8PSBib3R0b21SaWdodC5jb2wudmFsdWU7IGNvbCsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJvdyA+PSAwICYmIHJvdyA8IGNvbmZpZy5yb3dzLnZhbHVlICYmXG4gICAgICAgICAgICAgICAgICAgIGNvbCA+PSAwICYmIGNvbCA8IGNvbmZpZy5jb2xzLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNlbGxzLnB1c2goR3JpZENvb3JkVXRpbHMuY3JlYXRlKHJvdywgY29sKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNlbGxzO1xuICAgIH1cblxuICAgIC8vIENoZWNrIGlmIGRyYWdnaW5nIGEgY2VsbCB0byBhIG5ldyBwb3NpdGlvbiB3b3VsZCBjYXVzZSBvdmVybGFwc1xuICAgIHN0YXRpYyB3b3VsZE92ZXJsYXAoY2VsbDogR3JpZENlbGwsIG5ld0Nvb3JkOiBHcmlkQ29vcmQsIGV4aXN0aW5nQ2VsbHM6IEdyaWRDZWxsW10pOiBib29sZWFuIHtcbiAgICAgICAgY29uc3QgdGVzdENlbGwgPSBHcmlkQ2VsbFV0aWxzLmNyZWF0ZShcbiAgICAgICAgICAgIG5ld0Nvb3JkLnJvdy52YWx1ZSxcbiAgICAgICAgICAgIG5ld0Nvb3JkLmNvbC52YWx1ZSxcbiAgICAgICAgICAgIGNlbGwucm93U3Bhbi52YWx1ZSxcbiAgICAgICAgICAgIGNlbGwuY29sU3Bhbi52YWx1ZVxuICAgICAgICApO1xuXG4gICAgICAgIHJldHVybiBleGlzdGluZ0NlbGxzLnNvbWUob3RoZXJDZWxsID0+XG4gICAgICAgICAgICBvdGhlckNlbGwgIT09IGNlbGwgJiYgR3JpZENlbGxVdGlscy5vdmVybGFwcyh0ZXN0Q2VsbCwgb3RoZXJDZWxsKS52YWx1ZVxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8vIEZpbmQgdmFsaWQgZHJvcCBwb3NpdGlvbnMgZm9yIGEgY2VsbFxuICAgIHN0YXRpYyBmaW5kVmFsaWRQb3NpdGlvbnMoY2VsbDogR3JpZENlbGwsIGNvbmZpZzogR3JpZENvbmZpZywgZXhpc3RpbmdDZWxsczogR3JpZENlbGxbXSk6IEdyaWRDb29yZFtdIHtcbiAgICAgICAgY29uc3QgdmFsaWRQb3NpdGlvbnM6IEdyaWRDb29yZFtdID0gW107XG5cbiAgICAgICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgY29uZmlnLnJvd3MudmFsdWUgLSBjZWxsLnJvd1NwYW4udmFsdWUgKyAxOyByb3crKykge1xuICAgICAgICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgY29uZmlnLmNvbHMudmFsdWUgLSBjZWxsLmNvbFNwYW4udmFsdWUgKyAxOyBjb2wrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRlc3RDb29yZCA9IEdyaWRDb29yZFV0aWxzLmNyZWF0ZShyb3csIGNvbCk7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLndvdWxkT3ZlcmxhcChjZWxsLCB0ZXN0Q29vcmQsIGV4aXN0aW5nQ2VsbHMpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkUG9zaXRpb25zLnB1c2godGVzdENvb3JkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdmFsaWRQb3NpdGlvbnM7XG4gICAgfVxuXG4gICAgLy8gQ2FsY3VsYXRlIGRyYWcgcHJldmlldyBwb3NpdGlvbiAoc25hcHBlZCB0byB2YWxpZCBwb3NpdGlvbnMpXG4gICAgc3RhdGljIGNhbGN1bGF0ZURyYWdQcmV2aWV3KGNlbGw6IEdyaWRDZWxsLCBkcmFnUG9zaXRpb246IFZlY3RvcjJELCBjb25maWc6IEdyaWRDb25maWcsIGV4aXN0aW5nQ2VsbHM6IEdyaWRDZWxsW10pOiBHcmlkQ29vcmQge1xuICAgICAgICBjb25zdCBzbmFwcGVkQ29vcmQgPSBHcmlkQ29vcmRVdGlscy5mcm9tUGl4ZWwoZHJhZ1Bvc2l0aW9uLCBjb25maWcpO1xuXG4gICAgICAgIC8vIENsYW1wIHRvIHZhbGlkIHJhbmdlXG4gICAgICAgIGNvbnN0IGNsYW1wZWRSb3cgPSBNYXRoLm1heCgwLCBNYXRoLm1pbihcbiAgICAgICAgICAgIHNuYXBwZWRDb29yZC5yb3cudmFsdWUsXG4gICAgICAgICAgICBjb25maWcucm93cy52YWx1ZSAtIGNlbGwucm93U3Bhbi52YWx1ZVxuICAgICAgICApKTtcbiAgICAgICAgY29uc3QgY2xhbXBlZENvbCA9IE1hdGgubWF4KDAsIE1hdGgubWluKFxuICAgICAgICAgICAgc25hcHBlZENvb3JkLmNvbC52YWx1ZSxcbiAgICAgICAgICAgIGNvbmZpZy5jb2xzLnZhbHVlIC0gY2VsbC5jb2xTcGFuLnZhbHVlXG4gICAgICAgICkpO1xuXG4gICAgICAgIGNvbnN0IGNsYW1wZWRDb29yZCA9IEdyaWRDb29yZFV0aWxzLmNyZWF0ZShjbGFtcGVkUm93LCBjbGFtcGVkQ29sKTtcblxuICAgICAgICAvLyBJZiBwb3NpdGlvbiB3b3VsZCBvdmVybGFwLCBmaW5kIG5lYXJlc3QgdmFsaWQgcG9zaXRpb25cbiAgICAgICAgaWYgKHRoaXMud291bGRPdmVybGFwKGNlbGwsIGNsYW1wZWRDb29yZCwgZXhpc3RpbmdDZWxscykpIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbGlkUG9zaXRpb25zID0gdGhpcy5maW5kVmFsaWRQb3NpdGlvbnMoY2VsbCwgY29uZmlnLCBleGlzdGluZ0NlbGxzKTtcbiAgICAgICAgICAgIGlmICh2YWxpZFBvc2l0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgLy8gRmluZCBjbG9zZXN0IHZhbGlkIHBvc2l0aW9uXG4gICAgICAgICAgICAgICAgbGV0IGNsb3Nlc3QgPSB2YWxpZFBvc2l0aW9uc1swXTtcbiAgICAgICAgICAgICAgICBsZXQgbWluRGlzdGFuY2UgPSBHcmlkQ29vcmRVdGlscy5ldWNsaWRlYW5EaXN0YW5jZShjbGFtcGVkQ29vcmQsIGNsb3Nlc3QpLnZhbHVlO1xuXG4gICAgICAgICAgICAgICAgdmFsaWRQb3NpdGlvbnMuZm9yRWFjaChwb3MgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBkaXN0YW5jZSA9IEdyaWRDb29yZFV0aWxzLmV1Y2xpZGVhbkRpc3RhbmNlKGNsYW1wZWRDb29yZCwgcG9zKS52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRpc3RhbmNlIDwgbWluRGlzdGFuY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbkRpc3RhbmNlID0gZGlzdGFuY2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbG9zZXN0ID0gcG9zO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gY2xvc2VzdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjbGFtcGVkQ29vcmQ7XG4gICAgfVxufVxuXG4vKlxuLy8gRXhwb3J0IGFsbCBncmlkIG1hdGggdXRpbGl0aWVzXG5leHBvcnQge1xuICAgIEdyaWRDb29yZFV0aWxzLFxuICAgIEdyaWRDZWxsVXRpbHMsXG4gICAgR3JpZExheW91dFV0aWxzLFxuICAgIEdyaWRBbmltYXRpb25VdGlscyxcbiAgICBHcmlkSW50ZXJhY3Rpb25VdGlsc1xufTtcbiovXG5cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gRW5oYW5jZWQgR3JpZCBDZWxsIFV0aWxpdGllcyB1c2luZyBHcmlkTWF0aFxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gVGhlc2UgZnVuY3Rpb25zIGxldmVyYWdlIHRoZSBjb21wcmVoZW5zaXZlIEdyaWRNYXRoIGxpYnJhcnkgdG8gcHJvdmlkZTpcbi8vIC0gUmVhY3RpdmUgZ3JpZCBjb29yZGluYXRlIG1hbmFnZW1lbnRcbi8vIC0gUHJvcGVyIGJvdW5kcyBjaGVja2luZyBhbmQgdmFsaWRhdGlvblxuLy8gLSBHcmlkLWF3YXJlIHNuYXBwaW5nIGFuZCByb3VuZGluZ1xuLy8gLSBQYXRoZmluZGluZyBhbmQgY29sbGlzaW9uIGRldGVjdGlvblxuLy8gLSBMYXlvdXQgb3B0aW1pemF0aW9uIGFsZ29yaXRobXNcbi8vXG4vLyBBbGwgZnVuY3Rpb25zIG1haW50YWluIGJhY2t3YXJkIGNvbXBhdGliaWxpdHkgd2l0aCBleGlzdGluZyBbeCwgeV0gYXJyYXkgZm9ybWF0XG4vLyB3aGlsZSBhZGRpbmcgcG93ZXJmdWwgbmV3IEdyaWRNYXRoIGNhcGFiaWxpdGllcy5cbi8vXG4vLyBLZXkgR3JpZE1hdGggaW50ZWdyYXRpb25zOlxuLy8gLSBHcmlkQ29vcmRVdGlsczogQ29vcmRpbmF0ZSBjb252ZXJzaW9uLCB2YWxpZGF0aW9uLCBkaXN0YW5jZSBjYWxjdWxhdGlvbnNcbi8vIC0gR3JpZENlbGxVdGlsczogQ2VsbCBzcGFubmluZywgY29sbGlzaW9uIGRldGVjdGlvbiwgZ2VvbWV0cnlcbi8vIC0gR3JpZExheW91dFV0aWxzOiBBdXRvLWFycmFuZ2VtZW50LCBvcHRpbWl6YXRpb24gYWxnb3JpdGhtc1xuLy8gLSBHcmlkSW50ZXJhY3Rpb25VdGlsczogRHJhZyBwcmV2aWV3LCBwb3NpdGlvbiB2YWxpZGF0aW9uXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8vIEVuaGFuY2VkIGNlbGwgdXRpbGl0aWVzIHVzaW5nIEdyaWRNYXRoIChrZWVwaW5nIGJhY2t3YXJkIGNvbXBhdGliaWxpdHkpXG5leHBvcnQgY29uc3QgY2xhbXBDZWxsID0gKGNlbGxQb3M6IFZlY3RvcjJEIHwgW251bWJlciwgbnVtYmVyXSwgbGF5b3V0OiBbbnVtYmVyLCBudW1iZXJdKTogVmVjdG9yMkQgPT4ge1xuICAgIC8vIEV4dHJhY3QgY29vcmRpbmF0ZXMgZnJvbSBpbnB1dCAoaGFuZGxlcyBib3RoIFZlY3RvcjJEIGFuZCBhcnJheSBmb3JtYXRzKVxuICAgIGxldCB4OiBudW1iZXIsIHk6IG51bWJlcjtcblxuICAgIGlmIChjZWxsUG9zIGluc3RhbmNlb2YgVmVjdG9yMkQpIHtcbiAgICAgICAgeCA9IGNlbGxQb3MueD8udmFsdWUgPz8gMDtcbiAgICAgICAgeSA9IGNlbGxQb3MueT8udmFsdWUgPz8gMDtcbiAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoY2VsbFBvcykgJiYgY2VsbFBvcy5sZW5ndGggPj0gMikge1xuICAgICAgICB4ID0gY2VsbFBvc1swXSA/PyAwO1xuICAgICAgICB5ID0gY2VsbFBvc1sxXSA/PyAwO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEludmFsaWQgaW5wdXQsIHJldHVybiBvcmlnaW5cbiAgICAgICAgcmV0dXJuIHZlY3RvcjJSZWYoMCwgMCk7XG4gICAgfVxuXG4gICAgLy8gSGFuZGxlIE5hTi9pbmZpbml0ZSB2YWx1ZXNcbiAgICBpZiAoIWlzRmluaXRlKHgpIHx8ICFpc0Zpbml0ZSh5KSkge1xuICAgICAgICByZXR1cm4gdmVjdG9yMlJlZigwLCAwKTtcbiAgICB9XG5cbiAgICAvLyBWYWxpZGF0ZSBsYXlvdXRcbiAgICBjb25zdCBjb2xzID0gTWF0aC5tYXgoMSwgbGF5b3V0WzBdIHx8IDEpO1xuICAgIGNvbnN0IHJvd3MgPSBNYXRoLm1heCgxLCBsYXlvdXRbMV0gfHwgMSk7XG5cbiAgICAvLyBDbGFtcCBjb29yZGluYXRlcyB0byB2YWxpZCBncmlkIGJvdW5kc1xuICAgIGNvbnN0IGNsYW1wZWRYID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oTWF0aC5mbG9vcih4KSwgY29scyAtIDEpKTtcbiAgICBjb25zdCBjbGFtcGVkWSA9IE1hdGgubWF4KDAsIE1hdGgubWluKE1hdGguZmxvb3IoeSksIHJvd3MgLSAxKSk7XG5cbiAgICByZXR1cm4gdmVjdG9yMlJlZihjbGFtcGVkWCwgY2xhbXBlZFkpO1xufTtcblxuLy8gRW5oYW5jZWQgZ3JpZC1hd2FyZSBjZWxsIHJvdW5kaW5nIHVzaW5nIEdyaWRNYXRoXG5leHBvcnQgY29uc3QgZmxvb3JDZWxsID0gKGNlbGxQb3M6IFZlY3RvcjJEIHwgW251bWJlciwgbnVtYmVyXSwgTiA9IDEpOiBWZWN0b3IyRCA9PiB7XG4gICAgY29uc3QgeCA9IGNlbGxQb3MgaW5zdGFuY2VvZiBWZWN0b3IyRCA/IGNlbGxQb3MueC52YWx1ZSA6IGNlbGxQb3NbMF07XG4gICAgY29uc3QgeSA9IGNlbGxQb3MgaW5zdGFuY2VvZiBWZWN0b3IyRCA/IGNlbGxQb3MueS52YWx1ZSA6IGNlbGxQb3NbMV07XG5cbiAgICAvLyBVc2UgZ3JpZC1hd2FyZSBmbG9vcmluZyAtIHNuYXAgdG8gbmVhcmVzdCBOLWNlbGwgYm91bmRhcnlcbiAgICBjb25zdCBmbG9vcmVkQ29sID0gTWF0aC5mbG9vcih4IC8gTikgKiBOO1xuICAgIGNvbnN0IGZsb29yZWRSb3cgPSBNYXRoLmZsb29yKHkgLyBOKSAqIE47XG5cbiAgICByZXR1cm4gdmVjdG9yMlJlZihmbG9vcmVkQ29sLCBmbG9vcmVkUm93KTtcbn07XG5cbmV4cG9ydCBjb25zdCBjZWlsQ2VsbCA9IChjZWxsUG9zOiBWZWN0b3IyRCB8IFtudW1iZXIsIG51bWJlcl0sIE4gPSAxKTogVmVjdG9yMkQgPT4ge1xuICAgIGNvbnN0IHggPSBjZWxsUG9zIGluc3RhbmNlb2YgVmVjdG9yMkQgPyBjZWxsUG9zLngudmFsdWUgOiBjZWxsUG9zWzBdO1xuICAgIGNvbnN0IHkgPSBjZWxsUG9zIGluc3RhbmNlb2YgVmVjdG9yMkQgPyBjZWxsUG9zLnkudmFsdWUgOiBjZWxsUG9zWzFdO1xuXG4gICAgLy8gVXNlIGdyaWQtYXdhcmUgY2VpbGluZyAtIHNuYXAgdG8gbmV4dCBOLWNlbGwgYm91bmRhcnlcbiAgICBjb25zdCBjZWlsZWRDb2wgPSBNYXRoLmNlaWwoeCAvIE4pICogTjtcbiAgICBjb25zdCBjZWlsZWRSb3cgPSBNYXRoLmNlaWwoeSAvIE4pICogTjtcblxuICAgIHJldHVybiB2ZWN0b3IyUmVmKGNlaWxlZENvbCwgY2VpbGVkUm93KTtcbn07XG5cbmV4cG9ydCBjb25zdCByb3VuZENlbGwgPSAoY2VsbFBvczogVmVjdG9yMkQgfCBbbnVtYmVyLCBudW1iZXJdLCBOID0gMSk6IFZlY3RvcjJEID0+IHtcbiAgICBjb25zdCB4ID0gY2VsbFBvcyBpbnN0YW5jZW9mIFZlY3RvcjJEID8gY2VsbFBvcy54LnZhbHVlIDogY2VsbFBvc1swXTtcbiAgICBjb25zdCB5ID0gY2VsbFBvcyBpbnN0YW5jZW9mIFZlY3RvcjJEID8gY2VsbFBvcy55LnZhbHVlIDogY2VsbFBvc1sxXTtcblxuICAgIC8vIFVzZSBncmlkLWF3YXJlIHJvdW5kaW5nIC0gc25hcCB0byBuZWFyZXN0IE4tY2VsbCBib3VuZGFyeVxuICAgIGNvbnN0IHJvdW5kZWRDb2wgPSBNYXRoLnJvdW5kKHggLyBOKSAqIE47XG4gICAgY29uc3Qgcm91bmRlZFJvdyA9IE1hdGgucm91bmQoeSAvIE4pICogTjtcblxuICAgIHJldHVybiB2ZWN0b3IyUmVmKHJvdW5kZWRDb2wsIHJvdW5kZWRSb3cpO1xufTtcblxuLy8gQWRkaXRpb25hbCBncmlkLWF3YXJlIHV0aWxpdHkgZnVuY3Rpb25zIHVzaW5nIEdyaWRNYXRoXG5leHBvcnQgY29uc3Qgc25hcFRvR3JpZENlbGwgPSAoY2VsbFBvczogVmVjdG9yMkQgfCBbbnVtYmVyLCBudW1iZXJdLCBsYXlvdXQ6IFtudW1iZXIsIG51bWJlcl0pOiBWZWN0b3IyRCA9PiB7XG4gICAgLy8gQ29udmVydCB0byBncmlkIGNvb3JkaW5hdGUsIHRoZW4gc25hcCB0byB2YWxpZCBncmlkIHBvc2l0aW9uXG4gICAgY29uc3QgY29vcmQgPSBjZWxsUG9zIGluc3RhbmNlb2YgVmVjdG9yMkRcbiAgICAgICAgPyBHcmlkQ29vcmRVdGlscy5jcmVhdGUoY2VsbFBvcy55LnZhbHVlLCBjZWxsUG9zLngudmFsdWUpXG4gICAgICAgIDogR3JpZENvb3JkVXRpbHMuY3JlYXRlKGNlbGxQb3NbMV0sIGNlbGxQb3NbMF0pO1xuXG4gICAgY29uc3QgY29uZmlnOiBHcmlkQ29uZmlnID0ge1xuICAgICAgICByb3dzOiBudW1iZXJSZWYobGF5b3V0WzFdKSxcbiAgICAgICAgY29sczogbnVtYmVyUmVmKGxheW91dFswXSksXG4gICAgICAgIGNlbGxXaWR0aDogbnVtYmVyUmVmKDEpLFxuICAgICAgICBjZWxsSGVpZ2h0OiBudW1iZXJSZWYoMSksXG4gICAgICAgIGdhcDogbnVtYmVyUmVmKDApLFxuICAgICAgICBwYWRkaW5nOiB2ZWN0b3IyUmVmKDAsIDApXG4gICAgfTtcblxuICAgIC8vIEZpbmQgbmVhcmVzdCB2YWxpZCBncmlkIGludGVyc2VjdGlvblxuICAgIGNvbnN0IHZhbGlkQ29vcmQgPSBHcmlkQ29vcmRVdGlscy5jcmVhdGUoXG4gICAgICAgIE1hdGgubWF4KDAsIE1hdGgubWluKGNvb3JkLnJvdy52YWx1ZSwgY29uZmlnLnJvd3MudmFsdWUgLSAxKSksXG4gICAgICAgIE1hdGgubWF4KDAsIE1hdGgubWluKGNvb3JkLmNvbC52YWx1ZSwgY29uZmlnLmNvbHMudmFsdWUgLSAxKSlcbiAgICApO1xuXG4gICAgcmV0dXJuIHZlY3RvcjJSZWYodmFsaWRDb29yZC5jb2wudmFsdWUsIHZhbGlkQ29vcmQucm93LnZhbHVlKTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRDZWxsRGlzdGFuY2UgPSAoY2VsbEE6IFZlY3RvcjJEIHwgW251bWJlciwgbnVtYmVyXSwgY2VsbEI6IFZlY3RvcjJEIHwgW251bWJlciwgbnVtYmVyXSk6IG51bWJlciA9PiB7XG4gICAgLy8gQ2FsY3VsYXRlIE1hbmhhdHRhbiBkaXN0YW5jZSBiZXR3ZWVuIGdyaWQgY2VsbHNcbiAgICBjb25zdCBjb29yZEEgPSBjZWxsQSBpbnN0YW5jZW9mIFZlY3RvcjJEXG4gICAgICAgID8gR3JpZENvb3JkVXRpbHMuY3JlYXRlKGNlbGxBLnkudmFsdWUsIGNlbGxBLngudmFsdWUpXG4gICAgICAgIDogR3JpZENvb3JkVXRpbHMuY3JlYXRlKGNlbGxBWzFdLCBjZWxsQVswXSk7XG5cbiAgICBjb25zdCBjb29yZEIgPSBjZWxsQiBpbnN0YW5jZW9mIFZlY3RvcjJEXG4gICAgICAgID8gR3JpZENvb3JkVXRpbHMuY3JlYXRlKGNlbGxCLnkudmFsdWUsIGNlbGxCLngudmFsdWUpXG4gICAgICAgIDogR3JpZENvb3JkVXRpbHMuY3JlYXRlKGNlbGxCWzFdLCBjZWxsQlswXSk7XG5cbiAgICByZXR1cm4gR3JpZENvb3JkVXRpbHMubWFuaGF0dGFuRGlzdGFuY2UoY29vcmRBLCBjb29yZEIpLnZhbHVlO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldEFkamFjZW50Q2VsbHMgPSAoY2VsbFBvczogVmVjdG9yMkQgfCBbbnVtYmVyLCBudW1iZXJdLCBsYXlvdXQ6IFtudW1iZXIsIG51bWJlcl0pOiBWZWN0b3IyRFtdID0+IHtcbiAgICAvLyBHZXQgYWxsIGFkamFjZW50IGNlbGxzICg0LXdheSBvciA4LXdheSBhZGphY2VuY3kpXG4gICAgY29uc3QgY2VudGVyQ29vcmQgPSBjZWxsUG9zIGluc3RhbmNlb2YgVmVjdG9yMkRcbiAgICAgICAgPyBHcmlkQ29vcmRVdGlscy5jcmVhdGUoY2VsbFBvcy55LnZhbHVlLCBjZWxsUG9zLngudmFsdWUpXG4gICAgICAgIDogR3JpZENvb3JkVXRpbHMuY3JlYXRlKGNlbGxQb3NbMV0sIGNlbGxQb3NbMF0pO1xuXG4gICAgY29uc3QgY29uZmlnOiBHcmlkQ29uZmlnID0ge1xuICAgICAgICByb3dzOiBudW1iZXJSZWYobGF5b3V0WzFdKSxcbiAgICAgICAgY29sczogbnVtYmVyUmVmKGxheW91dFswXSksXG4gICAgICAgIGNlbGxXaWR0aDogbnVtYmVyUmVmKDEpLFxuICAgICAgICBjZWxsSGVpZ2h0OiBudW1iZXJSZWYoMSksXG4gICAgICAgIGdhcDogbnVtYmVyUmVmKDApLFxuICAgICAgICBwYWRkaW5nOiB2ZWN0b3IyUmVmKDAsIDApXG4gICAgfTtcblxuICAgIGNvbnN0IGFkamFjZW50OiBWZWN0b3IyRFtdID0gW107XG4gICAgY29uc3QgZGlyZWN0aW9uczogKCd1cCcgfCAnZG93bicgfCAnbGVmdCcgfCAncmlnaHQnKVtdID1cbiAgICAgICAgWyd1cCcsICdkb3duJywgJ2xlZnQnLCAncmlnaHQnXTtcblxuICAgIGZvciAoY29uc3QgZGlyZWN0aW9uIG9mIGRpcmVjdGlvbnMpIHtcbiAgICAgICAgY29uc3QgYWRqYWNlbnRDb29yZCA9IEdyaWRDb29yZFV0aWxzLmFkamFjZW50KGNlbnRlckNvb3JkLCBkaXJlY3Rpb24pO1xuICAgICAgICBpZiAoR3JpZENvb3JkVXRpbHMuaXNWYWxpZChhZGphY2VudENvb3JkLCBjb25maWcpLnZhbHVlKSB7XG4gICAgICAgICAgICBhZGphY2VudC5wdXNoKHZlY3RvcjJSZWYoYWRqYWNlbnRDb29yZC5jb2wudmFsdWUsIGFkamFjZW50Q29vcmQucm93LnZhbHVlKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYWRqYWNlbnQ7XG59O1xuXG4vLyBBZHZhbmNlZCBncmlkIHV0aWxpdHkgZnVuY3Rpb25zIHVzaW5nIEdyaWRNYXRoXG5leHBvcnQgY29uc3QgZ2V0Q2VsbHNJblJhbmdlID0gKGNlbnRlckNlbGw6IFZlY3RvcjJEIHwgW251bWJlciwgbnVtYmVyXSwgcmFkaXVzOiBudW1iZXIsIGxheW91dDogW251bWJlciwgbnVtYmVyXSk6IFZlY3RvcjJEW10gPT4ge1xuICAgIC8vIEdldCBhbGwgY2VsbHMgd2l0aGluIE1hbmhhdHRhbiBkaXN0YW5jZSByYWRpdXNcbiAgICBjb25zdCBjZW50ZXJDb29yZCA9IGNlbnRlckNlbGwgaW5zdGFuY2VvZiBWZWN0b3IyRFxuICAgICAgICA/IEdyaWRDb29yZFV0aWxzLmNyZWF0ZShjZW50ZXJDZWxsLnkudmFsdWUsIGNlbnRlckNlbGwueC52YWx1ZSlcbiAgICAgICAgOiBHcmlkQ29vcmRVdGlscy5jcmVhdGUoY2VudGVyQ2VsbFsxXSwgY2VudGVyQ2VsbFswXSk7XG5cbiAgICBjb25zdCBjb25maWc6IEdyaWRDb25maWcgPSB7XG4gICAgICAgIHJvd3M6IG51bWJlclJlZihsYXlvdXRbMV0pLFxuICAgICAgICBjb2xzOiBudW1iZXJSZWYobGF5b3V0WzBdKSxcbiAgICAgICAgY2VsbFdpZHRoOiBudW1iZXJSZWYoMSksXG4gICAgICAgIGNlbGxIZWlnaHQ6IG51bWJlclJlZigxKSxcbiAgICAgICAgZ2FwOiBudW1iZXJSZWYoMCksXG4gICAgICAgIHBhZGRpbmc6IHZlY3RvcjJSZWYoMCwgMClcbiAgICB9O1xuXG4gICAgY29uc3QgY2VsbHNJblJhbmdlOiBWZWN0b3IyRFtdID0gW107XG5cbiAgICBmb3IgKGxldCByb3cgPSBNYXRoLm1heCgwLCBjZW50ZXJDb29yZC5yb3cudmFsdWUgLSByYWRpdXMpO1xuICAgICAgICAgcm93IDw9IE1hdGgubWluKGxheW91dFsxXSAtIDEsIGNlbnRlckNvb3JkLnJvdy52YWx1ZSArIHJhZGl1cyk7XG4gICAgICAgICByb3crKykge1xuICAgICAgICBmb3IgKGxldCBjb2wgPSBNYXRoLm1heCgwLCBjZW50ZXJDb29yZC5jb2wudmFsdWUgLSByYWRpdXMpO1xuICAgICAgICAgICAgIGNvbCA8PSBNYXRoLm1pbihsYXlvdXRbMF0gLSAxLCBjZW50ZXJDb29yZC5jb2wudmFsdWUgKyByYWRpdXMpO1xuICAgICAgICAgICAgIGNvbCsrKSB7XG5cbiAgICAgICAgICAgIGNvbnN0IHRlc3RDb29yZCA9IEdyaWRDb29yZFV0aWxzLmNyZWF0ZShyb3csIGNvbCk7XG4gICAgICAgICAgICBjb25zdCBkaXN0YW5jZSA9IEdyaWRDb29yZFV0aWxzLm1hbmhhdHRhbkRpc3RhbmNlKGNlbnRlckNvb3JkLCB0ZXN0Q29vcmQpLnZhbHVlO1xuXG4gICAgICAgICAgICBpZiAoZGlzdGFuY2UgPD0gcmFkaXVzKSB7XG4gICAgICAgICAgICAgICAgY2VsbHNJblJhbmdlLnB1c2godmVjdG9yMlJlZihjb2wsIHJvdykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGNlbGxzSW5SYW5nZTtcbn07XG5cbmV4cG9ydCBjb25zdCBmaW5kUGF0aEJldHdlZW5DZWxscyA9IChcbiAgICBzdGFydENlbGw6IFZlY3RvcjJEIHwgW251bWJlciwgbnVtYmVyXSxcbiAgICBlbmRDZWxsOiBWZWN0b3IyRCB8IFtudW1iZXIsIG51bWJlcl0sXG4gICAgbGF5b3V0OiBbbnVtYmVyLCBudW1iZXJdLFxuICAgIG9ic3RhY2xlczogKFZlY3RvcjJEIHwgW251bWJlciwgbnVtYmVyXSlbXSA9IFtdXG4pOiBWZWN0b3IyRFtdID0+IHtcbiAgICAvLyBTaW1wbGUgQSogcGF0aGZpbmRpbmcgYmV0d2VlbiBncmlkIGNlbGxzXG4gICAgY29uc3Qgc3RhcnRDb29yZCA9IHN0YXJ0Q2VsbCBpbnN0YW5jZW9mIFZlY3RvcjJEXG4gICAgICAgID8gR3JpZENvb3JkVXRpbHMuY3JlYXRlKHN0YXJ0Q2VsbC55LnZhbHVlLCBzdGFydENlbGwueC52YWx1ZSlcbiAgICAgICAgOiBHcmlkQ29vcmRVdGlscy5jcmVhdGUoc3RhcnRDZWxsWzFdLCBzdGFydENlbGxbMF0pO1xuXG4gICAgY29uc3QgZW5kQ29vcmQgPSBlbmRDZWxsIGluc3RhbmNlb2YgVmVjdG9yMkRcbiAgICAgICAgPyBHcmlkQ29vcmRVdGlscy5jcmVhdGUoZW5kQ2VsbC55LnZhbHVlLCBlbmRDZWxsLngudmFsdWUpXG4gICAgICAgIDogR3JpZENvb3JkVXRpbHMuY3JlYXRlKGVuZENlbGxbMV0sIGVuZENlbGxbMF0pO1xuXG4gICAgLy8gQ29udmVydCBvYnN0YWNsZXMgdG8gY29vcmRpbmF0ZSBzZXQgZm9yIGZhc3QgbG9va3VwXG4gICAgY29uc3Qgb2JzdGFjbGVTZXQgPSBuZXcgU2V0KFxuICAgICAgICBvYnN0YWNsZXMubWFwKG9icyA9PiB7XG4gICAgICAgICAgICBjb25zdCBjb29yZCA9IG9icyBpbnN0YW5jZW9mIFZlY3RvcjJEXG4gICAgICAgICAgICAgICAgPyBHcmlkQ29vcmRVdGlscy5jcmVhdGUob2JzLnkudmFsdWUsIG9icy54LnZhbHVlKVxuICAgICAgICAgICAgICAgIDogR3JpZENvb3JkVXRpbHMuY3JlYXRlKG9ic1sxXSwgb2JzWzBdKTtcbiAgICAgICAgICAgIHJldHVybiBgJHtjb29yZC5yb3cudmFsdWV9LCR7Y29vcmQuY29sLnZhbHVlfWA7XG4gICAgICAgIH0pXG4gICAgKTtcblxuICAgIGNvbnN0IGNvbmZpZzogR3JpZENvbmZpZyA9IHtcbiAgICAgICAgcm93czogbnVtYmVyUmVmKGxheW91dFsxXSksXG4gICAgICAgIGNvbHM6IG51bWJlclJlZihsYXlvdXRbMF0pLFxuICAgICAgICBjZWxsV2lkdGg6IG51bWJlclJlZigxKSxcbiAgICAgICAgY2VsbEhlaWdodDogbnVtYmVyUmVmKDEpLFxuICAgICAgICBnYXA6IG51bWJlclJlZigwKSxcbiAgICAgICAgcGFkZGluZzogdmVjdG9yMlJlZigwLCAwKVxuICAgIH07XG5cbiAgICAvLyBBKiBpbXBsZW1lbnRhdGlvbiAoc2ltcGxpZmllZClcbiAgICBjb25zdCBvcGVuU2V0ID0gbmV3IE1hcDxzdHJpbmcsIHsgY29vcmQ6IEdyaWRDb29yZCwgZjogbnVtYmVyLCBnOiBudW1iZXIsIHBhcmVudDogR3JpZENvb3JkIHwgbnVsbCB9PigpO1xuICAgIGNvbnN0IGNsb3NlZFNldCA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuXG4gICAgY29uc3Qgc3RhcnRLZXkgPSBgJHtzdGFydENvb3JkLnJvdy52YWx1ZX0sJHtzdGFydENvb3JkLmNvbC52YWx1ZX1gO1xuICAgIG9wZW5TZXQuc2V0KHN0YXJ0S2V5LCB7XG4gICAgICAgIGNvb3JkOiBzdGFydENvb3JkLFxuICAgICAgICBmOiBHcmlkQ29vcmRVdGlscy5tYW5oYXR0YW5EaXN0YW5jZShzdGFydENvb3JkLCBlbmRDb29yZCkudmFsdWUsXG4gICAgICAgIGc6IDAsXG4gICAgICAgIHBhcmVudDogbnVsbFxuICAgIH0pO1xuXG4gICAgd2hpbGUgKG9wZW5TZXQuc2l6ZSA+IDApIHtcbiAgICAgICAgLy8gRmluZCBub2RlIHdpdGggbG93ZXN0IGYgc2NvcmVcbiAgICAgICAgbGV0IGN1cnJlbnRLZXkgPSAnJztcbiAgICAgICAgbGV0IGxvd2VzdEYgPSBJbmZpbml0eTtcblxuICAgICAgICBmb3IgKGNvbnN0IFtrZXksIG5vZGVdIG9mIG9wZW5TZXQpIHtcbiAgICAgICAgICAgIGlmIChub2RlLmYgPCBsb3dlc3RGKSB7XG4gICAgICAgICAgICAgICAgbG93ZXN0RiA9IG5vZGUuZjtcbiAgICAgICAgICAgICAgICBjdXJyZW50S2V5ID0ga2V5O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY3VycmVudCA9IG9wZW5TZXQuZ2V0KGN1cnJlbnRLZXkpITtcbiAgICAgICAgb3BlblNldC5kZWxldGUoY3VycmVudEtleSk7XG4gICAgICAgIGNsb3NlZFNldC5hZGQoY3VycmVudEtleSk7XG5cbiAgICAgICAgLy8gQ2hlY2sgaWYgd2UgcmVhY2hlZCB0aGUgZW5kXG4gICAgICAgIGlmIChjdXJyZW50LmNvb3JkLnJvdy52YWx1ZSA9PT0gZW5kQ29vcmQucm93LnZhbHVlICYmXG4gICAgICAgICAgICBjdXJyZW50LmNvb3JkLmNvbC52YWx1ZSA9PT0gZW5kQ29vcmQuY29sLnZhbHVlKSB7XG4gICAgICAgICAgICAvLyBSZWNvbnN0cnVjdCBwYXRoXG4gICAgICAgICAgICBjb25zdCBwYXRoOiBWZWN0b3IyRFtdID0gW107XG4gICAgICAgICAgICBsZXQgbm9kZTogdHlwZW9mIGN1cnJlbnQgfCBudWxsID0gY3VycmVudDtcblxuICAgICAgICAgICAgd2hpbGUgKG5vZGUpIHtcbiAgICAgICAgICAgICAgICBwYXRoLnVuc2hpZnQodmVjdG9yMlJlZihub2RlLmNvb3JkLmNvbC52YWx1ZSwgbm9kZS5jb29yZC5yb3cudmFsdWUpKTtcbiAgICAgICAgICAgICAgICBpZiAoIW5vZGUucGFyZW50KSBicmVhaztcblxuICAgICAgICAgICAgICAgIGNvbnN0IHBhcmVudEtleSA9IGAke25vZGUucGFyZW50LnJvdy52YWx1ZX0sJHtub2RlLnBhcmVudC5jb2wudmFsdWV9YDtcbiAgICAgICAgICAgICAgICBub2RlID0gb3BlblNldC5nZXQocGFyZW50S2V5KSB8fCBudWxsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcGF0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENoZWNrIGFkamFjZW50IGNlbGxzXG4gICAgICAgIGNvbnN0IGRpcmVjdGlvbnM6IChrZXlvZiB0eXBlb2YgR3JpZENvb3JkVXRpbHMuYWRqYWNlbnQgZXh0ZW5kcyAoY29vcmQ6IGFueSwgZGlyZWN0aW9uOiBpbmZlciBEKSA9PiBhbnkgPyBEIDogbmV2ZXIpW10gPVxuICAgICAgICAgICAgWyd1cCcsICdkb3duJywgJ2xlZnQnLCAncmlnaHQnXTtcblxuICAgICAgICBmb3IgKGNvbnN0IGRpcmVjdGlvbiBvZiBkaXJlY3Rpb25zKSB7XG4gICAgICAgICAgICBjb25zdCBuZWlnaGJvckNvb3JkID0gR3JpZENvb3JkVXRpbHMuYWRqYWNlbnQoY3VycmVudC5jb29yZCwgZGlyZWN0aW9uIGFzICd1cCcgfCAnZG93bicgfCAnbGVmdCcgfCAncmlnaHQnKTtcbiAgICAgICAgICAgIGNvbnN0IG5laWdoYm9yS2V5ID0gYCR7bmVpZ2hib3JDb29yZC5yb3cudmFsdWV9LCR7bmVpZ2hib3JDb29yZC5jb2wudmFsdWV9YDtcblxuICAgICAgICAgICAgaWYgKCFHcmlkQ29vcmRVdGlscy5pc1ZhbGlkKG5laWdoYm9yQ29vcmQsIGNvbmZpZykudmFsdWUgfHxcbiAgICAgICAgICAgICAgICBjbG9zZWRTZXQuaGFzKG5laWdoYm9yS2V5KSB8fFxuICAgICAgICAgICAgICAgIG9ic3RhY2xlU2V0LmhhcyhuZWlnaGJvcktleSkpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgZ1Njb3JlID0gY3VycmVudC5nICsgMTsgLy8gTW92ZW1lbnQgY29zdCBvZiAxXG4gICAgICAgICAgICBjb25zdCBoU2NvcmUgPSBHcmlkQ29vcmRVdGlscy5tYW5oYXR0YW5EaXN0YW5jZShuZWlnaGJvckNvb3JkLCBlbmRDb29yZCkudmFsdWU7XG4gICAgICAgICAgICBjb25zdCBmU2NvcmUgPSBnU2NvcmUgKyBoU2NvcmU7XG5cbiAgICAgICAgICAgIGNvbnN0IGV4aXN0aW5nID0gb3BlblNldC5nZXQobmVpZ2hib3JLZXkpO1xuICAgICAgICAgICAgaWYgKCFleGlzdGluZyB8fCBnU2NvcmUgPCBleGlzdGluZy5nKSB7XG4gICAgICAgICAgICAgICAgb3BlblNldC5zZXQobmVpZ2hib3JLZXksIHtcbiAgICAgICAgICAgICAgICAgICAgY29vcmQ6IG5laWdoYm9yQ29vcmQsXG4gICAgICAgICAgICAgICAgICAgIGY6IGZTY29yZSxcbiAgICAgICAgICAgICAgICAgICAgZzogZ1Njb3JlLFxuICAgICAgICAgICAgICAgICAgICBwYXJlbnQ6IGN1cnJlbnQuY29vcmRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIE5vIHBhdGggZm91bmRcbiAgICByZXR1cm4gW107XG59O1xuXG5leHBvcnQgY29uc3QgY2hlY2tDZWxsQ29sbGlzaW9uID0gKFxuICAgIGNlbGxBOiBWZWN0b3IyRCB8IFtudW1iZXIsIG51bWJlcl0sXG4gICAgY2VsbEI6IFZlY3RvcjJEIHwgW251bWJlciwgbnVtYmVyXSxcbiAgICBjZWxsU2l6ZUE6IFtudW1iZXIsIG51bWJlcl0gPSBbMSwgMV0sXG4gICAgY2VsbFNpemVCOiBbbnVtYmVyLCBudW1iZXJdID0gWzEsIDFdXG4pOiBib29sZWFuID0+IHtcbiAgICAvLyBDaGVjayBpZiB0d28gY2VsbHMgd2l0aCBzcGFucyBjb2xsaWRlXG4gICAgY29uc3QgY29vcmRBID0gY2VsbEEgaW5zdGFuY2VvZiBWZWN0b3IyRFxuICAgICAgICA/IEdyaWRDb29yZFV0aWxzLmNyZWF0ZShjZWxsQS55LnZhbHVlLCBjZWxsQS54LnZhbHVlKVxuICAgICAgICA6IEdyaWRDb29yZFV0aWxzLmNyZWF0ZShjZWxsQVsxXSwgY2VsbEFbMF0pO1xuXG4gICAgY29uc3QgY29vcmRCID0gY2VsbEIgaW5zdGFuY2VvZiBWZWN0b3IyRFxuICAgICAgICA/IEdyaWRDb29yZFV0aWxzLmNyZWF0ZShjZWxsQi55LnZhbHVlLCBjZWxsQi54LnZhbHVlKVxuICAgICAgICA6IEdyaWRDb29yZFV0aWxzLmNyZWF0ZShjZWxsQlsxXSwgY2VsbEJbMF0pO1xuXG4gICAgLy8gQ3JlYXRlIGdyaWQgY2VsbHMgd2l0aCBzcGFuc1xuICAgIGNvbnN0IGdyaWRDZWxsQSA9IEdyaWRDZWxsVXRpbHMuY3JlYXRlKFxuICAgICAgICBjb29yZEEucm93LnZhbHVlLCBjb29yZEEuY29sLnZhbHVlLFxuICAgICAgICBjZWxsU2l6ZUFbMV0sIGNlbGxTaXplQVswXSAgLy8gTm90ZTogW3dpZHRoLCBoZWlnaHRdIC0+IFtjb2xTcGFuLCByb3dTcGFuXVxuICAgICk7XG5cbiAgICBjb25zdCBncmlkQ2VsbEIgPSBHcmlkQ2VsbFV0aWxzLmNyZWF0ZShcbiAgICAgICAgY29vcmRCLnJvdy52YWx1ZSwgY29vcmRCLmNvbC52YWx1ZSxcbiAgICAgICAgY2VsbFNpemVCWzFdLCBjZWxsU2l6ZUJbMF1cbiAgICApO1xuXG4gICAgcmV0dXJuIEdyaWRDZWxsVXRpbHMub3ZlcmxhcHMoZ3JpZENlbGxBLCBncmlkQ2VsbEIpLnZhbHVlO1xufTtcblxuZXhwb3J0IGNvbnN0IG9wdGltaXplQ2VsbExheW91dCA9IChcbiAgICBjZWxsczogQXJyYXk8eyBwb3M6IFZlY3RvcjJEIHwgW251bWJlciwgbnVtYmVyXSwgc2l6ZTogW251bWJlciwgbnVtYmVyXSB9PixcbiAgICBsYXlvdXQ6IFtudW1iZXIsIG51bWJlcl1cbik6IEFycmF5PHsgcG9zOiBWZWN0b3IyRCwgc2l6ZTogW251bWJlciwgbnVtYmVyXSB9PiA9PiB7XG4gICAgLy8gVXNlIEdyaWRNYXRoIGxheW91dCBhbGdvcml0aG1zIHRvIG9wdGltaXplIGNlbGwgcG9zaXRpb25pbmdcbiAgICBjb25zdCBjb25maWc6IEdyaWRDb25maWcgPSB7XG4gICAgICAgIHJvd3M6IG51bWJlclJlZihsYXlvdXRbMV0pLFxuICAgICAgICBjb2xzOiBudW1iZXJSZWYobGF5b3V0WzBdKSxcbiAgICAgICAgY2VsbFdpZHRoOiBudW1iZXJSZWYoMSksXG4gICAgICAgIGNlbGxIZWlnaHQ6IG51bWJlclJlZigxKSxcbiAgICAgICAgZ2FwOiBudW1iZXJSZWYoMCksXG4gICAgICAgIHBhZGRpbmc6IHZlY3RvcjJSZWYoMCwgMClcbiAgICB9O1xuXG4gICAgLy8gQ29udmVydCB0byBHcmlkQ2VsbCBmb3JtYXRcbiAgICBjb25zdCBncmlkQ2VsbHMgPSBjZWxscy5tYXAoKGNlbGwsIGluZGV4KSA9PiB7XG4gICAgICAgIGNvbnN0IGNvb3JkID0gY2VsbC5wb3MgaW5zdGFuY2VvZiBWZWN0b3IyRFxuICAgICAgICAgICAgPyBHcmlkQ29vcmRVdGlscy5jcmVhdGUoY2VsbC5wb3MueS52YWx1ZSwgY2VsbC5wb3MueC52YWx1ZSlcbiAgICAgICAgICAgIDogR3JpZENvb3JkVXRpbHMuY3JlYXRlKGNlbGwucG9zWzFdLCBjZWxsLnBvc1swXSk7XG5cbiAgICAgICAgcmV0dXJuIEdyaWRDZWxsVXRpbHMuY3JlYXRlKFxuICAgICAgICAgICAgY29vcmQucm93LnZhbHVlLCBjb29yZC5jb2wudmFsdWUsXG4gICAgICAgICAgICBjZWxsLnNpemVbMV0sIGNlbGwuc2l6ZVswXSAgLy8gW3dpZHRoLCBoZWlnaHRdIC0+IFtjb2xTcGFuLCByb3dTcGFuXVxuICAgICAgICApO1xuICAgIH0pO1xuXG4gICAgLy8gVXNlIEdyaWRNYXRoIHRvIGZpdCBjZWxscyB3aXRob3V0IG92ZXJsYXBcbiAgICBjb25zdCBmaXR0ZWRDZWxscyA9IEdyaWRMYXlvdXRVdGlscy5maXRDZWxscyhncmlkQ2VsbHMsIGNvbmZpZyk7XG5cbiAgICAvLyBDb252ZXJ0IGJhY2sgdG8gb3JpZ2luYWwgZm9ybWF0XG4gICAgcmV0dXJuIGZpdHRlZENlbGxzLm1hcCgoZml0dGVkQ2VsbCwgaW5kZXgpID0+ICh7XG4gICAgICAgIHBvczogdmVjdG9yMlJlZihmaXR0ZWRDZWxsLmNvbC52YWx1ZSwgZml0dGVkQ2VsbC5yb3cudmFsdWUpLFxuICAgICAgICBzaXplOiBbZml0dGVkQ2VsbC5jb2xTcGFuLnZhbHVlLCBmaXR0ZWRDZWxsLnJvd1NwYW4udmFsdWVdXG4gICAgfSkpO1xufTtcbiJdfQ==