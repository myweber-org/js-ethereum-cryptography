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

  updatePreferences(updates: Partial<UserPreferences>): void {
    const validated = this.validateUpdates(updates);
    this.preferences = { ...this.preferences, ...validated };
    this.savePreferences();
  }

  private validateUpdates(updates: Partial<UserPreferences>): Partial<UserPreferences> {
    const validated: Partial<UserPreferences> = {};

    if (updates.theme !== undefined) {
      if (['light', 'dark', 'auto'].includes(updates.theme)) {
        validated.theme = updates.theme;
      }
    }

    if (updates.notifications !== undefined) {
      validated.notifications = Boolean(updates.notifications);
    }

    if (updates.language !== undefined) {
      if (typeof updates.language === 'string' && updates.language.length >= 2) {
        validated.language = updates.language;
      }
    }

    if (updates.fontSize !== undefined) {
      const size = Number(updates.fontSize);
      if (!isNaN(size) && size >= 8 && size <= 32) {
        validated.fontSize = size;
      }
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
    this.preferences = defaults;
    this.savePreferences();
  }
}

const defaultPreferences: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en',
  fontSize: 14
};

export const preferencesManager = new UserPreferencesManager(defaultPreferences);