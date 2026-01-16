
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notificationsEnabled: boolean;
  fontSize: number;
  autoSaveInterval: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  language: 'en-US',
  notificationsEnabled: true,
  fontSize: 14,
  autoSaveInterval: 30000
};

const STORAGE_KEY = 'user_preferences';

class UserPreferencesManager {
  private preferences: UserPreferences;

  constructor() {
    this.preferences = this.loadPreferences();
  }

  private loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return this.validatePreferences(parsed);
      }
    } catch (error) {
      console.warn('Failed to load preferences from storage:', error);
    }
    return { ...DEFAULT_PREFERENCES };
  }

  private validatePreferences(data: unknown): UserPreferences {
    if (!data || typeof data !== 'object') {
      return { ...DEFAULT_PREFERENCES };
    }

    const validated: UserPreferences = { ...DEFAULT_PREFERENCES };

    if ('theme' in data && ['light', 'dark', 'auto'].includes(data.theme as string)) {
      validated.theme = data.theme as UserPreferences['theme'];
    }

    if ('language' in data && typeof data.language === 'string') {
      validated.language = data.language;
    }

    if ('notificationsEnabled' in data && typeof data.notificationsEnabled === 'boolean') {
      validated.notificationsEnabled = data.notificationsEnabled;
    }

    if ('fontSize' in data && typeof data.fontSize === 'number' && data.fontSize >= 8 && data.fontSize <= 32) {
      validated.fontSize = data.fontSize;
    }

    if ('autoSaveInterval' in data && typeof data.autoSaveInterval === 'number' && data.autoSaveInterval >= 1000) {
      validated.autoSaveInterval = data.autoSaveInterval;
    }

    return validated;
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): boolean {
    const newPreferences = { ...this.preferences, ...updates };
    const validated = this.validatePreferences(newPreferences);

    if (JSON.stringify(validated) !== JSON.stringify(this.preferences)) {
      this.preferences = validated;
      this.savePreferences();
      return true;
    }
    return false;
  }

  private savePreferences(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.preferences));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }

  resetToDefaults(): void {
    this.preferences = { ...DEFAULT_PREFERENCES };
    this.savePreferences();
  }

  isDarkMode(): boolean {
    if (this.preferences.theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return this.preferences.theme === 'dark';
  }
}

export const userPreferences = new UserPreferencesManager();import { z } from 'zod';

const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(['immediate', 'daily', 'weekly']).default('daily')
  }),
  language: z.string().min(2).default('en'),
  resultsPerPage: z.number().min(5).max(100).default(20),
  timezone: z.string().optional()
});

type UserPreferences = z.infer<typeof UserPreferencesSchema>;

const STORAGE_KEY = 'user_preferences';

class UserPreferencesManager {
  private preferences: UserPreferences;

  constructor() {
    this.preferences = this.loadPreferences();
  }

  private loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return UserPreferencesSchema.parse(parsed);
      }
    } catch (error) {
      console.warn('Failed to load preferences:', error);
    }
    return UserPreferencesSchema.parse({});
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

  updatePreferences(updates: Partial<UserPreferences>): UserPreferences {
    const validated = UserPreferencesSchema.partial().parse(updates);
    this.preferences = { ...this.preferences, ...validated };
    this.savePreferences();
    return this.getPreferences();
  }

  resetToDefaults(): UserPreferences {
    this.preferences = UserPreferencesSchema.parse({});
    this.savePreferences();
    return this.getPreferences();
  }

  validateExternalData(data: unknown): UserPreferences {
    return UserPreferencesSchema.parse(data);
  }
}

export const userPreferencesManager = new UserPreferencesManager();