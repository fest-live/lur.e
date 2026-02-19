// Enhanced Grid Interaction Examples
// Demonstrates the improved grid system with animation bindings

import {
    bindInteraction,
    animateToCell,
    animateMultipleCells,
    createAnimatedGridItem,
    animateGridRearrange,
    addGridItemHoverAnimations,
    gridAnimationPresets
} from "./Interact";
import { observe } from "fest/object";

/**
 * Example 1: Basic Enhanced Grid Interaction
 * Shows improved drag and drop with smooth animations
 */
export function enhancedGridInteractionExample() {
    // Create a grid container
    const grid = document.createElement('div');
    grid.style.cssText = `
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: repeat(4, 1fr);
        gap: 10px;
        width: 400px;
        height: 400px;
        border: 2px solid #ccc;
        padding: 10px;
    `;

    // Create grid items with enhanced animations
    const items = Array.from({ length: 8 }, (_, i) => {
        const item = document.createElement('div');
        item.style.cssText = `
            background: hsl(${i * 45}, 70%, 60%);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: white;
            cursor: grab;
            user-select: none;
            transition: all 0.2s ease;
        `;
        item.textContent = `Item ${i + 1}`;

        // Add hover animations
        addGridItemHoverAnimations(item, {
            scale: 1.1,
            shadowBlur: 12,
            duration: 150
        });

        return item;
    });

    // Add items to grid and set up interactions
    items.forEach((item, index) => {
        grid.appendChild(item);

        // Create reactive grid item
        const animatedItem = createAnimatedGridItem(item, [index % 4, Math.floor(index / 4)], {
            animationType: 'spring',
            duration: 400
        });

        // Set up enhanced interaction (this replaces the old bindInteraction)
        // Note: This would need to be adapted to work with the existing grid system
    });

    return grid;
}

/**
 * Example 2: Smooth Grid Rearrangements
 * Demonstrates animated grid layout changes
 */
export function gridRearrangementExample() {
    const container = document.createElement('div');
    container.style.cssText = `
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(3, 1fr);
        gap: 8px;
        width: 300px;
        height: 300px;
        border: 1px solid #ddd;
        padding: 8px;
    `;

    // Create items
    const items = Array.from({ length: 9 }, (_, i) => {
        const item = document.createElement('div');
        item.style.cssText = `
            background: linear-gradient(45deg, #667eea, #764ba2);
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 14px;
        `;
        item.textContent = `${i + 1}`;

        // Set initial grid position using CSS custom properties
        item.style.setProperty('--cell-x', (i % 3).toString());
        item.style.setProperty('--cell-y', Math.floor(i / 3).toString());

        container.appendChild(item);
        return { element: item, currentCell: [i % 3, Math.floor(i / 3)] as [number, number] };
    });

    // Animation controls
    const controls = document.createElement('div');
    controls.style.cssText = `
        margin-top: 20px;
        display: flex;
        gap: 10px;
    `;

    const shuffleBtn = document.createElement('button');
    shuffleBtn.textContent = 'Shuffle';
    shuffleBtn.onclick = async () => {
        // Create random rearrangement
        const newPositions = [...items].sort(() => Math.random() - 0.5);
        const movements = items.map((item, newIndex) => ({
            element: item.element,
            fromCell: item.currentCell,
            toCell: [newIndex % 3, Math.floor(newIndex / 3)] as [number, number]
        }));

        // Animate the rearrangement
        await animateGridRearrange(container, movements, {
            animationType: 'spring',
            duration: 500,
            stagger: 20
        });

        // Update current positions
        items.forEach((item, index) => {
            item.currentCell = [index % 3, Math.floor(index / 3)];
        });
    };

    const sortBtn = document.createElement('button');
    sortBtn.textContent = 'Sort';
    sortBtn.onclick = async () => {
        const movements = items.map((item, index) => ({
            element: item.element,
            fromCell: item.currentCell,
            toCell: [index % 3, Math.floor(index / 3)] as [number, number]
        }));

        await animateGridRearrange(container, movements, {
            animationType: 'animate',
            duration: 400,
            stagger: 15
        });

        items.forEach((item, index) => {
            item.currentCell = [index % 3, Math.floor(index / 3)];
        });
    };

    controls.appendChild(shuffleBtn);
    controls.appendChild(sortBtn);

    const wrapper = document.createElement('div');
    wrapper.appendChild(container);
    wrapper.appendChild(controls);

    return wrapper;
}

/**
 * Example 3: Multi-Cell Animations with Staggering
 * Shows coordinated animations of multiple grid items
 */
