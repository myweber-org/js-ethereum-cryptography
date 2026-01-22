interface UserPreferences {
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
    throw new PreferenceValidationError(`Validation failed: ${errors.join('; ')}`, 'preferences');
  }
  
  return prefs as UserPreferences;
}

function saveUserPreferences(prefs: Partial<UserPreferences>): void {
  try {
    const validated = validateUserPreferences(prefs);
    console.log('Preferences saved successfully:', validated);
  } catch (error) {
    if (error instanceof PreferenceValidationError) {
      console.error(`Failed to save preferences: ${error.message}`);
    } else {
      console.error('Unexpected error:', error);
    }
  }
}import { z } from 'zod';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  timezone: string;
}

const userPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']),
  notifications: z.boolean(),
  language: z.string().min(2).max(5),
  timezone: z.string().regex(/^[A-Za-z_]+\/[A-Za-z_]+$/)
});

export class PreferencesValidator {
  static validate(preferences: unknown): UserPreferences {
    try {
      return userPreferencesSchema.parse(preferences) as UserPreferences;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(err => 
          `${err.path.join('.')}: ${err.message}`
        );
        throw new Error(`Invalid preferences: ${errorMessages.join(', ')}`);
      }
      throw new Error('Unexpected validation error');
    }
  }

  static validatePartial(updates: Partial<unknown>): Partial<UserPreferences> {
    try {
      return userPreferencesSchema.partial().parse(updates) as Partial<UserPreferences>;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(err => 
          `${err.path.join('.')}: ${err.message}`
        );
        throw new Error(`Invalid preference updates: ${errorMessages.join(', ')}`);
      }
      throw new Error('Unexpected validation error');
    }
  }

  static getDefaultPreferences(): UserPreferences {
    return {
      theme: 'auto',
      notifications: true,
      language: 'en',
      timezone: 'UTC'
    };
  }
}
import { z } from 'zod';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  timezone: string;
}

export const userPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']),
  notifications: z.boolean(),
  language: z.string().min(2).max(5),
  timezone: z.string().regex(/^[A-Za-z_]+\/[A-Za-z_]+$/),
});

export class UserPreferencesValidator {
  static validate(preferences: unknown): UserPreferences {
    try {
      return userPreferencesSchema.parse(preferences);
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

  static validatePartial(updates: Partial<unknown>): Partial<UserPreferences> {
    try {
      return userPreferencesSchema.partial().parse(updates);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(err => 
          `${err.path.join('.')}: ${err.message}`
        );
        throw new Error(`Invalid preference updates: ${errorMessages.join(', ')}`);
      }
      throw error;
    }
  }

  static getDefaultPreferences(): UserPreferences {
    return {
      theme: 'auto',
      notifications: true,
      language: 'en',
      timezone: 'UTC',
    };
  }
}