interface UserPreferences {
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
        return this.validatePreferences(JSON.parse(stored));
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

  private validatePreferences(data: any): UserPreferences {
    const validThemes = ['light', 'dark', 'auto'];
    const theme = validThemes.includes(data.theme) ? data.theme : 'auto';
    const notifications = typeof data.notifications === 'boolean' ? data.notifications : true;
    const language = typeof data.language === 'string' ? data.language.substring(0, 10) : 'en';
    const fontSize = typeof data.fontSize === 'number' && data.fontSize >= 8 && data.fontSize <= 32 
      ? data.fontSize 
      : 14;

    return { theme, notifications, language, fontSize };
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    this.preferences = {
      ...this.preferences,
      ...this.validatePreferences(updates)
    };
    this.savePreferences();
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

  isDarkMode(): boolean {
    if (this.preferences.theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return this.preferences.theme === 'dark';
  }
}

export { UserPreferencesManager, type UserPreferences };interface UserPreferences {
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

  updatePreferences(updates: Partial<UserPreferences>): void {
    const oldPreferences = { ...this.preferences };
    
    this.preferences = {
      ...this.preferences,
      ...updates
    };

    this.validatePreferences();
    this.savePreferences();
    this.notifyChanges(oldPreferences);
  }

  private validatePreferences(): void {
    if (this.preferences.fontSize < 12 || this.preferences.fontSize > 24) {
      throw new Error('Font size must be between 12 and 24');
    }

    const validLanguages = ['en', 'es', 'fr', 'de'];
    if (!validLanguages.includes(this.preferences.language)) {
      throw new Error('Invalid language selection');
    }
  }

  private savePreferences(): void {
    localStorage.setItem(
      UserPreferencesManager.STORAGE_KEY,
      JSON.stringify(this.preferences)
    );
  }

  private notifyChanges(oldPreferences: UserPreferences): void {
    const changes: string[] = [];

    if (oldPreferences.theme !== this.preferences.theme) {
      changes.push(`Theme changed from ${oldPreferences.theme} to ${this.preferences.theme}`);
    }

    if (oldPreferences.language !== this.preferences.language) {
      changes.push(`Language changed from ${oldPreferences.language} to ${this.preferences.language}`);
    }

    if (changes.length > 0) {
      console.log('Preferences updated:', changes.join(', '));
    }
  }

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  resetToDefaults(defaults: UserPreferences): void {
    this.preferences = { ...defaults };
    this.savePreferences();
  }
}

const defaultUserPreferences: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en',
  fontSize: 16
};

export { UserPreferencesManager, defaultUserPreferences };
export type { UserPreferences };import { z } from 'zod';

const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.boolean().default(true),
  language: z.string().min(2).default('en'),
  resultsPerPage: z.number().min(5).max(100).default(20),
  timezone: z.string().optional()
});

type UserPreferences = z.infer<typeof UserPreferencesSchema>;

const STORAGE_KEY = 'app_user_preferences';

export class UserPreferencesManager {
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
      console.warn('Failed to load preferences, using defaults:', error);
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

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    try {
      const validated = UserPreferencesSchema.partial().parse(updates);
      this.preferences = { ...this.preferences, ...validated };
      this.savePreferences();
    } catch (error) {
      throw new Error(`Invalid preferences update: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  resetToDefaults(): void {
    this.preferences = UserPreferencesSchema.parse({});
    this.savePreferences();
  }

  exportPreferences(): string {
    return JSON.stringify(this.preferences, null, 2);
  }

  importPreferences(jsonString: string): void {
    try {
      const parsed = JSON.parse(jsonString);
      this.preferences = UserPreferencesSchema.parse(parsed);
      this.savePreferences();
    } catch (error) {
      throw new Error(`Invalid preferences import: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}