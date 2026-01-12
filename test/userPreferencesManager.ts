import { z } from 'zod';

const PreferenceSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.boolean().default(true),
  fontSize: z.number().min(12).max(24).default(16),
  language: z.string().min(2).default('en'),
  autoSave: z.boolean().default(true),
  lastUpdated: z.date().optional()
});

type UserPreferences = z.infer<typeof PreferenceSchema>;

const STORAGE_KEY = 'user_preferences_v1';

class UserPreferencesManager {
  private preferences: UserPreferences;

  constructor() {
    this.preferences = this.loadPreferences();
  }

  private loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return PreferenceSchema.parse({});

      const parsed = JSON.parse(stored);
      parsed.lastUpdated = parsed.lastUpdated ? new Date(parsed.lastUpdated) : undefined;
      
      return PreferenceSchema.parse(parsed);
    } catch {
      return PreferenceSchema.parse({});
    }
  }

  private savePreferences(): void {
    const dataToStore = {
      ...this.preferences,
      lastUpdated: new Date()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): UserPreferences {
    const validated = PreferenceSchema.partial().parse(updates);
    
    this.preferences = {
      ...this.preferences,
      ...validated
    };

    this.savePreferences();
    return this.getPreferences();
  }

  resetToDefaults(): UserPreferences {
    this.preferences = PreferenceSchema.parse({});
    this.savePreferences();
    return this.getPreferences();
  }

  exportPreferences(): string {
    return JSON.stringify(this.preferences, null, 2);
  }

  importPreferences(jsonString: string): boolean {
    try {
      const imported = JSON.parse(jsonString);
      const validated = PreferenceSchema.parse(imported);
      
      this.preferences = validated;
      this.savePreferences();
      return true;
    } catch {
      return false;
    }
  }
}

export { UserPreferencesManager, type UserPreferences };
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  fontSize: number;
  language: string;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  notifications: true,
  fontSize: 16,
  language: 'en-US'
};

const VALID_LANGUAGES = ['en-US', 'es-ES', 'fr-FR', 'de-DE'];

class UserPreferencesManager {
  private preferences: UserPreferences;

  constructor(initialPreferences?: Partial<UserPreferences>) {
    this.preferences = { ...DEFAULT_PREFERENCES, ...initialPreferences };
    this.validateAndFixPreferences();
  }

  private validateAndFixPreferences(): void {
    if (!['light', 'dark', 'auto'].includes(this.preferences.theme)) {
      this.preferences.theme = DEFAULT_PREFERENCES.theme;
    }

    if (typeof this.preferences.notifications !== 'boolean') {
      this.preferences.notifications = DEFAULT_PREFERENCES.notifications;
    }

    if (typeof this.preferences.fontSize !== 'number' || 
        this.preferences.fontSize < 8 || 
        this.preferences.fontSize > 32) {
      this.preferences.fontSize = DEFAULT_PREFERENCES.fontSize;
    }

    if (!VALID_LANGUAGES.includes(this.preferences.language)) {
      this.preferences.language = DEFAULT_PREFERENCES.language;
    }
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    this.preferences = { ...this.preferences, ...updates };
    this.validateAndFixPreferences();
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  resetToDefaults(): void {
    this.preferences = { ...DEFAULT_PREFERENCES };
  }

  exportAsJSON(): string {
    return JSON.stringify(this.preferences, null, 2);
  }

  static importFromJSON(jsonString: string): UserPreferencesManager {
    try {
      const parsed = JSON.parse(jsonString);
      return new UserPreferencesManager(parsed);
    } catch {
      return new UserPreferencesManager();
    }
  }
}

export { UserPreferencesManager, type UserPreferences };import { z } from 'zod';

const PreferenceSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.boolean().default(true),
  language: z.string().min(2).default('en'),
  fontSize: z.number().min(8).max(32).default(14),
});

type UserPreferences = z.infer<typeof PreferenceSchema>;

class PreferencesManager {
  private static readonly STORAGE_KEY = 'user_preferences';
  private preferences: UserPreferences;

  constructor() {
    this.preferences = this.loadPreferences();
  }

  private loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(PreferencesManager.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return PreferenceSchema.parse(parsed);
      }
    } catch (error) {
      console.warn('Failed to load preferences:', error);
    }
    return PreferenceSchema.parse({});
  }

  private savePreferences(): void {
    localStorage.setItem(
      PreferencesManager.STORAGE_KEY,
      JSON.stringify(this.preferences)
    );
  }

  updatePreferences(updates: Partial<UserPreferences>): UserPreferences {
    const validated = PreferenceSchema.partial().parse(updates);
    this.preferences = { ...this.preferences, ...validated };
    this.savePreferences();
    return this.preferences;
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  resetToDefaults(): UserPreferences {
    this.preferences = PreferenceSchema.parse({});
    this.savePreferences();
    return this.preferences;
  }

  validateExternalData(data: unknown): UserPreferences {
    return PreferenceSchema.parse(data);
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

export const preferencesManager = new UserPreferencesManager(defaultPreferences);interface UserPreferences {
  theme: 'light' | 'dark';
  fontSize: number;
  notificationsEnabled: boolean;
  language: string;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'light',
  fontSize: 14,
  notificationsEnabled: true,
  language: 'en'
};

class UserPreferencesManager {
  private readonly storageKey = 'user_preferences';

  getPreferences(): UserPreferences {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return { ...DEFAULT_PREFERENCES, ...parsed };
      } catch {
        return { ...DEFAULT_PREFERENCES };
      }
    }
    return { ...DEFAULT_PREFERENCES };
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    const current = this.getPreferences();
    const updated = { ...current, ...updates };
    localStorage.setItem(this.storageKey, JSON.stringify(updated));
  }

  resetToDefaults(): void {
    localStorage.removeItem(this.storageKey);
  }

  hasCustomPreferences(): boolean {
    return localStorage.getItem(this.storageKey) !== null;
  }
}

export const preferencesManager = new UserPreferencesManager();