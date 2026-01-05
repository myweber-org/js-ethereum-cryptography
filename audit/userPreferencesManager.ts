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
const MAX_FONT_SIZE = 32;

class UserPreferencesManager {
    private preferences: UserPreferences;
    private storageKey: string;

    constructor(storageKey: string = 'user_preferences') {
        this.storageKey = storageKey;
        this.preferences = this.loadPreferences();
    }

    private loadPreferences(): UserPreferences {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (!stored) return { ...DEFAULT_PREFERENCES };

            const parsed = JSON.parse(stored);
            return this.validatePreferences(parsed);
        } catch {
            return { ...DEFAULT_PREFERENCES };
        }
    }

    private validatePreferences(data: any): UserPreferences {
        const validated: UserPreferences = { ...DEFAULT_PREFERENCES };

        if (data.theme && ['light', 'dark', 'auto'].includes(data.theme)) {
            validated.theme = data.theme;
        }

        if (data.language && VALID_LANGUAGES.includes(data.language)) {
            validated.language = data.language;
        }

        if (typeof data.notifications === 'boolean') {
            validated.notifications = data.notifications;
        }

        if (typeof data.fontSize === 'number') {
            validated.fontSize = Math.max(MIN_FONT_SIZE, 
                Math.min(MAX_FONT_SIZE, data.fontSize));
        }

        if (typeof data.autoSave === 'boolean') {
            validated.autoSave = data.autoSave;
        }

        return validated;
    }

    private savePreferences(): void {
        localStorage.setItem(this.storageKey, 
            JSON.stringify(this.preferences));
    }

    getPreferences(): Readonly<UserPreferences> {
        return { ...this.preferences };
    }

    updatePreferences(updates: Partial<UserPreferences>): boolean {
        const newPreferences = { ...this.preferences, ...updates };
        const validated = this.validatePreferences(newPreferences);
        
        if (JSON.stringify(this.preferences) !== JSON.stringify(validated)) {
            this.preferences = validated;
            this.savePreferences();
            return true;
        }
        return false;
    }

    resetToDefaults(): void {
        this.preferences = { ...DEFAULT_PREFERENCES };
        this.savePreferences();
    }

    exportPreferences(): string {
        return JSON.stringify(this.preferences, null, 2);
    }

    importPreferences(jsonString: string): boolean {
        try {
            const parsed = JSON.parse(jsonString);
            return this.updatePreferences(parsed);
        } catch {
            return false;
        }
    }
}

export { UserPreferencesManager, type UserPreferences };
```