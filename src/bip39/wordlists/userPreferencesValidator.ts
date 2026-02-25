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

class UserPreferencesValidator {
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de'];
  private static readonly MIN_FONT_SIZE = 12;
  private static readonly MAX_FONT_SIZE = 24;

  static validate(preferences: Partial<UserPreferences>): UserPreferences {
    const validated: UserPreferences = {
      theme: 'auto',
      notifications: true,
      language: 'en',
      fontSize: 16,
      ...preferences
    };

    if (!['light', 'dark', 'auto'].includes(validated.theme)) {
      throw new PreferenceValidationError(`Invalid theme: ${validated.theme}`);
    }

    if (typeof validated.notifications !== 'boolean') {
      throw new PreferenceValidationError('Notifications must be boolean');
    }

    if (!UserPreferencesValidator.SUPPORTED_LANGUAGES.includes(validated.language)) {
      throw new PreferenceValidationError(
        `Unsupported language: ${validated.language}. Supported: ${UserPreferencesValidator.SUPPORTED_LANGUAGES.join(', ')}`
      );
    }

    if (validated.fontSize < UserPreferencesValidator.MIN_FONT_SIZE || 
        validated.fontSize > UserPreferencesValidator.MAX_FONT_SIZE) {
      throw new PreferenceValidationError(
        `Font size must be between ${UserPreferencesValidator.MIN_FONT_SIZE} and ${UserPreferencesValidator.MAX_FONT_SIZE}`
      );
    }

    return validated;
  }

  static createDefault(): UserPreferences {
    return this.validate({});
  }
}

export { UserPreferences, UserPreferencesValidator, PreferenceValidationError };
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

class UserPreferencesValidator {
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja'];
  private static readonly MIN_FONT_SIZE = 12;
  private static readonly MAX_FONT_SIZE = 24;

  static validate(preferences: Partial<UserPreferences>): UserPreferences {
    const validated: UserPreferences = {
      theme: 'auto',
      notifications: true,
      language: 'en',
      fontSize: 16,
      ...preferences
    };

    if (!['light', 'dark', 'auto'].includes(validated.theme)) {
      throw new PreferenceError(
        `Theme must be one of: light, dark, auto. Received: ${validated.theme}`,
        'theme'
      );
    }

    if (typeof validated.notifications !== 'boolean') {
      throw new PreferenceError(
        `Notifications must be a boolean. Received: ${typeof validated.notifications}`,
        'notifications'
      );
    }

    if (!UserPreferencesValidator.SUPPORTED_LANGUAGES.includes(validated.language)) {
      throw new PreferenceError(
        `Language must be one of: ${UserPreferencesValidator.SUPPORTED_LANGUAGES.join(', ')}. Received: ${validated.language}`,
        'language'
      );
    }

    if (validated.fontSize < UserPreferencesValidator.MIN_FONT_SIZE || 
        validated.fontSize > UserPreferencesValidator.MAX_FONT_SIZE) {
      throw new PreferenceError(
        `Font size must be between ${UserPreferencesValidator.MIN_FONT_SIZE} and ${UserPreferencesValidator.MAX_FONT_SIZE}. Received: ${validated.fontSize}`,
        'fontSize'
      );
    }

    return validated;
  }

  static validateMultiple(preferencesArray: Partial<UserPreferences>[]): UserPreferences[] {
    return preferencesArray.map(prefs => this.validate(prefs));
  }
}

export { UserPreferencesValidator, PreferenceError, UserPreferences };import { z } from 'zod';

const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  notificationsEnabled: z.boolean().default(true),
  emailFrequency: z.enum(['immediate', 'daily', 'weekly']).default('daily'),
  language: z.string().min(2).max(5).default('en'),
  timezone: z.string().optional(),
  itemsPerPage: z.number().min(5).max(100).default(25),
});

type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export function validateUserPreferences(input: unknown): UserPreferences {
  try {
    return UserPreferencesSchema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation failed:', error.errors);
    }
    throw new Error('Invalid user preferences');
  }
}

export function getDefaultPreferences(): UserPreferences {
  return UserPreferencesSchema.parse({});
}

export function mergePreferences(
  existing: Partial<UserPreferences>,
  updates: Partial<UserPreferences>
): UserPreferences {
  const merged = { ...existing, ...updates };
  return validateUserPreferences(merged);
}
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

    if (preferences.language !== undefined && !this.SUPPORTED_LANGUAGES.includes(preferences.language)) {
      errors.push(`Unsupported language: ${preferences.language}. Supported languages: ${this.SUPPORTED_LANGUAGES.join(', ')}`);
    }

    if (preferences.fontSize !== undefined) {
      if (typeof preferences.fontSize !== 'number' || isNaN(preferences.fontSize)) {
        errors.push('Font size must be a valid number.');
      } else if (preferences.fontSize < this.MIN_FONT_SIZE || preferences.fontSize > this.MAX_FONT_SIZE) {
        errors.push(`Font size must be between ${this.MIN_FONT_SIZE} and ${this.MAX_FONT_SIZE}.`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateAndApply(preferences: Partial<UserPreferences>, currentPreferences: UserPreferences): UserPreferences {
    const validation = this.validate(preferences);
    
    if (!validation.isValid) {
      throw new Error(`Invalid preferences: ${validation.errors.join(' ')}`);
    }

    return {
      ...currentPreferences,
      ...preferences
    };
  }
}

export { UserPreferences, PreferenceValidator };import { z } from 'zod';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

export const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']),
  notifications: z.boolean(),
  language: z.string().min(2).max(5),
  fontSize: z.number().int().min(12).max(24)
});

export class PreferencesValidator {
  static validate(preferences: unknown): UserPreferences {
    try {
      return UserPreferencesSchema.parse(preferences);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(err => 
          `${err.path.join('.')}: ${err.message}`
        );
        throw new Error(`Invalid preferences: ${errorMessages.join(', ')}`);
      }
      throw error;
    }
  }

  static getDefaultPreferences(): UserPreferences {
    return {
      theme: 'auto',
      notifications: true,
      language: 'en',
      fontSize: 16
    };
  }

  static mergeWithDefaults(partial: Partial<UserPreferences>): UserPreferences {
    const defaults = this.getDefaultPreferences();
    return { ...defaults, ...partial };
  }
}

export function sanitizePreferences(input: Record<string, unknown>): Partial<UserPreferences> {
  const sanitized: Partial<UserPreferences> = {};
  
  if (typeof input.theme === 'string' && ['light', 'dark', 'auto'].includes(input.theme)) {
    sanitized.theme = input.theme as UserPreferences['theme'];
  }
  
  if (typeof input.notifications === 'boolean') {
    sanitized.notifications = input.notifications;
  }
  
  if (typeof input.language === 'string') {
    sanitized.language = input.language;
  }
  
  if (typeof input.fontSize === 'number') {
    sanitized.fontSize = Math.round(input.fontSize);
  }
  
  return sanitized;
}