/**
 * Lazy loading utility for components and their styles
 */

export interface LazyComponent<T> {
    component: T;
    dispose?: () => void;
}

export interface LazyLoaderOptions {
    cssPath?: string;
    componentName: string;
}

/**
 * Lazy load a component and its CSS
 */
export async function lazyLoadComponent<T>(
    importFn: () => Promise<T>,
    options: LazyLoaderOptions
): Promise<LazyComponent<T>> {
    const { cssPath, componentName } = options;

    console.log(`[LazyLoader] Loading component: ${componentName}`);

    // Load CSS first if specified
    if (cssPath) {
        try {
            await loadCSS(cssPath);
        } catch (error) {
            console.warn(`[LazyLoader] Failed to load CSS for ${componentName}:`, error);
        }
    }

    // Load the component
    try {
        const component = await importFn();
        console.log(`[LazyLoader] Successfully loaded component: ${componentName}`);
        return { component };
    } catch (error) {
        console.error(`[LazyLoader] Failed to load component ${componentName}:`, error);
        throw error;
    }
}

/**
 * Load CSS dynamically
 */
async function loadCSS(href: string): Promise<void> {
    return new Promise((resolve, reject) => {
        // Check if already loaded
        const existingLinks = document.querySelectorAll(`link[href="${href}"]`);
        if (existingLinks.length > 0) {
            resolve();
            return;
        }

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.onload = () => resolve();
        link.onerror = () => reject(new Error(`Failed to load CSS: ${href}`));

        document.head.appendChild(link);
    });
}

/**
 * Cache for loaded components to avoid re-loading
 */
const componentCache = new Map<string, LazyComponent<any>>();

/**
 * Get or load a cached component
 */
export async function getCachedComponent<T>(
    cacheKey: string,
    importFn: () => Promise<T>,
    options: LazyLoaderOptions
): Promise<LazyComponent<T>> {
    if (componentCache.has(cacheKey)) {
        return componentCache.get(cacheKey)!;
    }

    const lazyComponent = await lazyLoadComponent(importFn, options);
    componentCache.set(cacheKey, lazyComponent);
    return lazyComponent;
}

/**
 * Clear component cache (useful for development/testing)
 */
export function clearComponentCache(): void {
    componentCache.clear();
}

/**
 * Dispose of cached components
 */
export function disposeCachedComponents(): void {
    for (const [, lazyComponent] of componentCache) {
        if (lazyComponent.dispose) {
            lazyComponent.dispose();
        }
    }
    componentCache.clear();
}