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
    if (!data || typeof data !== 'object') {
      return { ...DEFAULT_PREFERENCES };
    }

    const validated: UserPreferences = { ...DEFAULT_PREFERENCES };

    if ('theme' in data && ['light', 'dark', 'auto'].includes(data.theme as string)) {
      validated.theme = data.theme as UserPreferences['theme'];
    }

    if ('notifications' in data && typeof data.notifications === 'boolean') {
      validated.notifications = data.notifications;
    }

    if ('language' in data && typeof data.language === 'string') {
      validated.language = data.language;
    }

    if ('fontSize' in data && typeof data.fontSize === 'number' && data.fontSize >= 8 && data.fontSize <= 32) {
      validated.fontSize = data.fontSize;
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.preferences));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }

  resetToDefaults(): void {
    this.preferences = { ...DEFAULT_PREFERENCES };
    this.savePreferences();
  }

  isDarkMode(): boolean {
    if (this.preferences.theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return this.preferences.theme === 'dark';
  }
}

export const userPreferences = new UserPreferencesManager();typescript
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

        if ('theme' in data && ['light', 'dark', 'auto'].includes(data.theme as string)) {
            validated.theme = data.theme as UserPreferences['theme'];
        }

        if ('notifications' in data && typeof data.notifications === 'boolean') {
            validated.notifications = data.notifications;
        }

        if ('language' in data && typeof data.language === 'string') {
            validated.language = data.language;
        }

        if ('fontSize' in data && typeof data.fontSize === 'number' && data.fontSize >= 8 && data.fontSize <= 32) {
            validated.fontSize = data.fontSize;
        }

        return validated;
    }

    public getPreferences(): UserPreferences {
        return { ...this.preferences };
    }

    public updatePreferences(updates: Partial<UserPreferences>): boolean {
        const newPreferences = { ...this.preferences, ...updates };
        
        if (this.validatePreferences(newPreferences)) {
            this.preferences = newPreferences;
            this.savePreferences();
            return true;
        }
        return false;
    }

    private savePreferences(): void {
        try {
            localStorage.setItem(UserPreferencesManager.STORAGE_KEY, JSON.stringify(this.preferences));
        } catch (error) {
            console.error('Failed to save preferences:', error);
        }
    }

    public resetToDefaults(): void {
        this.preferences = { ...UserPreferencesManager.DEFAULT_PREFERENCES };
        this.savePreferences();
    }

    public isDarkMode(): boolean {
        if (this.preferences.theme === 'auto') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return this.preferences.theme === 'dark';
    }
}

export { UserPreferencesManager, type UserPreferences };
```