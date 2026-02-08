import { z } from 'zod';

export const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(['immediate', 'daily', 'weekly']).default('daily')
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'private', 'friends']).default('public'),
    searchIndexing: z.boolean().default(true)
  }),
  language: z.string().min(2).default('en')
});

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export class PreferencesValidator {
  static validate(input: unknown): UserPreferences {
    try {
      return UserPreferencesSchema.parse(input);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const issues = error.issues.map(issue => ({
          path: issue.path.join('.'),
          message: issue.message
        }));
        throw new ValidationError('Invalid user preferences', issues);
      }
      throw error;
    }
  }

  static validatePartial(input: unknown): Partial<UserPreferences> {
    return UserPreferencesSchema.partial().parse(input);
  }

  static getDefaults(): UserPreferences {
    return UserPreferencesSchema.parse({});
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly issues: Array<{ path: string; message: string }>
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}import { z } from 'zod';

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
      throw new Error(`Invalid user preferences: ${errorMessages.join('; ')}`);
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
}import { z } from 'zod';

const PreferenceSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']),
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
    frequency: z.enum(['immediate', 'daily', 'weekly']).optional()
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'friends', 'private']),
    dataSharing: z.boolean().default(false)
  })
}).refine(
  (data) => !(data.notifications.email && !data.privacy.dataSharing),
  {
    message: 'Email notifications require data sharing consent',
    path: ['notifications', 'email']
  }
);

export function validateUserPreferences(input: unknown) {
  try {
    const validated = PreferenceSchema.parse(input);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      return { success: false, errors: formattedErrors };
    }
    throw error;
  }
}

export type UserPreferences = z.infer<typeof PreferenceSchema>;
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class PreferenceValidationError extends Error {
  constructor(
    public field: keyof UserPreferences,
    message: string
  ) {
    super(message);
    this.name = 'PreferenceValidationError';
  }
}

export function validateUserPreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const defaults: UserPreferences = {
    theme: 'auto',
    notifications: true,
    language: 'en',
    fontSize: 14
  };

  const validated: UserPreferences = { ...defaults, ...prefs };

  if (!['light', 'dark', 'auto'].includes(validated.theme)) {
    throw new PreferenceValidationError('theme', 'Theme must be light, dark, or auto');
  }

  if (typeof validated.notifications !== 'boolean') {
    throw new PreferenceValidationError('notifications', 'Notifications must be boolean');
  }

  if (!validated.language || validated.language.trim().length === 0) {
    throw new PreferenceValidationError('language', 'Language cannot be empty');
  }

  if (validated.fontSize < 8 || validated.fontSize > 72) {
    throw new PreferenceValidationError('fontSize', 'Font size must be between 8 and 72');
  }

  if (!Number.isInteger(validated.fontSize)) {
    throw new PreferenceValidationError('fontSize', 'Font size must be an integer');
  }

  return validated;
}

export function safeValidatePreferences(
  prefs: Partial<UserPreferences>
): { success: true; preferences: UserPreferences } | { success: false; error: PreferenceValidationError } {
  try {
    const preferences = validateUserPreferences(prefs);
    return { success: true, preferences };
  } catch (error) {
    if (error instanceof PreferenceValidationError) {
      return { success: false, error };
    }
    throw error;
  }
}