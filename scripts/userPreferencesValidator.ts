interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class PreferenceValidationError extends Error {
  constructor(message: string, public field: string) {
    super(message);
    this.name = 'PreferenceValidationError';
  }
}

function validateUserPreferences(prefs: UserPreferences): void {
  const validThemes = ['light', 'dark', 'auto'];
  if (!validThemes.includes(prefs.theme)) {
    throw new PreferenceValidationError(
      `Theme must be one of: ${validThemes.join(', ')}`,
      'theme'
    );
  }

  if (typeof prefs.notifications !== 'boolean') {
    throw new PreferenceValidationError(
      'Notifications must be a boolean value',
      'notifications'
    );
  }

  const validLanguages = ['en', 'es', 'fr', 'de'];
  if (!validLanguages.includes(prefs.language)) {
    throw new PreferenceValidationError(
      `Language must be one of: ${validLanguages.join(', ')}`,
      'language'
    );
  }

  if (prefs.fontSize < 12 || prefs.fontSize > 24) {
    throw new PreferenceValidationError(
      'Font size must be between 12 and 24',
      'fontSize'
    );
  }
}

function saveUserPreferences(prefs: UserPreferences): boolean {
  try {
    validateUserPreferences(prefs);
    console.log('Preferences validated successfully');
    return true;
  } catch (error) {
    if (error instanceof PreferenceValidationError) {
      console.error(`Validation failed for field "${error.field}": ${error.message}`);
    } else {
      console.error('Unknown validation error:', error);
    }
    return false;
  }
}