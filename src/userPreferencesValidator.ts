
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class PreferenceValidator {
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de'];
  private static readonly MIN_FONT_SIZE = 12;
  private static readonly MAX_FONT_SIZE = 24;

  static validate(preferences: Partial<UserPreferences>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (preferences.theme !== undefined && !['light', 'dark', 'auto'].includes(preferences.theme)) {
      errors.push(`Invalid theme: ${preferences.theme}. Must be 'light', 'dark', or 'auto'.`);
    }

    if (preferences.notifications !== undefined && typeof preferences.notifications !== 'boolean') {
      errors.push('Notifications must be a boolean value.');
    }

    if (preferences.language !== undefined) {
      if (typeof preferences.language !== 'string') {
        errors.push('Language must be a string.');
      } else if (!this.SUPPORTED_LANGUAGES.includes(preferences.language)) {
        errors.push(`Unsupported language: ${preferences.language}. Supported: ${this.SUPPORTED_LANGUAGES.join(', ')}`);
      }
    }

    if (preferences.fontSize !== undefined) {
      if (typeof preferences.fontSize !== 'number') {
        errors.push('Font size must be a number.');
      } else if (preferences.fontSize < this.MIN_FONT_SIZE || preferences.fontSize > this.MAX_FONT_SIZE) {
        errors.push(`Font size must be between ${this.MIN_FONT_SIZE} and ${this.MAX_FONT_SIZE}.`);
      }
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
      fontSize: 16
    };
  }
}

function mergePreferences(newPreferences: Partial<UserPreferences>, currentPreferences: UserPreferences): UserPreferences {
  const validation = PreferenceValidator.validate(newPreferences);
  
  if (!validation.isValid) {
    throw new Error(`Invalid preferences: ${validation.errors.join(' ')}`);
  }

  return {
    ...currentPreferences,
    ...newPreferences
  };
}

export { UserPreferences, PreferenceValidator, mergePreferences };