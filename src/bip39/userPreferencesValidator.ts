interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class PreferenceValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PreferenceValidationError';
  }
}

const validateUserPreferences = (prefs: UserPreferences): void => {
  const validThemes = ['light', 'dark', 'auto'];
  
  if (!validThemes.includes(prefs.theme)) {
    throw new PreferenceValidationError(
      `Invalid theme: ${prefs.theme}. Must be one of: ${validThemes.join(', ')}`
    );
  }

  if (typeof prefs.notifications !== 'boolean') {
    throw new PreferenceValidationError('Notifications must be a boolean value');
  }

  if (typeof prefs.language !== 'string' || prefs.language.trim().length === 0) {
    throw new PreferenceValidationError('Language must be a non-empty string');
  }

  if (typeof prefs.fontSize !== 'number' || prefs.fontSize < 8 || prefs.fontSize > 72) {
    throw new PreferenceValidationError('Font size must be a number between 8 and 72');
  }
};

const sanitizePreferences = (prefs: Partial<UserPreferences>): UserPreferences => {
  const defaults: UserPreferences = {
    theme: 'auto',
    notifications: true,
    language: 'en',
    fontSize: 16
  };

  return {
    ...defaults,
    ...prefs,
    language: prefs.language?.trim() || defaults.language
  };
};

export { UserPreferences, PreferenceValidationError, validateUserPreferences, sanitizePreferences };