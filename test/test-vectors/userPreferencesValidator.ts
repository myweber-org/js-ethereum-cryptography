
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class PreferenceValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PreferenceValidationError';
  }
}

class UserPreferencesValidator {
  private static readonly MIN_FONT_SIZE = 12;
  private static readonly MAX_FONT_SIZE = 24;
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja'];

  static validate(preferences: Partial<UserPreferences>): UserPreferences {
    const validated: UserPreferences = {
      theme: this.validateTheme(preferences.theme),
      notifications: this.validateNotifications(preferences.notifications),
      language: this.validateLanguage(preferences.language),
      fontSize: this.validateFontSize(preferences.fontSize)
    };

    return validated;
  }

  private static validateTheme(theme?: string): UserPreferences['theme'] {
    if (!theme) {
      throw new PreferenceValidationError('Theme is required');
    }

    if (theme !== 'light' && theme !== 'dark' && theme !== 'auto') {
      throw new PreferenceValidationError(`Invalid theme: ${theme}. Must be 'light', 'dark', or 'auto'`);
    }

    return theme as UserPreferences['theme'];
  }

  private static validateNotifications(notifications?: boolean): boolean {
    if (notifications === undefined) {
      throw new PreferenceValidationError('Notifications preference is required');
    }

    return notifications;
  }

  private static validateLanguage(language?: string): string {
    if (!language) {
      throw new PreferenceValidationError('Language is required');
    }

    if (!this.SUPPORTED_LANGUAGES.includes(language)) {
      throw new PreferenceValidationError(
        `Unsupported language: ${language}. Supported languages: ${this.SUPPORTED_LANGUAGES.join(', ')}`
      );
    }

    return language;
  }

  private static validateFontSize(fontSize?: number): number {
    if (fontSize === undefined) {
      throw new PreferenceValidationError('Font size is required');
    }

    if (!Number.isInteger(fontSize)) {
      throw new PreferenceValidationError('Font size must be an integer');
    }

    if (fontSize < this.MIN_FONT_SIZE || fontSize > this.MAX_FONT_SIZE) {
      throw new PreferenceValidationError(
        `Font size must be between ${this.MIN_FONT_SIZE} and ${this.MAX_FONT_SIZE}`
      );
    }

    return fontSize;
  }
}

export { UserPreferencesValidator, PreferenceValidationError, UserPreferences };import { z } from 'zod';

const PreferenceSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(['instant', 'daily', 'weekly']).default('daily')
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'private', 'friends']).default('friends'),
    searchIndexing: z.boolean().default(true)
  }).default({})
}).strict();

type UserPreferences = z.infer<typeof PreferenceSchema>;

export function validatePreferences(input: unknown): UserPreferences {
  try {
    return PreferenceSchema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const customMessages = error.errors.map(err => {
        switch (err.code) {
          case 'invalid_type':
            return `Field '${err.path.join('.')}' expects ${err.expected}, received ${err.received}`;
          case 'invalid_enum_value':
            return `Field '${err.path.join('.')}' must be one of: ${err.options?.join(', ')}`;
          case 'unrecognized_keys':
            return `Unrecognized field(s): ${err.keys.join(', ')}`;
          default:
            return err.message;
        }
      });
      throw new Error(`Validation failed:\n${customMessages.join('\n')}`);
    }
    throw error;
  }
}

export function getDefaultPreferences(): UserPreferences {
  return PreferenceSchema.parse({});
}interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  timezone: string;
}

class PreferenceValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PreferenceValidationError';
  }
}

class UserPreferencesValidator {
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja'];
  private static readonly VALID_TIMEZONES = /^[A-Za-z_]+\/[A-Za-z_]+$/;

  static validate(preferences: Partial<UserPreferences>): UserPreferences {
    const errors: string[] = [];

    if (!preferences.theme || !['light', 'dark', 'auto'].includes(preferences.theme)) {
      errors.push('Theme must be one of: light, dark, auto');
    }

    if (preferences.notifications === undefined || typeof preferences.notifications !== 'boolean') {
      errors.push('Notifications must be a boolean value');
    }

    if (!preferences.language || !this.SUPPORTED_LANGUAGES.includes(preferences.language)) {
      errors.push(`Language must be one of: ${this.SUPPORTED_LANGUAGES.join(', ')}`);
    }

    if (!preferences.timezone || !this.VALID_TIMEZONES.test(preferences.timezone)) {
      errors.push('Timezone must be in format: Area/Location (e.g., America/New_York)');
    }

    if (errors.length > 0) {
      throw new PreferenceValidationError(`Validation failed:\n${errors.join('\n')}`);
    }

    return preferences as UserPreferences;
  }

