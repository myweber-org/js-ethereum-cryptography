import { z } from 'zod';

const PreferenceSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('light'),
  notifications: z.boolean().default(true),
  language: z.string().min(2).default('en'),
  resultsPerPage: z.number().min(5).max(100).default(20),
  autoSave: z.boolean().default(false),
  lastUpdated: z.date().optional()
});

type UserPreferences = z.infer<typeof PreferenceSchema>;

const STORAGE_KEY = 'app_preferences_v1';

class UserPreferencesManager {
  private preferences: UserPreferences;

  constructor() {
    this.preferences = this.loadPreferences();
  }

  private loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return PreferenceSchema.parse({});
      
      const parsed = JSON.parse(stored);
      parsed.lastUpdated = parsed.lastUpdated ? new Date(parsed.lastUpdated) : undefined;
      return PreferenceSchema.parse(parsed);
    } catch (error) {
      console.warn('Failed to load preferences, using defaults:', error);
      return PreferenceSchema.parse({});
    }
  }

  private savePreferences(): void {
    try {
      const toStore = {
        ...this.preferences,
        lastUpdated: new Date()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): boolean {
    try {
      const merged = { ...this.preferences, ...updates };
      const validated = PreferenceSchema.parse(merged);
      this.preferences = validated;
      this.savePreferences();
      return true;
    } catch (error) {
      console.error('Invalid preferences update:', error);
      return false;
    }
  }

  resetToDefaults(): void {
    this.preferences = PreferenceSchema.parse({});
    this.savePreferences();
  }

  hasUnsavedChanges(current: Partial<UserPreferences>): boolean {
    const currentPrefs = { ...this.preferences };
    return Object.keys(current).some(key => {
      const k = key as keyof UserPreferences;
      return currentPrefs[k] !== current[k];
    });
  }
}

export const preferencesManager = new UserPreferencesManager();