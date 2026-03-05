interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  fontSize: number;
  notificationsEnabled: boolean;
  language: string;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  fontSize: 16,
  notificationsEnabled: true,
  language: 'en-US'
};

class UserPreferencesManager {
  private readonly storageKey = 'user_preferences_v1';

  loadPreferences(): UserPreferences {
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

  savePreferences(prefs: Partial<UserPreferences>): void {
    try {
      const current = this.loadPreferences();
      const updated = { ...current, ...prefs };
      const validated = this.validateAndMerge(updated);
      localStorage.setItem(this.storageKey, JSON.stringify(validated));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }

  resetToDefaults(): void {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error('Failed to reset preferences:', error);
    }
  }

  private validateAndMerge(partial: Partial<UserPreferences>): UserPreferences {
    const result = { ...DEFAULT_PREFERENCES };

    if (partial.theme && ['light', 'dark', 'auto'].includes(partial.theme)) {
      result.theme = partial.theme;
    }

    if (typeof partial.fontSize === 'number' && partial.fontSize >= 8 && partial.fontSize <= 32) {
      result.fontSize = partial.fontSize;
    }

    if (typeof partial.notificationsEnabled === 'boolean') {
      result.notificationsEnabled = partial.notificationsEnabled;
    }

    if (typeof partial.language === 'string' && partial.language.length >= 2) {
      result.language = partial.language;
    }

    return result;
  }
}

export const preferencesManager = new UserPreferencesManager();typescript
interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    notifications: boolean;
    fontSize: number;
    autoSave: boolean;
}

const DEFAULT_PREFERENCES: UserPreferences = {
    theme: 'auto',
    language: 'en',
    notifications: true,
    fontSize: 14,
    autoSave: true
};

const VALID_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja'];
const MIN_FONT_SIZE = 8;
const MAX_FONT_SIZE = 32;

class UserPreferencesManager {
    private preferences: UserPreferences;

    constructor() {
        this.preferences = this.loadPreferences();
    }

    getPreferences(): UserPreferences {
        return { ...this.preferences };
    }

    updatePreferences(updates: Partial<UserPreferences>): boolean {
        const validatedUpdates = this.validateUpdates(updates);
        
        if (Object.keys(validatedUpdates).length === 0) {
            return false;
        }

        this.preferences = { ...this.preferences, ...validatedUpdates };
        this.savePreferences();
        return true;
    }

    resetToDefaults(): void {
        this.preferences = { ...DEFAULT_PREFERENCES };
        this.savePreferences();
    }

    private validateUpdates(updates: Partial<UserPreferences>): Partial<UserPreferences> {
        const validated: Partial<UserPreferences> = {};

        if (updates.theme !== undefined && ['light', 'dark', 'auto'].includes(updates.theme)) {
            validated.theme = updates.theme;
        }

        if (updates.language !== undefined && VALID_LANGUAGES.includes(updates.language)) {
            validated.language = updates.language;
        }

        if (typeof updates.notifications === 'boolean') {
            validated.notifications = updates.notifications;
        }

        if (typeof updates.fontSize === 'number') {
            validated.fontSize = Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, updates.fontSize));
        }

        if (typeof updates.autoSave === 'boolean') {
            validated.autoSave = updates.autoSave;
        }

        return validated;
    }

    private loadPreferences(): UserPreferences {
        try {
            const stored = localStorage.getItem('userPreferences');
            if (stored) {
                const parsed = JSON.parse(stored);
                return this.validatePreferences(parsed);
            }
        } catch (error) {
            console.warn('Failed to load preferences from storage:', error);
        }
        return { ...DEFAULT_PREFERENCES };
    }

    private savePreferences(): void {
        try {
            localStorage.setItem('userPreferences', JSON.stringify(this.preferences));
        } catch (error) {
            console.error('Failed to save preferences:', error);
        }
    }

    private validatePreferences(prefs: any): UserPreferences {
        return {
            theme: ['light', 'dark', 'auto'].includes(prefs.theme) ? prefs.theme : DEFAULT_PREFERENCES.theme,
            language: VALID_LANGUAGES.includes(prefs.language) ? prefs.language : DEFAULT_PREFERENCES.language,
            notifications: typeof prefs.notifications === 'boolean' ? prefs.notifications : DEFAULT_PREFERENCES.notifications,
            fontSize: typeof prefs.fontSize === 'number' 
                ? Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, prefs.fontSize))
                : DEFAULT_PREFERENCES.fontSize,
            autoSave: typeof prefs.autoSave === 'boolean' ? prefs.autoSave : DEFAULT_PREFERENCES.autoSave
        };
    }
}

export { UserPreferencesManager, type UserPreferences };
```