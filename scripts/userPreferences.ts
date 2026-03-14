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
const MIN_RESULTS_PER_PAGE = 5;
const MAX_RESULTS_PER_PAGE = 100;

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

  if (typeof prefs.resultsPerPage === 'number') {
    validated.resultsPerPage = Math.max(
      MIN_RESULTS_PER_PAGE,
      Math.min(MAX_RESULTS_PER_PAGE, prefs.resultsPerPage)
    );
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

export { UserPreferences, validatePreferences, savePreferences, loadPreferences };export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notificationsEnabled: boolean;
  fontSize: number;
}

export class PreferenceManager {
  private static readonly STORAGE_KEY = 'user_preferences';
  private defaultPreferences: UserPreferences = {
    theme: 'auto',
    language: 'en-US',
    notificationsEnabled: true,
    fontSize: 16
  };

  getPreferences(): UserPreferences {
    const stored = localStorage.getItem(PreferenceManager.STORAGE_KEY);
    if (stored) {
      try {
        return { ...this.defaultPreferences, ...JSON.parse(stored) };
      } catch {
        return this.defaultPreferences;
      }
    }
    return this.defaultPreferences;
  }

  updatePreferences(updates: Partial<UserPreferences>): UserPreferences {
    const current = this.getPreferences();
    const updated = { ...current, ...updates };
    localStorage.setItem(PreferenceManager.STORAGE_KEY, JSON.stringify(updated));
    return updated;
  }

  resetToDefaults(): UserPreferences {
    localStorage.removeItem(PreferenceManager.STORAGE_KEY);
    return this.defaultPreferences;
  }

  isDarkMode(): boolean {
    const prefs = this.getPreferences();
    if (prefs.theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return prefs.theme === 'dark';
  }
}