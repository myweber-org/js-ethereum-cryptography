
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notificationsEnabled: boolean;
  fontSize: number;
  autoSaveInterval: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  language: 'en-US',
  notificationsEnabled: true,
  fontSize: 14,
  autoSaveInterval: 30000
};

const VALID_LANGUAGES = ['en-US', 'es-ES', 'fr-FR', 'de-DE', 'ja-JP'];
const MIN_FONT_SIZE = 8;
const MAX_FONT_SIZE = 32;
const MIN_AUTO_SAVE_INTERVAL = 5000;
const MAX_AUTO_SAVE_INTERVAL = 300000;

class UserPreferencesManager {
  private preferences: UserPreferences;
  private readonly storageKey = 'user_preferences';

  constructor() {
    this.preferences = this.loadPreferences();
  }

  private loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        return this.validateAndMerge(parsed);
      }
    } catch (error) {
      console.warn('Failed to load preferences from storage:', error);
    }
    return { ...DEFAULT_PREFERENCES };
  }

  private validateAndMerge(partialPrefs: Partial<UserPreferences>): UserPreferences {
    const merged = { ...DEFAULT_PREFERENCES, ...partialPrefs };

    if (!['light', 'dark', 'auto'].includes(merged.theme)) {
      merged.theme = DEFAULT_PREFERENCES.theme;
    }

    if (!VALID_LANGUAGES.includes(merged.language)) {
      merged.language = DEFAULT_PREFERENCES.language;
    }

    if (typeof merged.notificationsEnabled !== 'boolean') {
      merged.notificationsEnabled = DEFAULT_PREFERENCES.notificationsEnabled;
    }

    if (typeof merged.fontSize !== 'number' || 
        merged.fontSize < MIN_FONT_SIZE || 
        merged.fontSize > MAX_FONT_SIZE) {
      merged.fontSize = DEFAULT_PREFERENCES.fontSize;
    }

    if (typeof merged.autoSaveInterval !== 'number' ||
        merged.autoSaveInterval < MIN_AUTO_SAVE_INTERVAL ||
        merged.autoSaveInterval > MAX_AUTO_SAVE_INTERVAL) {
      merged.autoSaveInterval = DEFAULT_PREFERENCES.autoSaveInterval;
    }

    return merged;
  }

  getPreferences(): UserPreferences {
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
      localStorage.setItem(this.storageKey, JSON.stringify(this.preferences));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }

  resetToDefaults(): void {
    this.preferences = { ...DEFAULT_PREFERENCES };
    this.savePreferences();
  }

  isDarkModeActive(): boolean {
    if (this.preferences.theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return this.preferences.theme === 'dark';
  }

  getAutoSaveIntervalInSeconds(): number {
    return this.preferences.autoSaveInterval / 1000;
  }
}

export { UserPreferencesManager, type UserPreferences };interface UserPreferences {
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

  updatePreferences(updates: Partial<UserPreferences>): void {
    const validated = this.validateUpdates(updates);
    this.preferences = { ...this.preferences, ...validated };
    this.savePreferences();
  }

  private validateUpdates(updates: Partial<UserPreferences>): Partial<UserPreferences> {
    const validated: Partial<UserPreferences> = {};

    if (updates.theme !== undefined && ['light', 'dark', 'auto'].includes(updates.theme)) {
      validated.theme = updates.theme;
    }

    if (updates.language !== undefined && typeof updates.language === 'string') {
      validated.language = updates.language;
    }

    if (updates.notificationsEnabled !== undefined && typeof updates.notificationsEnabled === 'boolean') {
      validated.notificationsEnabled = updates.notificationsEnabled;
    }

    if (updates.fontSize !== undefined && updates.fontSize >= 12 && updates.fontSize <= 24) {
      validated.fontSize = updates.fontSize;
    }

    return validated;
  }

  private savePreferences(): void {
    localStorage.setItem(UserPreferencesManager.STORAGE_KEY, JSON.stringify(this.preferences));
  }

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  resetToDefaults(defaults: UserPreferences): void {
    this.preferences = defaults;
    this.savePreferences();
  }
}

const defaultPreferences: UserPreferences = {
  theme: 'auto',
  language: 'en',
  notificationsEnabled: true,
  fontSize: 16
};

export const userPrefsManager = new UserPreferencesManager(defaultPreferences);