interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notificationsEnabled: boolean;
  fontSize: number;
}

function validateUserPreferences(prefs: UserPreferences): boolean {
  const validThemes = ['light', 'dark', 'auto'];
  const minFontSize = 8;
  const maxFontSize = 72;

  if (!validThemes.includes(prefs.theme)) {
    return false;
  }

  if (typeof prefs.language !== 'string' || prefs.language.trim().length === 0) {
    return false;
  }

  if (typeof prefs.notificationsEnabled !== 'boolean') {
    return false;
  }

  if (typeof prefs.fontSize !== 'number' || 
      prefs.fontSize < minFontSize || 
      prefs.fontSize > maxFontSize) {
    return false;
  }

  return true;
}

function updateUserPreferences(newPrefs: Partial<UserPreferences>): UserPreferences {
  const defaultPreferences: UserPreferences = {
    theme: 'auto',
    language: 'en',
    notificationsEnabled: true,
    fontSize: 16
  };

  const mergedPreferences = { ...defaultPreferences, ...newPrefs };
  
  if (!validateUserPreferences(mergedPreferences)) {
    throw new Error('Invalid user preferences provided');
  }

  return mergedPreferences;
}

export { UserPreferences, validateUserPreferences, updateUserPreferences };interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notificationsEnabled: boolean;
  fontSize: number;
}

function validatePreferences(prefs: UserPreferences): boolean {
  const validThemes = ['light', 'dark', 'auto'];
  const minFontSize = 8;
  const maxFontSize = 72;

  if (!validThemes.includes(prefs.theme)) {
    console.error('Invalid theme selected');
    return false;
  }

  if (typeof prefs.language !== 'string' || prefs.language.trim().length === 0) {
    console.error('Language must be a non-empty string');
    return false;
  }

  if (typeof prefs.notificationsEnabled !== 'boolean') {
    console.error('NotificationsEnabled must be a boolean');
    return false;
  }

  if (typeof prefs.fontSize !== 'number' || 
      prefs.fontSize < minFontSize || 
      prefs.fontSize > maxFontSize) {
    console.error(`Font size must be between ${minFontSize} and ${maxFontSize}`);
    return false;
  }

  return true;
}

function savePreferences(prefs: UserPreferences): void {
  if (!validatePreferences(prefs)) {
    throw new Error('Invalid preferences provided');
  }
  
  localStorage.setItem('userPreferences', JSON.stringify(prefs));
  console.log('Preferences saved successfully');
}

function loadPreferences(): UserPreferences | null {
  const stored = localStorage.getItem('userPreferences');
  if (!stored) return null;

  try {
    const prefs = JSON.parse(stored) as UserPreferences;
    if (validatePreferences(prefs)) {
      return prefs;
    }
  } catch (error) {
    console.error('Failed to load preferences:', error);
  }
  
  return null;
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

const VALID_LANGUAGES = ['en-US', 'es-ES', 'fr-FR', 'de-DE'];
const MIN_RESULTS_PER_PAGE = 10;
const MAX_RESULTS_PER_PAGE = 100;

function validatePreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const validated: UserPreferences = { ...DEFAULT_PREFERENCES, ...prefs };
  
  if (!['light', 'dark', 'auto'].includes(validated.theme)) {
    validated.theme = DEFAULT_PREFERENCES.theme;
  }
  
  if (!VALID_LANGUAGES.includes(validated.language)) {
    validated.language = DEFAULT_PREFERENCES.language;
  }
  
  if (typeof validated.notifications !== 'boolean') {
    validated.notifications = DEFAULT_PREFERENCES.notifications;
  }
  
  if (typeof validated.resultsPerPage !== 'number' || 
      validated.resultsPerPage < MIN_RESULTS_PER_PAGE || 
      validated.resultsPerPage > MAX_RESULTS_PER_PAGE) {
    validated.resultsPerPage = DEFAULT_PREFERENCES.resultsPerPage;
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