  static sanitize(preferences: UserPreferences): UserPreferences {
    return {
      theme: preferences.theme,
      notifications: preferences.notifications,
      language: preferences.language.toLowerCase(),
      timezone: preferences.timezone.replace(/\s+/g, '_')
    };
  }
}

export { UserPreferences, UserPreferencesValidator, PreferenceValidationError };
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  itemsPerPage: number;
}

class PreferenceValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PreferenceValidationError';
  }
}

function validateUserPreferences(prefs: unknown): UserPreferences {
  if (typeof prefs !== 'object' || prefs === null) {
    throw new PreferenceValidationError('Preferences must be an object');
  }

  const preferences = prefs as Record<string, unknown>;
  
  if (!['light', 'dark', 'auto'].includes(preferences.theme as string)) {
    throw new PreferenceValidationError('Theme must be light, dark, or auto');
  }

  if (typeof preferences.notifications !== 'boolean') {
    throw new PreferenceValidationError('Notifications must be a boolean value');
  }

  if (typeof preferences.language !== 'string' || preferences.language.length === 0) {
    throw new PreferenceValidationError('Language must be a non-empty string');
  }

  const itemsPerPage = Number(preferences.itemsPerPage);
  if (!Number.isInteger(itemsPerPage) || itemsPerPage < 5 || itemsPerPage > 100) {
    throw new PreferenceValidationError('Items per page must be an integer between 5 and 100');
  }

  return {
    theme: preferences.theme as 'light' | 'dark' | 'auto',
    notifications: preferences.notifications as boolean,
    language: preferences.language as string,
    itemsPerPage: itemsPerPage
  };
}

function saveUserPreferences(prefs: unknown): void {
  try {
    const validatedPrefs = validateUserPreferences(prefs);
    console.log('Saving validated preferences:', validatedPrefs);
  } catch (error) {
    if (error instanceof PreferenceValidationError) {
      console.error('Validation failed:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
  }
}import { z } from 'zod';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  resultsPerPage: number;
  timezone?: string;
}

const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']),
  notifications: z.boolean(),
  language: z.string().min(2).max(5),
  resultsPerPage: z.number().int().min(10).max(100),
  timezone: z.string().optional(),
});

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en',
  resultsPerPage: 20,
};

export function validatePreferences(input: unknown): UserPreferences {
  const result = UserPreferencesSchema.safeParse(input);
  
  if (!result.success) {
    console.warn('Invalid preferences detected, using defaults:', result.error.format());
    return DEFAULT_PREFERENCES;
  }
  
  return result.data;
}

export function mergePreferences(
  existing: Partial<UserPreferences>,
  updates: Partial<UserPreferences>
): UserPreferences {
  const merged = { ...DEFAULT_PREFERENCES, ...existing, ...updates };
  return validatePreferences(merged);
}

export function isPreferenceValid<T extends keyof UserPreferences>(
  key: T,
  value: UserPreferences[T]
): boolean {
  const testObj = { ...DEFAULT_PREFERENCES, [key]: value };
  return UserPreferencesSchema.safeParse(testObj).success;
}import { z } from 'zod';

const UserPreferencesSchema = z.object({
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

type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export function validateUserPreferences(input: unknown): UserPreferences {
  try {
    return UserPreferencesSchema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message
      }));
      throw new Error(`Invalid preferences: ${JSON.stringify(formattedErrors)}`);
    }
    throw error;
  }
}

export function getDefaultPreferences(): UserPreferences {
  return UserPreferencesSchema.parse({});
}

export function mergePreferences(
  existing: Partial<UserPreferences>,
  updates: Partial<UserPreferences>
): UserPreferences {
  const merged = { ...existing, ...updates };
  return validateUserPreferences(merged);
}import { z } from 'zod';

const PreferenceSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(['instant', 'daily', 'weekly']).default('daily')
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'private', 'friends']).default('friends'),
    searchIndexing: z.boolean().default(true)
  })
}).strict();

type UserPreferences = z.infer<typeof PreferenceSchema>;

export function validatePreferences(input: unknown): UserPreferences {
  try {
    return PreferenceSchema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message
      }));
      throw new Error(`Invalid preferences: ${JSON.stringify(formattedErrors)}`);
    }
    throw error;
  }
}

export function getDefaultPreferences(): UserPreferences {
  return PreferenceSchema.parse({});
}

