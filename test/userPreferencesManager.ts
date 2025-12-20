typescript
interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
    language: string;
    fontSize: number;
}

class UserPreferencesManager {
    private static readonly STORAGE_KEY = 'user_preferences';
    private static readonly DEFAULT_PREFERENCES: UserPreferences = {
        theme: 'auto',
        notifications: true,
        language: 'en-US',
        fontSize: 16
    };

    private preferences: UserPreferences;

    constructor() {
        this.preferences = this.loadPreferences();
    }

    private loadPreferences(): UserPreferences {
        try {
            const stored = localStorage.getItem(UserPreferencesManager.STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                return this.validatePreferences(parsed);
            }
        } catch (error) {
            console.warn('Failed to load preferences:', error);
        }
        return { ...UserPreferencesManager.DEFAULT_PREFERENCES };
    }

    private validatePreferences(data: unknown): UserPreferences {
        const defaults = UserPreferencesManager.DEFAULT_PREFERENCES;
        
        if (!data || typeof data !== 'object') {
            return { ...defaults };
        }

        const prefs = data as Record<string, unknown>;
        
        return {
            theme: ['light', 'dark', 'auto'].includes(prefs.theme as string) 
                ? prefs.theme as UserPreferences['theme'] 
                : defaults.theme,
            notifications: typeof prefs.notifications === 'boolean' 
                ? prefs.notifications 
                : defaults.notifications,
            language: typeof prefs.language === 'string' 
                ? prefs.language 
                : defaults.language,
            fontSize: typeof prefs.fontSize === 'number' && prefs.fontSize >= 8 && prefs.fontSize <= 32
                ? prefs.fontSize
                : defaults.fontSize
        };
    }

    updatePreferences(updates: Partial<UserPreferences>): void {
        this.preferences = {
            ...this.preferences,
            ...this.validatePreferences(updates)
        };
        this.savePreferences();
    }

    private savePreferences(): void {
        try {
            localStorage.setItem(
                UserPreferencesManager.STORAGE_KEY,
                JSON.stringify(this.preferences)
            );
        } catch (error) {
            console.error('Failed to save preferences:', error);
        }
    }

    getPreferences(): Readonly<UserPreferences> {
        return { ...this.preferences };
    }

    resetToDefaults(): void {
        this.preferences = { ...UserPreferencesManager.DEFAULT_PREFERENCES };
        this.savePreferences();
    }

    exportPreferences(): string {
        return JSON.stringify(this.preferences, null, 2);
    }

    importPreferences(json: string): boolean {
        try {
            const parsed = JSON.parse(json);
            this.preferences = this.validatePreferences(parsed);
            this.savePreferences();
            return true;
        } catch (error) {
            console.error('Failed to import preferences:', error);
            return false;
        }
    }
}

