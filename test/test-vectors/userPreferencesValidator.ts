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
      throw new PreferenceValidationError(`Validation failed: ${errors.join('; ')}`);
    }

    return preferences as UserPreferences;
  }

  static sanitize(preferences: Partial<UserPreferences>): UserPreferences {
    const sanitized: Partial<UserPreferences> = { ...preferences };

    if (sanitized.theme) {
      sanitized.theme = sanitized.theme.toLowerCase() as 'light' | 'dark' | 'auto';
    }

    if (sanitized.language) {
      sanitized.language = sanitized.language.toLowerCase();
    }

    if (sanitized.timezone) {
      sanitized.timezone = sanitized.timezone.replace(/\s+/g, '_');
    }

    return this.validate(sanitized);
  }
}

export { UserPreferencesValidator, PreferenceValidationError, UserPreferences };