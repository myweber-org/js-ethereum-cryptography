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
    dataSharing: z.boolean().default(false)
  }),
  language: z.string().min(2).max(5).default('en')
}).strict();

type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export class PreferencesValidator {
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
      throw new Error('Invalid preferences data structure');
    }
  }

  static getDefaultPreferences(): UserPreferences {
    return UserPreferencesSchema.parse({});
  }

  static mergePreferences(
    existing: Partial<UserPreferences>,
    updates: Partial<UserPreferences>
  ): UserPreferences {
    const merged = { ...existing, ...updates };
    return this.validate(merged);
  }
}

export function validatePreferencesUpdate(
  current: UserPreferences,
  updates: Partial<UserPreferences>
): { isValid: boolean; errors: string[]; updated?: UserPreferences } {
  const errors: string[] = [];
  
  try {
    const merged = PreferencesValidator.mergePreferences(current, updates);
    return { isValid: true, errors: [], updated: merged };
  } catch (error) {
    if (error instanceof Error) {
      errors.push(error.message);
    }
    return { isValid: false, errors };
  }
}