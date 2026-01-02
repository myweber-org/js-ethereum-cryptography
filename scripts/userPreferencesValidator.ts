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

const validateUserPreferences = (prefs: UserPreferences): void => {
  const validThemes = ['light', 'dark', 'auto'];
  
  if (!validThemes.includes(prefs.theme)) {
    throw new PreferenceValidationError(
      `Theme must be one of: ${validThemes.join(', ')}`
    );
  }

  if (typeof prefs.notifications !== 'boolean') {
    throw new PreferenceValidationError('Notifications must be a boolean value');
  }

  if (!prefs.language || prefs.language.trim().length === 0) {
    throw new PreferenceValidationError('Language must be specified');
  }

  if (prefs.fontSize < 12 || prefs.fontSize > 24) {
    throw new PreferenceValidationError('Font size must be between 12 and 24');
  }

  if (!Number.isInteger(prefs.fontSize)) {
    throw new PreferenceValidationError('Font size must be an integer');
  }
};

const validatePreferencesWithFallback = (
  prefs: Partial<UserPreferences>
): UserPreferences => {
  const defaultPreferences: UserPreferences = {
    theme: 'auto',
    notifications: true,
    language: 'en',
    fontSize: 16
  };

  const mergedPreferences = { ...defaultPreferences, ...prefs };

  try {
    validateUserPreferences(mergedPreferences);
    return mergedPreferences;
  } catch (error) {
    if (error instanceof PreferenceValidationError) {
      console.warn(`Invalid preferences: ${error.message}. Using defaults.`);
      return defaultPreferences;
    }
    throw error;
  }
};

export { validateUserPreferences, validatePreferencesWithFallback, PreferenceValidationError };
export type { UserPreferences };
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  timezone: string;
}

class PreferenceValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PreferenceValidationError';
  }
}

class UserPreferencesValidator {
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja'];
  private static readonly VALID_TIMEZONES = /^[A-Za-z_]+\/[A-Za-z_]+$/;

  static validate(preferences: Partial<UserPreferences>): UserPreferences {
    const validated: UserPreferences = {
      theme: this.validateTheme(preferences.theme),
      notifications: this.validateNotifications(preferences.notifications),
      language: this.validateLanguage(preferences.language),
      timezone: this.validateTimezone(preferences.timezone)
    };

    return validated;
  }

  private static validateTheme(theme?: string): UserPreferences['theme'] {
    if (!theme) {
      throw new PreferenceValidationError('Theme is required');
    }

    if (theme !== 'light' && theme !== 'dark' && theme !== 'auto') {
      throw new PreferenceValidationError(
        `Invalid theme '${theme}'. Must be 'light', 'dark', or 'auto'`
      );
    }

    return theme as UserPreferences['theme'];
  }

  private static validateNotifications(notifications?: boolean): boolean {
    if (notifications === undefined || notifications === null) {
      throw new PreferenceValidationError('Notifications preference is required');
    }

    return notifications;
  }

  private static validateLanguage(language?: string): string {
    if (!language) {
      throw new PreferenceValidationError('Language is required');
    }

    if (!this.SUPPORTED_LANGUAGES.includes(language)) {
      throw new PreferenceValidationError(
        `Language '${language}' is not supported. Supported languages: ${this.SUPPORTED_LANGUAGES.join(', ')}`
      );
    }

    return language;
  }

  private static validateTimezone(timezone?: string): string {
    if (!timezone) {
      throw new PreferenceValidationError('Timezone is required');
    }

    if (!this.VALID_TIMEZONES.test(timezone)) {
      throw new PreferenceValidationError(
        `Invalid timezone format '${timezone}'. Must be in format 'Area/Location'`
      );
    }

    return timezone;
  }
}

export { UserPreferencesValidator, PreferenceValidationError, UserPreferences };