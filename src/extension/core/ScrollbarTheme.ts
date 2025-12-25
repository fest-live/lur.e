//
export interface ScrollbarTheme {
    // Colors
    trackColor?: string;
    thumbColor?: string;
    thumbHoverColor?: string;
    thumbActiveColor?: string;

    // Sizes
    thickness?: number;
    borderRadius?: number;
    minThumbSize?: number;

    // Behavior
    showOnHover?: boolean;
    autoHide?: boolean;
    fadeDelay?: number;
    smoothScroll?: boolean;

    // Animations
    transitionDuration?: number;
    transitionEasing?: string;

    // Accessibility
    focusOutlineColor?: string;
    focusOutlineWidth?: number;

    // Custom CSS
    customCSS?: string;
}

// Default themes
export const scrollbarThemes = {
    light: {
        trackColor: "rgba(0, 0, 0, 0.1)",
        thumbColor: "rgba(0, 0, 0, 0.3)",
        thumbHoverColor: "rgba(0, 0, 0, 0.5)",
        thumbActiveColor: "rgba(0, 0, 0, 0.7)",
        thickness: 8,
        borderRadius: 4,
        minThumbSize: 30,
        showOnHover: true,
        autoHide: true,
        fadeDelay: 1500,
        smoothScroll: true,
        transitionDuration: 0.2,
        transitionEasing: "ease-out",
        focusOutlineColor: "#007acc",
        focusOutlineWidth: 2
    } as ScrollbarTheme,

    dark: {
        trackColor: "rgba(255, 255, 255, 0.1)",
        thumbColor: "rgba(255, 255, 255, 0.3)",
        thumbHoverColor: "rgba(255, 255, 255, 0.5)",
        thumbActiveColor: "rgba(255, 255, 255, 0.7)",
        thickness: 8,
        borderRadius: 4,
        minThumbSize: 30,
        showOnHover: true,
        autoHide: true,
        fadeDelay: 1500,
        smoothScroll: true,
        transitionDuration: 0.2,
        transitionEasing: "ease-out",
        focusOutlineColor: "#00aacc",
        focusOutlineWidth: 2
    } as ScrollbarTheme,

    minimal: {
        trackColor: "transparent",
        thumbColor: "rgba(0, 0, 0, 0.2)",
        thumbHoverColor: "rgba(0, 0, 0, 0.4)",
        thumbActiveColor: "rgba(0, 0, 0, 0.6)",
        thickness: 6,
        borderRadius: 3,
        minThumbSize: 20,
        showOnHover: true,
        autoHide: true,
        fadeDelay: 1000,
        smoothScroll: true,
        transitionDuration: 0.15,
        transitionEasing: "ease-out",
        focusOutlineColor: "#666",
        focusOutlineWidth: 1
    } as ScrollbarTheme,

    rounded: {
        trackColor: "rgba(0, 0, 0, 0.05)",
        thumbColor: "rgba(0, 0, 0, 0.3)",
        thumbHoverColor: "rgba(0, 0, 0, 0.5)",
        thumbActiveColor: "rgba(0, 0, 0, 0.7)",
        thickness: 10,
        borderRadius: 5,
        minThumbSize: 40,
        showOnHover: true,
        autoHide: true,
        fadeDelay: 2000,
        smoothScroll: true,
        transitionDuration: 0.3,
        transitionEasing: "ease-in-out",
        focusOutlineColor: "#007acc",
        focusOutlineWidth: 2
    } as ScrollbarTheme,

    colorful: {
        trackColor: "rgba(255, 255, 255, 0.1)",
        thumbColor: "linear-gradient(45deg, #ff6b6b, #4ecdc4)",
        thumbHoverColor: "linear-gradient(45deg, #ff5252, #26d0ce)",
        thumbActiveColor: "linear-gradient(45deg, #ff3838, #00b8d4)",
        thickness: 12,
        borderRadius: 6,
        minThumbSize: 50,
        showOnHover: true,
        autoHide: false,
        fadeDelay: 0,
        smoothScroll: true,
        transitionDuration: 0.4,
        transitionEasing: "cubic-bezier(0.4, 0, 0.2, 1)",
        focusOutlineColor: "#ff6b6b",
        focusOutlineWidth: 3
    } as ScrollbarTheme
};

// Theme manager
export class ScrollbarThemeManager {
    private currentTheme: ScrollbarTheme;
    private scrollbarElement: HTMLElement;
    private styleElement?: HTMLStyleElement;

    constructor(scrollbarElement: HTMLElement, initialTheme: ScrollbarTheme = scrollbarThemes.light) {
        this.scrollbarElement = scrollbarElement;
        this.currentTheme = { ...initialTheme };
        this.applyTheme();
    }

    setTheme(theme: ScrollbarTheme | keyof typeof scrollbarThemes) {
        if (typeof theme === 'string') {
            const presetTheme = scrollbarThemes[theme];
            if (presetTheme) {
                this.currentTheme = { ...presetTheme };
            } else {
                console.warn(`Scrollbar theme "${theme}" not found. Using light theme as fallback.`);
                this.currentTheme = { ...scrollbarThemes.light };
            }
        } else {
            this.currentTheme = { ...theme };
        }
        this.applyTheme();
    }

