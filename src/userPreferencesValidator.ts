typescript
interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
    language: string;
    fontSize: number;
}

class PreferencesValidator {
    private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de'];
    private static readonly MIN_FONT_SIZE = 8;
    private static readonly MAX_FONT_SIZE = 72;

    static validate(preferences: Partial<UserPreferences>): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (preferences.theme !== undefined && !['light', 'dark', 'auto'].includes(preferences.theme)) {
            errors.push(`Invalid theme: ${preferences.theme}. Must be 'light', 'dark', or 'auto'.`);
        }

        if (preferences.notifications !== undefined && typeof preferences.notifications !== 'boolean') {
            errors.push('Notifications must be a boolean value.');
        }

        if (preferences.language !== undefined) {
            if (typeof preferences.language !== 'string') {
                errors.push('Language must be a string.');
            } else if (!PreferencesValidator.SUPPORTED_LANGUAGES.includes(preferences.language)) {
                errors.push(`Unsupported language: ${preferences.language}. Supported: ${PreferencesValidator.SUPPORTED_LANGUAGES.join(', ')}`);
            }
        }

        if (preferences.fontSize !== undefined) {
            if (typeof preferences.fontSize !== 'number') {
                errors.push('Font size must be a number.');
            } else if (preferences.fontSize < PreferencesValidator.MIN_FONT_SIZE || preferences.fontSize > PreferencesValidator.MAX_FONT_SIZE) {
                errors.push(`Font size must be between ${PreferencesValidator.MIN_FONT_SIZE} and ${PreferencesValidator.MAX_FONT_SIZE}.`);
            }
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    static normalize(preferences: Partial<UserPreferences>): UserPreferences {
        return {
            theme: preferences.theme || 'auto',
            notifications: preferences.notifications ?? true,
            language: preferences.language || 'en',
            fontSize: preferences.fontSize || 16
        };
    }
}

export { UserPreferences, PreferencesValidator };
```import { z } from 'zod';

export const userPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(['immediate', 'daily', 'weekly']).default('daily')
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'friends', 'private']).default('friends'),
    searchIndexing: z.boolean().default(true)
  })
}).refine((data) => {
  return !(data.privacy.profileVisibility === 'private' && data.privacy.searchIndexing);
}, {
  message: 'Private profiles cannot be indexed by search engines',
  path: ['privacy', 'searchIndexing']
});

export type UserPreferences = z.infer<typeof userPreferencesSchema>;

export function validateUserPreferences(input: unknown): UserPreferences {
  try {
    return userPreferencesSchema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message
      }));
      throw new Error(`Validation failed: ${JSON.stringify(formattedErrors)}`);
    }
    throw error;
  }
}

export function createDefaultPreferences(): UserPreferences {
  return userPreferencesSchema.parse({});
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

    if (preferences.notifications === undefined) {
      errors.push('Notifications preference is required');
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
      ...preferences,
      language: preferences.language.toLowerCase(),
      timezone: preferences.timezone.replace(/\s+/g, '_')
    };
  }
}

export { UserPreferencesValidator, PreferenceValidationError, UserPreferences };
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  itemsPerPage: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en',
  itemsPerPage: 20
};

class PreferencesValidator {
  private static readonly THEMES: Set<UserPreferences['theme']> = new Set(['light', 'dark', 'auto']);
  private static readonly SUPPORTED_LANGUAGES: Set<string> = new Set(['en', 'es', 'fr', 'de']);
  private static readonly MIN_ITEMS_PER_PAGE = 5;
  private static readonly MAX_ITEMS_PER_PAGE = 100;

  static validate(preferences: Partial<UserPreferences>): { valid: boolean; errors: string[]; normalized: UserPreferences } {
    const errors: string[] = [];
    const normalized: UserPreferences = { ...DEFAULT_PREFERENCES };

    if (preferences.theme !== undefined) {
      if (this.THEMES.has(preferences.theme)) {
        normalized.theme = preferences.theme;
      } else {
        errors.push(`Invalid theme: ${preferences.theme}. Must be one of: ${Array.from(this.THEMES).join(', ')}`);
      }
    }

    if (preferences.notifications !== undefined) {
      if (typeof preferences.notifications === 'boolean') {
        normalized.notifications = preferences.notifications;
      } else {
        errors.push('Notifications must be a boolean value');
      }
    }

    if (preferences.language !== undefined) {
      if (typeof preferences.language === 'string' && this.SUPPORTED_LANGUAGES.has(preferences.language)) {
        normalized.language = preferences.language;
      } else {
        errors.push(`Unsupported language: ${preferences.language}. Supported: ${Array.from(this.SUPPORTED_LANGUAGES).join(', ')}`);
      }
    }

    if (preferences.itemsPerPage !== undefined) {
      if (typeof preferences.itemsPerPage === 'number' && 
          preferences.itemsPerPage >= this.MIN_ITEMS_PER_PAGE && 
          preferences.itemsPerPage <= this.MAX_ITEMS_PER_PAGE) {
        normalized.itemsPerPage = preferences.itemsPerPage;
      } else {
        errors.push(`Items per page must be between ${this.MIN_ITEMS_PER_PAGE} and ${this.MAX_ITEMS_PER_PAGE}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      normalized
    };
  }

  static sanitizeInput(rawInput: unknown): Partial<UserPreferences> {
    const sanitized: Partial<UserPreferences> = {};

    if (rawInput && typeof rawInput === 'object') {
      const input = rawInput as Record<string, unknown>;

      if ('theme' in input && typeof input.theme === 'string') {
        sanitized.theme = input.theme as UserPreferences['theme'];
      }

      if ('notifications' in input && typeof input.notifications === 'boolean') {
        sanitized.notifications = input.notifications;
      }

      if ('language' in input && typeof input.language === 'string') {
        sanitized.language = input.language;
      }

      if ('itemsPerPage' in input && typeof input.itemsPerPage === 'number') {
        sanitized.itemsPerPage = input.itemsPerPage;
      }
    }

    return sanitized;
  }
}

