typescript
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notificationsEnabled: boolean;
  fontSize: number;
  autoSave: boolean;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  language: 'en-US',
  notificationsEnabled: true,
  fontSize: 14,
  autoSave: true
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
        return this.validateAndMerge(parsed);
      }
    } catch (error) {
      console.warn('Failed to load preferences from storage:', error);
    }
    return { ...DEFAULT_PREFERENCES };
  }

  private validateAndMerge(partial: Partial<UserPreferences>): UserPreferences {
    const merged = { ...DEFAULT_PREFERENCES, ...partial };
    
    if (!['light', 'dark', 'auto'].includes(merged.theme)) {
      merged.theme = DEFAULT_PREFERENCES.theme;
    }
    
    if (typeof merged.fontSize !== 'number' || merged.fontSize < 8 || merged.fontSize > 32) {
      merged.fontSize = DEFAULT_PREFERENCES.fontSize;
    }
    
    if (typeof merged.notificationsEnabled !== 'boolean') {
      merged.notificationsEnabled = DEFAULT_PREFERENCES.notificationsEnabled;
    }
    
    if (typeof merged.autoSave !== 'boolean') {
      merged.autoSave = DEFAULT_PREFERENCES.autoSave;
    }
    
    return merged;
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): boolean {
    try {
      const newPreferences = this.validateAndMerge({
        ...this.preferences,
        ...updates
      });
      
      this.preferences = newPreferences;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPreferences));
      return true;
    } catch (error) {
      console.error('Failed to update preferences:', error);
      return false;
    }
  }

  resetToDefaults(): boolean {
    return this.updatePreferences(DEFAULT_PREFERENCES);
  }

  getPreference<K extends keyof UserPreferences>(key: K): UserPreferences[K] {
    return this.preferences[key];
  }
}

export const preferencesManager = new UserPreferencesManager();
```