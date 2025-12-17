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

class PreferencesManager {
  private static STORAGE_KEY = 'user_preferences_v2';
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
      localStorage.setItem(PreferencesManager.STORAGE_KEY, JSON.stringify(toStore));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }

  get<K extends keyof UserPreferences>(key: K): UserPreferences[K] {
    return this.preferences[key];
  }

  set<K extends keyof UserPreferences>(key: K, value: UserPreferences[K]): void {
    const update = { [key]: value };
    const validated = PreferenceSchema.partial().parse(update);
    this.preferences = { ...this.preferences, ...validated };
    this.savePreferences();
  }

  reset(): void {
    this.preferences = PreferenceSchema.parse({});
    this.savePreferences();
  }

  getAll(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  validateExternal(data: unknown): UserPreferences {
    return PreferenceSchema.parse(data);
  }
}

export const preferencesManager = new PreferencesManager();