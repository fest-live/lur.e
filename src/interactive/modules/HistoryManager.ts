import { H } from "fest/lure";

export interface HistoryEntry {
    id?: string;
    ts: number;
    prompt: string;
    before: string; // Input content (file names or text)
    after: string;  // Output content
    ok: boolean;
    error?: string;
    duration?: number; // Processing time in ms
    model?: string;    // AI model used
    tokens?: number;   // Token usage
}

export interface HistoryManagerOptions {
    storageKey?: string;
    maxEntries?: number;
    autoSave?: boolean;
}

export class HistoryManager {
    private storageKey: string;
    private maxEntries: number;
    private autoSave: boolean;
    private entries: HistoryEntry[] = [];

    constructor(options: HistoryManagerOptions = {}) {
        this.storageKey = options.storageKey || 'rs-basic-history';
        this.maxEntries = options.maxEntries || 100;
        this.autoSave = options.autoSave !== false;
        this.loadHistory();
    }

    /**
     * Add a new history entry
     */
    addEntry(entry: Omit<HistoryEntry, 'id' | 'ts'>): HistoryEntry {
        const fullEntry: HistoryEntry = {
            ...entry,
            id: this.generateId(),
            ts: Date.now()
        };

        this.entries.unshift(fullEntry); // Add to beginning

        // Trim to max entries
        if (this.entries.length > this.maxEntries) {
            this.entries = this.entries.slice(0, this.maxEntries);
        }

        if (this.autoSave) {
            this.saveHistory();
        }

        return fullEntry;
    }

    /**
     * Get all history entries
     */
    getAllEntries(): HistoryEntry[] {
        return [...this.entries];
    }

    /**
     * Get recent entries (last N)
     */
    getRecentEntries(limit: number = 10): HistoryEntry[] {
        return this.entries.slice(0, limit);
    }

    /**
     * Get entry by ID
     */
    getEntryById(id: string): HistoryEntry | undefined {
        return this.entries.find(entry => entry.id === id);
    }

    /**
     * Remove entry by ID
     */
    removeEntry(id: string): boolean {
        const index = this.entries.findIndex(entry => entry.id === id);
        if (index === -1) return false;

        this.entries.splice(index, 1);
        if (this.autoSave) {
            this.saveHistory();
        }
        return true;
    }

    /**
     * Clear all history
     */
    clearHistory(): void {
        this.entries = [];
        if (this.autoSave) {
            this.saveHistory();
        }
    }

    /**
     * Search history entries
     */
    searchEntries(query: string): HistoryEntry[] {
        const lowercaseQuery = query.toLowerCase();
        return this.entries.filter(entry =>
            entry.prompt.toLowerCase().includes(lowercaseQuery) ||
            entry.before.toLowerCase().includes(lowercaseQuery) ||
            entry.after.toLowerCase().includes(lowercaseQuery)
        );
    }

    /**
     * Get successful entries only
     */
    getSuccessfulEntries(): HistoryEntry[] {
        return this.entries.filter(entry => entry.ok);
    }

    /**
     * Get failed entries only
     */
    getFailedEntries(): HistoryEntry[] {
        return this.entries.filter(entry => !entry.ok);
    }

    /**
     * Get statistics
     */
    getStatistics() {
        const total = this.entries.length;
        const successful = this.entries.filter(e => e.ok).length;
        const failed = total - successful;
        const avgDuration = this.entries
            .filter(e => e.duration)
            .reduce((sum, e) => sum + (e.duration || 0), 0) / Math.max(1, this.entries.filter(e => e.duration).length);

        return {
            total,
            successful,
            failed,
            successRate: total > 0 ? (successful / total) * 100 : 0,
            averageDuration: avgDuration || 0
        };
    }

    /**
     * Export history as JSON
     */
    exportHistory(): string {
        return JSON.stringify(this.entries, null, 2);
    }

    /**
     * Import history from JSON
     */
    importHistory(jsonData: string): boolean {
        try {
            const importedEntries = JSON.parse(jsonData) as HistoryEntry[];

            if (!Array.isArray(importedEntries)) {
                throw new Error('Invalid history data: not an array');
            }

            // Validate entries
            for (const entry of importedEntries) {
                if (typeof entry.ts !== 'number' || typeof entry.prompt !== 'string') {
                    throw new Error('Invalid history entry: missing required fields');
                }
            }

            // Assign new IDs to avoid conflicts
            const entriesWithIds = importedEntries.map(entry => ({
                ...entry,
                id: entry.id || this.generateId()
            }));

            // Merge with existing entries, avoiding duplicates
            const existingIds = new Set(this.entries.map(e => e.id));
            const newEntries = entriesWithIds.filter(e => !existingIds.has(e.id));

            this.entries.unshift(...newEntries);

            // Trim to max entries
            if (this.entries.length > this.maxEntries) {
                this.entries = this.entries.slice(0, this.maxEntries);
            }

            if (this.autoSave) {
                this.saveHistory();
            }

            return true;
        } catch (error) {
            console.error('Failed to import history:', error);
            return false;
        }
    }

