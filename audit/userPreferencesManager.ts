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
    this.preferences = this.validateAndMerge(
      initialPreferences || {}, 
      DEFAULT_PREFERENCES
    );
  }

  private validateAndMerge(
    partialPrefs: Partial<UserPreferences>, 
    defaults: UserPreferences
  ): UserPreferences {
    const merged: UserPreferences = { ...defaults };

    if (partialPrefs.theme && ['light', 'dark', 'auto'].includes(partialPrefs.theme)) {
      merged.theme = partialPrefs.theme;
    }

    if (typeof partialPrefs.notifications === 'boolean') {
      merged.notifications = partialPrefs.notifications;
    }

    if (partialPrefs.language && VALID_LANGUAGES.includes(partialPrefs.language)) {
      merged.language = partialPrefs.language;
    }

    if (typeof partialPrefs.resultsPerPage === 'number') {
      merged.resultsPerPage = Math.max(
        MIN_RESULTS_PER_PAGE,
        Math.min(MAX_RESULTS_PER_PAGE, partialPrefs.resultsPerPage)
      );
    }

    return merged;
  }

  updatePreferences(newPreferences: Partial<UserPreferences>): UserPreferences {
    this.preferences = this.validateAndMerge(newPreferences, this.preferences);
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

export { UserPreferencesManager, DEFAULT_PREFERENCES, VALID_LANGUAGES };