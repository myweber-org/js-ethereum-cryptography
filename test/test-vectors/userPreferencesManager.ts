import { z } from 'zod';

const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.boolean().default(true),
  language: z.string().min(2).default('en'),
  resultsPerPage: z.number().min(5).max(100).default(20),
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
      if (!stored) return UserPreferencesSchema.parse({});

      const parsed = JSON.parse(stored);
      return UserPreferencesSchema.parse(parsed);
    } catch {
      return UserPreferencesSchema.parse({});
    }
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

  importPreferences(json: string): boolean {
    try {
      const parsed = JSON.parse(json);
      this.preferences = UserPreferencesSchema.parse(parsed);
      this.savePreferences();
      return true;
    } catch {
      return false;
    }
  }
}

export const userPreferences = new UserPreferencesManager();typescript
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

const VALID_LANGUAGES = ['en-US', 'es-ES', 'fr-FR', 'de-DE'];
const MIN_FONT_SIZE = 8;
const MAX_FONT_SIZE = 24;

class UserPreferencesManager {
    private preferences: UserPreferences;

    constructor() {
        this.preferences = this.loadPreferences() || DEFAULT_PREFERENCES;
    }

    getPreferences(): UserPreferences {
        return { ...this.preferences };
    }

    updatePreferences(updates: Partial<UserPreferences>): boolean {
        const validatedUpdates = this.validateUpdates(updates);
        
        if (Object.keys(validatedUpdates).length === 0) {
            return false;
        }

        this.preferences = { ...this.preferences, ...validatedUpdates };
        this.savePreferences();
        return true;
    }

    resetToDefaults(): void {
        this.preferences = { ...DEFAULT_PREFERENCES };
        this.savePreferences();
    }

    private validateUpdates(updates: Partial<UserPreferences>): Partial<UserPreferences> {
        const validated: Partial<UserPreferences> = {};

        if (updates.theme !== undefined && ['light', 'dark', 'auto'].includes(updates.theme)) {
            validated.theme = updates.theme;
        }

        if (updates.notifications !== undefined && typeof updates.notifications === 'boolean') {
            validated.notifications = updates.notifications;
        }

        if (updates.language !== undefined && VALID_LANGUAGES.includes(updates.language)) {
            validated.language = updates.language;
        }

        if (updates.fontSize !== undefined && 
            typeof updates.fontSize === 'number' && 
            updates.fontSize >= MIN_FONT_SIZE && 
            updates.fontSize <= MAX_FONT_SIZE) {
            validated.fontSize = updates.fontSize;
        }

        return validated;
    }

    private loadPreferences(): UserPreferences | null {
        try {
            const stored = localStorage.getItem('userPreferences');
            if (!stored) return null;
            
            const parsed = JSON.parse(stored);
            return this.validateUpdates(parsed) as UserPreferences;
        } catch {
            return null;
        }
    }

    private savePreferences(): void {
        localStorage.setItem('userPreferences', JSON.stringify(this.preferences));
    }
}

export { UserPreferencesManager, type UserPreferences };
```