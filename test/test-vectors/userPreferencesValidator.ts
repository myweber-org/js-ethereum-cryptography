interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class PreferenceValidationError extends Error {
  constructor(message: string, public field: keyof UserPreferences) {
    super(message);
    this.name = 'PreferenceValidationError';
  }
}

const validateUserPreferences = (prefs: Partial<UserPreferences>): UserPreferences => {
  const defaultPreferences: UserPreferences = {
    theme: 'auto',
    notifications: true,
    language: 'en',
    fontSize: 14
  };

  const validated: UserPreferences = { ...defaultPreferences };

  if (prefs.theme !== undefined) {
    if (!['light', 'dark', 'auto'].includes(prefs.theme)) {
      throw new PreferenceValidationError(
        'Theme must be one of: light, dark, auto',
        'theme'
      );
    }
    validated.theme = prefs.theme;
  }

  if (prefs.notifications !== undefined) {
    if (typeof prefs.notifications !== 'boolean') {
      throw new PreferenceValidationError(
        'Notifications must be a boolean value',
        'notifications'
      );
    }
    validated.notifications = prefs.notifications;
  }

  if (prefs.language !== undefined) {
    if (typeof prefs.language !== 'string' || prefs.language.length !== 2) {
      throw new PreferenceValidationError(
        'Language must be a 2-character ISO code',
        'language'
      );
    }
    validated.language = prefs.language.toLowerCase();
  }

  if (prefs.fontSize !== undefined) {
    if (typeof prefs.fontSize !== 'number' || prefs.fontSize < 8 || prefs.fontSize > 72) {
      throw new PreferenceValidationError(
        'Font size must be between 8 and 72',
        'fontSize'
      );
    }
    validated.fontSize = Math.round(prefs.fontSize);
  }

  return validated;
};

export { validateUserPreferences, PreferenceValidationError, type UserPreferences };