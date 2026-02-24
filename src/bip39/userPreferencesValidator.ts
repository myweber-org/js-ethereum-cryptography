interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
  autoSave: boolean;
}

class UserPreferencesValidator {
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja'];
  private static readonly MIN_FONT_SIZE = 8;
  private static readonly MAX_FONT_SIZE = 72;

  static validate(preferences: Partial<UserPreferences>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (preferences.theme !== undefined && !['light', 'dark', 'auto'].includes(preferences.theme)) {
      errors.push(`Invalid theme: ${preferences.theme}. Must be 'light', 'dark', or 'auto'.`);
    }

    if (preferences.language !== undefined && !this.SUPPORTED_LANGUAGES.includes(preferences.language)) {
      errors.push(`Unsupported language: ${preferences.language}. Supported languages: ${this.SUPPORTED_LANGUAGES.join(', ')}`);
    }

    if (preferences.fontSize !== undefined) {
      if (typeof preferences.fontSize !== 'number') {
        errors.push(`Font size must be a number, received: ${typeof preferences.fontSize}`);
      } else if (preferences.fontSize < this.MIN_FONT_SIZE || preferences.fontSize > this.MAX_FONT_SIZE) {
        errors.push(`Font size ${preferences.fontSize} is out of range. Must be between ${this.MIN_FONT_SIZE} and ${this.MAX_FONT_SIZE}.`);
      }
    }

    if (preferences.notifications !== undefined && typeof preferences.notifications !== 'boolean') {
      errors.push(`Notifications must be a boolean, received: ${typeof preferences.notifications}`);
    }

    if (preferences.autoSave !== undefined && typeof preferences.autoSave !== 'boolean') {
      errors.push(`Auto-save must be a boolean, received: ${typeof preferences.autoSave}`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  static createDefaultPreferences(): UserPreferences {
    return {
      theme: 'auto',
      notifications: true,
      language: 'en',
      fontSize: 14,
      autoSave: true
    };
  }

  static mergePreferences(current: UserPreferences, updates: Partial<UserPreferences>): UserPreferences {
    const validation = this.validate(updates);
    if (!validation.valid) {
      throw new Error(`Invalid preferences: ${validation.errors.join(' ')}`);
    }

    return { ...current, ...updates };
  }
}

export { UserPreferences, UserPreferencesValidator };import { z } from 'zod';

const UserPreferencesSchema = z.object({
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
        const defaultPreferences = UserPreferencesSchema.parse({});
        console.warn('Invalid preferences, using defaults:', error.errors);
        return defaultPreferences;
      }
      throw error;
    }
  }

  static mergeWithDefaults(partial: Partial<UserPreferences>): UserPreferences {
    const current = UserPreferencesSchema.parse({});
    const validatedPartial = UserPreferencesSchema.partial().parse(partial);
    return { ...current, ...validatedPartial };
  }

  static sanitizeForExport(prefs: UserPreferences): Record<string, unknown> {
    const { privacy, ...exportable } = prefs;
    return {
      ...exportable,
      privacy: {
        profileVisibility: privacy.profileVisibility
      }
    };
  }
}