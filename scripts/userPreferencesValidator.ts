
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  itemsPerPage: number;
}

class PreferenceValidator {
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de'];
  private static readonly MIN_ITEMS_PER_PAGE = 5;
  private static readonly MAX_ITEMS_PER_PAGE = 100;

  static validate(prefs: UserPreferences): string[] {
    const errors: string[] = [];

    if (!['light', 'dark', 'auto'].includes(prefs.theme)) {
      errors.push(`Invalid theme selection: ${prefs.theme}`);
    }

    if (typeof prefs.notifications !== 'boolean') {
      errors.push('Notifications must be a boolean value');
    }

    if (!PreferenceValidator.SUPPORTED_LANGUAGES.includes(prefs.language)) {
      errors.push(`Unsupported language: ${prefs.language}`);
    }

    if (prefs.itemsPerPage < PreferenceValidator.MIN_ITEMS_PER_PAGE || 
        prefs.itemsPerPage > PreferenceValidator.MAX_ITEMS_PER_PAGE) {
      errors.push(`Items per page must be between ${PreferenceValidator.MIN_ITEMS_PER_PAGE} and ${PreferenceValidator.MAX_ITEMS_PER_PAGE}`);
    }

    return errors;
  }

  static validateAndThrow(prefs: UserPreferences): void {
    const errors = this.validate(prefs);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join('; ')}`);
    }
  }
}

export { UserPreferences, PreferenceValidator };
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
      ...preferences
    };

    if (!['light', 'dark', 'auto'].includes(validated.theme)) {
      throw new PreferenceValidationError(
        `Invalid theme: ${validated.theme}. Must be 'light', 'dark', or 'auto'`
      );
    }

    if (typeof validated.notifications !== 'boolean') {
      throw new PreferenceValidationError(
        `Notifications must be a boolean value, received: ${typeof validated.notifications}`
      );
    }

    if (!UserPreferencesValidator.SUPPORTED_LANGUAGES.includes(validated.language)) {
      throw new PreferenceValidationError(
        `Unsupported language: ${validated.language}. Supported languages: ${UserPreferencesValidator.SUPPORTED_LANGUAGES.join(', ')}`
      );
    }

    if (!UserPreferencesValidator.VALID_TIMEZONES.test(validated.timezone)) {
      throw new PreferenceValidationError(
        `Invalid timezone format: ${validated.timezone}. Must be in format 'Area/Location'`
      );
    }

    return validated;
  }

  static validatePartialUpdate(updates: Partial<UserPreferences>): Partial<UserPreferences> {
    const result: Partial<UserPreferences> = {};

    if (updates.theme !== undefined) {
      if (!['light', 'dark', 'auto'].includes(updates.theme)) {
        throw new PreferenceValidationError(
          `Invalid theme: ${updates.theme}. Must be 'light', 'dark', or 'auto'`
        );
      }
      result.theme = updates.theme;
    }

    if (updates.notifications !== undefined) {
      if (typeof updates.notifications !== 'boolean') {
        throw new PreferenceValidationError(
          `Notifications must be a boolean value, received: ${typeof updates.notifications}`
        );
      }
      result.notifications = updates.notifications;
    }

    if (updates.language !== undefined) {
      if (!UserPreferencesValidator.SUPPORTED_LANGUAGES.includes(updates.language)) {
        throw new PreferenceValidationError(
          `Unsupported language: ${updates.language}. Supported languages: ${UserPreferencesValidator.SUPPORTED_LANGUAGES.join(', ')}`
        );
      }
      result.language = updates.language;
    }

    if (updates.timezone !== undefined) {
      if (!UserPreferencesValidator.VALID_TIMEZONES.test(updates.timezone)) {
        throw new PreferenceValidationError(
          `Invalid timezone format: ${updates.timezone}. Must be in format 'Area/Location'`
        );
      }
      result.timezone = updates.timezone;
    }

    return result;
  }
}

export { UserPreferencesValidator, PreferenceValidationError, UserPreferences };