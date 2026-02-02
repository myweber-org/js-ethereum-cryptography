interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  timezone: string;
}

function validateUserPreferences(prefs: UserPreferences): boolean {
  const validThemes = ['light', 'dark', 'auto'];
  const validLanguages = ['en', 'es', 'fr', 'de'];
  
  if (!validThemes.includes(prefs.theme)) {
    return false;
  }
  
  if (!validLanguages.includes(prefs.language)) {
    return false;
  }
  
  if (typeof prefs.notifications !== 'boolean') {
    return false;
  }
  
  if (!prefs.timezone || prefs.timezone.trim() === '') {
    return false;
  }
  
  return true;
}

function updateUserPreferences(prefs: UserPreferences): void {
  if (!validateUserPreferences(prefs)) {
    throw new Error('Invalid user preferences');
  }
  
  console.log('User preferences updated successfully:', prefs);
}interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  notificationsEnabled: boolean;
  fontSize: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'light',
  language: 'en',
  notificationsEnabled: true,
  fontSize: 14
};

function validatePreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const validated = { ...DEFAULT_PREFERENCES, ...prefs };
  
  if (!['light', 'dark'].includes(validated.theme)) {
    validated.theme = DEFAULT_PREFERENCES.theme;
  }
  
  if (typeof validated.fontSize !== 'number' || validated.fontSize < 8 || validated.fontSize > 32) {
    validated.fontSize = DEFAULT_PREFERENCES.fontSize;
  }
  
  if (typeof validated.notificationsEnabled !== 'boolean') {
    validated.notificationsEnabled = DEFAULT_PREFERENCES.notificationsEnabled;
  }
  
  return validated;
}

function mergePreferences(existing: UserPreferences, updates: Partial<UserPreferences>): UserPreferences {
  return validatePreferences({ ...existing, ...updates });
}

export { UserPreferences, validatePreferences, mergePreferences, DEFAULT_PREFERENCES };