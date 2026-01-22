typescript
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: boolean;
  fontSize: number;
  autoSave: boolean;
}

class UserPreferencesManager {
  private static readonly STORAGE_KEY = 'user_preferences';
  private static readonly DEFAULT_PREFERENCES: UserPreferences = {
    theme: 'auto',
    language: 'en',
    notifications: true,
    fontSize: 14,
    autoSave: true
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
    const validated = { ...UserPreferencesManager.DEFAULT_PREFERENCES };
    
    if (data && typeof data === 'object') {
      const obj = data as Record<string, unknown>;
      
      if (obj.theme === 'light' || obj.theme === 'dark' || obj.theme === 'auto') {
        validated.theme = obj.theme;
      }
      
      if (typeof obj.language === 'string') {
        validated.language = obj.language;
      }
      
      if (typeof obj.notifications === 'boolean') {
        validated.notifications = obj.notifications;
      }
      
      if (typeof obj.fontSize === 'number' && obj.fontSize >= 8 && obj.fontSize <= 24) {
        validated.fontSize = obj.fontSize;
      }
      
      if (typeof obj.autoSave === 'boolean') {
        validated.autoSave = obj.autoSave;
      }
    }
    
    return validated;
  }

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): boolean {
    const newPreferences = { ...this.preferences };
    let changed = false;

    if (updates.theme && (updates.theme === 'light' || updates.theme === 'dark' || updates.theme === 'auto')) {
      newPreferences.theme = updates.theme;
      changed = true;
    }

    if (updates.language && typeof updates.language === 'string') {
      newPreferences.language = updates.language;
      changed = true;
    }

    if (typeof updates.notifications === 'boolean') {
      newPreferences.notifications = updates.notifications;
      changed = true;
    }

    if (typeof updates.fontSize === 'number' && updates.fontSize >= 8 && updates.fontSize <= 24) {
      newPreferences.fontSize = updates.fontSize;
      changed = true;
    }

    if (typeof updates.autoSave === 'boolean') {
      newPreferences.autoSave = updates.autoSave;
      changed = true;
    }

    if (changed) {
      this.preferences = newPreferences;
      this.savePreferences();
    }

    return changed;
  }

  resetToDefaults(): void {
    this.preferences = { ...UserPreferencesManager.DEFAULT_PREFERENCES };
    this.savePreferences();
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

  exportPreferences(): string {
    return JSON.stringify(this.preferences, null, 2);
  }

  importPreferences(json: string): boolean {
    try {
      const parsed = JSON.parse(json);
      const validated = this.validatePreferences(parsed);
      this.preferences = validated;
      this.savePreferences();
      return true;
    } catch (error) {
      console.error('Failed to import preferences:', error);
      return false;
    }
  }
}

export { UserPreferencesManager, type UserPreferences };
```