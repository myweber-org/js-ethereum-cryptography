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

const validatePreferences = (prefs: UserPreferences): void => {
  const validThemes = ['light', 'dark', 'auto'];
  
  if (!validThemes.includes(prefs.theme)) {
    throw new PreferenceError(
      `Theme must be one of: ${validThemes.join(', ')}`,
      'theme'
    );
  }

  if (typeof prefs.notifications !== 'boolean') {
    throw new PreferenceError('Notifications must be a boolean', 'notifications');
  }

  if (typeof prefs.language !== 'string' || prefs.language.trim().length === 0) {
    throw new PreferenceError('Language must be a non-empty string', 'language');
  }

  if (typeof prefs.fontSize !== 'number' || prefs.fontSize < 8 || prefs.fontSize > 72) {
    throw new PreferenceError('Font size must be between 8 and 72', 'fontSize');
  }
};

const exampleUsage = () => {
  try {
    const userPrefs: UserPreferences = {
      theme: 'dark',
      notifications: true,
      language: 'en-US',
      fontSize: 14
    };

    validatePreferences(userPrefs);
    console.log('Preferences are valid');
  } catch (error) {
    if (error instanceof PreferenceError) {
      console.error(`Validation failed for ${error.field}: ${error.message}`);
    } else {
      console.error('Unexpected error:', error);
    }
  }
};