interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notificationsEnabled: boolean;
  fontSize: number;
}

class UserPreferencesManager {
  private static readonly STORAGE_KEY = 'user_preferences';
  private static readonly DEFAULT_PREFERENCES: UserPreferences = {
    theme: 'auto',
    language: 'en-US',
    notificationsEnabled: true,
    fontSize: 16
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
      console.warn('Failed to load preferences from storage', error);
    }
    return { ...UserPreferencesManager.DEFAULT_PREFERENCES };
  }

  private validateAndMerge(partial: Partial<UserPreferences>): UserPreferences {
    const merged = { ...UserPreferencesManager.DEFAULT_PREFERENCES, ...partial };
    
    if (!['light', 'dark', 'auto'].includes(merged.theme)) {
      merged.theme = 'auto';
    }
    
    if (typeof merged.fontSize !== 'number' || merged.fontSize < 12 || merged.fontSize > 24) {
      merged.fontSize = 16;
    }
    
    if (typeof merged.notificationsEnabled !== 'boolean') {
      merged.notificationsEnabled = true;
    }
    
    if (typeof merged.language !== 'string' || merged.language.trim().length === 0) {
      merged.language = 'en-US';
    }
    
    return merged;
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    this.preferences = this.validateAndMerge({ ...this.preferences, ...updates });
    this.savePreferences();
  }

  private savePreferences(): void {
    try {
      localStorage.setItem(
        UserPreferencesManager.STORAGE_KEY,
        JSON.stringify(this.preferences)
      );
    } catch (error) {
      console.error('Failed to save preferences to storage', error);
    }
  }

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  resetToDefaults(): void {
    this.preferences = { ...UserPreferencesManager.DEFAULT_PREFERENCES };
    this.savePreferences();
  }

  applyTheme(): void {
    const theme = this.preferences.theme === 'auto' 
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : this.preferences.theme;
    
    document.documentElement.setAttribute('data-theme', theme);
  }

  applyFontSize(): void {
    document.documentElement.style.fontSize = `${this.preferences.fontSize}px`;
  }
}

export { UserPreferencesManager, type UserPreferences };typescript
interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    fontSize: number;
    notificationsEnabled: boolean;
    language: string;
}

const DEFAULT_PREFERENCES: UserPreferences = {
    theme: 'auto',
    fontSize: 16,
    notificationsEnabled: true,
    language: 'en-US'
};

const STORAGE_KEY = 'user_preferences_v1';

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
                return { ...DEFAULT_PREFERENCES, ...parsed };
            }
        } catch (error) {
            console.warn('Failed to load preferences from localStorage:', error);
        }
        return { ...DEFAULT_PREFERENCES };
    }

    private savePreferences(): void {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.preferences));
        } catch (error) {
            console.error('Failed to save preferences to localStorage:', error);
        }
    }

    getPreference<K extends keyof UserPreferences>(key: K): UserPreferences[K] {
        return this.preferences[key];
    }

    setPreference<K extends keyof UserPreferences>(key: K, value: UserPreferences[K]): void {
        this.preferences[key] = value;
        this.savePreferences();
    }

    getAllPreferences(): Readonly<UserPreferences> {
        return { ...this.preferences };
    }

    resetToDefaults(): void {
        this.preferences = { ...DEFAULT_PREFERENCES };
        this.savePreferences();
    }

    clearPreferences(): void {
        try {
            localStorage.removeItem(STORAGE_KEY);
            this.preferences = { ...DEFAULT_PREFERENCES };
        } catch (error) {
            console.error('Failed to clear preferences:', error);
        }
    }
}

export const userPreferences = new UserPreferencesManager();
```interface UserPreferences {
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
    const theme = validThemes.includes(data.theme) ? data.theme : 'auto';
    const notifications = typeof data.notifications === 'boolean' ? data.notifications : true;
    const language = typeof data.language === 'string' ? data.language : 'en';
    const fontSize = typeof data.fontSize === 'number' && data.fontSize >= 10 && data.fontSize <= 24 
      ? data.fontSize 
      : 14;

    return { theme, notifications, language, fontSize };
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    this.preferences = this.validatePreferences({
      ...this.preferences,
      ...updates
    });
    this.savePreferences();
  }

  private savePreferences(): void {
    localStorage.setItem(
      UserPreferencesManager.STORAGE_KEY,
      JSON.stringify(this.preferences)
    );
  }

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  resetToDefaults(): void {
    this.preferences = this.getDefaultPreferences();
    this.savePreferences();
  }

  isDarkMode(): boolean {
    if (this.preferences.theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return this.preferences.theme === 'dark';
  }
}

export { UserPreferencesManager, type UserPreferences };