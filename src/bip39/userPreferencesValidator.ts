import { z } from 'zod';

const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(['instant', 'daily', 'weekly']).default('daily')
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'private', 'friends']).default('friends'),
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
}
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  timezone: string;
}

class PreferenceValidator {
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja'];
  private static readonly VALID_TIMEZONES = /^[A-Za-z_]+\/[A-Za-z_]+$/;

  static validate(prefs: UserPreferences): string[] {
    const errors: string[] = [];

    if (!['light', 'dark', 'auto'].includes(prefs.theme)) {
      errors.push('Theme must be light, dark, or auto');
    }

    if (typeof prefs.notifications !== 'boolean') {
      errors.push('Notifications must be a boolean value');
    }

    if (!PreferenceValidator.SUPPORTED_LANGUAGES.includes(prefs.language)) {
      errors.push(`Language must be one of: ${PreferenceValidator.SUPPORTED_LANGUAGES.join(', ')}`);
    }

    if (!PreferenceValidator.VALID_TIMEZONES.test(prefs.timezone)) {
      errors.push('Timezone must be in format Area/Location (e.g., America/New_York)');
    }

    return errors;
  }

  static validateAndThrow(prefs: UserPreferences): void {
    const errors = this.validate(prefs);
    if (errors.length > 0) {
      throw new Error(`Invalid preferences: ${errors.join('; ')}`);
    }
  }
}

export { UserPreferences, PreferenceValidator };interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  resultsPerPage: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en-US',
  resultsPerPage: 20
};

const VALID_LANGUAGES = new Set(['en-US', 'es-ES', 'fr-FR', 'de-DE']);
const MIN_RESULTS_PER_PAGE = 5;
const MAX_RESULTS_PER_PAGE = 100;

class PreferencesValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PreferencesValidationError';
  }
}

function validateUserPreferences(input: unknown): UserPreferences {
  if (typeof input !== 'object' || input === null) {
    throw new PreferencesValidationError('Preferences must be an object');
  }

  const prefs = { ...DEFAULT_PREFERENCES, ...input } as Record<string, unknown>;
  
  if (!['light', 'dark', 'auto'].includes(prefs.theme as string)) {
    throw new PreferencesValidationError('Theme must be light, dark, or auto');
  }

  if (typeof prefs.notifications !== 'boolean') {
    throw new PreferencesValidationError('Notifications must be a boolean');
  }

  if (!VALID_LANGUAGES.has(prefs.language as string)) {
    throw new PreferencesValidationError(`Language must be one of: ${Array.from(VALID_LANGUAGES).join(', ')}`);
  }

  if (typeof prefs.resultsPerPage !== 'number' || 
      prefs.resultsPerPage < MIN_RESULTS_PER_PAGE || 
      prefs.resultsPerPage > MAX_RESULTS_PER_PAGE) {
    throw new PreferencesValidationError(`Results per page must be between ${MIN_RESULTS_PER_PAGE} and ${MAX_RESULTS_PER_PAGE}`);
  }

  return prefs as UserPreferences;
}

function sanitizePreferences(preferences: Partial<UserPreferences>): UserPreferences {
  try {
    return validateUserPreferences(preferences);
  } catch (error) {
    if (error instanceof PreferencesValidationError) {
      console.warn(`Invalid preference detected: ${error.message}. Using defaults.`);
      return DEFAULT_PREFERENCES;
    }
    throw error;
  }
}

export { UserPreferences, validateUserPreferences, sanitizePreferences, PreferencesValidationError };