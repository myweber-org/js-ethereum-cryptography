import { z } from 'zod';

const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notificationsEnabled: z.boolean().default(true),
  itemsPerPage: z.number().min(5).max(100).default(20),
  language: z.string().min(2).default('en'),
  lastUpdated: z.date().optional()
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
        const result = UserPreferencesSchema.safeParse({
          ...parsed,
          lastUpdated: parsed.lastUpdated ? new Date(parsed.lastUpdated) : undefined
        });
        return result.success ? result.data : UserPreferencesSchema.parse({});
      }
    } catch (error) {
      console.warn('Failed to load user preferences:', error);
    }
    return UserPreferencesSchema.parse({});
  }

  private savePreferences(): void {
    try {
      const dataToStore = {
        ...this.preferences,
        lastUpdated: new Date()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
    } catch (error) {
      console.error('Failed to save user preferences:', error);
    }
  }

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): boolean {
    try {
      const merged = { ...this.preferences, ...updates };
      const result = UserPreferencesSchema.safeParse(merged);
      
      if (result.success) {
        this.preferences = result.data;
        this.savePreferences();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to update preferences:', error);
      return false;
    }
  }

  resetToDefaults(): void {
    this.preferences = UserPreferencesSchema.parse({});
    this.savePreferences();
  }

  hasValidPreferences(): boolean {
    const result = UserPreferencesSchema.safeParse(this.preferences);
    return result.success;
  }
}

export { UserPreferencesManager, type UserPreferences };typescript
interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    notifications: boolean;
    fontSize: number;
    autoSave: boolean;
}

class UserPreferencesManager {
    private static readonly STORAGE_KEY = 'user_preferences';
    private static readonly DEFAULT_PREFERENCES: UserPreferences = {
        theme: 'auto',
        language: 'en',
        notifications: true,
        fontSize: 14,
        autoSave: true
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
            console.warn('Failed to load preferences from storage:', error);
        }
        return { ...UserPreferencesManager.DEFAULT_PREFERENCES };
    }

    private validatePreferences(data: unknown): UserPreferences {
        const defaultPrefs = UserPreferencesManager.DEFAULT_PREFERENCES;
        
        if (!data || typeof data !== 'object') {
            return { ...defaultPrefs };
        }

        const prefs = data as Record<string, unknown>;
        
        return {
            theme: this.isValidTheme(prefs.theme) ? prefs.theme as UserPreferences['theme'] : defaultPrefs.theme,
            language: typeof prefs.language === 'string' ? prefs.language : defaultPrefs.language,
            notifications: typeof prefs.notifications === 'boolean' ? prefs.notifications : defaultPrefs.notifications,
            fontSize: typeof prefs.fontSize === 'number' && prefs.fontSize >= 8 && prefs.fontSize <= 32 
                ? prefs.fontSize 
                : defaultPrefs.fontSize,
            autoSave: typeof prefs.autoSave === 'boolean' ? prefs.autoSave : defaultPrefs.autoSave
        };
    }

    private isValidTheme(theme: unknown): theme is UserPreferences['theme'] {
        return theme === 'light' || theme === 'dark' || theme === 'auto';
    }

    getPreferences(): Readonly<UserPreferences> {
        return { ...this.preferences };
    }

    updatePreferences(updates: Partial<UserPreferences>): void {
        const newPreferences = { ...this.preferences, ...updates };
        this.preferences = this.validatePreferences(newPreferences);
        this.savePreferences();
    }

    resetToDefaults(): void {
        this.preferences = { ...UserPreferencesManager.DEFAULT_PREFERENCES };
        this.savePreferences();
    }

    private savePreferences(): void {
        try {
            localStorage.setItem(UserPreferencesManager.STORAGE_KEY, JSON.stringify(this.preferences));
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
            this.preferences = this.validatePreferences(parsed);
            this.savePreferences();
            return true;
        } catch (error) {
            console.error('Failed to import preferences:', error);
            return false;
        }
    }
}

// Usage example
const preferencesManager = new UserPreferencesManager();

// Get current preferences
const currentPrefs = preferencesManager.getPreferences();
console.log('Current preferences:', currentPrefs);

// Update some preferences
preferencesManager.updatePreferences({ theme: 'dark', fontSize: 16 });

// Export preferences
const exported = preferencesManager.exportPreferences();
console.log('Exported preferences:', exported);
```import { z } from 'zod';

const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.boolean().default(true),
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
      if (!stored) return UserPreferencesSchema.parse({});

      const parsed = JSON.parse(stored);
      return UserPreferencesSchema.parse(parsed);
    } catch (error) {
      console.warn('Failed to load preferences, using defaults:', error);
      return UserPreferencesSchema.parse({});
    }
  }

  private savePreferences(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.preferences));
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): UserPreferences {
    try {
      const validated = UserPreferencesSchema.partial().parse(updates);
      this.preferences = { ...this.preferences, ...validated };
      this.savePreferences();
      return this.getPreferences();
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Invalid preferences: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw error;
    }
  }

  resetToDefaults(): UserPreferences {
    this.preferences = UserPreferencesSchema.parse({});
    this.savePreferences();
    return this.getPreferences();
  }

  hasStoredPreferences(): boolean {
    return localStorage.getItem(STORAGE_KEY) !== null;
  }
}

export const userPreferences = new UserPreferencesManager();import { z } from 'zod';

const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notificationsEnabled: z.boolean().default(true),
  itemsPerPage: z.number().min(5).max(100).default(25),
  language: z.string().default('en-US'),
  lastUpdated: z.date().optional()
});

type UserPreferences = z.infer<typeof UserPreferencesSchema>;

const STORAGE_KEY = 'user_preferences';

export class UserPreferencesManager {
  private preferences: UserPreferences;

  constructor() {
    this.preferences = this.loadPreferences();
  }

  private loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return UserPreferencesSchema.parse({});

      const parsed = JSON.parse(stored);
      const result = UserPreferencesSchema.safeParse({
        ...parsed,
        lastUpdated: parsed.lastUpdated ? new Date(parsed.lastUpdated) : undefined
      });

      return result.success ? result.data : UserPreferencesSchema.parse({});
    } catch {
      return UserPreferencesSchema.parse({});
    }
  }

  private savePreferences(): void {
    const dataToStore = {
      ...this.preferences,
      lastUpdated: new Date()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
  }

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): boolean {
    const merged = { ...this.preferences, ...updates };
    const result = UserPreferencesSchema.safeParse(merged);

    if (!result.success) return false;

    this.preferences = result.data;
    this.savePreferences();
    return true;
  }

  resetToDefaults(): void {
    this.preferences = UserPreferencesSchema.parse({});
    this.savePreferences();
  }

  hasValidPreferences(): boolean {
    return UserPreferencesSchema.safeParse(this.preferences).success;
  }
}