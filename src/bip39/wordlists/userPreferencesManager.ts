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
        language: 'en-US',
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

        if ('theme' in data && this.isValidTheme(data.theme)) {
            validated.theme = data.theme;
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

        if (updates.theme !== undefined && this.isValidTheme(updates.theme)) {
            validated.theme = updates.theme;
        }

        if (updates.language !== undefined && typeof updates.language === 'string') {
            validated.language = updates.language;
        }

        if (updates.notifications !== undefined && typeof updates.notifications === 'boolean') {
            validated.notifications = updates.notifications;
        }

        if (updates.fontSize !== undefined && typeof updates.fontSize === 'number' && updates.fontSize >= 8 && updates.fontSize <= 32) {
            validated.fontSize = updates.fontSize;
        }

        if (updates.autoSave !== undefined && typeof updates.autoSave === 'boolean') {
            validated.autoSave = updates.autoSave;
        }

        return validated;
    }

    private isValidTheme(theme: unknown): theme is UserPreferences['theme'] {
        return theme === 'light' || theme === 'dark' || theme === 'auto';
    }
}

export { UserPreferencesManager, type UserPreferences };
```
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  fontSize: number;
  language: string;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  notifications: true,
  fontSize: 16,
  language: 'en-US'
};

const VALID_LANGUAGES = ['en-US', 'es-ES', 'fr-FR', 'de-DE'];

class PreferencesManager {
  private preferences: UserPreferences;

  constructor(initialPreferences?: Partial<UserPreferences>) {
    this.preferences = { ...DEFAULT_PREFERENCES, ...initialPreferences };
    this.validateAndSanitize();
  }

  private validateAndSanitize(): void {
    if (!['light', 'dark', 'auto'].includes(this.preferences.theme)) {
      this.preferences.theme = DEFAULT_PREFERENCES.theme;
    }

    if (typeof this.preferences.notifications !== 'boolean') {
      this.preferences.notifications = DEFAULT_PREFERENCES.notifications;
    }

    if (typeof this.preferences.fontSize !== 'number' || 
        this.preferences.fontSize < 8 || 
        this.preferences.fontSize > 32) {
      this.preferences.fontSize = DEFAULT_PREFERENCES.fontSize;
    }

    if (!VALID_LANGUAGES.includes(this.preferences.language)) {
      this.preferences.language = DEFAULT_PREFERENCES.language;
    }
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    this.preferences = { ...this.preferences, ...updates };
    this.validateAndSanitize();
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  resetToDefaults(): void {
    this.preferences = { ...DEFAULT_PREFERENCES };
  }

  exportAsJSON(): string {
    return JSON.stringify(this.preferences, null, 2);
  }

  static importFromJSON(jsonString: string): PreferencesManager {
    try {
      const parsed = JSON.parse(jsonString);
      return new PreferencesManager(parsed);
    } catch {
      return new PreferencesManager();
    }
  }
}

export { PreferencesManager, type UserPreferences };