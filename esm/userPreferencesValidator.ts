import { z } from 'zod';

export const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(['immediate', 'daily', 'weekly']).default('daily')
  }).default({}),
  resultsPerPage: z.number().min(5).max(100).default(20),
  language: z.string().length(2).default('en')
});

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export function validateUserPreferences(input: unknown): UserPreferences {
  try {
    return UserPreferencesSchema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.warn('Invalid preferences provided, using defaults:', error.errors);
    }
    return UserPreferencesSchema.parse({});
  }
}

export function mergePreferences(
  existing: Partial<UserPreferences>,
  updates: Partial<UserPreferences>
): UserPreferences {
  const merged = { ...existing, ...updates };
  return validateUserPreferences(merged);
}import { z } from 'zod';

const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(['immediate', 'daily', 'weekly']).default('daily')
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'private', 'friends']).default('friends'),
    dataSharing: z.boolean().default(false)
  }).default({}),
  language: z.string().min(2).max(5).default('en')
});

type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export class PreferencesValidator {
  static validate(input: unknown): UserPreferences {
    try {
      return UserPreferencesSchema.parse(input);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Invalid preferences: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw error;
    }
  }

  static getDefaultPreferences(): UserPreferences {
    return UserPreferencesSchema.parse({});
  }

  static mergePreferences(existing: Partial<UserPreferences>, updates: Partial<UserPreferences>): UserPreferences {
    const current = this.validate(existing);
    const validatedUpdates = this.validate(updates);
    
    return {
      ...current,
      ...validatedUpdates,
      notifications: {
        ...current.notifications,
        ...validatedUpdates.notifications
      },
      privacy: {
        ...current.privacy,
        ...validatedUpdates.privacy
      }
    };
  }
}

export function isPreferencesValid(prefs: unknown): prefs is UserPreferences {
  return UserPreferencesSchema.safeParse(prefs).success;
}
interface UserPreferences {
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

export function validateUserPreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const errors: string[] = [];

  if (!prefs.theme) {
    errors.push('Theme selection is required');
  } else if (!['light', 'dark', 'auto'].includes(prefs.theme)) {
    errors.push('Theme must be light, dark, or auto');
  }

  if (prefs.notifications === undefined) {
    errors.push('Notification preference is required');
  }

  if (prefs.language) {
    if (typeof prefs.language !== 'string' || prefs.language.length < 2) {
      errors.push('Language code must be at least 2 characters');
    }
  }

  if (prefs.fontSize !== undefined) {
    if (typeof prefs.fontSize !== 'number' || prefs.fontSize < 8 || prefs.fontSize > 72) {
      errors.push('Font size must be between 8 and 72');
    }
  }

  if (errors.length > 0) {
    throw new PreferenceError(`Validation failed: ${errors.join('; ')}`, 'preferences');
  }

  return {
    theme: prefs.theme || 'auto',
    notifications: prefs.notifications ?? true,
    language: prefs.language || 'en',
    fontSize: prefs.fontSize || 16,
  };
}

export function safeValidatePreferences(prefs: Partial<UserPreferences>) {
  try {
    return {
      success: true,
      data: validateUserPreferences(prefs),
    };
  } catch (error) {
    if (error instanceof PreferenceError) {
      return {
        success: false,
        error: error.message,
        field: error.field,
      };
    }
    throw error;
  }
}