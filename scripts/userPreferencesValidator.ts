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

function validateUserPreferences(prefs: UserPreferences): void {
  const validThemes = ['light', 'dark', 'auto'];
  const validLanguages = ['en', 'es', 'fr', 'de'];
  const minFontSize = 12;
  const maxFontSize = 24;

  if (!validThemes.includes(prefs.theme)) {
    throw new PreferenceValidationError(
      `Invalid theme: ${prefs.theme}. Must be one of: ${validThemes.join(', ')}`
    );
  }

  if (!validLanguages.includes(prefs.language)) {
    throw new PreferenceValidationError(
      `Invalid language: ${prefs.language}. Must be one of: ${validLanguages.join(', ')}`
    );
  }

  if (prefs.fontSize < minFontSize || prefs.fontSize > maxFontSize) {
    throw new PreferenceValidationError(
      `Font size ${prefs.fontSize} is out of range. Must be between ${minFontSize} and ${maxFontSize}`
    );
  }

  if (typeof prefs.notifications !== 'boolean') {
    throw new PreferenceValidationError('Notifications must be a boolean value');
  }
}

function saveUserPreferences(prefs: UserPreferences): boolean {
  try {
    validateUserPreferences(prefs);
    console.log('Preferences validated successfully');
    return true;
  } catch (error) {
    if (error instanceof PreferenceValidationError) {
      console.error('Validation failed:', error.message);
      return false;
    }
    throw error;
  }
}

export { UserPreferences, validateUserPreferences, saveUserPreferences, PreferenceValidationError };typescript
interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
    language: string;
    fontSize: number;
}

class PreferenceValidator {
    private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja'];
    private static readonly MIN_FONT_SIZE = 8;
    private static readonly MAX_FONT_SIZE = 72;

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

        if (!Number.isInteger(prefs.fontSize)) {
            errors.push('Font size must be an integer.');
        }

        return errors;
    }

    static validateAndThrow(prefs: UserPreferences): void {
        const errors = this.validate(prefs);
        if (errors.length > 0) {
            throw new Error(`Invalid preferences:\n${errors.join('\n')}`);
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
    fontSize: 14
};

const invalidPrefs: UserPreferences = {
    theme: 'blue' as any,
    notifications: 'yes' as any,
    language: 'zh',
    fontSize: 100
};

processUserPreferences(validPrefs);
processUserPreferences(invalidPrefs);
```