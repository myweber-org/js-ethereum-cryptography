
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

export const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notificationsEnabled: z.boolean().default(true),
  itemsPerPage: z.number().int().min(5).max(100).default(25),
  language: z.string().min(2).max(5).default('en'),
  timezone: z.string().optional(),
  emailFrequency: z.enum(['immediate', 'daily', 'weekly']).default('daily')
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
        throw new PreferencesValidationError('Invalid user preferences', issues);
      }
      throw error;
    }
  }

  static validatePartial(input: Partial<unknown>): Partial<UserPreferences> {
    return UserPreferencesSchema.partial().parse(input);
  }

  static getDefaultPreferences(): UserPreferences {
    return UserPreferencesSchema.parse({});
  }
}

export class PreferencesValidationError extends Error {
  constructor(
    message: string,
    public readonly issues: Array<{ path: string; message: string }>
  ) {
    super(message);
    this.name = 'PreferencesValidationError';
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      issues: this.issues
    };
  }
}

export function mergePreferences(
  base: UserPreferences,
  updates: Partial<UserPreferences>
): UserPreferences {
  const validatedUpdates = PreferencesValidator.validatePartial(updates);
  return { ...base, ...validatedUpdates };
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

  static validate(preferences: Partial<UserPreferences>): UserPreferences {
    const validated: UserPreferences = {
      theme: this.validateTheme(preferences.theme),
      notifications: this.validateNotifications(preferences.notifications),
      language: this.validateLanguage(preferences.language),
      fontSize: this.validateFontSize(preferences.fontSize)
    };

    return validated;
  }

  private static validateTheme(theme?: string): 'light' | 'dark' | 'auto' {
    if (!theme) {
      throw new PreferenceError('Theme is required', 'theme');
    }

    if (theme !== 'light' && theme !== 'dark' && theme !== 'auto') {
      throw new PreferenceError(
        `Theme must be 'light', 'dark', or 'auto'`,
        'theme'
      );
    }

    return theme;
  }

  private static validateNotifications(notifications?: boolean): boolean {
    if (notifications === undefined || notifications === null) {
      throw new PreferenceError('Notifications setting is required', 'notifications');
    }

    return notifications;
  }

  private static validateLanguage(language?: string): string {
    if (!language) {
      throw new PreferenceError('Language is required', 'language');
    }

    if (!this.SUPPORTED_LANGUAGES.includes(language)) {
      throw new PreferenceError(
        `Language must be one of: ${this.SUPPORTED_LANGUAGES.join(', ')}`,
        'language'
      );
    }

    return language;
  }

  private static validateFontSize(fontSize?: number): number {
    if (fontSize === undefined || fontSize === null) {
      throw new PreferenceError('Font size is required', 'fontSize');
    }

    if (!Number.isInteger(fontSize)) {
      throw new PreferenceError('Font size must be an integer', 'fontSize');
    }

    if (fontSize < this.MIN_FONT_SIZE || fontSize > this.MAX_FONT_SIZE) {
      throw new PreferenceError(
        `Font size must be between ${this.MIN_FONT_SIZE} and ${this.MAX_FONT_SIZE}`,
        'fontSize'
      );
    }

    return fontSize;
  }
}

export { UserPreferencesValidator, UserPreferences, PreferenceError };import { z } from 'zod';

export const userPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(['instant', 'daily', 'weekly']).default('daily')
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'friends', 'private']).default('friends'),
    searchIndexing: z.boolean().default(true)
  }).default({}),
  language: z.string().min(2).max(5).default('en')
}).refine((data) => {
  return !(data.privacy.profileVisibility === 'public' && !data.privacy.searchIndexing);
}, {
  message: 'Public profiles must be searchable',
  path: ['privacy', 'searchIndexing']
});

export type UserPreferences = z.infer<typeof userPreferencesSchema>;

export class PreferencesValidator {
  static validate(input: unknown): UserPreferences {
    try {
      return userPreferencesSchema.parse(input);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        throw new PreferencesValidationError('Invalid preferences configuration', formattedErrors);
      }
      throw error;
    }
  }

  static validatePartial(input: unknown): Partial<UserPreferences> {
    return userPreferencesSchema.partial().parse(input);
  }
}

export class PreferencesValidationError extends Error {
  constructor(
    message: string,
    public readonly details: Array<{ field: string; message: string }>
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

export function mergePreferences(
  existing: UserPreferences,
  updates: Partial<UserPreferences>
): UserPreferences {
  const validatedUpdates = PreferencesValidator.validatePartial(updates);
  return { ...existing, ...validatedUpdates };
}interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  itemsPerPage: number;
}

class PreferenceValidator {
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja'];
  private static readonly MAX_ITEMS_PER_PAGE = 100;
  private static readonly MIN_ITEMS_PER_PAGE = 5;

  static validate(prefs: Partial<UserPreferences>): string[] {
    const errors: string[] = [];

    if (prefs.theme !== undefined) {
      if (!['light', 'dark', 'auto'].includes(prefs.theme)) {
        errors.push(`Invalid theme: ${prefs.theme}. Must be 'light', 'dark', or 'auto'.`);
      }
    }

    if (prefs.language !== undefined) {
      if (!PreferenceValidator.SUPPORTED_LANGUAGES.includes(prefs.language)) {
        errors.push(`Unsupported language: ${prefs.language}. Supported: ${PreferenceValidator.SUPPORTED_LANGUAGES.join(', ')}`);
      }
    }

    if (prefs.itemsPerPage !== undefined) {
      if (!Number.isInteger(prefs.itemsPerPage)) {
        errors.push(`Items per page must be an integer. Received: ${prefs.itemsPerPage}`);
      } else if (prefs.itemsPerPage < PreferenceValidator.MIN_ITEMS_PER_PAGE) {
        errors.push(`Items per page (${prefs.itemsPerPage}) is below minimum ${PreferenceValidator.MIN_ITEMS_PER_PAGE}`);
      } else if (prefs.itemsPerPage > PreferenceValidator.MAX_ITEMS_PER_PAGE) {
        errors.push(`Items per page (${prefs.itemsPerPage}) exceeds maximum ${PreferenceValidator.MAX_ITEMS_PER_PAGE}`);
      }
    }

    if (prefs.notifications !== undefined && typeof prefs.notifications !== 'boolean') {
      errors.push(`Notifications must be boolean. Received: ${typeof prefs.notifications}`);
    }

    return errors;
  }

  static validateAndThrow(prefs: Partial<UserPreferences>): void {
    const errors = this.validate(prefs);
    if (errors.length > 0) {
      throw new Error(`Validation failed:\n${errors.join('\n')}`);
    }
  }
}

export { UserPreferences, PreferenceValidator };import { z } from 'zod';

const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.boolean().default(true),
  language: z.string().min(2).default('en'),
  itemsPerPage: z.number().min(5).max(100).default(25),
  autoSave: z.boolean().default(false),
  twoFactorEnabled: z.boolean().default(false),
});

type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export function validateUserPreferences(
  input: unknown
): { success: true; data: UserPreferences } | { success: false; error: string } {
  try {
    const result = UserPreferencesSchema.parse(input);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: 'Invalid input format' };
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
  return UserPreferencesSchema.parse(merged);
}