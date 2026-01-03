typescript
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  timezone: string;
}

class PreferenceValidator {
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja'];
  private static readonly VALID_TIMEZONES = /^[A-Za-z_]+\/[A-Za-z_]+$/;

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

    if (!PreferenceValidator.VALID_TIMEZONES.test(prefs.timezone)) {
      errors.push('Timezone must be in format Area/Location (e.g., America/New_York)');
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

// Example usage
const samplePreferences: UserPreferences = {
  theme: 'dark',
  notifications: true,
  language: 'fr',
  timezone: 'Europe/Paris'
};

try {
  PreferenceValidator.validateAndThrow(samplePreferences);
  console.log('Preferences are valid');
} catch (error) {
  console.error('Validation failed:', error.message);
}

export { UserPreferences, PreferenceValidator };
```
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class PreferenceError extends Error {
  constructor(message: string, public field: string) {
    super(message);
    this.name = 'PreferenceError';
  }
}

function validateUserPreferences(prefs: UserPreferences): void {
  const validThemes = ['light', 'dark', 'auto'];
  const validLanguages = ['en', 'es', 'fr', 'de'];
  const minFontSize = 12;
  const maxFontSize = 24;

  if (!validThemes.includes(prefs.theme)) {
    throw new PreferenceError(
      `Theme must be one of: ${validThemes.join(', ')}`,
      'theme'
    );
  }

  if (typeof prefs.notifications !== 'boolean') {
    throw new PreferenceError('Notifications must be a boolean value', 'notifications');
  }

  if (!validLanguages.includes(prefs.language)) {
    throw new PreferenceError(
      `Language must be one of: ${validLanguages.join(', ')}`,
      'language'
    );
  }

  if (prefs.fontSize < minFontSize || prefs.fontSize > maxFontSize) {
    throw new PreferenceError(
      `Font size must be between ${minFontSize} and ${maxFontSize}`,
      'fontSize'
    );
  }
}

function saveUserPreferences(prefs: UserPreferences): { success: boolean; error?: string } {
  try {
    validateUserPreferences(prefs);
    // Simulate saving to database
    console.log('Preferences saved successfully:', prefs);
    return { success: true };
  } catch (error) {
    if (error instanceof PreferenceError) {
      return {
        success: false,
        error: `Validation failed for field "${error.field}": ${error.message}`
      };
    }
    return {
      success: false,
      error: 'An unexpected error occurred'
    };
  }
}

export { UserPreferences, validateUserPreferences, saveUserPreferences, PreferenceError };