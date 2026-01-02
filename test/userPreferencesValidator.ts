interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  timezone: string;
  itemsPerPage: number;
}

class PreferenceValidationError extends Error {
  constructor(
    public field: string,
    public value: any,
    public rule: string,
    message: string
  ) {
    super(message);
    this.name = 'PreferenceValidationError';
  }
}

class UserPreferencesValidator {
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja'];
  private static readonly VALID_TIMEZONES = /^[A-Za-z_]+\/[A-Za-z_]+$/;

  static validate(preferences: Partial<UserPreferences>): void {
    if (preferences.theme !== undefined) {
      if (!['light', 'dark', 'auto'].includes(preferences.theme)) {
        throw new PreferenceValidationError(
          'theme',
          preferences.theme,
          'allowed_values',
          'Theme must be one of: light, dark, auto'
        );
      }
    }

    if (preferences.notifications !== undefined) {
      if (typeof preferences.notifications !== 'boolean') {
        throw new PreferenceValidationError(
          'notifications',
          preferences.notifications,
          'boolean',
          'Notifications must be a boolean value'
        );
      }
    }

    if (preferences.language !== undefined) {
      if (!UserPreferencesValidator.SUPPORTED_LANGUAGES.includes(preferences.language)) {
        throw new PreferenceValidationError(
          'language',
          preferences.language,
          'supported_language',
          `Language must be one of: ${UserPreferencesValidator.SUPPORTED_LANGUAGES.join(', ')}`
        );
      }
    }

    if (preferences.timezone !== undefined) {
      if (!UserPreferencesValidator.VALID_TIMEZONES.test(preferences.timezone)) {
        throw new PreferenceValidationError(
          'timezone',
          preferences.timezone,
          'timezone_format',
          'Timezone must be in format: Area/Location (e.g., America/New_York)'
        );
      }
    }

    if (preferences.itemsPerPage !== undefined) {
      if (!Number.isInteger(preferences.itemsPerPage) || preferences.itemsPerPage < 5 || preferences.itemsPerPage > 100) {
        throw new PreferenceValidationError(
          'itemsPerPage',
          preferences.itemsPerPage,
          'range',
          'Items per page must be an integer between 5 and 100'
        );
      }
    }
  }

  static validateAll(preferences: UserPreferences): void {
    const requiredFields: (keyof UserPreferences)[] = ['theme', 'notifications', 'language', 'timezone', 'itemsPerPage'];
    
    for (const field of requiredFields) {
      if (preferences[field] === undefined) {
        throw new PreferenceValidationError(
          field,
          undefined,
          'required',
          `${field} is required`
        );
      }
    }
    
    this.validate(preferences);
  }
}

export { UserPreferences, UserPreferencesValidator, PreferenceValidationError };