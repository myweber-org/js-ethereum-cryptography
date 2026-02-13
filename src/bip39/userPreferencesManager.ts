interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
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

  private savePreferences(): void {
    localStorage.setItem(
      UserPreferencesManager.STORAGE_KEY,
      JSON.stringify(this.preferences)
    );
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    this.validatePreferences(updates);
    this.preferences = { ...this.preferences, ...updates };
    this.savePreferences();
  }

  private validatePreferences(prefs: Partial<UserPreferences>): void {
    if (prefs.theme && !['light', 'dark', 'auto'].includes(prefs.theme)) {
      throw new Error('Invalid theme value');
    }
    
    if (prefs.fontSize && (prefs.fontSize < 12 || prefs.fontSize > 24)) {
      throw new Error('Font size must be between 12 and 24');
    }
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  resetToDefaults(defaults: UserPreferences): void {
    this.preferences = defaults;
    this.savePreferences();
  }
}

const defaultPreferences: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en-US',
  fontSize: 16
};

export const preferencesManager = new UserPreferencesManager(defaultPreferences);import { z } from 'zod';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
  autoSave: boolean;
}

const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']),
  notifications: z.boolean(),
  language: z.string().min(2),
  fontSize: z.number().min(8).max(72),
  autoSave: z.boolean()
});

export class PreferencesManager {
  private static readonly STORAGE_KEY = 'user_preferences';
  private preferences: UserPreferences;

  constructor(defaultPreferences: UserPreferences) {
    this.preferences = this.loadPreferences() || defaultPreferences;
  }

  private loadPreferences(): UserPreferences | null {
    try {
      const stored = localStorage.getItem(PreferencesManager.STORAGE_KEY);
      if (!stored) return null;

      const parsed = JSON.parse(stored);
      const validated = UserPreferencesSchema.parse(parsed);
      return validated;
    } catch (error) {
      console.warn('Failed to load preferences:', error);
      return null;
    }
  }

  private savePreferences(): void {
    try {
      const validated = UserPreferencesSchema.parse(this.preferences);
      localStorage.setItem(
        PreferencesManager.STORAGE_KEY,
        JSON.stringify(validated)
      );
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    this.preferences = { ...this.preferences, ...updates };
    this.savePreferences();
  }

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  resetToDefaults(defaults: UserPreferences): void {
    this.preferences = defaults;
    this.savePreferences();
  }

  validatePreferences(prefs: unknown): boolean {
    try {
      UserPreferencesSchema.parse(prefs);
      return true;
    } catch {
      return false;
    }
  }
}

export const defaultPreferences: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en',
  fontSize: 16,
  autoSave: true
};