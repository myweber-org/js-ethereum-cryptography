interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  timezone: string;
}

class PreferenceValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PreferenceValidationError';
  }
}

function validateUserPreferences(prefs: UserPreferences): void {
  const validThemes = ['light', 'dark', 'auto'];
  const validLanguages = ['en', 'es', 'fr', 'de', 'ja'];
  const timezoneRegex = /^[A-Za-z_]+\/[A-Za-z_]+$/;

  if (!validThemes.includes(prefs.theme)) {
    throw new PreferenceValidationError(
      `Invalid theme '${prefs.theme}'. Must be one of: ${validThemes.join(', ')}`
    );
  }

  if (typeof prefs.notifications !== 'boolean') {
    throw new PreferenceValidationError('Notifications must be a boolean value');
  }

  if (!validLanguages.includes(prefs.language)) {
    throw new PreferenceValidationError(
      `Unsupported language '${prefs.language}'. Supported languages: ${validLanguages.join(', ')}`
    );
  }

  if (!timezoneRegex.test(prefs.timezone)) {
    throw new PreferenceValidationError(
      `Invalid timezone format '${prefs.timezone}'. Expected format: Area/Location`
    );
  }
}

function updateUserPreferences(newPrefs: UserPreferences): void {
  try {
    validateUserPreferences(newPrefs);
    console.log('Preferences updated successfully');
  } catch (error) {
    if (error instanceof PreferenceValidationError) {
      console.error('Validation failed:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
  }
}