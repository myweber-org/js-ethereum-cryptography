
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
      errors.push('Theme must be light, dark, or auto');
    }

    if (typeof prefs.notifications !== 'boolean') {
      errors.push('Notifications must be a boolean value');
    }

    if (!PreferenceValidator.SUPPORTED_LANGUAGES.includes(prefs.language)) {
      errors.push(`Language must be one of: ${PreferenceValidator.SUPPORTED_LANGUAGES.join(', ')}`);
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
      throw new Error(`Invalid preferences: ${errors.join('; ')}`);
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
  constructor(message: string) {
    super(message);
    this.name = 'PreferenceValidationError';
  }
}

function validateUserPreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const defaults: UserPreferences = {
    theme: 'auto',
    notifications: true,
    language: 'en',
    fontSize: 14
  };

  const validated: UserPreferences = { ...defaults, ...prefs };

  if (!['light', 'dark', 'auto'].includes(validated.theme)) {
    throw new PreferenceValidationError(`Invalid theme: ${validated.theme}`);
  }

  if (typeof validated.notifications !== 'boolean') {
    throw new PreferenceValidationError('Notifications must be boolean');
  }

  if (typeof validated.language !== 'string' || validated.language.length < 2) {
    throw new PreferenceValidationError('Language must be at least 2 characters');
  }

  if (typeof validated.fontSize !== 'number' || validated.fontSize < 8 || validated.fontSize > 72) {
    throw new PreferenceValidationError('Font size must be between 8 and 72');
  }

  return validated;
}

export { validateUserPreferences, PreferenceValidationError, UserPreferences };
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class PreferenceValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PreferenceValidationError';
  }
}

function validateUserPreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const defaultPreferences: UserPreferences = {
    theme: 'auto',
    notifications: true,
    language: 'en',
    fontSize: 14
  };

  const validated: UserPreferences = { ...defaultPreferences, ...prefs };

  if (!['light', 'dark', 'auto'].includes(validated.theme)) {
    throw new PreferenceValidationError(
      `Invalid theme '${validated.theme}'. Must be 'light', 'dark', or 'auto'.`
    );
  }

  if (typeof validated.notifications !== 'boolean') {
    throw new PreferenceValidationError('Notifications must be a boolean value.');
  }

  if (typeof validated.language !== 'string' || validated.language.length !== 2) {
    throw new PreferenceValidationError('Language must be a 2-character ISO code.');
  }

  if (typeof validated.fontSize !== 'number' || validated.fontSize < 8 || validated.fontSize > 72) {
    throw new PreferenceValidationError('Font size must be between 8 and 72.');
  }

  return validated;
}

function saveUserPreferences(prefs: Partial<UserPreferences>): void {
  try {
    const validated = validateUserPreferences(prefs);
    console.log('Preferences saved successfully:', validated);
  } catch (error) {
    if (error instanceof PreferenceValidationError) {
      console.error('Validation failed:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
  }
}
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

  static validate(prefs: Partial<UserPreferences>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (prefs.theme !== undefined && !['light', 'dark', 'auto'].includes(prefs.theme)) {
      errors.push(`Invalid theme: ${prefs.theme}. Must be 'light', 'dark', or 'auto'.`);
    }

    if (prefs.language !== undefined && !PreferenceValidator.SUPPORTED_LANGUAGES.includes(prefs.language)) {
      errors.push(`Unsupported language: ${prefs.language}. Supported: ${PreferenceValidator.SUPPORTED_LANGUAGES.join(', ')}`);
    }

    if (prefs.itemsPerPage !== undefined) {
      if (!Number.isInteger(prefs.itemsPerPage)) {
        errors.push('itemsPerPage must be an integer');
      } else if (prefs.itemsPerPage < PreferenceValidator.MIN_ITEMS_PER_PAGE || prefs.itemsPerPage > PreferenceValidator.MAX_ITEMS_PER_PAGE) {
        errors.push(`itemsPerPage must be between ${PreferenceValidator.MIN_ITEMS_PER_PAGE} and ${PreferenceValidator.MAX_ITEMS_PER_PAGE}`);
      }
    }

    if (prefs.notifications !== undefined && typeof prefs.notifications !== 'boolean') {
      errors.push('notifications must be a boolean value');
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

  static mergeWithDefaults(partialPrefs: Partial<UserPreferences>): UserPreferences {
    const defaults = PreferenceValidator.getDefaultPreferences();
    return { ...defaults, ...partialPrefs };
  }
}

export { UserPreferences, PreferenceValidator };