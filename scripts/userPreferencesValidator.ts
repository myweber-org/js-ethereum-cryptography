
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  fontSize: number;
  language: string;
}

class PreferenceValidator {
  private static readonly MIN_FONT_SIZE = 12;
  private static readonly MAX_FONT_SIZE = 24;
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja'];

  static validate(prefs: Partial<UserPreferences>): string[] {
    const errors: string[] = [];

    if (prefs.theme !== undefined) {
      if (!['light', 'dark', 'auto'].includes(prefs.theme)) {
        errors.push(`Invalid theme: ${prefs.theme}. Must be 'light', 'dark', or 'auto'`);
      }
    }

    if (prefs.fontSize !== undefined) {
      if (typeof prefs.fontSize !== 'number') {
        errors.push('Font size must be a number');
      } else if (prefs.fontSize < this.MIN_FONT_SIZE || prefs.fontSize > this.MAX_FONT_SIZE) {
        errors.push(`Font size must be between ${this.MIN_FONT_SIZE} and ${this.MAX_FONT_SIZE}`);
      }
    }

    if (prefs.language !== undefined) {
      if (!this.SUPPORTED_LANGUAGES.includes(prefs.language)) {
        errors.push(`Unsupported language: ${prefs.language}. Supported: ${this.SUPPORTED_LANGUAGES.join(', ')}`);
      }
    }

    if (prefs.notifications !== undefined && typeof prefs.notifications !== 'boolean') {
      errors.push('Notifications preference must be a boolean value');
    }

    return errors;
  }

  static validateAndThrow(prefs: Partial<UserPreferences>): void {
    const errors = this.validate(prefs);
    if (errors.length > 0) {
      throw new Error(`Validation failed:\n${errors.join('\n')}`);
    }
  }
}

export { UserPreferences, PreferenceValidator };interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class PreferenceValidationError extends Error {
  constructor(message: string, public field: string) {
    super(message);
    this.name = 'PreferenceValidationError';
  }
}

const validateUserPreferences = (prefs: Partial<UserPreferences>): UserPreferences => {
  const defaults: UserPreferences = {
    theme: 'auto',
    notifications: true,
    language: 'en',
    fontSize: 14
  };

  const validated: UserPreferences = { ...defaults, ...prefs };

  if (!['light', 'dark', 'auto'].includes(validated.theme)) {
    throw new PreferenceValidationError(
      'Theme must be one of: light, dark, auto',
      'theme'
    );
  }

  if (typeof validated.notifications !== 'boolean') {
    throw new PreferenceValidationError(
      'Notifications must be a boolean value',
      'notifications'
    );
  }

  if (!validated.language || validated.language.trim().length === 0) {
    throw new PreferenceValidationError(
      'Language must be a non-empty string',
      'language'
    );
  }

  if (typeof validated.fontSize !== 'number' || validated.fontSize < 8 || validated.fontSize > 72) {
    throw new PreferenceValidationError(
      'Font size must be a number between 8 and 72',
      'fontSize'
    );
  }

  return validated;
};

export { validateUserPreferences, PreferenceValidationError, UserPreferences };