interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notificationsEnabled: boolean;
  fontSize: number;
}

class UserPreferencesManager {
  private static readonly STORAGE_KEY = 'user_preferences';
  private preferences: UserPreferences;

  constructor(defaultPreferences?: Partial<UserPreferences>) {
    this.preferences = this.loadPreferences();
    if (defaultPreferences) {
      this.preferences = { ...this.preferences, ...defaultPreferences };
    }
    this.validatePreferences();
  }

  private loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(UserPreferencesManager.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load preferences from storage', error);
    }
    return this.getDefaultPreferences();
  }

  private getDefaultPreferences(): UserPreferences {
    return {
      theme: 'auto',
      language: 'en',
      notificationsEnabled: true,
      fontSize: 14
    };
  }

  private validatePreferences(): void {
    const validThemes = ['light', 'dark', 'auto'];
    if (!validThemes.includes(this.preferences.theme)) {
      this.preferences.theme = 'auto';
    }

    if (typeof this.preferences.language !== 'string' || this.preferences.language.length === 0) {
      this.preferences.language = 'en';
    }

    if (typeof this.preferences.notificationsEnabled !== 'boolean') {
      this.preferences.notificationsEnabled = true;
    }

    if (typeof this.preferences.fontSize !== 'number' || this.preferences.fontSize < 8 || this.preferences.fontSize > 72) {
      this.preferences.fontSize = 14;
    }
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    this.preferences = { ...this.preferences, ...updates };
    this.validatePreferences();
    this.savePreferences();
  }

  private savePreferences(): void {
    try {
      localStorage.setItem(UserPreferencesManager.STORAGE_KEY, JSON.stringify(this.preferences));
    } catch (error) {
      console.error('Failed to save preferences to storage', error);
    }
  }

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  resetToDefaults(): void {
    this.preferences = this.getDefaultPreferences();
    this.savePreferences();
  }

  exportPreferences(): string {
    return JSON.stringify(this.preferences, null, 2);
  }

  importPreferences(jsonString: string): boolean {
    try {
      const imported = JSON.parse(jsonString);
      this.updatePreferences(imported);
      return true;
    } catch (error) {
      console.error('Failed to import preferences', error);
      return false;
    }
  }
}

export { UserPreferencesManager, type UserPreferences };