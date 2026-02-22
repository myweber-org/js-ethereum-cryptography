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
}