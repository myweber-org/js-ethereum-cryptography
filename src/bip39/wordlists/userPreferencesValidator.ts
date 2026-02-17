import { z } from 'zod';

export const userPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(['instant', 'daily', 'weekly']).default('daily')
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'friends', 'private']).default('friends'),
    searchIndexing: z.boolean().default(true)
  }),
  language: z.string().min(2).max(5).default('en')
}).strict();

export type UserPreferences = z.infer<typeof userPreferencesSchema>;

export class PreferencesValidator {
  static validate(input: unknown): UserPreferences {
    try {
      return userPreferencesSchema.parse(input);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: this.getCustomMessage(err.path, err.code)
        }));
        throw new ValidationError('Invalid preferences configuration', fieldErrors);
      }
      throw error;
    }
  }

  private static getCustomMessage(path: string[], code: string): string {
    const field = path[path.length - 1];
    
    const messages: Record<string, string> = {
      invalid_enum_value: `The ${field} must be one of the allowed values`,
      invalid_type: `The ${field} must be of correct data type`,
      too_small: `The ${field} is too short`,
      too_big: `The ${field} is too long`
    };

    return messages[code] || `Validation failed for ${field}`;
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

export function sanitizePreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const defaults: UserPreferences = {
    theme: 'auto',
    notifications: {
      email: true,
      push: false,
      frequency: 'daily'
    },
    privacy: {
      profileVisibility: 'friends',
      searchIndexing: true
    },
    language: 'en'
  };

  return PreferencesValidator.validate({ ...defaults, ...prefs });
}