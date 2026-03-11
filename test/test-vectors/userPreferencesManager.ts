interface UserPreferences {
  theme: 'light' | 'dark';
  fontSize: number;
  notificationsEnabled: boolean;
  language: string;
}

class UserPreferencesManager {
  private static readonly STORAGE_KEY = 'user_preferences';
  private preferences: UserPreferences;
  private listeners: Set<(prefs: UserPreferences) => void> = new Set();

  constructor(defaultPreferences: UserPreferences) {
    const stored = localStorage.getItem(UserPreferencesManager.STORAGE_KEY);
    this.preferences = stored ? JSON.parse(stored) : defaultPreferences;
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    this.preferences = { ...this.preferences, ...updates };
    localStorage.setItem(UserPreferencesManager.STORAGE_KEY, JSON.stringify(this.preferences));
    this.notifyListeners();
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  subscribe(listener: (prefs: UserPreferences) => void): () => void {
    this.listeners.add(listener);
    listener(this.preferences);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.preferences));
  }

  resetToDefaults(defaults: UserPreferences): void {
    this.updatePreferences(defaults);
  }
}

const defaultPrefs: UserPreferences = {
  theme: 'light',
  fontSize: 14,
  notificationsEnabled: true,
  language: 'en-US'
};

export const userPrefsManager = new UserPreferencesManager(defaultPrefs);interface UserPreferences {
  theme: 'light' | 'dark';
  fontSize: number;
  notificationsEnabled: boolean;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'light',
  fontSize: 14,
  notificationsEnabled: true
};

const STORAGE_KEY = 'app_user_preferences';

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
      console.warn('Failed to save preferences to localStorage:', error);
    }
  }

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    this.preferences = { ...this.preferences, ...updates };
    this.savePreferences();
  }

  resetToDefaults(): void {
    this.preferences = { ...DEFAULT_PREFERENCES };
    this.savePreferences();
  }

  getTheme(): 'light' | 'dark' {
    return this.preferences.theme;
  }

  toggleTheme(): void {
    this.preferences.theme = this.preferences.theme === 'light' ? 'dark' : 'light';
    this.savePreferences();
  }
}

export const preferencesManager = new UserPreferencesManager();interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notificationsEnabled: boolean;
  fontSize: number;
}

class UserPreferencesManager {
  private static readonly STORAGE_KEY = 'user_preferences';
  private preferences: UserPreferences;

  constructor(defaultPreferences?: Partial<UserPreferences>) {
    this.preferences = this.loadPreferences();
    
    if (defaultPreferences) {
      this.preferences = { ...this.preferences, ...defaultPreferences };
    }
  }

  private loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(UserPreferencesManager.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load preferences from storage:', error);
    }

    return this.getDefaultPreferences();
  }

  private getDefaultPreferences(): UserPreferences {
    return {
      theme: 'auto',
      language: 'en-US',
      notificationsEnabled: true,
      fontSize: 14
    };
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    const oldPreferences = { ...this.preferences };
    this.preferences = { ...this.preferences, ...updates };
    
    try {
      localStorage.setItem(
        UserPreferencesManager.STORAGE_KEY, 
        JSON.stringify(this.preferences)
      );
      this.notifyPreferencesChange(oldPreferences, this.preferences);
    } catch (error) {
      console.error('Failed to save preferences:', error);
      this.preferences = oldPreferences;
      throw new Error('Preferences update failed');
    }
  }

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  resetToDefaults(): void {
    this.updatePreferences(this.getDefaultPreferences());
  }

  validatePreferences(prefs: Partial<UserPreferences>): boolean {
    if (prefs.theme && !['light', 'dark', 'auto'].includes(prefs.theme)) {
      return false;
    }

    if (prefs.fontSize && (prefs.fontSize < 8 || prefs.fontSize > 32)) {
      return false;
    }

    if (prefs.language && typeof prefs.language !== 'string') {
      return false;
    }

    return true;
  }

  private notifyPreferencesChange(
    oldPrefs: UserPreferences, 
    newPrefs: UserPreferences
  ): void {
    const changes: string[] = [];

    if (oldPrefs.theme !== newPrefs.theme) {
      changes.push(`theme changed from ${oldPrefs.theme} to ${newPrefs.theme}`);
    }

    if (oldPrefs.language !== newPrefs.language) {
      changes.push(`language changed from ${oldPrefs.language} to ${newPrefs.language}`);
    }

    if (oldPrefs.fontSize !== newPrefs.fontSize) {
      changes.push(`font size changed from ${oldPrefs.fontSize} to ${newPrefs.fontSize}`);
    }

    if (changes.length > 0) {
      console.log('Preferences updated:', changes.join(', '));
    }
  }
}

export { UserPreferencesManager, type UserPreferences };