interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en',
  fontSize: 14
};

class UserPreferencesManager {
  private preferences: UserPreferences;

  constructor() {
    this.preferences = this.loadPreferences();
  }

  private loadPreferences(): UserPreferences {
    const stored = localStorage.getItem('userPreferences');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return this.validatePreferences(parsed);
      } catch {
        return { ...DEFAULT_PREFERENCES };
      }
    }
    return { ...DEFAULT_PREFERENCES };
  }

  private validatePreferences(data: any): UserPreferences {
    return {
      theme: ['light', 'dark', 'auto'].includes(data.theme) ? data.theme : DEFAULT_PREFERENCES.theme,
      notifications: typeof data.notifications === 'boolean' ? data.notifications : DEFAULT_PREFERENCES.notifications,
      language: typeof data.language === 'string' ? data.language : DEFAULT_PREFERENCES.language,
      fontSize: typeof data.fontSize === 'number' && data.fontSize >= 10 && data.fontSize <= 24 
        ? data.fontSize 
        : DEFAULT_PREFERENCES.fontSize
    };
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    this.preferences = {
      ...this.preferences,
      ...this.validatePreferences(updates)
    };
    this.savePreferences();
  }

  private savePreferences(): void {
    localStorage.setItem('userPreferences', JSON.stringify(this.preferences));
  }

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  resetToDefaults(): void {
    this.preferences = { ...DEFAULT_PREFERENCES };
    this.savePreferences();
  }

  isDarkMode(): boolean {
    if (this.preferences.theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return this.preferences.theme === 'dark';
  }
}

export const preferencesManager = new UserPreferencesManager();typescript
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notificationsEnabled: boolean;
  fontSize: number;
  autoSave: boolean;
}

class UserPreferencesManager {
  private static readonly STORAGE_KEY = 'user_preferences';
  private static readonly DEFAULT_PREFERENCES: UserPreferences = {
    theme: 'auto',
    language: 'en-US',
    notificationsEnabled: true,
    fontSize: 14,
    autoSave: false
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
        return this.validateAndMerge(parsed);
      }
    } catch (error) {
      console.warn('Failed to load preferences from storage:', error);
    }
    return { ...UserPreferencesManager.DEFAULT_PREFERENCES };
  }

  private validateAndMerge(partial: Partial<UserPreferences>): UserPreferences {
    const merged = { ...UserPreferencesManager.DEFAULT_PREFERENCES, ...partial };
    
    if (!['light', 'dark', 'auto'].includes(merged.theme)) {
      merged.theme = UserPreferencesManager.DEFAULT_PREFERENCES.theme;
    }
    
    if (typeof merged.fontSize !== 'number' || merged.fontSize < 8 || merged.fontSize > 32) {
      merged.fontSize = UserPreferencesManager.DEFAULT_PREFERENCES.fontSize;
    }
    
    if (typeof merged.notificationsEnabled !== 'boolean') {
      merged.notificationsEnabled = UserPreferencesManager.DEFAULT_PREFERENCES.notificationsEnabled;
    }
    
    if (typeof merged.autoSave !== 'boolean') {
      merged.autoSave = UserPreferencesManager.DEFAULT_PREFERENCES.autoSave;
    }
    
    return merged;
  }

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): boolean {
    const newPreferences = this.validateAndMerge({ ...this.preferences, ...updates });
    
    if (JSON.stringify(this.preferences) === JSON.stringify(newPreferences)) {
      return false;
    }
    
    this.preferences = newPreferences;
    
    try {
      localStorage.setItem(UserPreferencesManager.STORAGE_KEY, JSON.stringify(this.preferences));
      return true;
    } catch (error) {
      console.error('Failed to save preferences:', error);
      return false;
    }
  }

  resetToDefaults(): boolean {
    this.preferences = { ...UserPreferencesManager.DEFAULT_PREFERENCES };
    
    try {
      localStorage.removeItem(UserPreferencesManager.STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Failed to reset preferences:', error);
      return false;
    }
  }

  hasCustomPreferences(): boolean {
    return JSON.stringify(this.preferences) !== 
           JSON.stringify(UserPreferencesManager.DEFAULT_PREFERENCES);
  }
}

export { UserPreferencesManager, type UserPreferences };
```