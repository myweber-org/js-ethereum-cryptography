
interface UserPreferences {
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

    if (preferences.notifications !== undefined && typeof preferences.notifications !== 'boolean') {
      errors.push('Notifications must be a boolean value');
    }

    if (preferences.language && !this.SUPPORTED_LANGUAGES.includes(preferences.language)) {
      errors.push(`Language must be one of: ${this.SUPPORTED_LANGUAGES.join(', ')}`);
    }

    if (preferences.timezone && !this.VALID_TIMEZONES.test(preferences.timezone)) {
      errors.push('Timezone must be in format: Area/Location (e.g., America/New_York)');
    }

    if (errors.length > 0) {
      throw new PreferenceValidationError(`Validation failed: ${errors.join('; ')}`);
    }

    return {
      theme: preferences.theme || 'auto',
      notifications: preferences.notifications ?? true,
      language: preferences.language || 'en',
      timezone: preferences.timezone || 'UTC',
    };
  }
}

export { UserPreferencesValidator, PreferenceValidationError, UserPreferences };typescript
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class PreferenceValidator {
  private static readonly MIN_FONT_SIZE = 12;
  private static readonly MAX_FONT_SIZE = 24;
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja'];

  static validate(prefs: Partial<UserPreferences>): string[] {
    const errors: string[] = [];

    if (prefs.theme !== undefined) {
      if (!['light', 'dark', 'auto'].includes(prefs.theme)) {
        errors.push(`Invalid theme: ${prefs.theme}. Must be 'light', 'dark', or 'auto'`);
      }
    }

    if (prefs.language !== undefined) {
      if (!PreferenceValidator.SUPPORTED_LANGUAGES.includes(prefs.language)) {
        errors.push(`Unsupported language: ${prefs.language}. Supported: ${PreferenceValidator.SUPPORTED_LANGUAGES.join(', ')}`);
      }
    }

    if (prefs.fontSize !== undefined) {
      if (typeof prefs.fontSize !== 'number') {
        errors.push('Font size must be a number');
      } else if (prefs.fontSize < PreferenceValidator.MIN_FONT_SIZE) {
        errors.push(`Font size too small: ${prefs.fontSize}. Minimum is ${PreferenceValidator.MIN_FONT_SIZE}`);
      } else if (prefs.fontSize > PreferenceValidator.MAX_FONT_SIZE) {
        errors.push(`Font size too large: ${prefs.fontSize}. Maximum is ${PreferenceValidator.MAX_FONT_SIZE}`);
      }
    }

    return errors;
  }

  static validateAndApply(prefs: UserPreferences): { success: boolean; errors?: string[] } {
    const errors = this.validate(prefs);
    
    if (errors.length > 0) {
      return { success: false, errors };
    }

    console.log('Applying preferences:', prefs);
    return { success: true };
  }
}

export { UserPreferences, PreferenceValidator };
```import { z } from 'zod';

const ThemeSchema = z.enum(['light', 'dark', 'auto']);
const LanguageSchema = z.enum(['en', 'es', 'fr', 'de']);
const NotificationSettingsSchema = z.object({
  email: z.boolean(),
  push: z.boolean(),
  frequency: z.enum(['immediate', 'daily', 'weekly']).optional(),
});

export const UserPreferencesSchema = z.object({
  userId: z.string().uuid(),
  theme: ThemeSchema.default('auto'),
  language: LanguageSchema.default('en'),
  notifications: NotificationSettingsSchema.default({
    email: true,
    push: false,
  }),
  fontSize: z.number().min(12).max(24).default(16),
  autoSave: z.boolean().default(true),
  twoFactorEnabled: z.boolean().default(false),
});

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export function validatePreferences(input: unknown): UserPreferences {
  return UserPreferencesSchema.parse(input);
}

export function sanitizePreferences(
  partialPrefs: Partial<UserPreferences>
): Partial<UserPreferences> {
  const result: Partial<UserPreferences> = {};
  
  if (partialPrefs.fontSize !== undefined) {
    result.fontSize = Math.min(24, Math.max(12, partialPrefs.fontSize));
  }
  
  if (partialPrefs.theme !== undefined && ThemeSchema.safeParse(partialPrefs.theme).success) {
    result.theme = partialPrefs.theme;
  }
  
  if (partialPrefs.language !== undefined && LanguageSchema.safeParse(partialPrefs.language).success) {
    result.language = partialPrefs.language;
  }
  
  return result;
}import { z } from 'zod';

export const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('light'),
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
        const errorMessages = error.errors.map(err => 
          `${err.path.join('.')}: ${err.message}`
        );
        throw new PreferencesValidationError(
          'Invalid user preferences',
          errorMessages
        );
      }
      throw error;
    }
  }

  static validatePartial(updates: Partial<UserPreferences>): Partial<UserPreferences> {
    const schema = UserPreferencesSchema.partial();
    return schema.parse(updates);
  }
}

export class PreferencesValidationError extends Error {
  constructor(
    message: string,
    public readonly details: string[]
  ) {
    super(message);
    this.name = 'PreferencesValidationError';
  }
}

export function mergePreferences(
  current: UserPreferences,
  updates: Partial<UserPreferences>
): UserPreferences {
  const validatedUpdates = PreferencesValidator.validatePartial(updates);
  return { ...current, ...validatedUpdates };
}typescript
interface UserPreferences {
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

function testValidation() {
    const testPreferences: UserPreferences[] = [
        { theme: 'light', notifications: true, language: 'en', fontSize: 16 },
        { theme: 'blue', notifications: 'yes', language: 'zh', fontSize: 8 },
        { theme: 'dark', notifications: false, language: 'fr', fontSize: 30 }
    ];

    testPreferences.forEach((prefs, index) => {
        console.log(`Test ${index + 1}:`);
        try {
            const errors = PreferenceValidator.validate(prefs);
            if (errors.length === 0) {
                console.log('  ✓ Valid preferences');
            } else {
                console.log('  ✗ Validation errors:', errors);
            }
            PreferenceValidator.validateAndThrow(prefs);
        } catch (error) {
            console.log('  ✗ Exception:', (error as Error).message);
        }
    });
}

export { UserPreferences, PreferenceValidator, testValidation };
```