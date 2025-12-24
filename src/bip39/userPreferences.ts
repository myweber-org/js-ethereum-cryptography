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

function loadUserPreferences(): UserPreferences {
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

function saveUserPreferences(prefs: Partial<UserPreferences>): void {
  const current = loadUserPreferences();
  const updated = validatePreferences({ ...current, ...prefs });
  localStorage.setItem('userPreferences', JSON.stringify(updated));
}

export { UserPreferences, loadUserPreferences, saveUserPreferences };interface UserPreferences {
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
  const validThemes = ['light', 'dark', 'auto'];
  
  if (prefs.theme && !validThemes.includes(prefs.theme)) {
    return false;
  }
  
  if (prefs.language && typeof prefs.language !== 'string') {
    return false;
  }
  
  if (prefs.timezone && typeof prefs.timezone !== 'string') {
    return false;
  }
  
  return true;
}

function updateUserPreferences(
  current: UserPreferences,
  updates: Partial<UserPreferences>
): UserPreferences | null {
  if (!validatePreferences(updates)) {
    return null;
  }
  
  return {
    ...current,
    ...updates
  };
}

function savePreferences(prefs: UserPreferences): void {
  localStorage.setItem('userPreferences', JSON.stringify(prefs));
}

function loadPreferences(): UserPreferences {
  const stored = localStorage.getItem('userPreferences');
  
  if (!stored) {
    return DEFAULT_PREFERENCES;
  }
  
  try {
    const parsed = JSON.parse(stored);
    return validatePreferences(parsed) ? parsed : DEFAULT_PREFERENCES;
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export {
  UserPreferences,
  DEFAULT_PREFERENCES,
  validatePreferences,
  updateUserPreferences,
  savePreferences,
  loadPreferences
};