typescript
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

  constructor() {
    this.preferences = this.loadPreferences();
  }

  private loadPreferences(): UserPreferences {
    const stored = localStorage.getItem('userPreferences');
    
    if (!stored) {
      return { ...DEFAULT_PREFERENCES };
    }

    try {
      const parsed = JSON.parse(stored);
      return this.validateAndMergePreferences(parsed);
    } catch {
      return { ...DEFAULT_PREFERENCES };
    }
  }

  private validateAndMergePreferences(partial: Partial<UserPreferences>): UserPreferences {
    const merged = { ...DEFAULT_PREFERENCES, ...partial };

    if (!['light', 'dark', 'auto'].includes(merged.theme)) {
      merged.theme = DEFAULT_PREFERENCES.theme;
    }

    if (typeof merged.notifications !== 'boolean') {
      merged.notifications = DEFAULT_PREFERENCES.notifications;
    }

    if (!VALID_LANGUAGES.includes(merged.language)) {
      merged.language = DEFAULT_PREFERENCES.language;
    }

    if (typeof merged.resultsPerPage !== 'number' || 
        merged.resultsPerPage < MIN_RESULTS_PER_PAGE || 
        merged.resultsPerPage > MAX_RESULTS_PER_PAGE) {
      merged.resultsPerPage = DEFAULT_PREFERENCES.resultsPerPage;
    }

    return merged;
  }

  updatePreferences(updates: Partial<UserPreferences>): boolean {
    const newPreferences = this.validateAndMergePreferences(updates);
    
    if (JSON.stringify(this.preferences) === JSON.stringify(newPreferences)) {
      return false;
    }

    this.preferences = newPreferences;
    this.savePreferences();
    return true;
  }

  private savePreferences(): void {
    localStorage.setItem('userPreferences', JSON.stringify(this.preferences));
  }

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  resetToDefaults(): void {
    this.preferences = { ...DEFAULT_PREFERENCES };
    this.savePreferences();
  }

  getTheme(): string {
    if (this.preferences.theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return this.preferences.theme;
  }
}

export const userPreferences = new UserPreferencesManager();
```