interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
  twoFactorAuth: boolean;
}

class PreferenceValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PreferenceValidationError';
  }
}

class UserPreferencesValidator {
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja'];
  private static readonly MIN_FONT_SIZE = 12;
  private static readonly MAX_FONT_SIZE = 24;

  static validate(preferences: Partial<UserPreferences>): UserPreferences {
    const validated: UserPreferences = {
      theme: this.validateTheme(preferences.theme),
      notifications: this.validateNotifications(preferences.notifications),
      language: this.validateLanguage(preferences.language),
      fontSize: this.validateFontSize(preferences.fontSize),
      twoFactorAuth: this.validateTwoFactorAuth(preferences.twoFactorAuth),
    };

    return validated;
  }

  private static validateTheme(theme?: string): 'light' | 'dark' | 'auto' {
    if (!theme) return 'auto';
    
    if (theme === 'light' || theme === 'dark' || theme === 'auto') {
      return theme;
    }
    
    throw new PreferenceValidationError(
      `Invalid theme: '${theme}'. Must be 'light', 'dark', or 'auto'.`
    );
  }

  private static validateNotifications(notifications?: boolean): boolean {
    return notifications !== undefined ? notifications : true;
  }

  private static validateLanguage(language?: string): string {
    if (!language) return 'en';
    
    if (this.SUPPORTED_LANGUAGES.includes(language)) {
      return language;
    }
    
    throw new PreferenceValidationError(
      `Unsupported language: '${language}'. Supported languages: ${this.SUPPORTED_LANGUAGES.join(', ')}`
    );
  }

  private static validateFontSize(size?: number): number {
    if (size === undefined) return 16;
    
    if (typeof size !== 'number' || isNaN(size)) {
      throw new PreferenceValidationError('Font size must be a valid number.');
    }
    
    if (size < this.MIN_FONT_SIZE || size > this.MAX_FONT_SIZE) {
      throw new PreferenceValidationError(
        `Font size must be between ${this.MIN_FONT_SIZE} and ${this.MAX_FONT_SIZE}.`
      );
    }
    
    return Math.round(size);
  }

  private static validateTwoFactorAuth(twoFactorAuth?: boolean): boolean {
    return twoFactorAuth !== undefined ? twoFactorAuth : false;
  }
}

export { UserPreferencesValidator, PreferenceValidationError, UserPreferences };interface UserPreferences {
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

  static normalize(prefs: Partial<UserPreferences>): UserPreferences {
    return {
      theme: prefs.theme || 'auto',
      notifications: prefs.notifications ?? true,
      language: prefs.language || 'en',
      timezone: prefs.timezone || 'UTC'
    };
  }
}

export { UserPreferences, PreferenceValidator };import { z } from 'zod';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  itemsPerPage: number;
}

const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']),
  notifications: z.boolean(),
  language: z.string().min(2).max(5),
  itemsPerPage: z.number().int().min(5).max(100)
});

export const defaultPreferences: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en',
  itemsPerPage: 20
};

export function validatePreferences(input: unknown): UserPreferences {
  try {
    const parsed = UserPreferencesSchema.parse(input);
    return { ...defaultPreferences, ...parsed };
  } catch (error) {
    console.warn('Invalid preferences provided, using defaults:', error);
    return defaultPreferences;
  }
}

export function mergePreferences(
  existing: Partial<UserPreferences>,
  updates: Partial<UserPreferences>
): UserPreferences {
  const merged = { ...existing, ...updates };
  return validatePreferences(merged);
}

export function serializePreferences(prefs: UserPreferences): string {
  return JSON.stringify(prefs);
}

export function deserializePreferences(json: string): UserPreferences {
  try {
    const parsed = JSON.parse(json);
    return validatePreferences(parsed);
  } catch {
    return defaultPreferences;
  }
}