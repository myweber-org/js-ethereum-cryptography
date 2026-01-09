typescript
interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
    language: string;
    fontSize: number;
}

class UserPreferencesManager {
    private static readonly STORAGE_KEY = 'user_preferences';
    private static readonly DEFAULT_PREFS: UserPreferences = {
        theme: 'auto',
        notifications: true,
        language: 'en-US',
        fontSize: 16
    };

    private preferences: UserPreferences;

    constructor() {
        this.preferences = this.loadPreferences();
    }

    private loadPreferences(): UserPreferences {
        try {
            const stored = localStorage.getItem(UserPreferencesManager.STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                return this.validatePreferences(parsed);
            }
        } catch (error) {
            console.warn('Failed to load preferences from storage:', error);
        }
        return { ...UserPreferencesManager.DEFAULT_PREFS };
    }

    private validatePreferences(data: any): UserPreferences {
        const validThemes: UserPreferences['theme'][] = ['light', 'dark', 'auto'];
        
        return {
            theme: validThemes.includes(data.theme) ? data.theme : UserPreferencesManager.DEFAULT_PREFS.theme,
            notifications: typeof data.notifications === 'boolean' ? data.notifications : UserPreferencesManager.DEFAULT_PREFS.notifications,
            language: typeof data.language === 'string' ? data.language : UserPreferencesManager.DEFAULT_PREFS.language,
            fontSize: typeof data.fontSize === 'number' && data.fontSize >= 12 && data.fontSize <= 24 
                ? data.fontSize 
                : UserPreferencesManager.DEFAULT_PREFS.fontSize
        };
    }

    updatePreferences(updates: Partial<UserPreferences>): void {
        this.preferences = {
            ...this.preferences,
            ...updates
        };
        this.savePreferences();
    }

    private savePreferences(): void {
        try {
            localStorage.setItem(
                UserPreferencesManager.STORAGE_KEY, 
                JSON.stringify(this.preferences)
            );
        } catch (error) {
            console.error('Failed to save preferences:', error);
        }
    }

    getPreferences(): Readonly<UserPreferences> {
        return { ...this.preferences };
    }

    resetToDefaults(): void {
        this.preferences = { ...UserPreferencesManager.DEFAULT_PREFS };
        this.savePreferences();
    }

    applyPreferences(): void {
        document.documentElement.setAttribute('data-theme', this.preferences.theme);
        document.documentElement.style.fontSize = `${this.preferences.fontSize}px`;
        
        if ('language' in document.documentElement) {
            document.documentElement.lang = this.preferences.language;
        }
    }
}

export { UserPreferencesManager, type UserPreferences };
```