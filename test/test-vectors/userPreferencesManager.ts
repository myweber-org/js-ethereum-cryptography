import { z } from 'zod';

const PreferenceSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('light'),
  notifications: z.boolean().default(true),
  language: z.string().min(2).default('en'),
  resultsPerPage: z.number().min(5).max(100).default(20),
});

type UserPreferences = z.infer<typeof PreferenceSchema>;

const STORAGE_KEY = 'user_preferences';

class PreferenceManager {
  private preferences: UserPreferences;

  constructor() {
    this.preferences = this.loadPreferences();
  }

  private loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return PreferenceSchema.parse(parsed);
      }
    } catch (error) {
      console.warn('Failed to load preferences, using defaults:', error);
    }
    return PreferenceSchema.parse({});
  }

  updatePreferences(updates: Partial<UserPreferences>): UserPreferences {
    const merged = { ...this.preferences, ...updates };
    const validated = PreferenceSchema.parse(merged);
    
    this.preferences = validated;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(validated));
    
    return validated;
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  resetToDefaults(): UserPreferences {
    this.preferences = PreferenceSchema.parse({});
    localStorage.removeItem(STORAGE_KEY);
    return this.preferences;
  }

  validateExternalData(data: unknown): UserPreferences {
    return PreferenceSchema.parse(data);
  }
}

export const preferenceManager = new PreferenceManager();