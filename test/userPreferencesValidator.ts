import { z } from 'zod';

const PreferenceSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(['immediate', 'daily', 'weekly']).default('daily')
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'friends', 'private']).default('friends'),
    searchIndexing: z.boolean().default(true)
  })
}).strict();

type UserPreferences = z.infer<typeof PreferenceSchema>;

export class PreferencesValidator {
  static validate(input: unknown): UserPreferences {
    try {
      return PreferenceSchema.parse(input);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const messages = error.errors.map(err => {
          const path = err.path.join('.');
          return `Invalid value at '${path}': ${err.message}`;
        });
        throw new Error(`Validation failed:\n${messages.join('\n')}`);
      }
      throw new Error('Unexpected validation error');
    }
  }

  static getDefaultPreferences(): UserPreferences {
    return PreferenceSchema.parse({});
  }
}

export function mergePreferences(
  existing: Partial<UserPreferences>,
  updates: Partial<UserPreferences>
): UserPreferences {
  const base = PreferencesValidator.getDefaultPreferences();
  const merged = { ...base, ...existing, ...updates };
  
  return PreferencesValidator.validate(merged);
}
interface UserPreferences {
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

  static validateAndThrow(prefs: UserPreferences): void {
    const errors = this.validate(prefs);
    if (errors.length > 0) {
      throw new Error(`Invalid preferences: ${errors.join('; ')}`);
    }
  }
}

export { UserPreferences, PreferenceValidator };import { z } from 'zod';

const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(['immediate', 'daily', 'weekly']).default('daily')
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'friends', 'private']).default('friends'),
    dataSharing: z.boolean().default(false)
  }),
  language: z.string().min(2).max(5).default('en')
}).strict();

type UserPreferences = z.infer<typeof UserPreferencesSchema>;

class PreferencesValidator {
  static validate(input: unknown): UserPreferences {
    try {
      return UserPreferencesSchema.parse(input);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(err => 
          `${err.path.join('.')}: ${err.message}`
        );
        throw new Error(`Validation failed:\n${errorMessages.join('\n')}`);
      }
      throw error;
    }
  }

  static getDefaultPreferences(): UserPreferences {
    return UserPreferencesSchema.parse({});
  }

  static mergeWithDefaults(partial: Partial<UserPreferences>): UserPreferences {
    const defaults = this.getDefaultPreferences();
    return this.validate({ ...defaults, ...partial });
  }
}

export { UserPreferencesSchema, PreferencesValidator };
export type { UserPreferences };
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class PreferenceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PreferenceError';
  }
}

function validateUserPreferences(prefs: UserPreferences): void {
  const validThemes = ['light', 'dark', 'auto'];
  const validLanguages = ['en', 'es', 'fr', 'de'];
  const minFontSize = 12;
  const maxFontSize = 24;

  if (!validThemes.includes(prefs.theme)) {
    throw new PreferenceError(`Invalid theme: ${prefs.theme}. Must be one of: ${validThemes.join(', ')}`);
  }

  if (typeof prefs.notifications !== 'boolean') {
    throw new PreferenceError('Notifications must be a boolean value');
  }

  if (!validLanguages.includes(prefs.language)) {
    throw new PreferenceError(`Unsupported language: ${prefs.language}. Supported languages: ${validLanguages.join(', ')}`);
  }

  if (prefs.fontSize < minFontSize || prefs.fontSize > maxFontSize) {
    throw new PreferenceError(`Font size must be between ${minFontSize} and ${maxFontSize}`);
  }
}

function applyUserPreferences(prefs: UserPreferences): void {
  try {
    validateUserPreferences(prefs);
    console.log('Preferences applied successfully:', prefs);
  } catch (error) {
    if (error instanceof PreferenceError) {
      console.error('Failed to apply preferences:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
  }
}

export { UserPreferences, PreferenceError, validateUserPreferences, applyUserPreferences };import { z } from 'zod';

const preferenceSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(['immediate', 'daily', 'weekly']).default('daily')
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'friends', 'private']).default('friends'),
    searchIndexing: z.boolean().default(true)
  }).default({})
}).refine(
  (data) => !(data.notifications.push && !data.privacy.searchIndexing),
  {
    message: 'Push notifications require search indexing to be enabled',
    path: ['notifications.push']
  }
);

export type UserPreferences = z.infer<typeof preferenceSchema>;

export class PreferenceValidator {
  static validate(input: unknown): UserPreferences {
    try {
      return preferenceSchema.parse(input);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        throw new PreferenceValidationError('Invalid preferences configuration', formattedErrors);
      }
      throw error;
    }
  }

  static validatePartial(updates: Partial<UserPreferences>): Partial<UserPreferences> {
    const partialSchema = preferenceSchema.partial();
    return partialSchema.parse(updates);
  }
}

export class PreferenceValidationError extends Error {
  constructor(
    message: string,
    public readonly details: Array<{ field: string; message: string }>
  ) {
    super(message);
    this.name = 'PreferenceValidationError';
  }
}

export function mergePreferences(
  existing: UserPreferences,
  updates: Partial<UserPreferences>
): UserPreferences {
  const validatedUpdates = PreferenceValidator.validatePartial(updates);
  return { ...existing, ...validatedUpdates };
}