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

class PreferencesManager {
  private storageKey = 'user_preferences';
  private currentPreferences: UserPreferences;

  constructor() {
    this.currentPreferences = this.loadPreferences();
  }

  private loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        return this.validatePreferences(parsed);
      }
    } catch (error) {
      console.warn('Failed to load preferences:', error);
    }
    return { ...DEFAULT_PREFERENCES };
  }

  private validatePreferences(data: unknown): UserPreferences {
    const preferences = { ...DEFAULT_PREFERENCES };
    
    if (data && typeof data === 'object') {
      const obj = data as Record<string, unknown>;
      
      if (['light', 'dark', 'auto'].includes(obj.theme as string)) {
        preferences.theme = obj.theme as UserPreferences['theme'];
      }
      
      if (typeof obj.notifications === 'boolean') {
        preferences.notifications = obj.notifications;
      }
      
      if (typeof obj.language === 'string' && obj.language.length >= 2) {
        preferences.language = obj.language;
      }
      
      if (typeof obj.fontSize === 'number' && obj.fontSize >= 8 && obj.fontSize <= 32) {
        preferences.fontSize = obj.fontSize;
      }
    }
    
    return preferences;
  }

  getPreferences(): UserPreferences {
    return { ...this.currentPreferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): boolean {
    const newPreferences = {
      ...this.currentPreferences,
      ...updates
    };
    
    const validated = this.validatePreferences(newPreferences);
    
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(validated));
      this.currentPreferences = validated;
      return true;
    } catch (error) {
      console.error('Failed to save preferences:', error);
      return false;
    }
  }

  resetToDefaults(): boolean {
    return this.updatePreferences(DEFAULT_PREFERENCES);
  }

  getPreference<K extends keyof UserPreferences>(key: K): UserPreferences[K] {
    return this.currentPreferences[key];
  }
}

export const preferencesManager = new PreferencesManager();