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
      typeof prefs.notifications === 'boolean' &&
      typeof prefs.language === 'string' &&
      prefs.language.length >= 2 &&
      prefs.fontSize >= 8 &&
      prefs.fontSize <= 32
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

export { UserPreferencesManager, type UserPreferences };typescript
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notificationsEnabled: boolean;
  fontSize: number;
  autoSave: boolean;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  language: 'en-US',
  notificationsEnabled: true,
  fontSize: 14,
  autoSave: true
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

    const result = { ...DEFAULT_PREFERENCES };

    if ('theme' in data && ['light', 'dark', 'auto'].includes(data.theme as string)) {
      result.theme = data.theme as UserPreferences['theme'];
    }

    if ('language' in data && typeof data.language === 'string') {
      result.language = data.language;
    }

    if ('notificationsEnabled' in data && typeof data.notificationsEnabled === 'boolean') {
      result.notificationsEnabled = data.notificationsEnabled;
    }

    if ('fontSize' in data && typeof data.fontSize === 'number' && data.fontSize >= 8 && data.fontSize <= 32) {
      result.fontSize = data.fontSize;
    }

    if ('autoSave' in data && typeof data.autoSave === 'boolean') {
      result.autoSave = data.autoSave;
    }

    return result;
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    const newPreferences = { ...this.preferences, ...updates };
    this.preferences = this.validatePreferences(newPreferences);
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

  getPreference<K extends keyof UserPreferences>(key: K): UserPreferences[K] {
    return this.preferences[key];
  }

  setPreference<K extends keyof UserPreferences>(key: K, value: UserPreferences[K]): void {
    this.updatePreferences({ [key]: value });
  }
}

