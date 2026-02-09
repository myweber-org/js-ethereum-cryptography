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
const VALID_RESULTS_PER_PAGE = [10, 20, 50, 100];

function validatePreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const validated = { ...DEFAULT_PREFERENCES, ...prefs };
  
  if (!['light', 'dark', 'auto'].includes(validated.theme)) {
    validated.theme = DEFAULT_PREFERENCES.theme;
  }
  
  if (!VALID_LANGUAGES.includes(validated.language)) {
    validated.language = DEFAULT_PREFERENCES.language;
  }
  
  if (!VALID_RESULTS_PER_PAGE.includes(validated.resultsPerPage)) {
    validated.resultsPerPage = DEFAULT_PREFERENCES.resultsPerPage;
  }
  
  return validated;
}

function savePreferences(prefs: Partial<UserPreferences>): void {
  const validated = validatePreferences(prefs);
  localStorage.setItem('userPreferences', JSON.stringify(validated));
}

function loadPreferences(): UserPreferences {
  const stored = localStorage.getItem('userPreferences');
  if (!stored) return DEFAULT_PREFERENCES;
  
  try {
    const parsed = JSON.parse(stored);
    return validatePreferences(parsed);
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export { UserPreferences, validatePreferences, savePreferences, loadPreferences };
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

class PreferenceManager {
  private preferences: UserPreferences;

  constructor(initialPreferences?: Partial<UserPreferences>) {
    this.preferences = { ...DEFAULT_PREFERENCES, ...initialPreferences };
    this.validatePreferences();
  }

  private validatePreferences(): void {
    if (!['light', 'dark', 'auto'].includes(this.preferences.theme)) {
      throw new Error(`Invalid theme: ${this.preferences.theme}`);
    }

    if (this.preferences.resultsPerPage < 5 || this.preferences.resultsPerPage > 100) {
      throw new Error(`Results per page must be between 5 and 100, got: ${this.preferences.resultsPerPage}`);
    }

    if (typeof this.preferences.notifications !== 'boolean') {
      throw new Error(`Notifications must be boolean, got: ${this.preferences.notifications}`);
    }
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    const newPreferences = { ...this.preferences, ...updates };
    const tempManager = new PreferenceManager(newPreferences);
    this.preferences = tempManager.getPreferences();
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  resetToDefaults(): void {
    this.preferences = { ...DEFAULT_PREFERENCES };
  }

  isDarkMode(): boolean {
    if (this.preferences.theme === 'dark') return true;
    if (this.preferences.theme === 'light') return false;
    
    // Auto mode: check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
}

export { PreferenceManager, type UserPreferences };