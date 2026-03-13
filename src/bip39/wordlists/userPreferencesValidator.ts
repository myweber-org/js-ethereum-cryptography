
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

function formatValidationResult(prefs: UserPreferences): string {
  return `Validated preferences: ${prefs.theme} theme, ${prefs.language} language, ` +
         `${prefs.fontSize}px font, notifications ${prefs.notifications ? 'on' : 'off'}`;
}

export { UserPreferences, PreferenceValidationError, validateUserPreferences, formatValidationResult };interface UserPreferences {
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

function validateUserPreferences(prefs: UserPreferences): void {
  const validThemes = ['light', 'dark', 'auto'];
  const validLanguages = ['en', 'es', 'fr', 'de', 'ja'];
  const timezoneRegex = /^[A-Za-z_]+\/[A-Za-z_]+$/;

  if (!validThemes.includes(prefs.theme)) {
    throw new PreferenceValidationError(
      `Invalid theme '${prefs.theme}'. Must be one of: ${validThemes.join(', ')}`
    );
  }

  if (typeof prefs.notifications !== 'boolean') {
    throw new PreferenceValidationError('Notifications must be a boolean value');
  }

  if (!validLanguages.includes(prefs.language)) {
    throw new PreferenceValidationError(
      `Unsupported language '${prefs.language}'. Supported languages: ${validLanguages.join(', ')}`
    );
  }

  if (!timezoneRegex.test(prefs.timezone)) {
    throw new PreferenceValidationError(
      `Invalid timezone format '${prefs.timezone}'. Expected format: Area/Location`
    );
  }
}

function updateUserPreferences(newPrefs: Partial<UserPreferences>): UserPreferences {
  const defaultPreferences: UserPreferences = {
    theme: 'auto',
    notifications: true,
    language: 'en',
    timezone: 'UTC'
  };

  const mergedPreferences = { ...defaultPreferences, ...newPrefs };
  validateUserPreferences(mergedPreferences);
  
  return mergedPreferences;
}

export { UserPreferences, PreferenceValidationError, validateUserPreferences, updateUserPreferences };import { z } from 'zod';

export const UserPreferencesSchema = z.object({
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

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export class PreferencesValidator {
  static validate(input: unknown): UserPreferences {
    try {
      return UserPreferencesSchema.parse(input);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => ({
          path: err.path.join('.'),
          message: this.formatErrorMessage(err)
        }));
        throw new PreferencesValidationError('Invalid user preferences', errors);
      }
      throw error;
    }
  }

  private static formatErrorMessage(error: z.ZodIssue): string {
    const { code, path } = error;
    const field = path[path.length - 1];
    
    switch (code) {
      case 'invalid_type':
        return `Field '${field}' must be of type ${error.expected}`;
      case 'invalid_enum_value':
        return `Field '${field}' must be one of: ${error.options.join(', ')}`;
      case 'too_small':
        return `Field '${field}' must be at least ${error.minimum} characters`;
      case 'too_big':
        return `Field '${field}' must be at most ${error.maximum} characters`;
      default:
        return `Validation failed for field '${field}'`;
    }
  }
}

export class PreferencesValidationError extends Error {
  constructor(
    message: string,
    public readonly details: Array<{ path: string; message: string }>
  ) {
    super(message);
    this.name = 'PreferencesValidationError';
  }

  toJSON() {
    return {
      error: this.name,
      message: this.message,
      details: this.details
    };
  }
}

export function createDefaultPreferences(): UserPreferences {
  return UserPreferencesSchema.parse({});
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

class UserPreferencesValidator {
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de'];
  private static readonly MIN_FONT_SIZE = 12;
  private static readonly MAX_FONT_SIZE = 24;

  static validate(prefs: Partial<UserPreferences>): UserPreferences {
    const validated: UserPreferences = {
      theme: 'auto',
      notifications: true,
      language: 'en',
      fontSize: 16,
      ...prefs
    };

    if (!['light', 'dark', 'auto'].includes(validated.theme)) {
      throw new PreferenceError(
        `Theme must be 'light', 'dark', or 'auto'`,
        'theme'
      );
    }

    if (typeof validated.notifications !== 'boolean') {
      throw new PreferenceError('Notifications must be a boolean', 'notifications');
    }

    if (!UserPreferencesValidator.SUPPORTED_LANGUAGES.includes(validated.language)) {
      throw new PreferenceError(
        `Language must be one of: ${UserPreferencesValidator.SUPPORTED_LANGUAGES.join(', ')}`,
        'language'
      );
    }

    if (validated.fontSize < UserPreferencesValidator.MIN_FONT_SIZE || 
        validated.fontSize > UserPreferencesValidator.MAX_FONT_SIZE) {
      throw new PreferenceError(
        `Font size must be between ${UserPreferencesValidator.MIN_FONT_SIZE} and ${UserPreferencesValidator.MAX_FONT_SIZE}`,
        'fontSize'
      );
    }

    return validated;
  }

  static validatePartial(prefs: Partial<UserPreferences>): Partial<UserPreferences> {
    const result: Partial<UserPreferences> = {};
    
    if (prefs.theme !== undefined) {
      if (!['light', 'dark', 'auto'].includes(prefs.theme)) {
        throw new PreferenceError(
          `Theme must be 'light', 'dark', or 'auto'`,
          'theme'
        );
      }
      result.theme = prefs.theme;
    }

    if (prefs.notifications !== undefined) {
      if (typeof prefs.notifications !== 'boolean') {
        throw new PreferenceError('Notifications must be a boolean', 'notifications');
      }
      result.notifications = prefs.notifications;
    }

    if (prefs.language !== undefined) {
      if (!UserPreferencesValidator.SUPPORTED_LANGUAGES.includes(prefs.language)) {
        throw new PreferenceError(
          `Language must be one of: ${UserPreferencesValidator.SUPPORTED_LANGUAGES.join(', ')}`,
          'language'
        );
      }
      result.language = prefs.language;
    }

    if (prefs.fontSize !== undefined) {
      if (prefs.fontSize < UserPreferencesValidator.MIN_FONT_SIZE || 
          prefs.fontSize > UserPreferencesValidator.MAX_FONT_SIZE) {
        throw new PreferenceError(
          `Font size must be between ${UserPreferencesValidator.MIN_FONT_SIZE} and ${UserPreferencesValidator.MAX_FONT_SIZE}`,
          'fontSize'
        );
      }
      result.fontSize = prefs.fontSize;
    }

    return result;
  }
}

export { UserPreferencesValidator, PreferenceError, type UserPreferences };interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class PreferenceValidationError extends Error {
  constructor(message: string, public field: string) {
    super(message);
    this.name = 'PreferenceValidationError';
  }
}

function validateUserPreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const errors: string[] = [];

  if (!prefs.theme || !['light', 'dark', 'auto'].includes(prefs.theme)) {
    errors.push('Theme must be one of: light, dark, auto');
  }

  if (typeof prefs.notifications !== 'boolean') {
    errors.push('Notifications must be a boolean value');
  }

  if (!prefs.language || typeof prefs.language !== 'string' || prefs.language.length < 2) {
    errors.push('Language must be a string with at least 2 characters');
  }

  if (typeof prefs.fontSize !== 'number' || prefs.fontSize < 8 || prefs.fontSize > 72) {
    errors.push('Font size must be a number between 8 and 72');
  }

  if (errors.length > 0) {
    throw new PreferenceValidationError(`Invalid preferences: ${errors.join('; ')}`, 'preferences');
  }

  return prefs as UserPreferences;
}

function applyUserPreferences(prefs: UserPreferences): void {
  console.log('Applying user preferences:', {
    theme: prefs.theme,
    notifications: prefs.notifications ? 'enabled' : 'disabled',
    language: prefs.language,
    fontSize: `${prefs.fontSize}px`
  });
}

export { validateUserPreferences, applyUserPreferences, PreferenceValidationError };