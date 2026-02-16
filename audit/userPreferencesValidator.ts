import { z } from 'zod';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  timezone: string;
}

const userPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']),
  notifications: z.boolean(),
  language: z.string().min(2).max(5),
  timezone: z.string().regex(/^[A-Za-z_]+\/[A-Za-z_]+$/)
});

export class PreferencesValidator {
  static validate(input: unknown): UserPreferences {
    try {
      return userPreferencesSchema.parse(input) as UserPreferences;
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

  static validatePartial(input: Partial<unknown>): Partial<UserPreferences> {
    const partialSchema = userPreferencesSchema.partial();
    return partialSchema.parse(input) as Partial<UserPreferences>;
  }

  static getDefaultPreferences(): UserPreferences {
    return {
      theme: 'auto',
      notifications: true,
      language: 'en',
      timezone: 'UTC'
    };
  }
}import { z } from 'zod';

const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notificationsEnabled: z.boolean().default(true),
  emailFrequency: z.enum(['immediate', 'daily', 'weekly']).default('daily'),
  resultsPerPage: z.number().min(5).max(100).default(20),
  language: z.string().length(2).optional(),
  timezone: z.string().optional(),
});

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
}