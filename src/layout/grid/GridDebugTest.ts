// Grid Interaction Debug Test
// Use this to identify why cell calculations return 0 or NaN

import { createDebugGrid, createDebugGridItem, bindInteraction, debugComputeCell } from "./Interact";
import { makeReactive } from "fest/object";

export const runGridDebugTest = () => {
    console.log('=== Starting Grid Debug Test ===');

    // Create a test grid
    const grid = createDebugGrid(4, 4, 100);
    document.body.appendChild(grid);

    // Create a test item
    const item = createDebugGridItem([1, 1], [1, 1]);
    grid.appendChild(item);

    // Create mock item data (this is what the grid system expects)
    const mockItem = makeReactive({
        id: 'test-item',
        cell: [1, 1] // Initial cell position
    });

    const mockItems = new Map([['test-item', mockItem]]);
    const mockList = ['test-item'];

    console.log('Test setup:', {
        grid: grid,
        item: item,
        mockItem: mockItem,
        gridAttributes: {
            columns: grid.getAttribute('data-grid-columns'),
            rows: grid.getAttribute('data-grid-rows')
        }
    });

    // Test debug compute cell function
    const debugResult = debugComputeCell(item);
    console.log('Debug compute cell result:', debugResult);

    // Bind interaction (this should work if everything is set up correctly)
    try {
        const [cellX, cellY] = bindInteraction(item, {
            item: mockItem,
            items: mockItems,
            list: mockList,
            layout: { columns: 4, rows: 4 }
        });

        console.log('Interaction bound successfully. Cell refs:', cellX, cellY);

        // Test cell value changes
        setTimeout(() => {
            console.log('Testing cell value changes...');
            mockItem.cell[0] = 2;
            mockItem.cell[1] = 2;
            console.log('Cell changed to [2,2]');
        }, 1000);

        // Test drag simulation
        setTimeout(() => {
            console.log('Simulating drag...');
            item.style.transform = 'translate(50px, 50px)'; // Simulate drag offset

            // Test compute cell during "drag"
            const dragDebug = debugComputeCell(item, [makeReactive(50), makeReactive(50)]);
            console.log('Debug during simulated drag:', dragDebug);

        }, 2000);

    } catch (error) {
        console.error('Failed to bind interaction:', error);
    }

    // Add controls to manually test
    const controls = document.createElement('div');
    controls.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: white;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
    `;

    const testBtn = document.createElement('button');
    testBtn.textContent = 'Test Cell Calculation';
    testBtn.onclick = () => {
        const result = debugComputeCell(item);
        console.log('Manual cell calculation:', result);
        alert(`Cell: [${result?.adjustedInset?.join(', ')}]`);
    };

    controls.appendChild(testBtn);
    document.body.appendChild(controls);

    return { grid, item, controls };
};

// Auto-run if this script is loaded directly
if (typeof window !== 'undefined') {
    // Uncomment to auto-run: runGridDebugTest();
}
