interface UserPreferences {
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

class PreferencesManager {
  private storageKey = 'user_preferences';
  private currentPreferences: UserPreferences;

  constructor() {
    this.currentPreferences = this.loadPreferences();
  }

  private loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        return this.validatePreferences(parsed);
      }
    } catch (error) {
      console.warn('Failed to load preferences:', error);
    }
    return { ...DEFAULT_PREFERENCES };
  }

  private validatePreferences(data: unknown): UserPreferences {
    const preferences = { ...DEFAULT_PREFERENCES };
    
    if (data && typeof data === 'object') {
      const obj = data as Record<string, unknown>;
      
      if (['light', 'dark', 'auto'].includes(obj.theme as string)) {
        preferences.theme = obj.theme as UserPreferences['theme'];
      }
      
      if (typeof obj.notifications === 'boolean') {
        preferences.notifications = obj.notifications;
      }
      
      if (typeof obj.language === 'string' && obj.language.length >= 2) {
        preferences.language = obj.language;
      }
      
      if (typeof obj.fontSize === 'number' && obj.fontSize >= 8 && obj.fontSize <= 32) {
        preferences.fontSize = obj.fontSize;
      }
    }
    
    return preferences;
  }

  getPreferences(): UserPreferences {
    return { ...this.currentPreferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): boolean {
    const newPreferences = {
      ...this.currentPreferences,
      ...updates
    };
    
    const validated = this.validatePreferences(newPreferences);
    
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(validated));
      this.currentPreferences = validated;
      return true;
    } catch (error) {
      console.error('Failed to save preferences:', error);
      return false;
    }
  }

  resetToDefaults(): boolean {
    return this.updatePreferences(DEFAULT_PREFERENCES);
  }

  getPreference<K extends keyof UserPreferences>(key: K): UserPreferences[K] {
    return this.currentPreferences[key];
  }
}

export const preferencesManager = new PreferencesManager();interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

function validateUserPreferences(prefs: Partial<UserPreferences>): boolean {
  const validThemes = ['light', 'dark', 'auto'];
  
  if (prefs.theme && !validThemes.includes(prefs.theme)) {
    return false;
  }

  if (prefs.fontSize !== undefined && (prefs.fontSize < 12 || prefs.fontSize > 24)) {
    return false;
  }

  if (prefs.language && typeof prefs.language !== 'string') {
    return false;
  }

  return true;
}

function updateUserPreferences(
  currentPrefs: UserPreferences,
  updates: Partial<UserPreferences>
): UserPreferences | null {
  if (!validateUserPreferences(updates)) {
    return null;
  }

  return {
    ...currentPrefs,
    ...updates
  };
}

const defaultPreferences: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en',
  fontSize: 16
};

export { UserPreferences, validateUserPreferences, updateUserPreferences, defaultPreferences };interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  itemsPerPage: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en-US',
  itemsPerPage: 25
};

function validatePreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const validated = { ...DEFAULT_PREFERENCES, ...prefs };
  
  if (!['light', 'dark', 'auto'].includes(validated.theme)) {
    validated.theme = 'auto';
  }
  
  if (typeof validated.notifications !== 'boolean') {
    validated.notifications = true;
  }
  
  if (!validated.language || typeof validated.language !== 'string') {
    validated.language = 'en-US';
  }
  
  if (!Number.isInteger(validated.itemsPerPage) || validated.itemsPerPage < 1 || validated.itemsPerPage > 100) {
    validated.itemsPerPage = 25;
  }
  
  return validated;
}

function mergePreferences(existing: UserPreferences, updates: Partial<UserPreferences>): UserPreferences {
  return validatePreferences({ ...existing, ...updates });
}

export { UserPreferences, DEFAULT_PREFERENCES, validatePreferences, mergePreferences };interface UserPreferences {
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
const MIN_RESULTS_PER_PAGE = 10;
const MAX_RESULTS_PER_PAGE = 100;

class PreferencesManager {
  private preferences: UserPreferences;

  constructor(initialPreferences?: Partial<UserPreferences>) {
    this.preferences = { ...DEFAULT_PREFERENCES, ...initialPreferences };
    this.validateAndFix();
  }

  updatePreferences(updates: Partial<UserPreferences>): boolean {
    const newPreferences = { ...this.preferences, ...updates };
    
    if (this.validatePreferences(newPreferences)) {
      this.preferences = newPreferences;
      return true;
    }
    
    return false;
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  resetToDefaults(): void {
    this.preferences = { ...DEFAULT_PREFERENCES };
  }

  private validatePreferences(prefs: UserPreferences): boolean {
    if (!VALID_LANGUAGES.includes(prefs.language)) {
      return false;
    }

    if (prefs.resultsPerPage < MIN_RESULTS_PER_PAGE || 
        prefs.resultsPerPage > MAX_RESULTS_PER_PAGE) {
      return false;
    }

    return true;
  }

  private validateAndFix(): void {
    if (!VALID_LANGUAGES.includes(this.preferences.language)) {
      this.preferences.language = DEFAULT_PREFERENCES.language;
    }

    if (this.preferences.resultsPerPage < MIN_RESULTS_PER_PAGE) {
      this.preferences.resultsPerPage = MIN_RESULTS_PER_PAGE;
    } else if (this.preferences.resultsPerPage > MAX_RESULTS_PER_PAGE) {
      this.preferences.resultsPerPage = MAX_RESULTS_PER_PAGE;
    }
  }
}

export { PreferencesManager, type UserPreferences };