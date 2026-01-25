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

function validateUserPreferences(prefs: UserPreferences): void {
  const validThemes = ['light', 'dark', 'auto'];
  const validLanguages = ['en', 'es', 'fr', 'de'];
  const minFontSize = 12;
  const maxFontSize = 24;

  if (!validThemes.includes(prefs.theme)) {
    throw new PreferenceValidationError(
      `Invalid theme: ${prefs.theme}. Must be one of: ${validThemes.join(', ')}`
    );
  }

  if (typeof prefs.notifications !== 'boolean') {
    throw new PreferenceValidationError('Notifications must be a boolean value');
  }

  if (!validLanguages.includes(prefs.language)) {
    throw new PreferenceValidationError(
      `Unsupported language: ${prefs.language}. Supported languages: ${validLanguages.join(', ')}`
    );
  }

  if (prefs.fontSize < minFontSize || prefs.fontSize > maxFontSize) {
    throw new PreferenceValidationError(
      `Font size ${prefs.fontSize} is out of range. Must be between ${minFontSize} and ${maxFontSize}`
    );
  }
}

function saveUserPreferences(prefs: UserPreferences): boolean {
  try {
    validateUserPreferences(prefs);
    console.log('Preferences validated successfully');
    return true;
  } catch (error) {
    if (error instanceof PreferenceValidationError) {
      console.error('Validation failed:', error.message);
      return false;
    }
    throw error;
  }
}

export { UserPreferences, PreferenceValidationError, validateUserPreferences, saveUserPreferences };interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class PreferenceValidator {
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de'];
  private static readonly MIN_FONT_SIZE = 12;
  private static readonly MAX_FONT_SIZE = 24;

  static validate(prefs: UserPreferences): string[] {
    const errors: string[] = [];

    if (!['light', 'dark', 'auto'].includes(prefs.theme)) {
      errors.push(`Invalid theme: ${prefs.theme}. Must be 'light', 'dark', or 'auto'.`);
    }

    if (typeof prefs.notifications !== 'boolean') {
      errors.push('Notifications must be a boolean value.');
    }

    if (!PreferenceValidator.SUPPORTED_LANGUAGES.includes(prefs.language)) {
      errors.push(`Unsupported language: ${prefs.language}. Supported: ${PreferenceValidator.SUPPORTED_LANGUAGES.join(', ')}`);
    }

    if (prefs.fontSize < PreferenceValidator.MIN_FONT_SIZE || prefs.fontSize > PreferenceValidator.MAX_FONT_SIZE) {
      errors.push(`Font size ${prefs.fontSize} out of range. Must be between ${PreferenceValidator.MIN_FONT_SIZE} and ${PreferenceValidator.MAX_FONT_SIZE}.`);
    }

    return errors;
  }
}

function validateUserPreferences(prefs: any): void {
  const errors = PreferenceValidator.validate(prefs as UserPreferences);
  
  if (errors.length === 0) {
    console.log('Preferences are valid.');
  } else {
    console.error('Validation errors:');
    errors.forEach(error => console.error(`  - ${error}`));
  }
}

export { UserPreferences, PreferenceValidator, validateUserPreferences };import { z } from 'zod';

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
      const validationErrors = error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message
      }));
      throw new Error(`Invalid preferences: ${JSON.stringify(validationErrors)}`);
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
}import { z } from "zod";

const UserPreferencesSchema = z.object({
  theme: z.enum(["light", "dark", "system"]).default("system"),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(["instant", "daily", "weekly"]).default("daily")
  }),
  privacy: z.object({
    profileVisibility: z.enum(["public", "private", "friends"]).default("public"),
    dataSharing: z.boolean().default(false)
  }),
  language: z.string().min(2).max(5).default("en")
}).strict();

type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export function validateUserPreferences(input: unknown): UserPreferences {
  try {
    return UserPreferencesSchema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => 
        `${err.path.join(".")}: ${err.message}`
      );
      throw new Error(`Invalid preferences: ${errorMessages.join(", ")}`);
    }
    throw error;
  }
}

