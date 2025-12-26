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

function validateUserPreferences(prefs: UserPreferences): void {
  const validThemes = ['light', 'dark', 'auto'];
  const validLanguages = ['en', 'es', 'fr', 'de'];
  const minFontSize = 12;
  const maxFontSize = 24;

  if (!validThemes.includes(prefs.theme)) {
    throw new PreferenceValidationError(
      `Invalid theme: ${prefs.theme}. Must be one of: ${validThemes.join(', ')}`
    );
  }

  if (!validLanguages.includes(prefs.language)) {
    throw new PreferenceValidationError(
      `Invalid language: ${prefs.language}. Must be one of: ${validLanguages.join(', ')}`
    );
  }

  if (prefs.fontSize < minFontSize || prefs.fontSize > maxFontSize) {
    throw new PreferenceValidationError(
      `Font size ${prefs.fontSize} out of range. Must be between ${minFontSize} and ${maxFontSize}`
    );
  }

  if (typeof prefs.notifications !== 'boolean') {
    throw new PreferenceValidationError('Notifications must be a boolean value');
  }
}

function saveUserPreferences(prefs: UserPreferences): boolean {
  try {
    validateUserPreferences(prefs);
    console.log('Preferences validated successfully');
    return true;
  } catch (error) {
    if (error instanceof PreferenceValidationError) {
      console.error('Validation failed:', error.message);
      return false;
    }
    throw error;
  }
}

export { UserPreferences, validateUserPreferences, saveUserPreferences, PreferenceValidationError };import { z } from 'zod';

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
      throw new Error(`Invalid preferences: ${errorMessages.join(', ')}`);
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
}import { z } from 'zod';

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
  }),
  language: z.string().min(2).max(5).default('en')
}).strict();

type UserPreferences = z.infer<typeof PreferenceSchema>;

export function validatePreferences(input: unknown): UserPreferences {
  try {
    return PreferenceSchema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message
      }));
      throw new Error(`Invalid preferences: ${JSON.stringify(formattedErrors)}`);
    }
    throw error;
  }
}

export function getDefaultPreferences(): UserPreferences {
  return PreferenceSchema.parse({});
}

export function mergePreferences(
  existing: Partial<UserPreferences>,
  updates: Partial<UserPreferences>
): UserPreferences {
  const merged = { ...existing, ...updates };
  return validatePreferences(merged);
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
      errors.push(`Invalid theme: ${prefs.theme}. Must be 'light', 'dark', or 'auto'`);
    }

    if (typeof prefs.notifications !== 'boolean') {
      errors.push('Notifications must be a boolean value');
    }

    if (!PreferenceValidator.SUPPORTED_LANGUAGES.includes(prefs.language)) {
      errors.push(`Unsupported language: ${prefs.language}`);
    }

    if (!PreferenceValidator.VALID_TIMEZONES.test(prefs.timezone)) {
      errors.push(`Invalid timezone format: ${prefs.timezone}`);
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

export { UserPreferences, PreferenceValidator };import { z } from 'zod';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  timezone: string;
}

export const userPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']),
  notifications: z.boolean(),
  language: z.string().min(2).max(5),
  timezone: z.string().regex(/^[A-Za-z_]+\/[A-Za-z_]+$/),
});

export class UserPreferencesValidator {
  static validate(preferences: unknown): UserPreferences {
    try {
      return userPreferencesSchema.parse(preferences) as UserPreferences;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(err => {
          switch (err.path[0]) {
            case 'theme':
              return `Theme must be either 'light', 'dark', or 'auto'`;
            case 'language':
              return `Language code must be between 2 and 5 characters`;
            case 'timezone':
              return `Timezone must be in format 'Area/Location'`;
            default:
              return `Invalid value for ${err.path[0]}`;
          }
        });
        throw new Error(`Validation failed: ${errorMessages.join('; ')}`);
      }
      throw error;
    }
  }

  static validatePartial(updates: Partial<unknown>): Partial<UserPreferences> {
    const partialSchema = userPreferencesSchema.partial();
    try {
      return partialSchema.parse(updates) as Partial<UserPreferences>;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(err => 
          `Invalid update for ${err.path[0]}: ${err.message}`
        );
        throw new Error(`Partial validation failed: ${errorMessages.join('; ')}`);
      }
      throw error;
    }
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

