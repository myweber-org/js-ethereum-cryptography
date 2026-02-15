typescript
interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    notificationsEnabled: boolean;
    fontSize: number;
    autoSave: boolean;
}

const DEFAULT_PREFERENCES: UserPreferences = {
    theme: 'auto',
    language: 'en-US',
    notificationsEnabled: true,
    fontSize: 14,
    autoSave: true
};

const VALID_LANGUAGES = ['en-US', 'es-ES', 'fr-FR', 'de-DE', 'ja-JP'];
const MIN_FONT_SIZE = 8;
const MAX_FONT_SIZE = 32;

class UserPreferencesManager {
    private preferences: UserPreferences;
    private readonly storageKey = 'user_preferences';

    constructor() {
        this.preferences = this.loadPreferences();
    }

    private loadPreferences(): UserPreferences {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const parsed = JSON.parse(stored);
                return this.validateAndMerge(parsed);
            }
        } catch (error) {
            console.warn('Failed to load preferences from storage:', error);
        }
        return { ...DEFAULT_PREFERENCES };
    }

    private validateAndMerge(partial: Partial<UserPreferences>): UserPreferences {
        const merged = { ...DEFAULT_PREFERENCES, ...partial };
        
        if (!['light', 'dark', 'auto'].includes(merged.theme)) {
            merged.theme = DEFAULT_PREFERENCES.theme;
        }
        
        if (!VALID_LANGUAGES.includes(merged.language)) {
            merged.language = DEFAULT_PREFERENCES.language;
        }
        
        if (typeof merged.notificationsEnabled !== 'boolean') {
            merged.notificationsEnabled = DEFAULT_PREFERENCES.notificationsEnabled;
        }
        
        if (typeof merged.fontSize !== 'number' || 
            merged.fontSize < MIN_FONT_SIZE || 
            merged.fontSize > MAX_FONT_SIZE) {
            merged.fontSize = DEFAULT_PREFERENCES.fontSize;
        }
        
        if (typeof merged.autoSave !== 'boolean') {
            merged.autoSave = DEFAULT_PREFERENCES.autoSave;
        }
        
        return merged;
    }

    updatePreferences(updates: Partial<UserPreferences>): boolean {
        const newPreferences = this.validateAndMerge({
            ...this.preferences,
            ...updates
        });
        
        const hasChanged = JSON.stringify(newPreferences) !== JSON.stringify(this.preferences);
        
        if (hasChanged) {
            this.preferences = newPreferences;
            this.savePreferences();
            this.notifyListeners();
        }
        
        return hasChanged;
    }

    getPreferences(): Readonly<UserPreferences> {
        return { ...this.preferences };
    }

    resetToDefaults(): void {
        this.preferences = { ...DEFAULT_PREFERENCES };
        this.savePreferences();
        this.notifyListeners();
    }

    private savePreferences(): void {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.preferences));
        } catch (error) {
            console.error('Failed to save preferences:', error);
        }
    }

    private listeners: Set<() => void> = new Set();

    addChangeListener(listener: () => void): () => void {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    private notifyListeners(): void {
        this.listeners.forEach(listener => listener());
    }
}

export const preferencesManager = new UserPreferencesManager();
```