
import { z } from 'zod';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  timezone: string;
}

export const userPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto'], {
    errorMap: () => ({ message: 'Theme must be light, dark, or auto' }),
  }),
  notifications: z.boolean({
    errorMap: () => ({ message: 'Notifications must be true or false' }),
  }),
  language: z.string().min(2, 'Language code must be at least 2 characters'),
  timezone: z.string().regex(
    /^[A-Za-z_]+\/[A-Za-z_]+$/,
    'Timezone must be in Area/Location format'
  ),
});

export class UserPreferencesValidator {
  static validate(data: unknown): UserPreferences {
    try {
      return userPreferencesSchema.parse(data) as UserPreferences;
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

  static validatePartial(data: Partial<unknown>): Partial<UserPreferences> {
    try {
      return userPreferencesSchema.partial().parse(data) as Partial<UserPreferences>;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(err => 
          `${err.path.join('.')}: ${err.message}`
        );
        throw new Error(`Partial validation failed:\n${errorMessages.join('\n')}`);
      }
      throw error;
    }
  }

  static getDefaultPreferences(): UserPreferences {
    return {
      theme: 'auto',
      notifications: true,
      language: 'en',
      timezone: 'UTC',
    };
  }
}