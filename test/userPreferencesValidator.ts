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

function validateUserPreferences(prefs: UserPreferences): void {
  const validThemes = ['light', 'dark', 'auto'];
  const validLanguages = ['en', 'es', 'fr', 'de'];
  const minFontSize = 12;
  const maxFontSize = 24;

  if (!validThemes.includes(prefs.theme)) {
    throw new PreferenceError(
      `Theme must be one of: ${validThemes.join(', ')}`,
      'theme'
    );
  }

  if (typeof prefs.notifications !== 'boolean') {
    throw new PreferenceError('Notifications must be a boolean value', 'notifications');
  }

  if (!validLanguages.includes(prefs.language)) {
    throw new PreferenceError(
      `Language must be one of: ${validLanguages.join(', ')}`,
      'language'
    );
  }

  if (prefs.fontSize < minFontSize || prefs.fontSize > maxFontSize) {
    throw new PreferenceError(
      `Font size must be between ${minFontSize} and ${maxFontSize}`,
      'fontSize'
    );
  }
}

function updateUserPreferences(prefs: UserPreferences): void {
  try {
    validateUserPreferences(prefs);
    console.log('Preferences updated successfully:', prefs);
  } catch (error) {
    if (error instanceof PreferenceError) {
      console.error(`Validation failed for field "${error.field}": ${error.message}`);
    } else {
      console.error('Unexpected error:', error);
    }
  }
}