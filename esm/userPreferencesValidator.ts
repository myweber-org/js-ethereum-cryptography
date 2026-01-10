
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

export { UserPreferencesValidator, PreferenceError, UserPreferences };