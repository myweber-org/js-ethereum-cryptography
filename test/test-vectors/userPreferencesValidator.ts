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
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  itemsPerPage: number;
}

class PreferenceValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PreferenceValidationError';
  }
}

export function validateUserPreferences(prefs: unknown): UserPreferences {
  if (!prefs || typeof prefs !== 'object') {
    throw new PreferenceValidationError('Preferences must be an object');
  }

  const preferences = prefs as Record<string, unknown>;
  
  if (!['light', 'dark', 'auto'].includes(preferences.theme as string)) {
    throw new PreferenceValidationError('Theme must be light, dark, or auto');
  }

  if (typeof preferences.notifications !== 'boolean') {
    throw new PreferenceValidationError('Notifications must be a boolean');
  }

  if (typeof preferences.language !== 'string' || preferences.language.length < 2) {
    throw new PreferenceValidationError('Language must be a string with at least 2 characters');
  }

  const itemsPerPage = Number(preferences.itemsPerPage);
  if (isNaN(itemsPerPage) || itemsPerPage < 1 || itemsPerPage > 100) {
    throw new PreferenceValidationError('Items per page must be between 1 and 100');
  }

  return {
    theme: preferences.theme as 'light' | 'dark' | 'auto',
    notifications: preferences.notifications as boolean,
    language: preferences.language as string,
    itemsPerPage: itemsPerPage
  };
}

export function createDefaultPreferences(): UserPreferences {
  return {
    theme: 'auto',
    notifications: true,
    language: 'en',
    itemsPerPage: 20
  };
}