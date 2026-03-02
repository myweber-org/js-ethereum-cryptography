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
  }),
  language: z.string().min(2).max(5).default('en')
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
    throw new Error('Failed to validate preferences');
  }
}

export function getDefaultPreferences(): UserPreferences {
  return PreferenceSchema.parse({});
}

export function mergePreferences(existing: Partial<UserPreferences>, updates: Partial<UserPreferences>): UserPreferences {
  const current = PreferenceSchema.partial().parse(existing);
  const changes = PreferenceSchema.partial().parse(updates);
  
  const merged = { ...current, ...changes };
  return validatePreferences(merged);
}import { z } from 'zod';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']),
  notifications: z.boolean(),
  language: z.string().min(2).max(5),
  fontSize: z.number().int().min(12).max(24)
});

export class PreferencesValidator {
  static validate(input: unknown): UserPreferences {
    try {
      return UserPreferencesSchema.parse(input) as UserPreferences;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(err => 
          `${err.path.join('.')}: ${err.message}`
        );
        throw new Error(`Validation failed: ${errorMessages.join('; ')}`);
      }
      throw new Error('Invalid preferences format');
    }
  }

  static sanitize(prefs: Partial<UserPreferences>): UserPreferences {
    const defaults: UserPreferences = {
      theme: 'auto',
      notifications: true,
      language: 'en',
      fontSize: 16
    };
    
    return {
      ...defaults,
      ...prefs,
      fontSize: Math.min(Math.max(prefs.fontSize || defaults.fontSize, 12), 24)
    };
  }

  static isValidTheme(theme: string): theme is UserPreferences['theme'] {
    return ['light', 'dark', 'auto'].includes(theme);
  }
}interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  resultsPerPage: number;
}

class PreferencesValidator {
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de'];
  private static readonly MIN_RESULTS_PER_PAGE = 10;
  private static readonly MAX_RESULTS_PER_PAGE = 100;

  static validate(preferences: Partial<UserPreferences>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (preferences.theme !== undefined) {
      if (!['light', 'dark', 'auto'].includes(preferences.theme)) {
        errors.push(`Invalid theme: ${preferences.theme}. Must be 'light', 'dark', or 'auto'.`);
      }
    }

    if (preferences.language !== undefined) {
      if (!PreferencesValidator.SUPPORTED_LANGUAGES.includes(preferences.language)) {
        errors.push(`Unsupported language: ${preferences.language}. Supported: ${PreferencesValidator.SUPPORTED_LANGUAGES.join(', ')}`);
      }
    }

    if (preferences.resultsPerPage !== undefined) {
      if (!Number.isInteger(preferences.resultsPerPage)) {
        errors.push(`Results per page must be an integer. Received: ${preferences.resultsPerPage}`);
      } else if (preferences.resultsPerPage < PreferencesValidator.MIN_RESULTS_PER_PAGE || 
                 preferences.resultsPerPage > PreferencesValidator.MAX_RESULTS_PER_PAGE) {
        errors.push(`Results per page must be between ${PreferencesValidator.MIN_RESULTS_PER_PAGE} and ${PreferencesValidator.MAX_RESULTS_PER_PAGE}.`);
      }
    }

    if (preferences.notifications !== undefined && typeof preferences.notifications !== 'boolean') {
      errors.push(`Notifications must be a boolean value. Received: ${typeof preferences.notifications}`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static getDefaultPreferences(): UserPreferences {
    return {
      theme: 'auto',
      notifications: true,
      language: 'en',
      resultsPerPage: 20
    };
  }
}

function mergePreferences(current: UserPreferences, updates: Partial<UserPreferences>): UserPreferences {
  const validation = PreferencesValidator.validate(updates);
  if (!validation.isValid) {
    throw new Error(`Invalid preferences: ${validation.errors.join(' ')}`);
  }
  
  return { ...current, ...updates };
}

export { UserPreferences, PreferencesValidator, mergePreferences };