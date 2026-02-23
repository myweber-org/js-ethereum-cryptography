
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

  constructor() {
    this.preferences = this.loadPreferences();
  }

  private loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem('userPreferences');
      if (stored) {
        const parsed = JSON.parse(stored);
        return this.validateAndMerge(parsed);
      }
    } catch (error) {
      console.warn('Failed to load preferences from storage:', error);
    }
    return { ...DEFAULT_PREFERENCES };
  }

  private validateAndMerge(partialPrefs: Partial<UserPreferences>): UserPreferences {
    const merged = { ...DEFAULT_PREFERENCES, ...partialPrefs };

    if (!['light', 'dark', 'auto'].includes(merged.theme)) {
      merged.theme = DEFAULT_PREFERENCES.theme;
    }

    if (typeof merged.notifications !== 'boolean') {
      merged.notifications = DEFAULT_PREFERENCES.notifications;
    }

    if (typeof merged.fontSize !== 'number' || merged.fontSize < 12 || merged.fontSize > 24) {
      merged.fontSize = DEFAULT_PREFERENCES.fontSize;
    }

    if (!VALID_LANGUAGES.includes(merged.language)) {
      merged.language = DEFAULT_PREFERENCES.language;
    }

    return merged;
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    this.preferences = this.validateAndMerge(updates);
    this.savePreferences();
  }

  private savePreferences(): void {
    try {
      localStorage.setItem('userPreferences', JSON.stringify(this.preferences));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  resetToDefaults(): void {
    this.preferences = { ...DEFAULT_PREFERENCES };
    this.savePreferences();
  }
}

export const preferencesManager = new PreferencesManager();
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
  fontSize: 16
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
    const prefs = { ...DEFAULT_PREFERENCES };

    if (data && typeof data === 'object') {
      const obj = data as Record<string, unknown>;

      if (obj.theme && ['light', 'dark', 'auto'].includes(obj.theme as string)) {
        prefs.theme = obj.theme as UserPreferences['theme'];
      }

      if (obj.language && typeof obj.language === 'string') {
        prefs.language = obj.language;
      }

      if (typeof obj.notificationsEnabled === 'boolean') {
        prefs.notificationsEnabled = obj.notificationsEnabled;
      }

      if (typeof obj.fontSize === 'number' && obj.fontSize >= 12 && obj.fontSize <= 24) {
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

  isDarkMode(): boolean {
    if (this.preferences.theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return this.preferences.theme === 'dark';
  }
}

export const userPreferences = new UserPreferencesManager();