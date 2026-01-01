interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notificationsEnabled: boolean;
  fontSize: number;
}

class UserPreferencesManager {
  private static readonly STORAGE_KEY = 'user_preferences';
  private defaultPreferences: UserPreferences = {
    theme: 'auto',
    language: 'en-US',
    notificationsEnabled: true,
    fontSize: 16
  };

  private validatePreferences(prefs: Partial<UserPreferences>): UserPreferences {
    const validated: UserPreferences = { ...this.defaultPreferences, ...prefs };
    
    if (!['light', 'dark', 'auto'].includes(validated.theme)) {
      validated.theme = 'auto';
    }
    
    if (typeof validated.language !== 'string' || validated.language.trim() === '') {
      validated.language = 'en-US';
    }
    
    if (typeof validated.notificationsEnabled !== 'boolean') {
      validated.notificationsEnabled = true;
    }
    
    if (typeof validated.fontSize !== 'number' || validated.fontSize < 12 || validated.fontSize > 24) {
      validated.fontSize = 16;
    }
    
    return validated;
  }

  savePreferences(preferences: Partial<UserPreferences>): boolean {
    try {
      const validatedPrefs = this.validatePreferences(preferences);
      localStorage.setItem(UserPreferencesManager.STORAGE_KEY, JSON.stringify(validatedPrefs));
      return true;
    } catch (error) {
      console.error('Failed to save preferences:', error);
      return false;
    }
  }

  loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(UserPreferencesManager.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return this.validatePreferences(parsed);
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }
    return { ...this.defaultPreferences };
  }

  resetToDefaults(): void {
    localStorage.removeItem(UserPreferencesManager.STORAGE_KEY);
  }

  getCurrentTheme(): 'light' | 'dark' {
    const prefs = this.loadPreferences();
    if (prefs.theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return prefs.theme;
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

  constructor(defaultPreferences: UserPreferences) {
    this.preferences = this.loadPreferences() || defaultPreferences;
  }

  private loadPreferences(): UserPreferences | null {
    try {
      const stored = localStorage.getItem(UserPreferencesManager.STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  private savePreferences(): void {
    localStorage.setItem(
      UserPreferencesManager.STORAGE_KEY,
      JSON.stringify(this.preferences)
    );
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    this.preferences = { ...this.preferences, ...updates };
    this.validatePreferences();
    this.savePreferences();
  }

  private validatePreferences(): void {
    if (this.preferences.fontSize < 12 || this.preferences.fontSize > 24) {
      this.preferences.fontSize = 16;
    }

    const validLanguages = ['en', 'es', 'fr', 'de'];
    if (!validLanguages.includes(this.preferences.language)) {
      this.preferences.language = 'en';
    }
  }

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  resetToDefaults(defaults: UserPreferences): void {
    this.preferences = defaults;
    this.savePreferences();
  }
}

const defaultPrefs: UserPreferences = {
  theme: 'auto',
  language: 'en',
  notificationsEnabled: true,
  fontSize: 16
};

export const preferencesManager = new UserPreferencesManager(defaultPrefs);import { reactive, watch } from 'vue';

interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  notificationsEnabled: boolean;
  itemsPerPage: number;
}

const STORAGE_KEY = 'app_user_preferences';

function loadPreferences(): UserPreferences {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      console.warn('Failed to parse stored preferences');
    }
  }
  return {
    theme: 'light',
    language: 'en',
    notificationsEnabled: true,
    itemsPerPage: 20
  };
}

export function useUserPreferences() {
  const preferences = reactive<UserPreferences>(loadPreferences());

  watch(preferences, (newPreferences) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newPreferences));
  }, { deep: true });

  function resetToDefaults() {
    Object.assign(preferences, {
      theme: 'light',
      language: 'en',
      notificationsEnabled: true,
      itemsPerPage: 20
    });
  }

  function toggleTheme() {
    preferences.theme = preferences.theme === 'light' ? 'dark' : 'light';
  }

  return {
    preferences,
    resetToDefaults,
    toggleTheme
  };
}