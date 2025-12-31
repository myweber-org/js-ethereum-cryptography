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
    this.preferences = { ...DEFAULT_PREFERENCES, ...initialPreferences };
    this.validateAndSanitize();
  }

  private validateAndSanitize(): void {
    if (!['light', 'dark', 'auto'].includes(this.preferences.theme)) {
      this.preferences.theme = DEFAULT_PREFERENCES.theme;
    }

    if (typeof this.preferences.notifications !== 'boolean') {
      this.preferences.notifications = DEFAULT_PREFERENCES.notifications;
    }

    if (!VALID_LANGUAGES.includes(this.preferences.language)) {
      this.preferences.language = DEFAULT_PREFERENCES.language;
    }

    if (typeof this.preferences.resultsPerPage !== 'number' ||
        this.preferences.resultsPerPage < MIN_RESULTS_PER_PAGE ||
        this.preferences.resultsPerPage > MAX_RESULTS_PER_PAGE) {
      this.preferences.resultsPerPage = DEFAULT_PREFERENCES.resultsPerPage;
    }
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    const previousPreferences = { ...this.preferences };
    this.preferences = { ...this.preferences, ...updates };
    
    try {
      this.validateAndSanitize();
      this.saveToStorage();
      this.notifyListeners(previousPreferences, this.preferences);
    } catch (error) {
      this.preferences = previousPreferences;
      throw new Error('Failed to update preferences: ' + (error as Error).message);
    }
  }

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  resetToDefaults(): void {
    this.updatePreferences(DEFAULT_PREFERENCES);
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem('userPreferences', JSON.stringify(this.preferences));
    } catch (error) {
      console.warn('Failed to save preferences to localStorage:', error);
    }
  }

  static loadFromStorage(): UserPreferencesManager {
    try {
      const stored = localStorage.getItem('userPreferences');
      if (stored) {
        const parsed = JSON.parse(stored);
        return new UserPreferencesManager(parsed);
      }
    } catch (error) {
      console.warn('Failed to load preferences from storage:', error);
    }
    return new UserPreferencesManager();
  }

  private listeners: Set<(oldPrefs: UserPreferences, newPrefs: UserPreferences) => void> = new Set();

  addChangeListener(listener: (oldPrefs: UserPreferences, newPrefs: UserPreferences) => void): void {
    this.listeners.add(listener);
  }

  removeChangeListener(listener: (oldPrefs: UserPreferences, newPrefs: UserPreferences) => void): void {
    this.listeners.delete(listener);
  }

  private notifyListeners(oldPrefs: UserPreferences, newPrefs: UserPreferences): void {
    this.listeners.forEach(listener => {
      try {
        listener(oldPrefs, newPrefs);
      } catch (error) {
        console.error('Error in preferences change listener:', error);
      }
    });
  }
}

export { UserPreferencesManager, DEFAULT_PREFERENCES };
export type { UserPreferences };