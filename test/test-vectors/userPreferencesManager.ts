interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class UserPreferencesManager {
  private static readonly STORAGE_KEY = 'user_preferences';
  private preferences: UserPreferences;

  constructor(defaultPreferences: UserPreferences) {
    this.preferences = this.loadPreferences() || defaultPreferences;
  }

  private loadPreferences(): UserPreferences | null {
    try {
      const stored = localStorage.getItem(UserPreferencesManager.STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    this.preferences = { ...this.preferences, ...updates };
    this.validatePreferences();
    this.savePreferences();
  }

  private validatePreferences(): void {
    if (this.preferences.fontSize < 12 || this.preferences.fontSize > 24) {
      throw new Error('Font size must be between 12 and 24');
    }

    const validLanguages = ['en', 'es', 'fr', 'de'];
    if (!validLanguages.includes(this.preferences.language)) {
      throw new Error('Invalid language selection');
    }
  }

  private savePreferences(): void {
    localStorage.setItem(
      UserPreferencesManager.STORAGE_KEY,
      JSON.stringify(this.preferences)
    );
  }

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  resetToDefaults(defaults: UserPreferences): void {
    this.preferences = defaults;
    this.savePreferences();
  }
}

export { UserPreferencesManager, type UserPreferences };interface UserPreferences {
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

class UserPreferencesManager {
  private static readonly STORAGE_KEY = 'user_preferences';

  static loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return { ...DEFAULT_PREFERENCES };

      const parsed = JSON.parse(stored);
      return this.validateAndMerge(parsed);
    } catch {
      return { ...DEFAULT_PREFERENCES };
    }
  }

  static savePreferences(prefs: Partial<UserPreferences>): void {
    const current = this.loadPreferences();
    const updated = { ...current, ...prefs };
    
    if (this.validatePreferences(updated)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    }
  }

  static resetToDefaults(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  private static validateAndMerge(partial: any): UserPreferences {
    const result = { ...DEFAULT_PREFERENCES };
    
    if (typeof partial.theme === 'string' && ['light', 'dark', 'auto'].includes(partial.theme)) {
      result.theme = partial.theme;
    }
    
    if (typeof partial.language === 'string') {
      result.language = partial.language;
    }
    
    if (typeof partial.notificationsEnabled === 'boolean') {
      result.notificationsEnabled = partial.notificationsEnabled;
    }
    
    if (typeof partial.fontSize === 'number' && partial.fontSize >= 8 && partial.fontSize <= 32) {
      result.fontSize = partial.fontSize;
    }
    
    return result;
  }

  private static validatePreferences(prefs: UserPreferences): boolean {
    return (
      ['light', 'dark', 'auto'].includes(prefs.theme) &&
      typeof prefs.language === 'string' &&
      typeof prefs.notificationsEnabled === 'boolean' &&
      typeof prefs.fontSize === 'number' &&
      prefs.fontSize >= 8 &&
      prefs.fontSize <= 32
    );
  }
}

export { UserPreferencesManager, type UserPreferences };