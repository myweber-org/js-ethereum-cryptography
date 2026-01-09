import { z } from 'zod';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  itemsPerPage: number;
}

export const userPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto'], {
    required_error: 'Theme selection is required',
    invalid_type_error: 'Theme must be light, dark, or auto'
  }),
  notifications: z.boolean({
    required_error: 'Notification preference is required',
    invalid_type_error: 'Notifications must be true or false'
  }),
  language: z.string()
    .min(2, 'Language code must be at least 2 characters')
    .max(5, 'Language code cannot exceed 5 characters')
    .regex(/^[a-z]{2}(-[A-Z]{2})?$/, 'Invalid language code format'),
  itemsPerPage: z.number()
    .int('Items per page must be an integer')
    .min(5, 'Minimum 5 items per page')
    .max(100, 'Maximum 100 items per page')
    .default(20)
});

export class PreferencesValidator {
  static validate(preferences: unknown): UserPreferences {
    try {
      return userPreferencesSchema.parse(preferences);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.map(err => 
          `${err.path.join('.')}: ${err.message}`
        );
        throw new Error(`Validation failed:\n${formattedErrors.join('\n')}`);
      }
      throw error;
    }
  }

  static validatePartial(updates: Partial<unknown>): Partial<UserPreferences> {
    return userPreferencesSchema.partial().parse(updates);
  }

  static getDefaultPreferences(): UserPreferences {
    return userPreferencesSchema.parse({});
  }
}

export function sanitizePreferences(input: Record<string, unknown>): UserPreferences {
  const sanitized = {
    theme: String(input.theme || 'auto').toLowerCase(),
    notifications: Boolean(input.notifications),
    language: String(input.language || 'en'),
    itemsPerPage: Number(input.itemsPerPage) || 20
  };

  return PreferencesValidator.validate(sanitized);
}