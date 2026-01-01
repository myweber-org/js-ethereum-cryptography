import { z } from 'zod';

const PreferenceSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(['instant', 'daily', 'weekly']).default('daily')
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'friends', 'private']).default('friends'),
    searchIndexing: z.boolean().default(true)
  })
}).strict();

type UserPreferences = z.infer<typeof PreferenceSchema>;

export function validatePreferences(input: unknown): UserPreferences {
  try {
    return PreferenceSchema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      throw new Error(`Invalid preferences: ${errorMessages.join('; ')}`);
    }
    throw new Error('Unexpected validation error');
  }
}

export function getDefaultPreferences(): UserPreferences {
  return PreferenceSchema.parse({});
}interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class PreferenceError extends Error {
  constructor(message: string, public field: string) {
    super(message);
    this.name = 'PreferenceError';
  }
}

function validateUserPreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const errors: string[] = [];
  
  if (!prefs.theme) {
    errors.push('Theme is required');
  } else if (!['light', 'dark', 'auto'].includes(prefs.theme)) {
    errors.push('Theme must be light, dark, or auto');
  }
  
  if (prefs.notifications === undefined) {
    errors.push('Notifications preference is required');
  }
  
  if (!prefs.language) {
    errors.push('Language is required');
  } else if (typeof prefs.language !== 'string' || prefs.language.length < 2) {
    errors.push('Language must be at least 2 characters');
  }
  
  if (prefs.fontSize === undefined) {
    errors.push('Font size is required');
  } else if (typeof prefs.fontSize !== 'number' || prefs.fontSize < 8 || prefs.fontSize > 72) {
    errors.push('Font size must be between 8 and 72');
  }
  
  if (errors.length > 0) {
    throw new PreferenceError(`Validation failed: ${errors.join('; ')}`, 'preferences');
  }
  
  return prefs as UserPreferences;
}

function formatValidationError(error: unknown): string {
  if (error instanceof PreferenceError) {
    return `[${error.field.toUpperCase()}] ${error.message}`;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Unknown validation error';
}

export { validateUserPreferences, formatValidationError, PreferenceError };
export type { UserPreferences };