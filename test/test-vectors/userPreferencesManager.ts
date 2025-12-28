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

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): boolean {
    const newPreferences = { ...this.preferences, ...updates };
    
    if (this.validatePreferences(newPreferences)) {
      this.preferences = newPreferences;
      this.saveToStorage();
      return true;
    }
    
    return false;
  }

  resetToDefaults(): void {
    this.preferences = { ...DEFAULT_PREFERENCES };
    this.saveToStorage();
  }

  private validatePreferences(prefs: UserPreferences): boolean {
    if (!['light', 'dark', 'auto'].includes(prefs.theme)) {
      return false;
    }

    if (typeof prefs.notifications !== 'boolean') {
      return false;
    }

    if (!VALID_LANGUAGES.includes(prefs.language)) {
      return false;
    }

    if (!Number.isInteger(prefs.resultsPerPage) || 
        prefs.resultsPerPage < MIN_RESULTS_PER_PAGE || 
        prefs.resultsPerPage > MAX_RESULTS_PER_PAGE) {
      return false;
    }

    return true;
  }

  private validateAndFixPreferences(): void {
    if (!this.validatePreferences(this.preferences)) {
      console.warn('Invalid preferences detected, applying defaults');
      this.preferences = { ...DEFAULT_PREFERENCES };
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem('userPreferences', JSON.stringify(this.preferences));
    } catch (error) {
      console.error('Failed to save preferences to storage:', error);
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
      console.error('Failed to load preferences from storage:', error);
    }
    
    return new UserPreferencesManager();
  }
}

export { UserPreferencesManager, DEFAULT_PREFERENCES };
export type { UserPreferences };