import { z } from 'zod';

const PreferenceSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']),
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
    frequency: z.enum(['instant', 'daily', 'weekly']).optional()
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'private', 'friends']),
    dataSharing: z.boolean().default(false)
  }).optional()
});

export type UserPreferences = z.infer<typeof PreferenceSchema>;

export class PreferenceValidator {
  static validate(input: unknown): UserPreferences {
    try {
      return PreferenceSchema.parse(input);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const issues = error.issues.map(issue => ({
          path: issue.path.join('.'),
          message: issue.message
        }));
        throw new PreferenceValidationError('Invalid preferences format', issues);
      }
      throw error;
    }
  }

  static validatePartial(updates: Partial<unknown>): Partial<UserPreferences> {
    return PreferenceSchema.partial().parse(updates);
  }
}

export class PreferenceValidationError extends Error {
  constructor(
    message: string,
    public readonly issues: Array<{ path: string; message: string }>
  ) {
    super(message);
    this.name = 'PreferenceValidationError';
  }

  formatIssues(): string {
    return this.issues
      .map(issue => `• ${issue.path}: ${issue.message}`)
      .join('\n');
  }
}

export function sanitizePreferences(prefs: UserPreferences): UserPreferences {
  return {
    ...prefs,
    privacy: {
      profileVisibility: prefs.privacy?.profileVisibility || 'private',
      dataSharing: prefs.privacy?.dataSharing || false
    }
  };
}interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  itemsPerPage: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en-US',
  itemsPerPage: 25
};

const THEME_VALUES = ['light', 'dark', 'auto'] as const;

function validateUserPreferences(input: unknown): UserPreferences {
  if (typeof input !== 'object' || input === null) {
    return DEFAULT_PREFERENCES;
  }

  const partial = input as Partial<UserPreferences>;
  
  const theme = THEME_VALUES.includes(partial.theme as any) 
    ? partial.theme 
    : DEFAULT_PREFERENCES.theme;

  const notifications = typeof partial.notifications === 'boolean'
    ? partial.notifications
    : DEFAULT_PREFERENCES.notifications;

  const language = typeof partial.language === 'string' 
    ? partial.language.trim() || DEFAULT_PREFERENCES.language
    : DEFAULT_PREFERENCES.language;

  const itemsPerPage = typeof partial.itemsPerPage === 'number' 
    ? Math.max(5, Math.min(100, partial.itemsPerPage))
    : DEFAULT_PREFERENCES.itemsPerPage;

  return {
    theme,
    notifications,
    language,
    itemsPerPage
  };
}

function mergePreferences(
  existing: UserPreferences,
  updates: Partial<UserPreferences>
): UserPreferences {
  const validatedUpdates = validateUserPreferences(updates);
  return {
    ...existing,
    ...validatedUpdates,
    itemsPerPage: Math.max(5, Math.min(100, validatedUpdates.itemsPerPage))
  };
}

export { UserPreferences, validateUserPreferences, mergePreferences, DEFAULT_PREFERENCES };