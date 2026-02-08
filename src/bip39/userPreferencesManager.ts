import { z } from 'zod';

const PreferenceSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.boolean().default(true),
  fontSize: z.number().min(12).max(24).default(16),
  language: z.string().min(2).max(5).default('en'),
  autoSave: z.boolean().default(true),
  lastUpdated: z.date().optional()
});

type UserPreferences = z.infer<typeof PreferenceSchema>;

class PreferencesManager {
  private static STORAGE_KEY = 'app_preferences';
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

  getPreferences(): Readonly<UserPreferences> {
    return Object.freeze({ ...this.preferences });
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    const validated = PreferenceSchema.partial().parse(updates);
    this.preferences = { ...this.preferences, ...validated };
    this.savePreferences();
  }

  resetToDefaults(): void {
    this.preferences = PreferenceSchema.parse({});
    this.savePreferences();
  }

  exportPreferences(): string {
    return JSON.stringify(this.preferences, null, 2);
  }

  importPreferences(json: string): boolean {
    try {
      const data = JSON.parse(json);
      this.preferences = PreferenceSchema.parse(data);
      this.savePreferences();
      return true;
    } catch {
      return false;
    }
  }
}

export const preferencesManager = new PreferencesManager();interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notificationsEnabled: boolean;
  fontSize: number;
}

class UserPreferencesManager {
  private static readonly STORAGE_KEY = 'user_preferences';
  private preferences: UserPreferences;

  constructor(defaultPreferences: UserPreferences) {
    this.preferences = this.loadPreferences() || defaultPreferences;
  }

  private loadPreferences(): UserPreferences | null {
    try {
      const stored = localStorage.getItem(UserPreferencesManager.STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  updatePreferences(updates: Partial<UserPreferences>): boolean {
    const newPreferences = { ...this.preferences, ...updates };
    
    if (!this.validatePreferences(newPreferences)) {
      return false;
    }

    this.preferences = newPreferences;
    this.savePreferences();
    return true;
  }

  private validatePreferences(prefs: UserPreferences): boolean {
    return (
      ['light', 'dark', 'auto'].includes(prefs.theme) &&
      typeof prefs.language === 'string' &&
      prefs.language.length >= 2 &&
      typeof prefs.notificationsEnabled === 'boolean' &&
      prefs.fontSize >= 8 &&
      prefs.fontSize <= 72
    );
  }

  private savePreferences(): void {
    localStorage.setItem(
      UserPreferencesManager.STORAGE_KEY,
      JSON.stringify(this.preferences)
    );
  }

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  resetToDefaults(defaults: UserPreferences): void {
    this.preferences = defaults;
    this.savePreferences();
  }
}

const defaultPreferences: UserPreferences = {
  theme: 'auto',
  language: 'en',
  notificationsEnabled: true,
  fontSize: 16
};

export const preferencesManager = new UserPreferencesManager(defaultPreferences);