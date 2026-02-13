
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

class UserPreferencesValidator {
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de'];
  private static readonly MIN_FONT_SIZE = 12;
  private static readonly MAX_FONT_SIZE = 24;

  static validate(prefs: Partial<UserPreferences>): UserPreferences {
    const validated: UserPreferences = {
      theme: 'auto',
      notifications: true,
      language: 'en',
      fontSize: 16,
      ...prefs
    };

    if (!['light', 'dark', 'auto'].includes(validated.theme)) {
      throw new PreferenceError(
        `Theme must be 'light', 'dark', or 'auto'`,
        'theme'
      );
    }

    if (typeof validated.notifications !== 'boolean') {
      throw new PreferenceError('Notifications must be a boolean', 'notifications');
    }

    if (!UserPreferencesValidator.SUPPORTED_LANGUAGES.includes(validated.language)) {
      throw new PreferenceError(
        `Language must be one of: ${UserPreferencesValidator.SUPPORTED_LANGUAGES.join(', ')}`,
        'language'
      );
    }

    if (validated.fontSize < UserPreferencesValidator.MIN_FONT_SIZE || 
        validated.fontSize > UserPreferencesValidator.MAX_FONT_SIZE) {
      throw new PreferenceError(
        `Font size must be between ${UserPreferencesValidator.MIN_FONT_SIZE} and ${UserPreferencesValidator.MAX_FONT_SIZE}`,
        'fontSize'
      );
    }

    if (!Number.isInteger(validated.fontSize)) {
      throw new PreferenceError('Font size must be an integer', 'fontSize');
    }

    return validated;
  }

  static validatePartial(prefs: Partial<UserPreferences>): Partial<UserPreferences> {
    const result: Partial<UserPreferences> = {};
    
    if (prefs.theme !== undefined) {
      if (!['light', 'dark', 'auto'].includes(prefs.theme)) {
        throw new PreferenceError(
          `Theme must be 'light', 'dark', or 'auto'`,
          'theme'
        );
      }
      result.theme = prefs.theme;
    }

    if (prefs.notifications !== undefined) {
      if (typeof prefs.notifications !== 'boolean') {
        throw new PreferenceError('Notifications must be a boolean', 'notifications');
      }
      result.notifications = prefs.notifications;
    }

    if (prefs.language !== undefined) {
      if (!UserPreferencesValidator.SUPPORTED_LANGUAGES.includes(prefs.language)) {
        throw new PreferenceError(
          `Language must be one of: ${UserPreferencesValidator.SUPPORTED_LANGUAGES.join(', ')}`,
          'language'
        );
      }
      result.language = prefs.language;
    }

    if (prefs.fontSize !== undefined) {
      if (prefs.fontSize < UserPreferencesValidator.MIN_FONT_SIZE || 
          prefs.fontSize > UserPreferencesValidator.MAX_FONT_SIZE) {
        throw new PreferenceError(
          `Font size must be between ${UserPreferencesValidator.MIN_FONT_SIZE} and ${UserPreferencesValidator.MAX_FONT_SIZE}`,
          'fontSize'
        );
      }
      if (!Number.isInteger(prefs.fontSize)) {
        throw new PreferenceError('Font size must be an integer', 'fontSize');
      }
      result.fontSize = prefs.fontSize;
    }

    return result;
  }
}

export { UserPreferencesValidator, PreferenceError, UserPreferences };