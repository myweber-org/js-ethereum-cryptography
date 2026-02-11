
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  itemsPerPage: number;
}

class PreferenceValidator {
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de'];
  private static readonly MIN_ITEMS_PER_PAGE = 5;
  private static readonly MAX_ITEMS_PER_PAGE = 100;

  static validate(prefs: Partial<UserPreferences>): string[] {
    const errors: string[] = [];

    if (prefs.theme !== undefined) {
      if (!['light', 'dark', 'auto'].includes(prefs.theme)) {
        errors.push(`Invalid theme: ${prefs.theme}. Must be 'light', 'dark', or 'auto'`);
      }
    }

    if (prefs.language !== undefined) {
      if (!PreferenceValidator.SUPPORTED_LANGUAGES.includes(prefs.language)) {
        errors.push(`Unsupported language: ${prefs.language}. Supported: ${PreferenceValidator.SUPPORTED_LANGUAGES.join(', ')}`);
      }
    }

    if (prefs.itemsPerPage !== undefined) {
      if (!Number.isInteger(prefs.itemsPerPage)) {
        errors.push(`Items per page must be an integer, got: ${prefs.itemsPerPage}`);
      } else if (prefs.itemsPerPage < PreferenceValidator.MIN_ITEMS_PER_PAGE || 
                 prefs.itemsPerPage > PreferenceValidator.MAX_ITEMS_PER_PAGE) {
        errors.push(`Items per page must be between ${PreferenceValidator.MIN_ITEMS_PER_PAGE} and ${PreferenceValidator.MAX_ITEMS_PER_PAGE}`);
      }
    }

    return errors;
  }

  static validateAndThrow(prefs: Partial<UserPreferences>): void {
    const errors = this.validate(prefs);
    if (errors.length > 0) {
      throw new Error(`Validation failed:\n${errors.join('\n')}`);
    }
  }
}

export { UserPreferences, PreferenceValidator };interface UserPreferences {
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

    if (typeof preferences.notifications !== 'boolean') {
      errors.push('Notifications must be a boolean value');
    }

    if (!preferences.language || !this.SUPPORTED_LANGUAGES.includes(preferences.language)) {
      errors.push(`Language must be one of: ${this.SUPPORTED_LANGUAGES.join(', ')}`);
    }

    if (!preferences.timezone || !this.VALID_TIMEZONES.test(preferences.timezone)) {
      errors.push('Timezone must be in format "Area/Location" (e.g., "America/New_York")');
    }

    if (errors.length > 0) {
      throw new PreferenceValidationError(`Validation failed:\n${errors.join('\n')}`);
    }

    return preferences as UserPreferences;
  }

  static sanitize(preferences: UserPreferences): UserPreferences {
    return {
      theme: preferences.theme,
      notifications: preferences.notifications,
      language: preferences.language.toLowerCase(),
      timezone: preferences.timezone.replace(/\s+/g, '_')
    };
  }
}

export { UserPreferences, UserPreferencesValidator, PreferenceValidationError };import { z } from "zod";

const ThemeSchema = z.enum(["light", "dark", "system"]);
const LanguageSchema = z.enum(["en", "es", "fr", "de"]);
const NotificationSettingsSchema = z.object({
  email: z.boolean(),
  push: z.boolean(),
  frequency: z.enum(["instant", "daily", "weekly"]).optional(),
});

export const UserPreferencesSchema = z.object({
  userId: z.string().uuid(),
  theme: ThemeSchema.default("system"),
  language: LanguageSchema.default("en"),
  notifications: NotificationSettingsSchema.default({
    email: true,
    push: false,
  }),
  timezone: z.string().optional(),
  createdAt: z.date().default(() => new Date()),
});

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export function validatePreferences(input: unknown): UserPreferences {
  return UserPreferencesSchema.parse(input);
}

export function validatePreferencesPartial(
  input: unknown
): Partial<UserPreferences> {
  return UserPreferencesSchema.partial().parse(input);
}import { z } from 'zod';

export const userPreferencesSchema = z.object({
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
  language: z.string().min(2).max(10).default('en')
}).strict();

export type UserPreferences = z.infer<typeof userPreferencesSchema>;

export class PreferencesValidator {
  static validate(input: unknown): UserPreferences {
    try {
      return userPreferencesSchema.parse(input);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(err => 
          `${err.path.join('.')}: ${err.message}`
        );
        throw new Error(`Invalid preferences: ${errorMessages.join('; ')}`);
      }
      throw new Error('Unexpected validation error');
    }
  }

  static validatePartial(updates: Partial<unknown>): Partial<UserPreferences> {
    const partialSchema = userPreferencesSchema.partial();
    return partialSchema.parse(updates);
  }
}

export function mergePreferences(
  existing: UserPreferences,
  updates: Partial<UserPreferences>
): UserPreferences {
  const validatedUpdates = PreferencesValidator.validatePartial(updates);
  return { ...existing, ...validatedUpdates };
}