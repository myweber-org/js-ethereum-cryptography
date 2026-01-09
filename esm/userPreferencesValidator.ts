import { z } from 'zod';

const PreferenceSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(['immediate', 'daily', 'weekly']).default('daily')
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'friends', 'private']).default('friends'),
    searchIndexing: z.boolean().default(true)
  }).default({}),
  updatedAt: z.date().optional()
}).strict();

type UserPreferences = z.infer<typeof PreferenceSchema>;

export function validatePreferences(input: unknown): UserPreferences {
  try {
    return PreferenceSchema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map(err => 
        `${err.path.join('.')}: ${err.message}`
      );
      throw new Error(`Invalid preferences: ${formattedErrors.join('; ')}`);
    }
    throw error;
  }
}

export function mergePreferences(
  existing: Partial<UserPreferences>,
  updates: Partial<UserPreferences>
): UserPreferences {
  const base = PreferenceSchema.parse(existing);
  const merged = { ...base, ...updates };
  return validatePreferences(merged);
}

export function getDefaultPreferences(): UserPreferences {
  return PreferenceSchema.parse({});
}