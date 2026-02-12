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
    const validatedUpdates = this.validateUpdates(updates);
    this.preferences = { ...this.preferences, ...validatedUpdates };
    this.savePreferences();
  }

  private validateUpdates(updates: Partial<UserPreferences>): Partial<UserPreferences> {
    const validated: Partial<UserPreferences> = {};

    if (updates.theme !== undefined && ['light', 'dark', 'auto'].includes(updates.theme)) {
      validated.theme = updates.theme;
    }

    if (updates.notifications !== undefined && typeof updates.notifications === 'boolean') {
      validated.notifications = updates.notifications;
    }

    if (updates.language !== undefined && typeof updates.language === 'string' && updates.language.length >= 2) {
      validated.language = updates.language;
    }

    if (updates.fontSize !== undefined && typeof updates.fontSize === 'number' && updates.fontSize >= 8 && updates.fontSize <= 32) {
      validated.fontSize = updates.fontSize;
    }

    return validated;
  }

  private savePreferences(): void {
    localStorage.setItem(UserPreferencesManager.STORAGE_KEY, JSON.stringify(this.preferences));
  }

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  resetToDefaults(defaults: UserPreferences): void {
    this.preferences = { ...defaults };
    this.savePreferences();
  }
}

const defaultUserPreferences: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en',
  fontSize: 14
};

export { UserPreferencesManager, defaultUserPreferences };
export type { UserPreferences };interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notificationsEnabled: boolean;
  fontSize: number;
}

class UserPreferencesManager {
  private static readonly STORAGE_KEY = 'user_preferences';
  private defaultPreferences: UserPreferences = {
    theme: 'auto',
    language: 'en',
    notificationsEnabled: true,
    fontSize: 14
  };

  private validatePreferences(prefs: Partial<UserPreferences>): UserPreferences {
    const validated: UserPreferences = { ...this.defaultPreferences, ...prefs };
    
    if (!['light', 'dark', 'auto'].includes(validated.theme)) {
      validated.theme = 'auto';
    }
    
    if (typeof validated.language !== 'string' || validated.language.length === 0) {
      validated.language = 'en';
    }
    
    if (typeof validated.notificationsEnabled !== 'boolean') {
      validated.notificationsEnabled = true;
    }
    
    if (typeof validated.fontSize !== 'number' || validated.fontSize < 8 || validated.fontSize > 32) {
      validated.fontSize = 14;
    }
    
    return validated;
  }

  savePreferences(preferences: Partial<UserPreferences>): void {
    const validated = this.validatePreferences(preferences);
    try {
      localStorage.setItem(UserPreferencesManager.STORAGE_KEY, JSON.stringify(validated));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }

  loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(UserPreferencesManager.STORAGE_KEY);
      if (stored) {
        return this.validatePreferences(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }
    return { ...this.defaultPreferences };
  }

  resetToDefaults(): void {
    this.savePreferences(this.defaultPreferences);
  }

  getCurrentTheme(): string {
    const prefs = this.loadPreferences();
    if (prefs.theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return prefs.theme;
  }
}

export { UserPreferencesManager, type UserPreferences };