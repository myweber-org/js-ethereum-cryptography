interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  timezone: string;
}

class UserPreferencesValidator {
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja'];
  private static readonly VALID_TIMEZONE_PATTERN = /^[A-Za-z_]+\/[A-Za-z_]+$/;

  static validate(preferences: Partial<UserPreferences>): string[] {
    const errors: string[] = [];

    if (preferences.theme !== undefined) {
      if (!['light', 'dark', 'auto'].includes(preferences.theme)) {
        errors.push('Theme must be one of: light, dark, auto');
      }
    }

    if (preferences.notifications !== undefined) {
      if (typeof preferences.notifications !== 'boolean') {
        errors.push('Notifications must be a boolean value');
      }
    }

    if (preferences.language !== undefined) {
      if (!UserPreferencesValidator.SUPPORTED_LANGUAGES.includes(preferences.language)) {
        errors.push(`Language must be one of: ${UserPreferencesValidator.SUPPORTED_LANGUAGES.join(', ')}`);
      }
    }

    if (preferences.timezone !== undefined) {
      if (!UserPreferencesValidator.VALID_TIMEZONE_PATTERN.test(preferences.timezone)) {
        errors.push('Timezone must be in format: Area/Location');
      }
    }

    return errors;
  }

  static validateAndThrow(preferences: Partial<UserPreferences>): void {
    const errors = this.validate(preferences);
    if (errors.length > 0) {
      throw new Error(`Invalid preferences: ${errors.join('; ')}`);
    }
  }
}

export { UserPreferences, UserPreferencesValidator };