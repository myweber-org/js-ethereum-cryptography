interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notificationsEnabled: boolean;
  fontSize: number;
}

class UserPreferencesManager {
  private static readonly STORAGE_KEY = 'user_preferences';
  private static readonly DEFAULT_PREFERENCES: UserPreferences = {
    theme: 'auto',
    language: 'en-US',
    notificationsEnabled: true,
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
    const defaultPrefs = UserPreferencesManager.DEFAULT_PREFERENCES;
    
    if (!data || typeof data !== 'object') {
      return { ...defaultPrefs };
    }

    const validated: UserPreferences = { ...defaultPrefs };

    if ('theme' in data && typeof data.theme === 'string') {
      if (['light', 'dark', 'auto'].includes(data.theme)) {
        validated.theme = data.theme as UserPreferences['theme'];
      }
    }

    if ('language' in data && typeof data.language === 'string') {
      validated.language = data.language;
    }

    if ('notificationsEnabled' in data && typeof data.notificationsEnabled === 'boolean') {
      validated.notificationsEnabled = data.notificationsEnabled;
    }

    if ('fontSize' in data && typeof data.fontSize === 'number') {
      validated.fontSize = Math.max(12, Math.min(24, data.fontSize));
    }

    return validated;
  }

  public getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  public updatePreferences(updates: Partial<UserPreferences>): UserPreferences {
    const newPreferences = { ...this.preferences, ...updates };
    this.preferences = this.validatePreferences(newPreferences);
    this.savePreferences();
    return this.getPreferences();
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

  public resetToDefaults(): UserPreferences {
    this.preferences = { ...UserPreferencesManager.DEFAULT_PREFERENCES };
    this.savePreferences();
    return this.getPreferences();
  }

  public isDarkMode(): boolean {
    if (this.preferences.theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return this.preferences.theme === 'dark';
  }
}

export { UserPreferencesManager, type UserPreferences };