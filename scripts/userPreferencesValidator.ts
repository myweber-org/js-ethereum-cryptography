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
      `Theme must be one of: ${validThemes.join(', ')}`
    );
  }

  if (typeof prefs.notifications !== 'boolean') {
    throw new PreferenceValidationError('Notifications must be a boolean value');
  }

  if (!prefs.language || prefs.language.trim().length === 0) {
    throw new PreferenceValidationError('Language must be specified');
  }

  if (prefs.fontSize < 12 || prefs.fontSize > 24) {
    throw new PreferenceValidationError('Font size must be between 12 and 24');
  }

  if (!Number.isInteger(prefs.fontSize)) {
    throw new PreferenceValidationError('Font size must be an integer');
  }
};

const validatePreferencesWithFallback = (
  prefs: Partial<UserPreferences>
): UserPreferences => {
  const defaultPreferences: UserPreferences = {
    theme: 'auto',
    notifications: true,
    language: 'en',
    fontSize: 16
  };

  const mergedPreferences = { ...defaultPreferences, ...prefs };

  try {
    validateUserPreferences(mergedPreferences);
    return mergedPreferences;
  } catch (error) {
    if (error instanceof PreferenceValidationError) {
      console.warn(`Invalid preferences: ${error.message}. Using defaults.`);
      return defaultPreferences;
    }
    throw error;
  }
};

export { validateUserPreferences, validatePreferencesWithFallback, PreferenceValidationError };
export type { UserPreferences };