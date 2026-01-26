typescript
interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
    language: string;
    fontSize: number;
    autoSave: boolean;
}

class UserPreferencesManager {
    private static readonly STORAGE_KEY = 'user_preferences';
    private static readonly DEFAULT_PREFERENCES: UserPreferences = {
        theme: 'auto',
        notifications: true,
        language: 'en-US',
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

    private validatePreferences(data: any): UserPreferences {
        const validThemes = ['light', 'dark', 'auto'];
        const defaultPrefs = UserPreferencesManager.DEFAULT_PREFERENCES;

        return {
            theme: validThemes.includes(data.theme) ? data.theme : defaultPrefs.theme,
            notifications: typeof data.notifications === 'boolean' ? data.notifications : defaultPrefs.notifications,
            language: typeof data.language === 'string' ? data.language : defaultPrefs.language,
            fontSize: typeof data.fontSize === 'number' && data.fontSize >= 8 && data.fontSize <= 32 
                ? data.fontSize 
                : defaultPrefs.fontSize,
            autoSave: typeof data.autoSave === 'boolean' ? data.autoSave : defaultPrefs.autoSave
        };
    }

    public getPreferences(): UserPreferences {
        return { ...this.preferences };
    }

    public updatePreferences(updates: Partial<UserPreferences>): UserPreferences {
        const newPreferences = { ...this.preferences, ...updates };
        this.preferences = this.validatePreferences(newPreferences);
        this.savePreferences();
        return this.getPreferences();
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

    public resetToDefaults(): UserPreferences {
        this.preferences = { ...UserPreferencesManager.DEFAULT_PREFERENCES };
        this.savePreferences();
        return this.getPreferences();
    }

    public exportPreferences(): string {
        return JSON.stringify(this.preferences, null, 2);
    }

    public importPreferences(jsonString: string): boolean {
        try {
            const imported = JSON.parse(jsonString);
            this.preferences = this.validatePreferences(imported);
            this.savePreferences();
            return true;
        } catch (error) {
            console.error('Failed to import preferences:', error);
            return false;
        }
    }
}

export { UserPreferencesManager, type UserPreferences };
```import { z } from 'zod';

const PreferenceSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('light'),
  notifications: z.boolean().default(true),
  language: z.string().min(2).default('en'),
  fontSize: z.number().min(12).max(24).default(16),
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

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): boolean {
    try {
      const merged = { ...this.preferences, ...updates };
      const validated = PreferenceSchema.parse(merged);
      this.preferences = validated;
      this.savePreferences();
      return true;
    } catch (error) {
      console.error('Invalid preferences update:', error);
      return false;
    }
  }

  resetToDefaults(): void {
    this.preferences = PreferenceSchema.parse({});
    this.savePreferences();
  }

  exportPreferences(): string {
    return JSON.stringify(this.preferences, null, 2);
  }

  importPreferences(json: string): boolean {
    try {
      const parsed = JSON.parse(json);
      const validated = PreferenceSchema.parse(parsed);
      this.preferences = validated;
      this.savePreferences();
      return true;
    } catch (error) {
      console.error('Failed to import preferences:', error);
      return false;
    }
  }
}

export const preferencesManager = new PreferencesManager();import { z } from 'zod';

const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  language: z.string().min(2).default('en'),
  notificationsEnabled: z.boolean().default(true),
  fontSize: z.number().min(8).max(32).default(14),
  autoSaveInterval: z.number().min(0).max(300).default(60)
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