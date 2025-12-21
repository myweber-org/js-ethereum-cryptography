
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  timezone: string;
}

class PreferenceValidator {
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja'];
  private static readonly VALID_TIMEZONES = /^[A-Za-z_]+\/[A-Za-z_]+$/;

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

    if (!PreferenceValidator.VALID_TIMEZONES.test(prefs.timezone)) {
      errors.push(`Invalid timezone format: ${prefs.timezone}`);
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
  fontSize: number;
}

class PreferenceError extends Error {
  constructor(message: string, public field: string) {
    super(message);
    this.name = 'PreferenceError';
  }
}

export function validateUserPreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const errors: string[] = [];

  if (!prefs.theme) {
    errors.push('Theme is required');
  } else if (!['light', 'dark', 'auto'].includes(prefs.theme)) {
    errors.push('Theme must be light, dark, or auto');
  }

  if (prefs.notifications === undefined) {
    errors.push('Notifications preference is required');
  }

  if (!prefs.language) {
    errors.push('Language is required');
  } else if (typeof prefs.language !== 'string' || prefs.language.length < 2) {
    errors.push('Language must be a valid language code');
  }

  if (prefs.fontSize === undefined) {
    errors.push('Font size is required');
  } else if (typeof prefs.fontSize !== 'number' || prefs.fontSize < 8 || prefs.fontSize > 72) {
    errors.push('Font size must be between 8 and 72');
  }

  if (errors.length > 0) {
    throw new PreferenceError(`Validation failed: ${errors.join('; ')}`, 'preferences');
  }

  return prefs as UserPreferences;
}

export function normalizePreferences(prefs: UserPreferences): UserPreferences {
  return {
    ...prefs,
    language: prefs.language.toLowerCase(),
    fontSize: Math.min(Math.max(prefs.fontSize, 8), 72)
  };
}interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class PreferencesValidator {
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja'];
  private static readonly MIN_FONT_SIZE = 8;
  private static readonly MAX_FONT_SIZE = 72;

  static validate(preferences: Partial<UserPreferences>): string[] {
    const errors: string[] = [];

    if (preferences.theme !== undefined) {
      if (!['light', 'dark', 'auto'].includes(preferences.theme)) {
        errors.push(`Invalid theme: ${preferences.theme}`);
      }
    }

    if (preferences.notifications !== undefined) {
      if (typeof preferences.notifications !== 'boolean') {
        errors.push('Notifications must be a boolean value');
      }
    }

    if (preferences.language !== undefined) {
      if (typeof preferences.language !== 'string') {
        errors.push('Language must be a string');
      } else if (!this.SUPPORTED_LANGUAGES.includes(preferences.language)) {
        errors.push(`Unsupported language: ${preferences.language}`);
      }
    }

    if (preferences.fontSize !== undefined) {
      if (typeof preferences.fontSize !== 'number') {
        errors.push('Font size must be a number');
      } else if (preferences.fontSize < this.MIN_FONT_SIZE || preferences.fontSize > this.MAX_FONT_SIZE) {
        errors.push(`Font size must be between ${this.MIN_FONT_SIZE} and ${this.MAX_FONT_SIZE}`);
      }
    }

    return errors;
  }

  static sanitize(preferences: Partial<UserPreferences>): UserPreferences {
    return {
      theme: this.isValidTheme(preferences.theme) ? preferences.theme! : 'auto',
      notifications: typeof preferences.notifications === 'boolean' ? preferences.notifications : true,
      language: this.isValidLanguage(preferences.language) ? preferences.language! : 'en',
      fontSize: this.isValidFontSize(preferences.fontSize) ? preferences.fontSize! : 16
    };
  }

  private static isValidTheme(theme: any): theme is UserPreferences['theme'] {
    return ['light', 'dark', 'auto'].includes(theme);
  }

  private static isValidLanguage(language: any): boolean {
    return typeof language === 'string' && this.SUPPORTED_LANGUAGES.includes(language);
  }

  private static isValidFontSize(size: any): boolean {
    return typeof size === 'number' && size >= this.MIN_FONT_SIZE && size <= this.MAX_FONT_SIZE;
  }
}

export { UserPreferences, PreferencesValidator };