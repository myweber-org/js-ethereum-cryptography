typescript
interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    notifications: boolean;
    fontSize: number;
    autoSave: boolean;
}

class UserPreferencesManager {
    private static readonly STORAGE_KEY = 'user_preferences';
    private static readonly DEFAULT_PREFERENCES: UserPreferences = {
        theme: 'auto',
        language: 'en',
        notifications: true,
        fontSize: 14,
        autoSave: true
    };

    private preferences: UserPreferences;

    constructor() {
        this.preferences = this.loadPreferences();
    }

    public getPreferences(): UserPreferences {
        return { ...this.preferences };
    }

    public updatePreferences(updates: Partial<UserPreferences>): void {
        const validatedUpdates = this.validateUpdates(updates);
        this.preferences = { ...this.preferences, ...validatedUpdates };
        this.savePreferences();
    }

    public resetToDefaults(): void {
        this.preferences = { ...UserPreferencesManager.DEFAULT_PREFERENCES };
        this.savePreferences();
    }

    private loadPreferences(): UserPreferences {
        try {
            const stored = localStorage.getItem(UserPreferencesManager.STORAGE_KEY);
            if (!stored) return { ...UserPreferencesManager.DEFAULT_PREFERENCES };

            const parsed = JSON.parse(stored);
            return this.validatePreferences(parsed);
        } catch {
            return { ...UserPreferencesManager.DEFAULT_PREFERENCES };
        }
    }

    private savePreferences(): void {
        localStorage.setItem(
            UserPreferencesManager.STORAGE_KEY,
            JSON.stringify(this.preferences)
        );
    }

    private validatePreferences(data: unknown): UserPreferences {
        const base = { ...UserPreferencesManager.DEFAULT_PREFERENCES };

        if (typeof data !== 'object' || data === null) {
            return base;
        }

        const validated = { ...base };

        if ('theme' in data && ['light', 'dark', 'auto'].includes(data.theme as string)) {
            validated.theme = data.theme as UserPreferences['theme'];
        }

        if ('language' in data && typeof data.language === 'string') {
            validated.language = data.language;
        }

        if ('notifications' in data && typeof data.notifications === 'boolean') {
            validated.notifications = data.notifications;
        }

        if ('fontSize' in data && typeof data.fontSize === 'number' && data.fontSize >= 8 && data.fontSize <= 32) {
            validated.fontSize = data.fontSize;
        }

        if ('autoSave' in data && typeof data.autoSave === 'boolean') {
            validated.autoSave = data.autoSave;
        }

        return validated;
    }

    private validateUpdates(updates: Partial<UserPreferences>): Partial<UserPreferences> {
        const validated: Partial<UserPreferences> = {};

        if (updates.theme && ['light', 'dark', 'auto'].includes(updates.theme)) {
            validated.theme = updates.theme;
        }

        if (updates.language && typeof updates.language === 'string') {
            validated.language = updates.language;
        }

        if (typeof updates.notifications === 'boolean') {
            validated.notifications = updates.notifications;
        }

        if (typeof updates.fontSize === 'number' && updates.fontSize >= 8 && updates.fontSize <= 32) {
            validated.fontSize = updates.fontSize;
        }

        if (typeof updates.autoSave === 'boolean') {
            validated.autoSave = updates.autoSave;
        }

        return validated;
    }
}

export { UserPreferencesManager, type UserPreferences };
```