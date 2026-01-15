interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notificationsEnabled: boolean;
  fontSize: number;
}

class UserPreferencesManager {
  private static readonly STORAGE_KEY = 'user_preferences';
  private preferences: UserPreferences;

  constructor(defaultPreferences?: Partial<UserPreferences>) {
    this.preferences = this.loadPreferences();
    if (defaultPreferences) {
      this.preferences = { ...this.preferences, ...defaultPreferences };
    }
  }

  private loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(UserPreferencesManager.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load preferences from storage:', error);
    }
    
    return this.getDefaultPreferences();
  }

  private getDefaultPreferences(): UserPreferences {
    return {
      theme: 'auto',
      language: 'en-US',
      notificationsEnabled: true,
      fontSize: 16
    };
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    const oldPreferences = { ...this.preferences };
    this.preferences = { ...this.preferences, ...updates };
    
    try {
      localStorage.setItem(
        UserPreferencesManager.STORAGE_KEY, 
        JSON.stringify(this.preferences)
      );
      this.notifyPreferencesChange(oldPreferences, this.preferences);
    } catch (error) {
      console.error('Failed to save preferences:', error);
      throw new Error('Preferences save failed');
    }
  }

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  resetToDefaults(): void {
    this.updatePreferences(this.getDefaultPreferences());
  }

  validatePreferences(prefs: Partial<UserPreferences>): boolean {
    if (prefs.theme && !['light', 'dark', 'auto'].includes(prefs.theme)) {
      return false;
    }
    
    if (prefs.fontSize !== undefined && (prefs.fontSize < 8 || prefs.fontSize > 72)) {
      return false;
    }
    
    if (prefs.language && typeof prefs.language !== 'string') {
      return false;
    }
    
    return true;
  }

  private notifyPreferencesChange(
    oldPrefs: UserPreferences, 
    newPrefs: UserPreferences
  ): void {
    const event = new CustomEvent('preferenceschanged', {
      detail: { old: oldPrefs, new: newPrefs }
    });
    window.dispatchEvent(event);
  }

  static isStorageAvailable(): boolean {
    try {
      const testKey = '__preferences_test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }
}

export { UserPreferencesManager, type UserPreferences };interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notificationsEnabled: boolean;
  fontSize: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  language: 'en-US',
  notificationsEnabled: true,
  fontSize: 14
};

class UserPreferencesManager {
  private preferences: UserPreferences;
  private readonly storageKey = 'user_preferences';

  constructor() {
    this.preferences = this.loadPreferences();
  }

  private loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(this.storageKey);
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

    const preferences = data as Partial<UserPreferences>;
    
    return {
      theme: this.isValidTheme(preferences.theme) ? preferences.theme : DEFAULT_PREFERENCES.theme,
      language: typeof preferences.language === 'string' ? preferences.language : DEFAULT_PREFERENCES.language,
      notificationsEnabled: typeof preferences.notificationsEnabled === 'boolean' 
        ? preferences.notificationsEnabled 
        : DEFAULT_PREFERENCES.notificationsEnabled,
      fontSize: typeof preferences.fontSize === 'number' 
        ? Math.max(10, Math.min(24, preferences.fontSize))
        : DEFAULT_PREFERENCES.fontSize
    };
  }

  private isValidTheme(theme: unknown): theme is UserPreferences['theme'] {
    return theme === 'light' || theme === 'dark' || theme === 'auto';
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    this.preferences = {
      ...this.preferences,
      ...updates
    };
    
    if (updates.fontSize !== undefined) {
      this.preferences.fontSize = Math.max(10, Math.min(24, updates.fontSize));
    }

    this.savePreferences();
  }

  resetToDefaults(): void {
    this.preferences = { ...DEFAULT_PREFERENCES };
    this.savePreferences();
  }

  private savePreferences(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.preferences));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }

  isDarkMode(): boolean {
    if (this.preferences.theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return this.preferences.theme === 'dark';
  }
}

export const preferencesManager = new UserPreferencesManager();import { z } from 'zod';

const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.boolean().default(true),
  language: z.string().min(2).default('en'),
  resultsPerPage: z.number().min(5).max(100).default(20),
});

type UserPreferences = z.infer<typeof UserPreferencesSchema>;

const STORAGE_KEY = 'user_preferences_v1';

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
      console.warn('Failed to load preferences, using defaults:', error);
    }
    return UserPreferencesSchema.parse({});
  }

  private savePreferences(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.preferences));
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    try {
      const validated = UserPreferencesSchema.partial().parse(updates);
      this.preferences = { ...this.preferences, ...validated };
      this.savePreferences();
    } catch (error) {
      throw new Error(`Invalid preferences update: ${error}`);
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
      throw new Error(`Invalid preferences import: ${error}`);
    }
  }
}

export const userPreferences = new UserPreferencesManager();interface UserPreferences {
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
    const validated = this.validateUpdates(updates);
    this.preferences = { ...this.preferences, ...validated };
    this.savePreferences();
  }

  private validateUpdates(updates: Partial<UserPreferences>): Partial<UserPreferences> {
    const validated: Partial<UserPreferences> = {};

    if (updates.theme && ['light', 'dark', 'auto'].includes(updates.theme)) {
      validated.theme = updates.theme;
    }

    if (typeof updates.notifications === 'boolean') {
      validated.notifications = updates.notifications;
    }

    if (updates.language && /^[a-z]{2}(-[A-Z]{2})?$/.test(updates.language)) {
      validated.language = updates.language;
    }

    if (updates.fontSize && updates.fontSize >= 12 && updates.fontSize <= 24) {
      validated.fontSize = updates.fontSize;
    }

    return validated;
  }

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  resetToDefaults(defaults: UserPreferences): void {
    this.preferences = { ...defaults };
    this.savePreferences();
  }
}

export { UserPreferencesManager, type UserPreferences };interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en-US',
  fontSize: 14
};

class UserPreferencesManager {
  private preferences: UserPreferences;
  private readonly storageKey = 'user_preferences';

  constructor() {
    this.preferences = this.loadPreferences();
  }

  private loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(this.storageKey);
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
    const prefs = { ...DEFAULT_PREFERENCES };
    
    if (data && typeof data === 'object') {
      const obj = data as Record<string, unknown>;
      
      if (obj.theme === 'light' || obj.theme === 'dark' || obj.theme === 'auto') {
        prefs.theme = obj.theme;
      }
      
      if (typeof obj.notifications === 'boolean') {
        prefs.notifications = obj.notifications;
      }
      
      if (typeof obj.language === 'string' && obj.language.length > 0) {
        prefs.language = obj.language;
      }
      
      if (typeof obj.fontSize === 'number' && obj.fontSize >= 8 && obj.fontSize <= 32) {
        prefs.fontSize = obj.fontSize;
      }
    }
    
    return prefs;
  }

  savePreferences(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.preferences));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    this.preferences = {
      ...this.preferences,
      ...updates
    };
    this.savePreferences();
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

export const userPreferences = new UserPreferencesManager();