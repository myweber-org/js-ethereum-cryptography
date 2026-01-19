
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  fontSize: number;
  language: string;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  notifications: true,
  fontSize: 16,
  language: 'en-US'
};

const VALID_LANGUAGES = ['en-US', 'es-ES', 'fr-FR', 'de-DE'] as const;

class PreferencesManager {
  private preferences: UserPreferences;

  constructor(initialPreferences?: Partial<UserPreferences>) {
    this.preferences = { ...DEFAULT_PREFERENCES, ...initialPreferences };
    this.validatePreferences();
  }

  private validatePreferences(): void {
    if (!['light', 'dark', 'auto'].includes(this.preferences.theme)) {
      throw new Error(`Invalid theme: ${this.preferences.theme}`);
    }

    if (typeof this.preferences.notifications !== 'boolean') {
      throw new Error('Notifications must be boolean');
    }

    if (this.preferences.fontSize < 8 || this.preferences.fontSize > 72) {
      throw new Error(`Font size ${this.preferences.fontSize} out of range`);
    }

    if (!VALID_LANGUAGES.includes(this.preferences.language as any)) {
      throw new Error(`Unsupported language: ${this.preferences.language}`);
    }
  }

  updatePreferences(updates: Partial<UserPreferences>): UserPreferences {
    const newPreferences = { ...this.preferences, ...updates };
    const tempManager = new PreferencesManager(newPreferences);
    this.preferences = tempManager.getPreferences();
    return this.preferences;
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  resetToDefaults(): UserPreferences {
    this.preferences = { ...DEFAULT_PREFERENCES };
    return this.preferences;
  }

  exportAsJSON(): string {
    return JSON.stringify(this.preferences, null, 2);
  }

  static importFromJSON(jsonString: string): PreferencesManager {
    try {
      const parsed = JSON.parse(jsonString);
      return new PreferencesManager(parsed);
    } catch (error) {
      throw new Error('Invalid preferences JSON');
    }
  }
}

export { PreferencesManager, type UserPreferences };