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
const MIN_RESULTS_PER_PAGE = 5;
const MAX_RESULTS_PER_PAGE = 100;

class UserPreferencesManager {
  private preferences: UserPreferences;

  constructor(initialPreferences?: Partial<UserPreferences>) {
    this.preferences = this.validatePreferences({
      ...DEFAULT_PREFERENCES,
      ...initialPreferences
    });
  }

  private validatePreferences(prefs: UserPreferences): UserPreferences {
    const validated: UserPreferences = { ...prefs };

    if (!['light', 'dark', 'auto'].includes(validated.theme)) {
      validated.theme = DEFAULT_PREFERENCES.theme;
    }

    if (!VALID_LANGUAGES.includes(validated.language)) {
      validated.language = DEFAULT_PREFERENCES.language;
    }

    if (typeof validated.notifications !== 'boolean') {
      validated.notifications = DEFAULT_PREFERENCES.notifications;
    }

    if (typeof validated.resultsPerPage !== 'number' ||
        validated.resultsPerPage < MIN_RESULTS_PER_PAGE ||
        validated.resultsPerPage > MAX_RESULTS_PER_PAGE) {
      validated.resultsPerPage = DEFAULT_PREFERENCES.resultsPerPage;
    }

    return validated;
  }

  updatePreferences(updates: Partial<UserPreferences>): UserPreferences {
    this.preferences = this.validatePreferences({
      ...this.preferences,
      ...updates
    });
    return this.getPreferences();
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  resetToDefaults(): UserPreferences {
    this.preferences = { ...DEFAULT_PREFERENCES };
    return this.getPreferences();
  }

  isDarkMode(): boolean {
    if (this.preferences.theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return this.preferences.theme === 'dark';
  }
}

export { UserPreferencesManager, DEFAULT_PREFERENCES };
export type { UserPreferences };