    updateTheme(updates: Partial<ScrollbarTheme>) {
        this.currentTheme = { ...this.currentTheme, ...updates };
        this.applyTheme();
    }

    getCurrentTheme(): ScrollbarTheme {
        return { ...this.currentTheme };
    }

    private applyTheme() {
        const theme = this.currentTheme;

        // Apply CSS custom properties
        const cssVars = {
            "--scrollbar-thickness": `${theme.thickness}px`,
            "--scrollbar-border-radius": `${theme.borderRadius}px`,
            "--scrollbar-min-thumb-size": `${theme.minThumbSize}px`,
            "--scrollbar-track-color": theme.trackColor,
            "--scrollbar-thumb-color": theme.thumbColor,
            "--scrollbar-thumb-hover-color": theme.thumbHoverColor,
            "--scrollbar-thumb-active-color": theme.thumbActiveColor,
            "--scrollbar-transition-duration": `${theme.transitionDuration}s`,
            "--scrollbar-transition-easing": theme.transitionEasing,
            "--scrollbar-focus-outline-color": theme.focusOutlineColor,
            "--scrollbar-focus-outline-width": `${theme.focusOutlineWidth}px`,
        };

        Object.entries(cssVars).forEach(([prop, value]) => {
            this.scrollbarElement.style.setProperty(prop, value);
        });

        // Apply behavior attributes
        this.scrollbarElement.setAttribute("data-scrollbar-autohide", theme.autoHide ? "true" : "false");
        this.scrollbarElement.setAttribute("data-scrollbar-hover", theme.showOnHover ? "true" : "false");
        this.scrollbarElement.setAttribute("data-scrollbar-smooth", theme.smoothScroll ? "true" : "false");

        // Apply custom CSS if provided
        if (theme.customCSS) {
            this.ensureStyleElement();
            if (this.styleElement) {
                this.styleElement.textContent = theme.customCSS;
            }
        } else if (this.styleElement) {
            this.styleElement.textContent = "";
        }
    }

    private ensureStyleElement() {
        if (!this.styleElement) {
            this.styleElement = document.createElement("style");
            this.styleElement.setAttribute("data-scrollbar-theme", "custom");
            document.head.appendChild(this.styleElement);
        }
    }

    // Preset theme helpers
    static light() { return scrollbarThemes.light; }
    static dark() { return scrollbarThemes.dark; }
    static minimal() { return scrollbarThemes.minimal; }
    static rounded() { return scrollbarThemes.rounded; }
    static colorful() { return scrollbarThemes.colorful; }

    destroy() {
        if (this.styleElement && this.styleElement.parentNode) {
            this.styleElement.parentNode.removeChild(this.styleElement);
        }
    }
}

// CSS generation helper
export function generateScrollbarCSS(selector: string, theme: ScrollbarTheme): string {
    return `
        ${selector} {
            --scrollbar-thickness: ${theme.thickness}px;
            --scrollbar-border-radius: ${theme.borderRadius}px;
            --scrollbar-min-thumb-size: ${theme.minThumbSize}px;
            --scrollbar-track-color: ${theme.trackColor};
            --scrollbar-thumb-color: ${theme.thumbColor};
            --scrollbar-thumb-hover-color: ${theme.thumbHoverColor};
            --scrollbar-thumb-active-color: ${theme.thumbActiveColor};
            --scrollbar-transition-duration: ${theme.transitionDuration}s;
            --scrollbar-transition-easing: ${theme.transitionEasing};
            --scrollbar-focus-outline-color: ${theme.focusOutlineColor};
            --scrollbar-focus-outline-width: ${theme.focusOutlineWidth}px;
        }

        ${selector}::-webkit-scrollbar {
            width: var(--scrollbar-thickness);
            height: var(--scrollbar-thickness);
        }

        ${selector}::-webkit-scrollbar-track {
            background: var(--scrollbar-track-color);
            border-radius: var(--scrollbar-border-radius);
        }

        ${selector}::-webkit-scrollbar-thumb {
            background: var(--scrollbar-thumb-color);
            border-radius: var(--scrollbar-border-radius);
            transition: background-color var(--scrollbar-transition-duration) var(--scrollbar-transition-easing);
        }

        ${selector}::-webkit-scrollbar-thumb:hover {
            background: var(--scrollbar-thumb-hover-color);
        }

        ${selector}::-webkit-scrollbar-thumb:active {
            background: var(--scrollbar-thumb-active-color);
        }

        ${selector}[data-scrollbar-autohide="true"] {
            scrollbar-width: thin;
        }

        ${selector}[data-scrollbar-autohide="true"]:not(:hover)::-webkit-scrollbar {
            width: 0;
            height: 0;
        }

        ${selector}:focus {
            outline: var(--scrollbar-focus-outline-width) solid var(--scrollbar-focus-outline-color);
            outline-offset: 2px;
        }
    `;
}
