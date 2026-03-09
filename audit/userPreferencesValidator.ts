
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  itemsPerPage: number;
  timezone?: string;
}

class PreferenceValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PreferenceValidationError';
  }
}

class UserPreferencesValidator {
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja'];
  private static readonly MAX_ITEMS_PER_PAGE = 100;
  private static readonly MIN_ITEMS_PER_PAGE = 5;

  static validate(preferences: Partial<UserPreferences>): UserPreferences {
    const validated: UserPreferences = {
      theme: this.validateTheme(preferences.theme),
      notifications: this.validateNotifications(preferences.notifications),
      language: this.validateLanguage(preferences.language),
      itemsPerPage: this.validateItemsPerPage(preferences.itemsPerPage),
      timezone: preferences.timezone
    };

    return validated;
  }

  private static validateTheme(theme?: string): 'light' | 'dark' | 'auto' {
    if (!theme || !['light', 'dark', 'auto'].includes(theme)) {
      return 'auto';
    }
    return theme as 'light' | 'dark' | 'auto';
  }

  private static validateNotifications(notifications?: boolean): boolean {
    return notifications !== undefined ? notifications : true;
  }

  private static validateLanguage(language?: string): string {
    if (!language || !this.SUPPORTED_LANGUAGES.includes(language)) {
      return 'en';
    }
    return language;
  }

  private static validateItemsPerPage(items?: number): number {
    if (items === undefined) {
      return 20;
    }

    if (!Number.isInteger(items) || items < this.MIN_ITEMS_PER_PAGE) {
      throw new PreferenceValidationError(
        `Items per page must be an integer greater than or equal to ${this.MIN_ITEMS_PER_PAGE}`
      );
    }

    if (items > this.MAX_ITEMS_PER_PAGE) {
      throw new PreferenceValidationError(
        `Items per page cannot exceed ${this.MAX_ITEMS_PER_PAGE}`
      );
    }

    return items;
  }
}

export { UserPreferencesValidator, PreferenceValidationError, UserPreferences };