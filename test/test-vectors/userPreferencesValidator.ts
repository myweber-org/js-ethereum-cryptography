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

    if (preferences.notifications !== undefined && typeof preferences.notifications !== 'boolean') {
      errors.push('Notifications must be a boolean value');
    }

    if (preferences.language && !this.SUPPORTED_LANGUAGES.includes(preferences.language)) {
      errors.push(`Language must be one of: ${this.SUPPORTED_LANGUAGES.join(', ')}`);
    }

    if (preferences.timezone && !this.VALID_TIMEZONES.test(preferences.timezone)) {
      errors.push('Timezone must be in format: Area/Location (e.g., America/New_York)');
    }

    if (errors.length > 0) {
      throw new PreferenceValidationError(`Validation failed:\n${errors.join('\n')}`);
    }

    return {
      theme: preferences.theme as 'light' | 'dark' | 'auto',
      notifications: preferences.notifications ?? true,
      language: preferences.language ?? 'en',
      timezone: preferences.timezone ?? 'UTC'
    };
  }
}

export { UserPreferences, UserPreferencesValidator, PreferenceValidationError };