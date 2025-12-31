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

function validateAndApplyPreferences(prefs: UserPreferences): void {
  const validationErrors = PreferenceValidator.validate(prefs);
  
  if (validationErrors.length > 0) {
    console.error('Invalid preferences:');
    validationErrors.forEach(error => console.error(`  - ${error}`));
    throw new Error('Preferences validation failed');
  }

  console.log('Preferences applied successfully:', prefs);
}

export { UserPreferences, PreferenceValidator, validateAndApplyPreferences };import { z } from 'zod';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    email: boolean;
    push: boolean;
    frequency: 'instant' | 'daily' | 'weekly';
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends';
    dataSharing: boolean;
  };
}

const userPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']),
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
    frequency: z.enum(['instant', 'daily', 'weekly']),
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'private', 'friends']),
    dataSharing: z.boolean(),
  }),
});

export class PreferencesValidator {
  static validate(input: unknown): UserPreferences {
    try {
      return userPreferencesSchema.parse(input) as UserPreferences;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Invalid preferences: ${error.errors.map(e => `${e.path}: ${e.message}`).join(', ')}`);
      }
      throw new Error('Unexpected validation error');
    }
  }

  static validatePartial(updates: Partial<unknown>): Partial<UserPreferences> {
    try {
      return userPreferencesSchema.partial().parse(updates) as Partial<UserPreferences>;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Invalid preference updates: ${error.errors.map(e => `${e.path}: ${e.message}`).join(', ')}`);
      }
      throw new Error('Unexpected validation error');
    }
  }

  static getDefaultPreferences(): UserPreferences {
    return {
      theme: 'auto',
      notifications: {
        email: true,
        push: false,
        frequency: 'daily',
      },
      privacy: {
        profileVisibility: 'private',
        dataSharing: false,
      },
    };
  }
}

export function sanitizePreferences(prefs: UserPreferences): UserPreferences {
  return {
    ...prefs,
    privacy: {
      ...prefs.privacy,
      dataSharing: prefs.privacy.profileVisibility === 'public' ? prefs.privacy.dataSharing : false,
    },
  };
}