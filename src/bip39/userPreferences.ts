interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  notificationsEnabled: boolean;
  fontSize: number;
}

function validatePreferences(prefs: UserPreferences): boolean {
  const validThemes = ['light', 'dark'];
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

function updateUserPreferences(newPrefs: Partial<UserPreferences>): UserPreferences {
  const defaultPreferences: UserPreferences = {
    theme: 'light',
    language: 'en',
    notificationsEnabled: true,
    fontSize: 14
  };

  const mergedPreferences = { ...defaultPreferences, ...newPrefs };
  
  if (validatePreferences(mergedPreferences)) {
    return mergedPreferences;
  } else {
    console.warn('Invalid preferences provided, returning defaults');
    return defaultPreferences;
  }
}

export { UserPreferences, validatePreferences, updateUserPreferences };