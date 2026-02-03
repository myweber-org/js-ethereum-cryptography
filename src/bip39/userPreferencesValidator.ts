
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
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class PreferenceValidationError extends Error {
  constructor(
    public field: keyof UserPreferences,
    message: string
  ) {
    super(message);
    this.name = 'PreferenceValidationError';
  }
}

export function validateUserPreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const defaults: UserPreferences = {
    theme: 'auto',
    notifications: true,
    language: 'en',
    fontSize: 14
  };

  const validated: UserPreferences = { ...defaults, ...prefs };

  if (!['light', 'dark', 'auto'].includes(validated.theme)) {
    throw new PreferenceValidationError('theme', 'Theme must be light, dark, or auto');
  }

  if (typeof validated.notifications !== 'boolean') {
    throw new PreferenceValidationError('notifications', 'Notifications must be boolean');
  }

  if (!validated.language || validated.language.trim().length === 0) {
    throw new PreferenceValidationError('language', 'Language must be non-empty string');
  }

  if (validated.fontSize < 8 || validated.fontSize > 72) {
    throw new PreferenceValidationError('fontSize', 'Font size must be between 8 and 72');
  }

  if (!Number.isInteger(validated.fontSize)) {
    throw new PreferenceValidationError('fontSize', 'Font size must be integer');
  }

  return validated;
}

export function safeValidatePreferences(
  prefs: Partial<UserPreferences>
): { success: true; data: UserPreferences } | { success: false; error: PreferenceValidationError } {
  try {
    const validated = validateUserPreferences(prefs);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof PreferenceValidationError) {
      return { success: false, error };
    }
    throw error;
  }
}