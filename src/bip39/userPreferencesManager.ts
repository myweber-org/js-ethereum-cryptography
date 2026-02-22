import { z } from 'zod';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  timezone: string;
}

const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']),
  notifications: z.boolean(),
  language: z.string().min(2),
  timezone: z.string(),
});

export class PreferencesManager {
  private static STORAGE_KEY = 'user_preferences';
  private preferences: UserPreferences;

  constructor(defaults: Partial<UserPreferences> = {}) {
    this.preferences = this.loadPreferences(defaults);
  }

  private loadPreferences(defaults: Partial<UserPreferences>): UserPreferences {
    try {
      const stored = localStorage.getItem(PreferencesManager.STORAGE_KEY);
      if (!stored) return this.getDefaultPreferences(defaults);

      const parsed = JSON.parse(stored);
      const validated = UserPreferencesSchema.parse(parsed);
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
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      ...overrides,
    };
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    const newPreferences = { ...this.preferences, ...updates };
    const validated = UserPreferencesSchema.parse(newPreferences);
    
    this.preferences = validated;
    localStorage.setItem(PreferencesManager.STORAGE_KEY, JSON.stringify(validated));
  }

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  resetToDefaults(): void {
    this.preferences = this.getDefaultPreferences({});
    localStorage.removeItem(PreferencesManager.STORAGE_KEY);
  }

  isValidPreference(key: keyof UserPreferences, value: unknown): boolean {
    try {
      const testObj = { ...this.preferences, [key]: value };
      UserPreferencesSchema.parse(testObj);
      return true;
    } catch {
      return false;
    }
  }
}

export function createPreferencesManager(defaults?: Partial<UserPreferences>): PreferencesManager {
  return new PreferencesManager(defaults);
}interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class UserPreferencesManager {
  private static readonly STORAGE_KEY = 'user_preferences';
  private preferences: UserPreferences;

  constructor() {
    this.preferences = this.loadPreferences();
  }

  private loadPreferences(): UserPreferences {
    const stored = localStorage.getItem(UserPreferencesManager.STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return this.getDefaultPreferences();
      }
    }
    return this.getDefaultPreferences();
  }

  private getDefaultPreferences(): UserPreferences {
    return {
      theme: 'auto',
      notifications: true,
      language: 'en',
      fontSize: 14
    };
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    this.preferences = { ...this.preferences, ...updates };
    this.validatePreferences();
    this.savePreferences();
  }

  private validatePreferences(): void {
    if (!['light', 'dark', 'auto'].includes(this.preferences.theme)) {
      this.preferences.theme = 'auto';
    }
    if (typeof this.preferences.notifications !== 'boolean') {
      this.preferences.notifications = true;
    }
    if (typeof this.preferences.fontSize !== 'number' || this.preferences.fontSize < 8 || this.preferences.fontSize > 32) {
      this.preferences.fontSize = 14;
    }
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

  resetToDefaults(): void {
    this.preferences = this.getDefaultPreferences();
    this.savePreferences();
  }
}

export { UserPreferencesManager, type UserPreferences };