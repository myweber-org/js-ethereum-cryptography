interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notificationsEnabled: boolean;
  fontSize: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  language: 'en',
  notificationsEnabled: true,
  fontSize: 14
};

class UserPreferencesManager {
  private static readonly STORAGE_KEY = 'user_preferences_v1';

  static loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return this.validateAndMerge(parsed);
      }
    } catch (error) {
      console.warn('Failed to load user preferences:', error);
    }
    return { ...DEFAULT_PREFERENCES };
  }

  static savePreferences(prefs: Partial<UserPreferences>): UserPreferences {
    const current = this.loadPreferences();
    const merged = { ...current, ...prefs };
    const validated = this.validateAndMerge(merged);
    
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(validated));
    } catch (error) {
      console.error('Failed to save user preferences:', error);
    }
    
    return validated;
  }

  static resetToDefaults(): UserPreferences {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to reset preferences:', error);
    }
    return { ...DEFAULT_PREFERENCES };
  }

  private static validateAndMerge(data: unknown): UserPreferences {
    const result = { ...DEFAULT_PREFERENCES };
    
    if (data && typeof data === 'object') {
      const obj = data as Record<string, unknown>;
      
      if (['light', 'dark', 'auto'].includes(obj.theme as string)) {
        result.theme = obj.theme as UserPreferences['theme'];
      }
      
      if (typeof obj.language === 'string' && obj.language.length === 2) {
        result.language = obj.language;
      }
      
      if (typeof obj.notificationsEnabled === 'boolean') {
        result.notificationsEnabled = obj.notificationsEnabled;
      }
      
      if (typeof obj.fontSize === 'number' && obj.fontSize >= 8 && obj.fontSize <= 32) {
        result.fontSize = Math.round(obj.fontSize);
      }
    }
    
    return result;
  }
}

export { UserPreferencesManager, type UserPreferences };