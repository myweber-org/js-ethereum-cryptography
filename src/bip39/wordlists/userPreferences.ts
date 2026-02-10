interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  timezone: string;
}

function validateUserPreferences(prefs: UserPreferences): boolean {
  const validThemes = ['light', 'dark', 'auto'];
  const validLanguages = ['en', 'es', 'fr', 'de'];
  const timezoneRegex = /^[A-Za-z_]+\/[A-Za-z_]+$/;

  if (!validThemes.includes(prefs.theme)) {
    return false;
  }

  if (typeof prefs.notifications !== 'boolean') {
    return false;
  }

  if (!validLanguages.includes(prefs.language)) {
    return false;
  }

  if (!timezoneRegex.test(prefs.timezone)) {
    return false;
  }

  return true;
}

function updateUserPreferences(newPrefs: Partial<UserPreferences>): UserPreferences {
  const defaultPreferences: UserPreferences = {
    theme: 'auto',
    notifications: true,
    language: 'en',
    timezone: 'UTC'
  };

  return { ...defaultPreferences, ...newPrefs };
}

export { UserPreferences, validateUserPreferences, updateUserPreferences };interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  timezone: string;
}

function validateUserPreferences(prefs: UserPreferences): boolean {
  const validThemes = ['light', 'dark', 'auto'];
  const validLanguages = ['en', 'es', 'fr', 'de'];
  const timezoneRegex = /^[A-Za-z_]+\/[A-Za-z_]+$/;

  if (!validThemes.includes(prefs.theme)) {
    console.error('Invalid theme selected');
    return false;
  }

  if (typeof prefs.notifications !== 'boolean') {
    console.error('Notifications must be boolean');
    return false;
  }

  if (!validLanguages.includes(prefs.language)) {
    console.error('Unsupported language');
    return false;
  }

  if (!timezoneRegex.test(prefs.timezone)) {
    console.error('Invalid timezone format');
    return false;
  }

  return true;
}

function updateUserPreferences(newPrefs: Partial<UserPreferences>): UserPreferences {
  const defaultPreferences: UserPreferences = {
    theme: 'auto',
    notifications: true,
    language: 'en',
    timezone: 'UTC'
  };

  const mergedPreferences = { ...defaultPreferences, ...newPrefs };

  if (validateUserPreferences(mergedPreferences)) {
    return mergedPreferences;
  } else {
    throw new Error('Invalid user preferences provided');
  }
}