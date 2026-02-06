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
      fontSize: 14
    };
  }

  private validatePreferences(data: any): UserPreferences {
    const validThemes = ['light', 'dark', 'auto'];
    const defaultPrefs = this.getDefaultPreferences();

    return {
      theme: validThemes.includes(data.theme) ? data.theme : defaultPrefs.theme,
      notifications: typeof data.notifications === 'boolean' ? data.notifications : defaultPrefs.notifications,
      language: typeof data.language === 'string' && data.language.length === 2 ? data.language : defaultPrefs.language,
      fontSize: typeof data.fontSize === 'number' && data.fontSize >= 8 && data.fontSize <= 24 ? data.fontSize : defaultPrefs.fontSize
    };
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    this.preferences = {
      ...this.preferences,
      ...updates
    };
    this.savePreferences();
  }

  private savePreferences(): void {
    localStorage.setItem(
      UserPreferencesManager.STORAGE_KEY,
      JSON.stringify(this.preferences)
    );
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  resetToDefaults(): void {
    this.preferences = this.getDefaultPreferences();
    this.savePreferences();
  }

  applyTheme(): void {
    const theme = this.preferences.theme === 'auto' 
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : this.preferences.theme;
    
    document.documentElement.setAttribute('data-theme', theme);
  }
}

export { UserPreferencesManager, type UserPreferences };typescript
interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    notificationsEnabled: boolean;
    fontSize: number;
    autoSaveInterval: number;
}

class UserPreferencesManager {
    private static readonly STORAGE_KEY = 'user_preferences';
    private static readonly DEFAULT_PREFERENCES: UserPreferences = {
        theme: 'auto',
        language: 'en',
        notificationsEnabled: true,
        fontSize: 14,
        autoSaveInterval: 30000
    };

    private preferences: UserPreferences;

    constructor() {
        this.preferences = this.loadPreferences();
    }

    public getPreferences(): UserPreferences {
        return { ...this.preferences };
    }

    public updatePreferences(updates: Partial<UserPreferences>): boolean {
        const newPreferences = { ...this.preferences, ...updates };
        
        if (this.validatePreferences(newPreferences)) {
            this.preferences = newPreferences;
            this.savePreferences();
            return true;
        }
        
        return false;
    }

    public resetToDefaults(): void {
        this.preferences = { ...UserPreferencesManager.DEFAULT_PREFERENCES };
        this.savePreferences();
    }

    private validatePreferences(prefs: UserPreferences): boolean {
        const validThemes = ['light', 'dark', 'auto'];
        const minFontSize = 8;
        const maxFontSize = 72;
        const minAutoSaveInterval = 1000;
        const maxAutoSaveInterval = 300000;

        return (
            validThemes.includes(prefs.theme) &&
            typeof prefs.language === 'string' &&
            prefs.language.length >= 2 &&
            typeof prefs.notificationsEnabled === 'boolean' &&
            prefs.fontSize >= minFontSize &&
            prefs.fontSize <= maxFontSize &&
            prefs.autoSaveInterval >= minAutoSaveInterval &&
            prefs.autoSaveInterval <= maxAutoSaveInterval
        );
    }

    private loadPreferences(): UserPreferences {
        try {
            const stored = localStorage.getItem(UserPreferencesManager.STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                return this.validatePreferences(parsed) 
                    ? parsed 
                    : { ...UserPreferencesManager.DEFAULT_PREFERENCES };
            }
        } catch (error) {
            console.warn('Failed to load user preferences:', error);
        }
        
        return { ...UserPreferencesManager.DEFAULT_PREFERENCES };
    }

    private savePreferences(): void {
        try {
            localStorage.setItem(
                UserPreferencesManager.STORAGE_KEY, 
                JSON.stringify(this.preferences)
            );
        } catch (error) {
            console.error('Failed to save user preferences:', error);
        }
    }
}

export { UserPreferencesManager, type UserPreferences };
```