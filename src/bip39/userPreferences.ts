interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notificationsEnabled: boolean;
  itemsPerPage: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  language: 'en-US',
  notificationsEnabled: true,
  itemsPerPage: 25
};

function validatePreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const validated: UserPreferences = { ...DEFAULT_PREFERENCES, ...prefs };
  
  if (!['light', 'dark', 'auto'].includes(validated.theme)) {
    validated.theme = DEFAULT_PREFERENCES.theme;
  }
  
  if (typeof validated.language !== 'string' || validated.language.trim() === '') {
    validated.language = DEFAULT_PREFERENCES.language;
  }
  
  if (typeof validated.notificationsEnabled !== 'boolean') {
    validated.notificationsEnabled = DEFAULT_PREFERENCES.notificationsEnabled;
  }
  
  if (!Number.isInteger(validated.itemsPerPage) || validated.itemsPerPage < 1 || validated.itemsPerPage > 100) {
    validated.itemsPerPage = DEFAULT_PREFERENCES.itemsPerPage;
  }
  
  return validated;
}

function mergePreferences(existing: UserPreferences, updates: Partial<UserPreferences>): UserPreferences {
  const merged = { ...existing, ...updates };
  return validatePreferences(merged);
}

export { UserPreferences, DEFAULT_PREFERENCES, validatePreferences, mergePreferences };