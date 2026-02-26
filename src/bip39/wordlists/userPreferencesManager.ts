typescript
interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
    language: string;
    fontSize: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
    theme: 'auto',
    notifications: true,
    language: 'en-US',
    fontSize: 14
};

const STORAGE_KEY = 'user_preferences';

class UserPreferencesManager {
    private preferences: UserPreferences;

    constructor() {
        this.preferences = this.loadPreferences();
    }

    private loadPreferences(): UserPreferences {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                return this.validatePreferences(parsed);
            }
        } catch (error) {
            console.warn('Failed to load preferences from storage:', error);
        }
        return { ...DEFAULT_PREFERENCES };
    }

    private validatePreferences(data: unknown): UserPreferences {
        const result = { ...DEFAULT_PREFERENCES };
        
        if (data && typeof data === 'object') {
            const obj = data as Record<string, unknown>;
            
            if (obj.theme === 'light' || obj.theme === 'dark' || obj.theme === 'auto') {
                result.theme = obj.theme;
            }
            
            if (typeof obj.notifications === 'boolean') {
                result.notifications = obj.notifications;
            }
            
            if (typeof obj.language === 'string' && obj.language.length > 0) {
                result.language = obj.language;
            }
            
            if (typeof obj.fontSize === 'number' && obj.fontSize >= 8 && obj.fontSize <= 32) {
                result.fontSize = obj.fontSize;
            }
        }
        
        return result;
    }

    getPreferences(): UserPreferences {
        return { ...this.preferences };
    }

    updatePreferences(updates: Partial<UserPreferences>): boolean {
        const newPreferences = {
            ...this.preferences,
            ...updates
        };
        
        const validated = this.validatePreferences(newPreferences);
        
        if (JSON.stringify(validated) !== JSON.stringify(this.preferences)) {
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

    private savePreferences(): void {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.preferences));
        } catch (error) {
            console.error('Failed to save preferences:', error);
        }
    }

    getTheme(): string {
        if (this.preferences.theme === 'auto') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return this.preferences.theme;
    }

    isNotificationEnabled(): boolean {
        return this.preferences.notifications && Notification.permission === 'granted';
    }
}

export const preferencesManager = new UserPreferencesManager();
```