export function mergePreferences(
  existing: Partial<UserPreferences>,
  updates: Partial<UserPreferences>
): UserPreferences {
  const current = PreferenceSchema.partial().parse(existing);
  const merged = { ...current, ...updates };
  return validatePreferences(merged);
}import { z } from 'zod';

const PreferenceSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(['instant', 'daily', 'weekly']).default('daily')
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'private', 'friends']).default('friends'),
    searchIndexing: z.boolean().default(true)
  }).default({})
}).strict();

type UserPreferences = z.infer<typeof PreferenceSchema>;

export function validatePreferences(input: unknown): UserPreferences {
  try {
    return PreferenceSchema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map(issue => ({
        path: issue.path.join('.'),
        message: issue.message
      }));
      throw new Error(`Invalid preferences: ${JSON.stringify(issues)}`);
    }
    throw error;
  }
}

export function getDefaultPreferences(): UserPreferences {
  return PreferenceSchema.parse({});
}

export function mergePreferences(
  existing: Partial<UserPreferences>,
  updates: Partial<UserPreferences>
): UserPreferences {
  const current = PreferenceSchema.partial().parse(existing);
  const merged = { ...current, ...updates };
  return validatePreferences(merged);
}interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  resultsPerPage: number;
}

class PreferenceValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PreferenceValidationError';
  }
}

class UserPreferencesValidator {
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de'];
  private static readonly MIN_RESULTS_PER_PAGE = 10;
  private static readonly MAX_RESULTS_PER_PAGE = 100;

  static validate(preferences: Partial<UserPreferences>): UserPreferences {
    const validated: UserPreferences = {
      theme: this.validateTheme(preferences.theme),
      notifications: this.validateNotifications(preferences.notifications),
      language: this.validateLanguage(preferences.language),
      resultsPerPage: this.validateResultsPerPage(preferences.resultsPerPage)
    };

    return validated;
  }

  private static validateTheme(theme?: string): 'light' | 'dark' | 'auto' {
    if (!theme) {
      throw new PreferenceValidationError('Theme is required');
    }

    if (theme !== 'light' && theme !== 'dark' && theme !== 'auto') {
      throw new PreferenceValidationError(
        `Invalid theme '${theme}'. Must be 'light', 'dark', or 'auto'`
      );
    }

    return theme;
  }

  private static validateNotifications(notifications?: boolean): boolean {
    if (notifications === undefined || notifications === null) {
      throw new PreferenceValidationError('Notifications preference is required');
    }

    return notifications;
  }

  private static validateLanguage(language?: string): string {
    if (!language) {
      throw new PreferenceValidationError('Language is required');
    }

    if (!this.SUPPORTED_LANGUAGES.includes(language)) {
      throw new PreferenceValidationError(
        `Language '${language}' is not supported. Supported languages: ${this.SUPPORTED_LANGUAGES.join(', ')}`
      );
    }

    return language;
  }

  private static validateResultsPerPage(results?: number): number {
    if (results === undefined || results === null) {
      throw new PreferenceValidationError('Results per page is required');
    }

    if (!Number.isInteger(results)) {
      throw new PreferenceValidationError('Results per page must be an integer');
    }

    if (results < this.MIN_RESULTS_PER_PAGE || results > this.MAX_RESULTS_PER_PAGE) {
      throw new PreferenceValidationError(
        `Results per page must be between ${this.MIN_RESULTS_PER_PAGE} and ${this.MAX_RESULTS_PER_PAGE}`
      );
    }

    return results;
  }
}

export { UserPreferencesValidator, PreferenceValidationError, UserPreferences };import { z } from 'zod';

const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).default('system'),
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
});

type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export function validateUserPreferences(input: unknown): UserPreferences {
  try {
    return UserPreferencesSchema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const defaultPreferences = UserPreferencesSchema.parse({});
      console.warn('Invalid preferences, using defaults:', error.errors);
      return defaultPreferences;
    }
    throw error;
  }
}

export function mergePreferences(
  existing: Partial<UserPreferences>,
  updates: Partial<UserPreferences>
): UserPreferences {
  const merged = { ...existing, ...updates };
  return validateUserPreferences(merged);
}

export function getPreferencesDiff(
  oldPrefs: UserPreferences,
  newPrefs: UserPreferences
): Partial<UserPreferences> {
  const diff: Partial<UserPreferences> = {};
  
  Object.keys(newPrefs).forEach(key => {
    const typedKey = key as keyof UserPreferences;
    if (JSON.stringify(oldPrefs[typedKey]) !== JSON.stringify(newPrefs[typedKey])) {
      diff[typedKey] = newPrefs[typedKey];
    }
  });
  
  return diff;
}import { z } from 'zod';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
  autoSave: boolean;
}

