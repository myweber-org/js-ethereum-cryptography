typescript
interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
    language: string;
    timezone: string;
}

class PreferencesValidator {
    private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja'];
    private static readonly VALID_TIMEZONES = /^[A-Za-z_]+\/[A-Za-z_]+$/;

    static validate(preferences: Partial<UserPreferences>): string[] {
        const errors: string[] = [];

        if (preferences.theme !== undefined) {
            if (!['light', 'dark', 'auto'].includes(preferences.theme)) {
                errors.push(`Invalid theme value: ${preferences.theme}. Must be 'light', 'dark', or 'auto'.`);
            }
        }

        if (preferences.notifications !== undefined) {
            if (typeof preferences.notifications !== 'boolean') {
                errors.push('Notifications must be a boolean value.');
            }
        }

        if (preferences.language !== undefined) {
            if (!PreferencesValidator.SUPPORTED_LANGUAGES.includes(preferences.language)) {
                errors.push(`Unsupported language: ${preferences.language}. Supported languages: ${PreferencesValidator.SUPPORTED_LANGUAGES.join(', ')}`);
            }
        }

        if (preferences.timezone !== undefined) {
            if (!PreferencesValidator.VALID_TIMEZONES.test(preferences.timezone)) {
                errors.push(`Invalid timezone format: ${preferences.timezone}. Expected format: Area/Location`);
            }
        }

        return errors;
    }

    static validateAndThrow(preferences: Partial<UserPreferences>): void {
        const errors = this.validate(preferences);
        if (errors.length > 0) {
            throw new Error(`Validation failed:\n${errors.join('\n')}`);
        }
    }
}

function updateUserPreferences(preferences: Partial<UserPreferences>): void {
    try {
        PreferencesValidator.validateAndThrow(preferences);
        console.log('Preferences updated successfully:', preferences);
    } catch (error) {
        console.error('Failed to update preferences:', error.message);
    }
}

// Example usage
const validPreferences = {
    theme: 'dark',
    notifications: true,
    language: 'en',
    timezone: 'America/New_York'
};

const invalidPreferences = {
    theme: 'purple',
    notifications: 'yes',
    language: 'xx',
    timezone: 'InvalidZone'
};

updateUserPreferences(validPreferences);
updateUserPreferences(invalidPreferences);
```
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
      errors.push(`Invalid theme: ${prefs.theme}. Must be 'light', 'dark', or 'auto'.`);
    }

    if (typeof prefs.notifications !== 'boolean') {
      errors.push('Notifications must be a boolean value.');
    }

    if (!PreferenceValidator.SUPPORTED_LANGUAGES.includes(prefs.language)) {
      errors.push(`Unsupported language: ${prefs.language}. Supported: ${PreferenceValidator.SUPPORTED_LANGUAGES.join(', ')}`);
    }

    if (prefs.fontSize < PreferenceValidator.MIN_FONT_SIZE || prefs.fontSize > PreferenceValidator.MAX_FONT_SIZE) {
      errors.push(`Font size ${prefs.fontSize} out of range. Must be between ${PreferenceValidator.MIN_FONT_SIZE} and ${PreferenceValidator.MAX_FONT_SIZE}.`);
    }

    return errors;
  }
}

function validateAndApplyPreferences(prefs: UserPreferences): void {
  const validationErrors = PreferenceValidator.validate(prefs);
  
  if (validationErrors.length > 0) {
    console.error('Validation failed:');
    validationErrors.forEach(error => console.error(`- ${error}`));
    return;
  }

  console.log('Preferences applied successfully:');
  console.log(`Theme: ${prefs.theme}`);
  console.log(`Notifications: ${prefs.notifications ? 'Enabled' : 'Disabled'}`);
  console.log(`Language: ${prefs.language}`);
  console.log(`Font Size: ${prefs.fontSize}px`);
}

const testPreferences: UserPreferences = {
  theme: 'dark',
  notifications: true,
  language: 'fr',
  fontSize: 16
};

validateAndApplyPreferences(testPreferences);