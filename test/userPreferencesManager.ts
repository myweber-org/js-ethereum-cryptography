typescript
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  resultsPerPage: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en-US',
  resultsPerPage: 20
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
      throw new Error('Invalid preferences data');
    }

    const prefs = data as Record<string, unknown>;
    
    return {
      theme: this.validateTheme(prefs.theme),
      notifications: this.validateBoolean(prefs.notifications),
      language: this.validateLanguage(prefs.language),
      resultsPerPage: this.validateResultsPerPage(prefs.resultsPerPage)
    };
  }

  private validateTheme(theme: unknown): UserPreferences['theme'] {
    if (theme === 'light' || theme === 'dark' || theme === 'auto') {
      return theme;
    }
    return DEFAULT_PREFERENCES.theme;
  }

  private validateBoolean(value: unknown): boolean {
    return typeof value === 'boolean' ? value : DEFAULT_PREFERENCES.notifications;
  }

  private validateLanguage(lang: unknown): string {
    if (typeof lang === 'string' && lang.length >= 2) {
      return lang;
    }
    return DEFAULT_PREFERENCES.language;
  }

  private validateResultsPerPage(count: unknown): number {
    const num = Number(count);
    if (!isNaN(num) && num >= 10 && num <= 100) {
      return Math.floor(num);
    }
    return DEFAULT_PREFERENCES.resultsPerPage;
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    const validatedUpdates: Partial<UserPreferences> = {};

    if (updates.theme !== undefined) {
      validatedUpdates.theme = this.validateTheme(updates.theme);
    }
    
    if (updates.notifications !== undefined) {
      validatedUpdates.notifications = this.validateBoolean(updates.notifications);
    }
    
    if (updates.language !== undefined) {
      validatedUpdates.language = this.validateLanguage(updates.language);
    }
    
    if (updates.resultsPerPage !== undefined) {
      validatedUpdates.resultsPerPage = this.validateResultsPerPage(updates.resultsPerPage);
    }

    this.preferences = { ...this.preferences, ...validatedUpdates };
    this.savePreferences();
  }

  resetToDefaults(): void {
    this.preferences = { ...DEFAULT_PREFERENCES };
    this.savePreferences();
  }

  private savePreferences(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.preferences));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }

  exportPreferences(): string {
    return JSON.stringify(this.preferences, null, 2);
  }

  importPreferences(json: string): boolean {
    try {
      const parsed = JSON.parse(json);
      const validated = this.validatePreferences(parsed);
      this.preferences = validated;
      this.savePreferences();
      return true;
    } catch (error) {
      console.error('Failed to import preferences:', error);
      return false;
    }
  }
}

export const preferencesManager = new UserPreferencesManager();
```