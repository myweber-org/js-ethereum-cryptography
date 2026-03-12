interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
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

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    this.preferences = { ...this.preferences, ...updates };
    localStorage.setItem(UserPreferencesManager.STORAGE_KEY, JSON.stringify(this.preferences));
    this.notifyListeners();
  }

  resetToDefaults(defaults: UserPreferences): void {
    this.preferences = defaults;
    localStorage.removeItem(UserPreferencesManager.STORAGE_KEY);
    this.notifyListeners();
  }

  addListener(listener: (prefs: UserPreferences) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    const currentPrefs = this.getPreferences();
    this.listeners.forEach(listener => listener(currentPrefs));
  }
}

const defaultUserPreferences: UserPreferences = {
  theme: 'auto',
  fontSize: 16,
  notificationsEnabled: true,
  language: 'en-US'
};

export const userPrefsManager = new UserPreferencesManager(defaultUserPreferences);interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
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

    if (updates.theme !== undefined) {
      if (['light', 'dark', 'auto'].includes(updates.theme)) {
        validated.theme = updates.theme;
      }
    }

    if (updates.notifications !== undefined) {
      validated.notifications = Boolean(updates.notifications);
    }

    if (updates.language !== undefined) {
      if (typeof updates.language === 'string' && updates.language.length >= 2) {
        validated.language = updates.language;
      }
    }

    if (updates.fontSize !== undefined) {
      const size = Number(updates.fontSize);
      if (!isNaN(size) && size >= 8 && size <= 32) {
        validated.fontSize = size;
      }
    }

    return validated;
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

  resetToDefaults(defaults: UserPreferences): void {
    this.preferences = defaults;
    this.savePreferences();
  }
}

const defaultPreferences: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en',
  fontSize: 14
};

export const userPrefs = new UserPreferencesManager(defaultPreferences);interface UserPreferences {
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

  private validatePreferences(data: any): UserPreferences {
    const validThemes = ['light', 'dark', 'auto'];
    const theme = validThemes.includes(data.theme) ? data.theme : 'auto';
    const notifications = typeof data.notifications === 'boolean' ? data.notifications : true;
    const language = typeof data.language === 'string' ? data.language.substring(0, 10) : 'en';
    const fontSize = typeof data.fontSize === 'number' && data.fontSize >= 8 && data.fontSize <= 72 
      ? data.fontSize 
      : 16;

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
}

export { UserPreferencesManager, type UserPreferences };typescript
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
    private storageKey: string;

    constructor(storageKey: string = 'user_preferences') {
        this.storageKey = storageKey;
        this.preferences = this.loadPreferences();
    }

    private loadPreferences(): UserPreferences {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const parsed = JSON.parse(stored);
                return this.validateAndMergePreferences(parsed);
            }
        } catch (error) {
            console.warn('Failed to load preferences from storage:', error);
        }
        return { ...DEFAULT_PREFERENCES };
    }

    private validateAndMergePreferences(partial: Partial<UserPreferences>): UserPreferences {
        const merged = { ...DEFAULT_PREFERENCES, ...partial };
        
        if (!['light', 'dark', 'auto'].includes(merged.theme)) {
            merged.theme = DEFAULT_PREFERENCES.theme;
        }
        
        if (!VALID_LANGUAGES.includes(merged.language)) {
            merged.language = DEFAULT_PREFERENCES.language;
        }
        
        merged.fontSize = Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, merged.fontSize));
        merged.autoSaveInterval = Math.max(
            MIN_AUTO_SAVE_INTERVAL, 
            Math.min(MAX_AUTO_SAVE_INTERVAL, merged.autoSaveInterval)
        );
        
        return merged;
    }

    private savePreferences(): void {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.preferences));
        } catch (error) {
            console.error('Failed to save preferences:', error);
        }
    }

    getPreferences(): UserPreferences {
        return { ...this.preferences };
    }

    updatePreferences(updates: Partial<UserPreferences>): boolean {
        const newPreferences = this.validateAndMergePreferences({
            ...this.preferences,
            ...updates
        });
        
        const hasChanged = JSON.stringify(newPreferences) !== JSON.stringify(this.preferences);
        
        if (hasChanged) {
            this.preferences = newPreferences;
            this.savePreferences();
            this.notifyListeners();
        }
        
        return hasChanged;
    }

    resetToDefaults(): void {
        this.preferences = { ...DEFAULT_PREFERENCES };
        this.savePreferences();
        this.notifyListeners();
    }

    private listeners: Set<() => void> = new Set();

    addChangeListener(listener: () => void): void {
        this.listeners.add(listener);
    }

    removeChangeListener(listener: () => void): void {
        this.listeners.delete(listener);
    }

    private notifyListeners(): void {
        this.listeners.forEach(listener => listener());
    }

    exportPreferences(): string {
        return JSON.stringify(this.preferences, null, 2);
    }

    importPreferences(json: string): boolean {
        try {
            const parsed = JSON.parse(json);
            return this.updatePreferences(parsed);
        } catch (error) {
            console.error('Failed to import preferences:', error);
            return false;
        }
    }
}

export { UserPreferencesManager, DEFAULT_PREFERENCES };
export type { UserPreferences };
```