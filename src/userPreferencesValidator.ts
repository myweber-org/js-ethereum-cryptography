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