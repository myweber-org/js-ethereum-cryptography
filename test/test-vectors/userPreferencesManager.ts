interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class UserPreferencesManager {
  private static readonly STORAGE_KEY = 'user_preferences';
  private preferences: UserPreferences;

  constructor() {
    this.preferences = this.loadPreferences();
  }

  private loadPreferences(): UserPreferences {
    const stored = localStorage.getItem(UserPreferencesManager.STORAGE_KEY);
    if (stored) {
      try {
        return this.validatePreferences(JSON.parse(stored));
      } catch {
        return this.getDefaultPreferences();
      }
    }
    return this.getDefaultPreferences();
  }

  private getDefaultPreferences(): UserPreferences {
    return {
      theme: 'auto',
      notifications: true,
      language: 'en',
      fontSize: 16
    };
  }

  private validatePreferences(data: unknown): UserPreferences {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid preferences data');
    }

    const prefs = data as Partial<UserPreferences>;
    
    const theme = prefs.theme && ['light', 'dark', 'auto'].includes(prefs.theme) 
      ? prefs.theme 
      : 'auto';
    
    const notifications = typeof prefs.notifications === 'boolean' 
      ? prefs.notifications 
      : true;
    
    const language = typeof prefs.language === 'string' 
      ? prefs.language 
      : 'en';
    
    const fontSize = typeof prefs.fontSize === 'number' && prefs.fontSize >= 8 && prefs.fontSize <= 32
      ? prefs.fontSize
      : 16;

    return { theme, notifications, language, fontSize };
  }

  public getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  public updatePreferences(updates: Partial<UserPreferences>): void {
    const newPreferences = { ...this.preferences, ...updates };
    this.preferences = this.validatePreferences(newPreferences);
    this.savePreferences();
  }

  private savePreferences(): void {
    localStorage.setItem(
      UserPreferencesManager.STORAGE_KEY, 
      JSON.stringify(this.preferences)
    );
  }

  public resetToDefaults(): void {
    this.preferences = this.getDefaultPreferences();
    this.savePreferences();
  }

  public applyPreferences(): void {
    document.documentElement.setAttribute('data-theme', this.preferences.theme);
    document.documentElement.style.fontSize = `${this.preferences.fontSize}px`;
  }
}

export { UserPreferencesManager, type UserPreferences };typescript
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
    language: 'en',
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

    const prefs = data as Record<string, unknown>;
    
    return {
      theme: this.isValidTheme(prefs.theme) ? prefs.theme as UserPreferences['theme'] : defaultPrefs.theme,
      language: typeof prefs.language === 'string' ? prefs.language : defaultPrefs.language,
      notificationsEnabled: typeof prefs.notificationsEnabled === 'boolean' 
        ? prefs.notificationsEnabled 
        : defaultPrefs.notificationsEnabled,
      fontSize: typeof prefs.fontSize === 'number' && prefs.fontSize >= 8 && prefs.fontSize <= 32
        ? prefs.fontSize
        : defaultPrefs.fontSize,
      autoSave: typeof prefs.autoSave === 'boolean' ? prefs.autoSave : defaultPrefs.autoSave
    };
  }

  private isValidTheme(theme: unknown): theme is UserPreferences['theme'] {
    return theme === 'light' || theme === 'dark' || theme === 'auto';
  }

  public getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  public updatePreferences(updates: Partial<UserPreferences>): void {
    const newPreferences = { ...this.preferences, ...updates };
    this.preferences = this.validatePreferences(newPreferences);
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

  public resetToDefaults(): void {
    this.preferences = { ...UserPreferencesManager.DEFAULT_PREFERENCES };
    this.savePreferences();
  }

  public exportPreferences(): string {
    return JSON.stringify(this.preferences, null, 2);
  }

  public importPreferences(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      this.preferences = this.validatePreferences(parsed);
      this.savePreferences();
      return true;
    } catch (error) {
      console.error('Failed to import preferences:', error);
      return false;
    }
  }
}

// Usage example
const preferencesManager = new UserPreferencesManager();

// Get current preferences
const currentPrefs = preferencesManager.getPreferences();
console.log('Current preferences:', currentPrefs);

// Update some preferences
preferencesManager.updatePreferences({ theme: 'dark', fontSize: 16 });

// Reset to defaults if needed
if (confirm('Reset to default preferences?')) {
  preferencesManager.resetToDefaults();
}
```