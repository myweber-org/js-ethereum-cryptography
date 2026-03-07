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
    language: 'en',
    fontSize: 14
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
      console.warn('Failed to load preferences from storage', error);
    }
    return { ...UserPreferencesManager.DEFAULT_PREFS };
  }

  private validatePreferences(data: unknown): UserPreferences {
    const prefs = { ...UserPreferencesManager.DEFAULT_PREFS };

    if (data && typeof data === 'object') {
      const obj = data as Record<string, unknown>;

      if (obj.theme === 'light' || obj.theme === 'dark' || obj.theme === 'auto') {
        prefs.theme = obj.theme;
      }

      if (typeof obj.notifications === 'boolean') {
        prefs.notifications = obj.notifications;
      }

      if (typeof obj.language === 'string' && obj.language.length === 2) {
        prefs.language = obj.language;
      }

      if (typeof obj.fontSize === 'number' && obj.fontSize >= 10 && obj.fontSize <= 24) {
        prefs.fontSize = obj.fontSize;
      }
    }

    return prefs;
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
      console.error('Failed to save preferences to storage', error);
    }
  }

  resetToDefaults(): void {
    this.preferences = { ...UserPreferencesManager.DEFAULT_PREFS };
    this.savePreferences();
  }

  hasValidPreferences(): boolean {
    const current = JSON.stringify(this.preferences);
    const defaults = JSON.stringify(UserPreferencesManager.DEFAULT_PREFS);
    return current !== defaults;
  }
}

export { UserPreferencesManager, type UserPreferences };
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notificationsEnabled: boolean;
  fontSize: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  language: 'en-US',
  notificationsEnabled: true,
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

    const prefs = data as Partial<UserPreferences>;
    
    return {
      theme: this.isValidTheme(prefs.theme) ? prefs.theme : DEFAULT_PREFERENCES.theme,
      language: typeof prefs.language === 'string' ? prefs.language : DEFAULT_PREFERENCES.language,
      notificationsEnabled: typeof prefs.notificationsEnabled === 'boolean' 
        ? prefs.notificationsEnabled 
        : DEFAULT_PREFERENCES.notificationsEnabled,
      fontSize: typeof prefs.fontSize === 'number' && prefs.fontSize >= 8 && prefs.fontSize <= 32
        ? prefs.fontSize
        : DEFAULT_PREFERENCES.fontSize
    };
  }

  private isValidTheme(theme: unknown): theme is UserPreferences['theme'] {
    return theme === 'light' || theme === 'dark' || theme === 'auto';
  }

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): boolean {
    const newPreferences = {
      ...this.preferences,
      ...updates
    };

    const validated = this.validatePreferences(newPreferences);
    
    if (JSON.stringify(this.preferences) !== JSON.stringify(validated)) {
      this.preferences = validated;
      this.savePreferences();
      return true;
    }
    
    return false;
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

  getTheme(): UserPreferences['theme'] {
    return this.preferences.theme;
  }

  setTheme(theme: UserPreferences['theme']): void {
    this.updatePreferences({ theme });
  }

  toggleNotifications(): void {
    this.updatePreferences({ 
      notificationsEnabled: !this.preferences.notificationsEnabled 
    });
  }

  increaseFontSize(): void {
    const newSize = Math.min(this.preferences.fontSize + 1, 32);
    this.updatePreferences({ fontSize: newSize });
  }

  decreaseFontSize(): void {
    const newSize = Math.max(this.preferences.fontSize - 1, 8);
    this.updatePreferences({ fontSize: newSize });
  }
}

export const userPreferences = new UserPreferencesManager();typescript
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
            if (stored) {
                const parsed = JSON.parse(stored);
                return this.validatePreferences(parsed);
            }
        } catch (error) {
            console.warn('Failed to load preferences:', error);
        }
        return { ...DEFAULT_PREFERENCES };
    }

    private validatePreferences(prefs: any): UserPreferences {
        const validated: UserPreferences = { ...DEFAULT_PREFERENCES };

        if (typeof prefs.theme === 'string' && ['light', 'dark', 'auto'].includes(prefs.theme)) {
            validated.theme = prefs.theme;
        }

        if (typeof prefs.notifications === 'boolean') {
            validated.notifications = prefs.notifications;
        }

        if (typeof prefs.language === 'string' && VALID_LANGUAGES.includes(prefs.language)) {
            validated.language = prefs.language;
        }

        if (typeof prefs.fontSize === 'number') {
            validated.fontSize = Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, prefs.fontSize));
        }

        return validated;
    }

    getPreferences(): UserPreferences {
        return { ...this.preferences };
    }

    updatePreferences(updates: Partial<UserPreferences>): boolean {
        const newPreferences = { ...this.preferences, ...updates };
        const validated = this.validatePreferences(newPreferences);

        try {
            localStorage.setItem('userPreferences', JSON.stringify(validated));
            this.preferences = validated;
            this.applyPreferences();
            return true;
        } catch (error) {
            console.error('Failed to save preferences:', error);
            return false;
        }
    }

    resetToDefaults(): boolean {
        return this.updatePreferences(DEFAULT_PREFERENCES);
    }

    private applyPreferences(): void {
        document.documentElement.setAttribute('data-theme', this.preferences.theme);
        document.documentElement.style.fontSize = `${this.preferences.fontSize}px`;
    }
}

export const preferencesManager = new UserPreferencesManager();
```