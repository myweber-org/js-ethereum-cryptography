import { z } from 'zod';

export const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(['instant', 'daily', 'weekly']).default('daily')
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'friends', 'private']).default('friends'),
    searchIndexing: z.boolean().default(true)
  }).default({}),
  language: z.string().min(2).max(5).default('en')
}).strict();

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export class PreferencesValidator {
  static validate(input: unknown): UserPreferences {
    try {
      return UserPreferencesSchema.parse(input);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: this.formatErrorMessage(err)
        }));
        throw new ValidationError('Invalid preferences configuration', fieldErrors);
      }
      throw error;
    }
  }

  private static formatErrorMessage(error: z.ZodIssue): string {
    switch (error.code) {
      case 'invalid_type':
        return `Expected ${error.expected}, received ${error.received}`;
      case 'invalid_enum_value':
        return `Invalid option. Allowed values: ${error.options.join(', ')}`;
      case 'too_small':
        return `Minimum length is ${error.minimum}`;
      case 'too_big':
        return `Maximum length is ${error.maximum}`;
      default:
        return error.message;
    }
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly details: Array<{ field: string; message: string }>
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function createDefaultPreferences(): UserPreferences {
  return UserPreferencesSchema.parse({});
}interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class PreferenceError extends Error {
  constructor(message: string, public field: keyof UserPreferences) {
    super(message);
    this.name = 'PreferenceError';
  }
}

const validatePreferences = (prefs: Partial<UserPreferences>): UserPreferences => {
  const defaultPrefs: UserPreferences = {
    theme: 'auto',
    notifications: true,
    language: 'en',
    fontSize: 14
  };

  const validated: UserPreferences = { ...defaultPrefs, ...prefs };

  if (!['light', 'dark', 'auto'].includes(validated.theme)) {
    throw new PreferenceError('Theme must be light, dark, or auto', 'theme');
  }

  if (typeof validated.notifications !== 'boolean') {
    throw new PreferenceError('Notifications must be a boolean value', 'notifications');
  }

  if (!validated.language || validated.language.trim().length === 0) {
    throw new PreferenceError('Language must be a non-empty string', 'language');
  }

  if (validated.fontSize < 8 || validated.fontSize > 72) {
    throw new PreferenceError('Font size must be between 8 and 72', 'fontSize');
  }

  if (!Number.isInteger(validated.fontSize)) {
    throw new PreferenceError('Font size must be an integer', 'fontSize');
  }

  return validated;
};

const saveUserPreferences = (userId: string, preferences: Partial<UserPreferences>): void => {
  try {
    const validated = validatePreferences(preferences);
    console.log(`Saving preferences for user ${userId}:`, validated);
  } catch (error) {
    if (error instanceof PreferenceError) {
      console.error(`Validation failed for field "${error.field}": ${error.message}`);
    } else {
      console.error('Unknown error occurred:', error);
    }
    throw error;
  }
};

export { validatePreferences, saveUserPreferences, PreferenceError };
export type { UserPreferences };