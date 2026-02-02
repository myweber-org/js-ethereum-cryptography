
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  itemsPerPage: number;
  timezone?: string;
}

class UserPreferencesValidator {
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja'];
  private static readonly MIN_ITEMS_PER_PAGE = 5;
  private static readonly MAX_ITEMS_PER_PAGE = 100;

  static validate(preferences: Partial<UserPreferences>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (preferences.theme !== undefined) {
      if (!['light', 'dark', 'auto'].includes(preferences.theme)) {
        errors.push(`Invalid theme: ${preferences.theme}. Must be 'light', 'dark', or 'auto'.`);
      }
    }

    if (preferences.language !== undefined) {
      if (!UserPreferencesValidator.SUPPORTED_LANGUAGES.includes(preferences.language)) {
        errors.push(`Unsupported language: ${preferences.language}. Supported languages: ${UserPreferencesValidator.SUPPORTED_LANGUAGES.join(', ')}`);
      }
    }

    if (preferences.itemsPerPage !== undefined) {
      if (!Number.isInteger(preferences.itemsPerPage)) {
        errors.push(`itemsPerPage must be an integer, received: ${preferences.itemsPerPage}`);
      } else if (preferences.itemsPerPage < UserPreferencesValidator.MIN_ITEMS_PER_PAGE || 
                 preferences.itemsPerPage > UserPreferencesValidator.MAX_ITEMS_PER_PAGE) {
        errors.push(`itemsPerPage must be between ${UserPreferencesValidator.MIN_ITEMS_PER_PAGE} and ${UserPreferencesValidator.MAX_ITEMS_PER_PAGE}, received: ${preferences.itemsPerPage}`);
      }
    }

    if (preferences.timezone !== undefined && preferences.timezone.trim() === '') {
      errors.push('Timezone cannot be empty if provided');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static getDefaultPreferences(): UserPreferences {
    return {
      theme: 'auto',
      notifications: true,
      language: 'en',
      itemsPerPage: 20
    };
  }
}

export { UserPreferences, UserPreferencesValidator };