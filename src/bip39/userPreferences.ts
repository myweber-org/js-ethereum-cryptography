interface UserPreferences {
  theme: 'light' | 'dark';
  notifications: boolean;
  language: string;
  itemsPerPage: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'light',
  notifications: true,
  language: 'en',
  itemsPerPage: 25
};

function validatePreferences(prefs: Partial<UserPreferences>): UserPreferences {
  return {
    theme: prefs.theme && ['light', 'dark'].includes(prefs.theme) 
      ? prefs.theme 
      : DEFAULT_PREFERENCES.theme,
    notifications: typeof prefs.notifications === 'boolean'
      ? prefs.notifications
      : DEFAULT_PREFERENCES.notifications,
    language: typeof prefs.language === 'string' && prefs.language.length === 2
      ? prefs.language
      : DEFAULT_PREFERENCES.language,
    itemsPerPage: typeof prefs.itemsPerPage === 'number' && prefs.itemsPerPage > 0
      ? Math.min(prefs.itemsPerPage, 100)
      : DEFAULT_PREFERENCES.itemsPerPage
  };
}

function mergePreferences(
  existing: UserPreferences,
  updates: Partial<UserPreferences>
): UserPreferences {
  const validatedUpdates = validatePreferences(updates);
  return { ...existing, ...validatedUpdates };
}

export { UserPreferences, DEFAULT_PREFERENCES, validatePreferences, mergePreferences };