export const preferencesManager = new UserPreferencesManager();
```interface UserPreferences {
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
      this.dispatchChangeEvent(oldPreferences, this.preferences);
    } catch (error) {
      console.error('Failed to save preferences:', error);
      this.preferences = oldPreferences;
      throw new Error('Preferences save failed');
    }
  }

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  resetToDefaults(): void {
    this.updatePreferences(this.getDefaultPreferences());
  }

  private dispatchChangeEvent(oldPrefs: UserPreferences, newPrefs: UserPreferences): void {
    const event = new CustomEvent('preferenceschanged', {
      detail: { old: oldPrefs, new: newPrefs }
    });
    window.dispatchEvent(event);
  }

  validatePreferences(prefs: Partial<UserPreferences>): boolean {
    if (prefs.theme && !['light', 'dark', 'auto'].includes(prefs.theme)) {
      return false;
    }
    
    if (prefs.fontSize && (prefs.fontSize < 8 || prefs.fontSize > 72)) {
      return false;
    }
    
    if (prefs.language && typeof prefs.language !== 'string') {
      return false;
    }
    
    return true;
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

export { UserPreferencesManager, type UserPreferences };interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en',
  fontSize: 14
};

const VALID_LANGUAGES = ['en', 'es', 'fr', 'de'];
const MIN_FONT_SIZE = 8;
const MAX_FONT_SIZE = 32;

class UserPreferencesManager {
  private preferences: UserPreferences;

  constructor(initialPreferences?: Partial<UserPreferences>) {
    this.preferences = { ...DEFAULT_PREFERENCES, ...initialPreferences };
    this.validateAndNormalize();
  }

  private validateAndNormalize(): void {
    if (!['light', 'dark', 'auto'].includes(this.preferences.theme)) {
      this.preferences.theme = DEFAULT_PREFERENCES.theme;
    }

    if (!VALID_LANGUAGES.includes(this.preferences.language)) {
      this.preferences.language = DEFAULT_PREFERENCES.language;
    }

    if (typeof this.preferences.notifications !== 'boolean') {
      this.preferences.notifications = DEFAULT_PREFERENCES.notifications;
    }

    if (typeof this.preferences.fontSize !== 'number' || 
        this.preferences.fontSize < MIN_FONT_SIZE || 
        this.preferences.fontSize > MAX_FONT_SIZE) {
      this.preferences.fontSize = DEFAULT_PREFERENCES.fontSize;
    }
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    this.preferences = { ...this.preferences, ...updates };
    this.validateAndNormalize();
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  resetToDefaults(): void {
    this.preferences = { ...DEFAULT_PREFERENCES };
  }

  isDarkModeEnabled(): boolean {
    if (this.preferences.theme === 'dark') return true;
    if (this.preferences.theme === 'light') return false;
    
    const currentHour = new Date().getHours();
    return currentHour >= 18 || currentHour < 6;
  }
}

export { UserPreferencesManager, DEFAULT_PREFERENCES };
export type { UserPreferences };interface UserPreferences {
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
    const fontSize = typeof data.fontSize === 'number' && data.fontSize >= 8 && data.fontSize <= 32 ? data.fontSize : 14;

    return { theme, notifications, language, fontSize };
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    this.preferences = this.validatePreferences({ ...this.preferences, ...updates });
    this.savePreferences();
  }

  private savePreferences(): void {
    localStorage.setItem(UserPreferencesManager.STORAGE_KEY, JSON.stringify(this.preferences));
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
interface UserPreferences {
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
    const result = { ...DEFAULT_PREFERENCES };

    if (data && typeof data === 'object') {
      const obj = data as Record<string, unknown>;

      if (['light', 'dark', 'auto'].includes(obj.theme as string)) {
        result.theme = obj.theme as UserPreferences['theme'];
      }

      if (typeof obj.notifications === 'boolean') {
        result.notifications = obj.notifications;
      }

      if (typeof obj.language === 'string' && obj.language.length >= 2) {
        result.language = obj.language;
      }

      if (typeof obj.fontSize === 'number' && obj.fontSize >= 8 && obj.fontSize <= 32) {
        result.fontSize = obj.fontSize;
      }
    }

    return result;
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): boolean {
    const newPreferences = {
      ...this.preferences,
      ...updates
    };

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

  getTheme(): UserPreferences['theme'] {
    return this.preferences.theme;
  }

  getEffectiveTheme(): 'light' | 'dark' {
    if (this.preferences.theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return this.preferences.theme;
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
      notifications: true,
      language: 'en',
      fontSize: 14
    };
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    const previous = { ...this.preferences };
    this.preferences = { ...this.preferences, ...updates };
    
    if (!this.validatePreferences(this.preferences)) {
      this.preferences = previous;
      throw new Error('Invalid preferences provided');
    }

    this.savePreferences();
  }

  private validatePreferences(prefs: UserPreferences): boolean {
    const validThemes = ['light', 'dark', 'auto'];
    const minFontSize = 8;
    const maxFontSize = 32;

    return (
      validThemes.includes(prefs.theme) &&
      typeof prefs.notifications === 'boolean' &&
      typeof prefs.language === 'string' &&
      prefs.language.length >= 2 &&
      prefs.fontSize >= minFontSize &&
      prefs.fontSize <= maxFontSize
    );
  }

  private savePreferences(): void {
    try {
      localStorage.setItem(
        UserPreferencesManager.STORAGE_KEY,
        JSON.stringify(this.preferences)
      );
    } catch (error) {
      console.error('Failed to save preferences:', error);
      throw new Error('Unable to persist preferences');
    }
  }

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  resetToDefaults(): void {
    this.preferences = this.getDefaultPreferences();
    this.savePreferences();
  }

  exportPreferences(): string {
    return JSON.stringify(this.preferences, null, 2);
  }

  importPreferences(jsonString: string): void {
    try {
      const imported = JSON.parse(jsonString);
      this.updatePreferences(imported);
    } catch (error) {
      throw new Error('Invalid preferences format');
    }
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
    const language = typeof data.language === 'string' && data.language.length === 2 ? data.language : 'en';
    const fontSize = typeof data.fontSize === 'number' && data.fontSize >= 10 && data.fontSize <= 24 ? data.fontSize : 14;

    return { theme, notifications, language, fontSize };
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    this.preferences = { ...this.preferences, ...updates };
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

export { UserPreferencesManager, type UserPreferences };