export const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']),
  notifications: z.boolean(),
  language: z.string().min(2).max(5),
  fontSize: z.number().int().min(8).max(72),
  autoSave: z.boolean()
});

export class PreferencesValidator {
  static validate(preferences: unknown): UserPreferences {
    try {
      return UserPreferencesSchema.parse(preferences) as UserPreferences;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(err => 
          `${err.path.join('.')}: ${err.message}`
        );
        throw new Error(`Invalid preferences: ${errorMessages.join(', ')}`);
      }
      throw new Error('Unknown validation error');
    }
  }

  static validatePartial(updates: Partial<unknown>): Partial<UserPreferences> {
    const partialSchema = UserPreferencesSchema.partial();
    return partialSchema.parse(updates) as Partial<UserPreferences>;
  }

  static getDefaultPreferences(): UserPreferences {
    return {
      theme: 'auto',
      notifications: true,
      language: 'en',
      fontSize: 14,
      autoSave: true
    };
  }

  static isThemeValid(theme: string): theme is UserPreferences['theme'] {
    return ['light', 'dark', 'auto'].includes(theme);
  }
}

export function mergePreferences(
  existing: UserPreferences,
  updates: Partial<UserPreferences>
): UserPreferences {
  const validatedUpdates = PreferencesValidator.validatePartial(updates);
  return { ...existing, ...validatedUpdates };
}

export function createPreferencesStore() {
  let preferences = PreferencesValidator.getDefaultPreferences();

  return {
    getPreferences(): UserPreferences {
      return { ...preferences };
    },

    updatePreferences(updates: Partial<unknown>): UserPreferences {
      const validated = PreferencesValidator.validatePartial(updates);
      preferences = mergePreferences(preferences, validated);
      return this.getPreferences();
    },

    resetToDefaults(): UserPreferences {
      preferences = PreferencesValidator.getDefaultPreferences();
      return this.getPreferences();
    },

    validateExternalData(data: unknown): UserPreferences {
      return PreferencesValidator.validate(data);
    }
  };
}interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  resultsPerPage: number;
}

class PreferenceValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PreferenceValidationError';
  }
}

class UserPreferencesValidator {
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de'];
  private static readonly MIN_RESULTS_PER_PAGE = 5;
  private static readonly MAX_RESULTS_PER_PAGE = 100;

  static validate(preferences: Partial<UserPreferences>): UserPreferences {
    const validated: UserPreferences = {
      theme: 'auto',
      notifications: true,
      language: 'en',
      resultsPerPage: 20,
      ...preferences
    };

    if (!['light', 'dark', 'auto'].includes(validated.theme)) {
      throw new PreferenceValidationError(
        `Invalid theme '${validated.theme}'. Must be one of: light, dark, auto`
      );
    }

    if (typeof validated.notifications !== 'boolean') {
      throw new PreferenceValidationError(
        `Notifications must be a boolean value, received: ${typeof validated.notifications}`
      );
    }

    if (!UserPreferencesValidator.SUPPORTED_LANGUAGES.includes(validated.language)) {
      throw new PreferenceValidationError(
        `Unsupported language '${validated.language}'. Supported: ${UserPreferencesValidator.SUPPORTED_LANGUAGES.join(', ')}`
      );
    }

    if (!Number.isInteger(validated.resultsPerPage) || 
        validated.resultsPerPage < UserPreferencesValidator.MIN_RESULTS_PER_PAGE ||
        validated.resultsPerPage > UserPreferencesValidator.MAX_RESULTS_PER_PAGE) {
      throw new PreferenceValidationError(
        `Results per page must be an integer between ${UserPreferencesValidator.MIN_RESULTS_PER_PAGE} and ${UserPreferencesValidator.MAX_RESULTS_PER_PAGE}`
      );
    }

    return validated;
  }

  static validateAndLog(preferences: Partial<UserPreferences>): UserPreferences {
    try {
      const result = this.validate(preferences);
      console.log('Preferences validated successfully:', result);
      return result;
    } catch (error) {
      if (error instanceof PreferenceValidationError) {
        console.error('Validation failed:', error.message);
      }
      throw error;
    }
  }
}

export { UserPreferences, UserPreferencesValidator, PreferenceValidationError };