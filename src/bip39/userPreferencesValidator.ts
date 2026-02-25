interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
  autoSave: boolean;
}

class UserPreferencesValidator {
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja'];
  private static readonly MIN_FONT_SIZE = 8;
  private static readonly MAX_FONT_SIZE = 72;

  static validate(preferences: Partial<UserPreferences>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (preferences.theme !== undefined && !['light', 'dark', 'auto'].includes(preferences.theme)) {
      errors.push(`Invalid theme: ${preferences.theme}. Must be 'light', 'dark', or 'auto'.`);
    }

    if (preferences.language !== undefined && !this.SUPPORTED_LANGUAGES.includes(preferences.language)) {
      errors.push(`Unsupported language: ${preferences.language}. Supported languages: ${this.SUPPORTED_LANGUAGES.join(', ')}`);
    }

    if (preferences.fontSize !== undefined) {
      if (typeof preferences.fontSize !== 'number') {
        errors.push(`Font size must be a number, received: ${typeof preferences.fontSize}`);
      } else if (preferences.fontSize < this.MIN_FONT_SIZE || preferences.fontSize > this.MAX_FONT_SIZE) {
        errors.push(`Font size ${preferences.fontSize} is out of range. Must be between ${this.MIN_FONT_SIZE} and ${this.MAX_FONT_SIZE}.`);
      }
    }

    if (preferences.notifications !== undefined && typeof preferences.notifications !== 'boolean') {
      errors.push(`Notifications must be a boolean, received: ${typeof preferences.notifications}`);
    }

    if (preferences.autoSave !== undefined && typeof preferences.autoSave !== 'boolean') {
      errors.push(`Auto-save must be a boolean, received: ${typeof preferences.autoSave}`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  static createDefaultPreferences(): UserPreferences {
    return {
      theme: 'auto',
      notifications: true,
      language: 'en',
      fontSize: 14,
      autoSave: true
    };
  }

  static mergePreferences(current: UserPreferences, updates: Partial<UserPreferences>): UserPreferences {
    const validation = this.validate(updates);
    if (!validation.valid) {
      throw new Error(`Invalid preferences: ${validation.errors.join(' ')}`);
    }

    return { ...current, ...updates };
  }
}

export { UserPreferences, UserPreferencesValidator };import { z } from 'zod';

const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(['immediate', 'daily', 'weekly']).default('daily')
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'private', 'friends']).default('friends'),
    searchIndexing: z.boolean().default(true)
  }),
  language: z.string().min(2).max(5).default('en')
});

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export class PreferencesValidator {
  static validate(input: unknown): UserPreferences {
    try {
      return UserPreferencesSchema.parse(input);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const defaultPreferences = UserPreferencesSchema.parse({});
        console.warn('Invalid preferences, using defaults:', error.errors);
        return defaultPreferences;
      }
      throw error;
    }
  }

  static mergeWithDefaults(partial: Partial<UserPreferences>): UserPreferences {
    const current = UserPreferencesSchema.parse({});
    const validatedPartial = UserPreferencesSchema.partial().parse(partial);
    return { ...current, ...validatedPartial };
  }

  static sanitizeForExport(prefs: UserPreferences): Record<string, unknown> {
    const { privacy, ...exportable } = prefs;
    return {
      ...exportable,
      privacy: {
        profileVisibility: privacy.profileVisibility
      }
    };
  }
}interface UserPreferences {
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

const SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja'];
const VALID_TIMEZONES = /^[A-Za-z_]+\/[A-Za-z_]+$/;

function validateUserPreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const errors: string[] = [];

  if (!prefs.theme || !['light', 'dark', 'auto'].includes(prefs.theme)) {
    errors.push('Theme must be one of: light, dark, auto');
  }

  if (typeof prefs.notifications !== 'boolean') {
    errors.push('Notifications must be a boolean value');
  }

  if (!prefs.language || !SUPPORTED_LANGUAGES.includes(prefs.language)) {
    errors.push(`Language must be one of: ${SUPPORTED_LANGUAGES.join(', ')}`);
  }

  if (!prefs.timezone || !VALID_TIMEZONES.test(prefs.timezone)) {
    errors.push('Timezone must be in format: Area/Location');
  }

  if (errors.length > 0) {
    throw new PreferenceValidationError(`Validation failed:\n${errors.join('\n')}`);
  }

  return prefs as UserPreferences;
}

function sanitizePreferences(prefs: Record<string, unknown>): Partial<UserPreferences> {
  const sanitized: Partial<UserPreferences> = {};

  if (typeof prefs.theme === 'string') {
    sanitized.theme = prefs.theme as UserPreferences['theme'];
  }

  if (typeof prefs.notifications === 'boolean') {
    sanitized.notifications = prefs.notifications;
  }

  if (typeof prefs.language === 'string') {
    sanitized.language = prefs.language;
  }

  if (typeof prefs.timezone === 'string') {
    sanitized.timezone = prefs.timezone;
  }

  return sanitized;
}

export { validateUserPreferences, sanitizePreferences, PreferenceValidationError };
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
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de'];
  private static readonly MIN_FONT_SIZE = 12;
  private static readonly MAX_FONT_SIZE = 24;

  static validate(prefs: Partial<UserPreferences>): UserPreferences {
    const validated: UserPreferences = {
      theme: 'auto',
      notifications: true,
      language: 'en',
      fontSize: 16,
      ...prefs
    };

    if (!['light', 'dark', 'auto'].includes(validated.theme)) {
      throw new PreferenceError(
        `Theme must be 'light', 'dark', or 'auto'`,
        'theme'
      );
    }

    if (typeof validated.notifications !== 'boolean') {
      throw new PreferenceError('Notifications must be a boolean', 'notifications');
    }

    if (!UserPreferencesValidator.SUPPORTED_LANGUAGES.includes(validated.language)) {
      throw new PreferenceError(
        `Language must be one of: ${UserPreferencesValidator.SUPPORTED_LANGUAGES.join(', ')}`,
        'language'
      );
    }

    if (validated.fontSize < UserPreferencesValidator.MIN_FONT_SIZE ||
        validated.fontSize > UserPreferencesValidator.MAX_FONT_SIZE) {
      throw new PreferenceError(
        `Font size must be between ${UserPreferencesValidator.MIN_FONT_SIZE} and ${UserPreferencesValidator.MAX_FONT_SIZE}`,
        'fontSize'
      );
    }

    return validated;
  }

  static validateBatch(prefsArray: Partial<UserPreferences>[]): UserPreferences[] {
    return prefsArray.map(prefs => this.validate(prefs));
  }
}

export { UserPreferences, UserPreferencesValidator, PreferenceError };import { z } from 'zod';

const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(['immediate', 'daily', 'weekly']).default('daily')
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'friends', 'private']).default('friends'),
    searchIndexing: z.boolean().default(true)
  }),
  language: z.string().min(2).max(5).default('en')
}).strict();

type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export function validateUserPreferences(input: unknown): UserPreferences {
  try {
    return UserPreferencesSchema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      throw new Error(`Invalid user preferences: ${errorMessages.join('; ')}`);
    }
    throw error;
  }
}

export function getDefaultPreferences(): UserPreferences {
  return UserPreferencesSchema.parse({});
}

export function mergePreferences(existing: Partial<UserPreferences>, updates: Partial<UserPreferences>): UserPreferences {
  const merged = { ...existing, ...updates };
  return validateUserPreferences(merged);
}