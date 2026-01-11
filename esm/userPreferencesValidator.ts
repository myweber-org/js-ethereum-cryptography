
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class PreferenceError extends Error {
  constructor(message: string, public field: keyof UserPreferences) {
    super(message);
    this.name = 'PreferenceError';
  }
}

class UserPreferencesValidator {
  private static readonly MIN_FONT_SIZE = 12;
  private static readonly MAX_FONT_SIZE = 24;
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de'];

  validate(preferences: Partial<UserPreferences>): UserPreferences {
    const validated: UserPreferences = {
      theme: this.validateTheme(preferences.theme),
      notifications: this.validateNotifications(preferences.notifications),
      language: this.validateLanguage(preferences.language),
      fontSize: this.validateFontSize(preferences.fontSize)
    };

    return validated;
  }

  private validateTheme(theme?: string): UserPreferences['theme'] {
    if (!theme) {
      throw new PreferenceError('Theme is required', 'theme');
    }

    if (!['light', 'dark', 'auto'].includes(theme)) {
      throw new PreferenceError(`Invalid theme: ${theme}. Must be 'light', 'dark', or 'auto'`, 'theme');
    }

    return theme as UserPreferences['theme'];
  }

  private validateNotifications(notifications?: boolean): boolean {
    if (notifications === undefined) {
      throw new PreferenceError('Notifications preference is required', 'notifications');
    }

    return notifications;
  }

  private validateLanguage(language?: string): string {
    if (!language) {
      throw new PreferenceError('Language is required', 'language');
    }

    if (!UserPreferencesValidator.SUPPORTED_LANGUAGES.includes(language)) {
      throw new PreferenceError(
        `Unsupported language: ${language}. Supported: ${UserPreferencesValidator.SUPPORTED_LANGUAGES.join(', ')}`,
        'language'
      );
    }

    return language;
  }

  private validateFontSize(fontSize?: number): number {
    if (fontSize === undefined) {
      throw new PreferenceError('Font size is required', 'fontSize');
    }

    if (!Number.isInteger(fontSize)) {
      throw new PreferenceError('Font size must be an integer', 'fontSize');
    }

    if (fontSize < UserPreferencesValidator.MIN_FONT_SIZE || fontSize > UserPreferencesValidator.MAX_FONT_SIZE) {
      throw new PreferenceError(
        `Font size must be between ${UserPreferencesValidator.MIN_FONT_SIZE} and ${UserPreferencesValidator.MAX_FONT_SIZE}`,
        'fontSize'
      );
    }

    return fontSize;
  }
}

export { UserPreferencesValidator, PreferenceError, UserPreferences };typescript
interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
    language: string;
    fontSize: number;
}

class PreferenceValidator {
    private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja'];
    private static readonly MIN_FONT_SIZE = 12;
    private static readonly MAX_FONT_SIZE = 24;

    static validate(prefs: UserPreferences): string[] {
        const errors: string[] = [];

        if (!['light', 'dark', 'auto'].includes(prefs.theme)) {
            errors.push(`Invalid theme: ${prefs.theme}. Must be 'light', 'dark', or 'auto'.`);
        }

        if (typeof prefs.notifications !== 'boolean') {
            errors.push('Notifications must be a boolean value.');
        }

        if (!PreferenceValidator.SUPPORTED_LANGUAGES.includes(prefs.language)) {
            errors.push(`Unsupported language: ${prefs.language}. Supported: ${PreferenceValidator.SUPPORTED_LANGUAGES.join(', ')}`);
        }

        if (prefs.fontSize < PreferenceValidator.MIN_FONT_SIZE || prefs.fontSize > PreferenceValidator.MAX_FONT_SIZE) {
            errors.push(`Font size ${prefs.fontSize} is out of range. Must be between ${PreferenceValidator.MIN_FONT_SIZE} and ${PreferenceValidator.MAX_FONT_SIZE}.`);
        }

        return errors;
    }

    static validateAndThrow(prefs: UserPreferences): void {
        const errors = this.validate(prefs);
        if (errors.length > 0) {
            throw new Error(`Validation failed:\n${errors.join('\n')}`);
        }
    }
}

function processUserPreferences(prefs: UserPreferences): void {
    try {
        PreferenceValidator.validateAndThrow(prefs);
        console.log('Preferences validated successfully:', prefs);
    } catch (error) {
        console.error('Failed to process preferences:', error.message);
    }
}

const validPrefs: UserPreferences = {
    theme: 'dark',
    notifications: true,
    language: 'en',
    fontSize: 16
};

const invalidPrefs: UserPreferences = {
    theme: 'blue',
    notifications: 'yes',
    language: 'zh',
    fontSize: 8
};

processUserPreferences(validPrefs);
processUserPreferences(invalidPrefs);
```