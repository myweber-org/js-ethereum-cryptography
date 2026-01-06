import { z } from 'zod';

export const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(['immediate', 'daily', 'weekly']).default('daily')
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'friends', 'private']).default('friends'),
    searchIndexing: z.boolean().default(true)
  }).default({}),
  language: z.string().min(2).max(5).default('en')
});

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export class PreferencesValidator {
  static validate(input: unknown): UserPreferences {
    try {
      return UserPreferencesSchema.parse(input);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Invalid preferences: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw new Error('Failed to validate user preferences');
    }
  }

  static sanitize(preferences: Partial<UserPreferences>): UserPreferences {
    const defaults = UserPreferencesSchema.parse({});
    return { ...defaults, ...preferences };
  }

  static isThemeDark(preferences: UserPreferences): boolean {
    if (preferences.theme === 'dark') return true;
    if (preferences.theme === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
}