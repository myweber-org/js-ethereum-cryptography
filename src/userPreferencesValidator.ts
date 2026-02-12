interface UserPreferences {
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

  if (typeof validated.language !== 'string' || validated.language.length === 0) {
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

const safeValidatePreferences = (prefs: Partial<UserPreferences>): { success: boolean; data?: UserPreferences; error?: string } => {
  try {
    const validated = validateUserPreferences(prefs);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof PreferenceValidationError) {
      return { 
        success: false, 
        error: `Validation failed for field "${error.field}": ${error.message}` 
      };
    }
    return { success: false, error: 'Unknown validation error occurred' };
  }
};

export { validateUserPreferences, safeValidatePreferences, PreferenceValidationError };
export type { UserPreferences };
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class PreferenceValidator {
  private static readonly MIN_FONT_SIZE = 12;
  private static readonly MAX_FONT_SIZE = 24;
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de'];

  static validate(prefs: UserPreferences): string[] {
    const errors: string[] = [];

    if (!['light', 'dark', 'auto'].includes(prefs.theme)) {
      errors.push(`Invalid theme: ${prefs.theme}. Must be 'light', 'dark', or 'auto'`);
    }

    if (typeof prefs.notifications !== 'boolean') {
      errors.push('Notifications must be a boolean value');
    }

    if (!PreferenceValidator.SUPPORTED_LANGUAGES.includes(prefs.language)) {
      errors.push(`Unsupported language: ${prefs.language}`);
    }

    if (prefs.fontSize < PreferenceValidator.MIN_FONT_SIZE || 
        prefs.fontSize > PreferenceValidator.MAX_FONT_SIZE) {
      errors.push(`Font size ${prefs.fontSize} is out of range (${PreferenceValidator.MIN_FONT_SIZE}-${PreferenceValidator.MAX_FONT_SIZE})`);
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