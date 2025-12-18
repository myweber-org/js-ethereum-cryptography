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
    this.validateAndFixPreferences();
  }

  private validateAndFixPreferences(): void {
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
    this.validateAndFixPreferences();

    if (JSON.stringify(previousPreferences) !== JSON.stringify(this.preferences)) {
      this.saveToStorage();
      this.notifyListeners();
    }
  }

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  resetToDefaults(): void {
    this.preferences = { ...DEFAULT_PREFERENCES };
    this.saveToStorage();
    this.notifyListeners();
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem('userPreferences', JSON.stringify(this.preferences));
    } catch (error) {
      console.warn('Failed to save preferences to localStorage:', error);
    }
  }

  private listeners: Set<() => void> = new Set();

  addChangeListener(listener: () => void): void {
    this.listeners.add(listener);
  }

  removeChangeListener(listener: () => void): void {
    this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }

  static loadFromStorage(): UserPreferencesManager {
    try {
      const stored = localStorage.getItem('userPreferences');
      if (stored) {
        const parsed = JSON.parse(stored);
        return new UserPreferencesManager(parsed);
      }
    } catch (error) {
      console.warn('Failed to load preferences from localStorage:', error);
    }
    return new UserPreferencesManager();
  }
}

export { UserPreferencesManager, DEFAULT_PREFERENCES };