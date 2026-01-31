
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

const validateTheme = (theme: unknown): theme is UserPreferences['theme'] => {
  const validThemes = ['light', 'dark', 'auto'];
  return typeof theme === 'string' && validThemes.includes(theme);
};

const validatePreferences = (prefs: unknown): UserPreferences => {
  if (typeof prefs !== 'object' || prefs === null) {
    throw new PreferenceValidationError('Preferences must be an object');
  }

  const preferences = prefs as Record<string, unknown>;

  if (!validateTheme(preferences.theme)) {
    throw new PreferenceValidationError(
      'Theme must be one of: light, dark, auto'
    );
  }

  if (typeof preferences.notifications !== 'boolean') {
    throw new PreferenceValidationError('Notifications must be a boolean');
  }

  if (typeof preferences.language !== 'string' || preferences.language.length < 2) {
    throw new PreferenceValidationError('Language must be a string with at least 2 characters');
  }

  if (typeof preferences.fontSize !== 'number' || preferences.fontSize < 8 || preferences.fontSize > 72) {
    throw new PreferenceValidationError('Font size must be between 8 and 72');
  }

  return {
    theme: preferences.theme as UserPreferences['theme'],
    notifications: preferences.notifications as boolean,
    language: preferences.language as string,
    fontSize: preferences.fontSize as number,
  };
};

export { validatePreferences, PreferenceValidationError, type UserPreferences };