import { z } from 'zod';

const PreferenceSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']),
  notifications: z.boolean(),
  language: z.string().min(2),
  fontSize: z.number().min(8).max(72),
  autoSave: z.boolean().default(true),
});

type UserPreferences = z.infer<typeof PreferenceSchema>;

const STORAGE_KEY = 'user_preferences_v1';

class PreferencesManager {
  private preferences: UserPreferences;

  constructor(defaults: Partial<UserPreferences> = {}) {
    this.preferences = this.loadPreferences(defaults);
  }

  private loadPreferences(defaults: Partial<UserPreferences>): UserPreferences {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return this.getDefaultPreferences(defaults);

      const parsed = JSON.parse(stored);
      const validated = PreferenceSchema.parse(parsed);
      return { ...this.getDefaultPreferences(defaults), ...validated };
    } catch {
      return this.getDefaultPreferences(defaults);
    }
  }

  private getDefaultPreferences(overrides: Partial<UserPreferences>): UserPreferences {
    return {
      theme: 'auto',
      notifications: true,
      language: 'en',
      fontSize: 14,
      autoSave: true,
      ...overrides,
    };
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    const merged = { ...this.preferences, ...updates };
    const validated = PreferenceSchema.parse(merged);
    
    this.preferences = validated;
    this.persistPreferences();
  }

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  resetToDefaults(): void {
    this.preferences = this.getDefaultPreferences({});
    this.persistPreferences();
  }

  private persistPreferences(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.preferences));
  }

  validateExternalData(data: unknown): UserPreferences | null {
    try {
      return PreferenceSchema.parse(data);
    } catch {
      return null;
    }
  }
}

export { PreferencesManager };
export type { UserPreferences };