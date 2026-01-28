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
      console.warn('Failed to load preferences from storage', error);
    }
    return { ...DEFAULT_PREFERENCES };
  }

  private validatePreferences(data: unknown): UserPreferences {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid preferences data');
    }

    const prefs = data as Partial<UserPreferences>;
    
    return {
      theme: this.validateTheme(prefs.theme),
      language: this.validateLanguage(prefs.language),
      notificationsEnabled: this.validateBoolean(prefs.notificationsEnabled, DEFAULT_PREFERENCES.notificationsEnabled),
      fontSize: this.validateFontSize(prefs.fontSize)
    };
  }

  private validateTheme(theme: unknown): UserPreferences['theme'] {
    if (theme === 'light' || theme === 'dark' || theme === 'auto') {
      return theme;
    }
    return DEFAULT_PREFERENCES.theme;
  }

  private validateLanguage(language: unknown): string {
    if (typeof language === 'string' && language.length >= 2) {
      return language;
    }
    return DEFAULT_PREFERENCES.language;
  }

  private validateBoolean(value: unknown, defaultValue: boolean): boolean {
    if (typeof value === 'boolean') {
      return value;
    }
    return defaultValue;
  }

  private validateFontSize(size: unknown): number {
    if (typeof size === 'number' && size >= 8 && size <= 32) {
      return Math.round(size);
    }
    return DEFAULT_PREFERENCES.fontSize;
  }

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    const newPreferences = {
      ...this.preferences,
      ...updates
    };

    this.preferences = this.validatePreferences(newPreferences);
    this.savePreferences();
  }

  private savePreferences(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.preferences));
    } catch (error) {
      console.error('Failed to save preferences to storage', error);
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