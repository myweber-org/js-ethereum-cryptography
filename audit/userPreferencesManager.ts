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
      if (stored) {
        const parsed = JSON.parse(stored);
        return UserPreferencesSchema.parse(parsed);
      }
    } catch (error) {
      console.warn('Failed to load user preferences:', error);
    }
    return UserPreferencesSchema.parse({});
  }

  private savePreferences(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.preferences));
    } catch (error) {
      console.error('Failed to save user preferences:', error);
    }
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
      console.error('Invalid preferences update:', error);
      throw new Error('Invalid preferences data');
    }
  }

  resetToDefaults(): void {
    this.preferences = UserPreferencesSchema.parse({});
    this.savePreferences();
  }

  getTheme(): string {
    if (this.preferences.theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return this.preferences.theme;
  }
}

export const userPreferences = new UserPreferencesManager();typescript
interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    notifications: {
        email: boolean;
        push: boolean;
        frequency: 'instant' | 'daily' | 'weekly';
    };
    privacy: {
        profileVisibility: 'public' | 'private' | 'friends';
        dataSharing: boolean;
    };
}

class UserPreferencesManager {
    private static readonly STORAGE_KEY = 'user_preferences';
    private preferences: UserPreferences;

    constructor(defaultPreferences?: Partial<UserPreferences>) {
        this.preferences = this.loadPreferences() || this.getDefaultPreferences();
        
        if (defaultPreferences) {
            this.preferences = { ...this.preferences, ...defaultPreferences };
        }
    }

    private getDefaultPreferences(): UserPreferences {
        return {
            theme: 'auto',
            language: 'en-US',
            notifications: {
                email: true,
                push: false,
                frequency: 'daily'
            },
            privacy: {
                profileVisibility: 'private',
                dataSharing: false
            }
        };
    }

    private loadPreferences(): UserPreferences | null {
        try {
            const stored = localStorage.getItem(UserPreferencesManager.STORAGE_KEY);
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    }

    public savePreferences(): boolean {
        try {
            localStorage.setItem(
                UserPreferencesManager.STORAGE_KEY,
                JSON.stringify(this.preferences)
            );
            return true;
        } catch {
            return false;
        }
    }

    public updatePreferences(updates: Partial<UserPreferences>): void {
        this.preferences = { ...this.preferences, ...updates };
        
        if (updates.theme) {
            this.applyTheme(updates.theme);
        }
    }

    private applyTheme(theme: UserPreferences['theme']): void {
        const root = document.documentElement;
        
        switch (theme) {
            case 'light':
                root.classList.remove('dark-theme');
                root.classList.add('light-theme');
                break;
            case 'dark':
                root.classList.remove('light-theme');
                root.classList.add('dark-theme');
                break;
            case 'auto':
                root.classList.remove('light-theme', 'dark-theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                root.classList.add(prefersDark ? 'dark-theme' : 'light-theme');
                break;
        }
    }

    public getPreferences(): Readonly<UserPreferences> {
        return { ...this.preferences };
    }

    public resetToDefaults(): void {
        this.preferences = this.getDefaultPreferences();
        this.applyTheme(this.preferences.theme);
    }

    public validatePreferences(): { valid: boolean; errors: string[] } {
        const errors: string[] = [];
        const { theme, language, notifications, privacy } = this.preferences;

        if (!['light', 'dark', 'auto'].includes(theme)) {
            errors.push('Invalid theme selection');
        }

        if (!language.match(/^[a-z]{2}-[A-Z]{2}$/)) {
            errors.push('Invalid language format');
        }

        if (!['instant', 'daily', 'weekly'].includes(notifications.frequency)) {
            errors.push('Invalid notification frequency');
        }

        if (!['public', 'private', 'friends'].includes(privacy.profileVisibility)) {
            errors.push('Invalid privacy setting');
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }
}

export { UserPreferencesManager, type UserPreferences };
```interface UserPreferences {
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
    const validated = this.validateUpdates(updates);
    this.preferences = { ...this.preferences, ...validated };
    this.savePreferences();
  }

  private validateUpdates(updates: Partial<UserPreferences>): Partial<UserPreferences> {
    const validated: Partial<UserPreferences> = {};

    if (updates.theme !== undefined && ['light', 'dark', 'auto'].includes(updates.theme)) {
      validated.theme = updates.theme;
    }

    if (typeof updates.notifications === 'boolean') {
      validated.notifications = updates.notifications;
    }

    if (typeof updates.language === 'string' && updates.language.length >= 2) {
      validated.language = updates.language;
    }

    if (typeof updates.fontSize === 'number' && updates.fontSize >= 8 && updates.fontSize <= 32) {
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

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  resetToDefaults(defaults: UserPreferences): void {
    this.preferences = { ...defaults };
    this.savePreferences();
  }
}

const defaultPreferences: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en',
  fontSize: 14
};

export const preferencesManager = new UserPreferencesManager(defaultPreferences);interface UserPreferences {
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
      fontSize: 16
    };
  }

  private validatePreferences(data: unknown): UserPreferences {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid preferences data');
    }

    const prefs = data as Partial<UserPreferences>;
    
    const theme = prefs.theme && ['light', 'dark', 'auto'].includes(prefs.theme) 
      ? prefs.theme 
      : 'auto';
    
    const notifications = typeof prefs.notifications === 'boolean' 
      ? prefs.notifications 
      : true;
    
    const language = typeof prefs.language === 'string' && prefs.language.length === 2
      ? prefs.language
      : 'en';
    
    const fontSize = typeof prefs.fontSize === 'number' && prefs.fontSize >= 12 && prefs.fontSize <= 24
      ? prefs.fontSize
      : 16;

    return { theme, notifications, language, fontSize };
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    const newPreferences = { ...this.preferences, ...updates };
    this.preferences = this.validatePreferences(newPreferences);
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