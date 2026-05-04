/**
 * Storage Module
 *
 * Unified storage utilities for persistent state.
 * Provides wrappers for localStorage, sessionStorage, and IndexedDB.
 */

// ============================================================================
// STORAGE KEYS
// ============================================================================

/**
 * Common storage keys used across the app
 */
export const StorageKeys = {
    // User preferences
    FRONTEND_CHOICE: "rs-frontend-choice",
    FRONTEND_REMEMBER: "rs-frontend-choice-remember",
    THEME: "rs-theme",
    SETTINGS: "rs-settings",

    // Boot preferences
    BOOT_STYLE: "rs-boot-style",
    BOOT_SHELL: "rs-boot-shell",
    /** Last-focused app window shell (JSON `{ shell, t }`); see shell-preference.ts */
    BOOT_SHELL_LAST_ACTIVE: "rs-boot-shell-last-active",
    BOOT_VIEW: "rs-boot-view",
    BOOT_REMEMBER: "rs-boot-remember",

    // Shell preferences
    SHELL_CHOICE: "rs-shell-choice",
    SHELL_REMEMBER: "rs-shell-remember",

    // View state
    WORKCENTER_STATE: "rs-workcenter-state",
    VIEWER_STATE: "rs-viewer-state",
    EDITOR_STATE: "rs-editor-state",
    EXPLORER_STATE: "view-explorer-state",
    EXPLORER_PATH: "view-explorer-path",

    // Content
    LAST_MARKDOWN: "rs-last-markdown",
    HISTORY: "rs-history",
    RECENT_FILES: "rs-recent-files",

    // AI Config
    AI_CONFIG: "rs-ai-config"
} as const;

export type StorageKey = typeof StorageKeys[keyof typeof StorageKeys];

// ============================================================================
// LOCAL STORAGE
// ============================================================================

/**
 * Get item from localStorage with type safety
 */
export function getItem<T>(key: string, defaultValue: T): T {
    try {
        const stored = localStorage.getItem(key);
        if (stored === null) return defaultValue;
        return JSON.parse(stored) as T;
    } catch {
        return defaultValue;
    }
}

/**
 * Set item in localStorage
 */
export function setItem<T>(key: string, value: T): boolean {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch {
        return false;
    }
}

/**
 * Remove item from localStorage
 */
export function removeItem(key: string): boolean {
    try {
        localStorage.removeItem(key);
        return true;
    } catch {
        return false;
    }
}

/**
 * Get raw string from localStorage
 */
export function getString(key: string, defaultValue = ""): string {
    try {
        return localStorage.getItem(key) || defaultValue;
    } catch {
        return defaultValue;
    }
}

/**
 * Set raw string to localStorage
 */
export function setString(key: string, value: string): boolean {
    try {
        localStorage.setItem(key, value);
        return true;
    } catch {
        return false;
    }
}

/**
 * Check if localStorage is available
 */
export function isLocalStorageAvailable(): boolean {
    try {
        const test = "__storage_test__";
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch {
        return false;
    }
}

// ============================================================================
// SESSION STORAGE
// ============================================================================

/**
 * Get item from sessionStorage
 */
export function getSessionItem<T>(key: string, defaultValue: T): T {
    try {
        const stored = sessionStorage.getItem(key);
        if (stored === null) return defaultValue;
        return JSON.parse(stored) as T;
    } catch {
        return defaultValue;
    }
}

/**
 * Set item in sessionStorage
 */
export function setSessionItem<T>(key: string, value: T): boolean {
    try {
        sessionStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch {
        return false;
    }
}

/**
 * Remove item from sessionStorage
 */
export function removeSessionItem(key: string): boolean {
    try {
        sessionStorage.removeItem(key);
        return true;
    } catch {
        return false;
    }
}

// ============================================================================
// INDEXED DB - Simple Key-Value
// ============================================================================

const DEFAULT_DB_NAME = "crossword-storage";
const DEFAULT_STORE_NAME = "keyvalue";
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

/**
 * Get IndexedDB database instance
 */
function getDB(dbName = DEFAULT_DB_NAME, storeName = DEFAULT_STORE_NAME): Promise<IDBDatabase> {
    if (dbPromise) return dbPromise;

    dbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName);
            }
        };
    });

    return dbPromise;
}

/**
 * Get value from IndexedDB
 */
export async function getIDBItem<T>(key: string): Promise<T | null> {
    try {
        const db = await getDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(DEFAULT_STORE_NAME, "readonly");
            const store = tx.objectStore(DEFAULT_STORE_NAME);
            const request = store.get(key);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result ?? null);
        });
    } catch {
        return null;
    }
}

/**
 * Set value in IndexedDB
 */
export async function setIDBItem<T>(key: string, value: T): Promise<boolean> {
    try {
        const db = await getDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(DEFAULT_STORE_NAME, "readwrite");
            const store = tx.objectStore(DEFAULT_STORE_NAME);
            const request = store.put(value, key);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(true);
        });
    } catch {
        return false;
    }
}

/**
 * Remove value from IndexedDB
 */
export async function removeIDBItem(key: string): Promise<boolean> {
    try {
        const db = await getDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(DEFAULT_STORE_NAME, "readwrite");
            const store = tx.objectStore(DEFAULT_STORE_NAME);
            const request = store.delete(key);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(true);
        });
    } catch {
        return false;
    }
}

// ============================================================================
// INDEXED DB - Structured Storage Class
// ============================================================================

/**
 * IndexedDB wrapper for structured object storage
 */
export class IDBStorage {
    private dbName: string;
    private storeName: string;
    private db: IDBDatabase | null = null;

    constructor(dbName: string, storeName: string) {
        this.dbName = dbName;
        this.storeName = storeName;
    }

    async open(): Promise<IDBDatabase> {
        if (this.db) return this.db;

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName, { keyPath: "id" });
                }
            };
        });
    }

    async get<T>(id: string): Promise<T | null> {
        const db = await this.open();
        return new Promise((resolve, reject) => {
            const tx = db.transaction([this.storeName], "readonly");
            const store = tx.objectStore(this.storeName);
            const request = store.get(id);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result || null);
        });
    }

    async set<T extends object>(id: string, value: T): Promise<void> {
        const db = await this.open();
        return new Promise((resolve, reject) => {
            const tx = db.transaction([this.storeName], "readwrite");
            const store = tx.objectStore(this.storeName);
            const request = store.put({ id, ...value });

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    }

    async delete(id: string): Promise<void> {
        const db = await this.open();
        return new Promise((resolve, reject) => {
            const tx = db.transaction([this.storeName], "readwrite");
            const store = tx.objectStore(this.storeName);
            const request = store.delete(id);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    }

    async getAll<T>(): Promise<T[]> {
        const db = await this.open();
        return new Promise((resolve, reject) => {
            const tx = db.transaction([this.storeName], "readonly");
            const store = tx.objectStore(this.storeName);
            const request = store.getAll();

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result || []);
        });
    }

    async clear(): Promise<void> {
        const db = await this.open();
        return new Promise((resolve, reject) => {
            const tx = db.transaction([this.storeName], "readwrite");
            const store = tx.objectStore(this.storeName);
            const request = store.clear();

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    }

    close(): void {
        this.db?.close();
        this.db = null;
    }
}

// ============================================================================
// PRE-CONFIGURED STORAGE INSTANCES
// ============================================================================

/** WorkCenter data storage */
export const workCenterStorage = new IDBStorage("rs-workcenter", "data");

/** History entries storage */
export const historyStorage = new IDBStorage("rs-history", "entries");

/** Settings/config storage */
export const settingsStorage = new IDBStorage("rs-settings", "config");
