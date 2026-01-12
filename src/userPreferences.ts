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

function validatePreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const validated = { ...DEFAULT_PREFERENCES, ...prefs };
  
  if (!['light', 'dark', 'auto'].includes(validated.theme)) {
    validated.theme = DEFAULT_PREFERENCES.theme;
  }
  
  if (!VALID_LANGUAGES.includes(validated.language)) {
    validated.language = DEFAULT_PREFERENCES.language;
  }
  
  if (typeof validated.notifications !== 'boolean') {
    validated.notifications = DEFAULT_PREFERENCES.notifications;
  }
  
  if (!Number.isInteger(validated.resultsPerPage) || validated.resultsPerPage < 5 || validated.resultsPerPage > 100) {
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

export { UserPreferences, validatePreferences, savePreferences, loadPreferences };interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  timezone: string;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en-US',
  timezone: 'UTC'
};

function validatePreferences(prefs: Partial<UserPreferences>): boolean {
  if (prefs.theme && !['light', 'dark', 'auto'].includes(prefs.theme)) {
    return false;
  }
  
  if (prefs.language && typeof prefs.language !== 'string') {
    return false;
  }
  
  if (prefs.timezone && typeof prefs.timezone !== 'string') {
    return false;
  }
  
  if (prefs.notifications !== undefined && typeof prefs.notifications !== 'boolean') {
    return false;
  }
  
  return true;
}

function updateUserPreferences(current: UserPreferences, updates: Partial<UserPreferences>): UserPreferences {
  if (!validatePreferences(updates)) {
    throw new Error('Invalid preference values');
  }
  
  return {
    ...current,
    ...updates
  };
}

function getStoredPreferences(): UserPreferences {
  const stored = localStorage.getItem('userPreferences');
  
  if (!stored) {
    return DEFAULT_PREFERENCES;
  }
  
  try {
    const parsed = JSON.parse(stored);
    return validatePreferences(parsed) ? { ...DEFAULT_PREFERENCES, ...parsed } : DEFAULT_PREFERENCES;
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

function savePreferences(prefs: UserPreferences): void {
  localStorage.setItem('userPreferences', JSON.stringify(prefs));
}

export { UserPreferences, validatePreferences, updateUserPreferences, getStoredPreferences, savePreferences };