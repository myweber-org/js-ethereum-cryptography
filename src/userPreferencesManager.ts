typescript
interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    notifications: boolean;
    fontSize: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
    theme: 'auto',
    language: 'en-US',
    notifications: true,
    fontSize: 14
};

const VALID_LANGUAGES = ['en-US', 'es-ES', 'fr-FR', 'de-DE'];
const MIN_FONT_SIZE = 8;
const MAX_FONT_SIZE = 32;

class UserPreferencesManager {
    private preferences: UserPreferences;

    constructor() {
        this.preferences = this.loadPreferences();
    }

    private loadPreferences(): UserPreferences {
        try {
            const stored = localStorage.getItem('userPreferences');
            if (stored) {
                const parsed = JSON.parse(stored);
                return this.validateAndMerge(parsed);
            }
        } catch (error) {
            console.warn('Failed to load preferences, using defaults:', error);
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

        if (typeof merged.notifications !== 'boolean') {
            merged.notifications = DEFAULT_PREFERENCES.notifications;
        }

        if (typeof merged.fontSize !== 'number' || 
            merged.fontSize < MIN_FONT_SIZE || 
            merged.fontSize > MAX_FONT_SIZE) {
            merged.fontSize = DEFAULT_PREFERENCES.fontSize;
        }

        return merged;
    }

    updatePreferences(updates: Partial<UserPreferences>): boolean {
        try {
            const newPreferences = this.validateAndMerge(updates);
            this.preferences = newPreferences;
            localStorage.setItem('userPreferences', JSON.stringify(newPreferences));
            this.dispatchChangeEvent();
            return true;
        } catch (error) {
            console.error('Failed to update preferences:', error);
            return false;
        }
    }

    getPreferences(): Readonly<UserPreferences> {
        return { ...this.preferences };
    }

    resetToDefaults(): boolean {
        return this.updatePreferences(DEFAULT_PREFERENCES);
    }

    private dispatchChangeEvent(): void {
        window.dispatchEvent(new CustomEvent('preferencesChanged', {
            detail: { preferences: this.getPreferences() }
        }));
    }

    isDarkMode(): boolean {
        if (this.preferences.theme === 'auto') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return this.preferences.theme === 'dark';
    }
}

export const preferencesManager = new UserPreferencesManager();
```