export { UserPreferencesManager, type UserPreferences };
```interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  fontSize: number;
  notificationsEnabled: boolean;
  language: string;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  fontSize: 16,
  notificationsEnabled: true,
  language: 'en-US'
};

const STORAGE_KEY = 'app_user_preferences';

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
        return { ...DEFAULT_PREFERENCES, ...parsed };
      }
    } catch (error) {
      console.warn('Failed to load user preferences:', error);
    }
    return { ...DEFAULT_PREFERENCES };
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    this.preferences = { ...this.preferences, ...updates };
    this.savePreferences();
  }

  private savePreferences(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.preferences));
    } catch (error) {
      console.error('Failed to save user preferences:', error);
    }
  }

  resetToDefaults(): void {
    this.preferences = { ...DEFAULT_PREFERENCES };
    this.savePreferences();
  }

  getTheme(): string {
    if (this.preferences.theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return this.preferences.theme;
  }
}

export const userPreferences = new UserPreferencesManager();import { z } from 'zod';

const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  language: z.string().min(2).default('en'),
  notifications: z.boolean().default(true),
  fontSize: z.number().min(8).max(32).default(14),
});

type UserPreferences = z.infer<typeof UserPreferencesSchema>;

const STORAGE_KEY = 'app_user_preferences';

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
    const validated = UserPreferencesSchema.partial().parse(updates);
    this.preferences = { ...this.preferences, ...validated };
    this.savePreferences();
  }

  resetToDefaults(): void {
    this.preferences = UserPreferencesSchema.parse({});
    this.savePreferences();
  }

  exportPreferences(): string {
    return JSON.stringify(this.preferences, null, 2);
  }

  importPreferences(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      this.preferences = UserPreferencesSchema.parse(parsed);
      this.savePreferences();
      return true;
    } catch (error) {
      console.error('Invalid preferences format:', error);
      return false;
    }
  }
}

export const userPreferences = new UserPreferencesManager();interface UserPreferences {
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

class UserPreferencesManager {
  private preferences: UserPreferences;

  constructor() {
    this.preferences = this.loadPreferences();
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    const validatedUpdates = this.validateUpdates(updates);
    this.preferences = { ...this.preferences, ...validatedUpdates };
    this.savePreferences();
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  resetToDefaults(): void {
    this.preferences = { ...DEFAULT_PREFERENCES };
    this.savePreferences();
  }

  private validateUpdates(updates: Partial<UserPreferences>): Partial<UserPreferences> {
    const validated: Partial<UserPreferences> = {};

    if (updates.theme !== undefined) {
      if (['light', 'dark', 'auto'].includes(updates.theme)) {
        validated.theme = updates.theme as UserPreferences['theme'];
      }
    }

    if (updates.notifications !== undefined) {
      validated.notifications = Boolean(updates.notifications);
    }

    if (updates.language !== undefined) {
      if (typeof updates.language === 'string' && updates.language.length === 2) {
        validated.language = updates.language;
      }
    }

    if (updates.fontSize !== undefined) {
      const size = Number(updates.fontSize);
      if (!isNaN(size) && size >= 8 && size <= 24) {
        validated.fontSize = size;
      }
    }

    return validated;
  }

  private loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem('userPreferences');
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...DEFAULT_PREFERENCES, ...parsed };
      }
    } catch (error) {
      console.warn('Failed to load preferences from storage');
    }
    return { ...DEFAULT_PREFERENCES };
  }

  private savePreferences(): void {
    try {
      localStorage.setItem('userPreferences', JSON.stringify(this.preferences));
    } catch (error) {
      console.error('Failed to save preferences to storage');
    }
  }
}

export const preferencesManager = new UserPreferencesManager();interface UserPreferences {
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

const VALID_LANGUAGES = ['en-US', 'es-ES', 'fr-FR', 'de-DE'];
const MIN_RESULTS_PER_PAGE = 5;
const MAX_RESULTS_PER_PAGE = 100;

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

    if (!VALID_LANGUAGES.includes(this.preferences.language)) {
      this.preferences.language = DEFAULT_PREFERENCES.language;
    }

    if (typeof this.preferences.resultsPerPage !== 'number' ||
        this.preferences.resultsPerPage < MIN_RESULTS_PER_PAGE ||
        this.preferences.resultsPerPage > MAX_RESULTS_PER_PAGE) {
      this.preferences.resultsPerPage = DEFAULT_PREFERENCES.resultsPerPage;
    }
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    const previousPreferences = { ...this.preferences };
    this.preferences = { ...this.preferences, ...updates };
    this.validateAndFixPreferences();

    if (JSON.stringify(previousPreferences) !== JSON.stringify(this.preferences)) {
      this.saveToStorage();
    }
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  resetToDefaults(): void {
    this.preferences = { ...DEFAULT_PREFERENCES };
    this.saveToStorage();
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem('userPreferences', JSON.stringify(this.preferences));
    } catch (error) {
      console.error('Failed to save preferences to storage:', error);
    }
  }

  static loadFromStorage(): UserPreferencesManager {
    try {
      const stored = localStorage.getItem('userPreferences');
      if (stored) {
        const parsed = JSON.parse(stored);
        return new UserPreferencesManager(parsed);
      }
    } catch (error) {
      console.error('Failed to load preferences from storage:', error);
    }
    return new UserPreferencesManager();
  }
}

export { UserPreferencesManager, type UserPreferences };interface UserPreferences {
  theme: 'light' | 'dark';
  fontSize: number;
  notificationsEnabled: boolean;
  language: string;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'light',
  fontSize: 14,
  notificationsEnabled: true,
  language: 'en-US'
};

class UserPreferencesManager {
  private static readonly STORAGE_KEY = 'user_preferences';

  static loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...DEFAULT_PREFERENCES, ...parsed };
      }
    } catch (error) {
      console.warn('Failed to load preferences from localStorage:', error);
    }
    return { ...DEFAULT_PREFERENCES };
  }

  static savePreferences(prefs: Partial<UserPreferences>): void {
    try {
      const current = this.loadPreferences();
      const updated = { ...current, ...prefs };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save preferences to localStorage:', error);
    }
  }

  static resetToDefaults(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Failed to reset preferences:', error);
    }
  }

  static getPreference<K extends keyof UserPreferences>(key: K): UserPreferences[K] {
    const prefs = this.loadPreferences();
    return prefs[key];
  }
}

export { UserPreferencesManager, DEFAULT_PREFERENCES };
export type { UserPreferences };interface UserPreferences {
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
    const stored = localStorage.getItem(UserPreferencesManager.STORAGE_KEY);
    if (!stored) return null;

    try {
      const parsed = JSON.parse(stored);
      if (this.validatePreferences(parsed)) {
        return parsed;
      }
    } catch (error) {
      console.warn('Failed to parse stored preferences:', error);
    }
    return null;
  }

  private validatePreferences(data: unknown): data is UserPreferences {
    if (!data || typeof data !== 'object') return false;

    const pref = data as Record<string, unknown>;
    
    const validThemes = ['light', 'dark', 'auto'];
    if (!pref.theme || !validThemes.includes(pref.theme as string)) return false;
    
    if (!pref.language || typeof pref.language !== 'string') return false;
    
    if (typeof pref.notificationsEnabled !== 'boolean') return false;
    
    if (typeof pref.fontSize !== 'number' || pref.fontSize < 8 || pref.fontSize > 72) return false;

    return true;
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

  private savePreferences(): void {
    try {
      localStorage.setItem(
        UserPreferencesManager.STORAGE_KEY,
        JSON.stringify(this.preferences)
      );
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
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
  language: 'en-US',
  notificationsEnabled: true,
  fontSize: 16
};

export const userPrefsManager = new UserPreferencesManager(defaultPreferences);import { z } from 'zod';

const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.boolean().default(true),
  language: z.string().min(2).default('en'),
  resultsPerPage: z.number().min(5).max(100).default(25),
  timezone: z.string().optional()
});

type UserPreferences = z.infer<typeof UserPreferencesSchema>;

class UserPreferencesManager {
  private static readonly STORAGE_KEY = 'user_preferences';
  private preferences: UserPreferences;

  constructor() {
    this.preferences = this.loadPreferences();
  }

  private loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(UserPreferencesManager.STORAGE_KEY);
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
    localStorage.setItem(
      UserPreferencesManager.STORAGE_KEY,
      JSON.stringify(this.preferences)
    );
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    const validated = UserPreferencesSchema.partial().parse(updates);
    this.preferences = { ...this.preferences, ...validated };
    this.savePreferences();
  }

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  resetToDefaults(): void {
    this.preferences = UserPreferencesSchema.parse({});
    this.savePreferences();
  }

  validateExternalData(data: unknown): UserPreferences {
    return UserPreferencesSchema.parse(data);
  }
}

export { UserPreferencesManager, type UserPreferences };