export function createDefaultPreferences(): UserPreferences {
  return UserPreferencesSchema.parse({});
}

export function mergePreferences(
  existing: Partial<UserPreferences>,
  updates: Partial<UserPreferences>
): UserPreferences {
  const merged = { ...existing, ...updates };
  return validateUserPreferences(merged);
}typescript
interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
    language: string;
    itemsPerPage: number;
}

class PreferenceValidator {
    private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de'];
    private static readonly MIN_ITEMS_PER_PAGE = 5;
    private static readonly MAX_ITEMS_PER_PAGE = 100;

    static validate(prefs: UserPreferences): string[] {
        const errors: string[] = [];

        if (!['light', 'dark', 'auto'].includes(prefs.theme)) {
            errors.push(`Invalid theme value: ${prefs.theme}. Must be 'light', 'dark', or 'auto'.`);
        }

        if (typeof prefs.notifications !== 'boolean') {
            errors.push('Notifications must be a boolean value.');
        }

        if (!PreferenceValidator.SUPPORTED_LANGUAGES.includes(prefs.language)) {
            errors.push(`Unsupported language: ${prefs.language}. Supported languages: ${PreferenceValidator.SUPPORTED_LANGUAGES.join(', ')}.`);
        }

        if (prefs.itemsPerPage < PreferenceValidator.MIN_ITEMS_PER_PAGE || 
            prefs.itemsPerPage > PreferenceValidator.MAX_ITEMS_PER_PAGE) {
            errors.push(`Items per page must be between ${PreferenceValidator.MIN_ITEMS_PER_PAGE} and ${PreferenceValidator.MAX_ITEMS_PER_PAGE}.`);
        }

        return errors;
    }

    static validateAndThrow(prefs: UserPreferences): void {
        const errors = this.validate(prefs);
        if (errors.length > 0) {
            throw new Error(`Validation failed:\n${errors.join('\n')}`);
        }
    }
}

function processUserPreferences(prefs: UserPreferences): void {
    try {
        PreferenceValidator.validateAndThrow(prefs);
        console.log('Preferences validated successfully.');
    } catch (error) {
        console.error('Failed to process preferences:', error.message);
    }
}

const validPreferences: UserPreferences = {
    theme: 'dark',
    notifications: true,
    language: 'en',
    itemsPerPage: 25
};

const invalidPreferences: UserPreferences = {
    theme: 'blue',
    notifications: 'yes',
    language: 'zh',
    itemsPerPage: 150
};

processUserPreferences(validPreferences);
processUserPreferences(invalidPreferences);
```interface UserPreferences {
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

function validateUserPreferences(prefs: UserPreferences): void {
  const validThemes = ['light', 'dark', 'auto'];
  
  if (!validThemes.includes(prefs.theme)) {
    throw new PreferenceValidationError(
      `Invalid theme: ${prefs.theme}. Must be one of: ${validThemes.join(', ')}`
    );
  }

  if (typeof prefs.notifications !== 'boolean') {
    throw new PreferenceValidationError(
      'Notifications must be a boolean value'
    );
  }

  if (!prefs.language || prefs.language.trim().length === 0) {
    throw new PreferenceValidationError(
      'Language must be a non-empty string'
    );
  }

  if (prefs.fontSize < 12 || prefs.fontSize > 24) {
    throw new PreferenceValidationError(
      `Font size ${prefs.fontSize} is out of range. Must be between 12 and 24`
    );
  }
}

function saveUserPreferences(prefs: UserPreferences): boolean {
  try {
    validateUserPreferences(prefs);
    console.log('Preferences validated successfully');
    return true;
  } catch (error) {
    if (error instanceof PreferenceValidationError) {
      console.error('Validation failed:', error.message);
      return false;
    }
    throw error;
  }
}