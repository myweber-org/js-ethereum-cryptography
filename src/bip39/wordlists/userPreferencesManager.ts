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

class PreferencesManager {
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
    } catch {
      return PreferenceSchema.parse({});
    }
  }

  private savePreferences(): void {
    const data = { ...this.preferences, lastUpdated: new Date() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): UserPreferences {
    const validated = PreferenceSchema.partial().parse(updates);
    this.preferences = { ...this.preferences, ...validated };
    this.savePreferences();
    return this.getPreferences();
  }

  resetToDefaults(): UserPreferences {
    this.preferences = PreferenceSchema.parse({});
    localStorage.removeItem(STORAGE_KEY);
    return this.getPreferences();
  }

  hasValidPreferences(): boolean {
    try {
      PreferenceSchema.parse(this.preferences);
      return true;
    } catch {
      return false;
    }
  }
}

export const preferencesManager = new PreferencesManager();