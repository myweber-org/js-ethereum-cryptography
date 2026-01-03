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

class UserPreferencesManager {
  private static STORAGE_KEY = 'user_preferences_v1';

  static loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...DEFAULT_PREFERENCES, ...parsed };
      }
    } catch (error) {
      console.warn('Failed to load user preferences:', error);
    }
    return { ...DEFAULT_PREFERENCES };
  }

  static savePreferences(preferences: Partial<UserPreferences>): UserPreferences {
    const current = this.loadPreferences();
    const updated = { ...current, ...preferences };
    
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save user preferences:', error);
    }
    
    return updated;
  }

  static resetToDefaults(): UserPreferences {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to reset preferences:', error);
    }
    return { ...DEFAULT_PREFERENCES };
  }

  static getPreference<K extends keyof UserPreferences>(key: K): UserPreferences[K] {
    const prefs = this.loadPreferences();
    return prefs[key];
  }
}

export { UserPreferencesManager, DEFAULT_PREFERENCES };
export type { UserPreferences };