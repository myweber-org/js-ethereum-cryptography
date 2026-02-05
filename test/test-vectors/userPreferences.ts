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

export { UserPreferences, validateUserPreferences, updateUserPreferences };