class UserPreferencesValidator {
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja'];
  private static readonly VALID_TIMEZONES = /^[A-Za-z_]+\/[A-Za-z_]+$/;

  static validate(preferences: Partial<UserPreferences>): UserPreferences {
    const errors: string[] = [];

    if (!preferences.theme || !['light', 'dark', 'auto'].includes(preferences.theme)) {
      errors.push('Theme must be either "light", "dark", or "auto"');
    }

    if (preferences.notifications === undefined || typeof preferences.notifications !== 'boolean') {
      errors.push('Notifications must be a boolean value');
    }

    if (!preferences.language || !this.SUPPORTED_LANGUAGES.includes(preferences.language)) {
      errors.push(`Language must be one of: ${this.SUPPORTED_LANGUAGES.join(', ')}`);
    }

    if (!preferences.timezone || !this.VALID_TIMEZONES.test(preferences.timezone)) {
      errors.push('Timezone must be in format "Area/Location" (e.g., "America/New_York")');
    }

    if (errors.length > 0) {
      throw new PreferenceValidationError(`Validation failed: ${errors.join('; ')}`);
    }

    return preferences as UserPreferences;
  }

  static sanitize(preferences: Partial<UserPreferences>): UserPreferences {
    return {
      theme: preferences.theme || 'auto',
      notifications: preferences.notifications ?? true,
      language: preferences.language || 'en',
      timezone: preferences.timezone || 'UTC'
    };
  }
}

export { UserPreferences, UserPreferencesValidator, PreferenceValidationError };typescript
interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
    language: string;
    fontSize: number;
}

class PreferenceValidator {
    private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de'];
    private static readonly MIN_FONT_SIZE = 8;
    private static readonly MAX_FONT_SIZE = 72;

    static validate(prefs: UserPreferences): string[] {
        const errors: string[] = [];

        if (!['light', 'dark', 'auto'].includes(prefs.theme)) {
            errors.push(`Invalid theme: ${prefs.theme}. Must be 'light', 'dark', or 'auto'`);
        }

        if (typeof prefs.notifications !== 'boolean') {
            errors.push('Notifications must be a boolean value');
        }

        if (!PreferenceValidator.SUPPORTED_LANGUAGES.includes(prefs.language)) {
            errors.push(`Unsupported language: ${prefs.language}. Supported: ${PreferenceValidator.SUPPORTED_LANGUAGES.join(', ')}`);
        }

        if (prefs.fontSize < PreferenceValidator.MIN_FONT_SIZE || prefs.fontSize > PreferenceValidator.MAX_FONT_SIZE) {
            errors.push(`Font size ${prefs.fontSize} out of range. Must be between ${PreferenceValidator.MIN_FONT_SIZE} and ${PreferenceValidator.MAX_FONT_SIZE}`);
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

function testValidation() {
    const testPreferences: UserPreferences = {
        theme: 'blue' as any,
        notifications: 'yes' as any,
        language: 'zh',
        fontSize: 100
    };

    try {
        PreferenceValidator.validateAndThrow(testPreferences);
        console.log('Preferences are valid');
    } catch (error) {
        console.error(error.message);
    }
}

export { UserPreferences, PreferenceValidator };
```import { z } from 'zod';

const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(['instant', 'daily', 'weekly']).default('daily')
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'private', 'friends']).default('friends'),
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
      throw new Error(`Invalid preferences: ${errorMessages.join('; ')}`);
    }
    throw error;
  }
}

export function getDefaultPreferences(): UserPreferences {
  return UserPreferencesSchema.parse({});
}

export function mergePreferences(existing: Partial<UserPreferences>, updates: Partial<UserPreferences>): UserPreferences {
  const current = UserPreferencesSchema.partial().parse(existing);
  const merged = { ...current, ...updates };
  return validateUserPreferences(merged);
}import { z } from 'zod';

const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notificationsEnabled: z.boolean().default(true),
  emailFrequency: z.enum(['immediate', 'daily', 'weekly']).default('daily'),
  language: z.string().min(2).max(5).default('en'),
  timezone: z.string().optional(),
  itemsPerPage: z.number().min(5).max(100).default(20),
});

type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export function validateUserPreferences(input: unknown): UserPreferences {
  try {
    return UserPreferencesSchema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid user preferences: ${error.errors.map(e => e.message).join(', ')}`);
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