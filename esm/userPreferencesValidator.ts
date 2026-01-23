import { z } from 'zod';

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
  language: z.string().min(2).max(10).default('en')
}).strict();

type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export function validateUserPreferences(input: unknown): UserPreferences {
  try {
    return UserPreferencesSchema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code
      }));
      throw new Error(`Validation failed: ${JSON.stringify(formattedErrors)}`);
    }
    throw error;
  }
}

export function createDefaultPreferences(): UserPreferences {
  return UserPreferencesSchema.parse({});
}

export function mergePreferences(existing: Partial<UserPreferences>, updates: Partial<UserPreferences>): UserPreferences {
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
  private static readonly MIN_FONT_SIZE = 12;
  private static readonly MAX_FONT_SIZE = 24;
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja'];

  static validate(prefs: UserPreferences): string[] {
    const errors: string[] = [];

    if (!['light', 'dark', 'auto'].includes(prefs.theme)) {
      errors.push(`Invalid theme value: ${prefs.theme}. Must be 'light', 'dark', or 'auto'.`);
    }

    if (typeof prefs.notifications !== 'boolean') {
      errors.push('Notifications must be a boolean value.');
    }

    if (!PreferenceValidator.SUPPORTED_LANGUAGES.includes(prefs.language)) {
      errors.push(`Unsupported language: ${prefs.language}. Supported languages: ${PreferenceValidator.SUPPORTED_LANGUAGES.join(', ')}`);
    }

    if (prefs.fontSize < PreferenceValidator.MIN_FONT_SIZE || prefs.fontSize > PreferenceValidator.MAX_FONT_SIZE) {
      errors.push(`Font size ${prefs.fontSize} is out of range. Must be between ${PreferenceValidator.MIN_FONT_SIZE} and ${PreferenceValidator.MAX_FONT_SIZE}.`);
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

function applyUserPreferences(prefs: UserPreferences): void {
  try {
    PreferenceValidator.validateAndThrow(prefs);
    console.log('Preferences applied successfully:', prefs);
  } catch (error) {
    console.error('Failed to apply preferences:', error.message);
  }
}

export { UserPreferences, PreferenceValidator, applyUserPreferences };
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
      errors.push(`Invalid theme: ${prefs.theme}. Must be 'light', 'dark', or 'auto'`);
    }

    if (typeof prefs.notifications !== 'boolean') {
      errors.push('Notifications must be a boolean value');
    }

    if (!PreferenceValidator.SUPPORTED_LANGUAGES.includes(prefs.language)) {
      errors.push(`Unsupported language: ${prefs.language}`);
    }

    if (prefs.fontSize < PreferenceValidator.MIN_FONT_SIZE || 
        prefs.fontSize > PreferenceValidator.MAX_FONT_SIZE) {
      errors.push(`Font size must be between ${PreferenceValidator.MIN_FONT_SIZE} and ${PreferenceValidator.MAX_FONT_SIZE}`);
    }

    return errors;
  }

  static validateAndThrow(prefs: UserPreferences): void {
    const errors = this.validate(prefs);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join('; ')}`);
    }
  }
}

export { UserPreferences, PreferenceValidator };