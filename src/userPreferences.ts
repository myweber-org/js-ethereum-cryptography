interface UserPreferences {
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

function validatePreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const validated = { ...DEFAULT_PREFERENCES, ...prefs };
  
  if (!['light', 'dark', 'auto'].includes(validated.theme)) {
    validated.theme = 'auto';
  }
  
  if (typeof validated.notifications !== 'boolean') {
    validated.notifications = true;
  }
  
  if (typeof validated.language !== 'string' || validated.language.length !== 2) {
    validated.language = 'en';
  }
  
  if (typeof validated.fontSize !== 'number' || validated.fontSize < 8 || validated.fontSize > 32) {
    validated.fontSize = 14;
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
  fontSize: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en-US',
  fontSize: 14
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
  
  if (typeof validated.fontSize !== 'number' || validated.fontSize < 8 || validated.fontSize > 32) {
    validated.fontSize = DEFAULT_PREFERENCES.fontSize;
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