export function multiCellAnimationExample() {
    const grid = document.createElement('div');
    grid.style.cssText = `
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        grid-template-rows: repeat(5, 1fr);
        gap: 4px;
        width: 250px;
        height: 250px;
        border: 1px solid #ccc;
    `;

    // Create a 5x5 grid of items
    const items = Array.from({ length: 25 }, (_, i) => {
        const item = document.createElement('div');
        item.style.cssText = `
            background: hsl(${i * 9}, 70%, 60%);
            border-radius: 2px;
            opacity: 0.3;
        `;

        // Set initial position
        item.style.setProperty('--cell-x', (i % 5).toString());
        item.style.setProperty('--cell-y', Math.floor(i / 5).toString());

        grid.appendChild(item);
        return item;
    });

    // Animation controls
    const controls = document.createElement('div');
    controls.style.marginTop = '20px';

    const waveBtn = document.createElement('button');
    waveBtn.textContent = 'Wave Animation';
    waveBtn.onclick = async () => {
        // Create wave-like movements
        const movements = items.map((item, i) => {
            const row = Math.floor(i / 5);
            const col = i % 5;
            const delay = (row + col) * 50; // Diagonal wave

            return {
                element: item,
                targetCell: [col, row],
                options: {
                    animationType: 'spring' as const,
                    duration: 600,
                    delay
                }
            };
        });

        // Reset to original positions first
        items.forEach((item, i) => {
            item.style.setProperty('--cell-x', (i % 5).toString());
            item.style.setProperty('--cell-y', Math.floor(i / 5).toString());
        });

        await new Promise(resolve => setTimeout(resolve, 100));

        // Animate to wave pattern
        const waveTargets = items.map((item, i) => {
            const row = Math.floor(i / 5);
            const col = i % 5;
            return {
                element: item,
                targetCell: [col, 4 - row] as [number, number] // Flip vertically
            };
        });

        await animateMultipleCells(waveTargets, {
            animationType: 'spring',
            duration: 600,
            stagger: 30
        });
    };

    const spiralBtn = document.createElement('button');
    spiralBtn.textContent = 'Spiral Animation';
    spiralBtn.onclick = async () => {
        // Create spiral pattern
        const centerX = 2;
        const centerY = 2;
        const spiralTargets = items.map((item, i) => {
            const angle = (i / 25) * Math.PI * 4; // 2 full rotations
            const radius = Math.sqrt(i / 25) * 2;
            const x = Math.round(centerX + Math.cos(angle) * radius);
            const y = Math.round(centerY + Math.sin(angle) * radius);

            return {
                element: item,
                targetCell: [Math.max(0, Math.min(4, x)), Math.max(0, Math.min(4, y))] as [number, number]
            };
        });

        await animateMultipleCells(spiralTargets, {
            animationType: 'animate',
            duration: 800,
            stagger: 20
        });
    };

    controls.appendChild(waveBtn);
    controls.appendChild(spiralBtn);

    const wrapper = document.createElement('div');
    wrapper.appendChild(grid);
    wrapper.appendChild(controls);

    return wrapper;
}

/**
 * Example 4: Reactive Grid with Live Updates
 * Shows grid that responds to reactive data changes with smooth animations
 */
export function reactiveGridExample() {
    const container = document.createElement('div');
    container.style.cssText = `
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: repeat(4, 1fr);
        gap: 6px;
        width: 320px;
        height: 320px;
        border: 1px solid #ddd;
        padding: 8px;
    `;

    // Reactive data store
    const gridData = observe({
        items: Array.from({ length: 16 }, (_, i) => ({
            id: i,
            value: Math.floor(Math.random() * 100),
            color: `hsl(${i * 22.5}, 70%, 60%)`
        }))
    });

    // Create animated grid items
    const gridItems = gridData.items.map((itemData, index) => {
        const item = document.createElement('div');
        item.style.cssText = `
            background: ${itemData.color};
            border-radius: 4px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 12px;
            font-weight: bold;
            transition: all 0.3s ease;
        `;

        // Create animated item
        const animatedItem = createAnimatedGridItem(item, [index % 4, Math.floor(index / 4)], {
            animationType: 'spring',
            duration: 500
        });

        // Update content reactively
        const valueDisplay = document.createElement('div');
        valueDisplay.textContent = itemData.value.toString();
        item.appendChild(valueDisplay);

        const idDisplay = document.createElement('div');
        idDisplay.textContent = `ID: ${itemData.id}`;
        idDisplay.style.fontSize = '10px';
        idDisplay.style.opacity = '0.8';
        item.appendChild(idDisplay);

        container.appendChild(item);

        return {
            element: item,
            animatedItem,
            data: itemData,
            valueDisplay
        };
    });

    // Controls
    const controls = document.createElement('div');
    controls.style.cssText = `
        margin-top: 20px;
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
    `;

    // Shuffle values button
    const shuffleBtn = document.createElement('button');
    shuffleBtn.textContent = 'Shuffle Values';
    shuffleBtn.onclick = () => {
        gridData.items.forEach(item => {
            item.value = Math.floor(Math.random() * 100);
        });

        // Update displays with animation
        gridItems.forEach(gridItem => {
            gridItem.valueDisplay.textContent = gridItem.data.value.toString();
            // Animate color change
            gridItem.element.style.background = `hsl(${gridItem.data.id * 22.5}, 70%, ${50 + gridItem.data.value}%)`;
        });
    };

    // Rearrange grid button
    const rearrangeBtn = document.createElement('button');
    rearrangeBtn.textContent = 'Rearrange';
    rearrangeBtn.onclick = async () => {
        // Sort by value and animate to new positions
        const sortedItems = [...gridItems].sort((a, b) => a.data.value - b.data.value);

        const movements = sortedItems.map((gridItem, newIndex) => ({
            element: gridItem.element,
            fromCell: [newIndex % 4, Math.floor(newIndex / 4)] as [number, number], // Current position
            toCell: [newIndex % 4, Math.floor(newIndex / 4)] as [number, number]  // New position
        }));

        await animateGridRearrange(container, movements, {
            animationType: 'spring',
            duration: 600,
            stagger: 25
        });
    };

    controls.appendChild(shuffleBtn);
    controls.appendChild(rearrangeBtn);

    const wrapper = document.createElement('div');
    wrapper.appendChild(container);
    wrapper.appendChild(controls);

    return wrapper;
}

