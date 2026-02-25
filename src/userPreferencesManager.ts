typescript
interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    notificationsEnabled: boolean;
    fontSize: number;
    autoSaveInterval: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
    theme: 'auto',
    language: 'en-US',
    notificationsEnabled: true,
    fontSize: 14,
    autoSaveInterval: 30000
};

const VALID_LANGUAGES = ['en-US', 'es-ES', 'fr-FR', 'de-DE'];
const MIN_FONT_SIZE = 8;
const MAX_FONT_SIZE = 32;
const MIN_AUTO_SAVE_INTERVAL = 5000;
const MAX_AUTO_SAVE_INTERVAL = 300000;

class UserPreferencesManager {
    private preferences: UserPreferences;
    private storageKey: string;

    constructor(storageKey: string = 'userPreferences') {
        this.storageKey = storageKey;
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

        merged.fontSize = Math.max(MIN_FONT_SIZE, 
            Math.min(MAX_FONT_SIZE, 
                Number(merged.fontSize) || DEFAULT_PREFERENCES.fontSize));

        merged.autoSaveInterval = Math.max(MIN_AUTO_SAVE_INTERVAL,
            Math.min(MAX_AUTO_SAVE_INTERVAL,
                Number(merged.autoSaveInterval) || DEFAULT_PREFERENCES.autoSaveInterval));

        return merged;
    }

    private persistPreferences(): void {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.preferences));
        } catch (error) {
            console.error('Failed to save preferences:', error);
        }
    }

    getPreferences(): Readonly<UserPreferences> {
        return { ...this.preferences };
    }

    updatePreferences(updates: Partial<UserPreferences>): boolean {
        const newPreferences = this.validateAndMerge({ ...this.preferences, ...updates });
        
        if (JSON.stringify(newPreferences) === JSON.stringify(this.preferences)) {
            return false;
        }

        this.preferences = newPreferences;
        this.persistPreferences();
        this.notifyListeners();
        return true;
    }

    resetToDefaults(): void {
        this.preferences = { ...DEFAULT_PREFERENCES };
        this.persistPreferences();
        this.notifyListeners();
    }

    private listeners: Set<(prefs: UserPreferences) => void> = new Set();

    addChangeListener(listener: (prefs: UserPreferences) => void): () => void {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    private notifyListeners(): void {
        const prefs = this.getPreferences();
        this.listeners.forEach(listener => {
            try {
                listener(prefs);
            } catch (error) {
                console.error('Error in preferences change listener:', error);
            }
        });
    }
}

export { UserPreferencesManager, DEFAULT_PREFERENCES };
export type { UserPreferences };
```