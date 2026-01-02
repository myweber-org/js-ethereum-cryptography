import { z } from 'zod';

const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(['immediate', 'daily', 'weekly']).default('daily')
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'friends', 'private']).default('friends'),
    searchIndexing: z.boolean().default(true)
  }),
  language: z.string().min(2).max(5).default('en')
});

type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export class UserPreferencesValidator {
  static validate(input: unknown): UserPreferences {
    try {
      return UserPreferencesSchema.parse(input);
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

  static getDefaultPreferences(): UserPreferences {
    return UserPreferencesSchema.parse({});
  }

  static mergeWithDefaults(partial: Partial<UserPreferences>): UserPreferences {
    const defaults = this.getDefaultPreferences();
    return UserPreferencesSchema.parse({ ...defaults, ...partial });
  }
}