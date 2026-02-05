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

    static validate(prefs: UserPreferences): string[] {
        const errors: string[] = [];

        if (!['light', 'dark', 'auto'].includes(prefs.theme)) {
            errors.push('Theme must be one of: light, dark, auto');
        }

        if (typeof prefs.notifications !== 'boolean') {
            errors.push('Notifications must be a boolean value');
        }

        if (!PreferencesValidator.SUPPORTED_LANGUAGES.includes(prefs.language)) {
            errors.push(`Language must be one of: ${PreferencesValidator.SUPPORTED_LANGUAGES.join(', ')}`);
        }

        if (!PreferencesValidator.VALID_TIMEZONES.test(prefs.timezone)) {
            errors.push('Timezone must be in format: Area/Location (e.g., America/New_York)');
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

export { UserPreferences, PreferencesValidator };
```