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
  private static readonly STORAGE_KEY = 'user_preferences';
  private preferences: UserPreferences;

  constructor() {
    this.preferences = this.loadPreferences();
  }

  private loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(PreferencesManager.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return PreferenceSchema.parse({
          ...parsed,
          lastUpdated: parsed.lastUpdated ? new Date(parsed.lastUpdated) : undefined
        });
      }
    } catch (error) {
      console.warn('Failed to load preferences, using defaults:', error);
    }
    return PreferenceSchema.parse({});
  }

  updatePreferences(updates: Partial<UserPreferences>): UserPreferences {
    const current = this.preferences;
    const merged = { ...current, ...updates, lastUpdated: new Date() };
    
    const validated = PreferenceSchema.parse(merged);
    this.preferences = validated;
    
    localStorage.setItem(
      PreferencesManager.STORAGE_KEY,
      JSON.stringify(validated)
    );
    
    return validated;
  }

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  resetToDefaults(): UserPreferences {
    this.preferences = PreferenceSchema.parse({});
    localStorage.removeItem(PreferencesManager.STORAGE_KEY);
    return this.preferences;
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

export { PreferencesManager, type UserPreferences };