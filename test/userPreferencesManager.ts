typescript
interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    notifications: boolean;
    fontSize: number;
    autoSave: boolean;
}

const DEFAULT_PREFERENCES: UserPreferences = {
    theme: 'auto',
    language: 'en-US',
    notifications: true,
    fontSize: 14,
    autoSave: true
};

const VALID_LANGUAGES = ['en-US', 'es-ES', 'fr-FR', 'de-DE'];
const MIN_FONT_SIZE = 8;
const MAX_FONT_SIZE = 24;

class UserPreferencesManager {
    private preferences: UserPreferences;

    constructor() {
        this.preferences = this.loadPreferences();
    }

    private loadPreferences(): UserPreferences {
        try {
            const stored = localStorage.getItem('userPreferences');
            if (!stored) return { ...DEFAULT_PREFERENCES };

            const parsed = JSON.parse(stored);
            return this.validatePreferences(parsed);
        } catch {
            return { ...DEFAULT_PREFERENCES };
        }
    }

    private validatePreferences(data: unknown): UserPreferences {
        const prefs = { ...DEFAULT_PREFERENCES };

        if (data && typeof data === 'object') {
            const obj = data as Record<string, unknown>;

            if (obj.theme === 'light' || obj.theme === 'dark' || obj.theme === 'auto') {
                prefs.theme = obj.theme;
            }

            if (typeof obj.language === 'string' && VALID_LANGUAGES.includes(obj.language)) {
                prefs.language = obj.language;
            }

            if (typeof obj.notifications === 'boolean') {
                prefs.notifications = obj.notifications;
            }

            if (typeof obj.fontSize === 'number') {
                prefs.fontSize = Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, obj.fontSize));
            }

            if (typeof obj.autoSave === 'boolean') {
                prefs.autoSave = obj.autoSave;
            }
        }

        return prefs;
    }

    getPreferences(): UserPreferences {
        return { ...this.preferences };
    }

    updatePreferences(updates: Partial<UserPreferences>): boolean {
        const newPreferences = { ...this.preferences, ...updates };
        const validated = this.validatePreferences(newPreferences);

        if (JSON.stringify(validated) !== JSON.stringify(this.preferences)) {
            this.preferences = validated;
            this.savePreferences();
            return true;
        }
        return false;
    }

    private savePreferences(): void {
        try {
            localStorage.setItem('userPreferences', JSON.stringify(this.preferences));
        } catch (error) {
            console.error('Failed to save preferences:', error);
        }
    }

    resetToDefaults(): void {
        this.preferences = { ...DEFAULT_PREFERENCES };
        this.savePreferences();
    }

    getTheme(): string {
        if (this.preferences.theme === 'auto') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return this.preferences.theme;
    }
}

export { UserPreferencesManager, type UserPreferences };
```