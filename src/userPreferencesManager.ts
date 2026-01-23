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

class UserPreferencesManager {
  private preferences: UserPreferences;

  constructor(initialPreferences?: Partial<UserPreferences>) {
    this.preferences = { ...DEFAULT_PREFERENCES, ...initialPreferences };
    this.validateAndNormalize();
  }

  private validateAndNormalize(): void {
    if (!VALID_LANGUAGES.includes(this.preferences.language)) {
      this.preferences.language = DEFAULT_PREFERENCES.language;
    }

    if (this.preferences.fontSize < 8 || this.preferences.fontSize > 32) {
      this.preferences.fontSize = DEFAULT_PREFERENCES.fontSize;
    }
  }

  updatePreferences(updates: Partial<UserPreferences>): boolean {
    const previousPreferences = { ...this.preferences };
    this.preferences = { ...this.preferences, ...updates };
    
    try {
      this.validateAndNormalize();
      this.saveToStorage();
      return true;
    } catch (error) {
      this.preferences = previousPreferences;
      console.error('Failed to update preferences:', error);
      return false;
    }
  }

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  resetToDefaults(): void {
    this.preferences = { ...DEFAULT_PREFERENCES };
    this.saveToStorage();
  }

  private saveToStorage(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('userPreferences', JSON.stringify(this.preferences));
    }
  }

  static loadFromStorage(): UserPreferencesManager {
    if (typeof localStorage === 'undefined') {
      return new UserPreferencesManager();
    }

    const stored = localStorage.getItem('userPreferences');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return new UserPreferencesManager(parsed);
      } catch {
        return new UserPreferencesManager();
      }
    }
    
    return new UserPreferencesManager();
  }
}

export { UserPreferencesManager, type UserPreferences };