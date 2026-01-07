import { z } from 'zod';

const PreferenceSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(['instant', 'daily', 'weekly']).default('daily')
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'friends', 'private']).default('friends'),
    searchIndexing: z.boolean().default(true)
  })
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
      errors.push(`Invalid theme selection: ${prefs.theme}`);
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

export { UserPreferences, PreferenceValidator };import { z } from 'zod';

const ThemeSchema = z.enum(['light', 'dark', 'system']);
const NotificationPreferenceSchema = z.object({
  email: z.boolean(),
  push: z.boolean(),
  sms: z.boolean(),
});

export const UserPreferencesSchema = z.object({
  userId: z.string().uuid(),
  theme: ThemeSchema.default('system'),
  notifications: NotificationPreferenceSchema.default({
    email: true,
    push: false,
    sms: false,
  }),
  language: z.string().min(2).max(5).default('en'),
  timezone: z.string().default('UTC'),
  twoFactorEnabled: z.boolean().default(false),
});

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export function validateUserPreferences(
  input: unknown
): UserPreferences {
  return UserPreferencesSchema.parse(input);
}

export function sanitizeUserPreferencesUpdate(
  partialInput: Partial<UserPreferences>
): Partial<UserPreferences> {
  const schema = UserPreferencesSchema.partial();
  return schema.parse(partialInput);
}import { z } from 'zod';

const PreferenceSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(['instant', 'daily', 'weekly']).default('daily')
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'private', 'friends']).default('friends'),
    searchIndexing: z.boolean().default(true)
  }).default({}),
  updatedAt: z.date().optional()
});

type UserPreferences = z.infer<typeof PreferenceSchema>;

export function validatePreferences(input: unknown): UserPreferences {
  try {
    return PreferenceSchema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation failed:', error.errors);
    }
    throw new Error('Invalid preferences configuration');
  }
}

export function getDefaultPreferences(): UserPreferences {
  return PreferenceSchema.parse({});
}