
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
      throw new PreferenceValidationError('Theme is required');
    }

    if (theme !== 'light' && theme !== 'dark' && theme !== 'auto') {
      throw new PreferenceValidationError(`Invalid theme: ${theme}. Must be 'light', 'dark', or 'auto'`);
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
        `Unsupported language: ${language}. Supported languages: ${this.SUPPORTED_LANGUAGES.join(', ')}`
      );
    }

    return language;
  }

  private static validateFontSize(fontSize?: number): number {
    if (fontSize === undefined || fontSize === null) {
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

export { UserPreferencesValidator, PreferenceValidationError, UserPreferences };
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
  itemsPerPage: number;
}

class PreferenceValidator {
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de'];
  private static readonly MIN_ITEMS_PER_PAGE = 5;
  private static readonly MAX_ITEMS_PER_PAGE = 100;

  static validate(prefs: Partial<UserPreferences>): string[] {
    const errors: string[] = [];

    if (prefs.theme !== undefined) {
      if (!['light', 'dark', 'auto'].includes(prefs.theme)) {
        errors.push(`Theme must be one of: light, dark, auto. Received: ${prefs.theme}`);
      }
    }

    if (prefs.language !== undefined) {
      if (!PreferenceValidator.SUPPORTED_LANGUAGES.includes(prefs.language)) {
        errors.push(`Language ${prefs.language} is not supported. Supported: ${PreferenceValidator.SUPPORTED_LANGUAGES.join(', ')}`);
      }
    }

    if (prefs.itemsPerPage !== undefined) {
      if (!Number.isInteger(prefs.itemsPerPage)) {
        errors.push(`Items per page must be an integer. Received: ${prefs.itemsPerPage}`);
      } else if (prefs.itemsPerPage < PreferenceValidator.MIN_ITEMS_PER_PAGE || 
                 prefs.itemsPerPage > PreferenceValidator.MAX_ITEMS_PER_PAGE) {
        errors.push(`Items per page must be between ${PreferenceValidator.MIN_ITEMS_PER_PAGE} and ${PreferenceValidator.MAX_ITEMS_PER_PAGE}. Received: ${prefs.itemsPerPage}`);
      }
    }

    return errors;
  }

  static validateAndThrow(prefs: Partial<UserPreferences>): void {
    const errors = this.validate(prefs);
    if (errors.length > 0) {
      throw new Error(`Invalid preferences:\n${errors.join('\n')}`);
    }
  }
}

export { UserPreferences, PreferenceValidator };import { z } from 'zod';

const ThemeSchema = z.enum(['light', 'dark', 'system']);
const NotificationPreferenceSchema = z.object({
  email: z.boolean(),
  push: z.boolean(),
  sms: z.boolean(),
});

export const UserPreferencesSchema = z.object({
  userId: z.string().uuid(),
  theme: ThemeSchema.default('system'),
  notifications: NotificationPreferenceSchema.default({
    email: true,
    push: false,
    sms: false,
  }),
  language: z.string().min(2).max(5).default('en'),
  timezone: z.string().optional(),
  autoSave: z.boolean().default(true),
  resultsPerPage: z.number().int().min(5).max(100).default(25),
});

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export function validateUserPreferences(
  input: unknown
): UserPreferences | null {
  const result = UserPreferencesSchema.safeParse(input);
  return result.success ? result.data : null;
}

export function createDefaultPreferences(
  userId: string
): UserPreferences {
  return UserPreferencesSchema.parse({ userId });
}import { z } from 'zod';

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
  }).default({}),
  updatedAt: z.date().optional()
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
    throw error;
  }
}

export function mergePreferences(existing: UserPreferences, updates: Partial<UserPreferences>): UserPreferences {
  const merged = { ...existing, ...updates };
  return validatePreferences(merged);
}

export function getDefaultPreferences(): UserPreferences {
  return PreferenceSchema.parse({});
}