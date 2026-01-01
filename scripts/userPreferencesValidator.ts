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
}import { z } from 'zod';

export const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).default('system'),
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

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export class PreferencesValidator {
  static validate(input: unknown): UserPreferences {
    try {
      return UserPreferencesSchema.parse(input);
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

  static getDefaultPreferences(): UserPreferences {
    return UserPreferencesSchema.parse({});
  }

  static mergeWithDefaults(partial: Partial<UserPreferences>): UserPreferences {
    const defaults = this.getDefaultPreferences();
    return this.validate({ ...defaults, ...partial });
  }
}