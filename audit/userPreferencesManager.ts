typescript
interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
    language: string;
    resultsPerPage: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
    theme: 'auto',
    notifications: true,
    language: 'en-US',
    resultsPerPage: 20
};

const VALID_LANGUAGES = ['en-US', 'es-ES', 'fr-FR', 'de-DE'];
const VALID_RESULTS_PER_PAGE = [10, 20, 50, 100];

class UserPreferencesManager {
    private preferences: UserPreferences;

    constructor(initialPreferences?: Partial<UserPreferences>) {
        this.preferences = { ...DEFAULT_PREFERENCES, ...initialPreferences };
        this.validateAndFixPreferences();
    }

    private validateAndFixPreferences(): void {
        if (!['light', 'dark', 'auto'].includes(this.preferences.theme)) {
            this.preferences.theme = DEFAULT_PREFERENCES.theme;
        }

        if (typeof this.preferences.notifications !== 'boolean') {
            this.preferences.notifications = DEFAULT_PREFERENCES.notifications;
        }

        if (!VALID_LANGUAGES.includes(this.preferences.language)) {
            this.preferences.language = DEFAULT_PREFERENCES.language;
        }

        if (!VALID_RESULTS_PER_PAGE.includes(this.preferences.resultsPerPage)) {
            this.preferences.resultsPerPage = DEFAULT_PREFERENCES.resultsPerPage;
        }
    }

    updatePreferences(updates: Partial<UserPreferences>): void {
        this.preferences = { ...this.preferences, ...updates };
        this.validateAndFixPreferences();
    }

    getPreferences(): UserPreferences {
        return { ...this.preferences };
    }

    resetToDefaults(): void {
        this.preferences = { ...DEFAULT_PREFERENCES };
    }

    isDarkMode(): boolean {
        if (this.preferences.theme === 'auto') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return this.preferences.theme === 'dark';
    }
}

export { UserPreferencesManager, type UserPreferences };
```