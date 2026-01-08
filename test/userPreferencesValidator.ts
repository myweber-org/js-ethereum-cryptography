import { z } from 'zod';

const PreferenceSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(['immediate', 'daily', 'weekly']).default('daily')
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'friends', 'private']).default('friends'),
    searchIndexing: z.boolean().default(true)
  })
}).strict();

type UserPreferences = z.infer<typeof PreferenceSchema>;

export class PreferencesValidator {
  static validate(input: unknown): UserPreferences {
    try {
      return PreferenceSchema.parse(input);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const messages = error.errors.map(err => {
          const path = err.path.join('.');
          return `Invalid value at '${path}': ${err.message}`;
        });
        throw new Error(`Validation failed:\n${messages.join('\n')}`);
      }
      throw new Error('Unexpected validation error');
    }
  }

  static getDefaultPreferences(): UserPreferences {
    return PreferenceSchema.parse({});
  }
}

export function mergePreferences(
  existing: Partial<UserPreferences>,
  updates: Partial<UserPreferences>
): UserPreferences {
  const base = PreferencesValidator.getDefaultPreferences();
  const merged = { ...base, ...existing, ...updates };
  
  return PreferencesValidator.validate(merged);
}