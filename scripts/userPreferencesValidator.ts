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
    const validated: UserPreferences = {
      theme: 'auto',
      notifications: true,
      language: 'en',
      timezone: 'UTC',
    };

    if (preferences.theme) {
      if (!['light', 'dark', 'auto'].includes(preferences.theme)) {
        throw new PreferenceValidationError(
          `Invalid theme: ${preferences.theme}. Must be 'light', 'dark', or 'auto'`
        );
      }
      validated.theme = preferences.theme;
    }

    if (preferences.notifications !== undefined) {
      if (typeof preferences.notifications !== 'boolean') {
        throw new PreferenceValidationError(
          `Notifications must be boolean, received: ${typeof preferences.notifications}`
        );
      }
      validated.notifications = preferences.notifications;
    }

    if (preferences.language) {
      if (!UserPreferencesValidator.SUPPORTED_LANGUAGES.includes(preferences.language)) {
        throw new PreferenceValidationError(
          `Unsupported language: ${preferences.language}. Supported: ${UserPreferencesValidator.SUPPORTED_LANGUAGES.join(', ')}`
        );
      }
      validated.language = preferences.language;
    }

    if (preferences.timezone) {
      if (!UserPreferencesValidator.VALID_TIMEZONES.test(preferences.timezone)) {
        throw new PreferenceValidationError(
          `Invalid timezone format: ${preferences.timezone}. Must be in format 'Area/Location'`
        );
      }
      validated.timezone = preferences.timezone;
    }

    return validated;
  }
}

export { UserPreferencesValidator, PreferenceValidationError, UserPreferences };