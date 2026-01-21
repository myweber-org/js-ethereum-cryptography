interface UserPreferences {
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

function validatePreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const validated: UserPreferences = { ...DEFAULT_PREFERENCES };

  if (prefs.theme && ['light', 'dark', 'auto'].includes(prefs.theme)) {
    validated.theme = prefs.theme;
  }

  if (typeof prefs.notifications === 'boolean') {
    validated.notifications = prefs.notifications;
  }

  if (prefs.language && typeof prefs.language === 'string') {
    validated.language = prefs.language;
  }

  if (prefs.resultsPerPage && Number.isInteger(prefs.resultsPerPage) && prefs.resultsPerPage > 0) {
    validated.resultsPerPage = prefs.resultsPerPage;
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
  fontSize: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en',
  fontSize: 14
};

class PreferenceManager {
  private storageKey = 'user_preferences';

  loadPreferences(): UserPreferences {
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

  savePreferences(prefs: Partial<UserPreferences>): UserPreferences {
    const current = this.loadPreferences();
    const merged = { ...current, ...prefs };
    const validated = this.validatePreferences(merged);
    
    localStorage.setItem(this.storageKey, JSON.stringify(validated));
    return validated;
  }

  resetPreferences(): UserPreferences {
    localStorage.removeItem(this.storageKey);
    return { ...DEFAULT_PREFERENCES };
  }

  private validatePreferences(prefs: any): UserPreferences {
    const result = { ...DEFAULT_PREFERENCES };

    if (prefs.theme && ['light', 'dark', 'auto'].includes(prefs.theme)) {
      result.theme = prefs.theme;
    }

    if (typeof prefs.notifications === 'boolean') {
      result.notifications = prefs.notifications;
    }

    if (typeof prefs.language === 'string' && prefs.language.length === 2) {
      result.language = prefs.language;
    }

    if (typeof prefs.fontSize === 'number' && prefs.fontSize >= 8 && prefs.fontSize <= 32) {
      result.fontSize = Math.round(prefs.fontSize);
    }

    return result;
  }
}

export const preferenceManager = new PreferenceManager();interface UserPreferences {
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
  const validated: UserPreferences = { ...DEFAULT_PREFERENCES };

  if (prefs.theme && ['light', 'dark', 'auto'].includes(prefs.theme)) {
    validated.theme = prefs.theme;
  }

  if (typeof prefs.notifications === 'boolean') {
    validated.notifications = prefs.notifications;
  }

  if (prefs.language && typeof prefs.language === 'string') {
    validated.language = prefs.language;
  }

  if (prefs.itemsPerPage && Number.isInteger(prefs.itemsPerPage) && prefs.itemsPerPage > 0) {
    validated.itemsPerPage = prefs.itemsPerPage;
  }

  return validated;
}

function savePreferences(prefs: Partial<UserPreferences>): void {
  const validated = validatePreferences(prefs);
  localStorage.setItem('userPreferences', JSON.stringify(validated));
  console.log('Preferences saved:', validated);
}

function loadPreferences(): UserPreferences {
  const stored = localStorage.getItem('userPreferences');
  if (stored) {
    try {
      return validatePreferences(JSON.parse(stored));
    } catch {
      return DEFAULT_PREFERENCES;
    }
  }
  return DEFAULT_PREFERENCES;
}

export { UserPreferences, validatePreferences, savePreferences, loadPreferences };interface UserPreferences {
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
const VALID_RESULTS_PER_PAGE = [10, 20, 50, 100];

function validatePreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const validated: UserPreferences = { ...DEFAULT_PREFERENCES };

  if (prefs.theme && ['light', 'dark', 'auto'].includes(prefs.theme)) {
    validated.theme = prefs.theme;
  }

  if (typeof prefs.notifications === 'boolean') {
    validated.notifications = prefs.notifications;
  }

  if (prefs.language && VALID_LANGUAGES.includes(prefs.language)) {
    validated.language = prefs.language;
  }

  if (prefs.resultsPerPage && VALID_RESULTS_PER_PAGE.includes(prefs.resultsPerPage)) {
    validated.resultsPerPage = prefs.resultsPerPage;
  }

  return validated;
}

function savePreferences(prefs: Partial<UserPreferences>): void {
  const validated = validatePreferences(prefs);
  localStorage.setItem('userPreferences', JSON.stringify(validated));
}

function loadPreferences(): UserPreferences {
  const stored = localStorage.getItem('userPreferences');
  if (!stored) return DEFAULT_PREFERENCES;

  try {
    const parsed = JSON.parse(stored);
    return validatePreferences(parsed);
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export { UserPreferences, validatePreferences, savePreferences, loadPreferences };
interface UserPreferences {
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
    this.validateAndFixPreferences();
  }

  updatePreferences(updates: Partial<UserPreferences>): boolean {
    const newPreferences = { ...this.preferences, ...updates };
    
    if (!this.validatePreferences(newPreferences)) {
      return false;
    }

    this.preferences = newPreferences;
    return true;
  }

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  resetToDefaults(): void {
    this.preferences = { ...DEFAULT_PREFERENCES };
  }

  private validatePreferences(prefs: UserPreferences): boolean {
    if (!VALID_LANGUAGES.includes(prefs.language)) {
      return false;
    }

    if (prefs.resultsPerPage < MIN_RESULTS_PER_PAGE || prefs.resultsPerPage > MAX_RESULTS_PER_PAGE) {
      return false;
    }

    return true;
  }

  private validateAndFixPreferences(): void {
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