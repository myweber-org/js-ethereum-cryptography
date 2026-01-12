import { z } from 'zod';

export const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(['instant', 'daily', 'weekly']).default('daily')
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'private', 'friends']).default('friends'),
    searchIndexing: z.boolean().default(true)
  }).default({})
});

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export class PreferencesValidator {
  static validate(input: unknown): UserPreferences {
    try {
      return UserPreferencesSchema.parse(input);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.warn('Invalid preferences provided, using defaults:', error.errors);
      }
      return UserPreferencesSchema.parse({});
    }
  }

  static mergeWithDefaults(partial: Partial<UserPreferences>): UserPreferences {
    const validated = this.validate(partial);
    return {
      ...this.getDefaults(),
      ...validated
    };
  }

  static getDefaults(): UserPreferences {
    return UserPreferencesSchema.parse({});
  }
}