typescript
interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
    language: string;
    timezone: string;
}

class PreferencesValidator {
    private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja'];
    private static readonly VALID_TIMEZONES = /^[A-Za-z_]+\/[A-Za-z_]+$/;

    static validate(prefs: UserPreferences): string[] {
        const errors: string[] = [];

        if (!['light', 'dark', 'auto'].includes(prefs.theme)) {
            errors.push('Theme must be one of: light, dark, auto');
        }

        if (typeof prefs.notifications !== 'boolean') {
            errors.push('Notifications must be a boolean value');
        }

        if (!PreferencesValidator.SUPPORTED_LANGUAGES.includes(prefs.language)) {
            errors.push(`Language must be one of: ${PreferencesValidator.SUPPORTED_LANGUAGES.join(', ')}`);
        }

        if (!PreferencesValidator.VALID_TIMEZONES.test(prefs.timezone)) {
            errors.push('Timezone must be in format: Area/Location (e.g., America/New_York)');
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

export { UserPreferences, PreferencesValidator };
```typescript
interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
    language: string;
    fontSize: number;
}

class PreferenceValidator {
    private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja'];
    private static readonly MIN_FONT_SIZE = 8;
    private static readonly MAX_FONT_SIZE = 72;

    static validate(prefs: UserPreferences): string[] {
        const errors: string[] = [];

        if (!['light', 'dark', 'auto'].includes(prefs.theme)) {
            errors.push(`Invalid theme value: ${prefs.theme}. Must be 'light', 'dark', or 'auto'.`);
        }

        if (typeof prefs.notifications !== 'boolean') {
            errors.push('Notifications must be a boolean value.');
        }

        if (!PreferenceValidator.SUPPORTED_LANGUAGES.includes(prefs.language)) {
            errors.push(`Unsupported language: ${prefs.language}. Supported languages: ${PreferenceValidator.SUPPORTED_LANGUAGES.join(', ')}`);
        }

        if (prefs.fontSize < PreferenceValidator.MIN_FONT_SIZE || prefs.fontSize > PreferenceValidator.MAX_FONT_SIZE) {
            errors.push(`Font size ${prefs.fontSize} is out of range. Must be between ${PreferenceValidator.MIN_FONT_SIZE} and ${PreferenceValidator.MAX_FONT_SIZE}.`);
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
        console.log('Preferences validated successfully:', prefs);
    } catch (error) {
        console.error('Failed to process preferences:', error.message);
    }
}

const testPreferences: UserPreferences = {
    theme: 'dark',
    notifications: true,
    language: 'fr',
    fontSize: 14
};

processUserPreferences(testPreferences);
```import { z } from 'zod';

const PreferenceSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.boolean().default(true),
  language: z.string().min(2).max(5).default('en'),
  itemsPerPage: z.number().int().min(5).max(100).default(20),
  twoFactorEnabled: z.boolean().default(false),
  timezone: z.string().optional()
});

type UserPreferences = z.infer<typeof PreferenceSchema>;

export function validatePreferences(input: unknown): UserPreferences {
  try {
    return PreferenceSchema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => 
        `${err.path.join('.')}: ${err.message}`
      );
      throw new Error(`Invalid preferences: ${errorMessages.join(', ')}`);
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
  const merged = { ...existing, ...updates };
  return validatePreferences(merged);
}import { z } from 'zod';

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
  timezone: z.string().default('UTC'),
  twoFactorEnabled: z.boolean().default(false),
});

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export function validateUserPreferences(input: unknown): UserPreferences {
  return UserPreferencesSchema.parse(input);
}

export function sanitizeUserPreferences(
  preferences: Partial<UserPreferences>
): Partial<UserPreferences> {
  const result: Partial<UserPreferences> = {};
  
  if (preferences.theme !== undefined && ThemeSchema.safeParse(preferences.theme).success) {
    result.theme = preferences.theme;
  }
  
  if (preferences.notifications !== undefined) {
    const parsed = NotificationPreferenceSchema.safeParse(preferences.notifications);
    if (parsed.success) {
      result.notifications = parsed.data;
    }
  }
  
  if (preferences.language !== undefined) {
    const lang = preferences.language.trim();
    if (lang.length >= 2 && lang.length <= 5) {
      result.language = lang;
    }
  }
  
  if (preferences.timezone !== undefined && preferences.timezone.trim().length > 0) {
    result.timezone = preferences.timezone.trim();
  }
  
  if (preferences.twoFactorEnabled !== undefined && typeof preferences.twoFactorEnabled === 'boolean') {
    result.twoFactorEnabled = preferences.twoFactorEnabled;
  }
  
  return result;
}