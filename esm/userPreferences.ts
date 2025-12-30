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
  resultsPerPage: 10
};

const VALID_LANGUAGES = ['en-US', 'es-ES', 'fr-FR', 'de-DE'];
const VALID_RESULTS_PER_PAGE = [5, 10, 25, 50];

function validatePreferences(preferences: Partial<UserPreferences>): UserPreferences {
  const validated: UserPreferences = { ...DEFAULT_PREFERENCES };

  if (preferences.theme && ['light', 'dark', 'auto'].includes(preferences.theme)) {
    validated.theme = preferences.theme;
  }

  if (typeof preferences.notifications === 'boolean') {
    validated.notifications = preferences.notifications;
  }

  if (preferences.language && VALID_LANGUAGES.includes(preferences.language)) {
    validated.language = preferences.language;
  }

  if (preferences.resultsPerPage && VALID_RESULTS_PER_PAGE.includes(preferences.resultsPerPage)) {
    validated.resultsPerPage = preferences.resultsPerPage;
  }

  return validated;
}

function savePreferences(preferences: Partial<UserPreferences>): void {
  const validated = validatePreferences(preferences);
  localStorage.setItem('userPreferences', JSON.stringify(validated));
}

function loadPreferences(): UserPreferences {
  const stored = localStorage.getItem('userPreferences');
  if (!stored) {
    return DEFAULT_PREFERENCES;
  }

  try {
    const parsed = JSON.parse(stored);
    return validatePreferences(parsed);
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export { UserPreferences, validatePreferences, savePreferences, loadPreferences };interface UserPreferences {
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
  
  validatePreferences(prefs: Partial<UserPreferences>): boolean {
    if (prefs.theme && !['light', 'dark', 'auto'].includes(prefs.theme)) {
      return false;
    }
    if (prefs.fontSize && (prefs.fontSize < 8 || prefs.fontSize > 32)) {
      return false;
    }
    return true;
  }
  
  loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        return this.validatePreferences(parsed) ? 
          { ...DEFAULT_PREFERENCES, ...parsed } : 
          DEFAULT_PREFERENCES;
      }
    } catch (error) {
      console.warn('Failed to load preferences:', error);
    }
    return DEFAULT_PREFERENCES;
  }
  
  savePreferences(prefs: Partial<UserPreferences>): boolean {
    if (!this.validatePreferences(prefs)) {
      return false;
    }
    
    try {
      const current = this.loadPreferences();
      const updated = { ...current, ...prefs };
      localStorage.setItem(this.storageKey, JSON.stringify(updated));
      return true;
    } catch (error) {
      console.error('Failed to save preferences:', error);
      return false;
    }
  }
  
  resetToDefaults(): void {
    localStorage.removeItem(this.storageKey);
  }
}

export const preferencesManager = new PreferencesManager();