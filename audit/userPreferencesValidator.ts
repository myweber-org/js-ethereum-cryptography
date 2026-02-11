import { z } from 'zod';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
  autoSave: boolean;
}

const preferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']),
  notifications: z.boolean(),
  language: z.string().min(2).max(5),
  fontSize: z.number().int().min(12).max(24),
  autoSave: z.boolean()
});

export class PreferencesValidator {
  static validate(input: unknown): UserPreferences {
    try {
      return preferencesSchema.parse(input) as UserPreferences;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(err => 
          `${err.path.join('.')}: ${err.message}`
        );
        throw new Error(`Validation failed:\n${errorMessages.join('\n')}`);
      }
      throw new Error('Invalid preferences data');
    }
  }

  static getDefaultPreferences(): UserPreferences {
    return {
      theme: 'auto',
      notifications: true,
      language: 'en',
      fontSize: 16,
      autoSave: true
    };
  }

  static mergePreferences(
    existing: Partial<UserPreferences>,
    updates: Partial<UserPreferences>
  ): UserPreferences {
    const merged = { ...this.getDefaultPreferences(), ...existing, ...updates };
    return this.validate(merged);
  }
}