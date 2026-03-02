interface UserPreferences {
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
      fontSize: 16
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
    if (typeof this.preferences.fontSize !== 'number' || this.preferences.fontSize < 8 || this.preferences.fontSize > 72) {
      this.preferences.fontSize = 16;
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

export { UserPreferencesManager, type UserPreferences };
interface UserPreferences {
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

class UserPreferencesManager {
  private readonly storageKey = 'app_user_preferences';

  getPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) return { ...DEFAULT_PREFERENCES };

      const parsed = JSON.parse(stored);
      return this.validateAndMerge(parsed);
    } catch {
      return { ...DEFAULT_PREFERENCES };
    }
  }

  updatePreferences(updates: Partial<UserPreferences>): UserPreferences {
    const current = this.getPreferences();
    const merged = { ...current, ...updates };
    const validated = this.validateAndMerge(merged);

    localStorage.setItem(this.storageKey, JSON.stringify(validated));
    return validated;
  }

  resetToDefaults(): UserPreferences {
    localStorage.removeItem(this.storageKey);
    return { ...DEFAULT_PREFERENCES };
  }

  private validateAndMerge(data: unknown): UserPreferences {
    const result = { ...DEFAULT_PREFERENCES };

    if (data && typeof data === 'object') {
      const obj = data as Record<string, unknown>;

      if (obj.theme && ['light', 'dark', 'auto'].includes(obj.theme as string)) {
        result.theme = obj.theme as UserPreferences['theme'];
      }

      if (typeof obj.fontSize === 'number' && obj.fontSize >= 12 && obj.fontSize <= 24) {
        result.fontSize = obj.fontSize;
      }

      if (typeof obj.notificationsEnabled === 'boolean') {
        result.notificationsEnabled = obj.notificationsEnabled;
      }

      if (typeof obj.language === 'string' && obj.language.length >= 2) {
        result.language = obj.language;
      }
    }

    return result;
  }
}

export const preferencesManager = new UserPreferencesManager();