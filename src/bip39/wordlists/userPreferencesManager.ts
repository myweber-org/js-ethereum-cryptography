interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  resultsPerPage: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en-US',
  resultsPerPage: 20
};

const VALID_LANGUAGES = ['en-US', 'es-ES', 'fr-FR', 'de-DE'];
const MIN_RESULTS_PER_PAGE = 10;
const MAX_RESULTS_PER_PAGE = 100;

class UserPreferencesManager {
  private preferences: UserPreferences;

  constructor(initialPreferences?: Partial<UserPreferences>) {
    this.preferences = { ...DEFAULT_PREFERENCES, ...this.validatePreferences(initialPreferences || {}) };
  }

  private validatePreferences(prefs: Partial<UserPreferences>): Partial<UserPreferences> {
    const validated: Partial<UserPreferences> = {};

    if (prefs.theme !== undefined) {
      validated.theme = ['light', 'dark', 'auto'].includes(prefs.theme) ? prefs.theme : DEFAULT_PREFERENCES.theme;
    }

    if (prefs.notifications !== undefined) {
      validated.notifications = typeof prefs.notifications === 'boolean' ? prefs.notifications : DEFAULT_PREFERENCES.notifications;
    }

    if (prefs.language !== undefined) {
      validated.language = VALID_LANGUAGES.includes(prefs.language) ? prefs.language : DEFAULT_PREFERENCES.language;
    }

    if (prefs.resultsPerPage !== undefined) {
      const num = Number(prefs.resultsPerPage);
      validated.resultsPerPage = Number.isInteger(num) && num >= MIN_RESULTS_PER_PAGE && num <= MAX_RESULTS_PER_PAGE 
        ? num 
        : DEFAULT_PREFERENCES.resultsPerPage;
    }

    return validated;
  }

  updatePreferences(newPreferences: Partial<UserPreferences>): UserPreferences {
    const validated = this.validatePreferences(newPreferences);
    this.preferences = { ...this.preferences, ...validated };
    return this.getPreferences();
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  resetToDefaults(): UserPreferences {
    this.preferences = { ...DEFAULT_PREFERENCES };
    return this.getPreferences();
  }

  exportAsJSON(): string {
    return JSON.stringify(this.preferences, null, 2);
  }

  static importFromJSON(jsonString: string): UserPreferencesManager {
    try {
      const parsed = JSON.parse(jsonString);
      return new UserPreferencesManager(parsed);
    } catch {
      return new UserPreferencesManager();
    }
  }
}

export { UserPreferencesManager, type UserPreferences };