    /**
     * Create history view component
     */
    createHistoryView(onEntrySelect?: (entry: HistoryEntry) => void): HTMLElement {
        const container = H`<div class="history-view">
      <div class="history-header">
        <h3>Processing History</h3>
        <div class="history-actions">
          <button class="btn small" data-action="clear-history">Clear All</button>
          <button class="btn small" data-action="export-history">Export</button>
        </div>
      </div>

      <div class="history-stats">
        ${this.createStatsDisplay()}
      </div>

      <div class="history-list">
        ${this.entries.length === 0
                ? H`<div class="empty-history">No history yet. Start processing some content!</div>`
                : this.entries.map(entry => this.createHistoryItem(entry, onEntrySelect))
            }
      </div>
    </div>` as HTMLElement;

        // Set up event listeners
        container.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const action = target.getAttribute('data-action');
            const entryId = target.getAttribute('data-entry-id');

            if (action === 'clear-history') {
                if (confirm('Are you sure you want to clear all history?')) {
                    this.clearHistory();
                    // Refresh the view
                    const newContainer = this.createHistoryView(onEntrySelect);
                    container.replaceWith(newContainer);
                }
            } else if (action === 'export-history') {
                this.exportHistoryToFile();
            } else if (action === 'use-entry' && entryId) {
                const entry = this.getEntryById(entryId);
                if (entry) {
                    onEntrySelect?.(entry);
                }
            }
        });

        return container;
    }

    /**
     * Create compact history display (for recent activity)
     */
    createRecentHistoryView(limit: number = 3, onEntrySelect?: (entry: HistoryEntry) => void): HTMLElement {
        const recentEntries = this.getRecentEntries(limit);

        const container = H`<div class="recent-history">
      <div class="recent-header">
        <h4>Recent Activity</h4>
        <button class="btn small" data-action="view-full-history">View All</button>
      </div>

      ${recentEntries.length === 0
                ? H`<div class="no-recent">No recent activity</div>`
                : recentEntries.map(entry => this.createCompactHistoryItem(entry, onEntrySelect))
            }
    </div>` as HTMLElement;

        // Set up event listeners
        container.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const action = target.getAttribute('data-action');
            const entryId = target.getAttribute('data-entry-id');

            if (action === 'view-full-history') {
                // This would typically trigger a view change
                console.log('View full history requested');
            } else if (action === 'use-entry' && entryId) {
                const entry = this.getEntryById(entryId);
                if (entry) {
                    onEntrySelect?.(entry);
                }
            }
        });

        return container;
    }

    private createStatsDisplay(): HTMLElement {
        const stats = this.getStatistics();

        return H`<div class="stats-grid">
      <div class="stat-item">
        <span class="stat-value">${stats.total}</span>
        <span class="stat-label">Total</span>
      </div>
      <div class="stat-item">
        <span class="stat-value success">${stats.successful}</span>
        <span class="stat-label">Success</span>
      </div>
      <div class="stat-item">
        <span class="stat-value error">${stats.failed}</span>
        <span class="stat-label">Failed</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">${stats.successRate.toFixed(1)}%</span>
        <span class="stat-label">Success Rate</span>
      </div>
    </div>` as HTMLElement;
    }

    private createHistoryItem(entry: HistoryEntry, onEntrySelect?: (entry: HistoryEntry) => void): HTMLElement {
        const time = new Date(entry.ts).toLocaleString();
        const duration = entry.duration ? ` (${(entry.duration / 1000).toFixed(1)}s)` : '';

        return H`<div class="history-item ${entry.ok ? 'success' : 'error'}">
      <div class="history-meta">
        <span class="history-status ${entry.ok ? 'success' : 'error'}">
          ${entry.ok ? '✓' : '✗'}
        </span>
        <span class="history-time">${time}${duration}</span>
        ${entry.model ? H`<span class="history-model">${entry.model}</span>` : ''}
      </div>

      <div class="history-content">
        <div class="history-prompt">${entry.prompt}</div>
        <div class="history-input">Input: ${entry.before}</div>
        ${entry.error ? H`<div class="history-error">Error: ${entry.error}</div>` : ''}
      </div>

      <div class="history-actions">
        <button class="btn small" data-action="use-entry" data-entry-id="${entry.id}">Use Prompt</button>
        ${entry.ok ? H`<button class="btn small" data-action="view-result" data-entry-id="${entry.id}">View Result</button>` : ''}
      </div>
    </div>` as HTMLElement;
    }

    private createCompactHistoryItem(entry: HistoryEntry, onEntrySelect?: (entry: HistoryEntry) => void): HTMLElement {
        const time = new Date(entry.ts).toLocaleString();
        const shortPrompt = entry.prompt.length > 40 ? entry.prompt.substring(0, 40) + '...' : entry.prompt;

        return H`<div class="history-item-compact ${entry.ok ? 'success' : 'error'}">
      <div class="history-meta">
        <span class="history-status ${entry.ok ? 'success' : 'error'}">${entry.ok ? '✓' : '✗'}</span>
        <span class="history-prompt">${shortPrompt}</span>
      </div>
      <div class="history-time">${time}</div>
      <button class="btn small" data-action="use-entry" data-entry-id="${entry.id}">Use</button>
    </div>` as HTMLElement;
    }

    private exportHistoryToFile(): void {
        const data = this.exportHistory();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `ai-history-${new Date().toISOString().split('T')[0]}.json`;
        document.body.append(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(url);
    }

    private generateId(): string {
        return `history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private loadHistory(): void {
        try {
            if (typeof localStorage === "undefined") return;
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const parsedEntries = JSON.parse(stored) as HistoryEntry[];

                // Validate and migrate old format
                this.entries = parsedEntries.map(entry => ({
                    ...entry,
                    id: entry.id || this.generateId()
                }));
            }
        } catch (error) {
            console.warn('Failed to load history from storage:', error);
            this.entries = [];
        }
    }

    private saveHistory(): void {
        try {
            if (typeof localStorage === "undefined") return;
            localStorage.setItem(this.storageKey, JSON.stringify(this.entries));
        } catch (error) {
            console.warn('Failed to save history to storage:', error);
        }
    }
}

/**
 * Utility function to create a history manager
 */
export function createHistoryManager(options?: HistoryManagerOptions): HistoryManager {
    return new HistoryManager(options);
}