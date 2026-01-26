interface UserPreferences {
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

    if (updates.language && typeof updates.language === 'string') {
      validated.language = updates.language;
    }

    if (typeof updates.notificationsEnabled === 'boolean') {
      validated.notificationsEnabled = updates.notificationsEnabled;
    }

    if (updates.fontSize && updates.fontSize >= 12 && updates.fontSize <= 24) {
      validated.fontSize = updates.fontSize;
    }

    return validated;
  }

  private savePreferences(): void {
    localStorage.setItem(
      UserPreferencesManager.STORAGE_KEY,
      JSON.stringify(this.preferences)
    );
  }

  getPreferences(): UserPreferences {
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

export const userPrefsManager = new UserPreferencesManager(defaultPreferences);import { z } from 'zod';

const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notificationsEnabled: z.boolean().default(true),
  itemsPerPage: z.number().min(5).max(100).default(25),
  language: z.string().min(2).max(5).default('en'),
  lastUpdated: z.date().optional()
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
      parsed.lastUpdated = parsed.lastUpdated ? new Date(parsed.lastUpdated) : undefined;
      
      return UserPreferencesSchema.parse(parsed);
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

  updatePreferences(updates: Partial<UserPreferences>): void {
    const validated = UserPreferencesSchema.partial().parse(updates);
    
    this.preferences = {
      ...this.preferences,
      ...validated
    };
    
    this.savePreferences();
  }

  resetToDefaults(): void {
    this.preferences = UserPreferencesSchema.parse({});
    this.savePreferences();
  }

  validateExternalData(data: unknown): UserPreferences {
    return UserPreferencesSchema.parse(data);
  }
}

export const userPreferences = new UserPreferencesManager();