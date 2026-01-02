interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  resultsPerPage: number;
}

class PreferenceValidator {
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de'];
  private static readonly MIN_RESULTS = 1;
  private static readonly MAX_RESULTS = 100;

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

    if (!Number.isInteger(prefs.resultsPerPage) || 
        prefs.resultsPerPage < PreferenceValidator.MIN_RESULTS || 
        prefs.resultsPerPage > PreferenceValidator.MAX_RESULTS) {
      errors.push(`Results per page must be an integer between ${PreferenceValidator.MIN_RESULTS} and ${PreferenceValidator.MAX_RESULTS}.`);
    }

    return errors;
  }

  static validateAndThrow(prefs: UserPreferences): void {
    const errors = this.validate(prefs);
    if (errors.length > 0) {
      throw new Error(`Validation failed:\n${errors.join('\n')}`);
    }
  }
}

export { UserPreferences, PreferenceValidator };