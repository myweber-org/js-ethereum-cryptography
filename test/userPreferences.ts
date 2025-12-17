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
  if (stored) {
    try {
      return validatePreferences(JSON.parse(stored));
    } catch {
      return DEFAULT_PREFERENCES;
    }
  }
  return DEFAULT_PREFERENCES;
}

export { UserPreferences, validatePreferences, savePreferences, loadPreferences };