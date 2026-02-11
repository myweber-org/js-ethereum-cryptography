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