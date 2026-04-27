import { H } from "fest/lure";

// Import built-in templates
import { DEFAULT_TEMPLATES } from "@rs-com/core/BuiltInAI";

export interface PromptTemplate {
    id?: string;
    name: string;
    prompt: string;
    category?: string;
    tags?: string[];
    createdAt?: number;
    updatedAt?: number;
    usageCount?: number;
}

export interface TemplateManagerOptions {
    storageKey?: string;
    defaultTemplates?: PromptTemplate[];
}

export class TemplateManager {
    private storageKey: string;
    private templates: PromptTemplate[] = [];
    private defaultTemplates: PromptTemplate[];

    constructor(options: TemplateManagerOptions = {}) {
        this.storageKey = options.storageKey || 'rs-prompt-templates';
        this.defaultTemplates = options.defaultTemplates || this.getDefaultTemplates();
        this.loadTemplates();
    }

    /**
     * Get all templates
     */
    getAllTemplates(): PromptTemplate[] {
        return [...this.templates];
    }

    /**
     * Get template by ID
     */
    getTemplateById(id: string): PromptTemplate | undefined {
        return this.templates.find(t => t.id === id);
    }

    /**
     * Add a new template
     */
    addTemplate(template: Omit<PromptTemplate, 'id' | 'createdAt' | 'updatedAt'>): PromptTemplate {
        const newTemplate: PromptTemplate = {
            ...template,
            id: this.generateId(),
            createdAt: Date.now(),
            updatedAt: Date.now(),
            usageCount: 0
        };

        this.templates.push(newTemplate);
        this.saveTemplates();
        return newTemplate;
    }

    /**
     * Update an existing template
     */
    updateTemplate(id: string, updates: Partial<PromptTemplate>): boolean {
        const index = this.templates.findIndex(t => t.id === id);
        if (index === -1) return false;

        this.templates[index] = {
            ...this.templates[index],
            ...updates,
            updatedAt: Date.now()
        };

        this.saveTemplates();
        return true;
    }

    /**
     * Remove a template
     */
    removeTemplate(id: string): boolean {
        const index = this.templates.findIndex(t => t.id === id);
        if (index === -1) return false;

        this.templates.splice(index, 1);
        this.saveTemplates();
        return true;
    }

    /**
     * Increment usage count for a template
     */
    incrementUsageCount(id: string): void {
        const template = this.templates.find(t => t.id === id);
        if (template) {
            template.usageCount = (template.usageCount || 0) + 1;
            this.saveTemplates();
        }
    }

    /**
     * Search templates by name or content
     */
    searchTemplates(query: string): PromptTemplate[] {
        const lowercaseQuery = query.toLowerCase();
        return this.templates.filter(template =>
            template.name.toLowerCase().includes(lowercaseQuery) ||
            template.prompt.toLowerCase().includes(lowercaseQuery) ||
            template.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
        );
    }

    /**
     * Get templates by category
     */
    getTemplatesByCategory(category: string): PromptTemplate[] {
        return this.templates.filter(template => template.category === category);
    }

    /**
     * Get most used templates
     */
    getMostUsedTemplates(limit: number = 5): PromptTemplate[] {
        return this.templates
            .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
            .slice(0, limit);
    }

    /**
     * Export templates as JSON
     */
    exportTemplates(): string {
        return JSON.stringify(this.templates, null, 2);
    }

    /**
     * Import templates from JSON
     */
    importTemplates(jsonData: string): boolean {
        try {
            const importedTemplates = JSON.parse(jsonData) as PromptTemplate[];

            // Validate structure
            if (!Array.isArray(importedTemplates)) {
                throw new Error('Invalid template data: not an array');
            }

            for (const template of importedTemplates) {
                if (!template.name || !template.prompt) {
                    throw new Error('Invalid template: missing name or prompt');
                }
            }

            // Assign new IDs to avoid conflicts
            const templatesWithIds = importedTemplates.map(template => ({
                ...template,
                id: this.generateId(),
                createdAt: template.createdAt || Date.now(),
                updatedAt: Date.now()
            }));

            this.templates.push(...templatesWithIds);
            this.saveTemplates();
            return true;
        } catch (error) {
            console.error('Failed to import templates:', error);
            return false;
        }
    }

    /**
     * Reset to default templates
     */
    resetToDefaults(): void {
        this.templates = this.defaultTemplates.map(template => ({
            ...template,
            id: this.generateId(),
            createdAt: Date.now(),
            updatedAt: Date.now(),
            usageCount: 0
        }));
        this.saveTemplates();
    }

