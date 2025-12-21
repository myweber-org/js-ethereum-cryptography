
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  itemsPerPage: number;
}

class PreferenceValidator {
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de'];
  private static readonly MIN_ITEMS_PER_PAGE = 5;
  private static readonly MAX_ITEMS_PER_PAGE = 100;

  static validate(prefs: UserPreferences): string[] {
    const errors: string[] = [];

    if (!['light', 'dark', 'auto'].includes(prefs.theme)) {
      errors.push(`Invalid theme selection: ${prefs.theme}`);
    }

    if (typeof prefs.notifications !== 'boolean') {
      errors.push('Notifications must be a boolean value');
    }

    if (!PreferenceValidator.SUPPORTED_LANGUAGES.includes(prefs.language)) {
      errors.push(`Unsupported language: ${prefs.language}`);
    }

    if (prefs.itemsPerPage < PreferenceValidator.MIN_ITEMS_PER_PAGE) {
      errors.push(`Items per page cannot be less than ${PreferenceValidator.MIN_ITEMS_PER_PAGE}`);
    }

    if (prefs.itemsPerPage > PreferenceValidator.MAX_ITEMS_PER_PAGE) {
      errors.push(`Items per page cannot exceed ${PreferenceValidator.MAX_ITEMS_PER_PAGE}`);
    }

    return errors;
  }

  static validateAndThrow(prefs: UserPreferences): void {
    const errors = this.validate(prefs);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join('; ')}`);
    }
  }
}

export { UserPreferences, PreferenceValidator };import { z } from 'zod';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  itemsPerPage: number;
}

const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']),
  notifications: z.boolean(),
  language: z.string().min(2).max(5),
  itemsPerPage: z.number().int().min(5).max(100).default(20),
});

export const createDefaultPreferences = (): UserPreferences => ({
  theme: 'auto',
  notifications: true,
  language: 'en',
  itemsPerPage: 20,
});

export const validatePreferences = (
  input: unknown
): { success: boolean; data?: UserPreferences; error?: string } => {
  const result = UserPreferencesSchema.safeParse(input);
  
  if (!result.success) {
    return {
      success: false,
      error: result.error.errors.map(e => `${e.path}: ${e.message}`).join(', '),
    };
  }
  
  return {
    success: true,
    data: result.data,
  };
};

export const mergePreferences = (
  existing: UserPreferences,
  updates: Partial<UserPreferences>
): UserPreferences => {
  const merged = { ...existing, ...updates };
  const validation = validatePreferences(merged);
  
  if (!validation.success) {
    throw new Error(`Invalid preferences merge: ${validation.error}`);
  }
  
  return validation.data!;
};