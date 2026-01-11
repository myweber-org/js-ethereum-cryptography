interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class PreferenceError extends Error {
  constructor(message: string, public field: string) {
    super(message);
    this.name = 'PreferenceError';
  }
}

function validateUserPreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const defaults: UserPreferences = {
    theme: 'auto',
    notifications: true,
    language: 'en',
    fontSize: 14
  };

  const validated: UserPreferences = { ...defaults, ...prefs };

  if (!['light', 'dark', 'auto'].includes(validated.theme)) {
    throw new PreferenceError('Theme must be light, dark, or auto', 'theme');
  }

  if (typeof validated.notifications !== 'boolean') {
    throw new PreferenceError('Notifications must be a boolean value', 'notifications');
  }

  if (!validated.language || validated.language.trim().length === 0) {
    throw new PreferenceError('Language must be specified', 'language');
  }

  if (validated.fontSize < 8 || validated.fontSize > 72) {
    throw new PreferenceError('Font size must be between 8 and 72', 'fontSize');
  }

  if (!Number.isInteger(validated.fontSize)) {
    throw new PreferenceError('Font size must be an integer', 'fontSize');
  }

  return validated;
}

function formatValidationError(error: unknown): string {
  if (error instanceof PreferenceError) {
    return `Validation failed for field "${error.field}": ${error.message}`;
  }
  return 'An unexpected validation error occurred';
}

export { validateUserPreferences, formatValidationError, PreferenceError };
export type { UserPreferences };