    /**
     * Create template editor modal
     */
    createTemplateEditor(container: HTMLElement, onSave?: () => void): void {
        const modal = H`<div class="template-editor-modal">
      <div class="modal-overlay">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Prompt Templates</h3>
          </div>

          <div class="template-list">
            ${this.templates.map((template, index) =>
            H`<div class="template-item">
                <div class="template-header">
                  <input type="text" class="template-name" value="${template.name}" data-index="${index}" placeholder="Template name">
                  <button class="btn small remove-template" data-index="${index}" title="Remove template">✕</button>
                </div>
                <textarea class="template-prompt" data-index="${index}" placeholder="Enter your prompt template...">${template.prompt}</textarea>
                <div class="template-meta">
                  ${template.usageCount ? H`<span class="usage-count">Used ${template.usageCount} times</span>` : ''}
                  ${template.category ? H`<span class="category">${template.category}</span>` : ''}
                </div>
              </div>`
        )}
          </div>

          <div class="modal-actions">
            <button class="btn" data-action="add-template">Add Template</button>
            <button class="btn" data-action="reset-defaults">Reset to Defaults</button>
            <button class="btn primary" data-action="save-templates">Save Changes</button>
            <button class="btn" data-action="close-editor">Close</button>
          </div>
        </div>
      </div>
    </div>` as HTMLElement;

        // Template editor events
        modal.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const action = target.getAttribute('data-action');
            const index = target.getAttribute('data-index');

            if (action === 'add-template') {
                this.addTemplate({
                    name: 'New Template',
                    prompt: 'Enter your prompt template here...',
                    category: 'Custom'
                });
                modal.remove();
                this.createTemplateEditor(container, onSave);

            } else if (action === 'reset-defaults') {
                if (confirm('Are you sure you want to reset all templates to defaults? This will remove all custom templates.')) {
                    this.resetToDefaults();
                    modal.remove();
                    this.createTemplateEditor(container, onSave);
                }

            } else if (action === 'save-templates') {
                // Update templates from inputs
                const nameInputs = modal.querySelectorAll('.template-name') as NodeListOf<HTMLInputElement>;
                const promptInputs = modal.querySelectorAll('.template-prompt') as NodeListOf<HTMLTextAreaElement>;

                this.templates = Array.from(nameInputs).map((input, i) => {
                    const index = parseInt(input.getAttribute('data-index') || '0');
                    const originalTemplate = this.templates[index];

                    return {
                        ...originalTemplate,
                        name: input.value.trim() || 'Untitled Template',
                        prompt: promptInputs[i].value.trim() || 'Enter your prompt...',
                        updatedAt: Date.now()
                    };
                });

                this.saveTemplates();
                modal.remove();
                onSave?.();

            } else if (action === 'close-editor') {
                modal.remove();

            } else if (target.classList.contains('remove-template') && index !== null) {
                const templateIndex = parseInt(index);
                const template = this.templates[templateIndex];
                if (confirm(`Remove template "${template.name}"?`)) {
                    this.removeTemplate(template.id!);
                    modal.remove();
                    this.createTemplateEditor(container, onSave);
                }
            }
        });

        container.append(modal);
    }

    /**
     * Create template selector dropdown
     */
    createTemplateSelect(selectedPrompt?: string): HTMLSelectElement {
        const select = document.createElement('select');
        select.className = 'template-select';

        // Add default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select Template...';
        select.append(defaultOption);

        // Add template options
        this.templates.forEach(template => {
            const option = document.createElement('option');
            option.value = template.prompt;
            option.textContent = template.name;
            if (template.category) {
                option.textContent += ` (${template.category})`;
            }
            select.append(option);
        });

        // Set selected value if provided
        if (selectedPrompt) {
            select.value = selectedPrompt;
        }

        return select;
    }

    private getDefaultTemplates(): PromptTemplate[] {
        return DEFAULT_TEMPLATES.map(template => ({
            ...template,
            id: this.generateId(),
            createdAt: Date.now(),
            updatedAt: Date.now(),
            usageCount: 0
        }));
    }

    private generateId(): string {
        return `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private loadTemplates(): void {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const parsedTemplates = JSON.parse(stored) as PromptTemplate[];

                // Validate and migrate old format
                this.templates = parsedTemplates.map(template => ({
                    ...template,
                    id: template.id || this.generateId(),
                    createdAt: template.createdAt || Date.now(),
                    updatedAt: template.updatedAt || Date.now(),
                    usageCount: template.usageCount || 0
                }));
            } else {
                // Initialize with defaults
                this.resetToDefaults();
            }
        } catch (error) {
            console.warn('Failed to load templates from storage:', error);
            this.resetToDefaults();
        }
    }

    private saveTemplates(): void {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.templates));
        } catch (error) {
            console.warn('Failed to save templates to storage:', error);
        }
    }
}

/**
 * Utility function to create a template manager
 */
export function createTemplateManager(options?: TemplateManagerOptions): TemplateManager {
    return new TemplateManager(options);
}