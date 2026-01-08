typescript
interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
    language: string;
    fontSize: number;
}

class UserPreferencesManager {
    private static readonly STORAGE_KEY = 'user_preferences';
    private static readonly DEFAULT_PREFERENCES: UserPreferences = {
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
        return { ...UserPreferencesManager.DEFAULT_PREFERENCES };
    }

    private validatePreferences(data: unknown): UserPreferences {
        const defaults = UserPreferencesManager.DEFAULT_PREFERENCES;
        
        if (!data || typeof data !== 'object') {
            return { ...defaults };
        }

        const validated: UserPreferences = { ...defaults };

        if ('theme' in data && 
            typeof data.theme === 'string' && 
            ['light', 'dark', 'auto'].includes(data.theme)) {
            validated.theme = data.theme as UserPreferences['theme'];
        }

        if ('notifications' in data && typeof data.notifications === 'boolean') {
            validated.notifications = data.notifications;
        }

        if ('language' in data && typeof data.language === 'string') {
            validated.language = data.language;
        }

        if ('fontSize' in data && typeof data.fontSize === 'number') {
            validated.fontSize = Math.max(12, Math.min(24, data.fontSize));
        }

        return validated;
    }

    getPreferences(): UserPreferences {
        return { ...this.preferences };
    }

    updatePreferences(updates: Partial<UserPreferences>): void {
        const newPreferences = { ...this.preferences, ...updates };
        this.preferences = this.validatePreferences(newPreferences);
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

    resetToDefaults(): void {
        this.preferences = { ...UserPreferencesManager.DEFAULT_PREFERENCES };
        this.savePreferences();
    }

    hasValidPreferences(): boolean {
        const current = JSON.stringify(this.preferences);
        const defaults = JSON.stringify(UserPreferencesManager.DEFAULT_PREFERENCES);
        return current !== defaults;
    }
}

export { UserPreferencesManager, type UserPreferences };
```