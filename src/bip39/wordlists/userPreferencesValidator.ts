import { z } from 'zod';

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
  const current = UserPreferencesSchema.partial().parse(existing);
  const merged = { ...current, ...updates };
  return UserPreferencesSchema.parse(merged);
}
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class PreferenceValidator {
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de'];
  private static readonly MIN_FONT_SIZE = 8;
  private static readonly MAX_FONT_SIZE = 72;

  static validate(prefs: UserPreferences): string[] {
    const errors: string[] = [];

    if (!['light', 'dark', 'auto'].includes(prefs.theme)) {
      errors.push(`Invalid theme: ${prefs.theme}. Must be 'light', 'dark', or 'auto'`);
    }

    if (typeof prefs.notifications !== 'boolean') {
      errors.push('Notifications must be a boolean value');
    }

    if (!PreferenceValidator.SUPPORTED_LANGUAGES.includes(prefs.language)) {
      errors.push(`Unsupported language: ${prefs.language}. Supported: ${PreferenceValidator.SUPPORTED_LANGUAGES.join(', ')}`);
    }

    if (prefs.fontSize < PreferenceValidator.MIN_FONT_SIZE || prefs.fontSize > PreferenceValidator.MAX_FONT_SIZE) {
      errors.push(`Font size ${prefs.fontSize} out of range. Must be between ${PreferenceValidator.MIN_FONT_SIZE} and ${PreferenceValidator.MAX_FONT_SIZE}`);
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

export { UserPreferences, PreferenceValidator };import { z } from 'zod';

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

function validateUserPreferences(prefs: UserPreferences): void {
  const validLanguages = ['en', 'es', 'fr', 'de', 'ja'];
  
  if (!['light', 'dark', 'auto'].includes(prefs.theme)) {
    throw new PreferenceValidationError(
      `Invalid theme '${prefs.theme}'. Must be 'light', 'dark', or 'auto'.`
    );
  }
  
  if (typeof prefs.notifications !== 'boolean') {
    throw new PreferenceValidationError(
      `Notifications must be boolean, received ${typeof prefs.notifications}.`
    );
  }
  
  if (!validLanguages.includes(prefs.language)) {
    throw new PreferenceValidationError(
      `Unsupported language '${prefs.language}'. Supported: ${validLanguages.join(', ')}.`
    );
  }
  
  if (prefs.resultsPerPage < 5 || prefs.resultsPerPage > 100) {
    throw new PreferenceValidationError(
      `Results per page must be between 5 and 100, received ${prefs.resultsPerPage}.`
    );
  }
  
  if (!Number.isInteger(prefs.resultsPerPage)) {
    throw new PreferenceValidationError(
      `Results per page must be an integer, received ${prefs.resultsPerPage}.`
    );
  }
}

function testValidation() {
  const testCases: UserPreferences[] = [
    { theme: 'dark', notifications: true, language: 'en', resultsPerPage: 20 },
    { theme: 'blue', notifications: true, language: 'en', resultsPerPage: 20 },
    { theme: 'light', notifications: 'yes', language: 'en', resultsPerPage: 20 },
    { theme: 'auto', notifications: false, language: 'zh', resultsPerPage: 50 },
    { theme: 'dark', notifications: true, language: 'fr', resultsPerPage: 150 },
    { theme: 'light', notifications: false, language: 'de', resultsPerPage: 25.5 }
  ];
  
  testCases.forEach((prefs, index) => {
    console.log(`Test case ${index + 1}:`);
    try {
      validateUserPreferences(prefs);
      console.log('  ✓ Valid preferences');
    } catch (error) {
      if (error instanceof PreferenceValidationError) {
        console.log(`  ✗ ${error.message}`);
      } else {
        console.log(`  ✗ Unexpected error: ${error}`);
      }
    }
  });
}

export { UserPreferences, PreferenceValidationError, validateUserPreferences };
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

function validateUserPreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const defaults: UserPreferences = {
    theme: 'auto',
    notifications: true,
    language: 'en',
    fontSize: 14
  };

  const validated: UserPreferences = { ...defaults, ...prefs };

  if (!['light', 'dark', 'auto'].includes(validated.theme)) {
    throw new PreferenceValidationError(`Invalid theme: ${validated.theme}`);
  }

  if (typeof validated.notifications !== 'boolean') {
    throw new PreferenceValidationError('Notifications must be boolean');
  }

  if (!validated.language || validated.language.trim().length === 0) {
    throw new PreferenceValidationError('Language cannot be empty');
  }

  if (validated.fontSize < 8 || validated.fontSize > 72) {
    throw new PreferenceValidationError(`Font size ${validated.fontSize} out of range (8-72)`);
  }

  if (!Number.isInteger(validated.fontSize)) {
    throw new PreferenceValidationError('Font size must be integer');
  }

  return validated;
}

function formatValidationResult(prefs: Partial<UserPreferences>): string {
  try {
    const validated = validateUserPreferences(prefs);
    return `Valid preferences: ${JSON.stringify(validated)}`;
  } catch (error) {
    if (error instanceof PreferenceValidationError) {
      return `Validation failed: ${error.message}`;
    }
    return `Unexpected error: ${error}`;
  }
}

export { UserPreferences, validateUserPreferences, formatValidationResult, PreferenceValidationError };import { z } from 'zod';

export const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(['immediate', 'daily', 'weekly']).default('daily')
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'private', 'friends']).default('friends'),
    searchIndexing: z.boolean().default(true)
  }),
  language: z.string().min(2).max(5).default('en')
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
}

export function mergePreferences(
  existing: Partial<UserPreferences>,
  updates: Partial<UserPreferences>
): UserPreferences {
  const merged = { ...existing, ...updates };
  return PreferencesValidator.validate(merged);
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
      const errorMessages = error.errors.map(err => 
        `${err.path.join('.')}: ${err.message}`
      );
      throw new Error(`Validation failed:\n${errorMessages.join('\n')}`);
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
}typescript
interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
    language: string;
    fontSize: number;
    autoSave: boolean;
}

const DEFAULT_PREFERENCES: UserPreferences = {
    theme: 'auto',
    notifications: true,
    language: 'en-US',
    fontSize: 14,
    autoSave: true
};

function validatePreferences(input: Partial<UserPreferences>): UserPreferences {
    const validated: UserPreferences = { ...DEFAULT_PREFERENCES };
    
    if (input.theme && ['light', 'dark', 'auto'].includes(input.theme)) {
        validated.theme = input.theme;
    }
    
    if (typeof input.notifications === 'boolean') {
        validated.notifications = input.notifications;
    }
    
    if (input.language && typeof input.language === 'string') {
        validated.language = input.language;
    }
    
    if (typeof input.fontSize === 'number' && input.fontSize >= 8 && input.fontSize <= 32) {
        validated.fontSize = input.fontSize;
    }
    
    if (typeof input.autoSave === 'boolean') {
        validated.autoSave = input.autoSave;
    }
    
    return validated;
}

function mergePreferences(existing: UserPreferences, updates: Partial<UserPreferences>): UserPreferences {
    return validatePreferences({ ...existing, ...updates });
}

export { UserPreferences, validatePreferences, mergePreferences, DEFAULT_PREFERENCES };
```