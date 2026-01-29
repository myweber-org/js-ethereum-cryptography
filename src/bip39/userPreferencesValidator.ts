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
    const errors: string[] = [];

    if (!preferences.theme || !['light', 'dark', 'auto'].includes(preferences.theme)) {
      errors.push('Theme must be one of: light, dark, auto');
    }

    if (typeof preferences.notifications !== 'boolean') {
      errors.push('Notifications must be a boolean value');
    }

    if (!preferences.language || !this.SUPPORTED_LANGUAGES.includes(preferences.language)) {
      errors.push(`Language must be one of: ${this.SUPPORTED_LANGUAGES.join(', ')}`);
    }

    if (!preferences.timezone || !this.VALID_TIMEZONES.test(preferences.timezone)) {
      errors.push('Timezone must be in format: Area/Location (e.g., America/New_York)');
    }

    if (errors.length > 0) {
      throw new PreferenceValidationError(`Validation failed:\n${errors.join('\n')}`);
    }

    return preferences as UserPreferences;
  }

  static sanitize(preferences: UserPreferences): UserPreferences {
    return {
      ...preferences,
      language: preferences.language.toLowerCase(),
      timezone: preferences.timezone.replace(/\s+/g, '_')
    };
  }
}

export { UserPreferences, UserPreferencesValidator, PreferenceValidationError };import { z } from 'zod';

const PreferenceSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.boolean().default(true),
  language: z.string().min(2).max(5).default('en'),
  fontSize: z.number().min(8).max(72).default(16),
  autoSave: z.boolean().default(false),
  twoFactorEnabled: z.boolean().default(false),
  emailNotifications: z.object({
    marketing: z.boolean().default(false),
    security: z.boolean().default(true),
    updates: z.boolean().default(true)
  }).default({})
});

type UserPreferences = z.infer<typeof PreferenceSchema>;

export class PreferenceValidator {
  static validate(input: unknown): UserPreferences {
    try {
      return PreferenceSchema.parse(input);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(err => {
          const field = err.path.join('.');
          switch (err.code) {
            case 'invalid_type':
              return `Field '${field}' must be ${err.expected}, received ${err.received}`;
            case 'invalid_enum_value':
              return `Field '${field}' must be one of: ${err.options?.join(', ')}`;
            case 'too_small':
              return `Field '${field}' must be at least ${err.minimum} characters`;
            case 'too_big':
              return `Field '${field}' must be at most ${err.maximum} characters`;
            default:
              return `Validation error for field '${field}'`;
          }
        });
        throw new Error(`Invalid preferences: ${errorMessages.join('; ')}`);
      }
      throw error;
    }
  }

  static getDefaultPreferences(): UserPreferences {
    return PreferenceSchema.parse({});
  }

  static mergePreferences(existing: Partial<UserPreferences>, updates: Partial<UserPreferences>): UserPreferences {
    const merged = { ...existing, ...updates };
    return this.validate(merged);
  }
}

export function sanitizePreferences(prefs: UserPreferences): UserPreferences {
  const { emailNotifications, ...rest } = prefs;
  return {
    ...rest,
    emailNotifications: {
      marketing: false,
      security: emailNotifications?.security ?? true,
      updates: emailNotifications?.updates ?? true
    }
  };
}