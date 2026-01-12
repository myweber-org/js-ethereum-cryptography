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

    static validate(prefs: Partial<UserPreferences>): string[] {
        const errors: string[] = [];

        if (prefs.theme !== undefined) {
            if (!['light', 'dark', 'auto'].includes(prefs.theme)) {
                errors.push(`Invalid theme: ${prefs.theme}. Must be 'light', 'dark', or 'auto'`);
            }
        }

        if (prefs.language !== undefined) {
            if (!PreferenceValidator.SUPPORTED_LANGUAGES.includes(prefs.language)) {
                errors.push(`Unsupported language: ${prefs.language}. Supported: ${PreferenceValidator.SUPPORTED_LANGUAGES.join(', ')}`);
            }
        }

        if (prefs.timezone !== undefined) {
            if (!PreferenceValidator.VALID_TIMEZONES.test(prefs.timezone)) {
                errors.push(`Invalid timezone format: ${prefs.timezone}. Expected format: Area/Location`);
            }
        }

        if (prefs.notifications !== undefined && typeof prefs.notifications !== 'boolean') {
            errors.push('Notifications must be a boolean value');
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

function updateUserPreferences(prefs: Partial<UserPreferences>): void {
    try {
        PreferenceValidator.validateAndThrow(prefs);
        console.log('Preferences updated successfully:', prefs);
    } catch (error) {
        console.error('Failed to update preferences:', error.message);
    }
}

// Example usage
const testPreferences = {
    theme: 'dark',
    language: 'fr',
    timezone: 'Europe/Paris',
    notifications: true
};

updateUserPreferences(testPreferences);

const invalidPreferences = {
    theme: 'purple',
    language: 'xx',
    timezone: 'InvalidZone'
};

updateUserPreferences(invalidPreferences);
```interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class ValidationError extends Error {
  constructor(
    public field: string,
    message: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function validateUserPreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const errors: ValidationError[] = [];

  if (!prefs.theme || !['light', 'dark', 'auto'].includes(prefs.theme)) {
    errors.push(new ValidationError('theme', 'Theme must be light, dark, or auto'));
  }

  if (typeof prefs.notifications !== 'boolean') {
    errors.push(new ValidationError('notifications', 'Notifications must be a boolean'));
  }

  if (!prefs.language || typeof prefs.language !== 'string' || prefs.language.length < 2) {
    errors.push(new ValidationError('language', 'Language must be a string with at least 2 characters'));
  }

  if (typeof prefs.fontSize !== 'number' || prefs.fontSize < 8 || prefs.fontSize > 72) {
    errors.push(new ValidationError('fontSize', 'Font size must be between 8 and 72'));
  }

  if (errors.length > 0) {
    const errorDetails = errors.map(e => `${e.field}: ${e.message}`).join('; ');
    throw new Error(`Validation failed: ${errorDetails}`);
  }

  return prefs as UserPreferences;
}

export function createDefaultPreferences(): UserPreferences {
  return {
    theme: 'auto',
    notifications: true,
    language: 'en',
    fontSize: 16
  };
}