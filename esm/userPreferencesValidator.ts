
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
  private static readonly MIN_FONT_SIZE = 8;
  private static readonly MAX_FONT_SIZE = 72;
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja'];

  static validate(preferences: Partial<UserPreferences>): UserPreferences {
    const validated: UserPreferences = {
      theme: 'auto',
      notifications: true,
      language: 'en',
      fontSize: 16,
      ...preferences
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

    if (!Number.isInteger(validated.fontSize) || 
        validated.fontSize < UserPreferencesValidator.MIN_FONT_SIZE || 
        validated.fontSize > UserPreferencesValidator.MAX_FONT_SIZE) {
      throw new PreferenceError(
        `Font size must be an integer between ${UserPreferencesValidator.MIN_FONT_SIZE} and ${UserPreferencesValidator.MAX_FONT_SIZE}`,
        'fontSize'
      );
    }

    return validated;
  }

  static validatePartial(preferences: Partial<UserPreferences>): Partial<UserPreferences> {
    const result: Partial<UserPreferences> = {};
    
    if (preferences.theme !== undefined) {
      if (!['light', 'dark', 'auto'].includes(preferences.theme)) {
        throw new PreferenceError(
          `Theme must be 'light', 'dark', or 'auto'`,
          'theme'
        );
      }
      result.theme = preferences.theme;
    }

    if (preferences.notifications !== undefined) {
      if (typeof preferences.notifications !== 'boolean') {
        throw new PreferenceError('Notifications must be a boolean', 'notifications');
      }
      result.notifications = preferences.notifications;
    }

    if (preferences.language !== undefined) {
      if (!UserPreferencesValidator.SUPPORTED_LANGUAGES.includes(preferences.language)) {
        throw new PreferenceError(
          `Language must be one of: ${UserPreferencesValidator.SUPPORTED_LANGUAGES.join(', ')}`,
          'language'
        );
      }
      result.language = preferences.language;
    }

    if (preferences.fontSize !== undefined) {
      if (!Number.isInteger(preferences.fontSize) || 
          preferences.fontSize < UserPreferencesValidator.MIN_FONT_SIZE || 
          preferences.fontSize > UserPreferencesValidator.MAX_FONT_SIZE) {
        throw new PreferenceError(
          `Font size must be an integer between ${UserPreferencesValidator.MIN_FONT_SIZE} and ${UserPreferencesValidator.MAX_FONT_SIZE}`,
          'fontSize'
        );
      }
      result.fontSize = preferences.fontSize;
    }

    return result;
  }
}

export { UserPreferences, UserPreferencesValidator, PreferenceError };