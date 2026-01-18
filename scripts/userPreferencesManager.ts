typescript
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: boolean;
  fontSize: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  language: 'en-US',
  notifications: true,
  fontSize: 16
};

const VALID_LANGUAGES = ['en-US', 'es-ES', 'fr-FR', 'de-DE'];
const MIN_FONT_SIZE = 12;
const MAX_FONT_SIZE = 24;

class UserPreferencesManager {
  private preferences: UserPreferences;

  constructor() {
    this.preferences = this.loadPreferences();
  }

  public getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  public updatePreferences(updates: Partial<UserPreferences>): boolean {
    const validatedUpdates = this.validateUpdates(updates);
    
    if (Object.keys(validatedUpdates).length === 0) {
      return false;
    }

    this.preferences = { ...this.preferences, ...validatedUpdates };
    this.savePreferences();
    return true;
  }

  public resetToDefaults(): void {
    this.preferences = { ...DEFAULT_PREFERENCES };
    this.savePreferences();
  }

  private validateUpdates(updates: Partial<UserPreferences>): Partial<UserPreferences> {
    const validated: Partial<UserPreferences> = {};

    if (updates.theme !== undefined && ['light', 'dark', 'auto'].includes(updates.theme)) {
      validated.theme = updates.theme;
    }

    if (updates.language !== undefined && VALID_LANGUAGES.includes(updates.language)) {
      validated.language = updates.language;
    }

    if (updates.notifications !== undefined && typeof updates.notifications === 'boolean') {
      validated.notifications = updates.notifications;
    }

    if (updates.fontSize !== undefined) {
      const size = Number(updates.fontSize);
      if (!isNaN(size) && size >= MIN_FONT_SIZE && size <= MAX_FONT_SIZE) {
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
        return { ...DEFAULT_PREFERENCES, ...this.validateUpdates(parsed) };
      }
    } catch (error) {
      console.warn('Failed to load preferences from storage:', error);
    }
    
    return { ...DEFAULT_PREFERENCES };
  }

  private savePreferences(): void {
    try {
      localStorage.setItem('userPreferences', JSON.stringify(this.preferences));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }
}

export const preferencesManager = new UserPreferencesManager();
```interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  notificationsEnabled: boolean;
  fontSize: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'light',
  language: 'en-US',
  notificationsEnabled: true,
  fontSize: 14
};

class UserPreferencesManager {
  private readonly storageKey = 'user_preferences';

  savePreferences(preferences: Partial<UserPreferences>): void {
    const current = this.loadPreferences();
    const updated = { ...current, ...preferences };
    localStorage.setItem(this.storageKey, JSON.stringify(updated));
  }

  loadPreferences(): UserPreferences {
    const stored = localStorage.getItem(this.storageKey);
    if (!stored) return { ...DEFAULT_PREFERENCES };
    
    try {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_PREFERENCES, ...parsed };
    } catch {
      return { ...DEFAULT_PREFERENCES };
    }
  }

  resetToDefaults(): void {
    localStorage.removeItem(this.storageKey);
  }

  getPreference<K extends keyof UserPreferences>(key: K): UserPreferences[K] {
    const preferences = this.loadPreferences();
    return preferences[key];
  }
}

export const preferencesManager = new UserPreferencesManager();