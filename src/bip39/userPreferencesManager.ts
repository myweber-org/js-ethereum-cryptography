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

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    this.preferences = { ...this.preferences, ...updates };
    this.savePreferences();
  }

  private savePreferences(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.preferences));
    } catch (error) {
      console.error('Failed to save preferences to localStorage:', error);
    }
  }

  resetToDefaults(): void {
    this.preferences = { ...DEFAULT_PREFERENCES };
    this.savePreferences();
  }

  getTheme(): string {
    if (this.preferences.theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return this.preferences.theme;
  }
}

export const userPreferences = new UserPreferencesManager();interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  notificationsEnabled: boolean;
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
    listener(this.getPreferences());
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    const currentPrefs = this.getPreferences();
    this.listeners.forEach(listener => listener(currentPrefs));
  }
}

const defaultPrefs: UserPreferences = {
  theme: 'light',
  language: 'en',
  notificationsEnabled: true
};

export const userPrefsManager = new UserPreferencesManager(defaultPrefs);interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en-US',
  fontSize: 14
};

class UserPreferencesManager {
  private preferences: UserPreferences;

  constructor() {
    this.preferences = this.loadPreferences();
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    const validatedUpdates = this.validateUpdates(updates);
    this.preferences = { ...this.preferences, ...validatedUpdates };
    this.savePreferences();
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  resetToDefaults(): void {
    this.preferences = { ...DEFAULT_PREFERENCES };
    this.savePreferences();
  }

  private validateUpdates(updates: Partial<UserPreferences>): Partial<UserPreferences> {
    const validated: Partial<UserPreferences> = {};

    if (updates.theme !== undefined && ['light', 'dark', 'auto'].includes(updates.theme)) {
      validated.theme = updates.theme;
    }

    if (typeof updates.notifications === 'boolean') {
      validated.notifications = updates.notifications;
    }

    if (updates.language && typeof updates.language === 'string') {
      validated.language = updates.language;
    }

    if (typeof updates.fontSize === 'number' && updates.fontSize >= 8 && updates.fontSize <= 24) {
      validated.fontSize = updates.fontSize;
    }

    return validated;
  }

  private loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem('userPreferences');
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...DEFAULT_PREFERENCES, ...parsed };
      }
    } catch (error) {
      console.warn('Failed to load preferences from storage:', error);
    }
    return { ...DEFAULT_PREFERENCES };
  }

  private savePreferences(): void {
    try {
      localStorage.setItem('userPreferences', JSON.stringify(this.preferences));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }
}

export const preferencesManager = new UserPreferencesManager();interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en-US',
  fontSize: 14
};

const STORAGE_KEY = 'user_preferences';

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
        return this.validatePreferences(parsed);
      }
    } catch (error) {
      console.warn('Failed to load preferences from storage:', error);
    }
    return { ...DEFAULT_PREFERENCES };
  }

  private validatePreferences(data: unknown): UserPreferences {
    const result = { ...DEFAULT_PREFERENCES };

    if (data && typeof data === 'object') {
      const obj = data as Record<string, unknown>;

      if (['light', 'dark', 'auto'].includes(obj.theme as string)) {
        result.theme = obj.theme as UserPreferences['theme'];
      }

      if (typeof obj.notifications === 'boolean') {
        result.notifications = obj.notifications;
      }

      if (typeof obj.language === 'string' && obj.language.length >= 2) {
        result.language = obj.language;
      }

      if (typeof obj.fontSize === 'number' && obj.fontSize >= 8 && obj.fontSize <= 32) {
        result.fontSize = obj.fontSize;
      }
    }

    return result;
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    const newPreferences = { ...this.preferences, ...updates };
    this.preferences = this.validatePreferences(newPreferences);
    this.savePreferences();
  }

  private savePreferences(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.preferences));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
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

export const userPreferences = new UserPreferencesManager();interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  resultsPerPage: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en-US',
  resultsPerPage: 20
};

const VALID_LANGUAGES = ['en-US', 'es-ES', 'fr-FR', 'de-DE'];
const MIN_RESULTS_PER_PAGE = 5;
const MAX_RESULTS_PER_PAGE = 100;

class UserPreferencesManager {
  private preferences: UserPreferences;

  constructor(initialPreferences?: Partial<UserPreferences>) {
    this.preferences = { ...DEFAULT_PREFERENCES, ...this.validatePreferences(initialPreferences || {}) };
  }

  private validatePreferences(prefs: Partial<UserPreferences>): Partial<UserPreferences> {
    const validated: Partial<UserPreferences> = {};

    if (prefs.theme && ['light', 'dark', 'auto'].includes(prefs.theme)) {
      validated.theme = prefs.theme;
    }

    if (typeof prefs.notifications === 'boolean') {
      validated.notifications = prefs.notifications;
    }

    if (prefs.language && VALID_LANGUAGES.includes(prefs.language)) {
      validated.language = prefs.language;
    }

    if (typeof prefs.resultsPerPage === 'number') {
      validated.resultsPerPage = Math.max(
        MIN_RESULTS_PER_PAGE,
        Math.min(MAX_RESULTS_PER_PAGE, prefs.resultsPerPage)
      );
    }

    return validated;
  }

  updatePreferences(newPreferences: Partial<UserPreferences>): UserPreferences {
    const validated = this.validatePreferences(newPreferences);
    this.preferences = { ...this.preferences, ...validated };
    return this.getPreferences();
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  resetToDefaults(): UserPreferences {
    this.preferences = { ...DEFAULT_PREFERENCES };
    return this.getPreferences();
  }

  exportAsJSON(): string {
    return JSON.stringify(this.preferences, null, 2);
  }

  static importFromJSON(jsonString: string): UserPreferencesManager {
    try {
      const parsed = JSON.parse(jsonString);
      return new UserPreferencesManager(parsed);
    } catch {
      return new UserPreferencesManager();
    }
  }
}

export { UserPreferencesManager, type UserPreferences };