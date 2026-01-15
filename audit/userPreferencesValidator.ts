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

class UserPreferencesValidator {
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja'];
  private static readonly VALID_TIMEZONES = /^[A-Za-z_]+\/[A-Za-z_]+$/;

  static validate(preferences: Partial<UserPreferences>): UserPreferences {
    const errors: string[] = [];

    if (!preferences.theme || !['light', 'dark', 'auto'].includes(preferences.theme)) {
      errors.push('Theme must be one of: light, dark, auto');
    }

    if (typeof preferences.notifications !== 'boolean') {
      errors.push('Notifications must be a boolean value');
    }

    if (!preferences.language || !this.SUPPORTED_LANGUAGES.includes(preferences.language)) {
      errors.push(`Language must be one of: ${this.SUPPORTED_LANGUAGES.join(', ')}`);
    }

    if (!preferences.timezone || !this.VALID_TIMEZONES.test(preferences.timezone)) {
      errors.push('Timezone must be in format: Area/Location (e.g., America/New_York)');
    }

    if (errors.length > 0) {
      throw new PreferenceValidationError(`Validation failed:\n${errors.join('\n')}`);
    }

    return preferences as UserPreferences;
  }

  static validatePartial(preferences: Partial<UserPreferences>): Partial<UserPreferences> {
    const validated: Partial<UserPreferences> = {};

    if (preferences.theme) {
      if (!['light', 'dark', 'auto'].includes(preferences.theme)) {
        throw new PreferenceValidationError('Invalid theme value');
      }
      validated.theme = preferences.theme;
    }

    if (preferences.notifications !== undefined) {
      if (typeof preferences.notifications !== 'boolean') {
        throw new PreferenceValidationError('Notifications must be a boolean');
      }
      validated.notifications = preferences.notifications;
    }

    if (preferences.language) {
      if (!this.SUPPORTED_LANGUAGES.includes(preferences.language)) {
        throw new PreferenceValidationError('Unsupported language');
      }
      validated.language = preferences.language;
    }

    if (preferences.timezone) {
      if (!this.VALID_TIMEZONES.test(preferences.timezone)) {
        throw new PreferenceValidationError('Invalid timezone format');
      }
      validated.timezone = preferences.timezone;
    }

    return validated;
  }
}

export { UserPreferencesValidator, PreferenceValidationError, UserPreferences };