/**
 * Example 5: Performance-Optimized Grid Animations
 * Demonstrates efficient animation techniques for large grids
 */
export function performanceOptimizedGridExample() {
    const grid = document.createElement('div');
    grid.style.cssText = `
        display: grid;
        grid-template-columns: repeat(8, 1fr);
        grid-template-rows: repeat(8, 1fr);
        gap: 2px;
        width: 400px;
        height: 400px;
        border: 1px solid #ccc;
    `;

    // Create 64 items for performance testing
    const items = Array.from({ length: 64 }, (_, i) => {
        const item = document.createElement('div');
        item.style.cssText = `
            background: hsl(${i * 5.625}, 70%, 60%);
            border-radius: 1px;
            opacity: 0.7;
            will-change: transform; /* Optimize for animations */
        `;

        item.style.setProperty('--cell-x', (i % 8).toString());
        item.style.setProperty('--cell-y', Math.floor(i / 8).toString());

        grid.appendChild(item);
        return item;
    });

    // Controls for different animation techniques
    const controls = document.createElement('div');
    controls.style.cssText = `
        margin-top: 20px;
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
    `;

    // CSS Transition animation (most efficient)
    const transitionBtn = document.createElement('button');
    transitionBtn.textContent = 'CSS Transition';
    transitionBtn.onclick = async () => {
        const movements = items.map((item, i) => ({
            element: item,
            fromCell: [i % 8, Math.floor(i / 8)] as [number, number],
            toCell: [7 - (i % 8), Math.floor(i / 8)] as [number, number] // Mirror horizontally
        }));

        await animateGridRearrange(grid, movements, {
            animationType: 'transition',
            duration: 600,
            stagger: 5 // Small stagger for large grids
        });
    };

    // Web Animations API (balanced performance)
    const animateBtn = document.createElement('button');
    animateBtn.textContent = 'Web Animations';
    animateBtn.onclick = async () => {
        const movements = items.map((item, i) => ({
            element: item,
            fromCell: [i % 8, Math.floor(i / 8)] as [number, number],
            toCell: [i % 8, 7 - Math.floor(i / 8)] as [number, number] // Mirror vertically
        }));

        await animateGridRearrange(grid, movements, {
            animationType: 'animate',
            duration: 400,
            stagger: 3
        });
    };

    // Spring animations (more natural but heavier)
    const springBtn = document.createElement('button');
    springBtn.textContent = 'Spring Physics';
    springBtn.onclick = async () => {
        const movements = items.slice(0, 16).map((item, i) => ({ // Limit for performance
            element: item,
            fromCell: [i % 4, Math.floor(i / 4)] as [number, number],
            toCell: [(i * 397) % 8, ((i * 211) % 8)] as [number, number] // Pseudo-random
        }));

        await animateGridRearrange(grid, movements, {
            animationType: 'spring',
            duration: 800,
            stagger: 10
        });
    };

    controls.appendChild(transitionBtn);
    controls.appendChild(animateBtn);
    controls.appendChild(springBtn);

    const wrapper = document.createElement('div');
    wrapper.appendChild(grid);
    wrapper.appendChild(controls);

    return wrapper;
}

// Export all examples
export const gridExamples = {
    enhancedInteraction: enhancedGridInteractionExample,
    rearrangement: gridRearrangementExample,
    multiCell: multiCellAnimationExample,
    reactive: reactiveGridExample,
    performance: performanceOptimizedGridExample
};
