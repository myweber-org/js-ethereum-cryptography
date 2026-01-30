interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  fontSize: number;
  notificationsEnabled: boolean;
  language: string;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  fontSize: 14,
  notificationsEnabled: true,
  language: 'en-US'
};

const VALID_LANGUAGES = ['en-US', 'es-ES', 'fr-FR', 'de-DE'];

class UserPreferencesManager {
  private preferences: UserPreferences;

  constructor(initialPreferences?: Partial<UserPreferences>) {
    this.preferences = { ...DEFAULT_PREFERENCES, ...initialPreferences };
    this.validateAndNormalize();
  }

  private validateAndNormalize(): void {
    if (!['light', 'dark', 'auto'].includes(this.preferences.theme)) {
      this.preferences.theme = DEFAULT_PREFERENCES.theme;
    }

    if (typeof this.preferences.fontSize !== 'number' || 
        this.preferences.fontSize < 8 || 
        this.preferences.fontSize > 32) {
      this.preferences.fontSize = DEFAULT_PREFERENCES.fontSize;
    }

    if (typeof this.preferences.notificationsEnabled !== 'boolean') {
      this.preferences.notificationsEnabled = DEFAULT_PREFERENCES.notificationsEnabled;
    }

    if (!VALID_LANGUAGES.includes(this.preferences.language)) {
      this.preferences.language = DEFAULT_PREFERENCES.language;
    }
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    this.preferences = { ...this.preferences, ...updates };
    this.validateAndNormalize();
  }

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  resetToDefaults(): void {
    this.preferences = { ...DEFAULT_PREFERENCES };
  }

  exportPreferences(): string {
    return JSON.stringify(this.preferences);
  }

  static importPreferences(jsonString: string): UserPreferencesManager {
    try {
      const parsed = JSON.parse(jsonString);
      return new UserPreferencesManager(parsed);
    } catch {
      return new UserPreferencesManager();
    }
  }
}

export { UserPreferencesManager, type UserPreferences };