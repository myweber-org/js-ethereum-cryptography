import { z } from 'zod';

const PreferenceSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.boolean().default(true),
  language: z.string().min(2).default('en'),
  resultsPerPage: z.number().min(5).max(100).default(20),
  autoSave: z.boolean().default(false),
  lastUpdated: z.date().optional()
});

type UserPreferences = z.infer<typeof PreferenceSchema>;

const STORAGE_KEY = 'app_preferences_v1';

class PreferencesManager {
  private preferences: UserPreferences;

  constructor() {
    this.preferences = this.loadPreferences();
  }

  private loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const result = PreferenceSchema.safeParse({
          ...parsed,
          lastUpdated: parsed.lastUpdated ? new Date(parsed.lastUpdated) : undefined
        });
        return result.success ? result.data : PreferenceSchema.parse({});
      }
    } catch (error) {
      console.warn('Failed to load preferences:', error);
    }
    return PreferenceSchema.parse({});
  }

  updatePreferences(updates: Partial<UserPreferences>): UserPreferences {
    const validated = PreferenceSchema.partial().parse(updates);
    this.preferences = {
      ...this.preferences,
      ...validated,
      lastUpdated: new Date()
    };
    this.savePreferences();
    return this.preferences;
  }

  private savePreferences(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.preferences));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  resetToDefaults(): UserPreferences {
    this.preferences = PreferenceSchema.parse({});
    this.savePreferences();
    return this.preferences;
  }

  exportPreferences(): string {
    return JSON.stringify(this.preferences, null, 2);
  }

  importPreferences(json: string): boolean {
    try {
      const parsed = JSON.parse(json);
      const result = PreferenceSchema.safeParse(parsed);
      if (result.success) {
        this.preferences = result.data;
        this.savePreferences();
        return true;
      }
    } catch (error) {
      console.error('Invalid preferences format:', error);
    }
    return false;
  }
}

export const preferencesManager = new PreferencesManager();