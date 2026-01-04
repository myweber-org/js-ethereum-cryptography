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
    validated.resultsPerPage = Math.min(prefs.resultsPerPage, 100);
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
}export type Theme = 'light' | 'dark' | 'auto';
export type Language = 'en' | 'es' | 'fr';

export interface UserPreferences {
  theme: Theme;
  language: Language;
  notificationsEnabled: boolean;
  fontSize: number;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  language: 'en',
  notificationsEnabled: true,
  fontSize: 14,
};

export class PreferenceManager {
  private static STORAGE_KEY = 'user_preferences';

  static loadPreferences(): UserPreferences {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
      } catch {
        return DEFAULT_PREFERENCES;
      }
    }
    return DEFAULT_PREFERENCES;
  }

  static savePreferences(prefs: Partial<UserPreferences>): void {
    const current = this.loadPreferences();
    const updated = { ...current, ...prefs };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
  }

  static resetToDefaults(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  static validatePreferences(prefs: UserPreferences): boolean {
    const validThemes: Theme[] = ['light', 'dark', 'auto'];
    const validLanguages: Language[] = ['en', 'es', 'fr'];
    
    return validThemes.includes(prefs.theme) &&
           validLanguages.includes(prefs.language) &&
           typeof prefs.notificationsEnabled === 'boolean' &&
           prefs.fontSize >= 10 && prefs.fontSize <= 24;
  }
}interface UserPreferences {
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
    validated.resultsPerPage = Math.min(prefs.resultsPerPage, 100);
  }

  return validated;
}

function mergePreferences(existing: UserPreferences, updates: Partial<UserPreferences>): UserPreferences {
  return {
    ...existing,
    ...validatePreferences(updates)
  };
}

export { UserPreferences, DEFAULT_PREFERENCES, validatePreferences, mergePreferences };