typescript
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
    this.savePreferences();
    return true;
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

  resetToDefaults(): void {
    this.preferences = { ...UserPreferencesManager.DEFAULT_PREFERENCES };
    this.savePreferences();
  }

  exportPreferences(): string {
    return JSON.stringify(this.preferences, null, 2);
  }

  importPreferences(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      return this.updatePreferences(parsed);
    } catch (error) {
      console.error('Failed to import preferences:', error);
      return false;
    }
  }
}

export { UserPreferencesManager, type UserPreferences };
```