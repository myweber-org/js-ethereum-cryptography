
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

  static validate(prefs: UserPreferences): string[] {
    const errors: string[] = [];

    if (!['light', 'dark', 'auto'].includes(prefs.theme)) {
      errors.push(`Invalid theme selection: ${prefs.theme}`);
    }

    if (typeof prefs.notifications !== 'boolean') {
      errors.push('Notifications must be a boolean value');
    }

    if (!PreferenceValidator.SUPPORTED_LANGUAGES.includes(prefs.language)) {
      errors.push(`Unsupported language: ${prefs.language}`);
    }

    if (prefs.itemsPerPage < PreferenceValidator.MIN_ITEMS_PER_PAGE) {
      errors.push(`Items per page cannot be less than ${PreferenceValidator.MIN_ITEMS_PER_PAGE}`);
    }

    if (prefs.itemsPerPage > PreferenceValidator.MAX_ITEMS_PER_PAGE) {
      errors.push(`Items per page cannot exceed ${PreferenceValidator.MAX_ITEMS_PER_PAGE}`);
    }

    return errors;
  }

  static normalizePreferences(prefs: Partial<UserPreferences>): UserPreferences {
    return {
      theme: prefs.theme || 'auto',
      notifications: prefs.notifications ?? true,
      language: prefs.language || 'en',
      itemsPerPage: prefs.itemsPerPage || 20,
    };
  }
}

export { UserPreferences, PreferenceValidator };import { z } from 'zod';

const ThemeSchema = z.enum(['light', 'dark', 'system'], {
  errorMap: () => ({ message: 'Theme must be light, dark, or system' })
});

const NotificationSettingsSchema = z.object({
  email: z.boolean(),
  push: z.boolean(),
  frequency: z.enum(['immediate', 'daily', 'weekly']).optional()
});

export const UserPreferencesSchema = z.object({
  userId: z.string().uuid({ message: 'Invalid user ID format' }),
  theme: ThemeSchema,
  notifications: NotificationSettingsSchema,
  language: z.string().min(2).max(5),
  timezone: z.string().refine(tz => {
    try {
      Intl.DateTimeFormat(undefined, { timeZone: tz });
      return true;
    } catch {
      return false;
    }
  }, { message: 'Invalid timezone identifier' }),
  createdAt: z.date().default(() => new Date())
});

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export function validatePreferences(input: unknown): UserPreferences {
  const result = UserPreferencesSchema.safeParse(input);
  
  if (!result.success) {
    const errors = result.error.errors.map(err => 
      `${err.path.join('.')}: ${err.message}`
    );
    throw new Error(`Validation failed:\n${errors.join('\n')}`);
  }
  
  return result.data;
}

export function createDefaultPreferences(userId: string): UserPreferences {
  return {
    userId,
    theme: 'system',
    notifications: {
      email: true,
      push: false,
      frequency: 'daily'
    },
    language: 'en',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  };
}
import { z } from 'zod';

export const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(['immediate', 'daily', 'weekly']).default('daily')
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'friends', 'private']).default('friends'),
    searchIndexing: z.boolean().default(true)
  }),
  language: z.string().min(2).default('en')
});

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export class PreferencesValidator {
  static validate(input: unknown): UserPreferences {
    try {
      return UserPreferencesSchema.parse(input);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const defaultPreferences = UserPreferencesSchema.parse({});
        console.warn('Invalid preferences provided, using defaults:', error.errors);
        return defaultPreferences;
      }
      throw error;
    }
  }

  static mergeWithDefaults(partialPreferences: Partial<UserPreferences>): UserPreferences {
    const validated = this.validate(partialPreferences);
    return validated;
  }

  static isValid(preferences: unknown): preferences is UserPreferences {
    return UserPreferencesSchema.safeParse(preferences).success;
  }
}

export function sanitizePreferencesExport(preferences: UserPreferences): Record<string, unknown> {
  const { privacy, ...rest } = preferences;
  return {
    ...rest,
    privacy: {
      profileVisibility: privacy.profileVisibility,
      searchIndexing: false
    }
  };
}