export { UserPreferences, PreferencesValidator };
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
  twoFactorEnabled: boolean;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en-US',
  fontSize: 14,
  twoFactorEnabled: false
};

const VALID_LANGUAGES = new Set(['en-US', 'es-ES', 'fr-FR', 'de-DE', 'ja-JP']);

class PreferencesValidator {
  static validate(preferences: Partial<UserPreferences>): UserPreferences {
    const validated: UserPreferences = { ...DEFAULT_PREFERENCES };

    if (preferences.theme && ['light', 'dark', 'auto'].includes(preferences.theme)) {
      validated.theme = preferences.theme;
    }

    if (typeof preferences.notifications === 'boolean') {
      validated.notifications = preferences.notifications;
    }

    if (preferences.language && VALID_LANGUAGES.has(preferences.language)) {
      validated.language = preferences.language;
    }

    if (preferences.fontSize && Number.isInteger(preferences.fontSize) && preferences.fontSize >= 10 && preferences.fontSize <= 24) {
      validated.fontSize = preferences.fontSize;
    }

    if (typeof preferences.twoFactorEnabled === 'boolean') {
      validated.twoFactorEnabled = preferences.twoFactorEnabled;
    }

    return validated;
  }

  static sanitizeInput(input: unknown): Partial<UserPreferences> {
    const sanitized: Partial<UserPreferences> = {};

    if (input && typeof input === 'object') {
      const obj = input as Record<string, unknown>;

      if (obj.theme && typeof obj.theme === 'string') {
        sanitized.theme = obj.theme as UserPreferences['theme'];
      }

      if (typeof obj.notifications === 'boolean') {
        sanitized.notifications = obj.notifications;
      }

      if (obj.language && typeof obj.language === 'string') {
        sanitized.language = obj.language;
      }

      if (obj.fontSize && typeof obj.fontSize === 'number') {
        sanitized.fontSize = obj.fontSize;
      }

      if (typeof obj.twoFactorEnabled === 'boolean') {
        sanitized.twoFactorEnabled = obj.twoFactorEnabled;
      }
    }

    return sanitized;
  }
}

export { UserPreferences, PreferencesValidator };