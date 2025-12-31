import { z } from 'zod';

export const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notificationsEnabled: z.boolean().default(true),
  itemsPerPage: z.number().int().min(5).max(100).default(25),
  language: z.string().min(2).max(5).default('en'),
  timezone: z.string().optional(),
  autoSaveInterval: z.number().int().min(0).max(3600).default(300)
});

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export class PreferencesValidator {
  static validate(input: unknown): UserPreferences {
    try {
      return UserPreferencesSchema.parse(input);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const defaultValues = UserPreferencesSchema.parse({});
        console.warn('Invalid preferences, using defaults:', error.errors);
        return defaultValues;
      }
      throw error;
    }
  }

  static sanitize(preferences: Partial<UserPreferences>): UserPreferences {
    const validated = this.validate(preferences);
    return {
      ...validated,
      itemsPerPage: Math.min(validated.itemsPerPage, 50),
      autoSaveInterval: Math.max(validated.autoSaveInterval, 60)
    };
  }

  static mergeWithDefaults(partial: Partial<UserPreferences>): UserPreferences {
    const defaults = UserPreferencesSchema.parse({});
    return this.validate({ ...defaults, ...partial });
  }
}

export function createDefaultPreferences(): UserPreferences {
  return PreferencesValidator.mergeWithDefaults({});
}