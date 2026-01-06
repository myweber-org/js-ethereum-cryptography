interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
  twoFactorAuth: boolean;
}

class PreferenceValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PreferenceValidationError';
  }
}

class UserPreferencesValidator {
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja'];
  private static readonly MIN_FONT_SIZE = 12;
  private static readonly MAX_FONT_SIZE = 24;

  static validate(preferences: Partial<UserPreferences>): UserPreferences {
    const validated: UserPreferences = {
      theme: this.validateTheme(preferences.theme),
      notifications: this.validateBoolean(preferences.notifications, 'notifications'),
      language: this.validateLanguage(preferences.language),
      fontSize: this.validateFontSize(preferences.fontSize),
      twoFactorAuth: this.validateBoolean(preferences.twoFactorAuth, 'twoFactorAuth')
    };

    return validated;
  }

  private static validateTheme(theme?: string): 'light' | 'dark' | 'auto' {
    if (!theme) {
      return 'auto';
    }

    if (theme === 'light' || theme === 'dark' || theme === 'auto') {
      return theme;
    }

    throw new PreferenceValidationError(
      `Invalid theme: "${theme}". Must be one of: light, dark, auto`
    );
  }

  private static validateBoolean(value: unknown, fieldName: string): boolean {
    if (typeof value === 'boolean') {
      return value;
    }

    if (value === undefined) {
      return false;
    }

    throw new PreferenceValidationError(
      `Invalid value for ${fieldName}: must be a boolean`
    );
  }

  private static validateLanguage(language?: string): string {
    if (!language) {
      return 'en';
    }

    if (this.SUPPORTED_LANGUAGES.includes(language)) {
      return language;
    }

    throw new PreferenceValidationError(
      `Unsupported language: "${language}". Supported languages: ${this.SUPPORTED_LANGUAGES.join(', ')}`
    );
  }

  private static validateFontSize(size?: number): number {
    if (size === undefined) {
      return 16;
    }

    if (typeof size !== 'number' || isNaN(size)) {
      throw new PreferenceValidationError('Font size must be a number');
    }

    if (size < this.MIN_FONT_SIZE || size > this.MAX_FONT_SIZE) {
      throw new PreferenceValidationError(
        `Font size must be between ${this.MIN_FONT_SIZE} and ${this.MAX_FONT_SIZE}`
      );
    }

    return Math.round(size);
  }
}

export { UserPreferencesValidator, PreferenceValidationError, UserPreferences };