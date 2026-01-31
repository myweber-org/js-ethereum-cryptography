
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  itemsPerPage: number;
}

class PreferenceValidator {
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja'];
  private static readonly MIN_ITEMS_PER_PAGE = 5;
  private static readonly MAX_ITEMS_PER_PAGE = 100;

  static validate(prefs: Partial<UserPreferences>): string[] {
    const errors: string[] = [];

    if (prefs.theme !== undefined) {
      if (!['light', 'dark', 'auto'].includes(prefs.theme)) {
        errors.push(`Invalid theme '${prefs.theme}'. Must be 'light', 'dark', or 'auto'.`);
      }
    }

    if (prefs.language !== undefined) {
      if (!PreferenceValidator.SUPPORTED_LANGUAGES.includes(prefs.language)) {
        errors.push(`Unsupported language '${prefs.language}'. Supported: ${PreferenceValidator.SUPPORTED_LANGUAGES.join(', ')}.`);
      }
    }

    if (prefs.itemsPerPage !== undefined) {
      if (!Number.isInteger(prefs.itemsPerPage)) {
        errors.push('Items per page must be an integer.');
      } else if (prefs.itemsPerPage < PreferenceValidator.MIN_ITEMS_PER_PAGE) {
        errors.push(`Items per page must be at least ${PreferenceValidator.MIN_ITEMS_PER_PAGE}.`);
      } else if (prefs.itemsPerPage > PreferenceValidator.MAX_ITEMS_PER_PAGE) {
        errors.push(`Items per page cannot exceed ${PreferenceValidator.MAX_ITEMS_PER_PAGE}.`);
      }
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

function updateUserPreferences(newPrefs: Partial<UserPreferences>): void {
  try {
    PreferenceValidator.validateAndThrow(newPrefs);
    console.log('Preferences updated successfully:', newPrefs);
  } catch (error) {
    console.error('Failed to update preferences:', error.message);
  }
}

export { UserPreferences, PreferenceValidator, updateUserPreferences };