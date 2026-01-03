interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class PreferenceValidationError extends Error {
  constructor(message: string, public field: keyof UserPreferences) {
    super(message);
    this.name = 'PreferenceValidationError';
  }
}

const validateUserPreferences = (prefs: Partial<UserPreferences>): UserPreferences => {
  const defaultPreferences: UserPreferences = {
    theme: 'auto',
    notifications: true,
    language: 'en',
    fontSize: 14
  };

  const validated: UserPreferences = { ...defaultPreferences };

  if (prefs.theme !== undefined) {
    if (!['light', 'dark', 'auto'].includes(prefs.theme)) {
      throw new PreferenceValidationError(
        'Theme must be one of: light, dark, auto',
        'theme'
      );
    }
    validated.theme = prefs.theme;
  }

  if (prefs.notifications !== undefined) {
    if (typeof prefs.notifications !== 'boolean') {
      throw new PreferenceValidationError(
        'Notifications must be a boolean value',
        'notifications'
      );
    }
    validated.notifications = prefs.notifications;
  }

  if (prefs.language !== undefined) {
    if (typeof prefs.language !== 'string' || prefs.language.length !== 2) {
      throw new PreferenceValidationError(
        'Language must be a 2-character ISO code',
        'language'
      );
    }
    validated.language = prefs.language.toLowerCase();
  }

  if (prefs.fontSize !== undefined) {
    if (typeof prefs.fontSize !== 'number' || prefs.fontSize < 8 || prefs.fontSize > 72) {
      throw new PreferenceValidationError(
        'Font size must be between 8 and 72',
        'fontSize'
      );
    }
    validated.fontSize = Math.round(prefs.fontSize);
  }

  return validated;
};

export { validateUserPreferences, PreferenceValidationError, type UserPreferences };import { z } from 'zod';

const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
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
}).strict();

type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export function validateUserPreferences(input: unknown): UserPreferences {
  try {
    return UserPreferencesSchema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      throw new Error(`Invalid preferences: ${errorMessages.join('; ')}`);
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