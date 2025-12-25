import { numberRef, subscribe } from "fest/object";
import { addEvent } from "fest/dom";

//
export interface ContainerQueryOptions {
    container?: HTMLElement;
    queries?: {
        [key: string]: string; // e.g., { "mobile": "(max-width: 768px)", "desktop": "(min-width: 769px)" }
    };
    defaultQuery?: string;
}

//
export class ContainerQueryManager {
    container: HTMLElement;
    queries: Map<string, MediaQueryList>;
    activeQueries: Set<string> = new Set();
    queryStates: Map<string, any> = new Map();

    constructor(options: ContainerQueryOptions = {}) {
        this.container = options.container || document.documentElement;
        this.queries = new Map();

        // Initialize queries
        const defaultQueries = {
            "mobile": "(max-width: 767px)",
            "tablet": "(min-width: 768px) and (max-width: 1023px)",
            "desktop": "(min-width: 1024px)",
            "touch": "(hover: none) and (pointer: coarse)",
            "hover": "(hover: hover) and (pointer: fine)",
            "dark": "(prefers-color-scheme: dark)",
            "light": "(prefers-color-scheme: light)",
            "reduced-motion": "(prefers-reduced-motion: reduce)",
            ...(options.queries || {})
        };

        for (const [name, query] of Object.entries(defaultQueries)) {
            this.addQuery(name, query);
        }

        // Set default if specified
        if (options.defaultQuery && this.queries.has(options.defaultQuery)) {
            this.activeQueries.add(options.defaultQuery);
        }
    }

    addQuery(name: string, query: string) {
        const mediaQuery = window.matchMedia(query);
        this.queries.set(name, mediaQuery);
        this.queryStates.set(name, numberRef(mediaQuery.matches ? 1 : 0));

        // Listen for changes
        mediaQuery.addEventListener("change", (e) => {
            const stateRef = this.queryStates.get(name);
            if (stateRef) {
                stateRef.value = e.matches ? 1 : 0;
            }

            if (e.matches) {
                this.activeQueries.add(name);
            } else {
                this.activeQueries.delete(name);
            }
        });

        // Initial state
        if (mediaQuery.matches) {
            this.activeQueries.add(name);
        }
    }

    removeQuery(name: string) {
        const mediaQuery = this.queries.get(name);
        if (mediaQuery) {
            // Note: MediaQueryList doesn't have a removeEventListener in all browsers
            this.queries.delete(name);
            this.queryStates.delete(name);
            this.activeQueries.delete(name);
        }
    }

    matches(name: string): boolean {
        return this.activeQueries.has(name);
    }

    getState(name: string): any | undefined {
        return this.queryStates.get(name);
    }

    getActiveQueries(): string[] {
        return Array.from(this.activeQueries);
    }

    // Subscribe to query changes
    onQueryChange(name: string, callback: (matches: boolean) => void) {
        const stateRef = this.queryStates.get(name);
        if (stateRef) {
            return subscribe(stateRef, (value) => callback(value === 1));
        }
        return () => {};
    }

    destroy() {
        this.queries.clear();
        this.queryStates.clear();
        this.activeQueries.clear();
    }
}

// Container size tracking for responsive behavior
export class ContainerSizeTracker {
    container: HTMLElement;
    sizeRef = numberRef(0);
    widthRef = numberRef(0);
    heightRef = numberRef(0);
    aspectRatioRef = numberRef(0);
    resizeObserver?: ResizeObserver;

    constructor(container: HTMLElement) {
        this.container = container;
        this.updateSize();

        if (typeof ResizeObserver !== "undefined") {
            this.resizeObserver = new ResizeObserver(() => {
                this.updateSize();
            });
            this.resizeObserver.observe(container);
        } else {
            // Fallback for older browsers
            addEvent(window, "resize", () => this.updateSize());
        }
    }

    private updateSize() {
        const rect = this.container.getBoundingClientRect();
        this.widthRef.value = rect.width;
        this.heightRef.value = rect.height;
        this.sizeRef.value = Math.sqrt(rect.width * rect.height); // Geometric mean as "size"
        this.aspectRatioRef.value = rect.width / rect.height;
    }

    get width() { return this.widthRef; }
    get height() { return this.heightRef; }
    get size() { return this.sizeRef; }
    get aspectRatio() { return this.aspectRatioRef; }

    destroy() {
        this.resizeObserver?.disconnect();
    }
}

// Utility for responsive scrollbar behavior
export function createResponsiveScrollbarConfig(container: HTMLElement) {
    const sizeTracker = new ContainerSizeTracker(container);
    const queryManager = new ContainerQueryManager({ container });

    // Define responsive scrollbar configurations
    const configs = {
        mobile: {
            thickness: 12,
            showOnHover: false,
            autoHide: false,
            fadeDelay: 0
        },
        tablet: {
            thickness: 10,
            showOnHover: true,
            autoHide: true,
            fadeDelay: 1000
        },
        desktop: {
            thickness: 8,
            showOnHover: true,
            autoHide: true,
            fadeDelay: 1500
        }
    };

    // Current configuration based on active queries
    const currentConfig = numberRef(0); // 0: mobile, 1: tablet, 2: desktop

    // Update configuration based on queries
    const updateConfig = () => {
        if (queryManager.matches("desktop")) {
            currentConfig.value = 2;
        } else if (queryManager.matches("tablet")) {
            currentConfig.value = 1;
        } else {
            currentConfig.value = 0;
        }
    };

    // Listen to query changes
    queryManager.onQueryChange("desktop", updateConfig);
    queryManager.onQueryChange("tablet", updateConfig);
    queryManager.onQueryChange("mobile", updateConfig);

    updateConfig();

    return {
        sizeTracker,
        queryManager,
        configs,
        currentConfig,
        getCurrentConfig: () => {
            const index = currentConfig.value;
            return configs[Object.keys(configs)[index] as keyof typeof configs];
        },
        destroy: () => {
            sizeTracker.destroy();
            queryManager.destroy();
        }
    };
}
