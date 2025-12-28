import { z } from 'zod';

const PreferenceSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  fontSize: z.number().min(12).max(24).default(16),
  notifications: z.boolean().default(true),
  language: z.string().length(2).default('en'),
  lastUpdated: z.date().optional()
});

type UserPreferences = z.infer<typeof PreferenceSchema>;

class PreferencesManager {
  private static STORAGE_KEY = 'user_preferences_v1';
  private preferences: UserPreferences;

  constructor() {
    this.preferences = this.loadPreferences();
  }

  private loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(PreferencesManager.STORAGE_KEY);
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
    localStorage.setItem(PreferencesManager.STORAGE_KEY, JSON.stringify(data));
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    const validated = PreferenceSchema.partial().parse(updates);
    this.preferences = { ...this.preferences, ...validated };
    this.savePreferences();
  }

  resetToDefaults(): void {
    this.preferences = PreferenceSchema.parse({});
    localStorage.removeItem(PreferencesManager.STORAGE_KEY);
  }

  validateExternalData(data: unknown): UserPreferences {
    return PreferenceSchema.parse(data);
  }
}

export { PreferencesManager, type UserPreferences };